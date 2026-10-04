import * as THREE from "../../geometry/vendor/three/three.module.js";

// 「시계 바늘 돌리기」 게임의 시계 무대. 화면 상태(바늘 각도·지나온 길·보석·표시)를 하나로 두고
// WebGL이 되면 입체로, 안 되면 2D 캔버스로 같은 상태를 그린다. 숫자 고르기 단추는 HTML이라
// 키보드·화면 읽기·터치가 그대로 된다.
// 각도 단위: 시계 방향으로 잰 '시' (12시 = 0, 3시 = 3). 반의 반 바퀴 = 3.

const QUARTER = 3;
const TAU = Math.PI * 2;
const toRad = (hours) => hours * Math.PI / 6;
const easeOutBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const COLORS = { cw: 0x2f7de1, ccw: 0xf08a24, hand: 0xe2504c, ink: 0x22384a, start: 0x9aabb6, target: 0x1f9d6b, gem: 0xffc53d };
const css = (hex) => `#${hex.toString(16).padStart(6, "0")}`;

function canUseWebGL() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch { return false; }
}

export function createDial(host, { onTick, forceFlat = false } = {}) {
  const state = { start: 12, ghost: 12, hand: 12, trail: 0, target: null, marks: new Map(), pickable: false, draggable: false, hideHand: false };
  const stage = document.createElement("div");
  stage.className = "cg-dial";
  const picks = document.createElement("div");
  picks.className = "cg-picks";
  picks.setAttribute("role", "group");
  picks.setAttribute("aria-label", "시계 숫자");
  host.append(stage, picks);
  let onPick = null, onDragTurns = null, disposed = false, raf = 0, tween = null;

  const buttons = Array.from({ length: 12 }, (_, i) => {
    const value = i + 1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cg-pick";
    button.dataset.clockNumber = String(value);
    button.textContent = String(value);
    button.setAttribute("aria-label", `${value}`);
    button.addEventListener("click", () => { if (state.pickable && onPick) onPick(value); });
    picks.append(button);
    return button;
  });

  const view = !forceFlat && canUseWebGL() ? createThreeView(stage, state) : null;
  const flat = view ? null : createFlatView(stage, state);
  const renderer = view || flat;
  stage.dataset.renderer = view ? "webgl" : "flat";

  function placePicks() {
    const box = stage.getBoundingClientRect();
    if (!box.width) return;
    for (const [i, button] of buttons.entries()) {
      const p = renderer.project(i + 1);
      button.style.left = `${p.x * box.width}px`;
      button.style.top = `${p.y * box.height}px`;
      const mark = state.marks.get(i + 1);
      button.dataset.mark = mark || "";
      button.disabled = !state.pickable;
      button.tabIndex = state.pickable ? 0 : -1;
    }
    picks.dataset.pickable = String(state.pickable);
  }
  function draw() {
    raf = 0;
    if (disposed) return;
    if (!host.isConnected) { dispose(); return; }
    let again = false;
    if (tween) {
      const t = Math.min(1, (performance.now() - tween.begun) / tween.duration);
      const k = tween.overshoot ? easeOutBack(t) : 1 - (1 - t) ** 3;
      const previous = state.trail;
      state.trail = tween.from + (tween.to - tween.from) * k;
      state.hand = state.start + state.trail;
      const crossed = Math.floor(Math.abs(previous) / QUARTER + 1e-6) !== Math.floor(Math.abs(state.trail) / QUARTER + 1e-6);
      if (crossed && t < 1) onTick?.();
      if (t >= 1) { state.trail = tween.to; state.hand = state.start + tween.to; const done = tween.done; tween = null; done?.(); }
      else again = true;
    }
    renderer.render();
    placePicks();
    if (again) queue();
  }
  function queue() { if (!raf && !disposed) raf = requestAnimationFrame(draw); }
  const resize = new ResizeObserver(() => { renderer.resize(); queue(); });
  resize.observe(stage);

  // 끌어서 돌리기: 바늘 끝을 따라가며 연속으로 보여 주고, 놓으면 가장 가까운 반의 반 바퀴로 맞춘다.
  let drag = null;
  const angleAt = (event) => {
    const box = stage.getBoundingClientRect();
    const c = renderer.project(null);
    const dx = event.clientX - box.left - c.x * box.width, dy = event.clientY - box.top - c.y * box.height;
    if (Math.hypot(dx, dy) < 8) return null;
    return Math.atan2(dx, -dy) * 6 / Math.PI;
  };
  stage.addEventListener("pointerdown", (event) => {
    if (!state.draggable || tween || !event.isPrimary || event.button !== 0) return;
    const a = angleAt(event);
    if (a === null) return;
    event.preventDefault();
    stage.setPointerCapture(event.pointerId);
    drag = { id: event.pointerId, last: a, base: state.trail, delta: 0 };
    stage.classList.add("dragging");
  });
  stage.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const a = angleAt(event);
    if (a === null) return;
    let d = a - drag.last;
    d -= 12 * Math.round(d / 12);
    drag.last = a;
    const before = drag.base + drag.delta;
    drag.delta = Math.max(-8 * QUARTER - drag.base, Math.min(8 * QUARTER - drag.base, drag.delta + d));
    const now = drag.base + drag.delta;
    if (Math.floor(before / QUARTER) !== Math.floor(now / QUARTER)) onTick?.();
    state.trail = now;
    state.hand = state.start + now;
    queue();
  });
  const release = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const cancelled = event.type === "pointercancel";
    const quarters = cancelled ? 0 : Math.round(drag.delta / QUARTER);
    const base = drag.base;
    drag = null;
    stage.classList.remove("dragging");
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    state.trail = base + quarters * QUARTER;
    state.hand = state.start + state.trail;
    queue();
    if (quarters) onDragTurns?.(quarters);
  };
  for (const type of ["pointerup", "pointercancel"]) stage.addEventListener(type, release);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    resize.disconnect();
    renderer.dispose();
    stage.remove();
    picks.remove();
  }

  renderer.resize();
  queue();
  return {
    get renderer() { return stage.dataset.renderer; },
    // ghost: 회색 '출발' 바늘 자리. 두 번 돌리기의 두 번째 구간에서도 처음 출발점을 남긴다.
    reset(start, { target = null, quarters = 0, ghost = start } = {}) {
      tween = null;
      Object.assign(state, { start, ghost, trail: quarters * QUARTER, hand: start + quarters * QUARTER, target, hideHand: false });
      state.marks.clear();
      renderer.rebuild();
      placePicks();
      queue();
    },
    // 지나온 길(반의 반 바퀴 단위)을 움직여 바늘을 돌린다. 끝나면 done.
    turnTo(quarters, { done, slow = false } = {}) {
      const to = quarters * QUARTER;
      if (reducedMotion() || to === state.trail) { state.trail = to; state.hand = state.start + to; queue(); done?.(); return; }
      const steps = Math.abs(to - state.trail) / QUARTER;
      tween = { from: state.trail, to, begun: performance.now(), duration: Math.min(1800, (slow ? 520 : 300) * Math.max(1, steps) ** 0.8), overshoot: !slow, done };
      queue();
    },
    // 단추 상태(표시·누를 수 있는지)는 바로 반영하고, 그림은 다음 프레임에 그린다.
    mark(value, kind) { if (kind) state.marks.set(value, kind); else state.marks.delete(value); renderer.rebuild(); placePicks(); queue(); },
    clearMarks() { state.marks.clear(); renderer.rebuild(); placePicks(); queue(); },
    setPickable(enabled, handler) { state.pickable = enabled; onPick = handler || null; placePicks(); queue(); },
    setDraggable(enabled, handler) { state.draggable = enabled; onDragTurns = handler || null; stage.classList.toggle("draggable", enabled); },
    pulse(kind) {
      if (reducedMotion()) return;
      stage.classList.remove("pulse-good", "pulse-bad");
      void stage.offsetWidth;
      stage.classList.add(kind === "good" ? "pulse-good" : "pulse-bad");
    },
    centerOnPage() {
      const box = stage.getBoundingClientRect(), c = renderer.project(null);
      return { x: box.left + c.x * box.width, y: box.top + c.y * box.height, r: box.width * 0.36 };
    },
    dispose
  };
}

