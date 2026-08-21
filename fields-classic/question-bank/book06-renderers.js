const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function numberLine(visual) {
  const width = 520;
  const left = 38;
  const right = width - 38;
  const y = 82;
  const step = (right - left) / visual.intervals;
  const ticks = Array.from({ length: visual.intervals + 1 }, (_, index) => {
    const x = left + index * step;
    const label = visual.labels?.[index];
    return `<g class="${visual.target === index ? "target" : ""}"><line x1="${x}" y1="${y - 11}" x2="${x}" y2="${y + 11}"/><circle cx="${x}" cy="${y}" r="4"/><text x="${x}" y="${y + 34}">${label ?? ""}</text></g>`;
  }).join("");
  return `<svg class="b6-svg b6-number-line" viewBox="0 0 ${width} 130" role="img" aria-label="수직선"><line x1="${left}" y1="${y}" x2="${right}" y2="${y}"/>${ticks}</svg>`;
}

function splitNumberLine(visual) {
  const total = visual.sections.reduce((value, section) => value + section.intervals, 0);
  let cursor = 30;
  const width = 540;
  const usable = width - 60;
  const sections = visual.sections.map((section, sectionIndex) => {
    const sectionWidth = usable * section.intervals / total;
    const step = sectionWidth / section.intervals;
    const ticks = Array.from({ length: section.intervals + 1 }, (_, index) => `<line x1="${cursor + index * step}" y1="65" x2="${cursor + index * step}" y2="87"/>`).join("");
    const label = `<text x="${cursor + sectionWidth / 2}" y="35">${section.label} · 한 칸 ${section.unit}</text>`;
    const line = `<line x1="${cursor}" y1="76" x2="${cursor + sectionWidth}" y2="76"/>`;
    const endpoint = sectionIndex === 0 ? `<text x="${cursor}" y="112">가</text>` : "";
    const endLabel = `<text x="${cursor + sectionWidth}" y="112">${sectionIndex === 0 ? "나" : "다"}</text>`;
    cursor += sectionWidth;
    return `${label}${line}${ticks}${endpoint}${endLabel}`;
  }).join("");
  return `<svg class="b6-svg b6-number-line" viewBox="0 0 ${width} 130" role="img" aria-label="두 구간으로 나뉜 수직선">${sections}</svg>`;
}

function rods(visual) {
  const max = Math.max(...visual.rods.map((rod) => rod.unit ? rod.count * rod.unit : rod.count));
  return `<div class="b6-rods">${visual.rods.map((rod) => {
    const length = rod.unit ? rod.count * rod.unit : rod.count;
    const segments = rod.unit ? Math.min(rod.count, 12) : rod.repeat ? Math.min(rod.repeat, 12) : Math.min(rod.count, 12);
    return `<div><b>${escapeHtml(rod.label)}</b><span class="${rod.tone || "blue"}" style="--rod-width:${Math.max(22, length / max * 100)}%;--segments:${segments}">${Array.from({ length: segments }, () => "<i></i>").join("")}</span><em>${rod.repeat ? `${rod.count}cm씩 ${rod.repeat}번` : rod.unit ? `${rod.unit}cm × ${rod.count}개` : `${rod.count}cm`}</em></div>`;
  }).join("")}</div>`;
}

function fractionChain(visual) {
  const fraction = ([top, bottom]) => `<span class="fraction"><b>${top}</b><i></i><b>${bottom}</b></span>`;
  return `<div class="b6-fraction-chain">${fraction(visual.left)}<strong>${visual.symbol}</strong>${fraction(visual.right)}</div>`;
}

function ratioChain(visual) {
  return `<div class="b6-ratio-chain"><span>${visual.left[0]}</span><i>:</i><span>${visual.left[1]}</span><strong>${visual.symbol}</strong><span>${visual.right[0]}</span><i>:</i><span>${visual.right[1]}</span></div>`;
}

function segmentedBars(visual) {
  const max = Math.max(...visual.bars.map((bar) => bar.segments));
  return `<div class="b6-segmented-bars">${visual.bars.map((bar) => `<div><b>${bar.label}</b><span style="--count:${bar.segments};--bar-width:${bar.segments / max * 100}%">${Array.from({ length: bar.segments }, () => "<i></i>").join("")}</span></div>`).join("")}${visual.totalLabel ? `<strong>${escapeHtml(visual.totalLabel)}</strong>` : ""}</div>`;
}

