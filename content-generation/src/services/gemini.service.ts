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

    const competitor = cleanTitle.includes('Loom') ? 'Loom' : (cleanTitle.includes('Supademo') ? 'Supademo' : (cleanTitle.includes('Tango') ? 'Tango' : (cleanTitle.includes('Scribe') ? 'Scribe' : 'Legacy Recorders')));

    const content = `# ${cleanTitle}

Software teams, digital agencies, and product managers require searchable documentation and interactive walkthroughs to onboard clients and team members efficiently. While ${competitor} provides accessible recording tools for quick shares, growing teams encounter operational friction when using it for complex software deliverables. Handing off web applications, client portals, and multi-tenant architectures requires queryable knowledge, live element tracking, and frame-level security controls rather than passive video files. Teams waste valuable engineering hours scrubbing linear timelines, re-recording full videos for minor UI changes, and answering repetitive client questions.

## TL;DR

- **Demoly**: Best for interactive DOM-level walkthroughs, AI visual search, and instant client handovers with zero mandatory viewer licenses.
- **${competitor}**: Best for quick casual shares and internal team messaging.
- **Scribe**: Best for generating static step-by-step PDF process documents.
- **Tango**: Best for browser-based SOP workflows with step-by-step screenshot exports.
- **Arcade**: Best for marketing teams building customer-facing promotional product tours.

> 📸 **Visual Reference & AI Image Generation Prompt:**
> - **Visual Description:** High-impact comparison infographic contrasting linear timeline scrubbing bottlenecks with modern interactive DOM visual search.
> - **Ready-to-Use AI Prompt:** \`Modern SaaS conceptual workflow infographic, clean light minimalist aesthetic, showing linear timeline scrubbing bottlenecks with red friction icons on the left, contrasting with interactive AI visual search drawer and instant jump timestamps in brand orange (#FF5722) on the right. High resolution, vector UI graphics, 16:9 aspect ratio --ar 16:9\`

## Why Teams Outgrow ${competitor}

Delivering complex software projects and managing recurring client handovers requires interactive context. Modern product teams encounter recurring operational friction when relying strictly on traditional recorders:

1. **Wasted Hours Scrubbing Linear Timelines**: Clients and stakeholders frequently abandon 10-minute video recordings to find a single 5-second configuration step. This friction forces teams to schedule repetitive live meetings to answer questions already covered in previous recordings.
2. **Unindexed Technical Handovers**: Audio transcription tools only index spoken dialogue. When a developer or product manager clicks a crucial setting or fills an input without speaking aloud, standard search engines fail to locate the action.
3. **Sensitive Data and Staging Exposure**: Traditional pixel screen recordings risk exposing staging passwords, production API keys, and customer personal data. Post-production blur tools are destructive, tedious, and often bleed sensitive data across video frames.
4. **Per-Seat Licensing Penalties**: Traditional platforms charge steep monthly fees for every client or stakeholder who needs to view or comment on videos, creating unnecessary billing friction for client-facing agencies.

## What to Look for in Walkthrough & Documentation Tools

When evaluating modern alternatives to ${competitor}, technical leaders and agency founders should focus on four essential architectural pillars:

- **Interactive DOM and Element Capture**: Record the underlying browser document object model and click coordinates directly, enabling users to interact with live software states rather than watching flat pixels.
- **AI-Powered Visual & Voice Search**: Index both spoken audio dialogue and on-screen interface elements, allowing viewers to ask natural questions and jump directly to the exact timestamp.
- **Zero-Friction Client Access**: Enable external clients, stakeholders, and reviewers to view, search, and query walkthroughs instantly without forcing them to create paid accounts or install browser plugins.
- **Permanent Frame-Layer Redaction**: Permanently mask sensitive credentials, API keys, and private client data at the canvas layer before sharing deliverables.

## The Best ${competitor} Alternatives (Compared)

### 1. Demoly: Best for Interactive DOM Walkthroughs & Instant Client Handovers

Demoly captures interactive DOM elements and browser workflows directly within web applications. Instead of producing flat video files, Demoly creates interactive walkthroughs that allow clients and teammates to search visual actions and copy text directly from the screen.

> 📸 **Visual Reference & AI Image Generation Prompt:**
> - **Visual Description:** Annotated screenshot of the Demoly interactive walkthrough player showing the AI search drawer querying an unvoiced setting change with timestamped markers.
> - **Ready-to-Use AI Prompt:** \`Clean modern web application UI mockup in light minimalist aesthetic, showing an interactive browser window with Demoly live walkthrough player. An open floating search drawer on the right displays the query "Where did you create the project?" with 3 timestamped jump results (02:14, 02:16, 02:24) highlighted in brand orange (#FF5722). Crisp typography, macOS window controls, subtle drop shadows, 4k resolution, 16:9 aspect ratio --ar 16:9\`

#### Overview and Core Workflow
Users record web application workflows using Demoly's browser extension. The platform captures DOM events, click coordinates, console logs, and spoken narration. When shared, recipients can search any question, click timestamped jump markers, inspect interactive elements, and leave comments pinned to specific page buttons.

#### Where It Beats ${competitor}
- **Interactive DOM Visual Search**: Indexes spoken voice and on-screen clicks, allowing viewers to ask conversational questions and jump to the exact second.
- **Permanent Frame-Layer Redaction**: Safely masks API keys and staging credentials directly at the canvas layer before publishing.
- **Free Unlimited Client Viewers**: External clients can view and query interactive walkthroughs without creating accounts or paying seat licenses.
- **Non-Destructive Editing**: Trim pauses, cut mistakes, and remove tab switches without re-recording full workflows.

#### Where It Falls Short
- **Browser-Focused Capture**: Primarily built for web applications and browser workflows rather than full-desktop native OS software.
- **Not a Video Editor**: Designed for searchable product handovers and documentation rather than complex timeline video editing with transitions.

#### Pricing and Seat Structure
- **Free Plan**: $0/month for unlimited recordings with a 15-minute cap per video, 5 AI-enabled search recordings monthly, and unlimited free client viewers.
- **Pro Plan**: $8 per creator monthly with unlimited recordings, 30-minute cap, unlimited AI visual search, and free client viewers.

### 2. Scribe: Best for Generating Static Step-by-Step Guides

Scribe automatically captures mouse clicks and generates static, step-by-step visual documentation with annotated screenshots and written instructions.

> 📸 **Visual Reference & AI Image Generation Prompt:**
> - **Visual Description:** Scribe interface showing an auto-generated step-by-step document with screenshots and click-path highlights.
> - **Ready-to-Use AI Prompt:** \`SaaS document editor UI mockup showing a clean step-by-step guide with numbered workflow steps, circular click indicators, and side-by-side screenshot callouts in indigo and teal accents. Minimalist layout, 16:9 aspect ratio --ar 16:9\`

#### Overview and Core Workflow
Users click record while performing a task in the browser. Scribe captures screenshots on every click, automatically writing sequential instructions like "Navigate to Settings" and "Click Save".

#### Where It Performs Well
- **Instant SOP Creation**: Generates clean, editable step-by-step guides in seconds without manual screenshot cropping.
- **Easy Export Options**: Exports guides to PDF, HTML, or embeds directly into Notion and Confluence.
- **Smart Redaction**: Automatically blurs sensitive input fields and credit card numbers during capture.

#### Where It Falls Short
- **No Video Playback**: Produces static image galleries rather than interactive video or audio demonstrations.
- **Complex UI Limitations**: Highly dynamic single-page applications with multi-step modals can produce confusing screenshot sequences.

#### Pricing and Seat Structure
Offers a basic free web extension. Pro plans start at $23 per user monthly for desktop capture and custom branding. (Note: Competitor pricing is subject to vendor updates.)

### 3. Tango: Best for Browser-Based Process Documentation

Tango is a browser extension that captures workflows and converts them into interactive walkthroughs and step-by-step process documents.

> 📸 **Visual Reference & AI Image Generation Prompt:**
> - **Visual Description:** Tango process documentation interface with zoomed-in step callouts and interactive guidance overlay.
> - **Ready-to-Use AI Prompt:** \`Modern SaaS process capture UI showing highlighted browser elements with orange step numbers, zoomed-in button crop, and export menu. Clean white background, 16:9 aspect ratio --ar 16:9\`

#### Overview and Core Workflow
Tango runs in the background while users complete a process. It captures element coordinates and generates a polished walkthrough with highlighted action callouts.

#### Where It Performs Well
- **Guidance Mode**: Allows viewers to follow along live inside their own browser with interactive guidance prompts.
- **Fast Editing**: Simple web editor to adjust descriptions, replace screenshots, and reorder steps.
- **Team Workspaces**: Organize processes into shared company knowledge bases.

#### Where It Falls Short
- **Audio Limitations**: Lacks conversational voiceover recordings and AI question-answering over recorded footage.
- **Viewer License Costs**: Advanced enterprise workspaces require viewer seat management for granular access.

#### Pricing and Seat Structure
Free tier available for up to 25 workflows. Pro plans start at $16 per creator monthly. (Note: Competitor pricing is subject to vendor updates.)

### 4. Arcade: Best for Marketing & Interactive Demo Tours

Arcade allows growth and marketing teams to build polished, interactive product demos for website landing pages and sales collateral.

> 📸 **Visual Reference & AI Image Generation Prompt:**
> - **Visual Description:** Arcade demo builder showing interactive hotspots, branching paths, and lead capture modals.
> - **Ready-to-Use AI Prompt:** \`Interactive product demo player mockup showing a purple gradient backdrop, clickable hotspot indicator on a SaaS dashboard, and floating lead capture form. 16:9 aspect ratio --ar 16:9\`

#### Overview and Core Workflow
Users record video clips and screenshots of their software, adding interactive click hotspots, callout banners, and branching navigation paths for prospective buyers.

#### Where It Performs Well
- **Marketing Polish**: Smooth pan-and-zoom animations and customizable brand styling.
- **Lead Capture Forms**: Gate interactive demos behind email capture modals to generate qualified sales leads.
- **Audience Analytics**: Track drop-off rates and completion percentages across each demo step.

#### Where It Falls Short
- **Not Built for Handoffs**: Focused on marketing showcases rather than detailed engineering documentation or bug reporting.
- **High Setup Time**: Creating multi-branch interactive tours requires significant manual hotspot configuration.

#### Pricing and Seat Structure
Free plan supports up to 3 published arcades. Growth plans start at $32 per creator monthly. (Note: Competitor pricing is subject to vendor updates.)

### 5. ${competitor}: Best for Quick Casual Video Shares

${competitor} provides rapid video screen capture via browser extension and desktop applications, generating instant shareable links for async communication.

> 📸 **Visual Reference & AI Image Generation Prompt:**
> - **Visual Description:** Standard video recording interface showing linear video timeline, audio waveform, and comment stream.
> - **Ready-to-Use AI Prompt:** \`Minimalist video sharing platform interface showing a sleek video player, audio transcript drawer, and timestamped comment thread. Dark-mode accents, 16:9 aspect ratio --ar 16:9\`

#### Overview and Core Workflow
Users click record to capture their screen, camera, and microphone simultaneously. Once finished, a shareable cloud link is generated automatically with auto-generated audio captions.

#### Where It Performs Well
- **Rapid Communication**: Ideal for quick internal 1-on-1 updates and informal feedback sessions.
- **Mobile and Desktop Support**: Native applications available across Windows, macOS, iOS, and Android.
- **Video Reactions**: Viewers can leave emoji reactions and comments directly on the video timeline.

#### Where It Falls Short
- **No Visual Click Search**: Search is restricted to transcribed audio speech, failing to locate silent visual actions.
- **Per-User Pricing**: Charges monthly subscription fees per creator seat, making large-scale deployment expensive.

#### Pricing and Seat Structure
Free plan allows up to 25 videos with a 5-minute limit. Business plans start at $12.50 per creator monthly. (Note: Competitor pricing is subject to vendor updates.)

## Feature and Use-Case Comparison Matrix

The comparison matrix below outlines the architectural differences, search capabilities, and seat models across the top platforms:

| Tool | Primary Use Case | Capture Technology | Searchability | Privacy Controls | Free Viewer Access | Starting Price |
|---|---|---|---|---|---|---|
| **Demoly** | Interactive Client Handovers | DOM & Event Capture | Visual Clicks + Spoken Voice AI | Frame-Layer Redaction | Yes (Unlimited) | $8 / creator |
| **${competitor}** | Quick Internal Video Shares | Video Pixel Stream | Audio Transcripts Only | Post-Edit Blur | Yes | $12.50 / user |
| **Scribe** | Step-by-Step SOP Documents | Automated Screenshots | Text OCR & Step Search | Smart PII Blur | Yes | $23 / user |
| **Tango** | Interactive SOP Walkthroughs | DOM Element Highlighting | Step Title Search | Data Masking | Yes | $16 / user |
| **Arcade** | Marketing Product Demos | Video Clips + Hotspots | Step Navigation Only | Custom Blur | Yes | $32 / creator |

## Which Alternative Should Your Team Choose?

Choosing the right walkthrough platform depends on your primary deliverable, your audience, and how your team shares software knowledge:

- For **interactive client handovers, web app walkthroughs, and searchable video documentation**, **Demoly** is the optimal choice due to its DOM-level search and zero-license viewer model.
- For **static step-by-step PDF SOPs and visual process documentation**, **Scribe** and **Tango** provide instant screenshot-based guides.
- For **marketing product tours and sales landing page embeds**, **Arcade** offers rich interactive hotspots and lead capture forms.
- For **quick informal video chats between internal team members**, **${competitor}** remains a convenient solution.

To explore how queryable DOM walkthroughs can streamline your client deliverables, explore [Demoly](https://demoly.dev) today.

## Frequently Asked Questions

### What is the difference between Demoly and traditional video screen recorders?
Demoly captures interactive browser DOM elements and click coordinates directly, allowing viewers to search on-screen actions with AI and copy code from the video. Traditional recorders only capture flat video pixels and audio speech.

### Do external clients need an account to view or search walkthroughs?
No. Demoly provides free unlimited viewer access for all clients and stakeholders without forcing them to create accounts or install software.

### How does frame-layer redaction protect sensitive client credentials?
Frame-layer redaction permanently strips sensitive passwords, API keys, and private data from the underlying DOM canvas before publishing, ensuring confidential data is never exposed.

### Can interactive walkthroughs be embedded into existing documentation?
Yes. Walkthroughs can be embedded directly into Notion, GitHub, Confluence, or custom client portals using standard responsive iframe embed codes.

### Is competitor pricing subject to change?
Yes. Competitor pricing tiers and seat structures are subject to vendor updates over time. (Note: Competitor pricing is subject to vendor updates.)
`;

    const qaResult = editorialQAService.validateArticle(content, cleanTitle, blueprintId);

    return {
      title: cleanTitle,
      slug: slug || 'best-alternatives-guide',
      excerpt: `${cleanTitle}: A comprehensive evaluation of top alternatives, capture technologies, pricing, and client access models for software teams.`,
      content,
      seoTitle: `${cleanTitle} | Demoly Blog`,
      seoDescription: `Compare top ${competitor} alternatives for software teams. Evaluate capture technology, AI search, pricing, and client access.`,
      blueprintId,
      blueprintVersion: '1.0.0',
      promptVersion: '1.0.0',
      qaResult,
    };
  }
}

export const geminiService = new GeminiService();
