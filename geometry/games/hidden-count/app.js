import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { levels, hiddenCubes, validateLevels } from "./levels.js?v=hidden-5";
import { text } from "./i18n.js?v=hidden-4";
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
  numberPad: $("#numberPad"),
  workArea: $("#workArea"),
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

const countProgress = readGameProgress("hiddenCount");
const savedLevel = Number.isInteger(Number(countProgress.levelIndex))
  ? Number(countProgress.levelIndex)
  : Number(localStorage.getItem("hidden-count-level")) || 0;
// Remembered across sessions so a child who prefers one solving strategy
// doesn't have to re-pick it every time they open the game.
const modeStorageKey = "gfield-hidden-count-mode";

const modes = ["subtract", "layers", "direct"];
const savedMode = localStorage.getItem(modeStorageKey);

const state = {
  lang: localStorage.getItem("gfield-language") || "ko",
  levelIndex: Math.max(0, Math.min(levels.length - 1, savedLevel)),
  problemIndex: Math.max(0, Number(countProgress.problemIndex) || 0),
  mode: modes.includes(savedMode) ? savedMode : "subtract",
  answer: "",
  activeField: "answer",
  work: null,
  workDone: null,
  wrongFlashField: null,
  xray: false,
  hintsUsed: 0,
  wrongAttempts: 0,
  audioEnabled: localStorage.getItem("gfield-audio-muted") !== "true",
  solved: false,
  advanceTimer: null,
  tutorialStep: -1
};

const tutorialStorageKey = "gfield-hidden-count-tutorial-v1";
const tutorialKeys = ["tutorialHidden1", "tutorialHidden2", "tutorialHidden3", "tutorialHidden4", "tutorialHidden5"];

const currentProblem = () => levels[state.levelIndex].problems[state.problemIndex];

// ---------------------------------------------------------------------------
// Solving-mode scratch work. "subtract" and "layers" each keep an independent
// set of row values/done-flags for the current problem, so switching modes
// mid-problem never loses progress; "direct" has no rows at all.
// ---------------------------------------------------------------------------
function layerTotals(heights) {
  const maxHeight = Math.max(...heights.flat());
  return Array.from({ length: maxHeight }, (_, y) =>
    heights.reduce((sum, row) => sum + row.filter((h) => h > y).length, 0)
  );
}

function layerHidden(heights) {
  const maxHeight = Math.max(...heights.flat());
  const counts = new Array(maxHeight).fill(0);
  hiddenCubes(heights, levels[state.levelIndex].wall === true).forEach((cube) => { counts[cube.y] += 1; });
  return counts;
}

function initWorkState() {
  const maxHeight = currentProblem().maxHeight;
  state.work = {
    subtract: { layers: new Array(maxHeight).fill(""), total: "", visible: "" },
    layers: { layers: new Array(maxHeight).fill("") }
  };
  state.workDone = {
    subtract: { layers: new Array(maxHeight).fill(false), total: false, visible: false },
    layers: { layers: new Array(maxHeight).fill(false) }
  };
  state.wrongFlashField = null;
}

// Field addressing: "answer" is the single final-answer box shared by every
// mode; work fields are { kind: "layer"|"total"|"visible", index? } and are
// scoped to state.mode, since subtract/layers keep independent scratch values.
function fieldKey(field) {
  return field === "answer" ? "answer" : `${field.kind}:${field.index ?? ""}`;
}

function sameField(a, b) {
  return fieldKey(a) === fieldKey(b);
}

function workFieldOrder() {
  const maxHeight = currentProblem().maxHeight;
  const layerFields = Array.from({ length: maxHeight }, (_, index) => ({ kind: "layer", index }));
  if (state.mode === "subtract") return [...layerFields, { kind: "total" }, { kind: "visible" }];
  if (state.mode === "layers") return layerFields;
  return [];
}

function getFieldValue(field) {
  if (field === "answer") return state.answer;
  const store = state.work[state.mode];
  return field.kind === "layer" ? (store.layers[field.index] ?? "") : (store[field.kind] ?? "");
}

