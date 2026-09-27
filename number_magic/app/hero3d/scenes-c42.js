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
    if(typeof p === 'string'){ cx += gtext(k, g, p, cx, cy, fs, draw); return; }
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
const RUST = '#9a3d12', BLUE = '#2f5f8f', GREEN = '#dcebd9', GEDGE = '#c9d6b5';

export const SCENES_C42 = {

  /* 거듭제곱근과 유리수 지수 — hook: 2 의 1/2 제곱은 왜 √2? stage ①: ∛(2²) = 2^(2/3) (근호 지수 → 분모, 거듭제곱 → 분자),
     stage ②: ⁶√(2⁴) = 2^(4/6) = 2^(2/3). history: 손으로 하던 큰 수 계산 — 종이 위 계산으로 */
  'M-36': { seed:436, caps:{ P:9, list:[
    [0.0, "$\\sqrt[3]{2^2}$에서 근호의 $3$은 분모로, 거듭제곱의 $2$는 분자로 옮겨 갑니다.", "In $\\sqrt[3]{2^2}$, the root's $3$ moves to the denominator and the power's $2$ to the numerator.", "在$\\sqrt[3]{2^2}$中，根指数$3$移到分母，幂指数$2$移到分子。"],
    [0.42, "그래서 $\\sqrt[3]{2^2}=2^{\\dfrac{2}{3}}$입니다.", "So $\\sqrt[3]{2^2}=2^{\\dfrac{2}{3}}$.", "所以$\\sqrt[3]{2^2}=2^{\\dfrac{2}{3}}$。"],
    [0.56, "$\\sqrt[6]{2^4}$의 지수 $\\dfrac{4}{6}$도 약분하면 $\\dfrac{2}{3}$ — 같은 수입니다.", "The exponent $\\dfrac{4}{6}$ of $\\sqrt[6]{2^4}$ reduces to $\\dfrac{2}{3}$: the same number.", "$\\sqrt[6]{2^4}$的指数$\\dfrac{4}{6}$约分后是$\\dfrac{2}{3}$——同一个数。"],
    [0.76, "같은 약속으로 $2^{\\dfrac{1}{2}}=\\sqrt{2}$입니다.", "By the same rule, $2^{\\dfrac{1}{2}}=\\sqrt{2}$.", "按同样的约定，$2^{\\dfrac{1}{2}}=\\sqrt{2}$。"]
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
    const S = 0.36, AX = -2.25, BX = -1.05, CZ = 0.2;
    const cube = (mat, x, y) => { const m = new THREE.Mesh(k.rbox(S, S, S, 0.04), mat); m.castShadow = m.receiveShadow = true; m.position.set(x, y, CZ); scene.add(m); return m; };
    const blue = k.lacquer('#2f5f8f'), rust = k.lacquer('#9a3d12');
    for(let i = 0; i < 2; i++) cube(blue, AX, i * S);
    const B = new THREE.Group(); scene.add(B);
    for(let i = 0; i < 3; i++){ const m = cube(rust, 0, i * S); B.add(m); }
    B.position.set(BX, 0, 0);
    const lA = mcard(k, ['log', { sub:'2' }, ' 4 = 2'], AX, 0.85, { w:1.0, d:0.4, hmax:0.52 });
    const lB = mcard(k, ['log', { sub:'2' }, ' 8 = 3'], BX, 0.85, { w:1.0, d:0.4, hmax:0.52 });
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
};
