import { THREE, createStage3D, material, roundedBoxGeometry, textTexture, easeOutBack, GB_COLORS } from "./golden-bell-3d-engine.js?v=20261022a";

// 양팔저울 진열대(3D). 저울마다 받침·기둥·막대·접시 둘, 접시 위에 물건(공). 무거운 쪽 접시가 내려간다.
// 저울이 많으면 진열대 칸을 여러 줄로 놓고, 칸 수는 화면 비율에 맞춘다(세로 폰은 2칸).
// 색: 저울 대는 주황, 받침은 노랑(색표). 공 색은 게임이 정한다(HTML 단추와 같은 색).
// 공을 누르면 onPick(물건 번호) — 게임은 같은 HTML 단추를 누른 것처럼 처리한다.
// WebGL이 없으면 null을 돌려준다(게임이 평면 저울을 그린다).

const ARM = 1.0, HANG = 0.62, TILT = 0.24, BALL = 0.27;

export function createBalanceScene(host, { colors, names, onPick, fullscreenTarget } = {}) {
  let scales = [], layoutCols = 0, dimmed = new Set(), balls = [], timers = [];
  const stage = createStage3D(host, {
    fov: 30, theta: 0, phi: 1.2, thetaRange: [-0.9, 0.9], phiRange: [0.75, 1.5], fullscreenTarget,
    pickables: () => balls,
    onTap: (hit) => { const item = hit?.object?.userData?.item; if (Number.isInteger(item)) onPick?.(item); },
    onFrame: () => { relayoutIfNeeded(); return false; }
  });
  if (!stage) return null;
  const { root } = stage;
  const shared = {
    base: material(GB_COLORS.cubeFront, { roughness: 0.55 }),
    post: material(GB_COLORS.orange, { roughness: 0.4, metalness: 0.1 }),
    beam: material(GB_COLORS.orange, { roughness: 0.38, metalness: 0.12 }),
    cap: material(0xf2c14e, { metalness: 0.6, roughness: 0.28 }),
    pan: material(0xffeaa6, { roughness: 0.42, metalness: 0.08 }),
    rod: material(0x8a6a3d, { roughness: 0.6 }),
    shelf: material(0xe9d7b9, { roughness: 0.75 })
  };
  // 공용 재질은 저울을 다시 만들어도 남겨 둔다(clear가 버리지 않게 따로 들고 있다가 dispose 때 버린다).
  const keep = new Set(Object.values(shared));
  const geo = {
    base: roundedBoxGeometry(1.5, 0.16, 0.8, 0.05),
    post: new THREE.CylinderGeometry(0.07, 0.09, 1.55, 20),
    cap: new THREE.SphereGeometry(0.12, 20, 12),
    beam: roundedBoxGeometry(2 * ARM + 0.24, 0.1, 0.14, 0.04),
    pan: new THREE.CylinderGeometry(0.46, 0.38, 0.07, 32),
    rod: new THREE.CylinderGeometry(0.012, 0.012, 1, 6),
    ball: new THREE.SphereGeometry(BALL, 32, 20)
  };
  const keepGeo = new Set(Object.values(geo));
  const ballMaterials = new Map();
  const letterTextures = new Map();
  const ballMaterial = (item) => {
    if (!ballMaterials.has(item)) ballMaterials.set(item, material(colors[item] || "#888", { roughness: 0.32, metalness: 0.05 }));
    return ballMaterials.get(item);
  };
  const letter = (item) => {
    if (!letterTextures.has(item)) letterTextures.set(item, textTexture(names[item], { color: "#ffffff", scale: 0.66 }));
    return new THREE.SpriteMaterial({ map: letterTextures.get(item), depthTest: false, transparent: true, toneMapped: false });
  };
  const mesh = (g, m, shadow = true) => { const x = new THREE.Mesh(g, m); x.castShadow = shadow; x.receiveShadow = true; return x; };
  // 검사용(화면에 보이지 않는 DOM 속성): 그 물건 공 하나의 화면 좌표.
  host.fcItemPoint = (item) => { const ball = balls.find((b) => b.userData.item === item); return ball ? stage.clientPoint(ball.getWorldPosition(new THREE.Vector3())) : null; };

  function buildScale(s, index) {
    const group = new THREE.Group();
    group.add(mesh(geo.base, shared.base));
    const post = mesh(geo.post, shared.post); post.position.y = 0.08 + 1.55 / 2; group.add(post);
    const pivotY = 0.08 + 1.55 + 0.05;
    const cap = mesh(geo.cap, shared.cap); cap.position.y = pivotY; group.add(cap);
    const beam = new THREE.Group(); beam.position.y = pivotY; group.add(beam);
    beam.add(mesh(geo.beam, shared.beam));
    const pans = ["left", "right"].map((side) => {
      const hanger = new THREE.Group();
      const items = [].concat(s[side]);
      for (const sx of [-0.3, 0.3]) {
        const rod = mesh(geo.rod, shared.rod, false);
        const len = Math.hypot(sx, HANG);
        rod.scale.y = len; rod.position.set(sx / 2, -HANG / 2, 0); rod.rotation.z = Math.atan2(sx, HANG);
        hanger.add(rod);
      }
      const pan = mesh(geo.pan, shared.pan); pan.position.y = -HANG; hanger.add(pan);
      items.forEach((item, k) => {
        const ball = mesh(geo.ball, ballMaterial(item));
        const spread = (k - (items.length - 1) / 2) * BALL * 1.9;
        ball.position.set(spread, -HANG + 0.035 + BALL, 0);
        ball.userData.item = item;
        const sprite = new THREE.Sprite(letter(item));
        sprite.scale.setScalar(BALL * 1.45);
        sprite.renderOrder = 5;
        sprite.position.copy(ball.position);
        hanger.add(ball, sprite);
        balls.push(ball);
      });
      group.add(hanger);
      return hanger;
    });
    const heavy = s.heavy === "left" ? 1 : s.heavy === "right" ? -1 : 0;
    const scale = { group, beam, pans, angle: 0, goal: heavy * TILT, index };
    placePans(scale);
    return scale;
  }
  function placePans(scale) {
    scale.beam.rotation.z = scale.angle;
    const c = Math.cos(scale.angle), sn = Math.sin(scale.angle), pivotY = scale.beam.position.y;
    scale.pans[0].position.set(-ARM * c, pivotY - ARM * sn, 0);
    scale.pans[1].position.set(ARM * c, pivotY + ARM * sn, 0);
  }
  // 칸 수: 화면 비율에서 저울 하나가 가장 크게 보이는 수(가로 2.85 · 세로 2.75 칸 기준).
  function columnsFor(n) {
    const aspect = stage.camera.aspect || 1.4;
    let best = 1, bestSize = 0;
    for (let cols = 1; cols <= Math.min(n, 5); cols++) {
      const rows = Math.ceil(n / cols), size = Math.min(aspect / (cols * 2.85), 1 / (rows * 2.75 + 0.4));
      if (size > bestSize + 1e-6) { best = cols; bestSize = size; }
    }
    return best;
  }
  // 진열대: 칸마다 저울 하나. 여러 줄이면 위 줄은 판자 위에 올린다(뒤로 놓으면 앞 저울에 가린다).
  function layout() {
    const n = scales.length, cols = columnsFor(n), rows = Math.ceil(n / cols);
    layoutCols = cols;
    for (const child of [...root.children]) if (child.userData.shelf) { root.remove(child); child.geometry.dispose(); }
    scales.forEach((scale, i) => {
      const row = Math.floor(i / cols), col = i % cols, inRow = Math.min(cols, n - row * cols);
      scale.group.position.set((col - (inRow - 1) / 2) * 2.85, (rows - 1 - row) * 2.75, 0);
    });
    for (let row = 0; row < rows - 1; row++) {
      const inRow = Math.min(cols, n - row * cols);
      const shelf = mesh(roundedBoxGeometry(inRow * 2.85 + 0.2, 0.12, 1.1, 0.04), shared.shelf);
      shelf.position.set(0, (rows - 1 - row) * 2.75 - 0.06, 0);
      shelf.userData.shelf = true;
      root.add(shelf);
    }
    stage.refit();
  }
  function relayoutIfNeeded() {
    if (scales.length && columnsFor(scales.length) !== layoutCols) layout();
  }
  function clearScales() {
    for (const child of [...root.children]) {
      root.remove(child);
      child.traverse((n) => {
        if (n.geometry && !keepGeo.has(n.geometry)) n.geometry.dispose();
        if (n.isSprite) n.material.dispose();
        n.userData.dimMaterial?.dispose();
      });
    }
    scales = []; balls = [];
    timers.forEach(clearTimeout); timers = [];
  }
  return {
    // 새 문제의 저울들. 처음엔 막대가 수평이고, 한 저울씩 차례로 기운다.
    show(list) {
      clearScales();
      dimmed = new Set();
      scales = list.map((s, i) => { const scale = buildScale(s, i); root.add(scale.group); return scale; });
      stage.setView({ theta: 0, phi: 1.2 });
      layout();
      scales.forEach((scale, k) => {
        const from = 0;
        const tilt = () => stage.tween(780, (t) => { scale.angle = from + (scale.goal - from) * easeOutBack(t); placePans(scale); });
        if (stage.reduced) tilt(); else timers.push(setTimeout(tilt, 150 + k * 120));
      });
    },
    // 틀린 공은 흐리게(고르기 문제).
    dim(item) {
      dimmed.add(item);
      for (const ball of balls) if (dimmed.has(ball.userData.item)) {
        if (!ball.userData.dimMaterial) ball.userData.dimMaterial = material(0xb9c3cb, { roughness: 0.5 });
        ball.material = ball.userData.dimMaterial;
      }
      stage.request();
    },
    get tilted() { return scales.every((s) => Math.abs(s.angle - s.goal) < 1e-3); },
    stage,
    dispose() {
      clearScales();
      for (const m of keep) m.dispose();
      for (const g of keepGeo) g.dispose();
      for (const m of ballMaterials.values()) m.dispose();
      for (const t of letterTextures.values()) t.dispose();
      stage.dispose();
    }
  };
}
