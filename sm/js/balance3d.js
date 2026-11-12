// 양팔 저울·시소(3D) — 2단원 무게 재기와 3단원 「아빠곰을 찾아라」가 같이 쓴다.
//  · 무대는 필즈 더 클래식 골든벨 3D 엔진(golden-bell-3d-engine.js)을 그대로 쓰고, 저울 모양은 필즈 2권 저울(golden-bell-3d-balance.js)의
//    받침·기둥·막대·접시 구성을 따른다(원장 2026-11-12 「무게 재기는 필즈더 클래식 쪽에서 가져 와도 될 것 같아」).
//  · 교재 규칙 그대로: 무거운 쪽 접시가 내려가고, 무게가 같으면 수평(30·34·36쪽). 얼마나 더 무거운지와 상관없이 같은 만큼 기운다.
//  · 물건: 곰돌이(아빠 12 · 엄마 8 · 아기 4, 36쪽 「아빠곰 = 1g 큐브 12개」·34쪽 「아빠곰 1 = 아기곰 3」), 1g 큐브, 공·원뿔, 그림 물건(이모지).
//  · 5세용: 돌리기·확대를 끄고(시점 고정), 누르기만 받는다. 조작은 화면 아래 큰 단추가 주로 맡는다.
//  · WebGL이 없으면 평면 그림(같은 기능)으로 그린다.
import { THREE, createStage3D, material, roundedBoxGeometry, textTexture, woodTray, woodMaterial, flatNotice } from "../../fields-classic/question-bank/golden-bell-3d-engine.js?v=20261023w";

export const BEARS = {
  papa: { name: "아빠곰", w: 12, scale: 0.52 },
  mama: { name: "엄마곰", w: 8, scale: 0.43 },
  baby: { name: "아기곰", w: 4, scale: 0.34 }
};
export const BEAR_COLORS = { green: "#2fb36b", red: "#ef4b4b", yellow: "#ffc21a", blue: "#3b82f6" };
const CUBE = 0.24, TILT = 0.21;

// 물건 만들기 도우미
export const bear = (size, color = "green") => ({ kind: "bear", size, color, w: BEARS[size].w, name: BEARS[size].name });
export const cube = (one = false) => ({ kind: "cube", w: 1, one, name: "큐브" });
export const solid = (shape, w, name) => ({ kind: shape, w, name });            // shape: sphere | cone
export const thing = (char, w, name) => ({ kind: "emoji", char, w, name });
// 그린 그림(SVG 문자열)을 올릴 때 — 사람·동물 얼굴 이모지 대신 쓴다
export const picture = (svg, w, name, size = 1.0) => ({ kind: "emoji", char: name, svg, w, name, size });
function svgTexture(svg) {
  const cv = document.createElement("canvas"); cv.width = cv.height = 256;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const img = new Image();
  img.onload = () => { cv.getContext("2d").drawImage(img, 0, 0, 256, 256); tex.needsUpdate = true; };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  return tex;
}

const weightOf = (list) => list.reduce((s, it) => s + (Number(it.w) || 0), 0);

