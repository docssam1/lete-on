// 1부 활동 4 — 비눗방울: 표면장력, 비누의 역할, 구가 되는 이유, 120° 접합, 무지개색
import { PALETTE as P, sphere, cylinder, label, arrow, particles, THREE, lerp, mat } from './_kit.js';

export default {
  view: { theta: 0.35, phi: 1.2, dist: 9, target: [0, 1.6, 0] },
  build(kit, world) {
    // 물 분자 무리 + 서로 당기는 화살표
    const mol = new THREE.Group();
    const pts = [[-1.2, 0.3], [0, 0.3], [1.2, 0.3], [-0.6, -0.5], [0.6, -0.5]];
    pts.forEach(([x, y]) => { const s = sphere(0.22, P.water); s.position.set(x, y, 0); mol.add(s); });
    [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4]].forEach(([a, b]) => { const A = pts[a], B = pts[b]; const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; mol.add(arrow([m[0] + (A[0] - m[0]) * 0.15, m[1] + (A[1] - m[1]) * 0.15, 0], [A[0] - (A[0] - m[0]) * 0.45, A[1] - (A[1] - m[1]) * 0.45, 0], P.accent, 0.025)); mol.add(arrow([m[0] + (B[0] - m[0]) * 0.15, m[1] + (B[1] - m[1]) * 0.15, 0], [B[0] - (B[0] - m[0]) * 0.45, B[1] - (B[1] - m[1]) * 0.45, 0], P.accent, 0.025)); });
    mol.position.set(0, 2.2, 0); world.add('mol', mol);
    const lbT = label('표면장력: 물 분자끼리 서로 세게 끌어당긴다', { size: 0.32 }); lbT.position.set(0, 4.2, 0); world.add('lbT', lbT);
    // 비누 분자(머리+꼬리)가 물 분자 사이에 끼어든다
    const soap = new THREE.Group();
    for (let i = 0; i < 4; i++) { const g = new THREE.Group(); const head = sphere(0.14, P.accent2); const tail = cylinder(0.04, 0.04, 0.6, P.accent2); tail.position.y = -0.4; g.add(head, tail); g.position.set(-1.8 + i * 1.2, 1.0, 0.3); g.userData.i = i; soap.add(g); }
    soap.position.set(0, 2.2, 0); world.add('soap', soap);
    const lbS = label('비누가 표면장력을 낮추고 얇은 막이 유지되도록 돕는다', { size: 0.3 }); lbS.position.set(0, 4.2, 0); world.add('lbS', lbS);
    // 빨대와 비눗방울
    const straw = cylinder(0.08, 0.08, 2.2, P.red); straw.rotation.z = Math.PI / 2 - 0.6; straw.position.set(-2.4, 1.4, 0); world.add('straw', straw);
    const bubbleMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.35, iridescence: 1, iridescenceIOR: 1.3, iridescenceThicknessRange: [100, 500], side: THREE.DoubleSide });
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), bubbleMat); bubble.position.set(-0.2, 1.7, 0); world.add('bubble', bubble);
    const lbB = label('공기를 불어 넣으면 얇은 비누막이 부푼다', { size: 0.32 }); lbB.position.set(0, 4.2, 0); world.add('lbB', lbB);
    // 정육면체 틀 → 구 (최소 표면적)
    const cube = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.8, 1.8, 1.8)), new THREE.LineBasicMaterial({ color: P.ink })); cube.position.set(-0.2, 1.7, 0); world.add('cube', cube);
    const lbC = label('같은 부피면 표면적이 가장 작은 모양 = 구', { size: 0.32 }); lbC.position.set(0, 4.2, 0); world.add('lbC', lbC);
    // 두 방울: 같은 크기(평면 벽) / 다른 크기(벽이 큰 쪽으로 볼록)
    const pair = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.9, 40, 28), bubbleMat), b2 = new THREE.Mesh(new THREE.SphereGeometry(0.9, 40, 28), bubbleMat);
    b1.position.x = -0.75; b2.position.x = 0.75; const wall = new THREE.Mesh(new THREE.CircleGeometry(0.5, 40), mat(P.accent, { opacity: 0.55, side: THREE.DoubleSide })); wall.rotation.y = Math.PI / 2;
    pair.add(b1, b2, wall); pair.position.set(0, 1.7, 0); pair.userData = { b1, b2, wall }; world.add('pair', pair);
    const lbP = label('같은 크기: 양쪽 압력이 같아 벽이 평면', { size: 0.32 }); lbP.position.set(0, 4.2, 0); world.add('lbP', lbP);
    const lbP2 = label('화살표: 작은 방울에서 큰 방울로 경계면이 밀리는 방향', { size: 0.32 }); lbP2.position.set(0, 4.2, 0); world.add('lbP2', lbP2);
    const wallBulge = arrow([0.1, 1.7, 0], [0.7, 1.7, 0], P.red, 0.04); world.add('bulge', wallBulge);
    // 세 방울 120°
    const trio = new THREE.Group(); const R = 0.75;
    for (let i = 0; i < 3; i++) { const a = Math.PI / 2 + i * 2 * Math.PI / 3; const b = new THREE.Mesh(new THREE.SphereGeometry(0.72, 40, 28), bubbleMat); b.position.set(Math.cos(a) * R, Math.sin(a) * R, 0); trio.add(b); const seg = cylinder(0.03, 0.03, 0.9, P.accent); const ang = a + Math.PI / 3; seg.position.set(Math.cos(ang) * 0.45, Math.sin(ang) * 0.45, 0); seg.rotation.z = ang - Math.PI / 2; trio.add(seg); }
    trio.position.set(0, 1.9, 0); world.add('trio', trio);
    const lb120 = label('안정된 세 비누막이 한 선에서 만나면 약 120°', { size: 0.3 }); lb120.position.set(0, 4.2, 0); world.add('lb120', lb120);
    // 증발 입자 + 글리세린
    const vapor = particles(40, 0.04, P.water, { x: 2.4, y: 1.0, z: 2.4 }, { glow: 0.3 }); vapor.position.set(-0.2, 3.0, 0); world.add('vapor', vapor);
    const lbV = label('물의 증발 → 막이 얇아짐 · 첨가물 효과는 비교 실험으로', { size: 0.3 }); lbV.position.set(0, 4.2, 0); world.add('lbV', lbV);
    const lbR = label('막 두께 ≈ 빛의 파장 → 앞·뒤 반사광이 간섭해 무지개색', { size: 0.3 }); lbR.position.set(0, 4.2, 0); world.add('lbR', lbR);
    return { update(dt, t) { vapor.jitter(t, 0.04, 2); } };
  },
  beats: [
    { text: '물에서도 거품이 생기지만 금방 터져요. 액체의 표면이 넓이를 줄이려는 성질을 표면장력이라고 해요.', show: ['mol', 'lbT'], dur: 5, anim(p, o) { o.mol.scale.setScalar(0.3 + 0.7 * p); } },
    { text: '비누는 물의 표면장력을 낮추고 얇은 막이 유지되도록 도와요. 효과는 비누의 종류와 섞는 양에 따라 달라요.', show: ['soap', 'lbS'], hide: ['lbT'], dur: 6, anim(p, o) { o.soap.children.forEach((g) => { g.position.y = 1.4 - 1.4 * p; }); } },
    { text: '얇은 물층의 양쪽 표면에 비누 분자가 모여 있어요. 공기를 불어 넣으면 이 막이 공기를 둘러싸며 부풀어요.', show: ['straw', 'bubble', 'lbB'], hide: ['mol', 'soap', 'lbS'], dur: 4, anim(p, o) { o.bubble.scale.setScalar(0.05 + 1.05 * p); } },
    { text: '다른 물체에 닿지 않고 조용히 떠 있는 작은 방울은 거의 구 모양이에요. 같은 부피에서 겉넓이가 가장 작은 모양이 구이기 때문이에요.', show: ['cube', 'lbC'], hide: ['lbB', 'straw'], dur: 6, anim(p, o) { o.cube.material.opacity = 1 - p; o.cube.material.transparent = true; o.bubble.scale.setScalar(1.1 - 0.15 * p); } },
    { text: '같은 비눗물로 만든 같은 크기의 두 방울이 안정되게 붙으면 사이의 면은 평평해요. 양쪽 압력이 같기 때문이에요.', show: ['pair', 'lbP'], hide: ['bubble', 'cube', 'lbC'], dur: 5, anim(p, o) { const { b1, b2 } = o.pair.userData; b1.position.x = -1.6 + 0.85 * p; b2.position.x = 1.6 - 0.85 * p; } },
    { text: '크기가 다르면 작은 방울 쪽 압력이 더 높아 사이의 면이 큰 방울 쪽으로 굽어요. 화살표는 밀리는 방향을 나타낸 모형이에요.', show: ['lbP2', 'bulge'], hide: ['lbP'], dur: 5, anim(p, o) { const { b1, b2, wall } = o.pair.userData; b1.scale.setScalar(1 - 0.35 * p); b2.scale.setScalar(1 + 0.25 * p); wall.position.x = 0.35 * p; wall.scale.setScalar(1 - 0.3 * p); } },
    { text: '같은 비눗물의 세 비누막이 한 선을 따라 만나 안정되면 막 사이의 각은 약 120도예요. 방울의 개수와 만나는 막의 수를 구별해요.', show: ['trio', 'lb120'], hide: ['pair', 'lbP2', 'bulge'], dur: 6, anim(p, o) { o.trio.rotation.z = p * Math.PI * 2 / 3; } },
    { text: '막의 물이 증발하면 얇아져 터질 수 있어요. 유지 시간은 비눗물과 주위 조건에 따라 달라요. 첨가물 효과는 같은 조건에서 비교해요.', show: ['bubble', 'vapor', 'lbV'], hide: ['trio', 'lb120'], dur: 6, anim(p, o) { o.bubble.scale.setScalar(1.0); o.vapor.children.forEach((d, i) => { d.visible = i < 40 * (1 - p * 0.8); }); } },
    { text: '얇은 막의 앞면과 뒷면에서 반사된 빛이 겹치며 여러 색이 보여요. 막의 두께가 달라지면 보이는 색도 달라져요.', show: ['lbR'], hide: ['vapor', 'lbV'], dur: 5, anim(p, o, t) { o.bubble.material.iridescenceThicknessRange = [100 + 200 * Math.sin(t) ** 2, 500 + 300 * p]; o.bubble.rotation.y = t * 0.3; } },
  ],
};
