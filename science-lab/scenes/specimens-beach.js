// 자연관찰 연습 표본 — 「해변: 파도 닿는 젖은 모래와 마른 모래」(초등, 대회 날 현장 관찰). 원장 2026-10-27 「해변에도 관찰 지점 만들어」.
// 과제 꼴: 숲 바닥 세트와 같다 — 두 장소에서 같은 넓이(50 cm 네모 틀)를 같은 방법으로 보고, 찾은 것을 번호로 그리고 나누고, 비교한 결과로 까닭을 추정한 뒤 바다를 지키기 위해 할 수 있는 일을 쓴다.
// 장소 A = 파도가 닿는 젖은 모래 / 장소 B = 파도가 안 닿는 위쪽 마른 모래(밀물 때 밀려온 해초 줄 근처).
// 표본 4종(빈 껍데기): ① 바지락(두 장 · 가로·세로 줄 격자 · 안쪽 근육 자국 2개) ② 가리비(부채꼴 · 굵은 골 · 경첩 양쪽 귀 · 자국 1개) ③ 굴(층층이 겹친 울퉁불퉁 · 날카로움 · 자국 1개) ④ 고둥(한 장 · 나선으로 감김).
// 환경 확인: 모래알 크기(모눈 위 확대) · 물기(쥐었다 편 손) · 모래 속 온도 · 단단함(꼬챙이). 값은 그림으로만 보이고 아이가 읽어 적는다 — 모형 값이다.
// 모형은 코드로 만든 것이다. 이름은 「이름 확인」 전엔 번호로만.
import { THREE, mat, glossMat, label, clamp01, ease } from './_kit.js';
import { canvasTex, soilTex, rng, hex } from './_organic.js';
import { ruler } from './specimens-insects.js';

const DISH_R = 2.1, DISH_H = 0.12, TOP = DISH_H;
// count = 50 cm 네모 틀 안에서 찾은 껍데기 수 [①, ②, ③, ④] — 예시 보고서 표가 이 값과 같은지 테스트가 본다. grain = 모래알 지름(mm, 모눈 위에서 보이는 크기)
export const PLACES = {
  A: { id: 'A', name: '장소 A', where: '파도가 닿는 젖은 모래', sand: 0x9c8462, wet: 0.9, temp: 19, poke: 3, grain: 0.7, count: [5, 1, 0, 3] },
  B: { id: 'B', name: '장소 B', where: '파도가 안 닿는 위쪽 마른 모래', sand: 0xe2cfa2, wet: 0.05, temp: 34, poke: 9, grain: 0.3, count: [1, 3, 2, 1] },
};
export const PLACE_LIST = [PLACES.A, PLACES.B];

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
// 마디 칠하기용: 따로 쓴 재질과 처음 색
const keep = (m) => { m.userData.c0 = m.color.getHex(); return m; };

// ── 조개 껍데기 한 장(valve) ──
// 껍데기는 꼭지(각정, umbo)에서 자란다: 가장자리 m(v)를 꼭지 U에서 u배 늘인 줄이 u마다의 옛 가장자리 = 성장선이다.
// 점 P(u, v) = U + u·(m(v) − U). 높이는 가장자리 타원 안쪽일수록 볼록하고 꼭지가 조금 솟는다. 방사륵(세로 골)은 v 방향 물결.
function valveGeo({ A, B, H, ribs = 0, ribAmp = 0, umbo = 0.5, irr = 0, seed = 1, nu = 36, nv = 120 }) {
  const R = rng(seed), wob = Array.from({ length: 7 }, () => [R() * 2, R() * 6.28]);
  const phiU = Math.PI / 2, rad = (phi) => 1 + irr * wob.reduce((s, [a, p], k) => s + a * Math.sin((k + 2) * phi + p) / (k + 2), 0) * 0.5;
  const U = V3(A * Math.cos(phiU) * 0.94, 0, B * Math.sin(phiU) * 0.94);
  const edge = (v) => { const phi = phiU + 2 * Math.PI * v, r = rad(phi); return V3(A * Math.cos(phi) * r, 0, B * Math.sin(phi) * r); };
  const at = (u, v) => {
    const p = U.clone().lerp(edge(v), u), d2 = (p.x / A) ** 2 + (p.z / B) ** 2, rel = Math.min(1, d2 / rad(Math.atan2(p.z / B, p.x / A)) ** 2);
    let y = H * Math.pow(Math.max(0, 1 - rel), 0.5) + H * umbo * Math.exp(-p.distanceToSquared(U) / (0.22 * A) ** 2);
    if (ribs) y += ribAmp * Math.pow(u, 0.6) * Math.pow(0.5 + 0.5 * Math.cos(2 * Math.PI * ribs * v), 2) * Math.sin(Math.PI * v) ** 0.3;
    p.y = y; return p;
  };
  const g = surfGeo(at, nu, nv), idx = Array.from(g.index.array);
  // 바깥 면이 위(+y)를 보게 감기 방향을 맞춘다
  const n = g.attributes.normal; let s = 0; for (let k = 0; k < n.count; k += 7) s += n.getY(k);
  if (s < 0) { for (let k = 0; k < idx.length; k += 3) [idx[k + 1], idx[k + 2]] = [idx[k + 2], idx[k + 1]]; g.setIndex(idx); g.computeVertexNormals(); }
  return { geo: g, at, U, edge };
}
// 함수 at(u, v) → 점 으로 격자 면(uv = (v, u))
function surfGeo(at, nu = 30, nv = 120) {
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) { const p = at(i / nu, j / nv); pos.push(p.x, p.y, p.z); uv.push(j / nv, i / nu); }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + nv + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
// 성장선(가장자리와 나란한 줄)을 가는 관으로 — 「성장선 칠하기」로 한 줄씩 번갈아 칠한다
function growthLines(parent, at, us, color, r = 0.012) {
  const mats = [];
  for (const u of us) { const pts = Array.from({ length: 61 }, (_, k) => { const p = at(u, 0.02 + (k / 60) * 0.96); p.y += r + 0.004; return p; }); const m = keep(glossMat(color, { roughness: 0.6 })); const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, r, 5, false), m); t.castShadow = true; parent.add(t); mats.push(m); }
  return mats;
}
// 가장자리 두께(껍데기 테)
function rim(parent, at, color, r = 0.022) { const pts = Array.from({ length: 121 }, (_, k) => at(1, k / 120)); const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 160, r, 6, true), glossMat(color, { roughness: 0.55 })); parent.add(t); return t; }
// 바깥(무늬) · 안쪽(매끈, 근육 자국) 재질 한 쌍
function shellMats(outTex, inTex) {
  return [new THREE.MeshPhysicalMaterial({ map: outTex, roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.6, side: THREE.FrontSide }),
    new THREE.MeshPhysicalMaterial({ map: inTex, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.15, side: THREE.BackSide })];
}
const valveMesh = (geo, mats) => { const g = new THREE.Group(); for (const m of mats) { const o = new THREE.Mesh(geo, m); o.castShadow = true; o.receiveShadow = true; g.add(o); } return g; };
// 안쪽 질감: 바탕 + 근육 자국(scars = [[v, u, 크기]]) + 가장자리 쪽 색 띠. uv = (v 둘레, u 꼭지→가장자리)
function innerTex(key, base, edgeCol, scarCol, scars) {
  return canvasTex(key, 512, 256, (c, w, h) => {
    c.fillStyle = base; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, h * 0.7, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, edgeCol); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (const [v, u, s] of scars) { c.fillStyle = scarCol; c.globalAlpha = 0.85; c.beginPath(); c.ellipse(v * w, u * h, s * w * 0.6, s * h, 0, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1; c.strokeStyle = 'rgba(0,0,0,0.15)'; c.lineWidth = 2; c.stroke(); }
    // 외투막 자국(가는 선)
    c.strokeStyle = 'rgba(0,0,0,0.12)'; c.lineWidth = 3; c.setLineDash([10, 8]); c.beginPath(); c.moveTo(scars[0][0] * w, h * 0.8); c.bezierCurveTo(w * 0.4, h * 0.88, w * 0.6, h * 0.88, (scars.at(-1)[0]) * w, h * 0.8); c.stroke();
  });
}

