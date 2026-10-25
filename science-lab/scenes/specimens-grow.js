// 자연관찰 연습 표본 — 「강낭콩 자람 오래 관찰하기」(초등). 원장이 쓴 영재교육자료 『식물의 자람에 대한 자유 탐구』의 흐름을 따른다:
// 4학년 강낭콩 기르기에서 한 걸음 더 — 무엇을 어떻게 잴지 정하고(키·잎 수·줄기 굵기·떡잎) → 날짜별 표 → 꺾은선 그래프 → 조건 하나를 바꿔 비교.
// 표본 3개 = 같은 날 심은 강낭콩 세 화분: ① 햇빛 드는 창가·물 매일, ② 그늘진 복도·물 매일, ③ 햇빛 드는 창가·물 사흘에 한 번.
// 날짜 단추(0·4·7·10·14·21·28일)로 같은 화분의 자람을 넘겨 본다. 「키·잎 재기」 값은 그림 그대로다(줄기 끝 높이·본잎 수를 그 값으로 만든다).
// 그늘 화분은 줄기가 가늘고 길게 웃자라고 잎이 연하다. 물이 모자란 화분은 키가 작고 잎이 처진다. 떡잎은 본잎이 자라면 쭈그러들다 떨어진다.
import { THREE, mat, label } from './_kit.js';
import { leafTextures, leafMesh, soilTex, stemTex } from './_organic.js';

const CM = 5;   // 1 단위 = 5 cm
export const DAYS = [0, 4, 7, 10, 14, 21, 28];
const COTY = ['흙 속', '흙 속(굽은 줄기만 나옴)', '펼쳐짐(두툼함)', '펼쳐짐', '쭈글쭈글해짐', '작고 누레짐', '떨어짐'];
const SPECS = [
  { id: 'bean-sun', no: '①', name: '창가 · 물 매일 50 mL', hint: '햇빛 드는 창가, 물 매일', light: 'window', water: '매일',
    H: [0, 1.5, 6, 10, 14, 21, 27], leaves: [0, 0, 0, 2, 3, 5, 7], stem: [0, 2, 3, 3, 4, 4, 5], green: '#3f8f36', size: 1,
    think: ['줄기가 한쪽으로 기울었나요? 어느 쪽인가요? 그쪽에 무엇이 있나요?', '하루에 몇 cm씩 자랐는지 날짜 사이마다 계산해 보세요. 늘 같은 빠르기인가요?', '본잎이 커질 때 떡잎은 어떻게 변하나요?'] },
  { id: 'bean-shade', no: '②', name: '그늘진 복도 · 물 매일 50 mL', hint: '그늘진 복도, 물 매일', light: 'shade', water: '매일',
    H: [0, 2, 9, 15, 21, 27, 31], leaves: [0, 0, 0, 2, 2, 3, 4], stem: [0, 2, 2, 2, 2, 3, 3], green: '#8fb85a', size: 0.72,
    think: ['①보다 키가 큰데, 더 잘 자란 걸까요? 줄기 굵기와 잎 수도 같이 보세요.', '잎 색은 ①과 어떻게 다른가요?', '키가 크면 무조건 「잘 자랐다」고 할 수 있을까요? 무엇으로 정할까요?'] },
  { id: 'bean-dry', no: '③', name: '창가 · 물 사흘에 한 번 50 mL', hint: '햇빛 드는 창가, 물 사흘에 한 번', light: 'window', water: '사흘에 한 번',
    H: [0, 1, 5, 8, 10, 14, 17], leaves: [0, 0, 0, 2, 2, 3, 4], stem: [0, 2, 3, 3, 3, 3, 4], green: '#4f8f3a', size: 0.82, droop: 0.55,
    think: ['①과 무엇 하나만 다르게 했나요? 그러면 차이는 무엇 때문일까요?', '잎이 처진 날과 물 준 날을 맞춰 보세요.', '흙 속 뿌리는 ①과 비교해 어떨까요?'] },
];
export const SPECIMENS = SPECS.map((s) => () => s);
export const VIEWS = { angle: { theta: 0.35, phi: 1.2, name: '비스듬히' }, side: { theta: 0, phi: 1.45, name: '옆에서 본 모습(키 재기)' }, top: { theta: 0.2, phi: 0.3, name: '위에서 본 모습(잎 세기)' } };
export const TOOLS = [{ id: 'ruler', name: '📏 자 대기' }, { id: 'roots', name: '🌱 흙 속 보기' }];

