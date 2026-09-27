/* C42 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만 — scenes-c40 과 같은 모양에 첨자·근호 지수·Σ 를 더함) ───────────── */

/* 글자 한 조각 — log·sin·cos·tan 은 바로 선 글자, 나머지 라틴 문자는 수학 이탤릭 */
function gtext(k, g, s, x, y, fs, draw){
  let cx = x;
  String(s).split(/(log|sin|cos|tan)/).filter(r => r !== '').forEach(r => {
    cx += k.mathText(g, r, cx, y, fs, { align:'left', draw, upright:/^(log|sin|cos|tan)$/.test(r) });
  });
  return cx - x;
}
/* 수식 조각 — 문자열 | {sup: 조각들}(윗첨자, 분수 지수도) | {sub}(아래첨자) | {r, idx}(근호, 지수 선택)
   | {n, d}(분수) | {sig, top, bot}(Σ) | {c: 색, t: 조각들}(색 입힌 묶음) */
function mdraw(k, g, parts, x, cy, fs, draw){
  if(typeof parts === 'string') parts = [parts];
  let cx = x;
  parts.forEach(p => {
    if(typeof p === 'string'){
      /* 도(°) — 글꼴의 ° 는 자리가 어긋나서 작은 원으로 그린다 */
      p.split(/(°)/).filter(r => r !== '').forEach(r => { if(r === '°'){ if(draw !== false){ g.save(); g.lineWidth = fs * 0.055; g.beginPath(); g.arc(cx + fs * 0.13, cy - fs * 0.3, fs * 0.08, 0, Math.PI * 2); g.stroke(); g.restore(); } cx += fs * 0.26; }
        else cx += gtext(k, g, r, cx, cy, fs, draw); });
      return; }
    if(p.c){ const old = g.fillStyle, olds = g.strokeStyle; if(draw !== false){ g.fillStyle = g.strokeStyle = p.c; }
      cx += mdraw(k, g, p.t, cx, cy, fs, draw); if(draw !== false){ g.fillStyle = old; g.strokeStyle = olds; } return; }
    if(p.sup != null){ const sp = typeof p.sup === 'string' ? [p.sup] : p.sup, fr = sp.some(q => q && q.n);
      const s = fs * (fr ? 0.66 : 0.62), dy = fs * (fr ? 0.74 : 0.34);
      cx += mdraw(k, g, sp, cx + fs * 0.02, cy - dy, s, draw) + fs * 0.04; return; }
    if(p.sub != null){ cx += mdraw(k, g, p.sub, cx + fs * 0.02, cy + fs * 0.3, fs * 0.6, draw) + fs * 0.04; return; }
    if(p.sig){
      const s = fs * 0.5, wt = mdraw(k, g, p.top || '', 0, 0, s, false), wb = mdraw(k, g, p.bot || '', 0, 0, s, false);
      g.font = `400 ${fs * 1.45}px ${k.MAIN}`; const ws = g.measureText('Σ').width, W = Math.max(ws, wt, wb);
      if(draw !== false){
        const ta = g.textAlign; g.textAlign = 'center'; g.font = `400 ${fs * 1.45}px ${k.MAIN}`; g.fillText('Σ', cx + W / 2, cy + fs * 0.02); g.textAlign = ta;
        mdraw(k, g, p.top || '', cx + (W - wt) / 2, cy - fs * 0.98, s, true);
        mdraw(k, g, p.bot || '', cx + (W - wb) / 2, cy + fs * 1.0, s, true);
      }
      cx += W + fs * 0.12; return;
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
/* 세운 판(라벨) — 상자 앞면에 붙인다. 면에서 0.03 이상 띄울 것 */
function mplate(k, parts, w, h, o){
  o = o || {};
  const tex = mtex(k, typeof parts === 'string' ? [parts] : parts, 1024, Math.round(1024 * h / w), Object.assign({ hmax:0.56, fill:0.8 }, o));
  const mat = new k.THREE.MeshStandardMaterial({ map:tex, roughness:0.7 });
  if(o.glow){ mat.emissive = new k.THREE.Color('#ffd89a'); mat.emissiveMap = tex; mat.emissiveIntensity = 0; }
  const m = new k.THREE.Mesh(new k.THREE.PlaneGeometry(w, h), mat); m.receiveShadow = true; k.scene.add(m); return m;
}
/* 말(폰) — 옻칠 몸통 + 둥근 머리 */
function pawn(k, color){
  const { THREE } = k; const g = new THREE.Group(), mat = k.lacquer(color);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.06, 32), mat); base.position.y = 0.03;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.11, 0.26, 32), mat); body.position.y = 0.19;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 16), mat); head.position.y = 0.36;
  [base, body, head].forEach(m => { m.castShadow = m.receiveShadow = true; g.add(m); });
  k.scene.add(g); return g;
}
/* 삼각형 판 — pts(단위 좌표)를 u 배로. 윗면에 draw(g, X, Y, ppu) 로 글자·각 표시(판의 xy = 단위 좌표).
   ExtrudeGeometry 의 윗면 UV 는 모양 좌표 그대로라 텍스처를 모양 범위에 맞춘다. 판은 책상 위(xz)에 눕는다: 모양 y → −z */
