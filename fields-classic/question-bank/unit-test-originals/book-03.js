// 3권 권별 테스트 원문(다시 짠 것) — 원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」.
// 문장·수·이름·그림 배치는 원문 시험지 그대로, 그림은 우리 색표(.claude/skills/golden-bell-figure-style)로 새로 그린다.
// 정답은 두지 않는다 — 비공개 DB(fields_unit_test_answer_keys)에서 「답안 확인」 때만 받는다. 답 그림(visual.values)도 그 DB에서 온다.
import { UT, esc, svg, box, line } from "./kit.js?v=20261028ze";

const INK = "#333";
const GRID = UT.soft;
const SHADE = UT.shade;
const SHADE_SOFT = "#ffd9b0";
const DASH = UT.line;
const PANEL = { fill: "#fff4c2", stroke: UT.orange };
// 모양 색(색표 2절): ○ 빨강 · □ 파랑 · ◇ 보라 · △ 초록 · ☆ 노랑 · 십자 모양은 주황
const SHAPE = {
  ci: { stroke: UT.red, fill: UT.redSoft },
  sq: { stroke: UT.blue, fill: UT.blueSoft },
  di: { stroke: UT.purple, fill: UT.purpleSoft },
  tr: { stroke: UT.green, fill: UT.greenSoft },
  cr: { stroke: UT.orange, fill: UT.orangeSoft },
  st: { stroke: "#f0b23a", fill: UT.yellowSoft }
};

const f1 = (n) => Number(n).toFixed(1).replace(/\.0$/, "");
const pts = (list) => list.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ");
const poly = (list, { fill = "none", stroke = INK, width = 1.6, opacity = 1 } = {}) =>
  `<polygon points="${pts(list)}" fill="${fill}"${opacity < 1 ? ` fill-opacity="${opacity}"` : ""} stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
const seg = ([x1, y1], [x2, y2], opts) => line(f1(x1), f1(y1), f1(x2), f1(y2), { stroke: INK, width: 1.5, ...opts });
// 글자(검정). halo 는 선 위에 놓인 글자 뒤에 흰 테두리를 둘러 선과 겹쳐도 읽히게 한다.
function T(x, y, value, { size = 15, anchor = "middle", weight = 600, fill = UT.ink, halo = false } = {}) {
  const extra = halo ? "paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round;" : "";
  return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" dominant-baseline="central" style="${extra}font-size:${size}px;font-weight:${weight};fill:${fill};text-anchor:${anchor};dominant-baseline:central;letter-spacing:0">${esc(value)}</text>`;
}
// ㉠·㉮·① 같은 동그라미 글자 — 글꼴에 없을 수 있어 원과 글자로 그린다
const circ = (x, y, ch, r = 9, size = 11) =>
  `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="#fff" stroke="${UT.ink}" stroke-width="1.2"/>${T(x, y + 0.5, ch, { size, weight: 700 })}`;
const blank = (x, y, w, h, value) => `${box(f1(x), f1(y), w, h, { radius: 6 })}${value == null ? "" : T(x + w / 2, y + h / 2 + 1, value, { size: 15, weight: 700 })}`;
// 분수 빈칸: 위아래로 쌓은 두 칸과 가로 막대(빗금 표기 금지)
function fracSlot(cx, y, s = 28) {
  return `${box(f1(cx - s / 2), y, s, s, { radius: 2 })}${seg([cx - s / 2 - 8, y + s + 5], [cx + s / 2 + 8, y + s + 5], { width: 1.6 })}${box(f1(cx - s / 2), y + s + 10, s, s, { radius: 2 })}`;
}
// 점선 활(두 점 사이 거리 표시). side -1 위, +1 아래. 비스듬히 떠나 가운데에서 depth 만큼 벌어진다.
function arc(x1, x2, y, depth, side = -1, { stroke = DASH, dash = "4 3" } = {}) {
  const k = depth / 0.75;
  const w = x2 - x1;
  return `<path d="M${f1(x1)} ${f1(y)}C${f1(x1 + w * 0.12)} ${f1(y + side * k)} ${f1(x2 - w * 0.12)} ${f1(y + side * k)} ${f1(x2)} ${f1(y)}" fill="none" stroke="${stroke}" stroke-width="1.3" stroke-dasharray="${dash}"/>`;
}
// 모양 하나(색표 색)
function glyph(kind, cx, cy, s = 30) {
  const c = SHAPE[kind];
  if (!c) return "";
  const h = s / 2;
  const sw = s >= 24 ? 1.8 : 1.4;
  const attrs = `fill="${c.fill}" stroke="${c.stroke}" stroke-width="${sw}" stroke-linejoin="round"`;
  if (kind === "ci") return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(h)}" ${attrs}/>`;
  if (kind === "sq") return `<rect x="${f1(cx - h)}" y="${f1(cy - h)}" width="${f1(s)}" height="${f1(s)}" ${attrs}/>`;
  if (kind === "di") return `<polygon points="${pts([[cx, cy - h], [cx + h, cy], [cx, cy + h], [cx - h, cy]])}" ${attrs}/>`;
  if (kind === "tr") return `<polygon points="${pts([[cx, cy - h], [cx + h, cy + h * 0.78], [cx - h, cy + h * 0.78]])}" ${attrs}/>`;
  if (kind === "cr") {
    const a = h * 0.36;
    return `<polygon points="${pts([[cx - a, cy - h], [cx + a, cy - h], [cx + a, cy - a], [cx + h, cy - a], [cx + h, cy + a], [cx + a, cy + a], [cx + a, cy + h], [cx - a, cy + h], [cx - a, cy + a], [cx - h, cy + a], [cx - h, cy - a], [cx - a, cy - a]])}" ${attrs}/>`;
  }
  if (kind === "st") {
    const star = Array.from({ length: 10 }, (_, i) => {
      const r = i % 2 ? h * 0.45 : h;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      return [cx + Math.cos(a) * r, cy + 0.06 * s + Math.sin(a) * r];
    });
    return `<polygon points="${pts(star)}" ${attrs}/>`;
  }
  return "";
}
const token = (value, cx, cy, s = 30) => (value == null ? "" : SHAPE[value] ? glyph(value, cx, cy, s) : T(cx, cy + 1, value, { size: 24, weight: 500 }));
// 모양 = □ 줄(답 칸). values 가 있으면 칸에 수를 쓴다(답 그림).
function answerRows(kinds, x, y, values, gap = 42) {
  return kinds.map((kind, i) => {
    const cy = y + i * gap + 16;
    return `${glyph(kind, x + 15, cy, 28)}${T(x + 44, cy + 1, "=", { size: 16, weight: 500 })}${blank(x + 62, cy - 16, 62, 32, values?.[kind])}`;
  }).join("");
}