function shapeIcon(shape) {
  return shape === "triangle" ? "△" : shape === "square" ? "□" : "○";
}

function balance(visual) {
  const objects = (side) => Array.from({ length: side.count }, () => `<i>${shapeIcon(side.shape)}</i>`).join("");
  return `<div class="b6-balance"><div>${objects(visual.left)}</div><span><i></i><b></b></span><div>${objects(visual.right)}</div></div>`;
}

function balanceTotal(visual) {
  return `<div class="b6-balance-total"><span>${Array.from({ length: visual.firstRatio }, () => "<i>△</i>").join("")}</span><b>:</b><span>${Array.from({ length: visual.secondRatio }, () => "<i>○</i>").join("")}</span><strong>합 ${visual.total}g</strong></div>`;
}

function symbolEquations(visual) {
  return `<div class="b6-symbol-equations"><p class="cards">수 카드 ${visual.cards.map((card) => `<b>${card}</b>`).join("")}</p>${visual.equations.map(([left, right, result]) => `<p><span>${left}</span><i>+</i><span>${right}</span><i>=</i><b>${result}</b></p>`).join("")}<strong>${visual.target} = ?</strong></div>`;
}

function stride(visual) {
  return `<div class="b6-stride"><div><b>가</b>${Array.from({ length: visual.firstSteps }, () => "<i></i>").join("")}</div><div><b>나</b>${Array.from({ length: visual.secondSteps }, () => "<i></i>").join("")}</div><strong>한 걸음 길이의 합 ${visual.strideSum}cm</strong></div>`;
}

function rectangle(visual) {
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 360 220" role="img" aria-label="직사각형"><rect x="55" y="35" width="250" height="135"/><text x="180" y="205">${escapeHtml(visual.widthLabel)}</text><text x="327" y="108">${escapeHtml(visual.heightLabel)}</text>${visual.perimeterLabel ? `<text class="note" x="180" y="24">둘레 ${escapeHtml(visual.perimeterLabel)}</text>` : ""}</svg>`;
}

function equalQuadrilateral(visual) {
  const shape = visual.shape === "마름모" ? `<polygon points="180,24 305,108 180,192 55,108"/>` : `<rect x="80" y="25" width="200" height="168"/>`;
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 360 225" role="img" aria-label="${visual.shape}">${shape}<text x="180" y="218">한 변 ${escapeHtml(visual.sideLabel)}</text>${visual.perimeterLabel ? `<text class="note" x="180" y="18">둘레 ${escapeHtml(visual.perimeterLabel)}</text>` : ""}</svg>`;
}

function joinedRectangles(visual) {
  const total = visual.widths.length;
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 430 220" role="img" aria-label="붙인 두 직사각형"><rect x="45" y="35" width="330" height="140"/><line x1="205" y1="35" x2="205" y2="175"/><text x="125" y="205">${visual.widths[0]}cm</text><text x="290" y="205">${visual.widths[1] === "?" ? "?" : `${visual.widths[1]}cm`}</text><text x="399" y="108">${visual.height}cm</text><text class="note" x="210" y="22">둘레 ${escapeHtml(visual.perimeterLabel)}</text></svg>`;
}

function joinedOffset(visual) {
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 430 240" role="img" aria-label="일부 변을 붙인 두 직사각형"><rect x="40" y="32" width="210" height="125"/><rect x="250" y="92" width="140" height="105"/><line class="target-line" x1="250" y1="92" x2="250" y2="157"/><text x="270" y="125">?</text><text x="145" y="225">맞닿은 변의 길이</text></svg>`;
}

function polygonPoints(sides, cx, cy, radius, rotation = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + index * Math.PI * 2 / sides;
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  }).join(" ");
}

