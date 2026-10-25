// 자연관찰 연습 표본 — 「비슷한 잎, 재서 구분하기 → 검색표」(중등). 원장이 쓴 영재교육자료 『비슷한 잎사귀들』의 흐름을 따른다:
// 눈으로 본 차이(정성) → 숫자로 나타낼 형질 고르기(가설) → 여러 장 재기(정량) → 길이 하나로는 안 되는 까닭(같은 종도 크기가 제각각 = 연속 변이) → 비율·평균으로 바꾸기 → 검색표.
// 표본 4종: ①② 깃꼴겹잎(작은잎 수·작은잎 길이÷폭이 다름), ③④ 톱니 있는 홑잎(길이는 겹치지만 길이÷폭·가장 넓은 자리·톱니 수가 다름).
// 모눈 판(1 cm 눈금) 위에 종마다 잎 3~5장을 놓는다. 「다음 잎 재기」를 누르면 그 잎에 길이·최대 폭·잎밑→최대 폭 재기 선이 그려지고 값이 나온다.
// 값은 그림에서 잰 그대로다 — 잎 판의 크기를 그 값으로 만들었기 때문(윤곽의 가장 넓은 자리와 톱니 수도 같다). 비율은 아이가 직접 계산한다.
import { THREE, mat, label, relabel, clamp01, ease } from './_kit.js';
import { leafTextures, leafMesh, shapedOutline, widest, canvasTex, rng } from './_organic.js';

