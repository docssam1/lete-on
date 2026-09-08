# Quadrilateral Studio: Learning and Verification Contract

Date: 2026-09-09. Work key: `geometry.quadrilateral-properties`.
Learner stage: `초등 도형 · 사각형의 성질과 분류`.

## Source and Scope

The preceding curriculum review identified quadrilateral properties in Fields course 2, G1 unit 4, printed page 116. That is a curriculum-level connection, not a claim that these new questions reproduce a textbook. The user also supplied elementary quadrilateral-property examples distinguishing equal sides, right angles, parallel sides, and inclusion between shape classes.

As a second definition reference, the Daedeok Elementary School supplementary mathematics material hosted by the National Center for Multicultural Education covers quadrilaterals in PDF pages 22-26: [primary educational material](https://file.edu4mc.or.kr/nime_upload/attach/1000000/1001800/20160118074228-1344-1.pdf). Its text defines the classes and presents relationships between them. This release uses original coordinates, prompts and diagrams, not its figures, questions, or answers. The web text was accessible; the web screenshot endpoint failed, so do not describe this as a newly completed visual audit of those original pages.

This is enrichment following recognition of right angles and parallel lines. It is not a claim that the full classification hierarchy is mandatory in any current national grade curriculum. Existing geoboard partition/counting and hidden-shape activities do not provide this learning action, so they remain unchanged.

## Definitions

- Only simple, strictly convex quadrilaterals are graded in this activity. Vertices A, B, C, D follow the boundary order; repeated points, straight corners and crossed sides are not valid completions.
- Trapezoid: at least one pair of opposite sides is parallel. This inclusive convention is stated in every language, rather than silently relying on a locale's usual convention.
- Parallelogram: both pairs of opposite sides are parallel.
- Rectangle: all four angles are right angles.
- Rhombus: all four sides have equal length.
- Square: all four angles are right angles and all four sides have equal length.

Consequently a square satisfies all five named classes. A rectangle need not be a rhombus, and a rhombus need not be a rectangle. Classification asks for all matching names, not one most-specific name. `None` means none of the listed choices, not that the figure ceases to be a quadrilateral.

## Four Separate Activities

1. Parallel sides: select all parallel opposite-side pairs among AB/CD and BC/DA. A `none` choice makes an empty mathematical answer an explicit learner response.
2. Right angles: select every right-angle vertex A-D, or explicitly select none. Turning a figure does not change the answer.
3. Classification: use the given exact grid and geometric marks to select all applicable names. Equal-length ticks, parallel marks and right-angle marks come from the same coordinate model as the grader.
4. Completion: A, B and C are fixed in boundary order. Choose D on the 7 by 7 dot grid to complete the requested class. Every valid point is accepted; an answer example is not an exhaustive answer key. Special cases count unless an additional condition is explicitly stated.

Each domain has 20 original, immutable problems. Five problems form a game session. The shared problem pool and the worksheet use the same stable IDs. The worksheet allows 1-20 problems, a cover, independent answer visibility, four languages and domain-separated A4 pages.

## Geometry and Interaction

All coordinates are integers from 0 through 6 and use a fixed, equally spaced grid. The renderer must not stretch a figure or auto-fit different figures to different horizontal and vertical scales. Geometry determines validity, equality, right angles and parallelism; color or approximate appearance is never the grader.

The student parallel/right-angle views do not include solved property marks. Classification marks are given evidence, not a completed list of class answers. A student completion view has no suggested D or completed closing edges before the learner chooses. Revealing an interactive answer keeps the learner's accepted D; a printed answer shows one example and says other valid points are accepted.

Native checkboxes handle multiple answers, with an exclusive `none` choice. Dot/vertex controls have keyboard navigation, visible focus and touch-sized targets. Language changes preserve the current response; reset, back, next and completion keep their established Geometry meanings. Only the new profile namespace is updated, without official scores or learner-data uploads.

## Required Gates

| Gate | Method | Passing condition |
|---|---|---|
| Source/scope | Current activity and reference comparison | Original questions; no duplicate property-classification module or copied private material |
| Math | Exact coordinate checks plus independent oracle | Every answer set and all 49 completion candidates agree |
| Ambiguity | Exhaustive choice subsets and candidate enumeration | All valid answers accepted; unanswered, malformed and wrong answers rejected |
| Learner fit | `learner-fit` for the exact stage above | Language, representations, prerequisites, reasoning-load and response-mode recorded |
| Observability | Student/reveal SVG inspection | No unchosen D or answer-state marks; consistent units and labels |
| Interaction | Desktop/mobile plus keyboard/touch | Full question and session flows; stable response across language; no existing progress loss |
| Worksheet | Stable IDs, four languages, A4/PDF | Cover, at most 20 questions, ordered separate domain pages, no clipping or distorted figures |
| Regression | Existing measurement modules and offline | Existing activities remain usable |
| Publication | Scoped diff, deployment status and live read-back | Only approved Geometry files published and live behavior verified |

Work, evidence and release status remain separate until the actual tests and deployment complete. Hourly automation was cancelled by the user; continuing this work does not authorize recreating it.
