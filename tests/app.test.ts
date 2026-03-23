import request from 'supertest';
import app from '../src/app';

describe('MCP Express Application Tests', () => {

    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv, MCP_API_TOKEN: 'test_token' };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('GET /health returns OK', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    it('GET /sse missing sessionId -> 400', async () => {
        const res = await request(app)
            .get('/sse')
            .set('Authorization', 'Bearer test_token');
        expect(res.status).toBe(400);
    });

    it('GET /sse missing auth -> 401', async () => {
        const res = await request(app)
            .get('/sse?sessionId=123');
        expect(res.status).toBe(401);
    });

    it('POST /message missing auth -> 401', async () => {
        const res = await request(app)
            .post('/message?sessionId=123')
            .send({});
        expect(res.status).toBe(401);
    });

    it('POST /message targeting unknown session -> 404', async () => {
        const res = await request(app)
            .post('/message?sessionId=unknown')
            .set('Authorization', 'Bearer test_token')
            .send({});
        expect(res.status).toBe(404);
    });
});
