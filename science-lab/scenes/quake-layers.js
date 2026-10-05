import { THREE, mat, label, roundedBoxGeometry } from './_kit.js';
import { FORCES, HOUSES, quakeModel } from './quake-model.js';
export { FORCES, HOUSES, quakeModel };
// 지층의 휘어짐·끊어짐(4-2 Ⅳ 화산과 지진). 겹친 우드락 네 장을 양쪽 판으로 민다.
// 휘어짐 = 가운데가 볼록(배사) — 모든 층이 같은 모양으로 휜다. 끊어짐 = 가운데에서 갈라져 오른쪽이 내려앉고(단층) 판 전체가 떨린다.
// 그 위에 집 한 채: 보통 집은 끊어질 때 기울고, 내진 설계 집(가새·넓은 기초)은 흔들렸다가 제자리.
const L = 4.4, D = 1.4, T = 0.2, N = 4, SEG = 36;
const COLORS = [0xd9b98a, 0xb98a5a, 0x9c6b48, 0xc9a274];

// 반쪽 우드락 한 장(가로로 잘게 나눈 상자) — 꼭짓점을 휘게 만들 수 있도록 원래 좌표를 보관
function half(side, color) {
  const g = new THREE.BoxGeometry(L / 2, T, D, SEG, 1, 1);
  g.translate(side * L / 4, 0, 0);
  const m = new THREE.Mesh(g, mat(color, { roughness: 0.9 }));
  m.userData.base = Float32Array.from(g.attributes.position.array);
  return m;
}
// 기본 집: 벽·지붕·창. 내진 설계 집은 X 가새와 넓은 기초를 더한다
function house(strong) {
  const h = new THREE.Group();
  const wall = new THREE.Mesh(roundedBoxGeometry(0.62, 0.5, 0.56, 0.03), mat(strong ? 0xf3efe6 : 0xf6e7cf)); wall.position.y = 0.25 + (strong ? 0.06 : 0); h.add(wall);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.34, 4), mat(strong ? 0x3b5ba8 : 0xc1553d, { roughness: 0.6 })); roof.rotation.y = Math.PI / 4; roof.position.y = 0.67 + (strong ? 0.06 : 0); h.add(roof);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), new THREE.MeshBasicMaterial({ color: 0x8ec5f0 })); win.position.set(0, 0.3 + (strong ? 0.06 : 0), 0.282); h.add(win);
  if (strong) {
    const base = new THREE.Mesh(roundedBoxGeometry(0.86, 0.06, 0.74, 0.02), mat(0x7d8794)); base.position.y = 0.03; h.add(base);
    const steel = mat(0x5d6672, { metalness: 0.6, roughness: 0.4 });
    for (const s of [1, -1]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.7, 0.03), steel); b.rotation.z = s * 0.82; b.position.set(0, 0.31, 0.29); h.add(b); }
  }
  return h;
}

