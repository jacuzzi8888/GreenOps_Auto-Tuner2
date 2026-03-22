import { isAgentAuthored, AGENT_COMMIT_TAG } from '../src/app';
import { GitLabWebhookPayload } from '../src/types';

// Mock all external dependencies that app.ts imports
jest.mock('../src/gitlab', () => ({
    fetchMrChanges: jest.fn(),
    filterInfraFiles: jest.fn(),
    postMrComment: jest.fn(),
}));
jest.mock('../src/analyzer', () => ({ analyzeInfraChanges: jest.fn() }));
jest.mock('../src/apply', () => ({ commitOptimizedFile: jest.fn() }));
jest.mock('../src/audit', () => ({ logAudit: jest.fn(), createPayloadHash: jest.fn().mockReturnValue('hash') }));

describe('Task G6: Loop Prevention', () => {

    function makePayload(lastCommit?: { message: string; author_email: string }): GitLabWebhookPayload {
        return {
            object_kind: 'merge_request',
            project: { id: 1, name: 'test', web_url: '' },
            object_attributes: {
                iid: 10,
                action: 'update',
                state: 'opened',
                source_branch: 'feature',
                target_branch: 'main',
                title: 'Test MR',
                last_commit: lastCommit ? {
                    id: 'abc123',
                    message: lastCommit.message,
                    author_email: lastCommit.author_email,
                    author_name: 'Test',
                } : undefined,
            },
        };
    }

    it('should return true when commit message contains the agent tag', () => {
        const payload = makePayload({
            message: `${AGENT_COMMIT_TAG} Optimize infra/main.tf`,
            author_email: 'dev@example.com',
        });
        expect(isAgentAuthored(payload)).toBe(true);
    });

    it('should return true when commit author email matches AGENT_COMMIT_EMAIL', () => {
        process.env.AGENT_COMMIT_EMAIL = 'bot@greenops.io';
        const payload = makePayload({
            message: 'Normal commit message',
            author_email: 'bot@greenops.io',
        });
        expect(isAgentAuthored(payload)).toBe(true);
        delete process.env.AGENT_COMMIT_EMAIL;
    });

    it('should return false for a normal developer commit', () => {
        const payload = makePayload({
            message: 'Add new feature',
            author_email: 'dev@example.com',
        });
        expect(isAgentAuthored(payload)).toBe(false);
    });

    it('should return false when last_commit is undefined', () => {
        const payload = makePayload(undefined);
        expect(isAgentAuthored(payload)).toBe(false);
    });
});
