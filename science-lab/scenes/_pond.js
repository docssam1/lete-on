// 연못과 물에 사는 식물 모형 — 3D 장면(pond-plants)과 체험 실험실(lab-pond3d)이 함께 쓴다.
// 좌표: 물 표면 y = SURF. 왼쪽이 물가(땅), 오른쪽으로 갈수록 깊어진다. 깊이는 bottomAt(x).
// 앞면(z = POND.z1)은 수조처럼 잘라 물속이 보이게 하고, 윗면·물가·바닥은 높이장(heightAt)으로 만든 둥근 웅덩이다.
// 뒤쪽과 오른쪽은 둑이 솟아 물을 가두므로 물가선이 구불구불하게 저절로 생긴다(물 표면은 평면, 흙이 뚫고 나온다).
import { THREE, mat } from './_kit.js';

export const SURF = 1.0, BANK_X = -1.9, POND = { x0: -2.8, x1: 2.6, z0: -1.1, z1: 1.1 };
export const bottomAt = (x) => (x < BANK_X ? SURF + 0.12 : Math.max(0.05, SURF - Math.min(1, (x - BANK_X) / 1.6) * 0.95));
export const where = (x) => (x < BANK_X ? '땅' : x < BANK_X + 0.7 ? '물가' : '물');

const UP = new THREE.Vector3(0, 1, 0), XAX = new THREE.Vector3(1, 0, 0);
const LEAF = 0x3f9a4a, LEAF2 = 0x2f7d3c, ROOT = 0x6b4a2e;
const clamp01 = (t) => Math.max(0, Math.min(1, t));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
// 부드러운 결정론적 노이즈(약 -1~1)
const wave = (x, z) => Math.sin(x * 1.9 + z * 2.7) * Math.sin(x * 3.3 - z * 1.7 + 1.2) * 0.5 + Math.sin(x * 6.1 + 1.3) * Math.sin(z * 5.7 + 0.4) * 0.3 + Math.sin(x * 11.3 + z * 9.1 + 0.5) * 0.2;

// ── 지형 ──────────────────────────────────────────────────────────────
const G = { x0: POND.x0 - 0.2, x1: POND.x1 + 0.85, z0: POND.z0 - 0.95, z1: POND.z1 };   // 흙 덩어리 전체 범위(앞면만 잘림)
const LAND = SURF + 0.13, DMAX = 1.5;
const wob = (z) => 0.1 * Math.sin(z * 2.6 + 0.4) + 0.05 * Math.sin(z * 5.3 + 1.9);      // 물가선 굽이
const GA = (G.x1 - G.x0) / 2, GB = (G.z1 - G.z0) / 2, GCX = (G.x0 + G.x1) / 2, GCZ = (G.z0 + G.z1) / 2, ROUND = 0.8;
const fxOf = (t) => { const tb = Math.min(0, t); return 1 - ROUND * (1 - Math.sqrt(1 - tb * tb / 2)); };
const fzOf = (s, t) => (t < 0 ? 1 - ROUND * (1 - Math.sqrt(1 - s * s / 2)) : 1);
// 격자 좌표(s,t ∈ -1..1; t=-1 뒤, t=+1 앞 단면) → 월드. 뒤쪽 두 모서리를 둥글게 오므려 네모난 윤곽을 없앤다.
function at(s, t) {
  const x = GCX + GA * s * fxOf(t), z = GCZ + GB * t * fzOf(s, t), dL = (s + 1) * GA, dR = (1 - s) * GA, dB = (t + 1) * GB;
  return { x, z, h: heightAt(x, z, dL, dR, dB), e: Math.min(dL, dR, dB) };
}
const sOf = (x, t) => (x - GCX) / (GA * fxOf(t));                                        // 월드 x 를 지나는 격자 s
// 지표 높이: 연못 안은 bottomAt(x) 그대로(식물이 이 값에 선다), 물가선만 z 에 따라 굽이치고, 가장자리(dL·dR·dB)에서 둑이 솟는다.
function heightAt(x, z, dL, dR, dB) {
  const xs = x - wob(z), lip = sstep(BANK_X + 0.1, BANK_X - 0.16, xs);
  let h = lerp(bottomAt(Math.max(xs, BANK_X)), LAND + 0.06 * sstep(BANK_X - 0.3, POND.x0, xs), lip);
  h += wave(x, z) * (h < SURF ? 0.022 : 0.016);
  const rim = SURF + 0.15 + 0.03 * wave(x * 1.4 + 3, z * 1.4);                           // 뒤·오른쪽 둑
  const r = Math.max(sstep(1.1, 0.4, dR), sstep(1.35, 0.4, dB));
  h = lerp(h, Math.max(h, rim), r);
  const roll = 1 - sstep(0, 0.34, Math.min(dL, dR, dB));                                 // 바깥 가장자리는 둥글게 말아 내린다
  return Math.max(0.03, h - roll * roll * 0.36);
}

const C = (h) => new THREE.Color(h);
const GC = { grass: C(0x6fa84c), grass2: C(0x9ab85a), sand: C(0xb39a6b), wet: C(0x7a6445), mud: C(0x6a5638), deep: C(0x34453d) };
function groundColor(c, x, z, h) {
  const a = h - SURF, n = 0.5 + 0.5 * wave(x * 2.3 + 1, z * 2.3);
  c.copy(GC.grass).lerp(GC.grass2, n * 0.7);
  c.lerp(GC.sand, sstep(0.075, 0.02, a));
  c.lerp(GC.wet, sstep(0.015, -0.02, a));
  c.lerp(GC.mud, sstep(-0.02, -0.1, a));
  c.lerp(GC.deep, Math.pow(clamp01(-a / 0.95), 0.8) * 0.85);
  const k = 0.93 + 0.1 * wave(x * 7 + 2, z * 7); c.multiplyScalar(k);
  return c;
}

