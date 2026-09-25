/* C37 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

/* 좌표판 — 나무판 위 모눈종이(scenes-c34.js 의 board 와 같은 모양). P(x, y, h) 로 판 위 월드 좌표 */
function board(k, o){
  const { THREE, scene } = k;
  const ux = o.ux || o.u, uy = o.uy || o.u, gx = o.gx || 1, gy = o.gy || 1;
  const W = (o.x1 - o.x0) * ux, D = (o.y1 - o.y0) * uy, cx = o.cx || 0, cz = o.cz || 0;
  const ppu = 1800 / Math.max(W, D);
  const tex = k.canvasTex(Math.round(W * ppu), Math.round(D * ppu), (g, w, h) => {
    const X = x => (x - o.x0) * ux * ppu, Y = y => (o.y1 - y) * uy * ppu;
    g.fillStyle = '#efe6d2'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(80,110,140,.33)'; g.lineWidth = 2.5;
    for(let x = Math.ceil(o.x0 / gx) * gx; x <= o.x1 + 1e-9; x += gx){ g.beginPath(); g.moveTo(X(x), 0); g.lineTo(X(x), h); g.stroke(); }
    for(let y = Math.ceil(o.y0 / gy) * gy; y <= o.y1 + 1e-9; y += gy){ g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(w, Y(y)); g.stroke(); }
    g.strokeStyle = '#2b2118'; g.fillStyle = '#2b2118'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(0, Y(0)); g.lineTo(w, Y(0)); g.moveTo(X(0), 0); g.lineTo(X(0), h); g.stroke();
    const fs = (o.fs || 0.2) * ppu, tk = fs * 0.28;
    g.lineWidth = 4; g.textBaseline = 'middle';
    (o.xs || []).forEach(x => { g.beginPath(); g.moveTo(X(x), Y(0) - tk); g.lineTo(X(x), Y(0) + tk); g.stroke();
      k.mathText(g, x < 0 ? '−' + (-x) : String(x), X(x), Y(0) + fs * 0.85, fs, { weight:'400' }); });
    (o.ys || []).forEach(y => { g.beginPath(); g.moveTo(X(0) - tk, Y(y)); g.lineTo(X(0) + tk, Y(y)); g.stroke();
      k.mathText(g, y < 0 ? '−' + (-y) : String(y), X(0) - fs * 0.45, Y(y), fs, { weight:'400', align:'right' }); });
    k.mathText(g, 'O', X(0) - fs * 0.5, Y(0) + fs * 0.85, fs, { weight:'400' });
    k.mathText(g, 'x', w - fs * 0.6, Y(0) - fs * 0.75, fs * 1.2);
    k.mathText(g, 'y', X(0) + fs * 0.7, fs * 0.8, fs * 1.2);
    if(o.extra) o.extra(g, X, Y, fs);
  });
  const slab = new THREE.Mesh(k.rbox(W + 0.24, 0.08, D + 0.24, 0.06), k.woodMat('#8a5a33', [50, 25, 10]));
  slab.position.set(cx, 0, cz); slab.castShadow = slab.receiveShadow = true; scene.add(slab);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map:tex, roughness:0.85 }));
  face.rotation.x = -Math.PI / 2; face.position.set(cx, 0.081, cz); face.receiveShadow = true; scene.add(face);
  const P = (x, y, hh) => new THREE.Vector3(cx - W / 2 + (x - o.x0) * ux, hh == null ? 0.13 : hh, cz - D / 2 + (o.y1 - y) * uy);
  return { P, W, D, ux, uy };
}
/* 휜 철사 — 판 위에서 y = f(x) 를 xa~xb 로 따라간다. 곡선(curve)도 함께 돌려준다 */
function curveWire(k, B, f, xa, xb, mat, o){
  o = o || {};
  const { THREE } = k;
  const pts = []; const n = o.n || 60;
  for(let i = 0; i <= n; i++){ const x = xa + (xb - xa) * i / n; pts.push(B.P(x, f(x), o.h)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  const r = o.r || 0.03;
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 200, r, 12), mat); m.castShadow = true;
  const g = new THREE.Group(); g.add(m);
  [pts[0], pts[n]].forEach(p => { const c = new THREE.Mesh(new THREE.SphereGeometry(r * 1.05, 16, 12), mat); c.position.copy(p); g.add(c); });
  k.scene.add(g);
  return { group:g, curve, at:x => B.P(x, f(x), o.h) };
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
/* 구슬 */
function bead(k, color, r){
  const m = new k.THREE.Mesh(new k.THREE.SphereGeometry(r || 0.085, 24, 16), new k.THREE.MeshPhysicalMaterial({ color, roughness:0.22, clearcoat:1 }));
  m.castShadow = true; k.scene.add(m); return m;
}
/* 수식 조각 그리기 — 문자열(mathText), {r:'2'}(근호), {n:[…], d:[…]}(분수, 안에 근호 가능), {sup:'2'}(윗첨자).
   너비를 돌려준다(draw=false 면 재기만) */
function mdraw(k, g, parts, x, cy, fs, draw){
  let cx = x;
  parts.forEach(p => {
    if(typeof p === 'string'){ const w = k.mathText(g, p, cx, cy, fs, { align:'left', draw }); cx += w; return; }
    if(p.sup != null){ const w = k.mathText(g, p.sup, cx - fs * 0.02, cy - fs * 0.32, fs * 0.62, { align:'left', draw }); cx += w + fs * 0.02; return; }
    if(p.r != null){
      const rw = k.mathText(g, p.r, 0, 0, fs, { draw:false }), lw = fs * 0.62, W = lw + rw + fs * 0.12;
      if(draw !== false){
        g.save(); g.lineWidth = fs * 0.065; g.lineJoin = 'round'; g.lineCap = 'round';
        g.beginPath(); g.moveTo(cx + fs * 0.04, cy + fs * 0.06); g.lineTo(cx + fs * 0.16, cy - fs * 0.02);
        g.lineTo(cx + fs * 0.34, cy + fs * 0.46); g.lineTo(cx + fs * 0.56, cy - fs * 0.6); g.lineTo(cx + W, cy - fs * 0.6); g.stroke(); g.restore();
        k.mathText(g, p.r, cx + lw + fs * 0.04, cy + fs * 0.02, fs, { align:'left' });
      }
      cx += W + fs * 0.04; return;
    }
    if(p.n){
      const s = fs * 0.8, wn = mdraw(k, g, p.n, 0, 0, s, false), wd = mdraw(k, g, p.d, 0, 0, s, false), W = Math.max(wn, wd) + fs * 0.3;
      if(draw !== false){
        mdraw(k, g, p.n, cx + (W - wn) / 2, cy - fs * 0.62, s, true);
        mdraw(k, g, p.d, cx + (W - wd) / 2, cy + fs * 0.7, s, true);
        g.save(); g.lineWidth = fs * 0.065; g.beginPath(); g.moveTo(cx + fs * 0.06, cy); g.lineTo(cx + W - fs * 0.06, cy); g.stroke(); g.restore();
      }
      cx += W + fs * 0.06;
    }
  });
  return cx - x;
}
/* 수식 판 텍스처 — 폭에 맞춰 글자 크기를 줄인다 */
function mtex(k, parts, pw, ph, o){
  o = o || {};
  return k.canvasTex(pw, ph, (g, w, h) => {
    g.fillStyle = o.bg || '#f3e7cf'; g.fillRect(0, 0, w, h);
    if(o.frame){ g.strokeStyle = o.frame; g.lineWidth = Math.min(w, h) * 0.035; g.strokeRect(g.lineWidth, g.lineWidth, w - 2 * g.lineWidth, h - 2 * g.lineWidth); }
    g.fillStyle = g.strokeStyle = o.color || '#2b2118'; g.textBaseline = 'middle';
    let fs = h * (o.hmax || 0.5); const tw = mdraw(k, g, parts, 0, 0, fs, false);
    if(tw > w * (o.fill || 0.84)) fs *= w * (o.fill || 0.84) / tw;
    const W = mdraw(k, g, parts, 0, 0, fs, false);
    mdraw(k, g, parts, (w - W) / 2, h / 2 + (o.dy || 0) * h, fs, true);
  });
}
/* 수식 카드 — k.card 와 같은 몸통에 mtex 윗면, o.back 이면 뒷면(반 바퀴 z 회전하면 읽힘), o.glow 면 윗면이 빛날 수 있다 */
function mcard(k, parts, x, z, o){
  o = o || {};
  const { THREE, scene } = k;
  const w = o.w || 1.0, d = o.d || 0.8, h = o.h || 0.04, pw = 1024, ph = Math.round(1024 * d / w);
  const grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, Math.min(0.04, d * 0.1)), new THREE.MeshStandardMaterial({ color:o.edge || '#e9dcc0', roughness:0.85 }));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  const tex = mtex(k, parts, pw, ph, o);
  const mat = new THREE.MeshStandardMaterial({ map:tex, roughness:0.8 });
  if(o.glow){ mat.emissive = new THREE.Color('#ffd89a'); mat.emissiveMap = tex; mat.emissiveIntensity = 0; }
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), mat);
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
  if(o.back){ const bt = mtex(k, o.back, pw, ph, Object.assign({}, o, o.backOpts || {})); bt.center.set(0.5, 0.5); bt.rotation = Math.PI;
    const back = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), new THREE.MeshStandardMaterial({ map:bt, roughness:0.8 }));
    back.rotation.x = Math.PI / 2; back.position.y = -0.002; grp.add(back); }
  grp.position.set(x, o.y == null ? 0.035 : o.y, z); grp.rotation.y = o.rot || 0; scene.add(grp);
  grp.userData.mat = mat; return grp;
}
/* 'x²' 같은 문자열을 mdraw 조각으로 — ² 는 진짜 윗첨자로 그린다 */
const parts = t => { const out = []; t.split('²').forEach((s, i) => { if(i) out.push({ sup:'2' }); if(s) out.push(s); }); return out; };
/* 글자 크기를 카드 폭에 맞춘 식 카드 — 식 한 줄이 fill 비율을 넘지 않게(뒷면 o.backTxt 도 같은 크기로) */
function fitCard(k, txt, x, z, o){
  o = Object.assign({ hmax:0.56, fill:0.84 }, o);
  if(o.backTxt){
    const g = document.createElement('canvas').getContext('2d');
    const w = o.w || 1.0, d = o.d || 0.8, ph = Math.round(1024 * d / w);
    const t1 = mdraw(k, g, parts(txt), 0, 0, 100, false), t2 = mdraw(k, g, parts(o.backTxt), 0, 0, 100, false);
    const fs = Math.min(ph * o.hmax, 100 * 1024 * o.fill / Math.max(t1, t2));
    o.hmax = fs / ph; o.fill = 0.99; o.back = parts(o.backTxt);
  }
  return mcard(k, parts(txt), x, z, o);
}
/* 고리(꼭짓점 표시) */
function ring(k, p, color){
  const { THREE } = k;
  const m = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 12, 40), k.metal(color || '#d4b05a', 0.25));
  m.rotation.x = -Math.PI / 2; m.position.set(p.x, 0.1, p.z); m.castShadow = true; k.scene.add(m); return m;
}
const bump = (x, c, w) => Math.exp(-((x - c) / w) * ((x - c) / w));

