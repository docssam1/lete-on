// 납작한 양팔 저울 그림 — 원본 2단원 쪽 그림처럼(흰 접시 두 개, 회색 막대, 세모 받침). 「스캔한 이미지와 비슷해야지」(원장 2026-11-12).
//  scale({ x, y, w, left, right, tilt, base }) — tilt: "left"(왼쪽이 내려감) | "right" | "level". left/right: 접시 위에 놓을 그림(SVG 조각, 접시 가운데·바닥 기준 함수)
//  물건은 이모지 대신 쓸 수 있는 그림이 있으면 그 그림을, 없으면 사물 이모지를 쓴다(사람 얼굴 이모지는 쓰지 않음).
import { animalAt, standAt } from "./art.js?v=20261113p";

// 분홍 큐브(원본처럼 비스듬한 입체). rows: 아래 줄부터 개수, 예) [3, 2] → 아래 3개, 위 2개(왼쪽 정렬)
export function cubeStack(rows, cx, baseY, s = 34) {
  const d = s * 0.32, wMax = Math.max(...rows) * s, x0 = cx - wMax / 2 - d / 2;
  let out = "";
  rows.forEach((n, r) => {
    for (let i = 0; i < n; i++) {
      const x = x0 + i * s, y = baseY - (r + 1) * s;
      out += `<g><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#f9c6dc" stroke="#e58bb0" stroke-width="1.2"/>`;
      out += `<path d="M${x} ${y} l${d} ${-d} h${s} l${-d} ${d}z" fill="#fde1ec" stroke="#e58bb0" stroke-width="1.2"/>`;
      if (i === n - 1) out += `<path d="M${x + s} ${y} l${d} ${-d} v${s} l${-d} ${d}z" fill="#f3a7c7" stroke="#e58bb0" stroke-width="1.2"/>`;
      out += `</g>`;
    }
  });
  return out;
}
// 물건 그림: emoji(사물) 또는 그린 그림. 바닥 가운데 기준, 크기 h
const EMO = { banana: "🍌", watermelon: "🍉", strawberry: "🍓", cherry: "🍒", balloon: "🎈", soccer: "⚽", teddy: "🧸", rock: "🪨", cap: "🧢", plane: "✈️", book: "📕", volleyball: "🏐", basketball: "🏀", carrot: "🥕", sweetpotato: "🍠", potato: "🥔", ant: "🐜", candy: "🍬", pig: "🐖", rooster: "🐓" };
export function thingAt(kind, cx, baseY, h) {
  if (kind === "sheep" || kind === "duck" || kind === "cow") return animalAt(kind, cx, baseY, h);
  if (kind === "cat" || kind === "fox" || kind === "monkey") return standAt(kind, cx, baseY, h);
  if (kind === "top") return `<g transform="translate(${cx - h * 0.45} ${baseY - h * 0.9}) scale(${h / 100})"><path d="M10 30 Q45 0 80 30 L45 88Z" fill="#e53935" stroke="#9a1c1c" stroke-width="3"/><ellipse cx="45" cy="30" rx="35" ry="12" fill="#81c784" stroke="#2e7d32" stroke-width="3"/><circle cx="45" cy="30" r="7" fill="#fff"/></g>`;
  if (kind === "heart") return `<g transform="translate(${cx - h * 0.5} ${baseY - h}) scale(${h / 100})"><path d="M50 90 C10 64 0 38 14 22 C28 6 46 14 50 28 C54 14 72 6 86 22 C100 38 90 64 50 90Z" fill="#b3e5fc" stroke="#4a7a9a" stroke-width="3"/>${[[30, 30], [50, 45], [70, 32], [40, 60], [62, 60], [50, 75]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f8bbd0"/>`).join("")}</g>`;
  if (kind === "chick") return `<g transform="translate(${cx - h * 0.5} ${baseY - h}) scale(${h / 100})"><g stroke="#e08a00" stroke-width="4" stroke-linecap="round"><path d="M42 84 v14 M58 84 v14 M36 98 h12 M52 98 h12"/></g><ellipse cx="52" cy="62" rx="34" ry="26" fill="#ffd93b" stroke="#d9a300" stroke-width="3"/><circle cx="36" cy="34" r="22" fill="#ffd93b" stroke="#d9a300" stroke-width="3"/><path d="M52 58 q14 -4 22 8 q-12 6 -22 -2z" fill="#ffc300" stroke="#d9a300" stroke-width="2.5"/><path d="M14 32 l-12 5 l12 4z" fill="#ff8a00"/><circle cx="30" cy="29" r="3.6" fill="#2b1a0e"/><path d="M36 13 q2 -9 8 -6" stroke="#d9a300" stroke-width="3" fill="none"/></g>`;
  if (kind === "melon") return `<g transform="translate(${cx - h * 0.6} ${baseY - h * 0.8}) scale(${h / 100})"><ellipse cx="60" cy="40" rx="56" ry="38" fill="#ffca28" stroke="#c79100" stroke-width="3"/>${[24, 42, 60, 78, 96].map((x) => `<path d="M${x} 6 Q${x + (x - 60) * 0.25} 40 ${x} 76" stroke="#fff3c4" stroke-width="4" fill="none"/>`).join("")}</g>`;
  return `<text x="${cx}" y="${baseY - h * 0.08}" font-size="${h}" text-anchor="middle">${EMO[kind] || "❓"}</text>`;
}
// 저울 한 대
export function scale({ x = 0, y = 0, w = 420, left = null, right = null, tilt = "level", base = "#e8506a", mark = null } = {}) {
  const pw = w * 0.36, ph = 10, dy = tilt === "left" ? 22 : tilt === "right" ? -22 : 0;
  const lx = x + pw / 2, rx = x + w - pw / 2, ly = y + dy, ry = y - dy;   // 접시 윗면 가운데
  const plate = (cx, cy) => `<ellipse cx="${cx}" cy="${cy}" rx="${pw / 2}" ry="${ph}" fill="#f4f7fb" stroke="#d3dbe6" stroke-width="2"/><rect x="${cx - 10}" y="${cy + ph - 2}" width="20" height="6" rx="2" fill="#9aa5b3"/>`;
  const beam = `<path d="M${lx} ${ly + ph + 4} L${lx} ${ly + ph + 26} L${rx} ${ry + ph + 26} L${rx} ${ry + ph + 4}" fill="none" stroke="#7d8796" stroke-width="5" stroke-linejoin="round"/>`;
  const tri = `<path d="M${x + w / 2} ${y + ph + 28} l${-26} 50 h52z" fill="${base}"/>`;
  return `<g>${beam}${tri}${plate(lx, ly)}${plate(rx, ry)}${left ? left(lx, ly) : ""}${right ? right(rx, ry) : ""}${mark ? mark(lx, rx, ly, ry) : ""}</g>`;
}
export const svgScene = (vb, body) => `<svg class="sm-scene" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
// 고르기 단추용 작은 그림
export const thingIcon = (kind, h = 64) => `<svg width="${h * 1.25}" height="${h}" viewBox="${-h * 0.62} ${-h} ${h * 1.25} ${h * 1.05}">${thingAt(kind, 0, 0, h * 0.95)}</svg>`;
export const ring = (cx, cy, rx = 46, ry = 34) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#e8417f" stroke-width="5"/>`;
// 원본 사물 카드처럼 「기둥」으로 쌓은 큐브. heights: 왼쪽 기둥부터 높이, 예) 가위 [2,3,2]. x0: 왼쪽 끝, baseY: 바닥
export function colStack(heights, x0, baseY, s = 16) {
  const d = s * 0.32; let out = "";
  heights.forEach((h, i) => {
    for (let r = 0; r < h; r++) {
      const x = x0 + i * s, y = baseY - (r + 1) * s;
      out += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#f9c6dc" stroke="#e58bb0" stroke-width="1"/>`;
      if (r === h - 1) out += `<path d="M${x} ${y} l${d} ${-d} h${s} l${-d} ${d}z" fill="#fde1ec" stroke="#e58bb0" stroke-width="1"/>`;
      if ((heights[i + 1] || 0) <= r) out += `<path d="M${x + s} ${y} l${d} ${-d} v${s} l${-d} ${d}z" fill="#f3a7c7" stroke="#e58bb0" stroke-width="1"/>`;
    }
  });
  return out;
}
export const colWidth = (heights, s = 16) => heights.length * s + s * 0.32;
