import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { fetchMrChanges, filterInfraFiles, postMrComment } from './gitlab';
import { GitLabWebhookPayload } from './types';
import { formatAnalysisComment, formatNoInfraComment } from './comment';

dotenv.config();

const app = express();

app.use(express.json());

// Token validation middleware
const validateGitlabToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('X-Gitlab-Token');
  const expectedToken = process.env.GITLAB_WEBHOOK_TOKEN;

  if (!expectedToken) {
    console.warn('GITLAB_WEBHOOK_TOKEN is not set in environment variables.');
    return res.status(500).json({ error: 'Server configuration error: Webhook token not set' });
  }

  if (!token || token !== expectedToken) {
    console.log(`[Auth] Rejected webhook request. Provided token: ${token ? '***' : 'None'}`);
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing X-Gitlab-Token' });
  }

  next();
};

app.get('/health', (req, res) => {
    res.json({status: 'ok'});
});

// Webhook Ingress
app.post('/webhook/gitlab', validateGitlabToken, async (req: Request, res: Response) => {
  try {
    const payload = req.body as GitLabWebhookPayload;
    
    // Check if it's an MR event
    if (payload.object_kind !== 'merge_request') {
        console.log(`[Webhook] Ignored non-MR event type: ${payload.object_kind}`);
        return res.status(200).json({ message: 'Event ignored' });
    }

    const mrAttributes = payload.object_attributes;
    const projectId = payload.project?.id;
    const mrIid = mrAttributes?.iid;
    const action = mrAttributes?.action;
    const state = mrAttributes?.state;

    // We typically care about open or updated MRs
    if (state !== 'opened') {
        console.log(`[Webhook] Ignored MR state: ${state}`);
        return res.status(200).json({ message: `Ignored MR state: ${state}` });
    }

    console.log(`[Webhook] Received valid MR event: Project ${projectId}, MR !${mrIid}, Action: ${action}`);

    // Task G2: MR Data Retrieval
    try {
        const mrData = await fetchMrChanges(projectId, mrIid);
        const changedFiles = mrData.changes;
        
        console.log(`[GitLab] !${mrIid} contains ${changedFiles.length} changed files.`);
        
        const infraFiles = filterInfraFiles(changedFiles);
        console.log(`[GitLab] !${mrIid} contains ${infraFiles.length} supported infra files.`);
        
        // Task G3: Post MR Comment
        const commentBody = infraFiles.length > 0
            ? formatAnalysisComment(infraFiles)
            : formatNoInfraComment();

        await postMrComment(projectId, mrIid, commentBody);
        console.log(`[Webhook] Comment posted to MR !${mrIid}`);

        res.status(200).json({ 
            message: 'Webhook processed and comment posted',
            project_id: projectId,
            mr_iid: mrIid,
            infra_files_count: infraFiles.length,
            comment_posted: true
        });
    } catch (apiError: any) {
        console.error(`[GitLab API Error] Failed to process MR !${mrIid}:`, apiError.message);
        res.status(200).json({ message: 'Webhook received, but failed to process MR data', comment_posted: false });
    }

  } catch (error) {
    console.error(`[Webhook Error] Failed to process payload:`, error);
    res.status(500).json({ error: 'Internal server error processing webhook' });
  }
});

export default app;
