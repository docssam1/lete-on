"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = vm.createContext({ window: {} });
const run = name => vm.runInContext(fs.readFileSync(path.join(__dirname, name), "utf8"), context, { filename: name });
run("source-inventory-grade6.js");
run("curriculum.js");
run("math-notation.js");
run("generators.js");
const { window } = context;
const catalog = window.HSE_SOURCE_INVENTORY_GRADE6.items;
const curriculumTypes = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units)
  .flatMap(unit => unit.subunits).flatMap(subunit => subunit.types);
const beforeCatalog = JSON.stringify(window.HSE_SOURCE_INVENTORY_GRADE6);
const beforeCurriculum = JSON.stringify(window.HSE_CURRICULUM);
const originalKey = window.HSE_GENERATORS.generatorKey;
const originalGenerate = window.HSE_GENERATORS.generate;
const beforeNames = [...window.HSE_GENERATORS.names];
const freeze = value => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
};
freeze(window.HSE_SOURCE_INVENTORY_GRADE6);
freeze(window.HSE_CURRICULUM);
run("source-6-2-decimal-e6-text.js");
const api = window.HSE_GENERATORS;

// Transcribed from the supplied page images. No answer or condition is taken from the raw inventory.
const originals = [
  { suffix: "example-4", label: "예제 6-4", page: 26, printedPage: 28,
    answer: "4명", handwriting: "4", handwritingStatus: "numeric-agreement",
    numbers: ["1500명", "0.05", "0.08", "1516명"],
    designs: ["last-gender-counts-given", "source-opposite-yearly-changes", "current-total-from-yearly-increase"], steps: [3, 8, 9] },
  { suffix: "mission-1", label: "Mission 1", page: 27, printedPage: 29,
    answer: "남학생 165명, 여학생 156명", handwriting: "165, 156명", handwritingStatus: "numeric-agreement",
    numbers: ["345명", "1.3배", "0.1배", "0.2배"],
    designs: ["last-gender-counts-given", "source-last-year-gender-ratio", "gender-ratio-from-relative-excess"], steps: [2, 5, 6] },
  { suffix: "mission-2", label: "Mission 2", page: 27, printedPage: 29,
    answer: "13.5m", handwriting: "13.5m", handwritingStatus: "agreement",
    numbers: ["0.3", "0.8배", "6.21m"],
    designs: ["both-whole-tape-shares-given", "source-nested-tape-share", "remainder-from-equal-pieces"], steps: [3, 4, 5] },
  { suffix: "mission-3", label: "Mission 3", page: 27, printedPage: 29,
    answer: "약 1.8배", handwriting: "1.8 (뒤 단위 필기는 확인 필요)", handwritingStatus: "numeric-agreement-unit-uncertain",
    numbers: ["51.4kg", "43.7kg", "38.5kg"],
    designs: ["dog-weight-given", "source-three-animal-pair-sums", "third-pair-from-pair-difference"], steps: [4, 6, 7],
    correction: "원본은 거북/원숭이. 거북 28.3kg, 원숭이 15.4kg -> 약 1.8배. 기존 개/거북 및 0.8은 원본과 불일치." },
  { suffix: "mission-4", label: "Mission 4", page: 27, printedPage: 29,
    answer: "5m", handwriting: "5m", handwritingStatus: "agreement",
    numbers: ["0.7", "0.4", "두 번째", "1.65m"],
    designs: ["first-bounce-difference", "source-second-bounce-difference", "third-bounce-difference"], steps: [2, 4, 6] },
  { suffix: "mission-5", label: "Mission 5", page: 27, printedPage: 29,
    answer: "2948.4m", handwriting: "회색 원 안은 294?m로 겹쳐 보여 확인 필요. 페이지 하단 빨간 필기는 2948.4로 읽힘.", handwritingStatus: "main-writing-uncertain-bottom-numeric-agreement",
    numbers: ["1.8m", "1.4m", "468번"],
    designs: ["front-revolutions-given", "source-wheel-revolution-difference", "second-leg-from-total-revolution-difference"], steps: [1, 4, 5] },
  { suffix: "mission-6", label: "Mission 6", page: 27, printedPage: 29,
    answer: "18명", handwriting: "18", handwritingStatus: "numeric-agreement",
    numbers: ["86.35점", "22명", "89.5점", "82.5점"],
    designs: ["boys-score-total-given", "source-weighted-class-average", "gender-count-difference-and-average-gap"], steps: [4, 5, 6] }
];
const keyFor = suffix => `sourceGrade6SecondDecimalDivisionE6${suffix === "example-4" ? "Example4" : `Mission${suffix.slice(-1)}`}Text`;
const idFor = suffix => `6-2-u2-e6-${suffix}`;
const S = 1000n;
const scaled = text => {
  assert.match(text, /^\d+(?:\.\d{1,3})?$/, `정확한 유한 소수: ${text}`);
  const [whole, part = ""] = text.split(".");
  return BigInt(whole) * S + BigInt(part.padEnd(3, "0"));
};
const shown = value => {
  const sign = value < 0n ? "-" : "";
  const absolute = value < 0n ? -value : value;
  const part = String(absolute % S).padStart(3, "0").replace(/0+$/, "");
  return `${sign}${absolute / S}${part ? `.${part}` : ""}`;
};
const match = (text, pattern) => {
  const result = text.match(pattern);
  assert(result, `학생 지문의 조건을 읽을 수 없음: ${pattern}\n${text}`);
  return result;
};
const exactDivide = (n, d) => {
  assert(d > 0n && n > 0n, "양수 나눗셈");
  assert.equal(n % d, 0n, "반올림 없이 정확히 나누어져야 함");
  return n / d;
};
const positive = (...values) => values.forEach(value => assert(value > 0n, "양의 수량"));
const one = values => {
  assert.equal(values.length, 1, "조건을 만족하는 양의 정수 인원은 유일해야 함");
  return values[0];
};

