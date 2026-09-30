Vertical 3 — Profession-Specific: Master Writing Blueprint
1. Vertical Purpose & Search Intent
Vertical 3 targets practitioners searching for tactical solutions to specific, recurring workflow problems within their roles. Unlike general how-to guides that explain basic software operations, these readers are experienced professionals trying to resolve operational bottlenecks between roles, eliminate unnecessary sync meetings, or prevent repetitive post-delivery friction.
Profession-Specific vs. Generic How-To Content
Generic How-To Content: Focuses on broad concepts, generic software navigation, or office productivity tips (e.g., "How to write a clear bug report" or "How to communicate with clients asynchronously"). It uses generic workplace language, assumes abstract deliverables, and offers high-level advice like "communicate clearly" or "be thorough."
Profession-Specific Workflow Content: Operates directly inside the practitioner's operational boundaries and tech stack. It addresses the structural tension between two collaborating parties (e.g., QA tester vs. full-stack developer, agency project lead vs. non-technical client, CS manager vs. newly onboarded admin), references actual workplace artifacts (DOM elements, staging URLs, console traces, CMS permissions, Jira backlogs), and directly impacts role-specific metrics (debugging velocity, unbilled support hours, deflection rates, sprint velocity).
The Reader's Practical Intent
The reader is not looking for a high-level overview of their job. They are asking:
"How do I execute this specific handoff, review, or documentation step so the person on the other end understands it immediately, without booking another meeting or kicking it back as incomplete?"
The article must deliver:
Direct validation of the exact operational failure point.
A clear, step-by-step method to fix the workflow today.
A concrete visual reference showing how the completed deliverable looks in practice.
A clear explanation of why legacy media (text tickets, flat video recordings) causes friction and how interactive walkthroughs resolve it.
2. Core Article Architecture
Vertical 3 uses a progressive, problem-to-execution structure designed for fast scanning and practical utility. The sample article (How QA Engineers Write Bug Reports Developers Can Actually Reproduce) serves as the structural baseline.
H1: How [Profession] [Solves Workflow Friction Without Meeting/Cost]
├── Introduction (The Failure Mode + The Operational Standard)
│   └── The [Workflow] Standard (Scannable Bulleted Baseline)
│   └── [Visual Reference: Problem vs. Solution Workflow Contrast]
├── H2: Why [Traditional Process / "Failure Mode"] Happens (Core Bottlenecks)
├── H2: [N] Steps to [Clear / Practical Outcome] (Actionable Methodology)
│   └── [Visual Reference: Workflow Sequence / Step-by-Step Flowchart]
├── H2: What Makes an Effective [Workflow Artifact] (Breakdown of Best-Practice Example)
│   └── [Visual Reference: Annotated Best-Practice Artifact Example]
├── H2: Comparing Documentation Formats (Text vs. Video vs. Searchable Walkthroughs)
│   └── [Visual Reference: Searchable Walkthrough in Action]
├── H2: Using Demoly for [Specific Professional Workflow] (Tactical Execution)
└── H2: Frequently Asked Questions (Exactly 5 Questions; ≤3 lines each)

Section Breakdown & Hierarchy
Section Hierarchy
Section Scope / Name
Purpose
Mandatory / Optional
H1
How [Profession] [Solves Workflow Friction Without Meeting/Cost]
Sets the exact practitioner scope, target role, and operational outcome.
Mandatory
Prose
Introduction
Opens directly on the acute operational breakdown and diagnoses why text descriptions fail machine/human state.
Mandatory
Bulleted List
The [Workflow] Standard
High-density bullet list giving the reader an immediate operational baseline.
Mandatory
Callout
Visual Reference #1
Problem-vs-solution comparison visual (e.g., contrasting vague output with forensic output).
Mandatory
H2
Why [Traditional Process / Failure Mode] Happens
Breaks down the 2 to 4 structural reasons why the current manual process breaks down.
Mandatory
H2 & H3s
[N] Steps to [Clear Outcome]
Actionable, step-by-step execution framework (usually 4 to 6 numbered steps).
Mandatory
Callout
Visual Reference #2
Visual sequence or flowchart illustrating the core procedural path.
Mandatory
H2
What Makes an Effective [Workflow Artifact]
Dissects a concrete workplace artifact; explains why the components work without using Markdown code blocks.
Mandatory
Callout
Visual Reference #3
Dedicated visual reference of the complete, populated artifact (e.g., bug ticket, staging review spec, handoff packet).
Mandatory
H2
Comparing Documentation Formats
Compares Text vs. Standard Video vs. Searchable Walkthroughs for this role.
Mandatory
Callout
Visual Reference #4
Visual showing an interactive walkthrough (e.g., AI search jumping to an action or copying text from video).
Mandatory
H2
Using Demoly for [Professional Workflow]
Practical, 3- to 4-step workflow explaining how to use Demoly as the visual capture layer.
Mandatory
H2 & H3s
Frequently Asked Questions
Exactly 5 targeted edge-case questions answered in 3 lines or fewer (≤45 words).
Mandatory (Must be final section)

