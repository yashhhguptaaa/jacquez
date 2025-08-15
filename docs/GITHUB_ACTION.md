# Jacquez GitHub Action

This document explains how to use Jacquez as a GitHub Action for Pull Request validation.

## Overview

The Jacquez GitHub Action provides an alternative to webhook-based commenting by running as part of your CI/CD pipeline. Instead of posting comments, it **fails the build** when PR guidelines violations are detected, making violations more visible and reducing GitHub notifications.

## Features

- ✅ **Validates PR descriptions** against contributing guidelines
- ✅ **Performs line-by-line code review** of changed files
- ✅ **Fails CI builds** for guideline violations (red ❌ instead of comments)
- ✅ **Provides detailed violation reports** in action logs
- ✅ **Supports bypass mechanism** via "aside" keyword
- ✅ **Skips bots and draft PRs** automatically

## Setup

### 1. Add the Workflow File

The workflow is already included in this repository at `.github/workflows/jacquez-pr-check.yml`. To use it in other repositories, copy this file to their `.github/workflows/` directory.

### 2. Configure Secrets

Add the following secrets to your repository settings (`Settings > Secrets and variables > Actions`):

| Secret Name         | Description                                   | Required |
| ------------------- | --------------------------------------------- | -------- |
| `ANTHROPIC_API_KEY` | Your Anthropic Claude API key                 | ✅ Yes   |
| `GH_APP_ID`         | GitHub App ID (if using app auth)             | Optional |
| `GH_PRIVATE_KEY`    | GitHub App private key (if using app auth)    | Optional |
| `GH_WEBHOOK_SECRET` | GitHub App webhook secret (if using app auth) | Optional |

**Note**: The `GITHUB_TOKEN` is automatically provided by GitHub Actions.

### 3. Contributing Guidelines

Ensure your repository has contributing guidelines in one of these locations:

- `CONTRIBUTING.md`
- `CONTRIBUTING`
- `.github/CONTRIBUTING.md`

## How It Works

### Trigger Events

The action runs on the following pull request events:

- `opened` - When a new PR is created
- `edited` - When PR title or description is updated
- `synchronize` - When new commits are pushed to the PR

### Validation Process

1. **Pre-checks**: Skips bots, drafts, and PRs with "aside" keyword
2. **Guidelines Check**: Analyzes PR description against contributing guidelines
3. **Code Review**: Examines changed lines in all modified files
4. **Result**: Fails the build if violations are found, passes if clean

### Example Output

#### ✅ Success (Passing Build)

```
🎉 Great job! Your PR follows all the contributing guidelines.
```

#### ❌ Failure (Failing Build)

```
🚨 VIOLATIONS DETECTED:

1. PR Description: Missing "why" section explaining the business case
2. PR Description: No visual documentation (before/after screenshots) provided
3. src/components/Button.tsx:42 - Consider adding proper error handling for this API call
4. tests/Button.test.ts:15 - Missing test coverage for edge case scenarios

📖 Please review the contributing guidelines and fix the issues above.
💡 To bypass this check temporarily, include the word 'aside' in your PR description.
```

## Configuration

### Environment Variables

You can customize the action behavior with these environment variables in the workflow:

```yaml
env:
  MAX_TOKENS: "500" # Claude response length (default: 300)
  MIN_COMMENT_LENGTH: "10" # Minimum comment length to analyze (default: 3)
  ENABLE_DETAILED_LOGGING: "true" # Verbose logging (default: false)
  AI_MODEL: "claude-sonnet-4-20250514" # Claude model to use
```

### Bypass Mechanism

To temporarily bypass the checks (useful for urgent fixes):

1. Include the word "aside" anywhere in your PR description
2. The action will skip all checks and pass

## Comparison: Action vs Webhook

| Feature           | GitHub Action            | Webhook (Current)                 |
| ----------------- | ------------------------ | --------------------------------- |
| **Visibility**    | ❌ Red build status      | 💬 Comment notifications          |
| **Notifications** | None (just build status) | Creates GitHub notifications      |
| **Integration**   | Native CI/CD pipeline    | External service dependency       |
| **Performance**   | Runs only on PR events   | Always-on server required         |
| **Cost**          | GitHub Actions minutes   | Server hosting costs              |
| **Setup**         | Copy workflow file       | Deploy & configure webhook server |

## Migration from Webhook

To migrate from webhook-based to action-based checking:

1. **Keep both running** initially to compare behavior
2. **Add the workflow file** to your repository
3. **Test with a few PRs** to ensure it works as expected
4. **Disable webhook events** in your GitHub App settings:
   - Uncheck "Pull requests" and "Issues" events
5. **Keep the webhook server** running for issue comment moderation (optional)

## Troubleshooting

### Action Fails with "No pull request found in context"

- Ensure the workflow is triggered by `pull_request` events
- Check that the workflow file is in the correct location

### "No contributing guidelines found"

- Verify your repository has a `CONTRIBUTING.md` file
- Check the file is in the repository root or `.github/` directory

### "Error occurred during analysis"

- Check that `ANTHROPIC_API_KEY` secret is correctly set
- Verify your Anthropic API key has sufficient credits
- Review action logs for detailed error messages

### Action times out

- Reduce `MAX_TOKENS` to speed up AI responses
- Consider increasing GitHub Actions timeout in workflow

## Advanced Usage

### Custom Workflow File

You can create a custom workflow with additional steps:

```yaml
name: Custom Jacquez Check

on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Your existing tests
      - name: Run Tests
        run: npm test

      # Jacquez guidelines check
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Jacquez Guidelines Check
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_CONTEXT: ${{ toJson(github) }}
          # ... other env vars
        run: npx tsx scripts/jacquez-action.ts
```

### Integration with Branch Protection

To make guideline compliance mandatory:

1. Go to `Settings > Branches` in your repository
2. Add a branch protection rule for your main branch
3. Enable "Require status checks to pass before merging"
4. Select "Jacquez PR Guidelines Check" from the list
5. Save the rule

Now PRs cannot be merged until they pass the Jacquez check.

## Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting) above
2. Review action logs for detailed error messages
3. Open an issue in this repository with:
   - Your workflow file
   - Action logs (remove sensitive information)
   - Description of expected vs actual behavior

## Future Enhancements

Planned improvements:

- [ ] Support for multiple contributing guideline files
- [ ] Configurable severity levels (warning vs error)
- [ ] Integration with GitHub Checks API for richer reporting
- [ ] Custom rule definitions beyond contributing guidelines
- [ ] Support for organization-level shared guidelines
