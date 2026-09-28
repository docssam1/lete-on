/* C28 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

/* 수식 조각 그리기 — 문자열(mathText), {sup:'2'}(윗첨자). 너비를 돌려준다(draw=false 면 재기만) */
function mdraw(k, g, parts, x, cy, fs, draw){
  let cx = x;
  parts.forEach(p => {
    if(typeof p === 'string'){ const w = k.mathText(g, p, cx, cy, fs, { align:'left', draw }); cx += w; return; }
    if(p.sup != null){ const w = k.mathText(g, p.sup, cx - fs * 0.02, cy - fs * 0.32, fs * 0.62, { align:'left', draw }); cx += w + fs * 0.02; }
  });
  return cx - x;
}
/* 'x²' 같은 문자열을 조각으로 — ², ³ 은 진짜 윗첨자로 */
const P = t => { const out = []; t.split(/([²³])/).forEach(s => { if(s === '²') out.push({ sup:'2' }); else if(s === '³') out.push({ sup:'3' }); else if(s) out.push(s); }); return out; };
/* 수식 판 텍스처 — 폭에 맞춰 글자 크기를 줄인다 */
function mtex(k, parts, pw, ph, o){
  o = o || {};
  return k.canvasTex(pw, ph, (g, w, h) => {
    g.fillStyle = o.bg || '#f3e7cf'; g.fillRect(0, 0, w, h);
    g.fillStyle = g.strokeStyle = o.color || '#2b2118'; g.textBaseline = 'middle';
    let fs = h * (o.hmax || 0.5); const tw = mdraw(k, g, parts, 0, 0, fs, false);
    if(tw > w * (o.fill || 0.84)) fs *= w * (o.fill || 0.84) / tw;
    const W = mdraw(k, g, parts, 0, 0, fs, false);
    mdraw(k, g, parts, (w - W) / 2, h / 2 + (o.dy || 0) * h, fs, true);
  });
}
/* 수식 카드 — 윗면이 빛날 수 있다(o.glow) */
function mcard(k, txt, x, z, o){
  o = o || {};
  const { THREE, scene } = k;
  const w = o.w || 1.0, d = o.d || 0.8, h = o.h || 0.04, pw = 1024, ph = Math.round(1024 * d / w);
  const grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, Math.min(0.04, d * 0.1)), new THREE.MeshStandardMaterial({ color:o.edge || '#e9dcc0', roughness:0.85 }));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  const tex = mtex(k, P(txt), pw, ph, o);
  const mat = new THREE.MeshStandardMaterial({ map:tex, roughness:0.8 });
  if(o.glow){ mat.emissive = new THREE.Color('#ffd89a'); mat.emissiveMap = tex; mat.emissiveIntensity = 0; }
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), mat);
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
  grp.position.set(x, o.y == null ? 0.035 : o.y, z); grp.rotation.y = o.rot || 0; scene.add(grp);
  grp.userData.mat = mat; return grp;
}
/* 넓이 타일 — 색 판 + 윗면 수 */
function atile(k, txt, x, z, w, d, color, o){
  o = o || {};
  const { THREE, scene } = k;
  const h = o.h || 0.1, grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, 0.03), k.plastic(color, 0.45)); body.castShadow = body.receiveShadow = true; grp.add(body);
  if(txt){ const sw = o.side ? d : w, sd = o.side ? w : d;   /* o.side: 글자를 긴 변(세로)을 따라 눕혀 쓴다 */
    const tex = mtex(k, P(txt), 512, Math.round(512 * sd / sw), { bg:color, color:o.ink || '#1f1a14', hmax:o.hmax || 0.45, fill:0.72 });
    const mat = new THREE.MeshStandardMaterial({ map:tex, roughness:0.5, emissive:new THREE.Color('#ffe2a8'), emissiveMap:tex, emissiveIntensity:0 });
    const top = new THREE.Mesh(new THREE.PlaneGeometry(sw * 0.9, sd * 0.9), mat);
    top.rotation.x = -Math.PI / 2; top.rotation.z = o.side ? Math.PI / 2 : 0; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top); grp.userData.mat = mat; }
  grp.position.set(x, o.y == null ? 0.03 : o.y, z); scene.add(grp); return grp;
}
/* 한지 위 좌표(월드 x,z) → 캔버스 좌표 */
const onPaper = (PW, PD, PX, PZ, w, h) => [x => (x - PX + PW / 2) / PW * w, z => (z - PZ + PD / 2) / PD * h];

