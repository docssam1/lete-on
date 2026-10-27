// 「유형별 예제」 화면. 예제 데이터(golden-bell-type-examples.js)를 그림(SVG)과 단계 목록으로 그린다.
// 한 단계씩 연다: 0단계 = 문제만, 1~N단계 = 풀이가 하나씩, 마지막 = 답. 답은 마지막 단계 전에는 화면에 없다.
// 색은 골든벨 색표(쌓기나무·모양·숫자판·저울), 안내 단계 색은 주어진 것 파랑 · 하는 일 금색 · 확인 진초록.

import { frac } from "./math-markup.js?v=20261027p";
import { book04Markup, obliqueCubes, digitGlyph, opIcon, sevenSegNumber } from "./book04-renderers.js?v=20261028w";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const TONE = { given: "#2f6fe0", doing: "#d39b20", check: "#16734b" };
const CUBE = { top: "#ffeaa6", front: "#ffd45c", side: "#f0b23a", line: "#a8741a" };
const SHAPE = {
  circle: { fill: "#ffe1dc", line: "#e8503a" }, triangle: { fill: "#dcf5e5", line: "#2f9e5f" }, square: { fill: "#dde9ff", line: "#2f6fe0" },
  diamond: { fill: "#ece0fb", line: "#8e5bd8" }, star: { fill: "#f0b23a", line: "#c98a12" }
};
const SHAPE_NAME = { circle: "동그라미", triangle: "세모", square: "네모", diamond: "마름모", star: "별" };
const PASTEL = ["#ffe1dc", "#dcf5e5", "#dde9ff", "#fff3c4"];
const svg = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const text = (x, y, value, { size = 16, weight = 800, fill = "#222", anchor = "middle" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="central">${esc(value)}</text>`;

// ───── 쌓기나무 ─────
function cellGrid(cells, fill, unit = 22) {
  const rows = cells.length, cols = Math.max(...cells.map((r) => r.length));
  return svg(cols * unit + 2, rows * unit + 2, cells.flatMap((row, r) => row.map((on, c) => (on ? `<rect x="${c * unit + 1}" y="${r * unit + 1}" width="${unit}" height="${unit}" fill="${fill}" stroke="${CUBE.line}" stroke-width="1.5"/>` : ""))).join(""), "");
}
const profile = (heights) => { const max = Math.max(1, ...heights); return Array.from({ length: max }, (_, row) => heights.map((h) => (max - row <= h ? 1 : 0))); };
function cubeViewsFigure(f) {
  const parts = [["위", cellGrid(f.views.top, CUBE.top)], ["앞", cellGrid(profile(f.views.front), CUBE.front)], ["오른쪽 옆", cellGrid(profile(f.views.side), CUBE.side)]];
  return `<div class="tx-views" role="img" aria-label="쌓기나무를 위·앞·오른쪽 옆에서 본 모양">${parts.map(([name, body]) => `<figure><div>${body}</div><figcaption>${name}</figcaption></figure>`).join("")}</div>`;
}
// 위에서 본 칸에 층수를 쓰는 판. 세로줄 아래 「앞 ○층」, 가로줄 오른쪽 「옆 ○층」.
function cubeMapFigure(f) {
  const { views, heights, mark = {}, tone = "given" } = f;
  const rows = views.top.length, cols = views.top[0].length, U = 46, chipW = 66, chipH = 30, pad = 4;
  const color = TONE[tone];
  const markCells = new Set((mark.cells || []).map(([r, c]) => `${r},${c}`));
  const markCols = new Set(mark.cols || []), markRows = new Set(mark.rows || []);
  let body = "";
  for (const c of markCols) body += `<rect x="${pad + c * U}" y="${pad}" width="${U}" height="${rows * U}" fill="${color}" opacity=".14"/>`;
  for (const r of markRows) body += `<rect x="${pad}" y="${pad + r * U}" width="${cols * U}" height="${U}" fill="${color}" opacity=".14"/>`;
  views.top.forEach((row, r) => row.forEach((on, c) => {
    const x = pad + c * U, y = pad + r * U, key = `${r},${c}`;
    if (!on) { body += `<rect x="${x + 3}" y="${y + 3}" width="${U - 6}" height="${U - 6}" rx="6" fill="#f2f2f2" stroke="#d6d6d6" stroke-dasharray="4 3"/>`; return; }
    const marked = markCells.has(key);
    body += `<rect x="${x + 3}" y="${y + 3}" width="${U - 6}" height="${U - 6}" rx="6" fill="${CUBE.top}" stroke="${marked ? color : CUBE.line}" stroke-width="${marked ? 4 : 1.6}"/>`;
    const h = heights?.[r]?.[c];
    if (h !== null && h !== undefined && h > 0) body += text(x + U / 2, y + U / 2 + 1, h, { size: 21, weight: 900 });
  }));
  views.front.forEach((h, c) => {
    const x = pad + c * U + 3, y = pad + rows * U + 4, on = markCols.has(c);
    body += `<rect x="${x}" y="${y}" width="${U - 6}" height="${chipH - 6}" rx="8" fill="${on ? color : "#fff"}" stroke="${on ? color : CUBE.front}" stroke-width="2"/>` + text(x + (U - 6) / 2, y + (chipH - 6) / 2, `앞 ${h}층`, { size: 11.5, fill: on ? "#fff" : "#222" });
  });
  views.top.forEach((_, r) => {
    const h = views.side[rows - 1 - r], x = pad + cols * U + 6, y = pad + r * U + 9, on = markRows.has(r);
    body += `<rect x="${x}" y="${y}" width="${chipW - 10}" height="${U - 18}" rx="8" fill="${on ? color : "#fff"}" stroke="${on ? color : CUBE.side}" stroke-width="2"/>` + text(x + (chipW - 10) / 2, y + (U - 18) / 2, `옆 ${h}층`, { size: 11.5, fill: on ? "#fff" : "#222" });
  });
  const label = `위에서 본 칸에 쓴 층수, 뒷줄부터: ${heights.map((row, r) => row.map((h, c) => (views.top[r][c] ? h : "빈칸")).join(" ")).join(", ")}`;
  return `<div class="tx-map"><p class="tx-map-key">위에서 본 칸 · 위쪽이 뒤, 아래쪽이 앞</p>${svg(pad * 2 + cols * U + chipW, pad * 2 + rows * U + chipH, body, label)}</div>`;
}

// ───── 마방진 ─────
function lineCells(n, id) {
  if (id[0] === "r") { const r = Number(id.slice(1)); return Array.from({ length: n }, (_, c) => r * n + c); }
  if (id[0] === "c") { const c = Number(id.slice(1)); return Array.from({ length: n }, (_, r) => r * n + c); }
  return Array.from({ length: n }, (_, i) => (id === "d0" ? i * n + i : i * n + (n - 1 - i)));
}
function magicFigure(f) {
  const { n, cells, lines = [], tone = "given" } = f;
  const U = n === 3 ? 58 : 48, pad = 6, size = n * U + pad * 2, color = TONE[tone];
  let body = `<rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="12" fill="#fff" stroke="#8e5bd8" stroke-width="3"/>`;
  cells.forEach((cell, i) => {
    const x = pad + (i % n) * U, y = pad + Math.floor(i / n) * U;
    const st = cell.state;
    const fill = st === "found" ? "#e3f5ea" : st === "target" ? "#ece0fb" : st === "shared" ? "#fff3c4" : st === "blank" ? "#fff" : PASTEL[(Math.floor(i / n) + i % n) % 4];
    const stroke = st === "found" ? TONE.check : st === "focus" ? TONE.doing : st === "target" ? "#8e5bd8" : st === "shared" ? "#f39a1e" : "#d6d6d6";
    body += `<rect x="${x + 3}" y="${y + 3}" width="${U - 6}" height="${U - 6}" rx="9" fill="${fill}" stroke="${stroke}" stroke-width="${["found", "focus", "target", "shared"].includes(st) ? 3.5 : 1.5}" ${st === "blank" ? 'stroke-dasharray="5 4"' : ""}/>`;
    const value = cell.v !== null && cell.v !== undefined ? cell.v : cell.label;
    if (value !== "" && value !== undefined) body += text(x + U / 2, y + U / 2 + 1, value, { size: n === 3 ? 22 : 18, weight: 900, fill: st === "found" ? TONE.check : st === "target" ? "#5b2fa8" : "#222" });
  });
  // 칠한 줄: 칸 위로 반투명 띠(대각선도 같은 굵기).
  for (const id of lines) {
    const cs = lineCells(n, id), a = cs[0], b = cs.at(-1);
    const ax = pad + (a % n) * U + U / 2, ay = pad + Math.floor(a / n) * U + U / 2, bx = pad + (b % n) * U + U / 2, by = pad + Math.floor(b / n) * U + U / 2;
    body += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${color}" stroke-width="${U * 0.42}" stroke-linecap="round" opacity=".22"/>`;
  }
  const label = `${n}칸 마방진: ${cells.map((c) => (c.v ?? c.label) || "빈칸").join(", ")}`;
  return `<div class="tx-magic">${svg(size, size, body, label)}</div>`;
}

