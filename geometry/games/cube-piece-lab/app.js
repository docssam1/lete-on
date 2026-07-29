import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { levels, validateLevels } from "./levels.js?v=piece-1";
import { text } from "./i18n.js?v=piece-1";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";
import { syncEvolution, celebrateEvolution, updateLevelBadge } from "../../shared/evolution.js?v=evolve4-20260720a";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const elements = {
  scene: $("#scene"),
  stars: $("#stars"),
  progress: $("#progress"),
  numberPrompt: $("#numberPrompt"),
  pieceChooser: $("#pieceChooser"),
  hiddenDisplay: $("#hiddenDisplay"),
  hiddenValue: $("#hiddenValue"),
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
  conceptTutorial: $("#conceptTutorial"),
  conceptMessage: $("#conceptMessage"),
  conceptSteps: $("#conceptSteps"),
  conceptNext: $("#conceptNext"),
  xrayButtons: $$(".xray-button, .xray-mobile")
};

const gameProgress = readGameProgress("cubePieceLab");
const savedLevel = Number.isInteger(Number(gameProgress.levelIndex))
  ? Number(gameProgress.levelIndex)
  : Number(localStorage.getItem("cube-piece-lab-level")) || 0;
const state = {
  lang: localStorage.getItem("gfield-language") || "ko",
  levelIndex: Math.max(0, Math.min(levels.length - 1, savedLevel)),
  problemIndex: Math.max(0, Number(gameProgress.problemIndex) || 0),
  selected: -1,
  xray: false,
  hintsUsed: 0,
  wrongAttempts: 0,
  audioEnabled: localStorage.getItem("gfield-audio-muted") !== "true",
  solved: false,
  advanceTimer: null,
  tutorialStep: -1
};

const tutorialStorageKey = "gfield-cube-piece-lab-tutorial-v1";
const tutorialKeys = ["tutorialPiece1", "tutorialPiece2", "tutorialPiece3"];
const thumbCache = new Map();

const currentProblem = () => levels[state.levelIndex].problems[state.problemIndex];

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
  updateAudioButton();
  updateProgress();
  updateXrayButtons();
  renderLevelList();
  renderPieceChooser();
  updatePrompt();
  if (state.tutorialStep >= 0) renderConceptTutorial();
}

function updateAudioButton() {
  const label = text(state.lang, state.audioEnabled ? "audioOn" : "audioOff");
  elements.audio.textContent = state.audioEnabled ? "♪" : "∕";
  elements.audio.setAttribute("aria-label", label);
  elements.audio.setAttribute("title", label);
  elements.audio.setAttribute("aria-pressed", String(state.audioEnabled));
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

function updateXrayButtons() {
  const label = text(state.lang, state.xray ? "revealHide" : "revealShow");
  elements.xrayButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(state.xray));
    const span = button.querySelector("span");
    if (span) span.textContent = label; else button.textContent = label;
  });
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
  elements.numberPrompt.textContent = text(state.lang, "choosePiece");
}

function shouldShowConceptTutorial() {
  const forced = new URLSearchParams(window.location.search).get("tutorial") === "1";
  return state.levelIndex === 0
    && state.problemIndex === 0
    && (forced || localStorage.getItem(tutorialStorageKey) !== "done");
}

function renderConceptTutorial() {
  if (state.tutorialStep < 0) return;
  elements.conceptMessage.textContent = text(state.lang, tutorialKeys[state.tutorialStep]);
  elements.conceptNext.textContent = text(
    state.lang,
    state.tutorialStep === tutorialKeys.length - 1 ? "tutorialStart" : "tutorialNext"
  );
  elements.conceptSteps.replaceChildren();
  tutorialKeys.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.toggle("active", index === state.tutorialStep);
    dot.classList.toggle("done", index < state.tutorialStep);
    elements.conceptSteps.append(dot);
  });
}

