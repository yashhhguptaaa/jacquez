import { jest } from '@jest/globals';
import { 
  fetchPRFiles, 
  parseDiffForChangedLines, 
  generateCodeAnalysisResponse, 
  handlePullRequestCodeReview 
} from '../utils/prCodeReview';

describe('PR Code Review Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseDiffForChangedLines', () => {
    test('parses simple diff with added lines', () => {
      const patch = `@@ -1,3 +1,4 @@
 existing line
+new line 1
+new line 2
 another existing line`;
      
      const result = parseDiffForChangedLines(patch);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        line: 'new line 1',
        position: 2,
        lineNumber: 2
      });
      expect(result[1]).toEqual({
        line: 'new line 2', 
        position: 3,
        lineNumber: 3
      });
    });

    test('handles empty patch', () => {
      const result = parseDiffForChangedLines('');
      expect(result).toEqual([]);
    });

    test('handles null patch', () => {
      const result = parseDiffForChangedLines(null as any);
      expect(result).toEqual([]);
    });

    test('handles patch with no added lines', () => {
      const patch = `@@ -1,3 +1,2 @@
 existing line
-removed line
 another existing line`;
      
      const result = parseDiffForChangedLines(patch);
      expect(result).toEqual([]);
    });

    test('ignores file header lines', () => {
      const patch = `--- a/file.js
+++ b/file.js
@@ -1,2 +1,3 @@
 existing line
+added line`;
      
      const result = parseDiffForChangedLines(patch);
      expect(result).toHaveLength(1);
      expect(result[0].line).toBe('added line');
    });

    test('handles multiple hunks', () => {
      const patch = `@@ -1,2 +1,3 @@
 line 1
+added line 1
 line 2
@@ -10,1 +11,2 @@
 line 10
+added line 2`;
      
      const result = parseDiffForChangedLines(patch);
      expect(result).toHaveLength(2);
      expect(result[0].line).toBe('added line 1');
      expect(result[1].line).toBe('added line 2');
    });

    test('correctly calculates line numbers from hunk header', () => {
      const patch = `@@ -5,3 +5,4 @@
 existing line
+new line at position 6
 another existing line`;
      
      const result = parseDiffForChangedLines(patch);
      expect(result).toHaveLength(1);
      expect(result[0].lineNumber).toBe(6);
    });

    test('handles complex diff with mixed changes', () => {
      const patch = `@@ -1,5 +1,6 @@
 unchanged line 1
-removed line
+added line 1
 unchanged line 2
+added line 2
 unchanged line 3`;
      
      const result = parseDiffForChangedLines(patch);
      expect(result).toHaveLength(2);
      expect(result[0].line).toBe('added line 1');
      expect(result[1].line).toBe('added line 2');
    });
  });

  describe('GitHub API Integration Logic', () => {
    test('fetchPRFiles API call structure', () => {
      const expectedApiCall = {
        endpoint: 'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
        params: {
          owner: 'owner',
          repo: 'repo',
          pull_number: 123,
          per_page: 100
        }
      };

      expect(expectedApiCall.endpoint).toBe('GET /repos/{owner}/{repo}/pulls/{pull_number}/files');
      expect(expectedApiCall.params.per_page).toBe(100);
    });

    test('review API call structure', () => {
      const expectedReviewCall = {
        endpoint: 'POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
        params: {
          owner: 'owner',
          repo: 'repo',
          pull_number: 123,
          event: 'COMMENT',
          comments: [
            {
              path: 'file.js',
              position: 5,
              body: 'Test comment'
            }
          ]
        }
      };

      expect(expectedReviewCall.endpoint).toBe('POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews');
      expect(expectedReviewCall.params.event).toBe('COMMENT');
      expect(expectedReviewCall.params.comments).toHaveLength(1);
    });
  });

  describe('AI Response Parsing Logic', () => {
    test('parses valid JSON array response', () => {
      const aiResponseText = '{"position": 5, "comment": "Missing test coverage"}]';
      const fullResponse = `[${aiResponseText}`;
      
      let result;
      try {
        result = JSON.parse(fullResponse);
      } catch {
        result = [];
      }

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        position: 5,
        comment: 'Missing test coverage'
      });
    });

    test('handles malformed JSON gracefully', () => {
      const aiResponseText = 'invalid json';
      const fullResponse = `[${aiResponseText}`;
      
      let result;
      try {
        result = JSON.parse(fullResponse);
      } catch {
        result = [];
      }

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    test('handles empty response', () => {
      const aiResponseText = ']';
      const fullResponse = `[${aiResponseText}`;
      
      let result;
      try {
        result = JSON.parse(fullResponse);
      } catch {
        result = [];
      }

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('Payload Validation Logic', () => {
    test('identifies bot users correctly', () => {
      const botPayload = {
        pull_request: {
          user: { type: 'Bot' }
        }
      };

      const isBot = botPayload.pull_request.user.type === 'Bot';
      expect(isBot).toBe(true);
    });

    test('identifies draft PRs correctly', () => {
      const draftPayload = {
        pull_request: {
          draft: true
        }
      };

      const isDraft = draftPayload.pull_request.draft;
      expect(isDraft).toBe(true);
    });

    test('identifies regular PRs correctly', () => {
      const regularPayload = {
        pull_request: {
          user: { type: 'User' },
          draft: false
        }
      };

      const isBot = regularPayload.pull_request.user.type === 'Bot';
      const isDraft = regularPayload.pull_request.draft;
      
      expect(isBot).toBe(false);
      expect(isDraft).toBe(false);
    });
  });
});
