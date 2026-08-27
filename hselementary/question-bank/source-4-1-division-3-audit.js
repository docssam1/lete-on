"use strict";

global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const nativeMappings = require("./source-inventory/4-1-native-generators.json").mappings;
const api = window.HSE_GENERATORS;
const runtimeInventory = window.HSE_SOURCE_INVENTORY_41;
const generatorKey = "source41DivisionThree";
const variants = Array.from({ length: 11 }, (_, index) => index);
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const failures = [];
let generatedCount = 0;

const sourceItems = [
  ["4-1-u3-e3-exploration", 0, "총이익으로 실제 판매 수량 찾기"],
  ["4-1-u3-e3-example-3-1", 1, "양쪽 나무 수로 도로 길이 구하기"],
  ["4-1-u3-e3-example-3-2", 2, "포장 판매와 낱개 판매 금액 합산"],
  ["4-1-u3-e3-example-3-3", 3, "서로 다른 기계의 생산량 나누기"],
  ["4-1-u3-e3-example-3-4", 4, "판매 금액의 변화로 가격을 올린 날 찾기"],
  ["4-1-u3-e3-mission-1", 5, "부족한 나눗셈의 최소 보충량"],
  ["4-1-u3-e3-mission-2", 6, "독서 속도에 따른 완료일 차이"],
  ["4-1-u3-e3-mission-3", 7, "회전 속도로 횟수 차이 구하기"],
  ["4-1-u3-e3-mission-4", 8, "공전 주기의 몫과 남은 날"],
  ["4-1-u3-e3-mission-5", 9, "차이 조건으로 세 봉지 무게 나누기"],
  ["4-1-u3-e3-mission-6", 10, "열차 길이와 속력으로 통과 시간 구하기"]
];

const sourceAnchors = {
  0: { totalItems: 600, totalPurchaseCost: 528000, profitPerSoldItem: 220, actualProfit: 108900, answer: 21, rejectedPencilAnswer: 501 },
  1: { spacingMeters: 12, totalTreesBothSides: 216, answerMeters: 1284 },
  2: { itemsPerBasket: 38, baskets: 25, discarded: 13, itemsPerBox: 15, boxPrice: 11000, loosePrice: 1000, answer: 689000 },
  3: { cupsPerHour: 950, boxesPerDay: 912, hoursPerDay: 24, answer: 25 },
  4: { month: "6월", daysInMonth: 30, oldPrices: [350, 540], newPrices: [370, 580], totalPaid: 28020, answerDay: 9, handwrittenAnswer: null },
  5: { sheets: 881, students: 27, answer: 10 },
  6: { firstPages: 416, firstRate: 18, secondPages: 408, targetPages: 576, answerName: "인성이", answerDays: 2 },
  7: { firstTurns: 608, firstSeconds: 76, secondTurns: 637, secondSeconds: 49, targetSeconds: 138, answer: 690 },
  8: { firstWeeks: 98, firstExtraDays: 1, firstDays: 687, secondDays: 88, answerOrbits: 7, answerRemainderDays: 71 },
  9: { totalGrams: 6100, multiplier: 3, extraGrams: 50, answer: 450, rejectedPencilAnswer: 4250 },
  10: { firstLength: 108, firstSpeed: 43, firstTime: 23, tunnelLength: 881, secondLength: 111, secondSpeed: 32, answerSeconds: 31 }
};

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function evidence(generated) {
  const marker = generated.prompt.match(/<span hidden\b[^>]*data-source41-kind="([^"]+)"[^>]*data-source41-payload="([^"]+)"[^>]*data-source41-expected="([^"]+)"[^>]*><\/span>/);
  assert(marker, "원문 근거 자료를 읽을 수 없습니다.");
  return {
    kind: marker[1],
    payload: JSON.parse(decodeURIComponent(marker[2])),
    expected: decodeURIComponent(marker[3])
  };
}