// ── 세로 덧셈 판(13~18번) ──
// rows: [[...칸], ...] 마지막 줄 앞에 가로선, plusRow 줄 왼쪽에 「+」. 칸 값: 숫자/글자 또는 모양 이름(ci·sq·di·tr·cr·st)
function columnSum(rows, ox, oy, { cell = 44, plusRow = rows.length - 2, lead = 34 } = {}) {
  const columns = Math.max(...rows.map((row) => row.length));
  let body = "";
  rows.forEach((row, r) => {
    const cy = oy + r * cell + cell / 2 + (r === rows.length - 1 ? 12 : 0);
    const shift = columns - row.length;
    row.forEach((value, c) => { body += token(value, ox + lead + (c + shift) * cell + cell / 2, cy, 34); });
    if (r === plusRow) body += T(ox + lead / 2, cy, "+", { size: 22, weight: 500 });
  });
  const ly = oy + (rows.length - 1) * cell + 6;
  body += seg([ox + 2, ly], [ox + lead + columns * cell, ly], { stroke: INK, width: 1.4 });
  return { body, width: lead + columns * cell, height: rows.length * cell + 12 };
}
function sumFigure(n, label, sums, answerKinds, values, { columnsOfAnswers = [answerKinds] } = {}) {
  const pad = 16;
  const parts = sums.map((rows) => columnSum(rows.rows, 0, 0, rows.opts));
  const gapX = 34;
  const innerW = parts.reduce((s, p) => s + p.width, 0) + gapX * (parts.length - 1);
  const innerH = Math.max(...parts.map((p) => p.height));
  const panelW = innerW + pad * 2;
  const answersW = columnsOfAnswers.length * 130 + (columnsOfAnswers.length - 1) * 40;
  const width = Math.max(panelW, answersW) + 12;
  const px = (width - panelW) / 2;
  let body = `<rect x="${f1(px)}" y="4" width="${f1(panelW)}" height="${f1(innerH + pad * 2)}" rx="14" fill="${PANEL.fill}" stroke="${PANEL.stroke}" stroke-width="1.6"/>`;
  let x = px + pad;
  sums.forEach((spec, i) => {
    const again = columnSum(spec.rows, x, 4 + pad, spec.opts);
    body += again.body;
    x += parts[i].width + gapX;
  });
  const ay = innerH + pad * 2 + 26;
  const ax = (width - answersW) / 2;
  columnsOfAnswers.forEach((kinds, i) => { body += answerRows(kinds, ax + i * 170, ay, values); });
  const height = ay + Math.max(...columnsOfAnswers.map((k) => k.length)) * 42 + 4;
  return svg(f1(width), f1(height), label, body, Math.round(width * 1.05));
}

// ── 그림마다 ──
const FIG = {};

// 1. 격자판 위 색칠된 도형(7×6칸)
FIG[1] = () => {
  const c = 34, p = 6;
  const P = ([x, y]) => [p + x * c, p + y * c];
  const shape = [[3, 1], [4, 1], [5, 2], [5, 4], [6, 5], [1, 5], [2, 4], [2, 2]].map(P);
  let body = `<rect x="${p}" y="${p}" width="${7 * c}" height="${6 * c}" fill="#fff"/>${poly(shape, { fill: SHADE, stroke: "none", opacity: 0.7 })}`;
  for (let i = 0; i <= 7; i += 1) body += seg(P([i, 0]), P([i, 6]), { stroke: GRID, width: 1 });
  for (let j = 0; j <= 6; j += 1) body += seg(P([0, j]), P([7, j]), { stroke: GRID, width: 1 });
  body += poly(shape, { stroke: INK, width: 1.8 });
  return svg(7 * c + p * 2, 6 * c + p * 2, "격자판 위에 색칠된 도형", body, 280);
};

