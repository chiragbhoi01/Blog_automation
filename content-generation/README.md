# Demoly Content Generation System — README

## What this is

A simple, Markdown-driven system for turning a blog title into a CMS-ready draft article, without auto-publishing anything. It exists because Demoly has a 120+ title backlog (see `tracking/PROGRESS.md`) and one fully-approved sample article ("Best Loom Alternatives for Tech Agencies") that defines the writing standard for the first vertical it covers.

This is **not** a content rules engine, not a microservice, not a new database. It is:

```
Markdown instructions + a small script + a model call + a CMS API call
```

Everything that decides *what a good article looks like* lives in Markdown files a human can read and edit. Code only handles running the process.

## The workflow

```
USER
  ↓
ANTIGRAVITY (orchestrates the run)
  ↓
GENERATION SCRIPT (loads the topic + master prompt)
  ↓
MASTER CONTENT PROMPT (prompts/content-generation-master.md)
  ↓
GEMINI / LLM (writes the article per the rules in the master prompt)
  ↓
QA VALIDATION (workflow/QA-CHECKLIST.md)
  ↓
DEMOLY CMS (creates a NEW DRAFT — never publishes, never overwrites)
  ↓
HUMAN REVIEW (a person reads it and decides)
  ↓
PUBLISH (manual, explicit, outside this system)
```

Human review is mandatory. Nothing in this system is allowed to set a post live.

## Who does what

- **You (the operator):** pick which topic(s) to run, review generated drafts, approve or reject.
- **Antigravity:** runs the generation script against one topic or a batch, per `workflow/ANTIGRAVITY-TASK.md`.
- **The generation script:** reads a topic from the topic list, combines it with `prompts/content-generation-master.md`, calls the model, validates the output, and pushes a draft to the CMS. `NEEDS CONFIRMATION`: the actual script does not exist yet — Phase 3 of `workflow/IMPLEMENTATION-PLAN.md` creates it.
- **Gemini (or whichever LLM is wired in):** writes the article text and structured metadata, following the master prompt exactly. It does not decide the rules — it follows them.
- **The Demoly CMS:** stores the result as a draft (`is_published: false`). `NEEDS CONFIRMATION`: the exact CMS API contract (endpoint, auth, request/response shape) was not included in the source material for this system and must be confirmed with Chirag before Phase 5 (`workflow/IMPLEMENTATION-PLAN.md`) begins.
- **You again, as reviewer:** the only person who can move a draft to published.

## Where things live

| What | Where |
|---|---|
| The rules for writing an article | `prompts/content-generation-master.md` |
| How Antigravity should run this | `workflow/ANTIGRAVITY-TASK.md` |
| The build order | `workflow/IMPLEMENTATION-PLAN.md` |
| The pre-publish checklist | `workflow/QA-CHECKLIST.md` |
| The 120-title backlog and its status | `tracking/PROGRESS.md` |
| Why specific rules were chosen when sources disagreed | `source-notes/SOURCE-MATERIAL-DECISIONS.md` |

## How one blog gets generated (once built)

1. Antigravity (or you, manually) picks one row from `tracking/PROGRESS.md` with status `PENDING`.
2. The script loads that title plus `prompts/content-generation-master.md`.
3. The model returns a structured output (see the Output Contract section of the master prompt).
4. The script runs the checks in `workflow/QA-CHECKLIST.md`. Anything that fails is logged, not silently passed.
5. On a pass (or `PASS_WITH_REVIEW`), the script creates a new draft in the CMS. It never edits or deletes an existing post.
6. The row in `tracking/PROGRESS.md` updates to `DRAFT_CREATED`.
7. A human opens the draft in the CMS and decides: approve, send back with notes, or reject.
8. Only a human publishes.

## How multiple blogs get generated

Same as above, run in a small batch (see the batch-size guidance in `workflow/IMPLEMENTATION-PLAN.md` — start at 1, then 3, then 10, never jump straight to the full backlog). Each topic runs independently: one failure does not stop the batch (see Failure Handling in `workflow/ANTIGRAVITY-TASK.md`).

## What this system will never do

- Auto-publish anything.
- Modify or delete an existing CMS post.
- Invent Demoly product facts, pricing, or URLs not already established in source material.
- Invent competitor facts not sourced or explicitly marked for verification.
- Skip human review.

## Current scope note

The only vertical with a fully derived, approved editorial blueprint right now is **Vertical 2 — Competitor: Alternatives** (the Gemini teardown of the approved "Best Loom Alternatives for Tech Agencies" sample). The master prompt is built around that blueprint in full detail, with a stub structure for the other six verticals from the 120-title master list. Those verticals need their own blueprint pass — see the "Other Verticals" section of `prompts/content-generation-master.md` and the open items in `source-notes/SOURCE-MATERIAL-DECISIONS.md`.
