// 자연관찰 연습 표본 — 「곰팡이 관찰일기」(초등). 원장이 쓴 영재교육자료 『곰팡이 테마 공원』의 흐름을 따른다:
// 음식에 곰팡이를 길러(뚜껑 닫은 통) → 날마다 맨눈으로 색·모양·퍼진 넓이 기록 → 돋보기로 솜털(균사)과 점(포자) 보기 → 현미경으로 종마다 다른 포자 구조 보기 → 관찰일기·그래프.
// 표본 3개: ① 식빵(흰 솜 → 검은 점: 털곰팡이 무리), ② 귤(흰 테두리 + 청록 가루: 푸른곰팡이 무리), ③ 밥(흰 테두리 + 노란 연두 가루: 누룩곰팡이 무리).
// 날짜 단추(0·2·4·6·8일)로 넘긴다. 「덮은 넓이 재기」 값은 그림에서 센 것이다 — 음식 겉면에 고르게 찍은 점 중 곰팡이 무리 안에 든 점의 비율(무리가 겹쳐도 한 번만 센다).
// 안전: 뚜껑은 열지 않는다(포자가 날린다). 현미경 그림은 구조를 보여 주는 모형이다.
import { THREE, mat, glassMat, label } from './_kit.js';
import { rng } from './_organic.js';

const CM = 2;   // 1 단위 = 2 cm
export const DAYS = [0, 2, 4, 6, 8];
const COLOR = {
  rhizo: { core: '#d9d6cc', edge: '#f7f6f0', dot: 0x1d1b18 },
  peni: { core: '#3f8a74', mid: '#86bda6', edge: '#f4f4ee' },
  asper: { core: '#a3ae36', mid: '#c9cf78', edge: '#f5f4e8' },
};
// 무리: 시작 날짜·반지름이 늘어나는 빠르기(cm/일)·자리. 자리는 빵 = 평면 (x, z) cm, 귤·밥 = 방향(경도·위도)
const SPECS = [
  { id: 'mold-bread', no: '①', name: '식빵 — 털곰팡이 무리(흰 솜 → 검은 점)', hint: '식빵 한 장(10 cm)', food: 'bread', mold: 'rhizo',
    colonies: [{ s: 2.4, k: 0.68, at: [-1.8, -1.2] }, { s: 3, k: 0.62, at: [2.0, 1.6] }, { s: 4, k: 0.6, at: [1.4, -2.4] }, { s: 5, k: 0.55, at: [-2.6, 2.6] }],
    color: ['아무것도 안 보여요.', '아직 안 보여요. 빵 표면이 조금 축축해요.', '흰 솜 같은 것이 동그랗게 났어요.', '흰 솜 위에 까만 점이 생겼어요. 솜이 빵 가장자리까지 번졌어요.', '까만 점이 빽빽해서 회색·검은색으로 보여요. 솜이 뚜껑 쪽으로 솟았어요.'],
    think: ['처음엔 무슨 색이었고, 며칠째에 까만 점이 생겼나요?', '흰 솜과 까만 점은 같은 것일까요, 다른 것일까요? 돋보기로 보세요.', '빵 가운데와 가장자리 중 어디에 먼저 났나요?'] },
  { id: 'mold-orange', no: '②', name: '귤 — 푸른곰팡이 무리(흰 테두리 + 청록 가루)', hint: '귤 한 개(지름 6 cm)', food: 'orange', mold: 'peni',
    colonies: [{ s: 2.6, k: 0.75, at: [0.4, 0.9] }, { s: 3.6, k: 0.62, at: [2.6, 0.2] }, { s: 5, k: 0.55, at: [4.4, -0.3] }],
    color: ['아무것도 안 보여요.', '아직 안 보여요.', '껍질에 흰 점이 생겼어요.', '흰 테두리 안쪽이 청록색 가루처럼 변했어요. 껍질이 물러졌어요.', '청록 가루가 넓게 퍼지고, 테두리는 여전히 하얘요. 귤이 쭈글쭈글해졌어요.'],
    think: ['무리의 가운데와 테두리 색이 다른가요? 왜 그럴까요?', '곰팡이가 난 껍질을 (뚜껑 위에서) 손가락으로 눌러 보면 어떤 느낌일까요?', '빵의 곰팡이와 색이 다른 까닭은 무엇일까요?'] },
  { id: 'mold-rice', no: '③', name: '밥 — 누룩곰팡이 무리(흰 테두리 + 노란 연두 가루)', hint: '밥 한 숟가락 더미', food: 'rice', mold: 'asper',
    colonies: [{ s: 1.6, k: 0.65, at: [0.3, 1.2] }, { s: 2.2, k: 0.6, at: [2.2, 0.7] }, { s: 3, k: 0.55, at: [4.3, 0.9] }, { s: 4, k: 0.5, at: [1.2, 0.35] }],
    color: ['아무것도 안 보여요.', '밥알 사이에 흰 실 같은 것이 조금 보여요.', '흰 솜이 동그랗게 퍼지고 가운데가 노래졌어요.', '가운데가 노란 연두색 가루로 덮였어요. 시큼한 냄새가 날 것 같아요(뚜껑은 열지 않아요).', '밥 더미 대부분이 노란 연두색이에요. 밥알이 물러졌어요.'],
    think: ['가장 먼저 곰팡이가 보인 음식은 무엇이었나요? 왜 그럴까요?', '노란 연두 가루는 무엇일까요? 현미경으로 보세요.', '세 음식의 곰팡이를 색으로 나누면 몇 무리인가요?'] },
];
export const SPECIMENS = SPECS.map((s) => () => s);
export const VIEWS = { angle: { theta: 0.3, phi: 0.95, name: '비스듬히' }, top: { theta: 0.2, phi: 0.25, name: '위에서 본 모습(넓이 재기)' } };
export const TOOLS = [{ id: 'loupe', name: '🔍 돋보기(10배)' }, { id: 'micro', name: '🔬 현미경(약 400배 모형)' }];

