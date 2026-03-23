import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';
import { analyzeInfraChanges } from './analyzer';
import { getLiveGcpPrice } from './pricing';
import { commitOptimizedFile } from './apply';
import { logAudit, createPayloadHash } from './audit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const mcpServer = new McpServer({
  name: "GreenOps Auto-Tuner",
  version: "1.0.0"
});

// Configure Google Cloud Pricing Tool
mcpServer.tool(
  "get_gcp_pricing",
  "Fetches live Google Cloud Compute Engine pricing via the GCP Billing API.",
  {
    machineType: z.string().describe("GCP machine type or SKU (e.g. 'e2-micro', 'c3-standard-4')"),
    region: z.string().default('us-central1').describe("GCP Region mapping")
  },
  async ({ machineType, region }) => {
    const result = await getLiveGcpPrice(machineType, region as string);
    if (!result.found) {
      return { content: [{ type: "text", text: `Pricing not found: ${result.reason}` }] };
    }
    return { content: [{ type: "text", text: JSON.stringify({ entry: result.entry, needsReview: result.needsReview }) }] };
  }
);

// Configure Terraform Carbon Analyzer Tool
mcpServer.tool(
  "analyze_infrastructure",
  "Analyzes Terraform changes for carbon/cost savings using Gemini 3.0 Flash. Returns JSON optimizations.",
  {
    project_id: z.number().optional().describe("GitLab Project ID"),
    mr_iid: z.number().optional().describe("GitLab Merge Request IID"),
    files: z.array(
      z.object({
        new_path: z.string(),
        old_path: z.string().optional(),
        diff: z.string()
      })
    ).describe("Array of changed file paths and text diffs.")
  },
  async ({ project_id, mr_iid, files }) => {
    const hash = createPayloadHash(files);
    
    try {
        const proposals = await analyzeInfraChanges(files as any);
        
        // Fire and forget audit log
        logAudit({
            event: 'analyze_infrastructure',
            projectId: (project_id as number) || 0,
            mrIid: (mr_iid as number) || 0,
            proposalCount: proposals.length,
            appliedCount: 0,
            timestamp: new Date().toISOString(),
            payloadHash: hash,
            result: proposals.length > 0 ? 'success' : 'no_infra'
        }).catch(console.error);

        return { content: [{ type: "text", text: JSON.stringify(proposals, null, 2) }] };
    } catch (e: any) {
        logAudit({
            event: 'analyze_infrastructure',
            projectId: (project_id as number) || 0,
            mrIid: (mr_iid as number) || 0,
            proposalCount: 0,
            appliedCount: 0,
            timestamp: new Date().toISOString(),
            payloadHash: hash,
            result: 'analysis_error'
        }).catch(console.error);
        return { content: [{ type: "text", text: `Error: ${e.message}` }] };
    }
  }
);

// Configure Apply Optimization Tool
mcpServer.tool(
  "apply_infrastructure_optimization",
  "Commits an optimized infrastructure file directly to the GitLab Merge Request branch. Requires APPLY_MODE=true.",
  {
    project_id: z.number().describe("GitLab Project ID"),
    branch: z.string().describe("Source branch name for the MR"),
    file_path: z.string().describe("Path of the file to update"),
    new_content: z.string().describe("The complete, modified file content (obtained from the analyzer)"),
    confidence: z.number().describe("The confidence score given by the analyzer (0.0 to 1.0)"),
    commit_message: z.string().default("Apply GreenOps auto-tuner optimizations").describe("Commit message")
  },
  async ({ project_id, branch, file_path, new_content, confidence, commit_message }) => {
    try {
        await commitOptimizedFile(project_id, branch, file_path, new_content, commit_message as string, confidence);
        return { content: [{ type: "text", text: `Successfully committed ${file_path} to branch ${branch}.` }] };
    } catch (e: any) {
        return { content: [{ type: "text", text: `Error committing file: ${e.message}` }] };
    }
  }
);

// SSE Transports for multiple concurrent sessions
const transports = new Map<string, SSEServerTransport>();

// Simple Bearer authentication middleware
const mcpAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = process.env.MCP_API_TOKEN;
  if (!token) {
    console.warn('⚠️ MCP_API_TOKEN is not configured. Rejecting request to prevent unauthenticated access.');
    res.status(401).json({ error: 'Unauthorized. Server missing MCP_API_TOKEN config.' });
    return;
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${token}`) {
    res.status(401).json({ error: 'Unauthorized. Invalid Bearer token.' });
    return;
  }
  next();
};

// The endpoint GitLab connects to to establish the event stream
app.get('/sse', mcpAuth, async (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    res.status(400).json({ error: "Missing sessionId query parameter." });
    return;
  }

  const transport = new SSEServerTransport('/message?sessionId=' + sessionId, res);
  transports.set(sessionId, transport);

  req.on('close', () => {
    transports.delete(sessionId);
  });

  await mcpServer.server.connect(transport);
});

// The endpoint GitLab posts client messages to
app.post('/message', mcpAuth, async (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    res.status(400).json({ error: "Missing sessionId query parameter." });
    return;
  }

  const transport = transports.get(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(404).json({ error: "Session not found or SSE Transport not initialized. Please connect to /sse first." });
  }
});

// Basic ping for healthchecks
app.get('/health', (req, res) => res.json({ status: 'ok', type: 'MCP Server' }));

export default app;
