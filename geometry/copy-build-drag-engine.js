import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { COPY_BUILD_LEVELS, BLOCK_TYPES, getCopyBuildLevel } from "./copy-build-levels.js";
import { captureBuildCanvas } from "./capture-build.js";

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const levelNumber = Math.min(5, Math.max(1, Number(params.get("level")) || 1));
const level = getCopyBuildLevel(levelNumber);
const isCreative = level.mode === "creative";
const board = levelNumber === 3 ? { columns: 4, rows: 4, maxHeight: 4 } : (level.board ?? level.variants?.[0]?.board);
const palette = [0xe6bd78, 0x65b878, 0x4d9fd0, 0xf0c94d, 0xdf6d71];
const state = { type: BLOCK_TYPES.CUBE, rotation: 0, color: 0, blocks: [], problem: 0, dragging: false, candidate: null };

const PROBLEMS = {
  1: [
    [{ type: "cube", x: 0, y: 0, z: 0 }, { type: "cube", x: 1, y: 0, z: 0 }, { type: "cube", x: 0, y: 0, z: 1 }],
    [{ type: "cube", x: 0, y: 0, z: 0 }, { type: "cube", x: 0, y: 0, z: 1 }, { type: "cube", x: 1, y: 0, z: 1 }, { type: "cube", x: 1, y: 1, z: 1 }]
  ],
  2: [
    [{ type: "cube", x: 0, y: 0, z: 0 }, { type: "cube", x: 0, y: 1, z: 0 }, { type: "cube", x: 1, y: 0, z: 0 }, { type: "cube", x: 1, y: 0, z: 1 }, { type: "cube", x: 1, y: 1, z: 1 }],
    [{ type: "cube", x: 0, y: 0, z: 1 }, { type: "cube", x: 1, y: 0, z: 1 }, { type: "cube", x: 1, y: 1, z: 1 }, { type: "cube", x: 1, y: 2, z: 1 }, { type: "cube", x: 2, y: 0, z: 1 }]
  ],
  3: [
    [{ type: "cube", x: 0, y: 0, z: 0, color: 1 }, { type: "cube", x: 1, y: 0, z: 0, color: 2 }, { type: "cube", x: 1, y: 1, z: 0, color: 3 }, { type: "cube", x: 1, y: 0, z: 1, color: 4 }],
    [{ type: "cube", x: 0, y: 0, z: 0 }, { type: "cube", x: 1, y: 0, z: 0 }, { type: "cube", x: 2, y: 0, z: 0 }, { type: "cube", x: 3, y: 0, z: 0 }, { type: "cube", x: 1, y: 1, z: 0 }, { type: "cube", x: 1, y: 2, z: 0 }, { type: "cube", x: 1, y: 3, z: 0 }]
  ],
  4: [
    [{ type: "rectangular-prism", x: 0, y: 0, z: 0, rotation: 0 }, { type: "rectangular-prism", x: 0, y: 0, z: 1, rotation: 1 }, { type: "rectangular-prism", x: 1, y: 0, z: 1, rotation: 0 }],
    [{ type: "rectangular-prism", x: 0, y: 0, z: 0, rotation: 1 }, { type: "rectangular-prism", x: 1, y: 0, z: 0, rotation: 1 }, { type: "rectangular-prism", x: 2, y: 0, z: 0, rotation: 1 }, { type: "rectangular-prism", x: 0, y: 0, z: 2, rotation: 0 }]
  ]
};

function sizeOf(type, rotation = 0) {
  return type === BLOCK_TYPES.RECTANGULAR_PRISM
    ? (rotation % 2 ? [1, 1, 2] : [2, 1, 1])
    : [1, 1, 1];
}

function material(color = 0, preview = false, valid = true) {
  if (preview) {
    return new THREE.MeshBasicMaterial({
      color: valid ? 0xff3b30 : 0x8f1d1d,
      transparent: true,
      opacity: valid ? 0.38 : 0.2,
      depthWrite: false
    });
  }
  return new THREE.MeshPhysicalMaterial({ color: palette[color] ?? palette[0], roughness: 0.38, clearcoat: 0.18, clearcoatRoughness: 0.45 });
}