function setFieldValue(field, value) {
  if (field === "answer") { state.answer = value; return; }
  const store = state.work[state.mode];
  if (field.kind === "layer") store.layers[field.index] = value; else store[field.kind] = value;
}

function isFieldDone(field) {
  if (field === "answer") return false;
  const store = state.workDone[state.mode];
  return field.kind === "layer" ? !!store.layers[field.index] : !!store[field.kind];
}

function setFieldDone(field, done) {
  const store = state.workDone[state.mode];
  if (field.kind === "layer") store.layers[field.index] = done; else store[field.kind] = done;
}

function correctValueForField(field) {
  const problem = currentProblem();
  if (field === "answer") return problem.answer.hidden;
  if (field.kind === "layer") {
    return state.mode === "layers" ? layerHidden(problem.heights)[field.index] : layerTotals(problem.heights)[field.index];
  }
  if (field.kind === "total") return problem.answer.total;
  return problem.answer.total - problem.answer.hidden; // visible
}

function firstUnfilledField() {
  const next = workFieldOrder().find((field) => !isFieldDone(field));
  return next || "answer";
}

initWorkState();
state.activeField = firstUnfilledField();

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
  renderNumberPad();
  updatePrompt();
  renderModeTabs();
  renderWorkArea();
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
  const label = text(state.lang, state.xray ? "xrayHide" : "xrayShow");
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
  elements.numberPrompt.textContent = text(state.lang, "chooseHidden");
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
  saveGameProgress("hiddenCount", {
    levelIndex: state.levelIndex,
    problemIndex: state.problemIndex,
    level: state.levelIndex + 1
  });
  clearTimeout(state.advanceTimer);
  elements.success.classList.remove("show");
  state.answer = "";
  state.xray = false;
  state.hintsUsed = 0;
  state.wrongAttempts = 0;
  state.solved = false;
  initWorkState();
  state.activeField = firstUnfilledField();
  updateProgress();
  updateXrayButtons();
  renderNumberPad();
  updatePrompt();
  renderModeTabs();
  renderModel();
  renderHiddenValue();
  renderWorkArea();
  setGuide(levels[state.levelIndex].wall ? "guideWall" : "guideStart", false);
  setCameraView("free");
  if (shouldShowConceptTutorial()) openConceptTutorial();
}

function renderHiddenValue() {
  elements.hiddenValue.textContent = state.answer === "" ? "?" : state.answer;
  elements.hiddenDisplay.classList.toggle("active", state.activeField === "answer" && !state.solved);
}

function renderModeTabs() {
  $$(".mode-switch button").forEach((button) => button.classList.toggle("active", button.dataset.mode === state.mode));
}

function createWorkRow(field, labelText) {
  const row = document.createElement("div");
  row.className = "work-row";
  const label = document.createElement("span");
  label.className = "work-row-label";
  label.textContent = labelText;
  const value = getFieldValue(field);
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "work-cell";
  cell.textContent = value === "" ? "?" : value;
  cell.disabled = state.solved;
  cell.classList.toggle("done", isFieldDone(field));
  cell.classList.toggle("active", sameField(state.activeField, field));
  cell.classList.toggle("wrong", state.wrongFlashField === fieldKey(field));
  cell.addEventListener("click", () => activateField(field));
  row.append(label, cell);
  return row;
}

