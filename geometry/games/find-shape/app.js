import { levels, validateLevels, clueSignature } from "./levels.js?v=find-1";
import { text } from "./i18n.js?v=find-1";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";
import { syncEvolution, celebrateEvolution, updateLevelBadge } from "../../shared/evolution.js?v=evolve4-20260720a";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const elements = {
  stars: $("#stars"), progress: $("#progress"), layerList: $("#layerList"), layerClue: $("#layerClue"),
  frontView: $("#frontView"), rightView: $("#rightView"), choiceGrid: $("#choiceGrid"),
  cluePanel: $(".clue-panel"), checkChoice: $("#checkChoice"), clearChoice: $("#clearChoice"),
  audio: $("#audio"), hint: $("#hint"), reset: $("#reset"), next: $("#next"),
  openLevels: $("#openLevels"), closeLevels: $("#closeLevels"), levelDialog: $("#levelDialog"), levelList: $("#levelList"),
  guide: $("#guide"), toast: $("#toast"), success: $("#success"),
  conceptTutorial: $("#conceptTutorial"), conceptMessage: $("#conceptMessage"), conceptSteps: $("#conceptSteps"), conceptNext: $("#conceptNext")
};

const params = new URLSearchParams(window.location.search);
const progress = readGameProgress("findShape");
const savedLevel = Number(progress.levelIndex ?? localStorage.getItem("find-shape-level") ?? 0);
const state = {
  lang: localStorage.getItem("gfield-language") || "ko",
  levelIndex: Math.max(0, Math.min(levels.length - 1, savedLevel)),
  problemIndex: Math.max(0, Number(progress.problemIndex) || 0),
  selected: -1,
  solved: false,
  hintsUsed: 0,
  wrongAttempts: 0,
  audioEnabled: localStorage.getItem("gfield-audio-muted") !== "true",
  tutorialStep: -1
};

const tutorialKey = "gfield-find-shape-tutorial-v1";
const tutorialKeys = ["tutorial1", "tutorial2", "tutorial3"];
const currentLevel = () => levels[state.levelIndex];
const currentProblem = () => currentLevel().problems[state.problemIndex];

function format(key, values = {}) {
  return Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)), text(state.lang, key));
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  $$('[data-i18n]').forEach((node) => { node.textContent = text(state.lang, node.dataset.i18n); });
  $$('[data-lang]').forEach((button) => button.classList.toggle("active", button.dataset.lang === state.lang));
  updateAudioButton();
  renderProblem();
  renderLevelList();
  if (state.tutorialStep >= 0) renderTutorial();
}

function updateAudioButton() {
  elements.audio.textContent = state.audioEnabled ? "♪" : "∕";
  elements.audio.setAttribute("aria-label", text(state.lang, state.audioEnabled ? "audioOn" : "audioOff"));
  elements.audio.setAttribute("title", text(state.lang, state.audioEnabled ? "audioOn" : "audioOff"));
  elements.audio.setAttribute("aria-pressed", String(state.audioEnabled));
}

function preferredVoice() {
  const locale = { ko: "ko", zh: "zh", ja: "ja", en: "en" }[state.lang];
  return speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith(locale));
}

function speak(message) {
  if (!state.audioEnabled || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  const voice = preferredVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" }[state.lang];
  utterance.rate = 0.92;
  utterance.pitch = 1.16;
  speechSynthesis.speak(utterance);
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 1800);
}

function setGuide(key, speakIt = false) {
  const message = text(state.lang, key);
  elements.guide.textContent = message;
  if (speakIt) speak(message);
}

function updateProgress() {
  elements.progress.textContent = format("progress", { level: currentLevel().level, current: state.problemIndex + 1, total: currentLevel().problems.length });
  elements.progress.dataset.flowLevel = String(state.levelIndex + 1);
  elements.stars.textContent = `${"★".repeat(currentLevel().stars)}${"☆".repeat(5 - currentLevel().stars)}`;
}

function renderView(container, heights, maxHeight) {
  container.style.setProperty("--cols", String(heights.length));
  container.style.setProperty("--rows", String(maxHeight));
  container.replaceChildren();
  for (let row = 0; row < maxHeight; row += 1) {
    const level = maxHeight - row;
    heights.forEach((height) => {
      const cell = document.createElement("span");
      if (height >= level) cell.classList.add("filled");
      container.append(cell);
    });
  }
}

