import { THREE, label, relabel, roundedBoxGeometry, clamp01, lerp } from './_kit.js';
import { FRIENDS, ROUNDS, RULES, WASHERS, glitterAfter, glitterModel } from './glitter-model.js';
export { FRIENDS, ROUNDS, RULES, WASHERS, glitterAfter, glitterModel };
// 반짝이 가루 손 모형(3-2 Ⅳ 감염병과 건강한 생활) — 여섯 친구가 둥글게 서서 정해진 짝끼리 차례로 악수한다.
// A의 손에만 반짝이 가루가 묻어 있다. 반짝이는 병원체가 아니라 「손으로 옮겨 가는 것」을 눈으로 보게 하는 표식이다.
// 「B·D·F가 손 씻기」를 고르면 차례마다 악수 전에 B·D·F의 손에서 반짝이가 비누 거품과 함께 씻겨 나간다.
// 기침 장면(비말): A가 기침하면 작은 침방울이 앞으로 퍼지고, 옷소매로 가리면 거의 퍼지지 않는다.
const RAD = 1.2, SHOULDER = 0.98, ARM = 0.5;
const SHIRT = [0xe35d5b, 0x3d7dd8, 0xf2b234, 0x4aa36c, 0x8b62c9, 0x2fa8b5];
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const bell = (p) => Math.sin(Math.PI * clamp01(p));

function sparkleTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,240,1)'); r.addColorStop(0.25, 'rgba(255,215,90,.95)'); r.addColorStop(1, 'rgba(255,190,40,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 3; g.beginPath(); g.moveTo(32, 4); g.lineTo(32, 60); g.moveTo(4, 32); g.lineTo(60, 32); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
let SPARK;
function glitterOn(hand, n = 26) {
  SPARK ||= sparkleTexture();
  const pos = new Float32Array(n * 3); let s = hand.id * 97 + 3; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < n; i++) { const a = r() * 6.283, b = Math.acos(2 * r() - 1), d = 0.055 + r() * 0.02; pos.set([Math.sin(b) * Math.cos(a) * d, Math.cos(b) * d, Math.sin(b) * Math.sin(a) * d], i * 3); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.Points(geo, new THREE.PointsMaterial({ map: SPARK, size: 0.26, transparent: true, opacity: 0, depthWrite: false, color: 0xffc928 }));
  m.renderOrder = 6; hand.add(m); return m;
}
function bubblesOn(hand) {
  const g = new THREE.Group(), mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0, clearcoat: 1, depthWrite: false });
  for (let i = 0; i < 7; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.022 + (i % 3) * 0.01, 14, 10), mat); b.position.set(Math.sin(i * 2.3) * 0.06, Math.cos(i * 1.7) * 0.05, Math.sin(i * 3.1) * 0.05); g.add(b); }
  g.userData.mat = mat; hand.add(g); return g;
}
// 친구 한 명: 다리·몸·머리·머리카락·두 팔(어깨 축이 +Z로 팔을 뻗는다)
function kid(i) {
  const g = new THREE.Group(), skin = new THREE.MeshStandardMaterial({ color: 0xf6d2b4, roughness: 0.6 }), shirt = new THREE.MeshStandardMaterial({ color: SHIRT[i], roughness: 0.55 });
  const pants = new THREE.MeshStandardMaterial({ color: 0x2c3a5a, roughness: 0.7 });
  g.scale.setScalar(1.35); for (const x of [-0.08, 0.08]) { const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.38, 6, 14), pants); leg.position.set(x, 0.25, 0); g.add(leg); }
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.36, 8, 24), shirt); body.position.y = 0.76; body.scale.set(1, 1, 0.75); g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 24), skin); head.position.y = 1.2; g.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.178, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), new THREE.MeshStandardMaterial({ color: 0x2b211c, roughness: 0.8 })); hair.position.y = 1.215; hair.rotation.x = -0.25; g.add(hair);
  const eyeM = new THREE.MeshStandardMaterial({ color: 0x1f2a44 });
  for (const x of [-0.06, 0.06]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), eyeM); e.position.set(x, 1.22, 0.155); g.add(e); }
  const mouth = new THREE.Object3D(); mouth.position.set(0, 1.13, 0.17); g.add(mouth);
  const arms = [-1, 1].map((side) => {
    const pivot = new THREE.Group(); pivot.position.set(side * 0.21, SHOULDER, 0); g.add(pivot);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, ARM - 0.09, 6, 12), shirt); arm.rotation.x = Math.PI / 2; arm.position.z = ARM / 2 - 0.02; pivot.add(arm);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 14), skin.clone()); hand.position.z = ARM; pivot.add(hand);   // 반짝이가 묻으면 손이 금빛으로 빛난다
    return { pivot, hand, side, glit: glitterOn(hand), bub: bubblesOn(hand) };
  });
  // 바닥의 금빛 고리: 반짝이가 묻은 친구를 멀리서도 셀 수 있게
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.33, 48), new THREE.MeshBasicMaterial({ color: 0xffb800, transparent: true, opacity: 0, depthWrite: false }));
  halo.rotation.x = -Math.PI / 2; halo.position.y = 0.012; g.add(halo);
  g.userData = { arms, mouth, halo, id: FRIENDS[i] };
  return g;
}

