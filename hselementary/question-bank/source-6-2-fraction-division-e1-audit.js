"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e1-example-1";
const generatorKey = "sourceGrade6SecondFractionDivisionE1";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expectedAnswers = new Map([
  ["40:48:1:3:7:10", "51/58"],
  ["30:30:1:3:7:10", "33/40"],
  ["24:24:1:3:7:10", "27/34"]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;

const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = markup => String(markup)
  .replace(/<span\s+hidden[\s\S]*?<\/span>/g, "")
  .replace(/<[^>]*>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const gcd = (left, right) => {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};
const reduce = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
};

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e1-kind="fraction-division-number-line"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "독립 검산 자료가 없습니다.");
  check(values.length === 12 && values.every(Number.isFinite), `검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    kind: attr(markup, "data-source62-fraction-e1-kind"),
    source: attr(markup, "data-source-item"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentlyCalculate(values) {
  const [denominator, startNumerator, knownFirstIndex, targetFirstIndex, knownSecondIndex, targetSecondIndex] = values;
  const firstKnownNumerator = startNumerator + knownFirstIndex;
  const secondKnownNumerator = startNumerator + knownSecondIndex;
  const numeratorStep = (secondKnownNumerator - firstKnownNumerator) / (knownSecondIndex - knownFirstIndex);
  check(numeratorStep === 1, "두 주어진 수로 다시 구한 눈금 한 칸이 분자의 1만큼이 아닙니다.");
  const firstTargetNumerator = firstKnownNumerator + (targetFirstIndex - knownFirstIndex) * numeratorStep;
  const secondTargetNumerator = secondKnownNumerator + (targetSecondIndex - knownSecondIndex) * numeratorStep;
  const firstReduced = reduce(firstTargetNumerator, denominator);
  const secondReduced = reduce(secondTargetNumerator, denominator);
  const answerReduced = reduce(firstReduced[0] * secondReduced[1], firstReduced[1] * secondReduced[0]);
  check(values.slice(6, 10).join(",") === [...firstReduced, ...secondReduced].join(","), "수직선에서 독립 계산한 가·나와 생성 자료가 다릅니다.");
  check(values.slice(10, 12).join(",") === answerReduced.join(","), "독립 계산한 몫과 생성 자료가 다릅니다.");
  return `${answerReduced[0]}/${answerReduced[1]}`;
}

check(Boolean(type), "6-2 예제 1-1 원장 항목이 없습니다.");
check(type?.generatorKey === generatorKey && !type?.reviewLocked, "원장 항목이 전용 생성기에 공개 상태로 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "6-2 예제 1-1 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 11 && readiness.integrity.lockedCount === 55 && readiness.integrity.allImplementationLocked === false, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.length === 1 && readinessItem.answerCandidates[0] === "51/58", "비공개 검토표의 원본 답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "원자료 장부의 원본 확인·단일 정답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) {
  for (let seed = 1; seed <= 1500; seed += 1) {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    const evidence = parseEvidence(generated.prompt);
    const geometry = attr(generated.prompt, "data-source62-e1-geometry");
    const answerGeometry = attr(generated.answerVisual, "data-source62-e1-geometry");
    const structure = attr(generated.prompt, "data-source62-e1-structure");
    const answerStructure = attr(generated.answerVisual, "data-source62-e1-structure");
    const independentAnswer = independentlyCalculate(evidence.values);
    const expectedAnswer = expectedAnswers.get(geometry);
    seenPools.add(generated.verifiedPoolIndex);

    check(generated.generator === generatorKey, `${difficulty}/${seed}: 전용 생성기를 사용하지 않았습니다.`);
    check(generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 원문 문항 연결이 다릅니다.`);
    check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
    check(evidence.kind === "fraction-division-number-line" && evidence.contract === "single-value", `${difficulty}/${seed}: 단일 정답 계약이 다릅니다.`);
    check(evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 난이도별 풀이 부담 표시가 다릅니다.`);
    check(Boolean(expectedAnswer) && generated.answer === expectedAnswer && independentAnswer === expectedAnswer, `${difficulty}/${seed}: 표시 답·독립 계산·고정 답이 일치하지 않습니다.`);
    check(structure === "fraction-division-number-line" && structure === answerStructure && geometry === answerGeometry, `${difficulty}/${seed}: 문제와 답의 수직선 좌표 모델이 다릅니다.`);
    check((generated.prompt.match(/data-tick-index=/g) || []).length === 11 && (generated.answerVisual.match(/data-tick-index=/g) || []).length === 11, `${difficulty}/${seed}: 문제 또는 답의 눈금이 11개가 아닙니다.`);
    check((generated.prompt.match(/data-label-kind=/g) || []).length === 4 && (generated.answerVisual.match(/data-label-kind=/g) || []).length === 4, `${difficulty}/${seed}: 문제 또는 답의 네 위치 표시가 다릅니다.`);
    check(!generated.prompt.includes("is-solved") && !generated.prompt.includes("data-answer-source"), `${difficulty}/${seed}: 문제에 답 표시가 노출되었습니다.`);
    check(generated.answerVisual.includes("is-solved") && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`), `${difficulty}/${seed}: 답에 같은 수직선의 풀이 표시가 없습니다.`);
    check((generated.prompt.match(/class="math-fraction"/g) || []).length >= 2, `${difficulty}/${seed}: 문제의 분수가 세로 분수로 표시되지 않습니다.`);
    check((generated.answerVisual.match(/class="math-fraction"/g) || []).length >= 7, `${difficulty}/${seed}: 답의 분수 계산이 세로 분수로 표시되지 않습니다.`);
    check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
    check(!/undefined|null|NaN|Infinity|순열|조합|제곱근/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
    if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
    if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
    if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계의 스스로 풀기 표시가 없습니다.`);
    checked += 1;
  }
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);

if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 1-1 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`6-2 분수의 나눗셈 예제 1-1 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 원본 답 51/58 · 문제/답 동일 11눈금 수직선`);
