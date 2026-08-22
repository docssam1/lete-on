// 더클래식 1과정 3권 전용 시각 자료. 생성기는 수학 데이터만 만들고,
// 이 모듈은 문제 카드와 인쇄물에 같은 SVG/HTML을 그린다.

const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

const cardStrip = (values) => values?.length
  ? `<div class="b3-card-strip">${values.map((value) => `<span>${esc(value)}</span>`).join("")}</div>`
  : "";

function regularPoints(sides, cx, cy, radius, rotation = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + index * Math.PI * 2 / sides;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
}

const pointsText = (points) => points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

function tangramFitMarkup(visual) {
  const shape = (kind, x, y, scale = 1, rotation = 0) => {
    const base = kind === "정사각형"
      ? [[-24,-24],[24,-24],[24,24],[-24,24]]
      : kind === "평행사변형"
        ? [[-34,-22],[14,-22],[34,22],[-14,22]]
        : [[0,-31],[30,25],[-30,25]];
    const angle = rotation * Math.PI / 180;
    const points = base.map(([px, py]) => [
      x + (px * Math.cos(angle) - py * Math.sin(angle)) * scale,
      y + (px * Math.sin(angle) + py * Math.cos(angle)) * scale
    ]);
    return `<polygon points="${pointsText(points)}"/>`;
  };
  const options = visual.options.map((option, index) => {
    const x = 245 + index * 80;
    return `${shape(option.kind, x, 95, .8, option.rotation)}<text x="${x}" y="145">${option.option}번</text>`;
  }).join("");
  return `<svg class="b3-svg b3-tangram-fit" viewBox="0 0 500 170" role="img" aria-label="칠교판 빈자리와 보기 조각"><rect x="28" y="25" width="135" height="135" rx="3"/><path d="M28 25L163 160M163 25L28 160M28 93H163"/><g class="target">${shape(visual.targetKind, 96, 94, 1, visual.rotation)}</g><text x="96" y="15">빈자리</text><g class="options">${options}</g></svg>`;
}

function tangramAreaMarkup(visual) {
  const pieceShape = (piece, index) => {
    const x = 40 + index * 62;
    const isSelected = visual.selected.includes(piece.id);
    const points = piece.kind === "정사각형"
      ? [[x-20,42],[x+20,42],[x+20,82],[x-20,82]]
      : piece.kind === "평행사변형"
        ? [[x-25,45],[x+15,45],[x+25,80],[x-15,80]]
        : piece.kind === "큰 삼각형"
          ? [[x,31],[x+28,84],[x-28,84]]
          : piece.kind === "중간 삼각형"
            ? [[x,39],[x+23,83],[x-23,83]]
            : [[x,49],[x+18,83],[x-18,83]];
    return `<g class="${isSelected ? "selected" : ""}"><polygon points="${pointsText(points)}"/><text x="${x}" y="111">${piece.id}</text><text x="${x}" y="127">넓이 ${piece.area}</text></g>`;
  };
  return `<svg class="b3-svg b3-tangram-pieces" viewBox="0 0 480 145" role="img" aria-label="칠교 조각과 각 조각의 넓이">${visual.pieces.map(pieceShape).join("")}</svg>`;
}

function unitGridAreaMarkup(visual) {
  const unit = 30;
  const pad = 15;
  const size = visual.size * unit;
  const full = visual.fullCells.map((cell) => `<rect class="shade" x="${pad + cell.column * unit}" y="${pad + cell.row * unit}" width="${unit}" height="${unit}"/>`).join("");
  const half = visual.halfCells.map((cell) => {
    const x = pad + cell.column * unit;
    const y = pad + cell.row * unit;
    const points = cell.diagonal === "back"
      ? [[x,y],[x+unit,y],[x+unit,y+unit]]
      : [[x,y],[x+unit,y],[x,y+unit]];
    return `<polygon class="shade" points="${pointsText(points)}"/>`;
  }).join("");
  const grid = Array.from({ length: visual.size + 1 }, (_, index) => `<path d="M${pad + index * unit} ${pad}V${pad + size}M${pad} ${pad + index * unit}H${pad + size}"/>`).join("");
  return `<svg class="b3-svg b3-unit-grid" viewBox="0 0 ${size + pad * 2} ${size + pad * 2}" role="img" aria-label="온칸과 반칸으로 된 색칠한 모눈 도형">${full}${half}<g class="grid">${grid}</g></svg>`;
}

