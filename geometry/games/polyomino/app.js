/* Polyomino Garden - touch-first matching engine. */

import { levels, readyLevels, validateLevels, acceptsChoice } from "./levels.js?v=polyomino-1";
import { messages, text } from "./i18n.js?v=polyomino-1";
import { sessionProblems } from "../../shared/problem-pool.js";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const PROGRESS_KEY = "polyominoGarden";
const GAME_ID = "polyomino";
const TUTORIAL_KEY = "gfield-polyomino-tutorial-v1";
const SESSION_SIZE = 5;
const saved = readGameProgress(PROGRESS_KEY);
const storedLanguage = localStorage.getItem("gfield-language") || "ko";
const language = Object.hasOwn(messages, storedLanguage) ? storedLanguage : "ko";
const requestedLevel = Number(params.get("level")) || Number(saved.level) || 1;
const startLevel = levels.find((level) => level.id === requestedLevel)?.ready ? requestedLevel : 1;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  lang: language, level: startLevel, queue: [], problem: 0,
  selected: -1, solved: false, locked: false, wrong: 0, hints: 0,
  audio: localStorage.getItem("gfield-audio-muted") !== "true"
};

const ui = {
  target: $("#targetSlot"), tray: $("#pieceTray"), prompt: $("#prompt"), answer: $("#answerPrompt"),
  next: $("#nextButton"), toast: $("#toast"), success: $("#success"), guide: $("#cubiGuide"), bubble: $("#guideBubble"),
  levelDialog: $("#levelDialog"), levelList: $("#levelList"), complete: $("#completeDialog"),
  tutorial: $("#tutorial"), tutorialText: $("#tutorialText"), tutorialDots: $("#tutorialDots"), tutorialNext: $("#tutorialNext")
};

const t = (key, values) => text(state.lang, key, values);
const levelData = () => levels.find((level) => level.id === state.level);
const problem = () => state.queue[state.problem];

function loadSession() {
  state.queue = sessionProblems(GAME_ID, state.level, levelData().problems, SESSION_SIZE);
  state.problem = !params.has("level") && Number(saved.level) === state.level
    ? Math.max(0, Math.min(state.queue.length - 1, Number(saved.problemIndex) || 0)) : 0;
}

function playTone(kind) {
  if (!state.audio || reducedMotion || !window.AudioContext) return;
  try {
    const context = playTone.context ||= new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = kind === "success" ? "triangle" : "sine";
    oscillator.frequency.value = kind === "success" ? 820 : kind === "wrong" ? 165 : kind === "pick" ? 470 : 610;
    gain.gain.value = .055;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + (kind === "success" ? .34 : .13));
    oscillator.stop(context.currentTime + (kind === "success" ? .35 : .14));
  } catch { /* Audio feedback is optional. */ }
}

function speak(line) {
  if (!state.audio || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(line);
  voice.lang = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" }[state.lang];
  voice.rate = .92;
  voice.pitch = 1.12;
  speechSynthesis.speak(voice);
}

function cubiSays(line) {
  ui.bubble.textContent = line;
  ui.guide.classList.add("show");
  speak(line);
  clearTimeout(cubiSays.timer);
  cubiSays.timer = setTimeout(() => ui.guide.classList.remove("show"), 5200);
}

function toast(line) {
  ui.toast.textContent = line;
  ui.toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ui.toast.classList.remove("show"), 2200);
}

function pieceBounds(cells) {
  return {
    cols: Math.max(...cells.map(([x]) => x)) + 1,
    rows: Math.max(...cells.map(([, y]) => y)) + 1
  };
}

function pieceSvg(cells, className = "") {
  const bounds = pieceBounds(cells);
  const cell = 22;
  const gap = 1.4;
  const width = bounds.cols * cell;
  const height = bounds.rows * cell;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", `piece-svg ${className}`.trim());
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");
  cells.forEach(([x, y]) => {
    const rect = document.createElementNS(svg.namespaceURI, "rect");
    rect.setAttribute("x", x * cell + gap / 2);
    rect.setAttribute("y", y * cell + gap / 2);
    rect.setAttribute("width", cell - gap);
    rect.setAttribute("height", cell - gap);
    rect.setAttribute("rx", 3.2);
    svg.append(rect);
  });
  return svg;
}

function renderProblem() {
  const p = problem();
  state.selected = -1;
  state.solved = false;
  state.locked = false;
  ui.target.classList.remove("solved", "ready");
  ui.target.replaceChildren(pieceSvg(p.target, "target-piece"));
  ui.tray.replaceChildren();
  p.choices.forEach((candidate, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "piece-choice";
    button.dataset.index = index;
    button.append(pieceSvg(candidate.cells));
    button.setAttribute("aria-label", `${t("choices")} ${index + 1}`);
    ui.tray.append(button);
  });
  renderStatus();
}

