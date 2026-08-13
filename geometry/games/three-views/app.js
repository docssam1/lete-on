import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { levels, validateLevels } from "./levels.js?v=views-1";
import { text } from "./i18n.js?v=views-1";
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
  frontView: $("#frontView"),
  sideView: $("#sideView"),
  topView: $("#topView"),
  viewsTabs: $("#viewsTabs"),
  viewsStage: $(".views-stage"),
  viewsRow: $(".views-row"),
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

const VIEW_NAMES = ["front", "side", "top"];
const viewEl = (name) => ({ front: elements.frontView, side: elements.sideView, top: elements.topView }[name]);

const params = new URLSearchParams(window.location.search);
const gameProgress = readGameProgress("threeViews");
const savedLevel = Number.isInteger(Number(gameProgress.levelIndex))
  ? Number(gameProgress.levelIndex)
  : Number(localStorage.getItem("three-views-level")) || 0;
const state = {
  lang: localStorage.getItem("gfield-language") || "ko",
  levelIndex: Math.max(0, Math.min(levels.length - 1, savedLevel)),
  problemIndex: Math.max(0, Number(gameProgress.problemIndex) || 0),
  painted: { front: [], side: [], top: [] },
  activeView: "front",
  solved: false,
  hintsUsed: 0,
  wrongAttempts: 0,
  audioEnabled: localStorage.getItem("gfield-audio-muted") !== "true",
  advanceTimer: null,
  tutorialStep: -1
};

const tutorialStorageKey = "gfield-three-views-tutorial-v1";
const tutorialKeys = ["tutorialView1", "tutorialView2", "tutorialView3"];

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
  renderAllViews();
  applyViewTabLabels();
  updatePrompt();
  if (state.tutorialStep >= 0) renderConceptTutorial();
}

