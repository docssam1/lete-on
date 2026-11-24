import { frac } from "./math-markup.js?v=20261122w";
import { dimOut, dimArc, isLength } from "./length-dim.js?v=20261124h";
const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
// 변의 길이 = 바깥 곡선 점선 + 끊은 자리 글자(스킬 gfield-textbook-design 4-3, 원장 2026-11-24 「도형의 변의 길이를 점선 호를 사용하여 길이를 써야지 기준이잖아」).
// a·b는 변의 두 끝 [x, y], c는 도형 가운데 — 바깥쪽으로 휜다. 길이가 아닌 글(가·나 같은 이름)은 그대로 쓴다.
// 세로에 가까운 변은 가로로 긴 글자가 변에 닿지 않게, 글자 폭의 반만큼 더 바깥으로 휜다.
const len = (a, b, c, label, { off = 16, size = 16 } = {}) => {
  if (label == null || label === "") return "";
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, across = Math.abs(b[1] - a[1]) / L, w = String(label).length * size * 0.56;
  return dimOut({ x: a[0], y: a[1] }, { x: b[0], y: b[1] }, { x: c[0], y: c[1] }, String(label), { off: off + across * w * 0.5, size });
};
const cmOf = (v) => (/^\d+(?:\.\d+)?$/.test(String(v)) ? `${v}cm` : String(v));

