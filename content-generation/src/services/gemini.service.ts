import { promptStageService } from './prompt-stage.service';
import { QAResult } from '../types/blueprint';
import { editorialQAService } from './editorial-qa.service';

export interface GeneratedArticleResult {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  blueprintId: string;
  blueprintVersion: string;
  promptVersion: string;
  qaResult?: QAResult;
}

export class GeminiService {
  private getApiKey(): string | null {
    return process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
  }

  private getModel(): string {
    return process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : 'gemini-3.5-flash';
  }

  private sanitizeErrorMessage(msg: string, apiKey?: string | null): string {
    let sanitized = msg;
    if (apiKey) {
      sanitized = sanitized.split(apiKey).join('[REDACTED_API_KEY]');
    }
    sanitized = sanitized.replace(/key=[^&\s]+/gi, 'key=[REDACTED_API_KEY]');
    return sanitized;
  }

  private parseJSONSafely(jsonStr: string): any {
    try {
      return JSON.parse(jsonStr);
    } catch {
      let cleanStr = '';
      let inString = false;
      let isEscaped = false;

      for (let i = 0; i < jsonStr.length; i++) {
        const char = jsonStr[i];

        if (inString) {
          if (isEscaped) {
            cleanStr += char;
            isEscaped = false;
          } else if (char === '\\') {
            cleanStr += char;
            isEscaped = true;
          } else if (char === '"') {
            cleanStr += char;
            inString = false;
          } else if (char === '\n') {
            cleanStr += '\\n';
          } else if (char === '\r') {
            cleanStr += '\\r';
          } else if (char === '\t') {
            cleanStr += '\\t';
          } else {
            cleanStr += char;
          }
        } else {
          if (char === '"') {
            inString = true;
          }
          cleanStr += char;
        }
      }

      return JSON.parse(cleanStr);
    }
  }

