// 4-1 Ⅱ 물의 상태 변화 — 얼음 병 저울: 물이 얼면 부피는 늘고 무게는 그대로, 녹으면 부피가 다시 줄어든다
// 병은 LatheGeometry(바닥 굴곡·몸통·홈·어깨·목·나사선·뚜껑), 물은 병 속 모양을 따라 차고,
// 얼음이 되면 하얗게 서리가 끼고 윗면이 살짝 볼록해진다. 무게는 전자저울 LCD 에 직접 찍힌다.
import { PALETTE as P, label, relabel, arrow, THREE, mat, lerp, clamp01, roundedBoxGeometry } from './_kit.js';

const R = 0.55, H = 2.2, FILL = 0.5, GROW = 1.1;         // 병 반지름·높이, 처음 물 높이 비율, 얼 때 부피 배율
const ICE = 0xd6eaf7;
const PAN_Y = 0.55;                                       // 저울 접시 윗면 = 병 바닥
const RW = R - 0.02;                                      // 병 속(물) 반지름
const SEG = 40;                                           // 회전체 분할(휴대폰에서도 가볍게)
const V2 = (x, y) => new THREE.Vector2(x, y);

// 병 바깥 윤곽(반지름, 높이) — 바닥 가운데가 안으로 솟은 굴곡 → 몸통 → 잡는 홈 두 줄 → 어깨 → 목
const BOTTLE = [[0.001, 0.078], [0.1, 0.072], [0.2, 0.056], [0.29, 0.03], [0.36, 0.008], [0.4, 0], [0.45, 0.004], [0.5, 0.022],
  [0.535, 0.055], [0.549, 0.1], [0.55, 0.15], [0.55, 1.36], [0.534, 1.392], [0.534, 1.425], [0.55, 1.456], [0.55, 1.5],
  [0.534, 1.532], [0.534, 1.565], [0.55, 1.596], [0.55, 1.64], [0.543, 1.72], [0.518, 1.8], [0.47, 1.88], [0.4, 1.95],
  [0.32, 2.0], [0.25, 2.04], [0.212, 2.075], [0.2, 2.1], [0.2, 2.26]];
// 물 바닥 윤곽 — 병 바닥 굴곡에서 벽 두께만큼 띄운다
const WBOT = [[0, 0.098], [0.1, 0.092], [0.2, 0.076], [0.29, 0.05], [0.36, 0.03], [0.4, 0.022], [0.45, 0.026], [0.49, 0.042],
  [0.515, 0.075], [RW, 0.12], [RW, 0.17]];

// 물(얼음) 모양: h = 물 높이, k = 언 정도(0 물 → 1 얼음). 물은 벽에서 살짝 올라가고(메니스커스), 얼음은 가운데가 볼록.
function waterGeo(h, k) {
  const top = (s) => (1 - k) * 0.03 * Math.pow(s, 6) + k * 0.1 * (1 - s * s);   // s: 0 가운데 → 1 벽
  const pts = WBOT.map(([x, y]) => V2(x, y));
  pts.push(V2(RW, h + top(1)));
  for (let i = 1; i <= 10; i++) { const s = 1 - i / 10; pts.push(V2(Math.max(0.0005, RW * s), h + top(s))); }
  return new THREE.LatheGeometry(pts, SEG);
}

// 결정적 난수(캡처·되감기 때 얼음 배치가 같도록)
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function canvasTex(w, h, draw, opts = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (opts.color !== false) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...opts.repeat); }
  return t;
}

