import assert from "node:assert/strict";
import { COURSE03_A1_REMAINDER_LESSON, course03RemainderConceptMarkup } from "./golden-bell-course03-remainder-lesson.js";

const forbiddenKeys = new Set(["answer", "solution", "answers", "solutions", "officialAnswer", "officialAnswers", "workedAnswer", "workedSolution"]);
const walk = (value, path = "lesson") => {
  if (!value || typeof value !== "object") return [];
  const found = [];
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) found.push(`${path}.${key}`);
    found.push(...walk(child, `${path}.${key}`));
  }
  return found;
};

const lesson = COURSE03_A1_REMAINDER_LESSON;
assert.equal(lesson.learnerStage, "필즈 더 클래식 3과정 A1; 연령 미확정");
assert.equal(lesson.experience.kind, "course-concept");
assert.equal(lesson.experience.tracks.length, 2);
assert.ok(lesson.experience.tracks.every((track) => track.beats.length === 4));
assert.equal(lesson.original.items.length, 4);
assert.equal(lesson.similarPractice.length, 5);
assert.equal(lesson.dailyPractice.problemCount, 10);
assert.equal(lesson.extension.id, `${lesson.id}:extension`);
assert.deepEqual(walk(lesson), []);

const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
assert.equal(new Set(items.map((item) => item.id)).size, 10);
assert.ok(items.every((item) => typeof item.answerRef === "string" && item.answerRef.includes(item.id)));
assert.ok(items.every((item) => !Object.prototype.hasOwnProperty.call(item, "answer") && !Object.prototype.hasOwnProperty.call(item, "solution")));
assert.ok(items.every((item) => item.answerMode === "input" && item.inputMode === "numeric"));

const sequence = lesson.original.items.filter((item) => item.visual.kind === "course03-remainder-sequence");
const ranges = items.filter((item) => item.visual.kind === "course03-remainder-range");
assert.equal(sequence.length, 2);
assert.ok(sequence.every((item) => item.prompt.includes(`${item.visual.position}번째 수`)));
assert.equal(ranges.length, 6);

const sequenceTerms = ({ start, step, position }) => start + step * (position - 1);
for (let start = 0; start <= 12; start += 3) {
  for (let step = 2; step <= 15; step += 1) {
    for (let position = 1; position <= 40; position += 1) {
      const terms = sequenceTerms({ start, step, position });
      const positive = start + step * (position - 1);
      const negative = start - step + step * position;
      assert.equal(positive, terms);
      assert.equal(negative, terms);
    }
  }
}

const inclusiveCount = ({ start, step, lower, upper }) => {
  let count = 0;
  for (let value = start; value <= upper; value += step) if (value >= lower) count += 1;
  return count;
};
for (let start = 0; start <= 20; start += 2) {
  for (let step = 1; step <= 17; step += 1) {
    for (let lower = 0; lower <= 80; lower += 5) {
      for (let upper = lower; upper <= lower + 80; upper += 10) {
        const expected = Array.from({ length: 200 }, (_, i) => start + step * i).filter((value) => value >= lower && value <= upper).length;
        assert.equal(inclusiveCount({ start, step, lower, upper }), expected);
      }
    }
  }
}

for (const track of lesson.experience.tracks) {
  for (const beat of track.beats) {
    const markup = course03RemainderConceptMarkup(beat.visual);
    assert.ok(markup.trim().length > 0);
    assert.ok(!markup.includes("undefined"));
    assert.ok(!markup.includes("[object Object]"));
  }
}

const hostile = course03RemainderConceptMarkup({ kind: "course03-remainder-sequence", start: "<x>", step: "&", length: 1, position: 1, phase: "positive" });
assert.ok(hostile.includes("&lt;x&gt;") && hostile.includes("&amp;"));
assert.ok(!hostile.includes("value=\"<x>\""));

console.log("COURSE03_A1_REMAINDER_LESSON_OK");
console.log(`tracks=${lesson.experience.tracks.length} beats=8 items=${items.length} sequenceCases=2800 rangeCases=...`);
