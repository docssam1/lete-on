// 2과정 A3 「규칙성과 수열」 개념 꾸러미(DESIGN-COURSE2.md 4절). 열쇠 「단원 번호(0부터)/차시(1부터)」.
// 예제는 새로 지은 문제라 단계 답을 이 파일에 둔다(교재 문항·답이 아니다).
// 글 속 분수는 「3/5」로 쓰면 화면·인쇄에서 수식으로 바뀐다(course2-pack.js · course2-pack-print.js의 mathText).
// 그림은 교재(N30)가 개념을 보여 주는 꼴을 따른다(원장 2026-11-23 「원본 제대로 대조해서 만들어」): 세로 나눗셈의 되풀이 나머지, 이웃한 수 사이 「+차」 호,
// 분자·분모를 따로 잇는 호, 층마다 색이 다른 사각수·삼각수 점, 줄마다 늘어나는 수 피라미드, S를 거꾸로 써서 더하는 가우스 셈,
// 1~100 수 배열표, 자리마다 세는 칸, 자릿수 묶음 괄호, 숫자마다 번호(①②…)를 다는 줄, 수 카드 나뭇가지 그림, 갈림길마다 수를 적는 길 그림.
import { svg, text, rect, circle, line, arrow, P, INK, GREEN, SOFT, MARK, YELLOW, PINK, formulas, mathLabel, card } from "./pack-kit.js?v=20261123b";

const WATER = "#cfe3f3", USED = "#e8e2d2";
const LAYER = [PINK, YELLOW, SOFT, WATER, USED];
const label = (x, y, t, o = {}) => mathLabel(x, y, t, { size: 13, color: "#56627f", ...o });
const board = (lines) => () => formulas(lines);
const arc = (x1, x2, y, h, color = GREEN) => `<path d="M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + h} ${x2} ${y}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
const brace = (x1, x2, y, color = GREEN) => `<path d="M ${x1} ${y} V ${y + 7} H ${x2} V ${y}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
const ring = (x, y, n, { fill = "#fff", color = GREEN } = {}) => circle(P(x, y), 9, { fill, color, width: 1.2 }) + text(x, y + 0.5, String(n), { size: 9.5, color, weight: 700 });

