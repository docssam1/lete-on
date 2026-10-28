// 8권 권별 테스트 원문(다시 짠 것) — 원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」.
// 문장·수·이름·배치는 원문 그대로, 그림은 우리 색표(.claude/skills/golden-bell-figure-style)로 새로 그린다.
// 정답은 여기에 두지 않는다(비공개 DB). visual 의 values 는 답안지 그림용으로만 쓰이며 이 파일의 문항에는 없다.
import { UT, text, svg, box, line, conditionsBox } from "./kit.js?v=20261028ze";

// 모양 색(색표): ● 빨강 · ▲ 초록 · ■ 파랑 · ◆ 보라 · ★ 노랑 · ♡ 분홍 · 오각형 주황 · 십자 노랑(평행사변형 줄과 같은 노랑)
const SHAPE = Object.freeze({
  circle: { line: "#e8503a", fill: "#ffe1dc", solid: "#e8503a", edge: "#b8321f", name: "동그라미" },
  square: { line: "#2f6fe0", fill: "#dde9ff", solid: "#2f6fe0", edge: "#1f55c0", name: "네모" },
  triangle: { line: "#2f9e5f", fill: "#dcf5e5", solid: "#2f9e5f", edge: "#1f7a45", name: "세모" },
  diamond: { line: "#8e5bd8", fill: "#ece0fb", solid: "#8e5bd8", edge: "#6b3fb3", name: "마름모" },
  star: { line: "#d9a400", fill: "#fff3c4", solid: "#f0b23a", edge: "#a8741a", name: "별" },
  heart: { line: "#e0559a", fill: "#fde0ee", solid: "#e0559a", edge: "#b03272", name: "하트" },
  pentagon: { line: "#f39a1e", fill: "#ffe9cc", solid: "#f39a1e", edge: "#b8700f", name: "오각형" },
  cross: { line: "#d9a400", fill: "#fff3c4", solid: "#d9a400", edge: "#9a7400", name: "십자" }
});
const isShape = (token) => Object.hasOwn(SHAPE, token);
const PANEL = "#fff4c2";
const SUM_FILL = "#fff3c4";
const pts = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

// 모양 하나: 가운데 (cx, cy), 반지름 r. solid=꽉 찬 토큰(저울·식의 무게), 아니면 숫자를 써 넣는 빈 모양
function shapePath(kind, cx, cy, r) {
  if (kind === "circle") return { tag: "circle", attrs: `cx="${cx}" cy="${cy}" r="${r}"` };
  if (kind === "square") return { tag: "rect", attrs: `x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" rx="${Math.max(1, r * 0.08)}"` };
  if (kind === "diamond") return { tag: "polygon", attrs: `points="${pts([[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]])}"` };
  if (kind === "triangle") return { tag: "polygon", attrs: `points="${pts([[cx, cy - r], [cx + r * 1.02, cy + r * 0.9], [cx - r * 1.02, cy + r * 0.9]])}"` };
  if (kind === "pentagon") return { tag: "polygon", attrs: `points="${pts(Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; return [cx + Math.cos(a) * r, cy + 0.08 * r + Math.sin(a) * r]; }))}"` };
  if (kind === "star") return { tag: "polygon", attrs: `points="${pts(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5; const k = i % 2 ? r * 0.45 : r * 1.05; return [cx + Math.cos(a) * k, cy + 0.1 * r + Math.sin(a) * k]; }))}"` };
  if (kind === "cross") {
    const a = r * 0.36;
    return { tag: "polygon", attrs: `points="${pts([[cx - a, cy - r], [cx + a, cy - r], [cx + a, cy - a], [cx + r, cy - a], [cx + r, cy + a], [cx + a, cy + a], [cx + a, cy + r], [cx - a, cy + r], [cx - a, cy + a], [cx - r, cy + a], [cx - r, cy - a], [cx - a, cy - a]])}"` };
  }
  if (kind === "heart") return { tag: "path", attrs: `d="M${cx} ${cy + r * 0.95}C${cx - r * 0.35} ${cy + r * 0.6} ${cx - r * 1.05} ${cy + r * 0.1} ${cx - r * 1.0} ${cy - r * 0.35}C${cx - r * 0.95} ${cy - r * 0.95} ${cx - r * 0.2} ${cy - r * 1.05} ${cx} ${cy - r * 0.45}C${cx + r * 0.2} ${cy - r * 1.05} ${cx + r * 0.95} ${cy - r * 0.95} ${cx + r * 1.0} ${cy - r * 0.35}C${cx + r * 1.05} ${cy + r * 0.1} ${cx + r * 0.35} ${cy + r * 0.6} ${cx} ${cy + r * 0.95}Z"` };
  return null;
}
function shape(kind, cx, cy, r, { solid = false, value = null, size = null, width = null } = {}) {
  const color = SHAPE[kind];
  const path = shapePath(kind, cx, cy, r);
  if (!color || !path) return "";
  const fill = solid ? color.solid : color.fill;
  const stroke = solid ? color.edge : color.line;
  const strokeWidth = width ?? (r < 12 ? 1.5 : 1.9);
  const body = `<${path.tag} ${path.attrs} fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`;
  const shift = kind === "triangle" ? r * 0.28 : kind === "heart" ? -r * 0.1 : 0;
  return body + (value == null ? "" : text(cx, cy + shift + 1, value, { size: size || Math.round(r * 0.95), weight: 700 }));
}
const panel = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${PANEL}"/>`;
const answerBox = (x, y, w = 66, h = 40) => box(x, y, w, h, { radius: 7 });
// 「모양 = □」 줄(원문에서 그림 아래 답 칸)
function answerRows(kinds, x, y, gap = 54, r = 20, values = null) {
  return kinds.map((kind, index) => {
    const cy = y + index * gap + r;
    return `${shape(kind, x + r, cy, r, { solid: false })}${text(x + r * 2 + 18, cy + 1, "=", { size: 18, weight: 600 })}${answerBox(x + r * 2 + 36, cy - 20)}${values?.[kind] == null ? "" : text(x + r * 2 + 69, cy + 1, values[kind], { size: 19 })}`;
  }).join("");
}

