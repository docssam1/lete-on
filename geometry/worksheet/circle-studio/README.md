# Circle Studio Worksheet

Runtime: circle-1. Worksheet: circle-sheet-1.

## Ownership and Contract

This directory owns the printable worksheet only. Shared mathematics, original
80-item bank, and rendering are imported from ../../games/circle-studio/.
The parent owns source review, independent answer verification, integration,
service worker changes, and release. No source textbook assets or private data
are included. The authored cover illustration (circle-cover-authored) is not
an exercise and is never selected from the bank.

workbook-core.js validates the actual shared API and structured fields before
enabling the worksheet. It requires all four domains, 20 distinct stable IDs per
domain, the exact learner stage, valid geometry fields, and nonempty questions,
hints, and solutions in all four languages. Conditions are arrays and may be
empty. The worksheet prints the shared question and all shared conditions.
Missing or incompatible dependencies produce a localized error and disable print.

## Learner Fit

Exact learner_stage:
초등 도형 · 원의 중심, 반지름, 지름과 원 그리기

Languages: Korean (ko), English (en), Chinese (zh), Japanese (ja).
All UI copy, cover copy, question prompts, conditions, and solutions are present
from the outset. Changing language preserves the selected stable problem IDs.

| Domain | Representation | Prerequisites | Reasoning Load | Response Mode |
| --- | --- | --- | --- | --- |
| center | True circle on a fixed 7 by 7 point grid; no center/radius mark | Read grid points and find halfway positions | Locate the point equally placed between opposite extents | Mark the center directly on paper |
| parts | Four separate circle diagrams A-D, each with center O and one segment | Understand center and endpoints | Compare center-to-circle versus across-center endpoints; one or two valid diagrams | Tick every correct A-D checkbox |
| measure | Given radius or diameter labeled in cm; no ruler task | cm units, doubles, halves | Convert one given length to the other length | Write a number in a blank followed by cm |
| draw | Given O and blank fixed grid only | Use a compass; grid points; cm | Pin the center, set the opening to 1, 2, or 3 cm, hold it fixed through a full turn | Compass construction on paper, never multiple choice |

The scope excludes circumference, area, pi, equations, tangency, and formal loci.
The lines beside the diagram allow reasoning, but are not a substitute for the
required center mark, multiple selection, numeric length, or compass construction.

## Selection and Pages

- Default: all activities, 20 questions, cover on, answers off.
- Count is normalized to 1-20; malformed values fall back to 20.
- All-20 uses five questions from each domain in center/parts/measure/draw order.
- A4 pages contain at most two questions and never mix domains. Thus all-20 has
  12 question pages and, when enabled, one cover page.
- Within each domain, IDs are sorted before a seeded Fisher-Yates shuffle.
  Reordering the core array cannot silently change a saved worksheet.
- Seed and zero-based round are stored in the URL. For all-20, rounds 0-3
  partition all 80 IDs without overlap; round 4 repeats round 0.
- A single-domain 20-question sheet contains every item in that domain.
- Cover and answer toggles do not change IDs. Answer mode is a separate rendering,
  with solutions and explicit reveal; answers are not appended to student pages.
- Domain, count, lang, cover, answers, seed, and round are URL options.
  The legacy level=1..4 input is accepted and normalized to a domain URL.

## Physical Scale

Shared SVG viewBox: 0 0 400 400. Grid coordinates: 32 + 56 * x/y.
Worksheet SVG width and height: 400 / 56 * 10 = 71.42857142857143 mm.
Therefore neighboring grid points are exactly 10 mm apart, and the six-step
grid span is 60 mm. Width and height remain equal, preserving true circles.
Responsive screens may fit the diagram to a smaller viewport; only print CSS
defines physical scale. Print on A4 at actual size / 100%, with no fit-to-page.

Student draw rendering passes construction:null, traceProgress:0,
interactive:false, reveal:false: grid and given O only. Student center has
the circle but no selected center or center label. Answer rendering explicitly
sets reveal:true. No answers are injected into student response markup.

