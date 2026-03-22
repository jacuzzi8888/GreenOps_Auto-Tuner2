import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';
import { analyzeInfraChanges } from './analyzer';
import { getLiveGcpPrice } from './pricing';
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
    return { content: [{ type: "text", text: JSON.stringify(result.entry) }] };
  }
);

// Configure Terraform Carbon Analyzer Tool
mcpServer.tool(
  "analyze_infrastructure",
  "Analyzes Terraform changes for carbon/cost savings using Gemini 3.0 Flash. Returns JSON optimizations.",
  {
    files: z.array(
      z.object({
        new_path: z.string(),
        old_path: z.string().optional(),
        diff: z.string()
      })
    ).describe("Array of changed file paths and text diffs.")
  },
  async ({ files }) => {
    try {
        const proposals = await analyzeInfraChanges(files as any);
        return { content: [{ type: "text", text: JSON.stringify(proposals, null, 2) }] };
    } catch (e: any) {
        return { content: [{ type: "text", text: `Error: ${e.message}` }] };
    }
  }
);

// SSE Transport for GitLab Duo compatibility
let transport: SSEServerTransport | null = null;

// The endpoint GitLab connects to to establish the event stream
app.get('/sse', async (req, res) => {
  transport = new SSEServerTransport('/message', res);
  await mcpServer.server.connect(transport);
});

// The endpoint GitLab posts client messages to
app.post('/message', async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(503).json({ error: "SSE Transport not initialized. Please connect to /sse first." });
  }
});

// Basic ping for healthchecks
app.get('/health', (req, res) => res.json({ status: 'ok', type: 'MCP Server' }));

export default app;
