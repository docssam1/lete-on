# Perimeter Studio Worksheet

Independent printable worksheet for the newly authored Perimeter Studio bank.
Only this directory belongs to the worksheet implementation. Game UI, renderer,
core, service worker, garden integration, root documentation, and deployment are
owned separately and are not edited here.

## Experience

- Opens directly into a complete worksheet, not a landing page.
- Languages: `ko`, `en`, `zh`, `ja`; titles match the game.
- Activities: `all`, `boundary`, `joined`, `compare`, `build`.
- At most 20 questions in total. Default: all activities, 20 questions, cover on,
  answers off. A single selected activity defaults to 10 questions.
- Cover, answer, and language controls preserve the exact selected IDs and order.
- Seed and round are kept in the URL, so reload restores the same selection.
- New problems advances the stable permutation. Four rounds of all/20 visit all
  80 bank questions. Each domain has 20 questions.
- Back link carries the selected domain and language to the perimeter game.
- Missing core or renderer produces a visible error and disables printing. It
  does not silently substitute another bank.

## Learning Fit

Korean learner-fit label: **초등 기초 도형 · 단위길이와 둘레**.

Readiness and learning criteria: measure one grid side as one unit of length;
count the complete outside boundary, including notches; exclude internal shared
edges; compare perimeters rather than filled space; create a different shape
with the same perimeter.

Construction answers are not unique. Every accepted shape must have the same
perimeter as reference A, be side-connected and hole-free, and differ from A
after accounting for translation, rotation, and reflection. The answer view
shows one example and the core explanation explicitly accepts other valid
shapes. The worksheet does not introduce its own interactive grader.

No original source pages, copied textbook diagrams, source fingerprints,
official answer keys, or learner records are included.

## A4 Layout

- A4 portrait, explicit page boundaries, two questions per activity page.
- Domains never share a page, even when a domain ends with one question.
- All/20 has five questions per domain: 12 body pages, **13 with the cover**.
  A single-domain/20 has 10 body pages, **11 with the cover**.
- Folios count the actual printed pages, including the optional cover. Question
  numbering remains unchanged when the cover is toggled.
- All SVGs use the same coordinate-to-print scale: `65 / 324` mm per SVG unit.
  Each 324-unit board occupies 65mm; each 44-unit grid side is about 8.83mm.
- Paired print diagrams use `layout: "horizontal"`: 130mm wide, 71.82mm tall;
  comparison answers include the renderer's extra strips and are 88.27mm tall.
  Neither the compact renderer mode nor reduced per-board sizing is used.
- Paired responses sit beneath the diagrams. Construction conditions remain in
  the original core prompt; the answer view retains the entire core solution.
- At screen widths up to 600px, a separate static vertical SVG is shown. Print
  always selects the horizontal SVG, including printing from a 390px viewport.
- The cover-only `COVER_SAMPLE` is authored separately from the bank. It has
  perimeter 28 and is checked against every bank reference, comparison shape,
  construction example, and joined component under all geometric symmetries.
  It is never selected or numbered as a problem, and its answer is not printed.

## Shared Contract

Imports:

```text
../../games/perimeter/core.js?v=perimeter-1
../../games/perimeter/render.js?v=perimeter-1
```

Required core exports: `domains`, `problemsFor`, `promptFor`, `solutionFor`,
`answerFor`. Bank coordinates are `{x, y}` objects on a 6 by 6 grid.

The renderer exports `renderProblem(p, options)` and returns standalone valid
SVG. `staticRenderOptions` passes `lang`, `reveal`, `interactive: false`, and
`layout`. It deliberately omits `selectedCells`, so the renderer supplies
`p.example` in build answer mode. No game marks or interactive controls are
printed. SVGs are parsed as XML and must have valid view boxes.

All worksheet resource query versions are **`perimeter-sheet-1`**:
`app.js`, `styles.css`, `workbook-core.js`, and `i18n.js`.

Read-only existing icon dependencies are the shape-transform Lucide icon helper
and worksheet printer icon. No old worksheet module is imported or changed.

## Selection API

`workbook-core.js` exports `normalizeCount`, `normalizeLanguage`,
`initialSelection`, `orderedDomains`, `validateBank`, `chooseEntries`,
`groupPages`, `problemsPerPage`, `comparisonSymbol`, `staticRenderOptions`, and
`COVER_SAMPLE`, alongside limits and ordered domain/language constants.

`chooseEntries(api, selection, count, {seed, round})` returns domain-grouped
`{domain, problem}` entries. With `all`, quotas differ by no more than one.
`groupPages(entries)` preserves order and never fills a page with another domain.

Supported query parameters: `domain`, legacy `level`, `count`, `lang`, `cover`,
`answers`, `seed`, `round`. An explicit domain takes precedence over level.

## Local Verification

The existing `http://127.0.0.1:8765` server was verified against this repository.
Use the repository root for these commands:

```powershell
node geometry/worksheet/perimeter/workbook.selftest.mjs
$env:NODE_PATH = 'C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node geometry/worksheet/perimeter/workbook.browsercheck.mjs
& 'C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' geometry/worksheet/perimeter/pdf-qa.py
git diff --check -- geometry/worksheet/perimeter
```

`GFIELD_BASE_URL` can override the browser test's server. `PDFTOPPM` can override
the PDF rasterizer. All generated reports, screenshots, and PDFs stay in the
locally ignored `qa-artifacts/` directory.

The self-test independently cancels boundary edges, checks connectivity and
holes, and normalizes the eight geometric symmetries. It also tests 4,000
selections, every problem in four languages and two answer states, 160 valid
example transformations, cover distinctness, and horizontal/vertical rendering.

Browser QA covers desktop 1280px, tablet 768px, mobile 390px, four languages,
all 80 questions, stable selection across toggles and reload, answer visibility,
blank construction grids, identical diagram scale, 65mm minimum board width,
nonblank SVG pixels, clipping/overlap, strict domain pagination, control bounds,
keyboard focus, print dispatch, missing modules, and invalid domains. It writes
11 PDFs totaling 129 pages. The separate PDF audit checks A4 sizes, physical
folios, numbered questions, text bounds, and rasterizes all pages.

Current run results are in `qa-artifacts/results.json` and
`qa-artifacts/pdf-validation.json`; source hashes identify the exact shared
files tested. Rerun if the shared renderer or core changes.

Verified locally on 2026-09-09:

- Self-test: 4,000 selections, 80 problems, 640 rendered states, 160 accepted
  example transformations; all passed.
- Browser: 3,231 problem layout checks, 2,780 content checks, 42 nonblank SVG
  pixel checks, all 80 bank IDs visited; no browser errors.
- PDFs: 11 files, 129 pages, 201 numbered question occurrences, 48,372 bounded
  characters; all page sizes, folios, question locations, and renders passed.
- Visual review: desktop cover and construction sheets; 390px construction
  sheet; rasterized Korean joined-shape student page, English comparison answer
  page, Chinese cover, and Japanese construction answer page.
- The PDF text reader emits `FontBBox` metadata warnings for some embedded
  fonts. Extraction and bounds checks completed; rendered pages were also
  inspected, rather than treating text extraction alone as visual evidence.

## Limits

This is local QA, not a deployment claim. Physical printer scaling and browser
print-dialog overrides are outside the automated checks; use A4 and actual size.
Offline caching and game-to-worksheet navigation belong to the parent-owned
integration. No service-worker, staging, commit, push, or deployment operation
is performed by this worksheet implementation.
