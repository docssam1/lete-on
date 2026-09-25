/* ============================================================
   마을 지도 3D — Numbers of Magic 마을을 진짜 3D 디오라마로(2026-09-25, 원장 "마을 지도야 … 3d로 제대로 구현").
   assets/map.jpg(그림책 마을 삽화)를 배치·분위기 참고로, 계단식 언덕·돌길·계단·분수·나무·울타리·구름을
   모두 코드로 만든다(외부 내려받기 없음 — three.js 는 저장소의 world-explorer/vendor 것을 쓴다).

   ── 연결 약속(integration interface) ─────────────────────────────────────────
   import { mountTown3D } from './town3d/town3d.js';
   const ctl = await mountTown3D(container, opts);   // WebGL 을 못 쓰면 null → 옛 2D 지도를 그대로 쓴다
     container : 크기가 정해진 요소(#townVp 처럼 position:relative/absolute, overflow:hidden). 캔버스와 라벨 층을 안에 붙인다.
     opts = {
       lang   : 'ko' | 'en' | 'zh',
       spots  : [{ id, open:boolean, label:string|{ko,en,zh}, sub:string|{ko,en,zh}, lockIcon?:string }],
                id ∈ 'numberland'(BASIC 수의 나라) · 'beginner'(PRIME 초급) · 'intermediate'(ADVANCE 중급)
                     · 'advanced'(CHALLENGE 고급, 산꼭대기 탑) · '_theater'(극장) · '_closet'(꾸미기 옷장)
                모르는 id 는 무시한다.
       gates  : [{ id:'west'|'east'|'south', icon:string, name:string|{ko,en,zh} }],
       onSpot : id => void      건물(3D 모델)이나 그 라벨 버튼을 눌렀을 때. 잠긴 곳도 부른다(앱이 "잠김" 안내를 띄운다).
       onGate : id => void      관문 표지판(또는 라벨)을 눌렀을 때.
       characters : [{
           id      : 'player' | 'buddy' | 아무 id,
           role    : 'player' | 'buddy' | 'npc',
           html    : string   renderWalker(kind,size) 또는 renderNumiChar(char,size) 가 돌려준 HTML 그대로.
                               walker(.nm-walker) 면 정면·뒷면·옆면 × 걷기 자세를 알아서 굽고, 그 밖의 HTML 은
                               화면 밖에서 한 번 배치해 <img>(CSS filter 포함)와 <svg> 를 캔버스로 옮긴다.
           name?   : string|{ko,en,zh}   이름표(없으면 안 단다)
           lines?  : [string|{ko,en,zh}] 눌렀을 때 말풍선으로 하나씩
           at?     : 'plaza'|'gazebo'|'academy'|'numberland'|'harbor'|'theater'|[x,z]  처음 자리
           still?  : true 면 제자리(할아버지·독쌤)   wander?: true 면 길을 따라 돌아다님(Poco·Momo)
           height? : 월드 높이(기본 walker 1.9, 그 밖 1.35)
       }],
       onSay?  : (text, charId) => void   말풍선이 뜰 때(앱이 음성을 켰으면 TTS 를 여기서)
       onReady?: () => void               첫 장면을 그린 뒤
       touchAction? : CSS touch-action (기본 'none' — 마을은 전체 화면이라 끌기=지도 이동)
     }
   돌려주는 ctl = {
       dispose()          — 모든 GPU 자원·이벤트·DOM 을 푼다(container 가 문서에서 빠져도 스스로 푼다)
       setLang(l)         — 라벨·이름표 언어 바꾸기
       refresh(spots)     — 잠금 상태 갱신(opts.spots 와 같은 모양, 일부만 줘도 된다)
       zoomIn(), zoomOut(), focusPlayer()  — 앱의 ＋/－/📍 버튼용
       walkTo(x,z)        — 플레이어를 그 자리로 걷게(검사용)
       debug              — 검사용 내부 핸들(scene, camera, renderer, project(id))
     }
   ============================================================ */
import * as THREE from '../../../world-explorer/vendor/three.module.js';

/* ── 작은 도구 ─────────────────────────────────────────── */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const L = (v, lang) => v == null ? '' : typeof v === 'string' ? v : (v[lang] || v.ko || v.en || '');
const escH = t => String(t).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c]);
function mkRng(seed){ let s = seed >>> 0 || 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
/* 값 잡음(value noise) — 지형 흔들림·풀빛 얼룩 */
function hash2(x, z){ const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, z){
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
const fbm = (x, z) => vnoise(x, z) * 0.55 + vnoise(x * 2.1 + 7, z * 2.1 - 3) * 0.3 + vnoise(x * 4.3 - 11, z * 4.3 + 5) * 0.15;

/* ── 마을 설계도(월드 좌표: x 동쪽+, z 남쪽+, y 위) ──────────────
   카메라는 남쪽에서 북쪽을 비스듬히 내려다본다(그림과 같은 3/4 시점).
   map.jpg 배치: 북쪽 산꼭대기 탑 · 서쪽 윗단 천막 시장 · 가운데 정자 · 가운데 윗단 도서관/극장 ·
   서남쪽 버섯집 마을 · 남쪽 집 · 동쪽 강과 다리 · 동남쪽 호수 선착장. */
const X0 = -46, X1 = 46, Z0 = -46, Z1 = 32;          // 지형 전체
const SX = X1 - X0, SZ = Z1 - Z0;
const BOUND = { x0:-27, x1:27, z0:-22, z1:20 };      // 카메라 중심이 머무는 범위
const PLATEAUS = [
  { cx:-4,  cz:-12.5, rx:21.5, rz:10,  n:4, h:1.6, edge:1.5 },   // 북쪽 윗단(도서관·극장·산 밑)
  { cx:-8,  cz:0.6,   rx:3.7,  rz:3.3, n:2, h:1.6, edge:1.1 },   // 정자 둔덕
  { cx:-20, cz:-7.5,  rx:6.4,  rz:4.6, n:3, h:2.9, edge:1.4 },   // 천막 시장(옷장) 더 높은 단
  { cx:33,  cz:-9,    rx:9,    rz:16,  n:3, h:1.0, edge:1.6 },   // 강 건너 동쪽 둑
];
const MOUNT = { cx:-4, cz:-18.5, R:9.6, top:2.3, peak:9.2 };
const riverX = z => 20.6 + 2.3 * Math.sin(z * 0.16 + 0.8);
const RIVER_W = 2.1, RIVER_END = 11;
const LAKE = { cx:22, cz:18, rx:9.5, rz:6.8 };
const WATER_Y = -0.32;

/* 물까지의 거리(월드 단위, 음수=물 안) */
function waterDist(x, z){
  let d = 1e9;
  if(z < RIVER_END + 2) d = Math.abs(x - riverX(z)) - RIVER_W * (1 + 0.2 * Math.max(0, (z - RIVER_END + 6) / 6));
  const ex = (x - LAKE.cx) / LAKE.rx, ez = (z - LAKE.cz) / LAKE.rz;
  const dl = (Math.sqrt(ex * ex + ez * ez) - 1) * Math.min(LAKE.rx, LAKE.rz) + (fbm(x * 0.4, z * 0.4) - 0.5) * 1.2;
  return Math.min(d, dl);
}
function plateauAmt(p, x, z){
  const dx = Math.abs(x - p.cx) / p.rx, dz = Math.abs(z - p.cz) / p.rz;
  const d = Math.pow(Math.pow(dx, p.n) + Math.pow(dz, p.n), 1 / p.n);
  const wob = (fbm(x * 0.35 + p.cx, z * 0.35 + p.cz) - 0.5) * 1.4;
  const out = (d - 1) * Math.min(p.rx, p.rz) + wob;     // 가장자리 밖으로 몇 단위
  return 1 - sstep(-p.edge, 0, out);
}
let MP = null;
function mountPath(){
  if(MP) return MP;
  const pts = spiralPts().slice(2);
  let tot = 0; const acc = [0];
  for(let i = 1; i < pts.length; i++){ tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); acc.push(tot); }
  MP = pts.map((p, i) => [p[0], p[1], lerp(1.62, MOUNT.peak + 0.02, acc[i] / tot)]);
  return MP;
}
function heightAt(x, z){
  let h = 0;
  for(const p of PLATEAUS){ const a = plateauAmt(p, x, z); if(a > 0) h = Math.max(h, p.h * a); }
  /* 산 — 꼭대기는 평평(탑 자리), 옆은 가파르다 */
  const md = Math.hypot(x - MOUNT.cx, (z - MOUNT.cz) * 1.05);
  if(md < MOUNT.R + 1){
    const t0 = sstep(MOUNT.R, MOUNT.top, md + (fbm(x * 0.5, z * 0.5) - 0.5) * 1.6);
    /* 계단식 산 — 풀 덮인 턱 네 단과 바위 벼랑(그림처럼) */
    const k = Math.min(3, Math.floor(t0 * 4)), fr = t0 * 4 - k;
    const t = t0 >= 1 ? 1 : (k + sstep(0.45, 1, fr)) / 4 * 0.75 + t0 * 0.25;
    const rock = md > MOUNT.top + 0.6 ? (fbm(x * 1.3, z * 1.3) - 0.5) * 0.5 * t : 0;
    h = Math.max(h, MOUNT.peak * t + rock);
    /* 산길 — 나선 길을 따라 턱을 깎고 돋워 길 폭만큼 평평한 선반을 만든다 */
    const mp = mountPath();
    let best = 9, bh = 0;
    for(let i = 1; i < mp.length; i++){
      const a = mp[i - 1], b = mp[i], ex = b[0] - a[0], ez = b[1] - a[1], l2 = ex * ex + ez * ez;
      const u = clamp(((x - a[0]) * ex + (z - a[1]) * ez) / l2, 0, 1);
      const dx = x - (a[0] + ex * u), dz = z - (a[1] + ez * u), d = dx * dx + dz * dz;
      if(d < best){ best = d; bh = lerp(a[2], b[2], u); }
    }
    best = Math.sqrt(best);
    if(best < 1.8) h = lerp(h, bh, 1 - sstep(0.62, 1.8, best));
  }
  /* 북쪽 먼 언덕 — 지평선을 둘러싼다 */
  const far = sstep(-25, -40, z) * (3 + 5 * fbm(x * 0.08, z * 0.08));
  const side = sstep(34, 44, Math.abs(x)) * (2 + 3 * fbm(x * 0.1 + 3, z * 0.1));
  h = Math.max(h, far, side);
  h += (fbm(x * 0.22, z * 0.22) - 0.5) * 0.35;           // 잔물결
  /* 강·호수 파내기 */
  const wd = waterDist(x, z);
  if(wd < 1.8) h = lerp(-1.1, h, sstep(-0.3, 1.8, wd));
  return h;
}

function circlePts(cx, cz, r, n){ const o = []; for(let i = 0; i <= n; i++){ const a = i / n * Math.PI * 2; o.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]); } return o; }
/* 길(길이 칠해지고, 걷기 그래프가 된다). w=폭 */
const PATHS = [
  { id:'main',    w:1.7, pts:[[2,31],[2,22],[1.6,16],[1.8,11],[2.1,6.5],[2.2,4.8]] },
  { id:'academy', w:1.7, pts:[[2.2,0.2],[2.2,-2.2],[2.1,-4.6]] },
  { id:'west',    w:1.5, pts:[[-0.6,3.8],[-4.2,5.2],[-9,6.6],[-13.2,7.6],[-15.2,8.4]] },
  { id:'gazebo',  w:1.2, pts:[[-4.2,5.2],[-6.2,3.6],[-7.8,2.9],[-9.6,2.4],[-10.6,0.9]] },
  { id:'closet',  w:1.3, pts:[[-10.6,0.9],[-11.4,-1],[-12.4,-2.8],[-15.2,-4.4],[-18.4,-5.2]] },
  { id:'westgate',w:1.3, pts:[[-19.4,9.6],[-22.6,7.2],[-26,5.2],[-30,4.2]] },
  { id:'east',    w:1.6, pts:[[4.6,3.8],[8.4,3.2],[12.4,1.6],[15.4,-1.2],[17.4,-3]] },
  { id:'theater', w:1.4, pts:[[10.4,2.6],[11.4,-0.8],[12,-3.8]] },
  { id:'eastgate',w:1.4, pts:[[24.2,-3],[27.4,-3.4],[30,-4]] },
  { id:'house',   w:1.2, pts:[[1.8,11.6],[4.6,11.8],[7.2,10.8]] },
  { id:'harbor',  w:1.4, pts:[[1.7,16.4],[6.4,16.8],[10.4,17.4],[12.6,17.6]] },
  { id:'nloop',   w:1.2, loop:true, circle:[-17.4,10.4,3.4] },
  { id:'mount',   w:1.15, spiral:true },
];
const NOPAINT = { bridge:1, dock:1 };
/* 걷기 전용(칠하지 않음) — 다리·선착장 위 */
const WALK_ONLY = [
  { id:'bridge', pts:[[17.4,-3],[20.6,-3],[24.2,-3]] },
  { id:'dock',   pts:[[12.6,17.6],[15,17.6],[16.8,17.6]] },
  { id:'plaza',  pts:circlePts(2.2, 2.4, 3.0, 20) },
  { id:'nlink',  pts:[[-15.2,8.4],[-14.4,8.2]] },
];
function spiralPts(){
  const out = [[1.2,-5.4],[-0.6,-8.4]];
  const a0 = 1.25, turns = 1.18, n = 70;
  for(let i = 0; i <= n; i++){
    const t = i / n, a = a0 + t * turns * Math.PI * 2;
    const r = lerp(8.4, 1.4, Math.pow(t, 0.9));
    out.push([MOUNT.cx + Math.cos(a) * r, MOUNT.cz + Math.sin(a) * r * 0.95]);
  }
  return out;
}
PATHS.forEach(p => { if(p.spiral) p.pts = spiralPts(); if(p.circle) p.pts = circlePts(p.circle[0], p.circle[1], p.circle[2], 28); });

