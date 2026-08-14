import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { levels, validateLevels, viewsOfHeightGrid, viewsMatch } from "./levels.js?v=crystal-2";
import { text } from "./i18n.js?v=crystal-2";
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
  frontCard: $("#frontCard"),
  sideCard: $("#sideCard"),
  topCard: $("#topCard"),
  buildGrid: $("#buildGrid"),
  checkBtn: $("#checkBtn"),
  clearBtn: $("#clearBtn"),
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

const cardEl = { front: elements.frontCard, side: elements.sideCard, top: elements.topCard };

const params = new URLSearchParams(window.location.search);
const gameProgress = readGameProgress("crystalCubes");
const savedLevel = Number.isInteger(Number(gameProgress.levelIndex))
  ? Number(gameProgress.levelIndex)
  : Number(localStorage.getItem("crystal-cubes-level")) || 0;
const state = {
  lang: localStorage.getItem("gfield-language") || "ko",
  levelIndex: Math.max(0, Math.min(levels.length - 1, savedLevel)),
  problemIndex: Math.max(0, Number(gameProgress.problemIndex) || 0),
  build: [],                 // [z][x] current stack heights
  solved: false,
  hintsUsed: 0,
  wrongAttempts: 0,
  audioEnabled: localStorage.getItem("gfield-audio-muted") !== "true",
  advanceTimer: null,
  tutorialStep: -1
};

const tutorialStorageKey = "gfield-crystal-cubes-tutorial-v1";
const tutorialKeys = ["tutorialCrystal1", "tutorialCrystal2", "tutorialCrystal3"];

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
  renderLevelList();
  renderCards();
  renderBuildGrid();
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
  elements.numberPrompt.textContent = text(state.lang, "buildPrompt");
}

function shouldShowConceptTutorial() {
  const forced = params.get("tutorial") === "1";
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

const blankBuild = (grid) => {
  const [width, depth] = grid;
  return Array.from({ length: depth }, () => Array.from({ length: width }, () => 0));
};

function loadProblem() {
  state.problemIndex = Math.max(0, Math.min(levels[state.levelIndex].problems.length - 1, state.problemIndex));
  saveGameProgress("crystalCubes", {
    levelIndex: state.levelIndex,
    problemIndex: state.problemIndex,
    level: state.levelIndex + 1
  });
  clearTimeout(state.advanceTimer);
  elements.success.classList.remove("show");
  state.build = blankBuild(currentProblem().grid);
  state.solved = false;
  state.hintsUsed = 0;
  state.wrongAttempts = 0;
  updateProgress();
  renderCards();
  renderBuildGrid();
  updatePrompt();
  renderModel();
  setCameraView("free");
  setGuide("guideStart", false);
  if (shouldShowConceptTutorial()) openConceptTutorial();
}

// ---------------------------------------------------------------------------
// Read-only view cards (the goal) + interactive height-build grid
// ---------------------------------------------------------------------------
function renderCards() {
  const target = currentProblem().target;
  ["front", "side", "top"].forEach((name) => {
    const el = cardEl[name];
    const view = target[name];
    el.classList.remove("mismatch", "matched");
    el.style.setProperty("--cols", String(view[0].length));
    el.replaceChildren();
    view.forEach((row) => {
      row.forEach((v) => {
        const cell = document.createElement("span");
        cell.className = "card-cell";
        if (v) cell.classList.add("filled");
        el.append(cell);
      });
    });
  });
}

function renderBuildGrid() {
  const [width, depth] = currentProblem().grid;
  elements.buildGrid.style.setProperty("--cols", String(width));
  elements.buildGrid.replaceChildren();
  // Rows z=0 (back) at top, matching the 위 card and the top-down camera.
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "build-cell";
      cell.dataset.x = String(x);
      cell.dataset.z = String(z);
      const h = state.build[z]?.[x] ?? 0;
      cell.dataset.h = String(h);
      cell.textContent = String(h);
      cell.disabled = state.solved;
      cell.addEventListener("click", () => bumpHeight(x, z));
      elements.buildGrid.append(cell);
    }
  }
}

function buildCellAt(x, z) {
  return elements.buildGrid.querySelector(`[data-x="${x}"][data-z="${z}"]`);
}

