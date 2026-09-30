import { describe, it, expect } from 'vitest';
import { editorialQAService } from './editorial-qa.service';
import { promptStageService } from './prompt-stage.service';

describe('Editorial QA & Prompt Stage Service', () => {
  it('should issue a HARD_BLOCK if article word count is below 2,000 words', () => {
    // Generate dummy short article content (< 1,000 words)
    const shortContent = `
# Best Loom Alternatives for Small Teams

## Introduction
Short intro text.

## TL;DR
- **Demoly**: Best walkthroughs

## Visual Reference
[Visual callout description]

## Why Small Teams Outgrow Loom
Brief section text.

## What Small Teams Should Look for
Brief criteria text.

## The Best Loom Alternatives
### 1. Demoly
Demoly profile text.

## Feature and Use-Case Comparison Matrix
<table><tr><th>Tool</th></tr><tr><td>Demoly</td></tr></table>

## Which Tool Should You Choose
Conclusion text.

## Frequently Asked Questions
### Question 1?
Answer 1.
### Question 2?
Answer 2.
### Question 3?
Answer 3.
### Question 4?
Answer 4.
### Question 5?
Answer 5.
`;

    const result = editorialQAService.validateArticle(shortContent, 'Best Loom Alternatives for Small Teams');

    expect(result.passed).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/HARD_BLOCK: Article word count .* is materially below the 2,400-2,600 word target/),
      ])
    );
  });

  it('should pass word count check when article is within the 2,400-2,600 word target', () => {
    // Generate dummy long text (~2,500 words)
    const wordsArray = new Array(2500).fill('word');
    const longProse = wordsArray.join(' ');

    const fullContent = `
# Best Loom Alternatives for Small Teams

## Introduction
${longProse.slice(0, 1000)}

## TL;DR
- **Demoly**: Best walkthroughs

## Visual Reference
[Visual callout description]

## Why Small Teams Outgrow Loom
${longProse.slice(1000, 2500)}

## What Small Teams Should Look for
${longProse.slice(2500, 4000)}

## The Best Loom Alternatives
### 1. Demoly
${longProse.slice(4000, 8000)}

## Feature and Use-Case Comparison Matrix
<table><tr><th>Tool</th></tr><tr><td>Demoly</td></tr></table>

## Which Tool Should You Choose
${longProse.slice(8000, 10000)}

## Frequently Asked Questions
### Question 1?
Answer 1.
### Question 2?
Answer 2.
### Question 3?
Answer 3.
### Question 4?
Answer 4.
### Question 5?
Answer 5.
`;

    const result = editorialQAService.validateArticle(fullContent, 'Best Loom Alternatives for Small Teams');

    // Should not have word count hard blocks
    const wordCountErrors = result.errors.filter((e) => e.includes('word count'));
    expect(wordCountErrors).toHaveLength(0);
  });

  it('should include target word counts and section targets in promptStageService.buildPromptStages', () => {
    const stages = promptStageService.buildPromptStages('Best Loom Alternatives for Small Teams');

    expect(stages.writingPrompt).toContain('TARGET TOTAL ARTICLE LENGTH: 2,400 to 2,600 words');
    expect(stages.writingPrompt).toContain('1. Introduction: 100-140 words');
    expect(stages.writingPrompt).toContain('3. Why Target Audience Outgrows Competitor: 200-260 words');
    expect(stages.writingPrompt).toContain('5. Demoly Profile (Position #1): 240-280 words');
  });
});
