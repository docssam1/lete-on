"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e1-example-3";
const generatorKey = "sourceGrade6SecondFractionDivisionE1Example3";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expectedAnswers = new Map([
  ["115:127", "32/21"],
  ["74:86", "13/12"],
  ["168:182", "95/66"]
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
const reduce = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e1-example3-kind="growing-denominator-sequence"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "예제 1-3 독립 검산 자료가 없습니다.");
  check(values.length === 10 && values.every(Number.isFinite), `예제 1-3 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e1-example3-kind"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function enumerateTerms(maxPosition) {
  const terms = [];
  for (let denominator = 1; terms.length < maxPosition; denominator += 1) {
    for (let numerator = 1; numerator <= denominator && terms.length < maxPosition; numerator += 1) {
      terms.push({ numerator, denominator });
    }
  }
  return terms;
}

function independentAnswer(values) {
  const [firstPosition, secondPosition, firstNumerator, firstDenominator, secondNumerator, secondDenominator, firstPrevious, secondPrevious, storedNumerator, storedDenominator] = values;
  const terms = enumerateTerms(Math.max(firstPosition, secondPosition));
  const first = terms[firstPosition - 1];
  const second = terms[secondPosition - 1];
  check([first.numerator, first.denominator].join(":") === [firstNumerator, firstDenominator].join(":"), "실제 나열의 첫 위치와 생성 자료가 다릅니다.");
  check([second.numerator, second.denominator].join(":") === [secondNumerator, secondDenominator].join(":"), "실제 나열의 둘째 위치와 생성 자료가 다릅니다.");
  check(firstPrevious === (first.denominator - 1) * first.denominator / 2 && secondPrevious === (second.denominator - 1) * second.denominator / 2, "묶음 끝 번호 계산이 다릅니다.");
  const quotient = reduce(first.numerator * second.denominator, first.denominator * second.numerator);
  check([storedNumerator, storedDenominator].join(":") === [quotient.numerator, quotient.denominator].join(":"), "독립 계산한 몫과 생성 자료가 다릅니다.");
  return `${quotient.numerator}/${quotient.denominator}`;
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "예제 1-3 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "예제 1-3 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 24 && readiness.integrity.lockedCount === 42, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "32/21", "예제 1-3 비공개 검토표의 수정 답·공개 상태가 완결되지 않았습니다.");
check(!String(readinessItem?.independentCalculation || "").includes("8/5") && String(readinessItem?.independentCalculation || "").includes("115번째=10/15"), "예전 한 칸 오차 답이 남았거나 수정 근거가 없습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 1-3 원자료 장부의 원본 확인·단일 정답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const [firstPosition, secondPosition] = evidence.values;
  const expected = expectedAnswers.get(`${firstPosition}:${secondPosition}`);
  const calculated = independentAnswer(evidence.values);
  const promptSequence = attr(generated.prompt, "data-source62-e1-example3-sequence");
  const answerSequence = attr(generated.answerVisual, "data-source62-e1-example3-sequence");
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "growing-denominator-sequence" && evidence.contract === "single-value" && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(expected) && generated.answer === expected && calculated === expected, `${difficulty}/${seed}: 표시 답·실제 나열·고정 답이 다릅니다.`);
  check(promptSequence === "1/1:1/2:2/2:1/3:2/3:3/3:1/4:2/4:3/4:4/4" && promptSequence === answerSequence, `${difficulty}/${seed}: 문제와 답의 수열 자료가 다릅니다.`);
  check(generated.prompt.includes('aria-label="4분의 2"') && generated.prompt.includes('aria-label="4분의 3"'), `${difficulty}/${seed}: 약분 전 수열의 항이 보존되지 않았습니다.`);
  check(!generated.prompt.includes("data-answer-source") && !generated.prompt.includes("source62-sequence-solution"), `${difficulty}/${seed}: 문제에 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-sequence-solution"), `${difficulty}/${seed}: 답 화면의 원문 연결·계산표가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱근/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 1-3 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 1-3 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 원본 답 32/21 · 182항 전수 나열`);
