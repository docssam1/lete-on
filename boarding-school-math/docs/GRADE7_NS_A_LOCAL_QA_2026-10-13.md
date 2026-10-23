# Grade 7 `7.NS.A` local QA — 2026-10-13 to 2026-10-14

Current status (2026-10-24): **candidate committed locally; not pushed, merged, deployed, or approved for placement/promotion use**. The October 13–14 evidence below is historical; the Mac continuation and current handoff govern the remaining work.

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

## Historical October 14 release checklist

The candidate worktree started at `75cd785d`. A final fetch on 2026-10-14 found remote `main` at `2e6a7a0e`, 28 commits ahead. The complete `boarding-school-math` tree hash remains `945a697021869b5d7255d4344a8477b5abb6ef84` and the depended-on `geometry/worksheet/render.js` blob hash remains `56aa0f0adcb95f483bdf892f3e0841c828dc29f9` at both commits, so the incoming commits do not change this candidate's tested product or renderer inputs.

1. Review the Git diff and decide whether to authorize a commit based on the latest fetched `main`.
2. If authorized, commit only the `7.NS.A` candidate and its exact integration/test files.
3. Push/merge only with separate authorization.
4. After deployment, verify the public URL, deployed asset hashes, GitHub Pages workflow, desktop/mobile rendering, and A4/Letter print state before changing the candidate status to released.
5. Do not present this workbook as a placement, promotion, SASMO, Math Kangaroo, or AMC prediction.

## Mac continuation — 2026-10-17

This section supersedes the older commit-pending note above. It records new Mac execution; it does not relabel the earlier Windows evidence as Mac evidence.

### Preserved candidate and local changes

- The 39 imported changed/untracked files were checked against the intake SHA-256 receipt and committed without byte changes as `306c575c4b8ee182ac78fe19c9da6683b9fd51fb` on branch `codex/boarding-g7-nsa-mac-20261017`.
- The 38-payload historical release manifest remains unchanged. Its five-test verifier now checks the immutable commit, its one recorded parent, exact changed paths, byte lengths, and SHA-256 hashes. Clean checkouts, staging, and later commits no longer cause a false failure; altered historical payload hashes or paths still fail.
- A fetch observed `origin/main` at `8777377c5356f02bab36229d273ba9374ee84118`. The candidate base and that remote state have no differences in this product, the shared worksheet renderer, or the required Three.js vendor subtree. This is a compatibility observation, not a merge or deployment.
- Mac browser testing exposed 16px-high study-material links. They now provide a 44px target and visible 3px keyboard focus outline; print keeps compact inline links without the screen focus outline.
- The private Grade 7 draft preflight is available through `npm run validate:private-grade7-ns-a -- --root <absolute-external-directory>`. It requires all 18 canonical slots, 14 automatic / 4 teacher-scored items, Korean/English/Simplified Chinese learner content, focus-specific author proof methods, exact rational number-line bounds, asset hashes, and pending review/release states. It rejects Git-root ancestry, symlinks, unsafe/oversized files, duplicate JSON keys, and active or externally referencing SVG.
- Preflight success is structural only: `mathematicsVerified=false`, `independentReviewApproved=false`, `studentOperationAuthorized=false`, and delivery remains locked. It creates neither a release bundle nor a signed form.

### Checks run on Mac

