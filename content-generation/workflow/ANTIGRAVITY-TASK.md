# Antigravity Task Definition — Demoly Content Generation

`NEEDS CONFIRMATION`: this file describes the intended operating pattern based on the system design, not on an inspected repository. The actual repo layout, script names, and CLI commands must be confirmed against the real project before these instructions are treated as executable. Placeholder paths below are marked clearly.

## 1. Where things are

| Item | Path |
|---|---|
| Master content-generation prompt | `content-generation/prompts/content-generation-master.md` |
| Blog topic backlog + status | `content-generation/tracking/PROGRESS.md` |
| QA checklist | `content-generation/workflow/QA-CHECKLIST.md` |
| Generation script | `NEEDS CONFIRMATION` — does not exist yet; created in Phase 3 of `IMPLEMENTATION-PLAN.md`. Assume `scripts/generate_blog.py` (or `.ts`) as a placeholder name until the real repo structure is confirmed. |
| CMS ingestion client | `NEEDS CONFIRMATION` — depends on the existing Demoly CMS API, not yet documented in this system's source material. |

## 2. Which script to run

`NEEDS CONFIRMATION` — placeholder pattern, to be replaced once the real script exists:

```bash
# Generate one article
python scripts/generate_blog.py --topic-id <ID>

# Generate a specific batch by size
python scripts/generate_blog.py --batch 3

# Resume only topics marked FAILED or PENDING
python scripts/generate_blog.py --resume
```

## 3. How to run one blog

1. Open `content-generation/tracking/PROGRESS.md`.
2. Pick a row with status `PENDING` and a `vertical` of `Competitor: Alternatives` (the only vertical with an approved blueprint right now — see Section 14 of the master prompt).
3. Run the generation script against that topic's ID.
4. The script must: load the topic → load `prompts/content-generation-master.md` → call the model → run `workflow/QA-CHECKLIST.md` checks → on pass, create a CMS draft → update the topic's row in `PROGRESS.md`.
5. Do not proceed to CMS ingestion if QA status is `BLOCKED`. Log it and stop for that topic only.

## 4. How to run multiple blogs

Same as above, looped over a batch. Batch sizes should follow the testing progression in `IMPLEMENTATION-PLAN.md`: 1 → 3 → 10 → larger, only after the prior batch's quality has been manually reviewed. Do not jump straight to the full 120-title backlog.

## 5. How to resume failed jobs

- A failed topic is marked `FAILED` in `PROGRESS.md` with a reason in the `notes` column (see Section 8, Failure Handling).
- Resuming a failed job re-runs generation from the stage that failed, not from scratch, where the script's internal state allows it. `NEEDS CONFIRMATION`: whether the eventual script implementation supports stage-level resume or only full re-generation — this depends on implementation choices made in Phase 3.
- If only full re-generation is supported initially, that is acceptable for the first implementation, but should be logged as a known limitation, not silently treated as equivalent to stage-level resume.

## 6. How to track progress

`content-generation/tracking/PROGRESS.md` is the single source of truth for status. Update it after every run — success or failure — never leave a topic's status stale.

## 7. How to stop on critical errors

Stop the entire batch (not just the current topic) if:
- The CMS ingestion endpoint is unreachable or returns an auth error (this affects every remaining topic in the batch, not just one).
- The model API is unreachable or returns a billing/quota error.
- `prompts/content-generation-master.md` fails to load (a missing or corrupted master prompt means nothing downstream can be trusted).

Do **not** stop the batch for:
- One topic's content failing QA (log it, mark it `NEEDS_REVIEW` or `BLOCKED`, move to the next topic).
- One topic having incomplete input data (mark it `NEEDS_INPUT`, move to the next topic).

## 8. How to continue when one article fails

Each topic in a batch runs independently. A single topic's failure updates only that topic's row in `PROGRESS.md` and does not block the rest of the batch, per Section 7 above.

## 9. How to ensure no article is automatically published

- The output contract (Section 13 of the master prompt) requires `is_published: false` on every model output. The script must never override this value to `true` under any code path.
- CMS ingestion (Phase 5 of `IMPLEMENTATION-PLAN.md`) must call whatever CMS API creates a **draft**, never the publish action. `NEEDS CONFIRMATION`: confirm the CMS API actually separates "create draft" from "publish" as distinct actions before wiring this up — this was stated as the CMS's intended draft/published lifecycle in earlier project material but the exact API has not been documented for this system.
- Publishing remains a manual action taken by a human directly in the CMS UI, entirely outside this system's scope.

## 10. Safety constraints (repeat of CMS safety rules — non-negotiable)

- Additive only. Never DELETE, UPDATE, DROP, TRUNCATE, or RESET anything in the CMS.
- Never overwrite an existing post.
- Every generated article becomes a **new** draft record.
