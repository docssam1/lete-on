// 3단원 미로 찾기 엔진 — 원본 52~73쪽 미로를 같은 엔진으로 그리고, 손가락으로 길을 긋게 한다(끌기·점 누르기 둘 다).
//  ① 네모네모 미로(gapMaze): 색 네모 사이 흰 틈이 길, 네모를 잇는 다리가 벽. 데이터는 원본 그림에서 읽은 다리(H 가로·V 세로).
//  ② 거울 반사 미로(mirrorMaze): 점선을 따라 똑바로, 거울을 만나면 90° 꺾임(원본 58쪽 규칙). 사탕은 지나간 점에서 먹는다.
//  ③ 선 미로(lineMaze): 원본 66쪽처럼 벽이 선인 미로. 벽을 지나갈 수 없고 손가락 길을 그대로 긋는다.
// 길 긋기 규칙(벽·거울)은 이 엔진이 판정하고, 틀린 쪽으로 가려 하면 까닭을 말해 준다.
import { kid } from "./art.js?v=20261113q";

const NS = "http://www.w3.org/2000/svg";
const U = 60;                                   // 한 칸 간격(px, SVG 좌표)
export const CANDY_COLORS = [["#4fc3f7", "#ffd54f"], ["#f06292", "#ffe082"], ["#ab47bc", "#ffcc80"], ["#81c784", "#fff59d"]];

