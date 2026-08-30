"use strict";

// 4-1 막대그래프 활용: 원문 7문항의 계산, 숨긴 막대, 눈금과 좌표를 따로 검산한다.
global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = window.HSE_SOURCE_INVENTORY_41;
const failures = [];
let checked = 0;
const generatorKey = "source41BarGraphTwo";
const sourceIds = [
  "4-1-u5-e2-exploration", "4-1-u5-e2-example-2-3", "4-1-u5-e2-mission-1",
  "4-1-u5-e2-mission-2", "4-1-u5-e2-mission-3", "4-1-u5-e2-mission-4", "4-1-u5-e2-mission-5"
];
const lockedIds = [
  "4-1-u5-e2-example-2-1", "4-1-u5-e2-example-2-2", "4-1-u5-e2-example-2-4", "4-1-u5-e2-mission-6"
];
const sourceFixtures = [
  { values: [1000, 700, 1200, 600], answer: "26" },
  { values: [55, 70, 60, 40], answer: "40000" },
  { values: [500, 600, 400, 300], answer: "12" },
  { values: [10, 13, 11, 9], answer: "13명" },
  { values: [20, 24, 28, 18], answer: "2000" },
  { values: [16, 20, 14, 10], answer: "10" },
  { first: [7, 9, 5, 10, 7], second: [8, 7, 9, 7, 6], answer: "5반 13명" }
];

