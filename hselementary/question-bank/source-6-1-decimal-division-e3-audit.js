"use strict";

global.window = {};
require("./generators.js");
const api = window.HSE_GENERATORS;
const readiness = require("./source-inventory/6-1-u3-source-readiness-review.json");
const generatorKey = "sourceGrade6DecimalDivisionE3";
const sourceIds = [
  "6-1-u3-e3-exploration-1", "6-1-u3-e3-example-1", "6-1-u3-e3-example-2", "6-1-u3-e3-example-3",
  "6-1-u3-e3-example-4", "6-1-u3-e3-mission-1", "6-1-u3-e3-mission-2", "6-1-u3-e3-mission-3",
  "6-1-u3-e3-mission-4", "6-1-u3-e3-mission-5", "6-1-u3-e3-mission-6"
];
const kinds = [
  "round-fractions-thousandths", "decimal-digit-long-division", "terminating-tenth-addend", "rounded-and-truncated-quotient",
  "reduced-fraction-two-places", "hundredth-decimal-digit", "rounded-quotient-pair-range", "ratio-chain-reversal",
  "integer-quotient-range-gap", "terminating-thousandth-addend", "rounded-division-common-number"
];
const pools = [
  [[6, 7, 17, 21, 5, 9, 13], [5, 6, 13, 16, 3, 7, 11], [7, 9, 11, 15, 4, 5, 12]],
  [[4, 37, 3], [5, 31, 7], [6, 29, 4]],
  [[143, 33, 22], [127, 24, 2], [178, 45, 20]],
  [[7, 12, 8, 10.7], [9, 10, 6, 14.3], [6, 15, 7, 12.2]],
  [[32, 7, 25], [34, 9, 25], [36, 11, 25]],
  [[3, 8, 37], [4, 5, 27], [2, 11, 31]],
  [[13, 14, 6, 7], [16, 17, 5, 6], [21, 22, 8, 9]],
  [[7, 11, 12, 21], [3, 5, 6, 9], [5, 8, 12, 15]],
  [[19.6, 5, 47.52, 9, 90.08, 8, 102.2, 7], [24.5, 5, 59.4, 9, 90.08, 8, 119, 7], [24.5, 5, 59.4, 9, 92, 8, 108.5, 7]],
  [[149, 57, 55], [137, 45, 25], [181, 63, 62]],
  [[5, 7, 3, 12], [4, 11, 5, 9], [6, 6, 4, 9]]
];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const close = (a, b) => Math.abs(Number(a) - Number(b)) < 1e-8;
const fmt = value => Number(value).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
const fmt2 = value => Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
const round = (value, places) => Math.round((value + Number.EPSILON) * 10 ** places) / 10 ** places;
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return Math.abs(a); };
const isTerminatingFraction = (numerator, denominator) => { let d = denominator / gcd(numerator, denominator); while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };
const digitAt = (n, d, place) => { let remainder = n % d; let digit = 0; for (let i = 0; i < place; i += 1) { remainder *= 10; digit = Math.floor(remainder / d); remainder %= d; } return digit; };
const evidenceFrom = markup => {
  const match = String(markup).match(/<span hidden[^>]*data-source61-decimal-e3-kind="[^"]+"[^>]*><\/span>/);
  if (!match) return null;
  const span = match[0];
  return { kind: attr(span, "data-source61-decimal-e3-kind"), sourceItemId: attr(span, "data-source-item"), values: (attr(span, "data-values") || "").split(",").filter(Boolean).map(Number), difficulty: attr(span, "data-difficulty-design") };
};
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-decimal-e3-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const sameValues = (left, right) => left.length === right.length && left.every((value, index) => close(value, right[index]));
const answerFor = (variant, pool) => {
  if (variant === 0) return [round(pool[0] / pool[1], 3).toFixed(3), round(pool[2] / pool[3], 3).toFixed(3), round(pool[4] + pool[5] / pool[6], 3).toFixed(3)].join(", ");
  if (variant === 1) return String(digitAt(pool[0] * pool[1] + pool[2], pool[1], 48));
  if (variant === 2) { let m = 0; for (let tenth = 1; tenth <= pool[1] * 10; tenth += 1) if ((pool[0] * 10 + tenth) % pool[1] === 0) { m = tenth; break; } return (m / 10).toFixed(1); }
  if (variant === 3) { const aa = []; const bb = []; for (let a = 1; a <= 200; a += 1) if (Math.round(a / pool[0]) === pool[1]) aa.push(a); for (let b = 1; b <= 200; b += 1) if (Math.floor((b / pool[2]) * 10) / 10 === pool[3]) bb.push(b); return (Math.min(...aa) / Math.max(...bb)).toFixed(2); }
  if (variant === 4) { const sum = pool[0]; let answer = ""; for (let n = 1; n < sum / 2; n += 1) { const d = sum - n; const g = gcd(n, d); const reduced = d / g; if (100 % reduced === 0 && 10 % reduced !== 0) { if (answer) return "ambiguous"; answer = (n / d).toFixed(2); } } return answer; }
  if (variant === 5) return String(digitAt(pool[1], pool[2], 100));
  if (variant === 6) { const values = []; for (let a = pool[0]; a <= pool[1]; a += 1) for (let b = pool[2]; b <= pool[3]; b += 1) values.push(round(a / b, 2)); return fmt2(Math.max(...values) - Math.min(...values)); }
  if (variant === 7) { const numerator = pool[1] * pool[3], denominator = pool[0] * pool[2]; if (!isTerminatingFraction(numerator, denominator)) return "nonterminating"; return fmt2(numerator / denominator); }
  if (variant === 8) { const aLow = pool[0] / pool[1], aHigh = pool[2] / pool[3], bLow = pool[4] / pool[5], bHigh = pool[6] / pool[7]; const aa = [], bb = []; for (let a = Math.floor(aLow) + 1; a < aHigh; a += 1) aa.push(a); for (let b = Math.floor(bLow) + 1; b < bHigh; b += 1) bb.push(b); const numerator = Math.max(...bb) * Math.max(...aa) - Math.min(...bb) * Math.min(...aa), denominator = Math.min(...aa) * Math.max(...aa); if (!isTerminatingFraction(numerator, denominator)) return "nonterminating"; return fmt2(numerator / denominator); }
  if (variant === 9) { let m = 0; for (let milli = 1; milli <= pool[1] * 1000; milli += 1) if ((pool[0] * 1000 + milli) % pool[1] === 0) { m = milli; break; } return (m / 1000).toFixed(3); }
  const values = []; for (let n = 1; n <= 200; n += 1) if (Math.round(n / pool[0]) === pool[1] && Math.round(n / pool[2]) === pool[3]) values.push(n); return values.join(", ");
};

