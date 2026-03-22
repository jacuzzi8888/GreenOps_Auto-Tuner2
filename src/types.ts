/**
 * TypeScript interfaces for GitLab API responses.
 * Provides type safety for webhook payloads and API calls.
 */

/** A single file change within a Merge Request diff. */
export interface GitLabChange {
    old_path: string;
    new_path: string;
    a_mode: string;
    b_mode: string;
    new_file: boolean;
    renamed_file: boolean;
    deleted_file: boolean;
    diff: string;
}

/** The response from GET /projects/:id/merge_requests/:iid/changes */
export interface MrChangesResponse {
    id: number;
    iid: number;
    title: string;
    source_branch: string;
    target_branch: string;
    state: string;
    changes: GitLabChange[];
}

/** The project object nested in a webhook payload. */
export interface GitLabProject {
    id: number;
    name: string;
    web_url: string;
}

/** The object_attributes for a merge_request webhook event. */
export interface MrAttributes {
    iid: number;
    action: string;
    state: string;
    source_branch: string;
    target_branch: string;
    title: string;
    last_commit?: {
        id: string;
        message: string;
        author_email: string;
        author_name: string;
    };
}

/** The top-level GitLab Merge Request webhook payload. */
export interface GitLabWebhookPayload {
    object_kind: string;
    project: GitLabProject;
    object_attributes: MrAttributes;
}

/** The response from POST /projects/:id/merge_requests/:iid/notes */
export interface MrNoteResponse {
    id: number;
    body: string;
    created_at: string;
}

/** 
 * Phase 2: Pricing & Analysis Types
 */

export interface PricingEntry {
    sku: string;
    region: string;
    pricePerHour: number;
    pricePerMonth: number;
    currency: string;
    source: string;
}

export interface PricingResult {
    found: boolean;
    entry?: PricingEntry;
    needsReview: boolean;
    reason?: string;
}

export interface SavingsEstimate {
    currency: string;
    monthly: number;
    source: string;
}

export interface CarbonEstimate {
    unit: string;
    monthly: number;
}

export interface AnalysisProposal {
    file_path: string;
    new_content?: string;
    explanation: string;
    evidence: string;
    estimated_savings?: SavingsEstimate;
    estimated_carbon_delta?: CarbonEstimate;
    confidence: number;
    needs_review?: boolean;
}
