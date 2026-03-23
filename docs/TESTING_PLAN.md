# 🧪 GreenOps Auto-Tuner: Testing Plan

This document outlines the multi-layered testing strategy for the GreenOps Auto-Tuner MCP server to ensure reliability, security, and accuracy in infrastructure optimization.

---

## 1. Unit Testing (Logic Verification)
**Tool:** Jest
**Scope:** Core utility functions and logic filters.
- **`src/analyzer.ts`**: Testing diff truncation, file-count guards, and XML-tag extraction.
- **`src/pricing.ts`**: Verifying price calculation logic, SKU matching heuristics, and fallback mechanisms when APIs are offline.
- **`src/audit.ts`**: Ensuring hash generation is consistent and audit records are formatted correctly.

**To Run:**
```bash
npm test tests/analyzer.test.ts tests/pricing.test.ts tests/audit.test.ts
```

---

## 2. Integration Testing (MCP Endpoint & Server)
**Tool:** Supertest + Express
**Scope:** Validating the Model Context Protocol (MCP) server endpoints and transport layer.
- **Health Check (`/health`)**: Verifying the server boots and responds with `type: "MCP Server"`.
- **SSE Transport (`/sse`)**: Confirming session initialization and session-map management.
- **Message Ingestion (`/message`)**: Testing secure message routing to the MCP SDK.
- **Authentication**: Ensuring all endpoints (except `/health`) correctly reject requests without a valid `MCP_API_TOKEN`.

**To Run:**
```bash
npm test tests/app.test.ts
```

---

## 3. Exploratory & Security Testing (Live/Staging)
**Tool:** `scripts/exploratory-test.js` (Custom Node.js script)
**Scope:** Running "chaos" tests against the live Vercel deployment.
- **Authentication Bypass**: Attempting to reach endpoints with malformed or missing Bearer tokens.
- **JSON Bombing**: Sending invalid or oversized JSON payloads to test the robustness of the `express.json()` middle-ware and `zod` validation.
- **Session Lifecycle**: Testing how the server handles disconnects and stale session IDs.

**To Run Against Production:**
```bash
# Set your Vercel URL (e.g., https://greenops-auto-tuner.vercel.app) in the script first
node scripts/exploratory-test.js
```

---

## 4. End-to-End (Simulated "Duo Agent" Flow)
**Tool:** `scripts/test-client.ts`
**Scope:** Verifying the full AI-driven reasoning pipeline.
- **Flow:** Simulated Webhook Diff -> Gemini 3 Analysis -> GCP Pricing Lookup -> Structured JSON Proposal.
- **Success Criteria:** The agent identifies an over-provisioned resource (e.g., `e2-micro` -> `n2-standard-4`) and outputs a signed cost reduction proposal.

**To Run:**
```bash
npx tsx scripts/test-client.ts
```

---

## 5. Deployment & Smoke Testing
**Tool:** `scripts/smoke-test.ts`
**Scope:** Verifying the build and runtime environment (e.g., Docker/Vercel).
- **Process:** Spawns the server in a separate process, waits for the "Listening" signal, pulses the health endpoint, and performs a clean shutdown.
- **CI/CD Integration:** This is designed to run as a pre-deploy hook.

**To Run:**
```bash
npm run smoke
```
