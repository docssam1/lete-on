import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { levels, validateLevels } from "./levels.js";
import { text } from "./i18n.js";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const elements = {
  scene: $("#scene"),
  stars: $("#stars"),
  progress: $("#progress"),
  modelMode: $("#modelMode"),
  topMode: $("#topMode"),
  modelPrompt: $("#modelPrompt"),
  topBoard: $("#topBoard"),
  additionLine: $("#additionLine"),
  totalDisplay: $("#totalDisplay"),
  totalValue: $("#totalValue"),
  numberPrompt: $("#numberPrompt"),
  numberPad: $("#numberPad"),
  hint: $("#hint"),
  reset: $("#reset"),
  next: $("#next"),
  openLevels: $("#openLevels"),
  closeLevels: $("#closeLevels"),
  levelDialog: $("#levelDialog"),
  levelList: $("#levelList"),
  guide: $("#guide"),
  audio: $("#audio"),
  toast: $("#toast"),
  success: $("#success"),
  docssam: $(".docssam"),
  docssamImage: $(".docssam img")
};

const state = {
  lang: localStorage.getItem("gfield-language") || "ko",
  levelIndex: Math.max(0, Math.min(4, Number(localStorage.getItem("count-heights-level")) || 0)),
  problemIndex: 0,
  mode: "model",
  cellAnswers: new Map(),
  totalAnswer: "",
  selectedKey: null,
  inputTarget: "cell",
  wrongKeys: new Set(),
  hintKey: null,
  hintsUsed: 0,
  wrongAttempts: 0,
  audioEnabled: false,
  solved: false,
  advanceTimer: null
};

const currentProblem = () => levels[state.levelIndex].problems[state.problemIndex];
const cellKey = (x, z) => `${x},${z}`;
function occupiedCells() {
  const result = [];
  currentProblem().heights.forEach((row, z) => row.forEach((height, x) => {
    if (height > 0) result.push({ x, z, height, key: cellKey(x, z) });
  }));
  return result;
}

function format(key, values = {}) {
  return Object.entries(values).reduce(
    (value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)),
    text(state.lang, key)
  );
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  $$('[data-i18n]').forEach((node) => { node.textContent = text(state.lang, node.dataset.i18n); });
  $$('[data-lang]').forEach((button) => button.classList.toggle("active", button.dataset.lang === state.lang));
  elements.audio.textContent = text(state.lang, state.audioEnabled ? "audioOn" : "audioOff");
  updateProgress();
  renderLevelList();
  renderNumberPad();
  updatePrompt();
  renderModel();
}

function updateProgress() {
  elements.progress.textContent = format("progress", {
    level: state.levelIndex + 1,
    current: state.problemIndex + 1,
    total: levels[state.levelIndex].problems.length
  });
  const stars = levels[state.levelIndex].stars;
  elements.stars.textContent = `${"★".repeat(stars)}${"☆".repeat(5 - stars)}`;
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 1800);
}

function preferredVoice() {
  const voices = speechSynthesis.getVoices();
  const locale = { ko: "ko", zh: "zh", ja: "ja", en: "en" }[state.lang];
  const maleNames = /injoon|hyunsu|bongjin|yunxi|yunyang|keita|ichiro|david|mark|guy|george|male/i;
  const femaleNames = /sunhi|xiaoxiao|nanami|zira|jenny|aria|susan|samantha|female/i;
  const matching = voices.filter((voice) => voice.lang.toLowerCase().startsWith(locale));
  return matching.find((voice) => maleNames.test(voice.name))
    || matching.find((voice) => !femaleNames.test(voice.name))
    || matching[0]
    || voices.find((voice) => !femaleNames.test(voice.name));
}

