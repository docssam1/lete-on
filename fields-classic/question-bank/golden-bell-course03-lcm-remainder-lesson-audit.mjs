import assert from "node:assert/strict";
import { COURSE03_A1_LCM_REMAINDER_LESSON, course03LcmRemainderConceptMarkup, gcd, lcm, consistency, firstSolution, countSolutions } from "./golden-bell-course03-lcm-remainder-lesson.js";

const lesson = COURSE03_A1_LCM_REMAINDER_LESSON;
const forbidden = new Set(["answer", "solution", "answers", "solutions", "officialAnswer", "officialAnswers", "privatePath", "sourcePath", "sourcePage"]);
const walk = (value, path = "lesson") => {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => [forbidden.has(key) ? `${path}.${key}` : null, ...walk(child, `${path}.${key}`)].filter(Boolean));
};
const brute = (conditions, lower, upper) => {
  if (upper < lower) return [];
  return Array.from({ length: upper - lower + 1 }, (_, i) => lower + i).filter((n) => conditions.every(({ divisor, remainder }) => n % divisor === remainder));
};

assert.equal(lesson.learnerStage, "필즈 더 클래식 3과정 A1; 연령 미확정");
assert.equal(lesson.experience.kind, "course-concept");
assert.equal(lesson.experience.tracks.length, 2);
assert.ok(lesson.experience.tracks.every((track) => track.beats.length === 4));
assert.equal(lesson.original.items.length, 4);
assert.equal(lesson.similarPractice.length, 5);
assert.equal(lesson.dailyPractice.problemCount, 10);
assert.equal(walk(lesson).length, 0);
assert.equal(lesson.source.origin, "textbook-derived");
assert.ok(lesson.story && lesson.explanation);

const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
assert.equal(new Set(items.map((item) => item.id)).size, 10);
assert.ok(items.every((item) => item.answerMode === "input" && item.inputMode === "numeric" && typeof item.answerRef === "string"));
assert.deepEqual(lesson.original.items.map((item) => item.sourceNo), ["1", "2", "3", "4"]);
assert.ok(items.every((item) => /[가-힣]/.test(item.typeLabel) && !item.typeLabel.includes("remainder")));
assert.ok(items.every((item) => !Object.hasOwn(item, "answer") && !Object.hasOwn(item, "solution")));
assert.ok(items.some((item) => item.visual.taskKind === "same-remainder"));
assert.ok(items.some((item) => item.visual.taskKind === "different-remainder"));
assert.ok(items.some((item) => item.visual.taskKind === "inclusive-range-count"));

assert.equal(gcd(18, 24), 6);
assert.equal(lcm(18, 24), 72);
assert.equal(consistency([{ divisor: 6, remainder: 1 }, { divisor: 8, remainder: 1 }]), true);
assert.equal(consistency([{ divisor: 6, remainder: 1 }, { divisor: 8, remainder: 2 }]), false);
assert.equal(firstSolution([{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }]), 1);
assert.equal(firstSolution([{ divisor: 6, remainder: 1 }, { divisor: 8, remainder: 2 }]), null);

for (let a = 2; a <= 12; a += 1) for (let b = 2; b <= 12; b += 1) for (let ra = 0; ra < a; ra += 1) for (let rb = 0; rb < b; rb += 1) {
  const conditions = [{ divisor: a, remainder: ra }, { divisor: b, remainder: rb }];
  const lower = 1; const upper = 180;
  const expected = brute(conditions, lower, upper);
  assert.equal(countSolutions(conditions, lower, upper), expected.length);
  const first = firstSolution(conditions, lower);
  assert.equal(first, expected[0] ?? null);
  if (first !== null) assert.ok(expected.every((value, index) => value === first + index * lcm(a, b)));
}

assert.equal(countSolutions([{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], 13, 13), 1);
assert.equal(countSolutions([{ divisor: 4, remainder: 1 }, { divisor: 6, remainder: 1 }], 14, 24), 0);
assert.equal(countSolutions([{ divisor: 6, remainder: 1 }, { divisor: 8, remainder: 2 }], 1, 180), 0);

for (const item of items) {
  const { conditions, lower, upper, taskKind } = item.visual;
  const expected = brute(conditions, lower, upper ?? (lower + periodFor(conditions) * 2));
  if (taskKind === "inclusive-range-count") assert.equal(countSolutions(conditions, lower, upper), expected.length);
  else assert.equal(firstSolution(conditions, lower), expected[0] ?? null);
  if (taskKind === "same-remainder") {
    assert(lower > Math.max(...conditions.map(({ divisor }) => divisor)));
    assert.match(item.prompt, /나누는 수보다 크/);
  }
  const answer = taskKind === "inclusive-range-count" ? expected.length : expected[0];
  const problem = course03LcmRemainderConceptMarkup(item.visual);
  assert.equal(problem.includes(`course03-lcm-cell\">${answer}<`), false, `${item.id}: answer cell leaked`);
}

for (const track of lesson.experience.tracks) for (const beat of track.beats) {
  const markup = course03LcmRemainderConceptMarkup(beat.visual);
  assert.ok(markup.length > 0 && !markup.includes("undefined") && !markup.includes("[object Object]"));
}
const hostile = course03LcmRemainderConceptMarkup({ kind: "course03-lcm-remainder", phase: "verify", conditions: [{ divisor: "<x>", remainder: "&" }], lower: 1, rows: [1] });
assert.ok(hostile.includes("&lt;x&gt;") && hostile.includes("&amp;"));
const problemMarkup = course03LcmRemainderConceptMarkup(items[0].visual);
assert.ok(!problemMarkup.includes('course03-lcm-cell">1<'));

console.log("COURSE03_A1_LCM_REMAINDER_LESSON_OK");
console.log(`tracks=${lesson.experience.tracks.length} beats=8 items=${items.length} bruteCases=19305`);

function periodFor(conditions) {
  return conditions.reduce((value, condition) => lcm(value, condition.divisor), 1);
}
