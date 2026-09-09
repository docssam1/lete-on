# Boarding School Math continuation handoff

Updated: 2026-09-09 KST

This file is the short restart contract for the Boarding School Math product only. Do not mix it with `hsmiddle`, high-school selection, Geometry World, Number Magic, Fields Classic, or other repositories.

## Read first

1. The current machine storage notice and status files.
2. Repository `AGENTS.md` and `boarding-school-math/README.md`.
3. This handoff.
4. The current Git branch, working tree, `origin/main`, open pull requests, and deployment runs. Current state always outranks this dated note.

Never delete or move active sessions, source originals, Drive evidence, uncommitted work, or commits that are not on the remote. Do not spawn an agent with inherited long-chat history.

## Product direction

GFIELD Math is a student/teacher system that connects diagnosis, domain analysis, concept learning, clinic practice, printable unit workbooks, rechecks, and teacher-reviewed progression. It covers US school mathematics and keeps competition pathways such as SASMO, Math Kangaroo, AMC 8, AMC 10, and AMC 12 distinct from course placement. It must not present a school-specific progression rule as an official US national cut.

Public student practice may contain original GFIELD-authored content. Private diagnostics, answer keys, student records, source originals, and restricted contest assets must not be published from the static site.

## Current release state

- `6.NS.C`: merged to `main` in `18eabffade549c0b07721d3bbb82fa01968316ed`. Public student and teacher routes, mobile layout, A4/Letter PDFs, and completion-gated recheck were verified.
- `6.EE.A`: merged to `main` in `1c5f8c8e13a16f4d141f781c3dcc9e8b2541b67c` through pull request [#199](https://github.com/docssam1/lete-on/pull/199). The HTML generator, 390px mobile view, student Korean A4 print, teacher Simplified-Chinese Letter print, completion gate, and live routes were verified. Visible numeric fractions now render as accessible stacked MathML while slash-form response input remains accepted.
- `6.EE.B`: merged to `main` in `d05e61d84cd8e5fa260cbd83f058d5fc8f390c3d` through pull request [#200](https://github.com/docssam1/lete-on/pull/200). Pages deployment run `34358815421` succeeded. The live Korean student 390px route has 12 pages, 36 response controls, no teacher content, and no horizontal overflow; the live Simplified-Chinese teacher Letter route has 20 pages, 36 keys, no student controls, and eight solution rays. The old clinic key stays locked, while the unit key opens its eight-item recheck. Context variables remain identical across prompts and visual models, and every recheck page uses the recheck heading. Student Korean A4 (12 pages) and teacher Simplified-Chinese Letter (20 pages) browser-print exports were rendered and visually inspected with no overflow, clipping, or answer-boundary leak.
- `6.EE.C`: merged to `main` in `be0d4d46eec9bd6f0a23a98d61af0634aec1a908` through pull request [#206](https://github.com/docssam1/lete-on/pull/206). Pages deployment run `34364211182` succeeded. The live Korean student 390px route has 12 pages, 36 response controls, 12 calculated coordinate graphs, no teacher content, and no horizontal overflow; the live Simplified-Chinese teacher Letter route has 20 pages, 36 keys, no student controls, and 12 calculated graphs. The old clinic key stays locked, while the unit key opens its eight-item recheck with one graph. Student Korean A4 (12 pages) and teacher Simplified-Chinese Letter (20 pages) browser-print exports were rendered and visually inspected with no overflow, clipping, or answer-boundary leak.

## Verified `6.EE.A` contract

- 36 workbook items: 12 expression structure, 12 substitution/evaluation, 12 distribution/equivalence.
- 8 distinct recheck structures.
- Fixed 44-answer ledger plus independent calculation tests.
- Student: 12 pages, 36 response controls, no teacher answers.
- Teacher: 20 pages, 36 separate keys, no student controls.
- Korean, English, Simplified Chinese; A4 and US Letter; 390px mobile with no horizontal overflow.
- Completion key: `gfield-unit-workbook:6.EE.A:v1`.

## Verified `6.EE.B` contract

- 36 workbook items: 12 solution checks, 12 one-step equations, 12 inequalities.
- 8 distinct recheck structures.
- Fixed 44-answer ledger plus a separate BigInt rational recomputation.
- Student number lines show an open boundary but never the answer direction; teacher pages show the exact solution ray.
- Student: 12 pages, 36 response controls, no teacher answers or solution rays.
- Teacher: 20 pages, 36 separate keys, exact solution rays, no student controls.
- Korean, English, Simplified Chinese; A4 and US Letter; 390px mobile with no horizontal overflow.
- Completion key: `gfield-unit-workbook:6.EE.B:v1`; the old clinic key cannot unlock it.

## Verified `6.EE.C` contract

- 36 workbook items: 12 variable-and-rule items, 12 table items, 12 coordinate-graph items.
- 8 distinct recheck structures and a fixed 44-answer ledger plus independent BigInt rational calculation.
- Every graph uses declared rational point data and calculated coordinates; student graphs show given points and their relation line, never a target-answer point.
- Student: 12 pages, 36 response controls, no teacher answer or solution block.
- Teacher: 20 pages, 36 separate keys, no student controls.
- Korean, English, Simplified Chinese; A4 and US Letter; 390px mobile with no horizontal overflow.
- Completion key: `gfield-unit-workbook:6.EE.C:v1`; the old clinic key cannot unlock it.

## Tests and known blockers

- Focused `6.EE.C` code/browser checks passed: 4/4 content checks and 3/3 dedicated browser checks.
- Full Node suite after `6.EE.C`: 369 total, 360 passed, 9 failed. The full browser suite: 77 total, 76 passed, 1 failed.
- The 10 observed existing failures do not overlap this workbook: two stale Number Magic count assertions and eight private Grade 6 runtime/browser checks that require the absent private authoring directory.
- The public-exposure audit still reports the existing `hsmiddle/data.js` student-record bundle. This is outside the Boarding School Math change and must not be silently edited here.
- No GitHub checks are configured for pull requests #199 or #200; local evidence is therefore required.

## Exact next sequence

1. Check `git fetch origin`, current branch, clean state, and whether `main` advanced.
2. Treat `unit-workbook.html` plus its shared data and renderer as the product source. The student Korean A4 and teacher Simplified-Chinese Letter browser-print exports for `6.EE.B` and `6.EE.C` are QA artifacts, not separate authoring sources.
3. `6.EE.B` and `6.EE.C` are released. Preserve their proof rather than redoing it without a code change.
4. Upgrade `6.G.A` from the current 12-item clinic to the same 36-workbook-item plus 8-distinct-recheck contract. Use `SOL 울트라` for geometry authoring, source interpretation, point-and-segment modeling, single-answer visibility, and independent area/volume/coordinate calculation. Reuse the existing geometry renderer rather than drawing answer-bearing coordinates by eye. Then use `TERRA 높은` for integration, responsive/print QA, deployment, and live verification.

Do not call a unit complete merely because its code or pull request exists. Completion requires exact-answer verification, student/teacher separation, mobile and browser-print rendering, inspected print exports, merged remote SHA, successful deployment, and live URL checks. PDF files are QA exports from the same HTML generator, not a second authoring source or the primary product.
