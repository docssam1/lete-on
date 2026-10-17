# Grade 7 `7.NS.A` local QA — 2026-10-13 to 2026-10-14

Status: **local candidate only; not committed, pushed, deployed, catalog-published, or approved for placement/promotion use**.

## Implemented candidate

- 36 original GFIELD-authored workbook items:
  - 10 rational addition/subtraction
  - 8 number-line, opposite, and absolute-difference items
  - 10 signed multiplication/division
  - 4 terminating/repeating decimal items
  - 4 contextual rational-operation items
- Eight recheck items with eight distinct structure identifiers.
- Korean, English, and Simplified Chinese learner-facing prompts and choices.
- Separate student and teacher rendering through the existing HTML workbook generator.
- The workbook's concept link targets its embedded concept pages instead of the Grade 6-only concept library.
- Unique completion key: `gfield-unit-workbook:7.NS.A:v1`.
- Shared `geometry/worksheet/render.js` primitives for SVG wrapping and coordinate formatting. Rational point positions are calculated from declared numerator/denominator data.
- Grade 7 curriculum-catalog integration for `7.RP.A` and `7.NS.A`, with role- and locale-preserving workbook links. The action is a distinct 46px control rather than an inline text link.
- A separate answer-free `7.NS.A` unit-screener plan reserves 18 locked slots: two observations for each of nine granular focuses, with a 6/6/6 difficulty balance. It explicitly forbids placement, promotion, competition prediction, automatic prescription, and workbook-item reuse.

## Verification evidence

- Focused content tests: 9/9 passed.
  - independent BigInt rational arithmetic
  - exact one-answer cardinality
  - nonzero division checks
  - reduced-denominator 2/5 factor classification
  - independent long-division prefix check
  - exact calculated number-line `cx/cy` positions and direction
  - direction-arrow paths begin at the exact declared point coordinates and use independently checked bounded endpoints
  - no target/answer point in student SVG
  - context-operation symbols preserve the declared order while the result stays blank
  - two `7.NS.A.2c` items independently verify distinct commutative/associative-inverse and distributive-property strategies
  - visual accessibility labels are mathematical and localized in Korean, English, and Simplified Chinese
  - the recheck signed-rate context independently verifies `−9/4 ÷ (−3/8) = 6` minutes and avoids a negative count of groups
  - teacher solutions show each declared operation and exact result rather than a generic answer sentence
  - displayed negative integers use the mathematical minus sign `−`, not an ASCII hyphen
- Existing Grade 7 proportionality plus new Grade 7 number-system tests: 13/13 passed. The final `7.NS.A` focused suite is 9/9 after the property-strategy, coordinate, context-visual, formal-decimal, localized-accessibility, and teacher-solution assertions were added.
- The eight recheck items bind eight different structure IDs and eight different granular standard IDs.
- Correct-answer positions are fixed but non-cyclic and balanced: workbook A/B/C/D = 9/9/9/9; recheck A/B/C/D = 2/2/2/2. The exact stable sequences are regression-locked so a future edit cannot silently return every correct answer to one slot or introduce an A-B-C-D loop.
- Focused browser tests: 5/5 passed.
  - student 12 pages, 36 items, no teacher key
  - isolated 36-item completion gate and eight-item recheck
  - Chinese teacher Letter layout and English 390px layout
  - Korean, English, and Simplified Chinese student/teacher render matrix
  - teacher recheck guide without student controls
- Shared workbook browser regression: 44/44 passed in an explicit serial run, including every existing Grade 6 workbook and the existing `7.RP.A` workbook.
  - Completion-gate tests now remove the exact course completion key before asserting a locked recheck route, so earlier browser storage cannot make a fresh-student test pass or fail nondeterministically.
- Curriculum foundation browser regression: 7/7 passed after adding the catalog integration.
  - Grade 7 retains ten registered units: `7.RP.A` and `7.NS.A` are the two workbook-linked units; the other eight remain visibly locked.
  - `7.NS.A` preserves student/teacher audience and Korean/English/Simplified Chinese locale in its generated URL.
  - A catalog URL containing `cluster=7.NS.A` restores Grade 7 and the exact selected unit even when `grade` is omitted. Role, locale, grade, and cluster are synchronized after user changes, and a reload preserves the updated selection.
  - A direct catalog click was checked at 1440px and 390px on a repository-root static server matching the deployed path structure. Both routes opened the expected 36-item workbook with zero browser errors or horizontal overflow.
  - Student and teacher boundaries remain separate: the student route contains zero teacher keys; the teacher route contains 36 answer keys and 36 teaching notes with no answer controls.
  - The catalog action measures 46px high at both viewport widths.
  - The selected released unit now shows one explicit five-step sequence: diagnostic, teacher analysis, concept learning, unit workbook, and recheck.
  - Diagnostic and teacher-analysis stages are text-only locked states with no link; concept and workbook are marked available; recheck is marked conditional after workbook completion.
  - Korean, English, and Simplified Chinese status copy was exercised in the browser regression. The Grade 7 `7.NS.A` Korean diagnostic state states that 18 items are in authoring and independent review rather than implying a usable assessment.
  - The learning-flow panel was visually inspected at 1440px and 390px: five stages, 46px primary action, zero document or panel horizontal overflow, zero browser errors. Keyboard focus on the primary action has a visible 3px outline with a 3px offset.
