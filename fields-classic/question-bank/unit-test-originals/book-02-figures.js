// 2권 권별 테스트 원문 그림(다시 그린 것) — 원문 스캔의 하늘색·청록 그림과 그림 조각 대신 우리 색표로 새로 그린다.
// 수·배치·방향은 원문 그대로. 모양 색은 워밍업 그림 색표(.claude/skills/golden-bell-figure-style):
// ○빨강 □파랑 △초록 ◇보라 ☆노랑 ♡분홍, 십자는 주황. 바둑돌·검은 삼각형처럼 색이 문제 내용인 곳은 검정·흰색 그대로.
import { UT, esc, text, svg, box, line, cardsRow } from "./kit.js?v=20261028ze";

const n = (value) => Number(value.toFixed(2));
const STAR_LINE = "#d9a400";
const SHAPE = Object.freeze({
  circle: { line: UT.red, soft: UT.redSoft },
  square: { line: UT.blue, soft: UT.blueSoft },
  triangle: { line: UT.green, soft: UT.greenSoft },
  diamond: { line: UT.purple, soft: UT.purpleSoft },
  star: { line: STAR_LINE, soft: UT.yellowSoft, solid: "#f0b23a" },
  heart: { line: UT.pink, soft: "#fde0ee" },
  cross: { line: UT.orange, soft: UT.orangeSoft }
});

// 모양 하나. mode: soft(연한 바탕) · solid(꽉 찬 색) · hollow(흰 바탕)
export function shape(kind, x, y, r, mode = "soft") {
  const color = SHAPE[kind] || SHAPE.circle;
  const fill = mode === "solid" ? (color.solid || color.line) : mode === "hollow" ? "#fff" : color.soft;
  const attrs = `fill="${fill}" stroke="${color.line}" stroke-width="1.8" stroke-linejoin="round"`;
  if (kind === "circle") return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.9)}" ${attrs}/>`;
  if (kind === "square") return `<rect x="${n(x - r * 0.82)}" y="${n(y - r * 0.82)}" width="${n(r * 1.64)}" height="${n(r * 1.64)}" ${attrs}/>`;
  if (kind === "triangle") return `<path d="M${n(x)} ${n(y - r)}L${n(x + r)} ${n(y + r * 0.78)}H${n(x - r)}Z" ${attrs}/>`;
  if (kind === "diamond") return `<path d="M${n(x)} ${n(y - r)}L${n(x + r * 0.95)} ${n(y)}L${n(x)} ${n(y + r)}L${n(x - r * 0.95)} ${n(y)}Z" ${attrs}/>`;
  if (kind === "star") {
    const points = Array.from({ length: 10 }, (_, index) => {
      const radius = index % 2 ? r * 0.42 : r;
      const angle = -Math.PI / 2 + index * Math.PI / 5;
      return `${n(x + radius * Math.cos(angle))} ${n(y + 0.08 * r + radius * Math.sin(angle))}`;
    });
    return `<path d="M${points.join("L")}Z" ${attrs}/>`;
  }
  if (kind === "heart") return `<path d="M${n(x)} ${n(y + r * 0.9)}C${n(x - r * 1.35)} ${n(y)} ${n(x - r * 0.95)} ${n(y - r * 1.1)} ${n(x)} ${n(y - r * 0.4)}C${n(x + r * 0.95)} ${n(y - r * 1.1)} ${n(x + r * 1.35)} ${n(y)} ${n(x)} ${n(y + r * 0.9)}Z" ${attrs}/>`;
  if (kind === "cross") {
    const a = r * 0.34;
    const e = r * 0.88;
    return `<path d="M${n(x - a)} ${n(y - e)}H${n(x + a)}V${n(y - a)}H${n(x + e)}V${n(y + a)}H${n(x + a)}V${n(y + e)}H${n(x - a)}V${n(y + a)}H${n(x - e)}V${n(y - a)}H${n(x - a)}Z" ${attrs}/>`;
  }
  return "";
}

