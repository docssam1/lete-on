"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const { analyze, domainsFor } = require("../competition/paper-review-analysis.js");
const paperLibrary = require("../competition/amc-original-paper-library.js");

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

test("AMC 8 paper review separates number/proportion/estimation and graph/table interpretation", function () {
  const entries = Array.from({ length: 25 }, () => entry());
  entries[0] = entry("correct", "number");
  entries[1] = entry("wrong", "data", "reading");
  entries[2] = entry("blank", "data", "skipped");
  const report = analyze(entries, 25, "amc8");
  assert.equal(report.valid, true);
  assert.equal(report.domains.length, 6);
  assert.equal(report.domains.find((domain) => domain.id === "number").name, "수와 정수의 성질");
  assert.equal(report.domains.find((domain) => domain.id === "data").name, "자료와 통계");
  assert.equal(report.domainClassified, 3);
  assert.equal(report.lowestDomains.length, 0);
  assert.equal(analyze([entry("correct", "data")], 1, "amc10").valid, true);
});

test("source-mapped AMC concepts remain distinct from a learner's manual domain overrides", function () {
  const entries = [
    { ...entry("wrong", "counting", "concept"), suggestedDomain: "counting", domainOrigin: "source-mapped", sourceConceptLabel: "포함배제·최소공배수" },
    { ...entry("correct", "number"), suggestedDomain: "geometry", domainOrigin: "manual", sourceConceptLabel: "원의 넓이·넓이비·축척" },
    { ...entry("blank", "unclassified"), suggestedDomain: "geometry", domainOrigin: "unclassified", sourceConceptLabel: "원·현·피타고라스 정리" }
  ];
  const report = analyze(entries, entries.length, "amc8");
  assert.equal(report.valid, true);
  assert.equal(report.sourceMappedCount, 1);
  assert.equal(report.sourceConceptReferenceCount, 3);
  assert.equal(report.manualDomainCount, 1);
  assert.deepEqual(report.reviewItems[0], {
    number: 1, status: "wrong", answer: "", domain: "counting", reason: "concept",
    suggestedDomain: "counting", sourceConceptLabel: "포함배제·최소공배수", domainOrigin: "source-mapped"
  });
  assert.deepEqual(report.reviewItems[1], {
    number: 3, status: "blank", answer: "", domain: "unclassified", reason: "none",
    suggestedDomain: "geometry", sourceConceptLabel: "원·현·피타고라스 정리", domainOrigin: "unclassified"
  });
});

test("domain comparison requires enough classified attempts in two domains", function () {
  const entries = [entry("correct", "algebra"), entry("correct", "algebra"), entry("correct", "algebra"), entry("wrong", "number", "concept"), entry("wrong", "number", "concept"), entry("correct", "number"), entry("wrong", "unclassified", "time")];
  const report = analyze(entries, entries.length);
  assert.deepEqual(report.lowestDomains, [{ id: "number", name: "수와 정수의 성질", correct: 1, attempted: 3, blank: 0 }]);
  assert.deepEqual(report.reviewItems, [
    { number: 4, status: "wrong", answer: "", domain: "number", reason: "concept" },
    { number: 5, status: "wrong", answer: "", domain: "number", reason: "concept" },
    { number: 7, status: "wrong", answer: "", domain: "unclassified", reason: "time" }
  ]);
  assert.deepEqual(report.domainReviewItemNumbers.number, { wrong: [4, 5], blank: [] });
  assert.equal(report.unclassified, 1);
  assert.equal(report.domainClassified, 6);
  assert.equal(report.reasonClassified, 3);
  assert.equal(report.domains.find((domain) => domain.id === "number").rate, 33);
  assert.equal(report.domains.find((domain) => domain.id === "geometry").evidence, "미측정");
});

