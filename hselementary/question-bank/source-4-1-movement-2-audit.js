"use strict";

global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");
require("./curriculum.js");

const api = window.HSE_GENERATORS;
const runtime = window.HSE_SOURCE_INVENTORY_41;
const nativeMappings = require("./source-inventory/4-1-native-generators.json").mappings;
const generatorKey = "source41PlaneTransformTwo";
const publicItems = [["4-1-u4-e2-exploration", 0], ["4-1-u4-e2-example-2-1", 1], ["4-1-u4-e2-example-2-4", 4], ["4-1-u4-e2-mission-1", 5], ["4-1-u4-e2-mission-3", 8], ["4-1-u4-e2-mission-4", 9], ["4-1-u4-e2-mission-5", 10], ["4-1-u4-e2-mission-6", 11]];
const lockedItems = new Map([["4-1-u4-e2-example-2-2", "원문 답 그림과 독립 계산 결과가 달라 공개할 수 없습니다."], ["4-1-u4-e2-example-2-3", "두 서술의 이동 결과가 같아 답을 하나로 고를 수 없습니다."], ["4-1-u4-e2-mission-2", "위쪽과 아래쪽으로 뒤집은 결과가 같아 답이 하나로 정해지지 않습니다."]]);
const labels = ["①", "②", "③", "④"];
const failures = [];
let generatedCount = 0;

