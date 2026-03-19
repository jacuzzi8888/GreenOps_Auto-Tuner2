# GreenOps Auto-Tuner - SPEC (Full Template)

## Purpose
Provide the full product and technical spec for GreenOps Auto-Tuner.

## How to Use
Use as the single source of truth for scope and requirements.

## Template Fields
| Section | Description |
|---|---|
| Executive Summary | Value and demo outcome |
| Goals/Non-Goals | Scope control |
| Requirements | Functional + non-functional |
| Architecture | Components and flow |
| Ops | Monitoring and deployment |

## Template Sections
### Spec Sections (Template)
- Executive Summary
- Problem and Opportunity
- Goals and Non-Goals
- Functional Requirements
- Non-Functional Requirements
- Architecture
- Data Model
- APIs
- Security
- Observability

## Filled Example
# GreenOps Auto-Tuner - SPEC (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Spec (Comprehensive)

## Document Info
Version: 1.1
Last Updated: 2026-03-19
Owner: Project Team
Audience: Judges, Engineering, Product

## 1) Executive Summary
GreenOps Auto-Tuner is an event-driven agent that reviews GitLab Merge Requests containing infrastructure changes and produces verified, evidence-backed cost and carbon optimization recommendations. It turns every MR into a measurable savings checkpoint while preserving developer control through a propose-first workflow.

The demo shows a developer opening an MR, receiving a structured comment with estimated savings, evidence, and a clear change proposal, and optionally applying the change via a controlled mode switch. The system maintains an audit trail suitable for enterprise evaluation.

Vendor choices are intentionally flexible. If a hackathon rule set requires specific providers, the stack can be aligned without changing the core architecture or workflows.

## 2) Problem and Opportunity
Infra cost and carbon impact are usually discovered after deployment. Manual review is slow, inconsistent, and often misses small changes that accumulate into significant waste. MR-time feedback lets teams prevent waste before it ships and creates a permanent record of why a change was made.

## 3) Goals and Non-Goals
Goals
- Detect and analyze infra changes in .tf and .yaml files in GitLab MRs.
- Estimate cost and carbon deltas using verified pricing data.
- Provide explainable recommendations with exact evidence.
- Support propose-only by default with optional apply mode.
- Maintain an audit trail for all recommendations and actions.

Non-Goals
- No production runtime optimization or auto-scaling control.
- No full multi-cloud policy engine in v1.
- No changes outside the MR source branch in v1.

## 4) Personas and Primary Use Cases
Personas
- MR Author: wants fast, actionable suggestions with minimal disruption.
- FinOps or GreenOps Lead: wants measurable savings and traceability.
- DevOps Maintainer: wants safe changes and low noise.

Primary Use Cases
- Detect oversized instance types and suggest right-sizing.
- Identify cheaper equivalent instance families, such as ARM.
- Flag over-provisioned replicas, storage classes, or node pools.

## 5) User Journeys and Demo Flow
1. Developer opens or updates a GitLab MR that modifies infra files.
2. Webhook triggers the agent; it fetches diffs and full file contents.
3. Agent evaluates changes, verifies pricing, and drafts a proposal.
4. MR comment posts a clear summary, evidence, and estimated savings.
5. Optional: Apply mode commits the optimized change to the MR branch.
6. Audit record is stored for review and reporting.

## 6) Functional Requirements
- Validate X-Gitlab-Token on every webhook.
- Fetch MR diffs and full file contents.
- Filter for supported infra file types only.
- Run LLM analysis with tool-verified pricing data.
- Produce JSON-only structured output for patches and explanations.
- Post a formatted MR comment with evidence and estimates.
- Prevent reprocessing of agent-authored commits.
- Optional apply mode controlled by configuration.
- Handle file size limits and skip files beyond configured thresholds.
- Avoid duplicate processing by MR revision or commit SHA.

## 7) Non-Functional Requirements
- Median response time to comment under 60 seconds for typical MRs.
- P95 response time under 180 seconds.
- Idempotent processing per MR revision.
- Graceful degradation if pricing API fails.
- Rate-limit safe behavior under bursty MR activity.
- Clear error reporting without leaking secrets.

## 8) System Architecture
Components
- Ingress: GitLab MR webhook to agent service.
- Agent Service: Parses payload, fetches diffs, orchestrates analysis.
- Pricing Verification: External pricing API or local cached table.
- LLM Analysis: Generates structured proposal and rationale.
- Action Layer: Posts MR comment; optionally creates commit.
- Audit Storage: Persistent record of proposals and outcomes.

Data Flow
1. Receive webhook and validate token.
2. Fetch MR changes and identify infra files.
3. Fetch full content for each target file.
4. Build analysis prompt and call LLM.
5. Verify pricing using a tool.
6. Validate JSON output and create comment payload.
7. Post MR comment and optionally commit changes.
8. Record audit entry.

## 9) Data Model and Storage
Entity: MRAnalysis
Fields: project_id, mr_iid, revision, status, started_at, finished_at, error_code.

Entity: PricingSnapshot
Fields: sku, region, price, currency, source, retrieved_at.

Entity: Proposal
Fields: file_path, patch_type, summary, evidence, estimated_savings, estimated_carbon_delta, confidence.

