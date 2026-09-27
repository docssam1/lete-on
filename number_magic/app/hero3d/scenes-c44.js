/* C44 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
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

export const SCENES_C44 = {

  /* 함수의 극한값 — hook: f(x)=(x²−4)/(x−2) 에 x=2 를 넣으면 0/0, x=1.9, 1.99, 1.999… 로 다가가면?
     stage ②: 인수분해 (x−2)(x+2) 약분 → x+2 → 4. 그래프 y=x+2 에 (2, 4) 만 빈 구멍 */
  'M-43': { seed:443, caps:{ P:10, list:[
    [0.0, "$x=2$를 넣으면 $\\dfrac{2^2-4}{2-2}=\\dfrac{0}{0}$ — 계산할 수 없습니다.", "Plug in $x=2$: $\\dfrac{2^2-4}{2-2}=\\dfrac{0}{0}$, which cannot be computed.", "代入$x=2$：$\\dfrac{2^2-4}{2-2}=\\dfrac{0}{0}$，无法计算。"],
    [0.26, "$x=1.9,\;1.99,\;1.999$로 다가가면 값은 $3.9,\;3.99,\;3.999$입니다.", "Approach with $x=1.9,\;1.99,\;1.999$: the values are $3.9,\;3.99,\;3.999$.", "用$x=1.9,\;1.99,\;1.999$去靠近，值是$3.9,\;3.99,\;3.999$。"],
    [0.62, "분자를 $(x-2)(x+2)$로 인수분해해 약분하면 $x+2$, 그래서 $2+2=4$입니다.", "Factor the numerator as $(x-2)(x+2)$ and cancel: $x+2$, so $2+2=4$.", "把分子分解成$(x-2)(x+2)$再约分，得$x+2$，所以$2+2=4$。"],
    [0.8, "그래서 $\\lim_{x\\to 2}\\dfrac{x^2-4}{x-2}=4$입니다.", "So $\\lim_{x\\to 2}\\dfrac{x^2-4}{x-2}=4$.", "所以$\\lim_{x\\to 2}\\dfrac{x^2-4}{x-2}=4$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.2, 0, -0.05], 7.7, 68);
    k.table();
    const B = board(k, { x0:-0.6, x1:3.4, y0:-0.7, y1:6.4, ux:1.0, uy:0.56, cx:-1.45, cz:0.05, fs:0.2, xs:[1, 2, 3], ys:[1, 3, 4, 5, 6],
      draw:(g, X, Y, ppu) => { dash(g, ppu, [[X(2), Y(0)], [X(2), Y(4)], [X(0), Y(4)]]); } });
    /* y = x + 2 — x = 2 에서 끊긴 철사 두 도막 + 빈 고리(구멍) */
    const blue = k.metal('#3f6fa0', 0.3);
    curve(k, B, x => x + 2, -0.6, 1.9, blue, 0.03, 8); curve(k, B, x => x + 2, 2.1, 3.4, blue, 0.03, 8);
    const H = B.P(2, 4);
    const ringMat = new THREE.MeshPhysicalMaterial({ color:'#b3221a', roughness:0.3, clearcoat:1, emissive:new THREE.Color('#ff9a60'), emissiveIntensity:0 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.022, 16, 40), ringMat); ring.rotation.x = Math.PI / 2; ring.position.copy(H); ring.castShadow = true; scene.add(ring);
    /* 다가가는 구슬 — 보이는 자리(1.9 → 1.99 → 1.999 는 구멍 쪽으로 점점 좁혀 그린다) */
    const bd = bead(k, '#e7b54a', 0.065);
    const at = x => { const q = B.P(x, x + 2); bd.position.set(q.x, q.y + 0.02, q.z); };
    /* 카드: 0/0 · 다가가는 값 셋 · 극한 */
    const RX = 2.2;
    const c0 = mcard(k, [{ n:'2² − 4', d:'2 − 2' }, ' = ', { n:[{ c:RUST, t:'0' }], d:[{ c:RUST, t:'0' }] }], RX, -1.55, { w:2.1, d:0.95, hmax:0.3, glow:true });
    const vals = [['1.9', '3.9'], ['1.99', '3.99'], ['1.999', '3.999']].map((v, i) =>
      mcard(k, [v[0], ' → ', { c:BLUE, t:v[1] }], RX, -0.62 + i * 0.6, { w:2.1, d:0.5, hmax:0.46, glow:true }));
    const cL = mcard(k, [{ lim:'x → 2' }, ' ', { n:'x² − 4', d:'x − 2' }, ' = 4'], RX - 0.05, 1.62, { w:2.3, d:0.95, hmax:0.3, dy:-0.03, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: 0/0 카드 → 구슬이 물러났다가 1.9 · 1.99 · 1.999 로 한 걸음씩(값 카드가 차례로) → 구멍이 빛나고 → 극한 카드 → 구슬 제자리 */
    const SHOW = [1.9, 1.955, 1.972];
    at(SHOW[0]);
    k.onFrame(t => { const p = cyc(t, 10);
      pop(c0, p, 0.02, 0.2);
      let x = SHOW[0] - 0.7 * seg(p, 0.03, 0.16) + 0.7 * seg(p, 0.26, 0.34);
      x += (SHOW[1] - SHOW[0]) * seg(p, 0.42, 0.48) + (SHOW[2] - SHOW[1]) * seg(p, 0.54, 0.6);
      x -= (SHOW[2] - SHOW[0]) * seg(p, 0.88, 0.98);
      at(x);
      pop(vals[0], p, 0.32, 0.44); pop(vals[1], p, 0.46, 0.56); pop(vals[2], p, 0.58, 0.68);
      ringMat.emissiveIntensity = 0.8 * hop(p, 0.6, 0.8); ring.position.y = H.y + 0.08 * hop(p, 0.62, 0.76);
      pop(cL, p, 0.8, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 미분계수와 도함수 — hook: 평균 속도 → 간격을 0 에 가깝게 줄이면 순간의 기울기. stage ①: f′(x) = d/dx f(x).
     stage ②: f(x)=3x² → f′(x)=6x, f′(2)=12. 할선(두 점)이 접선(한 점)으로 */
  'M-44': { seed:444, caps:{ P:10, list:[
    [0.0, "평균 속도처럼, 곡선 위 두 점을 이은 직선의 기울기는 평균 변화율입니다.", "Like average speed, the slope of the line through two points on the curve is an average rate of change.", "就像平均速度，连接曲线上两点的直线斜率是平均变化率。"],
    [0.2, "두 점 사이 간격을 $0$에 가깝게 줄이면 순간의 기울기가 됩니다.", "Shrink the gap between the points toward $0$ and you get the instantaneous slope.", "把两点间的间隔缩小到接近$0$，就得到瞬间的斜率。"],
    [0.6, "$f(x)=3x^2$이면 $f'(x)=6x$, 그래서 $f'(2)=6\\times2=12$입니다.", "If $f(x)=3x^2$, then $f'(x)=6x$, so $f'(2)=6\\times2=12$.", "若$f(x)=3x^2$，则$f'(x)=6x$，所以$f'(2)=6\\times2=12$。"],
    [0.8, "$f'(x)$와 $\\dfrac{d}{dx}f(x)$는 같은 뜻을 가진 두 표기입니다.", "$f'(x)$ and $\\dfrac{d}{dx}f(x)$ are two notations for the same thing.", "$f'(x)$和$\\dfrac{d}{dx}f(x)$是同一个意思的两种记法。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([-0.15, 0, 0.0], 8.1, 68);
    k.table();
    const B = board(k, { x0:-0.5, x1:3.0, y0:-2, y1:22, ux:1.3, uy:0.18, gy:2, cx:-1.6, cz:0.05, fs:0.19, xs:[1, 2], ys:[4, 8, 12, 16, 20],
      draw:(g, X, Y, ppu) => { dash(g, ppu, [[X(2), Y(0)], [X(2), Y(12)], [X(0), Y(12)]]); } });
    const f = x => 3 * x * x;
    curve(k, B, f, -0.5, Math.sqrt(22 / 3), k.metal('#3f6fa0', 0.3), 0.03, 60);
    /* 접선 y = 12x − 12(금빛) — 할선이 다가갈 목표 */
    const gold = k.metal('#c9a14f', 0.3);
    stick(k, gold, 0.022).set(B.P(1.08, 12 * 1.08 - 12, 0.12), B.P(2.8, 12 * 2.8 - 12, 0.12));
    /* 할선 — Q(2−h, f(2−h)) 와 P(2, 12) 를 지나는 붉은 막대, 기울기 (12 − 3(2−h)²) ÷ h = 12 − 3h */
    const sec = stick(k, k.lacquer('#8e1c16'), 0.026);
    const pP = pin(k, B.P(2, 12), '#2f7a4a');
    const q = bead(k, '#e7b54a', 0.07);
    const setH = h => {
      const m = 12 - 3 * h, yAt = x => 12 + m * (x - 2);
      const xa = Math.max(-0.4, 2 + (0.5 - 12) / m), xb = Math.min(2.95, 2 + (21.5 - 12) / m);
      sec.set(B.P(xa, yAt(xa), 0.15), B.P(xb, yAt(xb), 0.15));
      q.position.copy(B.P(2 - h, f(2 - h), 0.16));
    };
    setH(1.2);
    /* 카드 */
    const RX = 2.3;
    const c1 = mcard(k, ['f′(x) = ', { n:'d', d:'dx' }, ' f(x)'], RX, -1.4, { w:2.5, d:0.95, hmax:0.3, glow:true });
    const c2 = mcard(k, ['f(x) = 3x', { sup:'2' }, ' ⇒ f′(x) = 6x'], RX, -0.25, { w:2.5, d:0.72, hmax:0.4, fill:0.92, glow:true });
    const c3 = mcard(k, ['f′(2) = 6 × 2 = 12'], RX, 0.85, { w:2.5, d:0.8, hmax:0.4, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: 구슬 Q 가 곡선을 따라 P 쪽으로 미끄러지며(h: 1.2 → 0.02) 붉은 할선이 금빛 접선에 겹쳐지고 → 카드 → 제자리 */
    k.onFrame(t => { const p = cyc(t, 10);
      const h = 1.2 - 1.18 * seg(p, 0.2, 0.56) + 1.18 * seg(p, 0.86, 0.98);
      setH(h);
      pP.position.y = 0.08 + 0.2 * hop(p, 0.54, 0.64);
      pop(c2, p, 0.6, 0.72); pop(c3, p, 0.68, 0.8); pop(c1, p, 0.8, 0.95); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 접선의 기울기와 방정식 — hook: 곡선 위 한 점에서 기울기는? stage ①: f(x)=x², f′(3)=6. stage ②: y=6(x−3)+9=6x−9 */
  'M-45': { seed:445, caps:{ P:10, list:[
    [0.0, "곡선 위 한 점의 기울기는 그 점에 살짝 닿는 직선, 접선의 기울기입니다.", "The slope at a point on a curve is the slope of the line that just touches it there: the tangent.", "曲线上一点的斜率，就是在该点轻轻接触曲线的直线——切线的斜率。"],
    [0.3, "$f(x)=x^2$이면 $f'(x)=2x$, 그래서 $f'(3)=2\\times3=6$입니다.", "If $f(x)=x^2$, then $f'(x)=2x$, so $f'(3)=2\\times3=6$.", "若$f(x)=x^2$，则$f'(x)=2x$，所以$f'(3)=2\\times3=6$。"],
    [0.52, "옆으로 $1$ 갈 때 위로 $6$ 오릅니다.", "Go $1$ across, and it rises $6$.", "横向走$1$，向上升$6$。"],
    [0.68, "점 $(3,\\,9)$를 지나니 $y=6(x-3)+9=6x-9$입니다.", "It passes through $(3,\\,9)$, so $y=6(x-3)+9=6x-9$.", "它经过点$(3,\\,9)$，所以$y=6(x-3)+9=6x-9$。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([-0.15, 0, 0.0], 8.1, 68);
    k.table();
    const B = board(k, { x0:-0.8, x1:4.4, y0:-10.5, y1:21, ux:0.95, uy:0.142, gy:3, cx:-1.55, cz:0.05, fs:0.19, xs:[1, 2, 3, 4], ys:[-9, 9, 18],
      draw:(g, X, Y, ppu, fs) => { dash(g, ppu, [[X(3), Y(0)], [X(3), Y(9)], [X(0), Y(9)]]);
        g.fillStyle = g.strokeStyle = '#2f7a4a';
        const l = (t, x, y) => { const w = mdraw(k, g, t, 0, 0, fs * 1.15, false); mdraw(k, g, t, x - w / 2, y, fs * 1.15, true); };
        l('1', X(3.5), Y(9) + fs * 0.8); l('6', X(4) + fs * 0.55, Y(12)); } });
    const f = x => x * x;
    curve(k, B, f, -0.8, Math.sqrt(21), k.metal('#3f6fa0', 0.3), 0.03, 60);
    const gold = k.metal('#c9a14f', 0.28);
    const tan = stick(k, gold, 0.026); const TA = B.P(-0.2, -10.2, 0.13), TB = B.P(4.4, 17.4, 0.13); tan.set(TA, TB);
    /* 기울기 삼각형 — (3, 9) → (4, 9) → (4, 15) */
    const green = k.metal('#2f7a4a', 0.35);
    const s1 = stick(k, green, 0.018), s2 = stick(k, green, 0.018);
    const T0 = B.P(3, 9, 0.12), T1 = B.P(4, 9, 0.12), T2 = B.P(4, 15, 0.12);
    s1.set(T0, T1); s2.set(T1, T2);
    const pT = pin(k, B.P(3, 9), '#b3221a');
    /* 곡선을 타고 와서 접선으로 굴러 나가는 구슬 */
    const bd = bead(k, '#e7b54a', 0.07);
    const place = s => { let x, y; if(s <= 1){ x = 1.6 + 1.4 * s; y = f(x); } else { x = 3 + 1.2 * (s - 1); y = 6 * x - 9; }
      bd.position.copy(B.P(x, y, 0.2)); };
    place(0);
    const RX = 2.35;
    const c1 = mcard(k, ['f(x) = x', { sup:'2' }, ' ⇒ f′(x) = 2x'], RX, -1.35, { w:2.5, d:0.72, hmax:0.4, fill:0.92, glow:true });
    const c2 = mcard(k, ['f′(3) = 2 × 3 = 6'], RX, -0.4, { w:2.5, d:0.72, hmax:0.4, fill:0.9, glow:true });
    const c3 = mcard(k, ['y = 6(x − 3) + 9 = 6x − 9'], RX, 0.75, { w:2.5, d:0.8, hmax:0.4, fill:0.92, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: 구슬이 곡선을 따라 (3, 9) 까지 → 압정이 톡 → 기울기 카드 → 삼각형(1 · 6)이 들리고 → 구슬이 접선을 타고 나갔다 → 접선 식 카드 → 되돌아옴 */
    k.onFrame(t => { const p = cyc(t, 10);
      const s = seg(p, 0.04, 0.26) + seg(p, 0.6, 0.72) - 2 * seg(p, 0.84, 0.98);
      place(s);
      pT.position.y = 0.08 + 0.2 * hop(p, 0.24, 0.34);
      pop(c1, p, 0.3, 0.42); pop(c2, p, 0.38, 0.52);
      const lift = 0.12 * hop(p, 0.52, 0.68);
      const up = new THREE.Vector3(0, lift, 0); s1.set(T0.clone().add(up), T1.clone().add(up)); s2.set(T1.clone().add(up), T2.clone().add(up));
      pop(c3, p, 0.68, 0.84); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 다항함수의 적분 — hook: 미분을 거꾸로, 곡선 아래 넓이. history: ∫ 는 S(summa) — 잘게 쪼갠 조각을 다 더한다.
     stage ①: ∫6x dx = 3x² + C. stage ②: ∫₁³ 6x dx = F(3) − F(1) = 27 − 3 = 24 */
  'M-46': { seed:446, caps:{ P:10, list:[
    [0.0, "$\\int 6x\\,dx=3x^2+C$ — 미분하면 $6x$가 되는 식을 거꾸로 찾습니다.", "$\\int 6x\\,dx=3x^2+C$: find, in reverse, what differentiates to $6x$.", "$\\int 6x\\,dx=3x^2+C$——反过来找求导后得$6x$的式子。"],
    [0.14, "$1$부터 $3$까지 잘게 쪼갠 조각들을 모두 더하면 넓이가 됩니다.", "Cut the region from $1$ to $3$ into thin strips and add them all: that is the area.", "把从$1$到$3$的部分切成细条再全部加起来，就是面积。"],
    [0.58, "$F(x)=3x^2$이니 $F(3)=27$, $F(1)=3$입니다.", "With $F(x)=3x^2$, $F(3)=27$ and $F(1)=3$.", "因为$F(x)=3x^2$，所以$F(3)=27$，$F(1)=3$。"],
    [0.76, "그래서 $\\int_{1}^{3}6x\\,dx=27-3=24$입니다.", "So $\\int_{1}^{3}6x\\,dx=27-3=24$.", "所以$\\int_{1}^{3}6x\\,dx=27-3=24$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.2, 0, 0.0], 8.0, 68);
    k.table();
    const B = board(k, { x0:-0.4, x1:3.6, y0:-2, y1:22, ux:1.15, uy:0.18, gy:2, cx:-1.55, cz:0.05, fs:0.19, xs:[1, 2, 3], ys:[6, 12, 18],
      draw:(g, X, Y, ppu) => { dash(g, ppu, [[X(1), Y(0)], [X(1), Y(6)]]); dash(g, ppu, [[X(3), Y(0)], [X(3), Y(18)]]); } });
    curve(k, B, x => 6 * x, 0, 3.6, k.metal('#3f6fa0', 0.3), 0.03, 4);
    /* 조각 8 개 — 폭 0.25, 높이는 가운데 x 의 6x(1차식이라 합이 정확히 24) */
    const N = 8, dx = 2 / N, slats = [];
    const woods = ['#d9a466', '#c8905a'];
    for(let i = 0; i < N; i++){
      const xm = 1 + dx * (i + 0.5), hgt = 6 * xm * B.uy, wdt = dx * B.ux * 0.9;
      const geo = new THREE.BoxGeometry(wdt, 0.05, hgt); geo.translate(0, 0.025, -hgt / 2);
      const m = new THREE.Mesh(geo, k.woodMat(woods[i % 2], [120, 80, 40])); m.castShadow = m.receiveShadow = true;
      const base = B.P(xm, 0, 0.085); m.position.copy(base); scene.add(m); slats.push(m);
    }
    const RX = 2.25;
    const c1 = mcard(k, [{ int:['', ''] }, ' 6x dx = 3x', { sup:'2' }, ' + C'], RX, -1.4, { w:2.5, d:0.95, hmax:0.34, fill:0.8, glow:true });
    const c2 = mcard(k, ['F(3) = 27,  F(1) = 3'], RX, -0.3, { w:2.5, d:0.72, hmax:0.4, fill:0.88, glow:true });
    const c3 = mcard(k, [{ int:['1', '3'] }, ' 6x dx = 27 − 3 = 24'], RX, 0.9, { w:2.5, d:1.05, hmax:0.3, fill:0.9, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: ∫ 카드 → 조각이 모두 누웠다가 1 부터 3 까지 하나씩 일어나 쌓이고 → F 카드 → 24 카드 */
    k.onFrame(t => { const p = cyc(t, 10);
      pop(c1, p, 0.0, 0.14);
      slats.forEach((m, i) => { const a = 0.18 + i * 0.045; m.scale.z = Math.max(0.001, 1 - seg(p, 0.12, 0.17) + seg(p, a, a + 0.06)); m.position.y = 0.085 + 0.06 * hop(p, a, a + 0.08); });
      pop(c2, p, 0.58, 0.74); pop(c3, p, 0.76, 0.94); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

};
