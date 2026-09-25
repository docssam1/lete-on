// 4-1 Ⅲ 땅의 변화 — 흙 언덕 물길: 위쪽은 깎이고(침식) 흙이 옮겨져(운반) 아래쪽에 쌓인다(퇴적)
// 언덕은 높이 함수로 만든 지형(정점 색 = 흙·젖은 흙·색 모래). 물길이 실제로 파이고, 아래쪽에 부채꼴로 쌓인다.
import { PALETTE as P, label, arrow, THREE, mat, lerp, roundedBoxGeometry } from './_kit.js';

const BASE = 0.2, HH = 1.5, SIG = 0.72;                    // 쟁반 윗면 높이, 언덕 높이, 언덕 폭
const X0 = -1.7, X1 = 3.0, Z0 = -1.45, Z1 = 1.45, NX = 110, NZ = 70;
const FAN = { x: 2.05, sx: 0.45, sz: 0.55, h: 0.3 };
const C = { dry: new THREE.Color(0xc9a06a), dark: new THREE.Color(0x9a7246), wet: new THREE.Color(0x6e4f31), sand: new THREE.Color(0x2ec4b6) };

// 값 노이즈(결정적) — 흙 표면의 울퉁불퉁함
const hash = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
function noise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi, u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  return lerp(lerp(hash(xi, zi), hash(xi + 1, zi), u), lerp(hash(xi, zi + 1), hash(xi + 1, zi + 1), u), v);
}
const rough = (x, z) => (noise(x * 3.1, z * 3.1) - 0.5) * 0.07 + (noise(x * 9, z * 9) - 0.5) * 0.025;
const zc = (x) => 0.13 * Math.sin(x * 2.3);                  // 물길 가운데선(살짝 굽이침)
const mound = (x, z) => HH * Math.exp(-(x * x + z * z) / (2 * SIG * SIG));
// 물길 깊이: 꼭대기~중턱에서 깊고 아래로 갈수록 얕아진다
const gully = (x, z, e) => { if (x < -0.05) return 0; const w = Math.exp(-((x - 0.55) ** 2) / (2 * 0.45 ** 2)); return e * 0.26 * w * Math.exp(-((z - zc(x)) ** 2) / (2 * 0.11 ** 2)); };
const fan = (x, z, d) => d * FAN.h * Math.exp(-(((x - FAN.x) / FAN.sx) ** 2 + ((z - zc(x)) / FAN.sz) ** 2) / 2);
const height = (x, z, e, d) => Math.max(0.04, mound(x, z) + rough(x, z) * (mound(x, z) > 0.05 ? 1 : 0.2) - gully(x, z, e) + fan(x, z, d));

