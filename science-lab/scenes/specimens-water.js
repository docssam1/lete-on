// 자연관찰 연습 표본 — 물에 사는 식물 8종(제25회 중학교 문제지: 8종을 직접 골라 그리고 설명). ①~④ 물 위에 잎이 뜨는 것 · 떠다니는 것 · 잎자루가 부푼 것 · 물속에 잠긴 것, ⑤~⑧은 아래.
// 자연관찰대회에서 실제로 하는 일(돌려 보기 · 위/옆에서 보기 · 단면 · 자 대기 · 손으로 확인)을 화면에서 연습한다.
// 이름은 처음엔 숨긴다(대회처럼 번호로 부르고 생김새로 설명). 모양은 실제 식물의 특징을 따라 코드로 만든 모형이다(실사 사진은 따로 붙인다).
// 좌표: 물통 바닥 흙 윗면 y=SOIL, 수면 y=WATER. 1 단위의 실제 길이는 표본마다 cmPerUnit.
import { THREE, mat, glossMat, label, PALETTE, clamp01, ease, lerp } from './_kit.js';
import { leafTextures, leafMesh } from './_organic.js';
const LILY_TEX = () => leafTextures('lf:lily', { outline: 'lily', veins: 'radial', top: '#2f7a3a', topEdge: '#6fb05a', under: '#7b3550', seed: 12, w: 512, h: 512 });
const PETAL_TEX = () => leafTextures('lf:petal', { outline: 'petal', veins: 'parallel', top: '#fbf7ef', topEdge: '#f1e3d3', under: '#f3dcd6', veinN: 0, glossSpots: false, w: 256, h: 384 });
const HYA_TEX = () => leafTextures('lf:hya', { outline: 'round', veins: 'palmate', top: '#3e8a35', topEdge: '#74b452', under: '#5f9442', seed: 14, w: 512, h: 512 });
const DUCK_TEX = () => leafTextures('lf:duck', { outline: 'ovate', veins: 'parallel', top: '#8fcf5a', topEdge: '#c0e27e', under: '#7a5a6a', veinN: 0, glossSpots: false, w: 256, h: 384 });
const HYD_TEX = () => leafTextures('lf:hyd', { outline: 'lance', veins: 'pinnate', top: '#2f6b2c', topEdge: '#5a9a44', under: '#2f6b2c', veinN: 0, glossSpots: false, w: 128, h: 512 });

const WATER = 2.6, SOIL = 0.35, TW = 5.2, TD = 3.0;
const GREEN = 0x3f8f3a, GREEN_L = 0x6db35a, PURPLE = 0x7b3550, ROOT = 0x4b3a4f;

function tank() {
  const g = new THREE.Group();
  const soil = new THREE.Mesh(new THREE.BoxGeometry(TW, SOIL, TD), mat(0x6b5038, { roughness: 0.95 })); soil.position.y = SOIL / 2; soil.receiveShadow = true; g.add(soil);
  const water = new THREE.Mesh(new THREE.BoxGeometry(TW, WATER - SOIL, TD), new THREE.MeshPhysicalMaterial({ color: 0x9cc9d9, roughness: 0.1, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }));
  water.position.y = SOIL + (WATER - SOIL) / 2; water.renderOrder = 1; g.add(water);
  const surf = new THREE.Mesh(new THREE.PlaneGeometry(TW, TD), new THREE.MeshPhysicalMaterial({ color: 0x8fc3d6, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide }));
  surf.rotation.x = -Math.PI / 2; surf.position.y = WATER; surf.renderOrder = 2; g.add(surf);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(TW, WATER, TD)), new THREE.LineBasicMaterial({ color: 0x8aa1ad, transparent: true, opacity: 0.6 }));
  edge.position.y = WATER / 2; g.add(edge);
  const sl = label('[수면]', { size: 0.3 }); sl.position.set(-1.9, WATER, TD / 2 - 0.2); g.add(sl);
  const gl = label('[바닥 흙]', { size: 0.26 }); gl.position.set(-1.9, SOIL / 2, TD / 2 - 0.2); g.add(gl);
  // 물통은 배경 — 카메라는 식물에 맞춘다(물통이 화면을 차지하면 표본이 작아진다). 잘리는 물통 가장자리는 상관없다.
  g.traverse((o) => { o.userData.noFrame = true; }); g.userData.labels = [sl, gl];
  return g;
}
// 자: cm 눈금 그림. cmPerUnit에 맞춰 길이(단위)를 정한다.
function ruler(cmPerUnit, cm) {
  const len = cm / cmPerUnit, cv = document.createElement('canvas'); cv.width = 1024; cv.height = 96; const c = cv.getContext('2d');
  c.fillStyle = '#f3e7b8'; c.fillRect(0, 0, 1024, 96); c.fillStyle = '#1f2a37'; c.font = '700 26px Pretendard, sans-serif'; c.textAlign = 'center';
  const steps = cm * 10; for (let i = 0; i <= steps; i++) { const x = 8 + (i / steps) * 1008, h = i % 10 === 0 ? 46 : i % 5 === 0 ? 30 : 18; c.fillRect(x - 1, 0, 2, h); if (i % 10 === 0 && (cm <= 12 || (i / 10) % 2 === 0)) c.fillText(String(i / 10), x, 82); }
  c.textAlign = 'right'; c.fillText('cm', 1012, 82);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.02, len * 96 / 1024), [mat(0xe6d79c), mat(0xe6d79c), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }), mat(0xe6d79c), mat(0xe6d79c), mat(0xe6d79c)]);
  m.userData.noFrame = true; return m;
}
// 단면 확대 원: 원판(구멍 = 공기가 드나드는 통로) + 테두리 고리 + 이름. 카메라 쪽(+z)을 본다.
function section(holes, { r = 0.55, color = GREEN_L, title = '단면 확대' } = {}) {
  const g = new THREE.Group(), s = new THREE.Shape(); s.absarc(0, 0, r, 0, Math.PI * 2, false);
  for (const [x, y, hr] of holes) { const h = new THREE.Path(); h.absarc(x * r, y * r, hr * r, 0, Math.PI * 2, true); s.holes.push(h); }
  const disc = new THREE.Mesh(new THREE.ShapeGeometry(s, 48), mat(color, { side: THREE.DoubleSide, roughness: 0.6 })); g.add(disc);
  const back = new THREE.Mesh(new THREE.CircleGeometry(r, 48), mat(0x23302a, { side: THREE.DoubleSide })); back.position.z = -0.01; g.add(back);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r + 0.06, 0.035, 10, 64), glossMat(0x2b2b2b)); g.add(ring);
  const t = label(title, { size: 0.26 }); t.position.set(0, r + 0.3, 0); g.add(t);
  return g;
}
const spongeHoles = (n, seed = 1) => { const out = []; let a = seed; const rnd = () => ((a = (a * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < n * 6 && out.length < n; i++) { const R = Math.sqrt(rnd()) * 0.78, th = rnd() * Math.PI * 2, x = R * Math.cos(th), y = R * Math.sin(th), hr = 0.05 + rnd() * 0.05; if (out.every(([u, v, w]) => Math.hypot(u - x, v - y) > w + hr + 0.03)) out.push([x, y, hr]); } return out; };
function leafShape(r, notch = 0) {
  const s = new THREE.Shape(), a0 = Math.PI / 2 + notch / 2, a1 = Math.PI / 2 - notch / 2 + Math.PI * 2;
  if (notch) { s.moveTo(0, 0); s.lineTo(r * Math.cos(a0), r * Math.sin(a0)); s.absarc(0, 0, r, a0, a1, false); s.lineTo(0, 0); } else s.absarc(0, 0, r, 0, Math.PI * 2, false);
  return s;
}
function ovalShape(w, h, tip = 0) { const s = new THREE.Shape(); s.moveTo(0, -h); s.bezierCurveTo(w * 1.1, -h * 0.9, w * 1.05, h * (0.6 - tip), 0, h); s.bezierCurveTo(-w * 1.05, h * (0.6 - tip), -w * 1.1, -h * 0.9, 0, -h); return s; }
// 앞(초록)·뒤(자주) 두 겹 잎 — 위에서 보면 초록, 아래에서 보면 다른 색이 보인다(관찰 거리)
function twoFace(shape, top = GREEN, under = PURPLE, gloss = 0.5) {
  const geo = new THREE.ShapeGeometry(shape, 32), g = new THREE.Group();
  const a = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: top, roughness: 0.35, clearcoat: gloss, clearcoatRoughness: 0.25, side: THREE.FrontSide })); a.castShadow = true;
  const b = new THREE.Mesh(geo, mat(under, { side: THREE.BackSide, roughness: 0.8 })); g.add(a, b); return g;
}
const tube = (pts, r, color) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 24, r, 8), mat(color, { roughness: 0.6 })); m.castShadow = true; return m; };
const drop = () => new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 14), new THREE.MeshPhysicalMaterial({ color: 0xdff3ff, roughness: 0.02, transmission: 0.6, transparent: true, opacity: 0.85, clearcoat: 1 }));
// 시간 함수 하나로 진행하는 손 확인 동작(0→1). 끝나면 처음 모습으로 돌아간다.
const act = (dur, step) => ({ dur, step });

