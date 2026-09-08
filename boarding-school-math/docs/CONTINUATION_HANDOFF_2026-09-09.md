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
- `6.EE.A`: commit `9dc0e8f0` on `codex/boarding-grade6-eea-unit-workbook-20260909`; pull request [#199](https://github.com/docssam1/lete-on/pull/199). Code tests and screen renders passed. Two final PDFs and PDF inspection are still required before merge.
- `6.EE.B`: commit `8515076d` on `codex/boarding-grade6-eeb-unit-workbook-20260909`; pull request [#200](https://github.com/docssam1/lete-on/pull/200). It is stacked on the `6.EE.A` commit. Code tests and screen renders passed. Two final PDFs and PDF inspection are still required before merge.

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

- Focused `6.EE.B` code/browser run: 45/45 passed.
- Full Node and browser suites after `6.EE.B`: 436 total, 426 passed, 10 failed.
- The 10 existing failures do not overlap the workbook changes: two stale Number Magic count assertions and eight private Grade 6 runtime/browser tests that require the absent private authoring directory.
- The public-exposure audit still reports the existing `hsmiddle/data.js` student-record bundle. This is outside the Boarding School Math change and must not be silently edited here.
- No GitHub checks are configured for pull requests #199 or #200; local evidence is therefore required.

## Exact next sequence

1. Check `git fetch origin`, current branches, clean state, and whether `main` advanced.
2. On the `6.EE.A` branch, generate student Korean A4 and teacher Simplified-Chinese Letter PDFs with `scripts/render-eea-unit-workbook-pdfs.cjs`.
3. Inspect page count, paper size, text extraction, student/teacher answer separation, overflow, and representative rendered pages. Fix and repeat until clean.
4. Rebase #199 onto current `origin/main`, rerun focused tests, push, merge #199, wait for both Pages workflows, and perform live desktop/mobile/recheck/teacher checks.
5. Rebase the `6.EE.B` branch after #199 merges so #200 contains only the `6.EE.B` commit.
6. Generate and inspect the two `6.EE.B` PDFs with `scripts/render-eeb-unit-workbook-pdfs.cjs` using the same gate.
7. Rerun focused tests, push, merge #200, wait for both Pages workflows, and perform live desktop/mobile/recheck/teacher checks.
8. Upgrade `6.EE.C` from the current 12-item clinic only after both earlier units are released.

Do not call either unit complete merely because its code or pull request exists. Completion requires exact-answer verification, student/teacher separation, mobile and print rendering, inspected PDFs, merged remote SHA, successful deployment workflows, and live URL checks.