// ── 캔버스 텍스처(한 번만 만들어 공유) ───────────────────────────────
const TEX = {};
function canvasTex(key, w, h, draw, repeat) {
  if (TEX[key]) return TEX[key];
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return (TEX[key] = t);
}
function pebble(x, cx, cy, rx, ry, col) {
  const g = x.createRadialGradient(cx - rx * 0.35, cy - ry * 0.4, 1, cx, cy, Math.max(rx, ry));
  g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(0.35, col); g.addColorStop(1, 'rgba(40,30,20,0.9)');
  x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); x.fill();
}
// 흙 단면: 부식토 → 갈색 흙 → 점토 → 모래 → 자갈. v 는 "지표에서의 깊이"(층이 지표를 따라 휜다).
const soilTex = () => canvasTex('soil', 512, 512, (x, W, H) => {
  const r = rng(11), bands = [[0, '#3b2c20'], [0.06, '#664730'], [0.3, '#83603f'], [0.58, '#9d774e'], [0.86, '#b39270'], [1.14, '#8a7a67']];
  bands.forEach(([d, col], b) => {
    x.fillStyle = col; x.beginPath(); x.moveTo(0, H);
    for (let px = 0; px <= W; px += 8) x.lineTo(px, b === 0 ? 0 : d / DMAX * H + Math.sin(px / W * Math.PI * 6 + b) * 7 + Math.sin(px / W * Math.PI * 14 + b * 2) * 3);
    x.lineTo(W, H); x.closePath(); x.fill();
  });
  for (let i = 0; i < 2600; i++) { const px = r() * W, py = r() * H; x.fillStyle = r() < 0.5 ? 'rgba(255,240,210,0.10)' : 'rgba(20,12,6,0.16)'; x.fillRect(px, py, 1 + r() * 2, 1 + r() * 2); }
  x.strokeStyle = 'rgba(40,26,14,0.55)'; x.lineWidth = 1.2;                            // 잔뿌리
  for (let i = 0; i < 26; i++) { let px = r() * W, py = 2; x.beginPath(); x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += (r() - 0.5) * 10; py += 4 + r() * 8; x.lineTo(px, py); } x.stroke(); }
  const stones = ['#8c8176', '#a39686', '#6f675f', '#b3a38d', '#7d6a58'];
  for (let i = 0; i < 70; i++) {
    const d = r(), py = (0.25 + Math.pow(d, 0.7) * 0.75) * H, px = r() * W, rx = 3 + r() * (py / H) * 12, ry = rx * (0.55 + r() * 0.3), col = stones[i % stones.length];
    for (const ox of [0, -W, W]) if (px + ox > -20 && px + ox < W + 20) pebble(x, px + ox, py, rx, ry, col);
  }
}, true);
const grainTex = () => canvasTex('grain', 128, 128, (x, W, H) => {
  const r = rng(5); x.fillStyle = '#f2f2f2'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 1400; i++) { const v = 170 + r() * 85 | 0; x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); }
}, true);

// ── 지오메트리 도우미 ─────────────────────────────────────────────────
function merge(list) {                                      // 속성이 같은 지오메트리들을 한 덩어리로(그리기 호출 줄이기)
  const parts = list.map((g) => (g.index ? g.toNonIndexed() : g));
  const out = new THREE.BufferGeometry();
  for (const n of ['position', 'normal', 'uv', 'color']) {
    if (!parts.every((p) => p.attributes[n])) continue;
    const size = parts[0].attributes[n].itemSize, arr = new Float32Array(parts.reduce((s, p) => s + p.attributes[n].count * size, 0)); let o = 0;
    for (const p of parts) { arr.set(p.attributes[n].array, o); o += p.attributes[n].count * size; }
    out.setAttribute(n, new THREE.BufferAttribute(arr, size));
  }
  return out;
}
function paint(geo, fn) {                                   // 정점 색: fn(x,y,z, color)
  const p = geo.attributes.position, a = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { fn(p.getX(i), p.getY(i), p.getZ(i), c); a.set([c.r, c.g, c.b], i * 3); }
  geo.setAttribute('color', new THREE.BufferAttribute(a, 3)); return geo;
}
// 극좌표 잎(가운데 → 가장자리). R(a)=가장자리 반지름 비율, lift=휘는 높이. 위를 향한 면.
function blade({ R, a0 = 0, a1 = Math.PI * 2, rings = 6, segs = 32, size = 1, lift = () => 0 }) {
  const P = [0, lift(0, 0, 0, 0), 0], UV = [0.5, 0.5], I = [], row = segs + 1;
  for (let k = 1; k <= rings; k++) for (let j = 0; j <= segs; j++) {
    const a = a0 + (a1 - a0) * j / segs, r = k / rings, rr = r * R(a) * size, x = Math.cos(a) * rr, z = Math.sin(a) * rr;
    P.push(x, lift(x, z, r, a), z); UV.push(0.5 + x / (2.2 * size), 0.5 - z / (2.2 * size));
  }
  for (let j = 0; j < segs; j++) I.push(0, 2 + j, 1 + j);
  for (let k = 1; k < rings; k++) for (let j = 0; j < segs; j++) { const a = 1 + (k - 1) * row + j, b = a + 1, c = a + row, d = c + 1; I.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2)); g.setIndex(I);
  g.computeVertexNormals(); return g;
}
// 띠 모양(꽃잎·길쭉한 잎): 밑동이 원점, +x 로 뻗는다. wf(u)=반폭, yf(u,v)=휨, cf(u,v,c)=색.
function strap(len, wf, nu, nv, yf = () => 0, cf) {
  const P = [], UV = [], I = [], COL = [], c = new THREE.Color();
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
    const u = i / nu, v = nv ? (j / nv) * 2 - 1 : 0; P.push(u * len, yf(u, v), v * wf(u)); UV.push(u, (v + 1) / 2);
    if (cf) { cf(u, v, c); COL.push(c.r, c.g, c.b); }
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + nv + 1, cc = a + 1, d = b + 1; I.push(a, cc, b, b, cc, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2));
  if (cf) g.setAttribute('color', new THREE.Float32BufferAttribute(COL, 3));
  g.setIndex(I); g.computeVertexNormals(); return g;
}
function rod(a, b, r0, r1, m, seg = 7) {                    // a→b 로 가는 가늘어지는 원기둥
  const v = new THREE.Vector3().subVectors(b, a), L = v.length();
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, L, seg), m);
  o.position.copy(a).addScaledVector(v, 0.5); o.quaternion.setFromUnitVectors(UP, v.normalize()); return o;
}
const vmat = (color, o = {}) => { const m = mat(color, o); m.vertexColors = true; return m; };

