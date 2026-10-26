// 자연관찰 연습 표본 — 「건물 돌과 바위 — 같은 암석일까?」(중등, 대회 날 현장 관찰).
// 원장이 준 중등 최우수 보고서의 과제 꼴: 옛 궁궐에서 「사람이 자연을 이용한 사례」를 찾아, 건물(기단·계단) 돌과 그 아래 드러난 바위(지반)가 같은 암석인지
// 표본과 견주어 ○/×로 기록하고, 둘이 맞닿은 면을 보고, 그렇게 지은 원리를 추정한다(글은 옮기지 않고 과제 꼴만 따랐다).
// 표본 4종(암석 표본 상자): ① 화강암(굵은 알갱이 — 반투명 회색·흰색·검은 조각) ② 현무암(검은 회색, 알갱이 안 보임, 구멍) ③ 편마암(밝고 어두운 띠가 휘어진 줄무늬) ④ 사암(모래 알갱이·층).
// 장소: A = 드러난 바위(지반) — 대부분 화강암, 한쪽에 줄무늬 바위(편마암) / B = 궁궐 기단·계단 — 다듬은 화강암 돌. 어느 돌이 어느 표본과 같은지는 그림으로만 보이고 아이가 판단한다.
// 손 확인: 돋보기(10배) · 못으로 긁기(석영은 안 긁힘) · 물 떨어뜨리기(사암은 스며듦) · 돌려 보기. 모형은 코드로 만든 것이다.
import { THREE, mat, glossMat, label, clamp01, ease } from './_kit.js';
import { canvasTex, soilTex, rng, hex } from './_organic.js';

const DISH_R = 2.1, DISH_H = 0.12, TOP = DISH_H;
// 어디에 어떤 암석이 보이는가 — 장면의 돌 질감과 같다(예시 보고서 표가 이 값을 쓴다)
export const FOUND = {
  granite: { bed: '○', base: '○', step: '○' },
  basalt: { bed: '×', base: '×', step: '×' },
  gneiss: { bed: '○(한쪽 줄무늬 바위)', base: '×', step: '×' },
  sandstone: { bed: '×', base: '×', step: '×' },
};
export const PLACES = { A: { id: 'A', name: '장소 A', where: '드러난 바위(지반)' }, B: { id: 'B', name: '장소 B', where: '궁궐 기단·계단' } };
export const PLACE_LIST = [PLACES.A, PLACES.B];

