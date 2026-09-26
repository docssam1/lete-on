# Source-Faithful Golden Bell Review

## Scope and Evidence

This pass compares the existing structured source transcriptions with the new
questions. Direct comparison with the private source PNGs is still pending.
It is not a completion certificate for books 2-10 or their official answers.

Five corrected families:

| Book | Family | Preserved structure |
| --- | --- | --- |
| 04 | Balance substitution | Two balanced relations, subtract common shapes, substitute into the circle target |
| 04 | Cardinal placement | Four locations in a 2-by-2 grid, three relative directions, marked-cell target |
| 05 | Product placement | Original eight active positions in a 4-by-4 board, cards 2-9 used once, all row/column products, three targets |
| 07 | Elapsed time | AM-to-PM interval and borrowing one hour as 60 minutes |
| 08 | Vertical addition cryptarithm | Two-digit addends, three-digit result, two repeated symbols and carries |

Each family has a separate worked example and three new practice questions.
Practice answers use versioned `/faithful/20260922a/` references, never the
answer reference of a different question. Changing those questions requires
a new revision and a newly checked private answer packet.

## Checks

- `golden-bell-faithful-structure-audit.mjs`: checks 20 question/example
  structures, source topology, distinct versioned references and no public answers.
- Local private math audit: enumerates location/card arrangements and digits;
  all 5 examples and 15 practice questions have one answer. Time and balance
  calculations are checked separately.
- Local private browser audit: 1440px and 390px, four concept frames, hidden
  practice solutions before submission, incorrect/correct submissions, and
  actual PDF output for study, worked answers, both, and quick answers.
- Existing original-answer records in that browser audit are synthetic layout
  fixtures. They do not verify official original answers.

## Protection and Availability

New practice activates per book only after the whole private answer packet is
present and valid. Until then, the existing source-shaped extension remains;
the known incompatible extra variant is not offered. Screen and answer/worksheet
printing use the same question list. The public repository must not contain
the generated private answer bank, original scans, credentials, or private paths.

The private packet was added to the existing protected answer database on
2026-09-22: book 04 +6, book 05 +3, book 07 +3, book 08 +3. All 496 existing
records were preserved, verified by hashes after removing the 15 new keys.
Database readback matched all 15 checked records, and RLS/direct-read grants
were unchanged. No public frontend deployment, commit, or push was performed.

The database-readback browser check passed 30 practice submissions at 1440px
and 390px, plus 20 actual A4 PDFs across the four print modes. These are local
isolated browser tests, not a successful live authenticated session.

The provider initially blocked both `fields-auth` and `golden-bell-answers`
with HTTP 402 (`exceed_storage_size_quota`). After the owner reported clearing
the restriction on 2026-09-22, live rechecks returned OPTIONS 204 with the
allowed origin `http://127.0.0.1:8794`, and anonymous POST requests returned
401 `session_required`. An invalid session returned 401 `session_invalid`.
The four answer-book revisions and all 15 new records are unchanged. The
provider restriction is cleared; a successful approved login and answer fetch
are still unverified. The current frontend is served locally on port 8794.
No storage files were removed and no billing plan was changed by this task.
Frontend session handling preserves valid sessions on service or network
failure instead of treating those failures as expired credentials.

Book 06: eleven newly drafted third questions reused existing answer references.
They are now retained as `pendingPractice` drafts without answer bindings, not
as student exercises. The two existing exercises per lesson remain (22 total).
These eleven drafts need individual answers, explanations, and source checks
before activation. This is a hold, not a completed expansion.

## Remaining Work

1. Directly compare the corrected five families against the private source images.
2. Finish all original subtypes in each lesson, not only its representative one.
3. Audit books 2-3, the book 4 polyomino variants, book 5 path/card variants,
   the remaining book 7-8 variants, and books 9-10 against source structure.
4. Give each pending book 6 draft an independent answer contract and solution.
5. Verify the new questions through a successful approved login, deploy the
   matching frontend revision after approval, and recheck the live site.

## Book 01 Learning Flow Follow-Up

The follow-up concerns instructional sequence, not a new certification of
official answers. All 12 Book 01 concept introductions now describe the
example actually used by their scenes. Logic conditions appear before the
first scene. Mirror reflection uses the same diagonal figure, digital-number
scenes use seven-segment figures without showing later results early, fold
scenes preserve the folded paper dimensions, and each clock example starts
from its stated initial position. Printed concept summaries include the
worked problem and its conditions.

