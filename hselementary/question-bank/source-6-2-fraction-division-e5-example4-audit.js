"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e5-example-4";
const generatorKey = "sourceGrade6SecondFractionDivisionE5Example4";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const ledger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const ledgerItem = ledger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["1:5:4:7:7:8", { n: [[-36, 0], [24, 0], [4, 56]], d: [[76, 0], [104, 0], [88, 48]], areas: [1680, 672, 336, 384], answer: [5, 2] }],
  ["2:9:3:5:5:6", { n: [[-30, 0], [24, 0], [6, 60]], d: [[76, 0], [106, 0], [84, 48]], areas: [1620, 720, 360, 432], answer: [9, 4] }],
  ["1:4:3:8:4:3", { n: [[-24, 0], [24, 0], [12, 72]], d: [[76, 0], [108, 0], [97, 54]], areas: [1728, 864, 432, 324], answer: [2, 1] }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;

const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = markup => String(markup).replace(/<span\s+hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (left, right) => { let a = Math.abs(left); let b = Math.abs(right); while (b) [a, b] = [b, a % b]; return a || 1; };
const rational = (numerator, denominator = 1) => { const divisor = gcd(numerator, denominator); return { numerator: numerator / divisor, denominator: denominator / divisor }; };
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);
const same = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;
const cross = (origin, first, second) => (first[0] - origin[0]) * (second[1] - origin[1]) - (first[1] - origin[1]) * (second[0] - origin[0]);
const signedArea = polygon => polygon.reduce((sum, point, index) => sum + point[0] * polygon[(index + 1) % polygon.length][1] - point[1] * polygon[(index + 1) % polygon.length][0], 0) / 2;
const area = polygon => Math.abs(signedArea(polygon));
const clip = (subject, boundary) => {
  const sign = signedArea(boundary) >= 0 ? 1 : -1;
  const inside = (point, first, second) => sign * cross(first, second, point) >= -1e-9;
  const crossing = (start, end, first, second) => {
    const dx = end[0] - start[0], dy = end[1] - start[1], ex = second[0] - first[0], ey = second[1] - first[1];
    const denominator = dx * ey - dy * ex;
    if (Math.abs(denominator) < 1e-9) return [end[0], end[1]];
    const t = ((first[0] - start[0]) * ey - (first[1] - start[1]) * ex) / denominator;
    return [start[0] + t * dx, start[1] + t * dy];
  };
  return boundary.reduce((output, first, index) => {
    const second = boundary[(index + 1) % boundary.length];
    if (!output.length) return [];
    const next = [];
    output.forEach((point, pointIndex) => {
      const previous = output[(pointIndex + output.length - 1) % output.length];
      const pointInside = inside(point, first, second), previousInside = inside(previous, first, second);
      if (pointInside && !previousInside) next.push(crossing(previous, point, first, second));
      if (pointInside) next.push(point);
      if (!pointInside && previousInside) next.push(crossing(previous, point, first, second));
    });
    return next;
  }, subject.map(point => [...point]));
};
const distinct = polygon => polygon.filter((point, index) => !polygon.slice(0, index).some(other => Math.hypot(point[0] - other[0], point[1] - other[1]) < 1e-7));

function parse(markup) {
  const evidence = String(markup).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e5-example4-kind="three-overlapping-triangles-area-ratio"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(evidence, "data-values").split(":").map(Number);
  check(Boolean(evidence) && values.length === 30 && values.every(Number.isFinite), "예제 5-4 독립 검산 자료가 없습니다.");
  return { source: attr(evidence, "data-source-item"), kind: attr(evidence, "data-source62-fraction-e5-example4-kind"), contract: attr(evidence, "data-result-contract"), candidates: Number(attr(evidence, "data-candidate-count")), candidateRatios: attr(evidence, "data-candidate-ratios"), difficulty: attr(evidence, "data-difficulty-design"), values };
}

function enumerateCandidateRatios(p, q, r) {
  const found = new Map();
  for (let n = 1; n <= 80; n += 1) for (let d = 1; d <= 80; d += 1) {
    const a = multiply(p, rational(n, 1));
    const b = multiply(q, rational(d, 1));
    if (!same(a, multiply(r, b))) continue;
    const ratio = rational(n, d);
    found.set(`${ratio.numerator}:${ratio.denominator}`, ratio);
  }
  return [...found.values()];
}

const classCount = (markup, className) => [...String(markup).matchAll(/class="([^"]*)"/g)].filter(match => match[1].split(/\s+/).includes(className)).length;

function independentlyCalculate(values) {
  const [pN, pD, qN, qD, rN, rD, ...coordinates] = values.slice(0, 24);
  const g = [[coordinates[0], coordinates[1]], [coordinates[2], coordinates[3]], [coordinates[4], coordinates[5]]];
  const n = [[coordinates[6], coordinates[7]], [coordinates[8], coordinates[9]], [coordinates[10], coordinates[11]]];
  const d = [[coordinates[12], coordinates[13]], [coordinates[14], coordinates[15]], [coordinates[16], coordinates[17]]];
  const p = rational(pN, pD), q = rational(qN, qD), r = rational(rN, rD);
  const a = distinct(clip(g, n)), b = distinct(clip(g, d));
  const areas = [area(n), area(d), area(a), area(b)];
  const answer = divide(multiply(r, q), p);
  return { key: [pN, pD, qN, qD, rN, rD].join(":"), p, q, r, g, n, d, a, b, areas, answer, nOverlapD: area(clip(n, d)), aOverlapB: area(clip(a, b)) };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked && type.verifiedVariantCount === 3, "예제 5-4 공개 원장이 전용 생성기·고정 3문항에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "예제 5-4 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 47 && readiness.integrity.lockedCount === 19, "6-2 1단원 검토표의 공개 47개·잠금 19개 요약이 다릅니다.");
check(readinessItem?.sourceVerified === true && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-positive-area-ratio", "예제 5-4 검토표의 원문·단일 답·공개 상태가 완결되지 않았습니다.");
check(ledgerItem?.sourceVerified === true && ledgerItem?.implementationStatus === "fixed-verified-pool" && ledgerItem?.answerContract === "single-positive-area-ratio" && ledgerItem?.publicSourceItemId === sourceItemId, "예제 5-4 원자료 장부의 공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parse(generated.prompt);
  const calculated = independentlyCalculate(evidence.values);
  const candidateRatios = enumerateCandidateRatios(calculated.p, calculated.q, calculated.r);
  const row = expected.get(calculated.key);
  const promptSvg = String(generated.prompt).match(/<svg\s+class="geometry-diagram source62-overlap-triangles"[\s\S]*?<\/svg>/)?.[0] || "";
  const answerSvg = String(generated.answerVisual).match(/<svg\s+class="geometry-diagram source62-overlap-triangles is-solved"[\s\S]*?<\/svg>/)?.[0] || "";
  const promptText = visibleText(generated.prompt), answerText = visibleText(generated.answerVisual);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3 && evidence.kind === "three-overlapping-triangles-area-ratio" && evidence.contract === "single-positive-area-ratio" && evidence.candidates === 1 && candidateRatios.length === 1 && same(candidateRatios[0], calculated.answer) && evidence.candidateRatios === `${calculated.answer.numerator}:${calculated.answer.denominator}` && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 고정 풀·난이도·전수 탐색 단일 답 계약이 다릅니다.`);
  check(Boolean(row) && calculated.a.length === 3 && calculated.b.length === 3 && calculated.areas.join(":") === row?.areas.join(":") && calculated.nOverlapD < 1e-8 && calculated.aOverlapB < 1e-8 && same(rational(calculated.areas[2], calculated.areas[0]), calculated.p) && same(rational(calculated.areas[3], calculated.areas[1]), calculated.q) && same(rational(calculated.areas[2], calculated.areas[3]), calculated.r) && same(calculated.answer, rational(...row.answer)), `${difficulty}/${seed}: 독립 교집합·넓이 비·답 계산이 다릅니다.`);
  check(promptSvg && answerSvg && attr(promptSvg, "data-model-fingerprint") === attr(answerSvg, "data-model-fingerprint") && attr(promptSvg, "data-intersection-fingerprint") === attr(answerSvg, "data-intersection-fingerprint") && attr(promptSvg, "data-source62-e5-example4-values") === attr(answerSvg, "data-source62-e5-example4-values"), `${difficulty}/${seed}: 문제와 답이 같은 도형 좌표를 쓰지 않습니다.`);
  check(attr(promptSvg, "data-shape-order") === "가,나,다" && attr(promptSvg, "data-shade-order") === "㉠,㉡" && attr(promptSvg, "data-intersection-vertex-counts") === "3,3" && attr(promptSvg, "data-intersection-areas") === row?.areas.slice(2).join(",") && classCount(promptSvg, "source62-overlap-shade") === 2 && classCount(promptSvg, "source62-overlap-label") === 3 && classCount(promptSvg, "source62-overlap-shade-label") === 2, `${difficulty}/${seed}: 세 삼각형·두 음영·기호 구조가 다릅니다.`);
  check(classCount(promptSvg, "source62-overlap-baseline") === 1 && classCount(promptSvg, "source62-overlap-edge") === 6, `${difficulty}/${seed}: 공통 밑변 또는 삼각형 변이 겹쳐 그려집니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(promptText) && !/\b\d+\s*\/\s*\d+\b/.test(answerText), `${difficulty}/${seed}: 보이는 가로 분수가 남아 있습니다.`);
  check(!/1680|672|336|384|1620|720|360|432|1728|864/.test(promptText) && !/2와\s*1\/2배|2\.5배/.test(promptText) && !promptSvg.includes("source62-overlap-solution") && !generated.prompt.includes("data-answer-source"), `${difficulty}/${seed}: 문제에 넓이 값 또는 답이 노출되었습니다.`);
  check(!/1680|672|336|384|1620|720|360|432|1728|864/.test(answerText) && /같은 크기의 칸으로 확인/.test(answerText), `${difficulty}/${seed}: 풀이에 좌표 검산용 넓이가 노출되었거나 간단한 단위 검산이 없습니다.`);
  check(generated.answer === `${row.answer[0] === 2 && row.answer[1] === 1 ? "2" : `${Math.floor(row.answer[0] / row.answer[1]) || ""}${row.answer[0] % row.answer[1] ? ` ${row.answer[0] % row.answer[1]}/${row.answer[1]}` : ""}`.trim()}배` || generated.answer === (row.answer[0] === 5 ? "2 1/2배" : row.answer[0] === 9 ? "2 1/4배" : "2배"), `${difficulty}/${seed}: 답 문자열이 고정 풀 답과 다릅니다.`);
  checked += 1;
}

check(seenPools.size === 3 && [0, 1, 2].every(pool => seenPools.has(pool)), "세 고정 문항 풀이 모두 생성되지 않았습니다.");
if (failures.length) { console.error(failures.slice(0, 120).join("\n")); if (failures.length > 120) console.error(`... ${failures.length - 120}건 더 있음`); process.exitCode = 1; }
else console.log(`6-2 예제 5-4 독립 교집합·단일 답 감사 통과: ${checked}회, 3난이도×1500회, 고정 풀 0·1·2`);
