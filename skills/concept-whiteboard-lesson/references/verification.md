# Verification

The bar is not "the checks passed". It is **"the checks were shown capable of failing, and then passed."** This codebase has repeatedly shipped suites that could not fail: a cell-overflow check that ran with the print stylesheet inactive, a uniqueness prover that assumed the equation frame instead of reading it. Both reported green.

## The gates

A lesson is not done until every one of these holds.

### 1. PC · mobile · A4

All three, every time. Paged layout is not a formality — defects live there that no screen shows:

- an equation frame landing on the page after the story it belongs to
- a card splitting across the page break
- body text sized for one line of math swallowing a page when it becomes two lines of prose

Render real paged output (PDF), not a print-styled screenshot, and look at it. Check that the **final still frame explains the strategy by itself**, since print has no animation.

### 2. 원본 구조 — the picture matches the problem

Assert across many seeds that every number drawn equals the generator's actual output. A picture showing different numbers than its problem is a correctness failure.

Also assert the family's conservation law (subtotals sum to the total, `a + b` unchanged across a transfer, parts sum to the original — see [motion-families.md](motion-families.md)). Conservation catches a whole class of scene-model errors that spot-checking never will.

### 3. 시선 — one place to look per beat

No assertion detects this. **Judge it by eye from screenshots and state the judgment for each beat.**

The whiteboard model makes it tractable: ask *"is exactly one thing newly drawn in this beat?"* If two things appear at once, or something is emphasized while something else moves, the child does not know where to look. Attention is the thing being designed; treat a split beat as a defect, not a style preference.

### 4. 단일 정답 — proven, not intended

Wherever the lesson asks anything, **enumerate the answer space** and confirm exactly one candidate is defensible. Do not reason from design intent.

Two failures from this repo, both of which passed intent-based review:

- A digit-fill item asked for the digit making a number divisible by 2. Five digits worked; the key held one. Students who answered correctly were marked wrong.
- An equation-writing item pinned operand order with the instruction *"write them in the order they appear"*. Enumeration found a second valid triple in **47%** of items — `4 + 7 = 11` and `7 + 4 = 11` both satisfy the frame. **Textual instructions do not bind; arithmetic does.** The fix was to pre-print one operand for commutative operators.

### 5. Playback and controls

Mechanical, but each of these has shipped broken somewhere:

- **No target is highlighted early, and none is left stale.** Walk the beat list and assert every highlight is cleared or softened by the beat after it. A leftover highlight is the usual way a lesson ends up with two places to look — it will fail gate 3 without this catching it first.
- **Replay starts from the first visual state**, not from wherever the board was left.
- **Narration text matches what is on screen.** If the caption and the drawing disagree, the child trusts neither.
- play / pause / restart / speed / captions all work by keyboard, and `prefers-reduced-motion` is honored.
- Nothing is carried by timing or color alone.

### 6. Learner fit — `learner-fit`

Required on every learner-facing item. **A general statement ("초등 저학년에 적절함") is not evidence.** The evidence must repeat the item's exact learner stage and record each of:

`language` · `representations` · `prerequisites` · `reasoning-load` · `response-mode`

Difficulty may rise through constraints or a change of representation, but it must never quietly depend on content from a later grade. This repo already carries the machinery to check against — age bands (`printAgeBand`: young / mid / senior), the 유아·초등·중등 tiers, and each thread's `prereq` list.

### 7. Observability — separate from determinacy

Determinacy asks *does the model produce exactly one answer*. Observability asks *does what the learner actually sees contain enough to derive it, without revealing it*. **They fail independently, and this repo has failed the second one repeatedly:**

- a divisibility item whose "multiple of what?" lived only in `prompt`, while print emitted `tex` alone
- a word problem printed without its choices
- an equation frame that printed on the page after its story

Check both, on the surface the learner really has — paper for a worksheet, screen for a screen.

### 8. Distractors and answer shape

- **The correct option must not be identifiable by its form.** Longest, most detailed, or visually exceptional wins are a real, measured failure mode in this codebase: an audit of the reading app found the answer was the single longest option in **67%** of items across three books (chance is 25%), and the sibling books `rp`/`ws`/`sl` still sit at ~70% untouched. Fixing it means giving wrong options the same specificity, not padding them.
- Every distractor is wrong **for a named reason** and stays distinguishable.
- Declare the **result contract** before judging determinacy: `single-value` · `ordered` · `set` · `range` · `rubric` · `provisional`. A rubric-shaped response is not a single answer, and an unknown must not be forced into one.

### 9. Negative control

For each check: break the thing it guards, confirm the check fails, revert. Report what you broke and that it was caught.

This is the gate that catches broken gates. Run it before claiming any gate above.

## Who judges

**The implementer cannot be the sole approver of its own work.** Give the verifier the task contract, the source locators, the gate list and the artifact — but **not the implementer's confidence statement**. "All checks pass" from the party that wrote the checks is the weakest evidence in the room, and this repo has twice shipped suites that could not fail.

Keep three status axes apart. Passing a content check does not grant publication:

| axis | values |
|---|---|
| **Work** | pending · in-progress · complete · blocked |
| **Evidence** | draft · verified · conflict · stale · superseded · excluded |
| **Release** | locked · eligible · approved · published · revoked |

`eligible` means the required gates pass. `approved` needs the named release authority — in this project that has meant waiting for the 원장 on anything that changes existing printed output. When a source, locator, answer, contract or verifier version changes, mark dependent evidence **stale**, lock release, and rerun only the affected gates and their regressions.

## Reporting

State per beat what is newly drawn and your 시선 judgment; give the seed counts behind each assertion; name what you broke for the negative control and that it failed as expected; list the screenshots you actually looked at. A summary that says "all checks pass" without these is not a verification report.
