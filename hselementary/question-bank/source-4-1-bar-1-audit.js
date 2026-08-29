"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./generators.js");

const inventory = window.HSE_SOURCE_INVENTORY_41;
const api = window.HSE_GENERATORS;
const generatorKey = "source41BarGraphOne";
const sourceIds = [
  "4-1-u5-e1-exploration", "4-1-u5-e1-example-1-1", "4-1-u5-e1-example-1-2", "4-1-u5-e1-example-1-3", "4-1-u5-e1-example-1-4",
  "4-1-u5-e1-mission-1", "4-1-u5-e1-mission-2", "4-1-u5-e1-mission-3", "4-1-u5-e1-mission-4", "4-1-u5-e1-mission-5", "4-1-u5-e1-mission-6"
];
const sourceAnchors = [
  [15, 10, 20, 5], [30, 25, 40, 20, 35], [60, 80, 40, 50], [9, 2, 7, 7], [36, 48, 56, 24], [30, 60, 50, 40, 120], [12, 11, 5, 13, 8], [36, 30, 42, 24], [6, 7, 12, 1, 6], [16, 24, 18, 26, 22, 28], [5, 8, 4, 6, 9, 7]
];
const sourceFixtureGraphs = [
  [{ step: 5, max: 30, grid: 6, major: "0,10,20,30", visible: "3" }],
  [],
  [{ concealed: true, grid: 9, major: "0", visible: "0,1,2,3" }, { step: 5, max: 90, grid: 18, major: "0,25,50,75", visible: "" }],
  [{ step: 1, max: 10, grid: 10, major: "0,5,10", visible: "0,3" }],
  [{ step: 4, max: 60, grid: 15, major: "0,20,40,60", visible: "" }],
  [{ step: 10, max: 160, grid: 16, major: "0,50,100,150", visible: "0,4", horizontal: true }],
  [{ step: 1, max: 14, grid: 14, major: "0,5,10", visible: "0,2" }],
  [{ concealed: true, grid: 8, major: "0", visible: "0,1,2,3" }, { step: 2, max: 44, grid: 22, major: "0,10,20,30,40", visible: "" }],
  [{ step: 1, max: 14, grid: 14, major: "0,5,10", visible: "2,3" }],
  [{ step: 2, max: 30, grid: 15, major: "0,10,20,30", visible: "0,1,4,5" }],
  [{ step: 1, max: 10, grid: 10, major: "0,5,10", visible: "0,5" }]
];
const failures = [];
let checked = 0;
const attr = (markup, name) => markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const check = (condition, message) => { if (!condition) failures.push(message); };
const evidence = question => {
  const match = question.prompt.match(/<span hidden data-source41-kind="4-1-u5-e1-bar-graph" data-source41-payload="([^"]+)" data-source41-expected="([^"]+)"><\/span>/);
  if (!match) throw new Error("source41Evidence가 없습니다.");
  return { payload: JSON.parse(decodeURIComponent(match[1])), expected: decodeURIComponent(match[2]) };
};
const figures = html => [...html.matchAll(/<figure class="source41-bar-graph[^>]*>[\s\S]*?<\/figure>/g)].map(match => match[0]);
const bars = html => [...html.matchAll(/<rect class="source41-bar-column[^>]*>/g)].map(match => match[0]);
const vectorEquals = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);

function candidatesForCoin(data, level) {
  const solutions = [];
  for (let a = 0; a <= 12; a += 1) for (let b = 0; b <= 12; b += 1) for (let c = 0; c <= 12; c += 1) {
    const d = data.total - a - b - c;
    const candidate = [a, b, c, d];
    const hardRelation = level !== 2 || c - b === data.values[2] - data.values[1];
    if (d >= 0 && d <= 12 && a * 500 + b * 100 + c * 50 + d * 10 === data.amount && data.visible.every(index => candidate[index] === data.values[index]) && hardRelation) solutions.push(candidate);
  }
  return solutions;
}

function candidatesForDie(data, level) {
  const solutions = [];
  for (let one = 1; one <= 12; one += 1) {
    const two = one + 3;
    if (two > 12 || two % 2) continue;
    const three = two / 2;
    for (let four = 1; four <= 12; four += 1) for (let five = 1; five <= 12; five += 1) for (let six = 1; six <= 12; six += 1) {
      if (one + two + three + four + five + six !== data.total) continue;
      if (one + 2 * two + 3 * three + 4 * four + 5 * five + 6 * six !== data.sum) continue;
      const candidate = [one, two, three, four, five, six];
      const visibleMatch = data.visible.every(index => candidate[index] === data.values[index]);
      const hardRelationMatch = level !== 2 || (six - four === data.values[5] - data.values[3] && five - four === data.values[4] - data.values[3]);
      if (visibleMatch && hardRelationMatch) solutions.push(candidate);
    }
  }
  return solutions;
}

const steps = (start, end, step = 1) => Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, index) => start + index * step);
const visibleMatches = (candidate, data) => (data.visible || data.graphVisible || []).every(index => candidate[index] === data.values[index]);

function candidatesForVariant(variant, data, level) {
  const solutions = [];
  if (variant === 0) {
    const total = data.first.reduce((sum, value) => sum + value, 0);
    const knownFirst = level === 0 ? [0, 1, 3] : level === 1 ? [0, 1] : [0];
    for (const a of steps(10, 35, 5)) for (const b of steps(10, 35, 5)) for (const c of steps(10, 35, 5)) for (const d of steps(10, 35, 5)) {
      const first = [a, b, c, d];
      if (a + b + c + d !== total || !knownFirst.every(index => first[index] === data.first[index])) continue;
      const remaining = first.map(value => value - data.eaten);
      if (!data.visible.every(index => remaining[index] === data.values[index])) continue;
      if (level === 2 && c - d !== data.first[2] - data.first[3]) continue;
      solutions.push(remaining);
    }
    return solutions;
  }
  if (variant === 1) {
    const blank = level === 2 ? [1, 2] : [2];
    const known = data.values.map((_, index) => index).filter(index => !blank.includes(index));
    const secondValues = blank.length === 2 ? steps(5, 50, 5) : [0];
    for (const first of steps(5, 50, 5)) for (const second of secondValues) {
      const candidate = [...data.values];
      candidate[blank[0]] = first;
      if (blank.length === 2) candidate[blank[1]] = second;
      if (!known.every(index => candidate[index] === data.values[index])) continue;
      if (candidate.reduce((sum, value) => sum + value, 0) !== data.total) continue;
      if (level === 2 && candidate[2] - candidate[1] !== 10) continue;
      solutions.push(candidate);
    }
    return solutions;
  }
  if (variant === 2 || variant === 7) {
    const bases = level === 0 ? [data.base] : variant === 2 ? [2, 5, 10] : [2, 3, 4, 5, 6];
    for (const base of bases) for (const missingHeight of (level === 2 ? steps(1, (variant === 2 ? 90 : 48) / base) : [data.heights[2]])) {
      const heights = [...data.heights];
      if (level === 2) heights[2] = missingHeight;
      if (!data.visible.every(index => heights[index] === data.heights[index])) continue;
      if (level === 2 && heights[2] - heights[1] !== data.heights[2] - data.heights[1]) continue;
      const candidate = heights.map(height => height * base);
      if (candidate.reduce((sum, value) => sum + value, 0) === data.total) solutions.push(candidate);
    }
    return solutions;
  }
  if (variant === 3) return candidatesForCoin(data, level);
  if (variant === 4) {
    const total = data.values.reduce((sum, value) => sum + value, 0);
    for (const na of steps(4, 60, 4)) for (const la of steps(4, 60, 4)) {
      const ga = na * 3 / 4;
      const da = ga + data.gap;
      const candidate = [ga, na, da, la];
      if (!candidate.every(value => Number.isInteger(value) && value > 0 && value <= 60 && value % 4 === 0)) continue;
      if (level === 2 ? ga - la !== data.values[0] - data.values[3] : na !== la * 2) continue;
      if (candidate.reduce((sum, value) => sum + value, 0) !== total || !visibleMatches(candidate, data)) continue;
      solutions.push(candidate);
    }
    return solutions;
  }
  if (variant === 5) {
    const total = data.values.reduce((sum, value) => sum + value, 0);
    for (const thu of steps(10, 160, 10)) for (const fri of steps(10, 160, 10)) {
      const mon = data.values[0];
      const candidate = [mon, mon * 2, mon + 20, thu, fri];
      if (!visibleMatches(candidate, data) || candidate.reduce((sum, value) => sum + value, 0) !== total) continue;
      if (level === 2 && fri - thu !== data.values[4] - data.values[3]) continue;
      solutions.push(candidate);
    }
    return solutions;
  }
  if (variant === 6) {
    const tableBlanks = level === 0 ? [4] : [0, 2, 3];
    const known = new Set(data.values.map((_, index) => index).filter(index => !tableBlanks.includes(index)));
    data.graphVisible.forEach(index => known.add(index));
    const missing = data.values.map((_, index) => index).filter(index => !known.has(index));
    const candidate = [...data.values];
    const visit = position => {
      if (position === missing.length) {
        if (candidate.reduce((sum, value) => sum + value, 0) !== data.total) return;
        if (level === 2 && candidate[0] - candidate[2] !== data.values[0] - data.values[2]) return;
        solutions.push([...candidate]);
        return;
      }
      for (const value of steps(1, 14)) { candidate[missing[position]] = value; visit(position + 1); }
    };
    visit(0);
    return solutions;
  }
  if (variant === 8) {
    const total = data.values.reduce((sum, value) => sum + value, 0);
    for (const grape of steps(1, 14)) for (const tangerine of steps(1, 14)) for (const persimmon of steps(1, 14)) {
      const candidate = [grape, grape + 1, tangerine, persimmon, grape];
      if (!visibleMatches(candidate, data) || candidate.reduce((sum, value) => sum + value, 0) !== total) continue;
      if (level === 2 && candidate[1] - candidate[3] !== data.values[1] - data.values[3]) continue;
      solutions.push(candidate);
    }
    return solutions;
  }
  if (variant === 9) {
    for (const second of steps(4, 28, 2)) {
      const candidate = [data.values[0], second, second * 3 / 4, second * 3 / 4 + 8, data.values[4], data.values[5]];
      if (!candidate.every(Number.isInteger) || !visibleMatches(candidate, data)) continue;
      if (level === 2 && candidate[1] + candidate[2] + candidate[3] !== data.values[1] + data.values[2] + data.values[3]) continue;
      solutions.push(candidate);
    }
    return solutions;
  }
  return candidatesForDie(data, level);
}

function independentVector(variant, data, level) {
  const candidates = candidatesForVariant(variant, data, level);
  check(candidates.length === 1, `${variant}/${level}: 공개된 조건으로 가능한 답이 ${candidates.length}개입니다.`);
  return candidates[0];
}

function auditFigure(figure, question, data, expectComplete) {
  const vertical = attr(figure, "data-source41-graph-kind") !== "horizontal";
  const stepKnown = attr(figure, "data-source41-step-known") !== "false";
  const step = stepKnown ? Number(attr(figure, "data-source41-step")) : null;
  const max = stepKnown ? Number(attr(figure, "data-source41-scale-max")) : null;
  const gridCount = Number(attr(figure, "data-source41-grid-count"));
  const major = (attr(figure, "data-source41-major-ticks") || "").split(",").filter(Boolean).map(Number);
  const shown = (attr(figure, "data-source41-visible-indices") || "").split(",").filter(Boolean).map(Number);
  const complete = attr(figure, "data-source41-complete") === "true";
  const localBars = bars(figure);
  check(gridCount >= 1 && gridCount <= 24 && (!stepKnown || gridCount === max / step), "격자 칸 수가 눈금 설정과 다릅니다.");
  check(major.length <= 8 && (stepKnown ? major.every(value => value >= 0 && value <= max && value % step === 0) : major.every(value => value === 0)), "major tick 설정이 올바르지 않습니다.");
  check((figure.match(/class="source41-bar-grid"/g) || []).length >= gridCount + 1, "가로 또는 세로 격자선이 부족합니다.");
  if (vertical) check((figure.match(/source41-bar-grid-v/g) || []).length === data.labels.length + 1, "세로 범주 경계선이 labels.length+1개가 아닙니다.");
  else check((figure.match(/source41-bar-grid-h/g) || []).length === data.labels.length + 1, "가로 범주 경계선이 labels.length+1개가 아닙니다.");
  check((figure.match(/class="source41-bar-tick"/g) || []).length === major.length, "숫자 눈금 글자 수가 majorTicks와 다릅니다.");
  check((figure.match(/class="source41-bar-label/g) || []).length >= data.labels.length, "범주명이 부족합니다.");
  check(/source41-bar-unit/.test(figure) && /source41-bar-axis-name/.test(figure), "단위 또는 축 이름이 없습니다.");
  check(complete === expectComplete, "문제/풀이 그래프 완성 상태가 다릅니다.");
  check(localBars.length === (complete ? data.values.length : shown.length), "숨긴 막대가 문제 그래프에 남아 있습니다.");
  if (!stepKnown) {
    check(attr(figure, "data-source41-step") === undefined && attr(figure, "data-source41-scale-max") === undefined, "찾아야 하는 한 칸 값이 data 속성에 남아 있습니다.");
    check(!/한 칸은\s*\d/.test(figure), "찾아야 하는 한 칸 값이 접근성 설명에 남아 있습니다.");
  }
  for (const bar of localBars) {
    const index = Number(attr(bar, "data-source41-bar-index"));
    const value = stepKnown ? Number(attr(bar, "data-source41-bar-value")) : Number(attr(bar, "data-source41-bar-cells"));
    check(stepKnown ? data.values[index] === value && value % step === 0 : value === data.heights[index] && attr(bar, "data-source41-bar-value") === undefined, "막대 자료가 원자료 또는 눈금과 다릅니다.");
    if (vertical) {
      const top = Number(attr(figure, "data-source41-top")), baseline = Number(attr(figure, "data-source41-baseline")), height = Number(attr(figure, "data-source41-plot-height")), y = Number(attr(bar, "y"));
      const recoveredCells = Math.round((baseline - y) / height * gridCount);
      const recovered = stepKnown ? recoveredCells * step : recoveredCells;
      check(recovered === value, "세로 막대 y좌표를 역산한 값이 다릅니다.");
    } else {
      const left = Number(attr(figure, "data-source41-left")), width = Number(attr(figure, "data-source41-plot-width")), renderedWidth = Number(attr(bar, "width"));
      const recovered = Math.round(renderedWidth / width * max / step) * step;
      check(recovered === value, "가로 막대 x좌표를 역산한 값이 다릅니다.");
    }
  }
}

function auditSourceFixture(variant, question, data) {
  const promptFigures = figures(question.prompt), expected = sourceFixtureGraphs[variant];
  check(promptFigures.length === expected.length, `${variant}: 원문 고정 그래프 수가 다릅니다.`);
  expected.forEach((fixture, index) => {
    const figure = promptFigures[index] || "";
    check(Number(attr(figure, "data-source41-grid-count")) === fixture.grid, `${variant}: 원문 격자 칸 수가 다릅니다.`);
    check((attr(figure, "data-source41-major-ticks") || "") === fixture.major, `${variant}: 원문 숫자 눈금이 다릅니다.`);
    check((attr(figure, "data-source41-visible-indices") || "") === fixture.visible, `${variant}: 원문에서 보이는 막대 위치가 다릅니다.`);
    check((attr(figure, "data-source41-graph-kind") === "horizontal") === Boolean(fixture.horizontal), `${variant}: 원문 막대 방향이 다릅니다.`);
    if (fixture.concealed) check(attr(figure, "data-source41-step-known") === "false", `${variant}: 찾아야 하는 원래 한 칸 값이 숨겨지지 않았습니다.`);
    else check(Number(attr(figure, "data-source41-step")) === fixture.step && Number(attr(figure, "data-source41-scale-max")) === fixture.max, `${variant}: 원문 한 칸 값 또는 축 끝이 다릅니다.`);
  });
  if (variant === 0) check(vectorEquals(data.first, [20,15,25,10]) && (question.prompt.match(/>□</g) || []).length === 2, "0: 원문 표의 처음 수 또는 빈칸 수가 다릅니다.");
  if (variant === 1) check((question.prompt.match(/>□</g) || []).length === 1 && /세로 눈금은 적어도 몇 칸/.test(question.prompt), "1: 원문 표 빈칸 또는 질문이 다릅니다.");
  if (variant === 6) check((question.prompt.match(/>□</g) || []).length === 3, "6: 원문 표의 빈칸 수가 다릅니다.");
}

for (let variant = 0; variant <= 10; variant += 1) {
  const item = inventory.items.find(entry => entry.sourceItemId === sourceIds[variant]);
  check(item?.generatorKey === generatorKey && item.variant === variant && !item.reviewLocked, `${sourceIds[variant]}: 원문 목록 연결이 다릅니다.`);
  const fingerprints = new Set();
  const difficultyFingerprints = new Map();
  let sawAnchor = false;
  for (let difficulty = -1; difficulty <= 1; difficulty += 1) for (let seed = 1; seed <= 1000; seed += 1) {
    const question = api.generate({ generatorKey, variant }, 0, difficulty, seed, variant);
    const record = evidence(question), data = record.payload.data, level = record.payload.level, vector = independentVector(variant, data, level);
    checked += 1;
    check(question.generator === generatorKey && question.answer === record.expected, `${variant}/${difficulty}/${seed}: 생성기 또는 답 근거가 다릅니다.`);
    check(vectorEquals(vector, data.values), `${variant}/${difficulty}/${seed}: 독립 계산값이 다릅니다.`);
    check(!/undefined|NaN|Infinity/.test(question.prompt + question.answer + question.solution), `${variant}/${difficulty}/${seed}: 표시 오류가 있습니다.`);
    const promptFigures = figures(question.prompt), solutionFigures = figures(question.solution);
    if (variant === 1) {
      check(/source41-bar-table/.test(question.prompt) && !/<svg/.test(question.prompt), `${variant}/${difficulty}/${seed}: 표 완성형은 그래프 없이 표로 보여야 합니다.`);
    } else {
      check(promptFigures.length >= 1 && solutionFigures.length >= 1, `${variant}/${difficulty}/${seed}: 문제 또는 풀이 그래프가 없습니다.`);
      promptFigures.forEach(figure => auditFigure(figure, question, data, false));
      solutionFigures.forEach(figure => auditFigure(figure, question, data, true));
      const visibleIndices = (attr(promptFigures[promptFigures.length - 1], "data-source41-visible-indices") || "").split(",").filter(Boolean).map(Number);
      const visibleValues = bars(question.prompt).map(bar => Number(attr(bar, "data-source41-bar-value")));
      check(visibleValues.length === visibleIndices.length || variant === 2 || variant === 7, `${variant}/${difficulty}/${seed}: 문제의 빈 막대가 직접 값으로 남아 있습니다.`);
    }
    const fingerprint = `${difficulty}:${data.values.join(",")}:${data.visible || data.graphVisible || ""}:${question.prompt.replace(/<span hidden[\s\S]*?<\/span>/g, "")}`;
    fingerprints.add(fingerprint);
    if ([4, 5, 6, 8, 10].includes(variant)) {
      const visible = (data.visible || data.graphVisible || []).join(",");
      const extraCondition = variant === 4 ? question.prompt.includes("가와 라 마을의 학생 수 차")
        : variant === 5 ? question.prompt.includes("금요일은 목요일보다")
        : variant === 6 ? question.prompt.includes("과학책은 동화책보다")
        : variant === 8 ? question.prompt.includes("사과는 감보다")
        : question.prompt.includes("6의 눈은 4의 눈보다");
      difficultyFingerprints.set(difficulty, `${visible}|${extraCondition}`);
    }
    if (difficulty === 0 && vectorEquals(data.values, sourceAnchors[variant])) {
      if (!sawAnchor) auditSourceFixture(variant, question, data);
      sawAnchor = true;
    }
  }
  check(sawAnchor, `${sourceIds[variant]}: 1000개 기준 표본에 원문 고정값이 없습니다.`);
  check(fingerprints.size >= 48, `${sourceIds[variant]}: 난수화된 원문 구조가 48개보다 적습니다.`);
  if ([4, 5, 6, 8, 10].includes(variant)) {
    check(new Set(difficultyFingerprints.values()).size === 3, `${sourceIds[variant]}: 쉬움·기준·어려움의 보이는 값 또는 조건 수가 실제로 다르지 않습니다.`);
  }
}

if (failures.length) { console.error(`4-1 막대그래프 개념탐구 1 감사 실패: ${failures.length}건`); console.error(failures.slice(0, 30).join("\n")); process.exit(1); }
console.log(`4-1 막대그래프 개념탐구 1 감사 통과: 11유형 · ${checked.toLocaleString()}개 생성 · 원문 고정값·단일답·격자·좌표·빈 막대 검증 통과`);
