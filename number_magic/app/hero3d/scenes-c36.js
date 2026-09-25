/* C36 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

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
/* 카드 뒤집기 — rz 로 반 바퀴. 뒤집힌 카드는 두께 H 만큼 올린다 */
const flipPose = (g, u, H, lift, y0) => { g.rotation.z = -Math.PI * u; g.position.y = (y0 || 0) + H * u + (lift || 0.55) * Math.sin(Math.PI * u); };
/* 연필 — 육각 몸통 + 깎은 나무 + 흑연 */
function pencil(k, x, z, rotY){
  const { THREE, scene } = k;
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 6), k.lacquer('#d9a02a')); body.rotation.z = Math.PI / 2; g.add(body);
  const wood = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 6, 1, true), k.woodMat('#e6c79a')); wood.rotation.z = -Math.PI / 2; wood.position.x = 0.85; g.add(wood);
  const lead = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.07, 12), new THREE.MeshStandardMaterial({ color:'#2a2a2a', roughness:0.4, metalness:0.3 })); lead.rotation.z = -Math.PI / 2; lead.position.x = 0.965; g.add(lead);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.063, 0.063, 0.12, 16), k.metal('#b9a26a', 0.3)); band.rotation.z = Math.PI / 2; band.position.x = -0.8; g.add(band);
  const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.12, 16), new THREE.MeshStandardMaterial({ color:'#d98a8a', roughness:0.8 })); eraser.rotation.z = Math.PI / 2; eraser.position.x = -0.92; g.add(eraser);
  g.children.forEach(m => { m.castShadow = m.receiveShadow = true; });
  g.position.set(x, 0.08, z); g.rotation.y = rotY || 0; scene.add(g); return g;
}
/* 넓이 타일(대수 막대) — 색 판 + 윗면 수식 */
function atile(k, parts, x, z, w, d, color, o){
  o = o || {};
  const { THREE, scene } = k;
  const h = o.h || 0.1, grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, 0.03), k.plastic(color, 0.45)); body.castShadow = body.receiveShadow = true; grp.add(body);
  if(parts){ const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, d * 0.9), new THREE.MeshStandardMaterial({ map:mtex(k, parts, 512, Math.round(512 * d / w), { bg:color, color:o.ink || '#1f1a14', hmax:o.hmax || 0.45, fill:0.7 }), roughness:0.5 }));
    top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top); }
  grp.position.set(x, 0.03, z); scene.add(grp); return grp;
}
/* 한지 위 좌표(월드 x,z) → 캔버스 좌표 */
const onPaper = (PW, PD, PX, PZ, w, h) => [x => (x - PX + PW / 2) / PW * w, z => (z - PZ + PD / 2) / PD * h];
/* 점토판 — 흙빛 판에 수식을 눌러 새긴 것처럼(어두운 홈 + 아래쪽 밝은 테) */
function clayTablet(k, parts, x, z, w, d, rot){
  const { THREE, scene } = k;
  const clay = k.canvasTex(512, 512, (g, W, H) => { g.fillStyle = '#8f6a4c'; g.fillRect(0, 0, W, H);
    for(let i = 0; i < 5000; i++){ g.fillStyle = `rgba(${80 + k.rnd() * 60},${55 + k.rnd() * 40},${30 + k.rnd() * 20},${k.rnd() * 0.18})`; g.fillRect(k.rnd() * W, k.rnd() * H, 1 + k.rnd() * 3, 1 + k.rnd() * 3); } });
  const h = 0.16, grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, 0.12), new THREE.MeshStandardMaterial({ map:clay, roughness:0.95 })); body.castShadow = body.receiveShadow = true; grp.add(body);
  const ph = Math.round(1024 * d / w);
  const tex = k.canvasTex(1024, ph, (g, W, H) => {
    g.fillStyle = '#8f6a4c'; g.fillRect(0, 0, W, H);
    for(let i = 0; i < 9000; i++){ g.fillStyle = `rgba(${80 + k.rnd() * 60},${55 + k.rnd() * 40},${30 + k.rnd() * 20},${k.rnd() * 0.2})`; g.fillRect(k.rnd() * W, k.rnd() * H, 1 + k.rnd() * 3, 1 + k.rnd() * 3); }
    for(let i = 0; i < 14; i++){ g.strokeStyle = `rgba(70,45,25,${0.15 + k.rnd() * 0.2})`; g.lineWidth = 1 + k.rnd() * 2; g.beginPath(); const a = k.rnd() * W, b = k.rnd() * H; g.moveTo(a, b); g.lineTo(a + (k.rnd() - 0.5) * 160, b + (k.rnd() - 0.5) * 60); g.stroke(); }
    g.textBaseline = 'middle';
    let fs = H * 0.46; const tw = mdraw(k, g, parts, 0, 0, fs, false); if(tw > W * 0.82) fs *= W * 0.82 / tw;
    const X = (W - mdraw(k, g, parts, 0, 0, fs, false)) / 2;
    g.fillStyle = g.strokeStyle = 'rgba(214,170,120,.6)'; mdraw(k, g, parts, X + 3, H / 2 + 4, fs, true);
    g.fillStyle = g.strokeStyle = '#3a2010'; mdraw(k, g, parts, X, H / 2, fs, true);
  });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.9), new THREE.MeshStandardMaterial({ map:tex, roughness:0.95 }));
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.003; top.receiveShadow = true; grp.add(top);
  grp.position.set(x, 0.02, z); grp.rotation.y = rot || 0; scene.add(grp); return grp;
}
/* 압정·구슬 */
function pin(k, x, z, color){
  const { THREE, scene } = k;
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), new THREE.MeshPhysicalMaterial({ color, roughness:0.25, clearcoat:1 })); head.position.y = 0.12;
  const nd = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), k.metal('#c9c3b5', 0.25)); nd.position.y = 0.05;
  [head, nd].forEach(m => { m.castShadow = true; g.add(m); });
  g.position.set(x, 0.02, z); scene.add(g); return g;
}
function bead(k, color, r){
  const m = new k.THREE.Mesh(new k.THREE.SphereGeometry(r || 0.1, 32, 20), new k.THREE.MeshPhysicalMaterial({ color, roughness:0.22, clearcoat:1 }));
  m.castShadow = true; k.scene.add(m); return m;
}
const R2 = { r:'2' };

