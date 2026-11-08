/* ============================================================
   수의 마법 마을 — 살아 있는 지도 (2026-11-08)
   원장: 「더 실감 나는 게임 그래픽 만들자 … 2d느낌의 3d … 동물의 숲 같이」.

   지도 그림(assets/map.jpg)과 같은 장면을 그 자리에서 3D로 그려 파도·물가 거품·물비늘·풍차·물레방아·
   나무·구름·보트·책 위 별이 움직인다. 시점은 고정이라 2D 지도처럼 보이고, 이름표·누르는 자리·걷기
   좌표(화면 %)는 하나도 바뀌지 않는다. 캔버스는 #townWorld(2000×1342) 맨 아래에 깔린다.

   ── 연결 약속 ─────────────────────────────────────────────
   import { mountTownLive } from './town-live.js';
   const ctl = await mountTownLive(worldEl, { still:boolean });   // WebGL 을 못 쓰면 null → map.jpg 가 그대로 보인다
   ctl.dispose()                                                   // 화면을 나갈 때 반드시
   ctl.renderAt(t)  ctl.report                                     // 검사용

   ── 지키는 것 ─────────────────────────────────────────────
   · 장소 자리: SPOT 은 main.js TOWN_SPOTS·TOWN_GATES 의 화면 % 와 같아야 한다(바꾸면 둘 다).
   · 모델: Polyfork 무료 로우폴리 GLB(CC BY 4.0) — assets/town3d/models, 출처 줄은 assets/town3d/CREDITS.json.
     .mjs 원본 코드는 재배포 금지라 저장소에 두지 않는다. 색 바꾸기는 여기서 정점 색을 다시 칠한다.
   · 나무·덤불·돌·극장·펼친 책·「1+2=3」 정원·물은 이 파일이 직접 그린다.
   · 성능: 그림자는 한 번만 굽고, 나무는 인스턴스로 묶고, 초당 30장, 화면에 보이는 크기만큼만 그린다.
     느리면 해상도를 줄이고, 그래도 느리면 멈춘 그림으로 둔다. 움직임 줄이기 설정이면 한 장만 그린다.
   ============================================================ */
import * as THREE from '../../world-explorer/vendor/three.module.js';
import { GLTFLoader } from '../vendor/three-addons/loaders/GLTFLoader.js';
import { mergeVertices } from '../vendor/three-addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from '../vendor/three-addons/geometries/RoundedBoxGeometry.js';
import { TextGeometry } from '../vendor/three-addons/geometries/TextGeometry.js';
import { FontLoader } from '../vendor/three-addons/loaders/FontLoader.js';

const ASSET = new URL('../assets/town3d/', import.meta.url).href;
const MAP_W = 2000, MAP_H = 1342;

/* 장소 발밑 자리(지도 % / 100). main.js TOWN_SPOTS·TOWN_GATES 와 같은 곳. */
const SPOT = {
  tower: [0.33, 0.205], tents: [0.155, 0.47], tavern: [0.49, 0.55], chapel: [0.632, 0.475],
  houses: [0.555, 0.735], mush: [0.20, 0.78], west: [0.035, 0.535], windmill: [0.865, 0.47], dock: [0.79, 0.87], sum: [0.425, 0.858]
};
/* 이름표 자리(%, 나무가 가리지 않게) — TOWN_SPOTS pos 와 관문 */
const ZONES = [[4.5, 65, 31, 15], [42, 37, 14, 21], [29.5, 4, 7, 16], [46, 60, 19, 16], [56.5, 31.5, 13.5, 19], [5, 35, 21, 15], [76, 36, 18, 18], [70, 78, 18, 12]];

/* Polyfork 색 묶음(공개 params.json 의 presets) — 기본색 → 바꿀 색 */
const COLORWAYS = {
  'mushroom-cottage-1135d1': {
    base: { grass: '#8ec45c', foliage: '#4e8a3c', stem: '#ffecb8', cap: '#d77b5f', trim: '#faf3e2', brick: '#f0d2a6', door: '#d9ae80', hardware: '#6e3a26', pane: '#8c9299', petal: '#e0613f', pollen: '#f0c64e' },
    blueberry: { grass: '#86be62', foliage: '#4a8440', stem: '#fbebc0', cap: '#7c7fc0', trim: '#f3ecdc', brick: '#e6e2f2', door: '#a9855f', hardware: '#4a3b5e', pane: '#8f97a6', petal: '#e06ba8', pollen: '#f3d06a' },
    amanita: { grass: '#7fb554', foliage: '#46803a', stem: '#ffefc2', cap: '#c2422f', trim: '#f7f0dd', brick: '#f2e3cc', door: '#a8703f', hardware: '#5b2e1e', pane: '#8a9098', petal: '#f0a93c', pollen: '#fbe08a' },
    'autumn-gold': { grass: '#a9b559', foliage: '#6e8a36', stem: '#fff0c6', cap: '#dca24b', trim: '#f6eed6', brick: '#f4deb4', door: '#a9743f', hardware: '#5e3a24', pane: '#8c9299', petal: '#d9532f', pollen: '#f2c24c' }
  },
  'canvas-wall-tent-de8a04': {
    base: { canvas: '#e5d5c4', inner: '#9b8c73', deck: '#715540', frame: '#48372d', rope: '#77726d', metal: '#616060', jack: '#394c59', globe: '#dcaa42' },
    cream: { canvas: '#e5d5c4', inner: '#9b8c73', deck: '#906340', frame: '#653115', rope: '#c09478', metal: '#77726d', jack: '#394c59', globe: '#dcaa42' },
    'faded-orange': { canvas: '#c87738', inner: '#9c471c', deck: '#715540', frame: '#48372d', rope: '#e5d5c4', metal: '#616060', jack: '#394c59', globe: '#dcaa42' },
    'forest-olive': { canvas: '#787f44', inner: '#4c5737', deck: '#715540', frame: '#48372d', rope: '#e5d5c4', metal: '#616060', jack: '#394c59', globe: '#dcaa42' }
  },
  'windmill-3aad49': {
    base: { stone: '#e8dcc0', mortar: '#b89b72', timber: '#8c6a4a', darkTimber: '#6f4e37', iron: '#3c4550', interior: '#363f4a', moss: '#7d8a5a' },
    'red-cap': { stone: '#e8dcc0', mortar: '#8c6a4a', timber: '#6f4e37', darkTimber: '#9a3b32', iron: '#3c4550', interior: '#363f4a', moss: '#7d8a5a' }
  }
};

