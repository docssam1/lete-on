/* C27 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

/* 글자 크기를 카드 폭에 맞춘 k.card — 식 한 줄이 카드 폭의 fill 비율을 넘지 않게 */
function fitCard(k, txt, x, z, o){
  o = Object.assign({}, o); const w = o.w || 1.2, d = o.d || 0.8, ph = Math.round(1024 * d / w);
  const g = document.createElement('canvas').getContext('2d');
  const tw = k.mathText(g, txt, 0, 0, 100, { draw:false });
  o.size = Math.min(ph * (o.hmax || 0.62), 100 * 1024 * (o.fill || 0.8) / tw);
  return k.card([txt], x, z, o);
}
/* 숫자 나무 블록 */
const dtile = (k, txt, x, z, o) => k.tile(txt, x, z, Object.assign({ w:0.62, d:0.62, h:0.18, size:330, grain:true, bg:'#f1e2c2' }, o || {}));
/* 한지 위 좌표 → 캔버스 좌표 */
const onPaper = (W, D, x0, z0, w, h) => ({ X:x => (x - x0 + W / 2) / W * w, Y:z => (z - z0 + D / 2) / D * h });
/* 여러 물건을 한 번 뛰게 */
const hopper = list => { const y0 = list.map(g => g.position.y); return (p, a, b, hh) => list.forEach((g, i) => { g.position.y = y0[i] + (hh || 0.3) * hop(p, a, b); }); };
/* 황동 동전(표시용, 글자 없음) */
function coin(k, x, z){
  const { THREE, scene } = k;
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 48), new THREE.MeshPhysicalMaterial({ color:'#d9b25a', metalness:0.55, roughness:0.28, clearcoat:0.6 }));
  m.position.set(x, 0.045, z); m.castShadow = m.receiveShadow = true; scene.add(m); return m;
}
const LIGHTS = { key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.1], spot:24, envOpts:{ intensity:0.5 } };

