# Circle Studio

Learner stage: 초등 도형 · 원의 중심, 반지름, 지름과 원 그리기

Original 80-item bank, four domains, five problems per visit, ko/en/zh/ja.
Prerequisites: grid points, cm, doubling and halving even whole numbers.
Separate domains limit reasoning load: center choice, radius/diameter multi-selection,
numeric length, then a fixed-opening compass construction.

## Shared renderer

`render.js?v=circle-1` exports `dimensions` and:

```js
renderProblem(problem, {
  lang: 'ko', reveal: false, interactive: false,
  selectedPoint: null, selectedIds: [],
  construction: null, traceProgress: 0
});
```

The result is standalone SVG, viewBox `0 0 400 400`; grid coordinates map to
`32 + 56 * coordinate`. A4 worksheets use 71.4285714 mm SVG dimensions to obtain
10 mm steps. All circles use a fixed equal scale. Parts have four independent
diagrams. Student center questions have no answer-bearing mark. Student draw
questions have only grid and the given O until a construction is supplied.

`construction` always represents the actual attempt, even when incorrect.
`traceProgress=0` shows only its pin and arm, partial progress shows a circular
arc, and 1 shows a complete circle. `reveal:true` without construction is the
explicit worksheet answer view. A supplied construction is never replaced.
The game prevents tracing when the chosen center/opening would take the circle
outside grid 0..6, with localized feedback and editable controls. The pure renderer
does not change supplied coordinates; callers must gate out-of-grid construction
before starting a trace. No expected construction is substituted.

## Interaction and QA contract

- `#board[data-problem-id][data-trace-state]`, SVG `[data-domain][data-reveal]`.
- `[data-point="x,y"]`: 49 roving grid buttons; 55 SVG-unit targets (44 px at 320).
- `[data-circle="given|part"]`, `[data-part="A|B|C|D"]`, `[data-segment]`.
- `[data-given-center]`, `[data-selected-center]`, `[data-given-length]`, `[data-answer-length]`.
- `[data-construction-center][data-construction-radius][data-trace-progress]`.
- `[data-compass-arm]`, `[data-compass-tip]`, `[data-trace="partial|complete"]`.
- Native `#choice-A` through `#choice-D`, numeric `#length`, stepper `#decrease` / `#increase` / `#radius`.
- `#trace` starts a 1600 ms requestAnimationFrame sweep with fixed radius.
- `#cancel`, `#undo`, `#retry`, changed center/opening, and language changes clear
  unfinished traces and invalidate pending animation callbacks. Accepted answers
  retain the actual completed trace across language changes.
- `#check` is disabled for drawing until trace progress is exactly 1. Reduced
  motion follows the same ready-to-complete state transition without a sweep.

Profile and pool namespace: `circle-studio`; existing shared additive profile,
question-pool, icon and PWA helpers are reused. Runtime version: `circle-1`.
Transitive imports inside shared helpers retain the shared owners' versions.

## Checks

Run `node geometry/games/circle-studio/browsercheck.mjs` and
`node geometry/games/circle-studio/offline.browsercheck.mjs` against an existing
local server (default `http://127.0.0.1:8765`, override `GFIELD_BASE_URL`).
Browser evidence belongs in ignored `qa-artifacts/`. Offline checks require the
parent-owned service worker integration. Independent mathematical, rendering and
integration audits are parent-owned; they are not replaced by these game checks.
No dependencies are downloaded by these checks. Local QA is not release approval.

## Local evidence (2026-09-09)

- `browsercheck.mjs`: 160 completed flows, 376 layout checks, 165 negative
  submissions, 48 animation beats, six interruption cases, 64 out-of-grid guards;
  ko/en/zh/ja and 320/390/768/1280 px. Touch, keyboard, reduced motion, additive
  profile preservation and storage failure recovery passed. Browser errors: zero.
- The full suite was rerun after both the final parts O-label adjustment and the
  page lifecycle fix. Three synthetic persisted pagehide/pageshow cases passed:
  complete ungraded remains gradeable, accepted remains complete, and an interrupted
  sweep clears without a late callback. Actual browser BFCache navigation is not
  claimed by these synthetic lifecycle checks.
- The six interruption cases are cancel, undo, reset, language, chosen center and
  opening. Each is checked after the old animation would otherwise have finished.
- `offline.browsercheck.mjs`: a fresh browser context visits only Shape Garden,
  installs its service worker, then goes offline before its first Circle Studio
  visit. Four domains in four languages complete 16 correct submissions, with no
  game dependency warming and no browser errors.
- Parent-owned `render.audit.mjs`, run read-only after the final label adjustment:
  640 static states, 3,500 fixed-radius construction beats, 5,420 label bounds,
  1,960 candidate controls and three negative-control checks passed.
- The final parts O-label adjustment did not change segments or grading. Its
  latest 320 px Japanese screenshot and XML parsing were also checked separately;
  no overflow or XML errors. Evidence:
  `qa-artifacts/parts-final-320-ja.png`.
- Final tested runtime SHA-256: `app.js`
  `c36aa7a756c3f929abd248a7e3439adc80fe85dd3cb279ab20738c44104f7f74`;
  `render.js` `d4fc4d5ae8cf51715c85dbca35377066f24da15b6d6d0d6bb1b00c580b46dc31`.
- Reports: `qa-artifacts/game-report.json` (includes runtime SHA-256 values) and
  `qa-artifacts/offline-report.json`. Screenshots include initial/accepted states,
  all four languages at 320/768 px and `compass-mid-sweep.png`.
- No core, worksheet, parent test, service worker or release files were edited by
  the game implementer. Parent handles independent mathematics, integration,
  worksheet final verification and release. No commit, push or deployment here.
