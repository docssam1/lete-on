import { THREE, clamp01 } from './_kit.js';
import { CHANGES, SPECIES, YEARS, BASE, meadowAt, meadowRow } from './meadow-model.js';
export { CHANGES, SPECIES, YEARS, BASE, meadowAt, meadowRow };
// 풀밭 먹이 관계(4-2 Ⅱ 생물과 환경) — 타원 풀밭 위에 풀 포기·토끼·여우를 모형 수만큼 놓는다(풀 → 토끼 → 여우).
// 한 가지를 바꾸고(여우가 사라짐·토끼가 사라짐·가뭄) 몇 해 지켜보면 수가 달라진다. 새로 생기는 것은 커지며 나타나고, 줄어드는 것은 작아지며 사라진다.
const RX = 2.3, RZ = 1.45, MAX = { grass: 80, rabbit: 28, fox: 3 };
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

// 겹치지 않는 자리(씨앗 고정) — 같은 수면 늘 같은 자리에 놓인다
function spots(n, minD, seed, keep = []) {
  let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }, out = [];
  for (let tries = 0; out.length < n && tries < n * 400; tries++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.9, x = Math.cos(a) * d * RX, z = Math.sin(a) * d * RZ;
    if ([...out, ...keep].every(([px, pz]) => Math.hypot(px - x, pz - z) > minD)) out.push([x, z, r() * Math.PI * 2]);
  }
  return out;
}
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...o });
function rabbit() {
  const g = new THREE.Group(), fur = std(0xcdbfae), pale = std(0xf3eee6), dark = std(0x2a2522);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 14), fur); body.scale.set(1, 0.9, 1.35); body.position.y = 0.09; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.066, 18, 12), fur); head.position.set(0, 0.17, 0.12); g.add(head);
  for (const sx of [-1, 1]) { const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.09, 4, 8), fur); ear.position.set(sx * 0.03, 0.26, 0.1); ear.rotation.z = sx * -0.18; ear.rotation.x = -0.25; g.add(ear);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 6), dark); eye.position.set(sx * 0.04, 0.185, 0.17); g.add(eye); }
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), pale); tail.position.set(0, 0.11, -0.14); g.add(tail);
  return g;
}
function fox() {
  const g = new THREE.Group(), fur = std(0xd2662a), pale = std(0xf6efe4), dark = std(0x2a2320);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.22, 6, 12), fur); body.rotation.x = Math.PI / 2; body.position.y = 0.16; g.add(body);
  for (const [x, z] of [[-0.05, 0.1], [0.05, 0.1], [-0.05, -0.1], [0.05, -0.1]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.12, 8), dark); leg.position.set(x, 0.06, z); g.add(leg); }
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 12), fur); head.position.set(0, 0.24, 0.2); g.add(head);
  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 12), pale); snout.rotation.x = Math.PI / 2; snout.position.set(0, 0.22, 0.29); g.add(snout);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), dark); nose.position.set(0, 0.222, 0.335); g.add(nose);
  for (const sx of [-1, 1]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.07, 10), fur); ear.position.set(sx * 0.04, 0.31, 0.18); g.add(ear); }
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.22, 12), fur); tail.rotation.x = -Math.PI / 2 - 0.5; tail.position.set(0, 0.2, -0.24); g.add(tail);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), pale); tip.position.set(0, 0.25, -0.33); g.add(tip);
  return g;
}

