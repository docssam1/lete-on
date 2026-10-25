// 자연관찰 연습 표본 — 잎차례와 잎 모양 6종(자연관찰캠프 유형: 잎·잎차례 그림과 설명 → 분류 나무 → 전형적인 잎 고르기 → 잎 형태·잎차례가 살아가는 데 유리한 점).
// 어긋나기·마주나기·돌려나기·뭉쳐나기 + 밋밋한 잎·톱니 잎·손바닥 모양 갈라진 잎·겹잎. 줄기 토막을 흰 꽂이에 세워 관찰한다.
// 잎은 _organic.js의 「질감 잎」 — 캔버스에 그린 잎맥·톱니·색 변화를 알파로 오려 낸 뒤 잎몸을 휘게 한 판. 앞면·뒷면 색이 다르다.
// 손 확인: 잎 뒤집어 보기(뒷면 색·잎맥), 햇빛 비추기(위에서 본 겹침 → 그림자), 마디 표시(한 마디에 몇 장), 자(마디 사이 길이).
import { THREE, mat, glossMat, label, clamp01, ease } from './_kit.js';
import { leafTextures, leafMesh, stemTex, rng } from './_organic.js';

const STEM = 0x6b7d3a;
const tube = (pts, r, color, seg = 10) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), seg, r, 7), mat(color, { roughness: 0.6 })); m.castShadow = true; return m; };
// 잎 질감 모음(처음 쓸 때 한 번 그린다)
const TEX = {
  entire: () => leafTextures('lf:entire', { outline: 'elliptic', veins: 'pinnate', top: '#2f7a30', topEdge: '#6fae5c', under: '#9bbf88', veinN: 8, seed: 3 }),
  serrate: () => leafTextures('lf:serrate', { outline: 'serrate', veins: 'pinnate', top: '#3b8a3a', topEdge: '#86bf6a', under: '#a4c594', veinN: 7, seed: 5 }),
  lance: () => leafTextures('lf:lance', { outline: 'lance', veins: 'pinnate', top: '#4a9a3f', topEdge: '#8fc26e', under: '#a9cc96', veinN: 0, seed: 7, glossSpots: false }),
  lobed: () => leafTextures('lf:lobed', { outline: 'lobed', veins: 'pinnate', top: '#3e8f38', topEdge: '#75b05e', under: '#9fc38c', veinN: 6, seed: 8 }),
  palmate: () => leafTextures('lf:palmate', { outline: 'palmate', veins: 'palmate', top: '#3a8a39', topEdge: '#8bbf6f', under: '#a6c796', seed: 9 }),
  leaflet: () => leafTextures('lf:leaflet', { outline: 'elliptic', veins: 'pinnate', top: '#3e9340', topEdge: '#80bb68', under: '#a8cc98', veinN: 4, seed: 10, w: 256, h: 384 }),
};
// 잎 한 장(잎자루 끝 = 원점, +y로 자람)
const blade = (kind, w, h, opts = {}) => leafMesh(TEX[kind](), { w, h, curl: 0.16, droop: 0.22, wave: kind === 'serrate' ? 0.6 : 0, gloss: 0.55, ...opts });
// 겹잎: 잎줄기(rachis) 양쪽으로 작은 잎 + 끝 잎
function compoundLeaf(len, pairs = 5) {
  const g = new THREE.Group(); g.add(tube([[0, 0, 0], [0.02, len * 0.5, 0.04], [0, len, 0.06]], 0.014, 0x4f6b2e, 6));
  for (let i = 1; i <= pairs; i++) for (const s of [-1, 1]) { const lf = blade('leaflet', 0.24, 0.36, { curl: 0.12, droop: 0.15, segs: [6, 10] }); lf.position.set(0, (i / (pairs + 0.6)) * len, 0); lf.rotation.set(0.15, 0, s * 1.2); g.add(lf); }
  const tip = blade('leaflet', 0.24, 0.36, { curl: 0.12, droop: 0.15, segs: [6, 10] }); tip.position.y = len; g.add(tip);
  g.userData.isLeaf = true; return g;
}
// 잎을 줄기에 붙인다: 마디 y, 방향 a(y축 회전), 잎자루 길이 p, 처지는 각 droop, 줄기 반지름 r. 잎자루는 살짝 휜 관, 겨드랑이에는 작은 눈(bud).
function attach(stem, lf, y, a, p = 0.25, droop = 0.9, r = 0.05, bud = true) {
  const piv = new THREE.Group(); piv.position.set(0, y, 0); piv.rotation.y = a; stem.add(piv);
  const end = [r + p * Math.cos(0.3), p * Math.sin(0.3) + p * 0.08, 0];
  if (p > 0.02) piv.add(tube([[r * 0.6, 0, 0], [r + p * 0.5 * Math.cos(0.3), p * 0.5 * Math.sin(0.3) + p * 0.12, 0], end], 0.016, 0x5f7334, 8));
  if (bud) { const b = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.09, 8), mat(0x7f9a3c)); b.position.set(r * 0.9, 0.06, 0); b.rotation.z = -0.35; piv.add(b); }   // 겨드랑눈
  const hold = new THREE.Group(); hold.position.set(...end); hold.rotation.set(0, 0, -Math.PI / 2 + droop); hold.add(lf); piv.add(hold);
  lf.userData.hold = hold; lf.userData.rest = hold.rotation.clone(); return lf;
}
const pot = () => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.32, 0.5, 24), glossMat(0xfafafa, { roughness: 0.3 })); p.position.y = 0.25; p.castShadow = true; p.receiveShadow = true; g.add(p); const w = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.04, 24), new THREE.MeshPhysicalMaterial({ color: 0x9fc5d8, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.8 })); w.position.y = 0.49; g.add(w); g.traverse((o) => { o.userData.noFrame = true; }); return g; };
// 줄기: 질감 + 마디마다 살짝 부푼 띠
function makeStem(H, r = 0.05, color = STEM, nodesAt = []) {
  const g = new THREE.Group(), tex = stemTex('stem:' + color.toString(16), '#' + color.toString(16).padStart(6, '0')); tex.repeat.set(2, Math.max(1, Math.round(H * 1.5)));
  const s = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.78, r, H, 14), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75 })); s.position.y = H / 2; s.castShadow = true; g.add(s);
  for (const y of nodesAt) { const k = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.12, r * 1.12, r * 1.1, 14), mat(color, { roughness: 0.7 })); k.position.y = y; g.add(k); }
  g.userData.nodes = []; g.userData.H = H; return g;
}
const nodeRing = (stem, y, n) => { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 8, 32), mat(0xc0392b)); ring.rotation.x = Math.PI / 2; ring.position.y = y; ring.visible = false; stem.add(ring); const t = label(`마디 ${n}`, { size: 0.22, color: '#c0392b' }); t.position.set(-0.55, y, 0); t.visible = false; stem.add(t); stem.userData.nodes.push({ ring, t, y }); };

