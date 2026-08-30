"use strict";

const fs = require("fs");
global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const mappings = require("./source-inventory/4-1-native-generators.json").mappings;
const api = window.HSE_GENERATORS;
const runtime = window.HSE_SOURCE_INVENTORY_41;
const generatorKey = "source41PlaneTransformOne";
const difficulties = [-1, 0, 1];
const seeds = 500;
const publicVariants = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10];
const choiceLabels = ["①", "②", "③", "④"];

const SOURCE = {
  0: { size: 3, darkRows: ["111", "100", "001"], labels: ["그대로", "좌우로 뒤집기", "위아래로 뒤집기", "시계 방향 90°", "시계 방향 180°", "시계 방향 270°"] },
  1: { rows: ["111", "111", "011"], finalRows: ["110", "111", "111"] },
  2: { blankFrame: 5, sameAsFrame: 1 },
  3: { positions: [[13, 0], [13, -3], [8, -3]] },
  4: { originalRows: ["11110", "11110", "00010", "00011", "00010"], reflectedRows: ["01111", "01111", "01000", "11000", "01000"] },
  6: { blankFrame: 6, sameAsFrame: 2 },
  7: { finalVertices: [[5, 3], [7, 3], [6, 4], [5, 4]] },
  8: { letters: ["L", "M", "N", "O", "P", "Q", "R", "S", "T"], symmetric: ["M", "O", "T"], answer: 3 },
  9: { rows: 4, cols: 5, initial: [[1, 4], [2, 1], [3, 2], [4, 3]], closure: 14, add: 10 },
  10: { wrongVertices: [[0, 4], [4, 4], [4, 1], [2, 0], [0, 3]], answerVertices: [[4, 0], [0, 0], [0, 3], [2, 4], [4, 1]] }
};

const sourceItems = [
  ["4-1-u4-e1-exploration", 0, "밀기·뒤집기·돌리기 결과 찾기"],
  ["4-1-u4-e1-example-1-1", 1, "세 가지 이동 뒤의 도형 찾기"],
  ["4-1-u4-e1-example-1-2", 2, "회전 규칙의 빈 도형 채우기"],
  ["4-1-u4-e1-example-1-3", 3, "차례로 민 세 위치 찾기"],
  ["4-1-u4-e1-example-1-4", 4, "잘못된 회전에서 원래 도형 복원"],
  ["4-1-u4-e1-mission-1", 5, "무늬 구성의 이동 방식 비교"],
  ["4-1-u4-e1-mission-2", 6, "연속 회전 규칙의 빈칸 완성"],
  ["4-1-u4-e1-mission-3", 7, "도형을 가로와 세로로 밀어 옮기기"],
  ["4-1-u4-e1-mission-4", 8, "좌우 대칭인 알파벳 찾기"],
  ["4-1-u4-e1-mission-5", 9, "상하좌우 대칭 색칠 완성"],
  ["4-1-u4-e1-mission-6", 10, "잘못된 뒤집기에서 바른 모양 복원"]
];

const expectedKinds = {
  0: "six-asymmetric-motif-transforms",
  1: "slide-top-bottom-reflect-clockwise-turn",
  2: "four-step-rotation-frame-five",
  3: "three-cumulative-slides",
  4: "wrong-counterclockwise-turn-recover-and-right-reflect",
  6: "four-step-rotation-frame-six",
  7: "polygon-slide-right-and-down",
  8: "fixed-vector-vertical-symmetry-glyphs",
  9: "horizontal-and-vertical-symmetry-closure",
  10: "wrong-left-reflection-then-top-reflection"
};

const failures = [];
let generatedCount = 0;

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}

function same(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

function sortedCells(cells) {
  return cells.map(([x, y]) => [x, y]).sort((left, right) => left[1] - right[1] || left[0] - right[0]);
}

function cellKey(cells) {
  return JSON.stringify(sortedCells(cells));
}

function polygonKey(vertices) {
  const points = vertices.map(([x, y]) => [x, y]);
  const candidates = [];
  for (const sequence of [points, [...points].reverse()]) {
    for (let offset = 0; offset < sequence.length; offset += 1) candidates.push(JSON.stringify([...sequence.slice(offset), ...sequence.slice(0, offset)]));
  }
  return candidates.sort()[0] || "[]";
}

function pairKey(pair) {
  return `${cellKey(pair[0])}/${cellKey(pair[1])}`;
}

function rowsToCells(rows) {
  return rows.flatMap((row, y) => [...row].flatMap((value, x) => value === "1" ? [[x, y]] : []));
}

function fullRows(cells, rows, cols) {
  const values = new Set(cells.map(point => point.join(",")));
  return Array.from({ length: rows }, (_, y) => Array.from({ length: cols }, (_, x) => values.has(`${x},${y}`) ? "1" : "0").join(""));
}

function croppedRows(cells) {
  const minX = Math.min(...cells.map(point => point[0]));
  const maxX = Math.max(...cells.map(point => point[0]));
  const minY = Math.min(...cells.map(point => point[1]));
  const maxY = Math.max(...cells.map(point => point[1]));
  return fullRows(cells.map(([x, y]) => [x - minX, y - minY]), maxY - minY + 1, maxX - minX + 1);
}

function move(cells, dx, dy) {
  return cells.map(([x, y]) => [x + dx, y + dy]);
}

function reflectCells(cells, size, axis) {
  return cells.map(([x, y]) => axis === "vertical" ? [size - 1 - x, y] : [x, size - 1 - y]);
}

function rotateCells(cells, size, turns = 1) {
  let next = cells.map(([x, y]) => [x, y]);
  for (let count = 0; count < ((turns % 4) + 4) % 4; count += 1) next = next.map(([x, y]) => [size - 1 - y, x]);
  return next;
}

function rotateVertices(vertices, size, turns = 1) {
  let next = vertices.map(([x, y]) => [x, y]);
  for (let count = 0; count < ((turns % 4) + 4) % 4; count += 1) next = next.map(([x, y]) => [size - y, x]);
  return next;
}

function inRect(points, rows, cols, vertex = false) {
  return points.every(([x, y]) => Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x <= (vertex ? cols : cols - 1) && y <= (vertex ? rows : rows - 1));
}

function connected(cells) {
  if (!cells.length) return false;
  const remaining = new Set(cells.map(point => point.join(",")));
  const queue = [cells[0]];
  remaining.delete(cells[0].join(","));
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const point of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      const pointKey = point.join(",");
      if (remaining.delete(pointKey)) queue.push(point);
    }
  }
  return remaining.size === 0;
}

