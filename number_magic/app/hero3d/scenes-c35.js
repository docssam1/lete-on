/* C35 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

/* 근호가 들어간 식 한 줄 — parts: 문자열 또는 {r:'49'}(근호). 근호는 붓길(√ 모양 + 윗줄)로 직접 그린다.
   draw=false 면 너비만 돌려준다. */
function rootLine(k, g, parts, cx, cy, fs, o){
  o = o || {};
  const mo = { weight:o.weight };
  const tw = t => k.mathText(g, t, 0, 0, fs, Object.assign({ draw:false }, mo));
  const gap = fs * 0.06;
  const sw = t => k.mathText(g, t, 0, 0, fs * 0.62, Object.assign({ draw:false }, mo));
  const wOf = p => typeof p === 'string' ? tw(p) : p.sup != null ? sw(p.sup) : fs * 0.62 + tw(p.r) + fs * 0.12;
  const total = parts.reduce((a, p) => a + wOf(p) + gap, -gap);
  if(o.draw === false) return total;
  let x = o.align === 'left' ? cx : cx - total / 2;
  parts.forEach(p => {
    const pw = wOf(p);
    if(typeof p === 'string') k.mathText(g, p, x, cy, fs, Object.assign({ align:'left' }, mo));
    else if(p.sup != null) k.mathText(g, p.sup, x - gap * 0.5, cy - fs * 0.4, fs * 0.62, Object.assign({ align:'left' }, mo));   /* 지수 */
    else {
      const top = cy - fs * 0.62, bot = cy + fs * 0.5, lw = fs * 0.065;
      g.save(); g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x + fs * 0.02, cy + fs * 0.06); g.lineTo(x + fs * 0.16, cy - fs * 0.02);
      g.lineTo(x + fs * 0.34, bot); g.lineTo(x + fs * 0.58, top); g.lineTo(x + pw, top); g.stroke(); g.restore();
      k.mathText(g, p.r, x + fs * 0.66, cy + fs * 0.04, fs, Object.assign({ align:'left' }, mo));
    }
    x += pw + gap;
  });
  return total;
}
/* 근호 식 카드 — 얇은 판 윗면에 rootLine. 글자 크기는 카드 폭·높이에 맞춘다 */
function rcard(k, parts, x, z, o){
  o = o || {};
  const { THREE, scene } = k;
  const w = o.w || 1.4, d = o.d || 0.5, h = o.h || 0.03;
  const pw = 1024, ph = Math.round(1024 * d / w);
  const tex = k.canvasTex(pw, ph, (g, W, H) => {
    g.fillStyle = o.bg || '#f3e7cf'; g.fillRect(0, 0, W, H);
    g.fillStyle = g.strokeStyle = o.color || '#2b2118'; g.textBaseline = 'middle';
    const t0 = rootLine(k, g, parts, 0, 0, 100, { draw:false, weight:o.weight });
    const fs = Math.min(H * (o.hmax || 0.58), 100 * W * (o.fill || 0.84) / t0);
    rootLine(k, g, parts, W / 2, H / 2 + fs * 0.03, fs, { weight:o.weight });
  });
  const grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, Math.min(0.04, d * 0.1)), new THREE.MeshStandardMaterial({ color:o.edge || '#e9dcc0', roughness:0.85 }));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), new THREE.MeshStandardMaterial({ map:tex, roughness:0.8 }));
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
  grp.position.set(x, o.y == null ? 0.035 : o.y, z); grp.rotation.y = o.rot || 0; scene.add(grp); return grp;
}

/* 근호 식이 윗면에 새겨진 블록 */
function rtile(k, parts, x, z, o){
  o = o || {};
  const { THREE, scene } = k;
  const w = o.w || 0.5, d = o.d || 0.5, h = o.h || 0.14;
  const tex = k.canvasTex(512, Math.round(512 * d / w), (g, W, H) => {
    g.fillStyle = o.bg || '#f3e7cf'; g.fillRect(0, 0, W, H);
    g.fillStyle = g.strokeStyle = o.color || '#2b2118'; g.textBaseline = 'middle';
    const t0 = rootLine(k, g, parts, 0, 0, 100, { draw:false });
    const fs = Math.min(H * 0.56, 100 * W * 0.8 / t0);
    rootLine(k, g, parts, W / 2, H / 2 + fs * 0.03, fs);
  });
  const grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, 0.04), o.side || k.woodMat('#c08a52', [110, 70, 35]));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.86, d * 0.86), new THREE.MeshStandardMaterial({ map:tex, roughness:0.7 }));
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.003; top.receiveShadow = true; grp.add(top);
  grp.position.set(x, o.y == null ? 0.03 : o.y, z); scene.add(grp); return grp;
}