function speak(message) {
  if (!state.audioEnabled || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  const voice = preferredVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" }[state.lang];
  utterance.rate = state.lang === "en" ? 0.92 : 0.88;
  utterance.pitch = 0.9;
  speechSynthesis.speak(utterance);
}

function setGuide(key, shouldSpeak = true) {
  const message = text(state.lang, key);
  elements.guide.textContent = message;
  if (shouldSpeak) speak(message);
}

function updatePrompt() {
  elements.numberPrompt.textContent = text(state.lang, state.inputTarget === "total" ? "chooseTotal" : "chooseNumber");
}

function initializeExample() {
  if (state.levelIndex !== 0) return;
  const first = occupiedCells()[0];
  if (first) state.cellAnswers.set(first.key, first.height);
}

function loadProblem() {
  clearTimeout(state.advanceTimer);
  elements.success.classList.remove("show");
  state.cellAnswers = new Map();
  state.totalAnswer = "";
  state.selectedKey = null;
  state.inputTarget = "cell";
  state.wrongKeys = new Set();
  state.hintKey = null;
  state.hintsUsed = 0;
  state.wrongAttempts = 0;
  state.solved = false;
  initializeExample();
  updateProgress();
  renderTopBoard();
  renderAnswers();
  renderNumberPad();
  renderModel();
  setGuide("guideStart", false);
  setCameraView("free");
}

function setMode(mode) {
  state.mode = mode;
  elements.modelMode.classList.toggle("active", mode === "model");
  elements.topMode.classList.toggle("active", mode === "top");
  elements.modelMode.setAttribute("aria-selected", String(mode === "model"));
  elements.topMode.setAttribute("aria-selected", String(mode === "top"));
  elements.modelPrompt.hidden = mode !== "model";
  elements.topBoard.hidden = mode !== "top";
  renderNumberPad();
  if (mode === "top") setGuide("guideTop");
}

function selectCell(x, z, options = {}) {
  if (state.solved || currentProblem().heights[z]?.[x] <= 0) return;
  state.selectedKey = cellKey(x, z);
  state.inputTarget = "cell";
  state.hintKey = options.hint ? state.selectedKey : null;
  elements.totalDisplay.classList.remove("active", "wrong");
  renderTopBoard();
  renderModel();
  renderNumberPad();
  updatePrompt();
  setGuide(state.mode === "top" ? "guideTop" : "guideCell");
}

function selectTotal() {
  if (state.solved) return;
  state.inputTarget = "total";
  state.selectedKey = null;
  elements.totalDisplay.classList.add("active");
  renderTopBoard();
  renderModel();
  renderNumberPad();
  updatePrompt();
}

function renderTopBoard() {
  const [width, depth] = currentProblem().board;
  elements.topBoard.style.setProperty("--cols", width);
  elements.topBoard.replaceChildren();
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = cellKey(x, z);
      const height = currentProblem().heights[z][x];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "top-cell";
      if (height === 0) {
        button.classList.add("empty");
        button.disabled = true;
      } else {
        button.textContent = state.cellAnswers.get(key) ?? "";
        button.classList.toggle("selected", key === state.selectedKey);
        button.classList.toggle("wrong", state.wrongKeys.has(key));
        button.classList.toggle("hint", key === state.hintKey);
        button.classList.toggle("example", state.levelIndex === 0 && key === occupiedCells()[0]?.key);
        button.setAttribute("aria-label", `${x + 1}, ${z + 1}`);
        button.addEventListener("click", () => selectCell(x, z));
      }
      elements.topBoard.append(button);
    }
  }
}

function renderAnswers() {
  const values = occupiedCells().map(({ key }) => state.cellAnswers.get(key));
  elements.additionLine.replaceChildren();
  values.forEach((value, index) => {
    const number = document.createElement("span");
    number.textContent = value ?? "□";
    number.classList.toggle("blank", value == null);
    elements.additionLine.append(number);
    if (index < values.length - 1) {
      const plus = document.createElement("span");
      plus.textContent = "+";
      elements.additionLine.append(plus);
    }
  });
  const equals = document.createElement("span");
  equals.textContent = `= ${state.totalAnswer || "?"}`;
  elements.additionLine.append(equals);
  elements.totalValue.textContent = state.totalAnswer || "?";
}

function renderNumberPad() {
  elements.numberPad.replaceChildren();
  for (let value = 0; value <= 9; value += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(value);
    button.disabled = state.solved
      || (state.inputTarget === "cell" && (value > 4 || (value === 0 && state.mode === "model")));
    button.addEventListener("click", () => enterNumber(value));
    elements.numberPad.append(button);
  }
  const clear = document.createElement("button");
  clear.type = "button";
  clear.className = "clear-key";
  clear.textContent = text(state.lang, "clear");
  clear.disabled = state.solved;
  clear.addEventListener("click", clearInput);
  elements.numberPad.append(clear);
}

