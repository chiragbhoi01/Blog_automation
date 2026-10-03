# Antigravity Agent Guidelines & Workflow Rules

This document defines the standard execution rules, file paths, visual reference image protocol, and visual decision system for Antigravity when reading, generating, and managing blog posts in this repository.

---

## 1. Core Workflow & File Reference Checklist

Whenever Antigravity is asked to generate a new blog post or work on content creation, **always check these files in order**:

1. **Progress Tracker**: [`PROGRESS.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/PROGRESS.md)
   - Identifies which vertical and title to work on (e.g., `V1-01`, `V2-01`, `V7-01`, etc.) and tracks status (`PENDING`, `DRAFT_CREATED`, `APPROVED_SAMPLE`).
2. **Master Prompt & Blueprint**: [`content-generation/prompts/content-generation-master.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/content-generation/prompts/content-generation-master.md)
   - Contains structural rules, word counts, formatting guidelines, Section 5.5 Visual Prompts, and Section 13.5 Metadata specifications.
3. **Vertical Blueprints**: Located in `verticals/`:
   - Vertical 1: [`verticals/vertical_1.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/verticals/vertical_1.md) (How-To / Feature Spotlights)
   - Vertical 2: [`verticals/vertical_2.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/verticals/vertical_2.md) (Competitor: Alternatives)
   - Vertical 2B: [`verticals/vertical_2B.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/verticals/vertical_2B.md) (Competitor: Pricing)
   - Vertical 2C: [`verticals/vertical_2C.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/verticals/vertical_2C.md) (Competitor: 1-on-1 vs / Three-Way)
   - Vertical 3: [`verticals/vertical_3.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/verticals/vertical_3.md) (Profession-Specific)
   - Vertical 4: [`verticals/vertical_4.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/verticals/vertical_4.md) (Use-Case / Best Tool For)
   - Vertical 5: [`verticals/vertical_5.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/verticals/vertical_5.md) (Industry-Specific)
   - Vertical 6: [`verticals/vertical_6.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/verticals/vertical_6.md) (Playbooks & Frameworks)
   - Vertical 7: [`verticals/vertical_7.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/verticals/vertical_7.md) (Technical Deep-Dives & Product Updates)
4. **Demoly Knowledge Base**: [`DEMOLY-KNOWLEDGE-BASE.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/DEMOLY-KNOWLEDGE-BASE.md)
   - Authoritative source for Demoly product features, comparison matrices, security claims, and technical terminology.

---

## 2. Image Generation & Vertical Reference Image Strategy

### 2.1 Vertical Reference Image Mapping:
For each vertical in this project, a **master benchmark reference image** is stored in `verticals/vertical_images/`:

- **Vertical 1**: `verticals/vertical_images/vertical_1.png`
- **Vertical 2**: `verticals/vertical_images/vertical_2.png`
- **Vertical 2B**: `verticals/vertical_images/vertical_2B.png`
- **Vertical 2C**: `verticals/vertical_images/vertical_2C.png`
- **Vertical 3**: `verticals/vertical_images/vertical_3.png`
- **Vertical 4**: `verticals/vertical_images/vertical_4.png`
- **Vertical 5**: `verticals/vertical_images/vertical_5.png`
- **Vertical 6**: `verticals/vertical_images/vertical_6.png`
- **Vertical 7**: `verticals/vertical_images/vertical_7.png`

### 2.2 Style Reference vs. Brand/Fact Reference:
- **STYLE REFERENCE**: The vertical reference image dictates composition, visual hierarchy, color palette (`#FF5722` orange accent, `#111827` dark charcoal text, warm off-white background), typography, UI treatment, and annotation style. Do NOT copy the artwork literally; recreate the design system for the specific topic.
- **BRAND / FACT REFERENCE**: Demoly website (`https://www.demoly.dev/`), logo (`content-generation/drafts/assets/demoly_logo.png`), and official product screenshots. Do NOT fabricate exact Demoly UI features, buttons, or non-existent settings.

---

## 3. Required Visual Decision System (11 Steps)

For every generated blog post, Antigravity must execute the following decision logic:

