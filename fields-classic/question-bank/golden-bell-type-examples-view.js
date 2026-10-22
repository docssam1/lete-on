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

export function figureMarkup(figure) {
  if (!figure) return "";
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
