/* Polyomino Garden - touch-first matching and exact-cover engine. */

import { levels, validateLevels, acceptsChoice, transform, findCoverSolutions } from "./levels.js?v=polyomino-2";
import { messages, text } from "./i18n.js?v=polyomino-2";
import { sessionProblems } from "../../shared/problem-pool.js";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const PROGRESS_KEY = "polyominoGarden";
const GAME_ID = "polyomino";
const MATCH_TUTORIAL_KEY = "gfield-polyomino-tutorial-v1";
const COVER_TUTORIAL_KEY = "gfield-polyomino-cover-tutorial-v1";
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
  placements: [], pieceStates: [],
  audio: localStorage.getItem("gfield-audio-muted") !== "true"
};

const ui = {
  target: $("#targetSlot"), tray: $("#pieceTray"), prompt: $("#prompt"), answer: $("#answerPrompt"),
  next: $("#nextButton"), toast: $("#toast"), success: $("#success"), guide: $("#cubiGuide"), bubble: $("#guideBubble"),
  levelDialog: $("#levelDialog"), levelList: $("#levelList"), complete: $("#completeDialog"),
  tutorial: $("#tutorial"), tutorialText: $("#tutorialText"), tutorialDots: $("#tutorialDots"), tutorialNext: $("#tutorialNext"),
  turn: $("#turnButton"), flip: $("#flipButton"), hint: $("#hintButton"), clear: $("#clearButton")
};

const t = (key, values) => text(state.lang, key, values);
const levelData = () => levels.find((level) => level.id === state.level);
const problem = () => state.queue[state.problem];
const isCover = () => problem()?.kind === "exact-cover";
const cellId = ([x, y]) => `${x},${y}`;

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
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", `piece-svg ${className}`.trim());
  svg.setAttribute("viewBox", `0 0 ${bounds.cols * cell} ${bounds.rows * cell}`);
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
  state.placements = [];
  state.pieceStates = p.kind === "exact-cover" ? p.pieces.map(() => ({ turns: 0, flipped: false })) : [];
  ui.target.dataset.problemId = p.id;
  ui.target.classList.remove("solved", "ready", "wrong");
  ui.target.classList.toggle("cover-mode", p.kind === "exact-cover");
  ui.tray.classList.toggle("cover-tray", p.kind === "exact-cover");
  ui.turn.hidden = p.kind !== "exact-cover";
  ui.flip.hidden = p.kind !== "exact-cover";
  if (p.kind === "exact-cover") {
    renderCoverBoard();
    renderCoverTray();
  } else {
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
  }
  applyLanguage();
  renderStatus();
}

function renderCoverBoard(hintedCells = []) {
  const p = problem();
  const width = Math.max(...p.board.map(([x]) => x)) + 1;
  const height = Math.max(...p.board.map(([, y]) => y)) + 1;
  const occupied = new Map();
  state.placements.forEach((placement) => placement.cells.forEach((cell) => occupied.set(cellId(cell), placement.pieceIndex)));
  const hints = new Set(hintedCells.map(cellId));
  const grid = document.createElement("div");
  grid.className = "cover-grid";
  grid.style.setProperty("--board-cols", width);
  grid.style.setProperty("--board-rows", height);
  p.board.forEach(([x, y]) => {
    const cell = document.createElement("button");
    const pieceIndex = occupied.get(`${x},${y}`);
    cell.type = "button";
    cell.className = "cover-cell";
    cell.style.gridColumn = x + 1;
    cell.style.gridRow = y + 1;
    cell.dataset.x = x;
    cell.dataset.y = y;
    if (Number.isInteger(pieceIndex)) {
      cell.classList.add("filled", `piece-color-${pieceIndex % 6}`);
      cell.dataset.pieceIndex = pieceIndex;
    }
    if (hints.has(`${x},${y}`)) cell.classList.add("hinted");
    grid.append(cell);
  });
  ui.target.replaceChildren(grid);
}

function renderCoverTray(hintedPiece = -1) {
  const p = problem();
  const placed = new Set(state.placements.map((entry) => entry.pieceIndex));
  ui.tray.replaceChildren();
  p.pieces.forEach((piece, index) => {
    const pieceState = state.pieceStates[index];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `piece-choice cover-piece piece-color-${index % 6}`;
    button.dataset.index = index;
    button.append(pieceSvg(transform(piece.cells, pieceState.turns, pieceState.flipped)));
    button.classList.toggle("selected", state.selected === index);
    button.classList.toggle("placed", placed.has(index));
    button.classList.toggle("hinted", hintedPiece === index);
    button.disabled = placed.has(index);
    button.setAttribute("aria-label", `${t("pieces")} ${index + 1}`);
    ui.tray.append(button);
  });
}

