import { THREE, label, relabel, roundedBoxGeometry, clamp01, lerp } from './_kit.js';
import { thickGlass, labTable } from './glassware.js';
import { LEVELS, WALL, HOUSES, overtops, seaModel, wetHouses } from './sealevel-model.js';
export { LEVELS, WALL, HOUSES, overtops, seaModel, wetHouses };
// 해안 마을 모형(4-2 Ⅳ 기후변화와 우리 생활) — 투명한 통 속 점토 해안과 집 다섯 채, 물높이 눈금, 방파제.
// 땅 높이는 cm(통 바닥 기준)로 정하고 1 cm = K로 그린다. 집 자리의 땅 높이가 sealevel-model.js의 base와 같도록 언덕을 맞춘다.
const K = 0.16, W = 4.8, D = 2.9, TRAY_H = 7.5 * K;          // 1 cm · 통 안쪽 가로·세로 · 통 높이(7.5 cm)
const X0 = -W / 2, Z0 = -D / 2;
const shoreX = (z) => -0.75 + 0.14 * Math.sin(z * 2.1 + 0.4);   // 물가(지금 바다 1 cm 근처)
const SPOT = { A: [-0.42, -0.92], B: [-0.3, 0.12], C: [0.45, 0.9], D: [1.0, -0.3], E: [1.9, 0.5] };
const SIG = { A: 0.42, B: 0.5, C: 0.42, D: 0.6, E: 0.55 };
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
// 언덕을 빼고 본 땅: 바다 밑(0.3 cm) → 모래톱 → 안쪽으로 천천히 높아지는 들 + 강 골짜기
function plain(x, z) {
  const s = shoreX(z), up = smooth(s - 0.55, s + 0.35, x);
  let h = lerp(0.3, 1.25, up) + Math.max(0, x - (s + 0.35)) * 1.7 * up;
  const river = Math.exp(-((z - 1.08) ** 2) / 0.02) * smooth(1.6, 0.6, x) * up;   // 강: 물가에서 안쪽으로 얕아지는 골
  h -= river * 0.7 * Math.min(1, h);
  return h;
}
// 집 자리 높이가 목표와 같도록 언덕 높이(a)를 몇 번 고쳐 맞춘다
const AMP = Object.fromEntries(HOUSES.map((h) => [h.id, 0]));
const bump = (x, z) => HOUSES.reduce((s, h) => { const [hx, hz] = SPOT[h.id]; return s + AMP[h.id] * Math.exp(-((x - hx) ** 2 + (z - hz) ** 2) / SIG[h.id] ** 2); }, 0);
export const heightAt = (x, z) => Math.max(0.2, plain(x, z) + bump(x, z));
for (let it = 0; it < 30; it++) for (const h of HOUSES) { const [x, z] = SPOT[h.id]; AMP[h.id] += h.base - heightAt(x, z); }