// Each solver reads the visible statement. It neither imports the module's pools nor uses its metadata as facts.
const solve = (suffix, prompt, level) => {
  if (suffix === "example-4") {
    const decrease = scaled(match(prompt, /남학생의 ([\d.]+)만큼이 줄고/)[1]);
    const increase = scaled(match(prompt, /여학생의 ([\d.]+)만큼이 늘었다/)[1]);
    assert(decrease > 0n && decrease < S && increase > 0n);
    let lastTotal, currentTotal, explicit;
    if (level === 0) {
      const counts = match(prompt, /남학생 (\d+)명, 여학생 (\d+)명이었다/);
      explicit = [BigInt(counts[1]), BigInt(counts[2])];
      lastTotal = explicit[0] + explicit[1];
    } else {
      lastTotal = BigInt(match(prompt, /합하여 (\d+)명이었다/)[1]);
      currentTotal = level === 1 ? BigInt(match(prompt, /모두 (\d+)명이 되었다/)[1])
        : lastTotal + BigInt(match(prompt, /올해 전체 학생 수는 작년보다 (\d+)명 늘었다/)[1]);
    }
    assert.equal(prompt.includes("올해 전체 학생 수는 작년보다"), level === 2);
    assert.equal(prompt.includes("모두"), level === 1);
    assert.equal(Boolean(explicit), level === 0);
    const candidates = [];
    for (let boys = 1n; boys < lastTotal; boys += 1n) {
      const girls = lastTotal - boys;
      const b = boys * (S - decrease), g = girls * (S + increase);
      if (b % S || g % S) continue;
      if (explicit ? boys !== explicit[0] || girls !== explicit[1] : b + g !== currentTotal * S) continue;
      candidates.push([boys, girls, b / S, g / S]);
    }
    const [boys, girls, b, g] = one(candidates);
    positive(boys, girls, b, g);
    assert.match(prompt, /올해 남학생과 여학생 수의 차/);
    const answer = `${b > g ? b - g : g - b}명`;
    return { answer, tableValues: [`${boys}명`, `${girls}명`, `${b}명`, `${g}명`, answer] };
  }
  if (suffix === "mission-1") {
    const increase = scaled(match(prompt, /남학생 수는 ([\d.]+)배만큼 늘었고/)[1]);
    const decrease = scaled(match(prompt, /여학생 수는 ([\d.]+)배만큼 줄었다/)[1]);
    assert(increase > 0n && decrease > 0n && decrease < S);
    let total, ratio, explicit;
    if (level === 0) {
      const counts = match(prompt, /작년 6학년 남학생은 (\d+)명, 여학생은 (\d+)명이었다/);
      explicit = [BigInt(counts[1]), BigInt(counts[2])];
      total = explicit[0] + explicit[1];
    } else {
      total = BigInt(match(prompt, /작년 6학년 학생은 (\d+)명/)[1]);
      ratio = level === 1 ? scaled(match(prompt, /여학생 수는 남학생 수의 ([\d.]+)배였다/)[1])
        : S + scaled(match(prompt, /여학생 수는 남학생 수보다 남학생 수의 ([\d.]+)배만큼 더 많았다/)[1]);
    }
    assert.equal(prompt.includes("더 많았다"), level === 2);
    assert.equal(prompt.includes("배였다"), level === 1);
    assert.equal(Boolean(explicit), level === 0);
    const candidates = [];
    for (let boys = 1n; boys < total; boys += 1n) {
      const girls = total - boys;
      if (explicit ? boys !== explicit[0] || girls !== explicit[1] : boys * ratio !== girls * S) continue;
      const b = boys * (S + increase), g = girls * (S - decrease);
      if (b % S || g % S) continue;
      candidates.push([boys, girls, b / S, g / S]);
    }
    const [boys, girls, b, g] = one(candidates);
    positive(boys, girls, b, g);
    assert.match(prompt, /올해 6학년 남학생과 여학생은 각각/);
    const answer = `남학생 ${b}명, 여학생 ${g}명`;
    return { answer, tableValues: [`${boys}명`, `${girls}명`, `${b}명`, `${g}명`, answer] };
  }
  if (suffix === "mission-2") {
    const firstShare = scaled(match(prompt, /혜진이는 전체의 ([\d.]+)을/)[1]);
    const secondShare = level === 0 ? scaled(match(prompt, /나영이는 전체의 ([\d.]+)를/)[1])
      : exactDivide(firstShare * scaled(match(prompt, /나영이는 혜진이가 가진 것의 ([\d.]+)배를/)[1]), S);
    const pieces = level === 2 ? BigInt(match(prompt, /길이가 같은 (\d+)조각으로/)[1]) : 1n;
    const remainder = scaled(match(prompt, level === 2 ? /한 조각의 길이가 ([\d.]+)m였다면/ : /승철이가 가진 색 테이프의 길이가 ([\d.]+)m라면/)[1]) * pieces;
    assert.equal(prompt.includes("조각"), level === 2);
    assert.equal(prompt.includes("나영이는 전체의"), level === 0);
    assert.match(prompt, /승철이는 혜진이와 나영이가 갖고 남은 나머지를 모두 가졌다/);
    assert.match(prompt, /처음에 있던 색 테이프의 길이/);
    const remainderShare = S - firstShare - secondShare;
    positive(firstShare, secondShare, remainderShare, remainder);
    const length = exactDivide(remainder * S, remainderShare);
    const first = exactDivide(length * firstShare, S), second = exactDivide(length * secondShare, S);
    assert.equal(first + second + remainder, length, "세 사람의 길이 합 역산");
    const answer = `${shown(length)}m`;
    return { answer, tableValues: [`${shown(first)}m`, `${shown(second)}m`, `${shown(remainder)}m`, answer] };
  }
  if (suffix === "mission-3") {
    assert.match(prompt, /거북의 무게는 원숭이의 무게의 약 몇 배/);
    assert.match(prompt, /반올림하여 소수 첫째 자리까지/);
    const dogTurtle = scaled(match(prompt, /개와 거북의 무게의 합은 ([\d.]+)kg/)[1]);
    const monkeyDog = level === 2 ? dogTurtle - scaled(match(prompt, /원숭이와 개의 무게의 합은 개와 거북의 무게의 합보다 ([\d.]+)kg 가볍다/)[1])
      : scaled(match(prompt, /원숭이와 개의 무게의 합은 ([\d.]+)kg/)[1]);
    let dog, turtle, monkey;
    if (level === 0) {
      dog = scaled(match(prompt, /개의 무게는 ([\d.]+)kg/)[1]);
      turtle = dogTurtle - dog;
      monkey = monkeyDog - dog;
    } else {
      const turtleMonkey = scaled(match(prompt, /거북과 원숭이의 무게의 합은 ([\d.]+)kg/)[1]);
      // An alternative inversion: find the total of all three, then subtract the opposite pair.
      const allAnimals = exactDivide(dogTurtle + turtleMonkey + monkeyDog, 2n);
      dog = allAnimals - turtleMonkey;
      turtle = allAnimals - monkeyDog;
      monkey = allAnimals - dogTurtle;
      assert.equal(turtle + monkey, turtleMonkey, "거북+원숭이 쌍 역산");
    }
    assert.equal(prompt.includes("가볍다"), level === 2);
    assert.equal(prompt.includes("개의 무게는"), level === 0);
    positive(dog, turtle, monkey);
    assert.equal(dog + turtle, dogTurtle);
    assert.equal(monkey + dog, monkeyDog);
    const ratioTenths = (20n * turtle + monkey) / (2n * monkey);
    assert((2n * ratioTenths - 1n) * monkey <= 20n * turtle);
    assert(20n * turtle < (2n * ratioTenths + 1n) * monkey, "단일 반올림 구간");
    const answer = `약 ${shown(ratioTenths * 100n)}배`;
    return { answer, tableValues: [`${shown(dog)}kg`, `${shown(turtle)}kg`, `${shown(monkey)}kg`, answer] };
  }
  if (suffix === "mission-4") {
    const highRate = scaled(match(prompt, /떨어뜨린 높이의 ([\d.]+)만큼/)[1]);
    const lowRate = scaled(match(prompt, /떨어진 높이의 ([\d.]+)만큼/)[1]);
    const ordinal = match(prompt, /(첫|두|세) 번째로 튀어 오르는 높이의 차가 ([\d.]+)m/);
    const times = { 첫: 1, 두: 2, 세: 3 }[ordinal[1]];
    assert.equal(times, level + 1, "매번 추가 반발을 추론하는 난이도");
    assert.match(prompt, /두 공을 같은 높이에서/);
    assert(highRate > lowRate && highRate < S && lowRate > 0n);
    const difference = scaled(ordinal[2]), exponent = BigInt(times);
    const height = exactDivide(difference * S ** exponent, highRate ** exponent - lowRate ** exponent);
    let high = height, low = height;
    for (let bounce = 0; bounce < times; bounce += 1) {
      high = exactDivide(high * highRate, S);
      low = exactDivide(low * lowRate, S);
    }
    positive(height, high, low);
    assert.equal(high - low, difference, "연속 반발 높이 역산");
    const answer = `${shown(height)}m`;
    return { answer, tableValues: [`${shown(high)}m`, `${shown(low)}m`, `${shown(difference)}m`, answer] };
  }
  if (suffix === "mission-5") {
    const circumferences = match(prompt, /앞바퀴의 둘레는 ([\d.]+)m, 뒷바퀴 둘레는 ([\d.]+)m/);
    const front = scaled(circumferences[1]), rear = scaled(circumferences[2]);
    assert(front > rear && rear > 0n);
    let frontTurns, rearTurns;
    if (level === 0) {
      frontTurns = BigInt(match(prompt, /앞바퀴가 (\d+)번 회전하였다/)[1]);
      rearTurns = exactDivide(front * frontTurns, rear);
    } else {
      let extra;
      if (level === 1) extra = BigInt(match(prompt, /뒷바퀴는 앞바퀴보다 (\d+)번 더 많이 회전하였다/)[1]);
      else {
        const totalExtra = BigInt(match(prompt, /전체에서 뒷바퀴는 앞바퀴보다 (\d+)번 더 많이 회전하였다/)[1]);
        const firstExtra = BigInt(match(prompt, /첫 구간에서는 뒷바퀴가 앞바퀴보다 (\d+)번 더 많이 회전하였다/)[1]);
        extra = totalExtra - firstExtra;
        const firstFront = exactDivide(firstExtra * rear, front - rear);
        assert.equal(firstFront * front, (firstFront + firstExtra) * rear, "첫 구간도 정수 회전수·동일 거리");
        const allFront = exactDivide(totalExtra * rear, front - rear);
        assert.equal(allFront * front, (allFront + totalExtra) * rear, "전체 구간 정수 회전수");
      }
      // Start with the extra rear-wheel distance and reverse to the common front-wheel count.
      frontTurns = exactDivide(extra * rear, front - rear);
      rearTurns = frontTurns + extra;
    }
    assert.equal(prompt.includes("두 구간"), level === 2);
    assert.equal(prompt.includes("앞바퀴가"), level === 0);
    if (level === 2) assert.match(prompt, /두 번째 구간에서 달린 거리/);
    positive(frontTurns, rearTurns);
    const distance = frontTurns * front;
    assert.equal(distance, rearTurns * rear, "양쪽 바퀴 모두 같은 거리, 양의 정수 회전수");
    const answer = `${shown(distance)}m`;
    return { answer, tableValues: [`${frontTurns}번`, `${rearTurns}번`, answer] };
  }
  if (suffix === "mission-6") {
    const overall = scaled(match(prompt, /전체 학생의 수학 시험 평균 점수는 ([\d.]+)점/)[1]);
    let femaleAverage;
    let boys, maleTotal, maleAverage, difference;
    if (level === 0) {
      femaleAverage = scaled(match(prompt, /여학생들의 평균 점수는 ([\d.]+)점/)[1]);
      const male = match(prompt, /남학생 (\d+)명의 점수의 합은 ([\d.]+)점/);
      boys = BigInt(male[1]); maleTotal = scaled(male[2]);
      assert(maleTotal > boys * overall);
    } else if (level === 1) {
      femaleAverage = scaled(match(prompt, /여학생들의 평균 점수는 ([\d.]+)점/)[1]);
      const male = match(prompt, /남학생 (\d+)명의 평균 점수는 ([\d.]+)점/);
      boys = BigInt(male[1]); maleAverage = scaled(male[2]);
      maleTotal = boys * maleAverage;
    } else {
      maleAverage = scaled(match(prompt, /남학생들의 평균 점수는 ([\d.]+)점/)[1]);
      const averageGap = scaled(match(prompt, /여학생들의 평균 점수는 남학생들의 평균 점수보다 ([\d.]+)점 낮다/)[1]);
      positive(averageGap);
      femaleAverage = maleAverage - averageGap;
      difference = BigInt(match(prompt, /남학생 수는 여학생 수보다 (\d+)명 더 많다/)[1]);
      positive(difference);
      assert.notEqual(2n * overall - maleAverage - femaleAverage, 0n, "일차식의 계수가 0이 아니므로 범위 밖 추가 해도 없음");
    }
    assert.equal(prompt.includes("점수의 합은"), level === 0);
    assert.equal(prompt.includes("더 많다"), level === 2);
    assert.equal(prompt.includes("점 낮다"), level === 2);
    assert(overall > femaleAverage && overall <= 100n * S && femaleAverage > 0n);
    if (maleAverage) assert(maleAverage > overall && maleAverage <= 100n * S);
    const candidates = [];
    for (let girls = 1n; girls <= 10000n; girls += 1n) {
      const b = level === 2 ? girls + difference : boys;
      const bTotal = level === 2 ? b * maleAverage : maleTotal;
      if (bTotal + girls * femaleAverage === (b + girls) * overall) candidates.push([b, girls, bTotal]);
    }
    const [b, g, bTotal] = one(candidates);
    positive(b, g, bTotal);
    assert(bTotal <= b * 100n * S, "점수 범위");
    const totalScore = bTotal + g * femaleAverage;
    assert.equal(totalScore, (b + g) * overall, "총점으로 평균 역산");
    const answer = `${g}명`;
    return { answer, tableValues: [`${b}명`, `${g}명`, `${b + g}명`, `${shown(totalScore)}점`, `${shown(overall)}점`, answer] };
  }
  throw new Error(`알 수 없는 원본 ID: ${suffix}`);
};