function openConceptTutorial() {
  state.tutorialStep = 0;
  elements.conceptTutorial.hidden = false;
  document.body.classList.add("count-tutorial-active");
  renderConceptTutorial();
  window.setTimeout(() => speak(text(state.lang, tutorialKeys[0])), 220);
}

function advanceConceptTutorial() {
  if (state.tutorialStep < tutorialKeys.length - 1) {
    state.tutorialStep += 1;
    renderConceptTutorial();
    speak(text(state.lang, tutorialKeys[state.tutorialStep]));
    return;
  }
  state.tutorialStep = -1;
  localStorage.setItem(tutorialStorageKey, "done");
  elements.conceptTutorial.hidden = true;
  document.body.classList.remove("count-tutorial-active");
  speechSynthesis?.cancel();
}

function loadProblem() {
  state.problemIndex = Math.max(0, Math.min(levels[state.levelIndex].problems.length - 1, state.problemIndex));
  saveGameProgress("cubePieceLab", {
    levelIndex: state.levelIndex,
    problemIndex: state.problemIndex,
    level: state.levelIndex + 1
  });
  clearTimeout(state.advanceTimer);
  elements.success.classList.remove("show");
  state.selected = -1;
  state.xray = false;
  state.hintsUsed = 0;
  state.wrongAttempts = 0;
  state.solved = false;
  updateProgress();
  updateXrayButtons();
  renderPieceChooser();
  updatePrompt();
  renderModel();
  renderStatus();
  setGuide("guideStart", false);
  setCameraView("free");
  if (shouldShowConceptTutorial()) openConceptTutorial();
}

function renderStatus() {
  elements.hiddenValue.textContent = state.solved ? "✓" : "?";
  elements.hiddenDisplay.classList.toggle("solved", state.solved);
  elements.hiddenDisplay.classList.remove("wrong");
}

// ---------------------------------------------------------------------------
// Piece chooser — three loose-piece cards. Each thumbnail is a real 3D wood
// render (from the offscreen renderer below) so it matches the stage's look.
// ---------------------------------------------------------------------------
function renderPieceChooser() {
  elements.pieceChooser.replaceChildren();
  const problem = currentProblem();
  problem.options.forEach((cells, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "piece-option";
    const img = document.createElement("img");
    img.className = "piece-thumb";
    img.alt = "";
    img.draggable = false;
    img.src = pieceThumb(cells);
    const num = document.createElement("span");
    num.className = "piece-num";
    num.textContent = format("pieceOption", { n: index + 1 });
    button.append(img, num);
    button.disabled = state.solved;
    if (state.solved && index === problem.answer.correct) button.classList.add("correct", "chosen");
    button.addEventListener("click", () => selectPiece(index));
    elements.pieceChooser.append(button);
  });
}

function selectPiece(index) {
  if (state.solved) return;
  const problem = currentProblem();
  const cards = [...elements.pieceChooser.children];
  state.selected = index;
  if (index === problem.answer.correct) {
    cards[index].classList.add("chosen");
    completeProblem();
    return;
  }
  state.wrongAttempts += 1;
  const card = cards[index];
  card.classList.remove("wrong");
  void card.offsetWidth;
  card.classList.add("wrong");
  elements.hiddenDisplay.classList.add("wrong");
  playWrongSound();
  showToast(text(state.lang, "pieceWrong"));
  setGuide("pieceWrong", false);
  // A miss is a good moment to reveal the socket so the child can compare shapes.
  if (!state.xray) { state.xray = true; updateXrayButtons(); renderModel(); }
}