function enterNumber(value) {
  if (state.solved) return;
  if (state.inputTarget === "cell") {
    if (!state.selectedKey) {
      showToast(text(state.lang, state.mode === "top" ? "selectCell" : "selectColumn"));
      return;
    }
    if (value > 4 || (value === 0 && state.mode === "model")) return;
    state.cellAnswers.set(state.selectedKey, value);
    state.wrongKeys.delete(state.selectedKey);
    state.hintKey = null;
    const list = occupiedCells();
    const index = list.findIndex(({ key }) => key === state.selectedKey);
    const next = [...list.slice(index + 1), ...list.slice(0, index)].find(({ key }) => !state.cellAnswers.has(key));
    if (next) state.selectedKey = next.key;
  } else {
    const next = `${state.totalAnswer}${value}`.replace(/^0+(?=\d)/, "").slice(0, 2);
    if (Number(next) <= 64) state.totalAnswer = next;
    elements.totalDisplay.classList.remove("wrong");
  }
  renderTopBoard();
  renderAnswers();
  renderNumberPad();
  renderModel();
  checkAnswer();
}

function clearInput() {
  if (state.solved) return;
  if (state.inputTarget === "total") {
    state.totalAnswer = state.totalAnswer.slice(0, -1);
  } else if (state.selectedKey) {
    state.cellAnswers.delete(state.selectedKey);
    state.wrongKeys.delete(state.selectedKey);
  }
  renderTopBoard();
  renderAnswers();
  renderModel();
}

function checkAnswer() {
  if (state.solved) return;
  const occupied = occupiedCells();
  if (!occupied.every(({ key }) => state.cellAnswers.has(key))) return;
  if (state.totalAnswer === "") {
    selectTotal();
    setGuide("totalMissing");
    return;
  }

  const wrong = occupied.filter(({ key, height }) => state.cellAnswers.get(key) !== height);
  if (wrong.length) {
    state.wrongAttempts += 1;
    state.wrongKeys = new Set(wrong.map(({ key }) => key));
    state.hintKey = wrong[0].key;
    renderTopBoard();
    renderModel();
    showToast(text(state.lang, "heightWrong"));
    setGuide("heightWrong");
    return;
  }

  if (Number(state.totalAnswer) !== currentProblem().answer.total) {
    state.wrongAttempts += 1;
    elements.totalDisplay.classList.add("wrong");
    showToast(text(state.lang, "totalWrong"));
    setGuide("totalWrong");
    return;
  }
  completeProblem();
}

function completeProblem() {
  state.solved = true;
  awardPoints(`count-cubes:${currentProblem().id}`, 15);
  const phrase = state.hintsUsed === 0 && state.wrongAttempts === 0 ? "success" : "successGood";
  elements.success.querySelector("strong").textContent = text(state.lang, phrase);
  elements.success.classList.remove("show");
  void elements.success.offsetWidth;
  elements.success.classList.add("show");
  setGuide("guideSuccess");
  renderNumberPad();
  state.advanceTimer = setTimeout(() => {
    elements.success.classList.remove("show");
    nextProblem();
  }, 1250);
}

function awardPoints(rewardId, amount) {
  const rewarded = new Set(JSON.parse(localStorage.getItem("gfield-rewarded-games") || "[]"));
  if (rewarded.has(rewardId)) return;
  rewarded.add(rewardId);
  const points = Number(localStorage.getItem("gfield-points")) || 120;
  localStorage.setItem("gfield-points", String(points + amount));
  localStorage.setItem("gfield-rewarded-games", JSON.stringify([...rewarded]));
}

function giveHint() {
  if (state.solved) return;
  state.hintsUsed += 1;
  const target = occupiedCells().find(({ key, height }) => state.cellAnswers.get(key) !== height) || occupiedCells()[0];
  if (!target) return;
  selectCell(target.x, target.z, { hint: true });
  showToast(text(state.lang, "guideHint"));
  setGuide("guideHint");
}

function nextProblem() {
  clearTimeout(state.advanceTimer);
  state.problemIndex = (state.problemIndex + 1) % levels[state.levelIndex].problems.length;
  loadProblem();
}

function resetProblem() {
  loadProblem();
  showToast(text(state.lang, "reset"));
}

function renderLevelList() {
  elements.levelList.replaceChildren();
  levels.forEach((level, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.toggle("active", index === state.levelIndex);
    const title = document.createElement("strong");
    title.textContent = format("levelName", { level: level.level });
    const stars = document.createElement("span");
    stars.textContent = "★".repeat(level.stars);
    const count = document.createElement("small");
    count.textContent = text(state.lang, "problemCount");
    button.append(title, stars, count);
    button.addEventListener("click", () => {
      state.levelIndex = index;
      state.problemIndex = 0;
      localStorage.setItem("count-heights-level", String(index));
      elements.levelDialog.hidden = true;
      loadProblem();
    });
    elements.levelList.append(button);
  });
}