function makeBlock(data, preview = false, valid = true) {
  const [w, h, d] = sizeOf(data.type, data.rotation || 0);
  const geometry = new THREE.BoxGeometry(w * 0.94, h * 0.94, d * 0.94);
  geometry.translate(0, h / 2, 0);
  const mesh = new THREE.Mesh(geometry, material(data.color || 0, preview, valid));
  mesh.position.set(data.x + (w - 1) / 2 - (board.columns - 1) / 2, data.y, data.z + (d - 1) / 2 - (board.rows - 1) / 2);
  mesh.castShadow = !preview;
  mesh.receiveShadow = !preview;
  if (preview) {
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0xff2d22, transparent: true, opacity: 0.95 }));
    mesh.add(edges);
    mesh.renderOrder = 10;
  }
  return mesh;
}

function makeViewer(host, interactive) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(5.8, 5.3, 6.4);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.target.set(0, 1.2, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8aa93, 2.2));
  const key = new THREE.DirectionalLight(0xfff4df, 3);
  key.position.set(5, 9, 4);
  key.castShadow = true;
  scene.add(key);
  const boardMesh = new THREE.Mesh(new THREE.BoxGeometry(board.columns + 0.45, 0.18, board.rows + 0.45), new THREE.MeshStandardMaterial({ color: 0xd7b47a, roughness: 0.6 }));
  boardMesh.position.y = -0.12;
  boardMesh.receiveShadow = true;
  scene.add(boardMesh);
  const grid = new THREE.GridHelper(Math.max(board.columns, board.rows), Math.max(board.columns, board.rows), 0x8e6d44, 0xc8aa7b);
  grid.position.y = 0.01;
  scene.add(grid);
  const group = new THREE.Group();
  const previewGroup = new THREE.Group();
  scene.add(group, previewGroup);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(board.columns, board.rows), new THREE.MeshBasicMaterial({ visible: false }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.03;
  scene.add(floor);
  return { host, scene, camera, renderer, controls, group, previewGroup, floor, interactive };
}

const target = makeViewer($("#targetCanvas"), false);
const build = makeViewer($("#buildCanvas"), true);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function clear(group) {
  while (group.children.length) {
    const child = group.children.pop();
    child.traverse((node) => { node.geometry?.dispose(); node.material?.dispose(); });
  }
}

function occupied(item) {
  const [w, , d] = sizeOf(item.type, item.rotation || 0);
  const cells = [];
  for (let dx = 0; dx < w; dx++) for (let dz = 0; dz < d; dz++) cells.push(`${item.x + dx},${item.y},${item.z + dz}`);
  return cells;
}

function canPlace(item) {
  const [w, , d] = sizeOf(item.type, item.rotation || 0);
  if (item.x < 0 || item.z < 0 || item.x + w > board.columns || item.z + d > board.rows || item.y < 0 || item.y >= board.maxHeight) return false;
  const used = new Set(state.blocks.flatMap(occupied));
  if (occupied(item).some((cell) => used.has(cell))) return false;
  if (item.y === 0) return true;
  return occupied({ ...item, y: item.y - 1 }).every((cell) => used.has(cell));
}

function heightFor(x, z) {
  for (let y = 0; y < board.maxHeight; y++) {
    const item = { type: state.type, rotation: state.rotation, color: state.color, x, y, z };
    if (canPlace(item)) return y;
  }
  return -1;
}

function candidateFromEvent(event) {
  const rect = build.renderer.domElement.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return null;
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, build.camera);
  const hit = raycaster.intersectObject(build.floor)[0];
  if (!hit) return null;
  const x = Math.floor(hit.point.x + board.columns / 2);
  const z = Math.floor(hit.point.z + board.rows / 2);
  const y = heightFor(x, z);
  return { type: state.type, rotation: state.rotation, color: state.color, x, y: Math.max(0, y), z, valid: y >= 0 };
}