function renderStatus() {
  const level = levelData();
  $("#levelLabel").textContent = t("levelLabel", { level: level.id });
  $("#problemLabel").textContent = t("problemOf", { current: state.problem + 1, total: state.queue.length });
  $("#stars").textContent = "*".repeat(level.id) + "-".repeat(5 - level.id);
  $("#missionTitle").textContent = t(`mission${level.id}`);
  ui.prompt.textContent = t(`prompt${level.id}`);
  if (state.solved) ui.answer.textContent = t(isCover() ? "coverCorrect" : "correct");
  else if (isCover()) ui.answer.textContent = t(state.selected < 0 ? (state.placements.length ? "placedCoverPiece" : "chooseCoverPiece") : "placeCoverPiece");
  else ui.answer.textContent = t(state.selected < 0 ? "choosePiece" : "tapAgain");
  ui.next.hidden = !state.solved;
}

function selectPiece(index) {
  if (state.solved || state.locked) return;
  state.selected = index;
  if (isCover()) renderCoverTray();
  else {
    ui.tray.querySelectorAll(".piece-choice").forEach((node, choiceIndex) => node.classList.toggle("selected", choiceIndex === index));
    ui.target.classList.add("ready");
  }
  playTone("pick");
  renderStatus();
}

function judgeSelected() {
  if (isCover() || state.selected < 0 || state.solved || state.locked) return;
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

function selectedCoverCells(anchorX, anchorY) {
  const p = problem();
  const pieceState = state.pieceStates[state.selected];
  const cells = transform(p.pieces[state.selected].cells, pieceState.turns, pieceState.flipped);
  const first = [...cells].sort((a, b) => a[1] - b[1] || a[0] - b[0])[0];
  return cells.map(([x, y]) => [x - first[0] + anchorX, y - first[1] + anchorY]);
}

function placeCoverPiece(x, y) {
  if (!isCover() || state.selected < 0 || state.solved || state.locked) return;
  const cells = selectedCoverCells(x, y);
  const board = new Set(problem().board.map(cellId));
  const occupied = new Set(state.placements.flatMap((entry) => entry.cells).map(cellId));
  if (!cells.every((cell) => board.has(cellId(cell)) && !occupied.has(cellId(cell)))) {
    state.wrong += 1;
    playTone("wrong");
    ui.target.classList.add("wrong");
    toast(t("wrongPlacement"));
    setTimeout(() => ui.target.classList.remove("wrong"), 480);
    return;
  }
  state.placements.push({ pieceIndex: state.selected, cells });
  state.selected = -1;
  renderCoverBoard();
  renderCoverTray();
  playTone("place");
  if (state.placements.length === problem().pieces.length) solveProblem();
  else renderStatus();
}

function removeCoverPiece(pieceIndex) {
  if (!isCover() || state.solved || state.locked) return;
  const placementIndex = state.placements.findIndex((entry) => entry.pieceIndex === pieceIndex);
  if (placementIndex < 0) return;
  state.placements.splice(placementIndex, 1);
  state.selected = pieceIndex;
  renderCoverBoard();
  renderCoverTray();
  renderStatus();
  playTone("pick");
}

function solveProblem() {
  state.solved = true;
  state.locked = true;
  ui.target.classList.add("solved");
  ui.target.classList.remove("ready");
  if (isCover()) {
    renderCoverBoard();
    renderCoverTray();
  } else ui.tray.querySelector(`[data-index="${state.selected}"]`)?.classList.add("correct");
  ui.answer.textContent = t(isCover() ? "coverCorrect" : "correct");
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
    $("#nextLevelButton").hidden = !levels.find((level) => level.id === state.level + 1)?.ready;
    ui.complete.hidden = false;
    cubiSays(t("completeText"));
  }
}

function showHint() {
  state.hints += 1;
  if (!isCover()) return cubiSays(t(`hint${state.level}`));
  const solution = findCoverSolutions(problem(), 1, state.placements)[0];
  if (!solution) {
    toast(t("wrongNoCompletion"));
    playTone("wrong");
    return;
  }
  const placed = new Set(state.placements.map((entry) => entry.pieceIndex));
  const next = solution.find((entry) => !placed.has(entry.pieceIndex));
  if (!next) return;
  state.selected = next.pieceIndex;
  renderCoverBoard(next.cells);
  renderCoverTray(next.pieceIndex);
  cubiSays(t(`hint${state.level}`));
  renderStatus();
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
  $("#rotateMessage").textContent = t("rotateDevice");
  $(".exit").setAttribute("aria-label", t("back"));
  $("#levelButton").textContent = t("levels");
  $("#soundButton").setAttribute("aria-label", t(state.audio ? "mute" : "unmute"));
  $("#soundButton").textContent = state.audio ? "🔊" : "🔇";
  $("#targetLabel").textContent = t(isCover() ? "board" : "target");
  $("#dropLabel").textContent = t("dropHere");
  $("#choicesLabel").textContent = t(isCover() ? "pieces" : "choices");
  $("#trayHint").textContent = isCover() ? `${problem()?.pieces?.length || 0}` : "1 · 2 · 3";
  ui.turn.textContent = t("turn");
  ui.flip.textContent = t("flip");
  ui.hint.textContent = t("hint");
  ui.clear.textContent = t("clear");
  ui.next.textContent = t("next");
  $("#dialogTitle").textContent = t("chooseLevel");
  $("#closeLevels").setAttribute("aria-label", t("close"));
  $("#nextLevelButton").textContent = t("nextLevel");
  $("#practiceButton").textContent = t("practice");
  $("#mapLink").textContent = t("map");
}

