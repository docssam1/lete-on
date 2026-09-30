"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const id = "6-2-u2-e2-mission-2";
const raw = require("./source-inventory/6-2-source-items.json").items.find(item => item.sourceItemId === id);
const readiness = require("./source-inventory/6-2-u2-e2-mission2-readiness-review.json");
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert(raw && type && !type.reviewLocked && type.rawSourceItemId === id, "원본·출제 유형 연결");
assert.equal(raw.publicSourceItemId, id);
assert.equal(raw.pdfPage, 19);
assert.equal(raw.printedPage, 21);
assert.equal(raw.answerContract, "single-overlapped-tape-count");
assert.equal(readiness.sourceItemId, id);
assert.equal(readiness.sourceIdentity.pdfPage, raw.pdfPage);
assert.equal(readiness.sourceIdentity.printedPage, raw.printedPage);
assert.equal(readiness.officialAnswerEvidence.status, "not-available-for-this-item");
assert.equal(readiness.verifiedVariantCount, 3);
assert.equal(readiness.releaseStatus, "verified");

function tenths(value) {
  const [whole, fractional = ""] = value.split(".");
  assert(fractional.length <= 1, `소수 첫째 자리까지의 길이만 허용: ${value}`);
  return Number(whole) * 10 + Number(fractional || 0);
}

function countFromDisplayedProblem(prompt) {
  const statement = prompt.split("<svg")[0];
  const oneTape = statement.match(/길이가 (\d+(?:\.\d+)?)cm인 색 테이프/);
  const uniform = statement.match(/이웃한 두 장이 (\d+(?:\.\d+)?)cm씩 겹치게/);
  const alternating = statement.match(/첫 이음새는 (\d+(?:\.\d+)?)cm, 다음 이음새는 (\d+(?:\.\d+)?)cm씩 겹치게/);
  const total = statement.match(/전체 길이가 (\d+(?:\.\d+)?)(cm|mm)/);
  assert(oneTape && (uniform || alternating) && total, "테이프 한 장·겹침·전체 길이 표시");
  assert.equal(Number(Boolean(uniform)) + Number(Boolean(alternating)), 1, "겹침 규칙 하나");
  const length10 = tenths(oneTape[1]);
  const overlap10 = tenths((uniform || alternating)[1]);
  const secondOverlap10 = alternating ? tenths(alternating[2]) : overlap10;
  const total10 = total[2] === "mm" ? Number(total[1]) : tenths(total[1]);
  assert(length10 > overlap10 && length10 > secondOverlap10 && overlap10 > 0 && secondOverlap10 > 0, "겹친 길이가 한 장보다 짧아야 함");
  let count = 1;
  let accumulated = length10;
  while (accumulated < total10 && count < 200) {
    accumulated += length10 - (count % 2 ? overlap10 : secondOverlap10);
    count += 1;
  }
  assert.equal(accumulated, total10, "표시된 전체 길이가 정확한 장수로 도달해야 함");
  assert(count > 1, "이은 테이프가 두 장 이상이어야 함");
  return { count, answer: `${count}장`, length10, overlap10, secondOverlap10, total10, unit: total[2], alternating: Boolean(alternating) };
}

let checks = 0;
const pools = new Set();
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
  const generated = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, seed % 3);
  assert.equal(generated.sourceItemId, id);
  assert.equal(generated.generationMode, "fixed-verified-pool");
  assert.equal(generated.verifiedVariantCount, 3);
  const counted = countFromDisplayedProblem(generated.prompt);
  assert.equal(generated.answer, counted.answer, "보이는 조건에서 한 장씩 더해 독립 계산한 답");
  assert.equal(counted.unit, difficulty === 1 ? "mm" : "cm", "난이도별 전체 길이 단위");
  assert.equal(counted.alternating, difficulty === 1, "어려움에서만 두 겹침 길이를 번갈아 사용");
  assert.equal(generated.prompt.includes("늘어나는 길이를 생각해 보세요"), difficulty === -1, "쉬움의 추가 단서");
  assert(generated.solution.includes(generated.answer) && generated.answerVisual.includes('class="geometry-diagram source62-tape-count"'), "문제·풀이·답 그림 연결");
  const svg = generated.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0];
  assert(svg && svg.includes(`data-tape-model="${counted.length10},${counted.overlap10},${counted.secondOverlap10},sample"`), "문제 그림이 표시 조건에서 파생됨");
  assert(svg.includes('data-sample-is-not-total="true"') && !svg.includes("data-actual-count"), "예시 띠가 실제 장수를 노출하지 않음");
  const visibleDiagramText = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(match => match[1]).join(" ");
  assert(!visibleDiagramText.includes(generated.answer), "문제 그림의 글자가 정답을 누설하지 않음");
  assert.equal((svg.match(/class="source62-tape-overlap"/g) || []).length, 2, "겹침 표시 두 곳");
  assert(!/NaN|Infinity|undefined/.test(JSON.stringify(generated)), "표시값 오류");
  if (difficulty === 0 && generated.verifiedPoolIndex === 0) {
    assert.equal(counted.length10, 260);
    assert.equal(counted.overlap10, 25);
    assert.equal(counted.total10, 4490);
    assert.equal(counted.answer, "19장");
  }
  if (difficulty === 1) {
    const expected = [{ length10: 260, first10: 25, second10: 35, total10: 4400, answer: "19장" }, { length10: 225, first10: 15, second10: 25, total10: 3505, answer: "17장" }, { length10: 320, first10: 32, second10: 28, total10: 4380, answer: "15장" }][generated.verifiedPoolIndex];
    assert.deepEqual([counted.length10, counted.overlap10, counted.secondOverlap10, counted.total10, counted.answer], [expected.length10, expected.first10, expected.second10, expected.total10, expected.answer], "어려움 고정 문항의 조건·답");
  }
  pools.add(generated.verifiedPoolIndex);
  checks += 1;
}
assert.equal(pools.size, 3, "검증된 고정 문항 3개");
console.log(`6-2 겹친 테이프 장수: ${checks}회 표시 문항 증분 열거·정답 누설 검사 통과`);