// 2. 격자판 위 정사각형 규칙 (1)(2)(3) …
FIG[2] = () => {
  const c = 32, p = 4;
  const P = ([x, y]) => [p + x * c, p + y * c];
  let body = `<rect x="${p}" y="${p}" width="${9 * c}" height="${6 * c}" fill="#fff"/>`;
  const sq = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(P);
  const dia = (cx, cy, r) => [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]].map(P);
  body += poly(sq(1, 2, 2, 3), { fill: SHADE, stroke: "none", opacity: 0.6 });
  body += poly(dia(4, 3, 1), { fill: SHADE, stroke: "none", opacity: 0.6 });
  body += poly(sq(6, 2, 8, 4), { fill: SHADE, stroke: "none", opacity: 0.6 });
  for (let i = 0; i <= 9; i += 1) body += seg(P([i, 0]), P([i, 6]), { stroke: GRID, width: 1 });
  for (let j = 0; j <= 6; j += 1) body += seg(P([0, j]), P([9, j]), { stroke: GRID, width: 1 });
  body += poly(dia(4, 3, 1), { stroke: INK, width: 1.6 });
  body += poly(sq(6, 2, 8, 4), { stroke: INK, width: 1.6 }) + poly(dia(7, 3, 1), { stroke: INK, width: 1.6 });
  body += [sq(1, 2, 2, 3), sq(3.5, 2.5, 4.5, 3.5), sq(6.5, 2.5, 7.5, 3.5)].map((s) => poly(s, { stroke: UT.red, width: 2 })).join("");
  [["(1)", 1.5], ["(2)", 4], ["(3)", 7]].forEach(([label, x]) => { body += T(...P([x, 0.5]), label, { size: 15, weight: 600 }); });
  body += T(...P([8.55, 2.9]), "…", { size: 15 });
  return svg(9 * c + p * 2, 6 * c + p * 2, "격자판 위에 규칙으로 만든 정사각형", body, 330);
};

// 3. 정육각형 두 개(12조각 · 18조각)
FIG[3] = () => {
  const R = 72;
  const at = (cx, cy, deg, r = R) => [cx + Math.cos((deg * Math.PI) / 180) * r, cy + Math.sin((deg * Math.PI) / 180) * r];
  const cross = ([x1, y1], [x2, y2], [x3, y3], [x4, y4]) => {
    const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
    return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
  };
  const hex = (cx, cy) => [-90, -30, 30, 90, 150, 210].map((deg) => at(cx, cy, deg));
  // 왼쪽: 지름 셋 + 안의 큰 정삼각형
  const a = [82, 84];
  const [aT, aUR, aLR, aB, aLL, aUL] = hex(...a);
  const X = cross(aT, aLR, a, aUR);
  const Y = cross(aT, aLL, a, aUL);
  let body = poly([aT, a, X], { fill: SHADE, stroke: "none", opacity: 0.75 }) + poly([aLL, a, Y], { fill: SHADE, stroke: "none", opacity: 0.75 });
  body += [[aT, aB], [aUL, aLR], [aUR, aLL], [aT, aLL], [aT, aLR], [aLL, aLR]].map(([p, q]) => seg(p, q)).join("");
  body += poly([aT, aUR, aLR, aB, aLL, aUL], { width: 1.8 });
  // 오른쪽: 지름 셋 + 가운데에서 R/√3 떨어진 여섯 점(각 점을 가운데와 이웃 꼭짓점 둘에 잇는다)
  const b = [258, 84];
  const [bT, bUR, bLR, bB, bLL, bUL] = hex(...b);
  const Q = (deg) => at(...b, deg, R / Math.sqrt(3));
  const shaded = [[Q(240), bT, b], [bT, bUR, Q(300)], [bUR, bLR, Q(0)], [bLR, bB, Q(60)], [Q(120), bB, b], [bUL, Q(180), b]];
  body += shaded.map((tri) => poly(tri, { fill: SHADE, stroke: "none", opacity: 0.75 })).join("");
  body += [[bT, bB], [bUL, bLR], [bUR, bLL]].map(([p, q]) => seg(p, q)).join("");
  body += [0, 60, 120, 180, 240, 300].map((deg) => seg(b, Q(deg)) + seg(Q(deg), at(...b, deg - 30)) + seg(Q(deg), at(...b, deg + 30))).join("");
  body += poly([bT, bUR, bLR, bB, bLL, bUL], { width: 1.8 });
  body += fracSlot(a[0], 176) + fracSlot(b[0], 176);
  return svg(340, 246, "조각으로 나눈 정육각형 두 개와 분수 빈칸", body, 360);
};

// 4. 큰 정삼각형을 나눈 조각
FIG[4] = () => {
  const s = 220, h = (s * Math.sqrt(3)) / 2;
  const A = [130, 8], L = [130 - s / 2, 8 + h], R = [130 + s / 2, 8 + h];
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const ML = mid(A, L), MR = mid(A, R), MB = mid(L, R);
  const cen = (p, q, r) => [(p[0] + q[0] + r[0]) / 3, (p[1] + q[1] + r[1]) / 3];
  const G1 = cen(A, ML, MR), G2 = cen(MR, MB, R);
  let body = poly([L, ML, MB], { fill: SHADE, stroke: "none", opacity: 0.75 }) + poly([G1, ML, MR], { fill: SHADE, stroke: "none", opacity: 0.75 }) + poly([MR, G2, R], { fill: SHADE, stroke: "none", opacity: 0.75 });
  body += [[ML, MR], [MR, MB], [MB, ML], [G1, A], [G1, ML], [G1, MR], [G2, MR], [G2, MB], [G2, R]].map(([p, q]) => seg(p, q)).join("");
  body += poly([A, L, R], { width: 1.8 });
  body += fracSlot(130, 8 + h + 18);
  return svg(260, Math.ceil(8 + h + 18 + 70), "큰 정삼각형을 나눈 조각과 분수 빈칸", body, 260);
};

