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
  20, 14, 16, 13, 17, 13, 12, 16,
  8, 14, 16,
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
assert.strictEqual(eligibleTotal, 221);
assert.strictEqual(lockedTotal, 79);

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

const utilizationThree = data.exams.find((exam) => exam.key === "premier-utilization-3");
for (const number of [5, 6, 12, 13, 17]) {
  assert.strictEqual(utilizationThree.questions.find((question) => question.number === number).scoringEligible, true, `활용 3회 ${number}번은 독립 검산된 채점 문항이어야 합니다.`);
}
assert.strictEqual(27 - [3, 3, 2, 2, 1].reduce((sum, height) => sum + height, 0), 16, "활용 3회 5번의 3×3×3 상자 잔여 수가 다릅니다.");
const outerGridSquares = [1, 2, 3].reduce((sum, size) => sum + (4 - size + 1) * (3 - size + 1), 0);
assert.strictEqual(outerGridSquares - 2 + 1 + 1, 20, "활용 3회 6번의 끊긴 두 칸·중앙 정사각형·기울어진 정사각형 분류가 다릅니다.");

function foldNumberGrid(grid, direction) {
  const height = grid.length;
  const width = grid[0].length;
  const flip = (stack) => [...stack].reverse();
  if (direction === "R2L") {
    const next = grid.map((row) => row.slice(0, width / 2).map((stack) => [...stack]));
    for (let row = 0; row < height; row += 1) for (let column = width / 2; column < width; column += 1) next[row][width - 1 - column].push(...flip(grid[row][column]));
    return next;
  }
  if (direction === "L2R") {
    const next = grid.map((row) => row.slice(width / 2).map((stack) => [...stack]));
    for (let row = 0; row < height; row += 1) for (let column = 0; column < width / 2; column += 1) next[row][width / 2 - 1 - column].push(...flip(grid[row][column]));
    return next;
  }
  if (direction === "U2D") {
    const next = grid.slice(height / 2).map((row) => row.map((stack) => [...stack]));
    for (let row = 0; row < height / 2; row += 1) for (let column = 0; column < width; column += 1) next[height / 2 - 1 - row][column].push(...flip(grid[row][column]));
    return next;
  }
  const next = grid.slice(0, height / 2).map((row) => row.map((stack) => [...stack]));
  for (let row = height / 2; row < height; row += 1) for (let column = 0; column < width; column += 1) next[height - 1 - row][column].push(...flip(grid[row][column]));
  return next;
}
let foldedGrid = Array.from({ length: 4 }, (_, row) => Array.from({ length: 8 }, (_, column) => [(row + 1) * (column + 1)]));
for (const direction of ["R2L", "U2D", "L2R", "D2U", "L2R"]) foldedGrid = foldNumberGrid(foldedGrid, direction);
assert.strictEqual(foldedGrid[0][0][foldedGrid[0][0].length - 1], 9, "활용 3회 12번의 다섯 번 접기 최상층이 다릅니다.");

const balanceRatios = new Set();
for (let square = 1; square <= 20; square += 1) for (let triangle = 1; triangle <= 20; triangle += 1) for (let circle = 1; circle <= 20; circle += 1) {
  if (square + triangle === circle && 3 * square === circle + 3 * triangle && (square + circle) % triangle === 0) balanceRatios.add((square + circle) / triangle);
}
assert.deepStrictEqual([...balanceRatios], [5], "활용 3회 13번의 빈 접시 삼각형 수가 유일하지 않습니다.");

const stepPairs = [];
for (let horizontal = -10; horizontal <= 10; horizontal += 1) for (let vertical = -10; vertical <= 10; vertical += 1) {
  const value = (row, column) => 3 + horizontal * column + vertical * row;
  if (value(0, 1) === 5 && value(0, 2) === 7 && value(1, 2) === 14 && value(2, 0) === 17 && value(2, 2) === 21 && value(3, 1) === 26 && value(3, 4) === 32) stepPairs.push([horizontal, vertical]);
}
assert.deepStrictEqual(stepPairs, [[2, 7]], "활용 3회 17번의 가로·세로 증가 규칙이 유일하지 않습니다.");
assert.deepStrictEqual([[2, 1], [2, 3], [3, 3]].map(([row, column]) => 3 + 2 * column + 7 * row), [19, 23, 30], "활용 3회 17번의 빈칸 값이 다릅니다.");

