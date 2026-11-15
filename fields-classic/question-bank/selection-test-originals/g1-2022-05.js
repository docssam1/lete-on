// 초1 2차 선발시험(g1-2022-05) 원문을 우리 시험지로 다시 짠 것 — 원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」.
// 문제 글·수·배치는 원문(assets/selection-tests/g1-2022-05) 그대로, 그림은 우리 색표로 새로 그렸다. 정답은 두지 않는다.
// 원문은 한 쪽에 네 문제(왼쪽 1·2, 오른쪽 3·4) — perPage 4. 답 칸이 그림 안에 있는 문항(5·7·8·10·12)은 원문처럼 「답」 줄이 없다.
// 15번 가위는 단순한 그림으로 바꿨다. 원문 글 속 도형 ◎·▣·◈ 는 그림에서 같은 모양으로 그렸다.
import { UT, esc, text, svg, box, line, conditionsBox, shape, ringed, cell, equation, equationWidth, balance, caption, f1 } from "./kit.js?v=20261114a";

export const perPage = 4;

// ── 이 회차에서 쓰는 작은 도구
// 글 줄 상자(글머리 없이 — 말한 것·번호 붙은 조건)
function plainBox(lines, { hang = false } = {}) {
  const items = lines.map((value) => `<p style="margin:0;font-size:13px;font-weight:700;line-height:1.55;color:${UT.ink};word-break:keep-all${hang ? ";padding-left:2.1em;text-indent:-2.1em" : ""}">${esc(value)}</p>`).join("");
  return `<div style="width:min(100%,440px);padding:10px 14px;border:1.5px solid ${UT.soft};border-radius:8px;background:#fdfbf5;display:grid;gap:4px">${items}</div>`;
}
const stack = (...parts) => `<div style="display:grid;gap:14px;width:100%;justify-items:center">${parts.join("")}</div>`;
// 식 여러 줄 상자(둥근 네모)
function equationBox(rows, { s = 20, gap = 4, size = 17, fill = "#fdfbf5", stroke = UT.soft, padX = 18, rowGap = 36, label = "식" } = {}) {
  const width = Math.max(...rows.map((row) => equationWidth(row, { s, gap, size }))) + padX * 2;
  const height = rows.length * rowGap + 18;
  const body = `<rect x="2" y="2" width="${f1(width - 4)}" height="${height - 4}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
    + rows.map((row, i) => equation(row, padX, 9 + rowGap / 2 + i * rowGap, { s, gap, size }).markup).join("");
  return svg(Math.ceil(width), height, label, body, Math.ceil(width) + 20);
}
// 원문 도형 ◎(겹동그라미) · ▣(네모 안 검은 네모) · ◈(마름모 안 검은 마름모)
function glyph(kind, cx, cy, s) {
  const h = s / 2;
  if (kind === "dcircle") return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(h)}" fill="${UT.redSoft}" stroke="${UT.red}" stroke-width="1.6"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(h * 0.55)}" fill="#fff" stroke="${UT.red}" stroke-width="1.6"/>`;
  if (kind === "boxdot") return `<rect x="${f1(cx - h)}" y="${f1(cy - h)}" width="${s}" height="${s}" rx="2" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="1.6"/><rect x="${f1(cx - h * 0.45)}" y="${f1(cy - h * 0.45)}" width="${f1(s * 0.45)}" height="${f1(s * 0.45)}" fill="${UT.green}"/>`;
  if (kind === "ddiamond") {
    const k = h * 0.5;
    return `<polygon points="${f1(cx)},${f1(cy - h)} ${f1(cx + h)},${f1(cy)} ${f1(cx)},${f1(cy + h)} ${f1(cx - h)},${f1(cy)}" fill="${UT.purpleSoft}" stroke="${UT.purple}" stroke-width="1.6" stroke-linejoin="round"/><polygon points="${f1(cx)},${f1(cy - k)} ${f1(cx + k)},${f1(cy)} ${f1(cx)},${f1(cy + k)} ${f1(cx - k)},${f1(cy)}" fill="${UT.purple}"/>`;
  }
  return shape(kind, cx, cy, s);
}
// 도형 표 + 오른쪽·아래 합(합은 칸 밖 글자, 빈 자리 "box"는 답 칸)
function shapeSumTable(rows, rightSums, bottomSums, { s = 42, ox = 4, oy = 4 } = {}) {
  let out = "";
  rows.forEach((row, r) => row.forEach((k, c) => { out += cell(ox + c * s, oy + r * s, s, s, "", { stroke: UT.ink }) + glyph(k, ox + c * s + s / 2, oy + r * s + s / 2, 20); }));
  const n = rows[0].length;
  rightSums.forEach((v, r) => { const cx = ox + n * s + 28, cy = oy + r * s + s / 2; out += v === "box" ? box(cx - 17, cy - 17, 34, 34, { fill: "#fff", stroke: UT.ink, width: 1.5, radius: 1 }) : text(cx, cy + 1, v, { size: 16, weight: 600 }); });
  bottomSums.forEach((v, c) => { out += text(ox + c * s + s / 2, oy + rows.length * s + 24, v, { size: 16, weight: 600 }); });
  return svg(ox + n * s + 52, oy + rows.length * s + 42, "도형 표", out, ox + n * s + 52);
}
// 삼각형 규칙 그림: n번째 = 한 변에 작은 삼각형 n개, 거꾸로 선 삼각형은 칠함
function triFigure(n, cx, bottom, a = 30) {
  const h = a * Math.sqrt(3) / 2, top = bottom - n * h;
  let out = "";
  for (let r = 0; r < n; r += 1) {
    const yt = top + r * h, yb = yt + h;
    for (let k = 0; k <= r; k += 1) out += `<polygon points="${f1(cx - r * a / 2 + k * a)},${f1(yt)} ${f1(cx - (r + 1) * a / 2 + k * a)},${f1(yb)} ${f1(cx - (r + 1) * a / 2 + (k + 1) * a)},${f1(yb)}" fill="#fff" stroke="${UT.ink}" stroke-width="1.4" stroke-linejoin="round"/>`;
    for (let k = 0; k < r; k += 1) out += `<polygon points="${f1(cx - r * a / 2 + k * a)},${f1(yt)} ${f1(cx - r * a / 2 + (k + 1) * a)},${f1(yt)} ${f1(cx - (r + 1) * a / 2 + (k + 1) * a)},${f1(yb)}" fill="${UT.shade}" stroke="${UT.ink}" stroke-width="1.4" stroke-linejoin="round"/>`;
  }
  return out;
}
function scissors(cx, cy, angle = 0) {
  return `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${angle})"><line x1="-3" y1="-14" x2="3" y2="4" stroke="${UT.ink}" stroke-width="2.6" stroke-linecap="round"/><line x1="3" y1="-14" x2="-3" y2="4" stroke="${UT.ink}" stroke-width="2.6" stroke-linecap="round"/><circle cx="-5" cy="8" r="4" fill="#fff" stroke="${UT.ink}" stroke-width="1.8"/><circle cx="5" cy="8" r="4" fill="#fff" stroke="${UT.ink}" stroke-width="1.8"/></g>`;
}
function curveArrow(x1, y1, qx, qy, x2, y2, color = UT.crease) {
  const dx = x2 - qx, dy = y2 - qy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, px = -uy, py = ux, h = 7;
  const bx = x2 - ux * h, by = y2 - uy * h;
  return `<path d="M${x1} ${y1} Q${qx} ${qy} ${f1(bx)} ${f1(by)}" fill="none" stroke="${color}" stroke-width="1.8"/><polygon points="${f1(x2)},${f1(y2)} ${f1(bx + px * 4)},${f1(by + py * 4)} ${f1(bx - px * 4)},${f1(by - py * 4)}" fill="${color}"/>`;
}
const paper = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${UT.paper}" stroke="${UT.paperLine}" stroke-width="1.6"/>`;
const dashed = (x1, y1, x2, y2, color = UT.crease) => line(x1, y1, x2, y2, { stroke: color, width: 1.3, dash: "4 3" });
const stepArrow = (x, y) => `<polygon points="${x},${y - 4} ${x + 10},${y - 4} ${x + 10},${y - 9} ${x + 18},${y} ${x + 10},${y + 9} ${x + 10},${y + 4} ${x},${y + 4}" fill="${UT.yellowSoft}" stroke="${UT.line}" stroke-width="1.2"/>`;
// 치수 표시(점선 호 + 글자)
function dimArc(x1, y1, x2, y2, bend, label, { lx, ly } = {}) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const nx = -(y2 - y1), ny = x2 - x1, len = Math.hypot(nx, ny) || 1;
  const qx = mx + nx / len * bend, qy = my + ny / len * bend;
  const tx = lx ?? (mx + nx / len * bend * 0.55), ty = ly ?? (my + ny / len * bend * 0.55);
  const w = String(label).length * 8.5 + 10;
  return `<path d="M${f1(x1)} ${f1(y1)} Q${f1(qx)} ${f1(qy)} ${f1(x2)} ${f1(y2)}" fill="none" stroke="${UT.line}" stroke-width="1.1" stroke-dasharray="4 3"/>`
    + (label ? `<rect x="${f1(tx - w / 2)}" y="${f1(ty - 9)}" width="${f1(w)}" height="18" fill="#fff"/>${text(tx, ty, label, { size: 14, weight: 600 })}` : "");
}

