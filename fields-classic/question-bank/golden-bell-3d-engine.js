import * as THREE from "../../world-explorer/vendor/three.module.js";

// 골든벨 게임 공용 3D 무대. 규칙은 science-lab/3D-RULES.md를 따른다.
//   · 카메라 거리는 손으로 정하지 않는다: 장면이 각도(theta·phi)만 주면, 보이는 물체(또는 frame 상자)가
//     여백 fitMargin 안에 다 들어오는 가장 가까운 거리와 가운데를 직접 잰다. 화면 비율이 바뀌면 다시 잰다.
//   · 끌기 = 돌리기(폰의 보통 화면은 옆으로만, 위아래는 페이지 스크롤 / 전체 화면과 마우스는 위아래도),
//     Ctrl+휠 · 두 손가락 = 확대(맞춘 거리의 0.35~1.8배), 돌리면 「↺ 처음 시점」, 두 번 누르면 처음 시점.
//   · 물체 누르기는 누른 자리에서 8px·0.45초 안에 뗐을 때만(끌기와 구분).
//   · 사용자가 돌리거나 확대한 뒤에는 카메라를 빼앗지 않는다(전체 화면을 켜고 끌 때만 새로 잡는다).
//   · 그릴 것이 없으면 쉬고(배터리), 화면 밖·숨은 탭이면 멈춘다. prefers-reduced-motion이면 움직임은 바로 끝 상태.
//   · WebGL이 없으면 createStage3D가 null을 돌려준다 → 게임은 평면 그림으로 같은 흐름을 그린다(flatNotice).
// 라벨은 HTML(글꼴이 또렷하고 화면 밖으로 안 나가게 밀어 넣기 쉽다). 라벨은 꾸밈이라 aria-hidden, 내용은 게임의 HTML 조작부가 담는다.

export { THREE };

let webglChecked = null;
// WebGL이 되는지 한 번만 확인하고, 확인용 문맥은 바로 돌려준다(쌓이면 브라우저가 오래된 3D부터 끈다).
export function canUseWebGL() {
  if (webglChecked !== null) return webglChecked;
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") || probe.getContext("webgl");
    webglChecked = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch { webglChecked = false; }
  return webglChecked;
}

export const prefersReducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
// 손가락 기기: 굵은 포인터가 있거나(태블릿·폰), 터치가 되는데 마우스 같은 가는 포인터가 없을 때.
const coarsePointer = () => typeof matchMedia === "function" && (matchMedia("(any-pointer: coarse)").matches || (navigator.maxTouchPoints > 0 && !matchMedia("(pointer: fine)").matches));
export const easeOutCubic = (t) => 1 - (1 - t) ** 3;
export const easeOutBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// 골든벨 그림 색표(.claude/skills/golden-bell-figure-style). 같은 모양은 어디서나 같은 색.
export const GB_COLORS = Object.freeze({
  red: "#e8503a", redSoft: "#ffe1dc", green: "#2f9e5f", greenSoft: "#dcf5e5", blue: "#2f6fe0", blueSoft: "#dde9ff",
  purple: "#8e5bd8", purpleSoft: "#ece0fb", yellow: "#d9a400", yellowSoft: "#fff3c4", star: "#f0b23a", pink: "#e0559a", orange: "#f39a1e",
  cubeTop: "#ffeaa6", cubeFront: "#ffd45c", cubeSide: "#f0b23a", cubeLine: "#a8741a",
  given: "#2f6fe0", doing: "#d39b20", check: "#16734b", ink: "#222222", card: "#fff3c4", cardLine: "#f0a500"
});

export function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.04, ...options });
}

// 둥근 모서리 상자(가운데가 원점). 아이 교구처럼 보이게 모서리를 살짝 굴린다.
export function roundedBoxGeometry(width, height, depth, radius = 0.06, segments = 3) {
  const r = Math.min(radius, width / 2 - 0.001, height / 2 - 0.001, depth / 2 - 0.001);
  const w = width - 2 * r, h = height - 2 * r, d = Math.max(0.0001, depth - 2 * r);
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -h / 2); shape.lineTo(w / 2, -h / 2); shape.lineTo(w / 2, h / 2); shape.lineTo(-w / 2, h / 2); shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelSize: r, bevelThickness: r, bevelSegments: segments, curveSegments: 4 });
  geometry.translate(0, 0, -d / 2);
  geometry.computeVertexNormals();
  return geometry;
}