// ── 1단원 ──
// 분수를 소수로: 세로 나눗셈에서 처음 나머지가 다시 나오면 몫이 되풀이된다(2 ÷ 11)
const figLongDiv = () => {
  const cx = (c) => 128 + c * 22, y0 = 56;
  let body = text(88, y0, "11", { size: 17 });
  body += `<path d="M 104 ${y0 + 13} Q 113 ${y0} 104 ${y0 - 13} H 214" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
  body += [["0", 0], ["1", 1], ["8", 2], ["1", 3]].map(([d, c]) => text(cx(c), y0 - 30, d, { size: 17, color: GREEN })).join("") + text(cx(0) + 11, y0 - 30, ".", { size: 17, color: GREEN }) + text(cx(3) + 20, y0 - 30, "…", { size: 15, color: GREEN });
  body += text(cx(0), y0, "2", { size: 17 }) + text(cx(0) + 11, y0, ".", { size: 17 }) + text(cx(1), y0, "0", { size: 17 });
  body += text(cx(0), y0 + 26, "1", { size: 16 }) + text(cx(1), y0 + 26, "1", { size: 16 }) + line(P(cx(0) - 10, y0 + 39), P(cx(1) + 10, y0 + 39), { width: 1.4 });
  body += text(cx(1), y0 + 54, "9", { size: 16 }) + text(cx(2), y0 + 54, "0", { size: 16 });
  body += text(cx(1), y0 + 78, "8", { size: 16 }) + text(cx(2), y0 + 78, "8", { size: 16 }) + line(P(cx(1) - 10, y0 + 91), P(cx(2) + 10, y0 + 91), { width: 1.4 });
  body += rect(cx(2) - 11, y0 + 94, 44, 24, { fill: PINK, color: MARK, width: 1.2, rx: 5 }) + text(cx(2), y0 + 106, "2", { size: 16, color: MARK }) + text(cx(3), y0 + 106, "0", { size: 16, color: MARK });
  body += rect(cx(0) - 11, y0 - 12, 22, 24, { color: MARK, width: 1.2, rx: 5, dash: "3 3" });
  body += label(cx(3) + 30, y0 + 106, "← 처음 나머지 2가 다시", { size: 12, color: MARK, anchor: "start" });
  body += mathLabel(cx(3) + 108, y0 - 2, "2/11 = 0.1818…", { size: 15, color: GREEN }) + label(cx(3) + 108, y0 + 28, "되풀이 마디 18", { size: 12.5, color: GREEN });
  return svg(420, 186, body, "2를 11로 나누는 세로 나눗셈");
};
// 등차수열: 이웃한 두 수 사이에 「+차」 호(교재 꼴). lab이 「?」면 차를 묻는 그림
const figSeqArcs = (terms, lab) => () => {
  const xs = terms.map((_, i) => 40 + i * 62);
  let body = terms.map((t, i) => text(xs[i], 26, t, { size: 20 })).join("") + text(xs[xs.length - 1] + 44, 26, "…", { size: 18 });
  for (let i = 0; i + 1 < terms.length; i += 1) body += arc(xs[i] + 10, xs[i + 1] - 10, 42, 22, lab === "?" ? MARK : GREEN) + text((xs[i] + xs[i + 1]) / 2, 66, lab, { size: 13, color: lab === "?" ? MARK : GREEN, weight: 700 });
  return svg(xs[xs.length - 1] + 70, 80, body, "차가 같은 수열");
};
// 순서와 수를 맞대는 표(교재 꼴) + 「+차」 호
const figArithTable = () => {
  const cols = ["1", "2", "3", "4", "…", "□"], vals = ["5", "9", "13", "17", "…", "5 + 4 × (□ − 1)"], w = [44, 44, 44, 44, 34, 128];
  let body = "", x = 76;
  body += rect(10, 8, 66, 30, { fill: SOFT, color: "#9fb2a6", width: 1.1 }) + text(43, 23, "순서", { size: 13, color: GREEN, weight: 700 });
  body += rect(10, 38, 66, 34, { fill: SOFT, color: "#9fb2a6", width: 1.1 }) + text(43, 55, "수", { size: 13, color: GREEN, weight: 700 });
  const mids = [];
  cols.forEach((c, i) => {
    body += rect(x, 8, w[i], 30, { fill: "#fff", color: "#9fb2a6", width: 1.1 }) + text(x + w[i] / 2, 23, c, { size: 14 });
    body += rect(x, 38, w[i], 34, { fill: i === 5 ? YELLOW : "#fff", color: "#9fb2a6", width: 1.1 }) + text(x + w[i] / 2, 55, vals[i], { size: i === 5 ? 13.5 : 15, color: i === 5 ? GREEN : INK });
    mids.push(x + w[i] / 2); x += w[i];
  });
  for (let i = 0; i < 3; i += 1) body += arc(mids[i] + 6, mids[i + 1] - 6, 76, 16) + text((mids[i] + mids[i + 1]) / 2, 96, "+4", { size: 12, color: GREEN, weight: 700 });
  return svg(x + 10, 106, body, "순서와 수의 표");
};
// 분수 수열: 분자끼리 위 호, 분모끼리 아래 호(교재 꼴)
const figFracSeq = (fracs, top, bottom) => () => {
  const xs = fracs.map((_, i) => 46 + i * 72), y = 62;
  let body = fracs.map((f, i) => mathLabel(xs[i], y, f, { size: 21 })).join("") + text(xs[xs.length - 1] + 46, y, ", …", { size: 18 });
  for (let i = 0; i + 1 < fracs.length; i += 1) {
    const mid = (xs[i] + xs[i + 1]) / 2;
    body += arc(xs[i] + 9, xs[i + 1] - 9, 38, -18, top === "?" ? MARK : GREEN) + text(mid, 20, top, { size: 12.5, color: top === "?" ? MARK : GREEN, weight: 700 });
    body += arc(xs[i] + 9, xs[i + 1] - 9, 86, 18, bottom === "?" ? MARK : GREEN) + text(mid, 106, bottom, { size: 12.5, color: bottom === "?" ? MARK : GREEN, weight: 700 });
  }
  body += label(xs[xs.length - 1] + 92, 40, "분자", { size: 11.5, anchor: "start" }) + label(xs[xs.length - 1] + 92, 86, "분모", { size: 11.5, anchor: "start" });
  return svg(xs[xs.length - 1] + 128, 118, body, "분자와 분모를 따로 보는 분수 수열");
};

// ── 2단원 ──
// 사각수: 층(ㄱ자)마다 색이 다른 점 — 1, 1 + 3, 1 + 3 + 5 …
const figGnomon = (n = 3) => () => {
  const s = 15, slot = 92;
  let body = "";
  for (let k = 1; k <= n; k += 1) {
    const ox = 14 + (k - 1) * slot + (slot - k * s) / 2, oy = 14 + (n - k) * s;
    for (let r = 0; r < k; r += 1) for (let c = 0; c < k; c += 1) body += circle(P(ox + c * s + s / 2, oy + r * s + s / 2), 5.6, { fill: LAYER[Math.max(r, c) % LAYER.length], color: GREEN, width: 1.2 });
    body += label(14 + (k - 1) * slot + slot / 2, 30 + n * s, Array.from({ length: k }, (_, i) => 2 * i + 1).join(" + "), { size: 12 });
  }
  return svg(14 * 2 + n * slot, 42 + n * s, body, "층마다 홀수만큼 둘러 커지는 정사각형");
};
// 줄마다 홀수 개씩 쓴 수 피라미드(교재 꼴: 가운데 맞춤 + 줄 이름)
const figRows = () => {
  const rows = [[1], [2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15, 16]];
  let body = "";
  rows.forEach((row, r) => {
    const y = 20 + r * 28;
    row.forEach((v, i) => { body += text(140 + (i - (row.length - 1) / 2) * 26, y, String(v), { size: 15, color: i === row.length - 1 ? GREEN : INK, weight: i === row.length - 1 ? 700 : 600 }); });
    body += label(250, y, `← ${r + 1}번째 줄 (${row.length}개)`, { size: 12, anchor: "start" });
  });
  return svg(360, 136, body + text(140, 128, "⋮", { size: 15 }), "홀수 개씩 쓴 줄");
};
// 가우스: S를 거꾸로 한 줄 더 써서 위아래로 더한다(교재 꼴)
const figGauss = (top, bottom, sum, tail) => () => {
  const slot = (i) => 92 + i * 30;
  const row = (y, toks, color = INK) => toks.map((t, i) => text(slot(i), y, t, { size: t === "+" ? 15 : 16, color })).join("");
  let body = text(20, 24, "S =", { size: 16, anchor: "start" }) + text(4, 54, "+)", { size: 15, anchor: "start", color: GREEN }) + text(28, 54, "S =", { size: 16, anchor: "start" });
  body += row(24, top) + row(54, bottom) + line(P(4, 72), P(slot(top.length - 1) + 22, 72), { color: GREEN, width: 1.6 });
  body += text(4, 92, "S × 2 =", { size: 16, anchor: "start", color: GREEN }) + row(92, sum, GREEN);
  return svg(slot(top.length - 1) + 34, tail ? 132 : 106, body + (tail ? label(slot(top.length - 1) + 22, 120, tail, { size: 14, color: GREEN, anchor: "end" }) : ""), "가우스의 덧셈");
};
const seqToks = (a) => [a[0], "+", a[1], "+", a[2], "+", "…", "+", a[3]];
// 삼각수: 줄마다 색이 다른 점 삼각형(교재 꼴)
const figTriSeries = (n, values = false) => () => {
  const s = 14, slot = 92;
  let body = "";
  for (let k = 1; k <= n; k += 1) {
    const cx = 14 + (k - 1) * slot + slot / 2, oy = 14 + (n - k) * s;
    for (let r = 0; r < k; r += 1) for (let c = 0; c <= r; c += 1) body += circle(P(cx + (c - r / 2) * s, oy + r * s + s / 2), 5.4, { fill: LAYER[r % LAYER.length], color: GREEN, width: 1.2 });
    body += label(cx, 30 + n * s, Array.from({ length: k }, (_, i) => i + 1).join(" + "), { size: 12 });
    if (values) body += label(cx, 50 + n * s, `= ${(k * (k + 1)) / 2}`, { size: 12.5, color: GREEN });
  }
  return svg(14 * 2 + n * slot, (values ? 62 : 42) + n * s, body, "삼각수");
};
// 1, 2, 2, 3, 3, 3 …: 묶음이 끝나는 자리 = 삼각수
const figGroups = () => {
  let x = 22, body = "", end = 0;
  for (let g = 1; g <= 4; g += 1) {
    const x1 = x;
    for (let i = 0; i < g; i += 1) { body += text(x, 22, String(g), { size: 17, color: g % 2 ? INK : GREEN }); x += 22; }
    end += g;
    body += brace(x1 - 8, x - 14, 36) + label((x1 + x - 22) / 2, 58, `${end}번째`, { size: 11.5, color: GREEN });
    x += 14;
  }
  body += text(x + 4, 22, "…", { size: 17 }) + label(x - 12, 82, "묶음이 끝나는 자리 = 삼각수", { size: 12.5, anchor: "end" });
  return svg(x + 26, 94, body, "묶음수열");
};

// ── 3단원 ──
// 1~100 수 배열표(교재 꼴). col 열을 칠한다
const figHundred = (col) => () => {
  const s = 22;
  let body = "";
  for (let r = 0; r < 10; r += 1) for (let c = 0; c < 10; c += 1) {
    const v = r * 10 + c;
    body += rect(12 + c * s, 8 + r * s, s, s, { fill: c === col && v ? YELLOW : "#fff", color: "#c3cec7", width: 0.9 });
    if (v) body += text(12 + c * s + s / 2, 8 + r * s + s / 2, String(v), { size: 10, color: c === col ? GREEN : INK, weight: c === col ? 700 : 500 });
  }
  return svg(244, 236, body, "1부터 99까지 수 배열표");
};
// 자리마다 세기: 십의 자리 · 일의 자리 칸(교재 꼴)
const figPlaces = (d, count) => () => {
  const col = (x, title, rows, hiCol) => {
    let out = text(x + 30, 14, title, { size: 12.5, color: GREEN, weight: 700 });
    out += rect(x, 26, 30, 22, { fill: SOFT, color: "#9fb2a6", width: 1 }) + rect(x + 30, 26, 30, 22, { fill: SOFT, color: "#9fb2a6", width: 1 }) + text(x + 15, 37, "십", { size: 12 }) + text(x + 45, 37, "일", { size: 12 });
    rows.forEach((pair, r) => {
      const y = 48 + r * 22;
      if (pair === "⋮") { out += text(x + 30, y + 11, "⋮", { size: 13 }); return; }
      pair.forEach((v, c) => { out += rect(x + c * 30, y, 30, 22, { fill: c === hiCol ? YELLOW : "#fff", color: "#c3cec7", width: 1 }) + text(x + c * 30 + 15, y + 11, v, { size: 13, color: c === hiCol ? MARK : INK, weight: c === hiCol ? 700 : 500 }); });
    });
    return out + label(x + 30, 48 + rows.length * 22 + 14, count, { size: 13, color: count === "?번" ? MARK : GREEN });
  };
  const D = String(d);
  return svg(220, 200, col(20, `일의 자리에 ${D}`, [["0", D], ["1", D], ["2", D], "⋮", ["9", D]], 1) + col(130, `십의 자리에 ${D}`, [[D, "0"], [D, "1"], [D, "2"], "⋮", [D, "9"]], 0), "자리마다 세기");
};
// 자릿수가 같은 수끼리 괄호로 묶기(교재 꼴)
const figRanges = (parts) => () => {
  let x = 16, body = "";
  parts.forEach(([t, lab, color], i) => {
    const w = t.length * 9 + 22;
    body += text(x + w / 2, 22, t, { size: 15, color: color || INK });
    body += brace(x + 2, x + w - 2, 36) + label(x + w / 2, 58, lab, { size: 11.5, color: /\?/.test(lab) ? MARK : GREEN });
    if (i + 1 < parts.length) body += text(x + w + 8, 22, "|", { size: 15, color: "#9aa39e" });
    x += w + 16;
  });
  return svg(x + 4, 72, body, "자릿수로 묶기");
};
const figDigitTable = () => {
  const rows = [["수의 범위", "1~9", "10~99", "100~999"], ["수의 개수", "9", "90", "900"], ["숫자의 개수", "9 × 1 = 9", "90 × 2 = 180", "900 × 3 = 2700"]];
  const cw = [84, 72, 104, 118], ch = 32;
  let body = "";
  rows.forEach((row, r) => { let x = 8; row.forEach((v, c) => { body += rect(x, 8 + r * ch, cw[c], ch, { fill: c === 0 ? SOFT : r === 2 ? YELLOW : "#fff", color: "#9fb2a6", width: 1.1 }) + text(x + cw[c] / 2, 8 + r * ch + ch / 2, v, { size: c === 0 ? 12.5 : 13.5, color: c === 0 ? GREEN : INK }); x += cw[c]; }); });
  return svg(394, 112, body, "자릿수별 숫자의 개수");
};
// 이어 쓴 숫자마다 번호 ①②…를 다는 줄(교재 꼴). items: [숫자, 번호] 또는 "…"
const figPositions = (items, groups = []) => () => {
  let x = 18, body = "";
  const at = [];
  items.forEach((it) => {
    if (it === "…") { body += text(x + 4, 20, "…", { size: 15 }) + text(x + 4, 66, "…", { size: 13 }); x += 22; at.push(null); return; }
    const [d, n] = it, q = d === "?";
    body += q ? rect(x - 9, 9, 18, 22, { fill: PINK, color: MARK, width: 1.2, rx: 4 }) + text(x, 20, "?", { size: 14, color: MARK }) : text(x, 20, d, { size: 16 });
    body += arrow(P(x, 33), P(x, 50), { color: "#9aa39e", width: 1.3 }) + ring(x, 62, n, q ? { fill: PINK, color: MARK } : {});
    at.push(x); x += 24;
  });
  groups.forEach(([i, j, lab]) => { body += `<path d="M ${at[i] - 9} 84 V 91 H ${at[j] + 9} V 84" fill="none" stroke="${GREEN}" stroke-width="1.4"/>` + label((at[i] + at[j]) / 2, 104, lab, { size: 11.5, color: GREEN }); });
  return svg(x + 6, groups.length ? 114 : 80, body, "숫자마다 번호 달기");
};

// ── 4단원 ──
// 수 카드 나뭇가지 그림(교재 꼴): 백 → 십 → 일 → 만든 수. only가 있으면 그 맨 앞 카드만 다 그리고 나머지는 …
const figTree = (cards, depth, only = null) => () => {
  const perms = [];
  const go = (pre, rest) => { if (pre.length === depth) { perms.push(pre); return; } rest.forEach((c, i) => go([...pre, c], rest.filter((_, j) => j !== i))); };
  go([], cards);
  const shown = only ? perms.filter((p) => p[0] === only) : perms;
  const head = depth === 3 ? ["백", "십", "일"] : ["십", "일"];
  const colX = (k) => 40 + k * 66, rowH = 24, top = 34;
  let body = head.map((h, k) => text(colX(k), 14, h, { size: 12, color: GREEN, weight: 700 })).join("") + text(colX(depth) + 30, 14, depth === 3 ? "세 자리 수" : "두 자리 수", { size: 12, color: GREEN, weight: 700 });
  const seen = new Map();
  const nodeY = (path) => { const ys = shown.map((p, i) => (p.slice(0, path.length).join() === path.join() ? top + i * rowH : null)).filter((v) => v !== null); return (ys[0] + ys[ys.length - 1]) / 2; };
  shown.forEach((p) => {
    for (let k = 0; k < depth; k += 1) {
      const key = p.slice(0, k + 1).join();
      if (seen.has(key)) continue;
      const y = nodeY(p.slice(0, k + 1)); seen.set(key, y);
      if (k > 0) body += line(P(colX(k - 1) + 12, seen.get(p.slice(0, k).join())), P(colX(k) - 12, y), { color: "#9aa39e", width: 1.3 });
      body += card(colX(k) - 11, y - 11, 22, 22, String(p[k]), { size: 13, fill: k === 0 ? YELLOW : "#fff" });
    }
    const y = seen.get(p.join());
    body += arrow(P(colX(depth - 1) + 14, y), P(colX(depth) - 6, y), { color: "#9aa39e", width: 1.2 }) + text(colX(depth) + 30, y, p.join(""), { size: 14, color: GREEN });
  });
  let h = top + shown.length * rowH;
  if (only) {
    cards.filter((c) => c !== only).forEach((c, i) => { body += card(colX(0) - 11, h + i * 28 - 4, 22, 22, String(c), { size: 13, fill: YELLOW }) + text(colX(1), h + i * 28 + 7, "…", { size: 15, color: MARK }); });
    h += (cards.length - 1) * 28;
  }
  return svg(colX(depth) + 80, h + 4, body, "숫자 카드 나뭇가지 그림");
};
// 예제: 카드 넷과 세 자리 칸 — 맨 앞에 0이 못 온다
const figSlots = () => {
  let body = ["0", "1", "2", "3"].map((v, i) => card(40 + i * 52, 8, 40, 40, v, { size: 18 })).join("");
  ["백", "십", "일"].forEach((h, i) => { body += rect(56 + i * 64, 78, 52, 44, { fill: i === 0 ? YELLOW : "#fff", color: "#6d7a72", width: 1.3, rx: 6 }) + text(82 + i * 64, 100, "?", { size: 16, color: MARK }) + text(82 + i * 64, 136, h, { size: 12.5, color: GREEN, weight: 700 }); });
  return svg(290, 150, body + label(82, 66, "0은 안 됨", { size: 11.5, color: MARK }), "숫자 카드와 세 자리 칸");
};
// 길 그림(교재 꼴): 가로 cols칸 × 세로 rows칸, 오른쪽·아래로만. blocked = 막힌 선분 [c1, r1, c2, r2], numbers면 갈림길마다 가짓수
const figGrid = ({ cols, rows, numbers = false, blocked = [], mark = null, arrows = false }) => () => {
  const o = P(36, 28), s = 52;
  const isBlocked = (c1, r1, c2, r2) => blocked.some(([a, b, c, d]) => (a === c1 && b === r1 && c === c2 && d === r2) || (a === c2 && b === r2 && c === c1 && d === r1));
  let body = "";
  for (let r = 0; r <= rows; r += 1) for (let c = 0; c < cols; c += 1) if (!isBlocked(c, r, c + 1, r)) body += line(P(o.x + c * s, o.y + r * s), P(o.x + (c + 1) * s, o.y + r * s), { color: INK, width: 2 });
  for (let c = 0; c <= cols; c += 1) for (let r = 0; r < rows; r += 1) if (!isBlocked(c, r, c, r + 1)) body += line(P(o.x + c * s, o.y + r * s), P(o.x + c * s, o.y + (r + 1) * s), { color: INK, width: 2 });
  blocked.forEach(([a, b, c, d]) => {
    const m = P(o.x + ((a + c) / 2) * s, o.y + ((b + d) / 2) * s), horiz = b === d;
    body += line(P(o.x + a * s, o.y + b * s), P(o.x + c * s, o.y + d * s), { color: "#c9d3cd", width: 1.4, dash: "4 4" });
    body += rect(m.x - (horiz ? 14 : 5), m.y - (horiz ? 5 : 14), horiz ? 28 : 10, horiz ? 10 : 28, { fill: MARK, color: MARK, width: 1 });
  });
  if (numbers) {
    const n = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));
    for (let r = 0; r <= rows; r += 1) for (let c = 0; c <= cols; c += 1) {
      if (!r && !c) { n[r][c] = 1; continue; }
      n[r][c] = (c > 0 && !isBlocked(c - 1, r, c, r) ? n[r][c - 1] : 0) + (r > 0 && !isBlocked(c, r - 1, c, r) ? n[r - 1][c] : 0);
      body += text(o.x + c * s - 11, o.y + r * s - 10, String(n[r][c]), { size: 13, color: GREEN, weight: 700 });
    }
  }
  if (mark) body += circle(P(o.x + mark[0] * s, o.y + mark[1] * s), 8, { fill: YELLOW, color: MARK, width: 2.2 });
  if (arrows) body += arrow(P(o.x + 8, o.y - 16), P(o.x + 40, o.y - 16), { color: GREEN, width: 1.6 }) + arrow(P(o.x - 18, o.y + 8), P(o.x - 18, o.y + 40), { color: GREEN, width: 1.6 });
  body += `<circle cx="${o.x}" cy="${o.y}" r="5" fill="${GREEN}"/><circle cx="${o.x + cols * s}" cy="${o.y + rows * s}" r="5" fill="${MARK}"/>`;
  body += text(o.x - 14, o.y - 12, "A", { size: 14, weight: 700 }) + text(o.x + cols * s + 14, o.y + rows * s + 12, "B", { size: 14, weight: 700 });
  return svg(o.x * 2 + cols * s, o.y + rows * s + 30, body, "가장 짧은 길 그림");
};

export const PACKS = {
  "0/1": [{
    id: "repeating-decimal", title: "카프리카수와 마디수열 — 되풀이되는 소수",
    recall: { figure: board(["1 ÷ 3 = 0.333…", "1 ÷ 11 = 0.0909…"]), text: "나누어떨어지지 않는 나눗셈은 몫의 숫자가 어느 순간부터 되풀이됩니다.", ask: "0.090909…에서 되풀이되는 마디는?", options: ["09", "9", "090"], answer: 0, why: "0과 9 두 숫자가 되풀이돼요.", hint: "두 숫자" },
    explore: [["drill", "decimal", "되풀이 소수 연습"]],
    proofs: [],
    summary: {
      figure: figLongDiv,
      terms: [["마디", "되풀이되는 숫자 묶음"], ["카프리카수", "제곱한 수를 앞·뒤 두 부분으로 나누어 더하면 처음 수가 되는 수 — 99 × 99 = 9801, 98 + 01 = 99"]],
      facts: ["분수 → 소수: 세로 나눗셈에서 <b>처음 나머지가 다시 나오면</b> 그 뒤로 몫이 되풀이된다", "소수점 아래 □번째 = □ ÷ 마디 길이의 <b>나머지</b>번째 숫자(나머지 0이면 마지막)", "거듭제곱의 일의 자리도 마디로 되풀이된다(2 → 4 → 8 → 6)"]
    },
    pitfall: "자리 번호는 소수점 바로 아래부터 1번째입니다. 0.4285…의 4가 1번째입니다.",
    example: {
      prompt: "3/7을 소수로 나타낼 때 소수점 아래 20번째 숫자를 구하세요.",
      figure: board(["3 ÷ 7 = 0.428571428571…"]),
      steps: [
        { ask: "되풀이되는 마디(428571)는 몇 자리?", answer: "6", unit: "자리", why: "4, 2, 8, 5, 7, 1 여섯 자리입니다.", hint: "숫자 세기" },
        { ask: "20 ÷ 6의 나머지는?", answer: "2", why: "6 × 3 = 18, 20 − 18 = 2입니다.", hint: "6 × 3" },
        { ask: "마디의 2번째 숫자는?", answer: "2", why: "4 2 8 5 7 1에서 두 번째는 2입니다.", hint: "428571" }
      ]
    },
    check: [["c2-repeating-decimal", "concept"], ["c2-power-last-digit", "type"], ["c2-repeating-decimal", "advanced"]]
  }],
  "0/2": [{
    id: "arith-sequence", title: "차가 같은 수열(등차수열)",
    recall: { figure: figSeqArcs(["3", "10", "17", "24"], "?"), text: "앞의 수에 같은 수를 더해 가며 만든 수열을 등차수열이라 하고, 더하는 수를 「차」라 합니다.", ask: "3, 10, 17, 24, …의 차는?", options: ["7", "3", "10"], answer: 0, why: "10 − 3 = 7이에요.", hint: "이웃한 두 수의 차" },
    explore: [["drill", "arith", "등차수열 연습"]],
    proofs: [],
    summary: {
      figure: figArithTable,
      terms: [["차", "이웃한 두 수의 차 — 늘 같다"]],
      facts: ["□번째 수는 차를 <b>(□ − 1)번</b> 더한 수: 첫 수 + 차 × (□ − 1)", "어떤 수가 몇 번째인지: (그 수 − 첫 수) ÷ 차 + 1", "범위 안의 개수: 처음 수와 마지막 수를 찾아 (마지막 − 처음) ÷ 차 + 1"]
    },
    pitfall: "30번째 수를 구할 때 차를 30번이 아니라 29번 더합니다(식목처럼 간격 수는 하나 적다).",
    example: {
      prompt: "수열 5, 9, 13, 17, …에서 30번째 수와, 201이 몇 번째 수인지 구하세요.",
      figure: figSeqArcs(["5", "9", "13", "17"], "+4"),
      steps: [
        { ask: "30번째 수는?", answer: "121", why: "5 + 4 × 29 = 121입니다.", hint: "5 + 4 × 29" },
        { ask: "201은 첫 수보다 차를 몇 번 더한 수?", answer: "49", unit: "번", why: "(201 − 5) ÷ 4 = 49입니다.", hint: "196 ÷ 4" },
        { ask: "201은 몇 번째?", answer: "50", unit: "번째", why: "49번 더했으니 49 + 1 = 50번째입니다.", hint: "+ 1" }
      ]
    },
    check: [["c2-arith-sequence", "concept"], ["c2-arith-sequence", "type"], ["c2-group-rows", "advanced"]]
  }],
  "0/3": [{
    id: "fraction-sequence", title: "등차수열과 분수 — 분자와 분모를 따로",
    recall: { figure: board(["1/2 = 2/4 = 3/6"]), text: "분모와 분자에 0이 아닌 같은 수를 곱하거나 나누어도 분수의 크기는 같습니다.", ask: "3/4 = □/8의 □는?", options: ["6", "4", "3"], answer: 0, why: "분모에 2를 곱했으니 분자에도 2를 곱해요.", hint: "× 2" },
    explore: [["drill", "groups", "묶음수열 연습"]],
    proofs: [],
    summary: {
      figure: figFracSeq(["2/3", "5/7", "8/11", "11/15"], "+3", "+4"),
      terms: [["분수 수열", "분수를 규칙에 따라 늘어놓은 것 — 분자와 분모를 따로 본다"]],
      facts: ["분자끼리, 분모끼리 각각 등차수열이면 □번째 분자 = 첫 분자 + 분자의 차 × (□ − 1), 분모도 같은 방법", "약분된 분수가 섞여 있으면 <b>크기가 같은 분수</b>로 바꾸어(분자나 분모를 같게) 규칙을 드러낸다", "1/1, 1/2, 2/2, 1/3 …처럼 묶음마다 개수가 늘면 앞 묶음까지의 개수(1 + 2 + …)로 자리를 찾는다"]
    },
    pitfall: "20번째 분수의 분자는 분자의 차를 19번 더합니다. 분자의 차와 분모의 차는 따로 셉니다.",
    example: {
      prompt: "분수를 3/4, 5/7, 7/10, 9/13, …처럼 늘어놓을 때 20번째 분수를 구하세요.",
      figure: figFracSeq(["3/4", "5/7", "7/10", "9/13"], "?", "?"),
      steps: [
        { ask: "분자는 몇씩 커지나요?", answer: "2", why: "3, 5, 7, 9 — 2씩 커집니다(분모는 3씩).", hint: "5 − 3" },
        { ask: "20번째 분자는?", answer: "41", why: "3 + 2 × 19 = 41입니다.", hint: "3 + 2 × 19" },
        { ask: "20번째 분모는?", answer: "61", why: "4 + 3 × 19 = 61이므로 20번째 분수는 41/61입니다.", hint: "4 + 3 × 19" }
      ]
    },
    check: [["c2-fraction-sequence", "concept"], ["c2-fraction-sequence", "type"], ["c2-fraction-sequence", "advanced"]]
  }],
  "1/1": [{
    id: "square-rows", title: "사각수와 제곱수 — 홀수 개씩 쓴 줄",
    recall: { figure: figGnomon(3), text: "1부터 연속한 홀수의 합은 점을 정사각형으로 늘어놓은 수(사각수)입니다. 한 층마다 ㄱ자 모양으로 홀수만큼 둘러 붙입니다.", ask: "1 + 3 + 5 + 7은?", options: ["16", "12", "15"], answer: 0, why: "한 층 더 둘러 4 × 4예요.", hint: "4 × 4" },
    explore: [["drill", "groups", "묶음수열 연습"]],
    proofs: [],
    summary: {
      figure: figRows,
      terms: [["제곱수", "1, 4, 9, 16 … — 같은 수를 두 번 곱한 수"]],
      facts: ["줄마다 홀수 개씩 쓰면 □번째 줄의 <b>마지막 수 = □ × □</b>", "□번째 줄의 첫 수 = (□ − 1) × (□ − 1) + 1", "가운데 수 = 첫 수와 마지막 수의 가운데"]
    },
    pitfall: "줄의 마지막 수가 제곱수가 되는 것은 1, 3, 5 …처럼 홀수 개씩 쓸 때만입니다.",
    example: {
      prompt: "1부터 차례로 첫째 줄에 1개, 둘째 줄에 3개, 셋째 줄에 5개 … 씩 수를 씁니다. 7번째 줄의 첫 수와 마지막 수를 구하세요.",
      figure: figRows,
      steps: [
        { ask: "6번째 줄의 마지막 수는?", answer: "36", why: "6 × 6 = 36입니다.", hint: "6 × 6" },
        { ask: "7번째 줄의 첫 수는?", answer: "37", why: "36 다음 수입니다.", hint: "36 + 1" },
        { ask: "7번째 줄의 마지막 수는?", answer: "49", why: "7 × 7 = 49입니다(37부터 13개).", hint: "7 × 7" }
      ]
    },
    check: [["c2-odd-sum-square", "concept"], ["c2-group-rows", "type"], ["c2-group-rows", "advanced"]]
  }],
  "1/2": [{
    id: "gauss", title: "가우스와 등차수열의 합",
    recall: { figure: figGauss(seqToks(["1", "2", "3", "10"]), seqToks(["10", "9", "8", "1"]), seqToks(["11", "11", "11", "11"]), "11이 10개"), text: "1 + 2 + … + 10을 S라 하고, 거꾸로 한 줄 더 써서 위아래로 더하면 11이 10개 생깁니다.", ask: "그러면 S = 1 + 2 + … + 10은?", options: ["55", "110", "50"], answer: 0, why: "11 × 10 = 110은 S의 두 배라 절반이에요.", hint: "110 ÷ 2" },
    explore: [["drill", "arith", "등차수열 연습"]],
    proofs: [],
    summary: {
      figure: figGauss(seqToks(["2", "5", "8", "29"]), seqToks(["29", "26", "23", "2"]), seqToks(["31", "31", "31", "31"]), "S = 31 × 10 ÷ 2"),
      terms: [["가우스의 덧셈", "거꾸로 쓴 줄과 짝을 지어 더하는 방법"]],
      facts: ["등차수열의 합 = (첫 수 + 끝 수) × 개수 ÷ 2", "개수 = (끝 수 − 첫 수) ÷ 차 + 1", "분모가 같은 분수의 합은 분자들만 같은 방법으로 더한다"]
    },
    pitfall: "끝 수를 모를 때는 먼저 「□번째 수」로 끝 수부터 구합니다.",
    example: {
      prompt: "3 + 7 + 11 + … + 79의 값을 구하세요.",
      figure: figGauss(seqToks(["3", "7", "11", "79"]), seqToks(["79", "75", "71", "3"]), seqToks(["□", "□", "□", "□"])),
      steps: [
        { ask: "더하는 수는 몇 개?", answer: "20", unit: "개", why: "(79 − 3) ÷ 4 + 1 = 20입니다.", hint: "76 ÷ 4 + 1" },
        { ask: "짝 하나의 합(3 + 79)은?", answer: "82", why: "첫 수와 끝 수를 더합니다.", hint: "3 + 79" },
        { ask: "합은?", answer: "820", why: "82 × 20 ÷ 2 = 820입니다.", hint: "82 × 20 ÷ 2" }
      ]
    },
    check: [["c2-gauss-sum", "concept"], ["c2-gauss-sum", "type"], ["c2-gauss-sum", "advanced"]]
  }],
  "1/3": [{
    id: "triangular", title: "삼각수와 묶음수열",
    recall: { figure: figTriSeries(4), text: "점을 정삼각형 모양으로 늘어놓은 수 1, 3, 6, 10, …을 삼각수라 합니다. 한 줄 내려갈 때마다 점이 하나씩 늘어납니다.", ask: "다섯 번째 삼각수는?", options: ["15", "12", "25"], answer: 0, why: "1 + 2 + 3 + 4 + 5 = 15예요.", hint: "1부터 5까지" },
    explore: [["drill", "groups", "묶음수열 연습"]],
    proofs: [],
    summary: {
      figure: figTriSeries(4, true),
      terms: [["삼각수", "1 + 2 + … + □ — 정삼각형 모양의 점 개수"]],
      facts: ["□번째 삼각수 = (1 + □) × □ ÷ 2", "1, 2, 2, 3, 3, 3, …처럼 묶은 수열에서 □번째 묶음이 끝나는 자리 = □번째 삼각수", "오각수·육각수도 늘어나는 개수를 표로 적어 이어 더한다"]
    },
    pitfall: "몇 번째 묶음인지 찾을 때는 삼각수가 처음으로 그 자리 이상이 되는 곳을 찾습니다.",
    example: {
      prompt: "1, 2, 2, 3, 3, 3, 4, 4, 4, 4, …처럼 늘어놓을 때 30번째 수를 구하세요.",
      figure: figGroups,
      steps: [
        { ask: "7이 끝나는 자리(7번째 삼각수)는?", answer: "28", unit: "번째", why: "1 + 2 + … + 7 = 28입니다.", hint: "(1 + 7) × 7 ÷ 2" },
        { ask: "30번째 수는?", answer: "8", why: "29번째부터 36번째까지가 8이므로 30번째는 8입니다.", hint: "28 다음 묶음" }
      ]
    },
    check: [["c2-figurate-number", "concept"], ["c2-group-rows", "type"], ["c2-figurate-number", "advanced"]]
  }],
  // 교재 차례: 활동 1 「숫자의 개수와 합」 = 어떤 숫자가 몇 번(자리마다 세기), 활동 2 「수와 숫자의 개수」 = 쓴 숫자 모두(자릿수로 묶기)
  "2/1": [{
    id: "digit-occurrence", title: "숫자의 개수와 합 — 어떤 숫자가 몇 번",
    recall: { figure: figHundred(1), text: "1부터 99까지 수 배열표에서 일의 자리가 같은 수는 한 세로줄에 모입니다.", ask: "1부터 99까지 일의 자리가 1인 수는 몇 개?", options: ["10개", "9개", "11개"], answer: 0, why: "1, 11, 21, …, 91이에요.", hint: "칠한 세로줄" },
    explore: [["drill", "digits", "숫자 세기 연습"]],
    proofs: [],
    summary: {
      figure: figPlaces(3, "10번"),
      terms: [["자리마다 세기", "한 자리씩 고정하고 나머지 자리가 몇 가지인지 센다"]],
      facts: ["1~99에서 숫자 1~9는 각 자리에 <b>10번씩</b>, 모두 20번", "33처럼 한 수에 두 번 들어 있으면 두 번 센다", "0은 맨 앞에 쓰지 않으니 따로 조심한다"]
    },
    pitfall: "「숫자 1이 들어 있는 수의 개수」와 「숫자 1을 쓴 횟수」는 다릅니다.",
    example: {
      prompt: "1부터 99까지의 자연수를 모두 쓸 때 숫자 7은 모두 몇 번 쓰나요?",
      figure: figPlaces(7, "?번"),
      steps: [
        { ask: "일의 자리에 7을 쓰는 횟수는?", answer: "10", unit: "번", why: "7, 17, …, 97로 10번입니다.", hint: "7, 17, 27 …" },
        { ask: "십의 자리에 7을 쓰는 횟수는?", answer: "10", unit: "번", why: "70부터 79까지 10번입니다.", hint: "70 … 79" },
        { ask: "모두 몇 번?", answer: "20", unit: "번", why: "77은 두 번 센 것이 맞습니다. 10 + 10 = 20입니다.", hint: "10 + 10" }
      ]
    },
    check: [["c2-digit-count", "concept"], ["c2-digit-count", "type"], ["c2-digit-count", "advanced"]]
  }],
  "2/2": [{
    id: "digit-count", title: "수와 숫자의 개수 — 자릿수로 나누어 세기",
    recall: { figure: figRanges([["1 … 9", "수 9개 · 숫자 9개"], ["10 … 99", "수 90개 · 숫자 ?개", GREEN]]), text: "두 자리 수는 10부터 99까지 90개이고, 하나에 숫자가 2개씩 있습니다.", ask: "10부터 99까지 쓸 때 숫자는 모두 몇 개?", options: ["180개", "90개", "99개"], answer: 0, why: "90 × 2 = 180이에요.", hint: "90 × 2" },
    explore: [["drill", "digits", "숫자 세기 연습"]],
    proofs: [],
    summary: {
      figure: figDigitTable,
      terms: [["숫자의 개수", "쓴 수의 개수가 아니라 쓴 글자(0~9)의 개수"]],
      facts: ["자릿수가 같은 수끼리 묶어 <b>(수의 개수 × 자릿수)</b>를 더한다", "□부터 ○까지의 개수 = ○ − □ + 1", "쓴 숫자 수로 쪽수 찾기: 9, 180을 빼 가며 몇 자리 쪽까지 썼는지 본다"]
    },
    pitfall: "100부터 150까지는 50개가 아니라 51개입니다(양 끝을 모두 셉니다).",
    example: {
      prompt: "1부터 150까지의 자연수를 모두 쓸 때 숫자는 모두 몇 개 쓰나요?",
      figure: figRanges([["1 … 9", "한 자리"], ["10 … 99", "두 자리"], ["100 … 150", "세 자리"]]),
      steps: [
        { ask: "두 자리 수(10~99)에서 쓰는 숫자는?", answer: "180", unit: "개", why: "90개 × 2입니다.", hint: "90 × 2" },
        { ask: "세 자리 수(100~150)에서 쓰는 숫자는?", answer: "153", unit: "개", why: "51개 × 3 = 153입니다.", hint: "51 × 3" },
        { ask: "모두 몇 개?", answer: "342", unit: "개", why: "9 + 180 + 153 = 342입니다.", hint: "9 + 180 + 153" }
      ]
    },
    check: [["c2-digit-count", "concept"], ["c2-digit-count", "type"], ["c2-digit-position", "advanced"]]
  }],
  "2/3": [{
    id: "digit-position", title: "마지막 수와 숫자 구하기 — 이어 쓴 숫자의 자리",
    recall: { figure: figPositions([["1", 1], ["2", 2], ["3", 3], "…", ["8", 8], ["9", 9], ["?", 10]]), text: "1부터 이어 쓴 숫자마다 차례로 번호를 답니다. 한 자리 수 9개가 숫자 9개를 차지하고, 그다음부터 두 자리 수가 2개씩 차지합니다.", ask: "10번째 숫자는?", options: ["1", "0", "9"], answer: 0, why: "9 다음 수 10의 첫 숫자 1이에요.", hint: "9 다음 수" },
    explore: [["drill", "digits", "숫자 세기 연습"]],
    proofs: [],
    summary: {
      figure: figPositions([["1", 1], ["2", 2], "…", ["9", 9], ["1", 10], ["0", 11], ["1", 12], ["1", 13], ["1", 14], ["2", 15], "…"], [[0, 3, "한 자리 9개"], [4, 9, "두 자리 — 수 하나에 2개씩"]]),
      terms: [["자리 찾기", "자릿수별로 차지하는 숫자 수를 빼 가며 범위를 좁힌다"]],
      facts: ["□번째 숫자: 9를 빼고, 180을 빼고 … 남은 수로 <b>몇 자리 수 부분</b>인지 정한다", "두 자리 부분의 ○번째 숫자 → (○ − 1) ÷ 2의 몫만큼 10에서 뒤로", "나머지로 그 수의 몇 번째 숫자인지 본다"]
    },
    pitfall: "두 자리 부분의 첫 수는 10입니다. 몫만큼 10에 더해야 그 수가 나옵니다.",
    example: {
      prompt: "1부터 자연수를 이어 써서 1234567891011…을 만들었습니다. 왼쪽부터 100번째 숫자를 구하세요.",
      figure: board(["123456789 | 10 11 12 … "]),
      steps: [
        { ask: "한 자리 수 9개를 빼면 두 자리 부분의 몇 번째 숫자?", answer: "91", unit: "번째", why: "100 − 9 = 91입니다.", hint: "100 − 9" },
        { ask: "그 숫자가 들어 있는 두 자리 수는?", answer: "55", why: "(91 − 1) ÷ 2 = 45이므로 10 + 45 = 55입니다.", hint: "10 + 45" },
        { ask: "100번째 숫자는?", answer: "5", why: "나머지가 0이라 55의 첫 번째 숫자 5입니다.", hint: "55의 첫 숫자" }
      ]
    },
    check: [["c2-digit-position", "concept"], ["c2-digit-position", "type"], ["c2-digit-position", "advanced"]]
  }],
  "3/1": [{
    id: "card-count", title: "크기 순으로 배열하기 — 숫자 카드로 만든 수",
    recall: { figure: figTree([1, 2, 3], 2, 1), text: "숫자 카드로 수를 만들 때는 나뭇가지 그림을 그려 높은 자리부터 하나씩 정합니다.", ask: "카드 1, 2, 3으로 만드는 두 자리 수는 몇 개?", options: ["6개", "3개", "9개"], answer: 0, why: "십의 자리 3가지마다 일의 자리 2가지예요.", hint: "3 × 2" },
    explore: [["drill", "paths", "경우의 수 연습"]],
    proofs: [],
    summary: {
      figure: figTree([1, 2, 3], 3),
      terms: [["나뭇가지 그림", "높은 자리부터 고를 수 있는 카드를 가지로 뻗어 그린 그림 — 가짓수를 곱한다"]],
      facts: ["카드 3장으로 세 자리 수: 3 × 2 × 1 = 6개, 4장이면 4 × 3 × 2 = <b>24</b>개", "0이 있으면 맨 앞에 올 수 없다 — 맨 앞 자리부터 가짓수를 센다", "크기 순서: 맨 앞 숫자가 같은 묶음씩 세어 몇 번째인지 찾는다"]
    },
    pitfall: "0을 맨 앞에 놓은 「012」는 세 자리 수가 아닙니다.",
    example: {
      prompt: "숫자 카드 0, 1, 2, 3 중 3장을 골라 만들 수 있는 세 자리 수는 몇 개인가요?",
      figure: figSlots,
      steps: [
        { ask: "백의 자리에 올 수 있는 카드는 몇 가지?", answer: "3", unit: "가지", why: "0을 뺀 1, 2, 3입니다.", hint: "0은 안 됨" },
        { ask: "십의 자리는? (남은 카드)", answer: "3", unit: "가지", why: "0을 포함해 남은 3장입니다.", hint: "남은 3장" },
        { ask: "모두 몇 개?", answer: "18", unit: "개", why: "3 × 3 × 2 = 18입니다.", hint: "3 × 3 × 2" }
      ]
    },
    check: [["digit-card-number-enumeration", "concept"], ["digit-card-ranked-number", "type"], ["digit-card-number-enumeration", "advanced"]]
  }],
  "3/2": [{
    id: "shortest-path", title: "최단거리의 가짓수 — 갈림길마다 더하기",
    recall: { figure: figGrid({ cols: 3, rows: 2, arrows: true }), text: "가장 짧은 길로 가려면 오른쪽과 아래로만 갑니다. 한 점까지 오는 방법 수 = 왼쪽 점까지 + 위 점까지 오는 방법 수입니다.", ask: "맨 윗줄의 점들까지 오는 방법은 각각?", options: ["1가지", "2가지", "점마다 다르다"], answer: 0, why: "오른쪽으로만 쭉 가는 한 가지예요.", hint: "한 줄로만" },
    explore: [["drill", "paths", "경우의 수 연습"]],
    proofs: [],
    summary: {
      figure: figGrid({ cols: 4, rows: 2, numbers: true }),
      terms: [["최단 경로", "되돌아가지 않고(오른쪽·아래로만) 가는 길"]],
      facts: ["출발점에서 곧게 뻗은 가장자리 점은 모두 <b>1</b>", "안쪽 점 = 왼쪽 점의 수 + 위 점의 수", "B에 적힌 수가 가장 짧은 길의 가짓수"]
    },
    pitfall: "갈 수 없는 길이 있으면 그쪽에서 오는 수는 더하지 않습니다.",
    example: {
      prompt: "가로 3칸, 세로 2칸인 바둑판 길에서 A(왼쪽 위)부터 B(오른쪽 아래)까지 가장 짧은 길은 몇 가지인가요?",
      figure: figGrid({ cols: 3, rows: 2 }),
      steps: [
        { ask: "가운데 줄 둘째 점(오른쪽 1칸·아래 1칸)은?", answer: "2", why: "왼쪽 1 + 위 1 = 2입니다.", hint: "1 + 1" },
        { ask: "가운데 줄 마지막 점은?", answer: "4", why: "1, 2, 3, 4로 더해 나갑니다.", hint: "3 + 1" },
        { ask: "B까지는?", answer: "10", unit: "가지", why: "맨 아랫줄은 1, 3, 6, 10입니다.", hint: "6 + 4" }
      ]
    },
    check: [["shortest-path-rectangle", "concept"], ["shortest-path-rectangle", "type"], ["shortest-path-rectangle", "advanced"]]
  }],
  "3/3": [{
    id: "blocked-path", title: "갈 수 없는 길의 최단거리",
    recall: { figure: figGrid({ cols: 2, rows: 2, mark: [1, 1] }), text: "어느 점을 꼭 지나는 길의 가짓수는 (A → 그 점) × (그 점 → B)입니다.", ask: "A에서 표시한 점까지 가는 방법이 2가지, 그 점에서 B까지 2가지라면 그 점을 지나는 방법은?", options: ["4가지", "2가지", "6가지"], answer: 0, why: "2 × 2 = 4예요.", hint: "곱하기" },
    explore: [["drill", "paths", "경우의 수 연습"]],
    proofs: [],
    summary: {
      figure: figGrid({ cols: 3, rows: 2, numbers: true, blocked: [[1, 1, 2, 1]] }),
      terms: [["갈 수 없는 길", "공사 중이거나 연못이 있어 지나지 못하는 길 — 지운 모양으로 다시 그린다"]],
      facts: ["막힌 길을 지우고 그린 뒤, 그 길로 들어오는 수만 빼고 갈림길마다 더해 나간다", "빼서 세기: 전체 − 막힌 곳을 지나는 길((A → 그 앞) × (그 뒤 → B))", "연못·공사 구간처럼 큰 곳은 지운 모양 위에서 더해 가는 방법이 편하다"]
    },
    pitfall: "막힌 「길(선분)」 하나 때문에 그 끝 점까지 막히는 것은 아닙니다. 다른 쪽에서 들어오는 수는 그대로 더합니다.",
    example: {
      prompt: "가로 2칸, 세로 2칸인 바둑판 길에서 가운데 점 바로 아래 길(빨간 칸)이 공사 중일 때, A에서 B까지 가장 짧은 길은 몇 가지인가요?",
      figure: figGrid({ cols: 2, rows: 2, blocked: [[1, 1, 1, 2]] }),
      steps: [
        { ask: "막힘이 없을 때 전체는?", answer: "6", unit: "가지", why: "윗줄 1, 1, 1 · 가운데 줄 1, 2, 3 · 아랫줄 1, 3, 6으로 더해 가면 6입니다.", hint: "2칸 × 2칸" },
        { ask: "공사 중인 길을 지나는 길은?", answer: "2", unit: "가지", why: "A → 가운데 점 2가지 × 그 길 아래 점 → B 1가지 = 2가지입니다.", hint: "2 × 1" },
        { ask: "답은?", answer: "4", unit: "가지", why: "6 − 2 = 4입니다. 지운 모양 위에서 더해 가도 4가 나옵니다.", hint: "6 − 2" }
      ]
    },
    check: [["shortest-path-irregular-grid", "concept"], ["shortest-path-irregular-grid", "type"], ["shortest-path-diagonal-shortcut-book5", "advanced"]]
  }]
};
