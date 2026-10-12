# SASMO 2019 Primary 6: domain-evidence audit (public-safe)

Status: **draft audit; no release approval**. This document records only item numbers, page locators, mathematical actions, and classification decisions. It contains no question text, options, answers, images, private path, or student record.

## Evidence boundary

- The restricted 16-page problem PDF has SHA-256 `a2e7191c21d29fdfb5b9f8a0d08018df6d7c1b318d0e05207dcc522696074d6b`, matching the public form's source fingerprint. Questions 1-25 were read from PDF pages 3-14; the relevant diagrams on pages 4, 5, 9, 10, 11, and 13 were visually checked. PDF extraction alone was not treated as diagram evidence.
- The restricted 11-page solutions PDF has SHA-256 `ae396d8fa2d83211bc734c353bd77b682e3eae9cb126ecde20c92c3836e2dcd2`. Its running header says **2020**, while its internal title says **Solutions to SASMO 2019 Primary 6**. The first and Q19 solution pages were visually checked, and all 25 numbered solution entries were matched to the corresponding problem's mathematical topic. This supports **item-level correspondence**, but the header discrepancy remains part of the provenance record; it does not by itself establish organizer-controlled source identity.
- The existing `FORM_TAXONOMY_MISMATCH` test proves that the private pack and public catalog use identical axis/skill IDs. It does **not** prove that those labels describe the original mathematical action.
- The solutions PDF's Q24 worked arithmetic has an internal transcription error: one displayed digit in its final sum conflicts with the digit established immediately above, even though the stated final answer is correct. A separate exhaustive check of the distinct-digit column equation found exactly one assignment and confirmed that final answer. Do not copy the inconsistent worked line into a teacher explanation or workbook.
- The solutions PDF's Q25 November row mentions day 31 in one explanatory sentence. Its date list and row total use November's valid 30-day range, and an independent date enumeration confirms the final answer. Do not copy that sentence into a teacher explanation.

The current official syllabus page separates Primary 5-6 from the earlier primary group: its word-problem strand permits model method or other methods including algebra. The strands describe syllabus coverage and are not published as mutually exclusive item labels. Any GFIELD mapping therefore uses an array of internal mapping tags rather than claiming an organizer-assigned category.

The six current GFIELD axes are content groupings, except `problem-solving-strategies`, which is a cross-cutting process. An item can have a primary axis and secondary skills; the six-axis report currently stores only the primary axis.

## Item-by-item primary-axis review

`Aligned` means the current label is reasonable from the inspected original, not that the item is approved for a learner-facing diagnostic. `Decision needed` identifies a consequential classification or answer-contract issue.

| Q | PDF page | Current primary axis | Observed mathematical action, paraphrased | Review |
| --- | ---: | --- | --- | --- |
| 01 | 3 | number-operations | Digit sum after multiplication. | Aligned. |
| 02 | 3 | data-probability | Recover an overlap from two categorical group counts. | Proposed primary: combinatorics-logic (two-set overlap); data context is secondary. No graph, statistical measure, or probability is required. |
| 03 | 4 | geometry-spatial | Count edges by face-edge incidence in a solid. | Aligned; source solid diagram checked. |
| 04 | 4 | combinatorics-logic | Count arrangements under an adjacency condition. | Aligned. |
| 05 | 4 | number-operations | Recover a whole before calculating a percentage. | Aligned. |
| 06 | 5 | geometry-spatial | Chase angles from squares and an equilateral triangle. | Aligned; source marks checked. |
| 07 | 5 | patterns-algebra | Solve linked quantities from equalities and an average. | Reviewed primary: number-operations. The official solution recovers a common proportional unit from an average and a known difference; relationship translation is a method tag. |
| 08 | 6 | number-operations | Apply divisibility and parity to rotating digits. | Aligned. |
| 09 | 6 | data-probability | Check claims about frequency, counts, and mean. | Aligned. |
| 10 | 7 | number-operations | Compare fill and leak unit rates. | Aligned. |
| 11 | 7 | problem-solving-strategies | Shift days of the week with an offset. | Proposed primary: number-operations (seven-day cycle); cyclic reasoning is a process tag, not a separate content diagnosis. |
| 12 | 8 | geometry-spatial | Relate two clock-hand angular rates. | Aligned as measurement/geometry with rate reasoning. |
| 13 | 8 | combinatorics-logic | Test truth-value cases under a three-true condition. | Aligned. |
| 14 | 9 | number-operations | Find the smallest factorial range covering prime factors. | Aligned. |
| 15 | 9 | patterns-algebra | Infer a missing visual figure from a grid rule. | **Answer-contract review required**; the published construction reaches the printed option, but the completed columns do not determine the outputs for two unseen input pairs. |
| 16 | 10 | geometry-spatial | Count composite triangles in a line arrangement. | Aligned; source diagram checked. |
| 17 | 10 | number-operations | Sum a geometric sequence of unit fractions. | Retain number-operations as primary: the requested result is a simplified fraction component; spotting the partial-sum pattern is secondary. The printed solution uses that pattern. |
| 18 | 11 | data-probability | Read a bar chart and extend a fixed percentage decrease. | Aligned as data representation; proportional reasoning is secondary. |
| 19 | 11 | patterns-algebra | Infer a number-sequence rule that the prompt does not declare. | **Answer-contract review required**; printed key supplies a calendar interpretation, but the prompt alone does not guarantee that continuation. |
| 20 | 12 | patterns-algebra | Solve several part-to-whole ratio conditions together. | Proposed primary: ratio/proportional reasoning within number-operations until a dedicated ratio strand exists; relational modeling is secondary. The printed solution converts all ratios to a common whole, rather than relying on an algebraic pattern. |
| 21 | 12 | combinatorics-logic | Use parity constraints and a minimum-sum construction. | Content axis aligned, but **number-domain review required**: the printed solution excludes zero and gives 543, while a zero-inclusive whole-number reading gives 501. |
| 22 | 13 | number-operations | Synchronize lap times on two drawn triangular tracks. | Aligned as rate/number action; diagram topology is a secondary prerequisite. |
| 23 | 13 | geometry-spatial | Find a shaded area from two squares and right-angle marks. | Aligned; source diagram checked. |
| 24 | 14 | combinatorics-logic | Solve a digit-letter column constraint. | Aligned. |
| 25 | 14 | problem-solving-strategies | Systematically count a digit across valid dates. | Proposed primary: combinatorics-logic (disjoint-case enumeration); systematic organization is a process tag. An independent date-by-date enumeration matched the printed key. |