function assert(condition, message) { if (!condition) throw new Error(message); }
function check(condition, message) { if (!condition) failures.push(message); }
function polygonKey(vertices) { const points = vertices.map(point => [...point]); const keys = []; for (const sequence of [points, [...points].reverse()]) for (let index = 0; index < sequence.length; index += 1) keys.push(JSON.stringify([...sequence.slice(index), ...sequence.slice(0, index)])); return keys.sort()[0] || "[]"; }
function cellKey(cells) { return JSON.stringify(cells.map(point => [...point]).sort((left, right) => left[1] - right[1] || left[0] - right[0])); }
function rotateVertices(vertices, size, turns) { let output = vertices.map(point => [...point]); for (let index = 0; index < ((turns % 4) + 4) % 4; index += 1) output = output.map(([x, y]) => [size - y, x]); return output; }
function reflectVertices(vertices, size, axis) { return vertices.map(([x, y]) => axis === "vertical" ? [size - x, y] : [x, size - y]); }
function rotateCells(cells, size, turns) { let output = cells.map(point => [...point]); for (let index = 0; index < ((turns % 4) + 4) % 4; index += 1) output = output.map(([x, y]) => [size - 1 - y, x]); return output; }
function reflectCells(cells, size, axis) { return cells.map(([x, y]) => axis === "vertical" ? [size - 1 - x, y] : [x, size - 1 - y]); }
function evidence(question) { const match = String(question.prompt).match(/data-source41-kind="([^"]+)" data-source41-payload="([^"]+)" data-source41-expected="([^"]+)"/); assert(match, "원문 근거 자료가 없습니다."); return { kind: match[1], payload: JSON.parse(decodeURIComponent(match[2])), expected: decodeURIComponent(match[3]) }; }
function svg(html, kind) { const start = String(html).indexOf(`data-source41-plane-kind="${kind}"`); assert(start >= 0, `${kind}: 실제 SVG가 없습니다.`); return String(html).slice(start, String(html).indexOf("</svg>", start)); }
function renderedVertices(html, kind) { return [...svg(html, kind).matchAll(/data-vertices="([^"]+)"/g)].map(match => JSON.parse(decodeURIComponent(match[1]))); }
function renderedCells(html, kind) { return [...svg(html, kind).matchAll(/data-cells="([^"]+)"/g)].map(match => JSON.parse(decodeURIComponent(match[1]))); }
function renderedText(html, kind, className) { const expression = new RegExp(`<text class="${className}([^\"]*)"([^>]*)>([^<]*)<\\/text>`, "g"); return [...svg(html, kind).matchAll(expression)].map(match => { const attributes = match[2]; const value = name => (attributes.match(new RegExp(`\\s${name}="([^\"]+)"`)) || [])[1]; return { classSuffix: match[1], x: Number(value("x")), y: Number(value("y")), text: match[3], sector: value("data-sector-label"), star: value("data-star-label") }; }); }
function assertChoice(payload, expected) { assert(payload.choices.length === 4, "보기는 네 개여야 합니다."); assert(new Set(payload.choices.map(polygonKey)).size === 4, "보기 네 개는 서로 다른 다각형이어야 합니다."); const index = payload.choices.findIndex(choice => polygonKey(choice) === polygonKey(expected)); assert(index >= 0 && labels[index] === payload.answer, "정답 보기 위치가 계산 결과와 다릅니다."); }
function assertPolygonSvg(html, kind, expectedCount) { const source = svg(html, kind); const panels = renderedVertices(html, kind); assert(panels.length === expectedCount, `${kind}: 실제 꼭짓점 패널 수가 다릅니다.`); assert((source.match(/<polygon class="source41-plane-polygon" points="[^"]+"\/>/g) || []).length === expectedCount, `${kind}: 실제 polygon points가 빠졌습니다.`); panels.forEach(vertices => assert(vertices.length >= 5 && vertices.every(([x, y]) => Number.isInteger(x) && Number.isInteger(y)), `${kind}: 꼭짓점 좌표가 올바르지 않습니다.`)); }
function sectorResult(payload) { const byLabel = new Map(payload.sectorVectors.map(item => [item.label, item.vector])); const byVector = new Map(payload.sectorVectors.map(item => [item.vector.join(","), item.label])); let point = [...byLabel.get(payload.start)]; const clockwise = turns => { for (let index = 0; index < ((turns % 4) + 4) % 4; index += 1) point = [-point[1], point[0]]; }; point = [-point[0], point[1]]; for (let index = 0; index < payload.counts[1]; index += 1) clockwise(2); for (let index = 0; index < payload.counts[2]; index += 1) point = [point[0], -point[1]]; for (let index = 0; index < payload.counts[3]; index += 1) clockwise(1); return byVector.get(point.join(",")); }

function auditVariant(variant, generated, data) {
  const { payload, expected } = data;
  assert(payload.variant === variant && payload.level >= 0 && payload.level <= 2, "원문 분기나 난이도가 다릅니다.");
  if (variant === 0) {
    const correct = rotateVertices(payload.target.original, payload.size, 3);
    const expectedCandidateIds = ["clockwise90", "halfTurn", "counterclockwise90", "leftRight", "upDown"];
    const applyMove = (vertices, moveId) => moveId === "clockwise90" ? rotateVertices(vertices, payload.size, 1) : moveId === "halfTurn" ? rotateVertices(vertices, payload.size, 2) : moveId === "counterclockwise90" ? rotateVertices(vertices, payload.size, 3) : moveId === "leftRight" ? reflectVertices(vertices, payload.size, "vertical") : reflectVertices(vertices, payload.size, "horizontal");
    const applySymbols = (vertices, symbols, assignment) => symbols.reduce((next, symbol) => applyMove(next, assignment.get(symbol)), vertices);
    const assignments = [];
    for (const first of expectedCandidateIds) for (const second of expectedCandidateIds) for (const third of expectedCandidateIds) {
      if (new Set([first, second, third]).size !== 3) continue;
      const assignment = new Map([["◑", first], ["◈", second], ["▣", third]]);
      if (payload.conditions.every(condition => polygonKey(applySymbols(condition.original, condition.symbols, assignment)) === polygonKey(condition.result))) assignments.push(assignment);
    }
    assert(data.kind === "infer-three-symbol-transforms-and-complete" && JSON.stringify(payload.symbols) === JSON.stringify(["◑", "◈", "▣"]) && payload.conditions.length === 3, "세 기호 연쇄의 원문 구조가 다릅니다.");
    assert(JSON.stringify(payload.candidates.map(candidate => candidate.id)) === JSON.stringify(expectedCandidateIds), "가능한 이동 후보 전체가 다릅니다.");
    assert(assignments.length === 1 && assignments[0].get("◑") === "leftRight" && assignments[0].get("◈") === "clockwise90" && assignments[0].get("▣") === "halfTurn", "세 조건을 동시에 만족하는 기호 배정은 원문 배정 하나뿐이어야 합니다.");
    assert(JSON.stringify(payload.conditions.map(condition => condition.symbols)) === JSON.stringify([["◑"], ["◈", "◑"], ["◑", "▣"]]) && JSON.stringify(payload.target.symbols) === JSON.stringify(["◈", "▣"]), "조건과 목표의 기호 연쇄 순서가 원문과 다릅니다.");
    const starts = [...payload.conditions.map(condition => condition.original), payload.target.original];
    assert(new Set(starts.map(polygonKey)).size === 4, "조건 A·B·C와 목표 D의 시작 다각형은 모두 달라야 합니다.");
    assert(polygonKey(payload.correct) === polygonKey(correct) && polygonKey(applySymbols(payload.target.original, payload.target.symbols, assignments[0])) === polygonKey(correct), "목표 ◈ 뒤 ▣의 결과는 반시계 방향 90°여야 합니다.");
    const cluePanels = renderedVertices(generated.prompt, "symbol-rule-clues");
    const expectedPanels = payload.conditions.flatMap(condition => [condition.original, condition.result]);
    assert(cluePanels.length === 6 && cluePanels.every((vertices, index) => polygonKey(vertices) === polygonKey(expectedPanels[index])), "문제 SVG에는 조건별 시작과 최종 결과만 정확히 보여야 합니다.");
    const targetPanels = renderedVertices(generated.prompt, "symbol-chain-start");
    assert(targetPanels.length === 1 && polygonKey(targetPanels[0]) === polygonKey(payload.target.original), "목표의 별도 시작 다각형 D가 실제 SVG에 있어야 합니다.");
    assert(/조건 1[\s\S]*◑[\s\S]*조건 2[\s\S]*◈ → ◑[\s\S]*조건 3[\s\S]*◑ → ▣[\s\S]*목표[\s\S]*◈ → ▣/.test(generated.prompt), "문제 화면의 세 조건과 목표 기호 연쇄가 원문 순서대로 보여야 합니다.");
    assertChoice({ ...payload, answer: expected }, correct); assertPolygonSvg(generated.prompt, "symbol-rule-clues", 6); assertPolygonSvg(generated.prompt, "symbol-chain-choices", 4);
  } else if (variant === 1 || variant === 5) {
    const correct = reflectVertices(payload.base, payload.size, "horizontal");
    assert(variant === 1 ? data.kind === "repeat-clockwise-quarter-turn-and-left-right-flip" && payload.turnCount === 6 && payload.flipCount === 11 : data.kind === "repeat-half-turn-then-bottom-flip" && payload.halfTurnCount === 2 && payload.flipCount === 5, "원문 반복 횟수가 다릅니다.");
    assert(polygonKey(payload.correct) === polygonKey(correct), "반복 이동의 결과가 위아래 대칭과 다릅니다.");
    assertChoice({ ...payload, answer: expected }, correct); assertPolygonSvg(generated.prompt, variant === 1 ? "repeat-turn-and-flip-choices" : "half-turn-and-flip-choices", 4);
  } else if (variant === 4) {
    assert(data.kind === "track-eight-sectors-through-repeated-transforms" && payload.sectors.length === 8 && sectorResult(payload) === "마" && payload.correct === "마" && expected === "마", "실제 영역 좌표 변환 결과는 아에서 마여야 합니다.");
    const source = svg(generated.prompt, "eight-sector-track");
    assert(/width="100" height="100"/.test(source) && (source.match(/class="source41-plane-sector"/g) || []).length === 8, "8영역은 정사각형 안의 여덟 삼각 영역이어야 합니다.");
    const sectorLabels = renderedText(generated.prompt, "eight-sector-track", "source41-plane-sector-label");
    assert(sectorLabels.length === 8 && sectorLabels.map(item => item.text).join(",") === "나,다,라,마,바,사,아,가" && sectorLabels.every(item => Number.isFinite(item.x) && Number.isFinite(item.y) && item.x >= 20 && item.x <= 120 && item.y >= 20 && item.y <= 120), "원문 순서의 나·다·라·마·바·사·아·가 영역 이름 좌표가 실제 SVG에 있어야 합니다.");
    const startStar = renderedText(generated.prompt, "eight-sector-track", "source41-plane-sector-star"); const finalStar = renderedText(generated.solution, "eight-sector-track-result", "source41-plane-sector-star");
    const labelByName = new Map(sectorLabels.map(item => [item.text, item]));
    assert(startStar.length === 1 && startStar[0].star === "아" && startStar[0].text === "★" && (startStar[0].x !== labelByName.get("아").x || startStar[0].y !== labelByName.get("아").y), "처음 별은 아 영역의 라벨과 겹치지 않고 보여야 합니다."); assert(finalStar.length === 1 && finalStar[0].star === "마" && finalStar[0].text === "★", "마지막 별은 마 영역에 보여야 합니다.");
  } else if (variant === 8) {
    const correct = rotateVertices(payload.base, payload.size, 29);
    assert(data.kind === "continue-four-step-transform-cycle" && payload.requested === 30 && polygonKey(payload.correct) === polygonKey(correct) && polygonKey(correct) === polygonKey(payload.frames[1]) && payload.frames[0].length === 5, "30번째 불규칙 5각형 주기 구조가 다릅니다.");
    assertChoice({ ...payload, answer: expected }, correct); assertPolygonSvg(generated.prompt, "four-cycle-sequence", 5); assertPolygonSvg(generated.prompt, "four-cycle-choices", 4);
  } else if (variant === 9) {
    const operations = [vertices => rotateVertices(vertices, payload.size, 1), vertices => reflectVertices(vertices, payload.size, "horizontal"), vertices => rotateVertices(vertices, payload.size, 2), vertices => reflectVertices(vertices, payload.size, "vertical")]; const final = operations.reduce((vertices, operation) => operation(vertices), payload.base); const original = rotateVertices(payload.final, payload.size, 3);
    assert(JSON.stringify(payload.operations) === JSON.stringify(["시계 방향 90° 돌리기", "아래로 뒤집기", "반시계 방향 180° 돌리기", "오른쪽으로 뒤집기"]) && polygonKey(payload.final) === polygonKey(final) && polygonKey(payload.original) === polygonKey(original) && polygonKey(original) === polygonKey(payload.base), "Mission 4 원문 순서·역연산이 다릅니다.");
    assertChoice({ ...payload, answer: expected }, original); assertPolygonSvg(generated.prompt, "reverse-transform-final", 1); assertPolygonSvg(generated.prompt, "reverse-transform-choices", 4);
  } else if (variant === 10) {
    const transformed = rotateCells(reflectCells(payload.original, 3, "vertical"), 3, 1); const values = transformed.map(([x, y]) => y * 3 + x + 1).sort((left, right) => left - right);
    assert(data.kind === "transform-colored-three-by-three-grid-and-sum" && cellKey(payload.transformed) === cellKey(transformed) && JSON.stringify(values) === JSON.stringify([1, 4, 5, 6, 9]) && payload.answer === 25 && expected === "25", "Mission 5 색칠칸과 합이 다릅니다.");
    const numberMarks = renderedText(generated.prompt, "colored-grid-number-board", "source41-plane-cell-number");
    assert(numberMarks.length === 9 && numberMarks.map(item => Number(item.text)).sort((left, right) => left - right).join(",") === "1,2,3,4,5,6,7,8,9" && new Set(numberMarks.map(item => `${item.x},${item.y}`)).size === 9, "번호판의 1부터 9까지가 실제 SVG 좌표에 있어야 합니다.");
    assert(renderedText(generated.prompt, "colored-grid-start", "source41-plane-cell-number").length === 0, "색칠 무늬 격자와 번호판은 분리되어야 합니다.");
    const resultMarks = renderedText(generated.solution, "colored-grid-result", "source41-plane-cell-number");
    assert(resultMarks.length === 9 && resultMarks.filter(item => item.classSuffix.includes("is-on-dark")).length === 5, "해설의 어두운 색칠칸 번호는 대비 class를 가져야 합니다.");
    assert(renderedCells(generated.solution, "colored-grid-result").some(cells => cellKey(cells) === cellKey(transformed)), "해설 SVG의 색칠칸이 계산 결과와 다릅니다.");
  } else if (variant === 11) {
    const correct = rotateVertices(payload.wrong, payload.size, 2);
    assert(data.kind === "correct-noncommuting-transform-order" && polygonKey(payload.correct) === polygonKey(correct), "Mission 6 순서 차이 결과가 다릅니다.");
    assert(JSON.stringify(payload.desired) === JSON.stringify(["위쪽으로 뒤집기", "시계 방향 90° 돌리기 세 번"]) && JSON.stringify(payload.mistaken) === JSON.stringify(["시계 방향 90° 돌리기 세 번", "아래쪽으로 뒤집기"]) && /위쪽으로 뒤집은 뒤[\s\S]*아래쪽으로 뒤집어/.test(generated.prompt), "Mission 6의 의도와 실수 표현이 원문과 다릅니다.");
    assertChoice({ ...payload, answer: expected }, correct); assertPolygonSvg(generated.prompt, "correct-order-choices", 4);
  }
}

for (const [sourceItemId, variant] of publicItems) {
  const mapping = nativeMappings.find(item => item.sourceItemId === sourceItemId); const item = runtime.items.find(entry => entry.sourceItemId === sourceItemId);
  check(mapping?.generatorKey === generatorKey && mapping.variant === variant, `${sourceItemId}: 전용 생성기 매핑이 다릅니다.`); check(item?.generatorKey === generatorKey && item.variant === variant && item.reviewLocked === false, `${sourceItemId}: 공개 상태가 다릅니다.`);
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
    try { const generated = api.generate(item, 0, difficulty, seed, variant); generatedCount += 1; assert(generated?.prompt && generated?.solution && generated?.answer !== undefined && !/undefined|null|NaN|Infinity/.test(`${generated.prompt}${generated.solution}${generated.answer}`), "깨진 문제 값이 보입니다."); auditVariant(variant, generated, evidence(generated)); }
    catch (error) { failures.push(`${sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`); break; }
  }
}
for (const [sourceItemId, reason] of lockedItems) { const item = runtime.items.find(entry => entry.sourceItemId === sourceItemId); check(item?.reviewLocked === true && item?.generatorKey === "" && item?.reviewReason === reason, `${sourceItemId}: 잠금 사유 또는 공개 상태가 다릅니다.`); check(!nativeMappings.some(mapping => mapping.sourceItemId === sourceItemId), `${sourceItemId}: 잠긴 항목에 생성기 매핑이 남아 있습니다.`); }
check(generatedCount >= 12000, `생성 횟수는 12,000회 이상이어야 하나 ${generatedCount}회입니다.`);
if (failures.length) { console.error(`4-1 평면도형 이동 개념탐구 2 감사 실패: ${failures.length}건`); console.error(failures.slice(0, 40).join("\n")); process.exit(1); }
console.log(`4-1 평면도형 이동 개념탐구 2 감사 통과: 공개 8유형 · 잠금 3유형 · ${generatedCount.toLocaleString()}회 독립 생성 · 실제 SVG 역검사`);
