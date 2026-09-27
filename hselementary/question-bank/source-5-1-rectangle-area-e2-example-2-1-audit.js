"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const sourceItemId = "5-1-u6-e2-example-2-1";
const failures = [];
let checked = 0;

const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (markup, name) => markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const answerNumber = value => Number(String(value).match(/-?\d+(?:\.\d+)?/)?.[0]);

const semester = curriculum.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u6");
const type = unit?.subunits.flatMap(item => item.types).find(item => item.sourceItemId === sourceItemId);

check(Boolean(type), "개념탐구 2 예제 2-1 유형을 찾을 수 없습니다.");
check(type?.generatorKey === "source51RectangleTriangleAreaE2", "원본 전용 생성기에 연결되지 않았습니다.");
check(type?.variant === 5, `원본 분기 번호가 5가 아닙니다: ${type?.variant}`);
check(!type?.reviewLocked, "검산이 끝난 유형이 잠겨 있습니다.");
check(type?.generationMode === "fixed-verified-pool" && type?.verifiedVariantCount === 3, "검증된 3문항 고정 묶음이 아닙니다.");
check(type?.answerVisualRequired && type?.answerVisualStatus === "verified", "정답 그림 검수 상태가 아닙니다.");

const poolIndexes = new Set();
const difficultyDesigns = new Set();
for (const difficulty of [-1, 0, 1]) {
  for (let seed = 1; seed <= 300; seed += 1) {
    try {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      const open = generated?.prompt.match(/<svg class="geometry-diagram rectangle-triangle-area-e2"([^>]*)>/)?.[1] || "";
      const answerOpen = generated?.answerVisual.match(/<svg class="geometry-diagram rectangle-triangle-area-e2 is-solved"([^>]*)>/)?.[1] || "";
      check(Boolean(open && answerOpen), `${difficulty}/${seed}: 문제 또는 정답 그림이 없습니다.`);
      if (!open || !answerOpen) continue;

      const width = Number(attr(open, "data-outer-width"));
      const height = Number(attr(open, "data-outer-height"));
      const lowerWidth = Number(attr(open, "data-lower-width"));
      const upperArea = Number(attr(open, "data-upper-area"));
      const lowerArea = Number(attr(open, "data-lower-area"));
      const candidateCount = Number(attr(open, "data-answer-candidate-count"));
      const difficultyDesign = attr(open, "data-difficulty-design");
      const targetHeight = Number(attr(answerOpen, "data-target-height"));
      const candidates = Array.from({ length: height - 1 }, (_, index) => index + 1)
        .filter(candidate => lowerWidth * (height - candidate) === width * height / 2);

      check([width, height, lowerWidth, upperArea, lowerArea, targetHeight].every(Number.isFinite), `${difficulty}/${seed}: 그림의 수치 근거가 깨졌습니다.`);
      check(upperArea === width * height / 2 && lowerArea === upperArea, `${difficulty}/${seed}: ㉠과 ㉡의 넓이가 같지 않습니다.`);
      check(candidateCount === 1 && candidates.length === 1, `${difficulty}/${seed}: 정답 후보가 하나가 아닙니다.`);
      check(candidates[0] === targetHeight, `${difficulty}/${seed}: 그림의 ㉢ 길이가 독립 계산과 다릅니다.`);
      check(answerNumber(generated.answer) === targetHeight, `${difficulty}/${seed}: 표시 정답이 독립 계산과 다릅니다.`);
      check(difficultyDesign === ({ "-1": "given-half-area", "0": "source", "1": "derive-height-from-perimeter" })[String(difficulty)], `${difficulty}/${seed}: 난이도별 조건 설계가 다릅니다.`);
      if (difficulty === -1) check(/㉡의 넓이가 \d+cm²/.test(generated.prompt), `${difficulty}/${seed}: 쉬움에 한 부분의 넓이가 주어지지 않았습니다.`);
      if (difficulty === 0) check(/세로가 \d+cm/.test(generated.prompt) && /두 부분의 넓이가 같을 때/.test(generated.prompt), `${difficulty}/${seed}: 원본 조건이 유지되지 않았습니다.`);
      if (difficulty === 1) check(/둘레가 \d+cm/.test(generated.prompt) && />세로<\/text>/.test(generated.prompt), `${difficulty}/${seed}: 어려움에 세로를 먼저 구하는 조건이 없습니다.`);
      check(!/data-target-height=/.test(generated.prompt), `${difficulty}/${seed}: 문제 그림에 정답 길이 데이터가 노출됩니다.`);
      check(generated.answerVisual.includes(`>${targetHeight} cm</text>`) && generated.answerVisual.includes(`㉢ = ${targetHeight}cm`), `${difficulty}/${seed}: 풀이 그림에 ㉢의 정답이 표시되지 않습니다.`);
      check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 생성 결과의 고정 묶음 계약이 다릅니다.`);
      check(generated.sourceItemId === sourceItemId, `${difficulty}/${seed}: 생성 결과의 원본 ID가 다릅니다.`);
      poolIndexes.add(generated.verifiedPoolIndex);
      difficultyDesigns.add(difficultyDesign);
      checked += 1;
    } catch (error) {
      failures.push(`${difficulty}/${seed}: ${error.message}`);
    }
  }
}

check(poolIndexes.size === 3 && [0, 1, 2].every(index => poolIndexes.has(index)), "검증된 고정 묶음 3개가 모두 생성되지 않았습니다.");
check(difficultyDesigns.size === 3, "쉬움·원본·어려움의 풀이 단계가 서로 다르지 않습니다.");

if (failures.length) {
  console.error(`5-1 6단원 개념탐구 2 예제 2-1 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 50).join("\n"));
  process.exit(1);
}

console.log(`5-1 6단원 개념탐구 2 예제 2-1 감사 통과: ${checked.toLocaleString()}회 독립 계산 · 단일 정답 · 문제/풀이 그림 분리 · 고정 묶음 3개`);