const verify = (source, item, level, variant) => {
  assert(item);
  const expected = solve(source.suffix, item.prompt, level);
  assert.equal(item.answer, expected.answer, "학생 지문에서 독립 계산한 답");
  assert.equal(item.sourceItemId, idFor(source.suffix));
  assert.equal(item.generator, keyFor(source.suffix));
  assert.equal(item.generationMode, "fixed-verified-pool");
  assert.equal(item.verifiedVariantCount, 3);
  assert.equal(item.verifiedVariantTarget, 3);
  assert.equal(item.verifiedPoolIndex, variant);
  assert.equal(item.verifiedVariantId, `${idFor(source.suffix)}:v${variant}`);
  assert.equal(item.difficultyDesign, source.designs[level]);
  assert.equal(item.reasoningSteps, source.steps[level]);
  assert.equal(item.variantProvenance, variant === 0 && level === 1 ? "source-values" : "source-structure-variant");
  assert.doesNotMatch(item.prompt, /<|>|정답|풀이|따라서|구해 보|먼저|힌트/, "텍스트 문제에 그림·표·도움말·숨긴 풀이 없음");
  assert.doesNotMatch(item.answerVisual, /<svg|<img|<canvas|math-board|<style/, "정답 표만 허용");
  assert.match(item.answerVisual, /<table class="problem-table source62-e6-text-answer-table" data-phase="answer">/);
  assert.match(item.answerVisual, /<th scope="col">항목<\/th>/);
  assert(item.answerVisual.includes(`data-answer-source="${idFor(source.suffix)}"`));
  assert(item.answerVisual.includes(`data-difficulty-design="${source.designs[level]}"`));
  const tableValues = [...item.answerVisual.matchAll(/<td>([^<]+)<\/td>/g)].map(found => found[1]);
  assert.deepEqual(tableValues, expected.tableValues, "풀이 표의 모든 중간 수량도 지문과 일치");
  assert.equal((item.answerVisual.match(/<table\b/g) || []).length, 1);
  if (source.suffix === "mission-3") {
    assert.match(item.solution, /의 몫을 반올림하여 소수 첫째 자리까지 나타내면 약/);
    assert.doesNotMatch(item.solution, /÷[\d.]+\s*=\s*[\d.]+배/, "반올림한 비를 정확한 등식으로 주장하지 않음");
  }
  for (const markup of [item.prompt, item.answer, item.solution]) {
    assert.doesNotMatch(markup, /NaN|Infinity|undefined/);
    const tokens = window.HSE_MATH_NOTATION.tokenize(markup);
    assert(tokens.length > 0 && window.HSE_MATH_NOTATION.spokenText(tokens), "기존 공용 수학 표기 경로 사용 가능");
  }
  return expected;
};