function completeProblem() {
  state.solved = true;
  awardPoints(`cube-piece-lab:${currentProblem().id}`, 15);
  celebrateEvolution(syncEvolution(), state.lang);
  updateLevelBadge(state.lang, { left: "25%" });
  state.xray = false;
  updateXrayButtons();
  renderModel();          // socket fills with the found piece (amber highlight)
  renderStatus();
  renderPieceChooser();
  const phrases = state.hintsUsed === 0 && state.wrongAttempts === 0
    ? ["success", "successGood", "successPop"]
    : ["success", "successGood"];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  elements.success.querySelector("strong").textContent = text(state.lang, phrase).toUpperCase();
  elements.success.classList.remove("show");
  void elements.success.offsetWidth;
  elements.success.classList.add("show");
  playSuccessBurstSound();
  setGuide("guideSuccess", false);
  // Longer dwell: the success burst plays (~1.2s), then the child keeps seeing
  // the found piece slotted into the target before the next problem loads.
  state.advanceTimer = setTimeout(() => {
    elements.success.classList.remove("show");
    nextProblem();
  }, 2900);
}

function playWrongSound() {
  if (!state.audioEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(320, now);
  oscillator.frequency.exponentialRampToValueAtTime(196, now + 0.22);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.32);
  window.setTimeout(() => context.close(), 420);
}

function playSuccessBurstSound() {
  if (!state.audioEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.22, now + 0.018);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
  master.connect(context.destination);
  [196, 294, 392, 587].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.55, now + 0.22);
    gain.gain.setValueAtTime(index === 0 ? 0.34 : 0.18, now + index * 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38 + index * 0.025);
    oscillator.connect(gain).connect(master);
    oscillator.start(now + index * 0.018);
    oscillator.stop(now + 0.5);
  });
  window.setTimeout(() => context.close(), 650);
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
  if (!state.xray) { state.xray = true; updateXrayButtons(); renderModel(); }
  showToast(text(state.lang, "guideHint"));
  setGuide("guideHint");
}

function toggleXray() {
  if (state.solved) return;
  state.xray = !state.xray;
  updateXrayButtons();
  renderModel();
  setGuide(state.xray ? "guideReveal" : "guideStart");
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
      localStorage.setItem("cube-piece-lab-level", String(index));
      elements.levelDialog.hidden = true;
      loadProblem();
    });
    elements.levelList.append(button);
  });
}

// ---------------------------------------------------------------------------
// Three.js stage — same wood/board/lighting setup as the counting games so the
// whole suite shares copy-build's graphics standard.
// ---------------------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7e8cf);
scene.fog = new THREE.Fog(0xf7e8cf, 13, 24);
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

scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d5cd, 2.2));
const sunlight = new THREE.DirectionalLight(0xffffff, 2.4);
sunlight.position.set(5, 8.5, 4);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(1024, 1024);
sunlight.shadow.camera.left = -7;
sunlight.shadow.camera.right = 7;
sunlight.shadow.camera.top = 7;
sunlight.shadow.camera.bottom = -7;
scene.add(sunlight);

const modelGroup = new THREE.Group();
scene.add(modelGroup);

