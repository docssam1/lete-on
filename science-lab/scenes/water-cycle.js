import { THREE, mat, glassMat, label, relabel, roundedBoxGeometry, arrow, puffCloud, clamp01, lerp, seg } from './_kit.js';
import { SUNS, LIDS, RAIN, cycleModel } from './water-cycle-model.js';
export { SUNS, LIDS, RAIN, cycleModel };
// 물의 여행(4-2 Ⅴ) — 뚜껑 덮은 유리 수조 속 「작은 지구」. 왼쪽은 바다, 오른쪽은 비탈진 땅과 나무, 그 사이를 강이 흐른다.
// 전등(햇빛)이 바닷물을 데우면 → 보이지 않는 수증기(증발) → 차가운 뚜껑 아래에서 물방울·구름(응결) → 비 → 강 → 다시 바다.
// 원본 6-B 「컵 속에 내리는 비」의 따뜻한 물 + 차가운 뚜껑 원리를 그대로 쓰고, 염화암모늄 대신 얼음을 쓴다.
const W = 5.0, H = 2.7, D = 1.6, SEA = 0.7, LID = H, X0 = -W / 2 + 0.05, X1 = W / 2 - 0.05;
const ICE0 = 0.35, ICE1 = 1.85;                                  // 뚜껑 위 얼음 쟁반이 덮는 x 범위(땅 위)
export const landY = (x) => (x < 0.05 ? lerp(0.3, 0.6, clamp01((x + 0.3) / 0.35)) : 0.6 + 0.75 * Math.sin(clamp01((x - 0.05) / 2.4) * Math.PI / 2));
const rnd = (i, k = 1) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };   // 늘 같은 「무작위」

