"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const policy = require("../data/middle-math-language-policy.js");

test("중등 교점에 교집합 기호를 쓰면 차단한다", function () {
  const result = policy.audit({ semester: "중2-2", promptHtml: "P=AE∩BD일 때 넓이를 구하여라." });
  assert.equal(result.applicable, true);
  assert.equal(result.passed, false);
  assert.equal(result.issues[0].code, "middle.disallowed_set_notation");
});

test("중등 선분 위의 점에 소속 기호를 쓰면 차단한다", function () {
  assert.throws(function () {
    policy.assertAllowed({ curriculum: { semester: "중1-2" }, solution: ["D∈BC이므로 다음과 같다."] });
  }, function (error) { return error && error.code === "MIDDLE_MATH_LANGUAGE_BLOCKED"; });
});

test("HTML 문자 참조로 숨긴 집합 기호도 차단한다", function () {
  const result = policy.audit({ level: "middle", choices: ["P=AE&cap;BD"] });
  assert.equal(result.passed, false);
  assert.equal(result.issues[0].symbol, "&cap;");
});

test("중등 교과서식 문장은 통과한다", function () {
  const result = policy.audit({
    gradeBand: "중등",
    prompt: "선분 AE와 선분 BD의 교점을 P라 하자. D는 선분 BC 위의 점이다.",
    solutionHtml: "<p>두 선분의 교점 P를 이용한다.</p>"
  });
  assert.equal(result.passed, true);
  assert.deepEqual(result.issues, []);
});

test("고등 집합 단원의 정상적인 집합 기호에는 적용하지 않는다", function () {
  const result = policy.audit({ courseCode: "common2", majorUnit: "집합과 명제", prompt: "A∩B를 구하여라." });
  assert.equal(result.applicable, false);
  assert.equal(result.passed, true);
});
