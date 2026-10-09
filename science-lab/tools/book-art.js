// 교재 도판 렌더러 — ?shot=이름 으로 한 장을 그린다(scripts/render-book-art.mjs 가 차례로 열어 webp로 저장).
// 3D 장면과 같은 모형(행성 절차 무늬·떠오르는 태양 병)을 고해상도·고정 구도로 찍어, 교재와 실험실 그림이 같은 물체가 되게 한다.
import * as THREE from '../../world-explorer/vendor/three.module.js';
import { PLANETS, planetMesh, sunGlow } from '../scenes/solar-kit.js';
import { buildRisingSun } from '../scenes/rising-sun.js';
import { buildSnowJar, COOLS } from '../scenes/snow-jar.js';
import { labTable, labTray, beakerMesh, reagentBottle, lathe, round, fresnel, thickGlass } from '../scenes/glassware.js';
import { puffCloud } from '../scenes/_kit.js';
const OIL_R_ = () => 0.34;

const q = new URLSearchParams(location.search), shot = q.get('shot') || 'hero';
const SIZE = { hero: [1800, 820], sizes: [1800, 760], sun: [1280, 600], 'sun-row': [1500, 720], snow: [1280, 600], 'snow-row': [1500, 720], 'snow-hero': [1800, 820], 'float-row': [1500, 720] };
const [W, H] = SIZE[shot] || SIZE[shot.split('-')[0]] || [1600, 900];
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
renderer.setPixelRatio(1); renderer.setSize(W, H); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
// 반사 환경: engine.js 의 작은 사진 스튜디오와 같은 구성(유리·물의 반짝임을 3D 실험실과 같게)
function studioEnv() {
  const room = new THREE.Scene(), geo = new THREE.SphereGeometry(20, 32, 16), col = [], pos = geo.attributes.position;
  const top = new THREE.Color(0xffffff), mid = new THREE.Color(0xe9e4d9), low = new THREE.Color(0x857a69), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 20; c.copy(y > 0 ? mid.clone().lerp(top, y) : mid.clone().lerp(low, Math.min(1, -y * 1.6))); col.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); room.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  for (const [x, y, z, w, h, k] of [[9, 7, 7, 7, 9, 2.4], [-10, 5, 4, 4, 9, 1.4], [0, 15, 0, 9, 7, 1.0], [-3, 6, -12, 12, 5, 1.2], [6, -2, -8, 6, 2, 0.5]]) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.99, k * 0.96), side: THREE.DoubleSide })); p.position.set(x, y, z); p.lookAt(0, 0, 0); room.add(p);
  }
  return new THREE.PMREMGenerator(renderer).fromScene(room, 0.03).texture;
}
const env = studioEnv();
const overlay = [];   // [text, x, y, opts] — 렌더 뒤 2D로 덧쓰는 글자(Pretendard)
const callouts = [];  // { p: [x,y,z] 물체의 점, at: [px,py] 글자 자리, t, sub } — 지시선 + 글자

