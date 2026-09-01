"use strict";

const fs = require("fs");
const path = require("path");
global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");
require("./curriculum.js");

const api = window.HSE_GENERATORS;
const runtime = window.HSE_SOURCE_INVENTORY_41;
const nativeMappings = require("./source-inventory/4-1-native-generators.json").mappings;
const generatorKey = "source41PlaneTransformThree";
const publicItems = [["4-1-u4-e3-exploration", 0], ["4-1-u4-e3-example-3-1", 1], ["4-1-u4-e3-example-3-3", 3], ["4-1-u4-e3-example-3-4", 4], ["4-1-u4-e3-mission-1", 5], ["4-1-u4-e3-mission-2", 6], ["4-1-u4-e3-mission-3", 7], ["4-1-u4-e3-mission-5", 9], ["4-1-u4-e3-mission-6", 10]];
const lockedItems = new Map([
  ["4-1-u4-e3-example-3-2", "보기의 대칭 곡선만으로 돌리기와 뒤집기 규칙을 하나로 정할 수 없습니다."],
  ["4-1-u4-e3-mission-4", "마름모가 28개일 때 58개와 60개 타일이 모두 가능해 답이 하나가 아닙니다."]
]);
const failures = [];
let generatedCount = 0;
const styles = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");

function assert(condition, message) { if (!condition) throw new Error(message); }
function check(condition, message) { if (!condition) failures.push(message); }
function cellsKey(cells) { return JSON.stringify(cells.map(([x, y]) => [x, y]).sort((left, right) => left[1] - right[1] || left[0] - right[0])); }
function rotate(cells, size, turns = 1) { let output = cells.map(point => [...point]); for (let index = 0; index < ((turns % 4) + 4) % 4; index += 1) output = output.map(([x, y]) => [size - 1 - y, x]); return output; }
function evidence(question) { const match = String(question.prompt).match(/data-source41-kind="([^"]+)" data-source41-payload="([^"]+)" data-source41-expected="([^"]+)"/); assert(match, "원문 근거 자료가 없습니다."); return { kind: match[1], payload: JSON.parse(decodeURIComponent(match[2])), expected: decodeURIComponent(match[3]) }; }
function e3Svg(html, kind) { const start = String(html).indexOf(`data-source41-e3-kind="${kind}"`); assert(start >= 0, `${kind}: 실제 SVG가 없습니다.`); const svgStart = String(html).lastIndexOf("<svg", start); const end = String(html).indexOf("</svg>", start); assert(svgStart >= 0 && end >= start, `${kind}: SVG 경계가 없습니다.`); return String(html).slice(svgStart, end + 6); }
function attr(source, name) { const match = source.match(new RegExp(`${name}="([^"]*)"`)); return match ? match[1] : ""; }
function e3Cells(html, kind) { return JSON.parse(decodeURIComponent(attr(e3Svg(html, kind), "data-cells"))); }
function planeCells(html, kind) { const start = String(html).indexOf(`data-source41-plane-kind="${kind}"`); assert(start >= 0, `${kind}: 실제 SVG가 없습니다.`); const end = String(html).indexOf("</svg>", start); return [...String(html).slice(start, end).matchAll(/data-cells="([^"]+)"/g)].map(match => JSON.parse(decodeURIComponent(match[1]))); }
function maximumIndependent(rows, cols) {
  const valid = Array.from({ length: 1 << cols }, (_, mask) => mask).filter(mask => (mask & (mask << 1)) === 0);
  const bits = mask => [...mask.toString(2)].filter(bit => bit === "1").length;
  let maximum = 0;
  const visit = (row, previous, total) => {
    if (row === rows) { maximum = Math.max(maximum, total); return; }
    valid.filter(mask => (mask & previous) === 0).forEach(mask => visit(row + 1, mask, total + bits(mask)));
  };
  visit(0, 0, 0);
  return maximum;
}

function audit(variant, generated, data) {
  const { kind, payload, expected } = data;
  assert(payload.variant === variant && payload.level >= 0 && payload.level <= 2, "원문 분기나 난이도가 다릅니다.");
  if (variant === 0 || variant === 5) {
    const answer = maximumIndependent(payload.interiorRows, payload.interiorCols);
    const expectedAnswer = variant === 0 ? 8 : 11;
    const expectedKind = variant === 0 ? "diagonal-leaf-tile-circle-maximum" : "opposite-corner-tile-circle-maximum-four-by-eight";
    assert(kind === expectedKind && answer === expectedAnswer && payload.maximum === expectedAnswer && Number(expected) === expectedAnswer, "원본 타일의 원 최대 개수가 다릅니다.");
    const tile = e3Svg(generated.prompt, variant === 0 ? "e3-exploration-tile" : "e3-mission-1-tile");
    const board = e3Svg(generated.prompt, variant === 0 ? "e3-exploration-board" : "e3-mission-1-board");
    const solution = e3Svg(generated.solution, variant === 0 ? "e3-exploration-solution" : "e3-mission-1-solution");
    assert(variant === 0 ? attr(tile, "data-tile-art") === "diagonal-leaf" && /M15 15 C54 15 95 56 95 95/.test(tile) : attr(tile, "data-tile-art") === "opposite-corner-sectors" && (tile.match(/A28 28/g) || []).length === 2, "원본 탐구와 Mission 1의 서로 다른 타일 그림이 바뀌었습니다.");
    assert(attr(board, "data-rows") === String(payload.rows) && attr(board, "data-cols") === String(payload.cols), "실제 SVG의 타일판 크기가 다릅니다.");
    assert(JSON.parse(decodeURIComponent(attr(solution, "data-circle-centers"))).length === expectedAnswer && (solution.match(/<circle /g) || []).length === expectedAnswer, "풀이 SVG의 완성 원 수가 다릅니다.");
  } else if (variant === 1) {
    assert(kind === "quarter-turn-pattern-count-left-triangle" && payload.target === 274 && payload.targetDirection === "left" && payload.positions.length === 69 && payload.positions[0] === 2 && payload.positions.at(-1) === 274 && expected === "69", "90도 반복 무늬의 세모 계산이 다릅니다.");
    const symbolTiles = [...generated.prompt.matchAll(/data-rotation="(\d+)" data-triangle-position="([^"]+)" data-symbols="circle,triangle,square,star"/g)].map(match => [Number(match[1]), match[2]]);
    assert(JSON.stringify(symbolTiles) === JSON.stringify([[0, "top"], [270, "left"], [180, "bottom"], [90, "right"]]), "실제 SVG의 네 기호와 세모 회전 방향이 다릅니다.");
  } else if (variant === 3) {
    assert(kind === "up-middle-down-middle-pattern-target-position" && payload.targetCount === 125 && payload.answer === 250 && expected === "250", "가운데 무늬 125번째의 위치가 다릅니다.");
    const positions = [...generated.prompt.matchAll(/data-position="([^"]+)"/g)].map(match => match[1]);
    const pattern = String(generated.prompt).match(/<div[^>]*data-source41-e3-kind="e3-example-3-3-pattern"[^>]*>/)?.[0] || "";
    assert(positions.join(",") === "bottom,middle,top,middle,bottom,middle,top,middle,bottom" && attr(pattern, "data-positions") === encodeURIComponent(JSON.stringify(positions)) && !/>[1-9]</.test(pattern), "실제 아홉 칸 그림의 아래-가운데-위-가운데 주기가 다릅니다.");
  } else if (variant === 4) {
    const second = rotate(payload.base, 6, 1);
    const all = [...payload.base, ...second.map(([x, y]) => [x + 6, y]), ...payload.base.map(([x, y]) => [x + 12, y])];
    assert(kind === "rotate-six-by-six-pattern-three-panels" && cellsKey(payload.turned) === cellsKey(second) && payload.candidateMatches.join(",") === "6,18,6,10" && cellsKey(payload.all) === cellsKey(all) && expected === "완성 그림", "6×18 원문 무늬의 후보 비교 또는 완성 그림이 다릅니다.");
    assert(cellsKey(e3Cells(generated.solution, "e3-example-3-4-solution")) === cellsKey(all), "풀이 SVG의 6×18 셀 자료가 계산 결과와 다릅니다.");
  } else if (variant === 6) {
    assert(kind === "repeat-counterclockwise-quarter-turn-twentieth-tile" && payload.requested === 20 && payload.answerDirection === "right" && payload.answerRotation === 90 && payload.answerMode === "draw" && expected === "처음 모양을 시계 방향으로 90° 돌린 모습", "20번째 회전 무늬의 방향이나 직접 그리기 형식이 다릅니다.");
    const blankPositions = [...generated.prompt.matchAll(/data-source41-e3-kind="e3-mission-2-(?:blank|target)" data-position="(\d+)" data-blank-tile="true"/g)].map(match => Number(match[1]));
    const solution = e3Svg(generated.solution, "e3-mission-2-solution");
    assert(blankPositions.join(",") === "2,3,4,17,18,19,20" && !/e3-mission-2-choice/.test(generated.prompt) && attr(solution, "data-rotation") === "90" && /<path d="M55 55 L95 15 V95 H15 Z"/.test(solution) && /M55 55 L95 15 M55 55 L95 95/.test(solution) && (solution.match(/stroke="#174866"/g) || []).length >= 2, "직접 그리는 20번째 빈칸이나 풀이 SVG의 회전이 다릅니다.");
  } else if (variant === 7) {
    const expectedTiles = { A: [[1, 0], [2, 0], [2, 1], [2, 2]], B: [[0, 0], [1, 0], [0, 1], [0, 2]], C: [[0, 0], [1, 0], [2, 0], [2, 1]], D: [[0, 0], [1, 0], [2, 0], [0, 1]], E: [[2, 0], [2, 1], [1, 2], [2, 2]], F: [[0, 0], [0, 1], [0, 2], [1, 2]] };
    assert(kind === "two-row-four-step-polyomino-pattern" && payload.top.join(",") === "A,B,C,D,A,B,C,D" && payload.bottom.join(",") === "D,C,E,F,D,C,E,F" && payload.answerTop.join(",") === "B,C,D" && payload.answerBottom.join(",") === "C,E,F" && expected === "위 B-C-D, 아래 C-E-F", "두 줄 꺾인 네 칸 무늬의 주기가 다릅니다.");
    assert(Object.keys(expectedTiles).every(key => cellsKey(payload.tiles[key]) === cellsKey(expectedTiles[key])), "원본 A-F 꺾인 네 칸 모양의 색칠 위치가 다릅니다.");
    const prompt = e3Svg(generated.prompt, "e3-mission-3-pattern"); const solution = e3Svg(generated.solution, "e3-mission-3-solution");
    assert(attr(prompt, "data-top") === "A,B,C,D,A,B,C,D" && attr(prompt, "data-bottom") === "D,C,E,F,D,C,E,F" && (prompt.match(/data-panel-index=/g) || []).length === 16 && (prompt.match(/data-blank="true"/g) || []).length === 6 && (solution.match(/data-panel-index=/g) || []).length === 16 && !(solution.match(/data-blank="true"/g) || []).length && !/>[A-F?]</.test(`${prompt}${solution}`), "실제 SVG의 2행 8열·열여섯 칸·여섯 빈칸이 다릅니다.");
  } else if (variant === 9) {
    assert(kind === "identify-two-rotation-equivalent-base-tiles" && payload.equivalenceClasses.join(",") === "corner,curve" && expected === "곡선 타일과 모서리 타일", "기본 타일 두 묶음이 다릅니다.");
    const pattern = e3Svg(generated.prompt, "e3-mission-5-pattern");
    const types = [...pattern.matchAll(/data-tile-type="([^"]+)"/g)].map(match => match[1]);
    const rotations = [...pattern.matchAll(/data-tile-type="([^"]+)" data-rotation="(\d+)"/g)].map(match => [match[1], Number(match[2])]);
    const origins = [...pattern.matchAll(/transform="translate\((\d+) (\d+)\)" data-tile-index/g)].map(match => [Number(match[1]), Number(match[2])]);
    const expectedRotations = [["curve", 180], ["curve", 270], ["corner", 0], ["corner", 90], ["curve", 180], ["curve", 270], ["curve", 90], ["curve", 0], ["corner", 270], ["corner", 180], ["curve", 90], ["curve", 0]];
    const solutionTiles = [...generated.solution.matchAll(/data-source41-e3-kind="e3-mission-5-solution" data-tile-type="(curve|corner)"/g)].map(match => match[1]);
    assert(payload.rows === 2 && payload.cols === 6 && attr(pattern, "data-rows") === "2" && attr(pattern, "data-cols") === "6" && types.length === 12 && new Set(types).size === 2 && new Set(types).has("curve") && new Set(types).has("corner") && (pattern.match(/data-tile-index=/g) || []).length === 12 && JSON.stringify(rotations) === JSON.stringify(expectedRotations) && JSON.stringify(solutionTiles) === JSON.stringify(["curve", "corner"]) && JSON.stringify(origins) === JSON.stringify(Array.from({ length: 12 }, (_, index) => [(index % 6) * 58, Math.floor(index / 6) * 58])) && /M0 0 C35 9 35 49 0 58/.test(pattern) && /M40 40 h18 v18/.test(pattern), "실제 SVG의 이어진 2행 6열 합성 무늬와 두 기본 타일 묶음이 다릅니다.");
  } else if (variant === 10) {
    assert(kind === "count-two-transparent-corner-tile-symmetry-classes" && payload.pairs.length === 16 && payload.representatives.length === 6 && payload.answer === 6 && expected === "6", "투명 타일 방향쌍의 여섯 묶음 계산이 다릅니다.");
    const sourceTile = e3Svg(generated.prompt, "e3-mission-6-source"); const emptyBoard = e3Svg(generated.prompt, "e3-mission-6-board");
    const corners = [...generated.solution.matchAll(/data-quarter-circle="(ul|ur|lr|ll)"/g)].map(match => match[1]);
    assert(attr(sourceTile, "data-corner") === "lr" && (sourceTile.match(/data-quarter-circle=/g) || []).length === 1 && attr(emptyBoard, "data-empty-pair") === "true" && !(emptyBoard.match(/data-quarter-circle=/g) || []).length && (generated.solution.match(/data-source41-e3-kind="e3-mission-6-solution"/g) || []).length === 6 && corners.length === 12 && new Set(corners).size === 4 && (generated.solution.match(/A80 80/g) || []).length === 12, "기본 타일·빈 두 칸 또는 풀이 SVG의 네 방향 큰 4분원과 여섯 대표가 다릅니다.");
  }
}

for (const [sourceItemId, variant] of publicItems) {
  const item = runtime.items.find(entry => entry.sourceItemId === sourceItemId);
  const mapping = nativeMappings.find(entry => entry.sourceItemId === sourceItemId);
  check(mapping?.generatorKey === generatorKey && mapping.variant === variant, `${sourceItemId}: 전용 생성기 매핑이 다릅니다.`);
  check(item?.generatorKey === generatorKey && item.variant === variant && item.reviewLocked === false, `${sourceItemId}: 공개 상태가 다릅니다.`);
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
    try {
      const generated = api.generate(item, 0, difficulty, seed, variant);
      generatedCount += 1;
      assert(generated?.prompt && generated?.solution && generated?.answer !== undefined, "문제·정답·풀이가 비었습니다.");
      assert(!/undefined|null|NaN|Infinity/.test(`${generated.prompt}${generated.solution}${generated.answer}`), "깨진 값이 보입니다.");
      audit(variant, generated, evidence(generated));
    } catch (error) { failures.push(`${sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`); break; }
  }
}