function showPreview(candidate) {
  clear(build.previewGroup);
  state.candidate = candidate;
  if (candidate) build.previewGroup.add(makeBlock(candidate, true, candidate.valid));
}

function redraw() {
  clear(build.group);
  state.blocks.forEach((item) => build.group.add(makeBlock(item)));
  if (isCreative) $("#countValue").textContent = String(state.blocks.length);
}

function renderProblem() {
  if (isCreative) return;
  clear(target.group);
  const list = PROBLEMS[levelNumber] || PROBLEMS[1];
  list[state.problem % list.length].forEach((item) => target.group.add(makeBlock(item)));
  $("#countValue").textContent = `${state.problem + 1}/${list.length}`;
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 1800);
}

function beginDrag(event, type) {
  event.preventDefault();
  state.type = type;
  state.dragging = true;
  build.controls.enabled = false;
  document.body.classList.add("block-dragging");
  $("#handStatus").textContent = type === BLOCK_TYPES.CUBE ? "정육면체를 끌고 있어요" : "직육면체를 끌고 있어요";
  event.currentTarget.setPointerCapture?.(event.pointerId);
  showPreview(candidateFromEvent(event));
}

function moveDrag(event) {
  if (!state.dragging) return;
  event.preventDefault();
  showPreview(candidateFromEvent(event));
}

function endDrag(event) {
  if (!state.dragging) return;
  const candidate = candidateFromEvent(event) ?? state.candidate;
  if (candidate?.valid) {
    state.blocks.push({ type: candidate.type, rotation: candidate.rotation, color: candidate.color, x: candidate.x, y: candidate.y, z: candidate.z });
    redraw();
  } else if (candidate) {
    toast("그 자리에는 놓을 수 없어요.");
  }
  state.dragging = false;
  state.candidate = null;
  build.controls.enabled = true;
  document.body.classList.remove("block-dragging");
  clear(build.previewGroup);
  $("#handStatus").textContent = "보관함에서 블록을 끌어오세요";
}

document.addEventListener("pointermove", moveDrag, { passive: false });
document.addEventListener("pointerup", endDrag);
document.addEventListener("pointercancel", endDrag);

function createTray() {
  const tray = document.createElement("div");
  tray.className = "block-type-tray drag-tray";
  const allowed = level.allowedBlocks ?? level.variants?.[0]?.allowedBlocks ?? [BLOCK_TYPES.CUBE];
  allowed.forEach((type) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "draggable-block";
    button.dataset.blockType = type;
    button.innerHTML = `<span class="tray-block ${type}"></span><strong>${type === BLOCK_TYPES.CUBE ? "정육면체" : "직육면체"}</strong><small>끌어서 놓기</small>`;
    button.addEventListener("pointerdown", (event) => beginDrag(event, type));
    tray.appendChild(button);
  });
  if (allowed.includes(BLOCK_TYPES.RECTANGULAR_PRISM)) {
    const rotate = document.createElement("button");
    rotate.type = "button";
    rotate.textContent = "방향 돌리기";
    rotate.addEventListener("click", () => { state.rotation = (state.rotation + 1) % 2; toast(state.rotation ? "세로 방향" : "가로 방향"); });
    tray.appendChild(rotate);
  }
  if (levelNumber === 3 || isCreative) {
    const color = document.createElement("button");
    color.type = "button";
    color.textContent = "색 바꾸기";
    color.addEventListener("click", () => { state.color = (state.color + 1) % palette.length; color.style.setProperty("--swatch", `#${palette[state.color].toString(16).padStart(6, "0")}`); });
    tray.appendChild(color);
  }
  $("#cubePile").replaceWith(tray);
}

function normalize(items) {
  return items.map((item) => `${item.type}:${item.x}:${item.y}:${item.z}:${item.rotation || 0}:${levelNumber === 3 ? item.color || 0 : 0}`).sort();
}

