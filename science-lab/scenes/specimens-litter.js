// 자연관찰 연습 표본 — 「숲 바닥: 낙엽 쌓인 곳과 맨땅」(초등, 대회 날 현장 관찰).
// 기출 꼴: 「낙엽이 쌓여 있는 곳과 그렇지 않은 곳의 토양과 생물(주로 동물)을 비교 관찰하고, 산림을 잘 가꾸고 보존하기 위해 우리가 할 수 있는 일을 적어 봅시다」.
// 장소 A = 참나무 숲 아래 낙엽이 쌓인 곳 / 장소 B = 산책로 옆, 밟혀 다져진 맨땅. 두 곳 모두 같은 넓이(30 cm 네모 틀)에서 낙엽을 걷고 흙 속 동물을 찾아 센다.
// 표본 4종: ① 쥐며느리(다리 14개, 몸을 말지 않음) ② 노래기(마디마다 다리 2쌍, 몸을 맒) ③ 지네(마디마다 다리 1쌍, 독턱 — 맨손 금지) ④ 지렁이(다리 없음, 환대).
// 환경 확인: 흙 단면(낙엽층 두께) · 흙의 물기(쥐었다 편 손) · 흙 온도(온도계) · 흙의 단단함(같은 힘으로 꼬챙이 꽂기). 값은 그림으로만 보이고 아이가 읽어 적는다 — 모형 값이다.
// 모형은 코드로 만든 것이다. 이름은 「이름 확인」 전엔 번호로만.
import { THREE, mat, glossMat, label, clamp01, ease } from './_kit.js';
import { chitinTex, soilTex, rng, hex } from './_organic.js';
import { ruler, handCard } from './specimens-insects.js';

const DISH_R = 2.1, DISH_H = 0.12, TOP = DISH_H;
// count = 30 cm 네모 틀 안에서 찾은 수 [①, ②, ③, ④] — 예시 보고서 표가 이 값과 같은지 테스트가 본다
export const PLACES = {
  A: { id: 'A', name: '장소 A', where: '낙엽 쌓인 숲 바닥', soil: 0x3d2c20, litter: 4, humus: 3, wet: 0.85, temp: 15, poke: 9, count: [7, 3, 1, 2] },
  B: { id: 'B', name: '장소 B', where: '산책로 옆 맨땅', soil: 0x9a7a55, litter: 0, humus: 0, wet: 0.2, temp: 21, poke: 2, count: [1, 0, 0, 0] },
};
export const PLACE_LIST = [PLACES.A, PLACES.B];

const V3 = (x, y, z) => new THREE.Vector3(x, y, z), UP = V3(0, 1, 0), _d = V3(0, 0, 0);
function rod(color, r0, r1) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, 1, 7), glossMat(color, { roughness: 0.5 })); m.castShadow = true; return m; }
function orient(m, a, b) { _d.subVectors(b, a); const len = _d.length() || 0.001; m.position.copy(a).addScaledVector(_d, 0.5); m.scale.set(1, len, 1); m.quaternion.setFromUnitVectors(UP, _d.normalize()); }
// 다리 하나: 붙은 자리 at에 축(pivot)을 두고, 그 안에서 무릎 k → 발 f. 걸을 때 축을 앞뒤로 흔든다.
function legPivot(parent, color, r, at, k, f) { const p = new THREE.Group(); p.position.copy(at); parent.add(p); const u = rod(color, r, r * 0.8), l = rod(color, r * 0.8, r * 0.45); orient(u, V3(0, 0, 0), k); orient(l, k, f); p.add(u, l); return p; }
const ell = (rx, ry, rz, material) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 14), material); m.scale.set(rx, ry, rz); m.castShadow = true; return m; };
const skin = (key, base, spot, density, rings = 2) => new THREE.MeshPhysicalMaterial({ map: chitinTex(key, { base: hex(base), spot: hex(spot), light: hex(base), density, rings }), roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.35 });
const antenna = (parent, color, r, pts) => { for (let i = 1; i < pts.length; i++) { const m = rod(color, r * (1 - i * 0.12), r * (1 - (i + 1) * 0.12)); orient(m, pts[i - 1], pts[i]); parent.add(m); } };
// 몸마디가 줄지은 동물(노래기·지네·지렁이): 마디 그룹을 길(path) 위에 늘어놓고, 머리 쪽(s가 작은 쪽)을 +x로 돌린다
function chain(body, N, sp, make, path) {
  const segs = Array.from({ length: N }, (_, i) => { const g = make(i); body.add(g); return g; });
  const layout = (o = 0, t = 0, e = 0) => { for (let i = 0; i < N; i++) { const s = i * sp, [x, z] = path(s, o, t, e, i), [x2, z2] = path(s + 0.02, o, t, e, i), g = segs[i]; g.position.x = x; g.position.z = z; g.rotation.y = Math.atan2(-(z - z2), x - x2); } };
  layout(); return { segs, layout };
}
// 마디 칠하기용: 마디마다 따로 쓴 재질과 처음 색
const keep = (m) => { m.userData.c0 = m.color.getHex(); return m; };

