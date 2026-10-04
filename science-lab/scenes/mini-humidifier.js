import { THREE, mat, glassMat, label, roundedBoxGeometry } from './_kit.js';
// 미니 가습기(4-2 Ⅱ 물의 상태 변화) — 비커 위에 닿지 않게 매단 스테인리스 냉각판.
// 실험실 사진처럼: 따르개(주둥이)와 눈금이 있는 비커, 무쇠 받침·스탠드·조임쇠·손잡이, 판 위 얼음(차갑게), 판 아래 매달린 물방울.
// 화살표는 보이지 않는 수증기의 이동을 나타내는 모형 기호다(김·연기로 그리지 않는다 — 수증기는 기체라 안 보인다).
const R = 0.72, H = 1.65, PLATE_Y = 2.02, ROD_X = 1.62, SPOUT = -1.15, ROD_H = PLATE_Y + 0.32;   // SPOUT: 카메라에서 보아 왼쪽 앞

// 눈금 그림(투명 바탕에 흰 선·숫자). 비커 앞면에 붙인다.
function gradTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 512;
  const g = c.getContext('2d'); g.clearRect(0, 0, 256, 512);
  g.strokeStyle = 'rgba(255,255,255,.95)'; g.fillStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 5; g.font = 'bold 44px sans-serif'; g.textBaseline = 'middle';
  const top = 70, bot = 470;
  g.beginPath(); g.moveTo(70, top); g.lineTo(70, bot); g.stroke();
  for (let i = 0; i <= 10; i++) {
    const y = bot - (bot - top) * (i / 10), major = i % 2 === 0;
    g.beginPath(); g.moveTo(70, y); g.lineTo(major ? 130 : 105, y); g.stroke();
    if (major && i) g.fillText(i === 10 ? '250 mL' : String(i * 25), 140, y);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

export function buildHumidifier() {
  const g = new THREE.Group();
  // ── 비커: 두께 있는 유리(안·밖 벽 + 바닥)를 회전체로 ─────────────────────
  const T = 0.03, pts = [
    new THREE.Vector2(0, 0), new THREE.Vector2(R - 0.08, 0), new THREE.Vector2(R - 0.015, 0.02), new THREE.Vector2(R, 0.08),
    new THREE.Vector2(R, H), new THREE.Vector2(R - T, H), new THREE.Vector2(R - T, 0.1), new THREE.Vector2(R - 0.09, 0.05), new THREE.Vector2(0, 0.05),
  ];
  const glass = glassMat(0xeaf6ff, 0.26);
  const beaker = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), glass); g.add(beaker);
  // 테두리 + 따르개: 한 바퀴 관(튜브)인데 주둥이 쪽만 바깥으로 살짝 내민다
  const rimPts = [];
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2, d = Math.atan2(Math.sin(a - SPOUT), Math.cos(a - SPOUT)), bump = 0.1 * Math.exp(-((d / 0.22) ** 2));
    rimPts.push(new THREE.Vector3(Math.sin(a) * (R + 0.012 + bump), H + 0.012 + bump * 0.25, Math.cos(a) * (R + 0.012 + bump)));
  }
  const rim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPts, true), 192, 0.022, 10, true), glassMat(0xdcefff, 0.5)); g.add(rim);
  // 눈금: 카메라 쪽 앞면(조금 왼쪽)
  const grad = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.003, R + 0.003, H * 0.78, 32, 1, true, 0.05, 0.8),
    new THREE.MeshBasicMaterial({ map: gradTexture(), transparent: true, depthWrite: false, side: THREE.FrontSide }));
  grad.position.y = 0.12 + H * 0.39; g.add(grad);
  // ── 물: 기둥 + 살짝 밝은 수면 ────────────────────────────────────────────
  const water = new THREE.Mesh(new THREE.CylinderGeometry(R - T - 0.005, R - T - 0.005, 0.72, 64),
    new THREE.MeshPhysicalMaterial({ color: 0xa9d8ee, transparent: true, opacity: 0.55, roughness: 0.05, clearcoat: 1, depthWrite: false }));
  water.position.y = 0.05 + 0.36; g.add(water);
  const surf = new THREE.Mesh(new THREE.CircleGeometry(R - T - 0.005, 64), new THREE.MeshPhysicalMaterial({ color: 0xd8f0fb, transparent: true, opacity: 0.6, roughness: 0.02, clearcoat: 1, depthWrite: false }));
  surf.rotation.x = -Math.PI / 2; surf.position.y = 0.05 + 0.72 + 0.001; g.add(surf);
  // ── 스탠드: 무쇠 받침 · 막대 · 조임쇠(손잡이) · 팔 ──────────────────────────
  const iron = mat(0x2c3035, { roughness: 0.92, metalness: 0.2 }), steel = mat(0xb9c0c6, { roughness: 0.28, metalness: 0.9 });
  const base = new THREE.Mesh(roundedBoxGeometry(0.95, 0.13, 0.8, 0.04), iron); base.position.set(ROD_X + 0.12, 0.065, 0); g.add(base);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, ROD_H - 0.13, 20), steel); rod.position.set(ROD_X, 0.13 + (ROD_H - 0.13) / 2, 0); g.add(rod);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 20), steel); collar.position.set(ROD_X, 0.165, 0); g.add(collar);
  const boss = new THREE.Mesh(roundedBoxGeometry(0.17, 0.17, 0.17, 0.02), steel); boss.position.set(ROD_X, PLATE_Y + 0.02, 0); g.add(boss);
  const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 12), steel); screw.rotation.z = Math.PI / 2; screw.position.set(ROD_X + 0.17, PLATE_Y + 0.02, 0); g.add(screw);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.07, 18), mat(0x16191c, { roughness: 0.6 })); knob.rotation.z = Math.PI / 2; knob.position.set(ROD_X + 0.29, PLATE_Y + 0.02, 0); g.add(knob);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, ROD_X - 0.9, 14), steel); arm.rotation.z = Math.PI / 2; arm.position.set((ROD_X + 0.9) / 2, PLATE_Y + 0.02, 0); g.add(arm);
  const jaw = new THREE.Mesh(roundedBoxGeometry(0.12, 0.1, 0.12, 0.015), steel); jaw.position.set(0.95, PLATE_Y + 0.02, 0); g.add(jaw);
  // ── 냉각판: 스테인리스 원판 ──────────────────────────────────────────────
  const plateMat = mat(0xc9ced3, { roughness: 0.3, metalness: 0.92 });
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.05, 64), plateMat); plate.position.y = PLATE_Y; g.add(plate);
  const edge = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.025, 8, 64), plateMat); edge.rotation.x = Math.PI / 2; edge.position.y = PLATE_Y; g.add(edge);
  // 판 위 얼음(「판 차갑게」일 때만)
  const ice = new THREE.Group(), iceMat = new THREE.MeshPhysicalMaterial({ color: 0xf3fbff, transparent: true, opacity: 0.82, roughness: 0.18, clearcoat: 1, depthWrite: false });
  [[-0.35, 0.1, 0.3], [0.05, -0.3, 0.9], [0.3, 0.25, -0.4], [-0.1, 0.42, 0.2], [-0.45, -0.25, 1.3]].forEach(([x, z, r]) => {
    const c = new THREE.Mesh(roundedBoxGeometry(0.24, 0.2, 0.24, 0.05), iceMat); c.position.set(x, PLATE_Y + 0.125, z); c.rotation.y = r; ice.add(c);
  });
  ice.visible = false; g.add(ice);
  // 판 아래 물방울: 매달린 방울(아래로 늘어진 구) + 판에 붙은 작은 알갱이. 앞 1/3은 「조금」, 전부는 「뚜렷하게」
  const drops = new THREE.Group(), dropMat = new THREE.MeshPhysicalMaterial({ color: 0xbfe3f7, transparent: true, opacity: 0.9, roughness: 0.02, clearcoat: 1, metalness: 0, depthWrite: false });
  for (let i = 0; i < 30; i++) {
    const a = i * 2.399, r = 0.12 + Math.sqrt(i / 30) * 0.68, big = i % 3 === 0;
    const d = new THREE.Mesh(new THREE.SphereGeometry(big ? 0.06 : 0.036, 16, 12), dropMat);
    d.scale.y = big ? 1.6 : 1.1; d.position.set(Math.cos(a) * r, PLATE_Y - 0.025 - (big ? 0.07 : 0.03), Math.sin(a) * r); drops.add(d);
  }
  drops.visible = false; g.add(drops);
  // 수증기 이동 기호(주황 화살표)
  const arrows = new THREE.Group();
  for (const [x, z] of [[-0.35, 0.12], [0.05, -0.2], [0.38, 0.18]]) arrows.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x, 0.9, z), 0.85, 0xe69953, 0.14, 0.08));
  arrows.visible = false; g.add(arrows);
  const name = label('냉각판 아래를 관찰해요', { size: 0.27 }); name.position.set(0, PLATE_Y + 0.6, 0); g.add(name);
  const setCold = (on) => { ice.visible = !!on; plateMat.color.set(on ? 0xc3d6e4 : 0xc9ced3); };
  // stage: 0 없음 · 1 조금 · 2 뚜렷하게(실험실 humidifierModel 과 같은 단계)
  const showDrops = (stage) => { drops.visible = stage > 0; const n = stage >= 2 ? drops.children.length : Math.ceil(drops.children.length / 3); drops.children.forEach((d, i) => { d.visible = i < n; }); };
  g.userData = { water, plate, drops, arrows, ice, name, setCold, showDrops };
  return g;
}

