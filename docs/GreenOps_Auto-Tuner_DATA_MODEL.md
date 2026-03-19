# GreenOps Auto-Tuner - DATA_MODEL (Full Template)

## Purpose
Define entities, fields, constraints, and retention for GreenOps Auto-Tuner.

## How to Use
Use to implement storage and validation.

## Template Fields
| Field | Description |
|---|---|
| Entity | Data object name |
| Fields | Name, type, required |
| Retention | Data lifecycle |

## Template Sections
### Proposal (Example)
| Field | Type | Required | Constraints |
|---|---|---|---|
| file_path | string | yes | repo-relative |
| evidence | string | yes | exact config lines |
| estimated_savings | number | no | requires pricing |

## Filled Example
# GreenOps Auto-Tuner - DATA_MODEL (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Data Model

## Entities
- MRAnalysis: project_id, mr_iid, revision, status, timestamps
- PricingSnapshot: sku, region, price, currency, source, retrieved_at
- Proposal: file_path, patch_type, summary, evidence, savings
- AuditLog: event, actor, payload_hash, result

## Retention
- Demo duration by default; configurable.



