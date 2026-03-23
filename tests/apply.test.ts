import { commitOptimizedFile } from '../src/apply';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Task G7: Apply Mode', () => {

    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv, APPLY_MODE: 'true' };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should throw error if GITLAB_API_TOKEN is missing', async () => {
        delete process.env.GITLAB_API_TOKEN;
        await expect(
            commitOptimizedFile(1, 'feature', 'main.tf', 'content', 'msg', 0.9)
        ).rejects.toThrow('GITLAB_API_TOKEN is not configured');
    });

    it('should commit an optimized file via the GitLab Commits API', async () => {
        process.env.GITLAB_API_TOKEN = 'test_token';
        mockedAxios.post.mockResolvedValueOnce({ data: { id: 'commit_sha' } });

        await commitOptimizedFile(
            42,
            'feature-branch',
            'infra/main.tf',
            'resource "aws_instance" "web" { instance_type = "t3.small" }',
            '[greenops-autotuner] Optimize infra/main.tf',
            0.9
        );

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://gitlab.com/api/v4/projects/42/repository/commits',
            {
                branch: 'feature-branch',
                commit_message: '[greenops-autotuner] Optimize infra/main.tf',
                actions: [
                    {
                        action: 'update',
                        file_path: 'infra/main.tf',
                        content: 'resource "aws_instance" "web" { instance_type = "t3.small" }',
                    }
                ]
            },
            expect.objectContaining({ headers: { 'PRIVATE-TOKEN': 'test_token' } })
        );
    });

    it('should propagate errors from the GitLab API', async () => {
        process.env.GITLAB_API_TOKEN = 'test_token';
        mockedAxios.post.mockRejectedValueOnce(new Error('403 Forbidden'));

        await expect(
            commitOptimizedFile(1, 'feature', 'main.tf', 'content', 'msg', 0.9)
        ).rejects.toThrow('403 Forbidden');
    });
    it('should throw error if confidence is below 0.8', async () => {
        process.env.GITLAB_API_TOKEN = 'test_token';
        await expect(
            commitOptimizedFile(1, 'feature', 'main.tf', 'content', 'msg', 0.7)
        ).rejects.toThrow('Confidence score 0.7 is below the strict 0.8 threshold required for automated commits.');
    });

    it('should throw error if APPLY_MODE is false', async () => {
        process.env.APPLY_MODE = 'false';
        process.env.GITLAB_API_TOKEN = 'test_token';
        await expect(
            commitOptimizedFile(1, 'feature', 'main.tf', 'content', 'msg', 0.9)
        ).rejects.toThrow('APPLY_MODE is disabled in server configuration.');
    });
});
