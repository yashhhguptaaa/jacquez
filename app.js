import dotenv from "dotenv";
import {App} from "octokit";
import {createNodeMiddleware} from "@octokit/webhooks";
import http from "http";
import fs from "fs";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

// Get credentials from environment variables
const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

// Read private key from file
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Create GitHub App instance
const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret
  }
});

// Helper function to load contributing.md from repository
async function loadContributingGuidelines(octokit, owner, repo) {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: owner,
      repo: repo,
      path: "CONTRIBUTING.md"
    });

    if (response.data.content) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    }
  } catch (error) {
    // Try alternative paths
    const altPaths = ["contributing.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"];
    for (const path of altPaths) {
      try {
        const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
          owner: owner,
          repo: repo,
          path: path
        });
        if (response.data.content) {
          return Buffer.from(response.data.content, 'base64').toString('utf-8');
        }
      } catch (e) {
        // Continue to next path
      }
    }
  }
  return null;
}


// Helper function to generate friendly response using Claude
async function generateFriendlyResponse(contributingContent, submissionContent, submissionType) {
  try {
    const prompt = `You are a friendly GitHub bot helping contributors follow project guidelines.

Contributing guidelines:
${contributingContent}

Submission type: ${submissionType}
Submission content:
${submissionContent}

Analyze the submission against the contributing guidelines and provide an appropriate response:

If the submission appears to follow the guidelines well:
- Thank them for their contribution
- Acknowledge what they did well
- Provide encouraging feedback
- Welcome them to the project

If the submission appears to be missing some requirements from the guidelines:
- Thank them for their contribution
- Gently remind them about the missing requirements based on the guidelines
- Explain why following the guidelines is important
- Provide clear next steps
- Maintain an encouraging tone

Keep the response concise but warm.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return `Thanks for your ${submissionType}! 😊 I noticed it might be missing some requirements from our contributing guidelines. Could you please review the guidelines and add any missing documentation? This helps reviewers understand your changes better. Thanks!`;
  }
}

// Handle pull request opened events
async function handlePullRequestOpened({octokit, payload}) {
  console.log(`Pull request opened: ${payload.pull_request.html_url}`);

  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const prNumber = payload.pull_request.number;
  const prBody = payload.pull_request.body || '';

  // Load contributing guidelines
  const contributingContent = await loadContributingGuidelines(octokit, owner, repo);

  if (contributingContent) {
    // Generate friendly response using Claude
    const response = await generateFriendlyResponse(contributingContent, prBody, 'pull request');

    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: owner,
      repo: repo,
      issue_number: prNumber,
      body: response
    });
  } else {
    // No contributing guidelines found, send generic welcome
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: owner,
      repo: repo,
      issue_number: prNumber,
      body: "Hello! Thanks for opening this pull request. 🤖"
    });
  }
}

// Handle pull request closed events
async function handlePullRequestClosed({octokit, payload}) {
  console.log(`Pull request closed: ${payload.pull_request.html_url}`);

  if (payload.pull_request.merged) {
    console.log("Pull request was merged!");
  } else {
    console.log("Pull request was closed without merging.");
  }
}

// Handle issues opened events
async function handleIssueOpened({octokit, payload}) {
  console.log(`Issue opened: ${payload.issue.html_url}`);

  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const issueNumber = payload.issue.number;
  const issueBody = payload.issue.body || '';

  // Load contributing guidelines
  const contributingContent = await loadContributingGuidelines(octokit, owner, repo);

  if (contributingContent) {
    // Generate friendly response using Claude
    const response = await generateFriendlyResponse(contributingContent, issueBody, 'issue');

    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      body: response
    });
  } else {
    // No contributing guidelines found, send generic welcome
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      body: "Hello! Thanks for opening this issue. We'll take a look at it soon. 🤖"
    });
  }
}

// Handle issue comment events
async function handleIssueCommentCreated({octokit, payload}) {
  console.log(`Issue comment created: ${payload.comment.html_url}`);
  console.log(`Comment body: "${payload.comment.body}"`);
  console.log(`Comment author: ${payload.comment.user.login} (type: ${payload.comment.user.type})`);

  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const issueNumber = payload.issue.number;
  const commentBody = payload.comment.body || '';

  // Skip if comment is from the bot itself
  if (payload.comment.user.type === 'Bot') {
    console.log('Skipping bot comment');
    return;
  }

  // Load contributing guidelines
  const contributingContent = await loadContributingGuidelines(octokit, owner, repo);
  console.log(`Contributing guidelines loaded: ${contributingContent ? 'YES' : 'NO'}`);

  if (contributingContent) {
    // For debugging, respond to any comment that's not too short
    if (commentBody.length > 3) {
      console.log('Generating response for comment');
      try {
        // Generate response using Claude to check against guidelines
        const response = await generateFriendlyResponse(contributingContent, commentBody, 'comment');
        console.log(`Generated response: ${response}`);

        await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
          owner: owner,
          repo: repo,
          issue_number: issueNumber,
          body: response
        });
        console.log('Comment posted successfully');
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    } else {
      console.log('Comment too short, skipping');
    }
  } else {
    console.log('No contributing guidelines found');
  }
}

// Register event listeners
app.webhooks.on("pull_request.opened", handlePullRequestOpened);
app.webhooks.on("pull_request.closed", handlePullRequestClosed);
app.webhooks.on("issues.opened", handleIssueOpened);
app.webhooks.on("issue_comment.created", handleIssueCommentCreated);

// Create middleware to handle webhook events
const middleware = createNodeMiddleware(app.webhooks, {path: "/webhook"});

// Create HTTP server
const server = http.createServer(middleware);

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`GitHub App server is running on port ${port}`);
  console.log(`Webhook URL: http://localhost:${port}/webhook`);
});
