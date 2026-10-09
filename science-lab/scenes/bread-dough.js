import { THREE, label, relabel, roundedBoxGeometry, puffCloud, clamp01, lerp } from './_kit.js';
import { fresnel, thickGlass, lathe, round, labTable, labTray, labelTexture } from './glassware.js';
import { WATERS, TEMPS, START, MINUTES, breadModel, volAt, MAX_VOL } from './bread-model.js';
export { WATERS, TEMPS, START, MINUTES, breadModel, volAt, MAX_VOL };
// 부푸는 효모빵 반죽(5-1 Ⅴ 다양한 생물과 우리 생활) — 원본 5-C 「효모빵 만들기」.
// 같은 양의 밀가루·설탕·효모에 온도가 다른 물을 넣은 반죽을 눈금 컵에 200 mL씩 담아 랩을 씌우고 따뜻한 곳에 둔다.
// 따뜻한 물(40 ℃) 반죽은 두 배로, 찬물은 조금 부풀고, 뜨거운 물(70 ℃)은 효모가 죽어 그대로다. 컵 벽에는 기체 구멍이 비친다.
const R = 0.6, CUP_H = 2.12, Y0 = 0.07, K = 0.0036;   // 컵 안 반지름 · 높이 · 안쪽 바닥 · 1 mL당 높이(100 mL = 0.36)
const NB = 70;                                        // 컵 벽에 비치는 기체 구멍 수(가장 많이 부풀었을 때)
const SHORT = ['찬물 10 ℃', '따뜻한 물 40 ℃', '뜨거운 물 70 ℃'], TAG = ['찬물', '따뜻한 물', '뜨거운 물'];

// 눈금 컵 바깥에 인쇄된 눈금(100~500 mL)
function scaleTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 1024; const g = c.getContext('2d'), H = CUP_H;
  g.strokeStyle = '#2b3a67'; g.fillStyle = '#2b3a67'; g.lineCap = 'round'; g.font = '800 54px Pretendard, sans-serif'; g.textBaseline = 'middle';
  for (let ml = 50; ml <= 500; ml += 50) {
    const y = 1024 - (Y0 + ml * K) / H * 1024, big = ml % 100 === 0; g.lineWidth = big ? 9 : 6;
    g.beginPath(); g.moveTo(20, y); g.lineTo(big ? 120 : 80, y); g.stroke(); if (big) g.fillText(String(ml), 132, y + 2);
  }
  g.font = '700 40px Pretendard, sans-serif'; g.fillText('mL', 140, 1024 - (Y0 + 525 * K) / H * 1024);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// 반죽 겉면: 크림색 바탕 + 밀가루 점 + 아주 옅은 결
function doughTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#efd49f'; g.fillRect(0, 0, 512, 512); let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 2600; i++) { const v = r(); g.fillStyle = v < 0.5 ? 'rgba(255,250,236,.55)' : 'rgba(205,170,112,.28)'; g.beginPath(); g.arc(r() * 512, r() * 512, 0.8 + r() * 2.4, 0, 7); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1); return t;
}
// 둥근 부엌 타이머(0~60분): 지난 분만큼 빨간 바늘이 돈다
export function kitchenTimer() {
  const g = new THREE.Group(), c = document.createElement('canvas'); c.width = 512; c.height = 512; const x = c.getContext('2d');
  x.fillStyle = '#fffdf6'; x.beginPath(); x.arc(256, 256, 250, 0, 7); x.fill(); x.fillStyle = '#1f2a44'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '800 54px Pretendard, sans-serif';
  for (let m = 0; m < 60; m += 5) { const a = m / 60 * Math.PI * 2 - Math.PI / 2; x.lineWidth = m % 15 ? 5 : 9; x.strokeStyle = '#1f2a44'; x.beginPath(); x.moveTo(256 + Math.cos(a) * 228, 256 + Math.sin(a) * 228); x.lineTo(256 + Math.cos(a) * (m % 15 ? 205 : 192), 256 + Math.sin(a) * (m % 15 ? 205 : 192)); x.stroke(); if (m % 10 === 0) x.fillText(String(m), 256 + Math.cos(a) * 150, 256 + Math.sin(a) * 150); }
  x.font = '700 36px Pretendard, sans-serif'; x.fillStyle = '#5b6577'; x.fillText('분', 256, 330);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const body = new THREE.Mesh(lathe(round([[0, 0], [0.42, 0, 0.05], [0.45, 0.2, 0.08], [0.4, 0.26], [0, 0.26]]), 64), new THREE.MeshPhysicalMaterial({ color: 0xe9573f, roughness: 0.35, clearcoat: 0.8 })); g.add(body);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.39, 64), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 })); face.rotation.x = -Math.PI / 2; face.position.y = 0.262; g.add(face);
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.012, 0.3), new THREE.MeshStandardMaterial({ color: 0xd32f2f })); hand.geometry.translate(0, 0, -0.15); const pivot = new THREE.Group(); pivot.position.y = 0.272; pivot.add(hand); g.add(pivot);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 20), new THREE.MeshStandardMaterial({ color: 0x1f2a44 })); knob.position.y = 0.28; g.add(knob);
  g.rotation.x = 0.55; g.traverse((o) => { o.userData.noFrame = true; });
  g.userData.setMin = (m) => { pivot.rotation.y = -(m / 60) * Math.PI * 2; };
  return g;
}
// 눈금 컵 하나 + 반죽 + 기체 구멍 + 랩
function doughCup() {
  const g = new THREE.Group();
  const cup = new THREE.Mesh(lathe(round([[0, 0.012], [R + 0.04, 0, 0.05], [R + 0.04, CUP_H - 0.03], [R + 0.06, CUP_H, 0.01], [R + 0.005, CUP_H], [R, CUP_H - 0.03], [R, Y0, 0.04], [0, Y0]]), 72), thickGlass(0xeef6f8, 0.06)); cup.renderOrder = 6; g.add(cup);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.06, 16, 40, Math.PI), thickGlass(0xeef6f8, 0.12)); handle.rotation.z = Math.PI / 2; handle.position.set(-R - 0.04, CUP_H * 0.55, 0); handle.scale.set(1.25, 1, 1); handle.renderOrder = 6; g.add(handle);
  const scale = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.046, R + 0.046, CUP_H, 48, 1, true, -0.62, 0.62), new THREE.MeshBasicMaterial({ map: scaleTexture(), transparent: true, depthWrite: false }));
  scale.position.y = CUP_H / 2; scale.renderOrder = 8; g.add(scale);
  const dMat = new THREE.MeshPhysicalMaterial({ map: doughTexture(), color: 0xffffff, roughness: 0.78, sheen: 0.25, sheenColor: new THREE.Color(0xfff3dc), sheenRoughness: 0.6 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.012, R - 0.02, 1, 64, 1), dMat); body.geometry.translate(0, 0.5, 0); body.position.y = Y0; g.add(body);
  const cap = new THREE.Mesh(lathe(round([[R - 0.012, 0], [R * 0.92, 0.45, 0.2], [R * 0.55, 0.9, 0.25], [0, 1]]), 64), dMat); g.add(cap);
  const holes = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), new THREE.MeshStandardMaterial({ color: 0xc89c5c, roughness: 0.9 }), NB); holes.count = 0; g.add(holes);
  const hash = (x) => { const v = Math.sin(x) * 43758.5453; return v - Math.floor(v); };
  const seed = Array.from({ length: NB }, (_, i) => ({ a: hash(i * 12.9898 + 1.3) * 2.4 - 1.2, h: hash(i * 78.233 + 4.1), s: 0.025 + hash(i * 39.425 + 7.7) * 0.05 }));
  const wrap = new THREE.Mesh(lathe([[0, 0.05], [R * 0.6, 0.035], [R + 0.075, 0], [R + 0.075, -0.09]], 72), fresnel(new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.12, transparent: true, opacity: 0.12, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }), { edge: 0.5 }));
  wrap.position.y = CUP_H + 0.005; wrap.renderOrder = 9; g.add(wrap);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  g.userData.setVol = (vol, rise) => {      // rise: 0(처음 그대로) ~ 1(가장 많이 부풂)
    const dome = 0.07 + 0.13 * rise, bodyH = Math.max(0.05, vol * K);   // 컵 벽에 닿는 높이 = 눈금(가운데만 둥글게 솟는다)
    body.scale.y = bodyH; cap.position.y = Y0 + bodyH; cap.scale.y = dome;
    const n = Math.round(NB * (0.12 + 0.88 * rise)); let k = 0;
    for (let i = 0; i < n; i++) { const s = seed[i], r2 = s.s * (0.4 + 0.9 * rise), y = Y0 + 0.05 + s.h * (bodyH - 0.1); if (y + r2 > Y0 + bodyH) continue;
      P.set(Math.sin(s.a) * (R - 0.012 - r2 * 0.35), y, Math.cos(s.a) * (R - 0.012 - r2 * 0.35)); SC.set(r2, r2 * 0.8, r2 * 0.6); Q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), s.a); M.compose(P, Q, SC); holes.setMatrixAt(k++, M); }
    holes.count = k; holes.instanceMatrix.needsUpdate = true;
  };
  g.userData.setVol(START, 0);
  return g;
}
// 부엌 소품: 밀가루 봉지 · 설탕 그릇 · 효모 봉지
export function flourBag() {
  const b = new THREE.Group(), paper = new THREE.MeshStandardMaterial({ color: 0xf4efe2, roughness: 0.9 });
  const bag = new THREE.Mesh(roundedBoxGeometry(0.9, 1.15, 0.5, 0.1), paper); bag.position.y = 0.575; b.add(bag);
  const fold = new THREE.Mesh(roundedBoxGeometry(0.92, 0.12, 0.3, 0.05), paper); fold.position.y = 1.18; b.add(fold);
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.36), new THREE.MeshStandardMaterial({ map: labelTexture('밀가루', '강력분', '#c2581c'), roughness: 0.8 })); tag.position.set(0, 0.6, 0.252); b.add(tag);
  b.traverse((o) => { o.userData.noFrame = true; }); return b;
}
export function sugarBowl() {
  const b = new THREE.Group();
  b.add(new THREE.Mesh(lathe(round([[0, 0.01], [0.26, 0, 0.05], [0.42, 0.3, 0.05], [0.44, 0.32], [0.4, 0.3], [0.24, 0.04], [0, 0.04]]), 48), new THREE.MeshPhysicalMaterial({ color: 0x3f6fb5, roughness: 0.3, clearcoat: 0.8 })));
  const pile = new THREE.Mesh(lathe(round([[0, 0.3], [0.2, 0.25, 0.08], [0.39, 0.2]]), 48), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 })); b.add(pile);
  b.traverse((o) => { o.userData.noFrame = true; }); return b;
}
export function yeastPack() {
  const b = new THREE.Group();
  const pack = new THREE.Mesh(roundedBoxGeometry(0.62, 0.78, 0.1, 0.04), new THREE.MeshPhysicalMaterial({ color: 0xe8a33a, roughness: 0.4, clearcoat: 0.6 })); pack.position.y = 0.39; b.add(pack);
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshStandardMaterial({ map: labelTexture('효모', '드라이 이스트', '#7a4a10'), roughness: 0.8 })); tag.position.set(0, 0.42, 0.052); b.add(tag);
  b.rotation.x = -0.25; b.traverse((o) => { o.userData.noFrame = true; }); return b;
}