// ── 7세그먼트 LCD 글자 ──────────────────────────────────────────
const SEG7 = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g', ' ': '' };
function seg7(ctx, x, y, w, h, t, on) {
  const g = t * 0.28, m = h / 2;
  const hs = (x0, y0, len) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + t / 2, y0 - t / 2); ctx.lineTo(x0 + len - t / 2, y0 - t / 2); ctx.lineTo(x0 + len, y0); ctx.lineTo(x0 + len - t / 2, y0 + t / 2); ctx.lineTo(x0 + t / 2, y0 + t / 2); ctx.closePath(); ctx.fill(); };
  const vs = (x0, y0, len) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + t / 2, y0 + t / 2); ctx.lineTo(x0 + t / 2, y0 + len - t / 2); ctx.lineTo(x0, y0 + len); ctx.lineTo(x0 - t / 2, y0 + len - t / 2); ctx.lineTo(x0 - t / 2, y0 + t / 2); ctx.closePath(); ctx.fill(); };
  const S = { a: () => hs(x + g, y, w - 2 * g), g: () => hs(x + g, y + m, w - 2 * g), d: () => hs(x + g, y + h, w - 2 * g),
    f: () => vs(x, y + g, m - 2 * g), b: () => vs(x + w, y + g, m - 2 * g), e: () => vs(x, y + m + g, m - 2 * g), c: () => vs(x + w, y + m + g, m - 2 * g) };
  for (const s of on) S[s]();
}
function drawLcd(ctx, W, Hc, text) {
  const gr = ctx.createLinearGradient(0, 0, 0, Hc); gr.addColorStop(0, '#b4c29d'); gr.addColorStop(1, '#c9d5b3');
  ctx.fillStyle = gr; ctx.fillRect(0, 0, W, Hc);
  const dw = 104, dh = 132, t = 21, gap = 36, y = (Hc - dh) / 2 + 4, unitW = 70;
  const chars = [...text.replace('.', '')], dot = text.indexOf('.');
  const n = 4, x0 = W - unitW - 40 - n * (dw + gap);                     // 오른쪽 정렬, 4자리
  ctx.save(); ctx.transform(1, 0, -0.1, 1, 12, 0);
  ctx.fillStyle = 'rgba(27,36,22,0.07)';                                  // 꺼진 세그먼트(실제 LCD처럼 옅게 비침)
  for (let i = 0; i < n; i++) seg7(ctx, x0 + i * (dw + gap), y, dw, dh, t, SEG7[8]);
  ctx.fillStyle = '#18200f';
  const off = n - chars.length;
  chars.forEach((ch, i) => seg7(ctx, x0 + (i + off) * (dw + gap), y, dw, dh, t, SEG7[ch] ?? ''));
  if (dot > 0) { const xi = x0 + (dot + off - 1) * (dw + gap) + dw + gap / 2; ctx.beginPath(); ctx.arc(xi, y + dh, t * 0.6, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = '#18200f'; ctx.font = '800 84px "Pretendard", "Noto Sans KR", sans-serif'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('g', W - unitW - 14, y + dh);
  ctx.font = '700 22px "Pretendard", "Noto Sans KR", sans-serif'; ctx.fillStyle = 'rgba(24,32,15,0.8)'; ctx.fillText('STABLE', 22, 34);
  const sh = ctx.createLinearGradient(0, 0, 0, 18); sh.addColorStop(0, 'rgba(0,0,0,0.22)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh; ctx.fillRect(0, 0, W, 18);                          // 창 위쪽 안쪽 그림자
}

// ── 전자저울 ─────────────────────────────────────────────────
function buildScale() {
  const g = new THREE.Group(), FOOT = 0.035;
  const shell = new THREE.Mesh(roundedBoxGeometry(2.42, 0.14, 2.02, 0.06, 3), mat(0x56606b, { roughness: 0.55 }));
  shell.position.y = FOOT + 0.07;
  const housing = new THREE.Mesh(roundedBoxGeometry(2.4, 0.34, 2.0, 0.1, 4), mat(0xeceef0, { roughness: 0.38 }));
  housing.position.y = FOOT + 0.1 + 0.17;
  const HT = FOOT + 0.44;                                                  // 본체 윗면
  for (const m of [shell, housing]) { m.castShadow = m.receiveShadow = true; g.add(m); }
  // 고무발
  const footG = new THREE.CylinderGeometry(0.1, 0.11, FOOT, 20), footM = mat(0x24282c, { roughness: 0.9 });
  for (const [x, z] of [[-0.95, -0.78], [0.95, -0.78], [-0.95, 0.78], [0.95, 0.78]]) { const f = new THREE.Mesh(footG, footM); f.position.set(x, FOOT / 2, z); g.add(f); }
  // 접시 받침 + 금속 접시(원판 + 테두리). 윗면은 동심원 헤어라인 무늬.
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, PAN_Y - 0.035 - HT, 28), mat(0x3d4550, { roughness: 0.5 }));
  post.position.y = HT + (PAN_Y - 0.035 - HT) / 2; g.add(post);
  const brushed = canvasTex(512, 512, (c, w) => {
    c.fillStyle = '#cfd5da'; c.fillRect(0, 0, w, w); const r = rng(7);
    for (let i = 4; i < 256; i += 1.5) { c.strokeStyle = `rgba(${r() > 0.5 ? '255,255,255' : '90,100,110'},${0.05 + r() * 0.1})`; c.lineWidth = 1; c.beginPath(); c.arc(256, 256, i, 0, Math.PI * 2); c.stroke(); }
  });
  const steel = new THREE.MeshStandardMaterial({ color: 0xd4dade, metalness: 0.85, roughness: 0.3 });
  const steelTop = new THREE.MeshStandardMaterial({ color: 0xffffff, map: brushed, metalness: 0.85, roughness: 0.26 });
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.93, 0.9, 0.035, 64), [steel, steelTop, steel]);
  pan.position.y = PAN_Y - 0.0175; pan.castShadow = pan.receiveShadow = true; g.add(pan);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.93, 0.02, 10, 72), steel); rim.rotation.x = Math.PI / 2; rim.position.y = PAN_Y + 0.004; rim.castShadow = true; g.add(rim);
  // 앞면: 검은 테두리 + LCD 창(캔버스 글자) + 버튼 2개
  const FZ = 1.0, FY = FOOT + 0.1 + 0.17;
  const bezel = new THREE.Mesh(roundedBoxGeometry(1.38, 0.28, 0.03, 0.03, 2), mat(0x22272c, { roughness: 0.35 }));
  bezel.position.set(-0.27, FY, FZ + 0.004); g.add(bezel);
  const lcdTex = canvasTex(1024, 172, (c, w, h) => drawLcd(c, w, h, '120.0'));
  const lcdMat = new THREE.MeshStandardMaterial({ map: lcdTex, emissive: 0xffffff, emissiveMap: lcdTex, emissiveIntensity: 0.28, roughness: 0.25 });
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(1.27, 0.213), lcdMat); lcd.position.set(-0.27, FY, FZ + 0.0205); g.add(lcd);
  const btnG = new THREE.CylinderGeometry(0.07, 0.074, 0.03, 28);
  [['ON/OFF', 0x3a424c, 0.66], ['TARE', 0x2f6fb5, 0.96]].forEach(([txt, col, x]) => {
    const b = new THREE.Mesh(btnG, mat(col, { roughness: 0.4 })); b.rotation.x = Math.PI / 2; b.position.set(x, FY + 0.03, FZ + 0.012); g.add(b);
    const tt = canvasTex(256, 64, (c, w, h) => { c.fillStyle = '#2b3138'; c.font = '800 40px "Pretendard", "Noto Sans KR", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2, h / 2 + 2); });
    const tl = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.05), new THREE.MeshStandardMaterial({ map: tt, transparent: true, roughness: 0.6, depthWrite: false }));
    tl.position.set(x, FY - 0.1, FZ + 0.001); g.add(tl);
  });
  g.userData.lcd = lcd;
  return g;
}

