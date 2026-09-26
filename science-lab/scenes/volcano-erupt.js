// 4-1 Ⅲ 땅의 변화 — 화산 분출. 땅속을 비춰 보면(반투명) 마그마 방과 통로가 보이고, 분출하면 용암 분수·화산재 기둥·
// 암석 조각이 나온다. 용암은 땅 위에서 빨리 식어 현무암, 땅속 마그마는 천천히 식어 화강암이 된다.
import { label, mat, THREE, clamp01, lerp, puffCloud } from './_kit.js';

const H = 2.4, R = 2.6, CR = 0.32, Y0 = 2.6;   // Y0: 땅 표면 높이(그 아래가 땅속 단면)                      // 산 높이·밑반지름·분화구 반지름
const hash = (i) => { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
const hash2 = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
function noise(x, z) { const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi, u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  return lerp(lerp(hash2(xi, zi), hash2(xi + 1, zi), u), lerp(hash2(xi, zi + 1), hash2(xi + 1, zi + 1), u), v); }
// 산 높이: 원뿔 + 울퉁불퉁 + 분화구 움푹
const hillY = (x, z) => { const d = Math.hypot(x, z); const cone = H * Math.max(0, 1 - d / R) ** 1.15; const crater = d < CR * 1.6 ? -0.35 * Math.max(0, 1 - d / (CR * 1.6)) : 0;
  return Math.max(0, cone + (noise(x * 1.7, z * 1.7) - 0.5) * 0.28 * Math.min(1, cone) + (noise(x * 6, z * 6) - 0.5) * 0.06 + crater); };

function terrain() {
  const S = 9, N = 140, geo = new THREE.PlaneGeometry(S, S, N, N); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, col = new Float32Array(pos.count * 3); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const rock = new THREE.Color(0x4a4038), rock2 = new THREE.Color(0x6e5a4a), red = new THREE.Color(0x7a3b2a), grass = new THREE.Color(0x6f8f4c), grass2 = new THREE.Color(0x8fa565), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), y = hillY(x, z); pos.setY(i, y);
    const n = noise(x * 3, z * 3), d = Math.hypot(x, z);
    c.copy(grass).lerp(grass2, n); c.lerp(rock.clone().lerp(rock2, n), clamp01((y - 0.15) / 0.6)); c.lerp(red, clamp01(1 - d / 0.9) * 0.6);
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, transparent: true, opacity: 1 }));
  m.castShadow = true; m.receiveShadow = false; m.userData.xray = (t) => { m.material.opacity = lerp(1, 0.18, t); m.material.depthWrite = t < 0.05; m.castShadow = t < 0.5; };
  return m;
}
// ── 캔버스 무늬(지층·마그마·암석) ──
const prng = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const _tex = new Map();
function canvasTex(key, size, draw, repeat = true) {
  if (_tex.has(key)) return _tex.get(key);
  const cv = document.createElement('canvas'); cv.width = cv.height = size; draw(cv.getContext('2d'), size, prng(key.length * 97 + key.charCodeAt(0)));
  const t = new THREE.CanvasTexture(cv); if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  _tex.set(key, t); return t;
}
function wrapDo(S, x, y, r, fn) { for (const ox of [0, -S, S]) for (const oy of [0, -S, S]) { const X = x + ox, Y = y + oy; if (X > -r && X < S + r && Y > -r && Y < S + r) fn(X, Y); } }
function specks(g, S, r, n, cols, r0, r1) { for (let i = 0; i < n; i++) { g.fillStyle = cols[(r() * cols.length) | 0]; const rr = r0 + r() * (r1 - r0); wrapDo(S, r() * S, r() * S, rr, (X, Y) => { g.beginPath(); g.arc(X, Y, rr, 0, 7); g.fill(); }); } }
function wavyLine(g, S, y, amp, f, ph) { g.beginPath(); for (let x = 0; x <= S; x += 4) g.lineTo(x, y + Math.sin((x / S) * Math.PI * 2 * f + ph) * amp); g.stroke(); }
// 알갱이 모양(각진 조각): 화강암의 큰 결정
function grains(g, S, r, n, cols, s0, s1) {
  for (let i = 0; i < n; i++) { const c = cols[(r() * cols.length) | 0], s = s0 + r() * (s1 - s0), k = 5 + ((r() * 3) | 0), a0 = r() * 7, pts = Array.from({ length: k }, (_, j) => [Math.cos(a0 + (j / k) * 6.283) * s * (0.6 + r() * 0.5), Math.sin(a0 + (j / k) * 6.283) * s * (0.6 + r() * 0.5)]);
    wrapDo(S, r() * S, r() * S, s * 1.2, (X, Y) => { g.fillStyle = c; g.beginPath(); pts.forEach(([u, v]) => g.lineTo(X + u, Y + v)); g.closePath(); g.fill(); g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 0.8; g.stroke(); }); }
}
const LAYER_TEX = {
  soil: (g, S, r) => { g.fillStyle = '#5e4130'; g.fillRect(0, 0, S, S); specks(g, S, r, 1400, ['#4a3224', '#735238', '#3c291d', '#86664a'], 0.6, 2.2);
    g.strokeStyle = 'rgba(190,160,120,0.45)'; g.lineWidth = 1; for (let i = 0; i < 14; i++) { g.beginPath(); let x = r() * S, y = r() * S; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 18; y += 6 + r() * 8; g.lineTo(x, y); } g.stroke(); }
    specks(g, S, r, 40, ['#8f8578', '#a39888', '#6d665f'], 2, 5); },
  sand: (g, S, r) => { g.fillStyle = '#c4945a'; g.fillRect(0, 0, S, S); for (let i = 0; i < 10; i++) { g.strokeStyle = `rgba(${r() < 0.5 ? '120,80,40' : '235,200,150'},0.35)`; g.lineWidth = 1 + r() * 2; wavyLine(g, S, (i / 10) * S + r() * 8, 2 + r() * 3, 1 + ((r() * 2) | 0), r() * 6); }
    specks(g, S, r, 2600, ['#a97b45', '#d8ad74', '#e6c79a', '#8c6337', '#f3dfbf'], 0.5, 1.4); },
  shale: (g, S, r) => { g.fillStyle = '#7a6b60'; g.fillRect(0, 0, S, S); for (let y = 0; y < S; y += 3 + r() * 5) { g.strokeStyle = r() < 0.5 ? 'rgba(90,78,70,0.7)' : 'rgba(150,136,124,0.55)'; g.lineWidth = 1 + r() * 2.5; wavyLine(g, S, y, 1 + r() * 1.5, 1, r() * 6); }
    specks(g, S, r, 500, ['#5f534a', '#958678'], 0.4, 1); },
  lime: (g, S, r) => { g.fillStyle = '#b9b2a2'; g.fillRect(0, 0, S, S); specks(g, S, r, 1500, ['#a8a090', '#cbc5b7', '#9c9484', '#d8d3c7'], 0.5, 1.6);
    g.strokeStyle = 'rgba(90,82,70,0.45)'; g.lineWidth = 1.2; for (let i = 0; i < 4; i++) wavyLine(g, S, (i / 4) * S + 20, 1.5, 1, i);
    for (let i = 0; i < 12; i++) { const x = r() * S, y = r() * S; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 6, y + 18 + r() * 20); g.stroke(); }
    g.strokeStyle = 'rgba(245,240,228,0.9)'; g.lineWidth = 1.4; for (let i = 0; i < 9; i++) { const x = r() * S, y = r() * S, R = 3 + r() * 5; g.beginPath(); for (let a = 0; a < 12; a += 0.3) g.lineTo(x + Math.cos(a) * R * a / 12, y + Math.sin(a) * R * a / 12); g.stroke(); } },
  rock: (g, S, r) => { g.fillStyle = '#4b4748'; g.fillRect(0, 0, S, S); specks(g, S, r, 2200, ['#3a3637', '#5e595a', '#6f6a69', '#2d2a2b', '#7b7470'], 0.6, 2);
    g.strokeStyle = 'rgba(25,22,22,0.7)'; g.lineWidth = 1.3; for (let i = 0; i < 7; i++) { g.beginPath(); let x = r() * S, y = r() * S; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (r() - 0.5) * 40; y += (r() - 0.5) * 40; g.lineTo(x, y); } g.stroke(); } },
};
const layerTex = (kind) => canvasTex('layer-' + kind, 256, LAYER_TEX[kind]);
const granTex = () => canvasTex('granite', 256, (g, S, r) => { g.fillStyle = '#cfc6ba'; g.fillRect(0, 0, S, S); grains(g, S, r, 150, ['#efe7dc', '#e7b8a4', '#d9a28a', '#b7b1aa', '#f6f1ea'], 7, 15); grains(g, S, r, 70, ['#242222', '#3b3634'], 3, 7); });
const basaltTex = () => canvasTex('basalt', 256, (g, S, r) => { g.fillStyle = '#3a393b'; g.fillRect(0, 0, S, S); specks(g, S, r, 5000, ['#2c2b2d', '#4a494b', '#555356', '#232224'], 0.4, 1.1);
  for (let i = 0; i < 45; i++) { const x = r() * S, y = r() * S, rx = 2 + r() * 6, ry = rx * (0.6 + r() * 0.4); wrapDo(S, x, y, rx + 2, (X, Y) => { g.fillStyle = 'rgba(120,118,118,0.55)'; g.beginPath(); g.ellipse(X + 0.8, Y + 0.8, rx + 1, ry + 1, 0, 0, 7); g.fill(); g.fillStyle = '#0e0e0f'; g.beginPath(); g.ellipse(X, Y, rx, ry, 0, 0, 7); g.fill(); }); } });