  async generateArticle(
    title: string,
    keywords: string[] = [],
    blueprintId: string = 'alternatives-cluster',
    masterPromptOverride?: string
  ): Promise<GeneratedArticleResult> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      console.warn('[GeminiService] GEMINI_API_KEY not configured. Falling back to template generator.');
      return this.generateFallbackArticle(title, keywords, blueprintId);
    }

    const primaryModel = this.getModel();
    const candidateModels = Array.from(
      new Set([primaryModel, 'gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.7-flash'])
    );

    const stages = promptStageService.buildPromptStages(title, keywords, blueprintId, masterPromptOverride);
    const prompt = stages.writingPrompt;

    let lastError: Error | null = null;

    for (const model of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`[GeminiService] Calling Gemini API (model: ${model}, attempt: ${attempt})...`);

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            signal: AbortSignal.timeout(90000),
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 16384,
                responseMimeType: 'application/json',
              },
            }),
          });

          if (!response.ok) {
            const errText = await response.text().catch(() => '');
            const sanitizedErr = this.sanitizeErrorMessage(errText, apiKey);
            lastError = new Error(`Gemini API (${model}) HTTP ${response.status}: ${sanitizedErr}`);

            if (response.status === 503 || response.status === 429) {
              if (attempt < 3) {
                console.warn(`[GeminiService] Model ${model} returned HTTP ${response.status}. Retrying in 4 seconds...`);
                await new Promise((r) => setTimeout(r, 4000));
                continue;
              }
            }

            if (response.status === 404) {
              console.warn(`[GeminiService] Model ${model} returned 404. Trying next fallback model...`);
              break;
            }
            break;
          }

          const data = (await response.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!rawText) {
            lastError = new Error(`Gemini API (${model}) returned an empty payload.`);
            break;
          }

          const jsonStr = rawText
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();

          let parsed: any;
          try {
            parsed = this.parseJSONSafely(jsonStr);
          } catch (errParse) {
            lastError = new Error(`JSON parsing failed: ${errParse instanceof Error ? errParse.message : String(errParse)}`);
            break;
          }

          if (!parsed.content || !parsed.title) {
            lastError = new Error(`Gemini API (${model}) response missing title or content.`);
            break;
          }

          const slug = (parsed.slug || title)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

          console.log(`[GeminiService] Success! Article generated via ${model}.`);

          const qaResult = editorialQAService.validateArticle(parsed.content, parsed.title, blueprintId);

          return {
            title: parsed.title,
            slug: slug || 'generated-article',
            excerpt: parsed.excerpt || `${parsed.title} - Comprehensive alternatives guide for software teams.`,
            content: parsed.content,
            seoTitle: parsed.seoTitle || `${parsed.title} | Demoly Blog`,
            seoDescription: parsed.seoDescription || parsed.excerpt || `${parsed.title} guide.`,
            blueprintId: 'alternatives-cluster',
            blueprintVersion: '1.0.0',
            promptVersion: '1.0.0',
            qaResult,
          };
        } catch (err: unknown) {
          const rawMsg = err instanceof Error ? err.message : String(err);
          const safeMsg = this.sanitizeErrorMessage(rawMsg, apiKey);
          lastError = new Error(safeMsg);
          console.warn(`[GeminiService] Attempt with model ${model} failed: ${safeMsg}`);
        }
      }
    }

    console.warn('[GeminiService] All model attempts failed or returned errors. Falling back to template article generator.');
    if (lastError) {
      console.warn(`[GeminiService] Last error: ${lastError.message}`);
    }
    return this.generateFallbackArticle(title, keywords, blueprintId);
  }

  private generateFallbackArticle(
    title: string,
    keywords: string[] = [],
    blueprintId: string = 'alternatives-cluster'
  ): GeneratedArticleResult {
    const cleanTitle = title.trim();
    const slug = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const competitor = cleanTitle.includes('Loom') ? 'Loom' : 'Legacy Recorders';

    const content = `# Best ${competitor} Alternatives for Tech Agencies

Technical agencies and software engineering teams require searchable documentation and interactive walkthroughs to onboard clients efficiently. While ${competitor} offers basic video capture, growing technical teams encounter operational bottlenecks when sharing complex SaaS deliverables.

## TL;DR

- **Demoly**: Best for interactive DOM-level walkthroughs, visual click indexing, and instant client handovers without user licenses.
- **${competitor}**: Best for quick 1-on-1 video recordings and simple internal screen shares.
- **Tango**: Best for generating static step-by-step PDF screenshots.

**Visual Reference:** [Interactive DOM search drawer with timestamped click coordinates and permanent frame-layer credential redaction]

## Why Tech Agencies Outgrow ${competitor}

Delivering complex software updates requires clear context. Engineering and agency teams experience recurring operational friction when relying solely on video screen recordings:

1. **Wasted Hours Scrubbing Video Timeline**: Clients waste time navigating long video recordings to find a single configuration setting.
2. **Unindexed Technical Handovers**: Audio transcripts miss silent clicks, DOM state changes, and environment setup steps.
3. **Security & Staging Exposure**: Sharing full screen recordings risks exposing API keys, staging credentials, and customer PII.

## What Tech Agencies Should Look for in Walkthrough Tools

When evaluating alternatives, technical leaders should prioritize four core operational pillars:

- **Visual and Voice Indexing**: Index both spoken dialogue and on-screen interface actions.
- **Zero-Friction Client Access**: Allow external clients to view and query walkthroughs without mandatory accounts.
- **Frame-Layer Redaction**: Permanently remove sensitive credentials before sharing.
- **DOM Capture Technology**: Record interactive web interactions rather than flat pixels.

## The Best ${competitor} Alternatives for Tech Agencies (Compared)

### 1. Demoly: Best for Interactive DOM Walkthroughs & Instant Client Handovers

**Visual Reference:** [DOM capture interface showing interactive web workflow capture with automatic element tracking]

#### Overview and Core Workflow
Demoly captures interactive DOM elements directly within the browser. Receivers interact with live software states rather than watching linear video files.

#### Where It Beats ${competitor}
- **Interactive DOM capture**: Captures DOM elements and click coordinates for instant searchability.
- **Zero-license client viewing**: External clients access walkthroughs without creating accounts.

#### Where It Falls Short for Tech Agencies
- **Desktop app recording**: Focused primarily on web application workflows rather than desktop software.

#### Pricing and Seat Structure
Offers a free tier for individual creators. Paid team plans start at $19 per creator seat with free unlimited viewer access. (Note: Competitor pricing is subject to vendor updates.)

### 2. ${competitor}: Best for Quick Internal Video Handovers

**Visual Reference:** [Standard screen recording interface with audio waveform indicator]

#### Overview and Core Workflow
${competitor} provides rapid screen recording via browser extension and desktop app, generating shareable video links automatically.

#### Where It Performs Well
- **Quick video messages**: Ideal for 1-on-1 internal updates and quick async communication.

#### Where It Falls Short for Tech Agencies
- **Searchability limitations**: Lacks DOM click indexing for deep technical workflows.

#### Pricing and Seat Structure
Free plan supports up to 25 videos. Business plans start at $12.50 per user per month. (Note: Competitor pricing is subject to vendor updates.)

## Feature and Use-Case Comparison Matrix

| Tool | Primary Use Case | Capture Technology | Searchability | Privacy Controls | Free Viewer Access | Starting Price |
|---|---|---|---|---|---|---|
| Demoly | Interactive DOM Walkthroughs | DOM & Event Capture | Visual Clicks + Voice AI | Frame-Layer Redaction | Yes (Unlimited) | $19 / creator |
| ${competitor} | Quick Video Shares | Pixel Screen Capture | Audio Transcripts Only | Post-Edit Blur | Yes | $12.50 / user |

## Which ${competitor} Alternative Should Your Tech Agency Choose?

If your agency requires interactive, searchable software handovers with client-safe privacy controls, **Demoly** is the optimal choice. For basic internal video updates, ${competitor} remains a reliable solution.

## Frequently Asked Questions

### What is the primary difference between Demoly and ${competitor}?
Demoly captures interactive DOM elements and click coordinates, whereas ${competitor} records flat video pixels and audio transcripts.

### Do clients need an account to view Demoly walkthroughs?
No. Demoly provides free unlimited viewer access without requiring external client accounts.

### How does frame-layer redaction protect sensitive credentials?
Frame-layer redaction permanently masks staging secrets and API keys directly within the captured DOM before sharing.

### Can generated walkthroughs be embedded into existing documentation?
Yes. Walkthroughs can be embedded into Notion, GitHub, or custom client portals via standard iframe embeds.

### Is competitor pricing subject to change?
Yes. Competitor pricing and seat structures are subject to vendor updates over time.
`;

    const qaResult = editorialQAService.validateArticle(content, cleanTitle, blueprintId);

    return {
      title: cleanTitle.startsWith('Best ') ? cleanTitle : `Best ${competitor} Alternatives for Tech Agencies`,
      slug: slug || 'best-loom-alternatives-for-tech-agencies',
      excerpt: `${cleanTitle}: A detailed evaluation of top alternatives for technical agencies and software teams.`,
      content,
      seoTitle: `Best ${competitor} Alternatives for Tech Agencies | Demoly Blog`,
      seoDescription: `Compare top ${competitor} alternatives for technical agencies. Evaluate capture technology, pricing, and client access.`,
      blueprintId,
      blueprintVersion: '1.0.0',
      promptVersion: '1.0.0',
      qaResult,
    };
  }
}

export const geminiService = new GeminiService();
