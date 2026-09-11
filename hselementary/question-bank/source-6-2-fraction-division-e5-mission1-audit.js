"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e5-mission-1";
const generatorKey = "sourceGrade6SecondFractionDivisionE5Mission1";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const ledger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const ledgerItem = ledger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["2:9:3:4:187:8", { tail: [1, 6], bodyRatio: [11, 18], units: [4, 3, 11, 18], total: [153, 4], answer: "38 1/4cm" }],
  ["3:10:2:3:57:4", { tail: [1, 5], bodyRatio: [1, 2], units: [3, 2, 5, 10], total: [57, 2], answer: "28 1/2cm" }],
  ["3:11:4:5:14:1", { tail: [12, 55], bodyRatio: [28, 55], units: [15, 12, 28, 55], total: [55, 2], answer: "27 1/2cm" }]
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
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);
const same = (left, right) => Boolean(left && right && left.numerator === right.numerator && left.denominator === right.denominator);

function parse(markup) {
  const evidence = String(markup).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e5-mission1-kind="fish-head-body-tail-length"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(evidence, "data-values").split(":").map(Number);
  check(Boolean(evidence) && values.length === 16 && values.every(Number.isFinite), "Mission 1 독립 검산 자료가 없습니다.");
  return { source: attr(evidence, "data-source-item"), kind: attr(evidence, "data-source62-fraction-e5-mission1-kind"), contract: attr(evidence, "data-result-contract"), candidates: Number(attr(evidence, "data-candidate-count")), partitions: attr(evidence, "data-candidate-partitions"), difficulty: attr(evidence, "data-difficulty-design"), values };
}

function enumeratePartitions(headRatio, tailOfHeadRatio) {
  const found = new Map();
  for (let total = 1; total <= 220; total += 1) {
    const head = multiply(rational(total), headRatio);
    const tail = multiply(head, tailOfHeadRatio);
    const body = subtract(subtract(rational(total), head), tail);
    if ([head, tail, body].some(value => !value || value.denominator !== 1 || value.numerator <= 0)) continue;
    const divisor = gcd(gcd(head.numerator, tail.numerator), body.numerator);
    const normalized = [head.numerator / divisor, tail.numerator / divisor, body.numerator / divisor];
    found.set(normalized.join(":"), normalized);
  }
  return [...found.values()];
}

