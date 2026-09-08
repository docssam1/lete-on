# Unit Area Worksheet

An isolated, original worksheet view over the shared Unit Area problem bank. No problem-bank copy, official questions, private source assets, or learner data are included here. Curriculum alignment is based on representative learning-flow review, not a claim of exhaustive source coverage.

## Learning Flow

1. `whole`: count shaded whole unit squares.
2. `halves`: mark pairs of half squares, record whole/half counts, and find area. Student shapes remain unchanged and unmarked.
3. `compare`: compare the two actual shapes A and B using `<`, `=`, or `>` and explain the reasoning.
4. `build`: draw or shade a connected shape on a blank 6 by 6 grid. The 20 targets are distinct integers from 4 through 23. The answer view is explicitly an example, not the only correct shape; all edge-connected shapes with the requested square count are accepted by the shared grader.

The cover introduces area and the activity sequence. Inside each problem, only the renderer's physically matched unit-square cue is shown: one small square has area 1. No centimetre-squared units are inferred without dimensions.

## Contract And Scope

- Bank: `../../games/unit-area/core.js?v=area-1`.
- Diagram renderer: `../../games/unit-area/render.js?v=area-1`.
- Local `app.js`, `styles.css`, `workbook-core.js`, and `i18n.js`: `area-sheet-1`.
- Existing shared icons are imported read-only from Shape Transform.
- All four domains must be present with 20 problems each. Missing modules, unknown domains, malformed metadata, or rejected bank answers fail closed; printing stays disabled.
- The worksheet does not alter the game modules, other worksheets, navigation, or service-worker configuration. Main-site ownership handles integration and offline caching.

## Selection And Print

Open `/geometry/worksheet/unit-area/` on the existing local server. Options:

- `domain=all|whole|halves|compare|build`; `level=1|2|3|4` is an initial-selection alias.
- `count=1..20`, clamped at 20. Default: 20 for all activities, 10 for a single initial activity.
- `lang=ko|en|zh|ja`, `cover=0|1`, `answers=0|1`.
- `seed` and `round` preserve a selected set through reloads. Changing language, cover, or answers preserves IDs and order. The refresh button advances to the next set.

The fixed teaching order is preserved even if incoming domain metadata is reordered. Each domain starts a fresh page; every page contains at most two problems. An all-domain set of 20 has five problems per domain, 12 body pages, and 13 pages with the cover. A single-domain set of 20 has 10 body pages. The print stylesheet uses actual A4 portrait pages and visible GFIELD watermarks.

## Verification

Run from the repository root:

```powershell
node geometry/worksheet/unit-area/workbook.selftest.mjs
$env:NODE_PATH = "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
node geometry/worksheet/unit-area/workbook.browsercheck.mjs
& "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe" geometry/worksheet/unit-area/pdf-qa.py
node geometry/worksheet/unit-area/qa-contact-sheets.mjs
```

Use `--model-only` for helper-only tests while the shared core is unavailable. Override `GFIELD_BASE_URL` when the server is not `http://127.0.0.1:8765`. PDF rasterization needs the bundled `pdftoppm` on PATH or its executable in `PDFTOPPM`.

The self-test independently checks area/comparison answers, unique drawing targets, connected alternative answers, 4,000 selections, and 640 rendered states. The browser check covers the entire shared bank, all four languages, 1280/768/390px layouts, print layout, stable toggles and reloads, blank student drawings, unmarked student halves, unchanged coordinates, answer examples, raster pixels, keyboard/print controls, and failure states. It records source hashes and fails if sources change during the run.

Browser QA writes student and answer PDFs for each of the four languages, Korean cover-off variants, and a one-question boundary case. `pdf-qa.py` independently verifies physical page sizes, problem numbering per actual PDF page, text boundaries, watermarks, and rasterizes every page. Contact sheets support final visual inspection. All artifacts stay under locally ignored `qa-artifacts/`; the PDFs are QA evidence, not final deliverables.

This folder does not deploy, commit, or push anything. Browser tests block service workers to validate current source files; full-site offline verification belongs to the main integration task.

### Verified Snapshot

- Self-test: 4,000 selections, 80 independently checked problems, 40 connected alternative drawing answers, and 640 rendered states passed. Build targets are exactly 4 through 23.
- Browser: 3,271 problem-layout checks, 2,820 content checks, and 40 raster-pixel checks passed at 1280/768/390px and A4 print size, across Korean, English, Chinese, and Japanese. Browser errors: none.
- Actual PDFs: 11 files, 129 pages, 201 numbered question appearances, and 38,269 text-character boundaries passed. All 129 pages were rasterized and inspected in contact sheets, with dense answer pages inspected at full page size.
- Cover-on all-domain student/answer PDFs are 13 pages in every language. Cover-off Korean variants are 12 pages; the one-question no-cover boundary case is one page.
- The PDF text-analysis library emitted `FontBBox` descriptor warnings for some browser-embedded font subsets. Page extraction, character-boundary checks, and the rasterized glyphs passed; the warnings were not assertion failures.
- Reproducible details: `qa-artifacts/results.json`, `pdf-validation.json`, and `contact-sheets.json`. These local QA files are ignored by Git and are not distribution assets.