// 2. 키 비교(말한 것 + 차례 표)
const q2 = () => {
  const s = 58;
  let table = "";
  for (let i = 0; i < 5; i += 1) table += `<rect x="${2 + i * s}" y="2" width="${s}" height="30" fill="#fff" stroke="${UT.ink}" stroke-width="1.4"/>${text(2 + i * s + s / 2, 18, i + 1, { size: 14, weight: 600 })}<rect x="${2 + i * s}" y="32" width="${s}" height="32" fill="#fff" stroke="${UT.ink}" stroke-width="1.4"/>`;
  return stack(plainBox(["지현 : 나보다 키가 작은 어린이는 1명 있어.", "준영 : 나는 현우보다 키가 작아.", "윤주 : 나보다 키가 큰 어린이는 2명 있어.", "선미 : 내가 키가 가장 작아."]), svg(5 * s + 4, 66, "키 차례 표", table, 5 * s + 4));
};

// 4. 양팔 저울
const q4 = () => {
  const o = { span: 46, plate: 35, s: 14 };
  const out = balance(82, 40, [["circle", "circle"]], [["square", "square", "square", "square"]], o) + balance(258, 40, [["square"]], [["triangle", "triangle"]], o) + balance(170, 130, [["circle"]], [], o);
  return svg(340, 172, "양팔 저울 세 개", out, 340);
};