Entity: AuditLog
Fields: event, actor, payload_hash, result, timestamp.

Retention
- Keep audit logs for demo duration by default.
- Configurable retention for production.

## 10) APIs and Interfaces
Inbound
- GitLab webhook POST for MR events.

Outbound GitLab APIs
- GET /projects/:id/merge_requests/:iid/changes
- GET /projects/:id/repository/files/:file_path?ref=:branch
- POST /projects/:id/merge_requests/:iid/notes
- POST /projects/:id/repository/commits

Outbound Pricing APIs
- Rule-dependent provider pricing API or local pricing table.

Auth
- GitLab token stored in secret manager.
- Pricing API key stored in secret manager.

Example LLM Output Schema
{
  "file_path": "infra/main.tf",
  "new_content": "...",
  "explanation": "...",
  "evidence": "...",
  "estimated_savings": {"currency": "USD", "monthly": 42.0, "source": "pricing_api"},
  "estimated_carbon_delta": {"unit": "kgCO2e", "monthly": -12.3},
  "confidence": 0.78
}

Error Handling
- 401 for invalid webhook token.
- 422 for unsupported file types.
- 429 for rate limits with exponential backoff.
- 502 for pricing API failures with needs-review fallback.

## 11) LLM and Agent Design
Prompt Structure
- System: FinOps or GreenOps reviewer with strict evidence requirements.
- User: MR diffs, full file contents, pricing tool access instructions.

Tooling Rules
- Any pricing or carbon claim must be tool-verified.
- If tool fails, output must be marked needs-review with no savings claim.

Validation
- Strict JSON schema validation.
- One re-prompt allowed on schema failure.
- Drop proposals that lack evidence or file_path.

Change Strategy
- Prefer minimal patch suggestions.
- Full-file rewrite only if patch is not reliable.
- Preserve formatting and run terraform fmt if available.

## 12) UI and UX Design
Primary UI
- GitLab MR comment with a clear summary and evidence.

Comment Template
- Title line with recommendation summary.
- Evidence lines quoting exact config values.
- Proposed change summary.
- Savings and carbon delta.
- Action instructions for apply mode.

Optional UI
- Lightweight dashboard listing analyzed MRs and savings totals.

## 13) Security and Privacy
- Validate webhook tokens on every request.
- Use least-privilege GitLab token with MR read or write only.
- Store secrets in managed secret manager.
- Do not persist full repo contents beyond processing unless configured.

## 14) Observability and Ops
Logs
- Structured logs per MR with correlation IDs.

Metrics
- Time to first comment.
- Success rate by MR.
- Pricing API latency.
- LLM latency.

Alerts
- Webhook failures.
- Pricing tool failures.
- Loop detection triggers.

Retries
- Exponential backoff with capped retries.
- Dead-letter logging after max retries.

## 15) Deployment and CI/CD
- Containerized service deployed to serverless runtime.
- Configuration via environment variables.
- Secrets managed by secret manager.
- CI pipeline runs tests, lint, and deploy on main.
- Rule-dependent note: swap providers to meet official hackathon requirements.

## 16) Cost and Resource Estimates
Primary Cost Drivers
- LLM usage per MR analysis.
- Pricing API calls.
- Serverless compute time.

Cost Controls
- Cache pricing data per region and SKU.
- Skip files above size threshold.
- Deduplicate analysis by MR revision hash.

## 17) Risks and Mitigations
Risk: Looping commits.
Mitigation: Ignore agent-authored commits and tagged commit messages.

Risk: Hallucinated savings.
Mitigation: Require verified pricing source and evidence.

Risk: Large diffs and timeouts.
Mitigation: Limit file size and analyze only changed files.

Risk: API rate limits.
Mitigation: Exponential backoff and request batching.

## 18) Milestones and Timeline
Day 1
- Webhook ingestion and validation.
- MR diff retrieval and basic comment posting.

Day 2
- LLM integration with pricing verification.
- JSON schema validation and evidence enforcement.

Day 3
- Apply mode, audit logs, and demo polish.

## 19) Acceptance Tests and QA Scenarios
Test 1
- Preconditions: Valid GitLab webhook token, MR contains Terraform change.
- Steps: Trigger MR update webhook.
- Expected: MR comment posted with savings and evidence.

Test 2
- Preconditions: MR contains no infra file changes.
- Steps: Trigger MR update webhook.
- Expected: No action taken and logged as skipped.

Test 3
- Preconditions: Invalid webhook token.
- Steps: Trigger webhook with invalid token.
- Expected: 401 response and no processing.

Test 4
- Preconditions: Agent-authored commit in MR.
- Steps: Trigger webhook.
- Expected: Event is ignored and logged as loop-prevented.

Test 5
- Preconditions: Pricing API fails.
- Steps: Trigger MR update webhook.
- Expected: Comment posts with needs-review and no savings claims.

## 20) Configuration
- APPLY_MODE: true or false
- MAX_FILE_SIZE_KB: integer
- PRICING_CACHE_TTL_MIN: integer
- LOG_LEVEL: info or debug
- ENABLE_AUDIT_LOG: true or false

## 21) Open Questions
- Which pricing API is used for the demo?
- Will apply mode be enabled in the hackathon demo?



