# Angle Studio

Four separate activities share one original, deterministic problem pool with the worksheet:

- `?domain=estimate` / `?level=1`: 20 angle estimates. Learners estimate before the actual angle and measuring scale are revealed. A difference of at most 10 degrees is described as close, not an exact-answer score.
- `?domain=right-angle` / `?level=2`: 20 dot-board constructions. The given arm is OA; the learner chooses B. Every nonzero integer-grid OB perpendicular to OA is accepted, including tilted right angles. The solution is an example, not a unique answer.
- `?domain=polygon` / `?level=3`: 20 convex-polygon problems, progressing from triangulation to interior-angle sums, missing angles, and explicitly regular polygons. The first five require the learner to join diagonals before checking the triangle count.
- `?domain=parallel` / `?level=4`: 20 corresponding/alternate-position and parallel-angle problems. Six position problems explicitly use nonparallel lines; calculations require a verified parallel condition. Angle labels use an ordinal unit, not a count unit.

Each game session contains five problems. New practice advances to the next non-overlapping set using the existing shared problem-pool helper. All game text supports Korean, English, Chinese, and Japanese. No points, percentile, or official score are calculated.

## Content Boundaries

These are newly authored geometry problems, not transcriptions of workbook pages. The supplied examples informed the learning goals: right-angle construction, angle comparison, and the triangle-based explanation of polygon interior-angle sums. Scans, source paths, and official book answers are not included.

The corresponding/alternate-angle learning sequence was checked against Fields The Classic course 2, G-3, unit 3, printed page 78 (teacher edition 231006). The app uses original diagrams and values, not reproduced textbook questions. Do not infer that angles are equal from their corresponding/alternate positions alone: equality needs the parallel-line condition. Further curriculum candidates are recorded separately in `../../docs/ANGLE_STUDIO_SOURCE_REVIEW.md`; they are not implemented by this release.

The existing Shape Transform Workshop and its worksheet are unchanged. The new worksheet is at `../../worksheet/angle-studio/?domain=all` and supports a cover, strictly separated domain pages, stable answer toggles, and 1-20 problems.

## Checks

- `node geometry/games/angle-studio/basic.selftest.mjs`
- `node geometry/games/angle-studio/polygon.selftest.mjs`
- `node geometry/games/angle-studio/parallel.selftest.mjs`
- `node geometry/games/angle-studio/angle-studio.browsercheck.mjs`
- `node geometry/games/angle-studio/offline.browsercheck.mjs`
- `node geometry/worksheet/angle-studio/workbook.selftest.mjs`
- `node geometry/worksheet/angle-studio/workbook.browsercheck.mjs`

Browser checks use the local server on port 8765 by default; override `GFIELD_BASE_URL` when needed. Screenshots and PDFs stay in ignored `qa-artifacts/` directories. Deploy only after explicit publication approval and a fresh repository/remote-state check.