const SHAPE_WORD = Object.freeze({ circle: "동그라미", square: "네모", triangle: "세모", diamond: "마름모", star: "별", heart: "하트", cross: "십자" });
const blankFill = UT.purpleSoft;

// ── 매트릭스(1·2·22번): 모양 칸 + 오른쪽 가로줄 합 + 아래 세로줄 합. null 은 색칠된 빈 칸
function matrix(visual) {
  const size = 44;
  const rows = visual.cells.length;
  const columns = visual.cells[0].length;
  const pad = 3;
  let body = "";
  visual.cells.forEach((row, r) => row.forEach((kind, c) => {
    const x = pad + c * size;
    const y = pad + r * size;
    body += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" stroke="${UT.box}" stroke-width="1.4"/>${shape(kind, x + size / 2, y + size / 2 + (kind === "triangle" ? 2 : 0), 16)}`;
  }));
  const sum = (x, y, value) => `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${blankFill}" stroke="${UT.box}" stroke-width="1.4"/>${value == null ? "" : text(x + size / 2, y + size / 2 + 1, value, { size: 18, weight: 600 })}`;
  visual.rowSums.forEach((value, r) => { body += sum(pad + columns * size, pad + r * size, value); });
  visual.columnSums.forEach((value, c) => { body += sum(pad + c * size, pad + rows * size, value); });
  const label = `${rows}줄 ${columns}칸 모양 매트릭스와 줄의 합`;
  return svg(pad * 2 + (columns + 1) * size, pad * 2 + (rows + 1) * size, label, body, columns > 3 ? 270 : 230);
}

// ── 모양 식(6·8·23번): 숫자 카드(있으면) + 종이색 판 위의 식 줄
function equations(visual) {
  const r = 14;
  const shapeStep = 36;
  const opStep = 20;
  const widthOf = (row) => row.reduce((sum, piece) => sum + (SHAPE[piece] ? shapeStep : opStep), 0);
  const inner = Math.max(...visual.rows.map(widthOf));
  const panelPad = 16;
  const panelWidth = inner + panelPad * 2;
  const top = visual.cards?.length ? 48 : 2;
  const rowStep = 40;
  const panelHeight = visual.rows.length * rowStep + 16;
  const width = Math.max(panelWidth + 4, (visual.cards?.length || 0) * 36 + 8);
  const left = (width - panelWidth) / 2;
  let body = visual.cards?.length ? cardsRow(visual.cards, width, 4, 32) : "";
  body += `<rect x="${n(left)}" y="${top}" width="${panelWidth}" height="${panelHeight}" rx="14" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`;
  visual.rows.forEach((row, index) => {
    let x = left + panelPad;
    const y = top + 8 + index * rowStep + rowStep / 2;
    row.forEach((piece) => {
      if (SHAPE[piece]) {
        body += shape(piece, x + shapeStep / 2, y + (piece === "triangle" ? 2 : 0), r);
        x += shapeStep;
      } else {
        body += text(x + opStep / 2, y, piece, { size: 18, weight: 700 });
        x += opStep;
      }
    });
  });
  return svg(Math.ceil(width), top + panelHeight + 2, "모양으로 나타낸 식", body, Math.min(330, Math.ceil(width * 0.86)));
}