// ───── 시계 ─────
const clockPoint = (hours, r, cx = 100, cy = 100) => [cx + Math.sin(hours * Math.PI / 6) * r, cy - Math.cos(hours * Math.PI / 6) * r];
function clockFigure(f) {
  const { start, quarters = 0, ghost = false, path = null, end = false } = f;
  const land = ((start - 1 + quarters * 3) % 12 + 12) % 12 + 1;
  let body = '<circle cx="100" cy="100" r="92" fill="#ffd45c"/><circle cx="100" cy="100" r="84" fill="#fffaf0" stroke="#e1c27a" stroke-width="2"/>';
  for (let i = 0; i < 60; i++) { const [x0, y0] = clockPoint(i / 5, 80), [x1, y1] = clockPoint(i / 5, i % 5 ? 76 : 72); body += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="#333" stroke-width="${i % 5 ? 1 : 2.4}"/>`; }
  const onPath = new Set(path || []);
  for (let v = 1; v <= 12; v++) {
    const [x, y] = clockPoint(v, 60);
    if (onPath.has(v)) body += `<circle cx="${x}" cy="${y}" r="13" fill="${end && v === land ? "#e3f5ea" : "#fff3c4"}" stroke="${end && v === land ? TONE.check : "#f0a500"}" stroke-width="2.5"/>`;
    body += text(x, y + 1, v, { size: 16, weight: 900 });
  }
  if (quarters && (ghost || path)) {
    const dir = Math.sign(quarters), span = Math.abs(quarters) * 3, r = 36;
    const [sx, sy] = clockPoint(start, r), [ex, ey] = clockPoint(start + dir * span, r);
    const color = dir > 0 ? "#2f6fe0" : "#f39a1e";
    const large = span > 6 ? 1 : 0, sweep = dir > 0 ? 1 : 0;
    body += span >= 12 ? `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="7 5"/>` : `<path d="M${sx} ${sy} A${r} ${r} 0 ${large} ${sweep} ${ex} ${ey}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
    const [ax, ay] = clockPoint(start + dir * span, r), back = start + dir * (span - 0.6);
    const [bx, by] = clockPoint(back, r + 7), [cx2, cy2] = clockPoint(back, r - 7);
    body += `<path d="M${bx} ${by} L${ax} ${ay} L${cx2} ${cy2}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const hand = (h, len, color, w) => { const [x, y] = clockPoint(h, len); return `<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`; };
  body += hand(start, 50, end ? "#b9c3cb" : "#e8503a", end ? 5 : 7);
  if (end) body += hand(land, 54, "#e8503a", 7);
  body += '<circle cx="100" cy="100" r="7" fill="#f2c14e" stroke="#a8741a"/>';
  return `<div class="tx-clock">${svg(200, 200, body, end ? `${start}에서 출발해 ${land}을 가리키는 시계` : `${start}을 가리키는 시계`)}</div>`;
}

// ───── 양팔저울 ─────
function token(t, x, y, s = 22) {
  const c = SHAPE[t];
  if (!c) { // 과일 이름 카드(숫자카드 색)
    const w = Math.max(40, String(t).length * 16 + 14);
    return `<rect x="${x - w / 2}" y="${y - 14}" width="${w}" height="28" rx="8" fill="#fff3c4" stroke="#f0a500" stroke-width="2"/>${text(x, y + 1, t, { size: 14, weight: 900 })}`;
  }
  const h = s / 2;
  if (t === "circle") return `<circle cx="${x}" cy="${y}" r="${h}" fill="${c.fill}" stroke="${c.line}" stroke-width="2.5"/>`;
  if (t === "square") return `<rect x="${x - h}" y="${y - h}" width="${s}" height="${s}" fill="${c.fill}" stroke="${c.line}" stroke-width="2.5"/>`;
  if (t === "triangle") return `<path d="M${x} ${y - h} L${x + h} ${y + h} L${x - h} ${y + h} Z" fill="${c.fill}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (t === "diamond") return `<path d="M${x} ${y - h} L${x + h} ${y} L${x} ${y + h} L${x - h} ${y} Z" fill="${c.fill}" stroke="${c.line}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const pts = Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? h * 0.45 : h; return `${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`; }).join(" ");
  return `<polygon points="${pts}" fill="${c.fill}" stroke="${c.line}" stroke-width="2" stroke-linejoin="round"/>`;
}
function scaleSvg(s, k, f) {
  // 접시마다 셋까지는 한 줄 큰 모양, 넷부터는 작게, 여섯부터는 두 줄. 셋부터는 저울 폭을 접시에 맞춰 넓힌다(접시 밖으로 나가지 않게).
  const layout = (n) => { const perRow = n > 5 ? Math.ceil(n / 2) : n, gap = n > 3 ? 20 : 24, sz = n > 3 ? 18 : 22; return { perRow, gap, sz, half: ((perRow - 1) * gap) / 2 + sz / 2 + 4 }; };
  const maxN = Math.max(s.left.length, s.right.length), big = layout(maxN);
  const arm = maxN <= 2 ? 78 : Math.max(78, big.half + 40), C = maxN <= 2 ? 110 : arm + Math.max(30, big.half) + 8, W = C * 2;
  const tilt = s.heavy === "left" ? -9 : s.heavy === "right" ? 9 : 0, focus = (f.focus || []).includes(k);
  const pan = (list, cx, cy) => {
    const n = list.length, { perRow, gap, sz } = layout(n);
    // 「x:모양」은 양쪽에서 함께 덜어 낸 것: 흐리게 그리고 빨간 ×
    return list.map((t, i) => {
      const row = Math.floor(i / perRow), inRow = Math.min(perRow, n - row * perRow), col = i - row * perRow;
      const off = t.startsWith("x:"), tt = off ? t.slice(2) : t, x = cx + (col - (inRow - 1) / 2) * gap, y = cy - (SHAPE[tt] ? 12 : 15) - row * (sz + 2), h = sz / 2 + 2;
      return off ? `<g opacity="0.3">${token(tt, x, y, sz)}</g><path d="M${x - h} ${y - h} L${x + h} ${y + h} M${x + h} ${y - h} L${x - h} ${y + h}" stroke="#e8503a" stroke-width="2.5" stroke-linecap="round"/>` : token(tt, x, y, sz);
    }).join("");
  };
  const rad = tilt * Math.PI / 180, plate = Math.max(30, big.half);
  const lx = C - arm * Math.cos(rad), ly = 46 - arm * Math.sin(rad), rx = C + arm * Math.cos(rad), ry = 46 + arm * Math.sin(rad);
  const weights = f.weights || {};
  const tag = (list, cx, cy) => { const known = [...new Set(list)].filter((t) => weights[t] !== undefined); return known.length ? text(cx, cy, known.map((t) => `${SHAPE_NAME[t] || t} ${weights[t]}g`).join(" · "), { size: 11, weight: 800, fill: "#16734b" }) : ""; };
  let body = `<rect x="2" y="2" width="${W - 4}" height="146" rx="14" fill="#fff" stroke="${focus ? TONE.doing : "#ece4d6"}" stroke-width="${focus ? 4 : 2}"/>`;
  body += text(18, 18, `${k + 1}`, { size: 12, weight: 900, fill: "#566274" });
  body += `<path d="M${C} 52 L${C - 14} 120 H${C + 14} Z" fill="#f39a1e"/><rect x="${C - 28}" y="118" width="56" height="10" rx="4" fill="#ffd45c" stroke="#d9a400"/>`;
  body += `<line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="#f39a1e" stroke-width="7" stroke-linecap="round"/>`;
  for (const [x, y] of [[lx, ly], [rx, ry]]) body += `<path d="M${x} ${y} L${x - 22} ${y + 34} M${x} ${y} L${x + 22} ${y + 34}" stroke="#b38a52" stroke-width="1.5"/><path d="M${x - plate} ${y + 34} H${x + plate} Q${x + plate - 4} ${y + 44} ${x} ${y + 44} Q${x - plate + 4} ${y + 44} ${x - plate} ${y + 34} Z" fill="#ffeaa6" stroke="#d9a400" stroke-width="1.5"/>`;
  body += pan(s.left, lx, ly + 34) + pan(s.right, rx, ry + 34);
  body += `<circle cx="${C}" cy="46" r="6" fill="#f2c14e" stroke="#a8741a"/>`;
  body += tag(s.left, lx, 140) + tag(s.right, rx, 140);
  return svg(W, 150, body, `${k + 1}번 저울`);
}
function balanceFigure(f) {
  const chain = f.chain ? `<p class="tx-chain" aria-label="무거운 순서">${f.chain.map((t) => `<span class="${(f.mark || []).includes(t) ? "on" : ""}">${esc(SHAPE_NAME[t] || t)}</span>`).join("<b>&gt;</b>")}</p>` : "";
  return `<div class="tx-balance"><div class="tx-scales">${f.scales.map((s, k) => scaleSvg(s, k, f)).join("")}</div>${chain}</div>`;
}

// ───── 묶음으로 식 바꾸기(2·3·4·5·6의 배수) ─────
// rows: 식 한 줄씩 [{ items: [「6」 같은 수 카드 { v, sub? } 또는 「+」 같은 기호 문자열], tone }]. sub는 카드 밑의 「2×3」(묶음으로 바꾼 꼴).
function bundleFigure(f) {
  const card = (it) => `<span class="${it.blank ? "blank" : ""}${it.on ? " on" : ""}"><i>${esc(it.v)}</i>${it.sub ? `<small>${esc(it.sub)}</small>` : ""}</span>`;
  // 「4×」와 그 뒤 칸은 한 덩어리로 둔다(좁은 화면에서 줄이 바뀌어 □만 아래로 떨어지지 않게)
  const row = (r) => `<div class="tx-bundle-row" style="--tone:${TONE[r.tone || "given"]}">${r.items.map((it, i) => {
    if (typeof it !== "string") return typeof r.items[i - 1] === "string" && r.items[i - 1].endsWith("×") ? "" : card(it);
    const next = r.items[i + 1];
    return it.endsWith("×") && next && typeof next !== "string" ? `<em class="tx-bundle-glue"><b>${esc(it)}</b>${card(next)}</em>` : `<b>${esc(it)}</b>`;
  }).join("")}</div>`;
  const label = f.rows.map((r) => r.items.map((it) => (typeof it === "string" ? it : `${it.v}${it.sub ? `(${it.sub})` : ""}`)).join(" ")).join(", ");
  return `<div class="tx-bundle" role="img" aria-label="${esc(label)}">${f.rows.map(row).join("")}</div>`;
}

// ───── 연속수: 수 줄(길면 앞 셋 … 뒤 셋) ─────
// mode: plain · count(처음 수를 뺀 칸은 흐리게, skipFirst면 처음 수 칸도 흐리게) · pairs(양 끝부터 짝 고리) ·
//       middle(가운데 칸) · middle-pairs(가운데에서 같은 만큼 떨어진 짝) · order(짝수·홀수 줄과 번째)
function consecFigure(f) {
  const color = TONE[f.tone || "given"];
  if (f.mode === "order") {
    const ks = [1, 2, 3, 4, 5], val = (k) => (f.odd ? 2 * k - 1 : 2 * k);
    const cols = [...ks.map((k) => ({ k, v: val(k) })), { k: "…", v: "…" }, ...(f.k ? [{ k: f.k, v: f.v, on: true }] : [])];
    const W = 52, body = cols.map((c, i) => {
      const x = 8 + i * W, on = c.on;
      return `<rect x="${x}" y="8" width="${W - 8}" height="36" rx="8" fill="${on ? "#e3f5ea" : "#fff3c4"}" stroke="${on ? TONE.check : "#f0a500"}" stroke-width="${on ? 3 : 2}"/>${text(x + (W - 8) / 2, 27, c.v, { size: 17, weight: 900 })}${text(x + (W - 8) / 2, 60, c.k === "…" ? "" : `${c.k}번째`, { size: 12, weight: 800, fill: on ? TONE.check : "#566274" })}`;
    }).join("");
    return `<div class="tx-consec">${svg(16 + cols.length * W, 74, body, `${f.odd ? "홀수" : "짝수"}를 차례로 늘어놓은 줄과 번째`)}</div>`;
  }
  const n = f.to - f.from + 1, long = n > 8;
  const cells = long ? [f.from, f.from + 1, f.from + 2, null, f.to - 2, f.to - 1, f.to] : Array.from({ length: n }, (_, i) => f.from + i);
  const W = 46, arcRoom = f.mode === "pairs" || f.mode === "middle-pairs" ? 76 : 10, y = arcRoom + 6, mid = (f.from + f.to) / 2;
  const cx = (i) => 8 + i * W + (W - 8) / 2;
  let body = "";
  // 짝 고리: 보이는 칸끼리 바깥부터(…를 건너 바깥 짝이 진짜 짝이다)
  if (f.mode === "pairs" || f.mode === "middle-pairs") {
    const idx = cells.map((v, i) => (v === null ? -1 : i)).filter((i) => i >= 0);
    for (let a = 0; a < Math.floor(idx.length / 2); a++) {
      // 바깥 고리일수록 높다. 글자는 고리 꼭대기 바로 위, 흰 테두리로 아래 고리와 겹쳐도 읽힌다.
      const i = idx[a], j = idx[idx.length - 1 - a], h = (arcRoom - 4) / 0.75 - a * 24, top = y - h * 0.75;
      body += `<path d="M${cx(i)} ${y} C${cx(i)} ${y - h} ${cx(j)} ${y - h} ${cx(j)} ${y}" fill="none" stroke="${color}" stroke-width="2.5"/>`;
      body += `<text x="${(cx(i) + cx(j)) / 2}" y="${top - 1}" font-size="12" font-weight="900" fill="${color}" text-anchor="middle" dominant-baseline="central" stroke="#fff" stroke-width="4" paint-order="stroke">${esc(f.mode === "pairs" ? `${cells[i]}+${cells[j]}=${cells[i] + cells[j]}` : `${cells[i]}+${cells[j]}`)}</text>`;
    }
  }
  cells.forEach((v, i) => {
    const x = 8 + i * W;
    if (v === null) { body += text(cx(i), y + 18, "…", { size: 20, weight: 900, fill: "#566274" }); return; }
    const faded = f.mode === "count" && f.skipFirst && v === f.from;
    const on = (f.mode === "middle" || f.mode === "middle-pairs") && v === mid;
    body += `<rect x="${x}" y="${y}" width="${W - 8}" height="36" rx="8" fill="${on ? "#e3f5ea" : faded ? "#f2f2f2" : "#fff3c4"}" stroke="${on ? TONE.check : faded ? "#d6d6d6" : "#f0a500"}" stroke-width="${on ? 3 : 2}" ${faded ? 'stroke-dasharray="4 3"' : ""}/>${text(cx(i), y + 19, v, { size: 16, weight: 900, fill: faded ? "#9aa3ad" : "#222" })}`;
  });
  const note = f.note ? `<p class="tx-consec-note" style="--tone:${color}">${esc(f.note)}</p>` : "";
  const label = `${f.from}부터 ${f.to}까지의 수 ${n}개${f.mode === "pairs" ? ", 양 끝부터 짝을 지음" : f.mode.startsWith("middle") ? `, 가운데 수 ${mid}` : ""}`;
  return `<div class="tx-consec">${svg(16 + cells.length * W, y + 44, body, label)}${note}</div>`;
}

// ───── 합차·합과 배수: 같은 수를 동그라미 하나로(세는 점 노랑) ─────
// rows: [{ label, n, extra }] · sum이면 오른쪽 괄호 「합」, diff면 B의 더 많은 동그라미 위에 「차」.
// mark: all(모든 동그라미) · diff(더 많은 동그라미) · hideExtra(붙은 수를 뺀 뒤 흐리게) · unit(동그라미 안에 값) · values(줄 끝에 답)
function circlesFigure(f) {
  const color = TONE[f.tone || "given"], R = 16, G = 40, X0 = 64, rowH = 58, top = f.diff !== undefined ? 34 : 12;
  const maxN = Math.max(...f.rows.map((r) => r.n));
  const extraW = f.rows.some((r) => r.extra) ? 62 : 0, braceX = X0 + maxN * G + extraW + 10;
  const W = braceX + (f.sum !== undefined ? 92 : 20) + (f.values ? 60 : 0), H = top + f.rows.length * rowH + 6;
  let body = "";
  const minN = Math.min(...f.rows.map((r) => r.n));
  f.rows.forEach((r, k) => {
    const cy = top + k * rowH + rowH / 2;
    body += `<rect x="6" y="${cy - 16}" width="44" height="32" rx="8" fill="#fff" stroke="#566274" stroke-width="2"/>${text(28, cy + 1, r.label, { size: r.label.length > 1 ? 13 : 17, weight: 900 })}`;
    for (let i = 0; i < r.n; i++) {
      const cx = X0 + i * G + R, on = f.mark === "all" || (f.mark === "diff" && i >= minN && r.n > minN);
      body += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#ffd45c" stroke="${on ? color : "#a8741a"}" stroke-width="${on ? 3.5 : 2}"/>`;
      if (f.unit !== undefined) body += text(cx, cy + 1, f.unit, { size: 13, weight: 900 });
    }
    if (r.extra) {
      const ex = X0 + r.n * G + 4, faded = f.hideExtra;
      body += `<rect x="${ex}" y="${cy - 15}" width="52" height="30" rx="8" fill="${faded ? "#f2f2f2" : "#ffe9cc"}" stroke="${faded ? "#d6d6d6" : "#f39a1e"}" stroke-width="2" ${faded ? 'stroke-dasharray="4 3"' : ""}/>${text(ex + 26, cy + 1, r.extra, { size: 15, weight: 900, fill: faded ? "#9aa3ad" : "#222" })}`;
    }
    if (f.values) body += text(braceX + (f.sum !== undefined ? 92 : 20) + 24, cy + 1, `= ${f.values[k]}`, { size: 16, weight: 900, fill: TONE.check });
  });
  if (f.sum !== undefined) {
    const y0 = top + 8, y1 = top + f.rows.length * rowH - 8, ym = (y0 + y1) / 2;
    body += `<path d="M${braceX} ${y0} Q${braceX + 12} ${y0} ${braceX + 12} ${y0 + 12} V${ym - 8} Q${braceX + 12} ${ym} ${braceX + 22} ${ym} Q${braceX + 12} ${ym} ${braceX + 12} ${ym + 8} V${y1 - 12} Q${braceX + 12} ${y1} ${braceX} ${y1}" fill="none" stroke="#566274" stroke-width="2.5"/>`;
    body += `<rect x="${braceX + 26}" y="${ym - 15}" width="62" height="30" rx="8" fill="#fff3c4" stroke="#f0a500" stroke-width="2"/>${text(braceX + 57, ym + 1, `합 ${f.sum}`, { size: 14, weight: 900 })}`;
  }
  if (f.diff !== undefined) {
    const k = f.rows.findIndex((r) => r.n > minN), x0 = X0 + minN * G + 2, x1 = X0 + f.rows[k].n * G - 6, y = top + k * rowH + rowH / 2 - R - 4;
    body += `<path d="M${x0} ${y} V${y - 8} H${x1} V${y}" fill="none" stroke="${f.mark === "diff" ? color : "#566274"}" stroke-width="2.5"/>`;
    body += `<rect x="${(x0 + x1) / 2 - 31}" y="${y - 30}" width="62" height="22" rx="7" fill="#fff3c4" stroke="#f0a500" stroke-width="2"/>${text((x0 + x1) / 2, y - 19, `차 ${f.diff}`, { size: 13, weight: 900 })}`;
  }
  const label = f.rows.map((r) => `${r.label}: 동그라미 ${r.n}개${r.extra ? ` ${r.extra}` : ""}`).join(", ") + (f.sum !== undefined ? `, 합 ${f.sum}` : `, 차 ${f.diff}`);
  return `<div class="tx-circles">${svg(W, H, body, label)}</div>`;
}
// ○ + △ = S, ○ − △ = D (모양 색표: 동그라미 빨강 · 세모 초록). vals가 있으면 모양 밑에 값.
function shapeEqFigure(f) {
  const glyph = (t, x, y) => (t === "circle"
    ? `<circle cx="${x}" cy="${y}" r="14" fill="${SHAPE.circle.fill}" stroke="${SHAPE.circle.line}" stroke-width="2.5"/>`
    : `<path d="M${x} ${y - 14} L${x + 15} ${y + 12} L${x - 15} ${y + 12} Z" fill="${SHAPE.triangle.fill}" stroke="${SHAPE.triangle.line}" stroke-width="2.5" stroke-linejoin="round"/>`);
  let body = "";
  f.lines.forEach((line, k) => {
    const y = 26 + k * 62;
    line.forEach((tok, i) => {
      const x = 24 + i * 40;
      if (tok === "circle" || tok === "triangle") {
        body += glyph(tok, x, y);
        const v = f.vals?.[tok];
        if (v !== undefined) body += text(x, y + 28, v, { size: 13, weight: 900, fill: TONE.check });
      } else body += text(x, y + 1, tok, { size: 20, weight: 900 });
    });
  });
  return `<div class="tx-shape-eq">${svg(24 + 5 * 40, 26 + f.lines.length * 62 - 10, body, f.lines.map((l) => l.map((t) => (t === "circle" ? "동그라미" : t === "triangle" ? "세모" : t)).join(" ")).join(", "))}</div>`;
}

// ───── 시각·시간 세로셈: 시는 시끼리, 분은 분끼리 ─────
// rows: [{ pre, h, hu, m, mu }] · shifts: 줄마다 오후 시각을 12 더한 수 · borrow: 위 줄 시에서 1을 내려 분에 60 · carry: 분에서 받아올린 1
// res: 결과 줄(나온 칸만). 받아내림·받아올림 표시는 작은 글자로 칸 위에 쓴다.
function timeColFigure(f) {
  const color = TONE[f.tone || "given"];
  const mark = (s, cls = "") => `<small class="tx-time-mark ${cls}">${esc(s)}</small>`;
  const row = (r, i) => {
    const shift = f.shifts?.[i];
    const hTop = (i === 0 && f.borrow ? mark("−1", "borrow") : "") + (shift ? mark(`→${shift}`, "shift") : "");
    const mTop = i === 0 && f.borrow ? mark("+60", "borrow") : "";
    return `<tr><th>${i === 1 ? esc(f.op) : ""}</th><td class="pre">${esc(r.pre || "")}</td><td class="num">${hTop}${esc(r.h)}</td><td class="unit">${esc(r.hu)}</td><td class="num">${mTop}${esc(r.m)}</td><td class="unit">${esc(r.mu)}</td></tr>`;
  };
  const res = f.res || {};
  const resRow = `<tr class="res"><th></th><td class="pre"></td><td class="num">${f.carry ? mark("+1", "carry") : ""}${res.h ?? ""}</td><td class="unit">${res.h !== undefined ? esc(res.hu) : ""}</td><td class="num">${res.m ?? ""}</td><td class="unit">${res.m !== undefined ? "분" : ""}</td></tr>`;
  const label = `${f.rows.map((r) => `${r.pre || ""} ${r.h}${r.hu} ${r.m}${r.mu}`.trim()).join(` ${f.op} `)}${res.m !== undefined ? ` = ${res.h ?? "□"}${res.h !== undefined ? res.hu : ""} ${res.m}분` : ""}`;
  return `<div class="tx-time" style="--tone:${color}"><table role="img" aria-label="${esc(label)}">${f.rows.map(row).join("")}${resRow}</table></div>`;
}

// ───── 사각형의 둘레 ─────
// 모양 색: 직사각형·정사각형 네모 파랑, 평행사변형 노랑, 마름모 보라, 사다리꼴 하늘(골든벨 색표).
const QUAD_COLOR = { rect: SHAPE.square, square: SHAPE.square, para: { fill: "#fff3c4", line: "#d9a400" }, rhombus: SHAPE.diamond, trapezoid: { fill: "#dff3ff", line: "#1aa3c9" } };
const QUAD_PTS = {   // 왼쪽 위부터 시계 방향(위 변 = 0→1, 오른쪽 변 = 1→2, 아래 = 2→3, 왼쪽 = 3→0)
  rect: [[30, 30], [230, 30], [230, 140], [30, 140]],
  square: [[60, 20], [190, 20], [190, 150], [60, 150]],
  para: [[70, 30], [240, 30], [200, 140], [30, 140]],
  rhombus: [[95, 25], [215, 25], [165, 145], [45, 145]],
  trapezoid: [[80, 30], [180, 30], [230, 140], [30, 140]]
};
function quadShape(shape, pts, { stroke, fill, width = 3 }) {
  return `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
}
function quadFigure(f) {
  const pts = QUAD_PTS[f.shape], c = QUAD_COLOR[f.shape], tone = TONE[f.tone || "given"];
  let body = quadShape(f.shape, pts, { stroke: c.line, fill: c.fill });
  const mid = (i) => { const a = pts[i], b = pts[(i + 1) % 4]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
  // 둘레의 반: 위 변과 오른쪽 변을 안내 색으로 굵게
  // 점선으로 그려 모양 선(평행사변형 노랑)과 같은 색이어도 구별된다
  if (f.half) for (const i of [0, 1]) body += `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[(i + 1) % 4][0]}" y2="${pts[(i + 1) % 4][1]}" stroke="#fff" stroke-width="8" stroke-linecap="round"/><line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[(i + 1) % 4][0]}" y2="${pts[(i + 1) % 4][1]}" stroke="${tone}" stroke-width="6" stroke-dasharray="12 6" stroke-linecap="round"/>`;
  const four = f.shape === "square" || f.shape === "rhombus";
  const labelOf = (i) => (i % 2 === 0 ? f.top : four ? f.top : f.right);
  const show = f.all ? [0, 1, 2, 3] : [0, 1];
  for (const i of show) {
    const v = labelOf(i);
    if (v === undefined || v === null) continue;
    const [mx, my] = mid(i), off = [[0, -16], [22, 0], [0, 18], [-22, 0]][i];
    const txt = /^\d+$/u.test(v) ? `${v}cm` : v;
    body += `<text x="${mx + off[0]}" y="${my + off[1]}" font-size="15" font-weight="900" fill="${v === "가" ? "#5b2fa8" : "#222"}" text-anchor="middle" dominant-baseline="central" stroke="#fff" stroke-width="4" paint-order="stroke">${esc(txt)}</text>`;
  }
  if (f.inner) body += text(130, 86, f.inner, { size: 15, weight: 900, fill: /가/u.test(f.inner) ? "#5b2fa8" : "#222" });
  return `<div class="tx-quad">${svg(320, 172, `<g transform="translate(25 0)">${body}</g>`, `${{ rect: "직사각형", square: "정사각형", para: "평행사변형", rhombus: "마름모", trapezoid: "사다리꼴" }[f.shape]}${f.top ? `, 위 변 ${f.top}` : ""}${f.right ? `, 오른쪽 변 ${f.right}` : ""}${f.inner ? `, ${f.inner}` : ""}`)}</div>`;
}
function quadGalleryFigure(f) {
  const mark = new Set(f.mark || []);
  return `<div class="tx-quad-gallery">${f.items.map(([letter, shape]) => {
    const c = QUAD_COLOR[shape], on = mark.has(shape), pts = QUAD_PTS[shape].map(([x, y]) => [x * 0.42 + 4, y * 0.42 + 4]);
    return `<figure class="${on ? "on" : ""}" style="--tone:${TONE.check}">${svg(110, 76, quadShape(shape, pts, { stroke: c.line, fill: c.fill, width: 2.5 }), shape)}<figcaption>${esc(letter)}</figcaption></figure>`;
  }).join("")}</div>`;
}