function shapeAreaGrowthMarkup(visual) {
  const shownCount = Math.min(visual.count, 5);
  const figures = Array.from({ length: shownCount }, (_, index) => {
    const side = visual.start + index;
    const x = 52 + index * 88;
    const dimension = 12 + side * 7;
    const y = 105 - dimension;
    const shapeSides = { triangle: 3, pentagon: 5, hexagon: 6 }[visual.shape];
    const body = visual.shape === "square"
      ? `<rect x="${x - dimension / 2}" y="${y}" width="${dimension}" height="${dimension}"/>`
      : `<polygon points="${pointsText(regularPoints(shapeSides, x, 105 - dimension / 2, dimension / 2, -Math.PI / 2))}"/>`;
    return `<g>${body}<text x="${x}" y="126">${index + 1}번째</text><text x="${x}" y="141">넓이 ${side * side}</text></g>`;
  }).join("");
  return `<svg class="b3-svg b3-growth" viewBox="0 0 470 155" role="img" aria-label="차례로 커지는 도형의 넓이">${figures}</svg>`;
}

function nestedSquareMarkup(visual) {
  const max = Math.max(...visual.sides);
  const rects = visual.sides.map((side) => {
    const dimension = 145 * side / max;
    return `<rect x="${100 - dimension / 2}" y="${90 - dimension / 2}" width="${dimension}" height="${dimension}"/>`;
  }).join("");
  return `<svg class="b3-svg b3-nested-square" viewBox="0 0 310 185" role="img" aria-label="겹쳐 커지는 정사각형">${rects}<text x="225" y="68">…</text><text x="225" y="94">${visual.target}번째</text><text x="225" y="118">${visual.askSum ? "넓이의 합" : "바깥 넓이"} ?</text></svg>`;
}

function fractionShapeMarkup(visual) {
  const sideCount = visual.shape === "triangle" ? 3 : visual.shape === "hexagon" ? 6 : 4;
  const vertices = regularPoints(sideCount, 120, 95, 72, visual.shape === "square" ? -Math.PI / 4 : -Math.PI / 2);
  const boundary = [];
  const perSide = visual.parts / sideCount;
  vertices.forEach((point, sideIndex) => {
    const next = vertices[(sideIndex + 1) % sideCount];
    for (let part = 0; part < perSide; part += 1) {
      const ratio = part / perSide;
      boundary.push([point[0] + (next[0] - point[0]) * ratio, point[1] + (next[1] - point[1]) * ratio]);
    }
  });
  const wedges = boundary.map((point, index) => {
    const next = boundary[(index + 1) % boundary.length];
    const shifted = (index - visual.rotation + visual.parts) % visual.parts;
    return `<polygon class="${shifted < visual.shaded ? "shade" : ""}" points="120,95 ${point[0]},${point[1]} ${next[0]},${next[1]}"/>`;
  }).join("");
  const lines = boundary.slice(0, visual.visibleLines).map(([x, y]) => `<line x1="120" y1="95" x2="${x}" y2="${y}"/>`).join("");
  const target = visual.targetParts ? `<text x="235" y="92">${visual.targetParts}조각</text><text x="235" y="111">으로 나누기</text>` : "";
  return `<svg class="b3-svg b3-fraction-shape" viewBox="0 0 310 190" role="img" aria-label="같은 크기의 조각으로 나눈 도형">${wedges}<polygon class="outline" points="${pointsText(vertices)}"/>${lines}${target}</svg>`;
}

