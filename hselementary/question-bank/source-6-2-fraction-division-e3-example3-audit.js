"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-example-3";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Example3";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["2:3:4:6:7:9", { order: "2:3:7:9:4:6", answer: "51/203" }],
  ["1:3:4:6:8:9", { order: "1:3:8:9:4:6", answer: "33/232" }],
  ["2:4:5:7:8:9", { order: "2:4:8:9:5:7", answer: "35/136" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const reduced = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};

function permutations(values) {
  if (values.length < 2) return [values];
  return values.flatMap((value, index) => permutations([...values.slice(0, index), ...values.slice(index + 1)]).map(rest => [value, ...rest]));
}

function independent(cardsSignature) {
  const cards = cardsSignature.split(":").map(Number);
  const all = permutations(cards);
  const valid = all.filter(order => order[1] < order[2] && order[4] < order[5]).map(order => {
    const leftNumerator = order[0] * order[2] + order[1];
    const rightNumerator = order[3] * order[5] + order[4];
    return { order, value: reduced(leftNumerator * order[5], order[2] * rightNumerator) };
  });
  valid.sort((left, right) => left.value.numerator * right.value.denominator - right.value.numerator * left.value.denominator);
  const minimum = valid[0];
  const winners = valid.filter(item => item.value.numerator * minimum.value.denominator === minimum.value.numerator * item.value.denominator);
  return { allCount: all.length, validCount: valid.length, minimum, winners, answer: `${minimum.value.numerator}/${minimum.value.denominator}` };
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "예제 3-3 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "예제 3-3 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 24 && readiness.integrity.lockedCount === 42, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "51/203" && readinessItem?.candidateAnswerCount === 1, "예제 3-3 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-fraction-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 3-3 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const cardsSignature = attr(generated.prompt, "data-source62-e3-example3-cards");
  const answerCardsSignature = attr(generated.answerVisual, "data-source62-e3-example3-cards");
  const row = expected.get(cardsSignature);
  const calculated = independent(cardsSignature);
  const order = attr(generated.prompt, "data-best-order");
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-example3-kind") === "six-cards-smallest-mixed-quotient" && attr(generated.prompt, "data-result-contract") === "single-fraction" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(row && calculated.allCount === 720 && calculated.validCount === 180 && calculated.winners.length === 1 && calculated.minimum.order.join(":") === row.order && calculated.answer === row.answer && order === row.order && generated.answer === row.answer, `${difficulty}/${seed}: 720개 카드 배치의 독립 최솟값이 다릅니다.`);
  check(cardsSignature === answerCardsSignature && attr(generated.answerVisual, "data-best-order") === order && Number(attr(generated.answerVisual, "data-valid-arrangements")) === 180, `${difficulty}/${seed}: 문제와 답의 수 카드·최솟값 배치가 다릅니다.`);
  check((generated.prompt.match(/source41-number-card/g) || []).length === 6 && (generated.prompt.match(/class="math-fraction/g) || []).length >= 2 && generated.prompt.includes("source62-mixed-card-board") && !generated.prompt.includes("source62-mixed-card-board is-solved"), `${difficulty}/${seed}: 문제의 수 카드 6장 또는 대분수 틀이 없습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-mixed-card-board is-solved") && (generated.answerVisual.match(/source41-number-card/g) || []).length === 6 && (generated.answerVisual.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 답의 카드 배치·계산표가 없습니다.`);
  check(!visibleText(generated.prompt).includes(row?.answer || "__missing__") && !/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 문제에 답이 보이거나 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 3-3 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 3-3 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 카드 배치 720개와 올바른 대분수 180개 전수 비교 · 답 후보 1개`);