function polygonFromSharedEdge(sides, first, second, side) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const length = Math.hypot(dx, dy);
  const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
  const normal = { x: -dy / length, y: dx / length };
  const apothem = length / (2 * Math.tan(Math.PI / sides));
  const center = { x: midpoint.x + normal.x * apothem * side, y: midpoint.y + normal.y * apothem * side };
  const startAngle = Math.atan2(first.y - center.y, first.x - center.x);
  const step = Math.PI * 2 / sides;
  const pointAt = (direction) => ({ x: center.x + Math.cos(startAngle + direction * step) * length / (2 * Math.sin(Math.PI / sides)), y: center.y + Math.sin(startAngle + direction * step) * length / (2 * Math.sin(Math.PI / sides)) });
  const plus = pointAt(1);
  const direction = Math.hypot(plus.x - second.x, plus.y - second.y) < 1 ? 1 : -1;
  return Array.from({ length: sides }, (_, index) => {
    const angle = startAngle + direction * step * index;
    const radius = length / (2 * Math.sin(Math.PI / sides));
    return `${center.x + Math.cos(angle) * radius},${center.y + Math.sin(angle) * radius}`;
  }).join(" ");
}

function attachedPolygons(visual) {
  const count = visual.sides.length;
  if (count === 2) {
    const first = { x: 190, y: 63 };
    const second = { x: 190, y: 133 };
    const shapes = `<polygon points="${polygonFromSharedEdge(visual.sides[0], first, second, 1)}"/><polygon points="${polygonFromSharedEdge(visual.sides[1], first, second, -1)}"/><line class="shared-edge" x1="${first.x}" y1="${first.y}" x2="${second.x}" y2="${second.y}"/>`;
    return `<svg class="b6-svg b6-geometry" viewBox="0 0 380 225" role="img" aria-label="한 변을 붙인 두 정다각형">${shapes}<text x="190" y="214">한 변 ${escapeHtml(visual.sideLabel)}</text>${visual.perimeterLabel ? `<text class="note" x="190" y="18">둘레 ${escapeHtml(visual.perimeterLabel)}</text>` : ""}</svg>`;
  }
  const side = 66;
  const startX = 45;
  const shapes = visual.sides.map((_, index) => `<rect x="${startX + index * side}" y="55" width="${side}" height="${side}"/>`).join("");
  const width = startX * 2 + count * side;
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 ${width} 190" role="img" aria-label="한 변씩 붙인 여러 정사각형">${shapes}<text x="${width / 2}" y="175">한 변 ${escapeHtml(visual.sideLabel)}</text></svg>`;
}

function diagonalRectangle(visual) {
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 390 235" role="img" aria-label="대각선으로 나눈 직사각형"><rect x="55" y="35" width="275" height="150"/><line class="diagonal" x1="55" y1="185" x2="330" y2="35"/><text x="190" y="222">${visual.labels[0]}</text><text x="353" y="112">${visual.labels[1]}</text><text class="diagonal-label" x="190" y="100">${visual.labels[2]}</text></svg>`;
}

function cellStrip(visual) {
  return `<div class="b6-cell-strip" style="--count:${visual.count}">${Array.from({ length: visual.count }, () => "<span></span>").join("")}<strong>한 칸 ${visual.side}cm</strong></div>`;
}

function cellBounds(cells) {
  return {
    minX: Math.min(...cells.map(([x]) => x)), maxX: Math.max(...cells.map(([x]) => x)),
    minY: Math.min(...cells.map(([, y]) => y)), maxY: Math.max(...cells.map(([, y]) => y))
  };
}

function cellSvg(cells, options = {}) {
  const bounds = cellBounds(cells);
  const cell = Math.min(48, 250 / Math.max(bounds.maxX - bounds.minX + 1, bounds.maxY - bounds.minY + 1));
  const width = (bounds.maxX - bounds.minX + 1) * cell + 40;
  const height = (bounds.maxY - bounds.minY + 1) * cell + 40;
  const cut = new Set((options.cut || []).map(([x, y]) => `${x}:${y}`));
  const shapes = [];
  cells.forEach(([x, y]) => shapes.push(`<rect class="filled" x="${20 + (x - bounds.minX) * cell}" y="${20 + (y - bounds.minY) * cell}" width="${cell}" height="${cell}"/>`));
  (options.cut || []).forEach(([x, y]) => shapes.push(`<rect class="cut" x="${20 + (x - bounds.minX) * cell}" y="${20 + (y - bounds.minY) * cell}" width="${cell}" height="${cell}"/>`));
  return `<svg class="b6-svg b6-cells" viewBox="0 0 ${width} ${height}" role="img" aria-label="모눈 정사각형으로 만든 도형">${shapes.join("")}</svg>`;
}

