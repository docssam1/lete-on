/* C46 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만 — scenes-c42·c47 의 수식 조각에 π·′ 와 좌표판·곡선 철사를 더함) ───────────── */

/* 글자 한 조각 — log·sin·cos·tan·lim 은 바로 선 글자, 라틴 문자와 π 는 수학 이탤릭, ′ 는 직접 그린다 */
function gtext(k, g, s, x, y, fs, draw){
  let cx = x;
  String(s).split(/(log|sin|cos|tan|lim|π|′)/).filter(r => r !== '').forEach(r => {
    /* 프라임(′) — 글꼴 글자는 자리가 어긋나서 가늘어지는 쐐기로 그린다 */
    if(r === '′'){ if(draw !== false){ g.beginPath(); g.moveTo(cx + fs * 0.14, y - fs * 0.74); g.lineTo(cx + fs * 0.25, y - fs * 0.72);
      g.lineTo(cx + fs * 0.1, y - fs * 0.34); g.lineTo(cx + fs * 0.07, y - fs * 0.35); g.closePath(); g.fill(); } cx += fs * 0.21; return; }
    if(r === 'π'){ g.font = `italic 400 ${fs}px ${k.MATH}`; const w = g.measureText('π').width;
      if(draw !== false){ const ta = g.textAlign; g.textAlign = 'left'; g.fillText('π', cx, y); g.textAlign = ta; } cx += w; return; }
    cx += k.mathText(g, r, cx, y, fs, { align:'left', draw, upright:/^(log|sin|cos|tan|lim)$/.test(r) });
  });
  return cx - x;
}
/* 수식 조각 — 문자열 | {sup}(윗첨자) | {sub}(아래첨자) | {r, idx}(근호) | {n, d}(분수) | {lim}(lim 아래 첨자)
   | {int:[아래, 위]}(적분 기호) | {c: 색, t: 조각들}(색 입힌 묶음). 도(°)는 작은 원으로 그린다 */
function mdraw(k, g, parts, x, cy, fs, draw){
  if(typeof parts === 'string') parts = [parts];
  let cx = x;
  parts.forEach(p => {
    if(typeof p === 'string'){
      p.split(/(°)/).filter(r => r !== '').forEach(r => { if(r === '°'){ if(draw !== false){ g.save(); g.lineWidth = fs * 0.055; g.beginPath(); g.arc(cx + fs * 0.13, cy - fs * 0.3, fs * 0.08, 0, Math.PI * 2); g.stroke(); g.restore(); } cx += fs * 0.26; }
        else cx += gtext(k, g, r, cx, cy, fs, draw); });
      return; }
    if(p.c){ const old = g.fillStyle, olds = g.strokeStyle; if(draw !== false){ g.fillStyle = g.strokeStyle = p.c; }
      cx += mdraw(k, g, p.t, cx, cy, fs, draw); if(draw !== false){ g.fillStyle = old; g.strokeStyle = olds; } return; }
    if(p.sup != null){ const sp = typeof p.sup === 'string' ? [p.sup] : p.sup, fr = sp.some(q => q && q.n);
      const s = fs * (fr ? 0.66 : 0.62), dy = fs * (fr ? 0.74 : 0.34);
      cx += mdraw(k, g, sp, cx + fs * 0.02, cy - dy, s, draw) + fs * 0.04; return; }
    if(p.sub != null){ cx += mdraw(k, g, p.sub, cx + fs * 0.02, cy + fs * 0.3, fs * 0.6, draw) + fs * 0.04; return; }
    if(p.lim != null){
      const s = fs * 0.5, wl = gtext(k, g, 'lim', 0, 0, fs, false), ws = mdraw(k, g, p.lim, 0, 0, s, false), W = Math.max(wl, ws);
      if(draw !== false){ gtext(k, g, 'lim', cx + (W - wl) / 2, cy, fs, true); mdraw(k, g, p.lim, cx + (W - ws) / 2, cy + fs * 0.78, s, true); }
      cx += W + fs * 0.18; return;
    }
    if(p.int != null){
      const s = fs * 0.62, wh = mdraw(k, g, p.int[1], 0, 0, s, false), wo = mdraw(k, g, p.int[0], 0, 0, s, false), iw = fs * 0.5, W = iw + Math.max(wh, wo) + fs * 0.08;
      if(draw !== false){
        const top = cy - fs * 1.0, bot = cy + fs * 1.0, xm = cx + iw * 0.5;
        g.save(); g.lineWidth = fs * 0.075; g.lineCap = 'round'; g.beginPath();
        g.moveTo(xm + fs * 0.26, top + fs * 0.08); g.bezierCurveTo(xm + fs * 0.12, top - fs * 0.12, xm + fs * 0.02, top + fs * 0.1, xm, cy);
        g.bezierCurveTo(xm - fs * 0.02, bot - fs * 0.1, xm - fs * 0.12, bot + fs * 0.12, xm - fs * 0.26, bot - fs * 0.08); g.stroke(); g.restore();
        mdraw(k, g, p.int[1], cx + iw + fs * 0.06, top + fs * 0.12, s, true); mdraw(k, g, p.int[0], cx + iw - fs * 0.04, bot - fs * 0.08, s, true);
      }
      cx += W + fs * 0.06; return;
    }
    if(p.r != null){
      const inner = typeof p.r === 'string' ? [p.r] : p.r, hasSup = inner.some(q => q && q.sup != null);
      const top = hasSup ? 0.8 : 0.62;
      const iw = p.idx ? mdraw(k, g, p.idx, 0, 0, fs * 0.5, false) : 0, off = p.idx ? Math.max(0, iw - fs * 0.22) : 0;
      const rw = mdraw(k, g, inner, 0, 0, fs, false), lw = fs * 0.62, W = off + lw + rw + fs * 0.12;
      if(draw !== false){
        const x0 = cx + off;
        g.save(); g.lineWidth = fs * 0.065; g.lineJoin = 'round'; g.lineCap = 'round';
        g.beginPath(); g.moveTo(x0 + fs * 0.04, cy + fs * 0.06); g.lineTo(x0 + fs * 0.16, cy - fs * 0.02);
        g.lineTo(x0 + fs * 0.34, cy + fs * 0.46); g.lineTo(x0 + fs * 0.56, cy - fs * top); g.lineTo(cx + W, cy - fs * top); g.stroke(); g.restore();
        if(p.idx) mdraw(k, g, p.idx, cx, cy - fs * 0.36, fs * 0.5, true);
        mdraw(k, g, inner, x0 + lw + fs * 0.04, cy + fs * 0.04, fs, true);
      }
      cx += W + fs * 0.04; return;
    }
    if(p.n != null){
      const s = fs * 0.8, wn = mdraw(k, g, p.n, 0, 0, s, false), wd = mdraw(k, g, p.d, 0, 0, s, false), W = Math.max(wn, wd) + fs * 0.3;
      if(draw !== false){
        mdraw(k, g, p.n, cx + (W - wn) / 2, cy - fs * 0.56, s, true);
        mdraw(k, g, p.d, cx + (W - wd) / 2, cy + fs * 0.62, s, true);
        g.save(); g.lineWidth = fs * 0.065; g.beginPath(); g.moveTo(cx + fs * 0.06, cy); g.lineTo(cx + W - fs * 0.06, cy); g.stroke(); g.restore();
      }
      cx += W + fs * 0.06;
    }
  });
  return cx - x;
}
function mtex(k, parts, pw, ph, o){
  o = o || {};
  return k.canvasTex(pw, ph, (g, w, h) => {
    g.fillStyle = o.bg || '#f3e7cf'; g.fillRect(0, 0, w, h);
    g.fillStyle = g.strokeStyle = o.color || '#2b2118'; g.textBaseline = 'middle';
    let fs = h * (o.hmax || 0.5); const tw = mdraw(k, g, parts, 0, 0, fs, false);
    if(tw > w * (o.fill || 0.84)) fs *= w * (o.fill || 0.84) / tw;
    const W = mdraw(k, g, parts, 0, 0, fs, false);
    mdraw(k, g, parts, (w - W) / 2, h / 2 + (o.dy || 0) * h, fs, true);
  });
}
/* 수식 카드 — o.glow 면 윗면이 빛날 수 있다(userData.mat.emissiveIntensity) */
function mcard(k, parts, x, z, o){
  o = o || {};
  const { THREE, scene } = k;
  const w = o.w || 1.0, d = o.d || 0.8, h = o.h || 0.04, pw = 1024, ph = Math.round(1024 * d / w);
  const grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, Math.min(0.04, d * 0.1)), new THREE.MeshStandardMaterial({ color:o.edge || '#e9dcc0', roughness:0.85 }));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  const tex = mtex(k, typeof parts === 'string' ? [parts] : parts, pw, ph, Object.assign({ hmax:0.5, fill:0.86 }, o));
  const mat = new THREE.MeshStandardMaterial({ map:tex, roughness:0.8 });
  if(o.glow){ mat.emissive = new THREE.Color('#ffd89a'); mat.emissiveMap = tex; mat.emissiveIntensity = 0; }
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), mat);
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
  grp.position.set(x, o.y == null ? 0.035 : o.y, z); grp.rotation.y = o.rot || 0; scene.add(grp);
  grp.userData.mat = mat; grp.userData.y0 = grp.position.y; return grp;
}
/* 카드가 톡 떠오르며 빛남 */
const pop = (c, p, a, b, hh) => { c.position.y = c.userData.y0 + (hh || 0.12) * hop(p, a, b); if(c.userData.mat.emissive) c.userData.mat.emissiveIntensity = 0.5 * hop(p, a, b); };
/* 구슬 */
function bead(k, color, r){
  const m = new k.THREE.Mesh(new k.THREE.SphereGeometry(r || 0.085, 24, 16), new k.THREE.MeshPhysicalMaterial({ color, roughness:0.22, clearcoat:1 }));
  m.castShadow = true; k.scene.add(m); return m;
}
/* 좌표판 — 나무판 위 모눈종이. x0~x1, y0~y1, 한 칸 ux·uy(월드 길이), 모눈 간격 gx·gy.
   눈금 xs·ys 는 수 또는 [값, 수식 조각]. o.draw(g, X, Y, ppu) 로 판에 덧그림(점선 등). P(x, y, h) → 판 위 월드 좌표 */
