/* =========================================================================
   거울 저택 (Mirror Manor) — game engine.

   House rules encoded here (from the owner's handoff and docs/12_*.md §12):
   - ONE kind of answer action per screen. Level 1 is tap-only, level 2 is
     drag-only. There is no submit button, no rotate button and no flip button,
     because any of those would be a second answer action on the same screen.
   - Cubi speaks only in three places: the first-visit tutorial, a hint the child
     asked for, and level completion. Ordinary taps and drops get a short tone.
   - A wrong action never plays praise audio and never reveals the answer; it
     reports WHICH KIND of mistake it was (방향만 틀림 / 거리가 틀림).
   - Success shows one of GOOD JOB! / GREAT JOB! / SUCCESS! for about a second.
   - Storage: the tutorial flag `gfield-mirror-manor-tutorial-v1`, this game's own
     record inside the shared profile, and the already-shared keys the other games
     use (`gfield-language`, `gfield-audio-muted`, `gfield-points`,
     `gfield-rewarded-games`). No other game's data is ever written.
   ========================================================================= */

import {
  levels, readyLevels, validateLevels, classifyCell, classifyPlacement,
  reflectCell, mirrorDistance, isGivenSide, inGrid, GAME_ID, PROGRESS_KEY
} from "./levels.js?v=mirror-manor-3";
import { messages, text } from "./i18n.js?v=mirror-manor-3";
import { sessionProblems } from "../../shared/problem-pool.js";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";

// Throws before a single pixel is drawn if the pool is broken, so a bad problem
// can never reach a child.
validateLevels();

const $ = (selector) => document.querySelector(selector);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const params = new URLSearchParams(location.search);
const saved = readGameProgress(PROGRESS_KEY);
const SESSION_SIZE = 5;
const TUTORIAL_KEY = "gfield-mirror-manor-tutorial-v1";

const storedLanguage = localStorage.getItem("gfield-language") || "ko";
const language = Object.keys(messages).includes(storedLanguage) ? storedLanguage : "ko";

// Levels 4-5 remain locked until their source-backed symbol and double-mirror
// pools are verified, so an old ?level=4 link falls back to level 3 for now.
const highestReady = readyLevels[readyLevels.length - 1].id;
const askedLevel = Number(params.get("level")) || Number(saved.level) || 1;
const startLevel = levels.find((level) => level.id === askedLevel)?.ready ? askedLevel : Math.min(Math.max(1, askedLevel), highestReady);

const state = {
  level: startLevel,
  problem: 0,
  queue: [],
  painted: new Set(),
  placements: [],
  usedTargets: new Set(),
  usedTrayPieces: new Set(),
  solved: false,
  distanceChoice: null,
  wrong: 0,
  hints: 0,
  audio: localStorage.getItem("gfield-audio-muted") !== "true",
  lang: language
};

const ui = {
  board: $("#board"), cells: $("#cells"), pieces: $("#pieceLayer"), guides: $("#guideLayer"),
  mirror: $("#mirrorLine"),
  prompt: $("#prompt"), answerPrompt: $("#answerPrompt"), tray: $("#tray"), next: $("#nextButton"),
  guide: $("#cubiGuide"), bubble: $("#guideBubble"), toast: $("#toast"), success: $("#success"),
  tutorial: $("#tutorial"), tutorialText: $("#tutorialText"), tutorialDots: $("#tutorialDots"), tutorialNext: $("#tutorialNext"),
  levelDialog: $("#levelDialog"), levelList: $("#levelList"), complete: $("#completeDialog")
};

const t = (key, vars) => text(state.lang, key, vars);
const levelData = () => levels.find((level) => level.id === state.level);
const problem = () => state.queue[state.problem];
const cellId = (cell) => cell.join(",");

/* ------------------------------------------------------------------ session */

// `sessionProblems` serves five of the ten authored problems and steps to the next
// five when the child reloads with ?practice=1, which is what "같은 레벨 더 풀기"
// does. That is the shared contract every other game uses.
function loadSession() {
  state.queue = sessionProblems(GAME_ID, state.level, levelData().problems, SESSION_SIZE);
  const restorable = !params.has("level") && Number(saved.level) === state.level;
  state.problem = restorable ? Math.max(0, Math.min(state.queue.length - 1, Number(saved.problemIndex) || 0)) : 0;
}

/* -------------------------------------------------------------------- audio */

