# Implementation Plan — Demoly Content Generation System

First milestone, non-negotiable: **ONE TITLE → ONE ARTICLE → ONE CMS DRAFT.** No phase after Phase 4 begins until that milestone is proven.

---

## Phase 1 — Understand existing CMS and source material

**Objective:** confirm what actually exists before building anything against it.

**Files involved:** none created yet; this phase produces findings that update `source-notes/SOURCE-MATERIAL-DECISIONS.md`.

**Expected result:**
- Confirmed CMS API contract (endpoint, auth method, request/response shape for creating a draft post). `NEEDS CONFIRMATION` as of this document — not present in the source material provided to this system.
- Confirmed whether the CMS rich-text editor auto-converts Markdown tables, or requires structured/HTML table input (see Section 8 of the master prompt).
- Confirmed real Antigravity repo layout and command patterns (see `ANTIGRAVITY-TASK.md` placeholders).
- Confirmed the existing CMS field list (already known from prior project material: id, slug, title, excerpt, content, category, featured_image, author, is_published, published_at, created_at, updated_at, tags).

**Validation criteria:** every `NEEDS CONFIRMATION` tag in `ANTIGRAVITY-TASK.md` and Section 8/16 of the master prompt has been replaced with a confirmed answer, or explicitly deferred with a reason.

---

## Phase 2 — Create master prompt

**Objective:** finalize the reusable generation rules.

**Files involved:** `prompts/content-generation-master.md` (already drafted in this system as the Vertical 2 blueprint; other verticals remain open per Section 14).

**Expected result:** a master prompt that a human editor agrees matches the approved sample article's standard when tested against a fresh Vertical 2 title.

**Validation criteria:** a human (Mansi or delegate) reads the master prompt end to end and confirms it does not contradict the approved sample or the Gemini blueprint it was derived from.

---

## Phase 3 — Create minimal generation script

**Objective:** the smallest script that can load a topic + the master prompt, call the model, and return the structured output contract (Section 13 of the master prompt).

**Files involved:** the generation script itself (location `NEEDS CONFIRMATION`, see `ANTIGRAVITY-TASK.md`).

**Expected result:** running the script against one hardcoded test topic returns valid JSON matching the output contract, with `is_published: false`.

**Validation criteria:** output JSON parses cleanly; all required fields are present; no fabricated Demoly facts outside Section 2 of the master prompt appear in the content.

---

## Phase 4 — Test one blog

**Objective:** prove the full loop works for exactly one real topic from the backlog, without CMS integration yet.

**Files involved:** `tracking/PROGRESS.md` (mark the test topic), `workflow/QA-CHECKLIST.md` (run manually against the output).

**Expected result:** one complete article, structurally and stylistically matching the approved sample, reviewed by a human.

**Validation criteria:** the QA checklist passes (or the failures are understood and traced to a specific, fixable cause — prompt wording, missing input, etc.), and a human confirms the article reads like it belongs in the approved cluster.

---

## Phase 5 — Connect CMS draft creation

**Objective:** wire the script's output into the actual Demoly CMS as a new draft.

**Files involved:** CMS ingestion client (`NEEDS CONFIRMATION` — location depends on Phase 1 findings).

**Expected result:** the Phase 4 test article appears in the CMS as a draft, not published, without touching any existing post.

**Validation criteria:** the draft is visible in the CMS admin UI with `is_published: false`; no existing posts were modified; the draft's fields match what the generation script produced.

---

## Phase 6 — Test three blogs

**Objective:** confirm repeatability across a small batch and catch issues that only show up with variation (different competitor, different audience).

**Files involved:** `tracking/PROGRESS.md` (three topics), full pipeline.

**Expected result:** three drafts in the CMS, each reviewed by a human, with editing effort and any hallucinations logged.

**Validation criteria:** all three pass QA or have clearly diagnosed failures; no topic silently marked successful when it wasn't.

---

## Phase 7 — Batch generation

**Objective:** scale gradually.

**Files involved:** `tracking/PROGRESS.md` (growing batch sizes), all pipeline components.

**Expected result:** batches of 10, then larger, only once the 3-blog test in Phase 6 shows stable quality.

**Validation criteria:** per-batch review continues; quality does not degrade as volume increases; failures are still logged individually, never silently skipped.

---

## Explicit non-goal for this plan

Generating all 120 titles in one pass is not a goal of any phase above. Phase 7 begins scaling only after Phases 1–6 are each individually validated.
