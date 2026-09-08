# Unit Area Studio

Original practice built around unit-area learning, separate from perimeter, formal similarity, and the existing angle activities. Source-review scope remains documented in `../../docs/ANGLE_STUDIO_SOURCE_REVIEW.md`; no source pages, official questions, or teacher answer keys are copied here.

## Learning Design

- Whole squares: count congruent area units, with optional individual counting marks.
- Half squares: select two congruent half-square triangles at a time. Complete every pair before submitting the total area. Pairs can be undone and rearranged.
- Compare: compare A and B with a shared unit. A learner-controlled alignment view repositions the same unit squares without adding, removing, or resizing them. Equal and unequal cases are included.
- Build: shade an exact target number of squares. Every in-bounds, non-duplicate, side-connected construction with the target area is accepted. Holes are not prohibited. The published example is not an exclusive answer.

The primary job is solving one visual problem. The interface reuses the existing Angle Studio editorial style: white paper, quiet rules, teal diagrams, blue primary actions, and distinct feedback. No decorative card stack or unrelated story. Mathematical diagrams are the visual assets. The unit is one grid square, not a physical square-centimetre claim.

## Integration

- Four domains, 20 original bank entries each, 5 per session using the existing problem-pool helper.
- Game languages: Korean, English, Chinese, Japanese.
- `?domain=whole|halves|compare|build`, or `?level=1|2|3|4`.
- `?practice=1` advances to the next disjoint five-problem round.
- `../../worksheet/unit-area/` shares the same data and renderer, with a cover and up to 20 problems.
- Shape Garden lists the four activities in Course 7. Progress only updates the `unitArea` namespace through the established profile helper; no official score is generated.

## Verification

Run `node geometry/games/unit-area/core.selftest.mjs` and `node geometry/games/unit-area/unit-area.browsercheck.mjs` from the repository root. The browser check uses the local server at `http://127.0.0.1:8765` unless `GFIELD_BASE_URL` is set. Worksheet tests are kept in its own directory. Screenshots and QA PDFs stay in ignored `qa-artifacts/` directories.

Local implementation and successful QA do not imply commit, push, or deployment approval.

### Checked On 2026-09-08

- 80 bank entries, including 20 distinct construction targets from 4 through 23.
- Independent area, half-pair, input, and connectivity checks: 4,600 numeric cases and 132,670 construction cases, with 11,413 accepted non-example constructions.
- Full game: 160 solved flows across desktop and 390px; 392 layout checks including four languages at 320px and 768px. Touch, keyboard, undo/reset, language persistence, and existing profile data preservation passed.
- Alignment motion keeps piece identities, count, and dimensions unchanged; reduced motion remains usable.
- SVG browser audit: 3,120 states, 294 half-piece hit checks, and nonblank pixel checks.
- Offline navigation passed for all four domains and the 20-question worksheet. Existing Angle Studio game regression passed.
- Worksheet verification is recorded in its own README and ignored QA output, not in the public bank.
