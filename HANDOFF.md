# Current handoff — 2026-11-03

Repository: `/Users/docssam/Developer/GFIELD/continuations/boarding-school`, branch `codex/boarding-g7-nsa-mac-20261017`. The map-stop readability and G·MAP palette updates are committed locally. No push, deployment, or Drive synchronization has occurred.

### 2026-11-03 Grade 7 contest branch follows the selected program

Replaced the fixed AMC 8 optional card with a program-aware card. Grade 7 selection now routes Math Kangaroo to its official Grade 7–8 practice PDFs, AMC 8 to the existing GFIELD 10-item practice, AMC 10 to the original GFIELD 12-item topic practice, and SASMO to its materials page. Changing the competition selector updates the card immediately. Each destination is labeled as official source material or GFIELD-authored practice, without treating it as a score diagnosis or level placement. The shared math renderer on the roadmap and workbooks continues to show numeric fractions as a stacked numerator, fraction bar, and denominator; `/` remains for unit rates and program labels such as AMC 10/12.

Verification: bundled Mac Node syntax checks pass. The Grade 7–12 roadmap browser suite passes 44/44, including the Grade 7 program-switch behavior and existing stacked-fraction rendering; the grade roadmap model passes 12/12; `git diff --check` passes. Local only; no private candidate material opened, no push, deployment, Drive sync, or external API call.

### 2026-11-03 roadmap fraction typography

Connected the roadmap’s remaining learner-facing lesson, annual-plan, course-comparison, and algebra example text to the shared math-text renderer. Numeric fractions now use a stacked numerator and denominator with a horizontal rule instead of slash notation wherever those strings are rendered. A live local Chrome check of the Grade 7 roadmap’s Algebra 1 content found two stacked fractions (`8/3` and `14/3`) and no remaining numeric slash-fraction text in that section. A separate renderer spot check confirmed `1/2` and `3/4` render as inline grids while unit rates (`km/h`, `달러/회`) and `AMC 10/12` remain unchanged. No browser errors. Local only; no push, deployment, or Drive sync.

### 2026-11-03 roadmap and Pre-Algebra regression follow-up

Updated the roadmap browser assertions to match the current four-unit Pre-Algebra route: 14 student/teacher workbook links, 27 lessons and practice pages, and 27 teacher answer pages. The A4 check now restores screen media before changing the edition selector, because that control is correctly hidden in print media. This is test maintenance only; curriculum and item data did not change.

Verification: the selected grade-roadmap model/browser, Pre-Algebra course/pathway, and teacher-paper suites pass 75/75 using bundled Mac Node, Playwright, and Chrome. The browser coverage includes cross-grade comparisons, MAP norm-matched percentile rules, same-date/same-paper contest comparisons, Math Kangaroo's grade-band restriction, Grade 7 checkpoint/workbook routes, mobile widths, stacked fractions, A4 page fit, and separate teacher answers. `git diff --check` passes. Local only; no private candidate content opened, no push, deployment, or Drive sync.

### 2026-11-03 Grade 7 learning plan opens its current GFIELD workbook

The Grade 7 student's primary action now opens the released GFIELD 7.NS.A student workbook directly; the teacher view opens its teacher guide. The plan and notice say the personal diagnostic and result-based level comparison are under review; the selected study topic is explicitly learner-chosen and does not imply a weakness or grade level. Corrected the Korean topic sentence so labels ending in “빼기” do not receive the wrong subject particle. The shared workbook display was rechecked in Chrome: numeric fractions appear stacked, with zero slash-form fractions in student content.

Verification: the full learning-plan browser suite passes 10/10 using bundled Node, Playwright, and installed Chrome; student and teacher CTA destinations are asserted separately. A fresh live 1280px render shows the direct student-workbook link, review-status copy, corrected selected-topic sentence, and no horizontal overflow. Existing diagnostic and level comparison remain gated. Local only; no private candidate content opened, no push, deployment, or Drive sync.

### 2026-11-03 GFIELD Pre-Algebra Unit 3 · rational-number operations

Extended the original GFIELD Pre-Algebra workbook to three units: 20 lessons and 40 practice prompts. The new Grade 7 `7.NS.A.1–3` unit covers additive inverses and number-line models; rational addition, subtraction, multiplication, and division (including the zero-divisor restriction); terminating/repeating decimal representations; and signed-rational word problems. The public route links to the original student workbook and separate teacher solutions. Course counts, scope, route, README, and browser/contract expectations now match. It remains instructional material, not a diagnostic, mastery claim, or grade placement.

During answer review, corrected a subtraction practice key: the distance from −3 to −8 is 5, not 8. Added a regression assertion for the corrected key. The focused Node REPL contract run passes 8/8 across the Pre-Algebra course, course pathway, and shared fraction renderer. Local Chrome shows the 20 lesson and 20 practice pages in student edition, 20 answer pages in teacher edition, and zero overflowing A4 page cards. Student pages show stacked numerator/fraction-bar/denominator forms, no slash-form numeric fractions, and zero visible numeric-fraction matches in text pages. A student A4 screenshot was reviewed; a physical PDF export was not generated. No push, deployment, Drive sync, or external transmission.

### 2026-11-03 GFIELD Pre-Algebra Unit 4 · ratios and proportional relationships

Added seven lessons and fourteen practice prompts for Grade 7 `7.RP.A.1–3`: ratio meaning and order, equivalent ratios, unit rates, unit conversions, proportional tables/equations/graphs, percent applications, and nonproportional models. The unit is linked from the Pre-Algebra route alongside the existing reviewed 7.RP.A unit workbook. Course comparison, public resource counts, workbook selectors, and cache versions now report four authored units, 27 lessons, and 54 practice prompts. Updated the shared fraction boundary so a numeric fraction may begin next to Korean text correctly while a Korean-labeled unit rate such as `2.50달러/병` remains plain text; numeric fractions stay stacked. Regression test checks `km/h`, `AMC 10/12`, `2.50달러/병`, and `300원/개` preservation alongside real stacked fractions.

Focused Node REPL contract run passes 9/9. Local Chrome confirms the full student workbook shows 27 lesson and 27 practice pages, the teacher edition shows 27 answer pages, all page cards fit their A4 bounds, and neither edition leaves slash-form numeric fractions. The ratio unit's teacher pages retain horizontal unit-rate text. No physical PDF was generated. Changes remain local; no push, deployment, Drive sync, or external transmission.

### 2026-11-03 GFIELD Pre-Algebra Unit 2 · equations and inequalities

Extended the original Pre-Algebra workbook from one to two authored units: 12 lessons and 24 practice prompts. Unit 2 sequences substitution to check equation/inequality solutions, one-step addition and multiplication equations in the nonnegative-rational Grade 6 scope, contextual equations, inequality constraints on number lines, and explicitly labeled Grade 7 multi-step equation/inequality connections. References are CCSS 6.EE.B.5–8 and 7.EE.B.4. Updated the route, course comparison counts, workbook counts, tests, cache versions, and README. The path now reports two GFIELD units/12 lessons; it still states that the course is not complete and does not diagnose or place a learner.

Checked examples and answer keys manually; corrected a contradictory practice answer before verification. The Node REPL test runner passes the Pre-Algebra contract (3), course-pathway contract (3), and shared fraction-renderer contract (1): 7/7. A live local browser check now shows both units and 12 lesson/12 exercise pages in student mode and 12 answer pages in teacher mode. The student view has 12 stacked fractions and no slash-form numeric fractions; the teacher view has 17 stacked fractions and no slash-form numeric fractions, including the sentence-final `p=11/3.` case. Computed styles show inline-grid numerator/denominator and a visible 1px fraction bar. Actual PDF export was not generated; the pages use the existing A4 print renderer. No release, push, deployment, Drive sync, or external transmission.

### 2026-11-03 GFIELD Pre-Algebra Unit 1 and stacked fractions

Added `boarding-school-math/prealgebra-workbook.html` with an original GFIELD Unit 1: six lessons and twelve practice prompts covering variable expressions and values, exponents/order of operations, translating verbal relationships, operation properties, distribution, and combining like terms. Objectives and terminology follow the Common Core 6.EE scope; the course record links 6.EE and 7.EE references. The student route now includes the new unit and a separate teacher answer/solution route. The course comparison teacher link also opens the GFIELD workbook. Pre-Algebra remains a partial course prototype, not a diagnostic or placement result.

The workbook uses the existing A4 renderer and shared math formatting. Fractions such as 3/2, 9/4, and (s+12)/2 show a stacked numerator, horizontal bar, and denominator in both screen and print stylesheet structure; units, ratios, and counts are not reformatted as fractions. The request-specific six-step pathway uses curriculum terms such as “변수식으로 나타내고 식의 값 구하기,” “연산 성질,” and “동류항을 결합해 식을 정리하기.”

Verification: the local Chrome student view shows the fractions stacked in the worked square-area example, and accessibility output exposes them as Korean fraction readings; teacher mode also exposes stacked forms in answers. The course object reports 1 unit, 6 lessons, and 12 practice prompts in the available Node REPL. Course contract and browser regression tests were added, but the shell test runner was unavailable in this session; no suite pass is claimed. The Pre-Algebra route AX review confirms both student and teacher links, the six ordered concept labels, and current resource counts. `git diff --check` passes. Changes are local only; no push, deployment, Drive sync, or external API call.

### 2026-11-03 course comparison cards and fraction display check

The learner-selected previous/current/next course comparison now links each card directly to its GFIELD material. Algebra 1 availability matches the authored course: five units, 32 lessons, and 64 practice prompts. Grade 7 no longer shows the stale “first lesson available / next units in progress” status. This remains a learner-selected course path; the grade does not infer the course or placement.

Checked the requested fraction presentation against the rendered materials: workbook math uses stacked numerator/bar/denominator output, and the Grade 7 AMC 10 practice browser check confirms stacked fractions. Slash notation is retained for units and rates. The course pathway and roadmap browser suites pass 44/44, including course links and mobile layout. A separate broader workbook run was not clean: the checkout's Playwright default headless browser binary is missing, so no claim is made for those extra tests. `git diff --check` passes. Changes remain local; no push, deployment, Drive sync, or API call.

The contest grade-comparison copy now names its actual match key: the selected contest plus the learner-entered date and paper memo. It explicitly says that matching text does not verify the underlying paper or difficulty, and does not yield a grade, growth, or skill-level judgment. This is especially relevant when a saved label happens to match across two records. Focused AMC 8 and Math Kangaroo comparison browser checks pass 2/2; underlying comparison behavior and paper-band guard remain unchanged.

Replaced the generic Pre-Algebra card destination with a dedicated GFIELD study route. It sequences four strands—rational-number operations, ratios/proportions, expressions/relationships, and geometry/data—and links exactly ten public Grade 6 concept lessons, six reviewed Grade 6 workbooks, and two reviewed Grade 7 bridge workbooks. Four unreviewed Grade 6 workbook drafts are excluded. The Grade 7 items link to their released workbooks, not the Grade 6 concept lesson page. The route ends with a school-dependent link to the original GFIELD Algebra 1 workbook; it is a curated public-material path, not a complete placement course or diagnostic.

Course metadata now reports the 10 concept lessons and eight reviewed workbooks and links the student comparison card to the new path. Contract tests pass 3/3; focused course-pathway/Pre-Algebra browser tests pass 2/2 and check all ten concept cluster IDs, all eight workbook IDs, successful local resource responses, Algebra 1 bridge, and 390/1280px no-overflow. Manual Chrome screenshots were reviewed at both widths; initial header collapse was corrected before final screenshots. `git diff --check` passes. Changes remain local; no push, deployment, Drive sync, or API call.

### 2026-11-03 Precalculus polar-coordinate enrichment and fraction display

Added a GFIELD-authored optional lesson that converts polar coordinates to Cartesian coordinates and back, with a worked example and two practice prompts. It is explicitly labeled 선택 심화 because school sequencing varies; the course summary and A4 workbook metadata now report five units, 16 lessons, and 32 practice prompts. Fractions in the new example and practice are rendered with a visible numerator, horizontal bar, and denominator in both student and teacher workbook views; the displayed math does not leave slash-form fractions. The current AMC 10 practice route was also checked and already renders its simple numeric fractions as stacked fractions.

Verification: Precalculus workbook browser check confirms the new lesson/practice pages, stacked `3π/2` and `π/3`, zero visible slash-form fractions in the polar practice page, teacher answer pages, and responsive 320/390/1280px widths. The complete focused course-pathway/Precalculus/roadmap browser suite passes 45/45. `git diff --check` passes. Local only; no push, deployment, Drive sync, or API call.

### 2026-11-03 original Algebra 2 course + fraction notation

Added the GFIELD-authored Algebra 2 workbook at `boarding-school-math/algebra2-workbook.html`, reusing the existing student/teacher A4 workbook renderer. It contains five units, 18 lessons, and 36 original practice prompts with examples, explanations, answers, and feedback. Its scope is polynomial structure, quadratics, rational expressions/functions, exponential/logarithmic models, and sequences. Complex numbers and matrices are marked as optional extensions; it does not replace a school's Geometry course or establish a Grade 8/9 placement. Grade 8 optional enrichment and the inferred Grade 9 bridge now link to this local GFIELD workbook; external AoPS/FlippedMath Algebra 2 links were removed from those stages. Course metadata and resource counts now match the authored material.