// ───── 가로수 심기: 바둑돌 다각형 · 땅 둘레의 나무 · 호수 둘레의 가로등 ─────
const STONE = { fill: "#ffd45c", line: "#a8741a" };   // 세는 점·바둑돌 노랑
const SIDE_TINT = ["#e8503a", "#2f9e5f", "#2f6fe0", "#8e5bd8"];   // 변마다 다른 묶음 테두리(무지개 보기 색)
function polyCorners(shape, cx, cy, r) {
  const k = shape === "triangle" ? 3 : 4, start = shape === "triangle" ? -Math.PI / 2 : -Math.PI / 4;
  return Array.from({ length: k }, (_, i) => [cx + r * Math.cos(start + (i * 2 * Math.PI) / k), cy + r * Math.sin(start + (i * 2 * Math.PI) / k)]);
}
function stonesFigure(f) {
  const color = TONE[f.tone || "given"], W = 260, H = 230, cs = polyCorners(f.shape, 130, f.shape === "triangle" ? 128 : 115, 96);
  const n = Math.min(f.n, 13), R = n > 9 ? 6 : 8;
  let body = `<polygon points="${cs.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#d6d6d6" stroke-width="2"/>`;
  cs.forEach((a, s) => {
    const b = cs[(s + 1) % cs.length];
    for (let i = 0; i < n - 1; i++) {   // 변마다 앞 꼭짓점부터 n−1개(끝 꼭짓점은 다음 변이 센다)
      const t = i / (n - 1), x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, corner = i === 0;
      const stroke = f.perSide ? SIDE_TINT[s] : f.corners && corner ? color : STONE.line;
      body += `<circle cx="${x}" cy="${y}" r="${R}" fill="${STONE.fill}" stroke="${stroke}" stroke-width="${(f.perSide || (f.corners && corner)) ? 3 : 1.5}"/>`;
    }
  });
  if (f.n > 13) body += text(130, H - 10, `한 변에 ${f.n}개`, { size: 13, weight: 900 });
  const label = `${{ triangle: "정삼각형", square: "정사각형" }[f.shape]} 모양 바둑돌, 한 변에 ${f.n}개`;
  return `<div class="tx-stones">${svg(W, H, body, label)}${f.perSide && !f.hideCount ? `<p class="tx-consec-note" style="--tone:${color}">변마다 ${f.n - 1}개씩 ${cs.length}묶음</p>` : f.perSide ? `<p class="tx-consec-note" style="--tone:${color}">${cs.length}묶음</p>` : ""}</div>`;
}
function plotFigure(f) {
  const color = TONE[f.tone || "given"], W = 300, H = 210;
  const cs = f.shape === "rect" ? [[40, 40], [260, 40], [260, 170], [40, 170]] : polyCorners(f.shape, 150, f.shape === "triangle" ? 120 : 105, 86);
  let body = `<polygon points="${cs.map((p) => p.join(",")).join(" ")}" fill="#e3f5ea" stroke="#8a6a3a" stroke-width="3"/>`;
  const lens = f.shape === "rect" ? [f.w, f.h, f.w, f.h] : cs.map(() => f.w);
  if (f.trees) cs.forEach((a, s) => {
    const b = cs[(s + 1) % cs.length], m = lens[s] / f.gap;
    for (let i = 0; i < m; i++) { const t = i / m, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; body += `<circle cx="${x}" cy="${y}" r="7" fill="#2f9e5f" stroke="#16734b" stroke-width="2"/>`; }
  });
  const mid = (i) => { const a = cs[i], b = cs[(i + 1) % cs.length]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
  const [tx, ty] = mid(0);
  body += `<text x="${tx}" y="${ty - 16}" font-size="14" font-weight="900" fill="#222" text-anchor="middle" stroke="#fff" stroke-width="4" paint-order="stroke">${f.w}m</text>`;
  if (f.shape === "rect") { const [rx, ry] = mid(1); body += `<text x="${rx + 26}" y="${ry}" font-size="14" font-weight="900" fill="#222" text-anchor="middle" dominant-baseline="central">${f.h}m</text>`; }
  body += text(150, H - 12, `간격 ${f.gap}m · 꼭짓점에도 심어요`, { size: 13, weight: 800, fill: f.trees ? color : "#566274" });
  return `<div class="tx-plot">${svg(W, H, body, `땅 둘레 ${lens.reduce((a, b) => a + b, 0)}m, ${f.gap}m 간격`)}</div>`;
}
function lakeFigure(f) {
  const color = TONE[f.tone || "given"], W = 250, H = 230, cx = 125, cy = 112, r = 82, k = f.count;
  let body = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#dff3ff" stroke="#1aa3c9" stroke-width="3"/>`;
  if (f.lamps && k <= 30) for (let i = 0; i < k; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / k, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    if (f.per) for (let j = 1; j <= Math.min(f.per, 3); j++) { const b = a + (j * 2 * Math.PI) / k / (Math.min(f.per, 3) + 1); body += `<rect x="${cx + r * Math.cos(b) - 4}" y="${cy + r * Math.sin(b) - 4}" width="8" height="8" rx="2" fill="#bf8a42"/>`; }
    body += `<circle cx="${x}" cy="${y}" r="7" fill="#ffd84d" stroke="#d79a00" stroke-width="2"/>`;
  }
  body += text(cx, cy - 8, f.C ? `둘레 ${f.C}m` : "둘레 ?", { size: 15, weight: 900, fill: f.C ? "#222" : "#5b2fa8" });
  body += text(cx, cy + 14, `간격 ${f.gap}m`, { size: 13, weight: 800, fill: "#566274" });
  if (f.lamps) body += text(cx, H - 10, `가로등 ${k}개${f.per ? ` · 사이마다 ${f.per}개` : ""}`, { size: 13, weight: 900, fill: color });
  return `<div class="tx-lake">${svg(W, H, body, `원 모양 호수, 간격 ${f.gap}m`)}</div>`;
}
// ───── 수직선 위의 거리: 점 위치 비율대로, 위(over)·아래(under)에 거리 호 ─────
function distLineFigure(f) {
  // 거리는 꺾쇠 괄호로: 위쪽 거리는 줄 위로, 아래쪽 거리는 점 이름 밑으로, 하나마다 한 층씩 쌓는다.
  const color = TONE[f.tone || "given"], W = 340, x0 = 30, x1 = W - 30, L = 26;
  const overs = f.arcs.filter((a) => a.side === "over"), unders = f.arcs.filter((a) => a.side !== "over");
  // min이 있으면 그 수부터 그린다(크기 비교에서 기준 수를 넣은 줄). 점에 value가 있으면 이름 밑에 작게
  const valued = f.points.some((p) => p.value !== undefined);
  const axis = 16 + overs.length * L + 8, nameY = axis + 16, H = nameY + 14 + (valued ? 14 : 0) + unders.length * L + 8;
  const min = f.min ?? 0, max = Math.max(...f.points.map((p) => p.at)), X = (at) => x0 + ((x1 - x0) * (at - min)) / (max - min || 1);
  const pos = Object.fromEntries(f.points.map((p) => [p.label, X(p.at)]));
  const mark = new Set(f.mark || []);
  let body = `<line x1="${x0 - 12}" y1="${axis}" x2="${x1 + 12}" y2="${axis}" stroke="#566274" stroke-width="2.5"/>`;
  const bracket = (a, lvl, up) => {
    const xa = pos[a.from], xb = pos[a.to], on = a.ask || mark.has(`${a.from}~${a.to}`);
    const stroke = a.ask ? (f.tone === "check" ? TONE.check : "#8e5bd8") : on ? color : "#f39a1e";
    const base = up ? axis - 6 : nameY + 12, y = up ? base - (lvl + 1) * L + 8 : base + (lvl + 1) * L - 8;
    body += `<path d="M${xa} ${base} V${y} H${xb} V${base}" fill="none" stroke="${stroke}" stroke-width="${on ? 3 : 2}"${a.ask ? ' stroke-dasharray="6 4"' : ""}/>`;
    body += `<text x="${(xa + xb) / 2}" y="${up ? y - 8 : y + 9}" font-size="13" font-weight="900" fill="${a.ask ? "#5b2fa8" : "#222"}" text-anchor="middle" dominant-baseline="central" stroke="#fff" stroke-width="4" paint-order="stroke">${esc(a.label)}</text>`;
  };
  // 짧은 거리가 안쪽(줄 가까이)에 오도록
  const byLen = (a, b) => Math.abs(pos[a.to] - pos[a.from]) - Math.abs(pos[b.to] - pos[b.from]);
  [...overs].sort(byLen).forEach((a, i) => bracket(a, i, true));
  [...unders].sort(byLen).forEach((a, i) => bracket(a, i, false));
  for (const p of f.points) body += `<circle cx="${pos[p.label]}" cy="${axis}" r="5" fill="${mark.has(p.label) ? color : "#222"}"/>${text(pos[p.label], nameY, p.label, { size: 13, weight: 900, fill: mark.has(p.label) ? color : "#222" })}${p.value !== undefined ? text(pos[p.label], nameY + 15, p.value, { size: 11, weight: 800, fill: "#566274" }) : ""}`;
  return `<div class="tx-dist">${svg(W, H, body, f.arcs.map((a) => `${a.from}~${a.to} ${a.label}`).join(", "))}</div>`;
}

// ───── 수와 숫자의 개수 ─────
// digit-groups: 자릿수가 같은 수끼리 묶은 칸. show: plain(범위만) · range · count(개수) · digits(개수 × 자릿수)
function digitGroupsFigure(f) {
  const color = TONE[f.tone || "given"], name = { 1: "한 자리", 2: "두 자리", 3: "세 자리" };
  if (f.show === "plain") return `<div class="tx-digit-groups"><span class="whole">${esc(f.groups[0].from)}부터 ${esc(f.groups.at(-1).to)}까지</span></div>`;
  return `<div class="tx-digit-groups" style="--tone:${color}">${f.groups.map((g) => `<span><b>${g.from === g.to ? esc(g.from) : `${esc(g.from)}~${esc(g.to)}`}</b><small>${name[g.digits]} 수</small>${f.show !== "range" ? `<em>${g.count}개${f.show === "digits" ? ` × ${g.digits} = ${g.count * g.digits}` : ""}</em>` : ""}</span>`).join("")}</div>`;
}
// digit-grid: 1~end 수 배열판(한 줄에 10개). digits의 숫자를 색칠(place: ones = 일의 자리만, all = 어느 자리든), cells면 그 칸 전체를 칠한다.
function digitGridFigure(f) {
  const color = TONE[f.tone || "given"], ds = (f.digits || []).map(String), cells = new Set(f.cells || []);
  const paint = (n) => String(n).split("").map((ch, i, arr) => (ds.includes(ch) && !f.cells && (f.place === "all" || (f.place === "ones" && i === arr.length - 1)) ? `<i>${ch}</i>` : ch)).join("");
  const all = Array.from({ length: f.end }, (_, i) => i + 1);
  return `<div class="tx-digit-grid" style="--tone:${color}" role="img" aria-label="1부터 ${f.end}까지 수 배열판">${all.map((n) => `<span class="${cells.has(n) ? "on" : ""}">${paint(n)}</span>`).join("")}</div>`;
}

// ───── 거꾸로 생각하기 ─────
// op-chain: □ → (+6) → … → 결과. back이면 화살표 밑에 반대 계산(빨강 ←), nodes의 null은 「?」(처음 칸은 □).
const OP_BACK = { "+": "−", "−": "+", "×": "÷", "÷": "×" };
function opChainFigure(f) {
  const color = TONE[f.tone || "given"];
  const node = (v, i) => `<span class="node${i === 0 ? " start" : ""}${v !== null && i === 0 ? " found" : ""}">${v === null ? (i === 0 ? "□" : "?") : esc(v)}</span>`;
  const arrow = ([op, n], i) => `<span class="arrow${f.focus === i ? " on" : ""}"><b>${esc(op)}${esc(n)} →</b>${f.back ? `<small>← ${esc(OP_BACK[op])}${esc(n)}</small>` : ""}</span>`;
  const eq = f.equation ? `<p class="tx-op-eq">${esc(f.equation)}</p>` : "";
  return `<div class="tx-op-chain" style="--tone:${color}">${eq}<div>${f.nodes.map((v, i) => `${node(v, i)}${i < f.ops.length ? arrow(f.ops[i], i) : ""}`).join("")}</div></div>`;
}
// give-table: 열 = 처음 · 1번 뒤 · 2번 뒤, 행 = A · B. 열 사이에 주고받은 일, 모르는 칸은 「?」.
function giveTableFigure(f) {
  const color = TONE[f.tone || "given"];
  const head = f.states.map((_, i) => `<th>${i === 0 ? "처음" : `${i}번 뒤`}</th>`).join("");
  const moves = `<tr class="moves"><td></td>${f.states.map((_, i) => `<td>${i === 0 ? "" : `${esc(f.moves[i - 1].from)} → ${esc(f.moves[i - 1].to)} ${f.moves[i - 1].n === "have" ? "가진 만큼" : `${esc(f.moves[i - 1].n)}개`}`}</td>`).join("")}</tr>`;
  const row = (who) => `<tr><th>${who}</th>${f.states.map((st, i) => `<td class="${st ? "" : "unknown"}${f.focus === i || f.focus === i - 1 ? " on" : ""}">${st ? `${esc(st[who])}개` : "?"}</td>`).join("")}</tr>`;
  return `<div class="tx-give" style="--tone:${color}"><table><thead><tr><th></th>${head}</tr></thead><tbody>${moves}${row("A")}${row("B")}</tbody></table></div>`;
}

// ───── 곱셈을 칸으로 나누어 계산: 위에 곱해지는 수의 몇십·몇, 왼쪽에 곱하는 수(나누면 몇십·몇), 칸에 곱 ─────
function splitBoxFigure(f) {
  const color = TONE[f.tone || "given"];
  const head = `<tr><th class="corner">×</th>${f.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>`;
  const body = f.rows.map((r, i) => `<tr><th>${esc(r)}</th>${f.cols.map((c, j) => `<td class="${f.cells ? "on" : ""}">${f.cells ? esc(f.cells[i][j]) : ""}</td>`).join("")}</tr>`).join("");
  const total = f.total !== null && f.total !== undefined ? `<p class="tx-split-total">합 ${esc(f.total)}</p>` : "";
  return `<div class="tx-split" style="--tone:${color}"><p class="tx-split-q">${esc(f.first)} × ${esc(f.second)}</p><table role="img" aria-label="${esc(`${f.first} × ${f.second}를 칸으로 나눈 표`)}">${head}${body}</table>${total}</div>`;
}

// ───── 주고받아 같게: 한 칸 = 하나(세는 점 노랑). diff면 많은 쪽의 남는 칸을 칠하고, move면 그 반을 적은 쪽 끝에 점선으로 ─────
function equalBarsFigure(f) {
  const color = TONE[f.tone || "given"], n = Math.max(f.big, f.small + (f.move || 0)), cell = Math.max(6, Math.min(14, Math.floor(300 / n))), x0 = 96;
  const W = x0 + n * cell + 56, rowY = [24, 72];
  let body = "";
  [[f.names[0], f.big], [f.names[1], f.small]].forEach(([name, count], r) => {
    const y = rowY[r];
    body += `<text x="${x0 - 10}" y="${y + 10}" font-size="14" font-weight="900" fill="#222" text-anchor="end" dominant-baseline="central">${esc(name)}</text>`;
    for (let i = 0; i < count; i++) {
      const extra = f.diff && r === 0 && i >= f.small, moving = f.move && r === 0 && i >= f.big - f.move;
      body += `<rect x="${x0 + i * cell}" y="${y}" width="${cell - 1}" height="20" fill="${moving ? "#fff" : extra ? "#ffe9cc" : STONE.fill}" stroke="${extra ? color : STONE.line}" stroke-width="${extra ? 2 : 1}"${moving ? ' stroke-dasharray="3 2"' : ""}/>`;
    }
    if (f.move && r === 1) for (let i = 0; i < f.move; i++) body += `<rect x="${x0 + (count + i) * cell}" y="${y}" width="${cell - 1}" height="20" fill="#e3f5ea" stroke="${TONE.check}" stroke-width="2"/>`;
    const shown = f.move ? (r === 0 ? count - f.move : count + f.move) : count;
    body += text(x0 + Math.max(count, r === 1 ? count + (f.move || 0) : count) * cell + 26, y + 10, `${shown}${f.unit}`, { size: 14, weight: 900, fill: f.move ? TONE.check : "#222" });
  });
  if (f.diff) body += text(x0 + ((f.small + f.big) / 2) * cell, 10, f.move ? `${f.move}${f.unit} 옮겨요` : `차 ${f.big - f.small}${f.unit}`, { size: 13, weight: 900, fill: color });
  return `<div class="tx-equal">${svg(W, 104, body, `${f.names[0]} ${f.big}${f.unit}, ${f.names[1]} ${f.small}${f.unit}${f.move ? `, ${f.move}${f.unit} 옮김` : ""}`)}</div>`;
}
// 나이 표: 행 = 지금 · N년 뒤, 열 = 형 · 동생 · 차
function ageRowsFigure(f) {
  const color = TONE[f.tone || "given"];
  const row = ([label, a, b]) => `<tr><th>${esc(label)}</th><td>${a === null ? "?" : `${esc(a)}살`}</td><td>${b === null ? "?" : `${esc(b)}살`}</td><td class="gap">${a !== null && b !== null && (label === "지금" || f.gap !== null) ? `${a - b}살` : ""}</td></tr>`;
  return `<div class="tx-age" style="--tone:${color}"><table><thead><tr><th></th><th>형</th><th>동생</th><th>차</th></tr></thead><tbody>${f.rows.map(row).join("")}</tbody></table></div>`;
}

// ───── 달력: 한 달 달력 · 열두 달 날짜 수 · 날짜 → 요일 사다리 ─────
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
// cal-grid: start = 1일의 요일(0 = 일요일). show = "all" 또는 숫자를 보일 날짜 목록, marks = { 날짜: "on" | "?" }
function calGridFigure(f) {
  const color = TONE[f.tone || "given"], shown = f.show === "all" ? null : new Set(f.show || []), marks = f.marks || {};
  const cells = Array.from({ length: f.start }, () => '<span class="pad"></span>');
  for (let d = 1; d <= f.days; d++) {
    const m = marks[d], col = (f.start + d - 1) % 7;
    const cls = [m === "on" ? "on" : m === "?" ? "ask" : "", col === 0 ? "sun" : col === 6 ? "sat" : ""].filter(Boolean).join(" ");
    cells.push(`<span class="${cls}">${m === "?" ? "?" : m === "on" || !shown || shown.has(d) ? d : ""}</span>`);
  }
  return `<div class="tx-cal" style="--tone:${color}" role="img" aria-label="${esc(`${f.title} 달력`)}"><p>${esc(f.title)}</p><div class="tx-cal-grid">${WEEK.map((w, i) => `<b class="${i === 0 ? "sun" : i === 6 ? "sat" : ""}">${w}</b>`).join("")}${cells.join("")}</div></div>`;
}
const MONTH_LEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function monthDaysFigure(f) {
  const color = TONE[f.tone || "given"], on = new Set(f.on || []);
  return `<div class="tx-months" style="--tone:${color}">${MONTH_LEN.map((n, i) => `<span class="${f.show === "none" ? "" : `d${n}`}${on.has(i + 1) ? " on" : ""}"><b>${i + 1}월</b>${f.show === "none" ? "" : `<small>${n}일</small>`}</span>`).join("")}</div>`;
}
// day-ladder: rows = [{ label, day | null }], gaps[i] = rows[i]과 rows[i + 1] 사이에 쓰는 말
function dayLadderFigure(f) {
  const color = TONE[f.tone || "given"];
  const rows = f.rows.map((r, i) => `<div class="row"><b>${esc(r.label)}</b><span class="${r.day ? "" : "ask"}">${r.day ? `${esc(r.day)}요일` : "?"}</span></div>${i < f.rows.length - 1 ? `<p class="gap">${f.gaps[i] ? `↓ ${esc(f.gaps[i])}` : "↓"}</p>` : ""}`).join("");
  return `<div class="tx-ladder" style="--tone:${color}">${rows}</div>`;
}

// ───── 사각수·삼각수: 점 네모/세모(겹마다 번갈아 칠함, hi 겹은 안내 색) ─────
const LAYER = ["#ffd45c", "#ffeaa6"];
function dotsFigure(f) {
  const color = TONE[f.tone || "given"], gap = f.n > 9 ? 12 : 18, r = f.n > 9 ? 4.5 : 6.5, pad = 12;
  let body = "", W, H;
  if (f.shape === "square") {
    W = H = pad * 2 + (f.n - 1) * gap;
    for (let y = 0; y < f.n; y++) for (let x = 0; x < f.n; x++) {
      const layer = Math.max(x, y) + 1, on = f.hi === layer;
      body += `<circle cx="${pad + x * gap}" cy="${pad + y * gap}" r="${r}" fill="${on ? color : LAYER[layer % 2]}" stroke="${on ? color : STONE.line}" stroke-width="1.2"/>`;
    }
  } else {
    W = pad * 2 + (f.n - 1) * gap; H = pad * 2 + (f.n - 1) * gap * 0.87;
    for (let y = 0; y < f.n; y++) for (let x = 0; x <= y; x++) {
      const on = f.hi === y + 1;
      body += `<circle cx="${W / 2 + (x - y / 2) * gap}" cy="${pad + y * gap * 0.87}" r="${r}" fill="${on ? color : LAYER[(y + 1) % 2]}" stroke="${on ? color : STONE.line}" stroke-width="1.2"/>`;
    }
  }
  const cap = f.caption ? `<p class="tx-dots-cap">${esc(f.caption)}</p>` : "";
  return `<div class="tx-dots" style="--tone:${color}">${svg(W, H, body, `${f.shape === "square" ? "점 네모" : "점 세모"} ${f.n}줄`)}${cap}</div>`;
}
// seq: 늘어놓은 수. notes[i] = 수 밑에 쓰는 말(「3 × 3」), diffs = 수 사이에 늘어난 수, ask = 마지막에 「?」 칸
function seqFigure(f) {
  const color = TONE[f.tone || "given"];
  const cells = f.values.map((v, i) => `${i && f.diffs ? `<em>+${esc(f.diffs[i - 1])}</em>` : ""}<span><b>${esc(v)}</b>${f.notes?.[i] ? `<small>${esc(f.notes[i])}</small>` : ""}</span>`).join("");
  return `<div class="tx-seq" style="--tone:${color}">${cells}<i>…</i>${f.ask ? `<span class="ask"><b>${esc(f.ask)}</b></span>` : ""}</div>`;
}
// stone-rows: 줄마다 홀수 개, 검은 줄·흰 줄 번갈아. sums면 줄 옆에 개수
function stoneRowsFigure(f) {
  const color = TONE[f.tone || "given"], gap = f.rows.length > 6 ? 12 : 16, r = gap / 2 - 1.5, wide = Math.max(...f.rows);
  const W = wide * gap + 70, H = f.rows.length * gap + 16;
  let body = "";
  f.rows.forEach((n, i) => {
    const black = i % 2 === 0, y = 8 + i * gap + gap / 2, x0 = (wide - n) / 2 * gap + 6;
    for (let k = 0; k < n; k++) body += `<circle cx="${x0 + k * gap + gap / 2}" cy="${y}" r="${r}" fill="${black ? "#2b2b2b" : "#fff"}" stroke="#2b2b2b" stroke-width="1.2"/>`;
    if (f.counts) body += text(wide * gap + 40, y, `${n}개`, { size: 11, weight: 800, fill: black ? "#222" : "#566274" });
  });
  return `<div class="tx-stone-rows" style="--tone:${color}">${svg(W, H, body, `검은 돌과 흰 돌 ${f.rows.length}줄`)}</div>`;
}
// hand: 사람(점)을 둥글게 놓고 두 사람마다 선. hi = 새로 온 사람(그 사람의 선만 안내 색), all이면 모든 선
function handFigure(f) {
  const color = TONE[f.tone || "given"], n = f.names.length, R = n > 8 ? 92 : 74, C = R + 26;
  const pts = f.names.map((_, i) => [C + R * Math.sin((2 * Math.PI * i) / n), C - R * Math.cos((2 * Math.PI * i) / n)]);
  let body = "";
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const on = f.hi !== undefined ? i === f.hi || j === f.hi : f.all;
    if (!on && !f.faint) continue;
    body += `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${on ? color : "#d8d2c4"}" stroke-width="${on ? 2.2 : 1.2}"/>`;
  }
  pts.forEach(([x, y], i) => { body += `<circle cx="${x}" cy="${y}" r="13" fill="${i === f.hi ? "#fff3c4" : SHAPE.square.fill}" stroke="${i === f.hi ? "#d39b20" : SHAPE.square.line}" stroke-width="2"/>${text(x, y, f.names[i], { size: 13, weight: 900 })}`; });
  return `<div class="tx-hand">${svg(C * 2, C * 2, body, `${n}명이 악수하는 그림`)}</div>`;
}
// fan: 꼭짓점에서 아래로 선을 그어 작은 삼각형 k개. cross면 가운데 가로선이 하나 더. hi = 칠할 삼각형 [왼쪽 선, 오른쪽 선, "base"|"cross"]
function fanFigure(f) {
  const color = TONE[f.tone || "given"], W = 260, H = 170, top = [W / 2, 12], y1 = H - 12, yc = 12 + (y1 - 12) * 0.55;
  const foot = (i, y) => [top[0] + ((24 + (i * (W - 48)) / f.k) - top[0]) * ((y - 12) / (y1 - 12)), y];
  let body = "";
  if (f.hi) { const [a, b, at] = f.hi, y = at === "cross" ? yc : y1; const pa = foot(a, y), pb = foot(b, y); body += `<polygon points="${top.join(",")} ${pa.join(",")} ${pb.join(",")}" fill="${color}" fill-opacity="0.28" stroke="${color}" stroke-width="2.5"/>`; }
  for (let i = 0; i <= f.k; i++) body += `<line x1="${top[0]}" y1="${top[1]}" x2="${foot(i, y1)[0]}" y2="${y1}" stroke="#2b2b2b" stroke-width="1.8"/>`;
  body += `<line x1="${foot(0, y1)[0]}" y1="${y1}" x2="${foot(f.k, y1)[0]}" y2="${y1}" stroke="#2b2b2b" stroke-width="1.8"/>`;
  if (f.cross) body += `<line x1="${foot(0, yc)[0]}" y1="${yc}" x2="${foot(f.k, yc)[0]}" y2="${yc}" stroke="#2b2b2b" stroke-width="1.8"/>`;
  return `<div class="tx-fan">${svg(W, H, body, `꼭짓점에서 선을 그은 삼각형, 작은 칸 ${f.k}개${f.cross ? ", 가로선 하나" : ""}`)}</div>`;
}
// odd-rows: 맨 위 1개, 그 아래 3개, 5개… n줄. square = 작은 정사각형 탑, triangle = 큰 삼각형 안 작은 삼각형
function oddRowsFigure(f) {
  const color = TONE[f.tone || "given"], s = f.n > 6 ? 14 : 20, W = (2 * f.n - 1) * (f.shape === "square" ? s : s / 2) + s + 8, H = f.n * s + 8;
  let body = "";
  for (let r = 0; r < f.n; r++) {
    const on = f.hi === r + 1, fill = on ? color : LAYER[(r + 1) % 2];
    if (f.shape === "square") for (let k = 0; k < 2 * r + 1; k++) body += `<rect x="${W / 2 + (k - r - 0.5) * s}" y="${4 + r * s}" width="${s}" height="${s}" fill="${fill}" fill-opacity="${on ? 0.5 : 1}" stroke="${STONE.line}" stroke-width="1.2"/>`;
    else for (let k = 0; k < 2 * r + 1; k++) {
      const up = k % 2 === 0, cx = W / 2 + (k - r) * (s / 2), y = 4 + r * s;
      const pts = up ? `${cx},${y} ${cx - s / 2},${y + s} ${cx + s / 2},${y + s}` : `${cx - s / 2},${y} ${cx + s / 2},${y} ${cx},${y + s}`;
      body += `<polygon points="${pts}" fill="${fill}" fill-opacity="${on ? 0.5 : 1}" stroke="${SHAPE.triangle.line}" stroke-width="1.2"/>`;
    }
    if (f.counts) body += text(W - 2, 4 + r * s + s / 2, `${2 * r + 1}`, { size: 11, weight: 900, fill: "#566274", anchor: "end" });
  }
  return `<div class="tx-odd-rows">${svg(W + (f.counts ? 18 : 0), H, body, `${f.n}줄 탑`)}</div>`;
}
// tri-layers: 층마다 삼각수만큼 놓은 쌓기나무를 층별 점 세모로 나란히(1층 = 맨 위)
function triLayersFigure(f) {
  const color = TONE[f.tone || "given"];
  return `<div class="tx-tri-layers" style="--tone:${color}">${Array.from({ length: f.n }, (_, i) => `<span>${dotsFigure({ shape: "triangle", n: i + 1, tone: f.tone })}<b>${i + 1}층</b>${f.counts ? `<small>${((i + 1) * (i + 2)) / 2}개</small>` : ""}</span>`).join("")}</div>`;
}

