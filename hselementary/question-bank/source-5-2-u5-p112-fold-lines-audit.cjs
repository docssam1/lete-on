"use strict";
const assert = require("node:assert/strict");
const bank = require("./source-5-2-u5-page108-practice.js");
for (const [number, given, added] of [
  [37, "M55 90 L95 130", "M15 130 L55 90 M55 90 L95 50"],
  [39, "M65 55 L105 95", "M25 95 L65 135 M65 135 L25 175 M105 95 L145 135"]
]) {
  const question = bank.build(number);
  assert(question && question.answerVisualRequired);
  for (const diagram of [question.prompt, question.answerVisual]) {
    const fold = diagram.match(new RegExp(`<path data-net112-folds="${number}"[^>]*>`))?.[0];
    const outline = diagram.match(new RegExp(`<path data-net112-outline="${number}"[^>]*>`))?.[0];
    assert(fold && outline, `${number}: 접는 선과 테두리`);
    assert.match(fold, /stroke-dasharray="4 2"/);
    assert.doesNotMatch(outline, /stroke-dasharray/);
    assert.equal((fold.match(/M\d+ \d+ L\d+ \d+/g) || []).length, 5);
    assert.equal((outline.match(/M\d+ \d+ L\d+ \d+/g) || []).length, 14);
    assert(diagram.includes(given), `${number}: 주어진 실선`);
  }
  assert(!question.prompt.includes(added), `${number}: 문제 그림에 답을 넣지 않음`);
  assert(question.answerVisual.includes(added), `${number}: 정답 그림의 추가 선`);
}
const tape = bank.build(38);
const tapeFold = tape.prompt.match(/<path data-net112-folds="38"[^>]*>/)?.[0];
const tapeOutline = tape.prompt.match(/<path data-net112-outline="38"[^>]*>/)?.[0];
const tapeMarks = tape.prompt.match(/<path d="M20 65 L65 20[^>]*>/)?.[0];
assert(tapeFold && tapeOutline && tapeMarks);
assert.match(tapeFold, /stroke-dasharray="4 2"/);
assert.doesNotMatch(tapeOutline, /stroke-dasharray/);
assert.doesNotMatch(tapeMarks, /stroke-dasharray/);
assert.equal((tapeFold.match(/M\d+ \d+ L\d+ \d+/g) || []).length, 5);
assert.equal((tapeOutline.match(/M\d+ \d+ L\d+ \d+/g) || []).length, 14);
assert.equal((tapeMarks.match(/M\d+ \d+ L\d+ \d+/g) || []).length, 6);
assert(tape.answerVisualRequired && tape.answerVisual.includes("보이는 면"));
console.log("PASS: p112 q37–39 solid given lines, dashed folds, and answer diagrams");