// Draws the current mode's scratch-work rows. Row counts and correct values
// are always derived from the current problem's heights, never hardcoded.
function renderWorkArea() {
  if (!elements.workArea) return;
  elements.workArea.replaceChildren();
  if (state.mode === "direct") return;
  const problem = currentProblem();
  if (state.mode === "subtract") {
    layerTotals(problem.heights).forEach((_, index) => {
      elements.workArea.append(createWorkRow({ kind: "layer", index }, format("layerLabel", { n: index + 1 })));
    });
    elements.workArea.append(createWorkRow({ kind: "total" }, text(state.lang, "totalQuestion")));
    elements.workArea.append(createWorkRow({ kind: "visible" }, text(state.lang, "visibleQuestion")));
    const hint = document.createElement("p");
    hint.className = "work-hint";
    hint.textContent = text(state.lang, "equationHint");
    elements.workArea.append(hint);
  } else if (state.mode === "layers") {
    // Rows with a correct value of 0 are still rendered — the child needs to
    // discover that some layers hide nothing, not have that fact skipped.
    layerHidden(problem.heights).forEach((_, index) => {
      elements.workArea.append(createWorkRow({ kind: "layer", index }, format("layerHiddenLabel", { n: index + 1 })));
    });
  }
}

// A field is validated when the child taps away to a different field, when
// digit entry fills it to 2 digits, or immediately if it already matches.
function commitField(field) {
  const correct = correctValueForField(field);
  if (Number(getFieldValue(field)) === correct) {
    setFieldDone(field, true);
    state.wrongFlashField = null;
    state.activeField = firstUnfilledField();
    renderWorkArea();
    renderHiddenValue();
    return true;
  }
  state.wrongAttempts += 1;
  state.wrongFlashField = fieldKey(field);
  setFieldValue(field, "");    // back to "?" so the child just types again
  showToast(text(state.lang, "wrongWork"));
  setGuide("wrongWork", false);
  renderWorkArea();
  return false;
}

function maybeCommitField(field) {
  const value = getFieldValue(field);
  if (value === "") return;
  if (Number(value) === correctValueForField(field) || value.length >= 2) commitField(field);
}

function activateField(field) {
  if (state.solved) return;
  // A cell that's already correct is locked, so focusing it would leave the
  // number pad typing into nothing — send the child to the next open cell.
  if (field !== "answer" && isFieldDone(field)) field = firstUnfilledField();
  const previous = state.activeField;
  const needsCommit = previous !== "answer" && !sameField(previous, field) && !isFieldDone(previous) && getFieldValue(previous) !== "";
  if (needsCommit) {
    // A wrong commit keeps the previous field active (with its shake) so the
    // child fixes it before moving on; a correct commit already advances
    // state.activeField itself, so there's nothing left to do here either way.
    commitField(previous);
    return;
  }
  state.activeField = field;
  state.wrongFlashField = null;
  renderWorkArea();
  renderHiddenValue();
}

function setMode(mode) {
  if (state.mode === mode) return;
  state.mode = mode;
  localStorage.setItem(modeStorageKey, mode);
  state.wrongFlashField = null;
  state.activeField = firstUnfilledField();
  renderModeTabs();
  renderWorkArea();
  renderHiddenValue();
  const guideKey = { subtract: "guideModeSubtract", layers: "guideModeLayers", direct: "guideModeDirect" }[mode];
  setGuide(guideKey);
}

