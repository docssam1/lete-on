"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const id = "6-2-u2-e2-mission-1";
const raw = require("./source-inventory/6-2-source-items.json").items.find(item => item.sourceItemId === id);
const readiness = require("./source-inventory/6-2-u2-e2-mission1-readiness-review.json");
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert(raw && type && !type.reviewLocked && type.rawSourceItemId === id, "원문·출제 유형 연결");
assert.equal(raw.publicSourceItemId, id);
assert.equal(raw.pdfPage, 19);
assert.equal(raw.printedPage, 21);
assert.equal(readiness.sourceItemId, id);
assert.equal(readiness.sourceIdentity.pdfPage, raw.pdfPage);
assert.equal(readiness.releaseStatus, "verified");
assert.equal(readiness.verifiedVariantCount, 3);

function tenths(value) {
  const [whole, tenth = ""] = value.split(".");
  assert(tenth.length <= 1, `원문 단위를 넘어서는 소수: ${value}`);
  return Number(whole) * 10 + Number(tenth || 0);
}

function countFromPrompt(prompt) {
  const length = prompt.match(/길이가 (\d+(?:\.\d+)?)m인 직선 승강장/);
  const spacings = prompt.match(/한쪽은 (\d+(?:\.\d+)?)m 간격, 다른 쪽은 (\d+(?:\.\d+)?)m 간격/);
  const doubleGap = prompt.match(/출입구 자리에 소화기 한 개를 놓지 않아, 그곳의 두 소화기 사이만 (\d+(?:\.\d+)?)m이고/);
  assert(length && spacings && prompt.includes("각 가장자리의 처음과 끝에도 놓았습니다"), "승강장 길이·양쪽 간격·양 끝 조건");
  const total = tenths(length[1]);
  const first = tenths(spacings[1]);
  const second = tenths(spacings[2]);
  assert(total > 0 && first > 0 && second > 0, "길이와 간격은 양수");
  assert.equal(total % first, 0, "첫쪽 끝에 소화기가 와야 함");
  assert.equal(total % second, 0, "둘째쪽 끝에 소화기가 와야 함");
  const secondPositions = [];
  for (let position = 0; position <= total; position += second) secondPositions.push(position);
  assert.equal(secondPositions.at(-1), total, "둘째쪽 마지막 소화기 위치");
  const firstCounts = new Set();
  if (doubleGap) {
    const long = tenths(doubleGap[1]);
    assert.equal(long, 2 * first, "두 배 간격의 표시가 실제 첫쪽 간격과 다름");
    assert(prompt.includes(`${spacings[1]}m 간격으로 놓은 쪽은`), "두 배 간격의 쪽이 분명해야 함");
    const regularGapCount = total / first - 2;
    assert(regularGapCount >= 1, "출입구 외 보통 간격이 있어야 함");
    for (let longGapIndex = 0; longGapIndex <= regularGapCount; longGapIndex += 1) {
      const gaps = Array(regularGapCount).fill(first);
      gaps.splice(longGapIndex, 0, long);
      let position = 0;
      const positions = [position];
      for (const gap of gaps) positions.push(position += gap);
      assert.equal(position, total, "출입구 위치를 바꿔도 끝에 도착해야 함");
      firstCounts.add(positions.length);
    }
  } else {
    const firstPositions = [];
    for (let position = 0; position <= total; position += first) firstPositions.push(position);
    assert.equal(firstPositions.at(-1), total, "첫쪽 마지막 소화기 위치");
    firstCounts.add(firstPositions.length);
  }
  assert.equal(firstCounts.size, 1, "출입구 위치가 달라져도 정답 개수는 하나여야 함");
  return { answer: `${[...firstCounts][0] + secondPositions.length}개`, firstCount: [...firstCounts][0], secondCount: secondPositions.length, doubleGap: Boolean(doubleGap), length: length[1], first: spacings[1], second: spacings[2] };
}

let checks = 0;
const pools = new Set();
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
  const generated = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, seed % 3);
  assert.equal(generated.sourceItemId, id);
  assert.equal(generated.generationMode, "fixed-verified-pool");
  const counted = countFromPrompt(generated.prompt);
  assert.equal(generated.answer, counted.answer, "표시된 간격을 실제 위치로 열거해 개수 재계산");
  assert(generated.solution.includes(generated.answer) && generated.answerVisual.includes(generated.answer), "풀이와 답 표시 연결");
  assert.equal(counted.doubleGap, difficulty === 1, "어려움에서만 출입구 간격 변경");
  assert.equal(generated.prompt.includes("간격 수보다 소화기 수가 한 개 많다는 점"), difficulty === -1, "쉬움에서만 단서 제공");
  assert(!/<svg|<img/.test(generated.prompt), "원문에 없는 그림 추가 금지");
  assert(!/NaN|Infinity|undefined/.test(JSON.stringify(generated)), "표시값 오류");
  if (difficulty === 0 && generated.verifiedPoolIndex === 0) {
    assert.equal(counted.length, "138.6");
    assert.equal(counted.first, "12.6");
    assert.equal(counted.second, "9.9");
    assert.equal(counted.firstCount, 12);
    assert.equal(counted.secondCount, 15);
    assert.equal(counted.answer, "27개");
  }
  pools.add(generated.verifiedPoolIndex);
  checks += 1;
}
assert.equal(pools.size, 3, "고정 검증 문항 풀 3개");
console.log(`6-2 소화기 간격 유형: ${checks}회 양쪽 배치 전수 열거·답 검산 통과`);