// 흙·모래·풀 색: 낮은 물가는 모래, 위로 갈수록 풀, 아주 높으면 흙빛 언덕
function landColor(h, c) {
  const sand = new THREE.Color(0xe3cf9f), grass = new THREE.Color(0x8fb56a), hill = new THREE.Color(0x7a9a55), soil = new THREE.Color(0xa98b62);
  if (h < 1.6) c.copy(sand).lerp(grass, smooth(1.1, 1.6, h));
  else if (h < 4.5) c.copy(grass).lerp(hill, smooth(2.5, 4.5, h));
  else c.copy(hill).lerp(soil, smooth(4.6, 6.2, h) * 0.5);
  return c;
}
function terrain() {
  const nx = 140, nz = 84, geo = new THREE.PlaneGeometry(W, D, nx, nz); geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), h = heightAt(x, z), n = (Math.sin(x * 37.1 + z * 11.3) * 43758.5453) % 1;
    p.setY(i, h * K); landColor(h, c); c.offsetHSL(0, 0, (n - 0.5) * 0.03); col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 })); m.receiveShadow = true; return m;
}
// 앞 유리에 비치는 점토 단면(앞쪽 가장자리 z = D/2)
function frontCut() {
  const n = 140, pos = [], idx = [], z = D / 2;
  for (let i = 0; i <= n; i++) { const x = X0 + (i / n) * W; pos.push(x, 0, z, x, heightAt(x, z) * K, z); if (i < n) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xb28a5e, roughness: 0.95, side: THREE.DoubleSide }));
}
// 물: 물가 선을 기준으로 바다 쪽 · 안쪽 두 장(방파제가 막으면 안쪽은 숨긴다)
function waterSheet(side) {
  const nx = 60, nz = 40, pos = [], idx = [];
  for (let j = 0; j <= nz; j++) {
    const z = Z0 + (j / nz) * D, s = shoreX(z) + 0.06;
    for (let i = 0; i <= nx; i++) { const t = i / nx, x = side === 'sea' ? lerp(X0, s, t) : lerp(s, X0 + W, t); pos.push(x, 0, z); }
  }
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const a = j * (nx + 1) + i; idx.push(a, a + nx + 1, a + 1, a + 1, a + nx + 1, a + nx + 2); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0x3f8fd0, roughness: 0.12, transparent: true, opacity: 0.62, clearcoat: 1, depthWrite: false }));
  m.renderOrder = 4; return m;
}
// 통 앞면에 비치는 물의 단면(물높이만큼)
function waterFront() {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(W, 1), new THREE.MeshPhysicalMaterial({ color: 0x2f7fc4, roughness: 0.2, transparent: true, opacity: 0.38, depthWrite: false }));
  m.geometry.translate(0, 0.5, 0); m.position.z = D / 2 + 0.005; m.renderOrder = 5; return m;
}
// 앞 유리에 붙인 자(0~7 cm)
function rulerTexture() {
  const c = document.createElement('canvas'); c.width = 192; c.height = 1024; const g = c.getContext('2d');
  g.fillStyle = 'rgba(255,253,244,.94)'; g.fillRect(0, 0, 192, 1024); g.strokeStyle = '#1f2a44'; g.fillStyle = '#1f2a44'; g.font = '900 78px Pretendard, sans-serif'; g.textBaseline = 'middle';
  for (let mm = 0; mm <= 75; mm += 5) { const y = 1024 - (mm / 75) * 1000 - 12, big = mm % 10 === 0; g.lineWidth = big ? 6 : 3; g.beginPath(); g.moveTo(0, y); g.lineTo(big ? 52 : 30, y); g.stroke(); if (big) g.fillText(String(mm / 10), 70, y); }
  g.font = '800 44px Pretendard, sans-serif'; g.fillText('cm', 92, 34);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function house(id, color) {
  const g = new THREE.Group();
  const wall = new THREE.Mesh(roundedBoxGeometry(0.24, 0.17, 0.2, 0.02), new THREE.MeshStandardMaterial({ color, roughness: 0.6 })); wall.position.y = 0.085; wall.castShadow = true; g.add(wall);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.13, 4, 1), new THREE.MeshStandardMaterial({ color: 0x9a3b2e, roughness: 0.55 })); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.85); roof.position.y = 0.235; roof.castShadow = true; g.add(roof);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.08), new THREE.MeshStandardMaterial({ color: 0x5b3b22 })); door.position.set(0, 0.04, 0.101); g.add(door);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.022, 10, 40), new THREE.MeshStandardMaterial({ color: 0x1f6fd1, emissive: 0x1f6fd1, emissiveIntensity: 0.35, roughness: 0.3 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; ring.visible = false; g.add(ring);
  g.userData = { ring, wall, id };
  return g;
}
const COLORS = { A: 0xf3e3c2, B: 0xd9ecf7, C: 0xf6d6c8, D: 0xe4efd2, E: 0xeee2f4 };

// opts.letters: 집마다 A~E 이름표
export function buildSeaTown({ letters = true } = {}) {
  const g = new THREE.Group();
  const table = labTable(6.6, 4.0); g.add(table);
  const base = new THREE.Mesh(roundedBoxGeometry(W + 0.16, 0.05, D + 0.16, 0.04), new THREE.MeshPhysicalMaterial({ color: 0xf4f7f9, roughness: 0.2, transparent: true, opacity: 0.55 })); base.position.y = 0.025; base.userData.noFrame = true; g.add(base);
  const land = terrain(); land.position.y = 0.05; g.add(land);
  const cut = frontCut(); cut.position.y = 0.05; g.add(cut);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(W + 0.1, TRAY_H, D + 0.1), thickGlass(0xeef6f8, 0.05)); glass.position.y = 0.05 + TRAY_H / 2; glass.renderOrder = 7; g.add(glass);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(glass.geometry), new THREE.LineBasicMaterial({ color: 0x9fb4c4, transparent: true, opacity: 0.6 })); edge.position.copy(glass.position); g.add(edge);
  const sea = waterSheet('sea'), inland = waterSheet('in'), front = waterFront(); g.add(sea, inland, front);
  const ruler = new THREE.Mesh(new THREE.PlaneGeometry(0.3, TRAY_H), new THREE.MeshBasicMaterial({ map: rulerTexture(), transparent: true })); ruler.position.set(X0 + 0.22, 0.05 + TRAY_H / 2, D / 2 + 0.06); ruler.renderOrder = 9; g.add(ruler);
  // 방파제: 물가를 따라 통 끝에서 끝까지(강 하구도 막는다)
  const wall = new THREE.Group(), wMat = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, roughness: 0.8 });
  for (let j = 0; j < 28; j++) { const z0 = Z0 + (j / 28) * D, z1 = Z0 + ((j + 1) / 28) * D, zm = (z0 + z1) / 2, x = shoreX(zm) + 0.06, top = WALL * K;
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.07, top, z1 - z0 + 0.012), wMat); seg.position.set(x, 0.05 + top / 2, zm); seg.rotation.y = -Math.atan(0.14 * 2.1 * Math.cos(zm * 2.1 + 0.4)); seg.castShadow = true; wall.add(seg); }
  wall.visible = false; g.add(wall);
  const houses = HOUSES.map((h) => { const o = house(h.id, COLORS[h.id]), [x, z] = SPOT[h.id]; o.position.set(x, 0.05 + heightAt(x, z) * K, z); o.rotation.y = 0.1; o.scale.setScalar(1.45); g.add(o); return o; });
  const tags = letters ? houses.map((o) => { const t = label(o.userData.id, { size: 0.17 }); t.position.set(o.position.x, o.position.y + 0.62, o.position.z); g.add(t); return t; }) : [];
  const names = { sea: label('바다(통에 부은 물)', { size: 0.2 }), ruler: label('물높이 눈금', { size: 0.18 }), wall: label('방파제 3.5 cm', { size: 0.18 }) };
  names.sea.position.set(-1.75, TRAY_H + 0.32, -0.7); names.ruler.position.set(X0 + 0.3, TRAY_H + 0.3, D / 2 + 0.1); names.wall.position.set(shoreX(-1.2) + 0.1, WALL * K + 0.36, -1.25);
  for (const x of Object.values(names)) g.add(x);
  const S = { level: 1, wall: false, t: 0, show: true };
  const draw = () => {
    const y = 0.05 + S.level * K, wave = (x, z) => Math.sin(x * 6 + S.t * 1.6) * 0.004 + Math.cos(z * 7 - S.t * 1.3) * 0.003;
    for (const w of [sea, inland]) { const p = w.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, y + wave(p.getX(i), p.getZ(i))); p.needsUpdate = true; }
    inland.visible = overtops(S.level, S.wall) && S.level > 1.3;
    front.scale.y = Math.max(0.001, S.level * K); front.position.y = 0.05;
    wall.visible = S.wall; names.wall.visible = S.wall;
    houses.forEach((o) => { const h = HOUSES.find((x) => x.id === o.userData.id), wet = S.show && overtops(S.level, S.wall) && h.base <= S.level + 1e-6; o.userData.ring.visible = wet; o.userData.wall.material.emissive?.setHex(wet ? 0x123a66 : 0x000000); o.userData.wall.material.emissiveIntensity = wet ? 0.25 : 0; });
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, houses, tags, names, wall, water: [sea, inland, front], ruler, land };
  return g;
}