// 5. 상자 무게 차례
const q5 = () => {
  let row = "";
  for (let i = 0; i < 5; i += 1) row += box(4 + i * 62, 4, 40, 40, { fill: "#fff", stroke: UT.ink, width: 1.5, radius: 1 }) + (i < 4 ? text(4 + i * 62 + 51, 25, ">", { size: 18, weight: 500 }) : "");
  return stack(plainBox(["(1) 2번 상자는 4번 상자보다 가볍고 5번 상자보다 무겁습니다.", "(2) 4번 상자는 3번 상자보다 가볍습니다.", "(3) 5번 상자는 1번 상자보다 무겁습니다."], { hang: true }), svg(300, 48, "무거운 차례로 쓰는 칸", row, 300));
};

// 6. 도형 식
const q6 = () => equationBox([["star", "+", "circle", "=", "6"], ["diamond", "−", "star", "=", "3"], ["diamond", "+", "diamond", "=", "8"], ["circle", "−", "square", "=", "3"]], { s: 22, size: 20, rowGap: 40, label: "도형 식 네 줄" });

// 7. 오각형(○ 꼭짓점, □ 변 위의 곱)
const q7 = () => {
  const C = [[180, 34], [322, 138], [266, 302], [92, 302], [38, 136]];
  const edges = [[0, 4, 54], [0, 1, 12], [1, 2, 10], [2, 3, 15], [3, 4, 27]];
  let out = edges.map(([a, b]) => line(C[a][0], C[a][1], C[b][0], C[b][1], { width: 1.5 })).join("");
  out += edges.map(([a, b, v]) => { const x = (C[a][0] + C[b][0]) / 2, y = (C[a][1] + C[b][1]) / 2; return cell(x - 23, y - 23, 46, 46, v, { stroke: UT.ink, size: 18 }); }).join("");
  out += C.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="27" fill="#fff" stroke="${UT.red}" stroke-width="1.8"/>`).join("");
  return svg(360, 334, "오각형 그림", out, 300);
};

// 8. 도형 합 표
const q8 = () => shapeSumTable([["square", "square", "square", "square"], ["triangle", "diamond", "star", "circle"], ["triangle", "star", "star", "circle"], ["triangle", "triangle", "diamond", "diamond"]], [20, 10, "box", 8], [8, 11, 12, 16]);

// 9. 원 위의 6개의 점
const q9 = () => {
  const cx = 100, cy = 92, r = 82;
  let out = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${UT.line}" stroke-width="2"/>`;
  for (let i = 0; i < 6; i += 1) { const a = Math.PI / 3 * i; out += `<circle cx="${f1(cx + r * Math.cos(a))}" cy="${f1(cy + r * Math.sin(a))}" r="5.5" fill="${UT.purple}"/>`; }
  return svg(200, 184, "원 위의 점 6개", out, 220);
};