const CM = 5;   // 1 단위 = 5 cm
const BOARD = { w: 40, d: 30 };   // cm
// 잎 질감: 종마다 윤곽(가장 넓은 자리 m·통통함 p·톱니)과 잎맥 쌍 수. 같은 종이라도 톱니·곁맥 수가 조금씩 다른 두 벌.
const KINDS = {
  robinia: [{ m: 0.5, p: 0.55, veins: 5 }],
  wisteria: [{ m: 0.64, p: 1.05, veins: 6 }],
  cherry: [{ m: 0.38, p: 0.75, teeth: 32, depth: 0.05, double: true, veins: 8 }, { m: 0.36, p: 0.78, teeth: 38, depth: 0.05, double: true, veins: 9 }],
  zelkova: [{ m: 0.6, p: 1.0, teeth: 12, depth: 0.11, veins: 11 }, { m: 0.62, p: 1.0, teeth: 15, depth: 0.1, veins: 13 }],
};
const COLORS = { robinia: ['#4c9a3e', '#8cc070', '#b1cf9c'], wisteria: ['#3f8d3c', '#86bb69', '#a9cb95'], cherry: ['#2f7a33', '#6eaa58', '#9fbf8a'], zelkova: ['#3d8a3a', '#7db464', '#a3c48f'] };
const texFor = (kind, v) => {
  const k = KINDS[kind][v], [top, edge, under] = COLORS[kind];
  const pts = shapedOutline({ m: k.m, p: k.p, teeth: k.teeth || 0, depth: k.depth, double: k.double });
  const tex = leafTextures(`lk:${kind}:${v}`, { outline: pts, veins: 'pinnate', top, topEdge: edge, under, veinN: k.veins, seed: 20 + v, glossSpots: kind === 'cherry' });
  return { tex, pts, teeth: pts.teeth, veins: k.veins, w: widest(pts) };
};
// 재기 선(잎 좌표: 잎밑 = 원점, 잎끝 = +y, 위쪽 = +z). 길이(빨강)·최대 폭(파랑)·잎밑→최대 폭(초록). 이름표를 달면 작은 잎을 가려서 색으로만 구분하고 값은 안내 문구에 쓴다.
const bar = (x0, y0, x1, y1, color) => {
  const g = new THREE.Group(), len = Math.hypot(x1 - x0, y1 - y0), m = mat(color, { roughness: 0.5 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.055, len, 0.03), m); b.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); b.rotation.z = Math.atan2(-(x1 - x0), y1 - y0); g.add(b);
  for (const [x, y] of [[x0, y0], [x1, y1]]) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.03), m); t.position.set(x, y, 0); t.rotation.z = b.rotation.z; g.add(t); }
  return g;
};
function measureGroup(L, W, B, halfW) {
  const g = new THREE.Group(); g.position.z = 0.06; g.visible = false;
  const xl = -halfW - 0.2, xr = halfW + 0.2, yb = B;
  g.add(bar(xl, 0, xl, L, 0xc0392b), bar(-halfW, yb, halfW, yb, 0x2c6fb5), bar(xr, 0, xr, yb, 0x2e8b57));
  return g;
}
// 홑잎 한 장: L·ratio(길이÷폭)로 잎 판 크기를 정한다. 판의 폭 = 최대 폭 ÷ (윤곽 최대 반폭 × 0.98)
function simpleLeaf(kind, v, Lcm, ratio) {
  const T = texFor(kind, v), L = Lcm / CM, W = L / ratio, meshW = W / (T.w[0] * 0.98), B = L * (1 - T.w[1]);
  const leaf = leafMesh(T.tex, { w: meshW, h: L, curl: 0.05, droop: 0, wave: 0, gloss: kind === 'cherry' ? 0.6 : 0.35, segs: [10, 16] });
  const g = new THREE.Group(); g.add(leaf);
  const pet = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.28, 8), mat(0x6c7a3a)); pet.position.set(0, -0.14, 0.01); g.add(pet);   // 잎자루
  const mg = measureGroup(L, W, B, W / 2); g.add(mg);
  return { g, data: { L: Lcm, W: W * CM, B: B * CM, teeth: T.teeth, veins: T.veins, compound: false }, mg };
}
// 깃꼴겹잎: 잎줄기 + 작은잎 마주 n쌍 + 끝 작은잎. 가운데 쌍의 작은잎이 가장 크다(재는 대상).
function compoundLeaf(kind, count, Lcm, ratio) {
  const T = texFor(kind, 0), pairs = (count - 1) / 2, L = Lcm / CM, gap = L * (kind === 'wisteria' ? 0.42 : 0.6), rachis = gap * (pairs + 0.4) + L * 0.25;
  const g = new THREE.Group();
  const r = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.026, rachis + 0.35, 8), mat(0x667a36)); r.position.set(0, (rachis + 0.35) / 2 - 0.35, 0.01); g.add(r);
  let measured = null; const mid = Math.ceil(pairs / 2);
  const leaflet = (scale) => { const l = L * scale, w = l / ratio; return { mesh: leafMesh(T.tex, { w: w / (T.w[0] * 0.98), h: l, curl: 0.05, droop: 0, gloss: 0.3, segs: [8, 12] }), l, w }; };
  for (let j = 1; j <= pairs; j++) {
    const s = j === mid ? 1 : 0.78 + 0.18 * Math.sin(Math.PI * j / (pairs + 1));
    for (const side of [-1, 1]) {
      const { mesh, l, w } = leaflet(s), hold = new THREE.Group(); hold.position.set(0, j * gap, 0); hold.rotation.z = side * 1.25; hold.add(mesh); g.add(hold);
      if (j === mid && side === 1) { const mg = measureGroup(l, w, l * (1 - T.w[1]), w / 2); hold.add(mg); measured = { mg, l, w, b: l * (1 - T.w[1]) }; }
    }
  }
  const tip = leaflet(0.92); tip.mesh.position.y = rachis; g.add(tip.mesh);
  return { g, data: { L: measured.l * CM, W: measured.w * CM, B: measured.b * CM, count, teeth: 0, veins: T.veins, compound: true, length: (rachis + 0.35 + tip.l) * CM }, mg: measured.mg };
}
// 표본: 잎 자료(재기 값의 바탕). 길이는 같은 종 안에서도 넓게 퍼지고(어린 잎~다 자란 잎), 길이÷폭은 종마다 모여 있다.
const SPECS = [
  { id: 'lk-robinia', no: '①', name: '아까시나무형 — 깃꼴겹잎 · 둥근 작은잎', hint: '작은 잎 여러 장이 한 잎줄기에 — 작은잎이 둥근 편', kind: 'robinia', compound: true,
    leaves: [{ count: 13, L: 3.1, r: 1.68 }, { count: 15, L: 3.6, r: 1.75 }, { count: 11, L: 2.7, r: 1.62 }],
    think: ['잎 한 장은 어디서 어디까지인가요? 작은잎 하나가 잎 한 장일까요?', '작은잎은 몇 장인가요? 세 잎이 모두 같나요?', '가운데 작은잎과 끝 작은잎의 크기를 비교해 보세요.'] },
  { id: 'lk-wisteria', no: '②', name: '등나무형 — 깃꼴겹잎 · 길고 뾰족한 작은잎', hint: '작은 잎 여러 장이 한 잎줄기에 — 작은잎이 길쭉한 편', kind: 'wisteria', compound: true,
    leaves: [{ count: 15, L: 4.8, r: 2.6 }, { count: 17, L: 5.4, r: 2.75 }, { count: 13, L: 4.3, r: 2.5 }],
    think: ['작은잎 수만으로 ①과 나눌 수 있나요? ①과 겹치는 수가 있나요?', '작은잎이 「길쭉하다」를 숫자로 말하려면 무엇을 재야 할까요?', '작은잎의 가장 넓은 자리는 가운데인가요, 잎밑 쪽인가요?'] },
  { id: 'lk-cherry', no: '③', name: '왕벚나무형 — 홑잎 · 잔 겹톱니 · 잎끝 쪽이 넓음', hint: '잎 한 장 — 가장자리에 톱니', kind: 'cherry',
    leaves: [{ L: 5.6, r: 1.72, v: 0 }, { L: 7.3, r: 1.8, v: 1 }, { L: 8.8, r: 1.76, v: 0 }, { L: 10.2, r: 1.68, v: 1 }, { L: 11.9, r: 1.78, v: 0 }],
    think: ['가장 큰 잎과 가장 작은 잎은 길이가 몇 배 차이 나나요? 같은 나무의 잎인데도요.', '가장 넓은 자리는 잎끝 쪽인가요, 잎밑 쪽인가요?', '톱니 하나를 확대해 보세요. 큰 톱니에 작은 톱니가 또 붙어 있나요?'] },
  { id: 'lk-zelkova', no: '④', name: '느티나무형 — 홑잎 · 굵은 톱니 · 잎밑 쪽이 넓음', hint: '잎 한 장 — 가장자리에 톱니', kind: 'zelkova',
    leaves: [{ L: 3.8, r: 2.28, v: 0 }, { L: 5.1, r: 2.2, v: 1 }, { L: 6.4, r: 2.35, v: 0 }, { L: 7.6, r: 2.25, v: 1 }, { L: 8.9, r: 2.31, v: 0 }],
    think: ['③과 길이가 비슷한 잎이 있나요? 그런데도 달라 보이는 까닭은 무엇일까요?', '곁맥은 몇 쌍인가요? ③과 비교해 보세요.', '길이÷폭을 계산하면 ③의 값과 겹치나요?'] },
];
export const SPECIMENS = SPECS.map((s) => () => s);
export const VIEWS = { angle: { theta: 0, phi: 0.72, name: '비스듬히' }, top: { theta: 0, phi: 0.12, name: '위에서 본 모습(재기 좋음)' } };
export const TOOLS = [{ id: 'ruler', name: '📏 자 대기' }, { id: 'all', name: '📐 재기 선 모두' }];

