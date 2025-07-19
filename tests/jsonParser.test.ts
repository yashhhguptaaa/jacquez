import { parseAIResponse } from '../utils/jsonParser';

describe('parseAIResponse', () => {
  test('parses valid JSON response correctly', () => {
    const aiResponse = '"comment_needed": true, "comment": "Please add more details", "reasoning": "Missing required information"';
    const result = parseAIResponse(aiResponse);
    
    expect(result.comment_needed).toBe(true);
    expect(result.comment).toBe("Please add more details");
    expect(result.reasoning).toBe("Missing required information");
  });

  test('handles malformed JSON with jsonrepair', () => {
    const aiResponse = '"comment_needed": true, "comment": "Please add more details", "reasoning": "Missing info"';
    const result = parseAIResponse(aiResponse);
    
    expect(result.comment_needed).toBe(true);
    expect(result.comment).toBe("Please add more details");
  });

  test('handles escaped quotes in comment field', () => {
    const aiResponse = '"comment_needed": true, "comment": "Please use \\"proper\\" formatting", "reasoning": "Format issue"';
    const result = parseAIResponse(aiResponse);
    
    expect(result.comment_needed).toBe(true);
    expect(result.comment).toBe('Please use "proper" formatting');
  });

  test('handles NO_COMMENT_NEEDED signal in unparseable response', () => {
    const aiResponse = 'NO_COMMENT_NEEDED - submission looks good';
    const result = parseAIResponse(aiResponse);
    
    expect(result.comment_needed).toBe(false);
    expect(result.comment).toBe("");
  });

  test('defaults to no comment for completely unparseable response', () => {
    const aiResponse = 'completely invalid response format';
    const result = parseAIResponse(aiResponse);
    
    expect(result.comment_needed).toBe(false);
    expect(result.comment).toBe("");
    expect(result.reasoning).toBe("Failed to parse JSON response, skipping comment to avoid posting malformed content");
  });

  test('handles empty response', () => {
    const aiResponse = '';
    const result = parseAIResponse(aiResponse);
    
    expect(result.comment_needed).toBe(false);
    expect(result.comment).toBe("");
  });

  test('handles response with only comment_needed field', () => {
    const aiResponse = '"comment_needed": false';
    const result = parseAIResponse(aiResponse);
    
    expect(result.comment_needed).toBe(false);
    expect(result.comment).toBe("");
    expect(result.reasoning).toBe("Repaired from malformed JSON response");
  });

  test('handles truncated JSON response', () => {
    const aiResponse = '"comment_needed": true, "comment": "Please add';
    const result = parseAIResponse(aiResponse);
    
    expect(result.comment_needed).toBe(true);
    expect(result.comment).toBe("Please add");
    expect(result.reasoning).toBe("Repaired from malformed JSON response");
  });

  test('handles response with newlines in comment', () => {
    const aiResponse = '"comment_needed": true, "comment": "Line 1\\nLine 2", "reasoning": "Multi-line comment"';
    const result = parseAIResponse(aiResponse);
    
    expect(result.comment_needed).toBe(true);
    expect(result.comment).toBe("Line 1\nLine 2");
    expect(result.reasoning).toBe("Multi-line comment");
  });
});
