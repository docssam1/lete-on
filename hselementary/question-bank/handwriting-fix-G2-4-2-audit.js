"use strict";

// 2026-11-28 손글씨·채점 답 대조(4-2 심화) 후 고친 유형 11개의 독립 검산.
// 각 유형을 세 난이도 × 여러 시드로 생성하고, 문제 문장에서 수를 다시 읽어 새 조건·새 답을 따로 계산해 맞춘다.
// 실행: node hselementary/question-bank/handwriting-fix-G2-4-2-audit.js

global.window = {};
require("./curriculum.js");
require("./generators.js");
require("./source-4-2-u4-b-original.js");

const api = window.HSE_GENERATORS;
const failures = [];
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };

const typeById = id => {
  for (const semester of window.HSE_CURRICULUM.semesters) for (const unit of semester.units) for (const subunit of unit.subunits) for (const type of subunit.types) if (type.id === id) return type;
  throw new Error(`${id} 유형이 없습니다.`);
};
const text = html => String(html).replace(/<span class="math-fraction"[^>]*><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g, "($1/$2)").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const fractions = html => [...String(html).matchAll(/<span class="math-fraction"[^>]*><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g)].map(match => [match[1], match[2]]);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const levels = [-1, 0, 1];
const seeds = Array.from({ length: 40 }, (_, index) => 9100 + index * 7919);