// Short synthesised blips only. No sampled praise, and nothing at all on a wrong
// action beyond a low, plain tone.
function playTone(kind) {
  if (!state.audio || reducedMotion || !window.AudioContext) return;
  try {
    const context = playTone.context ||= new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = kind === "success" ? 760 : kind === "wrong" ? 180 : kind === "place" ? 520 : 440;
    gain.gain.value = .06;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .17);
    oscillator.stop(context.currentTime + .18);
  } catch { /* Audio is optional. */ }
}

function speak(line) {
  if (!state.audio || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(line);
  utterance.lang = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" }[state.lang];
  utterance.rate = .9;
  utterance.pitch = .95;
  speechSynthesis.speak(utterance);
}

// The ONLY entry point that makes Cubi talk. Called from the tutorial, the hint
// button and level completion — nowhere else.
function cubiSays(line) {
  ui.bubble.textContent = line;
  ui.guide.classList.add("show");
  speak(line);
  clearTimeout(cubiSays.timer);
  cubiSays.timer = setTimeout(() => ui.guide.classList.remove("show"), 6000);
}

function toast(line) {
  ui.toast.textContent = line;
  ui.toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ui.toast.classList.remove("show"), 2400);
}

/* ------------------------------------------------------------------ drawing */

const fraction = (value, total) => `${(value / total) * 100}%`;

function renderBoard() {
  const p = problem();
  const { grid, axis } = p;
  ui.board.style.setProperty("--cols", grid.cols);
  ui.board.style.setProperty("--rows", grid.rows);
  ui.board.classList.toggle("is-paint", p.interaction === "paint-reflection");
  ui.board.classList.toggle("is-drag", p.interaction === "drag-reflection");
  ui.board.classList.toggle("is-distance", p.interaction === "distance-match");
  // The two sides are told apart visually by the silvered mirror band and the cell
  // shading; screen readers get the same information through the label instead of
  // on-board chips, which would sit on top of tappable answer cells.
  ui.board.setAttribute("aria-label", `${t("boardAria")} — ${t("givenSide")} / ${t("answerSide")}`);

  ui.mirror.className = `mirror-line ${axis.kind}`;
  if (axis.kind === "vertical") ui.mirror.style.cssText = `left:${fraction(axis.at, grid.cols)};top:-2%;`;
  else ui.mirror.style.cssText = `top:${fraction(axis.at, grid.rows)};left:-2%;`;

  renderCells();
  renderPieces();
  ui.guides.replaceChildren();
}

function renderCells() {
  const p = problem();
  const { grid, axis } = p;
  ui.cells.classList.toggle("distance-cells", p.interaction === "distance-match");
  if (p.interaction === "distance-match") {
    renderDistanceNodes(p);
    return;
  }
  const paint = p.interaction === "paint-reflection";
  const givenIds = paint
    ? new Set(p.sourceCells.map(cellId))
    : new Set(p.givens.flatMap((given) => given.cells.map(cellId)));
  const fragment = document.createDocumentFragment();

  for (let y = 0; y < grid.rows; y += 1) {
    for (let x = 0; x < grid.cols; x += 1) {
      const cell = [x, y];
      const node = document.createElement(paint ? "button" : "div");
      node.className = "cell";
      node.dataset.x = x;
      node.dataset.y = y;
      const given = isGivenSide(cell, axis);
      if (!given) node.classList.add("answer-side");
      if (paint && givenIds.has(cellId(cell))) node.classList.add("given");
      if (paint && state.painted.has(cellId(cell))) node.classList.add("painted");
      if (paint) {
        node.type = "button";
        node.disabled = given || state.solved;
        const status = node.classList.contains("given") || node.classList.contains("painted") ? t("cellFilled") : t("cellEmpty");
        node.setAttribute("aria-label", `${t("cellAria", { row: y + 1, col: x + 1 })} ${status}`);
      }
      fragment.append(node);
    }
  }
  ui.cells.replaceChildren(fragment);
}

function distanceDotPosition(cell, grid) {
  const [x, y] = cell;
  // Triangle-grid rows are staggered slightly. The underlying coordinates remain
  // integer grid points, so reflection and answer validation stay identical.
  const stagger = grid.lattice === "triangle" && y % 2 ? 0.24 : 0;
  return { left: fraction(x + .5 + stagger, grid.cols), top: fraction(y + .5, grid.rows) };
}