// cups: 컵마다 물 조건 번호(0 찬물 · 1 따뜻한 물 · 2 뜨거운 물). 실험실은 [1] 하나, 장면은 [0, 1, 2] 셋
export function buildBreadRig({ cups = [0, 1, 2], props = true } = {}) {
  const g = new THREE.Group(), n = cups.length, GAP = 1.9;
  const table = labTable(n > 1 ? 6.6 : 5.6, 3.2); g.add(table);
  const tray = labTray(n > 1 ? 5.6 : 2.4, 2.0); tray.position.set(0, 0, 0.05); g.add(tray);
  const list = cups.map((w, i) => { const c = doughCup(); c.position.set((i - (n - 1) / 2) * GAP, 0.025, 0); c.rotation.y = 0.12; g.add(c); return c; });
  const timer = kitchenTimer(); timer.position.set(n > 1 ? 2.95 : 1.4, 0, n > 1 ? 0.95 : 0.55); g.add(timer);
  const extra = [];
  if (props) {
    const flour = flourBag(); flour.position.set(n > 1 ? -3.0 : -1.9, 0, -1.05); flour.rotation.y = 0.35; g.add(flour);
    const sugar = sugarBowl(); sugar.position.set(n > 1 ? 3.0 : 1.85, 0, -0.95); g.add(sugar);
    const yeast = yeastPack(); yeast.position.set(n > 1 ? -2.85 : -1.65, 0, 0.75); yeast.rotation.y = 0.5; g.add(yeast);
    extra.push(flour, sugar, yeast);
  }
  const tags = list.map((c, i) => { const t = label((n > 1 ? TAG : SHORT)[cups[i]], { size: 0.2 }); t.position.set(c.position.x, 0.16, 0.98); g.add(t); return t; });
  const names = { dough: label('반죽(처음 200 mL)', { size: 0.22 }), holes: label('기체가 만든 구멍', { size: 0.22 }) };
  const last = list[n - 1].position.x; names.dough.position.set(last + R + (n > 1 ? 1.15 : 0.95), 1.95, 0.2); names.holes.position.set(-(n > 1 ? last : 0) - R - 0.95, 0.55, 0.3);
  for (const x of Object.values(names)) g.add(x);
  const S = { min: 0, waters: cups.slice(), t: 0 };
  let tagKey = '';
  const draw = () => {
    list.forEach((c, i) => { const w = WATERS[S.waters[i]], v = volAt(w, S.min); c.userData.setVol(v, clamp01((v - START) / (MAX_VOL - START))); });
    timer.userData.setMin(S.min);
    const key = S.waters.join(); if (key !== tagKey) { tagKey = key; tags.forEach((t, i) => relabel(t, (n > 1 ? TAG : SHORT)[S.waters[i]], { size: 0.2 })); }
    const top = Math.max(...S.waters.map((w) => volAt(WATERS[w], S.min)));
    relabel(names.dough, S.min > 0 ? `${S.min < MINUTES ? `${Math.round(S.min)}분 지남` : '40분 뒤'}` : '반죽(처음 200 mL)', { size: 0.22 });
    names.dough.position.y = Math.min(2.25, top * K + 0.35);
    names.dough.visible = n === 1;   // 세 컵 장면은 컵마다 이름표가 있어 덮지 않게 뺀다
    names.holes.visible = top > START + 40;
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, names, tags, cups: list, props: extra, timer };
  return g;
}