// ── 양팔저울(7·9번): 위 줄에 두 개, 아래 가운데 하나
const SCALE_TOKEN = Object.freeze({ circle: "circle", diamond: "diamond", square: "square", star: "star" });
function scale(cx, baseY, left, right) {
  const span = 74;
  const panW = 96;
  const panY = baseY;
  const beamY = baseY + 16;
  const token = (kind, x, y, label) => {
    const r = 15;
    let out = shape(SCALE_TOKEN[kind], x, y, kind === "square" ? 16.5 : kind === "star" ? 17 : r, "solid");
    if (label != null) out += `<circle cx="${n(x)}" cy="${n(y)}" r="7" fill="#fff"/>${text(x, y + 0.5, label, { size: 11, weight: 800 })}`;
    return out;
  };
  const pan = (items, x) => {
    const step = 29;
    const start = x - (items.length - 1) * step / 2;
    return items.map((item, index) => token(item.kind || item, start + index * step, panY - 15.5, item.label)).join("");
  };
  let body = "";
  for (const side of [-1, 1]) {
    const x = cx + side * span;
    body += line(x, panY + 2, x, beamY, { stroke: UT.line, width: 1.6 });
    body += `<ellipse cx="${x}" cy="${panY}" rx="${panW / 2}" ry="5" fill="#fff" stroke="${UT.line}" stroke-width="1.5"/>`;
  }
  body += `<rect x="${cx - span}" y="${beamY - 2}" width="${span * 2}" height="4" rx="2" fill="#f39a1e"/>`;
  body += `<path d="M${cx} ${beamY + 1}L${cx + 14} ${beamY + 25}H${cx - 14}Z" fill="#ffd45c" stroke="#d79a00" stroke-width="1.4" stroke-linejoin="round"/>`;
  body += pan(left, cx - span) + pan(right, cx + span);
  return body;
}
function balances(visual) {
  const width = 504;
  const [a, b, c] = visual.scales;
  let body = scale(126, 40, a.left, a.right);
  body += scale(378, 40, b.left, b.right);
  body += scale(252, 140, c.left, c.right);
  return svg(width, 182, "평형을 이룬 양팔저울 세 개", body, 360);
}

// ── 모양 늘어놓기(10·11번): 모양 줄 + 빈 □ + …
function sequenceRow(items, x0, y, step = 32, r = 13) {
  let body = "";
  items.forEach((item, index) => {
    const kind = item.kind || item;
    body += shape(kind, x0 + index * step, y + (kind === "triangle" ? 2 : 0), r, item.mode || "soft");
  });
  const bx = x0 + items.length * step - step / 2 + 6;
  body += box(bx, y - 18, 46, 36, { radius: 6 });
  body += text(bx + 60, y + 2, "…", { size: 16 });
  return { body, end: bx + 72 };
}
function sequences(visual) {
  const labelled = visual.rows.length > 1;
  const x0 = labelled ? 50 : 18;
  let width = 0;
  let body = "";
  const rowStep = labelled ? 96 : 0;
  visual.rows.forEach((row, index) => {
    const y = 24 + index * rowStep;
    if (labelled) body += text(4, y, `(${index + 1})`, { size: 14, weight: 600, anchor: "start" });
    const drawn = sequenceRow(row, x0, y);
    body += drawn.body;
    width = Math.max(width, drawn.end);
  });
  const height = 48 + (visual.rows.length - 1) * rowStep;
  return svg(Math.ceil(width), height, "일정한 규칙으로 늘어놓은 모양", body, labelled ? 340 : 350);
}

// ── 수열(12번): 글 줄 그대로
function numberLines(visual) {
  let body = "";
  visual.lines.forEach((value, index) => { body += text(2, 18 + index * 64, value, { size: 15, weight: 500, anchor: "start" }); });
  return svg(370, 36 + (visual.lines.length - 1) * 64, "규칙에 따라 늘어놓은 수", body, 340);
}

