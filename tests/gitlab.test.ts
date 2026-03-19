import { filterInfraFiles, fetchMrChanges, fetchFileContent } from '../src/gitlab';
import axios from 'axios';

// Mock axios for API tests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GitLab API Integration', () => {

  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('filterInfraFiles', () => {
    it('should filter only .tf and .yaml files', () => {
      const mockChanges = [
        { new_path: 'infra/main.tf' },
        { new_path: 'src/app.ts' },
        { new_path: 'deploy/config.yaml' },
        { new_path: 'scripts/run.sh' },
        { new_path: 'k8s/deployment.yml' }
      ];

      const result = filterInfraFiles(mockChanges);
      
      expect(result).toHaveLength(3);
      expect(result[0].new_path).toBe('infra/main.tf');
      expect(result[1].new_path).toBe('deploy/config.yaml');
      expect(result[2].new_path).toBe('k8s/deployment.yml');
    });

    it('should return empty array for invalid input', () => {
        expect(filterInfraFiles([])).toEqual([]);
        expect(filterInfraFiles(null as any)).toEqual([]);
    });
  });

  describe('fetchMrChanges', () => {
    it('should throw error if GITLAB_API_TOKEN is missing', async () => {
        delete process.env.GITLAB_API_TOKEN;
        await expect(fetchMrChanges(1, 2)).rejects.toThrow('GITLAB_API_TOKEN is not configured');
    });

    it('should fetch changes successfully', async () => {
        process.env.GITLAB_API_TOKEN = 'test_token';
        mockedAxios.get.mockResolvedValueOnce({ data: { changes: [{ new_path: 'test.tf' }] } });
        
        const result = await fetchMrChanges(1, 2);
        
        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://gitlab.com/api/v4/projects/1/merge_requests/2/changes',
            expect.objectContaining({ headers: { 'PRIVATE-TOKEN': 'test_token' } })
        );
        expect(result.changes[0].new_path).toBe('test.tf');
    });
  });

  describe('fetchFileContent', () => {
      it('should fetch raw file contents successfully', async () => {
          process.env.GITLAB_API_TOKEN = 'test_token';
          mockedAxios.get.mockResolvedValueOnce({ data: 'resource "aws_s3_bucket" "test" {}' });
          
          const result = await fetchFileContent(1, 'infra/main.tf', 'main');
          
          expect(mockedAxios.get).toHaveBeenCalledWith(
              'https://gitlab.com/api/v4/projects/1/repository/files/infra%2Fmain.tf/raw?ref=main',
              expect.objectContaining({ headers: { 'PRIVATE-TOKEN': 'test_token' }})
          );
          expect(result).toContain('aws_s3_bucket');
      });
  });
});