function resample(pts, step){
  const out = [pts[0].slice()];
  for(let i = 1; i < pts.length; i++){
    const [ax, az] = pts[i - 1], [bx, bz] = pts[i];
    const len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(len / step));
    for(let k = 1; k <= n; k++) out.push([lerp(ax, bx, k / n), lerp(az, bz, k / n)]);
  }
  return out;
}

/* 건물 자리 */
const SPOT_POS = {
  numberland:   { x:-17.4, z:10.4, r:6.2, label:4.6 },
  beginner:     { x:2.2,   z:-8.2, r:4.6, label:7.4 },
  intermediate: { x:7.6,   z:8.2,  r:3.2, label:6.6 },
  advanced:     { x:MOUNT.cx, z:MOUNT.cz, r:2.4, label:9.4 },
  _theater:     { x:12.4,  z:-7.4, r:3.8, label:7.2 },
  _closet:      { x:-20.2, z:-8.2, r:4.8, label:5.6 },
};
const GATE_POS = {
  west:  { x:-30.2, z:4.2,  label:3.6 },
  east:  { x:30.2,  z:-4.2, label:3.6 },
  south: { x:11.2,  z:19.4, label:3.6 },
};
const PLACES = { plaza:[3.6,5.2], gazebo:[-7.2,2.6], academy:[4.2,-4.6], numberland:[-14.8,12.6], harbor:[9.8,17.8], theater:[10.6,-1.4] };
const FOUNTAIN = [2.2, 2.4];
const GAZEBO = [-8, 0.2];

/* 다리·선착장 위에선 그 판 높이로 선다 */
function standY(x, z){
  if(Math.abs(z + 3) < 1.4 && x > 16.6 && x < 25){
    const t = (x - 17.2) / 6.8; return 1.15 + Math.sin(clamp(t, 0, 1) * Math.PI) * 0.55;
  }
  if(Math.abs(z - 17.6) < 1 && x > 12.2 && x < 17.2) return Math.max(heightAt(x, z), 0.12);
  return Math.max(heightAt(x, z), WATER_Y);
}

/* ── 캔버스 텍스처 ─────────────────────────────────────── */
function canvasTex(w, h, draw, o){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  if(o && o.rep){ t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(o.rep[0], o.rep[1]); }
  t.anisotropy = 4;
  return t;
}

/* ── 기하 합치기(재질별 한 덩어리) ─────────────────────── */
function mergeGeos(list){
  let n = 0;
  const flat = list.map(g => { const q = g.index ? g.toNonIndexed() : g; n += q.attributes.position.count; return q; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
  let o = 0;
  for(const g of flat){
    const c = g.attributes.position.count;
    pos.set(g.attributes.position.array, o * 3);
    if(g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
    if(g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
    o += c; g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.computeBoundingSphere(); out.computeBoundingBox();
  return out;
}
/* 건물 한 채 조립기: add(geo, matKey, 위치·회전·크기) → build() 가 재질별로 합쳐 Group 을 만든다 */
function builder(mats){
  const parts = {};
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s = new THREE.Vector3();
  const api = {
    add(geo, key, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1){
      e.set(rx, ry, rz); q.setFromEuler(e); v.set(x, y, z); s.set(sx, sy, sz);
      m4.compose(v, q, s); geo.applyMatrix4(m4);
      (parts[key] = parts[key] || []).push(geo); return api;
    },
    box(w, h, d, key, x, y, z, ry = 0){ return api.add(new THREE.BoxGeometry(w, h, d), key, x, y + h / 2, z, 0, ry); },
    cyl(rt, rb, h, key, x, y, z, seg = 12){ return api.add(new THREE.CylinderGeometry(rt, rb, h, seg), key, x, y + h / 2, z); },
    cone(r, h, key, x, y, z, seg = 12, ry = 0){ return api.add(new THREE.ConeGeometry(r, h, seg), key, x, y + h / 2, z, 0, ry); },
    /* 박공지붕 — 길이 len(x축), 폭 w(z축), 높이 h, 처마 ov */
    gable(len, w, h, key, x, y, z, ry = 0, ov = 0.3){
      const sh = new THREE.Shape();
      sh.moveTo(-w / 2 - ov, 0); sh.lineTo(w / 2 + ov, 0); sh.lineTo(0, h + ov * 0.5); sh.lineTo(-w / 2 - ov, 0);
      const g = new THREE.ExtrudeGeometry(sh, { depth:len + ov * 2, bevelEnabled:false });
      g.translate(0, 0, -(len + ov * 2) / 2); g.rotateY(Math.PI / 2);
      return api.add(g, key, x, y, z, 0, ry);
    },
    build(){
      const grp = new THREE.Group();
      for(const key in parts){
        const mesh = new THREE.Mesh(mergeGeos(parts[key]), mats[key]);
        mesh.castShadow = key !== 'glow' && key !== 'water'; mesh.receiveShadow = true; mesh.userData.matKey = key;
        grp.add(mesh);
      }
      return grp;
    }
  };
  return api;
}

/* ── 캐릭터 그림 굽기 ─────────────────────────────────────── */
const svgToImg = str => new Promise(res => {
  const img = new Image();
  img.onload = () => res(img); img.onerror = () => res(null);
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str);
});
const POSES = {
  front:[{}, { legL:'translate(-1.5,0)', legR:'translate(1.5,-4) scale(1,.82)', armL:'rotate(-10)', armR:'rotate(12)', body:'translate(0,-2)' },
              { legL:'translate(1.5,-4) scale(1,.82)', legR:'translate(-1.5,0)', armL:'rotate(12)', armR:'rotate(-10)', body:'translate(0,-2)' }],
  side: [{}, { legL:'rotate(26)', legR:'rotate(-26)', armL:'rotate(-20)', armR:'rotate(20)', body:'translate(0,-2.5)' },
              { legL:'rotate(-26)', legR:'rotate(26)', armL:'rotate(20)', armR:'rotate(-20)', body:'translate(0,-2.5)' }],
};
const CW = 160, CH = 200;
/* walker(.nm-walker) → { s:[3], n:[3], e:[3], w:[3] } 캔버스 */
async function bakeWalker(svgEl){
  const views = { s:'wk-front', n:'wk-back', e:'wk-side' };
  const out = {};
  for(const dir of ['s', 'n', 'e']){
    out[dir] = [];
    for(let p = 0; p < 3; p++){
      const svg = svgEl.cloneNode(true);
      svg.querySelectorAll('.wk-view').forEach(g => { if(!g.classList.contains(views[dir])) g.remove(); else g.setAttribute('style', 'display:inline'); });
      svg.querySelectorAll('.wk-shadow').forEach(g => g.remove());
      const pose = (dir === 'e' ? POSES.side : POSES.front)[p];
      for(const k in pose){ svg.querySelectorAll('.wk-' + k).forEach(g => g.setAttribute('transform', pose[k])); }
      svg.setAttribute('width', CW); svg.setAttribute('height', CH);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const img = await svgToImg(new XMLSerializer().serializeToString(svg));
      const c = document.createElement('canvas'); c.width = CW; c.height = CH;
      if(img) c.getContext('2d').drawImage(img, 0, 0, CW, CH);
      out[dir].push(c);
    }
  }
  out.w = out.e.map(src => { const c = document.createElement('canvas'); c.width = CW; c.height = CH; const g = c.getContext('2d'); g.translate(CW, 0); g.scale(-1, 1); g.drawImage(src, 0, 0); return c; });
  return out;
}
/* 그 밖의 HTML(숫자 캐릭터 등) — 화면 밖에서 배치한 뒤 <img>·<svg> 를 제자리에 그린다 */
async function bakeHtml(html){
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;visibility:visible;pointer-events:none;contain:layout';
  host.innerHTML = html;
  document.body.appendChild(host);
  try {
    const root = host.firstElementChild || host;
    const imgs = [...root.querySelectorAll('img')];
    await Promise.all(imgs.map(im => im.complete && im.naturalWidth ? null : new Promise(r => { im.onload = im.onerror = r; setTimeout(r, 4000); })));
    const rr = root.getBoundingClientRect();
    const W0 = rr.width || 60, H0 = rr.height || 75;
    const c = document.createElement('canvas'); c.width = CW; c.height = CH;
    const g = c.getContext('2d');
    const sc = Math.min(CW / W0, CH / H0);
    const ox = (CW - W0 * sc) / 2, oy = CH - H0 * sc;
    const els = [...root.querySelectorAll('img, svg')].filter(el => !(el.tagName.toLowerCase() === 'svg' && el.parentElement && el.parentElement.closest('svg')));
    for(const el of els){
      const r = el.getBoundingClientRect();
      if(!r.width || !r.height) continue;
      const x = ox + (r.left - rr.left) * sc, y = oy + (r.top - rr.top) * sc, w = r.width * sc, h = r.height * sc;
      const cs = getComputedStyle(el);
      if(cs.display === 'none' || cs.visibility === 'hidden') continue;
      if(el.tagName.toLowerCase() === 'img'){
        if(!el.naturalWidth) continue;
        const k = Math.min(w / el.naturalWidth, h / el.naturalHeight);
        const dw = el.naturalWidth * k, dh = el.naturalHeight * k;
        g.save(); g.filter = cs.filter && cs.filter !== 'none' ? cs.filter.replace(/drop-shadow\([^)]*\)[^)]*\)?/g, '') : 'none';
        g.drawImage(el, x + (w - dw) / 2, y + (h - dh), dw, dh); g.restore();
      } else {
        const cl = el.cloneNode(true); cl.setAttribute('width', r.width); cl.setAttribute('height', r.height);
        cl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const img = await svgToImg(new XMLSerializer().serializeToString(cl));
        if(img) g.drawImage(img, x, y, w, h);
      }
    }
    return c;
  } finally { host.remove(); }
}
/* 그림의 위·아래 끝(불투명 줄) — 발끝을 땅에 맞추고, 키를 정확히 맞추려고 */
function alphaSpan(c){
  let top = 0, bot = c.height - 1;
  try {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, W = c.width;
    const row = y => { for(let x = 0; x < W; x += 2) if(d[(y * W + x) * 4 + 3] > 40) return true; return false; };
    while(top < c.height - 1 && !row(top)) top++;
    while(bot > top && !row(bot)) bot--;
  } catch(e){ return { anchor:0.03, frac:0.9 }; }
  if(bot <= top) return { anchor:0.03, frac:0.9 };
  return { anchor:(c.height - 1 - bot) / c.height, frac:(bot - top + 1) / c.height };
}
async function bakeChar(html){
  const tpl = document.createElement('div'); tpl.innerHTML = html || '';
  const wk = tpl.querySelector('.nm-walker svg');
  if(wk){ const frames = await bakeWalker(wk); return Object.assign({ walker:true, frames }, alphaSpan(frames.s[0])); }
  const c = await bakeHtml(html || '<span></span>');
  return Object.assign({ walker:false, frames:{ s:[c] } }, alphaSpan(c));
}

/* ── 스타일(라벨·말풍선) — 한 번만 붙인다 ─────────────── */
const CSS = `
.t3d-wrap{position:absolute;inset:0;overflow:hidden;background:#cfe6f2}
.t3d-wrap canvas.t3d-cv{position:absolute;inset:0;width:100%;height:100%;display:block;outline:none;cursor:grab}
.t3d-wrap.drag canvas.t3d-cv{cursor:grabbing}
.t3d-ov{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.t3d-lab{position:absolute;left:0;top:0;pointer-events:auto;transform:translate(-9999px,-9999px);
  display:flex;flex-direction:column;align-items:center;gap:1px;padding:5px 11px 6px;border-radius:14px;
  background:rgba(255,251,240,.94);border:2px solid #e2c98f;color:#3b2a16;font:800 13px/1.15 system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;
  box-shadow:0 3px 10px rgba(60,40,10,.22);white-space:nowrap;cursor:pointer;will-change:transform;transition:opacity .2s}
.t3d-lab small{font-weight:700;font-size:11px;color:#7a5a2e}
.t3d-lab:hover,.t3d-lab:focus-visible{background:#fff;border-color:#f0a53a;outline:none;box-shadow:0 0 0 3px rgba(240,165,58,.45),0 3px 10px rgba(60,40,10,.25)}
.t3d-lab.locked{background:rgba(236,232,224,.92);border-color:#b9ada0;color:#5d5348}
.t3d-lab.locked small{color:#7d7266}
.t3d-lab.gate{background:rgba(92,62,34,.92);border-color:#3f2a14;color:#fff4dc;font-size:12px;padding:4px 10px}
.t3d-lab.hide{opacity:0;pointer-events:none}
.t3d-lab::after{content:"";position:absolute;left:50%;bottom:-7px;margin-left:-6px;border:6px solid transparent;border-bottom:0;border-top-color:#e2c98f}
.t3d-lab.locked::after{border-top-color:#b9ada0}.t3d-lab.gate::after{border-top-color:#3f2a14}
.t3d-name{position:absolute;left:0;top:0;transform:translate(-9999px,-9999px);padding:1px 7px;border-radius:9px;background:rgba(40,30,20,.66);
  color:#fff;font:700 11px/1.3 system-ui,sans-serif;white-space:nowrap;pointer-events:none}
.t3d-bub{position:absolute;left:0;top:0;transform:translate(-9999px,-9999px);max-width:210px;padding:7px 11px;border-radius:14px;background:#fff;color:#2a2016;
  font:700 13px/1.3 system-ui,sans-serif;box-shadow:0 3px 12px rgba(0,0,0,.2);pointer-events:none;opacity:0;transition:opacity .2s;white-space:normal;text-align:center}
.t3d-bub.on{opacity:1}
.t3d-bub::after{content:"";position:absolute;left:50%;bottom:-7px;margin-left:-7px;border:7px solid transparent;border-bottom:0;border-top-color:#fff}
@media (max-width:480px){.t3d-lab{font-size:12px;padding:4px 9px 5px}.t3d-lab small{font-size:10px}.t3d-lab.gate{font-size:11px}}
`;
function ensureCss(){
  if(document.getElementById('t3d-style')) return;
  const s = document.createElement('style'); s.id = 't3d-style'; s.textContent = CSS; document.head.appendChild(s);
}

const glOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } };

