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
- `6.EE.B`: commit `7f850f13` on `codex/boarding-grade6-eeb-unit-workbook-20260909`; pull request [#200](https://github.com/docssam1/lete-on/pull/200). It has been rebased directly onto the merged `6.EE.A` main state. Code, answer, student/teacher separation, desktop screen, and 390px mobile checks passed. Final browser-print export inspection is still required before merge.

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

## Tests and known blockers

- Focused `6.EE.B` code/browser run after rebasing onto merged `6.EE.A`: 53/53 passed.
- Full Node and browser suites after rebasing `6.EE.B`: 437 total, 427 passed, 10 failed (code 354/363; browser 73/74).
- The 10 existing failures do not overlap the workbook changes: two stale Number Magic count assertions and eight private Grade 6 runtime/browser tests that require the absent private authoring directory.
- The public-exposure audit still reports the existing `hsmiddle/data.js` student-record bundle. This is outside the Boarding School Math change and must not be silently edited here.
- No GitHub checks are configured for pull requests #199 or #200; local evidence is therefore required.

## Exact next sequence

1. Check `git fetch origin`, current branch, clean state, and whether `main` advanced.
2. Treat `unit-workbook.html` plus its shared data and renderer as the product source. Generate student Korean A4 and teacher Simplified-Chinese Letter browser-print exports for `6.EE.B` only as release QA artifacts.
3. Inspect page count, paper size, student/teacher answer separation, overflow, and representative rendered pages. Fix the HTML/CSS/data source and regenerate if any print defect appears.
4. Rerun focused tests, push, merge #200, wait for the Pages workflow, and perform live desktop/mobile/recheck/teacher checks.
5. Upgrade `6.EE.C` from the current 12-item clinic only after `6.EE.B` is released.

Do not call a unit complete merely because its code or pull request exists. Completion requires exact-answer verification, student/teacher separation, mobile and browser-print rendering, inspected print exports, merged remote SHA, successful deployment, and live URL checks. PDF files are QA exports from the same HTML generator, not a second authoring source or the primary product.