function board(k, o){
  const { THREE, scene } = k;
  const ux = o.ux || o.u, uy = o.uy || o.u, gx = o.gx || 1, gy = o.gy || 1;
  const W = (o.x1 - o.x0) * ux, D = (o.y1 - o.y0) * uy, cx = o.cx || 0, cz = o.cz || 0;
  const ppu = 1800 / Math.max(W, D);
  const tex = k.canvasTex(Math.round(W * ppu), Math.round(D * ppu), (g, w, h) => {
    const X = x => (x - o.x0) * ux * ppu, Y = y => (o.y1 - y) * uy * ppu;
    g.fillStyle = '#efe6d2'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(80,110,140,.3)'; g.lineWidth = 2.5;
    for(let x = Math.ceil(o.x0 / gx) * gx; x <= o.x1 + 1e-9; x += gx){ g.beginPath(); g.moveTo(X(x), 0); g.lineTo(X(x), h); g.stroke(); }
    for(let y = Math.ceil(o.y0 / gy) * gy; y <= o.y1 + 1e-9; y += gy){ g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(w, Y(y)); g.stroke(); }
    g.strokeStyle = '#2b2118'; g.fillStyle = '#2b2118'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(0, Y(0)); g.lineTo(w, Y(0)); g.moveTo(X(0), 0); g.lineTo(X(0), h); g.stroke();
    const fs = (o.fs || 0.2) * ppu, tk = fs * 0.28;
    g.lineWidth = 4; g.textBaseline = 'middle';
    const lab = (t, x, y, al) => { const tw = mdraw(k, g, t, 0, 0, fs, false); mdraw(k, g, t, al === 'right' ? x - tw : x - tw / 2, y, fs, true); };
    const nm = v => v < 0 ? '−' + (-v) : String(v);
    (o.xs || []).forEach(e => { const [x, t] = Array.isArray(e) ? e : [e, nm(e)];
      g.beginPath(); g.moveTo(X(x), Y(0) - tk); g.lineTo(X(x), Y(0) + tk); g.stroke(); lab(t, X(x), Y(0) + fs * (o.xlo || 0.85)); });
    (o.ys || []).forEach(e => { const [y, t] = Array.isArray(e) ? e : [e, nm(e)];
      g.beginPath(); g.moveTo(X(0) - tk, Y(y)); g.lineTo(X(0) + tk, Y(y)); g.stroke(); lab(t, X(0) - fs * 0.45, Y(y), 'right'); });
    lab('O', X(0) - fs * 0.5, Y(0) + fs * 0.85);
    k.mathText(g, 'x', w - fs * 0.6, Y(0) - fs * 0.75, fs * 1.2);
    k.mathText(g, 'y', X(0) + fs * 0.7, fs * 0.8, fs * 1.2);
    if(o.draw){ g.save(); o.draw(g, X, Y, ppu, fs); g.restore(); }
  });
  const slab = new THREE.Mesh(k.rbox(W + 0.24, 0.08, D + 0.24, 0.06), k.woodMat('#8a5a33', [50, 25, 10]));
  slab.position.set(cx, 0, cz); slab.castShadow = slab.receiveShadow = true; scene.add(slab);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map:tex, roughness:0.85 }));
  face.rotation.x = -Math.PI / 2; face.position.set(cx, 0.081, cz); face.receiveShadow = true; scene.add(face);
  const P = (x, y, hh) => new THREE.Vector3(cx - W / 2 + (x - o.x0) * ux, hh == null ? 0.13 : hh, cz - D / 2 + (o.y1 - y) * uy);
  return { P, W, D, ux, uy };
}
/* 판 위 점선(캔버스) */
const dash = (g, ppu, pts, col) => { g.save(); g.strokeStyle = col || 'rgba(154,61,18,.85)'; g.lineWidth = ppu * 0.018; g.setLineDash([ppu * 0.07, ppu * 0.05]);
  g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore(); };
