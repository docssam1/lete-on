# Grade 7 `7.NS.A` release-candidate manifest — 2026-10-14

Status: **local candidate only; no stage, commit, push, merge, deployment, diagnostic item release, or school-use approval**.

## Git boundary

- Worktree: `E:\Codex\worktrees\boarding-fraction-source-20261013`
- Branch: `codex/boarding-fraction-source-20261013`
- Base HEAD: `75cd785d8329f79995cb6cd48a6a755da1e69788`
- Last inspected `origin/main`: `93da903c94b338795b80c9c85f78804bda0e8b6f`
- Candidate payload excluding this manifest: 38 files — 19 modified, 19 untracked, zero staged.
- This manifest is the thirty-ninth local change and is intentionally excluded from its own hash table.
- A fresh fetch on 2026-10-15 confirmed that the candidate worktree is behind the inspected remote by 38 commits and ahead by zero. The remote changed 197 paths from the local base; overlap with all 39 current local paths, including this manifest, is zero. Re-run this comparison immediately before any authorized commit; do not rebase or merge inside this dirty worktree.

## Narrow commit split

### Candidate A — Grade 7 workbook and visible catalog integration

- `app.css`, `app.js`, `catalog.html`
- `unit-workbook.css`, `unit-workbook.html`, `unit-workbook.js`
- `learning/grade7-ns-a-unit-workbook.js`
- `tests/grade7-ns-a-unit-workbook.test.cjs`
- `tests/unit-workbook-browser.test.cjs`
- `tests/foundation-browser.test.cjs`
- workbook-only portions of `tests/private-workbook-authoring-guard.test.cjs`
- workbook-marker portions of `scripts/audit-public-exposure.cjs`

This candidate contains the reviewed 36-item workbook, eight-item recheck, stacked fraction rendering, calculated visuals, student/teacher separation, A4/Letter behavior, Grade 7 catalog route, and the truthful five-step learning sequence. It does not contain a runnable diagnostic.

### Candidate B — Answer-free diagnostic infrastructure and review gates

- `assessment/diagnostic-engine.js`
- `assessment/grade7-ns-a-screener-plan.js`
- `assessment/grade7-ns-a-screener-authoring-manifest.js`
- `assessment/unit-screener-scoring-readiness.js`
- `assessment/unit-screener-report-projections.js`
- `tests/grade7-ns-a-screener-plan.test.cjs`
- `tests/grade7-ns-a-screener-authoring-manifest.test.cjs`
- `tests/grade7-ns-a-screener-analysis.test.cjs`
- `tests/grade7-ns-a-screener-scoring-readiness.test.cjs`
- `tests/grade7-ns-a-screener-report-projections.test.cjs`
- `tests/grade7-ns-a-release-candidate-manifest.test.cjs`
- `tests/diagnostic-engine.test.cjs`
- `tests/boarding-signer-payload-guard.test.cjs`
- `package.json`
- `docs/GRADE7_NS_A_AUTHORING_GATE.md`
- `docs/GRADE7_NS_A_DIAGNOSTIC_CONTRACT_2026-10-14.md`
- `docs/GRADE7_NS_A_CC_SOURCE_AUDIT_2026-10-14.md`
- `docs/GRADE7_NS_A_AUTHENTICATED_DELIVERY_COMPATIBILITY_2026-10-14.md`
- `docs/GRADE7_NS_A_LOCAL_QA_2026-10-13.md`
- this release-candidate manifest

Candidate B contains no learner-facing diagnostic prompt, answer, choice, solution, rubric content, student record, credential, or signed release. It keeps all 18 slots locked and only establishes official-source evidence targets, review, scoring-readiness, non-prescriptive analysis, role projection, and signer compatibility contracts.

### Candidate C — paper O/X to stabilized 3D roadmap demo

- `learning-plan.html`, `learning-plan.css`, `learning-plan.js`
- `learning-plan-roadmap-3d.js`
- `learning/roadmap-pace-engine.js`
- `tests/roadmap-pace-engine.test.cjs`
- `tests/learning-plan-browser.test.cjs`
- roadmap-test registration in `package.json`

Candidate C is a public demonstration only. It turns answer-free paper O/X marks into analysis, a mandatory stabilization window, and four explicit pace branches: maintain, add daily time, add a weekly study day, or adjust both. A single observation cannot unlock acceleration. The student view receives the analysis summary; direct O/X editing is visible only in the teacher workspace. The English view uses a U.S. grade/course path and the Chinese view uses a Singapore curriculum path; neither exposes Korean workbook-brand taxonomy. The 3D view is functional on screen, while A4 uses the equivalent text route and never prints a dark WebGL panel. It does not store a student record or make an official placement, promotion, award, or school-policy claim.

