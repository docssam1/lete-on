/* C26 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
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
/* 가는 옻칠 막대(두 점 사이) */
function stick(k, mat, a, b, y){
  const { THREE, scene } = k;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, len, 8, 20), mat); m.rotation.z = Math.PI / 2; m.castShadow = m.receiveShadow = true;
  const g = new THREE.Group(); g.add(m); g.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]);
  g.position.set((a[0] + b[0]) / 2, (y || 0) + 0.065, (a[1] + b[1]) / 2); scene.add(g); return g;
}

export const SCENES_C26 = {

  /* 한쪽으로 모으기 — stage ①: 48×12 → (48×3)×(12÷3) = 144×4 → 576×1 = 576 */
  'H-01': { seed:261, caps:{ P:8, list:[
    [0.0, "$48\\times 12$에서 곱하는 수 $12$를 $3$으로 나눠요.", "In $48\\times 12$, divide the multiplier $12$ by $3$.", "在$48\\times 12$中，把乘数$12$除以$3$。"],
    [0.24, "그만큼 $48$에 $3$을 곱하면 $144\\times 4$ — 값은 그대로예요.", "Multiply $48$ by $3$ to make up for it: $144\\times 4$, same value.", "同时把$48$乘$3$：$144\\times 4$，值不变。"],
    [0.5, "한 번 더, $4$로: $576\\times 1$", "Once more, with $4$: $576\\times 1$", "再来一次，用$4$：$576\\times 1$"],
    [0.74, "곱하는 수가 $1$이 되면 남은 수가 답이에요. $48\\times 12=576$", "When the multiplier is $1$, what is left is the answer: $48\\times 12=576$", "乘数变成$1$时，剩下的数就是答案：$48\\times 12=576$"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0.1, 0.1, 0.12], 5.5, 60);
    k.table();
    const PW = 6.0, PD = 3.9, PZ = 0.05;
    const RZ = [-1.15, 0, 1.15], XL = -0.5, XR = 0.5;
    /* 곱해지는 수는 커지고(카드가 넓어지고), 곱하는 수는 작아진다(카드가 좁아진다) */
    const rows = [['48', '12', 0.95, 1.0], ['144', '4', 1.25, 0.78], ['576', '1', 1.55, 0.58]];
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => { const P = onPaper(PW, PD, 0, PZ, w, h);
      /* 줄 사이 화살표와 ×3·÷3, ×4·÷4 (붉은 먹) */
      [[0, '× 3', '÷ 3'], [1, '× 4', '÷ 4']].forEach(([i, a, b]) => { const zm = (RZ[i] + RZ[i + 1]) / 2;
        g.strokeStyle = 'rgba(150,40,25,.8)'; g.lineWidth = 6;
        [[XL - rows[i][2] / 2 - 0.25, a], [XR + rows[i][3] / 2 + 0.25, b]].forEach(([x, t]) => {
          g.beginPath(); g.moveTo(P.X(x), P.Y(zm - 0.2)); g.lineTo(P.X(x), P.Y(zm + 0.2)); g.lineTo(P.X(x) - 12, P.Y(zm + 0.2) - 16); g.moveTo(P.X(x), P.Y(zm + 0.2)); g.lineTo(P.X(x) + 12, P.Y(zm + 0.2) - 16); g.stroke();
          ink(g, t, P.X(x) + (x < 0 ? -80 : 80), P.Y(zm), 62, { color:'rgb(150,40,25)' }); });
      });
      ink(g, '= 576', P.X(XR + 0.58 / 2 + 0.95), P.Y(RZ[2]), 96);
    });
    const Lc = [], Rc = [], Xc = [];
    rows.forEach(([a, b, wa, wb], i) => {
      const hi = i === 2 ? { bg:'#f6dcc0' } : {};
      Lc.push(fitCard(k, a, XL - wa / 2, RZ[i], Object.assign({ w:wa, d:0.66, h:0.04, y:0.035, fill:0.78 }, hi)));
      Rc.push(fitCard(k, b, XR + wb / 2, RZ[i], Object.assign({ w:wb, d:0.66, h:0.04, y:0.035, fill:0.5 }, hi)));
      Xc.push(k.card(['×'], 0, RZ[i], { w:0.44, d:0.44, h:0.03, y:0.035, size:640 }));
    });
    /* 움직임: 첫 줄 → 둘째 줄 → 셋째 줄이 차례로 들렸다 놓인다(값은 그대로, 모양만 바뀐다) */
    const hs = [0, 1, 2].map(i => hopper([Lc[i], Rc[i], Xc[i]]));
    k.onFrame(t => { const p = cyc(t, 8);
      hs[0](p, 0.04, 0.2, 0.28); hs[1](p, 0.3, 0.46, 0.34); hs[2](p, 0.56, 0.72, 0.4); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.1], spot:24, envOpts:{ intensity:0.5 } });
  }},

  /* 100 보수 곱 — stage ①: 96·93 은 100보다 4·7 모자란다. 엇갈려 빼면 96−7=89(앞자리), 4×7=28(뒷자리) → 8928 */
  'H-02': { seed:262, caps:{ P:8, list:[
    [0.0, "$96$은 $100$보다 $4$, $93$은 $100$보다 $7$ 모자라요.", "$96$ is $4$ short of $100$, and $93$ is $7$ short.", "$96$比$100$少$4$，$93$比$100$少$7$。"],
    [0.14, "엇갈려 빼면 $96-7=89$ — 앞자리예요.", "Subtract crosswise: $96-7=89$, the front part.", "交叉相减：$96-7=89$，这是前段。"],
    [0.36, "모자란 두 수를 곱하면 $4\\times 7=28$ — 뒷자리예요.", "Multiply the two shortfalls: $4\\times 7=28$, the back part.", "两个差相乘：$4\\times 7=28$，这是后段。"],
    [0.6, "붙이면 $96\\times 93=8928$이에요.", "Put them together: $96\\times 93=8928$.", "拼在一起：$96\\times 93=8928$。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0.1, 0.1, 0.12], 5.7, 60);
    k.table();
    const PW = 6.2, PD = 3.9, PZ = 0.05;
    const CL = -1.75, CR = -0.3, Z1 = -1.15, Z2 = -0.1, Z3 = 1.2, RX = 1.75;
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => { const P = onPaper(PW, PD, 0, PZ, w, h);
      /* 엇갈림 X — 96 과 7, 93 과 4 */
      g.strokeStyle = 'rgba(150,40,25,.75)'; g.lineWidth = 7; g.setLineDash([22, 14]);
      g.beginPath(); g.moveTo(P.X(CL + 0.5), P.Y(Z1 + 0.3)); g.lineTo(P.X(CR - 0.3), P.Y(Z2 - 0.28));
      g.moveTo(P.X(CL + 0.5), P.Y(Z2 - 0.3)); g.lineTo(P.X(CR - 0.3), P.Y(Z1 + 0.28)); g.stroke(); g.setLineDash([]);
      /* 가로줄 */
      g.strokeStyle = 'rgba(28,20,14,.8)'; g.lineWidth = 6; g.beginPath(); g.moveTo(P.X(CL - 0.75), P.Y(0.55)); g.lineTo(P.X(CR + 0.55), P.Y(0.55)); g.stroke();
      ink(g, '×', P.X(CL - 0.85), P.Y(Z2), 90);
      ink(g, '96 − 7 = 89', P.X(RX), P.Y(Z1), 84);
      ink(g, '4 × 7 = 28', P.X(RX), P.Y(Z2), 84);
      ink(g, '=', P.X(0.62), P.Y(Z3), 96);
    });
    const CO = { w:1.0, d:0.66, h:0.04, y:0.035, fill:0.62 };
    fitCard(k, '96', CL, Z1, CO); fitCard(k, '93', CL, Z2, CO);
    const chip = (t, z) => dtile(k, t, CR, z, { w:0.56, d:0.56, h:0.16, side:k.lacquer('#8e2418'), bg:'#f4d6c8', color:'#7a1d12' });
    const c4 = chip('4', Z1), c7 = chip('7', Z2);
    const c89 = fitCard(k, '89', CL, Z3, Object.assign({ bg:'#f6dcc0' }, CO));
    const c28 = fitCard(k, '28', CR + 0.2, Z3, Object.assign({ bg:'#f6dcc0' }, CO));
    const ans = fitCard(k, '8928', RX, Z3, { w:1.6, d:0.72, h:0.05, y:0.035, fill:0.72, bg:'#f3e2b8' });
    const X28 = c28.position.x, XJ = CL + 1.0;
    /* 움직임: 7 이 엇갈려 뛰고 → 89, 4·7 이 함께 뛰고 → 28, 89 와 28 이 붙어 8928 → 제자리 */
    const h89 = hopper([c89]), hA = hopper([ans]);
    const y28 = c28.position.y;
    k.onFrame(t => { const p = cyc(t, 8);
      h89(p, 0.2, 0.34, 0.3);
      c7.position.y = 0.3 * hop(p, 0.08, 0.2) + 0.3 * hop(p, 0.36, 0.48); c4.position.y = 0.3 * hop(p, 0.36, 0.48);
      const j = seg(p, 0.6, 0.7) * (1 - seg(p, 0.86, 0.97));
      c28.position.x = X28 + (XJ - X28) * j; c28.position.y = y28 + 0.3 * hop(p, 0.44, 0.56) + 0.15 * hop(p, 0.6, 0.7) + 0.15 * hop(p, 0.86, 0.97);
      hA(p, 0.7, 0.84, 0.3); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.1], spot:24, envOpts:{ intensity:0.5 } });
  }},

  /* 엑스맨 곱셈 — stage ①②: 34×26, 세로 3×2=6(백), X 3×6+4×2=26(십), 세로 4×6=24(일) → 600+260+24=884 */
  'C-12': { seed:212, caps:{ P:8, list:[
    [0.0, "$34\\times 26$: 세로줄끼리 $3\\times 2=6$ — 백의 조각이에요.", "$34\\times 26$: down the left column, $3\\times 2=6$, the hundreds piece.", "$34\\times 26$：左边竖着$3\\times 2=6$，是百位的块。"],
    [0.28, "X자로 교차해서 $3\\times 6+4\\times 2=26$ — 십의 조각이에요.", "Cross in an X: $3\\times 6+4\\times 2=26$, the tens piece.", "X形交叉：$3\\times 6+4\\times 2=26$，是十位的块。"],
    [0.52, "세로줄끼리 $4\\times 6=24$ — 일의 조각이에요.", "Down the right column, $4\\times 6=24$, the ones piece.", "右边竖着$4\\times 6=24$，是个位的块。"],
    [0.74, "자리에 맞춰 더하면 $600+260+24=884$예요.", "Add by place value: $600+260+24=884$.", "按数位相加：$600+260+24=884$。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0.1, 0.1, 0.3], 6.0, 60);
    k.table();
    const PW = 6.2, PD = 4.0, PZ = 0.1;
    const TA = -1.15, TB = 0.05, XA = -1.35, XB = -0.35, ZR = 1.3;
    const RC = [-2.2, -0.85, 0.5];
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => { const P = onPaper(PW, PD, 0, PZ, w, h);
      ink(g, '×', P.X(XA - 0.72), P.Y(TB), 96);
      g.strokeStyle = 'rgba(28,20,14,.8)'; g.lineWidth = 6; g.beginPath(); g.moveTo(P.X(XA - 0.95), P.Y(0.62)); g.lineTo(P.X(XB + 0.55), P.Y(0.62)); g.stroke();
      ink(g, '=', P.X(1.3), P.Y(ZR), 100);
      /* 조각 카드 사이 + */
      ink(g, '+', P.X((RC[0] + RC[1]) / 2), P.Y(ZR), 80); ink(g, '+', P.X((RC[1] + RC[2]) / 2), P.Y(ZR), 80);
      /* 오른쪽 위: 자릿값 */
      ink(g, '600', P.X(1.9), P.Y(-1.25), 70, { color:'rgb(90,70,50)' });
      ink(g, '260', P.X(1.9), P.Y(-0.7), 70, { color:'rgb(150,40,25)' });
      ink(g, '24', P.X(1.9), P.Y(-0.15), 70, { color:'rgb(90,70,50)' });
    });
    const t3 = dtile(k, '3', XA, TA), t4 = dtile(k, '4', XB, TA), t2 = dtile(k, '2', XA, TB), t6 = dtile(k, '6', XB, TB);
    /* 막대: 세로 둘(검정), X 둘(붉은색) — 블록 사이에 */
    const red = k.lacquer('#8e1c16'), black = k.lacquer('#1d1712');
    const gap = 0.36;
    const vL = stick(k, black, [XA, TA + gap], [XA, TB - gap]), vR = stick(k, black, [XB, TA + gap], [XB, TB - gap]);
    const x1 = stick(k, red, [XA + 0.26, TA + 0.3], [XB - 0.26, TB - 0.3], 0.0), x2 = stick(k, red, [XB - 0.26, TA + 0.3], [XA + 0.26, TB - 0.3], 0.09);
    const CO = { w:0.84, d:0.66, h:0.04, y:0.035, fill:0.6 };
    const p6 = fitCard(k, '600', RC[0], ZR, CO), p26 = fitCard(k, '260', RC[1], ZR, Object.assign({ bg:'#f6d4c6' }, CO)), p24 = fitCard(k, '24', RC[2], ZR, CO);
    const ans = fitCard(k, '884', 2.15, ZR, { w:1.3, d:0.72, h:0.05, y:0.035, fill:0.66, bg:'#f3e2b8' });
    const h6 = hopper([p6]), h26 = hopper([p26]), h24 = hopper([p24]), hA = hopper([ans]);
    const all = [t3, t4, t2, t6, vL, vR, x1, x2], ya = all.map(g => g.position.y);
    /* 움직임: 왼쪽 세로 → 6, X → 26, 오른쪽 세로 → 24, 그리고 884 */
    k.onFrame(t => { const p = cyc(t, 8);
      all.forEach((g, i) => { g.position.y = ya[i]; });
      const add = (grp, a, b, hh) => grp.forEach(g => { g.position.y += hh * hop(p, a, b); });
      add([t3, t2, vL], 0.04, 0.18, 0.22); add([t3, t4, t2, t6, x1, x2], 0.3, 0.44, 0.22); add([t4, t6, vR], 0.54, 0.68, 0.22);
      h6(p, 0.14, 0.28, 0.3); h26(p, 0.4, 0.54, 0.3); h24(p, 0.64, 0.76, 0.3); hA(p, 0.8, 0.94, 0.32); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.1], spot:24, envOpts:{ intensity:0.5 } });
  }},

  /* 자리이동 곱셈 — stage ①②: 23×44, 23×4=92 한 번만, 한 칸 밀면 920, 920+92=1012 */
  'C-15': { seed:215, caps:{ P:8, list:[
    [0.0, "$23\\times 44$는 $23\\times 4=92$를 한 번만 구해요.", "For $23\\times 44$, work out $23\\times 4=92$ just once.", "$23\\times 44$只要算一次$23\\times 4=92$。"],
    [0.12, "$92$를 한 칸 밀면 $920$ — $\\times 10$이에요.", "Shift $92$ one place: $920$, that is $\\times 10$.", "把$92$移一位：$920$，就是$\\times 10$。"],
    [0.5, "자리를 맞춰 더하면 $920+92=1012$예요.", "Line up the places and add: $920+92=1012$.", "对齐数位相加：$920+92=1012$。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0.2, 0.1, 0.25], 5.4, 60);
    k.table();
    const PW = 6.0, PD = 4.1, PZ = 0.15;
    const C = [-1.2, -0.4, 0.4, 1.2], ZA = -0.55, ZB = 0.3, ZC = 1.35;
    k.paper(PW, PD, 0.15, PZ, 0, (g, w, h, ink) => { const P = onPaper(PW, PD, 0.15, PZ, w, h);
      /* 자리 칸(옅은 세로줄) */
      g.strokeStyle = 'rgba(80,110,140,.35)'; g.lineWidth = 3;
      [-1.6, -0.8, 0, 0.8, 1.6].forEach(x => { g.beginPath(); g.moveTo(P.X(x), P.Y(-1.0)); g.lineTo(P.X(x), P.Y(1.8)); g.stroke(); });
      ink(g, '+', P.X(-2.05), P.Y(ZB), 100);
      g.strokeStyle = 'rgba(28,20,14,.85)'; g.lineWidth = 7; g.beginPath(); g.moveTo(P.X(-2.3), P.Y(0.82)); g.lineTo(P.X(1.7), P.Y(0.82)); g.stroke();
      ink(g, '23 × 4 = 92', P.X(1.35), P.Y(-1.45), 76);
      ink(g, '× 10', P.X(2.2), P.Y(ZA), 64, { color:'rgb(150,40,25)' });
    });
    fitCard(k, '23 × 44', -1.0, -1.45, { w:1.7, d:0.6, h:0.04, y:0.035, fill:0.8 });
    const a9 = dtile(k, '9', C[1], ZA), a2 = dtile(k, '2', C[2], ZA), a0 = dtile(k, '0', C[3], ZA, { bg:'#f6d4c6', color:'#7a1d12' });
    dtile(k, '9', C[2], ZB); dtile(k, '2', C[3], ZB);
    const res = ['1', '0', '1', '2'].map((d, i) => dtile(k, d, C[i], ZC, { bg:'#f3e2b8' }));
    const hr = res.map(r => hopper([r]));
    /* 움직임: 920 의 9·2 가 한 칸 오른쪽(92)으로 돌아가고 0 이 사라졌다가 → 다시 한 칸 밀리며 0 이 채워진다 → 1012 가 일의 자리부터 */
    k.onFrame(t => { const p = cyc(t, 8);
      const u = seg(p, 0.02, 0.1) * (1 - seg(p, 0.16, 0.3));
      a9.position.x = C[1] + 0.8 * u; a2.position.x = C[2] + 0.8 * u;
      a9.position.y = a2.position.y = 0.25 * hop(p, 0.02, 0.1) + 0.25 * hop(p, 0.16, 0.3);
      const z = 1 - u; a0.scale.setScalar(Math.max(0.001, z)); a0.position.y = 0.3 * (1 - z);
      hr.slice().reverse().forEach((h, i) => h(p, 0.5 + i * 0.08, 0.62 + i * 0.08, 0.3)); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0, 0.1], spot:24, envOpts:{ intensity:0.5 } });
  }}
};