export default {
  view: { theta: 0.45, phi: 1.42 }, revealAt: 2,   // 판 높이 가까이에서 — 판 아래 물방울이 보여야 한다
  build(kit, world) { world.add('rig', buildHumidifier()); return {}; },
  // 비트마다 anim 으로 보이기를 정한다(Player 는 앞 비트들의 anim(1)을 다시 적용해 되감기를 맞춘다. reset 은 첫 비트 것만 불린다)
  beats: [
    { text: '같은 양의 물 위에 판을 놓아요. 판은 물과 닿지 않아요.', show: ['rig'], dur: 4,
      reset(o) { const u = o.rig.userData; u.showDrops(0); u.arrows.visible = false; u.setCold(false); } },
    { text: '판 위에 얼음을 올려 차갑게 하면, 판 아래는 어떻게 될까요? 먼저 예상해요.', show: ['rig'], dur: 4, anim(p, o) { o.rig.userData.setCold(true); } },
    { text: '물은 기화해 보이지 않는 수증기가 돼요. 화살표는 이동을 설명하는 기호예요.', show: ['rig'], dur: 5, anim(p, o) { o.rig.userData.arrows.visible = true; } },
    { text: '차가운 판에 닿은 수증기가 식어 물방울로 응결해요.', show: ['rig'], dur: 5, anim(p, o) { o.rig.userData.showDrops(p > 0.5 ? 2 : 1); } },
    { text: '기체 수증기는 보이지 않아요. 하얀 김은 작은 액체 물방울이에요.', show: ['rig'], dur: 5 },
  ],
};