/* 곡선 철사 — 함수 f 를 x a~b 로 따라 */
function curve(k, B, f, a, b, mat, r, n){
  const { THREE } = k; const pts = [];
  for(let i = 0; i <= (n || 60); i++){ const x = a + (b - a) * i / (n || 60); pts.push(B.P(x, f(x))); }
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), (n || 60) * 3, r || 0.03, 12), mat);
  m.castShadow = true; k.scene.add(m);
  [pts[0], pts[pts.length - 1]].forEach(p => { const c = new THREE.Mesh(new THREE.SphereGeometry((r || 0.03) * 1.05, 16, 12), mat); c.position.copy(p); k.scene.add(c); });
  return m;
}
/* 두 점 사이 막대(움직일 수 있게 set(a, b)) */
function stick(k, mat, r){
  const { THREE } = k;
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r || 0.03, r || 0.03, 1, 16), mat); m.castShadow = true; k.scene.add(m);
  const caps = [0, 1].map(() => { const c = new THREE.Mesh(new THREE.SphereGeometry(r || 0.03, 16, 12), mat); c.castShadow = true; k.scene.add(c); return c; });
  const up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3();
  m.set = (a, b) => { d.subVectors(b, a); const L = d.length(); m.scale.set(1, Math.max(L, 1e-4), 1);
    m.position.addVectors(a, b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(up, d.normalize()); caps[0].position.copy(a); caps[1].position.copy(b); };
  m.caps = caps; return m;
}
/* 압정 — 둥근 머리 + 짧은 바늘 */
function pin(k, p, color){
  const { THREE, scene } = k;
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), new THREE.MeshPhysicalMaterial({ color, roughness:0.25, clearcoat:1 })); head.position.y = 0.12;
  const nd = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), k.metal('#c9c3b5', 0.25)); nd.position.y = 0.05;
  [head, nd].forEach(m => { m.castShadow = true; g.add(m); });
  g.position.set(p.x, 0.08, p.z); scene.add(g); return g;
}
const RUST = '#9a3d12', BLUE = '#2f5f8f', GREEN = '#dcebd9', GEDGE = '#c9d6b5';
/* 나무 정육면체(모서리 둥근) */
function cube(k, s, h, mat){
  const m = new k.THREE.Mesh(k.rbox(s, h, s, 0.03), mat); m.castShadow = m.receiveShadow = true; return m;
}