// 모눈 판(1 cm 가는 선 · 5 cm 굵은 선 · 가장자리 숫자)
function board() {
  const px = 40, tex = canvasTex('lk:board', BOARD.w * px, BOARD.d * px, (c, w, h) => {
    c.fillStyle = '#fbfbf5'; c.fillRect(0, 0, w, h);
    for (let x = 0; x <= BOARD.w; x++) { c.strokeStyle = x % 5 ? 'rgba(60,140,100,0.5)' : 'rgba(40,110,75,0.9)'; c.lineWidth = x % 5 ? 2 : 4; c.beginPath(); c.moveTo(x * px, 0); c.lineTo(x * px, h); c.stroke(); }
    for (let y = 0; y <= BOARD.d; y++) { c.strokeStyle = y % 5 ? 'rgba(60,140,100,0.5)' : 'rgba(40,110,75,0.9)'; c.lineWidth = y % 5 ? 2 : 4; c.beginPath(); c.moveTo(0, y * px); c.lineTo(w, y * px); c.stroke(); }
    c.fillStyle = 'rgba(40,100,70,0.75)'; c.font = '700 18px Pretendard, sans-serif'; c.textAlign = 'left';
    for (let x = 5; x < BOARD.w; x += 5) c.fillText(String(x), x * px + 3, h - 6);
    c.fillText('1칸 = 1 cm', 8, 22);
  });
  const m = new THREE.Mesh(new THREE.BoxGeometry(BOARD.w / CM, 0.04, BOARD.d / CM), [mat(0xe9e6da), mat(0xe9e6da), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 }), mat(0xe9e6da), mat(0xe9e6da), mat(0xe9e6da)]);
  m.position.y = -0.02; m.receiveShadow = true; return m;
}
function ruler(cm) {
  const len = cm / CM, cv = document.createElement('canvas'); cv.width = 1200; cv.height = 90; const c = cv.getContext('2d');
  c.fillStyle = '#f3e7b8'; c.fillRect(0, 0, 1200, 90); c.fillStyle = '#1f2a37'; c.font = '700 22px Pretendard, sans-serif'; c.textAlign = 'center';
  for (let i = 0; i <= cm * 10; i++) { const x = 8 + (i / (cm * 10)) * 1184, h = i % 10 === 0 ? 40 : i % 5 === 0 ? 26 : 14; c.fillRect(x - 1, 0, 2, h); if (i % 10 === 0 && (i / 10) % 5 === 0) c.fillText(String(i / 10), x, 76); }
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.03, len * 90 / 1200), [mat(0xe6d79c), mat(0xe6d79c), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }), mat(0xe6d79c), mat(0xe6d79c), mat(0xe6d79c)]);
  m.userData.noFrame = true; return m;
}

