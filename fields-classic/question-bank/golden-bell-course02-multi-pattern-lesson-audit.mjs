import assert from "node:assert/strict";
import { COURSE02_A1_MULTI_PATTERN_LESSON, course02MultiPatternAnswer, course02MultiPatternConceptMarkup } from "./golden-bell-course02-multi-pattern-lesson.js";

const lesson = COURSE02_A1_MULTI_PATTERN_LESSON;
const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
const forbiddenKeys = /(?:^|\.)(answer|solution|correctAnswer|officialAnswer|workedAnswer|workedSolution)(?:$|[.:])/i;
const forbiddenSource = /(?:[A-Z]:[\\/]|(?:\.pdf|\.pptx?|\.png)\b|sourceFile|sourcePath|sourcePage|teacherAnswer)/i;

assert.equal(lesson.experience.kind, "course-concept");
assert.equal(lesson.experience.tracks.length, 2);
assert.equal(lesson.experience.tracks.every((track) => track.beats.length === 4), true);
assert.equal(lesson.original.items.length, 4);
assert.equal(lesson.similarPractice.length, 5);
assert.equal(items.length, 10);
assert.equal(new Set(items.map((item) => item.id)).size, 10);
assert.equal(new Set(items.map((item) => item.answerRef)).size, 10);
assert.equal(items.every((item) => item.answerMode === "input" && item.inputMode === "text"), true);

const walk = (value, path = "root") => {
  if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
    assert.equal(forbiddenKeys.test(`${path}.${key}`), false, `forbidden key ${path}.${key}`);
    walk(child, `${path}.${key}`);
  } else if (typeof value === "string") assert.equal(forbiddenSource.test(value), false, `source-like value at ${path}`);
};
walk(lesson);

const countCases = [
  [1, "노랑 / 1개 / 동그라미"],
  [20, "보라 / 4개 / 세모"],
  [27, "빨강 / 3개 / 네모"],
  [60, "보라 / 4개 / 육각형"],
  [61, "노랑 / 1개 / 동그라미"],
  [120, "보라 / 4개 / 육각형"]
];
for (const [position, expected] of countCases) assert.equal(course02MultiPatternAnswer({ ...items[0].visual, position }), expected);

const sizeVisual = lesson.original.items.find((item) => item.visual.mode === "size").visual;
const sizeCases = [
  [1, "큰 / 하양 / 동그라미"],
  [2, "작은 / 초록 / 세모"],
  [3, "작은 / 초록 / 네모"],
  [4, "큰 / 하양 / 별"],
  [12, "작은 / 초록 / 별"],
  [13, "큰 / 하양 / 동그라미"],
  [26, "작은 / 초록 / 세모"]
];
for (const [position, expected] of sizeCases) assert.equal(course02MultiPatternAnswer({ ...sizeVisual, position }), expected);

for (let position = 1; position <= 600; position++) {
  const answer = course02MultiPatternAnswer({ ...items[0].visual, position });
  assert.match(answer, /^(노랑|빨강|파랑|초록|보라) \/ [1-4]개 \/ (동그라미|세모|네모|별|마름모|육각형)$/);
  assert.equal(course02MultiPatternAnswer({ ...items[0].visual, position: position + 60 }), answer, `LCM period mismatch at ${position}`);
}

for (let position = 1; position <= 120; position++) {
  const answer = course02MultiPatternAnswer({ ...sizeVisual, position });
  assert.match(answer, /^(큰|작은) \/ (하양|초록) \/ (동그라미|세모|네모|별)$/);
  assert.equal(course02MultiPatternAnswer({ ...sizeVisual, position: position + 12 }), answer, `size LCM period mismatch at ${position}`);
}

const problem = course02MultiPatternConceptMarkup({ ...items[0].visual, phase: "problem" });
assert.equal((problem.match(/class="multi-pattern-row"/g) || []).length, 3);
assert.equal((problem.match(/data-cycle-part="full"/g) || []).length, 6);
assert.equal((problem.match(/data-cycle-part="partial"/g) || []).length, 3);
assert.equal((problem.match(/첫째 마디/g) || []).length, 3);
assert.equal((problem.match(/둘째 마디/g) || []).length, 3);
assert.equal((problem.match(/다음 2개/g) || []).length, 3);
assert.equal(problem.includes(course02MultiPatternAnswer(items[0].visual)), false, "problem markup must not reveal the answer contract");
const verify = course02MultiPatternConceptMarkup({ ...items[0].visual, phase: "verify" });
assert.match(verify, /multi-pattern-result/);
assert.match(verify, /23번째 카드/);
assert.equal(verify.includes("undefined"), false);
assert.equal(verify.includes("NaN"), false);

const sizeProblem = course02MultiPatternConceptMarkup({ ...sizeVisual, phase: "problem" });
assert.equal((sizeProblem.match(/class="multi-pattern-row"/g) || []).length, 3);
assert.match(sizeProblem, />모양</);
assert.match(sizeProblem, />색</);
assert.match(sizeProblem, />크기</);
assert.equal(sizeProblem.includes(course02MultiPatternAnswer(sizeVisual)), false, "size problem markup must not reveal the answer contract");
const sizeVerify = course02MultiPatternConceptMarkup({ ...sizeVisual, position: 26, phase: "verify" });
assert.match(sizeVerify, /작은 · 초록 · 세모/);
assert.equal(sizeVerify.includes("undefined"), false);
assert.equal(sizeVerify.includes("NaN"), false);

console.log(`COURSE02_A1_MULTI_PATTERN_AUDIT_OK items=${items.length} tracks=${lesson.experience.tracks.length} periods=60,12`);
