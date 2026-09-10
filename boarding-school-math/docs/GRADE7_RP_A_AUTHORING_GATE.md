# Grade 7 `7.RP.A` authoring gate

Status: **published** — merged to `main` in `854c5c7907e013c3509ab8456aa4bce2b161eaea` through pull request #215; Pages deployment `34379456747` and live student/teacher read-back passed.

This is the first proposed Grade 7 unit because the existing curriculum map places `7.RP.A` first in Grade 7. That sequence is a GFIELD instructional decision, not an official promotion rule.

## Source boundary

- Authority: Common Core State Standards for Mathematics, Grade 7, Ratios and Proportional Relationships, page 48 of the official PDF.
- Canonical source: <https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf>
- Scope to preserve before authoring:
  - `7.RP.1`: unit rates involving fractional ratios, with units made explicit.
  - `7.RP.2a–d`: decide whether a relationship is proportional; find its constant of proportionality in multiple representations; write an equation; explain graph points in their context, including the origin and unit-rate point.
  - `7.RP.3`: multistep ratio and percent contexts.

The source defines learning expectations, not the GFIELD pacing, diagnosis threshold, intervention method, or promotion decision. A completed workbook must therefore never be labelled as an official Grade 7 placement or advancement result.

## Required evidence contract before any item is written

| Strand | Standard boundary | What an item must preserve | Required independent check |
| --- | --- | --- | --- |
| Fractional unit rate | `7.RP.1` | numerator quantity, denominator quantity, units, and the intended “per” relationship | exact rational calculation plus dimensional-unit check |
| Recognize proportionality | `7.RP.2a` | table or graph evidence sufficient to distinguish a constant ratio from a non-proportional pattern | compare every declared pair and, for a graph, verify line-through-origin data |
| Constant of proportionality | `7.RP.2b` | the same constant across the stated representation and context | recompute from a separate representation or inverse operation |
| Equation and graph meaning | `7.RP.2c–d` | variable meanings, units, origin, unit-rate point, and ordered-pair interpretation | substitute all generated points into the equation; calculate SVG from point data, never hand-place coordinates |
| Multistep ratio or percent | `7.RP.3` | order of changes, base quantity, percent meaning, and final unit | independent rational/decimal calculation and reverse check where applicable |

## Verified workbook shape — authored and independently checked with `SOL 울트라`

This is a local authoring record, not a placement, promotion, or contest-readiness promise:

- 36 original GFIELD-authored workbook items: 8 fractional unit-rate, 12 proportionality-and-constant, 8 equation/graph meaning, 8 multistep ratio-or-percent items.
- 8 recheck items with structures distinct from the 36 workbook items.
- Student edition: prompts, calculated visual models where needed, answer response, hint only after an incorrect attempt; no answer values, solution rays, or teacher commentary.
- Teacher edition: separate answer key, method, misconception cue, and an observation prompt for explanation/model choice not safely captured by exact answer scoring.
- Languages: Korean, English, Simplified Chinese must be authored from a shared mathematical meaning record; do not translate a finished Korean sentence mechanically.
- Delivery: one HTML generator with A4 and Letter print modes. Print export is QA evidence, not a separate source product.

## Release gate

Do not mark `7.RP.A` published until every condition below is true:

1. Each item has a stable ID, standard tag, source-boundary note, original-content declaration, answer cardinality, and solved-answer ledger.
2. A different calculation path verifies every generated answer; values that are ambiguous, context-dependent, or not independently solved remain locked.
3. Any coordinate visual is generated from declared point/segment data via the shared renderer; axes, origin, units, and labels are inspected at desktop, 390px, and print sizes.
4. Student and teacher DOM checks demonstrate that answers and teaching commentary never appear in student mode.
5. Recheck access uses a new Grade 7-specific completion key and cannot be opened by a Grade 6 key or a query-string injection.
6. Focused content, route, browser, mobile, A4, Letter, deployment, and live URL checks are all recorded before public status changes.

## Explicit non-goals for the first release

- No claim of SASMO, Math Kangaroo, AMC, school placement, or promotion prediction from this workbook.
- No third-party contest problem or source scan is copied into the public workbook.
- No automated judgment of written explanation, units reasoning, or representation choice without a teacher review path.