test("paper review shows all ties and separately includes blank responses", function () {
  const entries = [entry("wrong", "number"), entry("correct", "number"), entry("wrong", "number"),
    entry("correct", "algebra"), entry("correct", "algebra"), entry("correct", "algebra"), entry("blank", "number")];
  const report = analyze(entries, entries.length);
  assert.deepEqual(report.lowestDomains, [{ id: "number", name: "수와 정수의 성질", correct: 1, attempted: 3, blank: 1 }]);
  assert.deepEqual(report.domainReviewItemNumbers.number, { wrong: [1, 3], blank: [7] });
  assert.deepEqual(report.reviewItems.at(-1), { number: 7, status: "blank", answer: "", domain: "number", reason: "none" });
  const tied = analyze([entry("wrong", "number"), entry("correct", "number"), entry("correct", "number"),
    entry("wrong", "algebra"), entry("correct", "algebra"), entry("correct", "algebra")], 6);
  assert.deepEqual(tied.lowestDomains, []);
  const tiedLowest = analyze([entry("wrong", "number"), entry("correct", "number"), entry("correct", "number"),
    entry("wrong", "algebra"), entry("correct", "algebra"), entry("correct", "algebra"),
    entry("correct", "geometry"), entry("correct", "geometry"), entry("correct", "geometry")], 9);
  assert.deepEqual(tiedLowest.lowestDomains.map((domain) => domain.name), ["식과 대수 관계", "수와 정수의 성질"]);
});

test("selected multiple-choice responses are returned only with the learner's review items", function () {
  const entries = [entry("wrong", "number", "concept"), entry("correct", "algebra"), entry("unmarked")];
  entries[0].answer = "D";
  entries[1].answer = "A";
  const report = analyze(entries, entries.length, "amc8");
  assert.equal(report.valid, true);
  assert.equal(report.reviewItems[0].answer, "D");
  assert.equal(analyze([{ ...entry("wrong", "number", "concept"), answer: "F" }], 1, "amc8").valid, false);
});

test("blank response reasons stay separate from wrong-answer reasons", function () {
  const report = analyze([
    entry("wrong", "algebra", "time"),
    entry("blank", "number", "time"),
    entry("blank", "geometry", "skipped"),
    entry("blank", "counting", "could-not-start")
  ], 4);
  assert.equal(report.reasonClassified, 1);
  assert.deepEqual(report.reasons, [{ id: "time", name: "시간", count: 1 }]);
  assert.equal(report.blankReasonClassified, 3);
  assert.deepEqual(report.blankReasons, [
    { id: "time", name: "시간 부족", count: 1 },
    { id: "skipped", name: "건너뜀", count: 1 },
    { id: "could-not-start", name: "시작 방법을 찾지 못함", count: 1 }
  ]);
});

test("paper review rejects reasons that do not match the selected response state", function () {
  assert.equal(analyze([entry("wrong", "algebra", "skipped")], 1).valid, false);
  assert.equal(analyze([entry("blank", "number", "concept")], 1).valid, false);
  assert.equal(analyze([entry("correct", "geometry", "time")], 1).valid, false);
});

test("complete AMC original-paper marks calculate the raw score and position by question range", function () {
  const amc8 = [entry("correct"), entry("wrong"), ...Array.from({ length: 23 }, function () { return entry("blank"); })];
  const amc10 = [...Array.from({ length: 10 }, function () { return entry("correct"); }), ...Array.from({ length: 5 }, function () { return entry("wrong"); }), ...Array.from({ length: 10 }, function () { return entry("blank"); })];
  assert.deepEqual(analyze(amc8, 25, "amc8").scoreEstimate, { points: 1, max: 25, label: "AMC 8 정답 수" });
  assert.deepEqual(analyze(amc8, 25, "amc8").questionBands.map(({ start, end, correct }) => ({ start, end, correct })), [
    { start: 1, end: 10, correct: 1 }, { start: 11, end: 15, correct: 0 }, { start: 16, end: 20, correct: 0 }, { start: 21, end: 25, correct: 0 }
  ]);
  assert.deepEqual(analyze(amc10, 25, "amc10").scoreEstimate, { points: 75, max: 150, label: "AMC 10 참고 원점수" });
  assert.deepEqual(analyze(amc10, 25, "amc10").level, { kind: "original-paper-performance", score: 75, max: 150, bands: analyze(amc10, 25, "amc10").questionBands });
  assert.deepEqual(analyze(amc10, 25, "amc12").scoreEstimate, { points: 75, max: 150, label: "AMC 12 참고 원점수" });
  assert.equal(analyze(amc10.slice(0, 24).concat(entry()), 25, "amc10").scoreEstimate, null);
  assert.equal(analyze(amc10.slice(0, 24).concat(entry()), 25, "amc10").level, null);
  assert.equal(analyze(Array.from({ length: 24 }, function () { return entry("correct"); }), 24, "amc10").scoreEstimate, null);
  assert.equal(analyze(amc8, 25, "sasmo").scoreEstimate, null);
  assert.equal(analyze(amc10, 25, "amc10").officialScore, null);
});