// 1번: 전자저울(접시 · 몸통 · 숫자 창)
function scale(cx, plateY, tokens, display) {
  const grey = "#f1ece1";
  let body = `<rect x="${cx - 3}" y="${plateY + 4}" width="6" height="8" fill="${UT.soft}"/>`;
  body += `<ellipse cx="${cx}" cy="${plateY}" rx="40" ry="5.5" fill="${grey}" stroke="${UT.line}" stroke-width="1.4"/>`;
  body += `<rect x="${cx - 29}" y="${plateY + 31}" width="6" height="14" rx="2" fill="${UT.soft}" stroke="${UT.line}" stroke-width="1"/><rect x="${cx + 23}" y="${plateY + 31}" width="6" height="14" rx="2" fill="${UT.soft}" stroke="${UT.line}" stroke-width="1"/>`;
  body += `<rect x="${cx - 16}" y="${plateY + 66}" width="6" height="7" fill="${UT.line}"/><rect x="${cx + 10}" y="${plateY + 66}" width="6" height="7" fill="${UT.line}"/>`;
  body += `<rect x="${cx - 25}" y="${plateY + 12}" width="50" height="56" rx="7" fill="#fff" stroke="${UT.line}" stroke-width="1.8"/>`;
  const dy = plateY + 41;
  if (display.blank) {
    body += `${box(cx - 21, dy - 13, 26, 26, { radius: 4 })}${display.value == null ? "" : text(cx - 8, dy + 1, display.value, { size: 15 })}${text(cx + 13, dy + 2, "g", { size: 19, weight: 600 })}`;
  } else {
    body += text(cx, dy + 1, display.text, { size: 19, weight: 600 });
  }
  const s = 21; // 네모 한 변
  const r = 10.5; // 동그라미 반지름
  const at = (kind, x, bottom) => (kind === "square"
    ? shape("square", x, bottom - s / 2, s / 2, { solid: true, width: 1.4 })
    : shape("circle", x, bottom - r, r, { solid: true, width: 1.4 }));
  const floor = plateY - 4.5;
  if (tokens === "square-over-circles") body += at("circle", cx - 11, floor) + at("circle", cx + 11, floor) + at("square", cx, floor - r * 2 + 1.5);
  if (tokens === "circle-over-squares") body += at("square", cx - 11, floor) + at("square", cx + 11, floor) + at("circle", cx, floor - s + 0.5);
  if (tokens === "square-circle") body += at("square", cx - 12, floor) + at("circle", cx + 12, floor);
  if (tokens === "square") body += at("square", cx, floor);
  if (tokens === "circle") body += at("circle", cx, floor);
  return body;
}
function scalesMarkup(visual) {
  const v = visual.values || [];
  let body = `<rect x="82" y="3" width="216" height="150" rx="16" fill="none" stroke="${UT.orange}" stroke-width="1.8"/>`;
  body += scale(141, 66, "square-over-circles", { text: "17g" }) + scale(239, 66, "circle-over-squares", { text: "19g" });
  body += scale(62, 214, "square-circle", { blank: true, value: v[0] }) + scale(190, 214, "square", { blank: true, value: v[1] }) + scale(318, 214, "circle", { blank: true, value: v[2] });
  return svg(380, 292, "같은 모양은 같은 무게인 전자저울 다섯 개", body, 330);
}

