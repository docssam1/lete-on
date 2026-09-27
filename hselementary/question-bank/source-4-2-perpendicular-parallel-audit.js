"use strict";

global.window = {};
const inventory = require("./source-inventory-4-2-quadrilateral.js");
require("./curriculum.js");
require("./generators.js");
const moduleApi = require("./source-4-2-perpendicular-parallel.js");

const api = window.HSE_GENERATORS;
const failures = [];
let generatedCount = 0;
let independentCount = 0;

const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const allTypes = window.HSE_CURRICULUM.semesters
  .flatMap(semester => semester.units || [])
  .flatMap(unit => unit.subunits || [])
  .flatMap(subunit => subunit.types || []);
const sourceTypes = moduleApi.SOURCE_IDS.map(sourceItemId => allTypes.find(type => type.sourceItemId === sourceItemId));

const maxParallelDistance = lengths => {
  let x = 0;
  let y = 0;
  const verticalLines = [];
  const horizontalLines = [];
  lengths.forEach((length, index) => {
    const number = index + 1;
    if (number % 2 === 1) {
      verticalLines.push(x);
      y += number % 4 === 1 ? length : -length;
    } else {
      horizontalLines.push(y);
      x += length;
    }
  });
  const spread = values => Math.max(...values) - Math.min(...values);
  return Math.max(spread(verticalLines), spread(horizontalLines));
};

const spiralDistance = lengths => {
  let x = 0;
  let y = 0;
  let direction = 0;
  let firstLineY = 0;
  let lastLineY = 0;
  lengths.forEach((length, index) => {
    if (index > 0) direction -= 90;
    const radians = direction * Math.PI / 180;
    const nextX = x + Math.cos(radians) * length;
    const nextY = y + Math.sin(radians) * length;
    if (index === 0) firstLineY = y;
    if (index === lengths.length - 1) lastLineY = y;
    x = nextX;
    y = nextY;
  });
  return Math.abs(Math.round((lastLineY - firstLineY) * 1e9) / 1e9);
};

const verifyIndependent = (kind, facts, sourceItemId, poolIndex) => {
  let answer;
  let candidates = [];

  if (kind === "example-1-1") {
    check(180 - 135 === 45, `${sourceItemId}/${poolIndex}: 135°의 이웃각 검산이 깨졌습니다.`);
    answer = facts.topPart + facts.bottomPart;
  } else if (kind === "example-1-2" || kind === "mission-3") {
    const known = facts.known.reduce((sum, value) => sum + value, 0);
    candidates = Array.from({ length: 100 }, (_, index) => index + 1).filter(value => known + value === facts.total);
    answer = candidates[0];
  } else if (kind === "example-1-3") {
    answer = maxParallelDistance(facts.lengths);
  } else if (kind === "example-1-4" || kind === "mission-6") {
    const sizes = Object.values(facts.geometry.groups).map(group => group.length).sort((a, b) => a - b);
    check(JSON.stringify(sizes) === JSON.stringify([3, 3, 3]), `${sourceItemId}/${poolIndex}: 세 방향의 직선 수가 3·3·3이 아닙니다.`);
    answer = sizes.reduce((sum, size) => sum + size * (size - 1) / 2, 0);
  } else if (kind === "mission-1") {
    const groups = new Map();
    const lineData = [
      ["가", 18], ["나", 18], ["다", 166], ["라", 0], ["마", 72], ["바", 90], ["사", 116]
    ];
    lineData.forEach(([name, angle]) => {
      const key = ((angle % 180) + 180) % 180;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(name);
    });
    const pairs = [...groups.values()].filter(group => group.length > 1);
    check(pairs.length === 1 && pairs[0].join(",") === "가,나", `${sourceItemId}/${poolIndex}: 평행선 정답 후보가 하나가 아닙니다.`);
    answer = `가와 나, ${facts.distance}cm`;
  } else if (kind === "mission-2") {
    candidates = Array.from({ length: facts.total }, (_, index) => index + 1).filter(value => value + value * 2 + value * 4 === facts.total);
    answer = candidates[0] * 6;
  } else if (kind === "mission-4") {
    check(90 % facts.turnUnit === 0, `${sourceItemId}/${poolIndex}: 90° 회전 시간이 자연수 단계가 아닙니다.`);
    answer = facts.leg * 2 * facts.moveSeconds + 90 / facts.turnUnit * facts.turnSeconds;
  } else if (kind === "mission-5") {
    answer = spiralDistance(facts.lengths);
  }

  if (candidates.length) check(candidates.length === 1, `${sourceItemId}/${poolIndex}: 독립 전수 계산의 답 후보가 ${candidates.length}개입니다.`);
  check(String(answer) === String(facts.answer), `${sourceItemId}/${poolIndex}: 독립 계산 ${answer}와 생성 답 ${facts.answer}가 다릅니다.`);
  independentCount += 1;
};

