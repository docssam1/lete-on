import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { COPY_BUILD_LEVELS, BLOCK_TYPES, getCopyBuildLevel } from "./copy-build-levels.js";
import { captureBuildCanvas } from "./capture-build.js";

const params = new URLSearchParams(location.search);
const levelNumber = Math.min(5, Math.max(1, Number(params.get("level")) || 1));
const level = getCopyBuildLevel(levelNumber);
const isCreative = level.mode === "creative";
const currentVariant = level.variants?.[0] ?? level;
const board = currentVariant.board ?? level.board;

const targetHost = document.querySelector("#targetCanvas");
const buildHost = document.querySelector("#buildCanvas");
const targetView = document.querySelector(".target-view");
const buildView = document.querySelector(".build-view");
const levelOptions = document.querySelector("#levelOptions");
const levelDialog = document.querySelector("#levelDialog");
const toast = document.querySelector("#toast");
const successBurst = document.querySelector("#successBurst");
const modeTitle = document.querySelector("#modeTitle");
const instruction = document.querySelector("#instruction");
const countValue = document.querySelector("#countValue");
const checkButton = document.querySelector("#checkAnswer");
const nextButton = document.querySelector("#nextStep");
const resetButton = document.querySelector("#resetBuild");
const captureButton = document.querySelector("#captureBuild");
const levelButton = document.querySelector("#levelPickerButton");
const closeLevelButton = document.querySelector("#closeLevelDialog");
const frontButton = document.querySelector("#viewFront");
const topButton = document.querySelector("#viewTop");
const freeButton = document.querySelector("#viewFree");
const resetViewButton = document.querySelector("#resetView");
const cubePile = document.querySelector("#cubePile");
const handStatus = document.querySelector("#handStatus");

const palette = [0xe6bd78, 0x65b878, 0x4d9fd0, 0xf0c94d, 0xdf6d71];
const state = { selectedType: BLOCK_TYPES.CUBE, rotation: 0, colorIndex: 0, blocks: [], problemIndex: 0 };

const PROBLEMS = {
  1: [
    [{ type: "cube", x: 0, z: 0, y: 0 }, { type: "cube", x: 1, z: 0, y: 0 }, { type: "cube", x: 0, z: 1, y: 0 }],
    [{ type: "cube", x: 0, z: 0, y: 0 }, { type: "cube", x: 0, z: 1, y: 0 }, { type: "cube", x: 1, z: 1, y: 0 }, { type: "cube", x: 1, z: 1, y: 1 }]
  ],
  2: [
    [{ type: "cube", x: 0, z: 0, y: 0 }, { type: "cube", x: 0, z: 0, y: 1 }, { type: "cube", x: 1, z: 0, y: 0 }, { type: "cube", x: 1, z: 1, y: 0 }, { type: "cube", x: 1, z: 1, y: 1 }],
    [{ type: "cube", x: 0, z: 1, y: 0 }, { type: "cube", x: 1, z: 1, y: 0 }, { type: "cube", x: 1, z: 1, y: 1 }, { type: "cube", x: 1, z: 1, y: 2 }, { type: "cube", x: 2, z: 1, y: 0 }]
  ],
  3: [
    [{ type: "cube", x: 0, z: 0, y: 0, color: 1 }, { type: "cube", x: 1, z: 0, y: 0, color: 2 }, { type: "cube", x: 1, z: 0, y: 1, color: 3 }, { type: "cube", x: 1, z: 1, y: 0, color: 4 }],
    [{ type: "cube", x: 0, z: 0, y: 0 }, { type: "cube", x: 1, z: 0, y: 0 }, { type: "cube", x: 2, z: 0, y: 0 }, { type: "cube", x: 1, z: 0, y: 1 }, { type: "cube", x: 1, z: 0, y: 2 }, { type: "cube", x: 1, z: 1, y: 0 }]
  ],
  4: [
    [{ type: "rectangular-prism", x: 0, z: 0, y: 0, rotation: 0 }, { type: "rectangular-prism", x: 0, z: 1, y: 0, rotation: 1 }, { type: "rectangular-prism", x: 1, z: 1, y: 0, rotation: 0 }],
    [{ type: "rectangular-prism", x: 0, z: 0, y: 0, rotation: 1 }, { type: "rectangular-prism", x: 1, z: 0, y: 0, rotation: 1 }, { type: "rectangular-prism", x: 0, z: 1, y: 0, rotation: 0 }, { type: "rectangular-prism", x: 0, z: 1, y: 1, rotation: 0 }]
  ]
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function makeViewer(host, interactive) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(5.8, 5.3, 6.4);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 4.5;
  controls.maxDistance = 13;
  controls.target.set(0, 1.2, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8aa93, 2.4));
  const key = new THREE.DirectionalLight(0xfff7e8, 3.1);
  key.position.set(5, 9, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcfe4ff, 1.1);
  fill.position.set(-5, 4, -4);
  scene.add(fill);

  const boardMesh = new THREE.Mesh(
    new THREE.BoxGeometry(board.columns + 0.45, 0.18, board.rows + 0.45),
    new THREE.MeshStandardMaterial({ color: 0xd7b47a, roughness: 0.58, metalness: 0.02 })
  );
  boardMesh.position.y = -0.12;
  boardMesh.receiveShadow = true;
  scene.add(boardMesh);

  const grid = new THREE.GridHelper(Math.max(board.columns, board.rows), Math.max(board.columns, board.rows), 0x8e6d44, 0xc8aa7b);
  grid.position.y = 0.01;
  scene.add(grid);

  const group = new THREE.Group();
  scene.add(group);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(board.columns, board.rows), new THREE.MeshBasicMaterial({ visible: false }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.03;
  scene.add(floor);

  const viewer = { scene, camera, renderer, controls, group, floor, host, interactive };
  if (interactive) renderer.domElement.addEventListener("click", (event) => placeFromPointer(viewer, event));
  return viewer;
}