function renderLayers() {
  elements.layerList.replaceChildren();
  currentProblem().clues.layers.forEach((count, index) => {
    const row = document.createElement("div");
    row.className = "layer-row";
    const chip = document.createElement("span");
    chip.className = "layer-chip";
    chip.textContent = `${index + 1}F`;
    const label = document.createElement("span");
    label.textContent = format("layerLine", { level: index + 1, count });
    const shortCount = document.createElement("b");
    shortCount.textContent = `×${count}`;
    row.append(chip, label, shortCount);
    elements.layerList.append(row);
  });
}

function isoSvg(grid, id) {
  const halfWidth = 28;
  const halfDepth = 14;
  const cubeHeight = 29;
  const polygons = [];
  grid.forEach((row, z) => row.forEach((height, x) => {
    for (let y = 0; y < height; y += 1) {
      const cx = (x - z) * halfWidth;
      const cy = (x + z) * halfDepth - (y + 1) * cubeHeight;
      const top = [[cx,cy],[cx+halfWidth,cy+halfDepth],[cx,cy+halfDepth*2],[cx-halfWidth,cy+halfDepth]];
      const left = [[cx-halfWidth,cy+halfDepth],[cx,cy+halfDepth*2],[cx,cy+halfDepth*2+cubeHeight],[cx-halfWidth,cy+halfDepth+cubeHeight]];
      const right = [[cx+halfWidth,cy+halfDepth],[cx,cy+halfDepth*2],[cx,cy+halfDepth*2+cubeHeight],[cx+halfWidth,cy+halfDepth+cubeHeight]];
      polygons.push({ x, z, y, top, left, right });
    }
  }));
  polygons.sort((a, b) => (a.x + a.z) - (b.x + b.z) || a.y - b.y || a.x - b.x);
  const points = polygons.flatMap((cube) => [...cube.top, ...cube.left, ...cube.right]);
  const minX = Math.min(...points.map(([x]) => x)) - 12;
  const maxX = Math.max(...points.map(([x]) => x)) + 12;
  const minY = Math.min(...points.map(([, y]) => y)) - 12;
  const maxY = Math.max(...points.map(([, y]) => y)) + 15;
  const pair = (values) => values.map(([x, y]) => `${x},${y}`).join(" ");
  const cubes = polygons.map((cube, index) => `
    <g class="iso-cube" style="--delay:${index * 12}ms">
      <polygon points="${pair(cube.left)}" fill="url(#left-${id})"/>
      <polygon points="${pair(cube.right)}" fill="url(#right-${id})"/>
      <polygon points="${pair(cube.top)}" fill="url(#top-${id})"/>
    </g>`).join("");
  return `<svg viewBox="${minX} ${minY} ${maxX-minX} ${maxY-minY}" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="top-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff4d7"/><stop offset=".52" stop-color="#efd0a0"/><stop offset="1" stop-color="#d6aa70"/></linearGradient>
      <linearGradient id="left-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d7a76a"/><stop offset="1" stop-color="#a66a34"/></linearGradient>
      <linearGradient id="right-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c58a4e"/><stop offset="1" stop-color="#8e5427"/></linearGradient>
    </defs>
    <g stroke="#76502f" stroke-width="1.25" stroke-linejoin="round">${cubes}</g>
  </svg>`;
}

function renderChoices() {
  const problem = currentProblem();
  elements.choiceGrid.classList.toggle("three", problem.options.length === 3);
  elements.choiceGrid.replaceChildren();
  problem.options.forEach((grid, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shape-choice";
    button.classList.toggle("selected", state.selected === index);
    button.classList.toggle("correct", state.solved && index === problem.answer);
    button.disabled = state.solved;
    button.setAttribute("aria-label", format("option", { number: index + 1 }));
    button.setAttribute("aria-pressed", String(state.selected === index));
    button.innerHTML = `${isoSvg(grid, `${problem.id}-${index}`)}<span class="option-tag">${index + 1}</span>`;
    button.addEventListener("click", () => selectChoice(index));
    elements.choiceGrid.append(button);
  });
}

function renderProblem() {
  updateProgress();
  renderLayers();
  const clues = currentProblem().clues;
  renderView(elements.frontView, clues.front, clues.maxHeight);
  renderView(elements.rightView, clues.right, clues.maxHeight);
  renderChoices();
  elements.checkChoice.disabled = state.solved;
  elements.clearChoice.disabled = state.solved || state.selected < 0;
}