// ① 쥐며느리 — 납작한 타원형 등판 7장 + 꼬리 쪽 작은 마디 5개 + 꼬리돌기 2개, 다리 7쌍, 긴 더듬이
function buildWoodlouse() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const segMats = [], legs = [], y = 0.15;
  const head = ell(0.16, 0.12, 0.33, skin('wl-head', 0x5d5a55, 0x2c2a27, 0.2)); head.position.set(0.98, y, 0); body.add(head);
  for (const s of [-1, 1]) { const e = ell(0.045, 0.045, 0.045, mat(0x141414)); e.position.set(1.02, y + 0.07, 0.25 * s); body.add(e); antenna(body, 0x77726a, 0.032, [V3(1.08, y, 0.14 * s), V3(1.45, y + 0.1, 0.42 * s), V3(1.78, y + 0.06, 0.66 * s), V3(2.0, y - 0.02, 0.84 * s)]); }
  for (let i = 0; i < 7; i++) {
    const x = 0.74 - i * 0.24, hw = 0.6 * (0.84 + 0.16 * Math.sin(Math.PI * (i + 1) / 8)), m = keep(skin('wl-' + i, 0x6e6b66, 0x34322e, 0.35));
    const rim = ell(0.17, 0.07, hw + 0.04, mat(0xb5aea2, { roughness: 0.8 })); rim.position.set(x, y - 0.04, 0); body.add(rim);
    const p = ell(0.17, 0.1, hw, m); p.position.set(x, y, 0); body.add(p); segMats.push(m);
    for (const s of [-1, 1]) legs.push(legPivot(body, 0x9a948c, 0.028, V3(x, 0.07, hw * 0.55 * s), V3(0.03, 0.06, 0.18 * s), V3(i < 3 ? 0.1 : -0.06, -0.07, 0.34 * s)));
  }
  for (let i = 0; i < 5; i++) { const x = -0.84 - i * 0.09, hw = 0.46 - i * 0.06, m = keep(skin('wlp-' + i, 0x67645f, 0x34322e, 0.25)); const p = ell(0.08, 0.09, hw, m); p.position.set(x, y - 0.01, 0); body.add(p); segMats.push(m); }
  const tel = ell(0.09, 0.05, 0.12, mat(0x5a5752)); tel.position.set(-1.3, y - 0.03, 0); body.add(tel);
  for (const s of [-1, 1]) { const u = rod(0x8a847b, 0.035, 0.02); orient(u, V3(-1.26, y - 0.04, 0.1 * s), V3(-1.5, y - 0.06, 0.17 * s)); body.add(u); }
  g.userData = { L: 2.2, body, segMats, legs, topY: y + 0.15,
    poke: (t) => { const o = ease.out(clamp01(t / 0.7)); body.position.x = 0.55 * o; legs.forEach((p, i) => { p.rotation.y = 0.45 * Math.sin(t * 40 + i * 1.3) * (t < 0.75 ? 1 : 0); }); if (t >= 1) { body.position.x = 0; legs.forEach((p) => { p.rotation.y = 0; }); } } };
  return g;
}
// ② 노래기 — 둥근 마디 34개(마디마다 다리 2쌍), 건드리면 몸을 돌돌 만다(머리가 안쪽)
const MIL_N = 34, MIL_SP = 0.1;
const spiral = (() => { const pts = [[0, 0.16, 0]]; let th = 0, len = 0, last = [0.16, 0]; while (len < MIL_N * MIL_SP + 0.2) { th += 0.02; const r = 0.16 + 0.052 * th, p = [r * Math.cos(th), r * Math.sin(th)]; len += Math.hypot(p[0] - last[0], p[1] - last[1]); pts.push([len, p[0], p[1]]); last = p; } return pts; })();
const spiralAt = (s) => { let i = 1; while (i < spiral.length - 1 && spiral[i][0] < s) i++; const a = spiral[i - 1], b = spiral[i], u = clamp01((s - a[0]) / ((b[0] - a[0]) || 1)); return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; };
function buildMillipede() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body); const segMats = [], y = 0.13;
  const path = (s, o) => { const a = [1.6 - s, 0.3 * Math.sin(s * 1.7)], b = spiralAt(s); return [a[0] + (b[0] - a[0]) * o, a[1] + (b[1] - a[1]) * o]; };
  const { layout } = chain(body, MIL_N, MIL_SP, (i) => {
    const sg = new THREE.Group(); sg.position.y = y;
    if (i === 0) { const h = ell(0.11, 0.1, 0.12, mat(0x24170f, { roughness: 0.5 })); h.position.x = 0.02; sg.add(h); for (const s of [-1, 1]) antenna(sg, 0x5a4030, 0.018, [V3(0.08, 0.03, 0.05 * s), V3(0.18, 0.06, 0.11 * s), V3(0.27, 0.03, 0.15 * s)]); return sg; }
    const r = i > MIL_N - 4 ? 0.12 - (i - (MIL_N - 4)) * 0.022 : 0.12, m = keep(glossMat(i % 2 ? 0x2e1f17 : 0x35241a, { roughness: 0.35 }));
    sg.add(ell(0.062, r, r, m)); segMats.push(m);
    const band = new THREE.Mesh(new THREE.TorusGeometry(r * 0.96, 0.016, 6, 20), mat(0x8a5a2a)); band.rotation.y = Math.PI / 2; band.position.x = -0.045; sg.add(band);
    if (i >= 3 && i < MIL_N - 2) for (const dx of [0.02, -0.025]) for (const s of [-1, 1]) legPivot(sg, 0xc9a46a, 0.012, V3(dx, -0.05, 0.06 * s), V3(0, -0.02, 0.07 * s), V3(-0.01, -0.08, 0.12 * s));
    return sg;
  }, path);
  g.userData = { L: MIL_N * MIL_SP, body, segMats, topY: y + 0.13,
    poke: (t) => { const o = t < 0.3 ? ease.io(t / 0.3) : t > 0.8 ? 1 - ease.io((t - 0.8) / 0.2) : 1; layout(o); } };
  return g;
}
// ③ 지네 — 납작한 마디 21개(마디마다 다리 1쌍, 옆으로 길게), 머리 아래 독턱, 마지막 다리는 뒤로 길게
function buildCentipede() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body); const segMats = [], N = 22, sp = 0.15, y = 0.09, legs = [];
  const path = (s, o, t, e) => [1.6 - s, 0.22 * Math.sin(s * 1.2 + 0.5) + 0.05 * e * Math.sin(s * 5 - t * 30)];
  const { layout } = chain(body, N, sp, (i) => {
    const sg = new THREE.Group(); sg.position.y = y;
    if (i === 0) {
      sg.add(ell(0.12, 0.05, 0.14, mat(0x5a2210, { roughness: 0.45 })));
      for (const s of [-1, 1]) { antenna(sg, 0xb07a3a, 0.02, [V3(0.1, 0.02, 0.06 * s), V3(0.35, 0.05, 0.2 * s), V3(0.6, 0.03, 0.34 * s), V3(0.82, 0.0, 0.4 * s)]); const hook = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.016, 6, 12, Math.PI * 0.8), mat(0x1a0d08)); hook.rotation.set(-Math.PI / 2, 0, s > 0 ? -Math.PI * 0.8 : 0); hook.position.set(0.1, -0.03, 0.07 * s); sg.add(hook); }
      return sg;
    }
    const m = keep(skin('cp-' + i, i % 2 ? 0x8a3a1c : 0x7e3418, 0x4a1a0a, 0.15)); sg.add(ell(0.08, 0.05, 0.13, m)); segMats.push(m);
    for (const s of [-1, 1]) legs.push(i === N - 1 ? legPivot(sg, 0xd9a441, 0.018, V3(-0.04, 0, 0.08 * s), V3(-0.25, 0.05, 0.16 * s), V3(-0.55, -0.04, 0.22 * s)) : legPivot(sg, 0xd9a441, 0.016, V3(0, 0, 0.11 * s), V3(0.02, 0.1, 0.28 * s), V3(-0.06, -0.08, 0.4 * s)));
    return sg;
  }, path);
  g.userData = { L: N * sp, body, segMats, legs, topY: y + 0.1,
    poke: (t) => { const e = t < 0.85 ? 1 : 0, o = ease.out(clamp01(t / 0.8)); layout(0, t, e); body.position.x = 0.7 * o; legs.forEach((p, i) => { p.rotation.y = 0.5 * Math.sin(t * 50 - i * 0.6) * e; }); if (t >= 1) { body.position.x = 0; layout(); legs.forEach((p) => { p.rotation.y = 0; }); } } };
  return g;
}
// ④ 지렁이 — 마디 구슬 70개를 겹쳐 고리 무늬, 머리 쪽 1/4쯤에 두꺼운 띠(환대). 건드리면 몸을 늘였다 줄였다 꿈틀
function buildWorm() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body); const segMats = [], N = 70, sp = 0.055;
  const rad = (i) => { let r = 0.1; if (i < 6) r *= 0.6 + 0.4 * (i / 6); if (i > N - 12) r *= 0.65 + 0.35 * ((N - i) / 12); if (i >= 14 && i <= 20) r *= 1.18; return r; };
  // 꿈틀: 마디 사이 거리를 파도처럼 늘였다 줄였다(연동 운동) + 옆으로 굽이침
  // 늘임 비율 1 + 0.28·e·sin(a·s + b)를 0~s까지 적분한 길이(마디가 몰렸다 벌어진다)
  const a = 0.3 / sp, path = (s, o, t, e) => { const b = -t * 14, q = s + (0.28 * e * (Math.cos(b) - Math.cos(a * s + b))) / a; return [1.75 - q * 0.95, 0.42 * Math.sin(q * 1.9) + 0.12 * e * Math.sin(q * 3 - t * 8)]; };
  const { segs, layout } = chain(body, N, sp, (i) => {
    const sg = new THREE.Group(), r = rad(i), clit = i >= 14 && i <= 20, m = keep(new THREE.MeshPhysicalMaterial({ color: clit ? 0xd9907a : i % 2 ? 0xa85a50 : 0xb3655a, roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.25 }));
    const b = ell(r * 0.7, r, r, m); sg.add(b); sg.position.y = r; segMats.push(m); return sg;
  }, path);
  segs.forEach((sg, i) => { sg.position.y = rad(i); });
  g.userData = { L: N * sp * 0.95, body, segMats, topY: 0.24, poke: (t) => { const e = t < 0.9 ? Math.sin(Math.PI * clamp01(t / 0.9)) : 0; layout(0, t, e); } };
  return g;
}

