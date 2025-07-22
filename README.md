# Jacquez

A friendly moderator for OSS repos

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

Edit `.env` with your credentials:

```env
# GitHub App Configuration
GH_APP_ID=your_app_id
GH_WEBHOOK_SECRET=your_webhook_secret
GH_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...your private key content here...
-----END RSA PRIVATE KEY-----"
PORT=3000

# Smee.io webhook URL for local development
WEBHOOK_URL=https://smee.io/your_channel_id

# Anthropic API key
ANTHROPIC_API_KEY=your_anthropic_api_key
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
