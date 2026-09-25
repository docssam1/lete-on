/* 수학 이야기 3D 대표 그림 — 공용 무대(2026-09-26, 원장 "좀 실사 느낌이 되었으면 좋겠어 막대도 실제 막대처럼 정 안되면 3d로").
   책상(나뭇결) · 한지 · 옻칠 막대 · 나무 블록 · 유리 · 금속 같은 실물 재질과 부드러운 그림자로 한 장면을 찍는다.
   글자는 넣지 않는다 — 숫자·수식 기호만(ko·en·zh 공용, assets/images/story 삽화와 같은 규칙).
   scripts/build-hero3d.js 가 장면마다 이 무대를 새로 만들어 assets/hero3d/<유닛>.webp 로 굽는다. */
import * as THREE from '../../../world-explorer/vendor/three.module.js';
export { THREE };

export const W = 1600, H = 1000;

export function makeKit(seed){
  let s = seed || 7;
  const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const r = new THREE.WebGLRenderer({ antialias:true, preserveDrawingBuffer:true });
  r.setSize(W, H); r.setPixelRatio(1);
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.95; r.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#2a1f18');
  const cam = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);

  const canvasTex = (w, h, draw, rep) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    if(rep){ t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping; t.repeat.set(rep[0], rep[1]); }  /* 거울 반복 — 이음매가 안 보이게 */
    return t;
  };

  /* 나뭇결 — 책상·블록 공용 */
  const woodTex = (base, dark, rep, n) => canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for(let i = 0; i < (n || 260); i++){
      const y = rnd() * h;
      g.strokeStyle = `rgba(${dark[0] + rnd() * 30},${dark[1] + rnd() * 20},${dark[2] + rnd() * 10},${0.12 + rnd() * 0.3})`;
      g.lineWidth = 0.6 + rnd() * 3; g.beginPath(); g.moveTo(0, y);
      for(let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / 140 + i) * 6 + Math.sin(x / 37 + i * 3) * 2);
      g.stroke();
    }
  }, rep);

  const table = (opts) => {
    opts = opts || {};
    const m = new THREE.Mesh(new THREE.PlaneGeometry(30, 20),
      new THREE.MeshStandardMaterial({ map:woodTex(opts.base || '#6b4428', [40, 22, 10], [2, 2]), roughness:0.6 }));
    m.rotation.x = -Math.PI / 2; m.receiveShadow = true; scene.add(m); return m;
  };

  /* 한지 — 먹 붓글씨(수식 기호)를 draw(g,w,h,brush) 로 얹는다 */
  const paper = (wd, dp, x, z, rotZ, draw) => {
    const tex = canvasTex(1400, Math.round(1400 * dp / wd), (g, w, h) => {
      g.fillStyle = '#efe3c6'; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 9000; i++){ g.fillStyle = `rgba(${120 + rnd() * 60},${95 + rnd() * 50},${60 + rnd() * 30},${rnd() * 0.08})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 8); }
      for(let i = 0; i < 1400; i++){ g.strokeStyle = `rgba(130,100,60,${0.05 + rnd() * 0.12})`; g.lineWidth = 0.4 + rnd() * 0.8; g.beginPath(); const a = rnd() * w, b = rnd() * h; g.moveTo(a, b); g.bezierCurveTo(a + rnd() * 20 - 10, b + rnd() * 20 - 10, a + rnd() * 40 - 20, b + rnd() * 40 - 20, a + rnd() * 60 - 30, b + rnd() * 60 - 30); g.stroke(); }
      const gr = g.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, Math.max(w, h) * 0.7); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(120,80,35,.34)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      if(draw) draw(g, w, h, inkText);
    });
    const pg = new THREE.PlaneGeometry(wd, dp, 40, 30); const pos = pg.attributes.position;
    for(let i = 0; i < pos.count; i++) pos.setZ(i, (Math.sin(pos.getX(i) * 1.3) + Math.cos(pos.getY(i) * 1.7)) * 0.006 + 0.012);
    pg.computeVertexNormals();
    const m = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ map:tex, roughness:0.95 }));
    m.rotation.x = -Math.PI / 2; m.rotation.z = rotZ || 0; m.position.set(x || 0, 0.02, z || 0); m.receiveShadow = true; scene.add(m); return m;
  };
  /* 먹 글씨 — 붓처럼 여러 번 겹쳐 번지게 */
  function inkText(g, txt, x, y, size, opts){
    opts = opts || {};
    g.save(); g.textAlign = opts.align || 'center'; g.textBaseline = 'middle';
    g.font = `${opts.weight || 700} ${size}px ${opts.font || '"DejaVu Serif", Georgia, serif'}`;
    for(let k = 0; k < 4; k++){ g.globalAlpha = 0.28 + k * 0.16; g.fillStyle = opts.color || 'rgb(28,20,14)'; g.fillText(txt, x + (rnd() - 0.5) * 2, y + (rnd() - 0.5) * 2); }
    g.restore();
  }

  /* 재질 */
  const lacquer = base => {
    const t = canvasTex(64, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 60; i++){ g.fillStyle = `rgba(0,0,0,${rnd() * 0.10})`; g.fillRect(0, rnd() * h, w, 1 + rnd() * 6); }
      for(let i = 0; i < 30; i++){ g.fillStyle = `rgba(255,240,220,${rnd() * 0.05})`; g.fillRect(0, rnd() * h, w, 1 + rnd() * 3); } });
    return new THREE.MeshPhysicalMaterial({ map:t, roughness:0.42, clearcoat:0.55, clearcoatRoughness:0.35, sheen:0.2 });
  };
  const woodMat = (base, dark) => new THREE.MeshStandardMaterial({ map:woodTex(base || '#c89a62', dark || [120, 80, 40], [1, 1], 90), roughness:0.55 });
  const plastic = (color, rough) => new THREE.MeshPhysicalMaterial({ color, roughness:rough == null ? 0.35 : rough, clearcoat:0.3, clearcoatRoughness:0.4 });
  const metal = (color, rough) => new THREE.MeshStandardMaterial({ color:color || '#c9a45c', metalness:0.9, roughness:rough == null ? 0.3 : rough });
  const glass = (tint) => new THREE.MeshPhysicalMaterial({ color:tint || '#ffffff', roughness:0.05, transmission:0.92, thickness:0.2, ior:1.45, transparent:true, opacity:0.55 });
  const cardboard = () => {
    const t = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#b98a57'; g.fillRect(0, 0, w, h);
      for(let i = 0; i < 4000; i++){ g.fillStyle = `rgba(${90 + rnd() * 40},${60 + rnd() * 30},${30 + rnd() * 20},${rnd() * 0.12})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2); }
      for(let x = 0; x < w; x += 9){ g.fillStyle = 'rgba(80,50,25,.05)'; g.fillRect(x, 0, 3, h); } });
    return new THREE.MeshStandardMaterial({ map:t, roughness:0.9 });
  };

  /* 면에 수식을 새긴 판 재질(윗면만) — 블록·타일·카드 */
  const faceTex = (txt, opts) => canvasTex(512, Math.round(512 * (opts.aspect || 1)), (g, w, h) => {
    g.fillStyle = opts.bg || '#f3e7cf'; g.fillRect(0, 0, w, h);
    if(opts.grain){ for(let i = 0; i < 70; i++){ g.strokeStyle = `rgba(120,80,40,${0.05 + rnd() * 0.12})`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); for(let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / 90 + i) * 4); g.stroke(); } }
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = opts.color || '#2b2118';
    g.font = `${opts.weight || 700} ${opts.size || Math.round(h * 0.62)}px ${opts.font || '"DejaVu Serif", Georgia, serif'}`;
    const lines = String(txt).split('\n'), lh = (opts.size || h * 0.62) * 1.05;
    lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * lh + (opts.dy || 0) * h));
  });
  /* 분수·식 한 줄을 판에 그리는 도구 — parts: 문자열 또는 {n, d}(분수). 가운데 정렬로 이어 그린다 */
  const exprTex = (parts, o) => canvasTex(o.pw || 1024, o.ph || 512, (g, w, h) => {
    g.fillStyle = o.bg || '#f3e7cf'; g.fillRect(0, 0, w, h);
    if(o.grain){ for(let i = 0; i < 60; i++){ g.strokeStyle = `rgba(120,80,40,${0.05 + rnd() * 0.1})`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); for(let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / 90 + i) * 4); g.stroke(); } }
    const fs = o.size || h * 0.42, font = sz => `${o.weight || 700} ${sz}px ${o.font || '"DejaVu Serif", Georgia, serif'}`;
    g.fillStyle = o.color || '#2b2118'; g.strokeStyle = o.color || '#2b2118'; g.textBaseline = 'middle';
    const wOf = p => { if(typeof p === 'string'){ g.font = font(fs); return g.measureText(p).width; } if(p.dot != null){ g.font = font(fs); return g.measureText(p.dot).width; } g.font = font(fs * 0.8); return Math.max(g.measureText(p.n).width, g.measureText(p.d).width) + fs * 0.2; };
    const total = parts.reduce((a, p) => a + wOf(p) + fs * 0.08, 0);
    let x = (w - total) / 2; const cy = h / 2;
    parts.forEach(p => { const pw = wOf(p);
      if(typeof p === 'string'){ g.font = font(fs); g.textAlign = 'left'; g.fillText(p, x, cy); }
      else if(p.dot != null){ g.font = font(fs); g.textAlign = 'left'; g.fillText(p.dot, x, cy); g.beginPath(); g.arc(x + pw / 2, cy - fs * 0.62, fs * 0.075, 0, Math.PI * 2); g.fill(); }  /* 순환마디 위 점 */
      else { g.font = font(fs * 0.8); g.textAlign = 'center'; g.fillText(p.n, x + pw / 2, cy - fs * 0.52); g.fillText(p.d, x + pw / 2, cy + fs * 0.58); g.lineWidth = fs * 0.07; g.beginPath(); g.moveTo(x + fs * 0.04, cy); g.lineTo(x + pw - fs * 0.04, cy); g.stroke(); }
      x += pw + fs * 0.08; });
  });
  /* 얇은 판(카드) — 윗면에 exprTex. w×d, 두께 h */
  const card = (parts, x, z, o) => {
    o = o || {};
    const w = o.w || 1.2, d = o.d || 0.8, h = o.h || 0.03;
    const grp = new THREE.Group();
    const body = new THREE.Mesh(rbox(w, h, d, Math.min(0.04, d * 0.1)), o.side || new THREE.MeshStandardMaterial({ color:o.edge || '#e9dcc0', roughness:0.85 }));
    body.castShadow = true; body.receiveShadow = true; grp.add(body);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, d * 0.92), new THREE.MeshStandardMaterial({ map:exprTex(parts, Object.assign({ pw:1024, ph:Math.round(1024 * d / w) }, o)), roughness:0.8 }));
    top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
    grp.position.set(x, o.y || 0, z); grp.rotation.set(o.rx || 0, o.rot || 0, o.rz || 0); scene.add(grp); return grp;
  };
  /* 모서리를 둥글린 상자 */
  const rbox = (w, h, d, rad) => {
    const shape = new THREE.Shape(); const x = -w / 2, y = -d / 2, r0 = Math.min(rad, w / 2, d / 2);
    shape.moveTo(x + r0, y); shape.lineTo(x + w - r0, y); shape.quadraticCurveTo(x + w, y, x + w, y + r0);
    shape.lineTo(x + w, y + d - r0); shape.quadraticCurveTo(x + w, y + d, x + w - r0, y + d);
    shape.lineTo(x + r0, y + d); shape.quadraticCurveTo(x, y + d, x, y + d - r0); shape.lineTo(x, y + r0); shape.quadraticCurveTo(x, y, x + r0, y);
    const bev = Math.min(rad * 0.6, h * 0.3);
    const geo = new THREE.ExtrudeGeometry(shape, { depth:h - bev * 2, bevelEnabled:true, bevelThickness:bev, bevelSize:bev * 0.9, bevelSegments:4, curveSegments:6 });
    geo.rotateX(-Math.PI / 2); geo.translate(0, bev, 0); geo.computeVertexNormals();
    return geo;
  };
  /* 수식이 새겨진 블록: 옆면은 side 재질, 윗면에 글자 판(얇은 판을 살짝 띄워 얹는다) */
  const tile = (txt, x, z, o) => {
    o = o || {};
    const w = o.w || 0.6, d = o.d || 0.6, h = o.h || 0.16;
    const grp = new THREE.Group();
    const body = new THREE.Mesh(rbox(w, h, d, o.rad == null ? 0.05 : o.rad), o.side || woodMat(o.wood || '#d9b27c'));
    body.castShadow = true; body.receiveShadow = true; grp.add(body);
    if(txt != null && txt !== ''){
      const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, d * 0.9),
        new THREE.MeshStandardMaterial({ map:faceTex(txt, Object.assign({ aspect:d / w }, o)), roughness:0.6, transparent:!!o.clear }));
      top.rotation.x = -Math.PI / 2; top.position.y = h + 0.002; top.receiveShadow = true; grp.add(top);
    }
    grp.position.set(x, o.y || 0, z); grp.rotation.y = o.rot || 0; scene.add(grp); return grp;
  };
  /* 옻칠 막대(산가지) */
  const rodGeo = new THREE.CapsuleGeometry(0.055, 2.1, 8, 24);
  const rod = (mat, x, z, rotY, y) => {
    const m = new THREE.Mesh(rodGeo, mat); m.rotation.z = Math.PI / 2; m.castShadow = true; m.receiveShadow = true;
    const g = new THREE.Group(); g.add(m); g.rotation.y = rotY; g.position.set(x, (y || 0) + 0.075, z); scene.add(g); return g;
  };

  /* 반사 환경 — 금속·유리는 비출 것이 없으면 까맣게 나온다. 따뜻한 방(벽) + 밝은 창 몇 개를 PMREM 으로 */
  const env = (o) => {
    o = o || {};
    const room = new THREE.Scene();
    const wall = new THREE.Mesh(new THREE.BoxGeometry(30, 16, 30), new THREE.MeshBasicMaterial({ color:o.wall || '#5a4636', side:THREE.BackSide }));
    wall.position.y = 6; room.add(wall);
    const floorM = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ color:'#3a2616' })); floorM.rotation.x = -Math.PI / 2; floorM.position.y = -1.9; room.add(floorM);
    [[-8, 8, 4, 6, 3, '#fff1dc', 5], [9, 6, -3, 4, 3, '#dfe8ff', 2.2], [0, 13.9, 0, 10, 8, '#fff6e8', 3]].forEach(([x, y, z, w, h, c, it]) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color:new THREE.Color(c).multiplyScalar(it), side:THREE.DoubleSide }));
      p.position.set(x, y, z); p.lookAt(0, 1, 0); room.add(p); });
    const pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(room, 0.04).texture;
    scene.environmentIntensity = o.intensity == null ? 1.0 : o.intensity;
  };

  const lights = (o) => {
    o = o || {};
    if(o.env !== false) env(o.envOpts);
    scene.add(new THREE.HemisphereLight('#fff4e0', '#3a2618', o.hemi == null ? 0.55 : o.hemi));
    const key = new THREE.DirectionalLight('#ffe7c4', o.key == null ? 2.9 : o.key);
    key.position.set(...(o.keyPos || [-5, 6, 4])); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left:-8, right:8, top:8, bottom:-8, near:1, far:30 });
    key.shadow.radius = 8; key.shadow.blurSamples = 16; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.02; scene.add(key);
    const fill = new THREE.DirectionalLight('#b8c8ff', 0.35); fill.position.set(5, 4, -3); scene.add(fill);
    const spot = new THREE.SpotLight('#ffd9a8', o.spot == null ? 26 : o.spot, 22, 0.75, 0.6, 1.4);
    spot.position.set(...(o.spotPos || [0, 7, 1])); spot.target.position.set(...(o.spotAt || [0, 0, 0.3])); scene.add(spot, spot.target);
  };

  /* 구도 — 중심 c 를 가로 폭 width 가 여유 있게 들어오도록, 내려다보는 각 pitch(도)·돌린 각 yaw(도)로 */
  const frame = (c, width, pitch, yaw) => {
    const hf = Math.atan(Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.aspect);
    const dist = (width * 1.12 / 2) / Math.tan(hf);
    const p = THREE.MathUtils.degToRad(pitch == null ? 38 : pitch), y = THREE.MathUtils.degToRad(yaw || 0);
    cam.position.set(c[0] + Math.sin(y) * Math.cos(p) * dist, c[1] + Math.sin(p) * dist, c[2] + Math.cos(y) * Math.cos(p) * dist);
    cam.lookAt(c[0], c[1], c[2]);
  };

  /* 찍고 가장자리를 살짝 어둡게 — 결과 캔버스를 돌려준다 */
  const shoot = () => {
    r.render(scene, cam);
    const out = document.createElement('canvas'); out.width = W; out.height = H; const g2 = out.getContext('2d');
    g2.drawImage(r.domElement, 0, 0);
    const vg = g2.createRadialGradient(W * 0.5, H * 0.52, H * 0.35, W * 0.5, H * 0.52, H * 0.95);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,4,0.5)'); g2.fillStyle = vg; g2.fillRect(0, 0, W, H);
    return out;
  };

  /* 상자 앞면 등 세운 면에 붙이는 라벨(둥근 모서리 두께만큼 띄운다) */
  const label = (txt, w, h, o) => {
    o = o || {};
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map:faceTex(txt, Object.assign({ aspect:h / w }, o)), roughness:0.8 }));
    m.receiveShadow = true; return m;
  };

  return { THREE, r, scene, cam, rnd, canvasTex, woodTex, table, paper, inkText, lacquer, woodMat, plastic, metal, glass, cardboard, faceTex, rbox, tile, rod, label, exprTex, card, frame, env, lights, shoot };
}