export const SCENES_C35 = {

  /* 제곱근의 값 — hook: 넓이가 49인 정사각형, 한 변은? 제곱해서 49가 되는 수. stage ④: 6×6=36, √36=6 과 같은 방식 */
  'M-15': { seed:215, caps:{ P:9, list:[
    [0.0, "넓이가 $49$인 정사각형이 있습니다. 한 변의 길이는 얼마일까요?", "A square has area $49$. How long is one side?", "有一个面积为$49$的正方形。它的边长是多少？"],
    [0.12, "한 줄에 $7$개씩, $7$줄이면 $7\\times 7=49$입니다.", "$7$ in a row, $7$ rows: $7\\times 7=49$.", "每行$7$个，共$7$行：$7\\times 7=49$。"],
    [0.6, "제곱해서 $49$가 되는 양수는 $7$ — 그래서 $\\sqrt{49}=7$입니다.", "The positive number whose square is $49$ is $7$, so $\\sqrt{49}=7$.", "平方等于$49$的正数是$7$，所以$\\sqrt{49}=7$。"],
    [0.82, "$(-7)^2$도 $49$이므로, $49$의 제곱근은 $\\pm 7$입니다.", "$(-7)^2$ is also $49$, so the square roots of $49$ are $\\pm 7$.", "$(-7)^2$也等于$49$，所以$49$的平方根是$\\pm 7$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.35, 0.1, 0.2], 5.4, 58);
    k.table();
    k.paper(5.9, 3.7, 0.35, 0.1, 0.01);
    /* 7×7 나무 타일 — 넓이 49 */
    const N = 7, S = 0.3, GAP = 0.018, X0 = -1.55, Z0 = -1.2;   /* 왼쪽 위 타일 중심 */
    const tiles = [];
    const woods = ['#c08a52', '#b47f49', '#c9955c'];
    for(let r = 0; r < N; r++) for(let c = 0; c < N; c++){
      const m = k.tile('', X0 + c * (S + GAP), Z0 + r * (S + GAP), { w:S, d:S, h:0.09, rad:0.025, side:k.woodMat(woods[(r * 3 + c) % 3], [120, 80, 40]), y:0.03 });
      tiles.push({ m, r, c, y:m.position.y });
    }
    const side = N * S + (N - 1) * GAP, left = X0 - S / 2, right = left + side, topZ = Z0 - S / 2, botZ = topZ + side;
    /* 한 변 = 7 — 밑변 앞과 왼쪽 옆에 황동 자 + 카드 */
    const brass = k.metal('#c9a14f', 0.3);
    const rodB = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, side, 12), brass); rodB.rotation.z = Math.PI / 2; rodB.position.set((left + right) / 2, 0.05, botZ + 0.14); rodB.castShadow = true; scene.add(rodB);
    const rodL = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, side, 12), brass); rodL.rotation.x = Math.PI / 2; rodL.position.set(left - 0.14, 0.05, (topZ + botZ) / 2); rodL.castShadow = true; scene.add(rodL);
    [[left, botZ + 0.14, 0], [right, botZ + 0.14, 0], [left - 0.14, topZ, 1], [left - 0.14, botZ, 1]].forEach(([x, z, v]) => {
      const e = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.14, 10), brass); e.position.set(x, 0.07, z); e.castShadow = true; scene.add(e); });
    const c7b = rcard(k, ['7'], (left + right) / 2, botZ + 0.46, { w:0.46, d:0.4, hmax:0.72 });
    const c7l = rcard(k, ['7'], left - 0.46, (topZ + botZ) / 2, { w:0.4, d:0.46, hmax:0.62 });
    /* 오른쪽: 식 카드 셋 */
    const RX = 2.05;
    const cA = rcard(k, ['7 × 7 = 49'], RX, -0.75, { w:1.7, d:0.52, rot:-0.03 });
    const cB = rcard(k, [{ r:'49' }, ' = 7'], RX, 0.1, { w:1.7, d:0.62, rot:0.02, hmax:0.62 });
    const cC = rcard(k, ['(−7)', { sup:'2' }, ' = 49'], RX, 0.95, { w:1.7, d:0.52, rot:-0.02 });
    /* 움직임: 한 줄(7개)씩 차례로 톡톡 — 일곱 줄 → 한 변 7 카드 둘이 톡 → 식 카드가 차례로 */
    const cards = [[c7b, 0.5], [c7l, 0.5], [cA, 0.58], [cB, 0.66], [cC, 0.84]].map(([g, a]) => ({ g, a, y:g.position.y }));
    k.onFrame(t => { const p = cyc(t, 9);
      tiles.forEach(o => { const a = 0.12 + o.r * 0.045 + o.c * 0.006; o.m.position.y = o.y + 0.16 * hop(p, a, a + 0.08); });
      cards.forEach(o => { o.g.position.y = o.y + 0.22 * hop(p, o.a, o.a + 0.1); }); });
    k.lights({ key:2.6, spot:16, envOpts:{ intensity:0.55 } });
  }},

  /* 근호의 정리 — hook: √48 은 정수로 안 떨어지지만 48 안에 16(=4²)이 숨어 있다. stage ①: 48=16×3, √48=√16×√3=4√3 */
  'M-16': { seed:216, caps:{ P:10, list:[
    [0.0, "타일 $48$개는 $4\\times 4$ 정사각형 $3$개로 나뉩니다: $48=16\\times 3$", "The $48$ tiles split into three $4\\times 4$ squares: $48=16\\times 3$", "$48$块瓷砖可以分成$3$个$4\\times 4$的正方形：$48=16\\times 3$"],
    [0.1, "모아 놓으면 $48$ — 완전제곱수가 아니라서 $\\sqrt{48}$은 정수로 떨어지지 않습니다.", "Put together: $48$ is not a perfect square, so $\\sqrt{48}$ is not a whole number.", "合在一起是$48$——它不是完全平方数，所以$\\sqrt{48}$不是整数。"],
    [0.46, "그런데 그 안에 $16=4^2$이 숨어 있습니다.", "But $16=4^2$ is hiding inside it.", "但里面藏着$16=4^2$。"],
    [0.74, "$\\sqrt{48}=\\sqrt{16}\\times\\sqrt{3}=4\\sqrt{3}$ — $4$가 근호 밖으로 나옵니다.", "$\\sqrt{48}=\\sqrt{16}\\times\\sqrt{3}=4\\sqrt{3}$: the $4$ comes out of the root.", "$\\sqrt{48}=\\sqrt{16}\\times\\sqrt{3}=4\\sqrt{3}$——$4$被移到根号外面。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.1, 0.05], 5.6, 56);
    k.table();
    k.paper(5.7, 3.6, 0, 0.1, -0.01);
    /* 타일 48개 — 정사각형 셋(4×4)마다 나무 빛이 다르다 */
    const S = 0.26, U = 0.285, SQ = 4 * U, GAPS = 0.36, X0 = -(3 * SQ + 2 * GAPS) / 2 + U / 2, Z0 = -1.15;
    const RX0 = -3.5 * U, RZ0 = -1.15 + 0 * U;   /* 모았을 때(가로 8 × 세로 6) 왼쪽 위 */
    const tints = [['#c08a52', '#b98349'], ['#a86f3e', '#9f6737'], ['#cf9e66', '#c8955c']];
    const tiles = [];
    for(let j = 0; j < 3; j++) for(let r = 0; r < 4; r++) for(let c = 0; c < 4; c++){
      const n = j * 16 + r * 4 + c;
      const A = new THREE.Vector3(X0 + j * (SQ + GAPS) + c * U, 0.03, Z0 + r * U);
      const B = new THREE.Vector3(RX0 + (n % 8) * U, 0.03, RZ0 + Math.floor(n / 8) * U);
      const m = k.tile('', A.x, A.z, { w:S, d:S, h:0.08, rad:0.022, side:k.woodMat(tints[j][(r + c) % 2], [110, 70, 35]), y:0.03 });
      tiles.push({ m, A, B, j, n });
    }
    /* 한 변 4 — 첫 정사각형 밑 */
    const four = rcard(k, ['4'], X0 + 1.5 * U, Z0 + 4 * U + 0.2, { w:0.36, d:0.32, hmax:0.7 });
    /* 식 카드 */
    const cA = rcard(k, ['48 = 16 × 3'], -1.55, 0.95, { w:1.9, d:0.5, rot:0.02 });
    const cB = rcard(k, ['16 = 4', { sup:'2' }], -1.55, 1.58, { w:1.9, d:0.5, rot:-0.02 });
    const cC = rcard(k, [{ r:'48' }, ' = ', { r:'16' }, ' × ', { r:'3' }], 1.2, 0.95, { w:2.6, d:0.55, rot:-0.015 });
    const cD = rcard(k, ['= 4', { r:'3' }], 1.5, 1.6, { w:1.6, d:0.58, rot:0.02, edge:'#e2c98f', bg:'#f6e7c4' });
    /* 움직임: 셋으로 나뉜 타일이 한 덩어리(8 × 6 = 48)로 모였다가 → 다시 4 × 4 셋으로 → 정사각형마다 톡 → 식 카드 차례로 */
    const cards = [[four, 0.5], [cA, 0.56], [cB, 0.5], [cC, 0.74], [cD, 0.84]].map(([g, a]) => ({ g, a, y:g.position.y }));
    const v = new THREE.Vector3();
    k.onFrame(t => { const p = cyc(t, 10);
      tiles.forEach(o => { const d = o.n * 0.0015;
        const u = seg(p, 0.1 + d, 0.26 + d) * (1 - seg(p, 0.46 + d, 0.62 + d));
        const mv = hop(p, 0.1 + d, 0.26 + d) + hop(p, 0.46 + d, 0.62 + d);
        v.lerpVectors(o.A, o.B, u); const a = 0.66 + o.j * 0.05;
        o.m.position.set(v.x, 0.03 + 0.25 * mv + 0.14 * hop(p, a, a + 0.08), v.z); });
      cards.forEach(o => { o.g.position.y = o.y + 0.22 * hop(p, o.a, o.a + 0.1); }); });
    k.lights({ key:2.6, spot:16, envOpts:{ intensity:0.55 } });
  }},

  /* 제곱근의 곱셈과 나눗셈 — history: 한 변이 1인 정사각형의 대각선(제곱하면 2). hook: √2×√3=√6? stage ①: √3×√12=√36=6 */
  'M-17': { seed:217, caps:{ P:9, list:[
    [0.0, "한 변이 $1$인 정사각형의 대각선은 제곱하면 $2$ — 길이는 $\\sqrt{2}$입니다.", "The diagonal of a square with side $1$ squares to $2$: its length is $\\sqrt{2}$.", "边长为$1$的正方形，对角线的平方是$2$——长度是$\\sqrt{2}$。"],
    [0.3, "$\\sqrt{2}\\times\\sqrt{3}$은 근호 안의 수끼리 곱합니다: $\\sqrt{2\\times 3}=\\sqrt{6}$", "For $\\sqrt{2}\\times\\sqrt{3}$, multiply the numbers inside: $\\sqrt{2\\times 3}=\\sqrt{6}$", "$\\sqrt{2}\\times\\sqrt{3}$要把根号里的数相乘：$\\sqrt{2\\times 3}=\\sqrt{6}$"],
    [0.62, "$\\sqrt{3}\\times\\sqrt{12}=\\sqrt{36}=6$ — $36$은 완전제곱수라 정수가 됩니다.", "$\\sqrt{3}\\times\\sqrt{12}=\\sqrt{36}=6$: $36$ is a perfect square, so we get a whole number.", "$\\sqrt{3}\\times\\sqrt{12}=\\sqrt{36}=6$——$36$是完全平方数，所以得到整数。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.1, 0.1, 0.25], 5.5, 56);
    k.table();
    k.paper(5.8, 3.6, 0.1, 0.1, 0.01);
    /* 한 변이 1인 정사각형 나무판 + 대각선 황동 막대 */
    const L = 1.7, SX = -1.45, SZ = -0.05;
    const sq = new THREE.Mesh(k.rbox(L, 0.08, L, 0.03), k.woodMat('#c08a52', [110, 70, 35]));
    sq.position.set(SX, 0.03, SZ); sq.castShadow = sq.receiveShadow = true; scene.add(sq);
    const TY = 0.11, A = new THREE.Vector3(SX - L / 2 + 0.06, TY + 0.03, SZ + L / 2 - 0.06), Z = new THREE.Vector3(SX + L / 2 - 0.06, TY + 0.03, SZ - L / 2 + 0.06);
    const brass = k.metal('#c9a14f', 0.3);
    const dg = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(A, Z), 8, 0.03, 12), brass); dg.castShadow = true; scene.add(dg);
    [A, Z].forEach(q => { const c = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), brass); c.position.copy(q); scene.add(c); });
    const c1b = rcard(k, ['1'], SX, SZ + L / 2 + 0.32, { w:0.4, d:0.36, hmax:0.7 });
    const c1l = rcard(k, ['1'], SX - L / 2 - 0.32, SZ, { w:0.36, d:0.4, hmax:0.62 });
    const cr2 = rcard(k, [{ r:'2' }], SX + 0.34, SZ + 0.3, { w:0.6, d:0.4, hmax:0.62, y:TY, rot:0 });
    /* 식 카드 */
    const RX = 1.45;
    const cA = rcard(k, [{ r:'2' }, ' × ', { r:'3' }, ' = ', { r:'2 × 3' }], RX, -0.95, { w:2.7, d:0.55, rot:-0.015 });
    const cB = rcard(k, ['= ', { r:'6' }], RX + 0.4, -0.28, { w:1.3, d:0.55, rot:0.02, edge:'#e2c98f', bg:'#f6e7c4' });
    const cC = rcard(k, [{ r:'3' }, ' × ', { r:'12' }, ' = ', { r:'36' }], RX, 0.52, { w:2.7, d:0.55, rot:0.015 });
    const cD = rcard(k, ['= 6'], RX + 0.4, 1.2, { w:1.3, d:0.55, rot:-0.02, edge:'#e2c98f', bg:'#f6e7c4' });
    /* 움직임: 구슬이 대각선을 한 번 오가고(√2 카드 톡) → √2 × √3 카드들이 차례로 → √3 × √12 = √36 = 6 */
    const bd = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), new THREE.MeshPhysicalMaterial({ color:'#fff3d6', roughness:0.22, clearcoat:1 }));
    bd.castShadow = true; scene.add(bd);
    const line = new THREE.LineCurve3(A, Z);
    const put = u => { bd.position.copy(line.getPoint(u)); bd.position.y += 0.07; };
    put(0);
    const cards = [[c1b, 0.03], [c1l, 0.06], [cr2, 0.2], [cA, 0.32], [cB, 0.44], [cC, 0.64], [cD, 0.76]].map(([g, a]) => ({ g, a, y:g.position.y }));
    k.onFrame(t => { const p = cyc(t, 9);
      put(seg(p, 0.06, 0.2) * (1 - seg(p, 0.86, 0.98)));
      cards.forEach(o => { o.g.position.y = o.y + 0.2 * hop(p, o.a, o.a + 0.1); }); });
    k.lights({ key:2.6, spot:16, envOpts:{ intensity:0.55 } });
  }},

  /* 제곱근의 덧셈과 뺄셈 — hook: x+x=2x 처럼 √2 를 한 문자로. stage ①: 3√2+5√2=8√2, stage ②: √12+√3=2√3+√3=3√3 */
  'M-83': { seed:283, caps:{ P:10, list:[
    [0.0, "$x+x=2x$처럼, $\\sqrt{2}$를 하나의 문자로 봅니다: $\\sqrt{2}+\\sqrt{2}=2\\sqrt{2}$", "Like $x+x=2x$, treat $\\sqrt{2}$ as one letter: $\\sqrt{2}+\\sqrt{2}=2\\sqrt{2}$", "就像$x+x=2x$，把$\\sqrt{2}$看成一个字母：$\\sqrt{2}+\\sqrt{2}=2\\sqrt{2}$"],
    [0.1, "$3\\sqrt{2}$는 $\\sqrt{2}$가 $3$개, $5\\sqrt{2}$는 $\\sqrt{2}$가 $5$개입니다.", "$3\\sqrt{2}$ is three $\\sqrt{2}$'s; $5\\sqrt{2}$ is five $\\sqrt{2}$'s.", "$3\\sqrt{2}$是$3$个$\\sqrt{2}$，$5\\sqrt{2}$是$5$个$\\sqrt{2}$。"],
    [0.3, "모으면 $\\sqrt{2}$가 $8$개: $3\\sqrt{2}+5\\sqrt{2}=8\\sqrt{2}$ — 근호 안의 $2$는 그대로입니다.", "Together that is eight $\\sqrt{2}$'s: $3\\sqrt{2}+5\\sqrt{2}=8\\sqrt{2}$. The $2$ inside stays.", "合起来是$8$个$\\sqrt{2}$：$3\\sqrt{2}+5\\sqrt{2}=8\\sqrt{2}$——根号里的$2$不变。"],
    [0.72, "$\\sqrt{12}=2\\sqrt{3}$으로 먼저 정리하면 $\\sqrt{12}+\\sqrt{3}=3\\sqrt{3}$입니다.", "Simplify first, $\\sqrt{12}=2\\sqrt{3}$, so $\\sqrt{12}+\\sqrt{3}=3\\sqrt{3}$.", "先化简$\\sqrt{12}=2\\sqrt{3}$，所以$\\sqrt{12}+\\sqrt{3}=3\\sqrt{3}$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.1, 0.3], 5.5, 58);
    k.table();
    k.paper(5.9, 3.3, 0, 0.05, 0.01);
    /* √2 블록 — 3개(붉은 옻칠)와 5개(짙은 나무) */
    const T = 0.46, U = 0.53, RZ = -0.95, PLUS = 0.62;
    const x3 = i => -2.3 + i * U, x5 = i => -2.3 + 3 * U - U + PLUS + U + i * U;   /* 떨어져 있을 때 */
    const row0 = -3.5 * U;                                                           /* 모였을 때 8개 가운데 맞춤 */
    const sA = k.lacquer('#8e2a1c'), sB = k.woodMat('#8a5a33', [50, 25, 10]);
    const blocks = [];
    for(let i = 0; i < 3; i++) blocks.push({ m:rtile(k, [{ r:'2' }], x3(i), RZ, { w:T, d:T, side:sA }), a:x3(i), b:row0 + i * U });
    for(let i = 0; i < 5; i++) blocks.push({ m:rtile(k, [{ r:'2' }], x5(i), RZ, { w:T, d:T, side:sB }), a:x5(i), b:row0 + (3 + i) * U });
    const pX = (x3(2) + x5(0)) / 2, plus = rcard(k, ['+'], pX, RZ, { w:0.36, d:0.36, hmax:0.8 });
    /* 블록 아래 계수 카드 */
    const c3 = rcard(k, ['3', { r:'2' }], x3(1), RZ + 0.62, { w:0.9, d:0.44, rot:0.02 });
    const c5 = rcard(k, ['5', { r:'2' }], x5(2), RZ + 0.62, { w:0.9, d:0.44, rot:-0.02 });
    const c8 = rcard(k, ['= 8', { r:'2' }], 2.35, RZ + 0.62, { w:1.15, d:0.46, rot:0.02, edge:'#e2c98f', bg:'#f6e7c4' });
    /* 앞줄: x + x = 2x 와 √12 + √3 */
    const cx = rcard(k, ['x + x = 2x'], -1.75, 0.42, { w:1.7, d:0.5, rot:-0.02 });
    const cq = rcard(k, [{ r:'12' }, ' + ', { r:'3' }, ' = 2', { r:'3' }, ' + ', { r:'3' }, ' = 3', { r:'3' }], 0.6, 1.12, { w:3.6, d:0.56, rot:0.01 });
    const cs = rcard(k, [{ r:'2' }, ' + ', { r:'2' }, ' = 2', { r:'2' }], 1.05, 0.42, { w:2.2, d:0.5, rot:0.015 });
    /* 움직임: 3개·5개 무리가 톡 → + 가 비켜서고 두 무리가 한 줄(8개)로 모여 하나씩 세고 → 다시 제자리 → 아래 식 카드 */
    const plusY = plus.position.y;
    const cards = [[cx, 0.02], [cs, 0.06], [c3, 0.12], [c5, 0.16], [c8, 0.62], [cq, 0.82]].map(([g, a]) => ({ g, a, y:g.position.y }));
    k.onFrame(t => { const p = cyc(t, 10);
      const u = seg(p, 0.26, 0.4) * (1 - seg(p, 0.7, 0.84));
      blocks.forEach((o, i) => { const grp = i < 3 ? 0.12 : 0.16, cnt = 0.44 + i * 0.022;
        o.m.position.x = o.a + (o.b - o.a) * u;
        o.m.position.y = 0.03 + 0.18 * hop(p, grp, grp + 0.08) + 0.16 * hop(p, cnt, cnt + 0.06); });
      const pu = seg(p, 0.22, 0.3) * (1 - seg(p, 0.8, 0.88));
      plus.position.set(pX, plusY + 0.9 * pu, RZ - 0.5 * pu); plus.scale.setScalar(Math.max(0.001, 1 - pu));
      cards.forEach(o => { o.g.position.y = o.y + 0.2 * hop(p, o.a, o.a + 0.1); }); });
    k.lights({ key:2.6, spot:16, envOpts:{ intensity:0.55 } });
  }},
};