// ── 투명 PET 병 ──────────────────────────────────────────────
function buildBottle() {
  const g = new THREE.Group();
  const pet = new THREE.MeshPhysicalMaterial({ color: 0xe4f0f8, transparent: true, opacity: 0.24, roughness: 0.04, metalness: 0,
    clearcoat: 1, clearcoatRoughness: 0.04, side: THREE.DoubleSide, depthWrite: false });
  const wall = new THREE.Mesh(new THREE.LatheGeometry(BOTTLE.map(([x, y]) => V2(x, y)), 48), pet); wall.renderOrder = 3; g.add(wall);
  // 목 받침 고리 · 나사선 · 봉인 고리 · 뚜껑(세로 톱니)
  const petThick = new THREE.MeshPhysicalMaterial({ color: 0xe4f0f8, transparent: true, opacity: 0.5, roughness: 0.1, clearcoat: 1, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.258, 0.258, 0.022, 40), petThick); ring.position.y = 2.112; ring.renderOrder = 3; g.add(ring);
  const helix = new (class extends THREE.Curve { getPoint(t, v = new THREE.Vector3()) { const a = t * Math.PI * 2 * 1.3; return v.set(Math.sin(a) * 0.2, 2.135 + t * 0.05, Math.cos(a) * 0.2); } })();
  const thread = new THREE.Mesh(new THREE.TubeGeometry(helix, 64, 0.009, 5, false), petThick); thread.renderOrder = 3; g.add(thread);
  const capM = mat(0x2d6cb3, { roughness: 0.42 });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.228, 0.228, 0.03, 40), capM); band.position.y = 2.2; band.castShadow = true; g.add(band);
  const capG = new THREE.CylinderGeometry(0.236, 0.236, 0.17, 48, 1, true), cp = capG.attributes.position;
  for (let i = 0; i < cp.count; i++) { const f = (i % 49) % 2 ? 0.955 : 1; cp.setX(i, cp.getX(i) * f); cp.setZ(i, cp.getZ(i) * f); }
  capG.computeVertexNormals();
  const cap = new THREE.Mesh(capG, capM); cap.position.y = 2.305; cap.castShadow = true; g.add(cap);
  const capTop = new THREE.Mesh(new THREE.LatheGeometry([V2(0.236, 0), V2(0.232, 0.012), V2(0.22, 0.02), V2(0.001, 0.023)], 48), capM);
  capTop.position.y = 2.39; g.add(capTop);
  // 눈금: 병 앞쪽(카메라 쪽) 호에 가는 선 + 숫자(mL). 100 mL 마다 굵은 선, 50 mL 마다 가는 선.
  const y0 = 0.2, y1 = 1.42, arcL = 0.9, arcS = 0.55 - arcL / 2 + 0.05;
  const CW = 256, CH = Math.round(CW / (arcL * (R + 0.004)) * (y1 - y0));
  const toPx = (y) => CH - (y - y0) / (y1 - y0) * CH;
  const scaleTex = canvasTex(CW, CH, (c) => {
    c.fillStyle = 'rgba(38,58,78,0.92)'; c.font = '800 64px "Pretendard", "Noto Sans KR", sans-serif'; c.textBaseline = 'middle';
    for (let ml = 50; ml <= 500; ml += 50) {
      const y = toPx(0.3 + (ml - 100) / 100 * 0.25), major = ml % 100 === 0;
      c.fillRect(6, y - (major ? 3.5 : 2), major ? 70 : 40, major ? 7 : 4);
      if (major) c.fillText(String(ml), 90, y + 2);
    }
    c.font = '800 44px "Pretendard", "Noto Sans KR", sans-serif'; c.fillText('mL', 96, toPx(1.39));
  });
  const grad = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.004, R + 0.004, y1 - y0, 16, 1, true, arcS, arcL),
    new THREE.MeshBasicMaterial({ map: scaleTex, transparent: true, depthWrite: false, toneMapped: false }));
  grad.position.y = (y0 + y1) / 2; grad.renderOrder = 4; g.add(grad);
  return g;
}