function closure(cells, rows, cols) {
  const values = new Map(cells.map(point => [point.join(","), point]));
  for (const [x, y] of [...values.values()]) {
    values.set(`${cols - 1 - x},${y}`, [cols - 1 - x, y]);
    values.set(`${x},${rows - 1 - y}`, [x, rows - 1 - y]);
    values.set(`${cols - 1 - x},${rows - 1 - y}`, [cols - 1 - x, rows - 1 - y]);
  }
  return sortedCells([...values.values()]);
}

function stripEvidence(html) {
  return String(html).replace(/<span hidden\b[^>]*data-source41-kind=[\s\S]*?<\/span>/g, "");
}

function visibleText(html) {
  return stripEvidence(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function evidence(generated) {
  const match = generated.prompt.match(/<span hidden\b[^>]*data-source41-kind="([^"]+)"[^>]*data-source41-payload="([^"]+)"[^>]*data-source41-expected="([^"]+)"[^>]*><\/span>/);
  assert(match, "원문 근거 자료를 읽을 수 없습니다.");
  return { kind: match[1], payload: JSON.parse(decodeURIComponent(match[2])), expected: decodeURIComponent(match[3]) };
}

function attributes(text) {
  const output = {};
  for (const match of String(text).matchAll(/([:\w-]+)="([^"]*)"/g)) output[match[1]] = match[2];
  return output;
}

function tags(html, name) {
  return String(html).match(new RegExp(`<${name}\\b[^>]*>`, "g")) || [];
}

function hasClass(tag, name) {
  return (attributes(tag).class || "").split(/\s+/).includes(name);
}

function number(value, message) {
  const parsed = Number(value);
  assert(Number.isFinite(parsed), message);
  return parsed;
}

function parsePlaneSvgs(html) {
  return [...String(html).matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)].map(match => ({ attrs: attributes(match[1]), body: match[2] })).filter(svg => (svg.attrs.class || "").split(/\s+/).includes("source41-plane-transform"));
}

function parsePanels(svg) {
  return [...svg.body.matchAll(/<g\b([^>]*)class="([^"]*\bsource41-plane-panel\b[^"]*)"([^>]*)>([\s\S]*?)<\/g>/g)].map(match => ({ attrs: attributes(`${match[1]} class="${match[2]}" ${match[3]}`), body: match[4] }));
}

function auditGridLine(line, orientation, left, top, right, bottom) {
  const attrs = attributes(line);
  const x1 = number(attrs.x1, "격자선 x1 값이 없습니다.");
  const x2 = number(attrs.x2, "격자선 x2 값이 없습니다.");
  const y1 = number(attrs.y1, "격자선 y1 값이 없습니다.");
  const y2 = number(attrs.y2, "격자선 y2 값이 없습니다.");
  if (orientation === "vertical") assert(x1 === x2 && y1 === top && y2 === bottom && x1 >= left && x1 <= right, "세로 격자선이 실제 격자 범위를 벗어났습니다.");
  else assert(y1 === y2 && x1 === left && x2 === right && y1 >= top && y1 <= bottom, "가로 격자선이 실제 격자 범위를 벗어났습니다.");
}

