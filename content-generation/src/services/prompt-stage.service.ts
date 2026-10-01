import { EditorialBlueprint } from '../types/blueprint';
import { getEditorialBlueprint } from '../blueprints';

export interface PromptStages {
  strategyPrompt: string;
  researchPrompt: string;
  outlinePrompt: string;
  writingPrompt: string;
  seoPrompt: string;
}

export class PromptStageService {
  buildPromptStages(
    title: string,
    keywords: string[] = [],
    blueprintId: string = 'alternatives-cluster',
    masterPromptOverride?: string
  ): PromptStages {
    const blueprint: EditorialBlueprint = getEditorialBlueprint(blueprintId);
    const kwList = keywords.length > 0 ? keywords.join(', ') : 'interactive walkthroughs, process capture, SaaS documentation';

    const strategyPrompt = `[STRATEGY STAGE]
Topic Title: "${title}"
Keywords: ${kwList}
Target Audience: ${blueprint.audienceRules.targetAudience}
Problem Focus: ${blueprint.audienceRules.problemFocus}
Search Intent: Primary intent pattern is "best [competitor] alternatives for [audience]"
Goal: Establish clear, objective search intent and audience positioning without turning into a hard sales pitch.`;

    const researchPrompt = `[RESEARCH STAGE]
Extract and verify factual product claims for Demoly and competitor tools.
Facts Needed:
1. Core capture technology (DOM capture, click tracking, video recording).
2. Privacy controls (frame-layer redaction vs post-edit blur).
3. Viewing model (free unlimited viewers vs paid licenses).
4. Verified pricing models and seat structures. Include disclaimer "(Note: Competitor pricing is subject to vendor updates.)".
Do not fabricate prices or features if unverified.`;

    const outlinePrompt = `[OUTLINE STAGE]
Build exact Heading Architecture adhering strictly to:
H1: Best [Competitor] Alternatives for [Audience]
- Introduction (Target: 100-140 words)
- TL;DR (Target: 60-90 words, bulleted mapping)
- Visual Reference callout
- H2: Why [Audience] Outgrows [Competitor] (Target: 200-260 words)
- H2: What [Audience] Should Look for in [Category] (Target: 160-220 words)
- H2: The Best [Competitor] Alternatives for [Audience] (Compared)
  - H3: 1. Demoly: Best for Interactive DOM Walkthroughs & Instant Client Handovers
  - H3: 2. [Competitor Tool]: Best for [Specific Use Case]
- H2: Feature and Use-Case Comparison Matrix (Structured <table> node)
- H2: Which [Competitor] Alternative Should Your [Audience] Choose? (Conclusion)
- H2: Frequently Asked Questions (4 to 5 High-Intent FAQs - Must be the final substantive section!)`;

    const writingPrompt = masterPromptOverride
      ? `${masterPromptOverride}\n\n---\n\nTARGET ARTICLE INPUT:\nTitle: "${title}"\nKeywords: ${kwList}\n\nCRITICAL LENGTH MANDATE: You MUST write the complete, full-length article targeting 2,400 to 2,600 words total. Do NOT summarize, truncate, or stop early. Ensure every tool profile and analysis section is written with rich technical depth and complete workflow details.`
      : `You are an senior technical SaaS editor and writer following the Demoly Editorial Blueprint (Version ${blueprint.version}).
Title: "${title}"
Keywords: ${kwList}

TARGET TOTAL ARTICLE LENGTH: 2,400 to 2,600 words.
Do NOT write brief or truncated summaries. Write deep, highly detailed, technically rigorous prose following these exact section word counts:

SECTION WORD COUNT REQUIREMENTS (MUST HIT ~2,400 - 2,600 WORDS TOTAL):
1. Introduction: 100-140 words (Dense technical context explaining friction in current workflows).
2. TL;DR: 60-90 words (Bulleted list of key tool recommendations).
3. Why Target Audience Outgrows Competitor: 200-260 words (3-4 explicit operational friction scenarios with bold lead-ins).
4. What Target Audience Should Look For: 160-220 words (4-pillar technical evaluation criteria framework).
5. Demoly Profile (Position #1): 240-280 words (Comprehensive breakdown of DOM capture, voice AI indexing, interactive player, zero-license client access, factual strengths and transparent factual limitations).
6. Competitor Profiles (Tools #2 through #5): 140-200 words each (Detailed overview, core workflow, 3 factual strengths, 2 factual limitations, pricing and seat structure with vendor disclaimer).
7. Feature and Use-Case Comparison Matrix: 120-160 words lead-in + complete HTML <table> containing columns: Tool | Primary Use Case | Capture Technology | Searchability | Privacy Controls | Free Viewer Access | Starting Price.
8. Which Tool Should You Choose (Conclusion): 120-160 words (Substantive decision summary based on team size, workflow complexity, and client access needs).
9. Frequently Asked Questions: 200-250 words total (4 to 5 FAQs - MUST be the final substantive section ## Frequently Asked Questions. Each question formatted as ### [Question]? with a 2-4 sentence direct, concise answer <= 45 words).

STRICT EDITORIAL RULES:
- Tone & Readability: Grade 8-9 readability. Active voice, clear technical vocabulary. Paragraphs max 3-4 sentences (< 65 words).
- Sentence Average: 14-22 words per sentence.
- Visual References & AI Image Prompts: Include complete, production-ready AI image prompts for every screenshot/diagram callout formatted as:
  > 📸 **Visual Reference & AI Image Generation Prompt:**
  > - **Visual Description:** [1-2 sentences describing the UI/workflow screenshot]
  > - **Ready-to-Use AI Prompt:** \`[Complete copy-pasteable prompt for Midjourney/DALL-E 3/Flux specifying: modern SaaS UI mockup, clean minimalist light theme, browser frame, brand colors #FF5722 / competitor color, 16:9 aspect ratio --ar 16:9]\`
- Pricing Disclaimer: For every competitor profile, append: (Note: Competitor pricing is subject to vendor updates.)
- No Padding: Provide rich technical depth, specific workflow examples, and clear architectural differences rather than repetitive filler.

JSON Output Schema:
{
  "title": "Full Article Title",
  "slug": "url-safe-kebab-case-slug",
  "excerpt": "Compelling 2-sentence summary under 160 characters.",
  "content": "Full rich Markdown/HTML content...",
  "seoTitle": "SEO Title | Demoly Blog",
  "seoDescription": "Meta description under 155 characters."
}`;

    const seoPrompt = `[SEO & AEO STAGE]
Generate natural keyword placement, canonical slug, meta description (< 155 chars), and structured FAQs with direct <= 45 word answers for answer engine optimization.`;

    return {
      strategyPrompt,
      researchPrompt,
      outlinePrompt,
      writingPrompt,
      seoPrompt,
    };
  }
}

export const promptStageService = new PromptStageService();