// Three.js model
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdff3f8);
scene.fog = new THREE.Fog(0xdff3f8, 12, 23);
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(7.2, 6.3, 8.2);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
elements.scene.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 15;
controls.minPolarAngle = 0.12;
controls.maxPolarAngle = Math.PI / 2.06;
controls.target.set(0, 1.25, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0x8eb19f, 2.2));
const sunlight = new THREE.DirectionalLight(0xfff4d6, 3.2);
sunlight.position.set(-5, 9, 6);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(1024, 1024);
sunlight.shadow.camera.left = -7;
sunlight.shadow.camera.right = 7;
sunlight.shadow.camera.top = 7;
sunlight.shadow.camera.bottom = -7;
scene.add(sunlight);

const modelGroup = new THREE.Group();
scene.add(modelGroup);
const cubeGeometry = new THREE.BoxGeometry(0.96, 0.96, 0.96);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xe7b765, roughness: 0.73, metalness: 0.02 });
const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry, 22);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x986429, transparent: true, opacity: 0.62 });
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let clickableObjects = [];
let pointerDown = null;

function clearModel() {
  modelGroup.traverse((object) => {
    if (object.userData.generatedTexture) object.material.map?.dispose();
    if (object.material && object.material !== cubeMaterial && object.material !== edgeMaterial) object.material.dispose?.();
    if (object.geometry && object.geometry !== cubeGeometry && object.geometry !== edgeGeometry) object.geometry.dispose?.();
  });
  modelGroup.clear();
}

