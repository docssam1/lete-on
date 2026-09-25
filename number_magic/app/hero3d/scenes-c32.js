/* C32 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* 지수(윗첨자)가 들어간 식을 판 윗면에 그린다 — 'a^{3}', '12x^{5}' 처럼 ^{…} 부분만 작게 올려 쓴다.
   글꼴은 k.mathText(KaTeX)만 쓴다. */
const supTex = (k, txt, o) => k.canvasTex(o.pw || 1024, o.ph || 512, (g, w, h) => {
  g.fillStyle = o.bg || '#f3e7cf'; g.fillRect(0, 0, w, h);
  if(o.grain){ for(let i = 0; i < 60; i++){ g.strokeStyle = `rgba(120,80,40,${0.05 + k.rnd() * 0.1})`; g.lineWidth = 1 + k.rnd() * 2; g.beginPath(); const y = k.rnd() * h; g.moveTo(0, y); for(let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / 90 + i) * 4); g.stroke(); } }
  const fs = o.size || h * 0.5, ss = fs * 0.64;
  const runs = []; String(txt).split(/(\^\{[^}]*\})/).filter(r => r !== '').forEach(r => { const m = r.match(/^\^\{([^}]*)\}$/); runs.push(m ? { t:m[1], sup:true } : { t:r }); });
  g.fillStyle = o.color || '#2b2118'; g.textBaseline = 'middle';
  const ws = runs.map(r => k.mathText(g, r.t, 0, 0, r.sup ? ss : fs, { draw:false }) + (r.sup ? fs * 0.02 : 0));
  let x = (w - ws.reduce((a, b) => a + b, 0)) / 2; const cy = h / 2 + fs * 0.12;
  runs.forEach((r, i) => { k.mathText(g, r.t, x, r.sup ? cy - fs * 0.44 : cy, r.sup ? ss : fs, { align:'left' }); x += ws[i]; });
});
/* 윗면에 supTex 를 얹은 판(나무 블록·종이 카드 공용) */
const slab = (k, txt, x, z, o) => {
  o = o || {};
  const { THREE, scene } = k;
  const w = o.w || 1.0, d = o.d || 0.6, h = o.h || 0.05;
  const grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, o.rad == null ? Math.min(0.05, d * 0.1) : o.rad), o.side || new THREE.MeshStandardMaterial({ color:o.edge || '#e9dcc0', roughness:0.85 }));
  body.castShadow = true; body.receiveShadow = true; grp.add(body);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.92, d * 0.9), new THREE.MeshStandardMaterial({ map:supTex(k, txt, Object.assign({ pw:1024, ph:Math.round(1024 * d / w) }, o)), roughness:0.75 }));
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
  grp.position.set(x, o.y || 0, z); grp.rotation.y = o.rot || 0; scene.add(grp); return grp;
};