export function buildWaterCycle() {
  const g = new THREE.Group();
  const table = new THREE.Mesh(roundedBoxGeometry(7.4, 0.12, 2.6, 0.05), mat(0xe6dcc8, { roughness: 0.85 })); table.position.y = -0.06; table.userData.noFrame = true; g.add(table);
  // 유리 수조 + 모서리 틀 + 유리 뚜껑
  const glass = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), glassMat(0xdcecf5, 0.16)); glass.position.y = H / 2; glass.renderOrder = 6; g.add(glass);
  const edge = mat(0x5b6875, { roughness: 0.4, metalness: 0.5 });
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, H, 0.05), edge); b.position.set(sx * W / 2, H / 2, sz * D / 2); g.add(b); }
  for (const sz of [1, -1]) { const b = new THREE.Mesh(new THREE.BoxGeometry(W, 0.05, 0.05), edge); b.position.set(0, 0.02, sz * D / 2); g.add(b); }
  const lid = new THREE.Mesh(roundedBoxGeometry(W + 0.12, 0.06, D + 0.12, 0.02), glassMat(0xcfe6f2, 0.32)); lid.position.y = LID + 0.03; lid.renderOrder = 7; g.add(lid);
  // 바다: 모래 바닥 + 바닷물(땅의 앞뒤 단면과 한 평면에 겹치지 않게 조금 얇게)
  const sand = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.2, D - 0.09), mat(0xd9c08e, { roughness: 0.95 })); sand.position.set(X0 + 1.375, 0.1, 0); g.add(sand);
  const sea = new THREE.Mesh(new THREE.BoxGeometry(3.1, SEA - 0.2, D - 0.09), new THREE.MeshPhysicalMaterial({ color: 0x3f8fc7, roughness: 0.12, transparent: true, opacity: 0.78, clearcoat: 1, clearcoatRoughness: 0.08 }));
  sea.position.set(X0 + 1.55, 0.2 + (SEA - 0.2) / 2, 0); sea.renderOrder = 3; g.add(sea);
  // 땅: 옆에서 본 비탈 모양을 앞뒤로 밀어 만든다
  const sh = new THREE.Shape(); sh.moveTo(-0.3, 0); sh.lineTo(-0.3, landY(-0.3));
  for (let i = 0; i <= 40; i++) { const x = lerp(-0.25, X1, i / 40); sh.lineTo(x, landY(x)); }
  sh.lineTo(X1, 0); sh.lineTo(-0.3, 0);
  const landGeo = new THREE.ExtrudeGeometry(sh, { depth: D - 0.04, bevelEnabled: false }); landGeo.translate(0, 0, -(D - 0.04) / 2);
  const land = new THREE.Mesh(landGeo, [mat(0x8a6a48, { roughness: 0.95 }), mat(0x6f9f4f, { roughness: 0.9 })]); g.add(land);   // [앞뒤 단면 = 흙, 겉면 = 풀밭]
  // 강: 비탈을 따라 바다로 흘러 내려가는 물길
  const river = new THREE.CatmullRomCurve3([2.25, 1.85, 1.4, 1.0, 0.6, 0.15].map((x, i) => new THREE.Vector3(x, landY(x) + 0.005, 0.32 + 0.12 * Math.sin(i * 1.7))));
  const riverMat = new THREE.MeshPhysicalMaterial({ color: 0x4aa3df, roughness: 0.1, transparent: true, opacity: 0.85, clearcoat: 1 });
  const riverMesh = new THREE.Mesh(new THREE.TubeGeometry(river, 60, 0.07, 8, false), riverMat); riverMesh.scale.y = 1; g.add(riverMesh);
  // 나무 두 그루(땅 위 생물 — 물을 쓰고 내보낸다)
  for (const [x, z, s] of [[1.75, -0.4, 1], [2.2, 0.0, 0.75]]) {
    const tr = new THREE.Group(), y = landY(x);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.045 * s, 0.06 * s, 0.5 * s, 10), mat(0x7a5232)); trunk.position.y = 0.25 * s; tr.add(trunk);
    for (const [dx, dy, r] of [[0, 0.62, 0.24], [-0.14, 0.5, 0.17], [0.14, 0.52, 0.17]]) { const c = new THREE.Mesh(new THREE.SphereGeometry(r * s, 18, 12), mat(0x4f9a52, { roughness: 0.8 })); c.position.set(dx * s, dy * s, 0); tr.add(c); }
    tr.position.set(x, y - 0.02, z); g.add(tr);
  }
  // 전등(햇빛): 받침 · 기둥 · 팔 · 갓 · 전구 + 따뜻한 빛
  const lamp = new THREE.Group(), steel = mat(0x3d4a56, { roughness: 0.4, metalness: 0.5 }), LX = -1.3, LY = 3.55;
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.06, 24), steel); foot.position.set(-3.05, 0.03, -0.2); lamp.add(foot);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, LY + 0.25, 12), steel); pole.position.set(-3.05, (LY + 0.25) / 2, -0.2); lamp.add(pole);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.05, 0.05), steel); arm.position.set((-3.05 + LX) / 2, LY + 0.22, -0.2); lamp.add(arm);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.5, 0.42, 28, 1, true), mat(0x2f6f5a, { roughness: 0.5, side: THREE.DoubleSide })); shade.position.set(LX, LY, 0); lamp.add(shade);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 20), mat(0x2f6f5a)); cap.position.set(LX, LY + 0.22, 0); lamp.add(cap);
  const hang = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.25), steel); hang.position.set(LX, LY + 0.22, -0.1); lamp.add(hang);
  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff3c4, emissive: 0xffd36a, emissiveIntensity: 0.1 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 14), bulbMat); bulb.position.set(LX, LY - 0.12, 0); lamp.add(bulb);
  g.add(lamp);
  const warm = new THREE.PointLight(0xffc56a, 0, 7, 1.6); warm.position.set(LX, LY - 0.4, 0); g.add(warm);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(1.25, LY - SEA - 0.2, 40, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
  beam.position.set(LX, (LY - 0.2 + SEA) / 2, 0); beam.userData.noFrame = true; g.add(beam);
  // 뚜껑 위 얼음 쟁반(하늘 높은 곳의 찬 공기)
  const ice = new THREE.Group();
  const tray = new THREE.Mesh(roundedBoxGeometry(ICE1 - ICE0, 0.08, 1.0, 0.03), mat(0xb9c2cc, { roughness: 0.35, metalness: 0.6 })); tray.position.y = 0.04; ice.add(tray);
  const cubeMat = new THREE.MeshPhysicalMaterial({ color: 0xe8f6ff, roughness: 0.15, transparent: true, opacity: 0.85, clearcoat: 1 });
  for (let i = 0; i < 8; i++) { const c = new THREE.Mesh(roundedBoxGeometry(0.24, 0.2, 0.24, 0.05), cubeMat); c.position.set(-0.55 + (i % 4) * 0.36 + (rnd(i) - 0.5) * 0.05, 0.16, i < 4 ? -0.2 : 0.2); c.rotation.y = (rnd(i, 2) - 0.5) * 0.5; ice.add(c); }
  ice.position.set((ICE0 + ICE1) / 2, LID + 0.06, 0); g.add(ice);
  // 증발: 바다 위로 올라가는 화살표(수증기는 눈에 보이지 않으므로 화살표로만 나타낸다)
  const ups = [-2.0, -1.35, -0.7].map((x) => { const a = arrow([x, SEA + 0.1, 0.15], [x + 0.3, SEA + 1.1, 0.15], 0xf29b3a, 0.045); a.userData.x = x; a.visible = false; g.add(a); return a; });
  // 구름(작은 물방울이 모인 것 — 눈에 보인다)
  const cloud = puffCloud(46, { color: 0xdfe6ee, opacity: 1, soft: 0.6, renderOrder: 8 }); g.add(cloud);
  // 뚜껑 아래 맺힌 물방울
  const NL = 90, dropGeo = new THREE.SphereGeometry(1, 12, 8), dropMat = new THREE.MeshPhysicalMaterial({ color: 0xbfe3ff, roughness: 0.05, transparent: true, opacity: 0.8, clearcoat: 1 });
  const lidDrops = new THREE.InstancedMesh(dropGeo, dropMat, NL); lidDrops.renderOrder = 5; g.add(lidDrops);
  const lidInfo = Array.from({ length: NL }, (_, i) => { const under = i < 55; const x = under ? lerp(ICE0 - 0.1, ICE1 + 0.1, rnd(i, 3)) : lerp(X0 + 0.1, X1 - 0.1, rnd(i, 4)); return { x, z: lerp(-0.7, 0.7, rnd(i, 5)), s: lerp(0.022, 0.045, rnd(i, 6)), under: x > ICE0 - 0.1 && x < ICE1 + 0.1 }; });
  // 비(떨어지는 물방울)와 강물(흐르는 물)
  const NR = 44, rain = new THREE.InstancedMesh(dropGeo, new THREE.MeshPhysicalMaterial({ color: 0x4aa3df, roughness: 0.1, transparent: true, opacity: 0.9 }), NR); g.add(rain);
  const rainInfo = Array.from({ length: NR }, (_, i) => ({ x: lerp(ICE0, ICE1, rnd(i, 7)), z: lerp(-0.6, 0.6, rnd(i, 8)), ph: rnd(i, 9) }));
  const NF = 22, flow = new THREE.InstancedMesh(dropGeo, new THREE.MeshStandardMaterial({ color: 0xd8f0ff, emissive: 0x6fb8ea, emissiveIntensity: 0.3 }), NF); g.add(flow);
  // 물 한 방울의 여행(장면에서만): 방울 + 따라다니는 이름표
  const tracer = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), new THREE.MeshStandardMaterial({ color: 0x1e88e5, emissive: 0x1e88e5, emissiveIntensity: 0.35, transparent: true, opacity: 1 })); tracer.visible = false; tracer.renderOrder = 9; g.add(tracer);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.018, 8, 32), new THREE.MeshBasicMaterial({ color: 0xf29b3a })); tracer.add(ring);
  const tag = label('바다의 물', { size: 0.26 }); tag.visible = false; g.add(tag);
  const names = { lamp: label('전등 = 햇빛', { size: 0.26 }), ice: label('얼음 = 하늘의 찬 공기', { size: 0.26 }), sea: label('바다', { size: 0.26 }), land: label('땅', { size: 0.26 }),
    vapor: label('수증기(눈에 안 보여요)', { size: 0.24 }), cloud: label('구름 · 작은 물방울', { size: 0.24 }), rain: label('비', { size: 0.24 }), river: label('강', { size: 0.24 }) };
  names.lamp.position.set(LX - 0.2, LY + 0.62, 0); names.ice.position.set((ICE0 + ICE1) / 2 + 0.3, LID + 0.62, 0); names.sea.position.set(-1.9, 0.42, D / 2 + 0.05); names.land.position.set(2.15, 0.6, D / 2 + 0.05);
  names.vapor.position.set(-1.25, 1.75, 0.2); names.cloud.position.set(-0.2, 2.35, 0.5); names.rain.position.set(ICE1 + 0.25, 1.95, 0.6); names.river.position.set(0.9, landY(0.9) + 0.3, 0.75);
  for (const n of Object.values(names)) g.add(n);

  // 물방울 한 개가 지나가는 길 — u: 0(바다) → 1(다시 바다)
  const STOPS = [[0, '바다의 물'], [0.06, '수증기(증발)'], [0.24, '구름 속 물방울(응결)'], [0.38, '비'], [0.56, '강물'], [0.86, '다시 바다로']];
  const tracePos = (u, v) => {
    if (u < 0.24) { const k = seg(u, 0.03, 0.24); return v.set(lerp(-1.5, -0.6, k * k), lerp(SEA, 2.25, k), 0.1); }
    if (u < 0.38) { const k = seg(u, 0.24, 0.38); return v.set(lerp(-0.6, 1.15, k), lerp(2.25, 2.45, Math.sin(k * Math.PI / 2)), lerp(0.1, 0.3, k)); }
    if (u < 0.56) { const k = seg(u, 0.38, 0.56); return v.set(1.15, lerp(2.45, landY(1.15) + 0.08, k * k), lerp(0.3, 0.4, k)); }
    if (u < 0.86) { const p = river.getPointAt(lerp(0.66, 1, seg(u, 0.56, 0.86))); return v.set(p.x, p.y + 0.08, p.z); }
    const k = seg(u, 0.86, 1); return v.set(lerp(0.15, -0.9, k), lerp(SEA, SEA - 0.05, k), lerp(0.42, 0.2, k));
  };
  const S = { sun: '세게', lid: '얼음 있음', run: 0, t: 0, trace: -1 };
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  const draw = () => {
    const m = cycleModel(S.sun, S.lid), on = S.run > 0, strong = S.sun === '세게', iced = S.lid === '얼음 있음';
    // 전등
    bulbMat.emissiveIntensity = on ? (strong ? 2.4 : 1.0) : 0.1; warm.intensity = on ? (strong ? 9 : 4) : 0; beam.material.opacity = on ? (strong ? 0.16 : 0.08) : 0;
    ice.visible = iced; names.ice.visible = iced;
    // 증발 화살표: 위로 흘러가며 깜박인다(강할수록 빠르게)
    const ev = strong ? 1 : 0.55;
    ups.forEach((a, i) => { a.visible = on; const k = (S.t * 0.45 * ev + i / 3) % 1; a.position.y = SEA + 0.1 + k * 0.45; a.scale.setScalar(0.6 + 0.4 * Math.sin(k * Math.PI)); });
    names.vapor.visible = on && S.trace < 0;
    // 구름·뚜껑 물방울: 진행에 따라 자라고, 얼음이 있으면 그 아래에 더 크게
    const grow = clamp01(S.run * 1.6), cloudAmt = grow * (0.35 + 0.65 * (m.stage + (on ? 1 : 0)) / 3);
    for (let i = 0; i < 46; i++) {
      const x = lerp(-0.4, ICE1 + 0.15, rnd(i, 11)) + Math.sin(S.t * 0.3 + i) * 0.05, y = lerp(2.22, 2.55, rnd(i, 12)), z = lerp(-0.6, 0.6, rnd(i, 13));
      const near = x > ICE0 - 0.1 ? 1 : 0.55;
      cloud.userData.set(i, x, y, z, lerp(0.55, 1.0, rnd(i, 14)), Math.min(1, 1.1 * cloudAmt * near));
    }
    cloud.userData.commit(on ? 46 : 0); names.cloud.visible = cloudAmt > 0.3 && S.trace < 0;
    let k = 0;
    lidInfo.forEach((d) => {
      const big = d.under && iced ? 1.7 : 1, s = d.s * grow * big * (strong ? 1.1 : 0.85);
      if (s < 0.004) return;
      SC.set(s, s * 1.25, s); P.set(d.x, LID - s * 1.2, d.z); M.compose(P, Q, SC); lidDrops.setMatrixAt(k++, M);
    });
    lidDrops.count = k; lidDrops.instanceMatrix.needsUpdate = true;
    // 비: 물방울이 충분히 커진 뒤(진행 0.45 이후) 단계에 따라 내린다
    const rainAmt = [0, 0.4, 1][m.stage] * seg(S.run, 0.45, 0.75);
    k = 0;
    const nr = Math.round(NR * rainAmt);
    for (let i = 0; i < nr; i++) {
      const d = rainInfo[i], ground = landY(d.x) + 0.03, f = (S.t * 0.9 + d.ph) % 1;
      P.set(d.x, lerp(LID - 0.1, ground, f), d.z); SC.set(0.028, 0.07, 0.028); M.compose(P, Q, SC); rain.setMatrixAt(k++, M);
    }
    rain.count = k; rain.instanceMatrix.needsUpdate = true; names.rain.visible = rainAmt > 0.1 && S.trace < 0;
    // 강물: 비가 내리면 물길을 따라 흘러 바다로
    const flowAmt = rainAmt > 0 ? clamp01(rainAmt * 1.4) : 0;
    k = 0;
    for (let i = 0; i < Math.round(NF * flowAmt); i++) {
      const p = river.getPointAt((S.t * 0.12 + i / NF) % 1);
      P.set(p.x, p.y + 0.06, p.z); SC.setScalar(0.03); M.compose(P, Q, SC); flow.setMatrixAt(k++, M);
    }
    flow.count = k; flow.instanceMatrix.needsUpdate = true;
    riverMat.opacity = 0.55 + 0.35 * flowAmt;
    // 물 한 방울의 여행
    const tr = S.trace >= 0;
    tracer.visible = tag.visible = tr;
    if (tr) {
      tracePos(Math.min(1, S.trace), tracer.position);
      const vapor = S.trace >= 0.06 && S.trace < 0.24;
      tracer.material.opacity = vapor ? 0.25 : 1; ring.visible = vapor; ring.rotation.x = S.t * 2; ring.rotation.y = S.t * 1.3;
      const name = STOPS.filter(([u]) => S.trace >= u).pop()[1];
      relabel(tag, name, { size: 0.26 }); tag.position.copy(tracer.position).add(P.set(0, 0.38, 0));
    }
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, names, lidDrops, rain, flow, tracer, tag, ice, ups };
  return g;
}