function stars(n, spread, seed = 1) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3); let s = seed;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * spread; pos[i * 3 + 1] = (r() - 0.5) * spread * 0.5; pos[i * 3 + 2] = -40 - r() * 20; const b = 0.5 + r() * 0.5; col.set([b, b, b * (0.9 + r() * 0.2)], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.85 }));
}
let camera;
if (shot === 'hero' || shot === 'sizes') {
  const dark = shot === 'hero';
  scene.background = dark ? null : new THREE.Color(0xf6f3ec);
  if (dark) { const c = document.createElement('canvas'); c.width = 2; c.height = 256; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#060b1e'); gr.addColorStop(1, '#15204a'); g.fillStyle = gr; g.fillRect(0, 0, 2, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t; scene.add(stars(1400, 140)); }
  const U = shot === 'hero' ? 0.16 : 0.155;                  // 지구 반지름 1 = U
  camera = new THREE.OrthographicCamera(-W / 200, W / 200, H / 200, -H / 200, 0.1, 200); camera.position.set(0, 0, 30);
  // 태양(왼쪽 가장자리에 걸친 큰 원호) — 지구의 약 109배라 화면에 다 들어가지 않는다
  const SUN_R = shot === 'hero' ? 9.5 : 7.2, sunX = -W / 200 - SUN_R + (shot === 'hero' ? 2.0 : 1.35);
  const sun = planetMesh('sun', SUN_R, { seg: 128, texW: 1024 }); sun.position.set(sunX, shot === 'hero' ? -0.6 : 0, -2); scene.add(sun);
  if (dark) { const glow = sunGlow(SUN_R); glow.position.copy(sun.position); scene.add(glow); }
  const light = new THREE.PointLight(0xfff1dc, dark ? 900 : 0, 0, 1.4); light.position.set(sunX + SUN_R * 0.2, 0, 6); scene.add(light);
  if (!dark) { scene.add(new THREE.AmbientLight(0xffffff, 0.55)); const d = new THREE.DirectionalLight(0xffffff, 2.2); d.position.set(-4, 3, 6); scene.add(d); }
  else { scene.add(new THREE.AmbientLight(0x8a98d0, 0.42)); const rim = new THREE.DirectionalLight(0x6f86d8, 0.6); rim.position.set(6, 2, 4); scene.add(rim); }
  // 행성: 크기는 원본 표 비율 그대로, 간격은 화면에 맞춰(거리 비율은 아님). 화면 폭에 맞도록 지구 반지름 U를 줄인다
  const x0 = sunX + SUN_R + 0.55, x1 = W / 200 - 0.35, y0 = shot === 'hero' ? -0.25 : 0.25;
  const span = (u) => PLANETS.reduce((a, p) => a + 2 * Math.max(p.r * u, 0.12) * (p.id === 'saturn' ? 2.25 : 1) + (p.r > 3 ? 0.34 : 0.26), 0);
  let Uf = U; while (span(Uf) > x1 - x0 && Uf > 0.05) Uf *= 0.97;
  const gapK = (x1 - x0 - span(Uf) + PLANETS.length * 0.3) / (PLANETS.length * 0.3);   // 남는 자리는 간격에 고르게
  let x = x0;
  for (const p of PLANETS) {
    const r = p.r * Uf, half = Math.max(r, 0.12) * (p.id === 'saturn' ? 2.25 : 1), m = planetMesh(p.id, r, { texW: p.r > 3 ? 1024 : 512 }); x += half;
    m.position.set(x, y0, 0); m.userData.ball.rotation.y = 0.6; scene.add(m);
    // 작은 안쪽 행성 넷은 이름이 겹치지 않게 아래·위로 번갈아 단다
    const up = p.r < 3 && PLANETS.indexOf(p) % 2 === 1, rr = Math.max(r, 0.18), fs = dark ? 40 : 34;
    const ny = up ? y0 + rr + (shot === 'sizes' ? 0.78 : 0.42) : y0 - rr - (dark ? 0.42 : 0.36);
    overlay.push([p.ko, x, ny, { size: fs, color: dark ? '#e8eefc' : '#1f2a44', bold: true }]);
    if (shot === 'sizes') overlay.push([String(p.r), x, ny - 0.4, { size: 32, color: '#c2581c', bold: true }]);
    x += half + (p.r > 3 ? 0.34 : 0.26) * Math.min(1.6, gapK);
  }
  overlay.push(shot === 'hero' ? ['태양', sunX + SUN_R - 0.95, -3.35, { size: 48, color: '#fff1d6', bold: true }] : ['태양 — 지구 반지름의 약 109배', -W / 200 + 0.22, -3.45, { size: 34, color: '#7a3410', bold: true, align: 'left' }]);
  if (shot === 'sizes') overlay.push(['지구의 반지름을 1로 볼 때 · 크기만 비율대로, 간격은 실제 거리와 달라요', 0.9, 3.25, { size: 32, color: '#5b6577' }]);
} else if (shot === 'float-row' || shot === 'snow-cup') {
  scene.background = new THREE.Color(0xf5f1e8); scene.environment = env; scene.environmentIntensity = 0.55;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe7dccb, 0.9)); const d = new THREE.DirectionalLight(0xffffff, 2.4); d.position.set(3, 6, 5); scene.add(d);
  const table = labTable(); table.scale.set(5, 1, 4); scene.add(table);
  if (shot === 'float-row') {
    // 진하기가 다른 소금물 세 컵 + 같은 방울토마토(진할수록 높이 뜬다)
    const tomato = () => { const t = new THREE.Group(); t.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 48, 32), new THREE.MeshPhysicalMaterial({ color: 0xd8261a, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 })));
      for (let k = 0; k < 5; k++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 6), new THREE.MeshStandardMaterial({ color: 0x3f7d2a, roughness: 0.7 })); const a = k / 5 * Math.PI * 2; leaf.position.set(Math.cos(a) * 0.06, 0.2, Math.sin(a) * 0.06); leaf.rotation.set(Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3); t.add(leaf); }
      return t; };
    [['물', '가라앉아요', 0x0, 0.23], ['조금 진한 소금물', '가운데쯤 떠요', 0xdbe9f3, 0.62], ['아주 진한 소금물', '물 위로 떠올라요', 0xcfe0ee, 1.06]].forEach(([n, sub, tint, y], i) => {
      const x = (i - 1) * 2.35, bk = beakerMesh({ r: 0.62, h: 1.4, water: 1.12, tint: tint || 0xbfe0f7 }); bk.position.x = x; scene.add(bk);
      const tm = tomato(); tm.position.set(x, y, 0.05); tm.rotation.set(0.2, i, 0.15); scene.add(tm);
      overlay.push([n, x, -0.42, { size: 40, color: '#1f2a44', bold: true }], [sub, x, -0.82, { size: 32, color: '#2b5fa8', bold: true }]); });
    camera = new THREE.PerspectiveCamera(22, W / H, 0.1, 100); camera.position.set(0, 2.1, 10.4); camera.lookAt(0, 0.5, 0);
  } else {
    // 종이컵의 뜨거운 물에 염화암모늄을 녹이는 장면
    const tray = labTray(); scene.add(tray);
    const paper = new THREE.MeshStandardMaterial({ color: 0xfbfaf6, roughness: 0.85, side: THREE.DoubleSide });
    const cup = new THREE.Mesh(lathe(round([[0, 0.02], [0.42, 0.02, 0.03], [0.58, 1.25], [0.6, 1.28]]), 64), paper); scene.add(cup);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.535, 0.49, 0.3, 64, 1, true), new THREE.MeshStandardMaterial({ color: 0x2b5fa8, roughness: 0.7, side: THREE.DoubleSide })); band.position.y = 0.72; scene.add(band);
    const water = new THREE.Mesh(new THREE.CircleGeometry(0.455, 48), fresnel(new THREE.MeshPhysicalMaterial({ color: 0xf2efe6, roughness: 0.05, transparent: true, opacity: 0.85, clearcoat: 1 }), { edge: 0.9 })); water.rotation.x = -Math.PI / 2; water.position.y = 0.38; scene.add(water);
    for (let k = 0; k < 40; k++) { const g2 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })); const a = k * 2.4, r = Math.sqrt(k / 40) * 0.36; g2.position.set(Math.cos(a) * r, 0.39, Math.sin(a) * r); scene.add(g2); }
    const wood = new THREE.MeshStandardMaterial({ color: 0xd9b98a, roughness: 0.75 });
    for (const dx of [-0.03, 0.03]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.9, 0.05), wood); st.position.set(0.15 + dx, 0.95, 0.05); st.rotation.z = -0.32; st.rotation.x = 0.08; scene.add(st); }
    const steam = puffCloud(40, { color: 0xffffff, opacity: 1, soft: 0.85, renderOrder: 8 }); scene.add(steam); let n = 0;
    for (let i = 0; i < 18; i++) { const life = i / 18, a = i * 2.3; steam.userData.set(n++, Math.cos(a) * 0.25, 1.35 + life * 1.1, Math.sin(a) * 0.25, 0.35 + life * 0.5, 0.2 * Math.sin(life * Math.PI)); } steam.userData.commit(n);
    const powder = new THREE.Mesh(lathe(round([[0, 0.16], [0.18, 0.1, 0.06], [0.32, 0]])), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })); powder.position.set(-1.05, 0.03, 0.35); scene.add(powder);
    const sheet = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.006, 0.9), new THREE.MeshStandardMaterial({ color: 0xe9eef6, roughness: 0.6 })); sheet.position.set(-1.05, 0.028, 0.35); sheet.rotation.y = 0.5; scene.add(sheet);
    const bottle = reagentBottle('염화암모늄', 'NH₄Cl · 흰 가루', 0xd9d4c4, 0x1d4f8f, '#3346a0'); bottle.position.set(-1.3, 0, -0.9); bottle.rotation.y = 0.5; scene.add(bottle);
    camera = new THREE.PerspectiveCamera(22, W / H, 0.1, 100); camera.position.set(2.1, 2.7, 7.4); camera.lookAt(1.25, 0.8, 0);
    callouts.push({ t: '뜨거운 물 약 10 mL', p: [0.3, 0.4, 0.3], at: [700, 210], sub: '종이컵 바닥에서 1 cm쯤' }, { t: '염화암모늄을 넣고 저어요', p: [-1.05, 0.15, 0.45], at: [700, 420], sub: '더 녹지 않을 때까지' });
  }
} else if (shot.startsWith('snow')) {
  // 병 속에 내리는 눈: snow-hot(맑은 포화 용액) · snow-room(실온) · snow-ice(얼음물) · snow-reheat(다시 데우기) · snow-row(세 병 비교) · snow-hero(여는 그림)
  const dark = shot === 'snow-hero';
  scene.background = new THREE.Color(dark ? 0x1b2547 : 0xf5f1e8); scene.environment = env; scene.environmentIntensity = dark ? 0.35 : 0.55;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe7dccb, dark ? 0.5 : 0.9)); const d = new THREE.DirectionalLight(dark ? 0xdfe8ff : 0xffffff, dark ? 1.6 : 2.4); d.position.set(3, 6, 5); scene.add(d);
  if (dark) { const warm = new THREE.PointLight(0xffc98a, 30, 0, 1.6); warm.position.set(-2.5, 2.5, 3); scene.add(warm); }
  const make = (st, x = 0) => { const rig = buildSnowJar(); rig.position.x = x; scene.add(rig); rig.userData.set({ t: 5.5, ...st }); Object.values(rig.userData.names).forEach((n) => { n.visible = false; }); rig.children[0].scale.set(5, 1, 4); return rig; };
  if (shot === 'snow-row') {
    [0, 1, 2].forEach((c, i) => { const x = (i - 1) * 3.4, rig = make({ cool: c, p: 1 }, x); rig.userData.props.forEach((o) => { o.visible = false; });
      overlay.push([['그대로 60 ℃', '실온 20 ℃', '얼음물 0 ℃'][i], x, -0.55, { size: 46, color: '#1f2a44', bold: true }], [['결정 0 g', '결정 약 1.8 g', '결정 약 2.5 g'][i], x, -1.05, { size: 36, color: '#3346a0', bold: true }]); });
    camera = new THREE.PerspectiveCamera(22, W / H, 0.1, 100); camera.position.set(0, 2.6, 17.5); camera.lookAt(0, 1.2, 0);
  } else {
    const st = { 'snow-hot': { cool: 0, p: 0 }, 'snow-room': { cool: 1, p: 0.7 }, 'snow-ice': { cool: 2, p: 1 }, 'snow-reheat': { cool: 2, p: 1, reheat: 0.45 }, 'snow-hero': { cool: 2, p: 0.75 } }[shot];
    const rig = make(st, 0);
    camera = new THREE.PerspectiveCamera(22, W / H, 0.1, 100);
    if (dark) { rig.userData.props.forEach((o) => { o.visible = false; }); rig.userData.board.visible = false; rig.userData.boardFoot.visible = false; camera.position.set(-1.6, 2.4, 11.8); camera.lookAt(-2.3, 1.55, 0); }
    else { camera.position.set(3.3, 2.5, 11.2); camera.lookAt(2.05, 1.55, 0); }
    const R = 0.95, C = (t, p, py, sub) => callouts.push({ t, p, at: [700, py], sub });
    const L = {
      'snow-hot': [['염화암모늄 포화 용액', [R * 0.8, 1.5, R * 0.5], 230, '뜨거운 물 10 mL에 가득 녹였어요'], ['네임펜 그림', [R * 0.2, 1.0, R + 0.05], 420, '병 바깥에 겨울 풍경을 그려요']],
      'snow-room': [['흰 결정이 내려요', [0.3, 1.5, 0.5], 230, '실온(20 ℃)에서 식는 동안'], ['바닥에 쌓여요', [0.4, 0.2, 0.7], 420, '녹지 못한 염화암모늄']],
      'snow-ice': [['얼음물에 식히면', [1.3, 0.85, 0.7], 210, '0 ℃까지 더 차갑게'], ['눈이 더 많이 쌓여요', [0.4, 0.3, 0.75], 420, '녹을 수 있는 양이 더 줄어서']],
      'snow-reheat': [['뜨거운 물에 다시 넣으면', [1.3, 0.85, 0.7], 210, '결정이 녹아 사라져요'], ['다시 맑아져요', [0.3, 1.6, 0.5], 420, '식히면 또 눈이 내려요']],
      'snow-hero': [],
    }[shot];
    for (const [t, p, py, sub] of L) C(t, p, py, sub);
    if (dark) overlay.push(['병 속에 내리는 눈', -6.4, 2.3, { size: 66, color: '#ffffff', bold: true, align: 'left' }], ['가득 녹인 용액을 식히면 녹지 못한 만큼', -6.4, 1.75, { size: 32, color: '#c9d6ff', align: 'left' }], ['흰 결정이 되어 내려앉아요', -6.4, 1.38, { size: 32, color: '#c9d6ff', align: 'left' }]);
  }
} else {
  // 떠오르는 태양 병: sun-oil(바닥) · sun-drop(물 넣는 중) · sun-mid(가운데 태양) · sun-top(너무 많이) · sun-shake(흔들기)
  scene.background = new THREE.Color(0xf5f1e8); scene.environment = env; scene.environmentIntensity = 0.55;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe7dccb, 0.9)); const d = new THREE.DirectionalLight(0xffffff, 2.4); d.position.set(3, 6, 5); scene.add(d);
  const ST = { 'sun-start': { ml: 0, from: 0, p: 1, oilIn: 0.0001, dropper: false }, 'sun-oil': { ml: 0, from: 0, p: 1, oilIn: 1, dropper: false }, 'sun-drop': { ml: 20, from: 0, p: 0.45, t: 0.2, oilIn: 1, dropper: true },
    'sun-mid': { ml: 20, from: 20, p: 1, oilIn: 1, dropper: false }, 'sun-top': { ml: 40, from: 40, p: 1, oilIn: 1, dropper: false }, 'sun-shake': { ml: 20, from: 20, p: 1, oilIn: 1, lid: true, dropper: false, shake: 0.5, t: 0.35 } };
  const make = (st, x = 0) => { const rig = buildRisingSun(); rig.position.x = x; scene.add(rig); Object.values(rig.userData.names || {}).forEach((n) => { n.visible = false; }); rig.userData.set({ shake: 0, lid: false, t: 0, ...st }); Object.values(rig.userData.names || {}).forEach((n) => { n.visible = false; }); rig.children[0].scale.set(5, 1, 4); return rig; };
  const lvl = (ml) => 0.1 + 0.045 * (20 + ml), oilY = (ml) => { const f = [0, 0.4, 0.5, 0.8, 1][[0, 10, 20, 30, 40].indexOf(ml)]; return 0.1 + 0.34 + f * (lvl(ml) - 0.1 - 0.68); };
  if (shot === 'sun-row') {
    // 결과 비교: 물 0 · 20 · 40 mL 세 병을 나란히(같은 높이에서 찍어 덩어리 높이를 바로 비교)
    [0, 20, 40].forEach((ml, i) => { const x = (i - 1) * 3.0, rig = make({ ml, from: ml, p: 1, oilIn: 1, dropper: false }, x); rig.userData.props.forEach((o) => { o.visible = false; });
      overlay.push([`물 ${ml} mL`, x, -0.55, { size: 46, color: '#1f2a44', bold: true }], [['바닥에 가라앉음', '가운데쯤 둥글게', '수면까지 떠오름'][i], x, -1.05, { size: 36, color: '#c2581c', bold: true }]); });
    camera = new THREE.PerspectiveCamera(22, W / H, 0.1, 100); camera.position.set(0, 2.6, 15.5); camera.lookAt(0, 1.25, 0);
  } else {
    const st = ST[shot]; const rig = make(st, 0); if (shot === 'sun-start') rig.userData.oil.visible = false;
    camera = new THREE.PerspectiveCamera(22, W / H, 0.1, 100);
    if (shot === 'sun-drop') { camera.position.set(3.7, 3.0, 13.2); camera.lookAt(2.3, 2.35, 0); } else { camera.position.set(3.3, 2.5, 10.6); camera.lookAt(2.05, 1.62, 0); }
    const R = 0.95, C = (t, p, py, sub) => callouts.push({ t, p, at: [690, py], sub });
    const L = {
      'sun-start': [['에탄올 20 mL', [R * 0.7, lvl(0) * 0.6, R * 0.5], 250, '맑고 가벼운 액체']],
      'sun-oil': [['붉은 식용유', [R * 0.25, 0.25, R * 0.4], 300, '에탄올보다 무거워 바닥으로']],
      'sun-drop': [['스포이트로 물', [0.15, 3.55, 0], 150, '한 방울씩 천천히'], ['덩어리가 떠올라요', [OIL_R_(), oilY(20) * 0.75, 0.2], 390, '아래층이 무거워져서']],
      'sun-mid': [['여기서 멈춰요', [R * 0.85, lvl(20), 0.3], 190, '물을 더 넣지 않아요'], ['둥근 「태양」', [0.34, oilY(20), 0.2], 410, '물 20 mL · 눈금 5칸']],
      'sun-top': [['수면에 납작하게', [0.42, lvl(40) - 0.12, 0.2], 170, '물 40 mL · 눈금 10칸'], ['아래층은 물이 많아요', [-0.2, 0.55, 0.6], 420, '그래서 아래가 더 무거워요']],
      'sun-shake': [['뚜껑 닫고 빙글빙글', [R * 0.9, 3.25, 0.4], 170, '병을 돌리듯 흔들어요'], ['여러 방울 → 다시 모임', [0.55, oilY(20), 0.3], 400, '태양계가 생긴 생각(성운설)']],
    }[shot];
    for (const [t, p, py, sub] of L) C(t, p, py, sub);
  }
}
renderer.render(scene, camera);
// 글자 덧쓰기
const out = document.createElement('canvas'); out.width = W; out.height = H; const g = out.getContext('2d'); g.drawImage(renderer.domElement, 0, 0);
await document.fonts.load('700 26px Pretendard'); await document.fonts.load('500 24px Pretendard'); await document.fonts.load('800 54px Pretendard'); await document.fonts.load('600 38px Pretendard');
const toPx = (x, y) => { const v = new THREE.Vector3(x, y, 0).project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; };
const proj3 = (p) => { const v = new THREE.Vector3(...p).project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; };
for (const c of callouts) {
  const [px, py] = proj3(c.p), [ax, ay] = c.at;
  g.strokeStyle = '#c2581c'; g.lineWidth = 3.5; g.beginPath(); g.moveTo(px, py); g.lineTo(ax - 30, ay); g.lineTo(ax - 10, ay); g.stroke();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(px, py, 9, 0, Math.PI * 2); g.fill(); g.lineWidth = 4; g.stroke();
  g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = '#1f2a44'; g.font = '800 54px Pretendard'; g.fillText(c.t, ax, ay - (c.sub ? 20 : 0));
  if (c.sub) { g.fillStyle = '#5b6577'; g.font = '600 38px Pretendard'; g.fillText(c.sub, ax, ay + 34); }
}
for (const [t, x, y, o] of overlay) { const [px, py] = toPx(x, y); g.font = `${o.bold ? 800 : 500} ${o.size}px Pretendard`; g.fillStyle = o.color; g.textAlign = o.align || 'center'; g.textBaseline = 'middle'; g.fillText(t, px, py); }
document.body.replaceChildren(out); out.id = 'out';
window.__done = true;
