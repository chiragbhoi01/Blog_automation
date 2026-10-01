# Demoly Content Generation — Master Prompt

**Source of truth for this file:** the approved final revision of "Best Loom Alternatives for Tech Agencies," as reverse-engineered into a cluster blueprint (Gemini output, Sept 24 2026), plus the 120-title master list and competitor intelligence report. Where those sources conflict, see `source-notes/SOURCE-MATERIAL-DECISIONS.md` for the resolution and why.

This file is reusable across topics. It must never be hardcoded to one article. Anything not established by the source material is marked `NEEDS CONFIRMATION` rather than invented.

---

## 1. Input

### Required input (must be provided before generation runs)

- `title` — the exact blog title from the topic list (e.g., "Best Scribe Alternatives for Web App Walkthroughs")
- `vertical` — which of the 7 verticals this title belongs to (see Section 3, "Other Verticals")
- `target_audience` — the persona this title is written for (e.g., agency founders, QA engineers)
- `primary_competitor` — the named competitor/tool the title is built around, if the vertical requires one

### Optional input (used when available, never invented if absent)

- `secondary_keywords`
- `known_pricing_data` for the named competitor (if not supplied, competitor pricing must be researched and marked with the standard disclaimer, or marked `[VERIFY]` if it cannot be confirmed)
- `reference_material` (prior approved articles, research notes)
- `internal_link_targets` (known, live URLs on demoly.dev — see Section 10)

If a required input is missing, the generation run stops and the topic is marked `NEEDS_INPUT` rather than the model guessing.

---

## 2. Demoly facts the model is allowed to state as fact

These are the only Demoly product facts confirmed in source material. Nothing beyond this list may be stated as fact — anything else about Demoly must be marked `[VERIFY PRODUCT FACT]`.

- Demoly is an interactive, AI-searchable walkthrough platform for digital agencies, web development studios, and product teams.
- It captures browser workflows and indexes both spoken voice and visual (on-screen) interactions.
- Viewers can ask natural-language questions and get answers with timestamps that jump to the exact moment.
- Viewers can copy visible text/code, open live tab URLs, and leave comments pinned to specific page elements.
- Non-destructive editing: trim pauses, remove mistakes, cut tab switches without re-recording.
- Permanent canvas-layer redaction of sensitive data, credentials, and API keys (not a CSS blur).
- **Free Plan:** $0/month, unlimited recordings, 15-minute cap per recording, 5 AI-enabled recordings/month, unlimited AI Q&A on enabled videos, free client viewers.
- **Pro Plan:** $8/creator/month, unlimited recordings, 30-minute cap per recording, unlimited AI-enabled recordings and AI Q&A, free client viewers.
- Agency seat model: agencies pay for internal creators; clients view and query for free without accounts.
- It is built primarily for browser/web-app workflows, not full-desktop recording or advanced video editing.
- It is designed for project handoffs, onboarding, and documentation — not as a quick internal messenger.

Any capability, integration, certification, customer count, or performance number not on this list is `NEEDS CONFIRMATION` before it can be used.

---

## 3. Article structure — Vertical 2 (Competitor: Alternatives)