// ───── 둘레(붙인·자른·꺾인 도형): 좌표(cm, 아래로 +y)를 그림 칸에 맞춰 줄인다 ─────
// shapes = [{ pts, color: rect|square|para|rhombus|triangle|cell, name? }], labels = [{ a, b, text, hi? , out? }](변 바깥쪽에 글),
// shared = 맞닿은 변(빨간 점선), moved = 옮긴 변(안내 색 점선), box = 옮겨 만든 직사각형 [x0, y0, x1, y1]
const POLY_COLOR = { rect: SHAPE.square, square: SHAPE.square, para: { fill: "#fff3c4", line: "#d9a400" }, rhombus: SHAPE.diamond, triangle: SHAPE.triangle, cell: { fill: "#ffeaa6", line: "#a8741a" } };
function polyFigure(f) {
  const color = TONE[f.tone || "given"], all = f.shapes.flatMap((s) => s.pts).concat(f.box ? [[f.box[0], f.box[1]], [f.box[2], f.box[3]]] : []);
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0 || 1, h = Math.max(...ys) - y0 || 1;
  const k = Math.min(250 / w, 170 / h, 34), pad = 30, W = w * k + pad * 2, H = h * k + pad * 2;
  const P = ([x, y]) => [pad + (x - x0) * k, pad + (y - y0) * k], cx = pad + (w * k) / 2, cy = pad + (h * k) / 2;
  let body = "";
  if (f.box) { const [a, b] = [P([f.box[0], f.box[1]]), P([f.box[2], f.box[3]])]; body += `<rect x="${a[0]}" y="${a[1]}" width="${b[0] - a[0]}" height="${b[1] - a[1]}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="6 4"/>`; }
  for (const s of f.shapes) {
    const c = POLY_COLOR[s.color] || POLY_COLOR.rect;
    body += `<polygon points="${s.pts.map((p) => P(p).join(",")).join(" ")}" fill="${s.hi ? color : c.fill}" fill-opacity="${s.hi ? 0.3 : 1}" stroke="${c.line}" stroke-width="${s.color === "cell" ? 1.2 : 2.2}" stroke-linejoin="round"/>`;
    if (s.name) { const m = s.pts.reduce((acc, p) => [acc[0] + p[0] / s.pts.length, acc[1] + p[1] / s.pts.length], [0, 0]); const [mx, my] = P(m); body += text(mx, my, s.name, { size: 13, weight: 900, fill: "#222" }); }
  }
  const seg = (e, stroke, dash, width = 3) => { const [a, b] = [P(e.a), P(e.b)]; return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${stroke}" stroke-width="${width}" stroke-dasharray="${dash}" stroke-linecap="round"/>`; };
  for (const e of f.shared || []) body += seg(e, "#e8503a", "5 4");
  for (const e of f.moved || []) body += seg(e, color, "2 4", 3.5);
  for (const l of f.labels || []) {
    const [a, b] = [P(l.a), P(l.b)], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const len = Math.hypot(nx, ny) || 1; nx /= len; ny /= len;
    if ((mx - cx) * nx + (my - cy) * ny < 0 !== Boolean(l.inside)) { nx = -nx; ny = -ny; }
    if (l.hi) body += seg(l, color, "0", 4);
    body += text(mx + nx * 14, my + ny * 12, l.text, { size: 12, weight: 900, fill: l.hi ? color : /^[가-힣A-Z?]+$/u.test(l.text) ? "#5b2fa8" : "#222" });
  }
  return `<div class="tx-poly">${svg(W, H, body, f.label || "도형의 둘레 그림")}</div>`;
}

// eqs: 관계식이나 조건 문장을 한 줄씩(크기 비교)
function eqsFigure(f) {
  const color = TONE[f.tone || "given"];
  return `<div class="tx-eqs" style="--tone:${color}">${f.lines.map((l, i) => `<p class="${(f.on || []).includes(i) ? "on" : ""}">${esc(l)}</p>`).join("")}${f.note ? `<b>${esc(f.note)}</b>` : ""}</div>`;
}
// num-cards: 1부터 n까지 카드. used = 이미 쓴 수, pick = 고른 짝(안내 색), left = 남는 수(보라)
function numCardsFigure(f) {
  const color = TONE[f.tone || "given"], used = new Set(f.used || []), pick = new Set(f.pick || []), left = new Set(f.left || []);
  return `<div class="tx-cards" style="--tone:${color}"><div>${Array.from({ length: f.n }, (_, i) => i + 1).map((v) => `<span class="${used.has(v) ? "used" : pick.has(v) ? "on" : left.has(v) ? "left" : ""}">${v}</span>`).join("")}</div>${(f.eqs || []).map((e) => `<p>${esc(e)}</p>`).join("")}</div>`;
}

// ───── 논리(4권): 순서 칸 · 한 줄 · 동서남북 칸 · 원탁 · O/X 표 ─────
function slotsFigure(f) {
  const color = TONE[f.tone || "given"], hi = new Set(f.hi || []);
  return `<div class="tx-slots" style="--tone:${color}">${f.labels.map((l, i) => `<span class="${f.names[i] ? "" : "empty"}${hi.has(i) ? " on" : ""}"><small>${esc(l)}</small><b>${esc(f.names[i] || "?")}</b></span>`).join("")}</div>`;
}
// row-line: 한 줄로 선 n명(왼쪽이 앞). marks = { 번째(1부터): 이름 }, spans = [{ from, to, label }] — 줄 밑 꺾쇠
function rowLineFigure(f) {
  const color = TONE[f.tone || "given"], gap = f.n > 12 ? 22 : 26, W = f.n * gap + 40, H = 92 + (f.spans || []).length * 0;
  const X = (k) => 20 + (k - 0.5) * gap;
  let body = text(10, 18, "앞", { size: 12, weight: 900, fill: "#566274", anchor: "start" }) + text(W - 10, 18, "뒤", { size: 12, weight: 900, fill: "#566274", anchor: "end" });
  for (let k = 1; k <= f.n; k++) { const who = f.marks?.[k]; body += `<circle cx="${X(k)}" cy="40" r="${who ? 10 : 8}" fill="${who ? color : "#ffd45c"}" stroke="${who ? color : "#a8741a"}" stroke-width="1.5"/>`; if (who) body += text(X(k), 20, who, { size: 12, weight: 900, fill: color }); }
  (f.spans || []).forEach((s, i) => { const y = 62 + i * 0; body += `<path d="M${X(s.from) - 8} ${y - 6} V${y} H${X(s.to) + 8} V${y - 6}" fill="none" stroke="#f39a1e" stroke-width="2"/>${text((X(s.from) + X(s.to)) / 2, y + 14, s.label, { size: 12, weight: 900 })}`; });
  return `<div class="tx-row-line">${svg(W, H, body, `한 줄로 선 ${f.n}명`)}</div>`;
}
// compass: 칸 이름 표(위가 북). hi = 찾은 칸 [[행, 열]], ask = 물음표 칸
function compassFigure(f) {
  const color = TONE[f.tone || "given"], key = (r, c) => `${r},${c}`, hi = new Set((f.hi || []).map(([r, c]) => key(r, c))), ask = new Set((f.ask || []).map(([r, c]) => key(r, c)));
  const cells = f.rows.map((row, r) => row.map((v, c) => `<span class="${hi.has(key(r, c)) ? "on" : ask.has(key(r, c)) ? "ask" : v ? "" : "empty"}">${esc(ask.has(key(r, c)) && !v ? f.askLabel || "?" : v || "")}</span>`).join("")).join("");
  return `<div class="tx-compass" style="--tone:${color};--cols:${f.rows[0].length}"><b class="n">북</b><b class="w">서</b><div>${cells}</div><b class="e">동</b><b class="s">남</b></div>`;
}
// round: 원탁 자리(0 = 맨 위, 시계 바늘이 도는 쪽으로 1, 2, …). seats = 이름(없으면 자리 이름), hi = 칠할 자리
function roundFigure(f) {
  const color = TONE[f.tone || "given"], n = f.seats.length, R = 70, C = 106, hi = new Set(f.hi || []);
  let body = `<circle cx="${C}" cy="${C}" r="${R - 26}" fill="#f5e3c3" stroke="#c99b5a" stroke-width="2"/>${text(C, C, "식탁", { size: 13, weight: 900, fill: "#8a6a3a" })}`;
  if (f.arrow) body += `<path d="M${C + 18} ${C - 34} A 38 38 0 0 1 ${C + 34} ${C - 14}" fill="none" stroke="${color}" stroke-width="2.5" marker-end="url(#rtip)"/>`;
  f.seats.forEach((s, i) => { const a = (-90 + (360 * i) / n) * Math.PI / 180, x = C + R * Math.cos(a), y = C + R * Math.sin(a), known = s.name; body += `<circle cx="${x}" cy="${y}" r="20" fill="${hi.has(i) ? color : known ? SHAPE.square.fill : "#fff"}" stroke="${hi.has(i) ? color : known ? SHAPE.square.line : "#8e5bd8"}" stroke-width="2"${known || hi.has(i) ? "" : ' stroke-dasharray="4 3"'}/>${text(x, y, s.name || s.seat, { size: 12, weight: 900, fill: hi.has(i) ? "#fff" : known ? "#222" : "#5b2fa8" })}`; });
  const defs = `<defs><marker id="rtip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="${color}"/></marker></defs>`;
  return `<div class="tx-round">${svg(C * 2, C * 2, defs + body, `원탁 ${n}자리`)}</div>`;
}
// ox: 사람 × 고를 것 표. marks = { "사람|것": "O" | "X" }
function oxFigure(f) {
  const color = TONE[f.tone || "given"], on = new Set(f.hi || []);
  return `<div class="tx-ox" style="--tone:${color}"><table><thead><tr><th></th>${f.choices.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${f.people.map((p) => `<tr><th>${esc(p)}</th>${f.choices.map((c) => { const m = f.marks[`${p}|${c}`]; return `<td class="${m === "O" ? "o" : m === "X" ? "x" : ""}${on.has(`${p}|${c}`) ? " on" : ""}">${m || ""}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
}

// ───── 복면산: 세로 덧셈판. 모양은 모양 색, reveal = { 모양: 숫자 }, blanks = 빈칸(_)에 차례로 넣을 숫자, focus = 오른쪽부터 몇째 자리(0 = 일의 자리), carry = { 자리: 1 } ─────
const CRYPT_COLOR = { "□": SHAPE.square.line, "△": SHAPE.triangle.line, "○": SHAPE.circle.line, "◇": SHAPE.diamond.line };
function cryptFigure(f) {
  const color = TONE[f.tone || "given"], rows = [...f.addends, f.sum], cols = Math.max(...rows.map((r) => [...r].length)) + 1, reveal = f.reveal || {};
  let blank = 0;
  const cell = (ch, col) => {
    const on = f.focus === col ? " on" : "";
    if (/\d/u.test(ch)) return `<span class="d${on}">${ch}</span>`;
    if (ch === "_") { const v = f.blanks?.[blank++]; return `<span class="blank${v !== undefined ? " got" : ""}${on}">${v ?? ""}</span>`; }
    if (ch === "㉠") { const v = f.blanks?.[blank++]; return `<span class="blank mark${v !== undefined ? " got" : ""}${on}">${v ?? "㉠"}</span>`; }
    const v = reveal[ch];
    return `<span class="sym${v !== undefined ? " got" : ""}${on}" style="--sym:${CRYPT_COLOR[ch] || "#222"}">${v !== undefined ? `${v}<small>${esc(ch)}</small>` : esc(ch)}</span>`;
  };
  const line = (r, i, op) => { const chars = [...r], pad = cols - chars.length; return `<div class="row">${Array.from({ length: pad }, (_, k) => `<span class="op">${op && k === pad - 1 ? "+" : ""}</span>`).join("")}${chars.map((ch, j) => cell(ch, chars.length - 1 - j)).join("")}</div>`; };
  const carry = `<div class="row carry">${Array.from({ length: cols }, (_, k) => `<span>${f.carry?.[cols - 1 - k] ? "1" : ""}</span>`).join("")}</div>`;
  const body = f.addends.map((r, i) => line(r, i, i === f.addends.length - 1)).join("") + `<hr>` + line(f.sum, rows.length - 1, false);
  return `<div class="tx-crypt" style="--tone:${color};--cols:${cols}" role="img" aria-label="${esc(`${f.addends.join(" + ")} = ${f.sum}`)}">${carry}${body}</div>`;
}

// ───── 매트릭스: 칸 표 + 오른쪽(가로줄)·아래(세로줄)의 합이나 곱. reveal = { 모양: 수 }, focus = { row } | { col }, 값이 null이면 「?」 ─────
const MAT_COLOR = { "□": SHAPE.square.line, "△": SHAPE.triangle.line, "○": SHAPE.circle.line, "◇": SHAPE.diamond.line, "☆": "#c98a12" };
function mgridFigure(f) {
  const color = TONE[f.tone || "given"], reveal = f.reveal || {}, shaded = new Set(f.shaded || []), R = f.cells.length, C = f.cells[0].length;
  const inFocus = (r, c) => (f.focus?.row === r) || (f.focus?.col === c);
  const cell = (v, r, c) => {
    const sh = shaded.has(`${r},${c}`), on = inFocus(r, c) ? " on" : "";
    if (v === "" || v === null) return `<span class="${sh ? "shade" : "empty"}${on}"></span>`;
    if (/^\d+$/u.test(v)) return `<span class="d${sh ? " shade" : ""}${on}">${v}</span>`;
    if (MAT_COLOR[v]) return `<span class="sym${reveal[v] !== undefined ? " got" : ""}${on}" style="--sym:${MAT_COLOR[v]}">${reveal[v] !== undefined ? `${reveal[v]}<small>${esc(v)}</small>` : esc(v)}</span>`;
    return `<span class="letter${reveal[v] !== undefined ? " got" : ""}${sh ? " shade" : ""}${on}">${esc(reveal[v] ?? v)}</span>`;
  };
  const tot = (v, on) => `<b class="${v === null ? "ask" : v === "" ? "none" : ""}${on ? " on" : ""}">${v === null ? "?" : esc(v)}</b>`;
  if (f.noTotals) return `<div class="tx-mgrid" style="--tone:${color};--cols:${C}" role="img" aria-label="수 배열표">${f.cells.map((row, r) => row.map((v, c) => cell(v, r, c)).join("")).join("")}</div>`;
  const rows = f.cells.map((row, r) => `${row.map((v, c) => cell(v, r, c)).join("")}${tot(f.rowVals[r], f.focus?.row === r)}`).join("");
  const bottom = `${f.colVals.map((v, c) => tot(v, f.focus?.col === c)).join("")}<i>${esc(f.op === "×" ? "곱" : "합")}</i>`;
  return `<div class="tx-mgrid" style="--tone:${color};--cols:${C + 1}" role="img" aria-label="${R}×${C} 매트릭스">${rows}${bottom}</div>`;
}
// ring: 꼭짓점 동그라미(2~9)와 변의 네모(양쪽 동그라미의 곱). n = 3(삼각형) · 4(사각형)
function ringFigure(f) {
  const color = TONE[f.tone || "given"], n = f.circles.length, R = 78, C = 110, hi = new Set(f.hi || []);
  const P = (i) => { const a = (-90 + (360 * i) / n) * Math.PI / 180; return [C + R * Math.cos(a), C + 6 + R * Math.sin(a)]; };
  let body = `<polygon points="${f.circles.map((_, i) => P(i).join(",")).join(" ")}" fill="none" stroke="#c9c2b4" stroke-width="2"/>`;
  f.squares.forEach((v, i) => { const [a, b] = [P(i), P((i + 1) % n)], x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2; body += `<rect x="${x - 17}" y="${y - 15}" width="34" height="30" rx="5" fill="${v === null ? "#fff" : "#fff3c4"}" stroke="${v === null ? "#8e5bd8" : "#f0a500"}" stroke-width="2"${v === null ? ' stroke-dasharray="4 3"' : ""}/>${text(x, y, v === null ? "?" : v, { size: 14, weight: 900, fill: v === null ? "#5b2fa8" : "#222" })}`; });
  f.circles.forEach((v, i) => { const [x, y] = P(i), known = typeof v === "number"; body += `<circle cx="${x}" cy="${y}" r="18" fill="${hi.has(i) ? color : known ? SHAPE.circle.fill : "#fff"}" stroke="${hi.has(i) ? color : SHAPE.circle.line}" stroke-width="2"${known || hi.has(i) ? "" : ' stroke-dasharray="4 3"'}/>${text(x, y, v ?? "?", { size: 14, weight: 900, fill: hi.has(i) ? "#fff" : known ? "#222" : "#5b2fa8" })}`; });
  return `<div class="tx-ring">${svg(C * 2, C * 2, body, `${n}각형 곱셈 고리`)}</div>`;
}

// line-board: 같은 합이 되어야 하는 줄(굵은 띠) 위의 자리. vals[i] = 수(빈 문자열이면 빈자리, "?"면 물음 칸), hi = 안내 색 자리
function lineBoardFigure(f) {
  const color = TONE[f.tone || "given"], hi = new Set(f.hi || []), k = 1.7, pad = 26, W = 100 * k + pad * 2;
  const P = ([x, y]) => [pad + x * k, pad + y * k];
  let body = "";
  for (const ln of f.lines) body += `<polyline points="${ln.map((i) => P(f.pts[i]).join(",")).join(" ")}" fill="none" stroke="#eadfc8" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
  f.pts.forEach((pt, i) => {
    const [x, y] = P(pt), v = f.vals[i], empty = v === "" || v === null || v === undefined, ask = v === "?", on = hi.has(i);
    body += `<circle cx="${x}" cy="${y}" r="18" fill="${on ? color : empty || ask ? "#fff" : "#fff3c4"}" stroke="${on ? color : empty || ask ? "#8e5bd8" : "#f0a500"}" stroke-width="2.2"${(empty || ask) && !on ? ' stroke-dasharray="4 3"' : ""}/>`;
    if (!empty) body += text(x, y, v, { size: 15, weight: 900, fill: on ? "#fff" : ask ? "#5b2fa8" : "#222" });
  });
  return `<div class="tx-line-board">${svg(W, W, body, `줄 ${f.lines.length}개가 만나는 숫자 판`)}</div>`;
}
// nline: 수직선. 큰 눈금(pts) 사이를 segs[i].n칸으로 똑같이 나누고 칸마다 작은 활. spans = 줄 밑 꺾쇠(at 값)
const SEG_COLOR = ["#e8503a", "#2f9e5f", "#2f6fe0"];
function nlineFigure(f) {
  const color = TONE[f.tone || "given"], W = 340, x0 = 26, x1 = W - 26, axis = 46, lo = f.pts[0].at, hi = f.pts[f.pts.length - 1].at;
  const X = (at) => x0 + ((x1 - x0) * (at - lo)) / (hi - lo || 1), H = axis + 34 + f.spans.length * 26;
  let body = `<line x1="${x0 - 10}" y1="${axis}" x2="${x1 + 10}" y2="${axis}" stroke="#566274" stroke-width="2.5"/>`;
  const main = f.pts.filter((p) => !/^[A-Z]$/u.test(p.label) || f.segs.length === f.pts.length - 1);
  const big = f.pts.filter((_, i) => i < f.segs.length + 1);
  const ends = f.pts.filter((p) => !/^[A-Z]$/u.test(p.label));
  ends.slice(0, -1).forEach((p, i) => {
    const s = f.segs[i]; if (!s) return;
    const q = ends[i + 1], step = (q.at - p.at) / s.n, stroke = s.hi ? color : SEG_COLOR[i % 3];
    for (let k = 0; k < s.n; k++) {
      const xa = X(p.at + k * step), xb = X(p.at + (k + 1) * step), h = Math.min(16, (xb - xa) * 0.45);
      body += `<path d="M${xa} ${axis} Q${(xa + xb) / 2} ${axis - h * 2} ${xb} ${axis}" fill="none" stroke="${stroke}" stroke-width="${s.hi ? 2.6 : 1.8}"/>`;
      if (k) body += `<line x1="${xa}" y1="${axis - 5}" x2="${xa}" y2="${axis + 5}" stroke="#566274" stroke-width="1.5"/>`;
      if (s.mark) body += text((xa + xb) / 2, axis - h - 10, s.mark, { size: 11, weight: 900, fill: stroke });
      else if (s.name && k === 0) body += text((xa + xb) / 2, axis - h - 11, s.name, { size: 13, weight: 900, fill: stroke });
    }
  });
  for (const p of f.pts) {
    const ask = !/^\d+$/u.test(p.label), x = X(p.at);
    body += `<line x1="${x}" y1="${axis - 9}" x2="${x}" y2="${axis + 9}" stroke="${ask ? "#8e5bd8" : "#222"}" stroke-width="2.5"/>${text(x, axis + 20, p.label, { size: 13, weight: 900, fill: ask ? "#5b2fa8" : "#222" })}`;
  }
  f.spans.forEach((sp, i) => {
    const xa = X(sp.from), xb = X(sp.to), y = axis + 34 + i * 26;
    body += `<path d="M${xa} ${y - 8} V${y} H${xb} V${y - 8}" fill="none" stroke="${sp.ask ? "#8e5bd8" : "#f39a1e"}" stroke-width="2.2"/>${text((xa + xb) / 2, y + 10, sp.label, { size: 13, weight: 900, fill: sp.ask ? "#5b2fa8" : "#222" })}`;
  });
  return `<div class="tx-nline">${svg(W, H + 6, body, `수직선 ${f.pts.map((p) => p.label).join(", ")}`)}</div>`;
}
// fshape: 같은 크기로 나눈 도형. circle = 맨 위부터 시계 바늘 쪽 조각, grid = rows × cols 칸, hex = 육각형(3 마름모·6 삼각형). 색칠은 주황
const SHADE = { fill: "#ffa94d", line: "#333" };
function fshapeFigure(f) {
  const on = new Set(f.shaded || []), color = TONE[f.tone || "given"];
  const piece = (i, d) => `<path d="${d}" fill="${on.has(i) ? SHADE.fill : "#fffdf7"}" stroke="${SHADE.line}" stroke-width="1.8" stroke-linejoin="round"/>`;
  let body = "", W = 170, H = 170;
  if (f.shape === "circle") {
    const C = 85, R = 72, P = (a) => [C + R * Math.sin(a), C - R * Math.cos(a)];
    for (let i = 0; i < f.parts; i++) { const a0 = (2 * Math.PI * i) / f.parts, a1 = (2 * Math.PI * (i + 1)) / f.parts, [x0, y0] = P(a0), [x1, y1] = P(a1); body += f.parts === 1 ? piece(i, `M${C - R} ${C}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0`) : piece(i, `M${C} ${C}L${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}Z`); }
  } else if (f.shape === "grid") {
    const s = Math.min(36, 220 / f.cols); W = f.cols * s + 8; H = f.rows * s + 8;
    for (let r = 0; r < f.rows; r++) for (let c = 0; c < f.cols; c++) { const x = 4 + c * s, y = 4 + r * s; body += piece(r * f.cols + c, `M${x} ${y}h${s}v${s}h${-s}Z`); }
  } else {
    const C = 85, R = 74, V = Array.from({ length: 6 }, (_, i) => [C + R * Math.cos((Math.PI / 3) * i - Math.PI / 2), C + R * Math.sin((Math.PI / 3) * i - Math.PI / 2)]);
    const pt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
    if (f.parts === 3) for (let i = 0; i < 3; i++) body += piece(i, `M${C} ${C}L${pt(V[2 * i])}L${pt(V[2 * i + 1])}L${pt(V[(2 * i + 2) % 6])}Z`);
    else for (let i = 0; i < 6; i++) body += piece(i, `M${C} ${C}L${pt(V[i])}L${pt(V[(i + 1) % 6])}Z`);
  }
  return `<div class="tx-fshape" style="--tone:${color}">${svg(W, H, body, `같은 크기 ${f.parts}조각 중 ${on.size}조각 색칠`)}</div>`;
}
// fbar: 띠를 parts칸으로. shaded = 색칠, crossed = 지운 칸(×), counts = 칸 안의 수, sub = { from, to, parts, crossed, counts } 몇 칸을 묶어 다시 나눔, brace = 밑 꺾쇠
function fbarFigure(f) {
  const color = TONE[f.tone || "given"], W = 320, x0 = 10, w = (W - 20) / f.parts, y = 10, h = 38, sh = new Set(f.shaded || []), cr = new Set(f.crossed || []);
  const sub = f.sub;
  let body = "";
  const cross = (x, y0, ww, hh) => `<path d="M${x + 5} ${y0 + 5}L${x + ww - 5} ${y0 + hh - 5}M${x + ww - 5} ${y0 + 5}L${x + 5} ${y0 + hh - 5}" stroke="#e8503a" stroke-width="2.2" stroke-linecap="round"/>`;
  for (let i = 0; i < f.parts; i++) {
    const x = x0 + i * w;
    if (sub && i > sub.from && i <= sub.to) continue;
    body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${sh.has(i) ? SHADE.fill : cr.has(i) ? "#efe9dd" : "#fffdf7"}" stroke="${SHADE.line}" stroke-width="1.8"/>`;
    if (cr.has(i)) body += cross(x, y, w, h);
    if (sub && i === sub.from) {
      const sw = (w * (sub.to - sub.from + 1)) / sub.parts, sc = new Set(sub.crossed || []);
      for (let k = 0; k < sub.parts; k++) { const sx = x + k * sw; body += `<rect x="${sx}" y="${y}" width="${sw}" height="${h}" fill="${sc.has(k) ? "#efe9dd" : "#fff3c4"}" stroke="${SHADE.line}" stroke-width="1.2"/>`; if (sc.has(k)) body += cross(sx, y, sw, h); if (sub.counts?.[k]) body += text(sx + sw / 2, y + h / 2, sub.counts[k], { size: 12, weight: 900 }); }
    } else if (f.counts?.[i]) body += text(x + w / 2, y + h / 2, f.counts[i], { size: 14, weight: 900 });
  }
  let H = y + h + 8;
  if (f.brace) { const xa = x0 + f.brace.from * w, xb = x0 + (f.brace.to + 1) * w, by = y + h + 10; body += `<path d="M${xa + 2} ${by} V${by + 8} H${xb - 2} V${by}" fill="none" stroke="#f39a1e" stroke-width="2.2"/>${text((xa + xb) / 2, by + 20, f.brace.label, { size: 13, weight: 900, fill: color })}`; H = by + 32; }
  return `<div class="tx-fbar">${svg(W, H, body, `띠를 ${f.parts}칸으로 나눈 그림`)}</div>`;
}
// agrid: 모눈 위 다각형. marks.full 칸에 「1」, marks.half 칸에 「반」, frame = 틀(점선), tris = 틀에서 뺄 삼각형(보라 빗금 + 번호)
function agridFigure(f) {
  const color = TONE[f.tone || "given"], s = Math.min(32, 290 / f.w, 230 / f.h), pad = 6, W = f.w * s + pad * 2, H = f.h * s + pad * 2, P = ([x, y]) => `${(pad + x * s).toFixed(1)},${(pad + y * s).toFixed(1)}`;
  let body = "";
  for (let i = 0; i <= f.w; i++) body += `<line x1="${pad + i * s}" y1="${pad}" x2="${pad + i * s}" y2="${pad + f.h * s}" stroke="#d8d2c4" stroke-width="1"/>`;
  for (let j = 0; j <= f.h; j++) body += `<line x1="${pad}" y1="${pad + j * s}" x2="${pad + f.w * s}" y2="${pad + j * s}" stroke="#d8d2c4" stroke-width="1"/>`;
  for (const pts of f.polys) body += `<polygon points="${pts.map(P).join(" ")}" fill="${SHADE.fill}" fill-opacity="0.85" stroke="${SHADE.line}" stroke-width="2" stroke-linejoin="round"/>`;
  for (const t of f.tris || []) { const cx = t.pts.reduce((a, p) => a + p[0], 0) / 3, cy = t.pts.reduce((a, p) => a + p[1], 0) / 3; body += `<polygon points="${t.pts.map(P).join(" ")}" fill="#ece0fb" stroke="#8e5bd8" stroke-width="1.6"/>${text(pad + cx * s, pad + cy * s, t.label, { size: 13, weight: 900, fill: "#5b2fa8" })}`; }
  if (f.frame) { const [x0, y0, x1, y1] = f.frame; body += `<rect x="${pad + x0 * s}" y="${pad + y0 * s}" width="${(x1 - x0) * s}" height="${(y1 - y0) * s}" fill="none" stroke="#8e5bd8" stroke-width="2.4" stroke-dasharray="6 4"/>`; }
  for (const [c, r] of f.marks?.full || []) body += text(pad + (c + 0.5) * s, pad + (r + 0.5) * s, "1", { size: 11, weight: 900, fill: color });
  for (const [c, r] of f.marks?.half || []) body += text(pad + (c + 0.5) * s, pad + (r + 0.5) * s, "반", { size: 10, weight: 900, fill: "#5b2fa8" });
  return `<div class="tx-agrid">${svg(W, H, body, `모눈 ${f.w}×${f.h} 위의 도형`)}</div>`;
}
// nest: 정사각형과 마름모를 번갈아 겹친 그림. 0 = 가장 바깥 정사각형. labels = { 몇째: 넓이 }
function nestFigure(f) {
  const color = TONE[f.tone || "given"], C = 100, hi = new Set(f.hi || []);
  let body = "", half = 86;
  for (let k = 0; k < f.n; k++) {
    const sq = k % 2 === 0, pts = sq ? [[C - half, C - half], [C + half, C - half], [C + half, C + half], [C - half, C + half]] : [[C, C - half], [C + half, C], [C, C + half], [C - half, C]];
    const lab = f.labels?.[k];
    body += `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${hi.has(k) ? SHADE.fill : k % 2 ? "#fff3c4" : "#fffdf7"}" stroke="${hi.has(k) ? color : "#333"}" stroke-width="${hi.has(k) ? 2.6 : 1.8}"/>`;
    if (lab !== undefined) body += text(sq ? C - half + 14 : C, sq ? C - half + 12 : C - half + 14, lab, { size: 12, weight: 900, fill: lab === "?" ? "#5b2fa8" : "#222" });
    if (!sq) half /= 2;
  }
  return `<div class="tx-nest">${svg(C * 2, C * 2, body, `정사각형과 마름모 ${f.n}겹`)}</div>`;
}
// 4권 돌리기·뒤집기: 숫자 모양·기호·디지털 숫자는 원본 그림과 같은 4권 그리기 함수로
const OP_ICON = { LR: { type: "axis", axis: "vertical" }, UD: { type: "axis", axis: "horizontal" }, R180: { type: "rotate", deg: 180, dir: "cw" }, CW: { type: "rotate", deg: 90, dir: "cw" }, CCW: { type: "rotate", deg: 90, dir: "ccw" } };
const CIRCLED_NO = "①②③④⑤⑥⑦⑧";
function seg7Figure(f) {
  return `<div class="tx-seg7">${f.rows.map((r) => `<div><small>${esc(r.label)}</small>${sevenSegNumber(r.number, 46)}</div>`).join("")}</div>`;
}
function glyphsFigure(f) {
  const row = `<div class="b4-digit-row">${digitGlyph(f.digit, f.start || "I")}${f.ops.map((s) => `<span class="b4-step-op">${opIcon(OP_ICON[s.op])}</span>${s.show ? digitGlyph(f.digit, s.show) : '<span class="b4-digit-box"></span>'}`).join("")}</div>`;
  const opts = f.options ? `<div class="tx-glyph-opts">${f.options.map((t, i) => `<span class="${f.hi === i ? "on" : ""}"><b>${CIRCLED_NO[i]}</b>${digitGlyph(f.digit, t)}</span>`).join("")}</div>` : "";
  return `<div class="tx-glyphs" style="--tone:${TONE[f.tone || "given"]}">${row}${opts}</div>`;
}
function uprightFigure(f) {
  return `<div class="tx-upright" style="--tone:${TONE[f.tone || "given"]}">${f.cells.map((c, i) => `<span class="${f.hi?.[i] ? "on" : ""}">${digitGlyph(c.value, c.t)}</span>`).join("")}</div>`;
}
// fold: n × n 색종이. region = 접고 남은 칸(나머지는 흐리게), cut = 자르는(색칠한) 칸, line = 다음에 접을 선과 넘어가는 방향, holes = 구멍 점
function foldFigure(f) {
  const color = TONE[f.tone || "given"], n = f.n, s = n === 2 ? 50 : 36, pad = 20, W = n * s + pad * 2, region = f.region ? new Set(f.region) : null, cut = new Set(f.cut || []);
  // 접고 남은 종이의 실제 모양: 정사각형을 접기마다 남는 쪽 반평면으로 자른다(대각선으로 접으면 삼각형)
  let poly = [[0, 0], [n, 0], [n, n], [0, n]];
  const keep = { R: (p, k) => p[0] - k, L: (p, k) => k - p[0], D: (p, k) => p[1] - k, U: (p, k) => k - p[1], DIAG: (p) => p[1] - p[0], ANTI: (p) => p[0] + p[1] - n };
  for (const fd of f.done || []) { const g = (p) => keep[fd.t](p, fd.at ?? n / 2), out = []; poly.forEach((p, i) => { const q = poly[(i + 1) % poly.length], a = g(p), b = g(q); if (a >= 0) out.push(p); if ((a >= 0) !== (b >= 0)) out.push([p[0] + ((q[0] - p[0]) * a) / (a - b), p[1] + ((q[1] - p[1]) * a) / (a - b)]); }); poly = out; }
  const P = (pts) => pts.map(([x, y]) => `${(pad + x * s).toFixed(1)},${(pad + y * s).toFixed(1)}`).join(" "), clipId = `fold-clip-${Math.random().toString(36).slice(2, 8)}`;
  let body = "", inside = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const k = `${r},${c}`, x = pad + c * s, y = pad + r * s;
    body += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${cut.has(k) && region ? "#f4f1ea" : "#f4f1ea"}" stroke="#d8d2c4" stroke-width="1" stroke-dasharray="3 3"/>`;
  }
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const k = `${r},${c}`, inR = !region || region.has(k), x = pad + c * s, y = pad + r * s;
    if (!inR && !cut.has(k)) continue;
    inside += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${cut.has(k) ? SHADE.fill : "#fff3c4"}" stroke="#a8741a" stroke-width="1.6"/>`;
    if (f.labels) inside += text(x + s / 2, y + s / 2, f.labels[r][c], { size: n === 2 ? 18 : 14, weight: 900 });
  }
  body += f.done?.length ? `<clipPath id="${clipId}"><polygon points="${P(poly)}"/></clipPath><g clip-path="url(#${clipId})">${inside}</g><polygon points="${P(poly)}" fill="none" stroke="#a8741a" stroke-width="2.2"/>` : inside;
  if (f.line) {
    const L = f.line, at = (L.at ?? n / 2) * s + pad, end = pad + n * s;
    const seg = L.t === "R" || L.t === "L" ? [at, pad - 8, at, end + 8] : L.t === "D" || L.t === "U" ? [pad - 8, at, end + 8, at] : L.t === "DIAG" ? [pad, pad, end, end] : [end, pad, pad, end];
    body += `<line x1="${seg[0]}" y1="${seg[1]}" x2="${seg[2]}" y2="${seg[3]}" stroke="#8e5bd8" stroke-width="2.6" stroke-dasharray="7 5"/>`;
    const mid = pad + (n * s) / 2, q = (n * s) / 4, dir = { R: [-q, 0, q, 0], L: [q, 0, -q, 0], D: [0, -q, 0, q], U: [0, q, 0, -q], DIAG: [q, -q, -q, q], ANTI: [-q, -q, q, q] }[L.t];
    const ax = L.t === "R" || L.t === "L" ? at : mid, ay = L.t === "D" || L.t === "U" ? at : mid, [x1, y1, x2, y2] = [ax + dir[0] * 0.9, ay + dir[1] * 0.9, ax + dir[2] * 0.9, ay + dir[3] * 0.9];
    body += `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + (dir[1] ? 14 : 0)} ${(y1 + y2) / 2 - (dir[0] ? 14 : 0)} ${x2} ${y2}" fill="none" stroke="#e8503a" stroke-width="2.6" marker-end="url(#fold-tip)"/>`;
  }
  for (const [x, y] of f.holes || []) body += `<circle cx="${pad + x * s}" cy="${pad + y * s}" r="${s * 0.16}" fill="#fff" stroke="#222" stroke-width="2"/>`;
  const defs = `<defs><marker id="fold-tip" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#e8503a"/></marker></defs>`;
  return `<div class="tx-fold" style="--tone:${color}">${svg(W, W, defs + body, `${n}×${n} 색종이`)}</div>`;
}
// minos: 정사각형을 붙인 모양 여러 개. group[i] = 같은 종류 번호(-1이면 아직), 종류마다 색
const MINO_COLOR = ["#ffa94d", "#7cc4ff", "#9be28f", "#e3b5ff"];
function minosFigure(f) {
  const s = 16;
  return `<div class="tx-minos">${f.shapes.map((cells, i) => { const R = Math.max(...cells.map((p) => p[0])) + 1, C = Math.max(...cells.map((p) => p[1])) + 1, g = f.group?.[i] ?? -1; const body = cells.map(([r, c]) => `<rect x="${2 + c * s}" y="${2 + r * s}" width="${s}" height="${s}" fill="${g >= 0 ? MINO_COLOR[g % 4] : "#fff3c4"}" stroke="#333" stroke-width="1.5"/>`).join(""); return `<figure>${svg(C * s + 4, R * s + 4, body, `${i + 1}번 모양`)}<figcaption>${i + 1}번</figcaption></figure>`; }).join("")}</div>`;
}
// fracs: 위아래로 쌓은 분수 카드. [분자, 분모] — null은 빈칸
function fracsFigure(f) {
  const color = TONE[f.tone || "given"], hi = new Set(f.hi || []);
  return `<div class="tx-fracs" style="--tone:${color}">${f.list.map(([n, d], i) => `<span class="${hi.has(i) ? "on" : ""}">${frac(n, d)}</span>`).join('<small>=</small>')}</div>`;   // 분수는 공통 수식(null = 빈칸)
}
// 4·9권 쌓기나무: 원본과 같은 빗각 그림(book04-renderers). b4-layers = 층별로 위에서 본 칸
function b4LayersFigure(f) {
  return `<div class="tx-layers">${f.layers.map((L, k) => `<figure><div style="--cols:${L[0].length}">${L.flat().map((v) => `<span class="${v ? "on" : ""}"></span>`).join("")}</div><figcaption>${k + 1}층</figcaption></figure>`).join("")}</div>`;
}
// strip: 마법카드 칸 줄(rows 여러 줄이면 같은 값 칸이 위아래로). w = 칸의 값("?"면 빈칸), on = 색칠, total = 색칠한 칸의 합
function stripFigure(f) {
  const color = TONE[f.tone || "given"];
  const rows = f.rows.map((row) => `<div>${row.map((c) => `<span class="${c.on ? "on" : c.w === "?" ? "ask" : ""}">${esc(c.w === "?" ? "□" : c.w)}</span>`).join("")}</div>`).join("");
  return `<div class="tx-strip" style="--tone:${color}">${rows}${f.total !== undefined ? `<b>= ${esc(f.total)}</b>` : ""}</div>`;
}
// pieces: 같은 길이의 막대를 줄마다 n조각으로. len = 오른쪽에 쓰는 길이(null이면 「?」)
function piecesFigure(f) {
  const color = TONE[f.tone || "given"], x0 = 64, w = 200, W = x0 + w + 64, H = f.rows.length * 38 + 8;
  let body = "";
  f.rows.forEach((r, i) => {
    const y = 6 + i * 38, cell = w / r.n, fill = i === 0 ? "#ffd45c" : i === 1 ? "#dcf5e5" : "#dde9ff", line = i === 0 ? "#a8741a" : i === 1 ? SHAPE.triangle.line : SHAPE.square.line;
    body += text(x0 - 8, y + 13, r.label, { size: 13, weight: 900, anchor: "end" });
    for (let k = 0; k < r.n; k++) body += `<rect x="${x0 + k * cell}" y="${y}" width="${cell}" height="26" rx="${r.n > 20 ? 1 : 4}" fill="${fill}" stroke="${line}" stroke-width="1.4"/>`;
    body += text(x0 + w + 8, y + 13, r.len === null || r.len === undefined ? "?" : r.len, { size: 12, weight: 900, fill: r.len === null || r.len === undefined ? "#5b2fa8" : color, anchor: "start" });
  });
  return `<div class="tx-pieces">${svg(W, H, body, f.rows.map((r) => `${r.label} ${r.n}조각`).join(", "))}</div>`;
}
// sudoku: n × n 칸(4×4는 굵은 선으로 네 칸 구역). cells = 수 또는 알파벳, filled = 채운 빈칸, hi = 방금 채운 칸
function sudokuFigure(f) {
  const color = TONE[f.tone || "given"], filled = new Set(f.filled || []), hi = new Set(f.hi || []);
  const cells = f.cells.map((v, i) => {
    const r = Math.floor(i / f.n), c = i % f.n, cls = [/^\d$/u.test(v) ? (filled.has(i) ? "got" : "") : "letter", f.n === 4 && c === 1 ? "br" : "", f.n === 4 && r === 1 ? "bb" : "", hi.has(i) ? "on" : ""].filter(Boolean).join(" ");
    return `<span class="${cls}">${esc(v)}</span>`;
  }).join("");
  return `<div class="tx-sudoku" style="--tone:${color};--n:${f.n}" role="img" aria-label="${f.n}×${f.n} 스도쿠">${cells}</div>`;
}