// ── 연못 ──────────────────────────────────────────────────────────────
function wallGeo(pts) {                                    // 흙 단면 벽: 지표선 pts 에서 바닥(y=0)까지, 바깥을 향한 면
  const P = [], N = [], UV = [], I = []; let s = 0;
  pts.forEach((p, i) => {
    if (i) s += Math.hypot(p.x - pts[i - 1].x, p.z - pts[i - 1].z);
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz) || 1;
    P.push(p.x, p.h, p.z, p.x, 0, p.z); N.push(-dz / L, 0, dx / L, -dz / L, 0, dx / L); UV.push(s / 1.6, 1, s / 1.6, 1 - p.h / DMAX);
    if (i) { const k = (i - 1) * 2; I.push(k + 1, k + 3, k, k, k + 3, k + 2); }
  });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2)); g.setIndex(I); return g;
}
function tuftGeo() {                                        // 풀 한 포기: 휘어진 풀잎 9장
  const r = rng(3), list = [];
  for (let i = 0; i < 9; i++) {
    const h = 0.09 + r() * 0.08, bend = 0.25 + r() * 0.5;
    const g = strap(h, (u) => 0.008 * (1 - u), 3, 1, (u) => -bend * u * u * h * 0.6, (u, v, c) => c.set(0x3d6b2c).lerp(C(0xa7cc62), u));
    g.rotateZ(Math.PI / 2 - 0.05); g.rotateY(i / 9 * Math.PI * 2 + r()); g.translate((r() - 0.5) * 0.03, 0, (r() - 0.5) * 0.03); list.push(g);
  }
  const m = merge(list); m.computeVertexNormals(); return m;
}

