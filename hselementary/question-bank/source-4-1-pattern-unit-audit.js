"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-1");
const unit = semester.units.find(item => item.id === "4-1-u6");
const types = unit.subunits.flatMap(subunit => subunit.types);
const failures = [];
let generatedCount = 0;

const check = (condition, message) => { if (!condition) failures.push(message); };
const groups = [
  ["e1", "source41LinePatternOne"],
  ["e2", "source41ArrayPatternTwo"],
  ["e3", "source41ArraySumThree"],
  ["e4", "source41OperationRuleFour"],
  ["e6", "source41NumberCardSix"]
];
const locked = new Set([
  "4-1-u6-e5-exploration",
  "4-1-u6-e5-example-5-1",
  "4-1-u6-e5-mission-1",
  "4-1-u6-e5-mission-2",
  "4-1-u6-e5-mission-3",
  "4-1-u6-e5-mission-4",
  "4-1-u6-e5-mission-5",
  "4-1-u6-e5-mission-6"
]);

check(types.length === 66, `규칙 찾기는 원문 66유형이어야 하나 ${types.length}유형입니다.`);
for (const [exploration, generatorKey] of groups) {
  const sourceTypes = types.filter(type => type.sourceItemId?.startsWith(`4-1-u6-${exploration}`));
  check(sourceTypes.length === 11, `${exploration}은 원문 11유형이어야 하나 ${sourceTypes.length}유형입니다.`);
  sourceTypes.forEach((type, variant) => {
    check(type.generatorKey === generatorKey, `${type.sourceItemId}: 전용 생성기 연결이 다릅니다.`);
    check(type.variant === variant, `${type.sourceItemId}: 원문 문제 순서와 분기가 다릅니다.`);
    check(!type.reviewLocked, `${type.sourceItemId}: 검증한 유형이 잠겨 있습니다.`);
  });
}

for (const type of types.filter(type => type.sourceItemId?.startsWith("4-1-u6-e5"))) {
  check(Boolean(type.reviewLocked) === locked.has(type.sourceItemId), `${type.sourceItemId}: 공개·잠금 상태가 감사 기록과 다릅니다.`);
}