export const SCENES_C46 = {

  /* 지수방정식 — hook: 2ˣ = 8, 8 = 2³ 이니 2ˣ = 2³, 밑이 같으면 x = 3. stage ②: 2ˣ = 16 = 2⁴ → x = 4.
     나무 정육면체 8 개 = 2 × 2 × 2 (한 줄 2 → 판 4 → 입체 8) */
  'M-52': { seed:452, caps:{ P:10, list:[
    [0.0, "$2^x=8$에서 $8$을 $2$의 거듭제곱으로 바꿉니다: $2\\times2\\times2=8$", "In $2^x=8$, write $8$ as a power of $2$: $2\\times2\\times2=8$", "在$2^x=8$中，把$8$写成$2$的幂：$2\\times2\\times2=8$"],
    [0.14, "$2^1=2$, $2^2=4$, $2^3=8$ — 그래서 $8=2^3$입니다.", "$2^1=2$, $2^2=4$, $2^3=8$, so $8=2^3$.", "$2^1=2$，$2^2=4$，$2^3=8$——所以$8=2^3$。"],
    [0.6, "$2^x=2^3$ — 밑이 같으니 지수도 같아서 $x=3$입니다.", "$2^x=2^3$: the bases match, so the exponents match, and $x=3$.", "$2^x=2^3$——底数相同，指数也相同，所以$x=3$。"],
    [0.82, "$2^x=16=2^4$이면 같은 방법으로 $x=4$입니다.", "If $2^x=16=2^4$, the same way gives $x=4$.", "若$2^x=16=2^4$，同样的方法得$x=4$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.1, 0.25, 0.1], 6.3, 60);
    k.table();
    /* 정육면체 8 개 — 2 × 2 × 2 */
    const S = 0.5, G = 0.03, CX = -1.65, CZ = -0.35, mats = [k.woodMat('#d9a466', [120, 80, 40]), k.woodMat('#c48a52', [110, 70, 35])];
    const cubes = [], home = [];
    for(let l = 0; l < 2; l++) for(let j = 0; j < 2; j++) for(let i = 0; i < 2; i++){
      const m = cube(k, S, S, mats[(i + j + l) % 2]);
      const P0 = new THREE.Vector3(CX + (i - 0.5) * (S + G), l * (S + G), CZ + (j - 0.5) * (S + G));
      m.position.copy(P0); scene.add(m); cubes.push(m); home.push(P0);
    }
    /* 쌓이는 순서 — 한 줄 2 개(2¹) → 판 4 개(2²) → 입체 8 개(2³) */
    const order = [[0, 1], [2, 3], [4, 5, 6, 7]];
    const small = [['2', { sup:'1' }, ' = 2'], ['2', { sup:'2' }, ' = 4'], ['2', { sup:'3' }, ' = 8']].map((t, i) =>
      mcard(k, t, CX - 1.0 + i * 1.0, 1.2, { w:0.94, d:0.58, hmax:0.44, glow:true }));
    /* 오른쪽 식 카드 */
    const RX = 1.6;
    const c1 = mcard(k, ['2', { sup:'x' }, ' = 8'], RX, -1.45, { w:2.2, d:0.72, hmax:0.46, glow:true });
    const c2 = mcard(k, ['2', { sup:[{ c:RUST, t:'x' }] }, ' = 2', { sup:[{ c:RUST, t:'3' }] }], RX, -0.55, { w:2.2, d:0.72, hmax:0.46, glow:true });
    const c3 = mcard(k, [{ c:RUST, t:'x = 3' }], RX, 0.35, { w:2.2, d:0.72, hmax:0.46, bg:GREEN, edge:GEDGE, glow:true });
    const c4 = mcard(k, ['2', { sup:'x' }, ' = 16 = 2', { sup:'4' }, '  ⇒  x = 4'], RX, 1.25, { w:2.6, d:0.66, hmax:0.44, fill:0.92, glow:true });
    /* 움직임: 정육면체가 모두 떠올라 흩어졌다가 2 → 4 → 8 순서로 내려앉아 쌓이고(작은 카드가 차례로) → 식 카드 */
    const lift = cubes.map((m, n) => new THREE.Vector3(CX + 1.2 + (n % 4) * 0.12, 1.6 + Math.floor(n / 4) * 0.1, CZ - 0.9));
    k.onFrame(t => { const p = cyc(t, 10);
      pop(c1, p, 0.0, 0.12);
      order.forEach((grp, gi) => { const a = 0.16 + gi * 0.13;
        grp.forEach((n, q) => { const m = cubes[n];
          const out = seg(p, 0.03 + n * 0.008, 0.1 + n * 0.008) * (1 - seg(p, a + q * 0.015, a + 0.08 + q * 0.015));
          m.position.lerpVectors(home[n], lift[n], out); m.visible = out < 0.97; }); });
      small.forEach((c, i) => pop(c, p, 0.2 + i * 0.13, 0.32 + i * 0.13));
      pop(c2, p, 0.6, 0.72); pop(c3, p, 0.68, 0.8); pop(c4, p, 0.82, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[-0.5, 7, 2], spotAt:[-0.5, 0, 0], envOpts:{ intensity:0.7 } });
  }},

  /* 로그방정식 — hook: log₂(2x+1) = 3 은 "2 를 3 번 곱하면 (2x+1)" → 2x+1 = 2³ = 8. stage ①: 2x = 7, x = 7/2 */
  'M-53': { seed:453, caps:{ P:10, list:[
    [0.0, "$\\log_2(2x+1)=3$은 $2$를 $3$번 곱하면 $2x+1$이 된다는 뜻입니다.", "$\\log_2(2x+1)=3$ means multiplying $2$ three times gives $2x+1$.", "$\\log_2(2x+1)=3$的意思是$2$连乘$3$次得到$2x+1$。"],
    [0.3, "그래서 $2x+1=2^3=8$입니다.", "So $2x+1=2^3=8$.", "所以$2x+1=2^3=8$。"],
    [0.52, "$2x=8-1=7$이니 $x=\\dfrac{7}{2}$입니다.", "$2x=8-1=7$, so $x=\\dfrac{7}{2}$.", "$2x=8-1=7$，所以$x=\\dfrac{7}{2}$。"],
    [0.76, "로그와 지수는 서로 반대 방향입니다 — 로그방정식은 지수로 바꿔 풉니다.", "Logarithms and exponents run in opposite directions: turn a log equation into an exponent equation.", "对数和指数方向相反——把对数方程改写成指数来解。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0, 0.1], 6.4, 58);
    k.table();
    /* 뒷줄: 나무 블록 2 × 2 × 2 = 8 */
    const twos = [-2.1, -1.0, 0.1].map(x => k.tile('2', x, -1.35, { w:0.72, d:0.72, h:0.22, size:330 }));
    [-1.55, -0.45].forEach(x => mcard(k, '×', x, -1.35, { w:0.36, d:0.36, hmax:0.6 }));
    mcard(k, '=', 0.75, -1.35, { w:0.36, d:0.36, hmax:0.6 });
    const eight = k.tile('8', 1.45, -1.35, { w:0.82, d:0.82, h:0.26, size:340, color:RUST, wood:'#e0bf8c' });
    /* 가운데 줄: 로그 ⇔ 지수 */
    const cA = mcard(k, ['log', { sub:'2' }, '(2x + 1) = 3'], -1.35, -0.2, { w:2.5, d:0.8, hmax:0.42, glow:true });
    mcard(k, '⇔', 0.2, -0.2, { w:0.5, d:0.5, hmax:0.5 });
    const cB = mcard(k, ['2x + 1 = 2', { sup:'3' }, ' = 8'], 1.7, -0.2, { w:2.3, d:0.8, hmax:0.42, glow:true });
    /* 앞줄: 풀이 */
    const cC = mcard(k, ['2x = 8 − 1 = 7'], -1.0, 1.0, { w:2.3, d:0.8, hmax:0.42, glow:true });
    const cD = mcard(k, ['x = ', { n:'7', d:'2' }], 1.35, 1.0, { w:1.7, d:1.0, hmax:0.36, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: log 카드 → 2 블록 셋이 하나씩 튀어(2 를 3 번 곱해) → 8 블록 → 지수 식 → 2x = 7 → x = 7/2 */
    const ty = twos.map(m => m.position.y), ey = eight.position.y;
    k.onFrame(t => { const p = cyc(t, 10);
      pop(cA, p, 0.0, 0.14);
      twos.forEach((m, i) => { m.position.y = ty[i] + 0.25 * hop(p, 0.12 + i * 0.05, 0.2 + i * 0.05); });
      eight.position.y = ey + 0.3 * hop(p, 0.28, 0.38);
      pop(cB, p, 0.3, 0.46); pop(cC, p, 0.5, 0.62); pop(cD, p, 0.58, 0.74);
      pop(cA, p, 0.78, 0.9, 0.08); pop(cB, p, 0.82, 0.94, 0.08); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 지수·로그 부등식 — hook: 2¹ = 2, 2² = 4, 2³ = 8 … x 가 커질수록 2ˣ 도 커진다(증가함수) → 2ˣ > 2³ 이면 x > 3.
     stage ①: 3ˣ ≥ 3⁴ → x ≥ 4. 블록 기둥 높이 = 2ˣ, 유리판 = 2³ 의 높이 */
  'M-54': { seed:454, caps:{ P:10, list:[
    [0.0, "$2^1=2$, $2^2=4$, $2^3=8$, $2^4=16$ — $x$가 커질수록 $2^x$도 커집니다.", "$2^1=2$, $2^2=4$, $2^3=8$, $2^4=16$: as $x$ grows, $2^x$ grows.", "$2^1=2$，$2^2=4$，$2^3=8$，$2^4=16$——$x$越大，$2^x$也越大。"],
    [0.44, "유리판 높이가 $2^3=8$입니다. 그보다 높이 솟은 기둥은 $x=4$뿐입니다.", "The glass is at height $2^3=8$. Only the $x=4$ column rises above it.", "玻璃板的高度是$2^3=8$。只有$x=4$的柱子高出它。"],
    [0.62, "그래서 $2^x>2^3$이면 $x>3$ — 증가함수는 부등호 방향을 그대로 둡니다.", "So $2^x>2^3$ means $x>3$: an increasing function keeps the inequality's direction.", "所以$2^x>2^3$就是$x>3$——增函数保持不等号方向。"],
    [0.82, "$3^x\\ge 3^4$도 밑 $3$이 $1$보다 크니 $x\\ge 4$입니다.", "$3^x\\ge 3^4$: the base $3$ is greater than $1$, so $x\\ge 4$.", "$3^x\\ge 3^4$：底数$3$大于$1$，所以$x\\ge 4$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.3, 0.5, -0.1], 6.8, 38);
    k.table();
    /* 기둥 — 블록 하나 높이 H, x = 1~4 에 2ˣ 개 */
    const H = 0.14, S = 0.46, X0 = -2.6, DX = 1.0, Z0 = -0.2;
    const mats = [k.woodMat('#d9a466', [120, 80, 40]), k.woodMat('#c48a52', [110, 70, 35])];
    const hot = new THREE.MeshPhysicalMaterial({ color:'#d8a24a', roughness:0.4, clearcoat:0.5, emissive:new THREE.Color('#ff9a40'), emissiveIntensity:0 });
    const cols = [];
    [1, 2, 3, 4].forEach((x, ci) => {
      const grp = new THREE.Group(); grp.position.set(X0 + ci * DX, 0, Z0); scene.add(grp);
      for(let n = 0; n < 2 ** x; n++){ const m = cube(k, S, H * 0.96, n >= 8 ? hot : mats[n % 2]); m.position.y = n * H; grp.add(m); }
      cols.push(grp);
    });
    /* 유리판 — 높이 8 칸(2³) */
    const glassM = new THREE.MeshPhysicalMaterial({ color:'#cfe6f0', roughness:0.08, transmission:0.6, transparent:true, opacity:0.35, emissive:new THREE.Color('#9fd4ff'), emissiveIntensity:0 });
    const glass = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.02, 0.9), glassM); glass.position.set(X0 + 1.5 * DX, 8 * H, Z0); scene.add(glass);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.03, 0.03), k.metal('#b8b3a8', 0.3)); edge.position.set(X0 + 1.5 * DX, 8 * H, Z0 + 0.45); scene.add(edge);
    /* 기둥 앞 카드 */
    const labs = [['2', { sup:'1' }, ' = 2'], ['2', { sup:'2' }, ' = 4'], ['2', { sup:'3' }, ' = 8'], ['2', { sup:'4' }, ' = 16']].map((t, i) =>
      mcard(k, t, X0 + i * DX, 0.75, { w:0.9, d:0.52, hmax:0.44, glow:true }));
    /* 오른쪽 카드 */
    const c1 = mcard(k, ['2', { sup:'x' }, ' > 2', { sup:'3' }, ' ⇒ x > 3'], 2.45, -0.3, { w:2.3, d:0.72, hmax:0.46, fill:0.92, bg:GREEN, edge:GEDGE, glow:true });
    const c2 = mcard(k, ['3', { sup:'x' }, ' ≥ 3', { sup:'4' }, ' ⇒ x ≥ 4'], 2.45, 0.75, { w:2.3, d:0.72, hmax:0.46, fill:0.92, glow:true });
    /* 움직임: 기둥이 가라앉았다가 x = 1, 2, 3, 4 순서로 솟아오르고(카드가 차례로) → 유리판 위로 나온 블록이 빛나고 → 식 카드 */
    k.onFrame(t => { const p = cyc(t, 10);
      cols.forEach((g, i) => { const a = 0.1 + i * 0.08; g.scale.y = Math.max(0.001, 1 - seg(p, 0.02, 0.08) + seg(p, a, a + 0.08)); });
      labs.forEach((c, i) => pop(c, p, 0.12 + i * 0.08, 0.22 + i * 0.08));
      hot.emissiveIntensity = 0.55 * hop(p, 0.46, 0.66); glassM.emissiveIntensity = 0.35 * hop(p, 0.44, 0.6);
      pop(c1, p, 0.62, 0.78); pop(c2, p, 0.82, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 3], spotAt:[-0.5, 0.6, 0], envOpts:{ intensity:0.75 } });
  }},

  /* 사인법칙 — hook: 변 ÷ sin(대각) 은 어떤 삼각형이든 외접원의 지름 2R. stage ①: 6/sin30° = 6 ÷ 1/2 = 12.
     stage ②: 4/sin45° = 4√2. 원에 내접한 삼각형 — 꼭짓점이 원 위를 움직여도 원주각 30° · 지름 12 는 그대로 */
  'M-55': { seed:455, caps:{ P:10, list:[
    [0.0, "어떤 삼각형이든 $\\dfrac{a}{\\sin A}$는 외접원의 지름 $2R$과 같습니다.", "In any triangle, $\\dfrac{a}{\\sin A}$ equals the circumcircle's diameter $2R$.", "任何三角形中，$\\dfrac{a}{\\sin A}$都等于外接圆的直径$2R$。"],
    [0.22, "$\\sin 30^\\circ=\\dfrac{1}{2}$이니 $\\dfrac{6}{\\sin 30^\\circ}=6\\div\\dfrac{1}{2}=6\\times2=12$입니다.", "$\\sin 30^\\circ=\\dfrac{1}{2}$, so $\\dfrac{6}{\\sin 30^\\circ}=6\\div\\dfrac{1}{2}=6\\times2=12$.", "$\\sin 30^\\circ=\\dfrac{1}{2}$，所以$\\dfrac{6}{\\sin 30^\\circ}=6\\div\\dfrac{1}{2}=6\\times2=12$。"],
    [0.5, "꼭짓점이 원 위를 움직여도 그 각은 $30^\\circ$, 지름은 $2R=12$ 그대로입니다.", "Slide the vertex around the circle: the angle stays $30^\\circ$ and the diameter stays $2R=12$.", "顶点在圆上移动，那个角仍是$30^\\circ$，直径仍是$2R=12$。"],
    [0.78, "$\\dfrac{4}{\\sin 45^\\circ}=4\\div\\dfrac{\\sqrt{2}}{2}=4\\sqrt{2}$도 같은 방법입니다.", "$\\dfrac{4}{\\sin 45^\\circ}=4\\div\\dfrac{\\sqrt{2}}{2}=4\\sqrt{2}$ works the same way.", "$\\dfrac{4}{\\sin 45^\\circ}=4\\div\\dfrac{\\sqrt{2}}{2}=4\\sqrt{2}$也是同样的方法。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.05, 0, 0.05], 7.0, 62);
    k.table();
    const R = 1.45, OX = -1.55, OZ = -0.05;            /* 반지름 R ↔ 6, 지름 2R ↔ 12 */
    k.paper(3.9, 3.7, OX, OZ, 0.02);
    const pt = (th, y) => new THREE.Vector3(OX + R * Math.cos(th), y == null ? 0.07 : y, OZ - R * Math.sin(th));
    /* 외접원(황동 고리) + 지름(쇠막대) */
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.026, 16, 160), k.metal('#c9a14f', 0.3)); ring.rotation.x = Math.PI / 2; ring.position.set(OX, 0.06, OZ); ring.castShadow = true; scene.add(ring);
    const dia = stick(k, k.metal('#8a96a3', 0.3), 0.018); const DA = THREE.MathUtils.degToRad(160); dia.set(pt(DA, 0.065), pt(DA + Math.PI, 0.065));
    const ctr = bead(k, '#2b2118', 0.035); ctr.position.set(OX, 0.07, OZ);
    /* 삼각형 — B(240°), C(300°): 현 BC = R(중심각 60° → 원주각 30°) */
    const TB = THREE.MathUtils.degToRad(240), TC = THREE.MathUtils.degToRad(300), TA0 = THREE.MathUtils.degToRad(100);
    const red = k.lacquer('#8e1c16');
    const eBC = stick(k, k.lacquer('#2f5f8f'), 0.03), eAB = stick(k, red, 0.026), eAC = stick(k, red, 0.026);
    const vB = bead(k, '#2b2118', 0.06), vC = bead(k, '#2b2118', 0.06), vA = bead(k, '#e7b54a', 0.07);
    vB.position.copy(pt(TB, 0.09)); vC.position.copy(pt(TC, 0.09)); eBC.set(pt(TB, 0.09), pt(TC, 0.09));
    /* 원주각 표시(30° 호) */
    const arcG = new THREE.Group(), arcM = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.012, 8, 40, Math.PI / 6), k.metal('#2f7a4a', 0.35));
    arcM.rotation.x = -Math.PI / 2; arcG.add(arcM); scene.add(arcG);
    const angT = k.canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#2f7a4a'; g.strokeStyle = '#2f7a4a'; g.textBaseline = 'middle'; const W = mdraw(k, g, '30°', 0, 0, 84, false); mdraw(k, g, '30°', (w - W) / 2, h / 2, 84, true); });
    const ang = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.22), new THREE.MeshStandardMaterial({ map:angT, transparent:true, roughness:0.9 })); ang.rotation.x = -Math.PI / 2; scene.add(ang);
    const dirAng = v => Math.atan2(-v.z, v.x);
    const setA = th => { const A = pt(th, 0.09), B = pt(TB, 0.09), C = pt(TC, 0.09);
      vA.position.copy(A); eAB.set(A, B); eAC.set(A, C);
      let a1 = dirAng(B.clone().sub(A)), a2 = dirAng(C.clone().sub(A));
      if(((a2 - a1) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) > Math.PI) { const s = a1; a1 = a2; a2 = s; }
      arcG.position.set(A.x, 0.075, A.z); arcG.rotation.y = a1;
      const mid = a1 + Math.PI / 12; ang.position.set(A.x + 0.6 * Math.cos(mid), 0.07, A.z - 0.6 * Math.sin(mid)); };
    setA(TA0);
    /* 판 위 수: 변 6, 지름 12 */
    const num = (t, x, z, col) => { const tx = k.canvasTex(256, 128, (g, w, h) => { g.fillStyle = g.strokeStyle = col; g.textBaseline = 'middle'; const W = mdraw(k, g, t, 0, 0, 92, false); mdraw(k, g, t, (w - W) / 2, h / 2, 92, true); });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.22), new THREE.MeshStandardMaterial({ map:tx, transparent:true, roughness:0.9 })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.07, z); scene.add(m); return m; };
    num('6', OX, OZ + R + 0.2, '#2f5f8f');
    const DB = DA + Math.PI, DP = DA + Math.PI * 1.5; num('12', OX + 0.8 * R * Math.cos(DB) + 0.2 * Math.cos(DP), OZ - 0.8 * R * Math.sin(DB) - 0.2 * Math.sin(DP), '#4a5560');
    /* 오른쪽 카드 */
    const RX = 2.05;
    const c1 = mcard(k, [{ n:'6', d:'sin 30°' }, ' = 2R'], RX, -1.45, { w:2.2, d:0.9, hmax:0.34, glow:true });
    const c2 = mcard(k, ['6 ÷ ', { n:'1', d:'2' }, ' = 6 × 2 = 12'], RX, -0.4, { w:2.2, d:0.9, hmax:0.34, fill:0.9, glow:true });
    const c3 = mcard(k, ['2R = 12'], RX, 0.55, { w:2.2, d:0.72, hmax:0.44, bg:GREEN, edge:GEDGE, glow:true });
    const c4 = mcard(k, [{ n:'4', d:'sin 45°' }, ' = 4', { r:'2' }], RX, 1.5, { w:2.2, d:0.9, hmax:0.34, glow:true });
    /* 움직임: 식 카드 → 꼭짓점이 원 위를 한쪽 갔다 반대쪽 갔다 제자리(각 30° 와 지름은 그대로) → 4√2 카드 */
    k.onFrame(t => { const p = cyc(t, 10);
      pop(c1, p, 0.02, 0.18); pop(c2, p, 0.22, 0.36); pop(c3, p, 0.36, 0.5);
      const u = seg(p, 0.5, 0.78); setA(TA0 + THREE.MathUtils.degToRad(42) * Math.sin(2 * Math.PI * u));
      dia.position.y = 0.065 + 0.05 * hop(p, 0.6, 0.72);
      pop(c4, p, 0.8, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[-0.5, 7, 2], spotAt:[-0.5, 0, 0], envOpts:{ intensity:0.75 } });
  }},

  /* 코사인법칙 — hook: 피타고라스 정리(직각일 때만)를 어떤 각에서도. stage ①: b=3, c=4, A=90° → a=5.
     stage ②: b=3, c=8, A=60° → a² = 9 + 64 − 24 = 49, a = 7. 막대 삼각형 둘 */
  'M-56': { seed:456, caps:{ P:10, list:[
    [0.0, "코사인법칙 $a^2=b^2+c^2-2bc\\cos A$는 피타고라스 정리를 넓힌 것입니다.", "The law of cosines $a^2=b^2+c^2-2bc\\cos A$ extends the Pythagorean theorem.", "余弦定理$a^2=b^2+c^2-2bc\\cos A$是勾股定理的推广。"],
    [0.2, "$A=90^\\circ$면 $\\cos 90^\\circ=0$, $a^2=3^2+4^2=25$라서 $a=5$입니다.", "If $A=90^\\circ$, $\\cos 90^\\circ=0$, so $a^2=3^2+4^2=25$ and $a=5$.", "若$A=90^\\circ$，$\\cos 90^\\circ=0$，$a^2=3^2+4^2=25$，所以$a=5$。"],
    [0.52, "$A=60^\\circ$면 $\\cos 60^\\circ=\\dfrac{1}{2}$, $a^2=9+64-24=49$라서 $a=7$입니다.", "If $A=60^\\circ$, $\\cos 60^\\circ=\\dfrac{1}{2}$, so $a^2=9+64-24=49$ and $a=7$.", "若$A=60^\\circ$，$\\cos 60^\\circ=\\dfrac{1}{2}$，$a^2=9+64-24=49$，所以$a=7$。"],
    [0.8, "각이 $90^\\circ$가 아니면 $-2bc\\cos A$ 항이 남습니다.", "When the angle is not $90^\\circ$, the term $-2bc\\cos A$ remains.", "角不是$90^\\circ$时，$-2bc\\cos A$这一项会留下。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.05, 0, 0.1], 6.6, 60);
    k.table();
    const U = 0.36, Y = 0.075;                                   /* 1 ↔ U */
    const V = (x, z) => new THREE.Vector3(x, Y, z);
    const blueM = k.lacquer('#2f5f8f'), darkM = k.lacquer('#3b2a1e');
    const lab = (t, x, z, col, w) => { const tx = k.canvasTex(256, 128, (g, cw, ch) => { g.fillStyle = g.strokeStyle = col || '#2b2118'; g.textBaseline = 'middle'; const W = mdraw(k, g, t, 0, 0, 90, false); mdraw(k, g, t, (cw - W) / 2, ch / 2, 90, true); });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w || 0.5, (w || 0.5) / 2), new THREE.MeshStandardMaterial({ map:tx, transparent:true, roughness:0.9 })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.045, z); scene.add(m); return m; };
    k.paper(6.2, 2.5, 0, 0.05, 0.01);
    /* 왼쪽: b = 3, c = 4, A = 90° → a = 5 */
    const A1 = V(-2.7, 0.75), B1 = V(-2.7 + 4 * U, 0.75), C1 = V(-2.7, 0.75 - 3 * U);
    stick(k, darkM, 0.03).set(A1, B1); stick(k, darkM, 0.03).set(A1, C1);
    const a1 = stick(k, blueM, 0.034); a1.set(B1, C1);
    const sq = 0.16; stick(k, k.metal('#2f7a4a', 0.35), 0.008).set(V(A1.x + sq, A1.z), V(A1.x + sq, A1.z - sq)); stick(k, k.metal('#2f7a4a', 0.35), 0.008).set(V(A1.x, A1.z - sq), V(A1.x + sq, A1.z - sq));
    lab('4', (A1.x + B1.x) / 2, A1.z + 0.24); lab('3', A1.x - 0.24, (A1.z + C1.z) / 2); lab('5', (B1.x + C1.x) / 2 + 0.2, (B1.z + C1.z) / 2 - 0.2, '#2f5f8f');
    /* 오른쪽: b = 3, c = 8, A = 60° → a = 7 */
    const A2 = V(-0.35, 0.75), B2 = V(-0.35 + 8 * U, 0.75), C2 = V(-0.35 + 3 * U * 0.5, 0.75 - 3 * U * Math.sqrt(3) / 2);
    stick(k, darkM, 0.03).set(A2, B2); stick(k, darkM, 0.03).set(A2, C2);
    const a2 = stick(k, blueM, 0.034); a2.set(B2, C2);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.01, 8, 40, Math.PI / 3), k.metal('#2f7a4a', 0.35)); arc.rotation.x = -Math.PI / 2; arc.position.copy(A2); scene.add(arc);
    lab('60°', A2.x + 0.6, A2.z - 0.2, '#2f7a4a', 0.46);
    lab('8', (A2.x + B2.x) / 2, A2.z + 0.24); lab('3', (A2.x + C2.x) / 2 - 0.26, (A2.z + C2.z) / 2); lab('7', (B2.x + C2.x) / 2 + 0.16, (B2.z + C2.z) / 2 - 0.22, '#2f5f8f');
    [A1, B1, C1, A2, B2, C2].forEach(P => { const b = bead(k, '#e7b54a', 0.05); b.position.copy(P); });
    /* 카드 — 뒤: 공식, 앞: 두 결과 */
    const cF = mcard(k, ['a', { sup:'2' }, ' = b', { sup:'2' }, ' + c', { sup:'2' }, ' − 2bc cos A'], 0, -1.62, { w:3.4, d:0.72, hmax:0.46, glow:true });
    const c1 = mcard(k, ['3', { sup:'2' }, ' + 4', { sup:'2' }, ' = 25,  a = 5'], -1.9, 1.85, { w:2.5, d:0.66, hmax:0.44, fill:0.88, glow:true });
    const c2 = mcard(k, ['9 + 64 − 24 = 49,  a = 7'], 1.25, 1.85, { w:2.9, d:0.66, hmax:0.44, fill:0.88, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: 공식 → 왼쪽 빗변 a 가 들리며 5 → 오른쪽 a 가 들리며 7 → 공식이 한 번 더 */
    const lift = (st, P, Q, p, a, b) => { const up = new THREE.Vector3(0, 0.14 * hop(p, a, b), 0); st.set(P.clone().add(up), Q.clone().add(up)); };
    k.onFrame(t => { const p = cyc(t, 10);
      pop(cF, p, 0.02, 0.18);
      lift(a1, B1, C1, p, 0.2, 0.4); pop(c1, p, 0.26, 0.44);
      lift(a2, B2, C2, p, 0.52, 0.72); pop(c2, p, 0.58, 0.76);
      pop(cF, p, 0.8, 0.96, 0.08); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.1], envOpts:{ intensity:0.75 } });
  }},

  /* 삼각함수의 최대·최소와 주기 — hook: 그네가 가장 높이 올라갔다 가장 낮게 내려오기를 반복 = sin 곡선.
     stage ①: y = 3sin(2x) + 1 → 1 + 3 = 4, 1 − 3 = −2. stage ②: sin(2x) 의 주기 2π ÷ 2 = π */
  'M-57': { seed:457, caps:{ P:10, list:[
    [0.0, "그네처럼 오르내리는 $y=3\\sin 2x+1$은 중심 $1$에서 위아래로 $3$만큼 흔들립니다.", "Like a swing, $y=3\\sin 2x+1$ sways $3$ up and down around the center $1$.", "像秋千一样，$y=3\\sin 2x+1$围绕中心$1$上下摆动$3$。"],
    [0.2, "가장 낮을 때는 $1-3=-2$입니다.", "At its lowest it is $1-3=-2$.", "最低时是$1-3=-2$。"],
    [0.44, "가장 높을 때는 $1+3=4$입니다.", "At its highest it is $1+3=4$.", "最高时是$1+3=4$。"],
    [0.66, "$\\sin 2x$는 두 배 빠르니, 주기는 $2\\pi\\div 2=\\pi$입니다.", "$\\sin 2x$ runs twice as fast, so the period is $2\\pi\\div 2=\\pi$.", "$\\sin 2x$快一倍，所以周期是$2\\pi\\div 2=\\pi$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.2, 0.3, 0.55], 8.1, 58);
    k.table();
    const PI = Math.PI, f = x => 3 * Math.sin(2 * x) + 1;
    const B = board(k, { x0:-0.35, x1:2 * PI + 0.35, y0:-3.4, y1:5.4, ux:0.72, uy:0.4, gx:PI / 4, gy:1, cx:0.95, cz:-0.2, fs:0.2, xlo:1.05,
      xs:[[PI / 2, [{ n:'π', d:'2' }]], [PI, 'π'], [3 * PI / 2, [{ n:'3π', d:'2' }]], [2 * PI, '2π']], ys:[4, 1, -2],
      draw:(g, X, Y, ppu) => { dash(g, ppu, [[X(0), Y(4)], [X(2 * PI), Y(4)]]); dash(g, ppu, [[X(0), Y(-2)], [X(2 * PI), Y(-2)]]);
        dash(g, ppu, [[X(0), Y(1)], [X(2 * PI), Y(1)]], 'rgba(47,95,143,.6)'); } });
    curve(k, B, f, 0, 2 * PI, k.metal('#3f6fa0', 0.3), 0.03, 120);
    /* 주기 π 표시 — 꼭대기에서 다음 꼭대기까지(π/4 ~ 5π/4) 금빛 막대 */
    const gold = k.metal('#c9a14f', 0.3);
    const perY = 4.75, L0 = PI / 4, L1 = 5 * PI / 4;
    const pA = B.P(L0, perY, 0.12), pB = B.P(L1, perY, 0.12);
    const s0 = stick(k, gold, 0.02); s0.set(pA, pB);
    const tk = x => [B.P(x, perY - 0.3, 0.12), B.P(x, perY + 0.3, 0.12)];
    const t1 = stick(k, gold, 0.02); t1.set(...tk(L0));
    const t2 = stick(k, gold, 0.02); t2.set(...tk(L1));
    const perParts = [[s0, pA, pB], [t1, ...tk(L0)], [t2, ...tk(L1)]];
    /* 곡선을 타는 구슬 */
    const bd = bead(k, '#e7b54a', 0.085);
    /* 그네 — 왼쪽, 받침 기둥 둘 + 가로대(z 방향 축), 줄 둘 + 널 */
    const SX = -3.2, SZ = -0.35, TOP = 1.55, wood = k.woodMat('#8a5a33', [50, 25, 10]);
    [-0.5, 0.5].forEach(dz => [-0.38, 0.38].forEach(dx => { const leg = stick(k, wood, 0.035); leg.set(new THREE.Vector3(SX + dx, 0, SZ + dz), new THREE.Vector3(SX, TOP, SZ + dz)); }));
    const bar = stick(k, k.metal('#8a96a3', 0.3), 0.03); bar.set(new THREE.Vector3(SX, TOP, SZ - 0.56), new THREE.Vector3(SX, TOP, SZ + 0.56));
    const swing = new THREE.Group(); swing.position.set(SX, TOP, SZ); scene.add(swing);
    const rope = new THREE.MeshStandardMaterial({ color:'#d9c9a3', roughness:0.9 });
    [-0.22, 0.22].forEach(dz => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.2, 8), rope); r.position.set(0, -0.6, dz); r.castShadow = true; swing.add(r); });
    const seat = new THREE.Mesh(k.rbox(0.26, 0.05, 0.58, 0.03), k.woodMat('#c48a52', [110, 70, 35])); seat.position.set(0, -1.22, 0); seat.castShadow = true; swing.add(seat);
    const place = x => { bd.position.copy(B.P(x, f(x), 0.2)); swing.rotation.z = -0.5 * Math.sin(2 * x); };
    place(PI / 4);
    /* 앞줄 카드 */
    const CZ = 2.35;
    const c0 = mcard(k, ['y = 3 sin 2x + 1'], -2.55, CZ, { w:2.3, d:0.7, hmax:0.44, glow:true });
    const cLo = mcard(k, ['1 − 3 = −2'], -0.45, CZ, { w:1.7, d:0.7, hmax:0.44, glow:true });
    const cHi = mcard(k, ['1 + 3 = 4'], 1.35, CZ, { w:1.7, d:0.7, hmax:0.44, glow:true });
    const cP = mcard(k, ['2π ÷ 2 = π'], 3.2, CZ, { w:1.8, d:0.7, hmax:0.44, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: 구슬이 꼭대기(π/4)에서 곡선을 따라 한 주기 지나 다음 꼭대기(5π/4)까지 갔다 돌아오고, 그네가 같은 박자로 흔들린다.
       바닥(3π/4)을 지날 때 −2, 다음 꼭대기에서 4, 주기 막대가 들리며 π */
    k.onFrame(t => { const p = cyc(t, 10);
      const u = seg(p, 0.04, 0.5) - seg(p, 0.56, 0.98);
      place(PI / 4 + PI * u);
      pop(c0, p, 0.0, 0.14); pop(cLo, p, 0.2, 0.36); pop(cHi, p, 0.44, 0.6); pop(cP, p, 0.66, 0.84);
      const up = new THREE.Vector3(0, 0.12 * hop(p, 0.66, 0.84), 0); perParts.forEach(([s, a, b]) => s.set(a.clone().add(up), b.clone().add(up))); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 3], spotAt:[0, 0, 0.3], envOpts:{ intensity:0.75 } });
  }},

};