The shared fraction renderer now displays numeric fractions and parenthesized algebraic fractions—including one level of nested factors—with a horizontal bar and an accessible Korean reading label. Non-mathematical unit notation such as `km/h` remains unchanged. The same renderer version is loaded by the roadmap, Algebra 1/2 workbooks, and teacher paper builder.

Verification: directly rendered the Algebra 2 workbook in the local browser at 320px, 390px, and 1280px with no horizontal overflow or page errors; confirmed 5 unit pages, 18 lesson pages, 18 practice pages, and 42 A4 page cards. The student edition contains no answer pages; the teacher edition contains 18 answer pages. Numeric and nested algebraic fractions show horizontal bars (including `75/8` and `(2x+2)/(x(x+2))`), while `km/h` remains slash notation. The Grade 8 route links to `./algebra2-workbook.html` in the same tab. Course data counts and representative worked answers were checked in the Node REPL. The repository test runner could not be invoked from this shell because `node` is not on PATH; targeted browser checks were performed manually, not claimed as a suite run. `git diff --check` is recorded after final edits. Changes remain local; no push, deployment, Drive sync, or API call.

Next: continue source-matched review of grade-to-grade course comparisons and contest-diagnostic evidence. The AIME manual-review path is now included, with same-date/same-paper comparison and no score or eligibility claims. Keep school course choice separate from inferred grade examples; do not convert contest results into placement claims. Grade 7 private diagnostic and contest candidates remain behind independent review, pilot, and release gates.

### 2026-11-03 original Geometry course

Added `boarding-school-math/geometry-workbook.html` and a GFIELD-authored course map with five units, 16 lessons, and 32 practice prompts. The sequence links coordinate transformations with congruence, construction and proof; similarity with right-triangle reasoning and trigonometric ratios; circle relationships; coordinate geometry; then measurement and modeling. Official Common Core Geometry codes are used to scope units; lesson text, examples, solutions, prompts, and feedback are original. The Grade 8 school-course check and Grade 9 inferred bridge now point to the internal Geometry workbook. Grade 8 annual resources no longer send learners to AoPS Geometry or Geometry Revisited; AMC guidance remains separate. The workbook reuses the existing student/teacher A4 renderer and displays fractions with the shared horizontal-bar notation.

Verification in the local browser: confirmed the student workbook renders 5 units, 16 lessons, and 16 practice pages. Numeric, Greek-letter, parenthesized, and Korean-labeled fractions render as numerator/denominator elements with a horizontal rule; common unit rates such as `km/h` remain inline. The current page exposed the revised HSG-CO standards list and no visible load failure. Earlier CUA inspection confirmed teacher mode exposes 16 answer pages. Grade 8 and Grade 9 route links resolve to `./geometry-workbook.html`; Grade 9 remains labeled as school-course confirmation, not placement. Responsive checks at 320/390/1280px and the new symbolic-fraction assertions are encoded in browser tests but were not executed in this environment. The shell has no Node binary, and the available Node REPL cannot import the installed Playwright bundle; the course-data contract test is also pending. No JavaScript console-error or horizontal-overflow claim is made. This section records local verification only. No push, deployment, Drive sync, or external API call.

Next: keep the high-school curriculum comparison aligned with each GFIELD workbook's actual scope and official standards. The earlier Precalculus external-link replacement is complete; Grade 9 remains an inferred bridge, and no grade label should be treated as course placement.

### 2026-11-03 G·MAP illustration palette update

Reworked the roadmap's wide map illustration to align with the GFIELD brand: deep plum `#482378`, violet `#7545D9`, lilac `#C7A5FF`, pale lavender `#EDE4FB`, and warm ivory `#FFF9F2`. Preserved the four floating-island learning sequence and winding route, reduced cyan/green, and left interface text/markers out of the artwork. The new optimized asset is `boarding-school-math/assets/roadmap/mathematics-learning-world-gmap-v2.webp` (1983×793, about 148 KB); the prior image remains untouched. The page and mobile layout now load v2 with updated cache keys. Generated with the built-in image tool from the existing local map image; prompt summary: recolor/refine the wide four-island G·MAP route into the stated GFIELD palette, keep the route composition and marker space, and omit text, logo, interface, people, and markers.

Verification after the asset/CSS update: roadmap model and browser suites pass 46/46. Fresh local renders at 1440×960 and 390×844 show the v2 asset returning HTTP 200 at both widths (151,418 bytes); mobile document width remains 390/390. Desktop prompt and route markers remain legible, and the phone layout keeps the map above the vertical stage list. No learner data or assessment items were used. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Grade 7 NS.A wording review preparation

Visually revisited the existing answer-free revision-11 mobile/A4 renders. The repeating-decimal open-response prompt remains dense, so a private review memo now offers two Korean/English/Simplified-Chinese alternatives: A keeps six labeled response fields; B asks for the same key evidence without a semicolon/six-field format. By character count, A is 40% shorter in Korean, 43% in English, and 29% in Chinese; B is 64%, 64%, and 59% shorter. These are length comparisons only, not readability or validity results. Reran the existing local calculation/contract check against revision 11: 18/18 calculation slots, three diagram mappings, 18 immutable plan slots, and the 14/4 automatic/teacher split passed. Public Grade 7 NS.A workbook, diagnostic-engine, release, scoring, report, and authoring contract tests now pass 88/88; these test public code and release boundaries, not private item validity. The candidate JSON remains unchanged at SHA-256 `476dc1c201a0ac07c6d6888db986ec7c1892604885c40d59d421fe7a7420e732`. This is a reproducible local check, not a new independent human review or a validity study. The memo distinguishes candidate-specific evidence from the narrower official `7.NS.A.2d` expectation and flags learner burden for independent review. Independent math and language review is still required before candidate revision or rerender. A read-only Claude Max review of option A is awaiting user approval; no candidate text has been transmitted. The screener remains locked; nothing from the proposal was copied into the public repository.

Follow-up: reran the private copy-proposal browser check with bundled Node/Playwright and installed Chrome. All nine language/width combinations (Korean, English, Simplified Chinese × 320/390/1280px) passed overflow checks; the prototype made zero network requests and persisted no responses. This verifies the local proposal UI only and does not approve wording, math, translation, accessibility, or candidate revision.

## Public roadmap and comparison work

The Grade 3–12 G·MAP boarding-school roadmap now contains the branded route illustration, supplied Grades 6–8 and 10 annual-plan examples, a clearly labeled inferred Grade 9 bridge, curriculum examples for grade comparison, student-entered external assessment comparison, and manual same-paper contest review. Grade 6 and Grade 7 plans link their stage-matched references. These records do not become placement decisions or unsupported cross-grade mastery bands. Public AMC/Kangaroo review remains bounded to entered marks, matching contest/date/paper, official score-report values, and descriptive evidence.

Current local regression evidence: roadmap model/browser `46/46`; contest practice, competition-source/profile, diagnostic-engine, and public Grade 7 NS.A plan/authoring/analysis/report/scoring/release/workbook tests `80/80`; competition paper-review browser `18/18`. Total `144/144`. Chrome rendered Grades 6, 7, and inferred Grade 9 at 1280px and true 390px device widths; all had four annual-plan stages, expected link/no-link behavior, G·MAP art, and no horizontal overflow. Commits `0c476d08f` (Grade 6–7 resource links), `4f0f2e424` (installed Chrome test override), and `fa44b6179` (metadata-only QA search record) are local.

## Two distinct private candidate gates

**Grade 7 `7.NS.A` screener:** revision-11 current answer-free visual QA artifacts already exist for Korean, English, and Simplified Chinese at 320px, 390px, A4, and Letter; the recorded pack hash matches `476dc1c201a0ac07c6d6888db986ec7c1892604885c40d59d421fe7a7420e732`. Known QA notes include horizontal pan for the initial 320px number-line view, diagram typography/print-label alignment, and dense repeating-decimal wording. These current captures/PDFs do not satisfy independent math/language/rights/accessibility review, pilot, immutable item release, or release authorization. Do not ask the user for another screenshot set for this unchanged `7.NS.A` revision.

**Separate Grade 7 AMC 8 R6 candidate:** this is the 42-item contest workbench, not the 18-slot `7.NS.A` screener. Current workbench/order files are dated 2026-10-30; available desktop/390px/320px screenshots and A4 PDF are dated 2026-10-29 and stale. Drive metadata searches on 2026-11-03 found no current replacements. Its project QA rule prohibits alternate/indirect rendering routes. Current visual review needs owner-provided current screenshots/PDF or an explicitly supported browser route. Even after visual review, independent content/rights/accessibility review, pilot, report validation, and release approvals remain separate gates. Keep it locked.

Continue public product work that does not require the private candidate contents. If the user supplies current AMC R6 QA artifacts or a supported route, review those specific artifacts; do not conflate that request with `7.NS.A`. No Claude review is claimed: Claude Code CLI reported `Not logged in` in the last recorded attempt.

- **유아 2차 디자인 패스 + R0 배너** (9bfc0815) — 오답 소리·😅표정을 공용 shake()
  한 곳에 연결(유닛 id N-* 게이트 — young 밴드는 A-*에도 걸려 과적용 위험), 색 대비
  30화면 스캔 후 8건 토큰 보정, young 밴드 공통 UI 확대(.nm-back은 유닛 바 스코프),
  N-15 최초 완료 시 R0 추천 오버레이(1회성·잠금 없음, S.seenR0Banner).

### 2026-11-03 G·MAP route stop readability

Kept the existing G·MAP violet, lavender, and ivory map artwork. Put selectable stage cards in a cream band below the panorama and left only neutral numbered markers over the illustrated route. Selecting a marker moves focus to the matching card; all stages keep equal visual weight, and selection does not imply completion or learner position. On phones the taller panorama remains above the text-first vertical stage list; the compact Grade 7 prompt stays clear of the markers.

Claude Max Opus 5.5 gave a read-only critique from a generic description of the artwork and layout; no source code, screenshots, assessment content, or learner data were sent. The Code workspace's whole-repository trust prompt was declined, and Claude reviewed only the supplied non-confidential design summary. Its key recommendation—move cards off the illustration and use linked, neutral markers—was implemented.

Rendered and inspected the Grade 7 page at 1440px and 390px. Verification covers the full Grade 3–12 roadmap browser/model suites after the layout update, plus `node --check boarding-roadmap.js` and `git diff --check`. Local only; no push, deployment, or Drive sync.


## 2026-10-30 learner roadmap presentation follow-up

Used the signed-in Claude Code CLI with the Claude Max Opus subscription for a read-only review of the public roadmap UI source. This is Max-subscription use, not an Anthropic API-key call. No private assessment items or student records were provided. Claude identified that pathway selection, measured position, and next-route choice were visually separated; its suggestions were used to add a responsive SVG dotted learning path, a prominent “not yet assessed” status, and a next-concept preview/action beside the path. The selected node is explicitly a preview, not a measured level. The Grade 7 prompt now describes selecting a concept; the unmeasured status lives in the adjacent panel. Mobile navigation keeps all three links visible.

Verification on the bundled Mac Node runtime: grade roadmap data and browser suites passed 16/16; changed roadmap JS passed `node --check`; `git diff --check` passed. HTTP-rendered 390px and 1280px views were visually inspected, and a 320px capture confirmed the navigation links remain visible. No horizontal overflow at 320, 390, or 1280px. This UI work remains local; no push or deployment.

Assessment and contest evidence flows have now been reviewed, and the roadmap shows grade-matched user-entered course evidence. The contest link now names both item-level review and AMC cycle records. A grade comparison now places the matching learner-selected course route beside the selected comparison-grade plan. Next: connect reviewed diagnostic focus evidence when a release-approved version exists, keeping numeric bands distinct from official placement and contest qualification. Do not derive public levels from the locked Grade 7 screener or unvalidated AMC cross-paper comparisons.

## 2026-10-30 Grade 11–12 roadmap bridge

Extended the public boarding roadmap from Grades 3–10 to Grades 3–12. Grade 11 and Grade 12 are explicitly labeled inferred examples because no grade-specific source plan was supplied. Their stages and annual plans begin with the learner's actual transcript, school course catalog, and prerequisites; they do not assume all students follow Precalculus → Calculus or another fixed order. Optional SAT and contest practice remains separate from school-course evidence. The AMC selector correctly presents AMC 12, not AMC 10, for Grades 11–12; families still need to verify current age/grade eligibility with MAA.

The inferred high-school content is limited to Common Core's conceptual categories (number and quantity, algebra, functions, modeling, geometry, statistics and probability), which do not define one grade-by-grade course sequence. Sources checked: [Common Core high school math standards](https://www.thecorestandards.org/wp-content/uploads/Math_Standards.pdf) and [MAA AMC program and eligibility](https://maa.org/student-programs/amc/). The 2026–27 MAA enrollment guide specifies grade and age limits, so the UI links families to current official rules rather than inferring eligibility from grade alone.

Verification on the bundled Mac Node runtime: `boarding-grade-roadmap.test.cjs` passed 7/7 and `boarding-roadmap-browser.test.cjs` passed 15/15, including Grade 11–12 inference/source labels, AMC 12-only option, 390px no-overflow, Grade 10 vs. 12 plan comparison, and existing Grade 7 interactions. Both changed JavaScript files passed `node --check`; `git diff --check` passed. Claude Max Opus read-only review was attempted twice on the public source/diff but returned no response and was interrupted; no Claude review approval is claimed. All changes remain local.

## 2026-10-30 high-school course comparison follow-up