// ① 바지락 — 두 장이 경첩으로 이어진 빈 껍데기. 가로(성장선)·세로(방사) 줄이 겹친 격자, 무늬는 개체마다 다르다. 안쪽 근육 자국 2개
function buildClam() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const out = canvasTex('clam-out', 512, 256, (c, w, h) => {
    c.fillStyle = '#b9a58a'; c.fillRect(0, 0, w, h); const r = rng(11);
    // 갈색 지그재그 무늬
    for (let i = 0; i < 26; i++) { const x = r() * w; c.strokeStyle = `rgba(70,50,40,${0.25 + r() * 0.3})`; c.lineWidth = 4 + r() * 8; c.beginPath(); c.moveTo(x, h * 0.1); for (let y = h * 0.1; y < h; y += 14) c.lineTo(x + ((y / 14) % 2 ? 9 : -9), y); c.stroke(); }
    // 가는 세로 줄(방사륵)
    c.strokeStyle = 'rgba(60,45,35,0.35)'; c.lineWidth = 1.2; for (let x = 0; x < w; x += 6) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    // 가는 가로 줄
    c.strokeStyle = 'rgba(255,245,225,0.45)'; c.lineWidth = 1.4; for (let y = 8; y < h; y += 7) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    // 굵은 성장 멈춤 띠
    for (const y of [0.32, 0.55, 0.74, 0.88]) { c.fillStyle = 'rgba(60,40,30,0.35)'; c.fillRect(0, y * h - 3, w, 6); }
  });
  const inn = innerTex('clam-in', '#eeeaf0', 'rgba(150,110,170,0.55)', 'rgba(170,140,180,0.9)', [[0.2, 0.62, 0.07], [0.8, 0.62, 0.08]]);
  const v = valveGeo({ A: 1.0, B: 0.74, H: 0.32, umbo: 0.45, seed: 3 }), mats = shellMats(out, inn);
  // 경첩(꼭지 U)을 축으로 위 껍데기가 열린다 — 축은 x 방향
  const hinge = new THREE.Group(); hinge.position.copy(v.U); body.add(hinge);
  const top = valveMesh(v.geo, mats); top.position.copy(v.U).multiplyScalar(-1); hinge.add(top);
  const segMats = growthLines(top, v.at, [0.32, 0.55, 0.74, 0.88], 0x6e5a48);
  top.add(rim(new THREE.Group(), v.at, 0xa8957a));
  const bot = valveMesh(v.geo, mats); bot.scale.y = -1; body.add(bot); bot.add(rim(new THREE.Group(), v.at, 0xa8957a));
  growthLines(bot, v.at, [0.32, 0.55, 0.74, 0.88], 0x6e5a48);
  // 인대(경첩의 검은 띠)
  const lig = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.32, 4, 8), glossMat(0x3a2a1e)); lig.rotation.z = Math.PI / 2; lig.position.set(-0.05, 0, v.U.z + 0.02); body.add(lig);
  body.position.y = 0.34; body.rotation.y = Math.PI;
  g.userData = { L: 2.0, body, segMats, topY: 0.7,
    poke: (t) => { const o = t < 0.3 ? ease.io(t / 0.3) : t > 0.8 ? 1 - ease.io((t - 0.8) / 0.2) : 1; hinge.rotation.x = 1.05 * o; } };
  return g;
}
// ② 가리비 — 부채꼴 한 장, 꼭지에서 퍼지는 굵은 골(방사륵) 20개, 경첩 양쪽에 귀 2개. 안쪽 근육 자국 1개(큰 관자)
function buildScallop() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const out = canvasTex('scal-out', 512, 256, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#c9765a'); gr.addColorStop(1, '#a8483a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); const r = rng(21);
    // 가로 색 띠(옅게)
    for (let y = 30; y < h; y += 46 + r() * 20) { c.fillStyle = `rgba(250,225,200,${0.18 + r() * 0.15})`; c.fillRect(0, y, w, 4 + r() * 5); }
    for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(255,240,220,0.4)'; c.beginPath(); c.ellipse(r() * w, r() * h, 6 + r() * 14, 3 + r() * 5, 0, 0, Math.PI * 2); c.fill(); }
    c.strokeStyle = 'rgba(80,30,20,0.25)'; c.lineWidth = 1; for (let y = 4; y < h; y += 4) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  });
  const inn = innerTex('scal-in', '#f4ede4', 'rgba(200,120,90,0.5)', 'rgba(205,150,120,0.95)', [[0.5, 0.5, 0.11]]);
  const v = valveGeo({ A: 1.0, B: 0.98, H: 0.17, ribs: 20, ribAmp: 0.1, umbo: 0.15, seed: 5 }), mats = shellMats(out, inn);
  const sh = valveMesh(v.geo, mats); body.add(sh);
  sh.add(rim(new THREE.Group(), v.at, 0xb45a44, 0.018));
  const segMats = growthLines(sh, v.at, [0.3, 0.5, 0.68, 0.84], 0x8a3a2a, 0.01);
  // 귀(이) 두 개: 꼭지 양옆의 납작한 날개
  for (const s of [-1, 1]) {
    const shp = new THREE.Shape(); shp.moveTo(0, 0); shp.lineTo(0.42 * s, 0.06); shp.lineTo(0.4 * s, -0.24); shp.lineTo(0.06 * s, -0.3); shp.closePath();
    const ear = new THREE.Mesh(new THREE.ShapeGeometry(shp), new THREE.MeshPhysicalMaterial({ map: out, roughness: 0.6, side: THREE.DoubleSide })); ear.rotation.x = Math.PI / 2; ear.position.set(0, 0.13, v.U.z + 0.02); ear.castShadow = true; body.add(ear);
  }
  body.position.y = 0.04; body.rotation.y = Math.PI * 0.8;
  // 손끝
  const tip = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.28, 4, 10), mat(0xf0c8a8)); tip.visible = false; g.add(tip);
  g.userData = { L: 2.0, body, segMats, topY: 0.35,
    poke: (t) => { tip.visible = t > 0.05 && t < 0.95; const a = clamp01((t - 0.1) / 0.8); tip.position.set(-0.85 + 1.7 * a, 0.42 + 0.03 * Math.abs(Math.sin(a * 10 * Math.PI)), -0.1); tip.rotation.set(0.6, 0, 0); } };
  return g;
}
// ③ 굴 — 일정하지 않은 길쭉한 모양, 얇은 층이 겹겹이 일어나 있다(가장자리가 날카롭다). 안쪽 흰색, 근육 자국 1개(보라빛)
function buildOyster() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const out = canvasTex('oys-out', 512, 256, (c, w, h) => {
    c.fillStyle = '#a9a3a0'; c.fillRect(0, 0, w, h); const r = rng(31);
    for (let i = 0; i < 300; i++) { c.fillStyle = r() < 0.5 ? `rgba(60,50,60,${0.15 + r() * 0.25})` : `rgba(235,230,225,${0.15 + r() * 0.3})`; c.beginPath(); c.ellipse(r() * w, r() * h, 4 + r() * 18, 2 + r() * 5, 0, 0, Math.PI * 2); c.fill(); }
    for (let y = 14; y < h; y += 16 + r() * 10) { c.strokeStyle = `rgba(110,80,110,${0.18 + r() * 0.2})`; c.lineWidth = 1.5 + r() * 2; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= w; x += 16) c.lineTo(x, y + Math.sin(x * 0.05 + y) * 3); c.stroke(); }
  });
  const inn = innerTex('oys-in', '#f2efe9', 'rgba(120,100,120,0.45)', 'rgba(110,70,120,0.9)', [[0.62, 0.55, 0.08]]);
  // 층(성장 층) 5장: 껍데기는 안쪽에 새 층을 덧대며 가장자리로 커진다 — 그래서 겉에서는 꼭지 쪽 작은 층(옛 층)이 위에, 가장 큰 층(최근 층)이 맨 아래에 기왓장처럼 보인다.
  // 층마다 가장자리 물결이 조금씩 다르고(seed), 굵은 주름(ribs)이 있어 테가 프릴처럼 일어난다.
  const segMats = [], base = valveGeo({ A: 0.72, B: 1.18, H: 0.26, ribs: 7, ribAmp: 0.07, umbo: 0.25, irr: 0.6, seed: 9 }), layers = [1, 0.82, 0.65, 0.49, 0.34];
  // 위층 = 바닥 층 표면 중 꼭지 쪽(u ≤ sc) 부분을 조금 들어 올린 것 — 그래서 층이 표면을 따라 기왓장처럼 얹힌다. 테는 물결처럼 일어난다.
  const lifted = (sc, lift) => (u, v) => { const p = base.at(u * sc, v); p.y += lift * (0.35 + 0.65 * u) + 0.025 * u ** 3 * Math.sin(2 * Math.PI * 9 * v); return p; };
  layers.forEach((sc, k) => {
    const at = k ? lifted(sc, 0.045 * k) : base.at, geo = k ? surfGeo(at) : base.geo;
    const m = keep(new THREE.MeshPhysicalMaterial({ map: out, roughness: 0.8, side: k ? THREE.DoubleSide : THREE.FrontSide, color: new THREE.Color().setHSL(0.8, 0.05, 0.6 + k * 0.06) }));
    const lay = new THREE.Mesh(geo, m); lay.castShadow = true; lay.receiveShadow = true; body.add(lay); segMats.push(m);
    const edge = rim(body, at, 0x8a7f80, 0.026); edge.material = m;
    if (!k) body.add(new THREE.Mesh(base.geo, new THREE.MeshPhysicalMaterial({ map: inn, roughness: 0.3, clearcoat: 0.6, side: THREE.BackSide })));
  });
  body.position.y = 0.05; body.rotation.y = Math.PI * 0.55;
  const tip = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.28, 4, 10), mat(0xf0c8a8)); tip.visible = false; g.add(tip);
  g.userData = { L: 2.4, body, segMats, topY: 0.4,
    poke: (t) => { tip.visible = t > 0.05 && t < 0.95; const a = clamp01((t - 0.1) / 0.8); tip.position.set(-0.9 + 1.8 * a, 0.44 + 0.05 * Math.abs(Math.sin(a * 5 * Math.PI)), 0.15); tip.rotation.set(0.5, 0, 0); body.position.x = 0.015 * Math.sin(t * 80) * (t < 0.9 ? 1 : 0); } };
  return g;
}
// ④ 고둥 — 껍데기 한 장이 나선으로 감겼다(꼭지 → 입구로 갈수록 굵어진다). 한 바퀴(나층)마다 따로 칠할 수 있다
function buildSnail() {
  const g = new THREE.Group(), body = new THREE.Group(), coil = new THREE.Group(); g.add(body); body.add(coil);
  const tex = canvasTex('snail', 256, 128, (c, w, h) => { c.fillStyle = '#7a5a3e'; c.fillRect(0, 0, w, h); const r = rng(41); for (let i = 0; i < 5; i++) { c.fillStyle = `rgba(${i % 2 ? '40,28,20' : '230,210,170'},0.45)`; c.fillRect(0, (0.12 + i * 0.18) * h, w, 0.06 * h); } for (let x = 0; x < w; x += 5 + r() * 6) { c.strokeStyle = 'rgba(30,20,10,0.25)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 3, h); c.stroke(); } });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const turns = 5, r0 = 0.025, rEnd = 0.45, b = Math.log(rEnd / r0) / (turns * 2 * Math.PI), RHO = 0.8, C = 1.7;
  const ctr = (s) => { const R = r0 * Math.exp(b * s); return V3(R * Math.cos(s), -C * (R - r0), R * Math.sin(s)); };
  const segMats = [], nTh = 18, per = 40;
  for (let k = 0; k < Math.ceil(turns); k++) {
    const s0 = k * 2 * Math.PI, s1 = Math.min(turns, k + 1) * 2 * Math.PI, n = Math.max(4, Math.round(per * (s1 - s0) / (2 * Math.PI)));
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * (i / n), R = r0 * Math.exp(b * s), c0 = ctr(s), T = ctr(s + 0.01).sub(c0).normalize(), N = V3(-Math.cos(s), 0, -Math.sin(s)), B = new THREE.Vector3().crossVectors(T, N).normalize(); N.crossVectors(B, T).normalize();
      for (let j = 0; j <= nTh; j++) { const th = (j / nTh) * Math.PI * 2, p = c0.clone().addScaledVector(N, Math.cos(th) * RHO * R).addScaledVector(B, Math.sin(th) * RHO * R); pos.push(p.x, p.y, p.z); uv.push(s / (2 * Math.PI) * 3, j / nTh); }
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < nTh; j++) { const a = i * (nTh + 1) + j, c = a + nTh + 1; idx.push(a, c, a + 1, c, c + 1, a + 1); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    const m = keep(new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.3, side: THREE.DoubleSide })); const o = new THREE.Mesh(geo, m); o.castShadow = true; o.receiveShadow = true; coil.add(o); segMats.push(m);
  }
  // 입구 테(입술): 마지막 단면 둘레
  { const s = turns * 2 * Math.PI, R = r0 * Math.exp(b * s), c0 = ctr(s), T = ctr(s + 0.01).sub(c0).normalize(); const lip = new THREE.Mesh(new THREE.TorusGeometry(RHO * R, 0.03, 8, 30), glossMat(0xe8d6b8, { roughness: 0.3 })); lip.position.copy(c0); lip.lookAt(c0.clone().add(T)); coil.add(lip);
    const inside = new THREE.Mesh(new THREE.CircleGeometry(RHO * R * 0.95, 30), mat(0x3a2418, { side: THREE.DoubleSide })); inside.position.copy(c0).addScaledVector(T, -0.04); inside.lookAt(c0.clone().add(T)); coil.add(inside); }
  // 눕힌다: 꼭지가 +x, 입구가 아래(모래 쪽)
  const box = new THREE.Box3().setFromObject(coil), cy = (box.min.y + box.max.y) / 2; coil.position.y = -cy; body.rotation.z = -Math.PI / 2 + 0.25;
  // 쟁반에 닿게
  body.updateMatrixWorld(true); const lie = -new THREE.Box3().setFromObject(body).min.y; body.position.y = lie;
  g.userData = { L: (box.max.y - box.min.y) + 0.1, body, segMats, topY: 2 * lie,
    poke: (t) => { const o = t < 0.3 ? ease.io(t / 0.3) : t > 0.8 ? 1 - ease.io((t - 0.8) / 0.2) : 1; body.rotation.x = Math.PI * 0.85 * o; body.position.y = lie + 0.2 * Math.sin(Math.PI * o); } };
  return g;
}

const SPECS = [
  { id: 'clam', no: '①', name: '바지락', hint: '두 장이 붙은 둥근 껍데기, 격자 무늬', place: 'A', cm: 4, build: buildClam, pokeName: '👐 두 장 벌려 보기',
    think: ['껍데기는 몇 장인가요? 두 장은 어디에서 이어져 있나요?', '겉에 가로 줄과 세로 줄이 모두 있나요? 가장자리와 나란한 굵은 줄(성장선)은 몇 개인가요?', '안쪽의 동그란 자국은 몇 개인가요? 「뒤집어 보기」로 보세요.'],
    notes: { poke: '두 장이 한쪽(경첩)에서 검은 띠로 이어져 있어요. 살아 있는 조개는 꼭 닫고 있어서 손으로 안 열려요 — 살아 있으면 모래에 다시 묻어 줘요.', flip: '안쪽은 매끈하고 연보라빛이에요. 동그란 자국(근육 자국)이 양쪽 끝에 하나씩, 두 개 있어요 — 껍데기를 닫는 근육이 붙었던 자리예요.' } },
  { id: 'scallop', no: '②', name: '가리비', hint: '부채 모양, 굵은 골이 퍼져 있다', place: 'B', cm: 6, build: buildScallop, pokeName: '👆 손끝으로 쓸어 보기',
    think: ['꼭지에서 부채살처럼 퍼진 굵은 골은 몇 개인가요?', '꼭지 양옆에 삐죽 나온 것(귀)은 ①에도 있나요?', '안쪽 근육 자국은 몇 개인가요? ①과 같나요?'],
    notes: { poke: '골과 마루가 손끝에 오돌토돌 걸려요. 골이 몇 줄인지 손끝으로 세어 보세요.', flip: '안쪽 가운데에 큰 동그란 자국이 하나 있어요 — 우리가 먹는 「관자」가 붙었던 자리예요. 가리비는 두 장을 빠르게 여닫아 물을 뿜으며 헤엄쳐요.' } },
  { id: 'oyster', no: '③', name: '굴', hint: '울퉁불퉁 일정하지 않은 모양, 층이 겹겹이', place: 'B', cm: 7, build: buildOyster, pokeName: '🧤 장갑 끼고 쓸어 보기',
    think: ['모양이 ①·②처럼 일정한가요?', '얇은 층은 몇 겹으로 보이나요? 「층 칠하기」로 세어 보세요.', '가장자리를 맨손으로 만져도 될까요?'],
    notes: { poke: '얇은 층이 겹겹이 일어나 있어 거칠고, 가장자리가 칼처럼 날카로워요 — 굴 껍데기는 꼭 장갑을 끼고 만져요.', flip: '안쪽은 하얗고 매끈해요. 보랏빛 근육 자국이 하나 있어요. 굴은 한쪽 껍데기로 바위에 붙어 살아서 바위 모양을 따라 껍데기 모양이 제각각이에요.' } },
  { id: 'snail', no: '④', name: '고둥', hint: '한 장, 돌돌 감긴 원뿔', place: 'A', cm: 2.5, build: buildSnail, pokeName: '🔄 입구 쪽 보기',
    think: ['껍데기는 몇 장인가요? ①~③과 무엇이 다른가요?', '꼭지에서 입구까지 몇 바퀴 감겼나요? 「바퀴 칠하기」로 세어 보세요.', '꼭지를 위로, 입구를 나에게 향하게 들면 입구는 오른쪽에 있나요, 왼쪽에 있나요?'],
    notes: { poke: '입구는 동그랗고 안쪽은 어두워요. 빈 껍데기에 소라게가 들어가 살기도 해요 — 무언가 움직이면 제자리에 놓아 줘요.', flip: '꼭지는 뾰족하고, 입구 쪽으로 갈수록 한 바퀴가 굵어져요. 몸이 자라며 입구 쪽에 껍데기를 덧붙여 가기 때문이에요.' } },
];
export const SPECIMENS = SPECS.map((s) => () => s);
export const VIEWS = { angle: { theta: 0.55, phi: 1.05, name: '비스듬히' }, top: { theta: 0.15, phi: 0.3, name: '위에서 본 모습' }, side: { theta: 0, phi: 1.45, name: '옆에서 본 모습' } };
export const TOOLS = [{ id: 'ruler', name: '📏 자 대기' }, { id: 'seg', name: '🎨 줄·층·바퀴 칠하기' }];

// 그림 카드(캔버스) — 모래알 · 쥔 손 · 온도계 · 꼬챙이. 숫자는 눈금으로만 보인다(아이가 읽는다)
function card(draw, w = 1.6, h = 1.9) {
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 380; const c = cv.getContext('2d');
  c.fillStyle = '#fffaf0'; c.fillRect(0, 0, 320, 380); c.strokeStyle = '#8a7a60'; c.lineWidth = 3; c.strokeRect(2, 2, 316, 376); draw(c);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); m.userData.noFrame = true; return m;
}
const title = (c, t) => { c.fillStyle = '#2b2b2b'; c.font = '700 19px Pretendard, sans-serif'; c.textAlign = 'center'; c.fillText(t, 160, 34); };
// 모래알: 1 mm 모눈 위에 돋보기로 본 알갱이(지름 = P.grain mm)
function grainCard(P) {
  return card((c) => {
    title(c, `${P.name} 모래알(돋보기 · 1 mm 모눈)`);
    const X = 30, Y = 60, px = 26, n = 10;
    c.strokeStyle = '#b8c8d8'; c.lineWidth = 1; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(X + i * px, Y); c.lineTo(X + i * px, Y + n * px); c.stroke(); c.beginPath(); c.moveTo(X, Y + i * px); c.lineTo(X + n * px, Y + i * px); c.stroke(); }
    c.strokeStyle = '#5a7a9a'; c.lineWidth = 2; c.strokeRect(X, Y, n * px, n * px);
    const R = rng(P.id === 'A' ? 61 : 62), cols = ['#c9b48a', '#e6d7b4', '#a8916a', '#f3ead6', '#8a7660', '#d9c8a6'];
    for (let i = 0; i < (P.id === 'A' ? 90 : 360); i++) { const d = P.grain * px * (0.75 + R() * 0.5), x = X + d / 2 + R() * (n * px - d), y = Y + d / 2 + R() * (n * px - d); c.fillStyle = cols[i % cols.length]; c.strokeStyle = 'rgba(60,45,30,0.45)'; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, d / 2, d / 2 * (0.75 + R() * 0.25), R() * 3, 0, Math.PI * 2); c.fill(); c.stroke(); }
    c.fillStyle = '#2b2b2b'; c.font = '700 14px Pretendard, sans-serif'; c.textAlign = 'left'; c.fillText('← 한 칸 = 1 mm', X, Y + n * px + 24);
  });
}
// 모래를 3초 쥐었다 편 손: 젖으면 덩어리로 남고, 마르면 다 흘러내린다
function handCard(P) {
  return card((c) => {
    title(c, `${P.name} 모래 쥐었다 펴기`);
    c.fillStyle = '#f2d2b6'; c.strokeStyle = '#8a6a50'; c.lineWidth = 3;
    c.beginPath(); c.ellipse(160, 240, 82, 92, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    for (const [x, y, w, h, a] of [[92, 150, 20, 66, -0.35], [132, 124, 20, 76, -0.1], [172, 120, 20, 78, 0.05], [212, 140, 19, 68, 0.3], [244, 240, 18, 56, 1.0]]) { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 9); c.fill(); c.stroke(); c.restore(); }
    const R = rng(P.id === 'A' ? 71 : 72);
    // 손가락 자국 난 덩어리
    if (P.wet > 0.5) { c.fillStyle = '#9a8262'; c.strokeStyle = '#6a5640'; c.lineWidth = 2; c.beginPath(); c.ellipse(160, 245, 56, 40, -0.2, 0, Math.PI * 2); c.fill(); c.stroke(); c.strokeStyle = 'rgba(60,45,30,0.5)'; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(120 + i * 22, 225); c.quadraticCurveTo(130 + i * 22, 245, 122 + i * 22, 270); c.stroke(); } }
    c.fillStyle = P.wet > 0.5 ? '#8a7254' : '#d9c49a'; for (let i = 0; i < (P.wet > 0.5 ? 120 : 14); i++) { const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 74; c.beginPath(); c.arc(160 + Math.cos(a) * r, 240 + Math.sin(a) * r * 1.1, 1.5 + (i % 3) * 0.8, 0, Math.PI * 2); c.fill(); }
  });
}
function thermoCard(P) {
  return card((c) => {
    title(c, '모래 속 5 cm 온도(℃)');
    const x = 150, top = 60, px = 6.5, y0 = top + 40 * px;
    c.fillStyle = '#ffffff'; c.strokeStyle = '#555'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - 10, top - 10, 20, 40 * px + 20, 10); c.fill(); c.stroke(); c.beginPath(); c.arc(x, y0 + 22, 18, 0, Math.PI * 2); c.fillStyle = '#d0342c'; c.fill(); c.stroke();
    c.fillStyle = '#d0342c'; c.fillRect(x - 4, y0 - P.temp * px, 8, P.temp * px + 12);
    c.strokeStyle = '#2b2b2b'; c.lineWidth = 2; c.font = '700 15px Pretendard, sans-serif'; c.textAlign = 'left'; for (let i = 0; i <= 40; i++) { const y = y0 - i * px; c.beginPath(); c.moveTo(x + 12, y); c.lineTo(x + 12 + (i % 5 ? 7 : 15), y); c.stroke(); if (i % 10 === 0) c.fillText(String(i), x + 34, y + 5); }
  });
}
function stickCard(P) {
  return card((c) => {
    title(c, '같은 힘으로 꼬챙이 누르기');
    const ground = 150, px = 18, x = 170;
    c.fillStyle = hex(P.sand); c.fillRect(20, ground, 280, 210);
    c.fillStyle = '#d8b878'; c.strokeStyle = '#6a5030'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 7, 60); c.lineTo(x + 7, 60); c.lineTo(x + 7, ground + P.poke * px - 14); c.lineTo(x, ground + P.poke * px); c.lineTo(x - 7, ground + P.poke * px - 14); c.closePath(); c.fill(); c.stroke();
    c.lineWidth = 2; c.font = '700 14px Pretendard, sans-serif'; c.textAlign = 'right'; c.fillStyle = '#2b2b2b'; for (let i = 0; i <= 10; i++) { const y = ground + i * px; c.beginPath(); c.moveTo(x - 7, y); c.lineTo(x - 7 - (i % 5 ? 6 : 12), y); c.strokeStyle = '#2b2b2b'; c.stroke(); if (i % 5 === 0) c.fillText(String(i), x - 24, y + 5); }
    c.textAlign = 'left'; c.fillText('모래 표면 = 0 cm', 24, ground - 8);
  });
}
// 50 cm 네모 틀 — 그 안에서 찾은 껍데기(작은 모양). 세는 것은 아이가 한다
function quadrat(P) {
  const g = new THREE.Group(), S = 3.8, R = rng(P.id === 'A' ? 17 : 18);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(S, S), new THREE.MeshStandardMaterial({ map: soilTex('bq:' + P.id, hex(P.sand), 12), roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.16; floor.receiveShadow = true; g.add(floor);
  for (const [x, z, w, d] of [[0, -S / 2, S + 0.1, 0.06], [0, S / 2, S + 0.1, 0.06], [-S / 2, 0, 0.06, S], [S / 2, 0, 0.06, S]]) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d), mat(0xe0b860)); b.position.set(x, 0.19, z); g.add(b); }
  const fan = (col, ribbed) => { const m = new THREE.Mesh(new THREE.CircleGeometry(0.16, 14, Math.PI * 0.15, Math.PI * 0.7), glossMat(col, { side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; if (ribbed) m.scale.set(1, 1, 1); return m; };
  const tok = [
    () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), glossMat(0xb9a58a)); m.scale.set(1, 0.4, 0.75); return m; },
    () => { const t = new THREE.Group(), f = fan(0xc06a50, true); f.position.z = 0.08; t.add(f); return t; },
    () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), glossMat(0x8f8a86)); m.scale.set(0.8, 0.25, 1.3); return m; },
    () => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 10), glossMat(0x7a5a3e)); m.rotation.z = Math.PI / 2; return m; },
  ];
  P.count.forEach((n, k) => { for (let i = 0; i < n; i++) { const t = tok[k](), h = new THREE.Group(); h.add(t); h.position.set((R() - 0.5) * (S - 0.5), 0.2, (R() - 0.5) * (S - 0.5)); h.rotation.y = R() * Math.PI * 2; h.scale.setScalar(2.1); g.add(h); } });
  const tag = label('50 cm × 50 cm 틀 — 모래 위와 겉흙 속', { size: 0.26 }); tag.position.set(0, 0.7, -S / 2 - 0.1); g.add(tag);
  g.traverse((o) => { o.userData.noFrame = true; }); return g;
}

