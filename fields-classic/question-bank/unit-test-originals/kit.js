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
