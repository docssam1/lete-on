"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const sourceItemId = "5-1-u6-e4-example-4-1";
const failures = [];
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const near = (left, right, tolerance = 1e-6) => Math.abs(left - right) <= tolerance;
const attr = (markup, name) => markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const number = value => Number(String(value).match(/-?\d+(?:\.\d+)?/)?.[0]);
const pointModel = value => Object.fromEntries(String(value).split(";").map(entry => {
  const [id, coords] = entry.split(":");
  return [id, coords.split(",").map(Number)];
}));
const points = value => String(value || "").trim().split(/\s+/).filter(Boolean).map(point => point.split(",").map(Number));
const samePoint = (left, right) => Array.isArray(left) && Array.isArray(right) && near(left[0], right[0]) && near(left[1], right[1]);
const sameLine = (line, start, end) => Boolean(line) && near(line[0], start[0]) && near(line[1], start[1]) && near(line[2], end[0]) && near(line[3], end[1]);
const line = (body, className) => {
  const match = body.match(new RegExp(`<line class="[^"]*${className}[^"]*"[^>]*x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"[^>]*\\/>`));
  return match ? match.slice(1).map(Number) : null;
};
const path = (body, className) => body.match(new RegExp(`<path class="[^"]*${className}[^"]*"[^>]*d="([^"]+)"[^>]*\\/>`))?.[1] || "";
const parseSvg = markup => {
  const match = markup.match(/<svg class="geometry-diagram source51-e4-ratio-trapezoid[^\"]*"([^>]*)>([\s\S]*?)<\/svg>/);
  if (!match) return null;
  const body = match[2];
  return {
    open: match[1],
    body,
    shaded: points(body.match(/<polygon class="source51-e4-ratio-shaded"[^>]*points="([^"]+)"/)?.[1]),
    unshaded: points(body.match(/<polygon class="source51-e4-ratio-unshaded"[^>]*points="([^"]+)"/)?.[1]),
    target: line(body, "source51-e4-ratio-target"),
    knownHeight: line(body, "source51-e4-ratio-known-height"),
    targetMarkup: body.match(/<line class="source51-e4-ratio-target"[^>]*\/>/)?.[0] || "",
    knownHeightMarkup: body.match(/<line class="source51-e4-ratio-known-height"[^>]*\/>/)?.[0] || ""
  };
};

const semester = curriculum.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u6");
const type = unit?.subunits.flatMap(item => item.types).find(item => item.sourceItemId === sourceItemId);
const inventory = require("./source-inventory/5-1-u6-e3-e4-readiness-review.json").items.find(item => item.sourceItemId === sourceItemId);

check(Boolean(type), "예제 4-1 유형을 찾을 수 없습니다.");
check(type?.generatorKey === "source51TrapezoidShadedRatioHeightE4" && type?.variant === 2, "예제 4-1 전용 생성기 또는 분기 번호가 다릅니다.");
check(!type?.reviewLocked && type?.generationMode === "fixed-verified-pool" && type?.verifiedVariantCount === 3, "예제 4-1 공개 고정 묶음 계약이 다릅니다.");
check(type?.answerVisualRequired && type?.answerVisualStatus === "verified", "예제 4-1 정답 그림 계약이 없습니다.");
check(inventory?.implementationStatus === "implemented-fixed-verified-pool" && inventory?.publicDecision === "ready", "원본 분류표의 공개 상태가 다릅니다.");