const radiusAt = (c, day) => Math.max(0, (day - c.s) * c.k);   // cm
// 음식 겉면에 고르게 찍은 점: 빵 = 10×10 cm 격자, 귤 = 공 겉면(피보나치 점), 밥 = 반구 겉면
const R_ORANGE = 3, R_RICE = 3.4;
const fib = (n, half) => { const out = []; for (let i = 0; i < n; i++) { const y = half ? i / n : 1 - (2 * i + 1) / n, r = Math.sqrt(1 - y * y), a = i * 2.399963; out.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return out; };
const dirOf = ([lon, lat]) => { const cl = Math.cos(lat); return [Math.cos(lon) * cl, Math.sin(lat), Math.sin(lon) * cl]; };
const SAMPLES = { bread: Array.from({ length: 1600 }, (_, i) => [((i % 40) + 0.5) / 4 - 5, Math.floor(i / 40 + 0.5) / 4 - 5]), orange: fib(1600, false), rice: fib(1200, true) };
export function coverage(spec, day) {
  const cs = spec.colonies.map((c) => ({ c, r: radiusAt(c, day) })).filter((x) => x.r > 0);
  if (!cs.length) return { pct: 0, count: 0, biggest: 0 };
  const pts = SAMPLES[spec.food], R = spec.food === 'orange' ? R_ORANGE : R_RICE;
  const inside = (p) => cs.some(({ c, r }) => { if (spec.food === 'bread') return Math.hypot(p[0] - c.at[0], p[1] - c.at[1]) < r; const d = dirOf(c.at), dot = d[0] * p[0] + d[1] * p[1] + d[2] * p[2]; return Math.acos(Math.max(-1, Math.min(1, dot))) * R < r; });
  const hit = pts.filter(inside).length;
  return { pct: Math.round((hit / pts.length) * 100), count: cs.length, biggest: Math.max(...cs.map((x) => x.r)) * 2 };
}

// 무리 한 개: 가운데 → 테두리 색이 바뀌는 둥근 판(점마다 색을 조금씩 흔든다 = 가루·솜 느낌)
function colonyMesh(spec, rCm, onSphere, R, clip = null) {
  const C = COLOR[spec.mold], r = rCm / CM, rnd = rng(Math.round(rCm * 100) + 7);
  const geo = onSphere ? new THREE.SphereGeometry(R / CM + (spec.food === 'rice' ? 0.07 : 0.02), 64, 16, 0, Math.PI * 2, 0, Math.min(Math.PI * 0.95, rCm / R)) : new THREE.CircleGeometry(r, 40, 0, Math.PI * 2);
  const pos = geo.attributes.position, col = new Float32Array(pos.count * 3), cCore = new THREE.Color(C.core), cMid = new THREE.Color(C.mid || C.core), cEdge = new THREE.Color(C.edge), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i), t = onSphere ? Math.acos(Math.max(-1, Math.min(1, v.y / v.length()))) / Math.max(1e-3, rCm / R) : v.length() / Math.max(1e-3, r);
    if (spec.mold === 'rhizo') tmp.copy(cCore).lerp(cEdge, Math.min(1, t * 1.1)); else if (t < 0.55) tmp.copy(cCore).lerp(cMid, t / 0.55); else tmp.copy(cMid).lerp(cEdge, (t - 0.55) / 0.45);
    const j = 0.92 + rnd() * 0.12; col[i * 3] = tmp.r * j; col[i * 3 + 1] = tmp.g * j; col[i * 3 + 2] = tmp.b * j;
    if (!onSphere) pos.setZ(i, (spec.mold === 'rhizo' ? 0.16 : 0.03) * r * (1 - t * t) + rnd() * 0.012);   // 솜은 볼록하게
    if (clip) { const h = clip.half, x = Math.max(-h, Math.min(h, clip.cx + v.x)) - clip.cx, y = clip.cz - Math.max(-h, Math.min(h, clip.cz - v.y)); pos.setX(i, x); pos.setY(i, y); }   // 빵 테두리 밖은 테두리에 붙인다
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide })); m.castShadow = false; m.receiveShadow = true;
  return m;
}
// 털곰팡이의 까만 점(포자주머니): 무리 위에 흩뿌린 작은 공
function sporeDots(rCm, n, seed) {
  const g = new THREE.Group(), rnd = rng(seed), m = mat(COLOR.rhizo.dot, { roughness: 0.6 }), geo = new THREE.SphereGeometry(0.022, 6, 5);
  const mesh = new THREE.InstancedMesh(geo, m, n), o = new THREE.Object3D();
  for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * rCm / CM * 0.85; o.position.set(Math.cos(a) * d, 0.1 + rnd() * 0.12 * (1 - d / (rCm / CM)), Math.sin(a) * d); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); }
  g.add(mesh); return g;
}
// 음식
function bread() {
  const g = new THREE.Group(), s = 10 / CM;
  const crumbCv = document.createElement('canvas'); crumbCv.width = crumbCv.height = 256; const c = crumbCv.getContext('2d'); c.fillStyle = '#f1e2c2'; c.fillRect(0, 0, 256, 256); const r = rng(5); for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(${150 + r() * 60},${120 + r() * 50},${80 + r() * 30},${0.15 + r() * 0.3})`; c.beginPath(); c.ellipse(r() * 256, r() * 256, 1 + r() * 4, 1 + r() * 3, r() * 3, 0, Math.PI * 2); c.fill(); }
  const tex = new THREE.CanvasTexture(crumbCv); tex.colorSpace = THREE.SRGBColorSpace;
  const crust = mat(0xa8672e, { roughness: 0.8 }), crumb = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(s, 0.5, s), [crust, crust, crumb, crust, crust, crust]); m.position.y = 0.25; m.castShadow = true; m.receiveShadow = true; g.add(m);
  g.userData.top = 0.5; return g;
}
function orange() {
  const g = new THREE.Group(), R = R_ORANGE / CM, geo = new THREE.SphereGeometry(R, 48, 32), pos = geo.attributes.position, rnd = rng(9);
  for (let i = 0; i < pos.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(pos, i); v.multiplyScalar(1 + (rnd() - 0.5) * 0.012); v.y *= 0.86; pos.setXYZ(i, v.x, v.y, v.z); }
  geo.computeVertexNormals(); const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xf08a1c, roughness: 0.55, clearcoat: 0.4 })); m.position.y = R * 0.86; m.castShadow = true; g.add(m);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.08, 8), mat(0x6c7a2c)); stem.position.y = R * 1.72; g.add(stem);
  g.userData.center = new THREE.Vector3(0, R * 0.86, 0); g.userData.squash = 0.86; return g;
}
function rice() {
  const g = new THREE.Group(), R = R_RICE / CM;
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.35, R * 1.1, 0.25, 40), mat(0xf5f3ee, { roughness: 0.35 })); dish.position.y = 0.12; dish.receiveShadow = true; g.add(dish);
  const heap = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xf7f5ec, { roughness: 0.9 })); heap.position.y = 0.25; heap.scale.y = 0.62; g.add(heap);
  const grains = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.05, 0.1, 3, 6), mat(0xfbfaf3, { roughness: 0.7 }), 260), o = new THREE.Object3D(), rnd = rng(3);
  fib(260, true).forEach((p, i) => { const nrm = new THREE.Vector3(p[0], p[1] / 0.62, p[2]).normalize(), tan = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(nrm).normalize(); o.position.set(p[0] * R * 0.99, 0.25 + p[1] * R * 0.62 * 0.99, p[2] * R * 0.99); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan); o.updateMatrix(); grains.setMatrixAt(i, o.matrix); }); g.add(grains);   // 밥알은 겉면에 눕힌다(세우면 곰팡이를 뚫고 가시처럼 보였다)
  g.userData.center = new THREE.Vector3(0, 0.25, 0); g.userData.squash = 0.62; return g;
}
// 현미경 모형(약 400배): 둥근 시야 + 균사 + 종마다 다른 포자 구조. 돋보기(10배): 솜털 균사가 솟은 무리 한 개
function fieldDisc(text) {
  const g = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CircleGeometry(2, 64), mat(0xf6f2e2, { roughness: 1 })); g.add(disc);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.09, 10, 64), mat(0x222222, { roughness: 0.5 })); g.add(ring);
  const t = label(text, { size: 0.28 }); t.position.set(0, 2.55, 0.05); g.add(t); return g;
}
const tubeAlong = (pts, r, color) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 24, r, 6), mat(color, { roughness: 0.7 })); return m; };
function microscope(spec) {
  const g = fieldDisc('🔬 현미경 400배(모형)'), rnd = rng(17), hy = 0xb9b29a;
  for (let i = 0; i < 6; i++) { const y = -1.4 + i * 0.5; g.add(tubeAlong([[-1.9, y + rnd() * 0.3, 0.02], [-0.6, y + (rnd() - 0.5) * 0.5, 0.02], [0.7, y + (rnd() - 0.5) * 0.5, 0.02], [1.9, y + rnd() * 0.3, 0.02]], 0.025, hy)); }
  const spheres = (n, r, color) => new THREE.InstancedMesh(new THREE.SphereGeometry(r, 8, 6), mat(color, { roughness: 0.6 }), n);
  if (spec.mold === 'rhizo') {
    for (const x of [-0.9, 0.2, 1.1]) { g.add(tubeAlong([[x, -1.2, 0.04], [x + 0.05, 0, 0.04], [x, 0.9, 0.04]], 0.04, 0xa8a291)); const sp = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 14), mat(0x1f1d1a, { roughness: 0.5 })); sp.position.set(x, 1.15, 0.06); g.add(sp); for (let k = -1; k <= 1; k++) g.add(tubeAlong([[x, -1.2, 0.04], [x + k * 0.15, -1.4, 0.04], [x + k * 0.3, -1.55, 0.04]], 0.015, hy)); }
  } else {
    const col = spec.mold === 'peni' ? 0x3f8a74 : 0xa3ae36, dots = spheres(160, 0.05, col), o = new THREE.Object3D(); let k = 0;
    for (const x of [-0.9, 0.3, 1.2]) {
      g.add(tubeAlong([[x, -1.2, 0.04], [x, 0, 0.04], [x, 0.55, 0.04]], 0.04, 0xa8a291));
      if (spec.mold === 'peni') { for (let b = -1.5; b <= 1.5; b++) { const bx = x + b * 0.13; g.add(tubeAlong([[x, 0.55, 0.04], [bx, 0.75, 0.04], [bx, 0.85, 0.04]], 0.02, 0xa8a291)); for (let c = 0; c < 6 && k < 160; c++) { o.position.set(bx + b * 0.02 * c, 0.92 + c * 0.1, 0.06); o.updateMatrix(); dots.setMatrixAt(k++, o.matrix); } } }
      else { const v = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), mat(0xc9c08a)); v.position.set(x, 0.7, 0.05); g.add(v); for (let a = 0; a < 9; a++) { const ang = Math.PI * (0.05 + a / 8 * 0.9); for (let c = 0; c < 5 && k < 160; c++) { const d = 0.26 + c * 0.1; o.position.set(x + Math.cos(ang) * d, 0.7 + Math.sin(ang) * d, 0.06); o.updateMatrix(); dots.setMatrixAt(k++, o.matrix); } } }
    }
    dots.count = k; g.add(dots);
  }
  return g;
}
function loupe(spec) {
  const g = fieldDisc('🔍 돋보기 10배'), rnd = rng(23), C = COLOR[spec.mold];
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(new THREE.Color(spec.mold === 'rhizo' ? C.edge : C.core).getHex(), { roughness: 1 })); dome.rotation.x = Math.PI / 2; dome.scale.set(1, 1, 0.35); dome.position.z = 0.02; g.add(dome);
  const hair = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.008, 0.008, 1, 4), mat(0xf4f2ea, { roughness: 1 }), 220), o = new THREE.Object3D();
  for (let i = 0; i < 220; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 1.45, l = 0.15 + rnd() * 0.35; o.position.set(Math.cos(a) * d, Math.sin(a) * d, 0.25 + l / 2); o.rotation.set(Math.PI / 2 + (rnd() - 0.5) * 0.8, 0, (rnd() - 0.5) * 0.8); o.scale.set(1, l, 1); o.updateMatrix(); hair.setMatrixAt(i, o.matrix); }
  g.add(hair);
  if (spec.mold === 'rhizo') { const d = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 8, 6), mat(0x1d1b18), 90); for (let i = 0; i < 90; i++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 1.2; o.position.set(Math.cos(a) * r, Math.sin(a) * r, 0.5 + rnd() * 0.25); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1); o.updateMatrix(); d.setMatrixAt(i, o.matrix); } g.add(d); }
  return g;
}

export function mountSpecimen(stage, make) {
  stage.clear();
  const spec = make(), base = new THREE.Group(); stage.root.add(base);
  const paper = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.04, 7.4), mat(0xfaf8f1, { roughness: 0.95 })); paper.position.y = -0.02; paper.receiveShadow = true; paper.userData.noFrame = true; base.add(paper);
  const food = spec.food === 'bread' ? bread() : spec.food === 'orange' ? orange() : rice(); base.add(food);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(6.6, 4.2, 6.6), glassMat(0xeaf4f8, 0.16)); lid.position.y = 2.1; lid.userData.noFrame = true; base.add(lid);
  const tag = label(spec.no, { size: 0.36 }); tag.position.set(-3.6, 0.5, 2.6); base.add(tag);
  const note = label('뚜껑을 열지 않아요', { size: 0.26, color: '#b03a2e' }); note.position.set(0, 4.4, 3.3); note.userData.noFrame = true; base.add(note);
  const micro = microscope(spec); micro.position.set(5.2, 3.4, -2.6); micro.rotation.set(-0.55, -0.3, 0); micro.scale.setScalar(1.3); micro.visible = false; base.add(micro);
  const lp = loupe(spec); lp.position.set(-5.2, 3.4, -2.6); lp.rotation.set(-0.55, 0.3, 0); lp.scale.setScalar(1.3); lp.visible = false; base.add(lp);
  let di = 3, molds = null;
  const build = () => {
    if (molds) food.remove(molds); molds = new THREE.Group(); food.add(molds); const day = DAYS[di];
    spec.colonies.forEach((c, i) => {
      const r = radiusAt(c, day); if (r <= 0) return;
      if (spec.food === 'bread') { const m = colonyMesh(spec, r, false, 0, { cx: c.at[0] / CM, cz: c.at[1] / CM, half: 5 / CM - 0.02 }); m.rotation.x = -Math.PI / 2; m.position.set(c.at[0] / CM, food.userData.top + 0.005 + i * 0.002, c.at[1] / CM); molds.add(m); if (day >= 6) { const d = sporeDots(r, Math.round(9 * r * r), 40 + i); d.position.copy(m.position); molds.add(d); } return; }
      const R = spec.food === 'orange' ? R_ORANGE : R_RICE, m = colonyMesh(spec, r, true, R), dir = new THREE.Vector3(...dirOf(c.at));
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); m.scale.y = 1; const holder = new THREE.Group(); holder.position.copy(food.userData.center); holder.scale.set(1, food.userData.squash, 1); holder.add(m); molds.add(holder);
    });
    stage._needFit = true;
  };
  build();
  const fmt = (x) => x.toFixed(1);
  const actions = {
    measure: { name: '📏 덮은 넓이 재기', run() { const day = DAYS[di], c = coverage(spec, day); return c.count ? `${day}일 · ${spec.no}: 곰팡이 무리 ${c.count}개 · 가장 큰 무리 지름 ${fmt(c.biggest)} cm · 덮은 넓이 약 ${c.pct}%(겉면에 찍은 점 중 곰팡이 위에 있는 점의 비율).` : `${day}일 · ${spec.no}: 아직 곰팡이 무리가 보이지 않아요(덮은 넓이 0%).`; } },
    color: { name: '🎨 색·모양 기록', run() { return `${DAYS[di]}일 · ${spec.no}: ${spec.color[di]}`; } },
    safety: { name: '⚠ 안전 수칙', run() { return '뚜껑을 열지 않아요 — 포자가 날려 숨 쉴 때 들어갈 수 있어요. 통 밖에서만 보고, 관찰이 끝나면 통째로 비닐에 싸서 버려요. 만진 뒤에는 손을 씻어요.'; } },
  };
  const api = {
    spec, places: DAYS.map((d, i) => ({ id: String(i), name: `${d}일` })), place: () => String(di), placeTitle: '날짜',
    placeNote: (name) => `${name}로 넘겼어요. 같은 날짜에서 세 음식을 비교해요.`,
    setPlace(id) { di = Math.max(0, Math.min(DAYS.length - 1, +id)); build(); },
    actions: () => Object.entries(actions).map(([id, a]) => ({ id, name: a.name })),
    run(id) { const a = actions[id]; return a ? a.run() : null; },
    setView(id) { const v = VIEWS[id] || VIEWS.angle; stage.setView({ theta: v.theta, phi: v.phi, dist: 12, target: [0, 1, 0] }); },
    toggle(what, on) { if (what === 'micro') micro.visible = on; if (what === 'loupe') lp.visible = on; stage._needFit = true; },
    toolNote: (what) => what === 'micro' ? (spec.mold === 'rhizo' ? '현미경: 실 같은 균사 끝에 둥근 포자주머니(까만 공)가 달려 있어요. 맨눈의 까만 점이 바로 이거예요.' : spec.mold === 'peni' ? '현미경: 균사 끝이 붓처럼 갈라지고 그 끝에 둥근 포자가 사슬로 줄줄이 달려 있어요. 청록 가루가 이 포자예요.' : '현미경: 균사 끝이 둥글게 부풀고 그 둘레에 포자 사슬이 사방으로 퍼져 있어요. 노란 연두 가루가 이 포자예요.') : what === 'loupe' ? (spec.mold === 'rhizo' ? '돋보기: 흰 솜털(균사)이 위로 솟고 그 끝에 까만 점이 달려 있어요.' : '돋보기: 가운데는 색이 있는 가루, 테두리는 흰 솜털이에요. 테두리가 새로 자라는 부분일까요?') : '',
  };
  api.setView('angle');
  return api;
}
