"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-example-2";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Example2";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["15:2:11:5:12500", { count: 13, sale: 162500, remainder: "7/5" }],
  ["14:2:11:6:9800", { count: 15, sale: 147000, remainder: "1/2" }],
  ["18:2:13:5:13000", { count: 13, sale: 169000, remainder: "11/5" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;

const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = markup => String(markup).replace(/<span\s+hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (left, right) => {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};
const rational = (numerator, denominator = 1) => {
  if (!denominator) throw new Error("분모는 0일 수 없습니다.");
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const lessThanOrEqual = (left, right) => left.numerator * right.denominator <= right.numerator * left.denominator;
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;
const print = value => value.denominator === 1 ? String(value.numerator) : `${value.numerator}/${value.denominator}`;
const mixed = value => {
  if (value.denominator === 1) return String(value.numerator);
  const whole = Math.floor(value.numerator / value.denominator);
  const remainder = value.numerator % value.denominator;
  return whole ? `${whole} ${remainder}/${value.denominator}` : `${remainder}/${value.denominator}`;
};

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-example2-kind="equal-package-maximum-sale-remainder"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "예제 2-2 독립 검산 자료가 없습니다.");
  check(values.length === 11 && values.every(Number.isFinite), `예제 2-2 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-example2-kind"),
    contract: attr(markup, "data-result-contract"),
    answerOrder: attr(markup, "data-answer-order"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [sackMass, sackCount, packageNumerator, packageDenominator, unitPrice, totalNumerator, totalDenominator, storedCount, remainderNumerator, remainderDenominator, storedSale] = values;
  const total = rational(sackMass * sackCount);
  const storedTotal = rational(totalNumerator, totalDenominator);
  const packageMass = rational(packageNumerator, packageDenominator);
  const storedRemainder = rational(remainderNumerator, remainderDenominator);
  const candidates = Array.from({ length: 100 }, (_, count) => count).filter(count => {
    const current = multiply(packageMass, rational(count));
    const next = multiply(packageMass, rational(count + 1));
    return lessThanOrEqual(current, total) && !lessThanOrEqual(next, total);
  });
  check(candidates.length === 1, `최대 봉지 수 후보가 ${candidates.length}개입니다.`);
  const count = candidates[0];
  const remainder = subtract(total, multiply(packageMass, rational(count)));
  const sale = count * unitPrice;
  check(equal(total, storedTotal) && count === storedCount && equal(remainder, storedRemainder) && sale === storedSale, "저장된 전체·봉지 수·판매 금액·남은 양과 독립 계산값이 다릅니다.");
  check(remainder.numerator > 0 && !lessThanOrEqual(packageMass, remainder), "남은 설탕으로 봉지를 하나 더 만들 수 있습니다.");
  return { count, sale, remainder, candidates };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "예제 2-2 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "예제 2-2 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 23 && readiness.integrity.lockedCount === 43, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "(162500원, 1 2/5kg)" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "예제 2-2 비공개 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "ordered-tuple-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 2-2 원자료 장부의 원본 확인·순서 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-example2-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-example2-expression");
  const expectedAnswer = expected.get(signature);
  const calculated = independentSolution(evidence.values);
  const expectedText = `최대 판매 금액 ${calculated.sale.toLocaleString("ko-KR")}원, 남은 설탕 ${mixed(calculated.remainder)}kg`;
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "equal-package-maximum-sale-remainder" && evidence.contract === "ordered-tuple" && evidence.answerOrder === "maximum-sale,remainder-mass" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·순서 답·단일 후보·난이도 계약이 다릅니다.`);
  check(Boolean(expectedAnswer) && calculated.count === expectedAnswer.count && calculated.sale === expectedAnswer.sale && print(calculated.remainder) === expectedAnswer.remainder && generated.answer === expectedText, `${difficulty}/${seed}: 표시 답과 독립 계산한 순서 답이 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 설탕 포장 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-sugar-sack"/g) || []).length === 2 && (generated.prompt.match(/class="source62-sugar-package"/g) || []).length === 1, `${difficulty}/${seed}: 원본의 두 자루와 한 봉지 자료가 다릅니다.`);
  check((generated.prompt.match(/<b>\?<\/b>/g) || []).length === 3 && !generated.prompt.includes("source62-sugar-packing-solution"), `${difficulty}/${seed}: 문제 자료판에 답이 노출되었거나 물음이 빠졌습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-sugar-packing-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 답 자료판의 결과와 네 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 2-2 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 2-2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 최대 봉지 수 후보 1개 · 판매 금액과 남은 양 순서 독립 계산`);