The assessment-entry course selector now includes school-dependent Calculus, Statistics, and Discrete Mathematics options. It records only the chosen current and target courses; no middle course is auto-inserted and no fixed course sequence is implied. The copy now makes that boundary explicit. Grade 6 domain values retain their 6.* cluster mapping for the existing verified-material route; other grades keep only the learner-entered broad domain label and value without a Grade 6 cluster ID. Local v2 record storage accepts the nullable cluster marker, and old records with no selected target fall back to their current course when rendered.

Verification: external evidence engine, assessment-entry browser, and local-record suites passed 30/30. Grade 12 Algebra 2→Statistics selection, optional Calculus/Statistics choices, endpoint-only route, Grade 6-only cluster IDs, local persistence, ISEE restoration, and existing MAP/domain behavior are covered. No external score norm, learner level band, or school placement is inferred. Claude Max review remains unavailable in this run: both read-only CLI attempts returned no response; no independent review is claimed. Local only.

### Level-comparison evidence audit

The Algebra 2 screen uses its own 40-item test and GFIELD-internal reporting rules: a total band after at least 15 graded items (70% core target, 88% advanced target), with separate domain indicators. These are not validated boarding-school or cross-grade cut scores and must not be copied as if they were common norms. The Grade 7 `7.NS.A` screener contract explicitly excludes score cutoffs, mastery/strength/weakness thresholds, automatic assignment, and public execution; two reserved observations per focus are a blueprint minimum, not mastery evidence. The contest paper-review engine suppresses domain rates below three attempted items and compares only domains with enough evidence within that paper; its AMC history groups raw scores by contest and does not infer growth or readiness across papers. The next learner-comparison design should therefore preserve source, grade, diagnostic/form version, and denominators; compare observed domain/focus evidence only when the underlying item set is comparable; and label thin evidence as insufficient. Numeric grade bands remain out until a grade-specific approved policy and pilot evidence exist.

## 2026-10-30 private R6 workbench source repair

The private R6 teacher workbench generator was updated and rebuilt locally. Source fixes cover native button-group semantics, focus visibility/clipping, disclosure markers, English language tags, mobile instruction copy, short-viewport scrolling, long-string wrapping, and print generation on `beforeprint` with clearer non-distribution marking and pagination rules. Inline JavaScript syntax check passed. The private manifest now correctly marks rendered browser and current A4 visual QA as pending; Oct 29 browser/PDF captures are stale for R6.

Claude Max Opus UI-source review was attempted using sanitized HTML/CSS only (no candidate data). The first CLI call returned `Execution error`; a retry produced no output and was interrupted. No AI UI-review approval is claimed. R33 applies to the separate pilot-plan text only. Candidate content remains private and locked. Next work is still inspection of current R6 at desktop/390px and a fresh A4 export; the browser rejected the private `file://` route, so use user-supplied captures/PDF rather than a workaround.


Historical R4 desktop/390px screenshots were re-opened for reference. They show the intended list/preview flow but predate R6 and do not count as current visual QA. The old screen-visible watermark has been made print-only in source. Current browser/A4 evidence remains outstanding.

## 2026-10-30 roadmap and contest feature audit

Current source evidence: the roadmap's grade comparison places two grade-plan examples side by side and labels Grade 9 as inferred; it does not compare a learner's measured score/grade or assign placement. The competition-paper review accepts manually entered O/X/blank marks and optional domain/error labels for an already-scored external paper. It reports raw counts and cautious within-paper review cues; it has no answer key, official score, readiness/award/AIME estimate, learner history, or automatic course decision. The Grade 6 AMC 8 set remains topic practice, while the separate private Grade 7 42-candidate set remains locked pending human review and pilot approval.

Verification on 2026-10-30 with the bundled Mac Node runtime: roadmap and paper-review core tests passed 8/8. The associated browser test files could not load because `playwright` is not installed in this checkout; no browser-test pass is claimed. Current private R6 visual browser/A4 QA also remains pending under the recorded CUA security restriction.

## 2026-10-30 Grade 7 NS.A private-draft recheck

The external-root Grade 7 NS.A preflight was rerun against the existing private 18-slot pack: 14 automatic and 4 teacher-reviewed items; state remains `draft-pending-independent-review`, delivery locked, and both independent approval and mathematics verification false. Its separate exact-rational checker matched all 18 slots, the immutable plan contract, and three asset mappings. These are local structural/calculation checks, not independent human item review, rights approval, or release authorization. The Oct 29 revision-11 rendered QA notes remain current: initial 320px number-line arrows require horizontal pan; some asset typography and printed label alignment need review; the dense repeating-decimal prompt needs a separately reviewed content revision if changed. No candidate wording/assets changed during this recheck.

## 2026-10-30 Grade 7 AMC and NS.A continuation

The private R6 teacher workbench received Claude Max Opus R3–R7 sanitized-source reviews and repairs. The key defects included an incorrectly escaped whitespace search regex and a list-render index error; both are fixed, along with keyboard focus/state, validation order, and visible/printable failure handling. Generator and emitted script syntax checks and focused source assertions pass. R8 returned `Execution error`, so it is not treated as review evidence. The form remains 42 items, six per axis, private and locked. Current browser/A4/assistive-technology QA remains pending; CUA denied the private `file://` page under browser navigation policy.

Fresh Mac verification on 2026-10-30: six focused roadmap/competition/NS.A screener test files passed 26/26; the private AMC draft preflight passed (42 items, seven axes, six per axis); the private NS.A authoring preflight passed (18 slots, 14 automatic/four teacher, still locked and unapproved); and its exact-rational checker passed all 18 slots against the immutable plan/assets. These checks do not grant content, rights, human, or learner-use approval. The public roadmap still compares grade-plan examples rather than assigning measured grade placement; competition review summarizes teacher-entered scores and domain evidence without an official score or benchmark band.

## 2026-10-30 annual roadmap continuation

Added a grade-selected 12-month plan section to the public roadmap. Grades 6, 7, 8, and 10 show the four-stage plans and resource examples supplied in the conversation. Grade 9 has a distinct inferred label in its heading, note, and every period. Grades 3–5 keep their concept stages and explicitly say monthly plans were not supplied. The grade-comparison section and competition review retain their existing boundaries: planned grade examples and manually entered paper evidence only, with no learner placement or official competition level.

Claude Code CLI (Opus, Claude Max subscription, read-only diff review) flagged visitor-facing wording, an unused plan title, weak Grade 9 headings, and missing Grade 9 range assertions. Wording/headings and tests were updated; Claude also confirmed the hidden-state and responsive-border CSS behavior in the diff. It could not compare plan fidelity because the original plan text was not included in the review payload; source fidelity was checked against the user's messages in this conversation. Local Node verification passed six focused files, 27/27; both edited JS files passed `node --check`; `git diff --check` passed. Current browser visual verification remains unavailable under the recorded browser file-URL restriction, so no visual QA is claimed.

Follow-up: the existing grade comparison now includes annual-plan titles and each period's topic/description in both columns, with Grade 9 periods still marked inferred and Grades 3–5 explicitly showing no month-based plan. It also links to the existing external-evidence entry with the selected grade prefilled; this form can compare school Placement, MAP, CTP, SSAT, and ISEE evidence to current/target courses while keeping official placement to school policy. Browser tests were extended for the grade plan comparison and selected-grade link. Focused data/engine tests passed 34/34; JS syntax and `git diff --check` passed. Playwright is available through the bundled Node dependency path (set `NODE_PATH` to the bundled node_modules directory), and later continuation runs verified the roadmap browser suite. A read-only primary-source check found MAA's 2026–27 contest format and AIME qualification criteria are cycle-dependent; do not derive general learner grade bands from raw AMC counts. Current official reference: https://maa.org/student-programs/amc/ and https://maa.org/maa-invitational-competitions/ .

## 2026-11-02 Math Kangaroo past-paper route

Added a second official-source link to the roadmap's contest panel: after selecting Math Kangaroo, users can open the organizer's prior-year PDF exam archive alongside the existing test-rules page. It is hidden for other contests and opens in a separate tab with `noopener noreferrer`; no exam content is copied into GFIELD. The official archive describes prior exams as viewable/printable and provides a Grades 7 and 8 section: https://mathkangaroo.org/mks/practice/pdf-exams/ .

Verification: the Grade 3–12 roadmap model/browser suites pass 37/37, including the exact archive URL, selection visibility, switching back to AMC, and external-link protections. The bundled Node runtime passed syntax checking for the changed roadmap script; `git -c core.whitespace=cr-at-eol diff --check` passed. Local-only; no upload, sync, push, publication, or deployment. The private Grade 7 AMC 8 R6 candidate's current screen/A4 review gate remains open as documented in the continuation handoff.

## 2026-11-02 R6 structural recheck

Rechecked the private AMC candidate's nonvisual gates without changing the item pack: `validate-draft.cjs` reports 42 items, seven axes with six each, 14 per intended-difficulty label, four choices, English/Korean content, and locked delivery. The current generated review workbench's one executable inline script passes syntax parsing. File metadata confirms the prior screen captures/PDF still predate the Oct 30 current workbench rebuild. This does not close responsive browser, A4 visual, screen-reader/device, independent human math/language, rights/similarity, pilot, reporting-validation, or learner-authorization gates. No candidate content was sent externally or changed; no student use, sync, publication, or deployment.

The prepared R6 human-review packet and its separate temporary-ID mapping also pass a local consistency check: 42 unique temporary IDs are represented, no permanent candidate IDs or answer/key fields occur in the packet/mapping, and the mapping order matches the R6 form order. This confirms packet readiness only; no packet was transmitted and no human review is recorded.

## 2026-11-02 Math Kangaroo source-registry sync

The official prior-year PDF exam archive is now listed both in the K–12 competition profile and the shared program catalog, with the profile source marked verified on 2026-11-02. This keeps the in-app Grade 7/8 archive link aligned with the source-of-record and preserves the existing metadata-and-links-only rights boundary. Combined Grade 3–12 roadmap, browser, comparison, competition-profile, and question-bank suites pass 50/50; both changed JavaScript modules pass syntax checks and the CRLF-aware diff check passes. Local-only; no exam content was copied.

## 2026-10-30 AMC raw-score reference continuation

The public manual contest-paper review now shows a clearly labeled reference raw score only when all 25 marks are entered for AMC 8/10/12. AMC 8 uses correct-count out of 25; AMC 10/12 use 6 points per correct and 1.5 per blank, with wrong answers 0. Other contests, partial inputs, and non-25-question tests do not produce this score. It is not an official score, contest level, award/AIME prediction, or school placement; the report links to the current 2026–27 MAA scoring policy and tells users to follow the selected test's instructions. MAA's 2026–27 policy PDF (updated Oct. 30, 2026) confirms these formulas for U.S./Canada administration; international participants should follow their local organizer's instructions. MAA overview/teacher pages describe AMC age caps as “under” a half-year threshold, while the new 2026–27 policy PDF says “or younger”; the UI now tells families to confirm the age boundary in current MAA guidance rather than imply a resolved cutoff.

The Claude Max Opus read-only diff review flagged the JS cache-busting version, ambiguous blank-response label, stale module comment, and “unanswered” metric copy; all are fixed. The result boundary was narrowed so it does not imply that every contest receives a raw-score estimate. Focused Node verification on the Mac runtime passed 38/38 tests, three JS syntax checks and `git diff --check`. With the bundled Playwright dependency exposed using `NODE_PATH`, the Grade 7 paper-review and roadmap browser suites passed 14/14; desktop and 390px screenshots were reviewed, including the estimate card and mobile layout. The browser's existing `file://` restriction remains; tests use a local temporary HTTP server. This score-reference change is local and uncommitted as of this handoff update; do not push or publish.

## 2026-10-30 AMC attempt-history comparison

Added a separate session-only AMC 8/10/12 score-record comparison to the public paper-review screen. It accepts a cycle, form, date, and manually transcribed score-report raw score, groups and sorts entries within the same contest, and supports a validated JSON export/import so families can keep a file without server or browser persistence. The archive excludes student names and item responses, rejects unknown fields, duplicate IDs, invalid contest scales/forms/dates/cycles, and is capped at 100 records / 100KB. It deliberately shows no cross-paper score deltas, level, growth, difficulty adjustment, school placement, award, or qualification verdict.

For 2026–27 AMC 10/12, the form displays the MAA fixed AIME threshold (AMC 10: 100/150; AMC 12: 85/150) and minimum-age-13 condition only after the user explicitly selects the US/Canada MAA route. Selecting International AMC instead shows the official International Group Leader guidance without a threshold. The actual saved score records do not infer region or attach a qualification result. AMC 8 has no AIME threshold context. The older manual-item score estimate remains a separately labeled historical formula reference; the actual paper instructions govern.

Updated `docs/AMC_COMPETITION_DIAGNOSTIC_GATES_2026-10-29.md` to distinguish descriptive score records and region-selected official cycle context from the still-locked GFIELD diagnostic bands and predictions. Claude Max Opus read-only review found and prompted fixes for duplicate-import messaging, region-specific threshold display, keeping form selections between entries, primary-button contrast, print scope, and live-region verbosity. Unit tests passed 9/9, paper-review + roadmap browser tests passed 15/15 (including 320px overflow, import/export, duplicate imports, region gating, and AIME context), JS syntax checks and `git diff --check` passed. Desktop and 390px rendered screens were visually inspected. Source checks: MAA 2027 AIME announcement https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/ , current invitational eligibility https://maa.org/maa-invitational-competitions/ , and AMC International guidance https://maa.org/amc-international/ . This feature is local and not yet committed; no push or deployment.

