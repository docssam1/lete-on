/* C37B 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

/* 수식 조각 그리기 — 문자열(mathText), {sup:'2'}(윗첨자), {sub:'1'}(아래첨자), {r:'8'}(근호),
   {bar:'x'}(윗줄 문자), {up:'IQR'}(바로 선 글자), {n:[…], d:[…]}(분수). 너비를 돌려준다(draw=false 면 재기만) */
function mdraw(k, g, parts, x, cy, fs, draw){
  let cx = x;
  parts.forEach(p => {
    if(typeof p === 'string'){ cx += k.mathText(g, p, cx, cy, fs, { align:'left', draw }); return; }
    if(p.up != null){ cx += k.mathText(g, p.up, cx, cy, fs, { align:'left', draw, upright:true }); return; }
    if(p.sup != null){ const w = k.mathText(g, p.sup, cx + fs * 0.03, cy - fs * 0.36, fs * 0.7, { align:'left', draw }); cx += w + fs * 0.04; return; }
    if(p.sub != null){ const w = k.mathText(g, p.sub, cx + fs * 0.01, cy + fs * 0.26, fs * 0.62, { align:'left', draw }); cx += w + fs * 0.04; return; }
    if(p.gk != null){ g.font = `italic 700 ${fs}px ${k.MATH}`; const w = g.measureText(p.gk).width; if(draw !== false){ const ta = g.textAlign; g.textAlign = 'left'; g.fillText(p.gk, cx, cy); g.textAlign = ta; } cx += w + fs * 0.04; return; }
    if(p.bar != null){
      const w = k.mathText(g, p.bar, cx, cy, fs, { align:'left', draw });
      if(draw !== false){ g.save(); g.lineWidth = fs * 0.06; g.beginPath(); g.moveTo(cx + fs * 0.1, cy - fs * 0.5); g.lineTo(cx + w + fs * 0.04, cy - fs * 0.5); g.stroke(); g.restore(); }
      cx += w + fs * 0.02; return;
    }
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
/* 수식 카드 — 얇은 판 윗면에 mtex */
function mcard(k, parts, x, z, o){
  o = o || {};
  const { THREE, scene } = k;
  const w = o.w || 1.0, d = o.d || 0.8, h = o.h || 0.04, pw = 1024, ph = Math.round(1024 * d / w);
  const grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, Math.min(0.04, d * 0.1)), new THREE.MeshStandardMaterial({ color:o.edge || '#e9dcc0', roughness:0.85 }));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  const tex = mtex(k, parts, pw, ph, o);
  const mat = new THREE.MeshStandardMaterial({ map:tex, roughness:0.8 });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), mat);
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
  grp.position.set(x, o.y == null ? 0.035 : o.y, z); grp.rotation.y = o.rot || 0; scene.add(grp);
  return grp;
}
/* 좌표판 — 나무판 위 모눈종이(scenes-c34 board 와 같은 방식). P(x, y, h) 로 판 위의 월드 좌표 */
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
  });
  const slab = new THREE.Mesh(k.rbox(W + 0.24, 0.08, D + 0.24, 0.06), k.woodMat('#8a5a33', [50, 25, 10]));
  slab.position.set(cx, 0, cz); slab.castShadow = slab.receiveShadow = true; scene.add(slab);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map:tex, roughness:0.85 }));
  face.rotation.x = -Math.PI / 2; face.position.set(cx, 0.081, cz); face.receiveShadow = true; scene.add(face);
  const P = (x, y, hh) => new THREE.Vector3(cx - W / 2 + (x - o.x0) * ux, hh == null ? 0.13 : hh, cz - D / 2 + (o.y1 - y) * uy);
  return { P, W, D };
}
/* 압정 — 둥근 머리 + 짧은 바늘 */
function pin(k, p, color, r){
  const { THREE, scene } = k;
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(r || 0.075, 24, 16), new THREE.MeshPhysicalMaterial({ color, roughness:0.25, clearcoat:1 })); head.position.y = 0.12;
  const nd = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), k.metal('#c9c3b5', 0.25)); nd.position.y = 0.05;
  [head, nd].forEach(m => { m.castShadow = true; g.add(m); });
  g.position.set(p.x, p.y - 0.12, p.z); scene.add(g); return g;
}
/* 세운 식 판 */
function plate(k, parts, w, h, o){
  o = o || {};
  const m = new k.THREE.Mesh(new k.THREE.PlaneGeometry(w, h), new k.THREE.MeshStandardMaterial({ map:mtex(k, parts, 1024, Math.round(1024 * h / w), Object.assign({ hmax:0.62, fill:0.86 }, o)), roughness:0.7 }));
  m.receiveShadow = true; return m;
}

