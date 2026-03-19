# GreenOps Auto-Tuner - ACCEPTANCE (Full Template)

## Purpose
Define acceptance criteria for GreenOps Auto-Tuner.

## How to Use
Use for validation and demo readiness.

## Template Fields
| Field | Description |
|---|---|
| Test | ID and name |
| Preconditions | Setup |
| Steps | Actions |
| Expected | Result |

## Template Sections
Test ID:
Preconditions:
Steps:
Expected:

## Filled Example
# GreenOps Auto-Tuner - ACCEPTANCE (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Acceptance Tests (Detailed)

Test 1
- Preconditions: Valid GitLab webhook token, MR contains Terraform change.
- Steps: Trigger MR update webhook.
- Expected: MR comment posted with savings, evidence, and pricing source.

Test 2
- Preconditions: MR contains no infra file changes.
- Steps: Trigger MR update webhook.
- Expected: No action taken and event logged as skipped.

Test 3
- Preconditions: Invalid webhook token.
- Steps: Trigger webhook with invalid token.
- Expected: 401 response and no processing.

Test 4
- Preconditions: Agent-authored commit in MR.
- Steps: Trigger webhook.
- Expected: Event is ignored and logged as loop-prevented.

Test 5
- Preconditions: Pricing API unavailable.
- Steps: Trigger MR update webhook.
- Expected: Comment posts with needs-review and no savings claim.

Test 6
- Preconditions: LLM returns invalid JSON.
- Steps: Process MR update.
- Expected: One re-prompt attempt, then graceful failure if still invalid.