// ── 성냥개비 오각형(13번): 막대 갈색 · 머리 빨강(교사용 문제은행과 같은 값)
const MATCH = "#bf8a42";
const HEAD = "#df4c43";
function stick(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const a = [x1 + ux * 3, y1 + uy * 3];
  const b = [x2 - ux * 3, y2 - uy * 3];
  return `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="${MATCH}" stroke-width="4" stroke-linecap="round"/><ellipse cx="${n(b[0] - ux * 2)}" cy="${n(b[1] - uy * 2)}" rx="4.2" ry="3.2" transform="rotate(${n(Math.atan2(dy, dx) * 180 / Math.PI)} ${n(b[0] - ux * 2)} ${n(b[1] - uy * 2)})" fill="${HEAD}"/>`;
}
function houses(count, x0, base) {
  const w = 46;
  const wall = 40;
  const roof = 34;
  let body = "";
  body += stick(x0, base, x0, base - wall); // 왼쪽 벽(머리 위)
  for (let i = 0; i < count; i += 1) {
    const left = x0 + i * w;
    const right = left + w;
    body += stick(left, base, right, base); // 바닥(머리 오른쪽)
    body += stick(right, base, right, base - wall); // 오른쪽 벽
    body += stick(left, base - wall, left + w / 2, base - wall - roof); // 지붕 왼쪽
    body += stick(right, base - wall, left + w / 2, base - wall - roof); // 지붕 오른쪽
  }
  return body;
}
function matchHouses(visual) {
  const base = 88;
  const labels = visual.labels;
  const starts = [8, 86, 210];
  let body = "";
  [1, 2, 3].forEach((count, index) => {
    body += houses(count, starts[index], base);
    body += text(starts[index] + count * 23, base + 26, labels[index], { size: 14, weight: 600 });
  });
  body += text(368, base - 18, "…", { size: 16 });
  return svg(384, base + 40, "성냥개비로 만든 오각형 집 모양", body, 330);
}

// ── 삼각형 늘어나기(14번): 흰 삼각형·검은 삼각형(색이 문제 내용이라 검정·흰색 그대로)
function triangleStage(n0, left, base, s) {
  const h = s * Math.sqrt(3) / 2;
  const apexX = left + n0 * s / 2;
  const apexY = base - n0 * h;
  let body = "";
  for (let row = 0; row < n0; row += 1) {
    const y0 = apexY + row * h;
    const y1 = y0 + h;
    for (let k = 0; k <= row; k += 1) {
      const xTop = apexX - row * s / 2 + k * s;
      body += `<path d="M${n(xTop)} ${n(y0)}L${n(xTop + s / 2)} ${n(y1)}H${n(xTop - s / 2)}Z" fill="#fff" stroke="${UT.ink}" stroke-width="1.3" stroke-linejoin="round"/>`;
      if (k < row) body += `<path d="M${n(xTop)} ${n(y0)}H${n(xTop + s)}L${n(xTop + s / 2)} ${n(y1)}Z" fill="${UT.ink}" stroke="${UT.ink}" stroke-width="1.3" stroke-linejoin="round"/>`;
    }
  }
  return body;
}
function triangleGrowth(visual) {
  const s = 28;
  const base = 128;
  const lefts = [8, 70, 160, 282];
  let body = "";
  [1, 2, 3, 4].forEach((count, index) => {
    body += triangleStage(count, lefts[index], base, s);
    body += text(lefts[index] + count * s / 2, base + 22, visual.labels[index], { size: 14, weight: 600 });
  });
  body += text(412, base - 70, "…", { size: 16 });
  return svg(426, base + 34, "규칙에 따라 그린 삼각형", body, 340);
}

