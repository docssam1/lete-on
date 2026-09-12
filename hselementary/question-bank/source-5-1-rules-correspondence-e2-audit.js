"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u3");
const types = unit?.subunits.flatMap(item => item.types) || [];
const e2 = types.filter(type => type.sourceItemId?.startsWith("5-1-u3-e2-"));
const readyIds = new Set([
  "5-1-u3-e2-example-2-1", "5-1-u3-e2-example-2-2", "5-1-u3-e2-example-2-3",
  "5-1-u3-e2-mission-1", "5-1-u3-e2-mission-2", "5-1-u3-e2-mission-3",
  "5-1-u3-e2-mission-4", "5-1-u3-e2-mission-6"
]);
const lockedIds = new Set(["5-1-u3-e2-exploration", "5-1-u3-e2-mission-5"]);
const expectedKinds = new Map([
  [1, "affine-table"], [2, "ratio-table"], [3, "win-step-table"],
  [4, "affine-table"], [5, "ratio-table"], [6, "linked-three-row-table"],
  [7, "rectangle-wire-table"], [9, "work-payment-table"]
]);
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const parseTag = prompt => {
  const match = prompt.match(/data-correspondence-e2-kind="([^"]+)" data-correspondence-e2-values="([^"]*)" data-result-contract="([^"]+)"/);
  if (!match) throw new Error("독립 검산 태그가 없습니다.");
  return { kind: match[1], values: match[2].split(",").map(Number), contract: match[3] };
};
const answerParts = answer => String(answer).split(",").map(item => item.trim());
const numericPart = text => Number(String(text).replace(/[^0-9-]/g, ""));

function checkAnchor(variant, values, expected) {
  let relation;
  let answer;
  if (variant === 1 || variant === 4) {
    const [m, b, target] = values;
    relation = `△=${m}×□${b >= 0 ? `+${b}` : b}`;
    answer = m * target + b;
  } else if (variant === 2 || variant === 5) {
    const [numerator, denominator, target] = values;
    relation = `◆=△×${numerator}÷${denominator}`;
    answer = target * numerator / denominator;
  } else if (variant === 3) {
    const [rounds, up, down, net] = values;
    const wins = (net + down * rounds) / (up + down);
    relation = `△=${up + down}×□-${down * rounds}`;
    answer = rounds - wins;
  } else if (variant === 6) {
    const [m, addend, input] = values;
    relation = `☆=△÷${m}+${addend}`;
    answer = m * input + input + addend;
  } else if (variant === 7) {
    const [perimeter, height] = values;
    relation = `□+○=${perimeter / 2}`;
    answer = perimeter / 2 - height;
  } else if (variant === 9) {
    const [total, reward, penalty, money] = values;
    const intact = (money + penalty * total) / (reward + penalty);
    relation = `△=${reward + penalty}×□-${penalty * total}`;
    answer = intact;
  }
  if (relation !== expected.relation || answer !== expected.answer) throw new Error("원문 앵커 독립 계산이 다릅니다.");
}

const anchors = [
  { variant: 1, values: [6, -2, 137], relation: "△=6×□-2", answer: 820 },
  { variant: 2, values: [3, 4, 244], relation: "◆=△×3÷4", answer: 183 },
  { variant: 3, values: [20, 3, 1, 12], relation: "△=4×□-20", answer: 12 },
  { variant: 4, values: [4, -10, 50], relation: "△=4×□-10", answer: 190 },
  { variant: 5, values: [3, 4, 244], relation: "◆=△×3÷4", answer: 183 },
  { variant: 6, values: [9, 16, 24], relation: "☆=△÷9+16", answer: 256 },
  { variant: 7, values: [38, 8], relation: "□+○=19", answer: 11 },
  { variant: 9, values: [100, 100, 200, 5200], relation: "△=300×□-20000", answer: 84 }
];
for (const anchor of anchors) {
  try { checkAnchor(anchor.variant, anchor.values, anchor); } catch (error) { fail(`원문 앵커 v${anchor.variant}: ${error.message}`); }
}