// ── 유수대 재료: 쟁반·흙 질감·물컵·자갈 (체험 실험실 lab-hill3d.js도 같은 것을 가져다 쓴다) ──
// 쟁반은 x=-1.85~3.15(가운데 0.65), z=±1.6. 원점 = 쟁반 안쪽 바닥 윗면.
export const TRAY = { W: 5.0, D: 3.2, cx: 0.65, wall: 0.07, rim: 0.22, floor: 0.09 };
const prng = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const _tex = new Map();
function canvasTex(key, size, draw) {
  if (_tex.has(key)) return _tex.get(key);
  const cv = document.createElement('canvas'); cv.width = cv.height = size; draw(cv.getContext('2d'), size);
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  _tex.set(key, t); return t;
}
// 가장자리를 넘는 점은 반대편에도 찍어 무늬가 이음매 없이 반복되게 한다.
function wrapDot(g, x, y, r, S) {
  for (const ox of [0, -S, S]) for (const oy of [0, -S, S]) {
    const X = x + ox, Y = y + oy; if (X < -r || X > S + r || Y < -r || Y > S + r) continue;
    g.beginPath(); g.arc(X, Y, r, 0, Math.PI * 2); g.fill();
  }
}
// 모래 알갱이: 밝은 바탕에 크기·밝기가 다른 알갱이(곱해지므로 흙 색은 정점 색이 정한다)
export function grainTexture() {
  const t = canvasTex('sand-grain', 512, (g, S) => {
    const r = prng(11); g.fillStyle = '#efe9e0'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 16000; i++) { const v = 188 + r() * 67, w = r() * 18; g.fillStyle = `rgb(${v | 0},${(v - w * 0.5) | 0},${(v - w) | 0})`; wrapDot(g, r() * S, r() * S, 0.7 + r() * 1.5, S); }
    for (let i = 0; i < 800; i++) { g.fillStyle = `rgba(78,58,40,${0.2 + r() * 0.3})`; wrapDot(g, r() * S, r() * S, 0.8 + r() * 1.7, S); }
    for (let i = 0; i < 900; i++) { g.fillStyle = 'rgba(255,255,255,0.75)'; wrapDot(g, r() * S, r() * S, 0.5 + r() * 0.9, S); }
  });
  t.repeat.set(2.6, 1.6); return t;
}
// 색 모래: 여러 색 알갱이(투명 바탕) — 흙 재질이 모래 양(sand 속성)만큼 겹쳐 그린다.
function confettiTexture() {
  return canvasTex('sand-confetti', 512, (g, S) => {
    const r = prng(23), cols = ['#ff5d8f', '#ffd23f', '#3a8dff', '#19b3a3', '#9b5de5', '#ff8c42', '#ffffff'];
    for (let i = 0; i < 3400; i++) { g.fillStyle = cols[i % cols.length]; wrapDot(g, r() * S, r() * S, 2.1 + r() * 2.1, S); }
  });
}
// 흙 재질: 정점 색(마른 흙·젖은 흙) × 알갱이 무늬 + 알갱이 요철 + 'sand' 속성만큼 색 모래 점
export function soilMaterial() {
  const grain = grainTexture();
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0, map: grain, bumpMap: grain, bumpScale: 1.4 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.confMap = { value: confettiTexture() };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float sand;\nvarying float vSand;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSand = sand;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vSand;\nuniform sampler2D confMap;')
      .replace('#include <map_fragment>', '#include <map_fragment>\n{ vec4 cf = texture2D(confMap, vMapUv * 0.45); float k = smoothstep(0.05, 0.35, vSand); diffuseColor.rgb = mix(diffuseColor.rgb, cf.rgb, cf.a * k * 0.95); }');
  };
  m.customProgramCacheKey = () => 'gf-soil-confetti';
  return m;
}
function rrPath(p, w, d, r) {
  const x = w / 2, y = d / 2;
  p.moveTo(-x + r, -y); p.lineTo(x - r, -y); p.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false);
  p.lineTo(x, y - r); p.absarc(x - r, y - r, r, 0, Math.PI / 2, false);
  p.lineTo(-x + r, y); p.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false);
  p.lineTo(-x, -y + r); p.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false); return p;
}
// 평면 모양을 위로 밀어 올린 입체(y0~y1), 모서리는 bevel로 둥글게
function extrudeUp(shape, y0, y1, bevel) {
  const geo = new THREE.ExtrudeGeometry(shape, { depth: Math.max(0.001, y1 - y0 - bevel * 2), bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 14 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, y0 + bevel, 0); return geo;
}
// 유수대 쟁반: 둥근 모서리 바닥판 + 한 덩어리로 성형된 테두리 턱 + 위 가장자리 말림 + 아래쪽 끝 배수 구멍 3개
export function makeTray() {
  const { W, D, wall, rim, floor } = TRAY, g = new THREE.Group();
  const plastic = new THREE.MeshStandardMaterial({ color: 0xc3ccd3, roughness: 0.4, metalness: 0.05 });
  const floorM = new THREE.MeshStandardMaterial({ color: 0xa7b2bb, roughness: 0.5, metalness: 0.05 });
  const base = new THREE.Mesh(extrudeUp(rrPath(new THREE.Shape(), W - 0.03, D - 0.03, 0.26), -floor, 0, 0.018), floorM);
  const ringShape = rrPath(new THREE.Shape(), W, D, 0.28); ringShape.holes.push(rrPath(new THREE.Path(), W - wall * 2, D - wall * 2, 0.28 - wall));
  const walls = new THREE.Mesh(extrudeUp(ringShape, -floor, rim, 0.016), plastic);
  const lipShape = rrPath(new THREE.Shape(), W + 0.12, D + 0.12, 0.34); lipShape.holes.push(rrPath(new THREE.Path(), W - wall * 2 + 0.01, D - wall * 2 + 0.01, 0.28 - wall));
  const lip = new THREE.Mesh(extrudeUp(lipShape, rim - 0.035, rim + 0.012, 0.012), plastic);
  g.add(base, walls, lip);
  // 배수 구멍(아래쪽 끝 벽): 바깥·안쪽 면에 어두운 구멍 + 둥근 테
  const holeM = new THREE.MeshStandardMaterial({ color: 0x1e2227, roughness: 0.9 }), rimM = new THREE.MeshStandardMaterial({ color: 0x9aa6b0, roughness: 0.35, metalness: 0.2 });
  const holes = new THREE.InstancedMesh(new THREE.CircleGeometry(0.058, 24), holeM, 6), rims = new THREE.InstancedMesh(new THREE.TorusGeometry(0.062, 0.013, 8, 28), rimM, 6);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1); let k = 0;
  for (const z of [-0.62, 0, 0.62]) for (const [x, ry] of [[W / 2 + 0.019, Math.PI / 2], [W / 2 - wall - 0.003, -Math.PI / 2]]) {
    Q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ry);
    holes.setMatrixAt(k, M.compose(new THREE.Vector3(x, 0.075, z), Q, one)); rims.setMatrixAt(k, M.compose(new THREE.Vector3(x + (ry > 0 ? 0.004 : -0.004), 0.075, z), Q, one)); k++;
  }
  g.add(holes, rims);
  [base, walls, lip].forEach((o) => { o.castShadow = true; o.receiveShadow = true; });
  return g;
}
// 쟁반을 아래쪽 끝(+x) 바닥 모서리를 축으로 A만큼 기울였을 때의 자세. 받침 블록 높이도 여기서 계산한다.
export function tiltRig(A, floorY) {
  const { W, cx, floor } = TRAY, pivot = new THREE.Vector3(cx + W / 2 + 0.02, floorY - floor, 0), rot = new THREE.Euler(0, 0, -A);
  const anchor = new THREE.Vector3(pivot.x, 0.002, 0);
  const place = (o) => { o.position.sub(pivot).applyEuler(rot).add(anchor); o.rotation.z -= A; return o; };
  const b = new THREE.Vector3(cx - W / 2 + 0.5, floorY - floor, 0).sub(pivot).applyEuler(rot).add(anchor);
  return { place, blockX: b.x, blockH: b.y };
}
// 받침 블록(나무): 쟁반 위쪽 끝을 괴어 기울기를 만든다
export function makeBlock(h) {
  const wood = new THREE.MeshStandardMaterial({ color: 0xb4834f, roughness: 0.78, map: woodTexture() });
  const m = new THREE.Mesh(roundedBoxGeometry(0.46, h, 2.7, 0.035, 2), wood); m.position.y = h / 2; m.castShadow = m.receiveShadow = true; return m;
}
export function woodTexture() {
  return canvasTex('wood', 256, (g, S) => {
    const r = prng(5); g.fillStyle = '#ffffff'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 70; i++) { const y = r() * S, a = 0.05 + r() * 0.12; g.strokeStyle = `rgba(90,55,25,${a})`; g.lineWidth = 0.6 + r() * 2.2; g.beginPath();
      for (let x = 0; x <= S; x += 8) g.lineTo(x, y + Math.sin(x * 0.03 + i) * 3 + Math.sin(x * 0.11 + i * 2) * 1.2); g.stroke(); }
  });
}
// 손잡이 달린 투명 계량컵 + 물(원점 = 컵 가운데). setFill(0~1)로 물 높이를 바꾼다. 따르는 쪽(+x)에 부리가 있다.
export function makeCup(fill = 0.7) {
  const g = new THREE.Group(), prof = [[0, -0.23], [0.165, -0.23], [0.18, -0.215], [0.232, 0.205], [0.245, 0.222], [0.238, 0.236], [0.224, 0.228], [0.219, 0.205], [0.166, -0.205], [0, -0.205]].map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(prof, 44), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < 0.15) continue; const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x, z) || 1, k = 1 + 0.32 * Math.max(0, x / r) ** 10 * ((y - 0.15) / 0.086); p.setX(i, x * k); p.setY(i, y + 0.025 * Math.max(0, x / r) ** 10 * ((y - 0.15) / 0.086)); }
  geo.computeVertexNormals();
  const body = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xeaf4fa, roughness: 0.06, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false }));
  body.renderOrder = 2; g.add(body);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.212, 0.168, 1, 32), new THREE.MeshPhysicalMaterial({ color: 0x3f93d8, roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.82 }));
  water.geometry.translate(0, 0.5, 0); water.position.y = -0.203; g.add(water);
  const handleM = new THREE.MeshPhysicalMaterial({ color: 0x2f6fb3, roughness: 0.35, clearcoat: 0.6 });
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.026, 12, 28, Math.PI), handleM); handle.rotation.z = Math.PI / 2; handle.position.set(-0.2, 0.0, 0); g.add(handle);
  const tickM = new THREE.MeshBasicMaterial({ color: 0x2f6fb3 });
  for (const y of [-0.12, -0.04, 0.04, 0.12]) { const r = 0.18 + (0.232 - 0.18) * (y + 0.215) / 0.42; const t = new THREE.Mesh(new THREE.BoxGeometry(y === 0.04 || y === -0.12 ? 0.08 : 0.05, 0.008, 0.004), tickM); t.position.set(0, y, r + 0.003); g.add(t); }
  g.setFill = (f) => { const k = Math.max(0.001, Math.min(1, f)); water.scale.y = 0.34 * k; water.visible = f > 0.01; return g; };
  g.setFill(fill); g.traverse((o) => { if (o.isMesh && o !== body) o.castShadow = true; });
  return g;
}
// 자갈: 찌그러진 구(모양·색이 조금씩 다름)
export function makePebbles(spots) {
  const g = new THREE.Group(), cols = [0x8d8579, 0x6f675e, 0xa39a8c, 0x7c6a58, 0x5f6166];
  spots.forEach(([x, z, s], i) => {
    const geo = new THREE.SphereGeometry(1, 14, 10), p = geo.attributes.position, r = prng(100 + i);
    const a = [r() * 6, r() * 6, r() * 6];
    for (let k = 0; k < p.count; k++) { const X = p.getX(k), Y = p.getY(k), Z = p.getZ(k), f = 1 + 0.16 * Math.sin(X * 2.1 + a[0]) * Math.sin(Y * 1.7 + a[1]) + 0.1 * Math.sin(Z * 3.3 + a[2]); p.setXYZ(k, X * f, Y * f * 0.62, Z * f); }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: cols[i % cols.length], roughness: 0.82, metalness: 0 }));
    m.scale.setScalar(s); m.rotation.y = r() * 6; m.userData.spot = [x, z, s]; m.receiveShadow = true; g.add(m);
  });
  g.userData.place = (hAt) => g.children.forEach((m) => { const [x, z, s] = m.userData.spot; m.position.set(x, hAt(x, z) + s * 0.35, z); });
  return g;
}
export const PEBBLE_SPOTS = [[-1.35, 1.08, 0.075], [-1.5, -0.86, 0.06], [-0.72, -1.27, 0.05], [0.55, 1.27, 0.065], [1.5, -1.28, 0.055], [2.35, 1.3, 0.07], [2.8, -1.2, 0.06], [0.15, -1.32, 0.045], [-1.05, 1.3, 0.04]];