function checkAnswer() {
  const list = PROBLEMS[levelNumber] || [];
  const answer = list[state.problem % Math.max(1, list.length)] || [];
  const a = normalize(answer), b = normalize(state.blocks);
  if (a.length !== b.length || !a.every((value, index) => value === b[index])) return toast("위치, 높이, 색깔과 방향을 다시 살펴보세요.");
  const words = ["GOOD JOB!", "GREAT JOB!", "SUCCESS!"];
  $("#successBurst strong").textContent = words[Math.floor(Math.random() * words.length)];
  $("#successBurst").classList.remove("show");
  requestAnimationFrame(() => $("#successBurst").classList.add("show"));
  toast("똑같이 만들었어요!");
}

function camera(mode) {
  (isCreative ? [build] : [target, build]).forEach((viewer) => {
    viewer.camera.position.set(...(mode === "front" ? [0, 2.4, 7.5] : mode === "top" ? [0.01, 8.5, 0.01] : [5.8, 5.3, 6.4]));
    viewer.controls.target.set(0, 1.2, 0);
    viewer.controls.update();
  });
}

function setup() {
  document.body.dataset.copyBuildLevel = String(levelNumber);
  $("#modeTitle").textContent = level.title;
  $("#instruction").textContent = isCreative ? "보관함에서 블록을 끌어 자유롭게 만들고 사진으로 남겨 보세요." : "보관함에서 블록을 끌어 빨간 위치에 놓고 문제 모양과 똑같이 만들어 보세요.";
  $("#stars").textContent = "★".repeat(levelNumber) + "☆".repeat(5 - levelNumber);
  if (isCreative) {
    $(".target-view").hidden = true;
    $(".build-view").classList.add("creative-view");
    $("#checkAnswer").hidden = true;
    $("#nextStep").hidden = true;
    $("#captureBuild").hidden = false;
  }
  createTray();
  const options = $("#levelOptions");
  COPY_BUILD_LEVELS.forEach((item) => {
    const link = document.createElement("a");
    link.className = `copy-level-card${item.level === levelNumber ? " active" : ""}`;
    link.href = `?level=${item.level}`;
    link.innerHTML = `<strong>LEVEL ${item.level}</strong><b>${item.title}</b><small>${item.level === 5 ? "자유 제작과 작품 촬영" : item.level === 4 ? "직육면체 방향까지 맞추기" : "끌어서 똑같이 쌓기"}</small>`;
    options.appendChild(link);
  });
  renderProblem();
  redraw();
}

$("#levelPickerButton").addEventListener("click", () => { $("#levelDialog").hidden = false; });
$("#closeLevelDialog").addEventListener("click", () => { $("#levelDialog").hidden = true; });
$("#checkAnswer").addEventListener("click", checkAnswer);
$("#nextStep").addEventListener("click", () => { state.problem++; state.blocks = []; renderProblem(); redraw(); });
$("#resetBuild").addEventListener("click", () => { state.blocks = []; redraw(); });
$("#captureBuild").addEventListener("click", async () => {
  try { await captureBuildCanvas(build.renderer.domElement, { filename: `gfield-build-${Date.now()}.png` }); toast("작품 사진을 만들었어요!"); }
  catch (error) { if (error?.name !== "AbortError") toast("사진을 만들지 못했어요."); }
});
$("#viewFront").addEventListener("click", () => camera("front"));
$("#viewTop").addEventListener("click", () => camera("top"));
$("#viewFree").addEventListener("click", () => camera("free"));
$("#resetView").addEventListener("click", () => camera("free"));

function resize(viewer) {
  const width = viewer.host.clientWidth || 1, height = viewer.host.clientHeight || 1;
  viewer.renderer.setSize(width, height, false);
  viewer.camera.aspect = width / height;
  viewer.camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  [target, build].forEach((viewer) => { resize(viewer); viewer.controls.update(); viewer.renderer.render(viewer.scene, viewer.camera); });
}

setup();
animate();