// 마그마 단면: 가운데가 노랗게 가장 뜨겁고 가장자리로 갈수록 붉고 어두워진다 + 흐르는 줄무늬·기포
const magmaTex = () => canvasTex('magma', 256, (g, S, r) => {
  const gr = g.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2); gr.addColorStop(0, '#fff3b0'); gr.addColorStop(0.35, '#ffb52e'); gr.addColorStop(0.72, '#f0521a'); gr.addColorStop(1, '#8a1d0c');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  g.lineWidth = 3; for (let i = 0; i < 16; i++) { g.strokeStyle = r() < 0.5 ? 'rgba(140,30,10,0.35)' : 'rgba(255,240,170,0.35)'; g.beginPath(); const R = 20 + r() * 100, a0 = r() * 7; for (let a = 0; a < 1.6; a += 0.1) g.lineTo(S / 2 + Math.cos(a0 + a) * R * (1 + 0.1 * Math.sin(a * 5)), S / 2 + Math.sin(a0 + a) * R * 0.9); g.stroke(); }
  for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(255,250,210,0.55)'; g.beginPath(); g.arc(r() * S, r() * S, 1 + r() * 3, 0, 7); g.fill(); }
}, false);
const flowTex = () => canvasTex('magma-flow', 128, (g, S, r) => { const gr = g.createLinearGradient(0, 0, S, 0); gr.addColorStop(0, '#b3260e'); gr.addColorStop(0.5, '#ffc04a'); gr.addColorStop(1, '#b3260e'); g.fillStyle = gr; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 18; i++) { g.strokeStyle = r() < 0.5 ? 'rgba(150,35,10,0.45)' : 'rgba(255,245,190,0.5)'; g.lineWidth = 1 + r() * 2; g.beginPath(); const x = r() * S; for (let y = -4; y <= S + 4; y += 8) g.lineTo(x + Math.sin(y * 0.1 + i) * 4, y); g.stroke(); } });

