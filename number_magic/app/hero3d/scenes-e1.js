/* 초등 대표 3D 장면 E1 — 규칙은 app/hero3d/scenes.js 머리말과 같다. 자막은 해요체. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

/* 수 모형(일 모형·십 모형·백 모형). 색: 백 파랑 · 십 초록 · 일 주황 */
function blocks(k, U){
  const { THREE, scene } = k;
  const M = { h:k.plastic('#3b6fb6', 0.38), t:k.plastic('#3e9a55', 0.38), o:k.plastic('#e8a13a', 0.36) };
  const G = k.rbox(U * 0.92, U * 0.92, U * 0.92, U * 0.16);
  const cube = (mat, x, y, z) => { const m = new THREE.Mesh(G, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; };
  /* 일 모형 한 무리(from~to 번째 칸) — z 방향으로 늘어선다. 그룹 원점 = 막대 가운데 */
  const run = (mat, from, to, x, z, y) => { const g = new THREE.Group();
    for(let j = from; j < to; j++) g.add(cube(mat, 0, 0, (j - 4.5) * U));
    g.position.set(x, y || 0, z); scene.add(g); return g; };
  const rod = (x, z, y) => run(M.t, 0, 10, x, z, y);
  const ones = (x, z, y) => { const g = new THREE.Group(); g.add(cube(M.o, 0, 0, 0)); g.position.set(x, y || 0, z); scene.add(g); return g; };
  /* 백 모형 — 판 한 장에 홈 무늬 */
  const grid = k.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#3b6fb6'; g.fillRect(0, 0, w, h);
    for(let i = 0; i <= 10; i++){ const p = i * w / 10; g.fillStyle = 'rgba(10,30,70,.55)'; g.fillRect(p - 3, 0, 6, h); g.fillRect(0, p - 3, w, 6);
      g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(p + 3, 0, 2, h); g.fillRect(0, p + 3, w, 2); } });
  const topM = new THREE.MeshPhysicalMaterial({ map:grid, roughness:0.38, clearcoat:0.3, clearcoatRoughness:0.4 });
  const flat = (x, z, y) => { const g = new THREE.Group();
    const s = new THREE.Mesh(k.rbox(U * 9.9, U * 0.9, U * 9.9, U * 0.2), M.h); s.castShadow = s.receiveShadow = true; g.add(s);
    const t = new THREE.Mesh(new THREE.PlaneGeometry(U * 9.7, U * 9.7), topM); t.rotation.x = -Math.PI / 2; t.position.y = U * 0.9 + 0.003; t.receiveShadow = true; g.add(t);
    g.position.set(x, y || 0, z); scene.add(g); return g; };
  return { M, run, rod, ones, flat, cube };
}
/* 수식 카드(한 줄) */
const card = (k, txt, x, z, o) => k.card(Array.isArray(txt) ? txt : [txt], x, z, Object.assign({ w:1.6, d:0.55, bg:'#f6ecd4' }, o || {}));
/* a → b 로 옮기며(0~1) 위로 살짝 들렸다 놓인다 */
const moveTo = (obj, A, B, s, lift) => { obj.position.lerpVectors(A, B, s); obj.position.y += (lift == null ? 0.45 : lift) * Math.sin(Math.PI * s); };