export const SCENES_C37B = {

  /* 이차함수의 식 구하기 — hook: 꼭짓점을 알면 y=a(x−p)²+q 로 시작, 점 하나로 a.
     stage ①: 꼭짓점 (2, 3), 지나는 점 (4, 11) → 11 = a×4+3 → a = 2 */
  'M-81': { seed:381, caps:{ P:9, list:[
    [0.0, "꼭짓점이 $(2,\\,3)$이면 $y=a(x-2)^2+3$으로 시작합니다.", "A vertex at $(2,\\,3)$ means we start from $y=a(x-2)^2+3$.", "顶点是$(2,\\,3)$，就从$y=a(x-2)^2+3$入手。"],
    [0.1, "$a$가 바뀌어도 꼭짓점은 그대로입니다. 남은 것은 $a$ 하나입니다.", "Changing $a$ keeps the vertex fixed; $a$ is the only unknown.", "$a$变化时顶点不动，未知数只剩$a$。"],
    [0.6, "점 $(4,\\,11)$을 넣으면 $11=4a+3$입니다.", "Substitute $(4,\\,11)$: $11=4a+3$.", "代入点$(4,\\,11)$：$11=4a+3$。"],
    [0.8, "그래서 $a=2$, 식은 $y=2(x-2)^2+3$입니다.", "So $a=2$ and the formula is $y=2(x-2)^2+3$.", "所以$a=2$，解析式是$y=2(x-2)^2+3$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.35, 0, 0.25], 6.3, 62);
    k.table();
    const B = board(k, { x0:-1, x1:5.4, y0:-1, y1:12.2, ux:0.52, uy:0.27, cx:-0.95, cz:0.1, xs:[1, 2, 3, 4, 5], ys:[3, 6, 9, 11], fs:0.2 });
    /* 포물선 철사 — 꼭짓점을 원점으로 둔 모양(a=2)을 무리에 담고, z 축 배율로 a 를 바꾼다 */
    const V = B.P(2, 3, 0.15), ux = 0.52, uy = 0.27;
    const pts = [];
    for(let i = 0; i <= 80; i++){ const x = 0.05 + 3.9 * i / 80; pts.push(new THREE.Vector3((x - 2) * ux, 0, -2 * (x - 2) * (x - 2) * uy)); }
    const curve = new THREE.CatmullRomCurve3(pts);
    const wmat = k.metal('#b87333', 0.3);
    const para = new THREE.Group(); para.position.copy(V);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.03, 12), wmat); tube.castShadow = true; para.add(tube);
    scene.add(para);
    const pv = pin(k, B.P(2, 3, 0.17), '#c0392b', 0.085), pq = pin(k, B.P(4, 11, 0.17), '#2e6fb5', 0.085);
    /* 식 카드 — 시작하는 꼴 → 점을 넣은 식 → a */
    const c1 = mcard(k, ['y = a(x − 2)', { sup:'2' }, ' + 3'], 2.3, -1.05, { w:2.1, d:0.62, hmax:0.6, fill:0.92, rot:-0.03 });
    const c2 = mcard(k, ['11 = 4a + 3'], 2.35, -0.05, { w:1.9, d:0.58, hmax:0.52, rot:0.02 });
    const c3 = mcard(k, ['a = 2'], 2.35, 0.9, { w:1.3, d:0.58, hmax:0.56, rot:-0.02, edge:'#d9c49a', bg:'#f6e3b8' });
    /* 움직임: a 가 작아졌다 커졌다(꼭짓점은 그대로) → 파란 점 (4, 11)을 지나는 a = 2 에서 멈춘다 → 식 카드가 차례로 톡 */
    const y0 = [c1, c2, c3].map(c => c.position.y), qy = pq.position.y, vy = pv.position.y;
    k.onFrame(t => { const p = cyc(t, 9);
      const a = 2 - 1.3 * seg(p, 0.1, 0.28) + 1.6 * seg(p, 0.32, 0.5) - 0.3 * seg(p, 0.52, 0.64);
      para.scale.z = a / 2;
      pv.position.y = vy + 0.18 * hop(p, 0.02, 0.1);
      pq.position.y = qy + 0.22 * hop(p, 0.64, 0.74);
      c1.position.y = y0[0] + 0.18 * hop(p, 0.0, 0.1);
      c2.position.y = y0[1] + 0.18 * hop(p, 0.66, 0.78);
      c3.position.y = y0[2] + 0.2 * hop(p, 0.8, 0.92); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.3, 0, 0], envOpts:{ intensity:0.7 } });
  }},
  /* 산포도 — hook: 평균이 같은 두 반도 고른 정도가 다르다. stage ①: 편차 = 변량 − 평균, 합은 0.
     stage ②: 편차를 제곱해 평균 → 분산 V. 두 줄: 3,4,5,6,7(V=2) 과 1,3,5,7,9(V=8), 평균은 둘 다 5 */
  'M-85': { seed:385, caps:{ P:9, list:[
    [0.0, "두 반의 점수는 평균이 둘 다 $5$입니다.", "Both classes have the same mean, $5$.", "两个班的平均数都是$5$。"],
    [0.12, "편차는 변량에서 평균을 뺀 값이고, 합은 $\\sum d=0$입니다.", "A deviation is value minus mean, and $\\sum d=0$.", "偏差是变量减平均数，且$\\sum d=0$。"],
    [0.58, "제곱해서 평균을 내면 분산 $V=2$와 $V=8$입니다.", "Squaring and averaging gives variances $V=2$ and $V=8$.", "平方后求平均，得方差$V=2$和$V=8$。"],
    [0.8, "표준편차는 $\\sqrt{2}$와 $\\sqrt{8}$ — 아래 반이 더 넓게 흩어져 있습니다.", "Standard deviations $\\sqrt{2}$ and $\\sqrt{8}$: the lower class is more spread out.", "标准差是$\\sqrt{2}$和$\\sqrt{8}$——下面的班更分散。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.0, 0, -0.05], 7.0, 68);
    k.table();
    const u = 0.5, X0 = -3.3, X = v => X0 + v * u;
    const rows = [{ z:-0.62, vals:[3, 4, 5, 6, 7], V:'2' }, { z:1.0, vals:[1, 3, 5, 7, 9], V:'8' }];
    /* 수직선 막대 — 0~10 눈금 */
    const stripTex = k.canvasTex(2048, 220, (g, w, h) => {
      g.fillStyle = '#efe3c6'; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 2500; i++){ g.fillStyle = `rgba(${120 + k.rnd() * 60},${95 + k.rnd() * 50},${60 + k.rnd() * 30},${k.rnd() * 0.08})`; g.fillRect(k.rnd() * w, k.rnd() * h, 1 + k.rnd() * 3, 1 + k.rnd() * 5); }
      const px = v => (v * u + 0.3) / 5.6 * w, ly = h * 0.36;
      g.strokeStyle = g.fillStyle = '#2b2118'; g.lineWidth = 5; g.beginPath(); g.moveTo(px(-0.2), ly); g.lineTo(px(10.3), ly); g.stroke();
      g.textBaseline = 'middle';
      for(let v = 0; v <= 10; v++){ g.lineWidth = 4; g.beginPath(); g.moveTo(px(v), ly - 22); g.lineTo(px(v), ly + 22); g.stroke();
        k.mathText(g, String(v), px(v), h * 0.8, 60, { weight:'400' }); }
    });
    const plankMat = k.woodMat('#8a5a33', [50, 25, 10]);
    const red = k.lacquer('#a8322a'), blue = k.lacquer('#2d5f9a'), brass = k.metal('#c9a45c', 0.3);
    const toks = [], bars = [], tags = [];
    rows.forEach((R, ri) => {
      const pl = new THREE.Mesh(k.rbox(5.75, 0.08, 0.72, 0.05), plankMat); pl.position.set(X0 + 2.5, 0, R.z); pl.castShadow = pl.receiveShadow = true; scene.add(pl);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 0.6), new THREE.MeshStandardMaterial({ map:stripTex, roughness:0.85 }));
      face.rotation.x = -Math.PI / 2; face.position.set(X0 + 2.5, 0.082, R.z); face.receiveShadow = true; scene.add(face);
      const lineZ = R.z - 0.3 + 0.6 * 0.36;
      /* 평균 5 — 앞쪽에 놋쇠 받침 삼각(무게중심) */
      const wedge = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 3), brass); wedge.rotation.x = Math.PI / 2; wedge.rotation.y = 0;
      wedge.scale.setScalar(0.7); wedge.position.set(X(5), 0.1, R.z + 0.44); wedge.rotation.set(-Math.PI / 2, 0, 0); wedge.castShadow = true; scene.add(wedge);
      R.vals.forEach(v => {
        /* 점수 말(나무 원판) */
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.175, 0.09, 40), k.woodMat('#d9b27c', [120, 80, 40])); body.position.y = 0.045; body.castShadow = body.receiveShadow = true; g.add(body);
        const top = new THREE.Mesh(new THREE.CircleGeometry(0.158, 40), new THREE.MeshStandardMaterial({ map:mtex(k, [String(v)], 256, 256, { bg:'#f3e7cf', hmax:0.6 }), roughness:0.7 }));
        top.rotation.x = -Math.PI / 2; top.position.y = 0.092; g.add(top);
        g.position.set(X(v), 0.08, lineZ); scene.add(g); toks.push({ g, ri, v, y:g.position.y });
        /* 편차 막대 — 평균에서 그 값까지(빨강 −, 파랑 +) */
        const d = v - 5;
        if(d !== 0){ const L = Math.abs(d) * u;
          const b = new THREE.Mesh(new THREE.BoxGeometry(1, 0.05, 0.07), d < 0 ? red : blue); b.castShadow = true;
          const holder = new THREE.Group(); holder.position.set(X(5), 0.03, R.z - 0.5 - 0.1 * (Math.abs(d) === Math.max(...R.vals.map(w => Math.abs(w - 5))) ? 1 : 0)); holder.add(b); b.position.x = 0.5; b.scale.x = 1; holder.scale.x = d < 0 ? -L : L; scene.add(holder);
          bars.push({ holder, ri, L:d < 0 ? -L : L }); }
        /* 편차 숫자 조각 */
        const tg = mcard(k, [d > 0 ? '+' + d : d < 0 ? '−' + (-d) : '0'], X(v), R.z - 0.95, { w:0.46, d:0.34, hmax:0.62, fill:0.8, bg:d < 0 ? '#f3d9d0' : d > 0 ? '#d8e2ef' : '#f3e7cf' });
        tags.push({ g:tg, ri, y:tg.position.y });
      });
    });
    const mean = mcard(k, [{ bar:'x' }, ' = 5'], -3.0, -1.55, { w:1.25, d:0.54, hmax:0.6, rot:0.03 });
    const vA = mcard(k, ['V = 2'], 2.95, -0.95, { w:1.3, d:0.55, hmax:0.56 });
    const sA = mcard(k, [{ gk:'σ' }, ' = ', { r:'2' }], 2.95, -0.3, { w:1.3, d:0.55, hmax:0.56, bg:'#f6e3b8', edge:'#d9c49a' });
    const vB = mcard(k, ['V = 8'], 2.95, 0.7, { w:1.3, d:0.55, hmax:0.56 });
    const sB = mcard(k, [{ gk:'σ' }, ' = ', { r:'8' }], 2.95, 1.35, { w:1.3, d:0.55, hmax:0.56, bg:'#f6e3b8', edge:'#d9c49a' });
    /* 움직임: 편차 막대가 평균으로 접혔다가 → 윗줄, 아랫줄 차례로 평균에서 뻗어 나간다(말이 톡) → 분산·표준편차 카드가 톡 */
    const cy0 = [mean, vA, vB, sA, sB].map(c => c.position.y);
    k.onFrame(t => { const p = cyc(t, 9);
      bars.forEach(b => { const a = b.ri ? 0.34 : 0.16; const s = 1 - seg(p, 0.02, 0.1) * (1 - seg(p, a, a + 0.14)); b.holder.scale.x = b.L * Math.max(0.001, s); });
      toks.forEach(o => { const a = (o.ri ? 0.34 : 0.16) + 0.1; o.g.position.y = o.y + 0.16 * hop(p, a + Math.abs(o.v - 5) * 0.004, a + 0.08); });
      tags.forEach(o => { const a = (o.ri ? 0.34 : 0.16) + 0.12; o.g.position.y = o.y + 0.12 * hop(p, a, a + 0.08); });
      mean.position.y = cy0[0] + 0.18 * hop(p, 0.0, 0.1);
      vA.position.y = cy0[1] + 0.18 * hop(p, 0.58, 0.68); vB.position.y = cy0[2] + 0.18 * hop(p, 0.66, 0.76);
      sA.position.y = cy0[3] + 0.18 * hop(p, 0.8, 0.9); sB.position.y = cy0[4] + 0.18 * hop(p, 0.86, 0.96); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.3], envOpts:{ intensity:0.7 } });
  }},
  /* 사분위수와 상자그림 — history: 최솟값·Q1·중앙값·Q3·최댓값을 선과 상자로 잇는다.
     stage ①: 정렬 → Q2 → Q1·Q3(홀수 개면 Q2 는 빼고), IQR = Q3 − Q1. stage ②: 상자 Q1~Q3, 선 Q2, 수염 양끝, 눈금에 맞춤.
     자료 11개: 2 4 5 7 8 9 11 12 14 15 18 → Q1=5, Q2=9, Q3=14 */
  'M-86': { seed:386, caps:{ P:9, list:[
    [0.0, "자료 $11$개를 작은 수부터 늘어놓습니다.", "Line up the $11$ values from smallest to largest.", "把$11$个数据从小到大排好。"],
    [0.1, "가운데 $Q_2=9$, 양쪽 절반의 가운데가 $Q_1=5$, $Q_3=14$입니다.", "The middle is $Q_2=9$; the middles of the halves are $Q_1=5$ and $Q_3=14$.", "中间是$Q_2=9$，两半的中间是$Q_1=5$和$Q_3=14$。"],
    [0.45, "상자는 $Q_1$부터 $Q_3$까지, 수염은 $2$와 $18$까지 눈금에 맞춥니다.", "The box runs from $Q_1$ to $Q_3$; whiskers reach $2$ and $18$, all on the scale.", "箱体从$Q_1$到$Q_3$，须延伸到$2$和$18$，都对准刻度。"],
    [0.78, "$\\mathrm{IQR}=14-5=9$ — 가운데 절반이 퍼진 폭입니다.", "$\\mathrm{IQR}=14-5=9$: the spread of the middle half.", "$\\mathrm{IQR}=14-5=9$——中间一半的分布宽度。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.15, 0, 0.0], 7.0, 64);
    k.table();
    const data = [2, 4, 5, 7, 8, 9, 11, 12, 14, 15, 18], key = { 0:'min', 2:'q1', 5:'q2', 8:'q3', 10:'max' };
    const u = 0.32, S = v => -3.2 + v * u, TX = i => -2.9 + i * 0.58, TZ = -1.5, BZ = -0.05, AZ = 0.62;
    /* 한지 — 눈금(0~20)과 자료 말에서 눈금으로 내려오는 점선 */
    const PW = 7.4, PD = 3.9, PX = 0.05, PZ = -0.2;
    k.paper(PW, PD, PX, PZ, 0, (g, w, h) => {
      const x = X => (X - PX + PW / 2) / PW * w, z = Z => (Z - PZ + PD / 2) / PD * h;
      g.strokeStyle = g.fillStyle = '#2b2118'; g.lineWidth = 5; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x(S(-0.5)), z(AZ)); g.lineTo(x(S(20.5)), z(AZ)); g.stroke();
      g.textBaseline = 'middle';
      for(let v = 0; v <= 20; v++){ const big = v % 2 === 0; g.lineWidth = big ? 4 : 2.5; g.beginPath(); g.moveTo(x(S(v)), z(AZ) - (big ? 20 : 12)); g.lineTo(x(S(v)), z(AZ) + (big ? 20 : 12)); g.stroke();
        if(big) k.mathText(g, String(v), x(S(v)), z(AZ) + 58, 46, { weight:'400' }); }
      g.setLineDash([14, 12]); g.lineWidth = 3; g.strokeStyle = 'rgba(60,40,25,.55)';
      Object.keys(key).forEach(i => { const v = data[i]; g.beginPath(); g.moveTo(x(TX(+i)), z(TZ + 0.3)); g.lineTo(x(S(v)), z(BZ - 0.42)); g.lineTo(x(S(v)), z(AZ - 0.05)); g.stroke(); });
      g.setLineDash([]);
    });
    /* 자료 말 — Q1·Q2·Q3 는 금빛, 양끝은 짙은 색 */
    const tiles = data.map((v, i) => { const kk = key[i];
      const bg = kk === 'q2' ? '#e3ad45' : kk === 'q1' || kk === 'q3' ? '#ecc96e' : kk ? '#c6ad88' : '#f3e7cf';
      const t = mcard(k, [String(v)], TX(i), TZ, { w:0.5, d:0.5, h:0.08, hmax:0.56, fill:0.78, bg, edge:'#d8c7a4' });
      return { g:t, y:t.position.y, kk }; });
    /* 상자그림 — 상자 Q1~Q3, 중앙선 Q2, 수염과 끝막대 */
    const boxMat = k.plastic('#7fa7c9', 0.45), brass = k.metal('#c9a45c', 0.28), steel = k.metal('#8e8a84', 0.3);
    const parts = {};
    const box = new THREE.Mesh(k.rbox((14 - 5) * u, 0.24, 0.62, 0.03), boxMat); box.position.set((S(5) + S(14)) / 2, 0.03, BZ); box.castShadow = box.receiveShadow = true; scene.add(box);
    const med = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.7), brass); med.position.set(S(9), 0.2, BZ); med.castShadow = true; scene.add(med); parts.q2 = med;
    const edge = v => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.3, 0.64), k.plastic('#3f6e96', 0.4)); m.position.set(S(v), 0.17, BZ); m.castShadow = true; scene.add(m); return m; };
    parts.q1 = edge(5); parts.q3 = edge(14);
    const whisk = (a, b) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, Math.abs(b - a) * u, 12), steel); m.rotation.z = Math.PI / 2; m.position.set((S(a) + S(b)) / 2, 0.15, BZ); m.castShadow = true; scene.add(m); };
    whisk(2, 5); whisk(14, 18);
    const cap = v => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.24, 0.34), steel); m.position.set(S(v), 0.14, BZ); m.castShadow = true; scene.add(m); return m; };
    parts.min = cap(2); parts.max = cap(18);
    /* Q 표 — 눈금 아래 */
    const qs = [['1', 5], ['2', 9], ['3', 14]].map(([n, v]) => mcard(k, ['Q', { sub:n }], S(v), AZ + 0.62, { w:0.56, d:0.4, hmax:0.6, fill:0.8, bg:n === '2' ? '#e3ad45' : '#ecc96e', edge:'#d9c49a' }));
    const iqr = mcard(k, [{ up:'IQR' }, ' = 14 − 5 = 9'], 1.7, AZ + 1.28, { w:2.6, d:0.5, hmax:0.56, fill:0.9 });
    /* 움직임: 다섯 위치를 차례로 — 양끝 말·끝막대, 가운데 말·중앙선, Q1·Q3 말·상자 가장자리가 톡 → IQR 카드 */
    const order = [['q2', 0.1], ['q1', 0.2], ['q3', 0.28], ['min', 0.45], ['max', 0.53]];
    const py = {}; Object.keys(parts).forEach(kk => { py[kk] = parts[kk].position.y; });
    const qy = qs.map(q => q.position.y), iy = iqr.position.y, qi = { q1:0, q2:1, q3:2 };
    k.onFrame(t => { const p = cyc(t, 9); const u2 = {};
      order.forEach(([kk, a]) => { u2[kk] = hop(p, a, a + 0.1); });
      tiles.forEach(o => { o.g.position.y = o.y + (o.kk ? 0.22 * u2[o.kk] : 0); });
      Object.keys(parts).forEach(kk => { parts[kk].position.y = py[kk] + 0.14 * u2[kk]; });
      qs.forEach((q, i) => { const kk = ['q1', 'q2', 'q3'][i]; q.position.y = qy[i] + 0.14 * u2[kk]; });
      box.scale.y = 1 + 0.25 * hop(p, 0.64, 0.76);
      iqr.position.y = iy + 0.18 * hop(p, 0.78, 0.9); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0], envOpts:{ intensity:0.7 } });
  }},
  /* 산점도와 상관관계 — hook: 한 학생의 두 기록이 (x, y) 한 점. stage ①: 표의 한 행이 한 점, 점은 잇지 않는다.
     stage ②: 오른쪽 위로 가늘게 모이면 양의 상관관계 */
  'M-87': { seed:387, caps:{ P:10, list:[
    [0.0, "한 학생의 두 기록 $(x,\\,y)$가 점 하나입니다.", "One student's two records $(x,\\,y)$ make one point.", "一名学生的两个记录$(x,\\,y)$就是一个点。"],
    [0.12, "표의 한 행을 찍을 때마다 점이 하나씩 늘어납니다. 점은 잇지 않습니다.", "Each row of the table adds one point. The points are not joined.", "表中每描一行就多一个点。点与点不连线。"],
    [0.72, "$x$가 커질수록 $y$도 대체로 커집니다 — 양의 상관관계 $\\nearrow$", "As $x$ grows, $y$ tends to grow: positive correlation $\\nearrow$", "$x$越大，$y$大致也越大——正相关$\\nearrow$"],
    [0.88, "점들이 가늘게 모일수록 관계가 더 강합니다.", "The tighter the cloud, the stronger the correlation.", "点越集中成细长一条，相关越强。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.15, 0, 0.1], 6.6, 64);
    k.table();
    const pts = [[1, 2], [2, 3], [3, 2], [4, 5], [5, 4], [6, 6], [7, 7], [8, 6]];
    const B = board(k, { x0:-0.6, x1:9.2, y0:-0.7, y1:8.6, u:0.38, cx:0.95, cz:0.1, xs:[2, 4, 6, 8], ys:[2, 4, 6, 8], fs:0.19 });
    /* 표 — 한 행이 한 학생(x, y) */
    const TW = 1.35, TD = 3.5, TXc = -2.35, TZc = 0.1, rows = pts.length + 1, rh = TD / rows;
    const tabTex = k.canvasTex(512, Math.round(512 * TD / TW), (g, w, h) => {
      g.fillStyle = '#f3e7cf'; g.fillRect(0, 0, w, h);
      const r = h / rows; g.strokeStyle = 'rgba(43,33,24,.55)'; g.lineWidth = 3;
      for(let i = 1; i < rows; i++){ g.lineWidth = i === 1 ? 6 : 2.5; g.beginPath(); g.moveTo(w * 0.05, i * r); g.lineTo(w * 0.95, i * r); g.stroke(); }
      g.lineWidth = 4; g.beginPath(); g.moveTo(w / 2, r * 0.15); g.lineTo(w / 2, h - r * 0.15); g.stroke();
      g.fillStyle = '#2b2118'; g.textBaseline = 'middle';
      k.mathText(g, 'x', w * 0.27, r * 0.5, r * 0.62); k.mathText(g, 'y', w * 0.73, r * 0.45, r * 0.62);
      pts.forEach(([x, y], i) => { k.mathText(g, String(x), w * 0.27, (i + 1.5) * r, r * 0.56); k.mathText(g, String(y), w * 0.73, (i + 1.5) * r, r * 0.56); });
    });
    const tab = new THREE.Group();
    const tb = new THREE.Mesh(k.rbox(TW, 0.04, TD, 0.04), new THREE.MeshStandardMaterial({ color:'#e9dcc0', roughness:0.85 })); tb.castShadow = tb.receiveShadow = true; tab.add(tb);
    const tt = new THREE.Mesh(new THREE.PlaneGeometry(TW * 0.94, TD * 0.97), new THREE.MeshStandardMaterial({ map:tabTex, roughness:0.8 })); tt.rotation.x = -Math.PI / 2; tt.position.y = 0.042; tab.add(tt);
    tab.position.set(TXc, 0.035, TZc); tab.rotation.y = 0.02; scene.add(tab);
    /* 지금 찍는 행을 덮는 호박색 유리 띠(정지 그림에서는 숨김) */
    const hl = new THREE.Mesh(k.rbox(TW * 0.98, 0.03, rh * 0.92, 0.03), new THREE.MeshPhysicalMaterial({ color:'#f0b54a', roughness:0.15, transmission:0.6, transparent:true, opacity:0.45 }));
    hl.position.set(TXc, 0.09, 0); hl.visible = false; scene.add(hl);
    const rowZ = i => TZc - TD / 2 + (i + 1.5) * rh;
    const pins = pts.map(([x, y]) => { const q = B.P(x, y, 0.2); const p = pin(k, q, '#c0392b', 0.08); return { g:p, y:p.position.y }; });
    /* 점 무리를 두르는 끈 — 오른쪽 위로 가늘게 모인 모양 */
    const c0 = B.P(4.5, 4.4, 0.1), c1 = B.P(8.2, 7.4, 0.1), ang = Math.atan2(-(c1.z - c0.z), c1.x - c0.x);
    const loop = new THREE.Mesh(new THREE.TorusGeometry(1, 0.018, 10, 96), new THREE.MeshStandardMaterial({ color:'#2e6fb5', roughness:0.6 }));
    loop.rotation.x = Math.PI / 2; loop.scale.set(1.95, 0.62, 1); loop.castShadow = true;
    const lg = new THREE.Group(); lg.add(loop); lg.position.copy(c0); lg.rotation.y = ang; scene.add(lg);
    const ly = lg.position.y;
    /* 움직임: 점이 모두 들렸다가 → 표의 행을 차례로 짚으며 한 점씩 제자리에 꽂힌다 → 무리를 두른 끈이 톡 */
    k.onFrame(t => { const p = cyc(t, 10);
      const up = seg(p, 0.02, 0.1);
      let cur = -1;
      pins.forEach((o, i) => { const a = 0.14 + i * 0.07, down = seg(p, a, a + 0.05); o.g.position.y = o.y + 0.9 * up * (1 - down);
        if(p >= a - 0.02 && p < a + 0.07) cur = i; });
      hl.visible = cur >= 0 && p < 0.72; if(hl.visible) hl.position.z = rowZ(cur);
      lg.position.y = ly + 0.16 * hop(p, 0.74, 0.86); lg.scale.setScalar(1 + 0.06 * hop(p, 0.74, 0.86)); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.2], envOpts:{ intensity:0.7 } });
  }},
};
