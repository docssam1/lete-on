import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { levels, validateLevels } from "./levels.js?v=minmax-1";
import { text } from "./i18n.js?v=minmax-1";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";
import { syncEvolution, celebrateEvolution, updateLevelBadge } from "../../shared/evolution.js?v=evolve4-20260720a";

// Fail loudly at load: a mis-authored problem here is unanswerable (a level-2
// puzzle with two possible totals has no single right answer), so it must
// never reach a child.
validateLevels();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const elements = {
  scene: $("#scene"),
  stars: $("#stars"),
  instruction: $("#instruction"),
  progress: $("#progress"),
  viewerTitle: $("#viewerTitle"),
  revealCaption: $("#revealCaption"),
  revealSwitch: $("#revealSwitch"),
  revealMaxBtn: $("#revealMaxBtn"),
  revealMinBtn: $("#revealMinBtn"),
  stageTabs: $("#stageTabs"),
  minmaxStage: $("#minmaxStage"),
  viewsBlock: $("#viewsBlock"),
  viewsRow: $(".views-row"),
  topViewGrid: $("#topViewGrid"),
  frontViewGrid: $("#frontViewGrid"),
  sideViewGrid: $("#sideViewGrid"),
  tableBlock: $("#tableBlock"),
  numberBoardFrame: $("#numberBoardFrame"),
  numberBoard: $("#numberBoard"),
  numberHintRight: $("#numberHintRight"),
  numberHintBottom: $("#numberHintBottom"),
  edgeHints: $("#edgeHints"),
  sumValue: $("#sumValue"),
  tableStatus: $("#tableStatus"),
  answerSlots: $("#answerSlots"),
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
  conceptTutorial: $("#conceptTutorial"),
  conceptMessage: $("#conceptMessage"),
  conceptSteps: $("#conceptSteps"),
  conceptNext: $("#conceptNext")
};

const params = new URLSearchParams(window.location.search);
const gameProgress = readGameProgress("minmax");
const savedLevel = Number.isInteger(Number(gameProgress.levelIndex))
  ? Number(gameProgress.levelIndex)
  : Number(localStorage.getItem("minmax-level")) || 0;

const state = {
  lang: localStorage.getItem("gfield-language") || "ko",
  levelIndex: Math.max(0, Math.min(levels.length - 1, savedLevel)),
  problemIndex: Math.max(0, Number(gameProgress.problemIndex) || 0),
  stage: "table",              // which section the compact tabs show
  cellAnswers: new Map(),      // "x,z" -> number the child wrote (scratch only)
  slotAnswers: { count: "", max: "", min: "" },
  selectedKey: null,           // table cell currently taking input
  inputTarget: "cell",         // "cell" | "count" | "max" | "min"
  wrongSlots: new Set(),
  tableConfirmed: false,       // the "your table matches" nudge fires once per problem
  hintsUsed: 0,
  wrongAttempts: 0,
  audioEnabled: localStorage.getItem("gfield-audio-muted") !== "true",
  solved: false,
  revealMode: "max",           // which witness stack the 3D panel is showing
  advanceTimer: null,
  revealTimer: null,
  tutorialStep: -1
};

const tutorialStorageKey = "gfield-minmax-tutorial-v1";
const tutorialKeys = [
  "tutorialMinmax1",
  "tutorialMinmax2",
  "tutorialMinmax3",
  "tutorialMinmax4",
  "tutorialMinmax5"
];

// Textbook 수 쓰기 표 helper numbers along the bottom (앞) and right (오른쪽 옆)
// edges. Hidden by default so the child first tries reading the views
// themselves; the choice persists across problems and sessions.
const edgeHintsStorageKey = "gfield-minmax-edge-hints";
state.edgeHintsVisible = localStorage.getItem(edgeHintsStorageKey) === "true";

const currentLevel = () => levels[state.levelIndex];
const currentProblem = () => currentLevel().problems[state.problemIndex];
const isRangeMode = () => currentProblem().mode === "range";
const cellKey = (x, z) => `${x},${z}`;

// The cells the child may write in — exactly the 위 silhouette's filled cells.
function footprintCells() {
  const problem = currentProblem();
  const result = [];
  problem.footprint.forEach((row, z) => row.forEach((filled, x) => {
    if (filled) result.push({ x, z, key: cellKey(x, z) });
  }));
  return result;
}

function format(key, values = {}) {
  return Object.entries(values).reduce(
    (value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)),
    text(state.lang, key)
  );
}

/* -------------------------------------------------------------------------
   Language, chrome, voice
   ------------------------------------------------------------------------- */