const seenPools = new Set();
const seenDesigns = new Set();
for (const difficulty of [-1, 0, 1]) {
  for (let seed = 1; seed <= 1000; seed += 1) {
    const context = `${difficulty}/${seed}`;
    try {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      const problem = parseSvg(generated.prompt);
      const solution = parseSvg(generated.answerVisual);
      check(Boolean(problem && solution), `${context}: 문제 또는 정답 SVG가 없습니다.`);
      if (!problem || !solution) continue;
      const top = Number(attr(problem.open, "data-top-base"));
      const bottom = Number(attr(problem.open, "data-bottom-base"));
      const lowerHeight = Number(attr(problem.open, "data-lower-height"));
      const totalHeight = Number(attr(problem.open, "data-total-height"));
      const shadedRatio = Number(attr(problem.open, "data-shaded-ratio"));
      const unshadedArea = Number(attr(problem.open, "data-unshaded-area"));
      const shadedArea = Number(attr(problem.open, "data-shaded-area"));
      const totalArea = Number(attr(problem.open, "data-total-area"));
      const answer = number(generated.answer);
      const model = pointModel(attr(problem.open, "data-model-points"));
      const candidates = Array.from({ length: 60 }, (_, index) => index + 1)
        .filter(candidate => (top + bottom) * candidate / 2 === totalArea)
        .map(candidate => candidate - lowerHeight)
        .filter(candidate => Number.isInteger(candidate) && candidate > 0);
      const design = attr(problem.open, "data-difficulty-design");
      const expectedDesign = ({ "-1": "unshaded-area-cue", "0": "source-ratio", "1": "unscaffolded-ratio" })[String(difficulty)];

      check(attr(problem.open, "data-source-item") === sourceItemId && Number(attr(problem.open, "data-answer-candidate-count")) === 1, `${context}: 원본 ID 또는 단일 답 계약이 다릅니다.`);
      check(!/data-target-height=/.test(generated.prompt), `${context}: 문제 그림 DOM에 정답 길이가 노출됩니다.`);
      check(Number(attr(solution.open, "data-target-height")) === answer && attr(solution.open, "data-result-highlight") === `${answer}cm`, `${context}: 정답 그림의 답 표시가 다릅니다.`);
      check(design === expectedDesign, `${context}: 난이도별 조건 설계가 다릅니다.`);
      check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3 && generated.sourceItemId === sourceItemId, `${context}: 생성 결과의 고정 묶음 계약이 다릅니다.`);
      check([top, bottom, lowerHeight, totalHeight, shadedRatio, unshadedArea, shadedArea, totalArea, answer].every(Number.isFinite), `${context}: 계산 수치가 깨졌습니다.`);
      check(unshadedArea === bottom * lowerHeight / 2 && shadedArea === unshadedArea * shadedRatio && totalArea === unshadedArea + shadedArea, `${context}: 색칠·비색칠 넓이 관계가 다릅니다.`);
      check(totalArea === (top + bottom) * totalHeight / 2 && candidates.length === 1 && candidates[0] === answer && answer === totalHeight - lowerHeight, `${context}: 독립 넓이 계산 또는 단일 답이 다릅니다.`);
      check(problem.shaded.length === 4 && problem.unshaded.length === 3, `${context}: 색칠 사다리꼴 또는 비색칠 삼각형이 SVG에 없습니다.`);
      check(samePoint(problem.shaded[0], model.topLeft) && samePoint(problem.shaded[1], model.topRight) && samePoint(problem.shaded[2], model.bottomRight) && samePoint(problem.shaded[3], model.bottomLeft), `${context}: 색칠 영역이 점 모델과 다릅니다.`);
      check(samePoint(problem.unshaded[0], model.bottomLeft) && samePoint(problem.unshaded[1], model.bottomRight) && samePoint(problem.unshaded[2], model.interior), `${context}: 비색칠 삼각형이 점 모델과 다릅니다.`);
      check(near(model.topLeft[1], model.topRight[1]) && near(model.bottomLeft[1], model.bottomRight[1]) && near(model.topMid[0], model.interior[0]) && near(model.interior[0], model.foot[0]), `${context}: 밑변 또는 수직선의 점 관계가 다릅니다.`);
      check(sameLine(problem.target, model.topMid, model.interior) && sameLine(problem.knownHeight, model.interior, model.foot), `${context}: ㅁ→ㅂ 또는 ㅂ→ㅅ 선분이 점 모델과 다릅니다.`);
      check(
        /data-target-segment="ㅁㅂ"/.test(problem.targetMarkup) && /data-owner-id="segment-ㅁㅂ"/.test(problem.targetMarkup)
          && /data-known-segment="ㅂㅅ"/.test(problem.knownHeightMarkup) && /data-owner-id="segment-ㅂㅅ"/.test(problem.knownHeightMarkup),
        `${context}: 구하는 ㅁㅂ와 알려진 ㅂㅅ의 SVG 의미가 구분되지 않았습니다.`
      );
      const scale = (model.bottomRight[0] - model.bottomLeft[0]) / bottom;
      check(near((model.foot[1] - model.interior[1]) / scale, lowerHeight) && near((model.foot[1] - model.topMid[1]) / scale, totalHeight), `${context}: ㅂ→ㅅ 또는 전체 높이가 실제 SVG와 다릅니다.`);
      const topRightAngle = problem.body.match(/<path class="source51-e4-ratio-right-angle source51-e4-ratio-right-angle-top"[^>]*data-owner-id="topMid-top-base-target" d="([^"]+)"/ )?.[1] || "";
      const footRightAngle = problem.body.match(/<path class="source51-e4-ratio-right-angle"[^>]*data-owner-id="interior-foot-bottom-base" d="([^"]+)"/ )?.[1] || "";
      check(topRightAngle.includes(`M ${model.topMid[0]} ${model.topMid[1] + 13}`) && footRightAngle.includes(`M ${model.foot[0]} ${model.foot[1] - 13}`), `${context}: ㅁ 또는 ㅅ의 직각 표시가 없습니다.`);
      check(/data-label-for="ㅁ"/.test(problem.body) && /data-label-for="ㅂ"/.test(problem.body) && /data-label-for="ㅅ"/.test(problem.body), `${context}: ㅁ·ㅂ·ㅅ 점 이름이 빠졌습니다.`);
      check(/data-label-for="segment-ㅂㅅ"/.test(problem.body) && /data-owner-id="trapezoid-height"/.test(solution.body), `${context}: 5cm, ㅁㅂ, 전체 높이의 소유 정보가 분리되지 않았습니다.`);
      check(/data-layout-role="shaded-region"/.test(problem.body) && /data-layout-role="unshaded-triangle"/.test(problem.body), `${context}: 색칠·비색칠 영역 역할이 없습니다.`);
      check(solution.body.includes(`ㅁㅂ = ${answer} cm`) && solution.body.includes(`전체 높이 ${totalHeight} cm`), `${context}: 답 그림에 구하는 선분 또는 전체 높이가 없습니다.`);
      if (difficulty === -1) check(generated.prompt.includes(`색칠하지 않은 삼각형의 넓이는 ${unshadedArea}cm²`), `${context}: 쉬움 단계의 넓이 안내가 없습니다.`);
      else check(!generated.prompt.includes(`색칠하지 않은 삼각형의 넓이는 ${unshadedArea}cm²`), `${context}: 기준 또는 어려움에 쉬움 안내가 남아 있습니다.`);
      if (top === 18 && bottom === 22 && lowerHeight === 5 && shadedRatio === 3) check(answer === 6 && totalHeight === 11, `${context}: 원본 18·22·5·3배 구조의 답이 6cm가 아닙니다.`);
      seenPools.add(Number(attr(problem.open, "data-verified-pool-index")));
      seenDesigns.add(design);
      checked += 1;
    } catch (error) {
      failures.push(`${context}: ${error.message}`);
    }
  }
}

check(seenPools.size === 3 && [0, 1, 2].every(index => seenPools.has(index)), "고정 검증 변형 3개가 모두 생성되지 않았습니다.");
check(seenDesigns.size === 3, "쉬움·기준·어려움의 조건 부담이 구분되지 않았습니다.");

if (failures.length) {
  console.error(`5-1 6단원 예제 4-1 색칠 넓이 비 사다리꼴 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\\n"));
  process.exit(1);
}

console.log(`5-1 6단원 예제 4-1 색칠 넓이 비 사다리꼴 감사 통과: ${checked.toLocaleString()}회 실제 SVG·점 모델·두 직각·색칠 영역·독립 계산·단일 답 검사`);