function makeTextSprite(label, options = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  context.fillStyle = options.fill || "rgba(255,255,255,.97)";
  context.strokeStyle = options.stroke || "#2e9f83";
  context.lineWidth = options.selected ? 10 : 6;
  context.beginPath();
  context.arc(128, 64, 48, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.fillStyle = options.color || "#24313d";
  context.font = `900 ${options.small ? 34 : 56}px sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(String(label), 128, 65);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(options.small ? 1.7 : 1.15, options.small ? 0.85 : 0.58, 1);
  sprite.renderOrder = 30;
  sprite.userData.generatedTexture = true;
  return sprite;
}

function renderModel() {
  clearModel();
  clickableObjects = [];
  const [width, depth] = currentProblem().board;
  const centerX = (width - 1) / 2;
  const centerZ = (depth - 1) / 2;
  const floorSize = Math.max(width, depth) + 3.2;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize, floorSize),
    new THREE.MeshStandardMaterial({ color: 0xfffced, roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  floor.receiveShadow = true;
  modelGroup.add(floor);

  const grid = new THREE.GridHelper(Math.max(width, depth), Math.max(width, depth), 0xbcae8e, 0xd6cab1);
  grid.position.y = 0.005;
  grid.material.transparent = true;
  grid.material.opacity = 0.65;
  modelGroup.add(grid);

  occupiedCells().forEach((cell) => {
    const wx = cell.x - centerX;
    const wz = cell.z - centerZ;
    for (let y = 0; y < cell.height; y += 1) {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(wx, y + 0.5, wz);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.userData = { kind: "column", x: cell.x, z: cell.z };
      cube.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
      modelGroup.add(cube);
      clickableObjects.push(cube);
    }

    const pick = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.9),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
    );
    pick.rotation.x = -Math.PI / 2;
    pick.position.set(wx, cell.height + 0.035, wz);
    pick.userData = { kind: "column", x: cell.x, z: cell.z };
    modelGroup.add(pick);
    clickableObjects.push(pick);

    const selected = state.selectedKey === cell.key && state.inputTarget === "cell";
    const hinted = state.hintKey === cell.key;
    const wrong = state.wrongKeys.has(cell.key);
    if (selected || hinted || wrong) {
      const marker = new THREE.Mesh(
        new THREE.RingGeometry(0.3, 0.49, 32),
        new THREE.MeshBasicMaterial({
          color: wrong ? 0xd9473f : hinted ? 0xf3bd23 : 0xef765e,
          side: THREE.DoubleSide,
          depthTest: false
        })
      );
      marker.rotation.x = -Math.PI / 2;
      marker.position.set(wx, cell.height + 0.055, wz);
      marker.renderOrder = 20;
      modelGroup.add(marker);
    }

    if (state.cellAnswers.has(cell.key)) {
      const label = makeTextSprite(state.cellAnswers.get(cell.key), {
        selected,
        stroke: wrong ? "#d9473f" : selected ? "#ef765e" : "#2e9f83"
      });
      label.position.set(wx, cell.height + 0.56, wz);
      label.userData = { kind: "column", x: cell.x, z: cell.z };
      modelGroup.add(label);
      clickableObjects.push(label);
    }
  });

  const frontLabel = makeTextSprite(text(state.lang, "front"), {
    small: true,
    fill: "rgba(36,49,61,.94)",
    stroke: "#f6c94d",
    color: "#ffffff"
  });
  frontLabel.position.set(0, 0.55, depth / 2 + 0.95);
  modelGroup.add(frontLabel);
  controls.target.set(0, Math.min(1.75, currentProblem().maxHeight * 0.42 + 0.4), 0);
  controls.update();
}

function setCameraView(view) {
  const max = currentProblem().maxHeight;
  if (view === "front") camera.position.set(0.2, Math.max(3.2, max + 1.5), 8.6);
  if (view === "top") camera.position.set(0.01, 10.5, 0.01);
  if (view === "free") camera.position.set(7.2, Math.max(5.5, max + 2.2), 8.2);
  camera.lookAt(controls.target);
  controls.update();
}

function resizeScene() {
  const width = elements.scene.clientWidth;
  const height = elements.scene.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

renderer.domElement.addEventListener("pointerdown", (event) => {
  pointerDown = { x: event.clientX, y: event.clientY };
});
renderer.domElement.addEventListener("pointerup", (event) => {
  if (!pointerDown) return;
  const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  pointerDown = null;
  if (moved > 8) return;
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(clickableObjects, false)[0];
  if (hit?.object.userData.kind === "column") selectCell(hit.object.userData.x, hit.object.userData.z);
});

new ResizeObserver(resizeScene).observe(elements.scene);
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

function setupDocssamDrag() {
  let drag = null;
  elements.docssamImage.addEventListener("pointerdown", (event) => {
    drag = { x: event.clientX, y: event.clientY };
    elements.docssamImage.setPointerCapture(event.pointerId);
  });
  elements.docssamImage.addEventListener("pointermove", (event) => {
    if (!drag) return;
    elements.docssam.style.transform = `translate(${event.clientX - drag.x}px, ${event.clientY - drag.y}px)`;
  });
  elements.docssamImage.addEventListener("pointerup", () => { drag = null; });
}

elements.modelMode.addEventListener("click", () => setMode("model"));
elements.topMode.addEventListener("click", () => setMode("top"));
elements.totalDisplay.addEventListener("click", selectTotal);
elements.hint.addEventListener("click", giveHint);
elements.reset.addEventListener("click", resetProblem);
elements.next.addEventListener("click", nextProblem);
elements.audio.addEventListener("click", () => {
  state.audioEnabled = !state.audioEnabled;
  elements.audio.textContent = text(state.lang, state.audioEnabled ? "audioOn" : "audioOff");
  if (state.audioEnabled) speak(elements.guide.textContent);
  else speechSynthesis?.cancel();
});
elements.openLevels.addEventListener("click", () => {
  renderLevelList();
  elements.levelDialog.hidden = false;
});
elements.closeLevels.addEventListener("click", () => { elements.levelDialog.hidden = true; });
elements.levelDialog.addEventListener("click", (event) => {
  if (event.target === elements.levelDialog) elements.levelDialog.hidden = true;
});
$$('[data-view]').forEach((button) => button.addEventListener("click", () => setCameraView(button.dataset.view)));
$$('[data-lang]').forEach((button) => button.addEventListener("click", () => {
  state.lang = button.dataset.lang;
  localStorage.setItem("gfield-language", state.lang);
  applyLanguage();
  renderTopBoard();
  renderAnswers();
}));
window.addEventListener("keydown", (event) => {
  if (!elements.levelDialog.hidden) return;
  if (/^[0-9]$/.test(event.key)) enterNumber(Number(event.key));
  if (event.key === "Backspace" || event.key === "Delete") clearInput();
});

setupDocssamDrag();
applyLanguage();
renderLevelList();
loadProblem();
resizeScene();
