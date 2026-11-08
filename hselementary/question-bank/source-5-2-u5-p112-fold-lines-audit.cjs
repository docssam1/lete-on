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
for (const number of [33, 34, 35]) {
  const question = bank.build(number);
  for (const diagram of [question.prompt, ...(question.answerVisual ? [question.answerVisual] : [])]) {
    const fold = diagram.match(new RegExp(`<path data-net112-folds="${number}"[^>]*>`))?.[0];
    assert(fold, `${number}: 접는 선`);
    assert.match(fold, /stroke-dasharray="4 2"/);
    assert.equal((fold.match(/M\d+ \d+ (?:L\d+ \d+|[HV]\d+)/g) || []).length, 5);
  }
}
const cube35 = bank.build(35).prompt.match(/<svg[^>]*aria-label="숨은 꼭짓점 ㅇ[^]*?<\/svg>/)?.[0];
assert(cube35, '35: 원문의 숨은 꼭짓점 ㅇ이 표시된 겨냥도');
for (const label of ['ㄱ', 'ㄹ', 'ㄷ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ']) assert(cube35.includes(`>${label}</text>`), `35: 꼭짓점 ${label} 표시`);
assert(!bank.build(35).prompt.includes('M145 20 L170 45'), '35: 문제 그림에 답을 넣지 않음');
assert(bank.build(35).answerVisual.includes('M145 20 L170 45'), '35: 정답 그림에 선 표시');
for (const [number, count] of [[36, 4], [45, 5]]) {
  const question = bank.build(number);
  for (const diagram of [question.prompt, question.answerVisual]) {
    const fold = diagram.match(new RegExp(`<path data-net-folds="${number}"[^>]*>`))?.[0];
    const outline = diagram.match(new RegExp(`<path data-net-outline="${number}"[^>]*>`))?.[0];
    assert(fold && outline, `${number}: 접는 선과 바깥 테두리`);
    assert.match(fold, /stroke-dasharray="4 2"/);
    assert.doesNotMatch(outline, /stroke-dasharray/);
    assert.equal((fold.match(/M\d+ \d+ [HV]\d+/g) || []).length, count);
  }
}
assert(!bank.build(36).prompt.includes('fill="#ccc"'), '36: 문제 그림에 답을 넣지 않음');
assert(bank.build(36).answerVisual.includes('fill="#ccc"'), '36: 답 그림에 색칠');
assert(!bank.build(45).prompt.includes('M43 46 V94'), '45: 문제 그림에 답을 넣지 않음');
assert(bank.build(45).answerVisual.includes('M43 46 V94'), '45: 답 그림에 추가 선 표시');
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
console.log("PASS: p112 q33–39 and p113 q45 solid given lines, dashed folds, and answer diagrams");
