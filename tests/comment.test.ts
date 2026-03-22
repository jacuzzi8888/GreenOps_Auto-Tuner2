import { formatBasicAnalysisComment, formatNoInfraComment, formatProposalComment } from '../src/comment';
import { postMrComment } from '../src/gitlab';
import axios from 'axios';

// Mock axios for postMrComment tests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Comment Formatting', () => {

    it('should format a basic analysis comment with file count', () => {
        const comment = formatBasicAnalysisComment(3);

        expect(comment).toContain('GreenOps Auto-Tuner');
        expect(comment).toContain('3 infrastructure file(s)');
    });

    it('should format a proposal comment with zero proposals', () => {
        const comment = formatProposalComment([]);
        expect(comment).toContain('already highly optimized');
    });

    it('should format a no-infra comment', () => {
        const comment = formatNoInfraComment();

        expect(comment).toContain('GreenOps Auto-Tuner');
        expect(comment).toContain('No supported infrastructure files');
    });
});

describe('postMrComment', () => {

    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should throw error if GITLAB_API_TOKEN is missing', async () => {
        delete process.env.GITLAB_API_TOKEN;
        await expect(postMrComment(1, 2, 'test body')).rejects.toThrow('GITLAB_API_TOKEN is not configured');
    });

    it('should post a comment successfully', async () => {
        process.env.GITLAB_API_TOKEN = 'test_token';
        mockedAxios.post.mockResolvedValueOnce({ data: { id: 99, body: 'test body', created_at: '2026-01-01' } });

        const result = await postMrComment(1, 42, 'test body');

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://gitlab.com/api/v4/projects/1/merge_requests/42/notes',
            { body: 'test body' },
            expect.objectContaining({ headers: { 'PRIVATE-TOKEN': 'test_token' } })
        );
        expect(result.id).toBe(99);
        expect(result.body).toBe('test body');
    });
});
