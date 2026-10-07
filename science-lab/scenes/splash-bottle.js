import { THREE, mat, glassMat, label, relabel, roundedBoxGeometry, clamp01, lerp, seg } from './_kit.js';
import { HOLES, HEIGHTS, DATA, splashModel, spreadOf } from './splash-model.js';
export { HOLES, HEIGHTS, DATA, splashModel, spreadOf };
// 튀는 물방울(5-1 Ⅰ 과학자는 어떻게 탐구할까요) — 지도자료 1부 예시 탐구.
// 스탠드에 거꾸로 매단 페트병(뚜껑 구멍 1·3·5·7 mm)에서 잉크 물이 접시로 떨어지면, 둘레의 동심원 종이에 방울이 튄다.
// 높이는 접시 물 표면에서 뚜껑까지(1 cm = K). 종이가 주인공이라 높이는 줄여 그렸다(넓은 화면에서 종이가 너무 작아지지 않게). 종이에 남은 방울 수 = 그 회차의 측정값(splashModel).
const INK = 0x4b3fb5, WATER = 0.12, PAPER = 3.6, NDOT = 140, NFLY = 36, K = 0.05, BS = 0.62;   // K: 1 cm 의 길이(높이), BS: 페트병 크기
const rnd = (i, k = 1) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
// 동심원 종이(지도자료: 반지름 5 mm씩 커지는 원을 그린 A3 종이 — 화면에서는 간격을 키워 그린 모형)
function ringTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d');
  g.fillStyle = '#fbfaf6'; g.fillRect(0, 0, 1024, 1024); g.strokeStyle = '#9fb3cf'; g.lineWidth = 3;
  for (let r = 70; r < 512; r += 55) { g.beginPath(); g.arc(512, 512, r, 0, Math.PI * 2); g.stroke(); }
  g.strokeStyle = '#c8d3e2'; g.lineWidth = 2; g.beginPath(); g.moveTo(512, 0); g.lineTo(512, 1024); g.moveTo(0, 512); g.lineTo(1024, 512); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
