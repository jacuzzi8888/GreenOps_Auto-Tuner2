# 🌿 GreenOps Auto-Tuner

GreenOps Auto-Tuner is an event-driven AI agent that analyzes GitLab Merge Requests for infrastructure-as-code changes (Terraform/YAML). It intercepts changes, identifies over-provisioned resources, verifies live AWS pricing, and posts verifiable cost and carbon reduction proposals directly as MR comments.

![Demo](docs/demo-placeholder.png) <!-- Update with actual demo screenshot -->

## Core Capabilities

- **Automated Cost Optimization:** Identifies inefficient EC2 instances and Kubernetes configurations.
- **Verified Cloud Pricing:** Cross-references LLM suggestions against the live AWS Pricing API so savings are mathematically proven.
- **Carbon Impact Estimates:** Provides generalized carbon footprint delta (kgCO2e) estimates for the proposed changes.
- **Loop Prevention & Safety:** Operates entirely asynchronously and includes strict loop-prevention guards to avoid cascading commits.
- **Auto-Apply Mode**: Can be configured to automatically commit high-confidence proposals back to the source branch.

---

## 🚀 Hackathon Judges: How to Test

Welcome! This agent has been built to run on the GitLab Duo Agent Platform utilizing the Model Context Protocol (MCP) and Google Cloud's Gemini 3.0 Flash.

### 1. Triggering the Agent
Because the actual agent logic is hosted securely in our `agent.yml` workflow, you can test it directly within the `gitlab-ai-hackathon` group environments.
1. Open a Merge Request modifying a Terraform `.tf` file containing a GCP Compute Instance constraint (e.g. `n2-standard-4`).
2. Type `@gitlab-bot` or follow the standard Duo Agent triggering process for your MR.
3. The Auto-Tuner will stream a request securely to our deployed Vercel MCP Server (`https://greenops-auto-tuner.vercel.app/sse`).
4. The Agent will analyze the changes, fetch live metrics from the Google Cloud Billing API, and post an infrastructure optimization plan directly on the MR.

### 2. Run the MCP Server Locally (Optional)
If you wish to examine the LLM execution logic outside the GitLab Duo Agent Platform:
```bash
git clone https://gitlab.com/gitlab-ai-hackathon/greenops-auto-tuner.git
npm install
cp .env.example .env # Add your GCP_API_KEY and GEMINI_API_KEY
npm run dev
```
The Express SSE Server will spin up on port `3000`.

## 🏗 Architecture & Design

Curious how it works under the hood?
- **[Architecture & Threat Model](docs/GreenOps_Auto-Tuner_ARCHITECTURE.md)** - Details on the components, data flow, and security boundaries.
- **[MVP Contract](docs/GreenOps_Auto-Tuner_MVP_CONTRACT.md)** - The core features supported in this prototype.

## 🐳 Docker Deployment

To run this in a production-like environment using Docker:
```bash
docker-compose up -d --build
```
This will build the multi-stage TypeScript Dockerfile and run the agent securely as a non-root user.

---

## Testing

The project has comprehensive unit and end-to-end integration tests (covering AI parsing, Diff truncation, and MCP scenarios).

```bash
npm test
```

## License & Declarations

**MIT License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Developer Certificate of Origin**
By contributing to this project, you agree that all original work is submitted under GitLab's Developer Certificate of Origin (version 1.1). All commits are signed off accordingly.