function applyLanguage() {
  document.documentElement.lang = state.lang;
  $$("[data-i18n]").forEach((node) => { node.textContent = text(state.lang, node.dataset.i18n); });
  // The silhouette section carries no visible heading (the three view labels
  // are the heading), so its accessible name has to be set here.
  elements.viewsBlock.setAttribute("aria-label", text(state.lang, "viewsTitle"));
  $$("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === state.lang));
  updateAudioButton();
  updateProgress();
  updateInstruction();
  renderLevelList();
  renderNumberPad();
  renderAnswerSlots();
  updatePrompt();
  updateTableStatus();
  updateRevealBar();
  renderModel();
  if (state.tutorialStep >= 0) renderConceptTutorial();
}

function updateAudioButton() {
  const label = text(state.lang, state.audioEnabled ? "audioOn" : "audioOff");
  elements.audio.textContent = state.audioEnabled ? "♪" : "∕";
  elements.audio.setAttribute("aria-label", label);
  elements.audio.setAttribute("title", label);
  elements.audio.setAttribute("aria-pressed", String(state.audioEnabled));
}

// Levels 1-3 ask for one count, 4-5 for 최대 and 최소 — the mission line has to
// say which, otherwise the child reads the wrong task on half the levels.
function updateInstruction() {
  elements.instruction.textContent = text(state.lang, isRangeMode() ? "instructionRange" : "instruction");
}

function updateProgress() {
  elements.progress.textContent = format("progress", {
    level: state.levelIndex + 1,
    current: state.problemIndex + 1,
    total: currentLevel().problems.length
  });
  const stars = currentLevel().stars;
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
  const key = {
    cell: "chooseNumber",
    count: "chooseCount",
    max: "chooseMax",
    min: "chooseMin"
  }[state.inputTarget] || "selectCell";
  elements.numberPrompt.textContent = text(state.lang, key);
}

/* -------------------------------------------------------------------------
   Concept tutorial (first play only)
   ------------------------------------------------------------------------- */
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
  speechSynthesis?.cancel();
}

/* -------------------------------------------------------------------------
   Problem lifecycle
   ------------------------------------------------------------------------- */
function loadProblem() {
  state.problemIndex = Math.max(0, Math.min(currentLevel().problems.length - 1, state.problemIndex));
  saveGameProgress("minmax", {
    levelIndex: state.levelIndex,
    problemIndex: state.problemIndex,
    level: state.levelIndex + 1
  });
  clearTimeout(state.advanceTimer);
  clearTimeout(state.revealTimer);
  elements.success.classList.remove("show");
  state.cellAnswers = new Map();
  state.slotAnswers = { count: "", max: "", min: "" };
  state.selectedKey = null;
  state.inputTarget = "cell";
  state.wrongSlots = new Set();
  state.hintsUsed = 0;
  state.wrongAttempts = 0;
  state.solved = false;
  state.tableConfirmed = false;
  state.revealMode = "max";
  applyEdgeHints();
  updateProgress();
  updateInstruction();
  renderViewGrids();
  renderNumberBoard();
  renderAnswerSlots();
  renderNumberPad();
  updatePrompt();
  updateSum();
  updateTableStatus();
  updateRevealBar();
  renderModel();
  setGuide("guideStart", false);
  setCameraView("free");
  if (shouldShowConceptTutorial()) openConceptTutorial();
}

function nextProblem() {
  clearTimeout(state.advanceTimer);
  state.problemIndex = (state.problemIndex + 1) % currentLevel().problems.length;
  loadProblem();
}

function resetProblem() {
  loadProblem();
  showToast(text(state.lang, "reset"));
}

/* -------------------------------------------------------------------------
   The three silhouettes (read-only reference)
   ------------------------------------------------------------------------- */
function renderViewGrid(element, grid) {
  element.style.setProperty("--cols", String(grid[0].length));
  element.replaceChildren();
  grid.forEach((row) => row.forEach((filled) => {
    const cell = document.createElement("span");
    cell.className = filled ? "view-cell filled" : "view-cell";
    element.append(cell);
  }));
}

function renderViewGrids() {
  const { views } = currentProblem();
  renderViewGrid(elements.topViewGrid, views.top);
  renderViewGrid(elements.frontViewGrid, views.front);
  renderViewGrid(elements.sideViewGrid, views.side);
  // Cells are built at their natural size first; measure once layout settles
  // so the fitter reads a real box instead of a pre-paint 0x0.
  requestAnimationFrame(fitViewCells);
}