function renderDistanceNodes(p) {
  ui.cells.classList.add("distance-cells");
  const gridDots = document.createElement("span");
  gridDots.className = "distance-grid";
  for (let y = 0; y < p.grid.rows; y += 1) {
    for (let x = 0; x < p.grid.cols; x += 1) {
      const dot = document.createElement("i");
      const position = distanceDotPosition([x, y], p.grid);
      dot.style.left = position.left;
      dot.style.top = position.top;
      gridDots.append(dot);
    }
  }
  const source = document.createElement("span");
  source.className = "distance-source";
  const sourcePosition = distanceDotPosition(p.sourceCell, p.grid);
  source.style.left = sourcePosition.left;
  source.style.top = sourcePosition.top;
  source.setAttribute("aria-label", t("sourceDotAria"));
  ui.cells.replaceChildren(gridDots, source);

  p.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "distance-choice";
    button.dataset.x = choice[0];
    button.dataset.y = choice[1];
    button.disabled = state.solved;
    const position = distanceDotPosition(choice, p.grid);
    button.style.left = position.left;
    button.style.top = position.top;
    button.setAttribute("aria-label", t("choiceDotAria", { number: index + 1 }));
    if (state.distanceChoice === cellId(choice)) button.classList.add("selected");
    button.append(document.createElement("i"));
    ui.cells.append(button);
  });
}

function objectNode(cells, className, grid, label) {
  const node = document.createElement("div");
  node.className = `object ${className}`;
  if (label) node.setAttribute("aria-label", label);
  cells.forEach(([x, y]) => {
    const part = document.createElement("i");
    part.style.cssText = `left:${fraction(x, grid.cols)};top:${fraction(y, grid.rows)};width:${fraction(1, grid.cols)};height:${fraction(1, grid.rows)};`;
    node.append(part);
  });
  return node;
}

function renderPieces() {
  const p = problem();
  ui.pieces.replaceChildren();
  if (p.interaction !== "drag-reflection") return;
  p.givens.forEach((given) => ui.pieces.append(objectNode(given.cells, "given", p.grid, t(given.nameKey))));
  state.placements.forEach((placement) => ui.pieces.append(objectNode(placement.cells, "placed", p.grid, t("placedAria", { name: t(placement.nameKey) }))));
}

function renderTray() {
  const p = problem();
  ui.tray.setAttribute("aria-label", t("trayAria"));
  ui.tray.replaceChildren();
  if (p.interaction !== "drag-reflection" || state.solved) return;
  p.tray.forEach((piece, index) => {
    const width = Math.max(...piece.shape.map((cell) => cell[0])) + 1;
    const height = Math.max(...piece.shape.map((cell) => cell[1])) + 1;
    const filled = new Set(piece.shape.map(cellId));
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tray-piece";
    button.dataset.index = index;
    button.style.gridTemplateColumns = `repeat(${width}, var(--tc))`;
    button.style.gridTemplateRows = `repeat(${height}, var(--tc))`;
    button.setAttribute("aria-label", t("pieceAria", { name: t(piece.nameKey) }));
    if (state.usedTrayPieces.has(index)) button.classList.add("used");
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const dot = document.createElement("i");
        dot.className = filled.has(`${x},${y}`) ? "on" : "off";
        button.append(dot);
      }
    }
    ui.tray.append(button);
  });
}

/* --------------------------------------------------------- distance guides */

/**
 * One dotted segment running from the outer edge of `cell` to the mirror line.
 * Its length is exactly the cell distance the label prints, so the child can read
 * "three squares out" straight off the board — the design document asks for this
 * while a piece is being placed, and only then.
 */
function guideNode(cell, axis, grid, side) {
  const distance = mirrorDistance(cell, axis);
  const node = document.createElement("div");
  node.className = `guide ${axis.kind === "vertical" ? "row" : "column"} ${side}`;
  if (axis.kind === "vertical") {
    const from = cell[0] < axis.at ? cell[0] : axis.at;
    node.style.cssText = `left:${fraction(from, grid.cols)};top:${fraction(cell[1] + .5, grid.rows)};width:${fraction(distance, grid.cols)};height:0;`;
  } else {
    const from = cell[1] < axis.at ? cell[1] : axis.at;
    node.style.cssText = `top:${fraction(from, grid.rows)};left:${fraction(cell[0] + .5, grid.cols)};height:${fraction(distance, grid.rows)};width:0;`;
  }
  const label = document.createElement("b");
  label.textContent = t("distanceLabel", { count: distance });
  node.append(label);
  return node;
}