function numberLine(visual) {
  const width = 520;
  const left = 38;
  const right = width - 38;
  const y = 82;
  const step = (right - left) / visual.intervals;
  const ticks = Array.from({ length: visual.intervals + 1 }, (_, index) => {
    const x = left + index * step;
    const label = visual.labels?.[index];
    return `<g class="${visual.target === index ? "target" : ""}"><line x1="${x}" y1="${y - 11}" x2="${x}" y2="${y + 11}"/><circle cx="${x}" cy="${y}" r="4"/><text class="number-line-label" x="${x}" y="${y + 34}">${label ?? ""}</text></g>`;
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
  // 막대 길이도 막대 위 바깥 곡선 점선 + 끊은 자리 글자(원장 2026-11-24). 「N cm × M개」는 한 칸 위 호 + 옆 글자.
  // 길이 차 줄(repeat)은 차이를 구하는 막대라 「?」만 — 예전 「2cm씩 7번」은 이 문제의 답(몇 번)을 그림에 보였다.
  const TONE = { green: ["#dff2e8", "#53947a"], yellow: ["#fff0b5", "#c39333"], blue: ["#fdf4d7", "#8b7f69"] };
  const max = Math.max(...visual.rods.map((rod) => (rod.unit ? rod.unit * rod.count : rod.count)), 1);
  const X0 = 78, BW = 220, H = 22, ROW = 58, top = 32;
  let body = "";
  visual.rods.forEach((rod, k) => {
    const length = rod.unit ? rod.unit * rod.count : rod.count;
    const segments = rod.count;
    const w = Math.max(60, (length / max) * BW), cw = w / segments, y = top + k * ROW, [fill, line] = TONE[rod.tone] || TONE.blue;
    const name = isLength(rod.label) ? "" : rod.label;
    body += `<text x="${X0 - 10}" y="${y + H / 2}" dominant-baseline="central" style="text-anchor:end;font-size:15px;font-weight:800;fill:#3a3228">${escapeHtml(name)}</text>`;
    for (let i = 0; i < segments; i += 1) body += `<rect x="${(X0 + i * cw).toFixed(1)}" y="${y}" width="${cw.toFixed(1)}" height="${H}" style="fill:${fill};stroke:${line};stroke-width:1.2"/>`;
    if (rod.repeat) body += dimArc(X0, y, X0 + w, y, -10, "?", { size: 15 });
    else if (rod.unit) body += dimArc(X0, y, X0 + cw, y, -9, `${rod.unit}cm`, { size: 14 }) + `<text x="${X0 + w + 10}" y="${y + H / 2}" dominant-baseline="central" style="text-anchor:start;font-size:14px;font-weight:700;fill:#3a3228">× ${rod.count}개</text>`;
    else body += dimArc(X0, y, X0 + w, y, -10, `${rod.count}cm`, { size: 14 });
  });
  const W = X0 + BW + 70, HH = top + visual.rods.length * ROW - 20;
  return `<svg class="b6-svg b6-rods-svg" viewBox="0 0 ${W} ${HH}" style="width:100%;max-width:${W + 40}px;max-height:none" role="img" aria-label="막대 ${visual.rods.length}개">${body}</svg>`;
}

function fractionChain(visual) {
  const fraction = ([top, bottom]) => `<span class="fraction">${frac(top, bottom)}</span>`;
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
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 360 220" role="img" aria-label="직사각형"><rect x="55" y="35" width="250" height="135"/>${len([55, 170], [305, 170], [180, 102], visual.widthLabel)}${len([305, 35], [305, 170], [180, 102], visual.heightLabel)}${visual.perimeterLabel ? `<text class="note" x="180" y="24">둘레 ${escapeHtml(visual.perimeterLabel)}</text>` : ""}</svg>`;
}

function equalQuadrilateral(visual) {
  const shape = visual.shape === "마름모" ? `<polygon points="180,24 305,108 180,192 55,108"/>` : `<rect x="80" y="25" width="200" height="168"/>`;
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 360 225" role="img" aria-label="${visual.shape}">${shape}${visual.shape === "마름모" ? len([180, 192], [305, 108], [180, 108], visual.sideLabel) : len([80, 193], [280, 193], [180, 109], visual.sideLabel)}${visual.perimeterLabel ? `<text class="note" x="180" y="18">둘레 ${escapeHtml(visual.perimeterLabel)}</text>` : ""}</svg>`;
}

function joinedRectangles(visual) {
  const total = visual.widths.length;
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 430 220" role="img" aria-label="붙인 두 직사각형"><rect x="45" y="35" width="330" height="140"/><line x1="205" y1="35" x2="205" y2="175"/>${len([45, 175], [205, 175], [125, 105], cmOf(visual.widths[0]))}${len([205, 175], [375, 175], [290, 105], cmOf(visual.widths[1]))}${len([375, 35], [375, 175], [210, 105], cmOf(visual.height))}<text class="note" x="210" y="22">둘레 ${escapeHtml(visual.perimeterLabel)}</text></svg>`;
}

function joinedOffset(visual) {
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 430 240" role="img" aria-label="일부 변을 붙인 두 직사각형"><rect x="40" y="32" width="210" height="125"/><rect x="250" y="92" width="140" height="105"/><line class="target-line" x1="250" y1="92" x2="250" y2="157"/>${len([250, 92], [250, 157], [200, 125], "?", { off: 14 })}<text x="145" y="225">맞닿은 변의 길이</text></svg>`;
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
    const firstPoints = polygonFromSharedEdge(visual.sides[0], first, second, 1);
    const shapes = `<polygon points="${firstPoints}"/><polygon points="${polygonFromSharedEdge(visual.sides[1], first, second, -1)}"/><line class="shared-edge" x1="${first.x}" y1="${first.y}" x2="${second.x}" y2="${second.y}"/>`;
    // 한 변의 길이는 첫 도형의 맨 아래 바깥 변에 점선 호로
    const pts = firstPoints.split(" ").map((p) => p.split(",").map(Number)), c = [pts.reduce((t, p) => t + p[0], 0) / pts.length, pts.reduce((t, p) => t + p[1], 0) / pts.length];
    const edges = pts.map((p, i) => [p, pts[(i + 1) % pts.length]]).filter(([a, b]) => !(Math.abs(a[0] - first.x) < 1 && Math.abs(b[0] - first.x) < 1));
    const [ea, eb] = edges.sort((u, v) => (v[0][1] + v[1][1]) - (u[0][1] + u[1][1]))[0];
    return `<svg class="b6-svg b6-geometry" viewBox="0 0 380 225" role="img" aria-label="한 변을 붙인 두 정다각형">${shapes}${len(ea, eb, c, visual.sideLabel, { off: 14 })}${visual.perimeterLabel ? `<text class="note" x="190" y="18">둘레 ${escapeHtml(visual.perimeterLabel)}</text>` : ""}</svg>`;
  }
  const side = 66;
  const startX = 45;
  const shapes = visual.sides.map((_, index) => `<rect x="${startX + index * side}" y="55" width="${side}" height="${side}"/>`).join("");
  const width = startX * 2 + count * side;
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 ${width} 190" role="img" aria-label="한 변씩 붙인 여러 정사각형">${shapes}${len([startX, 121], [startX + side, 121], [startX + side / 2, 88], visual.sideLabel)}</svg>`;
}

function diagonalRectangle(visual) {
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 390 235" role="img" aria-label="대각선으로 나눈 직사각형"><rect x="55" y="35" width="275" height="150"/><line class="diagonal" x1="55" y1="185" x2="330" y2="35"/>${len([55, 185], [330, 185], [192, 110], visual.labels[0])}${len([330, 35], [330, 185], [192, 110], visual.labels[1])}${len([55, 185], [330, 35], [330, 185], visual.labels[2], { off: 18 })}</svg>`;
}

function cellStrip(visual) {
  // 한 칸의 한 변 = 첫 칸 위 바깥 곡선 점선(원장 2026-11-24)
  const c = 56, x0 = 20, y0 = 40, n = visual.count;
  const cells = Array.from({ length: n }, (_, i) => `<rect x="${x0 + i * c}" y="${y0}" width="${c}" height="${c}" style="fill:#fff6dc;stroke:#8b7f69;stroke-width:1.5"/>`).join("");
  return `<svg class="b6-svg b6-cell-strip-svg" viewBox="0 0 ${x0 * 2 + n * c} ${y0 + c + 16}" style="width:min(100%,${x0 * 2 + n * c + 30}px)" role="img" aria-label="정사각형 ${n}개를 이은 줄, 한 칸 ${visual.side}cm">${cells}${dimArc(x0, y0, x0 + c, y0, -11, `${visual.side}cm`, { size: 15 })}</svg>`;
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
  const pad = options.side ? 34 + Math.max(0, (options.sideSize || 15) - 15) : 20;
  const width = (bounds.maxX - bounds.minX + 1) * cell + 20 + pad;
  const height = (bounds.maxY - bounds.minY + 1) * cell + 20 + pad;
  const cut = new Set((options.cut || []).map(([x, y]) => `${x}:${y}`));
  const shapes = [];
  const X = (x) => pad + (x - bounds.minX) * cell, Y = (y) => pad + (y - bounds.minY) * cell;
  cells.forEach(([x, y]) => shapes.push(`<rect class="filled" x="${X(x)}" y="${Y(y)}" width="${cell}" height="${cell}" fill="#fdf4d7" stroke="#847863" stroke-width="1.5"/>`));
  (options.cut || []).forEach(([x, y]) => shapes.push(`<rect class="cut" x="${X(x)}" y="${Y(y)}" width="${cell}" height="${cell}" fill="#f1d2cb" stroke="#bb624f" stroke-width="1.5" stroke-dasharray="4 3"/>`));
  // 한 변의 길이 = 맨 윗줄 왼쪽 칸 위 바깥 곡선 점선(원장 2026-11-24)
  if (options.side) { const topRow = cells.filter(([, y]) => y === bounds.minY), [fx] = topRow.reduce((a, b) => (b[0] < a[0] ? b : a)); shapes.push(dimArc(X(fx), Y(bounds.minY), X(fx) + cell, Y(bounds.minY), -Math.min(12, cell * 0.3), options.side, { size: options.sideSize || Math.max(12, Math.min(15, cell * 0.42)) })); }
  return `<svg class="b6-svg b6-cells" viewBox="0 0 ${width} ${height}" style="width:min(100%,${Math.round(width * 1.15)}px)" role="img" aria-label="모눈 정사각형으로 만든 도형">${shapes.join("")}</svg>`;
}

function cellShape(visual) {
  return `<div class="b6-cell-panel">${cellSvg(visual.cells, { side: visual.sideLabel })}${visual.perimeterLabel ? `<strong>둘레 ${escapeHtml(visual.perimeterLabel)}</strong>` : ""}</div>`;
}

function cellCutout(visual) {
  const all = [...visual.cells, ...visual.cut];
  return `<div class="b6-cell-panel">${cellSvg(all, { cut: visual.cut, side: visual.sideLabel })}</div>`;
}

function foldedRectangle(visual) {
  // 처음 종이 → 반으로 접은 종이. 접은 종이의 가로·세로 = 바깥 곡선 점선(원장 2026-11-24)
  const fw = visual.foldedWidth, fh = visual.foldedHeight, k = Math.min(110 / fw, 110 / fh);
  const w = fw * k, h = fh * k, W0 = visual.foldWidth ? w * 2 : w, H0 = visual.foldWidth ? h : h * 2;
  const x0 = 20, y0 = 20, x1 = x0 + W0 + 70, y1 = y0 + (H0 - h) / 2;
  const paper = "fill:#f5efe2;stroke:#7f735f;stroke-width:2";
  const crease = visual.foldWidth ? `<line x1="${x0 + w}" y1="${y0}" x2="${x0 + w}" y2="${y0 + H0}" style="stroke:#c97a1f;stroke-width:1.6;stroke-dasharray:5 4"/>` : `<line x1="${x0}" y1="${y0 + h}" x2="${x0 + W0}" y2="${y0 + h}" style="stroke:#c97a1f;stroke-width:1.6;stroke-dasharray:5 4"/>`;
  const arrow = `<path d="M${x0 + W0 + 16} ${y0 + H0 / 2}h34m-8 -7l8 7-8 7" style="fill:none;stroke:#6b6151;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"/>`;
  const body = `<rect x="${x0}" y="${y0}" width="${W0}" height="${H0}" style="${paper}"/>${crease}${arrow}<rect x="${x1}" y="${y1}" width="${w}" height="${h}" style="${paper}"/>`
    + dimArc(x1, y1 + h, x1 + w, y1 + h, 12, `${fw}cm`, { size: 15 }) + len([x1 + w, y1], [x1 + w, y1 + h], [x1 + w / 2, y1 + h / 2], `${fh}cm`, { off: 10, size: 15 });
  const W = x1 + w + 70, H = Math.max(y0 + H0, y1 + h + 26) + 12;
  return `<svg class="b6-svg b6-folded-svg" viewBox="0 0 ${W} ${H}" style="width:min(100%,${Math.round(W * 1.15)}px)" role="img" aria-label="반으로 접은 직사각형, 접은 뒤 ${fw}cm × ${fh}cm">${body}</svg>`;
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
  const P = ([x, y]) => [55 + x / maxX * 270, 40 + y / maxY * 150];
  const points = visual.vertices.map((v) => P(v).join(",")).join(" ");
  // 가로 전체 = 위 변, 세로 전체 = 왼쪽 변(두 변 모두 꼭짓점 (0,0)에서 끝까지 곧게 이어진다), 들어간 깊이 = 홈의 세로 변 — 바깥 곡선 점선(원장 2026-11-24)
  const c = P([maxX / 2, maxY / 2]);
  let dims = len(P([0, 0]), P([maxX, 0]), c, visual.labels.width) + len(P([0, 0]), P([0, maxY]), c, visual.labels.height);
  if (visual.labels.depth) {
    const v = visual.vertices, k = v.findIndex(([x, y], i) => i > 0 && y < maxY && x > 0 && x < maxX && v[i - 1][1] === maxY && v[i - 1][0] === x);
    // 홈이 넓으면 홈 안으로, 좁으면 오른쪽 도형 안으로 휜다(글자가 홈 윗변에 닿지 않게)
    // 홈의 오른쪽 변·왼쪽 변 중, 휘어 들어갈 빈 곳(홈 안 또는 옆 도형)이 가장 넓은 쪽을 고른다
    if (k > 0) {
      const R = [P(v[k - 1]), P(v[k])], L = [P(v[k + 2]), P(v[k + 1])], notch = R[1][0] - L[1][0], right = P([maxX, 0])[0] - R[1][0], left = L[1][0] - P([0, 0])[0];
      // 아주 얕은 홈(변 30px 아래)은 글자가 아래 변에 걸리므로, 홈이 넓으면 홈 안으로
      const shallow = R[1][1] - R[0][1] > -30 && notch >= 50, inNotch = (room) => (shallow ? room + 1000 : room);
      const pick = [[R, inNotch(notch), 30], [R, right, -30], [L, inNotch(notch), -30], [L, left, 30]].sort((p, q) => q[1] - p[1])[0];
      dims += len(pick[0][0], pick[0][1], [pick[0][1][0] + pick[2], pick[0][1][1]], visual.labels.depth, { off: 10 });
    }
  }
  return `<svg class="b6-svg b6-geometry" viewBox="0 0 390 225" role="img" aria-label="직각으로 꺾인 도형">${`<polygon points="${points}"/>`}${dims}</svg>`;
}

function beforeAfterCells(visual) {
  return `<div class="b6-before-after"><span>${cellSvg(visual.before, { side: visual.sideLabel, sideSize: 26 })}<b>자르기 전</b></span><i>→</i><span>${cellSvg(visual.after)}<b>자른 후</b></span></div>`;
}

function squarePartition(visual) {
  // 작은 정사각형 한 변 = 첫 칸 위, 큰 정사각형 한 변 = 왼쪽 — 바깥 곡선 점선(원장 2026-11-24)
  const n = visual.parts, S = 160, c = S / n, x0 = 70, y0 = 36;
  let body = `<rect x="${x0}" y="${y0}" width="${S}" height="${S}" style="fill:#f7f2e6;stroke:#7f735f;stroke-width:3"/>`;
  for (let i = 1; i < n; i += 1) body += `<line x1="${x0 + i * c}" y1="${y0}" x2="${x0 + i * c}" y2="${y0 + S}" style="stroke:#a89c84;stroke-width:1.5"/><line x1="${x0}" y1="${y0 + i * c}" x2="${x0 + S}" y2="${y0 + i * c}" style="stroke:#a89c84;stroke-width:1.5"/>`;
  body += dimArc(x0, y0, x0 + c, y0, -11, visual.smallLabel, { size: 15 }) + len([x0, y0], [x0, y0 + S], [x0 + S / 2, y0 + S / 2], visual.totalLabel, { size: 15 });
  return `<svg class="b6-svg b6-square-partition-svg" viewBox="0 0 ${x0 + S + 30} ${y0 + S + 16}" style="width:min(100%,300px)" role="img" aria-label="큰 정사각형을 ${n} × ${n}칸으로 나눈 그림">${body}</svg>`;
}

function nestedSquare(visual) {
  // 바깥 한 변 = 아래, 안쪽 한 변 = 안쪽 정사각형 위 — 바깥 곡선 점선(원장 2026-11-24)
  const S = 170, x0 = 24, y0 = 18, r = Math.min(0.72, Math.max(0.3, visual.inner / visual.outer)), s = S * r, ix = x0 + (S - s) / 2, iy = y0 + (S - s) / 2 + 6;
  const body = `<rect x="${x0}" y="${y0}" width="${S}" height="${S}" style="fill:#f7f2e6;stroke:#b7841e;stroke-width:4"/><rect x="${ix}" y="${iy}" width="${s}" height="${s}" style="fill:#fff;stroke:#c58325;stroke-width:4"/>`
    + dimArc(x0, y0 + S, x0 + S, y0 + S, 14, `${visual.outer}cm`, { size: 15 }) + dimArc(ix, iy, ix + s, iy, -Math.min(10, (iy - y0) * 0.5), `${visual.inner}cm`, { size: 14 });
  return `<svg class="b6-svg b6-nested-svg" viewBox="0 0 ${S + x0 * 2} ${S + y0 + 34}" style="width:min(100%,250px)" role="img" aria-label="정사각형 안의 정사각형, 바깥 ${visual.outer}cm · 안쪽 ${visual.inner}cm">${body}</svg>`;
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
  return `<div class="b6-book-pages"><span>${visual.left}</span><i></i><span>${visual.right}</span>${visual.sum ? `<strong>두 쪽의 합 ${visual.sum}</strong>` : ""}</div>`;
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

function rangeCount(visual) {
  return `<div class="b6-range-count"><p><span>${visual.start}</span><i>→</i><em>…</em><i>→</i><span>${visual.end}</span></p><strong>${escapeHtml(visual.mode === "digits" ? "쓴 숫자의 개수" : "수의 개수")}</strong></div>`;
}

function digitFocus(visual) {
  return `<div class="b6-digit-focus"><p>${visual.start}부터 ${visual.end}까지</p><span>${visual.digit}</span><strong>${visual.excluded ? "이 숫자가 없는 수" : "이 숫자가 나온 횟수"}</strong></div>`;
}

function operatorRow(visual) {
  return `<div class="b6-operator-row"><p>${visual.digits.map((digit, index) => `${index ? "<b>□</b>" : ""}<span>${digit}</span>`).join("")}</p><strong>= ${visual.target}</strong></div>`;
}

function multipartConditions(visual) {
  const context = book06Markup(visual.context);
  const rows = visual.rows.map((row) => `<article class="b6-condition-row" data-book06-condition="${escapeHtml(row.id)}"><strong>${escapeHtml(row.label)}</strong><span>${escapeHtml(row.equation)}</span></article>`).join("");
  const printCompact = visual.printCompact ? '<style media="print">.gold-print-page .b6-condition-list[data-print-compact="true"]{display:none}</style>' : "";
  return `<section class="b6-multipart-conditions">${printCompact}<div class="b6-multipart-context">${context}</div><div class="b6-condition-list"${visual.printCompact ? ' data-print-compact="true"' : ""}>${rows}</div></section>`;
}

function operatorConditions(visual) {
  const rows = visual.rows.map((row) => {
    const expression = row.tokens.map((token, index) => `${index ? "<b>□</b>" : ""}<span>${escapeHtml(token)}</span>`).join("");
    return `<article class="b6-condition-row" data-book06-condition="${escapeHtml(row.id)}"><strong>${escapeHtml(row.label)}</strong><p>${expression}<em>= ${escapeHtml(row.target)}</em></p></article>`;
  }).join("");
  return `<section class="b6-operator-conditions">${rows}</section>`;
}

function removablePlus(visual) {
  return `<div class="b6-removable-plus"><p>${visual.digits.map((digit, index) => `${index ? `<b data-index="${index}">+</b>` : ""}<span>${digit}</span>`).join("")}</p><strong>= ${visual.target}</strong></div>`;
}

function unitTestNumberLine(part, index) {
  const width = 250;
  const left = 22;
  const right = width - 22;
  const y = 54;
  return `<svg viewBox="0 0 ${width} 92" role="img" aria-label="${index + 1}번 수직선"><text x="8" y="17">(${index + 1})</text><line x1="${left}" y1="${y}" x2="${right}" y2="${y}"/><circle cx="${left}" cy="${y}" r="4"/><circle cx="${right}" cy="${y}" r="4"/><circle class="target" cx="${(left + right) / 2}" cy="${y}" r="6"/><text x="${left}" y="80">${part.left}</text><text x="${right}" y="80">${part.right}</text><text class="target-label" x="${(left + right) / 2}" y="38">?</text></svg>`;
}

function unitTestVisual(visual) {
  const ulen = (a, b, c, label, opts = {}) => len(a, b, c, label, { size: 19, ...opts });
  const row = (values) => `<div class="ut-row">${values.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div>`;
  switch (visual.layout) {
    case "midpoint-pair":
      return `<div class="b6-ut b6-ut-lines">${visual.parts.map(unitTestNumberLine).join("")}</div>`;
    case "split-targets": {
      const total = visual.leftIntervals + visual.rightIntervals;
      const x = (index) => 28 + index / total * 484;
      const ticks = Array.from({ length: total + 1 }, (_, index) => `<line x1="${x(index)}" y1="62" x2="${x(index)}" y2="84"/>`).join("");
      const firstIndex = visual.leftTarget;
      const secondIndex = visual.leftIntervals + visual.rightTarget;
      return `<div class="b6-ut"><svg class="b6-ut-split" viewBox="0 0 540 125" role="img" aria-label="서로 다르게 나눈 수직선"><line x1="28" y1="73" x2="512" y2="73"/>${ticks}<circle class="target" cx="${x(firstIndex)}" cy="73" r="7"/><circle class="target" cx="${x(secondIndex)}" cy="73" r="7"/><text x="28" y="112">${visual.start}</text><text x="${x(visual.leftIntervals)}" y="112">${visual.middle}</text><text x="512" y="112">${visual.end}</text><text class="target-label" x="${x(firstIndex)}" y="43">㉠</text><text class="target-label" x="${x(secondIndex)}" y="43">㉡</text></svg></div>`;
    }
    case "measure-counts":
      return `<div class="b6-ut b6-ut-measure"><p style="--count:${visual.longCount}"><b>긴 끈</b>${Array.from({ length: visual.longCount }, () => "<i></i>").join("")}</p><p style="--count:${visual.shortCount}"><b>짧은 끈</b>${Array.from({ length: visual.shortCount }, () => "<i></i>").join("")}</p><strong>두 줄의 전체 길이는 같습니다.</strong></div>`;
    case "equal-bars":
      return `<div class="b6-ut b6-ut-bars"><p style="--count:${visual.firstCount}"><b>㉠</b>${Array.from({ length: visual.firstCount }, () => "<i></i>").join("")}</p><p style="--count:${visual.secondCount}"><b>㉡</b>${Array.from({ length: visual.secondCount }, () => "<i></i>").join("")}</p><strong>㉠+㉡=${visual.total}cm</strong></div>`;
    case "two-weight":
      return `<div class="b6-ut b6-ut-weight"><div>${"○".repeat(visual.circleCount)}<b>=</b>${"□".repeat(visual.squareCount)}</div><strong>○ + □ = ${visual.total}g</strong></div>`;
    case "symbol-chain":
      return `<div class="b6-ut b6-ut-symbol"><p>수 카드 ${visual.cards.map((card) => `<b>${card}</b>`).join("")}</p>${visual.equations.map((equation) => `<span>${escapeHtml(equation)}</span>`).join("")}<strong>${escapeHtml(visual.target)} = ?</strong></div>`;
    case "rectangle-rhombus":
      return `<div class="b6-ut"><svg class="b6-ut-geometry" viewBox="0 0 430 220" role="img" aria-label="직사각형과 마름모"><rect x="45" y="45" width="210" height="125"/><polygon points="255,45 365,107.5 255,170 145,107.5"/><line class="shared" x1="255" y1="45" x2="255" y2="170"/>${ulen([45, 170], [255, 170], [150, 107], `${visual.width}cm`)}${ulen([45, 45], [45, 170], [150, 107], "?")}<text class="note" x="150" y="28">직사각형 둘레 ${visual.rectanglePerimeter}cm</text></svg></div>`;
    case "three-shapes":
      return `<div class="b6-ut"><svg class="b6-ut-geometry" viewBox="0 0 500 280" role="img" aria-label="직사각형 정삼각형 정사각형"><rect x="35" y="45" width="235" height="110"/><polygon points="270,45 365,100 270,155"/><polygon points="365,100 270,155 325,250 420,195"/>${ulen([35, 155], [270, 155], [152, 100], "?")}${ulen([325, 250], [420, 195], [345, 175], `${visual.side}cm`)}<text class="note" x="250" y="22">전체 둘레 ${visual.perimeter}cm</text></svg></div>`;
    case "three-squares": {
      const largeSize = 170;
      const middleSize = largeSize * visual.middle / visual.large;
      const smallSize = largeSize * visual.small / visual.large;
      const left = 38;
      const top = 25;
      const rightStart = left + largeSize;
      const lowerTop = top + middleSize;
      const shadeWidth = middleSize - smallSize;
      return `<div class="b6-ut"><svg class="b6-ut-geometry" viewBox="0 0 470 225" role="img" aria-label="크기가 다른 세 정사각형"><rect x="${left}" y="${top}" width="${largeSize}" height="${largeSize}"/><rect x="${rightStart}" y="${top}" width="${middleSize}" height="${middleSize}"/><rect x="${rightStart}" y="${lowerTop}" width="${smallSize}" height="${smallSize}"/><rect class="shade" x="${rightStart + smallSize}" y="${lowerTop}" width="${shadeWidth}" height="${smallSize}"/>${ulen([left, top + largeSize], [left + largeSize, top + largeSize], [left + largeSize / 2, top + largeSize / 2], `${visual.large}cm`, { off: 12 })}${ulen([rightStart, top], [rightStart + middleSize, top], [rightStart + middleSize / 2, top + middleSize / 2], `${visual.middle}cm`, { off: 10 })}<text class="target-label" x="${rightStart + smallSize + shadeWidth / 2}" y="${lowerTop + smallSize / 2 + 5}">둘레 ?</text></svg></div>`;
    }
    case "scattered-perimeter":
      return `<div class="b6-ut"><svg class="b6-ut-geometry" viewBox="0 0 430 235" role="img" aria-label="직각으로 꺾인 도형"><polygon points="45,35 215,35 215,75 365,75 365,195 155,195 155,150 45,150"/>${ulen([45, 35], [215, 35], [130, 110], `${visual.horizontal[0]}cm`, { off: 12 })}${ulen([215, 75], [365, 75], [290, 135], `${visual.horizontal[1]}cm`, { off: 12 })}${ulen([365, 75], [365, 195], [260, 135], `${visual.vertical[0]}cm`)}${ulen([45, 35], [45, 150], [130, 92], `${visual.vertical[1]}cm`)}</svg></div>`;
    case "square-triangle-strip":
      return `<div class="b6-ut"><svg class="b6-ut-geometry" viewBox="0 0 500 270" role="img" aria-label="정사각형 두 개와 정삼각형 네 개를 붙인 도형"><rect x="155" y="85" width="90" height="90"/><rect x="245" y="85" width="90" height="90"/><polygon points="155,85 110,130 155,175"/><polygon points="335,85 380,130 335,175"/><polygon points="155,85 200,33 245,85"/><polygon points="155,175 200,227 245,175"/>${ulen([335, 85], [380, 130], [335, 130], `${visual.side}cm`, { off: 14 })}</svg></div>`;
    case "square-tiling": {
      const unit = 38;
      const left = 48;
      const top = 18;
      const large = 5 * unit;
      const medium = 2 * unit;
      const total = 7 * unit;
      return `<div class="b6-ut"><svg class="b6-ut-geometry b6-ut-square-tiling" viewBox="0 0 390 250" role="img" aria-label="크기가 다른 정사각형으로 나눈 큰 정사각형"><rect x="${left}" y="${top}" width="${large}" height="${large}"/><rect x="${left + large}" y="${top}" width="${medium}" height="${medium}"/><rect x="${left + large}" y="${top + medium}" width="${medium}" height="${medium}"/><rect x="${left + large}" y="${top + 2 * medium}" width="${unit}" height="${unit}"/><rect class="shade" x="${left + large + unit}" y="${top + 2 * medium}" width="${unit}" height="${unit}"/>${ulen([left, top + large], [left + total, top + large], [left + total / 2, top], `${visual.total}cm`, { off: 14 })}<text class="target-label" x="${left + large + 1.5 * unit}" y="${top + 2.5 * medium + 5}">?</text></svg></div>`;
    }
    case "two-parts":
      return `<div class="b6-ut b6-ut-parts">${visual.parts.map((part) => `<p>${escapeHtml(part)}</p>`).join("")}</div>`;
    case "sign-multi":
      return `<div class="b6-ut b6-ut-signs">${visual.targets.map((target, index) => `<p><b>(${index + 1})</b>${visual.values.map((value, valueIndex) => `${valueIndex ? "<i>□</i>" : ""}<span>${value}</span>`).join("")}<strong>= ${target}</strong></p>`).join("")}</div>`;
    case "join-pair":
      return `<div class="b6-ut b6-ut-signs">${visual.targets.map((target, index) => `<p><b>(${index + 1})</b>${visual.digits.map((value, valueIndex) => `${valueIndex ? "<i></i>" : ""}<span>${value}</span>`).join("")}<strong>= ${target}</strong></p>`).join("")}</div>`;
    case "balance-chain":
      return `<div class="b6-ut b6-ut-balance-chain">${visual.equations.map((equation) => `<p>${escapeHtml(equation)}</p>`).join("")}<strong>${escapeHtml(visual.target)}</strong></div>`;
    case "fold-cut-open":
      return `<div class="b6-ut b6-ut-fold"><span class="original"><i></i><b>처음</b></span><em>→</em><span class="folded"><i></i><b>${visual.cut}cm 잘라내기</b></span><em>→</em><span class="opened"><i></i><b>네 변 합 ${visual.openedPerimeter}cm</b></span></div>`;
    default:
      return row(["단원 테스트 그림"]);
  }
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
    case "range-count": return rangeCount(visual);
    case "digit-focus": return digitFocus(visual);
    case "multipart-conditions": return multipartConditions(visual);
    case "operator-conditions": return operatorConditions(visual);
    case "operator-row": return operatorRow(visual);
    case "removable-plus": return removablePlus(visual);
    case "unit-test": return unitTestVisual(visual);
    default: return "";
  }
}