Shared test and audit files must be staged by hunk if the two candidates are committed separately. Do not stage their unrelated lines wholesale.

## Candidate payload SHA-256

| State | Repository path | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| M | `boarding-school-math/app.css` | 14226 | `314d0a029df688b94f2ff9f7b6de71dcb1c8ed8541bbca5ac3ae14221d80fa10` |
| M | `boarding-school-math/app.js` | 22442 | `28167bb47c2e7034927a4593d4ef5f4880712e309eb4b27ce58a61605e13e9e9` |
| M | `boarding-school-math/assessment/diagnostic-engine.js` | 38926 | `30f74db998d8e6433a9a7ed9450d3be5e1250987bbf527f4630bd5e34226248b` |
| M | `boarding-school-math/catalog.html` | 4822 | `98c1a8831cbcb73984d9bc75f87b96a3845ba2cee3269ab9272cb81fe50bc977` |
| M | `boarding-school-math/docs/GRADE7_NS_A_AUTHORING_GATE.md` | 8307 | `1bbaa4b8e5ea0fdd5f2b51a8fd98a9dc9d6cef358c7857fea815bdb6b1230992` |
| M | `boarding-school-math/learning-plan.css` | 22572 | `8a49e6c6c06a09ff6c8816d3654db33e6e4fe2c2f7c9cd63340f0fa20eb84ae2` |
| M | `boarding-school-math/learning-plan.html` | 14159 | `3e65560015ec3c1cfd1dbb79550a99cb92e0e9116033d66aeb6e41e689749010` |
| M | `boarding-school-math/learning-plan.js` | 37158 | `59fabe82b902d522aa2aefb0a37853b5f0d14129409019ec1733b0997cd0b1d6` |
| M | `boarding-school-math/package.json` | 6405 | `1e67a22afe6147b59d13eed3a3029166cbc8a8433af3dc21105704c1c0c67210` |
| M | `boarding-school-math/scripts/audit-public-exposure.cjs` | 9495 | `97013c8072f8ce1558fe920694172b5632e7a4afdfb1ecca1ef7376f077c7359` |
| M | `boarding-school-math/tests/boarding-signer-payload-guard.test.cjs` | 22066 | `54b7755fb5d6a84311e19896232cf8de429c41d8103d9746588cd6f51085eac0` |
| M | `boarding-school-math/tests/diagnostic-engine.test.cjs` | 24650 | `121d6615a688d2c2ae5a8af83b9720cb4195cfa450d4460c567d0edc80e5a34c` |
| M | `boarding-school-math/tests/foundation-browser.test.cjs` | 52929 | `2b4cb83d3ef59f24e39143c74c64d7d64610bae5c0e5090fc5dbeb9c2196c690` |
| M | `boarding-school-math/tests/learning-plan-browser.test.cjs` | 17447 | `4f9a87ed306606059e4c6e446f31dc1b2bc0adabd0eb11d6379bf36759cdaf45` |
| M | `boarding-school-math/tests/private-workbook-authoring-guard.test.cjs` | 185655 | `af2bb7040a8bfc293d2bbd0284dbb99382a9db2d04342c2e8934e299d1bec259` |
| M | `boarding-school-math/tests/unit-workbook-browser.test.cjs` | 73663 | `2f014c04207fafcb7a9b6c4fec39c83cf9fcb62b9179a958762f5c3728e2de1c` |
| M | `boarding-school-math/unit-workbook.css` | 32452 | `3be308f354f7c1d2d03a5efda8b9c19c3f1845f9d54dd4ffa41ff280120da975` |
| M | `boarding-school-math/unit-workbook.html` | 4108 | `554eba925d04cd93e29a670ddb053e80e094a9100b9de6bf4934e512ca24eff2` |
| M | `boarding-school-math/unit-workbook.js` | 21330 | `6c75ad1a85becb10d760d298d6712257be28e21947c06af68f34a8ca4e4f199c` |
| ?? | `boarding-school-math/assessment/grade7-ns-a-screener-authoring-manifest.js` | 5783 | `10a87222fe34fe50a6db7998ae73db394697e2792160dfa99992de5e3af6cbf1` |
| ?? | `boarding-school-math/assessment/grade7-ns-a-screener-plan.js` | 11060 | `6cfbefef04116e8dece89dd939d038a0d5b935f1b0bd135ad17c4d744b57469b` |
| ?? | `boarding-school-math/assessment/unit-screener-report-projections.js` | 28376 | `b92a6785bec60e4beb8759ad8bd88f93319481b95c35cc688ea142ac80563e3a` |
| ?? | `boarding-school-math/assessment/unit-screener-scoring-readiness.js` | 12718 | `63c877e5ad22cb03ca8de2f48f70214f52c88e0248727f7c6559a90ccb953ab6` |
| ?? | `boarding-school-math/docs/GRADE7_NS_A_AUTHENTICATED_DELIVERY_COMPATIBILITY_2026-10-14.md` | 4389 | `bd87efbc18dd6d76cb349e52ea3834652411ad933124d964ca3b7b3d4aaa16d3` |
| ?? | `boarding-school-math/docs/GRADE7_NS_A_CC_SOURCE_AUDIT_2026-10-14.md` | 6157 | `ea53730d18a5f061e68ecd76a06b5bfd088619246f50206a44bef5cf951528aa` |
| ?? | `boarding-school-math/docs/GRADE7_NS_A_DIAGNOSTIC_CONTRACT_2026-10-14.md` | 10805 | `538fe89492f54f2d86d3c3aa59139af283733a539f24a54e6099cd9425c82179` |
| ?? | `boarding-school-math/docs/GRADE7_NS_A_LOCAL_QA_2026-10-13.md` | 16264 | `5f7d66d1a9c8fbb143399c4834361c62966695f2939b1f00c953526b3bc74c7b` |
| ?? | `boarding-school-math/learning-plan-roadmap-3d.js` | 9130 | `32f313808701f7b4429dafbcac825c353118d391260591623da9bd3474aa8580` |
| ?? | `boarding-school-math/learning/grade7-ns-a-unit-workbook.js` | 53746 | `3c826f8d106ef9fc78ecb6640292e8c405afe5d5702befbef4c20837bc441599` |
| ?? | `boarding-school-math/learning/roadmap-pace-engine.js` | 9325 | `e4853b07e2697f1c196d243f218a3354ea8f0f01fb429d6b74acabf76a0d9074` |
| ?? | `boarding-school-math/tests/grade7-ns-a-screener-analysis.test.cjs` | 5747 | `537b90d7b468415057c1dc2cb8b5cbb10a70454b39662ec9813889ea3636e302` |
| ?? | `boarding-school-math/tests/grade7-ns-a-screener-authoring-manifest.test.cjs` | 4965 | `1559a598fd8b731a64bf9c29b4ff18110fcf957bbcf01115653fb36406cd657a` |
| ?? | `boarding-school-math/tests/grade7-ns-a-screener-plan.test.cjs` | 10460 | `57481ca0e1d97a26aba5ea1eeacd8157806876ed95ff419cbc15c6e08bc6f19e` |
| ?? | `boarding-school-math/tests/grade7-ns-a-release-candidate-manifest.test.cjs` | 2470 | `2716d5a680b000999ec5125d16e5ce862ca53006a7c09e87810ced667b8d1deb` |
| ?? | `boarding-school-math/tests/grade7-ns-a-screener-report-projections.test.cjs` | 7548 | `37dd4fcfd49681ec7d81a1cd4da8c4b8bf1ee24a0faff242112946ce2808ed94` |
| ?? | `boarding-school-math/tests/grade7-ns-a-screener-scoring-readiness.test.cjs` | 7509 | `3d8dfbccf9ed806427da2d5cbbf8e57650c19b7095755f5fd247860bcb5adf1a` |
| ?? | `boarding-school-math/tests/grade7-ns-a-unit-workbook.test.cjs` | 16490 | `4d76fd99711bf03b7ad1f5ddc2b151ea78f177cd3a8f24ff79ad92632bb083f4` |
| ?? | `boarding-school-math/tests/roadmap-pace-engine.test.cjs` | 2917 | `f38b7d2f17929983c4bf8b1dfcb2a99e4752d43cd8586ce17b5964960bfd5587` |

