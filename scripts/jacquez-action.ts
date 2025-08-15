#!/usr/bin/env node

import { Octokit } from "octokit";
import Anthropic from "@anthropic-ai/sdk";
import {
  fetchPRFiles,
  parseDiffForChangedLines,
  generateCodeAnalysisResponse,
} from "../utils/prCodeReview";

const config = {
  maxTokens: parseInt(process.env.MAX_TOKENS || "300"),
  aiModel: process.env.AI_MODEL || "claude-sonnet-4-20250514",
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface GuidelineResponse {
  violations_found: boolean;
  violations: string[];
  summary: string;
}

interface CodeViolation {
  file: string;
  line: number;
  comment: string;
}

interface PRContext {
  owner: string;
  repo: string;
  prNumber: number;
  title: string;
  body: string;
  userType: string;
  draft: boolean;
}

function log(level: string, message: string, data: any = null): void {
  if (level === "ERROR") {
    const timestamp = new Date().toISOString();
    if (data) {
      console.error(
        `[${timestamp}] ERROR: ${message}`,
        JSON.stringify(data, null, 2)
      );
    } else {
      console.error(`[${timestamp}] ERROR: ${message}`);
    }
  }
}

async function loadContributingGuidelines(
  owner: string,
  repo: string
): Promise<string | null> {
  const files = ["CONTRIBUTING.md", "CONTRIBUTING", ".github/CONTRIBUTING.md"];

  for (const file of files) {
    try {
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner,
          repo,
          path: file,
        }
      );

      if (
        response.data &&
        "content" in response.data &&
        response.data.content
      ) {
        const content = Buffer.from(response.data.content, "base64").toString(
          "utf-8"
        );
        return content;
      }
    } catch (error) {
      continue;
    }
  }

  return null;
}