export function buildQuakeLayers() {
  const g = new THREE.Group(), rig = new THREE.Group(); g.add(rig);
  // 실험대 — 맞춤에서 뺀다
  const table = new THREE.Mesh(roundedBoxGeometry(6.6, 0.12, 2.4, 0.05), mat(0xe6dcc8, { roughness: 0.85 })); table.position.y = -0.06; table.userData.noFrame = true; g.add(table);
  const layers = [];
  for (let i = 0; i < N; i++) {
    const pair = [half(-1, COLORS[i]), half(1, COLORS[i])];
    pair.forEach((m) => { m.position.y = T / 2 + i * T; rig.add(m); });
    layers.push(pair);
  }
  // 미는 판(양쪽) + 화살표
  const wood = mat(0x8a6a48, { roughness: 0.8 });
  const plates = [-1, 1].map((s) => { const p = new THREE.Mesh(roundedBoxGeometry(0.14, N * T + 0.4, D + 0.2, 0.03), wood); p.position.set(s * (L / 2 + 0.07), (N * T + 0.4) / 2, 0); g.add(p); return p; });
  const arrows = [-1, 1].map((s) => { const a = new THREE.ArrowHelper(new THREE.Vector3(-s, 0, 0), new THREE.Vector3(s * (L / 2 + 0.95), N * T / 2 + 0.1, 0), 0.7, 0xe0543a, 0.22, 0.14); a.visible = false; g.add(a); return a; });
  // 끊어진 틈(어두운 면) — 끊어질 때만
  const crack = new THREE.Mesh(new THREE.PlaneGeometry(0.04, N * T + 0.05), new THREE.MeshBasicMaterial({ color: 0x2a1d14 })); crack.position.set(0, N * T / 2, D / 2 + 0.002); crack.visible = false; rig.add(crack);
  const homes = { '보통 집': house(false), '내진 설계 집': house(true) };
  for (const h of Object.values(homes)) { h.visible = false; rig.add(h); }
  const names = [label('지층(겹친 우드락)', { size: 0.26 }), label('미는 힘', { size: 0.26 })];
  names[0].position.set(-1.4, N * T + 0.75, 0); names[1].position.set(L / 2 + 0.95, N * T + 0.55, 0); names.forEach((n) => g.add(n));

  const S = { bend: 0, squeeze: 0, broke: 0, house: HOUSES[0], tilt: 0, shake: 0, t: 0 };
  // x 위치에서의 휘어짐 높이: 가운데가 볼록, 양 끝은 0
  const bump = (x) => S.bend * Math.cos(Math.PI * x / L);
  const draw = () => {
    const k = 1 - S.squeeze;                                    // 밀려서 짧아진 비율
    for (const pair of layers) for (const [j, m] of pair.entries()) {
      const pos = m.geometry.attributes.position, b = m.userData.base, side = j ? 1 : -1;
      const drop = side > 0 ? -0.2 * S.broke : 0, slide = side * 0.025 * S.broke;
      for (let v = 0; v < pos.count; v++) {
        const x0 = b[v * 3], y0 = b[v * 3 + 1], z0 = b[v * 3 + 2];
        pos.setXYZ(v, x0 * k + slide, y0 + bump(x0) + drop, z0);
      }
      pos.needsUpdate = true; m.geometry.computeVertexNormals();
    }
    plates.forEach((p, i) => { p.position.x = (i ? 1 : -1) * ((L / 2) * k + 0.07); });
    crack.visible = S.broke > 0.5; crack.scale.y = 1; crack.position.y = N * T / 2 - 0.1 * S.broke;
    // 집: 오른쪽 위(끊어지면 내려앉는 쪽), 표면 높이를 따라간다
    const hx = 0.95 * k, top = N * T + bump(hx / k) - 0.2 * S.broke;
    for (const [name, h] of Object.entries(homes)) {
      h.visible = name === S.house;
      const wob = S.shake * Math.sin(S.t * 38) * (name === '보통 집' ? 0.16 : 0.07);
      h.position.set(hx + 0.025 * S.broke, top, 0);
      h.rotation.z = -Math.atan(Math.PI * S.bend / L * Math.sin(Math.PI * hx / k / L)) + wob - (name === '보통 집' ? S.tilt : 0);
    }
    rig.position.x = S.shake * 0.05 * Math.sin(S.t * 47); rig.position.z = S.shake * 0.03 * Math.cos(S.t * 31);
  };
  // 목표 상태로: 힘에 따라 휘어짐·줄어듦, 끊어지면 휨이 일부 풀린다(쌓인 힘이 풀리며 떨림)
  const target = (force) => {
    const c = force ? quakeModel(force, S.house).change : 0;
    return { bend: [0, 0.16, 0.42, 0.24][c], squeeze: [0, 0.03, 0.07, 0.08][c], broke: c === 3 ? 1 : 0 };
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  const push = (on) => arrows.forEach((a) => { a.visible = on; });
  draw();
  g.userData = { set, state: S, target, push, homes, layers, crack, names };
  return g;
}

export default {
  view: { theta: 0.32, phi: 1.22 }, revealAt: 2,
  frame: [[-3.0, 0, -1.0], [3.4, 1.9, 1.0]],
  build(kit, world) { world.add('rig', buildQuakeLayers()); return {}; },
  // 비트마다 anim 으로 상태를 정한다(Player 는 앞 비트들의 anim(1)을 다시 적용한다. reset 은 첫 비트 것만 불린다)
  beats: [
    { text: '여러 장의 우드락을 겹쳐 지층처럼 만들었어요. 양쪽에서 밀면 어떻게 될까요?', show: ['rig'], dur: 4,
      reset(o) { const u = o.rig.userData; u.set({ bend: 0, squeeze: 0, broke: 0, tilt: 0, shake: 0, house: '보통 집' }); u.push(false); } },
    { text: '천천히 밀면 지층은 어떻게 변할지 먼저 예상해요.', show: ['rig'], dur: 4, anim(p, o) { o.rig.userData.push(true); } },
    { text: '밀수록 가운데가 볼록하게 휘어져요. 땅속 지층도 큰 힘을 받으면 이렇게 휘어요(습곡).', show: ['rig'], dur: 5,
      anim(p, o) { o.rig.userData.set({ bend: 0.42 * p, squeeze: 0.07 * p }); } },
    { text: '더 세게 밀면 끊어지며 떨려요. 땅속 지층이 끊어질 때 땅이 흔들리는 것이 지진이에요.', show: ['rig'], dur: 6,
      anim(p, o) { const u = o.rig.userData; const s = Math.min(1, p * 3); u.set({ broke: s, bend: 0.42 - 0.18 * s, squeeze: 0.08, shake: p < 1 ? Math.max(0, 1 - p) * s : 0, t: p * 6, tilt: 0.42 * s }); } },
    { text: '규모가 클수록 피해가 커요. 내진 설계로 지은 건물은 흔들려도 잘 버텨요.', show: ['rig'], dur: 5,
      anim(p, o) { o.rig.userData.set({ house: '내진 설계 집', shake: 0, tilt: 0 }); } },
  ],
};