const each = (id, callback) => {
  const type = typeById(id);
  for (const difficulty of levels) for (const seed of seeds) {
    let output;
    try {
      output = api.generate(type, 3, difficulty, seed, type.variant);
    } catch (error) {
      failures.push(`${id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      continue;
    }
    if (!output) { failures.push(`${id}: 생성 결과가 없습니다.`); continue; }
    checked += 1;
    try {
      callback(output, `${id} / 난이도 ${difficulty} / 시드 ${seed}`, difficulty);
    } catch (error) {
      failures.push(`${id} / 난이도 ${difficulty} / 시드 ${seed}: 문장에서 조건을 읽지 못함(${error.message})`);
    }
  }
};

// 4-2-u1-t5-9: 수열 분수는 약분하지 않고 n/(a+(n-1)d) 그대로 보인다.
each("4-2-u1-t5-9", (output, context) => {
  const step = Number(text(output.prompt).match(/분모는 (\d+)씩/)[1]);
  const shown = fractions(output.prompt).slice(0, 4).map(([n, d]) => [Number(n), Number(d)]);
  check(shown.every(([n], index) => n === index + 1), `${context}: 분자가 1, 2, 3, 4가 아닙니다(약분됨).`);
  check(shown.every(([, d], index) => index === 0 || d - shown[index - 1][1] === step), `${context}: 분모가 ${step}씩 커지지 않습니다.`);
  const [missingIndex] = fractions(output.prompt)[4];
  const [, lastDenominator] = fractions(output.prompt)[5];
  const first = shown[0][1];
  const expected = `ㄱ=${first + (Number(missingIndex) - 1) * step}, ㄴ=${(Number(lastDenominator) - first) / step + 1}`;
  check(output.answer === expected, `${context}: 답 ${output.answer}, 독립 계산 ${expected}`);
});

// 4-2-u1-t6-2: 결과가 바깥 수보다 작아 중괄호·소괄호 값이 모두 양수이고 □가 식을 만족한다.
each("4-2-u1-t6-2", (output, context) => {
  const eq = output.prompt.match(/<div class="equation">([\s\S]*?)<\/div>/)[1];
  const parts = [...eq.matchAll(/<span class="math-mixed-number"[^>]*><span>(\d+)<\/span><span class="math-fraction"[^>]*><span>(\d+)<\/span><span>(\d+)<\/span><\/span><\/span>|<span class="math-fraction"[^>]*><span>(\d+)<\/span><span>(\d+)<\/span><\/span>|(?<![\d/])(\d+)(?![\d<])/g)].map(m => {
    if (m[1] !== undefined) return { n: Number(m[1]) * Number(m[3]) + Number(m[2]), d: Number(m[3]) };
    if (m[4] !== undefined) return { n: Number(m[4]), d: Number(m[5]) };
    return { n: Number(m[6]), d: 1 };
  });
  check(parts.length === 4, `${context}: 식의 수를 네 개 읽지 못했습니다(${parts.length}).`);
  if (parts.length !== 4) return;
  const d = parts.reduce((acc, p) => acc * p.d / gcd(acc, p.d), 1);
  const [outer, innerLeft, innerRight, right] = parts.map(p => p.n * d / p.d);
  const blank = outer - innerLeft + innerRight - right;
  check(right < outer, `${context}: 결과가 바깥 수보다 커서 중괄호 값이 음수입니다.`);
  check(innerRight - blank > 0 && innerLeft - (innerRight - blank) > 0 && blank > 0, `${context}: 괄호 안 값이 양수가 아닙니다.`);
  const answer = String(output.answer).match(/^(?:(\d+) )?(\d+)\/(\d+)$/);
  check(Boolean(answer), `${context}: 답 형식 ${output.answer}`);
  if (answer) {
    const value = (Number(answer[1] || 0) * Number(answer[3]) + Number(answer[2])) * d / Number(answer[3]);
    check(value === blank, `${context}: 답 ${output.answer}, 독립 계산 ${blank}/${d}`);
  }
});

// 4-2-u2-t3: 안쪽 이등변삼각형의 같은 변이 큰 삼각형보다 짧아야 안에 들어간다.
each("4-2-u2-t3", (output, context) => {
  const t = text(output.prompt);
  const base = Number(t.match(/밑변의 길이가 (\d+)cm/)[1]);
  const outer = Number(t.match(/큰 이등변삼각형의 둘레는 (\d+)cm/)[1]);
  const inner = Number(t.match(/안쪽 이등변삼각형의 둘레는 (\d+)cm/)[1]);
  const outerEqual = (outer - base) / 2;
  const innerEqual = (inner - base) / 2;
  check(inner < outer && innerEqual < outerEqual, `${context}: 안쪽 삼각형(둘레 ${inner})이 큰 삼각형(둘레 ${outer})보다 크거나 같습니다.`);
  check(innerEqual * 2 > base, `${context}: 안쪽 삼각형이 만들어지지 않습니다.`);
  check(Number(output.answer) === outer + inner - 2 * base, `${context}: 답 ${output.answer}`);
});

// 4-2-u3-t1: 기준 수를 소수 세 자리 그대로(1.8, 2, 2.7 등) 쓰고 그 기준으로 가까운 순서를 매긴다.
each("4-2-u3-t1", (output, context) => {
  const t = text(output.prompt);
  const targetText = t.match(/다음 소수들을 ([\d.]+)에 가까운/)[1];
  const target = Number(targetText);
  const items = [...t.matchAll(/([㉠㉡㉢㉣㉤㉥]) (\d\.\d{3})/g)].map(m => ({ label: m[1], value: Number(m[2]) }));
  check(target >= 1.8 && target <= 2.7, `${context}: 기준 수 ${targetText}가 소수 범위와 맞지 않습니다(예전 18.00 표기 오류).`);
  check(items.every(item => Math.abs(item.value - target) < 0.25), `${context}: 보기가 기준 수 근처에 있지 않습니다.`);
  const expected = items.map(item => ({ ...item, distance: Math.round(Math.abs(item.value - target) * 1000) })).sort((a, b) => a.distance - b.distance).map(item => item.label).join(", ");
  check(output.answer === expected, `${context}: 답 ${output.answer}, 독립 계산 ${expected}`);
  check(!/\d{2}\.00에/.test(t), `${context}: 기준 수가 18.00처럼 잘못 표기됨`);
});

// 4-2-u3-t1-6: 책처럼 같은 곳에서 출발해 반대 방향 → 거리 합이 둘레가 될 때 만남.
each("4-2-u3-t1-6", (output, context) => {
  const t = text(output.prompt);
  check(/같은 곳에서 두 사람이 동시에 출발해 서로 반대 방향/.test(t) && !/반대편에서/.test(t), `${context}: 출발 조건이 책(같은 곳에서 출발)과 다릅니다.`);
  const km = Number(t.match(/둘레가 (\d+)km/)[1]);
  const [a, b] = [...t.matchAll(/(\d\.\d{3})m/g)].map(m => Math.round(Number(m[1]) * 1000));
  const steps = km * 1000 * 1000 / (a + b);
  const expected = Number((steps * Math.abs(a - b) / 1000 / 1000).toFixed(6));
  check(Number(output.answer) === expected, `${context}: 답 ${output.answer}, 독립 계산 ${expected}`);
});

// 4-2-u3-t4-3, t4-4: 셋째 자리 숫자가 0인 수는 소수 세 자리 수가 아니므로 세지 않는다(책 37쪽 Mission 3 답 102와 같은 기준).
const rangeOf = t => [...t.matchAll(/(\d\.\d{3})보다/g)].map(m => Math.round(Number(m[1]) * 1000));
each("4-2-u3-t4-3", (output, context) => {
  const [lower, upper] = rangeOf(text(output.prompt));
  let count = 0;
  let zeroCount = 0;
  for (let value = lower + 1; value < upper; value += 1) {
    const d = String(value).split("").map(Number);
    if (d[1] > d[2]) { if (d[3] === 0) zeroCount += 1; else count += 1; }
  }
  check(Number(output.answer) === count, `${context}: 답 ${output.answer}, 셋째 자리 0 제외 독립 계산 ${count}(0 포함이면 ${count + zeroCount})`);
  check(/셋째 자리 숫자가 0인 수는 소수 세 자리 수가 아니므로/.test(output.solution || output.explanation || ""), `${context}: 풀이에 셋째 자리 0 제외 설명이 없습니다.`);
});
each("4-2-u3-t4-4", (output, context) => {
  const [lower, upper] = rangeOf(text(output.prompt));
  let count = 0;
  for (let value = lower + 1; value < upper; value += 1) {
    const d = String(value).split("").map(Number);
    if (d[3] !== 0 && d[1] === 2 * d[2] && new Set(d).size === 4) count += 1;
  }
  check(Number(output.answer) === count, `${context}: 답 ${output.answer}, 셋째 자리 0 제외 독립 계산 ${count}`);
});
{
  // 대조표의 기준 난이도 첫 문항 수치로 직접 확인: 2.051~2.388 → 54, 2.726~3.329 → 12, 책 Mission 3(2.15~2.4, 둘째>셋째) → 102.
  const countT43 = (lower, upper) => { let c = 0; for (let v = lower + 1; v < upper; v += 1) { const d = String(v).split("").map(Number); if (d[3] && d[1] > d[2]) c += 1; } return c; };
  const countT44 = (lower, upper) => { let c = 0; for (let v = lower + 1; v < upper; v += 1) { const d = String(v).split("").map(Number); if (d[3] && d[1] === 2 * d[2] && new Set(d).size === 4) c += 1; } return c; };
  const countBook = (lower, upper) => { let c = 0; for (let v = lower + 1; v < upper; v += 1) { const d = String(v).split("").map(Number); if (d[3] && d[2] > d[3]) c += 1; } return c; };
  check(countT43(2051, 2388) === 54, "4-2-u3-t4-3 대조 수치 2.051~2.388의 답이 54가 아닙니다.");
  check(countT44(2726, 3329) === 12, "4-2-u3-t4-4 대조 수치 2.726~3.329의 답이 12가 아닙니다.");
  check(countBook(2150, 2400) === 102, "책 Mission 3 기준(0 제외)이 102와 다릅니다.");
}

// 4-2-u4-t6-9: 책 조건(변 ㄱㄹ = 변 ㄹㄷ)으로 되돌림. ㉠ = 180 − 각 ㄱㅁㅂ − (각 ㄹㄷㄴ ÷ 2), 기준 문항 107°.
{
  // Node에서는 공개 등록표(source-lower-release-…)를 읽지 않으므로 고정 문항 묶음의 build를 직접 부른다. 브라우저에서는 같은 build가 쓰인다.
  const plugin = window.HSE_ORIG45_4_2_u4_b;
  check(plugin.ITEMS["4-2-u4-t6-9"].pool.length === 3, "4-2-u4-t6-9 고정 문항이 3개가 아닙니다.");
  const answers = [];
  for (let variant = 0; variant < 3; variant += 1) {
    const output = plugin.build("4-2-u4-t6-9", variant);
    const context = `4-2-u4-t6-9 / pool ${variant}`;
    checked += 1;
    const t = text(output.prompt);
    check(/변 ㄱㄹ과 변 ㄹㄷ의 길이가 같을 때/.test(t) && !/변 ㄱㄴ과 변 ㄹㄷ/.test(t), `${context}: 조건이 책(변 ㄱㄹ = 변 ㄹㄷ)과 다릅니다.`);
    const angles = [...t.matchAll(/(\d+)°/g)].map(m => Number(m[1]));
    const [top, bottom] = angles;
    const expected = 180 - top - bottom / 2;
    check(output.answer === `${expected}°`, `${context}: 답 ${output.answer}, 독립 계산 ${expected}°`);
    answers.push(output.answer);
    // 그림 좌표로 다시 확인: ㄱㄹ = ㄹㄷ, 각 ㄱㅁㅂ = top, 각 ㄹㄷㄴ = bottom, 각 ㅂㅅㅇ = 답.
    const polys = [...output.prompt.matchAll(/<polygon points=\\?"([^"\\]+)\\?"/g)].map(m => m[1].split(" ").map(p => p.split(",").map(Number)));
    const [[G, N, D, R], [M, B, S, O]] = polys;
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    const ang = (p, a, b) => { const u = [a[0] - p[0], a[1] - p[1]]; const v = [b[0] - p[0], b[1] - p[1]]; return Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI; };
    check(Math.abs(dist(G, R) - dist(R, D)) < 0.5, `${context}: 그림에서 변 ㄱㄹ과 변 ㄹㄷ의 길이가 다릅니다.`);
    check(Math.abs(ang(D, N, R) - bottom) < 0.5 && Math.abs(ang(M, G, B) - top) < 0.5 && Math.abs(ang(S, B, O) - expected) < 0.5, `${context}: 그림의 각이 조건·답과 맞지 않습니다.`);
  }
  check(answers[0] === "107°", `4-2-u4-t6-9 기준 문항 답이 책 답 107°가 아닙니다(${answers[0]}).`);
}

// 4-2-u5-t1-3: 책 규칙(0.5초당 2장 받고, 0.5초당 1장 잃음)으로 문장을 분명히 하고 답을 계산한다.
each("4-2-u5-t1-3", (output, context) => {
  const t = text(output.prompt);
  check(/줄어든 0\.5초마다 붙임딱지 2장/.test(t) && /늘어난 0\.5초마다 붙임딱지 1장/.test(t), `${context}: 0.5초당 규칙 문장이 아닙니다.`);
  const values = output.prompt.match(/data-chart-values="([^"]+)"/)[1].split(",").map(Number);
  const start = Number(t.match(/3월에 붙임딱지 (\d+)장/)[1]);
  let total = start;
  for (let index = 1; index < values.length; index += 1) {
    const half = Math.round(Math.abs(values[index] - values[index - 1]) * 2);
    total += values[index] < values[index - 1] ? 2 * half : -half;
  }
  check(Number(output.answer) === total, `${context}: 답 ${output.answer}, 독립 계산 ${total}`);
});

// 4-2-u5-t1-4: 꺾은선그래프 7~9월은 가리고(물음표), 7월은 막대그래프 나와 같은 값. 합과 차 조건으로만 9월을 구한다.
each("4-2-u5-t1-4", (output, context) => {
  const t = text(output.prompt);
  const lineSvg = output.prompt.match(/<svg class="line-chart"[^>]*>/)[0];
  const barSvg = output.prompt.match(/<svg class="bar-chart"[^>]*>/)?.[0] || "";
  const lineValues = lineSvg.match(/data-chart-values="([^"]+)"/)[1].split(",").map(Number);
  const hidden = lineSvg.match(/data-chart-hidden="([^"]*)"/)[1].split(",").filter(Boolean).map(Number);
  const barValues = output.prompt.match(/data-source42-bar="([^"]+)"/)[1].split(",").map(Number);
  check(hidden.join(",") === "2,3,4", `${context}: 7~9월이 가려지지 않았습니다(${hidden.join(",")}).`);
  check((output.prompt.match(/class="chart-question"/g) || []).length === 3, `${context}: 가린 달의 물음표가 3개가 아닙니다.`);
  check(Boolean(barSvg), `${context}: 막대그래프가 없습니다.`);
  check(barValues[1] === lineValues[2], `${context}: 막대그래프 나 7월(${barValues[1]})과 꺾은선 7월(${lineValues[2]})이 다릅니다.`);
  const total = Number(t.match(/합은 ([\d,]+)명/)[1].replace(/,/g, ""));
  const decrease = Number(t.match(/8월보다 ([\d,]+)명 줄었/)[1].replace(/,/g, ""));
  check(lineValues.reduce((sum, value) => sum + value, 0) === total, `${context}: 다섯 달 합이 그래프와 다릅니다.`);
  const ninth = (total - lineValues[0] - lineValues[1] - barValues[1] - decrease) / 2;
  check(Number(output.answer) === ninth && ninth === lineValues[4] && lineValues[3] - lineValues[4] === decrease, `${context}: 답 ${output.answer}, 독립 계산 ${ninth}`);
});

// 4-2-u5-t1-9: 느려진 날의 "다음 날" 연습이 늘어나므로 5일 연습에는 2~4일 기록만 반영된다.
each("4-2-u5-t1-9", (output, context) => {
  const values = output.prompt.match(/data-chart-values="([^"]+)"/)[1].split(",").map(Number);
  // d일 기록(values[d-1])이 전날보다 느리면 (d+1)일 연습이 1시간 늘어난다. 5일 연습에는 2~4일 기록만 반영.
  let practice = 2;
  for (let day = 2; day <= 4; day += 1) if (values[day - 1] > values[day - 2]) practice += 1;
  check(Number(output.answer) === practice, `${context}: 답 ${output.answer}, 독립 계산 ${practice}`);
  const sameDaySlow = values[4] > values[3];
  if (sameDaySlow) check(Number(output.answer) !== practice + 1, `${context}: 5일 기록을 5일 연습에 반영했습니다.`);
});

if (failures.length) {
  console.error(`4-2 손글씨 대조 수정(G2) 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}
console.log(`4-2 손글씨 대조 수정(G2) 감사 통과: 11유형, ${checked}개 생성 독립 검산`);