### Accessibility follow-up (2026-10-30)

Success announcements now use a separate polite status region with green styling; validation failures stay in the alert region. Deleting a history entry clears stale announcements and returns focus to the next entry or section title. Official cycle context is only rebuilt when its content changes. If the optional score-history module is unavailable, the original paper-review tool remains usable and the history section is hidden. The AIME link label now names the 2027 MAA announcement explicitly. MAA's 2027 AIME announcement confirms AMC 10 ≥100 and AMC 12 ≥85 to register, subject to other eligibility requirements including age 13+; the invitational policy page confirms fixed thresholds and separate IGL policy for international participants. References: https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/ and https://maa.org/maa-invitational-competitions/ .

Latest local verification on 2026-10-30: focused Node tests 43/43; paper-review + roadmap browser tests 17/17, including status/focus behavior, print scope, 320px–844px overflow, and graceful operation when score history is unavailable. Changed JS syntax checks and `git diff --check` passed. Claude Code CLI Opus via the existing Claude Max subscription performed a read-only review; its actionable notes about separating success/error messages and restoring focus were addressed. One Claude run claimed test results without executing them, so only local test commands above are relied on. Committed locally as `f46bc477`; no push or deployment.

## 2026-10-30 cross-grade concept-flow map

Added the four concept progressions supplied in the conversation to the public Grade 3–10 roadmap: arithmetic to AMC 10 algebra manipulation; ratio/rate to coordinate geometry; parity to AMC/AIME combinatorics; and sequences to AIME number theory. Each path is an ordered five-step example, rendered once as an accessible ordered list. The copy explicitly says this is a concept-connection reference, not a learner position or mastery result. At widths up to 1100px, the map uses one card column; on phones, each path stacks vertically. Claude Max Opus read-only review identified mid-width card compression, mobile arrow alignment, and two test-scope/style improvements; these were fixed and coverage now includes 320, 390, 900, and 1280px plus title/note non-overlap. Latest roadmap checks passed: data tests 7/7 and browser tests 8/8; JS syntax and `git diff --check` passed. Committed locally on the current branch; no push or deployment.

## 2026-10-30 external-score comparison safety update

Reworked the public school-assessment result so it records the reported metric and comparison context, then shows the user-selected current-to-target course path. Removed internal score bands, confidence labels, the arbitrary 70% domain cutoff, and score-derived weeks/day/problem prescriptions. School Placement comparison now reports only whether the entered school cutoff was met; school policy still determines actual course placement. Domain values are displayed in ascending order as entered report values, not diagnosed weaknesses. ISEE Quantitative Reasoning and Mathematics Achievement stanines remain separate; no averaged stanine is calculated. Assessment-linked learning plans use the learner-selected study priority rather than deriving one from this external score.

This follows primary-source interpretation guidance: NWEA says RIT is grade-independent and does not itself imply a grade-level achievement label; NWEA and ERB percentiles are tied to their stated norm/reference groups. Sources: https://connection.nwea.org/s/article/Comparing-RIT-scores-across-grade-levels , https://www.nwea.org/map-growth-norms/ , https://www.erblearn.org/ctpscorereporthelp/ . External-evidence storage schema is now v2. A safe v1 migration restores only recoverable score-report input fields for user verification; old readiness labels, course recommendations, weak-domain rankings, and study prescriptions are discarded. Legacy ISEE averages are not restored into either stanine field. No scores or student records were sent to Claude.

Claude Max Opus read-only review was attempted on the public engine source but produced no output for over a minute and was interrupted; no review findings are claimed. The code was changed against official source descriptions and tested locally. Focused engine/storage and assessment-entry/learning-plan/roadmap browser tests passed 44/44. Four changed JavaScript files passed `node --check`; `git -c core.whitespace=cr-at-eol diff --check` passed. Local only; no push or deployment.

### Legacy score-summary restoration follow-up (2026-10-30)

The assessment-entry page now detects a saved v1 external score summary and pre-fills only report values that can be recovered. It does not regenerate or show a comparison until the user verifies the evidence and submits again; the screen asks them to confirm or supply missing season/norm group, current/target course, and domain values. Old course/readiness/weakness/study-plan outputs are omitted. A v1 ISEE summary had combined two stanines, so neither ISEE stanine is guessed from that average. Added unit and browser coverage. One adjacent test had an obsolete expected empty-state string; its assertion now matches the current UI label `진단 결과 없음`.

Focused Mac verification passed 62/62 across external-score engine/storage, assessment entry, learning-plan, Grade 3–10 roadmap, AMC score history, and competition review suites. Both edited JavaScript files passed `node --check`; CRLF-aware `git diff --check` passed. Claude Max Opus authentication is active, but the sanitized-source code review attempt produced no output for 30 seconds and was interrupted; no finding is claimed for that review. A later narrow Claude geometry check did return a response. Official MAA search did not identify a general AMC 8 score cutoff or grade-level award band suitable for learner comparison. Keep AMC 8 at descriptive historical/raw score and item-evidence level; do not add inferred grade labels or readiness bands. Local only; no push or deployment.

### R6 independent AI solve cross-check (2026-10-30)

Codex independently solved the private R6 blind packet and matched 42/42 mapped keys. Forty were genuinely solved before the private ID/key map was loaded; two keys were exposed during initial workspace inspection and are explicitly marked non-blind. A separate Claude Max Opus read-only review of the only flagged geometry interpretation found the stem determinate as written and no required edit. The private report is stored outside Git in the candidate folder. These are AI checks only; the item ledger's independent human math/language, age-fit, distractor, rights/similarity, current R6 browser/A4, and pilot gates remain pending. Form remains locked.

## 2026-10-30 comparison and contest-review usability follow-up

Claude Max Opus reviewed a sanitized description of the public grade-comparison and contest-review interactions. It identified two actionable clarity gaps: optional domain/error tags did not show their evidence denominator, and mobile grade comparisons put complete grade plans one after another. The Grade 3–10 comparison now pairs corresponding topics and periods in each mobile row while retaining the two-column desktop view; Grade 9 inference context appears once in the mobile comparison. Contest results now show how many questions had a domain and error reason assigned, explain why an incomplete AMC paper has no reference raw score, and distinguish unentered questions from unanswered ones. No diagnostic bands, readiness or placement predictions were added.

The focused roadmap, paper-review, and browser suites passed 30/30. Updated scripts passed `node --check`; `git diff --check` passed. Desktop and 390px captures were visually reviewed; the mobile comparison keeps both grades visible per row, and the result screen shows the denominators and incomplete-score explanation. This work remains local; no push or deployment.

Follow-through verification also passed the existing assessment-entry and learning-plan browser suites 13/13. An additional 390px browser sweep checked every ordered pair among Grades 3–10 (56 comparisons): no horizontal overflow, each row retained both grade values, and all comparison periods/categories rendered without generic fallback headings.

The public-exposure audit was also run, but did not complete its full-history scan: the local partial clone is missing a promisor object and lazy fetch is disabled. No historical privacy-audit pass is claimed; no fetch or remote sync was initiated.

Separately, Codex recorded a second blind-solve review of the private Grade 7 NS.A revision-11 candidate outside Git. All 14 auto-scored keys matched; the four teacher-scored responses were checked against their open-response requirements. The exact-rational checker and locked-state preflight pass. This is AI cross-check evidence only and does not replace human review, rights review, current pilot acceptance, or release approval. The candidate remains locked.

## 2026-10-30 assessment evidence on boarding roadmap

Connected the existing local external-assessment record to the roadmap's learner panel. For an exact grade match, the panel displays the user-selected assessment source, test date, and manually selected current-to-target course route. It does not repeat raw scores, derive grade bands, infer placement, or show a record from another grade. Malformed, legacy, missing, and other-grade records use the empty state. The comparison form remains the place to inspect source-specific score details. No candidate/private diagnostic data are read or sent.

Mac verification passed 41/41 across roadmap, external-assessment, local-record, and grade-data unit/browser suites. A real local browser flow entered a school Placement result and Pre-Algebra → Algebra 1 route, saved it, and confirmed the Grade 7 panel display; switching to Grade 8 correctly returned to the empty state. JS syntax and CRLF-aware whitespace checks passed. The empty state was visually inspected at 390px and 1280px with no overflow. Claude Code CLI using the signed-in Claude Max Opus subscription was invoked for a read-only sanitized UI review, but returned no findings before the attempt was interrupted; no Claude review approval is claimed. Committed locally as `ab448820`; no push or deployment.

## 2026-10-30 assessment route beside grade-plan comparison

The Grade 3–10 comparison view now adds a paired panel below the two grade plans. Its left side reads only the locally saved external-assessment record that exactly matches the selected current grade and shows the user-selected current → target course route, assessment source, and date. Its right side shows the selected comparison grade's roadmap title and core plan. With no matching assessment it shows an input link instead; changing the current grade cannot carry the previous grade's record into the comparison. It does not expose the raw test score, infer course fit, or assign a grade band. The comparison label works for any selected grade pair, not only the next grade.

The end-to-end browser test entered and saved a school Placement result, compared Grade 7's route with the Grade 8 plan, then changed the current grade and confirmed the Grade 7 evidence was not reused. The assessment-entry, local storage, roadmap browser, grade-data, and external-score unit suites passed 41/41; changed JavaScript syntax and CRLF-aware diff checks passed. Visual captures of the populated comparison at 390px and 1280px showed both columns readable and stacked on mobile. This remains local; no push or deployment.

## 2026-10-30 assessment history continuation

Expanded the single local external-assessment slot into a bounded history of 30 sanitized records. Each record keeps its own source, grade, test date, reported score units, norm/season when supplied, domain entries, and manually selected course route. Saving the same source + grade + test date updates that entry instead of duplicating it. A previously saved modern single record is migrated into history on first read; legacy summaries are not migrated into comparison history, and legacy input restoration is limited to the matching grade when no modern history exists. The entry page lists records newest first, labels device-local storage, and provides one action to clear history. Opening the page with a grade restores only that grade's newest record; the roadmap also selects evidence from the requested grade's history.

Assessment entry and roadmap browser tests cover Grade 7/8 record separation, previous-record migration, grade-specific restore, route loading on the roadmap, and clear behavior at 390px. The focused final suite passed 44/44; the three changed JavaScript files passed `node --check`; `git diff --check` passed. Read-only Claude Code CLI Opus review was attempted using the signed-in subscription, but did not return findings during the review window, so no Claude review approval is claimed. The changes remain local pending commit; no push or deployment.

The comparison panel now reads an independent saved record for each selected grade. When both grades have evidence, it displays each assessment source, date, and user-selected course route side by side; when one side has no record, it continues to show that grade's roadmap plan and offers a grade-prefilled assessment link. The 11-case roadmap browser suite passed after this change, including the two-record route comparison and mobile-width checks. No score normalization, readiness band, or placement inference was introduced.

## 2026-10-30 saved AMC diagnostic connection

The item-level contest review now offers an explicit “save summary to this device” action after the user enters an exam date and reviews results. The bounded local history stores grade, contest, date, paper memo, aggregate outcome counts, domain-level correct/attempted/blank counts, and user-selected error-reason counts. It strips question-level answers and does not retain raw-score estimates. The roadmap shows only the newest diagnostic matching both its selected grade and contest; domain rates remain suppressed below three attempted questions. A single saved record can be removed from that roadmap card. The UI keeps contest diagnosis separate from awards, AIME qualification, score normalization, and course placement.

Focused storage, review, roadmap, evidence-engine, and grade-roadmap checks passed 50/50, including save opt-in, answer-free persistence, exact grade matching, and a 390px no-overflow assertion. Changed JavaScript files passed `node --check`; `git diff --check` passed. Data remains local; no API sync or publication was performed.

The contest review page now also lists saved diagnostic summaries chronologically, with domain denominators and per-record deletion. The page shows rates only when at least three questions were attempted in that domain, and does not align scores across papers. Browser coverage confirms the list appears after opt-in save, can be deleted, and remains within 390px. The README's entry-point descriptions were updated to match local storage and comparison behavior.

## 2026-10-30 MAP grade comparison and ISEE persistence repair

Claude Max Opus read-only reviews identified an ISEE persistence defect and clarified that MAP Growth Math RIT is the only current external metric with a documented cross-grade vertical scale in this UI. ISEE Quantitative Reasoning and Mathematics Achievement stanines are now retained separately by the evidence engine and local-storage sanitizer; saved records restore their source-specific inputs, course route, season, and domains. Older ISEE records with no separate values display em dashes rather than `null` or `undefined`. The MAP season field now starts as “not confirmed from report” rather than silently defaulting to Fall.

The Grade 3–10 plan comparison now reads each grade's latest MAP record independently of the grade's latest other-source record. If both grades have MAP Growth Math RIT values, it shows dates, explicitly reported seasons, both RIT values, and their arithmetic difference. It does not calculate percentile differences, expected growth, mastery, or placement; mixed-source values are not combined. The comparison keeps the user-entered course routes alongside the score evidence.

Focused Mac browser and unit coverage passed 41/41 across assessment entry, grade roadmap, evidence engine, and local-record suites. This includes ISEE save/history/reload, MAP RIT same-scale comparison, mixed-source suppression, unknown season, and 390px overflow. Changed JavaScript passed syntax checks and `git diff --check`. Official NWEA source checked: the RIT scale is grade-independent, while test content differs across grade forms; this supports comparing the numeric scale while explicitly avoiding claims about untaught content or grade-level mastery. Claude Max Opus performed two read-only code reviews; its actionable findings were fixed and the second review found no blockers. This remains local; no API key, cloud sync, publication, or push was used.