// One shared cell size that lets all three silhouettes sit side by side in
// the measured row, and still fit the tallest one's rows vertically. Same
// approach as 세 방향 관찰소's fitViewCells().
function fitViewCells() {
  const row = elements.viewsRow;
  if (!row || !row.clientWidth || !row.clientHeight) return;
  const blocks = [...row.querySelectorAll(".view-block")];
  if (!blocks.length) return;
  const rowStyle = getComputedStyle(row);
  const rowGap = parseFloat(rowStyle.columnGap || rowStyle.gap) || 0;

  const specs = blocks.map((block) => {
    const grid = block.querySelector(".view-grid");
    const label = block.querySelector(".view-label");
    const cols = Number(getComputedStyle(grid).getPropertyValue("--cols")) || 1;
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
  if (availW <= 0 || totalCols <= 0 || maxRows <= 0) return;
  const cellW = availW / totalCols;
  // The views block is content-sized on desktop (it shares the stage with the
  // table), so a non-positive height budget just means "no vertical limit".
  const cellH = availH > 0 ? availH / maxRows : Infinity;
  let cell = Math.floor(Math.min(cellW, cellH));
  cell = Math.max(12, Math.min(46, cell));
  elements.minmaxStage.style.setProperty("--mm-view-cell", `${cell}px`);
}

/* -------------------------------------------------------------------------
   수 쓰기 표 — the editable top-view grid plus its two helper strips
   ------------------------------------------------------------------------- */
function renderNumberBoard() {
  const problem = currentProblem();
  const [width, depth] = problem.board;
  elements.numberBoard.style.setProperty("--cols", width);
  elements.numberBoard.dataset.cols = String(width);
  elements.numberBoard.dataset.rows = String(depth);
  // The hint strips are siblings of the board, not descendants, so the column
  // and row counts they read through CSS variable inheritance live on the frame.
  elements.numberBoardFrame.style.setProperty("--cols", width);
  elements.numberBoardFrame.style.setProperty("--rows", depth);
  elements.numberBoard.replaceChildren();
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = cellKey(x, z);
      const inFootprint = problem.footprint[z][x] === 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "top-cell";
      if (!inFootprint) {
        // Outside the 위 silhouette: inert and blank, never a target.
        button.classList.add("empty");
        button.disabled = true;
      } else {
        button.textContent = state.cellAnswers.get(key) ?? "";
        button.classList.toggle("selected", key === state.selectedKey && state.inputTarget === "cell");
        button.setAttribute("aria-label", `${x + 1}, ${z + 1}`);
        button.disabled = state.solved;
        button.addEventListener("click", () => selectCell(x, z));
      }
      elements.numberBoard.append(button);
    }
  }
  renderEdgeHintCells(problem);
  requestAnimationFrame(fitNumberBoard);
}

// 교재식 도움 수: the bottom strip carries what 앞에서 본 모양 tells you (the
// tallest stack in each column x), the right strip what 오른쪽 옆에서 본 모양
// tells you (the tallest in each row z). Both numbers were read off the view
// grids in levels.js, so they are exactly what a child could work out with a
// pencil. Always rendered; visibility is a pure CSS toggle so flipping the
// switch recomputes nothing.
function renderEdgeHintCells(problem) {
  const [width, depth] = problem.board;
  elements.numberHintBottom.replaceChildren();
  for (let x = 0; x < width; x += 1) {
    const cell = document.createElement("span");
    cell.className = "hint-cell";
    cell.textContent = String(problem.colMax[x]);
    elements.numberHintBottom.append(cell);
  }
  elements.numberHintRight.replaceChildren();
  for (let z = 0; z < depth; z += 1) {
    const cell = document.createElement("span");
    cell.className = "hint-cell";
    cell.textContent = String(problem.rowMax[z]);
    elements.numberHintRight.append(cell);
  }
}

