/* C34 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

/* 좌표판 — 나무판 위 모눈종이. x0~x1, y0~y1 범위, 한 칸 ux·uy(월드 길이). 눈금 숫자는 xs·ys 목록만.
   P(x, y, h) 로 판 위의 월드 좌표를 돌려준다(h 없으면 철사 높이). */
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
/* 곧은 철사(판 위 두 점 사이) */
function wire(k, a, b, mat, r){
  const { THREE, scene } = k;
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 8, r || 0.03, 12), mat);
  m.castShadow = true; k.scene.add(m);
  [a, b].forEach(p => { const c = new THREE.Mesh(new THREE.SphereGeometry((r || 0.03) * 1.05, 16, 12), mat); c.position.copy(p); scene.add(c); });
  return m;
}
/* 압정 — 둥근 머리 + 짧은 바늘 */
function pin(k, p, color){
  const { THREE, scene } = k;
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), new THREE.MeshPhysicalMaterial({ color, roughness:0.25, clearcoat:1 })); head.position.y = 0.12;
  const nd = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), k.metal('#c9c3b5', 0.25)); nd.position.y = 0.05;
  [head, nd].forEach(m => { m.castShadow = true; g.add(m); });
  g.position.set(p.x, 0.08, p.z); scene.add(g); return g;
}
/* 구슬 */
function bead(k, color, r){
  const m = new k.THREE.Mesh(new k.THREE.SphereGeometry(r || 0.085, 24, 16), new k.THREE.MeshPhysicalMaterial({ color, roughness:0.22, clearcoat:1 }));
  m.castShadow = true; k.scene.add(m); return m;
}
/* 세운 글자판(라벨) — 캔버스에 수식 한 줄을 폭에 맞춰 그린다 */
function plate(k, txt, w, h, o){
  o = o || {};
  const cw = 1024, ch = Math.round(1024 * h / w);
  const tex = k.canvasTex(cw, ch, (g) => {
    g.fillStyle = o.bg || '#f3e7cf'; g.fillRect(0, 0, cw, ch);
    g.fillStyle = o.color || '#2b2118'; g.textBaseline = 'middle';
    let sz = ch * (o.fill || 0.62); const tw = k.mathText(g, txt, 0, 0, sz, { draw:false });
    if(tw > cw * 0.86) sz *= cw * 0.86 / tw;
    k.mathText(g, txt, cw / 2, ch / 2, sz);
  });
  const mat = new k.THREE.MeshStandardMaterial({ map:tex, roughness:0.7 });
  if(o.glow){ mat.emissive = new k.THREE.Color('#ffd89a'); mat.emissiveMap = tex; mat.emissiveIntensity = 0; }
  const m = new k.THREE.Mesh(new k.THREE.PlaneGeometry(w, h), mat); m.receiveShadow = true; return m;
}
const cl = x => Math.max(0, Math.min(1, x));
/* 글자 크기를 카드 폭에 맞춘 k.card — 식 한 줄(문자열)이 카드의 fill 비율을 넘지 않게 */
function fitCard(k, txt, x, z, o){
  o = Object.assign({}, o); const w = o.w || 1.2, d = o.d || 0.8, ph = Math.round(1024 * d / w);
  const g = document.createElement('canvas').getContext('2d');
  const tw = k.mathText(g, txt, 0, 0, 100, { draw:false });
  o.size = Math.min(ph * (o.hmax || 0.62), 100 * 1024 * (o.fill || 0.84) / tw);
  return k.card([txt], x, z, o);
}