function renderNumberPad() {
  elements.numberPad.replaceChildren();
  for (let value = 0; value <= 9; value += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(value);
    button.disabled = state.solved;
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

// Every value in this game fits in two digits (the largest possible total is
// 64). Once a field holds two digits the next tap starts a FRESH number rather
// than being swallowed by a slice() — without that, a wrong two-digit entry
// could never be corrected on a touch device, because this shell hides the
// number pad's Clear key in the compact landscape layout.
function appendDigit(current, value) {
  if (current.length >= 2) return String(value);
  return `${current}${value}`.replace(/^0+(?=\d)/, "").slice(0, 2);
}

function enterNumber(value) {
  if (state.solved) return;
  if (state.activeField === "answer") {
    state.answer = appendDigit(state.answer, value);
    elements.hiddenDisplay.classList.remove("wrong");
    renderHiddenValue();
    maybeCheckAnswer();
    return;
  }
  const field = state.activeField;
  if (isFieldDone(field)) return; // locked once correct — digits no longer edit it
  state.wrongFlashField = null;
  setFieldValue(field, appendDigit(getFieldValue(field), value));
  renderWorkArea();
  maybeCommitField(field);
}

function clearInput() {
  if (state.solved) return;
  if (state.activeField === "answer") {
    state.answer = state.answer.slice(0, -1);
    elements.hiddenDisplay.classList.remove("wrong");
    renderHiddenValue();
    return;
  }
  const field = state.activeField;
  if (isFieldDone(field)) return;
  state.wrongFlashField = null;
  setFieldValue(field, getFieldValue(field).slice(0, -1));
  renderWorkArea();
}

// Same commit policy as the scratch-work cells: judge the answer only once it
// can't still grow into the right number — i.e. when it already matches, or
// when two digits have been typed. Judging every keystroke used to flag the
// "1" of a correct "12" as a mistake.
function maybeCheckAnswer() {
  if (state.solved || state.answer === "") return;
  if (Number(state.answer) === currentProblem().answer.hidden) {
    completeProblem();
    return;
  }
  if (state.answer.length < 2) return;
  state.wrongAttempts += 1;
  elements.hiddenDisplay.classList.add("wrong");
  showToast(text(state.lang, "hiddenWrong"));
  setGuide("hiddenWrong", false);
  state.answer = "";           // reset so the child simply types again
  renderHiddenValue();
}

function completeProblem() {
  state.solved = true;
  awardPoints(`hidden-cubes:${currentProblem().id}`, 15);
  celebrateEvolution(syncEvolution(), state.lang);
  updateLevelBadge(state.lang, { left: "25%" });
  if (!state.xray) { state.xray = true; updateXrayButtons(); renderModel(); }
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
  renderNumberPad();
  renderHiddenValue();
  renderWorkArea();
  // Longer dwell: the success burst plays (~1.2s), then the child keeps seeing
  // the outer cubes faded to a watermark with the hidden cubes glowing red
  // before the next problem loads.
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
  if (!state.xray) { state.xray = true; updateXrayButtons(); renderModel(); }
  showToast(text(state.lang, "guideHint"));
  setGuide("guideHint");
}

function toggleXray() {
  state.xray = !state.xray;
  updateXrayButtons();
  renderModel();
  setGuide(state.xray ? "guideXray" : (levels[state.levelIndex].wall ? "guideWall" : "guideStart"));
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
      localStorage.setItem("hidden-count-level", String(index));
      elements.levelDialog.hidden = true;
      loadProblem();
    });
    elements.levelList.append(button);
  });
}

// ---------------------------------------------------------------------------
// Three.js scene — identical wood/board/lighting setup to the "쌓기나무 개수 세기"
// game so both share copy-build's graphics standard.
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
// Semi-transparent "shell" for the visible cubes while X-ray is on, so the
// red hidden cubes inside show through.
const xrayShellMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff5df,
  map: cubeWoodTexture,
  roughness: 0.5,
  metalness: 0.01,
  transparent: true,
  opacity: 0.2,
  depthWrite: false
});
// Glowing red cube for the hidden ones revealed by X-ray.
const hiddenMaterial = new THREE.MeshStandardMaterial({
  color: 0xff5b52,
  emissive: 0xd12617,
  emissiveIntensity: 0.55,
  roughness: 0.4,
  metalness: 0.02
});
const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry, 28);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x8b6840, transparent: true, opacity: 0.18 });
const edgeMaterialDim = new THREE.LineBasicMaterial({ color: 0x8b6840, transparent: true, opacity: 0.08 });
// The two walls the cubes lean against (back + left). A warm plaster tone so it
// reads as a room corner, not as more cubes.
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xe9ddc4, roughness: 0.95, metalness: 0.0 });

const sharedMaterials = new Set([cubeMaterial, xrayShellMaterial, hiddenMaterial, edgeMaterial, edgeMaterialDim, wallMaterial]);
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

function occupiedColumns() {
  const heights = currentProblem().heights;
  const cols = [];
  heights.forEach((row, z) => row.forEach((height, x) => { if (height > 0) cols.push({ x, z, height }); }));
  return cols;
}

