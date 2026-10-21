# Boarding School Math continuation handoff

Updated: 2026-10-21 KST (Mac continuation; older release evidence retained below)

This file is the short restart contract for the Boarding School Math product only. Do not mix it with `hsmiddle`, high-school selection, Geometry World, Number Magic, Fields Classic, or other repositories.

## Read first

1. The current machine storage notice and status files.
2. Repository `AGENTS.md` and `boarding-school-math/README.md`.
3. This handoff.
4. The current Git branch, working tree, `origin/main`, open pull requests, and deployment runs. Current state always outranks this dated note.

Never delete or move active sessions, source originals, Drive evidence, uncommitted work, or commits that are not on the remote. Do not spawn an agent with inherited long-chat history.

## Current Mac continuation — 2026-10-17

- Work branch: `codex/boarding-g7-nsa-mac-20261017`. The imported 39-file candidate is preserved byte-for-byte in `306c575c4b8ee182ac78fe19c9da6683b9fd51fb`, whose parent is the recorded `75cd785d8329f79995cb6cd48a6a755da1e69788` base. The historical release manifest remains unchanged; its verifier now reads that immutable snapshot, so later changes and a clean checkout are valid.
- Current scope: Grade 7 `7.NS.A` 36-item workbook plus eight recheck items, the locked 18-slot unit screener, and the paper O/X learning-plan demonstration. These are local implementation states, not a new deployed release. The roadmap demonstration currently uses Grade 6/SASMO pathways; it is not connected to an operational Grade 7 diagnostic.
- A fetch observed `origin/main` at `8777377c5356f02bab36229d273ba9374ee84118`. No differences from the candidate base were found in `boarding-school-math`, the shared worksheet renderer, or the required Three.js vendor files. No merge, push, deployment, Drive synchronization, or source-chat modification was performed.
- Mac execution uses the bundled Node 24.19.0 runtime and Playwright Chromium. Relevant sparse dependencies were materialized from the existing checkout. The latest Mac verification and remaining gates are recorded in `docs/GRADE7_NS_A_LOCAL_QA_2026-10-13.md`; older Windows results below are historical.
- `scripts/validate-private-grade7-ns-a-authoring.cjs` checks a draft pack supplied with `--root` pointing to an absolute directory outside every Git working tree. It preserves the exact 18-slot plan, 14 automatic / 4 teacher scoring split, trilingual content, pending independent review, and locked delivery. Its success means structural preflight only; it never approves mathematical correctness or release.
- The private draft root and local QA artifact paths are recorded in the existing external Mac continuation receipt. Do not copy private prompts, answers, rubrics, authoring scripts, or assets into this public repository. Actual reviewer/provider/model provenance must be recorded; a planned SOL/TERRA role is not evidence that that model ran.
- All 18 private item drafts and three calculated SVGs have been written. Structural preflight and a separate exact-rational check of all 18 slots pass, including asset hashes and number-line coordinates. Local review repaired mixed-language copy, negative-numerator notation, an unasked rubric condition, and repeating-decimal acceptance consistency. This is local AI review evidence, not formal item-release approval; every private review/rights flag remains pending and delivery remains locked.
- Public-exposure regression passes, and current/staged/untracked checks are clean. The new whole-repository assessment-marker history gate remains unverified because this `blob:none` partial clone lacks historical blobs. The audit fails closed without lazy network fetching. A complete local history scan is required before claiming the expanded history gate has passed.
- Next sequence: complete formal item/rubric/translation/rights and full trilingual item-rendering reviews, then obtain valid immutable item releases before implementing the 18/4 authenticated-delivery adapter. Internal error-signal rationales follow the existing Korean/English scoring contract; Chinese teacher-feedback integration still needs its own localization work. Connect teacher-confirmed priorities to learning resources after those gates; automatic prescription and placement remain disabled.

## User-provided Grade 6 roadmap reference — 2026-10-21

The user supplied a 2025-02-27 `math_in_depth` post titled “Digital SAT Math 800을 목표로 한 단계별 학습법 (2) 6학년 편” as planning context. Its useful sequence is Grade 6 number/operation, early algebra, geometry, data, and word-problem foundations; explaining why a method works and trying multiple solutions; then optional AMC 8 problem-solving practice, introductory SAT-style word/data questions, and cumulative review. AoPS, Khan Academy, Singapore Math, and other named books or sites are examples from the post, not approved requirements or verified endorsements.