function triPlate(k, pts, u, o){
  const { THREE, scene } = k;
  const sh = new THREE.Shape(); pts.forEach(([x, y], i) => i ? sh.lineTo(x * u, y * u) : sh.moveTo(x * u, y * u)); sh.closePath();
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), sw = (x1 - x0) * u, shh = (y1 - y0) * u;
  const ppu = 1400 / Math.max(x1 - x0, y1 - y0);
  const tex = k.canvasTex(Math.round((x1 - x0) * ppu), Math.round((y1 - y0) * ppu), (g, w, h) => {
    g.fillStyle = o.bg || '#ecd9b2'; g.fillRect(0, 0, w, h);
    for(let i = 0; i < 60; i++){ g.strokeStyle = `rgba(120,80,40,${0.04 + k.rnd() * 0.08})`; g.lineWidth = 1 + k.rnd() * 3; g.beginPath(); const yy = k.rnd() * h; g.moveTo(0, yy); for(let x = 0; x <= w; x += 32) g.lineTo(x, yy + Math.sin(x / 90 + i) * 5); g.stroke(); }
    g.fillStyle = g.strokeStyle = '#2b2118'; g.textBaseline = 'middle';
    if(o.draw) o.draw(g, x => (x - x0) * ppu, y => (y1 - y) * ppu, ppu);
  });
  tex.repeat.set(1 / sw, 1 / shh); tex.offset.set(-x0 * u / sw, -y0 * u / shh);
  const bev = 0.012, th = o.h || 0.07;
  const geo = new THREE.ExtrudeGeometry(sh, { depth:th - bev * 2, bevelEnabled:true, bevelThickness:bev, bevelSize:bev, bevelSegments:2 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, bev, 0);
  const top = new THREE.MeshStandardMaterial({ map:tex, roughness:0.6 });
  if(o.glow){ top.emissive = new THREE.Color('#ffd89a'); top.emissiveMap = tex; top.emissiveIntensity = 0; }
  const m = new THREE.Mesh(geo, [top, k.woodMat(o.side || '#c89a62')]); m.castShadow = m.receiveShadow = true;
  const g = new THREE.Group(); g.add(m); scene.add(g); g.userData.mat = top; return g;
}
/* 판 위 각 표시(호) — 꼭짓점 (vx, vy)에서 a0→a1(라디안, 단위 좌표계 반시계) 반지름 r */
function arcMark(g, X, Y, ppu, vx, vy, a0, a1, r){
  g.save(); g.lineWidth = ppu * 0.018; g.beginPath(); g.arc(X(vx), Y(vy), r * ppu, -a1, -a0); g.stroke(); g.restore();
}
/* 나무 그릇 + 곡식 더미(높이 hh) */
function grainBowl(k, x, z, hh, grainTex){
  const { THREE, scene } = k;
  const pts = [[0, 0], [0.24, 0], [0.3, 0.03], [0.4, 0.14], [0.44, 0.24], [0.42, 0.25], [0.37, 0.16], [0.26, 0.07], [0, 0.07]].map(([a, b]) => new THREE.Vector2(a, b));
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), k.woodMat('#9a6436', [60, 30, 12]));
  bowl.castShadow = bowl.receiveShadow = true; bowl.position.set(x, 0, z); scene.add(bowl);
  const prof = [[0, 1], [0.06, 0.985], [0.14, 0.9], [0.26, 0.6], [0.34, 0.3], [0.39, 0.06], [0.395, 0]].reverse().map(([a, b]) => new THREE.Vector2(a, b * hh));
  const mound = new THREE.Mesh(new THREE.LatheGeometry(prof, 56), new THREE.MeshStandardMaterial({ map:grainTex, roughness:0.9, bumpMap:grainTex, bumpScale:1.0 }));
  mound.position.set(x, 0.12, z); mound.castShadow = mound.receiveShadow = true; scene.add(mound);
  return mound;
}
const RUST = '#9a3d12', BLUE = '#2f5f8f', GREEN = '#dcebd9', GEDGE = '#c9d6b5';

