"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const sourceItemId = "6-2-u2-e2-example-2";
const raw = require("./source-inventory/6-2-source-items.json").items.find(item => item.sourceItemId === sourceItemId);
const readiness = require("./source-inventory/6-2-u2-e2-example2-readiness-review.json");
const type = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2")
  .units.find(item => item.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(raw && type && !type.reviewLocked && type.rawSourceItemId === sourceItemId, "원문·공개 유형 연결");
assert.equal(raw.publicSourceItemId, sourceItemId);
assert.equal(raw.pdfPage, 18);
assert.equal(raw.printedPage, 20);
assert.equal(raw.answerContract, "single-minutes-after-hour");
assert.equal(readiness.sourceItemId, sourceItemId);
assert.equal(readiness.sourceIdentity.pdfPage, raw.pdfPage);
assert.equal(readiness.releaseStatus, "verified");
assert.equal(readiness.verifiedVariantCount, 3);
assert.equal(readiness.verification.mathChecks, 360);

function firstMatchingMinute(prompt) {
  const hourMatch = prompt.match(/시계가 (\d+)시 (정각|\d+분)을 가리키고 있습니다/);
  const angleMatch = prompt.match(/작은 각이 처음으로 (\d+)°가 되나요/);
  assert(hourMatch && angleMatch, "시작 시각 또는 목표 각이 빠짐");
  const hour = Number(hourMatch[1]);
  const startMinute = hourMatch[2] === "정각" ? 0 : Number(hourMatch[2].replace("분", ""));
  const smallAngle = Number(angleMatch[1]);
  assert(hour >= 7 && hour <= 9 && smallAngle > 0 && smallAngle < 180, "시각·각도 범위 오류");
  if (startMinute) assert(60 * hour - 11 * startMinute > 360, "어려움 시작이 180° 전환점 이후라 쉬워짐");
  const directedTwice = [2 * smallAngle, -2 * smallAngle, 720 - 2 * smallAngle, -(720 - 2 * smallAngle)];
  const candidates = directedTwice.map(target => (60 * hour - target) / 11)
    .filter(minutes => minutes > startMinute && minutes < 60).sort((a, b) => a - b);
  assert(candidates.length >= 2, "'처음' 조건에 필요한 다음 시각 후보가 없음");
  const first = candidates[0];
  assert(Number.isInteger(first), "첫 시각이 분 단위가 아님");
  const hourHand = hour * 30 + first / 2;
  const minuteHand = first * 6;
  const directed = Math.abs(hourHand - minuteHand) % 360;
  assert.equal(Math.min(directed, 360 - directed), smallAngle, "시계 바늘 위치와 각 불일치");
  return { hour, startMinute, smallAngle, first };
}

let checks = 0;
const pools = new Set();
const hardAnswers = new Set();
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
  const generated = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, seed % 3);
  assert(generated && generated.sourceItemId === sourceItemId && generated.generationMode === "fixed-verified-pool", "고정 문항 생성");
  const time = firstMatchingMinute(generated.prompt);
  assert.equal(generated.answer, `${time.first - time.startMinute}분 후`, "가능한 모든 시각에서 첫 답 계산");
  assert(generated.solution.includes(generated.answer) && generated.answerVisual.includes(generated.answer), "풀이와 답 표시 연결");
  assert(generated.prompt.includes("180°까지 커졌다가 다시 작아집니다") === (difficulty === -1), "쉬움의 각 움직임 단서");
  assert.equal(time.startMinute > 0, difficulty === 1, "어려움의 정각이 아닌 시작 시각");
  if (difficulty === 1) hardAnswers.add(generated.answer);
  assert(!generated.prompt.includes("<svg"), "원문에 없는 시계 그림 추가 금지");
  assert(!/NaN|Infinity|undefined/.test(JSON.stringify(generated)), "표시값 오류");
  if (difficulty === 0 && generated.verifiedPoolIndex === 0) {
    assert.equal(time.hour, 8, "원본 시작 시각");
    assert.equal(time.smallAngle, 86, "원본 목표 각");
    assert.equal(time.first, 28, "원본 첫 시각의 독립 계산");
  }
  pools.add(generated.verifiedPoolIndex);
  checks += 1;
}
assert.equal(pools.size, 3, "고정 검증 문항 3개");
assert.equal(hardAnswers.size, 3, "어려움 세 문항이 같은 계산·답으로 겹치지 않아야 함");
console.log(`6-2 소수의 나눗셈 예제 2-2: ${checks}건 첫 시각 후보 전수·시계 바늘 각 독립 검산 통과`);