// Picks the largest square cell that fits the measured box, with the two hint
// strips folded into the track count while they are visible so the table plus
// its strips never overflows the panel. The floor is a finger-sized 44px: on a
// 844x390 phone the compact tab layout hands the table the whole stage, which
// is enough for 5 tracks at 44px; if a device is ever shorter than that the
// .input-canvas scrolls rather than shrinking the targets below what a child
// can hit.
const MIN_BOARD_CELL = 44;
const MAX_BOARD_CELL = 108;
// Must match --hint-size in styles.css: the hint strips are 0.62 of a cell on
// their cross axis only, so they cost 0.62 of a track, not a whole one.
const HINT_TRACK_RATIO = 0.62;
function fitNumberBoard() {
  const board = elements.numberBoard;
  const frame = elements.numberBoardFrame;
  const hintsVisible = frame.classList.contains("show-edge-hints");
  // Which element carries the STABLE available box:
  //  - hints hidden: the frame is display:contents, so the board itself
  //    (width/height 100% of its layout slot) is the right thing to read.
  //  - hints visible: the frame is a shrink-to-fit grid whose own box is a
  //    FUNCTION of the current --cell-size, so measuring it would be circular
  //    and would ratchet the cells down on every call. Read its parent, whose
  //    size never depends on --cell-size.
  const box = hintsVisible ? frame.parentElement : board;
  if (!box || !box.clientWidth || !box.clientHeight) return;
  const cols = Number(board.dataset.cols) || 1;
  const rows = Number(board.dataset.rows) || 1;
  const totalCols = hintsVisible ? cols + HINT_TRACK_RATIO : cols;
  const totalRows = hintsVisible ? rows + HINT_TRACK_RATIO : rows;
  const computed = getComputedStyle(board);
  const padX = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
  const padY = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
  const gap = parseFloat(computed.gap || computed.columnGap) || 0;
  // The strips sit one gap clear of the board (.top-hint-* margins).
  const strip = hintsVisible ? gap : 0;
  const cellFromWidth = (box.clientWidth - padX - strip - (totalCols - 1) * gap) / totalCols;
  const cellFromHeight = (box.clientHeight - padY - strip - (totalRows - 1) * gap) / totalRows;
  let cell = Math.floor(Math.min(cellFromWidth, cellFromHeight));
  cell = Math.max(MIN_BOARD_CELL, Math.min(MAX_BOARD_CELL, cell));
  // Set on the frame (an ancestor of the board either way) so the board and
  // both strips inherit one --cell-size.
  frame.style.setProperty("--cell-size", `${cell}px`);
}

function applyEdgeHints() {
  elements.numberBoardFrame.classList.toggle("show-edge-hints", state.edgeHintsVisible);
  elements.edgeHints.classList.toggle("active", state.edgeHintsVisible);
  elements.edgeHints.setAttribute("aria-pressed", String(state.edgeHintsVisible));
  requestAnimationFrame(fitNumberBoard);
}

function selectCell(x, z) {
  if (state.solved) return;
  if (currentProblem().footprint[z]?.[x] !== 1) return;
  state.selectedKey = cellKey(x, z);
  state.inputTarget = "cell";
  renderNumberBoard();
  renderAnswerSlots();
  renderNumberPad();
  updatePrompt();
  setGuide("guideCell", false);
}

/* -------------------------------------------------------------------------
   The running 합계 and the (ungraded) consistency check
   ------------------------------------------------------------------------- */
function writtenSum() {
  let sum = 0;
  state.cellAnswers.forEach((value) => { sum += value; });
  return sum;
}

function updateSum() {
  elements.sumValue.textContent = String(writtenSum());
}

// The table is a scratch aid, never a grade. When it is complete we still tell
// the child whether it agrees with the three views — a quiet "you read the
// views right" that costs them nothing if they ignore it.
function tableAgreesWithViews() {
  const problem = currentProblem();
  const [width, depth] = problem.board;
  const cells = footprintCells();
  if (!cells.every(({ key }) => state.cellAnswers.has(key))) return null;
  const map = Array.from({ length: depth }, () => Array.from({ length: width }, () => 0));
  cells.forEach(({ x, z, key }) => { map[z][x] = state.cellAnswers.get(key); });
  for (let x = 0; x < width; x += 1) {
    let max = 0;
    for (let z = 0; z < depth; z += 1) max = Math.max(max, map[z][x]);
    if (max !== problem.colMax[x]) return false;
  }
  for (let z = 0; z < depth; z += 1) {
    if (Math.max(0, ...map[z]) !== problem.rowMax[z]) return false;
  }
  return true;
}

function updateTableStatus() {
  const agrees = tableAgreesWithViews();
  elements.tableStatus.classList.toggle("clash", agrees === false);
  if (agrees === null) {
    elements.tableStatus.textContent = "";
    return;
  }
  elements.tableStatus.textContent = text(state.lang, agrees ? "tableConsistent" : "tableClash");
  // Say it out loud once per problem — repeating it on every keystroke after
  // that would nag rather than reassure.
  if (agrees && !state.tableConfirmed && !state.solved) {
    state.tableConfirmed = true;
    showToast(text(state.lang, "tableConsistent"));
    // The scratch work is done and checks out — hand the number pad to the
    // first empty answer box so the child's next digit lands where it counts.
    const pending = activeSlots().find((slot) => state.slotAnswers[slot] === "");
    if (pending) {
      selectSlot(pending);
      setGuide("answerMissing", false);
    } else {
      setGuide("tableConsistent", false);
    }
  }
}

/* -------------------------------------------------------------------------
   Answer slots — 개수 on levels 1-3, 최대 + 최소 on 4-5
   ------------------------------------------------------------------------- */
function activeSlots() {
  return isRangeMode() ? ["max", "min"] : ["count"];
}