function auditPanel(panel, wrapperRows, wrapperCols) {
  const rows = number(panel.attrs["data-rows"], "패널 행 수가 없습니다.");
  const cols = number(panel.attrs["data-cols"], "패널 열 수가 없습니다.");
  assert(Number.isInteger(rows) && Number.isInteger(cols) && rows === wrapperRows && cols === wrapperCols, "패널과 SVG의 행·열 수가 다릅니다.");
  const left = number(panel.attrs["data-grid-left"], "격자 왼쪽 좌표가 없습니다.");
  const top = number(panel.attrs["data-grid-top"], "격자 위 좌표가 없습니다.");
  const right = number(panel.attrs["data-grid-right"], "격자 오른쪽 좌표가 없습니다.");
  const bottom = number(panel.attrs["data-grid-bottom"], "격자 아래 좌표가 없습니다.");
  assert(right > left && bottom > top, "격자 실제 크기가 올바르지 않습니다.");

  const lines = tags(panel.body, "line");
  const vertical = lines.filter(line => hasClass(line, "source41-plane-grid-vertical"));
  const horizontal = lines.filter(line => hasClass(line, "source41-plane-grid-horizontal"));
  assert(vertical.length === cols + 1 && horizontal.length === rows + 1, `실제 격자선 수가 ${rows}행 ${cols}열과 다릅니다.`);
  vertical.forEach(line => auditGridLine(line, "vertical", left, top, right, bottom));
  horizontal.forEach(line => auditGridLine(line, "horizontal", left, top, right, bottom));

  const blank = panel.attrs["data-blank"] === "true";
  const title = panel.body.match(/<text\b[^>]*class="[^"]*\bsource41-plane-label\b[^"]*"[^>]*>([^<]*)<\/text>/)?.[1] || "";
  if (panel.attrs["data-cells"] !== undefined) {
    const cells = JSON.parse(decodeURIComponent(panel.attrs["data-cells"]));
    const dark = JSON.parse(decodeURIComponent(panel.attrs["data-dark"] || "%5B%5D"));
    const light = JSON.parse(decodeURIComponent(panel.attrs["data-light"] || "%5B%5D"));
    assert(Array.isArray(cells) && inRect(cells, rows, cols), "표시된 칸이 정확한 행·열 범위를 벗어났습니다.");
    assert(inRect(dark, rows, cols) && inRect(light, rows, cols), "두 색 칸이 정확한 행·열 범위를 벗어났습니다.");
    const cellKeys = new Set(cells.map(point => point.join(",")));
    const darkKeys = new Set(dark.map(point => point.join(",")));
    const lightKeys = new Set(light.map(point => point.join(",")));
    assert([...darkKeys, ...lightKeys].every(key => cellKeys.has(key)) && [...darkKeys].every(key => !lightKeys.has(key)), "두 색 자료가 실제 색칠 칸과 맞지 않거나 서로 겹칩니다.");
    const cellRects = tags(panel.body, "rect").filter(tag => hasClass(tag, "source41-plane-cell"));
    assert(cellRects.length === (blank ? 0 : cells.length), "좌표 자료와 실제 색칠한 칸 수가 다릅니다.");
    const actualCells = [];
    const actualDark = [];
    const actualLight = [];
    const cellWidth = (right - left) / cols;
    const cellHeight = (bottom - top) / rows;
    for (const rect of cellRects) {
      const attrs = attributes(rect);
      const x = number(attrs.x, "색칠 칸 x 값이 없습니다.");
      const y = number(attrs.y, "색칠 칸 y 값이 없습니다.");
      const width = number(attrs.width, "색칠 칸 너비가 없습니다.");
      const height = number(attrs.height, "색칠 칸 높이가 없습니다.");
      assert(x >= left && y >= top && x + width <= right && y + height <= bottom, "실제로 그린 색칠 칸이 격자 밖입니다.");
      const col = Math.round((x - left - 1.4) / cellWidth);
      const row = Math.round((y - top - 1.4) / cellHeight);
      assert(Math.abs(x - (left + col * cellWidth + 1.4)) < 0.001 && Math.abs(y - (top + row * cellHeight + 1.4)) < 0.001, "색칠 칸이 눈금 칸에 정확히 맞지 않습니다.");
      actualCells.push([col, row]);
      if (hasClass(rect, "is-dark")) actualDark.push([col, row]);
      if (hasClass(rect, "is-light")) actualLight.push([col, row]);
    }
    assert(cellKey(actualCells) === cellKey(cells) && cellKey(actualDark) === cellKey(dark) && cellKey(actualLight) === cellKey(light), "실제 SVG의 칸 위치나 두 색 위치가 좌표 자료와 다릅니다.");
    if (blank) {
      assert(cells.length === 0, "빈 격자에 정답 도형 좌표가 숨겨져 있습니다.");
      const blankRect = tags(panel.body, "rect").find(tag => hasClass(tag, "source41-plane-blank"));
      assert(blankRect, "빈 격자 바탕이 없습니다.");
      const attrs = attributes(blankRect);
      assert(number(attrs.x, "빈 격자 x 값이 없습니다.") === left && number(attrs.y, "빈 격자 y 값이 없습니다.") === top && number(attrs.width, "빈 격자 너비가 없습니다.") === right - left && number(attrs.height, "빈 격자 높이가 없습니다.") === bottom - top, "빈 격자 바탕과 실제 격자 크기가 다릅니다.");
      assert(panel.body.indexOf("source41-plane-blank") < panel.body.indexOf("source41-plane-grid-vertical"), "빈 격자 바탕이 눈금선을 가리고 있습니다.");
    }
    return { rows, cols, blank, title, cells, dark, light, vertices: null };
  }

  const vertices = JSON.parse(decodeURIComponent(panel.attrs["data-vertices"] || ""));
  assert(Array.isArray(vertices) && vertices.length >= 3 && inRect(vertices, rows, cols, true), "표시된 꼭짓점이 정확한 행·열 범위를 벗어났습니다.");
  const polygon = tags(panel.body, "polygon").find(tag => hasClass(tag, "source41-plane-polygon"));
  assert(polygon, "다각형 선이 없습니다.");
  const plotted = (attributes(polygon).points || "").trim().split(/\s+/).filter(Boolean).map(pair => pair.split(",").map(Number));
  assert(plotted.length === vertices.length && plotted.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y) && x >= left && x <= right && y >= top && y <= bottom), "실제 다각형 점이 격자 밖입니다.");
  const circles = tags(panel.body, "circle").filter(tag => hasClass(tag, "source41-plane-vertex"));
  assert(circles.length === vertices.length && circles.every(circle => {
    const attrs = attributes(circle);
    const x = Number(attrs.cx);
    const y = Number(attrs.cy);
    return Number.isFinite(x) && Number.isFinite(y) && x >= left && x <= right && y >= top && y <= bottom;
  }), "실제 꼭짓점 표시가 격자 밖입니다.");
  return { rows, cols, blank: false, title, cells: null, dark: null, light: null, vertices };
}