function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  const base = context.createLinearGradient(0, 0, 512, 512);
  base.addColorStop(0, "#fff7e7");
  base.addColorStop(0.46, "#f0d4a5");
  base.addColorStop(1, "#d9b57e");
  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let line = 0; line < 76; line += 1) {
    const y = 18 + line * 6.5 + Math.sin(line * 1.7) * 6;
    context.beginPath();
    context.moveTo(-20, y);
    for (let x = -20; x <= 540; x += 18) {
      context.lineTo(x, y + Math.sin(x * 0.036 + line) * 3.6 + Math.sin(x * 0.012 + line * 0.4) * 2.4);
    }
    context.strokeStyle = line % 3 === 0 ? "rgba(115,78,39,.095)" : "rgba(255,255,245,.24)";
    context.lineWidth = line % 3 === 0 ? 1.15 : 0.9;
    context.stroke();
  }
  for (let knot = 0; knot < 34; knot += 1) {
    context.beginPath();
    context.ellipse(44 + (knot * 83) % 432, 38 + (knot * 117) % 420, 20, 6, knot, 0, Math.PI * 2);
    context.strokeStyle = "rgba(105,70,35,.07)";
    context.lineWidth = 1;
    context.stroke();
  }
  const glow = context.createRadialGradient(160, 120, 20, 160, 120, 420);
  glow.addColorStop(0, "rgba(255,255,255,.18)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.1, 1.1);
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

const cubeWoodTexture = createWoodTexture();
const boardWoodTexture = createWoodTexture();
boardWoodTexture.repeat.set(2.5, 2.5);
const insetWoodTexture = createWoodTexture();
insetWoodTexture.repeat.set(2, 2);
const cubeGeometry = new RoundedBoxGeometry(0.96, 0.96, 0.96, 5, 0.075);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff5df,
  map: cubeWoodTexture,
  roughness: 0.56,
  metalness: 0.012,
  bumpMap: cubeWoodTexture,
  bumpScale: 0.012
});
// The empty socket: a barely-there recess plus a crisp wireframe so the hole's
// shape is always legible.
const socketHoleMaterial = new THREE.MeshStandardMaterial({
  color: 0x8a6a42, transparent: true, opacity: 0.08, roughness: 0.8, metalness: 0.0,
  depthWrite: false, side: THREE.DoubleSide
});
// Amber glow filling the socket while "빈 자리 보기" (Show Slot) is on.
const socketGhostMaterial = new THREE.MeshStandardMaterial({
  color: 0xffcf8f, emissive: 0xf2a63c, emissiveIntensity: 0.4,
  transparent: true, opacity: 0.4, roughness: 0.5, metalness: 0.02, depthWrite: false
});
// The found piece slotted in on a correct answer — warm amber, lightly glowing.
const socketFillMaterial = new THREE.MeshStandardMaterial({
  color: 0xffc46b, emissive: 0xef9b3e, emissiveIntensity: 0.5, roughness: 0.45, metalness: 0.02
});
const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry, 28);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x8b6840, transparent: true, opacity: 0.18 });
const socketEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x9a7a4e, transparent: true, opacity: 0.6 });
const socketEdgeGlow = new THREE.LineBasicMaterial({ color: 0xef9b3e, transparent: true, opacity: 0.9 });

const sharedMaterials = new Set([
  cubeMaterial, socketHoleMaterial, socketGhostMaterial, socketFillMaterial,
  edgeMaterial, socketEdgeMaterial, socketEdgeGlow
]);
let hiddenMeshes = [];

function clearModel() {
  modelGroup.traverse((object) => {
    if (object.userData.generatedTexture) object.material.map?.dispose();
    if (object.material && !sharedMaterials.has(object.material)) object.material.dispose?.();
    if (object.geometry && object.geometry !== cubeGeometry && object.geometry !== edgeGeometry) object.geometry.dispose?.();
  });
  modelGroup.clear();
  hiddenMeshes = [];
}

function makeBoardLabelPlane(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 112;
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(64, 38, 17, 0.95)";
  context.font = "950 58px 'Noto Sans KR', sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "rgba(255, 247, 224, 0.82)";
  context.shadowBlur = 3;
  context.fillText(label, canvas.width / 2, canvas.height / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.42), material);
  mesh.renderOrder = 902;
  mesh.userData.generatedTexture = true;
  return mesh;
}