const SPECS = [
  { id: 'woodlouse', no: '①', name: '쥐며느리', hint: '납작한 회색 타원형, 다리가 많다', place: 'A', cm: 1.2, build: buildWoodlouse,
    think: ['다리는 모두 몇 개인가요? 「뒤집어 보기」로 세어 보세요. 곤충(6개)과 같나요?', '건드렸을 때 몸을 공처럼 말았나요?', '몸 끝에 삐죽 나온 것은 몇 개인가요?'],
    notes: { poke: '몸을 말지 않고 재빨리 낙엽 아래로 달아나요. 비슷하게 생긴 공벌레는 공처럼 말아요 — 둘을 무엇으로 구별할 수 있을까요?', flip: '배 쪽 다리를 세어 보세요. 마디마다 한 쌍, 모두 일곱 쌍이에요.' } },
  { id: 'millipede', no: '②', name: '노래기', hint: '길고 둥근 몸, 짧은 다리가 아주 많다', place: 'A', cm: 4, build: buildMillipede,
    think: ['한 마디에 다리가 몇 쌍인가요? 「마디 칠하기」를 켜고 세어 보세요.', '건드리면 어떻게 하나요? 머리는 어디로 가나요?', '몸을 자른 단면은 둥글까요, 납작할까요?'],
    notes: { poke: '몸을 돌돌 말아 단단한 등을 바깥으로 해요(머리가 안쪽). 느리게 움직이고, 썩은 낙엽을 먹어요.', flip: '한 마디에 다리가 두 쌍씩 붙어 있어요. ③과 비교해 보세요.' } },
  { id: 'centipede', no: '③', name: '지네', hint: '납작하고 붉은 갈색, 다리가 옆으로 길다', place: 'A', cm: 5, build: buildCentipede,
    think: ['한 마디에 다리가 몇 쌍인가요? ②와 다른가요?', '머리 아래 갈고리 같은 것은 무엇에 쓸까요?', '②와 빠르기가 어떻게 다른가요?'],
    notes: { poke: '아주 빠르게 달아나요. 머리 아래 독턱으로 작은 동물을 잡아먹어요 — 맨손으로 만지지 않아요(핀셋과 통을 써요).', flip: '한 마디에 다리가 한 쌍씩, 옆으로 길게 뻗어요. 마지막 다리는 뒤로 길어요.' } },
  { id: 'worm', no: '④', name: '지렁이', hint: '다리 없는 긴 원통, 고리 무늬가 많다', place: 'A', cm: 10, build: buildWorm,
    think: ['다리 없이 어떻게 움직일까요? 몸이 늘었다 줄었다 하는지 보세요.', '몸에 띠처럼 두꺼운 곳은 머리 쪽에 가까운가요, 꼬리 쪽에 가까운가요?', '흙이 축축한 곳과 마른 곳 중 어디에 많았나요?'],
    notes: { poke: '꿈틀거리며 몸을 늘였다 줄였다 해요. 피부로 숨을 쉬어서 피부가 마르면 안 돼요 — 그래서 축축한 흙에 살아요.', flip: '배 쪽은 색이 연하고, 마디마다 아주 짧은 털(강모)이 있어 미끄러지지 않아요(돋보기로 보일 만큼 작아요).' } },
];
export const SPECIMENS = SPECS.map((s) => () => s);
export const VIEWS = { angle: { theta: 0.55, phi: 1.05, name: '비스듬히' }, top: { theta: 0.15, phi: 0.3, name: '위에서 본 모습' }, side: { theta: 0, phi: 1.45, name: '옆에서 본 모습' } };
export const TOOLS = [{ id: 'ruler', name: '📏 자 대기' }, { id: 'seg', name: '🎨 마디 칠하기' }];

