import { THREE, label, relabel, roundedBoxGeometry, puffCloud, clamp01, lerp, seg } from './_kit.js';
import { fresnel, thickGlass, liquidMat, lathe, round, reagentBottle, labTable, labTray, glassJar, jarLid, beakerMesh } from './glassware.js';
import { COOLS, TEMPS, snowModel, MAX_SNOW } from './snow-model.js';
export { COOLS, TEMPS, snowModel, MAX_SNOW };
// 병 속에 내리는 눈(5-1 Ⅳ 용해와 용액) — 원본 5-A 「흰 눈이 펄펄」.
// 뜨거운 물에 염화암모늄을 녹인 포화 용액을 그림 그린 유리병에 담아 식히면, 녹지 못한 염화암모늄이 흰 결정(눈)이 되어 내려앉는다.
// 그대로(60 ℃)면 아무 일도 없고, 실온(20 ℃)보다 얼음물(0 ℃)에서 더 많이 내린다. 다시 뜨거운 물에 넣으면 결정이 녹아 투명해진다.
const R = 0.95, JAR_H = 3.1, Y0 = 0.1, LIQ = 2.25;          // 병 안 반지름 · 높이 · 안쪽 바닥 · 용액 윗면
const NF = 320, PILE_H = 0.5;                             // 눈송이 수 · 가장 많이 쌓였을 때 높이

// 네임펜으로 병 바깥에 그린 겨울 풍경(전나무 · 집 · 눈사람 · 달) — 투명 바탕에 검은 선
function drawingTexture() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
  g.strokeStyle = '#17202e'; g.fillStyle = '#17202e'; g.lineWidth = 7; g.lineCap = g.lineJoin = 'round';
  const tree = (x, y, s) => { g.beginPath(); for (let k = 0; k < 3; k++) { const w = (60 - k * 14) * s, top = y - (k + 1) * 46 * s; g.moveTo(x - w, y - k * 46 * s); g.lineTo(x, top - 18 * s); g.lineTo(x + w, y - k * 46 * s); } g.moveTo(x, y); g.lineTo(x, y + 26 * s); g.stroke(); };
  tree(150, 400, 1.25); tree(300, 430, 0.9); tree(830, 410, 1.1); tree(940, 440, 0.8);
  // 집
  g.beginPath(); g.moveTo(470, 450); g.lineTo(470, 340); g.lineTo(560, 270); g.lineTo(650, 340); g.lineTo(650, 450); g.closePath(); g.stroke();
  g.strokeRect(540, 380, 44, 70); g.strokeRect(487, 360, 34, 30); g.strokeRect(600, 360, 34, 30); g.beginPath(); g.moveTo(610, 300); g.lineTo(610, 268); g.lineTo(630, 268); g.lineTo(630, 316); g.stroke();
  // 눈사람
  g.beginPath(); g.arc(735, 420, 34, 0, Math.PI * 2); g.moveTo(757, 362); g.arc(735, 362, 22, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(728, 358, 3, 0, 7); g.arc(742, 358, 3, 0, 7); g.fill();
  // 달과 땅선
  g.beginPath(); g.arc(380, 120, 40, Math.PI * 0.35, Math.PI * 1.65); g.arc(400, 120, 32, Math.PI * 1.55, Math.PI * 0.45, true); g.stroke();
  g.lineWidth = 6; g.beginPath(); g.moveTo(40, 470); g.bezierCurveTo(300, 440, 700, 490, 990, 462); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// 눈송이 한 장: 여섯 갈래 별 모양 판(얇은 판이라 빙글 돌며 반짝인다)
function flakeGeometry() {
  const sh = new THREE.Shape(), n = 6;
  for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? 0.45 : 1; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
  return new THREE.ShapeGeometry(sh);
}
// 수조(넓은 유리 그릇) + 물 + 얼음 + 온도계
function bathBowl() {
  const g = new THREE.Group(), BR = 1.55, BH = 1.15;
  const bowl = new THREE.Mesh(lathe(round([[0, 0.01], [BR, 0, 0.08], [BR, BH - 0.03], [BR + 0.03, BH], [BR - 0.04, BH], [BR - 0.04, 0.04], [0, 0.04]]), 96), thickGlass(0xeef6f8, 0.07)); bowl.renderOrder = 7; g.add(bowl);
  const waterMat = fresnel(new THREE.MeshPhysicalMaterial({ color: 0xbfe0f7, roughness: 0.02, transparent: true, opacity: 0.16, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide }), { edge: 0.45 });
  const water = new THREE.Mesh(new THREE.CylinderGeometry(BR - 0.05, BR - 0.05, 0.8, 72, 1, true), waterMat); water.position.y = 0.44; water.renderOrder = 3; g.add(water);
  const top = new THREE.Mesh(new THREE.RingGeometry(R + 0.09, BR - 0.05, 72), new THREE.MeshPhysicalMaterial({ color: 0xdff0fb, roughness: 0.03, transparent: true, opacity: 0.32, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide }));
  top.rotation.x = -Math.PI / 2; top.position.y = 0.84; top.renderOrder = 4; g.add(top);
  const ice = new THREE.Group(), iceMat = fresnel(new THREE.MeshPhysicalMaterial({ color: 0xf2fbff, roughness: 0.18, transparent: true, opacity: 0.45, clearcoat: 1, depthWrite: false }), { edge: 0.85, pow: 1.4 });
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + 0.3, r = R + 0.3; const cube = new THREE.Mesh(roundedBoxGeometry(0.3, 0.26, 0.3, 0.07), iceMat); cube.position.set(Math.cos(a) * r, 0.8, Math.sin(a) * r); cube.rotation.set(0.3 * i, a * 1.7, 0.2); cube.renderOrder = 5; ice.add(cube); }
  g.add(ice);
  // 온도계: 유리관 + 빨간 알코올 기둥(온도에 따라 높이) + 눈금
  const th = new THREE.Group(); th.position.set(BR - 0.38, 0.12, 0.55); th.rotation.z = -0.12;
  th.add(new THREE.Mesh(lathe(round([[0, 0], [0.06, 0.02, 0.03], [0.06, 1.75, 0.05], [0, 1.8]]), 24), thickGlass(0xf4f8fa, 0.25)));
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0xd32f2f, roughness: 0.2, clearcoat: 1 })); bulb.position.y = 0.07; th.add(bulb);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 10), new THREE.MeshPhysicalMaterial({ color: 0xd32f2f, roughness: 0.3 })); col.geometry.translate(0, 0.5, 0); col.position.y = 0.1; th.add(col);
  for (let k = 0; k <= 10; k++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(k % 5 ? 0.04 : 0.07, 0.008, 0.008), new THREE.MeshBasicMaterial({ color: 0x334155 })); tk.position.set(0.03, 0.25 + k * 0.13, 0.055); th.add(tk); }
  g.add(th);
  const steam = puffCloud(40, { color: 0xffffff, opacity: 1, soft: 0.8, renderOrder: 8 }); g.add(steam);
  g.traverse((o) => { o.userData.noFrame = true; });
  g.userData = { water: waterMat, top: top.material, ice, col, steam };
  return g;
}

