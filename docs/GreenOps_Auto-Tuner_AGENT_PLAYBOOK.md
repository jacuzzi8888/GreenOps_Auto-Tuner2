# GreenOps Auto-Tuner - AGENT_PLAYBOOK (Full Template)

## Purpose
End-to-end operating guide for agents.

## How to Use
Use throughout development.

## Template Fields
| Field | Description |
|---|---|
| Non-Negotiables | Hard rules |
| Workflow | Task flow |
| Evidence | Validation rules |
| Logging | Required updates |

## Template Sections
Non-Negotiables:
Workflow:
Evidence:
Logging:

## Filled Example
# GreenOps Auto-Tuner - AGENT_PLAYBOOK (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Agent Playbook

## Purpose
Guide any coding agent to build and evolve the GreenOps Auto-Tuner MVP safely, with strict evidence, minimal diffs, and predictable outcomes.

## Primary References
- Spec: GreenOps_Auto-Tuner_spec.md
- MVP Contract: GreenOps_Auto-Tuner_MVP_CONTRACT.md
- Context: GreenOps_Auto-Tuner_CONTEXT.md
- Tasks: GreenOps_Auto-Tuner_TASKS.md
- Acceptance: GreenOps_Auto-Tuner_ACCEPTANCE.md
- Checklist: GreenOps_Auto-Tuner_CHECKLIST.md

## Non-Negotiables
- Propose-only by default. Apply mode is opt-in and controlled by config.
- No savings or carbon claims without verified pricing input.
- All LLM outputs must be strict JSON matching schema.
- Never loop on agent-authored commits.
- Avoid large diffs; prefer minimal patches.

## Task Sizing Rules
- One task should be 1 to 3 hours of work.
- Each task must map to a specific acceptance test or success criteria.
- End every task with a RUNLOG update.

## Preflight Checklist (Mandatory)
- Read the current task and relevant acceptance tests.
- Confirm file paths to edit.
- Confirm required inputs and output schemas.
- Identify any missing credentials or external dependencies.

## Implementation Workflow
1. Parse current task from TASKS.md.
2. Inspect related files to understand existing behavior.
3. Implement smallest change that satisfies the task.
4. Validate JSON schema outputs and tool usage.
5. Run or simulate the acceptance test.
6. Update RUNLOG with changes and next steps.

## LLM and Tool Usage Rules
- The LLM must be instructed to return JSON only.
- Any pricing or carbon claim must be tool-verified.
- If tool fails, mark output as needs-review and do not claim savings.
- One re-prompt allowed for invalid JSON; then fail gracefully.

## Evidence Requirements
- Every recommendation must include evidence from the infra file.
- Evidence must reference exact configuration values.

## Change Application Strategy
- Prefer patch-like updates when feasible.
- Full-file rewrite only when patch is unreliable.
- Preserve formatting and run terraform fmt if available.

## Failure Handling
- If pricing API fails, fallback to needs-review output.
- If webhook token is invalid, reject and do not process.
- If file is too large, skip and log.

## Logging and Audit
- Log per MR with correlation ID.
- Store audit records for proposals and actions when enabled.

## Definition of Done
- Feature works for the target scenario.
- Acceptance test passes or is simulated with expected outputs.
- RUNLOG updated with outcome and any open issues.
- No unrelated files modified.

## Context Management
- Keep CONTEXT.md updated with current goal and decisions.
- Keep RUNLOG entries concise and chronological.
- Avoid adding new requirements unless explicitly requested.



