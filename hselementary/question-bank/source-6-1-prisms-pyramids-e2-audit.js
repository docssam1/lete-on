"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6PrismsPyramidsE2";
const sourceIds = [
  "6-1-u2-e2-example-2-2",
  "6-1-u2-e2-mission-2",
  "6-1-u2-e2-mission-5"
];
const evidenceKinds = [
  "cuboid-all-corners-cut",
  "regular-prism-radial-cut",
  "prism-all-vertices-truncated"
];
const difficultyExpected = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedPools = [
  [
    { values: [1, 4, 14, 24, 36, 74], answer: 74 },
    { values: [2, 7, 14, 24, 36, 74], answer: 74 },
    { values: [3, 10, 14, 24, 36, 74], answer: 74 }
  ],
  [
    { values: [5, 9, 45], answer: 45 },
    { values: [7, 9, 63], answer: 63 },
    { values: [8, 9, 72], answer: 72 }
  ],
  [
    { values: [5, 10, 15, 17, 30, 45, 92], answer: 92 },
    { values: [6, 12, 18, 20, 36, 54, 110], answer: 110 },
    { values: [7, 14, 21, 23, 42, 63, 128], answer: 128 }
  ]
];

const failures = [];
let checked = 0;
let context = "";
const check = (condition, message) => {
  if (!condition) failures.push(`${context}: ${message}`);
};
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1];
const allAttrs = (markup, name) => {
  const values = [];
  const expression = new RegExp(`${name}="([^"]*)"`, "g");
  let match;
  while ((match = expression.exec(String(markup)))) values.push(match[1]);
  return values;
};
const countClass = (markup, className) => {
  const expression = new RegExp(`class="[^"]*\\b${className}\\b[^"]*"`, "g");
  return (String(markup).match(expression) || []).length;
};
const stripHidden = markup => String(markup).replace(/<span\s+hidden[\s\S]*?<\/span>/g, "");
const stripTags = value => String(value).replace(/<[^>]*>/g, " ");
const visibleText = markup => stripTags(stripHidden(markup)).replace(/\s+/g, " ").trim();
const numberAnswer = value => {
  const numbers = String(value).match(/-?\d+(?:\.\d+)?/g) || [];
  return numbers.length === 1 ? Number(numbers[0]) : NaN;
};

const parseEvidence = prompt => {
  const evidenceMarkup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source61-prism-e2-kind="[^"]+"[\s\S]*?<\/span>/)?.[0];
  if (!evidenceMarkup) throw new Error("E2 독립 검산 자료가 없습니다.");
  const valuesText = attr(evidenceMarkup, "data-values");
  const values = valuesText ? valuesText.split(",").map(Number) : [];
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error("E2 data-values가 깨졌습니다.");
  return {
    kind: attr(evidenceMarkup, "data-source61-prism-e2-kind"),
    sourceItemId: attr(evidenceMarkup, "data-source-item"),
    contract: attr(evidenceMarkup, "data-result-contract"),
    difficulty: attr(evidenceMarkup, "data-difficulty-design"),
    values
  };
};

