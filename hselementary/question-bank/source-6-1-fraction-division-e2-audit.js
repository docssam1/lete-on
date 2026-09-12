"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const failures = [];
let checked = 0;
const sourceIds = [
  "6-1-u1-e2-exploration-2", "6-1-u1-e2-example-1", "6-1-u1-e2-example-2", "6-1-u1-e2-example-3",
  "6-1-u1-e2-example-4", "6-1-u1-e2-mission-1", "6-1-u1-e2-mission-2", "6-1-u1-e2-mission-3",
  "6-1-u1-e2-mission-4", "6-1-u1-e2-mission-5", "6-1-u1-e2-mission-6"
];
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const rational = (numerator, denominator = 1) => {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
};
const add = (left, right) => rational(left[0] * right[1] + right[0] * left[1], left[1] * right[1]);
const subtract = (left, right) => rational(left[0] * right[1] - right[0] * left[1], left[1] * right[1]);
const multiply = (left, right) => rational(left[0] * right[0], left[1] * right[1]);
const divide = (left, right) => rational(left[0] * right[1], left[1] * right[0]);
const equal = (left, right) => left[0] === right[0] && left[1] === right[1];
const mixed = value => {
  const normalized = rational(value[0], value[1]);
  if (normalized[1] === 1) return String(normalized[0]);
  const whole = Math.floor(normalized[0] / normalized[1]);
  const remainder = normalized[0] % normalized[1];
  return whole ? `${whole} ${remainder}/${normalized[1]}` : `${remainder}/${normalized[1]}`;
};
const attr = (markup, name) => markup.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const evidence = prompt => {
  const match = String(prompt).match(/<span hidden data-source61-fraction-e2-kind="[^"]+"[^>]*><\/span>/);
  if (!match) throw new Error("독립 검산 자료가 없습니다.");
  const values = (attr(match[0], "data-values") || "").split(",").map(Number);
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error("독립 검산 값이 깨졌습니다.");
  return { kind: attr(match[0], "data-source61-fraction-e2-kind"), sourceItemId: attr(match[0], "data-source-item"), difficulty: attr(match[0], "data-difficulty-design"), values };
};
const independentAnswer = data => {
  const v = data.values;
  if (data.kind === "three-weight-relations") {
    const a = v[0], p = v[1], b = v[2], q = v[3], r = rational(v[4], v[5]);
    const c = divide(subtract(add(multiply(r, rational(a)), rational(p)), rational(q)), rational(b - a));
    const m = add(c, r);
    const w = add(multiply(rational(a), m), rational(p));
    if (!equal(w, add(multiply(rational(b), c), rational(q))) || !equal(rational(v[6], v[7]), c) || !equal(rational(v[8], v[9]), m) || !equal(rational(v[10], v[11]), w)) throw new Error("세 무게 관계를 독립 계산하지 못했습니다.");
    return `W=${mixed(w)}`;
  }
  if (data.kind === "five-vertical-rectangles-square") return mixed(multiply(rational(v[0], v[1]), rational(v[4], 3)));
  if (data.kind === "two-values-ratio-difference") {
    const a = rational(3 * v[0], 11), b = rational(14 * v[0], 11);
    if (!equal(a, rational(v[1], v[2])) || !equal(b, rational(v[3], v[4]))) throw new Error("두 수의 비와 차를 독립 계산하지 못했습니다.");
    return `가=${mixed(a)}, 나=${mixed(b)}`;
  }
  if (data.kind === "number-line-point-relations") {
    const g = rational(v[0], v[1]), r = rational(v[2], v[3]);
    const x = divide(subtract(r, g), rational(19, 3));
    const m = add(r, multiply(x, rational(6)));
    if (!equal(m, rational(v[8], v[9]))) throw new Error("수직선 점 관계를 독립 계산하지 못했습니다.");
    if (!(numberValue(g) < numberValue(add(g, x)) && numberValue(add(g, x)) < numberValue(add(add(g, x), multiply(x, rational(4, 3)))) && numberValue(r) < numberValue(m))) throw new Error("수직선 점 순서가 맞지 않습니다.");
    return mixed(m);
  }
  if (data.kind === "two-piles-transfer-equal") {
    const total = rational(v[0], v[1]);
    const forward = rational(v[2], v[3]);
    const backward = rational(v[4], v[5]);
    const spread = multiply(subtract(forward, backward), rational(2));
    const a = divide(add(total, spread), rational(2));
    const b = subtract(total, a);
    if (!equal(a, rational(v[6], v[7])) || !equal(b, rational(v[8], v[9]))) throw new Error("옮긴 뒤 두 물통의 양을 독립 계산하지 못했습니다.");
    const finalA = add(subtract(a, forward), backward), finalB = subtract(add(b, forward), backward);
    if (!equal(finalA, finalB)) throw new Error("두 물통의 이동 후 양이 같지 않습니다.");
    return `A=${mixed(a)}L, B=${mixed(b)}L`;
  }
  if (data.kind === "two-people-sum-difference") return mixed(divide(subtract(rational(v[0], v[1]), rational(v[2], v[3])), rational(2)));
  if (data.kind === "two-products-total-milk") {
    const m = v[0], n = v[1], p = rational(v[2], v[3]), total = rational(v[4], v[5]);
    const a = divide(subtract(total, multiply(rational(n), p)), rational(m - n));
    const b = subtract(p, a);
    if (!equal(a, rational(v[6], v[7])) || !equal(b, rational(v[8], v[9]))) throw new Error("두 아이스크림의 우유 양을 독립 계산하지 못했습니다.");
    return `A=${mixed(a)}L, B=${mixed(b)}L`;
  }
  if (data.kind === "equal-overlapping-triangle-area") {
    const totalBase = add(rational(v[0], v[1]), rational(v[2], v[3]));
    const height = divide(multiply(totalBase, rational(v[4], v[5])), rational(v[2], v[3]));
    if (!equal(height, rational(v[6], v[7]))) throw new Error("겹친 두 삼각형의 높이를 독립 계산하지 못했습니다.");
    return `${mixed(height)}cm`;
  }
  if (data.kind === "three-fractions-multiple-sum") {
    const b = rational(v[0], 10 * v[1]), a = multiply(b, rational(3)), c = multiply(a, rational(2));
    if (!equal(a, rational(v[2], v[3])) || !equal(b, rational(v[4], v[5])) || !equal(c, rational(v[6], v[7]))) throw new Error("세 분수의 배수 관계를 독립 계산하지 못했습니다.");
    return `가=${mixed(a)}, 나=${mixed(b)}, 다=${mixed(c)}`;
  }
  if (data.kind === "two-tape-double-gap-sum") {
    const total = rational(v[0], v[1]), gap = rational(v[2], v[3]);
    const j = divide(add(total, gap), rational(3));
    const s = subtract(total, j);
    if (!equal(s, rational(v[4], v[5])) || !equal(j, rational(v[6], v[7]))) throw new Error("두 테이프의 합과 관계를 독립 계산하지 못했습니다.");
    return `${mixed(s)}m`;
  }
  if (data.kind === "sequential-taps-fill-time") {
    const slowRate = rational(v[0], v[1]), slowOnlyMinutes = v[2], actualTotalMinutes = v[3], fastRate = rational(v[4], v[5]);
    const capacity = multiply(slowRate, rational(slowOnlyMinutes));
    const slowBaseline = multiply(slowRate, rational(actualTotalMinutes));
    const extraAmount = subtract(capacity, slowBaseline);
    const fastDuration = divide(extraAmount, subtract(fastRate, slowRate));
    const slowDuration = subtract(rational(actualTotalMinutes), fastDuration);
    const seconds = fastDuration[0] * 60 / fastDuration[1];
    if (!equal(capacity, rational(v[6], v[7])) || !equal(slowDuration, rational(v[8], v[9])) || !equal(fastDuration, rational(v[10], v[11])) || seconds !== v[12] || !Number.isInteger(seconds)) throw new Error("순차 수도꼭지의 시간을 독립 계산하지 못했습니다.");
    if (slowDuration[0] <= 0 || fastDuration[0] <= 0 || !equal(add(slowDuration, fastDuration), rational(actualTotalMinutes))) throw new Error("느린 구간과 빠른 구간의 시간이 성립하지 않습니다.");
    return `${Math.floor(seconds / 60)}분 ${seconds % 60}초`;
  }
  throw new Error(`알 수 없는 검산 종류: ${data.kind}`);
};
const numberValue = value => value[0] / value[1];
const difficultyExpected = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const typeFor = variant => ({ generatorKey: "sourceGrade6FractionDivisionE2", variant, sourceItemId: sourceIds[variant] });

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const pools = new Set();
  const answers = new Set();
  for (let difficulty of [-1, 0, 1]) {
    const prompts = new Map();
    for (let seed = 1; seed <= 1200; seed += 1) {
      const context = `${sourceIds[variant]} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate(typeFor(variant), 0, difficulty, seed, variant);
        const parsed = evidence(generated.prompt);
        if (parsed.sourceItemId !== sourceIds[variant]) throw new Error("원문 유형 ID가 다릅니다.");
        if (parsed.difficulty !== difficultyExpected[String(difficulty)]) throw new Error("난이도 안내 부담이 다릅니다.");
        if (generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || !Number.isInteger(generated.verifiedPoolIndex) || generated.verifiedPoolIndex < 0 || generated.verifiedPoolIndex > 2) throw new Error("고정 3문항 계약이 다릅니다.");
        if (generated.sourceItemId !== sourceIds[variant] || typeof generated.answerVisual !== "string" || !generated.answerVisual.includes("source61-answer-diagram")) throw new Error("답 그림 또는 원문 연결이 없습니다.");
        const expected = independentAnswer(parsed);
        if (generated.answer !== expected) throw new Error(`표시 답 ${generated.answer} / 독립 계산 ${expected}`);
        const visible = `${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`.replace(/<span hidden[\s\S]*?<\/span>/g, "");
        if (/undefined|null|NaN|Infinity|순열|조합|제곱근/.test(visible)) throw new Error("깨진 값 또는 학년 밖 표현이 있습니다.");
        if (/\b\d+\s*\/\s*\d+\b/.test(visible.replace(/<[^>]+>/g, " "))) throw new Error("공통 분수 표시를 거치지 않은 분수가 있습니다.");
        if (variant === 3) {
          if (!generated.prompt.includes('data-point-order="ㄱ,ㄴ,ㄷ,ㄹ,ㅁ"') || !generated.answerVisual.includes('data-target-point="ㅁ"') || !generated.answerVisual.includes("source61-e2-target-point is-solved") || !generated.prompt.includes("svg-measure-fraction") || !generated.answerVisual.includes("svg-measure-fraction")) throw new Error("수직선 점 순서·좌표·답 표시가 없습니다.");
        }
        if (variant === 2 && /\b[A-B]\b/.test(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)) throw new Error("가·나 대신 Latin 기호가 남아 있습니다.");
        if (variant === 8 && /\b[A-C]\b/.test(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)) throw new Error("가·나·다 대신 Latin 기호가 남아 있습니다.");
        if (variant === 4 && (!generated.prompt.includes("A 물통") || !generated.answerVisual.includes("marker-end") || !generated.answerVisual.includes(" L"))) throw new Error("두 물통·이동 화살표·L 단위 그림이 없습니다.");
        if (variant === 7 && (!generated.prompt.includes('data-base-segments="ㄴ-ㅁ;ㅁ-ㄷ"') || !generated.answerVisual.includes('data-target-segment="ㄹ-ㄷ"') || !generated.answerVisual.includes("source61-e2-target is-solved") || !["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ"].every(point => generated.prompt.includes(point) && generated.answerVisual.includes(point)))) throw new Error("겹친 두 삼각형의 공통 바닥·점·답 높이 강조가 없습니다.");
        pools.add(generated.verifiedPoolIndex);
        answers.add(generated.answer);
        prompts.set(generated.verifiedPoolIndex, generated.prompt.replace(/<p class="question-step[\s\S]*?<\/p>/g, "").replace(/<span hidden[\s\S]*?<\/span>/g, ""));
        checked += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
    if (prompts.size !== 3) failures.push(`${sourceIds[variant]} / 난이도 ${difficulty}: 고정 문항 ${prompts.size}개만 확인되었습니다.`);
  }
  if (pools.size !== 3) failures.push(`${sourceIds[variant]}: 전체 검수에서 고정 묶음 3개를 모두 확인하지 못했습니다.`);
  if (answers.size !== 3) failures.push(`${sourceIds[variant]}: 고정 묶음의 답이 서로 달라야 하나 ${answers.size}개입니다.`);
}

if (failures.length) {
  console.error(`6-1 1단원 개념탐구 2 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`6-1 1단원 개념탐구 2 감사 통과: 원문 11유형 · 검증 묶음 33문항 · ${checked.toLocaleString()}회 생성 · 독립 계산·단일 답·답 그림·난이도·도형 강조 검사`);
