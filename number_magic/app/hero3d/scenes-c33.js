/* C33 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* 카드 뒤집기 — rz 로 반 바퀴(z 축) 돌리면 뒷면(o.back)이 위로 온다. 뒤집힌 카드는 두께 H 만큼 올려 책상 위에 눕힌다 */
const flipPose = (g, u, H, lift, y0) => { g.rotation.z = -Math.PI * u; g.position.y = (y0 || 0) + H * u + (lift || 0.55) * Math.sin(Math.PI * u); };

/* 나무 말(폰) — 수직선 위 자리 표시 */
const pawn = (k, color, x, z) => {
  const { THREE, scene } = k;
  const prof = [[0, 0], [0.15, 0], [0.16, 0.03], [0.14, 0.06], [0.08, 0.12], [0.06, 0.26], [0.1, 0.29], [0.06, 0.32], [0.0, 0.32]].map(p => new THREE.Vector2(p[0], p[1]));
  const m = k.lacquer(color);
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), m); g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 20), m); head.position.y = 0.4; g.add(head);
  g.children.forEach(o => { o.castShadow = o.receiveShadow = true; });
  g.position.set(x, 0.045, z); scene.add(g); return g;
};

/* 천 원 지폐 — 숫자만(1000) */
const bill = (k, x, z, rot, y) => {
  const { THREE, scene } = k;
  const tex = k.canvasTex(880, 440, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#b9cbd6'); gr.addColorStop(0.5, '#d3dfe3'); gr.addColorStop(1, '#a9bfcc');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(40,70,95,.55)'; g.lineWidth = 6; g.strokeRect(18, 18, w - 36, h - 36);
    g.strokeStyle = 'rgba(40,70,95,.18)'; g.lineWidth = 2; for(let i = 0; i < 26; i++){ g.beginPath(); g.ellipse(w * 0.64, h * 0.5, 40 + i * 6, 30 + i * 5, 0, 0, Math.PI * 2); g.stroke(); }
    g.fillStyle = 'rgba(245,248,248,.75)'; g.beginPath(); g.ellipse(w * 0.2, h * 0.52, 80, 110, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#1f3d57'; g.textBaseline = 'middle';
    k.mathText(g, '1000', w - 60, h * 0.24, 92, { align:'right' }); k.mathText(g, '1000', w * 0.2, h * 0.52, 64);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), new THREE.MeshStandardMaterial({ map:tex, roughness:0.85, side:THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; m.rotation.z = rot || 0; m.position.set(x, y || 0.01, z); m.castShadow = m.receiveShadow = true; scene.add(m); return m;
};

export const SCENES_C33 = {

  /* 등식의 변형 — hook: 평형인 양팔저울에서 한쪽 추를 덜면 반대쪽도 똑같이. stage ①: x + 7 = 12 ⇒ x = 12 − 7(이항) */
  'M-14': { seed:201, caps:{ P:8, list:[
    [0.0, "$x+7=12$: 상자 $x$와 추 7개가 추 12개와 평형입니다.", "$x+7=12$: box $x$ and 7 weights balance 12 weights.", "$x+7=12$：$x$箱和7个砝码与12个砝码平衡。"],
    [0.1, "양쪽에서 추를 7개씩 똑같이 덜어 냅니다.", "Take 7 weights off both pans.", "两边各拿走7个砝码。"],
    [0.4, "$x=12-7$: 좌변의 $+7$이 등호를 건너가 $-7$이 됩니다(이항).", "$x=12-7$: the $+7$ crosses the equals sign and becomes $-7$ (transposition).", "$x=12-7$：左边的$+7$跨过等号变成$-7$（移项）。"],
    [0.64, "그래도 평형입니다. 그래서 $x=5$", "Still balanced, so $x=5$.", "仍然平衡，所以$x=5$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.95, 0.35], 6.0, 24);
    k.table({ base:'#5e3b22' });
    const brass = k.metal('#b8914a', 0.3), dark = k.metal('#3b3024', 0.5);
    const bal = new THREE.Group(); bal.position.z = -0.55; scene.add(bal);
    const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; bal.add(m); return m; };
    add(new THREE.CylinderGeometry(0.7, 0.85, 0.18, 48), k.woodMat('#4a2c17', [30, 15, 6]), 0, 0.09, 0);
    add(new THREE.CylinderGeometry(0.07, 0.09, 2.2, 24), brass, 0, 1.25, 0);
    add(new THREE.SphereGeometry(0.12, 24, 16), brass, 0, 2.38, 0);
    add(new THREE.BoxGeometry(4.0, 0.07, 0.1), brass, 0, 2.3, 0);
    const PX = 1.75, PY = 0.9;
    [-PX, PX].forEach(x => {
      add(new THREE.CylinderGeometry(0.92, 0.78, 0.07, 48), brass, x, PY, 0);
      for(let i = 0; i < 3; i++){ const a = [Math.PI / 2, -Math.PI / 6, -Math.PI * 5 / 6][i]; const px = x + Math.cos(a) * 0.7, pz = Math.sin(a) * 0.7;
        const top = new THREE.Vector3(x, 2.28, -0.55), len = top.distanceTo(new THREE.Vector3(px, PY + 0.04, pz - 0.55));
        const m = add(new THREE.CylinderGeometry(0.008, 0.008, len, 6), dark, (px + x) / 2, (PY + 2.28) / 2, pz / 2);
        m.lookAt(top); m.rotateX(Math.PI / 2); }
    });
    const py = PY + 0.035;
    const wt = (x, z) => { const g = new THREE.Group();
      const a = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 32), brass); a.position.y = 0.1;
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.06, 16), brass); b.position.y = 0.23;
      [a, b].forEach(m => { m.castShadow = m.receiveShadow = true; g.add(m); }); g.position.set(x, py, z); bal.add(g); return g; };
    /* 왼쪽: 상자 x + 추 7, 오른쪽: 추 12 */
    const L = [[-1.62, -0.42], [-1.35, -0.42], [-1.62, -0.14], [-1.35, -0.14], [-1.62, 0.14], [-1.35, 0.14], [-1.62, 0.42]].map(([x, z]) => wt(x, z));
    const R = []; [-0.3, 0, 0.3].forEach(z => [-0.42, -0.14, 0.14, 0.42].forEach(dx => R.push(wt(PX + dx, z))));
    const box = new THREE.Mesh(k.rbox(0.5, 0.46, 0.5, 0.04), k.cardboard()); box.position.set(-2.12, py, 0); box.castShadow = box.receiveShadow = true; bal.add(box);
    const lab = k.label('x', 0.32, 0.32, { bg:'#efe3c6', size:330 }); lab.position.set(-2.12, py + 0.24, 0.29 - 0.55); scene.add(lab);
    /* 식 카드: x + 7 = 12 → x = 12 − 7 */
    const Z = 1.55, S = [-1.35, -0.45, 0.45, 1.35], CO = { w:0.8, d:0.66, size:480, h:0.04 };
    k.card(['x'], S[0], Z, CO);
    const plus = k.card(['+7'], S[1], Z, Object.assign({ back:['−7'], backOpts:{ bg:'#f3d9b0' } }, CO));
    const eq = k.card(['='], S[2], Z, CO), twelve = k.card(['12'], S[3], Z, CO);
    /* 움직임: 양쪽 접시에서 추 7개씩 사라지고(평형 유지), +7 카드가 등호를 넘어가며 뒤집혀 −7 이 된다 */
    const lift = [...L, ...R.slice(0, 7)], ly = lift.map(g => g.position.y);
    k.onFrame(t => { const p = cyc(t, 8);
      const u = seg(p, 0.1, 0.3) * (1 - seg(p, 0.82, 0.97));
      lift.forEach((g, i) => { g.position.y = ly[i] + 0.8 * u; g.scale.setScalar(Math.max(0.001, 1 - u)); });
      const v = seg(p, 0.4, 0.6) * (1 - seg(p, 0.82, 0.97));
      flipPose(plus, v, 0.04, 0.6); plus.position.x = S[1] + (S[3] - S[1]) * v;
      eq.position.x = S[2] - 0.9 * v; twelve.position.x = S[3] - 0.9 * v; });
    k.lights({ key:3.2, keyPos:[-4, 7, 5], spotPos:[0, 8, 2], spotAt:[0, 1, 0], spot:34 });
  }},

  /* 일차부등식 — hook: 3 < 5 에 −1 을 곱하면 −3 과 −5, 이번엔 −3 이 더 크다. 원점 반대쪽으로 옮기면 좌우가 뒤바뀐다 */
  'M-64': { seed:211, caps:{ P:8, list:[
    [0.0, "$3<5$: $5$가 더 오른쪽에 있습니다.", "$3<5$: $5$ lies further right.", "$3<5$：$5$在更右边。"],
    [0.14, "양변에 $-1$을 곱하면 두 수가 원점 반대쪽으로 옮겨 갑니다.", "Multiply both sides by $-1$ and both numbers jump across $0$.", "两边乘$-1$，两个数跳到原点的另一侧。"],
    [0.46, "$-3>-5$: 왼쪽·오른쪽이 뒤바뀌어 부등호가 뒤집힙니다.", "$-3>-5$: left and right swap, so the sign flips.", "$-3>-5$：左右对调，不等号反过来。"],
    [0.7, "음수를 곱하거나 음수로 나눌 때만 방향을 뒤집습니다.", "Flip only when you multiply or divide by a negative.", "只有乘或除以负数时才改变方向。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0.1, 0.3], 7.3, 50);
    k.table();
    const PW = 6.8, PD = 3.0, PZ = 0.3, STEP = 0.082;
    const zLine = PZ - PD / 2 + 0.66 * PD, X = n => n * STEP * PW;
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => {
      const y = h * 0.66, sx = n => w * (0.5 + n * STEP);
      g.strokeStyle = 'rgba(28,20,14,.85)'; g.lineWidth = 7; g.beginPath(); g.moveTo(w * 0.05, y); g.lineTo(w * 0.96, y); g.stroke();
      g.beginPath(); g.moveTo(w * 0.96, y); g.lineTo(w * 0.935, y - 18); g.moveTo(w * 0.96, y); g.lineTo(w * 0.935, y + 18); g.stroke();
      for(let n = -5; n <= 5; n++){ g.lineWidth = n === 0 ? 9 : 5; g.beginPath(); g.moveTo(sx(n), y - (n === 0 ? 34 : 22)); g.lineTo(sx(n), y + (n === 0 ? 34 : 22)); g.stroke();
        ink(g, n < 0 ? '−' + (-n) : String(n), sx(n), y + 84, 62); }
    });
    const red = pawn(k, '#a3231c', X(3), zLine), blue = pawn(k, '#1f4f86', X(5), zLine);
    /* 부등식 카드 3 < 5 — 뒷면 −3 > −5 */
    const CZ = -0.55, CO = { w:0.9, d:0.72, size:480, h:0.04, y:0.035 };
    const c3 = k.card(['3'], -1.05, CZ, Object.assign({ bg:'#f3d6cf', back:['−3'] }, CO));
    const cs = k.card(['<'], 0, CZ, Object.assign({ back:['>'], backOpts:{ bg:'#f3d9b0' } }, CO));
    const c5 = k.card(['5'], 1.05, CZ, Object.assign({ bg:'#d4deec', back:['−5'] }, CO));
    /* 움직임: 두 말이 0 을 건너 −3, −5 로 뛰고(좌우가 뒤바뀐다) 카드 3 < 5 가 뒤집혀 −3 > −5 가 된다 */
    k.onFrame(t => { const p = cyc(t, 8), back = 1 - seg(p, 0.82, 0.97);
      const a = seg(p, 0.14, 0.34) * back, b = seg(p, 0.18, 0.4) * back;
      red.position.x = X(3) * (1 - 2 * a); red.position.y = 0.045 + 0.7 * Math.sin(Math.PI * a);
      blue.position.x = X(5) * (1 - 2 * b); blue.position.y = 0.045 + 1.25 * Math.sin(Math.PI * b);
      const f = seg(p, 0.4, 0.55) * back; [c3, cs, c5].forEach(c => flipPose(c, f, 0.04, 0.5, 0.035)); });
    k.lights({ envOpts:{ intensity:0.45 } });
  }},

  /* 일차부등식의 활용 — hook: 7000원으로 800원짜리 공책, 7000 ÷ 800 = 8.75, 0.75권은 없으니 8권. stage ①: 9권이면 7200원 */
  'M-71': { seed:221, caps:{ P:8, list:[
    [0.0, "$800x\\le 7000$을 풀면 $x\\le 8.75$입니다.", "Solving $800x\\le 7000$ gives $x\\le 8.75$.", "解$800x\\le 7000$得$x\\le 8.75$。"],
    [0.15, "9권이면 $800\\times 9=7200$원 — 7000원을 넘습니다.", "Nine notebooks cost $800\\times 9=7200$ won: over 7000.", "买9本要$800\\times 9=7200$元——超过了7000。"],
    [0.55, "공책 $0.75$권은 없으니 답은 8권입니다.", "There is no $0.75$ of a notebook, so the answer is 8.", "没有$0.75$本笔记本，所以答案是8本。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.05, 0.1, 0.25], 7.0, 52);
    k.table();
    const PW = 6.2, PD = 2.1, PZ = 1.0, x0 = 0.07, st = 0.085;
    const X = n => -PW / 2 + PW * (x0 + n * st), zLine = PZ - PD / 2 + 0.6 * PD;
    k.paper(PW, PD, 0, PZ, 0, (g, w, h, ink) => {
      const y = h * 0.6, sx = n => w * (x0 + n * st);
      g.strokeStyle = 'rgba(28,20,14,.85)'; g.lineWidth = 7; g.beginPath(); g.moveTo(w * 0.035, y); g.lineTo(w * 0.975, y); g.stroke();
      g.beginPath(); g.moveTo(w * 0.975, y); g.lineTo(w * 0.95, y - 18); g.moveTo(w * 0.975, y); g.lineTo(w * 0.95, y + 18); g.stroke();
      for(let n = 0; n <= 10; n++){ g.lineWidth = 5; g.beginPath(); g.moveTo(sx(n), y - 22); g.lineTo(sx(n), y + 22); g.stroke(); ink(g, String(n), sx(n), y + 80, 60); }
      /* x ≤ 8.75: 0 부터 8.75 까지 굵은 붉은 띠, 8.75 는 속이 찬 점 */
      g.strokeStyle = 'rgba(150,30,20,.8)'; g.lineWidth = 16; g.beginPath(); g.moveTo(sx(0), y - 52); g.lineTo(sx(8.75), y - 52); g.stroke();
      g.fillStyle = 'rgb(150,30,20)'; g.beginPath(); g.arc(sx(8.75), y - 52, 20, 0, Math.PI * 2); g.fill();
      ink(g, '8.75', sx(8.75), y - 120, 58, { color:'rgb(130,26,18)' });
      ink(g, '800x ≤ 7000', w * 0.3, h * 0.16, 76);
    });
    const pw = pawn(k, '#2f6b45', X(8), zLine);
    /* 공책 — 표지 둘 사이에 속지 */
    const pages = new THREE.MeshStandardMaterial({ color:'#f4efe2', roughness:0.9 });
    const cols = ['#2f5d8a', '#8a2f2f', '#3f7a4f', '#c08a2a'];
    const book = (x, y, z, i, rot) => { const g = new THREE.Group(); const cv = k.plastic(cols[i % 4], 0.55);
      const pg = new THREE.Mesh(k.rbox(0.76, 0.045, 1.0, 0.02), pages); pg.position.y = 0.008; g.add(pg);
      [0, 0.053].forEach(yy => { const c = new THREE.Mesh(k.rbox(0.8, 0.01, 1.04, 0.03), cv); c.position.y = yy; g.add(c); });
      g.children.forEach(o => { o.castShadow = o.receiveShadow = true; }); g.position.set(x, y, z); g.rotation.y = rot || 0; scene.add(g); return g; };
    const BH = 0.064, PX = 1.25, PZb = -0.85;
    for(let i = 0; i < 8; i++) book(PX + (k.rnd() - 0.5) * 0.05, i * BH, PZb, i, (k.rnd() - 0.5) * 0.12);
    const ninth = book(2.45, 0, -0.75, 8, 0.35);
    k.card(['800'], 0.2, -0.6, { w:0.8, d:0.42, size:330, bg:'#f3e2b8', rot:0.08 });
    /* 예산 7000원 = 천 원 지폐 일곱 장 */
    for(let i = 0; i < 7; i++) bill(k, -1.75 + i * 0.12, -0.8 + i * 0.03, 0.15 - i * 0.05, 0.012 + i * 0.004);
    /* 움직임: 말이 9 로 한 칸 나가며 아홉째 공책이 쌓이지만 — 8.75 를 넘어 되돌아온다. 답은 8 */
    const N0 = ninth.position.clone(), N1 = new THREE.Vector3(PX, 8 * BH, PZb), R0 = ninth.rotation.y;
    k.onFrame(t => { const p = cyc(t, 8);
      const a = seg(p, 0.15, 0.3) * (1 - seg(p, 0.55, 0.7));
      pw.position.x = X(8) + (X(9) - X(8)) * a; pw.position.y = 0.045 + 0.5 * (hop(p, 0.15, 0.3) + hop(p, 0.55, 0.7));
      pw.rotation.z = 0.18 * Math.sin((p - 0.33) * 60) * hop(p, 0.33, 0.5);
      ninth.position.lerpVectors(N0, N1, a); ninth.position.y += 0.5 * (hop(p, 0.15, 0.3) + hop(p, 0.55, 0.7)); ninth.rotation.y = R0 * (1 - a); });
    k.lights({ envOpts:{ intensity:0.45 } });
  }},

  /* 연립방정식 풀이 — hook: 사과 2개와 배 1개 1100원, 사과 1개와 배 1개 800원. 두 줄을 빼면 사과 한 개 300원 */
  'M-63': { seed:231, caps:{ P:8, list:[
    [0.0, "사과 2개와 배 1개가 1100원, 사과 1개와 배 1개가 800원입니다.", "Two apples and a pear cost 1100 won; one apple and a pear cost 800 won.", "2个苹果和1个梨1100元，1个苹果和1个梨800元。"],
    [0.12, "두 줄을 나란히 놓고 아래 줄을 뺍니다.", "Line the two rows up and subtract the lower one.", "把两行对齐，减去下面一行。"],
    [0.5, "사과 1개만 남습니다: $1100-800=300$", "Only one apple is left: $1100-800=300$", "只剩下1个苹果：$1100-800=300$"],
    [0.74, "미지수가 둘이어도 식이 둘이면 답은 하나로 정해집니다.", "Two unknowns, two equations: one answer.", "即使有两个未知数，只要有两个方程，答案就确定了。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.2, 0.4], 6.4, 48);
    k.table();
    const PW = 5.8, PD = 3.6, PZc = 0.35, Z1 = -0.65, Z2 = 0.3, Z3 = 1.4, XA1 = -1.95, XA2 = -1.15, XP = -0.35, XC = 1.35;
    const fx = x => (x + PW / 2) / PW, fz = z => (z - (PZc - PD / 2)) / PD;
    k.paper(PW, PD, 0, PZc, 0, (g, w, h, ink) => {
      [Z1, Z2, Z3].forEach(z => ink(g, '=', w * fx(0.45), h * fz(z), 110));
      ink(g, '−', w * fx(-2.6), h * fz(Z2), 130);
      g.strokeStyle = 'rgba(28,20,14,.85)'; g.lineWidth = 8; g.beginPath(); g.moveTo(w * fx(-2.65), h * fz(0.85)); g.lineTo(w * fx(2.2), h * fz(0.85)); g.stroke();
    });
    const appleM = new THREE.MeshPhysicalMaterial({ map:k.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#b3261e'; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 90; i++){ g.strokeStyle = `rgba(${230 + k.rnd() * 25},${150 + k.rnd() * 60},60,${0.08 + k.rnd() * 0.18})`; g.lineWidth = 1 + k.rnd() * 3; const x = k.rnd() * w; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (k.rnd() - 0.5) * 20, h); g.stroke(); } }), roughness:0.35, clearcoat:0.7, clearcoatRoughness:0.3 });
    const pearM = new THREE.MeshPhysicalMaterial({ map:k.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#c9ae4f'; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 700; i++){ g.fillStyle = `rgba(120,85,30,${k.rnd() * 0.35})`; g.fillRect(k.rnd() * w, k.rnd() * h, 2, 2); } }), roughness:0.6, clearcoat:0.2 });
    const stemM = new THREE.MeshStandardMaterial({ color:'#5a3a1c', roughness:0.8 }), leafM = new THREE.MeshStandardMaterial({ color:'#3f7a2e', roughness:0.6, side:THREE.DoubleSide });
    const aprof = []; for(let i = 0; i <= 32; i++){ const ph = Math.PI * i / 32; let y = -Math.cos(ph) * 0.25; const r = Math.sin(ph) * 0.29 * (1 + 0.06 * Math.cos(ph));
      y -= 0.07 * Math.exp(-Math.pow((Math.PI - ph) / 0.4, 2)); y += 0.04 * Math.exp(-Math.pow(ph / 0.4, 2)); aprof.push(new THREE.Vector2(r, y + 0.25)); }
    const appleGeo = new THREE.LatheGeometry(aprof, 48);
    const pearGeo = new THREE.LatheGeometry(new THREE.SplineCurve([[0, 0], [0.15, 0.01], [0.25, 0.08], [0.27, 0.18], [0.23, 0.31], [0.16, 0.42], [0.11, 0.52], [0.075, 0.6], [0.0, 0.64]].map(p => new THREE.Vector2(p[0], p[1]))).getPoints(40), 48);
    const fruit = (pear, x, z) => { const g = new THREE.Group();
      const b = new THREE.Mesh(pear ? pearGeo : appleGeo, pear ? pearM : appleM); g.add(b);
      const top = pear ? 0.63 : 0.43;
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.14, 8), stemM); s.position.y = top + 0.05; s.rotation.z = 0.25; g.add(s);
      if(!pear){ const lf = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), leafM); lf.scale.set(1.8, 0.8, 1); lf.position.set(0.08, top + 0.07, 0); lf.rotation.set(-1.1, 0.2, 0.3); g.add(lf); }
      g.children.forEach(o => { o.castShadow = o.receiveShadow = true; }); g.position.set(x, 0.01, z); g.rotation.y = k.rnd() * 6; scene.add(g); return g; };
    const CO = { w:1.2, d:0.62, size:400, h:0.04, y:0.035 };
    fruit(false, XA1, Z1); const a2 = fruit(false, XA2, Z1), p1 = fruit(true, XP, Z1); k.card(['1100'], XC, Z1, CO);
    const row2 = [fruit(false, XA2, Z2), fruit(true, XP, Z2), k.card(['800'], XC, Z2, CO)];
    const res = [fruit(false, XA1, Z3), k.card(['300'], XC, Z3, Object.assign({ bg:'#dcebd9' }, CO))];
    /* 움직임: 아래 줄(사과 1 · 배 1 · 800)이 윗줄의 같은 것 위로 올라가 짝을 맞춘다 — 사과 1개와 300 만 남는다 */
    const r2y = row2.map(o => o.position.y), m1 = [a2, p1], m1y = m1.map(o => o.position.y), ry = res.map(o => o.position.y);
    k.onFrame(t => { const p = cyc(t, 8);
      const u = seg(p, 0.12, 0.34) * (1 - seg(p, 0.78, 0.96)), h1 = hop(p, 0.36, 0.48);
      row2.forEach((o, i) => { o.position.z = Z2 + (Z1 - Z2) * u; o.position.y = r2y[i] + (i < 2 ? 0.75 : 0.62) * u + 0.2 * h1; });
      m1.forEach((o, i) => { o.position.y = m1y[i] + 0.2 * h1; });
      const h2 = hop(p, 0.5, 0.64); res.forEach((o, i) => { o.position.y = ry[i] + 0.35 * h2; }); });
    k.lights({ envOpts:{ intensity:0.5 } });
  }},

  /* 연립방정식의 활용 — hook: 사탕·초콜릿 모두 10개, 모두 8000원. stage ①: x + y = 10, 500x + 1500y = 8000 ⇒ x = 7, y = 3 */
  'M-72': { seed:241, caps:{ P:9, list:[
    [0.0, "모두 10개, 모두 8000원: $x+y=10$, $500x+1500y=8000$", "10 items, 8000 won in all: $x+y=10$, $500x+1500y=8000$", "一共10个，一共8000元：$x+y=10$，$500x+1500y=8000$"],
    [0.1, "사탕 7개: $500\\times 7=3500$", "7 sweets: $500\\times 7=3500$", "7个糖果：$500\\times 7=3500$"],
    [0.47, "초콜릿 3개: $1500\\times 3=4500$", "3 chocolates: $1500\\times 3=4500$", "3块巧克力：$1500\\times 3=4500$"],
    [0.72, "$7+3=10$, $3500+4500=8000$ — 두 관계가 만나 짝이 하나로 정해집니다.", "$7+3=10$, $3500+4500=8000$: the two relations pin down one pair.", "$7+3=10$，$3500+4500=8000$——两个关系相遇，定下唯一一对。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.2, -0.1], 6.2, 46);
    k.table();
    k.paper(4.4, 1.6, 0.2, -1.35, 0, (g, w, h, ink) => {
      ink(g, 'x + y = 10', w * 0.5, h * 0.3, 104); ink(g, '500x + 1500y = 8000', w * 0.5, h * 0.72, 104); });
    const cols = ['#e2453c', '#f2b134', '#3b8ed0', '#46a35a', '#e86fa6', '#8e5cc9', '#e2453c'];
    const candy = (x, z, c) => { const grp = new THREE.Group(); const m = k.plastic(c, 0.22);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 18), m); b.scale.set(1.25, 0.95, 1); grp.add(b);
      [-1, 1].forEach(sn => { const t = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.16, 16), m); t.rotation.z = sn * Math.PI / 2; t.position.x = sn * 0.24; grp.add(t); });
      grp.children.forEach(o => { o.castShadow = o.receiveShadow = true; }); grp.position.set(x, 0.15, z); grp.rotation.y = 0.5 + (k.rnd() - 0.5) * 0.5; scene.add(grp); return grp; };
    const choc = new THREE.MeshPhysicalMaterial({ color:'#4a2716', roughness:0.45, clearcoat:0.3 }), wrap = k.plastic('#8e1b22', 0.5), foil = k.metal('#d8d4cc', 0.25);
    const bar = (x, z) => { const g = new THREE.Group();
      const base = new THREE.Mesh(k.rbox(0.44, 0.06, 0.98, 0.02), choc); g.add(base);
      for(let i = 0; i < 2; i++) for(let j = 0; j < 2; j++){ const s = new THREE.Mesh(k.rbox(0.19, 0.035, 0.2, 0.03), choc); s.position.set(-0.105 + i * 0.21, 0.06, -0.37 + j * 0.22); g.add(s); }
      const w = new THREE.Mesh(k.rbox(0.47, 0.11, 0.5, 0.03), wrap); w.position.set(0, -0.01, 0.25); g.add(w);
      const f = new THREE.Mesh(k.rbox(0.465, 0.105, 0.04, 0.01), foil); f.position.set(0, -0.008, -0.02); g.add(f);
      g.children.forEach(o => { o.castShadow = o.receiveShadow = true; }); g.position.set(x, 0.01, z); g.rotation.y = (k.rnd() - 0.5) * 0.1; scene.add(g); return g; };
    const candies = [], bars = [];
    for(let i = 0; i < 7; i++) candies.push(candy(-2.55 + i * 0.5 + (k.rnd() - 0.5) * 0.06, -0.05 + (i % 2) * 0.16, cols[i]));
    for(let i = 0; i < 3; i++) bars.push(bar(1.25 + i * 0.6, 0.0));
    k.card(['500'], -1.05, 0.95, { w:0.9, d:0.45, size:330, bg:'#f3e2b8' });
    k.card(['1500'], 1.85, 0.95, { w:1.05, d:0.45, size:330, bg:'#f3e2b8' });
    /* 움직임: 사탕을 하나씩 일곱(500 × 7), 초콜릿을 하나씩 셋(1500 × 3), 그리고 열 개가 함께 — 10개, 8000원 */
    const cy = candies.map(o => o.position.y), by = bars.map(o => o.position.y);
    k.onFrame(t => { const p = cyc(t, 9), all = hop(p, 0.74, 0.88);
      candies.forEach((o, i) => { const a = 0.1 + i * 0.045; o.position.y = cy[i] + 0.35 * hop(p, a, a + 0.08) + 0.3 * all; });
      bars.forEach((o, i) => { const a = 0.47 + i * 0.07; o.position.y = by[i] + 0.35 * hop(p, a, a + 0.1) + 0.3 * all; }); });
    k.lights({ envOpts:{ intensity:0.5 } });
  }},
};