function auditPlaneSvg(svg) {
  const rows = number(svg.attrs["data-rows"], "SVG 행 수가 없습니다.");
  const cols = number(svg.attrs["data-cols"], "SVG 열 수가 없습니다.");
  const count = number(svg.attrs["data-panel-count"], "SVG 패널 수가 없습니다.");
  assert(Number.isInteger(rows) && Number.isInteger(cols) && rows >= 1 && cols >= 1 && Number.isInteger(count) && count >= 1, "SVG의 행·열·패널 정보가 올바르지 않습니다.");
  const viewBox = (svg.attrs.viewBox || "").split(/\s+/).map(Number);
  assert(viewBox.length === 4 && viewBox.every(Number.isFinite) && viewBox[2] > 0 && viewBox[3] > 0, "SVG 보기 상자가 올바르지 않습니다.");
  const widthMatch = (svg.attrs.style || "").match(/width:min\(([\d.]+)px,100%\)/);
  assert(widthMatch && Number(widthMatch[1]) === Math.min(viewBox[2], 640), "SVG가 자연 너비보다 커지거나 640px을 넘을 수 있습니다.");
  const panels = parsePanels(svg);
  assert(panels.length === count, "SVG 패널 수와 실제 패널 수가 다릅니다.");
  return { kind: svg.attrs["data-source41-plane-kind"], rows, cols, panels: panels.map(panel => auditPanel(panel, rows, cols)) };
}

function auditGlyphSvg(html) {
  const match = [...String(html).matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)].map(value => ({ attrs: attributes(value[1]), body: value[2] })).find(svg => (svg.attrs.class || "").split(/\s+/).includes("source41-plane-glyphs"));
  assert(match && match.attrs.viewBox === "0 0 306 58" && /width:min\(306px,100%\)/.test(match.attrs.style || ""), "글자 SVG는 자연 너비 306px보다 커지면 안 됩니다.");
  const glyphs = tags(match.body, "path").filter(tag => hasClass(tag, "source41-plane-glyph"));
  const letters = tags(match.body, "g").map(tag => attributes(tag)["data-letter"]).filter(Boolean);
  assert(glyphs.length === 9 && same(letters, SOURCE[8].letters), "대칭 글자는 운영체제 글꼴이 아닌 고정 벡터 아홉 개여야 합니다.");
}

function diagramByKind(diagrams, kind) {
  const diagram = diagrams.find(item => item.kind === kind);
  assert(diagram, `${kind} 그림이 없습니다.`);
  return diagram;
}

function auditRenderedCellChoices(diagram, choices, message) {
  assert(diagram.panels.length === 4 && diagram.panels.every((panel, index) => cellKey(panel.cells) === cellKey(choices[index])), `${message} 네 개가 계산 자료와 같은 순서로 그려지지 않았습니다.`);
}

function auditRenderedPolygonChoices(diagram, choices, message) {
  assert(diagram.panels.length === 4 && diagram.panels.every((panel, index) => polygonKey(panel.vertices) === polygonKey(choices[index])), `${message} 네 개가 계산 자료와 같은 순서로 그려지지 않았습니다.`);
}

