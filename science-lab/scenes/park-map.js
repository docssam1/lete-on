// 자연관찰 공원 지도 — 자연관찰대회 폴더의 첫 화면(원장 2026-10-25: 「두 캐릭터가 공원에 가는 것부터 3D로 전체 맵을 그리고,
// 점이 있는 말꼬리 표로 연못·꽃밭 같은 지점마다 내용이 나오게. 나무도 있고 하늘에 곤충도 날아다니고」).
// 지점(SPOTS)마다 연습 세트 하나. 대회처럼 두 사람이 한 팀(자연관찰캠프는 2인 1팀)으로 입구에서 광장까지 걸어 들어온다.
// 모양은 전부 원본 도형(구·원기둥·평면)이다. 좌표 단위 ≈ 1 m.
import { THREE, mat, sphere, cylinder, box, ease, clamp01, lerp } from './_kit.js';
import { rng, grassTex, canvasTex } from './_organic.js';

// 지점: 3D 위치(말꼬리 표가 붙는 곳) + 열 연습 세트. 대회 안내 게시판은 입구에 둔다.
// 지도 크기 ≈ 26 m × 22 m — 엔진의 카메라 거리 한도(40) 안에 폰 화면까지 들어오도록 절반으로 줄여 놓는다
export const SCALE = 0.5;
export const SPOTS = [
  { id: 'gate', at: [1.6, 2.2, 8.4], name: '공원 입구 · 안내판', short: '안내판', set: null, href: '#/contest/nature', icon: '📋' },
  { id: 'pond', at: [-5.2, 0.9, -2.2], name: '연못', short: '연못', set: 'observe-water', icon: '🪷' },
  { id: 'meadow', at: [5.6, 1.0, 4.2], name: '햇빛 드는 풀밭 · 큰 나무 그늘', short: '풀밭', set: 'observe-insects', icon: '🦗' },
  { id: 'flowers', at: [5.4, 1.0, -3.4], name: '꽃밭', short: '꽃밭', set: 'observe-leaves', icon: '🌼' },
  { id: 'leaves', at: [-1.2, 3.6, -7.2], name: '나무 아래 떨어진 잎', short: '떨어진 잎', set: 'observe-leafkey', icon: '🍂' },
  { id: 'garden', at: [-6.4, 1.1, 4.6], name: '텃밭 화분', short: '텃밭', set: 'observe-grow', icon: '🌱' },
  { id: 'picnic', at: [8.2, 1.3, -0.2], name: '쉼터 탁자 · 남은 도시락', short: '쉼터', set: 'observe-mold', icon: '🥪' },
];

const R = rng(7);
const G = (x, z) => new THREE.Vector3(x, 0, z);
// 오솔길: 입구(앞) → 광장(가운데) → 연못·꽃밭으로 갈라진다
const PATH = [G(0.6, 10), G(0.4, 7.5), G(-0.4, 5), G(0, 2.4), G(0.2, 0.4)];

function ribbon(points, width, color, y = 0.012) {
  const curve = new THREE.CatmullRomCurve3(points), n = 60, pos = [], idx = [];
  for (let i = 0; i <= n; i++) {
    const p = curve.getPoint(i / n), t = curve.getTangent(i / n), side = new THREE.Vector3(-t.z, 0, t.x).normalize().multiplyScalar(width / 2);
    pos.push(p.x + side.x, y, p.z + side.z, p.x - side.x, y, p.z - side.z);
    if (i < n) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat(color, { roughness: 1, side: THREE.DoubleSide })); m.receiveShadow = true; return m;
}

function tree({ h = 3.2, r = 1.5, trunk = 0x7a5a3a, leaf = 0x4f8f3e, seed = 1 } = {}) {
  const g = new THREE.Group(), rr = rng(seed), t = cylinder(0.16, 0.24, h * 0.55, trunk, { roughness: 0.95 });
  t.position.y = h * 0.275; t.castShadow = true; g.add(t);
  for (let i = 0; i < 6; i++) {
    const a = rr() * Math.PI * 2, d = i ? r * 0.45 : 0, s = r * (i ? 0.62 + rr() * 0.25 : 0.85);
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), mat(new THREE.Color(leaf).offsetHSL((rr() - 0.5) * 0.04, 0, (rr() - 0.5) * 0.08), { roughness: 0.9 }));
    c.material.flatShading = true; c.position.set(Math.cos(a) * d, h * 0.62 + rr() * r * 0.4, Math.sin(a) * d); c.castShadow = true; g.add(c);
  }
  return g;
}

