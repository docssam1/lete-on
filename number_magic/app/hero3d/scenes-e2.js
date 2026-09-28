/* 초등 대표 3D 장면 E2 — 규칙은 app/hero3d/scenes.js 머리말과 같다. 자막은 해요체. */
import { ease, seg, cyc, hop } from './anim.js';

/* 카드 뒤집기 — rz 로 반 바퀴 돌리면 뒷면(o.back)이 위로 온다. 뒤집힌 카드는 두께 H 만큼 올려 눕힌다 */
const flipPose = (g, u, H, lift, y0) => { g.rotation.z = -Math.PI * u; g.position.y = (y0 || 0) + H * u + (lift || 0.5) * Math.sin(Math.PI * u); };

/* 카드 — 글자 크기를 세계 단위 fs 로 준다(카드 폭이 달라도 같은 글자 크기가 되게, 판 해상도를 크기에 비례시킨다) */
const PX = 600;
const cardF = (k, parts, x, z, o) => {
  o = Object.assign({ w:1, d:0.7, h:0.04, fs:0.3 }, o);
  const q = Object.assign({}, o, { pw:Math.round(PX * o.w), ph:Math.round(PX * o.d), size:Math.round(o.fs * PX / 0.94) });
  if(o.back) q.backOpts = Object.assign({}, o.backOpts, { size:Math.round((o.backFs || o.fs) * PX / 0.94) });
  return k.card(parts, x, z, q);
};
/* 윗면에 수가 새겨진 블록 — 글자 크기 fs(세계 단위) */
const tileF = (k, txt, x, z, o) => { o = Object.assign({ w:0.6, fs:0.3 }, o); return k.tile(txt, x, z, Object.assign({}, o, { size:Math.round(o.fs * 512 / (0.9 * o.w)) })); };

/* 윗면에 바로 선 글자(로마 수처럼 이탤릭이면 안 되는 글자)를 얹은 나무 블록 */
const uprightBlock = (k, txt, x, z, o) => {
  const { THREE } = k; o = o || {};
  const w = o.w || 0.7, d = o.d || 0.7, h = o.h || 0.22;
  const g = k.tile(null, x, z, { w, d, h, side:o.side, wood:o.wood });
  const tex = k.canvasTex(512, Math.round(512 * d / w), (c, cw, ch) => {
    c.fillStyle = o.bg || '#f3e7cf'; c.fillRect(0, 0, cw, ch);
    c.fillStyle = o.color || '#2b2118'; c.textBaseline = 'middle';
    k.mathText(c, txt, cw / 2, ch / 2 + ch * 0.03, (o.fs || 0.4) * cw / (0.86 * w), { upright:true });
  });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.86, d * 0.86), new THREE.MeshStandardMaterial({ map:tex, roughness:0.6 }));
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.003; top.receiveShadow = true; g.add(top);
  return g;
};