## 2026-10-30 contest diagnostic record comparison

Added a side-by-side view of the two newest date-confirmed AMC/contest diagnostic records for the exact grade and contest selected on the roadmap. Each record keeps its own paper label/date, correct/wrong/blank/unmarked counts, classification denominator, and domain correct/attempted counts. Domains with no attempts show “미측정”; attempt rates remain withheld below three. Date-missing records are excluded from this pair so save time cannot make them look like a dated test. Cards identify recent vs previous and are labelled for assistive technology. Copy explains that paper difficulty is not adjusted and differences are not growth or skill level.

Claude Max Opus review confirmed the interpretation and denominator fixes, then found an undated-record ordering edge case and asked for stronger responsive column assertions. Storage now sorts dated assessment records before undated records; the latest dated result stays primary even if an undated entry was saved later. The pair view also lists each paper's classified error reasons beside its domain counts. Expanded browser coverage includes two dated AMC 8 papers plus a synthetic undated record with a later save timestamp; it checks answer/blank/domain denominators, reason counts, low-sample suppression, exact-grade filtering, card accessibility labels, 1/2-column layouts at 390/768/1280px, and no overflow at all three widths. The long paper-label test exposed a mobile overflow in the latest-record metadata, fixed with wrapping. Focused competition-review, roadmap and local-record suites passed 38/38. Claude Max read code but did not run tests; Codex ran the browser/unit suite. No push, deployment, cloud sync, or private-item access.

## 2026-10-30 contest-path eligibility wording

The grade menu's AMC choices are learning-path suggestions, not an MAA eligibility check. The selected AMC guidance now tells families to confirm that cycle's age and grade rules at MAA; other contests point families to the organizer's current rules. The manual grouped summary now states that domain counts are entered by the user and that its rates cannot establish a grade band, eligibility, award, or qualification.

The official MAA AMC overview was checked 2026-10-30 for current grade/age eligibility language: https://maa.org/student-programs/amc/ . Focused grade-roadmap unit and browser suites passed 22/22; `git diff --check` passed. Claude Max Opus was invoked twice for read-only review: the first session could not access the local files, and the supplied-excerpt attempt returned no review. No Claude review approval is claimed. Local only; no push, publication, or private-item access.

## 2026-10-30 roadmap section navigation

The Grade 3–12 page now has a sticky, keyboard-accessible shortcut bar for Growth Map, Monthly Plan, Grade Comparison, and Contest Records. It follows the current section while scrolling and uses scroll offsets so sticky navigation does not cover the destination. The quick links preserve the existing single-page content and screen-reader structure.

Visual review used the actual Grade 7 page at 1280×900 and 390×844; the shortcut bar fit both widths and page width matched the viewport. Existing GFIELD design rules and the local UI/UX Pro Max responsive/accessibility guidance were consulted. The reference `math-skill-map` research page is a separate repo and was not changed. `boarding-grade-roadmap.test.cjs` plus `boarding-roadmap-browser.test.cjs` passed 23/23, including section hash, active state, destination offset, mobile overflow, and prior navigation flows. Changed HTML/JS/CSS whitespace checks pass. Local only; no publish or deployment.

## 2026-11-02 Math Kangaroo Grade 7–8 paper comparison

Connected Math Kangaroo manual review summaries to the answer-safe local diagnostic store, which previously accepted AMC/SASMO IDs but rejected `kangaroo`. The roadmap comparison now names the official grade-specific ranking boundary while comparing only same-date, same-paper-memo raw review summaries. It does not calculate grade equivalence or growth. A browser scenario saves the same 30-question Grades 7–8 paper for both grades and verifies paired cards, denominators, the grade-specific rank note, and no mobile overflow. Official basis: https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/ .

Verification: roadmap browser, local-record, competition-profile, and question-bank suites pass 60/60. All work remains local; no original contest questions or student data were added. Private R6 visual and human-review gates remain open in the continuation handoff.

## 2026-11-02 Math Kangaroo official paper-band guard

The official archive groups prior student papers into paired grade bands (including Grades 7–8, 9–10, and 11–12). Math Kangaroo cross-grade review now requires the selected grades to belong to the same official paper band as well as matching date and paper memo. A 7-vs-9 test with identical date and memo is rejected with an explanation; 7-vs-8 remains comparable. Official sources: https://mathkangaroo.org/mks/practice/pdf-exams/ and https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/ .

Verification: Grade 3–12 roadmap model, roadmap browser, and answer-safe local-record suites pass 56/56. Mobile and desktop comparison views were visually inspected with sample records. Claude Max CLI review could not run because the local CLI session is not logged in; no Claude review is claimed. Local-only; private R6 and human-review gates remain open.

Cache-busting versions were also bumped on every HTML page that loads the updated shared diagnostic store, roadmap options, or comparison renderer. The same 56/56 suites were rerun after those HTML changes; CRLF-aware whitespace checks pass.

## 2026-11-02 user-provided Prealgebra reference check

Reviewed the user's private Prealgebra concept-companion PDF through Drive. Its PDF text layer is readable and its Unit 1 concept sequence corroborates the existing optional Prealgebra-to-Algebra 1 flow. No OCR was needed; no original lesson text, exercises, answers, or Drive link were copied into the public repository. No roadmap edit was needed from this source check.

### 2026-11-02 Grade 6 Prealgebra concept bridge follow-up

Made the supplied Grade 6 roadmap connection more explicit: the optional Prealgebra-to-Algebra 1 bridge now names substitution, exponents, and order of operations before operation properties, distribution, and combining like terms. The Grade 6 first-quarter example also names variable expressions and powers alongside its existing number, geometry, and data foundations. This remains an illustrative concept path, not a placement result or fixed pace.

Verification: Grade 3–12 roadmap model/browser tests pass 38/38. The flow was visually inspected at 390px and 1280px; all five stages remain readable without clipping. Changed JS passes `node --check`; CRLF-aware `git diff --check` passes. Local-only; no push or deployment. Current private R6 visual review, independent human math/language and rights review, pilot, reporting validation, and student-use approval remain open.

### 2026-11-02 roadmap preview button styling

Connected the existing journey-preview button class in the roadmap markup. This restores the already-defined G·MAP plum button treatment and visible keyboard focus styling; no new palette or interaction was added. The full Grade 6 and Grade 7 roadmap pages were visually reviewed at mobile width, with the Grade 6 control also checked at 1280px. No horizontal overflow was observed.

Verification: the roadmap model/browser suites pass 38/38, including the button's computed color and 42px target height. `boarding-roadmap.js` passes `node --check`; CRLF-aware `git diff --check` passes. Local-only; no push or deployment.

### 2026-11-02 Grade 7 NS.A public contract recheck

Re-ran the public `7.NS.A` diagnostic engine, locked screener plan, authoring/release manifests, analysis, role-separated report projections, and four-teacher-review readiness checks on the current branch. All 50 tests pass. They confirm the 18-slot plan remains answer-free and locked, the hypothetical report path cannot gain placement authority, and partial teacher review does not release a score. This verifies public contracts only; it does not inspect or approve private candidate items or authorize operational delivery.

Next required work remains independent formal review and release evidence for the separate private `7.NS.A` candidate before the authenticated 18/4 delivery adapter can be implemented. Keep the diagnostic locked. No private candidate content or student data was accessed; no remote sync or deployment occurred.

### 2026-11-02 public roadmap and contest comparison regression

Re-ran the Grade 3–12 roadmap model/browser, contest paper-review model/browser, answer-safe local learning record, and official K–12 contest profile suites on the current local branch: 88/88 pass. Coverage includes same-paper Math Kangaroo comparison for paired grade bands, grade-specific official ranking boundaries, unmatched-paper suppression, domain/error summaries, local answer-free saves, and grade-plan comparisons that do not infer placement. This is public functionality verification only; it does not make a contest diagnostic valid or unlock the private `7.NS.A` screener. No private item content or student record was accessed.

### 2026-11-02 roadmap and public diagnostic continuation

The Grade 10 roadmap now links MAA's current 2027 AIME entry notice and Invitational Competitions overview. The concept-flow section also gives the supplied AMC/AIME study sequence (concepts → topic practice → mixed problems → timed past papers) and advises adjusting pace when interest drops. At the time of this 11/2 entry, Grade roadmap model/browser tests passed 40/40 and the new sequence was checked at 320/390/900/1280px with 16px mobile body text, but screenshot review had not yet occurred. The 11/3 visual follow-up below completes public-roadmap screenshot review via a temporary localhost preview; no private file route or alternate surface was used.

Fresh regression on the current branch passes 76/76 across the public 7.NS.A screener/workbook contracts, AMC/contest review analysis and browser flows, and teacher paper-builder/A4 flows. This confirms public behavior and locked-state contracts only. A subsequent 81/81 public Grade 7 workbook/diagnostic contract run passed across the engine, answer-safe workbook, plan, analysis, report/readiness, release and projection checks; it does not inspect either private candidate. The private Grade 7 AMC 8 R6 candidate remains locked pending current screen/A4 artifacts, human math/language and rights review, pilot, reporting validation, and release gates. The separate private Grade 7 `7.NS.A` screener has its own independent gates. See `boarding-school-math/docs/CONTINUATION_HANDOFF_2026-09-09.md` for details. Latest roadmap map/UI implementation checkpoint: `b3461cfb7` (G·MAP palette refresh, mobile map strip, and mobile comparison/contest readability); local only, no push, deployment, or Drive sync.

### 2026-11-03 AMC/AIME roadmap visual QA

Served the public roadmap from the existing local worktree over a temporary localhost preview and visually inspected the new AMC/AIME study sequence and concept-flow cards. Desktop (1280×900), mobile (390×844), and narrow mobile (320×780) remain legible; mobile body text is 16px. At 320px, inspection found the global header-nav gap from `academy-ui.css` overrode the roadmap's original mobile gap, extending the navigation 2px beyond the content viewport. Added a more specific ≤360px gap rule and bumped the roadmap CSS cache version. After the fix, document scroll width equals client width at 320px (305px due to the visible scrollbar) and 390px (375px); the narrow view has no horizontal page scroll. Also visually checked the Grade 7/8 comparison at 1280px and 390px: two plan columns on desktop, readable stacked comparison on mobile, and an unmeasured grade is labelled as a plan example. Separately inspected the AMC 8 item-review screen at 390px and 320px: unmarked rows stay compact; marking a response wrong reveals both concept-domain and error-reason inputs on mobile, and the 320px document has no horizontal overflow. This was an unsaved synthetic mark in a temporary browser tab; no learner record was stored. This preview covered public UI only. No private candidate content was opened; no release, sync, or deployment occurred.

### 2026-11-03 public regression and private review access

The non-browser roadmap, contest-analysis, local-record, and competition-profile suites pass 41/41 on the bundled Mac Node runtime. A combined browser regression emitted 90 passing tests and no assertion failures, but both browser suites remained pending in teardown; the run was stopped after 261 seconds and is not counted as a complete browser-suite pass. Opening the local `file://` route in the in-app browser was rejected by its URL security policy; no alternate route or rendering workaround was attempted. Current-version desktop/mobile captures and A4 PDF from an authorized path are still needed to inspect the private Grade 7 AMC 8 R6 workbench (42-item contest candidate). The supplied roadmap mockups are design references, not current candidate QA evidence. This is separate from the private Grade 7 `7.NS.A` unit screener (18 slots, 14 automatic/four teacher-reviewed), which has its own independent content, rights, pilot, reporting, and release gates. Both candidates remain locked. No OCR, private content access, external API call, sync, push, or deployment occurred.

The separate 18-item private `7.NS.A` revision-11 pack does have its own answer-free render QA set. Its current SHA-256 matches the pack hash in `private-layout-qa-revision11-20261029.md`, which documents Korean/English/Simplified-Chinese 320px/390px/A4/Letter inspection and six 18-page PDFs. Findings and remaining independent human, rights, screen-reader, pilot, and release gates are recorded in the detailed continuation handoff. Do not conflate these current-for-pack unit-screener artifacts with the stale AMC 8 R6 workbench captures.

### 2026-11-03 Grade 10 aspirational score goals

The Grade 10 roadmap now includes the supplied AMC 12 130+ and Digital SAT Math 800 goals as optional personal challenges, with explicit wording that the roadmap does not predict scores or AIME/USAMO selection. The plan distinguishes AIME entry from USAMO selection and keeps USAMO-style proof practice optional. MAA's current 2027 AIME notice and Invitational FAQ were checked; both describe the current AMC-to-AIME entry thresholds and the 2027 AIME-score-based Olympiad selection framework. Sources: https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/ and https://maa.org/maa-invitational-competitions/ .

Verification: Grade roadmap model suite passes 10/10; changed roadmap data and the browser-test file pass Node syntax checks; `git diff --check` passes. The updated browser assertion was not run in this continuation; no current screenshot or print review was performed for this public copy change. Local only; no push or deployment.

### 2026-11-03 Grade 8 advanced topic coverage

Expanded the provided Grade 8 annual example to name Algebra 2 topics from the supplied roadmap: quadratics, exponential/logarithmic functions, and optional complex numbers, sequences/series, and matrices. The Geometry stage now explicitly keeps the school course in sequence and names trigonometry, circles/ellipses, transformations, and proof. The focus track keeps AMC 10/12 and AIME-style work optional; Algebra 2 extension is conditioned on readiness. This preserves the source's content without implying these topics are required for every Grade 8 student.