Use the post's four three-month blocks as a discussion example, not fixed pacing. Set time and advancement from reviewed diagnostic evidence, repeat observations, learner workload, and teacher confirmation. Keep school-course progress, AMC 8 competition work, and SAT-style exposure as distinct goals and evidence streams. Do not turn the post's predicted Grade 7 Algebra 1 mastery or SAT 800 framing into a product guarantee, placement decision, or automatic acceleration rule. No curriculum catalog, assessment, or learner-facing schedule changed from this reference alone.

## User-provided Grade 7 advanced-track roadmap — 2026-10-21

The user supplied a Grade 7 plan with Algebra 1, introductory geometry, AMC 10 problem solving, and advanced SAT Math exposure across four three-month blocks. Its useful teaching emphasis is to understand concepts thoroughly, explain reasoning, and broaden approaches to unfamiliar problems. AoPS Introduction to Algebra is a suggested resource, not a required purchase or an approved item source. Keep school-course mastery, competition exploration, and SAT exposure as separate optional goals.

For the current `7.NS.A` work, use reviewed evidence about rational-number meaning, signed operations, and explanations to identify any prerequisite repair before considering an Algebra 1 bridge. The locked 18-slot screener cannot yet assign a track; an overall score alone cannot certify Algebra 1, AMC 10, or SAT readiness. The proposed three-month blocks and prediction of easy Grade 8 Geometry mastery are illustrative, not fixed pace or outcome guarantees. Do not accelerate, assign AMC/SAT practice, or change a school course solely because of grade; require teacher confirmation, school context, and learner interest/workload. No diagnostic item, release gate, or student-facing route changed from this reference.

## User-provided concept-flow references — 2026-10-21

The user supplied a 2025-10-31 `math_in_depth` post with example bridges from multiplication/distribution to algebraic manipulation, ratio/rate to proportions and graphs, parity to casework, and sequences to number-theory reasoning. Treat this as a *living teaching map*: ask students to explain why a familiar idea still works in a new representation, compare two approaches, and identify when a connection does or does not apply. For example, proportional relationships are a special case of linear relationships, not every linear function; modular arithmetic also need not wait for closed-form sequences. The arrows are illustrative connections, not mandatory prerequisites or an ordered course catalog.

For the current `7.NS.A` unit, a possible teacher-reviewed bridge is to ask how signed rational operations support later expression evaluation or coordinate reasoning. Keep any such bridge outside the locked diagnostic's scoring and placement logic until separately authored and reviewed. The post's claim that these links will make difficult contests easy is motivational, not a demonstrated outcome or GFIELD guarantee. No assessment item, progression gate, or student-facing route changed from this reference.

The user also supplied the 2025-08-02 `math_in_depth` eight-part “AMC 준비를 위한 수학 개념 로드맵,” a fuller version of this map. It groups teaching opportunities into six strands: number structure (place value, decomposing, arrays, two meanings of division); arithmetic-to-expression/equation (like units, equality as balance); geometry/spatial reasoning (shape, measurement units, coordinates, transformations); logic/patterns (parity, factors, sequences, organized cases); word-problem modeling (units, diagrams, tables, graphs); and mathematical communication (explanation and justification). These are prompts for observing whether a learner can translate and explain an idea across representations, not six sequential placement gates or a promise of AMC/AIME success. The author also calls the roadmap a personal recommendation in the supplied comments.