function renderStatus() {
  const level = levelData();
  $("#levelLabel").textContent = t("levelLabel", { level: level.id });
  $("#problemLabel").textContent = t("problemOf", { current: state.problem + 1, total: state.queue.length });
  $("#stars").textContent = "*".repeat(level.id) + "-".repeat(5 - level.id);
  $("#missionTitle").textContent = t(level.id === 1 ? "mission1" : "mission2");
  ui.prompt.textContent = t(level.id === 1 ? "prompt1" : "prompt2");
  ui.answer.textContent = t(state.selected < 0 ? "choosePiece" : "tapAgain");
  ui.next.hidden = !state.solved;
}

function selectPiece(index) {
  if (state.solved || state.locked) return;
  state.selected = index;
  ui.tray.querySelectorAll(".piece-choice").forEach((node, choiceIndex) => node.classList.toggle("selected", choiceIndex === index));
  ui.target.classList.add("ready");
  playTone("pick");
  renderStatus();
}

function judgeSelected() {
  if (state.selected < 0 || state.solved || state.locked) return;
  const candidate = problem().choices[state.selected];
  if (acceptsChoice(problem(), candidate.cells)) return solveProblem();
  state.wrong += 1;
  state.locked = true;
  playTone("wrong");
  const selectedNode = ui.tray.querySelector(`[data-index="${state.selected}"]`);
  selectedNode?.classList.add("wrong");
  toast(t(candidate.role === "mirror" ? "wrongMirror" : "wrongDifferent"));
  setTimeout(() => {
    selectedNode?.classList.remove("wrong", "selected");
    state.selected = -1;
    state.locked = false;
    ui.target.classList.remove("ready");
    renderStatus();
  }, 850);
}

function solveProblem() {
  state.solved = true;
  state.locked = true;
  ui.target.classList.add("solved");
  ui.target.classList.remove("ready");
  const chosen = ui.tray.querySelector(`[data-index="${state.selected}"]`);
  chosen?.classList.add("correct");
  ui.answer.textContent = t("correct");
  ui.next.hidden = false;
  playTone("success");
  const words = ["GOOD JOB!", "GREAT JOB!", "SUCCESS!"];
  ui.success.querySelector("strong").textContent = words[Math.floor(Math.random() * words.length)];
  ui.success.classList.add("show");
  setTimeout(() => ui.success.classList.remove("show"), 1050);
  saveGameProgress(PROGRESS_KEY, {
    level: state.level, problemIndex: state.problem, queue: state.queue.map((item) => item.id), completedProblem: problem().id
  });
}

function nextProblem() {
  if (!state.solved) return;
  if (state.problem < state.queue.length - 1) {
    state.problem += 1;
    saveGameProgress(PROGRESS_KEY, { level: state.level, problemIndex: state.problem, queue: state.queue.map((item) => item.id) });
    renderProblem();
  } else {
    $("#completeTitle").textContent = t("completeTitle");
    $("#completeText").textContent = t("completeText");
    const next = levels.find((level) => level.id === state.level + 1)?.ready;
    $("#nextLevelButton").hidden = !next;
    ui.complete.hidden = false;
    cubiSays(t("completeText"));
  }
}

function renderLevelList() {
  ui.levelList.replaceChildren();
  levels.forEach((level) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "level-card";
    button.disabled = !level.ready;
    button.innerHTML = `<span>${level.id}</span><strong></strong><small></small><em></em>`;
    button.querySelector("strong").textContent = t(level.titleKey);
    button.querySelector("small").textContent = t(level.descriptionKey);
    button.querySelector("em").textContent = t(level.ready ? "ready" : "coming");
    if (level.ready) button.addEventListener("click", () => location.assign(`?level=${level.id}`));
    ui.levelList.append(button);
  });
}

