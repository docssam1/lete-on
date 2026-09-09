# Grade 7 `7.RP.A` learner-fit audit

Status: local content, integration, desktop, mobile, and print gates verified; remote merge, deployment, and live read-back remain.

## Task stage

- Learner stage: **US Grade 7 ages 12–13**
- Curriculum boundary: `7.RP.A.1–3`
- Source locator: Common Core State Standards for Mathematics, Grade 7, Ratios and Proportional Relationships, official PDF page 48.
- Artifact boundary: 36 student-choice practice items and eight new-structure recheck items; teacher explanations are rendered only in teacher mode.

| Required criterion | Review finding | Status |
| --- | --- | --- |
| Language | Korean, English, and Simplified Chinese prompts use Grade 7 terms: unit rate, proportional relationship, constant of proportionality, equation, graph point, and multi-step percent. | Pass |
| Representations | Fractional rates use quantity/unit models; relationships use x-y tables; equation/point items use calculated coordinate graphs; percent items show change order without showing the final value. | Pass |
| Prerequisites | Assumes fraction multiplication/division, coordinate pairs, integer and fraction ratios, and basic percent computation developed through Grade 6. No later-grade function notation, slope formula, or algebraic solving is required. | Pass |
| Reasoning load | Foundation items establish one representation; core items require a representation switch; advanced items use fractional quantities or sequential percent changes. Difficulty changes the reasoning steps, not merely the numeral size. | Pass |
| Response mode | Four choices are present for each item. Distractors represent inverse-rate, additive-pattern, missing-origin, coordinate-order/unit, and same-base-percent errors. A teacher separately reviews explanation and representation creation. | Pass |

## Negative boundaries

- A selected answer is not evidence of placement, promotion, SASMO/AMC readiness, or full cluster mastery.
- The student edition contains no teacher key, explanation, or answer-marked visual.
- No third-party contest prompt, scan, or answer key is included.

## Evidence locators

- Mathematical determinacy and answer checks: `tests/grade7-rp-a-unit-workbook.test.cjs`.
- Student/teacher, 390px, A4, and Letter renderer checks: `tests/unit-workbook-browser.test.cjs` (Grade 7 proportionality cases).
- Source and scope gate: `docs/GRADE7_RP_A_AUTHORING_GATE.md`.