// 5. 정사각형을 나눈 조각
FIG[5] = () => {
  const o = 10, S = 160, i0 = 50, i1 = 130, c = [90, 90];
  let body = poly([c, [i1, i0], [i1, i1]], { fill: SHADE, stroke: "none", opacity: 0.75 }) + poly([c, [i1, i1], [i0, i1]], { fill: SHADE, stroke: "none", opacity: 0.75 });
  body += seg([o, o], [o + S, o + S]) + seg([o + S, o], [o, o + S]);
  body += `<rect x="${i0}" y="${i0}" width="${i1 - i0}" height="${i1 - i0}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
  body += `<rect x="${o}" y="${o}" width="${S}" height="${S}" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
  body += fracSlot(90, 186);
  return svg(180, 254, "정사각형을 나눈 조각과 분수 빈칸", body, 200);
};

// 6. 모눈종이 위 두 번 접은 리본 끈(앞면 진하게 · 접혀 보이는 뒷면 연하게)
FIG[6] = () => {
  const c = 32, p = 4;
  const P = ([x, y]) => [p + x * c, p + y * c];
  let body = `<rect x="${p}" y="${p}" width="${8 * c}" height="${6 * c}" fill="#fff"/>`;
  for (let i = 0; i <= 8; i += 1) body += seg(P([i, 0]), P([i, 6]), { stroke: GRID, width: 1 });
  for (let j = 0; j <= 6; j += 1) body += seg(P([0, j]), P([8, j]), { stroke: GRID, width: 1 });
  body += poly([[1, 4], [4, 4], [4, 5], [1, 5]].map(P), { fill: SHADE, stroke: INK, width: 1.5 });
  body += poly([[5, 1], [7, 1], [7, 2], [5, 2]].map(P), { fill: SHADE, stroke: INK, width: 1.5 });
  body += poly([[4, 5], [4, 2], [5, 1], [5, 4]].map(P), { fill: SHADE_SOFT, stroke: INK, width: 1.5 });
  const y = p + 6 * c + 16;
  body += blank(p + 3 * c + 2, y, 50, 32) + T(p + 3 * c + 58, y + 17, "cm", { size: 16, anchor: "start", weight: 500 });
  return svg(8 * c + p * 2, y + 36, "모눈종이 위에 두 번 접은 리본 끈", body, 290);
};

// 7. 수직선 ㉠(11)~㉡(29)을 똑같이 나눈 것
FIG[7] = () => {
  const xs = [30, 180, 330], y = 64;
  let body = seg([xs[0], y], [xs[2], y], { width: 1.6 });
  body += xs.map((x) => seg([x, y - 8], [x, y + 8], { width: 1.4 })).join("");
  body += arc(xs[0], xs[1], y - 8, 22) + arc(xs[1], xs[2], y - 8, 22);
  body += [105, 255].map((x) => `<circle cx="${x}" cy="${y - 30}" r="4.5" fill="#fff" stroke="${UT.orange}" stroke-width="1.6"/>`).join("");
  body += circ(xs[0] - 4, y - 34, "ㄱ", 12, 14) + circ(xs[2] + 4, y - 34, "ㄴ", 12, 14);
  body += T(xs[0], y + 26, "11", { size: 20, weight: 500 }) + T(xs[2], y + 26, "29", { size: 20, weight: 500 });
  body += blank(xs[1] - 28, y + 10, 56, 34);
  return svg(360, 112, "수직선 위 두 점 사이를 똑같이 나눈 그림", body, 380);
};

