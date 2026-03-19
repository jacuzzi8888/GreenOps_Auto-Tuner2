# GreenOps Auto-Tuner - CONTEXT (Full Template)

## Purpose
Track current goals and decisions for GreenOps Auto-Tuner.

## How to Use
Update after each milestone.

## Template Fields
| Field | Description |
|---|---|
| Current Goal | Focus |
| Decisions | Locked choices |
| Constraints | Non-negotiables |
| Next Actions | Immediate steps |

## Template Sections
Current Goal:
Decisions:
Constraints:
Next Actions:

## Filled Example
# GreenOps Auto-Tuner - CONTEXT (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Context (Detailed)

## Current Goal
Build the MVP pipeline: webhook -> diff fetch -> verified analysis -> MR comment.

## Current State
- Specs and MVP contract defined.
- Task list and acceptance tests created.
- No code implemented yet.

## Decisions
- Propose-only by default.
- Vendor-agnostic with rule notes.
- Strict JSON schema for LLM output.
- Pricing claims require verification.

## Constraints
- Must validate GitLab webhook token.
- Must prevent reprocessing agent commits.
- Must handle rate limits and timeouts.

## Dependencies
- GitLab API token with MR access.
- Pricing API or local cache.
- Serverless runtime or container host.

## Key Files
- Spec: C:\Users\USER\Desktop\Documents\Playground\GreenOps_Auto-Tuner_spec.md
- MVP Contract: C:\Users\USER\Desktop\Documents\Playground\GreenOps_Auto-Tuner_MVP_CONTRACT.md
- Acceptance: C:\Users\USER\Desktop\Documents\Playground\GreenOps_Auto-Tuner_ACCEPTANCE.md
- Tasks: C:\Users\USER\Desktop\Documents\Playground\GreenOps_Auto-Tuner_TASKS.md
- Prompt: C:\Users\USER\Desktop\Documents\Playground\GreenOps_Auto-Tuner_AGENT_PROMPT.md
- Checklist: C:\Users\USER\Desktop\Documents\Playground\GreenOps_Auto-Tuner_CHECKLIST.md

## Open Questions
- Which pricing API is used in the demo?
- Is apply mode enabled for judges?
- What file size limits are acceptable?

## Next Actions
- Implement webhook ingestion.
- Fetch MR diff and file contents.
- Add pricing verification tool.



