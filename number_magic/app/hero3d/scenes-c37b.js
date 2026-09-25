/* C37B 마법 유닛 3D 장면 — 규칙은 app/hero3d/scenes.js 머리말과 같다. */
import { ease, seg, cyc, hop } from './anim.js';

/* ── 공용 도구(이 파일 안에서만) ───────────────────────────────── */

/* 수식 조각 그리기 — 문자열(mathText), {sup:'2'}(윗첨자), {sub:'1'}(아래첨자), {r:'8'}(근호),
   {bar:'x'}(윗줄 문자), {up:'IQR'}(바로 선 글자), {n:[…], d:[…]}(분수). 너비를 돌려준다(draw=false 면 재기만) */
function mdraw(k, g, parts, x, cy, fs, draw){
  let cx = x;
  parts.forEach(p => {
    if(typeof p === 'string'){ cx += k.mathText(g, p, cx, cy, fs, { align:'left', draw }); return; }
    if(p.up != null){ cx += k.mathText(g, p.up, cx, cy, fs, { align:'left', draw, upright:true }); return; }
    if(p.sup != null){ const w = k.mathText(g, p.sup, cx + fs * 0.03, cy - fs * 0.36, fs * 0.7, { align:'left', draw }); cx += w + fs * 0.04; return; }
    if(p.sub != null){ const w = k.mathText(g, p.sub, cx + fs * 0.01, cy + fs * 0.26, fs * 0.62, { align:'left', draw }); cx += w + fs * 0.04; return; }
    if(p.bar != null){
      const w = k.mathText(g, p.bar, cx, cy, fs, { align:'left', draw });
      if(draw !== false){ g.save(); g.lineWidth = fs * 0.06; g.beginPath(); g.moveTo(cx + fs * 0.1, cy - fs * 0.5); g.lineTo(cx + w + fs * 0.04, cy - fs * 0.5); g.stroke(); g.restore(); }
      cx += w + fs * 0.02; return;
    }
    if(p.r != null){
      const rw = k.mathText(g, p.r, 0, 0, fs, { draw:false }), lw = fs * 0.62, W = lw + rw + fs * 0.12;
      if(draw !== false){
        g.save(); g.lineWidth = fs * 0.065; g.lineJoin = 'round'; g.lineCap = 'round';
        g.beginPath(); g.moveTo(cx + fs * 0.04, cy + fs * 0.06); g.lineTo(cx + fs * 0.16, cy - fs * 0.02);
        g.lineTo(cx + fs * 0.34, cy + fs * 0.46); g.lineTo(cx + fs * 0.56, cy - fs * 0.6); g.lineTo(cx + W, cy - fs * 0.6); g.stroke(); g.restore();
        k.mathText(g, p.r, cx + lw + fs * 0.04, cy + fs * 0.02, fs, { align:'left' });
      }
      cx += W + fs * 0.04; return;
    }
    if(p.n){
      const s = fs * 0.8, wn = mdraw(k, g, p.n, 0, 0, s, false), wd = mdraw(k, g, p.d, 0, 0, s, false), W = Math.max(wn, wd) + fs * 0.3;
      if(draw !== false){
        mdraw(k, g, p.n, cx + (W - wn) / 2, cy - fs * 0.62, s, true);
        mdraw(k, g, p.d, cx + (W - wd) / 2, cy + fs * 0.7, s, true);
        g.save(); g.lineWidth = fs * 0.065; g.beginPath(); g.moveTo(cx + fs * 0.06, cy); g.lineTo(cx + W - fs * 0.06, cy); g.stroke(); g.restore();
      }
      cx += W + fs * 0.06;
    }
  });
  return cx - x;
}
/* 수식 판 텍스처 — 폭에 맞춰 글자 크기를 줄인다 */
function mtex(k, parts, pw, ph, o){
  o = o || {};
  return k.canvasTex(pw, ph, (g, w, h) => {
    g.fillStyle = o.bg || '#f3e7cf'; g.fillRect(0, 0, w, h);
    if(o.frame){ g.strokeStyle = o.frame; g.lineWidth = Math.min(w, h) * 0.035; g.strokeRect(g.lineWidth, g.lineWidth, w - 2 * g.lineWidth, h - 2 * g.lineWidth); }
    g.fillStyle = g.strokeStyle = o.color || '#2b2118'; g.textBaseline = 'middle';
    let fs = h * (o.hmax || 0.5); const tw = mdraw(k, g, parts, 0, 0, fs, false);
    if(tw > w * (o.fill || 0.84)) fs *= w * (o.fill || 0.84) / tw;
    const W = mdraw(k, g, parts, 0, 0, fs, false);
    mdraw(k, g, parts, (w - W) / 2, h / 2 + (o.dy || 0) * h, fs, true);
  });
}
/* 수식 카드 — 얇은 판 윗면에 mtex */
function mcard(k, parts, x, z, o){
  o = o || {};
  const { THREE, scene } = k;
  const w = o.w || 1.0, d = o.d || 0.8, h = o.h || 0.04, pw = 1024, ph = Math.round(1024 * d / w);
  const grp = new THREE.Group();
  const body = new THREE.Mesh(k.rbox(w, h, d, Math.min(0.04, d * 0.1)), new THREE.MeshStandardMaterial({ color:o.edge || '#e9dcc0', roughness:0.85 }));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  const tex = mtex(k, parts, pw, ph, o);
  const mat = new THREE.MeshStandardMaterial({ map:tex, roughness:0.8 });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), mat);
  top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
  grp.position.set(x, o.y == null ? 0.035 : o.y, z); grp.rotation.y = o.rot || 0; scene.add(grp);
  return grp;
}
/* 좌표판 — 나무판 위 모눈종이(scenes-c34 board 와 같은 방식). P(x, y, h) 로 판 위의 월드 좌표 */
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
/* 압정 — 둥근 머리 + 짧은 바늘 */
function pin(k, p, color, r){
  const { THREE, scene } = k;
  const g = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(r || 0.075, 24, 16), new THREE.MeshPhysicalMaterial({ color, roughness:0.25, clearcoat:1 })); head.position.y = 0.12;
  const nd = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), k.metal('#c9c3b5', 0.25)); nd.position.y = 0.05;
  [head, nd].forEach(m => { m.castShadow = true; g.add(m); });
  g.position.set(p.x, p.y - 0.12, p.z); scene.add(g); return g;
}
/* 세운 식 판 */
function plate(k, parts, w, h, o){
  o = o || {};
  const m = new k.THREE.Mesh(new k.THREE.PlaneGeometry(w, h), new k.THREE.MeshStandardMaterial({ map:mtex(k, parts, 1024, Math.round(1024 * h / w), Object.assign({ hmax:0.62, fill:0.86 }, o)), roughness:0.7 }));
  m.receiveShadow = true; return m;
}