const utilizationFour = data.exams.find((exam) => exam.key === "premier-utilization-4");
assert.strictEqual(utilizationFour.questions.find((question) => question.number === 6).scoringEligible, true, "활용 4회 6번은 숫자와 거울축이 선명한 단일답 문항이어야 합니다.");
assert.strictEqual(utilizationFour.questions.find((question) => question.number === 19).scoringEligible, false, "활용 4회 19번은 모바일에서 접기 화살표가 작아 채점에서 제외해야 합니다.");
const horizontalMirrorDigit = new Map([["0", "0"], ["1", "1"], ["2", "5"], ["3", "3"], ["5", "2"], ["6", "9"], ["8", "8"], ["9", "6"]]);
const mirroredClockCandidates = [];
for (let hour = 0; hour < 24; hour += 1) for (let minute = 0; minute < 60; minute += 1) {
  const realTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const mirrored = [...realTime].map((character) => character === ":" ? ":" : horizontalMirrorDigit.get(character)).join("");
  if (mirrored === "02:52") mirroredClockCandidates.push(realTime);
}
assert.deepStrictEqual(mirroredClockCandidates, ["05:25"], "활용 4회 6번의 아래쪽 거울상 시각이 유일하지 않습니다.");
const currentMinutes = 5 * 60 + 25;
const previousMinutes = currentMinutes - (3 * 60 + 20);
assert.strictEqual(`${String(Math.floor(previousMinutes / 60)).padStart(2, "0")}:${String(previousMinutes % 60).padStart(2, "0")}`, "02:05", "활용 4회 6번의 3시간 20분 전 시각이 다릅니다.");

const utilizationSix = data.exams.find((exam) => exam.key === "premier-utilization-6");
for (const number of [3, 16]) {
  assert.strictEqual(utilizationSix.questions.find((question) => question.number === number).scoringEligible, true, `활용 6회 ${number}번은 독립 검산과 가시성 검수를 통과해야 합니다.`);
}
for (const number of [2, 8, 9, 11, 17, 18, 20]) {
  assert.strictEqual(utilizationSix.questions.find((question) => question.number === number).scoringEligible, false, `활용 6회 ${number}번은 원본 조건 또는 가시성 문제로 채점에서 제외해야 합니다.`);
}
assert.strictEqual([1, 3, 2, 4].reduce((sum, length) => sum + length, 0), 10, "활용 6회 3번의 색테이프 길이가 다릅니다.");
const utilizationSixMirrorBlanks = [54 - 41, 25 + 55];
assert.deepStrictEqual(utilizationSixMirrorBlanks, [13, 80], "활용 6회 16번의 두 거울 숫자 빈칸이 다릅니다.");
assert.strictEqual(utilizationSixMirrorBlanks.reduce((sum, value) => sum + value, 0), 93, "활용 6회 16번의 빈칸 합이 다릅니다.");

const utilizationEight = data.exams.find((exam) => exam.key === "premier-utilization-8");
assert.strictEqual(utilizationEight.questions.find((question) => question.number === 7).scoringEligible, true, "활용 8회 7번은 세 접기 방향과 구멍 위치가 식별되는 단일답 문항이어야 합니다.");
assert.strictEqual(utilizationEight.questions.find((question) => question.number === 16).scoringEligible, false, "활용 8회 16번은 옅은 상층 큐브 경계 때문에 채점에서 제외해야 합니다.");
let unfoldedHoleCount = 1;
for (let fold = 0; fold < 3; fold += 1) unfoldedHoleCount *= 2;
assert.strictEqual(unfoldedHoleCount, 8, "활용 8회 7번의 세 번 접은 색종이 구멍 수가 다릅니다.");

const finalTwo = data.exams.find((exam) => exam.key === "premier-final-2");
assert.strictEqual(finalTwo.questions.find((question) => question.number === 7).scoringEligible, true, "파이널 2회 7번은 원본의 날짜 합 56을 기준으로 검산된 단일답 문항이어야 합니다.");
const weekDateSum = Array.from({ length: 7 }, (_, index) => 5 + index).reduce((sum, date) => sum + date, 0);
assert.strictEqual(weekDateSum, 56, "파이널 2회 7번의 일요일 5일부터 토요일 11일까지 합이 다릅니다.");
assert.strictEqual((31 - 5) % 7, 5, "파이널 2회 7번의 7월 31일이 금요일인지 확인하는 요일 이동값이 다릅니다.");

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
const premierDiagnosisHandler = viewerHtml.match(/function openPremierDiagnosis\(\)\{[\s\S]*?\n\}/)?.[0] || "";
assert.match(premierDiagnosisHandler, /location\.href=url;/, "프리미어 진단 버튼은 모바일 팝업 차단 없이 같은 화면에서 이동해야 합니다.");
assert.doesNotMatch(premierDiagnosisHandler, /window\.open\(/, "프리미어 진단 버튼에 팝업 방식을 다시 사용하면 안 됩니다.");

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