export const SCENES_C42 = {

  /* 거듭제곱근과 유리수 지수 — hook: 2 의 1/2 제곱은 왜 √2? stage ①: ∛(2²) = 2^(2/3) (근호 지수 → 분모, 거듭제곱 → 분자),
     stage ②: ⁶√(2⁴) = 2^(4/6) = 2^(2/3). history: 손으로 하던 큰 수 계산 — 종이 위 계산으로 */
  'M-36': { seed:436, caps:{ P:9, list:[
    [0.0, "$\\sqrt[3]{2^2}$에서 근호의 $3$은 분모로, 거듭제곱의 $2$는 분자로 옮겨 갑니다.", "In $\\sqrt[3]{2^2}$, the root's $3$ moves to the denominator and the power's $2$ to the numerator.", "在$\\sqrt[3]{2^2}$中，根指数$3$移到分母，幂指数$2$移到分子。"],
    [0.42, "그래서 $\\sqrt[3]{2^2}$은 밑이 $2$, 지수가 $\\dfrac{2}{3}$인 거듭제곱입니다.", "So $\\sqrt[3]{2^2}$ is the power with base $2$ and exponent $\\dfrac{2}{3}$.", "所以$\\sqrt[3]{2^2}$是底数为$2$、指数为$\\dfrac{2}{3}$的幂。"],
    [0.56, "$\\sqrt[6]{2^4}$의 지수 $\\dfrac{4}{6}$도 약분하면 $\\dfrac{2}{3}$ — 같은 수입니다.", "The exponent $\\dfrac{4}{6}$ of $\\sqrt[6]{2^4}$ reduces to $\\dfrac{2}{3}$: the same number.", "$\\sqrt[6]{2^4}$的指数$\\dfrac{4}{6}$约分后是$\\dfrac{2}{3}$——同一个数。"],
    [0.76, "같은 약속으로 $2$의 지수가 $\\dfrac{1}{2}$이면 $\\sqrt{2}$입니다.", "By the same rule, $2$ with exponent $\\dfrac{1}{2}$ is $\\sqrt{2}$.", "按同样的约定，$2$的指数为$\\dfrac{1}{2}$时就是$\\sqrt{2}$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.05, 0.0, -0.05], 5.2, 64);
    k.table();
    /* 왼쪽: 근호 카드 ∛(2²) — 근호 지수 3 과 거듭제곱 2 에 색 */
    const cA = mcard(k, [{ r:['2', { sup:[{ c:BLUE, t:'2' }] }], idx:[{ c:RUST, t:'3' }] }], -1.55, -0.45, { w:1.7, d:1.2, hmax:0.46, glow:true });
    mcard(k, '=', -0.3, -0.45, { w:0.5, d:0.5, hmax:0.6 });
    /* 오른쪽: 나무 블록으로 쌓은 2^(2/3) — 밑 2, 분자 2(파랑), 가로줄, 분모 3(주황) */
    k.tile('2', 0.62, -0.25, { w:0.95, d:0.95, h:0.3, size:330 });
    const num = k.tile('2', 1.5, -1.2, { w:0.44, d:0.44, h:0.18, size:300, color:BLUE, wood:'#e0bf8c' });
    const den = k.tile('3', 1.5, -0.36, { w:0.44, d:0.44, h:0.18, size:300, color:RUST, wood:'#e0bf8c' });
    const bar = new THREE.Mesh(k.rbox(0.56, 0.06, 0.08, 0.02), k.lacquer('#2b1a12')); bar.position.set(1.5, 0, -0.78); bar.castShadow = true; scene.add(bar);
    /* 앞줄: 약분 카드와 hook 카드 */
    const cB = mcard(k, [{ r:['2', { sup:'4' }], idx:'6' }, ' = 2', { sup:[{ n:'4', d:'6' }] }, ' = 2', { sup:[{ n:'2', d:'3' }] }], -0.85, 0.85, { w:3.0, d:0.9, hmax:0.4, dy:0.1, glow:true });
    const cC = mcard(k, ['2', { sup:[{ n:'1', d:'2' }] }, ' = ', { r:'2' }], 1.65, 0.85, { w:1.6, d:0.9, hmax:0.4, dy:0.1, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: 분모 3 이 근호 지수 자리로 날아갔다 돌아오고, 이어 분자 2 가 거듭제곱 자리로 갔다 돌아온다 → 약분 카드 → hook 카드 */
    const N0 = num.position.clone(), D0 = den.position.clone();
    const IDX = new THREE.Vector3(-2.02, 0.5, -0.62), EXP = new THREE.Vector3(-1.2, 0.5, -0.78);
    const fly = (m, P0, T, p, a, b) => { const u = seg(p, a, a + (b - a) * 0.4) * (1 - seg(p, a + (b - a) * 0.6, b));
      m.position.lerpVectors(P0, T, u); m.position.y = P0.y + 0.5 * Math.sin(Math.PI * Math.min(1, u * 1.0)) * 0.6 + (T.y - P0.y) * u; };
    k.onFrame(t => { const p = cyc(t, 9);
      fly(den, D0, IDX, p, 0.04, 0.24); fly(num, N0, EXP, p, 0.22, 0.42);
      cA.userData.mat.emissiveIntensity = 0.35 * (hop(p, 0.08, 0.2) + hop(p, 0.26, 0.38));
      bar.position.y = 0.06 * hop(p, 0.42, 0.52);
      pop(cB, p, 0.56, 0.74); pop(cC, p, 0.76, 0.94); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.2], envOpts:{ intensity:0.7 } });
  }},

  /* 로그의 정의 — hook: 2×2×2=8, "2를 몇 번 곱해야 8?" 지수 사다리를 거꾸로 오르는 이름표 log.
     stage ①: 2¹=2, 2²=4, 2³=8 ⇔ log₂8=3. stage ②: 5×5×5=125 → log₅125=3(밑 5 · 진수 125 · 값 3) */
  'M-37': { seed:437, caps:{ P:10, list:[
    [0.0, "지수 사다리를 한 칸씩 오르면 $2^1=2$, $2^2=4$, $2^3=8$입니다.", "Climb the exponent ladder one rung at a time: $2^1=2$, $2^2=4$, $2^3=8$.", "沿着指数梯子一级一级往上爬：$2^1=2$，$2^2=4$，$2^3=8$。"],
    [0.36, "$2$를 $3$번 곱하면 $8$입니다: $2\\times2\\times2=8$", "Multiply $2$ three times to get $8$: $2\\times2\\times2=8$", "$2$连乘$3$次得$8$：$2\\times2\\times2=8$"],
    [0.5, "사다리를 거꾸로 읽으면 $2^3=8 \\Longleftrightarrow \\log_2 8=3$입니다.", "Read the ladder backwards: $2^3=8 \\Longleftrightarrow \\log_2 8=3$.", "把梯子倒过来读：$2^3=8 \\Longleftrightarrow \\log_2 8=3$。"],
    [0.8, "$5\\times5\\times5=125$이므로 $\\log_5 125=3$ — 밑 $5$, 진수 $125$, 값 $3$입니다.", "$5\\times5\\times5=125$, so $\\log_5 125=3$: base $5$, argument $125$, value $3$.", "$5\\times5\\times5=125$，所以$\\log_5 125=3$——底数$5$，真数$125$，值$3$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.1, 0.3, -0.25], 5.6, 48);
    k.table();
    /* 지수 사다리 — 계단 블록 셋: 윗면 2·4·8, 앞면 2¹·2²·2³ */
    const SX = [-2.1, -1.3, -0.5], SH = [0.42, 0.84, 1.26], SZ = -0.6, SD = 1.0, SW = 0.8;
    const fronts = [];
    SX.forEach((x, i) => {
      k.tile(String([2, 4, 8][i]), x, SZ, { w:SW, d:SD, h:SH[i], size:300, rad:0.03, wood:'#d6ad74' });
      const f = mplate(k, ['2', { sup:String(i + 1) }], SW * 0.8, 0.36, { hmax:0.62, glow:true, bg:'#f3e7cf' });
      f.position.set(x, SH[i] / 2, SZ + SD / 2 + 0.035); fronts.push(f);
    });
    /* 오르는 말 — 사다리 앞 바닥에서 출발 */
    const pw = pawn(k, '#8e1c16');
    const spots = [new THREE.Vector3(-2.75, 0, 0.1)].concat(SX.map((x, i) => new THREE.Vector3(x, SH[i] + 0.01, SZ + 0.28)));
    pw.position.copy(spots[0]);
    /* 식 카드 */
    const X = 1.45;
    const c1 = mcard(k, '2 × 2 × 2 = 8', X, -1.35, { w:2.4, d:0.6, glow:true, hmax:0.56 });
    const c2 = mcard(k, ['2', { sup:'3' }, ' = 8  ⇔  log', { sub:'2' }, ' 8 = 3'], X, -0.6, { w:2.6, d:0.66, glow:true, hmax:0.56, fill:0.9 });
    const c3 = mcard(k, [{ c:BLUE, t:'5' }, ' × ', { c:BLUE, t:'5' }, ' × ', { c:BLUE, t:'5' }, ' = ', { c:RUST, t:'125' }], X, 0.17, { w:2.4, d:0.6, glow:true, hmax:0.56 });
    const c4 = mcard(k, ['log', { sub:[{ c:BLUE, t:'5' }] }, ' ', { c:RUST, t:'125' }, ' = ', { c:'#2f6b2f', t:'3' }], X, 0.95, { w:2.2, d:0.66, glow:true, bg:GREEN, edge:GEDGE, hmax:0.5 });
    /* 움직임: 말이 2 → 4 → 8 로 한 칸씩 오르고(2×2×2=8), 거꾸로 세며 내려온다(log₂8=3), 끝에 log₅125=3 */
    const jump = (a, b, u) => { const v = new THREE.Vector3().lerpVectors(a, b, ease(u)); v.y += 0.45 * Math.sin(Math.PI * u); return v; };
    const up = [0.05, 0.14, 0.23], dn = [0.52, 0.61, 0.7];
    k.onFrame(t => { const p = cyc(t, 10);
      let at = spots[0];
      for(let i = 0; i < 3; i++){ if(p >= up[i]) at = spots[i + 1]; }
      for(let i = 0; i < 3; i++){ if(p >= dn[i]) at = spots[2 - i]; }
      pw.position.copy(at);
      for(let i = 0; i < 3; i++){ const u = (p - up[i]) / 0.08; if(u > 0 && u < 1) pw.position.copy(jump(spots[i], spots[i + 1], u)); }
      for(let i = 0; i < 3; i++){ const u = (p - dn[i]) / 0.08; if(u > 0 && u < 1) pw.position.copy(jump(spots[3 - i], spots[2 - i], u)); }
      fronts.forEach((f, i) => { f.material.emissiveIntensity = 0.5 * (hop(p, up[i] + 0.06, up[i] + 0.16) + hop(p, dn[2 - i] - 0.02, dn[2 - i] + 0.08)); });
      pop(c1, p, 0.34, 0.48); pop(c2, p, 0.5, 0.78); pop(c3, p, 0.8, 0.92); pop(c4, p, 0.84, 0.98); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.2], envOpts:{ intensity:0.7 } });
  }},

  /* 로그의 성질 — hook: 곱셈을 덧셈으로. history: 네이피어의 로그표. stage ①: log₂4 + log₂8 = log₂32 (2+3=5, 2⁵=32).
     stage ②: 32÷4=8 → log₂32 − log₂4 = log₂8 (5−2=3) */
  'M-38': { seed:438, caps:{ P:10, list:[
    [0.0, "로그표에서 $\\log_2 4=2$, $\\log_2 8=3$을 읽습니다.", "From the log table: $\\log_2 4=2$ and $\\log_2 8=3$.", "从对数表读出：$\\log_2 4=2$，$\\log_2 8=3$。"],
    [0.1, "$2$를 $2$번, $3$번 곱한 것을 이으면 $2+3=5$번입니다.", "Two factors of $2$ and three more make $2+3=5$.", "乘$2$次的$2$和乘$3$次的$2$接起来，共$2+3=5$次。"],
    [0.32, "그래서 $\\log_2 4+\\log_2 8=\\log_2 32$ — 진수끼리는 $4\\times8=32$로 곱해집니다.", "So $\\log_2 4+\\log_2 8=\\log_2 32$: the arguments multiply, $4\\times8=32$.", "所以$\\log_2 4+\\log_2 8=\\log_2 32$——真数相乘：$4\\times8=32$。"],
    [0.6, "덜어 내면 나눗셈입니다: $\\log_2 32-\\log_2 4=\\log_2 8$, $5-2=3$", "Taking away is division: $\\log_2 32-\\log_2 4=\\log_2 8$, $5-2=3$", "减去就是除法：$\\log_2 32-\\log_2 4=\\log_2 8$，$5-2=3$"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.12, 0.1, -0.35], 5.9, 62);
    k.table();
    /* 로그표(한지) — 윗줄 N, 아랫줄 log₂N */
    const PW = 2.9, PD = 1.15;
    k.paper(PW, PD, -1.5, -1.35, 0.0, (g, w, h) => {
      g.fillStyle = g.strokeStyle = 'rgb(28,20,14)'; g.textBaseline = 'middle';
      const cols = [0.17, 0.42, 0.54, 0.66, 0.78, 0.9], r1 = h * 0.3, r2 = h * 0.72, fs = h * 0.2;
      g.lineWidth = 4; g.beginPath(); g.moveTo(w * 0.04, h * 0.51); g.lineTo(w * 0.97, h * 0.51); g.moveTo(w * 0.34, h * 0.1); g.lineTo(w * 0.34, h * 0.92); g.stroke();
      mdraw(k, g, ['N'], w * 0.17 - mdraw(k, g, ['N'], 0, 0, fs, false) / 2, r1, fs, true);
      const lw = mdraw(k, g, ['log', { sub:'2' }, ' N'], 0, 0, fs * 0.9, false); mdraw(k, g, ['log', { sub:'2' }, ' N'], w * 0.17 - lw / 2, r2, fs * 0.9, true);
      [2, 4, 8, 16, 32].forEach((n, i) => { const x = w * cols[i + 1]; const hl = n === 4 || n === 8 || n === 32;
        g.fillStyle = hl ? '#8a2a10' : 'rgb(28,20,14)';
        k.mathText(g, String(n), x, r1, fs); k.mathText(g, String(i + 1), x, r2, fs); });
    });
    /* 정육면체 쌓기 — 2 를 곱한 횟수만큼: 파랑 2 개(log₂4 = 2), 주황 3 개(log₂8 = 3) */
    const S = 0.36, AX = -2.0, BX = -0.95, CZ = 0.2;
    const cube = (mat, x, y) => { const m = new THREE.Mesh(k.rbox(S, S, S, 0.04), mat); m.castShadow = m.receiveShadow = true; m.position.set(x, y, CZ); scene.add(m); return m; };
    const blue = k.lacquer('#2f5f8f'), rust = k.lacquer('#9a3d12');
    for(let i = 0; i < 2; i++) cube(blue, AX, i * S);
    const B = new THREE.Group(); scene.add(B);
    for(let i = 0; i < 3; i++){ const m = cube(rust, 0, i * S); B.add(m); }
    B.position.set(BX, 0, 0);
    const lA = mcard(k, ['log', { sub:'2' }, ' 4 = 2'], AX, 0.85, { w:0.96, d:0.4, hmax:0.52 });
    const lB = mcard(k, ['log', { sub:'2' }, ' 8 = 3'], BX, 0.85, { w:0.96, d:0.4, hmax:0.52 });
    /* 식 카드 */
    const X = 1.55;
    const c1 = mcard(k, ['log', { sub:'2' }, ' 4 + log', { sub:'2' }, ' 8 = log', { sub:'2' }, ' 32'], X, -1.45, { w:2.9, d:0.62, glow:true, hmax:0.5 });
    const c2 = mcard(k, '4 × 8 = 32,   2 + 3 = 5', X, -0.72, { w:2.9, d:0.56, glow:true, hmax:0.5 });
    const c3 = mcard(k, ['log', { sub:'2' }, ' 32 − log', { sub:'2' }, ' 4 = log', { sub:'2' }, ' 8'], X, 0.02, { w:2.9, d:0.62, glow:true, hmax:0.5, bg:GREEN, edge:GEDGE });
    const c4 = mcard(k, '32 ÷ 4 = 8,   5 − 2 = 3', X, 0.76, { w:2.9, d:0.56, glow:true, hmax:0.5, bg:GREEN, edge:GEDGE });
    /* 움직임: 주황 3 개가 파랑 2 개 위로 올라가 5 층(log₂32 = 5) → 덧셈 카드 → 다시 내려와 제자리(5 − 2 = 3) → 뺄셈 카드 */
    const B0 = B.position.clone(), BT = new THREE.Vector3(AX - BX + BX, 2 * S, 0);
    BT.x = AX; 
    k.onFrame(t => { const p = cyc(t, 10);
      const u = seg(p, 0.1, 0.28) * (1 - seg(p, 0.6, 0.78));
      B.position.lerpVectors(B0, BT, u); B.position.y += 0.55 * (hop(p, 0.1, 0.28) + hop(p, 0.6, 0.78));
      pop(c1, p, 0.32, 0.5); pop(c2, p, 0.36, 0.56); pop(c3, p, 0.72, 0.9); pop(c4, p, 0.76, 0.96);
      lA.position.y = lA.userData.y0 + 0.08 * hop(p, 0.02, 0.1); lB.position.y = lB.userData.y0 + 0.08 * hop(p, 0.03, 0.11); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[-0.5, 7, 2], spotAt:[-0.3, 0, 0], envOpts:{ intensity:0.7 } });
  }},

  /* 삼각함수의 값(특수각) — stage ①: 한 변이 2 인 정삼각형을 반으로 자르면 빗변 2 · 높이 √3 · 밑변 1 → sin30° = 1/2, sin60° = √3/2.
     stage ②: 두 변이 1 인 직각이등변삼각형의 빗변 √2 → sin45° = √2/2, tan60° = √3 */
  'M-39': { seed:439, caps:{ P:10, list:[
    [0.0, "한 변이 $2$인 정삼각형을 반으로 자르면 변이 $1$, $\\sqrt{3}$, $2$인 직각삼각형이 나옵니다.", "Cut an equilateral triangle of side $2$ in half: a right triangle with sides $1$, $\\sqrt{3}$, $2$.", "把边长为$2$的正三角形切成两半，得到三边为$1$、$\\sqrt{3}$、$2$的直角三角形。"],
    [0.24, "$30^\\circ$와 마주 보는 변은 $1$이므로 $\\sin 30^\\circ=\\dfrac{1}{2}$, $\\cos 30^\\circ=\\dfrac{\\sqrt{3}}{2}$입니다.", "The side opposite $30^\\circ$ is $1$, so $\\sin 30^\\circ=\\dfrac{1}{2}$ and $\\cos 30^\\circ=\\dfrac{\\sqrt{3}}{2}$.", "$30^\\circ$所对的边是$1$，所以$\\sin 30^\\circ=\\dfrac{1}{2}$，$\\cos 30^\\circ=\\dfrac{\\sqrt{3}}{2}$。"],
    [0.6, "두 변이 $1$인 직각이등변삼각형의 빗변은 $\\sqrt{2}$ — $\\sin 45^\\circ=\\dfrac{\\sqrt{2}}{2}$입니다.", "A right isosceles triangle with legs $1$ has hypotenuse $\\sqrt{2}$: $\\sin 45^\\circ=\\dfrac{\\sqrt{2}}{2}$.", "两直角边为$1$的等腰直角三角形，斜边是$\\sqrt{2}$——$\\sin 45^\\circ=\\dfrac{\\sqrt{2}}{2}$。"],
    [0.8, "$\\tan$에서는 빗변이 사라져 $\\tan 60^\\circ=\\sqrt{3}$입니다.", "In $\\tan$ the hypotenuse cancels: $\\tan 60^\\circ=\\sqrt{3}$.", "在$\\tan$中斜边被约去：$\\tan 60^\\circ=\\sqrt{3}$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.3, 0.0, -0.2], 6.8, 62);
    k.table();
    const R3 = Math.sqrt(3), U = 1.38, EX = -1.75, EZ = 0.75;
    const lab = (g, t, x, y, fs, col) => { const W = mdraw(k, g, t, 0, 0, fs, false); if(col) g.fillStyle = g.strokeStyle = col; mdraw(k, g, t, x - W / 2, y, fs, true); g.fillStyle = g.strokeStyle = '#2b2118'; };
    /* 정삼각형의 왼쪽 반 — (−1,0), (0,0), (0,√3) */
    const L = triPlate(k, [[-1, 0], [0, 0], [0, R3]], U, { bg:'#eedcb6', glow:true, draw:(g, X, Y, ppu) => {
      const f = ppu * 0.2;
      lab(g, ['2'], X(-0.46), Y(0.72), f * 1.1, RUST); lab(g, ['1'], X(-0.42), Y(0.13), f * 1.1, RUST); lab(g, [{ r:'3' }], X(-0.19), Y(0.9), f, RUST);
      arcMark(g, X, Y, ppu, 0, R3, -Math.PI / 2 - Math.PI / 6, -Math.PI / 2, 0.36); lab(g, ['30°'], X(-0.12), Y(R3 - 0.5), f * 0.62);
      arcMark(g, X, Y, ppu, -1, 0, 0, Math.PI / 3, 0.28); lab(g, ['60°'], X(-0.66), Y(0.16), f * 0.62);
      g.lineWidth = ppu * 0.016; g.strokeRect(X(-0.12), Y(0.12), 0.12 * ppu, 0.12 * ppu); } });
    /* 오른쪽 반 — (0,0), (1,0), (0,√3) */
    const Rr = triPlate(k, [[0, 0], [1, 0], [0, R3]], U, { bg:'#e3cfa6', draw:(g, X, Y, ppu) => {
      arcMark(g, X, Y, ppu, 1, 0, Math.PI - Math.PI / 3, Math.PI, 0.28); lab(g, ['60°'], X(0.66), Y(0.16), ppu * 0.124);
      arcMark(g, X, Y, ppu, 0, R3, -Math.PI / 2, -Math.PI / 2 + Math.PI / 6, 0.36); lab(g, ['30°'], X(0.12), Y(R3 - 0.52), ppu * 0.124); } });
    L.position.set(EX, 0, EZ); Rr.position.set(EX, 0, EZ);
    /* 직각이등변삼각형 — (0,0), (1,0), (0,1), 한 변 1 */
    const U2 = 1.65;
    const I = triPlate(k, [[0, 0], [1, 0], [0, 1]], U2, { bg:'#dfe7d6', side:'#b9925a', glow:true, draw:(g, X, Y, ppu) => {
      const f = ppu * 0.13;
      lab(g, ['1'], X(0.5), Y(0.08), f, RUST); lab(g, ['1'], X(0.08), Y(0.5), f, RUST); lab(g, [{ r:'2' }], X(0.4), Y(0.38), f, RUST);
      arcMark(g, X, Y, ppu, 1, 0, Math.PI - Math.PI / 4, Math.PI, 0.2); lab(g, ['45°'], X(0.66), Y(0.09), f * 0.75);
      arcMark(g, X, Y, ppu, 0, 1, -Math.PI / 2, -Math.PI / 4, 0.2); lab(g, ['45°'], X(0.1), Y(0.66), f * 0.75);
      g.lineWidth = ppu * 0.012; g.strokeRect(X(0), Y(0.09), 0.09 * ppu, 0.09 * ppu); } });
    I.position.set(-0.08, 0, 0.8);
    /* 값 카드 */
    const X = 2.62, cw = 1.85;
    const c1 = mcard(k, ['sin 30° = ', { n:'1', d:'2' }], X, -1.72, { w:cw, d:0.7, glow:true, hmax:0.4 });
    const c2 = mcard(k, ['cos 30° = ', { n:[{ r:'3' }], d:'2' }], X, -0.9, { w:cw, d:0.7, glow:true, hmax:0.4 });
    const c3 = mcard(k, ['sin 45° = ', { n:[{ r:'2' }], d:'2' }], X, -0.08, { w:cw, d:0.7, glow:true, hmax:0.4 });
    const c4 = mcard(k, ['tan 60° = ', { r:'3' }], X, 0.74, { w:cw, d:0.7, glow:true, hmax:0.4, bg:GREEN, edge:GEDGE });
    /* 움직임: 정삼각형을 반으로 갈라(오른쪽 반이 밀려나고) → 30° 카드 둘 → 다시 붙는다 → 직각이등변삼각형이 빛나고 45° 카드 → tan60° 카드 */
    const R0 = Rr.position.clone();
    k.onFrame(t => { const p = cyc(t, 10);
      const u = seg(p, 0.06, 0.2) * (1 - seg(p, 0.46, 0.58));
      Rr.position.set(R0.x + 0.55 * u, 0.12 * (hop(p, 0.06, 0.2) + hop(p, 0.46, 0.58)), R0.z);
      L.userData.mat.emissiveIntensity = 0.35 * hop(p, 0.2, 0.46);
      pop(c1, p, 0.24, 0.4); pop(c2, p, 0.3, 0.46);
      I.position.y = 0.1 * hop(p, 0.6, 0.78); I.userData.mat.emissiveIntensity = 0.35 * hop(p, 0.6, 0.78);
      pop(c3, p, 0.62, 0.78); pop(c4, p, 0.8, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0], envOpts:{ intensity:0.7 } });
  }},

  /* 등차수열 — history: 린드 파피루스, 곡물을 다섯 사람에게 일정한 차이로 나누는 문제. stage ①: a₁=2, d=3 → 2, 5, 8, 11, 14, a₅ = 2 + 3×4 = 14.
     stage ②: a₂=7, a₅=16 → d = (16−7)÷(5−2) = 3, a₁ = 7−3 = 4 */
  'M-40': { seed:440, caps:{ P:10, list:[
    [0.0, "곡물을 다섯 몫으로, 한 몫마다 $3$씩 더 많게 나눕니다: $2$, $5$, $8$, $11$, $14$", "Grain in five shares, each $3$ more than the last: $2$, $5$, $8$, $11$, $14$", "把谷物分成五份，每份比前一份多$3$：$2$，$5$，$8$，$11$，$14$"],
    [0.06, "첫째 몫 $2$에서 다섯째 몫까지는 $3$을 $5-1=4$번 더합니다.", "From the first share $2$ to the fifth, add $3$ exactly $5-1=4$ times.", "从第一份$2$到第五份，要加$5-1=4$次$3$。"],
    [0.5, "$a_5=2+3\\times4=14$ — 일반항은 $a_n=a_1+(n-1)d$입니다.", "$a_5=2+3\\times4=14$: the general term is $a_n=a_1+(n-1)d$.", "$a_5=2+3\\times4=14$——通项是$a_n=a_1+(n-1)d$。"],
    [0.76, "$a_2=7$, $a_5=16$이면 공차는 $(16-7)\\div(5-2)=3$입니다.", "If $a_2=7$ and $a_5=16$, the common difference is $(16-7)\\div(5-2)=3$.", "若$a_2=7$，$a_5=16$，公差是$(16-7)\\div(5-2)=3$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.0, 0.2, -0.6], 6.6, 50);
    k.table();
    k.paper(6.0, 1.55, 0, -0.95, 0.01);
    /* stage ② 의 수열(a₁ = 4, d = 3) — a₂ = 7, a₅ = 16 에 색 */
    k.paper(4.6, 0.75, 0, -2.2, -0.01, (g, w, h) => { g.textBaseline = 'middle';
      [4, 7, 10, 13, 16].forEach((n, i) => { g.fillStyle = (n === 7 || n === 16) ? '#8a2a10' : 'rgb(28,20,14)'; k.mathText(g, String(n) + (i < 4 ? ',' : ''), w * (0.14 + i * 0.18), h * 0.52, h * 0.5); }); });
    const grain = k.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#d6b36a'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#8a6a30'; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 9000; i++){ const v = 170 + k.rnd() * 80; g.fillStyle = `rgb(${v},${Math.round(v * 0.84)},${Math.round(v * 0.5)})`; g.beginPath(); g.ellipse(k.rnd() * w, k.rnd() * h, 3.2 + k.rnd() * 1.2, 1.6, k.rnd() * Math.PI, 0, Math.PI * 2); g.fill(); } }, [4, 3]);
    const TERMS = [2, 5, 8, 11, 14], XS = [-2.4, -1.2, 0, 1.2, 2.4];
    XS.forEach((x, i) => grainBowl(k, x, -1.05, 0.12 + TERMS[i] * 0.034, grain));
    const tiles = TERMS.map((n, i) => k.tile(String(n), XS[i], -0.05, { w:0.7, d:0.62, h:0.14, size:280 }));
    /* 몫 사이의 +3 */
    for(let i = 0; i < 4; i++) mcard(k, '+3', (XS[i] + XS[i + 1]) / 2, -0.05, { w:0.42, d:0.3, hmax:0.62, bg:'#e7d2a8', color:RUST });
    /* 옮겨 다니며 세는 말 */
    const pw = pawn(k, '#8e1c16'); const S0 = new THREE.Vector3(XS[0], 0, 0.55); pw.position.copy(S0);
    /* 식 카드 */
    const c1 = mcard(k, ['a', { sub:'5' }, ' = 2 + 3 × 4 = 14'], -2.12, 1.15, { w:2.0, d:0.6, glow:true, hmax:0.5 });
    const c2 = mcard(k, ['a', { sub:'n' }, ' = a', { sub:'1' }, ' + (n − 1)d'], 0.0, 1.15, { w:2.0, d:0.6, glow:true, hmax:0.5, bg:GREEN, edge:GEDGE });
    const c3 = mcard(k, '(16 − 7) ÷ (5 − 2) = 3', 2.12, 1.15, { w:2.0, d:0.6, glow:true, hmax:0.5 });
    /* 움직임: 말이 둘째 몫부터 +3 씩 네 번 건너가며 몫이 하나씩 들리고 → a₅ 카드 → 말이 첫 자리로 돌아온다 → 공차 카드 */
    const T = XS.map(x => new THREE.Vector3(x, 0, 0.55)), hopT = [0.08, 0.18, 0.28, 0.38];
    const ty = tiles.map(m => m.position.y);
    k.onFrame(t => { const p = cyc(t, 10);
      let pos = S0.clone();
      hopT.forEach((a, i) => { const u = (p - a) / 0.08; if(u >= 1) pos = T[i + 1].clone(); else if(u > 0){ pos = new THREE.Vector3().lerpVectors(T[i], T[i + 1], ease(u)); pos.y += 0.35 * Math.sin(Math.PI * u); } });
      const back = seg(p, 0.64, 0.76); if(back > 0){ pos = new THREE.Vector3().lerpVectors(T[4], S0, back); pos.y += 0.5 * Math.sin(Math.PI * back); }
      pw.position.copy(pos);
      tiles.forEach((m, i) => { const a = i ? hopT[i - 1] + 0.07 : 0.01; m.position.y = ty[i] + 0.1 * hop(p, a, a + 0.08); });
      pop(c1, p, 0.48, 0.64); pop(c2, p, 0.52, 0.7); pop(c3, p, 0.78, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0], envOpts:{ intensity:0.7 } });
  }},

  /* 등비수열 — hook: 체스판 첫 칸에 쌀 1 알, 다음 칸 2 알, 그다음 4 알 … history: 64 칸이면 18,446,744,073,709,551,615 알(= 2⁶⁴ − 1).
     stage ①: a₁=2, r=3 → a₄ = 2×3³ = 54. stage ②: 1 + 2 + 4 + 8 = 15 */
  'M-41': { seed:441, caps:{ P:10, list:[
    [0.0, "체스판 첫 칸에 쌀 $1$알, 다음 칸부터 두 배씩: $1$, $2$, $4$, $8$, $16$, $32$", "One grain of rice on the first square, then double each time: $1$, $2$, $4$, $8$, $16$, $32$", "棋盘第一格放$1$粒米，之后每格翻倍：$1$，$2$，$4$，$8$，$16$，$32$"],
    [0.5, "처음 네 칸을 나열해 더하면 $1+2+4+8=15$입니다.", "Add the first four squares: $1+2+4+8=15$.", "把前四格依次相加：$1+2+4+8=15$。"],
    [0.66, "같은 수를 곱해 가는 수열 — $a_1=2$, $r=3$이면 $a_4=2\\times3^3=54$입니다.", "Keep multiplying by the same number: with $a_1=2$, $r=3$, $a_4=2\\times3^3=54$.", "不断乘同一个数——$a_1=2$，$r=3$时，$a_4=2\\times3^3=54$。"],
    [0.82, "$64$칸 전부는 $2^{64}-1=18446744073709551615$알입니다.", "All $64$ squares hold $2^{64}-1=18446744073709551615$ grains.", "$64$格共有$2^{64}-1=18446744073709551615$粒。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.15, 0.0, 0.75], 5.9, 50);
    k.table();
    /* 체스판 — 8 × 8, 칸 SQ. 첫 줄(앞줄)이 왼쪽부터 1, 2, 3 … 칸 */
    const SQ = 0.62, BW = SQ * 8, BX = -0.2, BZ = -2.0;
    const bt = k.canvasTex(1024, 1024, (g, w, h) => { const c = w / 8;
      for(let r = 0; r < 8; r++) for(let q = 0; q < 8; q++){ g.fillStyle = (r + q) % 2 ? '#5a3319' : '#e2c48f'; g.fillRect(q * c, r * c, c, c);
        for(let i = 0; i < 14; i++){ g.strokeStyle = `rgba(80,45,20,${0.05 + k.rnd() * 0.1})`; g.lineWidth = 1 + k.rnd() * 2; g.beginPath(); const y = r * c + k.rnd() * c; g.moveTo(q * c, y); g.lineTo(q * c + c, y + (k.rnd() - 0.5) * 6); g.stroke(); } } });
    const slab = new THREE.Mesh(k.rbox(BW + 0.26, 0.1, BW + 0.26, 0.06), k.woodMat('#6e4222', [40, 20, 8])); slab.position.set(BX, 0, BZ); slab.castShadow = slab.receiveShadow = true; scene.add(slab);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(BW, BW), new THREE.MeshStandardMaterial({ map:bt, roughness:0.45, metalness:0.0 }));
    face.rotation.x = -Math.PI / 2; face.position.set(BX, 0.102, BZ); face.receiveShadow = true; scene.add(face);
    const sqX = i => BX - BW / 2 + SQ * (i + 0.5), rowZ = BZ + BW / 2 - SQ / 2;
    /* 쌀알 — 칸마다 1, 2, 4, 8, 16, 32 */
    const riceGeo = new THREE.SphereGeometry(1, 12, 8), riceMat = new THREE.MeshPhysicalMaterial({ color:'#f4efe2', roughness:0.35, clearcoat:0.4 });
    const COUNTS = [1, 2, 4, 8, 16, 32], piles = [];
    COUNTS.forEach((n, i) => { const grp = new THREE.Group(); grp.position.set(sqX(i), 0.1, rowZ); scene.add(grp); piles.push(grp);
      const im = new THREE.InstancedMesh(riceGeo, riceMat, n); im.castShadow = true; const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
      for(let j = 0; j < n; j++){ const lim = n === 1 ? 0 : SQ * 0.34; const x = (k.rnd() - 0.5) * 2 * lim, z = (k.rnd() - 0.5) * 2 * lim;
        e.set(0, k.rnd() * Math.PI, (k.rnd() - 0.5) * 0.3); q.setFromEuler(e); m4.compose(new THREE.Vector3(x, 0.03 + (j > 20 ? 0.04 : 0), z), q, new THREE.Vector3(0.068, 0.03, 0.032)); im.setMatrixAt(j, m4); }
      grp.add(im); });
    /* 칸 앞의 수 */
    const tiles = COUNTS.map((n, i) => k.tile(String(n), sqX(i), rowZ + 0.66, { w:0.54, d:0.44, h:0.12, size:250 }));
    /* 식 카드 */
    const c1 = mcard(k, '1 + 2 + 4 + 8 = 15', -1.45, 1.55, { w:2.3, d:0.56, glow:true, hmax:0.52 });
    const c2 = mcard(k, ['a', { sub:'4' }, ' = 2 × 3', { sup:'3' }, ' = 54'], 1.1, 1.55, { w:2.3, d:0.56, glow:true, hmax:0.52 });
    const c3 = mcard(k, ['2', { sup:'64' }, ' − 1 = 18446744073709551615'], -0.18, 2.22, { w:4.2, d:0.6, glow:true, hmax:0.5, fill:0.9, bg:GREEN, edge:GEDGE });
    /* 움직임: 칸마다 쌀알이 차례로 톡 튀어 오르며(1, 2, 4 …) 수가 빛나고 → 합 15 → a₄ = 54 → 2⁶⁴ − 1 */
    const ty = tiles.map(m => m.position.y);
    k.onFrame(t => { const p = cyc(t, 10);
      piles.forEach((g, i) => { const a = 0.04 + i * 0.07; g.position.y = 0.1 + 0.18 * hop(p, a, a + 0.08); });
      tiles.forEach((m, i) => { const a = 0.05 + i * 0.07; m.position.y = ty[i] + 0.07 * hop(p, a, a + 0.08); });
      pop(c1, p, 0.5, 0.64); pop(c2, p, 0.66, 0.8); pop(c3, p, 0.82, 0.97); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[-0.5, 7, 2], spotAt:[-0.5, 0, 0], envOpts:{ intensity:0.7 } });
  }},

  /* Σ 계산 — hook: 1+2+⋯+100 을 짧게 쓰는 법, 무지개 덧셈법 n(n+1)÷2. history: 오일러가 합(Sum)에 Σ.
     stage ①: Σ_{k=1}^{4} k = 1+2+3+4 = 10. stage ②: Σk = n(n+1)/2, Σk² = n(n+1)(2n+1)/6 (이미 아는 두 마법의 새 이름표) */
  'M-42': { seed:442, caps:{ P:10, list:[
    [0.0, "$k$ 자리에 $1$, $2$, $3$, $4$를 차례로 넣어 쌓습니다.", "Put $1$, $2$, $3$, $4$ in place of $k$, one after another.", "依次把$1$，$2$，$3$，$4$代入$k$。"],
    [0.3, "다 더하면 $\\sum_{k=1}^{4} k=1+2+3+4=10$입니다.", "Add them all: $\\sum_{k=1}^{4} k=1+2+3+4=10$.", "全部相加：$\\sum_{k=1}^{4} k=1+2+3+4=10$。"],
    [0.46, "같은 계단을 뒤집어 얹으면 $4\\times5$ 직사각형 — $\\dfrac{4\\times5}{2}=10$, 무지개 덧셈법입니다.", "Flip a copy on top: a $4\\times5$ rectangle, so $\\dfrac{4\\times5}{2}=10$, the rainbow sum.", "把同样的台阶倒扣上去，成为$4\\times5$的长方形——$\\dfrac{4\\times5}{2}=10$，彩虹加法。"],
    [0.8, "그래서 $\\sum_{k=1}^{n} k=\\dfrac{n(n+1)}{2}$ — $1$부터 $100$까지는 $\\dfrac{100\\times101}{2}=5050$입니다.", "So $\\sum_{k=1}^{n} k=\\dfrac{n(n+1)}{2}$: from $1$ to $100$ it is $\\dfrac{100\\times101}{2}=5050$.", "所以$\\sum_{k=1}^{n} k=\\dfrac{n(n+1)}{2}$——从$1$到$100$是$\\dfrac{100\\times101}{2}=5050$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.0, 0.45, 0.1], 5.9, 38);
    k.table();
    const S = 0.4, N = 4, AX = -2.1, BX0 = 0.55, CZ = -0.9;
    const colX = (x0, j) => x0 + j * S;
    const cube = (mat, x, y, z, parent) => { const m = new THREE.Mesh(k.rbox(S * 0.98, S * 0.98, S * 0.98, 0.04), mat); m.castShadow = m.receiveShadow = true; m.position.set(x, y, z); (parent || scene).add(m); return m; };
    const orange = k.lacquer('#b0521c'), blue = k.lacquer('#2f5f8f');
    /* 계단 A — k = 1, 2, 3, 4 */
    const cols = [];
    for(let j = 0; j < N; j++){ const g = new THREE.Group(); scene.add(g); cols.push(g);
      for(let i = 0; i <= j; i++) cube(orange, colX(AX, j), i * S + 0.005, CZ, g); }
    /* 계단 B — 같은 계단(파랑). 회전 중심 = 4 × 4 칸의 한가운데 */
    const B = new THREE.Group(); scene.add(B);
    const midX = (N - 1) * S / 2;
    for(let j = 0; j < N; j++) for(let i = 0; i <= j; i++) cube(blue, j * S - midX, i * S + 0.005 - 2 * S, 0, B);
    const B0 = new THREE.Vector3(colX(BX0, 0) + midX, 2 * S, CZ), BT = new THREE.Vector3(colX(AX, 0) + midX, 3 * S, CZ);
    B.position.copy(B0);
    /* k 자리의 수 */
    const tiles = [1, 2, 3, 4].map(n => k.tile(String(n), colX(AX, n - 1), CZ + 0.5, { w:0.36, d:0.36, h:0.1, size:300 }));
    /* 식 카드 */
    const c1 = mcard(k, [{ sig:true, top:'4', bot:'k=1' }, ' k = 1 + 2 + 3 + 4 = 10'], -1.0, 0.45, { w:3.3, d:0.78, glow:true, hmax:0.4 });
    const c2 = mcard(k, [{ n:'4 × 5', d:'2' }, ' = 10'], 1.75, 0.45, { w:1.8, d:0.78, glow:true, hmax:0.36 });
    const c3 = mcard(k, [{ sig:true, top:'n', bot:'k=1' }, ' k = ', { n:'n(n + 1)', d:'2' }], -1.35, 1.38, { w:2.5, d:0.86, glow:true, hmax:0.32, bg:GREEN, edge:GEDGE });
    const c4 = mcard(k, [{ sig:true, top:'n', bot:'k=1' }, ' k', { sup:'2' }, ' = ', { n:'n(n + 1)(2n + 1)', d:'6' }], 1.4, 1.38, { w:2.9, d:0.86, glow:true, hmax:0.32, bg:GREEN, edge:GEDGE });
    /* 움직임: k = 1 … 4 기둥이 차례로 들리고 → Σ 카드 → 파란 계단이 뒤집혀 올라가 4 × 5 직사각형 → 반으로 10 → 제자리 → 공식 카드 */
    const ty = tiles.map(m => m.position.y);
    k.onFrame(t => { const p = cyc(t, 10);
      cols.forEach((g, j) => { const a = 0.04 + j * 0.06; g.position.y = 0.12 * hop(p, a, a + 0.08); tiles[j].position.y = ty[j] + 0.08 * hop(p, a, a + 0.08); });
      pop(c1, p, 0.3, 0.46);
      const u = seg(p, 0.46, 0.62) * (1 - seg(p, 0.76, 0.9));
      B.position.lerpVectors(B0, BT, u); B.position.y += 0.75 * (hop(p, 0.46, 0.62) + hop(p, 0.76, 0.9));
      B.rotation.z = Math.PI * u;
      pop(c2, p, 0.6, 0.76); pop(c3, p, 0.82, 0.97); pop(c4, p, 0.84, 0.98); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[-0.5, 7, 2], spotAt:[-0.5, 0.4, 0], envOpts:{ intensity:0.7 } });
  }},
};