// ── 표본 6종 ──
const SPECS = [
  { id: 'alt-entire', no: '①', name: '감나무형 — 어긋나기 · 타원형 · 밋밋한 가장자리', hint: '잎이 한 마디에 한 장씩, 번갈아', cm: 24,
    build() { const ys = Array.from({ length: 6 }, (_, i) => 0.35 + i * 0.48), s = makeStem(3, 0.05, STEM, ys), leaves = []; ys.forEach((y, i) => { leaves.push(attach(s, blade('entire', 0.72, 1.0, { gloss: 0.9, curl: 0.2, droop: 0.25 }), y, i * (Math.PI * 137.5 / 180), 0.22, 0.95)); nodeRing(s, y, i + 1); }); return { group: s, leaves }; },
    think: ['한 마디에 잎이 몇 장 붙어 있나요? 위아래 잎은 같은 방향인가요?', '위에서 보면 잎이 서로 가리나요?', '잎 가장자리가 밋밋한 것과 톱니가 있는 것은 무엇이 다를까요?'] },
  { id: 'opp-serrate', no: '②', name: '쥐똥나무형 — 마주나기 · 톱니 가장자리', hint: '한 마디에 두 장이 마주, 위 마디는 십자로', cm: 20,
    build() { const ys = Array.from({ length: 5 }, (_, i) => 0.4 + i * 0.52), s = makeStem(2.8, 0.045, STEM, ys), leaves = []; ys.forEach((y, i) => { const a = (i % 2) * Math.PI / 2; for (const k of [0, Math.PI]) leaves.push(attach(s, blade('serrate', 0.56, 0.8, { curl: 0.14, droop: 0.2 }), y, a + k, 0.12, 1.0, 0.04)); nodeRing(s, y, i + 1); }); return { group: s, leaves }; },
    think: ['한 마디에 잎이 몇 장인가요? 그 위 마디의 잎은 어느 방향인가요?', '가장자리 톱니는 끝으로 갈수록 어떻게 변하나요?', '아래 마디와 위 마디의 잎이 십자로 어긋나면 무엇이 좋을까요?'] },
  { id: 'whorl', no: '③', name: '갈퀴덩굴형 — 돌려나기 · 좁은 잎', hint: '한 마디에 여러 장이 빙 둘러', cm: 18,
    build() { const ys = Array.from({ length: 5 }, (_, i) => 0.35 + i * 0.5), s = makeStem(2.6, 0.03, 0x5f7a33, ys), leaves = []; ys.forEach((y, i) => { const n = 6; for (let k = 0; k < n; k++) leaves.push(attach(s, blade('lance', 0.16, 0.62, { curl: 0.3, droop: 0.12, segs: [6, 12] }), y, (k / n) * Math.PI * 2 + i * 0.3, 0.03, 1.15, 0.03, false)); nodeRing(s, y, i + 1); }); return { group: s, leaves }; },
    think: ['한 마디에 잎이 몇 장인가요? 모두 세어 보세요.', '잎이 좁고 길면 어떤 점이 좋을까요?', '줄기가 가는데 쓰러지지 않을까요? 줄기 단면은 어떤 모양일까요?'] },
  { id: 'rosette', no: '④', name: '민들레형 — 뭉쳐나기(땅 위 방사) · 깊게 갈라진 잎', hint: '줄기가 거의 없고 잎이 땅에서 사방으로', cm: 14,
    build() { const s = makeStem(0.25, 0.08, 0x7a6a4a), leaves = []; const n = 11; for (let k = 0; k < n; k++) { const lf = blade('lobed', 0.56, 1.2 + (k % 3) * 0.15, { curl: 0.22, droop: 0.3, gloss: 0.25 }); leaves.push(attach(s, lf, 0.2, (k / n) * Math.PI * 2 + (k % 2) * 0.15, 0.02, 1.3 - (k % 2) * 0.15, 0.06, false)); } nodeRing(s, 0.2, 1); return { group: s, leaves }; },
    think: ['잎이 땅에 붙어 사방으로 펼쳐지면 어떤 점이 좋을까요(바람·밟힘·햇빛)?', '잎 가장자리가 깊게 갈라진 것을 보고 무엇이 궁금한가요?', '마디가 몇 개로 보이나요? 줄기는 어디 있나요?'] },
  { id: 'alt-palmate', no: '⑤', name: '플라타너스형 — 어긋나기 · 손바닥 모양 갈라진 잎', hint: '잎이 손바닥처럼 갈라짐, 번갈아 남', cm: 30,
    build() { const ys = Array.from({ length: 4 }, (_, i) => 0.5 + i * 0.68), s = makeStem(3, 0.06, 0x7d6f45, ys), leaves = []; ys.forEach((y, i) => { leaves.push(attach(s, blade('palmate', 1.25, 1.25, { curl: 0.1, droop: 0.2, gloss: 0.4, segs: [14, 14] }), y, i * 2.4, 0.42, 0.8, 0.06)); nodeRing(s, y, i + 1); }); return { group: s, leaves }; },
    think: ['갈라진 끝은 몇 개인가요? 잎맥은 어디서 갈라져 나오나요?', '큰 잎 한 장이 작은 잎 여러 장보다 좋은 점과 나쁜 점은?', '잎자루가 길면 바람이 불 때 어떻게 될까요?'] },
  { id: 'alt-compound', no: '⑥', name: '아까시형 — 어긋나기 · 겹잎(작은 잎이 깃 모양)', hint: '작은 잎 여러 장이 한 잎줄기에', cm: 28,
    build() { const ys = Array.from({ length: 4 }, (_, i) => 0.5 + i * 0.62), s = makeStem(2.9, 0.045, 0x6a6040, ys), leaves = []; ys.forEach((y, i) => { leaves.push(attach(s, compoundLeaf(1.4, 5), y, i * 2.2, 0.15, 0.85, 0.045)); nodeRing(s, y, i + 1); }); return { group: s, leaves }; },
    think: ['작은 잎이 한 장씩 떨어지나요, 잎줄기째 떨어지나요? 그걸 보면 잎 한 장이 어디까지인지 알 수 있어요.', '작은 잎 사이의 틈은 무엇에 좋을까요(바람·햇빛)?', '한 마디에 잎줄기가 몇 개 붙어 있나요?'] },
];
export const VIEWS = { angle: { theta: 0.5, phi: 1.1, name: '비스듬히' }, top: { theta: 0.3, phi: 0.25, name: '위에서 본 모습' }, side: { theta: Math.PI / 2, phi: 1.5, name: '옆에서 본 모습' } };
export const TOOLS = [{ id: 'nodes', name: '🔴 마디 표시' }, { id: 'ruler', name: '📏 자 대기' }];