Verification: roadmap model suite passes 11/11; roadmap data and both test files pass Node syntax checks; `git diff --check` passes. Mobile browser assertions were updated but not run; visual layout for this longer copy remains unverified. Local only; no push or deployment.

### 2026-11-03 Grade 7 annual plan specificity

The Grade 7 year plan now makes the supplied tracks concrete: Algebra 1 names variable expressions, linear equations, inequalities, and explaining equality properties; school Geometry remains on the regular course path; AMC 10 is introduced as a readiness-based option; and SAT practice connects advanced algebra/geometry word problems with data interpretation. The final period asks learners to time only prepared-scope AMC/SAT-style practice and record whether a concept, idea, or calculation caused difficulty. It remains a learning example, not a placement result.

Verification: roadmap model suite passes 12/12; changed roadmap data and both test files pass Node syntax checks; `git diff --check` passes. Mobile assertions were added but not executed, so rendered layout remains unverified. Local only; no push or deployment.

### 2026-11-03 Grade 7 plan boundary clarification

Clarified that the Grade 7 annual-plan example does not assess a learner's current level or assigned course. The note now explicitly separates the roadmap example from diagnostic placement.

Verification: Grade roadmap model suite passes 12/12; changed roadmap data syntax check and `git diff --check` pass. Browser/visual and print checks were not run. The private R6 current captures/A4 request refers to evidence needed for visual review of the locked workbench; none was supplied, so that review remains open. This entry's commit contains the implementation and handoff update; local only, no push or deployment.

### 2026-11-03 roadmap and contest diagnostic browser regression

Enabled the competition paper-review browser suite to use the same optional `GFIELD_CHROME_EXECUTABLE` override already supported by the roadmap suite. The Mac has Playwright's Chromium revision 1234 but this checkout requested revision 1200; the installed Chrome executable was used for this run. Updated one Grade 8 browser expectation to match the current displayed course copy (“Geometry는 학교 과정에서 이어가요”).

Verification: roadmap model/browser and paper-review analysis/browser suites pass 69/69 in a single run, including grade comparisons, MAP same-scale handling, same-paper competition comparison, Math Kangaroo paired-grade links, and mobile reflow checks. Public Grade 7 NS.A workbook/screener-plan/authoring-manifest/analysis/report/scoring/release contracts pass 61/61. Changed tests pass syntax checks and `git diff --check`. This is automated public regression only; it is not a fresh screenshot or print review of private R6. Candidate remains locked; local only, no push/deployment.

### 2026-11-03 teacher paper builder mobile list flow

On phones, the 36-row question list and selected-question list now grow with the page instead of creating nested scroll areas. The fixed selection-count shortcut to paper settings remains available. The builder's browser test can use `GFIELD_CHROME_EXECUTABLE` when the Playwright-pinned Chromium revision is absent.

Verification: teacher paper-builder browser suite passes 11/11, including all 12 public unit worksheets, answer-key separation, A4 pagination, mobile/tablet width checks, and the new assertion that all 36 rows remain in normal page flow at 390px. Rendered and inspected the current mobile page; all 36 rows appear in sequence, page width equals viewport width, and no clipping was visible. Print source was unchanged; browser A4 generation tests passed. Local only; no push or deployment.

### 2026-11-03 A4 print sample visual review

Generated a temporary A4 student-paper sample from three selected public Grade 7 workbook items with the formal cover. The PDF contains one cover and two numbered question pages. Rendered and inspected every page: title, date/time/points, question visuals, choices, margins, watermark, and page numbers are legible; no overlap, clipping, blank page, or missing glyph was observed. The temporary PDF and page renders are removed after QA. This validates the public paper builder's print route only; it does not provide visual evidence for the separate private Grade 7 AMC 8 R6 workbench or the private 7.NS.A screener.

### 2026-11-03 private candidate identity and QA artifact recheck

Corrected an earlier handoff association: the private R6 `review-workbench.html`, `candidate-form-order.json`, and requested desktop/mobile/A4 visual QA belong to the 42-item Grade 7 AMC 8 contest candidate at `/Users/docssam/Documents/Codex/GFIELD-private/boarding-school/grade7-amc8-20261029`. They do not belong to the separate 18-slot private Grade 7 `7.NS.A` unit screener at `/Users/docssam/Documents/Codex/GFIELD-private/boarding-school/grade7-nsa-20261017`.

Metadata-only check on 2026-11-03 confirms the AMC candidate's desktop, 390px and 320px screenshots and A4 PDF are still timestamped 2026-10-29 22:24:17, while its current review workbench is timestamped 2026-10-30 02:59:31. They predate the current workbench and cannot close its visual gate. No private item content was opened. The AMC R6 candidate and the 7.NS.A screener both remain locked pending their own independent review and release requirements; no user file delivery or approved browser route was received in this turn.

### 2026-11-03 Math Kangaroo official within-grade percentile comparison

Math Kangaroo review now accepts the nationwide percentile copied from the official score report, stores it with the answer-free local review summary, and shows it beside each grade's same-date/same-paper review card. When both paired Grade 7/8 records have official percentiles, the roadmap reports the difference in percentile points and states that this compares relative position within each grade cohort; it is not a growth or math-skill comparison. Inputs outside 0–100 are rejected, and the field is hidden for other contests. Official scoring basis: https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/ (grades receive separate state and nationwide rankings/percentiles; verified 2026-11-03).

Verification: public browser flow on a local preview saved synthetic Grade 7 (72.5%) and Grade 8 (81%) records for the same date/paper, displayed +8.5 percentile points and the interpretation boundary, and suppressed no matching information. Checked the form at 390px; document width matched the viewport. Confirmed the field hides for AMC and rejects 100.1. No browser console errors. `git diff --check` requires CRLF-aware handling for `learning-plan.html`; all authored content changes are tracked in the intended one-line cache-version update. The repository Node/Playwright test suite could not run because this Mac execution environment has no Node/Bun binary. Synthetic records were entered only in the localhost preview origin and the two test records were removed after review; no real learner data or contest items were used. Local only; no push, publication, Drive sync, or deployment.

### 2026-11-03 verification follow-up after Math Kangaroo percentile source refresh

Found and fixed a stale source-freshness assertion that still expected every Math Kangaroo source to use the older general verification date. The scoring-page reference is now explicitly accepted at its 2026-11-03 verification date, while the prior-paper archive and MAA entries retain their separate dates.

Verification: Grade 3–12 roadmap, contest review analysis, local diagnostic storage, and competition-profile model suites pass 36/36. Public Grade 7 NS.A/workbook contracts pass 81/81. A first browser run found an optional-percentile helper passing `undefined` for Grade 9; the helper now skips that optional input. The full roadmap and contest-review browser suites pass 49/49 with Playwright 1.62.1 restored under `/tmp` from the lockfile using verified package integrity and the already-installed Chrome executable. `git diff --check` and changed-test syntax checks pass. No project dependencies or lockfiles changed. Private candidate state remains locked and untouched; local only.

### 2026-11-03 G·MAP branded learning map refresh

Recolored the shared learning-world illustration to G·MAP's violet/lavender and cream palette while preserving the connected study islands and math landmarks. Added an optimized 1800×720 version at `boarding-school-math/assets/roadmap/mathematics-learning-world-gmap.webp`; the original remains available. The Grade 7 guidance prompt now sits inside the illustrated map without obscuring route stops. Phone layouts retain their text-first vertical path.

Verification: the Grade roadmap browser suite passes 31/31, including branded map use across Grades 3–12, Grade 7 prompt placement and overlap checks, and responsive widths. Rendered and inspected the 1280px desktop preview; `git diff --check` passes. No private candidate content or learner data accessed; local only, no push or deployment.

The next map pass placed each grade's scenic route before the curriculum-detail cards, so the new branded artwork appears earlier on desktop. The Grade 8 desktop preview now shows the map before the school/contest/SAT detail and concept bridge; this does not change any grade content or learner-status claims. The same 31/31 browser suite now asserts this ordering across Grades 3–6 and 8–12, alongside the existing mobile and map checks.

### 2026-11-03 mobile map-label readability

Raised selectable route labels to 16px and stop numbers to 14.4px on phone layouts. The Grade 3–12 roadmap browser suite passes 31/31, including the mobile type-size assertion, keyboard selection, all-grade branded-map use, and responsive layout. Inspected Grade 7 at 390px and 320px; labels are 16px and the document has no horizontal overflow at either width. Local only; no push or deployment.


### 2026-11-03 G·MAP map palette and phone presentation

Replaced the shared route artwork with a higher-contrast G·MAP version: deep-violet path, ivory island surfaces, lavender math forms, and restrained sage trees. The image was created with the built-in image tool from the previous map composition, has no labels or logo, and is optimized as a 1983×793 WebP (186 KB). Desktop keeps route stops over the islands; phones show the panorama as a 2.5:1 strip above the vertical route. Mobile grade-comparison descriptions and contest guidance/domain labels were also enlarged.

Verification: the Grade 3–12 roadmap browser suite passes 33/33, including map coverage for all grades, mobile map-strip asset/size, comparison text size, contest guidance size, and 320px/390px no-overflow. Local renders were visually reviewed at 1280px, 390px, and 320px; stop cards remain legible over the art and route names remain in vertical flow on phones. `git diff --check` passes. Code and asset were committed locally as `b3461cfb7`; no push, deployment, or Drive sync.

### 2026-11-03 shared Pre-Algebra reference integrated

Read the user-provided `AmysMathConcepts_Prealgebra_Complete_Unit1.pdf` through its embedded text; it was not a scan, so OCR/Apple Vision was unnecessary. Updated the optional concept-flow example to follow its Unit 1 progression: build/evaluate variable expressions → exponents and order of operations → translate words into expressions → operation properties → distributive property → combine like terms. The note identifies this as a source-informed example, not a grade placement or diagnostic result. No exercises or answer keys were copied.

Verification: Grade roadmap model tests pass 12/12 and Grade 3–12 roadmap browser tests pass 33/33, including the 320px/390px/tablet/desktop concept-flow layout. `git diff --check` passes. This applies only to the public learning map; the separate locked private candidates remain under their recorded independent review gates. Local only; no push, deployment, Drive sync, or external API call.

### 2026-11-03 contest review and official-source recheck

Rechecked MAA's current AMC overview and 2026–27 Invitational guidance. The public manual paper review still limits itself to user-entered marks, self-selected domains/error reasons, descriptive within-paper comparisons shown only when each compared domain has at least three attempted items, and a conditional raw-score reference; the three-item display rule is not a validated diagnostic threshold. It does not infer an AMC/AIME level or placement. Current AMC source verification dates are updated to 2026-11-03. The 2027 AIME score thresholds remain cycle-specific and require age 13 plus other eligibility; the UI only displays threshold progress for matching US/Canada MAA contest, form, date, and cycle records and does not decide eligibility.

Verification: current roadmap/contest/profile/model suites pass 34/34, browser suites pass 51/51, and current source/catalog contract suites pass 16/16. A synthetic AMC 8 review was also rendered at 1440px and 390px; mobile page width remained 390/390 and the temporary entry left local storage empty. The skip link seen in full-page capture was offscreen in the actual viewport, with focus on the result heading. `git diff --check` passes. A requested read-only Claude review could not start because Claude Code CLI reports `Not logged in`; no Claude findings are claimed. No private candidate or student data was read. Local only; no push or deployment.

### 2026-11-03 Grade 6–7 annual-plan resource links

Added source-matched online links to each of the four Grade 6 and Grade 7 annual-plan stages. Grade 6 links point to AoPS Prealgebra, Khan Academy Pre-algebra, AMC 8 practice, Beast Academy 5D, Khan Academy Digital SAT, and College Board SAT question-bank/practice pages. Grade 7 links point to AoPS Introduction to Algebra, FlippedMath Grade 7 geometry, MAA AMC information, Khan Academy Digital SAT, and College Board SAT practice. Resource names remain alongside the original plan examples; links open in a new tab with `noopener noreferrer`. Link styling uses the existing G·MAP violet and has visible keyboard focus. No resource links were inferred for Grade 9.

Primary source checks: AoPS textbook pages describe the Prealgebra and Introduction to Algebra scope; Khan Academy labels its Digital SAT prep as an official College Board partnership; College Board's Student Question Bank provides SAT Math questions; Beast Academy lists its 5D book; MAA provides AMC program information. AMC practice archive link is AMC Trainer, a third-party archive, and is labeled as practice rather than an official MAA resource.

Verification: the changed data module imports successfully in the Node REPL and focused assertions confirm all 8 Grade 6–7 stages have titled HTTPS resources while Grade 9 remains unlinked. The roadmap renderer parses through its safe early-return path. Opened the local page in headless Chrome and inspected Grade 7 at 1280px and true 390px device emulation; desktop and mobile annual-plan links render in the G·MAP violet style, three of seven Grade 7 links appear in the first mobile viewport, and `scrollWidth` equals `clientWidth` at 390px. Chrome's rendered DOM confirms four linked stages for each of Grades 6 and 7. Scoped `git diff --check` passes. The standard Node and Playwright test suites were not run because the shell has no `node` binary and the in-app browser automation API returned `browser.user is unavailable`; test assertions are present but pending execution. No candidate data or private assessment items were accessed. Local only; no push or deployment.

### 2026-11-03 follow-up: bundled runtime regression and cross-grade rendering

