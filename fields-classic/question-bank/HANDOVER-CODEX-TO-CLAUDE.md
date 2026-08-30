# Fields The Classic Question Bank
## Codex -> Claude Handover

> Canonical handover for the next agent. Read this file before changing anything.
> Generated: 2026-08-30 (Asia/Seoul)

## 1. Current Checkpoint

- Repository: `https://github.com/docssam1/lete-on`
- Checkout: use the exact local checkout recorded in the private handover file described in section 10.
- Current branch: `codex/question-bank-gap-fill-20260827`
- Current commit: `c93afa808e7ebdf0e296cf135dda0e193b8fc40a`
- `origin/main`: same commit `c93afa808e7ebdf0e296cf135dda0e193b8fc40a`
- Worktree at handover: clean
- Public entry: `https://lete-on.gfieldacademy.net/fields-classic/question-bank/`
- Public intro page: `https://lete-on.gfieldacademy.net/fields-classic/question-bank/intro.html?student=DEMO`
- Local preview: `http://127.0.0.1:8794/fields-classic/question-bank/intro.html?student=DEMO`

Do not infer state from an old chat message. Confirm `git status`, `git rev-parse HEAD`, and the remote branch before proceeding.

## 2. Non-Negotiable Safety Rules

1. Read the local storage notice and status files first; their exact paths are in the private handover file described in section 10.
2. Do not run `git reset`, `git clean`, or switch branches to recover this worktree.
3. Do not delete or move this checkout while Fields work is active.
4. Treat original PDFs, PPTX files, answer materials, and source images as read-only evidence.
5. Do not modify the existing diagnostic mock or its prescription behavior unless explicitly requested.
6. Do not promote a question from OCR guesswork or an ambiguous image. Keep it pending/locked until the source question and approved answer agree.
7. Do not publish private source content, full source scans, Drive links, or private paths in public indices.
8. Before a public `main` push, run the relevant audits and obtain explicit approval if the push is not already part of the current request.

## 3. Product Decisions From The Conversation

- The question bank supports three selection modes: exam sheet, textbook/unit, and detailed type.
- The hierarchy is domain/large unit -> small unit -> detailed type -> representative concept.
- Selection is multi-select. A type row should show its preview on hover/focus when possible.
- Difficulty means easier than the source, same as the source, or harder than the source. It is not merely a number-range switch.
- A question may be reused across books or academies when its reasoning structure is the same; duplicates are acceptable when the source relation is explicit.
- Preserve the source action: drawing remains drawing, vertical arithmetic remains vertical arithmetic, and a partition task remains a partition task.
- Approved answers only are shown in answer views. Keep one answer per item and do not leak answer lines into the problem view.
- Golden Bell is concept learning and explanation/quiz practice, not a replacement for the original test answer sheet.
- Every printable exam and worksheet keeps the student watermark. Mobile should show one readable question/page layout where appropriate.
- The interface should feel like an authored workbook and study desk, not a generic AI dashboard.
- Main learning message: a few solved questions are not enough; identify the missing concept/type and prescribe practice until the student can solve and explain it.

## 4. What Is Already Complete

### Question-bank foundation

- 10 books, 40 units, textbook stages, exam selection, type selection, and source-question routing are present.
- Latest source-question audit: 2,198 expected records, 2,198 indexed records, no missing keys, duplicates, orphan types, or unverified source keys.
- Curriculum audit: 10 books, 40 units, 4 stages, 1,613 source questions, 442 curriculum types, 489 detailed types.
- Existing diagnostic, practical/final exam, answer, diagnosis, and Golden Bell routes were preserved.

### Source-faithful geometry correction

- Book 1 symbol partition questions were corrected to use the original central red guide cross.
- The answer visual keeps the four red guide edges and adds eight orange completion edges.
- The generator releases only arrangements whose independent exhaustive check returns exactly one solution.
- Verified source examples: Book 1 questions 8(1), 8(2), and 9. Each has one valid partition under the source constraints.
- Book 1 audit result: 41 types x 3 difficulty levels x 1,000 generations = 123,000 generated questions, no failure, minimum 4 variants.

### Question-bank introduction page

- Added `fields-classic/question-bank/intro.html`, `intro.css`, and `intro.js`.
- Added two product screenshots under `fields-classic/question-bank/assets/intro/`.
- Added `intro-browser-audit.mjs`.
- Added a small `소개` link to the question-bank header; the current student query is preserved.
- The intro page explains: concept -> diagnosis -> level-up -> clinic, source-faithful similar problems, approved answers, uniqueness checks, watermark, and print support.
- Public verification passed: HTTP 200, title/hero text present, both images loaded, no browser errors, no mobile horizontal overflow, and `student=DEMO` was retained.

## 5. Required Verification Contract For New Types

For every new or modified generator:

1. Compare the source question image/diagram and approved answer directly.
2. Record the source shape, given lines/marks, required student action, answer kind, and difficulty dimensions.
3. Implement an independent answer checker, separate from the generator's answer calculation.
4. Require exactly one intended answer. If multiple answers remain, strengthen the constraints or lock the item.
5. Test easy/same/hard as a change in reasoning load, not only larger numbers.
6. Check problem view has no answer labels, fills, answer lines, or answer text leakage.
7. Check approved answer view has one answer per question and the correct diagram.
8. Render at desktop, 390px mobile, and A4 print. Check clipping, stretching, overlap, blank cards, pagination, watermark, and readable type.
9. Run the relevant audit at scale. Report failures instead of silently skipping them.

## 6. Important Files

- `fields-classic/question-bank/index.html`: selection UI and worksheet shell.
- `fields-classic/question-bank/app.js`: selection state, routing, worksheet/answer rendering.
- `fields-classic/question-bank/source-data.js`: curriculum, exams, source-question index, detailed classifications.
- `fields-classic/question-bank/generators.js`: shared generator registry.
- `fields-classic/question-bank/book01-generators.js`: Book 1 generators and independent helpers.
- `fields-classic/question-bank/book01-renderers.js`: Book 1 diagrams.
- `fields-classic/question-bank/styles.css`: question-bank and print styles.
- `fields-classic/question-bank/golden-bell.html` / `golden-bell.js` / `golden-bell-data.js`: concept learning mode.
- `fields-classic/program/index.html`: learning shelf and product navigation.
- `fields-classic/question-bank/QUESTION-AUTHORING-GUIDE.md`: authoring rules.
- `fields-classic/question-bank/BOOK01-SOURCE-AUDIT.md`: Book 1 source evidence and audit notes.
- `fields-classic/question-bank/SOURCE-QUESTION-DB-AUDIT.md`: source DB audit record.
- `fields-classic/question-bank/HANDOVER.md` and `HANDOVER-GPT.md`: older handovers; this file is the current Codex-to-Claude checkpoint.

## 7. Verification Commands

Run from the checkout in the private handover file. If the local server is unavailable, start a non-destructive static server on another free port.

```powershell
node fields-classic/question-bank/intro-browser-audit.mjs
node fields-classic/question-bank/question-bank-ui-audit.mjs
node fields-classic/question-bank/curriculum-stage-audit.mjs
node fields-classic/question-bank/source-question-db-audit.mjs
node fields-classic/question-bank/book01-audit.mjs 1000
node fields-classic/question-bank/book01-partition-browser-audit.mjs
node fields-classic/question-bank/book01-symbol-partition-browser-audit.mjs
git diff --check
git status --short --branch
```

For the public deployment, set `FIELDS_BASE_URL=https://lete-on.gfieldacademy.net` when using the browser audits. Verify the deployed asset/cache version and the remote SHA; local success alone is not deployment evidence.

## 8. Next Work Order

1. Continue the source-to-generator uniqueness audit across Books 2-10, unit tests, Golden Bell learning items, and mock/exam source items. Start with types where the UI says a generator exists but the source shape or answer contract has not been independently checked.
2. For each finding, classify it as `sourceMatched`, `bankApproved`, `pending`, or `locked`. Never mark it verified solely because a numeric answer looks plausible.
3. Fill missing textbook detailed types only from the actual book/answer evidence. Preserve book/number references even when page numbers differ.
4. Check that representative concepts explain the reasoning before practice; concept stage must not be a thin type label.
5. Keep the problem-bank navigation in the order: our diagnostic mock first, then practical exam rounds, then final rounds; use a compact expansion/tree pattern rather than a long flat list.
6. Re-run the full source DB, curriculum, generator, browser, mobile, and print audits after each meaningful batch.
7. Commit a narrow change with a source/audit note. Fetch and merge current `origin/main` before pushing. Do not force-push.

## 9. Model And Agent Guidance

- For source interpretation, taxonomy decisions, and uniqueness failures: `SOL + 높은(High)`; use `SOL + 울트라(Ultra)` only when the source image or combinatorial proof is genuinely difficult.
- For repetitive generation, regression, and browser/print checks: `LUNA + 중간(Medium)` is sufficient. `TERRA + 중간(Medium)` is the fallback for a broader but still routine audit.
- The lead agent must review agent output, inspect every reported failure, and decide whether to fix, lock, or defer. Agents do not independently redefine source semantics.
- When token usage is low, stop after saving this handover and the current test/commit state. Do not leave an unrecorded half-change.

## 10. Handover Completion Checklist

- [ ] Read storage notice and status.
- [ ] Read the private handover for exact checkout and protected source locations; confirm branch, `HEAD`, remote, and clean/dirty state.
- [ ] Read this file before opening older handovers.
- [ ] Inspect the source evidence before changing a question.
- [ ] Run an independent uniqueness check.
- [ ] Run desktop, mobile, and A4 checks.
- [ ] Record unresolved items as pending/locked with a reason.
- [ ] Report commit SHA, remote SHA, public URL, tests, and remaining blockers.