export function pond() {
  const g = new THREE.Group(), NX = 84, NZ = 40, row = NX + 1;
  // 윗면(풀밭·물가·바닥 한 장)
  const grid = [], P = [], UV = [], COL = [], I = [], c = new THREE.Color();
  for (let j = 0; j <= NZ; j++) for (let i = 0; i <= NX; i++) {
    const q = at(i / NX * 2 - 1, j / NZ * 2 - 1); grid.push(q); P.push(q.x, q.h, q.z); UV.push(i / NX, j / NZ); groundColor(c, q.x, q.z, q.h); COL.push(c.r, c.g, c.b);
  }
  for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { const a = j * row + i, b = a + 1, cc = a + row, d = cc + 1; I.push(a, cc, b, b, cc, d); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2)); geo.setAttribute('color', new THREE.Float32BufferAttribute(COL, 3));
  geo.setIndex(I); geo.computeVertexNormals();
  const gt = grainTex(); gt.repeat.set(9, 4);
  const top = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, map: gt, roughness: 0.96 })); top.receiveShadow = true; top.castShadow = true; g.add(top);
  // 단면 벽: 격자 테두리 점을 그대로 써서 틈이 없다(앞 → 오른쪽 → 뒤 → 왼쪽, 모두 바깥을 본다)
  const ring = (fn, n) => Array.from({ length: n + 1 }, (_, k) => fn(k));
  const front = ring((k) => grid[NZ * row + k], NX);
  const soilM = new THREE.MeshStandardMaterial({ map: soilTex(), roughness: 1 });
  for (const pts of [front, ring((k) => grid[(NZ - k) * row + NX], NZ), ring((k) => grid[NX - k], NX), ring((k) => grid[k * row], NZ)]) {
    const w = new THREE.Mesh(wallGeo(pts), soilM); w.receiveShadow = true; g.add(w);
  }
  // 물: 수면(물결) — 흙이 뚫고 나온 곳이 물가선이 된다. 둑 바깥(가장자리 0.36 안쪽)과 완전히 뭍인 칸은 뺀다.
  const WX = 42, WZ = 20, wq = [], WP = [], WI = [];
  for (let j = 0; j <= WZ; j++) for (let i = 0; i <= WX; i++) { const q = at(i / WX * 2 - 1, j / WZ * 2 - 1); wq.push(q); WP.push(q.x, SURF, q.z); }
  const keep = (...v) => v.every((k) => wq[k].e > 0.36) && v.some((k) => wq[k].h < SURF + 0.01);
  for (let j = 0; j < WZ; j++) for (let i = 0; i < WX; i++) { const a = j * (WX + 1) + i, b = a + 1, cc = a + WX + 1, d = cc + 1; if (keep(a, cc, b)) WI.push(a, cc, b); if (keep(b, cc, d)) WI.push(b, cc, d); }
  const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(WP, 3)); wg.setIndex(WI); wg.computeVertexNormals();
  const surf = new THREE.Mesh(wg, new THREE.MeshPhysicalMaterial({ color: 0x7cc0e6, roughness: 0.14, metalness: 0, envMapIntensity: 0.55, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
  surf.renderOrder = 2; g.add(surf);
  const FP = [], FC = [], FI = [], top1 = C(0xa6d9f2), deep1 = C(0x1f5f86), cc = new THREE.Color();
  front.forEach((p, i) => {
    const b = Math.min(SURF, p.h), k = clamp01((SURF - b) / 0.95); cc.copy(top1).lerp(deep1, Math.pow(k, 0.7));
    FP.push(p.x, SURF, G.z1 - 0.004, p.x, b, G.z1 - 0.004); FC.push(top1.r, top1.g, top1.b, 0.2, cc.r, cc.g, cc.b, 0.3 + 0.4 * k);
    if (i) { const a = (i - 1) * 2; FI.push(a + 1, a + 3, a, a, a + 3, a + 2); }
  });
  const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(FP, 3)); fg.setAttribute('color', new THREE.Float32BufferAttribute(FC, 4)); fg.setIndex(FI);
  const fw = new THREE.Mesh(fg, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide })); fw.renderOrder = 1; g.add(fw);
  // 수면선: 앞 유리에 닿는 물 표면의 밝은 줄
  const lineG = new THREE.BufferGeometry().setFromPoints(front.filter((p) => p.h < SURF - 0.005).map((p) => new THREE.Vector3(p.x, SURF, G.z1 - 0.003)));
  g.add(new THREE.Line(lineG, new THREE.LineBasicMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0.8 })));
  // 앞 유리: 모서리가 둥근 얇은 판
  const gw = G.x1 - G.x0 + 0.06, gh = SURF + 0.32, rr = 0.07, sh = new THREE.Shape();
  sh.moveTo(-gw / 2 + rr, 0); sh.lineTo(gw / 2 - rr, 0); sh.quadraticCurveTo(gw / 2, 0, gw / 2, rr); sh.lineTo(gw / 2, gh - rr); sh.quadraticCurveTo(gw / 2, gh, gw / 2 - rr, gh);
  sh.lineTo(-gw / 2 + rr, gh); sh.quadraticCurveTo(-gw / 2, gh, -gw / 2, gh - rr); sh.lineTo(-gw / 2, rr); sh.quadraticCurveTo(-gw / 2, 0, -gw / 2 + rr, 0);
  const glass = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 6 }),
    new THREE.MeshPhysicalMaterial({ color: 0xdcecf5, roughness: 0.05, transparent: true, opacity: 0.1, depthWrite: false }));
  glass.position.set(GCX, 0, G.z1 + 0.02); glass.renderOrder = 3; g.add(glass);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, gw - 2 * rr, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, depthWrite: false }));
  rim.rotation.z = Math.PI / 2; rim.position.set(GCX, gh, G.z1 + 0.028); g.add(rim);
  // 자갈·조약돌(물가에 많이, 둑·풀밭에 조금, 물속엔 몇 개만)
  const R = rng(21), stones = [], put = (q, s) => stones.push([q, s]);
  for (let i = 0; i < 46; i++) { const t = lerp(-0.35, 0.97, R()), z = GCZ + GB * t; put(at(sOf(BANK_X + wob(z) + (R() - 0.45) * 0.4, t), t), 0.022 + R() * 0.04); }
  for (let i = 0; i < 8; i++) { const t = lerp(-0.2, 0.9, R()); put(at(sOf(lerp(BANK_X + 0.5, POND.x1 - 0.3, R()), t), t), 0.025 + R() * 0.035); }
  for (let i = 0; i < 12; i++) { const t = lerp(-0.8, 0.95, R()); put(at(lerp(-0.93, sOf(BANK_X - 0.2, t), R()), t), 0.018 + R() * 0.025); }
  for (let n = 0, i = 0; n < 16 && i < 300; i++) { const q = at(R() * 2 - 1, R() * 1.6 - 1); if (q.e > 0.4 && q.e < 0.95 && q.h > SURF + 0.02) { put(q, 0.025 + R() * 0.04); n++; } }
  const stoneM = mat(0xffffff, { roughness: 0.8 }), sI = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), stoneM, stones.length);
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(), Pv = new THREE.Vector3(), SC = [0x8e8579, 0xa89c8a, 0x6d6760, 0xb8a78d, 0x7b6d5f, 0x9a9486];
  stones.forEach(([q, s], i) => {
    Q.setFromEuler(E.set(R() * 0.4, R() * 6.3, R() * 0.4)); S.set(s * (1 + R() * 0.5), s * 0.55, s); Pv.set(q.x, q.h + s * 0.12, q.z);
    sI.setMatrixAt(i, M4.compose(Pv, Q, S)); sI.setColorAt(i, C(SC[i % SC.length]).multiplyScalar(q.h < SURF ? 0.55 : 1));
  });
  sI.castShadow = true; sI.receiveShadow = true; g.add(sI);
  // 풀 포기(풀밭·둑·물가)
  const tufts = [];
  for (let i = 0; i < 500 && tufts.length < 170; i++) {
    const q = at(R() * 1.94 - 0.97, R() * 1.91 - 0.95), x = q.x, z = q.z, h = q.h, a = h - SURF;
    if (q.e < 0.12) continue;
    const shore = Math.abs(x - BANK_X - wob(z)) < 0.25, onLand = x < BANK_X + 0.1;
    if (a < 0.03 || (!onLand && !shore && R() < 0.55)) continue;
    tufts.push([x, h, z, (shore ? 1.25 : 1) * (0.7 + R() * 0.6)]);
  }
  const tI = new THREE.InstancedMesh(tuftGeo(), vmat(0xffffff, { roughness: 0.85, side: THREE.DoubleSide }), tufts.length);
  tufts.forEach(([x, h, z, s], i) => { Q.setFromEuler(E.set(0, R() * 6.3, 0)); S.set(s, s * (0.8 + R() * 0.5), s); Pv.set(x, h - 0.005, z); tI.setMatrixAt(i, M4.compose(Pv, Q, S)); tI.setColorAt(i, C(0xffffff).lerp(C(0xd8d08a), R() * 0.5)); });
  tI.castShadow = true; g.add(tI);

  g.userData.surface = surf;
  g.userData.ripple = (t) => {
    const p = wg.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, SURF + Math.sin(x * 3 + t * 1.6) * 0.012 + Math.cos(z * 4 - t * 1.3) * 0.01 + Math.sin((x - z) * 7 - t * 2.3) * 0.003); }
    p.needsUpdate = true; wg.computeVertexNormals();
  };
  return g;
}