function auditSvg(variant, generated, payload) {
  const html = `${generated.prompt}${generated.solution}`;
  assert(!/undefined|null|NaN|Infinity/.test(html), "SVG에 깨진 값이 있습니다.");
  if (variant === 8) {
    auditGlyphSvg(html);
    return;
  }
  const promptDiagrams = parsePlaneSvgs(generated.prompt).map(auditPlaneSvg);
  const solutionDiagrams = parsePlaneSvgs(generated.solution).map(auditPlaneSvg);
  assert(promptDiagrams.length >= 1, "문제에 격자 도형 SVG가 없습니다.");
  if (variant === 0) {
    const original = diagramByKind(promptDiagrams, "six-motif-original");
    const blanks = diagramByKind(promptDiagrams, "six-motif-blanks");
    const results = diagramByKind(solutionDiagrams, "six-motif-results");
    const sourceDark = payload.dark;
    const sourceLight = payload.light;
    const size = payload.size;
    const operations = [cells => cells, cells => reflectCells(cells, size, "vertical"), cells => reflectCells(cells, size, "horizontal"), cells => rotateCells(cells, size, 1), cells => rotateCells(cells, size, 2), cells => rotateCells(cells, size, 3)];
    assert(original.rows === size && original.cols === size && original.panels[0].cells.length === size * size, "처음 무늬는 빈칸 없는 두 색 정사각형 무늬여야 합니다.");
    assert(cellKey(original.panels[0].dark) === cellKey(sourceDark) && cellKey(original.panels[0].light) === cellKey(sourceLight), "문제의 처음 두 색 무늬가 생성 자료와 다릅니다.");
    assert(blanks.panels.length === 6 && blanks.panels.every(panel => panel.blank && panel.cells.length === 0 && panel.dark.length === 0 && panel.light.length === 0), "문제의 여섯 격자는 정답이 없는 빈 그리기 칸이어야 합니다.");
    assert(same(blanks.panels.map(panel => panel.title), SOURCE[0].labels), "문제의 여섯 빈 격자 이름이나 순서가 다릅니다.");
    assert(results.panels.length === 6 && results.panels.every(panel => !panel.blank && panel.cells.length === size * size), "풀이에는 같은 순서의 완성 그림 여섯 개가 있어야 합니다.");
    assert(same(results.panels.map(panel => panel.title), SOURCE[0].labels), "풀이의 여섯 완성 그림 이름이나 순서가 다릅니다.");
    results.panels.forEach((panel, index) => assert(cellKey(panel.dark) === cellKey(operations[index](sourceDark)) && cellKey(panel.light) === cellKey(operations[index](sourceLight)), "풀이의 두 색 완성 그림이 독립 변환 결과와 다릅니다."));
    assert(!generated.prompt.includes("six-motif-results"), "완성 그림이 문제에 숨겨져 있습니다.");
  }
  if (variant === 1) auditRenderedCellChoices(diagramByKind(promptDiagrams, "slide-reflect-rotate"), payload.choices, "세 가지 이동 보기");
  if (variant === 2 || variant === 6) {
    const sequence = diagramByKind(promptDiagrams, "rotation-sequence");
    assert(sequence.panels.filter(panel => panel.blank).length === 1 && sequence.panels.find(panel => panel.blank).cells.length === 0, "회전 규칙의 빈칸에 정답 좌표가 숨겨져 있습니다.");
    auditRenderedCellChoices(diagramByKind(promptDiagrams, variant === 2 ? "five-frame-rotation" : "six-frame-rotation"), payload.choices, "회전 규칙 보기");
  }
  if (variant === 4) {
    const diagram = diagramByKind(promptDiagrams, "recover-and-reflect-choices");
    const pairs = Array.from({ length: 4 }, (_, index) => [diagram.panels[index * 2].cells, diagram.panels[index * 2 + 1].cells]);
    assert(pairs.every((pair, index) => pairKey(pair) === pairKey(payload.choices[index])), "복원 문제 보기 네 쌍이 계산 자료와 같은 순서로 그려지지 않았습니다.");
  }
  if (variant === 7) auditRenderedPolygonChoices(diagramByKind(promptDiagrams, "polygon-slide-choices"), payload.choices, "다각형 밀기 보기");
  if (variant === 9) {
    const start = diagramByKind(promptDiagrams, "symmetry-closure");
    const result = diagramByKind(solutionDiagrams, "symmetry-closure-result");
    assert(start.rows === payload.rows && start.cols === payload.cols && cellKey(start.panels[0].cells) === cellKey(payload.initial), "문제의 실제 직사각형 격자와 처음 색칠이 계산 자료와 다릅니다.");
    assert(result.rows === payload.rows && result.cols === payload.cols && cellKey(result.panels[0].cells) === cellKey(payload.closure), "풀이의 실제 직사각형 격자와 대칭 완성 무늬가 계산값과 다릅니다.");
    const initialKeys = new Set(payload.initial.map(point => point.join(",")));
    const added = payload.closure.filter(point => !initialKeys.has(point.join(",")));
    assert(cellKey(start.panels[0].dark) === cellKey(payload.initial) && start.panels[0].light.length === 0, "문제의 처음 색칠 색이 계산 자료와 다릅니다.");
    assert(cellKey(result.panels[0].dark) === cellKey(payload.initial) && cellKey(result.panels[0].light) === cellKey(added), "풀이에서 처음 칸과 더 칠한 칸의 색 구분이 다릅니다.");
    assert(!generated.prompt.includes("symmetry-closure-result"), "대칭 완성 무늬가 문제에 숨겨져 있습니다.");
  }
  if (variant === 10) auditRenderedPolygonChoices(diagramByKind(promptDiagrams, "correct-top-reflection-choices"), payload.choices, "바른 뒤집기 보기");
}

function answerLabel(choices, correct, keyFor) {
  const correctKey = keyFor(correct);
  const matches = choices.map(choice => keyFor(choice) === correctKey);
  assert(matches.filter(Boolean).length === 1, "선택지에서 정답이 하나로 정해지지 않습니다.");
  return choiceLabels[matches.indexOf(true)];
}

function auditChoiceSet(choices, correct, keyFor, answer, message) {
  assert(Array.isArray(choices) && choices.length === 4, `${message}: 보기는 정확히 네 개여야 합니다.`);
  assert(new Set(choices.map(keyFor)).size === 4, `${message}: 화면상 같은 보기가 있습니다.`);
  assert(answer === answerLabel(choices, correct, keyFor), `${message}: 정답 보기 번호가 독립 계산과 다릅니다.`);
}