Found the Mac Node and Playwright bundled with the ChatGPT app and used the installed Google Chrome through `GFIELD_CHROME_EXECUTABLE`. The Grade 3–12 roadmap model/browser suites pass 46/46. Competition practice, competition original-link contract, contest profile, placement engine, and public Grade 7 NS.A plan/authoring/analysis/report/scoring/release/workbook suites pass 80/80. Competition paper-review browser tests pass 18/18. Total related regressions: 144/144.

The broader run exposed that `competition-practice-browser.test.cjs` did not accept the installed Chrome override and failed to start Playwright's absent pinned Chromium 1200. Added the same optional executable override used by the other browser suites and guarded cleanup after startup failure; its six browser checks now pass. This changes test startup only, not the contest practice product. A direct Chrome protocol sweep rendered Grades 6, 7, and inferred Grade 9 at 1280px and true 390px widths: every Grade 6–7 stage has secure HTTPS links, Grade 9 receives no invented resource links, G·MAP artwork is present at both breakpoints, and document scroll width equals content width.

`node --check` and scoped `git diff --check` pass. Private Grade 7 `7.NS.A` and AMC R6 item candidates remain locked; the public suites validate release boundaries and do not satisfy independent item, rights, accessibility, pilot, or release approvals. No private item content or learner records were accessed. Local only; no push/deployment.

Metadata-only Google Drive recheck searched for the AMC R6 desktop/mobile captures, its current A4 review PDF, and the Grade 7 NS.A revision-11 review record; all four searches returned no results. No files were downloaded or opened. Current candidate evidence and approval state remain unchanged.

### 2026-11-03 GFIELD Precalculus course and horizontal fraction rendering

Added the original GFIELD Precalculus student/teacher A4 workbook and pathway entry. The course has five units, 15 lessons, and 30 original practice prompts: function structure/transformations; polynomial and rational graphs; exponential/logarithmic and sequence models; unit-circle trigonometry; vectors, complex numbers, and model selection. It is scoped to named Common Core high-school function, algebra, vector, and complex-number standards. Grade placement and sequence remain school-dependent; limits and calculus are not taught.

Updated the shared inline math renderer to stack symbolic numerator and denominator content on a horizontal rule. It now handles Greek/Korean labels, π-variable products, radicals, absolute-value factors, and parenthesized products such as `x(x+2)`. It preserves rate notation (`km/h`, `m/s`) and contest names (`AMC 12/AIME`) as literal slash text. All six HTML consumers load cache version `20261103-11`.

Verification: 18/18 focused course/pathway/roadmap model assertions pass. Three focused Chrome workbook checks pass for Geometry, Algebra 2, and Precalculus; these confirm horizontal-bar CSS, the `2π/|B|`, `πt/6`, `−√3/2`, Korean trig ratio, and nested algebraic denominator cases, plus student/teacher page counts. A separate 11/11 focused roadmap browser check passes for grade comparison, same-paper Math Kangaroo records, high-school route comparison, and course links. The full roadmap browser suite was not rerun to completion. No print-to-PDF review was performed. No private item data was opened. Local-only; no push or deployment.

### 2026-11-03 Grade 7 course links use GFIELD originals

Replaced the Grade 7 Algebra 1 and Geometry checkpoint materials that previously linked to external course pages with the matching GFIELD-original A4 workbooks. The annual-plan references now point to these same courses. Common Core standard references and MAA competition guidance remain separate source links; no course order or grade placement is inferred.

Verification: Grade 3–12 roadmap model tests pass 12/12; focused Chrome checks for the Grade 7 checkpoint links and Grade 6–7 annual-resource links pass 2/2. Internal course links open in the same tab and use the existing keyboard-visible link treatment. No private item data was opened; local only, no push or deployment.

### 2026-11-03 Grade 6 Pre-Algebra path uses GFIELD learning material

Updated the optional Grade 6 annual example to lead with GFIELD's 10 original concept lessons, six reviewed public Grade 6 unit-workbook topics, and the separate 10-question GFIELD AMC 8 practice set. The remaining four Grade 6 workbook drafts are still pending independent review and are not linked as public resources. The SAT foundation stage links to GFIELD ratio/problem-solving concepts and the College Board's official Math question bank. MAA and College Board references remain labeled as sources, not GFIELD-authored material. Replaced displayed AoPS/Beast Academy/PWN labels in the Grade 6 example; the optional enrichment plan stays separate from school placement. Grade 10's final stage still uses the existing generic “proof practice · selected contest problems” resource description; it has not been replaced by a GFIELD workbook claim.

Verification: Grade 3–12 roadmap model tests pass 12/12, including assertions that Grade 6 resources resolve to GFIELD concepts/workbooks and original AMC 8 practice. A focused Chrome annual-plan check passes 1/1; it follows the 6.EE.A concept link and AMC 8 practice link to their actual pages. Local-only; no push, deployment, or Drive sync.

### 2026-11-03 Roadmap grade and contest comparisons rechecked

Rechecked grade-route comparison, manual AMC 10 domain-entry diagnosis, same-paper/same-date contest-record comparison, Math Kangaroo Grade 7–8 paired-paper comparison, upper-grade planning boundaries, and mobile contest labels. Updated two stale browser assertions so they match the current Grade 9 roadmap wording and browser-rendered line breaks; no private diagnostic content was opened.

Verification: focused Chrome checks pass 5/5; roadmap model tests pass 12/12. This verifies the current comparison and manual-diagnostic flows, not a calibrated readiness/placement score. Local-only; no push, deployment, or Drive sync.

### 2026-11-03 Correct Grade 6 public-workbook count and route

Audited the Grade 6 annual-plan wording against the current release inventory. The earlier “10 topic workbooks” label counted private drafts as public resources. Replaced it with the ten public concept lessons and the reviewed public `6.EE.A` workbook (36 items), and linked the lesson and workbook separately. The four unreleased Grade 6 workbook drafts remain pending review and are not offered as public material. Updated the README to state this boundary.

Verification: Grade 3–12 roadmap model tests pass 12/12. Focused Chrome annual-resource check passes 1/1; it follows the 6.EE.A concept link to its lesson, the workbook link to the public unit workbook, and the AMC 8 practice link to its page. `node --check` and CRLF-aware `git diff --check` pass. Local only; no private item data opened, no push, deployment, or Drive sync.

### 2026-11-03 Recheck full roadmap browser suite

The full Grade 3–12 roadmap browser suite exposed one stale course-link test: it expected the Grade 7 Algebra 1 annual-plan link to navigate to the roadmap's inline course section, while the current link correctly opens the standalone GFIELD A4 workbook. Updated the test to verify the actual workbook page and then separately verify the inline course overview. No application behavior changed.

Verification: the full Grade 3–12 model and browser suites pass 51/51. This includes Grade 6 released-material links, Grade 7 Algebra 1/Geometry original workbooks, grade/contest comparisons, contest-record boundaries, mobile layouts, and the 7.NS.A public workbook route. No private diagnostic candidate was opened or modified. Local only; no push, deployment, or Drive sync.

Additional release-boundary check: competition paper-review and practice model/browser suites pass 36/36. The Grade 7 `7.NS.A` public workbook, screener plan/analysis, authoring and release manifests, teacher reports, and scoring-readiness suites pass 61/61. The public contracts continue to show the unit screener as locked and non-placement with teacher reviews pending. This does not inspect, approve, or release private item candidates.

### 2026-11-03 Reconcile Grade 6 public-resource counts across home and course views

Updated the home page, Grade 6 skill map, Pre-Algebra course card, and diagnostic QA notice to distinguish ten public concept lessons from the six reviewed public unit workbooks. The four unreleased workbook drafts are no longer counted as available materials. The diagnostic notice now distinguishes those public study resources from diagnostic-driven assignment, which remains locked. Updated the course-map test for the five Algebra 2 areas and its original workbook route, and made the browser harness use the installed Chrome override with safe cleanup after launch failure.

Verification: course-path model tests pass 2/2 and the full home/SASMO browser suite passes 7/7, including Grade 6 availability copy, direct course links, accessibility, and mobile overflow. The 51/51 Grade 3–12 roadmap suite and 36/36 competition review/practice suite remain passing from the same working version. No private diagnostic item candidate was opened or changed. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Stack fractions in roadmap checkpoint text

The shared fraction renderer was already used by the GFIELD course workbooks and roadmap's `setText` helper, but Grade 7 checkpoint prompts were inserted with `textContent`, leaving any `a/b` math as a slash. Route those checkpoint prompts through the shared renderer so the numerator and denominator stack over a fraction bar; the accessible fraction label remains available. The course workbook browser check also confirms Algebra 1's rational coordinate values render as stacked fractions.

Verification: the full roadmap browser suite passes 39/39, including Algebra 1, Algebra 2, Geometry, Precalculus, Grade 7 checkpoint, and responsive layout checks. Local only; no private candidate data accessed, no push or deployment.

### 2026-11-03 Prealgebra Unit 1 Korean learning objectives

Aligned the optional Prealgebra Unit 1 flow with curriculum wording: “문자를 사용해 대수식을 나타내고,” “식의 값,” “동치인 식,” “대수식 전개,” and “동류항을 결합.” This keeps the six supplied concept steps while making the student-facing labels explicit about the mathematical action and object.

Verification: Grade 3–12 roadmap model suite passes 12/12; the four-viewport (320, 390, 900, 1280px) concept-flow browser check passes 1/1. No placement or diagnostic claim added. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Keep mathematical fractions distinct from counts

Visual review of the full Grade 9 roadmap exposed that the shared math formatter was turning stage progress `1 / 4` into a stacked fraction. Keep stage progress and competition classified/attempted summaries as ordinary count text. Preserve the contest label `AMC 10/12` as slash notation while retaining stacked rendering for actual fractions. Bumped the shared renderer and roadmap script cache keys on all six consumers so open browser tabs fetch the updated code.

Verification: all 39 roadmap browser checks pass, including the 320/390/900/1280px concept flow, stage count, competition count summaries, AMC 10/12 label, and stacked fractions in Algebra 1/2, Geometry, and Precalculus. The roadmap checkpoint routing check passes 1/1 after the new AMC-label assertion. A local 390px Chrome render confirms stage text `단계 1 / 4`, zero fraction nodes in that label, and no horizontal overflow. No private item content was used. Local only; no push or deployment.

### 2026-11-03 Fraction rendering in teacher paper output

The teacher paper-builder regression check revealed that the shared renderer rejected `3/2x` in a coefficient context because it treated the following variable as part of a word boundary. It now renders the unambiguous trailing single-variable form as a stacked `3/2` followed by `x`; explicit compound denominators still use parentheses. Updated the answer-key browser assertion to check accessible fraction readings and preserved units instead of the source slash string, which is no longer visible after formatting. All six shared-renderer consumers now load cache version `20261103-13`.

Verification: teacher paper-builder browser suite passes 12/12, including question search/selection, actual stacked answer choices, separate answer-key fractions, A4 page fitting, and mobile/tablet overflow. No diagnostic candidate content or learner records were used. Local only; no push or deployment.

### 2026-11-03 Stack fractions in Grade 7 rate diagrams

Extended the fraction-bar treatment into the Grade 7 `7.RP.A.1` unit-rate diagram. Its distance and time quantities now use stacked numerator/denominator markup, matching the prompt and answer choices; the `km/h` unit label remains conventional slash notation. Updated the public workbook cache keys and added a browser regression assertion for the printed question diagram.

Verification: teacher paper-builder browser suite passes 12/12. A print-media A4 render of the public `g7rpa-w01` item visually confirms both diagram fractions are stacked and legible without clipping. Local only; no private diagnostic content used, no push, deployment, or Drive sync.

### 2026-11-03 Preserve multi-character units in shared fraction rendering

Cross-course A4 visual review found the shared fraction renderer splitting the Algebra 1 unit rate `달러/km` after the first denominator letter, producing a misleading stacked fragment. Restricted the optional trailing-variable case to numeric or parenthesized denominators; `3/2x` remains a stacked coefficient while unit text stays intact. Bumped all six HTML consumers to math-renderer cache version `20261103-14` and added a regression case for `달러/km`.

Verification: Grade 3–12 roadmap, teacher paper builder, Algebra 1, Geometry, Algebra 2, and Precalculus model/browser suites pass 59/59. Print-media A4 samples across the four original course workbooks show stacked fractions without page overflow; a fresh Algebra 1 teacher page confirms `달러/km` stays intact and coordinates render as stacked fractions. Local-only; no private item content used, no push, deployment, or Drive sync.

### 2026-11-03 Math fraction display and 2027 AIME reference

Routed concept-flow headings and steps through the shared math-text renderer, so actual numeric or algebraic fractions use a stacked numerator, fraction bar, and denominator instead of slash text. Existing labels such as AMC 10/12 and stage counts remain ordinary text. The Grade 8 and Grade 10 AIME practice stage now links to the official MAA 2027 eligibility page and distinguishes AIME-style study from exam eligibility; the note is explicitly tied to the 2027 U.S./Canada rules and directs other years/regions to their organizer.

Verification: Grade 3–12 roadmap model tests pass 12/12 and browser tests pass 39/39, including Grade 7 fraction checkpoints, AMC 10/12 notation, concept flows, and responsive layouts. `node --check` and CRLF-aware `git diff --check` pass. Local only; no push, deployment, or Drive sync.

### 2026-11-03 live Grade 7 fraction and Grade 9 route check

