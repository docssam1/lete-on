import assert from "node:assert/strict";
import { recordGoldenBellOutcome, summarizeGoldenBellLesson } from "./golden-bell-progress.js";

const progress = {};
const base = { bookId: "book-05", lessonId: "cube-tetrahedral-growth", scope: "original", typeIds: ["cube-tetrahedral-growth"] };
recordGoldenBellOutcome(progress, { ...base, itemId: "stair-four", status: "wrong", now: "2026-09-01T00:00:00.000Z" });
recordGoldenBellOutcome(progress, { ...base, itemId: "stair-four", status: "revealed", now: "2026-09-01T00:01:00.000Z" });
recordGoldenBellOutcome(progress, { ...base, itemId: "stair-seven", status: "skipped", now: "2026-09-01T00:02:00.000Z" });
recordGoldenBellOutcome(progress, { ...base, scope: "extension", itemId: "cube-tetrahedral-growth:extension", status: "correct", now: "2026-09-01T00:03:00.000Z" });

const lesson = progress[base.bookId][base.lessonId];
assert.equal(lesson.outcomes.original["stair-four"].wrongCount, 1);
assert.equal(lesson.outcomes.original["stair-four"].revealedCount, 1);
assert.equal(lesson.outcomes.original["stair-four"].needsReview, true);
assert.equal(lesson.outcomes.original["stair-seven"].status, "skipped");
assert.equal(lesson.outcomes.extension["cube-tetrahedral-growth:extension"].needsReview, false);
assert.deepEqual(summarizeGoldenBellLesson(lesson), {
  total: 3,
  correct: 1,
  wrong: 0,
  revealed: 1,
  skipped: 1,
  review: 2,
  reviewTypeIds: ["cube-tetrahedral-growth"]
});

console.log("GOLDEN_BELL_PROGRESS_OK records=3 review=2 typeLinks=1");