function flower(color, rr) {
  const g = new THREE.Group(), h = 0.28 + rr() * 0.22, st = cylinder(0.012, 0.016, h, 0x4f8a3a, { seg: 6 }); st.position.y = h / 2; g.add(st);
  const pet = mat(color, { roughness: 0.6 });
  for (let k = 0; k < 5; k++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), pet); const a = (k / 5) * Math.PI * 2; p.scale.set(1, 0.4, 1); p.position.set(Math.cos(a) * 0.06, h, Math.sin(a) * 0.06); g.add(p); }
  const c = sphere(0.035, 0xf3c623, { seg: 8 }); c.position.y = h + 0.01; g.add(c);
  const lf = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), mat(0x5a9a3e)); lf.scale.set(1.6, 0.2, 0.7); lf.position.set(0.05, h * 0.4, 0); g.add(lf);
  return g;
}

// 날개 두 장이 펄럭이는 곤충(나비·잠자리) — 경로는 리사주 곡선
function flyer(kind) {
  const g = new THREE.Group(), body = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, kind === 'dragonfly' ? 0.34 : 0.12, 4, 8), mat(kind === 'dragonfly' ? 0x2e6f8f : 0x3a2a1a));
  body.rotation.z = Math.PI / 2; g.add(body);
  const wc = kind === 'dragonfly' ? 0xd9eef7 : kind === 'yellow' ? 0xf2d14c : 0xf09a3e;
  const wm = new THREE.MeshStandardMaterial({ color: wc, side: THREE.DoubleSide, transparent: kind === 'dragonfly', opacity: kind === 'dragonfly' ? 0.55 : 1, roughness: 0.6 });
  const wings = [];
  for (const s of [-1, 1]) {
    const piv = new THREE.Group(), w = new THREE.Mesh(kind === 'dragonfly' ? new THREE.PlaneGeometry(0.1, 0.32) : new THREE.CircleGeometry(0.11, 12), wm);
    w.position.z = s * (kind === 'dragonfly' ? 0.17 : 0.1); w.rotation.x = -Math.PI / 2; piv.add(w); g.add(piv); wings.push([piv, s]);
  }
  g.userData.flap = (t, speed) => wings.forEach(([p, s]) => { p.rotation.x = s * Math.sin(t * speed) * 0.9; });
  return g;
}

// 두 아이(탐구 짝): 몸·머리·머리카락·가방·두 다리. walk(phase)로 다리를 흔든다
function kid({ shirt, hair, hat = false, bag = 0x3f6fb0 }) {
  const g = new THREE.Group(), skin = 0xf3d2b3;
  const legs = [];
  for (const s of [-1, 1]) {
    const piv = new THREE.Group(); piv.position.set(0, 0.42, s * 0.07);
    const leg = cylinder(0.05, 0.05, 0.42, 0x34405a); leg.position.y = -0.21; piv.add(leg);
    const shoe = box(0.14, 0.06, 0.09, 0xf5f2ea); shoe.position.set(0.03, -0.42, 0); piv.add(shoe);
    g.add(piv); legs.push([piv, s]);
  }
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.26, 4, 12), mat(shirt, { roughness: 0.7 })); body.position.y = 0.62; g.add(body);
  const head = sphere(0.16, skin); head.position.y = 0.98; g.add(head);
  const hr = new THREE.Mesh(new THREE.SphereGeometry(0.168, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), mat(hair)); hr.position.y = 1.0; hr.rotation.z = 0.2; g.add(hr);
  if (hat) { const brim = cylinder(0.24, 0.24, 0.02, 0xe9d38a); brim.position.y = 1.09; const top = cylinder(0.14, 0.16, 0.12, 0xe9d38a); top.position.y = 1.15; g.add(brim, top); }
  for (const s of [-1, 1]) { const e = sphere(0.018, 0x222222); e.position.set(0.15, 1.0, s * 0.055); g.add(e); }
  const pack = box(0.12, 0.26, 0.22, bag); pack.position.set(-0.17, 0.66, 0); g.add(pack);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData.walk = (ph, on) => { legs.forEach(([p, s]) => { p.rotation.z = on ? s * Math.sin(ph) * 0.5 : 0; }); body.position.y = 0.62 + (on ? Math.abs(Math.sin(ph)) * 0.025 : 0); };
  return g;
}

