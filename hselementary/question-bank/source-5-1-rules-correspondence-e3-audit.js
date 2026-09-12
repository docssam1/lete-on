"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const semester = curriculum.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u3");
const types = unit?.subunits.flatMap(item => item.types) || [];
const e3 = types.filter(type => type.sourceItemId?.startsWith("5-1-u3-e3-"));
const failures = [];
let checked = 0;
const fail = message => failures.push(message);

const publicByVariant = new Map([
  ["exploration", 0],
  ["mission-1", 4],
  ["mission-2", 5],
  ["mission-3", 6],
  ["mission-4", 7]
]);
const publicIds = new Set([...publicByVariant.keys()].map(suffix => `5-1-u3-e3-${suffix}`));
const lockedIds = new Set([
  "5-1-u3-e3-example-3-1",
  "5-1-u3-e3-example-3-2",
  "5-1-u3-e3-example-3-3",
  "5-1-u3-e3-mission-5",
  "5-1-u3-e3-mission-6"
]);
const expectedKinds = new Map([
  [0, "maximum-regions"],
  [4, "maximum-intersections-reverse"],
  [5, "stair-square-count"],
  [6, "smallest-triangle-count"],
  [7, "overlapped-square-perimeter"]
]);

function parseTag(prompt) {
  const match = prompt.match(/data-correspondence-e3-kind="([^"]+)"\s+data-correspondence-e3-values="([^"]*)"\s+data-result-contract="([^"]+)"/);
  if (!match) throw new Error("독립 검산 태그가 없습니다.");
  const values = match[2].split(",").filter(Boolean).map(value => Number(value));
  if (!values.length || values.some(value => !Number.isInteger(value) || !Number.isFinite(value))) throw new Error("검산 태그 값이 자연수 정수가 아닙니다.");
  return { kind: match[1], values, contract: match[3] };
}

function enumerateNaturalCandidates(limit, predicate) {
  const candidates = [];
  for (let value = 1; value <= limit; value += 1) if (predicate(value)) candidates.push(value);
  return candidates;
}

function independentCalculation(kind, values) {
  let answer;
  let candidates;
  if (kind === "maximum-regions") {
    const [lineCount] = values;
    if (lineCount < 1) throw new Error("직선 수가 자연수가 아닙니다.");
    answer = lineCount * (lineCount + 1) / 2 + 1;
    candidates = enumerateNaturalCandidates(answer, value => value * (value + 1) / 2 + 1 === answer);
  } else if (kind === "maximum-intersections-reverse") {
    const [lineCount, intersections] = values;
    if (lineCount < 1 || intersections < 0) throw new Error("직선·교점 값이 올바르지 않습니다.");
    candidates = enumerateNaturalCandidates(Math.max(1, intersections * 2 + 1), value => value * (value - 1) / 2 === intersections);
    if (candidates.length !== 1) throw new Error(`교점 역문제 후보가 ${candidates.length}개입니다.`);
    answer = candidates[0];
    if (lineCount !== answer) throw new Error(`태그의 직선 수 ${lineCount}와 역산값 ${answer}가 다릅니다.`);
  } else if (kind === "stair-square-count") {
    const [stage] = values;
    if (stage < 1) throw new Error("배열 순서가 자연수가 아닙니다.");
    answer = stage * 3;
    candidates = enumerateNaturalCandidates(answer, value => value * 3 === answer);
  } else if (kind === "smallest-triangle-count") {
    const [stage] = values;
    if (stage < 1) throw new Error("도형 순서가 자연수가 아닙니다.");
    answer = stage * stage;
    candidates = enumerateNaturalCandidates(answer, value => value * value === answer);
  } else if (kind === "overlapped-square-perimeter") {
    const [side, overlap, count] = values;
    if (side < 1 || overlap < 0 || overlap >= side || count < 1) throw new Error("정사각형 겹침 조건이 올바르지 않습니다.");
    const increment = 4 * (side - overlap);
    answer = 4 * side + (count - 1) * increment;
    candidates = enumerateNaturalCandidates(answer, value => 4 * side + (value - 1) * increment === answer);
  } else {
    throw new Error(`알 수 없는 대응 규칙 ${kind}`);
  }
  if (!Number.isInteger(answer) || !Number.isFinite(answer)) throw new Error("독립 계산 결과가 유한한 정수가 아닙니다.");
  if (candidates.length !== 1) throw new Error(`역문제 자연수 후보가 ${candidates.length}개입니다.`);
  return { answer, candidates };
}

function numericAnswer(answer) {
  const matches = String(answer).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/g) || [];
  if (matches.length !== 1) throw new Error("표시 정답에서 단일 수를 읽을 수 없습니다.");
  const value = Number(matches[0]);
  if (!Number.isFinite(value)) throw new Error("표시 정답이 유한하지 않습니다.");
  return value;
}

