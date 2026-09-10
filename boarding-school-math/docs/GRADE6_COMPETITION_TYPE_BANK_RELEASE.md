# Grade 6 Competition Type Bank - release gate

Last reviewed: 2026-09-11

## Scope

This release adds a Grade 6 bridge made of 15 GFIELD-original multiple-choice items. It does not reproduce an official contest problem and does not claim an official score prediction.

| Program | Public type count | Scope reference |
| --- | ---: | --- |
| SASMO Grade 6 | 5 | [SASMO / SIMCC](https://sasmo.simcc.org/) |
| Math Kangaroo Grades 5-6 | 5 | [Math Kangaroo USA curricula](https://mathkangaroo.org/mks/resources/math-kangaroo-curricula/) |
| AMC 8 Bridge | 5 | [MAA AMC](https://maa.org/student-programs/amc/) |

## Type coverage

- SASMO: sum-and-difference model method, alternating patterns, missing-digit divisibility, composite area, ordering logic.
- Math Kangaroo: minimum-weight selection, clock angle, cutout perimeter, shortest grid routes, fraction of a remainder.
- AMC 8 Bridge: successive percent change, one-draw probability, Pythagorean distance, restricted digit arrangements, a linear rule from a table.

## Required gates

- [x] Every item has five distinct choices and exactly one matching answer.
- [x] Fixed answer ledger agrees with the model solver.
- [x] Bounded digit, subset, route, and arrangement cases are independently enumerated.
- [x] Geometry answers agree with independent coordinate or distance calculations.
- [x] Diagrams are generated from declared point and segment models through the shared Geometry SVG renderer.
- [x] Korean, English, and Simplified Chinese prompts, choices, solutions, and teacher error observations are present.
- [x] Student mode hides teacher solutions; teacher mode shows the exact answer, worked solution, and misconception cue.
- [x] Desktop, 390 px mobile, and A4 print rendering have focused browser coverage.
- [x] Home routes for Grade 6 SASMO, Math Kangaroo, and AMC open the corresponding type bank.

## Still locked

- Contest-score prediction, award probability, and placement labels.
- Automatic domain diagnosis and clinic prescription based on these 15 pilot items.
- Random variants and full printable workbooks. Those require separate answer-cardinality, wording, and A4 gates.
- Other grades and AMC 10/12 item banks.