export function createBalance(host, { type = "balance", onTap = null } = {}) {
  const sides = { left: [], right: [] };
  let locked = false, angle = 0, vel = 0, showOnes = false, perRow = 4;
  let waiters = [];
  const listeners = new Set();
  const state = () => {
    const L = weightOf(sides.left), R = weightOf(sides.right);
    return { left: L, right: R, heavy: locked ? null : L > R ? "left" : R > L ? "right" : "level", count: { left: sides.left.length, right: sides.right.length } };
  };
  const goal = () => { if (locked) return 0; const s = state(); return s.heavy === "left" ? TILT : s.heavy === "right" ? -TILT : 0; };

  const stage = createStage3D(host, {
    fov: 30, theta: 0, phi: 1.28, orbit: false, hint: false, fullscreen: false, touchAction: "manipulation",
    frame: type === "seesaw" ? [[-2.0, 0, -0.6], [2.0, 1.9, 0.6]] : [[-2.35, -0.3, -0.75], [2.35, 2.75, 0.75]],
    pickables: () => pickables,
    onTap: (hit) => { let o = hit?.object; while (o && !o.userData.pick) o = o.parent; if (o) onTap?.(o.userData.pick); },
    onFrame: (dt) => stepPhysics(dt)
  });
  if (!stage) return createFlatBalance(host, { type, onTap, sides, stateFn: state });
  const { root } = stage;
  let pickables = [];

  // ── 공용 재질 ──
  const M = {
    base: material("#ffd45c", { roughness: 0.5 }), post: material("#f39a1e", { roughness: 0.38, metalness: 0.08 }),
    beam: material("#f39a1e", { roughness: 0.36, metalness: 0.1 }), cap: material("#f2c14e", { metalness: 0.55, roughness: 0.28 }),
    pan: material("#ffffff", { roughness: 0.3, clearcoat: 0.8 }), panRim: material("#cfe3ff", { roughness: 0.35 }), rod: material("#8a6a3d", { roughness: 0.6 }),
    cube: material("#ff9ec8", { roughness: 0.38 }), cubeOne: material("#ff7eb3", { roughness: 0.34 }),
    solid: material("#ffd84a", { roughness: 0.35, clearcoat: 0.6 }), plank: woodMaterial({ color: 0xf0b860 }), fulcrum: material("#ef4b6c", { roughness: 0.4 }),
    eye: material("#1b1b1b", { roughness: 0.2, clearcoat: 1 }), shadowDisc: new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.08, depthWrite: false })
  };
  const bearMats = new Map();
  const bearMat = (c) => { if (!bearMats.has(c)) bearMats.set(c, material(BEAR_COLORS[c] || c, { roughness: 0.25, clearcoat: 0.9, transmission: 0, thickness: 0.4 })); return bearMats.get(c); };
  const mesh = (geo, mat, cast = true) => { const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = true; return m; };

  // ── 저울 또는 시소 뼈대 ──
  const rig = new THREE.Group(); root.add(rig);
  let beam, pivotY, ends;
  const ARM = type === "seesaw" ? 1.5 : 1.32, HANG = 0.78, PAN_R = 0.62;
  if (type === "seesaw") {
    const ful = mesh(new THREE.CylinderGeometry(0.02, 0.42, 0.62, 3), M.fulcrum); ful.position.y = 0.31; ful.rotation.y = Math.PI / 2; rig.add(ful);
    pivotY = 0.66;
    beam = new THREE.Group(); beam.position.y = pivotY; rig.add(beam);
    const plank = mesh(roundedBoxGeometry(ARM * 2 + 0.5, 0.1, 0.62, 0.04), M.plank); beam.add(plank);
    for (const sx of [-1, 1]) { const handle = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 10), M.post); handle.position.set(sx * (ARM - 0.38), 0.24, 0); beam.add(handle); }
    ends = [-1, 1].map((sx) => { const g = new THREE.Group(); g.position.set(sx * ARM, 0.05, 0); beam.add(g); return g; });
  } else {
    const tray = woodTray(4.6, 1.5, { boardMaterial: woodMaterial(), railMaterial: woodMaterial({ color: 0xd0a36b, bump: 0.009 }) }); rig.add(tray);
    const base = mesh(roundedBoxGeometry(1.3, 0.16, 0.7, 0.05), M.base); base.position.y = 0.32; rig.add(base);
    const post = mesh(new THREE.CylinderGeometry(0.075, 0.1, 1.65, 24), M.post); post.position.y = 0.4 + 1.65 / 2; rig.add(post);
    pivotY = 0.4 + 1.65 + 0.06;
    const cap = mesh(new THREE.SphereGeometry(0.13, 24, 14), M.cap); cap.position.y = pivotY; rig.add(cap);
    beam = new THREE.Group(); beam.position.y = pivotY; rig.add(beam);
    beam.add(mesh(roundedBoxGeometry(ARM * 2 + 0.26, 0.11, 0.15, 0.045), M.beam));
    ends = [-1, 1].map((sx) => {
      const hanger = new THREE.Group();
      for (const [dx, dz] of [[-0.42, 0], [0.42, 0], [0, -0.3]]) {
        const len = Math.hypot(dx, HANG, dz), rod = mesh(new THREE.CylinderGeometry(0.012, 0.012, len, 6), M.rod, false);
        rod.position.set(dx / 2, -HANG / 2, dz / 2); rod.lookAt(new THREE.Vector3(dx, -HANG, dz)); rod.rotateX(Math.PI / 2); hanger.add(rod);
      }
      const pan = mesh(new THREE.CylinderGeometry(PAN_R, PAN_R * 0.82, 0.08, 40), M.pan); pan.position.y = -HANG; hanger.add(pan);
      const rim = mesh(new THREE.TorusGeometry(PAN_R, 0.025, 8, 48), M.panRim, false); rim.rotation.x = Math.PI / 2; rim.position.y = -HANG + 0.04; hanger.add(rim);
      pan.userData.pick = { side: sx < 0 ? "left" : "right", pan: true };
      const load = new THREE.Group(); load.position.y = -HANG + 0.045; hanger.add(load);
      hanger.userData.load = load; hanger.userData.pan = pan;
      rig.add(hanger);
      return hanger;
    });
  }
  const loadOf = (side) => { const e = ends[side === "left" ? 0 : 1]; return type === "seesaw" ? e : e.userData.load; };

  // ── 물건 모양 ──
  function buildBear(it) {
    const g = new THREE.Group(), m = bearMat(it.color), s = BEARS[it.size].scale;
    const part = (geo, x, y, z, sx = 1, sy = 1, sz = 1, mat = m) => { const p = mesh(geo, mat); p.position.set(x, y, z); p.scale.set(sx, sy, sz); g.add(p); return p; };
    const S = new THREE.SphereGeometry(1, 28, 18);
    part(S, 0, 0.55, 0, 0.5, 0.56, 0.44);                 // 몸
    part(S, 0, 1.25, 0.02, 0.4, 0.37, 0.36);              // 머리
    part(S, -0.28, 1.55, 0, 0.14, 0.14, 0.1); part(S, 0.28, 1.55, 0, 0.14, 0.14, 0.1);   // 귀
    part(S, 0, 1.16, 0.32, 0.16, 0.12, 0.1);              // 주둥이
    part(S, -0.48, 0.78, 0.08, 0.16, 0.24, 0.16); part(S, 0.48, 0.78, 0.08, 0.16, 0.24, 0.16);   // 팔
    part(S, -0.24, 0.13, 0.12, 0.2, 0.15, 0.24); part(S, 0.24, 0.13, 0.12, 0.2, 0.15, 0.24);     // 발
    part(S, -0.13, 1.32, 0.33, 0.045, 0.05, 0.03, M.eye); part(S, 0.13, 1.32, 0.33, 0.045, 0.05, 0.03, M.eye); part(S, 0, 1.2, 0.43, 0.05, 0.035, 0.03, M.eye);
    g.scale.setScalar(s);
    g.userData.size = { w: 1.1 * s, h: 1.75 * s };
    return g;
  }
  const oneTex = textTexture("1", { color: "#ffffff", scale: 0.72 });
  function buildCube(it) {
    const g = new THREE.Group();
    g.add(mesh(roundedBoxGeometry(CUBE * 0.96, CUBE * 0.96, CUBE * 0.96, 0.03), it.one || showOnes ? M.cubeOne : M.cube));
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: oneTex, depthTest: false, transparent: true, toneMapped: false }));
    sp.scale.setScalar(CUBE * 0.85); sp.position.z = CUBE * 0.5; sp.renderOrder = 4; sp.visible = Boolean(it.one || showOnes); sp.userData.one = true;
    g.add(sp);
    g.userData.size = { w: CUBE, h: CUBE };
    return g;
  }
  function buildSolid(it) {
    const g = new THREE.Group();
    if (it.kind === "sphere") { const b = mesh(new THREE.SphereGeometry(0.34, 40, 24), M.solid); b.position.y = 0.34; g.add(b); g.userData.size = { w: 0.68, h: 0.68 }; }
    else { const c = mesh(new THREE.ConeGeometry(0.3, 0.72, 40), M.solid); c.position.y = 0.36; g.add(c); g.userData.size = { w: 0.6, h: 0.72 }; }
    return g;
  }
  const emojiTex = new Map();
  function buildEmoji(it) {
    const g = new THREE.Group();
    if (!emojiTex.has(it.char)) emojiTex.set(it.char, it.svg ? svgTexture(it.svg) : textTexture(it.char, { scale: 0.86 }));
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTex.get(it.char), transparent: true, toneMapped: false }));
    const size = it.size || 1.0; sp.scale.setScalar(size); sp.position.y = size / 2 - 0.02; g.add(sp);
    const sh = new THREE.Mesh(new THREE.CircleGeometry(size * 0.32, 24), M.shadowDisc); sh.rotation.x = -Math.PI / 2; sh.position.y = 0.006; g.add(sh);
    // 스프라이트는 눌러지지 않으므로 보이지 않는 상자로 누를 자리를 만든다
    const hit = new THREE.Mesh(new THREE.BoxGeometry(size * 0.8, size, size * 0.4), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = size / 2; g.add(hit);
    g.userData.size = { w: size * 0.8, h: size };
    return g;
  }
  const build = (it) => it.kind === "bear" ? buildBear(it) : it.kind === "cube" ? buildCube(it) : it.kind === "emoji" ? buildEmoji(it) : buildSolid(it);

  // ── 접시 위 배치: 큐브는 4개씩 벽처럼 쌓고(35쪽 그림처럼), 나머지는 옆으로 나란히 ──
  function arrange(side) {
    const load = loadOf(side), list = sides[side];
    const others = list.filter((it) => it.kind !== "cube"), cubes = list.filter((it) => it.kind === "cube");
    const widths = others.map((it) => it._obj.userData.size.w), total = widths.reduce((a, b) => a + b, 0) + Math.max(0, others.length - 1) * 0.05;
    let x = -total / 2;
    const zOthers = cubes.length && others.length ? -0.22 : 0;
    others.forEach((it, i) => { it._home = new THREE.Vector3(x + widths[i] / 2, 0, zOthers); x += widths[i] + 0.05; });
    const per = perRow, rows = Math.ceil(cubes.length / per);
    cubes.forEach((it, i) => {
      const row = Math.floor(i / per), inRow = Math.min(per, cubes.length - row * per), col = i % per;
      it._home = new THREE.Vector3((col - (inRow - 1) / 2) * CUBE, row * CUBE + CUBE / 2, others.length ? 0.24 : 0);
    });
    void rows;
    for (const it of list) if (it._obj.parent !== load) load.add(it._obj);
  }
  function refreshPickables() {
    pickables = [];
    for (const side of ["left", "right"]) sides[side].forEach((it, index) => { it._obj.userData.pick = { side, index, item: it }; pickables.push(it._obj); });
    if (type !== "seesaw") ends.forEach((e) => pickables.push(e.userData.pan));
  }
  // 물건을 놓는다: 위에서 떨어져 통 튀며 앉는다
  function place(side, it, { animate = true } = {}) {
    it._obj = build(it);
    sides[side].push(it);
    arrange(side);
    for (const other of sides[side]) if (other !== it && other._home) slideTo(other);
    const home = it._home.clone();
    if (animate && !stage.reduced) {
      it._obj.position.set(home.x, home.y + 1.3, home.z);
      it._obj.scale.multiplyScalar(0.001);
      const s = it._obj.userData.scale0 || (it.kind === "bear" ? BEARS[it.size].scale : 1);
      stage.tween(560, (t) => {
        const b = bounce(t);
        it._obj.position.set(home.x, home.y + 1.3 * (1 - b), home.z);
        it._obj.scale.setScalar(s * Math.min(1, 0.25 + t * 2.2));
      }, { ease: (t) => t });
    } else it._obj.position.copy(home);
    refreshPickables();
    kick();
    return it;
  }
  function slideTo(it) {
    const from = it._obj.position.clone(), to = it._home.clone();
    if (stage.reduced) { it._obj.position.copy(to); return; }
    stage.tween(260, (t) => it._obj.position.lerpVectors(from, to, t));
  }
  function remove(side, index, { animate = true } = {}) {
    const it = sides[side][index];
    if (!it) return null;
    sides[side].splice(index, 1);
    const obj = it._obj, from = obj.position.clone(), s0 = obj.scale.x;
    const done = () => { obj.parent?.remove(obj); };
    if (animate && !stage.reduced) stage.tween(260, (t) => { obj.position.set(from.x, from.y + t * 0.9, from.z); obj.scale.setScalar(s0 * (1 - t)); }, { done });
    else done();
    arrange(side); sides[side].forEach(slideTo);
    refreshPickables();
    kick();
    return it;
  }
  const bounce = (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; };

  // ── 기울기: 스프링(출렁) ──
  let settled = true;
  function kick() { settled = false; stage.request(); listeners.forEach((f) => f(state())); }
  function stepPhysics(dt) {
    const g = goal();
    if (stage.reduced) { angle = g; vel = 0; }
    else { const acc = 46 * (g - angle) - 6.5 * vel; vel += acc * dt; angle += vel * dt; }
    beam.rotation.z = angle;
    const c = Math.cos(angle), s = Math.sin(angle);
    if (type !== "seesaw") {
      ends[0].position.set(-ARM * c, pivotY - ARM * s, 0);
      ends[1].position.set(ARM * c, pivotY + ARM * s, 0);
    }
    const moving = Math.abs(g - angle) > 1e-3 || Math.abs(vel) > 1e-3;
    if (!moving && !settled) { settled = true; angle = g; vel = 0; beam.rotation.z = angle; const list = waiters; waiters = []; list.forEach((cb) => cb(state())); }
    return moving;
  }

  // 라벨(큐브 개수 등)
  const labelAt = (side, text, cls = "big") => stage.label(text, () => {
    const v = new THREE.Vector3(); loadOf(side).getWorldPosition(v);
    const h = Math.max(0.3, ...sides[side].map((it) => (it._home?.y || 0) + it._obj.userData.size.h));
    return v.add(new THREE.Vector3(0, h + 0.28, 0));
  }, { cls, frame: false });

  return {
    stage, type,
    get flat() { return false; },
    state,
    put(side, item, opts) { return place(side, item, opts); },
    take(side, index = sides[side].length - 1, opts) { return remove(side, index, opts); },
    clear() { for (const side of ["left", "right"]) while (sides[side].length) remove(side, 0, { animate: false }); },
    items(side) { return [...sides[side]]; },
    lock(on) { locked = Boolean(on); kick(); },
    // 큐브를 한 줄에 몇 개씩 쌓을지(원본 그림과 같게: 35쪽 공 4, 원뿔 3, 36쪽 아빠곰 3)
    perRow(n) { perRow = Math.max(1, n | 0); },
    get locked() { return locked; },
    // 기울기가 멈추면 한 번 알려 준다
    settle() { return new Promise((resolve) => { if (settled) { resolve(state()); return; } waiters.push(resolve); stage.request(); }); },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    label: labelAt,
    // 큐브에 1을 보이기(「가장 가벼운 것에 1 쓰기」)
    showOnes(on = true) {
      showOnes = on;
      for (const side of ["left", "right"]) for (const it of sides[side]) if (it.kind === "cube") it._obj.traverse((n) => { if (n.userData.one) n.visible = on || it.one; if (n.isMesh && n.material === M.cube && on) n.material = M.cubeOne; });
      stage.request();
    },
    // 물건 하나를 반짝(세기·힌트)
    pulse(side, index) {
      const it = sides[side][index]; if (!it) return;
      const o = it._obj, s0 = o.scale.x;
      stage.tween(420, (t) => o.scale.setScalar(s0 * (1 + 0.35 * Math.sin(t * Math.PI))));
    },
    // 셀 때는 두 접시를 크게(받침·쟁반은 화면 밖으로). null이면 처음 시점
    focus(on = true) {
      if (type === "seesaw") return;
      stage.setView({ theta: 0, phi: on ? 1.36 : 1.28, frame: on ? [[-2.15, 0.95, -0.6], [2.15, 2.35, 0.6]] : [[-2.35, -0.3, -0.75], [2.35, 2.75, 0.75]] });
    },
    point(side) { const v = new THREE.Vector3(); loadOf(side).getWorldPosition(v); return stage.clientPoint(v); },
    dispose() {
      Object.values(M).forEach((m) => m.dispose?.()); bearMats.forEach((m) => m.dispose()); emojiTex.forEach((t) => t.dispose()); oneTex.dispose();
      stage.dispose();
    }
  };
}

