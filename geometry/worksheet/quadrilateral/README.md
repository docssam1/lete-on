# Quadrilateral Worksheet

Original four-language worksheet, scoped to this directory. Uses the shared original
80-problem bank and SVG renderer in `../../games/quadrilateral/` read-only.
No originals, private sources, learner data, remote writes, or deployment operations.

## Experience

- Titles: 사각형 탐구 / Quadrilateral Studio / 四边形探究 / 四角形の探究.
- Default: all four activities, 20 questions, cover on, answers off.
- Count is clamped to 1..20. All-domain selection balances quotas in domain order.
- Two questions per A4 page, never mixing domains. Five questions per domain means
  three pages each: 12 body pages, 13 including the cover. One question produces
  one body page, or two pages with the cover.
- A seed is persisted in the URL. Refresh advances a deterministic round; four
  default 20-question rounds are disjoint and cover all 80 IDs.
- Language, cover, and answer toggles preserve the selected IDs and round.
- URL keys: `domain`, `count`, `lang`, `cover`, `answers`, `seed`, `round`.
  Legacy `level` is accepted on entry and normalized to `domain`.
- Students check/fill complete sets for parallel sides, right-angle vertices, and
  classification. None is an explicit shared-core option, not a blank response.
- Construction shows only fixed A/B/C. Students mark D and join A-B-C-D-A;
  adjacent ruled space supports explanation. Answer mode shows one valid D and
  explicitly accepts other valid points. It is not a unique-answer task.
- Classification is enrichment after basic parallel/right-angle concepts.
  The inclusive trapezoid convention is an explicit rule of this activity,
  not a claim that a national curriculum mandates complete inclusion relations.
  Shared conditions appear once on every relevant student body page, including
  when the cover is off. Every matching class is accepted.

## Shared Contract

Core: `core.js?v=quad-1`; renderer: `render.js?v=quad-1`.
Local entry resources use `?v=quad-sheet-1`.

`p.index` is zero-based. IDs use `p.index + 1`, padded to two digits.
Construction uses canonical `p.example = [x, y]`, never an alternative field.
`answerFor(p)` returns selection IDs or all valid D points. `grade` accepts an ID
array for selection and `[x, y]` for construction.

`promptPartsFor(p, lang)` supplies `question` and `conditions`. The full question
is preserved. Identical page conditions are shown once, with none omitted.
Answer classification lists every matching option and shows geometric marks;
it does not repeat the full definition block inside every answer.

`renderProblem(p, {lang, reveal, interactive:false})` is called without a
`selectedPoint`, so the renderer owns example selection. Its verified `viewBox`
is `0 0 400 400`; grid points span 32..368 (336 units). Uniform scale `75 / 336`
mm per SVG unit gives a 75mm physical grid and an 89.286mm SVG. Mobile preserves
aspect ratio and scales the diagram to the available width. The independent
cover figure is not a bank exercise, does not reveal a numbered answer, and
is excluded from selection.

The existing perimeter icon helper and shared printer icon are reused read-only.
There are no integration, service-worker, navigation-index, or publishing edits.

## Learner Fit Record

`learner_stage`: exactly `초등 도형 · 사각형의 성질과 분류`.

| Criterion | Design evidence | Verification |
| --- | --- | --- |
| language | ko/en/zh/ja from the outset; short task separated from shared conditions; visible inclusive convention | All four locales checked against shared prompts and conditions; long Japanese names and English build tasks included |
| representations | Fixed 7x7 integer grid, ordered A/B/C/D, equal spatial scale, geometric property marks for classification, open A-B-C construction | 640 static SVG states; 75mm printed grid; desktop/tablet/mobile and raster PDF checks |
| prerequisites | Recognize a side and vertex, compare directions, identify a right angle, follow A-B-C-D order | Parallel and right-angle activities precede classification; cover labels classification as enrichment |
| reasoning-load | One property family at a time, then all matching class names; one missing construction vertex | Four domains kept on separate pages; maximum two questions per page; shared convention not repeated in each task |
| response-mode | Check and write a complete set; draw D on a grid and explain; multiple valid constructions accepted | Student answers remain blank; selection labels match ID sets; all 980 construction candidates tested |

This is design and rendering evidence, not a classroom usability study or a
national-curriculum alignment certification. No learner testing is claimed.

## Local Validation

Run from the repository root with the bundled Node dependencies available:

```text
node geometry/worksheet/quadrilateral/workbook.selftest.mjs
node geometry/worksheet/quadrilateral/workbook.browsercheck.mjs
python geometry/worksheet/quadrilateral/pdf-qa.py
git diff --check -- geometry/worksheet/quadrilateral
```

The browser test defaults to `http://127.0.0.1:8765`; set `GFIELD_BASE_URL` for
another existing repository-root server. It blocks service workers. Tests use
Playwright, pdf-lib, sharp, pypdf, pdfplumber, Pillow, and Poppler.

All generated results, screenshots, PDFs, and raster pages are under
`qa-artifacts/`, ignored by this directory's `.gitignore`. These files are local
QA artifacts, not public source scans or production exports. The browser report
records SHA-256 source hashes and fails if shared files change during a run.
Only a successful final run against stable hashes counts as completed QA.

Final measured counts are recorded in `qa-artifacts/selection-results.json`,
`qa-artifacts/results.json`, and `qa-artifacts/pdf-validation.json`.

### Verified Run: 2026-09-09

- Selection: 4,000 runs, 42,000 selected entries; 100 seeds each cover all 80 IDs
  in four disjoint rounds. All 80 bank problems, 640 static SVG states and 980
  construction candidates passed.
- Browser: all four languages, all four domains, 1280/768/390px, student/answer
  states; 2,408 problem layout checks, 1,920 content checks, 96 nonblank image
  checks, and 44 saved screenshots passed. Source hashes were stable throughout.
- PDF: 20 files, 164 A4 pages, 248 numbered questions and raster board checks,
  65,990 bounded characters. Every PDF page was rasterized and checked for
  nonblank output. Representative Korean, English, Chinese and Japanese pages
  were also visually reviewed.
- Current bank condition audit: 20 problems per domain, zero `extra` fields,
  exactly one condition-list variant within each domain. Thus current page
  condition merging does not broaden a problem-specific condition. If future
  bank versions add heterogeneous conditions, partition common and per-item
  conditions before using this page-level presentation.
- Nonblocking tool warnings: pdfplumber reports missing FontBBox metadata in
  browser-subset fonts; extracted character bounds and actual Poppler raster
  output passed. Pillow reports a `getdata` deprecation warning in the local QA
  script. Neither is a visible worksheet defect.
- No outstanding implementation edits, no publication, no automation changes.
