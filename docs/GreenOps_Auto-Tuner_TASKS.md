# GreenOps Auto-Tuner - TASKS (Full Template)

## Purpose
Break work into atomic tasks for GreenOps Auto-Tuner.

## How to Use
Complete tasks and update RUNLOG.

## Template Fields
| Field | Description |
|---|---|
| Task ID | Unique ID |
| Goal | Outcome |
| Output | Deliverable |
| Done | Completion criteria |

## Template Sections
Task ID:
Goal:
Output:
Done:

## Filled Example
# GreenOps Auto-Tuner - TASKS (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Tasks (Detailed)

Task G1
- Goal: Implement GitLab webhook ingestion.
- Output: Webhook endpoint that validates token.
- Done: Valid request returns 200 and logs MR id.

Task G2
- Goal: Fetch MR diff and file contents.
- Output: List of changed infra files with full content.
- Done: Diff retrieval works for .tf and .yaml.

Task G3
- Goal: Post basic MR comment.
- Output: Comment on MR indicating analysis complete.
- Done: Comment visible in MR UI.

Task G4
- Goal: Integrate pricing verification tool.
- Output: Verified pricing lookup available to LLM.
- Done: Pricing call returns values or failure code.

Task G5
- Goal: LLM analysis with strict JSON schema.
- Output: Structured proposal with evidence and savings.
- Done: Invalid JSON is rejected and re-prompted once.

Task G6
- Goal: Loop prevention.
- Output: Skip processing when agent authored commit.
- Done: Loop guard triggers on tagged commits.

Task G7
- Goal: Apply mode.
- Output: Commit created on MR branch when enabled.
- Done: Commit contains proposed change and message tag.

Task G8
- Goal: Audit logging.
- Output: Stored analysis record for each MR.
- Done: Audit record created with proposal and timestamps.