export const SCENES_C37B = {

  /* 이차함수의 식 구하기 — hook: 꼭짓점을 알면 y=a(x−p)²+q 로 시작, 점 하나로 a.
     stage ①: 꼭짓점 (2, 3), 지나는 점 (4, 11) → 11 = a×4+3 → a = 2 */
  'M-81': { seed:381, caps:{ P:9, list:[
    [0.0, "꼭짓점이 $(2,\\,3)$이면 $y=a(x-2)^2+3$으로 시작합니다.", "A vertex at $(2,\\,3)$ means we start from $y=a(x-2)^2+3$.", "顶点是$(2,\\,3)$，就从$y=a(x-2)^2+3$入手。"],
    [0.1, "$a$가 바뀌어도 꼭짓점은 그대로입니다. 남은 것은 $a$ 하나입니다.", "Changing $a$ keeps the vertex fixed; $a$ is the only unknown.", "$a$变化时顶点不动，未知数只剩$a$。"],
    [0.6, "점 $(4,\\,11)$을 넣으면 $11=4a+3$입니다.", "Substitute $(4,\\,11)$: $11=4a+3$.", "代入点$(4,\\,11)$：$11=4a+3$。"],
    [0.8, "그래서 $a=2$, 식은 $y=2(x-2)^2+3$입니다.", "So $a=2$ and the formula is $y=2(x-2)^2+3$.", "所以$a=2$，解析式是$y=2(x-2)^2+3$。"]
  ]},
    build(k){
    const { THREE, scene } = k;
    k.frame([0.45, 0, 0.25], 6.3, 62);
    k.table();
    const B = board(k, { x0:-1, x1:5.4, y0:-1, y1:12.2, ux:0.52, uy:0.27, cx:-0.95, cz:0.1, xs:[1, 2, 3, 4, 5], ys:[3, 6, 9, 11], fs:0.2 });
    /* 포물선 철사 — 꼭짓점을 원점으로 둔 모양(a=2)을 무리에 담고, z 축 배율로 a 를 바꾼다 */
    const V = B.P(2, 3, 0.15), ux = 0.52, uy = 0.27;
    const pts = [];
    for(let i = 0; i <= 80; i++){ const x = 0.05 + 3.9 * i / 80; pts.push(new THREE.Vector3((x - 2) * ux, 0, -2 * (x - 2) * (x - 2) * uy)); }
    const curve = new THREE.CatmullRomCurve3(pts);
    const wmat = k.metal('#b87333', 0.3);
    const para = new THREE.Group(); para.position.copy(V);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.03, 12), wmat); tube.castShadow = true; para.add(tube);
    scene.add(para);
    const pv = pin(k, B.P(2, 3, 0.17), '#c0392b', 0.085), pq = pin(k, B.P(4, 11, 0.17), '#2e6fb5', 0.085);
    /* 식 카드 — 시작하는 꼴 → 점을 넣은 식 → a */
    const c1 = mcard(k, ['y = a(x − 2)', { sup:'2' }, ' + 3'], 2.3, -1.05, { w:2.1, d:0.62, hmax:0.6, fill:0.92, rot:-0.03 });
    const c2 = mcard(k, ['11 = 4a + 3'], 2.35, -0.05, { w:1.9, d:0.58, hmax:0.52, rot:0.02 });
    const c3 = mcard(k, ['a = 2'], 2.35, 0.9, { w:1.3, d:0.58, hmax:0.56, rot:-0.02, edge:'#d9c49a', bg:'#f6e3b8' });
    /* 움직임: a 가 작아졌다 커졌다(꼭짓점은 그대로) → 파란 점 (4, 11)을 지나는 a = 2 에서 멈춘다 → 식 카드가 차례로 톡 */
    const y0 = [c1, c2, c3].map(c => c.position.y), qy = pq.position.y, vy = pv.position.y;
    k.onFrame(t => { const p = cyc(t, 9);
      const a = 2 - 1.3 * seg(p, 0.1, 0.28) + 2.2 * seg(p, 0.32, 0.5) - 0.9 * seg(p, 0.52, 0.64);
      para.scale.z = a / 2;
      pv.position.y = vy + 0.18 * hop(p, 0.02, 0.1);
      pq.position.y = qy + 0.22 * hop(p, 0.64, 0.74);
      c1.position.y = y0[0] + 0.18 * hop(p, 0.0, 0.1);
      c2.position.y = y0[1] + 0.18 * hop(p, 0.66, 0.78);
      c3.position.y = y0[2] + 0.2 * hop(p, 0.8, 0.92); });
    k.lights({ key:2.8, keyPos:[-4, 7, 5], spotPos:[0, 7, 2], spotAt:[0.3, 0, 0], envOpts:{ intensity:0.7 } });
  }},
};