function habitat(place) {
  const P = PLACES[place], g = new THREE.Group(), R = rng(place === 'A' ? 13 : 14), d = new THREE.Object3D(), col = new THREE.Color();
  const st = soilTex('beach-sand:' + place, hex(P.sand), place === 'A' ? 22 : 23); st.repeat.set(5, 5);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(5.2, 48), new THREE.MeshStandardMaterial({ map: st, roughness: place === 'A' ? 0.45 : 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; g.add(ground);
  const away = (rMin = 2.35) => { let x, z; do { const a = R() * Math.PI * 2, r = rMin + Math.sqrt(R()) * (5 - rMin); x = Math.cos(a) * r; z = Math.sin(a) * r; } while (Math.hypot(x, z) < DISH_R + 0.25); return [x, z]; };
  // 깨진 조개 조각(두 장소 모두)
  const bits = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), glossMat(0xffffff), 50);
  for (let i = 0; i < 50; i++) { const [x, z] = away(); d.position.set(x, 0.005, z); d.rotation.set(0, R() * 6, 0); d.scale.set(0.5 + R() * 0.9, 0.3, 0.4 + R() * 0.6); d.updateMatrix(); bits.setMatrixAt(i, d.matrix); bits.setColorAt(i, col.setHSL(0.08 + R() * 0.04, 0.2 + R() * 0.2, 0.6 + R() * 0.3)); } bits.castShadow = true; g.add(bits);
  if (place === 'A') {
    // 바다 쪽(−x): 얇은 물막과 흰 거품 줄, 젖은 모래의 번들거림
    const sea = new THREE.Mesh(new THREE.CircleGeometry(5.3, 48, Math.PI * 0.62, Math.PI * 0.76), new THREE.MeshPhysicalMaterial({ color: 0x3f8fa0, roughness: 0.08, transmission: 0.2, transparent: true, opacity: 0.72 })); sea.rotation.x = -Math.PI / 2; sea.position.set(-1.8, 0.02, 0); g.add(sea);
    const foam = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.08, 6, 48, Math.PI * 0.62), mat(0xf4f8f8, { roughness: 0.5 })); foam.rotation.set(Math.PI / 2, 0, Math.PI * 0.69); foam.scale.set(1, 1, 0.2); foam.position.set(-0.4, 0.03, 0); g.add(foam);
    // 파도: 물이 밀려왔다 빠지며 거품 줄이 모래 쪽으로 올라왔다 내려간다(밀려올 때 빠르고 빠질 때 느리게)
    g.userData.tick = (t) => { const p = (t / 6) % 1, x = p < 0.35 ? Math.sin((p / 0.35) * Math.PI / 2) : Math.cos(((p - 0.35) / 0.65) * Math.PI / 2); sea.position.x = -2.3 + 0.75 * x; foam.position.x = -0.9 + 0.75 * x; foam.material.opacity = 0.55 + 0.45 * x; };
    foam.material.transparent = true;
    // 모래 속 조개가 숨 쉰 작은 구멍
    const hole = new THREE.InstancedMesh(new THREE.CircleGeometry(0.035, 10), mat(0x3a2e22), 18); for (let i = 0; i < 18; i++) { const [x, z] = away(); d.position.set(Math.abs(x) * 0.6, 0.006, z); d.rotation.set(-Math.PI / 2, 0, 0); d.scale.setScalar(1); d.updateMatrix(); hole.setMatrixAt(i, d.matrix); } g.add(hole);
  } else {
    // 바람이 만든 물결 무늬 + 밀물 때 밀려온 해초 줄 + 발자국 + 갯그령 몇 포기
    const rip = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.03, 2.4, 3, 6), mat(0xcdb98a, { roughness: 1 }), 26); for (let i = 0; i < 26; i++) { const x = -4.6 + i * 0.36, z = (R() - 0.5) * 6; if (Math.hypot(x, z) < DISH_R + 0.4 || Math.hypot(x, z) > 5) { d.scale.setScalar(0); } else d.scale.set(1, 1, 1); d.position.set(x, 0.0, z); d.rotation.set(Math.PI / 2, 0, 0.1); d.updateMatrix(); rip.setMatrixAt(i, d.matrix); } g.add(rip);
    const weed = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.035, 0.5, 3, 6), mat(0x3d3a1c, { roughness: 0.6 }), 90); for (let i = 0; i < 90; i++) { const a = -Math.PI * 0.35 + R() * Math.PI * 0.7, r = 3.2 + R() * 0.6; d.position.set(-Math.cos(a) * r, 0.03, Math.sin(a) * r); d.rotation.set(Math.PI / 2, 0, R() * 6); d.scale.setScalar(0.7 + R() * 0.8); d.updateMatrix(); weed.setMatrixAt(i, d.matrix); weed.setColorAt(i, col.setHSL(0.12 + R() * 0.06, 0.4, 0.14 + R() * 0.1)); } g.add(weed);
    const fp = new THREE.InstancedMesh(new THREE.CircleGeometry(0.2, 16), mat(0xc8b282, { roughness: 1 }), 12); for (let i = 0; i < 12; i++) { const x = 2.6 + (i % 2 ? 0.35 : -0.35), z = -4 + i * 0.7; d.position.set(x, 0.006, z); d.rotation.set(-Math.PI / 2, 0, 0); d.scale.set(0.7, 1.4, 1); d.updateMatrix(); fp.setMatrixAt(i, d.matrix); } g.add(fp);
    const blade = new THREE.PlaneGeometry(0.05, 1, 1, 2); blade.translate(0, 0.5, 0); const gr = new THREE.InstancedMesh(blade, mat(0x8aa860, { side: THREE.DoubleSide }), 90); for (let i = 0; i < 90; i++) { const a = R() * 1.2 + 0.1, r = 4.3 + R() * 0.8; d.position.set(Math.cos(a) * r, 0, -Math.sin(a) * r); d.rotation.set((R() - 0.5) * 0.6, R() * 3, 0); d.scale.set(1, 0.4 + R() * 0.5, 1); d.updateMatrix(); gr.setMatrixAt(i, d.matrix); } g.add(gr);
    const sun = label('☀', { size: 0.9, bg: 'rgba(255,230,140,0.95)', color: '#b8860b' }); sun.position.set(3.2, 5, -2); g.add(sun);
  }
  const tag = label(`${P.name} · ${P.where}`, { size: 0.3 }); tag.position.set(-DISH_R - 0.3, TOP + 0.9, 0.2); g.add(tag); g.userData.tag = tag;
  // 껍데기가 흰빛이라 검은 쟁반
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(DISH_R, DISH_R * 0.92, DISH_H, 48), mat(0x2f3a44, { roughness: 0.85 })); dish.position.y = DISH_H / 2; dish.receiveShadow = true; dish.castShadow = true; g.add(dish);
  const rimM = new THREE.Mesh(new THREE.TorusGeometry(DISH_R, 0.05, 10, 64), glossMat(0x2e3b46)); rimM.rotation.x = Math.PI / 2; rimM.position.y = DISH_H; g.add(rimM);
  g.traverse((o) => { o.userData.noFrame = true; });
  const at = (m, x, y, z) => { m.position.set(x, y, z); m.lookAt(x * 0.5, y, 8); m.scale.setScalar(0.8); m.visible = false; g.add(m); return m; };
  const quad = quadrat(P); quad.visible = false; g.add(quad);
  g.userData = { ...g.userData, P, quad, tag, dish: [dish, rimM], grain: at(grainCard(P), 1.0, 0.95, 1.6), hand: at(handCard(P), 1.0, 0.95, 1.6), thermo: at(thermoCard(P), 1.0, 0.95, 1.6), stick: at(stickCard(P), 1.0, 0.95, 1.6) };
  return g;
}

