import axios from 'axios';
import { GitLabChange, MrChangesResponse, MrNoteResponse } from './types';

// Required env variables:
// GITLAB_API_TOKEN - For calling GitLab APIs

const GITLAB_API_BASE = process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4';

/**
 * Fetch the change diffs for a specific Merge Request.
 * Returns the list of changed files.
 */
export async function fetchMrChanges(projectId: number, mrIid: number): Promise<MrChangesResponse> {
    const token = process.env.GITLAB_API_TOKEN;
    if (!token) {
        throw new Error('GITLAB_API_TOKEN is not configured');
    }

    try {
        const response = await axios.get(`${GITLAB_API_BASE}/projects/${projectId}/merge_requests/${mrIid}/changes`, {
            headers: { 'PRIVATE-TOKEN': token }
        });
        return response.data;
    } catch (error) {
        console.error(`[GitLab API] Error fetching MR changes for !${mrIid}:`, error);
        throw error;
    }
}

/**
 * Filter the MR changes to only include supported Infrastructure-as-Code files.
 * Supported: .tf and .yaml/.yml
 */
export function filterInfraFiles(changes: GitLabChange[]): GitLabChange[] {
    if (!changes || !Array.isArray(changes)) return [];
    
    return changes.filter(change => {
        const path = change.new_path || change.old_path;
        return path.endsWith('.tf') || path.endsWith('.yaml') || path.endsWith('.yml');
    });
}

/**
 * Fetch the full content of a file at a specific branch/ref.
 */
export async function fetchFileContent(projectId: number, filePath: string, ref: string): Promise<string> {
    const token = process.env.GITLAB_API_TOKEN;
    if (!token) {
        throw new Error('GITLAB_API_TOKEN is not configured');
    }

    try {
        // GitLab API requires the file path to be URL-encoded
        const encodedPath = encodeURIComponent(filePath);
        const response = await axios.get(`${GITLAB_API_BASE}/projects/${projectId}/repository/files/${encodedPath}/raw?ref=${ref}`, {
            headers: { 'PRIVATE-TOKEN': token }
        });
        
        // Axios parses JSON automatically, but for raw files we want the string
        return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    } catch (error) {
        console.error(`[GitLab API] Error fetching file content for ${filePath}:`, error);
        throw error;
    }
}

/**
 * Post a comment (note) to a GitLab Merge Request.
 * Uses the GitLab Notes API: POST /projects/:id/merge_requests/:iid/notes
 */
export async function postMrComment(projectId: number, mrIid: number, body: string): Promise<MrNoteResponse> {
    const token = process.env.GITLAB_API_TOKEN;
    if (!token) {
        throw new Error('GITLAB_API_TOKEN is not configured');
    }

    try {
        const response = await axios.post(
            `${GITLAB_API_BASE}/projects/${projectId}/merge_requests/${mrIid}/notes`,
            { body },
            { headers: { 'PRIVATE-TOKEN': token } }
        );
        console.log(`[GitLab API] Comment posted to MR !${mrIid} (note id: ${response.data.id})`);
        return response.data;
    } catch (error) {
        console.error(`[GitLab API] Error posting comment to MR !${mrIid}:`, error);
        throw error;
    }
}
