"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const failures = [];
let checked = 0;
let context = "";
const check = (condition, message) => { if (!condition) failures.push(`${context}: ${message}`); };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const rational = (numerator, denominator = 1) => {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
};
const add = (left, right) => rational(left[0] * right[1] + right[0] * left[1], left[1] * right[1]);
const subtract = (left, right) => rational(left[0] * right[1] - right[0] * left[1], left[1] * right[1]);
const multiply = (left, right) => rational(left[0] * right[0], left[1] * right[1]);
const divide = (left, right) => rational(left[0] * right[1], left[1] * right[0]);
const fraction = value => value[1] === 1 ? String(value[0]) : `${value[0]}/${value[1]}`;
const attr = (markup, name) => markup.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const parseEvidence = prompt => {
  const markup = String(prompt).match(/<span hidden data-source61-fraction-e1-kind="[^"]+"[^>]*><\/span>/)?.[0];
  if (!markup) throw new Error("독립 검산 자료가 없습니다.");
  const values = (attr(markup, "data-values") || "").split(",").map(Number);
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error("독립 검산 값이 깨졌습니다.");
  return {
    kind: attr(markup, "data-source61-fraction-e1-kind"),
    sourceItemId: attr(markup, "data-source-item"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
};

function independentAnswer(evidence) {
  const v = evidence.values;
  if (evidence.kind === "patterned-fraction-sum") {
    const answer = divide(multiply(rational(v[0] / 2, v[0]), rational(v[1], v[2])), rational(v[3]));
    check(answer[0] === v[4] && answer[1] === v[5], "규칙 있는 분수 합의 저장 답이 독립 계산과 다릅니다.");
    return fraction(answer);
  }
  if (evidence.kind === "ratio-chain") {
    const answer = multiply(rational(v[0], v[1]), rational(v[2], v[3]));
    check(answer[0] === v[4] && answer[1] === v[5], "이어지는 비의 저장 답이 독립 계산과 다릅니다.");
    return `${answer[0]}:${answer[1]}`;
  }
  if (evidence.kind === "area-ratio-segment") {
    const answer = rational(2 * v[0], v[2] + 1);
    check(answer[0] === v[3] && answer[1] === v[4], "넓이 배수 도형의 저장 답이 독립 계산과 다릅니다.");
    return `${fraction(answer)}cm`;
  }
  if (evidence.kind === "symbol-ratios") {
    const answer = add(divide(rational(v[0], v[1]), rational(v[4])), multiply(rational(v[2], v[3]), rational(v[5])));
    check(answer[0] === v[6] && answer[1] === v[7], "네 자연수 조건식의 저장 답이 독립 계산과 다릅니다.");
    return fraction(answer);
  }
  if (evidence.kind === "largest-natural-blank") {
    const candidates = [];
    for (let hidden = 1; hidden < v[0]; hidden += 1) {
      const value = divide(multiply(rational(2 * v[0] + hidden, v[0]), rational(v[1])), rational(v[2]));
      if (value[1] === 1) candidates.push([hidden, value[0]]);
    }
    const largest = candidates.reduce((best, candidate) => candidate[1] > best[1] ? candidate : best);
    check(candidates.length === v[5] && largest[0] === v[3] && largest[1] === v[4], "빈칸 후보 전수 확인 결과가 저장 답과 다릅니다.");
    check(candidates.filter(candidate => candidate[1] === largest[1]).length === 1, "가장 큰 자연수를 만드는 빈칸이 하나가 아닙니다.");
    return String(largest[0]);
  }
  if (evidence.kind === "box-item-weight") {
    const item = divide(subtract(rational(v[4], v[5]), multiply(rational(v[2], v[3]), rational(v[1]))), rational(v[0] * v[1]));
    check(item[0] === v[6] && item[1] === v[7], "상자 속 물건 한 개 무게가 독립 계산과 다릅니다.");
    return `${fraction(item)}kg`;
  }
  if (evidence.kind === "sequence-threshold-count") {
    const valid = [];
    for (let n = 1; n <= 200; n += 1) if (n * v[0] > (n + 1) * (n + 2)) valid.push(n);
    check(valid.length === v[1] && v[2] === v[1] + 1, "기준보다 큰 계산식의 개수가 전수 확인과 다릅니다.");
    check(valid.every((value, index) => value === index + 1), "기준을 만족하는 항이 처음부터 이어지지 않습니다.");
    return `${valid.length}개`;
  }
  if (evidence.kind === "equal-products-order") {
    const names = ["가", "나", "다", "라"];
    const coefficients = [rational(v[0], v[1]), rational(v[2], v[3]), rational(v[4], v[5]), rational(v[6], v[7])];
    const order = names.map((name, index) => ({ name, coefficient: coefficients[index][0] / coefficients[index][1] }))
      .sort((left, right) => left.coefficient - right.coefficient).map(item => item.name);
    check(new Set(coefficients.map(value => fraction(value))).size === 4, "네 수에 곱한 분수가 서로 달라야 합니다.");
    check(order.every((name, index) => names.indexOf(name) === v[8 + index]), "큰 수부터의 차례가 저장 순서와 다릅니다.");
    return order.join(", ");
  }
  if (evidence.kind === "fruit-basket-weight") {
    const apple = divide(subtract(rational(v[5], v[6]), rational(v[7], v[8])), rational(v[2]));
    const peachTotal = subtract(subtract(rational(v[5], v[6]), rational(v[3], v[4])), multiply(apple, rational(v[0])));
    const peach = divide(peachTotal, rational(v[1]));
    check(peach[0] === v[9] && peach[1] === v[10], "복숭아 한 개 무게가 독립 계산과 다릅니다.");
    return `${fraction(peach)}kg`;
  }
  if (evidence.kind === "work-rate-date") {
    const togetherRate = divide(rational(v[1], v[2]), rational(v[0]));
    const firstRate = divide(subtract(rational(1), rational(v[1], v[2])), rational(v[3]));
    const secondRate = subtract(togetherRate, firstRate);
    const aloneDays = secondRate[1] / secondRate[0];
    const endDay = v[5] + aloneDays - 1;
    check(secondRate[0] === v[6] && secondRate[1] === v[7] && aloneDays === v[8] && endDay === v[9], "혼자 일하는 날 수와 끝나는 날짜가 독립 계산과 다릅니다.");
    check(Number.isInteger(aloneDays) && aloneDays > 0 && endDay <= 31, "날짜 답이 한 달 안의 자연수 날짜가 아닙니다.");
    return `${v[4]}월 ${endDay}일`;
  }
  throw new Error(`알 수 없는 검산 종류: ${evidence.kind}`);
}

const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-1");
const unit = semester?.units.find(item => item.id === "6-1-u1");
const group = unit?.subunits.find(item => item.id === "6-1-u1-source-e1");
const types = group?.types || [];
const ready = types.filter(type => !type.reviewLocked);
const locked = types.filter(type => type.reviewLocked);
context = "분류표";
check(types.length === 12, `첫째 탐구의 원문 유형이 12개가 아닙니다: ${types.length}`);
check(ready.length === 10 && locked.length === 2, `생성 가능 10개·설명형 잠금 2개가 아닙니다: ${ready.length}/${locked.length}`);
check(locked.every(type => type.sourceSection === "exploration" && !api.generatorKey(type)), "열린 설명형 두 문제가 잠기지 않았습니다.");
check(ready.every((type, index) => type.generatorKey === "sourceGrade6FractionDivisionE1" && type.variant === index && type.verifiedVariantCount === 3 && type.answerVisualStatus === "verified"), "10개 유형의 전용 생성기·분기·답 그림 3문항 연결이 다릅니다.");

const difficultyExpected = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
for (const type of ready) {
  for (const difficulty of [-1, 0, 1]) {
    const prompts = new Set();
    const poolIndexes = new Set();
    for (let seed = 1; seed <= 1000; seed += 1) {
      context = `${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), "문제·정답·풀이가 비었습니다.");
        check(generated?.generator === "sourceGrade6FractionDivisionE1", "전용 생성기를 사용하지 않았습니다.");
        check(generated?.generationMode === "fixed-verified-pool" && generated?.verifiedVariantCount === 3, "검증된 3문항 고정 묶음 표시가 없습니다.");
        check(Number.isInteger(generated?.verifiedPoolIndex) && generated.verifiedPoolIndex >= 0 && generated.verifiedPoolIndex < 3, "고정 묶음 번호가 0~2가 아닙니다.");
        check(generated?.sourceItemId === type.sourceItemId, "생성 결과의 원문 유형 ID가 다릅니다.");
        check(generated.prompt.includes("source61-math-board") || generated.prompt.includes("source61-area-ratio"), "문제의 시각 자료가 없습니다.");
        check(typeof generated.answerVisual === "string" && generated.answerVisual.includes("source61-answer-diagram") && generated.answerVisual.includes("source61-math-board"), "답 화면의 시각 자료가 없습니다.");
        check(generated.answerVisual.includes(`data-answer-source="${type.sourceItemId}"`) && generated.answerVisual.includes(`data-verified-pool-index="${generated.verifiedPoolIndex}"`), "답 그림의 유형·고정 묶음 연결이 다릅니다.");
        const evidence = parseEvidence(generated.prompt);
        check(evidence.sourceItemId === type.sourceItemId, "독립 검산 자료의 유형 ID가 다릅니다.");
        check(evidence.difficulty === difficultyExpected[String(difficulty)], "난이도별 풀이 부담 표시가 다릅니다.");
        if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), "쉬움 단계에 첫 풀이 순서가 없습니다.");
        if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), "원본 단계에 도움말이나 추가 부담이 섞였습니다.");
        if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), "어려움 단계에 스스로 관계를 고르는 부담이 없습니다.");
        const expected = independentAnswer(evidence);
        check(String(generated.answer) === expected, `표시 답 '${generated.answer}'이 독립 계산 '${expected}'과 다릅니다.`);
        check(!/undefined|null|NaN|Infinity|순열|조합|제곱근/.test(`${generated.prompt}\n${generated.answer}\n${generated.solution}\n${generated.answerVisual}`), "깨진 값 또는 학년 밖 표현이 있습니다.");
        if (type.variant === 2) {
          const problemSvg = generated.prompt.match(/<svg class="geometry-diagram source61-area-ratio"[\s\S]*?<\/svg>/)?.[0] || "";
          const answerSvg = generated.answerVisual.match(/<svg class="geometry-diagram source61-area-ratio"[\s\S]*?<\/svg>/)?.[0] || "";
          check(Boolean(problemSvg && answerSvg), "도형 문제가 문제와 답 양쪽에 그려지지 않았습니다.");
          check(problemSvg.includes('class="source61-target"') && answerSvg.includes('class="source61-target is-solved"'), "답 그림에서 구한 선분이 따로 표시되지 않았습니다.");
          check(attr(problemSvg, "data-width") === String(evidence.values[0]) && attr(problemSvg, "data-height") === String(evidence.values[1]) && attr(problemSvg, "data-area-multiple") === String(evidence.values[2]), "도형 좌표 모델의 조건이 계산 자료와 다릅니다.");
        }
        prompts.add(String(generated.prompt).replace(/<p class="question-step[\s\S]*?<\/p>/g, "").replace(/<span hidden[\s\S]*?<\/span>/g, ""));
        poolIndexes.add(generated.verifiedPoolIndex);
        checked += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
    check(prompts.size === 3, `검증된 세 문제만 나와야 하나 ${prompts.size}개가 나옵니다.`);
    check(poolIndexes.size === 3 && [0, 1, 2].every(index => poolIndexes.has(index)), "고정 묶음 3개가 모두 나오지 않습니다.");
  }
}

if (failures.length) {
  console.error(`6-1 1단원 첫째 탐구 독립 감사 실패: ${failures.length}건`);
  console.error(`확인 생성 수: ${checked.toLocaleString()}회 / 목표 30,000회`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`6-1 1단원 첫째 탐구 독립 감사 통과: 원문 12유형 · 생성 가능 10/열린 설명형 잠금 2 · ${checked.toLocaleString()}회 계산·단일 답·문제/답 그림·난이도 검사`);
