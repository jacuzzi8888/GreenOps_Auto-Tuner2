# GreenOps Auto-Tuner - SECURITY_THREAT_MODEL (Full Template)

## Purpose
Identify security threats and mitigations for GreenOps Auto-Tuner.

## How to Use
Use before demo and after integration changes.

## Template Fields
| Field | Description |
|---|---|
| Assets | What must be protected |
| Threats | Potential risks |
| Mitigations | Controls |
| Residual Risk | Remaining risk |

## Template Sections
### Threat Table (Template)
| Threat | Impact | Mitigation | Residual Risk |
|---|---|---|---|
| Unauthorized access | Data leak | Auth + least privilege | Low |
| Data leakage | Privacy risk | Minimize payload | Medium |

## Filled Example
# GreenOps Auto-Tuner - SECURITY_THREAT_MODEL (Full Template)

## Purpose
System.Collections.Hashtable.Purpose

## How to Use
System.Collections.Hashtable.How

## Template Fields
System.Collections.Hashtable.Fields

## Template Sections
System.Collections.Hashtable.Sections

## Filled Example
# GreenOps Auto-Tuner - Security Threat Model

## Assets
- GitLab webhook token
- GitLab API token
- MR diffs and file content

## Threats and Mitigations
- Spoofed webhook: validate token, optional IP allowlist
- Data leakage: minimize prompts, redact secrets
- Unauthorized changes: least-privilege tokens, propose-only default