export function buildSnowJar() {
  const g = new THREE.Group();
  const table = labTable(); g.add(table);
  const tray = labTray(3.6, 3.0); tray.position.set(0.05, 0, 0.05); g.add(tray);
  const lift = 0.025, jarG = new THREE.Group(); jarG.position.y = lift; g.add(jarG);
  const { group: jarBody, NR, T } = glassJar({ R, H: JAR_H, Y0 }); jarG.add(jarBody);
  // 병 바깥의 네임펜 그림(앞쪽 반 바퀴)
  const art = new THREE.Mesh(new THREE.CylinderGeometry(R + T + 0.004, R + T + 0.004, 1.5, 64, 1, true, -1.25, 2.5), new THREE.MeshBasicMaterial({ map: drawingTexture(), transparent: true, depthWrite: false, side: THREE.FrontSide }));
  art.position.y = 1.15; art.renderOrder = 8; jarG.add(art);
  // 포화 용액(맑음) — 식으면 아주 옅게 뿌옇게
  const liqM = liquidMat(); const liquid = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.004, R - 0.004, LIQ - Y0, 72, 1, true), liqM); liquid.position.y = (LIQ + Y0) / 2; liquid.renderOrder = 3; jarG.add(liquid);
  const haze = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
  const hazeM = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.02, R - 0.02, LIQ - Y0 - 0.02, 48), haze); hazeM.position.y = (LIQ + Y0) / 2; hazeM.renderOrder = 3; jarG.add(hazeM);
  const surf = new THREE.Mesh(lathe([[0, 0], [R * 0.78, 0.004], [R * 0.93, 0.018], [R - 0.004, 0.05]], 72), fresnel(new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transparent: true, opacity: 0.16, clearcoat: 1, envMapIntensity: 1.8, side: THREE.DoubleSide, depthWrite: false }), { edge: 0.7, pow: 1.6 }));
  surf.position.y = LIQ - 0.04; surf.renderOrder = 5; jarG.add(surf);
  const meniscus = new THREE.Mesh(new THREE.TorusGeometry(R - 0.012, 0.012, 8, 96), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1, depthWrite: false }));
  meniscus.rotation.x = Math.PI / 2; meniscus.position.y = LIQ + 0.006; meniscus.renderOrder = 6; jarG.add(meniscus);
  const lid = jarLid(NR, T, 0xb23a3a); lid.position.y = JAR_H - 0.12; jarG.add(lid);
  // 쌓인 눈(바닥의 낮은 둔덕) + 내리는 눈송이
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, emissive: 0xdfe8f2, emissiveIntensity: 0.25 });
  const pile = new THREE.Mesh(lathe(round([[0, 1], [0.55, 0.92, 0.25], [R - 0.02, 0.45, 0.2], [R - 0.02, 0], [0, 0]]), 72), snowMat); pile.position.y = Y0; pile.scale.y = 0.001; pile.renderOrder = 4; jarG.add(pile);
  const flakes = new THREE.InstancedMesh(flakeGeometry(), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, emissive: 0xe8f0ff, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.95 }), NF);
  flakes.renderOrder = 5; flakes.count = 0; jarG.add(flakes);
  const seedF = Array.from({ length: NF }, (_, i) => { const a = (i * 2.399963) % (Math.PI * 2), r = Math.sqrt(((i * 0.618034) % 1)) * (R - 0.14); return { x: Math.cos(a) * r, z: Math.sin(a) * r, ph: (i * 0.7548776) % 1, sp: 0.55 + ((i * 0.3819) % 1) * 0.5, sw: (i % 7) * 0.9, sz: 0.034 + ((i * 0.5698) % 1) * 0.04, rot: i * 1.3 }; });
  // 수조(얼음물 · 뜨거운 물)
  const bath = bathBowl(); bath.visible = false; g.add(bath);
  // 병 뒤에 세운 남색 판: 흰 결정이 잘 보이게(교실에서 검은 도화지를 대고 보는 것처럼)
  const board = new THREE.Mesh(roundedBoxGeometry(3.1, 3.3, 0.06, 0.12), new THREE.MeshStandardMaterial({ color: 0x1d2a52, roughness: 0.85 }));
  board.position.set(-Math.sin(0.32) * 1.45, 1.66, -Math.cos(0.32) * 1.45); board.rotation.y = 0.32; board.userData.noFrame = true; g.add(board);
  const foot2 = new THREE.Mesh(roundedBoxGeometry(0.5, 0.08, 0.3, 0.03), new THREE.MeshStandardMaterial({ color: 0x1d2a52, roughness: 0.85 })); foot2.position.set(board.position.x, 0.04, board.position.z + 0.12); foot2.rotation.y = 0.32; foot2.userData.noFrame = true; g.add(foot2);
  // 배경 소품: 염화암모늄 시약병 · 뜨거운 물 비커
  const salt = reagentBottle('염화암모늄', 'NH₄Cl · 흰 가루', 0xd9d4c4, 0x1d4f8f, '#3346a0'); salt.position.set(-1.95, 0, -1.3); salt.rotation.y = 0.45; g.add(salt);
  const beaker = beakerMesh({ tint: 0xf3d5b8 }); beaker.position.set(1.95, 0, -1.15); beaker.traverse((o) => { o.userData.noFrame = true; }); g.add(beaker);
  const names = { jar: label('염화암모늄 포화 용액', { size: 0.24 }), snow: label('흰 결정(눈)', { size: 0.24 }), bath: label('얼음물', { size: 0.24 }) };
  names.jar.position.set(-R - 0.75, 1.75, 0.2); names.snow.position.set(R + 0.75, 0.45, 0.2); names.bath.position.set(1.85, 0.75, 0.5);
  for (const n of Object.values(names)) g.add(n);

  // 상태: cool(0 그대로 · 1 실온 · 2 얼음물) · p(식는 진행 0~1) · reheat(다시 데우기 0~1) · t(시간)
  const S = { cool: 1, p: 0, reheat: 0, t: 0 };
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  let bathKey = '';
  const draw = () => {
    const amt = snowModel(COOLS[S.cool]).snow / MAX_SNOW;                      // 0 · 0.72 · 1
    const cool = seg(S.p, 0.08, 1), melt = clamp01(S.reheat), live = amt * (1 - melt);
    // 쌓인 눈: 식은 정도만큼 자라고, 데우면 줄어든다
    const pileK = live * (cool * cool * (3 - 2 * cool));
    pile.scale.y = Math.max(0.001, PILE_H * pileK); pile.scale.x = pile.scale.z = 0.85 + 0.15 * pileK; pile.visible = pileK > 0.01;
    // 내리는 눈송이: 식는 동안 위에서 생겨 커지며 내려온다(원본: 처음엔 싸락눈처럼 작다가 내려오며 커진다)
    const nVis = Math.round(NF * live * Math.min(1, cool * 1.6) * (S.p >= 1 && !melt ? 0.45 : 1));
    let n = 0; const floorY = Y0 + PILE_H * pileK + 0.04, topY = LIQ - 0.12;
    for (let i = 0; i < nVis; i++) {
      const f = seedF[i], life = (f.ph + S.t * 0.09 * f.sp) % 1, y = lerp(topY, floorY, life);
      const s = f.sz * (0.55 + life * 0.9) * (1 - melt * 0.8);
      E.set(f.rot + S.t * 0.8, f.rot * 0.7 + S.t * 1.1, 0); Q.setFromEuler(E);
      P.set(f.x + Math.sin(S.t * 0.9 + f.sw) * 0.06, y, f.z + Math.cos(S.t * 0.7 + f.sw) * 0.06); SC.setScalar(s); M.compose(P, Q, SC); flakes.setMatrixAt(n++, M);
    }
    flakes.count = n; flakes.instanceMatrix.needsUpdate = true;
    haze.opacity = 0.07 * live * cool;
    // 수조: 얼음물(식히기 2) 또는 뜨거운 물(다시 데우기)
    const hot = melt > 0, showBath = hot || S.cool === 2;
    bath.visible = showBath; tray.visible = !showBath;
    jarG.position.y = showBath ? 0.04 : lift;
    const B = bath.userData; B.ice.visible = !hot && S.cool === 2;
    B.water.color.set(hot ? 0xf6c9a6 : 0xbfe0f7); B.top.color.set(hot ? 0xf8dcc4 : 0xdff0fb);
    const T = hot ? lerp(TEMPS[S.cool], 80, Math.min(1, melt * 1.5)) : lerp(60, TEMPS[S.cool], cool);
    B.col.scale.y = 0.15 + (T / 100) * 1.3;
    let k = 0; if (hot) for (let i = 0; i < 26; i++) { const life = (S.t * 0.35 + i / 26) % 1, a = i * 2.4; B.steam.userData.set(k++, Math.cos(a) * 1.25, 0.9 + life * 1.3, Math.sin(a) * 1.25, 0.35 + life * 0.6, 0.16 * Math.sin(life * Math.PI)); }
    B.steam.userData.commit(k);
    const bk = hot ? '뜨거운 물' : S.cool === 2 ? '얼음물' : '';
    if (bk && bk !== bathKey) { bathKey = bk; relabel(names.bath, bk, { size: 0.24 }); }
    names.bath.visible = !!bk; names.snow.visible = pileK > 0.05 || nVis > 20;
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, names, props: [salt, beaker], board, boardFoot: foot2 };
  return g;
}

