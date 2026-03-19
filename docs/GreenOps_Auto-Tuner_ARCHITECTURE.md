# GreenOps Auto-Tuner - ARCHITECTURE (Full Template)

## Purpose
Describe components, data flow, trust boundaries, and failure modes for GreenOps Auto-Tuner.

## How to Use
Use this for system reviews and demo explanations.

## Template Fields
| Field | Description |
|---|---|
| Components | Services and responsibilities |
| Data Flow | Step-by-step processing |
| Trust Boundaries | External dependencies |
| Failure Modes | Common failures and handling |

## Template Sections
### Components Table (Template)
| Component | Purpose | Inputs | Outputs |
|---|---|---|---|
| Webhook Ingress | Receive MR events | GitLab webhook | Payload |
| Agent Service | Orchestrate analysis | Payload, diffs | Proposal |
| Pricing Verifier | Validate savings | Instance type | Price data |

### Data Flow (Template)
1. Validate webhook token
2. Fetch MR diff and files
3. Call LLM with pricing tool
4. Post MR comment

### Failure Modes (Template)
- Pricing API down -> needs-review output
- Invalid JSON -> re-prompt once

## Filled Example
# GreenOps Auto-Tuner - ARCHITECTURE (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Architecture

## Components
- GitLab Webhook Ingress
- Agent Service
- Pricing Verification Tool
- LLM Engine
- Audit Storage

## Data Flow
1. MR webhook received and validated.
2. MR diffs fetched and filtered.
3. File contents retrieved.
4. LLM analysis with pricing verification.
5. MR comment posted and optional commit.
6. Audit record stored.

## Trust Boundaries
- External: GitLab webhook, pricing API, LLM API.
- Internal: Agent service, audit storage.