This is the only vertical with a fully approved structure. Use it exactly for any title in the "Best [Competitor] Alternatives for [Audience]" or "Best [Competitor] Alternatives for [Use Case]" pattern (the 20 titles in the master list's Vertical 2).

```
H1: Best [Competitor] Alternatives for [Audience]
├── Introduction (100–140 words, single dense paragraph)
├── TL;DR (60–90 words, bulleted, one line per tool)
├── Visual Reference #1 (workflow-friction infographic)
├── H2: Why [Audience] Outgrows [Competitor] (200–260 words, 3–4 bullets)
├── H2: What [Audience] Should Look for in [Category] (160–220 words, 4-pillar framework)
├── H2: The N Best [Competitor] Alternatives for [Audience] (Compared)
│   ├── H3: 1. Demoly: [Positioning] — 240–280 words total
│   │   ├── Visual Reference (interactive player screenshot)
│   │   ├── Overview and Core Workflow
│   │   ├── Where It Beats [Competitor] (3–4 bullets)
│   │   ├── Where It Falls Short (2–3 bullets)
│   │   └── Pricing and Seat Structure
│   ├── H3: 2..N [Alternative]: [Positioning] — 140–200 words each (ceiling ~200, prefer 140–170)
│   │   ├── Visual Reference (product UI screenshot)
│   │   ├── Overview and Core Workflow
│   │   ├── Where It Performs Well (3 bullets)
│   │   ├── Where It Falls Short for [Audience] (2 bullets)
│   │   └── Pricing and Seat Structure (+ vendor-pricing disclaimer)
│   └── H3: N. [Incumbent Competitor]: [Remaining Strength] — same structure
├── H2: Feature and Use-Case Comparison Matrix
│   ├── 1 lead-in sentence
│   ├── Table, 6–7 columns (see Section 8 for non-table fallback)
│   └── Visual Reference (comparison graphic)
├── H2: Which [Competitor] Alternative Should Your [Audience] Choose?
│   ├── Bulleted "for X, choose Y" summary
│   ├── Collective category takeaway paragraph
│   ├── 2 internal links (see Section 10)
│   └── Free-tier CTA line
└── H2: Frequently Asked Questions (exactly 5, ≤45 words/answer, always the last section)
```

**Total target length:** 2,400–2,600 words. See Section 6 for the reconciliation with the 2,200–3,500-word range in the general competitor intelligence report.

---

## 4. Introduction formula (Vertical 2)

Four moves, one paragraph, 100–140 words including the TL;DR:

1. **Fair incumbent acknowledgment** — what the competitor made easy.
2. **Audience-specific pivot** — where it breaks down for this exact persona.
3. **Behavioral bottleneck** — the human failure mode (scrubbing, giving up, calling support).
4. **Structural thesis** — why (static/flat media traps knowledge; modern teams need something queryable).

```
[Competitor] made [basic capability] effortless for [general use case], but [audience] run into friction using it for [target deliverable]. Handing off [deliverable type A], [B], or [C] to [recipient] is different from [competitor's casual use case]. [Friction description — scrubbing, missed steps, repeat calls]. [Structural thesis sentence].

**TL;DR:**
- **Demoly:** Best for [specific advantage for this topic].
- **[Alt 2]:** Best for [niche].
- **[Alt 3]:** Best for [niche].
- **[Alt 4]:** Best for [niche].
- **[Alt 5]:** Best for [niche].
- **[Competitor]:** Best for [remaining casual/internal strength].

**Visual Reference:** [infographic contrasting linear friction vs. searchable delivery]
```

---

## 5. Alternative/competitor profile structure

Applies to every tool profile, Demoly included, with Demoly always in position #1.

**Required per profile:**
- Tool name + "Best for X" positioning subheading
- One-sentence definition
- Visual reference (concrete UI description, never decorative stock imagery)
- Overview and Core Workflow (1–3 tight paragraphs: capture mechanic + recipient experience)
- Strengths: 3–4 bullets, bold lead-in anchor + 1–2 complete sentences each
- Weaknesses: 2–3 bullets, same format
- Pricing and Seat Structure: bulleted tiers + seat-model note

**Only when relevant:** integrations (mention only if they define the workflow, e.g., Jam.dev → Jira/Linear), security/redaction detail.

**Never include:** company funding/history, ARR, generic marketing adjectives ("intuitive," "revolutionary," "seamless"), identical word counts forced across tools regardless of what there is to say.

**Length rule (minimization, not padding):** ~200 words is the ceiling for a non-Demoly profile (matching the approved sample's Loom section). 140–170 words is the preferred floor. If a tool's relevant information fits in 130 words, stop at 130 words — do not pad to match another section's length. Demoly's profile runs longer (240–280 words) because it carries the TL;DR anchor and sets the comparison bar, not because of any padding.

---

## 6. Word count and density (with source reconciliation)

```
Introduction & TL;DR:           100–140 words prose + 60–90 words TL;DR
Why Audience Outgrows Competitor: 200–260 words
Evaluation Criteria:             160–220 words
Demoly Profile:                  240–280 words
Other Profiles (each):           140–200 words (prefer 140–170)
Comparison Matrix section:       120–160 words (excluding table)
Which Tool Should You Choose:    120–160 words
FAQ (5 questions):               200–250 words total
────────────────────────────────────────────
Target total: 2,400–2,600 words
```

The competitor intelligence report (source doc 9) observed a broader 2,200–3,500-word range across other companies' comparison articles generally. That is a market observation, not Demoly's approved standard. Demoly's approved sample and its derived blueprint set the tighter 2,400–2,600 range — **this file uses that range.** See `source-notes/SOURCE-MATERIAL-DECISIONS.md`.

Core principle: information density over word count. Never pad a section to hit a number.

---

## 7. Writing style

- **Reading level:** Grade 7–8. Clear, accessible, and easily understandable for non-technical readers (agency clients, non-technical founders, operations managers, and designers).
- **Plain Language Principle:** Avoid unnecessary technical jargon. If a technical term is essential (e.g. DOM, console logs, redaction, API keys), immediately explain it in simple, everyday language (e.g., *"DOM capture records interactive web elements you click, rather than a flat video file"*).
- **Sentence length:** 12–18 words average, short, punchy, and clear.
- **Paragraph length:** max 2–3 sentences / ~50 words.
- **Voice:** friendly, conversational, and direct ("Demoly lets your clients ask questions and jumps to the exact moment," not passive corporate speak).
- **Em-dashes:** minimize; use colons, commas, or restructured sentences instead. In headings use a colon ("Tool: Best for X"), never an em-dash.
- **Banned:** paradigm shift, revolutionize, digital transformation, fast-paced world, seamlessly, game-changer, empower, intuitive UI, cutting-edge, robust, transformative, synergistic, leverage.
- **Never fabricate:** statistics, quotes, customer stories, or competitor logos/claims.
- **Official Competitor Verification:** Always verify competitor tool names, official logos, brand colors, and current tier structures against their official live website pages. Never guess or hallucinate competitor details.
- **Openings to avoid:** "In today's fast-paced world...", "As businesses continue to...", "In the ever-evolving landscape..."

---

## 8. Comparison table — CMS compatibility

`NEEDS CONFIRMATION`: whether the Demoly CMS rich-text editor (per the earlier CMS description: TipTap-based) accepts pasted Markdown tables and converts them to a native editable table, or whether it requires structured JSON/HTML input instead. This has not been confirmed against the actual CMS API in the source material provided to this system.

Until confirmed, the generation script must produce the comparison data in **two forms** so either path works without regenerating content:

1. **Markdown table** (for editors that auto-convert Markdown on paste)
2. **Per-tool bulleted breakdown** (tool name as a sub-heading, then bulleted key:value pairs — confirmed to paste cleanly into any rich-text editor without relying on table-conversion behavior)

The QA checklist (`workflow/QA-CHECKLIST.md`) checks that both forms are present and contain identical data before a draft is marked ready for CMS ingestion.

---

## 9. FAQ system

- Exactly 5 questions, always the final substantive section.
- Each answer ≤45 words / ≤3 lines on desktop.
- Direct, factual, no narrative preamble, no sales pitch.
- Answers clarify — they do not repeat full paragraphs from the body.
- Heading format: `## Frequently Asked Questions` then `### [Question]?`

---

## 10. Internal linking and SEO

- **Primary keyword pattern:** `best [competitor] alternatives for [audience/use case]`, placed verbatim in the H1.
- **Internal links required:** 1 pillar use-case article + 1 head-to-head comparison article, both from the 120-title master list, only if that specific sibling article has already been published (has a live URL). If the sibling hasn't been published yet, use `[INTERNAL LINK CANDIDATE: title of sibling article]` instead of a guessed URL.
- **Demoly domain link:** demoly.dev, in the TL;DR and again in the conclusion CTA. Never link to a specific demoly.dev subpage unless that URL has been confirmed to exist.
- No keyword stuffing. Reader experience takes priority over SEO mechanics.

---

## 11. Pricing rules

- State Demoly pricing only from the confirmed list in Section 2.
- For every competitor, append: `(Note: Competitor pricing is subject to vendor updates.)`
- If a competitor's current pricing cannot be found/verified during research, do not guess — write `[VERIFY PRICING]` in place of a number and flag it in the QA report.
- Never invent a discount, promo, or plan tier that wasn't found in research.

---

## 12. Research and factuality rules

Authority order for any claim about a competitor or the market:

1. Explicit, currently supplied product documentation
2. User-provided verified facts
3. Approved Demoly editorial material (this file, Section 2)
4. Official competitor/company sources (their own pricing/feature pages)
5. High-quality independent sources
6. Competitor blog content (structure/positioning only — never a source for facts about that competitor, and never copied wording)
7. General background knowledge (lowest priority, used only for non-factual framing)

Any claim that can't be traced to sources 1–5 must be marked `[VERIFY]` in the draft, not stated as fact.

---

## 13. Output contract

The model must return **only** the following structure — no preamble, no "Here is your article," no closing commentary.

```json
{
  "title": "",
  "slug": "",
  "excerpt": "",
  "content_markdown": "",
  "content_html": "",
  "comparison_table_markdown": "",
  "comparison_table_list_fallback": "",
  "category": "Comparisons",
  "tags": [],
  "featured_image_brief": "",
  "author": "",
  "is_published": false,
  "published_at": null,
  "vertical": "",
  "target_audience": [],
  "primary_keyword": "",
  "secondary_keywords": [],
  "internal_link_candidates": [],
  "visual_recommendations": [],
  "fact_check_flags": [],
  "qa_status": "",
  "editor_notes": []
}
```

`is_published` must always be `false` on output. Setting it `true` is a human action outside this system.

---

## 13.5. Featured Image & Competitor Branding Pipeline Specification

Every blog post generated must include a cohesive, high-converting featured image adhering to the **Demoly/Supademo Visual Design System**:

1. **Resolution & Dimensions:** Standard 16:9 (`1200x630` px) crisp PNG.
2. **Brand Anchors:** Demoly Logo in top-left, signature Demoly Orange (`#FF5722`) + deep charcoal (`#111827`) typography.
3. **Competitor Brand Badges (1-on-1 & Alternatives):** When an article focuses on a competitor (e.g., Loom, Scribe, Tango, Supademo, Guidde, etc.), the competitor's signature brand color and badge icon (e.g. `VS ✦ Loom`, `VS ◈ Scribe`, `VS ▲ Tango`) must be rendered alongside the category pill.
4. **Hero UI Product Mockup:** Browser window with Demoly interactive player scrubber + context-aware floating AI Search Drawer containing article-specific questions and timestamped jump points.
5. **Micro-Annotations:** Playful handwritten notes and corner framing brackets in brand accent.
6. **Cloudinary & CMS Sync:** Automated generation via `ImageGeneratorService`, upload to Cloudinary `demoly-cms` folder, and registration into MongoDB `posts` & `media` collections.

---

## 14. Other verticals — current status

Only **Vertical 2 (Competitor: Alternatives)** has a fully derived blueprint (Sections 3–9 above). The 120-title master list defines six more verticals (How-To/Feature, Competitor: Pricing, Competitor: Vs/Three-Way, Profession-Specific, Use-Case/Best-Tool-For, Industry-Specific, Playbooks & Frameworks, Technical Deep-Dives). Their structural skeletons are named in the master list but have not been through the same reverse-engineering pass as Vertical 2 — no approved sample exists yet for any of them.

`NEEDS CONFIRMATION`: a blueprint pass (same process used for Vertical 2: approve one sample article per vertical, then reverse-engineer it) for each remaining vertical before this master prompt is used to batch-generate outside Vertical 2. Running this master prompt against a non-Vertical-2 title today would force the model to improvise structure — which this system is explicitly built to avoid. Until that pass happens, only Vertical 2 titles should be run.
