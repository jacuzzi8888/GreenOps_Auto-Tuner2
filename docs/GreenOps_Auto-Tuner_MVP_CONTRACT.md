# GreenOps Auto-Tuner - MVP_CONTRACT (Full Template)

## Purpose
Define MVP boundaries for GreenOps Auto-Tuner.

## How to Use
Use to prevent scope creep.

## Template Fields
| Field | Description |
|---|---|
| Goal | MVP objective |
| Scope | In/out |
| Deliverables | Required outputs |
| Constraints | Non-negotiables |
| Success | Metrics |

## Template Sections
- Goal
- In Scope
- Out of Scope
- Deliverables
- Success Metrics

## Filled Example
# GreenOps Auto-Tuner - MVP_CONTRACT (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - MVP Contract (Detailed)

## Overview
This contract defines the minimum viable product for the GreenOps Auto-Tuner and the constraints required to keep the MVP safe, demoable, and judge-ready.

## Scope
In Scope
- GitLab MR webhook ingestion.
- Diff and full file retrieval for .tf and .yaml.
- Pricing-verified analysis and proposal generation.
- Evidence-backed MR comment.
- Optional apply mode behind a config flag.

Out of Scope
- Runtime optimization after deployment.
- Cross-repo policy enforcement.
- UI beyond MR comment in MVP.

## Deliverables
- Agent service handling MR webhooks.
- Pricing verification integration.
- MR comment output format.
- Basic audit log store.

## Constraints
- Propose-only by default.
- All savings claims must be verified.
- Strict JSON output and validation.
- Vendor choices are rule-dependent.

## Dependencies
- GitLab API access token.
- Pricing API or local pricing table.
- Serverless runtime or container host.

## Success Metrics
- Comment posted within 60 seconds for typical MR.
- Zero loop incidents on agent commits.
- Verified savings evidence included in each proposal.

## Demo Script
1. Open MR with infra change.
2. Show agent comment with evidence and savings.
3. Toggle apply mode and show commit creation.

## Risks
- Pricing API downtime.
- Large diffs increase latency.
- LLM schema errors.

## Mitigations
- Pricing cache with fallback.
- File size caps and diff filtering.
- One retry on schema failure.