- Grade 7 `7.NS.A` screener-plan tests: 6/6 passed after the official-source audit.
  - nine granular focuses × two observations = 18 locked, answer-free slots
  - foundation/core/advanced = 6/6/6
  - multiple-choice/numeric/short-answer/constructed-response = 10/4/1/3
  - automatic/teacher scoring = 14/4
  - hypothetical reviewed metadata passes the existing unit-screener validator while placement capability remains false
  - every slot now carries the exact printed/PDF locator, a paraphrased official requirement, and a distinct evidence target
  - `7.NS.A.1a` now reserves a teacher-scored description rather than an insufficient numeric answer; the exact `1c` distance observation is numeric and still requires a calculated number line
  - immutable plan fingerprint `d58d1b6c07c4ddf185610b574eff0d64ec61ef27a0ef2fd0990e8915fb464a81`
- Grade 7 `7.NS.A` answer-free authoring-manifest tests: 4/4 passed.
  - all 18 slots retain exact plan lineage, response mode, scoring mode, and locked null item identity
  - minimum reviews are read from the existing shared item-release contract: math correctness, learner age, answer uniqueness, Korean/English/Simplified Chinese translation, rights, rubric, and student-payload safety
  - diagram or asset use adds visual-evidence and asset-rights reviews; both `7.NS.A.1b` slots and the `7.NS.A.1c` distance slot require calculated number-line evidence and a student-target-marker absence check
  - every focus has at least three declared independent proof methods, exact learner-fit criteria, implementation/review separation, stacked-fraction display, and student/teacher payload separation
- Grade 7 `7.NS.A` unit-screener analysis tests: 5/5 passed.
  - reviewed evidence is rebound by immutable item ID and aggregated across all nine granular focuses
  - every unit-screener blueprint item requires one unique immutable `slotId`; missing or duplicated slot bindings are rejected before analysis
  - score, difficulty, error, and item-feedback evidence remain observation-level; no strength, weakness, or mastery label is emitted
  - incomplete or cross-cluster granular focus lineage is rejected
  - course-placement and competition-benchmark blueprints are rejected before entering the unit-screener analyzer
  - interpretation flags keep automatic prescription, course placement, promotion, and competition prediction false and require teacher confirmation
- Grade 7 `7.NS.A` role-separated unit-screener report tests: 4/4 passed.
  - student output keeps score, granular focus evidence, and localized item comments but omits learner ID, internal slot/item IDs, skill lineage, and teacher difficulty details
  - teacher output retains pseudonymous learner identity, immutable slot/item bindings, and reviewed lineage; it still contains no answer, solution, rubric, mastery label, or automatic route
  - altered feedback, answer-field injection, decision escalation, duplicate item IDs, score drift, and focus/item evidence drift are rejected
  - overall and focus-level difficulty totals are independently rebound to the same reviewed item set; internally plausible but item-inconsistent difficulty summaries are rejected
  - missing observations remain visible as insufficient evidence and cannot become a mastery or prescription claim
- Grade 7 `7.NS.A` scoring-readiness tests: 4/4 passed.
  - fourteen automatic results and four teacher-scored results are separated by blueprint scoring mode rather than response-type guessing
  - zero, partial, and complete teacher-review states preserve counts while withholding partial score and analysis from the student status
  - all four reviews must match the attempt and immutable item IDs, occur after submission, and use unique review IDs
  - shuffled automatic and teacher results are rebound to blueprint order before the diagnostic engine accepts the final attempt
  - the end-to-end chain from finalized attempt through unit analysis to separate student and teacher reports passes without exposing learner identity to the student report
- Existing signer compatibility: 14/14 signer-guard tests passed.
  - a Grade 7 authenticated item bound to the `unit-screener` purpose and `7.NS.A` lineage is accepted by the existing generic signer
  - recursive answer leakage, binding drift, rubric drift, asset, rights, reviewer-credential, expiry, and revocation checks remain intact
  - the Grade 6 42/10 delivery contract and SQL pipeline remain untouched and are explicitly excluded from direct Grade 7 use
- Six-combination render matrix passed:
  - `ko`, `en`, `zh-Hans`
  - student A4 and teacher Letter
  - 36 items in every combination
  - visible slash-form fractions: 0
  - negative signs render before the complete stacked fraction rather than inside its numerator, while localized accessible labels retain the sign
  - repeating-decimal ellipsis notation: 0
  - repeating blocks use a continuous overbar and localized accessible label
  - negative stacked-fraction accessibility labels retain the sign in all three locales
  - page-height overflow: 0
  - viewport-width overflow: 0
  - browser errors: 0