// 2번·21번: 모양 덧셈 매트릭스(오른쪽과 아래가 줄의 합)
function shapeMatrixMarkup(visual) {
  const size = 46, x0 = 4, y0 = 4;
  const n = visual.grid.length;
  let body = "";
  visual.grid.forEach((row, r) => {
    row.forEach((kind, c) => {
      body += `<rect x="${x0 + c * size}" y="${y0 + r * size}" width="${size}" height="${size}" fill="#fff" stroke="${UT.box}" stroke-width="1.4"/>${shape(kind, x0 + c * size + size / 2, y0 + r * size + size / 2, 8, { width: 1.6 })}`;
    });
    body += `<rect x="${x0 + n * size}" y="${y0 + r * size}" width="${size}" height="${size}" fill="${SUM_FILL}" stroke="${UT.box}" stroke-width="1.4"/>${text(x0 + n * size + size / 2, y0 + r * size + size / 2 + 1, visual.rowSums[r], { size: 16, weight: 600 })}`;
  });
  visual.columnSums.forEach((value, c) => {
    const shown = value ?? visual.values?.[c];
    body += `<rect x="${x0 + c * size}" y="${y0 + n * size}" width="${size}" height="${size}" fill="${SUM_FILL}" stroke="${UT.box}" stroke-width="1.4"/>${shown == null ? "" : text(x0 + c * size + size / 2, y0 + n * size + size / 2 + 1, shown, { size: 16, weight: value == null ? 800 : 600, fill: value == null ? UT.red : UT.ink })}`;
  });
  return svg(x0 * 2 + (n + 1) * size, y0 * 2 + (n + 1) * size, "같은 모양은 같은 수인 덧셈 매트릭스", body, 250);
}

// 3번: 곱셈 매트릭스(빈 4×4, 오른쪽·아래에 곱)
function productMatrixMarkup(visual) {
  const size = 50, x0 = 4, y0 = 4, n = 4;
  let body = "";
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      const value = visual.values?.[r]?.[c];
      body += `<rect x="${x0 + c * size}" y="${y0 + r * size}" width="${size}" height="${size}" fill="#fff" stroke="${UT.box}" stroke-width="1.5"/>${value == null ? "" : text(x0 + c * size + size / 2, y0 + r * size + size / 2 + 1, value, { size: 18 })}`;
    }
    body += text(x0 + n * size + 26, y0 + r * size + size / 2 + 1, visual.rowProducts[r], { size: 16, weight: 600 });
  }
  visual.columnProducts.forEach((value, c) => { body += text(x0 + c * size + size / 2, y0 + n * size + 22, value, { size: 16, weight: 600 }); });
  return svg(x0 + n * size + 54, y0 + n * size + 36, "가로줄과 세로줄의 곱이 주어진 곱셈 매트릭스", body, 270);
}

// 4번: 도형 곱셈식 네 줄 + 「십자 = □」
function shapeEquationsMarkup(visual) {
  const r = 20, gap = 54, x0 = 30, y0 = 18;
  const step = 36;
  let body = panel(4, 4, 330, 236);
  visual.rows.forEach((tokens, index) => {
    const cy = y0 + index * gap + r;
    let x = x0;
    tokens.forEach((token) => {
      if (isShape(token)) { body += shape(token, x + r, cy, r, { value: visual.values?.[token] }); x += r * 2 + 4; }
      else { body += text(x + step / 2 - 4, cy + 1, token, { size: 18, weight: 600 }); x += step - 8; }
    });
  });
  body += answerRows([visual.ask], 120, 258, 54, r, visual.values);
  return svg(338, 304, "1에서 9까지의 서로 다른 수를 나타내는 도형들의 곱셈식", body, 320);
}