function showGuides(cells) {
  const p = problem();
  ui.guides.replaceChildren();
  cells.forEach(({ cell, side }) => ui.guides.append(guideNode(cell, p.axis, p.grid, side)));
}

function clearGuides(delay) {
  clearTimeout(clearGuides.timer);
  clearGuides.timer = setTimeout(() => ui.guides.replaceChildren(), delay || 0);
}

/** The cell of a multi-cell object that sits closest to the glass. */
function nearestCell(cells, axis) {
  return [...cells].sort((a, b) => mirrorDistance(a, axis) - mirrorDistance(b, axis) || a[1] - b[1] || a[0] - b[0])[0];
}

/* ------------------------------------------------------------ level 1: tap */

function paintGuidesFor(cell) {
  const p = problem();
  const along = p.axis.kind === "vertical" ? cell[1] : cell[0];
  const candidates = p.sourceCells.filter((source) =>
    (p.axis.kind === "vertical" ? source[1] : source[0]) === along);
  const partner = candidates.find((source) => cellId(reflectCell(source, p.axis)) === cellId(cell))
    || candidates.sort((a, b) =>
      Math.abs(mirrorDistance(a, p.axis) - mirrorDistance(cell, p.axis))
      - Math.abs(mirrorDistance(b, p.axis) - mirrorDistance(cell, p.axis)))[0];
  const list = [{ cell, side: "answer" }];
  if (partner) list.unshift({ cell: partner, side: "given" });
  showGuides(list);
}

function onCellPointerDown(event) {
  const node = event.target.closest(".cell");
  if (!node || problem().interaction !== "paint-reflection" || state.solved) return;
  const cell = [Number(node.dataset.x), Number(node.dataset.y)];
  if (isGivenSide(cell, problem().axis)) return;
  paintGuidesFor(cell);
  clearGuides(1400);
}

function onCellClick(event) {
  if (problem().interaction === "distance-match") return onDistanceClick(event);
  const node = event.target.closest(".cell");
  if (!node || problem().interaction !== "paint-reflection" || state.solved) return;
  const p = problem();
  const cell = [Number(node.dataset.x), Number(node.dataset.y)];
  if (isGivenSide(cell, p.axis)) return;

  // Re-tapping a painted cell erases it. Erasing is the same gesture as painting,
  // so the screen still asks for exactly one kind of answer action.
  if (state.painted.has(cellId(cell))) {
    state.painted.delete(cellId(cell));
    playTone("tap");
    renderCells();
    renderStatus();
    return;
  }

  const verdict = classifyCell(cell, p);
  if (verdict !== "correct") return reportWrong(verdict, node);
  state.painted.add(cellId(cell));
  playTone("tap");
  renderCells();
  renderStatus();
  if (state.painted.size === p.targetCells.length) solveProblem();
}

function onDistanceClick(event) {
  const node = event.target.closest(".distance-choice");
  if (!node || state.solved) return;
  const cell = [Number(node.dataset.x), Number(node.dataset.y)];
  const p = problem();
  if (cellId(cell) !== cellId(p.targetCell)) return reportWrong("distanceChoice", node);
  state.distanceChoice = cellId(cell);
  playTone("tap");
  renderDistanceNodes(p);
  renderStatus();
  solveProblem();
}

/* ----------------------------------------------------------- level 2: drag */

let drag = null;

function boardMetrics() {
  const rect = ui.board.getBoundingClientRect();
  const { grid } = problem();
  return { rect, cellWidth: rect.width / grid.cols, cellHeight: rect.height / grid.rows };
}

function onTrayPointerDown(event) {
  const button = event.target.closest(".tray-piece");
  if (!button || state.solved) return;
  const index = Number(button.dataset.index);
  if (state.usedTrayPieces.has(index)) return;
  const piece = problem().tray[index];
  const rect = button.getBoundingClientRect();
  const width = Math.max(...piece.shape.map((cell) => cell[0])) + 1;
  const height = Math.max(...piece.shape.map((cell) => cell[1])) + 1;
  const grabX = Math.min(width - 1, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * width)));
  const grabY = Math.min(height - 1, Math.max(0, Math.floor(((event.clientY - rect.top) / rect.height) * height)));

  const metrics = boardMetrics();
  const ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  ghost.style.gridTemplateColumns = `repeat(${width}, ${metrics.cellWidth}px)`;
  ghost.style.gridTemplateRows = `repeat(${height}, ${metrics.cellHeight}px)`;
  const filled = new Set(piece.shape.map(cellId));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dot = document.createElement("i");
      dot.className = filled.has(`${x},${y}`) ? "on" : "off";
      ghost.append(dot);
    }
  }
  document.body.append(ghost);
  button.classList.add("dragging");
  button.setPointerCapture?.(event.pointerId);
  drag = { index, piece, grabX, grabY, ghost, button, anchor: null, metrics };
  moveDrag(event);
}

