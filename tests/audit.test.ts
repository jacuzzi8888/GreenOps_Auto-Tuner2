import * as fs from 'fs';
import { logAudit, createPayloadHash, AuditRecord } from '../src/audit';

jest.mock('fs', () => ({
    promises: {
        appendFile: jest.fn()
    }
}));
const mockedAppendFile = fs.promises.appendFile as jest.Mock;

describe('Task G8: Audit Logging', () => {

    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    const sampleRecord: AuditRecord = {
        event: 'mr_analysis',
        projectId: 42,
        mrIid: 10,
        proposalCount: 3,
        appliedCount: 1,
        timestamp: '2026-03-21T12:00:00Z',
        payloadHash: 'abc123',
        result: 'success',
    };

    it('should NOT write when ENABLE_AUDIT_LOG is not set', async () => {
        delete process.env.ENABLE_AUDIT_LOG;
        await logAudit(sampleRecord);
        expect(mockedAppendFile).not.toHaveBeenCalled();
    });

    it('should NOT write when ENABLE_AUDIT_LOG is "false"', async () => {
        process.env.ENABLE_AUDIT_LOG = 'false';
        await logAudit(sampleRecord);
        expect(mockedAppendFile).not.toHaveBeenCalled();
    });

    it('should write a JSON line when ENABLE_AUDIT_LOG is "true"', async () => {
        process.env.ENABLE_AUDIT_LOG = 'true';
        mockedAppendFile.mockResolvedValue(undefined);

        await logAudit(sampleRecord);

        expect(mockedAppendFile).toHaveBeenCalledTimes(1);
        const writtenContent = mockedAppendFile.mock.calls[0][1] as string;
        const parsed = JSON.parse(writtenContent.trim());
        expect(parsed.event).toBe('mr_analysis');
        expect(parsed.projectId).toBe(42);
        expect(parsed.result).toBe('success');
    });

    it('should not crash when file write fails', async () => {
        process.env.ENABLE_AUDIT_LOG = 'true';
        mockedAppendFile.mockRejectedValue(new Error('disk full'));

        // Should not throw
        await expect(logAudit(sampleRecord)).resolves.toBeUndefined();
    });
});

describe('createPayloadHash', () => {
    it('should return a consistent SHA-256 hash', () => {
        const payload = { object_kind: 'merge_request', project: { id: 1 } };
        const hash1 = createPayloadHash(payload);
        const hash2 = createPayloadHash(payload);
        expect(hash1).toBe(hash2);
        expect(hash1).toHaveLength(64); // SHA-256 hex length
    });

    it('should return different hashes for different payloads', () => {
        const hash1 = createPayloadHash({ a: 1 });
        const hash2 = createPayloadHash({ a: 2 });
        expect(hash1).not.toBe(hash2);
    });
});
