import { THREE, label, roundedBoxGeometry, clamp01, lerp } from './_kit.js';
import { labTable, woodTexture, thickGlass } from './glassware.js';
import { MATERIALS, TESTS, materialResult } from './material-model.js';
export { MATERIALS, TESTS, materialResult };
// 같은 모양 막대 네 개(3-2 Ⅰ 물체와 물질) — 모양·크기가 같고 물질만 다른 금속·플라스틱·나무·고무 막대를 같은 방법으로 시험한다.
// 시험: 비춰 보기(뒤 줄무늬 판) · 눌러 보기(뾰족한 누름쇠) · 구부려 보기(받침 두 개 + 가운데 누름판) · 물에 넣기(앞쪽 물통).
// 움직임의 크기는 scenes/material-model.js 의 「이 모형의 막대」 값이다.
const GAP = 1.15, LEN = 0.95, T = 0.13, SEG = 12, REST_Y = 0.3, TANK_Z = 1.05, WATER_Y = 0.42, TANK_FLOOR = 0.07;
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const bell = (p) => Math.sin(Math.PI * clamp01(p));

function stripeTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#fbfaf6'; g.fillRect(0, 0, 512, 128);
  for (let x = 0; x < 512; x += 32) { g.fillStyle = (x / 32) % 2 ? '#5b8fd9' : '#e9b949'; g.fillRect(x, 0, 14, 128); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.set(2.4, 1); return t;
}
function barMaterial(m) {
  if (m === '금속') return new THREE.MeshPhysicalMaterial({ color: 0xb9c0c8, metalness: 0.92, roughness: 0.28, clearcoat: 0.3 });
  if (m === '플라스틱') return new THREE.MeshPhysicalMaterial({ color: 0x9cc9f5, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.5, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false, emissive: 0x2a5d9a, emissiveIntensity: 0.12 });
  if (m === '나무') { const tex = woodTexture(); return new THREE.MeshStandardMaterial({ map: tex, color: 0xd9a066, roughness: 0.7 }); }
  return new THREE.MeshStandardMaterial({ color: 0x3b3a3f, roughness: 0.92 });   // 고무
}
// 막대 한 개 = 마디 SEG개(휘거나 눌릴 때 마디마다 따로 움직인다)
function bar(m) {
  const g = new THREE.Group(), mat = barMaterial(m), w = LEN / SEG;
  const segs = Array.from({ length: SEG }, (_, i) => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, T, T), mat); s.position.x = -LEN / 2 + w * (i + 0.5); g.add(s);
    if (m === '플라스틱') s.renderOrder = 5;
    return s;
  });
  if (m === '플라스틱') {   // 투명한 막대도 모양이 보이게 겉 테두리(마디 사이 선 없이 한 덩어리)
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(LEN, T, T)), new THREE.LineBasicMaterial({ color: 0x3f7fc8, transparent: true, opacity: 0.85 }));
    g.add(edge); g.userData.edge = edge;
  }
  // 눌린 자국(나무는 남는다)
  const dent = new THREE.Mesh(new THREE.CircleGeometry(0.03, 24), new THREE.MeshBasicMaterial({ color: 0x4a2e14, transparent: true, opacity: 0, depthWrite: false }));
  dent.rotation.x = -Math.PI / 2; dent.position.y = T / 2 + 0.002; g.add(dent);
  g.userData = { segs, dent, m, edge: g.userData.edge };
  return g;
}
function presser(pointed) {
  const g = new THREE.Group(), steel = new THREE.MeshStandardMaterial({ color: 0x8e99a8, metalness: 0.7, roughness: 0.35 });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 16), steel); rod.position.y = 0.32; g.add(rod);
  const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 32), new THREE.MeshStandardMaterial({ color: 0xc2581c, roughness: 0.45 })); weight.position.y = 0.6; g.add(weight);
  const tip = pointed ? new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 24), steel) : new THREE.Mesh(roundedBoxGeometry(0.14, 0.05, 0.16, 0.015), steel);
  if (pointed) { tip.rotation.x = Math.PI; tip.position.y = 0.045; } else tip.position.y = 0.025;
  g.add(tip); g.visible = false; return g;
}

