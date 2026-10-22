import { THREE, createStage3D, canUseWebGL, material, flatNotice, prefersReducedMotion } from "./golden-bell-3d-engine.js?v=20261022a";

// 「시계 바늘 돌리기」 게임의 시계 무대. 화면 상태(바늘 각도·지나온 길·보석·표시)를 하나로 두고
// WebGL이 되면 공용 3D 무대(golden-bell-3d-engine.js)에 입체로, 안 되면 2D 캔버스로 같은 상태를 그린다.
// 숫자 고르기 단추는 HTML이라 키보드·화면 읽기·터치가 그대로 된다.
// 3D에서는 시계 판 위를 끌면 바늘이 돌고(돌리기 문제), 판 밖을 끌면 시계를 조금 돌려 볼 수 있다.
// 카메라 거리는 엔진이 화면 비율에 맞춰 잰다(손으로 정하지 않는다). 「↺ 처음 시점」·「⤢ 크게」도 엔진 것.
// 각도 단위: 시계 방향으로 잰 '시' (12시 = 0, 3시 = 3). 반의 반 바퀴 = 3.

const QUARTER = 3;
const TAU = Math.PI * 2;
const toRad = (hours) => hours * Math.PI / 6;
const easeOutBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
const reducedMotion = prefersReducedMotion;
// 몸통은 색표의 파랑(옛 청록 금지), 테두리·핀은 금색. 지나온 길은 화면 단추와 같은 시계 방향 파랑·반대 방향 주황.
const COLORS = { body: 0x2f6fe0, cw: 0x2f7de1, ccw: 0xf08a24, hand: 0xe2504c, ink: 0x22384a, start: 0x9aabb6, target: 0x1f9d6b, gem: 0xffc53d };
const css = (hex) => `#${hex.toString(16).padStart(6, "0")}`;
const FACE_Z = 0.35;

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

  const view = !forceFlat && canUseWebGL() ? createThreeView(stage, state, { afterRender: () => placePicks() }) : null;
  const flat = view ? null : createFlatView(stage, state);
  const renderer = view || flat;
  stage.dataset.renderer = view ? "webgl" : "flat";
  // 평면 그림 알림은 시계 아래 설명 줄에 붙인다(판의 칸 배치를 흔들지 않게).
  if (!view) flatNotice(host.closest(".cg-board")?.querySelector(".cg-legend") || host);

  function placePicks() {
    if (disposed) return;
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
  // 3D에서는 누른 자리를 시계 판 평면에 비춰 각도를 잰다(시계를 돌려 본 뒤에도 맞게).
  let drag = null;
  stage.addEventListener("pointerdown", (event) => {
    if (!state.draggable || tween || !event.isPrimary || event.button !== 0) return;
    if (!renderer.onFace(event)) return; // 판 밖을 끌면 3D 무대가 시계를 돌려 보여 준다
    const a = renderer.angleAt(event);
    if (a === null) return;
    event.preventDefault();
    stage.setPointerCapture(event.pointerId);
    drag = { id: event.pointerId, last: a, base: state.trail, delta: 0 };
    stage.classList.add("dragging");
  });
  stage.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const a = renderer.angleAt(event);
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
    // 바늘 숨기기: 회색 출발 바늘과 숫자만 남긴다(바늘 없이 레벨).
    setHidden(hidden) { state.hideHand = hidden; queue(); },
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

function createThreeView(host, state, { afterRender }) {
  const gameRoot = host.closest(".cg") || host;
  let stage = null;
  const dragOnFace = (event) => state.draggable && onFace(event);
  stage = createStage3D(host, {
    fov: 28, theta: 0.17, phi: 1.41, thetaRange: [-0.75, 0.75], phiRange: [1.0, 1.72], groundY: -3.24,
    touchAction: "none", fullscreenTarget: gameRoot, afterRender,
    onPointerDown: (event) => dragOnFace(event)
  });
  if (!stage) return null;
  const { scene, root } = stage;
  const mat = (color, options) => material(color, { roughness: 0.45, ...options });
  const add = (geometry, mtl, parent = root, shadow = true) => {
    const mesh = new THREE.Mesh(geometry, mtl);
    mesh.castShadow = shadow; mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const clock = new THREE.Group();
  root.add(clock);
  const radial = (hours, r, z) => new THREE.Vector3(Math.sin(toRad(hours)) * r, Math.cos(toRad(hours)) * r, z);

  // 몸통: 두툼한 테두리 + 크림색 판 + 받침. 빛이 테두리에 닿아 입체가 보이도록 금속감을 조금 준다.
  const body = add(new THREE.CylinderGeometry(2.72, 2.8, 0.62, 96), mat(COLORS.body, { metalness: 0.3, roughness: 0.34 }), clock);
  body.rotation.x = Math.PI / 2;
  const bezel = add(new THREE.TorusGeometry(2.58, 0.15, 20, 96), mat(0xf2c14e, { metalness: 0.7, roughness: 0.25 }), clock);
  bezel.position.z = 0.33;
  const face = add(new THREE.CircleGeometry(2.5, 96), mat(0xfffaf0, { roughness: 0.7 }), clock, false);
  face.position.z = 0.32;
  const base = add(new THREE.CylinderGeometry(1.6, 1.9, 0.38, 48), mat(COLORS.body, { metalness: 0.3, roughness: 0.36 }), root);
  base.position.set(0, -3.05, -0.1);
  const neck = add(new THREE.BoxGeometry(0.7, 0.5, 0.42), mat(COLORS.body, { metalness: 0.3, roughness: 0.36 }), root);
  neck.position.set(0, -2.72, -0.05);

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
    const label = add(new THREE.PlaneGeometry(0.56, 0.56), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }), clock, false);
    label.position.copy(radial(value, 1.86, 0.35));
  }

  // 숫자 표시(맞음·틀림·도착)는 판 위의 둥근 고리.
  const markGroup = new THREE.Group(); clock.add(markGroup);
  // 반의 반 바퀴마다 서는 자리. 출발점에서 한 칸씩. 지나가면 빛난다.
  const gemGroup = new THREE.Group(); clock.add(gemGroup);
  const gemOff = mat(0xd9e2e8, { roughness: 0.3 });
  const gemOn = mat(COLORS.gem, { emissive: 0xffa800, emissiveIntensity: 0.55, metalness: 0.2, roughness: 0.2 });
  const gems = Array.from({ length: 4 }, () => add(new THREE.OctahedronGeometry(0.13), gemOff, gemGroup));

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
  const pin = add(new THREE.CylinderGeometry(0.17, 0.17, 0.2, 32), mat(0xf2c14e, { metalness: 0.7, roughness: 0.25 }), clock);
  pin.rotation.x = Math.PI / 2;
  pin.position.z = 0.6;

  const trailGroup = new THREE.Group(); trailGroup.position.z = 0.335; clock.add(trailGroup);
  // 지나온 길·표시 고리는 맞춤 상자에 넣지 않는다(시계 판 안에 있어 판이 이미 담는다).
  trailGroup.userData.noFrame = true; markGroup.userData.noFrame = true;
  const trailMat = { cw: mat(COLORS.cw, { transparent: true, opacity: 0.85, roughness: 0.6 }), ccw: mat(COLORS.ccw, { transparent: true, opacity: 0.85, roughness: 0.6 }) };
  const clearGroup = (group) => { for (const child of [...group.children]) { child.geometry.dispose(); if (child.userData.ownMaterial) child.material.dispose(); group.remove(child); } };
  let trailKey = "";
  function buildTrail() {
    const key = state.trail.toFixed(3) + state.start;
    if (key === trailKey) return;
    trailKey = key;
    clearGroup(trailGroup);
    const span = Math.abs(state.trail);
    if (span < 0.01) return;
    const mtl = state.trail > 0 ? trailMat.cw : trailMat.ccw;
    for (let lap = 0; lap * 12 < span; lap++) {
      const piece = Math.min(12, span - lap * 12);
      const from = state.start + Math.sign(state.trail) * lap * 12;
      const to = from + Math.sign(state.trail) * piece;
      const a0 = Math.PI / 2 - toRad(from), a1 = Math.PI / 2 - toRad(to);
      const r = 1.32 - lap * 0.2;
      add(new THREE.RingGeometry(r - 0.075, r + 0.075, 96, 1, Math.min(a0, a1), Math.abs(a1 - a0)), mtl, trailGroup, false);
    }
  }
  let markKey = "";
  function buildMarks() {
    const key = [...state.marks].join();
    if (key === markKey) return;
    markKey = key;
    clearGroup(markGroup);
    for (const [value, kind] of state.marks) {
      const color = kind === "good" ? 0x2fb36b : kind === "bad" ? 0xe2504c : 0x2f7de1;
      const disc = add(new THREE.RingGeometry(0.3, 0.38, 48), mat(color, { emissive: color, emissiveIntensity: 0.35 }), markGroup, false);
      disc.userData.ownMaterial = true;
      disc.position.copy(radial(value, 1.86, 0.345));
    }
  }

  const facePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -FACE_Z);
  function facePoint(event) { return stage.rayToPlane(event.clientX, event.clientY, facePlane); }
  function onFace(event) { const p = facePoint(event); return Boolean(p && Math.hypot(p.x, p.y) <= 2.75); }
  stage.setView({ theta: 0.17, phi: 1.41 });
  scene.userData.clock = clock;

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
      stage.request();
    },
    rebuild() { trailKey = ""; markKey = ""; },
    resize() { stage.request(); },
    onFace,
    // 판 위의 점 → 12시에서 시계 방향으로 잰 '시'. 가운데 가까이면 null(방향이 흔들린다).
    angleAt(event) {
      const p = facePoint(event);
      if (!p || Math.hypot(p.x, p.y) < 0.12) return null;
      return Math.atan2(p.x, p.y) * 6 / Math.PI;
    },
    project(hours) {
      const p = stage.project(hours === null ? new THREE.Vector3(0, 0, 0.5) : radial(hours, 1.86, FACE_Z));
      return { x: p.x / Math.max(1, p.width), y: p.y / Math.max(1, p.height) };
    },
    dispose() { stage.dispose(); }
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
  const local = (event) => { const box = stage.getBoundingClientRect(); return [event.clientX - box.left - cx, event.clientY - box.top - cy]; };
  return {
    render() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = css(COLORS.body); ctx.beginPath(); ctx.arc(cx, cy + 6, R * 1.09, 0, TAU); ctx.fill();
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
    onFace(event) { const [dx, dy] = local(event); return Math.hypot(dx, dy) <= R * 1.12; },
    angleAt(event) {
      const [dx, dy] = local(event);
      if (Math.hypot(dx, dy) < 8) return null;
      return Math.atan2(dx, -dy) * 6 / Math.PI;
    },
    project(hours) {
      if (hours === null) return { x: cx / w, y: cy / h };
      const [x, y] = pt(hours, R * 0.745);
      return { x: x / w, y: y / h };
    },
    dispose() { canvas.remove(); }
  };
}