function renderModel() {
  clearModel();
  const [width, depth] = currentProblem().board;
  const heights = currentProblem().heights;
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

  // Back wall (-z) and left wall (-x): the cubes are stacked into this corner,
  // so their back and left faces are hidden against the walls. This is what the
  // "벽에 붙여서 쌓았다" definition means, and it makes the hidden-cube rule
  // (blocked from 위·앞·오른쪽) visually obvious.
  const wallThick = 0.16;
  const wallH = currentProblem().maxHeight + 0.4;
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(gridSize + 0.5, wallH, wallThick), wallMaterial);
  backWall.position.set(0, wallH / 2 - 0.02, -centerZ - 0.5 - wallThick / 2);
  backWall.receiveShadow = true;
  modelGroup.add(backWall);
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, gridSize + 0.5), wallMaterial);
  leftWall.position.set(-centerX - 0.5 - wallThick / 2, wallH / 2 - 0.02, 0);
  leftWall.receiveShadow = true;
  modelGroup.add(leftWall);

  const hiddenKeys = new Set(hiddenCubes(heights, levels[state.levelIndex].wall === true).map((c) => `${c.x},${c.y},${c.z}`));
  occupiedColumns().forEach((cell) => {
    const wx = cell.x - centerX;
    const wz = cell.z - centerZ;
    for (let y = 0; y < cell.height; y += 1) {
      const isHidden = hiddenKeys.has(`${cell.x},${y},${cell.z}`);
      let material = cubeMaterial;
      if (state.xray) material = isHidden ? hiddenMaterial : xrayShellMaterial;
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(wx, y + 0.5, wz);
      cube.castShadow = !state.xray;
      cube.receiveShadow = !state.xray;
      modelGroup.add(cube);
      if (state.xray && isHidden) {
        cube.userData.hiddenGlow = true;
        hiddenMeshes.push(cube);
      } else {
        cube.add(new THREE.LineSegments(edgeGeometry, state.xray ? edgeMaterialDim : edgeMaterial));
      }
    }
  });

  const labelOffset = gridSize / 2 + 0.46;
  const frontLabel = makeBoardLabelPlane(text(state.lang, "front"));
  frontLabel.position.set(0, -0.01, labelOffset);
  modelGroup.add(frontLabel);
  const rightLabel = makeBoardLabelPlane(state.lang === "ko" ? "오른쪽" : state.lang === "zh" ? "右边" : state.lang === "ja" ? "右" : "Right");
  rightLabel.position.set(labelOffset, -0.01, 0);
  rightLabel.rotation.set(0, Math.PI / 2, 0);
  modelGroup.add(rightLabel);

  controls.target.set(0, Math.min(1.75, currentProblem().maxHeight * 0.42 + 0.4), 0);
  controls.update();
}

function setCameraView(view) {
  const max = currentProblem().maxHeight;
  if (view === "front") camera.position.set(0.2, Math.max(3.2, max + 1.5), 8.6);
  if (view === "right") camera.position.set(8.6, Math.max(3.2, max + 1.5), 0.2);
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
elements.hiddenDisplay.addEventListener("click", () => activateField("answer"));
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
$$(".mode-switch button").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
$$('[data-view]').forEach((button) => button.addEventListener("click", () => setCameraView(button.dataset.view)));
$$('[data-lang]').forEach((button) => button.addEventListener("click", () => {
  state.lang = button.dataset.lang;
  localStorage.setItem("gfield-language", state.lang);
  applyLanguage();
  renderModel();
}));
window.addEventListener("keydown", (event) => {
  if (!elements.levelDialog.hidden) return;
  if (/^[0-9]$/.test(event.key)) enterNumber(Number(event.key));
  if (event.key === "Backspace" || event.key === "Delete") clearInput();
});

applyLanguage();
renderLevelList();
loadProblem();
resizeScene();
syncEvolution();                            // normalize/migrate on load (silent)
updateLevelBadge(state.lang, { left: "25%" }); // persistent top level badge
