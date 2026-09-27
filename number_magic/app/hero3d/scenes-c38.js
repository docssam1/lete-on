/* C38 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

/* 수식 조각 그리기 — 문자열(mathText), {sup:'2'}(윗첨자). 너비를 돌려준다(draw=false 면 재기만) */
function mdraw(k, g, parts, x, cy, fs, draw){
  let cx = x;
  parts.forEach(p => {
    if(typeof p === 'string'){ const w = k.mathText(g, p, cx, cy, fs, { align:'left', draw }); cx += w; return; }
    if(p.sup != null){ const w = k.mathText(g, p.sup, cx - fs * 0.02, cy - fs * 0.32, fs * 0.62, { align:'left', draw }); cx += w + fs * 0.02; }
  });
  return cx - x;
}
/* 'x²' 같은 문자열을 조각으로 — ²·³·⁴ 는 진짜 윗첨자로 */
const SUP = { '²':'2', '³':'3', '⁴':'4' };
const P = t => { const out = []; String(t).split(/([²³⁴])/).forEach(s => { if(SUP[s]) out.push({ sup:SUP[s] }); else if(s) out.push(s); }); return out; };
/* 수식 판 텍스처 — 폭에 맞춰 글자 크기를 줄인다 */
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
/* 수식 카드 — 윗면이 빛날 수 있다(o.glow). o.back 이면 뒷면(z 축 반 바퀴 돌리면 읽힘) */
function mcard(k, txt, x, z, o){
  o = o || {};
  const { THREE, scene } = k;
  const w = o.w || 1.0, d = o.d || 0.8, h = o.h || 0.04, pw = 1024, ph = Math.round(1024 * d / w);
  const grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, Math.min(0.04, d * 0.1)), new THREE.MeshStandardMaterial({ color:o.edge || '#e9dcc0', roughness:0.85 }));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  const tex = mtex(k, P(txt), pw, ph, o);
  const mat = new THREE.MeshStandardMaterial({ map:tex, roughness:0.8, emissive:new THREE.Color('#ffd89a'), emissiveMap:tex, emissiveIntensity:0 });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), mat);
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
  if(o.back != null){ const bt = mtex(k, P(o.back), pw, ph, Object.assign({}, o, o.backOpts || {})); bt.center.set(0.5, 0.5); bt.rotation = Math.PI;
    const bm = new THREE.MeshStandardMaterial({ map:bt, roughness:0.8, emissive:new THREE.Color('#ffd89a'), emissiveMap:bt, emissiveIntensity:0 });
    const back = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), bm);
    back.rotation.x = Math.PI / 2; back.position.y = -0.002; grp.add(back); grp.userData.bmat = bm; }
  grp.position.set(x, o.y == null ? 0.035 : o.y, z); grp.rotation.y = o.rot || 0; scene.add(grp);
  grp.userData.mat = mat; grp.userData.y0 = grp.position.y; return grp;
}
/* 카드 뒤집기 — rz 로 반 바퀴. 뒤집힌 카드는 두께 H 만큼 올린다 */
const flipPose = (g, u, H, lift) => { g.rotation.z = -Math.PI * u; g.position.y = g.userData.y0 + H * u + (lift || 0.5) * Math.sin(Math.PI * u); };
/* 넓이 타일 — 색 판 + 윗면 식 */
function atile(k, txt, x, z, w, d, color, o){
  o = o || {};
  const { THREE, scene } = k;
  const h = o.h || 0.1, grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, 0.03), k.plastic(color, 0.45)); body.castShadow = body.receiveShadow = true; grp.add(body);
  const tex = mtex(k, P(txt), 512, Math.round(512 * d / w), { bg:color, color:o.ink || '#1f1a14', hmax:o.hmax || 0.45, fill:0.72 });
  const mat = new THREE.MeshStandardMaterial({ map:tex, roughness:0.5, emissive:new THREE.Color('#ffe2a8'), emissiveMap:tex, emissiveIntensity:0 });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, d * 0.9), mat);
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top); grp.userData.mat = mat;
  grp.position.set(x, o.y == null ? 0.03 : o.y, z); scene.add(grp); return grp;
}
/* 한지 위 좌표(월드 x,z) → 캔버스 좌표 */
const onPaper = (PW, PD, PX, PZ, w, h) => [x => (x - PX + PW / 2) / PW * w, z => (z - PZ + PD / 2) / PD * h];
/* 카드 한 줄 — 폭 목록을 가운데 정렬로 늘어놓은 x 좌표 */
const rowX = (ws, gap, cx) => { const tot = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1); let x = (cx || 0) - tot / 2; return ws.map(w => { const c = x + w / 2; x += w + gap; return c; }); };