3. Profession-Specific Adaptation Rules
Every article across the 18 topics shares the same editorial architecture, but the operational variables must adapt completely to the specific profession.
              ┌────────────────────────────────────────────────┐
               │    Vertical 3 Architecture Consistency Split   │
               └───────────────────────┬────────────────────────┘
                                       │
         ┌─────────────────────────────┴─────────────────────────────┐
         ▼                                                           ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│     NON-NEGOTIABLE (Consistent) │         │    ADAPTABLE (Per Profession)   │
│ • Problem-first hook            │         │ • Domain terminology & jargon   │
│ • Plain-editor formatting       │         │ • The operational artifact      │
│ • Visual Reference tags         │         │ • Surrounding tool stack        │
│ • Media evolution section       │         │ • Viewer recipient dynamics     │
│ • Natural Demoly placement      │         │ • Performance metrics & stakes  │
│ • FAQ rules (5 Qs, ≤3 lines)    │         │ • Telemetry vs. privacy needs   │
└─────────────────────────────────┘         └─────────────────────────────────┘

The Adaptation Matrix Across Roles
Role & Topic Group
Primary Operational Friction
Surrounding Tool Stack
Practical Artifact to Analyze
Core Demoly Advantage
QA & Testing (#69, #71)
"Cannot Reproduce" tickets, lost console telemetry, unrecorded silent actions.
Jira, Linear, GitHub Issues, Chrome DevTools.
Forensic Bug Ticket with DOM selectors and console traces.
Copying code/logs from paused frames; indexing silent clicks and DOM actions.
Engineering & Tech Leads (#72, #84)
Senior devs lose focus time running repo tours; context-switching during PR reviews.
GitHub, GitLab, VS Code, Docker, Terminal.
Codebase Architecture Walkthrough & PR Context Packet.
Searching visual code navigation; copying commands directly from video frames.
Agencies & Client Delivery (#73, #74, #83)
Unbilled post-launch support calls; non-technical clients scrubbing 20-min videos.
Webflow, Shopify, WordPress, Stripe, Slack.
Client Handover Acceptance Packet & CMS Operating Guide.
Frame-level canvas redaction of API keys; natural-language AI Q&A for clients.
Product Management & Scrum (#70, #82)
8-person staging review meetings; scheduling delays stalling sprint deployment.
Figma, Linear, Jira, Staging URLs, Notion.
Asynchronous Staging Acceptance Matrix & Sign-Off Packet.
Element-pinned comments; tab-switching capture across staging environments.
Customer Success & Support (#75, #79)
Repetitive tier-1 questions; low client activation; typing out identical 5-paragraph docs.
Zendesk, Intercom, HubSpot, Notion, Loom.
Ticket Deflection Walkthrough Guide & Client Onboarding Agenda.
Jumping directly to exact timestamps via natural language questions.
UI/UX Design (#76)
Developers missing responsive rules, micro-interactions, and token variables in static Figma.
Figma, Storybook, Zeplin, Zeroheight.
Design Handoff Spec Sheet (States, tokens, responsive rules).
Reviewing interactive UI states without scheduling a live walkthrough call.
Solutions & Sales Engineering (#78, #85)
Answering repetitive technical RFP questions; scheduling live demos for simple technical checks.
Salesforce, HubSpot, Gong, Demo environments.
Reusable Technical Q&A Walkthrough Library.
Searchable demo libraries that sales reps and prospects can query on demand.
HR, Ops & Training (#80, #81)
Repeating 1:1 internal tool setups; answering repeated software navigation questions.
Google Workspace, BambooHR, Slack, Internal Admin.
Internal Software Onboarding SOP & Tool Setup Checklist.
Indexing internal navigation clicks so employees self-serve tool setup.

4. Problem Framing Rules
Start at the Point of Breakdown: Open sentence 1 with the exact moment the workflow fails (e.g., the "Cannot Reproduce" ticket, the unbilled client support email 14 days after launch, the 60-minute staging meeting where 6 people watch one person click a broken button).
Eliminate Career and Industry Fluff: Never write introductory filler like:
"Quality Assurance is an essential part of the modern software development lifecycle."
"In today's fast-paced digital world, agencies must keep clients satisfied."
"Product managers wear many hats and must communicate effectively."
Frame Friction Structurally, Not Emotionally: Avoid blaming coworkers or clients. Frame the breakdown as a limitation of communication media: human language is an imperfect translation layer for software execution state, and flat video traps knowledge on a linear timeline.
5. Practical Content & Framework Guidelines
Immediate Actionability: The reader must be able to use the core methodology immediately, even if they do not adopt Demoly.
Numbered Execution Steps: Present the core workflow as 4 to 6 logical steps (H3s or numbered lists) focusing on tactical actions (e.g., Isolate the Minimal Path, Note Starting Conditions, Anchor to Exact Elements).
No Unnecessary Framework Bloat: Do not invent artificial acronyms or corporate models. Use clear operational verbs (Prepare, Capture, Redact, Share, Index).
6. Examples & Scenarios
Use Grounded, Realistic Context: Examples must reflect real workplace situations rather than abstract placeholders.
Unrealistic / Generic: "The user clicked the button and got an error."
Realistic / Profession-Specific: "Submitting the team invite modal without selecting a department leaves the UI hanging on an infinite spinner and throws an uncaught TypeError in InviteModal.tsx."
Detailed but Not Bloated: Use concrete interface components (e.g., /settings/team, button[data-testid="invite-member-btn"], HTTP 500 payload response). Keep technical details relevant to the diagnostic process without inventing unnecessary backend code.
7. Visual Reference System (Mandatory Format)
To maintain clean publishing across any content management system without rendering errors, use standardized Visual Reference tags instead of complex Markdown blocks or raw image files.
Standard Visual Reference Format
Plaintext
[Visual Reference: Brief, specific description of what the visual should show]

Visual Reference Rules
Be Specific: State exactly what elements, tools, and UI components must be visible in the graphic or screenshot.
Contextual Placement: Place the visual reference directly below the introductory paragraph of the section it supports.
No Decorative Filler: Use visual references only where seeing the interface, sequence, or artifact clarifies the text.
Mandatory Visual Touchpoints per Article:
Visual 1 (Hook/Contrast): Flowchart or split graphic contrasting traditional friction against the modern searchable workflow.
Visual 2 (Framework): Process diagram or flowchart illustrating the core procedural steps.
Visual 3 (Artifact Breakdown): Example of the populated professional artifact (ticket, spec, review checklist) in a real interface.
Visual 4 (Searchable Walkthrough): UI screenshot of Demoly showing interactive AI search, DOM comments, or frame text copying.
8. Plain-Editor Formatting Standard
Articles must be fully compatible with standard publishing editors (WordPress, Webflow, Ghost, Google Docs).
Strict Formatting Restrictions
No Markdown Code Blocks (```): Never format ticket templates, code snippets, or logs inside code blocks.
No Markdown Tables: Do not use | Column | Column | tables for artifacts or comparisons. Use bulleted breakdowns, simple lists, or Visual References instead.
No Complex Formatting Dependencies: Avoid nested callout boxes or platform-specific syntax that breaks on plain-text copy-paste.
Allowed Formatting
Standard Markdown headings (# H1, ## H2, ### H3).
Standard bulleted lists (* Item) and numbered lists (1. Item).
Plain inline bolding (**Key Anchor:**) for scannable anchors.
Plain text paragraphs (2 to 4 sentences).
Bracketed Visual References ([Visual Reference: ...]).
9. Demoly Integration Protocol
Demoly must appear organically as the logical tooling evolution that eliminates the friction of traditional media, rather than as an aggressive advertorial.
Traditional Text             Traditional Flat Video          Demoly Walkthrough
(High creation friction;     (Fast to record; impossible     (Fast to capture; visual/DOM
missing runtime context)     to search; client scrubs)       indexed; AI answers on demand)

Integration Rules
Never Mention Demoly in Sentence 1: Let the operational friction breathe before introducing software solutions.
Introduce in the Media Comparison Section: Introduce Demoly naturally when contrasting text documentation and standard screen recording (Loom) against interactive walkthroughs.
Tie Capabilities Directly to Role Friction:
QA / Developers: Highlight DOM element tagging, text/code extraction from paused video frames, and searching silent clicks.
Agencies / Client Handovers: Highlight permanent canvas redaction of credentials/PII and AI Q&A that stops clients from booking follow-up calls.
Support / CS: Highlight instant timestamp jumps for repeat how-to queries.
Maintain Informational Integrity: Ensure the article provides genuine diagnostic and workflow value to readers who continue using standard issue trackers or screen recorders.
Collective Category Referencing: When referencing market trends, use balanced phrasing: "Modern walkthrough tools like Demoly and other specialized capture platforms..."
10. Writing Style & Language Rules
Simpler Words Over Complex Terms:
Use use instead of utilize.
Use help instead of facilitate.
Use show instead of demonstrate.
Use start instead of initiate or commence.
Use pick or choose instead of opt for.
Sentence Structure: Write complete, natural sentences averaging 14 to 20 words. Avoid choppy one-line bullet fragments and artificial rhetorical questions.
Paragraph Density: Maximum 2 to 4 sentences (under 65 words) per paragraph for effortless scanning on desktop and mobile.
Minimize Em-Dashes: Minimize em-dashes (—). Replace them with colons, parentheses, commas, or separate sentences.
Technical Credibility Without Jargon: Technical does not mean complicated. Terms like DOM elements, API keys, console logs, staging environments, status codes, and canvas redaction are essential for authority, but explain their practical workflow impact in plain English.
Banish Marketing Fluff: Eliminate corporate buzzwords (seamlessly, revolutionize, game-changer, powerful solution, next-level, fast-paced world).
11. Word Count & Information Density
No Rigid Word Count: Articles should be exactly as long as necessary to teach the workflow clearly and completely.
Expected Natural Range: 1,400 to 1,900 words.
More Depth (1,700–1,900 words): Highly technical roles requiring detailed environment setup, console telemetry, or multi-step handoff protocols (QA, Tech Leads, Engineering Managers).
Less Depth (1,300–1,600 words): Streamlined operational processes (Scrum Master status updates, Employee tool onboarding).
Strict Anti-Padding Rule: Never add words, repetitive summaries, or generic advice to hit a word count. If a workflow is fully explained in 1,400 words, conclude the guide.
12. SEO Strategy
Primary Keyword Formula: how [profession] [solves problem] (e.g., how qa engineers write bug reports developers can reproduce).
Secondary Keyword Variations: Integrate natural workflow phrases (reproducible bug reports, qa bug ticket template, video bug reporting, dev handoff without meetings).
Heading Strategy: Headings must state operational outcomes rather than generic titles. (e.g., use ## Why "Cannot Reproduce" Happens, not ## The Problem).
Search Engine Optimization (GEO & AEO): Fast-scanning bullet lists, clearly labeled sections, and concise FAQ answers make content easily parsed and cited by search engines and AI answer models (ChatGPT, Perplexity, Claude).
13. FAQ System Specification
The FAQ section is the final substantive section of the article. No trailing summaries or sales paragraphs may appear below it.
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   FAQ Rules                                     │
├───────────────────┬─────────────────────────────────────────────────────────────┤
│ Minimum Count     │ Exactly 5 questions per article.                           │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ Placement         │ Strictly at the very end, following the Demoly workflow[cite: 2].   │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ Answer Length     │ 3 lines or fewer on desktop (≤45 words per answer)[cite: 2].        │
├───────────────────┼─────────────────────────────────────────────────────────────┤
│ Topic Focus       │ Edge cases, privacy, viewer accounts, and tool overlap[cite: 2, 4]. │
└───────────────────┴─────────────────────────────────────────────────────────────┘

Core FAQ Topics to Address
Text/Data Extraction: Can viewers copy code, logs, or text directly from recordings?
Silent Actions: Why do unvoiced, silent clicks matter, and how are they captured?
Viewer Friction: Do recipients need paid accounts, browser extensions, or logins to view?
Data Privacy: How are sensitive tokens, passwords, or customer PII redacted?
Tool Compatibility: Does this replace the team's primary tool (Jira, Linear, Webflow, Notion) or work alongside it?
14. Internal Linking Strategy
Every article must incorporate 2 to 3 contextual internal links:
To a Vertical 4 Pillar Guide: Link to the relevant use-case comparison (e.g., Best Tool for QA Bug Reproduction and Reporting).
To a Vertical 7 Architectural Deep-Dive: Link to the technical explainer (e.g., DOM Capture vs Pixel Capture: Why It Changes What a Video Can Answer).
To Product Pages: Natural domain links to demoly.dev in the practical workflow section and conclusion.
15. Anti-Patterns (What NOT to Do)
No Markdown Code Blocks: Do not put tickets, checklists, or steps in code blocks. Use plain lists and Visual References.
No Markdown Tables: Avoid multi-column comparison tables that break in simple web editors.
No Generic Career Advice: Do not write about "career growth," "building trust," or "becoming a better team member." Stick purely to operational mechanics.
No Early Product Pitches: Never mention Demoly in the introductory hook. Let the operational problem breathe.
No Vague Advice: Never write generic advice like "be thorough" or "communicate clearly." Provide concrete instructions and specific component names.
No Checkmark Listicles: Avoid superficial 15-item lists without technical depth or operational mechanisms.
No Em-Dash Overuse: Replace em-dashes with colons, parentheses, commas, or separate sentences[cite: 2].
16. Reusable Master Article Template
Markdown
# How [PROFESSION] [SOLVES WORKFLOW PROBLEM WITHOUT MEETING/COST]

[Paragraph 1: The acute operational failure mode. The specific point where handoffs, reviews, or communication break down between roles.]

[Paragraph 2: The real technical or business cost of this breakdown. Context-switching, lost sprint velocity, or unbilled support hours.]

The [WORKFLOW] Standard:
* [Core Rule 1]: [Brief explanation of pre-conditions or starting state].
* [Core Rule 2]: [Brief explanation of isolating minimal execution paths].
* [Core Rule 3]: [Brief explanation of specific element or asset anchoring].
* [Core Rule 4]: [Brief explanation of system telemetry or operational context].
* [Core Rule 5]: [Brief explanation of searchable, self-serve delivery].

[Visual Reference: Diagram contrasting a vague [TRADITIONAL DELIVERABLE] with an actionable, technical [MODERN DELIVERABLE] with pinned context and embedded walkthrough]

## Why [TRADITIONAL FAILURE MODE] Happens

When [COLLABORATOR ROLE] cannot complete [ACTION], the issue usually stems from three common gaps in the handoff:

* [Failure Mechanism 1]: [1-2 sentences diagnosing setup or environment blind spots].
* [Failure Mechanism 2]: [1-2 sentences diagnosing vague UI targets or missing specifications].
* [Failure Mechanism 3]: [1-2 sentences diagnosing unrecorded silent actions or micro-interactions].

## [N] Steps to [PRACTICAL OUTCOME]

Follow these practical steps to help [COLLABORATOR ROLE] execute on the first pass:

### 1. [Step 1 Name: Isolate / Reset]
[Concise paragraph explaining how to clear state and isolate the minimal path].

### 2. [Step 2 Name: Context & Silent Steps]
[Concise paragraph explaining how to document pre-conditions and actions performed silently].

### 3. [Step 3 Name: Precision UI / Target Anchoring]
[Concise paragraph detailing specific component names, selectors, or asset layers].

### 4. [Step 4 Name: Diagnostic Data & System State]
[Concise paragraph on capturing background logs, payloads, or environmental details].

### 5. [Step 5 Name: Separate Expected from Actual Results]
[Concise paragraph clarifying the exact deviation from acceptance criteria].

[Visual Reference: Flowchart of the [N]-step [PROFESSION] path: [Step 1] -> [Step 2] -> [Step 3] -> [Step 4] -> [Step 5]]

## What Makes an Effective [WORKFLOW ARTIFACT]

A clear [WORKFLOW ARTIFACT] removes guesswork by grouping technical context into predictable fields. When a handoff layout clearly separates starting state, execution actions, and telemetry, [RECIPIENT ROLE] can act immediately without scheduling clarification calls.

[Visual Reference: Example [PROFESSION] [ARTIFACT] showing clear title, expected vs. actual outcomes, minimal reproduction steps, environment details, and an attached interactive recording]

This layout works well because every section serves a dedicated purpose:

* [Section Anchor 1]: [1-2 sentences explaining why this element eliminates ambiguity].
* [Section Anchor 2]: [1-2 sentences explaining why this element eliminates ambiguity].
* [Section Anchor 3]: [1-2 sentences explaining why this element eliminates ambiguity].
* [Section Anchor 4]: [1-2 sentences explaining why this element eliminates ambiguity].
* [Section Anchor 5]: [1-2 sentences explaining why this element eliminates ambiguity].
* Visual Proof: An attached recording shows the entire sequence in real time, capturing timing and silent actions that text alone might skip.

## Comparing Documentation Formats

The format you use to share context affects how fast [COLLABORATOR ROLE] can complete the work:

* Text and Screenshots: Written reports are easy to read, but they take a long time to create and frequently leave out silent micro-interactions.
* Standard Video Recordings: Screen recorders like Loom make capture quick, but flat video files force recipients to scrub timelines, leave silent actions unindexed, and prevent text copying.
* Searchable Walkthroughs: Modern walkthrough tools like Demoly turn screen recordings into searchable guides by indexing spoken audio and on-screen clicks, allowing recipients to query actions directly.

[Visual Reference: Split-screen view showing [COLLABORATOR ROLE] searching a recording for "[SPECIFIC QUERY]" and the player jumping straight to that exact moment in the interface]

## Using Demoly for [PROFESSIONAL WORKFLOW]

You do not need to replace your current systems. [EXISTING TOOL 1] and [EXISTING TOOL 2] remain your home base, while Demoly provides the visual context attached to each task.

With the Demoly browser extension, [PROFESSION] can capture workflows across browser tabs without lag:

1. Record the Workflow: Record the action as it happens in your browser. Demoly records your screen while tracking clicks, page changes, and tab switches.
2. Tag Exact Elements: Instead of adding vague text callouts, attach notes directly to specific UI components and buttons in the recording.
3. Hide Sensitive Data: If your setup shows user details, private keys, or credentials, use canvas redaction to permanently remove that data before sharing.
4. Share the Link: Paste the recording link into your [PRIMARY TRACKER / HANDOFF PACKET]. The recipient opens it in any browser without needing to install extensions or create an account.

If your team only needs deep network logs, tools like Jam.dev also offer helpful capture options. For more details, explore our guide on the [Best Tool for RELEVANT USE CASE], or learn how browser capture works in [DOM Capture vs Pixel Capture: Why It Changes What a Video Can Answer].

## Frequently Asked Questions

### Can recipients copy text directly from a Demoly video?
Yes. Demoly lets viewers select and copy code, logs, and text straight from a paused video frame.

### Why do silent actions matter in [WORKFLOW]?
Practitioners often navigate, clear fields, or switch tabs without speaking aloud. Indexing silent clicks ensures these vital steps are not lost.

### Do recipients need an account to view a Demoly recording?
No. Links open in any standard browser without requiring sign-ups, seats, or extensions.

### How does Demoly keep [WORKFLOW DATA / CREDENTIALS] private?
Demoly provides permanent canvas redaction, allowing you to remove sensitive keys and data directly from the video before generating a share link.

### Does Demoly replace [EXISTING PRIMARY TOOL]?
No. Demoly provides the visual context and logs that you paste directly into your existing tickets or project tools.

17. Pre-Publication Quality Checklist
Before publishing any article in Vertical 3, verify that it passes every check:
[ ] Search Intent Match: Directly answers the practitioner's specific workflow problem from sentence 1.
[ ] Profession Authenticity: Uses authentic technical terminology (DOM, console traces, staging tokens, billable drift) without corporate buzzwords.
[ ] Zero Markdown Code Blocks: No ticket templates or code blocks are wrapped in triple backticks (```).
[ ] Zero Markdown Tables: Media comparisons and artifact breakdowns are formatted using plain lists or bullet anchors rather than pipe tables.
[ ] Visual Reference System: Contains at least 4 specific [Visual Reference: ...] tags placed contextually throughout the text.
[ ] Artifact Breakdown Section: Includes the dedicated What Makes an Effective [Workflow Artifact] section analyzing a realistic deliverable.
[ ] Media Evolution Covered: Objectively contrasts text vs. standard flat video vs. searchable walkthroughs.
[ ] Natural Demoly Positioning: Demoly is introduced in the media comparison section as a capture tool, not as an aggressive advertorial.
[ ] Plain Writing Standards: Uses simple words (use, help, show), keeps paragraphs under 65 words, and avoids unnecessary em-dashes (—).
[ ] FAQ Rules Followed: Exactly 5 questions appear as the final substantive section, with answers capped strictly at 3 lines on desktop (≤45 words).
[ ] Contextual Internal Links: Includes 2 to 3 natural links to a Vertical 4 pillar, a Vertical 7 technical deep-dive, and the demoly.dev domain.

