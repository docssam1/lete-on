"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41AngleOne";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const circled = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫"];
const expectedSourceIds = [
  "4-1-u2-e1-exploration",
  "4-1-u2-e1-example-1-1",
  "4-1-u2-e1-example-1-2",
  "4-1-u2-e1-example-1-3",
  "4-1-u2-e1-example-1-4",
  "4-1-u2-e1-mission-1",
  "4-1-u2-e1-mission-2",
  "4-1-u2-e1-mission-3",
  "4-1-u2-e1-mission-4",
  "4-1-u2-e1-mission-5",
  "4-1-u2-e1-mission-6"
];
const expectedKinds = [
  "triangle-location-angle-relations",
  "equal-straight-fan-acute-count",
  "fixed-ray-obtuse-count",
  "always-true-angle-relations",
  "concurrent-lines-vertical-pairs",
  "equal-straight-fan-acute-count-extended",
  "marked-ray-acute-count",
  "false-angle-relations",
  "right-angle-segment-acute-count",
  "straight-line-extra-rays-under-180",
  "many-concurrent-lines-vertical-pairs"
];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function readEvidence(prompt) {
  const tag = prompt.match(/<span hidden data-source41-kind="[^"]+" data-source41-payload="[^"]+" data-source41-expected="[^"]*"><\/span>/)?.[0];
  assert(tag, "독립 검산 자료가 없습니다.");
  return {
    kind: attribute(tag, "data-source41-kind"),
    payload: JSON.parse(decodeURIComponent(attribute(tag, "data-source41-payload"))),
    declared: decodeURIComponent(attribute(tag, "data-source41-expected"))
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

function angleClass(value) {
  if (value > 0 && value < 90) return "acute";
  if (value === 90) return "right";
  if (value > 90 && value < 180) return "obtuse";
  if (value === 180) return "straight";
  return "outside";
}

function smallAngle(first, second) {
  const difference = Math.abs(first - second) % 360;
  return Math.min(difference, 360 - difference);
}

function countPairs(angles, kind) {
  let count = 0;
  for (let first = 0; first < angles.length; first += 1) {
    for (let second = first + 1; second < angles.length; second += 1) {
      if (angleClass(smallAngle(angles[first], angles[second])) === kind) count += 1;
    }
  }
  return count;
}

const domains = {
  acute: Array.from({ length: 89 }, (_, index) => index + 1),
  right: [90],
  obtuse: Array.from({ length: 89 }, (_, index) => index + 91),
  straight: [180]
};
const truthCache = new Map();

function statementAlways(statement) {
  if (truthCache.has(statement.id)) return truthCache.get(statement.id);
  const targetValue = statement.target === "right" ? 90 : statement.target === "straight" ? 180 : null;
  let always = true;
  for (const left of domains[statement.left]) {
    for (const right of domains[statement.right]) {
      const value = statement.op === "+" ? left + right : left - right;
      const holds = statement.relation === "type"
        ? angleClass(value) === statement.target
        : statement.relation === ">" ? value > targetValue : value < targetValue;
      if (!holds) {
        always = false;
        break;
      }
    }
    if (!always) break;
  }
  truthCache.set(statement.id, always);
  return always;
}

function independentAnswer(kind, payload) {
  if (kind === "triangle-location-angle-relations") {
    const matches = payload.options.map((angles, index) => ({ angles, index })).filter(option => {
      const [angleA, angleB, angleC] = option.angles;
      return angleB === angleC - payload.lowerDifference && angleA === angleC + payload.upperDifference && angleA + angleB + angleC === 180;
    });
    assert(matches.length === 1, `집 위치 답 후보가 ${matches.length}개입니다.`);
    assert(matches[0].index + 1 === payload.answerIndex, "집 위치 번호와 조건 계산 결과가 다릅니다.");
    return circled[matches[0].index];
  }

  if (["equal-straight-fan-acute-count", "equal-straight-fan-acute-count-extended", "marked-ray-acute-count"].includes(kind)) {
    return String(countPairs(payload.angles, "acute"));
  }

  if (kind === "fixed-ray-obtuse-count") return String(countPairs(payload.angles, "obtuse"));

  if (kind === "always-true-angle-relations" || kind === "false-angle-relations") {
    const wantedTruth = kind === "always-true-angle-relations";
    const values = payload.statements.map(statementAlways);
    assert(values.every((value, index) => value === payload.truthValues[index]), "각도 관계의 참·거짓 자료가 독립 계산과 다릅니다.");
    return values.map((value, index) => value === wantedTruth ? circled[index] : "").filter(Boolean).join(", ");
  }

  if (kind === "concurrent-lines-vertical-pairs" || kind === "many-concurrent-lines-vertical-pairs") {
    assert(new Set(payload.angles.map(angle => ((angle % 180) + 180) % 180)).size === payload.lineCount, "같은 방향의 직선이 겹쳤습니다.");
    return String(payload.lineCount * (payload.lineCount - 1));
  }

  if (kind === "right-angle-segment-acute-count") {
    assert(Math.min(...payload.angles) === 0 && Math.max(...payload.angles) === 90, "직각의 양쪽 경계가 보이지 않습니다.");
    assert(countPairs(payload.angles, "right") === 1, "직각이 하나로 고정되지 않았습니다.");
    return String(countPairs(payload.angles, "acute"));
  }

  if (kind === "straight-line-extra-rays-under-180") {
    let count = 0;
    let straight = 0;
    for (let first = 0; first < payload.angles.length; first += 1) {
      for (let second = first + 1; second < payload.angles.length; second += 1) {
        const value = smallAngle(payload.angles[first], payload.angles[second]);
        if (value < 180) count += 1;
        if (value === 180) straight += 1;
      }
    }
    assert(straight === 1, "평각이 하나로 고정되지 않았습니다.");
    return String(count);
  }

  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

function assertClearRayPicture(payload) {
  const sorted = payload.angles.slice().sort((left, right) => left - right);
  const minimumGap = Math.min(...sorted.slice(1).map((angle, index) => angle - sorted[index]));
  assert(minimumGap >= 8, `서로 붙어 보이는 광선 간격 ${minimumGap}°가 있습니다.`);
  assert(payload.rightPairs.length >= 1, "원문 조건인 직각 표시가 없습니다.");
  for (const pair of payload.rightPairs) {
    assert(payload.angles.includes(pair[0]) && payload.angles.includes(pair[1]) && smallAngle(pair[0], pair[1]) === 90, "표시된 두 반직선이 직각이 아닙니다.");
  }
  for (let first = 0; first < sorted.length; first += 1) {
    for (let second = first + 1; second < sorted.length; second += 1) {
      const difference = smallAngle(sorted[first], sorted[second]);
      const distance = Math.abs(difference - 90);
      const allowed = payload.allowedRightPairs.some(pair => pair[0] === sorted[first] && pair[1] === sorted[second]);
      assert(distance > payload.rightSafetyMargin || (difference === 90 && allowed), `직각과 ${distance}°밖에 차이 나지 않는 애매한 광선쌍이 있습니다.`);
    }
  }
}

function auditSourceAnchors() {
  check(105 + 20 + 55 === 180 && 55 - 20 === 35 && 105 - 55 === 50, "원문 본문의 105°·20°·55° 관계가 다릅니다.");
  check(countPairs(Array.from({ length: 6 }, (_, index) => index * 36), "acute") === 9, "원문 예제 1-1의 답이 9가 아닙니다.");
  check(countPairs([0, 20, 30, 90, 125, 155, 180], "obtuse") === 8, "원문 예제 1-2의 의도된 답이 8이 아닙니다.");

  const exampleStatements = [
    { id: "AA=O", left: "acute", op: "+", right: "acute", relation: "type", target: "obtuse" },
    { id: "O-A=A", left: "obtuse", op: "-", right: "acute", relation: "type", target: "acute" },
    { id: "A+O>S", left: "acute", op: "+", right: "obtuse", relation: ">", target: "straight" },
    { id: "S-O=A", left: "straight", op: "-", right: "obtuse", relation: "type", target: "acute" },
    { id: "R+A=O", left: "right", op: "+", right: "acute", relation: "type", target: "obtuse" },
    { id: "O-A>R", left: "obtuse", op: "-", right: "acute", relation: ">", target: "right" }
  ];
  check(exampleStatements.map(statementAlways).map((value, index) => value ? circled[index] : "").filter(Boolean).join(", ") === "④, ⑤", "원문 예제 1-3의 답이 ④, ⑤가 아닙니다.");
  check(6 * 5 === 30, "원문 예제 1-4의 맞꼭지각 답이 30쌍이 아닙니다.");
  check(countPairs(Array.from({ length: 9 }, (_, index) => index * 22.5), "acute") === 21, "원문 Mission 1의 답이 21이 아닙니다.");
  check(countPairs([0, 25, 60, 115, 145, 180], "acute") === 8, "원문 Mission 2의 의도된 답이 8이 아닙니다.");

  const missionStatements = [
    { id: "S-A=O", left: "straight", op: "-", right: "acute", relation: "type", target: "obtuse" },
    { id: "A+O=S", left: "acute", op: "+", right: "obtuse", relation: "type", target: "straight" },
    { id: "R+A=O", left: "right", op: "+", right: "acute", relation: "type", target: "obtuse" },
    { id: "O-A=R", left: "obtuse", op: "-", right: "acute", relation: "type", target: "right" },
    { id: "S-O=A", left: "straight", op: "-", right: "obtuse", relation: "type", target: "acute" },
    { id: "O+O=S", left: "obtuse", op: "+", right: "obtuse", relation: "type", target: "straight" },
    { id: "R-A=A", left: "right", op: "-", right: "acute", relation: "type", target: "acute" },
    { id: "A+A=R", left: "acute", op: "+", right: "acute", relation: "type", target: "right" },
    { id: "A+A>R", left: "acute", op: "+", right: "acute", relation: ">", target: "right" },
    { id: "A+A<R", left: "acute", op: "+", right: "acute", relation: "<", target: "right" }
  ];
  check(missionStatements.map(statementAlways).map((value, index) => !value ? circled[index] : "").filter(Boolean).join(", ") === "②, ④, ⑥, ⑧, ⑨, ⑩", "원문 Mission 3의 올바른 답에서 ⑦을 제외하지 못했습니다.");
  check(6 * 5 / 2 - 1 === 14, "원문 Mission 4의 답이 14가 아닙니다.");
  check(7 * 6 / 2 - 1 === 20, "원문 Mission 5의 답이 20이 아닙니다.");
  check(7 * 6 === 42, "원문 Mission 6의 답이 42쌍이 아닙니다.");
}

auditSourceAnchors();

const sourceItems = inventory.items.filter(item => Number(item.unit) === 2 && Number(item.exploration) === 1);
check(sourceItems.length === 11, `원문 목록 항목 수가 11개가 아닙니다: ${sourceItems.length}`);
check(sourceItems.map(item => item.sourceItemId).join("|") === expectedSourceIds.join("|"), "variant 0..10과 원문 목록 순서가 다릅니다.");
check(api.names.includes(generatorKey), `${generatorKey} 생성기가 등록되지 않았습니다.`);

const promptSets = Array.from({ length: 11 }, () => difficulties.map(() => new Set()));
const complexitySums = Array.from({ length: 11 }, () => difficulties.map(() => 0));
const kindOwners = new Map();
let generatedCount = 0;

for (let variant = 0; variant < 11; variant += 1) {
  const type = { id: expectedSourceIds[variant], name: sourceItems[variant]?.typeLabel || expectedSourceIds[variant], generatorKey, variant };
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    const difficulty = difficulties[difficultyIndex];
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      const context = `variant ${variant} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, variant);
        assert(generated?.generator === generatorKey, "다른 생성기가 호출되었습니다.");
        assert(Boolean(generated.prompt && generated.answer !== "" && generated.solution), "문제·정답·풀이가 비었습니다.");
        const visible = visibleText(`${generated.prompt} ${generated.answer} ${generated.solution}`);
        assert(!/undefined|null|NaN|Infinity/.test(visible), "깨진 계산값이 보입니다.");
        assert(!/[\u4E00-\u9FFF]/.test(visible), "한자 표현이 보입니다.");
        for (const term of [/순열/, /조합/, /방정식/, /미지수/, /삼각함수/, /라디안/]) assert(!term.test(visible), `초등 범위를 벗어난 표현 ${term}이 보입니다.`);

        const evidence = readEvidence(generated.prompt);
        assert(evidence.kind === expectedKinds[variant], `분기 구조가 ${evidence.kind}로 바뀌었습니다.`);
        assert(evidence.payload.variant === variant && evidence.payload.level === difficulty + 1, "variant 또는 난이도 자료가 다릅니다.");
        const owner = kindOwners.get(evidence.kind);
        assert(owner === undefined || owner === variant, `검산 구조 ${evidence.kind}가 둘 이상의 원문 항목에 쓰였습니다.`);
        kindOwners.set(evidence.kind, variant);

        if (variant === 0) {
          assert(generated.prompt.includes("source41-angle-location"), "집 후보 그림이 없습니다.");
          assert(evidence.payload.options.length === 4 && new Set(evidence.payload.options.map(item => item.join(","))).size === 4, "집 후보 네 곳이 서로 다르지 않습니다.");
        } else if ([1, 2, 4, 5, 6, 8, 9, 10].includes(variant)) {
          assert(generated.prompt.includes("source41-angle-rays"), "광선 또는 직선 그림이 없습니다.");
        } else {
          assert(generated.prompt.includes("source41-angle-statements"), "각도 관계 선택지가 없습니다.");
        }
        if (variant === 2 || variant === 6) {
          assertClearRayPicture(evidence.payload);
          assert(generated.prompt.includes("data-right-pair"), "원문 조건인 직각 표시가 그림에 없습니다.");
        }

        const independent = independentAnswer(evidence.kind, evidence.payload);
        assert(independent === evidence.declared, `생성기 선언 답 ${evidence.declared}과 독립 답 ${independent}이 다릅니다.`);
        assert(independent === generated.answer, `표시 답 ${generated.answer}과 독립 답 ${independent}이 다릅니다.`);
        assert(generated.solution.includes(generated.answer), "풀이에 최종 답이 없습니다.");
        assert(visibleText(generated.solution).length >= 55, "풀이 단계가 너무 짧습니다.");

        promptSets[variant][difficultyIndex].add(generated.prompt);
        complexitySums[variant][difficultyIndex] += evidence.payload.complexity;
        generatedCount += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
}

for (let variant = 0; variant < 11; variant += 1) {
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    check(promptSets[variant][difficultyIndex].size >= 10, `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 ${promptSets[variant][difficultyIndex].size}개뿐입니다.`);
  }
  const averages = complexitySums[variant].map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 조건 수가 커지지 않습니다 (${averages.map(value => value.toFixed(1)).join(", ")}).`);
}

check(kindOwners.size === 11, `서로 식별되는 원문 검산 구조가 11개가 아닙니다: ${kindOwners.size}`);
check(generatedCount === 11 * difficulties.length * seedsPerDifficulty, `생성 검산 횟수가 ${generatedCount}회입니다.`);

if (failures.length) {
  console.error(`4-1 각도 개념탐구 1 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`4-1 각도 개념탐구 1 전용 감사 통과: 원문 11항목 · 11구조 · ${generatedCount.toLocaleString()}회 독립 검산 · 원본 정답/유일성/가시성 확인`);
console.log("원본 주의 기록: 예제 1-2·Mission 2의 애매한 광선 간격은 안전 간격으로 보정했고, Mission 3 정답에서는 항상 참인 ⑦을 제외했습니다.");
