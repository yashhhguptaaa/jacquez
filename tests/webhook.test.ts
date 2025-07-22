import { jest } from '@jest/globals';
import { parseAIResponse } from '../utils/jsonParser';

describe('generateFriendlyResponse integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('parseAIResponse handles valid AI response', () => {
    const aiResponse = '"comment_needed": true, "comment": "Please add more details", "reasoning": "Missing info"';
    const result = parseAIResponse(aiResponse);

    expect(result.comment_needed).toBe(true);
    expect(result.comment).toBe("Please add more details");
    expect(result.reasoning).toBe("Missing info");
  });

  test('parseAIResponse handles malformed AI response', () => {
    const aiResponse = '"comment_needed": true, "comment": "Please add';
    const result = parseAIResponse(aiResponse);

    expect(result.comment_needed).toBe(true);
    expect(result.comment).toBe("Please add");
    expect(result.reasoning).toBe("Repaired from malformed JSON response");
  });

  test('parseAIResponse handles completely invalid response', () => {
    const aiResponse = 'This is not JSON at all';
    const result = parseAIResponse(aiResponse);

    expect(result.comment_needed).toBe(false);
    expect(result.comment).toBe("");
    expect(result.reasoning).toBe("Failed to parse JSON response, skipping comment to avoid posting malformed content");
  });

  test('parseAIResponse respects NO_COMMENT_NEEDED signal', () => {
    const aiResponse = 'NO_COMMENT_NEEDED - everything looks good';
    const result = parseAIResponse(aiResponse);

    expect(result.comment_needed).toBe(false);
    expect(result.comment).toBe("");
  });
});