Direct visual source inspection covered slides 3, 4, 10, 14, 17, 20, 24 and
33 only. This does not certify every original fold variant or all source
pages. The two-fold opening still needs a precise marked-hole starting
figure in print, and its concept coverage must expand beyond the one
horizontal/vertical example to all original subtypes.

`golden-bell-learning-flow-browser-audit.mjs` passed locally at 1440px and
390px with isolated sessions and a private database-readback fixture:

- 97 lessons across books 1-10: concept-to-question navigation, twice
  (194 checks). This is navigation coverage only, not semantic review.
- Book 01: all 12 concept sequences, previous/next/restart controls,
  132 original-item solution transitions and additional-practice transitions
  per viewport. Private answer text is not included in this report.
- 12 real A4 study PDFs: expected page counts and footer boundaries.
  The clock, two-fold and preference-logic first pages were visually checked.
- The frame tests use reduced motion. Continuous autoplay/pause timing and
  the remaining original diagram quality need separate review.

The administrator login endpoint accepted the owner-supplied account with
HTTP 200 and the admin role. The isolated test session was logged out.
Credentials and tokens were not written to repository files. This does not
verify a student login: Golden Bell still uses a separate student-session
contract. The deployed admin endpoint rejects the local 8794 origin, while
the student endpoints allow it. No authentication bypass or role bridge was
introduced, and no commit, push or frontend deployment was performed.

Subsequent administrator-login follow-up: the student form now accepts the
server-verified common administrator account, and live protected Golden Bell
entry has passed. See `../ADMIN-LEARNING-LOGIN-20260922.md` for the separate
authentication deployment and verification scope. The source-fidelity and
instructional-coverage work listed above is still pending.

## Book 01 Fold Diagrams Follow-Up (2026-09-22)

The marked-hole opening limitation above is superseded for the two folding
lessons. They now use six selectable source-shaped concept sequences rather
than one generic hole-count scene. The sequences distinguish crease cuts,
diagonal folds, cut-number sums, folded position, and reverse unfolding.
Each starts with the complete question diagram. The lesson print includes all
three concept examples, not only the example currently selected on screen.

Source slides 10-16 were visually inspected. This change corrects exactly
13 original questions from slides 12, 14 and 16: ten cut-number sums and
three folded-position questions. Geometry Lab reflection and the existing
half-plane folding model determine the paper shapes and unfolded cut cells.
For the ten sum questions, the independently unfolded cells and the protected
answer packet agree. No official answer values or database records changed.

Slide 14 asks where the folded paper lies, not which numbered layer is on
top. Prompts, type labels, arrows, rectangular/diagonal number boards and
worked explanations now preserve that distinction. Folded shapes appear
separately from the numbered position board; the target position is highlighted
only in the solution. Cut-number questions show an unmarked number board;
marked cells and the actual addition appear only after revealing the solution
or in answer printing. Protected-answer/model disagreement blocks the book
instead of silently accepting a mismatched answer.

Actual PDF review found an additional pre-existing print contract defect:
older extensions store worked text in `explanation`, while answer printing
accepted only `solution`. Printing now accepts either worked-text field while
still rejecting missing answers or missing worked text. All 12 Book 01
lessons passed this answer-print contract check. Keyboard End navigation uses
the selected source animation's step count.

Verification is local, with isolated browser storage and a private readback
fixture, not a new live-site release:

- `golden-bell-book01-folding-audit.mjs`: 13 original diagrams and protected
  answers; six concept tracks at 1440px/390px; replay, pause, restart and
  keyboard navigation; question/solution separation; eight real A4 PDFs.
- Current PDFs: each folding lesson has 10 study pages. One-fold answers / quick
  answers / combined output have 6 / 2 / 16 pages; two-fold has 5 / 1 / 15.
  Combined answers start on page 11. Footer boundaries and physical PDF page
  counts were checked, and representative concept, question and answer pages
  were rendered for visual inspection.
- The broader learning-flow audit passed 194 concept-to-question navigation
  checks, both viewports for all 12 Book 01 lessons, and 12 actual study PDFs.
  This remains navigation and rendering evidence, not whole-bank source proof.

Still pending: the twelve original shape-choice questions on slides 10, 11
and 15 have not been corrected by this change. Their fold geometry and option
drawings need direct reconstruction before Book 01 can be called fully reviewed.
The arithmetic-card subtypes and extension coverage also need a separate
source-fidelity pass. Book 02 teacher-source files were located for the next
pass, but no Book 02 source-completion claim is made here. No curriculum
commit, push, deployment, source-file modification or deletion was performed.