export function webglAvailable() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

export async function mountTownLive(world, opts = {}) {
  if (!world || !webglAvailable()) return null;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.preserve }); }
  catch (e) { return null; }
  const canvas = renderer.domElement;
  canvas.className = 'nm-town-live';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .6s';
  let disposed = false;
  const scene = new THREE.Scene();
  let raf = 0;
  const ctl = {
    report: null,
    renderAt: (t) => { animate(t); renderer.render(scene, camera); },
    dispose() {
      disposed = true; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis);
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); });
      for (const m of TOON.values()) m.dispose();
      renderer.dispose(); renderer.forceContextLoss?.(); canvas.remove();
    }
  };

  /* ---------- 공용 ---------- */
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const hash2 = (x, z) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };

  const U = { uTime: { value: 0 }, uK: { value: 0.0026 }, uD: { value: 150 } };
  const BEND = '{ float dd = max(0.0, -mvPosition.z - uD); mvPosition.y -= dd * dd * uK; gl_Position = projectionMatrix * mvPosition; }';
  const bendShader = (sh, extraV = '') => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime; uniform float uK; uniform float uD;' + extraV)
      .replace('#include <project_vertex>', '#include <project_vertex>\n' + BEND);
  };
  const GRAD = (() => { const d = new Uint8Array([105, 175, 235, 255]); const t = new THREE.DataTexture(d, 4, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
  const TOON = new Map();
  function toon(m, sway = false) {
    const key = m.uuid + (sway ? 's' : '');
    if (TOON.has(key)) return TOON.get(key);
    const t = new THREE.MeshToonMaterial({ color: m.color, vertexColors: m.vertexColors, gradientMap: GRAD, emissive: m.emissive || new THREE.Color(0), emissiveIntensity: m.emissiveIntensity ?? 1, fog: m.fog, transparent: m.transparent, opacity: m.opacity, side: m.side });
    t.onBeforeCompile = (sh) => {
      bendShader(sh);
      if (sway) sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        { vec4 wp0 = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          #ifdef USE_INSTANCING
          wp0 = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          #endif
          float ph = wp0.x * 0.37 + wp0.z * 0.23;
          transformed.x += sin(uTime * 1.6 + ph) * 0.07 * (1.0 + position.y);
          transformed.z += cos(uTime * 1.3 + ph) * 0.05 * (1.0 + position.y); }`);
    };
    TOON.set(key, t); return t;
  }

  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  {
    const c = document.createElement('canvas'); c.width = 4; c.height = 512;
    const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#5fb6f0'); gr.addColorStop(0.6, '#a9dcf7'); gr.addColorStop(1, '#e6f6fb');
    g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t;
  }
  scene.fog = new THREE.Fog(0xd8eef6, 220, 520);
  const camera = new THREE.PerspectiveCamera(32, MAP_W / MAP_H, 1, 1400);
  camera.position.set(0, 44, 100); camera.lookAt(0, 0, -26); camera.updateMatrixWorld();

  /* ---------- 화면 % → 땅 ---------- */
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function onPlane(sx, sy, y = 0) {
    ray.setFromCamera(new THREE.Vector2(sx * 2 - 1, -(sy * 2 - 1)), camera);
    plane.constant = -y; const p = new THREE.Vector3(); ray.ray.intersectPlane(plane, p); return p;
  }
  const HILL = 10; const hillC = onPlane(...SPOT.tower, HILL + 0.6);
  const lakeC = onPlane(0.87, 0.9);
  const riverPts = [onPlane(0.80, 0.16), onPlane(0.76, 0.33), onPlane(0.73, 0.52), onPlane(0.75, 0.70), lakeC.clone()];
  const segDist = (x, z, a, b) => {
    const vx = b.x - a.x, vz = b.z - a.z, wx = x - a.x, wz = z - a.z;
    const t = Math.max(0, Math.min(1, (wx * vx + wz * vz) / (vx * vx + vz * vz)));
    return Math.hypot(x - (a.x + vx * t), z - (a.z + vz * t));
  };
  const riverD = (x, z) => { let d = 1e9; for (let i = 0; i < riverPts.length - 1; i++) d = Math.min(d, segDist(x, z, riverPts[i], riverPts[i + 1])); return d; };
  const lakeE = (x, z) => ((x - lakeC.x) / 20) ** 2 + ((z - lakeC.z) / 11) ** 2;
  const pads = [];
  function rawH(x, z) {
    let h = 0.8 + 0.55 * Math.sin(x * 0.11) + 0.45 * Math.cos(z * 0.13) + 0.3 * Math.sin((x + z) * 0.07);
    const dh = Math.hypot(x - hillC.x, z - hillC.z), ang = Math.atan2(z - hillC.z, x - hillC.x);
    const r1 = 12.5 + 1.3 * Math.sin(ang * 3 + 0.7) + 0.8 * Math.cos(ang * 5), r2 = 7.0 + 0.8 * Math.sin(ang * 4 + 2);
    h += HILL * 0.5 * smooth(r1 + 0.7, r1 - 0.7, dh) + HILL * 0.5 * smooth(r2 + 0.7, r2 - 0.7, dh);
    const e1 = hillC.z - 6 + 5 * Math.sin(x * 0.045) + 3 * Math.cos(x * 0.11 + 1), e2 = hillC.z - 38 + 6 * Math.sin(x * 0.03 + 2);
    h += 4.0 * smooth(e1 + 0.8, e1 - 0.8, z) + 4.0 * smooth(e2 + 0.8, e2 - 0.8, z);
    return h;
  }
  const water = (x, z, h) => h - 3.0 * smooth(1.55, 0.6, lakeE(x, z)) - 2.4 * smooth(6.0, 1.2, riverD(x, z));
  function height(x, z) {
    let h = water(x, z, rawH(x, z));
    for (const p of pads) { const d = Math.hypot(x - p.x, z - p.z); const w = smooth(p.r + 3.5, p.r, d); h = h * (1 - w) + p.y * w; }
    return h;
  }
  function onGround(sx, sy) { let p = onPlane(sx, sy, 0); for (let i = 0; i < 10; i++) p = onPlane(sx, sy, height(p.x, p.z)); p.y = height(p.x, p.z); return p; }
  function pad(k, r) { const p = onPlane(...SPOT[k], 0); let y = rawH(p.x, p.z); for (let i = 0; i < 6; i++) { const pp = onPlane(...SPOT[k], y); y = rawH(pp.x, pp.z); p.copy(pp); } pads.push({ x: p.x, z: p.z, r, y }); }
  pads.push({ x: hillC.x, z: hillC.z, r: 3.2, y: rawH(hillC.x, hillC.z) });
  pad('tents', 9); pad('tavern', 8); pad('chapel', 6.5); pad('houses', 8); pad('mush', 12); pad('windmill', 4); pad('west', 2); pad('sum', 9);
  const POS = {}; for (const k in SPOT) POS[k] = onGround(...SPOT[k]);
  POS.tower = new THREE.Vector3(hillC.x, height(hillC.x, hillC.z), hillC.z);
  const PATHS = [['tents', 'tavern'], ['tavern', 'chapel'], ['tavern', 'houses'], ['houses', 'mush'], ['mush', 'tents'], ['west', 'tents'], ['houses', 'dock'], ['chapel', 'windmill']].map(([a, b]) => [POS[a], POS[b]]);
  const hillFoot = new THREE.Vector3(hillC.x + 6, 0, hillC.z + 17); hillFoot.y = height(hillFoot.x, hillFoot.z);
  PATHS.push([hillFoot, POS.tavern]);
  const pathD = (x, z) => { let d = 1e9; for (const [a, b] of PATHS) d = Math.min(d, segDist(x, z, a, b)); return d; };

  /* ---------- 땅 ---------- */
  {
    const X0 = -220, X1 = 220, Z0 = -320, Z1 = 70, S = opts.coarse ? 1.4 : 1.0;
    const g = new THREE.PlaneGeometry(X1 - X0, Z1 - Z0, Math.round((X1 - X0) / S), Math.round((Z1 - Z0) / S)); g.rotateX(-Math.PI / 2);
    g.translate((X0 + X1) / 2, 0, (Z0 + Z1) / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, height(p.getX(i), p.getZ(i)));
    g.computeVertexNormals();
    const n = g.attributes.normal, col = new Float32Array(p.count * 3);
    const C = s => new THREE.Color(s);
    const g1 = C('#8fd15f'), g2 = C('#77bd52'), g3 = C('#a5dc72'), dirt = C('#e0c690'), sand = C('#efe0b0'), bed = C('#cdb98a'), far = C('#7aa95a'), cliffA = C('#b8916b'), cliffB = C('#a7805c');
    const c = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      c.copy(g2).lerp(g1, 0.5 + 0.5 * Math.sin(x * 0.09 + Math.cos(z * 0.07) * 1.7)).lerp(g3, (0.5 + 0.5 * Math.cos(z * 0.11 - x * 0.04)) * 0.45);
      if (z < hillC.z - 20) c.lerp(far, Math.min(1, (hillC.z - 20 - z) / 60) * 0.5);
      const cl = smooth(0.62, 0.42, n.getY(i)); if (cl > 0) c.lerp(Math.floor(y * 1.4) % 2 === 0 ? cliffA : cliffB, cl);
      const wet = Math.min(riverD(x, z) - 4.2, (lakeE(x, z) - 1.4) * 9);
      c.lerp(sand, smooth(2.6, 0.6, wet) * smooth(0.9, -0.2, y));
      c.lerp(dirt, smooth(1.9, 0.9, pathD(x, z)) * 0.92);
      c.lerp(bed, smooth(-0.6, -1.2, y));
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true })); m.receiveShadow = true; scene.add(m);
  }
  /* ---------- 물: 얕은 청록 → 깊은 파랑, 밀려왔다 빠지는 물가 거품, 퍼지는 물결 띠, 물비늘 ---------- */
  const WL = -0.95; const waveMarks = [];
  {
    const xs = [lakeC.x - 26, ...riverPts.map(p => p.x - 8)], xe = [lakeC.x + 30, ...riverPts.map(p => p.x + 8)];
    const zs = [lakeC.z - 16, ...riverPts.map(p => p.z - 8)], ze = [lakeC.z + 40];
    const bx0 = Math.min(...xs), bx1 = Math.max(...xe), bz0 = Math.min(...zs), bz1 = Math.max(...ze);
    const step = opts.coarse ? 0.6 : 0.4;
    const wg = new THREE.PlaneGeometry(bx1 - bx0, bz1 - bz0, Math.round((bx1 - bx0) / step), Math.round((bz1 - bz0) / step));
    wg.rotateX(-Math.PI / 2); wg.translate((bx0 + bx1) / 2, WL, (bz0 + bz1) / 2);
    const wp = wg.attributes.position, dep = new Float32Array(wp.count);
    for (let i = 0; i < wp.count; i++) dep[i] = WL - height(wp.getX(i), wp.getZ(i));
    wg.setAttribute('depth', new THREE.BufferAttribute(dep, 1));
    const wmat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.18, metalness: 0 });
    wmat.userData.water = true;
    wmat.onBeforeCompile = (sh) => {
      bendShader(sh, '\nattribute float depth; varying float vDepth; varying vec3 vW;');
      sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvDepth = depth; vW = (modelMatrix * vec4(position,1.0)).xyz; transformed.y += 0.05 * sin(uTime * 1.4 + vW.x * 0.5 + vW.z * 0.35) * smoothstep(0.2, 1.2, depth);');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uTime; varying float vDepth; varying vec3 vW;\nfloat hh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }')
        .replace('#include <color_fragment>', `#include <color_fragment>
          if (vDepth < 0.0) discard;
          vec3 wc = mix(vec3(0.47, 0.90, 0.84), vec3(0.24, 0.74, 0.86), smoothstep(0.05, 0.9, vDepth));
          wc = mix(wc, vec3(0.16, 0.55, 0.85), smoothstep(0.9, 2.4, vDepth));
          float wob = 0.06 * sin(vW.x * 1.3 + vW.z * 0.7) + 0.04 * sin(vW.z * 2.1 - vW.x * 0.4);
          float wave = 0.5 + 0.5 * sin(uTime * 1.15 - (vW.x * 0.09 + vW.z * 0.07));
          float edge = 0.05 + 0.2 * wave;
          float rim = 1.0 - smoothstep(edge, edge + 0.05, vDepth + wob * 0.5);
          float ph = fract(uTime * 0.22 + vW.x * 0.01);
          float d2 = vDepth + wob - (0.18 + ph * 0.55);
          float ring = smoothstep(-0.04, 0.0, d2) * (1.0 - smoothstep(0.03, 0.07, d2)) * (1.0 - ph);
          vec2 fc = fract(vW.xz * 1.6) - 0.5; float dia = abs(fc.x) + abs(fc.y) * 2.2;
          float spark = step(0.985, hh(floor(vW.xz * 1.6) + floor(uTime * 1.5))) * (1.0 - smoothstep(0.08, 0.12, dia)) * smoothstep(0.6, 1.2, vDepth);
          wc = mix(wc, vec3(1.0), max(max(rim, ring * 0.9), spark));
          diffuseColor.rgb = wc;`);
    };
    const wm = new THREE.Mesh(wg, wmat); wm.receiveShadow = true; scene.add(wm);
    const arc = new THREE.TorusGeometry(0.9, 0.07, 6, 18, Math.PI / 2.6);
    for (let k = 0, n = 0; k < 4000 && n < 46; k++) {
      const x = bx0 + rnd() * (bx1 - bx0), z = bz0 + rnd() * (bz1 - bz0);
      if (WL - height(x, z) < 0.9) continue;
      waveMarks.push({ x, z, rz: Math.PI * 0.2 + rnd() * 0.5, s: 0.8 + rnd() * 0.6, ph: rnd() * 6.28 }); n++;
    }
    const im = new THREE.InstancedMesh(arc, new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: GRAD }), waveMarks.length);
    im.material.onBeforeCompile = sh => bendShader(sh);
    ctl._waves = im; scene.add(im);
  }
  /* ---------- 구름 ---------- */
  const SPH0 = new THREE.SphereGeometry(1, 20, 14), clouds = [];
  {
    const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.9, fog: false });
    for (const [x, y, z, sc] of [[-150, 30, -260, 8], [-60, 40, -280, 6], [60, 34, -270, 8], [190, 38, -300, 7], [-250, 40, -310, 8], [130, 50, -330, 6]]) {
      const g = new THREE.Group();
      for (const [a, b, c, r] of [[0, 0, 0, 1.3], [1.4, -0.2, 0.2, 1], [-1.4, -0.25, 0, 1.05], [0.6, 0.6, -0.2, 0.95], [-0.7, 0.5, 0.1, 0.85], [2.5, -0.45, 0, 0.7], [-2.5, -0.45, 0, 0.7]]) { const m = new THREE.Mesh(SPH0, cm); m.position.set(a, b, c); m.scale.set(r, r * 0.8, r); g.add(m); }
      g.position.set(x, y, z); g.scale.setScalar(sc); g.userData.cx = x; clouds.push(g); scene.add(g);
    }
  }
  /* ---------- 빛 ---------- */
  scene.add(new THREE.HemisphereLight(0xf0f8ff, 0x86a96a, 1.25));
  const sun = new THREE.DirectionalLight(0xfff3dc, 2.4);
  sun.position.set(-55, 90, 45); sun.target.position.set(0, 0, -10);
  sun.castShadow = true; sun.shadow.mapSize.set(opts.coarse ? 2048 : 4096, opts.coarse ? 2048 : 4096);
  Object.assign(sun.shadow.camera, { left: -120, right: 120, top: 110, bottom: -110, near: 10, far: 300 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 5;
  scene.add(sun, sun.target);

  /* ---------- 모델 ---------- */
  const loader = new GLTFLoader();
  const glbCache = new Map();
  const load = (id) => { if (!glbCache.has(id)) glbCache.set(id, loader.loadAsync(ASSET + 'models/' + id + '.glb').then(g => g.scene)); return glbCache.get(id); };
  const variantCache = new Map();
  async function model(id, colorway) {
    const key = id + ':' + (colorway || '');
    if (!variantCache.has(key)) variantCache.set(key, (async () => {
      const base = await load(id); const cw = COLORWAYS[id];
      if (!colorway || !cw || !cw[colorway]) return base;
      const tpl = base.clone(true); const from = cw.base, to = cw[colorway];
      const F = Object.keys(from).map(k => [k, new THREE.Color(from[k])]);
      // Color.sub() clamps at 0, so keep signed deltas as plain numbers.
      const D = {}; for (const k of Object.keys(to)) if (from[k] && from[k] !== to[k]) { const a = new THREE.Color(from[k]), b = new THREE.Color(to[k]); D[k] = { r: b.r - a.r, g: b.g - a.g, b: b.b - a.b }; }
      tpl.traverse(o => {
        if (!o.isMesh || !o.geometry.attributes.color) return;
        const g = o.geometry = o.geometry.clone(), c = g.attributes.color;
        for (let i = 0; i < c.count; i++) {
          const r = c.getX(i), gg = c.getY(i), b = c.getZ(i); let best = null, bd = 1e9;
          for (const [k, fc] of F) { const d = (fc.r - r) ** 2 + (fc.g - gg) ** 2 + (fc.b - b) ** 2; if (d < bd) { bd = d; best = k; } }
          const dl = D[best]; if (dl) c.setXYZ(i, Math.min(1, Math.max(0, r + dl.r)), Math.min(1, Math.max(0, gg + dl.g)), Math.min(1, Math.max(0, b + dl.b)));
        }
        c.needsUpdate = true;
      });
      return tpl;
    })());
    return (await variantCache.get(key)).clone(true);
  }
  const SOFT = new Set(['haystack-77b0dd', 'mushroom-cottage-1135d1']);
  async function put(id, colorway, at, rotDeg = 0, s = 1) {
    const o = await model(id, colorway);
    o.traverse(c => {
      if (!c.isMesh) return; c.castShadow = c.receiveShadow = true;
      if (SOFT.has(id) && !c.userData.soft) { let g = c.geometry.clone(); g.deleteAttribute('normal'); g = mergeVertices(g, 0.02); g.computeVertexNormals(); c.geometry = g; c.userData.soft = true; }
    });
    o.position.copy(at); o.rotation.y = rotDeg * Math.PI / 180; o.scale.multiplyScalar(s);
    scene.add(o); return o;
  }
  const near = (p, dx, dz) => { const x = p.x + dx, z = p.z + dz; return new THREE.Vector3(x, height(x, z), z); };
  const placed = [], mark = (p, r) => placed.push({ x: p.x, z: p.z, r });

  /* ---------- 직접 그리는 것 ---------- */
  const MAT = {}, mat = (hex) => MAT[hex] || (MAT[hex] = new THREE.MeshStandardMaterial({ color: hex }));
  const SPH = new THREE.SphereGeometry(1, 18, 12), CONE = new THREE.ConeGeometry(1, 1, 20, 1), CYL = new THREE.CylinderGeometry(1, 1, 1, 10);
  const mesh = (geo, hex, sx, sy, sz, x, y, z, leaf = false) => { const m = new THREE.Mesh(geo, mat(hex)); m.userData.leaf = leaf; m.scale.set(sx, sy, sz); m.position.set(x, y, z); return m; };
  const LEAF = [0x6fae4a, 0x5f9e42, 0x7dbb54, 0x88c25c], DARK = [0x3b7a44, 0x2f6b3c, 0x4a8a4c, 0x55964f], AUT = [0xe0893a, 0xd8643a, 0xe9b04a];
  function softOak(o = {}) { const g = new THREE.Group(), k = o.k ?? 0, pal = o.autumn ? AUT : LEAF, s = o.size ?? 1;
    g.add(mesh(CYL, 0x8a5a3b, 0.28 * s, 2.4 * s, 0.28 * s, 0, 1.2 * s, 0));
    [[0, 3.2, 0, 1.75], [1.1, 2.8, 0.3, 1.25], [-1.0, 2.9, -0.2, 1.3], [0.2, 2.7, 1.0, 1.2], [-0.2, 3.9, -0.3, 1.1]].forEach(([x, y, z, r], i) => g.add(mesh(SPH, pal[(i + k) % pal.length], r * s, r * 0.92 * s, r * s, x * s, y * s, z * s, true)));
    if (o.apples) for (let i = 0; i < 9; i++) { const a = i * 2.4; g.add(mesh(SPH, 0xd9443a, 0.16 * s, 0.16 * s, 0.16 * s, Math.cos(a) * 1.55 * s, (2.6 + (i % 3) * 0.45) * s, Math.sin(a) * 1.55 * s)); }
    return g; }
  function softPine(o = {}) { const g = new THREE.Group(), n = o.count ?? 1, k = o.k ?? 0;
    for (let t = 0; t < n; t++) { const h = (o.h ?? 1) * (1 - t * 0.12), ox = t ? Math.cos(t * 2.3) * 1.6 : 0, oz = t ? Math.sin(t * 2.3) * 1.6 : 0;
      g.add(mesh(CYL, 0x7a4f35, 0.22 * h, 1.4 * h, 0.22 * h, ox, 0.7 * h, oz));
      [[1.9, 2.6, 2.3], [1.5, 2.3, 3.6], [1.05, 2.0, 4.8]].forEach(([r, hh, y], i) => g.add(mesh(CONE, DARK[(i + k + t) % 4], r * h, hh * h, r * h, ox, y * h, oz, true))); }
    return g; }
  const softBush = (k) => { const g = new THREE.Group(); [[0, 0.45, 0, 0.7], [0.55, 0.35, 0.2, 0.5], [-0.5, 0.35, -0.1, 0.55]].forEach(([x, y, z, r], i) => g.add(mesh(SPH, LEAF[(i + k) % 4], r, r * 0.85, r, x, y, z, true))); return g; };
  const softRock = () => { const g = new THREE.Group(); g.add(mesh(SPH, 0xb7b0a4, 0.55, 0.32, 0.45, 0, 0.12, 0)); return g; };
  const RB = (w, h, d, r = 0.25) => new RoundedBoxGeometry(w, h, d, 3, r);
  const part = (geo, hex, x, y, z, rx = 0, ry = 0, rz = 0) => { const m = new THREE.Mesh(geo, mat(hex)); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = m.receiveShadow = true; return m; };
  const ANIM = {};
  function theater() {
    const g = new THREE.Group();
    g.add(part(RB(6.4, 0.5, 6.4, 0.2), 0xd9cfbf, 0, 0.25, 0));
    g.add(part(RB(5.6, 4.2, 5.2, 0.3), 0xf3e6cc, 0, 2.6, -0.3));
    g.add(part(RB(6.2, 0.6, 5.8, 0.25), 0x3d5f8a, 0, 4.9, -0.3));
    g.add(part(RB(6.0, 0.9, 1.2, 0.2), 0xf7ecd6, 0, 4.2, 2.45));
    for (const x of [-2.1, -0.7, 0.7, 2.1]) g.add(part(new THREE.CylinderGeometry(0.28, 0.32, 3.2, 16), 0xfffaf0, x, 2.1, 2.55));
    g.add(part(RB(5.4, 0.35, 0.9, 0.12), 0xfffaf0, 0, 3.85, 2.55));
    g.add(part(RB(1.6, 2.4, 0.2, 0.08), 0xc0392b, 0, 1.7, 2.2));
    g.add(part(RB(2.6, 0.55, 0.25, 0.1), 0xf5c542, 0, 3.25, 2.25));
    for (let i = 0; i < 3; i++) g.add(part(RB(5.6 - i * 0.5, 0.18, 0.5, 0.05), 0xe6dccb, 0, 0.55 + i * 0.18, 3.2 - i * 0.35));
    const reel = (r, x, y, z) => { const rg = new THREE.Group();
      rg.add(part(new THREE.CylinderGeometry(r, r, 0.45, 40), 0xc9ced6, 0, 0, 0, Math.PI / 2));
      rg.add(part(new THREE.CylinderGeometry(r * 0.22, r * 0.22, 0.55, 20), 0x6b7380, 0, 0, 0, Math.PI / 2));
      for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; rg.add(part(new THREE.CylinderGeometry(r * 0.2, r * 0.2, 0.5, 18), 0x2d3440, Math.cos(a) * r * 0.58, Math.sin(a) * r * 0.58, 0, Math.PI / 2)); }
      rg.position.set(x, y, z); return rg; };
    const r1 = reel(1.55, -0.6, 7.1, -0.6), r2 = reel(1.05, 1.9, 6.4, -0.9); g.add(r1, r2); ANIM.reels = [r1, r2];
    g.add(part(RB(3.6, 0.5, 0.12, 0.05), 0x2d3440, 0.6, 5.55, -0.75, 0, 0, 0.35));
    return g; }
  function magicBook() {
    const g = new THREE.Group();
    g.add(part(new THREE.CylinderGeometry(0.6, 0.8, 1.0, 24), 0xa9a397, 0, 0.5, 0));
    const bk = new THREE.Group(); bk.position.set(0, 1.1, 0); bk.rotation.x = 0.5; g.add(bk);
    for (const sd of [-1, 1]) { const half = new THREE.Group(); half.rotation.z = -sd * 0.22; bk.add(half);
      half.add(part(RB(1.55, 0.12, 2.1, 0.05), 0xb03a2e, sd * 0.8, 0, 0));
      half.add(part(RB(1.42, 0.3, 1.95, 0.08), 0xfff7e6, sd * 0.76, 0.2, 0));
      for (let l = 0; l < 4; l++) half.add(part(RB(1.0, 0.02, 0.07, 0.01), 0x9aa3b5, sd * 0.78, 0.36, -0.6 + l * 0.38)); }
    const st = new THREE.MeshStandardMaterial({ color: 0xffd34d, emissive: 0xffc21a, emissiveIntensity: 0.8 }); ANIM.stars = [];
    for (const [x, y, z, r] of [[-0.4, 2.3, 0, 0.22], [0.5, 2.8, 0.2, 0.17], [0.1, 3.3, -0.1, 0.13], [-0.8, 3.0, 0.3, 0.11]]) { const m = new THREE.Mesh(new THREE.OctahedronGeometry(r, 0), st); m.position.set(x, y, z); m.rotation.set(0.3, 0.6, 0); g.add(m); ANIM.stars.push(m); }
    return g; }
  function flowerSum(font, text) {
    const g = new THREE.Group(); const cols = { '1': 0xff6f91, '2': 0xffc23c, '3': 0x4fa3ff, '+': 0xffffff, '=': 0xffffff };
    let x = 0; const parts = [];
    for (const ch of text) { const geo = new TextGeometry(ch, { font, size: 3.4, depth: 0.55, curveSegments: 10, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.1, bevelSegments: 3 });
      geo.computeBoundingBox(); const w = geo.boundingBox.max.x - geo.boundingBox.min.x; geo.translate(x - geo.boundingBox.min.x, 0, 0); x += w + 0.7; parts.push([geo, cols[ch]]); }
    x -= 0.7;
    for (const [geo, c] of parts) { geo.translate(-x / 2, -1.7, 0); const m = new THREE.Mesh(geo, mat(c)); m.rotation.x = -Math.PI / 2; m.position.y = 0.12; m.castShadow = m.receiveShadow = true; g.add(m); }
    const bb = new THREE.Box3().setFromObject(g);
    g.add(part(RB(bb.max.x - bb.min.x + 1.6, 0.25, bb.max.z - bb.min.z + 1.4, 0.4), 0x9b6b45, (bb.max.x + bb.min.x) / 2, 0, (bb.max.z + bb.min.z) / 2));
    return g; }

  /* ---------- 짓기 ---------- */
  const fontP = new FontLoader().loadAsync(ASSET + 'digits.typeface.json');
  await Promise.all([
    put('watchtower-140f78', null, POS.tower, -15, 1.75),
    put('village-tavern-4e94e3', null, POS.tavern, -8, 1.0),
    put('two-story-house-40f6dc', null, near(POS.houses, -3.5, 0), 8, 1.05),
    put('thatched-cottage-0e63f5', null, near(POS.houses, 5.5, 1.2), -12, 1.0),
    put('blacksmith-forge-09fa85', null, near(POS.houses, 1.5, -6.2), 0, 0.95),
  ]);
  mark(POS.tower, 5); mark(POS.tavern, 9); mark(POS.houses, 10);
  { const t = theater(); t.position.copy(POS.chapel); t.rotation.y = -0.18; t.scale.setScalar(1.75); scene.add(t); mark(POS.chapel, 7); }
  { const b = magicBook(); const p = near(POS.tavern, -8.2, 4.2); b.position.copy(p); b.rotation.y = 0.45; b.scale.setScalar(1.9); scene.add(b); mark(p, 2); }
  const cw = ['', 'blueberry', 'amanita', 'autumn-gold', 'blueberry'];
  const mushAt = [[0.085, 0.76], [0.15, 0.735], [0.215, 0.79], [0.285, 0.75], [0.33, 0.8]];
  const jobs = [];
  mushAt.forEach(([x, y], i) => { const p = onGround(x, y); jobs.push(put('mushroom-cottage-1135d1', cw[i], p, rnd() * 40 - 20, 4.2)); mark(p, 4); });
  jobs.push(put('backyard-swing-set-38637e', null, onGround(0.14, 0.9), 10, 1.4));
  jobs.push(put('playground-slide-8b764c', null, onGround(0.25, 0.905), -70, 1.4));
  for (const [id, c, x, y] of [['canvas-wall-tent-de8a04', 'cream', 0.10, 0.44], ['canvas-wall-tent-de8a04', 'faded-orange', 0.17, 0.425], ['canvas-ridge-tent-f0df0d', null, 0.215, 0.475], ['dome-tent-9ee59d', null, 0.075, 0.5], ['canvas-wall-tent-de8a04', 'forest-olive', 0.135, 0.505]]) { const p = onGround(x, y); jobs.push(put(id, c, p, rnd() * 30 - 15, 1.25)); mark(p, 3); }
  for (const [x, y] of [[0.195, 0.53], [0.23, 0.52], [0.06, 0.45]]) { const p = onGround(x, y); jobs.push(put('market-stall-94937d', null, p, -20, 1.4)); mark(p, 2); }
  jobs.push(put('signpost-8287c3', null, POS.west, 20, 1.5)); mark(POS.west, 2);
  jobs.push(put('windmill-3aad49', 'red-cap', POS.windmill, -25, 1.45).then(o => { ANIM.sails = o.getObjectByName('sails'); })); mark(POS.windmill, 5);
  { const p = onGround(0.775, 0.36); jobs.push(put('water-mill-b31972', null, p, -30, 1.1).then(o => { ANIM.wheel = o.getObjectByName('wheel'); })); mark(p, 4); }
  { const d0 = POS.dock, dir = new THREE.Vector3(lakeC.x - d0.x, 0, lakeC.z - d0.z).normalize(), ang = Math.atan2(dir.x, dir.z) * 180 / Math.PI;
    for (let i = 0; i < 4; i++) jobs.push(put('lake-dock-run-f5380e', null, new THREE.Vector3(d0.x + dir.x * 2.3 * i, -0.4, d0.z + dir.z * 2.3 * i), ang, 1.1));
    const b = new THREE.Vector3(d0.x + dir.x * 6 + 3, -0.9, d0.z + dir.z * 6);
    jobs.push(put('rowboat-c42d85', null, b, ang + 70, 1.5).then(o => { ANIM.boat = o; ANIM.boatY = b.y; })); mark(d0, 3); }
  { const a = POS.chapel, b = POS.windmill; let best = null;
    for (let t = 0; t <= 1; t += 0.01) { const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t, d = riverD(x, z); if (!best || d < best.d) best = { x, z, d }; }
    jobs.push(put('wooden-bridge-9d2308', null, new THREE.Vector3(best.x, -0.35, best.z), Math.atan2(b.x - a.x, b.z - a.z) * 180 / Math.PI + 90, 3.0)); mark(best, 3); }
  { const p = onGround(0.80, 0.62); jobs.push(put('timber-barn-90b3ce', null, p, -35, 1.1)); mark(p, 5); }
  for (const [x, y] of [[0.755, 0.665], [0.845, 0.69]]) { const p = onGround(x, y); jobs.push(put('haystack-77b0dd', null, p, rnd() * 90, 1.3)); mark(p, 1.5); }
  for (let i = 0; i < 5; i++) jobs.push(put('wooden-fence-3d8ee7', null, onGround(0.74 + i * 0.03, 0.735 - i * 0.004), -8, 1.2));
  const roots = [];
  for (const [x, y] of [[0.41, 0.4], [0.455, 0.385], [0.5, 0.4], [0.545, 0.385], [0.43, 0.43], [0.52, 0.43]]) { const p = onGround(x, y); const t = softOak({ size: 0.75, apples: true, k: 2 }); t.position.copy(p); t.rotation.y = rnd() * 6.28; roots.push(t); mark(p, 2); }
  { const p = onGround(0.52, 0.645); jobs.push(put('village-well-f8e361', null, p, 0, 1.2)); mark(p, 2); }
  for (const [x, y] of [[0.44, 0.62], [0.6, 0.6], [0.36, 0.5], [0.68, 0.62]]) { const p = onGround(x, y); jobs.push(put('lamp-post-c9e409', null, p, 0, 1.3)); mark(p, 1); }
  for (const [id, x, y] of [['barrel-aadc94', 0.43, 0.575], ['wooden-crate-b9c96a', 0.445, 0.585], ['haystack-77b0dd', 0.64, 0.78], ['barrel-aadc94', 0.18, 0.55], ['wooden-crate-b9c96a', 0.25, 0.46]]) { const p = onGround(x, y); jobs.push(put(id, null, p, rnd() * 90, 1.3)); mark(p, 1.5); }
  for (const [x, y] of [[0.06, 0.82], [0.31, 0.86], [0.47, 0.8], [0.66, 0.705]]) jobs.push(put('flower-planter-500ed2', null, onGround(x, y), rnd() * 90, 1.8));
  const font = await fontP;
  { const fs = flowerSum(font, '1+2=3'); fs.position.copy(POS.sum); fs.rotation.y = -0.05; scene.add(fs); mark(POS.sum, 10); }

  /* 나무 */
  const free = (x, z, p = 0) => { for (const f of placed) if (Math.hypot(x - f.x, z - f.z) < f.r + p) return false; if (pathD(x, z) < 2.4 + p * 0.3) return false; return !(riverD(x, z) < 4.2 || lakeE(x, z) < 1.5); };
  const inZone = (sx, sy) => ZONES.some(([l, t, w, h]) => sx * 100 > l - 3 && sx * 100 < l + w + 3 && sy * 100 > t - 2 && sy * 100 < t + h + 12);
  const v = new THREE.Vector3();
  let treeCount = 0;
  for (let z = -140; z < 66; z += 3.3) for (let x = -120; x < 120; x += 3.3) {
    const jx = x + (hash2(x, z) - 0.5) * 3, jz = z + (hash2(z, x) - 0.5) * 3, p = new THREE.Vector3(jx, height(jx, jz), jz);
    v.copy(p).project(camera); if (!(v.x > -1.04 && v.x < 1.04 && v.y > -1.08 && v.y < 1)) continue;
    if (jz < hillC.z - 75) continue;
    const sx = (v.x + 1) / 2, sy = (1 - v.y) / 2;
    let dens = 0.05;
    if (sy < 0.27) dens = 0.55;
    if (sx < 0.06 || sx > 0.94) dens = Math.max(dens, 0.5);
    if (sy > 0.95 && (sx < 0.1 || sx > 0.6)) dens = Math.max(dens, 0.3);
    const dh = Math.hypot(jx - hillC.x, jz - hillC.z); if (dh < 13 && dh > 5) dens = Math.max(dens, 0.28);
    if (inZone(sx, sy) || (sy > 0.82 && sx > 0.08 && sx < 0.93) || sy > 1) continue;
    if (hash2(jx * 1.7, jz * 2.3) > dens || !free(jx, jz, 1)) continue;
    const r = hash2(p.x * 3.1, p.z * 1.3), pine = p.z < hillC.z - 6 || r < 0.55; let t;
    if (pine) t = softPine({ count: 1 + Math.floor(r * 3), k: Math.floor(rnd() * 4), h: 0.8 + rnd() * 0.45 });
    else t = r < 0.8 ? softOak({ size: 1.1 + r * 0.35, autumn: r > 0.76, k: Math.floor(r * 7) }) : softOak({ size: 0.75, apples: true, k: 2 });
    t.position.copy(p); t.rotation.y = r * 6.28; t.scale.setScalar(pine ? 1.15 + r * 0.4 : 1); roots.push(t); treeCount++;
  }
  /* 덤불·돌·들꽃 */
  const flowers = [];
  for (let k = 0; k < 900; k++) {
    const p = onGround(rnd(), 0.28 + rnd() * 0.72); if (!free(p.x, p.z, 0.2)) continue;
    const r = rnd();
    if (r < 0.09) { const b = softBush(Math.floor(rnd() * 4)); b.position.copy(p); b.rotation.y = r * 999; b.scale.setScalar(0.75 + rnd() * 0.4); roots.push(b); }
    else if (r < 0.105) { const b = softRock(); b.position.copy(p); b.rotation.y = r * 999; b.scale.setScalar(0.6 + rnd() * 0.5); roots.push(b); }
    else if (r < 0.4) flowers.push(p);
  }
  {
    const cols = [0xffffff, 0xffe066, 0xff8fab, 0xff6b6b, 0xc9a7ff];
    const fm = new THREE.InstancedMesh(new THREE.SphereGeometry(0.11, 8, 6), new THREE.MeshStandardMaterial(), flowers.length * 5);
    const dm = new THREE.Object3D(); let n = 0;
    for (const p of flowers) { const c = new THREE.Color(cols[Math.floor(rnd() * cols.length)]); for (let k = 0; k < 5; k++) { dm.position.set(p.x + (rnd() - 0.5) * 0.7, p.y + 0.14, p.z + (rnd() - 0.5) * 0.7); dm.updateMatrix(); fm.setMatrixAt(n, dm.matrix); fm.setColorAt(n++, c); } }
    fm.count = n; scene.add(fm);
  }
  /* 같은 모양·같은 색끼리 인스턴스로 묶는다(나무 수백 그루가 그리기 몇 번으로) */
  {
    const buckets = new Map();
    for (const root of roots) { root.updateMatrixWorld(true); root.traverse(o => {
      if (!o.isMesh) return; const key = o.geometry.uuid + '|' + o.material.uuid;
      let b = buckets.get(key); if (!b) buckets.set(key, b = { geo: o.geometry, mat: o.material, leaf: o.userData.leaf, m: [] });
      b.m.push(o.matrixWorld.clone()); }); }
    for (const b of buckets.values()) { const im = new THREE.InstancedMesh(b.geo, toon(b.mat, b.leaf), b.m.length); b.m.forEach((m, i) => im.setMatrixAt(i, m)); im.castShadow = im.receiveShadow = true; scene.add(im); }
  }
  await Promise.all(jobs);
  if (disposed) return null;

  /* 만화풍 빛(3단)으로 바꾸고, 멀리 갈수록 땅을 아래로 휘게 한다(동물의 숲의 둥근 지평선) */
  U.uD.value = camera.position.distanceTo(hillC) + 30;
  scene.traverse(o => { if (!o.isMesh || !o.material || o.material.isMeshToonMaterial || o.material.userData?.water) return; o.material = toon(o.material, !!o.userData.leaf); });

  const dummy = new THREE.Object3D();
  function animate(t) {
    U.uTime.value = t;
    if (ANIM.sails) ANIM.sails.rotation.z = -t * 0.9;
    if (ANIM.wheel) ANIM.wheel.rotation.x = -t * 0.8;
    for (const r of ANIM.reels || []) r.rotation.z = -t * 0.7;
    (ANIM.stars || []).forEach((s, i) => { s.scale.setScalar(0.8 + 0.35 * Math.sin(t * 3 + i * 1.7)); s.rotation.y = t * 1.2 + i; });
    if (ANIM.boat) { ANIM.boat.position.y = ANIM.boatY + 0.07 * Math.sin(t * 1.7); ANIM.boat.rotation.z = 0.05 * Math.sin(t * 1.3); }
    for (const c of clouds) c.position.x = ((c.userData.cx + t * 2.2 + 300) % 600 + 600) % 600 - 300;
    const im = ctl._waves;
    waveMarks.forEach((w, i) => { const p = (t * 0.35 + w.ph) % 1; dummy.position.set(w.x + p * 1.4, WL + 0.03, w.z); dummy.rotation.set(-Math.PI / 2, 0, w.rz); dummy.scale.setScalar(p < 0.85 ? w.s * (0.6 + p * 0.6) : 0.0001); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); });
    im.instanceMatrix.needsUpdate = true;
  }

  /* ---------- 그리기: 보이는 크기만큼, 초당 30장, 느리면 줄이고 멈춘다 ---------- */
  let quality = 1, lastSize = '';
  function fitSize() {
    const r = world.getBoundingClientRect(); if (!r.width) return;
    const k = Math.min(1, Math.max(0.35, (r.width / MAP_W) * (window.devicePixelRatio || 1) * quality));
    const w = Math.round(MAP_W * k), h = Math.round(MAP_H * k), key = w + 'x' + h;
    if (key !== lastSize) { lastSize = key; renderer.setSize(w, h, false); }
  }
  world.insertBefore(canvas, world.firstChild);
  fitSize();
  renderer.shadowMap.needsUpdate = true;
  ctl.renderAt(0);
  canvas.style.opacity = '1';
  const still = !!opts.still || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  ctl.report = { trees: treeCount, sails: !!ANIM.sails, wheel: !!ANIM.wheel, still, spots: Object.fromEntries(Object.entries(POS).map(([k, p]) => { const q = p.clone().project(camera); return [k, [+((q.x + 1) / 2).toFixed(3), +((1 - q.y) / 2).toFixed(3)]]; })) };
  let t0 = performance.now(), last = 0, frames = 0, slow = 0, acc = 0;
  function onVis() { if (document.hidden) cancelAnimationFrame(raf); else if (!still && !disposed) { last = 0; raf = requestAnimationFrame(loop); } }
  function loop(now) {
    if (disposed) return;
    if (!world.isConnected) { ctl.dispose(); return; }
    raf = requestAnimationFrame(loop);
    if (last && now - last < 32) return;
    const dt = last ? now - last : 33; last = now;
    if (frames++ % 30 === 0) fitSize();
    const s = performance.now();
    ctl.renderAt((now - t0) / 1000);
    acc += performance.now() - s + Math.max(0, dt - 34);
    if (frames % 60 === 0) {
      const avg = acc / 60; acc = 0;
      if (avg > 22) { slow++; if (quality > 0.55) { quality *= 0.8; lastSize = ''; fitSize(); } else if (slow > 4) { cancelAnimationFrame(raf); ctl.report.stoppedSlow = true; } }
    }
  }
  if (!still) { document.addEventListener('visibilitychange', onVis); raf = requestAnimationFrame(loop); }
  window.__nmTownLive = ctl;
  return ctl;
}