## Current verification evidence

- `npm run pretest`: 57/57 passed after adding locale-level visible-choice uniqueness and exact decimal-notation cardinality.
- Diagnostic engine, official-source plan, analyzer, scoring readiness, and role-projection focused run: 37/37 passed before the final payload-hash refresh.
- Shared item-release, signer, learning-delivery, and Grade 6 database contracts: 51/51 passed.
- Curriculum foundation browser regression: 7/7 passed.
- Existing signer/foundation regression: 25/25 passed.
- Existing Grade 6 delivery and database regression: 22/22 passed.
- Public-exposure audit: passed.
- Syntax checks and `git diff --check`: passed.
- Grade 7 rational-number browser subset: 5/5 passed, including the 390px student view and the trilingual student/teacher print matrix.
- Shared unit-workbook browser regression: 44/44 passed after the signed-fraction renderer change, covering the existing Grade 6 and Grade 7 student/teacher, recheck, responsive, and print paths.
- Grade 7 rational-number content checks now reject duplicate visible choices in every locale and require the independently verified decimal notation to identify exactly one correct option; focused content run: 10/10 passed.
- The curriculum catalog now shows the truthful six-stage route `diagnostic → teacher analysis → teacher-approved prescription/roadmap → concepts → workbook → recheck`; the prescription stage names weakness targets, study period, and daily load without exposing an unreviewed automatic route. Foundation browser regression: 7/7 passed; direct 390px and 1440px measurements reported zero horizontal overflow.
- The O/X roadmap engine focused run passed 4/4: first-observation acceleration lock, second stable-observation unlock, impossible-deadline extension, and country-specific English/Chinese curriculum labels without Korean workbook-brand leakage. Combined learner-plan engine run passed 8/8.
- Learning-plan browser regression passed 7/7, including a live WebGL canvas, 42-slot Grade 6 and 25-item SASMO O/X profiles, four pace branches, stabilization lock/unlock, English U.S. and Chinese Singapore curriculum copy, and zero 390px horizontal overflow.
- Direct PC 1440px and mobile 390px images were visually reviewed after reducing overlapping 3D labels. An actual three-page A4 PDF was rendered and all pages inspected; the 3D panel is replaced by the same readable text route in print, with no clipping or overlap.
- A current fetch against `origin/main` `93da903c94b338795b80c9c85f78804bda0e8b6f` found 197 remote-changed paths, 39 local-changed paths including this manifest, and zero path overlap. The worktree remains intentionally unmerged and unstaged.
- The locked diagnostic label says the 18 items are **awaiting** authoring and independent review in all three locales, and the locked-state badges read `준비 중 / Planned / 准备中`; the catalog does not claim that nonexistent items are already being reviewed.
- Latest-main compatibility was verified in isolated E: worktrees based on `origin/main` `2e6a7a0e063234e15ba7224e53b1cac0adf122c3`: local and remote changed-path overlap was 0, pretest 57/57, curriculum-foundation browser regression 7/7 after the six-stage flow change, shared contracts 51/51, shared unit-workbook browser regression 44/44, Grade 7 browser subset 5/5, public-exposure audit, 21-file syntax check, and `git diff --check` all passed.
- A 12-page A4 student PDF was regenerated after wrapping signed fractions in an explicit MathML row. The printed minus sign is now separated from the fraction bar by a dedicated `mspace`; all 12 rendered pages were visually inspected without clipping or overlap.
- Release-candidate path, byte-size, SHA-256, Git-state, and unresolved-gate assertions are part of `npm run pretest` and must pass after every candidate edit.
- Workbook browser matrix, trilingual rendering, print/PDF evidence, fraction notation, and visual bundles are detailed in `GRADE7_NS_A_LOCAL_QA_2026-10-13.md`.