function bumpHeight(x, z) {
  if (state.solved) return;
  const maxH = currentProblem().maxH;
  state.build[z][x] = (state.build[z][x] + 1) % (maxH + 1);
  const cell = buildCellAt(x, z);
  const h = state.build[z][x];
  cell.dataset.h = String(h);
  cell.textContent = String(h);
  cell.classList.remove("right");
  ["front", "side", "top"].forEach((name) => cardEl[name].classList.remove("mismatch", "matched"));
  renderModel();
}

function clearAll() {
  if (state.solved) return;
  state.build = blankBuild(currentProblem().grid);
  renderBuildGrid();
  ["front", "side", "top"].forEach((name) => cardEl[name].classList.remove("mismatch", "matched"));
  renderModel();
}

function checkAnswer() {
  if (state.solved) return;
  const problem = currentProblem();
  const anyCube = state.build.some((row) => row.some((h) => h > 0));
  if (!anyCube) {
    showToast(text(state.lang, "crystalEmpty"));
    setGuide("crystalEmpty", false);
    return;
  }
  const mine = viewsOfHeightGrid(state.build, problem.grid, problem.maxH);
  if (viewsMatch(mine, problem.target)) { completeProblem(); return; }
  // Show which of the three cards is not yet satisfied.
  state.wrongAttempts += 1;
  ["front", "side", "top"].forEach((name) => {
    const ok = JSON.stringify(mine[name]) === JSON.stringify(problem.target[name]);
    cardEl[name].classList.toggle("matched", ok);
    cardEl[name].classList.toggle("mismatch", !ok);
  });
  showToast(text(state.lang, "crystalWrong"));
  setGuide("crystalWrong", false);
}

function completeProblem() {
  state.solved = true;
  awardPoints(`crystal-cubes:${currentProblem().id}`, 15);
  celebrateEvolution(syncEvolution(), state.lang);
  updateLevelBadge(state.lang, { left: "25%" });
  ["front", "side", "top"].forEach((name) => { cardEl[name].classList.remove("mismatch"); cardEl[name].classList.add("matched"); });
  $$(".build-cell").forEach((cell) => {
    cell.disabled = true;
    if (Number(cell.dataset.h) > 0) cell.classList.add("right");
  });
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
  state.advanceTimer = setTimeout(() => {
    elements.success.classList.remove("show");
    nextProblem();
  }, 2900);
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
  setCameraView("front");
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
      localStorage.setItem("crystal-cubes-level", String(index));
      elements.levelDialog.hidden = true;
      loadProblem();
    });
    elements.levelList.append(button);
  });
}

// ---------------------------------------------------------------------------
// Three.js stage — clear case + the child's live wood build.
// ---------------------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7e8cf);
scene.fog = new THREE.Fog(0xf7e8cf, 14, 26);
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(7.2, 6.6, 8.4);
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
controls.maxDistance = 17;
controls.minPolarAngle = 0.05;
controls.maxPolarAngle = Math.PI / 2.04;
controls.target.set(0, 1.25, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d5cd, 2.2));
const sunlight = new THREE.DirectionalLight(0xffffff, 2.4);
sunlight.position.set(5, 8.5, 4);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(1024, 1024);
sunlight.shadow.camera.left = -8;
sunlight.shadow.camera.right = 8;
sunlight.shadow.camera.top = 8;
sunlight.shadow.camera.bottom = -8;
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
// Placed cubes are translucent (not fully opaque wood) so the view cards now
// stuck to the case walls/floor stay readable through a built stack.
// opacity 0.62 read muddy once four cubes overlapped in a deep (maxH=4)
// stack, so we use 0.7 — still see-through but each cube still reads apart.
// depthWrite:false keeps the alpha blending between overlapping cubes correct;
// renderOrder (set per-mesh in renderModel) makes sure cubes composite AFTER
// the case shell and the card planes so those stay visible underneath.
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff5df, map: cubeWoodTexture, roughness: 0.56, metalness: 0.012, bumpMap: cubeWoodTexture, bumpScale: 0.012,
  transparent: true, opacity: 0.7, depthWrite: false
});
const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry, 28);
// Edge lines stay fully opaque (no alpha) so a cube's boundary stays crisp
// for counting even though its faces are now translucent.
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x6b4a24 });
// The crystal case: a faint blue translucent box with crisp edges.
const caseMaterial = new THREE.MeshStandardMaterial({
  color: 0xbfe4ff, transparent: true, opacity: 0.12, roughness: 0.15, metalness: 0.0,
  depthWrite: false, side: THREE.DoubleSide
});
const caseEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x6fa8d6, transparent: true, opacity: 0.6 });