export const SCENES_C36 = {

  /* 분모의 유리화 — hook: 1/√2 를 계산기 없이 어림. history: 손으로 근삿값 계산(근호를 분자로 옮기면 쉬움).
     stage ①: 1/√2 = (1×√2)/(√2×√2) = √2/2 */
  'M-18': { seed:361, caps:{ P:8, list:[
    [0.0, "$\\dfrac{1}{\\sqrt{2}}$은 분모에 근호가 있어 크기를 어림하기 어렵습니다.", "$\\dfrac{1}{\\sqrt{2}}$ has a root in the denominator, so its size is hard to judge.", "$\\dfrac{1}{\\sqrt{2}}$的分母有根号，很难估计大小。"],
    [0.12, "분자와 분모에 똑같이 $\\sqrt{2}$를 곱합니다. 값은 그대로입니다.", "Multiply top and bottom by the same $\\sqrt{2}$: the value stays the same.", "分子分母同乘$\\sqrt{2}$，值不变。"],
    [0.38, "$\\sqrt{2}\\times\\sqrt{2}=2$이므로 $\\dfrac{1}{\\sqrt{2}}=\\dfrac{\\sqrt{2}}{2}$입니다.", "Since $\\sqrt{2}\\times\\sqrt{2}=2$, $\\dfrac{1}{\\sqrt{2}}=\\dfrac{\\sqrt{2}}{2}$.", "因为$\\sqrt{2}\\times\\sqrt{2}=2$，所以$\\dfrac{1}{\\sqrt{2}}=\\dfrac{\\sqrt{2}}{2}$。"],
    [0.64, "이제 손으로도 쉽습니다: $1.414\\div 2=0.707$", "Now it is easy by hand: $1.414\\div 2=0.707$", "现在手算也容易了：$1.414\\div 2=0.707$"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0.1, 0.2], 5.7, 66);
    k.table();
    k.paper(6.3, 3.5, 0, 0.35, 0.01, (g, w, h) => {
      g.fillStyle = g.strokeStyle = 'rgba(28,20,14,.9)'; g.textBaseline = 'middle';
      const fs = h * 0.085;
      const W1 = mdraw(k, g, [R2, ' ≈ 1.414'], 0, 0, fs, false);
      mdraw(k, g, [R2, ' ≈ 1.414'], w * 0.06, h * 0.74, fs, true);
      mdraw(k, g, ['1.414 ÷ 2 = 0.707'], w * 0.06 + W1 + w * 0.1, h * 0.74, fs, true);
    });
    /* 식 카드: 1/√2 × √2/√2 = √2/2 */
    const Z = -0.2, CO = { d:1.25, h:0.04, hmax:0.4 };
    const c1 = mcard(k, [{ n:['1'], d:[R2] }], -2.3, Z, Object.assign({ w:0.95 }, CO));
    mcard(k, ['×'], -1.3, Z, Object.assign({ w:0.6, d:0.6, hmax:0.5 }));
    const c2 = mcard(k, [{ n:[R2], d:[R2] }], -0.28, Z, Object.assign({ w:1.05, bg:'#f3d9b0', edge:'#e2c59a' }, CO));
    mcard(k, ['='], 0.74, Z, Object.assign({ w:0.6, d:0.6, hmax:0.5 }));
    const c3 = mcard(k, [{ n:[R2], d:['2'] }], 1.9, Z, Object.assign({ w:1.05, bg:'#dfe7d0', edge:'#c9d6b5', glow:true }, CO));
    const pen = pencil(k, 1.75, 1.62, 0.12);
    /* 움직임: √2/√2 카드가 들렸다가 1/√2 에 곱해지듯 다가갔다 돌아오고 → 결과 √2/2 가 들리며 빛나고 → 연필이 어림 계산 줄을 따라 쓴다 */
    const x2 = c2.position.x, y2 = c2.position.y, y3 = c3.position.y, P0 = pen.position.clone();
    k.onFrame(t => { const p = cyc(t, 8);
      const a = seg(p, 0.1, 0.24) * (1 - seg(p, 0.3, 0.42));
      c2.position.x = x2 - 0.75 * a; c2.position.y = y2 + 0.5 * hop(p, 0.1, 0.42); c2.rotation.z = 0.12 * a;
      c1.position.y = 0.035 + 0.12 * hop(p, 0.2, 0.34);
      c3.position.y = y3 + 0.35 * hop(p, 0.42, 0.62); c3.userData.mat.emissiveIntensity = 0.8 * hop(p, 0.42, 0.62);
      const w = seg(p, 0.66, 0.84) * (1 - seg(p, 0.88, 0.98));
      pen.position.x = P0.x - 2.6 * w; pen.position.z = P0.z + 0.1 * Math.sin(p * 90) * hop(p, 0.66, 0.84) * 0.5;
      pen.position.y = P0.y + 0.05 * hop(p, 0.62, 0.66) + 0.05 * hop(p, 0.84, 0.9); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

  /* 곱셈공식의 전개 — history: 유클리드 『원론』의 넓이 그림(정사각형·직사각형). hook: 두 수를 짝지어 다루기.
     stage ①: (x+2)(x+3) = x² + (2+3)x + 2×3 = x² + 5x + 6 */
  'M-19': { seed:362, caps:{ P:9, list:[
    [0.0, "$(x+2)(x+3)$은 가로 $x+3$, 세로 $x+2$인 직사각형의 넓이입니다.", "$(x+2)(x+3)$ is the area of a rectangle $x+3$ wide and $x+2$ deep.", "$(x+2)(x+3)$是长$x+3$、宽$x+2$的长方形的面积。"],
    [0.12, "긴 막대 $x$는 $2+3=5$개 — 가운데 항 $5x$입니다.", "There are $2+3=5$ long strips of $x$: the middle term $5x$.", "长条$x$有$2+3=5$根——中间项$5x$。"],
    [0.4, "작은 정사각형은 $2\\times 3=6$개 — 마지막 항 $6$입니다.", "There are $2\\times 3=6$ small squares: the last term $6$.", "小正方形有$2\\times 3=6$个——最后一项$6$。"],
    [0.66, "그래서 $(x+2)(x+3)=x^2+5x+6$입니다. 유클리드도 이렇게 넓이로 보았습니다.", "So $(x+2)(x+3)=x^2+5x+6$. Euclid saw it the same way, as area.", "所以$(x+2)(x+3)=x^2+5x+6$。欧几里得也是这样用面积来看的。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0.05, 0.1, 0.35], 6.4, 64);
    k.table();
    const PW = 6.8, PD = 3.9, PX = 0, PZ = 0.35;
    const A = 1.5, U = 0.42, G = 0.035, X0 = -2.6, Z0 = -0.75;     /* x 한 변 A, 1 한 변 U, 타일 사이 G */
    const cx = [X0 + A / 2, ...[0, 1, 2].map(i => X0 + A + G + U / 2 + i * (U + G))];
    const cz = [Z0 + A / 2, ...[0, 1].map(i => Z0 + A + G + U / 2 + i * (U + G))];
    k.paper(PW, PD, PX, PZ, 0, (g, w, h, ink) => {
      const [PXf, PZf] = onPaper(PW, PD, PX, PZ, w, h), fs = h * 0.07;
      ink(g, 'x', PXf(cx[0]), PZf(Z0 - 0.2), fs); [1, 2, 3].forEach(i => ink(g, '1', PXf(cx[i]), PZf(Z0 - 0.2), fs * 0.8));
      ink(g, 'x', PXf(X0 - 0.2), PZf(cz[0]), fs); [1, 2].forEach(i => ink(g, '1', PXf(X0 - 0.2), PZf(cz[i]), fs * 0.8));
    });
    const BLUE = '#8fb3d9', GREEN = '#a9cf8f', YEL = '#f0cf6a';
    atile(k, ['x', { sup:'2' }], cx[0], cz[0], A, A, BLUE, { hmax:0.3 });
    const vs = [1, 2, 3].map(i => atile(k, ['x'], cx[i], cz[0], U, A, GREEN, { hmax:0.2 }));
    const hs = [1, 2].map(j => atile(k, ['x'], cx[0], cz[j], A, U, GREEN, { hmax:0.5 }));
    const us = []; [1, 2].forEach(j => [1, 2, 3].forEach(i => us.push(atile(k, ['1'], cx[i], cz[j], U, U, YEL, { hmax:0.45 }))));
    /* 식 카드 */
    mcard(k, ['(x + 2)(x + 3)'], 1.85, -0.55, { w:2.3, d:0.72, hmax:0.46 });
    mcard(k, ['= x', { sup:'2' }, ' + 5x + 6'], 1.85, 0.55, { w:2.3, d:0.72, hmax:0.46, bg:'#dfe7d0', edge:'#c9d6b5' });
    mcard(k, ['2 + 3 = 5'], 1.2, 1.55, { w:1.15, d:0.5, hmax:0.46, bg:'#e3eed8', edge:'#c9d6b5' });
    mcard(k, ['2 × 3 = 6'], 2.5, 1.55, { w:1.15, d:0.5, hmax:0.46, bg:'#f6e8b8', edge:'#e2cf8f' });
    /* 움직임: 긴 막대 5개(세로 3 · 가로 2)가 차례로 들렸다 놓이고 → 작은 정사각형 6개가 함께 들렸다 놓인다 — 넓이를 센다 */
    const all = [...vs, ...hs, ...us], y0 = all.map(g => g.position.y);
    k.onFrame(t => { const p = cyc(t, 9);
      [...vs, ...hs].forEach((g, i) => { g.position.y = y0[i] + 0.3 * hop(p, 0.12 + i * 0.05, 0.22 + i * 0.05); });
      us.forEach((g, i) => { g.position.y = y0[5 + i] + 0.3 * hop(p, 0.42 + (i % 3) * 0.02, 0.56 + (i % 3) * 0.02); }); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

  /* 인수분해 기초 — hook: x²+5x+6 을 곱셈식으로 되돌리기(곱셈공식을 거꾸로 읽기).
     stage ①: x²+7x+12 — 곱해서 12인 짝을 먼저 나열하고, 그중 더해서 7인 것: 3과 4 */
  'M-20': { seed:363, caps:{ P:9, list:[
    [0.0, "$x^2+7x+12$를 되돌리려면 더해서 $7$, 곱해서 $12$인 두 수를 찾습니다.", "To undo $x^2+7x+12$, find two numbers that add to $7$ and multiply to $12$.", "要还原$x^2+7x+12$，找相加得$7$、相乘得$12$的两个数。"],
    [0.1, "곱해서 $12$인 짝부터 나열합니다: $1\\times 12$, $2\\times 6$, $3\\times 4$", "First list the pairs that multiply to $12$: $1\\times 12$, $2\\times 6$, $3\\times 4$", "先列出相乘得$12$的数对：$1\\times 12$，$2\\times 6$，$3\\times 4$"],
    [0.44, "그중 더해서 $7$인 짝은 $3+4=7$뿐입니다.", "Only $3+4=7$ adds up to $7$.", "其中相加得$7$的只有$3+4=7$。"],
    [0.66, "그래서 $x^2+7x+12=(x+3)(x+4)$ — 곱셈공식을 거꾸로 읽었습니다.", "So $x^2+7x+12=(x+3)(x+4)$: the formula read backward.", "所以$x^2+7x+12=(x+3)(x+4)$——把乘法公式反着读。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0.1, 0.35], 6.3, 66);
    k.table();
    k.paper(6.6, 3.8, 0, 0.35, -0.01);
    mcard(k, ['x', { sup:'2' }, ' + 7x + 12'], -1.45, -0.75, { w:2.5, d:0.78, hmax:0.46 });
    const res = mcard(k, ['= (x + 3)(x + 4)'], 1.45, -0.75, { w:2.7, d:0.78, hmax:0.46, bg:'#dfe7d0', edge:'#c9d6b5', glow:true });
    /* 곱해서 12인 짝(나무 블록)과, 그 짝의 합(카드) */
    const XS = [-2.0, 0, 2.0], PR = ['1 × 12', '2 × 6', '3 × 4'], SM = ['1 + 12 = 13', '2 + 6 = 8', '3 + 4 = 7'];
    const blocks = XS.map((x, i) => k.tile(PR[i], x, 0.45, { w:1.45, d:0.72, h:0.2, size:150, grain:true, wood:'#d9b27c', bg:i === 2 ? '#cfe3ae' : '#f3e7cf' }));
    const sums = XS.map((x, i) => mcard(k, [SM[i]], x, 1.4, i === 2 ? { w:1.55, d:0.56, hmax:0.46, bg:'#cfe3ae', edge:'#b7cf92', glow:true } : { w:1.55, d:0.56, hmax:0.46 }));
    /* 움직임: 짝 블록이 1×12 → 2×6 → 3×4 차례로 들리며 합을 확인하고, 3+4=7 이 빛나며 높이 들리고 → 결과 (x+3)(x+4) 가 빛난다 */
    const by = blocks.map(b => b.position.y), sy = sums.map(c => c.position.y), ry = res.position.y;
    k.onFrame(t => { const p = cyc(t, 9);
      blocks.forEach((b, i) => { const a = 0.1 + i * 0.12; b.position.y = by[i] + (i === 2 ? 0.45 : 0.3) * hop(p, a, a + (i === 2 ? 0.3 : 0.12)); });
      sums.forEach((c, i) => { const a = 0.14 + i * 0.12; c.position.y = sy[i] + 0.15 * hop(p, a, a + 0.1); });
      sums[2].userData.mat.emissiveIntensity = 0.8 * hop(p, 0.44, 0.62);
      res.position.y = ry + 0.3 * hop(p, 0.66, 0.86); res.userData.mat.emissiveIntensity = 0.8 * hop(p, 0.66, 0.86); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

  /* 이차방정식 풀이 — hook: 두 수를 곱해 0 이면 적어도 하나는 0. history: 4000년 전 바빌로니아 점토판.
     stage ①: x²−5x+6=0 → (x−2)(x−3)=0 → x=2 또는 x=3 */
  'M-66': { seed:366, caps:{ P:9, list:[
    [0.0, "$x^2-5x+6=0$은 $(x-2)(x-3)=0$입니다. 곱이 $0$이면 둘 중 하나는 $0$입니다.", "$x^2-5x+6=0$ is $(x-2)(x-3)=0$. If a product is $0$, one factor is $0$.", "$x^2-5x+6=0$就是$(x-2)(x-3)=0$。乘积为$0$，必有一个因式为$0$。"],
    [0.12, "$x=2$이면 $x-2=0$ — 곱이 $0$이 됩니다.", "At $x=2$, $x-2=0$, so the product is $0$.", "$x=2$时$x-2=0$，乘积为$0$。"],
    [0.5, "$x=3$이면 $x-3=0$ — 이번에도 곱이 $0$입니다.", "At $x=3$, $x-3=0$: the product is $0$ again.", "$x=3$时$x-3=0$，乘积也为$0$。"],
    [0.82, "그래서 근은 $x=2$와 $x=3$, 두 개입니다. 옛 점토판은 답을 하나만 찾았습니다.", "So there are two roots, $x=2$ and $x=3$. The old clay tablets found only one answer.", "所以有两个根：$x=2$和$x=3$。古老的泥板只找一个答案。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0.1, 0.12], 5.8, 66);
    k.table();
    const PW = 6.9, PD = 3.5, PX = 0, PZ = 0.2, LZ = 1.0, X = n => -2.25 + 0.9 * n;   /* 수직선: 1 칸 = 1 */
    k.paper(PW, PD, PX, PZ, 0, (g, w, h, ink) => {
      const [fx, fz] = onPaper(PW, PD, PX, PZ, w, h), y = fz(LZ);
      g.strokeStyle = 'rgba(28,20,14,.85)'; g.lineWidth = 7; g.beginPath(); g.moveTo(fx(X(-0.6)), y); g.lineTo(fx(X(5.6)), y); g.stroke();
      g.beginPath(); g.moveTo(fx(X(5.6)), y); g.lineTo(fx(X(5.6)) - 26, y - 18); g.moveTo(fx(X(5.6)), y); g.lineTo(fx(X(5.6)) - 26, y + 18); g.stroke();
      for(let n = 0; n <= 5; n++){ g.lineWidth = 5; g.beginPath(); g.moveTo(fx(X(n)), y - 22); g.lineTo(fx(X(n)), y + 22); g.stroke(); ink(g, String(n), fx(X(n)), y + 78, 64); }
    });
    clayTablet(k, ['x', { sup:'2' }, ' − 5x + 6 = 0'], -1.75, -0.72, 2.2, 1.0, 0.05);
    const CO = { d:0.95, hmax:0.44 };
    const c2 = mcard(k, ['(x − 2)'], 0.35, -0.72, Object.assign({ w:1.05, back:['0'], backOpts:{ bg:'#cfe3ae' } }, CO));
    const c3 = mcard(k, ['(x − 3)'], 1.5, -0.72, Object.assign({ w:1.05, back:['0'], backOpts:{ bg:'#cfe3ae' } }, CO));
    mcard(k, ['= 0'], 2.45, -0.72, Object.assign({ w:0.72 }, CO));
    pin(k, X(2), LZ - 0.16, '#b3221a'); pin(k, X(3), LZ - 0.16, '#b3221a');
    const r2 = mcard(k, ['x = 2'], X(2), 0.3, { w:0.84, d:0.5, hmax:0.5, bg:'#f3d6cf', edge:'#e2b8ae', glow:true });
    const r3 = mcard(k, ['x = 3'], X(3), 0.3, { w:0.84, d:0.5, hmax:0.5, bg:'#f3d6cf', edge:'#e2b8ae', glow:true });
    const bd = bead(k, '#fff3d6', 0.1);
    /* 움직임: 구슬이 0 에서 2 로 → (x−2) 가 뒤집혀 0 → 3 으로 → (x−3) 이 뒤집혀 0 → 다시 0 으로 */
    bd.position.set(X(0), 0.12, LZ);
    k.onFrame(t => { const p = cyc(t, 9);
      const n = 2 * seg(p, 0.1, 0.28) + seg(p, 0.5, 0.6) - 3 * seg(p, 0.84, 0.98);
      bd.position.set(X(n), 0.12, LZ);
      flipPose(c2, seg(p, 0.28, 0.36) * (1 - seg(p, 0.44, 0.5)), 0.04, 0.45, 0.035);
      flipPose(c3, seg(p, 0.6, 0.68) * (1 - seg(p, 0.76, 0.82)), 0.04, 0.45, 0.035);
      r2.userData.mat.emissiveIntensity = 0.7 * hop(p, 0.26, 0.5); r3.userData.mat.emissiveIntensity = 0.7 * hop(p, 0.58, 0.82); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

  /* 이차방정식의 활용 — hook: 넓이 40, 가로가 세로보다 3 긴 직사각형. 세로 x, 가로 x+3, x(x+3)=40.
     stage ①: x²+3x−40=0 → (x−5)(x+8)=0 → x=5 또는 −8, 길이는 음수가 될 수 없으니 5 */
  'M-77': { seed:377, caps:{ P:9, list:[
    [0.0, "넓이가 $40$이고 가로가 세로보다 $3$ 긴 직사각형: $x(x+3)=40$", "A rectangle of area $40$, $3$ wider than it is deep: $x(x+3)=40$", "面积为$40$、长比宽多$3$的长方形：$x(x+3)=40$"],
    [0.3, "$x^2+3x-40=0$, 곧 $(x-5)(x+8)=0$이라 $x=5$ 또는 $x=-8$입니다.", "$x^2+3x-40=0$ means $(x-5)(x+8)=0$, so $x=5$ or $x=-8$.", "$x^2+3x-40=0$即$(x-5)(x+8)=0$，所以$x=5$或$x=-8$。"],
    [0.5, "길이는 음수가 될 수 없으니 $x=-8$은 버립니다.", "A length cannot be negative, so $x=-8$ is dropped.", "长度不能为负，所以舍去$x=-8$。"],
    [0.66, "세로 $5$, 가로 $8$ — $5\\times 8=40$이 맞습니다.", "Depth $5$, width $8$: $5\\times 8=40$ checks out.", "宽$5$，长$8$——$5\\times 8=40$，正确。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0.1, 0.12], 6.4, 74);
    k.table();
    k.paper(6.9, 3.6, 0, 0.2, 0.01);
    /* 넓이 40 — 한 칸 1 짜리 타일 8 × 5 */
    const U = 0.38, NX = 8, NZ = 5, RX = -1.62, RZ = -0.2;
    const tiles = [];
    for(let j = 0; j < NZ; j++) for(let i = 0; i < NX; i++){
      const tl = atile(k, null, RX + (i - (NX - 1) / 2) * U, RZ + (j - (NZ - 1) / 2) * U, U - 0.03, U - 0.03, (i + j) % 2 ? '#e0a64c' : '#ebbf66', { h:0.08 });
      tl.userData.d = i + j; tiles.push(tl); }
    /* 변의 길이 카드: 세로 x → 5, 가로 x+3 → 8 (뒤집으면 수) */
    const SO = { d:0.5, hmax:0.52, back:['5'], backOpts:{ bg:'#cfe3ae' } };
    const sideZ = mcard(k, ['x'], RX + NX * U / 2 + 0.36, RZ, Object.assign({}, SO, { w:0.5, d:0.62 }));
    const sideX = mcard(k, ['x + 3'], RX, RZ + NZ * U / 2 + 0.36, Object.assign({}, SO, { w:1.1, back:['8'] }));
    /* 식 카드 */
    mcard(k, ['x(x + 3) = 40'], 1.85, -0.9, { w:2.3, d:0.66, hmax:0.46 });
    mcard(k, ['(x − 5)(x + 8) = 0'], 1.85, -0.05, { w:2.3, d:0.66, hmax:0.46 });
    const ok = mcard(k, ['x = 5'], 1.3, 0.85, { w:1.05, d:0.62, hmax:0.46, bg:'#cfe3ae', edge:'#b7cf92', glow:true });
    const no = mcard(k, ['x = −8'], 2.45, 0.85, { w:1.1, d:0.62, hmax:0.46, bg:'#f3d6cf', edge:'#e2b8ae', back:[''], backOpts:{ bg:'#6b5a4a' } });
    /* 움직임: 타일이 한쪽 모서리부터 물결처럼 들렸다 놓이고(넓이 40) → x = −8 카드가 엎어지고(음수 길이는 버림) x = 5 가 빛나고
       → 변 카드가 뒤집혀 5 와 8 → 모두 제자리로 */
    const ty = tiles.map(t => t.position.y);
    k.onFrame(t => { const p = cyc(t, 9);
      tiles.forEach((tl, i) => { const a = 0.04 + tl.userData.d * 0.018; tl.position.y = ty[i] + 0.16 * hop(p, a, a + 0.1); });
      const back = 1 - seg(p, 0.86, 0.94);
      flipPose(no, seg(p, 0.5, 0.58) * back, 0.04, 0.4, 0.035);
      ok.position.y = 0.035 + 0.2 * hop(p, 0.56, 0.72); ok.userData.mat.emissiveIntensity = 0.8 * hop(p, 0.56, 0.72);
      const f = seg(p, 0.66, 0.74) * back; flipPose(sideZ, f, 0.04, 0.35, 0.035); flipPose(sideX, f, 0.04, 0.35, 0.035); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

};