Current catalog sample counts are number 7, patterns 4, geometry 5, logic 4, data 3, and strategy 2. The analyzer already withholds strength/weakness labels below four items. Excluding Q9, Q15, Q19, and Q21 leaves provisional legacy-axis counts of number 7, patterns 2, geometry 5, logic 3, data 2, and strategy 2. The 2019 score can still be reported as a **printed-key-matched paper score** under an explicit policy, but that score is not proof of six-domain diagnostic coverage.

## Reviewed content/process contract — companion only, not runtime

Choose the **primary content strand** from the mathematical knowledge necessary for a valid solution, not from the story setting, diagram presence, or a generic problem-solving label. Keep secondary content and cross-cutting processes in separate fields. In particular, `problem-solving-strategies` is not a sixth content strand and should not receive a stand-alone proficiency score from Q11 and Q25. A later taxonomy may give ratio/proportional reasoning its own strand; do not relabel Q20 as algebra merely because it can be expressed with letters.

| Question | Proposed primary content | Secondary evidence or process | Source comparison |
| --- | --- | --- | --- |
| Q02 | combinatorics-logic | data context; inclusion-exclusion and overlap representation | The solution subtracts the group total from the two category counts. |
| Q07 | number-operations / ratio | common-unit model; relationship translation | The solution expresses all four quantities in common units, then uses the given difference to recover one unit. |
| Q11 | number-operations | cyclic reasoning | The solution reduces the day offset to whole weeks, then advances the weekday. |
| Q17 | number-operations (unchanged) | partial-sum pattern | The solution observes the numerator/denominator pattern after fraction additions. |
| Q20 | number-operations / ratio | relational modeling | The solution normalizes three part-to-rest ratios to the same whole. |
| Q25 | combinatorics-logic | exhaustive, non-overlapping cases | The solution partitions the date positions; a separate date enumeration agrees. |

With Q07 and Q11 both classified as number-operations and the other reviewed decisions adopted, the companion has **21 diagnosis-eligible observations**: number 10, patterns 0, geometry 5, logic 5, data 1, and strategy 0. Q9, Q15, and Q21 remain review-required, while Q19 remains score-only. This is a reviewed companion count, not an approved taxonomy migration. The v5 local operational report now applies the same conservative exclusion boundary to the legacy axes: all 25 printed-key outcomes remain in the historical score, while Q9/Q15/Q19/Q21 stay outside the 21-item, non-prescriptive diagnostic view. The companion's revised axis assignments are still not loaded. Under the current four-item minimum, this single paper could support tentative relative signals only for number, geometry, and logic. It has no pattern evidence and cannot establish data or generic strategy strengths or weaknesses. The full 25-item, 70-point paper score is a different contract and does not change.

This is a source-grounded **reviewed companion, not an approved taxonomy migration**. The current private scoring pack and public scoring catalog have matching legacy axis/skill IDs and fingerprints; keep both scoring contracts byte-stable. Revised classifications live only in the release-locked, answer-free `competition/sasmo-2019-g6-taxonomy-companion.js`, bound by form ID, source fingerprint, question number, and taxonomy fingerprint `b82b0f966ac7f8cf2f4355680760b2c95504bb4bd2f0cd6b3c2de023a127fdd6`. The companion is not imported by scoring, reporting, or planning runtimes. Do not activate its revised taxonomy in diagnosis until the remaining language, answer-contract, and number-domain reviews, old-record migration tests, and student/teacher/A4 re-rendering are complete. Until then the taxonomy gate remains pending and release remains locked. The local report can display 21 provisional legacy-axis observations with Q9/Q15/Q19/Q21 excluded, but it exports no automatic strength, weakness, or priority from this form; existing v1-v4 local records remain score history with superseded diagnostics.