// ── 땅속: 위가 울퉁불퉁한 지층 5겹 ──
// 뒤쪽 절반(z≤0)은 늘 불투명 — 가운데 절단면에 층·마그마 방·통로가 보인다.
// 앞쪽 절반(z≥0)도 같은 층으로 채워, 평소엔 땅덩어리 옆면으로 보이다가 땅속을 비출 때(xray) 유리처럼 옅어진다.
const STRATA = [{ kind: 'soil', base: 2.28 }, { kind: 'sand', base: 1.74 }, { kind: 'shale', base: 1.2 }, { kind: 'lime', base: 0.62 }, { kind: 'rock', base: 0 }];
const dome = (x, z) => Math.exp(-(x * x + z * z) / (2 * 1.7 * 1.7));    // 마그마 방 위로 지층이 살짝 부풀어 오름
function ifaceY(i, x, z) {            // i번째 층의 바닥 높이(= i+1번째 층의 윗면)
  if (i < 0) return Y0 - 0.025; if (i >= STRATA.length - 1) return 0;   // 맨 위층은 땅 표면(지형 메시) 바로 아래 — 겹쳐 깜빡이지 않게
  const y = STRATA[i].base + 0.08 * Math.sin(x * 0.75 + i * 1.3) + 0.05 * Math.sin(x * 1.9 + z * 0.8 + i) + (noise(x * 1.2 + i * 7, z * 1.2) - 0.5) * 0.1 + dome(x, z) * (i ? 0.2 : 0.1);
  return Math.min(y, ifaceY(i - 1, x, z) - 0.14);
}
const SX = 4.5, SZ = 4.5;
function slab(i, zA, zB, faces) {
  const pos = [], uv = [], idx = [], NXs = 72, NZs = 20, U = 1 / 1.6;
  const top = (x, z) => ifaceY(i - 1, x, z), bot = (x, z) => ifaceY(i, x, z);
  const grid = (nu, nv, f) => { const o = pos.length / 3; for (let v = 0; v <= nv; v++) for (let u = 0; u <= nu; u++) { const [x, y, z, s, t] = f(u / nu, v / nv); pos.push(x, y, z); uv.push(s, t); }
    for (let v = 0; v < nv; v++) for (let u = 0; u < nu; u++) { const a = o + v * (nu + 1) + u, b = a + 1, c = a + nu + 1, d = c + 1; idx.push(a, b, c, b, d, c); } };
  const X = (s) => -SX + s * 2 * SX, Zs = (s) => zA + s * (zB - zA);
  grid(NXs, NZs, (s, t) => { const x = X(s), z = Zs(1 - t); return [x, top(x, z), z, x * U, z * U]; });                                    // 윗면
  const side = (n, pt, flip) => grid(n, 1, (s, t) => { const [x, z] = pt(flip ? 1 - s : s), y = t ? top(x, z) : bot(x, z); return [x, y, z, (x + z) * U, y * U]; });
  if (faces.front) side(NXs, (s) => [X(s), zB], false);
  if (faces.back) side(NXs, (s) => [X(s), zA], true);
  side(NZs, (s) => [SX, Zs(1 - s)], false); side(NZs, (s) => [-SX, Zs(s)], false);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}