function selectChoice(index) {
  if (state.solved) return;
  state.selected = index;
  $$(".shape-choice").forEach((button, optionIndex) => {
    button.classList.remove("wrong");
    button.classList.toggle("selected", optionIndex === index);
    button.setAttribute("aria-pressed", String(optionIndex === index));
  });
  elements.checkChoice.disabled = false;
  elements.clearChoice.disabled = false;
  elements.cluePanel.classList.remove("hint-front", "hint-right", "hint-layer");
}

function clearChoice() {
  if (state.solved) return;
  state.selected = -1;
  renderChoices();
  elements.checkChoice.disabled = true;
  elements.clearChoice.disabled = true;
  elements.cluePanel.classList.remove("hint-front", "hint-right", "hint-layer");
}

function checkAnswer() {
  if (state.solved) return;
  if (state.selected < 0) {
    showToast(text(state.lang, "chooseFirst"));
    setGuide("chooseFirst");
    return;
  }
  const problem = currentProblem();
  if (state.selected === problem.answer) { completeProblem(); return; }
  state.wrongAttempts += 1;
  const selected = problem.options[state.selected];
  const mine = clueSignature(selected).split("|");
  const target = clueSignature(problem.target).split("|");
  elements.cluePanel.classList.remove("hint-front", "hint-right", "hint-layer");
  if (mine[1] !== target[1]) elements.cluePanel.classList.add("hint-front");
  else if (mine[2] !== target[2]) elements.cluePanel.classList.add("hint-right");
  else elements.cluePanel.classList.add("hint-layer");
  const selectedButton = $$(".shape-choice")[state.selected];
  selectedButton.classList.remove("wrong");
  void selectedButton.offsetWidth;
  selectedButton.classList.add("wrong");
  showToast(text(state.lang, "wrong"));
  setGuide("wrong");
  playWrongSound();
}

function completeProblem() {
  state.solved = true;
  $$(".shape-choice").forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle("correct", index === currentProblem().answer);
  });
  elements.checkChoice.disabled = true;
  elements.clearChoice.disabled = true;
  elements.cluePanel.classList.remove("hint-front", "hint-right", "hint-layer");
  awardPoints(`find-shape:${currentProblem().id}`, 15);
  celebrateEvolution(syncEvolution(), state.lang);
  updateLevelBadge(state.lang, { left: "25%" });
  const phrases = state.hintsUsed === 0 && state.wrongAttempts === 0 ? ["success", "successGood", "successPop"] : ["success", "successGood"];
  elements.success.querySelector("strong").textContent = text(state.lang, phrases[Math.floor(Math.random() * phrases.length)]);
  elements.success.classList.remove("show");
  void elements.success.offsetWidth;
  elements.success.classList.add("show");
  setTimeout(() => elements.success.classList.remove("show"), 1900);
  playSuccessSound();
  setGuide("guideSuccess");
}

function audioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
}

function playWrongSound() {
  if (!state.audioEnabled) return;
  const context = audioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(190, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(145, context.currentTime + .16);
  gain.gain.setValueAtTime(.09, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .22);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(); oscillator.stop(context.currentTime + .24);
  setTimeout(() => context.close(), 330);
}

function playSuccessSound() {
  if (!state.audioEnabled) return;
  const context = audioContext();
  if (!context) return;
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(.0001, now);
  master.gain.exponentialRampToValueAtTime(.2, now + .02);
  master.gain.exponentialRampToValueAtTime(.0001, now + .55);
  master.connect(context.destination);
  [220, 330, 440, 660].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, now + index * .035);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.45, now + .3);
    gain.gain.setValueAtTime(index ? .16 : .28, now + index * .035);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .46);
    oscillator.connect(gain).connect(master);
    oscillator.start(now + index * .035); oscillator.stop(now + .52);
  });
  setTimeout(() => context.close(), 700);
}

function awardPoints(rewardId, amount) {
  const rewarded = new Set(JSON.parse(localStorage.getItem("gfield-rewarded-games") || "[]"));
  if (rewarded.has(rewardId)) return;
  rewarded.add(rewardId);
  localStorage.setItem("gfield-points", String((Number(localStorage.getItem("gfield-points")) || 120) + amount));
  localStorage.setItem("gfield-rewarded-games", JSON.stringify([...rewarded]));
}

function giveHint() {
  if (state.solved) return;
  state.hintsUsed += 1;
  const options = currentProblem().options;
  const target = currentProblem().target;
  const targetParts = clueSignature(target).split("|");
  const mismatches = options.map((grid) => clueSignature(grid).split("|")).flatMap((parts) => [parts[1] !== targetParts[1] ? "front" : "", parts[2] !== targetParts[2] ? "right" : ""]).filter(Boolean);
  const kind = mismatches[state.hintsUsed % Math.max(1, mismatches.length)] || "front";
  elements.cluePanel.classList.remove("hint-front", "hint-right", "hint-layer");
  elements.cluePanel.classList.add(`hint-${kind}`);
  showToast(text(state.lang, "hintMessage"));
  setGuide("hintMessage");
}

