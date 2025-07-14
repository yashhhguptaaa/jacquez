# GitHub App - Contributing Guidelines Bot

A GitHub App that automatically validates submissions against repository contributing guidelines using AI-powered analysis.

## Features

- **Automatic Validation**: Checks pull requests, issues, and comments against contributing guidelines
- **AI-Powered**: Uses Claude AI to provide contextual, friendly feedback
- **Contributing Guidelines Detection**: Automatically loads `CONTRIBUTING.md` from repositories
- **Webhook Support**: Responds to GitHub webhook events in real-time
- **Friendly Feedback**: Provides encouraging responses and gentle reminders

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
APP_ID=your_app_id
WEBHOOK_SECRET=your_webhook_secret
PRIVATE_KEY_PATH=/path/to/your/private-key.pem
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
4. Download the private key and update `PRIVATE_KEY_PATH` in `.env`

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

### Manual Testing

1. **Install your GitHub App** on a test repository
2. **Create a CONTRIBUTING.md** file with guidelines (e.g., requiring screenshots)
3. **Open an issue** without following the guidelines
4. **Check the logs** for detailed processing information
5. **Verify the bot response** appears as a comment

### Expected Behavior

The bot will:
- Load `CONTRIBUTING.md` from the repository
- Analyze the submission against the guidelines
- Post a friendly comment if guidelines aren't followed
- Provide encouragement if guidelines are followed

## Webhook Events

The app responds to these GitHub webhook events:

- `issues.opened` - When an issue is created
- `pull_request.opened` - When a PR is opened
- `issue_comment.created` - When someone comments on an issue

## Configuration

### Contributing Guidelines Detection

The app automatically searches for contributing guidelines in these locations:
- `CONTRIBUTING.md`
- `contributing.md`
- `.github/CONTRIBUTING.md`
- `docs/CONTRIBUTING.md`

### AI Response Customization

The AI responses are generated using Claude and can be customized by modifying the prompt in the `generateFriendlyResponse` function.

## Troubleshooting

### Common Issues

1. **No comments appearing**:
   - Check that the Anthropic API key is valid
   - Verify the GitHub App has proper permissions
   - Ensure webhook events are being received (check logs)

2. **Webhook not received**:
   - Verify Smee.io channel is correct
   - Check that the GitHub App webhook URL is properly configured
   - Ensure the app is running and accessible

3. **API errors**:
   - Check that all environment variables are set correctly
   - Verify the private key file exists and is readable
   - Ensure the GitHub App ID and webhook secret are correct

### Debug Mode

The app includes comprehensive logging. Check the console output for:
- Webhook event details
- Contributing guidelines loading status
- AI response generation
- API call results

### Log Output Example

```
Issue comment created: https://github.com/owner/repo/issues/1#issuecomment-123
Comment body: "test"
Comment author: username (type: User)
Contributing guidelines loaded: YES
Generating response for comment
Generated response: Thanks for your comment! ...
Comment posted successfully
```

## Development

### Project Structure

```
jacquez/
├── app.js              # Main application file
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
├── .env                # Your local environment variables (not committed)
└── README.md          # This file
```

### Key Functions

- `loadContributingGuidelines()` - Loads CONTRIBUTING.md from repositories
- `generateFriendlyResponse()` - Uses AI to generate contextual responses
- `handleIssueOpened()` - Processes new issues
- `handlePullRequestOpened()` - Processes new pull requests
- `handleIssueCommentCreated()` - Processes issue comments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.