export function buildMaterialBench({ letters = true } = {}) {
  const g = new THREE.Group();
  const table = labTable(5.6, 3.2); table.position.z = 0.35; g.add(table);
  // 뒤 줄무늬 판(비춰 보기용)
  const board = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 0.95), new THREE.MeshStandardMaterial({ map: stripeTexture(), roughness: 0.8 }));
  board.position.set(0, 0.6, -0.55); g.add(board);
  const boardFrame = new THREE.Mesh(roundedBoxGeometry(5.0, 1.05, 0.05, 0.02), new THREE.MeshStandardMaterial({ color: 0xe9e3d6, roughness: 0.8 })); boardFrame.position.set(0, 0.6, -0.585); g.add(boardFrame);
  // 물통(앞쪽, 네 막대가 함께 들어간다)
  const tank = new THREE.Group(); tank.position.z = TANK_Z; g.add(tank);
  const glass = new THREE.Mesh(roundedBoxGeometry(4.7, 0.52, 0.5, 0.03), thickGlass(0xeef6f8, 0.1)); glass.position.y = 0.26; glass.renderOrder = 7; tank.add(glass);
  const water = new THREE.Mesh(new THREE.BoxGeometry(4.6, WATER_Y - 0.02, 0.42), new THREE.MeshPhysicalMaterial({ color: 0x7cc0e6, roughness: 0.1, transparent: true, opacity: 0.38, depthWrite: false }));
  water.position.y = 0.02 + (WATER_Y - 0.02) / 2; water.renderOrder = 6; tank.add(water);
  const floor = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.02, 0.42), new THREE.MeshStandardMaterial({ color: 0xdfe8ee, roughness: 0.6 })); floor.position.y = 0.05; tank.add(floor);
  const stands = [], bars = [], pins = [], pads = [], tags = [];
  MATERIALS.forEach((m, i) => {
    const x = (i - 1.5) * GAP;
    const st = new THREE.Group(); st.position.x = x; g.add(st);
    for (const sx of [-0.36, 0.36]) { const b = new THREE.Mesh(roundedBoxGeometry(0.1, REST_Y - T / 2, 0.22, 0.02), new THREE.MeshStandardMaterial({ color: 0x9aa7b4, roughness: 0.5 })); b.position.set(sx, (REST_Y - T / 2) / 2, 0); st.add(b); }
    const b = bar(m); b.position.set(x, REST_Y, 0); g.add(b); bars.push(b);
    const pin = presser(true), pad = presser(false); pin.position.set(x, REST_Y + T / 2, 0); pad.position.set(x, REST_Y + T / 2, 0); g.add(pin, pad); pins.push(pin); pads.push(pad);
    stands.push(st);
    if (letters) { const t = label(m, { size: 0.17 }); t.position.set(x, i % 2 ? 1.06 : 1.3, -0.4); g.add(t); tags.push(t); }   // 높이를 엇갈려 폰에서도 이웃 이름표가 겹치지 않게
  });
  const S = { test: -1, p: 0, t: 0, done: [] };
  // 막대 모양: bend(가운데 처짐) · dent(가운데 눌림) · stand(세우기 0→1) · lift(물통 쪽으로 옮기기 0→1) · drop(물속 깊이 0→1)
  const pose = (b, o) => {
    const { segs, dent } = b.userData, x0 = b.position.x;
    const stand = o.stand || 0, lift = o.lift || 0, drop = o.drop || 0, float = o.float;
    // 위치: 받침 위 → (세우기) 받침 앞에 세움 → (옮기기) 물통 위 → (넣기) 물속
    const yWater = float ? WATER_Y - T * 0.35 : TANK_FLOOR + T / 2 + 0.01;
    const yAir = WATER_Y + 0.42;
    const y = lift > 0 ? lerp(lerp(REST_Y, yAir, smooth(0, 0.5, lift)), yWater, drop) : REST_Y + stand * (LEN / 2 - REST_Y + 0.04);
    const z = lift > 0 ? lerp(0, TANK_Z, smooth(0.2, 1, lift)) : stand * 0.18;
    b.position.set(x0, y + (float && drop >= 1 ? Math.sin(S.t * 2.2 + x0) * 0.006 : 0), z);
    b.rotation.set(0, 0, stand * Math.PI / 2);
    segs.forEach((s, i) => {
      const u = (s.position.x / (LEN / 2)), sag = -(o.bend || 0) * (1 - u * u), slope = (o.bend || 0) * 2 * u / (LEN / 2);
      const near = Math.max(0, 1 - Math.abs(s.position.x) / (LEN / SEG * 1.2)), squash = (o.dent || 0) * near;
      s.position.y = sag - squash * T * 0.35; s.rotation.z = Math.atan(slope); s.scale.y = 1 - squash * 0.55;
    });
    if (b.userData.edge) b.userData.edge.visible = !(o.bend > 0.003 || o.dent > 0.01);
    dent.material.opacity = o.mark || 0; dent.position.y = T / 2 + 0.002 - (o.dent || 0) * T * 0.35;
  };
  const draw = () => {
    const name = TESTS[S.test] ?? null, p = S.p;
    bars.forEach((b, i) => {
      const m = MATERIALS[i], r = name ? materialResult(name, m) : { v: 0 };
      const wood = m === '나무', keep = S.done.includes('눌러 보기') && wood;   // 나무 자국은 남는다
      pins[i].visible = name === '눌러 보기' && p > 0 && p < 1; pads[i].visible = name === '구부려 보기' && p > 0 && p < 1;
      let o = { mark: keep ? 0.55 : 0 };
      if (name === '비춰 보기') o = { ...o, stand: smooth(0, 0.45, p) - smooth(0.85, 1, p) * 0 };
      if (name === '눌러 보기') {
        const down = smooth(0.05, 0.45, p) - smooth(0.7, 0.95, p), dd = r.v * down;
        o = { ...o, dent: dd, mark: wood ? Math.max(o.mark, 0.55 * smooth(0.3, 0.45, p)) : o.mark };
        pins[i].position.y = REST_Y + T / 2 + 0.25 * (1 - smooth(0.05, 0.4, p)) + 0.25 * smooth(0.7, 0.95, p) - dd * T * 0.35;
      }
      if (name === '구부려 보기') {
        const down = smooth(0.05, 0.45, p) - smooth(0.7, 0.95, p), sag = 0.2 * r.v * down;
        o = { ...o, bend: sag };
        pads[i].position.y = REST_Y + T / 2 + 0.25 * (1 - smooth(0.05, 0.4, p)) + 0.25 * smooth(0.7, 0.95, p) - sag;
      }
      if (name === '물에 넣기') o = { ...o, lift: smooth(0, 0.5, p), drop: smooth(0.5, 0.9, p), float: r.v > 0.5 };
      pose(b, o);
    });
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, bars, tags, board, tank };
  return g;
}

