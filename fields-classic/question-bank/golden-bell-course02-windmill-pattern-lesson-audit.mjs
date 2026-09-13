import assert from "node:assert/strict";
import { COURSE02_A1_WINDMILL_PATTERN_LESSON, course02WindmillAnswer, course02WindmillConceptMarkup } from "./golden-bell-course02-windmill-pattern-lesson.js";

const lesson = COURSE02_A1_WINDMILL_PATTERN_LESSON;
const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
assert.equal(lesson.experience.tracks.length, 2);
assert.equal(lesson.experience.tracks.every((track) => track.beats.length === 4), true);
assert.equal(items.length, 10);
assert.equal(new Set(items.map((item) => item.id)).size, 10);
assert.equal(new Set(items.map((item) => item.answerRef)).size, 10);
assert.equal(items.every((item) => item.answerMode === "input" && item.inputMode === "text"), true);
const expected = ["왼쪽 위", "위", "오른쪽 아래", "위", "왼쪽 위"];
for (let position = 1; position <= 500; position++) {
  const answer = course02WindmillAnswer({ kind: "course02-windmill-pattern", position });
  assert.equal(answer, expected[(position - 1) % 5]);
  assert.equal(course02WindmillAnswer({ kind: "course02-windmill-pattern", position: position + 5 }), answer);
}
const problem = course02WindmillConceptMarkup({ kind: "course02-windmill-pattern", position: 18, phase: "problem" });
assert.equal((problem.match(/class="windmill-figure"/g) || []).length, 12);
assert.match(problem, /첫째 마디/); assert.match(problem, /둘째 마디/); assert.match(problem, /다음 2개/);
assert.equal(problem.includes("18번째 · 오른쪽 아래"), false);
const verify = course02WindmillConceptMarkup({ kind: "course02-windmill-pattern", position: 18, phase: "verify" });
assert.match(verify, /18번째 · 오른쪽 아래/);
assert.equal(verify.includes("undefined"), false); assert.equal(verify.includes("NaN"), false);
const serialized = JSON.stringify(lesson);
assert.equal(/(?:[A-Z]:[\\/]|\.pdf|\.pptx?|teacherAnswer|officialAnswer|workedSolution)/i.test(serialized), false);
console.log(`COURSE02_A1_WINDMILL_PATTERN_AUDIT_OK items=${items.length} tracks=2 period=5`);