// ── 암석 질감(캔버스). z = 확대 배율(돋보기 카드는 같은 무늬를 크게) ──
const poly = (c, x, y, r, R) => { const n = 5 + Math.floor(R() * 3); c.beginPath(); for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + R() * 0.5, rr = r * (0.6 + R() * 0.5); i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); };
const DRAW = {
  granite: (c, w, h, z = 1, seed = 3) => {
    const R = rng(seed); c.fillStyle = '#cfc9c0'; c.fillRect(0, 0, w, h);
    const n = Math.round((w * h) / (520 * z * z));
    for (let i = 0; i < n; i++) { const k = R(); c.fillStyle = k < 0.45 ? (R() < 0.6 ? '#efe8de' : '#e7d2c6') : k < 0.8 ? `rgba(160,160,156,${0.75 + R() * 0.2})` : '#1f1e1c'; poly(c, R() * w, R() * h, (k < 0.8 ? 7 + R() * 9 : 3 + R() * 5) * z, R); }
    for (let i = 0; i < n * 0.08; i++) { c.fillStyle = 'rgba(255,255,255,0.55)'; poly(c, R() * w, R() * h, 1.5 * z, R); }
  },
  basalt: (c, w, h, z = 1, seed = 5) => {
    const R = rng(seed); c.fillStyle = '#3d3c3a'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < (w * h) / (30 * z * z); i++) { c.fillStyle = R() < 0.5 ? 'rgba(0,0,0,0.25)' : 'rgba(120,118,112,0.25)'; c.fillRect(R() * w, R() * h, 1.5 * z, 1.5 * z); }
    for (let i = 0; i < (w * h) / (2600 * z * z); i++) { const x = R() * w, y = R() * h, r = (2 + R() * 7) * z; c.fillStyle = '#5c5a56'; c.beginPath(); c.ellipse(x, y, r * 1.25, r, R() * 3, 0, Math.PI * 2); c.fill(); c.fillStyle = '#121110'; c.beginPath(); c.ellipse(x, y, r, r * 0.8, R() * 3, 0, Math.PI * 2); c.fill(); }
  },
  gneiss: (c, w, h, z = 1, seed = 7) => {
    const R = rng(seed); c.fillStyle = '#d6cfc2'; c.fillRect(0, 0, w, h);
    let y0 = -20; const bands = []; while (y0 < h + 40) { const t = (14 + R() * 26) * z; bands.push([y0, t, bands.length % 2]); y0 += t; }
    for (const [y, t, dark] of bands) { c.fillStyle = dark ? '#3b3936' : '#dcd5c8'; c.beginPath(); for (let x = 0; x <= w; x += 8) c.lineTo(x, y + 16 * z * Math.sin(x / (90 * z) + y / 60)); for (let x = w; x >= 0; x -= 8) c.lineTo(x, y + t + 16 * z * Math.sin(x / (90 * z) + (y + t) / 60)); c.closePath(); c.fill(); }
    for (let i = 0; i < (w * h) / (60 * z * z); i++) { c.fillStyle = R() < 0.5 ? 'rgba(255,255,255,0.35)' : 'rgba(20,20,20,0.35)'; c.fillRect(R() * w, R() * h, 2 * z, 1.3 * z); }
  },
  sandstone: (c, w, h, z = 1, seed = 9) => {
    const R = rng(seed); c.fillStyle = '#c9a67a'; c.fillRect(0, 0, w, h);
    for (let y = 10; y < h; y += (18 + R() * 20) * z) { c.fillStyle = 'rgba(150,110,70,0.22)'; c.fillRect(0, y, w, 3 * z); }
    for (let i = 0; i < (w * h) / (14 * z * z); i++) { const k = R(); c.fillStyle = k < 0.4 ? '#d8b98e' : k < 0.75 ? '#b8935f' : '#e8d4b2'; c.beginPath(); c.arc(R() * w, R() * h, (1 + R() * 1.4) * z, 0, Math.PI * 2); c.fill(); }
  },
};
const rockTex = (kind, rep = 1) => { const t = canvasTex('rock:' + kind + ':' + rep, 1024, 512, (c, w, h) => DRAW[kind](c, w, h, 1), { repeat: true }); return t; };
const ROUGH = { granite: 0.62, basalt: 0.88, gneiss: 0.6, sandstone: 0.96 };
// 울퉁불퉁한 돌덩이: 구를 정해진 물결로 부풀리고 밑면은 평평하게(접시에 앉게)
function rockGeo(seed, sx, sy, sz, flat = -0.55) {
  const geo = new THREE.IcosahedronGeometry(1, 5), pos = geo.attributes.position, R = rng(seed), terms = Array.from({ length: 7 }, () => [new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).normalize(), 1.5 + R() * 4, R() * 6, 0.03 + R() * 0.07]), v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).normalize(); let n = 0; for (const [d, f, p, a] of terms) n += a * Math.sin(f * v.dot(d) * 3 + p); v.multiplyScalar(1 + n); if (v.y < flat) v.y = flat + (v.y - flat) * 0.08; pos.setXYZ(i, v.x * sx, v.y * sy, v.z * sz); }
  geo.computeVertexNormals(); return geo;
}
const rockMesh = (kind, seed, sx, sy, sz) => { const m = new THREE.Mesh(rockGeo(seed, sx, sy, sz), new THREE.MeshStandardMaterial({ map: rockTex(kind), roughness: ROUGH[kind] })); m.castShadow = true; m.receiveShadow = true; return m; };