// 울퉁불퉁한 타원(마그마 방 단면)
function blobShape(rx, ry, k = 1) { const s = new THREE.Shape(); for (let j = 0; j <= 64; j++) { const a = (j / 64) * Math.PI * 2, r = k * (1 + 0.07 * Math.sin(3 * a + 0.5) + 0.045 * Math.sin(7 * a + 1.3)); const x = Math.cos(a) * rx * r, y = Math.sin(a) * ry * r; j ? s.lineTo(x, y) : s.moveTo(x, y); } return s; }
function planarUV(geo, w, h) { const p = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5); return geo; }
function underground() {
  const g = new THREE.Group(), ghost = [];
  STRATA.forEach((L, i) => {
    const map = layerTex(L.kind);
    const back = new THREE.Mesh(slab(i, -SZ, 0, { front: true, back: true }), new THREE.MeshStandardMaterial({ map, bumpMap: map, bumpScale: 2.2, roughness: 0.95 }));
    back.receiveShadow = true; back.castShadow = true; g.add(back);
    const fm = new THREE.MeshStandardMaterial({ map, bumpMap: map, bumpScale: 2.2, roughness: 0.95, transparent: true, opacity: 1 }); ghost.push(fm);
    const front = new THREE.Mesh(slab(i, 0, SZ, { front: true }), fm); front.receiveShadow = true; front.renderOrder = 1; g.add(front);
  });
  // 마그마 방: 절단면(z=0)에 드러난 단면 + 둘레의 구워진 암석 띠
  const CY = 0.95, RX = 1.9, RY = 0.85;
  const ch = new THREE.Mesh(planarUV(new THREE.ShapeGeometry(blobShape(RX, RY), 48), RX * 2.2, RY * 2.2), new THREE.MeshStandardMaterial({ map: magmaTex(), emissive: 0xffffff, emissiveMap: magmaTex(), emissiveIntensity: 1, roughness: 0.5 }));
  ch.position.set(0, CY, 0.014);
  const rim = new THREE.Mesh(new THREE.ShapeGeometry(blobShape(RX, RY, 1.07), 48), new THREE.MeshStandardMaterial({ color: 0x3a1c12, roughness: 0.9 })); rim.position.z = -0.004; ch.add(rim);
  g.add(ch);
  // 통로: 절단면 위의 띠(방 → 땅 표면) + 땅 위로는 산 속을 지나 분화구 바닥까지 원기둥
  const pm = new THREE.MeshStandardMaterial({ color: 0xff7a30, map: flowTex(), emissive: 0xffffff, emissiveMap: flowTex(), emissiveIntensity: 0.9, roughness: 0.5 });
  const ps = new THREE.Shape(), NY = 24, y0 = CY + RY * 0.6, y1 = Y0 + 0.02, wig = (y) => 0.05 * Math.sin(y * 2.4 + 0.6);
  for (let j = 0; j <= NY; j++) { const y = lerp(y0, y1, j / NY), w = lerp(0.2, 0.15, j / NY); j ? ps.lineTo(wig(y) + w, y) : ps.moveTo(wig(y) + w, y); }
  for (let j = NY; j >= 0; j--) { const y = lerp(y0, y1, j / NY), w = lerp(0.2, 0.15, j / NY); ps.lineTo(wig(y) - w, y); }
  const pg = new THREE.ShapeGeometry(ps); { const p = pg.attributes.position, uv = pg.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 0.4 + 0.5, p.getY(i) / 1.2); }
  const pipe = new THREE.Mesh(pg, pm); pipe.position.z = 0.016;
  const craterY = Y0 + hillY(0, 0), upLen = craterY - Y0 + 0.02;
  const up = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, upLen, 20, 1, true), pm); up.position.set(wig(Y0), Y0 + upLen / 2 - 0.02, -0.016); pipe.add(up);
  g.add(pipe);
  // 식어서 굳은 화강암 단면(같은 자리)
  const gran = new THREE.Mesh(planarUV(new THREE.ShapeGeometry(blobShape(RX, RY), 48), 1.6, 1.6), new THREE.MeshStandardMaterial({ map: granTex(), bumpMap: granTex(), bumpScale: 1.5, roughness: 0.7 }));
  gran.position.set(0, CY, 0.015); gran.visible = false; g.add(gran);
  g.userData = { ch, pipe, gran, xray: (t) => {
    const o = lerp(1, 0.1, t); ghost.forEach((m) => { m.opacity = o; m.depthWrite = t < 0.5; });
    [ch, pipe, gran].forEach((x) => { x.traverse((n) => { if (n.material) { n.material.transparent = true; n.material.opacity = 0.15 + 0.85 * t; } }); });
  } };
  return g;
}
// 화산재 기둥: 인스턴스 구름. 시간에 따라 계속 솟고 위에서 우산처럼 퍼진다
function ashColumn(n = 620) {
  const m = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshStandardMaterial({ color: 0x8c8c8c, roughness: 1, transparent: true, opacity: 0.92 }), n); m.frustumCulled = false;
  m.count = 0; m.userData.seed = Array.from({ length: n }, (_, i) => ({ t0: hash(i) * 6, a: hash(i + n) * Math.PI * 2, r: hash(i + 2 * n), s: 0.6 + hash(i + 3 * n) * 0.9 }));
  m.userData.color = new THREE.Color(); m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3);
  return m;
}
function setAsh(m, t, strength) {   // strength 0..1 (분출 세기), t 시간
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(), dark = new THREE.Color(0x4d4a48), light = new THREE.Color(0xd6d3cf);
  let k = 0; const c = m.userData.color;
  for (const s of m.userData.seed) {
    const life = ((t * 0.55 + s.t0) % 6) / 6; if (life > strength * 0.999) continue;
    const y = H - 0.2 + life * 6.0, spread = 0.3 + life * life * 3.0 + (life > 0.6 ? (life - 0.6) * 5 : 0);
    const wob = Math.sin(t * 1.3 + s.a * 3) * 0.25;
    v.set(Math.cos(s.a) * spread * s.r + wob, y, Math.sin(s.a) * spread * s.r + wob * 0.6); sc.setScalar((0.8 + life * 2.6) * s.s);
    M.compose(v, q, sc); m.setMatrixAt(k, M); c.copy(dark).lerp(light, clamp01(life * 1.3 + s.r * 0.3)); m.setColorAt(k, c); k++;
  }
  m.count = k; m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
}
// 용암 분수 + 암석 조각: 포물선으로 튀어 올랐다 떨어진다
function fountain(n, r, color, opts) {
  const m = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 7, 6), mat(color, opts), n); m.frustumCulled = false; m.count = 0;
  m.userData.seed = Array.from({ length: n }, (_, i) => ({ t0: hash(i * 3) * 2.2, a: hash(i * 3 + 1) * Math.PI * 2, vy: 4.5 + hash(i * 3 + 2) * 4, vh: 0.4 + hash(i * 7) * 1.6, s: 0.6 + hash(i * 11) }));
  return m;
}
function setFountain(m, t, strength, period = 2.2) {
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(); let k = 0;
  for (const s of m.userData.seed) {
    const tt = (t + s.t0) % period; if (s.t0 / 2.2 > strength) continue;
    const x = Math.cos(s.a) * s.vh * tt, z = Math.sin(s.a) * s.vh * tt, y = H - 0.15 + s.vy * tt - 4.9 * tt * tt;
    const gy = hillY(x, z); if (y < gy) continue;
    v.set(x, y, z); sc.setScalar(s.s); M.compose(v, q, sc); m.setMatrixAt(k++, M);
  }
  m.count = k; m.instanceMatrix.needsUpdate = true;
}
// 용암류: 산비탈을 따라 흘러내리는 세 줄기. 단면이 볼록한 띠(두께가 있는 흐름)이고, 겉은 식은 검은 껍질 조각,
// 그 사이 갈라진 틈으로 속의 뜨거운 용암이 빛난다(발광 무늬). 무늬가 아래로 흘러가고 빛이 가물거린다. 식으면(k→1) 빛이 꺼진다.
let _lavaTex = null;
function lavaTextures() {
  if (_lavaTex) return _lavaTex;
  const S = 192, mk = (draw) => { const c = document.createElement('canvas'); c.width = c.height = S; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  // 껍질 조각 중심(보로노이 비슷하게): 가까운 두 점 거리 차가 작으면 틈
  const pts = Array.from({ length: 34 }, (_, i) => [hash(i * 2 + 1) * S, hash(i * 2 + 2) * S]);
  const crack = new Float32Array(S * S);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    let d1 = 1e9, d2 = 1e9; for (const [px, py] of pts) for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) { const d = Math.hypot(x - px - ox, y - py - oy); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
    crack[y * S + x] = Math.max(0, 1 - (d2 - d1) / 5.5);
  }
  const paint = (fn) => (g) => { const im = g.createImageData(S, S); for (let i = 0; i < S * S; i++) { const [r, gg, b] = fn(crack[i], hash2(i % S, (i / S) | 0)); im.data.set([r, gg, b, 255], i * 4); } g.putImageData(im, 0, 0); };
  _lavaTex = {
    map: mk(paint((c, n) => { const k = c * c; return [58 + 70 * k + n * 22, 48 + 22 * k + n * 18, 44 + 8 * k + n * 16]; })),          // 검은 껍질 + 틈은 짙은 적갈색(빛은 발광 무늬가 낸다)
    glow: mk(paint((c, n) => { const k = Math.pow(c, 1.6); return [255 * Math.min(1, k * 1.2 + 0.05), 150 * k + 20 * k * n, 40 * k]; })),   // 틈만 빛난다
  };
  return _lavaTex;
}
function lavaFlows() {
  const g = new THREE.Group(), N = 60, C = 6, W = 0.3, tex = lavaTextures(), hot = new THREE.Color(1, 0.92, 0.8), cool = new THREE.Color(0.34, 0.32, 0.31), c = new THREE.Color();
  const dirs = [[1, 0.35], [-0.7, 0.75], [0.2, -1]];
  const matL = new THREE.MeshStandardMaterial({ map: tex.map, emissiveMap: tex.glow, emissive: 0xffffff, emissiveIntensity: 1.6, roughness: 0.62, metalness: 0, vertexColors: true });
  const meshes = dirs.map(([dx, dz], j) => {
    const geo = new THREE.BufferGeometry(), nv = N * (C + 1), pos = new Float32Array(nv * 3), col = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), idx = [];
    for (let i = 0; i < N - 1; i++) for (let k = 0; k < C; k++) { const q = i * (C + 1) + k; idx.push(q, q + C + 1, q + 1, q + 1, q + C + 1, q + C + 2); }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx);
    const m = new THREE.Mesh(geo, matL); m.castShadow = true; m.receiveShadow = true;
    const L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L, len = 2.9 + j * 0.4;
    let lastP = -1, lastK = -1;
    m.userData.set = (p, k) => {
      m.visible = p > 0.01; if (!m.visible || (Math.abs(p - lastP) < 1e-4 && Math.abs(k - lastK) < 1e-4)) return; lastP = p; lastK = k;
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1), d = CR * 0.8 + t * len * p, w = W * (0.7 + 0.5 * Math.sin(t * 7 + j)) * (0.6 + p * 0.4) * (1 - 0.25 * Math.pow(t, 3));
        const wig = Math.sin(t * 5 + j * 2) * 0.18 * t, hgt = 0.1 * (1 - 0.45 * t) * (0.5 + 0.5 * p);
        for (let q = 0; q <= C; q++) {
          const th = (q / C) * Math.PI, side = Math.cos(th), x = ux * d - uz * (side * w + wig), z = uz * d + ux * (side * w + wig), o = i * (C + 1) + q;
          pos.set([x, hillY(x, z) + 0.035 + Math.sin(th) * hgt, z], o * 3);
          const heat = (1 - Math.min(1, t * 1.3)) * (1 - k); c.copy(cool).lerp(hot, 0.35 + 0.65 * heat); col.set([c.r, c.g, c.b], o * 3);
          uv.set([q / C * 1.1 + j * 0.3, t * len * 1.7], o * 2);
        }
      }
      geo.attributes.position.needsUpdate = geo.attributes.color.needsUpdate = geo.attributes.uv.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere();
    };
    m.userData.set(0, 0); g.add(m); return m;
  });
  g.userData.set = (p, k, t = 0) => {
    meshes.forEach((m) => m.userData.set(p, k));
    tex.glow.offset.y = tex.map.offset.y = -t * 0.12;                                       // 무늬가 비탈 아래로 흘러간다
    matL.emissiveIntensity = (1 - k) * (1.5 + 0.25 * Math.sin(t * 7.3) + 0.15 * Math.sin(t * 13.1));   // 가물거리는 빛
    matL.roughness = 0.62 + 0.25 * k;
  };
  return g;
}
// 암석 표본: 잘라 닦은 윗면이 보이는 울퉁불퉁한 돌덩이(현무암 = 어둡고 알갱이 작고 구멍 / 화강암 = 밝고 알갱이 큼)
function rock(kind) {
  const g = new THREE.Group(), dark = kind === 'basalt', tex = dark ? basaltTex() : granTex();
  const geo = new THREE.SphereGeometry(1, 48, 28), p = geo.attributes.position, uv = geo.attributes.uv, ph = dark ? 1.7 : 4.1;
  for (let i = 0; i < p.count; i++) {
    const X = p.getX(i), Y = p.getY(i), Z = p.getZ(i), f = 1 + 0.1 * Math.sin(X * 3.1 + ph) * Math.sin(Z * 2.3 + ph * 2) + 0.06 * Math.sin(Y * 5 + X * 2 + ph) + 0.03 * Math.sin(Z * 9 + ph);
    let x = X * f * 0.62, y = Y * f * 0.3, z = Z * f * 0.44;
    if (y > 0.13) y = 0.13 + (y - 0.13) * 0.06;                      // 윗면은 잘라서 평평
    p.setXYZ(i, x, y, z); uv.setXY(i, x / 1.1 + 0.5, z / 1.1 + 0.5);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: dark ? 3 : 1.4, roughness: dark ? 0.88 : 0.55 }));
  m.castShadow = true; m.receiveShadow = true; g.add(m);
  return g;
}

