# Straight Paper Cuts

## Intent And Source Boundary

Added on 2026-11-03 following the user's four image references and clarification: add the photographed straight-cut types, not another fold/unfold type.

This is separate from `paper-fold/?activity=cut-shape`. No folding is performed here. The two types are:

1. Inspect paper already cut as shown, and count the resulting requested shapes (12 questions).
2. From blank paper or the shown existing cut, add exactly one full straight cut to reach the target shape counts (12 questions).

Reference structures covered: two quadrilaterals; triangle + quadrilateral; triangle + pentagon; an existing diagonal extended by another cut to four triangles; an existing vertical cut extended to two triangles + one quadrilateral; an off-center vertical cut extended to four quadrilaterals; an existing horizontal cut extended to one triangle + two quadrilaterals.

These are normalized structural adaptations and rotated extensions, not pixel-exact reproductions or official textbook answer transcriptions. Some cropped references omit their full instructions; the explicit game contract is one additional cut through the shown paper. Original scans are not in the public repository. Teacher/content approval remains pending.

## Contract

- `?type=count`: already-separated pieces appear immediately with a past-tense problem statement. The learner does not have to perform a cut before answering. No answer or numbered solution appears before a correct submission.
- Count responses use Cube Town's selected answer-display / five-column 0-9 number-pad pattern, not native number spinners. Only requested shapes have fields; all fields start as `?`, not zero. Tapping another digit replaces the selected one-digit answer. Clear and keyboard digits/Backspace are supported.
- Problem text in Korean is “색종이를 아래와 같이 잘랐어요.” followed by “나누어진 도형은 각각 몇 개인가요?”; all four locales and the worksheet use the same meaning.
- The question occupies the top mission band, paper sits on the wood board at left, and the answer panel sits at right. Foldy has a reserved coach area; the character does not cover fields, digits or the next button. Portrait stacks the board and answer panel; short landscape keeps both visible.
- `?type=make`: select two boundary points; the shared convex half-plane clipper splits every affected piece along that line. The resulting side counts, not an example path ID, determine correctness.
- All valid endpoint pairs are accepted. The 16 visible quarter-edge anchors give 120 unordered endpoint pairs per question. Hints show only one example and do not award completion.
- Existing cuts are always applied first. Coincident cuts and cuts along a boundary do not count as another cut.
- Six-decimal clipping noise is collapsed before counting sides; tiny numerical corner slivers cannot turn a triangle into a quadrilateral.
- Reuse `paper-fold/reverse-fold.js` clipping, approved wood images, Gmarket/SUIT fonts, material audio and Lucide icons. No new package, model, API, voice or paid service.
- Correct pieces separate visually. Wrong resulting pieces remain visible until retry. Practice is an isolated question snapshot and cannot write progress. Returning restores the original response.
- Storage: only `gfield-straight-paper-cut-v1`. Existing folding and one-stroke records are preserved. Current question index and completion IDs persist; unfinished cuts are not resumed after reload.
- Touch resolves the nearest actual edge point rather than overlapping button rectangles. Keyboard buttons remain available.

## Worksheet

`geometry/worksheet/paper-cut/` shares the same 24-question model. Student and teacher modes each have 8 A4 pages, 3 questions per page. Count questions show the before/after pieces; target questions keep existing lines and leave the added cut to the learner. Teacher mode gives an example line and the resulting pieces, with a multiple-solution note.

## Verification And Status

Skills: learning-ui-editorial + verification reference; gfield-design-system + design-rules for the answer-panel revision; test-playable-web-games; gfield-single-answer-visibility (visible conditions, with intentionally multiple valid constructed lines); PDF skill for A4 rendering review.

- `node geometry/games/paper-cut/model.selftest.mjs`: PASS, 24 questions, 2,880 endpoint checks, 140 accepted cuts, area conservation, fixed expected reference-structure tallies, non-cut rejection, multiple solutions accepted.
- `node geometry/games/paper-cut/paper-cut.browsercheck.mjs`: PASS, 56 touch/keyboard flows, all game questions, four locales, 1280x800 / 390x844 / 844x390 / 320x740 / 600x320; one/two answer fields, five-column keypad, unknown initial values, clear, digit replacement, wrong answers, practice isolation, old progress preservation, visibly loaded character, no keypad/character overlap or answer-panel scrolling. Eight worksheet PDFs independently confirmed as 8 pages each. Current results recorded outside Git.
- Historical local checks also covered pending fold/unfold and one-stroke work. Those unrelated runtime changes are excluded from this release.
- Syntax and diff checks run separately.

Release integration is scoped to the straight-cut game, answer panel, worksheet and studio entry. Git/PR and deployment records establish release status separately from these local test results. Physical-device touch, actual printing, classroom use and teacher approval are not claimed. No full Geometry release run is claimed.

Current cache versions: game app/styles/copy `straight-cut-2`, worksheet app `straight-cut-2`, unchanged model/worksheet CSS `straight-cut-1`, studio script `origami-studio-18`, service worker `gfield-geo-v74-straight-cut-main-20261108`. Cube Town files were inspected as reference and were not modified.