export default {
  view: { theta: 0, phi: 1.02 }, revealAt: 2,
  frame: [[-2.4, 0, -0.6], [2.4, 1.3, 1.35]],
  build(kit, world) { world.add('bench', buildMaterialBench()); return {}; },
  beats: [
    { text: '모양과 크기가 똑같은 막대 네 개예요. 금속, 플라스틱, 나무, 고무 — 만든 물질만 달라요.', show: ['bench'], dur: 7,
      reset(o) { o.bench.userData.set({ test: -1, p: 0, done: [] }); },
      anim(p, o) { o.bench.userData.set({ t: p * 7 }); } },
    { text: '모양과 크기가 같으니 성질도 같을까요? 물에 넣으면 네 막대가 모두 같이 뜨거나 같이 가라앉을지 먼저 예상해요.', show: ['bench'], dur: 6,
      anim(p, o) { o.bench.userData.set({ t: 7 + p * 6 }); } },
    { text: '물에 넣었더니 나무 막대만 떴어요. 금속·플라스틱·고무 막대는 가라앉았어요.', show: ['bench'], dur: 8,
      reset(o) { o.bench.userData.set({ test: 3, p: 0, done: [] }); },
      anim(p, o) { o.bench.userData.set({ test: 3, p, t: 13 + p * 8 }); } },
    { text: '줄무늬 판 앞에 세우면 플라스틱 막대로만 줄무늬가 비쳐 보여요.', show: ['bench'], dur: 6,
      reset(o) { o.bench.userData.set({ test: 0, p: 0 }); },
      anim(p, o) { o.bench.userData.set({ test: 0, p: Math.min(1, p * 1.4), t: 21 + p * 6 }); } },
    { text: '같은 힘으로 가운데를 누르면 고무 막대가 가장 많이 휘고, 금속 막대는 거의 휘지 않아요. 같은 모양이어도 물질에 따라 성질이 달라요.', show: ['bench'], dur: 8,
      reset(o) { o.bench.userData.set({ test: 2, p: 0 }); },
      anim(p, o) { o.bench.userData.set({ test: 2, p: Math.min(0.6, p), t: 27 + p * 8 }); } },
  ],
};