// 5번: 꽉 찬 모양 덧셈식 세 줄 + 답 칸
function tokenSumsMarkup(visual) {
  const r = 17, gap = 62, x0 = 26, y0 = 20;
  let body = panel(4, 4, 214, 196);
  visual.rows.forEach(([a, b, sum], index) => {
    const cy = y0 + index * gap + r;
    body += shape(a, x0 + r, cy, a === "diamond" ? r + 1 : r, { solid: true, width: 1.4 });
    body += text(x0 + 52, cy + 1, "+", { size: 17, weight: 600 });
    body += shape(b, x0 + 86, cy, b === "diamond" ? r + 1 : r, { solid: true, width: 1.4 });
    body += text(x0 + 124, cy + 1, "=", { size: 17, weight: 600 }) + text(x0 + 158, cy + 1, sum, { size: 18, weight: 600 });
  });
  visual.ask.forEach((kind, index) => {
    const cy = 238 + index * 62;
    body += shape(kind, 44, cy, kind === "diamond" ? r + 1 : r, { solid: true, width: 1.4 }) + text(80, cy + 1, "=", { size: 17, weight: 600 }) + answerBox(98, cy - 20) + (visual.values?.[kind] == null ? "" : text(131, cy + 1, visual.values[kind], { size: 19 }));
  });
  return svg(222, 238 + (visual.ask.length - 1) * 62 + 26, "같은 모양은 같은 수인 덧셈식 세 개", body, 220);
}

// 6~10번·22번: 세로 덧셈(복면산). 칸: 숫자·글자 / 모양 / box(빈 네모)
function columnAdditionMarkup(visual) {
  const cell = 52, r = 20, cols = visual.columns;
  const left = 50, top = 18;
  const rows = visual.rows;
  const width = left + cols * cell + 18;
  const lineY = top + rows.length * cell + 4;
  const resultY = lineY + 6;
  const panelH = resultY + cell + 8;
  let body = panel(4, 4, width - 8, panelH - 4);
  const put = (token, c, y) => {
    const cx = left + c * cell + cell / 2;
    const cy = y + cell / 2;
    if (!token) return "";
    if (token === "box") return `${box(cx - r - 1, cy - r - 1, r * 2 + 2, r * 2 + 2, { radius: 2 })}`;
    if (isShape(token)) return shape(token, cx, cy, r, { value: visual.values?.[token] });
    return text(cx, cy + 1, token, { size: 19, weight: 600 });
  };
  rows.forEach((row, index) => { row.forEach((token, c) => { body += put(token, c, top + index * cell); }); });
  body += text(left - 22, top + (rows.length - 1) * cell + cell / 2 + 1, "+", { size: 19, weight: 600 });
  body += line(20, lineY, width - 18, lineY, { stroke: UT.ink, width: 1.6 });
  visual.result.forEach((token, c) => { body += put(token, c, resultY); });
  let height = panelH + 6;
  if (visual.ask?.length) {
    body += answerRows(visual.ask, Math.max(20, width / 2 - 70), height + 14, 54, r, visual.values);
    height += 14 + visual.ask.length * 54;
  }
  return svg(width, height, visual.label || "같은 모양은 같은 숫자인 덧셈식", body, Math.min(width, 300));
}

// 12번: 「동생 : □살 · 형 : □살」
function agesMarkup(visual) {
  const v = visual.values || [];
  const slot = (x, label, value) => `${text(x, 26, `${label} :`, { size: 16, anchor: "end", weight: 600 })}${answerBox(x + 12, 6, 70, 40)}${value == null ? "" : text(x + 38, 27, value, { size: 18 })}${text(x + 70, 27, "살", { size: 15, weight: 600 })}`;
  return svg(300, 52, "동생과 형의 나이를 쓰는 칸", slot(56, visual.labels[0], v[0]) + slot(210, visual.labels[1], v[1]), 300);
}