function verifyGenerated(type, generated) {
  if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
  const tag = parseTag(generated.prompt);
  if (tag.kind !== expectedKinds.get(type.variant) || tag.contract !== "ordered") throw new Error("유형 또는 답 계약이 원문 기준과 다릅니다.");
  const [first, second] = answerParts(generated.answer);
  const [a, b, c, d] = tag.values;
  let relation;
  let numeric;
  let reverseCandidates;
  if (type.variant === 1 || type.variant === 4) {
    relation = `△=${a}×□${b >= 0 ? `+${b}` : b}`;
    numeric = a * c + b;
    reverseCandidates = [numeric];
  } else if (type.variant === 2 || type.variant === 5) {
    relation = `◆=△×${a}÷${b}`;
    numeric = c * a / b;
    reverseCandidates = [numeric];
  } else if (type.variant === 3) {
    relation = `△=${b + c}×□-${c * a}`;
    const wins = (d + c * a) / (b + c);
    if (!Number.isInteger(wins) || wins < 0 || wins > a) throw new Error("이긴 횟수를 역산할 수 없습니다.");
    numeric = a - wins;
    reverseCandidates = [wins];
  } else if (type.variant === 6) {
    relation = `☆=△÷${a}+${b}`;
    numeric = a * c + c + b;
    reverseCandidates = [a * c];
  } else if (type.variant === 7) {
    relation = `□+○=${a / 2}`;
    numeric = a / 2 - b;
    reverseCandidates = [numeric];
  } else if (type.variant === 9) {
    relation = `△=${b + c}×□-${c * a}`;
    const intact = (d + c * a) / (b + c);
    if (!Number.isInteger(intact) || intact < 0 || intact > a) throw new Error("깨지지 않은 수를 역산할 수 없습니다.");
    numeric = intact;
    reverseCandidates = [intact];
  } else throw new Error("공개 대상이 아닌 변형입니다.");
  if (first.replace(/\s/g, "") !== relation) throw new Error(`관계식이 ${relation}와 다릅니다.`);
  if (numericPart(second) !== numeric || reverseCandidates.length !== 1) throw new Error("수치 답 또는 유일한 역산 결과가 다릅니다.");
  if (/undefined|null|NaN|Infinity|순열|조합|제곱/.test(`${generated.prompt}${generated.solution}`)) throw new Error("화면 오류 또는 학년 밖 표현이 있습니다.");
}

if (!unit) fail("5-1 규칙과 대응 단원을 찾을 수 없습니다.");
if (types.length !== 41 || e2.length !== 10) fail(`E2 원문 유형은 전체 41·E2 10개여야 하나 ${types.length}/${e2.length}개입니다.`);
if (new Set(types.map(type => type.sourceItemId)).size !== types.length) fail("원문 유형 ID가 중복됩니다.");
if (e2.filter(type => !type.reviewLocked && api.generatorKey(type)).length !== 8) fail("E2 공개 유형은 8개여야 합니다.");
if (e2.filter(type => type.reviewLocked || !api.generatorKey(type)).length !== 2) fail("E2 잠금 유형은 2개여야 합니다.");
for (const type of e2) {
  const expectedPage = type.sourceSection === "mission" ? 34 : 33;
  if (type.sourcePdfPage !== expectedPage || type.sourcePrintedPage !== expectedPage + 1) fail(`${type.sourceItemId}: 원문 쪽수가 다릅니다.`);
  if (readyIds.has(type.sourceItemId) && (type.reviewLocked || api.generatorKey(type) !== "correspondenceE2")) fail(`${type.sourceItemId}: 공개 상태·생성기 연결이 다릅니다.`);
  if (lockedIds.has(type.sourceItemId) && (!type.reviewLocked || api.generatorKey(type) || !type.reviewReason)) fail(`${type.sourceItemId}: 잠금 상태·사유·생성기 연결이 다릅니다.`);
}

for (const type of e2.filter(item => readyIds.has(item.sourceItemId))) {
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
    try {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      verifyGenerated(type, generated);
      const text = `${generated.prompt} ${generated.solution}`;
      if (difficulty === -1 && !text.includes("풀이 도움:")) throw new Error("심화 쉬움 안내가 없습니다.");
      if (difficulty === 0 && (text.includes("풀이 도움:") || text.includes("다시 확인하세요."))) throw new Error("심화 기준에 난이도 안내가 섞였습니다.");
      if (difficulty === 1 && !text.includes("다시 확인하세요.")) throw new Error("심화 어려움 안내가 없습니다.");
      checked += 1;
    } catch (error) { fail(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`); }
  }
}

if (failures.length) {
  console.error(`5-1 규칙과 대응 개념탐구 2 감사 실패: ${failures.length}건\n${failures.slice(0, 80).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 규칙과 대응 개념탐구 2 감사 통과: 원문 10항목 · 공개 8/잠금 2 · ${checked.toLocaleString()}회 관계식·수치·역산·난이도 검사`);
