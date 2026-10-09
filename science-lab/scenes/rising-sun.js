import { THREE, label, roundedBoxGeometry, clamp01, lerp, seg } from './_kit.js';
import { fresnel, thickGlass, liquidMat, lathe, round, reagentBottle, labTable, labTray, glassJar, jarLid, beakerMesh } from './glassware.js';
import { WATERS, OIL, ETHANOL, SHAPES, sunModel } from './rising-sun-model.js';
export { WATERS, OIL, ETHANOL, SHAPES, sunModel };
// 떠오르는 태양(5-1 Ⅲ 태양계와 별) — 원본 5-D 「떠오르는 태양」.
// 유리병의 에탄올 속에 붉은 식용유 덩어리가 가라앉아 있고, 스포이트로 물을 떨어뜨리면 아래층이 무거워져 덩어리가 떠오른다.
// 뚜껑을 닫고 빙글빙글 흔들면 덩어리가 여러 방울로 갈라져 함께 돌다가 다시 하나로 모인다(태양계가 생긴 성운설에 빗대어 봄).
const R = 0.95, JAR_H = 3.1, Y0 = 0.1, PER = 0.045;          // 병 안 반지름 · 높이 · 바닥 · 물 1 mL당 액체 높이
const OIL_R = 0.34, NDROP = 7;
const level = (ml) => Y0 + PER * (20 + ml);                   // 액체 윗면 높이(에탄올 20 mL + 물)