- Runtime: bundled Node 24.19.0 on Darwin arm64; Playwright Chromium 151.0.7922.34. Missing sparse dependencies were materialized from the existing Git checkout, and the matching browser was installed in the local Playwright cache.
- Updated `pretest`: **76/76 passed**, including five immutable snapshot checks and twelve private-draft preflight checks. All private test content is synthetic; real diagnostic drafts remain outside Git.
- Shared item-release, signer-payload guard, learning-delivery, and Grade 6 SQL contract tests: **51/51 passed**. These are local static/contract checks, not a remote Supabase test or Grade 7 server deployment.
- Workbook browser regression: **44/44 passed**. Curriculum foundation browser regression: **7/7 passed**.
- The initial combined browser run passed 57/58, with only the Mac study-link target-height check failing. After the CSS fix and final print focus correction, the complete learning-plan browser suite passed **7/7**. All 58 covered browser cases therefore pass across the initial and focused repair runs; a single final 58-case run is not claimed.
- Direct 390px and 1440px learning-plan inspection: no horizontal overflow, no page errors, minimum study-link height 44px, focused outline 3px. A three-page A4 browser PDF was exported, rendered through Poppler, and visually inspected; no clipping or overlap was found, and the screen focus outline is absent from print. The PDF has no form, JavaScript, or encryption. It is a QA export of the same page, not a new product document.
- Extended public-exposure regression: **2/2 audit tests plus 1/1 existing external-authoring protection test passed**, including a renamed assessment draft outside the product directory and working-tree, staged-only, untracked, deleted-history, exact-exclusion, oversized-file, and shallow-history cases. The assessment marker is checked across the repository; the older workbook scope is preserved.
- Current, staged, untracked, and existing scoped public checks found no leak. **Whole-repository assessment-marker history is unverified**: this checkout is a `blob:none` partial clone, and the new scan needs historical blobs that are absent locally. The initial 30-second bound failed; a bounded measurement was stopped at about 90 seconds after Git attempted lazy fetches. The audit now disables lazy fetches and fails closed on missing history rather than silently downloading the rest of the repository or claiming a pass. No assessment-history release pass is recorded.
- Changed JavaScript syntax and `git -c core.whitespace=cr-at-eol diff --check` passed. Original CRLF bytes are preserved rather than normalized during migration.
- Skills used: `ui-ux-pro-max` with the existing GFIELD design rules for the touch/focus repair, and `pdf` for rendered A4 verification. QA evidence is kept outside Git in the existing Mac continuation evidence location.

### Remaining operational boundary

All 18 original private drafts and three calculated SVGs now exist outside Git. The final private pack passes structural preflight, and a separate Python `Fraction` checker independently recomputes all 18 slots and verifies the three SVGs' hashes, tick positions, point coordinates, movement vectors, and absence of target-answer markers. Exact plan lineage and the 14/4 scoring split remain intact. The final pack hash and local review evidence are recorded only in the external continuation receipt/review record.

Local review repaired four issues: a mixed-script Korean explanation, a numerator sign displayed in the wrong position, a required rubric condition missing from the prompt, and inconsistent acceptance of equivalent repeating-decimal notation. Multiple-choice sign alternatives were also made parallel in form. Learner prompts/options, solutions, and teacher-rubric evidence are trilingual; internal error-signal rationales intentionally follow the existing Korean/English-only shared schema. Chinese teacher-feedback localization is an integration gate, not a completed capability.

Two numeric slots still observe only the entered scalar, even when the prompt requests an inverse or reverse check. Their private evidence explicitly records that scratch-work reasoning is not observed automatically. The 18/4 plan was not silently changed to tuple scoring, and no broader focus mastery is inferred. Local calculation/diagram checks do not replace formal release reviews or the full private-item trilingual desktop/mobile/A4/Letter rendering matrix, which remains pending.

The public 18-slot plan and answer-free authoring manifest retain null item identities. Private authoring and local review are separate from item-release approval, rights approval, authenticated storage/signing, and student operation. No score thresholds, automatic prescription, placement, promotion, or competition prediction were approved. The current roadmap demonstration still uses Grade 6/SASMO pathways rather than actual Grade 7 diagnostic evidence.

Before student operation: complete the independent item/rubric/translation/rights/visual reviews, create valid immutable item releases and the 18-item signed form, implement and verify the separate 18/4 delivery adapter, then connect teacher-confirmed priorities to concept learning/workbooks/recheck. Push, merge, deployment, live verification, and Drive synchronization remain separate actions and were not performed in this continuation.
