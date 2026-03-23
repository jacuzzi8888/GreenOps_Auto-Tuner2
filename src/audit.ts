import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/** Audit record stored for every MR analysis. */
export interface AuditRecord {
    event: string;
    projectId: number;
    mrIid: number;
    proposalCount: number;
    appliedCount: number;
    timestamp: string;
    payloadHash: string;
    result: 'success' | 'no_infra' | 'analysis_error' | 'api_error';
}

const AUDIT_LOG_PATH = process.env.AUDIT_LOG_PATH || 
    (process.env.VERCEL ? '/tmp/audit.log' : path.join(process.cwd(), 'audit.log'));

/**
 * Task G8: Audit Logging
 * Appends a JSON Lines entry to the audit log file.
 * Only writes when ENABLE_AUDIT_LOG=true.
 */
export async function logAudit(record: AuditRecord): Promise<void> {
    if (process.env.ENABLE_AUDIT_LOG !== 'true') {
        return;
    }

    try {
        const line = JSON.stringify(record) + '\n';
        await fs.promises.appendFile(AUDIT_LOG_PATH, line, 'utf-8');
        console.log(`[Audit] Logged ${record.event} for MR !${record.mrIid} (${record.result})`);
    } catch (error: any) {
        // Audit logging should never crash the main pipeline
        console.error(`[Audit] Failed to write audit log:`, error.message);
    }
}

/**
 * Creates a SHA-256 hash of the webhook payload for deduplication and traceability.
 */
export function createPayloadHash(payload: unknown): string {
    const serialized = JSON.stringify(payload);
    return crypto.createHash('sha256').update(serialized).digest('hex');
}
