// 태양계 공용 키트 — 행성 자료(원본 이론 5-2-2 Ⅲ 23쪽 표: 지구=1 기준 반지름·거리)와 절차 생성 행성 겉모습.
// 그림 파일을 받아 오지 않고 잡음(fbm)으로 표면 무늬를 그린다 — 교재 도판 렌더와 3D 장면이 같은 행성을 쓴다.
import { THREE } from './_kit.js';

// r: 지구 반지름=1 · au: 태양~지구 거리=1 (원본 표 값 그대로)
export const PLANETS = [
  { id: 'mercury', ko: '수성', r: 0.4, au: 0.4, kind: '지구형' },
  { id: 'venus', ko: '금성', r: 0.9, au: 0.7, kind: '지구형' },
  { id: 'earth', ko: '지구', r: 1, au: 1.0, kind: '지구형' },
  { id: 'mars', ko: '화성', r: 0.5, au: 1.5, kind: '지구형' },
  { id: 'jupiter', ko: '목성', r: 11.2, au: 5.2, kind: '목성형' },
  { id: 'saturn', ko: '토성', r: 9.4, au: 9.5, kind: '목성형' },
  { id: 'uranus', ko: '천왕성', r: 4.0, au: 19.2, kind: '목성형' },
  { id: 'neptune', ko: '해왕성', r: 3.9, au: 30.1, kind: '목성형' },
];

// ── 잡음 ───────────────────────────────────────────────
function hash(x, y, s) { const h = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return h - Math.floor(h); }
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, s, oct = 5) { let f = 0, amp = 0.5, fr = 1; for (let i = 0; i < oct; i++) { f += amp * vnoise(x * fr, y * fr, s + i * 17); fr *= 2.03; amp *= 0.5; } return f; }
// 구면 위 점(경도·위도)에서 이음매 없는 잡음: 3D 좌표를 두 평면 잡음으로 섞는다
function sph(lon, lat, scale, s, oct) {
  const x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
  return (fbm((x + 2) * scale, (y + 2) * scale, s, oct) + fbm((z + 2) * scale, (y + 5) * scale, s + 3, oct) + fbm((x + 7) * scale, (z + 3) * scale, s + 9, oct)) / 3;
}
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * Math.max(0, Math.min(1, t)));
const hex = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255];