export const SCENES_E1 = {

  /* 모으기와 가르기 — hook: 8을 똑같이 둘로 가르면 4와 4. 두 손에 나눠 쥐었다가 다시 모으기. stage: 사탕으로 가르기·모으기 */
  'N-06': { seed:306, caps:{ P:8, list:[
    [0.0, "사탕 $8$개를 똑같이 둘로 가르면 $4$와 $4$예요.", "Split $8$ candies into two equal groups: $4$ and $4$.", "把$8$颗糖平均分成两份：$4$和$4$。"],
    [0.3, "다시 모아 볼까요? $4+4=8$", "Put them back together: $4+4=8$", "再合起来看看：$4+4=8$"],
    [0.62, "갈라도 모아도 전체는 그대로 $8$이에요.", "Split or put together, the whole is still $8$.", "分开也好，合起来也好，总数还是$8$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, 0.35], 5.2, 50);
    k.table();
    /* 가르기 나무: 8 에서 두 갈래로 4, 4 */
    k.paper(5.0, 3.4, 0, 0.3, 0.01, (g, w, h) => {
      g.strokeStyle = 'rgba(28,20,14,.75)'; g.lineWidth = 9; g.lineCap = 'round';
      const P = (x, z) => [w * (x + 2.5) / 5.0, h * (z - 0.3 + 1.7) / 3.4];
      [[-1.3, 0.05], [1.3, 0.05]].forEach(([x, z]) => { const a = P(0, -0.65), b = P(x * 0.8, z - 0.1); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); });
    });
    k.tile('8', 0, -1.0, { w:0.7, d:0.7, h:0.2, y:0.02, wood:'#d9b27c', size:250 });
    k.tile('4', -1.3, 0.1, { w:0.62, d:0.62, h:0.18, y:0.02, wood:'#d9b27c', size:230 });
    k.tile('4', 1.3, 0.1, { w:0.62, d:0.62, h:0.18, y:0.02, wood:'#d9b27c', size:230 });
    /* 사탕 — 동그란 알 + 양쪽 비닐 꼬임 */
    const cols = ['#d23b2e', '#e8b62f', '#3f9a55', '#d8578f', '#3f78c4', '#e0782c', '#8a4fb0', '#2fa3a0'];
    const bodyG = new THREE.SphereGeometry(0.13, 32, 20), twG = new THREE.ConeGeometry(0.075, 0.13, 20);
    const candy = (c) => { const g = new THREE.Group(); const m = k.plastic(c, 0.22);
      const b = new THREE.Mesh(bodyG, m); b.scale.set(1.25, 0.85, 1); g.add(b);
      [-1, 1].forEach(s => { const t = new THREE.Mesh(twG, new THREE.MeshPhysicalMaterial({ color:c, roughness:0.2, transmission:0.3, transparent:true, opacity:0.85, clearcoat:0.8 }));
        t.rotation.z = s * Math.PI / 2; t.position.x = s * 0.2; g.add(t); });
      g.children.forEach(o => { o.castShadow = o.receiveShadow = true; }); g.position.y = 0.13; scene.add(g); return g; };
    const split = [], joined = [];
    for(let i = 0; i < 8; i++){
      const side = i < 4 ? -1 : 1, j = i % 4;
      split.push(new THREE.Vector3(side * 1.3 + (j % 2 - 0.5) * 0.52, 0.13, 0.85 + Math.floor(j / 2) * 0.42));
      joined.push(new THREE.Vector3((i % 4 - 1.5) * 0.5, 0.13, 0.85 + Math.floor(i / 4) * 0.42));
    }
    const cs = cols.map((c, i) => { const g = candy(c); g.position.copy(split[i]); g.rotation.y = (k.rnd() - 0.5) * 0.5; return g; });
    /* 움직임: 두 무리가 가운데로 모였다가(8) → 다시 4 와 4 로 갈라진다 */
    k.onFrame(t => { const p = cyc(t, 8);
      const a = seg(p, 0.28, 0.44) * (1 - seg(p, 0.62, 0.8));
      cs.forEach((g, i) => { g.position.lerpVectors(split[i], joined[i], a); g.position.y = 0.13 + 0.25 * (hop(p, 0.28, 0.44) + hop(p, 0.62, 0.8)); }); });
    k.lights({ envOpts:{ intensity:0.6 } });
  }},

  /* 더해서 10을 찾아라 — stage ①: 3, 6, 7, 4 → 3과 7, 6과 4가 짝, 10+10=20 */
  'A-01': { seed:401, caps:{ P:8, list:[
    [0.0, "더해서 $10$이 되는 짝을 먼저 찾아요: $3$과 $7$, $6$과 $4$", "First find pairs that make $10$: $3$ and $7$, $6$ and $4$.", "先找加起来是$10$的一对：$3$和$7$，$6$和$4$。"],
    [0.3, "순서대로 $3+6+7+4$를 더하면 힘들어요.", "Adding $3+6+7+4$ in order is hard work.", "按顺序算$3+6+7+4$很费劲。"],
    [0.62, "짝끼리 묶으면 $10+10=20$, 금방이에요!", "Pair them up: $10+10=20$, done in no time!", "两两配对：$10+10=20$，一下就算好了！"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, 0.3], 5.6, 52);
    k.table();
    /* 십 칸 판 두 개 — 구슬 3+7, 6+4 */
    const trayM = k.woodMat('#c99a60', [120, 80, 40]), holeM = new THREE.MeshStandardMaterial({ color:'#6b4526', roughness:0.8 });
    const beadG = new THREE.SphereGeometry(0.13, 32, 20);
    const tray = (cx, cz, a, ca, cb) => {
      const t = new THREE.Mesh(k.rbox(2.05, 0.1, 0.9, 0.06), trayM); t.position.set(cx, 0, cz); t.castShadow = t.receiveShadow = true; scene.add(t);
      const beads = [];
      for(let i = 0; i < 10; i++){ const x = cx + (i % 5 - 2) * 0.38, z = cz + (Math.floor(i / 5) - 0.5) * 0.4;
        const h = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.01, 28), holeM); h.position.set(x, 0.101, z); scene.add(h);
        const b = new THREE.Mesh(beadG, k.plastic(i < a ? ca : cb, 0.2)); b.position.set(x, 0.2, z); b.castShadow = b.receiveShadow = true; scene.add(b); beads.push(b); }
      return beads;
    };
    const L = tray(-1.35, 0.2, 3, '#d23b2e', '#3f78c4'), R = tray(1.35, 0.2, 6, '#3f9a55', '#e8b62f');
    /* 수 카드: 짝끼리 나란히(3·7 / 6·4). 테두리 색 = 구슬 색 */
    const cA = { w:0.62, d:0.62, y:0 };
    const c3 = card(k, '3', -1.8, -0.75, Object.assign({ edge:'#d23b2e' }, cA)), c7 = card(k, '7', -0.9, -0.75, Object.assign({ edge:'#3f78c4' }, cA));
    const c6 = card(k, '6', 0.9, -0.75, Object.assign({ edge:'#3f9a55' }, cA)), c4 = card(k, '4', 1.8, -0.75, Object.assign({ edge:'#e8b62f' }, cA));
    card(k, '10', -1.35, 1.0, { w:0.8, d:0.5 }); card(k, '10', 1.35, 1.0, { w:0.8, d:0.5 });
    card(k, '10 + 10 = 20', 0, 1.7, { w:2.4, d:0.58, bg:'#f3e2b8' });
    /* 움직임: 6 과 7 이 자리를 바꿔 처음 순서(3, 6, 7, 4)가 됐다가 → 다시 짝끼리 모이고, 구슬 판이 톡 */
    const P6 = c6.position.clone(), P7 = c7.position.clone();
    k.onFrame(t => { const p = cyc(t, 8);
      const a = seg(p, 0.12, 0.28) * (1 - seg(p, 0.46, 0.62));
      c6.position.lerpVectors(P6, P7, a); c7.position.lerpVectors(P7, P6, a);
      c6.position.z = P6.z - 0.35 * Math.sin(Math.PI * a); c7.position.z = P7.z + 0.25 * Math.sin(Math.PI * a);
      c6.position.y = c7.position.y = 0.3 * (hop(p, 0.12, 0.28) + hop(p, 0.46, 0.62));
      L.forEach((b, i) => { b.position.y = 0.2 + 0.18 * hop(p, 0.64 + i * 0.008, 0.74 + i * 0.008); });
      R.forEach((b, i) => { b.position.y = 0.2 + 0.18 * hop(p, 0.72 + i * 0.008, 0.82 + i * 0.008); }); });
    k.lights({ envOpts:{ intensity:0.6 } });
  }},

  /* 우선 10을 더하기 — stage ②: 25 + 9 = 25 + 10 − 1 = 35 − 1 = 34 */
  'A-03': { seed:403, caps:{ P:9, list:[
    [0.0, "$25+9$는 어떻게 할까요? $9$는 $10$보다 $1$ 작아요.", "How about $25+9$? $9$ is $1$ less than $10$.", "$25+9$怎么算？$9$比$10$少$1$。"],
    [0.38, "우선 $10$을 통째로 더해요: $25+10=35$", "First add a whole $10$: $25+10=35$", "先整个加上$10$：$25+10=35$"],
    [0.6, "더 준 $1$을 돌려받으면 $35-1=34$예요.", "Take back the extra $1$: $35-1=34$.", "把多给的$1$拿回来：$35-1=34$。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0.1, 0, 0.1], 5.8, 50);
    k.table();
    k.paper(3.0, 2.6, -1.3, -0.05, 0.01);
    const U = 0.2, B = blocks(k, U);
    const rods = [-2.35, -2.05, -1.75].map(x => B.rod(x, -0.05, 0.035));
    const unitZ = j => -0.95 + j * U * 1.08;
    for(let j = 0; j < 4; j++) B.ones(-1.3, unitZ(j), 0.035);
    /* 돌려받은 1 — 작은 접시 위 */
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.26, 0.05, 40), k.plastic('#f2efe8', 0.25)); dish.position.set(-0.55, 0.025, 0.85); dish.castShadow = dish.receiveShadow = true; k.scene.add(dish);
    const back = B.ones(-0.55, 0.85, 0.05);
    card(k, '25 + 9', 1.65, -0.9, { w:2.0, d:0.6, bg:'#f3e2b8' });
    card(k, '25 + 10 − 1', 1.65, -0.05, { w:2.0, d:0.6 });
    card(k, '35 − 1 = 34', 1.65, 0.8, { w:2.0, d:0.6 });
    /* 움직임: 새 십 모형이 빠지고 1 이 돌아와 25 → 십 모형을 통째로 주어 35 → 1 을 돌려받아 34 */
    const RA = rods[2].position.clone(), RB = new THREE.Vector3(-1.75, 1.6, -1.6);
    const CA = back.position.clone(), CB = new THREE.Vector3(-1.3, 0.035, unitZ(4));
    k.onFrame(t => { const p = cyc(t, 9);
      const out = seg(p, 0.06, 0.2) * (1 - seg(p, 0.4, 0.54));
      rods[2].position.lerpVectors(RA, RB, out);
      const home = seg(p, 0.06, 0.2) * (1 - seg(p, 0.62, 0.78));
      back.position.lerpVectors(CA, CB, home); back.position.y += 0.35 * (hop(p, 0.06, 0.2) + hop(p, 0.62, 0.78)); });
    k.lights({ envOpts:{ intensity:0.6 } });
  }},

  /* 끼리끼리 더해요 — stage ②: 73+62+50+41 = (70+60+50+40)+(3+2+0+1) = 220+6 = 226 */
  'A-07': { seed:407, caps:{ P:9, list:[
    [0.0, "$73+62+50+41$을 끼리끼리 모아 더해요.", "Add $73+62+50+41$ by grouping like with like.", "把$73+62+50+41$分类相加。"],
    [0.2, "십의 자리끼리 $70+60+50+40=220$", "Tens together: $70+60+50+40=220$", "十位和十位：$70+60+50+40=220$"],
    [0.42, "일의 자리끼리 $3+2+0+1=6$", "Ones together: $3+2+0+1=6$", "个位和个位：$3+2+0+1=6$"],
    [0.66, "합치면 $220+6=226$이에요!", "Put them together: $220+6=226$!", "合起来：$220+6=226$！"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, 0.2], 6.6, 56);
    k.table();
    const TOP = ['73', '62', '50', '41'], TEN = ['70', '60', '50', '40'], ONE = ['3', '2', '0', '1'];
    const tops = TOP.map((s, i) => card(k, s, -2.4 + i * 1.6, -1.25, { w:1.1, d:0.62, bg:'#f3e2b8' }));
    /* 쟁반 두 개 — 왼쪽 십의 자리(초록), 오른쪽 일의 자리(주황) */
    const trayM = k.woodMat('#b98652', [110, 70, 35]);
    [-1.6, 1.6].forEach(x => { const t = new THREE.Mesh(k.rbox(3.05, 0.06, 0.95, 0.08), trayM); t.position.set(x, 0, 0.05); t.castShadow = t.receiveShadow = true; scene.add(t); });
    const tens = TEN.map((s, i) => card(k, s, -2.7 + i * 0.73, 0.05, { w:0.64, d:0.56, bg:'#dcefd8', edge:'#3e9a55', y:0.06 }));
    const ones = ONE.map((s, i) => card(k, s, 0.5 + i * 0.73, 0.05, { w:0.64, d:0.56, bg:'#f8e2c2', edge:'#e8a13a', y:0.06 }));
    const s1 = card(k, '220', -1.6, 1.05, { w:1.1, d:0.56, bg:'#dcefd8', edge:'#3e9a55' });
    const s2 = card(k, '6', 1.6, 1.05, { w:0.8, d:0.56, bg:'#f8e2c2', edge:'#e8a13a' });
    const fin = card(k, '220 + 6 = 226', 0, 1.85, { w:2.6, d:0.6, bg:'#f3e2b8' });
    /* 움직임: 수 카드 하나가 들리면 그 십의 자리·일의 자리 카드가 따라 톡 → 220 과 6 → 226 */
    const all = [...tops, ...tens, ...ones, s1, s2, fin], y0 = all.map(g => g.position.y);
    k.onFrame(t => { const p = cyc(t, 9);
      for(let i = 0; i < 4; i++){ const a = 0.04 + i * 0.09;
        tops[i].position.y = y0[i] + 0.25 * hop(p, a, a + 0.08);
        tens[i].position.y = y0[4 + i] + 0.22 * hop(p, a + 0.04, a + 0.12);
        ones[i].position.y = y0[8 + i] + 0.22 * hop(p, a + 0.04, a + 0.12); }
      s1.position.y = y0[12] + 0.25 * hop(p, 0.46, 0.56); s2.position.y = y0[13] + 0.25 * hop(p, 0.46, 0.56);
      fin.position.y = y0[14] + 0.28 * hop(p, 0.66, 0.78); });
    k.lights({ envOpts:{ intensity:0.6 } });
  }},

  /* 단위별 따로따로 빼기 — stage ①: 80 − 47 = 80 − 40 − 7 = 40 − 7 = 33. history: 빼기 기호 −, 1489년 독일 책 */
  'A-10': { seed:410, caps:{ P:9, list:[
    [0.0, "$80-47$은 $47$을 $40$과 $7$로 나눠서 빼요.", "For $80-47$, split $47$ into $40$ and $7$.", "算$80-47$时，把$47$分成$40$和$7$。"],
    [0.3, "먼저 십의 자리 $40$을 빼요: $80-40=40$", "Take away the tens first: $80-40=40$", "先减十位的$40$：$80-40=40$"],
    [0.55, "남은 $7$을 빼면 $40-7=33$이에요.", "Then take away $7$: $40-7=33$.", "再减去$7$：$40-7=33$。"],
    [0.8, "빼기 기호 $-$는 1489년 독일 책에 처음 나왔어요.", "The minus sign $-$ first appeared in a German book in 1489.", "减号$-$最早出现在1489年的一本德国书里。"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0, 0.25], 6.2, 52);
    k.table();
    const U = 0.17, B = blocks(k, U);
    k.paper(2.7, 2.5, -1.55, -0.3, 0.01);
    k.paper(2.3, 2.5, 1.5, -0.3, -0.012);
    const slot = i => new THREE.Vector3(-2.55 + i * 0.26, 0.035, -0.3);
    const keep = [0, 1, 2].map(i => B.rod(slot(i).x, slot(i).z, 0.035));
    const three = B.run(B.M.t, 0, 3, slot(3).x, slot(3).z, 0.035);
    const seven = B.run(B.M.t, 3, 10, 0, 0, 0.035);
    const outRods = [4, 5, 6, 7].map(i => B.rod(0, 0, 0.035));
    const OUT = [0, 1, 2, 3].map(i => new THREE.Vector3(0.75 + i * 0.26, 0.035, -0.3)), OUT7 = new THREE.Vector3(2.05, 0.035, -0.3 - 0.4);
    outRods.forEach((g, i) => g.position.copy(OUT[i])); seven.position.copy(OUT7);
    card(k, '80 − 47', -1.9, 1.45, { w:1.5, d:0.55, bg:'#f3e2b8' });
    card(k, '80 − 40 − 7', 0, 1.45, { w:1.8, d:0.55 });
    card(k, '40 − 7 = 33', 1.95, 1.45, { w:1.8, d:0.55 });
    /* 움직임: 빼낸 것이 모두 돌아와 80 → 십 모형 4 개가 빠지고(−40) → 일 모형 7 개가 빠진다(−7) */
    k.onFrame(t => { const p = cyc(t, 9);
      const back = seg(p, 0.06, 0.2);
      const r = back * (1 - seg(p, 0.32, 0.48)), s = back * (1 - seg(p, 0.56, 0.72));
      outRods.forEach((g, i) => moveTo(g, OUT[i], slot(4 + i), r, 0.3));
      moveTo(seven, OUT7, slot(3), s, 0.3); });
    k.lights({ envOpts:{ intensity:0.6 } });
  }},

  /* 백으로 쪼개서 빼기 — stage ①: 400 − 35 = 300 + 100 − 35 = 300 + 65 = 365 */
  'A-13': { seed:413, caps:{ P:9, list:[
    [0.0, "$400-35$는 $100$ 하나만 떼어 내서 빼요.", "For $400-35$, break off just one $100$.", "算$400-35$时，只拿出一个$100$来减。"],
    [0.2, "$400=300+100$이에요.", "$400=300+100$", "$400=300+100$"],
    [0.46, "떼어 낸 $100$에서 $35$를 빼면 $65$", "Take $35$ from that $100$: $65$ is left.", "从拿出的$100$里减去$35$，剩下$65$。"],
    [0.72, "$300+65=365$예요!", "$300+65=365$!", "$300+65=365$！"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0, 0.3], 6.7, 54);
    k.table();
    const U = 0.12, B = blocks(k, U);
    k.paper(6.6, 1.9, 0, -0.35, 0.005);
    [-2.65, -1.35, -0.05].forEach(x => B.flat(x, -0.35, 0.035));
    /* 떼어 낸 100 — 십 모형 10 줄로 */
    const X0 = 0.72, rx = i => X0 + (i + 0.5) * U;
    for(let i = 0; i < 6; i++) B.rod(rx(i), -0.35, 0.035);
    B.run(B.M.t, 0, 5, rx(6), -0.35, 0.035);
    const half = B.run(B.M.t, 5, 10, 0, 0, 0.035);
    const gone = [7, 8, 9].map(() => B.rod(0, 0, 0.035));
    const OUT = [0, 1, 2].map(i => new THREE.Vector3(2.35 + i * 0.16, 0.035, -0.35)), OUTH = new THREE.Vector3(2.9, 0.035, -0.35);
    gone.forEach((g, i) => g.position.copy(OUT[i])); half.position.copy(OUTH);
    card(k, '400 − 35', -2.2, 1.2, { w:1.6, d:0.55, bg:'#f3e2b8' });
    card(k, '300 + 100 − 35', 0, 1.2, { w:2.2, d:0.55 });
    card(k, '300 + 65 = 365', 2.3, 1.2, { w:2.2, d:0.55 });
    /* 움직임: 빼낸 35 가 돌아와 100 한 판(400)이 되었다가 → 다시 35 가 빠진다 */
    k.onFrame(t => { const p = cyc(t, 9);
      const s = seg(p, 0.06, 0.2) * (1 - seg(p, 0.44, 0.6));
      gone.forEach((g, i) => moveTo(g, OUT[i], new THREE.Vector3(rx(7 + i), 0.035, -0.35), s, 0.3));
      moveTo(half, OUTH, new THREE.Vector3(rx(6), 0.035, -0.35), s, 0.3); });
    k.lights({ envOpts:{ intensity:0.6 } });
  }},

  /* 앞부터 더하기 — stage ①: 357 + 468 → 300+400=700 → 700+110=810 → 810+15=825 */
  'A-18': { seed:418, caps:{ P:9, list:[
    [0.0, "$357+468$을 앞에서부터 더해요.", "Add $357+468$ starting from the front.", "从最高位开始算$357+468$。"],
    [0.1, "백의 자리부터: $300+400=700$", "Hundreds first: $300+400=700$", "先算百位：$300+400=700$"],
    [0.36, "십의 자리를 더해요: $700+110=810$", "Add the tens: $700+110=810$", "再加十位：$700+110=810$"],
    [0.64, "일의 자리까지: $810+15=825$", "Then the ones: $810+15=825$", "最后加个位：$810+15=825$"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([-0.05, 0, -0.1], 6.1, 55);
    k.table();
    const U = 0.1, B = blocks(k, U);
    const row = (z, h, t, o) => {
      const F = []; for(let i = 0; i < h; i++){ const f = B.flat(-2.45 + i * 0.13, z - 0.15 + i * 0.1, i * U * 0.92); F.push(f); }
      const T = []; for(let i = 0; i < t; i++) T.push(B.rod(-1.45 + i * 0.13, z));
      const O = []; for(let i = 0; i < o; i++) O.push(B.ones(-0.45 + (i % 2) * 0.13, z - 0.45 + Math.floor(i / 2) * 0.13));
      return { F, T, O };
    };
    const r1 = row(-0.85, 3, 5, 7), r2 = row(0.6, 4, 6, 8);
    card(k, '357 + 468', 1.75, -1.15, { w:2.2, d:0.55, bg:'#f3e2b8' });
    const c1 = card(k, '300 + 400 = 700', 1.75, -0.4, { w:2.2, d:0.55, edge:'#3b6fb6' });
    const c2 = card(k, '700 + 110 = 810', 1.75, 0.35, { w:2.2, d:0.55, edge:'#3e9a55' });
    const c3 = card(k, '810 + 15 = 825', 1.75, 1.1, { w:2.2, d:0.55, edge:'#e8a13a' });
    /* 움직임: 백 모형 → 카드 700, 십 모형 → 카드 810, 일 모형 → 카드 825 가 차례로 톡 */
    const grp = [[...r1.F, ...r2.F], [...r1.T, ...r2.T], [...r1.O, ...r2.O]], cards = [c1, c2, c3];
    const y0 = grp.map(g => g.map(o => o.position.y));
    k.onFrame(t => { const p = cyc(t, 9);
      grp.forEach((g, j) => { const a = 0.1 + j * 0.27; g.forEach((o, i) => { o.position.y = y0[j][i] + 0.22 * hop(p, a, a + 0.1); });
        cards[j].position.y = 0.25 * hop(p, a + 0.1, a + 0.2); }); });
    k.lights({ envOpts:{ intensity:0.6 } });
  }},

  /* 앞부터 빼기 — stage ①: 563 − 241 → 500−200=300 → 300+60−40=320 → 320+3−1=322 */
  'A-30': { seed:430, caps:{ P:9, list:[
    [0.0, "$563-241$을 앞에서부터 빼요.", "Subtract $563-241$ starting from the front.", "从最高位开始算$563-241$。"],
    [0.26, "백의 자리부터: $500-200=300$", "Hundreds first: $500-200=300$", "先算百位：$500-200=300$"],
    [0.46, "십의 자리: $300+60-40=320$", "Tens next: $300+60-40=320$", "再算十位：$300+60-40=320$"],
    [0.66, "일의 자리: $320+3-1=322$", "Then the ones: $320+3-1=322$", "最后个位：$320+3-1=322$"]
  ]},
    build(k){
    const { THREE } = k;
    k.frame([0, 0, 0.35], 6.4, 55);
    k.table();
    const U = 0.1, B = blocks(k, U);
    k.paper(2.9, 1.9, -1.55, -0.55, 0.008);
    k.paper(2.7, 1.9, 1.55, -0.55, -0.01);
    const FZ = -0.55, fh = U * 0.92;
    /* 남긴 것 322 (왼쪽) · 빼낸 것 241 (오른쪽) */
    const fKeep = i => new THREE.Vector3(-2.5 + i * 0.13, i * fh, FZ - 0.2 + i * 0.1);
    const tKeep = i => new THREE.Vector3(-1.2 + i * 0.13, 0, FZ);
    const oKeep = i => new THREE.Vector3(-0.4 + (i % 2) * 0.13, 0, FZ - 0.4 + Math.floor(i / 2) * 0.13);
    const fOut = i => new THREE.Vector3(0.85 + i * 0.13, i * fh, FZ - 0.2 + i * 0.1);
    const tOut = i => new THREE.Vector3(1.75 + i * 0.13, 0, FZ);
    const oOut = i => new THREE.Vector3(2.55, 0, FZ - 0.4 + i * 0.13);
    for(let i = 0; i < 3; i++) B.flat(fKeep(i).x, fKeep(i).z, fKeep(i).y);
    for(let i = 0; i < 2; i++) B.rod(tKeep(i).x, tKeep(i).z);
    for(let i = 0; i < 2; i++) B.ones(oKeep(i).x, oKeep(i).z);
    const F = [0, 1].map(i => { const g = B.flat(0, 0); g.position.copy(fOut(i)); return g; });
    const T = [0, 1, 2, 3].map(i => { const g = B.rod(0, 0); g.position.copy(tOut(i)); return g; });
    const O = [B.ones(0, 0)]; O[0].position.copy(oOut(0));
    card(k, '563 − 241', -1.75, 0.85, { w:2.1, d:0.55, bg:'#f3e2b8' });
    card(k, '500 − 200 = 300', 1.55, 0.85, { w:2.4, d:0.55, edge:'#3b6fb6' });
    card(k, '300 + 60 − 40 = 320', -1.3, 1.6, { w:2.9, d:0.55, edge:'#3e9a55' });
    card(k, '320 + 3 − 1 = 322', 1.75, 1.6, { w:2.7, d:0.55, edge:'#e8a13a' });
    /* 움직임: 빼낸 것이 모두 돌아와 563 → 백 모형 2(−200) → 십 모형 4(−40) → 일 모형 1(−1) 차례로 빠진다 */
    k.onFrame(t => { const p = cyc(t, 9);
      const back = seg(p, 0.05, 0.18);
      const f = back * (1 - seg(p, 0.28, 0.42)), tt = back * (1 - seg(p, 0.48, 0.62)), o = back * (1 - seg(p, 0.68, 0.82));
      F.forEach((g, i) => moveTo(g, fOut(i), fKeep(3 + i), f, 0.35));
      T.forEach((g, i) => moveTo(g, tOut(i), tKeep(2 + i), tt, 0.3));
      O.forEach((g, i) => moveTo(g, oOut(i), oKeep(2 + i), o, 0.3)); });
    k.lights({ envOpts:{ intensity:0.6 } });
  }}
};