const target = makeViewer(targetHost, false);
const build = makeViewer(buildHost, true);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function blockSize(type, rotation = 0) {
  if (type === BLOCK_TYPES.RECTANGULAR_PRISM) return rotation % 2 ? [1, 1, 2] : [2, 1, 1];
  return [1, 1, 1];
}

function makeMaterial(colorIndex = 0) {
  return new THREE.MeshPhysicalMaterial({
    color: palette[colorIndex] ?? palette[0], roughness: 0.34, metalness: 0.02,
    clearcoat: 0.22, clearcoatRoughness: 0.42
  });
}

function makeBlock(data) {
  const [w, h, d] = blockSize(data.type, data.rotation || 0);
  const geometry = new THREE.BoxGeometry(w * 0.94, h * 0.94, d * 0.94, 3, 3, 3);
  geometry.translate(0, h / 2, 0);
  const mesh = new THREE.Mesh(geometry, makeMaterial(data.color || 0));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(data.x - (board.columns - 1) / 2, data.y, data.z - (board.rows - 1) / 2);
  mesh.userData = { ...data };
  return mesh;
}

function clearGroup(group) {
  [...group.children].forEach((child) => {
    child.geometry?.dispose();
    child.material?.dispose();
    group.remove(child);
  });
}

function renderProblem() {
  if (isCreative) return;
  clearGroup(target.group);
  const problems = PROBLEMS[levelNumber] || PROBLEMS[1];
  const problem = problems[state.problemIndex % problems.length];
  problem.forEach((item) => target.group.add(makeBlock(item)));
  countValue.textContent = `${state.problemIndex + 1}/${problems.length}`;
}

function redrawBuild() {
  clearGroup(build.group);
  state.blocks.forEach((item) => build.group.add(makeBlock(item)));
  countValue.textContent = isCreative ? String(state.blocks.length) : countValue.textContent;
}

function occupiedCells(item) {
  const cells = [];
  const [w, , d] = blockSize(item.type, item.rotation || 0);
  for (let dx = 0; dx < w; dx++) for (let dz = 0; dz < d; dz++) cells.push(`${item.x + dx},${item.y},${item.z + dz}`);
  return cells;
}

function canPlace(item) {
  const [w, , d] = blockSize(item.type, item.rotation || 0);
  if (item.x < 0 || item.z < 0 || item.x + w > board.columns || item.z + d > board.rows || item.y >= board.maxHeight) return false;
  const used = new Set(state.blocks.flatMap(occupiedCells));
  if (occupiedCells(item).some((cell) => used.has(cell))) return false;
  if (item.y === 0) return true;
  const below = occupiedCells({ ...item, y: item.y - 1 });
  return below.every((cell) => used.has(cell));
}

function nextHeight(x, z, type, rotation) {
  for (let y = 0; y < board.maxHeight; y++) {
    const candidate = { type, rotation, x, z, y };
    if (canPlace(candidate)) return y;
  }
  return -1;
}

function placeFromPointer(viewer, event) {
  const rect = viewer.renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, viewer.camera);
  const hit = raycaster.intersectObject(viewer.floor)[0];
  if (!hit) return;
  const x = Math.floor(hit.point.x + board.columns / 2);
  const z = Math.floor(hit.point.z + board.rows / 2);
  const y = nextHeight(x, z, state.selectedType, state.rotation);
  if (y < 0) return showToast("그 자리에는 놓을 수 없어요.");
  state.blocks.push({ type: state.selectedType, rotation: state.rotation, color: state.colorIndex, x, y, z });
  redrawBuild();
}

function normalize(items) {
  return items.map((item) => `${item.type}:${item.x}:${item.y}:${item.z}:${item.rotation || 0}:${levelNumber === 3 ? item.color || 0 : 0}`).sort();
}

function checkAnswer() {
  const problems = PROBLEMS[levelNumber] || [];
  const answer = problems[state.problemIndex % problems.length] || [];
  const a = normalize(answer);
  const b = normalize(state.blocks);
  const correct = a.length === b.length && a.every((value, index) => value === b[index]);
  if (!correct) return showToast("위치, 높이, 방향을 다시 살펴보세요.");
  const words = ["GOOD JOB!", "GREAT JOB!", "SUCCESS!"];
  successBurst.querySelector("strong").textContent = words[Math.floor(Math.random() * words.length)];
  successBurst.classList.remove("show");
  requestAnimationFrame(() => successBurst.classList.add("show"));
  showToast("똑같이 만들었어요!");
}