function moveDrag(event) {
  if (!drag) return;
  const { metrics } = drag;
  drag.ghost.style.left = `${event.clientX - (drag.grabX + .5) * metrics.cellWidth}px`;
  drag.ghost.style.top = `${event.clientY - (drag.grabY + .5) * metrics.cellHeight}px`;

  const p = problem();
  const column = Math.floor((event.clientX - metrics.rect.left) / metrics.cellWidth);
  const row = Math.floor((event.clientY - metrics.rect.top) / metrics.cellHeight);
  const anchor = [column - drag.grabX, row - drag.grabY];
  const cells = drag.piece.shape.map(([dx, dy]) => [anchor[0] + dx, anchor[1] + dy]);
  const inside = event.clientX >= metrics.rect.left && event.clientX <= metrics.rect.right
    && event.clientY >= metrics.rect.top && event.clientY <= metrics.rect.bottom;

  ui.pieces.querySelector(".object.preview")?.remove();
  ui.guides.replaceChildren();
  if (!inside) { drag.anchor = null; return; }

  const legal = cells.every((cell) => inGrid(cell, p.grid) && !isGivenSide(cell, p.axis)) && !cells.some((cell) => occupied(cell));
  drag.anchor = legal ? anchor : null;
  const preview = objectNode(cells.filter((cell) => inGrid(cell, p.grid)), legal ? "preview" : "preview blocked", p.grid);
  ui.pieces.append(preview);

  // While placing, every given object shows its own dotted distance to the glass,
  // and the ghost shows the distance it would sit at.
  const guides = p.givens.map((given) => ({ cell: nearestCell(given.cells, p.axis), side: "given" }));
  if (legal) guides.push({ cell: nearestCell(cells, p.axis), side: "answer" });
  showGuides(guides);
}

function occupied(cell) {
  const p = problem();
  const taken = new Set([
    ...p.givens.flatMap((given) => given.cells.map(cellId)),
    ...state.placements.flatMap((placement) => placement.cells.map(cellId))
  ]);
  return taken.has(cellId(cell));
}

function endDrag(event) {
  if (!drag) return;
  const { piece, anchor, ghost, button, index } = drag;
  ghost.remove();
  button.classList.remove("dragging");
  drag = null;
  ui.pieces.querySelector(".object.preview")?.remove();
  clearGuides(900);
  if (!anchor) {
    const metrics = boardMetrics();
    const overBoard = event.clientX >= metrics.rect.left && event.clientX <= metrics.rect.right
      && event.clientY >= metrics.rect.top && event.clientY <= metrics.rect.bottom;
    if (overBoard) { playTone("wrong"); state.wrong += 1; toast(t("blockedSpot")); }
    return;
  }

  const p = problem();
  const cells = piece.shape.map(([dx, dy]) => [anchor[0] + dx, anchor[1] + dy]);
  const remaining = p.targets.filter((_, slot) => !state.usedTargets.has(slot));
  const verdict = classifyPlacement(cells, p, remaining);
  if (verdict !== "correct") return reportWrong(verdict, null, cells);

  const placedIds = new Set(cells.map(cellId));
  const slot = p.targets.findIndex((target, position) =>
    !state.usedTargets.has(position) && target.cells.length === placedIds.size && target.cells.every((cell) => placedIds.has(cellId(cell))));
  state.usedTargets.add(slot);
  state.usedTrayPieces.add(index);
  state.placements.push({ cells, nameKey: piece.nameKey });
  playTone("place");
  renderPieces();
  renderTray();
  renderStatus();
  if (state.usedTargets.size === p.targets.length) solveProblem();
}

/* ------------------------------------------------------------- feedback */

/**
 * Report a wrong action. Never praise, never point at the right square: the child
 * is told only which of the two named mistakes this was.
 */