if (!api.names.includes(generatorKey)) fail("E3 생성기가 등록되지 않았습니다.");
for (const sourceId of sourceIds) {
  const item = readiness.items.find(entry => entry.sourceItemId === sourceId);
  if (!item || ![20, 21].includes(item.sourcePdfPage) || ![24, 25].includes(item.sourcePrintedPage)) fail(`${sourceId}: 6-1심화 원문 20-21쪽 연결이 아닙니다.`);
  if (api.generatorKey({ sourceItemId: sourceId, reviewLocked: false }) !== generatorKey) fail(`${sourceId}: 공개 라우팅이 없습니다.`);
}

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seen = new Set();
  for (const difficulty of [-1, 0, 1]) for (let seedIndex = 0; seedIndex < 200; seedIndex += 1) {
    const seed = 610330 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
    const generated = api.generate({ sourceItemId: sourceIds[variant], reviewLocked: false }, 0, difficulty, seed, variant);
    const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
    const ev = evidenceFrom(generated?.prompt); const answerEv = evidenceFrom(generated?.answerVisual); const problemSvg = svgFrom(generated?.prompt); const answerSvg = svgFrom(generated?.answerVisual); const poolIndex = generated?.verifiedPoolIndex;
    if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기 연결 오류`);
    if (generated?.generationMode !== "fixed-verified-pool" || generated?.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 3문항 고정 pool 계약 오류`);
    seen.add(poolIndex);
    const expected = pools[variant][poolIndex];
    if ((variant === 7 || variant === 8) && answerFor(variant, expected) === "nonterminating") fail(`${label}: 최종 답이 유한소수가 아닙니다.`);
    if (!ev || ev.kind !== kinds[variant] || ev.sourceItemId !== sourceIds[variant] || !answerEv || !sameValues(ev.values, answerEv.values)) fail(`${label}: 문제·답 자료 연결 오류`);
    if (!problemSvg || !answerSvg || attr(problemSvg, "data-source61-e3-structure") !== attr(answerSvg, "data-source61-e3-structure") || attr(problemSvg, "data-source61-e3-values") !== attr(answerSvg, "data-source61-e3-values") || !answerSvg.includes("data-result-highlight=")) fail(`${label}: 문제·답 SVG 자료 또는 결과 표시 오류`);
    if (variant === 0 && ev.values[0] === 6 && ev.values[1] === 7 && generated.answer !== "0.857, 0.810, 5.692") fail(`${label}: 원문 반올림 답 또는 0.810 표기가 다릅니다.`);
    if (variant === 2 && poolIndex === 0 && generated.answer !== "2.2") fail(`${label}: 143÷33 원문 정답은 2.2여야 합니다.`);
    if (variant === 3 && poolIndex === 0 && generated.answer !== "0.94") fail(`${label}: A=81, B=86 원문 정답은 0.94여야 합니다.`);
    if (variant === 3 && poolIndex === 1 && generated.answer !== "1.00") fail(`${label}: 소수 둘째 자리까지 나타낸 답은 1이 아니라 1.00이어야 합니다.`);
    if (variant === 4 && poolIndex === 0 && generated.answer !== "0.28") fail(`${label}: 7/25 원문 정답은 0.28이어야 합니다.`);
    if (variant === 5 && poolIndex === 0 && generated.answer !== "2") fail(`${label}: 100번째 소수 자리 원문 정답은 2여야 합니다.`);
    if (variant === 6 && poolIndex === 0 && generated.answer !== "0.47") fail(`${label}: A 13·14, B 6·7 원문 정답은 0.47이어야 합니다.`);
    if (variant === 7 && poolIndex === 0 && generated.answer !== "2.75") fail(`${label}: 비 관계 원문 정답은 2.75여야 합니다.`);
    if (variant === 8 && poolIndex === 0 && generated.answer !== "1.1") fail(`${label}: 범위 원문 정답은 1.1이어야 합니다.`);
    if (variant === 9 && poolIndex === 0 && generated.answer !== "0.055") fail(`${label}: 149에 더할 수 원문 정답은 0.055여야 합니다.`);
    if (variant === 10 && poolIndex === 0 && generated.answer !== "35, 36, 37") fail(`${label}: 공통 자연수 원문 정답은 35, 36, 37이어야 합니다.`);
    if (generated.answer !== answerFor(variant, expected)) fail(`${label}: 독립 계산 답 ${answerFor(variant, expected)} / 표시 답 ${generated.answer}`);
    if (difficulty === -1 && ev?.difficulty !== "guided") fail(`${label}: 안내 난이도 표기가 없습니다.`);
    if (difficulty === 0 && ev?.difficulty !== "source") fail(`${label}: 원문 난이도 표기가 없습니다.`);
    if (difficulty === 1 && ev?.difficulty !== "independent-reasoning") fail(`${label}: 스스로 생각하기 난이도 표기가 없습니다.`);
    const all = `${generated.prompt}\n${generated.answer}\n${generated.solution}\n${generated.answerVisual}`;
    const plain = all.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ");
    if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|일차식|절댓값/.test(plain)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
    if (/\b\d+\s*\/\s*\d+\b/.test(plain)) fail(`${label}: 슬래시 분수 표기`);
    if (generated.prompt.includes("data-result-highlight") || generated.prompt.includes("source61-e3-result") || generated.prompt.includes("조건을 만족하는 답 표시") || generated.prompt.includes("가능한 N →") || generated.prompt.includes("답 숫자 →")) fail(`${label}: 문제 화면에 답 결과 줄이 노출됨`);
    if (!String(generated.answerVisual).includes(`data-answer-source="${sourceIds[variant]}"`) || !String(generated.answerVisual).includes(`data-verified-pool-index="${poolIndex}"`)) fail(`${label}: 답 source/pool 표시 누락`);
    checked += 1;
  }
  if (seen.size !== 3) fail(`${sourceIds[variant]}: pool 0·1·2가 모두 나오지 않았습니다.`);
}

console.log(`6-1 소수의 나눗셈 개념탐구 3 수학 감사: ${checked}회, 11유형×3난이도×200회`);
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log("통과: 원문 정답·독립 계산·단일 답·문제/답 동일 자료·문제 답 누출 차단·난이도·학년 언어·3문항 고정 pool");