An answer-free, review-only prerequisite bridge now covers only Q07 and Q20 in `competition/sasmo-2019-g6-learning-bridge-review.cjs`, fingerprinted as `126bfe28e3fc55f6846c6c91a01ee3b716f503f592981fb5b5fa15130780d6dc`. It points to existing Grade 6 ratio concept and workbook records only as prerequisite practice. SASMO-specific transfer practice and delayed recheck remain `missing`, assignment remains `locked`, teacher work review is required, and automatic prescription is explicitly false. The bridge is not loaded by learner, scoring, diagnosis, or planning pages and does not contain source questions, options, answers, or private locators.

## Q9, Q15, Q19, and Q21 determinacy boundaries

For Q9, direct enumeration gives digit frequencies `0:5, 1:15, 2:15, 3:15, 4:15, 5:6, 6:5, 7:5, 8:5, 9:5`. The printed choice D remains the published-key outcome, but option B's phrase “the least occurring digit” may imply either any digit tied for the minimum or one unique minimum. Q9 therefore remains historical-score evidence only and cannot support a data-frequency diagnosis.

For Q15, an independent symbolic model found two deterministic position-wise completion rules that agree on every relationship demonstrated by the completed source figures but differ on one unseen input case and lead to different listed choices. The detailed source transcription and counterexample remain in the restricted audit. The printed option is retained for historical scoring, but Q15 cannot support a skill diagnosis without an additional rule that the prompt does not state.

The solution's month-and-day interpretation yields the intended entry, but the original prompt provides only the finite sequence. For any rule that matches its eight displayed terms, adding a nonzero multiple of `∏(n-k)` over the displayed positions `k = 1, 2, 3, 4, 5, 6, 7, 9` leaves those terms unchanged while altering the missing eighth term. Therefore the displayed terms alone do not determine a unique mathematical continuation. This is a source-prompt limitation, not a claim that the organizer's printed key is miscalculated.

For Q21, the product condition permits at most ten odd selections and the odd total requires an odd number of odd selections. Comparing all feasible odd counts 1, 3, 5, 7, and 9 gives 543 if the domain starts at 1. If zero is included among whole numbers, `0` through `18` plus the even numbers `20` through `40` is a valid 30-number construction with total 501. The prompt does not state which number domain is intended, so the printed 543 is historical-score evidence only.

Keep two contracts separate: (1) historical **key-matched scoring**, and (2) **skill-diagnostic evidence** from a uniquely determined item. Do not silently treat a key-matched Q9, Q15, Q19, or Q21 response as a confirmed skill or mistake type. The local report now uses a versioned `gfield-competition-evidence-v5` record: `axes` retain all 25 scored outcomes, while `diagnosticAxes` contain 21 non-excluded provisional outcomes, `diagnosticExcludedQuestionNumbers` is `[9,15,19,21]`, `reviewRequiredQuestionNumbers` is `[9,15,21]`, and `scoreOnlyQuestionNumbers` is `[19]`. The student sees 21-item provisional legacy-axis counts and the teacher sees the four exclusion reasons separately. Pre-existing v1-v4 records retain their historical score but their former domain diagnosis is marked superseded; no item-level outcome is invented to rebuild a 21-item diagnosis. This is a safeguard, **not** a claim that the original prompts have become uniquely determined or that all other taxonomy choices are approved.

## Required next gates

1. Retain the solutions PDF's running-header discrepancy and both exact source fingerprints. All 25 item topics align, but verify organizer-controlled source identity separately before claiming that this copy is an official organizer file.
2. Preserve the independent 25-item companion review: Q02 and Q25 map to combinatorics-logic; Q07, Q11, and Q20 map to number-operations; Q17 remains number-operations. A known proportional or cyclic rule applied to calculate a quantity is number work; discovering or generalizing an unstated rule is pattern work. Keep the existing scoring pack and scoring form unchanged, and keep the reviewed classification in the separately fingerprinted, answer-free taxonomy companion rather than invalidating the verified scoring-pack byte fingerprint.
3. Review the implemented Q9/Q15/Q21 review-required and Q19 score-only policy with the curriculum lead before release. Focused contracts, actual-pack desktop/390px browser flow, answer-safe storage, first-attempt retention, and the one-page A4 result render pass locally; the curriculum decision and public release remain locked.
4. Recheck any later taxonomy revision at desktop, 390px, and A4, including the count and reasons for diagnostic exclusions and missing domain evidence. No source question or solution may enter a public bundle through this audit.
5. Independently review the Q24 worked-solution typo before authoring its teacher explanation; the source's printed final answer is supported by exhaustive arithmetic, but its displayed sum line is not safe to copy.
6. For Q07/Q20, author and independently verify one shared common-whole transfer lesson and a genuinely new delayed recheck before changing either bridge route from `missing` or `locked`. Existing 6.RP.A exercises alone are prerequisite evidence, not SASMO transfer mastery.
