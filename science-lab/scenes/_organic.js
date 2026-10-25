// 생물 표본용 공용 도구 — 캔버스로 그린 질감(잎맥·톱니·알락무늬·겹눈·마디·날개맥)과 휘는 잎 판.
// 잎은 「테두리만 삼각형으로 메운 도형」이 아니라, 잘게 나눈 평면에 잎 모양을 알파로 오려 내고 잎맥을 그려 넣은 것이다.
// 그래서 잎몸을 휘게 할 수 있고(가운데 접힘·끝 처짐), 톱니·갈라짐이 그림 수준으로 세밀하며, 그림자도 잎 윤곽대로 진다.
import * as THREE from '../../world-explorer/vendor/three.module.js';

const _cache = new Map();
if (typeof window !== 'undefined') window.__organicTex = _cache;   // 질감 확인용(검사 스크립트가 캔버스를 꺼내 본다)
export function canvasTex(key, w, h, draw, opts = {}) {
  if (_cache.has(key)) return _cache.get(key);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const c = cv.getContext('2d'); draw(c, w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = opts.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = opts.repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  _cache.set(key, t); return t;
}
// 고정 시드 난수(같은 표본은 늘 같은 무늬)
export const rng = (seed) => { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
export const hex = (n) => '#' + n.toString(16).padStart(6, '0');
const mix = (a, b, t) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const ch = (sh) => Math.round(((A >> sh) & 255) * (1 - t) + ((B >> sh) & 255) * t); return `rgb(${ch(16)},${ch(8)},${ch(0)})`; };

// ── 잎 윤곽: 캔버스 좌표(0..w, 0..h), 잎자루 쪽이 아래(y=h), 끝이 위(y=0). 가운데 x=w/2 ──
// 반쪽 윤곽을 점 목록(위→아래)으로 만들고 좌우 대칭으로 닫는다. 톱니는 이 점 목록에 넣는다.
const OUTLINES = {
  elliptic: (n = 40) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [Math.sin(Math.PI * Math.min(1, t * 1.02)) ** 0.75 * 0.98, t]; }),
  ovate: (n = 40) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [Math.sin(Math.PI * t ** 0.8) ** 0.9 * 0.98, t]; }),
  lance: (n = 40) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [Math.sin(Math.PI * t ** 0.9) ** 1.4 * 0.95, t]; }),
  serrate: (n = 26) => { const out = []; for (let i = 0; i <= n; i++) { const t = i / n, r = Math.sin(Math.PI * t ** 0.85) ** 0.9 * 0.98; out.push([r, t]); if (i < n && t > 0.04 && t < 0.92) out.push([r * 0.86, t + 0.55 / n]); } return out; },
  lobed: (n = 7) => { const out = [[0.02, 0]]; for (let i = 0; i < n; i++) { const t0 = (i + 0.2) / n, t1 = (i + 0.75) / n, big = 0.35 + 0.63 * Math.sin(Math.PI * Math.min(1, (i + 0.5) / n * 1.1)); out.push([big * 0.35, t0]); out.push([big, t0 + (t1 - t0) * 0.45]); out.push([big * 0.9, t1]); } out.push([0.18, 0.98], [0.12, 1]); return out; },
  palmate: () => { const out = [], lobes = 5, a0 = Math.PI * 1.18, a1 = -Math.PI * 0.18; for (let i = 0; i <= lobes * 2; i++) { const a = a0 + (i / (lobes * 2)) * (a1 - a0), r = i % 2 ? 0.58 : 1; const x = Math.cos(a) * r * 0.98, y = 0.92 - Math.sin(a) * r * 0.9; out.push([x, y]); if (i % 2 === 0 && i < lobes * 2) { const a2 = a0 + ((i + 0.5) / (lobes * 2)) * (a1 - a0); out.push([Math.cos(a2) * 0.86 * 0.98, 0.92 - Math.sin(a2) * 0.86 * 0.9]); } } out.push([0.08, 1], [-0.08, 1]); out.full = true; out.straight = true; return out; },
  lily: (n = 56) => { const out = [[0, 0.56]]; for (let i = 0; i <= n; i++) { const a = -Math.PI * 0.42 + (i / n) * (Math.PI * 1.84); out.push([Math.cos(a) * 0.98, 0.5 - Math.sin(a) * 0.5]); } out.full = true; return out; },   // 둥근 잎 + 잎자루까지 V자 홈
  round: (n = 48) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [Math.sin(Math.PI * t) * 0.98, t]; }),
  petal: (n = 30) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [Math.sin(Math.PI * t ** 1.3) ** 0.8 * 0.95, t]; }),
};
// 정해진 모양의 윤곽 — m: 가장 넓은 자리(잎끝 0 ~ 잎밑 1), p: 통통함(작을수록 둥글다), teeth: 한쪽 톱니 수(0이면 밋밋), depth: 톱니 깊이, double: 겹톱니.
// 잴 수 있는 잎(자연관찰 「비슷한 잎 재서 구분하기」)에 쓴다: 가장 넓은 자리와 톱니 수가 그림과 측정값에서 똑같다.
export function shapedOutline({ m = 0.5, p = 0.8, teeth = 0, depth = 0.06, double = false, n = 60, from = 0.06, to = 0.9 } = {}) {
  const k = Math.log(0.5) / Math.log(m), r = (t) => Math.sin(Math.PI * Math.min(1, Math.max(0, t)) ** k) ** p * 0.98;
  if (!teeth) { const out = Array.from({ length: n + 1 }, (_, i) => [r(i / n), i / n]); out.teeth = 0; return out; }
  const out = [], d = (to - from) / teeth;
  for (let i = 0; i <= Math.round(from * n); i++) out.push([r(i / n), i / n]);
  for (let i = 0; i < teeth; i++) {
    const t = from + i * d;
    out.push([r(t), t]);
    if (double) out.push([r(t + 0.35 * d) * (1 - depth * 0.45), t + 0.35 * d], [r(t + 0.5 * d) * (1 - depth * 0.12), t + 0.5 * d]);
    out.push([r(t + 0.85 * d) * (1 - depth), t + 0.85 * d]);
  }
  for (let i = Math.round(to * n); i <= n; i++) out.push([r(i / n), i / n]);
  out.teeth = teeth; return out;
}
// 윤곽에서 가장 넓은 점(반폭 x·위치 t) — 잴 때 「최대 폭」과 「잎밑~최대 폭」
export const widest = (pts) => pts.reduce((b, q) => (q[0] > b[0] ? q : b), [0, 0]);
function tracePath(c, pts, w, h) {
  c.beginPath(); const cx = w / 2;
  if (pts.full) { pts.forEach(([x, t], i) => { const X = cx + x * cx * 0.98, Y = t * h; if (!i) c.moveTo(X, Y); else if (pts.straight) c.lineTo(X, Y); else { const [px, pt] = pts[i - 1]; c.quadraticCurveTo((cx + px * cx * 0.98 + X) / 2, (pt * h + Y) / 2, X, Y); } }); c.closePath(); return; }
  const L = pts.map(([x, t]) => [cx + x * cx * 0.98, t * h]), R = [...pts].reverse().map(([x, t]) => [cx - x * cx * 0.98, t * h]);
  c.moveTo(cx, 0); L.forEach(([x, y]) => c.lineTo(x, y)); R.forEach(([x, y]) => c.lineTo(x, y)); c.closePath();
}
// 잎맥: 가운데 주맥 + 곁맥(깃 모양) + 가는 그물맥. palmate면 밑에서 부챗살. parallel이면 세로 평행맥(외떡잎).
function drawVeins(c, w, h, { type = 'pinnate', color = 'rgba(40,70,30,0.55)', fine = 'rgba(40,70,30,0.22)', n = 9, seed = 3 } = {}) {
  const r = rng(seed); c.lineCap = 'round';
  if (type === 'parallel') { c.strokeStyle = color; c.lineWidth = w * 0.006; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(w / 2 + i * w * 0.1, h); c.quadraticCurveTo(w / 2 + i * w * 0.12, h * 0.4, w / 2 + i * w * 0.02, 0); c.stroke(); } return; }
  if (type === 'palmate' || type === 'radial') {
    const ox = w / 2, oy = type === 'radial' ? h * 0.72 : h * 0.98, k = type === 'radial' ? 12 : 5;
    for (let i = 0; i < k; i++) { const a = type === 'radial' ? (i / k) * Math.PI * 2 : -Math.PI * 0.08 - (i / (k - 1)) * Math.PI * 0.84; c.strokeStyle = color; c.lineWidth = w * 0.012; c.beginPath(); c.moveTo(ox, oy); c.quadraticCurveTo(ox + Math.cos(a) * w * 0.3, oy + Math.sin(a) * h * 0.3, ox + Math.cos(a) * w * 0.55, oy + Math.sin(a) * h * 0.55); c.stroke();
      for (let j = 1; j <= 5; j++) { const t = j / 6, px = ox + Math.cos(a) * w * 0.55 * t, py = oy + Math.sin(a) * h * 0.55 * t; for (const s of [-1, 1]) { c.strokeStyle = fine; c.lineWidth = w * 0.004; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(a + s * 1.1) * w * 0.12, py + Math.sin(a + s * 1.1) * h * 0.12); c.stroke(); } } }
    return;
  }
  c.strokeStyle = color; c.lineWidth = w * 0.02; c.beginPath(); c.moveTo(w / 2, h); c.lineTo(w / 2, h * 0.03); c.stroke();
  for (let i = 1; i <= n; i++) { const t = 0.08 + (i / (n + 1)) * 0.85, y = h * (1 - t * 0.92) ; const len = w * 0.44 * Math.sin(Math.PI * Math.min(1, t * 1.05)) ** 0.7; for (const s of [-1, 1]) {
    c.strokeStyle = color; c.lineWidth = w * 0.008; c.beginPath(); c.moveTo(w / 2, y); c.quadraticCurveTo(w / 2 + s * len * 0.5, y - h * 0.05, w / 2 + s * len, y - h * 0.11 - r() * h * 0.02); c.stroke();
    for (let j = 1; j <= 3; j++) { const u = j / 4, px = w / 2 + s * len * u, py = y - h * 0.05 * u * 1.4; c.strokeStyle = fine; c.lineWidth = w * 0.003; c.beginPath(); c.moveTo(px, py); c.lineTo(px + s * w * 0.03, py - h * 0.03 - r() * h * 0.02); c.lineTo(px + s * w * 0.06, py - h * 0.02); c.stroke(); }
  } }
}
// 잎 질감 한 벌: 앞면·뒷면 색 지도 + 알파. 앞면은 가운데가 진하고 가장자리로 밝아지며, 뒷면은 연하고 잎맥이 도드라진다.
export function leafTextures(key, { outline = 'elliptic', veins = 'pinnate', top = '#3f8f3a', topEdge = '#79b56a', under = '#9cc08a', veinN = 9, seed = 3, w = 512, h = 768, glossSpots = true } = {}) {
  const pts = Array.isArray(outline) ? outline : OUTLINES[outline] ? OUTLINES[outline]() : OUTLINES.elliptic();
  const alpha = canvasTex(key + ':a', w, h, (c) => { c.fillStyle = '#000'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; tracePath(c, pts, w, h); c.fill(); }, { linear: true });
  const face = (name, base, edge, veinCol, fineCol, spots) => canvasTex(key + ':' + name, w, h, (c) => {
    const g = c.createRadialGradient(w / 2, h * 0.55, w * 0.05, w / 2, h * 0.55, w * 0.75); g.addColorStop(0, base); g.addColorStop(1, edge); c.fillStyle = g; c.fillRect(0, 0, w, h);
    const r = rng(seed + 11); if (spots) { for (let i = 0; i < 140; i++) { c.fillStyle = `rgba(255,255,230,${0.03 + r() * 0.05})`; c.beginPath(); c.ellipse(r() * w, r() * h, 6 + r() * 30, 3 + r() * 16, r() * 3, 0, Math.PI * 2); c.fill(); } }
    drawVeins(c, w, h, { type: veins, color: veinCol, fine: fineCol, n: veinN, seed });
    c.fillStyle = '#fff'; c.globalCompositeOperation = 'destination-in'; tracePath(c, pts, w, h); c.fill(); c.globalCompositeOperation = 'source-over';   // 반드시 불투명 채움 — 직전 fillStyle(반투명 광택점)로 오려 내면 잎 전체가 거의 투명해져 alphaTest에 사라진다(실제로 겪음)
    c.strokeStyle = 'rgba(30,60,25,0.5)'; c.lineWidth = 3; tracePath(c, pts, w, h); c.stroke();   // 가장자리 선
  });
  return {
    alpha, pts,
    top: face('t', top, topEdge, 'rgba(35,70,30,0.6)', 'rgba(35,70,30,0.25)', glossSpots),
    under: face('u', under, mix(under, '#ffffff', 0.25), 'rgba(70,110,60,0.85)', 'rgba(70,110,60,0.4)', false),
  };
}
// 휘는 잎 판: 잘게 나눈 평면(잎자루 끝 = 원점, +y로 자람, 폭 w·길이 h). curl = 가운데(주맥) 접힘, droop = 끝 처짐, wave = 가장자리 물결.
export function leafMesh(tex, { w = 1, h = 1.6, curl = 0.18, droop = 0.25, wave = 0, gloss = 0.5, segs = [10, 18] } = {}) {
  const geo = new THREE.PlaneGeometry(w, h, segs[0], segs[1]); geo.translate(0, h / 2, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), u = x / (w / 2), v = y / h;
    const z = -curl * h * 0.25 * u * u - droop * h * v * v * 0.6 + wave * h * 0.03 * Math.sin(v * 9 + u * 2) * Math.abs(u);
    pos.setZ(i, z);   // 캔버스 위쪽(y=0)이 잎끝이고 텍스처는 flipY라 uv v=1 = 캔버스 위 = 평면 +y 끝. 뒤집을 필요 없음
  }
  geo.computeVertexNormals();
  const common = { alphaMap: tex.alpha, alphaTest: 0.5, roughness: 0.55 };
  const front = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ ...common, map: tex.top, side: THREE.FrontSide, clearcoat: gloss, clearcoatRoughness: 0.35 }));
  const back = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ ...common, map: tex.under, side: THREE.BackSide, roughness: 0.85 }));
  front.castShadow = true; back.castShadow = false; front.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaMap: tex.alpha, alphaTest: 0.5 });
  const g = new THREE.Group(); g.add(front, back); g.userData.isLeaf = true; return g;
}