function renderModel() {
  clearModel();
  const problem = currentProblem();
  const [width, depth, height] = problem.box;
  const centerX = (width - 1) / 2;
  const centerZ = (depth - 1) / 2;
  const gridSize = Math.max(width, depth);
  const traySize = gridSize + 1.96;
  const railSpan = gridSize + 1.32;
  const railOffset = gridSize / 2 + 0.62;

  const board = new THREE.Mesh(
    new RoundedBoxGeometry(traySize, 0.24, traySize, 8, 0.18),
    new THREE.MeshStandardMaterial({ map: boardWoodTexture, color: 0xe7c28e, roughness: 0.58, metalness: 0.01, bumpMap: boardWoodTexture, bumpScale: 0.01 })
  );
  board.position.y = -0.15;
  board.receiveShadow = true;
  board.castShadow = true;
  modelGroup.add(board);

  const railMaterial = new THREE.MeshStandardMaterial({ map: boardWoodTexture, color: 0xd0a36b, roughness: 0.58, metalness: 0.01, bumpMap: boardWoodTexture, bumpScale: 0.009 });
  [
    { x: 0, z: railOffset, sx: railSpan, sz: 0.18 },
    { x: 0, z: -railOffset, sx: railSpan, sz: 0.18 },
    { x: railOffset, z: 0, sx: 0.18, sz: railSpan },
    { x: -railOffset, z: 0, sx: 0.18, sz: railSpan }
  ].forEach((rail) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(rail.sx, 0.12, rail.sz, 5, 0.06), railMaterial);
    mesh.position.set(rail.x, 0.005, rail.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    modelGroup.add(mesh);
  });

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(gridSize + 0.28, gridSize + 0.28),
    new THREE.MeshStandardMaterial({ map: insetWoodTexture, color: 0xdbe2d7, roughness: 0.9, bumpMap: insetWoodTexture, bumpScale: 0.0025 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.014;
  floor.receiveShadow = true;
  modelGroup.add(floor);

  const grid = new THREE.GridHelper(gridSize, gridSize, 0x8e6841, 0xc79b67);
  grid.position.y = 0.025;
  grid.material.transparent = true;
  grid.material.opacity = 0.88;
  modelGroup.add(grid);

  // The base cubes that are already assembled.
  problem.base.forEach(([x, y, z]) => {
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x - centerX, y + 0.5, z - centerZ);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
    modelGroup.add(cube);
  });

  // The gap: an empty socket normally, a glowing socket while revealing, and the
  // found piece once solved.
  problem.gap.forEach(([x, y, z]) => {
    const px = x - centerX;
    const py = y + 0.5;
    const pz = z - centerZ;
    if (state.solved) {
      const cube = new THREE.Mesh(cubeGeometry, socketFillMaterial);
      cube.position.set(px, py, pz);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
      cube.userData.glow = true;
      hiddenMeshes.push(cube);
      modelGroup.add(cube);
      return;
    }
    const hole = new THREE.Mesh(cubeGeometry, state.xray ? socketGhostMaterial : socketHoleMaterial);
    hole.position.set(px, py, pz);
    hole.renderOrder = 2;
    if (state.xray) { hole.userData.glow = true; hiddenMeshes.push(hole); }
    modelGroup.add(hole);
    const wire = new THREE.LineSegments(edgeGeometry, state.xray ? socketEdgeGlow : socketEdgeMaterial);
    wire.position.set(px, py, pz);
    wire.renderOrder = 903;
    modelGroup.add(wire);
  });

  const labelOffset = gridSize / 2 + 0.46;
  const frontLabel = makeBoardLabelPlane(text(state.lang, "front"));
  frontLabel.position.set(0, -0.01, labelOffset);
  modelGroup.add(frontLabel);
  const rightLabel = makeBoardLabelPlane(state.lang === "ko" ? "오른쪽" : state.lang === "zh" ? "右边" : state.lang === "ja" ? "右" : "Right");
  rightLabel.position.set(labelOffset, -0.01, 0);
  rightLabel.rotation.set(0, Math.PI / 2, 0);
  modelGroup.add(rightLabel);

  controls.target.set(0, Math.min(1.9, height * 0.42 + 0.4), 0);
  controls.update();
}

function setCameraView(view) {
  const max = currentProblem().box[2];
  if (view === "front") camera.position.set(0.2, Math.max(3.2, max + 1.5), 8.6);
  if (view === "right") camera.position.set(8.6, Math.max(3.2, max + 1.5), 0.2);
  if (view === "top") camera.position.set(0.01, 10.5, 0.01);
  if (view === "free") camera.position.set(7.2, Math.max(5.5, max + 2.2), 8.2);
  camera.lookAt(controls.target);
  controls.update();
}