export default {
  view: { theta: 0.32, phi: 1.2 }, revealAt: 2,
  frame: [[-1.7, 0, -1.2], [1.8, 3.4, 1.2]],
  build(kit, world) { world.add('rig', buildSnowJar()); return {}; },
  // 비트마다 anim 으로 상태를 정한다(Player 는 앞 비트들의 anim(1)을 다시 적용한다. reset 은 첫 비트 것만 불린다)
  beats: [
    { text: '뜨거운 물 약 10 mL에 염화암모늄을 더 녹지 않을 때까지 녹여 포화 용액을 만들고, 그림을 그린 유리병에 담아 뚜껑을 닫았어요. 아직은 맑아요.', show: ['rig'], dur: 6,
      reset(o) { o.rig.userData.set({ cool: 0, p: 0, reheat: 0, t: 0 }); },
      anim(p, o) { o.rig.userData.set({ cool: 0, p, t: p * 6 }); } },
    { text: '이 병을 식히면 병 속에서 무슨 일이 일어날까요? 먼저 예상해요.', show: ['rig'], dur: 5,
      anim(p, o) { o.rig.userData.set({ t: 6 + p * 5 }); } },
    { text: '실온에서 식히자 녹아 있던 염화암모늄 일부가 더 녹아 있지 못하고 흰 결정이 되어 눈처럼 내려앉아요.', show: ['rig'], dur: 8,
      anim(p, o) { o.rig.userData.set({ cool: 1, p, reheat: 0, t: 11 + p * 8 }); } },
    { text: '얼음물에 넣어 더 차갑게 식히면 녹을 수 있는 양이 더 줄어 눈이 더 많이 내리고 두껍게 쌓여요.', show: ['rig'], dur: 8,
      anim(p, o) { o.rig.userData.set({ cool: 2, p, reheat: 0, t: 19 + p * 8 }); } },
    { text: '다시 뜨거운 물에 넣으면 쌓였던 결정이 녹아 투명해져요. 식히면 또 눈이 내려요 — 온도에 따라 녹을 수 있는 양이 달라요.', show: ['rig'], dur: 8,
      anim(p, o) { o.rig.userData.set({ cool: 2, p: 1, reheat: p, t: 27 + p * 8 }); } },
  ],
};