// 10. 도형 합 표(◈)
const q10 = () => shapeSumTable([["circle", "circle", "diamond", "diamond"], ["square", "ddiamond", "diamond", "diamond"], ["square", "circle", "circle", "square"], ["circle", "ddiamond", "diamond", "diamond"]], [10, 13, 8, "box"], [8, 6, 13, 15]);

// 11. 덧셈식(◎ ▣ ◈)
const q11 = () => {
  const s = 24, c1 = 80, c2 = 120, c0 = 40;
  let out = `<rect x="4" y="4" width="152" height="140" rx="14" fill="#fdfbf5" stroke="${UT.line}" stroke-width="1.5"/>`;
  out += glyph("dcircle", c1, 36, s) + glyph("boxdot", c2, 36, s - 2);
  out += text(c0 + 2, 74, "+", { size: 20, weight: 500 }) + glyph("ddiamond", c1, 74, s + 2) + glyph("boxdot", c2, 74, s - 2);
  out += line(26, 96, 138, 96, { width: 1.6 }) + glyph("ddiamond", c0, 118, s + 2) + glyph("ddiamond", c1, 118, s + 2) + text(c2, 119, "6", { size: 22, weight: 500 });
  return svg(160, 148, "도형 덧셈식", out, 200);
};

// 12. 두 막대(㉠ 1개 = ㉡ 3개, 합 28cm)
const q12 = () => {
  const A = UT.yellowSoft, B = UT.greenSoft, ga = 225, gb = 75, x0 = 14;
  let out = cell(x0, 6, ga, 36, "㉠", { fill: A, stroke: UT.ink });
  for (let i = 0; i < 3; i += 1) out += cell(x0 + i * gb, 42, gb, 36, "㉡", { fill: B, stroke: UT.ink });
  const y = 150;
  out += dimArc(x0, y, x0 + ga, y, -30, "") + dimArc(x0 + ga, y, x0 + ga + gb, y, -24, "");
  out += box(x0 + ga / 2 - 30, 106, 34, 28, { fill: "#fff", stroke: UT.ink, width: 1.4, radius: 1 }) + text(x0 + ga / 2 + 20, 121, "cm", { size: 14, weight: 600 });
  out += box(x0 + ga + gb / 2 - 26, 106, 34, 28, { fill: "#fff", stroke: UT.ink, width: 1.4, radius: 1 }) + text(x0 + ga + gb / 2 + 24, 121, "cm", { size: 14, weight: 600 });
  out += cell(x0, y, ga, 36, "㉠", { fill: A, stroke: UT.ink }) + cell(x0 + ga, y, gb, 36, "㉡", { fill: B, stroke: UT.ink });
  out += dimArc(x0, y + 36, x0 + ga + gb, y + 36, 34, "28cm", { lx: x0 + (ga + gb) / 2, ly: y + 36 + 20 });
  return svg(330, 232, "두 막대의 길이 비교", out, 330);
};

// 13. 삼각형 규칙(4개)
const q13 = () => {
  const labels = ["첫 번째", "두 번째", "세 번째", "네 번째"], xs = [24, 74, 148, 254], a = 24;
  return svg(330, 134, "삼각형 규칙", xs.map((x, i) => triFigure(i + 1, x, 100, a) + caption(x, 120, labels[i], 12)).join("") + text(318, 26, "…", { size: 18 }), 330);
};

// 14. 정사각형으로 만든 직사각형(㉮ 한 변 1cm)
const q14 = () => {
  const u = 28, ox = 4, oy = 4;
  const sq = [[3, 0, 1, "가", UT.yellowSoft], [4, 0, 1], [3, 1, 2], [0, 0, 3], [0, 3, 5], [5, 0, 4], [5, 4, 4, "나", UT.yellowSoft]];
  const out = sq.map(([x, y, n, label, fill = "#fff"]) => `<rect x="${ox + x * u}" y="${oy + y * u}" width="${n * u}" height="${n * u}" fill="${fill}" stroke="${UT.ink}" stroke-width="1.6"/>` + (label ? ringed(ox + (x + n / 2) * u, oy + (y + n / 2) * u, label, { r: 10, size: 12 }) : "")).join("");
  return svg(9 * u + 8, 8 * u + 8, "정사각형을 붙여 만든 직사각형", out, 260);
};

