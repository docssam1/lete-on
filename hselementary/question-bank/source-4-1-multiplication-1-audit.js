"use strict";

global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const nativeMappings = require("./source-inventory/4-1-native-generators.json").mappings;
const api = window.HSE_GENERATORS;
const runtimeInventory = window.HSE_SOURCE_INVENTORY_41;
const generatorKey = "source41MultiplicationOne";
const variants = Array.from({ length: 11 }, (_, index) => index);
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const failures = [];
let generatedCount = 0;

const sourceItems = [
  ["4-1-u3-e1-exploration", 0, "단위 작업량으로 포장 잔량 구하기"],
  ["4-1-u3-e1-example-1-1", 1, "두 상품의 판매 이익 합산"],
  ["4-1-u3-e1-example-1-2", 2, "통과 시간으로 터널 길이 구하기"],
  ["4-1-u3-e1-example-1-3", 3, "단체 할인 입장료 계산"],
  ["4-1-u3-e1-example-1-4", 4, "마주 보는 나무 간격으로 둘레 구하기"],
  ["4-1-u3-e1-mission-1", 5, "상자별 수량으로 전체 개수 구하기"],
  ["4-1-u3-e1-mission-2", 6, "판매량 변화를 반영한 이익 계산"],
  ["4-1-u3-e1-mission-3", 7, "매듭 손실을 고려한 연결 길이"],
  ["4-1-u3-e1-mission-4", 8, "과일별 전체 수확량 비교"],
  ["4-1-u3-e1-mission-5", 9, "반복되는 시계 종소리 횟수"],
  ["4-1-u3-e1-mission-6", 10, "인원과 시간으로 포장 잔량 구하기"]
];