// 효모 확대 그림: 남색 원판(현미경 시야) 위에 효모 세포 · 혹처럼 돋은 싹(출아) · 떠오르는 이산화탄소 기체 방울
export function buildYeastView() {
  const g = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.75, 96), new THREE.MeshStandardMaterial({ color: 0x1d2f52, roughness: 0.9 })); disc.position.set(0, 1.55, -0.3); g.add(disc);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.07, 16, 96), new THREE.MeshPhysicalMaterial({ color: 0xc9ced8, metalness: 0.7, roughness: 0.25 })); rim.position.copy(disc.position); g.add(rim);
  const cellMat = new THREE.MeshPhysicalMaterial({ color: 0xf5e2b8, roughness: 0.45, clearcoat: 0.6, sheen: 0.5, sheenColor: new THREE.Color(0xffffff) });
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xc58a3e, roughness: 0.7, transparent: true, opacity: 0.55 });
  const cells = [], CELLS = [[-0.95, 2.25, 0.34, 0.6], [0.15, 2.45, 0.3, -0.4], [0.95, 1.85, 0.36, 0.9], [-0.55, 1.2, 0.33, 0.2], [0.45, 0.95, 0.31, -0.8], [-1.15, 0.7, 0.26, 1.2], [1.2, 0.9, 0.24, 0.3]];
  CELLS.forEach(([x, y, r, a], i) => {
    const c = new THREE.Group(); c.position.set(x, y, 0); c.rotation.z = a;
    const body = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 28), cellMat); body.scale.set(1, 1.25, 0.8); c.add(body);
    const core = new THREE.Mesh(new THREE.SphereGeometry(r * 0.32, 20, 14), coreMat); core.position.set(r * 0.15, -r * 0.1, r * 0.45); c.add(core);
    if (i % 2 === 0) { const bud = new THREE.Mesh(new THREE.SphereGeometry(r * 0.45, 28, 18), cellMat); bud.position.set(0, r * 1.38, 0); bud.userData.grow = r * 0.45; c.add(bud); c.userData.bud = bud; }
    g.add(c); cells.push(c);
  });
  const gas = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 20, 14), fresnel(new THREE.MeshPhysicalMaterial({ color: 0xe8f4ff, roughness: 0.05, transparent: true, opacity: 0.14, clearcoat: 1, depthWrite: false }), { edge: 0.85, pow: 1.6 }), 34);
  gas.renderOrder = 5; g.add(gas);
  const names = { cell: label('효모(지름 약 0.005 mm)', { size: 0.2 }), bud: label('혹처럼 돋은 싹 → 떨어져 새 효모', { size: 0.2 }), gas: label('이산화탄소 기체', { size: 0.2 }) };
  names.cell.position.set(-2.3, 2.55, 0.3); names.bud.position.set(2.15, 2.75, 0.3); names.gas.position.set(2.35, 1.2, 0.3);
  for (const x of Object.values(names)) g.add(x);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  const set = ({ t = 0, bud = 1 } = {}) => {
    cells.forEach((c, i) => { c.rotation.y = Math.sin(t * 0.4 + i) * 0.25; if (c.userData.bud) c.userData.bud.scale.setScalar(0.35 + 0.65 * clamp01(bud)); });
    for (let i = 0; i < 34; i++) { const life = (t * 0.12 + i / 34) % 1, y = lerp(0.2, 2.9, life), half = Math.sqrt(Math.max(0, 1.5 ** 2 - (y - 1.55) ** 2)), x = Math.sin(i * 2.1) * half + Math.sin(t + i) * 0.04, r = 0.05 + (i % 5) * 0.025;
      P.set(x, y, 0.35 + (i % 3) * 0.1); SC.setScalar(r * (0.6 + life * 0.6)); M.compose(P, Q, SC); gas.setMatrixAt(i, M); }
    gas.instanceMatrix.needsUpdate = true;
  };
  set();
  g.userData = { set, names };
  return g;
}

