import { THREE, label, roundedBoxGeometry, clamp01 } from './_kit.js';
import { labTable } from './glassware.js';
import { LENGTHS, STRENGTHS, rulerModel, rulerRow } from './ruler-model.js';
export { LENGTHS, STRENGTHS, rulerModel, rulerRow };
// 책상 끝 자 튕기기(3-2 Ⅲ 소리의 성질) — 30 cm 플라스틱 자를 책상 밖으로 L cm 내밀고 책으로 눌러 고정한 뒤 끝을 튕긴다.
// 내민 부분이 위아래로 떨린다(떨림 크기 = 세기, 떨림 빠르기 = 높낮이 — 화면에서는 눈에 보이게 느리게). 끝에서 소리 고리가 퍼진다(간격이 넓을수록 낮은 소리).
const CM = 0.075, RW = 3 * CM, RT = 0.02, LEN = 30;
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

function rulerTexture() {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 120; const g = c.getContext('2d');
  g.fillStyle = '#f4d35e'; g.fillRect(0, 0, 1200, 120);
  g.strokeStyle = '#3a3220'; g.fillStyle = '#3a3220'; g.font = 'bold 26px Pretendard, sans-serif'; g.textAlign = 'center';
  for (let mm = 0; mm <= 300; mm++) { const x = 4 + mm * (1192 / 300), h = mm % 10 === 0 ? 40 : mm % 5 === 0 ? 28 : 16; g.lineWidth = mm % 10 === 0 ? 3 : 1.5; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); if (mm % 50 === 0) g.fillText(String(mm / 10), x, 74); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export function buildRulerDesk({ letters = true } = {}) {
  const g = new THREE.Group();
  const desk = labTable(3.4, 2.0); desk.position.x = -1.2; g.add(desk);   // 책상 오른쪽 끝 = x 0.5
  const EDGE = 0.5;
  // 자: 1 cm 마디 30개(눈금 그림을 마디마다 나눠 붙인다)
  const tex = rulerTexture(), segs = [];
  for (let i = 0; i < LEN; i++) {
    const geo = new THREE.BoxGeometry(CM * 1.002, RT, RW), uv = geo.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setX(k, (i + uv.getX(k)) / LEN);
    const m = new THREE.Mesh(geo, [0, 1, 2, 3, 4, 5].map((f) => (f === 2 ? new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45 }) : new THREE.MeshStandardMaterial({ color: 0xe8c64a, roughness: 0.45 }))));
    g.add(m); segs.push(m);
  }
  // 누르는 책(자 위, 책상 위쪽)
  const book = new THREE.Group(); g.add(book);
  const cover = new THREE.Mesh(roundedBoxGeometry(1.0, 0.16, 0.7, 0.02), new THREE.MeshStandardMaterial({ color: 0x2f6fd6, roughness: 0.6 })); cover.position.y = 0.08; book.add(cover);
  const pages = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.12, 0.66), new THREE.MeshStandardMaterial({ color: 0xf7f3e8, roughness: 0.9 })); pages.position.set(0.03, 0.08, 0); book.add(pages);
  book.position.set(EDGE - 0.62, RT, 0);
  // 소리 고리(끝에서 퍼짐)
  const rings = Array.from({ length: 6 }, () => { const r = new THREE.Mesh(new THREE.RingGeometry(0.95, 1, 48), new THREE.MeshBasicMaterial({ color: 0x2456c4, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); g.add(r); return r; });
  const tags = [];
  if (letters) { const t = label('책상 끝', { size: 0.14 }); t.position.set(EDGE, -0.25, 0.45); g.add(t); tags.push(t); }
  const S = { len: 10, strength: '세게', p: 0, t: 0, hold: 0, on: false };
  const draw = () => {
    const m = rulerModel(S.len, S.strength), x0 = EDGE - (LEN - S.len) * CM;   // 자의 왼쪽 끝
    // 떨림: 튕긴 뒤 줄어든다(잡으면 바로 멈춤). 화면 떨림 빠르기는 눈에 보이게 느리게 한 값
    const env = S.on ? Math.exp(-S.p * 2.2) * (1 - S.hold) : 0, A = 0.28 * m.amp * env * Math.sin(2 * Math.PI * m.speed * S.p * 2.4);
    segs.forEach((s, i) => {
      const xa = x0 + i * CM, xm = xa + CM / 2, u = Math.max(0, (xm - EDGE) / (S.len * CM));   // 0(책상 끝) ~ 1(자 끝)
      const y = A * u * u, slope = A * 2 * u / (S.len * CM);
      s.position.set(xm, RT / 2 + y, 0); s.rotation.z = u > 0 ? Math.atan(slope) : 0;
    });
    // 소리 고리: 간격(퍼지는 빠르기와 반대로 나오는 간격)은 높낮이, 진하기는 세기
    const tip = new THREE.Vector3(EDGE + S.len * CM, RT, 0), every = 1 / (m.speed * 0.9);
    rings.forEach((r, k) => { const age = S.on ? ((S.p * 2.4 + k * every) % (rings.length * every)) : 0, rad = 0.05 + age * 0.55;
      r.position.copy(tip); r.position.x += 0.02; r.lookAt(tip.x + 3, tip.y + 2, tip.z + 6); r.scale.setScalar(rad);
      r.material.opacity = S.on ? env * (0.25 + 0.55 * m.amp) * Math.max(0, 1 - age / (rings.length * every)) : 0; });
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, segs, book, rings, tags, EDGE };
  return g;
}

export default {
  view: { theta: 0.35, phi: 1.0 }, revealAt: 2,
  frame: [[-0.5, -0.2, -0.45], [1.8, 0.55, 0.45]],
  build(kit, world) { world.add('desk', buildRulerDesk()); return {}; },
  beats: [
    { text: '30 cm 플라스틱 자를 책상 끝 밖으로 내밀고, 책으로 눌러 고정했어요. 자 끝을 튕기면 소리가 나요.', show: ['desk'], dur: 7,
      reset(o) { o.desk.userData.set({ len: 10, strength: '세게', on: false, p: 0, hold: 0 }); },
      anim(p, o) { o.desk.userData.set({ t: p * 7 }); } },
    { text: '자를 더 길게 내밀고 튕기면 소리가 어떻게 달라질까요? 소리가 날 때 자는 어떻게 움직일까요? 먼저 예상해요.', show: ['desk'], dur: 6,
      anim(p, o) { o.desk.userData.set({ t: 7 + p * 6 }); } },
    { text: '튕긴 자는 위아래로 떨리며 소리를 내요. 손으로 잡아 떨림을 멈추면 소리도 멈춰요.', show: ['desk'], dur: 7,
      reset(o) { o.desk.userData.set({ len: 10, strength: '세게', on: true, p: 0, hold: 0 }); },
      anim(p, o) { o.desk.userData.set({ on: true, p: p * 1.2, hold: smooth(0.7, 0.8, p) }); } },
    { text: '짧게 내밀면 빨리 떨려 높은 소리, 길게 내밀면 천천히 떨려 낮은 소리가 나요. 세게 튕기면 크게 떨려 큰 소리가 나요.', show: ['desk'], dur: 9,
      reset(o) { o.desk.userData.set({ len: 5, strength: '세게', on: true, p: 0, hold: 0 }); },
      anim(p, o) { const L = p < 0.5 ? 5 : 15; o.desk.userData.set({ len: L, on: true, p: (p % 0.5) * 1.6, hold: 0 }); } },
  ],
};