function terrain() {
  const geo = new THREE.PlaneGeometry(X1 - X0, Z1 - Z0, NX, NZ); geo.rotateX(-Math.PI / 2); geo.translate((X0 + X1) / 2, 0, 0);
  const pos = geo.attributes.position, col = new Float32Array(pos.count * 3); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const sandA = new Float32Array(pos.count); geo.setAttribute('sand', new THREE.BufferAttribute(sandA, 1));
  const m = new THREE.Mesh(geo, soilMaterial());
  m.castShadow = true; m.receiveShadow = true; m.position.y = BASE;
  const peb = makePebbles(PEBBLE_SPOTS); m.add(peb);
  const c = new THREE.Color();
  m.userData.set = (e, d) => {
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), h = height(x, z, e, d);
      pos.setY(i, h);
      const n = noise(x * 6, z * 6);
      c.copy(C.dry).lerp(C.dark, n * 0.45 + (h < 0.02 ? 0.25 : 0));
      const g = gully(x, z, 1), inCh = Math.min(1, g / 0.12);
      if (e > 0) c.lerp(C.wet, Math.min(1, inCh * 0.85 * Math.min(1, e * 3)));     // 물이 흐른 자리는 젖어 어두움
      const fw = fan(x, z, 1) / FAN.h;
      if (d > 0) c.lerp(C.wet, fw * 0.5 * d);
      const top = Math.max(0, (mound(x, z) - HH * 0.8) / (HH * 0.2));            // 꼭대기 색 모래
      const sandTop = top * (1 - e * Math.min(1, inCh * 1.6 + 0.35));            // 깎인 만큼 사라짐
      const sandFan = d * Math.max(0, fw - 0.35) * 1.4 * (0.35 + 0.65 * noise(x * 16, z * 16));
      const sa = Math.min(0.95, sandTop * 0.95 + sandFan); sandA[i] = sa;
      c.lerp(C.sand, sa * 0.6);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    pos.needsUpdate = true; geo.attributes.color.needsUpdate = true; geo.attributes.sand.needsUpdate = true; geo.computeVertexNormals();
    peb.userData.place((x, z) => height(x, z, e, d));
    m.userData.e = e; m.userData.d = d;
  };
  m.userData.set(0, 0);
  return m;
}