// ── 그림 ──────────────────────────────────────────────
// 동물 얼굴(그린 그림 — 이모지 얼굴은 쓰지 않음)
const HEAD = {
  hamster: { fur: "#fff", ear: "#f6c9a8", line: "#8a6a50", extra: `<path d="M44 18 l6 14 l6 -14" stroke="#e9b48f" stroke-width="3" fill="none"/>` },
  mouse: { fur: "#b9bcc4", ear: "#f3b8c6", line: "#555", bigEar: true },
  sheep: { fur: "#fff", ear: "#e8a35a", line: "#777", fluff: true },
  rabbit: { fur: "#ffe14d", ear: "#ffb3c1", line: "#a07a00", long: true },
  tiger: { fur: "#ffa23a", ear: "#ffe0b8", line: "#5b3a1e", extra: `<g stroke="#5b3a1e" stroke-width="4" stroke-linecap="round"><path d="M50 22 v10 M41 24 l3 8 M59 24 l-3 8 M18 52 h9 M82 52 h-9"/></g>` },
  pig: { fur: "#ffc1cc", ear: "#ff9fb2", line: "#b0607a", snout: true },
  bear: { fur: "#b07a4a", ear: "#e9c8a2", line: "#5b3a1e" },
  dog: { fur: "#fff", ear: "#333", line: "#333", extra: `<ellipse cx="66" cy="48" rx="13" ry="15" fill="#333" opacity=".85"/>` }
};
export function headSvg(kind, size = 56) {
  const h = HEAD[kind] || HEAD.bear;
  const ears = h.long ? `<ellipse cx="34" cy="16" rx="9" ry="22" fill="${h.fur}" stroke="${h.line}" stroke-width="2.5"/><ellipse cx="66" cy="16" rx="9" ry="22" fill="${h.fur}" stroke="${h.line}" stroke-width="2.5"/><ellipse cx="34" cy="18" rx="4" ry="14" fill="${h.ear}"/><ellipse cx="66" cy="18" rx="4" ry="14" fill="${h.ear}"/>`
    : h.bigEar ? `<circle cx="22" cy="26" r="18" fill="${h.fur}" stroke="${h.line}" stroke-width="2.5"/><circle cx="78" cy="26" r="18" fill="${h.fur}" stroke="${h.line}" stroke-width="2.5"/><circle cx="22" cy="26" r="10" fill="${h.ear}"/><circle cx="78" cy="26" r="10" fill="${h.ear}"/>`
    : `<circle cx="26" cy="28" r="12" fill="${h.fur}" stroke="${h.line}" stroke-width="2.5"/><circle cx="74" cy="28" r="12" fill="${h.fur}" stroke="${h.line}" stroke-width="2.5"/><circle cx="26" cy="28" r="6" fill="${h.ear}"/><circle cx="74" cy="28" r="6" fill="${h.ear}"/>`;
  const fluff = h.fluff ? [[30, 34], [50, 28], [70, 34], [26, 54], [74, 54]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#fff" stroke="#ccc" stroke-width="2"/>`).join("") : "";
  const nose = h.snout ? `<ellipse cx="50" cy="66" rx="12" ry="9" fill="#ff9fb2" stroke="${h.line}" stroke-width="2"/><circle cx="46" cy="66" r="2.4" fill="${h.line}"/><circle cx="54" cy="66" r="2.4" fill="${h.line}"/>`
    : `<ellipse cx="50" cy="66" rx="5.5" ry="4" fill="#3b2414"/><path d="M44 73 Q50 78 56 73" stroke="#3b2414" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${ears}${fluff}<circle cx="50" cy="56" r="33" fill="${h.fur}" stroke="${h.line}" stroke-width="2.5"/>${h.extra || ""}<circle cx="38" cy="52" r="4.6" fill="#2b1a0e"/><circle cx="62" cy="52" r="4.6" fill="#2b1a0e"/><circle cx="39.5" cy="50.5" r="1.5" fill="#fff"/><circle cx="63.5" cy="50.5" r="1.5" fill="#fff"/>${nose}<circle cx="28" cy="64" r="5" fill="#ff9aa2" opacity=".5"/><circle cx="72" cy="64" r="5" fill="#ff9aa2" opacity=".5"/></svg>`;
}
// 길 위를 움직이는 주인공(사람은 art.js 아이 그림, 동물은 얼굴 그림)
const GIRL = { hair: "girl", hairColor: "#5a3a2a", shirt: "#5aa0f0", bottom: "#ffffff" };
export function tokenSvg(who, size = 52) {
  if (who === "girl") return kid({ ...GIRL, size });
  if (who === "soi") return kid({ hair: "bob", hairColor: "#7a4a2a", shirt: "#ff8a80", bottom: "#6d4c41", size });
  if (who === "jumyeong") return kid({ hair: "boy", hairColor: "#3a2a1a", shirt: "#ffd84a", bottom: "#2f4a72", size });
  return headSvg(who, size);
}
export const candySvg = (k = 0, s = 30) => { const [a, b] = CANDY_COLORS[k % CANDY_COLORS.length];
  return `<svg viewBox="0 0 60 40" width="${s * 1.5}" height="${s}" aria-hidden="true"><path d="M14 20 L2 8 L4 32Z" fill="${a}" stroke="#333" stroke-width="2"/><path d="M46 20 L58 8 L56 32Z" fill="${a}" stroke="#333" stroke-width="2"/><ellipse cx="30" cy="20" rx="17" ry="14" fill="${b}" stroke="#333" stroke-width="2"/><path d="M22 9 q-4 11 0 22 M30 6 q-4 14 0 28 M38 9 q-4 11 0 22" stroke="${a}" stroke-width="3.5" fill="none"/></svg>`; };
export const chestSvg = (s = 54) => `<svg viewBox="0 0 60 50" width="${s}" height="${s * 50 / 60}" aria-hidden="true"><rect x="6" y="20" width="48" height="26" rx="4" fill="#e3893a" stroke="#7a3f12" stroke-width="2.5"/><path d="M6 22 Q6 4 30 4 Q54 4 54 22Z" fill="#f3a64b" stroke="#7a3f12" stroke-width="2.5"/><rect x="26" y="18" width="8" height="12" rx="2" fill="#ffd54f" stroke="#7a3f12" stroke-width="2"/><circle cx="16" cy="12" r="3" fill="#fff59d"/><circle cx="44" cy="30" r="2.5" fill="#fff59d"/></svg>`;

// ── 공통: 손가락으로 점을 이어 길 긋기 ──────────────────
function svgPoint(svg, e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
function el(tag, attrs = {}, parent) { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); parent?.append(n); return n; }

// nodes: Map id → {x,y}; neighbors(id) → ids; check(from,to,path) → true | "까닭"
function pathDrawer(svg, { nodes, neighbors, check, start, goals, color = "#ff5a8a", token = "", onStep = null, onBlocked = null, radius = U * 0.72 }) {
  const layer = el("g", { class: "mz-path" }, svg);
  const line = el("polyline", { fill: "none", stroke: color, "stroke-width": U * 0.16, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: ".9" }, layer);
  const dots = el("g", {}, layer);
  const tok = el("g", { class: "mz-token" }, svg);
  tok.innerHTML = token;
  let path = [start], drawing = false, lastBlock = 0, done = false, resolveDone;
  const finished = new Promise((r) => { resolveDone = r; });
  function hintNext() {
    dots.innerHTML = "";
    if (done) return;
    for (const n of neighbors(path[path.length - 1])) {
      if (path.includes(n)) continue;
      const p = nodes.get(n); if (!p) continue;
      el("circle", { cx: p.x, cy: p.y, r: U * 0.11, fill: color, opacity: ".28" }, dots);
    }
  }
  function draw() {
    line.setAttribute("points", path.map((id) => { const p = nodes.get(id); return `${p.x},${p.y}`; }).join(" "));
    const end = nodes.get(path[path.length - 1]);
    tok.setAttribute("transform", `translate(${end.x} ${end.y})`);
    hintNext();
  }
  function nearest(pt) {
    let best = null, bd = radius;
    for (const [id, p] of nodes) { const d = Math.hypot(p.x - pt.x, p.y - pt.y); if (d < bd) { bd = d; best = id; } }
    return best;
  }
  function tryGo(id) {
    if (done || !id) return;
    const last = path[path.length - 1];
    if (id === last) return;
    if (path.length > 1 && id === path[path.length - 2]) { path.pop(); draw(); onStep?.(path, "back"); return; }
    if (path.includes(id)) return;
    if (!neighbors(last).includes(id)) return;
    const ok = check(last, id, path);
    if (ok !== true) { const now = Date.now(); if (now - lastBlock > 900) { lastBlock = now; onBlocked?.(ok, id); } return; }
    path.push(id); draw(); onStep?.(path, "go");
    if (goals.has(id)) { done = true; dots.innerHTML = ""; drawing = false; resolveDone(path.slice()); }
  }
  const down = (e) => { if (done) return; drawing = true; svg.setPointerCapture?.(e.pointerId); tryGo(nearest(svgPoint(svg, e))); };
  const move = (e) => { if (!drawing) return; tryGo(nearest(svgPoint(svg, e))); };
  const up = () => { drawing = false; };
  svg.addEventListener("pointerdown", down); svg.addEventListener("pointermove", move);
  svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
  draw();
  return {
    finished,
    get path() { return path.slice(); },
    reset() { if (done) return; path = [start]; draw(); onStep?.(path, "reset"); },
    // 정답 길을 저절로 그려 보여 주기(힌트·독쌤 차례)
    async auto(route, ms = 260) { for (const id of route.slice(1)) { if (done) break; tryGo(id); await new Promise((r) => setTimeout(r, ms)); } },
    lock() { done = true; dots.innerHTML = ""; },
    layer, tok
  };
}

// ── ① 네모네모 미로 ─────────────────────────────────────
const PALETTE = ["#ff8fb8", "#ffa552", "#ffe14d", "#cddc5a", "#47a96b", "#5fc7f0", "#9db4e8", "#f7d6f0", "#f8c6d8", "#ff7fae"];
// spec: { H:[...], V:[...], starts:[{side,k,label,color,who}], target:{node:[i,j]}|{side,k}, treasure:bool }
export function gapMaze(host, spec) {
  const { H, V } = spec, R = H.length, C = H[0].length + 1;
  const pad = U * 1.05, W = (C - 1) * U + pad * 2, Hh = (R - 1) * U + pad * 2;
  host.innerHTML = "";
  const svg = el("svg", { viewBox: `${-pad} ${-pad} ${W} ${Hh}`, class: "mz-svg", role: "img", "aria-label": "네모네모 미로" }, host);
  const s = U * 0.64, b = U * 0.17;
  const g = el("g", {}, svg);
  let html = "";
  for (let r = 0; r < R; r++) for (let c = 0; c < C - 1; c++) if (H[r][c] === "-") html += `<rect x="${c * U}" y="${r * U - b / 2}" width="${U}" height="${b}" fill="#fbe0c8"/>`;
  for (let r = 0; r < R - 1; r++) for (let c = 0; c < C; c++) if (V[r][c] === "|") html += `<rect x="${c * U - b / 2}" y="${r * U}" width="${b}" height="${U}" fill="#fbe0c8"/>`;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) html += `<rect x="${c * U - s / 2}" y="${r * U - s / 2}" width="${s}" height="${s}" rx="3" fill="${PALETTE[(r * 3 + c * 7 + (spec.seed || 0)) % PALETTE.length]}"/>`;
  g.innerHTML = html;
  const nodes = new Map();
  for (let i = 0; i < R - 1; i++) for (let j = 0; j < C - 1; j++) nodes.set(`${i},${j}`, { x: (j + 0.5) * U, y: (i + 0.5) * U });
  const portPos = ({ side, k }) => side === "top" ? { x: (k + 0.5) * U, y: -U * 0.72 } : side === "bottom" ? { x: (k + 0.5) * U, y: (R - 1) * U + U * 0.72 }
    : side === "left" ? { x: -U * 0.72, y: (k + 0.5) * U } : { x: (C - 1) * U + U * 0.72, y: (k + 0.5) * U };
  const portNode = ({ side, k }) => side === "top" ? `0,${k}` : side === "bottom" ? `${R - 2},${k}` : side === "left" ? `${k},0` : `${k},${C - 2}`;
  const portOpen = ({ side, k }) => side === "top" ? H[0][k] !== "-" : side === "bottom" ? H[R - 1][k] !== "-" : side === "left" ? V[k][0] !== "|" : V[k][C - 1] !== "|";
  const ports = [...spec.starts.map((p) => ({ ...p, role: "start" })), ...(spec.target?.side ? [{ ...spec.target, role: "goal" }] : []), ...(spec.exits || []).map((p) => ({ ...p, role: "goal" }))];
  const portId = (p) => `P:${p.side}:${p.k}`;
  for (const p of ports) nodes.set(portId(p), portPos(p));
  // 열린 길(다리가 없으면 지나갈 수 있음)
  const open = (a, b2) => {
    if (a.startsWith("P:") || b2.startsWith("P:")) {
      const pid = a.startsWith("P:") ? a : b2, other = pid === a ? b2 : a;
      const p = ports.find((q) => portId(q) === pid); return p && portNode(p) === other && portOpen(p);
    }
    const [i1, j1] = a.split(",").map(Number), [i2, j2] = b2.split(",").map(Number);
    if (i1 === i2) return V[i1][Math.max(j1, j2)] !== "|";        // 가로로 이동 → 위아래 네모를 잇는 다리가 막음
    return H[Math.max(i1, i2)][j1] !== "-";                        // 세로로 이동 → 옆 네모를 잇는 다리가 막음
  };
  const neighbors = (id) => {
    if (id.startsWith("P:")) { const p = ports.find((q) => portId(q) === id); return [portNode(p)]; }
    const [i, j] = id.split(",").map(Number), out = [];
    for (const [di, dj] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { const n = `${i + di},${j + dj}`; if (nodes.has(n)) out.push(n); }
    for (const p of ports) if (portNode(p) === id) out.push(portId(p));
    return out;
  };
  // 화살표·번호·보물
  const deco = el("g", {}, svg);
  let dh = "";
  for (const p of ports) {
    const q = portPos(p), col = p.color || "#ff7a6b";
    const ang = { top: 90, bottom: 90, left: 0, right: 0 }[p.side] + (p.role === "start" ? 0 : 0) + ((p.side === "right" && p.role === "start") || (p.side === "bottom" && p.role === "start") ? 180 : 0) + ((p.side === "left" && p.role === "goal") || (p.side === "top" && p.role === "goal") ? 180 : 0);
    dh += `<g transform="translate(${q.x} ${q.y}) rotate(${ang})"><path d="M-16 0 H10 M2 -8 L12 0 L2 8" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    if (p.label) { const off = { top: [0, -U * 0.5], bottom: [0, U * 0.5], left: [-U * 0.55, 0], right: [U * 0.55, 0] }[p.side]; dh += `<g transform="translate(${q.x + off[0]} ${q.y + off[1]})"><circle r="15" fill="#fff" stroke="${col}" stroke-width="3"/><text y="6" font-size="17" font-weight="900" text-anchor="middle" fill="${col}">${p.label}</text></g>`; }
  }
  if (spec.target?.node) { const [i, j] = spec.target.node; dh += `<g transform="translate(${(j + 0.5) * U} ${(i + 0.5) * U})"><circle r="${U * 0.5}" fill="#fff" stroke="#e8417f" stroke-width="3" stroke-dasharray="6 5"/><g transform="translate(-27 -23)">${chestSvg(54)}</g></g>`; }
  deco.innerHTML = dh;
  return {
    svg, nodes, neighbors, open, portId, ports, size: { W, H: Hh },
    // 출발점에서 길 긋기. 끝나면 지나간 길(점 목록)을 돌려준다.
    draw(startPort, { color, token, onStep, onBlocked } = {}) {
      const goals = new Set(spec.target?.node ? [`${spec.target.node[0]},${spec.target.node[1]}`] : []);
      for (const p of ports) if (p.role === "goal") goals.add(portId(p));
      return pathDrawer(svg, { nodes, neighbors, start: portId(startPort), goals, color, token: token ? `<g transform="translate(-24 -26)">${token}</g>` : "", onStep, onBlocked,
        check: (a, b2) => (open(a, b2) ? true : "다리가 있어서 지나갈 수 없어요. 흰 길로 가요!") });
    },
    // 가장 짧은 길(점 목록)
    shortest(startPort) {
      const s0 = portId(startPort), goals = new Set(spec.target?.node ? [`${spec.target.node[0]},${spec.target.node[1]}`] : ports.filter((p) => p.role === "goal").map(portId));
      const prev = new Map([[s0, null]]), q = [s0];
      while (q.length) { const u = q.shift(); if (goals.has(u)) { const out = []; let x = u; while (x) { out.unshift(x); x = prev.get(x); } return out; }
        for (const v of neighbors(u)) if (!prev.has(v) && open(u, v)) { prev.set(v, u); q.push(v); } }
      return null;
    }
  };
}
// 지나간 칸 수(발자국) — 문과 문 사이의 점 이동 수
export const stepsOf = (path) => path.filter((id) => !id.startsWith("P:")).length;

// ── ② 거울 반사 미로 ─────────────────────────────────────
// spec: { nh, nv, mirrors:{"h,v":"/"|"\\"}, start:{side,k}, exit:{side,k}, candies:["h,v"], color, who }
export function mirrorMaze(host, spec) {
  const { nh, nv } = spec, W = nv * U, Hh = nh * U, pad = U * 0.95;
  host.innerHTML = "";
  const svg = el("svg", { viewBox: `${-pad} ${-pad} ${W + pad * 2} ${Hh + pad * 2}`, class: "mz-svg", role: "img", "aria-label": "거울 반사 미로" }, host);
  const col = spec.color || "#4cc3c3", arm = U * 0.3, sw = U * 0.075;
  let html = "";
  // 점선(지나갈 수 있는 길)
  for (let h = 0; h < nh; h++) html += `<line x1="${-U * 0.3}" y1="${(h + 0.5) * U}" x2="${W + U * 0.3}" y2="${(h + 0.5) * U}" stroke="#9aa3b2" stroke-width="2" stroke-dasharray="7 6"/>`;
  for (let v = 0; v < nv; v++) html += `<line x1="${(v + 0.5) * U}" y1="${-U * 0.3}" x2="${(v + 0.5) * U}" y2="${Hh + U * 0.3}" stroke="#9aa3b2" stroke-width="2" stroke-dasharray="7 6"/>`;
  // 방의 벽(기둥에서 뻗은 팔 — 점선이 지나는 곳은 비어 있음)
  for (let y = 0; y <= nh; y++) for (let x = 0; x <= nv; x++) {
    const px = x * U, py = y * U;
    if (x < nv) html += `<line x1="${px}" y1="${py}" x2="${px + arm}" y2="${py}" stroke="${col}" stroke-width="${sw}" stroke-linecap="square"/>`;
    if (x > 0) html += `<line x1="${px}" y1="${py}" x2="${px - arm}" y2="${py}" stroke="${col}" stroke-width="${sw}" stroke-linecap="square"/>`;
    if (y < nh) html += `<line x1="${px}" y1="${py}" x2="${px}" y2="${py + arm}" stroke="${col}" stroke-width="${sw}" stroke-linecap="square"/>`;
    if (y > 0) html += `<line x1="${px}" y1="${py}" x2="${px}" y2="${py - arm}" stroke="${col}" stroke-width="${sw}" stroke-linecap="square"/>`;
  }
  // 거울(긴 대각선, 원본처럼 두 줄 하늘색)
  for (const [key, m] of Object.entries(spec.mirrors || {})) {
    const [h, v] = key.split(",").map(Number), x1 = v * U + 6, x2 = (v + 1) * U - 6;
    const [y1, y2] = m === "\\" ? [h * U + 6, (h + 1) * U - 6] : [(h + 1) * U - 6, h * U + 6];
    html += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#4aa8e8" stroke-width="${U * 0.12}" stroke-linecap="square"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="${U * 0.06}" stroke-linecap="square"/>`;
  }
  el("g", {}, svg).innerHTML = html;
  const nodes = new Map();
  for (let h = 0; h < nh; h++) for (let v = 0; v < nv; v++) nodes.set(`${h},${v}`, { x: (v + 0.5) * U, y: (h + 0.5) * U });
  const allPorts = [];
  for (let h = 0; h < nh; h++) allPorts.push({ side: "left", k: h }, { side: "right", k: h });
  for (let v = 0; v < nv; v++) allPorts.push({ side: "top", k: v }, { side: "bottom", k: v });
  const pid = (p) => `P:${p.side}:${p.k}`;
  const ppos = ({ side, k }) => side === "left" ? { x: -U * 0.62, y: (k + 0.5) * U } : side === "right" ? { x: W + U * 0.62, y: (k + 0.5) * U } : side === "top" ? { x: (k + 0.5) * U, y: -U * 0.62 } : { x: (k + 0.5) * U, y: Hh + U * 0.62 };
  for (const p of allPorts) nodes.set(pid(p), ppos(p));
  const pnode = ({ side, k }) => side === "left" ? `${k},0` : side === "right" ? `${k},${nv - 1}` : side === "top" ? `0,${k}` : `${nh - 1},${k}`;
  const inward = { left: [1, 0], right: [-1, 0], top: [0, 1], bottom: [0, -1] };
  const neighbors = (id) => {
    if (id.startsWith("P:")) { const [, side, k] = id.split(":"); return [pnode({ side, k: Number(k) })]; }
    const [h, v] = id.split(",").map(Number), out = [];
    for (const [dh, dv] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { const n = `${h + dh},${v + dv}`; if (nodes.has(n)) out.push(n); }
    if (v === 0) out.push(`P:left:${h}`); if (v === nv - 1) out.push(`P:right:${h}`);
    if (h === 0) out.push(`P:top:${v}`); if (h === nh - 1) out.push(`P:bottom:${v}`);
    return out;
  };
  const reflect = (m, [dx, dy]) => (m === "/" ? [-dy, -dx] : m === "\\" ? [dy, dx] : [dx, dy]);
  // 어디로 가야 하나(지나온 길로 결정)
  function nextOf(path) {
    const last = path[path.length - 1];
    if (last.startsWith("P:")) { const [, side, k] = last.split(":"); return pnode({ side, k: Number(k) }); }
    const prevId = path[path.length - 2], a = nodes.get(prevId), b = nodes.get(last);
    let d = [Math.sign(Math.round(b.x - a.x)), Math.sign(Math.round(b.y - a.y))];
    d = reflect(spec.mirrors?.[last], d);
    const [h, v] = last.split(",").map(Number), nh2 = h + d[1], nv2 = v + d[0];
    if (nodes.has(`${nh2},${nv2}`)) return `${nh2},${nv2}`;
    if (nv2 < 0) return `P:left:${h}`; if (nv2 >= nv) return `P:right:${h}`; if (nh2 < 0) return `P:top:${v}`; return `P:bottom:${v}`;
  }
  // 사탕·출입구 표시
  const deco = el("g", {}, svg);
  const candyEls = new Map();
  (spec.candies || []).forEach((key, i) => { const p = nodes.get(key); const gg = el("g", { class: "mz-candy", transform: `translate(${p.x - 24} ${p.y - 16})` }, deco); gg.innerHTML = candySvg(i, 32); candyEls.set(key, gg); });
  for (const [p, role] of [[spec.start, "start"], [spec.exit, "goal"]]) {
    const q = ppos(p); const base = { left: 0, right: 180, top: 90, bottom: 270 }[p.side];
    const ang = role === "start" ? base : (base + 180) % 360;
    el("g", { transform: `translate(${q.x} ${q.y}) rotate(${ang})` }, deco).innerHTML = `<path d="M-14 0 H10 M2 -8 L12 0 L2 8" stroke="#ff4f8b" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return {
    svg, nodes, candyEls,
    draw({ color = "#ff4f8b", token = "", onStep, onBlocked } = {}) {
      return pathDrawer(svg, { nodes, neighbors, start: pid(spec.start), goals: new Set([pid(spec.exit)]), color, token: token ? `<g transform="translate(-24 -26)">${token}</g>` : "",
        onStep, onBlocked,
        check: (a, b2, path) => {
          const want = nextOf(path);
          if (b2 === want) return want.startsWith("P:") && want !== pid(spec.exit) ? "그쪽은 나가는 곳이 아니에요." : true;
          return spec.mirrors?.[a] ? "거울을 만나면 방향이 바뀌어요! 거울에 튕겨 가요." : "거울이 없는 방에서는 똑바로 가요!";
        } });
    },
    // 규칙대로 끝까지 간 길
    route() { const out = [pid(spec.start)]; for (let i = 0; i < 60; i++) { const n = nextOf(out); out.push(n); if (n.startsWith("P:")) break; } return out; }
  };
}

// ── ③ 선 미로(원본 66쪽) ─────────────────────────────────
// spec: { walls:[[x1,y1,x2,y2]...] (칸 단위), size:[w,h], entry:[x0,x1](위), exit:[x0,x1](아래), color }
export function lineMaze(host, spec, { token = "", goalArt = "", onBlocked = null } = {}) {
  const [w, h] = spec.size, S = 34, pad = S * 1.6;
  host.innerHTML = "";
  const svg = el("svg", { viewBox: `${-pad} ${-pad} ${w * S + pad * 2} ${h * S + pad * 2 + S * 1.3}`, class: "mz-svg", role: "img", "aria-label": "선 미로" }, host);
  el("g", {}, svg).innerHTML = spec.walls.map(([a, b, c, d]) => `<line x1="${a * S}" y1="${b * S}" x2="${c * S}" y2="${d * S}" stroke="${spec.color || "#a77fcf"}" stroke-width="4" stroke-linecap="round"/>`).join("")
    + `<g transform="translate(${(spec.entry[0] + spec.entry[1]) / 2 * S} ${-S * 0.9})"><path d="M0 -12 V10 M-8 2 L0 12 L8 2" stroke="#ff7a6b" stroke-width="5" fill="none" stroke-linecap="round"/></g>`
    + `<g transform="translate(${(spec.exit[0] + spec.exit[1]) / 2 * S} ${h * S + S * 0.7})"><path d="M0 -12 V10 M-8 2 L0 12 L8 2" stroke="#ff7a6b" stroke-width="5" fill="none" stroke-linecap="round"/></g>`
    + (goalArt ? `<g transform="translate(${(spec.exit[0] + spec.exit[1]) / 2 * S - 22} ${h * S + S * 1.05})">${goalArt}</g>` : "");
  const line = el("polyline", { fill: "none", stroke: "#ff5a8a", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
  const tok = el("g", {}, svg); tok.innerHTML = token ? `<g transform="translate(-22 -24)">${token}</g>` : "";
  const startPt = { x: (spec.entry[0] + spec.entry[1]) / 2, y: -0.55 };
  let pts = [startPt], drawing = false, done = false, lastBlock = 0, resolveDone;
  const finished = new Promise((r) => { resolveDone = r; });
  const R = 0.2;
  const hitWall = (x, y) => {
    if (y < 0.05 && !(x > spec.entry[0] + R && x < spec.entry[1] - R)) return y > -0.95 ? true : false;
    if (x < R - 0.1 || x > w - R + 0.1) return true;
    if (y < -0.95) return true;
    for (const [a, b, c, d] of spec.walls) {
      if (a === c) { if (Math.abs(x - a) < R && y > Math.min(b, d) - R && y < Math.max(b, d) + R) return true; }
      else if (Math.abs(y - b) < R && x > Math.min(a, c) - R && x < Math.max(a, c) + R) return true;
    }
    return false;
  };
  const clear = (p, q) => { const n = Math.ceil(Math.hypot(q.x - p.x, q.y - p.y) / 0.06); for (let i = 1; i <= n; i++) { const t = i / n; if (hitWall(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t)) return false; } return true; };
  function draw() { line.setAttribute("points", pts.map((p) => `${p.x * S},${p.y * S}`).join(" ")); const e = pts[pts.length - 1]; tok.setAttribute("transform", `translate(${e.x * S} ${e.y * S})`); }
  function go(e) {
    if (done) return;
    const sp = svgPoint(svg, e), q = { x: sp.x / S, y: sp.y / S }, last = pts[pts.length - 1];
    const dist = Math.hypot(q.x - last.x, q.y - last.y);
    if (dist < 0.12) return;
    if (dist > 1.6) return;                                   // 손가락이 길 끝에서 너무 멀면 무시(길 끝에서 이어 긋기)
    if (!clear(last, q)) { const now = Date.now(); if (now - lastBlock > 900) { lastBlock = now; onBlocked?.(); } return; }
    pts.push(q); draw();
    if (q.y > h + 0.25) { done = true; drawing = false; resolveDone(pts.slice()); }
  }
  svg.addEventListener("pointerdown", (e) => { drawing = true; svg.setPointerCapture?.(e.pointerId); go(e); });
  svg.addEventListener("pointermove", (e) => { if (drawing) go(e); });
  svg.addEventListener("pointerup", () => { drawing = false; }); svg.addEventListener("pointercancel", () => { drawing = false; });
  draw();
  return { svg, finished, reset() { if (!done) { pts = [startPt]; draw(); } }, get done() { return done; } };
}