// ── 소금 섞은 얼음 통 ─────────────────────────────────────────
function buildBath() {
  const g = new THREE.Group();
  const tubM = new THREE.MeshPhysicalMaterial({ color: 0xd8ebf8, transparent: true, opacity: 0.26, roughness: 0.12, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false });
  const tub = new THREE.Mesh(new THREE.LatheGeometry([V2(0.001, 0), V2(0.78, 0), V2(0.81, 0.02), V2(0.83, 0.06), V2(1.14, 0.9), V2(1.17, 0.93), V2(1.2, 0.95), V2(1.21, 0.975), V2(1.19, 0.985)].map((v) => v), 48), tubM);
  tub.renderOrder = 6; g.add(tub);
  const r = rng(42), cubes = [], salt = [];
  const rTub = (y) => 0.8 + (1.14 - 0.8) * (y / 0.9);
  for (let L = 0; L < 4; L++) {
    const y = 0.12 + L * 0.165, rIn = 0.66, rOut = rTub(y) - 0.13, rm = (rIn + rOut) / 2;
    for (const rr of rOut - rIn > 0.2 ? [rIn + 0.02, rOut] : [rm]) {
      const n = Math.floor((Math.PI * 2 * rr) / 0.27);
      for (let i = 0; i < n; i++) { const a = (i + r() * 0.5 + L * 0.37) / n * Math.PI * 2; cubes.push([Math.sin(a) * rr, y + r() * 0.04, Math.cos(a) * rr, r() * 3, r() * 3, r() * 3, 0.85 + r() * 0.3, L]); }
    }
  }
  const cubeG = roundedBoxGeometry(0.21, 0.19, 0.21, 0.05, 2);
  const iceM = new THREE.MeshPhysicalMaterial({ color: 0xeef7fc, transparent: true, opacity: 0.72, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.1 });
  const inst = new THREE.InstancedMesh(cubeG, iceM, cubes.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
  cubes.forEach(([x, y, z, a, b, c, k], i) => { e.set(a, b, c); q.setFromEuler(e); s.setScalar(k); p.set(x, y, z); m4.compose(p, q, s); inst.setMatrixAt(i, m4); });
  inst.renderOrder = 5; g.add(inst);
  const top = cubes.filter((c) => c[7] === 3);
  for (let i = 0; i < 90; i++) { const c = top[Math.floor(r() * top.length)]; salt.push([c[0] + (r() - 0.5) * 0.18, c[1] + 0.1 + r() * 0.03, c[2] + (r() - 0.5) * 0.18]); }
  const saltI = new THREE.InstancedMesh(new THREE.BoxGeometry(0.028, 0.028, 0.028), mat(0xffffff, { roughness: 0.4 }), salt.length);
  salt.forEach(([x, y, z], i) => { e.set(r() * 3, r() * 3, r() * 3); q.setFromEuler(e); s.setScalar(1); p.set(x, y, z); m4.compose(p, q, s); saltI.setMatrixAt(i, m4); });
  g.add(saltI);
  return g;
}

// ── 실험대 소품: 물이 조금 담긴 유리 비커 하나 ──────────────────────
function buildBeaker() {
  const g = new THREE.Group();
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xe8f2f8, transparent: true, opacity: 0.22, roughness: 0.05, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false });
  const w = new THREE.Mesh(new THREE.LatheGeometry([V2(0.001, 0.02), V2(0.3, 0.012), V2(0.33, 0.04), V2(0.34, 0.1), V2(0.34, 0.82), V2(0.36, 0.84), V2(0.355, 0.85), V2(0.335, 0.84)], 40), glass);
  w.renderOrder = 3; g.add(w);
  const aq = new THREE.Mesh(new THREE.CylinderGeometry(0.325, 0.31, 0.3, 40), new THREE.MeshPhysicalMaterial({ color: P.water, transparent: true, opacity: 0.6, roughness: 0.08, clearcoat: 1 }));
  aq.position.y = 0.17; aq.renderOrder = 2; g.add(aq);
  for (let i = 1; i <= 4; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.343, 0.004, 4, 24, 0.5), mat(0x2c3e50)); t.rotation.x = Math.PI / 2; t.rotation.z = 0.78; t.position.y = 0.12 + i * 0.15; g.add(t); }
  return g;
}