// 8. 수직선 A B C D와 거리
FIG[8] = () => {
  const y = 64, A = 22, B = 137, C = 215, D = 372;
  let body = seg([A, y], [D, y], { width: 1.6 });
  body += arc(A, C, y, 30, -1) + arc(B, D, y, 30, -1) + arc(B, C, y, 12, 1);
  body += [A, B, C, D].map((x) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${UT.dot}"/>`).join("");
  body += T((A + C) / 2, y - 31, "21cm", { size: 19, weight: 500, halo: true }) + T((B + D) / 2, y - 31, "26cm", { size: 19, weight: 500, halo: true });
  body += T((B + C) / 2, y + 24, "14cm", { size: 18, weight: 500, halo: true });
  body += [["A", A], ["B", B], ["C", C], ["D", D]].map(([n, x]) => T(x + (n === "B" ? -8 : n === "C" ? 8 : 0), y + 24, n, { size: 19, weight: 500 })).join("");
  return svg(394, 100, "수직선 위의 점 A, B, C, D 사이의 거리", body, 400);
};

// 9. 두 막대의 길이 비교 (1)(2)
const BAR = { fill: UT.yellowSoft, stroke: UT.paperLine };
const bar = (x, y, w, h, ch) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${h}" fill="${BAR.fill}" stroke="${BAR.stroke}" stroke-width="1.5"/>${ch ? circ(x + w / 2, y + h / 2, ch, 11, 13) : ""}`;
FIG[9] = () => {
  const x0 = 40;
  const part = (oy, unit, many, total) => {
    let body = "";
    for (let i = 0; i < many; i += 1) body += bar(x0 + i * unit, oy, unit, 34, "ㄱ");
    body += bar(x0, oy + 34, unit * many, 34, "ㄴ");
    const by = oy + 140;
    body += arc(x0, x0 + unit, by, 22, -1) + arc(x0 + unit, x0 + unit * (many + 1), by, 22, -1);
    body += bar(x0, by, unit, 34, "ㄱ") + bar(x0 + unit, by, unit * many, 34, "ㄴ");
    body += arc(x0, x0 + unit * (many + 1), by + 34, 22, 1);
    body += T(x0 + (unit * (many + 1)) / 2, by + 34 + 22, total, { size: 19, weight: 500, halo: true });
    const slot = (cx) => blank(cx - 18, by - 42, 36, 32) + T(cx + 23, by - 25, "cm", { size: 18, anchor: "start", weight: 500, halo: true });
    body += slot(x0 + unit / 2 - 8) + slot(x0 + unit + (unit * many) / 2 - 8);
    return body;
  };
  let body = T(18, 14, "(1)", { size: 18 }) + part(6, 100, 2, "18cm");
  body += T(18, 262, "(2)", { size: 18 }) + part(254, 67, 5, "24cm");
  return svg(452, 496, "두 막대의 길이를 비교한 그림 두 개", body, 400);
};

// 10. 막대 ㉠(25cm)과 성냥개비, 막대 ㉡ 두 개
const stick = (x, y, w) => `<line x1="${f1(x + 2)}" y1="${y}" x2="${f1(x + w - 4)}" y2="${y}" stroke="#bf8a42" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="${f1(x + w - 3)}" cy="${y}" rx="3.6" ry="3" fill="#df4c43"/>`;
FIG[10] = () => {
  const u = 40, x0 = 12;
  const X = (k) => x0 + k * u;
  let body = [0, 8, 12].map((k) => seg([X(k), 4], [X(k), 118], { stroke: DASH, width: 1.1, dash: "4 3" })).join("");
  body += `<rect x="${X(0)}" y="16" width="${5 * u}" height="38" fill="${BAR.fill}" stroke="${BAR.stroke}" stroke-width="1.5"/>${circ(X(1.3), 35, "ㄱ", 12, 14)}${T(X(1.3) + 16, 35.5, "=25cm", { size: 22, anchor: "start", weight: 500 })}`;
  for (let k = 5; k < 12; k += 1) body += stick(X(k), 35, u);
  for (let k = 0; k < 4; k += 1) body += stick(X(k), 86, u);
  body += bar(X(4), 67, 4 * u, 38, "ㄴ") + bar(X(8), 67, 4 * u, 38, "ㄴ");
  return svg(x0 * 2 + 12 * u, 122, "막대 ㉠과 성냥개비, 막대 ㉡ 두 개를 나란히 놓은 그림", body, 470);
};

// 11. 수직선 ㉮(30cm)·㉯(42cm)·㉰(54cm), 3칸과 4칸
FIG[11] = () => {
  const y = 72;
  const xs = [36, 114, 191, 269, 327, 385, 443, 501];
  let body = seg([xs[0], y], [xs[7], y], { width: 1.6 }) + xs.map((x) => seg([x, y - 10], [x, y + 10], { width: 1.4 })).join("");
  for (let i = 0; i < 7; i += 1) {
    const a = xs[i], b = xs[i + 1], m = (a + b) / 2, top = y - 10 - 16;
    body += arc(a, b, y - 10, 16, -1);
    body += i < 3
      ? `<path d="M${f1(m - 3.5)} ${top - 4}V${top + 4}M${f1(m + 3.5)} ${top - 4}V${top + 4}M${f1(m - 3.5)} ${top}H${f1(m + 3.5)}" stroke="${UT.purple}" stroke-width="1.6" fill="none"/>`
      : `<circle cx="${f1(m)}" cy="${top}" r="4.4" fill="#fff" stroke="${UT.orange}" stroke-width="1.6"/>`;
  }
  body += circ(xs[0], y - 44, "가", 12, 13) + circ(xs[3], y - 44, "나", 12, 13) + circ(xs[7], y - 44, "다", 12, 13);
  body += T(xs[0], y + 30, "30cm", { size: 21, weight: 500 }) + circ(xs[1], y + 30, "ㄱ", 12, 14) + T(xs[3], y + 30, "42cm", { size: 21, weight: 500 }) + circ(xs[6], y + 30, "ㄴ", 12, 14) + T(xs[7], y + 30, "54cm", { size: 21, weight: 500 });
  return svg(538, 116, "세 점 ㉮, ㉯, ㉰를 3칸과 4칸으로 나눈 수직선", body, 470);
};

// 12. 연필과 막대 ㉠ 두 개, 막대 ㉡ 세 개
const pencil = (x, cy, len, h = 22) => {
  const top = cy - h / 2;
  const tipStart = x + len - 34, lead = x + len - 9;
  return `<path d="M${x + 8} ${top}H${x + 22}V${top + h}H${x + 8}A8 8 0 0 1 ${x} ${top + h - 8}V${top + 8}A8 8 0 0 1 ${x + 8} ${top}Z" fill="#f7a8c8" stroke="${UT.pink}" stroke-width="1.4"/>`
    + `<rect x="${x + 22}" y="${top - 1}" width="12" height="${h + 2}" fill="#d9d4c7" stroke="${UT.line}" stroke-width="1.2"/>`
    + `<rect x="${x + 34}" y="${top}" width="${f1(tipStart - x - 34)}" height="${h}" fill="${UT.yellow}" stroke="#d9a400" stroke-width="1.4"/>`
    + `<line x1="${x + 36}" y1="${cy}" x2="${f1(tipStart - 2)}" y2="${cy}" stroke="#d9a400" stroke-width="1.2"/>`
    + `<polygon points="${pts([[tipStart, top], [x + len, cy], [tipStart, top + h]])}" fill="${UT.paper}" stroke="${UT.paperLine}" stroke-width="1.3" stroke-linejoin="round"/>`
    + `<polygon points="${pts([[lead, cy - 3.2], [x + len, cy], [lead, cy + 3.2]])}" fill="${INK}"/>`;
};
FIG[12] = () => {
  const x0 = 10, L = 440;
  let body = pencil(x0, 20, L);
  body += bar(x0, 42, L / 2, 30, "ㄱ") + bar(x0 + L / 2, 42, L / 2, 30, "ㄱ");
  for (let i = 0; i < 3; i += 1) body += bar(x0 + (i * L) / 3, 84, L / 3, 30, "ㄴ");
  return svg(L + x0 * 2, 120, "연필과 막대 ㉠ 두 개, 막대 ㉡ 세 개", body, 450);
};

// 13~18. 같은 모양은 같은 숫자
FIG[13] = (v) => sumFigure(13, "모양 덧셈식", [{ rows: [["di", "ci"], ["sq", "ci"], ["sq", "sq", 6]] }], ["di", "sq", "ci"], v.values);
FIG[14] = (v) => sumFigure(14, "모양 덧셈식", [{ rows: [[1, "sq", "ci"], ["ci", 4], ["di", "di", "di"]] }], ["di", "sq", "ci"], v.values);
FIG[15] = (v) => sumFigure(15, "모양 덧셈식", [{ rows: [["ci", "cr", "di"], ["di", "tr"], ["tr", "sq", "sq", "ci"]] }], ["di", "sq", "ci", "tr", "cr"], v.values, { columnsOfAnswers: [["di", "sq", "ci"], ["tr", "cr"]] });
FIG[16] = (v) => sumFigure(16, "모양 덧셈식", [{ rows: [[3, "sq"], ["sq", 4], ["di", "di", "di"]] }], ["sq", "di"], v.values);
FIG[17] = (v) => sumFigure(17, "모양 덧셈식", [{ rows: [["sq", "di"], ["sq", "di"], ["sq", "di"], [7, "di"]] }], ["di", "sq"], v.values);
FIG[18] = (v) => sumFigure(18, "모양 덧셈식 두 개", [
  { rows: [[null], ["ci"], ["ci"], ["di"]], opts: { plusRow: 2 } },
  { rows: [["ci", "di"], ["ci", "di"], ["ci", "di"], ["sq", "ci"]] }
], ["di", "sq", "ci"], v.values);

// 19. 모양을 수로 나타낸 것
FIG[19] = (v) => {
  const s = 21, step = 25;
  const shapes = (list, x, y) => list.map((k, i) => glyph(k, x + i * step + s / 2, y, s)).join("");
  const W = (list) => (list.length - 1) * step + s + 14;
  const given = [[["ci", "st"], 12], [["ci", "ci", "st"], 22], [["di", "ci", "st"], 27], [["di", "di", "ci", "st", "st"], 44]];
  const widths = given.map(([list]) => W(list));
  const gap = 20;
  const total = widths.reduce((a, b) => a + b, 0) + gap * 3;
  let body = `<rect x="4" y="4" width="452" height="104" rx="12" fill="#fff" stroke="${UT.soft}" stroke-width="1.6"/>`;
  let x = (460 - total) / 2;
  body += seg([x + 20, 42], [x + total - 20, 42], { stroke: UT.line, width: 1.3 });
  given.forEach(([list, value], i) => {
    const w = widths[i];
    body += `<rect x="${f1(x)}" y="22" width="${f1(w)}" height="40" fill="#fff" stroke="${UT.line}" stroke-width="1.4"/>${shapes(list, x + 7, 42)}${T(x + w / 2, 84, value, { size: 21, weight: 500 })}`;
    x += w + gap;
  });
  const asked = [["ci", "ci", "ci", "st"], ["di", "di", "ci", "st"], ["di", "ci", "ci", "st", "st"]];
  asked.forEach((list, i) => {
    const cx = 80 + i * 150, w = 140;
    body += circ(cx - w / 2 + 9, 132, String(i + 1), 9, 12);
    body += `<rect x="${cx - w / 2}" y="146" width="${w}" height="40" fill="#fff" stroke="${UT.line}" stroke-width="1.4"/>${shapes(list, cx - W(list) / 2 + 7, 166)}`;
    body += blank(cx - 32, 198, 64, 36, v.values?.[i]);
  });
  return svg(460, 240, "모양을 수로 나타낸 보기와 구할 모양 세 개", body, 470);
};

// 20. 3×3 마방진
FIG[20] = (v) => {
  const c = 62, x0 = 64, y0 = 4;
  const shown = v.values || [null, null, null, 4, null, null, 5, 10, 3];
  let body = "";
  shown.forEach((value, i) => {
    const x = x0 + (i % 3) * c, y = y0 + Math.floor(i / 3) * c;
    body += `<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#fff" stroke="${UT.box}" stroke-width="1.6"/>${value == null ? "" : T(x + c / 2, y + c / 2 + 1, value, { size: 24, weight: 500 })}`;
  });
  body += T(x0 + 62, y0 + 3 * c + 38, "합 :", { size: 17, weight: 500 }) + blank(x0 + 92, y0 + 3 * c + 20, 66, 38, v.sum);
  return svg(314, y0 + 3 * c + 64, "가운데 줄과 아래 줄 일부가 채워진 3×3 마방진", body, 260);
};

// 21. 4×4 마방진(색칠된 빈 칸)
FIG[21] = () => {
  const c = 56, x0 = 4, y0 = 4;
  const shown = [12, 7, null, null, null, null, null, null, null, null, 6, null, null, 2, null, 1];
  let body = "";
  shown.forEach((value, i) => {
    const x = x0 + (i % 4) * c, y = y0 + Math.floor(i / 4) * c;
    body += `<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="${i === 9 ? SHADE : "#fff"}" fill-opacity="${i === 9 ? 0.75 : 1}" stroke="${UT.box}" stroke-width="1.6"/>${value == null ? "" : T(x + c / 2, y + c / 2 + 1, value, { size: 22, weight: 500 })}`;
  });
  return svg(c * 4 + 8, c * 4 + 8, "색칠된 빈 칸이 있는 4×4 마방진", body, 240);
};

// 22. 오각진(위 꼭짓점부터 시계 방향: 꼭짓점·변 가운데 번갈아)
FIG[22] = (v) => {
  const cx = 150, cy = 146, radius = 112;
  const vertices = Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
  });
  const spots = vertices.flatMap((p, i) => { const q = vertices[(i + 1) % 5]; return [p, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]]; });
  const shown = v.values || [null, 9, 1, 10, null, null, null, null, 2, null];
  let body = poly(vertices, { stroke: UT.box, width: 1.6 });
  body += spots.map(([x, y], i) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="21" fill="#fff" stroke="${UT.box}" stroke-width="1.7"/>${shown[i] == null ? "" : T(x, y + 1, shown[i], { size: 19, weight: 500 })}`).join("");
  body += T(cx, cy + 6, "합 : 14", { size: 18, weight: 600 });
  return svg(300, 284, "빈 원이 있는 오각진", body, 280);
};

// 23. 네 칸 그림으로 나타낸 수
FIG[23] = (v) => {
  const s = 27;
  const cells = (bits, x, y, size = s) => bits.map((on, i) => `<rect x="${f1(x + i * size)}" y="${f1(y)}" width="${size}" height="${size}" fill="${on ? SHADE : "#fff"}" fill-opacity="${on ? 0.8 : 1}" stroke="${INK}" stroke-width="1.2"/>`).join("");
  const examples = [[0, 0, 0, 1], [0, 0, 1, 0], [0, 0, 1, 1], [0, 1, 0, 0], [0, 1, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1]];
  let body = `<rect x="4" y="4" width="492" height="166" rx="12" fill="#fff" stroke="${UT.soft}" stroke-width="1.6"/>`;
  examples.forEach((bits, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 20 + col * 120, y = 18 + row * 76;
    body += cells(bits, x, y) + T(x + 2 * s, y + s + 18, i + 1, { size: 20, weight: 500 });
  });
  const asks = [[1, 0, 1, 0], [1, 1, 0, 1]];
  asks.forEach((bits, i) => {
    const cx = 150 + i * 200, size = 40;
    body += cells(bits, cx - 2 * size, 190, size) + blank(cx - 30, 246, 60, 36, v.values?.[i]);
  });
  return svg(500, 288, "수를 네 칸 그림으로 나타낸 보기와 구할 그림 두 개", body, 470);
};