function independentlyCalculate(values) {
  const [headN, headD, tailHeadN, tailHeadD, bodyN, bodyD, tailN, tailD, bodyRatioN, bodyRatioD, headUnits, tailUnits, bodyUnits, totalUnits, totalN, totalD] = values;
  const headRatio = rational(headN, headD);
  const tailOfHeadRatio = rational(tailHeadN, tailHeadD);
  const bodyLength = rational(bodyN, bodyD);
  const tailRatio = multiply(headRatio, tailOfHeadRatio);
  const bodyRatio = subtract(subtract(rational(1), headRatio), tailRatio);
  const totalByFraction = divide(bodyLength, bodyRatio);
  const oneUnit = divide(bodyLength, rational(bodyUnits));
  const totalByUnits = multiply(oneUnit, rational(totalUnits));
  return { key: [headN, headD, tailHeadN, tailHeadD, bodyN, bodyD].join(":"), headRatio, tailOfHeadRatio, bodyLength, tailRatio, bodyRatio, totalByFraction, oneUnit, totalByUnits, units: [headUnits, tailUnits, bodyUnits, totalUnits], totalFromEvidence: rational(totalN, totalD), candidates: enumeratePartitions(headRatio, tailOfHeadRatio) };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked && type.verifiedVariantCount === 3, "Mission 1 공개 원장이 전용 생성기·고정 3문항에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 1 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 48 && readiness.integrity.lockedCount === 18, "6-2 1단원 검토표의 공개 48개·잠금 18개 요약이 다릅니다.");
check(readinessItem?.sourceVerified === true && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "38 1/4cm", "Mission 1 검토표의 원문 수치·계산·공개 상태가 다릅니다.");
check(ledgerItem?.sourceVerified === true && ledgerItem?.implementationStatus === "fixed-verified-pool" && ledgerItem?.answerContract === "single-positive-centimeter-length" && ledgerItem?.publicSourceItemId === sourceItemId, "Mission 1 원자료 장부의 공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parse(generated.prompt);
  const calculated = independentlyCalculate(evidence.values);
  const row = expected.get(calculated.key);
  const promptText = visibleText(generated.prompt);
  const answerText = visibleText(generated.answerVisual);
  const promptBoard = String(generated.prompt).match(/<div class="source61-math-board source62-fish-length-board[\s\S]*?<\/div>/)?.[0] || "";
  const answerBoard = String(generated.answerVisual).match(/<div class="source61-math-board source62-fish-length-board is-solved"[\s\S]*?<\/div>/)?.[0] || "";
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3 && evidence.kind === "fish-head-body-tail-length" && evidence.contract === "single-positive-centimeter-length" && evidence.candidates === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 고정 풀·난이도·단일 답 계약이 다릅니다.`);
  check(Boolean(row) && same(calculated.tailRatio, rational(...row.tail)) && same(calculated.bodyRatio, rational(...row.bodyRatio)) && same(calculated.totalByFraction, rational(...row.total)) && same(calculated.totalByUnits, calculated.totalByFraction) && same(calculated.totalFromEvidence, calculated.totalByFraction), `${difficulty}/${seed}: 유리수 계산과 같은 크기 칸 계산이 다릅니다.`);
  check(calculated.candidates.length === 1 && calculated.candidates[0].join(":") === row?.units.slice(0, 3).join(":") && evidence.partitions === row?.units.slice(0, 3).join(":"), `${difficulty}/${seed}: 가능한 같은 크기 칸 분할이 하나로 정해지지 않습니다.`);
  check(calculated.units.join(":") === row?.units.join(":") && same(rational(calculated.units[0], calculated.units[3]), calculated.headRatio) && same(rational(calculated.units[1], calculated.units[0]), calculated.tailOfHeadRatio) && same(rational(calculated.units[2], calculated.units[3]), calculated.bodyRatio), `${difficulty}/${seed}: 머리·꼬리·몸통 칸 수 관계가 다릅니다.`);
  check(promptBoard && answerBoard && attr(promptBoard, "data-source62-e5-mission1-values") === attr(answerBoard, "data-source62-e5-mission1-values") && attr(promptBoard, "data-unit-partition") === attr(answerBoard, "data-unit-partition"), `${difficulty}/${seed}: 문제와 답이 같은 관계표 자료를 쓰지 않습니다.`);
  check(!/23\s*3\/4|95\/4|38\s*19\/22|855\/22|11\/18|153\/4|38\s*1\/4/.test(promptText) && !/undefined|null|NaN|Infinity/.test(promptText), `${difficulty}/${seed}: 문제에 풀이 값 또는 답이 노출되었습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(promptText) && !/\b\d+\s*\/\s*\d+\b/.test(answerText) && !/\$\{/.test(answerText) && /같은 크기 칸/.test(answerText), `${difficulty}/${seed}: 세로 분수, 같은 크기 칸 풀이 또는 표시 치환이 다릅니다.`);
  check(generated.answer === row?.answer && generated.answerVisual.includes("data-answer-source=\"6-2-u1-e5-mission-1\""), `${difficulty}/${seed}: 답 또는 답 관계표가 고정 풀과 다릅니다.`);
  checked += 1;
}

check(seenPools.size === 3 && [0, 1, 2].every(pool => seenPools.has(pool)), "세 고정 문항 풀이 모두 생성되지 않았습니다.");
if (failures.length) { console.error(failures.slice(0, 120).join("\n")); if (failures.length > 120) console.error(`... ${failures.length - 120}건 더 있음`); process.exitCode = 1; }
else console.log(`6-2 Mission 1 독립 유리수·같은 크기 칸·단일 답 감사 통과: ${checked}회, 3난이도×1500회, 고정 풀 0·1·2`);