function renderAnswerSlots() {
  elements.answerSlots.replaceChildren();
  activeSlots().forEach((slot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-slot";
    button.dataset.slot = slot;
    button.disabled = state.solved;
    button.classList.toggle("active", state.inputTarget === slot);
    button.classList.toggle("wrong", state.wrongSlots.has(slot));
    button.classList.toggle("right", state.solved);
    const label = document.createElement("span");
    label.textContent = text(state.lang, slot === "count" ? "slotCount" : slot === "max" ? "slotMax" : "slotMin");
    const value = document.createElement("strong");
    value.textContent = state.slotAnswers[slot] || "?";
    button.append(label, value);
    button.addEventListener("click", () => selectSlot(slot));
    elements.answerSlots.append(button);
  });
}

function selectSlot(slot) {
  if (state.solved) return;
  state.inputTarget = slot;
  state.selectedKey = null;
  state.wrongSlots.delete(slot);
  renderNumberBoard();
  renderAnswerSlots();
  renderNumberPad();
  updatePrompt();
}

/* -------------------------------------------------------------------------
   Number pad
   ------------------------------------------------------------------------- */
function renderNumberPad() {
  const problem = currentProblem();
  elements.numberPad.replaceChildren();
  for (let value = 0; value <= 9; value += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(value);
    // A table cell holds a stack height, so only 1..maxHeight makes sense
    // there; an answer slot takes any digit because totals reach two digits.
    button.disabled = state.solved
      || (state.inputTarget === "cell" && (value === 0 || value > problem.maxHeight));
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
      showToast(text(state.lang, "selectCell"));
      return;
    }
    if (value === 0 || value > currentProblem().maxHeight) return;
    state.cellAnswers.set(state.selectedKey, value);
    // Hop to the next unwritten footprint cell so the child can fill the whole
    // table without reaching back to the board between digits.
    const cells = footprintCells();
    const index = cells.findIndex(({ key }) => key === state.selectedKey);
    const next = [...cells.slice(index + 1), ...cells.slice(0, index)].find(({ key }) => !state.cellAnswers.has(key));
    if (next) state.selectedKey = next.key;
    renderNumberBoard();
    updateSum();
    updateTableStatus();
    renderNumberPad();
    return;
  }
  const slot = state.inputTarget;
  const next = `${state.slotAnswers[slot]}${value}`.replace(/^0+(?=\d)/, "").slice(0, 2);
  state.slotAnswers[slot] = next;
  state.wrongSlots.delete(slot);
  renderAnswerSlots();
  checkAnswer();
}

function clearInput() {
  if (state.solved) return;
  if (state.inputTarget === "cell") {
    if (!state.selectedKey) return;
    state.cellAnswers.delete(state.selectedKey);
    renderNumberBoard();
    updateSum();
    updateTableStatus();
    return;
  }
  const slot = state.inputTarget;
  state.slotAnswers[slot] = state.slotAnswers[slot].slice(0, -1);
  state.wrongSlots.delete(slot);
  renderAnswerSlots();
}

/* -------------------------------------------------------------------------
   Grading — only the 개수 / 최대 / 최소 boxes count, never the table
   ------------------------------------------------------------------------- */
function checkAnswer() {
  if (state.solved) return;
  const slots = activeSlots();
  if (!slots.every((slot) => state.slotAnswers[slot] !== "")) return;

  const problem = currentProblem();
  const expected = problem.mode === "count"
    ? { count: problem.answer.count }
    : { max: problem.answer.max, min: problem.answer.min };

  const wrong = slots.filter((slot) => Number(state.slotAnswers[slot]) !== expected[slot]);
  if (wrong.length) {
    state.wrongAttempts += 1;
    state.wrongSlots = new Set(wrong);
    const messageKey = wrong[0] === "count" ? "countWrong" : wrong[0] === "max" ? "maxWrong" : "minWrong";
    renderAnswerSlots();
    showToast(text(state.lang, messageKey));
    setGuide(messageKey, false);
    return;
  }
  completeProblem();
}