// ── 식물 공용 ─────────────────────────────────────────────────────────
function roots(n, len, spread = 0.12, color = ROOT, hairs = 0) {       // 휘어 늘어진 수염뿌리(한 덩어리) + 잔털
  const g = new THREE.Group(), r = rng(n * 31 + 7), tubes = [], H = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + r() * 0.5, sp = spread * (0.2 + r() * 0.5), L = len * (0.65 + 0.35 * r());
    const pts = [0, 0.33, 0.66, 1].map((t) => new THREE.Vector3(Math.cos(a) * sp * (0.4 + t) + (r() - 0.5) * 0.03 * t, -L * t, Math.sin(a) * sp * (0.4 + t) + (r() - 0.5) * 0.03 * t));
    const cur = new THREE.CatmullRomCurve3(pts); tubes.push(new THREE.TubeGeometry(cur, 8, 0.0055 * (1 - 0.3 * r()), 4));
    for (let k = 0; k < hairs; k++) {
      const t = 0.15 + 0.85 * k / hairs, p = cur.getPointAt(t), b = r() * 6.3, l = 0.025 + 0.02 * r();
      H.push(p.x, p.y, p.z, p.x + Math.cos(b) * l, p.y - l * 0.6, p.z + Math.sin(b) * l);
    }
  }
  const m = new THREE.Mesh(merge(tubes), mat(color, { roughness: 0.9 })); g.add(m);
  if (H.length) { const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(H, 3)); g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.75 }))); }
  return g;
}

// 부레옥잠 잎 무늬: 윤기 도는 초록, 밑동에서 끝으로 휘는 잎맥
const hyLeafTex = () => canvasTex('hyleaf', 256, 256, (x, W, H) => {
  const g = x.createRadialGradient(W * 0.55, H * 0.5, 10, W * 0.5, H * 0.5, W * 0.5); g.addColorStop(0, '#6cc052'); g.addColorStop(1, '#2f7a34');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  const bx = W * 0.16, by = H * 0.5; x.lineCap = 'round';
  for (let k = -4; k <= 4; k++) {
    x.strokeStyle = k ? 'rgba(200,240,170,0.35)' : 'rgba(215,245,185,0.6)'; x.lineWidth = k ? 1.6 : 3;
    x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(W * 0.5, by + k * H * 0.12, W * 0.95, by + k * H * 0.012); x.stroke();
  }
});
// 수련 잎 무늬: 가운데서 퍼지는 잎맥, 가장자리 붉은 기
const lilyTex = () => canvasTex('lily', 256, 256, (x, W, H) => {
  const cx = W / 2, cy = H / 2, g = x.createRadialGradient(cx, cy, 4, cx, cy, W * 0.46);
  g.addColorStop(0, '#5fae4c'); g.addColorStop(0.8, '#3a8a3b'); g.addColorStop(0.97, '#5d6a2e'); g.addColorStop(1, '#7a4a32');
  x.fillStyle = g; x.fillRect(0, 0, W, H); x.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * Math.PI * 2; x.strokeStyle = 'rgba(190,235,160,0.4)'; x.lineWidth = 1.4;
    x.beginPath(); x.moveTo(cx, cy); x.quadraticCurveTo(cx + Math.cos(a + 0.12) * W * 0.22, cy + Math.sin(a + 0.12) * H * 0.22, cx + Math.cos(a) * W * 0.45, cy + Math.sin(a) * H * 0.45); x.stroke();
  }
  const r = rng(9); for (let i = 0; i < 120; i++) { x.fillStyle = 'rgba(30,70,30,0.18)'; x.fillRect(r() * W, r() * H, 2, 2); }
});