// ── 반으로 접기(15번): 종이색 · 접는 선 점선 · 굽은 화살표 빨강 · 사이 화살표 주황
function curvedArrow(x, y, dx, dy) {
  // (x,y) 에서 (x+dx, y+dy) 로 휘어 가는 짧은 화살표
  const mx = x + dx / 2 - dy * 0.45;
  const my = y + dy / 2 + dx * 0.45;
  const ex = x + dx;
  const ey = y + dy;
  const angle = Math.atan2(ey - my, ex - mx);
  const head = (t) => `${n(ex - 6 * Math.cos(angle + t))} ${n(ey - 6 * Math.sin(angle + t))}`;
  return `<path d="M${n(x)} ${n(y)}Q${n(mx)} ${n(my)} ${n(ex)} ${n(ey)}" fill="none" stroke="${UT.arrow}" stroke-width="1.8" stroke-linecap="round"/><path d="M${head(0.5)}L${n(ex)} ${n(ey)}L${head(-0.5)}" fill="none" stroke="${UT.arrow}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const blockArrow = (x, y) => `<path d="M${x} ${y - 3.5}h9v-4l8 7.5l-8 7.5v-4h-9z" fill="${UT.orange}"/>`;
function halfFolds(visual) {
  const paper = (points) => `<path d="M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z" fill="${UT.paper}" stroke="${UT.paperLine}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const crease = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { stroke: UT.crease, width: 1.3, dash: "4 3" });
  let body = "";
  // 정사각형: 왼쪽 위 → 오른쪽 아래 대각선으로 접기
  body += paper([[6, 10], [86, 10], [86, 90], [6, 90]]) + crease(6, 10, 86, 90) + curvedArrow(56, 38, -20, 22);
  body += blockArrow(96, 50);
  // 1번: 직각이 왼쪽 아래인 삼각형, 직각에서 빗변 가운데로 접는 선
  body += paper([[126, 10], [126, 90], [206, 90]]) + crease(126, 90, 166, 50) + curvedArrow(148, 58, 18, 18);
  body += blockArrow(214, 72);
  // 2번: 꼭짓점이 위인 삼각형, 가운데 세로로 접는 선
  body += paper([[244, 90], [284, 50], [324, 90]]) + crease(284, 50, 284, 90) + curvedArrow(274, 74, 20, 0);
  body += blockArrow(332, 72);
  // 3번
  body += paper([[362, 50], [362, 90], [402, 90]]);
  body += text(420, 84, "…", { size: 16 });
  visual.labels.forEach((label, index) => { body += text([166, 284, 382][index], 112, label, { size: 14, weight: 600 }); });
  return svg(432, 124, "정사각형 종이를 계속 반으로 접는 그림", body, 340);
}

// ── 수 표(16번): 왼쪽 칸 · 가운데 넓은 칸(수 두 개) · 오른쪽 칸. null 은 색칠된 빈 칸
function relationTable(visual) {
  const cw = 54;
  const mid = 108;
  const rh = 40;
  const x0 = 3;
  const y0 = 3;
  let body = "";
  visual.rows.forEach(([a, b, c, d], r) => {
    const y = y0 + r * rh;
    body += `<rect x="${x0}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="${UT.box}" stroke-width="1.4"/><rect x="${x0 + cw}" y="${y}" width="${mid}" height="${rh}" fill="#fff" stroke="${UT.box}" stroke-width="1.4"/><rect x="${x0 + cw + mid}" y="${y}" width="${cw}" height="${rh}" fill="#fff" stroke="${UT.box}" stroke-width="1.4"/>`;
    const cy = y + rh / 2 + 1;
    body += text(x0 + cw / 2, cy, a, { size: 15, weight: 600 }) + text(x0 + cw + mid * 0.25, cy, b, { size: 15, weight: 600 });
    body += c == null ? `<circle cx="${x0 + cw + mid * 0.75}" cy="${y + rh / 2}" r="14" fill="${blankFill}" stroke="${UT.box}" stroke-width="1.2"/>` : text(x0 + cw + mid * 0.75, cy, c, { size: 15, weight: 600 });
    body += text(x0 + cw * 1.5 + mid, cy, d, { size: 15, weight: 600 });
  });
  return svg(x0 * 2 + cw * 2 + mid, y0 * 2 + visual.rows.length * rh, "수 사이의 관계를 찾는 표", body, 250);
}

