import { THREE, mat, glassMat, label, relabel, roundedBoxGeometry, clamp01, lerp, seg } from './_kit.js';
import { WATERS, OIL, ETHANOL, SHAPES, sunModel } from './rising-sun-model.js';
export { WATERS, OIL, ETHANOL, SHAPES, sunModel };
// 떠오르는 태양(5-1 Ⅲ 태양계와 별) — 원본 5-D 「떠오르는 태양」.
// 유리병의 에탄올 속에 붉은 식용유 덩어리가 가라앉아 있고, 스포이트로 물을 떨어뜨리면 아래층이 무거워져 덩어리가 떠오른다.
// 뚜껑을 닫고 빙글빙글 흔들면 덩어리가 여러 방울로 갈라져 함께 돌다가 다시 하나로 모인다(태양계가 생긴 성운설에 빗대어 봄).
const R = 0.95, JAR_H = 3.1, Y0 = 0.1, PER = 0.045;          // 병 안 반지름 · 높이 · 바닥 · 물 1 mL당 액체 높이
const OIL_R = 0.34, NDROP = 7;
const level = (ml) => Y0 + PER * (20 + ml);                   // 액체 윗면 높이(에탄올 20 mL + 물)

// 아래가 무거운(물이 많이 섞인) 층을 옅은 푸른빛 기울기로 보이게 하는 세로 그라데이션
function layerTexture() {
  const c = document.createElement('canvas'); c.width = 4; c.height = 256; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0, 'rgba(120,175,230,0.55)'); gr.addColorStop(0.55, 'rgba(170,205,240,0.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function scaleTexture() {
  const c = document.createElement('canvas'); c.width = 96; c.height = 1024; const g = c.getContext('2d');
  g.strokeStyle = '#334155'; g.fillStyle = '#334155'; g.lineWidth = 5; g.font = 'bold 46px sans-serif'; g.textBaseline = 'middle';
  for (let k = 0; k <= 10; k++) { const y = 1004 - k * 98.4; g.beginPath(); g.moveTo(0, y); g.lineTo(k % 5 ? 26 : 44, y); g.stroke(); if (k % 5 === 0) g.fillText(String(k), 50, y); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function buildRisingSun() {
  const g = new THREE.Group();
  const table = new THREE.Mesh(roundedBoxGeometry(5.6, 0.12, 3.0, 0.05), mat(0xe6dcc8, { roughness: 0.85 })); table.position.y = -0.06; table.userData.noFrame = true; g.add(table);
  // 유리병 · 바닥 · 입구 테두리 · 뚜껑
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.05, R + 0.05, JAR_H, 48, 1, true), glassMat(0xe5f0f7, 0.24)); jar.position.y = JAR_H / 2; jar.renderOrder = 6; g.add(jar);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.05, R + 0.05, 0.1, 48), glassMat(0xd7e7f2, 0.5)); base.position.y = 0.05; g.add(base);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(R + 0.05, 0.035, 10, 48), glassMat(0xd7e7f2, 0.6)); lip.rotation.x = Math.PI / 2; lip.position.y = JAR_H; g.add(lip);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.12, R + 0.12, 0.22, 48), mat(0x2f6f5a, { roughness: 0.5 })); lid.position.y = JAR_H + 0.1; g.add(lid);
  // 액체(에탄올 + 섞인 물): 투명한 기둥 + 아래가 짙은 푸른 기울기 층
  const liqMat = new THREE.MeshPhysicalMaterial({ color: 0xf6f3e2, roughness: 0.05, transparent: true, opacity: 0.32, clearcoat: 1, depthWrite: false });
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 1, 48), liqMat); liquid.geometry.translate(0, 0.5, 0); liquid.position.y = Y0; liquid.renderOrder = 3; g.add(liquid);
  const layerMat = new THREE.MeshBasicMaterial({ map: layerTexture(), transparent: true, opacity: 0, depthWrite: false });
  const layer = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.01, R - 0.01, 1, 48, 1, true), layerMat); layer.geometry.translate(0, 0.5, 0); layer.position.y = Y0; layer.renderOrder = 4; g.add(layer);
  const surf = new THREE.Mesh(new THREE.CircleGeometry(R, 48), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.35, clearcoat: 1, depthWrite: false })); surf.rotation.x = -Math.PI / 2; surf.renderOrder = 5; g.add(surf);
  // 눈금(액체 바닥 0 ~ 액체 윗면 10): 병 앞쪽에 붙인 띠, 액체 높이에 맞춰 늘어난다
  const scale = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 1), new THREE.MeshBasicMaterial({ map: scaleTexture(), transparent: true, depthWrite: false })); scale.geometry.translate(0, 0.5, 0);
  scale.position.set(R * 0.62, Y0, R * 0.8); scale.rotation.y = 0.65; scale.renderOrder = 7; g.add(scale);
  // 붉은 식용유 덩어리 + 흔들 때 갈라지는 방울
  const oilMat = new THREE.MeshPhysicalMaterial({ color: 0xd8341c, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true, opacity: 0.93, sheen: 0.4 });
  const oil = new THREE.Mesh(new THREE.SphereGeometry(OIL_R, 48, 32), oilMat); oil.renderOrder = 4; g.add(oil);
  const drops = Array.from({ length: NDROP }, () => { const d = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), oilMat); d.visible = false; d.renderOrder = 4; g.add(d); return d; });
  // 스포이트(물): 유리관 + 고무 꼭지 + 떨어지는 물방울
  const dropper = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.035, 1.1, 20), glassMat(0xdcecf7, 0.45)); tube.position.y = 0.55; dropper.add(tube);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.03, 0.5, 16), new THREE.MeshPhysicalMaterial({ color: 0x8ec5ee, transparent: true, opacity: 0.6 })); water.position.y = 0.3; dropper.add(water);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), mat(0x1f7a52, { roughness: 0.6 })); bulb.scale.y = 1.4; bulb.position.y = 1.25; dropper.add(bulb);
  dropper.position.set(0.15, JAR_H + 0.25, 0); g.add(dropper);
  const wdrop = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshPhysicalMaterial({ color: 0x9fd0f5, roughness: 0.05, transparent: true, opacity: 0.8 }), 12); wdrop.renderOrder = 5; g.add(wdrop);
  const names = { jar: label('에탄올', { size: 0.26 }), oil: label('붉은 식용유', { size: 0.26 }), water: label('물(스포이트)', { size: 0.24 }), scale: label('눈금', { size: 0.22 }) };
  names.jar.position.set(-R - 0.55, 1.0, 0); names.water.position.set(0.95, JAR_H + 1.35, 0); names.scale.position.set(R + 0.55, 0.35, R * 0.6);
  for (const n of Object.values(names)) g.add(n);

  const S = { ml: 0, p: 1, from: 0, t: 0, oilIn: 1, shake: 0, lid: false, dropper: true };
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  const draw = () => {
    const prevMl = S.from, ml = lerp(prevMl, S.ml, clamp01(S.p * 1.4));            // 물은 앞부분에 다 들어가고
    const top = level(ml), h = top - Y0;
    liquid.scale.y = h; layer.scale.y = h; surf.position.y = top; scale.scale.y = h;
    layerMat.opacity = clamp01(ml / 25) * 0.9;
    // 덩어리 위치: 이전 높이 → 새 높이(물이 섞이는 동안 늦게 따라 올라간다)
    const f0 = sunModel(S.from).f, f1 = sunModel(S.ml).f, k = seg(S.p, 0.25, 1), f = lerp(f0, f1, k * k * (3 - 2 * k));
    const flat = f < 0.06 ? 1 - f / 0.06 : f > 0.94 ? (f - 0.94) / 0.06 : 0;       // 바닥·수면에서는 납작
    const sy = 1 - 0.55 * flat, sxz = 1 + 0.45 * flat, ry = OIL_R * sy;
    const yMin = Y0 + ry, yMax = top - ry, oy = lerp(yMin, yMax, f);
    // 처음 넣을 때(oilIn<1): 위에서 떨어져 바닥으로
    const drop = S.oilIn < 1, oyIn = lerp(JAR_H + 0.4, yMin, S.oilIn * S.oilIn);
    // 흔들기: 갈라져 둘레를 돌다가(원반) 다시 모인다
    const sh = S.shake, split = sh <= 0 ? 0 : sh < 0.3 ? sh / 0.3 : sh < 0.7 ? 1 : 1 - (sh - 0.7) / 0.3;
    oil.visible = split < 0.98; oil.scale.set(sxz * (1 - 0.6 * split), sy * (1 - 0.6 * split), sxz * (1 - 0.6 * split));
    oil.position.set(Math.sin(S.t * 3) * 0.04 * split, drop ? oyIn : oy, 0);
    drops.forEach((d, i) => {
      d.visible = split > 0.02; const a = i / NDROP * Math.PI * 2 + S.t * 3.2, rr = 0.55 * split;
      d.position.set(Math.cos(a) * rr, oy + Math.sin(a * 2) * 0.04 * split, Math.sin(a) * rr); d.scale.setScalar(OIL_R * (0.32 + 0.1 * (i % 3)) * Math.max(0.2, split));
    });
    names.oil.position.set(-R - 0.45, (drop ? oyIn : oy) + 0.1, 0.3);
    // 물방울: 진행 앞부분 동안 스포이트에서 떨어져 수면 아래로 가라앉으며 사라짐
    let n = 0;
    if (S.dropper && S.ml > S.from && S.p > 0 && S.p < 0.75) for (let i = 0; i < 12; i++) {
      const life = (S.t * 1.7 + i / 12) % 1, y = lerp(JAR_H + 0.22, Y0 + 0.15, life), r = 0.045 * (y > top ? 1 : 1 - (top - y) / Math.max(0.3, top));
      if (r <= 0.005) continue; SC.set(r, r * 1.3, r); P.set(0.15 + Math.sin(i) * 0.04 * (y < top ? 1 : 0), y, Math.cos(i) * 0.04 * (y < top ? 1 : 0)); M.compose(P, Q, SC); wdrop.setMatrixAt(n++, M);
    }
    wdrop.count = n; wdrop.instanceMatrix.needsUpdate = true;
    lid.visible = S.lid; dropper.visible = S.dropper && !S.lid; names.water.visible = dropper.visible;
    g.rotation.y = S.shake > 0 && S.shake < 1 ? Math.sin(S.t * 9) * 0.05 * (1 - S.shake) : 0;
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, oil, drops, names };
  return g;
}