const ST = { xray: 0, erupt: 0, cool: 0, t: 0 };

export default {
  view: { theta: 0.5, phi: 1.15, dist: 12.5, target: [0, Y0 + 1.2, 0] },
  build(kit, world) {
    const ter = terrain(); world.add('terrain', ter);
    const ug = underground(); world.add('under', ug);
    const ash = ashColumn(); world.add('ash', ash);
    const fire = fountain(120, 0.075, 0xffb347, { emissive: 0xff5a00, emissiveIntensity: 1.4 }); world.add('fire', fire);
    const bombs = fountain(26, 0.13, 0x4a3f38, { roughness: 1 }); world.add('bombs', bombs);
    const flows = lavaFlows(); world.add('flows', flows);
    const glow = new THREE.PointLight(0xff6a00, 0, 9, 2); glow.position.set(0, H + 0.6, 0); world.add('glow', glow);
    const halo = puffCloud(3, { color: 0xff7a2a, opacity: 0.9, additive: true, soft: 1 }); glow.add(halo);   // 분화구 위 빛무리(분출할 때만)
    const lbM = label('땅속 마그마 방', { size: 0.48, color: '#7f1d0f', bg: 'rgba(255,238,218,0.96)' }); lbM.position.set(0, 1.05, 2.7); world.add('lbM', lbM);
    const lbQ = label('화산에서는 무엇이 나올까?', { size: 0.48, color: '#1E3A78' }); lbQ.position.set(0, H + 1.2, 0); world.add('lbQ', lbQ);
    const lbG = label('화산 가스 — 기체', { size: 0.46, color: '#1E3A78', bg: 'rgba(230,240,255,0.96)' }); lbG.position.set(-3.2, H + 4.2, 0); world.add('lbG', lbG);
    const lbA = label('화산재·암석 조각 — 고체', { size: 0.46, bg: 'rgba(245,245,245,0.97)' }); lbA.position.set(3.3, H + 2.6, 0); world.add('lbA', lbA);
    const lbL = label('용암 — 액체', { size: 0.46, color: '#8b1e1e', bg: 'rgba(255,225,200,0.97)' }); lbL.position.set(2.9, 1.1, 1.6); world.add('lbL', lbL);
    const bas = rock('basalt'); bas.position.set(3.6, 0.3, 2.6); world.add('basalt', bas);
    const lbB = label('땅 위에서 빨리 식음 → 현무암 (알갱이 작음)', { size: 0.4 }); lbB.position.set(3.6, 1.25, 2.6); world.add('lbB', lbB);
    const gra = rock('granite'); gra.position.set(-3.6, 0.3, 2.6); world.add('granite', gra);
    const lbGr = label('땅속에서 천천히 식음 → 화강암 (알갱이 큼)', { size: 0.4 }); lbGr.position.set(-3.6, 1.25, 2.6); world.add('lbGr', lbGr);
    // 지표와 분출물은 Y0 위, 마그마 방과 지층은 Y0 아래에 둔다.
    for (const o of [ter, ash, fire, bombs, flows, glow, lbQ, lbG, lbA, lbL, bas, lbB, gra, lbGr]) o.position.y += Y0;
    const st = ST; Object.assign(st, { xray: 0, erupt: 0, cool: 0, t: 0 });
    return { update(dt, t) {
      st.t = t; ter.userData.xray(st.xray); ug.userData.xray(st.xray);
      ug.userData.ch.material.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.25; const solid = ug.userData.gran.visible, pm = ug.userData.pipe.material; pm.emissiveIntensity = solid ? 0.06 : 0.7 + Math.sin(t * 6) * 0.25; pm.color.set(solid ? 0x9a8f86 : 0xff7a30);   // 화강암이 되면 통로도 식어 굳음
      const e = st.erupt * (1 - st.cool);
      setAsh(ash, t, e); setFountain(fire, t, e); setFountain(bombs, t * 0.8, e, 2.6);
      glow.intensity = e * (26 + Math.sin(t * 9) * 8) + (st.erupt > 0 ? 3 * (1 - st.cool) : 0);
      flows.userData.set(Math.min(1, st.erupt * 1.15), st.cool, t);
      const hg = e * (0.85 + 0.15 * Math.sin(t * 9) + 0.08 * Math.sin(t * 23));
      halo.userData.set(0, 0, -0.35, 0, 2.4 * hg, 0.55 * hg); halo.userData.set(1, 0, 0.3, 0, 4.2 * hg, 0.2 * hg); halo.userData.set(2, 0, -0.5, 0, 1.1 * hg, 0.8 * hg); halo.userData.commit(e > 0.01 ? 3 : 0);
    } };
  },
  beats: [
    { text: '산처럼 보이지만, 땅속을 비춰 보면 뜨거운 마그마가 모여 있는 방과 통로가 있어요.', show: ['terrain', 'under', 'lbM', 'lbQ'], dur: 5,
      reset(o) { Object.assign(ST, { xray: 1, erupt: 0, cool: 0 }); o.under.userData.gran.visible = false; o.under.userData.ch.visible = true; o.under.userData.pipe.visible = true; },
      anim(p, o, t) { ST.xray = 1; } },
    { text: '마그마가 통로를 타고 솟구쳐요. 화산이 분출해요! 용암이 분수처럼 튀고 화산재가 하늘로 치솟아요.', show: ['ash', 'fire', 'bombs', 'flows', 'glow'], hide: ['lbQ', 'lbM'], dur: 7,
      anim(p, o, t) { ST.xray = 1 - Math.min(1, p * 4); ST.erupt = p; } },
    { text: '나오는 것은 세 가지예요. 기체인 화산 가스, 액체인 용암, 고체인 화산재와 암석 조각.', show: ['lbG', 'lbL', 'lbA'], dur: 7,
      anim(p, o, t) { ST.erupt = 1; } },
    { text: '흘러나온 용암은 땅 위에서 빨리 식어 알갱이가 작고 어두운 현무암이 돼요. 구멍은 가스가 빠져나간 자리예요.', show: ['basalt', 'lbB'], hide: ['lbG', 'lbA', 'lbL'], dur: 7,
      anim(p, o, t) { ST.cool = p; } },
    { text: '땅속에 남은 마그마는 아주 천천히 식어 알갱이가 큰 화강암이 돼요.', show: ['granite', 'lbGr'], hide: ['basalt', 'lbB'], dur: 7,
      anim(p, o, t) { ST.cool = 1; ST.xray = Math.min(1, p * 3); const g = p > 0.5; o.under.userData.gran.visible = g; o.under.userData.ch.visible = !g; } },
  ],
};