// ── 수 퍼즐(17번): 네 칸씩 선으로 이은 네 줄. null 은 색칠된 빈 칸
function linkedRows(visual) {
  const size = 36;
  const gap = 26;
  const rowStep = 50;
  let body = "";
  visual.rows.forEach((row, r) => {
    const y = 3 + r * rowStep;
    row.forEach((value, c) => {
      const x = 3 + c * (size + gap);
      if (c) body += line(x - gap, y + size / 2, x, y + size / 2, { stroke: UT.box, width: 1.4 });
      body += box(x, y, size, size, { fill: value == null ? blankFill : "#fff", radius: 2, width: 1.5 });
      if (value != null) body += text(x + size / 2, y + size / 2 + 1, value, { size: 15, weight: 600 });
    });
  });
  return svg(6 + 4 * size + 3 * gap, 6 + 3 * rowStep + size, "선으로 이은 수 퍼즐", body, 230);
}

// ── 세 꼭짓점 원 + 가운데 수(18번)
function triangleRules(visual) {
  const w = 120;
  const h = 112;
  let body = "";
  visual.items.forEach((item, index) => {
    const ox = 4 + (index % 2) * (w + 14);
    const oy = 4 + Math.floor(index / 2) * (h + 10);
    const top = [ox + w / 2, oy + 16];
    const left = [ox + 16, oy + h - 16];
    const right = [ox + w - 16, oy + h - 16];
    body += `<path d="M${top[0]} ${top[1]}L${right[0]} ${right[1]}L${left[0]} ${left[1]}Z" fill="none" stroke="${UT.box}" stroke-width="1.4" stroke-linejoin="round"/>`;
    for (const [[x, y], value] of [[top, item.top], [left, item.left], [right, item.right]]) {
      body += `<circle cx="${x}" cy="${y}" r="14" fill="#fff" stroke="${UT.box}" stroke-width="1.5"/>${text(x, y + 1, value, { size: 14, weight: 600 })}`;
    }
    const cx = ox + w / 2;
    const cy = oy + h * 0.6;
    body += item.center == null ? `<circle cx="${cx}" cy="${cy}" r="13" fill="${blankFill}" stroke="${UT.box}" stroke-width="1.2"/>` : text(cx, cy, item.center, { size: 15, weight: 600 });
  });
  return svg(8 + 2 * w + 14, 8 + 2 * h + 10, "삼각형 꼭짓점과 가운데에 쓴 수", body, 260);
}

// ── 다이아몬드 원 + 가운데 수(21번)
function diamondRules(visual) {
  const w = 120;
  let body = "";
  visual.items.forEach((item, index) => {
    const ox = 4 + (index % 2) * (w + 26);
    const oy = 4 + Math.floor(index / 2) * (w + 10);
    const c = [ox + w / 2, oy + w / 2];
    const d = w / 2 - 16;
    const spots = [[c[0], c[1] - d, item.top], [c[0] + d, c[1], item.right], [c[0], c[1] + d, item.bottom], [c[0] - d, c[1], item.left]];
    body += `<path d="M${spots.map(([x, y]) => `${x} ${y}`).join("L")}Z" fill="none" stroke="${UT.box}" stroke-width="1.4" stroke-linejoin="round"/>`;
    for (const [x, y, value] of spots) body += `<circle cx="${x}" cy="${y}" r="14" fill="#fff" stroke="${UT.box}" stroke-width="1.5"/>${text(x, y + 1, value, { size: 14, weight: 600 })}`;
    body += item.center == null ? `<circle cx="${c[0]}" cy="${c[1]}" r="14" fill="${blankFill}" stroke="${UT.box}" stroke-width="1.2"/>` : text(c[0], c[1], item.center, { size: 15, weight: 600 });
  });
  return svg(8 + 2 * w + 26, 8 + 2 * w + 10, "네 원과 가운데에 쓴 수", body, 260);
}