function cellShape(visual) {
  return `<div class="b6-cell-panel">${cellSvg(visual.cells)}<strong>한 변 ${escapeHtml(visual.sideLabel || "")}${visual.perimeterLabel ? ` · 둘레 ${escapeHtml(visual.perimeterLabel)}` : ""}</strong></div>`;
}

function cellCutout(visual) {
  const all = [...visual.cells, ...visual.cut];
  return `<div class="b6-cell-panel">${cellSvg(all, { cut: visual.cut })}<strong>한 변 ${escapeHtml(visual.sideLabel)}</strong></div>`;
}

function foldedRectangle(visual) {
  const arrow = visual.foldWidth ? "⇥" : "⇣";
  return `<div class="b6-folded-rectangle"><span><i></i><b>${arrow}</b></span><span class="folded"><i></i><em>${visual.foldedWidth}cm × ${visual.foldedHeight}cm</em></span></div>`;
}

function route(visual) {
  const bend = 35 + visual.bend / visual.width * 260;
  return `<svg class="b6-svg b6-route" viewBox="0 0 360 220" role="img" aria-label="직각으로 꺾인 길"><polyline points="38,35 ${bend},35 ${bend},115 322,115 322,185"/><circle cx="38" cy="35" r="13"/><circle cx="322" cy="185" r="13"/><text x="38" y="40">가</text><text x="322" y="190">나</text><text x="180" y="214">${visual.labels.join(" · ")}</text></svg>`;
}

function orthogonalPolygon(visual) {
  const xs = visual.vertices.map(([x]) => x);
  const ys = visual.vertices.map(([, y]) => y);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const points = visual.vertices.map(([x, y]) => `${35 + x / maxX * 285},${30 + y / maxY * 150}`).join(" ");
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 390 235" role="img" aria-label="직각으로 꺾인 도형"><polygon points="${points}"/><text x="178" y="220">가로 ${escapeHtml(visual.labels.width)} · 세로 ${escapeHtml(visual.labels.height)}</text>${visual.labels.depth ? `<text class="note" x="195" y="22">들어간 깊이 ${escapeHtml(visual.labels.depth)}</text>` : ""}</svg>`;
}

function beforeAfterCells(visual) {
  return `<div class="b6-before-after"><span>${cellSvg(visual.before)}<b>자르기 전</b></span><i>→</i><span>${cellSvg(visual.after)}<b>자른 후</b></span><strong>한 변 ${escapeHtml(visual.sideLabel)}</strong></div>`;
}

function squarePartition(visual) {
  return `<div class="b6-square-partition" style="--parts:${visual.parts}">${Array.from({ length: visual.parts * visual.parts }, () => "<i></i>").join("")}<span>작은 한 변 ${escapeHtml(visual.smallLabel)}</span><strong>큰 한 변 ${escapeHtml(visual.totalLabel)}</strong></div>`;
}

function nestedSquare(visual) {
  const ratio = Math.max(24, visual.inner / visual.outer * 68);
  return `<div class="b6-nested-square"><span style="--inner:${ratio}%"><i></i></span><p>바깥 ${visual.outer}cm · 안쪽 ${visual.inner}cm</p></div>`;
}

function multiplicationGrid(visual) {
  if (visual.mode === "area") {
    return `<div class="b6-area-model"><strong>${visual.first} × ${visual.second}</strong><div style="--cols:${visual.secondParts.length}">${visual.partials.map((value) => `<span>${value}</span>`).join("")}</div><p>부분의 넓이를 모두 더합니다.</p></div>`;
  }
  const a = String(visual.first).split("");
  const b = String(visual.second).split("");
  return `<div class="b6-napier"><strong>${visual.first} × ${visual.second}</strong><div style="--cols:${b.length}">${a.flatMap((x) => b.map((y) => `<span><i>${Number(x) * Number(y)}</i></span>`)).join("")}</div><p>대각선끼리 더하기</p></div>`;
}