function completeProblem() {
  state.solved = true;
  state.wrongSlots = new Set();
  awardPoints(`minmax:${currentProblem().id}`, 18);
  celebrateEvolution(syncEvolution(), state.lang);
  updateLevelBadge(state.lang, { left: "25%" });
  const phrases = state.hintsUsed === 0 && state.wrongAttempts === 0
    ? ["success", "successGood", "successPop"]
    : ["success", "successGood"];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  elements.success.querySelector("strong").textContent = text(state.lang, phrase).toUpperCase();
  elements.success.classList.remove("show");
  void elements.success.offsetWidth;
  elements.success.classList.add("show");
  playSuccessBurstSound();
  setGuide(isRangeMode() ? "guideSuccessRange" : "guideSuccess", false);
  renderNumberBoard();
  renderAnswerSlots();
  renderNumberPad();
  // Only NOW is the stack shown — revealing it earlier would hand the child
  // the count they were asked to reason out.
  state.revealMode = "max";
  updateRevealBar();
  renderModel();
  setCameraView("free");
  if (isRangeMode()) {
    // Show 최대 first, then swing to 최소 so the child sees the two extremes
    // that share the very same three views. The switch stays live afterwards.
    state.revealTimer = setTimeout(() => {
      state.revealMode = "min";
      updateRevealBar();
      renderModel();
    }, 2600);
  }
  state.advanceTimer = setTimeout(() => {
    elements.success.classList.remove("show");
  }, 1250);
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

/* -------------------------------------------------------------------------
   Progressive hints. None of them ever says a total: the first points at the
   method, the second and third uncover one strip of helper numbers each.
   ------------------------------------------------------------------------- */
function giveHint() {
  if (state.solved) return;
  state.hintsUsed += 1;
  if (state.hintsUsed === 1) {
    setStage("table");
    elements.edgeHints.classList.add("pulse");
    window.setTimeout(() => elements.edgeHints.classList.remove("pulse"), 1600);
    showToast(text(state.lang, "guideHintMethod"));
    setGuide("guideHintMethod");
    return;
  }
  if (!state.edgeHintsVisible) setEdgeHints(true);
  setStage("table");
  const strip = state.hintsUsed === 2 ? elements.numberHintBottom : elements.numberHintRight;
  flashHintStrip(strip);
  const key = state.hintsUsed === 2 ? "guideHintBottom" : "guideHintRight";
  showToast(text(state.lang, key));
  setGuide(key);
}

function flashHintStrip(strip) {
  [...strip.children].forEach((cell) => {
    cell.classList.remove("hint");
    void cell.offsetWidth;
    cell.classList.add("hint");
  });
}

function setEdgeHints(visible) {
  state.edgeHintsVisible = visible;
  localStorage.setItem(edgeHintsStorageKey, String(visible));
  applyEdgeHints();
  // Numbers appearing on two edges mean nothing until someone says where they
  // came from, so explain it the moment they are switched on.
  if (visible && !state.solved) setGuide("guideTable", false);
}

/* -------------------------------------------------------------------------
   Compact-landscape stage tabs
   ------------------------------------------------------------------------- */
function setStage(stage) {
  state.stage = stage;
  elements.minmaxStage.dataset.stage = stage;
  [...elements.stageTabs.querySelectorAll("button")].forEach((button) => {
    const active = button.dataset.stage === stage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  // Whichever section just came on screen has a real box only now.
  requestAnimationFrame(() => { fitViewCells(); fitNumberBoard(); });
}

/* -------------------------------------------------------------------------
   Level list
   ------------------------------------------------------------------------- */
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
      localStorage.setItem("minmax-level", String(index));
      elements.levelDialog.hidden = true;
      loadProblem();
    });
    elements.levelList.append(button);
  });
}

/* =========================================================================
   Three.js — the hidden case, then the reveal
   ========================================================================= */
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

// Same limits every Cube Town game uses, so the drag/zoom feel carries over.
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
const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry, 28);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x8b6840, transparent: true, opacity: 0.18 });

function clearModel() {
  modelGroup.traverse((object) => {
    if (object.material && object.material !== cubeMaterial && object.material !== edgeMaterial) object.material.map?.dispose?.();
    if (object.material && object.material !== cubeMaterial && object.material !== edgeMaterial) object.material.dispose?.();
    if (object.geometry && object.geometry !== cubeGeometry && object.geometry !== edgeGeometry) object.geometry.dispose?.();
  });
  modelGroup.clear();
}

// Draws one silhouette grid to a canvas so it can hang on the matching face
// of the hidden case: the 앞 grid on the front pane, 오른쪽 옆 on the right,
// 위 on the lid. Seeing the flat drawing sit on the direction it came from is
// the whole point of the reference scene.
function makeViewPlane(grid, cellPx = 64) {
  const rows = grid.length;
  const cols = grid[0].length;
  const canvas = document.createElement("canvas");
  canvas.width = cols * cellPx;
  canvas.height = rows * cellPx;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  const inset = Math.round(cellPx * 0.06);
  grid.forEach((row, r) => row.forEach((filled, c) => {
    const x = c * cellPx + inset;
    const y = r * cellPx + inset;
    const size = cellPx - inset * 2;
    context.fillStyle = filled ? "rgba(60, 87, 136, 0.88)" : "rgba(255, 253, 247, 0.62)";
    context.fillRect(x, y, size, size);
    context.strokeStyle = filled ? "rgba(28, 44, 78, 0.95)" : "rgba(154, 122, 78, 0.55)";
    context.lineWidth = Math.max(2, cellPx * 0.05);
    context.strokeRect(x, y, size, size);
  }));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.94,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(cols, rows), material);
  mesh.renderOrder = 12;
  return mesh;
}

function makeQuestionSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.beginPath();
  context.arc(128, 128, 92, 0, Math.PI * 2);
  context.fillStyle = "rgba(255, 250, 240, 0.95)";
  context.fill();
  context.lineWidth = 10;
  context.strokeStyle = "#b7792f";
  context.stroke();
  context.fillStyle = "#6b4423";
  context.font = "900 150px 'Noto Sans KR', sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("?", 128, 140);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.scale.set(1.5, 1.5, 1);
  sprite.renderOrder = 40;
  return sprite;
}

function buildTray(width, depth, gridSize) {
  const traySize = gridSize + 1.96;
  const railSpan = gridSize + 1.32;
  const railOffset = gridSize / 2 + 0.62;

  const board = new THREE.Mesh(
    new RoundedBoxGeometry(traySize, 0.24, traySize, 8, 0.18),
    new THREE.MeshStandardMaterial({
      map: boardWoodTexture,
      color: 0xe7c28e,
      roughness: 0.58,
      metalness: 0.01,
      bumpMap: boardWoodTexture,
      bumpScale: 0.01
    })
  );
  board.position.y = -0.15;
  board.receiveShadow = true;
  board.castShadow = true;
  modelGroup.add(board);

  const railMaterial = new THREE.MeshStandardMaterial({
    map: boardWoodTexture,
    color: 0xd0a36b,
    roughness: 0.58,
    metalness: 0.01,
    bumpMap: boardWoodTexture,
    bumpScale: 0.009
  });
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
    new THREE.MeshStandardMaterial({
      map: insetWoodTexture,
      color: 0xdbe2d7,
      roughness: 0.9,
      bumpMap: insetWoodTexture,
      bumpScale: 0.0025
    })
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
}

// The pre-answer scene: a glass case over the tray with the three silhouettes
// hung on the faces they were drawn from, and a big "?" where the stack would
// be. Deliberately shows NO cubes — the count is exactly what the child is
// being asked to work out.
function buildHiddenCase(problem, gridSize) {
  const caseHeight = problem.height + 0.5;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(gridSize + 0.18, caseHeight, gridSize + 0.18),
    // Plain transparency, deliberately NOT MeshPhysicalMaterial's `transmission`:
    // real transmission forces an extra full-scene render target every frame,
    // far too expensive for the phones and school tablets this runs on. At 14%
    // opacity the glass reads the same either way.
    new THREE.MeshStandardMaterial({
      color: 0xdcecf4,
      transparent: true,
      opacity: 0.14,
      roughness: 0.2,
      metalness: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  box.position.y = caseHeight / 2 + 0.03;
  modelGroup.add(box);

  const outline = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(gridSize + 0.18, caseHeight, gridSize + 0.18)),
    new THREE.LineBasicMaterial({ color: 0x7a97a8, transparent: true, opacity: 0.75 })
  );
  outline.position.copy(box.position);
  modelGroup.add(outline);

  const half = gridSize / 2;
  // front (앞): faces +z, local +x → world +x, local +y → world +y.
  const front = makeViewPlane(problem.views.front);
  front.position.set(0, problem.height / 2 + 0.03, half + 0.14);
  modelGroup.add(front);
  // right (오른쪽 옆): rotated so local +x → world −z, which puts the view's
  // first column on the FRONT edge — the convention levels.js draws it with.
  const side = makeViewPlane(problem.views.side);
  side.rotation.y = Math.PI / 2;
  side.position.set(half + 0.14, problem.height / 2 + 0.03, 0);
  modelGroup.add(side);
  // top (위): rotated so local +y → world −z, putting the view's first row at
  // the BACK of the tray, matching map[z=0].
  const top = makeViewPlane(problem.views.top);
  top.rotation.x = -Math.PI / 2;
  top.position.set(0, caseHeight + 0.12, 0);
  modelGroup.add(top);

  const question = makeQuestionSprite();
  question.position.set(0, caseHeight / 2 + 0.03, 0);
  modelGroup.add(question);
}

function revealMap() {
  const problem = currentProblem();
  if (!isRangeMode()) return problem.solutions.minMap || problem.heights;
  return state.revealMode === "min"
    ? (problem.solutions.minMap || problem.heights)
    : (problem.solutions.maxMap || problem.heights);
}

function buildStack(map, width, depth) {
  const centerX = (width - 1) / 2;
  const centerZ = (depth - 1) / 2;
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      const height = map[z][x];
      for (let y = 0; y < height; y += 1) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x - centerX, y + 0.5, z - centerZ);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
        modelGroup.add(cube);
      }
    }
  }
}

