# Perimeter Studio

Original problems for `초등 기초 도형 · 단위길이와 둘레`, following the perimeter candidate in `../../docs/ANGLE_STUDIO_SOURCE_REVIEW.md`. No textbook questions, source images, official answers, or private source paths are copied into this module. This is a length activity, separate from Unit Area and formal similarity.

## Learning Contract

- Boundary: measure a complete outside boundary in unit grid sides. Optional marks keep track of segments without changing the figure.
- Joined: measure two rectangles as one figure. The dotted shared edge is inside, not part of the perimeter. Selecting it gives feedback and does not add to the count.
- Compare: both figures have the same unit grid. The optional aligned unit-segment rows preserve boundary lengths. Different figures can have equal perimeter.
- Build: make a different, side-connected, hole-free figure with the reference perimeter. Translations, rotations and reflections alone do not count as a different shape. Any valid alternative is accepted, not only the published example.

The drawing is mathematical content, not decoration. A grid side has length 1; it is not a claim that a displayed or printed side measures one physical centimetre. Student diagrams do not show completed build answers. Hints and review use the same model as the question.

## Integration

Four independent domains have 20 stable bank entries each. The established session helper selects five per round and advances through four disjoint rounds. Korean, English, Chinese and Japanese are supported from the data boundary onward. Only the `perimeter` profile namespace is updated; no points or official scores are generated.

Routes: `?domain=boundary|joined|compare|build` or `?level=1|2|3|4`. Shape Garden Course 8 links to these domains. The worksheet at `../../worksheet/perimeter/` uses the same model and renderer, with a cover and up to 20 questions on domain-separated A4 pages.

## Required Gates

`learner-fit` uses learner_stage `초등 기초 도형 · 단위길이와 둘레` and checks language, representations, prerequisites, reasoning-load, and response-mode. Prerequisites are unit-length counting and addition; no area formula or formal congruence proof is required. Construction has a rubric-equivalent answer contract; other domains have a single value or comparison.

Independent numeric and topology checks, negative input controls, desktop/mobile/keyboard/touch checks, four-language layout, offline navigation, and worksheet A4 checks are required. Local QA, publication approval, and deployment are separate states. No remote publication is authorized by a request to continue working.

## Verification Commands

From the repository root:

```
node geometry/games/perimeter/core.selftest.mjs
node geometry/games/perimeter/holdout.selftest.mjs
node geometry/games/perimeter/render.browsercheck.mjs
node geometry/games/perimeter/perimeter.browsercheck.mjs
node geometry/games/perimeter/offline.browsercheck.mjs
node geometry/worksheet/perimeter/workbook.selftest.mjs
node geometry/worksheet/perimeter/workbook.browsercheck.mjs
```

Screenshots and QA reports remain in ignored `qa-artifacts/`. The local base URL defaults to `http://127.0.0.1:8765`; use `GFIELD_BASE_URL` for another test server. Results are recorded after the tests run, not inferred from this checklist.

## Verified Locally: 2026-09-09

- Core: 80 bank problems, 160 figures, 2,168 boundary edges, 1,722 numeric checks, and 3,428 construction checks passed. Construction accepted 175 valid non-example responses and rejected 2,256 congruent responses.
- Independent holdout: all 65,535 nonempty 4x4 subsets at deterministic placements, with 1,310,700 construction grade comparisons, passed without mismatches. This is not exhaustive coverage of all 6x6 shapes or placements.
- SVG: 1,280 static states across four languages, both layouts, and student/answer modes passed XML parsing, boundary-length checks, and answer-visibility checks.
- Game: 160 problem flows, 392 layout checks, eight nonblank pixel checks, touch, keyboard, and profile preservation passed. Paired diagrams use horizontal layout from 390px upward; mobile build targets retain at least 24px hit areas.
- Worksheet: 4,000 selections, 3,231 layout checks, 2,780 content checks, 42 pixel checks, and all 80 bank IDs passed. Eleven A4 PDFs totaling 129 pages passed size, page-number, question-position, text-bound, and raster checks. All/20 uses 12 domain-separated body pages plus a cover.
- Offline: all four perimeter game domains and its worksheet loaded offline. Existing Unit Area and Angle Studio offline checks passed; their focused core regressions also passed.

Representative desktop, 390px mobile, cover, construction, comparison, and multilingual PDF renders were visually reviewed. Physical printers and user-selected print scaling were not tested. This is a local implementation and verification record, not a commit, push, or deployment record.
