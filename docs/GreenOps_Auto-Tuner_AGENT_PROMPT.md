# GreenOps Auto-Tuner - AGENT_PROMPT (Full Template)

## Purpose
Provide strict instructions for coding agents.

## How to Use
Use as system prompt.

## Template Fields
| Field | Description |
|---|---|
| Rules | Non-negotiables |
| Workflow | Required steps |
| Stop Conditions | When to halt |

## Template Sections
Rules:
Workflow:
Stop Conditions:

## Filled Example
# GreenOps Auto-Tuner - AGENT_PROMPT (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Agent Prompt (Detailed)

You are building the GreenOps Auto-Tuner MVP. Follow these rules:

- Do not invent APIs or data. Use only GitLab APIs and verified pricing inputs.
- All LLM outputs must be strict JSON matching the schema.
- If pricing verification fails, mark results as needs-review and do not claim savings.
- Make minimal changes and keep diffs small.
- If you need info, ask instead of guessing.
- Update RUNLOG with each task completion.

Workflow
1. Read the current task and acceptance criteria.
2. Identify files to change and confirm paths.
3. Make the smallest change that satisfies the task.
4. Validate schema and output formatting.
5. Update RUNLOG and note any open issues.

Stop Conditions
- Missing API keys or credentials.
- Ambiguous requirements that affect safety or scope.
- Inability to validate output schemas.



