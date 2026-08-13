---
name: cars-analysis-report
description: Implement, revise, audit, or verify the CARS B/C/D grading and counselling analysis report in reading-world/print.html. Use for answer-entry ordering and selection states, placement or unit scoring, strategy weakness analysis, detailed automatic comments, remediation questions and worksheet selection, four-week roadmaps, comparable-book recommendations, removable counselling sections, report highlighting, bilingual output, pagination, print/PDF, or mobile report QA.
---

# CARS Analysis Report

Treat the analysis report as an instructional decision tool, not a decorative score summary. Keep every claim traceable to entered answers, CARS strategy data, an explicit rule, or a cited source.

## Start Here

1. Read the affected report code in `reading-world/print.html` before changing it.
2. Read `reading-world/data/cars-report-guide.js` when changing comments, prescriptions, books, or evidence.
3. Read [references/architecture.md](references/architecture.md) before changing scoring, strategy mapping, recommendation logic, or report sections.
4. Read [references/qa.md](references/qa.md) before changing UI, pagination, highlighting, or print output.
5. Inspect the current branch, open PRs, and uncommitted changes before editing `print.html`; this file is a shared hotspot.

## Preserve Scope

- Apply this skill only to the CARS diagnostic and CARS B/C/D unit reports.
- Do not alter Reading Prime, WonderSkills, Bricks, Fields Classic, or their report rules unless the user explicitly expands the scope.
- Keep licensed passages and questions in their existing private/Supabase boundary. Do not copy them into public skill files.
- Keep `cars-report-guide.js` separate from course data. It contains report guidance, not lesson content.
- Reuse the existing plain HTML/CSS/SVG report engine. Do not replace it with screenshots or scanned report pages.

## Work Through the Data Flow

Follow the existing pipeline instead of creating a parallel report engine:

1. `gradeSources()` selects one unit or canonicalized diagnostic levels.
2. `analyse()` folds strategy aliases and computes per-source and per-strategy results.
3. `remedyPlan()` derives priority skills, recommended level, practice lessons, and printable items.
4. `reportSheet()` composes enabled report sections.
5. `paginate()` splits semantic units into A4 sheets.

Extend the narrowest existing stage that owns the requested behavior. Keep scoring, recommendation, rendering, and pagination responsibilities separate.

## Enforce Report Invariants

- Sort selected levels by `P, AA, A, B, C, D, E, F, G, H`, regardless of click order.
- Keep each level heading and its answers inside one `.grade-src` container.
- Show the selected state immediately with color and `checked` state.
- Treat incomplete answers as provisional. State the entered count and disable automatic worksheet selection.
- Keep placement tests and unit tests distinct. A unit report measures mastery and never changes placement.
- Fold known spelling aliases before aggregation. Do not merge genuinely different skills such as `Summarising` and `Distinguishing Between Real and Make-believe`.
- Define weakness as below 70% and strength as at least 80% unless the product rule is intentionally revised everywhere.
- Sort weakness rows from lowest accuracy upward; break priority ties with the foundational strategy order.
- Keep the report language independent from worksheet language.
- Omit an empty teacher comment rather than printing a blank panel.
- Remove disabled counselling sections from preview and print DOM, not only with CSS.
- Require complete answers before producing remediation questions or changing worksheet selections.
- Explain the exact recommended level, lessons, and strategies before the automatic-selection button is used.

## Write Professional Analysis

For each reported weakness, include four distinct parts when evidence exists:

1. **Observed result:** correct count, measured count, accuracy, and where the misses occurred.
2. **Likely error pattern:** a cautious interpretation, never a diagnosis stated as fact.
3. **Teaching routine:** a concrete teacher action tied to that strategy.
4. **Success criterion:** an observable reassessment threshold.

Add a teacher prompt when it improves instructional use. Prefer specific language such as “mark the sentence that proves the answer” over generic advice such as “practice more.”

When answers span multiple levels, describe cross-level stability and call out a large performance gap. When only one short test exists, label confidence as moderate and require confirmation through observation or retest.

## Build Recommendations Carefully

- Derive practice questions from the recommended CARS B/C/D book, selected weak strategy positions, and existing `extraLearning` data.
- Preserve original strategy and question positions so the report and generated worksheet point to the same items.
- Use the existing first/middle/last lesson spread unless a new documented sampling rule replaces it.
- Include no recommendation when answers are incomplete, no skill is below 70%, or the recommended level is outside B/C/D.
- Keep comparable books in `cars-report-guide.js`; pair each title with its role and use case.
- Treat comparable books as counselling candidates, not automatic placement decisions.
- Do not invent Lexile, AR, CEFR, grade equivalence, or research claims. Add or revise a claim only with a direct source and a restrained note.

## Preserve Counselling Controls

Maintain the independent switches for:

- score and overall verdict
- strategy charts
- detailed automatic comments
- recommended questions
- teaching roadmap
- comparable books
- item-level answer table
- evidence base

Keep the optional weakness prescription separate from those section switches. Persist choices through the existing `gfPrint.reportSections` storage contract.

## Preserve Highlighting

- Apply highlight, star, and underline only after grading text is final.
- Anchor marks by text with offsets as a fast path; report pagination may move blocks.
- Assign each text node to its closest markable block to prevent duplicate nested marks.
- Do not add text nodes for decoration; use CSS pseudo-elements for stars.
- Keep click-to-remove and range erasing behavior.
- Verify color in print and legibility in grayscale.

## Verify Before Reporting Completion

Run the matrix in [references/qa.md](references/qa.md). At minimum, verify:

- reverse-order level selection normalizes correctly
- selected answer buttons and grouped input blocks remain correct
- incomplete, all-strong, weak, tied, multi-level, and unit-report states
- all eight report-section switches affect preview and print
- Korean and English report output
- automatic worksheet selection and its disabled states
- desktop preview, 390px mobile controls, Chromium A4 PDF, and rendered PDF pages
- no clipped text, footer overlap, blank continuation, horizontal overflow, or lost highlighting

Do not claim success from DOM counts alone. Inspect representative screenshots and rendered PDF pages.

## Keep Documentation Synchronized

When changing a durable rule:

1. Update runtime code and tests first.
2. Update `cars-report-guide.js` for copy, books, or evidence changes.
3. Update this skill and its reference only when the reusable rule changed.
4. Keep `PLAYBOOK.md` as the repository-wide summary and link back here instead of duplicating this specification.