/* ============================================================
   mountTown3D
   ============================================================ */
export async function mountTown3D(container, opts){
  opts = opts || {};
  if(!container || !glOK()) return null;
  ensureCss();
  let lang = opts.lang || 'ko';
  const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const rng = mkRng(20260925);

  const wrap = document.createElement('div'); wrap.className = 't3d-wrap';
  const canvas = document.createElement('canvas'); canvas.className = 't3d-cv';
  canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', L({ ko:'마을 지도 3D', en:'Village map (3D)', zh:'村庄地图 3D' }, lang));
  canvas.style.touchAction = opts.touchAction || 'none';
  const ov = document.createElement('div'); ov.className = 't3d-ov';
  wrap.append(canvas, ov);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias:true, powerPreference:'low-power' });
  } catch(e){ return null; }
  if(getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.appendChild(wrap);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const disposables = [];
  const track = x => { disposables.push(x); return x; };
  let world;
  try { world = buildWorld(scene, renderer, rng, track); }
  catch(e){ console.error('[town3d] build failed', e); try { renderer.dispose(); renderer.forceContextLoss(); } catch(_){} wrap.remove(); return null; }

  const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 400);

  /* ── 건물·관문 상태와 라벨 ───────────────────────── */
  const spotState = {};
  (opts.spots || []).forEach(s => { spotState[s.id] = Object.assign({}, s); });
  const labels = [];
  function mkLabel(kind, id, anchor){
    const b = document.createElement('button'); b.type = 'button';
    b.className = 't3d-lab' + (kind === 'gate' ? ' gate' : '');
    b.dataset[kind === 'gate' ? 'gate' : 'spot'] = id;
    b.addEventListener('click', e => { e.preventDefault(); if(kind === 'gate') opts.onGate && opts.onGate(id); else opts.onSpot && opts.onSpot(id); });
    ov.appendChild(b);
    const lab = { kind, id, el:b, anchor, w:0, h:0 };
    labels.push(lab); return lab;
  }
  const spotLab = {};
  for(const id in world.spots){ if(spotState[id]) spotLab[id] = mkLabel('spot', id, world.spots[id].anchor); }
  const gateDefs = {}; (opts.gates || []).forEach(g => { gateDefs[g.id] = g; });
  const gateLab = {};
  for(const id in world.gates){ if(gateDefs[id]) gateLab[id] = mkLabel('gate', id, world.gates[id].anchor); }
  /* 모델이 있어도 opts 에 없는 건물·관문은 숨긴다 */
  for(const id in world.spots) world.spots[id].group.visible = !!spotState[id];
  for(const id in world.gates) world.gates[id].group.visible = !!gateDefs[id];

  function paintLabels(){
    for(const id in spotLab){
      const s = spotState[id], el = spotLab[id].el;
      const lockIco = s.open || s.lockIcon ? '' : '🔒 ';
      el.innerHTML = `<span>${escH(lockIco + L(s.label, lang))}</span>${s.sub ? `<small>${escH(L(s.sub, lang))}</small>` : ''}`;
      el.classList.toggle('locked', !s.open);
      const lockWord = L({ ko:'잠김', en:'locked', zh:'未解锁' }, lang);
      el.setAttribute('aria-label', `${L(s.label, lang)} ${L(s.sub, lang)}${s.open ? '' : ' — ' + lockWord}`.replace(/\s+/g, ' ').trim());
    }
    for(const id in gateLab){
      const g = gateDefs[id], el = gateLab[id].el;
      el.innerHTML = `<span>🪧 ${escH((g.icon ? g.icon + ' ' : '') + L(g.name, lang))}</span>`;
      el.setAttribute('aria-label', L(g.name, lang));
    }
    labels.forEach(l => { l.w = l.el.offsetWidth; l.h = l.el.offsetHeight; });
    names.forEach(n => { if(n.el){ n.el.textContent = L(n.def.name, lang); n.w = n.el.offsetWidth; } });
  }
  function applyLocks(){
    for(const id in world.spots){ const st = spotState[id]; if(st) world.spots[id].setLocked(!st.open, !!st.lockIcon); }
    dirty = true;
  }

  /* ── 캐릭터 ─────────────────────────────────────── */
  const chars = [];
  const names = [];
  const shadowTex = track(canvasTex(64, 64, (g, w, h) => {
    const gr = g.createRadialGradient(32, 32, 2, 32, 32, 31); gr.addColorStop(0, 'rgba(20,14,6,.5)'); gr.addColorStop(1, 'rgba(20,14,6,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }));
  const shadowMat = track(new THREE.MeshBasicMaterial({ map:shadowTex, transparent:true, depthWrite:false }));
  const shadowGeo = track(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2));
  const baked = await Promise.all((opts.characters || []).map(c => bakeChar(c.html).catch(() => null)));
  if(!wrap.isConnected){ /* 굽는 사이 화면이 바뀌었다 */ }
  (opts.characters || []).forEach((def, i) => {
    const bk = baked[i]; if(!bk) return;
    const tex = {};
    for(const d in bk.frames) tex[d] = bk.frames[d].map(c => { const t = track(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; return t; });
    const mat = track(new THREE.SpriteMaterial({ map:tex.s[0], transparent:true, alphaTest:0.08 }));
    const spr = new THREE.Sprite(mat);
    const hgt = def.height || (bk.walker ? 2.5 : (def.role === 'buddy' ? 1.55 : 1.75));
    spr.scale.set(hgt / bk.frac * CW / CH, hgt / bk.frac, 1);
    spr.center.set(0.5, bk.anchor);
    spr.userData.charId = def.id;
    const sh = new THREE.Mesh(shadowGeo, shadowMat); sh.scale.set(hgt * 0.62, 1, hgt * 0.36); sh.renderOrder = 1;
    scene.add(spr, sh);
    let p = def.at;
    if(typeof p === 'string') p = PLACES[p];
    if(!Array.isArray(p)) p = def.role === 'player' ? PLACES.plaza : def.role === 'buddy' ? [PLACES.plaza[0] - 1.3, PLACES.plaza[1] + 0.6] : PLACES.plaza;
    const ch = { def, spr, sh, tex, walker:bk.walker, x:p[0], z:p[1], route:[], dir:'s', phase:0, speed:def.role === 'npc' ? 1.5 : 3.4, idle:rng() * 4, bub:null, bubT:0 };
    if(def.name){
      const el = document.createElement('div'); el.className = 't3d-name'; ov.appendChild(el);
      names.push({ def, el, ch, w:0 }); ch.nameEl = el;
    }
    const bub = document.createElement('div'); bub.className = 't3d-bub'; ov.appendChild(bub); ch.bub = bub;
    chars.push(ch);
  });
  const player = chars.find(c => c.def.role === 'player');
  const buddy = chars.find(c => c.def.role === 'buddy');

  /* ── 걷기 그래프(길 위로 걷는다) ─────────────────── */
  const nav = world.nav;
  function nearestNode(x, z){ let bi = 0, bd = 1e9; nav.nodes.forEach((n, i) => { const d = (n[0] - x) ** 2 + (n[1] - z) ** 2; if(d < bd){ bd = d; bi = i; } }); return [bi, Math.sqrt(bd)]; }
  function route(fx, fz, tx, tz){
    const [a] = nearestNode(fx, fz), [b, db] = nearestNode(tx, tz);
    const N = nav.nodes.length, dist = new Float64Array(N).fill(Infinity), prev = new Int32Array(N).fill(-1), done = new Uint8Array(N);
    dist[a] = 0;
    for(;;){
      let u = -1, bd = Infinity;
      for(let i = 0; i < N; i++) if(!done[i] && dist[i] < bd){ bd = dist[i]; u = i; }
      if(u < 0 || u === b) break;
      done[u] = 1;
      for(const [v, w] of nav.adj[u]){ const nd = dist[u] + w; if(nd < dist[v]){ dist[v] = nd; prev[v] = u; } }
    }
    const pts = [];
    if(a === b || prev[b] >= 0) for(let u = b; u >= 0; u = prev[u]) pts.unshift(nav.nodes[u]);
    else pts.push(nav.nodes[b]);                        /* 끊긴 길(없어야 한다) — 곧장 간다 */
    /* 곧바로 갈 수 있을 만큼 가까우면 길로 돌아가지 않는다 */
    const direct = Math.hypot(tx - fx, tz - fz);
    if(direct < 3.2 && Math.abs(heightAt(tx, tz) - heightAt(fx, fz)) < 0.5) return [[tx, tz]];
    if(db < 4 && !world.blockedAt(tx, tz)) pts.push([tx, tz]);
    return pts;
  }
  function walkTo(ch, x, z){ ch.route = route(ch.x, ch.z, x, z); }

  /* ── 카메라 ─────────────────────────────────────── */
  const cam = { x:0, z:-1, d:46, pitch:0.86 };
  let dMin = 13, dMax = 60;
  let follow = false;
  let W = 1, H = 1;
  function layoutCam(){
    const aspect = W / H;
    /* 세로 화면에서도 가로 시야가 30° 는 되게 */
    const fovV = clamp(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(15)) / aspect) * 180 / Math.PI, 38, 58);
    camera.fov = fovV; camera.aspect = aspect; camera.updateProjectionMatrix();
    dMax = aspect < 0.8 ? 74 : 66;
  }
  function placeCam(){
    cam.x = clamp(cam.x, BOUND.x0, BOUND.x1); cam.z = clamp(cam.z, BOUND.z0, BOUND.z1); cam.d = clamp(cam.d, dMin, dMax);
    const zt = (cam.d - dMin) / (dMax - dMin);
    const pitch = lerp(0.84, 0.5, Math.pow(zt, 0.75));                 // 가까이 가면 더 내려다보고, 멀리 가면 그림처럼 눕힌다
    const ty = 1.2 + zt * 2.5;
    camera.position.set(cam.x, ty + Math.sin(pitch) * cam.d, cam.z + Math.cos(pitch) * cam.d);
    camera.lookAt(cam.x, ty, cam.z);
    world.shadowFollow(cam.x, cam.z, cam.d);
    dirty = true;
  }
  function resize(){
    const r = wrap.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    renderer.setSize(W, H, false); layoutCam(); placeCam();
  }

  /* ── 입력 ───────────────────────────────────────── */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pointers = new Map();
  let drag = null, pinch = null, lastUser = 0;
  function pick(cx, cy){
    const r = canvas.getBoundingClientRect();
    ndc.set((cx - r.left) / r.width * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    /* 캐릭터 → 건물·관문 → 땅 순서 */
    const sprs = chars.map(c => c.spr);
    const hc = ray.intersectObjects(sprs, false)[0];
    const hb = ray.intersectObjects(world.pickables, true)[0];
    if(hc && (!hb || hc.distance < hb.distance + 1)) return { char:chars.find(c => c.spr === hc.object) };
    if(hb){
      let o = hb.object; while(o && !o.userData.spot && !o.userData.gate) o = o.parent;
      if(o) return o.userData.spot ? { spot:o.userData.spot } : { gate:o.userData.gate };
    }
    const hg = ray.intersectObject(world.terrain, false)[0];
    if(hg) return { ground:hg.point };
    return null;
  }
  function onDown(e){
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x:e.clientX, y:e.clientY });
    if(pointers.size === 1){ drag = { x:e.clientX, y:e.clientY, cx:cam.x, cz:cam.z, moved:false }; }
    else if(pointers.size === 2){
      const [a, b] = [...pointers.values()];
      pinch = { d:Math.hypot(a.x - b.x, a.y - b.y), cd:cam.d }; if(drag) drag.moved = true;
    }
    lastUser = performance.now(); wake();
  }
  function onMove(e){
    if(!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x:e.clientX, y:e.clientY });
    if(pinch && pointers.size >= 2){
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if(d > 10) { cam.d = pinch.cd * pinch.d / d; placeCam(); }
    } else if(drag){
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if(!drag.moved && Math.abs(dx) + Math.abs(dy) > 8){ drag.moved = true; wrap.classList.add('drag'); follow = false; }
      if(drag.moved){
        const k = 2 * cam.d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / H;
        cam.x = drag.cx - dx * k; cam.z = drag.cz - dy * k * 1.25; placeCam();
      }
    }
    lastUser = performance.now(); wake();
  }
  function onUp(e){
    const wasTap = drag && !drag.moved && pointers.size === 1 && !pinch;
    pointers.delete(e.pointerId);
    if(pointers.size < 2) pinch = null;
    if(pointers.size === 0){ wrap.classList.remove('drag'); if(wasTap) tap(e.clientX, e.clientY); drag = null; }
    lastUser = performance.now(); wake();
  }
  function tap(cx, cy){
    const h = pick(cx, cy);
    if(!h) return;
    if(h.spot){ opts.onSpot && opts.onSpot(h.spot); return; }
    if(h.gate){ opts.onGate && opts.onGate(h.gate); return; }
    if(h.char){ speak(h.char); return; }
    if(h.ground && player){
      const p = h.ground;
      if(p.x < BOUND.x0 - 4 || p.x > BOUND.x1 + 4 || p.z < BOUND.z0 - 3 || p.z > BOUND.z1 + 4) return;
      walkTo(player, p.x, p.z); follow = true;
      world.ping(p.x, standY(p.x, p.z), p.z);
    }
  }
  function onWheel(e){ e.preventDefault(); cam.d *= e.deltaY < 0 ? 0.9 : 1.1; placeCam(); lastUser = performance.now(); wake(); }
  function onKey(e){
    const k = e.key, step = cam.d * 0.06;
    if(k === 'ArrowLeft') cam.x -= step; else if(k === 'ArrowRight') cam.x += step;
    else if(k === 'ArrowUp') cam.z -= step; else if(k === 'ArrowDown') cam.z += step;
    else if(k === '+' || k === '=') cam.d /= 1.2; else if(k === '-') cam.d *= 1.2; else return;
    e.preventDefault(); follow = false; placeCam(); wake();
  }
  canvas.tabIndex = 0;
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('wheel', onWheel, { passive:false });
  canvas.addEventListener('keydown', onKey);

  function speak(ch){
    const lines = ch.def.lines || [];
    if(!lines.length) return;
    const text = L(lines[Math.floor(Math.random() * lines.length)], lang);
    ch.bub.textContent = text; ch.bub.classList.add('on'); ch.bubT = 2.6;
    opts.onSay && opts.onSay(text, ch.def.id);
  }

  /* ── 매 프레임 ──────────────────────────────────── */
  const v3 = new THREE.Vector3();
  function project(x, y, z){
    v3.set(x, y, z).project(camera);
    return { x:(v3.x * 0.5 + 0.5) * W, y:(-v3.y * 0.5 + 0.5) * H, vis:v3.z < 1 && v3.z > -1 };
  }
  function layoutLabels(){
    const placed = [];
    const items = labels.map(l => { const p = project(l.anchor.x, l.anchor.y, l.anchor.z); return { l, p }; })
      .sort((a, b) => b.p.y - a.p.y);                  // 화면 아래(가까운 것)부터 자리 잡는다
    for(const { l, p } of items){
      if(!p.vis || p.x < -l.w || p.x > W + l.w || p.y < -20 || p.y > H + l.h){ l.el.style.transform = 'translate(-9999px,-9999px)'; continue; }
      let x = p.x - l.w / 2, y = p.y - l.h - 8;
      for(let guard = 0; guard < 6; guard++){
        const hit = placed.find(q => x < q.x + q.w + 4 && x + l.w + 4 > q.x && y < q.y + q.h + 3 && y + l.h + 3 > q.y);
        if(!hit) break;
        y = hit.y - l.h - 4;                                // 겹치면 위로 비킨다
      }
      x = clamp(x, 4, W - l.w - 4); y = clamp(y, 4, H - l.h - 4);
      placed.push({ x, y, w:l.w, h:l.h });
      l.el.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`;
    }
  }
  function layoutChars(){
    for(const ch of chars){
      const hy = ch.spr.position.y + ch.spr.scale.y * (1 - ch.spr.center.y) * 0.98;
      const p = project(ch.x, hy, ch.z);
      if(ch.nameEl){
        const w = ch.nameEl.offsetWidth || 40;
        ch.nameEl.style.transform = p.vis ? `translate(${Math.round(p.x - w / 2)}px,${Math.round(p.y - 2)}px)` : 'translate(-9999px,-9999px)';
      }
      if(ch.bubT > 0){
        const bw = ch.bub.offsetWidth, bh = ch.bub.offsetHeight;
        const x = clamp(p.x - bw / 2, 4, W - bw - 4), y = clamp(p.y - bh - (ch.nameEl ? 22 : 10), 4, H - bh - 4);
        ch.bub.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`;
      }
    }
  }
  function stepChars(dt, t){
    let moving = false;
    for(const ch of chars){
      if(ch.def.role === 'buddy' && player){
        const bx = player.x - 1.2, bz = player.z + 0.7;
        const d = Math.hypot(bx - ch.x, bz - ch.z);
        ch.route = d > 0.25 ? [[bx, bz]] : [];
        ch.speed = clamp(d * 2.2, 1.2, 4.4);
      } else if(ch.def.wander && !reduce && !ch.route.length){
        ch.idle -= dt;
        if(ch.idle <= 0){
          ch.idle = 3 + rng() * 5;
          const home = world.wanderSpots[Math.floor(rng() * world.wanderSpots.length)];
          walkTo(ch, home[0] + (rng() - 0.5) * 2, home[1] + (rng() - 0.5) * 2);
        }
      }
      let walking = false;
      if(ch.route.length){
        const [tx, tz] = ch.route[0];
        const dx = tx - ch.x, dz = tz - ch.z, d = Math.hypot(dx, dz);
        const stepLen = ch.speed * dt;
        if(d <= stepLen){ ch.x = tx; ch.z = tz; ch.route.shift(); }
        else { ch.x += dx / d * stepLen; ch.z += dz / d * stepLen; }
        if(d > 0.02){ ch.dir = Math.abs(dx) > Math.abs(dz) * 0.8 ? (dx < 0 ? 'w' : 'e') : (dz < 0 ? 'n' : 's'); }
        walking = true; moving = true;
      }
      const y = standY(ch.x, ch.z);
      ch.phase += walking ? dt : 0;
      const bob = walking ? Math.abs(Math.sin(ch.phase * 11)) * 0.08 : (reduce ? 0 : Math.sin(t * 2.2 + ch.idle) * 0.015);
      ch.spr.position.set(ch.x, y + bob, ch.z);
      ch.sh.position.set(ch.x, y + 0.04, ch.z);
      if(ch.walker){
        const set = ch.tex[ch.dir] || ch.tex.s;
        const fi = walking ? 1 + (Math.floor(ch.phase * 7.3) % 2) : 0;
        if(ch.spr.material.map !== set[fi]){ ch.spr.material.map = set[fi]; ch.spr.material.needsUpdate = true; }
      } else if(walking){
        /* 숫자 친구 — 좌우로만 돌아본다 */
        const fl = ch.dir === 'w' ? -1 : ch.dir === 'e' ? 1 : Math.sign(ch.spr.scale.x) || 1;
        ch.spr.scale.x = Math.abs(ch.spr.scale.x) * fl;
      }
      if(ch.bubT > 0){ ch.bubT -= dt; if(ch.bubT <= 0) ch.bub.classList.remove('on'); moving = true; }
    }
    return moving;
  }

  let raf = 0, running = true, visible = true, dirty = true, last = performance.now(), t0 = last, disposed = false, readySent = false;
  function frame(now){
    raf = 0;
    if(disposed) return;
    if(!wrap.isConnected){ dispose(); return; }
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;
    const moving = stepChars(dt, t);
    if(follow && player){
      const tx = player.x, tz = player.z + 1.5;
      if(Math.abs(tx - cam.x) + Math.abs(tz - cam.z) > 0.02){ cam.x += (tx - cam.x) * Math.min(1, dt * 2.5); cam.z += (tz - cam.z) * Math.min(1, dt * 2.5); placeCam(); }
    }
    if(!reduce) world.animate(t, dt);
    const animating = !reduce || moving || dirty || now - lastUser < 600;
    if(animating){ renderer.render(scene, camera); layoutLabels(); layoutChars(); dirty = false; }
    if(!readySent){ readySent = true; opts.onReady && opts.onReady(); }
    if(running && visible && (animating || !reduce)) raf = requestAnimationFrame(frame);
  }
  function wake(){ if(!raf && running && visible && !disposed){ last = performance.now(); raf = requestAnimationFrame(frame); } }

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { visible = es.some(x => x.isIntersecting); if(visible) wake(); }) : null;
  if(io) io.observe(wrap);
  const onVis = () => { running = !document.hidden; if(running) wake(); };
  document.addEventListener('visibilitychange', onVis);
  const ro = 'ResizeObserver' in window ? new ResizeObserver(() => { resize(); wake(); }) : null;
  if(ro) ro.observe(wrap); else window.addEventListener('resize', resize);

  function dispose(){
    if(disposed) return; disposed = true;
    if(raf) cancelAnimationFrame(raf); raf = 0;
    if(io) io.disconnect(); if(ro) ro.disconnect(); else window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp);
    canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('keydown', onKey);
    const seen = new Set();
    scene.traverse(o => {
      if(o.geometry && !seen.has(o.geometry)){ seen.add(o.geometry); o.geometry.dispose(); }
      const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(mm => {
        if(seen.has(mm)) return; seen.add(mm);
        for(const k in mm){ const v = mm[k]; if(v && v.isTexture && !seen.has(v)){ seen.add(v); v.dispose(); } }
        mm.dispose();
      });
    });
    disposables.forEach(d => { if(!seen.has(d) && d.dispose) d.dispose(); });
    if(scene.environment) scene.environment.dispose();
    if(scene.background && scene.background.isTexture) scene.background.dispose();
    renderer.dispose(); try { renderer.forceContextLoss(); } catch(e){}
    wrap.remove();
  }

  /* 첫 구도 — 넓은 화면은 마을 전체, 좁은 화면은 광장(플레이어) 가까이 */
  resize();
  const narrow = W / H < 0.8;
  if(narrow && player){ cam.x = player.x - 1.5; cam.z = player.z - 6.5; cam.d = 44; }
  else { cam.x = 0; cam.z = -3; cam.d = W / H > 1.5 ? 58 : 64; }
  placeCam();
  paintLabels(); applyLocks();
  wake();

  return {
    dispose,
    setLang(l){ lang = l || 'ko'; canvas.setAttribute('aria-label', L({ ko:'마을 지도 3D', en:'Village map (3D)', zh:'村庄地图 3D' }, lang)); paintLabels(); dirty = true; wake(); },
    refresh(spots){ (spots || []).forEach(s => { spotState[s.id] = Object.assign(spotState[s.id] || {}, s); }); paintLabels(); applyLocks(); wake(); },
    zoomIn(){ cam.d /= 1.25; placeCam(); wake(); },
    zoomOut(){ cam.d *= 1.25; placeCam(); wake(); },
    focusPlayer(){ if(player){ follow = true; cam.d = Math.min(cam.d, 30); cam.x = player.x; cam.z = player.z + 1.5; placeCam(); wake(); } },
    walkTo(x, z){ if(player){ walkTo(player, x, z); follow = true; wake(); } },
    debug:{ scene, camera, renderer, cam, chars, placeCam, nav,
      project(id){ const s = world.spots[id] || world.gates[id]; if(!s) return null; const c = s.center; return project(c.x, c.y, c.z); } }
  };
}

