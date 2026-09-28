/* C40 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
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

/* 판 위 두 점 사이 곧은 철사(끝 구슬 포함) */
function seg3(k, a, b, mat, r){
  const { THREE, scene } = k;
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 8, r || 0.03, 12), mat); m.castShadow = true; g.add(m);
  [a, b].forEach(p => { const c = new THREE.Mesh(new THREE.SphereGeometry((r || 0.03) * 1.05, 16, 12), mat); c.position.copy(p); g.add(c); });
  scene.add(g); return g;
}
/* 직선 y = f(x) 를 판 안(y0~y1)에 들어오는 x 범위로 자른다 */
const clipX = (f, x0, x1, y0, y1) => { const xs = []; for(let i = 0; i <= 400; i++){ const x = x0 + (x1 - x0) * i / 400, y = f(x); if(y >= y0 && y <= y1) xs.push(x); } return [xs[0], xs[xs.length - 1]]; };

export const SCENES_C40 = {

  /* 두 점 사이의 거리 — history: 두 점을 잇는 선분은 가로·세로 변화량으로 만든 직각삼각형의 빗변(피타고라스 정리).
     stage ①: A(0,0), B(3,4), Δx=3, Δy=4, AB²=9+16=25, AB=5 */
  'M-31': { seed:331, caps:{ P:9, list:[
    [0.0, "$A(0,\\,0)$에서 $B(3,\\,4)$까지 가로로 $3$, 세로로 $4$만큼 갑니다.", "From $A(0,\\,0)$ to $B(3,\\,4)$: $3$ across and $4$ up.", "从$A(0,\\,0)$到$B(3,\\,4)$：横着走$3$，竖着走$4$。"],
    [0.44, "선분 $\\overline{AB}$는 두 변이 $3$, $4$인 직각삼각형의 빗변입니다.", "The segment $\\overline{AB}$ is the hypotenuse of a right triangle with legs $3$ and $4$.", "线段$\\overline{AB}$是两直角边为$3$和$4$的直角三角形的斜边。"],
    [0.62, "$\\overline{AB}^2=3^2+4^2=25$", "$\\overline{AB}^2=3^2+4^2=25$", "$\\overline{AB}^2=3^2+4^2=25$"],
    [0.8, "$\\overline{AB}=\\sqrt{25}=5$ — 자로 재지 않고 좌표만으로 거리를 구합니다.", "$\\overline{AB}=\\sqrt{25}=5$: the distance from coordinates alone, no ruler needed.", "$\\overline{AB}=\\sqrt{25}=5$——不用尺子，只用坐标就求出距离。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.3, 0.05, 0.3], 6.2, 60);
    k.table();
    const B = board(k, { x0:-0.9, x1:4.6, y0:-0.9, y1:5.0, u:0.58, cx:-1.15, cz:0.05, fs:0.15, xs:[1, 2, 3, 4], ys:[1, 2, 3, 4],
      extra:(g, X, Y, fs) => { g.fillStyle = '#2b2118'; g.textBaseline = 'middle';
        k.mathText(g, 'A', X(-0.45), Y(0.45), fs * 1.25); k.mathText(g, 'B', X(2.45), Y(4.15), fs * 1.25);
        g.fillStyle = '#8a4a14'; k.mathText(g, '3', X(1.5), Y(0) + fs * 2.0, fs * 1.4); g.fillStyle = '#8a1d16'; k.mathText(g, '4', X(3) + fs * 1.1, Y(2), fs * 1.4); } });
    const brass = k.metal('#c9a14f', 0.3), cu = k.metal('#b3462a', 0.3), blue = k.metal('#3f6fa0', 0.3);
    const PA = B.P(0, 0), PC = B.P(3, 0), PB = B.P(3, 4);
    seg3(k, PA, PC, brass, 0.03); seg3(k, PC, PB, cu, 0.03);
    const hyp = seg3(k, PA.clone().setY(0.16), PB.clone().setY(0.16), blue, 0.034);
    /* 직각 표시 */
    const s = 0.22, sq = [B.P(3 - 0.4, 0, 0.12), B.P(3 - 0.4, 0.4, 0.12), B.P(3, 0.4, 0.12)];
    seg3(k, sq[0], sq[1], brass, 0.012); seg3(k, sq[1], sq[2], brass, 0.012);
    const pins = [pin(k, PA, '#b3221a'), pin(k, PB, '#b3221a')];
    const bd = bead(k, '#fff3d6', 0.085);
    const X = 2.05;
    fitCard(k, 'Δx = 3,  Δy = 4', X, -1.1, { w:2.3, d:0.5 });
    const c1 = fitCard(k, 'AB² = 3² + 4² = 25', X, -0.35, { w:2.5, d:0.52, glow:true });
    const c2 = fitCard(k, ['AB = ', { r:'25' }, ' = 5'], X, 0.5, { w:2.2, d:0.66, hmax:0.5, bg:'#dcebd9', edge:'#c9d6b5', glow:true });
    const at = (a, b, u) => new THREE.Vector3().lerpVectors(a, b, u).setY(0.24);
    bd.position.copy(at(PA, PC, 0));
    const py = pins.map(m => m.position.y);
    /* 움직임: 구슬이 가로 3 → 세로 4 로 B 까지, 빗변이 톡 떠오르고 → 빗변을 따라 A 로 돌아온다 */
    k.onFrame(t => { const p = cyc(t, 9);
      const u1 = seg(p, 0.06, 0.24), u2 = seg(p, 0.26, 0.44), u3 = seg(p, 0.62, 0.86);
      if(u3 > 0) bd.position.copy(at(PB, PA, u3)); else if(u2 > 0) bd.position.copy(at(PC, PB, u2)); else bd.position.copy(at(PA, PC, u1));
      hyp.position.y = 0.1 * hop(p, 0.44, 0.6);
      pins[1].position.y = py[1] + 0.25 * hop(p, 0.42, 0.52); pins[0].position.y = py[0] + 0.25 * hop(p, 0.86, 0.96);
      c1.position.y = 0.035 + 0.12 * hop(p, 0.62, 0.78); c1.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.62, 0.78);
      c2.position.y = 0.035 + 0.14 * hop(p, 0.8, 0.96); c2.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.8, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 중점과 내분점 — hook: 반씩 나누는 중점은 안다. 2:1 로 나누는 점은? stage ②: A(1,1), B(7,4) 를 2:1 로 내분 → P(5,3) */
  'M-32': { seed:332, caps:{ P:10, list:[
    [0.0, "$A(1,\\,1)$과 $B(7,\\,4)$를 잇는 선분을 $2:1$로 나누는 점 $P$를 찾습니다.", "Find the point $P$ dividing segment $AB$, from $A(1,\\,1)$ to $B(7,\\,4)$, in the ratio $2:1$.", "求把$A(1,\\,1)$到$B(7,\\,4)$的线段分成$2:1$的点$P$。"],
    [0.16, "중점은 $1:1$로 나누는 특별한 경우입니다: $(4,\\,2.5)$", "The midpoint is the special $1:1$ case: $(4,\\,2.5)$", "中点是分成$1:1$的特殊情况：$(4,\\,2.5)$"],
    [0.5, "$P_x=\\dfrac{1\\times 1+2\\times 7}{2+1}=5$, $P_y=\\dfrac{1\\times 1+2\\times 4}{2+1}=3$", "$P_x=\\dfrac{1\\times 1+2\\times 7}{2+1}=5$, $P_y=\\dfrac{1\\times 1+2\\times 4}{2+1}=3$", "$P_x=\\dfrac{1\\times 1+2\\times 7}{2+1}=5$，$P_y=\\dfrac{1\\times 1+2\\times 4}{2+1}=3$"],
    [0.78, "그래서 $P=(5,\\,3)$ — $A$ 쪽으로 $2$칸, $B$ 쪽으로 $1$칸입니다.", "So $P=(5,\\,3)$: two parts from $A$, one part from $B$.", "所以$P=(5,\\,3)$——离$A$两份，离$B$一份。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.35, 0.05, 0.28], 6.4, 70);
    k.table();
    const B = board(k, { x0:-0.7, x1:8.0, y0:-0.8, y1:5.4, u:0.44, cx:-1.0, cz:0.05, fs:0.14, xs:[1, 2, 3, 4, 5, 6, 7], ys:[1, 2, 3, 4, 5],
      extra:(g, X, Y, fs) => { g.fillStyle = '#2b2118'; g.textBaseline = 'middle';
        k.mathText(g, 'A', X(1) - fs * 0.2, Y(1) + fs * 1.0, fs * 1.25); k.mathText(g, 'B', X(7) + fs * 0.4, Y(4) + fs * 1.1, fs * 1.25);
        g.fillStyle = '#8a4a14'; k.mathText(g, 'P', X(5) + fs * 0.7, Y(3) + fs * 1.25, fs * 1.25);
        const nx = -3 / Math.hypot(6, 3), ny = 6 / Math.hypot(6, 3);   /* 선분에 수직(판 위쪽) */
        g.fillStyle = '#9a3d12'; k.mathText(g, '2', X(3 + nx * 0.75), Y(2 + ny * 0.75), fs * 1.5); k.mathText(g, '1', X(6 + nx * 0.75), Y(3.5 + ny * 0.75), fs * 1.5); } });
    seg3(k, B.P(1, 1), B.P(7, 4), k.metal('#3f6fa0', 0.3), 0.03);
    const pins = [pin(k, B.P(1, 1), '#b3221a'), pin(k, B.P(7, 4), '#b3221a')];
    /* 세 등분 눈금(작은 고리) */
    [[3, 2], [5, 3]].forEach(([x, y]) => ring(k, B.P(x, y), '#9a8a66', 0.07));
    const PP = B.P(5, 3, 0.2), MM = B.P(4, 2.5, 0.2);
    const bd = bead(k, '#e0a23a', 0.1); bd.position.copy(PP);
    const X = 2.35;
    fitCard(k, 'm : n = 2 : 1', X, -1.2, { w:1.9, d:0.48 });
    const cx = fitCard(k, [{ n:['1 × 1 + 2 × 7'], d:['2 + 1'] }, ' = 5'], X, -0.45, { w:2.2, d:0.72, hmax:0.4, glow:true });
    const cy = fitCard(k, [{ n:['1 × 1 + 2 × 4'], d:['2 + 1'] }, ' = 3'], X, 0.38, { w:2.2, d:0.72, hmax:0.4, glow:true });
    const ans = fitCard(k, 'P = (5, 3)', X, 1.12, { w:1.8, d:0.52, bg:'#dcebd9', edge:'#c9d6b5', glow:true });
    const py = pins.map(m => m.position.y);
    /* 움직임: P 가 중점(1:1)으로 미끄러졌다가 → 다시 2:1 자리로. 그때 두 좌표 카드가 차례로 빛나고, 끝에 P = (5, 3) */
    k.onFrame(t => { const p = cyc(t, 10);
      const u = seg(p, 0.14, 0.28) * (1 - seg(p, 0.42, 0.56));
      bd.position.lerpVectors(PP, MM, u); bd.position.y += 0.2 * (hop(p, 0.14, 0.28) + hop(p, 0.42, 0.56));
      pins.forEach((m, i) => { m.position.y = py[i] + 0.25 * hop(p, 0.02 + i * 0.05, 0.12 + i * 0.05); });
      cx.position.y = 0.035 + 0.12 * hop(p, 0.56, 0.68); cx.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.56, 0.68);
      cy.position.y = 0.035 + 0.12 * hop(p, 0.66, 0.78); cy.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.66, 0.78);
      ans.position.y = 0.035 + 0.14 * hop(p, 0.8, 0.95); ans.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.8, 0.95); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 직선의 방정식 — stage ①: A(1,3), B(3,7), Δx=2, Δy=4, a=4/2=2. history: 한 점을 대입하면 y절편 → y=2x+1 */
  'M-33': { seed:333, caps:{ P:10, list:[
    [0.0, "$A(1,\\,3)$에서 $B(3,\\,7)$까지 $x$는 $2$, $y$는 $4$만큼 변합니다.", "From $A(1,\\,3)$ to $B(3,\\,7)$, $x$ changes by $2$ and $y$ by $4$.", "从$A(1,\\,3)$到$B(3,\\,7)$，$x$变化$2$，$y$变化$4$。"],
    [0.08, "$x$가 $1$ 늘 때마다 $y$는 $2$씩 늘어납니다: $a=\\dfrac{4}{2}=2$", "Each time $x$ grows by $1$, $y$ grows by $2$: $a=\\dfrac{4}{2}=2$", "$x$每增加$1$，$y$就增加$2$：$a=\\dfrac{4}{2}=2$"],
    [0.54, "한 점 $A$를 대입하면 $3=2\\times 1+b$, 그래서 $b=1$입니다.", "Substitute point $A$: $3=2\\times 1+b$, so $b=1$.", "代入点$A$：$3=2\\times 1+b$，所以$b=1$。"],
    [0.8, "두 점을 지나는 직선은 $y=2x+1$입니다.", "The line through the two points is $y=2x+1$.", "经过两点的直线是$y=2x+1$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.3, 0.05, 0.3], 6.4, 60);
    k.table();
    const B = board(k, { x0:-0.9, x1:4.4, y0:-0.8, y1:8.4, ux:0.66, uy:0.37, cx:-1.15, cz:0.05, fs:0.15, xs:[1, 2, 3, 4], ys:[1, 2, 3, 4, 5, 6, 7, 8],
      extra:(g, X, Y, fs) => { g.fillStyle = '#2b2118'; g.textBaseline = 'middle';
        k.mathText(g, 'A', X(1) - fs * 1.1, Y(3) - fs * 0.55, fs * 1.25); k.mathText(g, 'B', X(3) + fs * 1.0, Y(7) + fs * 0.3, fs * 1.25);
        g.fillStyle = '#8a4a14'; k.mathText(g, '2', X(2), Y(3) + fs * 1.1, fs * 1.4); g.fillStyle = '#8a1d16'; k.mathText(g, '4', X(3) + fs * 0.9, Y(5), fs * 1.4); } });
    const f = x => 2 * x + 1;
    seg3(k, B.P(-0.2, f(-0.2), 0.12), B.P(3.65, f(3.65), 0.12), k.metal('#3f6fa0', 0.3), 0.028);
    const brass = k.metal('#c9a14f', 0.3), cu = k.metal('#b3462a', 0.3);
    seg3(k, B.P(1, 3, 0.1), B.P(3, 3, 0.1), brass, 0.024); seg3(k, B.P(3, 3, 0.1), B.P(3, 7, 0.1), cu, 0.024);
    const pins = [pin(k, B.P(1, 3), '#b3221a'), pin(k, B.P(3, 7), '#b3221a')];
    const yi = pin(k, B.P(0, 1), '#2f7a4a');
    const bd = bead(k, '#fff3d6', 0.08);
    const X = 2.1;
    fitCard(k, 'Δx = 2,  Δy = 4', X, -1.3, { w:2.2, d:0.48 });
    const ca = fitCard(k, ['a = ', { n:['4'], d:['2'] }, ' = 2'], X, -0.58, { w:1.8, d:0.7, hmax:0.42, glow:true });
    const cb = fitCard(k, '3 = 2 × 1 + b', X, 0.2, { w:2.1, d:0.48, glow:true });
    const cl = fitCard(k, 'y = 2x + 1', X, 0.9, { w:2.0, d:0.56, bg:'#dcebd9', edge:'#c9d6b5', glow:true });
    /* 계단: A 에서 가로 1 · 세로 2 · 가로 1 · 세로 2 → B */
    const stair = [[1, 3], [2, 3], [2, 5], [3, 5], [3, 7]].map(([x, y]) => B.P(x, y, 0.22));
    const put = v => { bd.position.copy(v); };
    put(stair[0]);
    const py = pins.map(m => m.position.y), yy = yi.position.y;
    /* 움직임: 구슬이 가로 1 · 세로 2 씩 두 번 계단을 올라 B 로 → 직선을 타고 내려와 y절편 (0, 1) 을 지나 → A 로 돌아온다 */
    k.onFrame(t => { const p = cyc(t, 10);
      const q = seg(p, 0.08, 0.46) * 4, i = Math.min(3, Math.floor(q));
      if(p < 0.5) put(new THREE.Vector3().lerpVectors(stair[i], stair[i + 1], Math.min(1, q - i)));
      else { const d = seg(p, 0.56, 0.74), r = seg(p, 0.82, 0.94);
        const xx = r > 0 ? 0 + r : 3 - 3 * d; put(B.P(xx, f(xx), 0.22)); }
      yi.position.y = yy + 0.28 * hop(p, 0.72, 0.82);
      pins[1].position.y = py[1] + 0.22 * hop(p, 0.44, 0.54);
      ca.position.y = 0.035 + 0.12 * hop(p, 0.2, 0.4); ca.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.2, 0.4);
      cb.position.y = 0.035 + 0.12 * hop(p, 0.58, 0.72); cb.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.58, 0.72);
      cl.position.y = 0.035 + 0.14 * hop(p, 0.8, 0.95); cl.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.8, 0.95); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 두 직선의 평행과 수직 — stage ①: 2x+3y+1=0, 4x+ky+5=0 평행 → 2/3=4/k, k=6. stage ②: 3x+2y+1=0, kx−6y+4=0 수직 → 3k+2×(−6)=0, k=4 */
  'M-34': { seed:334, caps:{ P:10, list:[
    [0.0, "$2x+3y+1=0$과 $4x+ky+5=0$이 평행하려면 $\\dfrac{2}{3}=\\dfrac{4}{k}$, 그래서 $k=6$입니다.", "For $2x+3y+1=0$ and $4x+ky+5=0$ to be parallel, $\\dfrac{2}{3}=\\dfrac{4}{k}$, so $k=6$.", "要使$2x+3y+1=0$与$4x+ky+5=0$平行，$\\dfrac{2}{3}=\\dfrac{4}{k}$，所以$k=6$。"],
    [0.2, "평행한 두 직선은 기울기가 같아 아무리 가도 만나지 않습니다.", "Parallel lines have the same slope, so they never meet.", "平行的两条直线斜率相同，永远不会相交。"],
    [0.5, "$3x+2y+1=0$과 $kx-6y+4=0$이 수직이려면 $3k+2\\times(-6)=0$, 그래서 $k=4$입니다.", "For $3x+2y+1=0$ and $kx-6y+4=0$ to be perpendicular, $3k+2\\times(-6)=0$, so $k=4$.", "要使$3x+2y+1=0$与$kx-6y+4=0$垂直，$3k+2\\times(-6)=0$，所以$k=4$。"],
    [0.8, "기울기 $-\\dfrac{3}{2}$와 $\\dfrac{2}{3}$의 곱은 $-1$ — 두 직선이 직각으로 만납니다.", "The slopes $-\\dfrac{3}{2}$ and $\\dfrac{2}{3}$ multiply to $-1$: the lines meet at a right angle.", "斜率$-\\dfrac{3}{2}$与$\\dfrac{2}{3}$之积为$-1$——两直线成直角相交。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.05, 0.62], 7.2, 56);
    k.table();
    const o = { x0:-3, x1:3, y0:-2.6, y1:2.6, u:0.46, cz:-0.5, fs:0.16, xs:[-2, -1, 1, 2], ys:[-2, -1, 1, 2] };
    const L = board(k, Object.assign({ cx:-1.78 }, o)), R = board(k, Object.assign({ cx:1.78 }, o));
    const brass = k.metal('#3f6fa0', 0.3), cu = k.metal('#b3462a', 0.3);
    const line = (Bd, f, mat) => { const [a, b] = clipX(f, -2.95, 2.95, -2.55, 2.55); return { a, b, w:seg3(k, Bd.P(a, f(a), 0.12), Bd.P(b, f(b), 0.12), mat, 0.028), at:u => Bd.P(a + (b - a) * u, f(a + (b - a) * u), 0.21) }; };
    const f1 = x => -2 / 3 * x - 1 / 3, f2 = x => -2 / 3 * x - 5 / 6, g1 = x => -1.5 * x - 0.5, g2 = x => 2 / 3 * x + 2 / 3;
    const l1 = line(L, f1, brass), l2 = line(L, f2, cu), m1 = line(R, g1, brass), m2 = line(R, g2, cu);
    /* 교점과 직각 표시 */
    const ix = -7 / 13, iy = g2(ix), s = 0.42;
    const d1 = [1, -1.5].map(v => v / Math.hypot(1, 1.5)), d2 = [1, 2 / 3].map(v => v / Math.hypot(1, 2 / 3));
    const sqp = [R.P(ix + d1[0] * s, iy + d1[1] * s, 0.12), R.P(ix + (d1[0] + d2[0]) * s, iy + (d1[1] + d2[1]) * s, 0.12), R.P(ix + d2[0] * s, iy + d2[1] * s, 0.12)];
    const corner = new THREE.Group(); scene.add(corner);
    const gold = k.metal('#d4b05a', 0.25);
    [seg3(k, sqp[0], sqp[1], gold, 0.016), seg3(k, sqp[1], sqp[2], gold, 0.016)].forEach(m => { scene.remove(m); corner.add(m); });
    /* 식 카드 */
    const CO = { w:1.62, d:0.44 };
    fitCard(k, '2x + 3y + 1 = 0', -2.6, 1.08, Object.assign({ edge:'#b9c9da' }, CO)); fitCard(k, '4x + 6y + 5 = 0', -0.95, 1.08, Object.assign({ edge:'#e2b597' }, CO));
    fitCard(k, '3x + 2y + 1 = 0', 0.95, 1.08, Object.assign({ edge:'#b9c9da' }, CO)); fitCard(k, '4x − 6y + 4 = 0', 2.6, 1.08, Object.assign({ edge:'#e2b597' }, CO));
    const kL = fitCard(k, [{ n:['2'], d:['3'] }, ' = ', { n:['4'], d:['k'] }, ',   k = 6'], -1.78, 1.86, { w:2.5, d:0.74, hmax:0.4, bg:'#dcebd9', edge:'#c9d6b5', glow:true });
    const kR = fitCard(k, '3k + 2 × (−6) = 0,   k = 4', 1.78, 1.86, { w:3.0, d:0.56, bg:'#dcebd9', edge:'#c9d6b5', glow:true });
    /* 구슬: 왼쪽은 두 평행선 위를 나란히, 오른쪽은 교점에서 만나 있다 */
    const bl = [bead(k, '#fff3d6', 0.075), bead(k, '#fff3d6', 0.075)], br = [bead(k, '#fff3d6', 0.075), bead(k, '#fff3d6', 0.075)];
    const xAt = (ln, x) => (x - ln.a) / (ln.b - ln.a);
    const uL0 = [xAt(l1, -1.8), xAt(l2, -1.8)], uL1 = [xAt(l1, 1.8), xAt(l2, 1.8)];
    const uR = [xAt(m1, ix), xAt(m2, ix)], uRf = [xAt(m1, -1.3), xAt(m2, 1.8)];
    const setAll = (a, b) => { [l1, l2].forEach((ln, i) => bl[i].position.copy(ln.at(uL0[i] + (uL1[i] - uL0[i]) * a)));
      [m1, m2].forEach((ln, i) => br[i].position.copy(ln.at(uR[i] + (uRf[i] - uR[i]) * b))); };
    setAll(0, 0);
    /* 움직임: 평행선 위 두 구슬이 나란히 달려도 간격은 그대로 → 수직인 두 직선 위 구슬은 멀어졌다가 교점에서 다시 만나고 직각 표시가 톡 */
    k.onFrame(t => { const p = cyc(t, 10);
      const a = seg(p, 0.06, 0.26) * (1 - seg(p, 0.3, 0.48)), b = seg(p, 0.54, 0.66) * (1 - seg(p, 0.7, 0.82));
      setAll(a, b);
      kL.position.y = 0.035 + 0.12 * hop(p, 0.0, 0.1); kL.userData.mat.emissiveIntensity = 0.45 * hop(p, 0.0, 0.1);
      kR.position.y = 0.035 + 0.12 * hop(p, 0.5, 0.6); kR.userData.mat.emissiveIntensity = 0.45 * hop(p, 0.5, 0.6);
      corner.position.y = 0.2 * hop(p, 0.82, 0.95); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},

  /* 원의 방정식 — hook: x²+y²−4x−6y+9=0 은 어떻게 원일까. stage ①: (x−2)²+(y−3)²=4 → 중심 (2,3), 반지름 2.
     history: 원은 중심에서 거리가 항상 r 인 점들의 모임(거리 공식) */
  'M-35': { seed:335, caps:{ P:9, list:[
    [0.0, "$x^2+y^2-4x-6y+9=0$에서 $x$항끼리, $y$항끼리 묶어 완전제곱식을 만듭니다.", "In $x^2+y^2-4x-6y+9=0$, group the $x$-terms and the $y$-terms and complete the squares.", "在$x^2+y^2-4x-6y+9=0$中，把$x$项、$y$项分别配成完全平方。"],
    [0.12, "$(x-2)^2+(y-3)^2=4$ — 중심 $(2,\\,3)$, 반지름 $2$인 원입니다.", "$(x-2)^2+(y-3)^2=4$: a circle with centre $(2,\\,3)$ and radius $2$.", "$(x-2)^2+(y-3)^2=4$——圆心$(2,\\,3)$、半径$2$的圆。"],
    [0.4, "원 위의 어느 점이든 중심까지의 거리는 $2$입니다.", "Every point on the circle is at distance $2$ from the centre.", "圆上任意一点到圆心的距离都是$2$。"],
    [0.76, "거리 공식 그대로: $(x-a)^2+(y-b)^2=r^2$", "It is just the distance formula: $(x-a)^2+(y-b)^2=r^2$", "就是距离公式：$(x-a)^2+(y-b)^2=r^2$"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.35, 0.05, 0.4], 6.5, 60);
    k.table();
    const B = board(k, { x0:-0.9, x1:4.8, y0:-0.8, y1:5.8, u:0.5, cx:-1.2, cz:0.05, fs:0.14, xs:[1, 2, 3, 4], ys:[1, 2, 3, 4, 5] });
    const C = B.P(2, 3, 0.13), R = 2 * B.ux;
    const circ = new THREE.Mesh(new THREE.TorusGeometry(R, 0.03, 16, 160), k.metal('#b3462a', 0.3)); circ.rotation.x = -Math.PI / 2; circ.position.copy(C); circ.castShadow = true; scene.add(circ);
    const cp = pin(k, C, '#b3221a');
    const arm = new THREE.Group(); arm.position.set(C.x, 0.16, C.z); scene.add(arm);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, R, 12), k.metal('#c9a14f', 0.3)); rod.rotation.z = Math.PI / 2; rod.position.x = R / 2; rod.castShadow = true; arm.add(rod);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 16), new THREE.MeshPhysicalMaterial({ color:'#fff3d6', roughness:0.22, clearcoat:1 })); tip.position.x = R; tip.position.y = 0.04; tip.castShadow = true; arm.add(tip);
    const rl = fitCard(k, '2', C.x + R / 2, C.z - 0.2, { w:0.3, d:0.3, hmax:0.7, bg:'#f6e3c9', y:0.13 }); scene.remove(rl); arm.add(rl); rl.position.set(R / 2, -0.03, -0.2);
    const X = 2.2;
    fitCard(k, 'x² + y² − 4x − 6y + 9 = 0', X, -1.35, { w:2.9, d:0.5, edge:'#e2b597' });
    fitCard(k, '(x² − 4x + 4) + (y² − 6y + 9) = 4', X, -0.65, { w:2.9, d:0.5 });
    const eq = fitCard(k, '(x − 2)² + (y − 3)² = 4', X, 0.1, { w:2.9, d:0.56, bg:'#dcebd9', edge:'#c9d6b5', glow:true });
    const cr = fitCard(k, '(2, 3),   r = 2', X, 0.85, { w:2.0, d:0.5, bg:'#f6e3c9', glow:true });
    const cy0 = cp.position.y;
    /* 움직임: 중심에 꽂힌 반지름 막대(길이 2)가 한 바퀴 — 끝의 구슬이 원을 그대로 따라간다 */
    k.onFrame(t => { const p = cyc(t, 9);
      arm.rotation.y = 2 * Math.PI * seg(p, 0.36, 0.74);
      cp.position.y = cy0 + 0.25 * hop(p, 0.14, 0.26);
      eq.position.y = 0.035 + 0.12 * hop(p, 0.1, 0.3); eq.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.1, 0.3);
      cr.position.y = 0.035 + 0.12 * hop(p, 0.78, 0.94); cr.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.78, 0.94); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.2, 0, 0.1], envOpts:{ intensity:0.7 } });
  }},
};