check(sourceTypes.length === 10 && sourceTypes.every(Boolean), "수선과 평행선 공개 대상 10유형이 런타임에 모두 없습니다.");
check(inventory.items.filter(item => item.exploration === 1 && item.implementationStatus === "ready").length === 10,
  "개념탐구 1의 공개 10유형 계약이 다릅니다.");
check(inventory.totals.ready === 31 && inventory.totals.locked === 57,
  "사각형 원장의 공개 31·잠금 57 계약이 다릅니다.");

for (const [sourceIndex, sourceItemId] of moduleApi.SOURCE_IDS.entries()) {
  const type = sourceTypes[sourceIndex];
  const kind = moduleApi.KINDS[sourceItemId];
  const pool = moduleApi.POOLS[kind];
  check(type?.reviewLocked === false, `${sourceItemId}: 공개 유형이 잠겨 있습니다.`);
  check(type?.generatorKey === moduleApi.GENERATOR_KEY, `${sourceItemId}: 전용 생성기가 연결되지 않았습니다.`);
  check(pool?.length === 3, `${sourceItemId}: 검증 문제는 정확히 3개여야 합니다.`);

  for (let poolIndex = 0; poolIndex < 3; poolIndex += 1) {
    const facts = moduleApi.deriveCase(kind, pool[poolIndex]);
    verifyIndependent(kind, facts, sourceItemId, poolIndex);
  }

  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 200; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, seed - 1);
      generatedCount += 1;
      const visible = `${generated?.prompt || ""} ${generated?.answer ?? ""} ${generated?.solution || ""} ${generated?.answerVisual || ""}`;
      if (!generated?.prompt || generated.answer === undefined || !generated?.solution || !generated?.answerVisual || /undefined|null|NaN|Infinity/.test(visible)) {
        failures.push(`${sourceItemId}/난이도${difficulty}/시드${seed}: 문제·정답·풀이·정답 그림이 깨졌습니다.`);
        break;
      }
      if (generated.answerCandidateCount !== 1 || generated.answerVisualStatus !== "verified" || generated.verifiedVariantCount !== 3) {
        failures.push(`${sourceItemId}/난이도${difficulty}/시드${seed}: 단일 정답·3문제·정답 그림 계약이 깨졌습니다.`);
        break;
      }
      if (!generated.prompt.includes(`data-source-item="${sourceItemId}"`) || !generated.prompt.includes('data-answer-contract="single"')) {
        failures.push(`${sourceItemId}/난이도${difficulty}/시드${seed}: 원문·단일 정답 근거가 문제에 없습니다.`);
        break;
      }
      if (!generated.prompt.includes("source42-pp") || !generated.answerVisual.includes("source42-pp")) {
        failures.push(`${sourceItemId}/난이도${difficulty}/시드${seed}: 문제와 답의 도형 그림이 없습니다.`);
        break;
      }
      if (/stroke:\s*#[0-9a-f]{6}/i.test(visible) && /stroke:\s*#(?:0d47a1|1565c0|1e88e5)/i.test(visible)) {
        failures.push(`${sourceItemId}/난이도${difficulty}/시드${seed}: 문제집 도형에 파란 선이 남았습니다.`);
        break;
      }
    }
  }
}

if (failures.length) {
  console.error(`4-2 수선과 평행선 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`4-2 수선과 평행선 심화 감사 통과: 공개 10유형 · 독립 계산 ${independentCount}건 · ${generatedCount.toLocaleString()}회 생성 · 문제·정답 그림 계약 통과`);