// The tabs reuse the same front/side/top strings as the .view-label spans
// (and the camera-tools buttons) instead of adding new i18n entries.
function applyViewTabLabels() {
  if (!elements.viewsTabs) return;
  [...elements.viewsTabs.querySelectorAll("button")].forEach((button) => {
    button.textContent = text(state.lang, button.dataset.view);
  });
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
  elements.numberPrompt.textContent = text(state.lang, "paintPrompt");
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

const blankLike = (view) => view.map((row) => row.map(() => 0));

function loadProblem() {
  state.problemIndex = Math.max(0, Math.min(levels[state.levelIndex].problems.length - 1, state.problemIndex));
  saveGameProgress("threeViews", {
    levelIndex: state.levelIndex,
    problemIndex: state.problemIndex,
    level: state.levelIndex + 1
  });
  clearTimeout(state.advanceTimer);
  elements.success.classList.remove("show");
  const problem = currentProblem();
  state.painted = {
    front: blankLike(problem.views.front),
    side: blankLike(problem.views.side),
    top: blankLike(problem.views.top)
  };
  state.solved = false;
  state.hintsUsed = 0;
  state.wrongAttempts = 0;
  // Every new problem starts back on the "front" tab with a clean slate —
  // otherwise a solved-and-done tab mark would carry over to the next shape.
  setActiveView("front");
  updateProgress();
  renderAllViews();
  updatePrompt();
  renderModel();
  setCameraView("free");
  setGuide("guideStart", false);
  if (shouldShowConceptTutorial()) openConceptTutorial();
}

// ---------------------------------------------------------------------------
// Three paint grids (front / side / top)
// ---------------------------------------------------------------------------
function renderAllViews() {
  VIEW_NAMES.forEach((name) => renderViewGrid(name));
  updateTabDoneMarks();
  requestAnimationFrame(fitViewCells);
}

// Switches which single grid is shown in compact-landscape tab mode (a
// no-op visually on desktop, where .views-tabs is display:none).
function setActiveView(name) {
  state.activeView = name;
  if (elements.viewsStage) elements.viewsStage.dataset.activeView = name;
  if (elements.viewsTabs) {
    [...elements.viewsTabs.querySelectorAll("button")].forEach((button) => {
      button.classList.toggle("active", button.dataset.view === name);
    });
  }
  requestAnimationFrame(fitViewCells);
}

// A tab gets a checkmark once its grid has at least one painted cell, so
// kids can see at a glance which of the three views they still need to do.
function updateTabDoneMarks() {
  if (!elements.viewsTabs) return;
  VIEW_NAMES.forEach((name) => {
    const hasPaint = state.painted[name]?.some((row) => row.some((value) => value));
    const button = elements.viewsTabs.querySelector(`button[data-view="${name}"]`);
    if (button) button.classList.toggle("done", !!hasPaint);
  });
}

// Sizes the view grids' cells to fill the available space. In compact-
// landscape tab mode only one grid is visible at a time and it can claim the
// whole row; on desktop all three grids share the row, so we solve for a
// single common cell size that lets all three sit side by side.
function fitViewCells() {
  const tabsEl = elements.viewsTabs;
  const stage = elements.viewsStage;
  if (!tabsEl || !stage) return;
  if (getComputedStyle(tabsEl).display === "none") {
    fitViewCellsDesktop();
  } else {
    fitViewCellsCompact();
  }
}

// Compact-landscape tab mode: only the active view's grid is on screen, so
// it can be sized against its own block the way fitTopBoard() sizes the
// count-heights board.
function fitViewCellsCompact() {
  const stage = elements.viewsStage;
  const block = stage.querySelector(`.view-block[data-view="${state.activeView}"]`);
  const grid = block?.querySelector(".view-grid");
  if (!block || !grid || !block.clientWidth || !block.clientHeight) return;
  const cols = Number(getComputedStyle(grid).getPropertyValue("--cols")) || grid.children.length || 1;
  const rows = Math.max(1, Math.round(grid.children.length / cols));
  const label = block.querySelector(".view-label");
  const blockStyle = getComputedStyle(block);
  const labelSpace = (label ? label.getBoundingClientRect().height : 0) + (parseFloat(blockStyle.gap) || 0);
  const gridStyle = getComputedStyle(grid);
  const padX = parseFloat(gridStyle.paddingLeft) + parseFloat(gridStyle.paddingRight);
  const padY = parseFloat(gridStyle.paddingTop) + parseFloat(gridStyle.paddingBottom);
  const gap = parseFloat(gridStyle.gap || gridStyle.columnGap) || 0;
  const availW = block.clientWidth - padX;
  const availH = block.clientHeight - labelSpace - padY;
  if (availW <= 0 || availH <= 0) return;
  const cellW = (availW - (cols - 1) * gap) / cols;
  const cellH = (availH - (rows - 1) * gap) / rows;
  let cell = Math.floor(Math.min(cellW, cellH));
  cell = Math.max(24, Math.min(60, cell));
  elements.viewsStage.style.setProperty("--tv-cell", `${cell}px`);
}

// Desktop (and any width where the tabs are hidden): all three view-blocks
// sit side by side in .views-row, so find the single cell size that lets
// their combined widths (each grid's own cols/gap/padding/border, plus the
// gaps .views-row puts between the three blocks) fit the row's measured box,
// while also fitting the tallest grid's rows within the row's height.
function fitViewCellsDesktop() {
  const row = elements.viewsRow;
  if (!row || !row.clientWidth || !row.clientHeight) return;
  const blocks = [...row.querySelectorAll(".view-block")];
  if (!blocks.length) return;

  const rowStyle = getComputedStyle(row);
  const rowGap = parseFloat(rowStyle.columnGap || rowStyle.gap) || 0;

  const specs = blocks.map((block) => {
    const grid = block.querySelector(".view-grid");
    const label = block.querySelector(".view-label");
    const cols = Number(getComputedStyle(grid).getPropertyValue("--cols")) || grid.children.length || 1;
    const rows = Math.max(1, Math.round(grid.children.length / cols));
    const gridStyle = getComputedStyle(grid);
    const padX = parseFloat(gridStyle.paddingLeft) + parseFloat(gridStyle.paddingRight);
    const padY = parseFloat(gridStyle.paddingTop) + parseFloat(gridStyle.paddingBottom);
    const borderX = parseFloat(gridStyle.borderLeftWidth) + parseFloat(gridStyle.borderRightWidth);
    const borderY = parseFloat(gridStyle.borderTopWidth) + parseFloat(gridStyle.borderBottomWidth);
    const gap = parseFloat(gridStyle.gap || gridStyle.columnGap) || 0;
    const blockStyle = getComputedStyle(block);
    const labelSpace = (label ? label.getBoundingClientRect().height : 0) + (parseFloat(blockStyle.gap) || 0);
    return {
      cols,
      rows,
      fixedWidth: padX + borderX + (cols - 1) * gap,
      fixedHeight: padY + borderY + (rows - 1) * gap + labelSpace
    };
  });

  const totalFixedWidth = specs.reduce((sum, spec) => sum + spec.fixedWidth, 0) + rowGap * (specs.length - 1);
  const totalCols = specs.reduce((sum, spec) => sum + spec.cols, 0);
  const maxFixedHeight = Math.max(...specs.map((spec) => spec.fixedHeight));
  const maxRows = Math.max(...specs.map((spec) => spec.rows));

  const availW = row.clientWidth - totalFixedWidth;
  const availH = row.clientHeight - maxFixedHeight;
  if (availW <= 0 || availH <= 0 || totalCols <= 0 || maxRows <= 0) return;

  const cellW = availW / totalCols;
  const cellH = availH / maxRows;
  let cell = Math.floor(Math.min(cellW, cellH));
  cell = Math.max(24, Math.min(84, cell));
  elements.viewsStage.style.setProperty("--tv-cell", `${cell}px`);
}

function renderViewGrid(name) {
  const el = viewEl(name);
  const view = currentProblem().views[name];
  el.style.setProperty("--cols", String(view[0].length));
  el.replaceChildren();
  view.forEach((row, r) => {
    row.forEach((_, c) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "view-cell";
      cell.dataset.r = String(r);
      cell.dataset.c = String(c);
      if (state.painted[name]?.[r]?.[c]) cell.classList.add("filled");
      cell.disabled = state.solved;
      cell.addEventListener("click", () => toggleCell(name, r, c));
      el.append(cell);
    });
  });
}

