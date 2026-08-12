# CARS Analysis Report Architecture

Use this reference when modifying data contracts, scoring, placement, strategy aggregation, recommendations, or section composition.

## Source Of Truth

Apply this precedence when documents disagree:

1. Verified runtime behavior and current product requirements
2. `reading-world/print.html`
3. `reading-world/data/cars-report-guide.js`
4. This skill
5. Legacy summaries in `CLAUDE.md` and `reading-world/print-redesign-plan.md`

Do not silently preserve an old rule merely because it appears in a historical document. Confirm intentional changes with tests and update all durable references.

## Runtime Files

| File | Ownership |
|---|---|
| `reading-world/print.html` | Answer UI, scoring, analysis, report DOM, controls, highlighting, pagination, print CSS |
| `reading-world/data/diagnostic.js` | Diagnostic levels, questions, answers, and level metadata |
| `reading-world/data/cars-report-guide.js` | Strategy prescriptions, comparable books, and evidence citations |
| `reading-world/data/lesson*.js` | CARS B created lesson and practice-question data |
| `reading-world/data/lc*.js` | CARS C created lesson and practice-question data |
| `reading-world/data/cd*.js` | CARS D created lesson and practice-question data |

Licensed originals remain outside public report guidance.

## Input State

`grade` owns:

- `name`, `date`, and optional `memo`
- `src`: `level` or `unit`
- `levels`: selected diagnostic level IDs
- `unit`: selected CARS unit value
- `ans`: answers keyed by source, then zero-based question index

Normalize `grade.levels` through `DIAG_ORDER`. Deduplicate before rendering or analysis.

Keep report language in `RLANG`; keep worksheet language in `LANG`. They are intentionally independent.

## Placement Rules

Current thresholds:

| Question count | Move down | Stay | Move up |
|---|---:|---:|---:|
| 12 | below 6 | 6-10 | 11-12 |
| 8 | below 5 | 5-6 | 7-8 |
| 6 | below 3 | 3-5 | 6 |

At the ends of the ladder, hold the existing level and mark the result as capped.

For a multi-level diagnostic, use the existing `runVerdict()` aggregation. Show every source score so the combined recommendation remains auditable.

For a unit report, use mastery bands:

- 90% or above: mastered
- 70-89%: achieved
- 50-69%: needs work
- below 50%: reteach

Never convert a unit mastery result into a placement change.

## Strategy Model

Fold only known wording variants:

- `Recognising Cause and Effect` -> `Recognizing Cause and Effect`
- `Identifying Author's Purpose` -> `Understanding Author's Purpose`

Keep the canonical instructional priority order in `STRAT_RANK`. B/C and D can use different labels at the same positional strategy, while D uses `Summarising` where earlier books may use `Distinguishing Between Real and Make-believe`.

`analyse()` must retain:

- total correct and measured items
- per-source correct count and percentage
- per-strategy correct count, measured count, percentage, and source breakdown

Do not infer a weakness from a strategy that was not measured.

## Recommendation Model

`remedyPlan()` currently:

1. Requires every selected answer.
2. Sorts strategies below 70% by accuracy and foundational rank.
3. Selects up to two priority skills.
4. Maps recommended levels B/C/D to books `b/c/d`.
5. Samples first, middle, and final lessons.
6. Selects each skill's matching positional question from `extraLearning`.

`applyRemedyWorksheet()` changes the print selection to:

- unit scope
- sampled lessons only
- extra-learning passages only
- selected strategy positions only

Keep the report's listed questions and the generated worksheet selection derived from the same plan object.

## Report Composition

`REPORT_SECTIONS` contains eight independent sections:

| Key | Output |
|---|---|
| `summary` | Score, verdict, recommendation, optional teacher comment |
| `skills` | Skill mix, optional level bars, strategy accuracy |
| `detail` | Automatic pattern comment, strategy prescriptions, priorities, strengths |
| `questions` | Level- and strategy-matched practice references |
| `roadmap` | Level-up distance, schedule, four-week plan, home activities |
| `books` | Comparable-difficulty counselling candidates |
| `answers` | Item-level key, student answer, mark, and strategy |
| `evidence` | Linked methodological and research sources |

Disabled sections must not be appended to the report DOM. This ensures pagination and PDF page counts match the teacher's choices.

## Content Boundaries

Write automatic comments as evidence-aware hypotheses:

- Say “may be confusing” rather than asserting a cognitive deficit.
- Separate observed performance from instructional interpretation.
- State when incomplete answers make the report provisional.
- State that one selected-response administration needs observation or retest.
- Avoid medical, psychological, or special-education diagnoses.

Store strategy-specific error patterns, routines, prompts, and criteria under `CARS_REPORT_GUIDE.rx`. Store book candidates under `books` and citations under `sources`.