// ── ① 물 위에 둥근 잎이 뜨는 것(수련형) ──
function lily() {
  const g = new THREE.Group(), leaves = [], cm = 10;
  const rh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.6, 12), mat(0x6e5a3a)); rh.rotation.z = Math.PI / 2; rh.position.set(-0.2, SOIL - 0.02, 0); g.add(rh);
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; g.add(tube([[-0.9 + (i % 7) * 0.25, SOIL - 0.05, 0], [-0.9 + (i % 7) * 0.25 + Math.cos(a) * 0.3, SOIL - 0.25, Math.sin(a) * 0.3]], 0.012, 0xd8c8a8)); }
  const spots = [[1.2, 0.5, 0.62, 0.3], [-1.5, -0.6, 0.55, 2.2], [0.2, -0.9, 0.5, 4.1], [-0.6, 0.85, 0.6, 1.2], [1.6, -0.7, 0.42, 5.3]];
  spots.forEach(([x, z, r, rot], i) => {
    const base = [-0.6 + i * 0.25, SOIL + 0.05, 0];
    g.add(tube([base, [lerp(base[0], x, 0.3), 1.0, z * 0.4], [lerp(base[0], x, 0.8), 2.0, z * 0.85], [x, WATER - 0.02, z]], 0.035, 0x8a6a3e));
    const lf = new THREE.Group(), pad = leafMesh(LILY_TEX(), { w: r * 2, h: r * 2, curl: -0.1, droop: -0.05, segs: [16, 16], gloss: 0.95 }); pad.position.y = -r; lf.add(pad);
    lf.rotation.x = -Math.PI / 2; lf.rotation.z = rot; lf.position.set(x, WATER + 0.012, z); g.add(lf); leaves.push(lf);
  });
  const fl = new THREE.Group(); for (let k = 0; k < 3; k++) for (let i = 0; i < 8; i++) { const pg = new THREE.Group(), p = leafMesh(PETAL_TEX(), { w: 0.2 - k * 0.03, h: 0.48 - k * 0.1, curl: 0.35, droop: -0.5, segs: [6, 10], gloss: 0.25 }); pg.add(p); const a = (i / 8) * Math.PI * 2 + k * 0.4; pg.position.set(Math.cos(a) * 0.1, 0.04 + k * 0.03, Math.sin(a) * 0.1); pg.rotation.set(0, -a, 0); pg.rotateX(0.55 + k * 0.35); pg.rotateY(0); p.rotation.y = Math.PI / 2; fl.add(pg); }
  const ctr = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 10), mat(0xf2c94c)); ctr.position.y = 0.14; fl.add(ctr); fl.position.set(0.5, WATER, 0.6); g.add(fl);
  g.add(tube([[-0.1, SOIL + 0.05, 0], [0.2, 1.4, 0.3], [0.5, WATER, 0.6]], 0.03, 0x7d6a3a));
  const sec = section([[0, 0, 0.17], [0.42, 0.28, 0.16], [-0.42, 0.28, 0.16], [0.42, -0.3, 0.15], [-0.42, -0.3, 0.15], [0, 0.52, 0.09], [0, -0.52, 0.09]], { title: '잎자루 단면(확대)' });
  sec.position.set(TW / 2 + 0.95, 1.5, 0.4);
  const d = drop(); d.visible = false; g.add(d);
  return {
    id: 'lily', no: '①', name: '수련', hint: '물 위에 둥근 잎이 뜬 것', cmPerUnit: cm, ruler: 30, group: g, section: sec,
    think: ['잎은 왜 물에 가라앉지 않을까요? 잎자루 단면의 구멍과 이어 생각해 봐요.', '잎 위와 잎 뒷면의 색은 같나요?', '잎의 갈라진 틈은 어떤 도움이 될까요?'],
    actions: {
      drop: { name: '💧 잎에 물 떨어뜨리기', ...act(3.2, (t) => { const lf = leaves[0]; d.visible = t < 0.98; const p0 = lf.position; if (t < 0.35) d.position.set(p0.x, WATER + 1.6 - 1.55 * ease.io(t / 0.35), p0.z); else { const k = (t - 0.35) / 0.65; d.position.set(p0.x + 0.62 * ease.io(k), WATER + 0.1 - (k > 0.8 ? (k - 0.8) * 0.8 : 0), p0.z); d.scale.setScalar(1); } }), note: '물방울이 퍼지지 않고 동그랗게 굴러 떨어지는지 보세요.' },
      press: { name: '👆 잎 눌러 보기', ...act(2.4, (t) => { const lf = leaves[1]; lf.position.y = WATER + 0.012 - 0.32 * Math.sin(Math.PI * Math.min(1, t * 1.25)) * Math.exp(-2 * t); }), note: '눌렀다 놓으면 잎이 어떻게 되나요?' },
    },
  };
}
// ── ② 작은 잎이 떠다니는 것(개구리밥형) — 실제로는 아주 작아서 8배로 키운 표본 ──
function duckweed() {
  const g = new THREE.Group(), fronds = [];
  const pos = [[-1.6, -0.6], [-0.7, 0.5], [0.3, -0.3], [1.3, 0.6], [1.7, -0.8], [-1.2, 0.9], [0.6, 1.0], [-0.2, -1.0]];
  pos.forEach(([x, z], i) => {
    const cl = new THREE.Group(), n = 2 + (i % 3);
    for (let k = 0; k < n; k++) {
      const f = new THREE.Group(), fm = leafMesh(DUCK_TEX(), { w: 0.42, h: 0.58, curl: 0.04, droop: 0, segs: [6, 8], gloss: 0.5 }); fm.position.y = -0.29; f.add(fm);
      f.rotation.x = -Math.PI / 2; f.rotation.z = (k / n) * Math.PI * 2 + i; f.position.set(Math.cos(k * 2.1) * 0.22 * (k ? 1 : 0), 0, Math.sin(k * 2.1) * 0.22 * (k ? 1 : 0)); cl.add(f);
      const rt = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.9, 6), mat(0xd9dfc8)); rt.position.set(f.position.x, -0.46, f.position.z); cl.add(rt);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), mat(0x9a8a6a)); cap.position.set(f.position.x, -0.92, f.position.z); cl.add(cap);
    }
    cl.position.set(x, WATER + 0.01, z); g.add(cl); fronds.push(cl);
  });
  const t = label('8배로 키운 모형', { size: 0.26 }); t.userData.noFrame = true; t.userData.scaleTag = true; g.add(t);
  const sec = section(spongeHoles(16, 7), { title: '잎 단면(확대)' }); sec.scale.set(1, 0.55, 1); sec.position.set(TW / 2 + 0.95, 1.6, 0.4);
  const d = drop(); d.visible = false; g.add(d);
  return {
    id: 'duckweed', no: '②', name: '개구리밥', hint: '작은 잎이 떠다니는 것', cmPerUnit: 1.25, ruler: 4, group: g, section: sec,
    think: ['뿌리는 몇 가닥인가요? 흙에 닿나요?', '바람이 불면 이 식물은 어디로 갈까요?', '잎 속의 빈 곳은 어떤 도움이 될까요?'],
    actions: {
      drop: { name: '💧 물 떨어뜨리기', ...act(2.6, (tt) => { const f = fronds[2]; d.visible = tt < 0.98; if (tt < 0.4) d.position.set(f.position.x, WATER + 1.4 - 1.35 * ease.io(tt / 0.4), f.position.z); else { const k = (tt - 0.4) / 0.6; d.position.set(f.position.x + 0.4 * k, WATER + 0.08 - k * 0.1, f.position.z); } f.position.y = WATER + 0.01 - (tt > 0.38 && tt < 0.6 ? 0.06 * Math.sin((tt - 0.38) / 0.22 * Math.PI) : 0); }), note: '물방울을 맞아도 잎이 잠기나요?' },
      press: { name: '👆 물속으로 눌러 보기', ...act(2.2, (tt) => { const f = fronds[1]; f.position.y = WATER + 0.01 - (tt < 0.35 ? 0.6 * ease.io(tt / 0.35) : 0.6 * (1 - ease.out((tt - 0.35) / 0.65))); }), note: '놓으면 얼마나 빨리 떠오르나요?' },
    },
  };
}
// ── ③ 잎자루가 부푼 것(부레옥잠형) ──
function hyacinth() {
  const g = new THREE.Group(), plant = new THREE.Group();
  const prof = []; for (let i = 0; i <= 16; i++) { const t = i / 16; prof.push(new THREE.Vector2(0.03 + 0.2 * Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 1.4 * (t < 0.85 ? 1 : 0.35), t * 1.0)); }
  const bulbGeo = new THREE.LatheGeometry(prof, 20), bulbMat = new THREE.MeshPhysicalMaterial({ color: 0x5f9d45, roughness: 0.3, clearcoat: 0.6 });
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2, arm = new THREE.Group();
    const b = new THREE.Mesh(bulbGeo, bulbMat); b.castShadow = true; arm.add(b);
    const blade = leafMesh(HYA_TEX(), { w: 0.7, h: 0.8, curl: 0.14, droop: 0.18, segs: [10, 12], gloss: 1 }); blade.position.set(0, 0.96, 0); blade.rotation.x = -0.35; arm.add(blade);
    arm.rotation.z = -0.55 - (i % 2) * 0.15; arm.rotation.y = a; arm.position.y = 0.05; plant.add(arm);
  }
  const rootMat = new THREE.LineBasicMaterial({ color: ROOT }), pts = [];
  for (let i = 0; i < 70; i++) { const a = Math.random() * Math.PI * 2, r = Math.random() * 0.35, x = Math.cos(a) * r, z = Math.sin(a) * r, L = 0.9 + Math.random() * 0.8; pts.push(x, 0, z, x * 1.3, -L, z * 1.3); for (let k = 1; k < 6; k++) { const y = -L * k / 6; pts.push(x * (1 + 0.3 * k / 6), y, z * (1 + 0.3 * k / 6), x * 1.2 + (Math.random() - 0.5) * 0.25, y - 0.12, z * 1.2 + (Math.random() - 0.5) * 0.25); } }
  const roots = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)), rootMat); plant.add(roots);
  const rootHint = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.2, 1.6, 12), new THREE.MeshBasicMaterial({ visible: false })); rootHint.position.y = -0.8; plant.add(rootHint);   // 틀 맞춤용(보이지 않음)
  plant.position.set(0, WATER - 0.12, 0); g.add(plant);
  const sec = section(spongeHoles(30, 3), { title: '부푼 잎자루 단면(확대)', color: 0x9bc77f }); sec.position.set(TW / 2 + 0.95, 1.5, 0.4);
  const d = drop(); d.visible = false; g.add(d);
  return {
    id: 'hyacinth', no: '③', name: '부레옥잠', hint: '잎자루가 공처럼 부푼 것', cmPerUnit: 10, ruler: 30, group: g, section: sec,
    think: ['부푼 잎자루를 눌러 보면 어떤 느낌일까요? 단면과 이어 생각해 봐요.', '뿌리가 흙에 닿지 않는데 어떻게 쓰러지지 않을까요?', '잎 표면이 반짝이는 까닭은?'],
    actions: {
      drop: { name: '💧 잎에 물 떨어뜨리기', ...act(2.8, (t) => { d.visible = t < 0.98; const x0 = 0.55, z0 = 0.2; if (t < 0.38) d.position.set(x0, WATER + 2.6 - 1.25 * ease.io(t / 0.38), z0); else { const k = (t - 0.38) / 0.62; d.position.set(x0 + 0.5 * k, WATER + 1.35 - 1.3 * k * k, z0 + 0.2 * k); } }), note: '물방울이 잎에 스며드나요, 굴러떨어지나요?' },
      press: { name: '👆 포기째 눌러 보기', ...act(2.6, (t) => { plant.position.y = WATER - 0.12 - 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.3)) * Math.exp(-1.6 * t); }), note: '눌렀다 놓으면 어떻게 되나요? 무엇이 떠오르게 할까요?' },
    },
  };
}
// ── ④ 물속에 잠겨 사는 것(검정말형) ──
function hydrilla() {
  const g = new THREE.Group(), stems = [], cm = 2.5;
  const hyTex = HYD_TEX(), leafGeo = new THREE.PlaneGeometry(0.1, 0.42, 1, 1); leafGeo.translate(0, 0.21, 0);
  const leafMat = new THREE.MeshStandardMaterial({ map: hyTex.top, alphaMap: hyTex.alpha, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.6 }), dd = new THREE.Object3D();
  [[-1.2, -0.3, 0.1], [0, 0.4, -0.08], [1.1, -0.2, 0.06]].forEach(([x, z, lean]) => {
    const s = new THREE.Group(), H = WATER - SOIL - 0.18, gap = 0.22, n = Math.floor(H / gap);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, H, 8), mat(0x6f8f4a)); stem.position.y = H / 2; s.add(stem);
    const im = new THREE.InstancedMesh(leafGeo, leafMat, n * 4); let q = 0;
    for (let k = 1; k <= n; k++) for (let j = 0; j < 4; j++) { const a = (j / 4) * Math.PI * 2 + k * 0.4; dd.position.set(Math.cos(a) * 0.12, k * gap, Math.sin(a) * 0.12); dd.rotation.set(0, -a + Math.PI / 2, 0); dd.rotateX(-0.6); dd.scale.set(1, 1, 1); dd.updateMatrix(); im.setMatrixAt(q++, dd.matrix); }
    im.instanceMatrix.needsUpdate = true; im.castShadow = true; s.add(im);
    for (let r = 0; r < 6; r++) s.add(tube([[0, 0.02, 0], [Math.cos(r) * 0.2, -0.12, Math.sin(r) * 0.2]], 0.008, 0xd8d0b0));
    s.position.set(x, SOIL, z); s.rotation.z = lean; s.userData.lean = lean; g.add(s); stems.push(s);
  });
  const tl = label('4배로 키운 모형', { size: 0.26 }); tl.userData.noFrame = true; tl.userData.scaleTag = true; g.add(tl);
  const sec = section([[0, 0, 0.12], ...Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * Math.PI * 2) * 0.55, Math.sin(i / 8 * Math.PI * 2) * 0.55, 0.12])], { title: '줄기 단면(확대)', color: 0x7fae5f });
  sec.position.set(TW / 2 + 0.95, 1.5, 0.4);
  return {
    id: 'hydrilla', no: '④', name: '검정말', hint: '물속에 잠겨 사는 것', cmPerUnit: cm, ruler: 5, rulerAt: { pos: [1.42, SOIL + 1, -0.2], vertical: true }, group: g, section: sec,
    think: ['한 마디에 잎이 몇 장씩 붙어 있나요? 마디 사이는 몇 cm인가요(여러 번 재어 평균)?', '물 밖으로 꺼내면 줄기는 어떻게 될까요?', '잎이 가늘고 얇으면 물속에서 어떤 점이 좋을까요?'],
    actions: {
      lift: { name: '✋ 물 밖으로 꺼내 보기', ...act(4, (t) => { const up = t < 0.3 ? ease.io(t / 0.3) : t > 0.75 ? 1 - ease.io((t - 0.75) / 0.25) : 1; stems.forEach((s, i) => { s.position.y = SOIL + up * (WATER - SOIL + 0.3); s.rotation.z = s.userData.lean + up * (i % 2 ? -1.1 : 1.1) * (t > 0.3 && t < 0.75 ? 1 : up); }); }), note: '물 밖에서 줄기가 꼿꼿이 서 있나요?' },
      sway: { name: '🌊 물살 일으키기', ...act(3.5, (t) => { stems.forEach((s, i) => { s.rotation.z = s.userData.lean + Math.sin(t * Math.PI * 6 + i) * 0.25 * (1 - t); }); }), note: '물살에 줄기가 꺾이나요, 휘나요?' },
    },
  };
}