export function buildGlitterRoom({ letters = true } = {}) {
  const g = new THREE.Group();
  const floor = new THREE.Mesh(roundedBoxGeometry(5.2, 0.06, 4.6, 0.08), new THREE.MeshStandardMaterial({ color: 0xe9e1d2, roughness: 0.85 })); floor.position.y = -0.03; floor.userData.noFrame = true; g.add(floor);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(2.05, 64), new THREE.MeshStandardMaterial({ color: 0xcfe0ef, roughness: 0.9 })); rug.rotation.x = -Math.PI / 2; rug.position.y = 0.002; rug.userData.noFrame = true; g.add(rug);
  const kids = FRIENDS.map((f, i) => { const k = kid(i), a = -Math.PI / 2 + i * (Math.PI / 3); k.position.set(Math.cos(a) * RAD, 0, Math.sin(a) * RAD); k.lookAt(0, 0, 0); g.add(k); return k; });
  // 팔 자세: 쉬기(아래로) · 짝에게 뻗기(두 사람 사이 가운데) · 입 가리기(옷소매)
  const tmp = new THREE.Object3D(), W = new THREE.Vector3(), L = new THREE.Vector3();
  const aimQ = (k, arm, world) => { k.updateMatrixWorld(true); L.copy(world); k.worldToLocal(L); tmp.position.copy(arm.pivot.position); tmp.lookAt(L); return tmp.quaternion.clone(); };
  kids.forEach((k) => k.userData.arms.forEach((arm) => { tmp.position.copy(arm.pivot.position); tmp.lookAt(arm.pivot.position.x * 1.6, 0, 0.08); arm.rest = tmp.quaternion.clone(); arm.pivot.quaternion.copy(arm.rest); }));
  const idx = (f) => FRIENDS.indexOf(f);
  // 짝에게 가까운 쪽 팔(로컬 x 부호)로 두 사람 사이 가운데를 향한다
  const reach = {};
  for (const r of ROUNDS) for (const [a, b] of r) for (const [me, you] of [[a, b], [b, a]]) {
    const K = kids[idx(me)], Y = kids[idx(you)]; W.copy(K.position).add(Y.position).multiplyScalar(0.5).multiplyScalar(0.86); W.y = 0.86;
    L.copy(Y.position); K.worldToLocal(L); const arm = K.userData.arms[L.x > 0 ? 1 : 0];
    reach[`${me}>${you}`] = { arm, q: aimQ(K, arm, W) };
  }
  const COVER_LEN = 0.6;   // 어깨→입 거리 ÷ 팔 길이(굽힌 팔)
  const coverQ = (() => { const K = kids[0], arm = K.userData.arms[1]; K.updateMatrixWorld(true); const m = K.userData.mouth.getWorldPosition(new THREE.Vector3()); m.y -= 0.02; return aimQ(K, arm, m); })();
  // 기침 침방울(A의 입에서 원 가운데 쪽으로)
  const NDROP = 150, dpos = new Float32Array(NDROP * 3), dgeo = new THREE.BufferGeometry(); dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  const drops = new THREE.Points(dgeo, new THREE.PointsMaterial({ color: 0x2f7fc4, size: 0.055, transparent: true, opacity: 0, depthWrite: false })); drops.renderOrder = 6; g.add(drops);
  const seeds = Array.from({ length: NDROP }, (_, i) => { const h = (x) => { const v = Math.sin(x) * 43758.5453; return v - Math.floor(v); }; return { a: (h(i * 1.7) - 0.5) * 0.9, b: (h(i * 3.3) - 0.5) * 0.5, sp: 0.6 + h(i * 7.1) * 0.6 }; });
  const tags = letters ? kids.map((k) => { const t = label(k.userData.id, { size: 0.17 }); t.position.copy(k.position).setY(2.12); g.add(t); return t; }) : [];
  const names = { wash: label('비누와 흐르는 물로 손 씻기', { size: 0.19 }), cough: label('기침 침방울(비말)', { size: 0.19 }) };
  names.wash.position.set(1.95, 1.5, 0.95); names.cough.position.set(-0.25, 1.6, 0.25);
  for (const x of Object.values(names)) g.add(x);
  const S = { round: 0, rule: 0, t: 0, cough: 0, sleeve: false, glow: 1 };
  const setGlit = (k, v) => { k.userData.halo.material.opacity = 0.85 * v * S.glow; k.userData.arms.forEach((a) => { a.glit.material.opacity = v * S.glow; a.hand.material.emissive.setHex(0xffa000); a.hand.material.emissiveIntensity = 1.1 * v * S.glow; a.hand.material.color.setHex(v > 0.5 ? 0xffd23a : 0xf6d2b4); }); };
  const draw = () => {
    const r = Math.min(3, Math.floor(S.round + 1e-6)), p = S.round - r, cur = r < 3 ? ROUNDS[r] : [];
    const before = new Set(glitterAfter(r, S.rule)), washers = r < 3 && p > 0 ? WASHERS[S.rule] : [];
    const wash = smooth(0.02, 0.28, p), shake = r < 3 ? bell(smooth(0.3, 1, p)) : 0, give = smooth(0.62, 0.78, p);
    kids.forEach((k) => { k.userData.arms.forEach((a) => { a.pivot.quaternion.copy(a.rest); a.pivot.scale.setScalar(1); a.bub.userData.mat.opacity = 0; }); });
    // 이번 차례: 씻는 친구 → 반짝이 지우기, 악수 → 짝에게 옮기기
    const after = new Set(before); for (const w of washers) after.delete(w);
    const gets = new Set(); if (r < 3) for (const [a, b] of cur) if (after.has(a) || after.has(b)) { if (!after.has(a)) gets.add(a); if (!after.has(b)) gets.add(b); }
    kids.forEach((k) => { const f = k.userData.id; let v = before.has(f) ? 1 : 0;
      if (washers.includes(f) && before.has(f)) v = 1 - wash;
      if (gets.has(f)) v = give;
      setGlit(k, v);
      if (washers.includes(f)) k.userData.arms.forEach((a) => { a.bub.userData.mat.opacity = bell(smooth(0.0, 0.32, p)) * 0.85; a.bub.rotation.y = S.t * 3; });
    });
    if (shake > 0) for (const [a, b] of cur) for (const [me, you] of [[a, b], [b, a]]) { const R = reach[`${me}>${you}`]; R.arm.pivot.quaternion.copy(R.arm.rest).slerp(R.q, shake); }
    // 기침
    const K0 = kids[0], arm0 = K0.userData.arms[1];
    // 소매로 가리기: 팔을 입 쪽으로 들고(팔꿈치를 굽힌 것처럼 짧게) 손목이 입 앞에 오게 한다
    if (S.cough > 0 && S.sleeve) { const k = Math.min(1, S.cough * 3); arm0.pivot.quaternion.copy(arm0.rest).slerp(coverQ, k); arm0.pivot.scale.set(1, 1, lerp(1, COVER_LEN, k)); }
    const m0 = K0.userData.mouth.getWorldPosition(W), fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(K0.quaternion), side = new THREE.Vector3(1, 0, 0).applyQuaternion(K0.quaternion);
    const reachD = S.sleeve ? 0.12 : 1.5, c = clamp01(S.cough);
    for (let i = 0; i < NDROP; i++) { const s = seeds[i], d = Math.min(reachD, c * s.sp * 1.9), y = -d * d * 0.18 + s.b * d;
      dpos.set([m0.x + fwd.x * d + side.x * s.a * d, m0.y + y, m0.z + fwd.z * d + side.z * s.a * d], i * 3); }
    dgeo.attributes.position.needsUpdate = true; drops.material.opacity = c > 0 ? 0.9 * (1 - smooth(0.85, 1, c)) : 0;
    names.wash.visible = washers.length > 0 && p > 0 && p < 0.4; names.cough.visible = c > 0.05;
    for (const k of kids) k.userData.arms.forEach((a) => { a.glit.material.size = 0.22 + 0.05 * Math.sin(S.t * 6 + a.hand.id); });
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, kids, tags, names };
  return g;
}