export default {
  view: { theta: 0.35, phi: 1.22 }, revealAt: 2,
  frame: [[-1.9, 0, -1.1], [1.6, 4.7, 1.1]],
  build(kit, world) { world.add('rig', buildRisingSun()); return {}; },
  // 비트마다 anim 으로 상태를 정한다(Player 는 앞 비트들의 anim(1)을 다시 적용한다. reset 은 첫 비트 것만 불린다)
  beats: [
    { text: '유리병에 에탄올을 넣고 붉은 식용유를 떨어뜨렸어요. 식용유는 에탄올보다 무거워서 바닥으로 가라앉아요.', show: ['rig'], dur: 6,
      reset(o) { o.rig.userData.set({ ml: 0, from: 0, p: 1, t: 0, oilIn: 0, shake: 0, lid: false, dropper: true }); },
      anim(p, o) { o.rig.userData.set({ oilIn: p, t: p * 6 }); } },
    { text: '이제 스포이트로 물을 조금씩 떨어뜨려요. 바닥의 식용유 덩어리는 어떻게 될까요? 먼저 예상해요.', show: ['rig'], dur: 5 },
    { text: '물은 에탄올보다 무거워 아래로 가라앉아 섞여요. 아래층이 무거워지자 식용유 덩어리가 떠올라 가운데쯤에서 둥근 「태양」이 되었어요.', show: ['rig'], dur: 8,
      anim(p, o) { o.rig.userData.set({ from: 0, ml: 20, p, t: 11 + p * 8 }); } },
    { text: '물을 너무 많이 넣으면 덩어리가 수면까지 떠올라 납작하게 퍼져요. 가운데에 뜨면 물을 그만 넣어요.', show: ['rig'], dur: 7,
      anim(p, o) { o.rig.userData.set({ from: 20, ml: 40, p, t: 19 + p * 7 }); } },
    { text: '물 20 mL로 다시 만든 태양을 뚜껑을 닫고 빙글빙글 흔들면, 여러 방울로 갈라져 함께 돌다가 다시 모여요. 태양과 행성도 돌던 가스와 먼지가 모여 생겼다고 해요(성운설).', show: ['rig'], dur: 9,
      anim(p, o) { o.rig.userData.set({ from: 20, ml: 20, p: 1, lid: true, dropper: false, shake: p, t: 26 + p * 9 }); } },
  ],
};
