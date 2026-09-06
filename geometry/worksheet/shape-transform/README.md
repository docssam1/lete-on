# Shape Transform Workbook

This folder owns the Korean worksheet only. It imports `levels` and
`validateLevels` from `../../games/shape-transform/levels.js`. It neither
generates bank questions nor imports the game renderer.

## Selection and Print Contract

- Default: domain 1, 10 questions. `?level=1` through `?level=5` select a domain.
- `?level=all` explicitly selects all domains with 20 questions.
- The input accepts 1-20. A selected domain has 10 available questions; requests
  above availability visibly become 10 without changing the selected domain.
- All-domain selection distributes the requested count as evenly as possible.
  Twenty questions means 4 unique questions from each of the 5 domains.
- Every printed body page contains exactly one domain, with its own heading.
  Twenty all-domain questions produce **5 body pages plus an optional cover**.
  There is no forced page total. Ten selected-domain questions use three
  body pages plus an optional cover. Pagination budgets 48 mm for a choice
  item and 73 mm for a drawing item; it never mixes domains or exceeds five
  items per page. A final pair of drawing items stays together when possible.
- Cover and answer toggles preserve the exact selected IDs and order. Refresh
  changes order/content while retaining domain, count, cover, and answer mode.
- Each domain progresses automatically from choice to drawing: one item means
  one choice item; two or three items end in one drawing; four or more end in
  two drawings. There is no extra learner setting. The final drawing is a
  closed plane shape whenever available; a pair includes an open bent line.
- Entries retain their original `problem.id`. `responseMode` is `choice` or
  `draw`; drawing entries additionally contain a separate `drawing` record.

## Teaching Design

The cover uses actual example silhouettes, quiet rules, a subject title, and
name/date lines. Examples are separate from assessed bank problems. Choice
items retain one target and three choices at identical 30 mm square sizes.
Drawing items have a target and an empty response grid at identical **55 mm**
square sizes. The inner 100-unit grid is 50 mm wide, giving 5 mm grid cells.
Every SVG uses the same 110-unit square viewBox and ten-unit grid. Mobile
choice boards are 112 px, while drawing boards are 220 px and stack vertically.
The shape fill never identifies the answer. Cover and body watermarks remain
visible in student and answer output, even without a student name.

Each question has a short, related evidence action: circle one differing bend,
trace point A's translation, mark its rotation path about O, or emphasize and
compare corresponding edge AB. Rotation A is a moving vertex, not the pivot.
Answer mode adds actual source outlines, displacement/rotation arrows, or
corresponding edges and rays. Observation answers mark the small changed
section in one incorrect choice. No story or unrelated extra task is added.

Drawing actions are: reproduce the outline at the same position, translate,
turn about O, double, and halve. Korean reduction language uses `줄이기` and
`절반으로 줄인 도형`; no slash fractions are printed. Rotation cues come from
the unchanged shared `rotation-cue.js`, with exact quarter/half-circle arcs.

## Drawing Coordinates and Answer Isolation

`drawing-problems.js` derives a separate whole-grid representation from each
verified owner-designed problem. It is **not the exact original bank geometry**:
line positions can change to make paper drawing possible. It preserves corner
count, closed/open form, horizontal/vertical edge direction, ordered line
positions, connectivity, and the original domain operation. Original bank
questions and their choice geometry are never changed.

The recorded `ordered-whole-grid-v1` derivation contains `sourceProblemId`,
`sourceRef`, a `sourceTarget` snapshot, explicit `xMap`/`yMap`, `gridStep`, the
derived `target`, and independently verified `answer` coordinates. Strictly
increasing axis maps cannot collapse corners. Pivots remain at (50,50).
Enlargement starts within 30..70; halving starts on offsets divisible by 20
from the pivot. Target and answer vertices therefore all lie on whole ten-unit
grid intersections, with one-cell margins and no fractional-cell copying.

The answer generator uses exact coordinate swap/sign rules. A separate
trigonometric matrix validator verifies all answers, provenance, monotonic
maps, nonzero orthogonal edges, bounds, and nonintersection. Unrepresentable
geometry fails closed rather than silently rounding or dropping vertices.

Student response SVGs contain only grid lines/dots and O when required. They
contain no answer path, source ghost, answer vertex, coordinate data attribute,
hidden alternative, or revealing alt text. Only answer mode adds the current
derived answer and the actual operation overlay. Data attributes distinguish
`bank-original` from `ordered-whole-grid-v1`; technical provenance is not
printed for learners.

## Verification

From the repository root:

```powershell
node geometry/worksheet/shape-transform/workbook.selftest.mjs
node geometry/worksheet/shape-transform/workbook.browsercheck.mjs
```

The browser check defaults to `http://127.0.0.1:8765`; set `GFIELD_BASE_URL` to
override it. It is bounded and closes Chromium on failure. It renders all 50
originals and all 50 derived drawing representations at 390/768/1280 px in
both student and answer modes: **600 question-layout checks**. Checks include
literal SVG scale, response-grid answer isolation, exact source/answer paths,
rotation arcs, domain grouping, cap notices, progression, and stable toggles.
The normal mixed worksheet is checked separately from these rendering fixtures.

Actual A4 PDF counts:

| Artifact | Pages including cover when enabled |
| --- | --- |
| `selected10-student.pdf` | 4 |
| `selected10-answers.pdf` | 4 |
| `all20-student.pdf` | 6 |
| `all20-answers.pdf` | 6 |
| `all20-no-cover.pdf` | 5 |
| `single1-no-cover.pdf` | 1 |

Artifacts are written only to ignored `qa-artifacts/drawing/`. `results.json`
records PDF IDs, response modes, layout results and console errors.
`coordinate-verification.json` contains all 50 original-to-derived coordinate
records and verified answer coordinates. PNGs cover the five domains and mobile;
actual PDF pages were also rendered with Poppler and inspected.

The current answer PDF's page 6 was additionally verified with independent
PDFium renders at a 1600 px page height and at 180 dpi. Both retain the Korean
heading and all four question prompts; PDF text extraction also found all four
`절반으로 줄인 도형` prompts. See `pdfium-verification.json` and
`pdfium-answer-6-1600.png` / `pdfium-answer-6-180dpi.png` in the same artifact
folder. A reported Poppler scale-to-size glyph omission was not reproduced in
PDFium or the high-dpi render. No font code was changed in response.

The focused self-test checks 3,000 selections and independently recomputes
all 50 original and 50 derived coordinate transformations, with 100 corrupted
answer/provenance negative controls. It also verifies bank immutability.
This is separate from game testing. Game tests must expect mixed response
modes and the updated four-page selected-domain booklet.

## Files

- `index.html`: controls, cover, and page template
- `app.js`: rendering, domain prompts, visual proof, stable selection state
- `workbook-core.js`: selection, pagination, and geometry helpers
- `drawing-problems.js`: explicit whole-grid derivation and independent validator
- `styles.css`: editorial screen, mobile, and A4 layout
- `plane-shapes.css`: identical diagram styling and answer annotations
- `workbook.selftest.mjs`: focused bank/selection contract checks
- `workbook.browsercheck.mjs`: bounded browser and PDF checks
- `.gitignore`: excludes generated QA artifacts
- `icons/arrow-left.svg`, `icons/shuffle.svg`, `icons/printer.svg`: Lucide 0.468.0
- `icons/LICENSE`: upstream Lucide license
- `README.md`: this handoff

No game, bank, shared file, original source, commit, push, or deployment is
part of this worksheet-only change.