const SPECS = [
  { id: 'granite', no: '①', name: '화강암', hint: '밝은 바탕에 알갱이 세 가지가 섞인 돌', cm: 8, seed: 11, size: [1.15, 0.85, 0.95],
    think: ['알갱이가 맨눈에 보이나요? 몇 가지 색인가요?', '못으로 긁었을 때 긁히는 알갱이와 안 긁히는 알갱이가 있나요?', '건물 돌과 지반 바위 중 어느 것과 닮았나요?'],
    notes: { loupe: '알갱이가 맨눈에도 보일 만큼 굵어요. 반투명한 회색, 흰색·연분홍, 까맣고 얇게 반짝이는 조각 — 세 가지가 섞여 있어요.', scratch: '반투명한 회색 알갱이는 못으로 긁어도 자국이 안 나고, 오히려 못의 쇠가 묻어나요. 까만 조각은 얇게 벗겨져요.', water: '물방울이 스며들지 않고 동그랗게 맺혀 있어요.' } },
  { id: 'basalt', no: '②', name: '현무암', hint: '검은 회색에 구멍이 많은 돌', cm: 8, seed: 13, size: [1.1, 0.8, 1.0],
    think: ['알갱이가 보이나요? 돋보기로 보면요?', '구멍은 어떻게 생겼을까요? 크기가 고른가요?', '같은 크기의 ①과 들어 보면 어느 쪽이 무거울까요?'],
    notes: { loupe: '알갱이가 너무 작아 돋보기로도 잘 안 보여요. 크고 작은 구멍이 많아요 — 녹은 돌 속의 기체가 빠져나간 자리로 알려져 있어요.', scratch: '단단해서 못 자국이 거의 나지 않아요.', water: '겉에서는 맺히지만 구멍 속으로 조금 들어가요.' } },
  { id: 'gneiss', no: '③', name: '편마암', hint: '밝고 어두운 띠가 줄무늬를 이룬 돌', cm: 8, seed: 17, size: [1.2, 0.75, 0.9],
    think: ['띠는 곧은가요, 휘어 있나요?', '밝은 띠와 어두운 띠의 알갱이를 비교해 보세요.', '①과 같은 점과 다른 점은 무엇인가요?'],
    notes: { loupe: '밝은 띠와 어두운 띠가 번갈아 줄무늬를 이루고, 띠가 물결처럼 휘어 있어요. 띠 안에도 알갱이가 보여요.', scratch: '밝은 띠는 잘 안 긁히고, 어두운 띠의 반짝이는 조각은 잘 긁혀요.', water: '물방울이 스며들지 않아요.' } },
  { id: 'sandstone', no: '④', name: '사암', hint: '모래 빛깔에 얇은 층이 보이는 돌', cm: 8, seed: 19, size: [1.15, 0.7, 0.95],
    think: ['손가락으로 문지르면 무엇이 묻어나나요?', '얇은 층(결)이 보이나요? 어느 방향인가요?', '물을 떨어뜨리면 ①과 어떻게 다른가요?'],
    notes: { loupe: '둥근 모래 알갱이가 서로 붙어 있어요. 알갱이 크기가 고르고, 얇은 층(결)이 보여요.', scratch: '모래가 부스러져 떨어지고 홈이 파여요.', water: '물방울이 금방 스며들고 그 자리가 짙어져요.' } },
];
export const SPECIMENS = SPECS.map((s) => () => s);
export const VIEWS = { angle: { theta: 0.55, phi: 1.0, name: '비스듬히' }, top: { theta: 0.15, phi: 0.3, name: '위에서 본 모습' }, side: { theta: 0, phi: 1.45, name: '옆에서 본 모습' } };
export const TOOLS = [{ id: 'loupe', name: '🔍 돋보기(10배)' }, { id: 'ruler', name: '📏 자 대기' }];