export const SCENES_E2 = {

  /* 은하철도 999 — hook: 999 + 1 = 1000. stage ①: 348 + 999 = 348 + 1000 − 1 = 1347 */
  'A-26': { seed:2601, caps:{ P:8, list:[
    [0.0, "$999$에 $1$을 더하면 딱 $1000$이 돼요.", "Add $1$ to $999$ and you get exactly $1000$.", "$999$加$1$正好是$1000$。"],
    [0.38, "그래서 $999$는 $1000-1$로 바꿔 쓸 수 있어요.", "So $999$ can be written as $1000-1$.", "所以$999$可以写成$1000-1$。"],
    [0.6, "$348+1000=1348$을 먼저 하고, $1$을 빼요.", "First $348+1000=1348$, then take away $1$.", "先算$348+1000=1348$，再减$1$。"],
    [0.8, "그래서 $348+999=1347$이에요.", "So $348+999=1347$.", "所以$348+999=1347$。"]
  ]},
    build(k){
    k.frame([0, 0, -0.5], 5.4, 58);
    k.table();
    /* 뒷줄: 나무 블록 999 + 1 = 1000 */
    const BZ = -1.2, BO = { h:0.24, d:0.8, fs:0.4 };
    const blocks = [['999', -1.85, 1.15], ['+', -0.95, 0.55], ['1', -0.3, 0.65], ['=', 0.35, 0.55], ['1000', 1.45, 1.45]]
      .map(([t, x, w]) => tileF(k, t, x, BZ, Object.assign({ w, wood:'#d9b27c' }, BO)));
    /* 앞줄: 식 카드 348 + 999 = 1347 — 999 카드 뒷면은 1000 − 1 */
    const CZ = 0.45, CO = { h:0.04, d:0.85, fs:0.36 };
    cardF(k, ['348'], -2.1, CZ, Object.assign({}, CO, { w:1.1 }));
    cardF(k, ['+'], -1.28, CZ, Object.assign({}, CO, { w:0.46 }));
    const nine = cardF(k, ['999'], -0.22, CZ, Object.assign({}, CO, { w:1.55, back:['1000 − 1'], backOpts:{ bg:'#f3d9b0' }, backFs:0.3 }));
    cardF(k, ['='], 0.84, CZ, Object.assign({}, CO, { w:0.46 }));
    const ans = cardF(k, ['1347'], 1.8, CZ, Object.assign({}, CO, { w:1.3, bg:'#f1e0b8' }));
    /* 움직임: 블록 999·+·1·=·1000 이 차례로 들썩 → 999 카드가 뒤집혀 1000 − 1 → 답 1347 이 들썩 → 다시 999 로 */
    const by = blocks.map(b => b.position.y);
    k.onFrame(t => { const p = cyc(t, 8);
      blocks.forEach((b, i) => { const a = 0.04 + i * 0.06; b.position.y = by[i] + 0.2 * hop(p, a, a + 0.1); });
      flipPose(nine, seg(p, 0.4, 0.52) * (1 - seg(p, 0.86, 0.97)), 0.04, 0.5);
      ans.position.y = 0.22 * hop(p, 0.7, 0.8); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, -0.2], spot:28 });
  }},

  /* 고대의 수(로마 수) — hook: Ⅷ도 8, 8도 8. stage ①: VIII = V + I + I + I = 5 + 1 + 1 + 1 = 8 */
  'A-35': { seed:3501, caps:{ P:8, list:[
    [0.0, "$\\mathrm{VIII}$도 $8$, $8$도 $8$이에요. 모양만 달라요.", "$\\mathrm{VIII}$ is $8$ and $8$ is $8$: only the shapes differ.", "$\\mathrm{VIII}$是$8$，$8$也是$8$，只是样子不同。"],
    [0.2, "$\\mathrm{V}=5$, $\\mathrm{I}=1$이에요.", "$\\mathrm{V}=5$ and $\\mathrm{I}=1$.", "$\\mathrm{V}=5$，$\\mathrm{I}=1$。"],
    [0.45, "큰 기호가 앞에 있으면 더해요: $5+1+1+1=8$", "A big symbol in front means add: $5+1+1+1=8$.", "大的符号在前就相加：$5+1+1+1=8$。"],
    [0.75, "작은 기호가 앞에 오면 빼요: $\\mathrm{IV}=5-1=4$", "A small symbol in front means subtract: $\\mathrm{IV}=5-1=4$.", "小的符号在前就相减：$\\mathrm{IV}=5-1=4$。"]
  ]},
    build(k){
    k.frame([0, 0, -0.32], 5.4, 58);
    k.table();
    /* 뒷줄: 로마 수 블록 V I I I = 8 */
    const BZ = -1.15, red = k.lacquer('#8e2a1c');
    const xs = [-2.05, -1.25, -0.55, 0.15];
    const romans = ['V', 'I', 'I', 'I'].map((t, i) => uprightBlock(k, t, xs[i], BZ, { w:i ? 0.6 : 0.75, d:0.8, h:0.26, fs:0.42 }));
    uprightBlock(k, '=', 0.95, BZ, { w:0.55, d:0.8, h:0.26, fs:0.4 });
    const eight = uprightBlock(k, '8', 1.8, BZ, { w:0.8, d:0.8, h:0.26, fs:0.46, side:red });
    /* 가운데 줄: 값 카드 5 1 1 1 (블록 바로 밑) */
    const vals = ['5', '1', '1', '1'].map((t, i) => cardF(k, [t], xs[i], -0.15, { w:0.56, d:0.66, fs:0.36 }));
    cardF(k, ['8'], 1.8, -0.15, { w:0.56, d:0.66, fs:0.36, bg:'#f1e0b8' });
    /* 앞줄: 식 */
    cardF(k, ['5 + 1 + 1 + 1 = 8'], -0.1, 0.95, { w:4.0, d:0.72, fs:0.36, bg:'#f1e0b8' });
    /* 움직임: V·I·I·I 블록과 그 밑 값 카드가 차례로 들썩 → 8 블록이 크게 들썩 */
    const ry = romans.map(b => b.position.y);
    k.onFrame(t => { const p = cyc(t, 8);
      romans.forEach((b, i) => { const a = 0.2 + i * 0.08; b.position.y = ry[i] + 0.22 * hop(p, a, a + 0.12); vals[i].position.y = 0.14 * hop(p, a + 0.02, a + 0.12); });
      eight.position.y = 0.3 * hop(p, 0.56, 0.72); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, -0.2], spot:28 });
  }},

  /* 풀풀곱셈법 — stage ②: 가로 20|3, 세로 40|5 로 자른 직사각형의 네 방 800·100·120·15, 합 1035 */
  'C-10': { seed:1001, caps:{ P:8, list:[
    [0.0, "$23\\times45$를 $(20+3)\\times(40+5)$로 모두 풀어요.", "Break both apart: $23\\times45=(20+3)\\times(40+5)$.", "把两个数都拆开：$23\\times45=(20+3)\\times(40+5)$。"],
    [0.12, "방이 $4$개 생겨요: $800$, $100$, $120$, $15$", "That makes $4$ rooms: $800$, $100$, $120$, $15$.", "得到$4$个格子：$800$、$100$、$120$、$15$。"],
    [0.55, "큰 조각부터 더해요: $800+100+120+15=1035$", "Add the big pieces first: $800+100+120+15=1035$.", "从大块加起：$800+100+120+15=1035$。"],
    [0.78, "네 방을 모두 더하면 전체 넓이, $23\\times45=1035$예요.", "All four rooms make the whole area: $23\\times45=1035$.", "四个格子合起来就是整个面积：$23\\times45=1035$。"]
  ]},
    build(k){
    k.frame([-0.35, 0, 0.05], 5.3, 58);
    k.table();
    /* 격자: 가로 20 | 3, 세로 40 | 5 (눈에 보이게 비율은 조금 조정) */
    const X20 = -0.85, X3 = 0.7, Z40 = -0.65, Z5 = 0.52, TO = { h:0.14, fs:0.4 };
    const rooms = [
      tileF(k, '800', X20, Z40, Object.assign({ w:2.2, d:1.6, wood:'#d9b27c' }, TO, { fs:0.55 })),
      tileF(k, '100', X20, Z5, Object.assign({ w:2.2, d:0.62, wood:'#c99a60' }, TO)),
      tileF(k, '120', X3, Z40, Object.assign({ w:0.78, d:1.6, wood:'#c99a60' }, TO, { fs:0.24 })),
      tileF(k, '15', X3, Z5, Object.assign({ w:0.78, d:0.62, wood:'#b7864e' }, TO, { fs:0.3 }))];
    /* 가장자리 수: 위 20·3, 왼쪽 40·5 */
    const LO = { h:0.03, d:0.46, fs:0.3, bg:'#f1e0b8' };
    cardF(k, ['20'], X20, -1.75, Object.assign({ w:0.7 }, LO));
    cardF(k, ['3'], X3, -1.75, Object.assign({ w:0.5 }, LO));
    cardF(k, ['40'], -2.35, Z40, Object.assign({}, LO, { w:0.62 }));
    cardF(k, ['5'], -2.35, Z5, Object.assign({}, LO, { w:0.62 }));
    cardF(k, ['23 × 45 = 1035'], -0.35, 1.42, { w:3.3, d:0.66, fs:0.34 });
    /* 움직임: 방이 800 → 100 → 120 → 15 차례로 들썩 — 큰 조각부터 더하기 */
    const ry = rooms.map(r => r.position.y);
    k.onFrame(t => { const p = cyc(t, 8);
      rooms.forEach((r, i) => { const a = 0.14 + i * 0.1; r.position.y = ry[i] + 0.2 * hop(p, a, a + 0.12); }); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[-0.3, 0, 0], spot:28 });
  }},

  /* 분해 나눗셈 — stage ①: 312 ÷ 3 = (300 + 12) ÷ 3 = 100 + 4 = 104. 백 판 3장과 낱개 12개를 세 몫으로 */
  'C-18': { seed:1801, caps:{ P:8, list:[
    [0.0, "$312$를 나누기 쉬운 $300$과 $12$로 쪼개요.", "Split $312$ into easy pieces: $300$ and $12$.", "把$312$拆成好除的$300$和$12$。"],
    [0.25, "$300\\div3=100$, $12\\div3=4$예요.", "$300\\div3=100$ and $12\\div3=4$.", "$300\\div3=100$，$12\\div3=4$。"],
    [0.52, "몫을 더하면 $100+4=104$, 그래서 $312\\div3=104$예요.", "Add the answers: $100+4=104$, so $312\\div3=104$.", "商相加：$100+4=104$，所以$312\\div3=104$。"],
    [0.76, "$\\div$의 점 두 개는 분수를 닮았어요: $312\\div3=\\dfrac{312}{3}$", "The two dots of $\\div$ look like a fraction: $312\\div3=\\dfrac{312}{3}$.", "$\\div$的两个点像分数：$312\\div3=\\dfrac{312}{3}$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, 0.3], 5.6, 58);
    k.table();
    const C = 0.13;                         /* 낱개 한 칸 */
    const flatTex = k.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#e8c890'; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(90,55,20,.55)'; g.lineWidth = 3; for(let i = 1; i < 10; i++){ const v = i * w / 10; g.beginPath(); g.moveTo(v, 0); g.lineTo(v, h); g.stroke(); g.beginPath(); g.moveTo(0, v); g.lineTo(w, v); g.stroke(); } });
    const wood = k.woodMat('#e3bd84', [140, 95, 45]);
    const flat = (x, z) => { const g = new THREE.Group();
      const b = new THREE.Mesh(k.rbox(C * 10, C, C * 10, 0.02), wood); b.castShadow = b.receiveShadow = true; g.add(b);
      const t = new THREE.Mesh(new THREE.PlaneGeometry(C * 10 - 0.02, C * 10 - 0.02), new THREE.MeshStandardMaterial({ map:flatTex, roughness:0.6 }));
      t.rotation.x = -Math.PI / 2; t.position.y = C + 0.002; t.receiveShadow = true; g.add(t);
      g.position.set(x, 0, z); scene.add(g); return g; };
    const cube = (x, z) => { const m = new THREE.Mesh(k.rbox(C * 0.96, C * 0.96, C * 0.96, 0.015), wood); m.castShadow = m.receiveShadow = true;
      const g = new THREE.Group(); g.add(m); g.position.set(x, 0, z); scene.add(g); return g; };
    /* 세 몫: 백 판 하나 + 낱개 넷 = 104 */
    const GX = [-1.8, 0, 1.8], GZ = -0.85;
    const shares = GX.map(x => { const items = [flat(x, GZ)];
      for(let i = 0; i < 4; i++) items.push(cube(x - 0.3 + i * 0.2, GZ + 0.82));
      cardF(k, ['100 + 4'], x, GZ + 1.42, { w:1.4, d:0.52, fs:0.3 });
      return items; });
    cardF(k, ['312 ÷ 3 = 104'], 0, 1.45, { w:3.4, d:0.7, fs:0.38, bg:'#f1e0b8' });
    /* 움직임: 몫마다 백 판과 낱개 넷이 차례로 들썩 */
    const y0 = shares.map(s => s.map(o => o.position.y));
    k.onFrame(t => { const p = cyc(t, 8);
      shares.forEach((s, i) => s.forEach((o, j) => { const a = 0.08 + i * 0.12 + (j ? 0.05 + j * 0.02 : 0); o.position.y = y0[i][j] + (j ? 0.16 : 0.2) * hop(p, a, a + 0.12); })); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0], spot:28 });
  }},

  /* 분수 덧뺄셈(같은 분모) — stage ①②: 7조각 피자, 2조각 + 3조각 = 5조각, 2/7 + 3/7 = 5/7 */
  'C-21': { seed:2101, caps:{ P:8, list:[
    [0.0, "피자 한 판을 똑같이 $7$조각으로 잘랐어요.", "A pizza is cut into $7$ equal slices.", "一张披萨平均切成$7$块。"],
    [0.15, "$2$조각은 $\\dfrac{2}{7}$, $3$조각은 $\\dfrac{3}{7}$이에요.", "$2$ slices are $\\dfrac{2}{7}$ and $3$ slices are $\\dfrac{3}{7}$.", "$2$块是$\\dfrac{2}{7}$，$3$块是$\\dfrac{3}{7}$。"],
    [0.5, "합치면 $5$조각이라 $\\dfrac{2}{7}+\\dfrac{3}{7}=\\dfrac{5}{7}$이에요.", "Together that is $5$ slices: $\\dfrac{2}{7}+\\dfrac{3}{7}=\\dfrac{5}{7}$.", "合起来是$5$块：$\\dfrac{2}{7}+\\dfrac{3}{7}=\\dfrac{5}{7}$。"],
    [0.76, "조각 크기는 그대로라서 분모 $7$은 더하지 않아요.", "The slice size stays the same, so the $7$ is not added.", "每块大小不变，所以分母$7$不相加。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, 0.15], 5.6, 56);
    k.table();
    const R = 1.1, CZ = -0.55, A = Math.PI * 2 / 7, BASE = Math.PI - 6 * A;
    /* 나무 도마 */
    const board = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.4, R + 0.4, 0.08, 64), k.woodMat('#b98a55', [110, 70, 35]));
    board.position.set(0, 0.04, CZ); board.castShadow = board.receiveShadow = true; scene.add(board);
    /* 피자 윗면(치즈·토마토·페퍼로니·가장자리 빵) — 조각마다 같은 원형 좌표를 쓰므로 한 장으로 이어진다 */
    const topTex = k.canvasTex(1024, 1024, (g, w, h) => {
      g.fillStyle = '#c98a45'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#d9562e'; g.beginPath(); g.arc(w / 2, h / 2, w * 0.44, 0, Math.PI * 2); g.fill();
      for(let i = 0; i < 900; i++){ const a = k.rnd() * Math.PI * 2, r = Math.sqrt(k.rnd()) * w * 0.43; g.fillStyle = `rgba(${245 + k.rnd() * 10},${200 + k.rnd() * 40},${90 + k.rnd() * 60},${0.35 + k.rnd() * 0.4})`;
        g.beginPath(); g.ellipse(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r, 8 + k.rnd() * 18, 5 + k.rnd() * 10, k.rnd() * 3, 0, Math.PI * 2); g.fill(); }
      for(let i = 0; i < 24; i++){ const a = k.rnd() * Math.PI * 2, r = (0.08 + k.rnd() * 0.3) * w; g.fillStyle = '#9b2a1c';
        g.beginPath(); g.arc(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r, w * 0.035, 0, Math.PI * 2); g.fill(); }
      const gr = g.createRadialGradient(w / 2, h / 2, w * 0.42, w / 2, h / 2, w * 0.5); gr.addColorStop(0, 'rgba(120,70,20,0)'); gr.addColorStop(1, 'rgba(120,70,20,.5)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    const topM = new THREE.MeshStandardMaterial({ map:topTex, roughness:0.7 }), crust = new THREE.MeshStandardMaterial({ color:'#c98a45', roughness:0.8 });
    const slices = [];
    for(let i = 0; i < 7; i++){
      const m = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.09, 24, 1, false, BASE + i * A + 0.02, A - 0.04), [crust, topM, crust]);
      m.castShadow = m.receiveShadow = true;
      const g = new THREE.Group(); g.add(m); const c = BASE + (i + 0.5) * A; g.userData.dir = new THREE.Vector3(Math.sin(c), 0, Math.cos(c));
      g.position.set(0, 0.125, CZ); scene.add(g); slices.push(g); }
    /* 2조각 무리(0,1)와 3조각 무리(2,3,4)를 살짝 빼 둔다 — 두 무리의 가운데 방향으로 */
    const dirOf = ids => ids.reduce((v, i) => v.add(slices[i].userData.dir), new THREE.Vector3()).normalize();
    const GA = [0, 1], GB = [2, 3, 4], dA = dirOf(GA), dB = dirOf(GB), OUT = 0.2;
    const place = (ids, d, s, y) => ids.forEach(i => slices[i].position.set(d.x * s, 0.125 + y, CZ + d.z * s));
    place(GA, dA, OUT, 0); place(GB, dB, OUT, 0);
    /* 식 카드 */
    cardF(k, [{ n:'2', d:'7' }, '+', { n:'3', d:'7' }, '=', { n:'5', d:'7' }], 0, 1.55, { w:3.0, d:0.9, fs:0.34, bg:'#f1e0b8' });
    /* 움직임: 2조각 무리 → 3조각 무리가 차례로 들렸다 놓이고, 둘이 함께 들썩(합쳐서 5조각) */
    k.onFrame(t => { const p = cyc(t, 8);
      const a = hop(p, 0.15, 0.3), b = hop(p, 0.32, 0.47), c = hop(p, 0.52, 0.7);
      place(GA, dA, OUT + 0.15 * a, 0.25 * Math.max(a, c)); place(GB, dB, OUT + 0.15 * b, 0.25 * Math.max(b, c)); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0], spot:28 });
  }},

  /* 창살 곱셈법 — stage ③: 342 × 67. 칸마다 곱(18 24 12 / 21 28 14), 대각선 띠를 더하면 2 2 9 1 4 */
  'C-14': { seed:1401, caps:{ P:8, list:[
    [0.0, "$342\\times67$: 가로 $3$칸, 세로 $2$칸에 빗금을 그어요.", "$342\\times67$: $3$ columns, $2$ rows, a slash in every box.", "$342\\times67$：横$3$格、竖$2$格，每格画斜线。"],
    [0.14, "칸마다 곱을 써요: $3\\times6=18$, $4\\times7=28$…", "Write each product in its box: $3\\times6=18$, $4\\times7=28$…", "每格写乘积：$3\\times6=18$，$4\\times7=28$…"],
    [0.36, "오른쪽 아래 띠부터 더하고, $10$이 넘으면 다음 띠로 올려요.", "Add the stripes from the bottom right; carry past $10$ to the next stripe.", "从右下的斜条开始加，满$10$就进到下一条。"],
    [0.78, "왼쪽 위부터 읽으면 $342\\times67=22914$예요.", "Read from the top left: $342\\times67=22914$.", "从左上读起：$342\\times67=22914$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, 0.3], 5.5, 60);
    k.table();
    const PW = 4.2, PD = 3.1, PZ = -0.35, CW = 1400, CH = Math.round(1400 * PD / PW), S = 290, GX = 300, GY = 150;
    const top = [3, 4, 2], side = [6, 7];
    /* 띠 d (0 = 일의 자리) 는 격자 안에서 (4−d)S ≤ x+y ≤ (5−d)S, 답 숫자 자리까지 이어진다 */
    const band = (g, d) => { g.save(); g.beginPath(); g.rect(GX - S * 0.8, GY, S * 3.8, S * 2.8); g.clip();
      g.translate(GX, GY); g.beginPath(); g.moveTo((4 - d) * S + 3 * S, -3 * S); g.lineTo((5 - d) * S + 3 * S, -3 * S); g.lineTo((5 - d) * S - 5 * S, 5 * S); g.lineTo((4 - d) * S - 5 * S, 5 * S); g.closePath(); g.fill(); g.restore(); };
    const res = [4, 1, 9, 2, 2];   /* 띠 d 의 답 숫자(올림 반영): 4, 8+2+1=11→1, 1+4+2+1+1=9, 8+2+2=12→2, 1+1=2 */
    const resPos = d => d < 3 ? [GX + (2.1 - d) * S, GY + 2.42 * S] : [GX - 0.42 * S, GY + (4.9 - d) * S];
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => {
      g.strokeStyle = 'rgba(40,28,18,.85)'; g.lineWidth = 6; g.strokeRect(GX, GY, 3 * S, 2 * S);
      g.lineWidth = 4; for(let c = 1; c < 3; c++){ g.beginPath(); g.moveTo(GX + c * S, GY); g.lineTo(GX + c * S, GY + 2 * S); g.stroke(); }
      g.beginPath(); g.moveTo(GX, GY + S); g.lineTo(GX + 3 * S, GY + S); g.stroke();
      g.strokeStyle = 'rgba(150,40,30,.7)'; g.lineWidth = 3;
      for(let r = 0; r < 2; r++) for(let c = 0; c < 3; c++){ g.beginPath(); g.moveTo(GX + (c + 1) * S, GY + r * S); g.lineTo(GX + c * S, GY + (r + 1) * S); g.stroke(); }
      /* 빗금을 격자 밖 답 자리까지 살짝 잇는다 */
      g.setLineDash([10, 10]); g.strokeStyle = 'rgba(150,40,30,.45)';
      for(let c = 0; c < 3; c++){ g.beginPath(); g.moveTo(GX + c * S, GY + 2 * S); g.lineTo(GX + (c - 0.55) * S, GY + 2.55 * S); g.stroke(); }
      for(let r = 0; r < 2; r++){ g.beginPath(); g.moveTo(GX, GY + (r + 1) * S); g.lineTo(GX - 0.55 * S, GY + (r + 1.55) * S); g.stroke(); }
      g.setLineDash([]);
      top.forEach((v, c) => ink(g, String(v), GX + (c + 0.5) * S, GY - 0.36 * S, 140));
      side.forEach((v, r) => ink(g, String(v), GX + 3.36 * S, GY + (r + 0.5) * S, 140));
      ink(g, '×', GX + 3.36 * S, GY - 0.36 * S, 110);
      side.forEach((m, r) => top.forEach((n, c) => { const p = m * n;
        ink(g, String(Math.floor(p / 10)), GX + (c + 0.3) * S, GY + (r + 0.3) * S, 100);
        ink(g, String(p % 10), GX + (c + 0.7) * S, GY + (r + 0.7) * S, 100); }));
      res.forEach((v, d) => { const [x, y] = resPos(d); ink(g, String(v), x, y, 125, { color:'rgb(120,30,20)' }); });
    });
    /* 띠 강조막 — 종이와 같은 크기·같은 자리, 띠 하나씩 */
    const glows = [0, 1, 2, 3, 4].map(d => {
      const tex = k.canvasTex(CW, CH, (g) => { g.clearRect(0, 0, CW, CH); g.fillStyle = 'rgba(255,200,60,1)'; band(g, d); });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(PW, PD), new THREE.MeshBasicMaterial({ map:tex, transparent:true, opacity:0, depthWrite:false }));
      m.rotation.x = -Math.PI / 2; m.position.set(0, 0.05, PZ); scene.add(m); return m; });
    cardF(k, ['342 × 67 = 22914'], 0, 1.72, { w:3.3, d:0.6, fs:0.32, bg:'#f1e0b8' });
    /* 움직임: 오른쪽 아래 띠(일의 자리)부터 왼쪽 위 띠까지 차례로 빛난다 */
    k.onFrame(t => { const p = cyc(t, 8);
      glows.forEach((m, d) => { const a = 0.36 + d * 0.08; m.material.opacity = 0.38 * hop(p, a, a + 0.12); }); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0], spot:26 });
  }},

  /* 약분 나눗셈 — stage ①: 사탕 84개를 12명이, 42개를 6명이 … 84 ÷ 12 = 42 ÷ 6 = 21 ÷ 3 = 7 */
  'C-19': { seed:1901, caps:{ P:8, list:[
    [0.0, "사탕 $84$개를 $12$명이 나누면 한 사람에 몇 개일까요?", "$84$ candies shared by $12$ people: how many each?", "$84$颗糖分给$12$个人，每人几颗？"],
    [0.22, "양쪽을 $2$로 나누면 $42\\div6$, 또 $2$로 나누면 $21\\div3$이에요.", "Halve both: $42\\div6$. Halve again: $21\\div3$.", "两边都除以$2$：$42\\div6$，再除以$2$：$21\\div3$。"],
    [0.52, "사탕 $21$개를 $3$명이 나누면 한 사람에 $7$개예요.", "$21$ candies for $3$ people is $7$ each.", "$21$颗糖分给$3$个人，每人$7$颗。"],
    [0.76, "양쪽을 똑같이 줄여도 몫은 그대로, $84\\div12=7$이에요.", "Shrinking both sides the same keeps the answer: $84\\div12=7$.", "两边同样缩小，商不变：$84\\div12=7$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, -0.15], 6.5, 56);
    k.table();
    /* 사탕 — 동그란 알 + 양쪽 비틀린 포장 */
    const cols = ['#d23b3b', '#f0a21f', '#3a8fd0', '#48a64b', '#b04fc0'];
    const wrapM = cols.map(c => k.plastic(c, 0.25));
    const candy = (x, z, ci, rot) => { const g = new THREE.Group();
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), wrapM[ci]); b.scale.set(1.25, 0.9, 1); g.add(b);
      [-1, 1].forEach(s => { const e = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.13, 16), wrapM[ci]); e.rotation.z = s * Math.PI / 2; e.position.x = s * 0.18; g.add(e); });
      g.children.forEach(m => { m.castShadow = m.receiveShadow = true; });
      g.position.set(x, 0.1, z); g.rotation.y = rot; scene.add(g); return g; };
    /* 세 사람 몫: 7개씩 (가운데 1 + 둘레 6) — 서로 겹치지 않게 넉넉히 */
    const GX = [-2.0, 0, 2.0], GZ = -1.15, groups = GX.map((x, gi) => {
      const pos = [[0, 0]]; for(let i = 0; i < 6; i++){ const a = i * Math.PI / 3 + 0.3; pos.push([Math.cos(a) * 0.48, Math.sin(a) * 0.4]); }
      return pos.map(([dx, dz], i) => candy(x + dx, GZ + dz, (gi * 2 + i) % cols.length, 0.2 + (k.rnd() - 0.5) * 0.8)); });
    /* 식 카드: 84 ÷ 12 = 42 ÷ 6 = 21 ÷ 3 = 7 */
    const CZ = 0.6, CO = { d:0.8, fs:0.34 };
    const row = [['84 ÷ 12', 1.35], ['=', 0.4], ['42 ÷ 6', 1.15], ['=', 0.4], ['21 ÷ 3', 1.15], ['=', 0.4], ['7', 0.6]];
    let x = -(row.reduce((a, r) => a + r[1], 0) + 0.1 * (row.length - 1)) / 2;
    const cards = row.map(([t, w], i) => { const c = cardF(k, [t], x + w / 2, CZ, Object.assign({ w }, CO, i === 6 ? { bg:'#f1e0b8', fs:0.4 } : {})); x += w + 0.1; return c; });
    const big = [0, 2, 4, 6].map(i => cards[i]);
    /* 움직임: 84÷12 → 42÷6 → 21÷3 카드가 차례로 들썩 → 세 사람 몫 사탕이 들썩 → 답 7 */
    const cy0 = groups.map(g => g.map(c => c.position.y));
    k.onFrame(t => { const p = cyc(t, 8);
      big.slice(0, 3).forEach((c, i) => { const a = 0.22 + i * 0.09; c.position.y = 0.18 * hop(p, a, a + 0.12); });
      groups.forEach((g, gi) => g.forEach((c, j) => { const a = 0.52 + gi * 0.06; c.position.y = cy0[gi][j] + 0.18 * hop(p, a, a + 0.12); }));
      big[3].position.y = 0.24 * hop(p, 0.74, 0.86); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0], spot:28 });
  }},

  /* 자릿수 예측 마법 — stage ②: 47 × 38, 십의 자리끼리 40 × 30 = 1200 → 네 자리, 실제로 1786 */
  'C-09': { seed:901, caps:{ P:8, list:[
    [0.0, "$47\\times38$의 답은 몇 자리 수일까요?", "How many digits will $47\\times38$ have?", "$47\\times38$的答案是几位数？"],
    [0.2, "십의 자리끼리 곱해 봐요: $40\\times30=1200$", "Multiply the tens first: $40\\times30=1200$.", "先把十位相乘：$40\\times30=1200$。"],
    [0.42, "$1200$보다 크니까 답은 네 자리예요.", "It is bigger than $1200$, so the answer has four digits.", "比$1200$大，所以答案是四位数。"],
    [0.66, "계산하면 $47\\times38=1786$, 예측대로 네 자리예요.", "Working it out: $47\\times38=1786$, four digits as predicted.", "算出来$47\\times38=1786$，果然是四位数。"]
  ]},
    build(k){
    k.frame([0, 0, -0.1], 5.3, 62);
    k.table();
    /* 뒷줄: 어림 카드 */
    const est = cardF(k, ['40 × 30 = 1200'], 0, -1.3, { w:3.2, d:0.8, fs:0.4 });
    /* 앞줄: 47 × 38 = 과 네 자리 숫자 카드 (뒷면은 ?) */
    const CZ = 0.7;
    cardF(k, ['47 × 38 ='], -1.4, CZ, { w:2.2, d:0.9, fs:0.4 });
    const digits = ['1', '7', '8', '6'].map((t, i) => cardF(k, [t], 0.3 + i * 0.66, CZ, { w:0.58, d:0.9, h:0.06, fs:0.5, back:['?'], backOpts:{ bg:'#e3d2ae' }, bg:'#f1e0b8' }));
    /* 움직임: 숫자 카드가 뒤집혀 ? → 어림 카드가 들썩(네 자리!) → 한 장씩 다시 뒤집혀 1 7 8 6 */
    k.onFrame(t => { const p = cyc(t, 8);
      est.position.y = 0.22 * hop(p, 0.22, 0.4);
      digits.forEach((c, i) => { const u = seg(p, 0.04, 0.16) * (1 - seg(p, 0.62 + i * 0.07, 0.72 + i * 0.07)); flipPose(c, u, 0.06, 0.4); }); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, -0.2], spot:28 });
  }}
};
