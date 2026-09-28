# SASMO 2019 Primary 6: domain-evidence audit (public-safe)

Status: **draft audit; no release approval**. This document records only item numbers, page locators, mathematical actions, and classification decisions. It contains no question text, options, answers, images, private path, or student record.

## Evidence boundary

- The restricted 16-page problem PDF has SHA-256 `a2e7191c21d29fdfb5b9f8a0d08018df6d7c1b318d0e05207dcc522696074d6b`, matching the public form's source fingerprint. Questions 1-25 were read from PDF pages 3-14; the relevant diagrams on pages 4, 5, 9, 10, 11, and 13 were visually checked. PDF extraction alone was not treated as diagram evidence.
- The restricted 11-page solutions PDF has SHA-256 `ae396d8fa2d83211bc734c353bd77b682e3eae9cb126ecde20c92c3836e2dcd2`. Its running header says **2020**, while its internal title says **Solutions to SASMO 2019 Primary 6**. The first and Q19 solution pages were visually checked, and all 25 numbered solution entries were matched to the corresponding problem's mathematical topic. This supports **item-level correspondence**, but the header discrepancy remains part of the provenance record; it does not by itself establish organizer-controlled source identity.
- The existing `FORM_TAXONOMY_MISMATCH` test proves that the private pack and public catalog use identical axis/skill IDs. It does **not** prove that those labels describe the original mathematical action.
- The solutions PDF's Q24 worked arithmetic has an internal transcription error: one displayed digit in its final sum conflicts with the digit established immediately above, even though the stated final answer is correct. A separate exhaustive check of the distinct-digit column equation found exactly one assignment and confirmed that final answer. Do not copy the inconsistent worked line into a teacher explanation or workbook.

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
| 07 | 5 | patterns-algebra | Solve linked quantities from equalities and an average. | Aligned. |
| 08 | 6 | number-operations | Apply divisibility and parity to rotating digits. | Aligned. |
| 09 | 6 | data-probability | Check claims about frequency, counts, and mean. | Aligned. |
| 10 | 7 | number-operations | Compare fill and leak unit rates. | Aligned. |
| 11 | 7 | problem-solving-strategies | Shift days of the week with an offset. | Proposed primary: number-operations (seven-day cycle); cyclic reasoning is a process tag, not a separate content diagnosis. |
| 12 | 8 | geometry-spatial | Relate two clock-hand angular rates. | Aligned as measurement/geometry with rate reasoning. |
| 13 | 8 | combinatorics-logic | Test truth-value cases under a three-true condition. | Aligned. |
| 14 | 9 | number-operations | Find the smallest factorial range covering prime factors. | Aligned. |
| 15 | 9 | patterns-algebra | Infer a missing visual figure from a grid rule. | Aligned as visual pattern; answer observability still needs its own gate. |
| 16 | 10 | geometry-spatial | Count composite triangles in a line arrangement. | Aligned; source diagram checked. |
| 17 | 10 | number-operations | Sum a geometric sequence of unit fractions. | Retain number-operations as primary: the requested result is a simplified fraction component; spotting the partial-sum pattern is secondary. The printed solution uses that pattern. |
| 18 | 11 | data-probability | Read a bar chart and extend a fixed percentage decrease. | Aligned as data representation; proportional reasoning is secondary. |
| 19 | 11 | patterns-algebra | Infer a number-sequence rule that the prompt does not declare. | **Answer-contract review required**; printed key supplies a calendar interpretation, but the prompt alone does not guarantee that continuation. |
| 20 | 12 | patterns-algebra | Solve several part-to-whole ratio conditions together. | Proposed primary: ratio/proportional reasoning within number-operations until a dedicated ratio strand exists; relational modeling is secondary. The printed solution converts all ratios to a common whole, rather than relying on an algebraic pattern. |
| 21 | 12 | combinatorics-logic | Use parity constraints and a minimum-sum construction. | Aligned. |
| 22 | 13 | number-operations | Synchronize lap times on two drawn triangular tracks. | Aligned as rate/number action; diagram topology is a secondary prerequisite. |
| 23 | 13 | geometry-spatial | Find a shaded area from two squares and right-angle marks. | Aligned; source diagram checked. |
| 24 | 14 | combinatorics-logic | Solve a digit-letter column constraint. | Aligned. |
| 25 | 14 | problem-solving-strategies | Systematically count a digit across valid dates. | Proposed primary: combinatorics-logic (disjoint-case enumeration); systematic organization is a process tag. An independent date-by-date enumeration matched the printed key. |