export const SCENES_C32 = {

  /* 지수법칙 — stage ①: a³ 은 a 를 3번, a⁴ 는 a 를 4번 → 모두 3+4=7번 → a³×a⁴=a⁷. a 블록 3개·4개와 식 카드 */
  'M-10': { seed:181, caps:{ P:8, list:[
    [0.0, "$a^3$은 $a$를 $3$번, $a^4$은 $a$를 $4$번 곱한 것입니다.", "$a^3$ is $a$ multiplied $3$ times; $a^4$ is $a$ multiplied $4$ times.", "$a^3$是把$a$乘$3$次，$a^4$是把$a$乘$4$次。"],
    [0.1, "하나씩 세어 봅니다 — 모두 $3+4=7$번입니다.", "Count them one by one: $3+4=7$ times in all.", "一个一个数——一共$3+4=7$次。"],
    [0.6, "$a^3\\times a^4=a^{3+4}=a^7$ — 밑이 같으면 지수를 더합니다.", "$a^3\\times a^4=a^{3+4}=a^7$: same base, add the exponents.", "$a^3\\times a^4=a^{3+4}=a^7$——底数相同，指数相加。"]
  ]},
    build(k){
    k.frame([0.62, 0.1, 0.35], 6.9, 48);
    k.table();
    const PITCH = 0.66, ZT = -0.2, ZC = 0.95;
    const xa = [-2.35, -2.35 + PITCH, -2.35 + PITCH * 2], xb = [0.05, 0.05 + PITCH, 0.05 + PITCH * 2, 0.05 + PITCH * 3];
    const tiles = [...xa, ...xb].map(x => k.tile('a', x, ZT, { w:0.56, d:0.56, h:0.2, size:330, grain:true, weight:'italic 700' }));
    const cardO = { w:1.05, d:0.72, size:400 };
    slab(k, 'a^{3}', xa[1], ZC, cardO);
    k.tile('×', -0.62, ZC, { w:0.46, d:0.46, size:330, grain:true });
    slab(k, 'a^{4}', (xb[1] + xb[2]) / 2, ZC, cardO);
    k.tile('=', 2.42, ZC, { w:0.46, d:0.46, size:330, grain:true });
    const res = slab(k, 'a^{7}', 3.4, ZC, Object.assign({}, cardO, { bg:'#f7e4b5', h:0.07 }));
    /* 움직임: a 블록이 하나씩 들렸다 놓이며 1…7 을 센다 → 두 묶음이 붙어 한 줄 7개 → a⁷ 카드가 한 번 뛴다 → 제자리 */
    const x0 = tiles.map(g => g.position.x), y0 = tiles.map(g => g.position.y), ry = res.position.y;
    k.onFrame(t => { const p = cyc(t, 8);
      const j = seg(p, 0.55, 0.66) * (1 - seg(p, 0.86, 0.97));
      tiles.forEach((g, i) => { const a = 0.1 + i * 0.062;
        g.position.y = y0[i] + 0.28 * hop(p, a, a + 0.07);
        g.position.x = x0[i] + (i < 3 ? 0.36 : -0.36) * j; });
      res.position.y = ry + 0.3 * hop(p, 0.62, 0.74); });
    k.lights({ envOpts:{ intensity:0.45 } });
  }},

  /* 단항식의 곱셈 — history: 문자는 숫자를 담는 상자, "상자는 상자끼리". stage ①: 3x²×4x³=12x⁵ (3×4=12, x²×x³=x⁵) */
  'M-11': { seed:191, caps:{ P:8, list:[
    [0.0, "$3x^2\\times 4x^3$ — 숫자 부분과 문자 부분이 곱해져 있습니다.", "$3x^2\\times 4x^3$: number parts and letter parts multiplied together.", "$3x^2\\times 4x^3$——数字部分和字母部分乘在一起。"],
    [0.1, "숫자는 숫자끼리, 문자(상자)는 문자끼리 모읍니다.", "Numbers go with numbers, letters (boxes) with letters.", "数字归数字，字母(盒子)归字母。"],
    [0.4, "$3\\times 4=12$, $x^2\\times x^3=x^5$", "$3\\times 4=12$, $x^2\\times x^3=x^5$", "$3\\times 4=12$，$x^2\\times x^3=x^5$"],
    [0.72, "그래서 $3x^2\\times 4x^3=12x^5$입니다.", "So $3x^2\\times 4x^3=12x^5$.", "所以$3x^2\\times 4x^3=12x^5$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.3, 0.2, 0.0], 6.4, 44);
    k.table();
    const num = (t, x) => k.tile(t, x, 0, { w:0.6, d:0.6, h:0.18, size:360, grain:true });
    /* 문자 = 상자(골판지), 윗면에 붙인 종이 딱지에 x², x³ */
    const box = (t, x) => { const g = new THREE.Group();
      const b = new THREE.Mesh(k.rbox(0.64, 0.5, 0.64, 0.03), k.cardboard()); b.castShadow = b.receiveShadow = true; g.add(b);
      const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshStandardMaterial({ map:supTex(k, t, { pw:512, ph:512, bg:'#efe3c6', size:290 }), roughness:0.85 }));
      lab.rotation.x = -Math.PI / 2; lab.position.y = 0.503; lab.receiveShadow = true; g.add(lab);
      g.position.set(x, 0, 0); scene.add(g); return g; };
    const n3 = num('3', -3.12), bx2 = box('x^{2}', -2.35);
    k.tile('×', -1.6, 0, { w:0.44, d:0.44, size:320, grain:true });
    const n4 = num('4', -0.85), bx3 = box('x^{3}', -0.15);
    k.tile('=', 0.65, 0, { w:0.44, d:0.44, size:320, grain:true });
    slab(k, '12x^{5}', 1.75, 0, { w:1.45, d:0.8, h:0.07, size:330, bg:'#f7e4b5' });
    /* 움직임: 4 는 위로 넘어 3 옆으로, x² 상자는 뒤로 돌아 x³ 옆으로 — 숫자끼리·상자끼리 모였다가 제자리 */
    const A = n4.position.clone(), B = bx2.position.clone();
    k.onFrame(t => { const p = cyc(t, 8); const u = seg(p, 0.1, 0.36) * (1 - seg(p, 0.76, 0.96));
      const up = p < 0.5 ? seg(p, 0.1, 0.36) : 1 - seg(p, 0.76, 0.96), s = Math.sin(Math.PI * up);
      n4.position.set(A.x + (B.x - A.x) * u, A.y + 0.95 * s, A.z);
      bx2.position.set(B.x + (A.x - B.x) * u, B.y + 0.08 * s, B.z - 1.0 * s); });
    k.lights({ envOpts:{ intensity:0.45 } });
  }},

  /* 다항식의 덧셈 — hook: 사과 3개 + 배 2개는 "5개"가 아니다. 그럼 3x + 2y 는? 실물 사과·배와 식 카드 */
  'M-12': { seed:201, caps:{ P:8, list:[
    [0.0, "사과 $3$개와 배 $2$개가 있습니다.", "Here are $3$ apples and $2$ pears.", "这里有$3$个苹果和$2$个梨。"],
    [0.12, "한데 섞어 \"$5$개\"라고 하면 틀립니다 — 종류가 다르기 때문입니다.", "Lumping them into \"$5$\" is wrong: they are different kinds.", "混在一起说\"$5$个\"是错的——因为种类不同。"],
    [0.5, "사과는 사과끼리, 배는 배끼리 나눕니다.", "Apples with apples, pears with pears.", "苹果归苹果，梨归梨。"],
    [0.74, "$3x+2y$도 $x$와 $y$는 종류가 달라 그대로 둡니다.", "In $3x+2y$, $x$ and $y$ are different kinds, so it stays as it is.", "$3x+2y$中$x$和$y$种类不同，所以保持原样。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.25, 0.3], 6.0, 40);
    k.table();
    const skinA = new THREE.MeshPhysicalMaterial({ color:'#a8231c', roughness:0.32, clearcoat:0.6, clearcoatRoughness:0.3, sheen:0.3, sheenColor:new THREE.Color('#ff9a70') });
    const skinP = new THREE.MeshPhysicalMaterial({ color:'#c7b347', roughness:0.55, clearcoat:0.2, clearcoatRoughness:0.5 });
    const stemM = new THREE.MeshStandardMaterial({ color:'#4a3018', roughness:0.8 });
    const leafM = new THREE.MeshStandardMaterial({ color:'#3f6b2a', roughness:0.6, side:THREE.DoubleSide });
    const apple = () => { const g = new THREE.Group();
      const pts = []; for(let i = 0; i <= 24; i++){ const a = -Math.PI / 2 + Math.PI * i / 24; const r = 0.3 * Math.cos(a) * (1 + 0.08 * Math.sin(a)); let y = 0.27 * Math.sin(a); if(i > 21) y -= (i - 21) * 0.025; if(i < 2) y += (2 - i) * 0.02; pts.push(new THREE.Vector2(Math.max(0.001, r), y)); }
      const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), skinA); body.position.y = 0.27; g.add(body);
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.16, 8), stemM); st.position.set(0.01, 0.55, 0); st.rotation.z = -0.25; g.add(st);
      const lf = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), leafM); lf.scale.set(1.3, 0.12, 0.55); lf.position.set(0.08, 0.6, 0.02); lf.rotation.z = 0.35; g.add(lf);
      g.children.forEach(m => { m.castShadow = m.receiveShadow = true; }); scene.add(g); return g; };
    const pear = () => { const g = new THREE.Group();
      /* 배 윤곽: 아래는 둥근 몸통, 위로 갈수록 매끄럽게 가늘어지는 목 */
      const prof = new THREE.SplineCurve([[0.001, 0], [0.16, 0.015], [0.25, 0.09], [0.275, 0.2], [0.25, 0.31], [0.19, 0.42], [0.145, 0.52], [0.125, 0.61], [0.1, 0.7], [0.05, 0.765], [0.001, 0.78]].map(([x, y]) => new THREE.Vector2(x, y))).getPoints(40);
      const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), skinP); g.add(body);
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.18, 8), stemM); st.position.set(0.02, 0.83, 0); st.rotation.z = -0.3; g.add(st);
      g.children.forEach(m => { m.castShadow = m.receiveShadow = true; }); scene.add(g); return g; };
    /* 제자리(종류별) · 섞인 무더기 자리 */
    const sorted = [[-2.35, -0.35], [-1.6, -0.45], [-1.95, 0.2], [1.45, -0.35], [2.2, -0.2]];
    const mixed = [[-0.3, -0.5], [0.3, 0.05], [0.35, -0.55], [-0.35, 0.1], [0.0, -0.2]];
    const fruit = [apple(), apple(), apple(), pear(), pear()];
    fruit.forEach((f, i) => { f.position.set(sorted[i][0], 0, sorted[i][1]); f.rotation.y = i * 1.3; });
    const cO = { w:1.05, d:0.66, size:310 };
    slab(k, '3x', -1.95, 1.1, cO);
    k.tile('+', 0, 1.1, { w:0.46, d:0.46, size:330, grain:true });
    slab(k, '2y', 1.8, 1.1, cO);
    /* 움직임: 다섯 개가 가운데로 섞였다가("5개?") 다시 사과는 사과끼리, 배는 배끼리 돌아간다 */
    k.onFrame(t => { const p = cyc(t, 8);
      fruit.forEach((f, i) => { const d = i * 0.02;
        const go = seg(p, 0.12 + d, 0.3 + d), back = seg(p, 0.5 + d, 0.68 + d), u = go * (1 - back);
        f.position.x = sorted[i][0] + (mixed[i][0] - sorted[i][0]) * u;
        f.position.z = sorted[i][1] + (mixed[i][1] - sorted[i][1]) * u;
        f.position.y = 0.35 * (hop(p, 0.12 + d, 0.3 + d) + hop(p, 0.5 + d, 0.68 + d)); }); });
    k.lights({ envOpts:{ intensity:0.5 } });
  }},

  /* 단항식×다항식 — stage ①: 3(2x+5)=3×2x+3×5=6x+15, 괄호 앞의 3 이 안의 모든 항에 곱해진다(분배법칙) */
  'M-13': { seed:211, caps:{ P:8, list:[
    [0.0, "$3(2x+5)$ — 괄호 앞의 $3$이 안의 모든 항에 곱해집니다.", "$3(2x+5)$: the $3$ outside multiplies every term inside.", "$3(2x+5)$——括号外的$3$乘括号内的每一项。"],
    [0.12, "$3\\times 2x=6x$", "$3\\times 2x=6x$", "$3\\times 2x=6x$"],
    [0.36, "$3\\times 5=15$", "$3\\times 5=15$", "$3\\times 5=15$"],
    [0.62, "$3(2x+5)=6x+15$ — 빠뜨리는 항이 없습니다.", "$3(2x+5)=6x+15$: no term is skipped.", "$3(2x+5)=6x+15$——一项都不漏。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.28, 0.5, 0.1], 6.9, 38);
    k.table();
    const Z = 0, T = (t, x, w, o) => k.tile(t, x, Z, Object.assign({ w, d:0.6, h:0.18, size:340, grain:true }, o || {}));
    const t3 = T('3', -2.75, 0.6, { wood:'#c98a4e' });
    T('(', -2.12, 0.34, { size:420 });
    const t2x = T('2x', -1.45, 0.8);
    T('+', -0.72, 0.44);
    const t5 = T('5', -0.08, 0.6);
    T(')', 0.52, 0.34, { size:420 });
    k.tile('=', 1.12, Z, { w:0.44, d:0.44, size:320, grain:true });
    const res = slab(k, '6x + 15', 2.45, Z, { w:1.9, d:0.72, h:0.07, size:280, bg:'#f7e4b5' });
    /* 구리 철사 두 줄 — 3 에서 2x 로, 3 에서 5 로(분배의 화살) */
    const cu = k.metal('#c46a3a', 0.3);
    const ZB = Z - 0.2;  /* 판 뒤쪽 끝 — 글자를 가리지 않게 */
    const arc = (x1, hgt) => new THREE.QuadraticBezierCurve3(new THREE.Vector3(-2.75, 0.3, ZB), new THREE.Vector3((-2.75 + x1) / 2, hgt, ZB), new THREE.Vector3(x1, 0.3, ZB));
    const arcs = [arc(-1.45, 1.35), arc(-0.08, 2.1)];
    arcs.forEach(c => { const m = new THREE.Mesh(new THREE.TubeGeometry(c, 80, 0.022, 10), cu); m.castShadow = true; scene.add(m);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 16), cu); const e = c.getPoint(1), dir = c.getTangent(1);
      tip.position.copy(e); tip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); tip.castShadow = true; scene.add(tip); });
    /* 움직임: 황동 구슬이 3 에서 2x 로, 다시 3 에서 5 로 철사를 타고 간다 — 닿을 때마다 그 항이 뛰고, 끝에 6x + 15 가 뛴다 */
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), k.metal('#d9b25a', 0.2)); bead.castShadow = true; scene.add(bead);
    const home = arcs[0].getPoint(0).clone().add(new THREE.Vector3(0, 0.02, 0)); bead.position.copy(home);
    const y2 = t2x.position.y, y5 = t5.position.y, y3 = t3.position.y, yr = res.position.y;
    k.onFrame(t => { const p = cyc(t, 8);
      if(p < 0.12 || p >= 0.56) bead.position.copy(home);
      else if(p < 0.32) bead.position.copy(arcs[0].getPoint(seg(p, 0.12, 0.3)));
      else bead.position.copy(arcs[1].getPoint(seg(p, 0.36, 0.54)));
      bead.visible = !(p >= 0.3 && p < 0.36);
      t3.position.y = y3 + 0.18 * (hop(p, 0.06, 0.13) + hop(p, 0.31, 0.37));
      t2x.position.y = y2 + 0.22 * hop(p, 0.29, 0.37);
      t5.position.y = y5 + 0.22 * hop(p, 0.53, 0.61);
      res.position.y = yr + 0.28 * hop(p, 0.64, 0.76); });
    k.lights({ envOpts:{ intensity:0.45 } });
  }},
};
