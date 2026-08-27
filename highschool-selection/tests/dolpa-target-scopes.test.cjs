"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const scopes = require("../data/dolpa-target-scopes.js");

function question(semester, unit, sourceRelation = "original") {
  return { semester, minorUnit: unit, sourceRelation };
}

test("중2-2 입반 대비는 중2-1 연립일차방정식까지만 원본 문항을 받는다", () => {
  const id = "dp-middle2-2-transfer";
  assert.equal(scopes.evaluateQuestion(id, question("중1-2", "기본도형")).eligible, true);
  assert.equal(scopes.evaluateQuestion(id, question("중2-1", "연립일차방정식의 활용")).eligible, true);
  assert.equal(scopes.evaluateQuestion(id, question("중2-1", "일차함수")).eligible, false);
  assert.equal(scopes.evaluateQuestion(id, question("중2-2", "도형의 닮음")).eligible, false);
  assert.equal(scopes.evaluateQuestion(id, question("중등 심화", "경우의 수")).eligible, false);
});

test("공통수학1 입반 대비는 중2-1~중3-2의 실제 원본만 받는다", () => {
  const id = "dp-common1-entry-202405";
  assert.equal(scopes.evaluateQuestion(id, question("중2-1", "식의 계산")).eligible, true);
  assert.equal(scopes.evaluateQuestion(id, question("중2-2·중3-1 연계", "확률·제곱근과 실수")).eligible, true);
  assert.equal(scopes.evaluateQuestion(id, question("중1-2", "입체도형의 성질")).eligible, false);
  assert.equal(scopes.evaluateQuestion(id, question("중2-2 연계", "도형의 닮음", "replacement")).eligible, false);
});