function checkAnchors() {
  const anchors = [
    { kind: "maximum-regions", values: [100], answer: 5051 },
    { kind: "maximum-intersections-reverse", values: [17, 136], answer: 17 },
    { kind: "stair-square-count", values: [13], answer: 39 },
    { kind: "smallest-triangle-count", values: [6], answer: 36 },
    { kind: "overlapped-square-perimeter", values: [5, 2, 42], answer: 512 }
  ];
  for (const anchor of anchors) {
    try {
      const result = independentCalculation(anchor.kind, anchor.values);
      if (result.answer !== anchor.answer || result.candidates.length !== 1) throw new Error(`계산값 ${result.answer}, 후보 ${result.candidates.length}`);
    } catch (error) {
      fail(`원문 앵커 ${anchor.kind}: ${error.message}`);
    }
  }
}

function checkGenerated(type, generated, difficulty) {
  if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
  const tag = parseTag(generated.prompt);
  if (tag.kind !== expectedKinds.get(type.variant)) throw new Error(`태그 유형 ${tag.kind}가 변형 ${type.variant}와 다릅니다.`);
  if (tag.contract !== "single-value") throw new Error(`답 계약 ${tag.contract}가 single-value가 아닙니다.`);
  const calculated = independentCalculation(tag.kind, tag.values);
  if (numericAnswer(generated.answer) !== calculated.answer) throw new Error(`독립 계산 ${calculated.answer}과 표시 답 ${generated.answer}가 다릅니다.`);
  if (calculated.candidates.length !== 1) throw new Error("역문제 답이 유일하지 않습니다.");
  const text = `${generated.prompt} ${generated.solution}`;
  if (difficulty === -1 && !generated.prompt.includes("풀이 도움:")) throw new Error("쉬움 난이도 안내가 없습니다.");
  if (difficulty === 0 && (text.includes("풀이 도움:") || text.includes("다시 확인하세요."))) throw new Error("기준 난이도에 다른 단계 안내가 섞였습니다.");
  if (difficulty === 1 && !generated.prompt.includes("다시 확인하세요.")) throw new Error("어려움 난이도 안내가 없습니다.");
  if (/undefined|null|NaN|Infinity|방정식|함수|좌표|순열|조합|확률|소인수|제곱근|미지수|이차/.test(text)) throw new Error("화면 오류 또는 학년 밖 표현이 있습니다.");
  checked += 1;
}

if (!unit) fail("5-1 규칙과 대응 단원을 찾을 수 없습니다.");
if (types.length !== 41 || e3.length !== 10) fail(`규칙과 대응 유형 수가 전체 41·개념탐구 3 10이 아닙니다: ${types.length}/${e3.length}`);
if (new Set(types.map(type => type.sourceItemId)).size !== types.length) fail("원문 유형 ID가 중복됩니다.");
if (new Set(e3.filter(type => !type.reviewLocked && api.generatorKey(type)).map(type => type.sourceItemId)).size !== 5) fail("개념탐구 3 공개 유형 수가 5개가 아닙니다.");
if (e3.filter(type => type.reviewLocked).length !== 5) fail("개념탐구 3 잠금 유형 수가 5개가 아닙니다.");

for (const type of e3) {
  const expectedPage = type.sourceSection === "mission" ? 36 : 35;
  if (type.sourcePdfPage !== expectedPage || type.sourcePrintedPage !== expectedPage + 1) fail(`${type.sourceItemId}: 원문 쪽수가 다릅니다.`);
  if (publicIds.has(type.sourceItemId)) {
    const expectedVariant = publicByVariant.get(type.sourceItemId.replace("5-1-u3-e3-", ""));
    if (type.reviewLocked || api.generatorKey(type) !== "correspondenceE3" || type.variant !== expectedVariant) fail(`${type.sourceItemId}: 공개 상태·생성기·variant가 다릅니다.`);
  }
  if (lockedIds.has(type.sourceItemId) && (!type.reviewLocked || api.generatorKey(type) || !type.reviewReason)) fail(`${type.sourceItemId}: 잠금 상태·사유·생성기 연결이 다릅니다.`);
}
if (new Set(e3.map(type => type.sourceItemId)).size !== 10 || [...publicIds, ...lockedIds].length !== 10) fail("개념탐구 3 공개·잠금 ID 집합이 완전하지 않습니다.");
checkAnchors();

for (const type of e3.filter(item => publicIds.has(item.sourceItemId))) {
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1000; seed += 1) {
    try {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      checkGenerated(type, generated, difficulty);
    } catch (error) {
      fail(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    }
  }
}

if (failures.length) {
  console.error(`5-1 규칙과 대응 개념탐구 3 독립 감사 실패: ${failures.length}건\n${failures.slice(0, 80).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 규칙과 대응 개념탐구 3 독립 감사 통과: 원문 10항목 · 공개 5/잠금 5 · ${checked.toLocaleString()}회 독립 공식·역산 전수열거·난이도·초등 언어 검사`);