let checks = 0, gateChecks = 0, moduloChecks = 0, mutationChecks = 0;
const records = [];
for (const source of originals) {
  const sourceItemId = idFor(source.suffix), generatorKey = keyFor(source.suffix);
  const inventoryItem = catalog.find(item => item.sourceItemId === sourceItemId);
  const publicType = curriculumTypes.find(type => type.sourceItemId === sourceItemId);
  assert(inventoryItem && publicType, `${sourceItemId}: 원본 연결 필요`);
  // Explicit candidates do not change either locked inventory or the real public types.
  const candidate = Object.freeze({ ...publicType, sourceItemId, generatorKey, reviewLocked: false, variant: 0 });
  const locked = Object.freeze({ ...candidate, reviewLocked: true });
  assert.equal(api.generatorKey(locked), "");
  assert.equal(api.generate(locked, 0, 0, 1, 0), null);
  assert.equal(api.generatorKey({ ...locked, sourceItemId: undefined }), "");
  assert.equal(api.generate({ ...locked, sourceItemId: undefined }, 0, 0, 1, 0), null);
  gateChecks += 4;
  if (publicType.reviewLocked) {
    assert.equal(api.generatorKey(publicType), "");
    assert.equal(api.generate(publicType, 0, 0, 1, 0), null);
    gateChecks += 2;
  }
  assert.equal(api.generatorKey(candidate), generatorKey);
  assert(source.steps[0] < source.steps[1] && source.steps[1] < source.steps[2]);
  const allPrompts = new Set();
  for (const difficulty of [-1, 0, 1]) {
    const level = difficulty + 1, poolPrompts = new Set();
    for (let variant = 0; variant < 3; variant += 1) {
      const baseline = api.generate(candidate, 0, difficulty, 1, variant);
      for (const seed of [1, 41, 20261003]) {
        const item = api.generate(candidate, 0, difficulty, seed, variant);
        verify(source, item, level, variant);
        assert.deepEqual(item, baseline, "시드나 type.variant가 아니라 함수의 variant 인수가 풀 선택");
        checks += 1;
      }
      assert.deepEqual(api.generate({ ...candidate, variant: 2 }, 99, difficulty, 7, variant), baseline, "levelRank와 카탈로그의 variant는 고정 풀을 바꾸지 않음");
      for (const other of [variant + 3, variant + 300, variant - 3]) {
        assert.deepEqual(api.generate(candidate, 0, difficulty, 9, other), baseline, "variant modulo 3 순환");
        moduloChecks += 1;
      }
      assert.throws(() => verify(source, { ...baseline, answer: "틀린 답" }, level, variant), /학생 지문에서 독립 계산한 답/);
      assert.throws(() => verify(source, { ...baseline, prompt: baseline.prompt.replace(/\d/, "9") }, level, variant));
      mutationChecks += 2;
      poolPrompts.add(baseline.prompt); allPrompts.add(baseline.prompt);
    }
    assert.equal(poolPrompts.size, 3, "각 난이도의 유한 풀에 서로 다른 세 문항");
  }
  assert.equal(allPrompts.size, 9, "난이도는 메타데이터뿐 아니라 지문의 추론 구조를 변경함");
  const sourceItem = api.generate(candidate, 0, 0, 1, 0);
  assert.equal(sourceItem.answer, source.answer, "직접 읽은 원본 variant 0 답");
  source.numbers.forEach(number => assert(sourceItem.prompt.includes(number), `${sourceItemId}: 원본 수치·차수 ${number}`));
  if (source.suffix === "mission-3") {
    assert.match(sourceItem.prompt, /개와 거북의 무게의 합은 51\.4kg/);
    assert.match(sourceItem.prompt, /거북과 원숭이의 무게의 합은 43\.7kg/);
    assert.match(sourceItem.prompt, /원숭이와 개의 무게의 합은 38\.5kg/);
    assert(sourceItem.answerVisual.includes("28.3kg") && sourceItem.answerVisual.includes("15.4kg"));
  }
  assert.deepEqual(api.generate({ generatorKey, reviewLocked: false }, 0, 0, 7, 0), sourceItem, "명시적 생성기 키로도 후보 호출 가능");
  assert.throws(() => api.generate(candidate, 0, 0, 1, 0.5), /정수/);
  assert.throws(() => api.generate(candidate, 0, 2, 1, 0), /난이도/);
  records.push({ sourceItemId, generatorKey, originalLabel: source.label, pdfPage: source.page, printedPage: source.printedPage,
    independentAnswer: sourceItem.answer, answerEvidence: "independent-calculation-not-publisher-key",
    handwrittenReading: source.handwriting, handwritingStatus: source.handwritingStatus,
    publisherAnswerKeyVerified: false, ...(source.correction ? { correction: source.correction } : {}) });
}

