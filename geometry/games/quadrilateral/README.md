# Quadrilateral Studio

Original four-language geometry activity. Learner stage: `초등 도형 · 사각형의 성질과 분류`.

Four independent domains (`parallel`, `right`, `classify`, `build`) each contain 20 core-owned problems. A visit uses `sessionProblems("quadrilateral", domain.level, bank, 5)`. Only `saveGameProgress("quadrilateral", ...)` updates game progress; other profile namespaces are preserved. The practice URL advances that domain's five-problem group.

## Learning Contract

- Parallel: choose all parallel opposite-side pairs, or explicitly choose none.
- Right: choose all right-angle vertices, through checkboxes or the diagram.
- Classify: choose every applicable name. This is enrichment after recognizing parallel lines and right angles, not a claim about mandatory grade-level inclusion relations.
- Build: choose D on the fixed 7 by 7 grid. All convex, correctly ordered completions satisfying the target and any explicit extra condition are accepted. The example is not the sole answer.
- The inclusive trapezoid convention is visible once in the classification/build conditions in every language: at least one parallel opposite-side pair. A square can have all five class names.
- `none` is exclusive of other checkbox choices. Empty selection is unanswered, not an implicit none answer.

## Renderer Contract

`render.js` exports `renderProblem(p, {lang, reveal=false, interactive=false, selectedPoint, selectedIds=[]})` and `dimensions`.

The result is a well-formed standalone SVG with `viewBox="0 0 400 400"`. Coordinates 0 through 6 map to 32 through 368 on both axes, with step 56. The diagram does not auto-fit or distort. A printed grid of 75 mm needs an SVG width of 89.285714 mm.

Student build output contains A/B/C only until a learner supplies D. Reveal uses the supplied D, otherwise `p.example`. An occupied fixed point remains a rejected response; the renderer keeps the outline open and omits the duplicate D label. Other invalid attempts remain visible for feedback. Parallel/right answers have no preanswer property marks. Classification's equal-length ticks, right-angle marks and parallel arrows are given geometry-derived clues, with a localized legend.

Interactive point hit rectangles are 55 SVG units on a 56-unit grid. The full-width 320 px mobile board provides 44 px targets. Arrow keys use a roving tab stop; Enter/Space selects. Language changes preserve selection and the roving position. Undo restores the preceding response, reset clears the current response, next clears only the new problem, and dismissing completion preserves the solved board.

## Learner-Fit Evidence Criteria

| Criterion | Design and verification |
| --- | --- |
| language | ko/en/zh/ja from the outset; full core question and conditions preserved; inclusive definition explicit |
| representations | fixed equal-scale grid, labeled ordered vertices, marks only in the appropriate stage; all 49 attempted D positions rendered |
| prerequisites | recognizing parallel sides and right angles; classification is enrichment |
| reasoning-load | separate domains; one target or one property family per problem; five problems per visit |
| response-mode | genuine multi-select or direct construction, native checkboxes, touch and keyboard; no numeric entry |

## Validation

Run `node geometry/games/quadrilateral/browsercheck.mjs` against the repository served at `http://127.0.0.1:8765`, or set `GFIELD_BASE_URL`. It checks 80 problems at desktop and 390 px, extra 320/768 layouts in four languages, correct/incorrect responses, alternative constructions, occupied points, no answer leakage, exact IDs, response persistence, completion, profile preservation, touch/keyboard, and 3,920 attempted-D renderings. Screenshots and the final JSON report go into ignored `qa-artifacts/`.

Run `node geometry/games/quadrilateral/offline.browsercheck.mjs` only with the parent-owned service worker integration present. It checks all four domains in all four languages offline. Core tests, independent holdout and renderer audit are owned by other agents; this UI module does not modify them.

Local QA is separate from release. This work does not commit, push, merge, deploy, recreate automation, or change worksheet/integration files.

### Verified 2026-09-09

- Final versioned runtime (`?v=quad-1`): 160 completed problem flows, 352 layout checks, six non-example accepted construction flows, and 3,920 attempted-D renderings passed. No page errors, label overlap or label overflow in the attempted-D audit.
- 320 px touch targets, keyboard roving, exclusive none, reset/undo/language/next/completion state, exact IDs and unrelated profile preservation passed. The raster check found 3,496 colored pixels in the sampled diagram.
- Offline: four domains in four languages, with all 16 correct submissions accepted using the parent-integrated service worker.
- Evidence: `qa-artifacts/game-report.json`, `qa-artifacts/offline-report.json`, and desktop/mobile screenshots. These artifacts are ignored and are not published.