// ── 곤충용 질감 ──
// 알락무늬 키틴질: 바탕색 + 얼룩 + 마디 띠(가로 줄). 배(lathe)의 v 방향이 마디 방향.
export function chitinTex(key, { base = '#6b4a2a', spot = '#3c2a16', light = '#8d6a44', density = 0, rings = 6, seed = 5 } = {}) {
  return canvasTex(key, 256, 512, (c, w, h) => {
    c.fillStyle = base; c.fillRect(0, 0, w, h); const r = rng(seed);
    for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(255,240,200,${0.04 + r() * 0.06})`; c.beginPath(); c.ellipse(r() * w, r() * h, 8 + r() * 30, 4 + r() * 12, r() * 3, 0, Math.PI * 2); c.fill(); }
    for (let i = 0; i < density * 400; i++) { c.fillStyle = r() < 0.6 ? spot : light; c.globalAlpha = 0.35 + r() * 0.5; c.beginPath(); c.ellipse(r() * w, r() * h, 2 + r() * 9, 1.5 + r() * 5, r() * 3, 0, Math.PI * 2); c.fill(); } c.globalAlpha = 1;
    for (let i = 1; i < rings; i++) { const y = (i / rings) * h; const g = c.createLinearGradient(0, y - 10, 0, y + 6); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.7, 'rgba(0,0,0,0.42)'); g.addColorStop(1, 'rgba(255,255,255,0.12)'); c.fillStyle = g; c.fillRect(0, y - 10, w, 16); }
  });
}
// 겹눈: 육각 낱눈 격자
export function facetTex(key, base = '#1d1a16') {
  return canvasTex(key, 128, 128, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); const s = 9; for (let y = 0; y < h + s; y += s * 0.87) for (let x = 0; x < w + s; x += s) { const ox = (Math.round(y / (s * 0.87)) % 2) * s / 2; c.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k + Math.PI / 6; c.lineTo(x + ox + Math.cos(a) * s * 0.5, y + Math.sin(a) * s * 0.5); } c.closePath(); c.strokeStyle = 'rgba(120,110,90,0.45)'; c.lineWidth = 1; c.stroke(); c.fillStyle = 'rgba(255,255,255,0.06)'; c.fill(); } const g = c.createRadialGradient(w * 0.35, h * 0.35, 4, w * 0.35, h * 0.35, w * 0.5); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }, { repeat: true });
}
// 뒷다리 넓적다리의 깃 무늬(메뚜기)
export function femurTex(key, base = '#7bb651', line = '#4d7a2f') {
  return canvasTex(key, 128, 256, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); c.strokeStyle = line; c.lineWidth = 2.5; for (let i = 0; i < 14; i++) { const y = 10 + i * 17; c.beginPath(); c.moveTo(w * 0.5, y); c.lineTo(w * 0.12, y + 12); c.moveTo(w * 0.5, y); c.lineTo(w * 0.88, y + 12); c.stroke(); } c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 3; c.beginPath(); c.moveTo(w * 0.5, 0); c.lineTo(w * 0.5, h); c.stroke(); });   // 깃 무늬가 길이 방향(구의 v)으로
}
// 더듬이·다리의 마디 띠
export function ringTex(key, base = '#3a2a1a') {
  return canvasTex(key, 256, 32, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 16) { c.fillStyle = 'rgba(0,0,0,0.45)'; c.fillRect(x, 0, 3, h); c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(x + 3, 0, 2, h); } }, { repeat: true });   // 가로 방향(튜브의 u) 띠
}
// 날개맥: 세로맥 여러 줄 + 가로맥으로 칸(cell)을 만든다. kind: 'tegmen'(가죽질 앞날개) · 'hind'(막질 부채) · 'cricket'(귀뚜라미 앞날개 — 소리판 타원)
export function wingTex(key, kind, base = '#6f9b4a') {
  return canvasTex(key, 512, 256, (c, w, h) => {
    if (kind === 'hind') { c.fillStyle = 'rgba(236,246,228,1)'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(60,80,50,0.55)'; c.lineWidth = 1.4; for (let i = 0; i < 18; i++) { const a = -0.1 + (i / 17) * 1.5; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * w * 1.2, Math.sin(a) * w * 1.2); c.stroke(); } for (let r = 60; r < w; r += 38) { c.beginPath(); c.arc(0, 0, r, -0.1, 1.5); c.stroke(); } return; }
    c.fillStyle = base; c.fillRect(0, 0, w, h); const r = rng(9);
    for (let i = 0; i < 80; i++) { c.fillStyle = `rgba(0,0,0,${0.03 + r() * 0.05})`; c.beginPath(); c.ellipse(r() * w, r() * h, 6 + r() * 24, 3 + r() * 10, r() * 3, 0, Math.PI * 2); c.fill(); }
    c.strokeStyle = 'rgba(25,35,15,0.6)'; c.lineWidth = 2;
    for (let i = 0; i < 7; i++) { const y0 = h * 0.5 + (i - 3) * 12; c.beginPath(); c.moveTo(0, y0); c.bezierCurveTo(w * 0.35, y0 + (i - 3) * 14, w * 0.7, h * 0.5 + (i - 3) * 30, w, h * 0.5 + (i - 3) * 28); c.stroke(); }
    c.lineWidth = 1.1; c.strokeStyle = 'rgba(25,35,15,0.4)';
    for (let x = 30; x < w; x += 26 + r() * 10) { c.beginPath(); c.moveTo(x, h * 0.2); c.lineTo(x + 4 + r() * 6, h * 0.8); c.stroke(); }
    if (kind === 'cricket') { c.strokeStyle = 'rgba(25,35,15,0.75)'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(w * 0.32, h * 0.5, w * 0.14, h * 0.2, 0.2, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.moveTo(w * 0.1, h * 0.3); c.quadraticCurveTo(w * 0.3, h * 0.05, w * 0.55, h * 0.3); c.stroke(); }
  });
}
// 흙: 거친 알갱이 + 돌 조각. 풀잎: 세로 줄무늬와 끝으로 갈수록 밝게.
export function soilTex(key, base = '#5a4330', seed = 2) {
  return canvasTex(key, 512, 512, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); const r = rng(seed); for (let i = 0; i < 2600; i++) { const v = r(); c.fillStyle = v < 0.5 ? `rgba(0,0,0,${0.08 + r() * 0.2})` : `rgba(255,230,190,${0.05 + r() * 0.15})`; c.beginPath(); c.ellipse(r() * w, r() * h, 1 + r() * 4, 1 + r() * 3, r() * 3, 0, Math.PI * 2); c.fill(); } for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(150,140,125,${0.5 + r() * 0.4})`; c.beginPath(); c.ellipse(r() * w, r() * h, 4 + r() * 9, 3 + r() * 6, r() * 3, 0, Math.PI * 2); c.fill(); } }, { repeat: true });
}
export function grassTex(key, base = '#9ccc65', tip = '#d8e89a') {
  return canvasTex(key, 32, 256, (c, w, h) => { const g = c.createLinearGradient(0, h, 0, 0); g.addColorStop(0, base); g.addColorStop(1, tip); c.fillStyle = g; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(0,0,0,0.18)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(w / 2, h); c.lineTo(w / 2, 0); c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.15)'; c.beginPath(); c.moveTo(w * 0.3, h); c.lineTo(w * 0.3, 0); c.stroke(); });
}
// 줄기 겉: 세로 줄 + 작은 점(껍질눈)
export function stemTex(key, base = '#6b7d3a', seed = 4) {
  return canvasTex(key, 128, 512, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); const r = rng(seed); for (let i = 0; i < 30; i++) { c.strokeStyle = `rgba(0,0,0,${0.05 + r() * 0.12})`; c.lineWidth = 1 + r() * 2; const x = r() * w; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + (r() - 0.5) * 8, h); c.stroke(); } for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,240,200,${0.15 + r() * 0.25})`; c.beginPath(); c.ellipse(r() * w, r() * h, 1.5 + r() * 2, 1 + r() * 1.5, 0, 0, Math.PI * 2); c.fill(); } }, { repeat: true });
}
export { THREE };