async function generateGuidelineResponse(
  contributingContent: string,
  submissionContent: string,
  submissionType: string,
  repoInfo: any = null
): Promise<GuidelineResponse> {
  try {
    const systemPrompt = `You are a GitHub Action that enforces contributing guidelines. Analyze the submission and identify specific violations.

DO NOT flag for:
- Minor style, grammar, or formatting issues
- Casual but professional language
- Submissions that mostly follow guidelines

Response format (JSON):
- violations_found: boolean (true only for clear violations)
- violations: array of strings (specific issues that must be fixed)
- summary: string (brief explanation)

If there are violations, list them specifically and actionably.`;

    const messages: Anthropic.Messages.MessageParam[] = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Contributing guidelines:\n${contributingContent}`,
            cache_control: { type: "ephemeral" },
          },
          {
            type: "text",
            text: `Submission type: ${submissionType}
Submission content:
${submissionContent}`,
          },
        ],
      },
      {
        role: "assistant",
        content: "{",
      },
    ];

    const response = await anthropic.messages.create({
      model: config.aiModel,
      max_tokens: config.maxTokens,
      system: systemPrompt,
      messages: messages,
    });

    const aiResponse =
      response.content[0].type === "text" ? response.content[0].text : "";

    try {
      const result = JSON.parse(`{${aiResponse}`);
      return {
        violations_found: result.violations_found || false,
        violations: result.violations || [],
        summary: result.summary || "",
      };
    } catch (parseError) {
      log("ERROR", "Failed to parse AI response", { aiResponse });
      return {
        violations_found: false,
        violations: [],
        summary: "Error parsing AI response, allowing submission",
      };
    }
  } catch (error: any) {
    log("ERROR", `Error generating guideline response for ${submissionType}`, {
      error: error.message,
      repoInfo,
    });

    return {
      violations_found: false,
      violations: [],
      summary:
        "Error occurred during analysis, allowing submission to avoid blocking valid PRs",
    };
  }
}

async function analyzePRCode(
  owner: string,
  repo: string,
  prNumber: number,
  contributingContent: string
): Promise<CodeViolation[]> {
  try {
    const prFiles = await fetchPRFiles(octokit, owner, repo, prNumber);
    const allViolations: CodeViolation[] = [];

    for (const file of prFiles) {
      if (!file.patch) continue;

      const changedLines = parseDiffForChangedLines(file.patch);
      if (changedLines.length === 0) continue;

      const codeAnalysis = await generateCodeAnalysisResponse(
        contributingContent,
        file.filename,
        changedLines,
        { owner, repo, prNumber },
        anthropic,
        config
      );

      for (const analysis of codeAnalysis) {
        if (analysis.position !== undefined && analysis.comment) {
          allViolations.push({
            file: file.filename,
            line: analysis.position,
            comment: analysis.comment,
          });
        }
      }
    }

    return allViolations;
  } catch (error: any) {
    log("ERROR", "Error analyzing PR code", { error: error.message });
    return [];
  }
}

function getPRContext(): PRContext {
  const context = JSON.parse(process.env.GITHUB_CONTEXT || "{}");
  const { repository, pull_request } = context.event || {};

  if (!pull_request || !repository) {
    throw new Error("No pull request found in GitHub context");
  }

  return {
    owner: repository.owner.login,
    repo: repository.name,
    prNumber: pull_request.number,
    title: pull_request.title || "",
    body: pull_request.body || "",
    userType: pull_request.user.type || "User",
    draft: pull_request.draft || false,
  };
}

async function main(): Promise<void> {
  try {
    const prContext = getPRContext();

    if (prContext.userType === "Bot") {
      process.exit(0);
    }

    if (prContext.draft) {
      process.exit(0);
    }

    if (prContext.body.toLowerCase().includes("aside")) {
      process.exit(0);
    }

    const contributingContent = await loadContributingGuidelines(
      prContext.owner,
      prContext.repo
    );

    if (!contributingContent) {
      process.exit(0);
    }

    let hasViolations = false;
    const allViolations: string[] = [];
    const descriptionAnalysis = await generateGuidelineResponse(
      contributingContent,
      prContext.body,
      "pull request",
      {
        owner: prContext.owner,
        repo: prContext.repo,
        prNumber: prContext.prNumber,
      }
    );

    if (descriptionAnalysis.violations_found) {
      hasViolations = true;
      allViolations.push(
        ...descriptionAnalysis.violations.map((v) => `PR Description: ${v}`)
      );
    }

    const codeViolations = await analyzePRCode(
      prContext.owner,
      prContext.repo,
      prContext.prNumber,
      contributingContent
    );

    if (codeViolations.length > 0) {
      hasViolations = true;
      codeViolations.forEach((violation) => {
        allViolations.push(
          `${violation.file}:${violation.line} - ${violation.comment}`
        );
      });
    }

    if (hasViolations) {
      console.log("\n🚨 VIOLATIONS DETECTED:\n");

      allViolations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation}`);
      });

      console.log(
        `\n📖 Please review the contributing guidelines and fix the issues above.`
      );
      console.log(
        `💡 To bypass this check temporarily, include the word 'aside' in your PR description.`
      );

      process.exit(1);
    } else {
      console.log(
        "\n🎉 Great job! Your PR follows all the contributing guidelines."
      );
      process.exit(0);
    }
  } catch (error: any) {
    log("ERROR", "Unexpected error in Jacquez action", {
      error: error.message,
      stack: error.stack,
    });

    console.log(
      "\n⚠️  An error occurred during guidelines checking, but the PR is being allowed through."
    );
    console.log(
      "If you believe this is a bug, please report it to the repository maintainers."
    );
    process.exit(0);
  }
}

if (!process.env.GITHUB_CONTEXT) {
  process.env.GITHUB_CONTEXT = JSON.stringify({
    event: {
      repository: {
        owner: { login: process.env.GITHUB_REPOSITORY_OWNER },
        name: process.env.GITHUB_REPOSITORY?.split("/")[1],
      },
      pull_request: {
        number: parseInt(process.env.GITHUB_PR_NUMBER || "0"),
        title: process.env.GITHUB_PR_TITLE,
        body: process.env.GITHUB_PR_BODY,
        user: { type: process.env.GITHUB_PR_USER_TYPE || "User" },
        draft: process.env.GITHUB_PR_DRAFT === "true",
      },
    },
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