export default {
  view: { theta: -0.38, phi: 1.02 }, revealAt: 2,
  frame: [[X0 - 0.1, 0, Z0 - 0.1], [X0 + W + 0.1, TRAY_H + 0.2, -Z0 + 0.15]],
  build(kit, world) { world.add('town', buildSeaTown()); return {}; },
  beats: [
    { text: '투명한 통에 점토로 해안을 만들고 집 다섯 채를 고정했어요. 지금 바다(물)의 높이는 1 cm예요. 집 A는 바다 바로 옆 언덕 위, 집 B는 바다 가까운 낮은 모래땅에 있어요.', show: ['town'], dur: 7,
      reset(o) { o.town.userData.set({ level: 1, wall: false, t: 0 }); },
      anim(p, o) { o.town.userData.set({ t: p * 7 }); } },
    { text: '바닷물의 높이(해수면)가 조금씩 올라가 4 cm가 되면 어느 집부터 물에 닿을까요? 바다와 가까운 집일까요, 땅이 낮은 집일까요? 먼저 예상해요.', show: ['town'], dur: 6,
      anim(p, o) { o.town.userData.set({ t: 7 + p * 6 }); } },
    { text: '물높이를 1 cm씩 올렸어요. 2 cm에서 집 B, 3 cm에서 집 C, 4 cm에서 집 D가 물에 닿았어요. 바다 바로 옆이지만 언덕 위에 있는 집 A는 젖지 않았어요.', show: ['town'], dur: 10,
      anim(p, o) { o.town.userData.set({ level: 1 + 3 * p, t: 13 + p * 10 }); } },
    { text: '물가에 높이 3.5 cm의 방파제를 세우고 다시 해 봐요. 3 cm까지는 마을이 지켜졌지만, 4 cm가 되자 물이 방파제를 넘어 낮은 집들이 다시 잠겼어요.', show: ['town'], dur: 10,
      reset(o) { o.town.userData.set({ wall: true, level: 1 }); },
      anim(p, o) { o.town.userData.set({ wall: true, level: 1 + 3 * p, t: 23 + p * 10 }); } },
    { text: '해수면이 높아지면 바다와의 거리보다 땅이 낮은 곳부터 잠겨요. 이 모형은 파도·밀물과 썰물·실제 땅 모양이 없어서, 어느 마을이 언제 잠길지 알려 주지는 않아요.', show: ['town'], dur: 7,
      anim(p, o) { o.town.userData.set({ wall: false, level: 4, t: 33 + p * 7 }); } },
  ],
};
