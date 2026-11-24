// 길이 표시 = 바깥 곡선 점선(호) + 그 가운데 끊은 자리에 숫자·단위 — 스킬 gfield-textbook-design 4-3(원장 2026-11-16 기준,
// 2026-11-24 「도형의 변의 길이를 점선 호를 사용하여 길이를 써야지 기준이잖아」로 2과정·3과정 그림 전체에 적용).
// 선발시험 시험지 도구(selection-test-originals/kit.js dim)와 같은 그림이고, 색·글꼴·크기를 넘겨 받아 어느 그림에서나 쓴다.
//   dimArc(x1, y1, x2, y2, bend, label, opts)
//   bend: 곡선 꼭대기가 두 끝을 이은 선에서 떨어진 거리. 부호는 (x1,y1)→(x2,y2) 진행 방향의 오른쪽(+)·왼쪽(−)
//         — 왼쪽에서 오른쪽으로 그은 가로선이면 + 가 아래, − 가 위. 도형 바깥쪽으로 둔다.
//   label: "12cm" · "?" · "" (빈 답 칸은 { blank: true, unit: "cm" })
// 점선은 글자 자리에서 실제로 끊는다(흰 판으로 덮지 않는다). 글자 폭이 구간의 60%를 넘는 짧은 구간은 점선을 그대로 두고 글자를 곡선 꼭대기 바로 바깥에.
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
export const DIM_STYLE = Object.freeze({ line: "#5f6b66", ink: "#24302b", width: 0.9, dash: "3.5 2.8", font: "'FC Serif','Noto Serif KR',serif" });

export const dimText = (x, y, value, { size = 14, anchor = "middle", color = DIM_STYLE.ink, font = DIM_STYLE.font } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" dominant-baseline="central" style="font-family:${font};font-size:${size}px;font-weight:400;fill:${color};letter-spacing:0">${esc(value)}</text>`;

export function dimArc(x1, y1, x2, y2, bend, label = "", {
  blank = false, unit = "cm", size = 14, boxW = 28, boxH = 22, gap = 4,
  color = DIM_STYLE.line, ink = DIM_STYLE.ink, width = DIM_STYLE.width, dash = DIM_STYLE.dash, font = DIM_STYLE.font, labelColor = null
} = {}) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  const cx = (x1 + x2) / 2 + nx * bend * 2, cy = (y1 + y2) / 2 + ny * bend * 2;
  const at = (t) => [(1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2];
  const [mx0, my0] = at(0.5);
  const textW = (value) => [...String(value)].reduce((w, ch) => w + (/[0-9.]/.test(ch) ? 0.56 : /[mwMW]/.test(ch) ? 0.86 : /[a-z]/i.test(ch) ? 0.58 : /[?□]/.test(ch) ? 0.7 : 0.95) * size, 0);
  const unitW = blank && unit ? textW(unit) + 4 : 0;
  const w = blank ? boxW + unitW : textW(label), h = blank ? boxH : size * 1.1;
  const outside = (w + gap * 2) > len * 0.6, sgn = Math.sign(bend) || 1;
  const reach = Math.abs(nx) * w / 2 + Math.abs(ny) * h / 2 + 3;
  const ax = outside ? mx0 + nx * sgn * reach : mx0, ay = outside ? my0 + ny * sgn * reach : my0;
  let body = "";
  if (blank) {
    const bx = ax - w / 2;
    body = `<rect x="${f1(bx)}" y="${f1(ay - boxH / 2)}" width="${boxW}" height="${boxH}" rx="2" fill="#fff" stroke="${ink}" stroke-width="1.1"/>` + (unit ? dimText(bx + boxW + 4, ay + 1, unit, { size, anchor: "start", color: ink, font }) : "");
  } else if (label !== "" && label != null) body = dimText(ax, ay + 1, label, { size, color: labelColor || ink, font });
  const inside = (t) => { const [px, py] = at(t); return Math.abs(px - ax) <= w / 2 + gap && Math.abs(py - ay) <= h / 2 + gap; };
  let t0 = 0.5, t1 = 0.5;
  if (body && !outside) { while (t0 > 0 && inside(t0 - 0.002)) t0 -= 0.002; while (t1 < 1 && inside(t1 + 0.002)) t1 += 0.002; }
  const piece = (ta, tb) => {
    const [sx, sy] = at(ta), [ex, ey] = at(tb);
    const qx = x1 * (1 - ta) * (1 - tb) + cx * ((1 - ta) * tb + ta * (1 - tb)) + x2 * ta * tb, qy = y1 * (1 - ta) * (1 - tb) + cy * ((1 - ta) * tb + ta * (1 - tb)) + y2 * ta * tb;
    return `<path d="M${f1(sx)} ${f1(sy)} Q${f1(qx)} ${f1(qy)} ${f1(ex)} ${f1(ey)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}" stroke-linecap="round"/>`;
  };
  return (body && !outside ? piece(0, t0) + piece(t1, 1) : piece(0, 1)) + body;
}
// 점 a·b(그림 좌표 {x,y})로 — 도형 가운데 c를 주면 바깥쪽으로 알아서 휜다
export function dimOut(a, b, c, label, { off = 14, ...opts } = {}) {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1, nx = -(b.y - a.y) / len, ny = (b.x - a.x) / len;
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const side = (m.x - c.x) * nx + (m.y - c.y) * ny >= 0 ? 1 : -1;   // 가운데에서 변 가운데로 가는 쪽 = 바깥
  return dimArc(a.x, a.y, b.x, b.y, side * off, label, opts);
}
// 길이 글자인지(cm·m·mm로 끝나거나 「?」·「□」 하나) — 비·번호 글자와 가른다
export const isLength = (v) => /^\s*(?:[\d.]+\s*(?:cm|m|mm|km)|\?|□|[\d.]+\s*\+\s*[\d.]+\s*(?:cm)?)\s*$/.test(String(v));