function visibleText(html) {
  return String(html)
    .replace(/<span hidden[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function integerTokens(value) {
  return (String(value).replace(/,/g, "").match(/\d+/g) || []).map(Number);
}

function sameArray(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function discardedCandidates(payload) {
  const candidates = [];
  for (let discarded = 0; discarded <= payload.totalItems; discarded += 1) {
    const sold = payload.totalItems - discarded;
    if (sold * payload.salePrice - payload.totalPurchaseCost === payload.actualProfit) candidates.push(discarded);
  }
  return candidates;
}

function increaseDayCandidates(payload) {
  const candidates = [];
  for (let day = 1; day <= payload.daysInMonth; day += 1) {
    const total = (day - 1) * payload.oldDaily + (payload.daysInMonth - day + 1) * payload.newDaily;
    if (total === payload.totalPaid) candidates.push(day);
  }
  return candidates;
}

function supplementCandidates(payload) {
  const candidates = [];
  for (let addition = 0; addition < payload.students; addition += 1) {
    if ((payload.sheets + addition) % payload.students === 0) candidates.push(addition);
  }
  return candidates;
}

function sugarCandidates(payload) {
  const candidates = [];
  for (let first = 1; first < payload.totalGrams; first += 1) {
    const second = payload.multiplier * first + payload.extraGrams;
    const third = payload.multiplier * second + payload.extraGrams;
    if (first + second + third === payload.totalGrams) candidates.push(first);
  }
  return candidates;
}

function assertAnswer(variant, payload, generated) {
  const answerText = String(generated.answer).replace(/,/g, "");
  const tokens = integerTokens(generated.answer);
  if (variant === 0) assert(tokens.includes(payload.discarded), "버린 배의 수가 답에 없습니다.");
  if (variant === 1) assert(tokens.includes(payload.answerMeters), "도로 길이가 답에 없습니다.");
  if (variant === 2) assert(tokens.includes(payload.answer), "판매 금액이 답에 없습니다.");
  if (variant === 3) assert(tokens.includes(payload.cupsPerBox), "한 상자에 담는 종이컵 수가 답에 없습니다.");
  if (variant === 4) assert(answerText.includes(String(payload.month)) && tokens.includes(payload.increaseDay), "가격을 올린 월과 날짜가 답에 없습니다.");
  if (variant === 5) assert(tokens.includes(payload.supplement), "최소 보충량이 답에 없습니다.");
  if (variant === 6) assert(answerText.includes(payload.winner) && tokens.includes(payload.dayDifference), "더 빨리 읽은 학생과 날짜 차이가 답에 없습니다.");
  if (variant === 7) assert(tokens.includes(payload.answer), "회전 횟수 차가 답에 없습니다.");
  if (variant === 8) assert(tokens.includes(payload.orbits) && tokens.includes(payload.remainderDays), "공전 횟수와 남은 날이 답에 없습니다.");
  if (variant === 9) assert(tokens.includes(payload.firstGrams), "가 봉지의 무게가 답에 없습니다.");
  if (variant === 10) assert(tokens.includes(payload.secondTime), "두 번째 열차의 통과 시간이 답에 없습니다.");
}

function auditPayload(variant, payload, generated) {
  const visible = visibleText(`${generated.prompt} ${generated.solution}`);
  assert(!/undefined|null|NaN|Infinity/.test(`${visible} ${generated.answer}`), `분기 ${variant}: 잘못된 값이 보입니다.`);
  assert(!/방정식|순열|조합|제곱|모듈러|mod\b/.test(visible), `분기 ${variant}: 초등 과정 밖 표현이 보입니다.`);
  assert(Number(payload.complexity) > 0, `분기 ${variant}: 난이도 자료가 없습니다.`);
  assertAnswer(variant, payload, generated);

  if (variant === 0) {
    assert(payload.totalPurchaseCost === payload.totalItems * payload.unitCost, "전체 매입 금액이 다릅니다.");
    assert(payload.salePrice === payload.unitCost + payload.profitPerSoldItem, "한 개 판매 가격이 다릅니다.");
    assert(payload.sold === payload.totalItems - payload.discarded, "판매한 개수가 다릅니다.");
    assert(payload.actualProfit === payload.sold * payload.salePrice - payload.totalPurchaseCost, "실제 이익이 다릅니다.");
    assert(payload.actualProfit > 0, "실제 이익이 양수가 아닙니다.");
    const candidates = discardedCandidates(payload);
    assert(sameArray(candidates, payload.candidates) && candidates.length === 1 && candidates[0] === payload.discarded, "버린 개수의 답이 하나가 아닙니다.");
    assert(/판 돈에서.*산 값.*빼/.test(visible), "실제 이익의 뜻이 문장에 분명하지 않습니다.");
    assert(/상해 팔지 못/.test(visible), "상한 배를 판매하지 않았다는 조건이 없습니다.");
  }
  if (variant === 1) {
    assert(payload.totalTreesBothSides === payload.treesPerSide * 2, "양쪽 나무 수가 다릅니다.");
    assert(payload.intervalsPerSide === payload.treesPerSide - 1, "한쪽의 나무 사이 수가 다릅니다.");
    assert(payload.answerMeters === payload.intervalsPerSide * payload.spacingMeters, "도로 길이가 다릅니다.");
    assert(/양쪽을 합하여/.test(visible), "양쪽 나무의 합계라는 조건이 분명하지 않습니다.");
    assert(/도로의 처음과 끝에도/.test(visible), "도로 길이와 나무 사이 구간이 같다는 조건이 없습니다.");
  }
  if (variant === 2) {
    assert(payload.harvest === payload.itemsPerBasket * payload.baskets, "수확한 전체 개수가 다릅니다.");
    assert(payload.sellable === payload.harvest - payload.discarded, "판매할 수 있는 개수가 다릅니다.");
    assert(payload.sellable === payload.fullBoxes * payload.itemsPerBox + payload.looseItems, "상자와 낱개로 나눈 개수가 다릅니다.");
    assert(payload.looseItems > 0 && payload.looseItems < payload.itemsPerBox, "낱개 판매 조건이 성립하지 않습니다.");
    assert(payload.answer === payload.fullBoxes * payload.boxPrice + payload.looseItems * payload.loosePrice, "판매 금액이 다릅니다.");
  }
  if (variant === 3) {
    assert(payload.boxesPerDay % payload.hoursPerDay === 0, "하루 상자 수를 한 시간 상자 수로 정확히 나눌 수 없습니다.");
    assert(payload.boxesPerHour === payload.boxesPerDay / payload.hoursPerDay, "한 시간 상자 수가 다릅니다.");
    assert(payload.cupsPerHour === payload.boxesPerHour * payload.cupsPerBox, "한 상자의 종이컵 수가 다릅니다.");
  }
  if (variant === 4) {
    assert(payload.oldDaily === payload.oldPrices.reduce((sum, value) => sum + value, 0), "오르기 전 하루 금액이 다릅니다.");
    assert(payload.newDaily === payload.newPrices.reduce((sum, value) => sum + value, 0), "오른 뒤 하루 금액이 다릅니다.");
    assert(payload.newDaily > payload.oldDaily, "오른 뒤 금액이 더 크지 않습니다.");
    assert(payload.allNewTotal === payload.newDaily * payload.daysInMonth, "한 달 모두 오른 값으로 낸 금액이 다릅니다.");
    assert(payload.dailyDifference === payload.newDaily - payload.oldDaily, "하루 금액 차이가 다릅니다.");
    assert(payload.oldPriceDays === payload.increaseDay - 1 && payload.oldPriceDays === (payload.allNewTotal - payload.totalPaid) / payload.dailyDifference, "오르기 전 값으로 낸 날짜 수가 다릅니다.");
    const candidates = increaseDayCandidates(payload);
    assert(sameArray(candidates, payload.candidates) && candidates.length === 1 && candidates[0] === payload.increaseDay, "가격을 올린 날짜가 하나가 아닙니다.");
    assert(/아침부터|그날부터/.test(visible), "새 가격을 적용하기 시작한 시점이 분명하지 않습니다.");
  }
  if (variant === 5) {
    assert(payload.quotient === Math.floor(payload.sheets / payload.students), "처음 나눈 몫이 다릅니다.");
    assert(payload.remainder === payload.sheets % payload.students && payload.remainder > 0, "처음 나눈 나머지가 다릅니다.");
    const candidates = supplementCandidates(payload);
    assert(sameArray(candidates, payload.candidates) && candidates.length === 1 && candidates[0] === payload.supplement, "최소 보충량이 하나가 아닙니다.");
    assert(/남김없이/.test(visible), "색종이를 모두 나누는 조건이 없습니다.");
  }
  if (variant === 6) {
    assert(payload.firstCompletionDays === Math.ceil(payload.firstPages / payload.firstRate), "첫 번째 책의 완료일이 다릅니다.");
    assert(payload.secondPages % payload.firstCompletionDays === 0, "두 번째 학생의 하루 분량이 자연수가 아닙니다.");
    assert(payload.secondRate === payload.secondPages / payload.firstCompletionDays, "두 번째 학생의 하루 분량이 다릅니다.");
    assert(payload.firstTargetDays === Math.ceil(payload.targetPages / payload.firstRate), "첫 번째 학생의 새 책 완료일이 다릅니다.");
    assert(payload.secondTargetDays === Math.ceil(payload.targetPages / payload.secondRate), "두 번째 학생의 새 책 완료일이 다릅니다.");
    const expectedWinner = payload.firstTargetDays < payload.secondTargetDays ? payload.firstStudentName : payload.secondStudentName;
    assert(payload.firstTargetDays !== payload.secondTargetDays && payload.winner === expectedWinner, "더 빨리 읽는 학생이 하나로 정해지지 않습니다.");
    assert(payload.dayDifference === Math.abs(payload.firstTargetDays - payload.secondTargetDays), "완료일 차이가 다릅니다.");
    assert(/태희도 매일 같은 쪽수씩/.test(visible), "태희가 매일 같은 쪽수씩 읽었다는 조건이 없습니다.");
    assert(/각자 앞에서 읽던 하루 쪽수대로/.test(visible), "새 책에서도 앞의 하루 분량을 유지한다는 조건이 없습니다.");
    assert(/첫날을 1일째|남은 쪽을 읽은 날/.test(visible), "책을 다 읽은 날을 세는 기준이 없습니다.");
  }
  if (variant === 7) {
    assert(payload.firstTurns % payload.firstSeconds === 0 && payload.secondTurns % payload.secondSeconds === 0, "초당 회전 수가 자연수가 아닙니다.");
    assert(payload.firstRate === payload.firstTurns / payload.firstSeconds && payload.secondRate === payload.secondTurns / payload.secondSeconds, "초당 회전 수가 다릅니다.");
    assert(payload.firstTargetTurns === payload.firstRate * payload.targetSeconds && payload.secondTargetTurns === payload.secondRate * payload.targetSeconds, "정해진 시간의 회전 수가 다릅니다.");
    assert(payload.answer === Math.abs(payload.firstTargetTurns - payload.secondTargetTurns), "회전 횟수 차가 다릅니다.");
  }
  if (variant === 8) {
    assert(payload.firstDays === payload.firstWeeks * 7 + payload.firstExtraDays, "첫째 공전 기간을 날짜로 바꾼 값이 다릅니다.");
    assert(payload.orbits === Math.floor(payload.firstDays / payload.secondDays), "공전 횟수가 다릅니다.");
    assert(payload.remainderDays === payload.firstDays % payload.secondDays, "남은 날이 다릅니다.");
    assert(/가 행성|나 행성/.test(visible), "바꾼 수치를 실제 행성 이름으로 표현했습니다.");
  }
  if (variant === 9) {
    assert(payload.secondGrams === payload.multiplier * payload.firstGrams + payload.extraGrams, "나 봉지의 무게가 다릅니다.");
    assert(payload.thirdGrams === payload.multiplier * payload.secondGrams + payload.extraGrams, "다 봉지의 무게가 다릅니다.");
    assert(payload.totalGrams === payload.firstGrams + payload.secondGrams + payload.thirdGrams, "세 봉지의 전체 무게가 다릅니다.");
    const added = payload.extraGrams + payload.multiplier * payload.extraGrams + payload.extraGrams;
    const groupCount = 1 + payload.multiplier + payload.multiplier * payload.multiplier;
    assert((payload.totalGrams - added) / groupCount === payload.firstGrams, "같은 묶음으로 나눈 풀이의 중간값이 다릅니다.");
    const normalizedSolution = visibleText(generated.solution).replace(/[\s,]/g, "");
    assert(normalizedSolution.includes(`${payload.totalGrams - added}÷${groupCount}=${payload.firstGrams}`), "설탕 풀이에 정확한 묶음 계산이 보이지 않습니다.");
    const candidates = sugarCandidates(payload);
    assert(sameArray(candidates, payload.candidates) && candidates.length === 1 && candidates[0] === payload.firstGrams, "가 봉지의 무게가 하나가 아닙니다.");
  }
  if (variant === 10) {
    assert(payload.firstSpeed * payload.firstTime === payload.tunnelLength + payload.firstLength, "첫 열차의 이동 거리가 다릅니다.");
    assert(payload.secondSpeed * payload.secondTime === payload.tunnelLength + payload.secondLength, "둘째 열차의 이동 거리가 다릅니다.");
    assert(Number.isInteger(payload.secondTime) && payload.secondTime > 0, "둘째 열차의 시간이 자연수가 아닙니다.");
  }
}

check(api.names.includes(generatorKey), "나눗셈 알아보기 전용 생성기가 등록되지 않았습니다.");
const groupItems = inventory.items.filter(item => item.unit === 3 && item.exploration === 3);
check(groupItems.length === 11, `나눗셈 알아보기 원문 항목은 11개여야 하나 ${groupItems.length}개입니다.`);

for (const [sourceItemId, variant, label] of sourceItems) {
  const item = groupItems.find(entry => entry.sourceItemId === sourceItemId);
  const runtimeItem = runtimeInventory.items.find(entry => entry.sourceItemId === sourceItemId);
  const mapping = nativeMappings.find(entry => entry.sourceItemId === sourceItemId);
  check(Boolean(item), `${sourceItemId}: 원문 목록에 없습니다.`);
  check(item?.typeLabel === label, `${sourceItemId}: 쉬운 한글 유형명이 달라졌습니다.`);
  check(item?.sourcePdfPage === (sourceItemId.includes("mission") ? 41 : 40), `${sourceItemId}: PDF 쪽수가 다릅니다.`);
  check(item?.sourcePrintedPage === (sourceItemId.includes("mission") ? 37 : 36), `${sourceItemId}: 교재 쪽수가 다릅니다.`);
  check(mapping?.generatorKey === generatorKey && mapping?.variant === variant, `${sourceItemId}: 전용 생성기 분기가 연결되지 않았습니다.`);
  check(runtimeItem?.reviewLocked === false && runtimeItem?.generatorKey === generatorKey, `${sourceItemId}: 브라우저에서 공개되지 않았습니다.`);
}

check(nativeMappings.filter(mapping => mapping.generatorKey === generatorKey).length === 11, "나눗셈 알아보기 공개 매핑은 11개여야 합니다.");
check(runtimeInventory.verifiedMappings >= 171, `4-1 공개 유형이 나눗셈 알아보기 완료 기준 171개보다 줄었습니다: ${runtimeInventory.verifiedMappings}개`);

const sourceUnitCost = sourceAnchors[0].totalPurchaseCost / sourceAnchors[0].totalItems;
const sourceSalePrice = sourceUnitCost + sourceAnchors[0].profitPerSoldItem;
const sourceSold = (sourceAnchors[0].totalPurchaseCost + sourceAnchors[0].actualProfit) / sourceSalePrice;
check(sourceAnchors[0].totalItems - sourceSold === 21, "원문 개념탐구에서 버린 배는 21개여야 합니다.");
check(sourceAnchors[0].rejectedPencilAnswer === 501 && sourceAnchors[0].rejectedPencilAnswer !== 21, "손글씨 오답 501개를 차단하지 못했습니다.");
check((sourceAnchors[1].totalTreesBothSides / 2 - 1) * sourceAnchors[1].spacingMeters === sourceAnchors[1].answerMeters, "원문 예제 3-1의 도로 길이는 1284m여야 합니다.");
const sourceSellable = sourceAnchors[2].itemsPerBasket * sourceAnchors[2].baskets - sourceAnchors[2].discarded;
check(Math.floor(sourceSellable / sourceAnchors[2].itemsPerBox) * sourceAnchors[2].boxPrice + sourceSellable % sourceAnchors[2].itemsPerBox * sourceAnchors[2].loosePrice === sourceAnchors[2].answer, "원문 예제 3-2의 판매 금액은 689000원이어야 합니다.");
check(sourceAnchors[3].cupsPerHour / (sourceAnchors[3].boxesPerDay / sourceAnchors[3].hoursPerDay) === sourceAnchors[3].answer, "원문 예제 3-3의 한 상자 종이컵 수는 25개여야 합니다.");
const sourceOldDaily = sourceAnchors[4].oldPrices.reduce((sum, value) => sum + value, 0);
const sourceNewDaily = sourceAnchors[4].newPrices.reduce((sum, value) => sum + value, 0);
const sourceIncreaseDays = Array.from({ length: sourceAnchors[4].daysInMonth }, (_, index) => index + 1).filter(day => (day - 1) * sourceOldDaily + (sourceAnchors[4].daysInMonth - day + 1) * sourceNewDaily === sourceAnchors[4].totalPaid);
check(sameArray(sourceIncreaseDays, [sourceAnchors[4].answerDay]), "원문 예제 3-4의 가격 인상일은 6월 9일 하나여야 합니다.");
check(sourceAnchors[5].students - sourceAnchors[5].sheets % sourceAnchors[5].students === sourceAnchors[5].answer, "원문 Mission 1의 최소 보충량은 10장이어야 합니다.");
const sourceFirstCompletion = Math.ceil(sourceAnchors[6].firstPages / sourceAnchors[6].firstRate);
const sourceSecondRate = sourceAnchors[6].secondPages / sourceFirstCompletion;
check(Math.ceil(sourceAnchors[6].targetPages / sourceSecondRate) - Math.ceil(sourceAnchors[6].targetPages / sourceAnchors[6].firstRate) === sourceAnchors[6].answerDays, "원문 Mission 2는 인성이가 2일 빨라야 합니다.");
check((sourceAnchors[7].secondTurns / sourceAnchors[7].secondSeconds - sourceAnchors[7].firstTurns / sourceAnchors[7].firstSeconds) * sourceAnchors[7].targetSeconds === sourceAnchors[7].answer, "원문 Mission 3의 회전 횟수 차는 690번이어야 합니다.");
check(Math.floor(sourceAnchors[8].firstDays / sourceAnchors[8].secondDays) === sourceAnchors[8].answerOrbits && sourceAnchors[8].firstDays % sourceAnchors[8].secondDays === sourceAnchors[8].answerRemainderDays, "원문 Mission 4는 7바퀴와 71일이어야 합니다.");
const sourceSugarCandidates = [];
for (let first = 1; first < sourceAnchors[9].totalGrams; first += 1) {
  const second = sourceAnchors[9].multiplier * first + sourceAnchors[9].extraGrams;
  const third = sourceAnchors[9].multiplier * second + sourceAnchors[9].extraGrams;
  if (first + second + third === sourceAnchors[9].totalGrams) sourceSugarCandidates.push(first);
}
check(sameArray(sourceSugarCandidates, [sourceAnchors[9].answer]), "원문 Mission 5의 가 봉지는 450g 하나여야 합니다.");
check(sourceAnchors[9].rejectedPencilAnswer === 4250 && sourceAnchors[9].rejectedPencilAnswer !== sourceAnchors[9].answer, "손글씨 오답 4250g을 차단하지 못했습니다.");
check(sourceAnchors[10].firstSpeed * sourceAnchors[10].firstTime - sourceAnchors[10].firstLength === sourceAnchors[10].tunnelLength && (sourceAnchors[10].tunnelLength + sourceAnchors[10].secondLength) / sourceAnchors[10].secondSpeed === sourceAnchors[10].answerSeconds, "원문 Mission 6의 통과 시간은 31초여야 합니다.");

const signatures = new Map();
const complexity = new Map();
for (const variant of variants) {
  for (const difficulty of difficulties) {
    const key = `${variant}:${difficulty}`;
    signatures.set(key, new Set());
    complexity.set(key, []);
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      try {
        const generated = api.generate({ generatorKey, variant }, 0, difficulty, seed, variant);
        generatedCount += 1;
        const proof = evidence(generated);
        assert(proof.expected === String(generated.answer), `분기 ${variant}: 숨은 기대답과 실제 답이 다릅니다.`);
        assert(sameArray(proof.payload.sourceAnchor, sourceAnchors[variant]), `분기 ${variant}: 원문 기준값이 바뀌었습니다.`);
        auditPayload(variant, proof.payload, generated);
        signatures.get(key).add(JSON.stringify([proof.kind, proof.payload, generated.answer]));
        complexity.get(key).push(Number(proof.payload.complexity));
      } catch (error) {
        failures.push(`분기 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        break;
      }
    }
  }
}

for (const variant of variants) {
  for (const difficulty of difficulties) check(signatures.get(`${variant}:${difficulty}`).size >= 20, `분기 ${variant} / 난이도 ${difficulty}: 문제 변화가 너무 적습니다.`);
  const low = complexity.get(`${variant}:-1`).reduce((sum, value) => sum + value, 0) / seedsPerDifficulty;
  const high = complexity.get(`${variant}:1`).reduce((sum, value) => sum + value, 0) / seedsPerDifficulty;
  check(high > low, `분기 ${variant}: 상 난이도의 조건 복잡도가 하보다 높지 않습니다.`);
}

if (failures.length) {
  console.error(`4-1 나눗셈 알아보기 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`4-1 나눗셈 알아보기 전용 감사 통과: 원문 11항목 · 공개 11 · ${generatedCount.toLocaleString()}회 독립 계산 · 날짜와 정답 후보 전수검사 · 손글씨 오답 2건 차단`);
