/* 초등 대표 3D 장면 E3 — 규칙은 app/hero3d/scenes.js 머리말과 같다. 자막은 해요체. */
import { ease, seg, cyc, hop } from './anim.js';

/* 카드 — 글자 크기를 세계 단위 fs 로 준다(카드 폭이 달라도 같은 글자 크기가 되게) */
const PX = 600;
const cardF = (k, parts, x, z, o) => {
  o = Object.assign({ w:1, d:0.7, h:0.04, fs:0.3 }, o);
  return k.card(parts, x, z, Object.assign({}, o, { pw:Math.round(PX * o.w), ph:Math.round(PX * o.d), size:Math.round(o.fs * PX / 0.94) }));
};
/* 윗면에 수가 새겨진 블록 — 글자 크기 fs(세계 단위) */
const tileF = (k, txt, x, z, o) => { o = Object.assign({ w:0.6, fs:0.3 }, o); return k.tile(txt, x, z, Object.assign({}, o, { size:Math.round(o.fs * 512 / (0.9 * o.w)) })); };
const LIGHT = { key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0], spot:28 };

export const SCENES_E3 = {

  /* 소수를 더하기 — stage ①: 2.3 + 1.4, 소수 부분 0.3 + 0.4 = 0.7, 자연수 부분 2 + 1 = 3, 합 3.7 */
  'A-36': { seed:3601, caps:{ P:8, list:[
    [0.0, "$2.3+1.4$는 소수점을 기준으로 나눠서 더해요.", "Split $2.3+1.4$ at the decimal point.", "以小数点为界，把$2.3+1.4$分开来加。"],
    [0.14, "소수 부분끼리 더해요: $0.3+0.4=0.7$", "Add the decimal parts: $0.3+0.4=0.7$.", "小数部分相加：$0.3+0.4=0.7$。"],
    [0.42, "자연수 부분끼리 더해요: $2+1=3$", "Add the whole parts: $2+1=3$.", "整数部分相加：$2+1=3$。"],
    [0.7, "합치면 $2.3+1.4=3.7$이에요.", "Put together: $2.3+1.4=3.7$.", "合起来：$2.3+1.4=3.7$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.5, 0, -0.35], 5.4, 58);
    k.table();
    /* 세로셈: 자연수 칸(x=-0.85)·소수점(구슬, x=-0.3)·소수 칸(x=0.25) */
    const XW = -0.85, XP = -0.3, XT = 0.25, ZS = [-1.55, -0.75, 0.35], TO = { w:0.72, d:0.72, h:0.2, fs:0.46 };
    const tenth = { bg:'#dbe7f2' }, ans = { bg:'#f1e0b8' };
    const bead = k.lacquer('#9b2a1c');
    const point = z => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 16), bead); m.castShadow = true; m.position.set(XP, 0.08, z + 0.2); scene.add(m); return m; };
    const w1 = tileF(k, '2', XW, ZS[0], TO), t1 = tileF(k, '3', XT, ZS[0], Object.assign({}, TO, tenth)); point(ZS[0]);
    tileF(k, '+', XW - 0.85, ZS[1], Object.assign({}, TO, { w:0.55, fs:0.4 }));
    const w2 = tileF(k, '1', XW, ZS[1], TO), t2 = tileF(k, '4', XT, ZS[1], Object.assign({}, TO, tenth)); point(ZS[1]);
    k.rod(k.lacquer('#3a2a1e'), -0.6, -0.2, 0);                     /* 세로셈의 가로줄 */
    const w3 = tileF(k, '3', XW, ZS[2], Object.assign({}, TO, ans)), t3 = tileF(k, '7', XT, ZS[2], Object.assign({}, TO, tenth, ans)); point(ZS[2]);
    /* 오른쪽: 부분 덧셈 카드 */
    const cT = cardF(k, ['0.3 + 0.4 = 0.7'], 2.35, -1.2, { w:2.6, d:0.7, fs:0.32, bg:'#dbe7f2' });
    const cW = cardF(k, ['2 + 1 = 3'], 2.35, -0.25, { w:2.6, d:0.7, fs:0.32 });
    const cA = cardF(k, ['2.3 + 1.4 = 3.7'], 2.35, 0.7, { w:2.6, d:0.7, fs:0.32, bg:'#f1e0b8' });
    /* 움직임: 소수 칸 3·4 → 0.7 카드·답 7 → 자연수 칸 2·1 → 2+1=3 카드·답 3 → 답 줄 전체 */
    k.onFrame(t => { const p = cyc(t, 8);
      t1.position.y = 0.2 * hop(p, 0.14, 0.26); t2.position.y = 0.2 * hop(p, 0.18, 0.3);
      cT.position.y = 0.16 * hop(p, 0.26, 0.38); t3.position.y = 0.22 * Math.max(hop(p, 0.3, 0.42), hop(p, 0.72, 0.86));
      w1.position.y = 0.2 * hop(p, 0.42, 0.54); w2.position.y = 0.2 * hop(p, 0.46, 0.58);
      cW.position.y = 0.16 * hop(p, 0.54, 0.66); w3.position.y = 0.22 * Math.max(hop(p, 0.58, 0.7), hop(p, 0.72, 0.86));
      cA.position.y = 0.16 * hop(p, 0.74, 0.88); });
    k.lights(Object.assign({}, LIGHT, { spotAt:[0.5, 0, -0.3] }));
  }},

  /* 소수를 곱하기 — stage ①②: 43 × 0.1 = 4.3(소수점 한 칸), 7 × 0.01 = 0.07(두 칸, 빈 자리는 0) */
  'C-25': { seed:2501, caps:{ P:8, list:[
    [0.0, "$0.1$은 $\\dfrac{1}{10}$이라서 $\\times0.1$은 $\\div10$과 같아요.", "$0.1$ is $\\dfrac{1}{10}$, so $\\times0.1$ is the same as $\\div10$.", "$0.1$是$\\dfrac{1}{10}$，所以$\\times0.1$和$\\div10$一样。"],
    [0.16, "소수점이 왼쪽으로 한 칸 미끄러져요: $43\\times0.1=4.3$", "The point slides one place left: $43\\times0.1=4.3$.", "小数点向左滑一位：$43\\times0.1=4.3$。"],
    [0.44, "$\\times0.01$이면 두 칸이에요: $7\\times0.01=0.07$", "With $\\times0.01$ it slides two places: $7\\times0.01=0.07$.", "乘$0.01$就滑两位：$7\\times0.01=0.07$。"],
    [0.72, "빈 자리는 $0$으로 채워요. $1$보다 작은 수를 곱하면 작아져요.", "Fill empty places with $0$. Multiplying by less than $1$ makes it smaller.", "空位用$0$补上。乘比$1$小的数，结果变小。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, -0.1], 5.3, 58);
    k.table();
    /* 자리 칸: 일(x=-0.85) · 소수 첫째(0) · 소수 둘째(0.85). 소수점은 붉은 구슬 */
    const XS = [-0.85, 0, 0.85], TO = { w:0.72, d:0.8, h:0.22, fs:0.5 }, Z1 = -1.35, Z2 = -0.3;
    const bead = k.lacquer('#9b2a1c');
    const point = (x, z) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 16), bead); m.castShadow = true; m.position.set(x, 0.09, z + 0.26); scene.add(m); return m; };
    tileF(k, '4', XS[0], Z1, TO); tileF(k, '3', XS[1], Z1, TO);
    const p1 = point(-0.425, Z1);
    const zeros = [tileF(k, '0', XS[0], Z2, Object.assign({}, TO, { bg:'#e6dcc8', color:'#7a6a55' })), tileF(k, '0', XS[1], Z2, Object.assign({}, TO, { bg:'#e6dcc8', color:'#7a6a55' }))];
    tileF(k, '7', XS[2], Z2, TO);
    const p2 = point(-0.425, Z2);
    const c1 = cardF(k, ['43 × 0.1 = 4.3'], -1.35, 0.95, { w:2.5, d:0.72, fs:0.32, bg:'#f1e0b8' });
    const c2 = cardF(k, ['7 × 0.01 = 0.07'], 1.35, 0.95, { w:2.5, d:0.72, fs:0.32, bg:'#f1e0b8' });
    /* 움직임: 구슬이 43. 자리로 갔다가 한 칸 스키 → 4.3 / 7. 자리로 갔다가 두 칸 스키, 지나가며 0 이 채워짐 → 0.07 */
    k.onFrame(t => { const p = cyc(t, 8);
      const u1 = seg(p, 0.03, 0.12) * (1 - seg(p, 0.18, 0.32));
      p1.position.x = -0.425 + 0.85 * u1; p1.position.y = 0.09 + 0.25 * hop(p, 0.18, 0.32);
      c1.position.y = 0.16 * hop(p, 0.32, 0.44);
      const u2 = seg(p, 0.36, 0.44) * (1 - seg(p, 0.5, 0.72));
      p2.position.x = -0.425 + 1.7 * u2; p2.position.y = 0.09 + 0.25 * hop(p, 0.5, 0.72);
      zeros.forEach((z, i) => { const s = 1 - seg(u2, i ? 0.15 : 0.55, i ? 0.45 : 0.9); z.scale.setScalar(Math.max(0.001, s)); });
      c2.position.y = 0.16 * hop(p, 0.74, 0.86); });
    k.lights(Object.assign({}, LIGHT, { spotAt:[0, 0, -0.3] }));
  }},

  /* 곱해서 100 만들기 — stage ①: 4 × 7 × 25 = (4 × 25) × 7 = 100 × 7 = 700, book: 황금 쌍 목록 */
  'C-04': { seed:401, caps:{ P:8, list:[
    [0.0, "$4\\times7\\times25$에서 $4$와 $25$를 먼저 찾아요.", "In $4\\times7\\times25$, find the $4$ and the $25$ first.", "在$4\\times7\\times25$中先找出$4$和$25$。"],
    [0.18, "황금 쌍을 먼저 곱해요: $4\\times25=100$", "Multiply the golden pair first: $4\\times25=100$.", "先乘黄金搭档：$4\\times25=100$。"],
    [0.46, "$100\\times7=700$ — 뒤에 $00$만 붙이면 돼요.", "$100\\times7=700$: just add $00$ at the end.", "$100\\times7=700$——后面添上$00$就行。"],
    [0.72, "$2\\times50$, $5\\times20$도 $100$, $8\\times125$는 $1000$이에요.", "$2\\times50$ and $5\\times20$ make $100$ too, and $8\\times125=1000$.", "$2\\times50$、$5\\times20$也是$100$，$8\\times125$是$1000$。"]
  ]},
    build(k){
    k.frame([0, 0, -0.2], 5.8, 58);
    k.table();
    /* 뒷줄: 블록 4 × 7 × 25 — 황금 쌍 4·25 는 금빛 옆면 */
    const gold = k.metal('#c9a24a', 0.35), BZ = -1.45, BO = { h:0.26, d:0.85, fs:0.46 };
    const b4 = tileF(k, '4', -1.7, BZ, Object.assign({ w:0.8, side:gold, bg:'#f6e3a8' }, BO));
    tileF(k, '×', -0.85, BZ, Object.assign({ w:0.55 }, BO, { fs:0.38 }));
    tileF(k, '7', 0, BZ, Object.assign({ w:0.8 }, BO));
    tileF(k, '×', 0.85, BZ, Object.assign({ w:0.55 }, BO, { fs:0.38 }));
    const b25 = tileF(k, '25', 1.8, BZ, Object.assign({ w:1.0, side:gold, bg:'#f6e3a8' }, BO));
    /* 가운데: 식 */
    const eq = cardF(k, ['(4 × 25) × 7 = 100 × 7 = 700'], 0, -0.25, { w:5.0, d:0.75, fs:0.32, bg:'#f1e0b8' });
    /* 앞줄: 황금 쌍 카드 */
    const pairs = ['4 × 25 = 100', '2 × 50 = 100', '5 × 20 = 100', '8 × 125 = 1000'].map((s, i) =>
      cardF(k, [s], -2.1 + i * 1.4, 0.85, { w:1.3, d:0.62, fs:0.18, bg:i ? '#efe3c8' : '#f6e3a8' }));
    /* 움직임: 4·25 블록이 들려 서로 다가갔다 돌아옴(쌍 만들기) → 식 카드 → 황금 쌍 카드 차례로 */
    const x4 = b4.position.x, x25 = b25.position.x;
    k.onFrame(t => { const p = cyc(t, 8);
      const u = seg(p, 0.18, 0.3) * (1 - seg(p, 0.36, 0.46)), h = 0.35 * Math.sin(Math.PI * u) + 0.4 * u;
      b4.position.set(x4 + 0.55 * u, h, BZ); b25.position.set(x25 - 0.55 * u, h, BZ);
      eq.position.y = 0.16 * hop(p, 0.46, 0.62);
      pairs.forEach((c, i) => { const a = 0.72 + i * 0.05; c.position.y = 0.14 * hop(p, a, a + 0.1); }); });
    k.lights(Object.assign({}, LIGHT, { spotAt:[0, 0, -0.3] }));
  }},

  /* 분수 덧뺄셈(다른 분모) — stage ①②: 반쪽 1/2 과 3분의 1쪽 1/3 은 크기가 달라 6등분으로 다시 잘라 3/6 + 2/6 = 5/6 */
  'C-22': { seed:2201, caps:{ P:8, list:[
    [0.0, "반쪽 $\\dfrac{1}{2}$과 $\\dfrac{1}{3}$쪽은 조각 크기가 달라서 바로 못 더해요.", "Half, $\\dfrac{1}{2}$, and a third, $\\dfrac{1}{3}$, are different sizes, so we cannot just add.", "$\\dfrac{1}{2}$和$\\dfrac{1}{3}$的块大小不同，不能直接相加。"],
    [0.3, "둘 다 $6$조각으로 다시 잘라요: $\\dfrac{1}{2}=\\dfrac{3}{6}$, $\\dfrac{1}{3}=\\dfrac{2}{6}$", "Cut both into $6$ pieces: $\\dfrac{1}{2}=\\dfrac{3}{6}$, $\\dfrac{1}{3}=\\dfrac{2}{6}$.", "都重新切成$6$块：$\\dfrac{1}{2}=\\dfrac{3}{6}$，$\\dfrac{1}{3}=\\dfrac{2}{6}$。"],
    [0.6, "크기가 같아졌으니 개수만 더해요: $\\dfrac{3}{6}+\\dfrac{2}{6}=\\dfrac{5}{6}$", "Now the pieces match, so count them: $\\dfrac{3}{6}+\\dfrac{2}{6}=\\dfrac{5}{6}$.", "块一样大了，只数个数：$\\dfrac{3}{6}+\\dfrac{2}{6}=\\dfrac{5}{6}$。"],
    [0.82, "그래서 $\\dfrac{1}{2}+\\dfrac{1}{3}=\\dfrac{5}{6}$이에요.", "So $\\dfrac{1}{2}+\\dfrac{1}{3}=\\dfrac{5}{6}$.", "所以$\\dfrac{1}{2}+\\dfrac{1}{3}=\\dfrac{5}{6}$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, -0.05], 5.8, 58);
    k.table();
    const R = 0.78, CZ = -0.75, H = 0.08;
    const red = k.plastic('#d0462f', 0.3), blue = k.plastic('#3a7cc4', 0.3), pale = k.plastic('#efe4cf', 0.5);
    const disk = (cx, n, mats) => {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.12, R + 0.12, 0.05, 64), k.woodMat('#b98a55', [110, 70, 35]));
      base.position.set(cx, 0.025, CZ); base.castShadow = base.receiveShadow = true; scene.add(base);
      const A = Math.PI * 2 / n, S = -Math.PI / 2;           /* 첫 조각이 앞(+z) 쪽에서 시작 */
      return mats.map((m, i) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 32, 1, false, S + i * A + 0.025, A - 0.05), m);
        mesh.castShadow = mesh.receiveShadow = true;
        const g = new THREE.Group(); g.add(mesh); g.position.set(cx, 0.05 + H / 2, CZ); scene.add(g); return g; }); };
    const half = disk(-2.05, 2, [red, pale]);
    const third = disk(0, 3, [blue, pale, pale]);
    const sixth = disk(2.05, 6, [red, red, red, blue, blue, pale]);
    tileF(k, '+', -1.03, CZ, { w:0.4, d:0.4, h:0.12, fs:0.3 });
    tileF(k, '=', 1.03, CZ, { w:0.4, d:0.4, h:0.12, fs:0.3 });
    const eq = cardF(k, [{ n:'1', d:'2' }, '+', { n:'1', d:'3' }, '=', { n:'3', d:'6' }, '+', { n:'2', d:'6' }, '=', { n:'5', d:'6' }], 0, 0.95, { w:4.6, d:1.0, fs:0.32, bg:'#f1e0b8' });
    /* 움직임: 반쪽 → 3분의 1쪽 → 6등분의 빨간 3조각 → 파란 2조각 → 5조각 함께 → 식 카드 */
    const y0 = 0.05 + H / 2;
    k.onFrame(t => { const p = cyc(t, 8);
      half[0].position.y = y0 + 0.22 * hop(p, 0.05, 0.18);
      third[0].position.y = y0 + 0.22 * hop(p, 0.14, 0.27);
      sixth.forEach((g, i) => { if(i > 4) return; const a = i < 3 ? 0.32 : 0.44; g.position.y = y0 + 0.2 * Math.max(hop(p, a + (i % 3) * 0.02, a + 0.12), hop(p, 0.6, 0.74)); });
      eq.position.y = 0.16 * hop(p, 0.82, 0.94); });
    k.lights(LIGHT);
  }},

  /* 분수의 곱셈 — stage ①: 2/3 × 4/5 = 8/15. 3줄로 나눠 2줄, 그 2줄을 5칸으로 나눠 4칸씩 */
  'C-31': { seed:3101, caps:{ P:8, list:[
    [0.0, "분수 곱셈은 통분이 필요 없어요: $\\dfrac{2}{3}\\times\\dfrac{4}{5}$", "Multiplying fractions needs no common denominator: $\\dfrac{2}{3}\\times\\dfrac{4}{5}$.", "分数乘法不用通分：$\\dfrac{2}{3}\\times\\dfrac{4}{5}$。"],
    [0.1, "전체를 $3$줄로 나눠 $2$줄을 가져요. 그게 $\\dfrac{2}{3}$이에요.", "Split the whole into $3$ rows and take $2$: that is $\\dfrac{2}{3}$.", "把整体分成$3$行，取$2$行：这是$\\dfrac{2}{3}$。"],
    [0.36, "한 줄을 $5$칸으로 나눠 $4$칸씩 가지면 $2\\times4=8$칸이에요.", "Split each row into $5$ and take $4$: $2\\times4=8$ squares.", "每行分成$5$格取$4$格：$2\\times4=8$格。"],
    [0.66, "$15$칸 중 $8$칸, 그래서 $\\dfrac{2}{3}\\times\\dfrac{4}{5}=\\dfrac{8}{15}$이에요.", "$8$ of $15$ squares, so $\\dfrac{2}{3}\\times\\dfrac{4}{5}=\\dfrac{8}{15}$.", "$15$格中的$8$格，所以$\\dfrac{2}{3}\\times\\dfrac{4}{5}=\\dfrac{8}{15}$。"]
  ]},
    build(k){
    k.frame([0, 0, -0.2], 5.4, 58);
    k.table();
    /* 3줄 × 5칸 블록판. 위 2줄(2/3)은 연한 주황, 그중 왼쪽 4칸(8칸)은 진한 주황 */
    const S = 0.62, X0 = -0.3 - 2 * S, Z0 = -1.65;
    const light = k.plastic('#f0b46a', 0.4), dark = k.plastic('#d8672a', 0.35), plain = k.woodMat('#e3c79a', [140, 100, 55]);
    const tiles = [];
    for(let r = 0; r < 3; r++) for(let c = 0; c < 5; c++){
      const side = r < 2 ? (c < 4 ? dark : light) : plain;
      tiles.push({ r, c, g:k.tile(null, X0 + c * S, Z0 + r * S, { w:S - 0.06, d:S - 0.06, h:0.18, side }) }); }
    /* 가장자리 분수: 줄 옆 2/3, 칸 아래 4/5 */
    cardF(k, [{ n:'2', d:'3' }], X0 + 5 * S + 0.2, Z0 + 0.5 * S, { w:0.6, d:0.95, fs:0.3, bg:'#f5dcb8' });
    cardF(k, [{ n:'4', d:'5' }], X0 - S - 0.05, Z0 + 0.5 * S, { w:0.6, d:0.95, fs:0.3, bg:'#f3c6a4' });
    const eq = cardF(k, [{ n:'2', d:'3' }, '×', { n:'4', d:'5' }, '=', { n:'2 × 4', d:'3 × 5' }, '=', { n:'8', d:'15' }], 0, 0.8, { w:4.4, d:1.0, fs:0.3, bg:'#f1e0b8' });
    /* 움직임: 위 2줄 → 진한 8칸 → 식 카드 */
    k.onFrame(t => { const p = cyc(t, 8);
      tiles.forEach(({ r, c, g }) => { let y = 0;
        if(r < 2) y = Math.max(y, 0.16 * hop(p, 0.1 + r * 0.04, 0.26 + r * 0.04));
        if(r < 2 && c < 4) y = Math.max(y, 0.22 * hop(p, 0.38 + c * 0.03, 0.52 + c * 0.03));
        g.position.y = y; });
      eq.position.y = 0.16 * hop(p, 0.68, 0.82); });
    k.lights(Object.assign({}, LIGHT, { spotAt:[0, 0, -0.5] }));
  }},

  /* 분수 전환 나눗셈 — stage ①: 675 ÷ 4 = 675/4, 675 = 600 + 40 + 35 → 150 + 10 + 8.75 = 168.75 */
  'C-32': { seed:3201, caps:{ P:8, list:[
    [0.0, "$675\\div4$는 분수 $\\dfrac{675}{4}$와 같아요.", "$675\\div4$ is the same as the fraction $\\dfrac{675}{4}$.", "$675\\div4$就是分数$\\dfrac{675}{4}$。"],
    [0.1, "$4$로 딱 나눠지는 조각으로 쪼개요: $675=600+40+35$", "Break it into pieces $4$ divides: $675=600+40+35$.", "拆成能被$4$整除的块：$675=600+40+35$。"],
    [0.44, "$35\\div4=8.75$ — 딱 안 떨어져도 소수로 나와요.", "$35\\div4=8.75$: even a leftover gives a decimal.", "$35\\div4=8.75$——除不尽也能得到小数。"],
    [0.68, "모두 더하면 $150+10+8.75=168.75$예요.", "Add them all: $150+10+8.75=168.75$.", "全部相加：$150+10+8.75=168.75$。"]
  ]},
    build(k){
    k.frame([0, 0, -0.2], 6.0, 58);
    k.table();
    const XS = [-1.95, 0, 1.95], BZ = -1.45, CZ = -0.35;
    /* 뒷줄: 조각 블록 600 · 40 · 35 (큰 조각일수록 크게) */
    const blocks = [['600', 1.5, 0.3], ['40', 1.1, 0.22], ['35', 1.1, 0.2]].map(([t, w, h], i) => tileF(k, t, XS[i], BZ, { w, d:0.85, h, fs:0.44 }));
    tileF(k, '+', -0.95, BZ, { w:0.4, d:0.4, h:0.12, fs:0.3 }); tileF(k, '+', 0.95, BZ, { w:0.4, d:0.4, h:0.12, fs:0.3 });
    /* 가운데 줄: 조각마다 ÷ 4 */
    const parts = ['600 ÷ 4 = 150', '40 ÷ 4 = 10', '35 ÷ 4 = 8.75'].map((s, i) => cardF(k, [s], XS[i], CZ, { w:1.8, d:0.66, fs:0.24 }));
    const ans = cardF(k, ['675 ÷ 4 =', { n:'675', d:'4' }, '= 168.75'], 0, 0.85, { w:4.4, d:1.0, fs:0.32, bg:'#f1e0b8' });
    /* 움직임: 600 → 40 → 35 블록이 그 나눗셈 카드와 함께 차례로 들썩 → 답 카드 */
    k.onFrame(t => { const p = cyc(t, 8);
      blocks.forEach((b, i) => { const a = 0.1 + i * 0.12; b.position.y = 0.22 * hop(p, a, a + 0.12); parts[i].position.y = 0.16 * hop(p, a + 0.04, a + 0.16); });
      ans.position.y = 0.18 * hop(p, 0.68, 0.82); });
    k.lights(Object.assign({}, LIGHT, { spotAt:[0, 0, -0.4] }));
  }},

  /* 가우스 덧셈 마법 — hook·history: 홀수를 차례로 더하면 정사각수. 구슬을 ㄱ자로 둘러 붙여 1, 4, 9, 16 */
  'C-05': { seed:501, caps:{ P:8, list:[
    [0.0, "홀수를 차례로 더해 봐요: $1$, $1+3$, $1+3+5$ …", "Add the odd numbers in order: $1$, $1+3$, $1+3+5$ …", "把奇数依次相加：$1$，$1+3$，$1+3+5$…"],
    [0.1, "구슬을 ㄱ자로 $3$개, $5$개, $7$개 둘러 붙여요.", "Wrap $3$, then $5$, then $7$ beads around the corner.", "沿拐角依次围上$3$颗、$5$颗、$7$颗珠子。"],
    [0.5, "그때마다 정사각형이 돼요: $1+3+5+7=16=4\\times4$", "Each time it makes a square: $1+3+5+7=16=4\\times4$.", "每次都成正方形：$1+3+5+7=16=4\\times4$。"],
    [0.74, "홀수를 차례로 더하면 언제나 정사각수가 돼요.", "Adding odd numbers in order always makes a square number.", "奇数依次相加，总是得到平方数。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.45, 0, -0.3], 5.6, 58);
    k.table();
    /* 나무 쟁반 + 4×4 구슬. 구슬 (i, j) 의 층 = max(i, j) — 층마다 한 색 */
    const S = 0.42, X0 = -2.0, Z0 = -1.55;
    const tray = new THREE.Mesh(k.rbox(4 * S + 0.3, 0.08, 4 * S + 0.3, 0.08), k.woodMat('#b98a55', [110, 70, 35]));
    tray.position.set(X0 + 1.5 * S, 0, Z0 + 1.5 * S); tray.castShadow = tray.receiveShadow = true; scene.add(tray);
    const mats = ['#d23b3b', '#f0a21f', '#48a64b', '#3a8fd0'].map(c => k.plastic(c, 0.22));
    const geo = new THREE.SphereGeometry(0.17, 32, 20), layers = [[], [], [], []];
    for(let i = 0; i < 4; i++) for(let j = 0; j < 4; j++){ const L = Math.max(i, j);
      const m = new THREE.Mesh(geo, mats[L]); m.castShadow = m.receiveShadow = true;
      m.position.set(X0 + j * S, 0.08 + 0.17, Z0 + (3 - i) * S); scene.add(m); layers[L].push(m); }
    /* 오른쪽: 줄마다 식 카드 */
    const rows = ['1 = 1 × 1', '1 + 3 = 2 × 2', '1 + 3 + 5 = 3 × 3', '1 + 3 + 5 + 7 = 4 × 4'];
    const bgs = ['#f5d0c8', '#f7e0b0', '#d8ecd0', '#d2e4f4'];
    const cards = rows.map((s, i) => cardF(k, [s], 1.55, -1.75 + i * 0.72, { w:3.1, d:0.6, fs:0.25, bg:bgs[i] }));
    /* 움직임: 1층(1개) → 2층(3개) → 3층(5개) → 4층(7개)이 그 식 카드와 차례로 들썩 → 모두 함께 */
    const y0 = 0.25;
    k.onFrame(t => { const p = cyc(t, 8);
      layers.forEach((ls, L) => { const a = 0.08 + L * 0.12, all = hop(p, 0.76, 0.9);
        ls.forEach(m => { m.position.y = y0 + Math.max(0.2 * hop(p, a, a + 0.12), 0.12 * all); });
        cards[L].position.y = 0.14 * hop(p, a + 0.02, a + 0.14); }); });
    k.lights(Object.assign({}, LIGHT, { spotAt:[0.3, 0, -0.5] }));
  }},

  /* 어림하기 곱셈법 — hook·history: 에라토스테네스, 두 도시의 해 기울기 차 7.2° = 360° 의 50분의 1, 800 × 50 = 40000 */
  'H-12': { seed:1201, caps:{ P:8, list:[
    [0.0, "$2000$년 전, 에라토스테네스는 지구 둘레를 알아냈어요.", "$2000$ years ago, Eratosthenes found the distance around the Earth.", "$2000$年前，埃拉托色尼算出了地球的周长。"],
    [0.2, "같은 시각, 두 도시에서 해의 기울기가 $7.2^\\circ$ 달랐어요.", "At the same moment, the sun's slant differed by $7.2^\\circ$ in two cities.", "同一时刻，两座城市的太阳倾斜相差$7.2^\\circ$。"],
    [0.45, "$7.2^\\circ\\times50=360^\\circ$ — 한 바퀴의 $\\dfrac{1}{50}$이에요.", "$7.2^\\circ\\times50=360^\\circ$: it is $\\dfrac{1}{50}$ of a full turn.", "$7.2^\\circ\\times50=360^\\circ$——是一圈的$\\dfrac{1}{50}$。"],
    [0.7, "두 도시 사이가 $800$ km라서 $800\\times50=40000$ km예요.", "The cities are $800$ km apart, so $800\\times50=40000$ km.", "两城相距$800$公里，所以$800\\times50=40000$公里。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.55, -0.1], 5.6, 34);
    k.table();
    /* 지구본: 받침 + 금속 고리 + 바다·땅 무늬 공 */
    const GC = new THREE.Vector3(-0.9, 1.35, -0.9), GR = 0.95;
    const earthTex = k.canvasTex(1024, 512, (g, w, h) => {
      g.fillStyle = '#2f6fa8'; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 1500; i++){ g.fillStyle = `rgba(255,255,255,${k.rnd() * 0.05})`; g.fillRect(k.rnd() * w, k.rnd() * h, 2, 2); }
      const blob = (cx, cy, rx, ry, col) => { g.fillStyle = col; g.beginPath();
        for(let a = 0; a <= 24; a++){ const t = a / 24 * Math.PI * 2, r = 0.75 + 0.35 * Math.sin(t * 3 + cx) * Math.cos(t * 2 + cy);
          g.lineTo(cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r); } g.closePath(); g.fill(); };
      [[180, 170, 110, 80], [250, 330, 60, 110], [520, 150, 140, 70], [560, 300, 90, 110], [780, 170, 150, 90], [860, 360, 70, 50]].forEach(([x, y, a, b]) => blob(x, y, a, b, '#6f9a4a'));
      [[540, 250, 60, 30], [800, 230, 50, 30]].forEach(([x, y, a, b]) => blob(x, y, a, b, '#c7a86a'));
      g.fillStyle = 'rgba(240,248,255,.85)'; g.fillRect(0, 0, w, 26); g.fillRect(0, h - 26, w, 26); });
    const globe = new THREE.Group(); globe.position.copy(GC); scene.add(globe);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(GR, 64, 40), new THREE.MeshPhysicalMaterial({ map:earthTex, roughness:0.45, clearcoat:0.5 }));
    ball.castShadow = ball.receiveShadow = true; globe.add(ball);
    /* 두 도시의 막대 — 같은 경도, 위도만 다르게(그림에서는 잘 보이게 벌려 그렸다) */
    const stickM = k.metal('#3a2a1e', 0.5);
    [0.18, 0.55].forEach(lat => { const d = new THREE.Vector3(Math.cos(lat) * Math.cos(0.55), Math.sin(lat), Math.cos(lat) * Math.sin(0.55));
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.3, 12), stickM); s.castShadow = true;
      s.position.copy(d.clone().multiplyScalar(GR + 0.14)); s.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d); globe.add(s);
      const flag = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), k.lacquer('#9b2a1c')); flag.position.copy(d.clone().multiplyScalar(GR + 0.3)); globe.add(flag); });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(GR + 0.08, 0.025, 12, 96), k.metal('#c9a45c', 0.3));
    ring.position.copy(GC); ring.rotation.y = Math.PI / 2 - 0.4; ring.castShadow = true; scene.add(ring);
    const wood = k.woodMat('#8a5a32', [70, 40, 20]);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, GC.y - GR - 0.05, 16), wood); stem.position.set(GC.x, (GC.y - GR - 0.05) / 2 + 0.06, GC.z); stem.castShadow = true; scene.add(stem);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.1, 48), wood); foot.position.set(GC.x, 0.05, GC.z); foot.castShadow = foot.receiveShadow = true; scene.add(foot);
    /* 해: 오른쪽 위 빛나는 공 + 나란한 햇살 */
    const sun = new THREE.Mesh(new THREE.SphereGeometry(0.32, 40, 24), new THREE.MeshBasicMaterial({ color:new THREE.Color('#ffd27a').multiplyScalar(1.6) }));
    sun.position.set(2.5, 1.95, -1.1); scene.add(sun);
    const rayM = new THREE.MeshBasicMaterial({ color:'#ffd98a', transparent:true, opacity:0.55, depthWrite:false });
    const rays = [1.35, 1.65, 1.95, 2.25].map(y => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.0, 8), rayM.clone());
      r.rotation.z = Math.PI / 2; r.position.set(1.15, y - 0.25, -0.75); scene.add(r); return r; });
    /* 앞줄: 식 카드 */
    const c1 = cardF(k, ['7.2° × 50 = 360°'], -1.2, 1.1, { w:2.6, d:0.7, fs:0.3, bg:'#f1e0b8' });
    const c2 = cardF(k, ['800 × 50 = 40000'], 1.45, 1.1, { w:2.6, d:0.7, fs:0.3, bg:'#f1e0b8' });
    /* 움직임: 지구본이 살짝 돌았다 돌아오고, 햇살이 반짝 → 7.2° 카드 → 800 × 50 카드 */
    k.onFrame(t => { const p = cyc(t, 8);
      globe.rotation.y = -0.25 * Math.sin(Math.PI * 2 * p) * (1 - seg(p, 0.5, 1)) ;
      rays.forEach((r, i) => { r.material.opacity = 0.55 + 0.35 * hop(p, 0.2 + i * 0.03, 0.34 + i * 0.03); });
      c1.position.y = 0.16 * hop(p, 0.45, 0.58); c2.position.y = 0.16 * hop(p, 0.7, 0.84); });
    k.lights({ key:3.0, keyPos:[5, 6, 3], spotPos:[0, 7, 2], spotAt:[0, 0.5, -0.3], spot:26 });
  }}
};