// ───── 2권 수: 가르기 나무 · 단계 표 · 성냥개비 · 숫자 마름모 ─────
function treeFigure(f) {
  const color = TONE[f.tone || "given"];
  return `<div class="tx-tree" style="--tone:${color}">${f.levels.map((lv, i) => `${i ? `<i>${lv.map(() => "↙↘").slice(0, 1)}</i>` : ""}<div>${lv.map((v) => `<span class="${v === null ? "ask" : ""}">${v === null ? "?" : v}</span>`).join("")}</div>`).join("")}</div>`;
}
function stagesFigure(f) {
  const color = TONE[f.tone || "given"];
  return `<div class="tx-stages" style="--tone:${color}">${f.stages.map((g, k) => `<div><small>${k + 1}단계</small><table>${g.map((row) => `<tr>${row.map((v) => `<td class="${v === null ? "ask" : ""}">${v === null ? "?" : v}</td>`).join("")}</tr>`).join("")}</table></div>`).join("")}</div>`;
}
// match-row: 성냥개비 정사각형 n개를 한 줄로(겹치는 변은 함께 씀)
function matchRowFigure(f) {
  const color = TONE[f.tone || "given"], s = 26, W = f.n * s + 20, H = s + 30;
  let body = "";
  const stick = (x1, y1, x2, y2, on) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on ? color : "#c97a2b"}" stroke-width="4" stroke-linecap="round"/>`;
  for (let i = 0; i < f.n; i++) { const x = 10 + i * s, on = f.hi === i; body += stick(x, 8, x + s, 8, on) + stick(x, 8 + s, x + s, 8 + s, on) + stick(x + s, 8, x + s, 8 + s, on); if (i === 0) body += stick(x, 8, x, 8 + s, false); }
  if (f.caption) body += text(W / 2, H - 6, f.caption, { size: 12, weight: 900, fill: color });
  return `<div class="tx-match">${svg(W, H, body, `성냥개비 정사각형 ${f.n}개`)}</div>`;
}
// diamonds: 숫자 마름모 여러 개 { top, left, right, bottom }(null = 「?」)
function diamondsFigure(f) {
  const color = TONE[f.tone || "given"];
  const one = (d, ask) => `<div class="dm${ask ? " ask" : ""}"><b class="t">${d.top ?? "?"}</b><b class="l">${d.left}</b><b class="r">${d.right}</b><b class="b">${d.bottom}</b></div>`;
  return `<div class="tx-diamonds" style="--tone:${color}">${f.items.map((d) => one(d, d.top === null)).join("")}</div>`;
}