// ── 평면 대체(WebGL이 없는 기기) — 같은 함수 이름, 이모지 그림 ──
function createFlatBalance(host, { type, onTap, sides, stateFn }) {
  flatNotice(host);
  const box = document.createElement("div");
  box.style.cssText = "position:absolute;inset:40px 0 0;display:grid;place-items:center";
  host.append(box);
  let locked = false;
  const listeners = new Set();
  const art = (it) => it.kind === "bear" ? `<span style="font-size:${it.size === "papa" ? 54 : it.size === "mama" ? 42 : 32}px">🧸</span>`
    : it.kind === "cube" ? `<span style="display:inline-grid;place-items:center;width:26px;height:26px;background:#ff9ec8;border-radius:5px;color:#fff;font-weight:900">${it.one ? 1 : ""}</span>`
    : it.kind === "emoji" ? (it.svg ? `<span style="display:inline-block;width:60px;height:60px">${it.svg.replace("<svg ", '<svg width="60" height="60" ')}</span>` : `<span style="font-size:52px">${it.char}</span>`) : `<span style="font-size:48px">${it.kind === "sphere" ? "🟡" : "🔺"}</span>`;
  function draw() {
    const s = stateFn(), deg = locked ? 0 : s.heavy === "left" ? -10 : s.heavy === "right" ? 10 : 0;
    box.innerHTML = `<div style="position:relative;width:min(90%,620px);height:260px">
      <div style="position:absolute;left:50%;bottom:0;width:0;height:0;border-left:40px solid transparent;border-right:40px solid transparent;border-bottom:70px solid #ef4b6c;transform:translateX(-50%)"></div>
      <div style="position:absolute;left:5%;right:5%;bottom:70px;height:12px;border-radius:8px;background:#f39a1e;transform:rotate(${deg}deg);transition:transform .6s cubic-bezier(.3,1.4,.5,1)">
        ${["left", "right"].map((side) => `<div data-side="${side}" style="position:absolute;${side}:0;bottom:12px;display:flex;flex-wrap:wrap;gap:2px;justify-content:center;align-items:flex-end;width:44%;transform:rotate(${-deg}deg)">${sides[side].map(art).join("")}</div>`).join("")}
      </div></div>`;
    box.querySelectorAll("[data-side]").forEach((el) => el.addEventListener("click", () => onTap?.({ side: el.dataset.side, pan: true })));
    listeners.forEach((f) => f(s));
  }
  draw();
  return {
    stage: null, type, get flat() { return true; }, state: stateFn,
    put(side, item) { sides[side].push(item); draw(); return item; },
    take(side, index = sides[side].length - 1) { const [it] = sides[side].splice(index, 1); draw(); return it; },
    clear() { sides.left.length = 0; sides.right.length = 0; draw(); },
    items(side) { return [...sides[side]]; },
    lock(on) { locked = Boolean(on); draw(); }, get locked() { return locked; },
    perRow() {}, focus() {},
    settle() { return new Promise((r) => setTimeout(() => r(stateFn()), 650)); },
    onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    label() { return { set() {}, show() {}, remove() {}, setClass() {} }; },
    showOnes() { for (const side of ["left", "right"]) sides[side].forEach((it) => { if (it.kind === "cube") it.one = true; }); draw(); },
    pulse() {}, point() { const r = box.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
    dispose() { box.remove(); }
  };
}