function expression(visual) {
  return `<div class="b6-expression"><strong>${escapeHtml(visual.expression)}</strong></div>`;
}

function sequence(visual) {
  return `<div class="b6-sequence">${visual.values.map((value) => `<span>${value}</span>`).join("<i>→</i>")}<i>→</i><strong>${escapeHtml(visual.tail)}</strong></div>`;
}

function bookPages(visual) {
  return `<div class="b6-book-pages"><span>${visual.left}</span><i></i><span>${visual.right}</span></div>`;
}

function sequenceBoxes(visual) {
  return `<div class="b6-sequence-boxes">${Array.from({ length: visual.count }, () => "<span>?</span>").join("<i>→</i>")}<strong>합 ${visual.total}</strong></div>`;
}

function newspaperPages(visual) {
  return `<div class="b6-newspaper"><span>${visual.shown}</span><i></i><span>${visual.target}</span><strong>전체 ${visual.totalPages}쪽</strong></div>`;
}

function digitRange(visual) {
  return `<div class="b6-digit-range"><p>${visual.sample.map((value) => `<span>${value}</span>`).join("<i>→</i>")}</p><strong>쓴 숫자의 개수</strong></div>`;
}

function digitFocus(visual) {
  return `<div class="b6-digit-focus"><p>${visual.start}부터 ${visual.end}까지</p><span>${visual.digit}</span><strong>${visual.excluded ? "이 숫자가 없는 수" : "이 숫자가 나온 횟수"}</strong></div>`;
}

function operatorRow(visual) {
  return `<div class="b6-operator-row"><p>${visual.digits.map((digit, index) => `${index ? "<b>□</b>" : ""}<span>${digit}</span>`).join("")}</p><strong>= ${visual.target}</strong><em>${visual.choices.join(" · ")}</em></div>`;
}

function removablePlus(visual) {
  return `<div class="b6-removable-plus"><p>${visual.digits.map((digit, index) => `${index ? `<b data-index="${index}">+</b>` : ""}<span>${digit}</span>`).join("")}</p><strong>= ${visual.target}</strong></div>`;
}

export function book06Markup(visual) {
  if (!visual || visual.kind !== "book6") return "";
  switch (visual.subtype) {
    case "number-line": return numberLine(visual);
    case "split-number-line": return splitNumberLine(visual);
    case "rods": return rods(visual);
    case "fraction-chain": return fractionChain(visual);
    case "ratio-chain": return ratioChain(visual);
    case "segmented-bars": return segmentedBars(visual);
    case "balance": return balance(visual);
    case "balance-total": return balanceTotal(visual);
    case "symbol-equations": return symbolEquations(visual);
    case "stride": return stride(visual);
    case "rectangle": return rectangle(visual);
    case "equal-quadrilateral": return equalQuadrilateral(visual);
    case "joined-rectangles": return joinedRectangles(visual);
    case "joined-offset": return joinedOffset(visual);
    case "attached-polygons": return attachedPolygons(visual);
    case "diagonal-rectangle": return diagonalRectangle(visual);
    case "cell-strip": return cellStrip(visual);
    case "cell-shape": return cellShape(visual);
    case "cell-cutout": return cellCutout(visual);
    case "folded-rectangle": return foldedRectangle(visual);
    case "route": return route(visual);
    case "orthogonal-polygon": return orthogonalPolygon(visual);
    case "before-after-cells": return beforeAfterCells(visual);
    case "square-partition": return squarePartition(visual);
    case "nested-square": return nestedSquare(visual);
    case "multiplication-grid": return multiplicationGrid(visual);
    case "expression": return expression(visual);
    case "sequence": return sequence(visual);
    case "book-pages": return bookPages(visual);
    case "sequence-boxes": return sequenceBoxes(visual);
    case "newspaper-pages": return newspaperPages(visual);
    case "digit-range": return digitRange(visual);
    case "digit-focus": return digitFocus(visual);
    case "operator-row": return operatorRow(visual);
    case "removable-plus": return removablePlus(visual);
    default: return "";
  }
}
