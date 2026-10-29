"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const { analyze } = require("../competition/paper-review-analysis.js");

function entry(status = "unmarked", domain = "unclassified", reason = "none") { return { status, domain, reason }; }

test("unmarked and unanswered questions are distinct from wrong attempts", function () {
  const report = analyze([entry("correct", "algebra"), entry("wrong", "algebra", "reading"), entry("blank", "geometry"), entry()], 4);
  assert.equal(report.valid, true);
  assert.deepEqual(report.counts, { correct: 1, wrong: 1, blank: 1, unmarked: 1 });
  assert.equal(report.attempted, 2);
  assert.equal(report.accuracy, null);
  assert.equal(report.domainClassified, 3);
  assert.equal(report.reasonClassified, 1);
  assert.equal(report.domains.find((domain) => domain.id === "algebra").rate, null);
  assert.equal(report.domains.find((domain) => domain.id === "geometry").blank, 1);
  assert.deepEqual(report.reasons, [{ id: "reading", name: "조건 읽기", count: 1 }]);
  assert.equal(report.complete, false);
  assert.equal(report.officialScore, null);
  assert.equal(report.level, null);
});

test("domain comparison requires enough classified attempts in two domains", function () {
  const entries = [entry("correct", "algebra"), entry("correct", "algebra"), entry("correct", "algebra"), entry("wrong", "number", "concept"), entry("wrong", "number", "concept"), entry("correct", "number"), entry("wrong", "unclassified", "time")];
  const report = analyze(entries, entries.length);
  assert.equal(report.reviewFirst, "수와 정수론");
  assert.equal(report.unclassified, 1);
  assert.equal(report.domainClassified, 6);
  assert.equal(report.reasonClassified, 3);
  assert.equal(report.domains.find((domain) => domain.id === "number").rate, 33);
  assert.equal(report.domains.find((domain) => domain.id === "geometry").evidence, "미측정");
});

test("complete AMC marks can show a cautious raw-score estimate using format-specific scoring", function () {
  const amc8 = [entry("correct"), entry("wrong"), ...Array.from({ length: 23 }, function () { return entry("blank"); })];
  const amc10 = [...Array.from({ length: 10 }, function () { return entry("correct"); }), ...Array.from({ length: 5 }, function () { return entry("wrong"); }), ...Array.from({ length: 10 }, function () { return entry("blank"); })];
  assert.deepEqual(analyze(amc8, 25, "amc8").scoreEstimate, { points: 1, max: 25, label: "AMC 8 참고 원점수" });
  assert.deepEqual(analyze(amc10, 25, "amc10").scoreEstimate, { points: 75, max: 150, label: "AMC 10 참고 원점수" });
  assert.deepEqual(analyze(amc10, 25, "amc12").scoreEstimate, { points: 75, max: 150, label: "AMC 12 참고 원점수" });
  assert.equal(analyze(amc10.slice(0, 24).concat(entry()), 25, "amc10").scoreEstimate, null);
  assert.equal(analyze(Array.from({ length: 24 }, function () { return entry("correct"); }), 24, "amc10").scoreEstimate, null);
  assert.equal(analyze(amc8, 25, "sasmo").scoreEstimate, null);
  assert.equal(analyze(amc10, 25, "amc10").officialScore, null);
});

test("rejects mismatched paper size and unknown marks", function () {
  assert.equal(analyze([entry()], 25).valid, false);
  assert.equal(analyze([entry("invented")], 1).valid, false);
  assert.equal(analyze([entry()], 31).valid, false);
  assert.match(analyze([entry(), entry()], 2).error, /표시한 문제가 없습니다/);
});