// Independent formulas intentionally do not call or reuse a production generator.
function independentAnswer(evidence) {
  const values = evidence.values;
  if (evidence.kind === "cuboid-all-corners-cut") {
    const [distance, minimumEdge, faces, vertices, edges, total] = values;
    check([1, 2, 3].includes(distance), "절단 거리가 고정 pool 1, 2, 3이 아닙니다.");
    check(minimumEdge === 3 * distance + 1, "최소 모서리 길이 조건이 절단 거리와 맞지 않습니다.");
    check(faces === 14 && vertices === 24 && edges === 36, "직육면체 절단 뒤 F=14, V=24, E=36이 아닙니다.");
    check(faces + vertices + edges === total && total === 74, "절단 뒤 전체 수가 독립 계산 74와 다릅니다.");
    return total;
  }
  if (evidence.kind === "regular-prism-radial-cut") {
    const [n, edgesPerPiece, total] = values;
    check([5, 7, 8].includes(n), "정n각기둥의 n이 고정 pool 5, 7, 8이 아닙니다.");
    check(edgesPerPiece === 9, "삼각기둥 한 조각의 모서리 수가 9가 아닙니다.");
    check(edgesPerPiece * n === total, "삼각기둥 n개의 모서리 합을 독립 계산하지 못했습니다.");
    return total;
  }
  if (evidence.kind === "prism-all-vertices-truncated") {
    const [n, originalVertices, originalEdges, faces, vertices, edges, total] = values;
    check([5, 6, 7].includes(n), "정n각기둥의 n이 고정 pool 5, 6, 7이 아닙니다.");
    check(originalVertices === 2 * n && originalEdges === 3 * n, "원래 각기둥의 꼭짓점·모서리 수가 다릅니다.");
    check(faces === 3 * n + 2, "절단 뒤 면의 수가 3n+2와 다릅니다.");
    check(vertices === 6 * n, "절단 뒤 꼭짓점 수가 6n과 다릅니다.");
    check(edges === 9 * n, "절단 뒤 모서리 수가 9n과 다릅니다.");
    check(vertices + edges + faces === total && total === 18 * n + 2, "절단 뒤 전체 수가 독립 계산과 다릅니다.");
    return total;
  }
  throw new Error(`알 수 없는 E2 검산 종류: ${evidence.kind}`);
}

