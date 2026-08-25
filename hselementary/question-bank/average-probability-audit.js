"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2").units.find(item => item.id === "5-2-u6");
const types = unit.subunits.flatMap(subunit => subunit.types);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const frac = (n, d) => { const g = gcd(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; };
const factorial = n => Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
const choose = (n, r) => { r = Math.min(r, n - r); let x = 1; for (let i = 1; i <= r; i += 1) x = x * (n - r + i) / i; return x; };
const attr = (prompt, name) => { const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`)); if (!match) throw new Error(`data-${name} 없음`); return match[1]; };
const vals = prompt => attr(prompt, "values").split(",").filter(Boolean).map(Number);
const rounded = (value, places) => Number(value.toFixed(places)).toString();

function expected(generated) {
  const kind = attr(generated.prompt, "average-probability-kind");
  const v = vals(generated.prompt);
  if (kind === "plain-mean") return v.reduce((a, b) => a + b, 0) / v.length;
  if (kind === "missing-score") return 5 * v[0] - v.slice(1).reduce((a, b) => a + b, 0);
  if (kind === "replaced-value") {
    const [count, before, replacement, afterScale] = v;
    const candidates = Array.from({ length: 101 }, (_, old) => old).filter(old => Math.round((before + (replacement - old) / count) * 1000) === afterScale);
    if (candidates.length !== 1) throw new Error(`교체 전 수 후보 ${candidates.length}개`);
    return candidates[0];
  }
  if (kind === "frequency-missing" || kind === "weighted-frequency") {
    const scores = v.slice(0, 4), counts = v.slice(4, 8), hidden = v[8];
    const shownMean = Number(generated.prompt.match(/평균(?:이|은) ([0-9.]+)점/)[1]);
    const candidates = Array.from({ length: 30 }, (_, i) => i + 1).filter(candidate => {
      const next = [...counts]; next[hidden] = candidate;
      return rounded(next.reduce((sum, count, i) => sum + count * scores[i], 0) / next.reduce((a, b) => a + b, 0), 2) === String(shownMean);
    });
    if (candidates.length !== 1) throw new Error(`도수 빈칸 후보 ${candidates.length}개: ${candidates.join(",")}`);
    return candidates[0];
  }
  if (kind === "overlap-mean") return rounded((v[0] * v[1] + v[2] * v[3] - v[4] * v[5]) / (v[0] + v[2] - v[4]), 3);
  if (kind === "sequence-first") return v[2] / 10 - v[1] * (v[0] - 1) / 2;
  if (kind === "group-mean") {
    const [boys, boysMean, girls, totalMeanScale] = v;
    const candidates = Array.from({ length: 101 }, (_, value) => value).filter(value => Math.round((boys * boysMean + girls * value) / (boys + girls) * 100) === totalMeanScale);
    if (candidates.length !== 1) throw new Error(`집단 평균 후보 ${candidates.length}개`);
    return candidates[0];
  }
  if (kind === "shared-cost") return v[2] * v[0] * (v[0] + v[1]) / v[1];
  if (kind === "work-rate") return v[0] / (v[1] * v[2] + v[3] * v[4]);
  if (kind === "missing-harvest") return v[0] * v[1] - v.slice(2).reduce((a, b) => a + b, 0);
  if (kind === "daily-first") return v[2] / 10 - v[1] * (v[0] - 1) / 2;
  if (kind === "grid-via") return choose(v[2] + v[3], v[2]) * choose(v[0] - v[2] + v[1] - v[3], v[0] - v[2]);
  if (kind === "multiple-union") return Math.floor(v[0] / v[1]) + Math.floor(v[0] / v[2]) - Math.floor(v[0] / lcm(v[1], v[2]));
  if (kind === "adjacent-pair") return 2 * factorial(v[0] - 1);
  if (kind === "round-robin") return choose(v[0], 2);
  if (kind === "circle-segments-triangles") return choose(v[0], 2) + choose(v[0], 3);
  if (kind === "dice-difference") { let count = 0; for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) if (v.includes(Math.abs(a - b))) count += 1; return count; }
  if (kind === "different-colors") return frac(v[0] * v[3] + v[1] * v[2], (v[0] + v[1]) * (v[2] + v[3]));
  if (kind === "fixed-front") return frac(1, v[0]);
  if (kind === "at-least-hits") return frac(Array.from({ length: v[0] - v[1] + 1 }, (_, i) => choose(v[0], v[1] + i)).reduce((a, b) => a + b, 0), 2 ** v[0]);
  if (kind === "same-choice") return frac(v[1] ** v[0] - factorial(v[1]) / factorial(v[1] - v[0]), v[1] ** v[0]);
  if (kind === "at-least-one") return frac(v[1] * v[3] - (v[1] - v[0]) * (v[3] - v[2]), v[1] * v[3]);
  if (kind === "two-winners") return frac(choose(v[1], 2), choose(v[0], 2));
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 350; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    const answer = expected(generated);
    if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값");
    count += 1;
  } catch (error) { failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`); }
}
if (failures.length) {
  console.error(`평균과 가능성 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}
console.log(`평균과 가능성 감사 통과: ${types.length}유형, ${count}개 생성`);