// 표(13·17·24번): 첫 줄 머리 칸은 연한 노랑
function tableMarkup(visual) {
  const widths = visual.widths;
  const heights = visual.heights;
  const width = widths.reduce((a, b) => a + b, 0) + 4;
  const height = heights.reduce((a, b) => a + b, 0) + 4;
  let body = "";
  let y = 2;
  visual.cells.forEach((row, r) => {
    let x = 2;
    row.forEach((value, c) => {
      const fill = r === 0 ? SUM_FILL : "#fff";
      body += `<rect x="${x}" y="${y}" width="${widths[c]}" height="${heights[r]}" fill="${fill}" stroke="${UT.line}" stroke-width="1.3"/>`;
      if (value != null && value !== "") body += text(x + widths[c] / 2, y + heights[r] / 2 + 1, value, { size: 16, weight: r === 0 || c === 0 ? 700 : 600 });
      x += widths[c];
    });
    y += heights[r];
  });
  return svg(width, height, visual.label || "표", body, visual.maxWidth || width);
}

const BLANK = `<div aria-hidden="true" style="width:100%;min-height:1px"></div>`;

export function figure(visual) {
  if (!visual) return BLANK;
  switch (visual.type) {
    case "blank": return BLANK;
    case "scales": return scalesMarkup(visual);
    case "shape-matrix": return shapeMatrixMarkup(visual);
    case "product-matrix": return productMatrixMarkup(visual);
    case "shape-equations": return shapeEquationsMarkup(visual);
    case "token-sums": return tokenSumsMarkup(visual);
    case "column-addition": return columnAdditionMarkup(visual);
    case "ages": return agesMarkup(visual);
    case "table": return tableMarkup(visual);
    case "conditions": return conditionsBox(visual.clues);
    case "conditions-table": return `<div style="display:grid;gap:12px;width:100%;justify-items:center">${conditionsBox(visual.clues)}${tableMarkup(visual.table)}</div>`;
    default: return BLANK;
  }
}

