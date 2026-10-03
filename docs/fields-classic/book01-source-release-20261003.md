# Book 1 source corrections and print verification

## Scope

- Match the clock concept animation to the original starting position and all
  five requested movements on teacher slide 2.
- Keep the opening question, tutorial steps, concept check, grading feedback,
  and printed summary consistent with that same starting position. Reuse the
  existing original half-turn answer reference; do not change legacy answers.
- Correct the first digital half-turn question on teacher slide 4 from the
  mistakenly transcribed digit to the source digit. Use a new protected answer
  reference so clients using the old question keep their original answer.
- Restore the four three-digit additions on teacher slide 8. Each expression
  has its own response field and protected answer reference.
- Render arithmetic expressions once when the multipart response labels already
  contain the same expressions.
- Permit approved protected `explanation` text to supply worked-answer printing
  when a question has no separate `solution` field. Printing still requires
  protected answers and nonempty worked text.

The book now has 133 original question records. A record can contain several
subresponses; this is not a count of all blanks or a certification that every
source item in every book has passed a fresh visual audit.

## Verification

- `golden-bell-book01-source-browser-audit.mjs`: two viewports, 1440 and 390px;
  all 12 Book 1 lessons open their question view. The corrected questions reject
  incorrect input, accept the approved answers, and expose worked text only
  after grading or a deliberate reveal. Reapplying the source correction does
  not append duplicate variants.
- Clock regression: each of the six scene states renders its expected landing
  value; the source-based half-turn check rejects a wrong choice and accepts the
  approved answer. All five original responses grade correctly and enable the
  next stage. The two-page clock study PDF has no unexpected physical pages and
  its first page was rasterized and reviewed for clipping and text consistency.
- Current digital lesson: actual A4 PDFs in all four modes. Study 5 pages,
  answers 3 pages, quick answers 2 pages, combined 9 pages. Desktop and mobile
  produce the same physical page counts; combined answers start on a front side.
- Whole-book layout regression: Book 1 compacted from 122 source sections to
  51 physical pages, Book 2 from 151 to 58. Both retain their original questions,
  additional practice, response fields, cover, and watermarks, and pass footer
  and PDF page-count checks. Book 2 uses a layout fixture, not a fresh math audit.
- Actual PDF pages were rasterized for visual review: cover, restored arithmetic
  questions, and the final worked-answer page. No clipping or overlapping text
  was observed on these reviewed pages.
- `golden-bell-protection-audit.mjs`: all ten first-course books, including the
  new references, pass public-answer and private-path leak checks.
- Read-only server verification confirms that the new references and their
  worked text exist and the legacy reference remains available. Private answer
  payloads, source images, and local test fixtures are not part of this commit.

This record covers local verification. Deployment must be verified separately.
