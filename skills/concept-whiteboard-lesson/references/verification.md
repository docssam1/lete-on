# Verification

The bar is not "the checks passed". It is **"the checks were shown capable of failing, and then passed."** This codebase has repeatedly shipped suites that could not fail: a cell-overflow check that ran with the print stylesheet inactive, a uniqueness prover that assumed the equation frame instead of reading it. Both reported green.

## The five gates

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

### 5. Negative control

For each check: break the thing it guards, confirm the check fails, revert. Report what you broke and that it was caught.

This is the gate that catches broken gates. Run it before claiming any of the four above.

## Reporting

State per beat what is newly drawn and your 시선 judgment; give the seed counts behind each assertion; name what you broke for the negative control and that it failed as expected; list the screenshots you actually looked at. A summary that says "all checks pass" without these is not a verification report.