// 부레옥잠: 잎자루가 공처럼 부풀어 있다(공기주머니) → 물 위에 떠서 산다. 원점 = 물 표면 높이.
export function hyacinth() {
  const g = new THREE.Group(), n = 7, r = rng(4);
  // 잎자루 공기주머니: 아래쪽이 불룩하고 위로 갈수록 가늘어지는 방추형(세로 1.35배로 늘린 모양이 기본)
  const bulbGeo = new THREE.LatheGeometry(Array.from({ length: 15 }, (_, i) => { const t = i / 14; return new THREE.Vector2(Math.max(0.011, 0.064 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.8)), (t - 0.5) * 0.2); }), 20);
  const bulbM = mat(0xa3d672, { roughness: 0.3 }), stalkM = mat(0x7cbf5a, { roughness: 0.45 }), leafM = mat(0xffffff, { roughness: 0.3, side: THREE.DoubleSide }); leafM.map = hyLeafTex();
  const notch = (a) => Math.exp(-((a - Math.PI) ** 2) / 0.05);
  const leafGeo = blade({ R: (a) => 1 - 0.2 * notch(a) + 0.06 * Math.cos(a), size: 0.14, rings: 6, segs: 30, lift: (x, z, rr, a) => 0.036 * (0.45 + 0.55 * Math.sin(a) ** 2) * rr * rr + 0.005 * Math.sin(a * 6) * rr ** 3 });
  leafGeo.translate(0.14 * (1 - 0.2 - 0.06), 0, 0);                                   // 잎 밑동(홈)을 원점으로
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + r() * 0.3, arm = new THREE.Group(), s = 0.85 + r() * 0.3, lean = -0.5 - r() * 0.25;
    const bulb = new THREE.Mesh(bulbGeo, bulbM); bulb.scale.set(1, 1.35, 1); bulb.position.set(0.15, 0.06, 0); bulb.rotation.z = lean; bulb.userData.bulb = true;
    const top = new THREE.Vector3(0.15 + 0.13 * Math.sin(-lean), 0.06 + 0.13 * Math.cos(lean), 0), base = top.clone().add(new THREE.Vector3(0.06 * s, 0.1 * s, 0));
    const stalk = rod(top, base, 0.013, 0.009, stalkM);
    const leaf = new THREE.Mesh(leafGeo, leafM); leaf.position.copy(base); leaf.rotation.set((r() - 0.5) * 0.4, 0, 0.6 + r() * 0.4); leaf.scale.setScalar(s);
    arm.add(bulb, stalk, leaf); arm.rotation.y = a; arm.children.forEach((c) => { c.castShadow = true; }); g.add(arm);
  }
  // 꽃대: 연보라 꽃 여러 송이, 윗꽃잎에 노란 점
  const flower = new THREE.Group(), tepals = [];
  for (let k = 0; k < 6; k++) {
    const t = strap(0.038, (u) => 0.016 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.05)), 0.7), 4, 2, (u, v) => 0.012 * u * u + 0.004 * v * v,
      (u, v, c) => { c.set(0xb49be8).lerp(C(0x8e74d6), u * 0.5); if (k === 0 && u > 0.3 && u < 0.7 && Math.abs(v) < 0.6) c.set(u > 0.4 && u < 0.6 && Math.abs(v) < 0.3 ? 0xf2d23a : 0x3b3aa8); });
    t.rotateY(-(k / 6) * Math.PI * 2 - Math.PI / 2); tepals.push(t);
  }
  const floret = merge(tepals); floret.computeVertexNormals(); floret.rotateZ(-Math.PI / 2 + 0.25);   // 꽃이 옆(+x)을 보게
  const fl = new THREE.InstancedMesh(floret, vmat(0xffffff, { roughness: 0.5, side: THREE.DoubleSide }), 9);
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), Sc = new THREE.Vector3();
  for (let i = 0; i < 9; i++) { const ang = i * 2.4, y = 0.44 + i * 0.024; Q.setFromAxisAngle(UP, -ang); P.set(Math.cos(ang) * 0.03, y, Math.sin(ang) * 0.03); Sc.setScalar(1 - i * 0.04); fl.setMatrixAt(i, M4.compose(P, Q, Sc)); }
  fl.castShadow = true; flower.add(fl);
  flower.add(rod(new THREE.Vector3(0, 0.12, 0), new THREE.Vector3(0, 0.66, 0), 0.016, 0.009, stalkM)); g.add(flower);
  const rt = roots(20, 0.42, 0.18, 0x4a3242, 7); rt.position.y = 0.02; g.add(rt);
  g.userData.kind = 'hyacinth'; return g;
}