function applyLanguage() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : state.lang;
  document.title = `GFIELD ${t("gameTitle")}`;
  $("#gameSubtitle").textContent = t("gameSubtitle");
  $(".exit").setAttribute("aria-label", t("back"));
  $("#levelButton").textContent = t("levels");
  $("#soundButton").setAttribute("aria-label", t(state.audio ? "mute" : "unmute"));
  $("#soundButton").textContent = state.audio ? "🔊" : "🔇";
  $("#targetLabel").textContent = t("target");
  $("#dropLabel").textContent = t("dropHere");
  $("#choicesLabel").textContent = t("choices");
  $("#trayHint").textContent = "1 · 2 · 3";
  $("#hintButton").textContent = t("hint");
  $("#clearButton").textContent = t("clear");
  ui.next.textContent = t("next");
  $("#dialogTitle").textContent = t("chooseLevel");
  $("#closeLevels").setAttribute("aria-label", t("close"));
  $("#nextLevelButton").textContent = t("nextLevel");
  $("#practiceButton").textContent = t("practice");
  $("#mapLink").textContent = t("map");
}

const tutorialSteps = ["tutorial1", "tutorial2", "tutorial3"];
let tutorialStep = 0;

function renderTutorial() {
  const line = t(tutorialSteps[tutorialStep]);
  ui.tutorialText.textContent = line;
  ui.tutorialDots.replaceChildren(...tutorialSteps.map((_, index) => {
    const dot = document.createElement("i");
    if (index === tutorialStep) dot.className = "active";
    return dot;
  }));
  ui.tutorialNext.textContent = t(tutorialStep === tutorialSteps.length - 1 ? "tutorialStart" : "tutorialNext");
  speak(line);
}

function openTutorial() {
  if (state.level !== 1 || state.problem !== 0) return;
  if (params.get("tutorial") !== "1" && localStorage.getItem(TUTORIAL_KEY) === "done") return;
  ui.tutorial.hidden = false;
  renderTutorial();
}

let drag = null;

ui.tray.addEventListener("pointerdown", (event) => {
  const button = event.target.closest(".piece-choice");
  if (!button || state.solved || state.locked) return;
  event.preventDefault();
  const index = Number(button.dataset.index);
  selectPiece(index);
  const ghost = button.cloneNode(true);
  ghost.className = "drag-ghost";
  document.body.append(ghost);
  drag = { index, ghost, moved: false, startX: event.clientX, startY: event.clientY, pointerId: event.pointerId };
  button.setPointerCapture?.(event.pointerId);
  moveGhost(event.clientX, event.clientY);
});

function moveGhost(x, y) {
  if (!drag) return;
  drag.ghost.style.left = `${x}px`;
  drag.ghost.style.top = `${y}px`;
}

addEventListener("pointermove", (event) => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 7) drag.moved = true;
  moveGhost(event.clientX, event.clientY);
});

addEventListener("pointerup", (event) => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const dropped = document.elementFromPoint(event.clientX, event.clientY)?.closest("#targetSlot");
  drag.ghost.remove();
  const shouldJudge = Boolean(dropped);
  drag = null;
  if (shouldJudge) judgeSelected();
});

ui.tray.addEventListener("click", (event) => {
  const button = event.target.closest(".piece-choice");
  if (!button || state.solved || state.locked) return;
  selectPiece(Number(button.dataset.index));
});
ui.target.addEventListener("click", judgeSelected);
ui.next.addEventListener("click", nextProblem);
$("#hintButton").addEventListener("click", () => { state.hints += 1; cubiSays(t(state.level === 1 ? "hint1" : "hint2")); });
$("#clearButton").addEventListener("click", () => {
  if (state.solved || state.locked) return;
  state.selected = -1;
  ui.tray.querySelectorAll(".piece-choice").forEach((node) => node.classList.remove("selected"));
  ui.target.classList.remove("ready");
  renderStatus();
});
$("#soundButton").addEventListener("click", () => {
  state.audio = !state.audio;
  localStorage.setItem("gfield-audio-muted", String(!state.audio));
  if (!state.audio && "speechSynthesis" in window) speechSynthesis.cancel();
  applyLanguage();
});
$("#levelButton").addEventListener("click", () => { ui.levelDialog.hidden = false; });
$("#closeLevels").addEventListener("click", () => { ui.levelDialog.hidden = true; });
ui.levelDialog.addEventListener("click", (event) => { if (event.target === ui.levelDialog) ui.levelDialog.hidden = true; });
ui.tutorialNext.addEventListener("click", () => {
  if (tutorialStep < tutorialSteps.length - 1) { tutorialStep += 1; renderTutorial(); return; }
  localStorage.setItem(TUTORIAL_KEY, "done");
  ui.tutorial.hidden = true;
});
$("#nextLevelButton").addEventListener("click", () => location.assign(`?level=${state.level + 1}`));
$("#practiceButton").addEventListener("click", () => location.assign(`?level=${state.level}&practice=1`));

loadSession();
applyLanguage();
renderLevelList();
renderProblem();
setTimeout(openTutorial, 180);
