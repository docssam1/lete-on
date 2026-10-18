// 이론편 4-1-1 PDF 4쪽의 수평 비교를 시각화한다. 숫자는 이 모형에서 정한 값이다.
import { THREE, mat, label } from './_kit.js';
import { forceBalance } from '../v2/force-model.js';
export const BALANCE_VIEW = { theta: 0.18, phi: 1.18, frame: [[-2.6, 0, -0.65], [2.6, 2.65, 0.65]] };
export function buildForceBalance() {
  const group = new THREE.Group();
  const mesh = (geo, color, x, y, z = 0) => { const o = new THREE.Mesh(geo, mat(color)); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; };
  const base = mesh(new THREE.BoxGeometry(1.2, 0.18, 0.8), 0x8794a7, 0, 0.09); group.add(base);
  const post = mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.65, 24), 0x566274, 0, 0.95); group.add(post);
  const axle = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 24), 0x182230, 0, 1.8); axle.rotation.x = Math.PI / 2; group.add(axle);
  const beam = new THREE.Group(); beam.position.y = 1.8; group.add(beam);
  beam.add(mesh(new THREE.BoxGeometry(4.45, 0.13, 0.35), 0xc5a37e, 0, 0));
  for (const sign of [-1, 1]) for (let i = 1; i <= 5; i++) beam.add(mesh(new THREE.BoxGeometry(0.022, 0.012, 0.37), 0x566274, sign * i * 0.38, 0.073));
  const hangers = [-1, 1].map(() => {
    const h = new THREE.Group();
    h.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 8), 0x566274, 0, -0.18));
    h.add(mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), 0x2456c4, 0, -0.59));
    group.add(h); return h;
  });
  const labels = [label('물체 가', { size: 0.25 }), label('물체 나', { size: 0.25 })];
  labels.forEach((l, i) => { l.position.set(i ? 1.8 : -1.8, 2.4, 0); group.add(l); });
  const support = label('받침점', { size: 0.23 }); support.position.set(0, 2.45, 0.3); group.add(support);
  // 잠금 받침: 아직 관찰하지 않은 상태에서 수평인 채 지지하고 있음을 보여 준다.
  const locks = [-1, 1].map((sign) => { const o = mesh(new THREE.BoxGeometry(0.16, 0.7, 0.2), 0xb9c2cc, sign * 2.12, 1.4, -0.28); group.add(o); return o; });
  const update = (setup, observed, shownAngle = null) => {
    const m = forceBalance(setup), angle = observed ? shownAngle ?? m.angle : 0;
    beam.rotation.z = angle;
    hangers.forEach((h, i) => {
      const x = (i ? 1 : -1) * setup[i ? 'right' : 'left'] * 0.38; h.position.set(x * Math.cos(angle), 1.8 + x * Math.sin(angle), 0);
      labels[i].position.set(h.position.x, h.position.y - 0.95, 0.2);
    });
    locks.forEach((o) => { o.visible = !observed; });
  };
  update({ pair: 'ab', left: 3, right: 3 }, false);
  return { group, update, labels };
}
export default {
  view: BALANCE_VIEW,
  revealAt: 2,
  build(kit, world) { const b = buildForceBalance(); b.group.userData.balance = b; world.add('apparatus', b.group); },
  beats: [
    { text: '이것은 수평을 비교하는 모형이에요. 두 물체의 정확한 무게는 아직 알려 주지 않아요.', show: ['apparatus'], dur: 4, reset(o) { o.apparatus.userData.balance.update({ pair: 'ab', left: 3, right: 3 }, false); } },
    { text: '받침점에서 같은 거리에 놓았어요. 잠금 받침을 빼면 어느 쪽으로 기울까요? 먼저 예상해요.', dur: 4 },
    { text: '같은 거리에서 오른쪽이 내려갔어요. 이 모형에서는 물체 나가 더 무거워요.', dur: 4, anim(p, o) { const s = { pair: 'ab', left: 3, right: 3 }; o.apparatus.userData.balance.update(s, true, forceBalance(s).angle * p); } },
    { text: '더 무거운 물체 나를 받침점 가까이 옮기면 수평을 잡을 수 있어요. 실제 물체로도 비교해 봐요.', dur: 5, reset(o) { o.apparatus.userData.balance.update({ pair: 'ab', left: 4, right: 2 }, true); } },
  ],
};