## Required pre-commit sequence

1. Fetch `origin/main` and recompare the exact affected paths; do not rebase or merge inside this dirty worktree.
2. Verify every path hash against this manifest or record the intentional delta and regenerate the manifest.
3. Re-run syntax, pretest, content, browser, signer, public-boundary, and diff checks from a clean dependency environment.
4. Stage only the intended candidate. Use hunk staging for shared test/audit files.
5. Review `git diff --cached --stat`, `git diff --cached --check`, and the complete cached diff before committing.
6. Keep Candidate B explicitly answer-free and locked. Do not change catalog wording from “in review” to “available.”
7. Push only after the requested authorization; then verify the remote SHA and GitHub diff.
8. Merge/deploy only after separate authorization. Verify workflow completion and public desktop/mobile/A4/Letter behavior before reporting release.

## Unresolved release gates

- The 18 unseen diagnostic items, private answers/rubrics, independent calculations, distractor proofs, and item-level learner-fit reviews do not exist yet.
- No immutable 18-item signed form exists; the 18/4 authenticated delivery adapter therefore remains intentionally unimplemented.
- No student diagnostic execution, teacher queue, real learner result, automatic prescription, placement, promotion, or competition prediction is released.
- The O/X values on the roadmap page are explicitly demonstration marks and are not saved as a real learner record. Teacher-confirmed persistence and authenticated assignment remain unimplemented.
- A fresh fetch and affected-path comparison found zero overlap with current `origin/main`, but this dirty candidate has intentionally not been rebased, merged, staged, or reviewed as a staged diff.