// 높이 자(0~40 cm, 5 cm마다 숫자)
function rulerTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 1024; const g = c.getContext('2d');
  g.fillStyle = '#fffdf5'; g.fillRect(0, 0, 128, 1024); g.fillStyle = '#334155'; g.strokeStyle = '#334155'; g.lineWidth = 4; g.font = 'bold 40px sans-serif'; g.textBaseline = 'middle';
  for (let cm = 0; cm <= 40; cm++) {
    const y = 1012 - cm * 25, major = cm % 5 === 0;
    g.beginPath(); g.moveTo(0, y); g.lineTo(major ? 44 : 22, y); g.stroke();
    if (major && cm) g.fillText(String(cm), 52, y);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function buildSplash() {
  const g = new THREE.Group();
  const table = new THREE.Mesh(roundedBoxGeometry(7.0, 0.12, 4.6, 0.05), mat(0xe6dcc8, { roughness: 0.85 })); table.position.y = -0.06; table.userData.noFrame = true; g.add(table);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(PAPER, PAPER), new THREE.MeshStandardMaterial({ map: ringTexture(), roughness: 0.95 })); paper.rotation.x = -Math.PI / 2; paper.position.y = 0.004; g.add(paper);
  // 잉크 물 접시
  const dish = new THREE.Group();
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.14, 40, 1, true), glassMat(0xdcecf5, 0.45)); bowl.position.y = 0.07; dish.add(bowl);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.26, 40), glassMat(0xdcecf5, 0.45)); bottom.rotation.x = -Math.PI / 2; bottom.position.y = 0.006; dish.add(bottom);
  const pool = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.26, WATER - 0.01, 40), new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.88 })); pool.position.y = (WATER - 0.01) / 2 + 0.005; dish.add(pool);
  g.add(dish);
  // 스탠드: 받침 · 기둥 · 집게 팔
  const steel = mat(0x7d8794, { roughness: 0.35, metalness: 0.6 });
  const SX = -1.9, SZ = -0.9;
  const base = new THREE.Mesh(roundedBoxGeometry(0.9, 0.08, 0.6, 0.03), mat(0x3d4a56, { roughness: 0.5 })); base.position.set(SX, 0.04, SZ); g.add(base);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.6, 12), steel); pole.position.set(SX, 1.3, SZ); g.add(pole);
  const arm = new THREE.Group(), armLen = Math.hypot(SX, SZ);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, armLen, 10), steel); rod.rotation.z = Math.PI / 2; rod.position.x = -armLen / 2; arm.add(rod);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.025, 8, 32), steel); ring.rotation.x = Math.PI / 2; arm.add(ring);
  arm.rotation.y = Math.atan2(SZ, -SX); g.add(arm);   // 팔이 가운데(페트병)에서 기둥(왼쪽 뒤)까지
  // 거꾸로 매단 페트병: 뚜껑(구멍) · 목 · 몸통 · 잉크 물
  const bottle = new THREE.Group();
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 24), mat(0xe14b3a, { roughness: 0.5 })); cap.position.y = 0.05; bottle.add(cap);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshBasicMaterial({ color: 0x1b1530 })); hole.rotation.x = Math.PI / 2; hole.position.y = -0.002; bottle.add(hole);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.09, 0.35, 32, 1, true), glassMat(0xdcecf5, 0.35)); neck.position.y = 0.27; bottle.add(neck);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.33, 1.1, 32, 1, true), glassMat(0xdcecf5, 0.3)); body.position.y = 0.99; bottle.add(body);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), glassMat(0xdcecf5, 0.3)); top.position.y = 1.54; bottle.add(top);
  const inkMat = new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.15, transparent: true, opacity: 0.8 });
  const inkNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.08, 0.33, 32), inkMat); inkNeck.position.y = 0.27; bottle.add(inkNeck);
  const inkBody = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.31, 0.5, 32), inkMat); inkBody.position.y = 0.69; bottle.add(inkBody);
  bottle.scale.setScalar(BS); g.add(bottle);
  // 물줄기: 굵은 구멍은 한 줄로 이어진 기둥, 1 mm는 작은 방울이 줄지어 떨어진다(지도자료 설명)
  const streamMat = new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.1, transparent: true, opacity: 0.85 });
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 16), streamMat); stream.geometry.translate(0, -0.5, 0); g.add(stream);
  const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), streamMat, 40); g.add(beads);
  // 종이에 남은 방울 + 날아가는 방울
  const dotGeo = new THREE.CircleGeometry(1, 14); dotGeo.rotateX(-Math.PI / 2);
  const dots = new THREE.InstancedMesh(dotGeo, new THREE.MeshBasicMaterial({ color: INK }), NDOT); dots.position.y = 0.008; g.add(dots);
  const fly = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshStandardMaterial({ color: INK, roughness: 0.2 }), NFLY); g.add(fly);
  // 높이 자(접시 물 표면 = 0)
  const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.16, 40 * K, 0.03), [mat(0xfffdf5), mat(0xfffdf5), mat(0xfffdf5), mat(0xfffdf5), new THREE.MeshStandardMaterial({ map: rulerTexture(), roughness: 0.8 }), mat(0xfffdf5)]);
  ruler.position.set(0.62, WATER + 20 * K - 0.012, 0.15); g.add(ruler);
  const mark = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.02), mat(0xe14b3a, { emissive: 0xe14b3a, emissiveIntensity: 0.4 })); g.add(mark);
  const names = { bottle: label('페트병 · 구멍 3 mm', { size: 0.26 }), height: label('높이 15 cm', { size: 0.26 }), dish: label('잉크 물 접시', { size: 0.24 }), count: label('튄 방울 0개', { size: 0.28 }) };
  names.dish.position.set(-1.0, 0.3, 0.5); names.count.position.set(1.15, 0.3, PAPER / 2 - 0.1);
  for (const n of Object.values(names)) g.add(n);

  const S = { hole: 3, height: 15, phase: 0, trial: 1, t: 0 };
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  const draw = () => {
    const capY = WATER + S.height * K, r = S.hole * 0.012, m = splashModel(S.hole, S.height), spread = spreadOf(S.hole, S.height);
    bottle.position.y = capY; hole.scale.setScalar(Math.max(0.012, r) / BS); arm.position.set(0, capY + 0.7 * BS, 0);
    names.bottle.position.set(0.95, capY + 1.2 * BS, 0); relabel(names.bottle, `페트병 · 구멍 ${S.hole} mm`, { size: 0.26 });
    mark.position.set(0.62, capY, 0.15); names.height.position.set(1.15, capY, 0.15); relabel(names.height, `높이 ${S.height} cm`, { size: 0.26 });
    // 물줄기: 0~0.35 사이에 뚜껑에서 접시까지 내려오고, 그 뒤에는 계속 흐른다
    const fall = seg(S.phase, 0, 0.35), len = (capY - WATER) * fall, on = S.phase > 0;
    const dashed = S.hole === 1;
    stream.visible = on && !dashed; stream.scale.set(r, Math.max(0.001, len), r); stream.position.y = capY;
    let k = 0;
    if (on && dashed) for (let i = 0; i < 40; i++) {
      const y = capY - ((i / 40 + S.t * 1.6) % 1) * (capY - WATER);
      if (capY - y > len) continue;
      SC.set(0.02, 0.03, 0.02); P.set(0, y, 0); M.compose(P, Q, SC); beads.setMatrixAt(k++, M);
    }
    beads.count = k; beads.instanceMatrix.needsUpdate = true;
    // 종이의 방울: 0.35 뒤부터 이번 회차 값만큼 차례로(한 회차 = 새 종이)
    const n = Math.round(Math.min(NDOT, (m.trials[S.trial - 1] ?? m.trials[0]) * 0.55)), shown = Math.round(n * seg(S.phase, 0.35, 0.95));
    k = 0;
    for (let i = 0; i < shown; i++) {
      const a = rnd(i, S.trial * 7 + S.hole) * Math.PI * 2, u = rnd(i, S.trial * 3 + 2);
      const near = S.hole === 1 ? Math.pow(u, 1.8) : Math.pow(u, 0.7);           // 가는 줄기: 가까이 몰림 · 굵은 줄기: 멀리 흩어짐
      const rr = 0.4 + near * spread * 1.3, s = 0.022 + rnd(i, 5) * (S.hole === 1 ? 0.02 : 0.04);
      SC.set(s, 1, s * (0.8 + rnd(i, 9) * 0.5)); P.set(Math.cos(a) * rr, 0, Math.sin(a) * rr); M.compose(P, Q, SC); dots.setMatrixAt(k++, M);
    }
    dots.count = k; dots.instanceMatrix.needsUpdate = true;
    // 튀어 오르는 방울(포물선)
    k = 0;
    if (S.phase > 0.35 && S.phase < 1) for (let i = 0; i < NFLY; i++) {
      const life = (S.t * 1.8 + rnd(i, 21)) % 1, a = rnd(i, 22) * Math.PI * 2, rr = 0.3 + life * (0.3 + spread * 1.1 * rnd(i, 23));
      const h = WATER + 0.05 + Math.sin(life * Math.PI) * (0.25 + 0.25 * spread);
      SC.setScalar(0.026); P.set(Math.cos(a) * rr, h, Math.sin(a) * rr); M.compose(P, Q, SC); fly.setMatrixAt(k++, M);
    }
    fly.count = k; fly.instanceMatrix.needsUpdate = true;
    names.count.visible = S.phase >= 0.95; relabel(names.count, `${S.trial}회 · 튄 방울 ${m.trials[S.trial - 1]}개`, { size: 0.28 });
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, names, dots, beads, stream };
  return g;
}