function auditPrompt(variant, generated) {
  const prompt = stripEvidence(generated.prompt);
  const text = visibleText(prompt);
  assert(!/data-source41-expected|data-source41-payload/.test(prompt), "근거 표시를 제외한 문제에 숨은 정답 자료가 남았습니다.");
  assert(!/(정답은|답은|정답\s*:|답\s*:)/.test(text), "문제 글에 정답을 직접 알려 주는 문장이 있습니다.");
  if (variant === 0) assert(!/(^|[^A-Za-z0-9])(I|H|V|R90|R180|R270)([^A-Za-z0-9]|$)/.test(text), "아이에게 보이는 글에 내부 이동 기호가 남았습니다.");
}

function checkPayload(variant, payload, answer) {
  assert(Number.isInteger(payload.level) && payload.level >= 0 && payload.level <= 2, "난이도 단계가 올바르지 않습니다.");
  assert(Number.isFinite(payload.complexity) && payload.complexity > 0, "난이도 자료가 없습니다.");
  assert(same(payload.sourceAnchor, SOURCE[variant]), "생성 자료의 원문 기준값이 독립 고정값과 다릅니다.");

  if (variant === 0) {
    const source = SOURCE[0];
    const size = payload.size;
    const dark = payload.dark;
    const light = payload.light;
    assert([3, 4, 5].includes(size) && size === payload.level + 3, "난이도에 따른 두 색 무늬의 격자 크기가 다릅니다.");
    assert(inRect(dark, size, size) && inRect(light, size, size) && new Set([...dark, ...light].map(point => point.join(","))).size === size * size && dark.length + light.length === size * size, "처음 무늬에 빈칸이나 겹친 칸이 있습니다.");
    if (payload.level === 0) {
      const sourceDark = rowsToCells(source.darkRows);
      const sourceDarkKeys = new Set(sourceDark.map(point => point.join(",")));
      const sourceLight = Array.from({ length: source.size }, (_, y) => Array.from({ length: source.size }, (_, x) => [x, y])).flat().filter(point => !sourceDarkKeys.has(point.join(",")));
      assert(size === source.size && cellKey(dark) === cellKey(sourceDark) && cellKey(light) === cellKey(sourceLight), "개념탐구 원문 단계의 처음 두 색 무늬가 고정 기준과 다릅니다.");
    }
    const operations = [
      cells => cells.map(point => [...point]),
      cells => reflectCells(cells, size, "vertical"),
      cells => reflectCells(cells, size, "horizontal"),
      cells => rotateCells(cells, size, 1),
      cells => rotateCells(cells, size, 2),
      cells => rotateCells(cells, size, 3)
    ];
    const expected = operations.map((operation, index) => ({ label: source.labels[index], dark: operation(dark), light: operation(light) }));
    assert(payload.transforms.length === 6 && same(payload.transforms.map(item => item.label), source.labels), "여섯 그리기 칸의 이름과 순서가 원문 구조와 다릅니다.");
    expected.forEach((item, index) => assert(cellKey(payload.transforms[index].dark) === cellKey(item.dark) && cellKey(payload.transforms[index].light) === cellKey(item.light), "여섯 완성 무늬 중 독립 변환 결과와 다른 그림이 있습니다."));
    assert(new Set(expected.map(item => `${cellKey(item.dark)}/${cellKey(item.light)}`)).size === 6, "처음 무늬가 대칭이라 여섯 결과가 서로 달라지지 않습니다.");
    assert(answer === "완성 그림 6개", "그리기 유형의 답안 계약이 다릅니다.");
    return;
  }

  if (variant === 1) {
    const slide = move(payload.base, 1 + payload.level, 0);
    const reflected = reflectCells(slide, payload.size, "horizontal");
    const correct = rotateCells(reflected, payload.size, 1);
    assert(cellKey(payload.slide) === cellKey(slide) && cellKey(payload.reflected) === cellKey(reflected) && cellKey(payload.correct) === cellKey(correct), "밀기·뒤집기·돌리기 계산이 다릅니다.");
    assert(inRect(payload.base, payload.size, payload.size) && inRect(correct, payload.size, payload.size), "도형이 격자 밖으로 나갑니다.");
    assert(new Set(Array.from({ length: 4 }, (_, turns) => cellKey(rotateCells(payload.base, payload.size, turns)))).size === 4, "시작 도형이 회전 대칭이라 보기가 겹칠 수 있습니다.");
    auditChoiceSet(payload.choices, correct, cellKey, answer, "세 가지 이동");
    if (payload.level === 0) {
      assert(same(croppedRows(payload.base), SOURCE[1].rows), "예제 1-1 원문 시작 도형의 행이 다릅니다.");
      assert(same(croppedRows(correct), SOURCE[1].finalRows), "예제 1-1 원문 최종 도형의 행이 다릅니다.");
    }
    return;
  }

  if (variant === 2 || variant === 6) {
    const expectedFrames = Array.from({ length: 6 }, (_, index) => rotateCells(payload.base, payload.size, index));
    assert(payload.frames.length === 6 && payload.frames.every((cells, index) => cellKey(cells) === cellKey(expectedFrames[index])), "회전 규칙의 각 그림이 독립 회전값과 다릅니다.");
    assert(new Set(expectedFrames.slice(0, 4).map(cellKey)).size === 4, "회전 규칙의 첫 네 방향이 서로 달라야 합니다.");
    const blankIndex = variant === 2 ? 4 : 5;
    assert(payload.blankIndex === blankIndex && cellKey(payload.correct) === cellKey(expectedFrames[blankIndex]), "회전 규칙의 빈칸 위치나 정답이 다릅니다.");
    assert(cellKey(expectedFrames[blankIndex]) === cellKey(expectedFrames[SOURCE[variant].sameAsFrame - 1]), "원문에서 같은 방향이 되는 차례가 다릅니다.");
    auditChoiceSet(payload.choices, expectedFrames[blankIndex], cellKey, answer, "회전 규칙");
    return;
  }

  if (variant === 3) {
    const [first, second, third] = payload.steps;
    const positions = [[first[0], first[1]], [first[0] + second[0], first[1] + second[1]], [first[0] + second[0] + third[0], first[1] + second[1] + third[1]]];
    const states = positions.map(([dx, dy]) => move(payload.base, dx, dy));
    const expectedAnswer = `오른쪽 ${positions[0][0]}칸, 오른쪽 ${positions[1][0]}칸 위 ${Math.abs(positions[1][1])}칸, 오른쪽 ${positions[2][0]}칸 위 ${Math.abs(positions[2][1])}칸`;
    assert(connected(payload.base), "차례로 미는 처음 도형이 변을 맞대어 이어져 있지 않습니다.");
    assert(payload.states.every((cells, index) => cellKey(cells) === cellKey(states[index])) && states.every(cells => inRect(cells, payload.size, payload.size)), "차례로 민 세 위치가 다르거나 격자 밖입니다.");
    assert(answer === expectedAnswer, "세 누적 위치의 답이 독립 계산과 다릅니다.");
    if (payload.level === 0) assert(same(positions, SOURCE[3].positions), "예제 1-3 원문 누적 이동 벡터가 다릅니다.");
    return;
  }

  if (variant === 4) {
    const original = rotateCells(payload.wrong, payload.size, 1);
    const correct = reflectCells(original, payload.size, "vertical");
    assert(cellKey(payload.original) === cellKey(original) && cellKey(payload.correct) === cellKey(correct), "잘못 돌린 도형을 되찾고 좌우로 뒤집는 계산이 다릅니다.");
    auditChoiceSet(payload.choices, [original, correct], pairKey, answer, "잘못 돌린 도형 복원");
    if (payload.level === 0) {
      assert(same(fullRows(payload.original, 5, 5), SOURCE[4].originalRows), "예제 1-4 원문 처음 도형이 다릅니다.");
      assert(same(fullRows(payload.correct, 5, 5), SOURCE[4].reflectedRows), "예제 1-4 원문 좌우 뒤집기 결과가 다릅니다.");
    }
    return;
  }

  if (variant === 7) {
    const correct = payload.start.map(([x, y]) => [x + payload.dx, y + payload.dy]);
    assert(polygonKey(payload.correct) === polygonKey(correct) && inRect(correct, payload.size, payload.size, true), "다각형을 민 꼭짓점이 다르거나 격자 밖입니다.");
    auditChoiceSet(payload.choices, correct, polygonKey, answer, "다각형 밀기");
    if (payload.level === 0) assert(same(payload.correct, SOURCE[7].finalVertices), "Mission 3 원문 최종 꼭짓점이 다릅니다.");
    return;
  }

  if (variant === 8) {
    assert(same(payload.letters, SOURCE[8].letters) && same(payload.symmetric, SOURCE[8].symmetric) && Number(answer) === SOURCE[8].answer, "고정 벡터 글자의 대칭 답이 다릅니다.");
    return;
  }

  if (variant === 9) {
    const expected = closure(payload.initial, payload.rows, payload.cols);
    assert(cellKey(payload.closure) === cellKey(expected) && Number(answer) === expected.length - payload.initial.length && Number(answer) > 0, "상하좌우 대칭 완성 무늬나 추가 칸 수가 다릅니다.");
    assert(inRect(payload.initial, payload.rows, payload.cols) && inRect(expected, payload.rows, payload.cols), "대칭 색칠 칸이 직사각형 격자 밖입니다.");
    if (payload.level === 0) {
      const initialOneBased = payload.initial.map(([x, y]) => [x + 1, y + 1]);
      assert(payload.rows === SOURCE[9].rows && payload.cols === SOURCE[9].cols && same(initialOneBased, SOURCE[9].initial), "Mission 5 원문 4×5 격자나 처음 칸이 다릅니다.");
      assert(expected.length === SOURCE[9].closure && Number(answer) === SOURCE[9].add, "Mission 5 원문 완성 14칸·추가 10칸이 다릅니다.");
    }
    return;
  }

  const correct = rotateVertices(payload.wrong, payload.size, 2);
  assert(polygonKey(payload.correct) === polygonKey(correct) && inRect(correct, payload.size, payload.size, true), "잘못 뒤집기에서 바른 도형을 찾는 계산이 다릅니다.");
  auditChoiceSet(payload.choices, correct, polygonKey, answer, "잘못 뒤집은 도형 복원");
  if (payload.level === 0) {
    assert(same(payload.wrong, SOURCE[10].wrongVertices), "Mission 6 원문 잘못 뒤집은 도형이 다릅니다.");
    assert(same(payload.correct, SOURCE[10].answerVertices), "Mission 6 원문 바른 결과 꼭짓점이 다릅니다.");
  }
}