function circleCard(title, draw) {
  const g = new THREE.Group(), t = canvasTex('rockcard:' + title, 512, 512, (c, w, h) => { c.save(); c.beginPath(); c.arc(w / 2, h / 2, w / 2 - 4, 0, Math.PI * 2); c.clip(); draw(c, w, h); c.restore(); });
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.95, 64), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); g.add(disc);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.05, 10, 64), glossMat(0x222222)); g.add(ring);
  const lb = label(title, { size: 0.24 }); lb.position.set(0, 1.25, 0.02); g.add(lb); g.traverse((o) => { o.userData.noFrame = true; }); return g;
}
function card(key, draw) {
  const t = canvasTex('rockcard2:' + key, 384, 448, (c, w, h) => { c.fillStyle = '#fffaf0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a7a60'; c.lineWidth = 3; c.strokeRect(2, 2, w - 4, h - 4); draw(c, w, h); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.87), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); m.userData.noFrame = true; return m;
}
// 맞닿은 면 그림: B = 건물 돌 아랫면이 울퉁불퉁한 바위 윗면에 꼭 맞게 깎여 있다 / A = 바위의 갈라진 틈(절리)과 흙
function contactCard(place) {
  return card('contact:' + place, (c, w, h) => {
    c.fillStyle = '#2b2b2b'; c.font = '700 22px Pretendard, sans-serif'; c.textAlign = 'center'; c.fillText(place === 'B' ? '건물 돌과 바위가 맞닿은 면' : '드러난 바위의 옆면', w / 2, 38);
    const surf = (x) => 250 + 22 * Math.sin(x / 34) + 12 * Math.sin(x / 13 + 1);
    const fill = (kind, path) => { c.save(); path(); c.clip(); DRAW[kind](c, w, h, 1.6, kind === 'granite' ? 31 : 37); c.restore(); };
    if (place === 'B') {
      fill('granite', () => { c.beginPath(); c.moveTo(20, h - 20); for (let x = 20; x <= w - 20; x += 4) c.lineTo(x, surf(x)); c.lineTo(w - 20, h - 20); c.closePath(); });
      fill('granite', () => { c.beginPath(); c.moveTo(60, 80); c.lineTo(w - 60, 80); for (let x = w - 60; x >= 60; x -= 4) c.lineTo(x, surf(x) - 3); c.closePath(); });
      c.strokeStyle = '#2b2b2b'; c.lineWidth = 3; c.strokeRect(60, 80, w - 120, 1); c.beginPath(); c.moveTo(60, 80); c.lineTo(60, surf(60) - 3); c.moveTo(w - 60, 80); c.lineTo(w - 60, surf(w - 60) - 3); c.stroke();
      c.lineWidth = 2; c.beginPath(); for (let x = 20; x <= w - 20; x += 4) x === 20 ? c.moveTo(x, surf(x)) : c.lineTo(x, surf(x)); c.stroke();
      c.fillStyle = 'rgba(255,250,240,0.9)'; c.fillRect(w / 2 - 50, 140, 100, 30); c.fillRect(w / 2 - 50, 340, 100, 30); c.fillStyle = '#2b2b2b'; c.font = '700 19px Pretendard, sans-serif'; c.fillText('건물 돌', w / 2, 162); c.fillText('지반 바위', w / 2, 362);
    } else {
      c.fillStyle = '#7a6046'; c.fillRect(20, 330, w - 40, h - 350);
      fill('granite', () => { c.beginPath(); c.moveTo(40, 340); c.lineTo(60, 110); c.lineTo(w - 70, 90); c.lineTo(w - 40, 340); c.closePath(); });
      c.strokeStyle = '#1e1e1e'; c.lineWidth = 3; c.beginPath(); c.moveTo(140, 100); c.lineTo(160, 220); c.lineTo(150, 338); c.moveTo(60, 200); c.lineTo(w - 50, 230); c.stroke();
      c.fillStyle = 'rgba(255,250,240,0.9)'; c.fillRect(w - 150, 120, 110, 30); c.fillStyle = '#2b2b2b'; c.font = '700 18px Pretendard, sans-serif'; c.fillText('갈라진 틈', w - 95, 141);
    }
  });
}
function closeCard(place) {
  return circleCard(place === 'B' ? '기단 돌 표면(돋보기)' : '지반 바위 표면(돋보기)', (c, w, h) => {
    DRAW.granite(c, w, h, 3.2, place === 'B' ? 41 : 43);
    if (place === 'B') { c.strokeStyle = 'rgba(60,55,50,0.55)'; c.lineWidth = 3; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(40 + i * 50, 30); c.lineTo(10 + i * 50, h - 30); c.stroke(); } }
  });
}
function habitat(place) {
  const g = new THREE.Group(), R = rng(place === 'A' ? 21 : 22);
  const st = soilTex('rock-ground:' + place, place === 'A' ? '#6f5a42' : '#9b8a72', 4); st.repeat.set(5, 5);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(5.2, 48), new THREE.MeshStandardMaterial({ map: st, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; g.add(ground);
  if (place === 'A') {
    [[-3.3, -1.6, 2.0, 1.3, 1.6, 'granite'], [3.0, -2.4, 2.3, 1.5, 1.7, 'granite'], [-0.4, -3.8, 1.8, 1.0, 1.2, 'granite'], [3.6, 1.6, 1.3, 0.9, 1.1, 'gneiss']].forEach(([x, z, sx, sy, sz, k], i) => { const m = rockMesh(k, 50 + i, sx, sy, sz); m.position.set(x, sy * 0.45, z); m.rotation.y = R() * 3; g.add(m); });
    const tag = label('줄무늬 바위', { size: 0.24 }); tag.position.set(3.6, 1.8, 1.6); g.add(tag);
  } else {
    // 기단: 다듬은 돌 두 줄 + 계단 셋. 맨 아래 줄은 울퉁불퉁한 지반 바위 위에 놓여 있다
    const blk = (w, h, d) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ map: rockTex('granite'), roughness: 0.6 })); m.castShadow = true; m.receiveShadow = true; return m; };
    const bed = rockMesh('granite', 61, 4.6, 0.55, 1.4); bed.position.set(0, 0.12, -3.2); g.add(bed);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const b = blk(1.45, 0.62, 0.9); b.position.set(-3.6 + i * 1.47 + (r ? 0.7 : 0), 0.62 + r * 0.64, -3.1); g.add(b); }
    for (let k = 0; k < 3; k++) { const s = blk(2.2, 0.3, 0.55); s.position.set(3.6, 0.15 + k * 0.3, -1.2 - k * 0.55); g.add(s); }
    const pillarBase = blk(0.9, 0.35, 0.9); pillarBase.position.set(-1.6, 1.62, -3.1); g.add(pillarBase);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 2.6, 18), mat(0x8a3a2a)); pillar.position.set(-1.6, 3.1, -3.1); pillar.castShadow = true; g.add(pillar);
    const t1 = label('기단', { size: 0.24 }); t1.position.set(-3.4, 2.0, -2.5); const t2 = label('계단', { size: 0.24 }); t2.position.set(3.6, 1.3, -0.8); g.add(t1, t2);
  }
  const tag = label(`${PLACES[place].name} · ${PLACES[place].where}`, { size: 0.3 }); tag.position.set(-DISH_R - 0.3, TOP + 0.9, 0.6); g.add(tag);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(DISH_R, DISH_R * 0.92, DISH_H, 48), glossMat(0xfafafa, { roughness: 0.25 })); dish.position.y = DISH_H / 2; dish.receiveShadow = true; g.add(dish);
  g.traverse((o) => { o.userData.noFrame = true; });
  const at = (m, x, y, z) => { m.position.set(x, y, z); m.scale.setScalar(0.85); m.visible = false; g.add(m); return m; };
  g.userData = { close: at(closeCard(place), 1.1, 1.3, 1.4), contact: at(contactCard(place), 1.1, 1.3, 1.4) };
  return g;
}