export function mountSpecimen(stage, make) {
  stage.clear();
  const spec = make(), base = new THREE.Group(); stage.root.add(base);
  const bd = board(); bd.userData.noFrame = true; base.add(bd);
  const n = spec.leaves.length, span = spec.compound ? 5.4 : 6.4, leaves = [];
  spec.leaves.forEach((d, i) => {
    const made = spec.compound ? compoundLeaf(spec.kind, d.count, d.L, d.r) : simpleLeaf(spec.kind, d.v || 0, d.L, d.r);
    const hold = new THREE.Group(); hold.rotation.x = -Math.PI / 2; hold.position.set(-span / 2 + (span / (n - 1)) * i, 0.035, spec.compound ? 2.45 : 1.3); hold.add(made.g); base.add(hold);
    hold.rotation.z = (rng(7 + i)() - 0.5) * 0.08;   // 손으로 놓아 조금씩 비뚤다
    const tag = label(`잎${i + 1}`, { size: 0.26 }); tag.position.set(hold.position.x, 0.12, hold.position.z + 0.5); base.add(tag);
    leaves.push({ ...made, hold, tag });
  });
  const rl = ruler(30); rl.position.set(0, 0.03, BOARD.d / CM / 2 + 0.2); rl.visible = false; base.add(rl);
  let cur = -1, showAll = false, running = null;
  const paint = () => leaves.forEach((lf, i) => { lf.mg.visible = showAll || i === cur; relabel(lf.tag, i === cur ? `▶ 잎${i + 1}` : `잎${i + 1}`, i === cur ? { color: '#c0392b' } : {}); });
  const fmt = (x) => x.toFixed(1);
  const actions = {
    measure: { name: '📐 다음 잎 재기', run() { cur = (cur + 1) % n; paint(); const d = leaves[cur].data; return d.compound
      ? `잎${cur + 1}(겹잎)의 가운데 작은잎 — 빨강 길이 ${fmt(d.L)} cm · 파랑 최대 폭 ${fmt(d.W)} cm · 초록 잎밑→최대 폭 ${fmt(d.B)} cm. 작은잎 수는 「톱니·잎맥·작은잎 세기」로 세요. 비율(길이÷폭)은 직접 계산해요.`
      : `잎${cur + 1} — 빨강 길이 ${fmt(d.L)} cm · 파랑 최대 폭 ${fmt(d.W)} cm · 초록 잎밑→최대 폭 ${fmt(d.B)} cm. 표에 적고, 비율(길이÷폭, 잎밑→최대 폭÷길이)은 직접 계산해요.`; } },
    count: { name: '🔢 톱니·잎맥·작은잎 세기', run() { if (cur < 0) { cur = 0; paint(); } const d = leaves[cur].data; return d.compound
      ? `잎${cur + 1}: 작은잎 ${d.count}장(끝 작은잎 포함) · 가장자리 밋밋함(톱니 0) · 잎줄기 전체 길이 약 ${Math.round(d.length)} cm.`
      : `잎${cur + 1}: 톱니(한쪽, 잎밑에서 잎끝까지) ${d.teeth}개 · 곁맥 ${d.veins}쌍. 큰 톱니에 작은 톱니가 붙어 있으면 큰 것만 세요.`; } },
    flip: { name: '🔄 잎 뒤집어 보기', dur: 3.6, run() { if (cur < 0) { cur = 0; paint(); } running = { t: 0, lf: leaves[cur] }; return '뒷면의 색과 잎맥이 앞면과 어떻게 다른가요? 뒷면에서 잎맥이 더 잘 보이면 곁맥을 세기 쉬워요.'; } },
  };
  stage.update = (dt) => {
    if (!running) return; running.t += dt / 3.6; const t = clamp01(running.t), o = t < 0.25 ? ease.io(t / 0.25) : t > 0.75 ? 1 - ease.io((t - 0.75) / 0.25) : 1;
    running.lf.hold.rotation.x = -Math.PI / 2 + Math.PI * o; running.lf.hold.position.y = 0.035 + Math.sin(Math.PI * o) * 0.9; if (running.t >= 1) { running.lf.hold.rotation.x = -Math.PI / 2; running.lf.hold.position.y = 0.035; running = null; }
  };
  const api = {
    spec,
    actions: () => Object.entries(actions).map(([id, a]) => ({ id, name: a.name })),
    run(id) { const a = actions[id]; return a ? a.run() : null; },
    setView(id) { const v = VIEWS[id] || VIEWS.angle; stage.setView({ theta: v.theta, phi: v.phi, dist: 9, target: [0, 0, 0.4] }); },
    toggle(what, on) { if (what === 'ruler') rl.visible = on; if (what === 'all') { showAll = on; paint(); } stage._needFit = true; },
    readings: () => leaves.map((l) => l.data),   // 검사용: 잎마다 잰 값
  };
  api.setView('angle');
  return api;
}