function ruler(cmPerUnit, cm) {
  const len = cm / cmPerUnit, cv = document.createElement('canvas'); cv.width = 1024; cv.height = 96; const c = cv.getContext('2d');
  c.fillStyle = '#f3e7b8'; c.fillRect(0, 0, 1024, 96); c.fillStyle = '#1f2a37'; c.font = '700 26px Pretendard, sans-serif'; c.textAlign = 'center';
  const steps = cm * 10; for (let i = 0; i <= steps; i++) { const x = 8 + (i / steps) * 1008, h = i % 10 === 0 ? 46 : i % 5 === 0 ? 30 : 18; c.fillRect(x - 1, 0, 2, h); if (i % 10 === 0 && (cm <= 15 || (i / 10) % 2 === 0)) c.fillText(String(i / 10), x, 82); }
  c.textAlign = 'right'; c.fillText('cm', 1012, 82);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.02, len * 96 / 1024), [mat(0xe6d79c), mat(0xe6d79c), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }), mat(0xe6d79c), mat(0xe6d79c), mat(0xe6d79c)]);
  m.userData.noFrame = true; return m;
}
export const SPECIMENS = SPECS.map((s) => () => s);
export function mountSpecimen(stage, make) {
  stage.clear();
  const spec = make(), { group, leaves } = spec.build(), base = new THREE.Group(); stage.root.add(base);
  const p = pot(); base.add(p); group.position.y = 0.5; base.add(group);
  const plate = new THREE.Mesh(new THREE.CircleGeometry(2.4, 48), mat(0xffffff, { roughness: 0.95 })); plate.rotation.x = -Math.PI / 2; plate.position.y = 0.005; plate.receiveShadow = true; plate.visible = false; plate.userData.noFrame = true; base.add(plate);
  const sun = label('☀ 햇빛', { size: 0.5, bg: 'rgba(255,230,140,0.95)', color: '#b8860b' }); sun.position.set(-1.2, 4.6, 1.6); sun.visible = false; sun.userData.noFrame = true; base.add(sun);
  const H = group.userData.H, cmPerUnit = spec.cm / H;
  const rl = ruler(cmPerUnit, Math.ceil(spec.cm / 5) * 5); rl.visible = false; base.add(rl);
  rl.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0))); rl.position.set(0.55, 0.5 + rl.geometry.parameters.width / 2, 0.3);
  const tag = label(`${spec.no}`, { size: 0.34 }); tag.position.set(-0.9, 0.5 + H + 0.2, 0); base.add(tag);
  const r = rng(3), phase = leaves.map(() => r() * 6.28);
  const actions = {
    flip: { name: '🔄 잎 뒤집어 보기', dur: 4, note: '뒷면의 색과 잎맥이 앞면과 어떻게 다른지 보세요. 만지면 어떤 느낌일까요?', step: (t) => { const o = t < 0.25 ? ease.io(t / 0.25) : t > 0.75 ? 1 - ease.io((t - 0.75) / 0.25) : 1; leaves.slice(0, 2).forEach((lf) => { const h = lf.userData.hold; h.rotation.y = lf.userData.rest.y + Math.PI * o; }); } },
    sun: { name: '☀ 햇빛 비추기', dur: 5, note: '위에서 본 모습으로 바꿔 보세요. 잎 그림자가 서로 겹치나요? 겹치지 않으면 무엇이 좋을까요?', step: (t) => { plate.visible = t > 0.05 && t < 0.98; sun.visible = plate.visible; } },
    sway: { name: '🍃 바람 보내기', dur: 3.5, note: '잎자루가 긴 잎과 짧은 잎은 바람에 어떻게 다르게 움직이나요?', step: (t) => { const a = Math.sin(t * Math.PI) * 0.3; leaves.forEach((lf, i) => { const h = lf.userData.hold; h.rotation.z = lf.userData.rest.z + a * Math.sin(t * 14 + phase[i]) * (0.4 + Math.abs(h.position.x)); h.rotation.x = a * 0.4 * Math.sin(t * 11 + phase[i]); }); } },
  };
  let running = null;
  stage.update = (dt) => { if (!running) return; running.t += dt / running.a.dur; running.a.step(clamp01(running.t)); if (running.t >= 1) { running.a.step(1); running = null; } };
  const api = {
    spec, actions: () => Object.entries(actions).map(([id, a]) => ({ id, name: a.name })),
    run(id) { const a = actions[id]; if (!a) return null; if (running) running.a.step(1); running = { a, t: 0 }; return a.note; },
    setView(id) { const v = VIEWS[id] || VIEWS.angle; stage.setView({ theta: v.theta, phi: v.phi, dist: 8, target: [0, 1.8, 0] }); },
    toggle(what, on) { if (what === 'nodes') group.userData.nodes.forEach((n) => { n.ring.visible = on; n.t.visible = on; }); if (what === 'ruler') rl.visible = on; stage._needFit = true; },
  };
  api.setView('angle');
  return api;
}
