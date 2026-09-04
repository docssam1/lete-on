"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const readiness = require("./source-inventory/6-1-u3-source-readiness-review.json");
const generatorKey = "sourceGrade6DecimalDivisionE1";
const sourceIds = [
  "6-1-u3-e1-exploration-1", "6-1-u3-e1-example-1", "6-1-u3-e1-example-2", "6-1-u3-e1-example-3",
  "6-1-u3-e1-example-4", "6-1-u3-e1-mission-1", "6-1-u3-e1-mission-2", "6-1-u3-e1-mission-5", "6-1-u3-e1-mission-6"
];
const kinds = [
  "decimal-division-calculation", "card-quotient-near-one", "digit-pair-inequality", "decimal-range-quotient",
  "decimal-point-shift", "quotient-distance-order", "custom-division-operator", "number-recovery-two-divisors", "card-quotient-range"
];
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedPools = [
  [[1.2, 1.24, .71, 1.65, 7.08], [1.3, 1.35, .78, 1.82, 8.52], [1.08, 1.44, .78, 1.575, 9.3]],
  [[2, 3, 5, 8, .95], [1, 2, 4, 8, .92], [2, 4, 5, 9, .984]],
  [[22.04, 40.78, 47], [18.06, 30.52, 69], [31.05, 60.3, 31]],
  [[66.7, 72.4, 16, 66.72, 72.32], [54.3, 61.8, 24, 54.48, 61.68], [82.1, 90.6, 25, 82.25, 90.5]],
  [[36.117, 40.13, 4.013], [25.614, 28.46, 2.846], [57.348, 63.72, 6.372]],
  [[4.83, 4.09, 5.15, 5.2], [4.72, 5.08, 5.31, 4.56], [5.42, 4.96, 4.61, 5.18]],
  [[.85], [.65], [1.15]],
  [[4, 3.78, 7.83, 16.2, 5, 9, 5.04], [6, 2.35, 7.15, 28.8, 4, 8, 10.8], [5, 4.26, 9.06, 24, 6, 8, 7]],
  [[2, 3, 4, 9, 2.34, 9, 9.43, 2, 4.455], [2, 5, 6, 8, 2.56, 8, 8.65, 2, 4.005], [2, 4, 6, 8, 2.46, 8, 8.64, 2, 4.0125]]
];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const hiddenEvidence = prompt => String(prompt).match(/<span hidden[^>]*data-source61-decimal-e1-kind="[^"]+"[^>]*><\/span>/)?.[0] || "";
const valuesOf = markup => (attr(markup, "data-values") || "").split(",").filter(Boolean).map(Number);
const close = (left, right) => Math.abs(Number(left) - Number(right)) < 1e-9;
const sameValues = (left, right) => left.length === right.length && left.every((value, index) => close(value, right[index]));
const fmt = value => Number(value).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
const permutations = values => {
  const output = [];
  const visit = (chosen, remaining) => {
    if (!remaining.length) return output.push(chosen);
    remaining.forEach((value, index) => visit([...chosen, value], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
  };
  visit([], values);
  return output;
};
const expectedAnswer = (variant, poolIndex, values) => {
  if (variant === 0) return ["1.2, 1.24, 0.71, 1.65, 7.08", "1.3, 1.35, 0.78, 1.82, 8.52", "1.08, 1.44, 0.78, 1.575, 9.3"][poolIndex];
  if (variant === 1) {
    const cards = values.slice(0, 4);
    const best = permutations(cards).map(order => Number(`${order[0]}.${order[1]}${order[2]}`) / order[3]).filter(value => value < 1).sort((a, b) => b - a)[0];
    return fmt(best);
  }
  if (variant === 2) {
    const [leftBase, rightBase] = values;
    const leftBaseHundredths = Math.round(leftBase * 100);
    const rightBaseHundredths = Math.round(rightBase * 100);
    let count = 0;
    for (let triangle = 0; triangle < 10; triangle += 1) {
      for (let square = 0; square < 10; square += 1) {
        if (2 * (leftBaseHundredths + square * 10) > rightBaseHundredths + triangle * 100) count += 1;
      }
    }
    return String(count);
  }
  if (variant === 3) {
    const [low, high, divisor] = values;
    const valid = [];
    for (let cents = Math.floor(low * 100) + 1; cents < Math.ceil(high * 100); cents += 1) if (cents % divisor === 0) valid.push(cents / 100);
    return `${valid[0].toFixed(2)}, ${valid.at(-1).toFixed(2)}`;
  }
  if (variant === 4) return Number(values[1]).toFixed(2);
  if (variant === 5) {
    const names = ["가", "나", "다", "라"];
    return values.map((value, index) => ({ name: names[index], distance: Math.abs(value - 5) })).sort((a, b) => a.distance - b.distance).map(item => item.name).join(", ");
  }
  if (variant === 6) return String(expectedPools[variant][poolIndex][0]);
  if (variant === 7) return fmt(values[3] / values[4] + values[3] / values[5]);
  const cards = values.slice(0, 4);
  const all = permutations(cards).map(order => ({ value: Number(`${order[0]}.${order[1]}${order[2]}`) / order[3], expression: `${order[0]}.${order[1]}${order[2]}÷${order[3]}` }));
  const min = all.reduce((best, item) => item.value < best.value ? item : best);
  const max = all.reduce((best, item) => item.value > best.value ? item : best);
  return fmt(max.value - min.value);
};

if (!api?.names?.includes(generatorKey)) fail("소수와 자연수의 나눗셈 전용 생성기가 등록되지 않았습니다.");
if (sourceIds.length !== 9 || expectedPools.some(pool => pool.length !== 3)) fail("9유형 또는 고정 pool 3개 계약이 다릅니다.");
const readinessById = new Map(readiness.items.map(item => [item.sourceItemId, item]));
sourceIds.forEach(sourceId => {
  const item = readinessById.get(sourceId);
  if (!item || item.implementationStatus !== "fixed-verified-pool" || item.publicDecision !== "confirmed" || item.releaseStatus !== "verified") fail(`${sourceId}: 원문 검토표의 공개 상태가 다릅니다.`);
});
["6-1-u3-e1-mission-3", "6-1-u3-e1-mission-4"].forEach(sourceId => {
  const item = readinessById.get(sourceId);
  if (!item || item.implementationStatus !== "review-locked" || item.publicDecision !== "locked" || item.releaseStatus !== "locked") fail(`${sourceId}: 그림 의존 문항의 잠금 상태가 다릅니다.`);
});
if (readiness.integrity.publicCandidateCount !== 10 || readiness.integrity.publicDecisionLockedCount !== 35 || readiness.integrity.releaseLockedCount !== 35) fail("6-1 3단원 원문 검토표의 공개·잠금 요약 수가 다릅니다.");

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seenPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seedIndex = 0; seedIndex < 200; seedIndex += 1) {
      const seed = 610300 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
      const generated = api.generate({ sourceItemId: sourceIds[variant] }, 0, difficulty, seed, variant);
      const evidence = hiddenEvidence(generated?.prompt);
      const values = valuesOf(evidence);
      const poolIndex = generated?.verifiedPoolIndex;
      const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
      if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기·원문 연결 누락`);
      if (generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 pool 계약 오류`);
      seenPools.add(poolIndex);
      if (attr(evidence, "data-source61-decimal-e1-kind") !== kinds[variant] || attr(evidence, "data-source-item") !== sourceIds[variant]) fail(`${label}: 검산 자료의 유형 연결 오류`);
      if (!sameValues(values, expectedPools[variant][poolIndex])) fail(`${label}: pool 자료가 원본 계약과 다름 (${values.join(",")} / ${expectedPools[variant][poolIndex].join(",")})`);
      if (String(generated.answer) !== expectedAnswer(variant, poolIndex, values)) fail(`${label}: 답 ${generated.answer} / 독립 계산 ${expectedAnswer(variant, poolIndex, values)}`);
      if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내 누락`);
      if (difficulty === 0 && generated.prompt.includes('data-step-evidence=')) fail(`${label}: 기준 단계에 추가 안내가 섞임`);
      if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움 안내 누락`);
      if (!generated.answerVisual?.includes(`<svg`) || !generated.answerVisual.includes("source61-e1-answer") || !generated.answerVisual.includes("data-result-highlight=")) fail(`${label}: 답 그림 또는 결과 표시 누락`);
      if (/undefined|null|NaN|Infinity|순열|조합|절댓값|일차식/.test(`${generated.prompt} ${generated.solution} ${generated.answerVisual}`)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
      if (/\b\d+\s*\/\s*\d+\b/.test(`${generated.prompt} ${generated.solution} ${generated.answerVisual}`)) fail(`${label}: 슬래시 분수 표기`);
      checked += 1;
    }
  }
  if (seenPools.size !== 3) fail(`${sourceIds[variant]}: 3개 pool이 모두 출현하지 않음 (${[...seenPools].join(",")})`);
}

const expectedAnswers = expectedPools.map((pool, variant) => pool.map((_, poolIndex) => expectedAnswer(variant, poolIndex, pool[poolIndex])));
console.log(`소수와 자연수의 나눗셈 E1 독립 감사: ${checked}회, 9유형×3난이도×200회, 각 pool 0·1·2 출현`);
console.log(`정답 기준: ${expectedAnswers.map((answers, index) => `${index}:${answers.join(" | ")}`).join(" / ")}`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: 고정 pool·전수 배치 확인·독립 계산·난이도 문구·답 그림·수식 표기·학년 언어 검사");
}