const sharedMaterials = new Set([cubeMaterial, edgeMaterial, caseMaterial, caseEdgeMaterial]);

function clearModel() {
  modelGroup.traverse((object) => {
    if (object.userData.generatedTexture) object.material.map?.dispose();
    if (object.material && !sharedMaterials.has(object.material)) object.material.dispose?.();
    if (object.geometry && object.geometry !== cubeGeometry && object.geometry !== edgeGeometry) object.geometry.dispose?.();
  });
  modelGroup.clear();
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

// ---------------------------------------------------------------------------
// View cards rendered onto the case walls/floor themselves (in addition to the
// 2D reference cards in the side panel). `view` is a 2D 0/1 grid (a row of the
// problem's target.front/side/top); `cornerLabel` uses the active locale and
// is baked into the corner so the card still identifies itself no
// matter how the camera is orbited.
function makeCardCanvas(view, cornerLabel) {
  const rows = view.length;
  const cols = view[0].length;
  const cellPx = 160; // well above the 128px/cell floor so text/edges stay crisp
  const canvas = document.createElement("canvas");
  canvas.width = cols * cellPx;
  canvas.height = rows * cellPx;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f7fbff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const strokeWidth = Math.max(4, cellPx * 0.045);
  ctx.lineWidth = strokeWidth;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = c * cellPx;
      const y = r * cellPx;
      if (view[r][c]) {
        ctx.fillStyle = "#5b78a8";
        ctx.fillRect(x, y, cellPx, cellPx);
      }
      ctx.strokeStyle = "#33507f";
      ctx.strokeRect(x + strokeWidth / 2, y + strokeWidth / 2, cellPx - strokeWidth, cellPx - strokeWidth);
    }
  }
  const labelSize = Math.round(cellPx * 0.46);
  ctx.fillStyle = "rgba(51, 80, 127, 0.9)";
  ctx.font = `900 ${labelSize}px 'Noto Sans KR', sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(cornerLabel, labelSize * 0.22, labelSize * 0.14);
  return canvas;
}

function makeCardPlane(view, cornerLabel, planeWidth, planeHeight) {
  const texture = new THREE.CanvasTexture(makeCardCanvas(view, cornerLabel));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const material = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: 0.95, side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth, planeHeight), material);
  // Card planes draw after the case shell but before the (translucent) cubes,
  // so a built cube's alpha blends over an already-visible card, not under it.
  mesh.renderOrder = 4;
  mesh.userData.generatedTexture = true;
  return mesh;
}

function renderModel() {
  clearModel();
  const problem = currentProblem();
  const [width, depth] = problem.grid;
  const maxH = problem.maxH;
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

  // The crystal case enclosing the full build volume.
  const caseGeometry = new THREE.BoxGeometry(width + 0.06, maxH + 0.06, depth + 0.06);
  const crystalCase = new THREE.Mesh(caseGeometry, caseMaterial);
  crystalCase.position.set(0, maxH / 2, 0);
  crystalCase.renderOrder = 3;
  modelGroup.add(crystalCase);
  const caseEdges = new THREE.LineSegments(new THREE.EdgesGeometry(caseGeometry), caseEdgeMaterial);
  caseEdges.position.set(0, maxH / 2, 0);
  modelGroup.add(caseEdges);

  // The three view cards, stuck onto the actual faces of the case so the
  // child reads the goal directly off the model (the 2D cards in the side
  // panel remain as the plain reference). Determined empirically from the
  // default camera (7.2, 6.6, 8.4) looking at target (0, ~1.25, 0): the
  // camera sits on the +x/+z side, so the walls it looks AT (the far walls,
  // not the ones between the camera and the cubes) are -z (back) and -x
  // (left) — see setCameraView("front"/"side") which also puts those
  // cameras on the +z/+x side respectively.
  const caseHalfX = (width + 0.06) / 2;
  const caseHalfZ = (depth + 0.06) / 2;
  const wallNudge = 0.005; // nudge off the exact wall/floor plane to avoid z-fighting

  // 앞 (front view) → far -z wall (the back wall as seen by the default camera),
  // reading as the backdrop behind the stack. No rotation needed: a
  // PlaneGeometry's default normal already faces +z, i.e. toward the interior.
  const frontCard = makeCardPlane(problem.target.front, text(state.lang, "front"), width, maxH);
  frontCard.position.set(0, maxH / 2, -caseHalfZ + wallNudge);
  modelGroup.add(frontCard);

  // 옆 (side view) → far -x wall (the left wall). Rotating +90° about Y turns
  // the plane's default +z normal into +x, facing the interior/camera.
  const sideCard = makeCardPlane(problem.target.side, text(state.lang, "side"), depth, maxH);
  sideCard.rotation.y = Math.PI / 2;
  sideCard.position.set(-caseHalfX + wallNudge, maxH / 2, 0);
  modelGroup.add(sideCard);

  // 위 (top view) → the case floor, face up. Rotating -90° about X (same
  // rotation as the wood `floor` mesh above) turns the default +z normal
  // into +y. It sits just above the opaque floor/grid meshes (y=0.014/0.025)
  // — placing it at the spec's literal y≈0.005 would hide it completely
  // beneath those existing opaque meshes, so it goes just above them instead,
  // still functionally "on the floor" and still beneath the build cubes.
  const topCard = makeCardPlane(problem.target.top, text(state.lang, "top"), width, depth);
  topCard.rotation.x = -Math.PI / 2;
  topCard.position.set(0, 0.03, 0);
  modelGroup.add(topCard);

  // The child's current build.
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      const h = state.build[z][x];
      for (let y = 0; y < h; y += 1) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x - centerX, y + 0.5, z - centerZ);
        cube.castShadow = true;
        cube.receiveShadow = true;
        // Cubes draw after the case shell and the card planes (renderOrder 3
        // and 4) so their translucent faces blend on top of an already
        // fully-drawn card, keeping the card readable through the cube.
        cube.renderOrder = 5;
        cube.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
        modelGroup.add(cube);
      }
    }
  }

  const labelOffset = gridSize / 2 + 0.46;
  const frontLabel = makeBoardLabelPlane(text(state.lang, "front"));
  frontLabel.position.set(0, -0.01, labelOffset);
  modelGroup.add(frontLabel);
  const rightLabel = makeBoardLabelPlane(text(state.lang, "side"));
  rightLabel.position.set(labelOffset, -0.01, 0);
  rightLabel.rotation.set(0, Math.PI / 2, 0);
  modelGroup.add(rightLabel);

  controls.target.set(0, Math.min(2.2, maxH * 0.42 + 0.4), 0);
  controls.update();
}

function widthOf(problem) { return Math.max(problem.grid[0], problem.grid[1]); }

function setCameraView(view) {
  const problem = currentProblem();
  const mid = Math.max(2.4, problem.maxH * 0.6 + 1.4);
  const far = Math.max(widthOf(problem), 3) + 5.4;
  if (view === "top") {
    camera.up.set(0, 0, -1);
    camera.position.set(0, far + 4.5, 0.0001);
  } else {
    camera.up.set(0, 1, 0);
    if (view === "front") camera.position.set(0.2, mid, far);
    if (view === "side") camera.position.set(far, mid, 0.2);
    if (view === "free") camera.position.set(far * 0.82, mid + 1.6, far * 0.9);
  }
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

new ResizeObserver(resizeScene).observe(elements.scene);
function animate() {
  const time = performance.now() * 0.001;
  sunlight.position.x = 5 + Math.sin(time * 0.32) * 0.42;
  sunlight.position.z = 4 + Math.cos(time * 0.28) * 0.34;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

elements.conceptNext.addEventListener("click", advanceConceptTutorial);
elements.hint.addEventListener("click", giveHint);
elements.reset.addEventListener("click", resetProblem);
elements.next.addEventListener("click", nextProblem);
elements.checkBtn.addEventListener("click", checkAnswer);
elements.clearBtn.addEventListener("click", clearAll);
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
// The 옆 buttons snap the camera to the right-side view.
elements.xrayButtons.forEach((button) => button.addEventListener("click", () => setCameraView("side")));
$$('[data-view]').forEach((button) => button.addEventListener("click", () => setCameraView(button.dataset.view)));
$$('[data-lang]').forEach((button) => button.addEventListener("click", () => {
  state.lang = button.dataset.lang;
  localStorage.setItem("gfield-language", state.lang);
  applyLanguage();
  renderModel();
}));

applyLanguage();
renderLevelList();
loadProblem();
resizeScene();
syncEvolution();                            // normalize/migrate on load (silent)
updateLevelBadge(state.lang, { left: "25%" }); // persistent top level badge