For `7.NS.A`, the number-line, unit/context, and verbal-justification strands can inform future original teaching prompts after item and rights review; retain the existing standards boundary and teacher-confirmed plan. [MAA's invitational overview](https://maa.org/maa-invitational-competitions/) describes AIME as integer-answer and USAMO/USAJMO as proof-based, so proof-writing may be a valuable extension without presenting it as an AIME response requirement. No copied exercise, diagnostic item, release gate, or student-facing route changed from this additional reference.

## User-provided AMC 10/12 learning reference — 2026-10-21

The user supplied a 2026-09-04 `math_in_depth` post about AMC 10/12 preparation. Treat its four stages—concept, topic-based reasoning, connections across topics, and timed practice—as a competition-path design reference. Algebra, number theory, geometry, and combinatorics are the example concept areas. Topic practice should ask why a method applies, whether another method works, and what changes when a condition changes. Mixed problems should check whether a learner can select and connect concepts without a topic label.

For later practice, record more than a mock score: time spent, concept gaps, missing ideas, calculation errors, and unnecessarily long solutions. Skipping and returning to a question and solving some problems without answer choices are useful skills to observe. Past papers and AIME-style extensions require separate source-rights and learner-readiness decisions; the post's suggested question ranges and qualification strategy are not official cutoffs or a basis for automatic routing. This reference does not change the current student-facing schedule or authorize a competition-readiness claim.

## User-provided AMC 8 learner-interest reference — 2026-10-21

The user supplied a 2026-08-10 `math_in_depth` post about strong younger AMC 8 learners who lose interest when preparation becomes repetitive formula and test-skill drilling. Treat this as a learner-experience design concern, not as evidence that any named academy causes that outcome. A high competition score by itself must not increase question volume, trigger acceleration, or label a child. During teacher review, ask what the learner enjoys, whether the current workload still feels sustainable, and whether the learner can explain and explore ideas rather than merely recall a solution pattern.

For these learners, offer choices such as explaining why a result holds, finding another method, changing a condition, or exploring a self-selected challenge. Timed practice can be one option after understanding, with room for untimed investigation and rest. The post's MOEMS/AMC/AIME ordering and numerical score comparisons are illustrative opinions, not official prerequisites, equivalencies, or placement thresholds. Any future motivation or workload observations belong in an authorized private teacher workflow, not a public static student record. No current assessment or student-facing pace rule changed from this reference.

## User-provided FlippedMath reference — 2026-10-21

The user supplied [FlippedMath](https://www.flippedmath.com/). Its [Math 7 course index](https://math7.flippedmath.com/) groups rational-number addition/subtraction in Unit 2 and multiplication/division in Unit 3, a useful comparison for the current `7.NS.A` concept sequence. A [sample lesson](https://math7.flippedmath.com/23-add--subtract-fractions.html) offers a video, packet, practice solutions, and corrective assignments. Review that teaching and recheck structure as an external example; the project's official standards audit remains the source for `7.NS.A` scope and the private diagnostic items remain original GFIELD work.

The site's [pacing guides](https://www.flippedmath.com/pacing-guides.html) assume a 180-day school year, and its [grading page](https://www.flippedmath.com/grading.html) describes its own progression thresholds. Neither is a GFIELD cutoff or an automatic pace rule. Its [terms](https://www.flippedmath.com/terms.html) allow free digital materials to be viewed, downloaded, and printed for classroom/personal use while restricting public redistribution and reposting. Keep worksheets, solutions, and videos at their source links unless permission for another use is established; do not copy them into public pages, private item packs, or GFIELD-owned question text. These pages were checked on 2026-10-21; no product route or assessment changed from this reference alone.

## User-provided Amy's Math Concepts Prealgebra Unit 1 PDF — 2026-10-21

The user supplied [this Drive PDF](https://drive.google.com/file/d/10q1KYdk6_lImgfuj8BDi8pDqOOumnplp/view), identified as *Amy's Math Concepts · Prealgebra, Complete Edition, Unit 1: Expressions & Properties* (39 pages). Its seven lessons cover variables/evaluating expressions, exponents, order of operations, translating words into expressions, operation properties, distribution, and combining like terms, followed by a unit review, answer key, and glossary. The lesson pattern uses a visual big idea, worked examples, a common-error note, graduated practice, and a strategy-labeled challenge paired with a separate drill book. This is a useful structural reference for an optional concept/review path after teacher review, especially `6.EE.A` and later `7.EE.A` connections; it is not a `7.NS.A` rational-number diagnostic or a substitute for the current unit's standards and item verification.

The PDF identifies Amy (amymath) and Nova, carries a 2026 all-rights-reserved notice, and says copying, sharing, uploading, or resale requires written permission; printed copies are limited to the buyer's household or students personally taught by that buyer. The Drive link grants access to inspect the file, not GFIELD publication rights. Do not import its text, examples, problems, answer key, diagrams, or page images into the repository or private item pack without a separate rights decision. Its same-day drill pairing is an editorial option, not a mandated daily workload or an automatic advancement rule. Only the source's scope and high-level teaching pattern were recorded here; no product content, route, or assessment changed.

## User-provided elementary textbook roadmap — 2026-10-21

The user supplied a `usamomnotes` Grade 3–6 roadmap (comments dated 2026-01-10) and a 2026-01-25 reply comparing Beast Academy with Singapore Math. Its useful common principle is to ask learners to interpret a word problem, table, graph, or diagram and explain *why* a method works before increasing pace. The examples progress from Grade 3 operations and reading word problems, through Grade 4 visual/table interpretation and Grade 5 targeted weakness practice, to Grade 6 consolidation and familiar test formats. Spectrum, Math Mammoth, Singapore Math, IXL, and Beast Academy are author-suggested resources, not verified endorsements, required purchases, or approved content sources.

Use this as a teacher conversation prompt: check which representation or explanation breaks down, and select short, sustainable practice from observed evidence. The post's five-problems-per-day suggestion and Grade 6 “no new material” advice are illustrative, not fixed GFIELD workload or placement rules. The reply describes Beast Academy as an optional reasoning challenge and Singapore Math as a concept sequence; this is one educator's experience, not a universal learner fit or a mandate to combine books. For the current Grade 7 `7.NS.A` work, preserve the locked diagnostic and teacher-confirmed learning plan; ask students to explain rational-number operations and representations when appropriate, without importing third-party exercises or automatically assigning a resource. No product route, assessment, or pace rule changed from this reference.

## User-provided Grade 8 advanced-track roadmap — 2026-10-21

The user supplied a 2025-02-27 `math_in_depth` post titled “Digital SAT Math 800을 목표로 한 단계별 학습법 (4) 8학년 편.” It describes an accelerated path through Algebra 2, deeper geometry, AMC 10/12 and AIME problem solving, and SAT/PSAT practice across four three-month blocks. The useful learning-process ideas are to connect algebra with geometry, explain why a method works, compare multiple solutions even after a correct answer, analyze errors, and practice accuracy under time limits when the learner is ready. Keep school mathematics, contest preparation, and SAT/PSAT preparation as separate goals and evidence streams.

Treat Algebra 2 in Grade 8, AIME preparation, daily/weekly schedules, ten years of past papers, and the suggested books as examples for an individually reviewed advanced path, not grade-level requirements or automatic assignments. The post's Grade 9 Pre-Calculus and AIME predictions, and its SAT 800 framing, are not outcome guarantees. Its advice about school Geometry placement is the author's recommendation, not a GFIELD placement rule; any course decision needs the actual school sequence, demonstrated prerequisites, learner interest/workload, and teacher/family review. Review rights before using third-party books or contest papers. This reference does not accelerate the current locked Grade 7 `7.NS.A` diagnostic, alter its item scope, or change any student-facing route or pace rule.

## User-provided Grade 10 advanced-track roadmap — 2026-10-21

The user supplied a 2025-03-03 `math_in_depth` post titled “Digital SAT Math 800을 목표로 한 단계별 학습법 (9) 10학년 편.” It proposes Pre-Calculus, AMC 12/AIME, SAT Math, and later USAMO proof practice in four three-month blocks. Useful process ideas include deep understanding of functions and trigonometry, number-theory/combinatorics reasoning, proof-writing, timed practice after concept work, and review of errors. Keep school coursework, competition results, and SAT practice separate; any advanced path requires evidence of prerequisites, learner interest/workload, and teacher/family review.

The post's AMC 12 `130+`, summer SAT `800`, AIME qualification, USAMO, suggested books, and weekly volume are aspirations, not GFIELD cutoffs, promises, or automatic assignments. In the [MAA's 2026–27 US/Canada AIME guidance](https://maa.org/maa-invitational-competitions/) checked on 2026-10-21, AIME qualification comes from AMC 10/12 performance: eligible students need AMC 10 `100+` or AMC 12 `85+`, plus other eligibility conditions. Thus `130+` is the post's stretch target, not that cycle's official AIME threshold. MAA also says 2027 USAMO/USAJMO selection is primarily based on AIME scores; confirm the applicable cycle and region before any operational claim. Third-party test papers and books need rights review before reuse. This reference does not change the locked Grade 7 `7.NS.A` assessment or any student-facing route or pace rule.

## Product direction

GFIELD Math is a student/teacher system that connects diagnosis, domain analysis, concept learning, clinic practice, printable unit workbooks, rechecks, and teacher-reviewed progression. It covers US school mathematics and keeps competition pathways such as SASMO, Math Kangaroo, AMC 8, AMC 10, and AMC 12 distinct from course placement. It must not present a school-specific progression rule as an official US national cut.

Public student practice may contain original GFIELD-authored content. Private diagnostics, answer keys, student records, source originals, and restricted contest assets must not be published from the static site.

## Current release state

- Grade 6 public-learning inventory is complete as of main merge `f6979fb403ccb87908bf6975c793719814a67b3e` through pull request [#212](https://github.com/docssam1/lete-on/pull/212). The home and course map now state the exact public boundary: ten concept lessons and nine verified unit workbooks (`6.RP.A`, `6.NS.A`, `6.NS.B`, `6.NS.C`, `6.EE.A`, `6.EE.B`, `6.EE.C`, `6.G.A`, `6.SP.A`). The `6.SP.B` concept remains available, but it has no released workbook. The 42-item diagnostic and automatic assignment remain independently reviewed and are not student-operational.
- `6.NS.C`: merged to `main` in `18eabffade549c0b07721d3bbb82fa01968316ed`. Public student and teacher routes, mobile layout, A4/Letter PDFs, and completion-gated recheck were verified.
- `6.EE.A`: merged to `main` in `1c5f8c8e13a16f4d141f781c3dcc9e8b2541b67c` through pull request [#199](https://github.com/docssam1/lete-on/pull/199). The HTML generator, 390px mobile view, student Korean A4 print, teacher Simplified-Chinese Letter print, completion gate, and live routes were verified. Visible numeric fractions now render as accessible stacked MathML while slash-form response input remains accepted.
- `6.EE.B`: merged to `main` in `d05e61d84cd8e5fa260cbd83f058d5fc8f390c3d` through pull request [#200](https://github.com/docssam1/lete-on/pull/200). Pages deployment run `34358815421` succeeded. The live Korean student 390px route has 12 pages, 36 response controls, no teacher content, and no horizontal overflow; the live Simplified-Chinese teacher Letter route has 20 pages, 36 keys, no student controls, and eight solution rays. The old clinic key stays locked, while the unit key opens its eight-item recheck. Context variables remain identical across prompts and visual models, and every recheck page uses the recheck heading. Student Korean A4 (12 pages) and teacher Simplified-Chinese Letter (20 pages) browser-print exports were rendered and visually inspected with no overflow, clipping, or answer-boundary leak.
- `6.EE.C`: merged to `main` in `be0d4d46eec9bd6f0a23a98d61af0634aec1a908` through pull request [#206](https://github.com/docssam1/lete-on/pull/206). Pages deployment run `34364211182` succeeded. The live Korean student 390px route has 12 pages, 36 response controls, 12 calculated coordinate graphs, no teacher content, and no horizontal overflow; the live Simplified-Chinese teacher Letter route has 20 pages, 36 keys, no student controls, and 12 calculated graphs. The old clinic key stays locked, while the unit key opens its eight-item recheck with one graph. Student Korean A4 (12 pages) and teacher Simplified-Chinese Letter (20 pages) browser-print exports were rendered and visually inspected with no overflow, clipping, or answer-boundary leak.
- `6.G.A`: merged to `main` in `bf17ee9027dc1577c5f66e77656247e1ca7f13d1` through pull request [#209](https://github.com/docssam1/lete-on/pull/209). Pages deployment run `34366562672` succeeded. The live Korean student 390px route has 12 pages, 36 response controls, 36 calculated geometry figures, no teacher content, and no horizontal overflow; the live Simplified-Chinese teacher Letter route has 20 pages, 36 separate keys, no student controls, and 36 figures. The old clinic key stays locked, while `gfield-unit-workbook:6.G.A:v1` opens an eight-item recheck containing its own calculated figures.
- `7.RP.A`: merged to `main` in `854c5c7907e013c3509ab8456aa4bce2b161eaea` through pull request [#215](https://github.com/docssam1/lete-on/pull/215). Pages deployment `34379456747` succeeded. It is the first published Grade 7 unit: 36 original proportional-relationship items (fractional unit rates, proportionality/constant, equation/graph meaning, and multistep percent) plus a separate eight-item recheck. Live Korean student: 12 pages, 144 choice controls, no teacher content; live Simplified-Chinese teacher guide: 20 pages, 72 separate teacher method/observation blocks, no student controls; 390px has no horizontal overflow; A4 and Letter browser-print pages have no overflow. Completion key: `gfield-unit-workbook:7.RP.A:v1`.

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

## Verified `6.G.A` contract

- 36 workbook items: 9 composition/decomposition and area, 9 fractional-edge prism volume, 9 coordinate-plane distance/area, and 9 nets/surface-area items.
- 8 named recheck structures and a fixed 44-answer ledger plus an independent BigInt geometry calculation: shoelace area, formula area, volume, coordinate distance, and surface-area checks.
- Coordinate figures use declared point and segment models. SVG grid, axes, points, segments, and polygons are calculated through the existing shared geometry renderer; no coordinate positions are hand-drawn.
- Student: 12 pages, 36 response controls, no answer or teacher solution block.
- Teacher: 20 pages, 36 separate keys, no student controls.
- Korean, English, Simplified Chinese; A4 and US Letter; 390px mobile with no horizontal overflow.
- Completion key: `gfield-unit-workbook:6.G.A:v1`; the old clinic key cannot unlock it.

## Tests and known blockers

- Focused `6.EE.C` code/browser checks passed: 4/4 content checks and 3/3 dedicated browser checks.
- Focused `6.G.A` code/browser checks passed: 4/4 independent content/answer checks and 4/4 browser checks, including 320px/390px, student/teacher boundary, completion recheck, and print overflow.
- Full Node suite after `6.G.A`: 373 total, 364 passed, 9 failed. Its nine known failures do not overlap the unit: two stale Number Magic count assertions and seven private Grade 6 runtime checks that require the absent private authoring directory.
- The 10 observed existing failures do not overlap this workbook: two stale Number Magic count assertions and eight private Grade 6 runtime/browser checks that require the absent private authoring directory.
- The public-exposure audit still reports the existing `hsmiddle/data.js` student-record bundle. This is outside the Boarding School Math change and must not be silently edited here.
- No GitHub checks are configured for pull requests #199 or #200; local evidence is therefore required.

## Exact next sequence

1. Check `git fetch origin`, current branch, clean state, and whether `main` advanced.
2. Treat `unit-workbook.html` plus its shared data and renderer as the product source. Screen captures and any browser-print exports are QA artifacts, not separate authoring sources.
3. `6.EE.B`, `6.EE.C`, and `6.G.A` are released. Preserve their proof rather than redoing it without a code change.
4. The Grade 6 inventory is complete: nine verified 36-item workbook routes are public; `6.SP.B` has no released workbook and must remain accurately disclosed. `7.RP.A` is the only published Grade 7 workbook. `docs/GRADE7_NS_A_AUTHORING_GATE.md` is the approved pre-authoring boundary for the next cluster, `7.NS.A`; its student content remains locked until the source ledger, answer verification, representation, student/teacher, mobile, and print gates are complete. Every other Grade 7 cluster remains `locked-pending-skill-and-item-review`. Use `SOL 울트라` for original authoring and independent answer verification, then use `TERRA 높은` for integration, responsive/print QA, deployment, and live verification.

Do not call a unit complete merely because its code or pull request exists. Completion requires exact-answer verification, student/teacher separation, mobile and browser-print rendering, inspected print exports, merged remote SHA, successful deployment, and live URL checks. PDF files are QA exports from the same HTML generator, not a second authoring source or the primary product.