// 15. 색종이 두 번 접어 자르기
const q15 = () => {
  let out = paper(6, 20, 80, 80) + dashed(46, 20, 46, 100) + curveArrow(30, 70, 46, 86, 64, 68);
  out += stepArrow(96, 60);
  out += paper(126, 20, 40, 80) + `<path d="M126 100 L168 101 L166 20" fill="none" stroke="${UT.paperLine}" stroke-width="1"/>` + dashed(126, 60, 166, 60) + curveArrow(150, 40, 136, 56, 150, 76);
  out += stepArrow(178, 60);
  out += paper(210, 44, 40, 40) + `<path d="M210 84 L252 85 L250 44" fill="none" stroke="${UT.paperLine}" stroke-width="1"/>` + line(230, 44, 230, 84, { stroke: UT.cut, width: 1.6 }) + line(210, 84, 250, 44, { stroke: UT.cut, width: 1.6 });
  out += scissors(230, 26, 180) + scissors(262, 30, -140);
  return svg(280, 108, "색종이를 두 번 접어 자르는 순서", out, 320);
};

// 16. 도형 식 상자
const q16 = () => equationBox([["star", "+", "square", "=", "diamond"], ["star", "+", "star", "+", "star", "=", "circle", "+", "circle", "+", "circle", "+", "circle"], ["star", "+", "star", "=", "diamond", "+", "circle"]], { s: 18, gap: 3, size: 15, rowGap: 34, stroke: UT.line, fill: "#fff", padX: 16, label: "도형 식 세 줄" });

// 17. 모양 쌓기 규칙(1~16 그리고 29번째)
const q17 = () => {
  const kinds = ["circle", "square", "triangle", "heart", "diamond"];
  const s = 13, step = 15, base = 98, dx = 16.6;
  let out = "";
  for (let i = 0; i < 16; i += 1) {
    const k = kinds[i % 5], n = (i % 4) + 1, x = 12 + i * dx;
    for (let r = 0; r < n; r += 1) out += shape(k, x, base - r * step, s);
    out += caption(x, 120, i + 1, 11);
  }
  out += text(287, base - 10, "…", { size: 16 }) + `<rect x="300" y="26" width="26" height="82" rx="2" fill="#fff" stroke="${UT.ink}" stroke-width="1.6"/>` + caption(313, 120, 29, 12);
  return svg(330, 130, "모양 쌓기 규칙", out, 330);
};

// 19. 직각으로 꺾인 도형
const q19 = () => {
  const s = 17, ox = 56, oy = 36;
  const P = (x, y) => [ox + x * s, oy + y * s];
  const pts = [[0, 0], [9, 0], [9, 3.2], [5, 3.2], [5, 7.2], [13, 7.2], [13, 10], [0, 10]].map(([x, y]) => P(x, y));
  let out = `<polygon points="${pts.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ")}" fill="${UT.blueSoft}" stroke="${UT.ink}" stroke-width="1.8" stroke-linejoin="round"/>`;
  out += dimArc(...P(0, 0), ...P(9, 0), -22, "9cm");
  out += dimArc(...P(0, 10), ...P(0, 0), -26, "10cm");
  out += dimArc(...P(5, 7.2), ...P(13, 7.2), -20, "8cm");
  out += dimArc(...P(13, 10), ...P(0, 10), -24, "13cm");
  return svg(300, 238, "직각으로 꺾인 도형", out, 300);
};

// 20. 규칙 표
const q20 = () => {
  const w = 54, h = 36, top = [1, 4, 7, 10, "…", 79], bottom = [500, 493, 486, 479, "…", "㉮"];
  let out = "";
  [top, bottom].forEach((row, r) => row.forEach((v, c) => {
    const x = 2 + c * w, y = 2 + r * h;
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${UT.ink}" stroke-width="1.8"/>`;
    out += v === "㉮" ? ringed(x + w / 2, y + h / 2, "가", { size: 12 }) : text(x + w / 2, y + h / 2 + 1, v, { size: 16, weight: 600 });
  }));
  return svg(w * 6 + 4, h * 2 + 4, "규칙 표", out, w * 6 + 4);
};