// 행성마다 색 정하는 규칙(lon, lat: 라디안 → [r,g,b])
const PAINT = {
  sun(lon, lat) { const n = sph(lon, lat, 5, 1, 5), g = sph(lon, lat, 28, 2, 3), sp = sph(lon, lat, 9, 3, 3); let col = mix(hex(0xf26a0c), hex(0xffd56a), n * 0.7 + g * 0.6); if (sp > 0.7) col = mix(col, hex(0xb3400a), (sp - 0.7) * 2.5); return col; },
  mercury(lon, lat) { const n = sph(lon, lat, 3, 11, 6), c = sph(lon, lat, 14, 12, 3); let col = mix(hex(0x6e6964), hex(0xb9b2aa), n); if (c > 0.62) col = mix(col, hex(0x4e4a46), (c - 0.62) * 4); return col; },
  venus(lon, lat) { const n = sph(lon * 1.0, lat * 2.2, 2.2, 21, 5); return mix(hex(0xc99a55), hex(0xf4e0b0), n * 1.1); },
  earth(lon, lat) {
    const land = sph(lon, lat, 2.1, 31, 6), cloud = sph(lon * 1.3, lat * 1.6, 3.5, 32, 5), ice = Math.abs(lat) > 1.2;
    let col = land > 0.53 ? mix(hex(0x5f8a3e), hex(0xa58a5a), (land - 0.53) * 4) : mix(hex(0x0d3f86), hex(0x2a76c4), land * 1.6);
    if (ice) col = hex(0xf2f6fa);
    if (cloud > 0.56) col = mix(col, hex(0xffffff), (cloud - 0.56) * 4.5);
    return col;
  },
  mars(lon, lat) { const n = sph(lon, lat, 2.6, 41, 6), d = sph(lon, lat, 1.6, 42, 4); let col = mix(hex(0x9b4a26), hex(0xd9824a), n); if (d < 0.42) col = mix(col, hex(0x5b2a17), (0.42 - d) * 3); if (Math.abs(lat) > 1.3) col = hex(0xf3ece4); return col; },
  jupiter(lon, lat) {
    const turb = sph(lon * 1.5, lat * 4, 5, 51, 5), w = sph(lon * 3, lat * 9, 7, 52, 4);
    const t = Math.sin(lat * 24 + turb * 3.2) * 0.5 + 0.5, t2 = Math.sin(lat * 9 + turb * 1.5) * 0.5 + 0.5;
    let col = mix(hex(0x9c6a45), hex(0xf3e6cb), t); col = mix(col, hex(0xd4a878), (1 - t2) * 0.45); col = mix(col, hex(0x7a4a32), Math.max(0, w - 0.58) * 2.2);
    if (Math.abs(lat) > 1.15) col = mix(col, hex(0x8f7f73), (Math.abs(lat) - 1.15) * 2.4);
    const dx = (lon - 4.1) * 3.2, dy = (lat + 0.38) * 8.5; const spot = Math.exp(-(dx * dx + dy * dy)); return mix(col, hex(0xb9482d), spot * 0.95);
  },
  saturn(lon, lat) { const tu = sph(lon, lat * 3, 3, 61, 4), t = Math.sin(lat * 16 + tu * 1.6) * 0.5 + 0.5; let col = mix(hex(0xbf9a5e), hex(0xf4e4be), t); if (Math.abs(lat) > 1.1) col = mix(col, hex(0x9d8a6a), (Math.abs(lat) - 1.1) * 2); return col; },
  uranus(lon, lat) { const t = Math.sin(lat * 6) * 0.08 + sph(lon, lat, 2, 71, 3) * 0.12; return mix(hex(0x8fd3dc), hex(0xc7eef0), 0.4 + t); },
  neptune(lon, lat) { const t = Math.sin(lat * 8 + sph(lon, lat, 3, 81, 3)) * 0.5 + 0.5, s = sph(lon, lat, 6, 82, 3); let col = mix(hex(0x2b4fb8), hex(0x4f7fe0), t * 0.6); if (s > 0.66) col = mix(col, hex(0xdfe9ff), (s - 0.66) * 3); return col; },
};
const _tex = new Map();
export function planetTexture(id, w = 512) {
  const key = `${id}|${w}`; if (_tex.has(key)) return _tex.get(key);
  const h = w / 2, c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), im = g.createImageData(w, h), f = PAINT[id];
  for (let y = 0; y < h; y++) { const lat = (0.5 - (y + 0.5) / h) * Math.PI; for (let x = 0; x < w; x++) { const lon = ((x + 0.5) / w) * Math.PI * 2; const [r, gg, b] = f(lon, lat), o = (y * w + x) * 4; im.data[o] = r; im.data[o + 1] = gg; im.data[o + 2] = b; im.data[o + 3] = 255; } }
  g.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; _tex.set(key, t); return t;
}
// 토성 고리: 가로 줄무늬(안쪽 → 바깥쪽) 텍스처
function ringTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 8; const g = c.getContext('2d');
  for (let x = 0; x < 512; x++) { const t = x / 511, gap = t > 0.62 && t < 0.67 ? 0.15 : 1, a = (0.35 + 0.55 * hash(x * 0.37, 1, 5)) * gap * (t < 0.06 ? t / 0.06 : 1);
    const col = mix(hex(0xb89d72), hex(0xeadbb8), hash(x * 0.11, 2, 7)); g.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${a})`; g.fillRect(x, 0, 1, 8); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// 행성 메시(반지름 r). 토성은 고리를 함께, 태양은 스스로 빛나는 재질
export function planetMesh(id, r, { seg = 64, texW = 512 } = {}) {
  const g = new THREE.Group();
  const m = id === 'sun' ? new THREE.MeshBasicMaterial({ map: planetTexture('sun', texW) }) : new THREE.MeshStandardMaterial({ map: planetTexture(id, texW), roughness: 0.9, metalness: 0 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg / 2), m); g.add(ball);
  if (id === 'saturn') {
    const geo = new THREE.RingGeometry(r * 1.25, r * 2.25, 128, 1), pos = geo.attributes.position, uv = geo.attributes.uv, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); uv.setXY(i, (v.length() - r * 1.25) / (r * 1.0), 0.5); }
    const ring = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: ringTexture(), transparent: true, side: THREE.DoubleSide, roughness: 0.9, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2 + 0.42; g.add(ring); g.userData.ring = ring;
  }
  if (id === 'uranus') ball.rotation.z = 1.7;      // 옆으로 누워 도는 천왕성
  g.userData.ball = ball; return g;
}
// 태양의 빛무리(겹친 반투명 원판 스프라이트)
export function sunGlow(r) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 30, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,214,120,0.9)'); gr.addColorStop(0.35, 'rgba(255,160,60,0.35)'); gr.addColorStop(1, 'rgba(255,120,30,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(r * 3.4); s.userData.noFrame = true; return s;
}
