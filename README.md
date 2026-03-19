# GreenOps Auto-Tuner - README (Full Template)

## Purpose
Provide an at-a-glance overview, quickstart, and demo steps for GreenOps Auto-Tuner.

## How to Use
Read Overview first, then use Quickstart and Demo Flow during presentations.

## Template Fields
| Field | Description |
|---|---|
| Overview | What it does and who it helps |
| Quickstart | Minimal run steps |
| Configuration | Env vars and runtime needs |
| Demo Flow | Step-by-step demo |
| Limitations | MVP constraints |

## Template Sections
### Overview (Template)
- One sentence value proposition
- Three key capabilities

### Quickstart (Template)
1. Configure GitLab webhook to /webhook/gitlab
2. Set GITLAB_WEBHOOK_TOKEN and GITLAB_API_TOKEN
3. Open MR with .tf change

### Configuration (Example Table)
| Variable | Required | Example | Purpose |
|---|---|---|---|
| GITLAB_WEBHOOK_TOKEN | yes | *** | Verify webhook source |
| GITLAB_API_TOKEN | yes | *** | MR read/write |
| APPLY_MODE | no | false | Auto-commit toggle |

### Demo Flow (Template)
- Show MR
- Trigger webhook
- Show comment with evidence

### Limitations (Template)
- No runtime optimization
- Propose-only by default

## Filled Example
# GreenOps Auto-Tuner - README (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - README

## Overview
GreenOps Auto-Tuner is an event-driven agent that analyzes GitLab Merge Requests for infra changes and posts verified cost and carbon optimization proposals.

## Quickstart (Demo)
1. Configure GitLab webhook to point at the agent endpoint.
2. Set required environment variables.
3. Open a Merge Request that modifies a .tf or .yaml file.
4. Verify a comment posts with evidence and estimated savings.

## Core Features
- Webhook-driven MR analysis
- Verified pricing and carbon claims
- Propose-only by default with optional apply mode
- Audit trail

## Repo Layout
- Spec: GreenOps_Auto-Tuner_spec.md
- MVP Contract: GreenOps_Auto-Tuner_MVP_CONTRACT.md
- Context: GreenOps_Auto-Tuner_CONTEXT.md
- Tasks: GreenOps_Auto-Tuner_TASKS.md
- Acceptance: GreenOps_Auto-Tuner_ACCEPTANCE.md

## Demo Script
See GreenOps_Auto-Tuner_DEMO_SCRIPT.md



