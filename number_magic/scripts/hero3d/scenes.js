/* 유닛별 3D 장면. 장면은 그 유닛의 이야기(data/units/<유닛>.js discover.story 의 hook·history)나 개념 단계에 실제로
   나오는 물건만 쓴다 — 지면에서 새 이야기를 지어내지 않는다. 글자 없이 숫자·수식 기호만. */
export const SCENES = {

  /* 정수 개념 — history: 『구장산술』의 붉은 산가지(+)와 검은 산가지(−) */
  'M-01': { seed:7, build(k){
    const { THREE, cam } = k;
    cam.position.set(-0.3, 3.0, 4.6); cam.lookAt(0.2, 0, 0.15);
    k.table();
    k.paper(6.2, 4.4, 0, 0.35, 0.03, (g, w, h, ink) => { ink(g, '+', w * 0.27, h * 0.14, 150); ink(g, '−', w * 0.6, h * 0.14, 150); });
    const red = k.lacquer('#7d1a10'), black = k.lacquer('#1b1511');
    [-1.35, -1.0, -0.65].forEach(x => k.rod(red, x + (k.rnd() - .5) * 0.03, 0.35, Math.PI / 2 + (k.rnd() - .5) * 0.04));
    [0.75, 1.1].forEach(x => k.rod(black, x + (k.rnd() - .5) * 0.03, 0.35, Math.PI / 2 + (k.rnd() - .5) * 0.04));
    for(let i = 0; i < 7; i++) k.rod(i % 3 ? red : black, -0.2 + (k.rnd() - .5) * 0.4, -2.45 + i * 0.115, 0.08 + (k.rnd() - .5) * 0.12, (i % 2) * 0.1);
    for(let i = 0; i < 4; i++) k.rod(i % 2 ? black : red, 2.6 + (k.rnd() - .5) * 0.2, -0.2 + i * 0.13, 0.55 + (k.rnd() - .5) * 0.08);
    k.lights({ env:false, spot:12, key:2.5, hemi:0.45 });
  }},

  /* 일차방정식 — hook: 양팔저울 왼쪽 상자 하나와 추 3개, 오른쪽 추 9개, 평형 */
  'M-50': { seed:11, build(k){
    const { THREE, scene, cam } = k;
    cam.position.set(0, 3.1, 6.4); cam.lookAt(0, 1.25, 0);
    k.table({ base:'#5e3b22' });
    const brass = k.metal('#b8914a', 0.3), dark = k.metal('#3b3024', 0.5);
    const add = (geo, mat, x, y, z, rx, ry, rz) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, rz || 0); m.castShadow = m.receiveShadow = true; scene.add(m); return m; };
    /* 받침·기둥·가로대 */
    add(new THREE.CylinderGeometry(0.75, 0.9, 0.18, 48), k.woodMat('#4a2c17', [30, 15, 6]), 0, 0.09, 0);
    add(new THREE.CylinderGeometry(0.07, 0.09, 2.3, 24), brass, 0, 1.3, 0);
    add(new THREE.SphereGeometry(0.12, 24, 16), brass, 0, 2.5, 0);
    add(new THREE.BoxGeometry(4.2, 0.07, 0.1), brass, 0, 2.42, 0);
    add(new THREE.ConeGeometry(0.06, 0.28, 12), dark, 0, 2.62, 0.06, Math.PI);
    /* 접시 두 개(사슬 대신 가는 막대 셋) */
    const pan = (x) => {
      const y = 0.95;
      add(new THREE.CylinderGeometry(0.95, 0.8, 0.07, 48), brass, x, y, 0);
      for(let i = 0; i < 3; i++){ const a = [-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6][i]; const px = x + Math.cos(a) * 0.72, pz = Math.sin(a) * 0.72;
        const top = new THREE.Vector3(x, 2.4, 0), bot = new THREE.Vector3(px, y + 0.04, pz); const len = top.distanceTo(bot);
        const m = add(new THREE.CylinderGeometry(0.008, 0.008, len, 6), dark, (px + x) / 2, (y + 2.4) / 2, pz / 2);
        m.lookAt(top); m.rotateX(Math.PI / 2); }
      return y + 0.035;
    };
    const yl = pan(-1.85), yr = pan(1.85);
    /* 추(황동 원기둥) — 같은 크기 */
    const wt = (x, y, z) => { add(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 32), brass, x, y + 0.11, z); add(new THREE.CylinderGeometry(0.05, 0.06, 0.06, 16), brass, x, y + 0.25, z); };
    [[-1.5, 0.2], [-1.25, -0.15], [-1.85, 0.4]].forEach(([x, z]) => wt(x, yl, z));
    [[1.35, -0.4], [1.65, -0.4], [1.95, -0.4], [1.35, -0.05], [1.65, -0.05], [1.95, -0.05], [1.5, 0.3], [1.8, 0.3], [2.1, 0.3]].forEach(([x, z]) => wt(x, yr, z));
    /* 무게를 모르는 상자 x */
    const box = new THREE.Mesh(k.rbox(0.62, 0.55, 0.62, 0.04), k.cardboard()); box.position.set(-2.1, yl, -0.2); box.castShadow = box.receiveShadow = true; scene.add(box);
    const lab = k.label('x', 0.38, 0.38, { bg:'#efe3c6', size:330, weight:'italic 700' }); lab.position.set(-2.1, yl + 0.29, -0.2 + 0.31 + 0.03); scene.add(lab);
    k.lights({ key:3.4, keyPos:[-4, 7, 5], spotPos:[0, 8, 2], spotAt:[0, 1, 0], spot:40 });
  }},

  /* 좌표 — hook: 영화관 표의 "F열 12번", 두 수로 자리 하나 */
  'M-68': { seed:5, build(k){
    const { THREE, scene, cam } = k;
    scene.background = new THREE.Color('#170d0c');
    cam.position.set(-3.2, 5.2, 5.4); cam.lookAt(0.4, 0.6, -2.4);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), new THREE.MeshStandardMaterial({ color:'#2b1616', roughness:0.95 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const velvet = new THREE.MeshPhysicalMaterial({ color:'#8a1a1f', roughness:0.8, sheen:1, sheenColor:new THREE.Color('#ff8a8a'), sheenRoughness:0.5 });
    const gold = new THREE.MeshPhysicalMaterial({ color:'#e2ae4a', roughness:0.5, sheen:1, sheenColor:new THREE.Color('#ffe6a0'), sheenRoughness:0.4, emissive:'#4a3000', emissiveIntensity:0.35 });
    const blackM = k.metal('#2a2a2a', 0.45);
    const cols = 10, rows = 6, HOT = [7, 3], STEP = 0.24, DEPTH = 1.0, GAP = 0.74;
    for(let r0 = 0; r0 < rows; r0++){
      const st = new THREE.Mesh(new THREE.BoxGeometry(cols * GAP + 1.2, STEP * (r0 + 1), DEPTH), new THREE.MeshStandardMaterial({ color:'#3d1f1e', roughness:0.9 }));
      st.position.set(0, STEP * (r0 + 1) / 2 - 0.001, -r0 * DEPTH); st.receiveShadow = true; st.castShadow = true; scene.add(st);
      for(let c = 0; c < cols; c++){
        const hot = r0 === HOT[1] && c === HOT[0], mat = hot ? gold : velvet;
        const g = new THREE.Group();
        const s0 = new THREE.Mesh(k.rbox(0.62, 0.16, 0.55, 0.07), mat); s0.position.y = 0.42;
        const b0 = new THREE.Mesh(k.rbox(0.62, 0.72, 0.14, 0.07), mat); b0.position.set(0, 0.5, -0.3); b0.rotation.x = 0.12;
        const l0 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.4), blackM); l0.position.set(0.35, 0.22, -0.05);
        [s0, b0, l0].forEach(m => { m.castShadow = m.receiveShadow = true; g.add(m); });
        g.position.set((c - (cols - 1) / 2) * GAP, STEP * (r0 + 1), -r0 * DEPTH + 0.1); scene.add(g);
      }
    }
    scene.add(new THREE.HemisphereLight('#ffd9c0', '#301010', 0.8));
    k.env({ intensity:0.5 });
    const key = new THREE.DirectionalLight('#ffd6b0', 2.2); key.position.set(-4, 9, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left:-9, right:9, top:9, bottom:-9, near:1, far:30 }); key.shadow.radius = 6; key.shadow.bias = -0.0005; scene.add(key);
    const hx = (HOT[0] - (cols - 1) / 2) * GAP, hz = -HOT[1] * DEPTH, hy = STEP * (HOT[1] + 1);
    const spot = new THREE.SpotLight('#fff1c8', 90, 16, 0.14, 0.45, 1.2); spot.position.set(hx - 1, hy + 7, hz + 2.5); spot.target.position.set(hx, hy + 0.4, hz); spot.castShadow = true; scene.add(spot, spot.target);
  }},

  /* 수직선 위의 위치 — hook: 온도계를 눕히면 그대로 수직선(0 가운데, 오른쪽 양수, 왼쪽 음수) */
  'M-82': { seed:21, build(k){
    const { THREE, scene } = k;
    k.frame([0, 0, 0.1], 6.2, 52);
    k.table();
    const PW = 6.6, U = PW * 0.074;           /* 종이 수직선 한 칸 = 온도계 눈금 한 칸 */
    k.paper(PW, 3.4, 0, 0.1, 0, (g, w, h, ink) => {
      const y = h * 0.66, sx = n => w * (0.5 + n * 0.074);
      g.strokeStyle = 'rgba(28,20,14,.85)'; g.lineWidth = 7; g.beginPath(); g.moveTo(w * 0.06, y); g.lineTo(w * 0.95, y); g.stroke();
      g.beginPath(); g.moveTo(w * 0.95, y); g.lineTo(w * 0.925, y - 18); g.moveTo(w * 0.95, y); g.lineTo(w * 0.925, y + 18); g.stroke();
      for(let n = -5; n <= 5; n++){ g.lineWidth = n === 0 ? 8 : 5; g.beginPath(); g.moveTo(sx(n), y - (n === 0 ? 34 : 22)); g.lineTo(sx(n), y + (n === 0 ? 34 : 22)); g.stroke();
        ink(g, n > 0 ? '+' + n : n < 0 ? '−' + (-n) : '0', sx(n), y + 80, 58); }
    });
    /* 온도계: 흰 눈금판 + 유리관 + 붉은 액체. 구부(액체 통)는 음수 끝, 액체는 +2 까지 */
    const BL = 11 * U + 0.5, tz = -0.5;
    const board = new THREE.Mesh(k.rbox(BL, 0.06, 0.5, 0.08), new THREE.MeshStandardMaterial({ color:'#f3f0e7', roughness:0.5 }));
    const scaleTop = new THREE.Mesh(new THREE.PlaneGeometry(BL - 0.12, 0.44), new THREE.MeshStandardMaterial({ map:k.canvasTex(2048, 186, (g, w, h) => {
      g.fillStyle = '#f6f3ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#2b2b2b';
      const px = t => w * (0.5 + t * U / (BL - 0.12));
      for(let t = -55; t <= 55; t++){ const tt = t / 10, big = t % 10 === 0, mid = t % 5 === 0; g.fillRect(px(tt) - (big ? 3 : 1.5), h * 0.08, big ? 6 : 3, h * (big ? 0.4 : mid ? 0.28 : 0.16)); }
      g.font = '700 52px "DejaVu Sans", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      for(let t = -5; t <= 5; t++) g.fillText(t > 0 ? '+' + t : t < 0 ? '−' + (-t) : '0', px(t), h * 0.74); }), roughness:0.5 }));
    board.position.set(0, 0.05, tz); board.castShadow = board.receiveShadow = true; scene.add(board);
    scaleTop.rotation.x = -Math.PI / 2; scaleTop.position.set(0, 0.112, tz + 0.02); scaleTop.receiveShadow = true; scene.add(scaleTop);
    const tubeY = 0.24, tzz = tz - 0.17, x0 = -5.6 * U;
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 11.2 * U, 32), k.glass()); tube.rotation.z = Math.PI / 2; tube.position.set(0, tubeY, tzz); scene.add(tube);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 24), new THREE.MeshPhysicalMaterial({ color:'#b3141b', roughness:0.15, clearcoat:1 })); bulb.position.set(x0 - 0.1, tubeY, tzz); bulb.castShadow = true; scene.add(bulb);
    const xEnd = 2 * U, len = xEnd - x0;
    const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, len, 16), new THREE.MeshPhysicalMaterial({ color:'#c0161e', roughness:0.2, clearcoat:1 }));
    liq.rotation.z = Math.PI / 2; liq.position.set(x0 + len / 2, tubeY, tzz); scene.add(liq);
    k.lights({ envOpts:{ intensity:0.35 } });
  }},

  /* 정수의 덧셈 — hook: 용돈 5(만 원)이 있는데 빌린 돈이 3(만 원). history: 재산은 +, 빚은 − */
  'M-02': { seed:31, build(k){
    const { THREE, scene, cam } = k;
    k.frame([0, 0, 0.1], 5.2, 50);
    k.table();
    k.paper(5.6, 3.4, 0, 0.1, 0.02, (g, w, h, ink) => {
      g.strokeStyle = 'rgba(28,20,14,.55)'; g.lineWidth = 6; g.setLineDash([18, 14]);
      for(let i = 0; i < 3; i++){ g.beginPath(); g.ellipse(w * (0.22 + i * 0.14), h * 0.5, w * 0.058, h * 0.33, 0, 0, Math.PI * 2); g.stroke(); }
      g.setLineDash([]);
    });
    const gold = k.metal('#e6bd5c', 0.22);
    const coin = (x, z) => { const grp = new THREE.Group();
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 48), gold); c.castShadow = c.receiveShadow = true; grp.add(c);
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.22, 40), new THREE.MeshStandardMaterial({ map:k.faceTex('+', { bg:'#c89b3e', color:'#6b4c12', size:360 }), metalness:0.8, roughness:0.35 }));
      face.rotation.x = -Math.PI / 2; face.position.y = 0.031; grp.add(face); grp.position.set(x, 0.05, z); scene.add(grp); };
    const chip = (x, z) => { const grp = new THREE.Group();
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.07, 48), k.plastic('#9c1c1c', 0.4)); c.castShadow = c.receiveShadow = true; grp.add(c);
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.22, 40), new THREE.MeshStandardMaterial({ map:k.faceTex('−', { bg:'#a52424', color:'#f5e6d0', size:360 }), roughness:0.45 }));
      face.rotation.x = -Math.PI / 2; face.position.y = 0.036; grp.add(face); grp.position.set(x, 0.055, z); scene.add(grp); };
    const X = i => -1.72 + i * 0.78;
    for(let i = 0; i < 5; i++) coin(X(i), -0.35);
    for(let i = 0; i < 3; i++) chip(X(i), 0.55);
    k.lights({ envOpts:{ intensity:1.0 } });
  }},

  /* 유리수의 덧셈 — hook: 산을 시속 10으로 오르고 30으로 내려옴. 오를 때 3시간, 내려올 때 1시간(history) */
  'M-03': { seed:41, build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.55, 0.2], 7.2, 26);
    k.table();
    const hAt = (x, z) => { const r2 = (x * x) / 2.0 + (z * z) / 1.3; let hgt = 1.75 * Math.exp(-r2 * 1.05);
      hgt += 0.06 * Math.sin(x * 4.1 + z * 2.3) * Math.exp(-r2 * 0.4) + 0.04 * Math.sin(z * 6.3 - x * 3.1) * Math.exp(-r2 * 0.4); return Math.max(0, hgt); };
    const geo = new THREE.PlaneGeometry(5.0, 3.2, 200, 130); geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position, col = [];
    for(let i = 0; i < pos.count; i++){ const x = pos.getX(i), z = pos.getZ(i), y = hAt(x, z); pos.setY(i, y + 0.12);
      const c = new THREE.Color(y > 1.45 ? '#eeeae2' : y > 0.9 ? '#7b6b52' : y > 0.25 ? '#56703d' : '#6f8a45'); c.offsetHSL(0, 0, (k.rnd() - 0.5) * 0.05); col.push(c.r, c.g, c.b); }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.computeVertexNormals();
    const land = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors:true, roughness:0.92 })); land.castShadow = land.receiveShadow = true; land.position.z = -0.3; scene.add(land);
    const base = new THREE.Mesh(k.rbox(5.1, 0.12, 3.3, 0.05), k.woodMat('#4a2c17', [30, 15, 6])); base.position.z = -0.3; base.castShadow = base.receiveShadow = true; scene.add(base);
    /* 산길: 왼쪽은 굽이굽이 오르고(느린 오르막) 오른쪽은 곧게 내려온다 */
    const pts = [];
    for(let t = 0; t <= 1.0001; t += 0.02){ const x = -2.2 + t * 2.2, z = 0.55 * Math.sin(t * Math.PI * 3) * (1 - t); pts.push(new THREE.Vector3(x, hAt(x, z) + 0.15, z)); }
    for(let t = 0.02; t <= 1.0001; t += 0.02){ const x = t * 2.2, z = 0.12 * t; pts.push(new THREE.Vector3(x, hAt(x, z) + 0.15, z)); }
    const road = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.03, 8), new THREE.MeshStandardMaterial({ color:'#e8dcc0', roughness:0.9 }));
    road.position.z = -0.3; road.castShadow = true; scene.add(road);
    const hg = (x, z) => { const grp = new THREE.Group(); const wood = k.woodMat('#5b3a1f', [30, 15, 5]);
      [0, 0.72].forEach(y => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32), wood); p.position.y = y + 0.025; p.castShadow = p.receiveShadow = true; grp.add(p); });
      for(let i = 0; i < 3; i++){ const a = i * Math.PI * 2 / 3; const post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.67, 8), wood); post.position.set(Math.cos(a) * 0.16, 0.385, Math.sin(a) * 0.16); post.castShadow = true; grp.add(post); }
      const prof = []; for(let t = 0; t <= 20; t++){ const y = t / 20; prof.push(new THREE.Vector2(0.02 + 0.11 * Math.pow(Math.abs(y - 0.5) * 2, 0.7), y * 0.62)); }
      const gl = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), k.glass()); gl.position.y = 0.05; grp.add(gl);
      const sandM = new THREE.MeshStandardMaterial({ color:'#e0c38a', roughness:0.9 });
      const sb = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.12, 24), sandM); sb.position.y = 0.11; grp.add(sb);
      const st = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.1, 24), sandM); st.rotation.x = Math.PI; st.position.y = 0.48; grp.add(st);
      grp.position.set(x, 0, z); scene.add(grp); };
    /* 오르막 쪽 모래시계 셋(3시간), 내리막 쪽 하나(1시간) */
    [[-2.9, 1.75], [-2.35, 1.95], [-1.8, 1.75]].forEach(([x, z]) => hg(x, z));
    hg(2.3, 1.85);
    k.lights({ envOpts:{ intensity:0.5 } });
  }},

  /* 문자식 — hook: 사탕 한 개 a원, 3개를 사면 3a */
  'M-47': { seed:51, build(k){
    const { THREE, scene, cam } = k;
    k.frame([-0.2, 0.45, 0.25], 5.6, 30);
    k.table();
    k.paper(4.6, 2.6, 0.9, 1.0, -0.03, (g, w, h, ink) => { ink(g, '3 × a = 3a', w * 0.5, h * 0.5, 120, { weight:'italic 700' }); });
    const jarProf = [[0, 0], [0.62, 0], [0.7, 0.08], [0.72, 1.2], [0.6, 1.36], [0.46, 1.42], [0.46, 1.52]].map(p => new THREE.Vector2(p[0], p[1]));
    const jar = new THREE.Mesh(new THREE.LatheGeometry(jarProf, 64), k.glass('#eef6ff')); jar.position.set(-1.5, 0, -0.3); scene.add(jar);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.12, 48), k.metal('#b8914a', 0.3)); lid.position.set(-1.5, 1.58, -0.3); lid.castShadow = true; scene.add(lid);
    const cols = ['#e2453c', '#f2b134', '#3b8ed0', '#46a35a', '#e86fa6', '#8e5cc9'];
    const candy = (x, y, z, c) => { const grp = new THREE.Group(); const m = k.plastic(c, 0.25);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), m); b.scale.set(1.3, 1, 1); grp.add(b);
      [-1, 1].forEach(sn => { const t = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.14, 16), m); t.rotation.z = sn * Math.PI / 2; t.position.x = sn * 0.22; grp.add(t); });
      grp.children.forEach(o => { o.castShadow = o.receiveShadow = true; }); grp.position.set(x, y, z); grp.rotation.set(k.rnd() * 3, k.rnd() * 3, k.rnd() * 3); scene.add(grp); return grp; };
    for(let i = 0; i < 38; i++){ const a = k.rnd() * Math.PI * 2, rr = Math.sqrt(k.rnd()) * 0.5; candy(-1.5 + Math.cos(a) * rr, 0.16 + (i / 38) * 0.95, -0.3 + Math.sin(a) * rr, cols[i % cols.length]); }
    /* 값을 모르는 가격표 a */
    const tag = k.label('a', 0.42, 0.3, { bg:'#f3e2b8', size:230, weight:'italic 700' }); tag.position.set(-1.5, 0.75, 0.43); tag.rotation.y = 0.05; scene.add(tag);
    /* 산 사탕 셋 */
    [0.2, 0.8, 1.4].forEach((x, i) => { const c = candy(x, 0.14, 0.1, cols[i * 2]); c.rotation.set(0, 0.3 * i, 0); });
    k.lights({ envOpts:{ intensity:0.6 } });
  }},

  /* 식의 값 — 3x+2 에서 x=4: 같은 상자 x 셋 + 낱개 둘, 한 상자를 열면 4개 */
  'M-48': { seed:61, build(k){
    const { THREE, scene, cam } = k;
    k.frame([-0.3, 0.1, 0.35], 6.0, 46);
    k.table();
    k.paper(5.8, 3.4, 0, 0.3, 0.02, (g, w, h, ink) => { ink(g, '3x + 2', w * 0.5, h * 0.13, 110, { weight:'italic 700' }); ink(g, 'x = 4', w * 0.84, h * 0.86, 80, { weight:'italic 700' }); });
    const cube = (x, y, z, c) => { const m = new THREE.Mesh(k.rbox(0.2, 0.2, 0.2, 0.025), k.woodMat(c || '#d9b27c')); m.position.set(x, y, z); m.rotation.y = (k.rnd() - 0.5) * 0.2; m.castShadow = m.receiveShadow = true; scene.add(m); };
    const box = (x, z, open) => { const cb = k.cardboard();
      const grp = new THREE.Group();
      if(!open){ const b = new THREE.Mesh(k.rbox(0.7, 0.42, 0.7, 0.03), cb); b.castShadow = b.receiveShadow = true; grp.add(b);
        const l = k.label('x', 0.34, 0.34, { bg:'#efe3c6', size:300, weight:'italic 700' }); l.rotation.x = -Math.PI / 2; l.position.y = 0.425; grp.add(l); }
      else {
        const t = 0.03; [[0, 0.01, 0, 0.7, 0.02, 0.7], [-0.335, 0.21, 0, t, 0.42, 0.7], [0.335, 0.21, 0, t, 0.42, 0.7], [0, 0.21, -0.335, 0.7, 0.42, t], [0, 0.21, 0.335, 0.7, 0.42, t]].forEach(([px, py, pz, w, h, d]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), cb); m.position.set(px, py, pz); m.castShadow = m.receiveShadow = true; grp.add(m); });
      }
      grp.position.set(x, 0.03, z); scene.add(grp); return grp; };
    box(-2.0, 0.3); box(-1.1, 0.3); box(-0.2, 0.3, true);
    [[-0.3, -0.07], [-0.08, -0.07], [-0.3, 0.15], [-0.08, 0.15]].forEach(([x, z]) => cube(x, 0.07, 0.3 + z));
    cube(0.95, 0.03, 0.35); cube(1.3, 0.03, 0.35);
    k.lights({ envOpts:{ intensity:0.35 } });
  }},

  /* 정수의 곱셈 — 음수를 곱할 때마다 방향이 뒤집힌다: 컵을 한 번 뒤집으면 −, 두 번이면 다시 + */
  'M-04': { seed:71, build(k){
    const { THREE, scene, cam } = k;
    k.frame([0, 0.25, 0.35], 6.8, 28);
    k.table();
    k.paper(6.4, 3.2, 0, 0.4, 0, (g, w, h, ink) => {
      ink(g, '+', w * 0.2, h * 0.85, 110); ink(g, '−', w * 0.5, h * 0.85, 110); ink(g, '+', w * 0.8, h * 0.85, 110);
      ink(g, '× (−1)', w * 0.35, h * 0.1, 76); ink(g, '× (−1)', w * 0.65, h * 0.1, 76);
      g.strokeStyle = 'rgba(28,20,14,.75)'; g.lineWidth = 6; [[0.25, 0.45], [0.55, 0.75]].forEach(([a, b]) => { g.beginPath(); g.moveTo(w * a, h * 0.22); g.quadraticCurveTo(w * (a + b) / 2, h * 0.14, w * b, h * 0.22); g.stroke(); g.beginPath(); g.moveTo(w * b, h * 0.22); g.lineTo(w * b - 22, h * 0.19); g.moveTo(w * b, h * 0.22); g.lineTo(w * b - 12, h * 0.15); g.stroke(); });
    });
    const prof = [[0, 0], [0.34, 0], [0.36, 0.02], [0.44, 0.78], [0.46, 0.8], [0.42, 0.8], [0.34, 0.06], [0, 0.06]].map(p => new THREE.Vector2(p[0], p[1]));
    const cupM = new THREE.MeshPhysicalMaterial({ color:'#f4efe6', roughness:0.25, clearcoat:0.8 });
    const bandM = new THREE.MeshPhysicalMaterial({ color:'#2f6f9f', roughness:0.3, clearcoat:0.6 });
    const cup = (x, flip) => { const grp = new THREE.Group();
      const c = new THREE.Mesh(new THREE.LatheGeometry(prof, 64), cupM); c.castShadow = c.receiveShadow = true; grp.add(c);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.405, 0.12, 64, 1, true), bandM); b.position.y = 0.62; grp.add(b);
      if(flip){ grp.rotation.x = Math.PI; grp.position.set(x, 0.82, 0.55); } else grp.position.set(x, 0.03, 0.55);
      scene.add(grp); };
    cup(-2.0, false); cup(0, true); cup(2.0, false);
    k.lights({ envOpts:{ intensity:0.45 } });
  }},

  /* 거듭제곱과 부호 — (−2)⁴ = 16 과 −2⁴ = −16: 괄호 하나가 답을 바꾼다(돋보기로 괄호를 본다) */
  'M-05': { seed:81, build(k){
    const { THREE, scene, cam } = k;
    k.frame([0.1, 0, 0], 5.4, 50);
    k.table();
    /* 지수는 작은 판을 위로 올려(윗첨자 자리) */
    const row = (parts, z) => { let x = -2.3; parts.forEach(p => { const sup = p === '^4', t = sup ? '4' : p;
      const w = sup ? 0.4 : t.length > 2 ? 0.95 : t.length > 1 ? 0.72 : 0.5;
      const par = /^[()]$/.test(t);
      k.tile(t, x + w / 2, z - (sup ? 0.14 : 0), { w, d:sup ? 0.36 : 0.62, h:sup ? 0.12 : 0.16, size:sup ? 330 : /^[()+×=]$/.test(t) ? 400 : 270, grain:!par, bg:par ? '#a3231c' : undefined, color:par ? '#f7ead2' : undefined, side:par ? k.lacquer('#8c1c14') : undefined }); x += w + 0.06; }); };
    row(['(', '−2', ')', '^4', '=', '16'], -0.55);
    row(['−2', '^4', '=', '−16'], 0.55);
    k.lights({ envOpts:{ intensity:0.45 } });
  }},

  /* 혼합 계산 — −5 + 3 × (−4): 곱셈 먼저(①), 덧셈 나중(②) — 순서를 적은 조약돌 */
  'M-06': { seed:91, build(k){
    const { THREE, scene, cam } = k;
    k.frame([-0.1, 0, 0.05], 5.4, 42);
    k.table();
    let x = -2.35; const xs = [];
    ['−5', '+', '3', '×', '(', '−4', ')'].forEach(p => { const w = p.length > 1 ? 0.75 : 0.52; k.tile(p, x + w / 2, 0.35, { w, d:0.62, size:/^[()+×]$/.test(p) ? 400 : 290, grain:true }); xs.push(x + w / 2); x += w + 0.06; });
    const stone = (n, px, pz) => { const geo = new THREE.SphereGeometry(0.26, 32, 20); geo.scale(1, 0.42, 0.9);
      const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color:'#3c4550', roughness:0.35, clearcoat:0.6 })); m.castShadow = m.receiveShadow = true; m.position.set(px, 0.1, pz); scene.add(m);
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), new THREE.MeshStandardMaterial({ map:k.faceTex(n, { bg:'#3c4550', color:'#f2e8d4', size:330 }), transparent:false, roughness:0.4 }));
      face.rotation.x = -Math.PI / 2; face.position.set(px, 0.215, pz); scene.add(face); };
    stone('1', xs[3], -0.55); stone('2', xs[1], -0.55);
    k.lights({ envOpts:{ intensity:0.4 } });
  }},

  /* 일차식 — hook: 상자 앞의 수는 상자 "안의 모든 것"에 곱해진다. 3(2x+5): 같은 상자 셋, 상자마다 x 둘과 1 다섯 */
  'M-49': { seed:101, build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.15, 0.3], 6.4, 50);
    k.table();
    k.paper(6.4, 3.6, 0, 0.35, 0, (g, w, h, ink) => { ink(g, '3(2x + 5)', w * 0.5, h * 0.12, 104, { weight:'italic 700' }); });
    const cb = k.cardboard(), t = 0.03;
    const openBox = (cx, cz) => { const grp = new THREE.Group();
      [[0, 0.01, 0, 1.4, 0.02, 1.0], [-0.685, 0.16, 0, t, 0.32, 1.0], [0.685, 0.16, 0, t, 0.32, 1.0], [0, 0.16, -0.485, 1.4, 0.32, t], [0, 0.16, 0.485, 1.4, 0.32, t]].forEach(([px, py, pz, w, h, d]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), cb); m.position.set(px, py, pz); m.castShadow = m.receiveShadow = true; grp.add(m); });
      /* x 막대 둘 */
      [-0.3, 0.05].forEach(dz => { const r = new THREE.Mesh(k.rbox(0.9, 0.12, 0.26, 0.04), k.woodMat('#6e8fb3', [40, 60, 90])); r.position.set(-0.2, 0.03, dz - 0.05); r.castShadow = r.receiveShadow = true; grp.add(r);
        const l = k.label('x', 0.22, 0.2, { bg:'#dbe7f3', size:360, weight:'italic 700' }); l.rotation.x = -Math.PI / 2; l.position.set(-0.2, 0.155, dz - 0.05); grp.add(l); });
      /* 1 다섯 */
      for(let i = 0; i < 5; i++){ const c = new THREE.Mesh(k.rbox(0.16, 0.16, 0.16, 0.02), k.woodMat('#d9b27c')); c.position.set(0.47, 0.03, -0.38 + i * 0.19); c.castShadow = c.receiveShadow = true; grp.add(c); }
      grp.position.set(cx, 0.03, cz); scene.add(grp); };
    [-2.0, 0, 2.0].forEach(x => openBox(x, 0.55));
    k.lights({ envOpts:{ intensity:0.4 } });
  }},

  /* 일차방정식의 활용 — hook: 연속하는 세 수의 합이 48 → (x−1)+x+(x+1) = 3x, −1 과 +1 이 지워진다(15·16·17) */
  'M-70': { seed:111, build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.9, 0.2], 5.6, 22);
    k.table();
    const U = 0.12, cube = k.woodMat('#d9b27c');
    const col = (x, n, top) => { for(let i = 0; i < n; i++){ const m = new THREE.Mesh(k.rbox(0.5, U - 0.006, 0.5, 0.02), i === n - 1 && top ? k.woodMat('#b8433a', [80, 20, 15]) : cube); m.position.set(x, i * U, 0); m.castShadow = m.receiveShadow = true; scene.add(m); } };
    col(-1.1, 15); col(0, 16); col(1.1, 16);
    /* 17 의 맨 위 한 칸을 떼어 15 쪽으로 옮기는 중 — 옮기고 나면 셋 다 16 */
    const mv = new THREE.Mesh(k.rbox(0.5, U - 0.006, 0.5, 0.02), k.woodMat('#b8433a', [80, 20, 15])); mv.position.set(-0.55, 15 * U + 0.42, 0); mv.rotation.z = 0.22; mv.castShadow = true; scene.add(mv);
    [[-1.1, 'x − 1'], [0, 'x'], [1.1, 'x + 1']].forEach(([x, t]) => k.card([t], x, 0.75, { w:0.9, d:0.42, size:300, weight:'italic 700' }));
    k.lights({ envOpts:{ intensity:0.45 }, keyPos:[-5, 7, 5] });
  }},

  /* 유리수의 나눗셈 — 나눗셈은 역수를 곱하는 것: ÷ 2/5 → × 5/2, 카드를 뒤집는다 */
  'M-07': { seed:121, build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.2, 0.2], 6.2, 40);
    k.table();
    const c = (parts, x, o) => k.card(parts, x, 0.25, Object.assign({ w:0.9, d:1.0, size:560 }, o || {}));
    c([{ n:'3', d:'4' }], -2.4);
    k.tile('÷', -1.5, 0.25, { w:0.5, d:0.5, size:400, grain:true });
    /* 뒤집히는 중인 카드: 앞면 2/5 가 들려 있다 */
    const fl = c([{ n:'2', d:'5' }], -0.5, { y:0.3, rz:-0.75 });
    k.tile('×', 0.55, 0.25, { w:0.5, d:0.5, size:400, grain:true });
    c([{ n:'5', d:'2' }], 1.45, { bg:'#f7e4b5' });
    k.lights({ envOpts:{ intensity:0.45 } });
  }},

  /* 유한소수 — hook: 0.375 는 끝나는데 1/3 = 0.333… 은 왜 안 끝날까. 짧은 띠와 끝없이 풀리는 두루마리 */
  'M-08': { seed:131, build(k){
    const { THREE, scene } = k;
    k.frame([0.2, 0.1, 0.05], 6.4, 46);
    k.table();
    const tapeTex = (txt, len) => k.canvasTex(Math.round(len * 300), 90, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#26221c'; g.font = '700 78px "DejaVu Sans Mono", monospace'; g.textBaseline = 'middle'; g.fillText(txt, 20, h / 2 + 3); });
    const tape = (txt, len, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.3), new THREE.MeshStandardMaterial({ map:tapeTex(txt, len), roughness:0.8 }));
      m.rotation.x = -Math.PI / 2; m.position.set(x + len / 2, 0.012, z); m.receiveShadow = true; scene.add(m); return m; };
    k.card([{ n:'3', d:'8' }, ' ='], -2.65, -0.6, { w:0.9, d:0.8, size:420 });
    tape('0.375', 1.2, -2.1, -0.6);
    k.card([{ n:'1', d:'3' }, ' ='], -2.65, 0.6, { w:0.9, d:0.8, size:420 });
    tape('0.333333333333', 4.9, -2.1, 0.6);
    /* 두루마리 끝 — 아직 풀리지 않은 3 이 감겨 있다 */
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.32, 48), new THREE.MeshStandardMaterial({ map:k.canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#f3eedf'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(80,70,50,.35)'; for(let i = 0; i < 26; i++) g.fillRect(0, i * 5, w, 1); }), roughness:0.8 }));
    roll.rotation.x = Math.PI / 2; roll.position.set(2.95, 0.29, 0.6); roll.castShadow = roll.receiveShadow = true; scene.add(roll);
    k.lights({ envOpts:{ intensity:0.4 } });
  }},

  /* 순환소수를 분수로 — history: 끝나지 않고 되풀이되는 소수는 반드시 분수로 돌아간다. 3 이 도는 고리와 1/3 */
  'M-09': { seed:141, build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.45, 0], 5.4, 30);
    k.table();
    const ringTex = k.canvasTex(2048, 160, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); g.fillStyle = '#26221c'; g.font = '700 110px "DejaVu Sans Mono", monospace'; g.textBaseline = 'middle'; g.textAlign = 'center';
      for(let i = 0; i < 16; i++) g.fillText('3', (i + 0.5) * w / 16, h / 2 + 4); });
    ringTex.wrapS = THREE.RepeatWrapping;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.34, 96, 1, true), new THREE.MeshStandardMaterial({ map:ringTex, roughness:0.8, side:THREE.DoubleSide }));
    ring.position.set(-1.0, 0.18, 0); ring.castShadow = ring.receiveShadow = true; scene.add(ring);
    k.card(['0.', { dot:'3' }], -1.0, 1.35, { w:1.3, d:0.55, size:300 });
    k.tile('=', 0.35, 0.25, { w:0.5, d:0.5, size:400, grain:true });
    k.card([{ n:'1', d:'3' }], 1.4, 0.25, { w:0.9, d:1.0, size:560, h:0.05 });
    k.lights({ envOpts:{ intensity:0.45 } });
  }},

  /* 정비례 — hook: 한 자루 500원인 연필 x 자루 → y = 500x. 1·2·3 자루와 동전 1·2·3 개 */
  'M-51': { seed:151, build(k){
    const { THREE, scene } = k;
    k.frame([0.1, 0.1, 0], 5.6, 50);
    k.table();
    const yellow = k.plastic('#f2c230', 0.45), woodTip = k.woodMat('#e6c79a'), lead = k.plastic('#2a2a2a', 0.5), pink = k.plastic('#e79aa0', 0.6), ferr = k.metal('#c9c3b5', 0.3);
    const pencil = (x, z) => { const grp = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.5, 6), yellow); body.rotation.z = Math.PI / 2; grp.add(body);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.22, 6), woodTip); tip.rotation.z = -Math.PI / 2; tip.position.x = 0.86; grp.add(tip);
      const pt = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.07, 12), lead); pt.rotation.z = -Math.PI / 2; pt.position.x = 0.965; grp.add(pt);
      const fe = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.12, 24), ferr); fe.rotation.z = Math.PI / 2; fe.position.x = -0.81; grp.add(fe);
      const er = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.1, 24), pink); er.rotation.z = Math.PI / 2; er.position.x = -0.92; grp.add(er);
      grp.children.forEach(o => { o.castShadow = o.receiveShadow = true; }); grp.position.set(x, 0.066, z); scene.add(grp); };
    const coin = (x, y, z) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 48), new THREE.MeshStandardMaterial({ color:'#d9d5ca', metalness:0.55, roughness:0.3 })); c.position.set(x, y + 0.025, z); c.castShadow = c.receiveShadow = true; scene.add(c); };
    [1, 2, 3].forEach((n, r0) => { const z = -1.0 + r0 * 0.95;
      for(let i = 0; i < n; i++) pencil(-1.1, z - 0.16 * (n - 1) / 2 + i * 0.16);
      for(let i = 0; i < n; i++) coin(0.75 + i * 0.46, 0, z);
      k.card([String(n)], -2.35, z, { w:0.5, d:0.5, size:640 }); });
    k.lights({ envOpts:{ intensity:0.7 } });
  }},

  /* 정비례·반비례 그래프 — hook: 하나는 곧은 직선, 하나는 갈라진 곡선. 좌표판 위에 휜 철사 */
  'M-69': { seed:161, build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.2, 0], 6.0, 52);
    k.table();
    const S = 4.4, N = 8;       /* 판 크기, 칸 수(−4…4) */
    const boardTex = k.canvasTex(1400, 1400, (g, w, h) => { g.fillStyle = '#efe6d2'; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(80,110,140,.35)'; g.lineWidth = 3; for(let i = 0; i <= N; i++){ const p = i * w / N; g.beginPath(); g.moveTo(p, 0); g.lineTo(p, h); g.stroke(); g.beginPath(); g.moveTo(0, p); g.lineTo(w, p); g.stroke(); }
      g.strokeStyle = '#2b2118'; g.lineWidth = 7; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke();
      g.fillStyle = '#2b2118'; g.font = 'italic 700 64px "DejaVu Serif", serif'; g.fillText('x', w - 60, h / 2 - 22); g.fillText('y', w / 2 + 20, 60); g.font = '700 50px "DejaVu Serif", serif'; g.fillText('O', w / 2 - 50, h / 2 + 56); });
    const board = new THREE.Mesh(k.rbox(S + 0.2, 0.08, S + 0.2, 0.06), k.woodMat('#8a5a33', [50, 25, 10])); board.castShadow = board.receiveShadow = true; scene.add(board);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(S, S), new THREE.MeshStandardMaterial({ map:boardTex, roughness:0.85 })); face.rotation.x = -Math.PI / 2; face.position.y = 0.081; face.receiveShadow = true; scene.add(face);
    const u = S / N, Y = 0.13;
    const wire = (pts, mat) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, 0.03, 12), mat); m.castShadow = true; scene.add(m); };
    const P = (x, y) => new THREE.Vector3(x * u, Y, -y * u);
    wire([P(-2.6, -3.9), P(2.6, 3.9)], k.metal('#3f6fa0', 0.3));        /* y = 1.5x */
    const hyp = (s0) => { const pts = []; for(let t = 0; t <= 1.0001; t += 0.02){ const x = s0 * (0.72 + t * 3.2); pts.push(P(x, 3 / x)); } return pts; };
    const cu = k.metal('#c46a3a', 0.28);
    wire(hyp(1), cu); wire(hyp(-1), cu);                                 /* y = 3/x */
    k.lights({ envOpts:{ intensity:0.7 } });
  }},

  /* 대표값 — 2, 5, 7, 9, 12 를 정렬하면 가운데가 중앙값 7 */
  'M-84': { seed:171, build(k){
    const { THREE, scene } = k;
    k.frame([0, 0.55, 0.2], 5.6, 24);
    k.table();
    const U = 0.16, wood = k.woodMat('#d9b27c'), hot = k.woodMat('#3f7a5a', [20, 50, 30]);
    [2, 5, 7, 9, 12].forEach((n, i) => { const x = (i - 2) * 0.95;
      for(let j = 0; j < n; j++){ const m = new THREE.Mesh(k.rbox(0.5, U - 0.008, 0.5, 0.02), i === 2 ? hot : wood); m.position.set(x, j * U, 0); m.castShadow = m.receiveShadow = true; scene.add(m); }
      k.card([String(n)], x, 0.72, { w:0.62, d:0.42, size:470, bg:i === 2 ? '#dcebd9' : undefined }); });
    k.lights({ envOpts:{ intensity:0.45 } });
  }},
};
