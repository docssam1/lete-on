/* C39 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만 — scenes-c34/c37 과 같은 모양) ───────────────── */

/* 좌표판 — 나무판 위 모눈종이. P(x, y, h) 로 판 위 월드 좌표 */
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
    if(o.under) o.under(g, X, Y);
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
/* 휜 철사 — 판 위에서 y = f(x) 를 xa~xb 로 따라간다 */
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
/* 곧은 철사(두 점 사이) */
function wire(k, a, b, mat, r){
  const { THREE, scene } = k;
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 8, r || 0.03, 12), mat);
  m.castShadow = true; scene.add(m);
  [a, b].forEach(p => { const c = new THREE.Mesh(new THREE.SphereGeometry((r || 0.03) * 1.05, 16, 12), mat); c.position.copy(p); m.add(c); c.position.sub(new THREE.Vector3()); });
  return m;
}
/* 압정 */
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
/* 고리 */
function ring(k, p, color, r){
  const { THREE } = k;
  const m = new THREE.Mesh(new THREE.TorusGeometry(r || 0.13, 0.025, 12, 40), k.metal(color || '#d4b05a', 0.25));
  m.rotation.x = -Math.PI / 2; m.position.set(p.x, 0.1, p.z); m.castShadow = true; k.scene.add(m); return m;
}
/* 글자 한 조각 — 그리스 문자(α, β)는 수학 이탤릭 글꼴로 */
function gtext(k, g, s, x, y, fs, draw){
  let cx = x;
  s.split(/([α-ω]+)/).filter(r => r !== '').forEach(r => {
    if(/^[α-ω]+$/.test(r)){ g.font = `italic 700 ${fs}px ${k.MATH}`; const w = g.measureText(r).width; if(draw !== false){ const ta = g.textAlign; g.textAlign = 'left'; g.fillText(r, cx, y); g.textAlign = ta; } cx += w; }
    else cx += k.mathText(g, r, cx, y, fs, { align:'left', draw });
  });
  return cx - x;
}
/* 수식 조각 — 문자열, {sup}(윗첨자), {r: 문자열|조각들}(근호), {n, d}(분수) */
function mdraw(k, g, parts, x, cy, fs, draw){
  let cx = x;
  parts.forEach(p => {
    if(typeof p === 'string'){ cx += gtext(k, g, p, cx, cy, fs, draw); return; }
    if(p.sup != null){ const w = gtext(k, g, p.sup, cx - fs * 0.02, cy - fs * 0.32, fs * 0.62, draw); cx += w + fs * 0.02; return; }
    if(p.r != null){
      const inner = typeof p.r === 'string' ? [p.r] : p.r;
      const rw = mdraw(k, g, inner, 0, 0, fs, false), lw = fs * 0.62, W = lw + rw + fs * 0.12;
      if(draw !== false){
        g.save(); g.lineWidth = fs * 0.065; g.lineJoin = 'round'; g.lineCap = 'round';
        g.beginPath(); g.moveTo(cx + fs * 0.04, cy + fs * 0.06); g.lineTo(cx + fs * 0.16, cy - fs * 0.02);
        g.lineTo(cx + fs * 0.34, cy + fs * 0.46); g.lineTo(cx + fs * 0.56, cy - fs * 0.62); g.lineTo(cx + W, cy - fs * 0.62); g.stroke(); g.restore();
        mdraw(k, g, inner, cx + lw + fs * 0.04, cy + fs * 0.02, fs, true);
      }
      cx += W + fs * 0.04; return;
    }
    if(p.n){
      const s = fs * 0.8, wn = mdraw(k, g, p.n, 0, 0, s, false), wd = mdraw(k, g, p.d, 0, 0, s, false), W = Math.max(wn, wd) + fs * 0.3;
      if(draw !== false){
        mdraw(k, g, p.n, cx + (W - wn) / 2, cy - fs * 0.64, s, true);
        mdraw(k, g, p.d, cx + (W - wd) / 2, cy + fs * 0.7, s, true);
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
  const tex = mtex(k, parts, pw, ph, o);
  const mat = new THREE.MeshStandardMaterial({ map:tex, roughness:0.8 });
  if(o.glow){ mat.emissive = new THREE.Color('#ffd89a'); mat.emissiveMap = tex; mat.emissiveIntensity = o.glow0 || 0; }
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), mat);
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
  grp.position.set(x, o.y == null ? 0.035 : o.y, z); grp.rotation.y = o.rot || 0; scene.add(grp);
  grp.userData.mat = mat; return grp;
}
const parts = t => { const out = []; t.split('²').forEach((s, i) => { if(i) out.push({ sup:'2' }); if(s) out.push(s); }); return out; };
const fitCard = (k, txt, x, z, o) => mcard(k, typeof txt === 'string' ? parts(txt) : txt, x, z, Object.assign({ hmax:0.56, fill:0.84 }, o));

export const SCENES_C39 = {

  /* 이차방정식의 판별식 — hook: 근이 2개·1개·0개. stage ①: x²−5x+6=0, D=25−24=1>0. stage ②: x²−4x+4=0, D=0, x=2 에서 겹친다.
     book: D<0 이면 실근 없음 */
  'M-26': { seed:326, caps:{ P:10, list:[
    [0.0, "$x^2-5x+6=0$은 $D=(-5)^2-4\\times 1\\times 6=1>0$이므로 서로 다른 두 실근 $2$, $3$을 가집니다.", "For $x^2-5x+6=0$, $D=(-5)^2-4\\times 1\\times 6=1>0$, so there are two distinct real roots, $2$ and $3$.", "$x^2-5x+6=0$中$D=(-5)^2-4\\times 1\\times 6=1>0$，所以有两个不同的实根$2$和$3$。"],
    [0.26, "$x^2-4x+4=0$은 $D=16-16=0$ — 두 근이 $x=2$ 하나로 겹칩니다(중근).", "For $x^2-4x+4=0$, $D=16-16=0$: the two roots merge into one at $x=2$ (a repeated root).", "$x^2-4x+4=0$中$D=16-16=0$——两个根在$x=2$重合为一个（重根）。"],
    [0.5, "$D<0$이면 그래프가 $x$축에 닿지 않아 실근이 없습니다.", "If $D<0$, the graph never touches the $x$-axis: no real roots.", "$D<0$时图象碰不到$x$轴，没有实根。"],
    [0.8, "근을 구하지 않고도 $D=b^2-4ac$의 부호만 보면 근의 개수를 압니다.", "Without solving, the sign of $D=b^2-4ac$ tells you how many roots there are.", "不用求根，只看$D=b^2-4ac$的符号就知道根的个数。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.25, 0.05, 0.3], 6.4, 60);
    k.table();
    const B = board(k, { x0:-1.3, x1:5.7, y0:-1.4, y1:7.7, ux:0.5, uy:0.36, cx:-1.05, cz:0.05, fs:0.15, xs:[1, 2, 3, 4, 5], ys:[1, 2, 3, 4, 5, 6, 7] });
    /* 포물선 y = (x − 2.5)² − 0.25 = x² − 5x + 6 — 통째로 옮겨 x² − 4x + 4, 그리고 더 위로 */
    const pw = curveWire(k, B, x => (x - 2.5) * (x - 2.5) - 0.25, -0.02, 5.02, k.metal('#c46a3a', 0.28), { h:0.15 });
    const rts = [bead(k, '#b3221a', 0.085), bead(k, '#b3221a', 0.085)];
    const X = 2.05;
    fitCard(k, 'x² − 5x + 6 = 0', X, -1.4, { w:2.3, d:0.5, edge:'#e2b597' });
    fitCard(k, 'D = 25 − 24 = 1', X, -0.72, { w:2.3, d:0.5 });
    const sc = ['D > 0', 'D = 0', 'D < 0'].map((t, i) => fitCard(k, t, X - 0.8 + i * 0.8, 0.02, { w:0.74, d:0.5, glow:true, glow0:i ? 0 : 0.55, bg:['#dcebd9', '#f3e2b8', '#ecd6d0'][i], fill:0.8 }));
    fitCard(k, 'D = b² − 4ac', X, 0.78, { w:2.0, d:0.52, bg:'#f6e3c9' });
    const setState = (a, b) => {
      const h = 2.5 - 0.5 * a, kk = -0.25 + 0.25 * a + b;
      pw.group.position.x = -0.5 * a * B.ux; pw.group.position.z = -(0.25 * a + b) * B.uy;
      const d = kk < 0 ? Math.sqrt(-kk) : 0, s = Math.max(0.001, 1 - Math.max(0, kk) * 7);
      rts[0].position.copy(B.P(h - d, 0, 0.2)); rts[1].position.copy(B.P(h + d, 0, 0.2));
      rts.forEach(m => m.scale.setScalar(s));
      const gl = [1 - a, a * (1 - Math.min(1, b * 4)), Math.min(1, b * 4)];
      sc.forEach((c, i) => { c.userData.mat.emissiveIntensity = 0.55 * gl[i]; c.position.y = 0.035 + 0.1 * gl[i]; });
    };
    setState(0, 0);
    /* 움직임: 포물선이 x² − 4x + 4 자리로 옮겨 가며 두 근이 x = 2 에서 하나로 → 더 올라가 x축을 떠나면 근이 사라진다 → 제자리 */
    k.onFrame(t => { const p = cyc(t, 10);
      const a = seg(p, 0.22, 0.36) * (1 - seg(p, 0.86, 0.97)), b = seg(p, 0.46, 0.58) * (1 - seg(p, 0.76, 0.86));
      setState(a, b); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 근과 계수의 관계 — stage ①: x²−5x+6=0 의 두 근 2, 3 → α+β=5, αβ=6. stage ②: α²+β²=(α+β)²−2αβ=25−12=13 */
  'M-27': { seed:327, caps:{ P:9, list:[
    [0.0, "$x^2-5x+6=0$의 두 근은 $\\alpha=2$, $\\beta=3$입니다.", "The roots of $x^2-5x+6=0$ are $\\alpha=2$ and $\\beta=3$.", "$x^2-5x+6=0$的两个根是$\\alpha=2$，$\\beta=3$。"],
    [0.14, "$\\alpha+\\beta=2+3=5$ — 일차항 계수 $-5$의 부호만 바꾼 값입니다.", "$\\alpha+\\beta=2+3=5$: the $x$-coefficient $-5$ with its sign flipped.", "$\\alpha+\\beta=2+3=5$——就是一次项系数$-5$变号。"],
    [0.4, "$\\alpha\\beta=2\\times 3=6$ — 상수항 그대로입니다.", "$\\alpha\\beta=2\\times 3=6$: exactly the constant term.", "$\\alpha\\beta=2\\times 3=6$——正好是常数项。"],
    [0.64, "합과 곱만으로 $\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=25-12=13$도 구합니다.", "Sum and product alone give $\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=25-12=13$.", "只用和与积也能求出$\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta=25-12=13$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.25, 0.05, 0.3], 6.4, 60);
    k.table();
    const B = board(k, { x0:-1.2, x1:5.3, y0:-1.4, y1:7.4, ux:0.52, uy:0.36, cx:-1.2, cz:0.05, fs:0.15, xs:[1, 2, 3, 4, 5], ys:[1, 2, 3, 4, 5, 6, 7],
      extra:(g, X, Y, fs) => { g.fillStyle = '#8a1d16'; g.textBaseline = 'middle'; gtext(k, g, 'α', X(2) - fs * 0.42, Y(0) + fs * 2.1, fs * 1.3); gtext(k, g, 'β', X(3) - fs * 0.4, Y(0) + fs * 2.1, fs * 1.3); } });
    curveWire(k, B, x => (x - 2) * (x - 3), 0.05, 4.95, k.metal('#c46a3a', 0.28), { h:0.15 });
    const pins = [pin(k, B.P(2, 0), '#b3221a'), pin(k, B.P(3, 0), '#b3221a')];
    const X = 2.0;
    const eq = fitCard(k, 'x² − 5x + 6 = 0', X, -1.45, { w:2.4, d:0.52, edge:'#e2b597', glow:true });
    const tiles = [k.tile('2', X - 0.45, -0.72, { w:0.52, d:0.52, h:0.14, size:300, bg:'#f3d6cf', wood:'#c98f6a' }), k.tile('3', X + 0.45, -0.72, { w:0.52, d:0.52, h:0.14, size:300, bg:'#f3d6cf', wood:'#c98f6a' })];
    const cS = fitCard(k, 'α + β = 5', X, -0.02, { w:1.8, d:0.5, glow:true });
    const cP = fitCard(k, 'αβ = 6', X, 0.62, { w:1.8, d:0.5, glow:true });
    const cQ = fitCard(k, 'α² + β² = 25 − 12 = 13', X, 1.3, { w:2.6, d:0.5, bg:'#dcebd9', edge:'#c9d6b5', glow:true });
    const ty = tiles.map(m => m.position.y), py = pins.map(m => m.position.y);
    /* 움직임: 두 근(압정)이 톡 → 2 · 3 타일이 뛰며 합 5, 다시 곱 6 → 두 값으로 α² + β² = 13 → 방정식 카드의 계수가 빛난다 */
    k.onFrame(t => { const p = cyc(t, 9);
      pins.forEach((m, i) => { m.position.y = py[i] + 0.3 * hop(p, 0.02 + i * 0.05, 0.12 + i * 0.05); });
      const h1 = hop(p, 0.16, 0.3), h2 = hop(p, 0.42, 0.56), h3 = hop(p, 0.66, 0.8);
      tiles.forEach((m, i) => { m.position.y = ty[i] + 0.3 * Math.max(h1, h2); });
      cS.position.y = 0.035 + 0.14 * h1; cS.userData.mat.emissiveIntensity = 0.6 * h1;
      cP.position.y = 0.035 + 0.14 * h2; cP.userData.mat.emissiveIntensity = 0.6 * h2;
      cQ.position.y = 0.035 + 0.14 * h3; cQ.userData.mat.emissiveIntensity = 0.5 * h3;
      eq.userData.mat.emissiveIntensity = 0.45 * Math.max(h1, h2); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 근의 공식 — hook: x²−3x+1=0 은 정수로 인수분해가 안 된다. stage ①: D=9−4=5, x=(3±√5)/2 */
  'M-28': { seed:328, caps:{ P:9, list:[
    [0.0, "$x^2-3x+1=0$은 정수로 인수분해되지 않습니다. 그래프도 눈금 사이에서 $x$축을 지납니다.", "$x^2-3x+1=0$ will not factor over the integers; its graph crosses the $x$-axis between grid marks.", "$x^2-3x+1=0$不能用整数因式分解，图象在刻度之间穿过$x$轴。"],
    [0.2, "$D=(-3)^2-4\\times 1\\times 1=5$를 먼저 구합니다.", "First find $D=(-3)^2-4\\times 1\\times 1=5$.", "先求$D=(-3)^2-4\\times 1\\times 1=5$。"],
    [0.42, "가운데 $\\dfrac{3}{2}$에서 양쪽으로 $\\dfrac{\\sqrt{5}}{2}$씩 — $x=\\dfrac{3\\pm\\sqrt{5}}{2}$", "From the middle $\\dfrac{3}{2}$, go $\\dfrac{\\sqrt{5}}{2}$ each way: $x=\\dfrac{3\\pm\\sqrt{5}}{2}$", "从中间$\\dfrac{3}{2}$向两边各走$\\dfrac{\\sqrt{5}}{2}$——$x=\\dfrac{3\\pm\\sqrt{5}}{2}$"],
    [0.74, "근의 공식 $x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$은 어떤 이차방정식에도 통합니다.", "The formula $x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$ works for every quadratic.", "求根公式$x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$对任何二次方程都适用。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.3, 0.05, 0.3], 6.5, 60);
    k.table();
    const B = board(k, { x0:-1.2, x1:4.4, y0:-2.0, y1:4.4, ux:0.64, uy:0.5, cx:-1.2, cz:0.05, fs:0.16, xs:[-1, 1, 2, 3, 4], ys:[-1, 1, 2, 3, 4],
      extra:(g, X, Y) => { g.strokeStyle = 'rgba(60,90,130,.7)'; g.lineWidth = 4; g.setLineDash([16, 12]); g.beginPath(); g.moveTo(X(1.5), Y(4.3)); g.lineTo(X(1.5), Y(-1.9)); g.stroke(); g.setLineDash([]); } });
    curveWire(k, B, x => x * x - 3 * x + 1, -0.72, 3.72, k.metal('#c46a3a', 0.28), { h:0.15 });
    const r5 = Math.sqrt(5) / 2;
    const bs = [bead(k, '#b3221a', 0.085), bead(k, '#b3221a', 0.085)];
    const vb = ring(k, B.P(1.5, 0), '#9a8a66', 0.1);
    const X = 2.15;
    const fm = fitCard(k, ['x = ', { n:['−b ± ', { r:parts('b² − 4ac') }], d:['2a'] }], X, -1.25, { w:2.4, d:0.9, hmax:0.4, fill:0.86, glow:true });
    fitCard(k, 'x² − 3x + 1 = 0', X, -0.35, { w:2.4, d:0.46, edge:'#e2b597' });
    fitCard(k, 'D = 9 − 4 = 5', X, 0.25, { w:2.0, d:0.46 });
    const ans = fitCard(k, ['x = ', { n:['3 ± ', { r:'5' }], d:['2'] }], X, 1.05, { w:1.9, d:0.8, hmax:0.4, bg:'#dcebd9', edge:'#c9d6b5', glow:true });
    const put = s => { bs[0].position.copy(B.P(1.5 - r5 * s, 0, 0.2)); bs[1].position.copy(B.P(1.5 + r5 * s, 0, 0.2)); };
    put(1);
    /* 움직임: 두 근이 가운데 3/2 로 모였다가, 공식 카드가 빛나면 ±√5/2 만큼 양쪽으로 갈라져 제자리(근) */
    k.onFrame(t => { const p = cyc(t, 9);
      const s = 1 - seg(p, 0.06, 0.2) + seg(p, 0.44, 0.64); put(s);
      vb.position.y = 0.1 + 0.15 * hop(p, 0.22, 0.38);
      fm.userData.mat.emissiveIntensity = 0.55 * hop(p, 0.3, 0.5);
      ans.position.y = 0.035 + 0.15 * hop(p, 0.62, 0.76); ans.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.62, 0.76); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 이차부등식 — stage ①: (x−2)(x−5)<0. x=3 이면 1×(−2)=−2<0, x=6 이면 4×1=4>0 → 2<x<5 */
  'M-29': { seed:329, caps:{ P:10, list:[
    [0.0, "$x=3$이면 $(3-2)(3-5)=1\\times(-2)=-2<0$ — 부등식을 만족합니다.", "At $x=3$: $(3-2)(3-5)=1\\times(-2)=-2<0$, so it satisfies the inequality.", "$x=3$时$(3-2)(3-5)=1\\times(-2)=-2<0$——满足不等式。"],
    [0.3, "$x=6$이면 $(6-2)(6-5)=4\\times 1=4>0$ — 만족하지 않습니다.", "At $x=6$: $(6-2)(6-5)=4\\times 1=4>0$, so it does not.", "$x=6$时$(6-2)(6-5)=4\\times 1=4>0$——不满足。"],
    [0.64, "두 인수의 부호가 다를 때만 곱이 음수입니다. 그 자리는 두 근 사이뿐입니다.", "The product is negative only when the two factors differ in sign, which happens only between the roots.", "只有两个因式符号不同时乘积才是负数，那只发生在两根之间。"],
    [0.84, "그래서 $(x-2)(x-5)<0$의 해는 $2<x<5$입니다.", "So the solution of $(x-2)(x-5)<0$ is $2<x<5$.", "所以$(x-2)(x-5)<0$的解是$2<x<5$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.35, 0.05, 0.3], 6.7, 60);
    k.table();
    const B = board(k, { x0:-0.8, x1:7.0, y0:-3.0, y1:5.2, ux:0.5, uy:0.38, cx:-1.15, cz:0.05, fs:0.15, xs:[1, 2, 3, 4, 5, 6], ys:[-2, -1, 1, 2, 3, 4],
      under:(g, X, Y) => { g.fillStyle = 'rgba(180,40,30,.14)'; g.fillRect(X(2), Y(5.2), X(5) - X(2), Y(-3) - Y(5.2));
        g.strokeStyle = 'rgba(170,30,20,.85)'; g.lineWidth = 16; g.beginPath(); g.moveTo(X(2), Y(0)); g.lineTo(X(5), Y(0)); g.stroke(); },
      extra:(g, X, Y) => { g.strokeStyle = 'rgba(170,30,20,.95)'; [2, 5].forEach(v => { g.fillStyle = '#efe6d2'; g.lineWidth = 7; g.beginPath(); g.arc(X(v), Y(0), 30, 0, Math.PI * 2); g.fill(); g.stroke(); }); } });
    const f = x => (x - 2) * (x - 5);
    const cw = curveWire(k, B, f, 0.95, 6.05, k.metal('#3f6fa0', 0.3), { h:0.15 });
    const bd = bead(k, '#fff3d6', 0.09);
    const redM = new THREE.MeshPhysicalMaterial({ color:'#b3221a', roughness:0.3, clearcoat:0.8 });
    const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 12), redM); drop.rotation.x = Math.PI / 2; drop.castShadow = true; scene.add(drop);
    const ft = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), redM); scene.add(ft);
    const X = 2.25;
    fitCard(k, '(x − 2)(x − 5) < 0', X, -1.4, { w:2.4, d:0.5, edge:'#e2b597' });
    const c3 = fitCard(k, '(3 − 2)(3 − 5) = −2', X, -0.7, { w:2.4, d:0.46, bg:'#ecd6d0', glow:true });
    const c6 = fitCard(k, '(6 − 2)(6 − 5) = 4', X, -0.1, { w:2.4, d:0.46, bg:'#dde6ee', glow:true });
    const ans = fitCard(k, '2 < x < 5', X, 0.7, { w:1.8, d:0.6, bg:'#dcebd9', edge:'#c9d6b5', glow:true, hmax:0.6 });
    const neg = new THREE.Color('#b3221a'), pos = new THREE.Color('#2f7a4a');
    const setX = x => { const y = f(x), A = B.P(x, 0, 0.14), P = B.P(x, y, 0.14), L = Math.max(0.001, Math.abs(P.z - A.z));
      bd.position.copy(B.P(x, y, 0.23));
      drop.scale.y = L; drop.position.set(A.x, 0.14, (A.z + P.z) / 2); ft.position.copy(A);
      redM.color.copy(y < 0 ? neg : pos); };
    setX(3);
    /* 움직임: 구슬이 곡선을 따라 x = 3(음수, 붉은 막대) → x = 6(양수, 초록 막대) → 다시 x = 3. 끝에 2 < x < 5 카드가 톡 */
    k.onFrame(t => { const p = cyc(t, 10);
      const u = seg(p, 0.12, 0.34) * (1 - seg(p, 0.5, 0.72)); setX(3 + 3 * u);
      c3.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.0, 0.12); c3.position.y = 0.035 + 0.12 * hop(p, 0.0, 0.12);
      c6.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.32, 0.5); c6.position.y = 0.035 + 0.12 * hop(p, 0.32, 0.5);
      ans.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.8, 0.96); ans.position.y = 0.035 + 0.16 * hop(p, 0.8, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 행렬의 덧셈·곱셈 — hook: 수를 2×2 네모 칸에 정리한 표. stage ①: (1 2 / 3 4) + (5 0 / 1 2) = (6 2 / 4 6), 같은 자리끼리.
     stage ②: (1 2 / 3 4) × (5 6 / 7 8) = (19 22 / 43 50), 앞 행렬의 행과 뒤 행렬의 열을 짝지어 */
  'M-30': { seed:330, caps:{ P:10, list:[
    [0.0, "덧셈은 같은 자리끼리: $1+5=6$, $2+0=2$, $3+1=4$, $4+2=6$", "Addition goes position by position: $1+5=6$, $2+0=2$, $3+1=4$, $4+2=6$", "加法是相同位置相加：$1+5=6$，$2+0=2$，$3+1=4$，$4+2=6$"],
    [0.46, "곱셈은 앞 행렬의 행과 뒤 행렬의 열을 짝지어 곱하고 더합니다.", "Multiplication pairs a row of the first matrix with a column of the second, multiplies, and adds.", "乘法是把前一个矩阵的行和后一个矩阵的列配对，相乘再相加。"],
    [0.56, "첫째 행: $1\\times 5+2\\times 7=19$, $1\\times 6+2\\times 8=22$", "First row: $1\\times 5+2\\times 7=19$, $1\\times 6+2\\times 8=22$", "第一行：$1\\times 5+2\\times 7=19$，$1\\times 6+2\\times 8=22$"],
    [0.76, "둘째 행도 같은 방법: $3\\times 5+4\\times 7=43$, $3\\times 6+4\\times 8=50$", "The second row the same way: $3\\times 5+4\\times 7=43$, $3\\times 6+4\\times 8=50$", "第二行同样：$3\\times 5+4\\times 7=43$，$3\\times 6+4\\times 8=50$"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.05, 0.1, 0.52], 6.2, 54);
    k.table();
    k.paper(6.9, 3.9, -0.05, 0.2, 0);
    const S = 0.56, G = 0.07, off = (S + G) / 2;
    const bracketM = k.lacquer('#2a1c14');
    const bracket = (cx, cz, side) => { const x0 = cx + side * (off + S / 2 + 0.05), x1 = x0 + side * 0.1;
      const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(x0, 0.06, cz - off - S / 2 - 0.02), new THREE.Vector3(x1 + side * 0.05, 0.06, cz), new THREE.Vector3(x0, 0.06, cz + off + S / 2 + 0.02));
      const m = new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.03, 12), bracketM); m.castShadow = true; scene.add(m); };
    const mat = (vals, cx, cz, o) => { bracket(cx, cz, -1); bracket(cx, cz, 1);
      return vals.map((v, i) => k.tile(String(v), cx + (i % 2 ? off : -off), cz + (i < 2 ? -off : off), Object.assign({ w:S, d:S, h:0.13, size:String(v).length > 1 ? 250 : 310 }, o))); };
    const cA = { bg:'#f3e7cf', wood:'#d9b27c' }, cB = { bg:'#e3ecf3', wood:'#9fb6c9' }, cC = { bg:'#dcebd9', wood:'#a9c79a' };
    const XA = -2.35, XB = -0.1, XC = 2.15, Z1 = -0.62, Z2 = 1.02;
    const sign = (t, x, z) => fitCard(k, t, x, z, { w:0.44, d:0.44, hmax:0.75, fill:0.7 });
    const A1 = mat([1, 2, 3, 4], XA, Z1, cA), B1 = mat([5, 0, 1, 2], XB, Z1, cB), C1 = mat([6, 2, 4, 6], XC, Z1, cC);
    sign('+', (XA + XB) / 2, Z1); sign('=', (XB + XC) / 2, Z1);
    const A2 = mat([1, 2, 3, 4], XA, Z2, cA), B2 = mat([5, 6, 7, 8], XB, Z2, cB), C2 = mat([19, 22, 43, 50], XC, Z2, cC);
    sign('×', (XA + XB) / 2, Z2); sign('=', (XB + XC) / 2, Z2);
    const all = [...A1, ...B1, ...C1, ...A2, ...B2, ...C2];
    /* 움직임: 덧셈 — 같은 자리 둘이 함께 톡, 곧이어 결과 칸. 곱셈 — 앞 행렬의 행 둘과 뒤 행렬의 열 둘이 함께 톡, 곧이어 결과 칸 */
    k.onFrame(t => { const p = cyc(t, 10); const up = all.map(() => 0);
      const lift = (arr, i, u) => { const n = all.indexOf(arr[i]); up[n] = Math.max(up[n], u); };
      for(let i = 0; i < 4; i++){ const a = 0.04 + i * 0.1, u = hop(p, a, a + 0.09), v = hop(p, a + 0.05, a + 0.14);
        lift(A1, i, u); lift(B1, i, u); lift(C1, i, v); }
      for(let i = 0; i < 4; i++){ const a = 0.52 + i * 0.1, u = hop(p, a, a + 0.09), v = hop(p, a + 0.05, a + 0.14);
        const r = i < 2 ? 0 : 2, c = i % 2;
        lift(A2, r, u); lift(A2, r + 1, u); lift(B2, c, u); lift(B2, c + 2, u); lift(C2, i, v); }
      all.forEach((m, n) => { m.position.y = 0.26 * up[n]; }); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.3], envOpts:{ intensity:0.6 } });
  }},
};
