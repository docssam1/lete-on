# CARS Analysis Report QA

Use this checklist after any analysis-report or grading-input change. Test against actual repository data, not fabricated DOM alone.

## Static Checks

- Parse every changed inline script with Node.
- Run `git diff --check`.
- Confirm no Reading Prime or WonderSkills files changed unless explicitly requested.
- Confirm citations have direct URLs and book recommendations do not claim unsupported scores.
- Confirm `cars-report-guide.js` remains loaded before report code executes.

## Answer UI Matrix

1. Select levels in the order `D -> AA -> B`.
2. Confirm chips display active color immediately.
3. Confirm the visible order becomes `AA -> B -> D`.
4. Confirm each heading and its answer buttons remain in one `.grade-src` block.
5. Enter, change, and clear answers; confirm score totals update without moving answers between levels.
6. Confirm automatic worksheet selection remains disabled until every answer is entered.
7. Confirm its note names the recommended book, sampled lessons, and target strategies when enabled.

## Analysis State Matrix

Verify at least these states:

| State | Expected behavior |
|---|---|
| No source | Empty guidance; no report sheet |
| Partial answers | Provisional comment, entered count, no automatic recommendation |
| All strategies >=70% | No weakness prescription or practice-question table |
| One clear weakness | Detailed error pattern, routine, prompt, criterion, and roadmap |
| Equal weak percentages | Foundational strategy rank resolves priority order |
| Two or more levels | Canonical order, per-level bars, source-aware comments, combined verdict |
| Large level gap | Comment identifies instability as difficulty rises |
| Unit >=90% | Mastered; no placement change |
| Unit 70-89% | Achieved; targeted review only |
| Unit 50-69% | Needs work; same-strategy practice |
| Unit <50% | Reteach from vocabulary; no placement change |
| Recommended level outside B/C/D | Explain that automatic CARS worksheet generation is unavailable |

Use known answer keys to calculate expected totals independently. Do not validate the report against its own displayed total.

## Section Controls

Toggle each key independently:

`summary`, `skills`, `detail`, `questions`, `roadmap`, `books`, `answers`, `evidence`.

For each toggle, confirm:

- the preview rerenders immediately
- the section is absent from the DOM when disabled
- the PDF page count updates when appropriate
- adjacent sections close the space without a blank card or empty page
- saved choices survive reload through `gfPrint.reportSections`

Also verify the separate weakness-prescription option and empty teacher-comment behavior.

## Language And Copy

- Generate the same report in Korean and English without changing worksheet language.
- Confirm scores, levels, source labels, and question references remain identical.
- Confirm no raw HTML, markdown markers, `undefined`, or missing translation fields appear.
- Confirm cautious wording for likely error patterns and confidence.
- Confirm long English strategy names wrap without covering charts or tables.

## Recommendation Trace

For each generated recommendation:

1. Trace the weak strategy to actual missed items.
2. Trace the recommended level to placement output.
3. Trace the listed lesson and question to `extraLearning` data.
4. Trigger automatic worksheet selection.
5. Confirm the selected book, first/middle/final lessons, and strategy positions match the report.
6. Confirm no original licensed content is copied into public metadata.

## Highlighting

After answer entry is complete:

- Drag across text on at least page 2.
- Apply highlight, star, and underline separately.
- Scroll and confirm the toolbar remains usable.
- Change the teacher memo and confirm text-anchored marks relocate where possible.
- Click a mark to remove it.
- Erase a range containing more than one mark.
- Print with color and inspect grayscale readability.

Do not treat marks as durable across score changes that regenerate the coaching copy.

## Layout And PDF

Desktop:

- Use a viewport around 1440x1000.
- Confirm report controls and preview do not overlap.
- Detect horizontal overflow and `.sheet` height overflow.
- Check every report sheet against its footer.

Mobile:

- Use a 390x844 viewport.
- Confirm answer controls, section toggles, and the preview jump remain usable.
- Confirm the page shell has no horizontal body overflow.
- Keep A4 measurement at 210x297mm even when the screen preview stacks vertically.

Print:

1. Emulate print media in Chromium.
2. Generate a real A4 PDF with background graphics.
3. Confirm page size with a PDF inspection tool.
4. Render every PDF page to PNG.
5. Inspect for clipped text, footer overlap, blank continuation pages, broken tables, repeated or missing headers, and missing highlights.

Avoid applying `break-inside: avoid` to a section taller than one page. Keep charts, coaching cards, recommendation rows, and table rows as the smallest indivisible units.

## Completion Evidence

Report:

- changed files
- exact state cases tested
- desktop, mobile, and PDF results
- recommendation trace results
- remaining limitations or source gaps

Do not report “all passed” without naming the number of levels, strategies, report pages, or state cases actually checked.