Opened the current local Grade 7 `7.NS.A` student workbook in Chrome at 390×844. The page rendered MathML fractions with stacked numerator and denominator (`mfrac` elements present), preserved the progress count as `0 / 36`, reported no page errors, and stayed at 390/390 document width. Opened the inferred Grade 9 route at 1280×900 and 390×844: both sizes retained the “학교 과목 확인” label and school-sequence note, with no horizontal overflow or page errors. This is a live screen render, not a saved-PDF review.

Checked Claude Code authentication after the prior review attempt: the CLI remains logged out. No candidate content was sent. The Grade 7 private diagnostic and AMC R6 independent-review gates remain open.

### 2026-11-03 Grade 7 NS.A roadmap now opens GFIELD material

Removed the two FlippedMath lesson links from the Grade 7 `7.NS.A` checkpoint now that GFIELD's own student workbook is available. Kept the Common Core source link for standards scope; the separate student action opens the GFIELD 36-question workbook in Korean with A4 selected. The external FlippedMath lesson pages remain source examples in the handoff only and are not the learner destination.

Verification: roadmap model tests pass 12/12 and browser tests pass 39/39. In a live 390×844 Chrome session, the checkpoint exposed only the official standards link plus the local GFIELD workbook action; opening it loaded all 36 questions at 390/390 document width with no page errors. `git diff --check` passes. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Grade 7 AMC 10 manual-diagnostic path

Ran the public Grade 7 AMC 10 flow in a temporary 390px Chrome session with synthetic domain counts only. The selector exposes AMC 10, renders separate Algebra, Number Theory, Geometry, and Combinatorics rows, produces a descriptive partial result, and the item-review link opens `competition-paper-review.html?grade=7&program=amc10`. The report states that entered domain rates do not yield an official score, skill level, eligibility, qualification, or course decision. Document width stayed 390/390; no browser errors occurred. No learner record or private candidate content was used, and no input was saved.

### 2026-11-03 Grade 7 AMC 10 concept practice and stacked fractions

Added a GFIELD-authored AMC 10 topic-practice page and linked it from the Grade 7 optional 4–6 month enrichment route. The 12 original questions cover algebra, number theory, geometry, counting, and probability; each includes a hint, worked solution, and a question about the reasoning. The page separates concept/type/connection practice from official-paper timing, links MAA for the published AMC scope, and states that the practice does not determine skill, placement, score, or qualification. No contest questions were copied. Fraction answers and worked calculations render with stacked numerator, fraction bar, and denominator; literal progress counts and unit/contest slash text remain unchanged.

Verification: live local browser shows all 12 questions and 60 choices, and computed fraction layout includes a visible 1px numerator rule. Screenshot review confirms stacked probability choices. A wrong answer leaves remaining choices available; a correct retry updates progress; the topic filter works and answered state persists after returning to all topics. The current browser layout had no horizontal overflow at 1265px desktop and 375px mobile. Added a browser regression assertion for the fraction bar. Automated Node tests were not run because Node/npm/bun are unavailable in this Mac shell. No private candidate content was opened. Local only; no push, deployment, or Drive sync.

Follow-up verification on this Mac supersedes the runner note above: the bundled ChatGPT Node 24 and Playwright 1.62.1 were found and used with the installed Chrome executable. The current full roadmap model/browser suite passes 53/53.

### 2026-11-03 Original AIME-style practice path

Added `boarding-school-math/aime-practice.html` with 12 original GFIELD-created short-response problems across Algebra, Number Theory, Geometry, and Counting. The concept → type → connection sequence is labeled as a study structure, not an AIME level. Each prompt has a 0–999 integer answer field, retryable self-check, hint, worked solution, and connection question. Actual fractions in worked solutions use the shared stacked numerator/bar/denominator renderer. Domain and stage filters work; attempt state stays in memory only and is not a learner record. Grade 8 AIME enrichment and Grade 10 AIME-preparation course stages now open this local page. MAA is linked only for the published response format and contest/eligibility information; this page does not reproduce official timing or question count and cannot diagnose ability, placement, or eligibility.

The answer sum for multiples of 3 or 5 was caught during solution review and corrected to 2,418 before final validation. Browser checks confirm all 12 expected answer values, input bounds, retry, filters, hint/solution disclosures, fraction display, and desktop/mobile overflow. The full Grade 3–12 roadmap model/browser and AIME page browser suites pass 53/53. A fresh 1280px render was visually inspected; the 390px render and no-overflow behavior were checked in browser automation. No private Grade 7 candidate content or learner records were opened. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Preserve grade context across contest-practice routes

The AMC 10 original practice route now carries the learner's selected Grade 7 or 8 context into its roadmap and item-review links. The shared AIME-style practice page carries Grade 8 or 10 context and switches its related AMC link to AMC 10 topic practice or Grade 10 AMC 12 paper review accordingly. Annual and stage links now pass the selected grade explicitly; the practice bank remains shared across grades without implying placement or readiness.

Verification: tested all four grade contexts, related links, and return labels. A stale browser expectation for the Grade 7 query string was corrected. The full Grade 3–12 roadmap model/browser plus AIME page browser suite passes 54/54. `node --check` and `git diff --check` pass. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Show AIME practice fractions with a fraction bar

The AIME practice page loaded the shared math-text renderer but omitted its stylesheet, so fractions did not receive the stacked numerator, bar, and denominator presentation. Added the shared fraction CSS and browser assertions for both inline-grid stacking and a visible numerator border.

Verification: the AIME practice browser test passes 1/1, including actual rendered fraction styles, answer validation, filters, explanations, and responsive layout. `git diff --check` passes. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Add manual AIME paper review and same-paper grade comparison

Added an optional 15-item AIME review choice to Grade 8+ contest diagnostics, based on the current MAA question/response format. The entry is for a user-marked AIME or personal practice set; the interface links the official MAA page and explicitly does not decide invitation, eligibility, or selection. It uses the existing four-area review taxonomy, stores only aggregate marks, and produces no AIME score or level. Grade comparisons require same date and paper memo and remain unadjusted descriptive summaries. Local-record validation accepts AIME only for Grade 8+ and retains no response-level data.

Verification: roadmap, paper-review analysis, and local-record model tests pass 40/40. Competition paper-review browser suite passes 19/19, including Grade 8/9 same-date/same-paper comparison, no AIME score estimate, MAA source visibility, and answer-free saved summaries. Official format reference checked at https://maa.org/maa-invitational-competitions/ on 2026-11-03. No private diagnostic items or learner records were used. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Current high-school course and comparison audit

Rechecked the active public routes after the local Algebra 2, Geometry, and Precalculus workbooks were added. Grade 8 optional Algebra 2/Geometry, inferred Grade 9 Algebra 2/Geometry/Precalculus, and Grade 10 Precalculus resources now resolve to GFIELD-authored workbooks; remaining outside links are official standards, assessment practice, or contest organizer references. Grade-to-grade comparison keeps inferred plans labeled, compares MAP RIT only on the same vertical scale, keeps CTP/SSAT/ISEE source values separate, and requires a matching date and paper memo for contest marks. No numeric grade band or course-placement verdict is derived from those records.

Verification: the full roadmap, high-school course model, and course-pathway/browser suites pass 59/59 on the current Mac worktree, including Algebra 2/Geometry/Precalculus workbook routes and comparison behavior. The AIME-specific competition browser suite independently passes 19/19. No private diagnostic candidates or student records were accessed. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Review stacked fractions in A4 workbook output

Visually reviewed fresh Chromium print-media captures from the public Pre-Algebra student workbook cover and a fraction lesson, plus the matching teacher solution page. Fractions display with a stacked numerator, visible horizontal bar, and denominator in student prompts and teacher explanations. Text is legible with no clipping or overlapping in the sampled pages. The cover retains the name/class/date fields and standards note. This was a visual sample of the rendered pages, not a saved or distributed PDF; the lesson page has generous unused writing area by design.

Verification: captures `/tmp/gfield-prealgebra-a4-student-page1.png`, `/tmp/gfield-prealgebra-a4-student-fraction.png`, and `/tmp/gfield-prealgebra-a4-teacher-fraction.png` reviewed individually. The relevant current roadmap, Pre-Algebra, course-pathway, and paper-builder browser/model suite passes 75/75; JavaScript syntax and `git diff --check` pass. No private diagnostic items or learner records were used. Local only; no push, deployment, or Drive sync.

Follow-up: created temporary Chromium A4 PDFs for the Pre-Algebra student and teacher editions and rendered page 5 from each. Both are true A4 (594.96 × 841.92 pt), 59 pages, with stacked fractions and their bars intact on the printed lesson and worked solution; the text is legible and the page number is present. These are QA outputs in `/tmp`, not publication files. Also re-ran the updated Grade 3–12 roadmap model/browser, learning-plan browser, and course-pathway suites: 68/68 pass. Fresh 390px screenshots of the Grade 7, 8, and 10 annual-plan sections show the revised copy and linked materials without card overflow or browser errors; the page-width assertions remain zero-overflow. No private candidate content or learner records were used.

### 2026-11-03 Check public contest review against current organizer rules

Compared the published competition profiles and learner-facing review flow against the current official MAA 2026–27 rules (updated 2026-10-30), MAA AMC overview, and Math Kangaroo USA's format and scoring pages. The current model matches AMC 8/10/12 question counts, durations, age/grade limits, topic scope, and scoring; the AIME progress note remains cycle- and region-specific. Math Kangaroo keeps paired question-paper bands separate from official per-grade rankings and accepts a reported within-grade percentile instead of manufacturing a GFIELD percentile. No model change was needed.

The targeted contest and route regression initially found one stale AIME browser assertion: it expected an older comparison sentence. Updated the test to assert the current, more explicit message that records are paired by entered date/memo and that same paper identity, difficulty adjustment, and growth/level are not verified or inferred.

Verification: competition-paper-review browser, contest-analysis, AMC-score-history, competition-profile, and competition-practice suites pass 48/48 on current Chrome. Official references: https://maa.org/wp-content/uploads/2026/10/2026-2027-AMC-8-10-12-Policies.pdf (2026–27 MAA rules, updated 2026-10-30), https://maa.org/student-programs/amc/, https://mathkangaroo.org/mks/faqs/about-the-test/, and https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/. No private item content or learner record was accessed. Local only; no external API, push, deployment, or Drive sync.

Revalidated the public Grade 7 `7.NS.A` assessment and learning contract on the same branch: diagnostic engine, learning-delivery and item-release contracts, screener plan/authoring/analysis/report/scoring/readiness/release manifests, and the student unit workbook pass 80/80. The tests keep the 18-slot diagnostic locked and answer-free, require bound teacher review, reject automatic placement, and verify the separate public workbook. Private revision-11 content was not opened or changed; independent review, pilot, and release authorization remain open.

Additional print QA on the released public Grade 7 `7.NS.A` workbook generated temporary Korean A4 student and teacher PDFs in `/tmp`. The student PDF has 12 pages; the teacher edition has 20. Rendered page 4 from each: signed fractions in prompts, choices, diagrams, and worked teacher solutions retain stacked numerator/bar/denominator layout with no clipping or page overflow. The full unit-workbook browser suite passes 50/50, including all three locales, both audiences, A4/Letter print layout, and checks for slash-form numeric fractions. These are disposable QA files, not distribution copies.

### 2026-11-03 Grade-comparison display audit

Used synthetic, unsaved MAP Growth examples to inspect the Grade 7/8 plan and evidence comparison at 1280px and 390px. The screen keeps the side-by-side course roadmap separate from the entered results; it shows same-scale RIT difference and only shows percentile-point difference when norm year, season, and instructional week match. The copy asks the family to verify that both records belong to the same learner and says the comparisons do not determine expected growth, mastery, level, or course placement. Other assessment sources and contest records remain separate panels. Both widths had no page overflow or browser errors; no learner data was entered or persisted.

### 2026-11-03 Grade 10 proof-writing workbook

Added an original GFIELD proof-writing workbook for the Grade 10 10–12 month stage and linked it from that annual-plan period. The student and teacher editions share eight prompts covering direct proof, inequality reasoning, contrapositive, divisibility, counterexample, triangle congruence, coordinate geometry, and contradiction. Student responses are not saved or scored. The teacher edition presents one model explanation per prompt; it is not a unique required solution. The roadmap now names the stage “주장을 근거로 설명하기” and describes its focus using claim, evidence, counterexample, and proof strategy language.

Verification: Grade roadmap model tests pass 12/12 and the full Grade 3–12 browser suite passes 44/44 (56/56 total across model and browser suites). The annual-plan link, student/teacher switch, five stacked mathematical fractions, and no page overflow at 1280px or 390px are covered. Student and teacher A4 PDFs both render as 3 pages; the student edition has writing space and the teacher edition shows solutions. Printed coordinate midpoint and rational-number examples use stacked fractions. Visual review at desktop, mobile, and PDF found no clipping; print layout uses two questions on page one and four on page two. No learner assessment or private candidate content was used. Local only; no push, deployment, Drive sync, or external API use.

Follow-up math review: made the nonzero-divisor condition explicit in the divisibility claim and model proof (“0이 아닌 정수 d”). Grade roadmap model tests still pass 12/12 and the focused student/teacher workbook browser test passes 1/1.

Open project gates remain unchanged: the private Grade 7 7.NS.A diagnostic is locked pending independent review, pilot, immutable release, and release authorization; the private Grade 7 AMC 8 R6 candidate remains locked pending its independent-review path. Continue public roadmap and original learning-resource work without opening or sending private candidate text.