function checkCommon(generated, sourceItemId, difficulty, expected) {
  check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), "문제·정답·풀이가 비었습니다.");
  check(generated.generator === generatorKey, "E2 전용 생성기를 사용하지 않았습니다.");
  check(generated.sourceItemId === sourceItemId, "생성 결과의 원문 유형 ID가 다릅니다.");
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, "고정 검증 3문항 계약이 다릅니다.");
  check(Number.isInteger(generated.verifiedPoolIndex) && generated.verifiedPoolIndex >= 0 && generated.verifiedPoolIndex <= 2, "고정 묶음 번호가 0~2가 아닙니다.");
  check(typeof generated.answerVisual === "string" && generated.answerVisual.includes("source61-answer-diagram"), "답 그림 wrapper가 없습니다.");
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`), "답 그림의 원문 유형 ID가 다릅니다.");
  check(generated.answerVisual.includes(`data-verified-pool-index="${generated.verifiedPoolIndex}"`), "답 그림의 고정 묶음 번호가 다릅니다.");
  check(generated.answerVisual.includes(`data-source-item="${sourceItemId}"`), "답 그림의 숨은 원문 연결이 없습니다.");
  const evidence = parseEvidence(generated.prompt);
  check(evidence.kind === evidenceKinds[sourceIds.indexOf(sourceItemId)], "evidence kind가 원문 유형과 다릅니다.");
  check(evidence.sourceItemId === sourceItemId, "독립 검산 자료의 원문 유형 ID가 다릅니다.");
  check(evidence.contract === "single-value", "문항이 단일 정답 계약이 아닙니다.");
  check(evidence.difficulty === difficultyExpected[String(difficulty)], "난이도별 풀이 부담 표시가 다릅니다.");
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), "쉬움 단계의 안내가 없습니다.");
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), "원본 단계에 난이도 안내가 섞였습니다.");
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), "어려움 단계의 스스로 찾기 안내가 없습니다.");
  const expectedAnswer = independentAnswer(evidence);
  check(numberAnswer(generated.answer) === expectedAnswer, `표시 답 '${generated.answer}'이 독립 계산 '${expectedAnswer}'과 다릅니다.`);
  check(evidence.values.join(",") === expected.values.join(","), "고정 pool의 data-values가 계약과 다릅니다.");
  check(numberAnswer(generated.answer) === expected.answer, "고정 pool의 정답이 계약과 다릅니다.");
  const promptStructures = allAttrs(generated.prompt, "data-source61-e2-structure");
  const answerStructures = allAttrs(generated.answerVisual, "data-source61-e2-structure");
  check(promptStructures.length > 0 && answerStructures.length > 0, "문제와 답 그림에 공통 구조 서명이 없습니다.");
  check(promptStructures.join("|") === answerStructures.join("|"), "문제와 답 그림의 구조 서명이 다릅니다.");
  check(!generated.prompt.includes("data-result-highlight="), "문제에 정답 강조 속성이 노출되었습니다.");
  check(generated.answerVisual.includes("data-result-highlight="), "답 그림에 목표 결과 강조가 없습니다.");
  const visible = visibleText(`${generated.prompt}\n${generated.solution}`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱근/.test(visible), "문제 또는 풀이에 깨진 값·학년 밖 표현이 있습니다.");
  checked += 1;
  return evidence;
}

function checkVariant(variant, generated, evidence) {
  const prompt = String(generated.prompt);
  const answer = String(generated.answerVisual);
  const values = evidence.values;
  if (variant === 0) {
    const [distance] = values;
    const promptText = visibleText(prompt);
    for (const forbidden of ["14", "24", "36", "74"]) {
      check(!new RegExp(`\\b${forbidden}\\b`).test(promptText), `문제에 절단 뒤 결과 ${forbidden}가 노출되었습니다.`);
    }
    for (const markup of [prompt, answer]) {
      check(markup.includes(`data-cut-distance="${distance}"`), "절단 거리 semantic data가 pool 값과 다릅니다.");
      check(markup.includes('data-vertex-count="24"') && markup.includes('data-edge-count="36"') && markup.includes('data-face-count="14"') && markup.includes('data-total-count="74"'), "F/V/E/전체 semantic data가 계약과 다릅니다.");
      check(countClass(markup, "source61-e2-corner-cut") === 8, "직육면체의 절단면 polygon이 8개가 아닙니다.");
      check(countClass(markup, "source61-e2-prism-vertex") === 24, "절단 뒤 꼭짓점 dot이 24개가 아닙니다.");
    }
    check(answer.includes('data-result-highlight="74"'), "답에서 74가 강조되지 않았습니다.");
    return;
  }
  if (variant === 1) {
    const [n] = values;
    const promptText = visibleText(prompt);
    check(prompt.includes(`${n}각기둥`), "문제에 주어진 정n각기둥이 없습니다.");
    check(!/(?:9n|9×n|n×9)/.test(promptText), "문제에 계산 결과 9n이 노출되었습니다.");
    check(!new RegExp(`\\b(?:${9 * n}|45|63|72)\\b`).test(promptText), "문제에 나누어진 모서리 수의 계산 결과가 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(markup.includes(`data-n="${n}"`), "정n각기둥의 n semantic data가 없습니다.");
      check(markup.includes(`data-fan-count="${n}"`), "부채꼴로 나뉜 삼각기둥 수가 n과 다릅니다.");
      check(markup.includes('data-edge-per-fan="9"') && markup.includes(`data-total-edge-count="${9 * n}"`), "삼각기둥 모서리 수 semantic data가 계약과 다릅니다.");
      check(countClass(markup, "source61-e2-fan") === n, "부채꼴 sector 개수가 실제 n과 다릅니다.");
    }
    check(answer.includes(`data-result-highlight="${9 * n}"`), "답에서 9n 결과가 강조되지 않았습니다.");
    return;
  }
  const [n, originalVertices, originalEdges, faces, vertices, edges, total] = values;
  const promptText = visibleText(prompt);
  for (const forbidden of [String(faces), String(vertices), String(edges), String(total)]) {
    check(!new RegExp(`\\b${forbidden}\\b`).test(promptText), `문제에 절두 뒤 결과 ${forbidden}가 노출되었습니다.`);
  }
  check(!/(?:18n\\+2|18×n\\+2|18n)/.test(promptText), "문제에 절두 뒤 전체 공식이 노출되었습니다.");
  for (const markup of [prompt, answer]) {
    check(markup.includes(`data-n="${n}"`) && markup.includes(`data-original-vertices="${originalVertices}"`) && markup.includes(`data-original-edges="${originalEdges}"`), "원래 각기둥 semantic data가 계약과 다릅니다.");
    check(markup.includes(`data-result-vertex-count="${vertices}"`) && markup.includes(`data-result-edge-count="${edges}"`) && markup.includes(`data-result-face-count="${faces}"`) && markup.includes(`data-total-count="${total}"`), "절두 뒤 결과 semantic data가 계약과 다릅니다.");
    check(countClass(markup, "source61-e2-corner-cut") === 2 * n, "절단면 polygon이 2n개가 아닙니다.");
    check(countClass(markup, "source61-e2-prism-vertex") === 6 * n, "절단 뒤 꼭짓점 dot이 6n개가 아닙니다.");
  }
  check(!prompt.includes("data-result-highlight="), "문제에 결과 강조 속성이 있습니다.");
  check(answer.includes(`data-result-highlight="${total}"`), "답에서 절두 뒤 전체 수가 강조되지 않았습니다.");
}

check(Boolean(api && api.names && api.names.includes(generatorKey)), "E2 전용 생성기가 등록되지 않았습니다.");

const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-1-source-items.json"), "utf8"));
const ledgerItems = new Map(sourceLedger.items.map(item => [item.sourceItemId, item]));
const ledgerContracts = [
  { id: "6-1-u2-e2-example-2", page: 9, words: ["예제 2-2", "직육면체", "모든 꼭짓점", "면·꼭짓점·모서리"] },
  { id: "6-1-u2-e2-mission-2", page: 10, words: ["Mission 2", "정칠각기둥", "수직", "삼각기둥 7개"] },
  { id: "6-1-u2-e2-mission-5", page: 10, words: ["Mission 5", "오각기둥", "삼등분", "모든 꼭짓점"] }
];
for (const expected of ledgerContracts) {
  context = `${expected.id} / 원본 장부`;
  const item = ledgerItems.get(expected.id);
  check(Boolean(item), "원본 장부 항목이 없습니다.");
  if (!item) continue;
  check(item.pdfPage === expected.page, `원본 PDF 쪽이 ${expected.page}쪽이 아닙니다.`);
  check(item.answerContract === "single-answer-fixed-pool" && item.sourceVerified === true && item.implementationStatus === "fixed-verified-pool", "원본 장부의 검증·고정 문항 상태가 다릅니다.");
  for (const word of expected.words) check(String(item.sourceShape).includes(word), `원본 구조 설명에 '${word}'가 없습니다.`);
}

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const pools = new Set();
  const poolValues = new Map();
  const poolAnswers = new Map();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 1200; seed += 1) {
      context = `${sourceIds[variant]} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const type = { generatorKey, variant, sourceItemId: sourceIds[variant] };
        const generated = api.generate(type, 0, difficulty, seed, variant);
        const poolIndex = generated.verifiedPoolIndex;
        const expected = expectedPools[variant][poolIndex] || { values: [], answer: NaN };
        const evidence = checkCommon(generated, sourceIds[variant], difficulty, expected);
        checkVariant(variant, generated, evidence);
        const valueSignature = evidence.values.join(",");
        if (poolValues.has(poolIndex)) check(poolValues.get(poolIndex) === valueSignature, "같은 pool에서 난이도별 값이 달라졌습니다.");
        else poolValues.set(poolIndex, valueSignature);
        const answer = numberAnswer(generated.answer);
        if (poolAnswers.has(poolIndex)) check(poolAnswers.get(poolIndex) === answer, "같은 pool에서 정답이 달라졌습니다.");
        else poolAnswers.set(poolIndex, answer);
        pools.add(poolIndex);
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
  context = sourceIds[variant];
  check(pools.size === 3, "고정 pool 0, 1, 2를 모두 확인하지 못했습니다.");
  check(poolValues.size === 3 && poolAnswers.size === 3, "세 고정 pool의 값과 정답이 모두 기록되지 않았습니다.");
}

if (failures.length) {
  console.error(`6-1 2단원 개념탐구 2 각기둥과 각뿔 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`6-1 2단원 개념탐구 2 각기둥과 각뿔 감사 통과: 3유형 · 9개 고정 문항 · ${checked.toLocaleString()}회 독립 계산·pool·단일 정답·답 그림·원문 ID·난이도·도형 semantic 검사`);