// 물: 물길을 따라 흐르는 물띠(밝은 물결 무늬가 아래로 흘러감) + 물방울 + 흙탕물 웅덩이 + 컵에서 떨어지는 물줄기
const PATH_N = 80, px = (k) => lerp(0.02, 2.55, k);
const CLEAR = new THREE.Color(0x4f9fdc), MUD = new THREE.Color(0x8a7458), FOAM = new THREE.Color(0xe6f4ff);
function water(hill) {
  const g = new THREE.Group();
  const W = 0.1, geo = new THREE.BufferGeometry(), NV = (PATH_N + 1) * 2, v = new Float32Array(NV * 3), vc = new Float32Array(NV * 3), idx = [];
  for (let k = 0; k < PATH_N; k++) { const a = k * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  geo.setAttribute('position', new THREE.BufferAttribute(v, 3)); geo.setAttribute('color', new THREE.BufferAttribute(vc, 3)); geo.setIndex(idx);
  const ribbon = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.78, roughness: 0.18, metalness: 0, side: THREE.DoubleSide }));
  g.add(ribbon);
  const ND = 90, drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 8, 6), mat(0xd8eeff, { opacity: 0.7, roughness: 0.05 }), ND);
  const NG = 30, grains = new THREE.InstancedMesh(new THREE.SphereGeometry(0.024, 6, 4), mat(0x2ec4b6, { roughness: 0.8 }), NG);
  const NF = 14, fall = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 8, 6), mat(0x9fd0f5, { opacity: 0.8, roughness: 0.05 }), NF);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1, 40), mat(0x6f8fa8, { opacity: 0.6, roughness: 0.05 }));
  pool.rotation.x = -Math.PI / 2; pool.scale.set(0.01, 0.01, 1);
  g.add(drops, grains, fall, pool); g.position.y = BASE;
  const at = (s, off = 0) => { const x = px(s), z = zc(x) + off; return [x, height(x, z, hill.userData.e, hill.userData.d) + 0.02, z]; };
  const U = g.userData; U.front = 0; U.carry = 0; U.t = 0;
  U.refresh = () => {
    for (let k = 0; k <= PATH_N; k++) {
      const s = Math.min(k / PATH_N, U.front), w = W * (0.7 + 1.0 * s) * (k / PATH_N > U.front ? 0.2 : 1);
      const [x1, y1, z1] = at(s, -w), [x2, y2, z2] = at(s, w); v.set([x1, y1, z1, x2, y2, z2], k * 6);
    }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
    const [fx, fy, fz] = at(0.96); pool.position.set(fx, fy - 0.008, fz);
    const r = Math.max(0.01, (U.front - 0.92) / 0.08) * (0.2 + 0.1 * U.carry); pool.scale.set(r * 1.4, r, 1);
    pool.material.color.copy(CLEAR).lerp(MUD, U.carry * 0.8);
  };
  const M = new THREE.Matrix4(), S = new THREE.Vector3(), c = new THREE.Color(), seeds = Array.from({ length: ND + NG }, (_, i) => [hash(i, 1), (hash(i, 2) - 0.5) * 0.14]);
  const LIP = new THREE.Vector3(-0.05, HH + 0.5, 0), PEAK = new THREE.Vector3(0.02, HH + 0.02, 0);
  U.tick = (dt) => {
    U.t += dt; const t = U.t;
    // 물결 무늬: 밝은 줄이 위에서 아래로 흘러간다. 흙을 깎는 동안은 흙탕물 색.
    const base = c.copy(CLEAR).lerp(MUD, U.carry * 0.75), foam = FOAM.clone().lerp(MUD, U.carry * 0.4);
    for (let k = 0; k <= PATH_N; k++) {
      const s = k / PATH_N, wave = Math.max(0, Math.sin(s * 46 - t * 9)) ** 3 * 0.7 + Math.max(0, Math.sin(s * 23 - t * 6 + 1.3)) ** 4 * 0.3;
      const col = base.clone().lerp(foam, wave);
      for (const j of [0, 1]) vc.set([col.r, col.g, col.b], (k * 2 + j) * 3);
    }
    geo.attributes.color.needsUpdate = true;
    for (let i = 0; i < ND; i++) { const [s0, o] = seeds[i], s = (s0 + t * 0.55) % 1;
      if (s > U.front) { M.makeScale(0, 0, 0); } else { const [x, y, z] = at(s, o * (0.6 + s)); M.makeTranslation(x, y + 0.012, z); }
      drops.setMatrixAt(i, M); }
    drops.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < NG; i++) { const [s0, o] = seeds[ND + i], s = (s0 + t * 0.3) % 1;
      const k = s > U.front ? 0 : U.carry; const [x, y, z] = at(s, o * 0.8); M.makeTranslation(x, y + 0.014, z).scale(S.set(k, k, k)); grains.setMatrixAt(i, M); }
    grains.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < NF; i++) { const q = (i / NF + t * 1.6) % 1; const p = LIP.clone().lerp(PEAK, q); p.y -= q * q * 0.1; M.makeTranslation(p.x, p.y, p.z); fall.setMatrixAt(i, M); }
    fall.instanceMatrix.needsUpdate = true;
  };
  return g;
}

