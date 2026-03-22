import axios from 'axios';

const GITLAB_API_BASE = process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4';

/**
 * Task G7: Apply Mode
 * Commits an optimized file to the MR's source branch via the GitLab Commits API.
 * Only called when APPLY_MODE=true and proposal.confidence >= 0.8.
 */
export async function commitOptimizedFile(
    projectId: number,
    branch: string,
    filePath: string,
    newContent: string,
    commitMessage: string
): Promise<void> {
    const token = process.env.GITLAB_API_TOKEN;
    if (!token) {
        throw new Error('GITLAB_API_TOKEN is not configured');
    }

    try {
        await axios.post(
            `${GITLAB_API_BASE}/projects/${projectId}/repository/commits`,
            {
                branch,
                commit_message: commitMessage,
                actions: [
                    {
                        action: 'update',
                        file_path: filePath,
                        content: newContent,
                    }
                ]
            },
            { headers: { 'PRIVATE-TOKEN': token } }
        );
        console.log(`[Apply] Committed optimized ${filePath} to branch ${branch}`);
    } catch (error: any) {
        console.error(`[Apply] Error committing ${filePath}:`, error.message);
        throw error;
    }
}