for (const [sourceItemId, reason] of lockedItems) {
  const item = runtime.items.find(entry => entry.sourceItemId === sourceItemId);
  check(item?.reviewLocked === true && item?.generatorKey === "" && item?.reviewReason === reason, `${sourceItemId}: 잠금 사유나 공개 상태가 다릅니다.`);
  check(!nativeMappings.some(entry => entry.sourceItemId === sourceItemId), `${sourceItemId}: 잠긴 항목에 생성기 매핑이 남아 있습니다.`);
}

check(generatedCount >= 13500, `생성 횟수는 13,500회 이상이어야 하나 ${generatedCount}회입니다.`);
check(/\.geometry-diagram \.source41-e3-fill\{fill:#2e709e/.test(styles) && /\.geometry-diagram \.source41-e3-corner-fill\{fill:#78b4d6/.test(styles) && /\.geometry-diagram \.source41-e3-leaf\{fill:#dceffd/.test(styles), "공통 SVG 규칙보다 강한 색칠 스타일이 없어 그림이 선만 보일 수 있습니다.");
if (failures.length) { console.error(`4-1 평면도형 이동 개념탐구 3 감사 실패: ${failures.length}건`); console.error(failures.slice(0, 40).join("\n")); process.exit(1); }
console.log(`4-1 평면도형 이동 개념탐구 3 감사 통과: 공개 9유형 · 잠금 2유형 · ${generatedCount.toLocaleString()}회 독립 생성 · 실제 SVG 역검사`);
