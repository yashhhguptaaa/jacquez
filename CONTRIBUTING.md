# Contributing to Jacquez

Thanks for your interest in contributing! This document will help you get started.

## Quick Start

1. Set up the repository

```bash
git clone https://github.com/antiwork/jacquez.git
```

2. Set up your development environment

For detailed instructions on setting up your local development environment, please refer to our [README](README.md).

## Development

1. Create your feature branch

```bash
git checkout -b feature/your-feature
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials as described in the README.

4. Start the development environment

```bash
npm run dev
```

5. Run the test suite

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Issue Requirements

All issues must include both a **"what"** and a **"why"** section:

- **What**: Clearly describe what you want to happen, what's broken, or what feature you're requesting
- **Why**: Explain the reasoning, business case, or problem this solves

Example:
```markdown
## What
Add validation to ensure pull requests have linked issues before allowing merge.

## Why
Currently PRs can be merged without addressing any tracked work, making it difficult to maintain project roadmap and ensure all changes are properly documented and reviewed.
```

## Pull Request Requirements

All pull requests must meet these requirements:

1. **Close an existing issue**: Every PR must reference and close an existing issue using `Closes #123` or `Fixes #456` in the description
2. **Include visual documentation**: For any UI changes or new features, provide:
   - **Before screenshots/video**: Show the current state
   - **After screenshots/video**: Show your changes
3. **Test suite must pass**: All tests must pass before merge
   - If CI fails due to missing keys or environment issues, run tests locally and include a screenshot of the **complete test suite passing** in your PR description
4. Update documentation if you're changing behavior
5. Add or update tests for your changes
6. Use native-sounding English in all communication with no excessive capitalization (e.g HOW IS THIS GOING), multiple question marks (how's this going???), grammatical errors (how's dis going), or typos (thnx fr update).
   - ❌ Before: "is this still open ?? I am happy to work on it ??"
   - ✅ After: "Is this actively being worked on? I've started work on it here…"
7. Run linting and formatting checks:
   ```bash
   npm run lint
   ```
8. Request a review from maintainers
9. After reviews begin, avoid force-pushing to your branch
   - Force-pushing rewrites history and makes review threads hard to follow
   - Don't worry about messy commits - we squash everything when merging to main
10. The PR will be merged once you have the sign-off of at least one other developer

## Testing Guidelines

- Write descriptive test names that explain the behavior being tested
- Keep tests independent and isolated
- Test both happy path and edge cases
- For webhook handlers, test different event types and payloads
- Mock external API calls (GitHub, Anthropic) in tests
- We use Jest for unit testing

### Running Tests Locally

If CI fails due to environment issues (missing API keys, etc.), you must run the full test suite locally and provide proof:

```bash
npm run test:coverage
```

Take a screenshot of the complete test output showing all tests passing and include it in your PR description.

## Style Guide

- Follow the existing code patterns
- Use clear, descriptive variable names
- Write TypeScript for all code
- Follow Next.js and React best practices
- Use functional components and hooks
- Handle errors gracefully, especially for external API calls
- Log important events for debugging webhook processing

## Writing Bug Reports

A great bug report includes:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Include webhook payloads or GitHub events if relevant
- What you expected would happen
- What actually happens
- Relevant logs or error messages
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Writing commit messages

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

A commit message should be structured as follows:

```bash
type(scope): title

description
```

Where type can be:

- `feat`: new feature or enhancement
- `fix`: bug fixes
- `docs`: documentation-only changes
- `test`: test-only changes
- `refactor`: code improvements without behaviour changes
- `chore`: maintenance/anything else

Example:

```
feat(webhook): Add support for pull request review events
```

## Help

- Check existing discussions/issues/PRs before creating new ones
- Start a discussion for questions or ideas
- Open an [issue](https://github.com/antiwork/jacquez/issues) for bugs or problems
- Any issue with label `help wanted` is open for contributions

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE.md).