const check = (condition, message) => { if (!condition) failures.push(message); };
const vectorEquals = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((value, index) => value === right[index]);
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const list = value => (value || "").split(",").filter(Boolean).map(Number);
const evidence = question => {
  const tag = question.prompt.match(/<span hidden data-source41-kind="4-1-u5-e2-bar-graph"[^>]*><\/span>/)?.[0];
  if (!tag) throw new Error("원문 활용형 검산 근거가 없습니다.");
  return {
    expected: decodeURIComponent(attr(tag, "data-source41-expected")),
    payload: JSON.parse(decodeURIComponent(attr(tag, "data-source41-payload")))
  };
};
const figures = text => text.match(/<figure class="source41-bar-graph[\s\S]*?<\/figure>/g) || [];
const rects = figure => figure.match(/<rect class="(?:source41-bar-column|source41-grouped-bar)[^"]*"[^>]*>/g) || [];

function independentAnswer(variant, level, data) {
  if (variant === 0) return String(level === 0 ? data.values[3] / 100 * data.per100 : level === 1 ? (data.values[3] + data.values[1]) / 100 * data.per100 : (Math.max(...data.values) - Math.min(...data.values)) / 100 * data.per100);
  if (variant === 1) return String((data.values[2] - (level === 2 ? data.remaining : 0)) / data.pack * data.price);
  if (variant === 2) return String(level === 0 ? data.farthest : (level === 2 ? data.farthest - data.nearest : data.farthest) / data.perDistance * data.perMinutes);
  if (variant === 3) {
    const pink = data.groups.reduce((sum, count, index) => sum + count * (index + 1), 0) - data.values[0] - data.values[2] - data.values[3];
    return level === 2 ? `${pink}명, ${pink + data.values[3]}명` : `${pink}명`;
  }
  if (variant === 4) return String(level === 0 ? data.values[3] : data.revenue / data.values[3] * data.buyCount);
  if (variant === 5) return String(Math.max(...data.values) - Math.min(...data.values));
  const totals = data.first.map((value, index) => value + data.second[index]);
  const smallest = Math.min(...totals), index = totals.indexOf(smallest);
  return `${index + 1}반 ${smallest}명`;
}

function auditFigure(figure, data, expectedComplete) {
  const kind = attr(figure, "data-source41-graph-kind");
  const complete = attr(figure, "data-source41-complete") === "true";
  const step = Number(attr(figure, "data-source41-step"));
  const scaleMax = Number(attr(figure, "data-source41-scale-max"));
  const gridCount = Number(attr(figure, "data-source41-grid-count"));
  const majorTicks = list(attr(figure, "data-source41-major-ticks"));
  const bars = rects(figure);
  check(complete === expectedComplete, "문제와 풀이의 완성 상태가 다릅니다.");
  check(Number.isInteger(gridCount) && gridCount >= 1 && gridCount <= 24 && gridCount === scaleMax / step, "눈금 칸 수가 1~24 범위를 벗어납니다.");
  check(majorTicks.length >= 2 && majorTicks.length <= 8 && majorTicks.every(value => value >= 0 && value <= scaleMax && value % step === 0), "숫자 눈금이 올바르지 않습니다.");
  check((figure.match(/class="source41-bar-grid"/g) || []).length >= gridCount + 1, "가로 격자선이 부족합니다.");
  check((figure.match(/class="source41-bar-tick"/g) || []).length === majorTicks.length, "숫자 눈금 글자가 빠졌습니다.");
  check((figure.match(/class="source41-bar-label"/g) || []).length >= data.labels.length, "범주명이 빠졌습니다.");
  check(/source41-bar-unit/.test(figure) && /source41-bar-axis-name/.test(figure), "단위 또는 축 이름이 없습니다.");
  const top = Number(attr(figure, "data-source41-top")), baseline = Number(attr(figure, "data-source41-baseline")), height = Number(attr(figure, "data-source41-plot-height"));
  for (const bar of bars) {
    const value = Number(attr(bar, "data-source41-bar-value"));
    check(value > 0 && value % step === 0, "빈 막대가 0 높이 막대로 그려졌거나 값이 눈금에 맞지 않습니다.");
    const y = Number(attr(bar, "y"));
    const recovered = Math.round((baseline - y) / height * gridCount) * step;
    check(recovered === value, "막대 y좌표를 역산한 값이 원자료와 다릅니다.");
    if (kind === "grouped") {
      const series = attr(bar, "data-source41-series"), index = Number(attr(bar, "data-source41-bar-index"));
      const expected = series === "first" ? data.first[index] : data.second[index];
      check(value === expected, "묶음 막대의 계열 또는 위치가 바뀌었습니다.");
      if (series === "second") check(/source41-grouped-stripe-/.test(bar), "둘째 계열의 무늬가 빠졌습니다.");
    } else {
      const index = Number(attr(bar, "data-source41-bar-index"));
      check(value === data.values[index], "세로 막대의 값이 원자료와 다릅니다.");
    }
  }
}

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const item = inventory.items.find(entry => entry.sourceItemId === sourceIds[variant]);
  check(item?.generatorKey === generatorKey && item.variant === variant && !item.reviewLocked, `${sourceIds[variant]}: 공개 생성기 연결이 다릅니다.`);
  let sawSourceFixture = false;
  const fingerprints = new Set();
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1000; seed += 1) {
    let question;
    try { question = api.generate({ generatorKey, variant }, 0, difficulty, seed, variant); } catch (error) { failures.push(`${variant}/${difficulty}/${seed}: ${error.message}`); continue; }
    const record = evidence(question), data = record.payload.data, level = record.payload.level;
    checked += 1;
    check(question.generator === generatorKey, `${variant}/${difficulty}/${seed}: 생성기 키가 다릅니다.`);
    check(String(question.answer) === record.expected, `${variant}/${difficulty}/${seed}: 화면 정답과 검산 근거가 다릅니다.`);
    check(independentAnswer(variant, level, data) === record.expected, `${variant}/${difficulty}/${seed}: 독립 계산 정답이 다릅니다.`);
    check(!/undefined|null|NaN|Infinity/.test(`${question.prompt}${question.answer}${question.solution}`), `${variant}/${difficulty}/${seed}: 표시 오류가 있습니다.`);
    if (variant === 0 && level === 1) check(data.travelMinutes === data.values[0] / 100 * data.per100 && new RegExp(`${data.values[0]}m를 ${data.travelMinutes}분`).test(question.prompt), `${variant}/${difficulty}/${seed}: 기준 학생의 거리와 이동 시간이 맞지 않습니다.`);
    if (variant === 1 && level === 2) check(/모두 \d+개를 준비했습니다/.test(question.prompt) && !/모두 \d+개를 팔았습니다/.test(question.prompt), `${variant}/${difficulty}/${seed}: 남은 빵 조건과 전체 수 문장이 충돌합니다.`);
    if (variant === 2 && level === 0) check(/거리를 구하세요/.test(question.prompt) && !/시간을 구하세요/.test(question.prompt), `${variant}/${difficulty}/${seed}: 쉬움 단계가 거리 판독을 넘었습니다.`);
    if (variant === 3 && level === 2) check(/분홍색을 가진 학생 수와 녹색을 가진 학생 수의 합/.test(question.prompt), `${variant}/${difficulty}/${seed}: 두 색을 함께 가진 학생으로 오해할 수 있습니다.`);
    if (variant === 3) check(!/학생 수을/.test(question.prompt), `${variant}/${difficulty}/${seed}: 목적격 조사가 잘못되었습니다.`);
    if (variant === 4 && level === 2) check(new RegExp(`오징어 ${data.buyCount}마리`).test(question.prompt), `${variant}/${difficulty}/${seed}: 어려움 단계의 추가 계산 조건이 없습니다.`);
    if (variant === 5 && level === 2) {
      const difference = data.values[0] - data.values[2];
      check(difference > 0 ? new RegExp(`${difference}명 많습니다`).test(question.prompt) : difference < 0 ? new RegExp(`${-difference}명 적습니다`).test(question.prompt) : /학생 수는 같습니다/.test(question.prompt), `${variant}/${difficulty}/${seed}: 만두와 떡볶이의 관계 문장이 실제 값과 다릅니다.`);
    }
    if (variant === 6) check(/다섯 반의 학생 수는 모두 합해/.test(question.prompt) && !/각 반의 학생 수는 모두/.test(question.prompt), `${variant}/${difficulty}/${seed}: 다섯 반 합계를 한 반의 학생 수로 오해할 수 있습니다.`);
    const promptFigures = figures(question.prompt), solutionFigures = figures(question.solution);
    check(promptFigures.length === 1 && solutionFigures.length === 1, `${variant}/${difficulty}/${seed}: 문제 또는 풀이 그래프 수가 다릅니다.`);
    promptFigures.forEach(figure => auditFigure(figure, data, false));
    solutionFigures.forEach(figure => auditFigure(figure, data, true));
    if (variant === 6) {
      const promptBars = rects(promptFigures[0] || "");
      const firstVisible = list(attr(promptFigures[0] || "", "data-source41-visible-first"));
      const secondVisible = list(attr(promptFigures[0] || "", "data-source41-visible-second"));
      check(promptBars.length === firstVisible.length + secondVisible.length, "묶음 막대의 빈 자리가 보입니다.");
      check(new Set(promptBars.map(bar => `${attr(bar, "data-source41-series")}:${attr(bar, "data-source41-bar-index")}`)).size === promptBars.length, "묶음 막대 위치가 겹칩니다.");
    } else {
      const shown = list(attr(promptFigures[0] || "", "data-source41-visible-indices"));
      check(rects(promptFigures[0] || "").length === shown.length, "숨긴 막대가 문제 그래프에 남았습니다.");
    }
    const fixture = sourceFixtures[variant];
    const matches = variant === 0 ? vectorEquals(data.values, fixture.values) && data.per100 === 2
      : variant === 1 ? vectorEquals(data.values, fixture.values) && data.total === 225 && data.price === 2000 && data.remaining === 0
        : variant === 2 ? vectorEquals(data.values, fixture.values) && data.perDistance === 250 && data.perMinutes === 5
          : variant === 3 ? vectorEquals(data.values, fixture.values) && vectorEquals(data.groups, [5, 3, 4, 5])
            : variant === 4 ? vectorEquals(data.values, fixture.values) && data.total === 90 && data.revenue === 36000
              : variant === 5 ? vectorEquals(data.values, fixture.values) && data.total === 60
                : vectorEquals(data.first, fixture.first) && vectorEquals(data.second, fixture.second) && data.total === 75;
    if (level === 1 && matches) {
      check(record.expected === fixture.answer, `${variant}: 원문 고정 정답이 다릅니다.`);
      sawSourceFixture = true;
    }
    fingerprints.add(`${difficulty}:${JSON.stringify(data.values || [data.first, data.second])}:${question.answer}`);
  }
  check(sawSourceFixture, `${sourceIds[variant]}: 1,000개 시드에서 원문 고정값이 나오지 않았습니다.`);
  check(fingerprints.size >= 40, `${sourceIds[variant]}: 난수화된 문항이 너무 적습니다.`);
}

for (const sourceItemId of lockedIds) {
  const item = inventory.items.find(entry => entry.sourceItemId === sourceItemId);
  check(item?.reviewLocked === true && !item.generatorKey, `${sourceItemId}: 검수 대기 항목이 공개 연결됐습니다.`);
  check(Boolean(item?.reviewLockReason), `${sourceItemId}: 검수 대기 사유가 없습니다.`);
}

if (failures.length) {
  console.error(`4-1 막대그래프 개념탐구 2 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}
console.log(`4-1 막대그래프 개념탐구 2 감사 통과: 공개 7유형 · 잠금 4유형 · ${checked.toLocaleString()}개 생성 · 단일답·눈금·좌표·빈 막대·묶음 막대 검증 통과`);