// 자(cm): 접시 앞쪽에 가로로
function ruler(cmPerUnit, cm) {
  const len = cm / cmPerUnit, cv = document.createElement('canvas'); cv.width = 1024; cv.height = 96; const c = cv.getContext('2d');
  c.fillStyle = '#f3e7b8'; c.fillRect(0, 0, 1024, 96); c.fillStyle = '#1f2a37'; c.font = '700 26px Pretendard, sans-serif'; c.textAlign = 'center';
  const steps = cm * 10; for (let i = 0; i <= steps; i++) { const x = 8 + (i / steps) * 1008, hh = i % 10 === 0 ? 46 : i % 5 === 0 ? 30 : 18; c.fillRect(x - 1, 0, 2, hh); if (i % 10 === 0) c.fillText(String(i / 10), x, 82); }
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.02, len * 96 / 1024), [mat(0xe6d79c), mat(0xe6d79c), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }), mat(0xe6d79c), mat(0xe6d79c), mat(0xe6d79c)]);
  m.userData.noFrame = true; return m;
}

export function mountSpecimen(stage, make) {
  stage.clear();
  const spec = make(), base = new THREE.Group(); stage.root.add(base);
  let hab = null, placeId = 'A';
  const setPlace = (id) => { if (hab) { base.remove(hab); hab.traverse((o) => { o.geometry?.dispose?.(); }); } placeId = id; hab = habitat(id); base.add(hab); stage._needFit = true; };
  setPlace(placeId);
  const rock = rockMesh(spec.id, spec.seed, ...spec.size), hold = new THREE.Group(); hold.add(rock); base.add(hold);
  const bb = new THREE.Box3().setFromObject(rock), lift = TOP - bb.min.y, topY = bb.max.y + lift; rock.position.y = lift;
  const rl = ruler(spec.cm / (bb.max.x - bb.min.x), spec.cm + 2); rl.position.set(0, TOP + 0.02, bb.max.z + 0.35); rl.visible = false; base.add(rl);
  const lp = circleCard('🔍 돋보기 10배', (c, w, h) => DRAW[spec.id](c, w, h, 3.2, 71)); lp.position.set(-1.25, 1.35, 1.3); lp.visible = false; base.add(lp);
  // 못(긁기)·물방울·젖은 자리·흘린 모래·긁힌 자국
  const nail = new THREE.Group(); nail.add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.1, 10), glossMat(0x9aa0a6, { roughness: 0.3, metalness: 0.8 })), Object.assign(new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 10), glossMat(0x9aa0a6, { metalness: 0.8 })), { position: new THREE.Vector3(0, -0.62, 0), rotation: new THREE.Euler(Math.PI, 0, 0) }), Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 16), glossMat(0x8a9096, { metalness: 0.8 })), { position: new THREE.Vector3(0, 0.55, 0) }));
  nail.visible = false; base.add(nail);
  const mark = new THREE.Mesh(new THREE.BoxGeometry(1, 0.012, spec.id === 'sandstone' ? 0.06 : 0.025), mat(spec.id === 'sandstone' ? 0x8a6a40 : spec.id === 'granite' ? 0x6b7076 : 0x9a9a96)); mark.visible = false; base.add(mark);
  const sand = new THREE.InstancedMesh(new THREE.SphereGeometry(0.02, 6, 4), mat(0xc9a67a), 40); sand.visible = false; base.add(sand); const so = new THREE.Object3D(), sR = rng(5), sV = Array.from({ length: 40 }, () => [(sR() - 0.5) * 0.6, sR() * 0.4, (sR() - 0.5) * 0.3]);
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 14), new THREE.MeshPhysicalMaterial({ color: 0xdff3ff, roughness: 0.02, transmission: 0.6, transparent: true, opacity: 0.85, clearcoat: 1 })); drop.visible = false; base.add(drop);
  const wet = new THREE.Mesh(new THREE.CircleGeometry(0.3, 24), new THREE.MeshBasicMaterial({ color: 0x3a2a18, transparent: true, opacity: 0.35, depthWrite: false })); wet.rotation.x = -Math.PI / 2; wet.position.set(0, topY + 0.004, 0); wet.visible = false; base.add(wet);
  const showCard = (key) => (t) => { const h = hab.userData; for (const k of ['close', 'contact']) { h[k].visible = k === key && t > 0.06 && t < 0.98; if (h[k].visible) h[k].quaternion.copy(stage.camera.quaternion); } };
  const actions = {
    scratch: { name: '🔩 못으로 긁어 보기', dur: 4, note: spec.notes.scratch, step: (t) => {
      const on = t > 0.04 && t < 0.98, u = clamp01((t - 0.15) / 0.6); nail.visible = on; nail.position.set(-0.45 + 0.9 * u, topY + 0.6, 0); nail.rotation.z = -0.35;
      mark.visible = on && u > 0.02 && spec.id !== 'basalt'; mark.scale.x = Math.max(0.01, 0.9 * u); mark.position.set(-0.45 + 0.45 * u, topY + 0.006, 0);
      sand.visible = on && spec.id === 'sandstone'; if (sand.visible) { sV.forEach(([dx, d, dz], i) => { const k = clamp01(u * 1.3 - d), fall = k * k * 1.2; so.position.set(-0.45 + 0.9 * clamp01(d + 0.1) + dx * 0.3, Math.max(TOP + 0.02, topY - fall), dz + (k > 0.6 ? dx : 0)); so.updateMatrix(); sand.setMatrixAt(i, so.matrix); }); sand.instanceMatrix.needsUpdate = true; }
    } },
    water: { name: '💧 물 떨어뜨리기', dur: 4, note: spec.notes.water, step: (t) => {
      const on = t > 0.04 && t < 0.98, soak = spec.id === 'sandstone'; drop.visible = on; wet.visible = on && soak && t > 0.35;
      if (t < 0.35) { drop.position.set(0, topY + 1.4 - 1.31 * ease.io(t / 0.35), 0); drop.scale.setScalar(1); }
      else { const k = clamp01((t - 0.35) / 0.4); drop.position.set(0, topY + 0.07, 0); drop.scale.set(1 + 0.25 * k, (soak ? 1 - k : 1 - 0.3 * k) || 0.001, 1 + 0.25 * k); wet.scale.setScalar(0.3 + (soak ? 1.2 * k : 0)); }
    } },
    turn: { name: '🔄 돌려 보기', dur: 4, note: '뒷면과 아랫면도 같은 무늬인가요? 줄무늬나 층이 있다면 어느 방향인가요?', step: (t) => { hold.rotation.y = Math.PI * 2 * ease.io(t); hold.rotation.x = 0.5 * Math.sin(Math.PI * t); } },
    close: { name: '🔍 바위·돌 가까이 보기', dur: 6, env: true, note: '이 장소의 돌을 돋보기로 본 모습이에요. 표본 ①~④ 가운데 어느 것과 알갱이·색·무늬가 같은가요? 같으면 ○, 아니면 ×로 적어요.', step: showCard('close') },
    contact: { name: '🧱 맞닿은 면 보기', dur: 6, env: true, note: '울퉁불퉁한 바위 위에 놓인 돌의 아랫면을 보세요. 바위를 평평하게 깎았나요, 돌 아랫면을 바위 모양에 맞춰 깎았나요? (옛 건축에서 돌을 바위 모양에 맞춰 깎아 맞추는 일을 「그랭이질」이라고 불러요.)', step: showCard('contact') },
  };
  let running = null;
  const finish = () => { if (!running) return; running.a.step(1); running = null; };
  stage.update = (dt) => { if (!running) return; running.t += dt / running.a.dur; running.a.step(clamp01(running.t)); if (running.t >= 1) finish(); };
  const api = {
    spec, places: PLACE_LIST, place: () => placeId,
    actions: () => Object.entries(actions).map(([id, a]) => ({ id, name: a.name, env: !!a.env })),
    run(id) { const a = actions[id]; if (!a) return null; finish(); running = { a, t: 0 }; return a.note; },
    setView(id) { const v = VIEWS[id] || VIEWS.angle; stage.setView({ theta: v.theta, phi: v.phi, dist: 8, target: [0, 0.6, 0] }); },
    toggle(what, on) { if (what === 'ruler') rl.visible = on; if (what === 'loupe') { lp.visible = on; if (on) lp.quaternion.copy(stage.camera.quaternion); } stage._needFit = true; },
    toolNote: (what) => (what === 'loupe' ? spec.notes.loupe : ''),
    setPlace, dispose() { finish(); },
  };
  api.setView('angle');
  return api;
}
export const _specs = SPECS;
