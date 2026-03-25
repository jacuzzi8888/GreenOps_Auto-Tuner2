# GreenOps Auto-Tuner

An MCP server that analyzes GitLab Merge Requests for infrastructure-as-code changes, identifies over-provisioned GCP resources using live pricing data, and posts cost/carbon reduction proposals as MR comments.

## Features

- **IaC Diff Analysis** — Parses Terraform and YAML changes in GitLab MRs to detect over-provisioned Compute Engine and GKE resources
- **Live GCP Pricing Verification** — Cross-references AI-generated suggestions against the Google Cloud Billing Catalog API for mathematically proven savings
- **Carbon Impact Estimates** — Calculates generalized kgCO2e deltas for proposed infrastructure changes
- **MCP Protocol Server** — Exposes tools via the Model Context Protocol (MCP) with Server-Sent Events transport
- **Auto-Apply Mode** — Optionally commits high-confidence optimization proposals back to the source branch
- **Usage Tracking & Billing** — Built-in plan enforcement, rate limiting, and a real-time usage dashboard
- **Loop Prevention** — Strict guards prevent cascading commits when running in agent environments
- **Audit Logging** — Writes analysis metadata to structured JSON lines for compliance and debugging

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js + TypeScript |
| Server | Express 5 |
| AI Model | Google Gemini via `@google/generative-ai` |
| Protocol | Model Context Protocol (MCP) SDK |
| Cloud API | Google Cloud Billing Catalog API |
| Validation | Zod |
| Testing | Jest + Supertest |
| Deployment | Docker, Vercel |

## Prerequisites

- Node.js 18+
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))
- A GCP API key with Cloud Billing Catalog API access ([Guide](docs/Getting_Variables_Guide.md))
- A GitLab API token with `api` scope

## Getting Started

```bash
git clone <repo-url>
cd GreenOps_Auto-Tuner
npm install
cp .env.example .env
```

Fill in your API keys in `.env`:

```env
PORT=3000
MCP_API_TOKEN=your_secure_mcp_secret
GITLAB_API_TOKEN=glpat-your-gitlab-api-token
GEMINI_API_KEY=your_gemini_api_key
GCP_API_KEY=your_gcp_api_key
APPLY_MODE=false
```

```bash
npm run dev
```

The server starts on `http://localhost:3000`:
- MCP endpoint: `/mcp`
- Usage API: `/api/usage`
- Dashboard: `/dashboard.html`

## Docker

```bash
docker-compose up -d --build
```

Runs the server as a non-root user in a multi-stage build.

## Testing

```bash
npm test
```

## Project Structure

```
GreenOps_Auto-Tuner/
├── src/
│   ├── server.ts            # Entry point, graceful shutdown
│   ├── app.ts               # Express app setup and middleware
│   ├── config.ts            # Environment validation
│   ├── analyzer.ts          # MR diff parsing and resource analysis
│   ├── pricing.ts           # GCP Billing API integration
│   ├── apply.ts             # Auto-apply commit logic
│   ├── audit.ts             # Audit log writer
│   ├── comment.ts           # MR comment formatting
│   ├── types.ts             # Shared TypeScript types
│   ├── lib/
│   │   └── usageTracker.ts  # Usage tracking, plan enforcement
│   ├── middleware/
│   │   └── usageMiddleware.ts
│   └── routes/
│       └── usageRoutes.ts   # Usage/billing API routes
├── tests/
│   ├── analyzer.test.ts
│   ├── app.test.ts
│   ├── apply.test.ts
│   └── audit.test.ts
├── scripts/
│   ├── smoke-test.ts        # Smoke test for MCP tools
│   ├── test-client.ts       # MCP client test harness
│   └── list-models.ts       # List available Gemini models
├── public/                  # Static assets (dashboard HTML)
├── docs/                    # Architecture and API documentation
├── .env.example             # Environment variable template
├── Dockerfile               # Multi-stage production build
├── docker-compose.yml
├── vercel.json              # Vercel deployment config
├── tsconfig.json
├── jest.config.js
└── package.json
```

## Documentation

- [Architecture](docs/GreenOps_Auto-Tuner_ARCHITECTURE.md)
- [API Specification](docs/GreenOps_Auto-Tuner_API_SPEC.md)
- [Data Model](docs/GreenOps_Auto-Tuner_DATA_MODEL.md)
- [Test Plan](docs/GreenOps_Auto-Tuner_TEST_PLAN.md)
- [Getting GCP/Gemini Variables](docs/Getting_Variables_Guide.md)
- [GitLab Webhook Setup](docs/GitLab_Webhook_Setup.md)

## License

MIT — see [LICENSE](LICENSE) for details.