assert.equal(JSON.stringify(window.HSE_SOURCE_INVENTORY_GRADE6), beforeCatalog, "모듈 import 후 카탈로그 변경 없음");
assert.equal(JSON.stringify(window.HSE_CURRICULUM), beforeCurriculum, "모듈 import 후 공개·잠금 변경 없음");
assert.deepEqual([...api.names], [...beforeNames, ...originals.map(source => keyFor(source.suffix))]);
const unrelated = Object.freeze({ sourceItemId: "6-2-u2-e6-example-2", name: "not-an-e6-text-item", reviewLocked: true });
assert.equal(api.generatorKey(unrelated), originalKey(unrelated));
assert.deepEqual(api.generate(unrelated, 0, 0, 7, 2), originalGenerate(unrelated, 0, 0, 7, 2), "기존 유형은 원래 API에 위임");

// A separate sentinel API proves argument forwarding without depending on unrelated generator behaviour.
const calls = [];
const sentinel = { window: { HSE_GENERATORS: {
  names: [], generatorKey: type => { calls.push(["key", type]); return "sentinel-key"; },
  generate: (...args) => { calls.push(["generate", ...args]); return "sentinel-result"; }
} } };
vm.createContext(sentinel);
vm.runInContext(fs.readFileSync(path.join(__dirname, "source-6-2-decimal-e6-text.js"), "utf8"), sentinel);
const otherType = { sourceItemId: "unrelated", generatorKey: keyFor("mission-3") };
assert.equal(sentinel.window.HSE_GENERATORS.generatorKey(otherType), "sentinel-key", "무관한 원본 ID를 동일 키로 가로채지 않음");
assert.equal(sentinel.window.HSE_GENERATORS.generate(otherType, 8, -1, 71, 2), "sentinel-result");
assert.deepEqual(calls, [["key", otherType], ["generate", otherType, 8, -1, 71, 2]]);

assert.equal(checks, 189);
assert.equal(moduloChecks, 189);
assert.equal(mutationChecks, 126);
console.log(`PASS: 7 text-only types / 63 distinct prompts / ${checks} exact statement checks / ${moduloChecks} modulo checks / ${mutationChecks} negative checks / ${gateChecks} lock checks`);
console.log("Catalog and curriculum unchanged; candidates only; no public unlock, publisher key, or browser-release claim.");
console.log(JSON.stringify(records, null, 2));