- Visual evidence:
  - Local evidence bundle `boarding-grade7-nsa-20261013/desktop-number-line.png`
  - Local evidence bundle `boarding-grade7-nsa-20261013/mobile-opposite.png`
  - Local evidence bundle `boarding-grade7-nsa-20261013/print-teacher-vertical-final.png`
  - Local evidence bundle `boarding-grade7-nsa-decimal-notation/w30-screen.png`
  - Local evidence bundle `boarding-grade7-nsa-decimal-notation/w30-print.png`
  - Local evidence bundle `boarding-grade7-nsa-negative-fraction-20261014/w01-desktop-ko.png`
  - Local evidence bundle `boarding-grade7-nsa-negative-fraction-20261014/w26-mobile-en.png`
  - Local evidence bundle `boarding-grade7-nsa-negative-fraction-20261014/w22-print-ko.png`
  - Local evidence bundle `boarding-grade7-nsa-calculated-arrows-20261014/g7nsa-w13.png`
  - Local evidence bundle `boarding-grade7-nsa-calculated-arrows-20261014/g7nsa-w18.png`
  - Local evidence bundle `boarding-grade7-nsa-calculated-arrows-20261014/g7nsa-r04.png`
  - Local evidence bundle `boarding-grade7-nsa-teacher-solutions-20261014/w26-student.png`
  - Local evidence bundle `boarding-grade7-nsa-teacher-solutions-20261014/w13-teacher.png`
  - Local PDF evidence bundle `boarding-grade7-nsa-pdf-20261014`:
    - Korean student edition: 12-page A4 PDF, 36 items, zero teacher keys, zero page-height overflow
    - English teacher edition: 20-page Letter PDF, 36 items, 36 answer/check boxes, zero page-height overflow
    - all 32 PDF pages rendered through Poppler and visually inspected for clipping, overlap, missing glyphs, blank pages, section transitions, stacked fractions, number-line geometry, repeating-decimal overbars, teacher-key fit, and page numbering
    - all mathematical fractions render with a horizontal fraction bar; plain-text slash fractions: 0
    - displayed negative integers and decimals use Unicode mathematical minus `−`; ASCII negative-number hyphens: 0
    - both PDFs are unencrypted and contain no form or JavaScript payload
  - Local/public Grade 6 fraction regression bundle `boarding-fraction-complaint-20261014`: both copies render 32 MathML fractions, including six stacked `1/8` labels in the fraction strip, with zero visible slash fractions, overflow, or browser errors.
  - Local catalog integration bundle `boarding-grade7-nsa-catalog-20261014`: Korean student and teacher catalog views at 1440px and 390px, including the selected `7.NS.A` unit and its primary action, plus a 390px Chinese teacher deep-link restoration capture.
  - Local learning-sequence bundle `boarding-grade7-learning-flow-20261014`: full-page and focused Korean student captures at 1440px and 390px.
  - The evidence bundle is deliberately outside the public release tree.
- Changed-file public-boundary scan:
  - thirty-two changed and untracked files inspected: workbook candidate, curriculum-catalog integration, official-source audit, locked unit-screener plan, answer-free authoring manifest, immutable slot-bound analyzer, scoring-readiness state, role-separated report projections, signer compatibility evidence, release-candidate manifest and its hash verifier, browser regression, public-audit script, and audit regression files
  - embedded secret, credential, private-source URL, third-party question-site URL, confidentiality marker, and absolute local path findings: 0
  - `git diff --check`: passed
- Repository-wide `npm run audit:public`: passed with `no targeted legacy findings`.
  - The working-tree, staged-index, untracked-file, known private-authoring path, and complete marker-history checks found no unexpected workbook confidentiality marker.
  - The audit limits workbook-marker searches to `boarding-school-math`, has a 30-second Git-command timeout, and has a passing isolated staged-index/history/untracked-file regression test.

## Broader regression note

The repository non-browser command reported 403 passes, one skip, and ten failures. The ten failures were environment/sparse-checkout prerequisites rather than `7.NS.A` assertions: the isolated worktree does not contain tracked `hsmiddle`, tracked `number_magic`, or ignored private Grade 6 authoring data. No missing source was fabricated or copied into the public candidate. Focused `7.NS.A` and shared workbook browser checks pass.

## Remaining release gates

The candidate worktree started at `75cd785d`. A final fetch on 2026-10-14 found remote `main` at `2e6a7a0e`, 28 commits ahead. The complete `boarding-school-math` tree hash remains `945a697021869b5d7255d4344a8477b5abb6ef84` and the depended-on `geometry/worksheet/render.js` blob hash remains `56aa0f0adcb95f483bdf892f3e0841c828dc29f9` at both commits, so the incoming commits do not change this candidate's tested product or renderer inputs.

1. Review the Git diff and decide whether to authorize a commit based on the latest fetched `main`.
2. If authorized, commit only the `7.NS.A` candidate and its exact integration/test files.
3. Push/merge only with separate authorization.
4. After deployment, verify the public URL, deployed asset hashes, GitHub Pages workflow, desktop/mobile rendering, and A4/Letter print state before changing the candidate status to released.
5. Do not present this workbook as a placement, promotion, SASMO, Math Kangaroo, or AMC prediction.