function checkIndependentSourceConstants() {
  const sourceClosure = closure(SOURCE[9].initial.map(([x, y]) => [x - 1, y - 1]), SOURCE[9].rows, SOURCE[9].cols);
  check(sourceClosure.length === SOURCE[9].closure && sourceClosure.length - SOURCE[9].initial.length === SOURCE[9].add, "Mission 5 독립 원문 상수의 답이 맞지 않습니다.");
  check(same(rotateVertices(SOURCE[10].wrongVertices, 4, 2), SOURCE[10].answerVertices), "Mission 6 독립 원문 상수의 180도 결과가 맞지 않습니다.");
  check(same(fullRows(reflectCells(rowsToCells(SOURCE[4].originalRows), 5, "vertical"), 5, 5), SOURCE[4].reflectedRows), "예제 1-4 독립 원문 상수의 뒤집기 결과가 맞지 않습니다.");
}

checkIndependentSourceConstants();
const appSource = fs.readFileSync(require.resolve("./app.js"), "utf8");
check(appSource.includes("renderMathNotation(question.solution)"), "답안 화면이 생성기의 풀이 그림을 실제 SVG로 표시해야 합니다.");
check(!appSource.includes("renderMathNotation(escapeHtml(question.solution))"), "답안 화면에서 풀이 그림을 글자로 바꾸면 안 됩니다.");
const groupItems = inventory.items.filter(item => item.sourceItemId.startsWith("4-1-u4-e1-"));
const runtimeItems = runtime.items.filter(item => item.sourceItemId.startsWith("4-1-u4-e1-"));
check(groupItems.length === 11 && runtimeItems.length === 11, "원문 11항목이 모두 있어야 합니다.");
check(same(groupItems.map(item => item.sourceItemId), sourceItems.map(item => item[0])), "원문 source ID 순서가 다릅니다.");
check(same(groupItems.map(item => item.typeLabel), sourceItems.map(item => item[2])), "원문 유형명이 다릅니다.");
check(api.names.includes(generatorKey), "전용 생성기가 등록되지 않았습니다.");