// ───── 최단거리: 점(행, 열) 격자. edges = 갈 수 있는 길 [[r1, c1, r2, c2]](없으면 모든 길), diags = 대각선이 있는 칸 [r, c](왼쪽 위 → 오른쪽 아래),
// counts = { "r,c": 그 점까지 오는 가짓수 }, points = { 이름: [r, c] } ─────
function routeFigure(f) {
  const color = TONE[f.tone || "given"], gap = Math.min(52, 240 / Math.max(f.rows, f.cols)), pad = 22, W = f.cols * gap + pad * 2, H = f.rows * gap + pad * 2;
  const X = (c) => pad + c * gap, Y = (r) => pad + r * gap;
  const all = []; for (let r = 0; r <= f.rows; r++) for (let c = 0; c <= f.cols; c++) { if (c < f.cols) all.push([r, c, r, c + 1]); if (r < f.rows) all.push([r, c, r + 1, c]); }
  const ok = new Set((f.edges || all).map((e) => e.join()));
  let body = "";
  for (const e of all) body += `<line x1="${X(e[1])}" y1="${Y(e[0])}" x2="${X(e[3])}" y2="${Y(e[2])}" stroke="${ok.has(e.join()) ? "#566274" : "#e3dccb"}" stroke-width="${ok.has(e.join()) ? (f.edges ? 4 : 2.5) : 1.5}" stroke-linecap="round"/>`;
  for (const [r, c] of f.diags || []) body += `<line x1="${X(c)}" y1="${Y(r)}" x2="${X(c + 1)}" y2="${Y(r + 1)}" stroke="${f.hiDiag ? color : "#566274"}" stroke-width="3.5" stroke-linecap="round"/>`;
  // 이름 점 위에 가짓수를 그린다(가짓수가 있는 점은 검은 점을 그리지 않는다)
  for (const [name, [r, c]] of Object.entries(f.points || {})) body += `${f.counts?.[`${r},${c}`] === undefined ? `<circle cx="${X(c)}" cy="${Y(r)}" r="4" fill="#222"/>` : ""}${text(X(c) + (c === 0 ? -14 : 14), Y(r) + (r === 0 ? -13 : 13), name, { size: 14, weight: 900, fill: "#e8503a" })}`;
  for (const [k, n] of Object.entries(f.counts || {})) { const [r, c] = k.split(",").map(Number); body += `<circle cx="${X(c)}" cy="${Y(r)}" r="10" fill="#fff" stroke="${color}" stroke-width="1.5"/>${text(X(c), Y(r), n, { size: n > 99 ? 9 : 11, weight: 900, fill: color })}`; }
  return `<div class="tx-route">${svg(W, H, body, `${f.rows}×${f.cols} 길`)}</div>`;
}
// roads: 출발 → 갈림 점들 → 도착, 구간마다 길 수(ways). 길은 곡선 여러 개
function roadsFigure(f) {
  const color = TONE[f.tone || "given"], seg = 110, W = f.ways.length * seg + 60, H = 120, names = ["출발", ...f.stops, "도착"];
  let body = "";
  f.ways.forEach((n, i) => { const x1 = 30 + i * seg, x2 = x1 + seg; for (let k = 0; k < n; k++) { const bend = (k - (n - 1) / 2) * 26; body += `<path d="M${x1} 60 Q${(x1 + x2) / 2} ${60 + bend * 1.6} ${x2} 60" fill="none" stroke="${f.hi === i ? color : "#566274"}" stroke-width="3"/>`; } body += text((x1 + x2) / 2, 14, `${n}가지`, { size: 12, weight: 900, fill: f.hi === i ? color : "#566274" }); });
  names.forEach((nm, i) => { const x = 30 + i * seg; body += `<circle cx="${x}" cy="60" r="7" fill="#222"/>${text(x, 104, nm, { size: 12, weight: 900 })}`; });
  return `<div class="tx-route">${svg(W, H, body, "갈림길 지도")}</div>`;
}