export function buildMeadow() {
  const g = new THREE.Group();
  // 풀밭(타원 땅) — 가뭄이면 누렇게
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.04, 0.12, 64), std(0x7a5a3a, { roughness: 0.95 })); soil.scale.set(RX + 0.25, 1, RZ + 0.25); soil.position.y = -0.06; g.add(soil);
  const turf = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.02, 64), std(0x86b25a, { roughness: 0.95 })); turf.scale.set(RX + 0.2, 1, RZ + 0.2); turf.position.y = 0.005; g.add(turf);
  // 풀 포기: 잎 세 장을 묶은 모양을 인스턴스로
  const blade = new THREE.ConeGeometry(0.025, 0.2, 5); blade.translate(0, 0.1, 0);
  const grassMat = std(0x3f8f3a, { roughness: 0.6 }), grass = new THREE.InstancedMesh(blade, grassMat, MAX.grass * 3); g.add(grass);
  const gSpots = spots(MAX.grass, 0.17, 7), foxSpots = spots(MAX.fox, 0.9, 31), rabSpots = spots(MAX.rabbit, 0.26, 19, foxSpots);
  const rabbits = rabSpots.map(([x, z, a]) => { const r = rabbit(); r.position.set(x, 0.01, z); r.rotation.y = a; g.add(r); return r; });
  const foxes = foxSpots.map(([x, z, a]) => { const f = fox(); f.position.set(x, 0.01, z); f.rotation.y = a; g.add(f); return f; });
  const S = { change: '그대로', year: 0, t: 0 };
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  // 0~n 사이 실수 수를 i번째 개체의 크기(0~1)로: 다 채운 개체는 1, 경계의 하나는 일부만
  const grow = (n, i) => smooth(0, 1, n - i);
  const draw = () => {
    const n = meadowAt(S.change, S.year), dry = S.change === '풀이 줄어듦(가뭄)' ? 1 : 0;
    turf.material.color.set(dry ? 0xb9b26a : 0x86b25a); grassMat.color.set(dry ? 0x7f9a3c : 0x3f8f3a);
    gSpots.forEach(([x, z, a], i) => { const k = grow(n.grass, i);
      for (let j = 0; j < 3; j++) { E.set(Math.cos(a + j * 2.1) * 0.35, a + j * 2.1, Math.sin(a + j * 2.1) * 0.35); Q.setFromEuler(E); P.set(x + Math.cos(a + j * 2.1) * 0.025, 0.01, z + Math.sin(a + j * 2.1) * 0.025); SC.setScalar(Math.max(0.0001, k) * (0.85 + (j % 2) * 0.3)); M.compose(P, Q, SC); grass.setMatrixAt(i * 3 + j, M); } });
    grass.instanceMatrix.needsUpdate = true;
    rabbits.forEach((r, i) => { const k = grow(n.rabbit, i); r.visible = k > 0.01; r.scale.setScalar(Math.max(0.001, k)); r.position.y = 0.01 + Math.max(0, Math.sin(S.t * 3 + i * 1.7)) * 0.04 * k; });
    foxes.forEach((f, i) => { const k = grow(n.fox, i); f.visible = k > 0.01; f.scale.setScalar(Math.max(0.001, k) * 1.25); f.rotation.y = foxSpots[i][2] + Math.sin(S.t * 0.4 + i) * 0.4; });
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, rabbits, foxes, grass };
  return g;
}

export default {
  view: { theta: 0.25, phi: 0.95 }, revealAt: 2,
  frame: [[-2.5, 0, -1.7], [2.5, 0.45, 1.7]],
  build(kit, world) { world.add('field', buildMeadow()); return {}; },
  beats: [
    { text: '풀을 토끼가 먹고, 토끼를 여우가 먹는 풀밭이에요. 풀 → 토끼 → 여우. 바깥에서 새 먹이는 들어오지 않아요.', show: ['field'], dur: 8,
      reset(o) { o.field.userData.set({ change: '그대로', year: 0 }); },
      anim(p, o) { o.field.userData.set({ t: p * 8 }); } },
    { text: '이 풀밭에서 여우가 모두 사라지면, 몇 해 뒤 토끼와 풀은 어떻게 될까요? 먼저 예상해요.', show: ['field'], dur: 7,
      reset(o) { o.field.userData.set({ change: '그대로', year: 0 }); },
      anim(p, o) { o.field.userData.set({ t: 8 + p * 7 }); } },
    { text: '여우가 사라지자 토끼가 늘어났고, 늘어난 토끼가 풀을 많이 먹어 풀은 줄었어요.', show: ['field'], dur: 10,
      reset(o) { o.field.userData.set({ change: '여우가 사라짐', year: 0 }); },
      anim(p, o) { o.field.userData.set({ change: '여우가 사라짐', year: smooth(0.1, 0.85, p) * YEARS, t: 15 + p * 10 }); } },
    { text: '먹이 관계로 이어진 생물은 서로 영향을 주고받아요. 가뭄으로 풀이 줄면 토끼가 줄고, 먹이가 준 여우도 줄어요.', show: ['field'], dur: 10,
      reset(o) { o.field.userData.set({ change: '풀이 줄어듦(가뭄)', year: 0 }); },
      anim(p, o) { o.field.userData.set({ change: '풀이 줄어듦(가뭄)', year: smooth(0.1, 0.85, p) * YEARS, t: 25 + p * 10 }); } },
  ],
};
