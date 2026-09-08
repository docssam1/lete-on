import { rightAngleSolutions } from "./basic.js?v=angle-1";

const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const polar = (center, radius, angle) => [center[0] + radius * Math.cos(angle * Math.PI / 180), center[1] + radius * Math.sin(angle * Math.PI / 180)];
const line = (a, b, attrs = "") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${attrs}/>`;
const label = (point, text, attrs = "") => `<text x="${point[0]}" y="${point[1]}" text-anchor="middle" dominant-baseline="middle" font-size="17" fill="#182230" ${attrs}>${escape(text)}</text>`;
export function arc(center, radius, start, sweep, attrs = "") {
  const a = polar(center, radius, start), b = polar(center, radius, start + sweep);
  return `<path d="M ${a.join(" ")} A ${radius} ${radius} 0 ${Math.abs(sweep) > 180 ? 1 : 0} ${sweep >= 0 ? 1 : 0} ${b.join(" ")}" fill="none" ${attrs}/>`;
}
export function renderEstimate(p, { reveal = false, lang = "ko" } = {}) {
  const o = [180, 156];
  let ruler = "";
  if (reveal) {
    for (let d = 0; d <= 180; d += 10) {
      ruler += line(polar(o, 132, p.orientation + d), polar(o, d % 30 === 0 ? 120 : 126, p.orientation + d), 'stroke="#7d8791" stroke-width="1"');
      if (d % 30 === 0) ruler += label(polar(o, 146, p.orientation + d), d, 'style="font-size:11px"');
    }
    ruler += arc(o, 132, p.orientation, 180, 'stroke="#a8b2bd" stroke-width="1"');
  }
  const title = { ko: "어림할 각", en: "Angle to estimate", zh: "待估测的角", ja: "見積もる角" }[lang] || "Angle to estimate";
  return `<svg xmlns="http://www.w3.org/2000/svg" class="problem-svg" viewBox="0 0 360 312" role="img" aria-label="${title}">${ruler}
    ${line(o, polar(o, p.lengths[0], p.orientation), 'stroke="#24616c" stroke-width="4" stroke-linecap="round"')}
    ${line(o, polar(o, p.lengths[1], p.orientation + p.angle), 'stroke="#24616c" stroke-width="4" stroke-linecap="round"')}
    ${arc(o, 33, p.orientation, p.angle, 'stroke="#b34c64" stroke-width="2"')}
    <circle cx="180" cy="156" r="4" fill="#182230"/>
    ${reveal ? label(polar(o, 65, p.orientation + p.angle / 2), `${p.angle}°`, 'font-weight="700"') : ""}
  </svg>`;
}

export const boardPoint = point => [50 + 52 * point[0], 44 + 52 * point[1]];
export function renderRightAngle(p, { reveal = false, point = null, interactive = false, lang = "ko" } = {}) {
  const selected = point || (reveal ? rightAngleSolutions(p)[0] : null);
  const o = boardPoint(p.origin), a = boardPoint(p.arm), b = selected && boardPoint(selected);
  const title = { ko: "점판에서 직각 만들기", en: "Make a right angle on the dot board", zh: "在点阵上画直角", ja: "点の板で直角を作る" }[lang] || "Dot board";
  let dots = "";
  for (let y = 0; y < p.size; y++) for (let x = 0; x < p.size; x++) {
    const [cx, cy] = boardPoint([x, y]);
    const isO = x === p.origin[0] && y === p.origin[1];
    const isA = x === p.arm[0] && y === p.arm[1];
    const isB = selected && x === selected[0] && y === selected[1];
    const name = `${x + 1}, ${y + 1}${isO ? " O" : isA ? " A" : ""}`;
    dots += `<g ${interactive && !isO ? `class="dot-choice${isB ? " chosen" : ""}" role="button" tabindex="${isB || (!selected && x === 0 && y === 0) ? 0 : -1}" aria-label="${name}" aria-pressed="${!!isB}" data-point="${x},${y}"` : ""}><circle cx="${cx}" cy="${cy}" r="23" fill="transparent"/><circle class="dot-ink" cx="${cx}" cy="${cy}" r="${isO || isA || isB ? 5 : 3}" fill="${isB ? "#b34c64" : "#667781"}"/></g>`;
  }
  let square = "";
  if (reveal && b) {
    const u = a.map((v, i) => (v - o[i]) / Math.hypot(a[0] - o[0], a[1] - o[1]) * 18);
    const v = b.map((n, i) => (n - o[i]) / Math.hypot(b[0] - o[0], b[1] - o[1]) * 18);
    square = `<path d="M ${o[0] + u[0]} ${o[1] + u[1]} l ${v.join(" ")} l ${-u[0]} ${-u[1]}" fill="none" stroke="#16734b" stroke-width="2.5"/>`;
  }
  const named = [label([o[0] - 13, o[1] - 17], "O"), label([a[0] + 13, a[1] - 17], "A"), b && label([b[0] + 13, b[1] + 18], "B")].filter(Boolean).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" class="problem-svg dot-board" viewBox="0 0 360 352" role="${interactive ? "group" : "img"}" aria-label="${title}">${line(o, a, 'stroke="#24616c" stroke-width="4" stroke-linecap="round"')}${b ? line(o, b, 'stroke="#b34c64" stroke-width="3" stroke-linecap="round"') : ""}${square}${dots}<g pointer-events="none">${named}</g></svg>`;
}