function reportWrong(verdict, node, cells) {
  state.wrong += 1;
  playTone("wrong");
  const key = verdict === "direction" ? "wrongDirection"
    : verdict === "distance" ? "wrongDistance"
      : verdict === "distanceChoice" ? "wrongDistanceChoice" : "wrongMiss";
  toast(t(key));
  if (node) {
    node.classList.add("wrong");
    setTimeout(() => node.classList.remove("wrong"), 420);
  }
  if (cells) {
    const p = problem();
    const flash = objectNode(cells.filter((cell) => inGrid(cell, p.grid)), "preview blocked", p.grid);
    ui.pieces.append(flash);
    setTimeout(() => flash.remove(), 420);
  }
}

function solveProblem() {
  state.solved = true;
  rewardProblem();
  playTone("success");
  showSuccess();
  ui.next.hidden = false;
  renderCells();
  renderTray();
  renderStatus();
}

function showSuccess() {
  const words = ["successGood", "successGreat", "successPop"];
  ui.success.querySelector("strong").textContent = t(words[state.problem % words.length]);
  ui.success.classList.remove("show");
  void ui.success.offsetWidth;
  ui.success.classList.add("show");
}

// Points follow paper-fold exactly: one award per problem id ever, and only for a
// clean solve. The shared keys are read-modify-written, never replaced wholesale.
function rewardProblem() {
  const id = `${GAME_ID}:${problem().id}`;
  let rewards = [];
  try { rewards = JSON.parse(localStorage.getItem("gfield-rewarded-games") || "[]"); } catch { rewards = []; }
  if (!Array.isArray(rewards)) rewards = [];
  if (!rewards.includes(id)) {
    rewards.push(id);
    localStorage.setItem("gfield-rewarded-games", JSON.stringify(rewards));
    if (!state.hints && state.wrong === 0) localStorage.setItem("gfield-points", String(Number(localStorage.getItem("gfield-points") || 120) + 10));
  }
  saveGameProgress(PROGRESS_KEY, { level: state.level, problemIndex: state.problem, queue: state.queue.map((item) => item.id), completedProblem: problem().id });
}

/* ---------------------------------------------------------------- rendering */

function renderStatus() {
  const p = problem();
  const level = levelData();
  $("#levelLabel").textContent = t("levelLabel", { level: level.id });
  $("#problemLabel").textContent = `${state.problem + 1} / ${state.queue.length}`;
  $("#missionTitle").textContent = t(level.titleKey);
  $("#stars").textContent = "*".repeat(level.id) + "-".repeat(5 - level.id);
  ui.prompt.textContent = t(p.interaction === "paint-reflection" ? "promptPaint"
    : p.interaction === "drag-reflection" ? "promptDrag" : "promptDistance");
  ui.answerPrompt.textContent = p.interaction === "paint-reflection"
    ? t("paintProgress", { done: state.painted.size, total: p.targetCells.length })
    : p.interaction === "drag-reflection"
      ? t("dragProgress", { done: state.usedTargets.size, total: p.targets.length })
      : t("distanceProgress", { done: state.distanceChoice ? 1 : 0 });
  ui.next.hidden = !state.solved;
}

function renderAll() {
  renderBoard();
  renderTray();
  renderStatus();
}

function resetProblem() {
  state.painted = new Set();
  state.placements = [];
  state.usedTargets = new Set();
  state.usedTrayPieces = new Set();
  state.solved = false;
  state.distanceChoice = null;
  state.wrong = 0;
  state.hints = 0;
  ui.guide.classList.remove("show");
  renderAll();
}

function nextProblem() {
  if (!state.solved) return;
  if (state.problem < state.queue.length - 1) {
    state.problem += 1;
    saveGameProgress(PROGRESS_KEY, { level: state.level, problemIndex: state.problem, queue: state.queue.map((item) => item.id) });
    resetProblem();
  } else showComplete();
}

function showComplete() {
  $("#completeTitle").textContent = t("levelComplete", { level: state.level });
  $("#completeText").textContent = t("completeText");
  const hasNext = levels.find((level) => level.id === state.level + 1)?.ready;
  $("#nextLevelButton").textContent = hasNext ? t("nextLevel") : t("worldMap");
  ui.complete.hidden = false;
  cubiSays(t("guideComplete"));
}

