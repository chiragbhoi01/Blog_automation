# QA Checklist — Demoly Content Generation

Run this against every generated article before it is created as a CMS draft. A `BLOCKED` result on any item in **Factuality** stops that article from proceeding to CMS ingestion; other sections can produce `PASS_WITH_REVIEW` for a human to resolve.

## Structure

- [ ] H1 present and matches the topic title pattern (`Best [Competitor] Alternatives for [Audience]` for Vertical 2)
- [ ] TL;DR present, 60–90 words, one bullet per tool, Demoly listed first
- [ ] "Why [Audience] Outgrows [Competitor]" section present, 3–4 bullets
- [ ] "What to Look For" section present, 4-pillar framework
- [ ] Every tool has a profile in the correct order (Demoly first, incumbent competitor last)
- [ ] Every tool profile has all required subsections (Overview, Strengths, Weaknesses, Pricing)
- [ ] Comparison matrix section present, in both Markdown-table and per-tool-list form (Section 8 of the master prompt)
- [ ] "Which Alternative Should You Choose" section present with a bulleted per-tool recommendation
- [ ] FAQ section present, exactly 5 questions, and is the final substantive section (nothing else follows it)

## Content

- [ ] Target audience is consistent throughout (no drift to a different persona mid-article)
- [ ] Article matches the stated search intent for this title
- [ ] Alternatives listed are genuinely relevant to the competitor/category named in the title
- [ ] No section padded purely to match another section's length
- [ ] No duplicated points repeated across sections
- [ ] Competitors are credited with genuine strengths, not artificially degraded

## Factuality (blocking)

- [ ] Every Demoly claim traces to Section 2 of the master prompt, or is marked `[VERIFY PRODUCT FACT]`
- [ ] Every competitor pricing claim is either sourced or marked `[VERIFY PRICING]`, and carries the vendor-update disclaimer
- [ ] Every competitor feature/integration claim is sourced, not assumed
- [ ] No URL appears that wasn't confirmed to exist; unconfirmed internal links use `[INTERNAL LINK CANDIDATE: ...]`
- [ ] No fabricated statistic, quote, or customer story appears anywhere

## SEO

- [ ] Primary keyword appears in the H1
- [ ] Heading hierarchy is clean (H1 → H2 → H3, no skipped levels)
- [ ] No keyword stuffing
- [ ] Internal links: 1 pillar use-case link + 1 head-to-head comparison link (or candidates if not yet published)
- [ ] Demoly domain link (demoly.dev) appears in TL;DR and conclusion

## Style

- [ ] Sentences average 14–22 words and are grammatically complete
- [ ] Paragraphs are 3–4 sentences / under ~65 words
- [ ] No banned jargon (see Section 7 of the master prompt for the list)
- [ ] Em-dashes minimized; headings use colons, not em-dashes
- [ ] No banned opening phrases ("In today's fast-paced world...", etc.)
- [ ] Active voice used throughout

## CMS Readiness

- [ ] Output matches the JSON contract in Section 13 of the master prompt exactly
- [ ] `is_published` is `false`
- [ ] `slug` is lowercase, hyphenated, and does not collide with an existing published slug (`NEEDS CONFIRMATION`: requires a live check against the CMS, see Phase 5 of `IMPLEMENTATION-PLAN.md`)
- [ ] Comparison table data is present in both required formats and the two are consistent with each other

## Word Count

- [ ] Total article length: 2,400–2,600 words
- [ ] Introduction (incl. TL;DR): 160–230 words
- [ ] No non-Demoly tool profile exceeds ~200 words
- [ ] Demoly profile: 240–280 words
- [ ] FAQ total: 200–250 words

## Visual QA & Image Decision

- [ ] Featured cover image path specified in metadata (`assets/<slug>-cover.png` or Cloudinary URL)
- [ ] Visual Decision System applied for every in-article visual reference:
  - Reused existing approved asset if available
  - Outputted Admin Screenshot Request if exact Demoly UI / feature state required (no fabricated product UI)
  - Specified ready-to-use AI prompt referencing vertical reference image (`verticals/vertical_images/vertical_<N>.png`) for conceptual visuals
- [ ] AI prompts enforce clean, editorial, non-cluttered B2B SaaS aesthetic (Inter font, #FF5722 Demoly orange accent, #111827 dark charcoal, warm off-white background)
- [ ] No prohibited AI tropes present in prompts (excessive 3D, heavy glassmorphism, generic robots, floating stock elements)
- [ ] All images follow 16:9 standard aspect ratio (1200×630 px)

## Final status

Record one of:
- `PASS` — proceeds to CMS draft creation
- `PASS_WITH_REVIEW` — proceeds to CMS draft creation, flagged for closer human read on the specific items noted
- `BLOCKED` — does not proceed; logged with the specific failing item(s) in `tracking/PROGRESS.md`
