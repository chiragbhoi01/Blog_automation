import { QAResult } from '../types/blueprint';
import { getEditorialBlueprint } from '../blueprints';
import { factClaimService } from './fact-claim.service';

export class EditorialQAService {
  validateArticle(content: string, title: string, blueprintId: string = 'alternatives-cluster'): QAResult {
    const blueprint = getEditorialBlueprint(blueprintId);
    const hardBlocks: string[] = [];
    const warnings: string[] = [];

    const checks = {
      structure: true,
      faq: true,
      table: true,
      readability: true,
      pricing: true,
      demolyPositioning: true,
      competitorFairness: true,
      seo: true,
    };

    // 1. Structure Check: H1
    const hasH1 = /^#\s+.+/m.test(content) || Boolean(title);
    if (!hasH1) {
      hardBlocks.push('HARD_BLOCK: Article is missing H1 title');
      checks.structure = false;
    }

    // 2. Structure Check: Required Sections
    const lowerContent = content.toLowerCase();

    const hasIntro = lowerContent.includes('introduction') || content.length > 200;
    if (!hasIntro) {
      hardBlocks.push('HARD_BLOCK: Missing Introduction section');
      checks.structure = false;
    }

    const hasTldr = lowerContent.includes('tl;dr') || lowerContent.includes('tldr') || lowerContent.includes('at a glance');
    if (!hasTldr) {
      hardBlocks.push('HARD_BLOCK: Missing TL;DR summary section');
      checks.structure = false;
    }

    const hasVisualRef = lowerContent.includes('visual reference');
    if (!hasVisualRef) {
      warnings.push('WARNING: Missing explicit functional Visual Reference callout');
    }

    const hasWhyOutgrows = lowerContent.includes('why') && lowerContent.includes('outgrows');
    if (!hasWhyOutgrows) {
      warnings.push('WARNING: Missing explicit "Why Audience Outgrows Competitor" section');
    }

    const hasEvaluationCriteria = lowerContent.includes('should look for') || lowerContent.includes('evaluation criteria');
    if (!hasEvaluationCriteria) {
      warnings.push('WARNING: Missing explicit Evaluation Criteria section');
    }

    // 3. Comparison Matrix Check (Structured Table Node)
    const hasTable = lowerContent.includes('<table>') || lowerContent.includes('| feature |') || (lowerContent.includes('|') && lowerContent.includes('---|'));
    if (!hasTable) {
      hardBlocks.push('HARD_BLOCK: Missing structured comparison table matrix');
      checks.table = false;
    }

    // 4. FAQ Check: Position & Count
    const faqSectionMatch = content.match(/##\s+Frequently Asked Questions([\s\S]*)/i);
    if (!faqSectionMatch || typeof faqSectionMatch[1] !== 'string') {
      hardBlocks.push('HARD_BLOCK: Missing Frequently Asked Questions section');
      checks.faq = false;
    } else {
      const faqBody: string = faqSectionMatch[1];
      
      const afterFaqH2 = faqBody.match(/^##\s+(?!Frequently Asked Questions)(.+)/im);
      if (afterFaqH2) {
        hardBlocks.push(`HARD_BLOCK: FAQ must be the final substantive section. Found section "${afterFaqH2[1]}" after FAQ.`);
        checks.faq = false;
      }

      const faqQuestionMatches = faqBody.match(/(###\s+.+\?|\*\*.*?\?\*\*|\n\d+\.\s+.*?\?)/g) || [];
      if (faqQuestionMatches.length < 4 || faqQuestionMatches.length > 5) {
        hardBlocks.push(`HARD_BLOCK: FAQ section must contain 4 to 5 questions. Found ${faqQuestionMatches.length}.`);
        checks.faq = false;
      }

      const answers = faqBody.split(/(?:###|\*\*|\d+\.)/g).filter((s) => s.trim().length > 0);
      answers.forEach((ans) => {
        const words = ans.trim().split(/\s+/).length;
        if (words > 75) {
          warnings.push(`WARNING: FAQ answer exceeds word count limit (${words} words)`);
        }
      });
    }

    // 5. Demoly Positioning & Competitor Fairness
    const demolyMentioned = lowerContent.includes('demoly');
    if (!demolyMentioned) {
      hardBlocks.push('HARD_BLOCK: Demoly product profile #1 is required');
      checks.demolyPositioning = false;
    }

    // 6. Language & Banned Phrases Check
    const bannedPhrases = blueprint.bannedPhrases || [];
    bannedPhrases.forEach((phrase) => {
      if (lowerContent.includes(phrase.toLowerCase())) {
        warnings.push(`WARNING: Article contains banned marketing phrase: "${phrase}"`);
        checks.readability = false;
      }
    });

    // 7. Word Count Check (Target: 2,400 - 2,600 words, Hard block if < 2,000 words)
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 2000) {
      hardBlocks.push(`HARD_BLOCK: Article word count (${wordCount} words) is materially below the 2,400-2,600 word target (minimum 2,000 words required).`);
      checks.readability = false;
    } else if (wordCount < 2400 || wordCount > 2800) {
      warnings.push(`WARNING: Article word count is ${wordCount} words (target spec: 2,400-2,600 words).`);
    }

    // 8. Fact & Claim Review
    const factClaims = factClaimService.verifyArticleClaims(content, ['Demoly', 'Loom']);

    const passed = hardBlocks.length === 0;

    return {
      passed,
      errors: hardBlocks,
      warnings,
      factReviewClaims: factClaims,
      checks,
    };
  }
}

export const editorialQAService = new EditorialQAService();
