"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const sourceItemId = "6-2-u2-e2-example-1";
const raw = require("./source-inventory/6-2-source-items.json").items.find(item => item.sourceItemId === sourceItemId);
const readiness = require("./source-inventory/6-2-u2-e2-example1-readiness-review.json");
const type = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2")
  .units.find(item => item.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(raw && type && !type.reviewLocked && type.rawSourceItemId === sourceItemId, "원문과 공개 유형 연결");
assert.equal(raw.publicSourceItemId, sourceItemId);
assert.equal(raw.pdfPage, 18);
assert.equal(raw.printedPage, 20);
assert.equal(readiness.sourceIdentity.pdfPage, raw.pdfPage);
assert.equal(readiness.releaseStatus, "verified");
assert.equal(readiness.verifiedVariantCount, 3);

function scaledDecimal(value, scale) {
  const [whole, fraction = ""] = value.split(".");
  const digits = String(scale).length - 1;
  assert(fraction.length <= digits, "표시 소수 자릿수가 단위를 넘음");
  return BigInt(whole) * BigInt(scale) + BigInt((fraction + "0".repeat(digits)).slice(0, digits) || "0");
}

function independentAnswer(prompt) {
  const gears = prompt.match(/바퀴가 한 번 돌 때 ([\d.]+)cm씩 가고 페달을 한 번 돌릴 때마다 바퀴가 ([\d.]+)바퀴씩 돕니다\./);
  const direct = prompt.match(/이 자전거로 ([\d.]+)(cm|m)를 가려면/);
  const roundTrip = prompt.match(/출발점에서 ([\d.]+)m 떨어진 곳까지 갔다가 같은 길로 돌아오려면/);
  assert(gears && (direct || roundTrip) && !(direct && roundTrip), "원문 바퀴·페달·거리 조건 누락");
  const wheelTenths = scaledDecimal(gears[1], 10);
  const turnsTenths = scaledDecimal(gears[2], 10);
  const distanceHundredthsCm = direct
    ? scaledDecimal(direct[1], direct[2] === "cm" ? 100 : 10000)
    : 2n * scaledDecimal(roundTrip[1], 10000);
  const matches = Array.from({ length: 200 }, (_, index) => BigInt(index + 1))
    .filter(count => count * wheelTenths * turnsTenths === distanceHundredthsCm);
  assert.equal(matches.length, 1, "페달 횟수의 답이 하나여야 함");
  return `${matches[0]}번`;
}

let checks = 0;
const pools = new Set();
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
  const generated = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, seed % 3);
  assert(generated && generated.sourceItemId === sourceItemId && generated.generationMode === "fixed-verified-pool", "생성기 연결");
  assert.equal(generated.answer, independentAnswer(generated.prompt), "원문 조건에서 독립 전수 검산");
  assert(generated.solution.includes(generated.answer) && generated.answerVisual.includes(generated.answer), "풀이·답 표시 연결");
  if (difficulty === 1) assert(generated.prompt.includes("갔다가 같은 길로 돌아오려면"), "어려움의 왕복 거리 추론 단계");
  else assert(generated.prompt.includes(difficulty === -1 ? "cm를 가려면" : "m를 가려면"), "쉬움·원본의 직접 거리 조건");
  assert(!generated.prompt.includes("<svg"), "원문에 없는 그림 추가 금지");
  assert(!/NaN|Infinity|undefined/.test(JSON.stringify(generated)), "표시값 오류");
  if (difficulty === 0 && generated.verifiedPoolIndex === 0) {
    assert(generated.prompt.includes("63.2cm") && generated.prompt.includes("4.5바퀴") && generated.prompt.includes("213.3m"), "원본 수치 구조");
    assert.equal(generated.answer, "75번", "원본 계산 결과");
  }
  pools.add(generated.verifiedPoolIndex);
  checks += 1;
}
assert.equal(pools.size, 3, "고정 검증 문항 3개");
console.log(`6-2 소수의 나눗셈 예제 2-1: ${checks}건 거리·회전 횟수 독립 전수 검산 통과`);