const tube = (pts, r0, r1, color, seg = 16) => {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), geo = new THREE.TubeGeometry(curve, seg, 1, 8);
  const pos = geo.attributes.position, n = seg + 1, ring = pos.count / n;   // 굵기를 아래(r0)→위(r1)로 줄인다
  for (let i = 0; i < n; i++) { const c = curve.getPointAt(i / seg), r = r0 + (r1 - r0) * (i / seg); for (let k = 0; k < ring; k++) { const j = i * ring + k; const v = new THREE.Vector3(pos.getX(j), pos.getY(j), pos.getZ(j)).sub(c).multiplyScalar(r); pos.setXYZ(j, c.x + v.x, c.y + v.y, c.z + v.z); } }
  geo.computeVertexNormals(); const m = new THREE.Mesh(geo, color.isMaterial ? color : mat(color, { roughness: 0.65 })); m.castShadow = true; return m;
};
const leafTex = (green, kind) => leafTextures(`bean:${kind}:${green}`, { outline: 'ovate', veins: 'pinnate', top: green, topEdge: '#9cc77a', under: '#b5d39f', veinN: kind === 'uni' ? 6 : 5, seed: kind === 'uni' ? 31 : 32 });
// 잎 한 장을 잎자루 끝에 단다: 잎자루 끝 위치 p, 방향 a(y축), 위로 든 각 lift, 처짐 droop
function blade(tex, w, h, droop) { return leafMesh(tex, { w, h, curl: 0.22, droop: 0.2 + droop, gloss: 0.3, segs: [8, 12] }); }
// 세겹잎: 잎자루 + 끝 작은잎 + 양옆 작은잎. 세 장을 한 평면(거의 수평)에 펼친다 — 옆 작은잎을 비스듬히 세우면 위·옆에서 납작하게 보여 홑잎처럼 읽혔다.
function trifoliate(tex, s, droop) {
  const g = new THREE.Group(), pl = 0.55 * s;
  g.add(tube([[0, 0, 0], [pl * 0.5, pl * 0.18, 0], [pl, pl * 0.1, 0]], 0.025, 0.018, 0x5e8a34, 8));
  const head = new THREE.Group(); head.position.set(pl, pl * 0.1, 0); head.rotation.z = -0.12 - droop * 0.9; g.add(head);
  const flat = new THREE.Group(); flat.rotation.x = -Math.PI / 2 + 0.55; head.add(flat);   // 이 안의 XY 평면 = 잎이 펼쳐지는 면(수평에서 30도쯤 들어 옆에서도 세 장이 보이게)
  const tip = blade(tex, 0.62 * s, 1.0 * s, droop); tip.position.set(0.12 * s, 0, 0); tip.rotation.z = -Math.PI / 2; flat.add(tip);
  for (const side of [-1, 1]) { const l = blade(tex, 0.52 * s, 0.82 * s, droop); l.position.set(0.04 * s, side * 0.05 * s, 0); l.rotation.z = -Math.PI / 2 + side * 1.15; flat.add(l); }
  return g;
}
function plant(spec, di) {
  const g = new THREE.Group(), H = spec.H[di] / CM, n = spec.leaves[di], mm = spec.stem[di], droop = spec.droop || 0;
  const r = Math.max(0.018, mm / 10 / CM / 2 * 1.4), lean = spec.light === 'window' ? 0.08 : spec.light === 'shade' ? 0.18 : 0;
  const stemMat = new THREE.MeshStandardMaterial({ map: stemTex('bean:stem:' + spec.id, spec.light === 'shade' ? '#a8c070' : '#6f9a3c'), roughness: 0.7 });
  const at = (y) => [lean * H * (y / Math.max(H, 0.01)) ** 2, y, 0];
  if (di === 1) { g.add(tube([[-0.05, -0.05, 0], [-0.06, H * 0.9, 0], [0.04, H, 0], [0.1, H * 0.6, 0]], r, r, stemMat, 12)); return { g, top: H }; }   // 굽은 줄기(배축)가 흙을 밀고 나옴
  if (di === 0) return { g, top: 0 };
  g.add(tube([[0, -0.05, 0], at(H * 0.35), at(H * 0.7), at(H)], r * 1.15, r * 0.7, stemMat, 20));
  // 떡잎: 두툼한 콩팥 모양 두 장(날이 갈수록 작아지고 누레지다 떨어진다)
  const yc = Math.min(H * 0.6, 5.5 / CM), cs = [1, 1, 1, 1, 0.85, 0.55, 0][di];
  if (cs > 0) for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 10), mat(di >= 5 ? 0xc8b45a : di >= 4 ? 0xa7b85a : 0x9fbf4a, { roughness: 0.6 })); c.scale.set(1.25 * cs, 0.45 * cs, 0.8 * cs); const p = at(yc); c.position.set(p[0] + s * 0.24 * cs, p[1], p[2]); c.rotation.z = s * (di >= 4 ? -0.6 : -0.25); c.castShadow = true; g.add(c); }
  // 본잎: 첫 마디는 마주 붙은 홑잎 2장, 그 위는 어긋나게 세겹잎
  const tri = Math.max(0, n - 2), nodes = (n >= 2 ? 1 : 0) + tri, uni = leafTex(spec.green, 'uni'), trt = leafTex(spec.green, 'tri');
  for (let k = 0; k < nodes; k++) {
    const y = yc + ((k + 1) / (nodes + 0.6)) * (H - yc), p = at(y);
    if (k === 0) { for (const s of [-1, 1]) { const hold = new THREE.Group(); hold.position.set(...p); hold.rotation.y = s > 0 ? 0 : Math.PI; const pet = tube([[0, 0, 0], [0.2, 0.12, 0], [0.38, 0.14, 0]], 0.02, 0.016, 0x5e8a34, 6); hold.add(pet); const b = blade(uni, 0.62 * spec.size, 0.85 * spec.size, droop); b.position.set(0.38, 0.14, 0); b.rotation.z = -Math.PI / 2 + 0.5 - droop * 0.7; hold.add(b); g.add(hold); } continue; }
    const hold = new THREE.Group(); hold.position.set(...p); hold.rotation.y = k * 2.4 + 0.8; const grow = Math.min(1, 0.55 + 0.15 * (nodes - k)); hold.add(trifoliate(trt, spec.size * grow, droop)); hold.rotation.z = 0.25; g.add(hold);
  }
  return { g, top: H };
}
function pot() {
  const g = new THREE.Group();
  const p = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 0.95, 2.2, 32, 1, true), mat(0xb5653a, { roughness: 0.8, side: THREE.DoubleSide })); p.position.y = -1.1; p.castShadow = true; p.receiveShadow = true; g.add(p);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.07, 8, 40), mat(0xa35a33, { roughness: 0.8 })); rim.rotation.x = Math.PI / 2; g.add(rim);
  const st = soilTex('bean:soil', '#4e3a28', 6); st.wrapS = st.wrapT = THREE.RepeatWrapping; st.repeat.set(2, 2);
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.96, 2.1, 32), new THREE.MeshStandardMaterial({ map: st, roughness: 1, transparent: true, opacity: 1 })); soil.position.y = -1.13; soil.receiveShadow = true; g.add(soil);
  g.traverse((o) => { o.userData.noFrame = true; }); g.userData.soil = soil; return g;
}
// 흙 속 뿌리: 원뿌리 + 곁뿌리. 날이 갈수록 길고 많아진다(물이 모자라면 원뿌리가 더 깊이 내려간다).
function roots(spec, di) {
  const g = new THREE.Group(); if (di === 0) { const seed = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), mat(0x8b2f3c, { roughness: 0.5 })); seed.scale.set(1.4, 0.8, 0.9); seed.position.y = -0.4; g.add(seed); return g; }
  const depth = Math.min(1.9, [0, 0.45, 0.9, 1.25, 1.5, 1.75, 1.9][di] * (spec.water === '매일' ? 1 : 1.08)), lat = [0, 0, 4, 6, 8, 10, 12][di];
  g.add(tube([[0, 0, 0], [0.03, -depth * 0.5, 0.02], [-0.02, -depth, 0]], 0.03, 0.012, 0xe8dcc0, 10));
  for (let i = 0; i < lat; i++) { const y = -0.15 - (i / lat) * depth * 0.8, a = i * 2.39, l = 0.25 + 0.5 * (1 - i / lat) * (di / 6); g.add(tube([[0, y, 0], [Math.cos(a) * l * 0.5, y - 0.05, Math.sin(a) * l * 0.5], [Math.cos(a) * l, y - 0.15, Math.sin(a) * l]], 0.012, 0.006, 0xe8dcc0, 6)); }
  return g;
}
function ruler(cm) {
  const len = cm / CM, cv = document.createElement('canvas'); cv.width = 96; cv.height = 1024; const c = cv.getContext('2d');
  c.fillStyle = '#f3e7b8'; c.fillRect(0, 0, 96, 1024); c.fillStyle = '#1f2a37'; c.font = `700 ${cm <= 15 ? 40 : 30}px Pretendard, sans-serif`; c.textAlign = 'left';
  for (let i = 0; i <= cm; i++) { const y = 1016 - (i / cm) * 1008, w = i % 5 === 0 ? 44 : 22; c.fillRect(0, y - 1, w, 3); if (i % 5 === 0) c.fillText(String(i), 50, y + 9); }
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.28, len * 96 / 1024), len, 0.03), [mat(0xe6d79c), mat(0xe6d79c), mat(0xe6d79c), mat(0xe6d79c), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }), mat(0xe6d79c)]);
  m.position.y = len / 2; return m;
}

