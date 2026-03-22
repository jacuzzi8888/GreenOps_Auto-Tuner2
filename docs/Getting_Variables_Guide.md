# Getting Your Environment Variables

This guide walks you through exactly where to find and generate the required API keys and tokens for the GreenOps Auto-Tuner `env` configuration.

---

### 1. `GEMINI_API_KEY`
**Purpose**: Authenticates the agent with Google's AI Studio to run the Gemini 1.5 Pro model.
* **How to get it:**
  1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
  2. Sign in with your Google account.
  3. Click **"Create API Key"** (you can attach it to a new or existing Google Cloud project).
  4. Copy the generated key.

---

### 2. `GITLAB_API_TOKEN`
**Purpose**: Allows the agent to read file contents from the Merge Request and post comment replies natively.
* **How to get it (Personal Access Token):**
  1. In GitLab, click your profile picture in the top right → **Preferences** → **Access Tokens**.
  2. Click **Add new token**.
  3. Give it a name (e.g., "GreenOps Agent").
  4. Under **Select scopes**, check **`api`**.
  5. Click **Create personal access token** and copy the value (it will start with `glpat-`).

*(Note: Alternatively, you can use a **Project Access Token** scoped specifically to your repository via Settings → Access Tokens).*

---

### 3. `GITLAB_WEBHOOK_TOKEN`
**Purpose**: A secret symmetric key you create to ensure that incoming HTTP requests to your server actually came from your GitLab repository.
* **How to get it:**
  1. **You make this up!**
  2. Just type a random, secure string (e.g., `greenops-super-secret-123`).
  3. You will paste this exact string into the `GITLAB_WEBHOOK_TOKEN` environment variable AND into the "Secret token" field when registering the webhook in your GitLab repository settings.

---

### 4. `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`
**Purpose**: Allows the agent to query the live AWS Pricing API to verify the LLM's cost sayings mathematically.
* **How to get it:**
  1. Log into the [AWS Management Console](https://console.aws.amazon.com/).
  2. Search for **IAM** (Identity and Access Management).
  3. Go to **Users** → **Add users**.
  4. Name the user (e.g., `greenops-pricing-agent`), and click Next.
  5. Select **Attach policies directly**.
  6. Search for and check `AWSPriceListServiceFullAccess` (or create a custom inline policy granting `pricing:GetProducts`).
  7. Finish creating the user.
  8. Click on the newly created user, go to the **Security credentials** tab.
  9. Scroll down to **Access keys** → **Create access key**.
  10. Select **Application running outside AWS**, click Next, and copy the **Access key ID** and **Secret access key**.

*(Don't forget to set `AWS_REGION=us-east-1` since the Pricing API is inherently locked to only `us-east-1` and `ap-south-1`).*
