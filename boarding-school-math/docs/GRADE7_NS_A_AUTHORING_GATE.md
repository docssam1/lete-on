# Grade 7 `7.NS.A` authoring gate

Status: **planning only — no `7.NS.A` student item, answer key, diagnostic slot, or workbook route is released**.

`7.NS.A` is the next GFIELD unit after published `7.RP.A` because it is the next cluster in the local Grade 7 map. This is a GFIELD instructional sequence, not an official pacing, placement, or promotion rule.

## Source boundary

- Authority: Common Core State Standards for Mathematics, Grade 7, The Number System, official PDF pages 48–49.
- Canonical source: <https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf>
- Scope to preserve before authoring:
  - `7.NS.A.1a–d`: addition and subtraction of rational numbers, opposites, horizontal or vertical number-line representations, additive inverse, absolute difference, and properties of operations.
  - `7.NS.A.2a–d`: multiplication and division of rational numbers, sign rules grounded in operation properties, nonzero divisors, quotient interpretation, and terminating/repeating decimal forms.
  - `7.NS.A.3`: real-world and mathematical four-operation rational-number problems.

The standard identifies what learners should understand and do. It does not define GFIELD pacing, intervention, automatic diagnosis thresholds, school advancement, or a competition result.

## Required evidence contract before any item is written

| Item family | Official focus | Student-visible representation | Independent check |
| --- | --- | --- | --- |
| Opposites and addition/subtraction | `7.NS.A.1a–d` | declared rational points on a horizontal or vertical number line; no target answer marker | normalized rational arithmetic, inverse, and absolute-difference checks |
| Signed multiplication and division | `7.NS.A.2a–c` | signed factors, quotient context, or sign-pattern table without revealing the result | exact rational product/quotient with nonzero-divisor validation |
| Decimal form | `7.NS.A.2d` | fraction/long-division state and a terminating-or-repeating classification | reduced denominator factor test plus exact decimal-period check |
| Contextual rational operations | `7.NS.A.3` | temperature, elevation, balance, or directed-change model with units | independent equation, unit/order check, and reverse calculation |

Every public candidate must have a stable ID; one granular standard tag; three learner-facing locale records (`ko`, `en`, `zh-Hans`); an original-content declaration; one answer cardinality; an independently solved answer ledger; and one misconception code. Any item that needs an unstated convention (for example, a repeating-decimal notation or a real-world direction) stays `검수 대기` rather than being guessed into release.

## Proposed workbook shape — held for `SOL 울트라` authoring

This is a sizing proposal, not a release promise:

- 36 original GFIELD-authored student workbook items: 10 rational addition/subtraction, 8 number-line/opposites/absolute difference, 10 signed multiplication/division, 4 decimal-form items, and 4 contextual mixed-operation items.
- 8 recheck items with structures distinct from the 36 workbook items.
- Student edition: prompt, an exact calculated visual when a number line or sign model is useful, response control, and post-attempt hint only. It contains no answer value, solution ray, teacher method, or protected diagnostic conclusion.
- Teacher edition: separately rendered answer key, method, misconception cue, and a prompt for explanation/model choice that a selected answer alone cannot judge.
- Delivery: one HTML generator with A4 and US Letter print modes. PDF is a rendered QA export, not a separate source product.

## Representation and language guardrails

1. Number lines must come from declared rational coordinates through the shared renderer. Tick positions, axis labels, direction, and endpoint styles must be computed rather than eye-placed.
2. A number line may show givens and operation direction, but a student visual must not mark the resulting target location before an authentic attempt.
3. Keep `opposite`, `additive inverse`, `absolute value`, `terminating decimal`, and `repeating decimal` distinct in all three locales. Do not translate a Korean school term literally when its Grade 7 mathematical meaning differs.
4. A division item must state the nonzero divisor condition through its supplied numbers; zero-divisor or undefined candidates are locked.
5. Exact rational form and decimal form must be separately checked. A decimal classification item cannot be released merely because its arithmetic value appears plausible.

## Release gate

Do not add `7.NS.A` to `unit-workbook.js` or change its catalog status until every condition below is true:

1. The 36+8 source ledger is complete and independently recalculated using an implementation different from the response renderer.
2. Every number-line model is generated from exact point data, and desktop, 390px, A4, and Letter rendering has been inspected.
3. Student and teacher DOM checks prove answer keys, method text, and answer visuals do not leak into student mode.
4. The Grade 7 completion key is distinct from every Grade 6 and `7.RP.A` key; a direct recheck URL and injected query cannot bypass completion.
5. Focused content, route, responsive, print, deployment, and live URL checks are recorded before a public status change.

## Explicit non-goals for the first release

- No claim of SASMO, Math Kangaroo, AMC, school placement, or promotion prediction.
- No third-party contest question, source scan, official answer key, or student record in the public workbook.
- No automated scoring of a learner's written explanation, use of units, or number-line construction without a teacher review path.