## Verification

Use the existing repository HTTP server (the QA default is port 8765), or supply
GFIELD_BASE_URL. Use the bundled Node, Playwright, pdf-lib, sharp, Python,
pdfplumber, pypdf, Pillow, and Poppler. NODE_PATH must point at the bundled
Node packages when they are not in the normal module lookup path.

Run from the repository root:

    node geometry/worksheet/circle-studio/workbook.selftest.mjs
    node geometry/worksheet/circle-studio/workbook.browsercheck.mjs
    python geometry/worksheet/circle-studio/pdf-qa.py

- Selftest: bank-contract checks, 4,400 selections, 320 localized prompt
  equivalence checks, stable-ID ordering, all counts 1-20, four-round coverage,
  and no cover sample among selected items.
- Browser check: all 80 items, four languages, widths 1280/768/390, student and
  answer states, question/condition fidelity, answer leakage, actual SVG geometry,
  nonblank pixels, no overflow, saved-URL replay, and fail-closed invalid domain.
- PDF check: real A4 page count, folios, question numbering, character bounds,
  rasterization of every exported page, nonblank diagram crops, and grid spacing
  measured from actual PDF vector line coordinates in points, converted to mm.
  It does not infer physical spacing from browser zoom or screenshot pixels.
- Browser manifest records source SHA-256 hashes before and after the entire run.
  A source change rejects the run; final claims require a stable rerun.

All generated PDFs, PNGs, JSON manifests, and rendered pages are under ignored
qa-artifacts/. They are local QA evidence, not publishing assets.

## Recorded Status

Final local verification passed on 2026-09-09, after the diameter answer-set
permutation, the shared renderer's perpendicular O-label positioning, and the
worksheet's solid answer-checkmark print styling. Earlier runs are not the
final verification evidence.

| Gate | Final Recorded Result |
| --- | --- |
| Selftest | 4,400 selections; 320 localized prompt equivalence checks; 80 bank items |
| Browser | 1,920 content checks; 2,728 layout checks; 96 pixel checks; all 80 IDs; 44 screenshots |
| Viewports and languages | 1280, 768, 390; ko/en/zh/ja; student and answer states |
| Actual PDF files | 36 files; 324 A4 pages |
| PDF completeness | 568 numbered questions and 568 nonblank diagram crops |
| PDF text bounds | 78,113 characters within page bounds |
| Actual vector grid measurements | 288 center/draw diagrams; 7 by 7 grid lines on each |
| Measured adjacent spacing | 9.9994861111111 to 9.999521388888894 mm |

The largest measured deviation from 10 mm is less than 0.00052 mm, from browser
PDF coordinate quantization. Six-step spans also pass the 60 mm check.
Every PDF page was rasterized and pixel-checked. Representative actual PDF pages
were visually reviewed for the authored cover, student construction blanks,
parts question numbers, and clearly printed answer checkmarks. Parts question
numbers 1 and 2 were additionally verified in the first Korean parts PDF at
x=34.0078..43.4725 pt, with separate y ranges and no overlapping content.

Final runtime SHA-256 anchors (full manifest: qa-artifacts/results.json):

- core.js: d31b33d62f9a1644cd73779f080a1fcc3ecc036f1e79a42ca5cd83317b0674a1
- render.js: d4fc4d5ae8cf51715c85dbca35377066f24da15b6d6d0d6bb1b00c580b46dc31
- styles.css: feea4810982b3724db87f7b4f4f61b9aeb2231883c798eab1d8a420fbf8c210d

The browser run checked hashes before and after; PDF QA checked the manifest
hashes before reading PDFs; all seven manifest source hashes were checked again
unchanged at completion. Full measurement records are in
qa-artifacts/pdf-validation.json. The PDF parser emits FontBBox warnings for
some bundled font descriptors; numbering/text-bound checks and actual raster
verification still passed. No physical printer output was used as evidence.

No commit, push, deployment, automation, original edits, or changes outside this
worksheet directory were performed by this worksheet owner.