// ───── 시계 읽기: 시침·분침(hi = "hour" | "minute"이면 그 바늘을 안내 색) ─────
function analogFigure(f) {
  const color = TONE[f.tone || "given"], C = 90, R = 74;
  let body = `<circle cx="${C}" cy="${C}" r="${R}" fill="#fff" stroke="#566274" stroke-width="3"/>`;
  for (let k = 0; k < 60; k++) { const a = (k * 6 - 90) * Math.PI / 180, r1 = k % 5 ? R - 5 : R - 9; body += `<line x1="${C + r1 * Math.cos(a)}" y1="${C + r1 * Math.sin(a)}" x2="${C + R * Math.cos(a)}" y2="${C + R * Math.sin(a)}" stroke="#566274" stroke-width="${k % 5 ? 1 : 2}"/>`; }
  for (let n = 1; n <= 12; n++) { const a = (n * 30 - 90) * Math.PI / 180; body += text(C + (R - 20) * Math.cos(a), C + (R - 20) * Math.sin(a), n, { size: 14, weight: 900 }); }
  const hand = (deg, len, w, on) => { const a = (deg - 90) * Math.PI / 180; return `<line x1="${C}" y1="${C}" x2="${C + len * Math.cos(a)}" y2="${C + len * Math.sin(a)}" stroke="${on ? color : "#222"}" stroke-width="${w}" stroke-linecap="round"/>`; };
  body += hand((f.h % 12) * 30 + f.m * 0.5, 40, 6, f.hi === "hour") + hand(f.m * 6, 60, 3.5, f.hi === "minute") + `<circle cx="${C}" cy="${C}" r="5" fill="#222"/>`;
  return `<div class="tx-analog">${svg(C * 2, C * 2, body, "시계")}</div>`;
}
// ───── 벤 다이어그램: 두 원(labels), 칸 수 a(왼쪽만) · both · b(오른쪽만) · out(바깥), null은 「?」, undefined는 비움 ─────
function vennFigure(f) {
  const color = TONE[f.tone || "given"], W = 300, H = 170;
  const v = (x) => (x === null ? "?" : x === undefined ? "" : `${x}명`);
  let body = f.universe ? `<rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="10" fill="#fffdf7" stroke="#c9c2b4" stroke-width="2"/>` : "";
  body += `<circle cx="115" cy="88" r="62" fill="${SHAPE.circle.fill}" fill-opacity="0.75" stroke="${SHAPE.circle.line}" stroke-width="2.5"/><circle cx="185" cy="88" r="62" fill="${SHAPE.square.fill}" fill-opacity="0.75" stroke="${SHAPE.square.line}" stroke-width="2.5"/>`;
  body += text(95, 20, f.labels[0], { size: 13, weight: 900, fill: SHAPE.circle.line }) + text(205, 20, f.labels[1], { size: 13, weight: 900, fill: SHAPE.square.line });
  body += text(85, 92, v(f.a), { size: 14, weight: 900, fill: f.a === null ? "#5b2fa8" : "#222" }) + text(150, 92, v(f.both), { size: 14, weight: 900, fill: f.both === null ? "#5b2fa8" : f.hi === "both" ? color : "#222" }) + text(215, 92, v(f.b), { size: 14, weight: 900, fill: f.b === null ? "#5b2fa8" : "#222" });
  if (f.universe) body += text(W - 40, H - 18, v(f.out), { size: 13, weight: 900, fill: f.out === null ? "#5b2fa8" : "#566274" });
  if (f.note) body += text(W / 2, H - 6, f.note, { size: 11, weight: 800, fill: color });
  return `<div class="tx-venn">${svg(W, H, body, `${f.labels.join("과 ")} 벤 다이어그램`)}</div>`;
}
// ───── 막대: rows = [{ label, units, len? }], 한 칸 = 기준(unit). 칸마다 눈금, len이 있으면 오른쪽에 길이 ─────
function unitBarsFigure(f) {
  const color = TONE[f.tone || "given"], max = Math.max(...f.rows.map((r) => r.units)), cell = Math.min(34, 220 / max), x0 = 44, W = x0 + max * cell + 60, H = f.rows.length * 40 + 10;
  let body = "";
  f.rows.forEach((r, i) => {
    const y = 10 + i * 40;
    body += text(x0 - 10, y + 12, r.label, { size: 14, weight: 900, anchor: "end" });
    for (let k = 0; k < r.units; k++) body += `<rect x="${x0 + k * cell}" y="${y}" width="${cell}" height="24" fill="${i === 0 ? "#ffd45c" : "#dcf5e5"}" stroke="${i === 0 ? "#a8741a" : SHAPE.triangle.line}" stroke-width="1.5"${f.ticks === false ? "" : ""}/>`;
    if (r.len !== undefined) body += text(x0 + r.units * cell + 26, y + 12, r.len === null ? "?" : r.len, { size: 13, weight: 900, fill: r.len === null ? "#5b2fa8" : color });
  });
  return `<div class="tx-bars">${svg(W, H, body, f.rows.map((r) => `${r.label} ${r.units}칸`).join(", "))}</div>`;
}
// ───── 접힌 테이프: 모눈 위의 꺾은선(pts, 칸 단위). 부분마다 길이를 쓴다 ─────
function tapeFigure(f) {
  const color = TONE[f.tone || "given"], xs = f.pts.map((p) => p[0]), ys = f.pts.map((p) => p[1]), cell = 30, pad = 24;
  const W = (Math.max(...xs) + 1) * cell + pad * 2, H = (Math.max(...ys) + 1) * cell + pad * 2, X = (x) => pad + x * cell, Y = (y) => pad + y * cell;
  let body = "";
  for (let x = 0; x <= Math.max(...xs) + 1; x++) body += `<line x1="${X(x)}" y1="${pad}" x2="${X(x)}" y2="${H - pad}" stroke="#ece4d6"/>`;
  for (let y = 0; y <= Math.max(...ys) + 1; y++) body += `<line x1="${pad}" y1="${Y(y)}" x2="${W - pad}" y2="${Y(y)}" stroke="#ece4d6"/>`;
  body += `<polyline points="${f.pts.map((p) => `${X(p[0])},${Y(p[1])}`).join(" ")}" fill="none" stroke="#f39a1e" stroke-width="10" stroke-linejoin="round" stroke-linecap="butt" opacity="0.85"/>`;
  if (f.labels) f.pts.slice(1).forEach((p, i) => { const q = f.pts[i], mx = (X(p[0]) + X(q[0])) / 2, my = (Y(p[1]) + Y(q[1])) / 2, len = Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]); body += text(mx + (p[1] === q[1] ? 0 : 14), my + (p[1] === q[1] ? -12 : 0), `${len}`, { size: 12, weight: 900, fill: color }); });
  return `<div class="tx-tape">${svg(W, H, body, "접힌 색테이프")}</div>`;
}