export default {
  view: { theta: 0.55, phi: 1.2, dist: 7.0, target: [0, 1.4, 0] },
  build(kit, world) {
    const scale = buildScale(); world.add('scale', scale);
    const bottle = buildBottle(); bottle.position.y = PAN_Y; world.add('bottle', bottle);

    // 물: 윤곽을 매번 다시 깎아 병 모양을 따라 차오르게 한다. 같은 모양의 '서리' 껍질이 얼수록 짙어진다.
    const wMat = new THREE.MeshPhysicalMaterial({ color: P.water, transparent: true, opacity: 0.78, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 });
    const frostTex = canvasTex(256, 256, (c, w) => {
      const r = rng(3); c.clearRect(0, 0, w, w);
      for (let i = 0; i < 1400; i++) { c.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.75})`; const s = 1 + r() * 3.5; c.fillRect(r() * w, r() * w, s, s); }
      c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1.4;
      for (let i = 0; i < 26; i++) { let x = r() * w, y = r() * w; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 40; y += (r() - 0.5) * 40; c.lineTo(x, y); } c.stroke(); }
    }, { repeat: [5, 3] });
    const frostMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: frostTex, transparent: true, opacity: 0, roughness: 0.8, depthWrite: false });
    const wMesh = new THREE.Mesh(waterGeo(H * FILL, 0), wMat); wMesh.renderOrder = 1;
    const frost = new THREE.Mesh(wMesh.geometry, frostMat); frost.scale.set(1.006, 1.002, 1.006); frost.renderOrder = 2;
    const water = new THREE.Group(); water.add(wMesh, frost); water.position.y = PAN_Y;
    water.material = wMat;                                 // 비트가 water.material.color 로 물↔얼음 색을 바꾼다
    water.userData.f = FILL;
    water.setFill = (f) => {
      if (f === water.userData.f) return water;
      water.userData.f = f;
      const k = clamp01((f - FILL) / (FILL * (GROW - 1)));   // 부피가 는 만큼 = 언 만큼
      const geo = waterGeo(H * f, k); wMesh.geometry.dispose(); wMesh.geometry = geo; frost.geometry = geo;
      wMat.roughness = lerp(0.06, 0.45, k); wMat.opacity = lerp(0.78, 0.9, k); wMat.clearcoat = lerp(1, 0.3, k);
      frostMat.opacity = 0.7 * k;
      return water;
    };
    world.add('water', water);

    const mark = new THREE.Mesh(new THREE.TorusGeometry(R + 0.007, 0.014, 8, 64), mat(P.red, { roughness: 0.5 }));
    mark.rotation.x = Math.PI / 2; mark.position.y = PAN_Y + H * FILL; world.add('mark', mark);
    const bath = buildBath(); bath.position.y = PAN_Y; world.add('bath', bath);
    const beaker = buildBeaker(); beaker.position.set(1.95, 0, -1.05); world.group.add(beaker);   // 늘 보이는 소품

    const lbW = label('무게 120 g', { size: 0.3 }); lbW.position.set(-1.5, 1.3, 0.35); world.add('lbW', lbW);
    const lbQ = label('얼리면 높이와 무게는?', { size: 0.32 }); lbQ.position.set(0, 3.38, 0); world.add('lbQ', lbQ);
    const lbUp = label('높이가 처음 선보다 올라갔어요', { size: 0.28 }); lbUp.position.set(0, 3.38, 0); world.add('lbUp', lbUp);
    const lbSame = label('무게는 그대로 120 g', { size: 0.3 }); lbSame.position.set(0, 3.38, 0); world.add('lbSame', lbSame);
    const lbBack = label('녹으면 다시 처음 높이로', { size: 0.3 }); lbBack.position.set(0, 3.38, 0); world.add('lbBack', lbBack);
    const up = arrow([0.95, PAN_Y + H * FILL, 0.2], [0.95, PAN_Y + H * FILL * GROW + 0.3, 0.2], P.red, 0.035); world.add('up', up);
    return {};
  },
  beats: [
    { text: '물을 반쯤 담은 병을 저울에 올리고, 물 높이에 빨간 선을 그어요.', show: ['scale', 'bottle', 'water', 'mark', 'lbW', 'lbQ'], dur: 4,
      reset(o) { o.water.setFill(FILL); o.water.material.color.setHex(P.water); relabel(o.lbW, '무게 120 g', { size: 0.3 }); } },
    { text: '병을 소금을 섞은 얼음 속에 넣어 물을 얼려요.', show: ['bath'], dur: 5,
      anim(p, o) { o.water.material.color.set(new THREE.Color(P.water).lerp(new THREE.Color(ICE), p)); o.water.setFill(lerp(FILL, FILL * GROW, p)); } },
    { text: '얼음이 되니 높이가 처음 선보다 높아졌어요. 부피가 늘어났어요.', show: ['up', 'lbUp'], hide: ['bath', 'lbQ'], dur: 5 },
    { text: '다시 저울에 올려 보면 무게는 그대로예요. 물의 양은 변하지 않았으니까요.', show: ['lbSame'], hide: ['lbUp', 'up'], dur: 5 },
    { text: '얼음이 녹으면 높이가 다시 처음 선으로 내려와요. 부피가 줄어들었어요.', show: ['lbBack'], hide: ['lbSame'], dur: 6,
      anim(p, o) { o.water.material.color.set(new THREE.Color(ICE).lerp(new THREE.Color(P.water), p)); o.water.setFill(lerp(FILL * GROW, FILL, p)); } },
  ],
};