let tutorialSteps = [];
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
  if (state.problem !== 0 || ![1, 3].includes(state.level)) return;
  const cover = state.level === 3;
  const key = cover ? COVER_TUTORIAL_KEY : MATCH_TUTORIAL_KEY;
  if (params.get("tutorial") !== "1" && localStorage.getItem(key) === "done") return;
  tutorialSteps = cover ? ["tutorialCover1", "tutorialCover2", "tutorialCover3"] : ["tutorial1", "tutorial2", "tutorial3"];
  tutorialStep = 0;
  ui.tutorial.dataset.storageKey = key;
  ui.tutorial.hidden = false;
  renderTutorial();
}

let drag = null;

ui.tray.addEventListener("pointerdown", (event) => {
  const button = event.target.closest(".piece-choice");
  if (!button || button.disabled || state.solved || state.locked) return;
  event.preventDefault();
  const index = Number(button.dataset.index);
  button.setPointerCapture?.(event.pointerId);
  selectPiece(index);
  const ghost = button.cloneNode(true);
  ghost.className = "drag-ghost";
  document.body.append(ghost);
  drag = { ghost, pointerId: event.pointerId };
  moveGhost(event.clientX, event.clientY);
});

function moveGhost(x, y) {
  if (!drag) return;
  drag.ghost.style.left = `${x}px`;
  drag.ghost.style.top = `${y}px`;
}

addEventListener("pointermove", (event) => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  moveGhost(event.clientX, event.clientY);
});

addEventListener("pointerup", (event) => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const dropped = document.elementFromPoint(event.clientX, event.clientY);
  drag.ghost.remove();
  drag = null;
  if (isCover()) {
    const cell = dropped?.closest(".cover-cell");
    if (cell) placeCoverPiece(Number(cell.dataset.x), Number(cell.dataset.y));
  } else if (dropped?.closest("#targetSlot")) judgeSelected();
});

ui.tray.addEventListener("click", (event) => {
  const button = event.target.closest(".piece-choice");
  if (!button || button.disabled || state.solved || state.locked) return;
  selectPiece(Number(button.dataset.index));
});

ui.target.addEventListener("click", (event) => {
  if (!isCover()) return judgeSelected();
  const cell = event.target.closest(".cover-cell");
  if (!cell) return;
  if (cell.dataset.pieceIndex) removeCoverPiece(Number(cell.dataset.pieceIndex));
  else placeCoverPiece(Number(cell.dataset.x), Number(cell.dataset.y));
});

ui.turn.addEventListener("click", () => {
  if (!isCover() || state.selected < 0 || state.solved || state.locked) return;
  state.pieceStates[state.selected].turns = (state.pieceStates[state.selected].turns + 1) % 4;
  renderCoverTray();
  playTone("pick");
});
ui.flip.addEventListener("click", () => {
  if (!isCover() || state.selected < 0 || state.solved || state.locked) return;
  state.pieceStates[state.selected].flipped = !state.pieceStates[state.selected].flipped;
  renderCoverTray();
  playTone("pick");
});
ui.next.addEventListener("click", nextProblem);
ui.hint.addEventListener("click", showHint);
ui.clear.addEventListener("click", () => {
  if (state.solved || state.locked) return;
  if (isCover()) {
    if (state.selected >= 0) state.selected = -1;
    else state.placements.pop();
    renderCoverBoard();
    renderCoverTray();
  } else {
    state.selected = -1;
    ui.tray.querySelectorAll(".piece-choice").forEach((node) => node.classList.remove("selected"));
    ui.target.classList.remove("ready");
  }
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
  if (tutorialStep < tutorialSteps.length - 1) {
    tutorialStep += 1;
    renderTutorial();
    return;
  }
  localStorage.setItem(ui.tutorial.dataset.storageKey, "done");
  ui.tutorial.hidden = true;
});
$("#nextLevelButton").addEventListener("click", () => location.assign(`?level=${state.level + 1}`));
$("#practiceButton").addEventListener("click", () => location.assign(`?level=${state.level}&practice=1`));

loadSession();
renderProblem();
renderLevelList();
if (!params.has("level")) ui.levelDialog.hidden = false;
else setTimeout(openTutorial, 180);
