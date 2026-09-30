Vertical 7: Technical Deep-Dives & Product Updates — Master Blueprint
1. Purpose and Editorial Identity
Vertical 7 explains the engineering architecture, product decisions, and interface mechanics behind modern screen communication. It is written for software engineers, product managers, technical agency leads, and tech-literate operators who want to understand how tools work under the hood.
The goal is not to write internal API documentation or marketing copy. The goal is to explain technical concepts clearly enough that a reader understands what is happening under the surface, why a given technical choice matters, and how it changes their workflow.
The standard across this vertical is:
Technically credible + simple to understand + high information density + zero padding.
2. The Two Content Formats
This vertical contains two distinct content types that share core editorial principles but use different structures, lengths, and publication cadences.
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Vertical 7 Format Split                               │
├─────────────────────────┬───────────────────────────────────────────────────────┤
│ Format A: Deep-Dives    │ Evergreen architectural explainers and technical      │
│ (Posts #127–#133)       │ comparisons (e.g., DOM vs. Pixel Capture, MCP Agents).│
├─────────────────────────┼───────────────────────────────────────────────────────┤
│ Format B: Updates       │ Monthly product releases highlighting shipped         │
│ (Post #134 recurring)   │ features and workflow value without changelog bloat.  │
└─────────────────────────┴───────────────────────────────────────────────────────┘

Format A: Technical Deep-Dives
Scope: Architectural mechanics, capture paradigms, AI indexing layers, and developer workflows.
Core Topics:
DOM Capture vs. Pixel Capture: Why It Changes What a Video Can Answer
Why Transcript-Only Video Search Fails
How Element-Anchored Masking Beats Static Blur Boxes
How AI Indexes a Silent Screen Recording
What Makes a Video AI-Searchable?
Feeding Bug Context to Cursor and Claude Code via MCP
Nature: Long-term evergreen references.
Format B: Monthly Product Updates
Scope: Recurring monthly releases summarizing shipped capabilities (e.g., New in October: What Shipped in Demoly).
Nature: Time-stamped product heartbeat showing steady iteration, user-facing impact, and functional additions.
3. Length, Minimization, and Information Density
Word counts are ceilings and general guidelines, never targets to pad toward.
Technical Deep-Dives: 1,200–1,600 words. If a topic is thoroughly and accurately explained in 1,000 words, stop there. Expand past 1,500 words only when complex protocols (like MCP or multi-layered security pipelines) require it.
Monthly Product Updates: 500–900 words. A month with three meaningful updates should stay concise, not stretched to mimic ten features.
The Minimization Rule
Information density always overrules length. Before keeping any sentence or section, ask:
Does this teach the reader something necessary about the core technical question?
Has this point already been explained in a previous section or summarized in a table?
Can this sentence be phrased in simpler English?
Is this technical detail necessary, or is it decorative complexity?
If text fails these checks, cut it.
4. Language, Tone, and Readability Rules
Technical accuracy does not require complex language. Write like a knowledgeable senior engineer explaining a system to a product peer.
Simpler Words by Default:
Use use instead of utilize.
Use help instead of facilitate.
Use show instead of demonstrate.
Use start instead of commence or initiate.
Use pick or choose instead of opt for.
Sentence Construction: Write complete, grammatically sound sentences averaging 14–20 words. Avoid artificial fragments and rhetorical questions.
Paragraph Rhythm: Keep paragraphs to 2–4 sentences (under 65 words) for rapid desktop and mobile scanning.
Zero Jargon Padding: Ban empty tech buzzwords (paradigm shift, revolutionize, seamless, game-changer, next-level).
Necessary Technical Terms: Freely use authentic terms (DOM tree, rasterized frame, OCR, API keys, bounding box, semantic tokens, canvas layer), but explain their functional outcome in plain English on first use.
Em-Dash Policy: Strictly minimize em-dashes (—). Use colons, parentheses, commas, or separate sentences instead.
5. Master Architecture: Technical Deep-Dives
Every technical deep-dive uses this logical progression:
H1: Clear, Search-Focused Title
├── Introduction (~80–120 words: Problem → Friction Point → Why Distinction Matters)
├── [Visual Reference #1: Architectural or Capture Contrast]
├── Core Concept: Plain-English Definition
├── How It Works: Technical Mechanism & Pipeline
├── The Important Difference (Mechanism Comparison / Markdown Table)
├── Why the Difference Matters (Real-World Workflow Impact)
├── Concrete Example: Grounded Workplace Scenario
├── Topic-Specific Engineering Section (Deep-dive unique to the subject)
├── Limitations, Trade-offs, and Boundaries
├── How Demoly Fits In (Organic Architecture Application)
├── Conclusion (Short, 1-paragraph operational takeaway)
└── Frequently Asked Questions (Minimum 5 questions; ≤3 lines each; strictly at the end)

Section Breakdown & Requirements
Section Hierarchy
Section Purpose
Target Length
Core Requirements
What to Avoid
H1 Title
Matches search intent directly.
6–12 words
Descriptive, technical question or clear comparative hook.
Vague hype ("The Future of Video").
Introduction
Hooks on the technical problem.
80–120 words
State the technical bottleneck, why the mechanism matters, and what the article answers.
Preambles, history of screen recording, mentioning Demoly early.
Core Concept
Establishes the mental model.
120–180 words
Plain-English explanation before diving into browser or system architecture.
Dense browser-engine jargon without definitions.
How It Works
Explains the underlying pipeline.
150–220 words
Detail data capture, processing, and output mechanics simply.
Exposing backend code or edge-case mechanics that distract from the main thesis.
The Difference
Highlights the functional contrast.
150–250 words
Contrast data retained vs. lost. Include a compact Markdown comparison table.
Giant 15-row matrices; repeating table text in surrounding prose.
Why It Matters
Connects mechanics to outcomes.
120–180 words
Explain practical impacts: faster search, unvoiced interaction discovery, reliable debugging.
High-level platitudes about productivity or generic digital transformation.
Concrete Example
Grounds theory in reality.
100–160 words
One realistic, domain-specific scenario (e.g., debugging a silent checkout toggle).
Multiple weak examples or fictional multi-paragraph stories.
Topic Deep-Dive
Addresses the unique technical premise.
180–250 words
Cover the specific engineering angle (e.g., vector indexing, MCP protocol, canvas redaction).
Generic product re-explanations.
Limitations
Establishes credibility.
80–140 words
Honest boundaries: browser constraints, processing overhead, OCR failure points.
Presenting any technology as flawless or magic.
Demoly Section
Shows practical implementation.
100–150 words
Explain Demoly's architectural approach to the problem.
Sales pitches, feature checklists, or claiming Demoly is the only tool.
Conclusion
Closes the loop.
40–60 words
One concise paragraph stating the primary takeaway.
Generic summaries repeating earlier points.
FAQs
Captures follow-up search queries.
5 questions; ≤3 lines each
Direct, technical answers to common edge-case objections.
Marketing filler, re-explaining the core article.

6. Structural Adaptations Across Topic Types
Do not force every technical article into an identical mold. Adapt the middle sections to match the inquiry type:
Technical Comparison (e.g., DOM vs. Pixel):
Core Concept  How Each Works  Comparison Table  What Each Answers  Trade-offs  Workflow Impact.
"Why" Failure Analysis (e.g., Why Transcript-Only Search Fails):
The Failure Mode  Why the Architecture Breaks  The Missing Data Layer  The Better Approach  Workflow Result.
"How" Process Breakdown (e.g., How AI Indexes Silent Recordings):
The Problem  Capture Stage  Interpretation/Event Graph  Indexing & Vectorization  Retrieval Stage.
Developer & Agent Workflows (e.g., Feeding Context via MCP):
Developer Friction  Context Deficits in AI Coding  What MCP Provides  Data-Flow Architecture  Resulting Workflow.
7. Comparison Tables: Rules for High Utility
Tables should help the reader scan technical characteristics quickly.
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Comparison Table Rules                                │
├───────────────────┬─────────────────────────────────────────────────────────────┤
│ Optimal Size      │ 5 to 8 technically meaningful criteria.                     │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ Outcome-Focused   │ Contrast mechanics and data states, not generic checklists. │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ Concise Cells     │ 4 to 12 words per cell explaining the technical outcome.    │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ No Duplication    │ NEVER repeat table rows verbatim in the surrounding text.   │
└───────────────────┴─────────────────────────────────────────────────────────────┘

Good Criteria: Data captured, visual appearance, semantic structure preserved, text extraction method, searchability of silent actions, operating environment limits.
Bad Criteria: Generic bullet points, subjective stars, or empty "Yes/No" checkmarks.
8. Real-World Grounded Examples
Avoid abstract placeholders like "user clicks button and sees error". Use domain-specific artifacts:
QA / Bug Reporting: A silent click on button[data-testid="toggle-billing"] causing an uncaught state transition; /api/v1/auth returning a 500 error on checkout.
Client Deliverables: An agency developer silently configuring a Webflow CMS collection or Stripe webhook key without voiceover narration.
Developer Context: Passing an exact DOM selector, browser console error trace, and visual frame state to Claude Code or Cursor via an MCP server connection.
Keep examples to one strong scenario. Let the single example prove the point.
9. Visual Reference System
Visuals must explain concepts that would otherwise require multiple paragraphs of complex text. Never add visuals for decoration.
Standard Format
Plaintext
[Visual Reference: Brief, specific description of what the visual should show and what the reader should understand from it]

Approved Visual Types
Architectural / Data Flow Diagrams: Contrasting pipeline flows (e.g., Pixel stream  OCR vs. DOM stream  Semantic Index).
Side-by-Side Comparisons: Flat video playback vs. interactive DOM-aware player.
Annotated UI Screenshots: Showing element-pinned comments, canvas-layer redaction, or AI search drawers jumping to exact frame timestamps.
10. Technical Limitations and Trade-offs
Credibility requires honest boundaries. Do not present technology as magic or claim that AI understands every screen event without flaws:
DOM Capture Limits: Bound to browser environments (web apps); cannot inspect native desktop OS applications, local terminals, or non-web windows.
Pixel Capture Strengths: Universal compatibility across any operating system, legacy application, or display buffer without code integration.
AI Search Realities: DOM data improves retrieval accuracy, but search quality still depends on clean event logging, well-structured HTML, and indexing pipelines.
11. Demoly Product Integration Protocol
Demoly must appear organically as a practical application of the engineering principles discussed, never as an aggressive pitch.
                    ┌───────────────────────────────────────────────┐
                     │          Product Integration Spectrum         │
                     └───────────────────────┬───────────────────────┘
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      ▼                                      ▼                                      ▼
Aggressive Advertorial                 Natural Implementation                 Irrelevant Aggregator
"Demoly is the only tool               "Demoly applies this concept           "Here is an essay on DOM
that understands video. Everything     by pairing visual frames with a        trees with no connection to
else is obsolete."                     DOM event index..."                    modern tooling."
(Low Credibility / High Bounce)        (High Credibility / LLM Citable)       (Zero Commercial Value)

Positioning: Explain the broad technical problem first, then show how Demoly solves it in code and UI.
Specific Capabilities: Highlight only features relevant to the topic (e.g., indexing unvoiced actions, permanent canvas-layer redaction, copying text out of video frames, element-anchored comments).
Independent Value: The article must teach something useful even if the reader never uses Demoly.
Accurate Packaging: Reference verified plans when relevant ($0 Free tier with 15-minute cap; $8/creator Pro tier with 30-minute cap and unlimited AI queries; always unlimited free viewers).
12. Master Architecture: Monthly Product Updates
Monthly updates (#134) follow a streamlined, scannable format that informs users and search engines what changed without promotional fluff.
H1: New in {Month}: What Shipped in Demoly
├── Short Introduction (2–3 sentences: Core theme of the sprint)
├── H2: What Shipped
│   ├── H3: [Feature 1 Name]
│   │   ├── What changed: 1–2 direct sentences
│   │   ├── Why it matters: 1–2 sentences on operational benefit
│   │   └── [Visual Reference: UI screenshot, GIF, or demo interaction]
│   ├── H3: [Feature 2 Name]
│   │   └── ...
│   └── H3: [Feature 3 Name]
│       └── ...
├── H2: Small Improvements (Optional: Bulleted list of minor refinements)
├── H2: What's Next (Optional: 1–2 confirmed upcoming capabilities)
└── Conclusion (One short takeaway paragraph)

Writing Rules for Product Updates
No Marketing Hype: Ban phrases like "We are thrilled to announce another jam-packed month of innovation". Jump straight to what shipped.
Format Consistency: Every feature must answer: What changed? Why does it matter? Add How to use it only if the workflow is not intuitive.
Factual Roadmaps: Never speculate or promise unconfirmed features in "What's Next."
13. Frequently Asked Questions (FAQ) System
The FAQ section is the final substantive section of an evergreen technical deep-dive.
Count: Minimum 5 questions matching real technical search queries.
Length: Answers must be 1–3 short sentences (under 45 words).
Content: Answer specific technical edge cases, environmental constraints, and operational concerns.
No Repetition: Never copy-paste text from the main body.
Product Updates: FAQs are generally unnecessary in monthly updates unless a new feature creates obvious configuration questions.
The Non-Negotiable Editing Rule for FAQs
When revising or shortening an existing article to reduce overall word count, never shorten, rewrite, remove, or restructure the FAQ section. Cuts must come exclusively from the main body copy unless an FAQ has an explicit factual error.
14. Plain-Editor Formatting Standards
All articles must paste cleanly into standard content management systems (WordPress, Webflow, Ghost, Docs) without layout errors.
Prohibited Formatting:
No triple-backtick Markdown code blocks (```) for text or ticket examples.
No complex nested Markdown tables with embedded paragraphs.
No proprietary layout tags or brittle HTML wrappers.
Allowed Formatting:
Standard Markdown headings (#, ##, ###).
Standard paragraphs (2–4 sentences).
Bulleted lists (*) and numbered lists (1.).
Inline bolding (**Anchor:**) for scannable readability.
Standard bracketed Visual Reference tags ([Visual Reference: ...]).
Simple Markdown tables where supported.
15. SEO, Search Intent, and Internal Linking
Search Intent: Technical deep-dives target informational, comparative, and architectural queries ("how does X work", "X vs Y", "why transcript search fails"). The article must answer the core question within the first two sections.
Keyword Integration: Use primary and secondary terms naturally in the H1, intro, section headers, and FAQ triggers. Avoid keyword stuffing.
Internal Linking Flow:
Technical Concept  Relevant Playbook (e.g., DOM Capture  QA Bug Reporting Playbook).
Architectural Feature  Use-Case Page (e.g., Canvas Redaction  Production Demo Security).
Product Update  Feature Documentation.
16. Anti-Patterns to Avoid
Documentation Bloat: Writing a dry manual instead of an engaging, educational explainer.
Jargon Masks: Using complicated phrasing to make a simple concept sound profound.
Prose Table Echoes: Repeating everything from the comparison table in the very next paragraph.
Example Overload: Using three mediocre examples when one precise, realistic scenario proves the point.
Unsubstantiated AI Magic: Claiming AI magically understands all visual activity without detailing the capture-to-index pipeline.
Advertorial Tone: Turning an architectural comparison into a heavy Demoly sales pitch.
Padded Word Counts: Adding historical summaries or generic conclusions to hit an arbitrary word count.
Excessive Em-Dashes: Overusing "—" instead of clean punctuation and sentence structures.
17. Pre-Publication Quality Checklist
Before publishing or approving any article in Vertical 7, run these checks:
[ ] Technical Accuracy: Is every engineering statement, data flow, and browser mechanism defensible and accurate?
[ ] Reading Velocity: Can a technical operator understand the core idea within 2 minutes of reading?
[ ] Simple Language: Are complex terms translated into plain English upon their first appearance?
[ ] No Table Duplication: Does the narrative expand on workflow impact rather than restating table cells?
[ ] Grounded Example: Does the article feature one realistic workplace artifact (DOM selector, API route, unvoiced action)?
[ ] Balanced Demoly Placement: Is Demoly introduced naturally as a practical application without hype or premature introduction?
[ ] Honest Boundaries: Are technical constraints, capture limits, and trade-offs clearly identified?
[ ] Visual References: Are all visual tags specific, instructional, and properly formatted as [Visual Reference: ...]?
[ ] Plain-Editor Clean: Is the draft free of backtick code blocks, broken markdown, or nested syntax?
[ ] FAQ Integrity: Are there at least 5 concise FAQs at the very end? (If this was a revision, was the FAQ section kept untouched?)
[ ] Length & Density: Is the article free of fluff, generic introductions, and filler transitions?

