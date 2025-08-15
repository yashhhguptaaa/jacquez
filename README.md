# Jacquez

A friendly moderator for OSS repos that can run as a **GitHub App** (webhook) or **GitHub Action** (CI check).

## Prerequisites

- Node.js (version 20 or higher)
- GitHub App credentials
- Anthropic API key
- Smee.io channel (for local development)

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/antiwork/jacquez.git
cd jacquez
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials.

### 3. GitHub App Setup

1. Create a GitHub App at https://github.com/settings/apps/new
2. Configure the following permissions:
   - **Repository permissions**:
     - Issues: Read & Write
     - Pull requests: Read & Write
     - Contents: Read (for loading CONTRIBUTING.md)
   - **Subscribe to events**:
     - Issues
     - Pull requests
     - Issue comments
3. Set webhook URL to your Smee.io channel
4. Download the private key and update `GH_PRIVATE_KEY` in `.env`

### 4. Get API Keys

- **Anthropic API Key**: Get from https://console.anthropic.com/
- **Smee.io Channel**: Create at https://smee.io/

## Running the Server

### Development Mode

```bash
npm start
```

The server will start on port 3000 and display:

```
GitHub App server is running on port 3000
Webhook URL: http://localhost:3000/webhook
```

### Production Mode

For production deployment, ensure environment variables are set and run:

```bash
NODE_ENV=production npm start
```

## Usage Options

Jacquez can be used in two ways:

### Option 1: GitHub Action (Recommended)

Run Jacquez as a CI check that **fails the build** for guideline violations:

- ✅ More visible (red ❌ in PR status)
- ✅ No GitHub notifications spam
- ✅ Native CI/CD integration

**Quick setup**: Copy `.github/workflows/jacquez-pr-check.yml` to your repository and add your `ANTHROPIC_API_KEY` secret.

📖 **[Full GitHub Action Documentation](docs/GITHUB_ACTION.md)**

### Option 2: GitHub App (Traditional)

Run Jacquez as a webhook server that **posts comments** on issues and PRs:

- 💬 Interactive comment-based feedback
- 🔄 Real-time responses
- 🤖 Works on issues and comments too

Continue reading below for GitHub App setup instructions.

## Testing

### Local Testing with Smee.io

1. Start the server: `npm start`
2. In another terminal, forward webhooks from Smee.io:
   ```bash
   npx smee-client --url https://smee.io/your_channel_id --path /webhook --port 3000
   ```
3. Test by:
   - Opening an issue in a repository where your app is installed
   - Opening a pull request
   - Commenting on an issue

## License

This project is licensed under the MIT License.