// 수련: 뿌리는 바닥 흙에, 긴 잎자루 끝의 둥근 잎(한쪽이 갈라짐)이 물 위에 떠 있다. place(depth)로 줄기 길이를 맞춘다. 원점 = 바닥.
export function waterLily() {
  const g = new THREE.Group(), pads = [], stems = [], r = rng(8);
  const padM = mat(0xffffff, { roughness: 0.38, side: THREE.DoubleSide }); padM.map = lilyTex();
  const padGeo = blade({ R: () => 1, a0: 0.16, a1: Math.PI * 2 - 0.16, rings: 5, segs: 40, size: 0.2, lift: (x, z, rr) => 0.02 * rr ** 6 + 0.003 * rr * rr });
  const stemM = mat(0x7a6a3a, { roughness: 0.6 }), stemGeo = new THREE.CylinderGeometry(0.008, 0.011, 1, 6);
  const sizes = [1.05, 0.9, 1.15, 0.8];
  for (let i = 0; i < 4; i++) {
    const pad = new THREE.Mesh(padGeo, padM); pad.scale.setScalar(sizes[i]); pad.castShadow = true; pad.receiveShadow = true; pads.push(pad); g.add(pad);
    const st = new THREE.Mesh(stemGeo, stemM); stems.push(st); g.add(st);
  }
  // 꽃: 꽃받침 4 + 꽃잎 세 겹 + 노란 수술
  const parts = [], petal = (len, wid, tilt, az, c0, c1) => {
    const p = strap(len, (u) => wid * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.97 + 0.03)), 0.8) * (1 - 0.25 * u), 5, 2, (u, v) => 0.25 * wid * v * v + 0.15 * len * u * u, (u, v, c) => c.set(c0).lerp(C(c1), u * u));
    p.rotateZ(tilt); p.rotateY(az); parts.push(p);
  };
  for (let i = 0; i < 4; i++) petal(0.085, 0.024, 0.18, i / 4 * Math.PI * 2 + 0.4, 0x6f8d3e, 0x9a6a5a);
  for (let i = 0; i < 8; i++) petal(0.085, 0.022, 0.35, i / 8 * Math.PI * 2, 0xfdf3f6, 0xf0a3c3);
  for (let i = 0; i < 8; i++) petal(0.072, 0.02, 0.75, (i + 0.5) / 8 * Math.PI * 2, 0xfff6f9, 0xf28fb8);
  for (let i = 0; i < 6; i++) petal(0.055, 0.017, 1.15, i / 6 * Math.PI * 2 + 0.3, 0xfffafb, 0xf6b3cf);
  const st = paint(new THREE.CylinderGeometry(0.024, 0.02, 0.03, 16, 1), (x, y, z, c) => c.set(y > 0.01 ? 0xf6d34a : 0xe6b52e)); st.translate(0, 0.015, 0); st.deleteAttribute('uv');
  parts.forEach((p) => p.deleteAttribute('uv'));
  const fGeo = merge([...parts, st]); fGeo.computeVertexNormals();
  const flower = new THREE.Mesh(fGeo, vmat(0xffffff, { roughness: 0.55, side: THREE.DoubleSide })); flower.scale.setScalar(1.45); flower.castShadow = true; g.add(flower);
  const fStem = new THREE.Mesh(stemGeo, stemM); g.add(fStem);
  // 땅속줄기(뿌리줄기) + 뿌리
  const rh = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.16, 4, 10), mat(0x5a4330, { roughness: 0.95 })); rh.rotation.z = Math.PI / 2 + 0.2; rh.position.y = 0.01; g.add(rh);
  g.add(roots(9, 0.14, 0.14));
  const off = [[0.27, 0.08], [-0.25, 0.17], [0.05, -0.3], [-0.14, -0.1]], tmp = new THREE.Vector3();
  const orient = (m, x, y, z) => { tmp.set(x, y, z); m.scale.y = tmp.length(); m.position.copy(tmp).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(UP, tmp.normalize()); };
  g.userData.place = (depth) => {
    pads.forEach((p, i) => { p.position.set(off[i][0], depth + 0.006 + i * 0.002, off[i][1]); p.rotation.y = i * 1.3 + 0.4; });
    stems.forEach((s, i) => orient(s, off[i][0] * 0.92, depth, off[i][1] * 0.92));
    flower.position.set(0.03, depth + 0.012, 0.02); orient(fStem, 0.03, depth + 0.01, 0.02);
  };
  g.userData.place(0.8); g.userData.kind = 'lily'; return g;
}