const SAME_DIGIT = "다음 계산식에서 같은 모양은 같은 숫자를 다른 모양은 다른 숫자를 나타냅니다. 복면산의 각 모양에 알맞은 숫자를";
const blank = { type: "blank" };
const ORIGINALS = {
  1: () => ({
    prompt: "다음 저울에서 같은 모양은 같은 무게, 다른 모양은 다른 무게를 나타냅니다. 오른쪽 저울의 무게를 각각 구하시오.",
    visual: { type: "scales" },
    responseKind: "fill"
  }),
  2: () => ({
    prompt: "같은 모양은 같은 수, 다른 모양은 다른 수를 나타낼 때, 다음 덧셈 매트릭스의 색칠된 빈 칸에 알맞은 수를 구하시오.",
    visual: { type: "shape-matrix", grid: [["diamond", "square", "square", "square"], ["triangle", "square", "diamond", "circle"], ["circle", "circle", "circle", "circle"], ["circle", "diamond", "circle", "diamond"]], rowSums: [31, 23, 20, 24], columnSums: [null, 28, 25, 25] },
    responseKind: "fill"
  }),
  3: () => ({
    prompt: "다음은 2에서 9까지의 수를 한 번씩 넣어 만든 곱셈 매트릭스입니다. 각 줄에 수를 두 개씩 넣어 가로줄에 있는 두 수의 곱은 오른쪽, 세로줄에 있는 두 수의 곱은 아래에 있는 수가 되도록 매트릭스를 완성하시오.",
    visual: { type: "product-matrix", rowProducts: [18, 21, 20, 48], columnProducts: [24, 16, 27, 35] },
    responseKind: "fill"
  }),
  4: () => ({
    prompt: "다음 각 도형은 1에서 9까지의 수 중에서 서로 다른 수를 나타냅니다. 각 도형이 나타내는 수를 빈 칸에 써 넣고, ✚가 나타내는 수를 구하시오.",
    visual: { type: "shape-equations", rows: [["diamond", "×", "diamond", "=", "square"], ["square", "×", "square", "=", "diamond", "×", "circle"], ["pentagon", "×", "pentagon", "=", "triangle"], ["cross", "×", "cross", "=", "square", "×", "triangle"]], ask: "cross" },
    responseKind: "fill"
  }),
  5: () => ({
    prompt: "다음 식에서 같은 모양은 같은 수, 다른 모양은 다른 수를 나타냅니다. 각 도형이 나타내는 수를 구하시오.",
    visual: { type: "token-sums", rows: [["circle", "square", 14], ["square", "diamond", 15], ["diamond", "circle", 9]], ask: ["square", "diamond", "circle"] },
    responseKind: "fill"
  }),
  6: () => ({
    prompt: `${SAME_DIGIT} 써넣고 각 도형이 나타내는 숫자를 구하시오.`,
    visual: { type: "column-addition", columns: 3, rows: [["circle", "square", "7"], ["4", "diamond", "diamond"]], result: ["6", "circle", "5"], ask: ["circle", "square", "diamond"] },
    responseKind: "fill"
  }),
  7: () => ({
    prompt: "다음 덧셈식의 □ 안에 들어갈 모든 숫자들의 합을 구하시오.",
    visual: { type: "column-addition", columns: 3, rows: [["", "", "box"], ["", "box", "box"], ["", "box", "box"]], result: ["2", "0", "5"], label: "빈 네모가 있는 세로 덧셈식" }
  }),
  8: () => ({
    prompt: `${SAME_DIGIT} 써넣으시오.`,
    visual: { type: "column-addition", columns: 4, rows: [["diamond", "cross", "circle", "square"], ["", "", "circle", "square"], ["", "", "circle", "square"]], result: ["2", "0", "4", "4"] },
    responseKind: "fill"
  }),
  9: () => ({
    prompt: `${SAME_DIGIT} 써넣고, ♡가 나타내는 숫자를 구하시오.`,
    visual: { type: "column-addition", columns: 4, rows: [["", "circle", "heart", "diamond"], ["", "", "diamond", "star"]], result: ["star", "square", "square", "circle"], ask: ["heart"] },
    responseKind: "fill"
  }),
  10: () => ({
    prompt: `${SAME_DIGIT} 써넣고 각 도형이 나타내는 숫자를 구하시오.`,
    visual: { type: "column-addition", columns: 3, rows: [["1", "square", "circle"], ["", "circle", "4"]], result: ["diamond", "diamond", "diamond"], ask: ["circle", "square", "diamond"] },
    responseKind: "fill"
  }),
  11: () => ({
    prompt: "시현이는 구슬 20개를, 수인이는 구슬 6개를 가지고 있습니다. 시현이가 구슬 몇 개를 수인이에게 주었더니 두 사람의 구슬의 개수가 같아졌습니다. 시현이는 수인이에게 구슬 몇 개를 주었습니까?",
    visual: blank
  }),
  12: () => ({
    prompt: "형과 동생의 나이의 합은 30살이고, 형은 동생보다 4살이 더 많습니다. 두 사람의 나이는 각각 몇 살입니까?",
    visual: { type: "ages", labels: ["동생", "형"] },
    responseKind: "fill"
  }),
  13: () => ({
    prompt: "다음 표는 A, B, C, D, E 5명이 가진 카드의 개수입니다. B가 E보다 4장 더 많았을 때, E가 가진 카드의 개수를 구하시오.",
    visual: { type: "table", label: "다섯 명이 가진 카드의 개수 표", widths: [64, 64, 64, 64, 64, 64], heights: [52, 52], cells: [["A", "B", "C", "D", "E", "합계"], ["14", "", "8", "11", "", "55"]], maxWidth: 400 }
  }),
  14: () => ({
    prompt: "어떤 모임의 남학생 수는 여학생 수보다 27명 더 많은데 남학생 수는 여학생 수의 4배입니다. 이 모임의 남학생과 여학생은 각각 몇 명입니까?",
    visual: blank
  }),
  15: () => ({
    prompt: "운동선수가 모두 48명 있는데 그 중 남자는 여자의 3배보다 4명 많습니다. 남, 여 선수는 각각 몇 명씩 있습니까?",
    visual: blank
  }),
  16: () => ({
    prompt: "민주가 기현이에게 구슬 6개를 주고, 유정이에게 구슬 7개를 받았습니다. 그리고 윤호에게 구슬 5개를 주었더니, 구슬이 모두 19개가 되었습니다. 처음 민주가 가지고 있던 구슬의 개수를 구하시오.",
    visual: blank
  }),
  17: () => ({
    prompt: "기현이가 주희에게 주희가 가지고 있던 만큼의 사탕을 주었더니 두 사람은 각각 20개의 사탕을 가지게 되었습니다. 기현이가 처음에 가지고 있던 사탕의 개수는 몇 개입니까?",
    visual: { type: "table", label: "기현이와 주희의 사탕 개수를 정리하는 표", widths: [146, 120, 120], heights: [46, 68, 68], cells: [["", "기현", "주희"], ["기현 → 주희", "", ""], ["나중", "20개", "20개"]], maxWidth: 390 }
  }),
  18: () => ({
    prompt: "정훈이는 가지고 있던 리본의 1/4을 미술시간에 사용하였더니 남은 리본의 길이가 18cm였습니다. 정훈이가 처음에 가지고 있던 리본의 길이는 몇 cm입니까?",
    visual: blank,
    mathPrompt: true
  }),
  19: () => ({
    prompt: "정우는 가지고 있던 사탕의 2/7를 동생에게 주었더니 15개가 남았습니다. 정우가 처음에 가지고 있던 사탕은 몇 개입니까?",
    visual: blank,
    mathPrompt: true
  }),
  20: () => ({
    prompt: "민서네 학교 반 아이들 중에서 여학생은 전체의 2/9입니다. 남학생이 여학생보다 25명이 많다면, 민서네 반 아이들 중에서 남학생은 모두 몇 명입니까?",
    visual: blank,
    mathPrompt: true
  }),
  21: () => ({
    prompt: "다음 그림에서 같은 모양은 같은 수를 다른 모양은 다른 수를 나타내고, 오른쪽과 아래에 쓰여진 수는 각 줄의 합을 나타냅니다. 다음 빈 칸에 들어갈 수를 구하시오.",
    visual: { type: "shape-matrix", grid: [["square", "triangle", "circle", "star"], ["circle", "circle", "star", "circle"], ["star", "star", "star", "circle"], ["triangle", "triangle", "triangle", "triangle"]], rowSums: [21, 25, 27, 12], columnSums: [21, null, 23, null] },
    responseKind: "fill"
  }),
  22: () => ({
    prompt: "다음은 피라미드 복면산에서 A, B, C, D는 서로 다른 숫자를 나타냅니다. 네 자리 수 ABCD를 구하시오.",
    visual: { type: "column-addition", columns: 4, rows: [["", "", "", "A"], ["", "", "A", "B"], ["", "A", "B", "C"], ["A", "B", "C", "D"]], result: ["5", "2", "5", "2"], label: "A, B, C, D로 쓴 피라미드 덧셈식" }
  }),
  23: () => ({
    prompt: "A, B, C 세 사람이 가진 구슬의 개수는 다음과 같습니다. B가 가진 구슬의 개수를 구하시오.",
    visual: { type: "conditions", clues: ["A가 B에게 구슬 1개를 주면 두 사람이 가진 구슬의 개수는 같아집니다.", "B가 C에게 구슬 2개를 주면 두 사람이 가진 구슬의 개수는 같아집니다.", "A와 C가 가지고 있는 구슬의 합은 모두 20개입니다."] }
  }),
  24: () => ({
    prompt: "구슬 24개를 3개의 주머니에 나누어 넣은 다음 가에 있는 구슬 중 1개를 나로 옮겼더니 다음과 같아졌습니다. 처음에 가, 나, 다에 있는 구슬의 수를 구하시오.",
    visual: { type: "conditions-table", clues: ["나에 들어 있는 구슬 개수가 가와 다에 들어 있는 구슬 개수의 합과 같습니다.", "가와 다에 들어 있는 구슬 개수가 같습니다."], table: { type: "table", label: "가, 나, 다 주머니의 구슬 개수를 정리하는 표", widths: [110, 90, 90, 90], heights: [48, 52, 52], cells: [["", "가", "나", "다"], ["가 → 나", "", "", ""], ["나중", "", "", ""]], maxWidth: 384 } }
  }),
  25: () => ({
    prompt: "태윤이네 학교 2학년은 남학생이 전체의 5/9이고, 여학생은 남학생보다 6명이 적습니다. 이 중에서 남학생의 1/3과 여학생의 1/4이 동생이 있다면, 동생이 있는 학생은 모두 몇 명입니까?",
    visual: blank,
    mathPrompt: true
  })
};

export const numbers = Object.freeze(Object.keys(ORIGINALS).map(Number));
export function get(number) {
  const make = ORIGINALS[Number(number)];
  return make ? { number: Number(number), ...make() } : null;
}