function cellAt(name, r, c) {
  return viewEl(name).querySelector(`[data-r="${r}"][data-c="${c}"]`);
}

function toggleCell(name, r, c) {
  if (state.solved) return;
  state.painted[name][r][c] = state.painted[name][r][c] ? 0 : 1;
  const cell = cellAt(name, r, c);
  cell.classList.toggle("filled", !!state.painted[name][r][c]);
  cell.classList.remove("wrong", "right");
  updateTabDoneMarks();
}

function clearAll() {
  if (state.solved) return;
  const problem = currentProblem();
  state.painted = {
    front: blankLike(problem.views.front),
    side: blankLike(problem.views.side),
    top: blankLike(problem.views.top)
  };
  renderAllViews();
}

function checkAnswer() {
  if (state.solved) return;
  const problem = currentProblem();
  let anyPainted = false;
  let allMatch = true;
  VIEW_NAMES.forEach((name) => {
    problem.views[name].forEach((row, r) => {
      row.forEach((want, c) => {
        const have = state.painted[name][r][c];
        if (have) anyPainted = true;
        if (have !== want) allMatch = false;
      });
    });
  });
  if (!anyPainted) {
    showToast(text(state.lang, "viewEmpty"));
    setGuide("viewEmpty", false);
    return;
  }
  if (allMatch) { completeProblem(); return; }
  state.wrongAttempts += 1;
  VIEW_NAMES.forEach((name) => {
    problem.views[name].forEach((row, r) => {
      row.forEach((want, c) => {
        const cell = cellAt(name, r, c);
        cell.classList.remove("wrong", "right");
        if (state.painted[name][r][c] !== want) cell.classList.add("wrong");
      });
    });
  });
  showToast(text(state.lang, "viewWrong"));
  setGuide("viewWrong", false);
}

function completeProblem() {
  state.solved = true;
  awardPoints(`three-views:${currentProblem().id}`, 15);
  celebrateEvolution(syncEvolution(), state.lang);
  updateLevelBadge(state.lang, { left: "25%" });
  // Lock the grids and mark every correct filled cell green.
  const problem = currentProblem();
  VIEW_NAMES.forEach((name) => {
    problem.views[name].forEach((row, r) => {
      row.forEach((want, c) => {
        const cell = cellAt(name, r, c);
        cell.disabled = true;
        cell.classList.remove("wrong");
        if (want) cell.classList.add("right");
      });
    });
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
      localStorage.setItem("three-views-level", String(index));
      elements.levelDialog.hidden = true;
      loadProblem();
    });
    elements.levelList.append(button);
  });
}

// ---------------------------------------------------------------------------
// Three.js stage — same wood/board/lighting as the rest of the suite.
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
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff5df, map: cubeWoodTexture, roughness: 0.56, metalness: 0.012, bumpMap: cubeWoodTexture, bumpScale: 0.012
});
const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry, 28);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x8b6840, transparent: true, opacity: 0.2 });

const sharedMaterials = new Set([cubeMaterial, edgeMaterial]);

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

function renderModel() {
  clearModel();
  const problem = currentProblem();
  const [width, depth] = problem.grid;
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

  // Stacked cubes from the heightmap.
  problem.stacks.forEach(({ x, z, h }) => {
    for (let y = 0; y < h; y += 1) {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(x - centerX, y + 0.5, z - centerZ);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
      modelGroup.add(cube);
    }
  });

  const labelOffset = gridSize / 2 + 0.46;
  const frontLabel = makeBoardLabelPlane(text(state.lang, "front"));
  frontLabel.position.set(0, -0.01, labelOffset);
  modelGroup.add(frontLabel);
  const rightLabel = makeBoardLabelPlane(text(state.lang, "side"));
  rightLabel.position.set(labelOffset, -0.01, 0);
  rightLabel.rotation.set(0, Math.PI / 2, 0);
  modelGroup.add(rightLabel);

  controls.target.set(0, Math.min(2.2, problem.height * 0.42 + 0.4), 0);
  controls.update();
}

function setCameraView(view) {
  const problem = currentProblem();
  const mid = Math.max(2.4, problem.height * 0.6 + 1.4);
  const far = Math.max(width2(problem), 3) + 5.4;
  if (view === "top") {
    // A clean top-down: up = −z so the BACK row sits at the top of the view and
    // the FRONT row at the bottom, matching the 위 grid. (Reset up for others.)
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
function width2(problem) { return Math.max(problem.grid[0], problem.grid[1]); }

function resizeScene() {
  const width = elements.scene.clientWidth;
  const height = elements.scene.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

new ResizeObserver(resizeScene).observe(elements.scene);
// Re-fit the single visible grid whenever the row's box changes (rotation,
// on-screen keyboard, browser chrome). No-op on desktop (tabs hidden there).
if (elements.viewsRow) new ResizeObserver(fitViewCells).observe(elements.viewsRow);
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
if (elements.viewsTabs) {
  [...elements.viewsTabs.querySelectorAll("button")].forEach((button) => {
    button.addEventListener("click", () => setActiveView(button.dataset.view));
  });
}
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