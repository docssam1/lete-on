"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..", "..");
function loadWindowScript(relativePath, exportName) {
  const filePath = path.join(root, relativePath);
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, { filename: filePath });
  return context.window[exportName];
}

const data = loadWindowScript("premier/diagnosis-data.js", "PREMIER_DIAGNOSIS_DATA");
assert(data, "프리미어 진단 메타데이터를 찾을 수 없습니다.");
assert.deepStrictEqual(Object.keys(data).sort(), ["exams", "policy", "version"]);
assert.strictEqual(data.policy, "original-image-single-answer-only");
assert.strictEqual(data.exams.length, 15, "활용 8회·파이널 3회·최종 4회여야 합니다.");

const expectedCounts = [
  20, 14, 11, 12, 17, 11, 12, 15,
  8, 13, 16,
  16, 17, 14, 15
];
const allowedAreas = new Set(["수와 연산", "공간과 도형", "논리와 관계", "규칙과 관계", "경우의 수", "측정과 시간"]);
let eligibleTotal = 0;
let lockedTotal = 0;
data.exams.forEach((exam, examIndex) => {
  assert.deepStrictEqual(Object.keys(exam).sort(), ["eligibleCount", "key", "lockedCount", "questions", "title", "totalQuestions"]);
  assert.match(exam.key, /^premier-(utilization|final|last)-\d+$/);
  assert.strictEqual(exam.totalQuestions, 20);
  assert.strictEqual(exam.questions.length, 20);
  assert.strictEqual(exam.eligibleCount, expectedCounts[examIndex], `${exam.key}: 원본 이미지 채점 가능 수가 다릅니다.`);
  assert.strictEqual(exam.lockedCount, 20 - exam.eligibleCount);
  assert.deepStrictEqual(Array.from(exam.questions, (question) => question.number), Array.from({ length: 20 }, (_, index) => index + 1));
  exam.questions.forEach((question) => {
    assert.deepStrictEqual(Object.keys(question).sort(), ["area", "number", "reviewStatus", "scoringEligible", "type"]);
    assert(allowedAreas.has(question.area), `${exam.key} ${question.number}: 알 수 없는 영역입니다.`);
    assert.strictEqual(typeof question.type, "string");
    assert(question.type.length > 1 && question.type.length < 80, `${exam.key} ${question.number}: 유형명이 비정상입니다.`);
    assert.strictEqual(question.reviewStatus, question.scoringEligible ? "verified" : "locked");
  });
  eligibleTotal += exam.eligibleCount;
  lockedTotal += exam.lockedCount;
});
assert.strictEqual(eligibleTotal, 211);
assert.strictEqual(lockedTotal, 89);

const utilizationTwo = data.exams.find((exam) => exam.key === "premier-utilization-2");
assert.strictEqual(utilizationTwo.questions.find((question) => question.number === 4).scoringEligible, true, "활용 2회 4번은 전수 검산된 단일답 문항이어야 합니다.");
function rollDie(state, direction) {
  const { top, bottom, north, south, east, west } = state;
  if (direction === "E") return { top: west, bottom: east, north, south, east: top, west: bottom };
  if (direction === "W") return { top: east, bottom: west, north, south, east: bottom, west: top };
  return { top: north, bottom: south, north: bottom, south: top, east, west };
}
const q04Sums = new Set();
for (const top of [1, 2, 5, 6]) {
  for (const north of [1, 2, 5, 6]) {
    const state = { top, bottom: 7 - top, north, south: 7 - north, east: 3, west: 4 };
    if (new Set(Object.values(state)).size !== 6) continue;
    let current = state;
    let sum = 0;
    for (const direction of ["E", "E", "S", "W", "W", "S", "E"]) {
      current = rollDie(current, direction);
      sum += current.bottom;
    }
    q04Sums.add(sum);
  }
}
assert.deepStrictEqual([...q04Sums], [23], "활용 2회 4번은 가능한 모든 시작 방향에서 바닥면 합이 23이어야 합니다.");

const serialized = JSON.stringify(data).toLowerCase();
[
  "g:\\", ".pdf", "http://", "https://", "source_id", "pointer", "summary",
  "answertext", "answercandidates", "sha256", "01020837265", "@gmail.com"
].forEach((token) => assert(!serialized.includes(token), `공개 진단 데이터에 금지된 값이 있습니다: ${token}`));

const diagnosisHtml = fs.readFileSync(path.join(root, "premier", "diagnosis.html"), "utf8");
assert.match(diagnosisHtml, /diagnosis-data\.js/);
assert.match(diagnosisHtml, /scoringEligible/);
assert.match(diagnosisHtml, /gfield-premier-diagnosis:/);
assert.match(diagnosisHtml, /부족 영역 진단/);
assert.match(diagnosisHtml, /부족 유형/);
assert.match(diagnosisHtml, /채점 제외/);
assert(!/answer\s*[:=]/i.test(diagnosisHtml), "진단 화면에 정답 데이터가 들어가면 안 됩니다.");

const viewerHtml = fs.readFileSync(path.join(root, "fields-classic", "print-viewer", "index.html"), "utf8");
assert.match(viewerHtml, /id="diagnosisBtn"/);
assert.match(viewerHtml, /\.\.\/\.\.\/premier\/diagnosis\.html\?exam=/);
assert.match(viewerHtml, /documentKey\.startsWith\("premier-"\)/);

const releaseCatalog = loadWindowScript("hyper-focus/mock/premier-release-catalog.js", "GFIELD_HF_PREMIER_RELEASE_CATALOG");
const releaseRounds = releaseCatalog.series.flatMap((series) => series.rounds);
assert.strictEqual(releaseRounds.length, data.exams.length);
releaseRounds.forEach((round, index) => {
  const normalizedKey = round.key.replace(/-(\d{2})$/, (_, digits) => `-${Number(digits)}`);
  assert.strictEqual(normalizedKey, data.exams[index].key);
  assert.strictEqual(round.verifiedCount, data.exams[index].eligibleCount, `${round.key}: 공개 감사 수치와 진단 수치가 다릅니다.`);
  assert.strictEqual(round.lockedCount, data.exams[index].lockedCount, `${round.key}: 잠금 수치와 진단 수치가 다릅니다.`);
});

console.log(`PASS: 프리미어 진단 15회 · 채점 가능 ${eligibleTotal}문항 · 검수 제외 ${lockedTotal}문항`);