export default {
  view: { theta: 0.22, phi: 1.22 }, revealAt: 2,
  frame: [[-2.9, -0.2, -0.8], [2.9, 2.4, 1.0]],
  build(kit, world) { world.add('rig', buildBreadRig()); const v = buildYeastView(); v.rotation.y = 0.22; world.add('yeast', v); return {}; },
  beats: [
    { text: '같은 양의 밀가루·설탕·효모에 찬물·따뜻한 물(40 ℃)·뜨거운 물(70 ℃)을 각각 넣어 반죽하고, 눈금 컵에 200 mL씩 담아 랩을 씌웠어요.', show: ['rig'], hide: ['yeast'], dur: 6,
      reset(o) { o.rig.userData.set({ min: 0, t: 0 }); },
      anim(p, o) { o.rig.userData.set({ min: 0, t: p * 6 }); } },
    { text: '세 컵을 따뜻한 곳에 40분 두면 반죽은 어떻게 될까요? 어느 반죽이 가장 많이 부풀지 먼저 예상해요.', show: ['rig'], dur: 5,
      anim(p, o) { o.rig.userData.set({ t: 6 + p * 5 }); } },
    { text: '40분 뒤, 따뜻한 물로 만든 반죽은 두 배(400 mL)로 부풀고, 찬물 반죽은 조금 부풀었어요. 뜨거운 물 반죽은 그대로예요.', show: ['rig'], dur: 9,
      anim(p, o) { o.rig.userData.set({ min: p * MINUTES, t: 11 + p * 9 }); } },
    { text: '반죽 속을 현미경으로 크게 보면 효모가 살고 있어요. 효모는 설탕을 먹고 이산화탄소 기체를 내놓고, 몸에 혹처럼 돋은 싹이 떨어져 수가 늘어나요(출아법).', show: ['yeast'], hide: ['rig'], dur: 9,
      anim(p, o) { o.yeast.userData.set({ t: p * 9, bud: p }); } },
    { text: '기체가 반죽 속에 갇혀 부풀어요. 효모는 따뜻할 때 가장 활발하고, 너무 뜨거우면 죽어 기체를 만들지 못해요.', show: ['rig'], hide: ['yeast'], dur: 7,
      anim(p, o) { o.rig.userData.set({ min: MINUTES, t: 20 + p * 7 }); } },
  ],
};