export const SCENES_C37 = {

  /* 이차함수 y=ax²의 그래프 — hook: y=x² 의 표 x=−3…3 → y=9,4,1,0,1,4,9. −3과 3이 같은 y, y축 대칭, 가장 낮은 곳은 원점 */
  'M-78': { seed:278, caps:{ P:9, list:[
    [0.0, "$y=x^2$의 표입니다. $x=-3,\\,-2,\\,-1,\\,0,\\,1,\\,2,\\,3$이면 $y=9,\\,4,\\,1,\\,0,\\,1,\\,4,\\,9$입니다.", "A table for $y=x^2$: $x=-3,\\,-2,\\,-1,\\,0,\\,1,\\,2,\\,3$ gives $y=9,\\,4,\\,1,\\,0,\\,1,\\,4,\\,9$.", "$y=x^2$的表：$x=-3,\\,-2,\\,-1,\\,0,\\,1,\\,2,\\,3$时，$y=9,\\,4,\\,1,\\,0,\\,1,\\,4,\\,9$。"],
    [0.3, "$-3$과 $3$은 같은 $y$를 줍니다 — $(-3)^2=3^2=9$, 제곱하면 부호가 사라집니다.", "$-3$ and $3$ give the same $y$: $(-3)^2=3^2=9$. Squaring removes the sign.", "$-3$和$3$得到相同的$y$：$(-3)^2=3^2=9$，平方后符号消失了。"],
    [0.62, "그래서 그래프는 $y$축을 거울 삼아 좌우가 똑같습니다.", "So the graph is a mirror image across the $y$-axis.", "所以图象以$y$轴为镜子，左右完全对称。"],
    [0.82, "가장 낮은 점은 원점 $(0,\\,0)$ 하나입니다.", "Its lowest point is the origin $(0,\\,0)$.", "最低点只有原点$(0,\\,0)$一个。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0.05, 0.3], 5.5, 58);
    k.table();
    const B = board(k, { x0:-4, x1:4, y0:-1, y1:10, ux:0.46, uy:0.27, cx:0, cz:-0.35, fs:0.15, xs:[-3, -2, -1, 1, 2, 3], ys:[1, 2, 3, 4, 5, 6, 7, 8, 9] });
    const f = x => x * x;
    const W = curveWire(k, B, f, -3.05, 3.05, k.metal('#c46a3a', 0.28));
    const XS = [-3, -2, -1, 0, 1, 2, 3];
    const pins = XS.map(x => pin(k, B.P(x, f(x)), x === 0 ? '#2f7a4a' : '#b3221a'));
    /* 값의 표 — 윗줄 x, 아랫줄 y (카드) */
    const cw = 0.44, gap = 0.5, X0 = -3.5 * gap - 0.02, zx = 1.52, zy = 1.97;
    fitCard(k, 'x', X0 - 0.06, zx, { w:0.4, d:0.4, edge:'#d7c7a3', bg:'#e6d7b6' });
    fitCard(k, 'y', X0 - 0.06, zy, { w:0.4, d:0.4, edge:'#d7c7a3', bg:'#e6d7b6' });
    const tx = [], ty = [];
    XS.forEach((x, i) => { const px = X0 + (i + 1) * gap;
      tx.push(fitCard(k, x < 0 ? '−' + (-x) : String(x), px, zx, { w:cw, d:0.4, fill:0.72 }));
      ty.push(fitCard(k, String(f(x)), px, zy, { w:cw, d:0.4, fill:0.72, bg:'#f6e3c9' })); });
    /* 구슬 — 정지 그림에서는 꼭짓점(원점)에 */
    const bd = bead(k, '#fff3d6', 0.075);
    const put = x => { bd.position.copy(B.P(x, f(x))); bd.position.y += 0.07; };
    put(0);
    const py = pins.map(g => g.position.y), cy = [...tx, ...ty].map(g => g.position.y);
    /* 움직임: 짝(−1,1)·(−2,2)·(−3,3)의 압정과 표의 두 칸이 함께 뛴다(같은 y) → 구슬이 곡선을 따라 −3 에서 3 까지 → 꼭짓점으로 */
    k.onFrame(t => { const p = cyc(t, 9);
      const pairs = [[2, 4, 0.06], [1, 5, 0.18], [0, 6, 0.3]];
      pins.forEach(g => g.position.y = py[pins.indexOf(g)]);
      tx.forEach((g, i) => g.position.y = cy[i]); ty.forEach((g, i) => g.position.y = cy[7 + i]);
      pairs.forEach(([a, b, s]) => { const h = hop(p, s, s + 0.12);
        pins[a].position.y = py[a] + 0.25 * h; pins[b].position.y = py[b] + 0.25 * h;
        [a, b].forEach(i => { tx[i].position.y = cy[i] + 0.12 * h; ty[i].position.y = cy[7 + i] + 0.12 * h; }); });
      const x = -3 * seg(p, 0.46, 0.58) + 6 * seg(p, 0.6, 0.8) - 3 * seg(p, 0.84, 0.96);
      put(x); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.3], envOpts:{ intensity:0.7 } });
  }},

  /* 이차함수의 평행이동 — hook: y=x² 를 오른쪽으로 3칸 → y=(x−3)². 괄호 안이 0이 되는 x=3 이 꼭짓점 */
  'M-79': { seed:279, caps:{ P:9, list:[
    [0.0, "$y=x^2$을 오른쪽으로 $3$칸 옮기면 $y=(x-3)^2$입니다.", "Move $y=x^2$ three steps right and you get $y=(x-3)^2$.", "把$y=x^2$向右平移$3$格，就得到$y=(x-3)^2$。"],
    [0.3, "오른쪽인데 왜 뺄까요? 새 꼭짓점은 $x=3$에 있어야 합니다.", "Right, so why subtract? The new vertex must sit at $x=3$.", "向右为什么要减？新的顶点必须在$x=3$。"],
    [0.55, "$x=3$을 넣으면 $(x-3)^2=0$ — 괄호 안이 $0$이 되는 자리가 꼭짓점 $(3,\\,0)$입니다.", "Put in $x=3$: $(x-3)^2=0$. Where the bracket is $0$ is the vertex $(3,\\,0)$.", "代入$x=3$：$(x-3)^2=0$——括号里为$0$的地方就是顶点$(3,\\,0)$。"],
    [0.8, "모양은 그대로이고 위치만 바뀝니다.", "The shape stays the same; only the position changes.", "形状不变，只是位置改变。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.15, 0.05, 0.3], 5.3, 58);
    k.table();
    const B = board(k, { x0:-3.6, x1:6.6, y0:-2, y1:9.6, ux:0.4, uy:0.27, cx:0, cz:-0.35, fs:0.14, xs:[-3, -2, -1, 1, 2, 3, 4, 5, 6], ys:[1, 2, 3, 4, 5, 6, 7, 8, 9] });
    /* 원래 곡선 y = x²(어두운 황동, 판에 붙어) · 옮긴 곡선 y = (x − 3)²(구리, 살짝 떠서) */
    const base = curveWire(k, B, x => x * x, -3.05, 3.05, k.metal('#7d6a45', 0.4), { r:0.024, h:0.11 });
    const mv = curveWire(k, B, x => (x - 3) * (x - 3), -0.05, 6.05, k.metal('#c46a3a', 0.28), { h:0.17 });
    const r0 = ring(k, B.P(0, 0), '#9a8a66'); r0.position.y = 0.1;
    const v = bead(k, '#fff3d6', 0.08); const V = B.P(3, 0); v.position.set(V.x, 0.24, V.z); mv.group.add(v); scene.remove(v);
    const r3 = ring(k, V); r3.position.y = 0.1;
    /* 옮긴 거리 3 — 판 위 가는 화살(x = 0 → 3, y = −1.3) */
    const brass = k.metal('#c9a14f', 0.3);
    const A0 = B.P(0.15, -1.35, 0.12), A1 = B.P(2.7, -1.35, 0.12);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, A1.x - A0.x, 12), brass); shaft.rotation.z = Math.PI / 2; shaft.position.set((A0.x + A1.x) / 2, 0.12, A0.z); shaft.castShadow = true; scene.add(shaft);
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 18), brass); head.rotation.z = -Math.PI / 2; head.position.set(A1.x + 0.08, 0.12, A1.z); head.castShadow = true; scene.add(head);
    fitCard(k, 'y = x²', -1.3, 1.72, { w:1.0, d:0.44, edge:'#cdbf9c' });
    const cR = fitCard(k, 'y = (x − 3)²', 0.4, 1.72, { w:1.5, d:0.44, edge:'#e2b597' });
    const cZ = fitCard(k, 'x = 3', 1.95, 1.72, { w:0.85, d:0.44, bg:'#f6e3c9' });
    const dx = 3 * B.ux;
    /* 움직임: 구리 곡선이 y = x² 자리로 돌아갔다가(꼭짓점 구슬도 함께) 다시 오른쪽으로 3칸 → x = 3 카드와 고리가 톡 */
    k.onFrame(t => { const p = cyc(t, 9);
      const back = seg(p, 0.06, 0.26) * (1 - seg(p, 0.34, 0.58));
      mv.group.position.x = -dx * back;
      cZ.position.y = 0.035 + 0.16 * hop(p, 0.6, 0.72); r3.position.y = 0.1 + 0.2 * hop(p, 0.6, 0.72);
      cR.position.y = 0.035 + 0.12 * hop(p, 0.78, 0.9); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0.3, 7, 2], spotAt:[0.3, 0, 0.3], envOpts:{ intensity:0.7 } });
  }},

  /* 이차함수의 꼭짓점 — stage ①: y=(x−3)²+2, (x−3)²≥0, x=3 에서 0 → 꼭짓점 (3,2). stage ②: x²−6x+11 도 같은 그래프 */
  'M-67': { seed:267, caps:{ P:9, list:[
    [0.0, "$y=(x-3)^2+2$에서 $(x-3)^2$은 절대 음수가 될 수 없습니다.", "In $y=(x-3)^2+2$, $(x-3)^2$ can never be negative.", "在$y=(x-3)^2+2$中，$(x-3)^2$绝不会是负数。"],
    [0.28, "$x=3$일 때 $(x-3)^2=0$, 그때 $y=2$ — 꼭짓점은 $(3,\\,2)$입니다.", "At $x=3$, $(x-3)^2=0$ and $y=2$: the vertex is $(3,\\,2)$.", "$x=3$时$(x-3)^2=0$，此时$y=2$——顶点是$(3,\\,2)$。"],
    [0.52, "$y=x^2-6x+11$도 완전제곱으로 고치면 $(x-3)^2+2$입니다.", "Complete the square in $y=x^2-6x+11$ and you get $(x-3)^2+2$.", "把$y=x^2-6x+11$配方，就得到$(x-3)^2+2$。"],
    [0.8, "두 식은 같은 그래프의 두 가지 표기입니다.", "The two forms are two ways of writing the same graph.", "这两个式子是同一个图象的两种写法。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0.1, 0.05, 0.3], 4.9, 58);
    k.table();
    const B = board(k, { x0:-1, x1:6.4, y0:-1, y1:8.6, ux:0.52, uy:0.3, cx:0.1, cz:-0.4, fs:0.15, xs:[1, 2, 3, 4, 5, 6], ys:[1, 2, 3, 4, 5, 6, 7, 8] });
    const f = x => (x - 3) * (x - 3) + 2;
    const Wr = curveWire(k, B, f, 3 - Math.sqrt(6.3), 3 + Math.sqrt(6.3), k.metal('#c46a3a', 0.28));
    const V = B.P(3, 2), rg = ring(k, V);
    /* 꼭짓점 높이 y = 2 — 판 위 가는 금 */
    const dash = new THREE.MeshStandardMaterial({ color:'#6d5a3c', roughness:0.6 });
    for(let x = 0.1; x < 2.8; x += 0.3){ const a = B.P(x, 2, 0.09), b = B.P(x + 0.16, 2, 0.09);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, b.x - a.x, 8), dash); m.rotation.z = Math.PI / 2; m.position.set((a.x + b.x) / 2, 0.095, a.z); k.scene.add(m); }
    const card = fitCard(k, 'y = (x − 3)² + 2', -0.75, 1.7, { w:2.1, d:0.5, backTxt:'y = x² − 6x + 11', backOpts:{ bg:'#f6e3c9' } });
    const cV = fitCard(k, '(3, 2)', 1.55, 1.7, { w:1.0, d:0.5, bg:'#f6e3c9' });
    const bd = bead(k, '#fff3d6', 0.078);
    const put = x => { bd.position.copy(B.P(x, f(x))); bd.position.y += 0.07; };
    const xL = 3 - Math.sqrt(6), xR = 3 + Math.sqrt(6);
    put(3);
    const c0 = card.position.y;
    /* 움직임: 구슬이 왼쪽 위로 → 곡선을 타고 내려와 x = 3 에서 멈춤(고리·(3, 2) 가 톡) → 오른쪽 위로 → 꼭짓점으로.
       식 카드는 뒤집혀 x² − 6x + 11 을 보였다가 다시 (x − 3)² + 2 로 */
    k.onFrame(t => { const p = cyc(t, 9);
      const x = 3 + (xL - 3) * seg(p, 0.04, 0.14) + (3 - xL) * seg(p, 0.16, 0.28) + (xR - 3) * seg(p, 0.36, 0.44) + (3 - xR) * seg(p, 0.44, 0.52);
      put(x);
      const h = hop(p, 0.28, 0.38); rg.position.y = 0.1 + 0.2 * h; cV.position.y = 0.035 + 0.14 * h;
      const fl = seg(p, 0.54, 0.64) * (1 - seg(p, 0.8, 0.9)), ang = Math.PI * fl;
      card.rotation.z = ang; card.position.y = c0 + 0.9 * Math.sin(ang) + 0.045 * fl; });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0.3, 7, 2], spotAt:[0.2, 0, 0.3], envOpts:{ intensity:0.7 } });
  }},

  /* 이차함수의 최대·최소와 축과의 교점 — stage ②: y=x²−5x+6, y=0 → (x−2)(x−3)=0, x=2,3. y축과는 6. 대칭축은 두 근의 한가운데 */
  'M-80': { seed:280, caps:{ P:9, list:[
    [0.0, "$y=x^2-5x+6$에 $x=0$을 넣으면 $y=6$ — $y$축과 만나는 점입니다.", "Put $x=0$ into $y=x^2-5x+6$: $y=6$, where it meets the $y$-axis.", "把$x=0$代入$y=x^2-5x+6$，得$y=6$——与$y$轴的交点。"],
    [0.26, "$x$축 위에서는 $y=0$이므로 $x^2-5x+6=0$, 곧 $(x-2)(x-3)=0$입니다.", "On the $x$-axis $y=0$, so $x^2-5x+6=0$, that is $(x-2)(x-3)=0$.", "在$x$轴上$y=0$，所以$x^2-5x+6=0$，即$(x-2)(x-3)=0$。"],
    [0.5, "근 $x=2$, $x=3$에서 그래프가 $x$축을 뚫고 지나갑니다.", "The graph crosses the $x$-axis at the roots $x=2$ and $x=3$.", "图象在根$x=2$、$x=3$处穿过$x$轴。"],
    [0.76, "두 교점의 한가운데 $x=\\dfrac{5}{2}$가 대칭축입니다.", "Halfway between them, $x=\\dfrac{5}{2}$, is the axis of symmetry.", "两个交点的正中间$x=\\dfrac{5}{2}$就是对称轴。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.1, 0.05, 0.3], 4.9, 58);
    k.table();
    const B = board(k, { x0:-1, x1:6, y0:-1.4, y1:7.4, ux:0.56, uy:0.36, cx:0.1, cz:-0.4, fs:0.15, xs:[1, 2, 3, 4, 5], ys:[1, 2, 3, 4, 5, 6, 7] });
    const f = x => x * x - 5 * x + 6;
    const xa = (5 - Math.sqrt(29)) / 2 + 0.02, xb = (5 + Math.sqrt(29)) / 2 - 0.02;
    curveWire(k, B, f, xa, xb, k.metal('#3f6fa0', 0.3));
    /* 대칭축 x = 5/2 — 점선 */
    const dash = new THREE.MeshStandardMaterial({ color:'#6d5a3c', roughness:0.6 });
    for(let y = -1.3; y < 7.2; y += 0.42){ const a = B.P(2.5, y + 0.22, 0.09), b = B.P(2.5, y, 0.09);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, b.z - a.z, 8), dash); m.rotation.x = Math.PI / 2; m.position.set(a.x, 0.095, (a.z + b.z) / 2); scene.add(m); }
    const p2 = pin(k, B.P(2, 0), '#b3221a'), p3 = pin(k, B.P(3, 0), '#b3221a'), p6 = pin(k, B.P(0, 6), '#2f7a4a');
    const cF = fitCard(k, 'y = x² − 5x + 6', -0.85, 1.72, { w:1.9, d:0.48 });
    const cE = fitCard(k, '(x − 2)(x − 3) = 0', 1.25, 1.72, { w:2.0, d:0.48, bg:'#f6e3c9' });
    const bd = bead(k, '#fff3d6', 0.078);
    const put = x => { bd.position.copy(B.P(x, f(x))); bd.position.y += 0.07; };
    put(2.5);
    const y0 = [p2, p3, p6].map(g => g.position.y);
    /* 움직임: 구슬이 y축 교점 (0, 6) 에서 곡선을 타고 내려가 x = 2, x = 3 을 지나며(압정이 톡) 올라갔다가 되돌아온다 */
    k.onFrame(t => { const p = cyc(t, 9);
      const x = 2.5 - 2.5 * seg(p, 0.03, 0.16) + 4.9 * seg(p, 0.24, 0.72) - 2.4 * seg(p, 0.8, 0.96);
      put(x);
      const fw = p > 0.22 && p < 0.76 ? 1 : 0;
      p6.position.y = y0[2] + 0.25 * hop(p, 0.15, 0.25);
      p2.position.y = y0[0] + 0.25 * bump(x, 2, 0.18) * fw; p3.position.y = y0[1] + 0.25 * bump(x, 3, 0.18) * fw;
      cF.position.y = 0.035 + 0.12 * hop(p, 0.15, 0.25); cE.position.y = 0.035 + 0.12 * hop(p, 0.28, 0.4); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0.3, 7, 2], spotAt:[0.2, 0, 0.3], envOpts:{ intensity:0.7 } });
  }}
};