const sourceAnchors = {
  0: { itemsPerBox: 15, boxes: 4660, ratePerMinute: 27, people: 18, totalMinutes: 135, answer: 4290, rejectedPencilAnswer: 4295 },
  1: { buyPrices: [650, 460], sellPrices: [900, 850], quantities: [32, 45], answer: 25550 },
  2: { vehicleLengthMeters: 8, speedCentimetersPerSecond: 875, totalSeconds: 72, travelMeters: 630, answer: 622, rejectedPencilAnswer: 638 },
  3: { studentsPerClass: 34, classes: 8, fee: 800, groupSize: 10, discountPerGroup: 800, answer: 196000 },
  4: { firstTree: 13, oppositeTree: 49, spacingMeters: 45, answer: 3240 },
  5: { itemsPerBox: 24, boxes: 148, answer: 3552 },
  6: { profitPerItem: 240, yesterday: 3000, decrease: 400, answer: 1344000 },
  7: { ropeCentimeters: 273, ropes: 38, knotLossCentimeters: 16, answerCentimeters: 9782, answer: "97m 82cm", mismatchedAnswerPage: { tapeCentimeters: 325, tapes: 57, overlapCentimeters: 5 } },
  8: { itemsPerBox: [42, 35, 22], boxes: [198, 238, 368], totals: [8316, 8330, 8096], answer: 234 },
  9: { days: 365, chimesPerHalfDay: 78, chimesPerDay: 156, answer: 56940 },
  10: { itemsPerBox: 20, boxes: 1557, ratePerMinute: 16, people: 24, totalMinutes: 80, answer: 420 }
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

function formatMetersCentimeters(totalCentimeters) {
  const meters = Math.floor(totalCentimeters / 100);
  const centimeters = totalCentimeters % 100;
  return `${meters ? `${meters}m` : ""}${meters && centimeters ? " " : ""}${centimeters ? `${centimeters}cm` : ""}`;
}

function independentAnswer(variant, payload) {
  if (variant === 0 || variant === 10) return payload.itemsPerBox * payload.boxes - payload.ratePerMinute * payload.people * payload.totalMinutes;
  if (variant === 1) return payload.quantities.reduce((sum, quantity, index) => sum + (payload.sellPrices[index] - payload.buyPrices[index]) * quantity, 0);
  if (variant === 2) return payload.speedCentimetersPerSecond * payload.totalSeconds / 100 - payload.vehicleLengthMeters;
  if (variant === 3) {
    const students = payload.studentsPerClass * payload.classes;
    return students * payload.fee - Math.floor(students / payload.groupSize) * payload.discountPerGroup;
  }
  if (variant === 4) return (payload.oppositeTree - payload.firstTree) * 2 * payload.spacingMeters;
  if (variant === 5) return payload.itemsPerBox * payload.boxes;
  if (variant === 6) return (payload.yesterday + payload.yesterday - payload.decrease) * payload.profitPerItem;
  if (variant === 7) return formatMetersCentimeters(payload.pieceCentimeters * payload.ropes - payload.knotLossCentimeters * (payload.ropes - 1));
  if (variant === 8) return Math.max(...payload.totals) - Math.min(...payload.totals);
  return payload.days * 2 * (12 * 13 / 2);
}

function auditPayload(variant, payload, generated) {
  const visible = visibleText(`${generated.prompt} ${generated.solution}`);
  assert(!/undefined|null|NaN|Infinity/.test(`${visible} ${generated.answer}`), `분기 ${variant}: 잘못된 값이 보입니다.`);
  assert(!/순열|조합|제곱근|모듈러|mod\b/.test(visible), `분기 ${variant}: 초등 과정 밖 표현이 보입니다.`);
  assert(!/(^|\s)0(?:시간|분|초|m|cm)(?=\s|$)/.test(visible), `분기 ${variant}: 값이 0인 작은 단위를 표시했습니다.`);
  assert(Number(payload.complexity) > 0, `분기 ${variant}: 난이도 자료가 없습니다.`);

  if (variant === 0 || variant === 10) {
    assert(payload.totalItems === payload.itemsPerBox * payload.boxes, `분기 ${variant}: 처음 물건 수가 다릅니다.`);
    assert(payload.packed === payload.ratePerMinute * payload.people * payload.totalMinutes, `분기 ${variant}: 포장량이 다릅니다.`);
    assert(payload.answer > 0, `분기 ${variant}: 남은 물건이 양수가 아닙니다.`);
  }
  if (variant === 1) {
    assert(payload.sellPrices.every((price, index) => price > payload.buyPrices[index]), "두 상품 중 손해를 보는 상품이 있습니다.");
    assert(payload.profits.every((profit, index) => profit === (payload.sellPrices[index] - payload.buyPrices[index]) * payload.quantities[index]), "상품별 이익 자료가 다릅니다.");
  }
  if (variant === 2) {
    assert(payload.speedCentimetersPerSecond * payload.totalSeconds % 100 === 0, "터널 문제의 이동 거리가 자연수 m가 아닙니다.");
    assert(payload.answer > 0 && payload.travelMeters === payload.answer + payload.vehicleLengthMeters, "터널 길이와 트럭 길이의 관계가 다릅니다.");
    assert(/앞부분이 터널 입구에 닿은 때부터 뒤끝이 터널 출구를 완전히 벗어날 때까지/.test(visible), "터널 통과의 시작과 끝이 명확하지 않습니다.");
  }
  if (variant === 3) {
    assert(payload.students === payload.studentsPerClass * payload.classes, "단체 학생 수가 다릅니다.");
    assert(payload.students % payload.groupSize !== 0, "할인 뒤 남는 학생이 없어 묶음 해석을 검사할 수 없습니다.");
    assert(payload.groups === Math.floor(payload.students / payload.groupSize), "완전한 할인 묶음 수가 다릅니다.");
    assert(/10명마다 전체 입장료에서/.test(visible), "10명마다 한 번 할인한다는 조건이 명확하지 않습니다.");
  }
  if (variant === 4) {
    assert(payload.oppositeTree > payload.firstTree && payload.totalIntervals === (payload.oppositeTree - payload.firstTree) * 2, "마주 보는 나무의 반원 간격이 다릅니다.");
  }
  if (variant === 6) assert(payload.today === payload.yesterday - payload.decrease && payload.today > 0, "오늘 판매량이 어제보다 줄어든 조건과 다릅니다.");
  if (variant === 7) {
    assert(payload.knots === payload.ropes - 1, "한 줄 로프의 매듭 수가 로프 수-1이 아닙니다.");
    assert(payload.knotLossCentimeters > 0 && payload.knotLossCentimeters < payload.pieceCentimeters, "매듭에서 줄어드는 길이가 잘못됐습니다.");
    assert(payload.totalCentimeters % 100 !== 0 && /^\d+m \d+cm$/.test(generated.answer), "m와 cm가 모두 필요한 답이 아닙니다.");
    assert(/두 로프에서 합하여/.test(visible), "매듭 한 곳에서 줄어드는 전체 길이가 명확하지 않습니다.");
  }
  if (variant === 8) {
    assert(new Set(payload.totals).size === 3, "세 과일의 전체 수확량에 같은 값이 있습니다.");
    assert(Math.max(...payload.totals) - Math.min(...payload.totals) >= 80, "가장 많은 수확량과 가장 적은 수확량의 차가 너무 작습니다.");
    assert((generated.prompt.match(/<tr>/g) || []).length === 4, "과일 세 종류의 표가 완전하지 않습니다.");
  }
  if (variant === 9) {
    assert(payload.chimesPerHalfDay === 78 && payload.chimesPerDay === 156, "12시간과 하루의 종소리 수가 다릅니다.");
    assert(/자정과 정오에는 각각 12번/.test(visible), "12시 종소리 조건이 빠졌습니다.");
  }
}

check(api.names.includes(generatorKey), "곱셈 알아보기 개념탐구 1 전용 생성기가 등록되지 않았습니다.");
const groupItems = inventory.items.filter(item => item.unit === 3 && item.exploration === 1);
check(groupItems.length === 11, `곱셈 알아보기 개념탐구 1 원문 항목은 11개여야 하나 ${groupItems.length}개입니다.`);

for (const [sourceItemId, variant, label] of sourceItems) {
  const item = groupItems.find(entry => entry.sourceItemId === sourceItemId);
  const runtimeItem = runtimeInventory.items.find(entry => entry.sourceItemId === sourceItemId);
  const mapping = nativeMappings.find(entry => entry.sourceItemId === sourceItemId);
  check(Boolean(item), `${sourceItemId}: 원문 목록에 없습니다.`);
  check(item?.typeLabel === label, `${sourceItemId}: 쉬운 한글 유형명이 달라졌습니다.`);
  check(item?.sourcePdfPage === (sourceItemId.includes("mission") ? 37 : 36), `${sourceItemId}: PDF 쪽수가 다릅니다.`);
  check(item?.sourcePrintedPage === (sourceItemId.includes("mission") ? 33 : 32), `${sourceItemId}: 교재 쪽수가 다릅니다.`);
  check(mapping?.generatorKey === generatorKey && mapping?.variant === variant, `${sourceItemId}: 전용 생성기 분기가 연결되지 않았습니다.`);
  check(runtimeItem?.reviewLocked === false && runtimeItem?.generatorKey === generatorKey, `${sourceItemId}: 브라우저에서 공개되지 않았습니다.`);
}

check(nativeMappings.filter(mapping => mapping.generatorKey === generatorKey).length === 11, "곱셈 알아보기 개념탐구 1 공개 매핑은 11개여야 합니다.");
check(runtimeInventory.verifiedMappings >= 149, `4-1 공개 유형이 곱셈 알아보기 개념탐구 1 완료 기준 149개보다 줄었습니다: ${runtimeInventory.verifiedMappings}개`);

const sourceCalculations = {
  0: sourceAnchors[0].itemsPerBox * sourceAnchors[0].boxes - sourceAnchors[0].ratePerMinute * sourceAnchors[0].people * sourceAnchors[0].totalMinutes,
  1: sourceAnchors[1].quantities.reduce((sum, quantity, index) => sum + (sourceAnchors[1].sellPrices[index] - sourceAnchors[1].buyPrices[index]) * quantity, 0),
  2: sourceAnchors[2].speedCentimetersPerSecond * sourceAnchors[2].totalSeconds / 100 - sourceAnchors[2].vehicleLengthMeters,
  3: sourceAnchors[3].studentsPerClass * sourceAnchors[3].classes * sourceAnchors[3].fee - Math.floor(sourceAnchors[3].studentsPerClass * sourceAnchors[3].classes / sourceAnchors[3].groupSize) * sourceAnchors[3].discountPerGroup,
  4: (sourceAnchors[4].oppositeTree - sourceAnchors[4].firstTree) * 2 * sourceAnchors[4].spacingMeters,
  5: sourceAnchors[5].itemsPerBox * sourceAnchors[5].boxes,
  6: (sourceAnchors[6].yesterday + sourceAnchors[6].yesterday - sourceAnchors[6].decrease) * sourceAnchors[6].profitPerItem,
  7: sourceAnchors[7].ropeCentimeters * sourceAnchors[7].ropes - sourceAnchors[7].knotLossCentimeters * (sourceAnchors[7].ropes - 1),
  8: Math.max(...sourceAnchors[8].totals) - Math.min(...sourceAnchors[8].totals),
  9: sourceAnchors[9].days * sourceAnchors[9].chimesPerDay,
  10: sourceAnchors[10].itemsPerBox * sourceAnchors[10].boxes - sourceAnchors[10].ratePerMinute * sourceAnchors[10].people * sourceAnchors[10].totalMinutes
};

for (const variant of variants) check(sourceCalculations[variant] === (variant === 7 ? sourceAnchors[variant].answerCentimeters : sourceAnchors[variant].answer), `원문 분기 ${variant}의 독립 계산값이 다릅니다.`);
check(sourceCalculations[0] === 4290 && sourceCalculations[0] !== sourceAnchors[0].rejectedPencilAnswer, "본문의 잘못 적힌 4295를 거르지 못했습니다.");
check(sourceCalculations[2] === 622 && sourceCalculations[2] !== sourceAnchors[2].rejectedPencilAnswer, "터널 길이에서 트럭 길이를 더한 638m를 거르지 못했습니다.");
check(formatMetersCentimeters(sourceCalculations[7]) === "97m 82cm", "원문 Mission 3의 로프 길이는 97m 82cm여야 합니다.");
const mismatchedMissionThree = sourceAnchors[7].mismatchedAnswerPage.tapeCentimeters * sourceAnchors[7].mismatchedAnswerPage.tapes - sourceAnchors[7].mismatchedAnswerPage.overlapCentimeters * (sourceAnchors[7].mismatchedAnswerPage.tapes - 1);
check(mismatchedMissionThree === 18245 && mismatchedMissionThree !== sourceCalculations[7], "다른 판본의 테이프 문제를 원문 로프 문제와 구분하지 못했습니다.");

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
        assert(JSON.stringify(proof.payload.sourceAnchor) === JSON.stringify(sourceAnchors[variant]), `분기 ${variant}: 원문 기준값이 바뀌었습니다.`);
        assert(String(independentAnswer(variant, proof.payload)) === String(generated.answer), `분기 ${variant}: 독립 계산값과 답이 다릅니다.`);
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
  const minimumVariety = variant === 9 ? 3 : 20;
  for (const difficulty of difficulties) check(signatures.get(`${variant}:${difficulty}`).size >= minimumVariety, `분기 ${variant} / 난이도 ${difficulty}: 문제 변화가 너무 적습니다.`);
  const low = complexity.get(`${variant}:-1`).reduce((sum, value) => sum + value, 0) / seedsPerDifficulty;
  const high = complexity.get(`${variant}:1`).reduce((sum, value) => sum + value, 0) / seedsPerDifficulty;
  check(high > low, `분기 ${variant}: 상 난이도의 조건 복잡도가 하보다 높지 않습니다.`);
}

if (failures.length) {
  console.error(`4-1 곱셈 알아보기 개념탐구 1 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`4-1 곱셈 알아보기 개념탐구 1 전용 감사 통과: 원문 11항목 · 공개 11 · ${generatedCount.toLocaleString()}회 독립 계산 · 본문 4290·터널 622·로프 97m 82cm 원문 오류 회귀 확인`);