function renderModel() {
  clearModel();
  const problem = currentProblem();
  const [width, depth] = problem.board;
  const gridSize = Math.max(width, depth);
  buildTray(width, depth, gridSize);
  if (state.solved) {
    buildStack(revealMap(), width, depth);
    // Restart the drop-in each time the reveal switches, so flipping between
    // 최대 and 최소 reads as two different builds rather than a silent swap.
    modelGroup.userData.dropStartedAt = performance.now();
  } else {
    buildHiddenCase(problem, gridSize);
    modelGroup.userData.dropStartedAt = 0;
  }
  controls.target.set(0, Math.min(1.9, problem.height * 0.42 + 0.4), 0);
  controls.update();
}

function updateRevealBar() {
  const rangeReveal = state.solved && isRangeMode();
  elements.revealSwitch.hidden = !rangeReveal;
  elements.revealMaxBtn.classList.toggle("active", state.revealMode === "max");
  elements.revealMinBtn.classList.toggle("active", state.revealMode === "min");
  elements.viewerTitle.textContent = text(state.lang, state.solved ? "revealTitle" : "modelTitle");
  elements.revealCaption.textContent = state.solved
    ? text(state.lang, rangeReveal ? "revealTitle" : "revealOne")
    : text(state.lang, "hiddenCase");
  elements.revealCaption.hidden = rangeReveal;
}

function setRevealMode(mode) {
  if (!state.solved || !isRangeMode()) return;
  clearTimeout(state.revealTimer);
  state.revealMode = mode;
  updateRevealBar();
  renderModel();
}

function setCameraView(view) {
  const max = currentProblem().height;
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
// Separate observers for the two measured boards: orientation changes and
// browser-chrome shifts resize them independently of the 3D scene, and with
// the hint strips showing it is the FRAME's parent that carries the box.
new ResizeObserver(fitNumberBoard).observe(elements.numberBoard);
new ResizeObserver(fitNumberBoard).observe(elements.numberBoardFrame);
new ResizeObserver(fitViewCells).observe(elements.viewsRow);

function animate() {
  const time = performance.now() * 0.001;
  sunlight.position.x = 5 + Math.sin(time * 0.32) * 0.42;
  sunlight.position.z = 4 + Math.cos(time * 0.28) * 0.34;
  // Reveal animation: the stack drops in over ~0.5s. Driven from the render
  // loop (rather than a tween library) to stay dependency-free like the rest
  // of Cube Town.
  const startedAt = modelGroup.userData.dropStartedAt || 0;
  if (startedAt) {
    const progress = Math.min(1, (performance.now() - startedAt) / 520);
    const eased = 1 - Math.pow(1 - progress, 3);
    modelGroup.scale.setScalar(0.82 + eased * 0.18);
    modelGroup.position.y = (1 - eased) * 1.4;
    if (progress >= 1) modelGroup.userData.dropStartedAt = 0;
  } else {
    modelGroup.scale.setScalar(1);
    modelGroup.position.y = 0;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

/* -------------------------------------------------------------------------
   Wiring
   ------------------------------------------------------------------------- */
[...elements.stageTabs.querySelectorAll("button")].forEach((button) => {
  button.addEventListener("click", () => setStage(button.dataset.stage));
});
elements.edgeHints.addEventListener("click", () => setEdgeHints(!state.edgeHintsVisible));
elements.conceptNext.addEventListener("click", advanceConceptTutorial);
elements.hint.addEventListener("click", giveHint);
elements.reset.addEventListener("click", resetProblem);
elements.next.addEventListener("click", nextProblem);
elements.revealMaxBtn.addEventListener("click", () => setRevealMode("max"));
elements.revealMinBtn.addEventListener("click", () => setRevealMode("min"));
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
$$("[data-view]").forEach((button) => button.addEventListener("click", () => setCameraView(button.dataset.view)));
$$("[data-lang]").forEach((button) => button.addEventListener("click", () => {
  state.lang = button.dataset.lang;
  localStorage.setItem("gfield-language", state.lang);
  applyLanguage();
}));
window.addEventListener("keydown", (event) => {
  if (!elements.levelDialog.hidden) return;
  if (state.tutorialStep >= 0) return;
  if (/^[0-9]$/.test(event.key)) enterNumber(Number(event.key));
  if (event.key === "Backspace" || event.key === "Delete") clearInput();
});

applyLanguage();
renderLevelList();
setStage("table");
loadProblem();
resizeScene();
syncEvolution();                            // normalize/migrate on load (silent)
updateLevelBadge(state.lang, { left: "25%" }); // persistent top level badge