function renderLevelList() {
  ui.levelList.replaceChildren();
  levels.forEach((level) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "level-card";
    button.disabled = !level.ready;
    button.innerHTML = `<span>${level.id}</span><strong></strong><small></small>${level.ready ? "" : "<em></em>"}`;
    button.querySelector("strong").textContent = t(level.titleKey);
    button.querySelector("small").textContent = t(level.descKey);
    if (!level.ready) button.querySelector("em").textContent = t("comingSoon");
    if (level.ready) button.addEventListener("click", () => location.assign(`?level=${level.id}`));
    ui.levelList.append(button);
  });
}

/* ---------------------------------------------------------------- tutorial */

const tutorialSteps = ["tutorial1", "tutorial2", "tutorial3"];
let tutorialStep = 0;

// Only on the very first problem of a first visit — never again on this device.
function openTutorial() {
  if (state.problem !== 0 || state.level !== readyLevels[0].id) return;
  if (localStorage.getItem(TUTORIAL_KEY) === "done") return;
  ui.tutorial.hidden = false;
  renderTutorial();
}

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

/* ---------------------------------------------------------------- language */

function applyLanguage() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : state.lang;
  document.title = `GFIELD ${t("gameTitle")}`;
  $(".exit").setAttribute("aria-label", t("exitLabel"));
  $("#levelButton").textContent = t("levels");
  $("#hintButton").textContent = t("hint");
  $("#retryButton").textContent = t("retry");
  $("#toolPanel").setAttribute("aria-label", t("toolsAria"));
  ui.next.textContent = t("next");
  $("#dialogTitle").textContent = t("chooseLevel");
  $("#closeLevels").setAttribute("aria-label", t("close"));
  $("#practiceButton").textContent = t("practice");
  $("#mapLink").textContent = t("worldMap");
  $("#soundButton").textContent = state.audio ? "🔊" : "🔇";
  $("#soundButton").setAttribute("aria-label", t(state.audio ? "soundOn" : "soundOff"));
  $("#soundButton").classList.toggle("muted", !state.audio);
}

/* ------------------------------------------------------------------ events */

ui.cells.addEventListener("pointerdown", onCellPointerDown);
ui.cells.addEventListener("click", onCellClick);
ui.tray.addEventListener("pointerdown", onTrayPointerDown);
window.addEventListener("pointermove", moveDrag);
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", (event) => { if (drag) endDrag(event); });

$("#hintButton").addEventListener("click", () => {
  state.hints += 1;
  const current = problem();
  const hintKey = current.interaction === "paint-reflection"
    ? (current.axis.kind === "horizontal" ? "hintPaintHorizontal" : "hintPaintVertical")
    : current.interaction === "drag-reflection" ? "hintDrag" : "hintDistance";
  cubiSays(t(hintKey));
});
$("#retryButton").addEventListener("click", resetProblem);
ui.next.addEventListener("click", nextProblem);
$("#levelButton").addEventListener("click", () => { ui.levelDialog.hidden = false; });
$("#closeLevels").addEventListener("click", () => { ui.levelDialog.hidden = true; });
ui.levelDialog.addEventListener("click", (event) => { if (event.target === ui.levelDialog) ui.levelDialog.hidden = true; });
ui.tutorialNext.addEventListener("click", () => {
  if (tutorialStep < tutorialSteps.length - 1) { tutorialStep += 1; renderTutorial(); return; }
  localStorage.setItem(TUTORIAL_KEY, "done");
  ui.tutorial.hidden = true;
  cubiSays(t("guideStart"));
});
$("#nextLevelButton").addEventListener("click", () => {
  const next = levels.find((level) => level.id === state.level + 1);
  if (next?.ready) location.assign(`?level=${next.id}`);
  else location.assign("../../world-map/");
});
// "같은 레벨 더 풀기" reloads with ?practice=1 so shared/problem-pool.js advances
// this level's cursor and serves the next five of the ten authored problems.
$("#practiceButton").addEventListener("click", () => location.assign(`?level=${state.level}&practice=1`));
$("#soundButton").addEventListener("click", () => {
  state.audio = !state.audio;
  localStorage.setItem("gfield-audio-muted", String(!state.audio));
  if (!state.audio && "speechSynthesis" in window) speechSynthesis.cancel();
  applyLanguage();
});

loadSession();
applyLanguage();
renderLevelList();
renderAll();
setTimeout(openTutorial, 200);