function createThreeView(stage, state) {
  const canvas = document.createElement("canvas");
  canvas.className = "cg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  stage.append(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 60);
  camera.position.set(2.4, 2.2, 13.2);
  camera.lookAt(0, -0.25, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb7c9d6, 1.6));
  const key = new THREE.DirectionalLight(0xfff4e2, 2.6);
  key.position.set(-4, 6, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 });
  key.shadow.bias = -0.0008;
  scene.add(key);
  const rimLight = new THREE.DirectionalLight(0xbfe3ff, 0.9);
  rimLight.position.set(5, 2, -3);
  scene.add(rimLight);

  const owned = { geometries: new Set(), materials: new Set(), textures: new Set() };
  const mat = (color, options = {}) => { const m = new THREE.MeshStandardMaterial({ color, roughness: 0.45, ...options }); owned.materials.add(m); return m; };
  const add = (geometry, material, parent = scene, shadow = true) => {
    owned.geometries.add(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = shadow; mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const clock = new THREE.Group();
  scene.add(clock);
  const radial = (hours, r, z) => new THREE.Vector3(Math.sin(toRad(hours)) * r, Math.cos(toRad(hours)) * r, z);

  // 몸통: 두툼한 테두리 + 크림색 판 + 받침. 빛이 테두리에 닿아 입체가 보이도록 금속감을 조금 준다.
  const body = add(new THREE.CylinderGeometry(2.72, 2.8, 0.62, 128), mat(0x2a6f97, { metalness: 0.35, roughness: 0.32 }), clock);
  body.rotation.x = Math.PI / 2;
  const bezel = add(new THREE.TorusGeometry(2.58, 0.15, 24, 128), mat(0xf2c14e, { metalness: 0.75, roughness: 0.25 }), clock);
  bezel.position.z = 0.33;
  const face = add(new THREE.CircleGeometry(2.5, 128), mat(0xfffaf0, { roughness: 0.7 }), clock, false);
  face.position.z = 0.32;
  const base = add(new THREE.CylinderGeometry(1.6, 1.9, 0.38, 64), mat(0x2a6f97, { metalness: 0.35, roughness: 0.35 }), scene);
  base.position.set(0, -3.05, -0.1);
  const neck = add(new THREE.BoxGeometry(0.7, 0.5, 0.42), mat(0x2a6f97, { metalness: 0.35, roughness: 0.35 }), scene);
  neck.position.set(0, -2.72, -0.05);
  const floor = add(new THREE.CircleGeometry(9, 64), new THREE.ShadowMaterial({ opacity: 0.16 }), scene, false);
  owned.materials.add(floor.material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3.24;

  const ink = mat(COLORS.ink);
  for (let i = 0; i < 60; i++) {
    const main = i % 5 === 0;
    const tick = add(new THREE.BoxGeometry(main ? 0.06 : 0.025, main ? 0.2 : 0.09, 0.02), ink, clock, false);
    tick.position.copy(radial(i / 5, 2.3, 0.34));
    tick.rotation.z = -toRad(i / 5);
  }
  for (let value = 1; value <= 12; value++) {
    const bitmap = document.createElement("canvas");
    bitmap.width = bitmap.height = 160;
    const ctx = bitmap.getContext("2d");
    ctx.fillStyle = css(COLORS.ink);
    ctx.font = "800 104px 'Noto Sans KR', system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(value), 80, 86);
    const texture = new THREE.CanvasTexture(bitmap);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    owned.textures.add(texture);
    const m = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
    owned.materials.add(m);
    const label = add(new THREE.PlaneGeometry(0.56, 0.56), m, clock, false);
    label.position.copy(radial(value, 1.86, 0.35));
  }

  // 숫자 표시(맞음·틀림·도착)는 판 위의 둥근 원판.
  const markGroup = new THREE.Group(); clock.add(markGroup);
  // 반의 반 바퀴마다 서는 자리. 출발점에서 90°씩. 지나가면 빛난다.
  const gemGroup = new THREE.Group(); clock.add(gemGroup);
  const gemOff = mat(0xd9e2e8, { roughness: 0.3 });
  const gemOn = mat(COLORS.gem, { emissive: 0xffa800, emissiveIntensity: 0.55, metalness: 0.2, roughness: 0.2 });
  const gems = Array.from({ length: 4 }, () => { const g = add(new THREE.OctahedronGeometry(0.13), gemOff, gemGroup); return g; });

  const handMesh = (color, opacity, width, length) => {
    const group = new THREE.Group();
    const m = mat(color, { transparent: opacity < 1, opacity, metalness: 0.15, roughness: 0.35 });
    const shape = new THREE.Shape();
    shape.moveTo(-width, -0.28); shape.lineTo(width, -0.28); shape.lineTo(width * 0.8, length - 0.42);
    shape.lineTo(width * 2.6, length - 0.42); shape.lineTo(0, length); shape.lineTo(-width * 2.6, length - 0.42);
    shape.lineTo(-width * 0.8, length - 0.42); shape.closePath();
    add(new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }), m, group, opacity === 1);
    clock.add(group);
    return group;
  };
  const startHand = handMesh(COLORS.start, 0.55, 0.045, 1.55);
  startHand.position.z = 0.36;
  const targetHand = handMesh(COLORS.target, 0.75, 0.05, 1.7);
  targetHand.position.z = 0.4;
  const hand = handMesh(COLORS.hand, 1, 0.07, 1.82);
  hand.position.z = 0.46;
  const pin = add(new THREE.CylinderGeometry(0.17, 0.17, 0.2, 32), mat(0xf2c14e, { metalness: 0.75, roughness: 0.25 }), clock);
  pin.rotation.x = Math.PI / 2;
  pin.position.z = 0.6;

  const trailGroup = new THREE.Group(); trailGroup.position.z = 0.335; clock.add(trailGroup);
  const trailMat = { cw: mat(COLORS.cw, { transparent: true, opacity: 0.85, roughness: 0.6 }), ccw: mat(COLORS.ccw, { transparent: true, opacity: 0.85, roughness: 0.6 }) };
  let trailKey = "";
  function buildTrail() {
    const key = state.trail.toFixed(3) + state.start;
    if (key === trailKey) return;
    trailKey = key;
    for (const child of [...trailGroup.children]) { child.geometry.dispose(); owned.geometries.delete(child.geometry); trailGroup.remove(child); }
    const span = Math.abs(state.trail);
    if (span < 0.01) return;
    const material = state.trail > 0 ? trailMat.cw : trailMat.ccw;
    for (let lap = 0; lap * 12 < span; lap++) {
      const piece = Math.min(12, span - lap * 12);
      const from = state.start + Math.sign(state.trail) * lap * 12;
      const to = from + Math.sign(state.trail) * piece;
      const a0 = Math.PI / 2 - toRad(from), a1 = Math.PI / 2 - toRad(to);
      const r = 1.32 - lap * 0.2;
      add(new THREE.RingGeometry(r - 0.075, r + 0.075, 96, 1, Math.min(a0, a1), Math.abs(a1 - a0)), material, trailGroup, false);
    }
  }
  let markKey = "";
  function buildMarks() {
    const key = [...state.marks].join();
    if (key === markKey) return;
    markKey = key;
    for (const child of [...markGroup.children]) { child.geometry.dispose(); owned.geometries.delete(child.geometry); markGroup.remove(child); }
    for (const [value, kind] of state.marks) {
      const color = kind === "good" ? 0x2fb36b : kind === "bad" ? 0xe2504c : 0x2f7de1;
      const disc = add(new THREE.RingGeometry(0.3, 0.38, 48), mat(color, { emissive: color, emissiveIntensity: 0.35 }), markGroup, false);
      disc.position.copy(radial(value, 1.86, 0.345));
    }
  }

  let width = 1, height = 1;
  const v = new THREE.Vector3();
  return {
    render() {
      buildTrail(); buildMarks();
      startHand.rotation.z = -toRad(state.ghost);
      hand.rotation.z = -toRad(state.hand);
      hand.visible = !state.hideHand;
      targetHand.visible = state.target !== null;
      if (state.target !== null) targetHand.rotation.z = -toRad(state.target);
      const passed = Math.floor(Math.abs(state.trail) / QUARTER + 1e-6);
      gems.forEach((gem, k) => {
        gem.position.copy(radial(state.start + k * QUARTER, 1.32, 0.42));
        gem.material = k > 0 && k <= passed || k === 0 && passed >= 4 ? gemOn : gemOff;
        gem.scale.setScalar(gem.material === gemOn ? 1.35 : 1);
      });
      renderer.render(scene, camera);
    },
    rebuild() { trailKey = ""; markKey = ""; },
    resize() {
      const box = stage.getBoundingClientRect();
      width = Math.max(1, box.width); height = Math.max(1, box.height);
      camera.aspect = width / height;
      // 시계 전체(받침 포함)가 늘 들어오도록, 좁으면 세로 시야를 넓힌다.
      camera.fov = width / height < 0.95 ? 26 / Math.max(0.62, width / height) * 0.95 : 26;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    project(hours) {
      clock.updateMatrixWorld();
      if (hours === null) v.set(0, 0, 0.5); else v.copy(radial(hours, 1.86, 0.35));
      v.applyMatrix4(clock.matrixWorld).project(camera);
      return { x: (v.x + 1) / 2, y: (1 - v.y) / 2 };
    },
    dispose() {
      for (const g of owned.geometries) g.dispose();
      for (const m of owned.materials) m.dispose();
      for (const t of owned.textures) t.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    }
  };
}

function createFlatView(stage, state) {
  const canvas = document.createElement("canvas");
  canvas.className = "cg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  stage.append(canvas);
  const ctx = canvas.getContext("2d");
  let w = 1, h = 1, R = 1, cx = 0, cy = 0;
  const pt = (hours, r) => [cx + Math.sin(toRad(hours)) * r, cy - Math.cos(toRad(hours)) * r];
  const handPath = (hours, length, width, color, alpha) => {
    const [x, y] = pt(hours, length);
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.restore();
  };
  return {
    render() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#2a6f97"; ctx.beginPath(); ctx.arc(cx, cy + 6, R * 1.09, 0, TAU); ctx.fill();
      ctx.fillStyle = "#f2c14e"; ctx.beginPath(); ctx.arc(cx, cy, R * 1.04, 0, TAU); ctx.fill();
      ctx.fillStyle = "#fffaf0"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
      ctx.strokeStyle = css(COLORS.ink);
      for (let i = 0; i < 60; i++) {
        const [x0, y0] = pt(i / 5, R * 0.92), [x1, y1] = pt(i / 5, R * (i % 5 ? 0.89 : 0.84));
        ctx.lineWidth = i % 5 ? 1 : 2.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
      ctx.fillStyle = css(COLORS.ink); ctx.font = `800 ${Math.round(R * 0.2)}px 'Noto Sans KR', system-ui, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (let n = 1; n <= 12; n++) { const [x, y] = pt(n, R * 0.745); ctx.fillText(String(n), x, y + 1); }
      for (const [value, kind] of state.marks) {
        const [x, y] = pt(value, R * 0.745);
        ctx.strokeStyle = kind === "good" ? "#2fb36b" : kind === "bad" ? "#e2504c" : "#2f7de1"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(x, y, R * 0.14, 0, TAU); ctx.stroke();
      }
      const span = Math.abs(state.trail);
      if (span > 0.01) {
        ctx.strokeStyle = css(state.trail > 0 ? COLORS.cw : COLORS.ccw); ctx.lineWidth = R * 0.06; ctx.lineCap = "round";
        for (let lap = 0; lap * 12 < span; lap++) {
          const piece = Math.min(12, span - lap * 12), from = state.start + Math.sign(state.trail) * lap * 12;
          const a0 = toRad(from) - Math.PI / 2, a1 = a0 + Math.sign(state.trail) * toRad(piece);
          ctx.beginPath(); ctx.arc(cx, cy, R * (0.53 - lap * 0.08), a0, a1, state.trail < 0); ctx.stroke();
        }
      }
      const passed = Math.floor(span / QUARTER + 1e-6);
      for (let k = 0; k < 4; k++) {
        const [x, y] = pt(state.start + k * QUARTER, R * 0.53);
        ctx.fillStyle = k > 0 && k <= passed || k === 0 && passed >= 4 ? "#ffc53d" : "#d9e2e8";
        ctx.beginPath(); ctx.arc(x, y, R * 0.055, 0, TAU); ctx.fill();
      }
      handPath(state.ghost, R * 0.62, R * 0.05, css(COLORS.start), 0.6);
      if (state.target !== null) handPath(state.target, R * 0.68, R * 0.06, css(COLORS.target), 0.8);
      if (!state.hideHand) handPath(state.hand, R * 0.74, R * 0.085, css(COLORS.hand), 1);
      ctx.fillStyle = "#f2c14e"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.07, 0, TAU); ctx.fill();
    },
    rebuild() {},
    resize() {
      const box = stage.getBoundingClientRect();
      w = Math.max(1, box.width); h = Math.max(1, box.height);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      R = Math.min(w, h) * 0.4; cx = w / 2; cy = h * 0.47;
    },
    project(hours) {
      if (hours === null) return { x: cx / w, y: cy / h };
      const [x, y] = pt(hours, R * 0.745);
      return { x: x / w, y: y / h };
    },
    dispose() { canvas.remove(); }
  };
}