export const SCENES_C38 = {

  /* 다항식의 곱셈 — hook: (2x+3)(4x+1). history: "네 부분을 빠짐없이 곱한다".
     stage ①: 2x×4x=8x², 2x×1=2x, 3×4x=12x, 3×1=3 → 8x²+14x+3 */
  'M-21': { seed:3821, caps:{ P:9, list:[
    [0.0, "$(2x+3)(4x+1)$: 네 부분을 빠짐없이 곱합니다.", "$(2x+3)(4x+1)$: multiply all four parts, missing none.", "$(2x+3)(4x+1)$：四个部分都要乘到，一个不漏。"],
    [0.1, "$2x\\times 4x=8x^2$, $2x\\times 1=2x$, $3\\times 4x=12x$, $3\\times 1=3$", "$2x\\times 4x=8x^2$, $2x\\times 1=2x$, $3\\times 4x=12x$, $3\\times 1=3$", "$2x\\times 4x=8x^2$，$2x\\times 1=2x$，$3\\times 4x=12x$，$3\\times 1=3$"],
    [0.5, "가운데 두 항을 더하면 $2x+12x=14x$입니다.", "Add the two middle terms: $2x+12x=14x$.", "把中间两项相加：$2x+12x=14x$。"],
    [0.72, "그래서 $(2x+3)(4x+1)=8x^2+14x+3$입니다.", "So $(2x+3)(4x+1)=8x^2+14x+3$.", "所以$(2x+3)(4x+1)=8x^2+14x+3$。"]
  ]},
    build(k){
    k.frame([0.1, 0.1, 0.3], 6.5, 64);
    k.table();
    const X0 = -2.45, Z0 = -0.85, CW = [1.6, 0.85], RD = [1.35, 0.85];
    const cx = [X0 + CW[0] / 2, X0 + CW[0] + CW[1] / 2], cz = [Z0 + RD[0] / 2, Z0 + RD[0] + RD[1] / 2];
    const PW = 3.5, PD = 3.4, PX = -1.5, PZ = 0.25;
    k.paper(PW, PD, PX, PZ, 0, (g, w, h, ink) => {
      const [fx, fz] = onPaper(PW, PD, PX, PZ, w, h), fs = h * 0.075;
      ink(g, '4x', fx(cx[0]), fz(Z0 - 0.22), fs); ink(g, '+1', fx(cx[1]), fz(Z0 - 0.22), fs);
      ink(g, '2x', fx(X0 - 0.3), fz(cz[0]), fs); ink(g, '+3', fx(X0 - 0.3), fz(cz[1]), fs);
      g.strokeStyle = 'rgba(28,20,14,.8)'; g.lineWidth = 5;
      const xs = [X0, X0 + CW[0], X0 + CW[0] + CW[1]], zs = [Z0, Z0 + RD[0], Z0 + RD[0] + RD[1]];
      xs.forEach(x => { g.beginPath(); g.moveTo(fx(x), fz(zs[0])); g.lineTo(fx(x), fz(zs[2])); g.stroke(); });
      zs.forEach(z => { g.beginPath(); g.moveTo(fx(xs[0]), fz(z)); g.lineTo(fx(xs[2]), fz(z)); g.stroke(); });
    });
    const BLUE = '#8fb3d9', GREEN = '#a9cf8f', YEL = '#f0cf6a', I = 0.14;
    const cells = [
      atile(k, '8x²', cx[0], cz[0], CW[0] - I, RD[0] - I, BLUE, { hmax:0.4 }),
      atile(k, '2x', cx[1], cz[0], CW[1] - I, RD[0] - I, GREEN, { hmax:0.3 }),
      atile(k, '12x', cx[0], cz[1], CW[0] - I, RD[1] - I, GREEN, { hmax:0.5 }),
      atile(k, '3', cx[1], cz[1], CW[1] - I, RD[1] - I, YEL, { hmax:0.5 })
    ];
    const RX = 1.65;
    mcard(k, '(2x + 3)(4x + 1)', RX, -0.85, { w:2.6, d:0.7, hmax:0.48 });
    const mid = mcard(k, '2x + 12x = 14x', RX, 0.2, { w:2.6, d:0.66, hmax:0.46, bg:'#dde9d2', edge:'#c9d6b5' });
    const res = mcard(k, '= 8x² + 14x + 3', RX, 1.25, { w:2.6, d:0.72, hmax:0.48, bg:'#f3e2b8' });
    /* 움직임: 네 칸이 차례로 들리며 빛나고(네 부분) → 2x·12x 가 함께 빛나며 14x → 결과가 빛난다 */
    const cy = cells.map(c => c.position.y), my = mid.position.y, ry = res.position.y;
    k.onFrame(t => { const p = cyc(t, 9), mg = hop(p, 0.5, 0.68);
      cells.forEach((c, i) => { const a = 0.1 + i * 0.09, hh = hop(p, a, a + 0.12);
        c.position.y = cy[i] + 0.25 * hh; c.userData.mat.emissiveIntensity = 0.6 * hh + (i === 1 || i === 2 ? 0.6 * mg : 0); });
      mid.position.y = my + 0.25 * mg; mid.userData.mat.emissiveIntensity = 0.7 * mg;
      res.position.y = ry + 0.3 * hop(p, 0.72, 0.92); res.userData.mat.emissiveIntensity = 0.8 * hop(p, 0.72, 0.92); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

  /* 곱셈공식의 확장 — hook: (x+2)³ 은? history: 계수가 1, 3, 3, 1. stage ①: (x+2)³ = x³+6x²+12x+8
     한 변 x+2 인 정육면체를 x³ 1개 · x·x·2 판 3개 · x·2·2 막대 3개 · 2³ 1개로 가른다 */
  'M-22': { seed:3822, caps:{ P:10, list:[
    [0.0, "$(x+2)^3$은 한 변이 $x+2$인 정육면체의 부피입니다.", "$(x+2)^3$ is the volume of a cube with edge $x+2$.", "$(x+2)^3$是棱长为$x+2$的正方体的体积。"],
    [0.12, "조각은 $x^3$ 하나, $2x^2$ 셋, $4x$ 셋, $8$ 하나입니다.", "The pieces: one $x^3$, three $2x^2$, three $4x$, one $8$.", "碎块是：一个$x^3$，三个$2x^2$，三个$4x$，一个$8$。"],
    [0.46, "그래서 $(x+2)^3=x^3+6x^2+12x+8$입니다.", "So $(x+2)^3=x^3+6x^2+12x+8$.", "所以$(x+2)^3=x^3+6x^2+12x+8$。"],
    [0.7, "조각의 개수 $1,\\,3,\\,3,\\,1$이 곧 계수의 패턴입니다.", "The piece counts $1,\\,3,\\,3,\\,1$ are the coefficient pattern.", "碎块个数$1,\\,3,\\,3,\\,1$正是系数的规律。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.05, 0.6, -0.15], 6.7, 40, -18);
    k.table();
    const L = 1.25, A = 0.5, E = 0.3, OX = -2.2, OZ = -1.35;
    const COL = ['#8fb3d9', '#a9cf8f', '#f0cf6a', '#e07a6a'];
    const pieces = [];
    for(let i = 0; i < 2; i++) for(let j = 0; j < 2; j++) for(let l = 0; l < 2; l++){
      const n = i + j + l, sx = i ? A : L, sy = j ? A : L, sz = l ? A : L;
      const mat = new THREE.MeshPhysicalMaterial({ color:COL[n], roughness:0.4, clearcoat:0.35, emissive:new THREE.Color(COL[n]), emissiveIntensity:0 });
      const m = new THREE.Mesh(k.rbox(sx - 0.02, sy - 0.02, sz - 0.02, 0.03), mat); m.castShadow = m.receiveShadow = true; scene.add(m);
      /* 2 쪽 조각은 왼쪽·아래·뒤에 — x³ 가 앞 위 오른쪽 모서리에 드러난다. 벌릴 때는 왼쪽·뒤로, 위층은 위로 */
      pieces.push({ m, n, dir:[-i, 1 - j, -l], c:[OX + (i ? 0 : A) + sx / 2, (j ? 0 : A) + 0.01, OZ + (l ? 0 : A) + sz / 2] });
    }
    const place = e => pieces.forEach(q => q.m.position.set(q.c[0] + e * q.dir[0], q.c[1] + e * q.dir[1], q.c[2] + e * q.dir[2]));
    place(E);
    /* 변 길이 x, 2 — 앞쪽 종이에 */
    const PW = 2.9, PD = 0.7, PX = OX + (L + A - E) / 2, PZ = OZ + L + A + 0.42;
    k.paper(PW, PD, PX, PZ, 0, (g, w, h, ink) => { const [fx] = onPaper(PW, PD, PX, PZ, w, h);
      ink(g, '2', fx(OX - E + A / 2), h * 0.45, h * 0.55); ink(g, 'x', fx(OX + A + L / 2), h * 0.45, h * 0.55); });
    /* 식 카드 */
    const top = mcard(k, '(x + 2)³', 1.7, -1.25, { w:1.6, d:0.66, hmax:0.52 });
    const xs = rowX([0.7, 0.8, 0.8, 0.55], 0.12, 1.7);
    const terms = ['x³', '6x²', '12x', '8'].map((s, i) => mcard(k, s, xs[i], -0.3, { w:[0.7, 0.8, 0.8, 0.55][i], d:0.6, hmax:0.52, edge:COL[i], bg:'#f6efe0' }));
    const pat = mcard(k, '1,  3,  3,  1', 1.7, 0.65, { w:2.2, d:0.6, hmax:0.5, bg:'#f3e2b8' });
    /* 움직임: 조각이 모여 한 정육면체가 되고 → 색별로(1 · 3 · 3 · 1) 빛나며 해당 항 카드가 들림 → 다시 벌어진다 */
    const ty = terms.map(c => c.position.y), py = pat.position.y, topY = top.position.y;
    k.onFrame(t => { const p = cyc(t, 10);
      place(E * (1 - seg(p, 0.1, 0.28) * (1 - seg(p, 0.82, 0.96))));
      top.position.y = topY + 0.2 * hop(p, 0.1, 0.28);
      const hs = [0, 1, 2, 3].map(n => { const a = 0.32 + n * 0.1; return hop(p, a, a + 0.12); });
      pieces.forEach(q => { q.m.material.emissiveIntensity = 0.35 * hs[q.n]; });
      terms.forEach((c, i) => { c.position.y = ty[i] + 0.22 * hs[i]; c.userData.mat.emissiveIntensity = 0.6 * hs[i]; });
      pat.position.y = py + 0.25 * hop(p, 0.7, 0.88); pat.userData.mat.emissiveIntensity = 0.8 * hop(p, 0.7, 0.88); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[-0.5, 0.5, -0.5], envOpts:{ intensity:0.6 } });
  }},

  /* 항등식과 미정계수법 — hook: 어떤 x 를 넣어도 성립하는 식. stage ①: ax+b = 5x−3 ⇒ a=5, b=−3 */
  'M-23': { seed:3823, caps:{ P:9, list:[
    [0.0, "$ax+b=5x-3$이 모든 $x$에서 성립하는 항등식입니다.", "$ax+b=5x-3$ is an identity: true for every $x$.", "$ax+b=5x-3$是对所有$x$都成立的恒等式。"],
    [0.14, "$x$의 계수끼리 같아야 하므로 $a=5$입니다.", "The $x$-coefficients must match, so $a=5$.", "$x$的系数必须相等，所以$a=5$。"],
    [0.4, "상수항끼리 같아야 하므로 $b=-3$입니다.", "The constant terms must match, so $b=-3$.", "常数项必须相等，所以$b=-3$。"],
    [0.68, "방정식을 풀지 않고 계수만 맞춰 읽었습니다 — 미정계수법입니다.", "No equation solving, just matching coefficients: undetermined coefficients.", "不用解方程，只是对照系数——这就是待定系数法。"]
  ]},
    build(k){
    k.frame([0.0, 0.1, 0.05], 6.0, 74);
    k.table();
    const WS = [0.72, 0.72, 0.95, 0.5, 0.72, 0.72, 0.95], xs = rowX(WS, 0.1, 0), Z = -0.75;
    const CO = (i, o) => Object.assign({ w:WS[i], d:0.78, hmax:0.56, h:0.04 }, o || {});
    const ca = mcard(k, 'a', xs[0], Z, CO(0, { back:'5', backOpts:{ bg:'#dde9d2' } }));
    mcard(k, 'x', xs[1], Z, CO(1));
    const cb = mcard(k, '+ b', xs[2], Z, CO(2, { back:'− 3', backOpts:{ bg:'#f6e8b8' } }));
    mcard(k, '=', xs[3], Z, CO(3, { bg:'#e9dcc0' }));
    const c5 = mcard(k, '5', xs[4], Z, CO(4, { bg:'#dde9d2' }));
    mcard(k, 'x', xs[5], Z, CO(5));
    const c3 = mcard(k, '− 3', xs[6], Z, CO(6, { bg:'#f6e8b8' }));
    /* 아래 종이 — 어떤 x 를 넣어도: x = 0, 1, 2, 3 → 5x − 3 = −3, 2, 7, 12 */
    const PW = 5.4, PD = 1.9, PZ = 0.85;
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => {
      const fs = h * 0.2, col = n => w * (0.36 + n * 0.16);
      ink(g, 'x', w * 0.14, h * 0.3, fs); ink(g, '5x − 3', w * 0.14, h * 0.72, fs);
      [0, 1, 2, 3].forEach(n => { ink(g, String(n), col(n), h * 0.3, fs); ink(g, String(5 * n - 3).replace('-', '−'), col(n), h * 0.72, fs); });
      g.strokeStyle = 'rgba(28,20,14,.75)'; g.lineWidth = 5;
      g.beginPath(); g.moveTo(w * 0.04, h * 0.51); g.lineTo(w * 0.96, h * 0.51); g.stroke();
      g.beginPath(); g.moveTo(w * 0.27, h * 0.1); g.lineTo(w * 0.27, h * 0.9); g.stroke();
    });
    /* 움직임: a 와 5 가 함께 빛나고 a 가 뒤집혀 5 → +b 와 −3 이 함께 빛나고 +b 가 뒤집혀 −3 → 되돌린다 */
    const y5 = c5.position.y, y3 = c3.position.y;
    k.onFrame(t => { const p = cyc(t, 9), back = 1 - seg(p, 0.84, 0.97);
      const g1 = hop(p, 0.14, 0.3), g2 = hop(p, 0.4, 0.56);
      c5.position.y = y5 + 0.25 * g1; c5.userData.mat.emissiveIntensity = 0.7 * g1;
      c3.position.y = y3 + 0.25 * g2; c3.userData.mat.emissiveIntensity = 0.7 * g2;
      ca.userData.mat.emissiveIntensity = 0.7 * g1; cb.userData.mat.emissiveIntensity = 0.7 * g2;
      flipPose(ca, seg(p, 0.24, 0.38) * back, 0.04, 0.5); flipPose(cb, seg(p, 0.5, 0.64) * back, 0.04, 0.5);
      const gl = 0.6 * hop(p, 0.68, 0.84); ca.userData.bmat.emissiveIntensity = gl; cb.userData.bmat.emissiveIntensity = gl; });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

  /* 나머지정리 — hook: P(x)=x²+3x−1 을 x−2 로 나눈 나머지. stage ①: P(2)=4+6−1=9(조립제법도 9).
     stage ②: P(x)=(x−2)×Q(x)+R 에 x=2 → (x−2)=0, P(2)=R */
  'M-24': { seed:3824, caps:{ P:10, list:[
    [0.0, "$P(x)=x^2+3x-1$을 $x-2$로 나눈 나머지를 구합니다.", "Find the remainder when $P(x)=x^2+3x-1$ is divided by $x-2$.", "求$P(x)=x^2+3x-1$除以$x-2$的余数。"],
    [0.12, "$P(x)=(x-2)\\times Q(x)+R$에 $x=2$를 넣습니다.", "Put $x=2$ into $P(x)=(x-2)\\times Q(x)+R$.", "把$x=2$代入$P(x)=(x-2)\\times Q(x)+R$。"],
    [0.36, "$x-2$가 $0$이 되어 몫 부분이 통째로 사라지고 $P(2)=R$만 남습니다.", "$x-2$ becomes $0$, the whole quotient part vanishes, and only $P(2)=R$ is left.", "$x-2$变成$0$，商的部分整个消失，只剩$P(2)=R$。"],
    [0.66, "$P(2)=4+6-1=9$ — 조립제법으로 나눠도 나머지는 $9$입니다.", "$P(2)=4+6-1=9$: synthetic division gives the same remainder $9$.", "$P(2)=4+6-1=9$——用综合除法算，余数也是$9$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.05, 0.1, 0.05], 6.1, 74);
    k.table();
    const WS = [1.0, 0.45, 1.2, 1.25, 0.9], xs = rowX(WS, 0.1, 0.05), Z = -1.1;
    const CO = (i, o) => Object.assign({ w:WS[i], d:0.72, hmax:0.46, h:0.04 }, o || {});
    const cP = mcard(k, 'P(x)', xs[0], Z, CO(0, { back:'P(2)', backOpts:{ bg:'#f3e2b8' } }));
    mcard(k, '=', xs[1], Z, CO(1, { bg:'#e9dcc0' }));
    const cX = mcard(k, '(x − 2)', xs[2], Z, CO(2, { back:'0', backOpts:{ bg:'#e3ddd2', hmax:0.56 } }));
    const cQ = mcard(k, '× Q(x)', xs[3], Z, CO(3, { back:'× Q(2)', backOpts:{ bg:'#e3ddd2' } }));
    const cR = mcard(k, '+ R', xs[4], Z, CO(4, { bg:'#dde9d2' }));
    /* 조립제법 종이 — 2 | 1 3 −1 → 1 5 | 9 */
    const PW = 3.1, PD = 2.1, PX = -1.35, PZ = 0.65;
    k.paper(PW, PD, PX, PZ, 0.02, (g, w, h, ink) => {
      const fs = h * 0.15, c = n => w * (0.36 + n * 0.2), r = [0.2, 0.46, 0.8].map(v => v * h);
      ink(g, '2', w * 0.14, r[0], fs);
      ['1', '3', '−1'].forEach((s, i) => ink(g, s, c(i), r[0], fs));
      ['2', '10'].forEach((s, i) => ink(g, s, c(i + 1), r[1], fs));
      ['1', '5'].forEach((s, i) => ink(g, s, c(i), r[2], fs));
      ink(g, '9', c(2), r[2], fs * 1.1, { color:'rgb(140,28,18)' });
      g.strokeStyle = 'rgba(28,20,14,.8)'; g.lineWidth = 6;
      g.beginPath(); g.moveTo(w * 0.24, h * 0.06); g.lineTo(w * 0.24, h * 0.62); g.stroke();
      g.beginPath(); g.moveTo(w * 0.24, h * 0.62); g.lineTo(w * 0.94, h * 0.62); g.stroke();
      g.strokeStyle = 'rgba(140,28,18,.8)'; g.beginPath(); g.moveTo(c(2) - w * 0.09, h * 0.66); g.lineTo(c(2) - w * 0.09, h * 0.94); g.stroke();
    });
    const res = mcard(k, 'P(2) = 4 + 6 − 1 = 9', 1.55, 0.35, { w:2.5, d:0.66, hmax:0.46, bg:'#f3e2b8' });
    /* x = 2 를 새긴 황동 동전 */
    const coin = new THREE.Group();
    const cm = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.07, 48), k.metal('#c9a45c', 0.3)); cm.castShadow = cm.receiveShadow = true; coin.add(cm);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.29, 48), new THREE.MeshStandardMaterial({ map:mtex(k, P('x = 2'), 256, 256, { bg:'#e8cf8c', hmax:0.36 }), roughness:0.45, metalness:0.3 }));
    face.rotation.x = -Math.PI / 2; face.position.y = 0.037; coin.add(face);
    coin.position.set(1.55, 0.04, 1.35); scene.add(coin);
    /* 움직임: 동전(x=2)이 뛰어오르고 P(x)·(x−2)·Q(x) 가 뒤집혀 P(2)·0·Q(2) → 0 과 Q(2) 가 물러나며 R 이 빛남 → P(2)=9 가 빛남 → 되돌린다 */
    const cy0 = coin.position.y, zX = cX.position.z, zQ = cQ.position.z, yR = cR.position.y, yRes = res.position.y;
    k.onFrame(t => { const p = cyc(t, 10), back = 1 - seg(p, 0.86, 0.97);
      coin.position.y = cy0 + 0.6 * hop(p, 0.1, 0.24); coin.rotation.x = 2 * Math.PI * seg(p, 0.1, 0.24);
      flipPose(cP, seg(p, 0.2, 0.3) * back, 0.04, 0.4); flipPose(cX, seg(p, 0.24, 0.34) * back, 0.04, 0.4); flipPose(cQ, seg(p, 0.28, 0.38) * back, 0.04, 0.4);
      const s = seg(p, 0.38, 0.48) * back; cX.position.z = zX - 0.45 * s; cQ.position.z = zQ - 0.45 * s;
      const gr = hop(p, 0.44, 0.62); cR.position.y = yR + 0.25 * gr; cR.userData.mat.emissiveIntensity = 0.7 * gr;
      const g2 = hop(p, 0.66, 0.86); res.position.y = yRes + 0.3 * g2; res.userData.mat.emissiveIntensity = 0.8 * g2; });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

  /* 인수분해 심화 — stage ①: 27=3³, x³+27=(x+3)(x²−3x+9). stage ②: x⁴+5x²+6, t=x² → t²+5t+6=(t+2)(t+3) → (x²+2)(x²+3) */
  'M-25': { seed:3825, caps:{ P:10, list:[
    [0.0, "$27=3^3$이므로 $x^3+27=x^3+3^3$입니다.", "$27=3^3$, so $x^3+27=x^3+3^3$.", "$27=3^3$，所以$x^3+27=x^3+3^3$。"],
    [0.2, "곱셈공식을 거꾸로 읽으면 $(x+3)(x^2-3x+9)$입니다.", "Read the formula backward: $(x+3)(x^2-3x+9)$.", "把乘法公式反着读：$(x+3)(x^2-3x+9)$。"],
    [0.42, "$x^4+5x^2+6$은 $x^2$을 $t$로 바꾸면 $t^2+5t+6=(t+2)(t+3)$입니다.", "Swap $x^2$ for $t$ in $x^4+5x^2+6$: $t^2+5t+6=(t+2)(t+3)$.", "把$x^4+5x^2+6$里的$x^2$换成$t$：$t^2+5t+6=(t+2)(t+3)$。"],
    [0.7, "$t=x^2$을 되돌리면 $(x^2+2)(x^2+3)$ — 이미 아는 모양으로 바꾸었습니다.", "Put $t=x^2$ back: $(x^2+2)(x^2+3)$. We turned it into a shape we know.", "把$t=x^2$代回去：$(x^2+2)(x^2+3)$——变成了已知的形状。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.35, 0.25, -0.1], 6.4, 64);
    k.table();
    /* 27 = 3×3×3 나무 블록 */
    const S = 0.36, CX = -2.2, CZ = -0.55, wood = k.woodMat('#d9b27c'), geo = k.rbox(S - 0.015, S - 0.015, S - 0.015, 0.035);
    const layers = [0, 1, 2].map(y => { const g = new THREE.Group();
      for(let i = 0; i < 3; i++) for(let j = 0; j < 3; j++){ const m = new THREE.Mesh(geo, wood); m.position.set((i - 1) * S, 0, (j - 1) * S); m.castShadow = m.receiveShadow = true; g.add(m); }
      g.position.set(CX, y * S, CZ); scene.add(g); return g; });
    const c27 = mcard(k, '27 = 3³', CX, 0.55, { w:1.4, d:0.6, hmax:0.52, bg:'#f3e2b8' });
    /* 오른쪽 식 카드 */
    const a1 = mcard(k, 'x³ + 27', -0.3, -1.05, { w:1.35, d:0.66, hmax:0.48 });
    const r1 = mcard(k, '= (x + 3)(x² − 3x + 9)', 1.95, -1.05, { w:3.0, d:0.66, hmax:0.46, fill:0.93, bg:'#dde9d2', edge:'#c9d6b5' });
    const a2 = mcard(k, 'x⁴ + 5x² + 6', 0.05, 0.1, { w:2.0, d:0.66, hmax:0.46, back:'t² + 5t + 6', backOpts:{ bg:'#e3eed8' } });
    const tc = mcard(k, 't = x²', 1.7, 0.1, { w:1.1, d:0.56, hmax:0.5, bg:'#f6e8b8' });
    const r2 = mcard(k, '= (x² + 2)(x² + 3)', 1.15, 1.15, { w:2.8, d:0.66, hmax:0.46, bg:'#dde9d2', edge:'#c9d6b5' });
    /* 움직임: 3층이 한 층씩 들리며(3×3×3) 27=3³ → x³+27 의 인수분해가 빛남 → t=x² 가 들리며 x⁴+5x²+6 이 뒤집혀 t²+5t+6 → 결과가 빛남 → 되돌린다 */
    const ly = layers.map(g => g.position.y), yc = c27.position.y, ya1 = a1.position.y, yr1 = r1.position.y, yt = tc.position.y, yr2 = r2.position.y;
    k.onFrame(t => { const p = cyc(t, 10);
      const hs = [0, 1, 2].map(n => { const a = 0.03 + (2 - n) * 0.05; return hop(p, a, a + 0.08); });
      layers.forEach((g, m) => { let off = 0; for(let n = 0; n <= m; n++) off += 0.18 * hs[n]; g.position.y = ly[m] + off; });
      const gc = hop(p, 0.14, 0.26); c27.position.y = yc + 0.2 * gc; c27.userData.mat.emissiveIntensity = 0.7 * gc;
      const g1 = hop(p, 0.2, 0.38); a1.position.y = ya1 + 0.15 * g1; r1.position.y = yr1 + 0.25 * g1; r1.userData.mat.emissiveIntensity = 0.7 * g1;
      const gt = hop(p, 0.42, 0.56); tc.position.y = yt + 0.25 * gt; tc.userData.mat.emissiveIntensity = 0.7 * gt;
      flipPose(a2, seg(p, 0.46, 0.58) * (1 - seg(p, 0.86, 0.97)), 0.04, 0.45);
      const g2 = hop(p, 0.7, 0.88); r2.position.y = yr2 + 0.3 * g2; r2.userData.mat.emissiveIntensity = 0.8 * g2; });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},
};
