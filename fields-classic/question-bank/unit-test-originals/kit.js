// 권별 테스트 원문 다시 짜기 공용 그림 도구 (원장 2026-10-28 「우리쪽에 맞추자」).
// 권마다 unit-test-originals/book-NN.js 가 이 도구로 원문 그림을 그린다. 그림은 모두 인라인 SVG·인라인 스타일이라
// 원문 풀기 화면(unit-test-viewer)에 문제은행 CSS 없이도 그대로 나온다. 색은 워밍업 그림 색표(.claude/skills/golden-bell-figure-style)
// — 옛 청록·하늘색(원문 스캔의 파란 그림) 금지, 글자는 검정.
export const UT = Object.freeze({
  ink: "#222", line: "#7a6f5c", soft: "#c9bda2",
  paper: "#fde9b8", paperLine: "#c08a2e", grid: "#d9b46a", cut: "#f39a1e", crease: "#a8741a", arrow: "#e8503a",
  box: "#8e5bd8", boxFill: "#ffffff", tint: "#ece0fb", card: "#fff3c4", cardLine: "#f0a500",
  red: "#e8503a", orange: "#f39a1e", yellow: "#ffd45c", green: "#2f9e5f", blue: "#2f6fe0", purple: "#8e5bd8", pink: "#e0559a",
  redSoft: "#ffe1dc", greenSoft: "#dcf5e5", blueSoft: "#dde9ff", purpleSoft: "#ece0fb", yellowSoft: "#fff3c4", orangeSoft: "#ffe9cc",
  cubeTop: "#ffeaa6", cubeFront: "#ffd45c", cubeSide: "#f0b23a", cubeLine: "#a8741a",
  shade: "#ffa94d", dot: "#2f6fe0",
  pastel: ["#ffe1dc", "#dcf5e5", "#dde9ff", "#fff3c4"]
});
export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// 글자(가운데 맞춤). 숫자·글자는 Pretendard 계열로 보인다.
export const text = (x, y, value, { size = 15, anchor = "middle", weight = 700, fill = UT.ink } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="central" style="font-size:${size}px;font-weight:${weight};fill:${fill};text-anchor:${anchor};dominant-baseline:central;letter-spacing:0">${esc(value)}</text>`;
// SVG 틀: 너비 100%, maxWidth 까지만 커진다(원문 풀기 쪽 칸에 맞춰 줄어든다)
export const svg = (width, height, label, body, maxWidth = width) =>
  `<svg class="b1-ut-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(label)}" style="display:block;width:100%;max-width:${maxWidth}px;height:auto;margin:0 auto">${body}</svg>`;
export const box = (x, y, w, h, { fill = UT.boxFill, stroke = UT.box, width = 1.8, radius = 3 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
export const line = (x1, y1, x2, y2, { stroke = UT.ink, width = 1.6, dash = "" } = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
// 숫자 카드 한 줄(노란 카드)
export function cardsRow(cards, width, y = 4, size = 30) {
  if (!cards?.length) return "";
  const gap = 6;
  const start = (width - (cards.length * size + (cards.length - 1) * gap)) / 2;
  return cards.map((card, index) => {
    const x = start + index * (size + gap);
    return `${box(x, y, size, size, { fill: UT.card, stroke: UT.cardLine, width: 1.8 })}${text(x + size / 2, y + size / 2 + 1, card, { size: 15, weight: 800 })}`;
  }).join("");
}
// (1)(2) 처럼 꼬리표 달린 그림 묶음
export function setMarkup(items, columns = items.length, figure) {
  const cells = items.map((item) => `<figure style="margin:0;min-width:0"><figcaption style="margin:0 0 4px;color:${UT.ink};font-size:12px;font-weight:800;line-height:1.35">${esc(item.label || "")}</figcaption>${figure(item.visual)}</figure>`).join("");
  return `<div class="b1-ut-set" style="display:grid;grid-template-columns:repeat(${Math.max(1, columns)},minmax(0,1fr));gap:10px 14px;width:100%">${cells}</div>`;
}
// 조건 상자(• 줄 목록) — 원문의 하늘색 상자 대신 종이색 상자
export function conditionsBox(clues) {
  const list = `<ul style="margin:0;padding:0 0 0 18px;display:grid;gap:5px">${clues.map((clue) => `<li style="font-size:13px;font-weight:700;line-height:1.5;color:${UT.ink};word-break:keep-all">${esc(clue)}</li>`).join("")}</ul>`;
  return `<div style="display:grid;place-items:center;width:100%"><div style="width:min(100%,440px);padding:10px 14px;border:1.5px solid ${UT.soft};border-radius:6px;background:#fdfbf5">${list}</div></div>`;
}

// ── 길이 표시(스킬 gfield-textbook-design 4-3 「시험지 수학 도형의 치수·각 표시」, 원장 2026-11-16 · 권별 테스트에 옮김 2026-11-24)
// 선발시험 도구(selection-test-originals/kit.js)의 dim 과 같은 것 — 그 도구가 이 파일을 불러 쓰므로(되불러 쓰면 고리가 된다) 여기 따로 둔다.
// 두 끝을 잇는 가는 바깥 곡선 점선 + 그 가운데 끊은 자리에 숫자·단위(보통 굵기 명조), 또는 빈 답 칸 + 단위.
// bend: 곡선 꼭대기가 두 끝을 이은 선에서 떨어진 거리, 부호는 (x1,y1)→(x2,y2) 진행 방향의 오른쪽(+)·왼쪽(−) —
// 왼쪽에서 오른쪽으로 그은 가로선이면 + 가 아래, − 가 위. 늘 도형 바깥으로 휘게 고른다.
// 권별 테스트에서 더한 것: box(x, y, w, h) — 빈 답 칸을 그 시험지의 답 칸 모양으로(답안 그림의 값도 그 안에) ·
// halo — 다른 점선이 글자 자리를 지나갈 때 글자 둘레에 흰 테(제 점선은 그대로 끊는다).
const r1 = (v) => (Math.round(v * 10) / 10).toString();
export const DIM = Object.freeze({ stroke: UT.line, width: 0.6, dash: "3 2.4", edge: 0.95, font: "'FC Serif','Noto Serif KR',serif" });
export const dimText = (x, y, value, { size = 15, anchor = "middle", halo = false } = {}) =>
  `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}" dominant-baseline="central" style="${halo ? "paint-order:stroke;stroke:#fff;stroke-width:4px;stroke-linejoin:round;" : ""}font-family:${DIM.font};font-size:${size}px;font-weight:400;fill:${UT.ink};text-anchor:${anchor};dominant-baseline:central;letter-spacing:0">${esc(value)}</text>`;