// ── ⑤~⑧ 제25회 중학교 문제지(8종을 직접 골라 그리고 설명) — 원장이 준 최우수 보고서의 식물 꼴을 따라 4종을 더했다 ──
// 네잎 모양 잎이 물 위에 뜨는 것(네가래형) · 잎이 Y자로 갈라져 물속에 잠긴 것(붕어마름형) · 질경이 모양 잎이 물 밖으로 선 것(택사형) · 긴 칼 모양 잎이 곧게 선 것(부들형)
const MARS_TEX = () => leafTextures('lf:mars', { outline: Array.from({ length: 41 }, (_, i) => { const t = i / 40; return [t < 0.22 ? 0.98 * Math.sin((Math.PI / 2) * Math.min(1, (t + 0.02) / 0.22)) ** 0.6 : 0.96 * (1 - (t - 0.22) / 0.78) ** 0.85 + 0.03, t]; }), veins: 'palmate', top: '#3f8f3a', topEdge: '#7cbf62', under: '#8cbf74', veinN: 7, seed: 31, w: 256, h: 256, glossSpots: false });
const ALI_TEX = () => leafTextures('lf:alisma', { outline: 'elliptic', veins: 'parallel', top: '#3d8a37', topEdge: '#79b85e', under: '#8fbf78', veinN: 7, seed: 33, w: 256, h: 512 });
const TYPHA_TEX = () => leafTextures('lf:typha', { outline: Array.from({ length: 41 }, (_, i) => { const t = i / 40; return [t < 0.12 ? 0.9 * (t / 0.12) ** 0.7 : 0.9, t]; }), veins: 'parallel', top: '#5a8a3a', topEdge: '#86ad5c', under: '#6f9a4a', veinN: 5, seed: 35, w: 64, h: 1024, glossSpots: false });
const _q = new THREE.Quaternion(), _u = new THREE.Vector3(0, 1, 0), _s = new THREE.Vector3(1, 1, 1);
// 인스턴스 막대 하나: p에서 dir 방향으로 len
const segAt = (im, k, p, dir, len) => { _q.setFromUnitVectors(_u, dir.clone().normalize()); _s.set(1, len, 1); im.setMatrixAt(k, new THREE.Matrix4().compose(p, _q, _s)); };