const pentagonalType = types.find(type => type.sourceItemId === "4-1-u6-e5-example-5-2");
check(pentagonalType?.generatorKey === "source41PentagonalPebbles", "예제 5-2가 오각형 바둑돌 전용 생성기에 연결되지 않았습니다.");
check(!pentagonalType?.reviewLocked, "원본과 독립 검산을 마친 예제 5-2가 잠겨 있습니다.");
const countPentagonalPebbles = stage => (stage + 1) * (stage * 3 + 2) / 2;
check([1, 2, 3, 7].map(countPentagonalPebbles).join(",") === "5,12,22,92", "예제 5-2 원문 수열 5, 12, 22와 7번째 답 92가 맞지 않습니다.");
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(pentagonalType, 0, difficulty, seed);
    generatedCount += 1;
    const match = generated.prompt.match(/data-source41-kind="pentagonal-pebble-growth" data-source41-payload="([^"]+)" data-source41-expected="([^"]+)"/);
    check(Boolean(match), `예제 5-2 / 난이도 ${difficulty} / 시드 ${seed}: 독립 검산 자료가 없습니다.`);
    if (!match) continue;
    const payload = JSON.parse(decodeURIComponent(match[1]));
    const expected = Number(decodeURIComponent(match[2]));
    check(payload.shownCounts.join(",") === "5,12,22", `예제 5-2 / 시드 ${seed}: 그림의 세 점 수가 원문과 다릅니다.`);
    check(Number(generated.answer) === countPentagonalPebbles(payload.target) && expected === Number(generated.answer), `예제 5-2 / 시드 ${seed}: 독립 계산 답이 다릅니다.`);
    check((generated.prompt.match(/class="pattern-stage"/g) || []).length === 3, `예제 5-2 / 시드 ${seed}: 원문처럼 첫 세 모양만 보여 주지 않습니다.`);
    check(!generated.prompt.includes(`data-stage="${payload.target}"`), `예제 5-2 / 시드 ${seed}: 물은 단계의 완성 그림이 문제에 노출됩니다.`);
    check(/data-stage="1"[^>]*data-expected-points="5"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 첫 번째 그림의 점이 5개가 아닙니다.`);
    check(/data-stage="2"[^>]*data-expected-points="12"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 두 번째 그림의 점이 12개가 아닙니다.`);
    check(/data-stage="3"[^>]*data-expected-points="22"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 세 번째 그림의 점이 22개가 아닙니다.`);
    check(/data-stage="1"[^>]*data-expected-lines="5"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 첫 번째 오각형의 선분 연결이 다릅니다.`);
    check(/data-stage="2"[^>]*data-expected-lines="13"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 두 번째 오각형의 공유 선분 연결이 다릅니다.`);
    check(/data-stage="3"[^>]*data-expected-lines="24"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 세 번째 오각형의 공유 선분 연결이 다릅니다.`);
    check(/data-stage="1"[^>]*data-outline-point-counts="5"[^>]*data-shared-anchor-count="1"[^>]*data-shared-anchor-rings="1"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 첫 번째 오각형의 공유 꼭짓점 구조가 다릅니다.`);
    check(/data-stage="2"[^>]*data-outline-point-counts="5,10"[^>]*data-shared-anchor-count="1"[^>]*data-shared-anchor-rings="2"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 두 번째 모양이 왼쪽 한 점을 공유하지 않습니다.`);
    check(/data-stage="3"[^>]*data-outline-point-counts="5,10,15"[^>]*data-shared-anchor-count="1"[^>]*data-shared-anchor-rings="3"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 세 번째 모양이 왼쪽 한 점을 공유하지 않습니다.`);
    check((generated.prompt.match(/data-shared-anchor="true"/g) || []).length === 3, `예제 5-2 / 시드 ${seed}: 각 단계의 공유 꼭짓점이 한 개씩 표시되지 않습니다.`);
    check(/data-stage="2"[^>]*data-point-kind="stone"[^>]*data-shared-anchor="true"[^>]*data-shared-rings="2"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 두 번째 모양의 공유점이 두 오각형에 함께 쓰이지 않습니다.`);
    check(/data-stage="3"[^>]*data-point-kind="stone"[^>]*data-shared-anchor="true"[^>]*data-shared-rings="3"/.test(generated.prompt), `예제 5-2 / 시드 ${seed}: 세 번째 모양의 공유점이 세 오각형에 함께 쓰이지 않습니다.`);
    check(Boolean(generated.answerVisual?.includes('data-solved="true"')), `예제 5-2 / 시드 ${seed}: 답지 그림이 없습니다.`);
    check(!/따라서|문제를 풀려면|규칙을 설명/.test(generated.prompt.replace(/<[^>]+>/g, " ")), `예제 5-2 / 시드 ${seed}: 문제에 풀이 설명이 섞였습니다.`);
  } catch (error) {
    failures.push(`예제 5-2 / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    break;
  }
}

const hexagonalType = types.find(type => type.sourceItemId === "4-1-u6-e5-example-5-3");
check(hexagonalType?.generatorKey === "source41HexagonalPebbles", "예제 5-3이 육각형 바둑돌 전용 생성기에 연결되지 않았습니다.");
check(!hexagonalType?.reviewLocked, "원본과 독립 검산을 마친 예제 5-3이 잠겨 있습니다.");
const countHexagonalPebbles = stage => 3 * stage * (stage - 1) + 1;
check([1, 2, 3, 4, 6].map(countHexagonalPebbles).join(",") === "1,7,19,37,91", "예제 5-3 원문 수열과 6번째 답 91이 맞지 않습니다.");
const hexagonalTargets = new Set();
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(hexagonalType, 0, difficulty, seed);
    generatedCount += 1;
    const match = generated.prompt.match(/data-source41-kind="hexagonal-pebble-growth" data-source41-payload="([^"]+)" data-source41-expected="([^"]+)"/);
    check(Boolean(match), `예제 5-3 / 난이도 ${difficulty} / 시드 ${seed}: 독립 검산 자료가 없습니다.`);
    if (!match) continue;
    const payload = JSON.parse(decodeURIComponent(match[1]));
    hexagonalTargets.add(`${difficulty}:${payload.target}`);
    const expected = Number(decodeURIComponent(match[2]));
    check(payload.shownCounts.join(",") === "1,7,19,37", `예제 5-3 / 시드 ${seed}: 그림의 네 점 수가 원문과 다릅니다.`);
    check(Number(generated.answer) === countHexagonalPebbles(payload.target) && expected === Number(generated.answer), `예제 5-3 / 시드 ${seed}: 독립 계산 답이 다릅니다.`);
    check((generated.prompt.match(/class="pattern-stage"/g) || []).length === 4, `예제 5-3 / 시드 ${seed}: 원문처럼 첫 네 모양만 보여 주지 않습니다.`);
    check(!generated.prompt.includes(`data-stage="${payload.target}"`), `예제 5-3 / 시드 ${seed}: 물은 단계의 완성 그림이 문제에 노출됩니다.`);
    [[1, 1], [2, 7], [3, 19], [4, 37]].forEach(([stage, count]) => check(
      new RegExp(`data-stage="${stage}"[^>]*data-expected-points="${count}"`).test(generated.prompt),
      `예제 5-3 / 시드 ${seed}: ${stage}번째 그림의 점이 ${count}개가 아닙니다.`
    ));
    check(Boolean(generated.answerVisual?.includes('data-solved="true"')), `예제 5-3 / 시드 ${seed}: 답지 그림이 없습니다.`);
    check(!/따라서|문제를 풀려면|규칙을 설명/.test(generated.prompt.replace(/<[^>]+>/g, " ")), `예제 5-3 / 시드 ${seed}: 문제에 풀이 설명이 섞였습니다.`);
  } catch (error) {
    failures.push(`예제 5-3 / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    break;
  }
}
for (const difficulty of [-1, 0, 1]) check(
  [...hexagonalTargets].filter(value => value.startsWith(`${difficulty}:`)).length >= 2,
  `예제 5-3 / 난이도 ${difficulty}: 같은 문제가 반복되지 않도록 목표 단계가 둘 이상이어야 합니다.`
);

