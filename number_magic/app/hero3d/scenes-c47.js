/* C47 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만 — scenes-c42 에서 가져와 lim·∫ 를 더함) ───────────── */

/* 글자 한 조각 — log·sin·cos·tan 은 바로 선 글자, 나머지 라틴 문자는 수학 이탤릭 */
function gtext(k, g, s, x, y, fs, draw){
  let cx = x;
  String(s).split(/(log|sin|cos|tan|lim)/).filter(r => r !== '').forEach(r => {
    cx += k.mathText(g, r, cx, y, fs, { align:'left', draw, upright:/^(log|sin|cos|tan|lim)$/.test(r) });
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
        mdraw(k, g, p.int[1], cx + iw + fs * 0.06, top + fs * 0.05, s, true); mdraw(k, g, p.int[0], cx + iw - fs * 0.04, bot - fs * 0.02, s, true);
      }
      cx += W + fs * 0.06; return;
    }
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
const RUST = '#9a3d12', BLUE = '#2f5f8f', GREEN = '#dcebd9', GEDGE = '#c9d6b5';

export const SCENES_C47 = {

  /* 0/0 유리화형 극한 — hook: lim(x→0) (√(x+4)−2)/x 에 x=0 을 넣으면 0/0. history: 켤레 (√A−B)(√A+B)=A−B².
     stage ①: 켤레를 곱해 분자가 x → 1/(√(x+4)+2) → 1/4. stage ②: 근호가 분모에 있으면 √(x+4)+2 → 4 */
  'M-58': { seed:458, caps:{ P:10, list:[
    [0.0, "$x=0$을 넣으면 $\\dfrac{\\sqrt{x+4}-2}{x}$는 $\\dfrac{0}{0}$ 꼴이 됩니다.", "Plug in $x=0$ and $\\dfrac{\\sqrt{x+4}-2}{x}$ becomes the form $\\dfrac{0}{0}$.", "代入$x=0$，$\\dfrac{\\sqrt{x+4}-2}{x}$变成$\\dfrac{0}{0}$型。"],
    [0.24, "켤레를 곱하면 $(\\sqrt{x+4}-2)(\\sqrt{x+4}+2)=(x+4)-4=x$ — 근호가 사라집니다.", "Multiply by the conjugate: $(\\sqrt{x+4}-2)(\\sqrt{x+4}+2)=(x+4)-4=x$, and the root is gone.", "乘以共轭式：$(\\sqrt{x+4}-2)(\\sqrt{x+4}+2)=(x+4)-4=x$——根号消失了。"],
    [0.5, "$x$를 약분하면 $\\lim_{x\\to 0}\\dfrac{1}{\\sqrt{x+4}+2}=\\dfrac{1}{2+2}=\\dfrac{1}{4}$입니다.", "Cancel $x$: $\\lim_{x\\to 0}\\dfrac{1}{\\sqrt{x+4}+2}=\\dfrac{1}{2+2}=\\dfrac{1}{4}$.", "约去$x$：$\\lim_{x\\to 0}\\dfrac{1}{\\sqrt{x+4}+2}=\\dfrac{1}{2+2}=\\dfrac{1}{4}$。"],
    [0.75, "근호가 분모에 있으면 $\\lim_{x\\to 0}\\dfrac{x}{\\sqrt{x+4}-2}=2+2=4$로 정수가 됩니다.", "With the root in the denominator, $\\lim_{x\\to 0}\\dfrac{x}{\\sqrt{x+4}-2}=2+2=4$, an integer.", "根号在分母时，$\\lim_{x\\to 0}\\dfrac{x}{\\sqrt{x+4}-2}=2+2=4$，是整数。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0, 0.12], 5.8, 63);
    k.table();
    /* 뒷줄: 극한 카드와 0/0 꼴 조각 */
    const cA = mcard(k, [{ lim:'x → 0' }, ' ', { n:[{ r:'x + 4' }, ' − 2'], d:'x' }], -0.75, -1.2, { w:2.9, d:1.05, hmax:0.3, dy:-0.02, glow:true });
    const zz = mcard(k, [{ n:[{ c:RUST, t:'0' }], d:[{ c:RUST, t:'0' }] }], 1.45, -1.2, { w:0.9, d:1.05, hmax:0.36, glow:true });
    /* 가운데 줄: 켤레 두 짝(부호만 다른 나무 판) — 곱하면 x */
    const mkPair = (sign, col, x) => { const t = k.tile('', x, 0, { w:1.5, d:0.62, h:0.14, wood:'#d9b27c' });
      const top = mcard(k, ['(', { r:'x + 4' }, ' ', { c:col, t:sign + ' 2' }, ')'], x, 0, { w:1.42, d:0.56, h:0.012, y:0.145, hmax:0.44, bg:'#f5ead4', edge:'#e3d2b0', glow:true });
      return [t, top]; };
    const L = mkPair('−', RUST, -2.0), R = mkPair('+', BLUE, -0.15);
    mcard(k, '×', -1.075, 0, { w:0.34, d:0.4, hmax:0.62 });
    const cP = mcard(k, [' = (x + 4) − 4 = x'], 1.75, 0, { w:1.9, d:0.62, hmax:0.44, glow:true });
    /* 앞줄: 두 결과 */
    const cR1 = mcard(k, [{ lim:'x → 0' }, ' ', { n:'1', d:[{ r:'x + 4' }, ' + 2'] }, ' = ', { n:'1', d:'4' }], -1.2, 1.1, { w:2.6, d:1.0, hmax:0.3, bg:GREEN, edge:GEDGE, glow:true });
    const cR2 = mcard(k, [{ lim:'x → 0' }, ' ', { n:'x', d:[{ r:'x + 4' }, ' − 2'] }, ' = 4'], 1.45, 1.1, { w:2.4, d:1.0, hmax:0.3, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: 0/0 이 톡 튀고 → 켤레 두 짝이 차례로 들렸다 놓임 → x 카드 → 1/4 → 4 */
    const yL = L.map(m => m.position.y), yR = R.map(m => m.position.y);
    k.onFrame(t => { const p = cyc(t, 10);
      pop(cA, p, 0.02, 0.2, 0.08); pop(zz, p, 0.06, 0.2);
      L.forEach((m, i) => { m.position.y = yL[i] + 0.14 * hop(p, 0.25, 0.37); }); R.forEach((m, i) => { m.position.y = yR[i] + 0.14 * hop(p, 0.29, 0.41); });
      L[1].userData.mat.emissiveIntensity = R[1].userData.mat.emissiveIntensity = 0.45 * hop(p, 0.26, 0.46);
      pop(cP, p, 0.36, 0.5); pop(cR1, p, 0.52, 0.72); pop(cR2, p, 0.77, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.2], envOpts:{ intensity:0.7 } });
  }},

  /* 연속조건 상수 결정 — hook: 연필을 떼지 않고 그리는 그래프, x=3 에서만 값이 k 인 이상한 점.
     stage ①: (x²−9)/(x−3) = x+3 → 극한값 6 → k=6. stage ②: x+b 와 3x−1 이 x=2 에서 만나려면 2+b=5 → b=3.
     그래프 한지 위에 y=x+3 직선(구멍 (3, 6)) · 구멍을 메우는 원판 k · 연필, 오른쪽에 식 카드 */
  'M-59': { seed:459, caps:{ P:10, list:[
    [0.0, "$x=3$에서만 값이 $k$인 점입니다. $k$가 맞지 않으면 그래프가 그 점에서 끊어집니다.", "Only at $x=3$ is the value $k$. If $k$ is wrong, the graph breaks at that point.", "只有在$x=3$处函数值是$k$。$k$不对，图像就在那一点断开。"],
    [0.24, "$x\\ne 3$이면 $\\dfrac{x^2-9}{x-3}=\\dfrac{(x-3)(x+3)}{x-3}=x+3$이므로 극한값은 $3+3=6$입니다.", "For $x\\ne 3$, $\\dfrac{x^2-9}{x-3}=\\dfrac{(x-3)(x+3)}{x-3}=x+3$, so the limit is $3+3=6$.", "当$x\\ne 3$时，$\\dfrac{x^2-9}{x-3}=\\dfrac{(x-3)(x+3)}{x-3}=x+3$，所以极限值是$3+3=6$。"],
    [0.48, "$k=6$이면 구멍이 메워져 연필을 떼지 않고 그을 수 있습니다 — $x=3$에서 연속입니다.", "With $k=6$ the hole is filled and the pencil never lifts: continuous at $x=3$.", "$k=6$时洞被填上，铅笔不用抬起——在$x=3$处连续。"],
    [0.78, "구간별 함수도 경계에서 값이 같아야 합니다: $2+b=3\\times 2-1=5$이므로 $b=3$입니다.", "A piecewise function must match at the boundary: $2+b=3\\times 2-1=5$, so $b=3$.", "分段函数在分界点的值也要相等：$2+b=3\\times 2-1=5$，所以$b=3$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.1, 0, 0.28], 6.2, 60);
    k.table();
    /* 그래프 한지 — 원점 (u0, v0), 가로 x 0~5, 세로 y 0~8 */
    const PW = 3.5, PD = 2.9, PX = -1.35, PZ = 0.1;
    const CW = 1400, CH = Math.round(1400 * PD / PW), u0 = 190, v0 = CH - 150, su = 225, sv = (CH - 260) / 8.4;
    const gu = x => u0 + x * su, gv = y => v0 - y * sv;
    const world = (x, y, h) => new THREE.Vector3(PX + (gu(x) / CW - 0.5) * PW, h, PZ + (gv(y) / CH - 0.5) * PD);
    k.paper(PW, PD, PX, PZ, 0, (g, w, h, ink) => {
      g.save(); g.strokeStyle = 'rgba(40,28,18,.85)'; g.fillStyle = 'rgba(40,28,18,.85)'; g.lineWidth = 6; g.lineCap = 'round';
      g.beginPath(); g.moveTo(u0 - 40, v0); g.lineTo(gu(5.5), v0); g.moveTo(u0, v0 + 40); g.lineTo(u0, gv(8.3)); g.stroke();
      [[gu(5.5) + 26, v0, 0], [u0, gv(8.3) - 26, -Math.PI / 2]].forEach(([x, y, a]) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(0, 0); g.lineTo(-34, -15); g.lineTo(-34, 15); g.closePath(); g.fill(); g.restore(); });
      /* 눈금 3 과 6 까지 점선 */
      g.setLineDash([18, 16]); g.lineWidth = 4; g.strokeStyle = 'rgba(60,40,24,.6)';
      g.beginPath(); g.moveTo(gu(3), v0); g.lineTo(gu(3), gv(6)); g.moveTo(u0, gv(6)); g.lineTo(gu(3), gv(6)); g.stroke(); g.setLineDash([]);
      g.restore();
      ink(g, '3', gu(3), v0 + 70, 84); ink(g, '6', u0 - 70, gv(6), 84); ink(g, 'O', u0 - 55, v0 + 60, 70);
      ink(g, 'x', gu(5.5) + 20, v0 + 70, 78); ink(g, 'y', u0 - 60, gv(8.3), 78);
      /* 직선 y = x + 3 — x=3 에 구멍 */
      g.save(); g.strokeStyle = '#8e2a12'; g.lineWidth = 12; g.lineCap = 'round';
      const R = 30;
      g.beginPath(); g.moveTo(gu(0), gv(3)); g.lineTo(gu(3) - R * 0.72, gv(6) + R * 0.72); g.moveTo(gu(3) + R * 0.72, gv(6) - R * 0.72); g.lineTo(gu(5), gv(8)); g.stroke();
      g.lineWidth = 8; g.beginPath(); g.arc(gu(3), gv(6), R, 0, Math.PI * 2); g.stroke(); g.restore();
      ink(g, 'y = x + 3', gu(4.1), gv(4.9), 76, { color:'#8e2a12' });
    });
    /* 원판 k — 구멍 (3, 6) 에 들어가 있다 */
    const kb = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 40), new THREE.MeshPhysicalMaterial({ color:'#c8962e', roughness:0.25, metalness:0.6, clearcoat:1 }));
    kb.castShadow = kb.receiveShadow = true; scene.add(kb);
    const HOLE = world(3, 6, 0.05), HIGH = world(3, 7.6, 0.05);
    kb.position.copy(HOLE);
    /* 연필 — 심 끝이 직선 위(x=1) */
    const pen = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1.5, 6), k.lacquer('#d8a21e')); body.position.y = 0.35 + 0.75;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.3, 6), k.woodMat('#e3c08c')); cone.rotation.x = Math.PI; cone.position.y = 0.2;
    const lead = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.1, 12), new THREE.MeshStandardMaterial({ color:'#2a2a2a', roughness:0.4, metalness:0.3 })); lead.rotation.x = Math.PI; lead.position.y = 0.05;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.14, 16), k.metal('#b9b3a6', 0.35)); cap.position.y = 1.85 + 0.07;
    [body, cone, lead, cap].forEach(m => { m.castShadow = m.receiveShadow = true; pen.add(m); });
    pen.rotation.set(-0.42, 0, -0.62); scene.add(pen);
    const P0 = world(1, 4, 0.02), P1 = world(4.7, 7.7, 0.02);
    pen.position.copy(P0);
    /* 식 카드 */
    const X = 1.95;
    const c1 = mcard(k, [{ n:['x', { sup:'2' }, ' − 9'], d:'x − 3' }, ' = x + 3'], X, -1.05, { w:2.5, d:0.95, hmax:0.34, glow:true });
    const c2 = mcard(k, [{ lim:'x → 3' }, ' (x + 3) = 3 + 3 = 6'], X, -0.12, { w:2.5, d:0.72, hmax:0.34, dy:-0.06, glow:true });
    const c3 = mcard(k, [{ c:'#8a5a0e', t:'k' }, ' = 6'], X, 0.7, { w:1.3, d:0.66, hmax:0.52, bg:GREEN, edge:GEDGE, glow:true });
    const c4 = mcard(k, '2 + b = 3 × 2 − 1 = 5  ⇒  b = 3', X, 1.5, { w:2.5, d:0.62, hmax:0.4, glow:true });
    /* 움직임: 원판 k 가 엉뚱한 높이로 튀어 구멍이 드러났다가(끊김) → 식 카드 → 원판이 6 자리로 돌아와 메움 → 연필이 끊김 없이 긋고 돌아옴 → b=3 */
    k.onFrame(t => { const p = cyc(t, 10);
      const u = seg(p, 0.04, 0.14) * (1 - seg(p, 0.4, 0.5));
      kb.position.lerpVectors(HOLE, HIGH, u); kb.position.y = HOLE.y + 0.25 * Math.sin(Math.PI * u);
      pop(c1, p, 0.22, 0.36); pop(c2, p, 0.3, 0.46); pop(c3, p, 0.46, 0.62);
      const w = seg(p, 0.5, 0.74) * (1 - seg(p, 0.8, 0.96));
      pen.position.lerpVectors(P0, P1, w); pen.position.y = P0.y + 0.18 * hop(p, 0.8, 0.96) + 0.07 * Math.exp(-Math.pow((w - 0.54) / 0.05, 2)) * (p < 0.8 ? 1 : 0);  /* 메운 자리 위를 미끄러져 지남 */
      pop(c4, p, 0.78, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[-0.5, 7, 2], spotAt:[-0.3, 0, 0.2], envOpts:{ intensity:0.7 } });
  }},

  /* 극값 — hook: 롤러코스터가 꼭대기·골짜기에서 잠깐 수평(기울기 0). history: 페르마 → f'(x)=0.
     stage ①: f(x)=x³−3x², f'(x)=3x²−6x=3x(x−2)=0 → x=0, 2. stage ②: f(0)=0(극대), f(2)=8−12=−4(극소).
     y=x³−3x² 모양의 레일(x −1.1 ~ 3.1) · 수레 · 꼭대기와 골짜기의 수평 막대, 앞에 식 카드 */
  'M-60': { seed:460, caps:{ P:10, list:[
    [0.0, "롤러코스터가 꼭대기에 닿는 순간 잠깐 수평이 됩니다 — 기울기가 $0$입니다.", "At the top, the coaster is level for an instant: the slope is $0$.", "过山车到达顶点的瞬间是水平的——斜率为$0$。"],
    [0.24, "$f(x)=x^3-3x^2$이면 $f'(x)=3x^2-6x=3x(x-2)$이므로 $f'(x)=0$의 해는 $x=0,\;2$입니다.", "For $f(x)=x^3-3x^2$, $f'(x)=3x^2-6x=3x(x-2)$, so $f'(x)=0$ at $x=0,\;2$.", "$f(x)=x^3-3x^2$时，$f'(x)=3x^2-6x=3x(x-2)$，所以$f'(x)=0$的解是$x=0,\;2$。"],
    [0.42, "골짜기도 기울기가 $0$입니다. 높이는 $f(2)=8-12=-4$ — 극솟값 $-4$입니다.", "The valley is level too. Its height is $f(2)=8-12=-4$: the local minimum $-4$.", "谷底的斜率也是$0$。高度是$f(2)=8-12=-4$——极小值$-4$。"],
    [0.72, "꼭대기 높이는 $f(0)=0$ — 극댓값 $0$입니다.", "The top's height is $f(0)=0$: the local maximum $0$.", "顶点的高度是$f(0)=0$——极大值$0$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.8, 0.9], 6.5, 34);
    k.table();
    const f = x => x * x * x - 3 * x * x, fp = x => 3 * x * x - 6 * x;
    const SX = 1.15, SY = 0.28, X = x => (x - 1) * SX, Y = x => 0.62 + (f(x) + 5) * SY;
    /* 받침 널판 — 앞면에 x 눈금 0 · 2 */
    const plankM = k.woodMat('#8a5a32', [60, 34, 16]);
    const plank = new THREE.Mesh(k.rbox(5.4, 0.28, 0.9, 0.05), plankM); plank.position.set(0, 0, 0); plank.castShadow = plank.receiveShadow = true; scene.add(plank);
    [[0, '0'], [2, '2']].forEach(([x, s]) => { const m = mplate(k, s, 0.34, 0.22, { hmax:0.8, bg:'#f3e7cf' }); m.position.set(X(x), 0.14, 0.45 + 0.035); });
    /* 레일 두 줄 · 침목 · 기둥 */
    const steel = k.metal('#a9aab0', 0.28), dark = k.metal('#4a3a2c', 0.5);
    const xs = []; for(let i = 0; i <= 120; i++) xs.push(-1.1 + 4.2 * i / 120);
    [-0.14, 0.14].forEach(z => { const c = new THREE.CatmullRomCurve3(xs.map(x => new THREE.Vector3(X(x), Y(x), z)));
      const m = new THREE.Mesh(new THREE.TubeGeometry(c, 240, 0.028, 10), steel); m.castShadow = true; scene.add(m); });
    const tieM = k.woodMat('#5b3a20', [40, 20, 8]);
    for(let x = -1.05; x <= 3.08; x += 0.14){ const a = Math.atan(SY * fp(x) / SX);
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.38), tieM); t.position.set(X(x), Y(x) - 0.04, 0); t.rotation.z = a; t.castShadow = true; scene.add(t); }
    for(let x = -1.0; x <= 3.05; x += 0.5){ const h = Y(x) - 0.06 - 0.28;
      [-0.14, 0.14].forEach(z => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, h, 10), dark); p.position.set(X(x), 0.28 + h / 2, z); p.castShadow = true; scene.add(p); }); }
    /* 꼭대기(x=0)·골짜기(x=2)의 수평 막대 — 접선 기울기 0 */
    const barMat = () => new THREE.MeshStandardMaterial({ color:'#d9b25a', metalness:0.6, roughness:0.3, emissive:new THREE.Color('#ffcc66'), emissiveIntensity:0.15 });
    const bars = [0, 2].map(x => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.035, 0.035), barMat()); m.position.set(X(x), Y(x) + 0.0, 0.3); m.castShadow = true; scene.add(m); return m; });
    /* 높이 판 — 꼭대기 0, 골짜기 −4 */
    const hp = [[0, '0', -0.36], [2, '−4', -0.36]].map(([x, s, dy]) => { const m = mplate(k, s, 0.5, 0.3, { hmax:0.72, glow:true }); m.position.set(X(x), Y(x) + dy, 0.33); return m; });
    /* 수레 — 꼭대기에 멈춰 있다 */
    const cart = new THREE.Group();
    const cb = new THREE.Mesh(k.rbox(0.44, 0.2, 0.4, 0.06), k.lacquer('#8e1c16')); cb.position.y = 0.06; cb.castShadow = true; cart.add(cb);
    [[-0.14, -0.2], [0.14, -0.2], [-0.14, 0.2], [0.14, 0.2]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 20), dark); w.rotation.x = Math.PI / 2; w.position.set(x, 0.04, z); cart.add(w); });
    scene.add(cart);
    const place = x => { cart.position.set(X(x), Y(x) + 0.02, 0); cart.rotation.z = Math.atan(SY * fp(x) / SX); };
    place(0);
    /* 식 카드 — 앞 책상 */
    const c1 = mcard(k, ['f', { sup:'′' }, '(x) = 3x', { sup:'2' }, ' − 6x'], -1.55, 1.35, { w:2.4, d:0.62, hmax:0.46, glow:true });
    const c2 = mcard(k, '3x(x − 2) = 0  ⇒  x = 0,  2', 1.25, 1.35, { w:3.1, d:0.62, hmax:0.46, glow:true });
    const c3 = mcard(k, 'f(0) = 0', -1.55, 2.1, { w:2.0, d:0.62, hmax:0.46, bg:GREEN, edge:GEDGE, glow:true });
    const c4 = mcard(k, 'f(2) = 8 − 12 = −4', 1.1, 2.1, { w:2.7, d:0.62, hmax:0.46, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: 꼭대기(x=0)에서 잠깐 수평 → 골짜기(x=2)로 내려가 수평 → 다시 꼭대기로 */
    k.onFrame(t => { const p = cyc(t, 10);
      const x = 2 * seg(p, 0.12, 0.38) * (1 - seg(p, 0.58, 0.88));
      place(x);
      bars[0].material.emissiveIntensity = 0.15 + 0.6 * (hop(p, 0.0, 0.14) + hop(p, 0.86, 1.0));
      bars[1].material.emissiveIntensity = 0.15 + 0.6 * hop(p, 0.36, 0.6);
      pop(c1, p, 0.22, 0.36); pop(c2, p, 0.28, 0.4);
      pop(c4, p, 0.42, 0.58); hp[1].material.emissiveIntensity = 0.5 * hop(p, 0.42, 0.58);
      pop(c3, p, 0.72, 0.9); hp[0].material.emissiveIntensity = 0.5 * hop(p, 0.72, 0.9); });
    k.lights({ key:3.0, keyPos:[-4, 7, 6], spotPos:[0, 7, 3], spotAt:[0, 0.6, 0.6], envOpts:{ intensity:0.8 } });
  }},

  /* 곡선과 x축 사이의 넓이 — hook: 포물선 f(x)=−(x−1)(x−4) 가 x=1, 4 에서 x축을 만나고 그 사이에서 볼록 솟음.
     stage ①: 두 교점을 구간으로 ∫₁⁴ f(x)dx. stage ②: F(4)−F(1) = 8/3 − (−11/6) = 9/2.
     그래프 한지 위 포물선과, 그 볼록한 부분을 오려 낸 나무 조각(넓이 9/2), 오른쪽에 식 카드 */
  'M-61': { seed:461, caps:{ P:10, list:[
    [0.0, "$f(x)=-(x-1)(x-4)$는 $x=1$과 $x=4$에서 $x$축과 만나고, 그 사이에서 $x$축 위로 솟아 있습니다.", "$f(x)=-(x-1)(x-4)$ meets the $x$-axis at $x=1$ and $x=4$ and bulges above it in between.", "$f(x)=-(x-1)(x-4)$在$x=1$和$x=4$处与$x$轴相交，中间部分鼓在$x$轴上方。"],
    [0.26, "그 넓이는 두 교점을 구간으로 한 정적분 $\\int_{1}^{4}(-x^2+5x-4)\\,dx$입니다.", "That area is the definite integral between the two crossings: $\\int_{1}^{4}(-x^2+5x-4)\\,dx$.", "这块面积就是以两个交点为区间的定积分$\\int_{1}^{4}(-x^2+5x-4)\\,dx$。"],
    [0.5, "$F(x)=-\\dfrac{x^3}{3}+\\dfrac{5x^2}{2}-4x$이면 $F(4)=\\dfrac{8}{3}$, $F(1)=-\\dfrac{11}{6}$입니다.", "With $F(x)=-\\dfrac{x^3}{3}+\\dfrac{5x^2}{2}-4x$, $F(4)=\\dfrac{8}{3}$ and $F(1)=-\\dfrac{11}{6}$.", "$F(x)=-\\dfrac{x^3}{3}+\\dfrac{5x^2}{2}-4x$，则$F(4)=\\dfrac{8}{3}$，$F(1)=-\\dfrac{11}{6}$。"],
    [0.74, "넓이 $=F(4)-F(1)=\\dfrac{8}{3}+\\dfrac{11}{6}=\\dfrac{9}{2}$입니다.", "Area $=F(4)-F(1)=\\dfrac{8}{3}+\\dfrac{11}{6}=\\dfrac{9}{2}$.", "面积$=F(4)-F(1)=\\dfrac{8}{3}+\\dfrac{11}{6}=\\dfrac{9}{2}$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.25, 0, 0.36], 6.6, 70);
    k.table();
    const f = x => -(x - 1) * (x - 4);
    /* 그래프 한지 — x −0.3~5.3, y −2.4~2.7 */
    const PW = 3.6, PD = 3.3, PX = -1.35, PZ = 0.3;
    const CW = 1400, CH = Math.round(1400 * PD / PW), u0 = 150, su = 225, sv = (CH - 170) / 5.2, v0 = 90 + 2.75 * sv;
    const gu = x => u0 + x * su, gv = y => v0 - y * sv;
    const world = (x, y, h) => new THREE.Vector3(PX + (gu(x) / CW - 0.5) * PW, h, PZ + (gv(y) / CH - 0.5) * PD);
    k.paper(PW, PD, PX, PZ, 0, (g, w, h, ink) => {
      g.save(); g.strokeStyle = g.fillStyle = 'rgba(40,28,18,.85)'; g.lineWidth = 6; g.lineCap = 'round';
      g.beginPath(); g.moveTo(u0 - 60, v0); g.lineTo(gu(5.3), v0); g.moveTo(u0, gv(-2.4)); g.lineTo(u0, gv(2.6)); g.stroke();
      [[gu(5.3) + 26, v0, 0], [u0, gv(2.6) - 26, -Math.PI / 2]].forEach(([x, y, a]) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(0, 0); g.lineTo(-34, -15); g.lineTo(-34, 15); g.closePath(); g.fill(); g.restore(); });
      g.lineWidth = 5; [1, 4].forEach(x => { g.beginPath(); g.moveTo(gu(x), v0 - 14); g.lineTo(gu(x), v0 + 14); g.stroke(); });
      g.strokeStyle = '#8e2a12'; g.lineWidth = 11; g.beginPath();
      for(let i = 0; i <= 100; i++){ const x = 0.35 + 4.3 * i / 100; i ? g.lineTo(gu(x), gv(f(x))) : g.moveTo(gu(x), gv(f(x))); } g.stroke();
      g.restore();
      ink(g, '1', gu(1) + 52, v0 + 64, 80); ink(g, '4', gu(4) - 52, v0 + 64, 80); ink(g, 'O', u0 - 50, v0 + 56, 66);
      ink(g, 'x', gu(5.3) + 16, v0 + 64, 76); ink(g, 'y', u0 - 56, gv(2.6), 76);
    });
    /* 볼록한 부분을 오려 낸 나무 조각 */
    const shape = new THREE.Shape(), N = 60;
    for(let i = 0; i <= N; i++){ const x = 1 + 3 * i / N, p = world(x, f(x), 0); i ? shape.lineTo(p.x, -p.z) : shape.moveTo(p.x, -p.z); }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth:0.07, bevelEnabled:true, bevelThickness:0.012, bevelSize:0.012, bevelSegments:2 });
    geo.rotateX(-Math.PI / 2);
    const piece = new THREE.Group();
    const slab = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color:'#6f9a6a', roughness:0.35, clearcoat:0.6, emissive:new THREE.Color('#ffd89a'), emissiveIntensity:0 }));
    slab.castShadow = slab.receiveShadow = true; piece.add(slab);
    const mid = world(2.5, 0.95, 0);
    const tag = mcard(k, [{ n:'9', d:'2' }], mid.x, mid.z, { w:0.5, d:0.52, h:0.02, y:0.1, hmax:0.4 });
    scene.remove(tag); piece.add(tag); piece.position.y = 0.035; scene.add(piece);
    /* 식 카드 */
    const X = 2.0;
    const c1 = mcard(k, [{ int:['1', '4'] }, ' (−x', { sup:'2' }, ' + 5x − 4) dx'], X, -1.08, { w:2.5, d:0.9, hmax:0.3, glow:true });
    const c2 = mcard(k, ['F(x) = −', { n:['x', { sup:'3' }], d:'3' }, ' + ', { n:['5x', { sup:'2' }], d:'2' }, ' − 4x'], X, -0.06, { w:2.5, d:0.9, hmax:0.34, glow:true });
    const c3 = mcard(k, ['F(4) = ', { n:'8', d:'3' }, ',   F(1) = −', { n:'11', d:'6' }], X, 0.96, { w:2.5, d:0.9, hmax:0.34, glow:true });
    const c4 = mcard(k, ['F(4) − F(1) = ', { n:'9', d:'2' }], X, 1.98, { w:2.5, d:0.9, hmax:0.36, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: 두 교점 → 정적분 카드 → 원시함수 → 오려 낸 조각이 떠올라 빛나며 9/2 → 제자리 */
    k.onFrame(t => { const p = cyc(t, 10);
      pop(c1, p, 0.24, 0.42); pop(c2, p, 0.48, 0.62); pop(c3, p, 0.56, 0.72);
      piece.position.y = 0.035 + 0.3 * hop(p, 0.72, 0.98); slab.material.emissiveIntensity = 0.35 * hop(p, 0.72, 0.98);
      pop(c4, p, 0.74, 0.96); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[-0.5, 7, 2], spotAt:[-0.3, 0, 0.2], envOpts:{ intensity:0.7 } });
  }},

  /* 속도와 거리 — hook: 자동차의 위치 s(t), 그 순간의 속도 = s'(t)(미분이 속도계). history: 뉴턴, 운동의 수학.
     stage ①: s(t)=t²+3t → s'(t)=2t+3 → s'(2)=7. stage ②: v(t)=4t+2 → ∫₀³ v dt = S(3)−S(0) = 24.
     위치 눈금자(t=0,1,2,3 에서 0·4·10·18) 위의 장난감 자동차 · 속도계(7) · 앞에 식 카드 */
  'M-62': { seed:462, caps:{ P:10, list:[
    [0.0, "자동차의 위치는 $s(t)=t^2+3t$입니다. $t=0,1,2,3$일 때 위치는 $0,4,10,18$입니다.", "The car's position is $s(t)=t^2+3t$: at $t=0,1,2,3$ it is at $0,4,10,18$.", "汽车的位置是$s(t)=t^2+3t$。$t=0,1,2,3$时位置是$0,4,10,18$。"],
    [0.3, "순간 속도는 위치의 도함수입니다: $s'(t)=2t+3$이므로 $s'(2)=2\\times 2+3=7$입니다.", "The instant speed is the derivative of position: $s'(t)=2t+3$, so $s'(2)=2\\times 2+3=7$.", "瞬时速度是位置的导数：$s'(t)=2t+3$，所以$s'(2)=2\\times 2+3=7$。"],
    [0.6, "거꾸로 속도 $v(t)=4t+2$를 적분하면 이동 거리가 나옵니다.", "Going backwards, integrate the speed $v(t)=4t+2$ to get the distance.", "反过来，把速度$v(t)=4t+2$积分就得到移动距离。"],
    [0.8, "$\\int_{0}^{3}(4t+2)\\,dt=(18+6)-0=24$입니다.", "$\\int_{0}^{3}(4t+2)\\,dt=(18+6)-0=24$.", "$\\int_{0}^{3}(4t+2)\\,dt=(18+6)-0=24$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.05, 0.2, 0.2], 6.6, 46);
    k.table();
    const s = t => t * t + 3 * t, sx = v => -2.55 + v * 0.29;
    /* 위치 눈금자 — 뒤쪽 절반은 길, 앞쪽 절반에 눈금과 수(0·4·10·18)와 t */
    const RW = 6.0, RD = 1.3, RZ = -0.55;
    const tex = k.canvasTex(2048, Math.round(2048 * RD / RW), (g, w, h) => {
      g.fillStyle = '#efe2c4'; g.fillRect(0, 0, w, h);
      const px = v => (sx(v) / RW + 0.5) * w;
      g.fillStyle = '#6d6a64'; g.fillRect(0, h * 0.06, w, h * 0.4);
      g.strokeStyle = '#efe2c4'; g.lineWidth = 6; g.setLineDash([40, 30]); g.beginPath(); g.moveTo(0, h * 0.26); g.lineTo(w, h * 0.26); g.stroke(); g.setLineDash([]);
      g.strokeStyle = g.fillStyle = '#2b2118'; g.textBaseline = 'middle';
      for(let v = 0; v <= 18; v++){ const big = [0, 4, 10, 18].includes(v); g.lineWidth = big ? 7 : 3; g.beginPath(); g.moveTo(px(v), h * 0.47); g.lineTo(px(v), h * (big ? 0.6 : 0.54)); g.stroke(); }
      [0, 1, 2, 3].forEach(t => { k.mathText(g, String(s(t)), px(s(t)), h * 0.71, 78, {}); g.fillStyle = BLUE; k.mathText(g, 't = ' + t, px(s(t)), h * 0.88, 60, {}); g.fillStyle = '#2b2118'; });
    });
    const ruler = new THREE.Group();
    const rb = new THREE.Mesh(k.rbox(RW, 0.1, RD, 0.05), k.woodMat('#c89a62')); rb.castShadow = rb.receiveShadow = true; ruler.add(rb);
    const rt = new THREE.Mesh(new THREE.PlaneGeometry(RW * 0.985, RD * 0.95), new THREE.MeshStandardMaterial({ map:tex, roughness:0.8 }));
    rt.rotation.x = -Math.PI / 2; rt.position.y = 0.102; rt.receiveShadow = true; ruler.add(rt);
    ruler.position.set(0, 0, RZ); scene.add(ruler);
    /* 장난감 자동차 — t=2, 위치 10 */
    const car = new THREE.Group();
    const bodyM = k.lacquer('#2f5f8f');
    const cb = new THREE.Mesh(k.rbox(0.56, 0.14, 0.3, 0.06), bodyM); cb.position.y = 0.06; car.add(cb);
    const cab = new THREE.Mesh(k.rbox(0.28, 0.12, 0.26, 0.06), bodyM); cab.position.set(-0.04, 0.19, 0); car.add(cab);
    const win = new THREE.Mesh(k.rbox(0.29, 0.07, 0.27, 0.03), new THREE.MeshPhysicalMaterial({ color:'#1c2530', roughness:0.1, clearcoat:1 })); win.position.set(-0.04, 0.22, 0); car.add(win);
    const wheels = [];
    [[-0.17, -0.16], [0.17, -0.16], [-0.17, 0.16], [0.17, 0.16]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.05, 20), k.plastic('#1b1b1b', 0.6)); w.rotation.x = Math.PI / 2; w.position.set(x, 0.065, z); car.add(w); wheels.push(w); });
    car.traverse(m => { if(m.isMesh){ m.castShadow = m.receiveShadow = true; } });
    const CY = 0.105, CZ = RZ - RD * 0.5 + RD * 0.95 * 0.26 + 0.02;
    car.position.set(sx(10), CY, CZ - 0.04); scene.add(car);
    /* 속도계 — 0~10, 바늘 7 */
    const dial = new THREE.Group();
    const R = 0.6;
    const house = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.06, R + 0.06, 0.1, 48), k.metal('#3b3024', 0.4)); house.rotation.x = Math.PI / 2; dial.add(house);
    const ftex = k.canvasTex(1024, 1024, (g, w, h) => {
      g.fillStyle = '#f3e7cf'; g.beginPath(); g.arc(512, 512, 512, 0, Math.PI * 2); g.fill();
      g.strokeStyle = g.fillStyle = '#2b2118'; g.textBaseline = 'middle';
      for(let v = 0; v <= 10; v++){ const a = (210 - v * 24) * Math.PI / 180, c = Math.cos(a), sn = -Math.sin(a);
        g.lineWidth = v % 2 ? 6 : 12; g.beginPath(); g.moveTo(512 + c * 470, 512 + sn * 470); g.lineTo(512 + c * (v % 2 ? 420 : 390), 512 + sn * (v % 2 ? 420 : 390)); g.stroke();
        if(v % 2 === 0 || v === 7){ g.fillStyle = v === 7 ? RUST : '#2b2118'; k.mathText(g, String(v), 512 + c * 318, 512 + sn * 318, v === 7 ? 150 : 120, {}); g.fillStyle = '#2b2118'; } }
    });
    const face = new THREE.Mesh(new THREE.CircleGeometry(R, 64), new THREE.MeshStandardMaterial({ map:ftex, roughness:0.6 })); face.position.z = 0.052; dial.add(face);
    const needle = new THREE.Group();
    const nm = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.035, 0.012), k.lacquer('#9a3d12')); nm.position.x = 0.115; needle.add(nm); needle.position.z = 0.075; dial.add(needle);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 24), k.metal('#b8914a', 0.3)); hub.rotation.x = Math.PI / 2; hub.position.z = 0.08; dial.add(hub);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.5, 16), k.metal('#3b3024', 0.4)); post.position.set(0, -0.66, -0.05); dial.add(post);
    dial.traverse(m => { if(m.isMesh) m.castShadow = true; });
    dial.position.set(2.3, 0.84, -1.5); dial.rotation.set(-0.35, -0.22, 0); scene.add(dial);
    const setV = v => { needle.rotation.z = (210 - v * 24) * Math.PI / 180; };
    setV(7);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.06, 32), k.woodMat('#5b3a20', [40, 20, 8])); base.position.set(2.3, 0.03, -1.5); base.castShadow = base.receiveShadow = true; scene.add(base);
    /* 식 카드 */
    const c0 = mcard(k, ['s(t) = t', { sup:'2' }, ' + 3t'], -2.0, 0.72, { w:1.9, d:0.62, hmax:0.46, glow:true });
    const c1 = mcard(k, ['s', { sup:'′' }, '(t) = 2t + 3'], 0.0, 0.72, { w:1.9, d:0.62, hmax:0.46, glow:true });
    const c2 = mcard(k, ['s', { sup:'′' }, '(2) = 7'], 2.0, 0.72, { w:1.8, d:0.62, hmax:0.46, bg:GREEN, edge:GEDGE, glow:true });
    const c3 = mcard(k, 'v(t) = 4t + 2', -1.6, 1.52, { w:2.4, d:0.78, hmax:0.4, glow:true });
    const c4 = mcard(k, [{ int:['0', '3'] }, ' (4t + 2) dt = 24'], 1.35, 1.52, { w:3.0, d:0.78, hmax:0.34, bg:GREEN, edge:GEDGE, glow:true });
    /* 움직임: t=2(위치 10, 속도 7)에서 → t=3(18)까지 달리고 → 0 으로 되돌아가 → s(t) 대로 다시 달려 t=2 에 선다 */
    const X0 = car.position.x;
    k.onFrame(t => { const p = cyc(t, 10);
      let x, v;
      if(p < 0.12){ x = sx(10); v = 7; }
      else if(p < 0.22){ const tt = 2 + (p - 0.12) / 0.1; x = sx(s(tt)); v = 2 * tt + 3; }
      else if(p < 0.36){ const u = seg(p, 0.22, 0.36); x = sx(18) + (sx(0) - sx(18)) * u; v = 9 * (1 - seg(p, 0.22, 0.28)); }
      else if(p < 0.66){ const tt = 2 * (p - 0.36) / 0.3; x = sx(s(tt)); v = (2 * tt + 3) * seg(p, 0.36, 0.4); }
      else { x = sx(10); v = 7; }
      car.position.x = x; setV(v);
      wheels.forEach(w => { w.rotation.y = -(x - X0) / 0.065; });
      pop(c0, p, 0.02, 0.16); pop(c1, p, 0.3, 0.46); pop(c2, p, 0.4, 0.56); pop(c3, p, 0.62, 0.78); pop(c4, p, 0.8, 0.97); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0], envOpts:{ intensity:0.8 } });
  }},

};
