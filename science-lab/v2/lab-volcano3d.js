// 체험형 3D 실험실: 화산 실험실 — 단계를 하나씩 따라 한다.
// ① 화산 모형: 포일 화산 올리기 → 알코올램프 불 붙이기 → 가열하기(누르고 있기) → 불 끄고 굳히기 → 표에 적기
//    (연기 = 화산 가스, 녹아 흘러나온 마시멜로 = 용암, 굳은 것 = 화산 암석)
// ② 식히기: 뜨거운 백반 물 담기 → 얼음물/상자 고르기 → 식히기(누르고 있기) → 결정 살펴보기 → 표에 적기
//    (빨리 식힘 → 작은 결정 많이 = 현무암, 천천히 식힘 → 큰 결정 조금 = 화강암). WebGL이 없으면 글로 하는 실험실.
const HEATS = { 약하게: 12, 강하게: 24 };                 // 가열 속도(°C/s)
const COOLS = { '얼음물(빨리)': 14, '상자(천천히)': 4 };     // 식는 속도(°C/s)
const MELT = 70, FULL = 1;
const STEPS = {
  '화산 모형': ['포일 화산 올리기', '불 붙이기', '가열하기', '불 끄고 굳히기', '표에 적기'],
  '식히기': ['뜨거운 백반 물 담기', '식힐 곳 고르기', '식히기', '결정 살펴보기', '표에 적기'],
};
const GUIDE = {
  '화산 모형': ['삼발이 위에 마시멜로를 넣은 <b>포일 화산</b>을 올려요.', '보호자와 함께 <b>알코올램프</b>에 불을 붙여요.', '불 세기를 고르고 <b>가열하기</b>를 누르고 있어요. 연기와 흘러나오는 것을 봐요.', '<b>불을 끄면</b> 흘러나온 마시멜로가 식으면서 굳어요. 굳을 때까지 지켜봐요.', '연기·흘러나온 것·굳은 것을 <b>표에 적어</b>요. 불 세기를 바꿔 한 번 더 해 봐요.'],
  '식히기': ['뜨거운 물에 백반을 녹인 <b>백반 물</b>을 비커에 담아요.', '<b>얼음물</b>(빨리) 또는 <b>상자</b>(천천히) 중 어디에서 식힐지 골라요.', '<b>식히기</b>를 누르고 있어요. 온도가 내려가면서 결정이 생겨요.', '결정의 <b>크기와 개수</b>를 살펴봐요. 빨리 식힌 것과 천천히 식힌 것이 달라요.', '<b>표에 적어</b>요. 다른 방법으로 식혀 비교해 봐요.'],
};
const hash = (i) => { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

export async function mountVolcano3D(el, opts = {}) {
  let THREE, Stage, watchDetached, K;
  try {
    [{ Stage, watchDetached }, THREE, K] = await Promise.all([import('../engine.js'), import('../../world-explorer/vendor/three.module.js'), import('../scenes/_kit.js')]);
    const t = document.createElement('canvas'); if (!(t.getContext('webgl2') || t.getContext('webgl'))) throw new Error('no webgl');
  } catch (_) { return mountVolcano2D(el, opts); }
  const rows = opts.rows || [], onRecord = opts.onRecord;
  let exp = '화산 모형', heat = '강하게', cool = '얼음물(빨리)', holding = false, step = 0;
  const grp = (name, key, keys, cur) => `<div class="modes" role="group" aria-label="${name}"><span class="lab-lbl">${name}</span>${keys.map((k) => `<button type="button" data-${key}="${k}" aria-pressed="${k === cur}">${k}</button>`).join('')}</div>`;
  el.innerHTML = `
    <div class="modes" role="tablist" aria-label="실험"><span class="lab-lbl">실험</span><button type="button" role="tab" data-x="화산 모형" aria-selected="true">① 화산 모형</button><button type="button" role="tab" data-x="식히기" aria-selected="false">② 식히기</button></div>
    <ol class="lab-steps" data-r="steps"></ol>
    <div data-pane="화산 모형">${grp('불 세기', 'h', Object.keys(HEATS), heat)}</div>
    <div data-pane="식히기" hidden>${grp('식힐 곳', 'c', Object.keys(COOLS), cool)}</div>
    <div class="lab3d">
      <canvas aria-label="화산 실험 3D. 끌어서 돌려 볼 수 있어요."></canvas>
      <div class="lab3d-read">
        <p class="lab-read"><span>온도</span><b data-r="temp">20</b><small>°C</small></p>
        <p class="lab-read"><span data-r="l2">연기</span><b data-r="v2">—</b><small></small></p>
        <p class="lab-read"><span data-r="l3">흘러나온 양</span><b data-r="v3">0</b><small data-r="u3">칸</small></p>
      </div>
      <p class="lab3d-tip" data-r="tip"></p>
      <div class="lab3d-btns">
        <button class="btn primary pour" data-act="main" type="button"></button>
        <button class="btn" data-act="reset" type="button">처음부터</button>
        <button class="btn" data-act="record" type="button">표에 적기</button>
      </div>
    </div>
    <table class="lab-table"><thead><tr><th>실험</th><th>조건</th><th>결과</th></tr></thead><tbody></tbody></table>`;
  const $ = (s) => el.querySelector(s), canvas = $('canvas'), tbody = $('tbody'), tip = (h) => { $('[data-r=tip]').innerHTML = h; };
  let stage;
  try { stage = new Stage(canvas); } catch (_) { return mountVolcano2D(el, opts); }
  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: o.r ?? 0.6, metalness: o.m ?? 0, transparent: o.op != null, opacity: o.op ?? 1, emissive: o.e ?? 0x000000, emissiveIntensity: o.ei ?? 1, side: o.side ?? THREE.FrontSide });
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), V3 = new THREE.Vector3(), S3 = new THREE.Vector3(), AX = new THREE.Vector3(0.3, 1, 0.2).normalize();

  const phys = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: o.r ?? 0.08, metalness: o.m ?? 0, clearcoat: o.cc ?? 1, clearcoatRoughness: 0.1, transparent: o.op != null, opacity: o.op ?? 1, side: o.side ?? THREE.FrontSide, depthWrite: o.dw ?? (o.op == null), map: o.map ?? null });
  const glassM = () => phys(0xe6f3fa, { op: 0.3, side: THREE.DoubleSide });
  const steel = mat(0x464c52, { r: 0.32, m: 0.85 });
  const prng = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const canvasTex = (size, draw, wrap = true) => { const cv = document.createElement('canvas'); cv.width = cv.height = size; draw(cv.getContext('2d'), size, prng(size + 7)); const t = new THREE.CanvasTexture(cv); if (wrap) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const lathe = (pts, seg = 48) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  // 두 점을 잇는 원기둥(삼발이 다리 등)
  const rod = (a, b, r, m) => { const A3 = new THREE.Vector3(...a), B3 = new THREE.Vector3(...b), d = B3.clone().sub(A3), o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 12), m); o.position.copy(A3).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return o; };
  // 실험대: 모서리가 둥근 나무 상판 + 다리. 모든 실험 도구는 상판 윗면(y=0)을 기준으로 놓는다.
  const TH = 0.86, woodTex = canvasTex(256, (g, S, r) => { g.fillStyle = '#c8a273'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 60; i++) { const y = r() * S; g.strokeStyle = `rgba(${r() < 0.5 ? '120,80,40' : '230,200,160'},${0.12 + r() * 0.2})`; g.lineWidth = 0.6 + r() * 2.4; g.beginPath(); for (let x = 0; x <= S; x += 6) g.lineTo(x, y + Math.sin(x * 0.025 + i) * 3 + Math.sin(x * 0.09 + i * 3) * 1.2); g.stroke(); } });
  woodTex.repeat.set(1, 1);
  const makeTable = () => {
    const t = new THREE.Group(), top = new THREE.Mesh(K.roundedBoxGeometry(5, 0.1, 3.4, 0.045, 3), new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.55, metalness: 0 }));
    top.position.y = -0.05; t.add(top);
    const legM = mat(0x6b5a48, { r: 0.6 });
    for (const [x, z] of [[2.3, 1.5], [-2.3, 1.5], [2.3, -1.5], [-2.3, -1.5]]) { const l = new THREE.Mesh(K.roundedBoxGeometry(0.12, TH - 0.1, 0.12, 0.03, 2), legM); l.position.set(x, -0.1 - (TH - 0.1) / 2, z); t.add(l); }
    for (const [x, z, w, d] of [[0, 1.5, 4.5, 0.06], [0, -1.5, 4.5, 0.06], [2.3, 0, 0.06, 2.9], [-2.3, 0, 0.06, 2.9]]) { const a = new THREE.Mesh(K.roundedBoxGeometry(w, 0.12, d, 0.02, 2), legM); a.position.set(x, -0.17, z); t.add(a); }
    t.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return t;
  };

  // ── ① 화산 모형 ──
  const A = new THREE.Group(); A.position.y = TH; stage.root.add(A);
  const table = makeTable(); A.add(table);
  const ringY = 1.05;
  // 삼발이: 쇠고리 + 바깥으로 살짝 벌어진 다리 3개(고무 발)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.032, 12, 56), steel); ring.rotation.x = Math.PI / 2; ring.position.y = ringY; A.add(ring);
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.5, c = Math.cos(a), s = Math.sin(a);
    A.add(rod([c * 0.58, ringY, s * 0.58], [c * 0.7, 0.03, s * 0.7], 0.026, steel));
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.05, 14), mat(0x222222, { r: 0.9 })); foot.position.set(c * 0.7, 0.025, s * 0.7); A.add(foot); }
  // 쇠그물: 철사 격자 + 가운데 세라믹 원(철사 사이는 비어 보인다)
  const gauzeTex = canvasTex(256, (g, S) => { g.clearRect(0, 0, S, S); g.strokeStyle = '#7d848b'; g.lineWidth = 1.6;
    for (let k = 6; k < S; k += 8) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, S); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(S, k); g.stroke(); }
    g.fillStyle = '#e9e4da'; g.beginPath(); g.arc(S / 2, S / 2, S * 0.3, 0, 7); g.fill(); g.fillStyle = 'rgba(160,150,135,0.5)'; for (let i = 0; i < 300; i++) { const a = Math.random() * 7, rr = Math.random() * S * 0.29; g.fillRect(S / 2 + Math.cos(a) * rr, S / 2 + Math.sin(a) * rr, 1.5, 1.5); }
    g.strokeStyle = '#5d646b'; g.lineWidth = 7; g.strokeRect(3, 3, S - 6, S - 6); }, false);
  const gauze = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshStandardMaterial({ map: gauzeTex, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.55, metalness: 0.5 }));
  gauze.rotation.x = -Math.PI / 2; gauze.rotation.z = 0.2; gauze.position.y = ringY + 0.035; A.add(gauze);
  // 알코올램프: 둥근 유리병 + 알코올 + 금속 심지꽂이 + 무명 심지. 불꽃은 바닥에서 위로 커지는 물방울 모양(빛이 더해지는 재질).
  const lamp = new THREE.Group();
  const jar = new THREE.Mesh(lathe([[0, 0], [0.27, 0], [0.3, 0.03], [0.31, 0.13], [0.27, 0.3], [0.13, 0.42], [0.1, 0.46], [0.1, 0.5], [0.085, 0.5], [0.085, 0.45], [0.12, 0.41], [0.255, 0.3], [0.29, 0.13], [0.28, 0.04], [0, 0.03]]), glassM());
  jar.renderOrder = 2; lamp.add(jar);
  const fuel = new THREE.Mesh(lathe([[0, 0.035], [0.275, 0.035], [0.285, 0.13], [0.265, 0.22], [0, 0.22]], 40), phys(0x8cc6e6, { op: 0.55, r: 0.05 })); lamp.add(fuel);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.105, 0.08, 28), mat(0xc9ced3, { r: 0.22, m: 0.95 })); cap.position.y = 0.53; lamp.add(cap);
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 0.13, 12), mat(0xf1ece2, { r: 0.95 })); wick.position.y = 0.62; lamp.add(wick);
  const char = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 8), mat(0x2b2724, { r: 0.9 })); char.scale.y = 0.6; char.position.y = 0.685; lamp.add(char);
  const flameGeo = (w, h) => lathe([[0, 0], [w * 0.7, h * 0.06], [w, h * 0.22], [w * 0.8, h * 0.5], [w * 0.35, h * 0.82], [0, h]], 24);
  const flame = new THREE.Mesh(flameGeo(0.085, 0.42), new THREE.MeshBasicMaterial({ color: 0xffa23a, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })); flame.position.y = 0.67; flame.visible = false; lamp.add(flame);
  const flameCore = new THREE.Mesh(flameGeo(0.045, 0.2), new THREE.MeshBasicMaterial({ color: 0x4f9dff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })); flameCore.position.y = 0.665; flameCore.visible = false; lamp.add(flameCore);
  const flameLight = new THREE.PointLight(0xffa040, 0, 3, 2); flameLight.position.y = 0.9; lamp.add(flameLight);
  A.add(lamp);
  // 포일 화산: 구김이 여러 겹인 알루미늄 원뿔(꼭대기가 뚫린 분화구) + 구겨진 포일 받침 + 안의 마시멜로
  const crumple = (geo, amp, h0, h1) => { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.hypot(x, z); if (r < 1e-4) continue;
    const a = Math.atan2(z, x), h = (y - h0) / (h1 - h0), f = 1 + amp * (0.55 * Math.sin(a * 9 + h * 5) + 0.35 * Math.sin(a * 23 - h * 11 + 1) + 0.25 * Math.sin(a * 41 + h * 19 + 2));
    p.setXYZ(i, x * f, y + amp * 0.2 * Math.sin(a * 17 + h * 7), z * f); } geo.computeVertexNormals(); return geo; };
  const foilMat = new THREE.MeshStandardMaterial({ color: 0xe3e6e9, roughness: 0.24, metalness: 1, side: THREE.DoubleSide });
  const foilGeo = crumple(new THREE.CylinderGeometry(0.1, 0.55, 0.75, 96, 16, true), 0.06, -0.375, 0.375);
  const foil = new THREE.Group();
  const foilM = new THREE.Mesh(foilGeo, foilMat); foilM.position.y = 0.375; foil.add(foilM);
  const skirt = new THREE.Mesh(crumple(new THREE.RingGeometry(0.5, 0.72, 96, 3).rotateX(-Math.PI / 2), 0.035, 0, 1), foilMat); skirt.position.y = 0.012; foil.add(skirt);
  const crater = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), mat(0x3b2a22, { r: 0.9 })); crater.rotation.x = -Math.PI / 2; crater.position.y = 0.73; foil.add(crater);
  const mallow = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.3, 20), mat(0xfff1f3, { r: 0.9 })); mallow.position.y = 0.16; foil.add(mallow);
  foil.position.y = 4; foil.visible = false; A.add(foil);
  // 흘러나온 마시멜로: 분화구에서 비탈을 타고 내려와 받침에 고이는 방울들
  const blobs = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), mat(0xfff4ee, { r: 0.55, e: 0xffb08a, ei: 0.25 }), 90); blobs.frustumCulled = false; blobs.count = 0; A.add(blobs);
  const bcol = new THREE.Color(), cHot = new THREE.Color(0xfff4ee), cSet = new THREE.Color(0xd9a36f);
  const setBlobs = (melt, set) => {
    const n = Math.round(melt * 90); let k = 0;
    for (let i = 0; i < n; i++) {
      const s = i / 90, a = 0.8 + Math.sin(i * 0.37) * 0.25;    // 흘러가는 방향(살짝 흔들림)
      const along = Math.min(1, s * 1.35), r = 0.06 + along * 0.56, y = along < 1 ? ringY + 0.7 - along * 0.7 : ringY;
      const spill = Math.max(0, s * 1.35 - 1), rr = r + spill * 0.5;
      V3.set(Math.cos(a) * rr + (hash(i) - 0.5) * 0.06, y + 0.03 + (spill > 0 ? -0.0 : 0), Math.sin(a) * rr + (hash(i + 90) - 0.5) * 0.06);
      const sc = 0.045 + hash(i + 7) * 0.03 + spill * 0.02; S3.set(sc * 1.3, sc * 0.8, sc * 1.3); M4.compose(V3, Q.identity(), S3); blobs.setMatrixAt(k++, M4);
    }
    blobs.count = k; blobs.instanceMatrix.needsUpdate = true;
    bcol.copy(cHot).lerp(cSet, set); blobs.material.color.copy(bcol); blobs.material.emissiveIntensity = 0.25 * (1 - set);
  };
  const smoke = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 7, 6), mat(0xeeeeee, { r: 1, op: 0.5 }), 120); smoke.frustumCulled = false; smoke.count = 0; A.add(smoke);
  const puffs = [];
  A.traverse((o) => { if (o.isMesh && !o.material.transparent) o.castShadow = true; });   // 유리·불꽃·연기는 그림자를 만들지 않는다

  // ── ② 식히기 ──
  const B = new THREE.Group(); B.position.y = TH; B.visible = false; stage.root.add(B);
  B.add(table.clone());
  // 얼음물: 두꺼운 투명 그릇 + 물 + 둥근 모서리의 서리 낀 얼음 조각(물 위에 반쯤 뜸)
  const bath = new THREE.Group();
  const bowl = new THREE.Mesh(lathe([[0, 0], [0.6, 0], [0.63, 0.025], [0.77, 0.55], [0.79, 0.575], [0.77, 0.59], [0.75, 0.57], [0.605, 0.045], [0, 0.045]], 56), glassM()); bowl.renderOrder = 2; bath.add(bowl);
  const iceW = new THREE.Mesh(new THREE.CylinderGeometry(0.705, 0.605, 0.38, 48), phys(0x9fd3ef, { op: 0.55, r: 0.05 })); iceW.position.y = 0.235; bath.add(iceW);
  const frost = canvasTex(128, (g, S, r) => { g.fillStyle = '#f4fbff'; g.fillRect(0, 0, S, S); for (let i = 0; i < 500; i++) { g.fillStyle = r() < 0.5 ? 'rgba(255,255,255,0.9)' : 'rgba(170,205,230,0.5)'; g.beginPath(); g.arc(r() * S, r() * S, 0.5 + r() * 1.8, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(150,190,220,0.6)'; g.lineWidth = 0.8; for (let i = 0; i < 10; i++) { g.beginPath(); let x = r() * S, y = r() * S; g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 30; y += (r() - 0.5) * 30; g.lineTo(x, y); } g.stroke(); } });
  const NICE = 11, ice = new THREE.InstancedMesh(K.roundedBoxGeometry(0.17, 0.14, 0.17, 0.04, 2), phys(0xeef8ff, { op: 0.82, r: 0.3, map: frost, dw: true }), NICE);
  for (let i = 0; i < NICE; i++) { const a = (i / NICE) * Math.PI * 2 + hash(i) * 0.4, r = 0.46 + hash(i + 9) * 0.12; V3.set(Math.cos(a) * r, 0.405 + (hash(i + 3) - 0.5) * 0.04, Math.sin(a) * r);
    Q.setFromEuler(new THREE.Euler((hash(i + 5) - 0.5) * 0.7, a, (hash(i + 7) - 0.5) * 0.7)); S3.setScalar(0.8 + hash(i + 11) * 0.45); ice.setMatrixAt(i, M4.compose(V3, Q, S3)); }
  bath.add(ice); bath.visible = false; B.add(bath);
  // 상자(천천히): 모서리가 둥근 스티로폼 상자 + 옆에 기대 둔 뚜껑
  const foamTex = canvasTex(128, (g, S, r) => { g.fillStyle = '#f6f5f0'; g.fillRect(0, 0, S, S); for (let i = 0; i < 700; i++) { const x = r() * S, y = r() * S, rr = 1.5 + r() * 2; g.strokeStyle = 'rgba(200,198,190,0.4)'; g.lineWidth = 0.6; g.beginPath(); g.arc(x, y, rr, 0, 7); g.stroke(); } });
  const boxG = new THREE.Group(); const bw = 1.5, bh = 0.5, bd = 1.5, wallM = new THREE.MeshStandardMaterial({ color: 0xffffff, map: foamTex, roughness: 0.95 });
  for (const [x, z, w, d] of [[0, -bd / 2 + 0.05, bw, 0.1], [0, bd / 2 - 0.05, bw, 0.1], [-bw / 2 + 0.05, 0, 0.1, bd - 0.02], [bw / 2 - 0.05, 0, 0.1, bd - 0.02]]) { const wl = new THREE.Mesh(K.roundedBoxGeometry(w, bh, d, 0.035, 2), wallM); wl.position.set(x, bh / 2, z); boxG.add(wl); }
  const floorB = new THREE.Mesh(K.roundedBoxGeometry(bw, 0.08, bd, 0.03, 2), wallM); floorB.position.y = 0.04; boxG.add(floorB);
  const lid = new THREE.Mesh(K.roundedBoxGeometry(bw + 0.04, 0.09, bd + 0.04, 0.035, 2), wallM); lid.position.set(bw / 2 + 0.9, 0.045, -0.25); lid.rotation.y = 0.35; boxG.add(lid);
  boxG.visible = false; B.add(boxG);
  // 비커: 두께 있는 유리(입구 테·부리) + 눈금 + 백반 물 + 막대 온도계(빨간 액체·아래 구)
  const beaker = new THREE.Group();
  const bgeo = lathe([[0, 0], [0.3, 0], [0.315, 0.015], [0.32, 0.78], [0.335, 0.8], [0.32, 0.815], [0.305, 0.8], [0.3, 0.025], [0, 0.025]], 48);
  { const p = bgeo.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < 0.72) continue; const x = p.getX(i), z = p.getZ(i), rr = Math.hypot(x, z) || 1, k = Math.max(0, x / rr) ** 12 * (y - 0.72) / 0.095; p.setXYZ(i, x * (1 + 0.28 * k), y + 0.02 * k, z * (1 + 0.28 * k)); } bgeo.computeVertexNormals(); }
  const glass = new THREE.Mesh(bgeo, glassM()); glass.renderOrder = 2; beaker.add(glass);
  const tickM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
  for (let i = 1; i <= 6; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(i % 2 ? 0.07 : 0.12, 0.007, 0.003), tickM); t.position.set(-0.05, 0.1 * i, 0.324); beaker.add(t); }
  const sol = new THREE.Mesh(new THREE.CylinderGeometry(0.298, 0.298, 0.55, 40), phys(0xd9e6ee, { op: 0.42, r: 0.05 })); sol.position.y = 0.3; beaker.add(sol);
  const steam = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 8, 6), mat(0xffffff, { r: 1, op: 0.45 }), 40); steam.frustumCulled = false; steam.count = 0; beaker.add(steam);
  const crystals = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), phys(0xf7fbff, { r: 0.12 }), 160); crystals.material.emissive = new THREE.Color(0xcfe4ff); crystals.material.emissiveIntensity = 0.3; crystals.frustumCulled = false; crystals.count = 0; beaker.add(crystals);
  const seeds = Array.from({ length: 160 }, (_, i) => ({ x: (hash(i * 5) - 0.5) * 0.5, z: (hash(i * 5 + 1) - 0.5) * 0.5, y: 0.06 + hash(i * 5 + 2) * 0.42, t: hash(i * 5 + 3), r: 0.6 + hash(i * 5 + 4) * 0.8 }));
  const therm = new THREE.Group(); therm.position.set(0.18, 0, 0); therm.rotation.z = -0.08; beaker.add(therm);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.0, 16), phys(0xf4f8fb, { op: 0.55 })); tube.position.y = 0.75; tube.renderOrder = 3; therm.add(tube);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), mat(0xd8302a, { r: 0.25, e: 0xd8302a, ei: 0.3 })); bulb.scale.y = 1.4; bulb.position.y = 0.23; therm.add(bulb);
  const mercury = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.6, 8), mat(0xe23b2e, { e: 0xe23b2e, ei: 0.4 })); mercury.position.set(0, 0.5, 0); therm.add(mercury);
  beaker.position.y = 3; beaker.visible = false; B.add(beaker);
  B.traverse((o) => { if (o.isMesh && (!o.material.transparent || o === ice)) o.castShadow = true; });
  const setCrystals = (grow, kind) => {
    const fast = kind === '얼음물(빨리)', n = fast ? 150 : 12, size = fast ? 0.028 : 0.11; let k = 0;
    for (let i = 0; i < n; i++) {
      const s = seeds[i], g = Math.max(0, Math.min(1, (grow - s.t * 0.5) / 0.5)); if (g <= 0) continue;
      const sc = size * s.r * (0.3 + 0.7 * g); V3.set(s.x, s.y, s.z); S3.setScalar(sc); Q.setFromAxisAngle(AX, i * 0.7); M4.compose(V3, Q, S3); crystals.setMatrixAt(k++, M4);
    }
    crystals.count = k; crystals.instanceMatrix.needsUpdate = true;
  };

  // ── 상태·단계 ──
  const S = { temp: 20, melt: 0, set: 0, smoke: 0, lit: false, foilY: 4, temp2: 80, grow: 0, beakerY: 3 };
  const viewA = { theta: 0.75, phi: 1.2, dist: 3.5, target: [0.15, 0.95 + TH, 0] }, viewB = { theta: 0.6, phi: 1.25, dist: 3.1, target: [0, 0.5 + TH, 0] };
  const R = (k, v) => { const e = el.querySelector(`[data-r=${k}]`); if (e) e.textContent = v; };
  const $main = $('[data-act=main]');
  const MAIN = { '화산 모형': ['포일 화산 올리기', '불 붙이기', '가열하기 (누르고 있기)', '불 끄기', '표에 적기'], '식히기': ['백반 물 담기', '고르고 다음으로', '식히기 (누르고 있기)', '살펴보고 다음으로', '표에 적기'] };
  const isHold = () => step === 2;
  const renderSteps = () => {
    $('[data-r=steps]').innerHTML = STEPS[exp].map((t, i) => `<li class="${i < step ? 'done' : i === step ? 'on' : ''}"><span>${i + 1}</span>${t}</li>`).join('');
    $main.textContent = MAIN[exp][step]; $main.classList.toggle('pour', isHold()); tip(GUIDE[exp][step]);
  };
  const goStep = (i) => { step = i; renderSteps(); };
  const applyExp = () => {
    A.visible = exp === '화산 모형'; B.visible = !A.visible; stage.setView(A.visible ? viewA : viewB);
    el.querySelectorAll('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== exp; });
    R('l2', A.visible ? '연기' : '결정 크기'); R('l3', A.visible ? '흘러나온 양' : '결정 수'); R('u3', A.visible ? '칸' : '개');
    bath.visible = !A.visible && cool === '얼음물(빨리)'; boxG.visible = !A.visible && !bath.visible; refresh();
  };
  const refresh = () => {
    if (A.visible) {
      R('temp', Math.round(S.temp)); R('v2', S.smoke > 0.6 ? '많이' : S.smoke > 0.15 ? '조금' : '—'); R('v3', Math.round(S.melt * 10));
      setBlobs(S.melt, S.set); flame.visible = flameCore.visible = S.lit; const fl = S.lit ? (holding ? (heat === '강하게' ? 1.3 : 0.85) : 0.6) : 0; flame.scale.set(fl, fl, fl); flameCore.scale.set(fl, fl, fl); flameLight.intensity = S.lit ? (holding ? 4 : 1.5) : 0;
      foil.visible = S.foilY < 3.9; foil.position.y = ringY + 0.02 + Math.max(0, S.foilY);
    } else {
      R('temp', Math.round(S.temp2)); R('v2', S.grow < 0.05 ? '—' : cool === '얼음물(빨리)' ? '작다' : '크다'); R('v3', crystals.count);
      mercury.scale.y = Math.max(0.1, (S.temp2 - 10) / 70); mercury.position.y = 0.2 + 0.3 * mercury.scale.y;
      sol.material.color.set(S.temp2 > 50 ? 0xe9dcd0 : 0xd9e6ee); beaker.visible = S.beakerY < 2.9; beaker.position.y = 0.08 + Math.max(0, S.beakerY);
    }
  };
  const resetAll = () => { Object.assign(S, { temp: 20, melt: 0, set: 0, smoke: 0, lit: false, foilY: 4, temp2: 80, grow: 0, beakerY: 3 }); puffs.length = 0; smoke.count = 0; steam.count = 0; setCrystals(0, cool); holding = false; $main.classList.remove('on'); goStep(0); refresh(); };
  stage.update = (dt, t) => {
    if (A.visible) {
      if (S.foilY > 0) { S.foilY = Math.max(0, S.foilY - dt * 4); }
      if (S.lit && holding) { S.temp = Math.min(260, S.temp + HEATS[heat] * dt); flame.scale.y = (heat === '강하게' ? 1.3 : 0.85) * (1 + Math.sin(t * 20) * 0.08); }
      else S.temp = Math.max(20, S.temp - (S.lit ? 6 : 32) * dt);
      const over = Math.max(0, S.temp - MELT) / 120;
      if (over > 0 && S.melt < FULL && holding) { S.melt = Math.min(FULL, S.melt + over * 0.4 * dt); S.set = 0; }
      S.smoke = Math.max(0, Math.min(1, holding && S.lit ? over * 1.6 : S.smoke - dt * 0.6));
      if (!holding && S.melt > 0 && S.temp < 60) S.set = Math.min(1, S.set + dt * 0.5);
      if (S.smoke > 0.05 && puffs.length < 120 && Math.random() < S.smoke * 0.9) puffs.push({ a: Math.random() * Math.PI * 2, r: Math.random() * 0.05, y: 0, s: 0.4 + Math.random() * 0.5, v: 0.35 + S.smoke * 0.5 });
      let k = 0; for (let i = puffs.length - 1; i >= 0; i--) { const p = puffs[i]; p.y += p.v * dt; p.r += dt * 0.16; if (p.y > 2.2) { puffs.splice(i, 1); continue; }
        V3.set(Math.cos(p.a) * p.r, ringY + 0.8 + p.y, Math.sin(p.a) * p.r); S3.setScalar(p.s * (0.6 + p.y * 0.7)); M4.compose(V3, Q.identity(), S3); smoke.setMatrixAt(k++, M4); }
      smoke.count = k; smoke.instanceMatrix.needsUpdate = true;
      if (step === 2 && S.melt >= FULL && !holding) { goStep(3); tip('마시멜로가 다 흘러나왔어요. <b>불 끄기</b>를 눌러요.'); }
      if (step === 3 && !S.lit && S.set >= 1) { goStep(4); tip('굳었어요! 연기(화산 가스)·흘러나온 것(용암)·굳은 것(화산 암석)을 <b>표에 적어</b>요.'); }
    } else {
      if (S.beakerY > 0) S.beakerY = Math.max(0, S.beakerY - dt * 3);
      if (holding && S.temp2 > 20) S.temp2 = Math.max(20, S.temp2 - COOLS[cool] * dt);
      S.grow = Math.max(S.grow, Math.min(1, (60 - S.temp2) / 40)); setCrystals(S.grow, cool);
      let k = 0; if (S.temp2 > 55 && S.beakerY <= 0) for (let i = 0; i < 40; i++) { const life = ((t * 0.5 + hash(i)) % 1); V3.set((hash(i + 40) - 0.5) * 0.4, 0.62 + life * 0.7, (hash(i + 80) - 0.5) * 0.4); S3.setScalar(0.5 + life * 1.2); M4.compose(V3, Q.identity(), S3); steam.setMatrixAt(k++, M4); }
      steam.count = k; steam.instanceMatrix.needsUpdate = true;
      if (step === 2 && S.temp2 <= 20) { goStep(3); tip(`다 식었어요. ${cool === '얼음물(빨리)' ? '<b>작은 결정이 많이</b>' : '<b>큰 결정이 조금</b>'} 생겼어요. 돌려 보며 살펴보고 다음으로 가요.`); }
    }
    refresh();
  };
  // 주 버튼: 단계에 따라 누르기 / 누르고 있기
  const start = (e) => { e.preventDefault(); if (!isHold()) return; if (A.visible && !S.lit) return; holding = true; $main.classList.add('on'); };
  const stop = () => { if (!holding) return; holding = false; $main.classList.remove('on'); refresh(); };
  $main.addEventListener('pointerdown', start); $main.addEventListener('pointerup', stop); $main.addEventListener('pointerleave', stop); $main.addEventListener('pointercancel', stop);
  $main.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !holding && isHold()) start(e); });
  $main.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') stop(); });
  $main.addEventListener('contextmenu', (e) => e.preventDefault());
  $main.addEventListener('click', () => {
    if (isHold()) return;
    if (A.visible) {
      if (step === 0) { S.foilY = 3.8; goStep(1); }
      else if (step === 1) { S.lit = true; goStep(2); }
      else if (step === 3) { if (S.lit) { S.lit = false; tip('불을 껐어요. 흘러나온 마시멜로가 식으면서 <b>굳어 가요</b>. 잠깐 기다려요.'); } }
      else if (step === 4) record();
    } else {
      if (step === 0) { S.beakerY = 2.8; goStep(1); }
      else if (step === 1) goStep(2);
      else if (step === 3) goStep(4);
      else if (step === 4) record();
    }
    refresh();
  });
  $('[data-act=reset]').addEventListener('click', resetAll);
  el.querySelectorAll('[data-x]').forEach((b) => b.addEventListener('click', () => { exp = b.dataset.x; el.querySelectorAll('[data-x]').forEach((x) => x.setAttribute('aria-selected', x === b)); resetAll(); applyExp(); }));
  const pick = (attr, set) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener('click', () => { set(b.dataset[attr]); el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute('aria-pressed', x === b)); if (step > 2) resetAll(); applyExp(); }));
  pick('h', (v) => { heat = v; }); pick('c', (v) => { cool = v; });
  const renderRows = () => { tbody.innerHTML = rows.length ? rows.map((r) => `<tr><td>${r.exp}</td><td>${r.cond}</td><td>${r.result}</td></tr>`).join('') : '<tr><td colspan="3" class="empty">아직 기록이 없어요.</td></tr>'; };
  function record() {
    let row;
    if (A.visible) {
      if (step < 4) { tip(step < 2 ? '먼저 화산을 올리고 불을 붙여요.' : step === 2 ? '<b>가열하기</b>를 눌러 마시멜로를 다 흘러나오게 해요.' : '<b>불 끄기</b>를 누르고 굳을 때까지 기다려요.'); return; }
      row = { exp: '화산 모형', cond: `불 ${heat}`, result: `연기 ${heat === '강하게' ? '많이' : '조금'}, 흘러나온 양 ${Math.round(S.melt * 10)}칸, 식으니 굳음` };
    } else {
      if (step < 3) { tip('<b>식히기</b>를 눌러 다 식힌 뒤에 적어요.'); return; }
      row = { exp: '식히기', cond: cool, result: cool === '얼음물(빨리)' ? `작은 결정 ${crystals.count}개` : `큰 결정 ${crystals.count}개` };
    }
    const i = rows.findIndex((r) => r.exp === row.exp && r.cond === row.cond); if (i >= 0) rows[i] = row; else rows.push(row);
    renderRows(); onRecord?.(rows); tip('적었어요! 조건을 바꿔 다시 하거나(처음부터), 다른 실험으로 가요.');
  }
  $('[data-act=record]').addEventListener('click', record);
  renderRows(); resetAll(); applyExp();
  watchDetached(el, () => stage.dispose());
  return { rows };
}