1. **STEP 1**: Identify the article vertical (from `PROGRESS.md`).
2. **STEP 2**: Read that vertical's blueprint (e.g., `verticals/vertical_2.md`).
3. **STEP 3**: Load the corresponding vertical reference image (from `verticals/vertical_images/`).
4. **STEP 4**: Read the article topic and sample content.
5. **STEP 5**: Determine the primary visual concept (e.g., comparison matrix, workflow diagram, technical architecture).
6. **STEP 6**: Check if an approved article image already exists in `content-generation/drafts/assets/`. If YES, reuse it. Do NOT overwrite.
7. **STEP 7**: Determine if the visual requires an **exact real product UI** (e.g., exact Demoly player controls, redaction workflow, API settings).
   - If **YES**: Do NOT fabricate with AI. Generate an **Admin Screenshot Request** (see Section 4).
   - If **NO**: AI visual generation / prompt specification is allowed.
8. **STEP 8**: Apply the vertical reference image as **STYLE REFERENCE**.
9. **STEP 9**: Apply Demoly website/logo as **BRAND/FACTUAL REFERENCE**.
10. **STEP 10**: Run Visual QA (check against `workflow/QA-CHECKLIST.md`).
11. **STEP 11**: Save/link asset using standard project naming convention (`assets/<slug>-cover.png` or `assets/<slug>-visual-01.png`).

---

## 4. Admin Screenshot Request System

When an article visual requires an exact real product UI feature and no approved screenshot exists, output a structured request block:

```markdown
> 📸 **ADMIN SCREENSHOT REQUEST:**
> - **ARTICLE:** [Article Title]
> - **VERTICAL:** [Vertical Name]
> - **WHY SCREENSHOT IS REQUIRED:** [Specific reason why real UI is necessary vs AI visual]
> - **PAGE / URL:** [e.g., https://app.demoly.dev/settings/integrations]
> - **ACTIONS:** [Exact click path / steps to reach state]
> - **CAPTURE:** [Exact UI state to capture]
> - **MUST SHOW:** [List key elements, e.g., Slack integration toggle, API token field]
> - **MUST HIDE:** Passwords, API keys, customer emails, production credentials, payment details.
> - **RECOMMENDED CROP:** [16:9 crop, focusing on target workspace drawer]
> - **SAVE AS:** `content-generation/drafts/assets/[article-slug]-screenshot-01.png`
```

---

## 5. Visual Style Guidelines

All generated visual prompts and graphics must follow these aesthetics:
- **Clean & Editorial**: B2B SaaS aesthetic, spacious, minimal clutter.
- **Color Tokens**: Primary Demoly Orange (`#FF5722`), Dark Charcoal (`#111827`), Warm off-white background (`#FBFBFB`).
- **Typography & UI**: Crisp Inter font, macOS window dots, minimal handwritten accent callouts (`Caveat` font).
- **Prohibited**: Excessive 3D graphics, heavy glowing glassmorphism, floating random objects, stock photos of people, generic robots, futuristic AI tropes, or overcrowded text paragraphs.
- **Aspect Ratio**: Standard 16:9 (`1200x630` px or `1200x675` px).

---

## 6. Step-by-Step Execution Plan for Blog Creation

When asked to create or process a blog post:

1. **Select Title**: Read [`PROGRESS.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/PROGRESS.md) to pick the next `PENDING` title for the specified vertical.
2. **Review Vertical Reference Assets**: Locate `vertical_<N>.png` in `verticals/vertical_images/`.
3. **Execute Visual Decision System**: Determine whether to output AI visual prompts or Admin Screenshot Requests.
4. **Generate Article Draft**:
   - Follow all structural sections from `content-generation-master.md`.
   - Include formatted Section 5.5 visual callouts referencing the vertical image style.
5. **Save Draft**: Save markdown draft to `content-generation/drafts/<slug>.md`.
6. **Update Progress**: Update status in [`PROGRESS.md`](file:///c:/Users/Chirag%20Bhoi/Desktop/blog_automation/PROGRESS.md) to `DRAFT_CREATED`.