function obliqueSquareMarkup(visual) {
  const grid = Array.from({ length: 13 }, (_, index) => `<path d="M${20 + index * 20} 10V250M10 ${20 + index * 20}H270"/>`).join("");
  const polygons = visual.squares.map(({ dx, dy, offsetX, offsetY }) => {
    const x = 38 + offsetX * 20;
    const y = 200 - offsetY * 20;
    const points = [[x,y],[x+dx*20,y-dy*20],[x+(dx+dy)*20,y+(dx-dy)*20],[x+dy*20,y+dx*20]];
    return `<polygon points="${pointsText(points)}"/>`;
  }).join("");
  return `<svg class="b3-svg b3-oblique" viewBox="0 0 280 260" role="img" aria-label="모눈 위 기울어진 정사각형"><g class="grid">${grid}</g>${polygons}</svg>`;
}

function gridPathMarkup(visual) {
  const xs = visual.points.map((point) => point.x);
  const ys = visual.points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const shifted = visual.points.map((point) => [40 + (point.x - minX) * 24, 35 + (point.y - minY) * 24]);
  const maxX = Math.max(...shifted.map((point) => point[0])) + 40;
  const maxY = Math.max(...shifted.map((point) => point[1])) + 40;
  const vLines = Array.from({ length: Math.ceil(maxX / 24) + 1 }, (_, index) => `<path d="M${index * 24} 0V${maxY}"/>`).join("");
  const hLines = Array.from({ length: Math.ceil(maxY / 24) + 1 }, (_, index) => `<path d="M0 ${index * 24}H${maxX}"/>`).join("");
  return `<svg class="b3-svg b3-grid-path" viewBox="0 0 ${maxX} ${maxY}" role="img" aria-label="모눈 위에 접혀 있는 색테이프"><g class="grid">${vLines}${hLines}</g><polyline points="${pointsText(shifted)}"/></svg>`;
}

function numberLineMarkup(visual) {
  const ticks = Array.from({ length: visual.divisions + 1 }, (_, index) => {
    const x = 35 + index * 300 / visual.divisions;
    const label = index === 0 ? visual.left : index === visual.divisions ? visual.right : visual.target === "middle" && index * 2 === visual.divisions ? "㉠" : "";
    return `<line x1="${x}" y1="67" x2="${x}" y2="87"/><text x="${x}" y="112">${label}</text>`;
  }).join("");
  return `<svg class="b3-svg b3-number-line" viewBox="0 0 370 130" role="img" aria-label="똑같은 간격으로 나눈 수직선"><line x1="35" y1="77" x2="335" y2="77"/>${ticks}<text x="185" y="28">${visual.target === "interval" ? "한 칸 = ?" : "중간수 = ?"}</text></svg>`;
}

function segmentChainMarkup(visual) {
  const xs = [45, 145, 245, 345];
  const labels = visual.labels.map((label, index) => `<circle cx="${xs[index]}" cy="90" r="5"/><text x="${xs[index]}" y="119">${label}</text>`).join("");
  const arc = (from, to, y, text) => `<path d="M${xs[from]} 82Q${(xs[from] + xs[to]) / 2} ${y} ${xs[to]} 82"/><text x="${(xs[from] + xs[to]) / 2}" y="${y + 5}">${text}cm</text>`;
  return `<svg class="b3-svg b3-segment-chain" viewBox="0 0 390 145" role="img" aria-label="A B C D 사이의 겹친 거리"><line x1="45" y1="90" x2="345" y2="90"/>${labels}${arc(0,2,28,visual.givens.AC)}${arc(1,3,48,visual.givens.BD)}${arc(0,3,8,visual.givens.AD)}<text x="195" y="138">${visual.target} = ?</text></svg>`;
}