export const SCENES_C28 = {

  /* 100 근처 수의 제곱 — stage ①: 104² = 108 | 16 = 10816. book: (100+a)² = 100×(100+2a)+a²
     넓이 그림: 100×100 정사각형 + 4×100 띠 둘 + 4×4 조각. 아래 띠를 오른쪽으로 옮기면 100×108 직사각형 + 16 */
  'H-07': { seed:2807, caps:{ P:9, list:[
    [0.0, "$104^2$은 한 변이 $100+4$인 정사각형의 넓이예요.", "$104^2$ is the area of a square with side $100+4$.", "$104^2$是边长为$100+4$的正方形的面积。"],
    [0.14, "아래쪽 띠를 오른쪽으로 옮기면 가로 $104+4=108$, 세로 $100$이 돼요.", "Move the bottom strip to the right: now it is $104+4=108$ wide and $100$ tall.", "把下面的长条移到右边：宽变成$104+4=108$，高是$100$。"],
    [0.44, "남은 작은 조각은 $4^2=16$이에요.", "The little piece left over is $4^2=16$.", "剩下的小块是$4^2=16$。"],
    [0.66, "앞자리 $108$과 뒷자리 $16$을 이어붙이면 $104^2=10816$!", "Attach the front $108$ and the back $16$: $104^2=10816$!", "把前面的$108$和后面的$16$拼起来：$104^2=10816$！"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0.1, 0.1, 0.3], 6.3, 70);
    k.table();
    const A = 1.95, G = 0.42, X0 = -2.75, Z0 = -0.95, GAP = 0.02;
    const PW = 3.6, PD = 3.55, PX = -1.6, PZ = 0.2;
    k.paper(PW, PD, PX, PZ, 0.0, (g, w, h, ink) => {
      const [fx, fz] = onPaper(PW, PD, PX, PZ, w, h), fs = h * 0.07;
      ink(g, '100', fx(X0 + A / 2), fz(Z0 - 0.2), fs); ink(g, '4', fx(X0 + A + G / 2), fz(Z0 - 0.2), fs);
      ink(g, '100', fx(X0 - 0.25), fz(Z0 + A / 2), fs); ink(g, '4', fx(X0 - 0.25), fz(Z0 + A + G / 2), fs);
    });
    const BLUE = '#8fb3d9', GREEN = '#a9cf8f', YEL = '#f0cf6a';
    atile(k, '10000', X0 + A / 2, Z0 + A / 2, A - GAP, A - GAP, BLUE, { hmax:0.2 });
    atile(k, '400', X0 + A + G / 2, Z0 + A / 2, G - GAP, A - GAP, GREEN, { hmax:0.55, side:true });
    const strip = atile(k, '400', X0 + A / 2, Z0 + A + G / 2, A - GAP, G - GAP, GREEN, { hmax:0.55 });
    const small = atile(k, '16', X0 + A + G / 2, Z0 + A + G / 2, G - GAP, G - GAP, YEL, { hmax:0.5 });
    /* 식 카드 */
    const RX = 1.75;
    mcard(k, '104²', RX, -0.85, { w:1.5, d:0.72, hmax:0.52 });
    const c108 = mcard(k, '108', RX - 0.52, 0.2, { w:1.0, d:0.66, hmax:0.52, bg:'#dde9d2', edge:'#c9d6b5', glow:true });
    const c16 = mcard(k, '16', RX + 0.52, 0.2, { w:0.9, d:0.66, hmax:0.52, bg:'#f6e8b8', edge:'#e2cf8f', glow:true });
    const res = mcard(k, '= 10816', RX, 1.25, { w:2.2, d:0.72, hmax:0.52, bg:'#f3e2b8', glow:true });
    /* 움직임: 아래 띠가 들려 90° 돌아 오른쪽 띠 옆에 붙는다(100×108) → 16 조각이 들린다 → 108·16 이 붙어 10816 이 빛난다 → 띠가 돌아온다 */
    const S0 = strip.position.clone(), S1 = new THREE.Vector3(X0 + A + G + G / 2, S0.y, Z0 + A / 2), sy = small.position.y;
    const cy = [c108, c16, res].map(c => c.position.y), c108x = c108.position.x, c16x = c16.position.x;
    k.onFrame(t => { const p = cyc(t, 9);
      const u = seg(p, 0.14, 0.36) * (1 - seg(p, 0.86, 0.98)), lift = 0.45 * (hop(p, 0.14, 0.36) + hop(p, 0.86, 0.98));
      strip.position.lerpVectors(S0, S1, u); strip.position.y = S0.y + lift; strip.rotation.y = -Math.PI / 2 * u;
      c108.position.y = cy[0] + 0.25 * hop(p, 0.2, 0.36); c108.userData.mat.emissiveIntensity = 0.7 * hop(p, 0.2, 0.4);
      small.position.y = sy + 0.3 * hop(p, 0.44, 0.58); small.userData.mat.emissiveIntensity = 0.8 * hop(p, 0.44, 0.6);
      c16.position.y = cy[1] + 0.25 * hop(p, 0.46, 0.6); c16.userData.mat.emissiveIntensity = 0.7 * hop(p, 0.44, 0.62);
      const j = seg(p, 0.66, 0.74) * (1 - seg(p, 0.86, 0.96));
      c108.position.x = c108x + 0.05 * j; c16.position.x = c16x - 0.08 * j;
      res.position.y = cy[2] + 0.3 * hop(p, 0.68, 0.9); res.userData.mat.emissiveIntensity = 0.8 * hop(p, 0.68, 0.9); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

  /* 제곱·세제곱 계산법 — hook: 신전 제단의 부피를 두 배로 → 각 변을 두 배로. history: 부피는 2×2×2 = 8배(디로스), 1837년 증명 */
  'H-08': { seed:2808, caps:{ P:9, list:[
    [0.0, "제단의 부피를 두 배로 만들라는 명령에, 사람들은 모든 변을 두 배로 늘렸어요.", "Told to double the altar's volume, people doubled every edge.", "神谕要把祭坛的体积加倍，人们就把每条边都加长一倍。"],
    [0.1, "그런데 원래 제단만 한 돌이 하나, 둘, … 모두 $8$개 들어가요.", "But the original-size stone fits in one, two, … $8$ times.", "可是原来那么大的石块，一块、两块……一共能放进$8$块。"],
    [0.56, "변이 $2$배면 부피는 $2\\times 2\\times 2=8$배예요.", "Double the edge and the volume is $2\\times 2\\times 2=8$ times.", "边长翻倍，体积就是$2\\times 2\\times 2=8$倍。"],
    [0.78, "딱 두 배가 되는 변은 자와 컴퍼스로는 그릴 수 없다는 게 $1837$년에 증명됐어요.", "An edge that exactly doubles the volume can't be drawn with straightedge and compass, proved in $1837$.", "能让体积正好加倍的边用直尺和圆规画不出来，这在$1837$年被证明。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.1, 0.5, 0.2], 5.7, 30);
    k.table({ base:'#5e3b22' });
    /* 돌 재질 — 연한 대리석 결 */
    const stoneTex = () => k.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#d9d2c3'; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 2500; i++){ g.fillStyle = `rgba(${110 + k.rnd() * 60},${100 + k.rnd() * 50},${80 + k.rnd() * 40},${k.rnd() * 0.18})`; g.fillRect(k.rnd() * w, k.rnd() * h, 1 + k.rnd() * 3, 1 + k.rnd() * 3); }
      for(let i = 0; i < 6; i++){ g.strokeStyle = `rgba(120,110,95,${0.15 + k.rnd() * 0.2})`; g.lineWidth = 1 + k.rnd() * 2; g.beginPath(); let x = k.rnd() * w, y = 0; g.moveTo(x, y); while(y < h){ x += (k.rnd() - 0.5) * 30; y += 20; g.lineTo(x, y); } g.stroke(); } });
    const stoneMat = () => new THREE.MeshStandardMaterial({ map:stoneTex(), roughness:0.75, emissive:new THREE.Color('#ffcf86'), emissiveIntensity:0 });
    const S = 0.78;
    const block = (x, y, z) => { const m = new THREE.Mesh(k.rbox(S - 0.012, S - 0.012, S - 0.012, 0.04), stoneMat()); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; scene.add(m); return m; };
    /* 원래 제단(변 1)과 두 배로 늘린 제단(변 2 = 돌 8개) */
    const one = block(-1.95, 0, -0.35);
    const BX = 0.7, BZ = -0.55, cubes = [];
    for(let y = 0; y < 2; y++) for(let z = 0; z < 2; z++) for(let x = 0; x < 2; x++) cubes.push(block(BX + (x - 0.5) * S, y * S, BZ + (z - 0.5) * S));
    /* 앞 카드 — 부피 1, 8 과 2×2×2=8, 변 길이 2 */
    const c1 = mcard(k, '1', -1.95, 0.75, { w:0.62, d:0.5, hmax:0.62 });
    const c8 = mcard(k, '8', 2.05, 0.35, { w:0.62, d:0.5, hmax:0.62, bg:'#f3e2b8', glow:true });
    const eq = mcard(k, '2 × 2 × 2 = 8', 0.7, 1.15, { w:2.3, d:0.62, hmax:0.52, bg:'#f3e2b8', glow:true });
    mcard(k, '2', BX, 0.45, { w:0.5, d:0.4, hmax:0.62 });
    /* 움직임: 원래 제단 크기의 돌이 하나씩 빛나며 여덟까지 세어지고(위층은 살짝 들린다) → 2×2×2=8 이 빛난다 */
    const y0 = cubes.map(c => c.position.y), c1y = c1.position.y, c8y = c8.position.y, ey = eq.position.y;
    k.onFrame(t => { const p = cyc(t, 9);
      one.material.emissiveIntensity = 0.35 * hop(p, 0.02, 0.1); c1.position.y = c1y + 0.2 * hop(p, 0.02, 0.1);
      cubes.forEach((c, i) => { const a = 0.12 + i * 0.05, hh = hop(p, a, a + 0.08);
        c.material.emissiveIntensity = 0.35 * hh; if(i >= 4) c.position.y = y0[i] + 0.25 * hh; });
      c8.position.y = c8y + 0.25 * hop(p, 0.52, 0.64); c8.userData.mat.emissiveIntensity = 0.7 * hop(p, 0.52, 0.66);
      eq.position.y = ey + 0.25 * hop(p, 0.58, 0.76); eq.userData.mat.emissiveIntensity = 0.8 * hop(p, 0.58, 0.78); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0.5, 0], envOpts:{ intensity:0.6 } });
  }},

  /* 분리 제곱법 — stage ①: 123² = (100+23)² = 100² + 2×100×23 + 23² = 10000 + 4600 + 529 = 15129 */
  'H-09': { seed:2809, caps:{ P:9, list:[
    [0.0, "$123$을 앞 $100$과 뒤 $23$으로 나눠요: $123^2=(100+23)^2$", "Split $123$ into a front $100$ and a back $23$: $123^2=(100+23)^2$", "把$123$分成前面的$100$和后面的$23$：$123^2=(100+23)^2$"],
    [0.12, "큰 정사각형은 $100^2=10000$, 긴 조각 두 개는 $2\\times 100\\times 23=4600$이에요.", "The big square is $100^2=10000$; the two long pieces are $2\\times 100\\times 23=4600$.", "大正方形是$100^2=10000$，两个长条是$2\\times 100\\times 23=4600$。"],
    [0.48, "작은 정사각형은 $23^2=529$예요.", "The small square is $23^2=529$.", "小正方形是$23^2=529$。"],
    [0.66, "다 더하면 $10000+4600+529=15129$예요!", "Add them all: $10000+4600+529=15129$!", "全部加起来：$10000+4600+529=15129$！"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0.1, 0.1, 0.3], 6.4, 70);
    k.table();
    const A = 1.9, B = 0.78, X0 = -2.75, Z0 = -1.05, GAP = 0.02;
    const PW = 3.75, PD = 3.55, PX = -1.55, PZ = 0.2;
    k.paper(PW, PD, PX, PZ, 0.0, (g, w, h, ink) => {
      const [fx, fz] = onPaper(PW, PD, PX, PZ, w, h), fs = h * 0.065;
      ink(g, '100', fx(X0 + A / 2), fz(Z0 - 0.2), fs); ink(g, '23', fx(X0 + A + B / 2), fz(Z0 - 0.2), fs);
      ink(g, '100', fx(X0 - 0.26), fz(Z0 + A / 2), fs); ink(g, '23', fx(X0 - 0.26), fz(Z0 + A + B / 2), fs);
    });
    const BLUE = '#8fb3d9', GREEN = '#a9cf8f', YEL = '#f0cf6a';
    const pcs = [
      [atile(k, '10000', X0 + A / 2, Z0 + A / 2, A - GAP, A - GAP, BLUE, { hmax:0.2 }), 0, 0],
      [atile(k, '2300', X0 + A + B / 2, Z0 + A / 2, B - GAP, A - GAP, GREEN, { hmax:0.34, side:true }), 1, 0],
      [atile(k, '2300', X0 + A / 2, Z0 + A + B / 2, A - GAP, B - GAP, GREEN, { hmax:0.34 }), 0, 1],
      [atile(k, '529', X0 + A + B / 2, Z0 + A + B / 2, B - GAP, B - GAP, YEL, { hmax:0.34 }), 1, 1]
    ];
    const RX = 1.62;
    mcard(k, '123² = (100 + 23)²', RX, -0.9, { w:2.75, d:0.68, hmax:0.48 });
    const sum = mcard(k, '10000 + 4600 + 529', RX, 0.15, { w:2.75, d:0.68, hmax:0.48, glow:true });
    const res = mcard(k, '= 15129', RX, 1.2, { w:2.0, d:0.7, hmax:0.52, bg:'#f3e2b8', glow:true });
    /* 움직임: 조각이 벌어지고 → 10000, 2300 둘(4600), 529 차례로 들리며 빛남 → 다시 모여 15129 가 빛난다 */
    const base = pcs.map(([g]) => g.position.clone()), sy = sum.position.y, ry = res.position.y;
    const when = [[0.14, 0.28], [0.3, 0.46], [0.3, 0.46], [0.48, 0.62]];
    k.onFrame(t => { const p = cyc(t, 9);
      const e = 0.16 * seg(p, 0.08, 0.16) * (1 - seg(p, 0.64, 0.74));
      pcs.forEach(([g, dx, dz], i) => { const hh = hop(p, when[i][0], when[i][1]);
        g.position.set(base[i].x + e * dx, base[i].y + 0.25 * hh, base[i].z + e * dz); g.userData.mat.emissiveIntensity = 0.6 * hh; });
      sum.userData.mat.emissiveIntensity = 0.5 * hop(p, 0.14, 0.64);
      res.position.y = ry + 0.3 * hop(p, 0.68, 0.9); res.userData.mat.emissiveIntensity = 0.8 * hop(p, 0.68, 0.9);
      sum.position.y = sy + 0.1 * hop(p, 0.68, 0.8); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], envOpts:{ intensity:0.6 } });
  }},

  /* 제곱수의 합 — stage ①: 1²+2²+3²+4²+5² = 5×6×11÷6 = 55. 층마다 정사각형으로 쌓은 블록 55개 */
  'H-10': { seed:2810, caps:{ P:10, list:[
    [0.0, "층마다 정사각형이에요: 위에서부터 $1^2,\\,2^2,\\,3^2,\\,4^2,\\,5^2$개의 블록.", "Each layer is a square: from the top, $1^2,\\,2^2,\\,3^2,\\,4^2,\\,5^2$ blocks.", "每一层都是正方形：从上往下$1^2,\\,2^2,\\,3^2,\\,4^2,\\,5^2$块。"],
    [0.1, "한 층씩 세어요: $1+4+9+16+25$", "Count layer by layer: $1+4+9+16+25$", "一层一层数：$1+4+9+16+25$"],
    [0.56, "공식으로는 $5\\times 6\\times 11\\div 6=55$예요.", "With the formula: $5\\times 6\\times 11\\div 6=55$.", "用公式算：$5\\times 6\\times 11\\div 6=55$。"],
    [0.76, "진짜로 블록이 모두 $55$개예요!", "And there really are $55$ blocks!", "积木真的一共是$55$块！"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([-0.15, 0.4, 0.1], 5.9, 42);
    k.table();
    const S = 0.33, CX = -1.15, CZ = -0.35;
    const COLS = ['#e2453c', '#f2b134', '#46a35a', '#3b8ed0', '#8e5cc9'];
    const geo = k.rbox(S - 0.014, S - 0.014, S - 0.014, 0.035);
    /* layers[n-1] = n×n 층(위에서 n 번째) */
    const layers = [];
    for(let n = 1; n <= 5; n++){
      const grp = new THREE.Group(), mat = new THREE.MeshPhysicalMaterial({ color:COLS[n - 1], roughness:0.4, clearcoat:0.35, emissive:new THREE.Color(COLS[n - 1]), emissiveIntensity:0 });
      for(let i = 0; i < n; i++) for(let j = 0; j < n; j++){ const m = new THREE.Mesh(geo, mat); m.position.set((i - (n - 1) / 2) * S, 0, (j - (n - 1) / 2) * S); m.castShadow = m.receiveShadow = true; grp.add(m); }
      grp.position.set(CX, (5 - n) * S, CZ); grp.userData.mat = mat; scene.add(grp); layers.push(grp);
    }
    /* 층마다 수 카드(같은 색 띠) */
    const cards = [1, 4, 9, 16, 25].map((v, i) => mcard(k, String(v), -2.55 + i * 0.7, 1.25, { w:0.6, d:0.5, hmax:0.56, edge:COLS[i], glow:true }));
    const f = mcard(k, '5 × 6 × 11 ÷ 6', 1.75, -1.2, { w:2.4, d:0.66, hmax:0.5 });
    const res = mcard(k, '= 55', 1.75, -0.2, { w:1.5, d:0.66, hmax:0.52, bg:'#f3e2b8', glow:true });
    /* 움직임: 위층부터 한 층씩 들리며 빛나고(그 위층들도 함께 들린다) 그 층의 수 카드가 빛남 → 55 가 빛난다 */
    const ly = layers.map(g => g.position.y), cy = cards.map(c => c.position.y), ry = res.position.y, fy = f.position.y;
    const W = n => { const a = 0.1 + (n - 1) * 0.085; return hop(p0, a, a + 0.08); };
    let p0 = 0;
    k.onFrame(t => { p0 = cyc(t, 10);
      const hs = [1, 2, 3, 4, 5].map(W);
      layers.forEach((g, m) => { let off = 0; for(let n = m; n < 5; n++) off += 0.22 * hs[n]; g.position.y = ly[m] + off; g.userData.mat.emissiveIntensity = 0.3 * hs[m]; });
      cards.forEach((c, i) => { c.position.y = cy[i] + 0.2 * hs[i]; c.userData.mat.emissiveIntensity = 0.6 * hs[i]; });
      f.position.y = fy + 0.15 * hop(p0, 0.56, 0.7);
      res.position.y = ry + 0.3 * hop(p0, 0.62, 0.9); res.userData.mat.emissiveIntensity = 0.8 * hop(p0, 0.62, 0.9); });
    k.lights({ key:3.0, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0, 0.4, 0], envOpts:{ intensity:0.6 } });
  }},
};
