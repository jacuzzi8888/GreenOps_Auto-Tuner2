import { formatAnalysisComment, formatNoInfraComment } from '../src/comment';
import { postMrComment } from '../src/gitlab';
import axios from 'axios';
import { GitLabChange } from '../src/types';

// Mock axios for postMrComment tests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Comment Formatting', () => {

    it('should format an analysis comment with infra file list', () => {
        const mockFiles: GitLabChange[] = [
            { new_path: 'infra/main.tf', old_path: 'infra/main.tf', a_mode: '', b_mode: '', new_file: false, renamed_file: false, deleted_file: false, diff: '' },
            { new_path: 'deploy/config.yaml', old_path: 'deploy/config.yaml', a_mode: '', b_mode: '', new_file: false, renamed_file: false, deleted_file: false, diff: '' },
        ];

        const comment = formatAnalysisComment(mockFiles);

        expect(comment).toContain('GreenOps Auto-Tuner');
        expect(comment).toContain('2 infrastructure file(s)');
        expect(comment).toContain('`infra/main.tf`');
        expect(comment).toContain('`deploy/config.yaml`');
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
