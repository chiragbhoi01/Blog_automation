# Source Material Decisions

This file documents every place the provided source material was ambiguous, conflicting, or incomplete, and how this system resolved it. Per the build instructions: prefer the most recent/final/approved source when clearly established; document the decision; never invent a resolution when the source material is insufficient.

## Sources considered

1. **Doc 7** — "Demoly — Combined Content Strategy (Supademo Teardown) + 120-Blog Master List" — strategic plan, the 133-title backlog, publishing sequence.
2. **Doc 8** — Gemini "Alternatives Cluster Editorial Blueprint" — reverse-engineered from the **final revised, approved** sample article "Best Loom Alternatives for Tech Agencies." Explicitly instructed to take priority over any earlier draft or recommendation.
3. **Doc 9** — "Competitor Content & Blog Intelligence Report" — market research on Supademo, Arcade, Storylane, Walnut, Navattic's own content systems. General market observation, not a Demoly-approved standard.
4. **The approved sample article itself** — "Best Loom Alternatives for Tech Agencies," as pasted into conversation and confirmed as the final revised version.

## Conflict 1 — Target word count for Alternatives articles

- Doc 9 (market research) observed 2,200–3,500 words for comparison/alternative articles **across other companies' blogs generally**.
- Doc 8 (derived from Demoly's own approved sample) sets 2,400–2,600 words specifically for Demoly's Alternatives cluster.
- **Resolution:** used 2,400–2,600 (Doc 8). Doc 8 is explicitly instructed to be the source of truth, derived directly from Demoly's own approved, final-revised sample — not a market average. Doc 9's range is retained in this file only as context for why the plan (Doc 7) originally cited a broader range; it does not override Doc 8.
- **Where documented:** `prompts/content-generation-master.md`, Section 6.

## Conflict 2 — Article structure hierarchy

- Doc 7 (initial strategy doc, Part 2 intro) sketches a general structure loosely.
- Doc 8 reverse-engineers the **exact** structure from the approved final sample, including section-by-section word targets and mandatory/adaptable status.
- **Resolution:** Doc 8's structure used exactly. Doc 7's general sketch is superseded — it was written before the sample was finalized and approved.
- **Where documented:** `prompts/content-generation-master.md`, Section 3.

## Conflict 3 — Comparison table format for CMS ingestion

- No source material confirms whether the Demoly CMS's rich-text editor (previously described elsewhere in this project as TipTap-based) auto-converts a pasted Markdown table into a native editable table, or requires structured/HTML input.
- Prior conversation in this project surfaced that a user pasting a Markdown table into the actual CMS reported difficulty inserting it directly, which is evidence (not confirmation) that plain Markdown-table paste may not reliably convert in that editor.
- **Resolution:** not invented. The master prompt requires the generation script to produce the comparison data in two forms (Markdown table + per-tool bulleted list) so the system is not blocked on this unresolved question, and flags the underlying CMS behavior as `NEEDS CONFIRMATION` for Phase 1 of the implementation plan.
- **Where documented:** `prompts/content-generation-master.md`, Section 8; `workflow/IMPLEMENTATION-PLAN.md`, Phase 1.

## Conflict 4 — Which verticals have an approved writing blueprint

- Doc 7 defines seven content verticals plus a recurring monthly slot (133 titles total).
- Doc 8 only reverse-engineers **one** vertical (Competitor: Alternatives), because only one sample article was approved and provided for that purpose.
- **Resolution:** the master prompt is built in full detail only for Vertical 2. The other six verticals are named and tracked (see `tracking/PROGRESS.md`) but marked `Blueprint: PENDING` — no attempt was made to invent a structure for them by extrapolating from Vertical 2's rules, since the build instructions explicitly prohibit inventing rules not supported by source material.
- **Where documented:** `prompts/content-generation-master.md`, Section 14; `tracking/PROGRESS.md` (Blueprint column).

## Gap 1 — Demoly CMS API contract

- No source material in this system includes the actual CMS API (endpoint, authentication, request/response schema for creating a draft post).
- Earlier project material describes the CMS's **field list** (id, slug, title, excerpt, content, category, featured_image, author, is_published, published_at, created_at, updated_at, tags) and its general **architecture** (Next.js App Router, TypeScript, PostgreSQL/Supabase, TipTap editor, draft/published lifecycle) — but not the API itself.
- **Resolution:** field list used as known/confirmed. API contract marked `NEEDS CONFIRMATION`, required before Phase 5 (CMS ingestion) of the implementation plan.
- **Where documented:** `README.md`; `workflow/IMPLEMENTATION-PLAN.md`, Phases 1 and 5.

## Gap 2 — Antigravity repository structure and commands

- No source material describes the actual Antigravity project layout, script names, or CLI invocation patterns.
- **Resolution:** `workflow/ANTIGRAVITY-TASK.md` uses clearly labeled placeholder paths and commands, explicitly marked `NEEDS CONFIRMATION`, rather than presenting invented commands as if they were real.
- **Where documented:** `workflow/ANTIGRAVITY-TASK.md`, throughout.

## Gap 3 — Publish authority and CMS draft-uniqueness checks

- No source material names who holds final publish approval, or confirms whether the CMS enforces slug uniqueness automatically or requires the generation script to check first.
- **Resolution:** left as `NEEDS CONFIRMATION` in `workflow/QA-CHECKLIST.md` (CMS Readiness section) and treated in `README.md` as a manual human step outside this system's scope regardless of who specifically holds that authority.

## Item not treated as a conflict — quantified claims in the title backlog

- Title `V6-04`, "How to Cut Post-Launch Client Support Calls by 70%," bakes a specific statistic into the title itself. No source material supports a 70% figure as a verified Demoly outcome.
- **Resolution:** not a source conflict, but flagged in `tracking/PROGRESS.md` notes for this title — the figure must be sourced or the title reframed before this article is generated, per the master prompt's rule against fabricated statistics (Section 7).