// ── 스도쿠(19·20번): 굵은 선 보라 · 칸 점선. blocks 는 칸마다 블록 번호, given 은 처음 수, values 는 채운 수(답 그림에서만)
function sudoku(visual) {
  const size = visual.size;
  const cell = size === 3 ? 50 : 44;
  const o = 3;
  const at = (r, c) => visual.blocks[r * size + c];
  let body = `<rect x="${o}" y="${o}" width="${cell * size}" height="${cell * size}" fill="#fff"/>`;
  // 칸 점선
  for (let i = 1; i < size; i += 1) {
    body += line(o + i * cell, o, o + i * cell, o + size * cell, { stroke: "#b9a7d9", width: 1, dash: "3 3" });
    body += line(o, o + i * cell, o + size * cell, o + i * cell, { stroke: "#b9a7d9", width: 1, dash: "3 3" });
  }
  // 굵은 선: 블록이 다른 이웃 칸 사이
  for (let r = 0; r < size; r += 1) for (let c = 0; c < size; c += 1) {
    if (c + 1 < size && at(r, c) !== at(r, c + 1)) body += line(o + (c + 1) * cell, o + r * cell, o + (c + 1) * cell, o + (r + 1) * cell, { stroke: UT.box, width: 2.6 });
    if (r + 1 < size && at(r, c) !== at(r + 1, c)) body += line(o + c * cell, o + (r + 1) * cell, o + (c + 1) * cell, o + (r + 1) * cell, { stroke: UT.box, width: 2.6 });
  }
  body += `<rect x="${o}" y="${o}" width="${cell * size}" height="${cell * size}" fill="none" stroke="${UT.box}" stroke-width="2.6"/>`;
  for (let r = 0; r < size; r += 1) for (let c = 0; c < size; c += 1) {
    const given = visual.given[r * size + c];
    const filled = visual.values?.[r * size + c];
    const value = given ?? filled;
    if (value != null) body += text(o + c * cell + cell / 2, o + r * cell + cell / 2 + 1, value, { size: 20, weight: given != null ? 500 : 800, fill: given != null ? UT.ink : UT.red });
  }
  return svg(o * 2 + cell * size, o * 2 + cell * size, `${size}×${size} 스도쿠 퍼즐`, body, size === 3 ? 170 : 200);
}

// ── 바둑돌(25번): 검은 돌 · 흰 돌(색이 문제 내용)
function stoneGrowth(visual) {
  const r = 6.2;
  const step = 14;
  const rowStep = 12.6;
  const base = 104;
  let x = 6;
  let body = "";
  visual.stages.forEach((rows, index) => {
    const w = rows * step;
    for (let row = 0; row < rows; row += 1) {
      const y = base - (rows - 1 - row) * rowStep;
      const count = row + 1;
      const startX = x + (w - count * step) / 2 + step / 2;
      for (let k = 0; k < count; k += 1) {
        const inner = row > 0 && row < rows - 1 && k > 0 && k < count - 1;
        body += `<circle cx="${n(startX + k * step)}" cy="${n(y)}" r="${r}" fill="${inner ? "#fff" : UT.ink}" stroke="${inner ? "#8a8a8a" : UT.ink}" stroke-width="1.2"/>`;
      }
    }
    body += text(x + w / 2, base + 24, `(${index + 1})`, { size: 13, weight: 600 });
    x += w + 10;
  });
  body += text(x + 6, base - 20, "…", { size: 16 });
  return svg(Math.ceil(x + 20), base + 36, "규칙에 따라 늘어놓은 바둑돌", body, 360);
}

// 글만 있는 문항: 원문처럼 그림 없이 풀이 자리만 둔다
const blank = () => `<div aria-hidden="true" style="width:100%;min-height:8px"></div>`;

const DRAW = Object.freeze({
  matrix, equations, balances, sequences, numberLines, matchHouses, triangleGrowth, halfFolds,
  relationTable, linkedRows, triangleRules, diamondRules, sudoku, stoneGrowth, blank
});

export function book02Figure(visual) {
  const draw = DRAW[visual?.type];
  return draw ? draw(visual) : blank();
}
export { SHAPE_WORD, esc };