export default {
  view: { theta: 0, phi: 0.9 }, revealAt: 2,
  frame: [[-1.8, 0, -1.8], [1.8, 1.7, 1.8]],
  build(kit, world) { world.add('room', buildGlitterRoom()); return {}; },
  beats: [
    { text: '친구 여섯 명이 둥글게 섰어요. A의 손에만 반짝이 가루를 묻혔어요. 반짝이는 병원체가 아니라, 손으로 무엇이 옮겨 가는지 보이게 하는 표시예요.', show: ['room'], dur: 7,
      reset(o) { o.room.userData.set({ round: 0, rule: 0, cough: 0, t: 0 }); },
      anim(p, o) { o.room.userData.set({ t: p * 7 }); } },
    { text: '정해진 짝끼리 세 차례 악수하면 반짝이가 묻은 친구는 몇 명이 될까요? 아무도 손을 씻지 않을 때와 B·D·F가 차례마다 손을 씻을 때를 먼저 예상해요.', show: ['room'], dur: 6,
      anim(p, o) { o.room.userData.set({ t: 7 + p * 6 }); } },
    { text: '아무도 손을 씻지 않았어요. 1차례 뒤 2명, 2차례 뒤 4명, 3차례 뒤에는 6명 모두의 손에 반짝이가 묻었어요.', show: ['room'], dur: 10,
      reset(o) { o.room.userData.set({ rule: 0, round: 0 }); },
      anim(p, o) { o.room.userData.set({ rule: 0, round: 3 * p, t: 13 + p * 10 }); } },
    { text: '이번에는 B·D·F가 악수 전에 비누와 흐르는 물로 손을 씻었어요. 세 차례가 지나도 반짝이가 묻은 친구는 2명이었어요.', show: ['room'], dur: 10,
      reset(o) { o.room.userData.set({ rule: 1, round: 0 }); },
      anim(p, o) { o.room.userData.set({ rule: 1, round: 3 * p, t: 23 + p * 10 }); } },
    { text: '기침을 하면 작은 침방울(비말)이 앞으로 퍼져요. 휴지나 옷소매 안쪽으로 입과 코를 가리면 침방울이 거의 퍼지지 않아요.', show: ['room'], dur: 8,
      reset(o) { o.room.userData.set({ rule: 0, round: 0, cough: 0, sleeve: false }); },
      anim(p, o) { o.room.userData.set(p < 0.5 ? { cough: p * 2, sleeve: false, t: 33 + p * 8 } : { cough: (p - 0.5) * 2, sleeve: true, t: 33 + p * 8 }); } },
  ],
};