export const SCENES_C27 = {

  /* 진법·진법 곱셈법 — stage ②: 23×13, 13=8+4+1, 23×8=184, 23×4=92, 23×1=23 → 184+92+23=299 */
  'H-03': { seed:271, caps:{ P:9, list:[
    [0.0, "$23\\times 13$: 먼저 $23$을 두 배씩 키워 적어요.", "$23\\times 13$: first write $23$ doubled again and again.", "$23\\times 13$：先把$23$一次次翻倍写下来。"],
    [0.24, "$13=8+4+1$이니까 $8,\\,4,\\,1$ 줄만 골라요.", "$13=8+4+1$, so pick only the rows $8,\\,4,\\,1$.", "$13=8+4+1$，所以只选$8,\\,4,\\,1$这几行。"],
    [0.54, "$184+92+23=299$ — 그래서 $23\\times 13=299$예요.", "$184+92+23=299$, so $23\\times 13=299$.", "$184+92+23=299$，所以$23\\times 13=299$。"],
    [0.78, "두 배씩 커지는 수로 곱하기 — 컴퓨터가 쓰는 이진법의 원리예요.", "Multiplying with doubling numbers is how a computer does it, in binary.", "用翻倍的数来乘——这就是计算机用的二进制原理。"]
  ]},
    build(k){
    k.frame([0.15, 0.1, 0.2], 5.8, 60);
    k.table();
    const PW = 6.3, PD = 4.1, PZ = 0.15;
    const ZS = [-1.3, -0.45, 0.4, 1.25], XK = -1.55, XV = -0.35, XC = -2.4, RX = 2.0;
    const rows = [['1', '23', true], ['2', '46', false], ['4', '92', true], ['8', '184', true]];
    k.paper(PW, PD, 0.15, PZ, 0, (g, w, h, ink) => { const P = onPaper(PW, PD, 0.15, PZ, w, h);
      /* 두 배 화살표 */
      g.strokeStyle = 'rgba(150,40,25,.75)'; g.lineWidth = 5;
      for(let i = 0; i < 3; i++){ const za = ZS[i] + 0.3, zb = ZS[i + 1] - 0.3, x = XV + 0.72;
        g.beginPath(); g.moveTo(P.X(x), P.Y(za)); g.quadraticCurveTo(P.X(x + 0.22), P.Y((za + zb) / 2), P.X(x), P.Y(zb)); g.stroke();
        g.beginPath(); g.moveTo(P.X(x), P.Y(zb)); g.lineTo(P.X(x) + 18, P.Y(zb) - 14); g.moveTo(P.X(x), P.Y(zb)); g.lineTo(P.X(x) + 22, P.Y(zb) + 6); g.stroke();
        ink(g, '× 2', P.X(x + 0.45), P.Y((za + zb) / 2), 48, { color:'rgb(150,40,25)' }); }
      ink(g, '23 × 13', P.X(RX), P.Y(-1.3), 88);
      ink(g, '13 = 8 + 4 + 1', P.X(RX), P.Y(-0.5), 76);
      ink(g, '184 + 92 + 23', P.X(RX), P.Y(0.3), 76);
      ink(g, '=', P.X(RX - 0.9), P.Y(1.2), 90);
    });
    const coins = [], picked = [];
    rows.forEach(([a, b, on], i) => {
      const bg = on ? { bg:'#f6dcc0' } : { bg:'#e6dccb', color:'#7a6b5a' };
      fitCard(k, a, XK, ZS[i], Object.assign({ w:0.62, d:0.6, h:0.04, y:0.035, fill:0.42 }, bg));
      picked.push(fitCard(k, b, XV, ZS[i], Object.assign({ w:1.0, d:0.6, h:0.04, y:0.035, fill:0.66 }, bg)));
      if(on) coins.push(coin(k, XC, ZS[i]));
    });
    const ans = fitCard(k, '299', RX + 0.35, 1.2, { w:1.3, d:0.72, h:0.05, y:0.035, fill:0.62, bg:'#f3e2b8' });
    /* 움직임: 동전이 8 → 4 → 1 줄에서 차례로 뛰고, 고른 값 184·92·23 이 뛰고, 299 */
    const hc = coins.map(c => hopper([c])), hv = [0, 2, 3].map(i => hopper([picked[i]])), hA = hopper([ans]);
    k.onFrame(t => { const p = cyc(t, 9);
      hc[2](p, 0.24, 0.34, 0.35); hc[1](p, 0.32, 0.42, 0.35); hc[0](p, 0.4, 0.5, 0.35);
      hv[2](p, 0.54, 0.64, 0.28); hv[1](p, 0.6, 0.7, 0.28); hv[0](p, 0.66, 0.76, 0.28);
      hA(p, 0.78, 0.92, 0.32); });
    k.lights(LIGHTS);
  }},

  /* 1001 자릿수 이동법칙 — stage ①: 7×11×13=1001, 123×1001 = 123000+123 = 123123 */
  'H-04': { seed:272, caps:{ P:8, list:[
    [0.0, "$7\\times 11\\times 13=1001$이에요.", "$7\\times 11\\times 13=1001$.", "$7\\times 11\\times 13=1001$。"],
    [0.22, "$1001=1000+1$이라서 $123\\times 1001=123000+123$", "$1001=1000+1$, so $123\\times 1001=123000+123$", "$1001=1000+1$，所以$123\\times 1001=123000+123$"],
    [0.55, "그래서 $123\\times 1001=123123$ — $123$이 두 번 이어져요.", "So $123\\times 1001=123123$: $123$ appears twice.", "所以$123\\times 1001=123123$——$123$连着出现两次。"]
  ]},
    build(k){
    k.frame([0.05, 0.1, 0.15], 5.6, 60);
    k.table();
    const PW = 6.1, PD = 4.0, PZ = 0.1;
    const Z1 = -1.3, Z2 = -0.3, Z3 = 1.0, SP = 0.74;
    const XT = [-2.5, -1.76, -1.02, 0.1, 0.84, 1.58].map(x => x + 0.45);
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => { const P = onPaper(PW, PD, 0, PZ, w, h);
      ink(g, '×', P.X(-1.5), P.Y(Z1), 80); ink(g, '×', P.X(-0.3), P.Y(Z1), 80); ink(g, '=', P.X(0.85), P.Y(Z1), 90);
      ink(g, '×', P.X(-0.85), P.Y(Z2), 80); ink(g, '=', P.X(1.2), P.Y(Z2), 90);
      /* 123000 + 123 — 자리 칸 */
      g.strokeStyle = 'rgba(28,20,14,.8)'; g.lineWidth = 6; g.beginPath(); g.moveTo(P.X(-2.6), P.Y(0.45)); g.lineTo(P.X(2.7), P.Y(0.45)); g.stroke();
      ink(g, '123000 + 123', P.X(2.2), P.Y(Z2), 50, { color:'rgb(150,40,25)' });
    });
    const CO = { w:0.8, d:0.62, h:0.04, y:0.035, fill:0.6 };
    fitCard(k, '7', -2.1, Z1, CO); fitCard(k, '11', -0.9, Z1, CO); fitCard(k, '13', 0.3, Z1, CO);
    const k1001 = fitCard(k, '1001', 1.75, Z1, { w:1.3, d:0.66, h:0.05, y:0.035, fill:0.7, bg:'#f3e2b8' });
    fitCard(k, '123', -1.7, Z2, { w:1.1, d:0.62, h:0.04, y:0.035, fill:0.66 });
    fitCard(k, '1001', 0.3, Z2, { w:1.3, d:0.62, h:0.04, y:0.035, fill:0.7, bg:'#f3e2b8' });
    const first = ['1', '2', '3'].map((d, i) => dtile(k, d, XT[i], Z3));
    const second = ['1', '2', '3'].map((d, i) => dtile(k, d, XT[i + 3], Z3, { bg:'#f6d4c6', color:'#7a1d12' }));
    const h1001 = hopper([k1001]), hf = hopper(first);
    /* 움직임: 1001 이 뛰고 → 뒤의 123 이 앞의 123 위로 떠올라 겹쳤다가(같은 수) → 세 자리 뒤(×1000 만큼 밀린 자리)로 내려앉는다 */
    const X0 = second.map(g => g.position.x), dx = XT[0] - XT[3];
    k.onFrame(t => { const p = cyc(t, 8);
      h1001(p, 0.04, 0.18, 0.3);
      const u = seg(p, 0.24, 0.4) * (1 - seg(p, 0.52, 0.7));
      second.forEach((g, i) => { g.position.x = X0[i] + dx * u; g.position.y = 0.34 * Math.min(1, u * 6); });
      hf(p, 0.4, 0.5, 0.12); });
    k.lights(LIGHTS);
  }},

  /* 순환소수 — hook: 1/3 = 0.333… 끝나지 않는다. stage ②: x=0.333…, 10x=3.333…, 10x−x=9x=3, x=3/9=1/3 */
  'H-05': { seed:273, caps:{ P:9, list:[
    [0.0, "$\\dfrac{1}{3}$을 소수로 쓰면 $0.333\\cdots$ — 끝나지 않아요.", "Written as a decimal, $\\dfrac{1}{3}$ is $0.333\\cdots$ and never stops.", "$\\dfrac{1}{3}$写成小数是$0.333\\cdots$，永远写不完。"],
    [0.3, "$x=0.333\\cdots$라 하면 $10x=3.333\\cdots$예요.", "Let $x=0.333\\cdots$; then $10x=3.333\\cdots$.", "设$x=0.333\\cdots$，那么$10x=3.333\\cdots$。"],
    [0.54, "$10x-x$를 하면 반복되는 부분이 사라져요: $9x=3$", "Take $10x-x$ and the repeating part vanishes: $9x=3$", "算$10x-x$，循环的部分就消失了：$9x=3$"],
    [0.78, "그래서 $x=\\dfrac{3}{9}=\\dfrac{1}{3}$이에요.", "So $x=\\dfrac{3}{9}=\\dfrac{1}{3}$.", "所以$x=\\dfrac{3}{9}=\\dfrac{1}{3}$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.1, 0.1, 0.15], 5.8, 60);
    k.table();
    const PW = 6.3, PD = 4.1, PZ = 0.1;
    const Z1 = -1.25, Z2 = -0.3, Z3 = 0.4, Z4 = 1.35;
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => { const P = onPaper(PW, PD, 0, PZ, w, h);
      ink(g, '=', P.X(-1.75), P.Y(Z1), 90);
      [2.72, 2.87, 3.02].forEach(x => { g.fillStyle = 'rgba(28,20,14,.85)'; g.beginPath(); g.arc(P.X(x), P.Y(Z1 + 0.12), 9, 0, Math.PI * 2); g.fill(); });
      ink(g, '−', P.X(-1.95), P.Y(Z3), 100);
      g.strokeStyle = 'rgba(28,20,14,.8)'; g.lineWidth = 6; g.beginPath(); g.moveTo(P.X(-2.2), P.Y(0.85)); g.lineTo(P.X(0.95), P.Y(0.85)); g.stroke();
    });
    k.card([{ n:'1', d:'3' }], -2.35, Z1, { w:0.7, d:0.9, h:0.04, y:0.035, size:760 });
    const T = [];
    T.push(dtile(k, '0', -1.2, Z1, { w:0.5, d:0.6, size:300 }));
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 16), new THREE.MeshPhysicalMaterial({ color:'#1d1712', roughness:0.3, clearcoat:1 }));
    dot.position.set(-0.83, 0.06, Z1 + 0.18); dot.castShadow = true; scene.add(dot);
    for(let i = 0; i < 6; i++) T.push(dtile(k, '3', -0.45 + i * 0.52, Z1, { w:0.46, d:0.6, size:300, bg:'#f6dcc0', color:'#7a1d12' }));
    /* 식 카드 — 소수점 아래가 위아래로 줄 맞게 */
    const cA = fitCard(k, '10x = 3.333...', -0.6, Z2, { w:2.6, d:0.6, h:0.04, y:0.035, fill:0.82 });
    const cB = fitCard(k, 'x = 0.333...', -0.6, Z3, { w:2.6, d:0.6, h:0.04, y:0.035, fill:0.82 * 0.86 });
    const c9 = fitCard(k, '9x = 3', -0.6, Z4, { w:1.6, d:0.62, h:0.05, y:0.035, fill:0.7, bg:'#f3e2b8' });
    const cX = k.card(['x = ', { n:'1', d:'3' }], 1.75, Z4, { w:1.5, d:0.86, h:0.05, y:0.035, size:250, bg:'#f3e2b8' });
    fitCard(k, '10x − x', 1.75, Z2 + 0.35, { w:1.5, d:0.56, h:0.04, y:0.035, fill:0.72 });
    const threes = T.slice(1), hAB = hopper([cA, cB]), h9 = hopper([c9]), hX = hopper([cX]);
    const y3 = threes.map(g => g.position.y);
    /* 움직임: 3 이 끝없이 이어지듯 파도처럼 차례로 뛰고 → 10x·x 카드 → 9x = 3 → x = 1/3 */
    k.onFrame(t => { const p = cyc(t, 9);
      threes.forEach((g, i) => { const a = 0.04 + i * 0.035; g.position.y = y3[i] + 0.22 * hop(p, a, a + 0.1); });
      hAB(p, 0.34, 0.48, 0.25); h9(p, 0.56, 0.7, 0.3); hX(p, 0.78, 0.92, 0.3); });
    k.lights(LIGHTS);
  }},

  /* 100에 가까운 수의 나눗셈 — stage ①: 6165÷98, 100으로 어림 61…265, (100−98)×61=122, 265+122=387, 387÷98≈3…93 → 64…93 */
  'H-06': { seed:274, caps:{ P:9, list:[
    [0.0, "$6165\\div 98$을 먼저 $100$으로 나눈 척해요: 몫 $61$, 나머지 $65$", "For $6165\\div 98$, first pretend to divide by $100$: quotient $61$, remainder $65$", "算$6165\\div 98$，先当作除以$100$：商$61$，余$65$"],
    [0.24, "$98$은 $100$보다 $2$ 모자라니 $61\\times 2=122$를 나머지에 더해요.", "$98$ is $2$ short of $100$, so add $61\\times 2=122$ to the remainder.", "$98$比$100$少$2$，所以把$61\\times 2=122$加到余数上。"],
    [0.5, "$65+122=187$ — 아직 $98$보다 커서 한 번 더: 몫 $1$, 나머지 $89$", "$65+122=187$ is still bigger than $98$, so once more: $1$ rem. $89$", "$65+122=187$还比$98$大，再来一次：商$1$，余$89$"],
    [0.76, "그래서 몫은 $61+1=62$, 나머지는 $89$이에요.", "So the quotient is $61+1=62$ and the remainder is $89$.", "所以商是$61+1=62$，余数是$89$。"]
  ]},
    build(k){
    k.frame([0.1, 0.1, 0.15], 5.9, 60);
    k.table();
    const PW = 6.4, PD = 4.1, PZ = 0.1;
    const Z1 = -1.35, Z2 = -0.45, Z3 = 0.3, Z4 = 1.2, XQ = -2.2, XR = -0.75, RX = 1.6;
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => { const P = onPaper(PW, PD, 0, PZ, w, h);
      ink(g, '100 − 98 =', P.X(1.25), P.Y(Z1), 74);
      ink(g, '…', P.X(-1.5), P.Y(Z2), 80);
      ink(g, '+', P.X(-1.5), P.Y(Z3), 90);
      g.strokeStyle = 'rgba(28,20,14,.8)'; g.lineWidth = 6; g.beginPath(); g.moveTo(P.X(-1.75), P.Y(0.75)); g.lineTo(P.X(-0.1), P.Y(0.75)); g.stroke();
      ink(g, '61 × 2 = 122', P.X(RX), P.Y(Z2 + 0.05), 70, { color:'rgb(150,40,25)' });
      ink(g, '187 ÷ 98 = 1 … 89', P.X(RX + 0.05), P.Y(Z3 + 0.05), 66);
      ink(g, '→', P.X(0.3), P.Y(Z4), 80);
    });
    fitCard(k, '6165 ÷ 98', -1.3, Z1, { w:2.2, d:0.62, h:0.04, y:0.035, fill:0.8 });
    const two = dtile(k, '2', 2.55, Z1, { w:0.52, d:0.52, h:0.16, side:k.lacquer('#8e2418'), bg:'#f4d6c8', color:'#7a1d12' });
    const CO = { w:0.95, d:0.6, h:0.04, y:0.035, fill:0.62 };
    const q61 = fitCard(k, '61', XQ, Z2, Object.assign({ bg:'#f6dcc0' }, CO));
    fitCard(k, '65', XR, Z2, CO);
    const c122 = fitCard(k, '122', XR, Z3, CO);
    const c387 = fitCard(k, '187', XR, Z4, CO);
    const ans = fitCard(k, '62 … 89', RX + 0.1, Z4, { w:1.9, d:0.7, h:0.05, y:0.035, fill:0.75, bg:'#f3e2b8' });
    const h2 = hopper([two, q61]), h122 = hopper([c122]), h387 = hopper([c387]), hA = hopper([ans]);
    /* 움직임: 모자란 2 와 몫 61 이 함께 뛰고 → 122 → 187 → 62 … 89 */
    k.onFrame(t => { const p = cyc(t, 9);
      h2(p, 0.26, 0.38, 0.3); h122(p, 0.38, 0.5, 0.3); h387(p, 0.52, 0.64, 0.3); hA(p, 0.78, 0.92, 0.32); });
    k.lights(LIGHTS);
  }}
};