for (const [sourceId, variant] of sourceItems) {
  const runtimeItem = runtimeItems.find(item => item.sourceItemId === sourceId);
  const mapping = mappings.find(item => item.sourceItemId === sourceId);
  if (variant === 5) {
    check(runtimeItem?.reviewLocked && !runtimeItem?.generatorKey && !mapping, "Mission 1은 검수 대기로 잠겨 있어야 합니다.");
    try {
      api.generate({ generatorKey, variant }, 0, 0, 1, variant);
      failures.push("Mission 1 생성이 차단되지 않았습니다.");
    } catch (error) {
      check(/검수 대기/.test(error.message), "Mission 1 잠금 안내가 분명하지 않습니다.");
    }
  } else {
    check(runtimeItem?.generatorKey === generatorKey && runtimeItem?.variant === variant && !runtimeItem?.reviewLocked, `${sourceId} 공개 연결이 다릅니다.`);
    check(mapping?.generatorKey === generatorKey && mapping?.variant === variant, `${sourceId} 매핑이 다릅니다.`);
  }
}

const complexity = new Map(publicVariants.map(variant => [variant, []]));
for (const variant of publicVariants) {
  for (const difficulty of difficulties) {
    let sum = 0;
    for (let seed = 1; seed <= seeds; seed += 1) {
      try {
        const generated = api.generate({ generatorKey, variant }, 0, difficulty, seed, variant);
        assert(generated?.generator === generatorKey && generated.prompt && generated.solution && generated.answer !== undefined, "생성 결과가 비었습니다.");
        const text = visibleText(`${generated.prompt} ${generated.solution}`);
        assert(!/undefined|null|NaN|Infinity/.test(text), "깨진 값이 화면에 보입니다.");
        assert(!/방정식|순열|조합|제곱|라디안|모듈러/.test(text), "초등 과정 밖 표현이 보입니다.");
        const marker = evidence(generated);
        assert(marker.kind === expectedKinds[variant] && marker.expected === String(generated.answer), "원문 구조 표시 또는 정답 근거가 다릅니다.");
        assert(marker.payload.level === difficulty + 1, "요청한 난이도와 생성 자료의 단계가 다릅니다.");
        checkPayload(variant, marker.payload, generated.answer);
        auditPrompt(variant, generated);
        auditSvg(variant, generated, marker.payload);
        sum += marker.payload.complexity;
        generatedCount += 1;
      } catch (error) {
        failures.push(`분기 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        break;
      }
    }
    complexity.get(variant).push(sum / seeds);
  }
}

for (const variant of publicVariants) {
  const values = complexity.get(variant);
  check(values[0] < values[1] && values[1] < values[2], `분기 ${variant}: 난이도별 복잡도가 증가하지 않습니다.`);
}

if (failures.length) {
  console.error(`4-1 평면도형 이동 개념탐구 1 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`4-1 평면도형 이동 개념탐구 1 전용 감사 통과: 원문 11항목 · 공개 10 · 검수 대기 1 · ${generatedCount.toLocaleString()}회 독립 계산 · 실제 행·열·좌표·선택지·단일답 확인`);