export default {
  view: { theta: 1.02, phi: 1.08, dist: 7.0, target: [0.8, 0.95, 0] },
  build(kit, world) {
    // 쟁반은 아래쪽 끝(+x)이 바닥에 닿고 위쪽 끝을 나무 블록이 괴어 약 4° 기울어 있다(흙·물·컵도 같은 자세).
    const rig = tiltRig(0.07, BASE);
    const tray = new THREE.Group(), body = makeTray(); body.position.set(TRAY.cx, BASE, 0); rig.place(body);
    const block = makeBlock(rig.blockH); block.position.x = rig.blockX; tray.add(body, block); world.add('tray', tray);
    const hill = terrain(); rig.place(hill); world.add('hill', hill);
    const wat = water(hill); rig.place(wat); world.add('water', wat);
    const cup = makeCup(0.7); cup.rotation.z = -0.75; cup.position.set(-0.28, BASE + HH + 0.62, 0); rig.place(cup); world.add('cup', cup);
    const lbQ = label('색 모래는 어디로 갈까?', { size: 0.3 }); lbQ.position.set(0.5, 2.55, 0); world.add('lbQ', lbQ);
    const lbCut = label('위쪽은 깎여요 — 침식', { size: 0.28 }); lbCut.position.set(0.1, 2.35, 0); world.add('lbCut', lbCut);
    const lbMove = label('흙이 물을 따라 옮겨져요 — 운반', { size: 0.26 }); lbMove.position.set(1.2, 1.75, 0); world.add('lbMove', lbMove);
    const lbPile = label('아래쪽에 쌓여요 — 퇴적', { size: 0.28 }); lbPile.position.set(2.1, 0.95, 0); world.add('lbPile', lbPile);
    const down = arrow([0.35, BASE + 1.55, 0.55], [1.9, BASE + 0.45, 0.55], P.red, 0.035); world.add('down', down);
    return { update(dt) { if (wat.visible) wat.userData.tick(dt); } };
  },
  beats: [
    { text: '쟁반에 흙 언덕을 만들고, 꼭대기에 색 모래를 뿌려요.', show: ['tray', 'hill', 'lbQ'], dur: 4,
      reset(o) { o.hill.userData.set(0, 0); Object.assign(o.water.userData, { carry: 0, front: 0 }); o.water.userData.refresh(); } },
    { text: '컵으로 언덕 위쪽에서 물을 천천히 흘려보내요. 물이 언덕을 타고 흘러내려요.', show: ['cup', 'water'], dur: 5,
      anim(p, o) { o.water.userData.front = p; o.water.userData.refresh(); } },
    { text: '물이 흐르면서 위쪽의 흙과 색 모래를 깎아 내요.', show: ['lbCut'], hide: ['lbQ'], dur: 5,
      anim(p, o) { o.hill.userData.set(p, 0); Object.assign(o.water.userData, { carry: p, front: 1 }); o.water.userData.refresh(); } },
    { text: '깎인 흙은 흐르는 물을 따라 아래로 옮겨져요.', show: ['down', 'lbMove'], hide: ['lbCut'], dur: 5,
      anim(p, o) { o.hill.userData.set(1, 0.35 * p); Object.assign(o.water.userData, { carry: 1, front: 1 }); o.water.userData.refresh(); } },
    { text: '물이 느려지는 아래쪽에 흙과 색 모래가 쌓여요.', show: ['lbPile'], hide: ['lbMove', 'down'], dur: 6,
      anim(p, o) { o.hill.userData.set(1, lerp(0.35, 1, p)); o.water.userData.refresh(); } },
  ],
};
