import request from 'supertest';
import app from '../src/app';

jest.mock('../src/gitlab', () => ({
  fetchMrChanges: jest.fn().mockResolvedValue({ changes: [] }),
  filterInfraFiles: jest.fn().mockReturnValue([]),
  fetchFileContent: jest.fn().mockResolvedValue('mock content'),
  postMrComment: jest.fn().mockResolvedValue({ id: 1, body: 'mock', created_at: '2026-01-01' })
}));

describe('Webhook Ingress Service', () => {

  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 401 if X-Gitlab-Token is missing', async () => {
    process.env.GITLAB_WEBHOOK_TOKEN = 'test_token';
    const res = await request(app)
      .post('/webhook/gitlab')
      .send({ object_kind: 'merge_request' });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Unauthorized');
  });

  it('should return 401 if X-Gitlab-Token is invalid', async () => {
    process.env.GITLAB_WEBHOOK_TOKEN = 'test_token';
    const res = await request(app)
      .post('/webhook/gitlab')
      .set('X-Gitlab-Token', 'wrong_token')
      .send({ object_kind: 'merge_request' });

    expect(res.status).toBe(401);
  });

  it('should return 500 if GITLAB_WEBHOOK_TOKEN is not configured on server', async () => {
    // Delete the expected token from env
    delete process.env.GITLAB_WEBHOOK_TOKEN;
    const res = await request(app)
      .post('/webhook/gitlab')
      .set('X-Gitlab-Token', 'any_token')
      .send({ object_kind: 'merge_request' });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain('configuration error');
  });

  it('should return 200 and ignore non-merge_request events', async () => {
    process.env.GITLAB_WEBHOOK_TOKEN = 'test_token';
    const res = await request(app)
      .post('/webhook/gitlab')
      .set('X-Gitlab-Token', 'test_token')
      .send({ object_kind: 'push' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('ignored');
  });

  it('should return 200 and process valid opened merge_request events', async () => {
    process.env.GITLAB_WEBHOOK_TOKEN = 'test_token';
    const res = await request(app)
      .post('/webhook/gitlab')
      .set('X-Gitlab-Token', 'test_token')
      .send({ 
          object_kind: 'merge_request',
          object_attributes: { iid: 123, action: 'open', state: 'opened' },
          project: { id: 456 }
       });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('comment posted');
    expect(res.body.mr_iid).toBe(123);
    expect(res.body.project_id).toBe(456);
    expect(res.body.comment_posted).toBe(true);
  });
});