export function figureMarkup(figure) {
  if (!figure) return "";
  if (figure.kind === "analog") return analogFigure(figure);
  if (figure.kind === "venn") return vennFigure(figure);
  if (figure.kind === "unit-bars") return unitBarsFigure(figure);
  if (figure.kind === "tape") return tapeFigure(figure);
  if (figure.kind === "route") return routeFigure(figure);
  if (figure.kind === "roads") return roadsFigure(figure);
  if (figure.kind === "tree") return treeFigure(figure);
  if (figure.kind === "stages") return stagesFigure(figure);
  if (figure.kind === "match-row") return matchRowFigure(figure);
  if (figure.kind === "diamonds") return diamondsFigure(figure);
  if (figure.kind === "mgrid") return mgridFigure(figure);
  if (figure.kind === "line-board") return lineBoardFigure(figure);
  if (figure.kind === "sudoku") return sudokuFigure(figure);
  if (figure.kind === "strip") return stripFigure(figure);
  if (figure.kind === "b4-cubes") return `<div class="tx-b4">${obliqueCubes(figure.map, { s: figure.map.length * figure.map[0].length > 9 ? 28 : 34, labels: !!figure.labels, walls: !!figure.walls })}</div>`;
  if (figure.kind === "b4-box") return `<div class="tx-b4">${book04Markup({ kind: "book4", subtype: "source-cube-box", dimensions: figure.dims, map: figure.map })}</div>`;
  if (figure.kind === "b4-pair") return `<div class="tx-b4">${book04Markup({ kind: "book4", subtype: "source-hidden-cube", figures: figure.figures })}</div>`;
  if (figure.kind === "b4-layers") return b4LayersFigure(figure);
  if (figure.kind === "nline") return nlineFigure(figure);
  if (figure.kind === "fracs") return fracsFigure(figure);
  if (figure.kind === "fshape") return fshapeFigure(figure);
  if (figure.kind === "fbar") return fbarFigure(figure);
  if (figure.kind === "agrid") return agridFigure(figure);
  if (figure.kind === "nest") return nestFigure(figure);
  if (figure.kind === "seg7") return seg7Figure(figure);
  if (figure.kind === "glyphs") return glyphsFigure(figure);
  if (figure.kind === "upright") return uprightFigure(figure);
  if (figure.kind === "fold") return foldFigure(figure);
  if (figure.kind === "minos") return minosFigure(figure);
  if (figure.kind === "pieces") return piecesFigure(figure);
  if (figure.kind === "ring") return ringFigure(figure);
  if (figure.kind === "crypt") return cryptFigure(figure);
  if (figure.kind === "slots") return slotsFigure(figure);
  if (figure.kind === "row-line") return rowLineFigure(figure);
  if (figure.kind === "compass") return compassFigure(figure);
  if (figure.kind === "round") return roundFigure(figure);
  if (figure.kind === "ox") return oxFigure(figure);
  if (figure.kind === "eqs") return eqsFigure(figure);
  if (figure.kind === "num-cards") return numCardsFigure(figure);
  if (figure.kind === "poly") return polyFigure(figure);
  if (figure.kind === "dots") return dotsFigure(figure);
  if (figure.kind === "seq") return seqFigure(figure);
  if (figure.kind === "stone-rows") return stoneRowsFigure(figure);
  if (figure.kind === "hand") return handFigure(figure);
  if (figure.kind === "fan") return fanFigure(figure);
  if (figure.kind === "odd-rows") return oddRowsFigure(figure);
  if (figure.kind === "tri-layers") return triLayersFigure(figure);
  if (figure.kind === "cal-grid") return calGridFigure(figure);
  if (figure.kind === "month-days") return monthDaysFigure(figure);
  if (figure.kind === "day-ladder") return dayLadderFigure(figure);
  if (figure.kind === "equal-bars") return equalBarsFigure(figure);
  if (figure.kind === "age-rows") return ageRowsFigure(figure);
  if (figure.kind === "split-box") return splitBoxFigure(figure);
  if (figure.kind === "op-chain") return opChainFigure(figure);
  if (figure.kind === "give-table") return giveTableFigure(figure);
  if (figure.kind === "digit-groups") return digitGroupsFigure(figure);
  if (figure.kind === "digit-grid") return digitGridFigure(figure);
  if (figure.kind === "bundle") return bundleFigure(figure);
  if (figure.kind === "stones") return stonesFigure(figure);
  if (figure.kind === "stones-blank") return `<p class="tx-think">바둑돌 ${esc(figure.total)}개로 ${figure.shape === "triangle" ? "정삼각형" : "정사각형"}을 만들었어요. 한 변에 몇 개씩일지 그려 보며 생각해요.</p>`;
  if (figure.kind === "plot") return plotFigure(figure);
  if (figure.kind === "lake") return lakeFigure(figure);
  if (figure.kind === "dist-line") return distLineFigure(figure);
  if (figure.kind === "quad") return quadFigure(figure);
  if (figure.kind === "quad-gallery") return quadGalleryFigure(figure);
  if (figure.kind === "time-col") return timeColFigure(figure);
  if (figure.kind === "circles") return circlesFigure(figure);
  if (figure.kind === "circles-story") return `<p class="tx-think">${esc(figure.note)}</p>`;
  if (figure.kind === "shape-eq") return shapeEqFigure(figure);
  if (figure.kind === "consec") return consecFigure(figure);
  if (figure.kind === "cube-views") return cubeViewsFigure(figure);
  if (figure.kind === "cube-map") return cubeMapFigure(figure);
  if (figure.kind === "magic") return magicFigure(figure);
  if (figure.kind === "clock") return clockFigure(figure);
  if (figure.kind === "balance") return balanceFigure(figure);
  return "";
}

// view: { type, example, step, seen: Set("t:e") }
export function typeExamplesMarkup(groups, view) {
  if (!groups.length) return '<p class="tx-empty">이 레슨의 예제를 준비하고 있어요.</p>';
  const group = groups[view.type] || groups[0];
  const ex = group.examples[view.example] || group.examples[0];
  const types = groups.map((g, i) => {
    const done = g.examples.some((_, e) => view.seen.has(`${i}:${e}`));
    return `<button type="button" class="tx-type${i === view.type ? " active" : ""}${done ? " done" : ""}" data-tx-type="${i}" aria-pressed="${i === view.type}"><b>${done ? "✓" : i + 1}</b><span>${esc(g.typeLabel)}</span><small>골든벨 ${g.count}문제</small></button>`;
  }).join("");
  if (!ex) return `<section class="tx"><nav class="tx-types" aria-label="문제 유형">${types}</nav><p class="tx-empty">이 유형의 예제를 준비하고 있어요.</p></section>`;
  const step = Math.max(0, Math.min(view.step, ex.steps.length));
  const figure = step === 0 ? ex.figure : ex.steps[step - 1].figure || ex.steps.slice(0, step).reverse().find((s) => s.figure)?.figure || ex.figure;
  const shown = ex.steps.slice(0, step).map((s, i) => `<li class="${i === step - 1 ? "now" : ""}"><span>${i + 1}</span><p>${esc(s.text)}</p></li>`).join("");
  const atEnd = step === ex.steps.length;
  const exTabs = group.examples.length > 1 ? `<div class="tx-ex-tabs" role="group" aria-label="예제 고르기">${group.examples.map((e, i) => `<button type="button" data-tx-example="${i}" aria-pressed="${i === view.example}">${esc(e.title)}</button>`).join("")}</div>` : "";
  const nextExample = view.example + 1 < group.examples.length;
  const nextType = view.type + 1 < groups.length;
  const after = atEnd
    ? `${nextExample ? `<button type="button" class="tx-next" data-tx-example="${view.example + 1}">${esc(group.examples[view.example + 1].title)} 보기 ▶</button>` : nextType ? `<button type="button" class="tx-next" data-tx-type="${view.type + 1}">다음 유형 ▶</button>` : '<button type="button" class="tx-next" data-flow-go="game">게임하러 가기 ▶</button>'}`
    : `<button type="button" class="tx-next" data-tx-step="${step + 1}">${step === 0 ? "풀이 보기 ▶" : "다음 단계 ▶"}</button>`;
  return `<section class="tx" aria-label="유형별 예제">
    <nav class="tx-types" aria-label="문제 유형">${types}</nav>
    <article class="tx-card" data-tx-current="${view.type}:${view.example}:${step}">
      <header class="tx-head"><strong>유형 ${view.type + 1} · ${esc(group.typeLabel)}</strong>${exTabs}</header>
      <p class="tx-problem"><span>${esc(ex.title)}</span>${esc(ex.problem)}</p>
      <div class="tx-body">
        <figure class="tx-figure">${figureMarkup(figure)}</figure>
        <div class="tx-solve">${step === 0 ? '<p class="tx-think">먼저 혼자 생각해 보고, 「풀이 보기」를 눌러요.</p>' : `<ol class="tx-steps" aria-live="polite">${shown}</ol>`}${atEnd ? `<p class="tx-answer" data-tx-answer><b>답</b>${esc(ex.answer)}</p>` : ""}</div>
      </div>
      <div class="tx-actions"><button type="button" class="tx-back" data-tx-step="${Math.max(0, step - 1)}" ${step === 0 ? "disabled" : ""}>◀ 이전</button><span class="tx-progress">${step} / ${ex.steps.length}</span>${after}</div>
    </article>
  </section>`;
}