// 글자 그림(숫자 타일·공의 글자). 같은 글자·모양은 한 번만 만든다(무대가 사라지면 함께 버린다).
export function textCanvas(text, { size = 128, color = GB_COLORS.ink, background = null, border = null, radius = 0.22, weight = 900, scale = 0.62, aspect = 1 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(size * aspect); canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (background) {
    const r = size * radius, w = canvas.width, h = canvas.height, inset = border ? size * 0.05 : 0;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, r); else ctx.rect(inset, inset, w - inset * 2, h - inset * 2);
    ctx.fillStyle = background; ctx.fill();
    if (border) { ctx.lineWidth = size * 0.07; ctx.strokeStyle = border; ctx.stroke(); }
  }
  ctx.fillStyle = color;
  ctx.font = `${weight} ${Math.round(size * scale)}px "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(String(text), canvas.width / 2, size * 0.54);
  return canvas;
}
export function textTexture(text, options) {
  const texture = new THREE.CanvasTexture(textCanvas(text, options));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// 평면 그림으로 바꿔 보여 줄 때 위에 한 줄 알림.
export function flatNotice(host, text = "이 기기에서는 입체 화면을 쓸 수 없어서 평면 그림으로 보여 줄게요.") {
  const note = document.createElement("p");
  note.className = "g3d-fallback";
  note.setAttribute("role", "note");
  note.textContent = text;
  host.prepend(note);
  return note;
}

const live = new Set();
export function liveStageCount() { return live.size; }

export function createStage3D(host, options = {}) {
  const o = {
    fov: 32, fitMargin: 0.88, theta: 0.6, phi: 1.0, orbit: true, thetaRange: null, phiRange: [0.18, 1.5], zoomRange: [0.35, 1.8],
    shadows: true, ground: true, groundY: 0, frame: null, fullscreen: true, fullscreenTarget: host, hint: true, touchAction: "pan-y",
    onTap: null, pickables: null, onPointerDown: null, onFrame: null, afterRender: null, onFullscreen: null, ...options
  };
  if (o.forceFlat || !canUseWebGL()) return null;
  const canvas = document.createElement("canvas");
  canvas.className = "g3d-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.touchAction = o.touchAction;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch { return null; }
  const lowPower = typeof matchMedia === "function" && (matchMedia("(max-width: 760px)").matches || (navigator.deviceMemory && navigator.deviceMemory <= 4));
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lowPower ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = Boolean(o.shadows);
  renderer.shadowMap.type = THREE.PCFShadowMap;

  if (getComputedStyle(host).position === "static") host.style.position = "relative";
  host.classList.add("g3d");
  host.dataset.renderer = "webgl";
  const labelLayer = document.createElement("div");
  labelLayer.className = "g3d-labels";
  labelLayer.setAttribute("aria-hidden", "true");
  const tools = document.createElement("div");
  tools.className = "g3d-tools";
  tools.innerHTML = `<button type="button" class="g3d-home" hidden aria-label="처음 보던 시점으로 돌아가기">↺ 처음 시점</button>${o.fullscreen ? '<button type="button" class="g3d-full" aria-pressed="false" aria-label="크게 보기" title="크게 보기">⤢</button>' : ""}`;
  const hint = document.createElement("p");
  hint.className = "g3d-hint";
  hint.setAttribute("aria-hidden", "true");
  hint.textContent = coarsePointer() ? "옆으로 끌어 돌려요 · 두 손가락 확대" : "끌어서 돌려 보기 · Ctrl+휠로 확대";
  hint.hidden = !o.hint || !o.orbit;
  host.append(canvas, labelLayer, tools, hint);
  const homeButton = tools.querySelector(".g3d-home");
  const fullButton = tools.querySelector(".g3d-full");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(o.fov, 1, 0.05, 200);
  const root = new THREE.Group();
  scene.add(root);
  const cleanups = [];
  const on = (target, type, handler, options) => { target.addEventListener(type, handler, options); cleanups.push(() => target.removeEventListener(type, handler, options)); };

  // 조명: 하늘빛 + 왼쪽 위 주광(그림자) + 오른쪽 보조광. 환경 반사는 코드로 만든 작은 스튜디오.
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9ccb4, 0.95));
  const key = new THREE.DirectionalLight(0xfff3e4, 2.1);
  key.position.set(-4, 10, 7);
  key.castShadow = Boolean(o.shadows);
  key.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  key.shadow.bias = -0.0005; key.shadow.normalBias = 0.02; key.shadow.radius = 4;
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xdfe9ff, 0.55);
  fill.position.set(7, 3, 5);
  scene.add(fill);
  let envTexture = null;
  try {
    const room = new THREE.Scene();
    const sphere = new THREE.SphereGeometry(20, 24, 12), colors = [], pos = sphere.attributes.position;
    const top = new THREE.Color(0xffffff), mid = new THREE.Color(0xeae6dc), low = new THREE.Color(0x8c8170), c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 20; c.copy(y > 0 ? mid.clone().lerp(top, y) : mid.clone().lerp(low, Math.min(1, -y * 1.6))); colors.push(c.r, c.g, c.b); }
    sphere.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    room.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
    for (const [x, y, z, w, h, k] of [[9, 7, 7, 7, 9, 2.2], [-10, 5, 4, 4, 9, 1.3], [0, 15, 0, 9, 7, 1.0]]) {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * 0.97), side: THREE.DoubleSide }));
      panel.position.set(x, y, z); panel.lookAt(0, 0, 0); room.add(panel);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    envTexture = pmrem.fromScene(room, 0.03).texture;
    scene.environment = envTexture; scene.environmentIntensity = 0.5;
    pmrem.dispose(); room.traverse((n) => { n.geometry?.dispose(); n.material?.dispose(); });
  } catch { /* 환경 반사가 안 되는 기기면 조명만으로 */ }
  let ground = null;
  if (o.ground) {
    ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ color: 0x3b2c1a, opacity: 0.18, depthWrite: false }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = o.groundY; ground.receiveShadow = true; ground.renderOrder = -1;
    ground.userData.noFrame = true;
    scene.add(ground);
  }

  // ───── 카메라: 각도는 장면이, 거리·가운데는 자동 맞춤이 ─────
  const orbit = { theta: o.theta, phi: o.phi, dist: 10, target: new THREE.Vector3(), home: { theta: o.theta, phi: o.phi, dist: 10, target: new THREE.Vector3() } };
  let frameBox = o.frame, needFit = true, fitAspect = 0, userMoved = false, goHomeAnim = false, glide = null;
  const labels = new Set();
  const tmpBox = new THREE.Box3(), tmpV = new THREE.Vector3(), q = new THREE.Vector3();
  function boxCorners(box, out) { for (let i = 0; i < 8; i++) out.push(new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z)); }
  function framePoints() {
    const pts = [];
    const fixed = typeof frameBox === "function" ? frameBox() : frameBox;
    if (fixed) boxCorners(new THREE.Box3(new THREE.Vector3(...fixed[0]), new THREE.Vector3(...fixed[1])), pts);
    else {
      root.updateMatrixWorld(true);
      const visit = (node) => {
        if (!node.visible || node.userData.noFrame || node.isPoints || node.isLine || node.isSprite) return;
        if (node.isMesh && node.geometry) {
          if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
          tmpBox.copy(node.geometry.boundingBox);
          if (!tmpBox.isEmpty() && tmpBox.clone().applyMatrix4(node.matrixWorld).getSize(tmpV).length() < 40) {
            const corners = []; boxCorners(tmpBox, corners);
            for (const p of corners) pts.push(p.applyMatrix4(node.matrixWorld));
          }
        }
        node.children.forEach(visit);
      };
      root.children.forEach(visit);
    }
    for (const label of labels) if (label.visible && label.frame) pts.push(label.anchor().clone());
    return pts;
  }
  const dirOf = (theta, phi) => new THREE.Vector3(Math.sin(phi) * Math.sin(theta), Math.cos(phi), Math.sin(phi) * Math.cos(theta));
  // 그 각도에서 모든 점이 화면 안(여백 fitMargin)에 드는 가장 가까운 거리와 가운데 — 한쪽으로 쏠리지 않게 세 번 다시 잰다.
  function solveFit(theta, phi) {
    const pts = framePoints();
    if (!pts.length) return null;
    const d = dirOf(theta, phi);
    const r = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), d);
    if (r.lengthSq() < 1e-6) r.set(1, 0, 0); else r.normalize();
    const u = new THREE.Vector3().crossVectors(d, r).normalize();
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * o.fitMargin, th = tv * camera.aspect;
    const c = new THREE.Box3().setFromPoints(pts).getCenter(new THREE.Vector3());
    const need = () => { let D = 0; for (const p of pts) { q.subVectors(p, c); const z = q.dot(d); D = Math.max(D, z + Math.abs(q.dot(r)) / th, z + Math.abs(q.dot(u)) / tv); } return D; };
    let D = need();
    for (let k = 0; k < 3; k++) {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of pts) { q.subVectors(p, c); const w = Math.max(0.01, D - q.dot(d)), sx = q.dot(r) / w, sy = q.dot(u) / w; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
      c.addScaledVector(r, (x0 + x1) / 2 * D).addScaledVector(u, (y0 + y1) / 2 * D);
      D = need();
    }
    return { D: Math.max(0.5, Math.min(120, D)), c, radius: new THREE.Box3().setFromPoints(pts).getBoundingSphere(new THREE.Sphere()).radius };
  }
  function fit() {
    const h = orbit.home, f = solveFit(h.theta, h.phi);
    if (!f) return false;
    h.dist = f.D; h.target.copy(f.c);
    if (!userMoved && !glide) { orbit.dist = f.D; orbit.target.copy(f.c); }
    fitAspect = camera.aspect;
    // 그림자 상자를 장면 크기에 맞춘다(너무 크면 그림자가 흐려지고, 작으면 잘린다).
    const s = Math.max(2, f.radius * 1.4);
    Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 0.5, far: 40 + s * 2 });
    key.shadow.camera.updateProjectionMatrix();
    key.target.position.copy(f.c);
    key.position.copy(f.c).add(new THREE.Vector3(-4, 10, 7).setLength(14 + s));
    return true;
  }
  const wrapAngle = (a) => { a %= Math.PI * 2; if (a > Math.PI) a -= Math.PI * 2; if (a < -Math.PI) a += Math.PI * 2; return a; };
  function clampAngles() {
    if (o.thetaRange) orbit.theta = Math.max(o.thetaRange[0], Math.min(o.thetaRange[1], orbit.theta));
    orbit.phi = Math.max(o.phiRange[0], Math.min(o.phiRange[1], orbit.phi));
  }
  function stepCamera(dt) {
    const goal = goHomeAnim ? orbit.home : glide;
    if (!goal) return false;
    const k = prefersReducedMotion() ? 1 : 1 - Math.exp(-dt * 7);
    orbit.theta += wrapAngle(goal.theta - orbit.theta) * k;
    orbit.phi += (goal.phi - orbit.phi) * k;
    orbit.dist += (goal.dist - orbit.dist) * k;
    orbit.target.lerp(goal.target, k);
    if (Math.abs(wrapAngle(goal.theta - orbit.theta)) + Math.abs(goal.phi - orbit.phi) < 0.002 && Math.abs(goal.dist - orbit.dist) < 0.005 && orbit.target.distanceTo(goal.target) < 0.005) {
      orbit.theta = goal.theta; orbit.phi = goal.phi; orbit.dist = goal.dist; orbit.target.copy(goal.target);
      if (goHomeAnim) { goHomeAnim = false; userMoved = false; }
      glide = null;
      return false;
    }
    return true;
  }
  function applyCamera() {
    const d = dirOf(orbit.theta, orbit.phi);
    camera.position.copy(orbit.target).addScaledVector(d, orbit.dist);
    camera.up.set(0, 1, 0);
    camera.lookAt(orbit.target);
    camera.updateMatrixWorld();
  }
  let width = 1, height = 1;
  function resizeIfNeeded() {
    const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
    if (w === width && h === height) return;
    width = w; height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  // 그리기 전에 카메라만 맞춘다(HTML 단추 자리를 잴 때).
  function ensureCamera() {
    resizeIfNeeded();
    if (needFit || Math.abs(camera.aspect - fitAspect) > 0.01) { if (fit()) needFit = false; }
    applyCamera();
  }

  // ───── 그리기: 할 일이 있을 때만 프레임을 돈다 ─────
  let raf = 0, last = 0, disposed = false, inView = true, pageVisible = document.visibilityState !== "hidden", lost = false, dragging = false;
  const tweens = new Set();
  function request() { if (!raf && !disposed && inView && pageVisible) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    if (disposed) return;
    if (!host.isConnected) { dispose(); return; }
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    ensureCamera();
    let busy = stepCamera(dt);
    if (busy) applyCamera();
    for (const t of [...tweens]) {
      const k = Math.min(1, (now - t.start) / t.duration);
      t.update(t.ease(k));
      if (k >= 1) { tweens.delete(t); t.done?.(); }
    }
    if (o.onFrame?.(dt, now) === true) busy = true;
    if (!lost) renderer.render(scene, camera);
    placeLabels();
    o.afterRender?.();
    if (busy || tweens.size || dragging) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  function tween(duration, update, { ease = easeOutCubic, done } = {}) {
    if (prefersReducedMotion() || duration <= 0) { update(1); done?.(); request(); return () => {}; }
    const t = { start: performance.now(), duration, update, ease, done };
    tweens.add(t);
    request();
    return () => { tweens.delete(t); };
  }

  // ───── 라벨(HTML) ─────
  function placeLabels() {
    if (!labels.size) return;
    const placed = [];
    const pad = 6;
    for (const label of labels) {
      if (!label.visible) { label.el.style.visibility = "hidden"; continue; }
      tmpV.copy(label.anchor()).project(camera);
      if (tmpV.z > 1) { label.el.style.visibility = "hidden"; continue; }
      const w = label.el.offsetWidth, h = label.el.offsetHeight;
      let x = (tmpV.x + 1) / 2 * width, y = (1 - tmpV.y) / 2 * height;
      x = Math.max(pad + w / 2, Math.min(width - pad - w / 2, x));
      y = Math.max(pad + h / 2, Math.min(height - pad - h / 2, y));
      placed.push({ label, x, y, w, h });
    }
    placed.sort((a, b) => a.y - b.y);
    // 겹치면 뒤의 것을 아래로 한 칸(아래 가장자리를 넘으면 위로).
    for (let i = 1; i < placed.length; i++) for (let j = 0; j < i; j++) {
      const a = placed[j], b = placed[i];
      if (Math.abs(a.x - b.x) < (a.w + b.w) / 2 + 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + 2) {
        b.y = a.y + (a.h + b.h) / 2 + 3;
        if (b.y > height - pad - b.h / 2) b.y = a.y - (a.h + b.h) / 2 - 3;
      }
    }
    for (const p of placed) {
      p.label.el.style.visibility = "visible";
      p.label.el.style.transform = `translate(${Math.round(p.x - p.w / 2)}px, ${Math.round(p.y - p.h / 2)}px)`;
    }
  }
  function label(text, anchor, { cls = "", frame = true } = {}) {
    const el = document.createElement("span");
    el.className = `g3d-label ${cls}`.trim();
    el.textContent = text;
    labelLayer.append(el);
    const vec = anchor instanceof THREE.Vector3 ? anchor : null;
    const handle = {
      el, visible: true, frame,
      anchor: typeof anchor === "function" ? anchor : () => vec || new THREE.Vector3(...anchor),
      set(value) { el.textContent = value; request(); return handle; },
      setClass(value) { el.className = `g3d-label ${value}`.trim(); request(); return handle; },
      show(visible) { handle.visible = visible; request(); return handle; },
      remove() { labels.delete(handle); el.remove(); }
    };
    labels.add(handle);
    request();
    return handle;
  }

  // ───── 입력 ─────
  const pointers = new Map();
  let drag = null, pinch = null;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function setRay(clientX, clientY) {
    ensureCamera();
    const box = canvas.getBoundingClientRect();
    ndc.set((clientX - box.left) / box.width * 2 - 1, -((clientY - box.top) / box.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return raycaster;
  }
  function raycast(clientX, clientY, objects) {
    return setRay(clientX, clientY).intersectObjects(objects || [], true);
  }
  function rayToPlane(clientX, clientY, plane) {
    const out = new THREE.Vector3();
    return setRay(clientX, clientY).ray.intersectPlane(plane, out) ? out : null;
  }
  function markMoved() {
    if (!userMoved) { userMoved = true; }
    homeButton.hidden = false;
    hint.hidden = true;
  }
  const isFull = () => document.fullscreenElement === o.fullscreenTarget || o.fullscreenTarget.classList.contains("g3d-pseudo-full");
  on(canvas, "pointerdown", (event) => {
    if (o.onPointerDown?.(event) === true) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, dist: orbit.dist };
      drag = null;
      return;
    }
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, t: performance.now(), theta: orbit.theta, phi: orbit.phi, moved: false, type: event.pointerType };
    try { canvas.setPointerCapture(event.pointerId); } catch { /* 이미 놓음 */ }
  });
  on(canvas, "pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      zoomTo(pinch.dist * pinch.d / d);
      return;
    }
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 8) drag.moved = true;
    if (!drag.moved || !o.orbit) return;
    goHomeAnim = false; glide = null; dragging = true;
    orbit.theta = drag.theta - dx / Math.max(1, width) * 3.2;
    if (isFull() || drag.type !== "touch") orbit.phi = drag.phi - dy / Math.max(1, height) * 2.4;
    clampAngles();
    markMoved();
    request();
  });
  const release = (event) => {
    const wasDrag = drag && drag.id === event.pointerId ? drag : null;
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinch = null;
    if (!wasDrag) return;
    drag = null; dragging = false;
    if (event.type === "pointerup" && !wasDrag.moved && performance.now() - wasDrag.t < 450 && o.onTap) {
      const hits = o.pickables ? raycast(event.clientX, event.clientY, o.pickables()) : [];
      o.onTap(hits[0] || null, event, hits);
    }
  };
  on(canvas, "pointerup", release);
  on(canvas, "pointercancel", release);
  function zoomTo(dist) {
    const h = orbit.home.dist || 8;
    orbit.dist = Math.max(h * o.zoomRange[0], Math.min(h * o.zoomRange[1], dist));
    goHomeAnim = false; glide = null;
    markMoved();
    request();
  }
  on(canvas, "wheel", (event) => { if (!event.ctrlKey) return; event.preventDefault(); zoomTo(orbit.dist * (1 + Math.sign(event.deltaY) * 0.08)); }, { passive: false });
  on(canvas, "dblclick", () => goHome());
  on(homeButton, "click", (event) => { event.stopPropagation(); goHome(); });
  on(homeButton, "pointerdown", (event) => event.stopPropagation());
  function goHome() {
    glide = null; goHomeAnim = true;
    homeButton.hidden = true;
    needFit = true;
    request();
  }
  // 정해진 방향(앞·옆·위)에서 보기 — 그 각도에 맞춰 다시 재고 부드럽게 옮긴다.
  function lookFrom(theta, phi) {
    ensureCamera();
    const f = solveFit(theta, phi);
    if (!f) return;
    glide = { theta, phi, dist: f.D, target: f.c };
    goHomeAnim = false;
    markMoved();
    request();
  }

  // ───── 전체 화면: 진짜 전체 화면이 안 되면(아이폰 등) 화면에 꽉 차는 상자로 ─────
  async function toggleFullscreen() {
    const target = o.fullscreenTarget;
    if (isFull()) {
      if (document.fullscreenElement === target) { try { await document.exitFullscreen(); } catch { /* 이미 나옴 */ } }
      else { target.classList.remove("g3d-pseudo-full"); document.documentElement.classList.remove("g3d-lock-scroll"); fullChanged(); }
      return;
    }
    target.classList.add("g3d-fs");
    if (target.requestFullscreen && document.fullscreenEnabled) {
      try { await target.requestFullscreen({ navigationUI: "hide" }); return; } catch { /* 아래로 */ }
    }
    target.classList.add("g3d-pseudo-full");
    document.documentElement.classList.add("g3d-lock-scroll");
    fullChanged();
  }
  function fullChanged() {
    const full = isFull();
    host.classList.toggle("is-full", full);
    canvas.style.touchAction = full ? "none" : o.touchAction;
    if (fullButton) { fullButton.setAttribute("aria-pressed", String(full)); fullButton.textContent = full ? "✕" : "⤢"; fullButton.setAttribute("aria-label", full ? "작게 보기" : "크게 보기"); fullButton.title = full ? "작게 보기" : "크게 보기"; }
    // 켜고 끌 때는 새 화면 비율로 처음 시점부터 다시 잡는다(확대해 둔 것도 풀고).
    userMoved = false; glide = null; goHomeAnim = false; needFit = true; homeButton.hidden = true;
    width = height = 0;
    requestAnimationFrame(() => { ensureCamera(); orbit.theta = orbit.home.theta; orbit.phi = orbit.home.phi; orbit.dist = orbit.home.dist; orbit.target.copy(orbit.home.target); request(); });
    o.onFullscreen?.(full);
  }
  if (fullButton) on(fullButton, "click", (event) => { event.stopPropagation(); toggleFullscreen(); });
  on(document, "fullscreenchange", () => { if (!document.fullscreenElement) o.fullscreenTarget.classList.remove("g3d-fs"); fullChanged(); });
  on(document, "keydown", (event) => { if (event.key === "Escape" && o.fullscreenTarget.classList.contains("g3d-pseudo-full")) toggleFullscreen(); });

  // ───── 보임·크기·문맥 ─────
  const resizeObserver = new ResizeObserver(() => request());
  resizeObserver.observe(host);
  let intersection = null;
  if ("IntersectionObserver" in window) {
    // 캔버스를 옮기면 한 번에 「안 보임→보임」 두 개가 온다 — 마지막 항목이 지금 상태.
    intersection = new IntersectionObserver((entries) => { inView = Boolean(entries[entries.length - 1]?.isIntersecting); if (inView) request(); }, { threshold: 0.01 });
    intersection.observe(canvas);
  }
  on(document, "visibilitychange", () => { pageVisible = document.visibilityState !== "hidden"; if (pageVisible) request(); });
  on(canvas, "webglcontextlost", (event) => { event.preventDefault(); lost = true; host.dataset.contextLost = "true"; });
  on(canvas, "webglcontextrestored", () => { lost = false; delete host.dataset.contextLost; request(); });
  const hintTimer = setTimeout(() => { hint.hidden = true; }, 7000);

  function disposeObject(object) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    object.traverse((n) => {
      if (n.geometry) geometries.add(n.geometry);
      for (const m of Array.isArray(n.material) ? n.material : n.material ? [n.material] : []) {
        materials.add(m);
        for (const value of Object.values(m)) if (value?.isTexture) textures.add(value);
      }
    });
    geometries.forEach((g) => g.dispose()); materials.forEach((m) => m.dispose()); textures.forEach((t) => t.dispose());
  }
  function clear() {
    for (const child of [...root.children]) { root.remove(child); disposeObject(child); }
    for (const l of [...labels]) l.remove();
    request();
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    live.delete(stage);
    cancelAnimationFrame(raf); raf = 0;
    clearTimeout(hintTimer);
    tweens.clear();
    resizeObserver.disconnect();
    intersection?.disconnect();
    cleanups.splice(0).forEach((off) => off());
    if (isFull()) {
      if (document.fullscreenElement === o.fullscreenTarget) document.exitFullscreen?.().catch(() => {});
      o.fullscreenTarget.classList.remove("g3d-pseudo-full", "g3d-fs");
      document.documentElement.classList.remove("g3d-lock-scroll");
    }
    disposeObject(scene);
    envTexture?.dispose();
    key.shadow.map?.dispose();
    renderer.renderLists?.dispose();
    renderer.dispose();
    try { renderer.forceContextLoss(); } catch { /* 이미 잃음 */ }
    canvas.remove(); labelLayer.remove(); tools.remove(); hint.remove();
    host.classList.remove("g3d", "is-full");
  }

  const stage = {
    THREE, scene, root, camera, renderer, canvas, host,
    get reduced() { return prefersReducedMotion(); },
    get fullscreen() { return isFull(); },
    get userMoved() { return userMoved; },
    // 각도와 (움직이는 물체가 있으면) 다 놓였을 때의 작업 공간 frame: [[x0,y0,z0],[x1,y1,z1]] 또는 그것을 돌려주는 함수.
    setView({ theta = orbit.home.theta, phi = orbit.home.phi, frame } = {}) {
      orbit.home.theta = theta; orbit.home.phi = phi;
      if (frame !== undefined) frameBox = frame;
      orbit.theta = theta; orbit.phi = phi;
      userMoved = false; goHomeAnim = false; glide = null; homeButton.hidden = true;
      needFit = true; request();
    },
    refit() { needFit = true; request(); },
    request, tween, label, raycast, rayToPlane, lookFrom, goHome, clear, ensureCamera, toggleFullscreen,
    project(vector) { ensureCamera(); tmpV.copy(vector).project(camera); return { x: (tmpV.x + 1) / 2 * width, y: (1 - tmpV.y) / 2 * height, width, height, behind: tmpV.z > 1 }; },
    // 화면(브라우저 창) 좌표 — 검사기가 3D 물체를 실제로 누를 때 쓴다.
    clientPoint(vector) { const p = stage.project(vector), box = canvas.getBoundingClientRect(); return { x: box.left + p.x, y: box.top + p.y }; },
    dispose
  };
  live.add(stage);
  ensureCamera();
  request();
  return stage;
}