function simpleBook3Markup(visual) {
  if (visual.subtype === "step-ratio") return `<div class="b3-simple"><div class="b3-step-row"><span>아이</span><b>👣</b><em>${visual.personSteps}걸음</em></div><div class="b3-step-row dog"><span>강아지</span><b>${"·".repeat(Math.min(visual.ratio, 7))}</b><em>아이 한 걸음마다 ${visual.ratio}걸음</em></div></div>`;
  if (visual.subtype === "route-multiple") return `<div class="b3-route"><span>집</span><i style="--part:${visual.first}">${visual.first}분</i><span>도서관</span><i style="--part:${visual.second}">?</i><span>학교</span><strong>전체 ${visual.whole}분</strong></div>`;
  if (visual.subtype === "rods") return `<div class="b3-rods">${visual.rows.map((row) => `<div><b>${row.label}</b><span>${Array.from({length:row.units},()=>"<i></i>").join("")}</span>${visual.given?.label === row.label ? `<em>1개 ${visual.given.value}cm</em>` : ""}</div>`).join("")}${visual.total ? `<strong>전체 ${visual.total}cm</strong>` : ""}</div>`;
  if (visual.subtype === "object-measure") return `<div class="b3-object-measure"><strong>${visual.total}cm</strong>${visual.rows.map((row) => `<div><b>${row.icon}</b><span>${Array.from({length:row.count},()=>`<i>${row.icon === "성냥" ? "┃" : "▭"}</i>`).join("")}</span><em>${row.count}개</em></div>`).join("")}</div>`;
  if (visual.subtype === "object-equation") return `<div class="b3-object-equation"><span>${visual.left.map((item) => `${item.icon} × ${item.count}`).join(" + ")}</span><b>=</b><span>${visual.right.map((item) => `${item.icon} × ${item.count}`).join(" + ")}</span><small>성냥 1개 ${visual.match}cm · ${visual.givenTarget === "log" ? "통나무" : "연필"} 1개 ${visual.givenValue}cm</small></div>`;
  if (visual.subtype === "meeting-distance") {
    const meetingPercent = visual.faster / visual.total * 100;
    return `<div class="b3-meeting"><span>집 A</span><i style="--meet:${meetingPercent}%"><b style="width:${meetingPercent}%"></b><em>만난 곳</em></i><span>집 B</span><strong>전체 ${visual.total}m · 거리비 ${visual.ratio}:1</strong></div>`;
  }
  if (visual.subtype === "difference-unit") return `<div class="b3-difference-unit"><div><b>㉠</b>${Array.from({length:visual.firstCount},()=>"<i class='long'></i>").join("")}</div><div><b>㉡</b>${Array.from({length:visual.secondCount},()=>"<i class='short'></i>").join("")}</div><strong>두 줄의 전체 길이는 같습니다.</strong></div>`;
  return "";
}

function mixedIntervalMarkup(visual) {
  const totalDivisions = visual.leftDivisions + visual.rightDivisions;
  const ticks = Array.from({ length: totalDivisions + 1 }, (_, index) => {
    const x = 35 + index * 320 / totalDivisions;
    let label = "";
    if (index === 0) label = visual.leftStart;
    if (index === visual.leftDivisions) label = visual.join;
    if (index === totalDivisions) label = visual.rightEnd;
    if (index === visual.leftIndex) label = "㉠";
    if (index === visual.leftDivisions + visual.rightIndex) label = "㉡";
    return `<line x1="${x}" y1="65" x2="${x}" y2="84"/><text x="${x}" y="108">${label}</text>`;
  }).join("");
  return `<svg class="b3-svg b3-number-line" viewBox="0 0 390 125" role="img" aria-label="간격이 다른 두 수직선 구간"><line x1="35" y1="75" x2="355" y2="75"/>${ticks}</svg>`;
}

function equationChainMarkup(visual) {
  return `<div class="b3-equation-chain">${visual.rows.map((row) => `<div>${row.left.map((value) => `<span>${esc(value)}</span>`).join("<b>+</b>")}<b>=</b><strong>${esc(row.result)}</strong></div>`).join("")}</div>`;
}

function binaryWeightMarkup(visual) {
  return `<div class="b3-binary"><div>${visual.weights.map((weight) => `<span><b>${weight}</b><small>g</small></span>`).join("")}</div><strong>목표 ${visual.target}g</strong></div>`;
}

function cellCodeMarkup(visual) {
  return `<div class="b3-cell-code">${visual.weights.map((weight, index) => `<span class="${visual.colored.includes(index) ? "colored" : ""}">${visual.showWeights ? weight : ""}</span>`).join("")}<strong>= ?</strong>${visual.showWeights ? "" : "<small>왼쪽부터 1, 2, 4, 8</small>"}</div>`;
}

