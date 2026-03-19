# GreenOps Auto-Tuner - COMPLIANCE (Full Template)

## Purpose
Document privacy, retention, and compliance for GreenOps Auto-Tuner.

## How to Use
Use for judge questions and privacy review.

## Template Fields
| Field | Description |
|---|---|
| Data Types | Data processed |
| Retention | How long stored |
| Privacy Notice | User-facing notice |
| Vendor Policy | Provider constraints |

## Template Sections
### Privacy Notice (Template)
We process only the minimum data needed to provide results.
We delete data after processing unless retention is enabled.

## Filled Example
# GreenOps Auto-Tuner - COMPLIANCE (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Compliance and Privacy Notes

## Purpose
Summarize compliance, privacy, and governance considerations for the GreenOps Auto-Tuner MVP.

## Data Classification
- MR diffs and infra files: internal code data.
- Pricing data: public or licensed reference data.
- Audit logs: internal operational records.

## Data Flow Summary
1. GitLab sends webhook payload with MR metadata.
2. Agent fetches MR diffs and file contents.
3. LLM analyzes data with verified pricing input.
4. Output posted as MR comment; optional commit.
5. Audit log stored if enabled.

## Data Retention
- Default: No persistent storage of full repo contents.
- Audit logs retained for demo duration unless configured otherwise.

## Privacy Controls
- Minimize data sent to LLM (only relevant files).
- Remove secrets or credentials from prompts.
- Use vendor policies that do not train on customer inputs when required by event rules.

## Security Controls
- Validate webhook tokens for all inbound requests.
- Least-privilege GitLab tokens.
- Secrets stored in managed secret manager.
- Rate-limit and backoff on external API calls.

## Compliance Considerations
- Align vendor choices with hackathon rules.
- If external vendors are used, confirm data usage policy for the selected tier.
- If the demo includes real data, obtain explicit permission.

## Risk Register
- Risk: Exposure of sensitive infra data.
  Mitigation: Redact secrets, limit payload scope, short retention.
- Risk: Unauthorized webhook calls.
  Mitigation: Token validation and IP allowlist where possible.
- Risk: Misleading savings claims.
  Mitigation: Verified pricing source only.

## Auditability
- Maintain a record of recommendations, evidence, and pricing source.
- Log who triggered changes and when.