function marsilea() {
  const g = new THREE.Group(), leaves = [], cm = 5;
  g.add(tube([[-1.9, SOIL + 0.02, -0.2], [-0.8, SOIL + 0.04, 0.2], [0.4, SOIL + 0.02, -0.1], [1.8, SOIL + 0.04, 0.25]], 0.035, 0x6a5a3a));
  for (let i = 0; i < 12; i++) { const x = -1.7 + i * 0.3; g.add(tube([[x, SOIL, 0], [x + 0.08, SOIL - 0.2, (i % 2 ? 0.12 : -0.1)]], 0.008, 0xd8c8a8)); }
  // [잎자루 밑 x, 잎 x, z, 물 위에 뜸?, 돌림]
  const spots = [[-1.5, -1.6, 0.6, true, 0.3], [-0.9, -0.6, -0.7, true, 1.1], [-0.2, 0.3, 0.5, true, 2.0], [0.5, 1.2, -0.5, true, 0.7], [1.2, 1.6, 0.7, true, 1.6], [-0.5, -0.4, 0.1, false, 0.4], [0.9, 0.7, -0.1, false, 2.5]];
  spots.forEach(([bx, x, z, float, rot]) => {
    const top = float ? WATER + 0.01 : WATER + 0.55;
    g.add(tube([[bx, SOIL + 0.04, 0], [lerp(bx, x, 0.3), 1.1, z * 0.4], [lerp(bx, x, 0.85), top - 0.6, z * 0.9], [x, top, z]], float ? 0.018 : 0.022, 0x7a8a46));
    const lf = new THREE.Group();
    for (let k = 0; k < 4; k++) { const h = new THREE.Group(), m = leafMesh(MARS_TEX(), { w: 0.44, h: 0.42, curl: float ? 0.02 : 0.2, droop: float ? 0 : 0.15, segs: [6, 6], gloss: 0.45 }); h.add(m); h.rotation.z = (k / 4) * Math.PI * 2; lf.add(h); }
    lf.rotation.x = float ? -Math.PI / 2 : -Math.PI / 2 + 0.35; lf.rotation.z = rot; lf.position.set(x, top, z); g.add(lf); leaves.push(lf);
  });
  const sec = section([[0, 0, 0.12], ...Array.from({ length: 8 }, (_, i) => [Math.cos((i / 8) * Math.PI * 2) * 0.5, Math.sin((i / 8) * Math.PI * 2) * 0.5, 0.11])], { title: '잎자루 단면(확대)' });
  sec.position.set(TW / 2 + 0.95, 1.5, 0.4);
  const d = drop(); d.visible = false; g.add(d);
  return {
    id: 'marsilea', no: '⑤', name: '네가래', hint: '잎이 넷으로 갈라져 물 위에 뜬 것', cmPerUnit: cm, ruler: 10, group: g, section: sec,
    think: ['잎 한 장은 작은잎 몇 장으로 되어 있나요? 어떤 모양으로 놓여 있나요?', '물 위에 뜬 잎과 물 밖으로 선 잎은 잎자루가 어떻게 다른가요?', '잎자루를 손으로 휘어 보면 잘 휘나요, 꺾이나요?'],
    actions: {
      drop: { name: '💧 잎에 물 떨어뜨리기', ...act(3, (t) => { const lf = leaves[2], p0 = lf.position; d.visible = t < 0.98; if (t < 0.35) d.position.set(p0.x, WATER + 1.5 - 1.42 * ease.io(t / 0.35), p0.z); else { const k = (t - 0.35) / 0.65; d.position.set(p0.x + 0.5 * ease.io(k), WATER + 0.08 - (k > 0.75 ? (k - 0.75) * 0.4 : 0), p0.z); } }), note: '물방울이 잎에 스며드나요, 굴러떨어지나요?' },
      sway: { name: '🌊 물살 일으키기', ...act(3.5, (t) => { leaves.forEach((lf, i) => { lf.position.x += Math.sin(t * Math.PI * 6 + i) * 0.006 * (1 - t); lf.rotation.z += Math.sin(t * Math.PI * 4 + i) * 0.01 * (1 - t); }); }), note: '물살에 잎이 뒤집히나요? 잎자루가 휘나요?' },
    },
  };
}
function ceratophyllum() {
  const g = new THREE.Group(), stems = [], cm = 10, segGeo = new THREE.CylinderGeometry(0.01, 0.014, 1, 5); segGeo.translate(0, 0.5, 0);
  const segMat = mat(0x2f5a2a, { roughness: 0.6 }), up = new THREE.Vector3(0, 1, 0);
  [[-1.2, -0.2, 0.15], [0.1, 0.35, -0.1], [1.25, -0.25, 0.08]].forEach(([x, z, lean], si) => {
    const H = WATER - SOIL - 0.3, s = new THREE.Group(), lower = new THREE.Group(), upper = new THREE.Group(), cut = H * 0.62; upper.position.y = cut; s.add(lower); lower.add(upper);
    const ys = []; let y = 0.12, gap = 0.2; while (y < H) { ys.push(y); y += gap; gap = Math.max(0.055, gap * 0.9); }
    const im = (n) => new THREE.InstancedMesh(segGeo, segMat, n), imL = im(ys.length * 27), imU = im(ys.length * 27); let kL = 0, kU = 0;
    const stemL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, cut, 8), mat(0x4a6a32)); stemL.position.y = cut / 2; lower.add(stemL);
    const stemU = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, H - cut, 8), mat(0x4a6a32)); stemU.position.y = (H - cut) / 2; upper.add(stemU);
    ys.forEach((yy, wi) => {
      const top = yy >= cut, im2 = top ? imU : imL, oy = top ? yy - cut : yy, sc = 0.75 + 0.25 * (1 - yy / H);
      for (let j = 0; j < 9; j++) {
        const a = (j / 9) * Math.PI * 2 + wi * 0.35, o = new THREE.Vector3(Math.cos(a), 0, Math.sin(a)), tg = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
        const dv = o.clone().multiplyScalar(Math.sin(0.95)).addScaledVector(up, Math.cos(0.95)).normalize(), p0 = new THREE.Vector3(o.x * 0.02, oy, o.z * 0.02), L1 = 0.13 * sc, L2 = 0.11 * sc, p1 = p0.clone().addScaledVector(dv, L1);
        const k0 = top ? kU++ : kL++; segAt(im2, k0, p0, dv, L1);
        for (const sg of [-1, 1]) { const df = dv.clone().applyQuaternion(new THREE.Quaternion().setFromAxisAngle(tg, sg * 0.38)); segAt(im2, top ? kU++ : kL++, p1, df, L2); }
      }
    });
    imL.count = kL; imU.count = kU; imL.instanceMatrix.needsUpdate = imU.instanceMatrix.needsUpdate = true; imL.castShadow = imU.castShadow = true; lower.add(imL); upper.add(imU);
    s.position.set(x, SOIL + 0.12 + si * 0.05, z); s.rotation.z = lean; s.userData = { lean, upper, cut }; g.add(s); stems.push(s);
  });
  const sec = section([[0, 0, 0.1], ...Array.from({ length: 6 }, (_, i) => [Math.cos((i / 6) * Math.PI * 2) * 0.45, Math.sin((i / 6) * Math.PI * 2) * 0.45, 0.07])], { title: '줄기 단면(확대)', color: 0x6f9a52 });
  sec.position.set(TW / 2 + 0.95, 1.5, 0.4);
  return {
    id: 'ceratophyllum', no: '⑥', name: '붕어마름', hint: '잎이 Y자로 갈라져 물속에 잠긴 것', cmPerUnit: cm, ruler: 10, rulerAt: { pos: [1.6, SOIL + 1, -0.25], vertical: true }, group: g, section: sec,
    think: ['뿌리가 있나요? 바닥에 박혀 있나요?', '잎은 몇 갈래로 갈라지나요? 한 마디에 몇 장인가요?', '줄기 끝 쪽과 아래쪽의 마디 사이 길이를 비교해 보세요.'],
    actions: {
      bend: { name: '✋ 줄기 구부려 보기', ...act(4.2, (t) => { const s = stems[1], U = s.userData.upper, b = t < 0.3 ? ease.io(t / 0.3) : 1, off = t > 0.35 && t < 0.85 ? ease.out((t - 0.35) / 0.5) : t >= 0.85 ? 1 - ease.io((t - 0.85) / 0.15) : 0; U.rotation.z = 0.5 * b * (t < 0.85 ? 1 : 1 - ease.io((t - 0.85) / 0.15)); U.position.set(0.35 * off, s.userData.cut + 0.25 * off, 0); }), note: '조금만 구부려도 똑 부러져요. 부러진 조각은 물에서 어떻게 될까요?' },
      sway: { name: '🌊 물살 일으키기', ...act(3.5, (t) => { stems.forEach((s, i) => { s.rotation.z = s.userData.lean + Math.sin(t * Math.PI * 6 + i) * 0.22 * (1 - t); }); }), note: '물살에 잎이 어떻게 움직이나요? 잎이 가늘게 갈라져 있으면 무엇이 좋을까요?' },
    },
  };
}
function alisma() {
  const g = new THREE.Group(), blades = [], cm = 10;
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.25, 12), mat(0x7a7a4a)); crown.position.set(0, SOIL + 0.08, 0); g.add(crown);
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; g.add(tube([[Math.cos(a) * 0.1, SOIL, Math.sin(a) * 0.1], [Math.cos(a) * 0.35, SOIL - 0.25, Math.sin(a) * 0.35]], 0.01, 0xd8d0b8)); }
  const blade = (a, H, tilt, w, h) => {
    const bx = Math.cos(a) * (0.55 + H * 0.12), bz = Math.sin(a) * (0.5 + H * 0.1), top = new THREE.Vector3(bx, H, bz);
    g.add(tube([[Math.cos(a) * 0.08, SOIL + 0.15, Math.sin(a) * 0.08], [bx * 0.4, (SOIL + H) * 0.55, bz * 0.4], [top.x, top.y, top.z]], 0.03, 0x6f8f46));
    const hold = new THREE.Group(), m = leafMesh(ALI_TEX(), { w, h, curl: 0.18, droop: 0.12, segs: [8, 12], gloss: 0.5 }); hold.add(m); hold.position.copy(top); hold.rotation.set(0, -a + Math.PI / 2, 0); hold.rotateX(-tilt); g.add(hold); blades.push(hold);
  };
  [[0.3, 3.4, 0.7], [1.6, 3.7, 0.55], [2.9, 3.3, 0.8], [4.2, 3.6, 0.6], [5.4, 3.2, 0.75]].forEach(([a, H, tilt]) => blade(a, H, tilt, 0.55, 0.95));
  // 물속 어린 잎: 가늘고 리본 같다
  [[0.9, 1.4], [3.6, 1.2]].forEach(([a, H]) => { const hold = new THREE.Group(), m = leafMesh(ALI_TEX(), { w: 0.12, h: 0.9, curl: 0.05, droop: 0.3, segs: [2, 10], gloss: 0.2 }); hold.add(m); hold.position.set(Math.cos(a) * 0.2, SOIL + 0.15, Math.sin(a) * 0.2); hold.rotation.set(0, -a + Math.PI / 2, 0); hold.rotateX(-0.5); g.add(hold); });
  // 꽃대: 마디마다 가지 3개가 돌려나고 끝에 흰 꽃(꽃잎 3장)
  g.add(tube([[0.05, SOIL + 0.15, 0], [0.1, 3, 0.05], [0.12, 4.7, 0.05]], 0.03, 0x7f9a4e));
  const pet = new THREE.Mesh(new THREE.CircleGeometry(0.05, 10), mat(0xfbf8f2, { side: THREE.DoubleSide }));
  [3.6, 4.05, 4.45].forEach((y, wi) => { for (let j = 0; j < 3; j++) { const a = (j / 3) * Math.PI * 2 + wi, L = 0.45 - wi * 0.12, tip = [0.11 + Math.cos(a) * L, y + L * 0.6, 0.05 + Math.sin(a) * L]; g.add(tube([[0.11, y, 0.05], tip], 0.012, 0x8aa65a)); const fl = new THREE.Group(); for (let k = 0; k < 3; k++) { const pp = pet.clone(); pp.position.set(Math.cos((k / 3) * Math.PI * 2) * 0.05, 0, Math.sin((k / 3) * Math.PI * 2) * 0.05); pp.rotation.x = -Math.PI / 2; fl.add(pp); } const c = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), mat(0xe8c84a)); c.position.y = 0.01; fl.add(c); fl.position.set(...tip); g.add(fl); } });
  const sec = section(spongeHoles(26, 9), { title: '잎자루 단면(확대)', color: 0x8fbf72 }); sec.position.set(TW / 2 + 0.95, 1.5, 0.4);
  const d = drop(); d.visible = false; g.add(d);
  return {
    id: 'alisma', no: '⑦', name: '택사', hint: '질경이 모양 잎이 물 밖으로 선 것', cmPerUnit: cm, ruler: 30, rulerAt: { pos: [-1.9, SOIL + 1.6, 0.3], vertical: true }, group: g, section: sec,
    think: ['잎맥은 어떻게 뻗나요 — 그물처럼, 나란히?', '물속의 어린 잎과 물 밖의 잎은 모양이 같나요?', '꽃잎은 몇 장인가요? 꽃대의 가지는 한 마디에 몇 개씩 나나요?'],
    actions: {
      drop: { name: '💧 잎에 물 떨어뜨리기', ...act(3, (t) => { const b = blades[1].position; d.visible = t < 0.98; if (t < 0.4) d.position.set(b.x, b.y + 1.6 - 1.45 * ease.io(t / 0.4), b.z); else { const k = (t - 0.4) / 0.6; d.position.set(b.x + 0.15 * k, b.y + 0.15 - 0.6 * k * k, b.z + 0.2 * k); } }), note: '물방울이 잎에 퍼지나요, 굴러떨어지나요?' },
      sway: { name: '🍃 바람 불기', ...act(3.5, (t) => { blades.forEach((b, i) => { b.rotation.z = Math.sin(t * Math.PI * 5 + i) * 0.12 * (1 - t); }); }), note: '잎자루가 바람에 꺾이나요, 휘었다 돌아오나요?' },
    },
  };
}
function typha() {
  const g = new THREE.Group(), blades = [], cm = 30;
  const rh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.8, 10), mat(0x8a6a44)); rh.rotation.z = Math.PI / 2; rh.position.set(0, SOIL - 0.05, 0); g.add(rh);
  for (let i = 0; i < 14; i++) g.add(tube([[-0.8 + i * 0.12, SOIL - 0.05, 0], [-0.8 + i * 0.12 + 0.05, SOIL - 0.3, (i % 2 ? 0.15 : -0.15)]], 0.01, 0xcfc4a6));
  [[-0.5, 0.2, 5.0, -0.12], [-0.35, 1.6, 4.4, 0.1], [-0.1, 3.0, 5.4, -0.05], [0.25, 4.3, 4.8, 0.14], [0.45, 5.5, 4.2, -0.18], [0.1, 0.9, 3.8, 0.2], [-0.2, 2.4, 4.6, -0.2]].forEach(([x, a, L, lean]) => {
    const hold = new THREE.Group(), m = leafMesh(TYPHA_TEX(), { w: 0.07, h: L, curl: 0.02, droop: 0.03, segs: [2, 20], gloss: 0.2 }); hold.add(m); hold.position.set(x, SOIL + 0.05, 0); hold.rotation.set(0, a, lean); g.add(hold); blades.push(hold);
  });
  g.add(tube([[0.05, SOIL, 0], [0.08, 3, 0.02], [0.1, 4.9, 0.02]], 0.03, 0x7a8a4a));
  const fem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.62, 16), mat(0x5a3a22, { roughness: 0.9 })); fem.position.set(0.09, 4.3, 0.02); g.add(fem);
  const male = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.4, 10), mat(0xc8b06a, { roughness: 1 })); male.position.set(0.1, 4.82, 0.02); g.add(male);
  // 잎 찢기: 앞쪽에 잎 조각 하나 — 세로로는 쭉 갈라지고 가로로는 잘 안 찢어진다
  const tear = new THREE.Group(), hl = [-1, 1].map((sg) => { const p = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 1.1), mat(0x5a8a3a, { side: THREE.DoubleSide })); m.position.set(sg * 0.035, 0.55, 0); p.add(m); tear.add(p); return p; });
  tear.position.set(1.7, WATER + 0.3, 0.9); tear.visible = false; g.add(tear);
  // 잎 단면: 칸막이(격벽)로 나뉜 빈 방이 줄지어 있다
  const holes = []; for (let i = 0; i < 5; i++) for (const y of [-0.26, 0.26]) holes.push([-0.56 + i * 0.28, y, 0.11]);
  const sec = section(holes, { title: '잎 단면(확대)', color: 0x7aa75a }); sec.position.set(TW / 2 + 0.95, 2.4, 0.4);
  return {
    id: 'typha', no: '⑧', name: '부들', hint: '긴 칼 모양 잎이 곧게 선 것', cmPerUnit: cm, ruler: 150, rulerAt: { pos: [1.5, SOIL + 2.5, -0.4], vertical: true }, group: g, section: sec,
    think: ['잎을 가로로 찢을 때와 세로로 찢을 때 어떻게 다른가요?', '잎 단면의 칸칸이 나뉜 빈 방은 무슨 일을 할까요?', '키가 큰데 바람에 어떻게 버틸까요? 잎이 비틀려 있나요?'],
    actions: {
      tear: { name: '✋ 잎 찢어 보기', ...act(4, (t) => { tear.visible = t > 0.05 && t < 0.98; const o = t < 0.25 ? 0 : t < 0.8 ? ease.out((t - 0.25) / 0.55) : 1; hl.forEach((p, i) => { p.rotation.z = (i ? -1 : 1) * 0.35 * o; }); }), note: '세로로는 잎맥을 따라 쭉 갈라지고, 가로로는 잘 안 찢어져요. 왜 그럴까요?' },
      sway: { name: '🍃 바람 불기', ...act(3.5, (t) => { blades.forEach((b, i) => { b.rotation.z = b.rotation.z * 0.9 + (Math.sin(t * Math.PI * 4 + i * 0.7) * 0.16 * (1 - t)) * 0.1; }); }), note: '잎이 바람에 꺾이나요, 휘었다 돌아오나요?' },
    },
  };
}