// ---------------------------------------------------------------------------
// Offscreen renderer that turns a piece's cell list into a 3D wood thumbnail.
// One small context, rendered once per unique piece and cached as a data URL.
// ---------------------------------------------------------------------------
const thumbRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
thumbRenderer.setPixelRatio(1);
thumbRenderer.setSize(256, 256, false);
thumbRenderer.outputColorSpace = THREE.SRGBColorSpace;
const thumbScene = new THREE.Scene();
thumbScene.add(new THREE.HemisphereLight(0xffffff, 0xc9d5cd, 2.4));
const thumbSun = new THREE.DirectionalLight(0xffffff, 2.2);
thumbSun.position.set(4, 7, 5);
thumbScene.add(thumbSun);
const thumbCamera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
const thumbGroup = new THREE.Group();
thumbScene.add(thumbGroup);

function pieceThumb(cells) {
  const cacheKey = JSON.stringify(cells);
  if (thumbCache.has(cacheKey)) return thumbCache.get(cacheKey);
  while (thumbGroup.children.length) thumbGroup.remove(thumbGroup.children[0]);
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  cells.forEach(([x, y, z]) => {
    minX = Math.min(minX, x); minY = Math.min(minY, y); minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); maxZ = Math.max(maxZ, z);
  });
  const midX = (minX + maxX) / 2, midY = (minY + maxY) / 2, midZ = (minZ + maxZ) / 2;
  cells.forEach(([x, y, z]) => {
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x - midX, y - midY, z - midZ);
    cube.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
    thumbGroup.add(cube);
  });
  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ) + 1;
  const dist = span * 1.85 + 2.4;
  thumbCamera.position.set(dist * 0.82, dist * 0.66, dist * 0.9);
  thumbCamera.lookAt(0, 0, 0);
  thumbRenderer.render(thumbScene, thumbCamera);
  const url = thumbRenderer.domElement.toDataURL("image/png");
  thumbCache.set(cacheKey, url);
  return url;
}

function resizeScene() {
  const width = elements.scene.clientWidth;
  const height = elements.scene.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

new ResizeObserver(resizeScene).observe(elements.scene);
function animate() {
  const time = performance.now() * 0.001;
  sunlight.position.x = 5 + Math.sin(time * 0.32) * 0.42;
  sunlight.position.z = 4 + Math.cos(time * 0.28) * 0.34;
  if (hiddenMeshes.length) {
    const pulse = 0.45 + Math.sin(time * 3.4) * 0.22;
    hiddenMeshes.forEach((mesh) => { mesh.material.emissiveIntensity = pulse; });
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

elements.conceptNext.addEventListener("click", advanceConceptTutorial);
elements.hint.addEventListener("click", giveHint);
elements.reset.addEventListener("click", resetProblem);
elements.next.addEventListener("click", nextProblem);
elements.audio.addEventListener("click", () => {
  state.audioEnabled = !state.audioEnabled;
  localStorage.setItem("gfield-audio-muted", String(!state.audioEnabled));
  updateAudioButton();
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
elements.xrayButtons.forEach((button) => button.addEventListener("click", toggleXray));
$$('[data-view]').forEach((button) => button.addEventListener("click", () => setCameraView(button.dataset.view)));
$$('[data-lang]').forEach((button) => button.addEventListener("click", () => {
  state.lang = button.dataset.lang;
  localStorage.setItem("gfield-language", state.lang);
  applyLanguage();
  renderModel();
}));
window.addEventListener("keydown", (event) => {
  if (!elements.levelDialog.hidden) return;
  if (/^[1-9]$/.test(event.key)) {
    const index = Number(event.key) - 1;
    if (index < currentProblem().options.length) selectPiece(index);
  }
});

applyLanguage();
renderLevelList();
loadProblem();
resizeScene();
syncEvolution();                            // normalize/migrate on load (silent)
updateLevelBadge(state.lang, { left: "25%" }); // persistent top level badge
