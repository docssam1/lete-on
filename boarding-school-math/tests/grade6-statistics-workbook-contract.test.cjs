"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const renderer = require("../scripts/render-private-grade6-workbook.cjs");
const validator = require("../scripts/validate-private-grade6-workbook.cjs");

function gcd(left, right) {
  let a = BigInt(left);
  let b = BigInt(right);
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function rational(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  const top = BigInt(numerator) / divisor;
  const bottom = BigInt(denominator) / divisor;
  return bottom === 1n ? String(top) : `${top}/${bottom}`;
}

function independentStatisticsAnswer(kind, values) {
  const sorted = values.slice().sort(function (left, right) { return left - right; });
  if (kind === "statistics-observation-count") return String(values.length);
  if (kind === "statistics-mean") return rational(values.reduce(function (sum, value) { return sum + value; }, 0), values.length);
  if (kind === "statistics-median") {
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 1 ? String(sorted[middle]) : rational(sorted[middle - 1] + sorted[middle], 2);
  }
  return String(sorted[sorted.length - 1] - sorted[0]);
}

test("Grade 6 statistics checks independently compute count, mean, median, and range", function () {
  const cases = [
    { kind: "statistics-observation-count", values: [4, 7, 7, 9, 11, 14] },
    { kind: "statistics-mean", values: [3, 5, 7, 9, 11] },
    { kind: "statistics-median", values: [4, 6, 8, 10, 12, 14] },
    { kind: "statistics-range", values: [18, 12, 21, 15, 16, 19] }
  ];
  cases.forEach(function (candidate) {
    assert.equal(validator.canonicalAnswer(candidate, "statistics-contract"), independentStatisticsAnswer(candidate.kind, candidate.values));
  });
});

test("Grade 6 statistics checks reject malformed or unsupported data", function () {
  [
    { kind: "statistics-mean", values: [1, 2, 3, 4] },
    { kind: "statistics-range", values: [1, 2, 3, 4, 101] },
    { kind: "statistics-mode", values: [1, 1, 2, 3, 4] },
    { kind: "statistics-median", values: [1, 2, 3, 4, 5], extra: true }
  ].forEach(function (candidate) {
    assert.throws(function () { validator.canonicalAnswer(candidate, "statistics-invalid"); }, /ARITHMETIC_CHECK_INVALID/);
  });
});

test("statistics displays render as visible student data without carrying teacher answers", function () {
  const display = { kind: validator.SP_STATISTICS_DISPLAY_KIND, values: [6, 8, 8, 10, 13] };
  assert.doesNotThrow(function () { validator.validateStatisticsDisplay(display, "statistics-display"); });
  const model = renderer.statisticsDisplayForModel(display);
  const html = renderer.renderStatisticsDisplay(model);
  assert.match(html, /class="statistics-display"/u);
  assert.equal((html.match(/class="statistics-value"/gu) || []).length, display.values.length);
  assert.doesNotMatch(html, /expectedResponse|answerReferences|solutionByLocale/u);
});

test("both Grade 6 statistics clusters keep interpretation decisions teacher-observed", function () {
  ["ccss-6-sp-a", "ccss-6-sp-b"].forEach(function (unitId) {
    const policy = validator.SP_TEACHER_OBSERVATION_BY_UNIT_AND_PROFILE[unitId];
    assert.deepEqual(Object.keys(policy).sort(), ["assignment-builder:advanced", "assignment-builder:core", "lesson-plan:core"]);
    Object.values(policy).forEach(function (localized) {
      assert.deepEqual(Object.keys(localized).sort(), ["en", "ko", "zh-Hans"]);
      assert.match(localized.en, /Teacher observation only/u);
    });
  });
});