function loadProblem() {
  state.problemIndex = Math.max(0, Math.min(currentLevel().problems.length - 1, state.problemIndex));
  state.selected = -1;
  state.solved = false;
  state.hintsUsed = 0;
  state.wrongAttempts = 0;
  elements.success.classList.remove("show");
  elements.cluePanel.classList.remove("hint-front", "hint-right", "hint-layer");
  saveGameProgress("findShape", { levelIndex: state.levelIndex, problemIndex: state.problemIndex, level: currentLevel().level });
  renderProblem();
  setGuide("guideStart");
  if (shouldShowTutorial()) openTutorial();
}

function nextProblem() {
  state.problemIndex = (state.problemIndex + 1) % currentLevel().problems.length;
  loadProblem();
}

function renderLevelList() {
  elements.levelList.replaceChildren();
  levels.forEach((level, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.toggle("active", index === state.levelIndex);
    const title = document.createElement("strong"); title.textContent = format("levelName", { level: level.level });
    const stars = document.createElement("span"); stars.textContent = "★".repeat(level.stars);
    const description = document.createElement("small"); description.textContent = `${text(state.lang, `levelDesc${level.level}`)} · ${text(state.lang, "problemCount")}`;
    button.append(title, stars, description);
    button.addEventListener("click", () => {
      state.levelIndex = index;
      state.problemIndex = 0;
      localStorage.setItem("find-shape-level", String(index));
      elements.levelDialog.hidden = true;
      loadProblem();
    });
    elements.levelList.append(button);
  });
}

function shouldShowTutorial() {
  return state.levelIndex === 0 && state.problemIndex === 0 && (params.get("tutorial") === "1" || localStorage.getItem(tutorialKey) !== "done");
}

function renderTutorial() {
  elements.conceptMessage.textContent = text(state.lang, tutorialKeys[state.tutorialStep]);
  elements.conceptNext.textContent = text(state.lang, state.tutorialStep === tutorialKeys.length - 1 ? "tutorialStart" : "tutorialNext");
  elements.conceptSteps.replaceChildren();
  tutorialKeys.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.toggle("active", index === state.tutorialStep);
    dot.classList.toggle("done", index < state.tutorialStep);
    elements.conceptSteps.append(dot);
  });
}

function openTutorial() {
  state.tutorialStep = 0;
  elements.conceptTutorial.hidden = false;
  document.body.classList.add("count-tutorial-active");
  renderTutorial();
  setTimeout(() => speak(text(state.lang, tutorialKeys[0])), 220);
}

function advanceTutorial() {
  if (state.tutorialStep < tutorialKeys.length - 1) {
    state.tutorialStep += 1;
    renderTutorial();
    speak(text(state.lang, tutorialKeys[state.tutorialStep]));
    return;
  }
  state.tutorialStep = -1;
  localStorage.setItem(tutorialKey, "done");
  elements.conceptTutorial.hidden = true;
  document.body.classList.remove("count-tutorial-active");
  speechSynthesis?.cancel();
}

$$('[data-lang]').forEach((button) => button.addEventListener("click", () => {
  state.lang = button.dataset.lang;
  localStorage.setItem("gfield-language", state.lang);
  applyLanguage();
}));
elements.audio.addEventListener("click", () => {
  state.audioEnabled = !state.audioEnabled;
  localStorage.setItem("gfield-audio-muted", String(!state.audioEnabled));
  if (!state.audioEnabled) speechSynthesis?.cancel();
  updateAudioButton();
});
elements.checkChoice.addEventListener("click", checkAnswer);
elements.clearChoice.addEventListener("click", clearChoice);
elements.reset.addEventListener("click", clearChoice);
elements.hint.addEventListener("click", giveHint);
elements.next.addEventListener("click", nextProblem);
elements.openLevels.addEventListener("click", () => { elements.levelDialog.hidden = false; });
elements.closeLevels.addEventListener("click", () => { elements.levelDialog.hidden = true; });
elements.levelDialog.addEventListener("click", (event) => { if (event.target === elements.levelDialog) elements.levelDialog.hidden = true; });
elements.conceptNext.addEventListener("click", advanceTutorial);

renderLevelList();
applyLanguage();
loadProblem();
