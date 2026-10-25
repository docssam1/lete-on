// 「유형별 예제」 화면. 예제 데이터(golden-bell-type-examples.js)를 그림(SVG)과 단계 목록으로 그린다.
// 한 단계씩 연다: 0단계 = 문제만, 1~N단계 = 풀이가 하나씩, 마지막 = 답. 답은 마지막 단계 전에는 화면에 없다.
// 색은 골든벨 색표(쌓기나무·모양·숫자판·저울), 안내 단계 색은 주어진 것 파랑 · 하는 일 금색 · 확인 진초록.

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
  const W = 220, tilt = s.heavy === "left" ? -9 : s.heavy === "right" ? 9 : 0, focus = (f.focus || []).includes(k);
  const pan = (list, cx, cy) => {
    const n = list.length, gap = n > 3 ? 18 : 24;
    return list.map((t, i) => token(t, cx + (i - (n - 1) / 2) * gap, cy - (SHAPE[t] ? 12 : 15), n > 3 ? 18 : 22)).join("");
  };
  const rad = tilt * Math.PI / 180, arm = 78;
  const lx = 110 - arm * Math.cos(rad), ly = 46 - arm * Math.sin(rad), rx = 110 + arm * Math.cos(rad), ry = 46 + arm * Math.sin(rad);
  const weights = f.weights || {};
  const tag = (list, cx, cy) => { const known = [...new Set(list)].filter((t) => weights[t] !== undefined); return known.length ? text(cx, cy, known.map((t) => `${SHAPE_NAME[t] || t} ${weights[t]}g`).join(" · "), { size: 11, weight: 800, fill: "#16734b" }) : ""; };
  let body = `<rect x="2" y="2" width="${W - 4}" height="146" rx="14" fill="#fff" stroke="${focus ? TONE.doing : "#ece4d6"}" stroke-width="${focus ? 4 : 2}"/>`;
  body += text(18, 18, `${k + 1}`, { size: 12, weight: 900, fill: "#566274" });
  body += '<path d="M110 52 L96 120 H124 Z" fill="#f39a1e"/><rect x="82" y="118" width="56" height="10" rx="4" fill="#ffd45c" stroke="#d9a400"/>';
  body += `<line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="#f39a1e" stroke-width="7" stroke-linecap="round"/>`;
  for (const [x, y] of [[lx, ly], [rx, ry]]) body += `<path d="M${x} ${y} L${x - 22} ${y + 34} M${x} ${y} L${x + 22} ${y + 34}" stroke="#b38a52" stroke-width="1.5"/><path d="M${x - 30} ${y + 34} H${x + 30} Q${x + 26} ${y + 44} ${x} ${y + 44} Q${x - 26} ${y + 44} ${x - 30} ${y + 34} Z" fill="#ffeaa6" stroke="#d9a400" stroke-width="1.5"/>`;
  body += pan(s.left, lx, ly + 34) + pan(s.right, rx, ry + 34);
  body += '<circle cx="110" cy="46" r="6" fill="#f2c14e" stroke="#a8741a"/>';
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
  const axis = 16 + overs.length * L + 8, nameY = axis + 16, H = nameY + 14 + unders.length * L + 8;
  const max = Math.max(...f.points.map((p) => p.at)), X = (at) => x0 + ((x1 - x0) * at) / max;
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
  for (const p of f.points) body += `<circle cx="${pos[p.label]}" cy="${axis}" r="5" fill="#222"/>${text(pos[p.label], nameY, p.label, { size: 13, weight: 900 })}`;
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

export function figureMarkup(figure) {
  if (!figure) return "";
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