export function dim(x1, y1, x2, y2, bend, label = "", { blank = false, unit = "cm", size = 15, boxW = 30, boxH = 26, gap = 5, halo = false, box: drawBox = null } = {}) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  const cx = (x1 + x2) / 2 + nx * bend * 2, cy = (y1 + y2) / 2 + ny * bend * 2;
  const at = (t) => [(1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2];
  const [mx0, my0] = at(0.5);
  const textW = (value) => [...String(value)].reduce((w, ch) => w + (/[0-9]/.test(ch) ? 0.58 : /[mwMW]/.test(ch) ? 0.88 : /[a-z]/i.test(ch) ? 0.6 : 0.95) * size, 0);
  const unitW = blank && unit ? textW(unit) + 4 : 0;
  const w = blank ? boxW + unitW : textW(label), h = blank ? boxH : size * 1.15;
  // 짧은 구간(글자 폭이 구간의 60%를 넘으면)은 점선을 끊으면 끝만 남으므로, 점선은 그대로 두고 글자를 곡선 꼭대기 바로 바깥에 둔다.
  const outside = (w + gap * 2) > len * 0.6, sgn = Math.sign(bend) || 1;
  const reach = Math.abs(nx) * w / 2 + Math.abs(ny) * h / 2 + 3;
  const ax = outside ? mx0 + nx * sgn * reach : mx0, ay = outside ? my0 + ny * sgn * reach : my0;
  let body = "";
  if (blank) {
    const bx = ax - w / 2;
    body = (drawBox ? drawBox(bx, ay - boxH / 2, boxW, boxH) : `<rect x="${r1(bx)}" y="${r1(ay - boxH / 2)}" width="${boxW}" height="${boxH}" fill="#fff" stroke="${UT.ink}" stroke-width="${DIM.edge}"/>`)
      + (unit ? dimText(bx + boxW + 4, ay + 1, unit, { size, anchor: "start", halo }) : "");
  } else if (label) body = dimText(ax, ay + 1, label, { size, halo });
  // 점선이 글자 상자(+gap)에 들어가는 구간을 찾아 그 부분만 뺀다
  const inside = (t) => { const [px, py] = at(t); return Math.abs(px - ax) <= w / 2 + gap && Math.abs(py - ay) <= h / 2 + gap; };
  let t0 = 0.5, t1 = 0.5;
  if (body && !outside) { while (t0 > 0 && inside(t0 - 0.002)) t0 -= 0.002; while (t1 < 1 && inside(t1 + 0.002)) t1 += 0.002; }
  const piece = (ta, tb) => {
    const [sx, sy] = at(ta), [ex, ey] = at(tb);
    const qx = x1 * (1 - ta) * (1 - tb) + cx * ((1 - ta) * tb + ta * (1 - tb)) + x2 * ta * tb, qy = y1 * (1 - ta) * (1 - tb) + cy * ((1 - ta) * tb + ta * (1 - tb)) + y2 * ta * tb;
    return `<path d="M${r1(sx)} ${r1(sy)} Q${r1(qx)} ${r1(qy)} ${r1(ex)} ${r1(ey)}" fill="none" stroke="${DIM.stroke}" stroke-width="${DIM.width}" stroke-dasharray="${DIM.dash}" stroke-linecap="round"/>`;
  };
  return (body && !outside ? piece(0, t0) + piece(t1, 1) : piece(0, 1)) + body;
}