// 24. 삼각진 두 개(1~6) — 가장 클 때 · 가장 작을 때
FIG[24] = (v) => {
  const P = [[0, -78], [-38, -12], [38, -12], [-76, 54], [0, 54], [76, 54]];
  const tri = (ox, oy, shown) => {
    const p = P.map(([x, y]) => [ox + x, oy + y]);
    return [[0, 3], [0, 5], [3, 5]].map(([a, b]) => seg(p[a], p[b], { stroke: UT.box, width: 1.5 })).join("")
      + p.map(([x, y], i) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="21" fill="${[0, 3, 5].includes(i) ? UT.tint : "#fff"}" stroke="${UT.box}" stroke-width="1.7"/>${shown?.[i] == null ? "" : T(x, y + 1, shown[i], { size: 18, weight: 500 })}`).join("");
  };
  const L = 112, R = 342;
  let body = tri(L, 104, v.values?.[0]) + tri(R, 104, v.values?.[1]);
  body += T(L + 28, 208, "가장 클 때 합 :", { size: 17, weight: 500, anchor: "end" }) + blank(L + 34, 191, 54, 34, v.sums?.[0]);
  body += T(R + 28, 208, "가장 작을 때 합 :", { size: 17, weight: 500, anchor: "end" }) + blank(R + 34, 191, 54, 34, v.sums?.[1]);
  return svg(454, 232, "꼭짓점과 변에 원이 놓인 삼각형 두 개", body, 450);
};

// 25. 수직선 위 여섯 점 사이의 거리
FIG[25] = () => {
  const y = 72;
  const X = { A: 22, B: 74, C: 143, D: 212, E: 408, F: 450 };
  let body = seg([X.A, y], [X.F, y], { width: 1.6 });
  body += arc(X.A, X.D, y, 34, -1) + arc(X.C, X.E, y, 34, -1);
  body += arc(X.A, X.C, y, 30, 1) + arc(X.B, X.D, y, 42, 1) + arc(X.B, X.F, y, 66, 1);
  body += Object.values(X).map((x) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${UT.dot}"/>`).join("");
  body += T((X.A + X.D) / 2, y - 34, "52", { size: 19, weight: 500, halo: true }) + T((X.C + X.E) / 2, y - 34, "58", { size: 19, weight: 500, halo: true });
  body += T((X.A + X.C) / 2, y + 30, "32", { size: 19, weight: 500, halo: true }) + T((X.B + X.D) / 2, y + 42, "34", { size: 19, weight: 500, halo: true }) + T((X.B + X.F) / 2, y + 66, "88", { size: 19, weight: 500, halo: true });
  body += Object.entries(X).map(([n, x]) => T(x + ({ A: -9, B: -9, C: 9, D: 9, F: 9 }[n] || 0), y + 17, n, { size: 17, weight: 500, halo: true })).join("");
  return svg(472, 150, "수직선 위의 점 A부터 F까지와 거리", body, 470);
};

// ── 문항(원문 문장 그대로) ──
const SAME_SHAPE = "다음 식에서 같은 모양은 같은 숫자를 나타냅니다. 각 도형이 나타내는 숫자를 구하시오.";
const ORIGINALS = {
  1: { prompt: "다음 격자판에서 작은 정사각형 1개의 넓이를 단위넓이 1이라고 할 때, 색칠된 도형의 넓이를 구하시오." },
  2: { prompt: "격자판 위에 다음과 같은 규칙으로 정사각형을 만들었습니다. 가장 작은 정사각형의 넓이가 1일 때, 1번째부터 5번째까지 가장 바깥에 있는 정사각형 넓이의 합을 구하시오." },
  3: { prompt: "다음 그림은 정육각형을 모양과 크기가 같은 조각으로 나눈 것입니다. 색칠된 부분을 분수로 나타내시오.", responseKind: "fill" },
  4: { prompt: "다음 그림은 큰 정삼각형을 나눈 조각입니다. 색칠된 부분을 분수로 나타내시오.", responseKind: "fill" },
  5: { prompt: "다음 그림은 정사각형을 나눈 조각입니다. 색칠된 부분을 분수로 나타내시오.", responseKind: "fill" },
  6: { prompt: "한 칸의 길이가 1cm인 모눈종이 위에 리본 끈을 2번 접은 모양이 다음과 같다면, 리본 끈의 길이는 몇 cm입니까?", responseKind: "fill" },
  7: { prompt: "다음 그림은 수직선에서 두 점 ㉠과 ㉡사이의 거리를 똑같은 간격으로 나눈 것입니다. ㉠과 ㉡의 중간 수를 구하시오.", responseKind: "fill" },
  8: { prompt: "다음 그림은 수직선 위의 점과 점 사이의 거리를 나타낸 것입니다. A와 D 사이의 거리를 구하시오." },
  9: { prompt: "다음 그림은 두 막대의 길이를 비교한 것입니다. 두 막대의 길이를 각각 구하시오.", responseKind: "fill" },
  10: { prompt: "다음 그림에서 막대 ㉠의 길이가 25cm일 때, 막대 ㉡의 길이를 구하시오." },
  11: { prompt: "다음 그림은 수직선에서 두 점 ㉮와 ㉯ 사이의 거리는 똑같은 간격으로 3칸으로 나누고, 두 점 ㉯와 ㉰사이의 거리는 똑같은 간격으로 4칸으로 나눈 것입니다. 두 점 ㉠과 ㉡사이의 거리는 얼마입니까?" },
  12: { prompt: "막대 ㉠, ㉡, ㉢이 있는데 ㉢의 길이는 ㉠에서 ㉡을 잘라낸 길이와 같습니다. 연필의 길이를 막대 ㉠으로 재면 2번이고, 막대 ㉡으로 재면 3번입니다. 연필의 길이를 막대 ㉢으로 재면 몇 번입니까?" },
  13: { prompt: "다음 계산식에서 같은 모양은 같은 숫자를 나타냅니다. 각 도형이 나타내는 숫자를 구하시오.", responseKind: "fill" },
  14: { prompt: SAME_SHAPE, responseKind: "fill" },
  15: { prompt: SAME_SHAPE, responseKind: "fill" },
  16: { prompt: SAME_SHAPE, responseKind: "fill" },
  17: { prompt: SAME_SHAPE, responseKind: "fill" },
  18: { prompt: "다음 식에서 ○+○=◇이고 같은 모양은 같은 숫자를 나타냅니다. 각 도형이 나타내는 숫자를 구하시오.", responseKind: "fill" },
  19: { prompt: "다음은 어떤 도형을 수로 나타낸 것입니다. 아래 도형이 나타내는 수를 구하시오.", responseKind: "fill" },
  20: { prompt: "아래 마방진의 한 줄의 합을 구하고, 가로, 세로, 대각선의 합이 모두 같아지도록 빈 칸을 채우시오.", responseKind: "fill" },
  21: { prompt: "다음 그림은 4×4 마방진으로 가로, 세로, 대각선의 네 수의 합이 모두 같습니다. 색칠된 빈 칸에 들어갈 알맞은 수를 구하시오." },
  22: { prompt: "다음 오각진의 빈 원 안에 1부터 10까지의 수를 한 번씩 넣어 한 줄 위에 있는 세 수의 합이 모두 14가 되게 만드시오.", responseKind: "drawing" },
  23: { prompt: "다음은 수를 규칙에 따라 그림으로 나타낸 것입니다. 아래 그림이 나타내는 수를 구하시오.", responseKind: "fill" },
  24: { prompt: "삼각형의 꼭짓점과 변에 놓인 ○안에 1에서 6까지의 수를 넣을 때 한 줄의 합이 가장 클 때와 가장 작을 때를 각각 구하시오.", responseKind: "fill" },
  25: { prompt: "다음 그림은 수직선 위에 6개의 점 사이의 거리를 나타낸 것입니다. 두 점 E와 F 사이의 거리를 구하시오." }
};

export const numbers = Object.freeze(Object.keys(ORIGINALS).map(Number));
// 원문 문항 하나 { number, prompt, visual, responseKind? } — 없는 번호는 null
export function get(number) {
  const n = Number(number);
  const item = ORIGINALS[n];
  return item ? { number: n, ...item, visual: { kind: "book3-ut", n } } : null;
}
// visual: { kind: "book3-ut", n, values?, sum?, sums? } — values 등은 답 그림(비공개 정답)에서만 온다
export function figure(visual) {
  if (!visual || visual.kind !== "book3-ut" || !FIG[visual.n]) return "";
  return FIG[visual.n](visual);
}