/* ============================================================
   세계 만들기 — 지형·물·건물·나무·구름·빛
   ============================================================ */
function buildWorld(scene, renderer, rng, track){
  const out = { spots:{}, gates:{}, pickables:[] };
  const anim = [];

  /* 하늘 · 안개 · 빛 */
  scene.background = canvasTex(8, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#7fb6e0'); gr.addColorStop(0.55, '#bfdcef'); gr.addColorStop(1, '#f6ead2');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  scene.fog = new THREE.Fog('#dfe7e4', 80, 190);
  {
    const envScene = new THREE.Scene();
    const sky = new THREE.Mesh(new THREE.SphereGeometry(50, 24, 12), new THREE.MeshBasicMaterial({ side:THREE.BackSide, vertexColors:true }));
    const col = [], pa = sky.geometry.attributes.position, c = new THREE.Color();
    for(let i = 0; i < pa.count; i++){ const y = pa.getY(i) / 50; c.set(y > 0 ? '#bcd8f0' : '#6f8a4a').lerp(new THREE.Color('#fff2d6'), 1 - Math.abs(y)); col.push(c.r, c.g, c.b); }
    sky.geometry.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    envScene.add(sky);
    const sun = new THREE.Mesh(new THREE.SphereGeometry(6, 12, 8), new THREE.MeshBasicMaterial({ color:new THREE.Color('#fff4dc').multiplyScalar(6) }));
    sun.position.set(-25, 30, 20); envScene.add(sun);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(envScene, 0.02).texture;
    scene.environmentIntensity = 0.55;
    pm.dispose(); sky.geometry.dispose(); sky.material.dispose(); sun.geometry.dispose(); sun.material.dispose();
  }
  scene.add(new THREE.HemisphereLight('#fff6e6', '#6b7a45', 1.05));
  const sunL = new THREE.DirectionalLight('#ffe6bf', 2.6);
  const SUN_OFF = new THREE.Vector3(-26, 44, 22);
  sunL.castShadow = true; sunL.shadow.mapSize.set(1024, 1024);
  sunL.shadow.bias = -0.0006; sunL.shadow.normalBias = 0.04; sunL.shadow.radius = 3;
  scene.add(sunL, sunL.target);
  const fillL = new THREE.DirectionalLight('#c9dcff', 0.45); fillL.position.set(30, 20, -10); scene.add(fillL);
  out.shadowFollow = (x, z, d) => {
    const half = clamp(d * 0.75, 16, 40);
    const snap = half * 2 / 1024;
    const cx = Math.round(x / snap) * snap, cz = Math.round(z / snap) * snap;
    sunL.target.position.set(cx, 0, cz - 2);
    sunL.position.copy(sunL.target.position).add(SUN_OFF);
    const sc = sunL.shadow.camera;
    if(sc.right !== half){ sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half; sc.near = 5; sc.far = 130; sc.updateProjectionMatrix(); }
  };

  /* ── 재질 ─────────────────────────────── */
  const std = (color, o) => track(new THREE.MeshStandardMaterial(Object.assign({ color, roughness:0.85, metalness:0 }, o || {})));
  const tileTex = (base, dark) => track(canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for(let row = 0; row < 8; row++){
      for(let k = -1; k < 9; k++){
        const x = k * 16 + (row % 2 ? 8 : 0), y = row * 16;
        g.fillStyle = dark; g.beginPath(); g.arc(x + 8, y + 14, 8.5, 0, Math.PI); g.fill();
        g.fillStyle = base; g.beginPath(); g.arc(x + 8, y + 12, 7.2, 0, Math.PI); g.fill();
      }
    }
  }, { rep:[2, 2] }));
  const brickTex = (base, mortar) => track(canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = mortar; g.fillRect(0, 0, w, h);
    const r2 = mkRng(7);
    for(let row = 0; row < 8; row++) for(let k = -1; k < 5; k++){
      const x = k * 32 + (row % 2 ? 16 : 0), y = row * 16;
      const c = new THREE.Color(base).offsetHSL(0, 0, (r2() - 0.5) * 0.08);
      g.fillStyle = '#' + c.getHexString(); g.fillRect(x + 1.5, y + 1.5, 29, 13);
    }
  }, { rep:[2, 2] }));
  const plankTex = (base) => track(canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const r2 = mkRng(3);
    for(let i = 0; i < 8; i++){ g.fillStyle = `rgba(60,30,10,${0.1 + r2() * 0.15})`; g.fillRect(i * 16, 0, 1.5, h); }
    for(let i = 0; i < 40; i++){ g.fillStyle = `rgba(60,30,10,${0.05 + r2() * 0.08})`; g.fillRect(r2() * w, r2() * h, 1, 6 + r2() * 20); }
  }, { rep:[1, 1] }));
  const stripeTex = (a, b, n) => track(canvasTex(128, 16, (g, w, h) => { for(let i = 0; i < n; i++){ g.fillStyle = i % 2 ? b : a; g.fillRect(i * w / n, 0, w / n + 1, h); } }));
  const M = {
    stone:   std('#ffffff', { map:brickTex('#cfc4b0', '#9d9080'), roughness:0.92 }),
    stoneD:  std('#9a8f80', { roughness:0.95 }),
    step:    std('#c9bca4', { roughness:0.95 }),
    plaster: std('#f4ead4', { roughness:0.9 }),
    cream:   std('#fbf1dc', { roughness:0.9 }),
    marble:  std('#f1ece2', { roughness:0.55 }),
    timber:  std('#6b4527', { roughness:0.8 }),
    wood:    std('#ffffff', { map:plankTex('#a8743f'), roughness:0.85 }),
    woodL:   std('#c89a62', { roughness:0.85 }),
    roofR:   std('#ffffff', { map:tileTex('#c25a35', '#8d3a20'), roughness:0.8 }),
    roofB:   std('#ffffff', { map:tileTex('#4f6f9c', '#35507a'), roughness:0.8 }),
    roofG:   std('#6a7f8f', { roughness:0.7 }),
    roofBr:  std('#ffffff', { map:tileTex('#9b5a2e', '#6d3c1b'), roughness:0.8 }),
    slate:   std('#5d6470', { roughness:0.75 }),
    door:    std('#6a3f22', { roughness:0.7 }),
    glow:    track(new THREE.MeshStandardMaterial({ color:'#ffd98a', emissive:'#ffb347', emissiveIntensity:0.9, roughness:0.5 })),
    gold:    std('#e2b13c', { roughness:0.35, metalness:0.7 }),
    iron:    std('#474a52', { roughness:0.5, metalness:0.6 }),
    red:     std('#d8503f'), yellow:std('#f2c14a'), green:std('#5fa35a'), blue:std('#4d8fd1'), pink:std('#ee8fb3'), purple:std('#7d5bb5'),
    domeR:   std('#e2574c', { roughness:0.6 }), domeG:std('#58a85b', { roughness:0.6 }), domeB:std('#4f93d6', { roughness:0.6 }), domeY:std('#f0b73c', { roughness:0.6 }),
    tentA:   std('#ffffff', { map:stripeTex('#d94f4f', '#f8ecd6', 12) }),
    tentB:   std('#ffffff', { map:stripeTex('#3f7fbf', '#f8ecd6', 12) }),
    tentC:   std('#ffffff', { map:stripeTex('#e8a53a', '#fff3d6', 12) }),
    wizard:  std('#5a3f9a', { roughness:0.7 }),
    sand:    std('#ecd9a4', { roughness:1 }),
    film:    std('#2c2c33', { roughness:0.45, metalness:0.4 }),
    reel:    std('#c9ccd4', { roughness:0.3, metalness:0.85 }),
    white:   std('#ffffff', { roughness:0.6 }),
    water:   track(new THREE.MeshStandardMaterial({ color:'#63b4dc', roughness:0.12, metalness:0.1, transparent:true, opacity:0.9 })),
  };

  /* ── 지형 ─────────────────────────────── */
  const RES = 0.5;
  const nx = Math.round(SX / RES), nz = Math.round(SZ / RES);
  const tg = new THREE.PlaneGeometry(SX, SZ, nx, nz).rotateX(-Math.PI / 2);
  tg.translate((X0 + X1) / 2, 0, (Z0 + Z1) / 2);
  const tp = tg.attributes.position;
  for(let i = 0; i < tp.count; i++) tp.setY(i, heightAt(tp.getX(i), tp.getZ(i)));
  tg.computeVertexNormals();
  const groundTex = track(paintGround());
  const terrain = new THREE.Mesh(tg, std('#ffffff', { map:groundTex, roughness:0.96 }));
  terrain.receiveShadow = true;
  scene.add(terrain); out.terrain = terrain;

  function paintGround(){
    const TW = 2048, TH = Math.round(2048 * SZ / SX);
    const c = document.createElement('canvas'); c.width = TW; c.height = TH;
    const g = c.getContext('2d');
    /* 1) 낮은 해상도로 높이·경사를 보고 풀/바위/물가 색을 칠한다 */
    const lw = 460, lh = Math.round(460 * SZ / SX);
    const lo = document.createElement('canvas'); lo.width = lw; lo.height = lh;
    const lg = lo.getContext('2d'); const img = lg.createImageData(lw, lh);
    const grassA = new THREE.Color('#9cc95e'), grassB = new THREE.Color('#6ea345'), grassTop = new THREE.Color('#b5d56b');
    const rockA = new THREE.Color('#b59c7a'), rockB = new THREE.Color('#86705a'), bank = new THREE.Color('#d6c28f'), under = new THREE.Color('#4f8f96');
    const col = new THREE.Color();
    for(let j = 0; j < lh; j++) for(let i = 0; i < lw; i++){
      const x = X0 + (i + 0.5) / lw * SX, z = Z0 + (j + 0.5) / lh * SZ, e = 0.35;
      const h = heightAt(x, z);
      const gx = (heightAt(x + e, z) - heightAt(x - e, z)) / (2 * e), gz = (heightAt(x, z + e) - heightAt(x, z - e)) / (2 * e);
      const slope = Math.hypot(gx, gz);
      const n = fbm(x * 0.3, z * 0.3);
      col.copy(grassA).lerp(grassB, clamp(n * 1.3 - 0.2, 0, 1));
      if(h > 1.2) col.lerp(grassTop, 0.25);
      /* 비탈은 바위(층층이 줄무늬) */
      const rk = sstep(0.95, 1.6, slope);
      if(rk > 0){ const band = 0.5 + 0.5 * Math.sin(h * 5.2 + n * 3); col.lerp(rockA.clone().lerp(rockB, band * 0.7), rk); }
      /* 남쪽을 향한 비탈은 살짝 밝게, 북쪽은 어둡게 — 그림 같은 명암 */
      col.multiplyScalar(1 + clamp(-gx * 0.05 + gz * 0.06, -0.12, 0.12));
      const wd = waterDist(x, z);
      if(wd < 1.1) col.lerp(bank, sstep(1.1, 0.2, wd) * 0.85);
      if(wd < -0.2) col.lerp(under, 0.8);
      const k = (j * lw + i) * 4;
      img.data[k] = col.r * 255; img.data[k + 1] = col.g * 255; img.data[k + 2] = col.b * 255; img.data[k + 3] = 255;
    }
    /* ImageData 는 선형이 아니라 sRGB 로 보이는 값이어야 한다 — THREE.Color 는 hex 로 넣으면 선형이므로 되돌린다 */
    for(let k = 0; k < img.data.length; k += 4){ for(let q = 0; q < 3; q++){ const v = img.data[k + q] / 255; img.data[k + q] = (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255; } }
    lg.putImageData(img, 0, 0);
    g.imageSmoothingEnabled = true; g.drawImage(lo, 0, 0, TW, TH);
    const px = x => (x - X0) / SX * TW, pz = z => (z - Z0) / SZ * TH, U = TW / SX;
    /* 2) 풀잎 얼룩 · 꽃 */
    const r2 = mkRng(11);
    for(let i = 0; i < 26000; i++){
      const x = X0 + r2() * SX, z = Z0 + r2() * SZ;
      const wd = waterDist(x, z); if(wd < 0.3) continue;
      const tone = r2();
      g.fillStyle = tone < 0.5 ? 'rgba(70,110,40,.22)' : 'rgba(210,235,140,.22)';
      g.fillRect(px(x), pz(z), 2 + r2() * 3, 1.5 + r2() * 2);
    }
    const flowers = ['#f7d34a', '#ffffff', '#f08fb0', '#b58ae0', '#ff8a5c'];
    for(let i = 0; i < 1400; i++){
      const x = X0 + r2() * SX, z = Z0 + r2() * SZ;
      if(waterDist(x, z) < 0.8) continue;
      g.fillStyle = flowers[i % flowers.length]; g.beginPath(); g.arc(px(x), pz(z), 1.6 + r2() * 1.4, 0, 7); g.fill();
    }
    /* 3) 돌길 — 테두리, 모래색 바탕, 자갈 */
    const stroke = (pts, w, style) => { g.strokeStyle = style; g.lineWidth = w * U; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, z], i) => i ? g.lineTo(px(x), pz(z)) : g.moveTo(px(x), pz(z))); g.stroke(); };
    PATHS.forEach(p => stroke(p.pts, p.w + 0.5, 'rgba(120,96,58,.55)'));
    /* 광장 */
    g.fillStyle = 'rgba(120,96,58,.55)'; g.beginPath(); g.ellipse(px(FOUNTAIN[0]), pz(FOUNTAIN[1]), 4.3 * U, 3.7 * U, 0, 0, 7); g.fill();
    PATHS.forEach(p => stroke(p.pts, p.w, '#e3cf9d'));
    g.fillStyle = '#e3cf9d'; g.beginPath(); g.ellipse(px(FOUNTAIN[0]), pz(FOUNTAIN[1]), 4 * U, 3.4 * U, 0, 0, 7); g.fill();
    /* 자갈 */
    const cob = (x, z) => {
      const s = (0.18 + r2() * 0.14) * U;
      g.fillStyle = r2() < 0.5 ? 'rgba(160,138,100,.55)' : 'rgba(250,240,215,.6)';
      g.beginPath(); g.ellipse(px(x), pz(z), s, s * 0.75, r2() * 3, 0, 7); g.fill();
    };
    PATHS.forEach(p => { resample(p.pts, 0.25).forEach(([x, z]) => { for(let k = 0; k < 3; k++) cob(x + (r2() - 0.5) * p.w * 0.8, z + (r2() - 0.5) * p.w * 0.8); }); });
    for(let i = 0; i < 520; i++){ const a = r2() * 7, rr = Math.sqrt(r2()) * 3.8; cob(FOUNTAIN[0] + Math.cos(a) * rr, FOUNTAIN[1] + Math.sin(a) * rr * 0.9); }
    /* 모래밭(수의 나라) */
    g.fillStyle = '#ecd9a4'; g.fillRect(px(-13.4), pz(13.6), 3.2 * U, 2.4 * U);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }

  /* 물 — 한 장이 강·호수를 모두 채운다(지형이 파인 곳만 보인다) */
  const waterTex = track(canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    const r2 = mkRng(5);
    for(let i = 0; i < 90; i++){ g.strokeStyle = `rgba(120,170,210,${0.25 + r2() * 0.3})`; g.lineWidth = 1.5; const x = r2() * w, y = r2() * h; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 10, y - 4, x + 22, y); g.stroke(); }
  }, { rep:[14, 12] }));
  M.water.map = waterTex;
  const water = new THREE.Mesh(new THREE.PlaneGeometry(SX, SZ).rotateX(-Math.PI / 2), M.water);
  water.position.set((X0 + X1) / 2, WATER_Y, (Z0 + Z1) / 2); water.receiveShadow = true; scene.add(water);
  anim.push((t) => { waterTex.offset.set(t * 0.012, t * 0.006); });

  /* 먼 산(지평선) */
  {
    const b = builder({ far:std('#7f9e84', { flatShading:true, roughness:1 }), far2:std('#93b3a0', { flatShading:true, roughness:1 }) });
    const r2 = mkRng(9);
    for(let i = 0; i < 14; i++){
      const x = -110 + i * 17 + r2() * 8, z = -70 - r2() * 25, h = 14 + r2() * 16, r = 18 + r2() * 12;
      b.cone(r, h, i % 2 ? 'far' : 'far2', x, 0, z, 7, r2() * 3);
    }
    scene.add(b.build());
  }

  /* 길 옆 계단 — 길이 비탈을 오르는 곳에 돌계단을 자동으로 놓는다 */
  const nav = { nodes:[], adj:[] };
  {
    const b = builder({ step:M.step });
    PATHS.forEach(p => {
      if(p.spiral || p.loop) return;
      const pts = resample(p.pts, 0.34);
      for(let i = 1; i < pts.length; i++){
        const [ax, az] = pts[i - 1], [bx, bz] = pts[i];
        const ha = heightAt(ax, az), hb = heightAt(bx, bz);
        if(Math.abs(hb - ha) / 0.34 < 0.42) continue;
        const top = Math.max(ha, hb), low = Math.min(ha, hb) - 0.45;
        const ang = Math.atan2(bx - ax, bz - az);
        b.add(new THREE.BoxGeometry(p.w * 0.95, top - low, 0.42), 'step', (ax + bx) / 2, (top + low) / 2 + 0.02, (az + bz) / 2, 0, ang);
      }
    });
    /* 산길 — 굽이굽이 돌계단(판석을 길 방향으로 한 장씩 깐다: 비탈 아래쪽으로 판이 드러나 계단처럼 보인다) */
    const sp = resample(PATHS.find(p => p.spiral).pts, 0.42);
    for(let i = 1; i < sp.length; i++){
      const [ax, az] = sp[i - 1], [bx, bz] = sp[i];
      const x = (ax + bx) / 2, z = (az + bz) / 2, h = heightAt(x, z);
      if(h < 1.9) continue;
      const ang = Math.atan2(bx - ax, bz - az);
      b.add(new THREE.BoxGeometry(1.25, 0.5, 0.4), 'step', x, h - 0.12, z, 0, ang);
    }
    const g = b.build(); scene.add(g);
  }
  /* 걷기 그래프 */
  {
    const polys = PATHS.map(p => p.pts).concat(WALK_ONLY.map(p => p.pts));
    const idOf = [];
    polys.forEach(pts => {
      const rs = resample(pts, 1.0), ids = [];
      rs.forEach(pt => {
        /* 이미 가까운 점이 있으면 그 점을 쓴다(교차점) */
        let found = -1;
        for(let i = 0; i < nav.nodes.length; i++){ const n = nav.nodes[i]; if((n[0] - pt[0]) ** 2 + (n[1] - pt[1]) ** 2 < 0.36){ found = i; break; } }
        if(found < 0){ nav.nodes.push(pt); nav.adj.push([]); found = nav.nodes.length - 1; }
        ids.push(found);
      });
      for(let i = 1; i < ids.length; i++){
        const a = ids[i - 1], b = ids[i]; if(a === b) continue;
        const d = Math.hypot(nav.nodes[a][0] - nav.nodes[b][0], nav.nodes[a][1] - nav.nodes[b][1]);
        nav.adj[a].push([b, d]); nav.adj[b].push([a, d]);
      }
      idOf.push(ids);
    });
    /* 길 끝과 다른 길 사이 가까운 점 잇기 */
    idOf.forEach(ids => [ids[0], ids[ids.length - 1]].forEach(e => {
      let best = -1, bd = 3.2 * 3.2;
      nav.nodes.forEach((n, i) => { if(ids.includes(i)) return; const d = (n[0] - nav.nodes[e][0]) ** 2 + (n[1] - nav.nodes[e][1]) ** 2; if(d < bd){ bd = d; best = i; } });
      if(best >= 0){ const d = Math.sqrt(bd); nav.adj[e].push([best, d]); nav.adj[best].push([e, d]); }
    }));
  }
  out.nav = nav;

  /* ── 막힘(건물·물) — 나무 심기와 도착점 판정 ───────── */
  const pathSamples = [];
  PATHS.forEach(p => resample(p.pts, 0.6).forEach(pt => pathSamples.push([pt[0], pt[1], p.w])));
  const solids = [];   // [x, z, r]
  const nearPath = (x, z, pad) => pathSamples.some(([px, pz, w]) => (px - x) ** 2 + (pz - z) ** 2 < (w / 2 + pad) ** 2);
  const inSolid = (x, z, pad) => solids.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < (r + pad) ** 2);
  out.blockedAt = (x, z) => waterDist(x, z) < 0.2 || inSolid(x, z, -0.4);

  /* ── 건물들 ─────────────────────────── */
  const spotGroups = {};
  function placeSpot(id, grp, anchorY, extra){
    const P = SPOT_POS[id];
    const gy = heightAt(P.x, P.z);
    grp.position.set(P.x, gy, P.z);
    grp.userData.spot = id;
    grp.traverse(o => { if(o.isMesh) o.userData.spot = id; });
    scene.add(grp); out.pickables.push(grp);
    /* 잠금 표시: 재질을 어둡게 복제 + 자물쇠 + 창 불 끄기 / 열림: 금빛 고리 */
    const origMats = new Map(), dimMats = new Map();
    grp.traverse(o => {
      if(!o.isMesh || o.userData.noDim) return;
      const m = o.material; origMats.set(o, m);
      if(!dimMats.has(m)){
        const d = m.clone();
        if(d.color) d.color.multiplyScalar(0.55).lerp(new THREE.Color('#7d7f88'), 0.35);
        if(d.emissive){ d.emissive.set('#000000'); d.emissiveIntensity = 0; }
        dimMats.set(m, track(d));
      }
    });
    const lock = makeLock(); lock.position.set(0, (anchorY || P.label) * 0.5, P.r * 0.62); grp.add(lock);
    const halo = new THREE.Mesh(new THREE.RingGeometry(P.r * 0.92, P.r, 48).rotateX(-Math.PI / 2), track(new THREE.MeshBasicMaterial({ color:'#ffd66b', transparent:true, opacity:0.4, depthWrite:false })));
    halo.position.y = 0.08; halo.userData.noDim = true; halo.raycast = () => {}; grp.add(halo);
    anim.push(t => { if(halo.visible){ halo.material.opacity = 0.25 + 0.2 * Math.sin(t * 2.4); } });
    const center = new THREE.Vector3(P.x, gy + (anchorY || P.label) * 0.5, P.z);
    out.spots[id] = {
      group:grp, center,
      anchor:new THREE.Vector3(P.x, gy + (anchorY || P.label), P.z),
      setLocked(locked, soft){
        /* soft(lockIcon 이 있는 곳, 예: 극장) — 라벨만 회색, 건물은 그대로 밝고 자물쇠도 없다 */
        const hard = locked && !soft;
        origMats.forEach((m, o) => { o.material = hard ? dimMats.get(m) : m; });
        lock.visible = hard; halo.visible = !locked;
      }
    };
    solids.push([P.x, P.z, extra == null ? P.r * 0.72 : extra]);
    spotGroups[id] = grp;
  }
  function makeLock(){
    const g = new THREE.Group();
    const tex = track(canvasTex(128, 128, (c, w, h) => {
      c.fillStyle = 'rgba(255,255,255,.92)'; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill();
      c.strokeStyle = '#6d5a3a'; c.lineWidth = 10; c.beginPath(); c.arc(64, 54, 20, Math.PI, 0); c.lineTo(84, 66); c.moveTo(44, 54); c.lineTo(44, 66); c.stroke();
      c.fillStyle = '#d9a632'; c.fillRect(34, 60, 60, 44); c.strokeStyle = '#8a6418'; c.lineWidth = 4; c.strokeRect(34, 60, 60, 44);
      c.fillStyle = '#5a3f10'; c.beginPath(); c.arc(64, 78, 6, 0, 7); c.fill(); c.fillRect(61, 80, 6, 14);
    }));
    const s = new THREE.Sprite(track(new THREE.SpriteMaterial({ map:tex, depthTest:true })));
    s.scale.set(1.3, 1.3, 1); s.userData.noDim = true; g.add(s); return g;
  }

  /* 1) 수의 나라(BASIC) — 버섯 지붕 집, 모래밭, 그네, 숫자 블록 */
  {
    const b = builder(M);
    const houses = [[-3, -2.4, 'domeR', 1.55], [1.8, -3.2, 'domeG', 1.35], [-1.2, 2.3, 'domeB', 1.45], [3.4, 0.4, 'domeY', 1.3]];
    houses.forEach(([x, z, dm, r]) => {
      b.cyl(r * 0.92, r, r * 1.15, 'cream', x, 0, z, 16);
      b.add(new THREE.SphereGeometry(r * 1.28, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), dm, x, r * 1.1, z, 0, 0, 0, 1, 0.8, 1);
      b.add(new THREE.SphereGeometry(r * 0.2, 8, 6), 'white', x - r * 0.5, r * 1.9, z + r * 0.4);
      b.add(new THREE.SphereGeometry(r * 0.16, 8, 6), 'white', x + r * 0.45, r * 1.75, z + r * 0.6);
      b.box(0.62, 1.0, 0.1, 'door', x, 0, z + r * 0.97);
      b.add(new THREE.CircleGeometry(0.26, 12), 'glow', x - r * 0.55, r * 0.66, z + r * 0.83, 0, -0.55);
      b.add(new THREE.CircleGeometry(0.26, 12), 'glow', x + r * 0.55, r * 0.66, z + r * 0.83, 0, 0.55);
      b.cyl(0.16, 0.18, 0.7, 'stoneD', x + r * 0.5, r * 1.55, z - r * 0.3, 8);
    });
    /* 숫자 블록 1·2·3 */
    const numMat = n => { const t = track(canvasTex(64, 64, (g, w, h) => { g.fillStyle = ['#f2c14a', '#6fb6e8', '#ef8b7a'][n - 1]; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = 'bold 46px system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 32, 35); })); return track(new THREE.MeshStandardMaterial({ map:t, roughness:0.6 })); };
    M.n1 = numMat(1); M.n2 = numMat(2); M.n3 = numMat(3);
    b.box(0.7, 0.7, 0.7, 'n1', 4.2, 0, 3.6, 0.3); b.box(0.7, 0.7, 0.7, 'n2', 5.1, 0, 3.3, -0.2); b.box(0.7, 0.7, 0.7, 'n3', 4.6, 0.7, 3.45, 0.1);
    /* 모래밭 */
    b.box(3.2, 0.18, 0.18, 'woodL', 5.6, 0, 3.2); b.box(3.2, 0.18, 0.18, 'woodL', 5.6, 0, 5.6);
    b.box(0.18, 0.18, 2.4, 'woodL', 4.0, 0, 4.4); b.box(0.18, 0.18, 2.4, 'woodL', 7.2, 0, 4.4);
    b.box(3.0, 0.08, 2.2, 'sand', 5.6, 0, 4.4);
    /* 그네 */
    b.add(new THREE.CylinderGeometry(0.07, 0.07, 2.1, 6), 'red', 8.2, 1.0, 1.4, 0, 0, 0.25);
    b.add(new THREE.CylinderGeometry(0.07, 0.07, 2.1, 6), 'red', 9.0, 1.0, 1.4, 0, 0, -0.25);
    b.add(new THREE.CylinderGeometry(0.07, 0.07, 2.1, 6), 'red', 8.2, 1.0, 2.8, 0, 0, 0.25);
    b.add(new THREE.CylinderGeometry(0.07, 0.07, 2.1, 6), 'red', 9.0, 1.0, 2.8, 0, 0, -0.25);
    b.add(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6), 'iron', 8.6, 2.0, 2.1, Math.PI / 2);
    b.box(0.5, 0.06, 0.3, 'woodL', 8.6, 0.55, 2.1);
    placeSpot('numberland', b.build(), 4.6, 4.2);
  }
  /* 2) 초급(PRIME) — 기둥 늘어선 학당(책 문양 박공) */
  {
    const b = builder(M);
    b.box(7.6, 0.35, 5.4, 'marble', 0, 0, 0); b.box(7.0, 0.35, 4.9, 'marble', 0, 0.35, 0.1);
    b.box(6.2, 3.0, 3.2, 'plaster', 0, 0.7, -0.6);
    for(let i = 0; i < 6; i++) b.cyl(0.24, 0.28, 3.0, 'marble', -2.7 + i * 1.08, 0.7, 1.75, 12);
    b.box(6.9, 0.35, 4.6, 'marble', 0, 3.7, 0.1);
    b.gable(6.9, 4.6, 1.5, 'roofBr', 0, 4.05, 0.1, Math.PI / 2, 0.35);
    /* 박공 앞면 — 펼친 책 */
    const bookT = track(canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = '#f1ece2'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#7a4a26'; g.beginPath(); g.moveTo(128, 104); g.quadraticCurveTo(80, 84, 40, 96); g.lineTo(40, 40); g.quadraticCurveTo(80, 28, 128, 48); g.quadraticCurveTo(176, 28, 216, 40); g.lineTo(216, 96); g.quadraticCurveTo(176, 84, 128, 104); g.fill();
      g.fillStyle = '#fff8e6'; g.beginPath(); g.moveTo(128, 96); g.quadraticCurveTo(84, 78, 48, 88); g.lineTo(48, 44); g.quadraticCurveTo(84, 34, 128, 54); g.quadraticCurveTo(172, 34, 208, 44); g.lineTo(208, 88); g.quadraticCurveTo(172, 78, 128, 96); g.fill();
      g.strokeStyle = '#b89a6a'; g.lineWidth = 3; for(let i = 0; i < 4; i++){ g.beginPath(); g.moveTo(60, 54 + i * 9); g.lineTo(114, 60 + i * 9); g.moveTo(142, 60 + i * 9); g.lineTo(196, 54 + i * 9); g.stroke(); }
    }));
    M.book = track(new THREE.MeshStandardMaterial({ map:bookT, roughness:0.8 }));
    const tri = new THREE.Shape(); tri.moveTo(-2.9, 0); tri.lineTo(2.9, 0); tri.lineTo(0, 1.35); tri.lineTo(-2.9, 0);
    const tg2 = new THREE.ShapeGeometry(tri); const uv = tg2.attributes.uv, pp = tg2.attributes.position;
    for(let i = 0; i < uv.count; i++) uv.setXY(i, (pp.getX(i) + 2.9) / 5.8, pp.getY(i) / 1.35);
    b.add(tg2, 'book', 0, 4.1, 2.43);
    b.box(1.3, 2.0, 0.12, 'door', 0, 0.7, 1.0);
    b.box(0.9, 1.1, 0.1, 'glow', -2.0, 1.6, 1.0); b.box(0.9, 1.1, 0.1, 'glow', 2.0, 1.6, 1.0);
    for(let i = 0; i < 3; i++) b.box(3.2 - i * 0.1, 0.24, 0.5, 'marble', 0, 0, 3.0 - i * 0.45 + 0.9);
    placeSpot('beginner', b.build(), 7.2, 3.6);
  }
  /* 3) 중급(ADVANCE) — 목조 2층 집 + 텃밭 울타리 + 굴뚝 연기 */
  let chimneyTop;
  {
    const b = builder(M);
    b.box(4.4, 1.6, 3.2, 'stone', 0, 0, 0);
    b.box(4.6, 1.7, 3.4, 'plaster', 0, 1.6, 0);
    /* 나무 뼈대 */
    [-2.25, -0.75, 0.75, 2.25].forEach(x => b.box(0.16, 1.7, 0.08, 'timber', x, 1.6, 1.72));
    b.box(4.6, 0.16, 0.08, 'timber', 0, 1.6, 1.72); b.box(4.6, 0.16, 0.08, 'timber', 0, 3.2, 1.72);
    b.add(new THREE.BoxGeometry(0.12, 2.1, 0.08), 'timber', -1.5, 2.45, 1.73, 0, 0, 0.72);
    b.add(new THREE.BoxGeometry(0.12, 2.1, 0.08), 'timber', 1.5, 2.45, 1.73, 0, 0, -0.72);
    [-2.25, 2.25].forEach(x => b.box(0.08, 1.7, 3.4, 'timber', x * 1.03, 1.6, 0));
    b.gable(4.9, 3.4, 1.9, 'roofR', 0, 3.3, 0, 0, 0.35);
    b.box(0.8, 1.35, 0.1, 'door', 0.6, 0, 1.62);
    b.box(0.7, 0.6, 0.1, 'glow', -1.2, 0.55, 1.62);
    b.box(0.7, 0.6, 0.1, 'glow', -1.4, 2.2, 1.76); b.box(0.7, 0.6, 0.1, 'glow', 1.4, 2.2, 1.76);
    b.box(0.6, 2.4, 0.6, 'stone', 1.5, 3.6, -0.6);
    chimneyTop = new THREE.Vector3(1.5, 6.1, -0.6);
    /* 텃밭 울타리 */
    for(let i = 0; i < 7; i++) b.box(0.12, 0.7, 0.12, 'woodL', 2.6 + i * 0.5, 0, 2.2);
    b.box(3.2, 0.08, 0.06, 'woodL', 4.1, 0.45, 2.2); b.box(3.2, 0.08, 0.06, 'woodL', 4.1, 0.2, 2.2);
    for(let i = 0; i < 5; i++) b.add(new THREE.SphereGeometry(0.22, 7, 5), 'green', 2.9 + i * 0.6, 0.15, 1.3);
    for(let i = 0; i < 5; i++) b.add(new THREE.SphereGeometry(0.12, 6, 4), 'red', 2.9 + i * 0.6, 0.35, 1.25);
    placeSpot('intermediate', b.build(), 6.4, 2.8);
  }
  /* 4) 고급(CHALLENGE) — 산꼭대기 탑과 성벽 */
  let flag;
  {
    const b = builder(M);
    b.cyl(1.35, 1.5, 5.4, 'stone', 0, 0, 0, 16);
    for(let i = 0; i < 10; i++){ const a = i / 10 * Math.PI * 2; b.box(0.5, 0.55, 0.5, 'stone', Math.cos(a) * 1.4, 5.6, Math.sin(a) * 1.4, -a); }
    b.cyl(1.55, 1.55, 0.25, 'stone', 0, 5.35, 0, 16);
    b.cone(1.2, 2.2, 'slate', 0, 5.6, 0, 12);
    b.box(0.8, 1.5, 0.12, 'door', 0, 0, 1.46);
    [1.7, 3.4].forEach(y => b.box(0.35, 0.6, 0.1, 'glow', 0, y + 0.6, 1.43));
    b.box(0.3, 0.55, 0.1, 'glow', 0.9, 3.9, 1.12, 0.6);
    /* 낮은 성벽 고리 */
    for(let i = 0; i < 14; i++){ const a = i / 14 * Math.PI * 2; if(Math.abs(a - Math.PI / 2) < 0.4) continue; b.box(0.95, 0.9, 0.35, 'stone', Math.cos(a) * 2.3, -0.1, Math.sin(a) * 2.3, -a + Math.PI / 2); }
    b.cyl(0.04, 0.04, 1.5, 'iron', 0, 7.6, 0, 6);
    const grp = b.build();
    flag = new THREE.Mesh(track(new THREE.PlaneGeometry(0.9, 0.5, 6, 1).translate(0.45, 0, 0)), std('#e0503a', { side:THREE.DoubleSide }));
    flag.position.set(0.02, 8.85, 0); flag.castShadow = true; grp.add(flag);
    placeSpot('advanced', grp, 9.4, 2.4);
  }
  /* 5) 극장 — 기둥 정면 + 지붕 위 필름 릴 */
  let reel;
  {
    const b = builder(M);
    b.box(5.8, 0.3, 4.6, 'marble', 0, 0, 0);
    b.box(5.2, 3.4, 3.4, 'cream', 0, 0.3, -0.4);
    for(let i = 0; i < 4; i++) b.cyl(0.22, 0.26, 2.9, 'marble', -1.95 + i * 1.3, 0.3, 1.75, 12);
    b.box(5.6, 0.5, 4.1, 'marble', 0, 3.2, 0.05);
    b.gable(5.6, 4.1, 1.0, 'roofB', 0, 3.7, 0.05, Math.PI / 2, 0.25);
    b.box(1.6, 2.0, 0.1, 'door', 0, 0.3, 1.32);
    /* 간판(전구) */
    b.box(3.4, 0.55, 0.14, 'red', 0, 2.55, 1.35);
    for(let i = 0; i < 9; i++) b.add(new THREE.SphereGeometry(0.07, 6, 4), 'glow', -1.55 + i * 0.39, 2.82, 1.44);
    for(let i = 0; i < 3; i++) b.box(2.8 - i * 0.2, 0.2, 0.45, 'marble', 0, 0, 2.5 + i * 0.4);
    /* 필름 띠 */
    b.add(new THREE.TorusGeometry(1.6, 0.18, 6, 20, Math.PI * 0.9), 'film', 1.4, 4.2, -0.2, 0, 0.3, -0.2, 1, 1, 0.9);
    const grp = b.build();
    reel = new THREE.Group();
    const rb = builder(M);
    rb.add(new THREE.CylinderGeometry(1.35, 1.35, 0.3, 28), 'reel', 0, 0, 0, Math.PI / 2);
    rb.add(new THREE.CylinderGeometry(0.28, 0.28, 0.42, 12), 'film', 0, 0, 0, Math.PI / 2);
    for(let i = 0; i < 6; i++){ const a = i / 6 * Math.PI * 2; rb.add(new THREE.CylinderGeometry(0.34, 0.34, 0.34, 14), 'film', Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0, Math.PI / 2); }
    reel.add(rb.build()); reel.position.set(-0.9, 5.4, -0.6); grp.add(reel);
    placeSpot('_theater', grp, 7.4, 3.2);
  }
  /* 6) 꾸미기 옷장 — 마법사 천막 + 줄무늬 천막 + 옷걸이 */
  {
    const b = builder(M);
    b.cyl(1.9, 1.9, 1.6, 'wizard', 0, 0, 0, 16);
    b.cone(2.4, 3.2, 'wizard', 0, 1.6, 0, 16);
    b.add(new THREE.OctahedronGeometry(0.34, 0), 'gold', 0, 5.1, 0);
    b.box(0.9, 1.3, 0.12, 'glow', 0, 0, 1.88);
    /* 별 무늬 */
    for(let i = 0; i < 6; i++){ const a = i / 6 * Math.PI * 2 + 0.3; b.add(new THREE.OctahedronGeometry(0.13, 0), 'gold', Math.cos(a) * 1.93, 0.9 + (i % 2) * 0.35, Math.sin(a) * 1.93); }
    [[-3.6, 0.8, 'tentA', 1.2], [3.4, 0.9, 'tentB', 1.1], [-2.4, -2.6, 'tentC', 1.0], [2.4, -2.4, 'tentA', 0.95]].forEach(([x, z, m, r]) => {
      b.cyl(r, r, 1.0, m, x, 0, z, 12); b.cone(r * 1.2, 1.5, m, x, 1.0, z, 12);
      b.cyl(0.03, 0.03, 0.6, 'iron', x, 2.5, z, 4);
    });
    /* 옷걸이와 망토 */
    b.box(0.08, 1.5, 0.08, 'woodL', 1.6, 0, 2.6); b.box(0.08, 1.5, 0.08, 'woodL', 3.2, 0, 2.6); b.box(1.7, 0.07, 0.07, 'woodL', 2.4, 1.45, 2.6);
    [['red', 1.9], ['blue', 2.4], ['yellow', 2.9]].forEach(([m, x]) => b.add(new THREE.ConeGeometry(0.28, 0.9, 6), m, x, 0.95, 2.6));
    placeSpot('_closet', b.build(), 5.8, 3.4);
  }

  /* 정자(할아버지 자리) */
  {
    const b = builder(M);
    const gy = heightAt(GAZEBO[0], GAZEBO[1]);
    b.cyl(2.3, 2.4, 0.3, 'marble', 0, 0, 0, 8);
    for(let i = 0; i < 8; i++){ const a = i / 8 * Math.PI * 2 + Math.PI / 8; b.cyl(0.12, 0.12, 2.1, 'cream', Math.cos(a) * 1.9, 0.3, Math.sin(a) * 1.9, 8); }
    b.cone(2.9, 1.6, 'roofR', 0, 2.4, 0, 8, Math.PI / 8);
    b.cyl(2.4, 2.4, 0.18, 'woodL', 0, 2.3, 0, 8);
    b.cyl(0.7, 0.7, 0.08, 'woodL', 0, 0.9, 0, 12); b.cyl(0.1, 0.1, 0.6, 'woodL', 0, 0.3, 0, 6);
    const g = b.build(); g.position.set(GAZEBO[0], gy, GAZEBO[1]); scene.add(g);
    solids.push([GAZEBO[0], GAZEBO[1], 2.2]);
  }
  /* 분수 — 0 이 퐁퐁 솟는다 */
  const zeros = [];
  {
    const b = builder(M);
    const gy = heightAt(FOUNTAIN[0], FOUNTAIN[1]);
    b.add(new THREE.TorusGeometry(1.7, 0.22, 8, 28), 'stone', 0, 0.45, 0, Math.PI / 2);
    b.cyl(1.75, 1.8, 0.4, 'stoneD', 0, 0, 0, 28);
    b.cyl(0.3, 0.4, 1.3, 'marble', 0, 0.3, 0, 12);
    b.cyl(0.8, 0.5, 0.25, 'marble', 0, 1.5, 0, 16);
    const g = b.build(); g.position.set(FOUNTAIN[0], gy, FOUNTAIN[1]); scene.add(g);
    const wtop = new THREE.Mesh(new THREE.CircleGeometry(1.6, 28).rotateX(-Math.PI / 2), M.water); wtop.position.set(FOUNTAIN[0], gy + 0.62, FOUNTAIN[1]); scene.add(wtop);
    const wtop2 = new THREE.Mesh(new THREE.CircleGeometry(0.72, 20).rotateX(-Math.PI / 2), M.water); wtop2.position.set(FOUNTAIN[0], gy + 1.72, FOUNTAIN[1]); scene.add(wtop2);
    solids.push([FOUNTAIN[0], FOUNTAIN[1], 2.0]);
    const zt = track(canvasTex(64, 64, (c, w, h) => { c.font = 'bold 50px system-ui,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 6; c.strokeStyle = 'rgba(40,110,170,.8)'; c.strokeText('0', 32, 34); c.fillStyle = '#eaf7ff'; c.fillText('0', 32, 34); }));
    const zm = track(new THREE.SpriteMaterial({ map:zt, transparent:true, depthWrite:false }));
    for(let i = 0; i < 12; i++){
      const s = new THREE.Sprite(zm.clone()); track(s.material);
      s.scale.set(0.45, 0.45, 1); s.userData.t = i / 12 * 2.2; s.userData.a = rng() * 7; s.userData.r = 0.3 + rng() * 0.6;
      s.position.set(FOUNTAIN[0], gy + 1.8, FOUNTAIN[1]); scene.add(s); zeros.push(s);
    }
    anim.push((t, dt) => zeros.forEach(s => {
      s.userData.t += dt; const u = (s.userData.t % 2.2) / 2.2;
      if(u < dt / 2.2 + 0.001){ s.userData.a = rng() * 7; s.userData.r = 0.3 + rng() * 0.6; }
      s.position.set(FOUNTAIN[0] + Math.cos(s.userData.a) * s.userData.r * u * 1.4, gy + 1.8 + Math.sin(u * Math.PI) * 1.7, FOUNTAIN[1] + Math.sin(s.userData.a) * s.userData.r * u * 1.4);
      s.material.opacity = Math.sin(u * Math.PI); const k = 0.45 + u * 0.4; s.scale.set(k, k, 1);
    }));
    /* 동작 줄이기면 조용한 위치에 둔다 */
    zeros.forEach((s, i) => { const a = i / 12 * 7; s.position.set(FOUNTAIN[0] + Math.cos(a) * 0.4, gy + 2.1 + (i % 3) * 0.35, FOUNTAIN[1] + Math.sin(a) * 0.4); s.material.opacity = 0.8; });
  }

  /* 다리(강 위) */
  {
    const b = builder(M);
    const pts = 16;
    for(let i = 0; i < pts; i++){
      const x = 17.2 + i / (pts - 1) * 6.8, y = standY(x, -3);
      b.box(0.47, 0.22, 2.3, 'stone', x, y - 0.22, -3);
      if(i % 3 === 0){ b.box(0.24, 0.9, 0.24, 'stone', x, y - 0.1, -4.1); b.box(0.24, 0.9, 0.24, 'stone', x, y - 0.1, -1.9); }
    }
    for(let i = 0; i < pts - 1; i++){
      const xa = 17.2 + i / (pts - 1) * 6.8, xb = 17.2 + (i + 1) / (pts - 1) * 6.8, ya = standY(xa, -3), yb = standY(xb, -3);
      const ang = Math.atan2(yb - ya, xb - xa);
      [-4.1, -1.9].forEach(z => b.add(new THREE.BoxGeometry(0.5, 0.14, 0.18), 'stone', (xa + xb) / 2, (ya + yb) / 2 + 0.72, z, 0, 0, ang));
    }
    /* 아치 기둥 */
    b.add(new THREE.CylinderGeometry(0.6, 0.8, 2.6, 10), 'stoneD', 20.6, 0.1, -3);
    scene.add(b.build());
  }
  /* 관문 표지판 */
  function signpost(id, icon){
    const P = GATE_POS[id], gy = standY(P.x, P.z);
    const b = builder(M);
    b.cyl(0.12, 0.14, 2.6, 'wood', 0, 0, 0, 8);
    b.box(1.9, 0.5, 0.12, 'woodL', id === 'west' ? -0.55 : 0.55, 1.9, 0.08);
    b.box(1.5, 0.42, 0.12, 'woodL', id === 'west' ? 0.45 : -0.45, 1.3, 0.08);
    b.add(new THREE.ConeGeometry(0.3, 0.5, 4), 'woodL', id === 'west' ? -1.7 : 1.7, 2.15, 0.08, 0, 0, id === 'west' ? Math.PI / 2 : -Math.PI / 2);
    b.add(new THREE.SphereGeometry(0.34, 10, 8), 'gold', 0, 2.75, 0);
    const g = b.build(); g.position.set(P.x, gy, P.z);
    g.userData.gate = id; g.traverse(o => { if(o.isMesh) o.userData.gate = id; });
    scene.add(g); out.pickables.push(g);
    out.gates[id] = { group:g, center:new THREE.Vector3(P.x, gy + 1.6, P.z), anchor:new THREE.Vector3(P.x, gy + P.label, P.z) };
    solids.push([P.x, P.z, 0.6]);
    return g;
  }
  signpost('west'); signpost('east');
  /* 남쪽 항구 — 선착장 + 조각배(표지판과 한 몸으로 누른다) */
  let boat;
  {
    const g = signpost('south');
    const b = builder(M);
    const dy = 0.12 - g.position.y;
    for(let i = 0; i < 12; i++) b.box(0.34, 0.1, 1.6, 'wood', 1.6 + i * 0.4, dy, -1.8);
    for(let i = 0; i < 4; i++){ b.cyl(0.1, 0.1, 1.0, 'timber', 1.8 + i * 1.3, dy - 0.8, -2.55, 6); b.cyl(0.1, 0.1, 1.0, 'timber', 1.8 + i * 1.3, dy - 0.8, -1.05, 6); }
    g.add(b.build());
    const bb = builder(M);
    const hull = new THREE.CylinderGeometry(0.62, 0.62, 2.4, 14, 1, true, Math.PI / 2, Math.PI); hull.rotateZ(Math.PI / 2);
    bb.add(hull, 'wood', 0, 0.3, 0, 0, 0, 0, 1, 0.7, 1);
    bb.box(2.2, 0.08, 1.1, 'woodL', 0, -0.05, 0);
    bb.box(0.12, 0.08, 1.2, 'timber', 0.4, 0.2, 0);
    bb.add(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 5), 'timber', 0.3, 0.35, 0.6, 0.3, 0, 1.1);
    boat = bb.build(); boat.position.set(6.1, dy - 0.05, -0.2); boat.rotation.y = 0.2; g.add(boat);
    anim.push(t => { boat.position.y = dy - 0.05 + Math.sin(t * 1.3) * 0.05; boat.rotation.z = Math.sin(t * 1.1) * 0.04; });
  }

  /* ── 울타리(합친 한 덩어리) ─────────────── */
  {
    const b = builder(M);
    const fence = (pts) => resample(pts, 0.9).forEach(([x, z], i, arr) => {
      const y = heightAt(x, z);
      b.box(0.13, 0.75, 0.13, 'woodL', x, y, z);
      if(i){ const [px, pz] = arr[i - 1], py = heightAt(px, pz), len = Math.hypot(x - px, z - pz), ang = Math.atan2(x - px, z - pz), my = (y + py) / 2;
        b.add(new THREE.BoxGeometry(0.07, 0.08, len), 'woodL', (x + px) / 2, my + 0.55, (z + pz) / 2, 0, ang);
        b.add(new THREE.BoxGeometry(0.07, 0.08, len), 'woodL', (x + px) / 2, my + 0.3, (z + pz) / 2, 0, ang); }
    });
    fence([[-24.2, 6.4], [-24.8, 10.4], [-23.6, 14.4], [-20.4, 16.4], [-16, 16.8], [-11.6, 15.8]]);
    fence([[-10.4, 13.6], [-9.2, 9.8]]);
    fence([[-26.2, -4.6], [-26.6, -8.4], [-25.2, -11.6]]);
    fence([[16.2, -6.6], [16.8, -3.8]]);
    fence([[16.2, -2.0], [15.8, 1.2], [14.6, 4.2]]);
    fence([[24.6, -1.6], [25.4, 1.6], [26.8, 4.2]]);
    scene.add(b.build());
  }

  /* ── 나무(인스턴스) ───────────────────── */
  {
    const r2 = mkRng(23);
    const round = [], pine = [];
    const tryPlace = (x, z, kind, s) => {
      if(x < X0 + 1 || x > X1 - 1 || z < Z0 + 1 || z > Z1 - 1) return false;
      if(waterDist(x, z) < 0.9 || nearPath(x, z, 1.3 * s) || inSolid(x, z, 0.8 * s)) return false;
      for(const id in SPOT_POS){ const P = SPOT_POS[id]; if((P.x - x) ** 2 + (P.z - z) ** 2 < (P.r + 0.6) ** 2) return false; }
      if(Math.hypot(x - FOUNTAIN[0], z - FOUNTAIN[1]) < 4.6) return false;
      for(const id in GATE_POS){ const P = GATE_POS[id]; if((P.x - x) ** 2 + (P.z - z) ** 2 < 4) return false; }
      (kind ? pine : round).push([x, heightAt(x, z), z, s, r2()]);
      return true;
    };
    /* 마을 안 — 드문드문 */
    for(let i = 0; i < 1400 && round.length + pine.length < 240; i++){
      const x = X0 + 4 + r2() * (SX - 8), z = -30 + r2() * 58;
      const h = heightAt(x, z), slope = Math.abs(heightAt(x + 0.5, z) - heightAt(x - 0.5, z)) + Math.abs(heightAt(x, z + 0.5) - heightAt(x, z - 0.5));
      if(slope > 0.9) continue;
      const inTown = x > -24 && x < 18 && z > -16 && z < 18;
      if(inTown && r2() < 0.85) continue;
      const onMount = Math.hypot(x - MOUNT.cx, z - MOUNT.cz) < MOUNT.R;
      if(onMount && r2() < 0.85) continue;
      tryPlace(x, z, onMount || z < -20 || r2() < 0.3 ? 1 : 0, 0.8 + r2() * 0.6);
    }
    /* 먼 숲 */
    for(let i = 0; i < 260; i++){ const x = X0 + r2() * SX, z = Z0 + 2 + r2() * 16; tryPlace(x, z, 1, 1 + r2() * 0.7); }
    /* 산비탈의 전나무 */
    for(let i = 0; i < 26; i++){ const a = r2() * 7, rr = 5.5 + r2() * 4; tryPlace(MOUNT.cx + Math.cos(a) * rr, MOUNT.cz + Math.sin(a) * rr, 1, 0.7 + r2() * 0.4); }
    const foliage = mergeGeos([
      new THREE.IcosahedronGeometry(1.25, 1).translate(0, 2.4, 0),
      new THREE.IcosahedronGeometry(0.95, 0).translate(0.7, 2.0, 0.3),
      new THREE.IcosahedronGeometry(0.9, 0).translate(-0.6, 2.1, -0.2),
      new THREE.IcosahedronGeometry(0.8, 0).translate(0.1, 3.2, 0.1)]);
    const trunk = new THREE.CylinderGeometry(0.16, 0.24, 1.8, 6).translate(0, 0.9, 0);
    const pineG = mergeGeos([new THREE.ConeGeometry(1.1, 1.9, 8).translate(0, 1.7, 0), new THREE.ConeGeometry(0.85, 1.6, 8).translate(0, 2.6, 0), new THREE.ConeGeometry(0.55, 1.3, 8).translate(0, 3.4, 0)]);
    const pineTrunk = new THREE.CylinderGeometry(0.12, 0.18, 1.0, 5).translate(0, 0.5, 0);
    track(foliage); track(trunk); track(pineG); track(pineTrunk);
    const leafM = std('#ffffff', { flatShading:true, roughness:0.9 });
    const pineM = std('#ffffff', { flatShading:true, roughness:0.9 });
    const barkM = std('#7a5634');
    const inst = (geo, mat, list, colorFn) => {
      const im = new THREE.InstancedMesh(geo, mat, list.length);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color();
      list.forEach(([x, y, z, s, r], i) => {
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r * 6.28);
        m4.compose(new THREE.Vector3(x, y - 0.05, z), q, new THREE.Vector3(s, s * (0.9 + r * 0.25), s)); im.setMatrixAt(i, m4);
        if(colorFn){ colorFn(c, r, x, z); im.setColorAt(i, c); }
      });
      im.castShadow = true; im.receiveShadow = true; scene.add(im); return im;
    };
    const leafCols = ['#6fa84a', '#5d9a3e', '#86b852', '#4f8a3a', '#9cbf55'];
    inst(foliage, leafM, round, (c, r, x, z) => { c.set(leafCols[Math.floor(r * 5)]); if(x < -20 && z > 12 && r > 0.8) c.set('#d8733a'); });
    inst(trunk, barkM, round);
    inst(pineG, pineM, pine, (c, r) => c.set(['#3f7a45', '#4c8a4c', '#356b3e'][Math.floor(r * 3)]));
    inst(pineTrunk, barkM, pine);
  }

  /* ── 수풀 · 바위 ─────────────────────── */
  {
    const b = builder({ bush:std('#5f9a42', { flatShading:true }), rock:std('#a39480', { flatShading:true }) });
    const r2 = mkRng(31);
    for(let i = 0; i < 160; i++){
      const x = -28 + r2() * 56, z = -16 + r2() * 36;
      if(waterDist(x, z) < 0.4 || nearPath(x, z, 0.5) || inSolid(x, z, 0.4)) continue;
      let skip = false; for(const id in SPOT_POS){ const P = SPOT_POS[id]; if((P.x - x) ** 2 + (P.z - z) ** 2 < (P.r * 0.8) ** 2) skip = true; }
      if(skip) continue;
      const y = heightAt(x, z), s = 0.35 + r2() * 0.4;
      if(r2() < 0.25) b.add(new THREE.DodecahedronGeometry(s * 0.8, 0), 'rock', x, y + s * 0.3, z, r2(), r2(), r2(), 1, 0.7, 1);
      else b.add(new THREE.IcosahedronGeometry(s, 0), 'bush', x, y + s * 0.5, z, 0, r2() * 3, 0, 1.3, 0.8, 1.1);
    }
    scene.add(b.build());
  }

  /* ── 구름 ─────────────────────────────── */
  const clouds = [];
  {
    const cm = track(new THREE.MeshStandardMaterial({ color:'#ffffff', roughness:1, emissive:'#fff4e6', emissiveIntensity:0.35, flatShading:true }));
    const r2 = mkRng(41);
    for(let i = 0; i < 7; i++){
      const parts = [];
      const n = 4 + Math.floor(r2() * 3);
      for(let k = 0; k < n; k++){ const s = 1.3 + r2() * 1.3; parts.push(new THREE.IcosahedronGeometry(s, 1).translate(k * 1.5 - n * 0.75, r2() * 0.7, r2() * 1.2)); }
      const m = new THREE.Mesh(mergeGeos(parts), cm);
      m.scale.set(1, 0.62, 0.9);
      m.position.set(-50 + r2() * 100, 11 + r2() * 5, -27 - r2() * 14); m.scale.multiplyScalar(0.8 + r2() * 0.5);
      m.userData.v = 0.4 + r2() * 0.5;
      scene.add(m); clouds.push(m);
    }
    anim.push((t, dt) => clouds.forEach(c => { c.position.x += c.userData.v * dt; if(c.position.x > 75) c.position.x = -75; }));
  }
  /* 굴뚝 연기 */
  {
    const smM = track(new THREE.MeshStandardMaterial({ color:'#f2f0ea', transparent:true, opacity:0.7, roughness:1, depthWrite:false }));
    const sg = track(new THREE.IcosahedronGeometry(0.28, 1));
    const base = spotGroups.intermediate.localToWorld(chimneyTop.clone());
    const puffs = [];
    for(let i = 0; i < 6; i++){ const m = new THREE.Mesh(sg, smM.clone()); track(m.material); m.userData.t = i / 6 * 3; scene.add(m); puffs.push(m); m.position.copy(base); }
    anim.push((t, dt) => puffs.forEach(m => { m.userData.t += dt; const u = (m.userData.t % 3) / 3; m.position.set(base.x + u * 0.8, base.y + u * 2.2, base.z - u * 0.3); m.scale.setScalar(0.6 + u * 1.6); m.material.opacity = 0.6 * (1 - u); }));
  }
  anim.push(t => { if(reel) reel.rotation.z = -t * 0.6; if(flag){ const p = flag.geometry.attributes.position; for(let i = 0; i < p.count; i++){ const x = p.getX(i); p.setZ(i, Math.sin(x * 5 - t * 5) * 0.08 * x); } p.needsUpdate = true; } });

  /* 걸음 표시(탭한 자리) */
  const ping = new THREE.Mesh(track(new THREE.RingGeometry(0.35, 0.5, 24).rotateX(-Math.PI / 2)), track(new THREE.MeshBasicMaterial({ color:'#fff3b0', transparent:true, opacity:0, depthWrite:false })));
  ping.raycast = () => {};
  scene.add(ping);
  let pingT = 9;
  out.ping = (x, y, z) => { ping.position.set(x, y + 0.06, z); pingT = 0; ping.material.opacity = 0.9; ping.scale.setScalar(1); };
  anim.push((t, dt) => { if(pingT < 0.8){ pingT += dt; ping.material.opacity = Math.max(0, 0.9 * (1 - pingT / 0.8)); ping.scale.setScalar(1 + pingT * 1.5); } });

  out.wanderSpots = [PLACES.plaza, [-2, 5], [-10, 7], PLACES.numberland, [7.8, 12], [2, 14], [9, 2.5], [-14, 9]];
  out.animate = (t, dt) => { for(const f of anim) f(t, dt); };
  return out;
}
