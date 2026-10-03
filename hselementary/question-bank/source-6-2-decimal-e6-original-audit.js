"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "source-inventory-grade6.js"), "utf8"), context);
const catalog = context.window.HSE_SOURCE_INVENTORY_GRADE6.items;

// These calculations use the numbers printed on PDF pages 26-27, not the handwritten answers.
const cases = [
  {
    id: "exploration-1", page: 26, answer: "180cm", value: 180,
    solve: () => (((152.96 - 20) / 0.8 - 35) / 0.8 - 20) / 0.8,
  },
  {
    id: "example-1", page: 26, answer: "16.8L", value: 16.8,
    solve: () => 2.52 / (0.85 - 0.2 - 0.8 * (5 / 8)),
  },
  {
    id: "example-2", page: 26, answer: "26℃", value: 26,
    solve: () => (1736.8 / 5 - 331.5) / 0.61,
  },
  {
    id: "example-3", page: 26, answer: "180cm", value: 180,
    solve: () => 0.6 * (45 / (0.75 - 0.6)),
  },
  {
    id: "example-4", page: 26, answer: "4명", value: 4,
    solve: () => {
      const girlsLastYear = (1516 - 1500 * 0.95) / (1.08 - 0.95);
      return Math.abs((1500 - girlsLastYear) * 0.95 - girlsLastYear * 1.08);
    },
  },
  {
    id: "mission-1", page: 27, answer: "남학생 165명, 여학생 156명", value: 165156,
    solve: () => {
      const boysLastYear = 345 / (1 + 1.3);
      return Math.round(boysLastYear * 1.1) * 1000 + Math.round((345 - boysLastYear) * 0.8);
    },
  },
  {
    id: "mission-2", page: 27, answer: "13.5m", value: 13.5,
    solve: () => 6.21 / (1 - 0.3 - 0.3 * 0.8),
  },
  {
    id: "mission-3", page: 27, answer: "약 0.8배", value: 0.8,
    solve: () => {
      const turtle = (51.4 + 43.7 - 38.5) / 2;
      const dog = 51.4 - turtle;
      return Math.round((dog / turtle) * 10) / 10;
    },
  },
  {
    id: "mission-4", page: 27, answer: "5m", value: 5,
    solve: () => 1.65 / (0.7 * 0.7 - 0.4 * 0.4),
  },
  {
    id: "mission-5", page: 27, answer: "2948.4m", value: 2948.4,
    solve: () => 468 * 1.8 * 1.4 / (1.8 - 1.4),
  },
  {
    id: "mission-6", page: 27, answer: "18명", value: 18,
    solve: () => 22 * (89.5 - 86.35) / (86.35 - 82.5),
  },
];

assert.equal(new Set(cases.map(item => item.id)).size, 11);
const shapes = new Set();
const contracts = new Set();
for (const test of cases) {
  const id = `6-2-u2-e6-${test.id}`;
  const item = raw.items.find(candidate => candidate.sourceItemId === id);
  const publicType = catalog.find(candidate => candidate.sourceItemId === id);
  assert.ok(item && publicType, `${id}: raw/public type link missing`);
  assert.equal(item.pdfPage, test.page, `${id}: source page`);
  assert.equal(item.independentAnswer, test.answer, `${id}: independent answer`);
  assert.equal(item.answerEvidence, "independent-calculation-not-publisher-key");
  assert.equal(item.sourceVerified, true);
  const isReviewedSoundExample = test.id === "example-2";
  assert.equal(item.implementationStatus, isReviewedSoundExample ? "fixed-verified-pool" : "review-locked");
  assert.equal(publicType.reviewLocked, !isReviewedSoundExample, `${id}: release decision`);
  assert.equal(publicType.generatorKey, isReviewedSoundExample ? "sourceGrade6SecondDecimalDivisionE6Example2Candidate" : "");
  if (isReviewedSoundExample) {
    assert.equal(item.handwrittenAnswer, item.independentAnswer);
    assert.equal(item.publisherAnswerKeyVerified, false);
  }
  assert.ok(Math.abs(test.solve() - test.value) < 1e-8, `${id}: independent calculation`);
  assert.ok(!shapes.has(item.sourceShape), `${id}: duplicate source shape`);
  assert.ok(!contracts.has(item.answerContract), `${id}: duplicate answer contract`);
  shapes.add(item.sourceShape);
  contracts.add(item.answerContract);
}

console.log(`6-2 소수의 나눗셈 개념탐구 6: 원본 11항목·독립 계산, 소리 예제만 공개·나머지 잠금 검증 통과`);