export const SCENES_C34 = {

  /* 함수와 함숫값 — hook: 자판기에 동전을 넣으면 음료가 나온다. stage ①: f(x)=2x+1, f(3)=2×3+1=7 */
  'M-73': { seed:173, caps:{ P:8, list:[
    [0.0, "자판기처럼, $x$를 넣으면 정해진 값 하나가 나옵니다.", "Like a vending machine: put in $x$, and exactly one value comes out.", "就像自动售货机：代入$x$，就得到唯一确定的值。"],
    [0.18, "$f(x)=2x+1$에 $3$을 넣으면 $2\\times 3+1=7$", "Put $3$ into $f(x)=2x+1$: $2\\times 3+1=7$", "把$3$代入$f(x)=2x+1$：$2\\times 3+1=7$"],
    [0.58, "그래서 $f(3)=7$입니다. $f$와 $3$을 곱한 것이 아닙니다.", "So $f(3)=7$. It is not $f$ times $3$.", "所以$f(3)=7$。它不是$f$乘以$3$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.05, 0.95, 0.35], 4.9, 16);
    k.table();
    const MX = 0.35, MZ = -0.35, BW = 1.6, BH = 2.1, BD = 1.0, FZ = MZ + BD / 2 + 0.04;   /* 둥근 모서리(베벨)만큼 앞으로 */
    const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; scene.add(m); return m; };
    /* 자판기 몸통(붉은 옻칠) + 윗단 */
    add(k.rbox(BW, BH, BD, 0.07), k.lacquer('#8e1c16'), MX, 0, MZ);
    add(k.rbox(BW + 0.06, 0.08, BD + 0.06, 0.04), k.metal('#b8b3a8', 0.3), MX, BH, MZ);
    /* 앞면: 식 판(빛나는), 동전 투입구, 꺼내는 곳 */
    const lab = plate(k, 'f(x) = 2x + 1', 1.34, 0.46, { glow:true, fill:0.6 }); lab.position.set(MX, 1.68, FZ + 0.02); scene.add(lab);
    const frameM = k.metal('#c9c3b5', 0.28);
    add(new THREE.BoxGeometry(1.42, 0.54, 0.02), frameM, MX, 1.68, FZ + 0.002);
    const SX = MX + 0.5, SY = 1.05;
    add(new THREE.BoxGeometry(0.3, 0.48, 0.03), frameM, SX, SY, FZ + 0.01);
    add(new THREE.BoxGeometry(0.05, 0.3, 0.012), new THREE.MeshStandardMaterial({ color:'#120c08', roughness:0.9 }), SX, SY, FZ + 0.03);
    const hole = add(new THREE.BoxGeometry(1.1, 0.5, 0.02), new THREE.MeshStandardMaterial({ color:'#140d09', roughness:0.95 }), MX, 0.42, FZ + 0.002);
    hole.castShadow = false;
    add(new THREE.BoxGeometry(1.2, 0.04, 0.34), frameM, MX, 0.16, FZ + 0.16);
    add(new THREE.BoxGeometry(1.2, 0.14, 0.03), frameM, MX, 0.22, FZ + 0.33);
    /* 동전 3 — 탁자 위에 누워 있다 */
    const brass = k.metal('#c9a14f', 0.32);
    const coin = new THREE.Group();
    const cb = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 48), brass); cb.castShadow = cb.receiveShadow = true; coin.add(cb);
    const cf = new THREE.Mesh(new THREE.CircleGeometry(0.23, 48), new THREE.MeshStandardMaterial({ map:k.faceTex('3', { bg:'#b8914a', color:'#4a3210', size:360 }), metalness:0.6, roughness:0.35 }));
    cf.rotation.x = -Math.PI / 2; cf.position.y = 0.031; coin.add(cf);
    const C0 = new THREE.Vector3(-1.35, 0.03, 0.75); coin.position.copy(C0); coin.rotation.y = 0.25; scene.add(coin);
    /* 음료 캔 7 — 꺼내는 곳에 나와 있다 */
    const canTex = k.canvasTex(1280, 512, (g, w, h) => { g.fillStyle = '#e8e2d4'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#2f6a8f'; g.fillRect(0, h * 0.06, w, h * 0.1); g.fillRect(0, h * 0.84, w, h * 0.1);
      g.fillStyle = '#1f2f3a'; g.textBaseline = 'middle'; k.mathText(g, '7', w / 2, h * 0.52, h * 0.6); });
    const canSide = new THREE.MeshStandardMaterial({ map:canTex, metalness:0.35, roughness:0.35 }), canTop = k.metal('#cfccc4', 0.25);
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.52, 48), [canSide, canTop, canTop]);
    can.rotation.y = Math.PI; can.castShadow = can.receiveShadow = true;
    const CAN = new THREE.Vector3(MX - 0.05, 0.18 + 0.26, FZ + 0.17); can.position.copy(CAN); scene.add(can);
    /* 식 쪽지 */
    k.paper(2.7, 0.62, 0.35, 1.35, -0.02, (g, w, h, ink) => { ink(g, 'f(3) = 2 × 3 + 1 = 7', w / 2, h * 0.52, 118); });
    /* 움직임: 캔을 되감아 넣고 → 동전 3 이 투입구로 → 식 판이 빛나고 → 캔 7 이 나온다 → 동전이 제자리에 다시 놓인다 */
    const SLOT = new THREE.Vector3(SX, SY, FZ + 0.25);
    k.onFrame(t => { const p = cyc(t, 8);
      /* 캔: 0.04~0.14 안으로 들어가고, 0.52~0.64 다시 나온다 */
      const cin = seg(p, 0.04, 0.14) * (1 - seg(p, 0.52, 0.64));
      can.position.set(CAN.x, CAN.y + 0.06 * hop(p, 0.6, 0.68), CAN.z - 0.75 * cin);
      /* 동전: 0.16~0.34 들려서 세워지며 투입구 앞으로, 0.34~0.42 안으로 */
      const a = seg(p, 0.16, 0.34), b = seg(p, 0.34, 0.42), back = seg(p, 0.72, 0.92);
      if(p < 0.72){
        coin.position.lerpVectors(C0, SLOT, a); coin.position.y += 0.5 * Math.sin(Math.PI * a);
        coin.position.z -= 0.5 * b; coin.rotation.set(0, 0.25 * (1 - a), (Math.PI / 2) * a); coin.scale.setScalar(1); coin.visible = b < 0.98;
      } else { coin.visible = true; coin.position.copy(C0); coin.position.y += 0.35 * (1 - back); coin.rotation.set(0, 0.25, 0); coin.scale.setScalar(Math.max(0.001, back)); }
      lab.material.emissiveIntensity = 0.9 * hop(p, 0.42, 0.56); });
    k.lights({ key:3.0, keyPos:[-4, 7, 6], spotPos:[0.5, 6, 4], spotAt:[0.3, 0.9, 0], spot:30, envOpts:{ intensity:0.6 } });
  }},

  /* 일차함수의 그래프 — hook: y=2x+1, x=1 → 3, x=2 → 5, 두 점 (1,3)·(2,5)를 자로 이으면 끝. 점을 더 찍어도 전부 그 직선 위 */
  'M-74': { seed:174, caps:{ P:8, list:[
    [0.0, "$y=2x+1$에서 $x=1$이면 $y=3$, $x=2$이면 $y=5$입니다.", "In $y=2x+1$, $x=1$ gives $y=3$ and $x=2$ gives $y=5$.", "在$y=2x+1$中，$x=1$时$y=3$，$x=2$时$y=5$。"],
    [0.36, "두 점 $(1,\\,3)$, $(2,\\,5)$를 자로 이으면 그래프가 됩니다.", "Join $(1,\\,3)$ and $(2,\\,5)$ with a ruler: that is the graph.", "用尺子连接$(1,\\,3)$和$(2,\\,5)$，就是图像。"],
    [0.56, "점을 더 찍어 봐도 $(3,\\,7)$처럼 모두 그 직선 위에 있습니다.", "Plot more points, like $(3,\\,7)$: they all lie on that line.", "再多描几个点，比如$(3,\\,7)$，也都在这条直线上。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.45, 0.1, 0.3], 6.4, 64);
    k.table();
    const B = board(k, { x0:-3, x1:4, y0:-2, y1:8, u:0.4, cx:-0.1, cz:0.05, fs:0.19, xs:[-2, -1, 1, 2, 3], ys:[-1, 1, 2, 3, 4, 5, 6, 7] });
    const f = x => 2 * x + 1;
    const A = B.P(-1.5, f(-1.5)), Z = B.P(3.5, f(3.5));
    wire(k, A, Z, k.metal('#3f6fa0', 0.3));
    /* 자 — 직선 옆에 나란히 */
    const dir = new THREE.Vector3().subVectors(Z, A), len = dir.length(); dir.normalize();
    const nrm = new THREE.Vector3(-dir.z, 0, dir.x);   /* 판 위에서 직선에 수직 */
    /* 자는 직선 윗부분 옆에만(눈금 숫자를 가리지 않게) */
    const RA = B.P(0.7, f(0.7)), rl = RA.distanceTo(Z);
    const ruler = new THREE.Mesh(k.rbox(rl + 0.2, 0.035, 0.22, 0.02), k.woodMat('#e3c48d', [150, 110, 60]));
    const rc = RA.clone().add(Z).multiplyScalar(0.5).add(nrm.clone().multiplyScalar(0.2)); ruler.position.set(rc.x, 0.085, rc.z);
    ruler.rotation.y = -Math.atan2(dir.z, dir.x); ruler.castShadow = ruler.receiveShadow = true; scene.add(ruler);
    /* 두 점(붉은 압정)과 확인하는 세 번째 점(초록 압정) */
    const p1 = pin(k, B.P(1, 3), '#b3221a'), p2 = pin(k, B.P(2, 5), '#b3221a'), p3 = pin(k, B.P(3, 7), '#2f7a4a');
    fitCard(k, 'y = 2x + 1', 2.55, 1.0, { w:1.5, d:0.5, rot:-0.04 });
    const bd = bead(k, '#fff3d6', 0.075);
    /* 움직임: (1,3) · (2,5) 압정을 차례로 꽂고 → 구슬이 직선을 따라 올라가 (3,7) 을 지나고(초록 압정이 톡) → 제자리로 */
    const line = new THREE.LineCurve3(A, Z), uS = 0.08, uE = 0.9;
    const pinY = [p1, p2, p3].map(g => g.position.y);
    const place = () => bd.position.copy(line.getPoint(uS)).setY(A.y + 0.08);
    place();
    k.onFrame(t => { const p = cyc(t, 8);
      p1.position.y = pinY[0] + 0.35 * hop(p, 0.06, 0.2); p2.position.y = pinY[1] + 0.35 * hop(p, 0.2, 0.34); p3.position.y = pinY[2] + 0.25 * hop(p, 0.62, 0.74);
      const u = uS + (uE - uS) * (seg(p, 0.4, 0.72) - seg(p, 0.8, 0.96));
      bd.position.copy(line.getPoint(u)); bd.position.y += 0.08; });
    k.lights({ envOpts:{ intensity:0.7 } });
  }},

  /* 기울기 — hook: 도로의 "경사 8%" 표지판 = 100m 가는 동안 8m 오른다, 8÷100=0.08 */
  'M-65': { seed:165, caps:{ P:8, list:[
    [0.0, "경사 $8\\%$ 표지판은 $100$m를 가는 동안 $8$m 올라간다는 뜻입니다.", "An $8\\%$ slope sign means the road rises $8$ m over $100$ m.", "坡度$8\\%$的标志是说每走$100$m升高$8$m。"],
    [0.3, "가로로 간 만큼, 오르는 높이도 일정하게 늘어납니다.", "The farther along, the higher, at a steady rate.", "横着走多远，升高的高度也按同样的比例增加。"],
    [0.82, "$8\\div 100=0.08$ — 이것이 이 도로의 기울기입니다.", "$8\\div 100=0.08$: that is the slope of this road.", "$8\\div 100=0.08$——这就是这条路的斜率。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.15, 0.3, 0.5], 6.3, 28);
    k.table();
    const L = 5.2, R = L * 0.08, X0 = -2.5, DZ = 1.1, Z0 = -0.2;   /* 가로 100 → L, 세로 8 → R */
    /* 흙 쐐기 + 아스팔트 길 */
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(L, 0); sh.lineTo(L, R); sh.lineTo(0, 0);
    const wedge = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth:DZ, bevelEnabled:false }), k.woodMat('#a97a4a', [90, 60, 30]));
    wedge.position.set(X0, 0, Z0 - DZ / 2); wedge.castShadow = wedge.receiveShadow = true; scene.add(wedge);
    const ang = Math.atan2(R, L), hyp = Math.hypot(L, R);
    const roadTex = k.canvasTex(2048, 256, (g, w, h) => { g.fillStyle = '#3a3a3c'; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 6000; i++){ g.fillStyle = `rgba(${150 + k.rnd() * 80},${150 + k.rnd() * 80},${150 + k.rnd() * 80},${k.rnd() * 0.18})`; g.fillRect(k.rnd() * w, k.rnd() * h, 2, 2); }
      g.fillStyle = '#e8d27a'; for(let x = 20; x < w; x += 150) g.fillRect(x, h / 2 - 6, 90, 12);
      g.fillStyle = '#e9e6dc'; g.fillRect(0, 10, w, 8); g.fillRect(0, h - 18, w, 8); });
    const road = new THREE.Mesh(new THREE.BoxGeometry(hyp, 0.035, DZ * 0.9), [0, 0, 1, 0, 0, 0].map(i => i ? new THREE.MeshStandardMaterial({ map:roadTex, roughness:0.85 }) : new THREE.MeshStandardMaterial({ color:'#2e2e30', roughness:0.9 })));
    road.position.set(X0 + L / 2, R / 2 + 0.018, Z0); road.rotation.z = ang; road.castShadow = road.receiveShadow = true; scene.add(road);
    /* 치수: 밑변 100(황동 막대), 높이 8(구리 막대) */
    const brass = k.metal('#c9a14f', 0.3), cu = k.metal('#c46a3a', 0.3);
    const FZ = Z0 + DZ / 2 + 0.18;
    const rodX = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, L, 12), brass); rodX.rotation.z = Math.PI / 2; rodX.position.set(X0 + L / 2, 0.03, FZ); rodX.castShadow = true; scene.add(rodX);
    [X0, X0 + L].forEach(x => { const e = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 10), brass); e.position.set(x, 0.08, FZ); scene.add(e); });
    fitCard(k, '100', X0 + L / 2, FZ + 0.42, { w:0.8, d:0.46 });
    fitCard(k, '8', X0 + L + 0.55, Z0 + DZ / 2 - 0.05, { w:0.46, d:0.46 });
    fitCard(k, '8 ÷ 100 = 0.08', 0.2, FZ + 1.15, { w:2.4, d:0.5, rot:0.02 });
    /* 표지판: 붉은 테 삼각형에 8% */
    const signTex = k.canvasTex(512, 460, (g, w, h) => { g.clearRect(0, 0, w, h);
      const tri = (m, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(w / 2, m * 0.9); g.lineTo(w - m, h - m * 0.55); g.lineTo(m, h - m * 0.55); g.closePath(); g.fill(); };
      tri(8, '#c62a1f'); tri(64, '#f6f1e3'); g.fillStyle = '#1d1a17'; g.textBaseline = 'middle'; k.mathText(g, '8%', w / 2, h * 0.66, 118); });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.81), new THREE.MeshStandardMaterial({ map:signTex, transparent:true, alphaTest:0.5, roughness:0.5, side:THREE.DoubleSide }));
    sign.position.set(X0 - 0.1, 1.2, Z0 - 0.75); sign.rotation.y = 0.12; sign.castShadow = true; scene.add(sign);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 12), k.metal('#9a978f', 0.35)); post.position.set(X0 - 0.1, 0.42, Z0 - 0.78); post.castShadow = true; scene.add(post);
    /* 움직임: 재는 막대가 길을 따라 — 간 거리(황동 띠)만큼 오른 높이(구리 막대)가 일정하게 자란다 */
    const tape = new THREE.Mesh(new THREE.BoxGeometry(1, 0.012, 0.09), new THREE.MeshStandardMaterial({ color:'#e9c64a', roughness:0.5 }));
    tape.position.z = Z0 + DZ / 2 + 0.05; tape.castShadow = true; scene.add(tape);
    const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 12), cu); probe.position.z = Z0 + DZ / 2 + 0.05; probe.castShadow = true; scene.add(probe);
    const knob = bead(k, '#f2e2b8', 0.05); knob.position.z = probe.position.z;
    const setS = s => { s = Math.max(0.004, s); const x = s * L, h = s * R;
      tape.scale.x = x; tape.position.set(X0 + x / 2, 0.012, tape.position.z);
      probe.scale.y = Math.max(0.001, h); probe.position.set(X0 + x, h / 2, probe.position.z); knob.position.set(X0 + x, h + 0.02, knob.position.z);
      probe.visible = knob.visible = s > 0.01; };
    setS(1);
    k.onFrame(t => { const p = cyc(t, 8); const s = 1 - seg(p, 0.06, 0.26) + seg(p, 0.32, 0.8); setS(s); });
    k.lights({ key:3.1, keyPos:[-5, 7, 5], spotPos:[0, 7, 3], spotAt:[0, 0.3, 0.3], envOpts:{ intensity:0.6 } });
  }},

  /* 일차함수와 일차방정식 — stage ②: y=2x−3, y=−x+3 → 2x−3=−x+3, x=2, y=1, 교점 (2,1) */
  'M-75': { seed:175, caps:{ P:8, list:[
    [0.0, "두 식 $y=2x-3$, $y=-x+3$은 각각 직선 하나입니다.", "The equations $y=2x-3$ and $y=-x+3$ are each a line.", "$y=2x-3$和$y=-x+3$各是一条直线。"],
    [0.4, "$2x-3=-x+3$을 풀면 $x=2$, $y=1$입니다.", "Solving $2x-3=-x+3$ gives $x=2$, $y=1$.", "解$2x-3=-x+3$得$x=2$，$y=1$。"],
    [0.74, "두 직선은 $(2,\\,1)$에서 만납니다 — 교점이 곧 연립방정식의 해입니다.", "The lines meet at $(2,\\,1)$: the crossing point is the solution.", "两条直线交于$(2,\\,1)$——交点就是方程组的解。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.1, 0.1, 0.15], 6.1, 56);
    k.table();
    const B = board(k, { x0:-3, x1:5, y0:-4, y1:5, u:0.44, cx:0, cz:0, fs:0.19, xs:[-2, -1, 1, 2, 3, 4], ys:[-3, -2, -1, 1, 2, 3, 4] });
    const f = x => 2 * x - 3, g = x => -x + 3;
    const brass = k.metal('#3f6fa0', 0.3), cu = k.metal('#c46a3a', 0.28);
    const A1 = B.P(-0.4, f(-0.4)), Z1 = B.P(3.9, f(3.9)), A2 = B.P(-1.9, g(-1.9)), Z2 = B.P(4.9, g(4.9));
    wire(k, A1, Z1, brass); wire(k, A2, Z2, cu);
    fitCard(k, 'y = 2x − 3', 2.72, -1.25, { w:1.45, d:0.46, edge:'#b9c9da' });
    fitCard(k, 'y = −x + 3', -2.75, -1.25, { w:1.45, d:0.46, edge:'#e2b597' });
    /* 교점 표시 고리 + 두 구슬 */
    const X = B.P(2, 1);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 12, 40), k.metal('#d4b05a', 0.25)); ring.rotation.x = -Math.PI / 2; ring.position.set(X.x, 0.1, X.z); ring.castShadow = true; scene.add(ring);
    const b1 = bead(k, '#e9f1fa', 0.08), b2 = bead(k, '#ffe7c8', 0.08);
    const l1 = new THREE.LineCurve3(A1, Z1), l2 = new THREE.LineCurve3(A2, Z2);
    const u1X = (2 - -0.4) / (3.9 - -0.4), u2X = (2 - -1.9) / (4.9 - -1.9);   /* 교점의 곡선 위치 */
    const u1F = 0.06, u2F = 0.06;   /* 구슬이 멀어졌을 때 자리(각 직선의 왼쪽 끝 가까이) */
    /* 움직임: 교점에서 두 구슬이 각자 직선을 따라 멀어졌다가, 다시 다가와 (2,1)에서 만난다 — 고리가 톡 */
    const put = (m, l, u, dx) => { m.position.copy(l.getPoint(u)); m.position.y += 0.07; m.position.x += dx; };
    put(b1, l1, u1X, -0.06); put(b2, l2, u2X, 0.06);
    k.onFrame(t => { const p = cyc(t, 8); const away = seg(p, 0.06, 0.34) * (1 - seg(p, 0.44, 0.74)), close = 1 - seg(p, 0.66, 0.74);
      put(b1, l1, u1X + (u1F - u1X) * away, -0.06 * close); put(b2, l2, u2X + (u2F - u2X) * away, 0.06 * close);
      ring.position.y = 0.1 + 0.22 * hop(p, 0.76, 0.9); });
    k.lights({ envOpts:{ intensity:0.7 } });
  }},

  /* 일차함수의 활용 — hook: 물통에 물 5L, 1분에 3L씩 → 10분 뒤 35L. y=3x+5 (5=y절편, 3=기울기) */
  'M-76': { seed:176, caps:{ P:9, list:[
    [0.0, "물통에 처음 $5$L가 들어 있습니다. 이것이 $y$절편입니다.", "The tank starts with $5$ L: that is the $y$-intercept.", "水桶里一开始有$5$L，这就是$y$轴截距。"],
    [0.24, "1분에 $3$L씩 들어갑니다. 이것이 기울기입니다: $y=3x+5$", "$3$ L flows in each minute: that is the slope. $y=3x+5$", "每分钟流入$3$L，这就是斜率：$y=3x+5$"],
    [0.8, "$10$분 뒤에는 $y=3\\times 10+5=35$입니다.", "After $10$ minutes, $y=3\\times 10+5=35$.", "$10$分钟后，$y=3\\times 10+5=35$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.2, 0.7, 0.3], 7.4, 32);
    k.table();
    /* 그래프판: x 0~10 분, y 0~35 L */
    const B = board(k, { x0:-1.2, x1:11, y0:-4.5, y1:39, ux:0.29, uy:0.082, gy:5, cx:1.35, cz:0.25, fs:0.17, xs:[2, 4, 6, 8, 10], ys:[5, 10, 15, 20, 25, 30, 35] });
    const A = B.P(0, 5), Z = B.P(10, 35);
    wire(k, A, Z, k.metal('#3f6fa0', 0.3));
    pin(k, A, '#b3221a');
    fitCard(k, 'y = 3x + 5', -1.75, 1.85, { w:1.5, d:0.48 });
    const bd = bead(k, '#fff3d6', 0.075);
    /* 물통: 유리 원통 + 물 + 눈금자(0~35) + 수도꼭지 */
    const TX = -2.1, TZ = -0.1, TR = 0.52, TH = 2.1, LPU = 0.052;   /* 1L 당 높이 */
    const glassM = new THREE.MeshPhysicalMaterial({ color:'#eef6f8', roughness:0.05, metalness:0, clearcoat:1, transparent:true, opacity:0.22, side:THREE.DoubleSide, depthWrite:false });
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(TR, TR, TH, 64, 1, true), glassM); tank.position.set(TX, TH / 2 + 0.06, TZ); scene.add(tank);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(TR + 0.04, TR + 0.06, 0.06, 64), k.woodMat('#5a3a20', [40, 20, 10])); base.position.set(TX, 0.03, TZ); base.castShadow = base.receiveShadow = true; scene.add(base);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(TR, 0.015, 8, 64), glassM); rim.rotation.x = Math.PI / 2; rim.position.set(TX, TH + 0.06, TZ); scene.add(rim);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(TR - 0.02, TR - 0.02, 1, 64), new THREE.MeshPhysicalMaterial({ color:'#3f8fc4', roughness:0.08, clearcoat:1, transparent:true, opacity:0.72 }));
    water.position.set(TX, 0, TZ); scene.add(water);
    const setLevel = v => { const h = v * LPU; water.scale.y = h; water.position.y = 0.06 + h / 2; };
    /* 눈금자 — 물통 앞에 세운 판(물 높이와 같은 자리에 눈금) */
    const GH = TH, gTex = k.canvasTex(256, Math.round(256 * GH / 0.36), (g, w, h) => { g.fillStyle = '#f1ead8'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#2b2118'; g.textBaseline = 'middle'; const Yv = v => h - v * LPU / GH * h;
      for(let v = 0; v <= 40; v++){ const big = v % 5 === 0; g.fillRect(0, Yv(v) - (big ? 3 : 1.5), big ? w * 0.34 : w * 0.18, big ? 6 : 3); }
      for(let v = 5; v <= 35; v += 5) k.mathText(g, String(v), w * 0.68, Yv(v), 70); });
    const gauge = new THREE.Mesh(new THREE.BoxGeometry(0.36, GH, 0.03), [0, 0, 0, 0, 1, 0].map(i => i ? new THREE.MeshStandardMaterial({ map:gTex, roughness:0.7 }) : new THREE.MeshStandardMaterial({ color:'#d9cfb8', roughness:0.8 })));
    gauge.position.set(TX + TR + 0.26, GH / 2 + 0.06, TZ + 0.2); gauge.castShadow = gauge.receiveShadow = true; scene.add(gauge);
    const steel = k.metal('#bfc2c4', 0.22);
    const pipeV = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, TH + 0.62, 16), steel); pipeV.position.set(TX - 0.75, (TH + 0.62) / 2, TZ - 0.1); scene.add(pipeV);
    const pipeH = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.62, 16), steel); pipeH.rotation.z = Math.PI / 2; pipeH.position.set(TX - 0.45, TH + 0.62, TZ - 0.1); scene.add(pipeH);
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.14, 16), steel); spout.position.set(TX - 0.16, TH + 0.55, TZ - 0.1); scene.add(spout);
    [pipeV, pipeH, spout].forEach(m => { m.castShadow = true; });
    const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1, 12), new THREE.MeshPhysicalMaterial({ color:'#8cc0de', roughness:0.1, transparent:true, opacity:0.7 }));
    stream.position.x = TX - 0.16; stream.position.z = TZ - 0.1; scene.add(stream);
    const line = new THREE.LineCurve3(A, Z);
    const setT = (m, pour) => { setLevel(5 + 3 * m); bd.position.copy(line.getPoint(m / 10)); bd.position.y += 0.07;
      const top = TH + 0.48, bot = 0.06 + (5 + 3 * m) * LPU; stream.visible = pour; stream.scale.y = top - bot; stream.position.y = (top + bot) / 2; };
    setT(10, false);
    /* 움직임: 처음 5L 로 되돌렸다가 → 1분에 3L 씩 10분 동안 채운다(구슬도 그래프 위를 (0,5) → (10,35)) */
    k.onFrame(t => { const p = cyc(t, 9);
      if(p < 0.2){ setT(10 * (1 - seg(p, 0.03, 0.15)), false); }
      else { const s = cl((p - 0.24) / (0.8 - 0.24)); setT(10 * s, p > 0.24 && p < 0.8); } });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[-0.5, 7, 3], spotAt:[0, 0.5, 0], envOpts:{ intensity:0.8 } });
  }},

  /* 경우의 수 — hook: 상의 3가지와 하의 2가지를 하나씩 고르면 3×2 */
  'M-88': { seed:188, caps:{ P:9, list:[
    [0.0, "상의 $3$가지와 하의 $2$가지에서 하나씩 고릅니다.", "Choose one of $3$ tops and one of $2$ bottoms.", "从$3$件上衣和$2$条下装中各选一件。"],
    [0.08, "상의 하나마다 하의 $2$가지가 모두 붙습니다.", "Each top goes with both bottoms.", "每件上衣都能配上$2$条下装。"],
    [0.84, "그래서 $3\\times 2=6$가지입니다.", "So there are $3\\times 2=6$ outfits.", "所以共有$3\\times 2=6$种。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.6, 0.05, 0.2], 6.4, 60);
    k.table();
    const fabric = c => new THREE.MeshPhysicalMaterial({ color:c, roughness:0.92, sheen:1, sheenRoughness:0.6, sheenColor:new THREE.Color('#ffffff').multiplyScalar(0.25) });
    const flat = (shape, mat, s) => { const geo = new THREE.ExtrudeGeometry(shape, { depth:0.035, bevelEnabled:true, bevelThickness:0.012, bevelSize:0.012, bevelSegments:2, curveSegments:10 });
      geo.rotateX(-Math.PI / 2); const m = new THREE.Mesh(geo, mat); m.scale.setScalar(s); m.castShadow = m.receiveShadow = true; return m; };
    /* 반팔 상의 모양(위가 -z) */
    const shirt = new THREE.Shape();
    shirt.moveTo(-0.1, 0.36); shirt.quadraticCurveTo(0, 0.28, 0.1, 0.36); shirt.lineTo(0.24, 0.32); shirt.lineTo(0.42, 0.16); shirt.lineTo(0.34, 0.04);
    shirt.lineTo(0.23, 0.12); shirt.lineTo(0.24, -0.34); shirt.lineTo(-0.24, -0.34); shirt.lineTo(-0.23, 0.12); shirt.lineTo(-0.34, 0.04); shirt.lineTo(-0.42, 0.16); shirt.lineTo(-0.24, 0.32); shirt.lineTo(-0.1, 0.36);
    /* 바지 모양 */
    const pants = new THREE.Shape();
    pants.moveTo(-0.22, 0.36); pants.lineTo(0.22, 0.36); pants.lineTo(0.27, -0.4); pants.lineTo(0.05, -0.4); pants.lineTo(0, 0.08); pants.lineTo(-0.05, -0.4); pants.lineTo(-0.27, -0.4); pants.lineTo(-0.22, 0.36);
    const topsC = ['#b8352a', '#e0b23f', '#3c7a58'], botC = ['#2f4a73', '#8a6d4c'];
    const tops = topsC.map(fabric), bots = botC.map(fabric);
    const cx = [0.35, 1.5, 2.65], rz = [0.2, 1.45], hx = -1.2, hz = -1.2;
    /* 판: 표처럼 칸을 나눈 종이 */
    k.paper(5.3, 3.9, 0.55, 0.15, 0, (g, w, h) => {
      const X = x => (x - 0.55 + 5.3 / 2) / 5.3 * w, Z = z => (z - 0.15 + 3.9 / 2) / 3.9 * h;
      g.strokeStyle = 'rgba(40,28,18,.55)'; g.lineWidth = 5;
      g.beginPath(); g.moveTo(X(-0.55), Z(-1.9)); g.lineTo(X(-0.55), Z(2.05)); g.moveTo(X(-1.95), Z(-0.52)); g.lineTo(X(3.2), Z(-0.52)); g.stroke();
      g.lineWidth = 2; g.strokeStyle = 'rgba(40,28,18,.25)';
      g.beginPath(); [0.93, 2.08].forEach(x => { g.moveTo(X(x), Z(-1.9)); g.lineTo(X(x), Z(2.05)); }); g.moveTo(X(-1.95), Z(0.83)); g.lineTo(X(3.2), Z(0.83)); g.stroke(); });
    const hdrTop = cx.map((x, i) => { const m = flat(shirt, tops[i], 1.25); m.position.set(x, 0.03, hz); scene.add(m); return m; });
    const hdrBot = rz.map((z, j) => { const m = flat(pants, bots[j], 1.2); m.position.set(hx, 0.03, z); scene.add(m); return m; });
    const cells = [];
    cx.forEach((x, i) => rz.forEach((z, j) => { const g = new THREE.Group();
      const a = flat(shirt, tops[i], 0.85); a.position.set(0, 0.035, -0.28); const b = flat(pants, bots[j], 0.8); b.position.set(0, 0.03, 0.3);
      g.add(a, b); g.position.set(x, 0.03, z); scene.add(g); cells.push({ g, i, j }); }));
    const sum = fitCard(k, '3 × 2 = 6', -1.25, -1.2, { w:1.3, d:0.8, hmax:0.75, fill:0.9, rot:0.03 });
    /* 움직임: 상의 하나마다 하의 둘 — 여섯 벌이 차례로 톡, 그때마다 그 벌의 상의·하의도 함께 → 마지막에 3 × 2 = 6 */
    const y0 = { t:hdrTop.map(m => m.position.y), b:hdrBot.map(m => m.position.y), c:cells.map(c => c.g.position.y), s:sum.position.y };
    k.onFrame(t => { const p = cyc(t, 9); const ht = [0, 0, 0], hb = [0, 0];
      cells.forEach((c, n) => { const a = 0.1 + n * 0.12, u = hop(p, a, a + 0.11); c.g.position.y = y0.c[n] + 0.3 * u; ht[c.i] = Math.max(ht[c.i], u); hb[c.j] = Math.max(hb[c.j], u); });
      hdrTop.forEach((m, i) => { m.position.y = y0.t[i] + 0.14 * ht[i]; }); hdrBot.forEach((m, j) => { m.position.y = y0.b[j] + 0.14 * hb[j]; });
      sum.position.y = y0.s + 0.2 * hop(p, 0.84, 0.96); });
    k.lights({ envOpts:{ intensity:0.5 } });
  }},
};