// 그림 카드(캔버스) — 흙 단면 · 온도계 · 꼬챙이. 숫자는 눈금으로만 보인다(아이가 읽는다)
function card(draw, w = 1.6, h = 1.9) {
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 380; const c = cv.getContext('2d');
  c.fillStyle = '#fffaf0'; c.fillRect(0, 0, 320, 380); c.strokeStyle = '#8a7a60'; c.lineWidth = 3; c.strokeRect(2, 2, 316, 376); draw(c);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); m.userData.noFrame = true; return m;
}
const ticks = (c, x, y0, cm, px, step = 1) => { c.strokeStyle = '#2b2b2b'; c.fillStyle = '#2b2b2b'; c.lineWidth = 2; c.font = '700 15px Pretendard, sans-serif'; c.textAlign = 'right'; for (let i = 0; i <= cm; i += step) { const y = y0 + i * px; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (i % 5 ? 8 : 16), y); c.stroke(); if (i % 5 === 0) c.fillText(String(i), x - 4, y + 5); } };
function profileCard(P) {
  return card((c) => {
    c.fillStyle = '#2b2b2b'; c.font = '700 20px Pretendard, sans-serif'; c.textAlign = 'center'; c.fillText(`${P.name} 흙 단면(cm)`, 170, 34);
    const top = 70, px = 26, X = 90, W = 200; let y = top; const R = rng(P.id === 'A' ? 41 : 42);
    if (P.litter) { c.fillStyle = '#b07a3a'; c.fillRect(X, y, W, P.litter * px); for (let i = 0; i < 60; i++) { c.fillStyle = ['#8a5424', '#c48a44', '#6e4420', '#d0a050'][i % 4]; c.beginPath(); c.ellipse(X + R() * W, y + R() * P.litter * px, 10 + R() * 14, 3 + R() * 4, R() * 0.6 - 0.3, 0, Math.PI * 2); c.fill(); } y += P.litter * px; }
    if (P.humus) { c.fillStyle = '#2e2018'; c.fillRect(X, y, W, P.humus * px); y += P.humus * px; }
    c.fillStyle = P.id === 'A' ? '#6a4a30' : '#b08a5e'; c.fillRect(X, y, W, top + 11 * px - y); for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(${P.id === 'A' ? '30,20,10' : '90,70,50'},${0.2 + R() * 0.3})`; c.beginPath(); c.arc(X + R() * W, y + R() * (top + 11 * px - y), 1.5 + R() * 3, 0, Math.PI * 2); c.fill(); }
    if (!P.litter) { c.strokeStyle = '#7a6040'; c.lineWidth = 4; c.beginPath(); c.moveTo(X, top + 2); c.lineTo(X + W, top + 2); c.stroke(); }
    ticks(c, X - 4, top, 11, px);
  });
}
function thermoCard(P) {
  return card((c) => {
    c.fillStyle = '#2b2b2b'; c.font = '700 20px Pretendard, sans-serif'; c.textAlign = 'center'; c.fillText('흙 속 5 cm 온도(℃)', 160, 34);
    const x = 150, top = 60, px = 9.5, y0 = top + 30 * px;
    c.fillStyle = '#ffffff'; c.strokeStyle = '#555'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - 10, top - 10, 20, 30 * px + 20, 10); c.fill(); c.stroke(); c.beginPath(); c.arc(x, y0 + 22, 18, 0, Math.PI * 2); c.fillStyle = '#d0342c'; c.fill(); c.stroke();
    c.fillStyle = '#d0342c'; c.fillRect(x - 4, y0 - P.temp * px, 8, P.temp * px + 12);
    c.strokeStyle = '#2b2b2b'; c.lineWidth = 2; c.font = '700 15px Pretendard, sans-serif'; c.textAlign = 'left'; for (let i = 0; i <= 30; i++) { const y = y0 - i * px; c.beginPath(); c.moveTo(x + 12, y); c.lineTo(x + 12 + (i % 5 ? 8 : 16), y); c.stroke(); if (i % 5 === 0) c.fillText(String(i), x + 34, y + 5); }
  });
}
function stickCard(P) {
  return card((c) => {
    c.fillStyle = '#2b2b2b'; c.font = '700 19px Pretendard, sans-serif'; c.textAlign = 'center'; c.fillText('같은 힘으로 꼬챙이 누르기', 160, 34);
    const ground = 150, px = 18, x = 170;
    c.fillStyle = PLACES[P.id].litter ? '#6a4a30' : '#b08a5e'; c.fillRect(20, ground, 280, 210);
    c.fillStyle = '#d8b878'; c.strokeStyle = '#6a5030'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 7, 60); c.lineTo(x + 7, 60); c.lineTo(x + 7, ground + P.poke * px - 14); c.lineTo(x, ground + P.poke * px); c.lineTo(x - 7, ground + P.poke * px - 14); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#2b2b2b'; c.fillStyle = '#fffaf0'; c.lineWidth = 2; c.font = '700 14px Pretendard, sans-serif'; c.textAlign = 'right'; for (let i = 0; i <= 10; i++) { const y = ground + i * px; c.beginPath(); c.moveTo(x - 7, y); c.lineTo(x - 7 - (i % 5 ? 6 : 12), y); c.strokeStyle = '#fff'; c.stroke(); if (i % 5 === 0) { c.fillText(String(i), x - 24, y + 5); } }
    c.fillStyle = '#2b2b2b'; c.font = '700 14px Pretendard, sans-serif'; c.textAlign = 'left'; c.fillText('땅 표면 = 0 cm', 24, ground - 8);
  });
}
// 30 cm 네모 틀 — 낙엽을 걷어 낸 자리에서 찾은 동물(작은 모양으로). 세는 것은 아이가 한다
function quadrat(P) {
  const g = new THREE.Group(), S = 3.8, R = rng(P.id === 'A' ? 7 : 8);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(S, S), new THREE.MeshStandardMaterial({ map: soilTex('qd:' + P.id, P.id === 'A' ? '#2e2018' : '#a07e56', 5), roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.16; floor.receiveShadow = true; g.add(floor);
  for (const [x, z, w, d] of [[0, -S / 2, S + 0.1, 0.06], [0, S / 2, S + 0.1, 0.06], [-S / 2, 0, 0.06, S], [S / 2, 0, 0.06, S]]) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d), mat(0xe0b860)); b.position.set(x, 0.19, z); g.add(b); }
  const tok = [
    () => ell(0.09, 0.05, 0.06, mat(P.id === 'A' ? 0x8a8780 : 0x55524d)),
    () => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 6, 14, Math.PI * 1.5), glossMat(0x7a4a26)); m.rotation.x = -Math.PI / 2; return m; },
    () => { const t = new THREE.Group(), m = rod(0xb04a22, 0.035, 0.028); orient(m, V3(-0.2, 0, 0), V3(0.2, 0, 0)); t.add(m); for (let i = 0; i < 6; i++) for (const s of [-1, 1]) { const l = rod(0xe0b050, 0.01, 0.008); orient(l, V3(-0.15 + i * 0.06, 0, 0), V3(-0.17 + i * 0.06, 0, 0.09 * s)); t.add(l); } return t; },
    () => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.032, 6, 16, Math.PI * 0.9), glossMat(0xb3655a)); m.rotation.x = -Math.PI / 2; return m; },
  ];
  P.count.forEach((n, k) => { for (let i = 0; i < n; i++) { const t = tok[k](), h = new THREE.Group(); h.add(t); h.position.set((R() - 0.5) * (S - 0.5), 0.2, (R() - 0.5) * (S - 0.5)); h.rotation.y = R() * Math.PI * 2; h.scale.setScalar(2.1); g.add(h); } });
  const tag = label('30 cm × 30 cm 틀 — 낙엽을 걷어 낸 자리', { size: 0.26 }); tag.position.set(0, 0.7, -S / 2 - 0.1); g.add(tag);
  g.traverse((o) => { o.userData.noFrame = true; }); return g;
}

function habitat(place) {
  const P = PLACES[place], g = new THREE.Group(), R = rng(place === 'A' ? 3 : 4), d = new THREE.Object3D(), col = new THREE.Color();
  const st = soilTex('litter-soil:' + place, hex(P.soil), place === 'A' ? 2 : 6); st.repeat.set(5, 5);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(5.2, 48), new THREE.MeshStandardMaterial({ map: st, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; g.add(ground);
  const away = (rMin = 2.35) => { let x, z; do { const a = R() * Math.PI * 2, r = rMin + Math.sqrt(R()) * (5 - rMin); x = Math.cos(a) * r; z = Math.sin(a) * r; } while (Math.hypot(x, z) < DISH_R + 0.25); return [x, z]; };
  if (P.litter) {
    // 낙엽층: 참나무 잎 모양(물결 테두리) 판을 여러 겹 — 위로 갈수록 덜 썩은 밝은 잎
    const sh = new THREE.Shape(); for (let i = 0; i <= 24; i++) { const t = i / 24, a = t * Math.PI * 2, r = 0.22 + 0.04 * Math.sin(a * 5); const x = Math.cos(a) * r * 0.55, y = Math.sin(a) * r; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
    const N = 620, lv = new THREE.InstancedMesh(new THREE.ShapeGeometry(sh), mat(0xffffff, { side: THREE.DoubleSide, roughness: 0.95 }), N);
    for (let i = 0; i < N; i++) { const [x, z] = away(2.3), h = 0.01 + (i / N) * 0.12; d.position.set(x, h, z); d.rotation.set(-Math.PI / 2 + (R() - 0.5) * 0.5, (R() - 0.5) * 0.4, R() * Math.PI * 2); d.scale.setScalar(0.8 + R() * 0.7); d.updateMatrix(); lv.setMatrixAt(i, d.matrix); lv.setColorAt(i, col.setHSL(0.06 + R() * 0.06, 0.45 + R() * 0.25, 0.18 + (i / N) * 0.22 + R() * 0.08)); }
    lv.receiveShadow = true; lv.castShadow = true; g.add(lv);
    const acorn = new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 10, 8), glossMat(0x8a5a2a), 14); for (let i = 0; i < 14; i++) { const [x, z] = away(); d.position.set(x, 0.14, z); d.rotation.set(0, 0, 0); d.scale.set(1, 1.3, 1); d.updateMatrix(); acorn.setMatrixAt(i, d.matrix); } g.add(acorn);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 6, 12), mat(0x4a3628)); trunk.position.set(3.9, 3, -3.2); trunk.castShadow = true; g.add(trunk);
    const canopy = new THREE.Mesh(new THREE.CircleGeometry(4.8, 32), mat(0x2f4a2a, { side: THREE.DoubleSide })); canopy.material.colorWrite = false; canopy.material.depthWrite = false; canopy.rotation.x = -Math.PI / 2; canopy.position.set(0.8, 5.8, -0.6); canopy.castShadow = true; g.add(canopy);
  } else {
    // 맨땅: 다져진 흙, 발자국, 작은 돌, 가장자리에만 풀 몇 포기
    const fp = new THREE.InstancedMesh(new THREE.CircleGeometry(0.2, 16), mat(0x7a5e40, { roughness: 1 }), 16); for (let i = 0; i < 16; i++) { const a = i * 0.4 - 3, x = -4 + i * 0.5, z = 3.4 + Math.sin(a) * 0.4 + (i % 2 ? 0.3 : -0.3); d.position.set(x, 0.006, z); d.rotation.set(-Math.PI / 2, 0, 0.3); d.scale.set(0.7, 1.4, 1); d.updateMatrix(); fp.setMatrixAt(i, d.matrix); } g.add(fp);
    const pb = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 10, 8), mat(0x9e968a, { roughness: 0.9 }), 40); for (let i = 0; i < 40; i++) { const [x, z] = away(); d.position.set(x, 0.03, z); d.rotation.set(0, R() * 3, 0); d.scale.set(0.5 + R() * 1.2, 0.35 + R() * 0.4, 0.5 + R()); d.updateMatrix(); pb.setMatrixAt(i, d.matrix); pb.setColorAt(i, col.setHSL(0.09, 0.08, 0.45 + R() * 0.3)); } pb.castShadow = true; g.add(pb);
    const blade = new THREE.PlaneGeometry(0.05, 1, 1, 2); blade.translate(0, 0.5, 0); const gr = new THREE.InstancedMesh(blade, mat(0x8fb35a, { side: THREE.DoubleSide }), 160); for (let i = 0; i < 160; i++) { const a = R() * Math.PI * 2, r = 4.4 + R() * 0.7; d.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); d.rotation.set((R() - 0.5) * 0.4, R() * 3, 0); d.scale.set(1, 0.2 + R() * 0.25, 1); d.updateMatrix(); gr.setMatrixAt(i, d.matrix); } g.add(gr);
    const sun = label('☀', { size: 0.9, bg: 'rgba(255,230,140,0.95)', color: '#b8860b' }); sun.position.set(3.2, 5, -2); g.add(sun);
  }
  const tag = label(`${P.name} · ${P.where}`, { size: 0.3 }); tag.position.set(-DISH_R - 0.3, TOP + 0.9, 0.2); g.add(tag); g.userData.tag = tag;
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(DISH_R, DISH_R * 0.92, DISH_H, 48), glossMat(0xfafafa, { roughness: 0.25 })); dish.position.y = DISH_H / 2; dish.receiveShadow = true; dish.castShadow = true; g.add(dish);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(DISH_R, 0.05, 10, 64), glossMat(0xf0f0f0)); rim.rotation.x = Math.PI / 2; rim.position.y = DISH_H; g.add(rim);
  g.traverse((o) => { o.userData.noFrame = true; });
  const at = (m, x, y, z) => { m.position.set(x, y, z); m.lookAt(x * 0.5, y, 8); m.scale.setScalar(0.8); m.visible = false; g.add(m); return m; };
  const quad = quadrat(P); quad.visible = false; g.add(quad);
  g.userData = { P, quad, tag, dish: [dish, rim], hand: at(handCard(P.wet), 1.0, 0.95, 1.6), profile: at(profileCard(P), 1.0, 0.95, 1.6), thermo: at(thermoCard(P), 1.0, 0.95, 1.6), stick: at(stickCard(P), 1.0, 0.95, 1.6) };
  return g;
}

// 무대에 동물 하나를 올린다. 돌려주는 것: { spec, run(id), setView(id), toggle(id, on), setPlace(id), actions() }
export function mountSpecimen(stage, make) {
  stage.clear();
  const spec = make(), ani = spec.build(), base = new THREE.Group(); stage.root.add(base);
  let hab = null, placeId = spec.place;
  const setPlace = (id) => { if (hab) { base.remove(hab); hab.traverse((o) => { o.geometry?.dispose?.(); }); } placeId = id; hab = habitat(id); base.add(hab); stage._needFit = true; };
  setPlace(placeId);
  ani.position.y = TOP; base.add(ani);
  const U = ani.userData, rl = ruler(spec.cm / U.L, Math.ceil(spec.cm * 1.3)); rl.position.set(0, TOP + 0.02, 0.95); rl.visible = false; base.add(rl);
  const show = (key) => (t) => { const h = hab.userData; for (const k of ['hand', 'profile', 'thermo', 'stick']) { h[k].visible = k === key && t > 0.08 && t < 0.98; if (h[k].visible) h[k].quaternion.copy(stage.camera.quaternion); } };
  const actions = {
    poke: { name: '👆 살짝 건드려 보기', dur: 3.6, note: spec.notes.poke, step: (t) => U.poke(t) },
    flip: { name: '🔄 뒤집어 보기', dur: 4, note: spec.notes.flip, step: (t) => { const o = t < 0.25 ? ease.io(t / 0.25) : t > 0.75 ? 1 - ease.io((t - 0.75) / 0.25) : 1; U.body.rotation.x = Math.PI * o; U.body.position.y = U.topY * 1.4 * Math.sin(Math.PI * o) + U.topY * o; } },
    find: { name: '🔎 낙엽 걷고 찾기(30 cm 틀)', dur: 7, env: true, note: '같은 넓이(30 cm × 30 cm) 틀 안의 낙엽을 걷고 찾은 동물을 종류별로 세어 표에 적어요. 두 장소에서 같은 방법으로 세야 비교가 돼요.', step: (t) => { const on = t > 0.05 && t < 0.99, h = hab.userData; if (on === h.quad.visible) return; h.quad.visible = on; ani.visible = !on; h.tag.visible = !on; h.dish.forEach((m) => { m.visible = !on; });
      // 세는 동안은 틀 전체가 보이게 위에서 내려다본다(틀은 맞춤 계산에서 빠지는 물체라 frame으로 넓이를 준다)
      if (on) stage.setView({ theta: 0.1, phi: 0.45, dist: 8, target: [0, 0.2, 0], frame: [[-2.1, 0, -2.3], [2.1, 0.4, 2.1]] }); else api.setView(view); } },
    profile: { name: '📏 흙 단면 보기', dur: 6, env: true, note: '모종삽으로 흙을 곧게 떠서 옆면을 봐요. 낙엽층과 그 아래 검은 흙(부엽토)의 두께를 자로 재어 적어요.', step: show('profile') },
    soil: { name: '✋ 흙 쥐어 보기', dur: 5, env: true, note: '흙을 3초 쥐었다 폈을 때 손에 남은 흙을 보세요. 많이 남고 뭉치면 물기가 많은 거예요.', step: show('hand') },
    temp: { name: '🌡 흙 온도 재기', dur: 6, env: true, note: '온도계를 흙 속 5 cm에 꽂고 1분 기다렸다 눈금을 읽어요. 두 장소를 같은 시각, 같은 깊이로 재요.', step: show('thermo') },
    stick: { name: '🪵 꼬챙이 꽂기(단단함)', dur: 6, env: true, note: '같은 꼬챙이를 같은 힘으로 눌러 들어간 깊이를 읽어요. 깊이 들어갈수록 흙이 부드러운 거예요.', step: show('stick') },
  };
  let running = null, view = 'angle';
  const finish = () => { if (!running) return; running.a.step(1); running = null; };
  stage.update = (dt) => { if (!running) return; running.t += dt / running.a.dur; running.a.step(clamp01(running.t)); if (running.t >= 1) finish(); };
  const api = {
    spec, places: PLACE_LIST, place: () => placeId,
    actions: () => Object.entries(actions).map(([id, a]) => ({ id, name: a.name, env: !!a.env })),
    run(id) { const a = actions[id]; if (!a) return null; finish(); running = { a, t: 0 }; return a.note; },
    setView(id) { view = id; const v = VIEWS[id] || VIEWS.angle; stage.setView({ theta: v.theta, phi: v.phi, dist: 8, target: [0, 0.5, 0] }); },
    toggle(what, on) { if (what === 'ruler') rl.visible = on; if (what === 'seg') U.segMats.forEach((m, i) => m.color.setHex(on && i % 2 ? 0xf0c040 : m.userData.c0)); stage._needFit = true; },
    toolNote: (what) => what === 'seg' ? '한 마디씩 번갈아 칠했어요. 칠한 마디 하나에 다리가 몇 쌍 붙어 있는지 세어 보세요.' : '',
    setPlace, dispose() { finish(); },
  };
  api.setView('angle');
  return api;
}
export const _specs = SPECS;