const alternatingTileType = types.find(type => type.sourceItemId === "4-1-u6-e5-example-5-4");
check(alternatingTileType?.generatorKey === "source41AlternatingTiles", "예제 5-4가 번갈아 놓은 타일 전용 생성기에 연결되지 않았습니다.");
check(!alternatingTileType?.reviewLocked, "원본과 독립 검산을 마친 예제 5-4가 잠겨 있습니다.");
const countAlternatingTiles = stage => {
  const size = stage * 2;
  let black = 0;
  let white = 0;
  for (let row = 0; row < size; row += 1) for (let column = 0; column < size; column += 1) {
    const layerFromOutside = Math.min(row, column, size - 1 - row, size - 1 - column);
    const ring = stage - layerFromOutside;
    if (ring % 2) black += 1;
    else white += 1;
  }
  return { black, white, total: size * size };
};
check(JSON.stringify(countAlternatingTiles(16)) === JSON.stringify({ black: 480, white: 544, total: 1024 }), "예제 5-4 원문 16번째 타일 수가 검은색 480개, 흰색 544개가 아닙니다.");
const alternatingTargets = new Set();
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(alternatingTileType, 0, difficulty, seed);
    generatedCount += 1;
    const match = generated.prompt.match(/data-source41-kind="alternating-square-tile-rings" data-source41-payload="([^"]+)" data-source41-expected="([^"]+)"/);
    check(Boolean(match), `예제 5-4 / 난이도 ${difficulty} / 시드 ${seed}: 독립 검산 자료가 없습니다.`);
    if (!match) continue;
    const payload = JSON.parse(decodeURIComponent(match[1]));
    const expected = decodeURIComponent(match[2]);
    const counts = countAlternatingTiles(payload.target);
    alternatingTargets.add(`${difficulty}:${payload.target}`);
    check(payload.side === payload.target * 2 && payload.black === counts.black && payload.white === counts.white && payload.total === counts.total, `예제 5-4 / 시드 ${seed}: 칸 전수 계산과 생성값이 다릅니다.`);
    check(generated.answer === `검은색 ${counts.black}개, 흰색 ${counts.white}개` && expected === generated.answer, `예제 5-4 / 시드 ${seed}: 정답 표시가 독립 계산과 다릅니다.`);
    check((generated.prompt.match(/class="source41-alternating-stage"/g) || []).length === 4, `예제 5-4 / 시드 ${seed}: 원문처럼 첫 네 모양만 보여 주지 않습니다.`);
    check(!generated.prompt.includes(`data-stage="${payload.target}"`), `예제 5-4 / 시드 ${seed}: 물은 단계의 완성 그림이 문제에 노출됩니다.`);
    [[1, 4], [2, 16], [3, 36], [4, 64]].forEach(([stage, count]) => check(
      new RegExp(`data-stage="${stage}"[^>]*data-side="${stage * 2}"[^>]*data-cell-count="${count}"`).test(generated.prompt),
      `예제 5-4 / 시드 ${seed}: ${stage}번째 타일 격자 크기가 다릅니다.`
    ));
    check(Boolean(generated.answerVisual?.includes('data-solved="true"')), `예제 5-4 / 시드 ${seed}: 답지 그림이 없습니다.`);
    check(!/따라서|문제를 풀려면|규칙을 설명/.test(generated.prompt.replace(/<[^>]+>/g, " ")), `예제 5-4 / 시드 ${seed}: 문제에 풀이 설명이 섞였습니다.`);
  } catch (error) {
    failures.push(`예제 5-4 / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    break;
  }
}
for (const difficulty of [-1, 0, 1]) check(
  [...alternatingTargets].filter(value => value.startsWith(`${difficulty}:`)).length >= 2,
  `예제 5-4 / 난이도 ${difficulty}: 같은 문제가 반복되지 않도록 목표 단계가 둘 이상이어야 합니다.`
);

for (const type of types.filter(type => !type.reviewLocked && groups.some(([exploration]) => type.sourceItemId?.startsWith(`4-1-u6-${exploration}`)))) {
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 200; seed += 1) {
    try {
      const generated = api.generate(type, 0, difficulty, seed);
      generatedCount += 1;
      check(Boolean(generated?.prompt && generated?.solution && generated.answer !== undefined), `${type.sourceItemId}: 문제·정답·풀이가 비었습니다.`);
      check(!/undefined|null|NaN|Infinity/.test(`${generated?.prompt}${generated?.answer}${generated?.solution}`), `${type.sourceItemId}: 잘못된 값이 노출됩니다.`);
    } catch (error) {
      failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      break;
    }
  }
}

// 정사각 테두리 배열은 CSS 격자 계약과 같은 div/span 구조여야 모든 셀 선이 보인다.
for (const type of types.filter(type => type.generatorKey === "source41ArrayPatternTwo" && [0, 7].includes(type.variant))) {
  const generated = api.generate(type, 0, 0, 41);
  check(generated.prompt.includes('<div class="number-grid"'), `${type.sourceItemId}: 수 배열이 격자 컨테이너로 렌더되지 않습니다.`);
  check(!generated.prompt.includes("<table"), `${type.sourceItemId}: CSS와 맞지 않는 표 태그가 남아 있습니다.`);
  check((generated.prompt.match(/<span>/g) || []).length >= 49, `${type.sourceItemId}: 수 배열 칸이 충분히 생성되지 않았습니다.`);
}

// 연산의 규칙 원문 고정값을 생성기와 별개의 산술식으로 다시 계산한다.
const digitSum = value => [...String(value)].reduce((sum, digit) => sum + Number(digit), 0);
check(30 * 10 / 3 === 100, "연산의 규칙 본문 기준값은 100이어야 합니다.");
check((3 - 1) * (3 - 1) === 4 && (8 - 1) * (4 - 1) === 21 && (4 + 1) * (21 + 1) === 110, "예제 4-2 기준값은 110이어야 합니다.");
check((9 + 10) * (11 + 12) === 437, "예제 4-3 기준값은 437이어야 합니다.");
check(digitSum(15) + digitSum(19) === 16, "예제 4-4 기준값은 16이어야 합니다.");
check((6 % 3) + 2 * 6 === 12, "Mission 1 기준값은 12이어야 합니다.");
check((5 ** 2 + 2) ** 2 + 2 === 731, "Mission 2 빈칸은 5이어야 합니다.");
check((3 ** 2 - 3) ** 2 - 8 === 28, "Mission 3 빈칸은 3이어야 합니다.");
check(11 * 4 - 1 === 43, "Mission 4 기준값은 43이어야 합니다.");
check(77 - 7 * 7 === 28, "Mission 5 기준값은 28이어야 합니다.");
check(6 * (2 + 10) === 72, "Mission 6 기준값은 72이어야 합니다.");

// 수 카드 원문은 모든 배열과 모든 숫자 사용 횟수를 전수 조사한다.
const permutations = (values, length = values.length) => {
  const output = new Set();
  const visit = (left, picked) => {
    if (picked.length === length) { output.add(picked.join("")); return; }
    left.forEach((value, index) => visit(left.filter((_, next) => next !== index), [...picked, value]));
  };
  visit(values, []);
  return [...output];
};
const naturalNumbers = (values, length = values.length) => permutations(values, length).filter(text => text[0] !== "0").map(Number);
const counts = (start, end) => {
  const output = Array(10).fill(0);
  for (let value = start; value <= end; value += 1) for (const digit of String(value)) output[Number(digit)] += 1;
  return output;
};
const decimals = permutations([0, 1, 3, 4]).map(Number).filter(value => Math.floor(value / 1000) < 3);
check(decimals.reduce((sum, value) => sum + value, 0) === 9330, "개념탐구 6 본문 소수의 합은 9.330이어야 합니다.");
check(new Set(naturalNumbers([0, 1, 1, 2, 3, 4], 3)).size === 59, "예제 6-1 기준값은 59개여야 합니다.");
const gapFor = value => {
  const values = permutations([3, 6, 8, value]).map(Number).sort((left, right) => left - right);
  return values[1] - values[0];
};
check(JSON.stringify([0, 1, 2, 4, 5, 7, 9].filter(value => gapFor(value) === 9)) === JSON.stringify([7, 9]), "예제 6-2 기준 답은 7, 9여야 합니다.");
check(Math.max(...counts(465, 776)) === 167, "예제 6-3 기준값은 167번이어야 합니다.");
check(counts(1, 9999)[7] === 4000, "예제 6-4 기준값은 4000번이어야 합니다.");
let fiveCards = 0;
for (let value = 5; value <= 555; value += 5) fiveCards += [...String(value)].filter(digit => digit === "5").length;
check(fiveCards === 80, "Mission 1 기준값은 80장이어야 합니다.");
check(naturalNumbers([0, 3, 4, 5, 8]).filter(value => value % 2 === 0).length === 60, "Mission 2 기준값은 60개여야 합니다.");
const hiddenCandidates = [0, 1, 2, 5, 8, 9].filter(value => {
  const values = naturalNumbers([3, 6, 4, value, 7]);
  return Math.max(...values) - Math.min(...values) === 41976;
});
check(JSON.stringify(hiddenCandidates) === JSON.stringify([5]), "Mission 3의 숨은 카드는 5 하나여야 합니다.");
const ranged = new Set();
for (let length = 1; length <= 4; length += 1) naturalNumbers([0, 1, 3, 4], length).forEach(value => { if (value > 40 && value < 400) ranged.add(value); });
check(ranged.size === 14, "Mission 4 기준값은 14개여야 합니다.");
const oneTo999 = counts(1, 999);
check(oneTo999[0] === 189 && Math.min(...oneTo999) === 189, "Mission 5 기준 답은 숫자 0, 189번이어야 합니다.");
check(Math.max(...counts(521, 879)) === 176, "Mission 6 기준값은 176번이어야 합니다.");

if (failures.length) {
  console.error(`4-1 규칙 찾기 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`4-1 규칙 찾기 감사 통과: 원문 66유형 · 공개 58 · 검수 대기 8 · 새 전용 생성 ${generatedCount.toLocaleString()}회 · 도형/연산/수 카드 원문 기준값 독립 검산`);