export function mountSpecimen(stage, make) {
  stage.clear();
  const spec = make(), base = new THREE.Group(); stage.root.add(base);
  const P = pot(); base.add(P);
  const tag = label(spec.no, { size: 0.34 }); tag.position.set(-1.6, 0.4, 0); base.add(tag);
  let rl = null, showRuler = false;
  const sun = label(spec.light === 'shade' ? '복도(그늘)' : '☀ 창문 쪽', { size: 0.34, bg: spec.light === 'shade' ? 'rgba(210,210,220,0.95)' : 'rgba(255,230,140,0.95)', color: spec.light === 'shade' ? '#555' : '#b8860b' }); sun.position.set(2.6, 4, 0); sun.visible = false; sun.userData.noFrame = true; base.add(sun);
  let di = 3, P2 = null, R = null, showRoots = false, drops = null;
  const build = () => {
    if (P2) base.remove(P2.g); if (R) P.remove(R);
    P2 = plant(spec, di); base.add(P2.g); R = roots(spec, di); R.visible = showRoots; P.add(R);
    if (di <= 1) { const t = label(di === 0 ? '씨앗은 흙 속 2 cm' : '흙을 밀고 나오는 중', { size: 0.26 }); t.position.set(0.9, 0.5, 0); P2.g.add(t); }
    if (rl) base.remove(rl); rl = ruler(Math.max(10, Math.ceil((spec.H[di] + 3) / 5) * 5)); rl.position.set(-0.75, 0, -0.45); rl.visible = showRuler; base.add(rl);   // 자는 그날 키보다 조금 길게(35 cm짜리를 세우면 어린 싹이 자에 가렸다)
    P.userData.soil.material.opacity = showRoots ? 0.32 : 1; P.userData.soil.material.depthWrite = !showRoots;
    stage._needFit = true;
  };
  build();
  stage.update = (dt) => { if (!drops) return; drops.t += dt; drops.g.children.forEach((d, i) => { d.position.y = 2.2 - ((drops.t * 2.2 + i * 0.13) % 2.2); }); if (drops.t > 2.4) { base.remove(drops.g); drops = null; } };
  const day = () => DAYS[di];
  const actions = {
    measure: { name: '📏 키·잎 재기', run: () => di === 0 ? '0일(심은 날): 흙 위로 나온 것이 없어요. 「흙 속 보기」로 씨앗을 확인해요.'
      : `${day()}일 · ${spec.no}: 키 ${spec.H[di]} cm(흙 표면~줄기 끝) · 본잎 ${spec.leaves[di]}장 · 줄기 굵기 ${spec.stem[di]} mm · 떡잎: ${COTY[di]}.` },
    water: { name: '💧 물 주기', run: () => { if (drops) base.remove(drops.g); const g = new THREE.Group(); for (let i = 0; i < 14; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), mat(0x6fb3e0, { roughness: 0.1 })); d.position.set((i % 4 - 1.5) * 0.25, 2, ((i >> 2) - 1.5) * 0.25); d.userData.noFrame = true; g.add(d); } base.add(g); drops = { g, t: 0 }; return `물 50 mL를 줘요. 이 화분은 ${spec.water} 줘요. 물 준 날을 표에 표시해 두면 잎이 처진 날과 맞춰 볼 수 있어요.`; } },
    light: { name: '☀ 빛 오는 쪽 보기', run: () => { sun.visible = !sun.visible; return spec.light === 'shade' ? '이 화분은 그늘진 복도에 있어요. 빛이 약한 곳에서 줄기는 어떻게 자라나요?' : '창문(빛)은 오른쪽이에요. 줄기가 어느 쪽으로 기울었는지 보세요.'; } },
  };
  const api = {
    spec, places: DAYS.map((d, i) => ({ id: String(i), name: `${d}일` })), place: () => String(di), placeTitle: '날짜',
    placeNote: (name) => `${name}로 넘겼어요. 같은 날짜에서 세 화분을 비교해요.`,
    setPlace(id) { di = Math.max(0, Math.min(DAYS.length - 1, +id)); build(); },
    actions: () => Object.entries(actions).map(([id, a]) => ({ id, name: a.name })),
    run(id) { const a = actions[id]; return a ? a.run() : null; },
    setView(id) { const v = VIEWS[id] || VIEWS.angle; stage.setView({ theta: v.theta, phi: v.phi, dist: 9, target: [0, 1.5, 0] }); },
    toggle(what, on) { if (what === 'ruler') { showRuler = on; rl.visible = on; } if (what === 'roots') { showRoots = on; build(); } stage._needFit = true; },
    readings: () => SPECS.find((s) => s.id === spec.id),
    dispose() { if (drops) base.remove(drops.g); },
  };
  api.setView('angle');
  return api;
}
// 검사용: 어느 날짜든 키는 줄지 않는다, 본잎 수도 줄지 않는다
export const _specs = SPECS;