export const SPECIMENS = [lily, duckweed, hyacinth, hydrilla, marsilea, ceratophyllum, alisma, typha];
export const TOOLS = [{ id: 'section', name: '✂ 단면 보기' }, { id: 'ruler', name: '📏 자 대기' }];
export const VIEWS = { side: { theta: 0, phi: 1.5, name: '옆에서 본 모습' }, top: { theta: 0, phi: 0.36, name: '위에서 본 모습' }, angle: { theta: 0.55, phi: 1.12, name: '비스듬히' } };
// 무대에 표본 하나를 올린다. 돌려주는 것: { spec, run(동작 id), setView(id), toggle(이름, 켬) }
export function mountSpecimen(stage, make) {
  stage.clear();
  const spec = make(), base = new THREE.Group(), tk = tank();
  base.add(tk, spec.group);
  // 이름표는 표본 상자 바로 안쪽에 — 물통 가장자리에 두면 카메라가 식물에 맞출 때 잘린다
  const bb = new THREE.Box3(); spec.group.updateMatrixWorld(true); spec.group.traverse((o) => { if (o.isMesh && !o.userData.noFrame) bb.expandByObject(o, true); });
  const [sl, gl] = tk.userData.labels; sl.center.set(0, 0.5); gl.center.set(0, 0.5);
  sl.position.set(bb.min.x + 0.05, WATER + 0.05, TD / 2 - 0.3); gl.position.set(bb.min.x + 0.05, SOIL * 0.6, TD / 2 - 0.3); sl.userData.noFrame = false; gl.userData.noFrame = false;
  spec.group.traverse((o) => { if (o.userData.scaleTag) { o.center.set(1, 0.5); o.position.set(bb.max.x, bb.max.y + 0.25, 0); } });
  const sec = spec.section; sec.visible = false; base.add(sec);
  const lead = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.2, 1.4, 0), sec.position.clone().add(new THREE.Vector3(-0.6, 0, 0))]), new THREE.LineDashedMaterial({ color: 0x2b2b2b, dashSize: 0.1, gapSize: 0.07 }));
  lead.computeLineDistances(); lead.visible = false; base.add(lead);
  const rl = ruler(spec.cmPerUnit, spec.ruler); rl.visible = false; base.add(rl);
  if (spec.rulerAt?.vertical) { rl.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0))); rl.position.set(...spec.rulerAt.pos); } else rl.position.set(0, WATER + 0.03, TD / 2 + 0.25);   // 세로 자: 눈금이 위로, 눈금 면이 앞으로
  stage.root.add(base);
  stage.frameHidden = false;
  let running = null;
  stage.update = (dt) => {
    if (!running) return;
    running.t += dt / running.a.dur; running.a.step(clamp01(running.t));
    if (running.t >= 1) { running.a.step(1); running = null; }
  };
  const api = {
    spec, actions: () => Object.entries(spec.actions).map(([id, a]) => ({ id, name: a.name })),
    run(id) { const a = spec.actions[id]; if (!a) return null; if (running) running.a.step(1); running = { a, t: 0 }; return a.note; },
    setView(id) { const v = VIEWS[id] || VIEWS.angle; stage.setView({ theta: v.theta, phi: v.phi, dist: 10, target: [0, 1.3, 0] }); },
    toggle(what, on) { if (what === 'section') { sec.visible = on; lead.visible = on; } if (what === 'ruler') rl.visible = on; stage._needFit = true; },
  };
  api.setView('angle');
  return api;
}