// 물이 섞이며 생기는 아지랑이 줄(굴절률 차이로 보이는 줄무늬): 세로로 흐르는 가는 물결선
function streakTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 512; const g = c.getContext('2d'); g.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    const x0 = (i / 26) * 256 + Math.sin(i * 7.3) * 6, amp = 4 + (i % 5) * 2.2, ph = i * 1.7;
    g.strokeStyle = `rgba(${i % 3 ? '235,245,255' : '160,200,235'},${0.35 + (i % 4) * 0.12})`; g.lineWidth = 1.2 + (i % 3) * 0.9;
    g.beginPath(); for (let y = 0; y <= 512; y += 8) { const x = x0 + Math.sin(y / 46 + ph) * amp + Math.sin(y / 17 + ph * 2) * amp * 0.35; y ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1); return t;
}
// 아래가 무거운(물이 많이 섞인) 층: 아래쪽만 아주 옅은 푸른 기운
function layerTexture() {
  const c = document.createElement('canvas'); c.width = 4; c.height = 256; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0, 'rgba(128,182,232,0.42)'); gr.addColorStop(0.5, 'rgba(176,210,240,0.14)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// 병에 붙인 종이 눈금 띠(0~10): 흰 종이 · 1칸 짧은 금 · 5칸마다 긴 금과 숫자 · 가장자리 그림자
function scaleTexture() {
  const c = document.createElement('canvas'); c.width = 160; c.height = 1024; const g = c.getContext('2d');
  g.fillStyle = '#fbfaf5'; g.fillRect(0, 0, 160, 1024); g.fillStyle = 'rgba(0,0,0,0.06)'; g.fillRect(0, 0, 160, 6); g.fillRect(154, 0, 6, 1024);
  g.strokeStyle = '#1f2a44'; g.fillStyle = '#1f2a44'; g.font = '800 52px Pretendard, sans-serif'; g.textBaseline = 'middle';
  for (let k = 0; k <= 20; k++) { const y = 1000 - k * 48.8; g.lineWidth = k % 2 ? 3 : 5; g.beginPath(); g.moveTo(8, y); g.lineTo(k % 10 === 0 ? 70 : k % 2 ? 30 : 48, y); g.stroke(); if (k % 10 === 0) g.fillText(String(k / 2), 80, y + 2); else if (k % 2 === 0 && k / 2 === 5) g.fillText('5', 80, y + 2); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
export function buildRisingSun() {
  const g = new THREE.Group();
  // 실험대(나뭇결) — 맨 앞 자식(교재 렌더가 크기를 바꿔 쓴다)
  const table = labTable(); g.add(table);
  // 흰 실험 받침(트레이)
  const tray = labTray(); tray.position.set(0.05, 0, 0.05); g.add(tray);
  const lift = 0.025;   // 받침 두께만큼 올려 놓기
  const jarG = new THREE.Group(); jarG.position.y = lift; g.add(jarG);
  // 두꺼운 유리병(glassware.js)
  const { group: jarBody, NR, T } = glassJar({ R, H: JAR_H, Y0 }); jarG.add(jarBody);
  // 액체(에탄올 + 섞인 물): 옆면 기둥(높이로 늘임) + 오목한 윗면(메니스커스, 늘이지 않음)
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.004, R - 0.004, 1, 72, 1, true), liquidMat()); liquid.geometry.translate(0, 0.5, 0); liquid.position.y = Y0; liquid.renderOrder = 3; jarG.add(liquid);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(R - 0.004, 72), liquidMat()); floor.rotation.x = -Math.PI / 2; floor.position.y = Y0 + 0.002; jarG.add(floor);
  const layerMat = new THREE.MeshBasicMaterial({ map: layerTexture(), transparent: true, opacity: 0, depthWrite: false });
  const layer = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.012, R - 0.012, 1, 72, 1, true), layerMat); layer.geometry.translate(0, 0.5, 0); layer.position.y = Y0; layer.renderOrder = 4; jarG.add(layer);
  const streakTex = streakTexture(), streakMat = new THREE.MeshBasicMaterial({ map: streakTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const streak = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.55, R * 0.8, 1, 48, 1, true), streakMat); streak.geometry.translate(0, 0.5, 0); streak.position.y = Y0; streak.renderOrder = 4; jarG.add(streak);
  const surf = new THREE.Mesh(lathe([[0, 0], [R * 0.78, 0.004], [R * 0.93, 0.018], [R - 0.004, 0.055]], 72), fresnel(new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transparent: true, opacity: 0.16, clearcoat: 1, clearcoatRoughness: 0.01, envMapIntensity: 1.8, side: THREE.DoubleSide, depthWrite: false }), { edge: 0.7, pow: 1.6 }));
  surf.renderOrder = 5; jarG.add(surf);
  const meniscus = new THREE.Mesh(new THREE.TorusGeometry(R - 0.012, 0.012, 8, 96), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1, depthWrite: false }));
  meniscus.rotation.x = Math.PI / 2; meniscus.renderOrder = 6; jarG.add(meniscus);
  // 종이 눈금 띠: 병 바깥에 휘어 붙인다(액체 바닥 0 ~ 수면 10에 맞춰 늘어난다)
  const scale = new THREE.Mesh(new THREE.CylinderGeometry(R + T + 0.006, R + T + 0.006, 1, 12, 1, true, 0.68, 0.28), new THREE.MeshStandardMaterial({ map: scaleTexture(), roughness: 0.85, side: THREE.FrontSide }));
  scale.geometry.translate(0, 0.5, 0); scale.position.y = Y0; scale.renderOrder = 7; jarG.add(scale);
  const lid = jarLid(NR, T);
  lid.position.y = JAR_H - 0.12; jarG.add(lid);
  // 붉은 식용유 덩어리: 가운데는 빛이 비쳐 밝은 주황, 가장자리는 짙은 빨강(반투명한 기름)
  const oilMat = fresnel(new THREE.MeshPhysicalMaterial({ color: 0xc8230c, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02, transparent: true, opacity: 0.9, envMapIntensity: 1.3, emissive: 0x5a0a00, emissiveIntensity: 0.35 }),
    { edge: 0.99, pow: 1.25, core: 'vec3(1.18, 0.98, 0.82)', rim: 'vec3(0.42, 0.1, 0.08)' });
  const oil = new THREE.Mesh(new THREE.SphereGeometry(OIL_R, 64, 40), oilMat); oil.renderOrder = 4; jarG.add(oil);
  const drops = Array.from({ length: NDROP }, () => { const d = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), oilMat); d.visible = false; d.renderOrder = 4; jarG.add(d); return d; });
  // 스포이트(물): 가늘어지는 유리관 + 관 속 물 + 고무 꼭지 + 떨어지는 물방울
  const dropper = new THREE.Group();
  const tube = new THREE.Mesh(lathe(round([[0.012, 0], [0.03, 0.05, 0.02], [0.07, 0.42, 0.04], [0.07, 1.12], [0.085, 1.14]]), 32), thickGlass(0xe8f3f8, 0.12)); dropper.add(tube);
  const water = new THREE.Mesh(lathe([[0.008, 0.03], [0.022, 0.08], [0.055, 0.42], [0.055, 0.62], [0, 0.62]], 24), new THREE.MeshPhysicalMaterial({ color: 0x7fb9e8, roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1 })); dropper.add(water);
  const bulb = new THREE.Mesh(lathe(round([[0.088, 1.1], [0.15, 1.18, 0.05], [0.17, 1.42, 0.12], [0.1, 1.56, 0.06], [0, 1.58]]), 40), new THREE.MeshPhysicalMaterial({ color: 0x2b2d33, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.4 })); dropper.add(bulb);
  dropper.position.set(0.15, JAR_H + 0.22, 0); jarG.add(dropper);
  const wdrop = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 10), fresnel(new THREE.MeshPhysicalMaterial({ color: 0xa9d4f5, roughness: 0.03, transparent: true, opacity: 0.35, clearcoat: 1, envMapIntensity: 1.6 }), { edge: 0.9, pow: 1.5 }), 12); wdrop.renderOrder = 5; jarG.add(wdrop);
  // 배경 소품: 에탄올 시약병 · 물 비커 (맞춤에서 뺀다)
  const eth = reagentBottle('에탄올', 'C₂H₅OH · 20 mL', 0x4a2508, 0x1d1f24, '#c2581c'); eth.position.set(-1.75, 0, -1.15); eth.rotation.y = 0.35; g.add(eth);
  const beaker = beakerMesh();
  beaker.position.set(1.62, 0, -0.95); beaker.traverse((o) => { o.userData.noFrame = true; }); g.add(beaker);
  const names = { jar: label('에탄올', { size: 0.26 }), oil: label('붉은 식용유', { size: 0.26 }), water: label('물(스포이트)', { size: 0.24 }) };   // 눈금 띠는 숫자가 적혀 있어 따로 이름표를 달지 않는다
  names.water.position.set(0.95, JAR_H + 1.35, 0);
  for (const n of Object.values(names)) g.add(n);

  const S = { ml: 0, p: 1, from: 0, t: 0, oilIn: 1, shake: 0, lid: false, dropper: true };
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  const draw = () => {
    const prevMl = S.from, ml = lerp(prevMl, S.ml, clamp01(S.p * 1.4));            // 물은 앞부분에 다 들어가고
    const top = level(ml), h = top - Y0;
    liquid.scale.y = h; layer.scale.y = h; streak.scale.y = h; surf.position.y = top - 0.04; meniscus.position.y = top + 0.006; scale.scale.y = h;
    layerMat.opacity = clamp01(ml / 25) * 0.85;
    // 물이 막 섞이는 동안 아지랑이 줄이 아래로 흐르다 잦아든다
    const mixing = S.ml > S.from ? Math.sin(Math.PI * clamp01(S.p * 1.15)) : 0;
    streakMat.opacity = 0.55 * mixing; streakTex.offset.y = S.t * 0.35; streakTex.offset.x = S.t * 0.04;
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
    names.oil.position.set(-R - 0.5, (drop ? oyIn : oy) + lift + 0.1, 0.3);
    names.jar.position.set(R + 0.7, Y0 + lift + h * 0.82, 0.2);   // 오른쪽: 왼쪽 뒤의 에탄올 시약병과 겹치지 않게
    // 떠 있는 동안 아주 느리게 출렁(기름 덩어리의 살아 있는 느낌)
    if (!drop && split === 0 && flat < 0.5) { const w = Math.sin(S.t * 2.1) * 0.025; oil.scale.x *= 1 + w; oil.scale.z *= 1 + w; oil.scale.y *= 1 - w; }
    // 물방울: 진행 앞부분 동안 스포이트에서 떨어져 수면 아래로 가라앉으며 사라짐
    let n = 0;
    if (S.dropper && S.ml > S.from && S.p > 0 && S.p < 0.75) for (let i = 0; i < 12; i++) {
      const life = (S.t * 1.7 + i / 12) % 1, y = lerp(JAR_H + 0.22, Y0 + 0.15, life), r = 0.045 * (y > top ? 1 : 1 - (top - y) / Math.max(0.3, top));
      if (r <= 0.005) continue; SC.set(r, r * 1.3, r); P.set(0.15 + Math.sin(i) * 0.04 * (y < top ? 1 : 0), y, Math.cos(i) * 0.04 * (y < top ? 1 : 0)); M.compose(P, Q, SC); wdrop.setMatrixAt(n++, M);
    }
    wdrop.count = n; wdrop.instanceMatrix.needsUpdate = true;
    lid.visible = S.lid; dropper.visible = S.dropper && !S.lid; names.water.visible = dropper.visible;
    jarG.rotation.y = S.shake > 0 && S.shake < 1 ? Math.sin(S.t * 9) * 0.05 * (1 - S.shake) : 0;
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, oil, drops, names, props: [eth, beaker] };
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