export default {
  view: { theta: 0.22, phi: 1.28 }, revealAt: 2,
  frame: [[-3.4, 0, -0.9], [2.6, 4.2, 0.9]],
  build(kit, world) { world.add('rig', buildWaterCycle()); return {}; },
  // 비트마다 anim 으로 상태를 정한다(Player 는 앞 비트들의 anim(1)을 다시 적용한다. reset 은 첫 비트 것만 불린다)
  beats: [
    { text: '바다와 땅, 나무를 유리 수조에 넣고 뚜껑을 덮었어요. 물이 밖으로 나갈 수 없는 작은 지구예요.', show: ['rig'], dur: 5,
      reset(o) { o.rig.userData.set({ sun: '세게', lid: '얼음 있음', run: 0, t: 0, trace: -1 }); } },
    { text: '전등은 햇빛, 뚜껑 위 얼음은 하늘 높은 곳의 찬 공기예요. 전등을 켜면 바닷물은 어떻게 될까요? 먼저 예상해요.', show: ['rig'], dur: 5 },
    { text: '전등이 바닷물을 데우면 물이 눈에 보이지 않는 수증기가 되어 올라가요. 이것이 증발이에요.', show: ['rig'], dur: 6,
      anim(p, o) { o.rig.userData.set({ run: 0.3 * p, t: p * 6, trace: 0.24 * p }); } },
    { text: '수증기가 차가운 뚜껑 근처에서 식으면 작은 물방울이 돼요(응결). 작은 물방울이 모인 것이 구름이에요.', show: ['rig'], dur: 6,
      anim(p, o) { o.rig.userData.set({ run: 0.3 + 0.2 * p, t: 6 + p * 6, trace: 0.24 + 0.14 * p }); } },
    { text: '물방울이 모여 커지고 무거워지면 비가 되어 땅으로 떨어져요.', show: ['rig'], dur: 6,
      anim(p, o) { o.rig.userData.set({ run: 0.5 + 0.3 * p, t: 12 + p * 6, trace: 0.38 + 0.18 * p }); } },
    { text: '땅에 내린 물은 강을 따라 다시 바다로 가요. 물은 모습을 바꾸며 끊임없이 돌고 돌아요. 이것이 물의 순환이에요.', show: ['rig'], dur: 8,
      anim(p, o) { o.rig.userData.set({ run: 0.8 + 0.2 * p, t: 18 + p * 8, trace: 0.56 + 0.44 * p }); } },
  ],
};