const q18 = null;

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
export const questions = [
  Q(1, "지민이는 구슬 15개를, 서영이는 구슬 7개를 가지고 있습니다. 두 사람의 구슬 수가 같아지려면 지민이가 서영이에게 구슬 몇 개를 주어야 합니까?", null),
  Q(2, "다음은 어린이 5명의 키를 비교하여 말한 것입니다. 키가 큰 어린이부터 차례로 셀 때, 준영이는 몇 째 입니까?", q2),
  Q(3, "다음 주어진 조건에 맞는 수를 구하시오.", () => conditionsBox(["두 자리 수입니다.", "각 자리 숫자의 합이 13입니다.", "일의 자리 숫자가 십의 자리 숫자보다 5 큽니다."])),
  Q(4, "다음의 양팔 저울은 모두 평형을 이루고 있습니다. 마지막 저울이 평형을 이루려면 저울의 오른쪽 빈 접시에 △를 몇 개 놓아야 합니까?", q4),
  Q(5, "1번부터 5번까지의 상자 5개와 무게를 비교하니 다음과 같았습니다. 무거운 상자부터 차례대로 나열하시오.", q5, null),
  Q(6, "다음 식에서 □가 나타내는 수를 구하시오.", q6),
  Q(7, "다음 오각형 모양의 그림에서 ○안의 수는 2에서 9까지의 자연수이고, □안의 수는 양쪽의 ○안에 있는 두 수의 곱입니다. ○안에 알맞은 수를 써 넣으시오.", q7, null),
  Q(8, "다음 그림에서 같은 도형은 같은 수를 나타내고 오른쪽과 아래에 쓰여진 수는 각 줄의 합을 나타냅니다. 다음 □에 들어갈 수를 구하시오.", q8, null),
  Q(9, "다음 그림과 같이 원 위에 6개의 점이 있습니다. 두 점을 잇는 선분을 모두 몇 개 그을 수 있는지 구하시오.", q9),
  Q(10, "다음 그림에서 같은 도형은 같은 수를 나타내고 오른쪽과 아래에 쓰여진 수는 각 줄의 합을 나타냅니다. 다음 □에 들어갈 수를 구하시오.", q10, null),
  Q(11, "다음 식에서 같은 모양은 같은 숫자를 나타냅니다. ◎모양이 나타내는 숫자를 구하시오.", q11),
  Q(12, "㉠막대 1개와 ㉡막대 3개의 길이가 같습니다. ㉠막대와 ㉡막대의 길이의 합이 28cm일 때, ㉠막대와 ㉡막대의 길이를 각각 구하시오.", q12, null),
  Q(13, "다음 그림과 같이 일정한 규칙으로 삼각형을 그렸습니다. 7번째 그림에서 칠해지지 않은 삼각형은 칠해진 삼각형보다 몇 개 더 많습니까?", q13),
  Q(14, "다음 그림은 정사각형을 붙여 만든 직사각형입니다. 정사각형 ㉮의 한 변의 길이가 1cm일 때, 정사각형 ㉯의 한 변의 길이를 구하시오.", q14),
  Q(15, "다음과 같이 정사각형 모양의 색종이를 두 번 접어서 선을 따라 잘랐을 때, 삼각형이 몇 개 나오는지 구하시오.", q15),
  Q(16, "다음 각 도형은 1에서 9까지의 서로 다른 네 수를 나타냅니다. □가 나타내는 수는 얼마인지 구하시오.", q16),
  Q(17, "다음 모양을 일정한 규칙에 따라 나열하였습니다. 규칙을 찾아 29번째 모양을 그리시오.", q17),
  Q(18, "68명의 어린이와 어른이 68개의 귤을 나누어 먹으려고 합니다. 어린이는 3명이 1개의 귤을 나누어 먹고, 어른은 1명이 3개의 귤을 먹습니다. 어린이와 어른은 각각 몇 명인지 구하시오.", q18, [{ label: "어린이", unit: "명" }, { label: "어른", unit: "명" }]),
  Q(19, "다음 직각으로 꺾인 도형의 둘레의 길이를 구하시오.", q19),
  Q(20, "다음 표는 일정한 규칙에 따라 만들어진 것입니다. ㉮에 알맞은 수를 구하시오.", q20),
];
