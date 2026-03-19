# GreenOps Auto-Tuner - API_SPEC SPEC (Full Template)

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
# GreenOps Auto-Tuner - API_SPEC SPEC (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - API Spec

## Inbound
### POST /webhook/gitlab
- Headers: X-Gitlab-Token
- Body: GitLab MR event payload
- Responses:
  - 200: Accepted
  - 401: Invalid token

## Outbound
### GitLab API
- GET /projects/:id/merge_requests/:iid/changes
- GET /projects/:id/repository/files/:file_path?ref=:branch
- POST /projects/:id/merge_requests/:iid/notes
- POST /projects/:id/repository/commits

### Pricing API
- Rule-dependent provider pricing endpoint