// 검정말: 가는 줄기 마디마다 작은 잎이 돌려나고(3~5장), 물속에 잠겨서 산다. 원점 = 바닥.
export function hydrilla(h = 0.7) {
  const g = new THREE.Group(), r = rng(12), stemM = mat(0x55803f, { roughness: 0.6 }), leafM = mat(0x2f6f35, { roughness: 0.55, side: THREE.DoubleSide });
  const leafGeo = strap(0.055, (u) => 0.0075 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.95 + 0.05)), 0.6), 3, 1, (u) => 0.012 * u * u);
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), Q2 = new THREE.Quaternion(), S = new THREE.Vector3(), perp = new THREE.Vector3(), dir = new THREE.Vector3();
  const N = 5;
  for (let s = 0; s < N; s++) {
    const stem = new THREE.Group(), H = h * (0.7 + 0.35 * r()), bx = (r() - 0.5) * 0.25, bz = (r() - 0.5) * 0.2;
    const cur = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(bx * 0.15, H * 0.35, bz * 0.2), new THREE.Vector3(bx * 0.6, H * 0.7, bz * 0.5), new THREE.Vector3(bx, H, bz)]);
    stem.add(new THREE.Mesh(new THREE.TubeGeometry(cur, 14, 0.0055, 5), stemM));
    const nodes = 20, per = 4, li = new THREE.InstancedMesh(leafGeo, leafM, nodes * per);
    for (let k = 0; k < nodes; k++) {
      const t = 0.06 + 0.94 * Math.pow(k / (nodes - 1), 0.8), p = cur.getPointAt(Math.min(1, t)), tan = cur.getTangentAt(Math.min(1, t));
      perp.set(1, 0, 0).cross(tan).normalize(); if (perp.lengthSq() < 0.1) perp.set(0, 0, 1);
      const sc = 1 - 0.45 * t;
      for (let j = 0; j < per; j++) {
        dir.copy(perp).applyAxisAngle(tan, j / per * Math.PI * 2 + k * 0.8).multiplyScalar(Math.cos(0.75)).addScaledVector(tan, Math.sin(0.75)).normalize();
        Q.setFromUnitVectors(XAX, dir); Q2.setFromAxisAngle(XAX, r() * 3); Q.multiply(Q2); S.setScalar(sc);
        li.setMatrixAt(k * per + j, M4.compose(p, Q, S));
      }
    }
    li.castShadow = true; stem.add(li);
    const a = s / N * Math.PI * 2 + r(); stem.position.set(Math.cos(a) * 0.06, 0, Math.sin(a) * 0.05);
    stem.userData.rz = (s - (N - 1) / 2) * 0.1; stem.userData.rx = (r() - 0.5) * 0.2; stem.rotation.set(stem.userData.rx, 0, stem.userData.rz); stem.userData.stem = true; g.add(stem);
  }
  g.add(roots(7, 0.06, 0.1, 0xc9c2a0));
  g.userData.sway = (t) => g.children.forEach((c, i) => { if (!c.userData.stem) return; c.rotation.z = c.userData.rz + Math.sin(t * 1.2 + i) * 0.08; c.rotation.x = c.userData.rx + Math.sin(t * 0.9 + i * 2) * 0.04; });
  g.userData.kind = 'hydrilla'; return g;
}

// 부들: 물가 얕은 곳에 뿌리를 내리고 키가 크다. 길쭉한 리본 잎, 갈색 소시지 모양 이삭. 원점 = 바닥.
export function cattail(h = 1.6) {
  const g = new THREE.Group(), r = rng(15), leaves = [];
  for (let i = 0; i < 12; i++) {
    const L = h * (0.7 + 0.4 * r()), bend = 0.06 + r() * 0.24, w = 0.018 + r() * 0.008, tint = r();
    const lf = strap(L, (u) => w * Math.pow(1 - u, 0.55) * (0.75 + 0.25 * Math.min(1, u * 6)), 14, 2, (u, v) => -bend * u * u * L + 0.006 * Math.abs(v),
      (u, v, c) => c.set(0x86b25a).lerp(C(0x4a8a3c), Math.min(1, u * 2)).lerp(C(0x9aa35a), Math.max(0, u - 0.8) * 3 * tint));
    lf.rotateZ(Math.PI / 2); lf.rotateY(i / 12 * Math.PI * 2 + r() * 0.6); lf.translate((r() - 0.5) * 0.04, 0, (r() - 0.5) * 0.04); lf.deleteAttribute('uv'); leaves.push(lf);
  }
  const lg = merge(leaves); lg.computeVertexNormals();
  const lm = new THREE.Mesh(lg, vmat(0xffffff, { roughness: 0.6, side: THREE.DoubleSide })); lm.castShadow = true; g.add(lm);
  const stM = mat(0x6f8f3a, { roughness: 0.6 }), spM = mat(0x5a3520, { roughness: 1 }), maleM = mat(0xb39a68, { roughness: 0.9 });
  for (const [dx, dz, k] of [[0.01, 0, 1], [-0.04, 0.03, 0.9]]) {
    const H = h * k, top = new THREE.Vector3(dx * 3, H * 1.08, dz * 3);
    const st = rod(new THREE.Vector3(dx, 0, dz), top, 0.013, 0.008, stM); g.add(st);
    const dirv = top.clone().sub(new THREE.Vector3(dx, 0, dz)).normalize(), at = (y) => new THREE.Vector3(dx, 0, dz).addScaledVector(dirv, y);
    const spike = new THREE.Mesh(new THREE.CapsuleGeometry(0.042, 0.24, 6, 14), spM); spike.position.copy(at(H * 0.86)); spike.quaternion.setFromUnitVectors(UP, dirv); spike.castShadow = true; g.add(spike);
    const male = rod(at(H * 0.86 + 0.16), at(H * 0.86 + 0.3), 0.012, 0.007, maleM); g.add(male);
  }
  g.add(roots(10, 0.12, 0.12));
  g.userData.kind = 'cattail'; return g;
}

// 공기 방울(부레옥잠 잎자루를 물속에서 누를 때)
export function bubbles(n = 24) {
  const g = new THREE.Group(), m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.7 }), geo = new THREE.SphereGeometry(1, 12, 9);
  for (let i = 0; i < n; i++) { const b = new THREE.Mesh(geo, m); b.scale.setScalar(0.03 + (i % 4) * 0.01); b.userData.seed = [Math.sin(i * 12.9) * 0.14, i / n, Math.cos(i * 7.3) * 0.14]; b.visible = false; g.add(b); }
  // p: 0~1 진행, 원점에서 떠올라 SURF까지
  g.userData.play = (p, fromY) => g.children.forEach((b) => { const [x, d, z] = b.userData.seed; const q = p * 1.6 - d * 0.6; b.visible = q > 0 && q < 1; b.position.set(x + Math.sin(q * 9 + d * 20) * 0.02, fromY + (SURF - fromY) * Math.max(0, Math.min(1, q)), z); });
  return g;
}