test("AIME manual review reports only the raw number correct and validates integer responses", function () {
  const entries = Array.from({ length: 15 }, function () { return entry("correct", "algebra"); });
  entries[0].answer = "0";
  entries[1].answer = "999";
  const report = analyze(entries, 15, "aime");
  assert.equal(report.valid, true);
  assert.equal(report.itemCount, 15);
  assert.equal(report.counts.correct, 15);
  assert.deepEqual(report.scoreEstimate, { points: 15, max: 15, label: "AIME 원본 정답 수" });
  assert.equal(report.officialScore, null);
  assert.equal(report.level.kind, "original-paper-performance");
  assert.equal(analyze([{ ...entry("wrong", "algebra", "concept"), answer: "1000" }], 1, "aime").valid, false);
  assert.equal(analyze([{ ...entry("wrong", "algebra", "concept"), answer: "12.5" }], 1, "aime").valid, false);
});

test("all AMC/AIME diagnostics include data and functions as distinct review domains", function () {
  ["amc8", "amc10", "amc12", "aime"].forEach(function (program) {
    assert.ok(domainsFor(program).some(function (domain) { return domain.id === "data"; }));
    assert.ok(domainsFor(program).some(function (domain) { return domain.id === "functions"; }));
  });
  assert.ok(domainsFor("amc12").some(function (domain) { return domain.id === "functions" && /함수/.test(domain.title); }));
  const marks = Array.from({ length: 25 }, function () { return { status: "unmarked", answer: "", domain: "unclassified", reason: "none" }; });
  marks[4] = { status: "wrong", answer: "A", domain: "functions", reason: "concept" };
  const result = analyze(marks, 25, "amc12");
  assert.equal(result.valid, true);
  assert.deepEqual(result.reviewItems.map(function (item) { return [item.number, item.domain]; }), [[5, "functions"]]);
});

test("AMC 12 scores respect the selected historical paper format", function () {
  const old = Array.from({ length: 50 }, function () { return entry("correct", "algebra"); });
  const oldResult = analyze(old, 50, "amc12", paperLibrary.formatFor("amc12", 1955));
  assert.equal(oldResult.scoreEstimate, null);
  assert.equal(oldResult.level, null);
  assert.equal(oldResult.counts.correct, 50);

  const ahsme1975 = Array.from({ length: 30 }, function () { return entry("blank"); });
  ahsme1975[0] = entry("correct");
  ahsme1975[1] = entry("wrong");
  assert.deepEqual(analyze(ahsme1975, 30, "amc12", paperLibrary.formatFor("amc12", 1975)).scoreEstimate,
    { points: 4, max: 150, label: "AHSME 원본 점수", adjustmentNote: "", adjustmentSourceUrl: "" });

  const ahsme1977 = Array.from({ length: 30 }, function () { return entry("blank"); });
  ahsme1977[0] = entry("correct");
  ahsme1977[1] = entry("wrong");
  assert.deepEqual(analyze(ahsme1977, 30, "amc12", paperLibrary.formatFor("amc12", 1977)).scoreEstimate,
    { points: 33, max: 150, label: "AHSME 원본 점수", adjustmentNote: "", adjustmentSourceUrl: "" });
});

test("rejects mismatched paper size and unknown marks", function () {
  assert.equal(analyze([entry()], 25).valid, false);
  assert.equal(analyze([entry("invented")], 1).valid, false);
  assert.equal(analyze([entry()], 51).valid, false);
  assert.match(analyze([entry(), entry()], 2).error, /표시한 문제가 없습니다/);
});
