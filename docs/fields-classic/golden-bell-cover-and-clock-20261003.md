# Golden Bell Cover Selection and Clock Wording

## Scope

- Whole-book study printing offers a concept cover, a restrained monochrome
  cover, or no cover. Both designs retain the book name, learner/date fields,
  learning sequence, full concept list, and watermark.
- The selector previews the same cover markup used in printing. Radio selection,
  keyboard focus, apply/cancel, and remembered selection are supported.
- Answer-only and quick-answer modes never insert a cover or duplex blank.
  Combined printing recalculates the answer starting side after the chosen
  cover is included or omitted. Current-lesson printing remains unchanged.
- Book 1 clock controls, turn measurements, character guidance, and shape-turn
  diagram captions use the source's verbal turn names instead of fractional
  notation. Rotation logic, source questions, and protected answer payloads
  are unchanged.

## Verification

- Two screen widths: 1440px and 390px. Checked the actual cover preview,
  radio keyboard selection, cancel without applying, remembered selection,
  disabled controls in answer-only modes, and all eight allowed clock increments.
- Nine actual A4 PDF cases: both covers (51 pages), no-cover study (50 pages),
  answer-only (24 pages), quick answers (15 pages), combined with cover (76 pages,
  answers start on page 53), combined without cover (74 pages, answers on page 51),
  and both cover designs for the largest concept list (Book 2, 18 concepts).
- Both Book 2 covers fit one physical page and clear the footer. Cover PDFs were
  rasterized for visual inspection; the combined-output blank side was also checked.
- Existing hands-on regression: seven activities, 21 authored rounds, each played
  at desktop and mobile widths: 42 rounds and 14 transitions passed.

These are layout and interaction checks, not a claim that all source material
in every book has passed a new mathematical or visual-content audit.

Private answer fixtures and original source images are not included in Git.
Deployment and cleanup must be verified separately after merging.