export function buildPark(root) {
  const world = new THREE.Group(); world.scale.setScalar(SCALE); root.add(world);
  // 땅(잔디)·바깥 울타리
  const gt = grassTex('park:grass', '#7fb85a', '#b9d98a'); gt.repeat.set(8, 6);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(26, 22), new THREE.MeshStandardMaterial({ map: gt, color: 0xa9d07f, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; world.add(ground);
  world.add(ribbon(PATH, 1.3, 0xe3d3b0));
  world.add(ribbon([G(0.2, 0.4), G(-1.5, -0.6), G(-3.2, -1.3)], 1.0, 0xe3d3b0, 0.013));
  world.add(ribbon([G(0.2, 0.4), G(1.8, -1), G(3.6, -2.2)], 1.0, 0xe3d3b0, 0.013));
  world.add(ribbon([G(0.2, 0.4), G(3, 0.3), G(6.4, -0.1)], 1.0, 0xe3d3b0, 0.013));
  world.add(ribbon([G(-0.2, 3), G(-2.8, 4), G(-5.2, 4.4)], 0.9, 0xe3d3b0, 0.013));
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), mat(0xe8dbbd, { roughness: 1 })); plaza.rotation.x = -Math.PI / 2; plaza.position.set(0.2, 0.014, 0.4); plaza.receiveShadow = true; world.add(plaza);

  // 입구: 기둥 두 개 + 가로 간판 + 안내판
  for (const x of [-0.6, 1.8]) { const p = cylinder(0.09, 0.09, 2.1, 0x8a6a46); p.position.set(x, 1.05, 9.2); p.castShadow = true; world.add(p); }
  const signTex = canvasTex('park:sign', 512, 96, (c) => { c.fillStyle = '#f5ecd7'; c.fillRect(0, 0, 512, 96); c.fillStyle = '#3b5a2c'; c.font = 'bold 54px Pretendard, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('자연관찰 공원', 256, 52); });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.48, 0.08), [mat(0x8a6a46), mat(0x8a6a46), mat(0x8a6a46), mat(0x8a6a46), new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.8 }), mat(0x8a6a46)]);
  sign.position.set(0.6, 2.0, 9.2); sign.castShadow = true; world.add(sign);
  const board = box(0.9, 0.62, 0.06, 0xf1e7cf); board.position.set(2.4, 1.2, 8.3); board.rotation.y = -0.5; world.add(board);
  const bl = cylinder(0.04, 0.04, 0.9, 0x8a6a46); bl.position.set(2.4, 0.45, 8.3); world.add(bl);

  // 연못: 물·가장자리 돌·연잎·갈대
  const pond = new THREE.Mesh(new THREE.CircleGeometry(2.4, 48), new THREE.MeshStandardMaterial({ color: 0x5f9fc4, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.88 }));
  pond.rotation.x = -Math.PI / 2; pond.scale.set(1.35, 1, 1); pond.position.set(-5.2, 0.02, -2.2); world.add(pond);
  for (let i = 0; i < 34; i++) { const a = (i / 34) * Math.PI * 2, s = 0.14 + R() * 0.12, st = sphere(s, 0x9a948a); st.scale.y = 0.6; st.position.set(-5.2 + Math.cos(a) * 3.3, 0.05, -2.2 + Math.sin(a) * 2.45); world.add(st); }
  for (let i = 0; i < 9; i++) {
    const pad = new THREE.Mesh(new THREE.CircleGeometry(0.28 + R() * 0.14, 20, 0.35, Math.PI * 2 - 0.35), mat(0x4f9a43, { side: THREE.DoubleSide }));
    pad.rotation.set(-Math.PI / 2, 0, R() * 6); pad.position.set(-5.2 + (R() - 0.5) * 4.6, 0.035, -2.2 + (R() - 0.5) * 3); world.add(pad);
  }
  for (let k = 0; k < 2; k++) { const fl = flower(0xf2a9c4, R); fl.scale.setScalar(1.6); fl.position.set(-4.6 - k * 1.4, -0.36, -1.6 - k * 0.8); world.add(fl); }
  for (let i = 0; i < 26; i++) { const h = 0.5 + R() * 0.6, rd = cylinder(0.012, 0.018, h, 0x6c8f3a, { seg: 6 }); rd.position.set(-8 + R() * 0.8, h / 2, -3.6 + R() * 2.6); rd.rotation.z = (R() - 0.5) * 0.3; world.add(rd); }

  // 꽃밭: 흙 상자 + 꽃
  const bed = box(3.4, 0.22, 2.2, 0x7a5a3a); bed.position.set(5.2, 0.11, -3.4); bed.receiveShadow = true; world.add(bed);
  const rim = box(3.6, 0.18, 2.4, 0xd9cdb4); rim.position.set(5.2, 0.06, -3.4); world.add(rim);
  const cols = [0xf2c14e, 0xe86f6f, 0xf4f1ea, 0xb98ad9, 0xf29b3a];
  for (let i = 0; i < 42; i++) { const f = flower(cols[i % cols.length], R); f.position.set(5.2 + (R() - 0.5) * 3.1, 0.22, -3.4 + (R() - 0.5) * 1.9); world.add(f); }

  // 큰 나무(그늘) + 풀밭(햇빛) — 곤충 두 장소
  const big = tree({ h: 4.2, r: 2.1, seed: 3 }); big.position.set(7.4, 0, 6.4); world.add(big);
  const shade = new THREE.Mesh(new THREE.CircleGeometry(2.2, 32), mat(0x5f7d3e, { roughness: 1 })); shade.rotation.x = -Math.PI / 2; shade.position.set(7.4, 0.011, 6.4); world.add(shade);
  const blade = new THREE.PlaneGeometry(0.05, 1, 1, 2); blade.translate(0, 0.5, 0);
  const grass = new THREE.InstancedMesh(blade, new THREE.MeshStandardMaterial({ map: grassTex('park:blade', '#8cc35a', '#d8e89a'), side: THREE.DoubleSide }), 520);
  const d = new THREE.Object3D(), col = new THREE.Color();
  for (let i = 0; i < 520; i++) {
    const inShade = i < 160, a = R() * Math.PI * 2, r = Math.sqrt(R()) * (inShade ? 2 : 2.2);
    const x = inShade ? 7.4 + Math.cos(a) * r : 4.6 + Math.cos(a) * r * 1.2, z = inShade ? 6.4 + Math.sin(a) * r : 2.6 + Math.sin(a) * r * 0.9;
    d.position.set(x, 0, z); d.rotation.set((R() - 0.5) * 0.4, R() * 3, 0); d.scale.set(1, inShade ? 0.25 + R() * 0.15 : 0.32 + R() * 0.2, 1); d.updateMatrix(); grass.setMatrixAt(i, d.matrix);
    grass.setColorAt(i, col.setHSL(inShade ? 0.11 : 0.24, 0.5, 0.42 + R() * 0.25));
  }
  world.add(grass);

  // 뒤쪽 나무 줄(떨어진 잎) — 잎 재기
  const back = [[-4, -7.6, 0x4f8f3e, 3.4], [-1.2, -8.2, 0x5f9a46, 3.8], [1.8, -7.8, 0xc9774f, 3.2], [4.6, -8.4, 0x4a8a3e, 3.6], [-7.6, -6.6, 0x5a9446, 3]];
  back.forEach(([x, z, c, h], i) => { const t = tree({ h, r: 1.3 + (i % 2) * 0.3, leaf: c, seed: 10 + i }); t.position.set(x, 0, z); world.add(t); });
  const fall = new THREE.InstancedMesh(new THREE.CircleGeometry(0.09, 7), mat(0xb98a4a, { side: THREE.DoubleSide }), 70);
  for (let i = 0; i < 70; i++) { d.position.set(-3.5 + R() * 7, 0.02, -8.2 + R() * 2.2); d.rotation.set(-Math.PI / 2, 0, R() * 6); d.scale.set(1, 1.6, 1); d.updateMatrix(); fall.setMatrixAt(i, d.matrix); fall.setColorAt(i, col.setHSL(0.06 + R() * 0.07, 0.6, 0.4 + R() * 0.15)); }
  world.add(fall);
  // 옆 나무들
  [[-9.5, 2, 3], [9.6, 4.5, 3.4], [9.8, -5.6, 3], [-9.2, 7.6, 2.8], [6.8, 8.2, 3.1]].forEach(([x, z, h], i) => { const t = tree({ h, r: 1.2, seed: 30 + i }); t.position.set(x, 0, z); world.add(t); });

  // 텃밭 화분 세 개(강낭콩)
  const plot = box(2.6, 0.08, 1.4, 0xc9b48c); plot.position.set(-6.4, 0.04, 4.6); world.add(plot);
  [-0.8, 0, 0.8].forEach((dx, i) => {
    const pot = cylinder(0.26, 0.2, 0.36, 0xc0653a); pot.position.set(-6.4 + dx, 0.26, 4.6); pot.castShadow = true; world.add(pot);
    const h = [0.7, 0.9, 0.5][i], stem = cylinder(0.015, 0.02, h, 0x5f9a3a); stem.position.set(-6.4 + dx, 0.44 + h / 2, 4.6); world.add(stem);
    for (let k = 0; k < 3; k++) { const lf = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), mat(0x5aa246)); lf.scale.set(1.5, 0.25, 1); lf.position.set(-6.4 + dx + (k - 1) * 0.12, 0.5 + h * (0.45 + k * 0.25), 4.6 + (k % 2 ? 0.08 : -0.08)); world.add(lf); }
  });

  // 쉼터 탁자 + 의자 + 도시락
  const top = box(1.8, 0.08, 0.9, 0xb08b5a); top.position.set(8.2, 0.74, -0.2); top.castShadow = true; world.add(top);
  for (const [x, z] of [[-0.75, -0.35], [0.75, -0.35], [-0.75, 0.35], [0.75, 0.35]]) { const l = box(0.08, 0.72, 0.08, 0x8a6a46); l.position.set(8.2 + x, 0.36, -0.2 + z); world.add(l); }
  for (const s of [-1, 1]) { const b = box(1.8, 0.06, 0.3, 0xb08b5a); b.position.set(8.2, 0.44, -0.2 + s * 0.75); world.add(b); }
  const lunch = box(0.36, 0.1, 0.26, 0x7fb3d5); lunch.position.set(8.0, 0.83, -0.2); world.add(lunch);
  const bread = box(0.2, 0.06, 0.18, 0xe9c98f); bread.position.set(8.4, 0.81, -0.1); world.add(bread);
  const orange = sphere(0.07, 0xf29b3a); orange.position.set(8.55, 0.85, -0.35); world.add(orange);

  // 하늘의 곤충: 나비(꽃밭)·잠자리(연못)·나비 한 마리 더(풀밭)
  const flyers = [
    { o: flyer('orange'), c: [5.2, 1.4, -3.4], r: [1.4, 0.4, 0.9], w: [0.7, 1.3, 0.9], sp: 22 },
    { o: flyer('yellow'), c: [4.6, 1.8, -2.8], r: [1.2, 0.5, 1.1], w: [0.55, 1.1, 0.8], sp: 24 },
    { o: flyer('dragonfly'), c: [-5.2, 1.3, -2.2], r: [2.4, 0.3, 1.6], w: [0.45, 0.9, 0.6], sp: 60 },
    { o: flyer('dragonfly'), c: [-4.4, 1.7, -1.4], r: [1.8, 0.4, 1.4], w: [0.5, 0.8, 0.7], sp: 64 },
    { o: flyer('yellow'), c: [4.8, 1.2, 2.8], r: [1.6, 0.5, 1.2], w: [0.6, 1.2, 0.75], sp: 20 },
  ];
  flyers.forEach((f) => { f.o.scale.setScalar(2.4); world.add(f.o); });

  // 두 아이
  const kids = [kid({ shirt: 0xe36b5a, hair: 0x2b1d14, hat: true, bag: 0x3f6fb0 }), kid({ shirt: 0x4f9a8a, hair: 0x4a2e1c, bag: 0xd9a441 })];
  kids.forEach((k) => { k.scale.setScalar(1.7); world.add(k); });
  const walkCurve = new THREE.CatmullRomCurve3(PATH);
  let walkT = 0;
  const place = (u, ph, on) => {
    kids.forEach((k, i) => {
      const uu = clamp01(u - i * 0.05), p = walkCurve.getPoint(uu), tg = walkCurve.getTangent(uu), side = new THREE.Vector3(-tg.z, 0, tg.x).normalize();
      k.position.copy(p).addScaledVector(side, (i ? -0.32 : 0.32)); k.rotation.y = Math.atan2(-tg.z, tg.x);
      k.userData.walk(ph + i * Math.PI, on);
    });
  };
  place(0, 0, false);

  return {
    world, kids,
    // 걸어 들어오기: 0 → 1 (약 6초). 끝나면 둘이 광장에서 서로 마주 본다
    walk(t) { walkT = t; },
    update(dt, t) {
      flyers.forEach((f, i) => { f.o.position.set(f.c[0] + Math.sin(t * f.w[0] + i) * f.r[0], f.c[1] + Math.sin(t * f.w[1] + i * 2) * f.r[1], f.c[2] + Math.cos(t * f.w[2] + i) * f.r[2]); f.o.rotation.y = -t * f.w[0] - i; f.o.userData.flap(t, f.sp); });
      const u = ease.io(clamp01(walkT)), on = walkT > 0 && walkT < 1;
      place(u * 0.97, t * 9, on);
      if (walkT >= 1) { kids[0].rotation.y = lerp(kids[0].rotation.y, -Math.PI / 2 + 0.6, 0.1); kids[1].rotation.y = lerp(kids[1].rotation.y, -Math.PI / 2 - 0.6, 0.1); }
    },
  };
}