// 무대에 껍데기 하나를 올린다. 돌려주는 것: { spec, run(id), setView(id), toggle(id, on), setPlace(id), actions() }
export function mountSpecimen(stage, make) {
  stage.clear();
  const spec = make(), ani = spec.build(), base = new THREE.Group(); stage.root.add(base);
  let hab = null, placeId = spec.place;
  const setPlace = (id) => { if (hab) { base.remove(hab); hab.traverse((o) => { o.geometry?.dispose?.(); }); } placeId = id; hab = habitat(id); base.add(hab); stage._needFit = true; };
  setPlace(placeId);
  ani.position.y = TOP; base.add(ani);
  const U = ani.userData, rl = ruler(spec.cm / U.L, Math.ceil(spec.cm * 1.3)); rl.position.set(0, TOP + 0.02, 1.25); rl.visible = false; base.add(rl);
  const show = (key) => (t) => { const h = hab.userData; for (const k of ['grain', 'hand', 'thermo', 'stick']) { h[k].visible = k === key && t > 0.08 && t < 0.98; if (h[k].visible) h[k].quaternion.copy(stage.camera.quaternion); } };
  const actions = {
    poke: { name: spec.pokeName, dur: 3.6, note: spec.notes.poke, step: (t) => U.poke(t) },
    flip: { name: '🔄 뒤집어 안쪽 보기', dur: 4, note: spec.notes.flip, step: (t) => { const o = t < 0.25 ? ease.io(t / 0.25) : t > 0.75 ? 1 - ease.io((t - 0.75) / 0.25) : 1; ani.rotation.x = Math.PI * o; ani.position.y = TOP + U.topY * 1.6 * Math.sin(Math.PI * o) + U.topY * o; } },
    find: { name: '🔎 틀 안의 껍데기 찾기(50 cm 틀)', dur: 7, env: true, note: '같은 넓이(50 cm × 50 cm) 틀 안에서 모래 위와 겉흙(손가락 한 마디 깊이)의 껍데기를 찾아 종류별로 세어 표에 적어요. 두 장소에서 같은 방법으로 세야 비교가 돼요.', step: (t) => { const on = t > 0.05 && t < 0.99, h = hab.userData; if (on === h.quad.visible) return; h.quad.visible = on; ani.visible = !on; h.tag.visible = !on; h.dish.forEach((m) => { m.visible = !on; });
      // 세는 동안은 틀 전체가 보이게 위에서 내려다본다(틀은 맞춤 계산에서 빠지는 물체라 frame으로 넓이를 준다)
      if (on) stage.setView({ theta: 0.1, phi: 0.45, dist: 8, target: [0, 0.2, 0], frame: [[-2.1, 0, -2.3], [2.1, 0.4, 2.1]] }); else api.setView(view); } },
    grain: { name: '🔍 모래알 확대(모눈)', dur: 6, env: true, note: '모래를 1 mm 모눈종이에 얇게 뿌리고 돋보기로 봐요. 한 알이 한 칸의 얼마만 한지 어림해 적어요.', step: show('grain') },
    soil: { name: '✋ 모래 쥐어 보기', dur: 5, env: true, note: '모래를 3초 쥐었다 폈을 때 손에 남은 것을 보세요. 덩어리로 남으면 물기가 많은 거예요.', step: show('hand') },
    temp: { name: '🌡 모래 온도 재기', dur: 6, env: true, note: '온도계를 모래 속 5 cm에 꽂고 1분 기다렸다 눈금을 읽어요. 두 장소를 같은 시각, 같은 깊이로 재요.', step: show('thermo') },
    stick: { name: '🪵 꼬챙이 꽂기(단단함)', dur: 6, env: true, note: '같은 꼬챙이를 같은 힘으로 눌러 들어간 깊이를 읽어요. 깊이 들어갈수록 모래가 무른 거예요.', step: show('stick') },
  };
  let running = null, view = 'angle';
  const finish = () => { if (!running) return; running.a.step(1); running = null; };
  let clock = 0;
  stage.update = (dt) => { clock += dt; hab.userData.tick?.(clock); if (!running) return; running.t += dt / running.a.dur; running.a.step(clamp01(running.t)); if (running.t >= 1) finish(); };
  const api = {
    spec, places: PLACE_LIST, place: () => placeId,
    actions: () => Object.entries(actions).map(([id, a]) => ({ id, name: a.name, env: !!a.env })),
    run(id) { const a = actions[id]; if (!a) return null; finish(); running = { a, t: 0 }; return a.note; },
    setView(id) { view = id; const v = VIEWS[id] || VIEWS.angle; stage.setView({ theta: v.theta, phi: v.phi, dist: 8, target: [0, 0.5, 0] }); },
    toggle(what, on) { if (what === 'ruler') rl.visible = on; if (what === 'seg') U.segMats.forEach((m, i) => m.color.setHex(on && i % 2 === 0 ? 0xf0c040 : on ? 0x3a7ac8 : m.userData.c0)); stage._needFit = true; },
    toolNote: () => spec.id === 'snail' ? '꼭지에서 입구까지 한 바퀴씩 번갈아 칠했어요. 모두 몇 바퀴인가요?' : spec.id === 'oyster' ? '겹친 층을 하나씩 번갈아 칠했어요. 몇 겹인가요? 가장 큰 층은 가장 먼저 생겼을까요, 나중에 생겼을까요?' : '가장자리와 나란한 굵은 줄(성장선)을 번갈아 칠했어요. 몇 줄인가요? 꼭지 쪽과 가장자리 쪽 중 어디가 먼저 자란 곳일까요?',
    setPlace, dispose() { finish(); },
  };
  api.setView('angle');
  return api;
}
export const _specs = SPECS;
