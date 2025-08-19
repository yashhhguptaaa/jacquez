# Jacquez

A friendly moderator for OSS repos that posts helpful comments and can optionally trigger CI validation.

## Prerequisites

- Node.js (version 20 or higher)
- GitHub App credentials
- Anthropic API key
- Smee.io channel (for local development)

## For Repository Owners

**Want to use Jacquez on your repositories?**

### Quick Setup

#### Step 1: Install the GitHub App

1. Go to: https://github.com/apps/jacquez-bott
2. Click **"Install"**
3. Choose which repositories you want Jacquez to help with
4. Grant permissions (read files, write comments, create status checks)

#### Step 2: Add Contributing Guidelines

Create a `CONTRIBUTING.md` file in your repository root with your rules:

```markdown
# Contributing Guidelines

## Pull Request Requirements

- [ ] Include screenshots for UI changes
- [ ] Add tests for new functionality
- [ ] Update documentation if needed
- [ ] Write clear commit messages

## Issue Requirements

- [ ] Clear description of the problem
- [ ] Steps to reproduce (for bugs)
- [ ] Expected vs actual behavior
```

#### Step 3: Test It

1. Open a test pull request
2. Watch for:
   - 💬 Helpful comments if guidelines aren't followed
   - ✅/❌ Status check called "Jacquez Guidelines Check"

**That's it! Jacquez will now automatically review PRs and issues against your guidelines.** 🎉

## For Developers

**Want to deploy your own instance of Jacquez?**

**Development:**

```bash
git clone https://github.com/antiwork/jacquez.git
cd jacquez
npm install
cp .env.example .env
# Edit .env with your credentials (see setup guide)
npm run dev
```

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

## How It Works

Jacquez operates as a **GitHub App** that:

1. **Posts helpful comments** on issues and PRs when guidelines are violated
2. **Optionally triggers CI validation** to fail builds for stricter enforcement

### Features

- 💬 **Comment-based guidance** - Helps contributors understand requirements
- ❌ **Optional CI enforcement** - Can fail builds to prevent merging violations
- 🤖 **Handles multiple events** - Works on issues, PRs, and comments
- 📖 **Guideline integration** - Uses your repository's CONTRIBUTING.md file

### Setup Options

- **Basic setup**: Install the GitHub App for comment-based guidance
- **Enhanced enforcement**: Add the validation workflow to trigger CI checks

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