Current catalog sample counts are number 7, patterns 4, geometry 5, logic 4, data 3, and strategy 2. The analyzer already withholds strength/weakness labels below four items, so data and strategy cannot be declared from this paper alone. If Q19 is not used as pattern-domain evidence, patterns falls to three. The 2019 score can still be reported as a **printed-key-matched paper score** under an explicit policy, but that score is not proof of six-domain diagnostic coverage.

## Proposed content/process contract — not yet applied

Choose the **primary content strand** from the mathematical knowledge necessary for a valid solution, not from the story setting, diagram presence, or a generic problem-solving label. Keep secondary content and cross-cutting processes in separate fields. In particular, `problem-solving-strategies` is not a sixth content strand and should not receive a stand-alone proficiency score from Q11 and Q25. A later taxonomy may give ratio/proportional reasoning its own strand; do not relabel Q20 as algebra merely because it can be expressed with letters.

| Question | Proposed primary content | Secondary evidence or process | Source comparison |
| --- | --- | --- | --- |
| Q02 | combinatorics-logic | data context; overlap representation | The solution subtracts the group total from the two category counts. |
| Q11 | number-operations | cyclic reasoning | The solution reduces the day offset to whole weeks, then advances the weekday. |
| Q17 | number-operations (unchanged) | partial-sum pattern | The solution observes the numerator/denominator pattern after fraction additions. |
| Q20 | number-operations / ratio | relational modeling | The solution normalizes three part-to-rest ratios to the same whole. |
| Q25 | combinatorics-logic | exhaustive, non-overlapping cases | The solution partitions the date positions; a separate date enumeration agrees. |

If these proposals are adopted and Q19 stays score-only, the **24 diagnostic items** would be distributed as number 9, patterns 2, geometry 5, logic 6, data 2, and strategy 0. Under the current four-item minimum, this single paper could support tentative relative signals only for number, geometry, and logic. It cannot establish pattern, data, or generic strategy strengths or weaknesses. The full 25-item, 70-point paper score is a different contract and would not change.

This is a source-grounded **proposal, not an approved taxonomy migration**. The current private scoring pack and public catalog have matching axis/skill IDs and fingerprints. Applying a public-only relabel would deliberately trigger `FORM_TAXONOMY_MISMATCH`; therefore revise both sides together under a new version, test old local records, and re-render student/teacher/A4 reports only after independent curriculum review. Until then the form-taxonomy gate remains pending and release remains locked. The local report can display provisional axis counts for teacher observation, but it now exports no automatic strength, weakness, or priority from this form; existing v2 local records are also sanitized to score-only planning.

## Q19 determinacy boundary

The solution's month-and-day interpretation yields the intended entry, but the original prompt provides only the finite sequence. For any rule that matches its eight displayed terms, adding a nonzero multiple of `∏(n-k)` over the displayed positions `k = 1, 2, 3, 4, 5, 6, 7, 9` leaves those terms unchanged while altering the missing eighth term. Therefore the displayed terms alone do not determine a unique mathematical continuation. This is a source-prompt limitation, not a claim that the organizer's printed key is miscalculated.

Keep two contracts separate: (1) historical **key-matched scoring**, and (2) **skill-diagnostic evidence** from a uniquely determined item. Do not silently treat a key-matched Q19 response as a confirmed pattern skill or mistake type. The local report now uses a versioned `gfield-competition-evidence-v2` record: `axes` retain all 25 scored outcomes, while `diagnosticAxes` contain 24 eligible outcomes and `scoreOnlyQuestionNumbers` is `[19]`. The student sees 24-item provisional axis counts and the teacher sees Q19 marked as score-only. Neither a pre-existing v1 record nor a v2 record may carry an unreviewed 2019 domain priority into the learning plan. This is a safeguard, **not** a claim that the original prompt has become uniquely determined or that all other taxonomy choices are approved.

## Required next gates

1. Retain the solutions PDF's running-header discrepancy and both exact source fingerprints. All 25 item topics align, but verify organizer-controlled source identity separately before claiming that this copy is an official organizer file.
2. Independently review the proposed primary/secondary rules for Q02, Q11, Q17, Q20, and Q25. If accepted, migrate the private pack and public catalog together under a new version; do not release the current six-axis labels as verified proficiency.
3. Review the implemented Q19 score-only policy with the curriculum lead before release; test that first-attempt history, answer-safe storage, teacher/student separation, and the 25-item scoring denominator remain intact. The local tests and browser render pass, but this decision is still a release gate.
4. Recheck any later taxonomy revision at desktop, 390px, and A4, including the count of score-only items and missing domain evidence. No source question or solution may enter a public bundle through this audit.
5. Independently review the Q24 worked-solution typo before authoring its teacher explanation; the source's printed final answer is supported by exhaustive arithmetic, but its displayed sum line is not safe to copy.
