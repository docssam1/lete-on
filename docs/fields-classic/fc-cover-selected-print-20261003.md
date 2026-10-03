# FC Cover and Selected Learning Print

## Scope

- Display branding in the question bank, Golden Bell and diagnosis/viewer pages is FC. Routes, database IDs, permissions, existing storage keys and original source citations retain their identities.
- The cover picker offers geometry and grid backgrounds, plus no cover. Preview and PDF use the same cover markup and local vector image assets; images print even without the browser's background-graphics option.
- Covers list only the printed range, lesson titles and representative concepts. DEMO leaves a blank name line while retaining the GFIELD watermark.
- Selected learning printing accepts multiple units/types and an explicit answer-inclusion checkbox. Current-learning and whole-book printing remain available.
- Study, worked answers, combined printing and quick answers all use the same selected lessons. Worked/quick answers still require the existing protected-answer load; no answer data is added to public assets.

## Range Contract

`golden-bell-print-units.js` reuses the textbook bank's public CURRICULUM unit labels and type links. Legacy Golden Bell lesson IDs have a small print-only crosswalk. Whitespace-only label variants are grouped, each lesson occurs exactly once, and source lesson/question numbering stays unchanged.

Unmatched supplemental topics are labelled `추가 유형`, not assigned invented fifth or sixth unit numbers. For course 2/3 pilots without a matching textbook-bank unit catalogue, existing named type groups are shown without inventing unit numbers. Empty/unpublished textbook units are not presented as available Golden Bell content.

This is a print/navigation change, not a new all-volume source or mathematics approval. Source questions, answer contracts and accepted teacher keys are unchanged.

## Print Safety

- No selection disables printing. Closing/Escape does not save draft choices.
- A successful selected print remembers its unit selection per book for the current page session. Background choice uses the existing persistent cover preference.
- Print preparation captures the originating book, mode and range. Book/course/mode/settings controls are locked during image/font preparation, including asynchronous UI refreshes.
- Failed image/answer preparation clears the pending print root, keeps the selection and does not invoke printing.
- Answers begin after the study pages. Combined printing inserts a duplex blank only when needed to start answers on the front of a new sheet; answer-only and quick-answer modes omit cover/blank pages.
- Existing A4 exercise packing, full explanations and supplemental learning are retained within each selected lesson.

## Verification

Reproducible audits:

```powershell
node fields-classic/question-bank/golden-bell-selected-print-audit.mjs
node fields-classic/question-bank/golden-bell-cover-picker-audit.mjs
node fields-classic/question-bank/golden-bell-book01-source-browser-audit.mjs
node fields-classic/question-bank/golden-bell-protection-audit.mjs
```

Browser/PDF audits require FIELDS_BASE_URL on localhost, FIELDS_CAPTURE_DIR on E:, and FIELDS_PRIVATE_ANSWER_BANK pointing to an external private fixture. Never upload the fixture or apply it against the public site.

Evidence is kept outside Git at `E:\Codex\visualizations\2026\08\21\01a02559-fa29-7082-8f7d-90a53fd070e2\fc-selected-print-20261003`.

- Selected-print audit: desktop 1440px and mobile 390px, empty/select-all/cancel/saved selection, nonadjacent units, both answer states and four print modes, failed image preparation, protected-answer denial, A4 page counts and front-side answer starts.
- Cover audit: two backgrounds on the largest 18-concept book, real A4 output and footer clearance; available-book covers are checked independently of answer/mathematics validation.
- Existing cover/clock audit: 9 PDF cases, PC/mobile clock labels and eight half-of-half-turn increments.
- Existing Book 1 source regression: 12-lesson navigation, source clock steps, protected grading and 8 print-mode/view combinations.
- Protected-answer audit: 10 course-1 books, 2,277 answer references and 13 supplemental references.
- Independent review identified a pending-print/book-switch race; the originating-book snapshot and busy navigation guard correct it, with delayed-image reproduction checked separately.