export default {
  view: { theta: 0.35, phi: 0.92 }, revealAt: 2,
  frame: [[-2.0, 0, -1.85], [1.85, 2.9, 1.85]],
  build(kit, world) { world.add('rig', buildSplash()); return {}; },
  // 비트마다 anim 으로 상태를 정한다(Player 는 앞 비트들의 anim(1)을 다시 적용한다. reset 은 첫 비트 것만 불린다)
  beats: [
    { text: '페트병의 잉크 물이 물줄기로 접시에 떨어지면 둘레의 종이에 방울이 튀어요. 무엇이 튀는 양을 바꿀까요?', show: ['rig'], dur: 5,
      reset(o) { o.rig.userData.set({ hole: 3, height: 15, phase: 0, trial: 1, t: 0 }); } },
    { text: '구멍을 가늘게 하면 튄 방울이 많아질까요, 적어질까요? 먼저 예상해요. 바꾸는 것은 구멍 하나뿐이에요.', show: ['rig'], dur: 5,
      anim(p, o) { o.rig.userData.set({ phase: 0.3 * p, t: p * 5 }); } },
    { text: '1 mm 구멍 — 가는 물줄기는 작은 방울로 끊어져 떨어지며 수면과 여러 번 부딪혀서 많이 튀어요. 세 번 잰 평균이 약 101개예요.', show: ['rig'], dur: 6,
      anim(p, o) { o.rig.userData.set({ hole: 1, height: 15, phase: p, t: 5 + p * 6 }); } },
    { text: '7 mm 구멍 — 굵은 물줄기는 한 줄로 이어져 떨어져서 겨우 10개쯤 튀어요. 높이와 잉크 양은 그대로 두었어요.', show: ['rig'], dur: 6,
      anim(p, o) { o.rig.userData.set({ hole: 7, height: 15, phase: p, t: 11 + p * 6 }); } },
    { text: '높이를 35 cm로 올리면 같은 1 mm 구멍에서도 228개까지 늘어요. 높을수록 세게 부딪히기 때문이에요.', show: ['rig'], dur: 6,
      anim(p, o) { o.rig.userData.set({ hole: 1, height: 35, phase: p, t: 17 + p * 6 }); } },
    { text: '한 번만 재면 우연일 수 있어요. 세 번 재어 평균을 내고, 표와 그래프로 정리한 뒤 결론을 짧게 써요. 이것이 과학자가 탐구하는 방법이에요.', show: ['rig'], dur: 7,
      anim(p, o) { o.rig.userData.set({ trial: p < 0.33 ? 1 : p < 0.66 ? 2 : 3, phase: 0.95 + 0.05 * p, t: 23 + p * 7 }); } },
  ],
};