function symbolCodeMarkup(visual) {
  return `<div class="b3-symbol-code">${visual.rows.map((row) => `<div>${row.symbols.map((symbol) => `<span>${esc(symbol)}</span>`).join("<b>+</b>")}<b>=</b><strong>${row.total}</strong></div>`).join("")}<p>${visual.targetSymbols.map((symbol) => `<span>${esc(symbol)}</span>`).join(" + ")} = ?</p></div>`;
}

function magicGridMarkup(visual) {
  return `${cardStrip(visual.cards)}<div class="b3-magic-wrap"><div class="b3-magic-grid" style="--size:${visual.size}">${visual.shown.map((value) => `<span class="${value == null ? "blank" : typeof value === "string" ? "target" : ""}">${value == null ? "" : esc(value)}</span>`).join("")}</div>${visual.lineSum ? `<strong>한 줄의 합 ${visual.lineSum}</strong>` : ""}</div>`;
}

function polygonRingMarkup(visual) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / 10;
    return [170 + Math.cos(angle) * 112, 135 + Math.sin(angle) * 112];
  });
  const star = [0,2,4,6,8].map((index) => points[index]).concat([points[0]]);
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y+1}">${visual.shown[index] ?? ""}</text>`).join("");
  return `${cardStrip(visual.cards)}<svg class="b3-svg b3-polygon-ring" viewBox="0 0 340 270" role="img" aria-label="오각형 둘레 열 개의 원에 수 놓기"><polyline points="${pointsText(star)}"/>${nodes}<text x="170" y="139">합 ${visual.lineSum}</text></svg>`;
}

function triangleEqualSumMarkup(visual) {
  const points = visual.size === 6
    ? [[170,25],[85,135],[35,230],[170,230],[305,230],[255,135]]
    : [[170,22],[115,90],[65,158],[30,230],[125,230],[215,230],[310,230],[275,158],[225,90]];
  const outline = [points[0], points[visual.size === 6 ? 2 : 3], points[visual.size === 6 ? 4 : 6], points[0]];
  const nodes = points.map(([x,y], index) => `<circle cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y+1}">${visual.shown[index] ?? ""}</text>`).join("");
  return `${cardStrip(visual.cards)}<svg class="b3-svg b3-triangle-sum" viewBox="0 0 340 260" role="img" aria-label="삼각형 세 변의 합 맞추기"><polyline points="${pointsText(outline)}"/>${nodes}<text x="170" y="153">한 변의 합</text><text x="170" y="177">${visual.lineSum}</text></svg>`;
}

export function book03Markup(visual) {
  if (!visual || visual.kind !== "book3") return "";
  if (visual.subtype === "tangram-fit") return tangramFitMarkup(visual);
  if (visual.subtype === "tangram-area") return tangramAreaMarkup(visual);
  if (visual.subtype === "unit-grid-area") return unitGridAreaMarkup(visual);
  if (visual.subtype === "shape-area-growth") return shapeAreaGrowthMarkup(visual);
  if (visual.subtype === "nested-square-area") return nestedSquareMarkup(visual);
  if (visual.subtype === "fraction-shape") return fractionShapeMarkup(visual);
  if (visual.subtype === "oblique-square-area") return obliqueSquareMarkup(visual);
  if (visual.subtype === "grid-path") return gridPathMarkup(visual);
  if (visual.subtype === "number-line") return numberLineMarkup(visual);
  if (visual.subtype === "segment-chain") return segmentChainMarkup(visual);
  if (["step-ratio","route-multiple","rods","object-measure","object-equation","meeting-distance","difference-unit"].includes(visual.subtype)) return simpleBook3Markup(visual);
  if (visual.subtype === "mixed-interval") return mixedIntervalMarkup(visual);
  if (visual.subtype === "equation-chain") return equationChainMarkup(visual);
  if (visual.subtype === "binary-weight") return binaryWeightMarkup(visual);
  if (visual.subtype === "cell-code") return cellCodeMarkup(visual);
  if (visual.subtype === "symbol-code") return symbolCodeMarkup(visual);
  if (visual.subtype === "magic-grid") return magicGridMarkup(visual);
  if (visual.subtype === "polygon-ring") return polygonRingMarkup(visual);
  if (visual.subtype === "triangle-equal-sum") return triangleEqualSumMarkup(visual);
  return "";
}