// WebGL이 없는 기기: 조건을 고르면 결과를 읽는 실험실
function mountVolcano2D(el, opts = {}) {
  const rows = opts.rows || [], onRecord = opts.onRecord;
  const R = { '불 약하게': ['화산 모형', '연기 조금, 흘러나온 양 4칸, 식으니 굳음'], '불 강하게': ['화산 모형', '연기 많이, 흘러나온 양 9칸, 식으니 굳음'], '얼음물(빨리)': ['식히기', '작은 결정 150개'], '상자(천천히)': ['식히기', '큰 결정 12개'] };
  el.innerHTML = `<p class="lead">이 기기에서는 3D를 보여 줄 수 없어요. 조건을 고르면 실험 결과를 알려 줘요.</p>
    <div class="modes">${Object.keys(R).map((k) => `<button type="button" data-k="${k}">${k}</button>`).join('')}</div><p class="lab3d-tip" data-r="tip">조건을 골라요.</p>
    <table class="lab-table"><thead><tr><th>실험</th><th>조건</th><th>결과</th></tr></thead><tbody></tbody></table>`;
  const tbody = el.querySelector('tbody'), render = () => { tbody.innerHTML = rows.length ? rows.map((r) => `<tr><td>${r.exp}</td><td>${r.cond}</td><td>${r.result}</td></tr>`).join('') : '<tr><td colspan="3" class="empty">아직 기록이 없어요.</td></tr>'; };
  el.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.k, row = { exp: R[k][0], cond: k, result: R[k][1] };
    const i = rows.findIndex((r) => r.cond === k); if (i >= 0) rows[i] = row; else rows.push(row); render(); onRecord?.(rows); el.querySelector('[data-r=tip]').textContent = `${k}: ${R[k][1]}`;
  }));
  render(); return { rows };
}