function selectType(type) {
  state.selectedType = type;
  document.querySelectorAll("[data-block-type]").forEach((button) => button.classList.toggle("active", button.dataset.blockType === type));
  handStatus.textContent = type === BLOCK_TYPES.CUBE ? "정육면체 선택" : "직육면체 선택";
}

function createBlockTray() {
  const tray = document.createElement("div");
  tray.className = "block-type-tray";
  const allowed = level.allowedBlocks ?? currentVariant.allowedBlocks ?? [BLOCK_TYPES.CUBE];
  for (const type of allowed) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.blockType = type;
    button.textContent = type === BLOCK_TYPES.CUBE ? "정육면체" : "직육면체";
    button.addEventListener("click", () => selectType(type));
    tray.appendChild(button);
  }
  if (allowed.includes(BLOCK_TYPES.RECTANGULAR_PRISM)) {
    const rotate = document.createElement("button");
    rotate.type = "button";
    rotate.textContent = "방향 돌리기";
    rotate.addEventListener("click", () => { state.rotation = (state.rotation + 1) % 2; showToast(state.rotation ? "세로 방향" : "가로 방향"); });
    tray.appendChild(rotate);
  }
  if (levelNumber === 3 || isCreative) {
    const color = document.createElement("button");
    color.type = "button";
    color.textContent = "색 바꾸기";
    color.addEventListener("click", () => { state.colorIndex = (state.colorIndex + 1) % palette.length; color.style.setProperty("--swatch", `#${palette[state.colorIndex].toString(16).padStart(6, "0")}`); });
    tray.appendChild(color);
  }
  cubePile.replaceWith(tray);
  selectType(allowed[0]);
}

function renderLevelPicker() {
  levelOptions.replaceChildren();
  COPY_BUILD_LEVELS.forEach((item) => {
    const link = document.createElement("a");
    link.className = "copy-level-card" + (item.level === levelNumber ? " active" : "");
    link.href = `?level=${item.level}`;
    link.innerHTML = `<strong>LEVEL ${item.level}</strong><b>${item.title}</b><small>${item.level === 5 ? "자유 제작과 작품 촬영" : item.level === 4 ? "직육면체의 방향까지 맞추기" : "같은 난이도의 문제를 랜덤으로 연습"}</small>`;
    levelOptions.appendChild(link);
  });
}

function setCamera(mode) {
  const viewers = isCreative ? [build] : [target, build];
  viewers.forEach((viewer) => {
    if (mode === "front") viewer.camera.position.set(0, 2.4, 7.5);
    else if (mode === "top") viewer.camera.position.set(0.01, 8.5, 0.01);
    else viewer.camera.position.set(5.8, 5.3, 6.4);
    viewer.controls.target.set(0, 1.2, 0);
    viewer.controls.update();
  });
}

function setupPage() {
  document.body.dataset.copyBuildLevel = String(levelNumber);
  modeTitle.textContent = level.title;
  instruction.textContent = isCreative ? "정육면체와 직육면체로 여러 모양을 만들고 사진으로 남겨 보세요." : "왼쪽 모양을 보고 블록의 위치와 방향까지 똑같이 만들어 보세요.";
  document.querySelector("#stars").textContent = "★".repeat(levelNumber) + "☆".repeat(Math.max(0, 5 - levelNumber));
  if (isCreative) {
    targetView.hidden = true;
    buildView.classList.add("creative-view");
    checkButton.hidden = true;
    nextButton.hidden = true;
    captureButton.hidden = false;
  }
  createBlockTray();
  renderLevelPicker();
  renderProblem();
  redrawBuild();
}

levelButton.addEventListener("click", () => { levelDialog.hidden = false; });
closeLevelButton.addEventListener("click", () => { levelDialog.hidden = true; });
checkButton.addEventListener("click", checkAnswer);
nextButton.addEventListener("click", () => { state.problemIndex++; state.blocks = []; renderProblem(); redrawBuild(); });
resetButton.addEventListener("click", () => { state.blocks = []; redrawBuild(); });
captureButton.addEventListener("click", async () => {
  try { await captureBuildCanvas(build.renderer.domElement, { filename: `gfield-build-${Date.now()}.png` }); showToast("작품 사진을 만들었어요!"); }
  catch (error) { if (error?.name !== "AbortError") showToast("사진을 만들지 못했어요."); }
});
frontButton.addEventListener("click", () => setCamera("front"));
topButton.addEventListener("click", () => setCamera("top"));
freeButton.addEventListener("click", () => setCamera("free"));
resetViewButton.addEventListener("click", () => setCamera("free"));

function resize(viewer) {
  const width = viewer.host.clientWidth || 1;
  const height = viewer.host.clientHeight || 1;
  viewer.renderer.setSize(width, height, false);
  viewer.camera.aspect = width / height;
  viewer.camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  [target, build].forEach((viewer) => { resize(viewer); viewer.controls.update(); viewer.renderer.render(viewer.scene, viewer.camera); });
}

setupPage();
animate();
