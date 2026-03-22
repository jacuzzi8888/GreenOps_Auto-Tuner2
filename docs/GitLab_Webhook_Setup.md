# GitLab Webhook Setup Guide

This guide explains how to connect your running GreenOps Auto-Tuner instance to a real GitLab project.

## Prerequisites

1. Your Auto-Tuner agent must be running and accessible over the public internet (via HTTP/HTTPS or tools like ngrok/localtunnel).
2. You must have **Maintainer** or **Owner** permissions on the GitLab project.
3. You must have a **Project Access Token** or **Personal Access Token** with the `api` scope.

## Step 1: Configure the Agent

Ensure your agent is running with the correct environment variables:
- `GITLAB_WEBHOOK_TOKEN`: A secret string used to verify incoming payloads (e.g. \`super-secret-token\`)
- `GITLAB_API_TOKEN`: Your project/personal access token (e.g. \`glpat-xxxx\`)

## Step 2: Register the Webhook in GitLab

1. Navigate to your project on GitLab.
2. Go to **Settings > Webhooks**.
3. In the **URL** field, enter your agent's public URL followed by the route name:
   *Example: \`https://my-greenops-agent.up.railway.app/webhook/gitlab\`*
4. In the **Secret token** field, enter the value you set for \`GITLAB_WEBHOOK_TOKEN\`.
5. Under **Trigger**, check the box for **Merge request events**.
   *(Uncheck "Push events" if it is checked by default).*
6. Click **Add webhook**.

## Step 3: Test the Webhook

1. On the Webhooks page, scroll down to the **Project Hooks** list.
2. Find your new webhook, click **Test**, and select **Merge requests events**.
3. You should see a banner indicating a **HTTP 200** response.
4. Check your agent's server logs. You should see:
   \`\`\`
   [Webhook] Ignored MR state: undefined, action: undefined
   \`\`\`
   *(This is expected because the test payload from GitLab doesn't perfectly emulate a real 'open' event, but it proves connectivity).*

## Step 4: Full E2E Test

To test the actual AI analysis flow:
1. Create a new branch.
2. Add a `main.tf` file with an unoptimized instance type:
   \`\`\`hcl
   resource "aws_instance" "app" {
     instance_type = "m5.large"
   }
   \`\`\`
3. Open a Merge Request against \`main\`.
4. Wait ~15-30 seconds.
5. The GreenOps Agent will post a comment with verified pricing and carbon savings!
