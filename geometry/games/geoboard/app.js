/* =========================================================================
   점판 공작소 (Geoboard Studio) — game engine.

   House rules encoded here (owner's handoff + docs/12_*.md section 5):
   - ONE kind of answer action on the whole game: TAP A PEG. There is no submit
     button, no drag, no rotate and no undo-by-a-different-gesture, because any of
     those would be a second kind of answer on the same screen. "고무줄 풀기" is a
     tool button beside 힌트, exactly like Mirror Manor's 다시.
   - Cubi speaks in three places only: the first-visit tutorial, a hint the child
     opened, and level completion. Every ordinary tap gets a short blip instead.
   - A wrong action never plays praise audio and never points at the answer. It
     names the RULE that was broken (자기 교차 / 겹친 선 / 중복 꼭짓점 / 열린 모양)
     and marks the offending band or peg red immediately.
   - Success shows one of GOOD JOB! / GREAT JOB! / SUCCESS! for about a second.
   - Storage: the tutorial flag `gfield-geoboard-tutorial-v1`, this game's own
     record inside the shared profile under PROGRESS_KEY, and the already-shared
     keys every game uses (`gfield-language`, `gfield-audio-muted`, `gfield-points`,
     `gfield-rewarded-games`). `gfield-profile` is only ever read-modify-written by
     shared/profile-storage.js, so no other game's progress can be clobbered.
   ========================================================================= */

import {
  levels, readyLevels, validateLevels, GAME_ID, PROGRESS_KEY,
  samePoint, pointKey, targetPoints, acceptsAnswer,
  isClosed, vertexCount, edgeCount,
  pointOnSegment, segmentsIntersect
} from "./levels.js?v=geoboard-2";
import { messages, text } from "./i18n.js?v=geoboard-2";
import { sessionProblems } from "../../shared/problem-pool.js";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";

// Throws before a single peg is drawn if the pool is broken, so a bad problem can
// never reach a child.
validateLevels();

const SVG_NS = "http://www.w3.org/2000/svg";
const $ = (selector) => document.querySelector(selector);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const params = new URLSearchParams(location.search);
const saved = readGameProgress(PROGRESS_KEY);
const SESSION_SIZE = 5;
const TUTORIAL_KEY = "gfield-geoboard-tutorial-v1";

const storedLanguage = localStorage.getItem("gfield-language") || "ko";
const language = Object.keys(messages).includes(storedLanguage) ? storedLanguage : "ko";

// Levels 3-5 exist in the table but ship no problems yet, so a ?level=4 link (or an
// old saved record) falls back to the highest level that is actually ready.
const highestReady = readyLevels[readyLevels.length - 1].id;
const askedLevel = Number(params.get("level")) || Number(saved.level) || 1;
const startLevel = levels.find((level) => level.id === askedLevel)?.ready ? askedLevel : Math.min(Math.max(1, askedLevel), highestReady);

const state = {
  level: startLevel,
  problem: 0,
  queue: [],
  path: [],        // pegs the child has tapped, in order
  closed: false,   // set when the child taps the first peg again (level 2 only)
  locked: false,   // true while a wrong figure is flashing before it clears
  solved: false,
  wrong: 0,
  hints: 0,
  audio: localStorage.getItem("gfield-audio-muted") !== "true",
  lang: language
};

const ui = {
  board: $("#board"), bands: $("#bandLayer"), pegs: $("#pegLayer"), hits: $("#hitLayer"),
  model: $("#modelBoard"), modelShape: $("#modelShape"),
  prompt: $("#prompt"), answerPrompt: $("#answerPrompt"), stats: $("#shapeStats"), next: $("#nextButton"),
  guide: $("#cubiGuide"), bubble: $("#guideBubble"), toast: $("#toast"), success: $("#success"),
  tutorial: $("#tutorial"), tutorialText: $("#tutorialText"), tutorialDots: $("#tutorialDots"), tutorialNext: $("#tutorialNext"),
  tutorialDemo: $("#tutorialDemoLayer"), tutorialPegs: $("#tutorialPegLayer"),
  levelDialog: $("#levelDialog"), levelList: $("#levelList"), complete: $("#completeDialog")
};

const t = (key, vars) => text(state.lang, key, vars);
const levelData = () => levels.find((level) => level.id === state.level);
const problem = () => state.queue[state.problem];

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
    oscillator.frequency.value = kind === "success" ? 760 : kind === "wrong" ? 180 : kind === "close" ? 620 : 440;
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

/* ------------------------------------------------------------- svg geometry */

// Pegs are laid out on the 0..100 viewBox at the centre of each lattice cell, so
// the outermost pegs keep half a cell of padding and their finger targets never
// spill off the board edge.
const stepX = (grid) => 100 / grid.cols;
const stepY = (grid) => 100 / grid.rows;
const pegX = (x, grid) => stepX(grid) * (x + .5);
const pegY = (y, grid) => stepY(grid) * (y + .5);

// Finger target radius in viewBox units. The hit circle is 19% of the board's
// width, so at 844x390 (board 218px, measured in a headless browser) it is a 41.5px
// target and at 740x360 it is 38.3px — both clear of the 30px floor the house rules
// set for a phone. The DRAWN peg stays small (2.8) so the board still reads as a
// lattice of points rather than a grid of buttons.
const HIT_RADIUS = 9.5;
const PEG_RADIUS = 2.8;

function svgNode(name, attributes) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

/* ----------------------------------------------------------------- drawing */

/** Draw one figure (edges + corner dots) into a layer. Shared by board and model. */
function drawFigure(layer, points, grid, options) {
  const closed = isClosed(points);
  const settings = options || {};
  if (closed && points.length >= 4) {
    layer.append(svgNode("polygon", {
      class: `band-fill${settings.solved ? " solved" : ""}`,
      points: points.slice(0, -1).map((point) => `${pegX(point[0], grid)},${pegY(point[1], grid)}`).join(" ")
    }));
  }
  for (let index = 0; index + 1 < points.length; index += 1) {
    const a = points[index];
    const b = points[index + 1];
    layer.append(svgNode("line", {
      class: `band${settings.solved ? " solved" : ""}${settings.badEdge === index ? " bad" : ""}`,
      "data-edge": index,
      x1: pegX(a[0], grid), y1: pegY(a[1], grid), x2: pegX(b[0], grid), y2: pegY(b[1], grid)
    }));
  }
  points.forEach((point, index) => {
    if (closed && index === points.length - 1) return;
    layer.append(svgNode("circle", {
      class: `band-node${index === 0 ? " start" : ""}${settings.solved ? " solved" : ""}`,
      cx: pegX(point[0], grid), cy: pegY(point[1], grid), r: PEG_RADIUS * 1.5
    }));
  });
}

function renderBoard() {
  const p = problem();
  const grid = p.grid;
  ui.board.setAttribute("aria-label", `${t("boardAria")} ${grid.cols} x ${grid.rows}`);

  ui.pegs.replaceChildren();
  for (let y = 0; y < grid.rows; y += 1) {
    for (let x = 0; x < grid.cols; x += 1) {
      ui.pegs.append(svgNode("circle", { class: "peg", cx: pegX(x, grid), cy: pegY(y, grid), r: PEG_RADIUS }));
    }
  }

  ui.bands.replaceChildren();
  drawFigure(ui.bands, currentPoints(), grid, { solved: state.solved });

  renderHits();
}

/** The child's figure as an explicit point list (closing peg repeated when closed). */
function currentPoints() {
  if (state.path.length === 0) return [];
  return state.closed ? [...state.path, state.path[0]] : [...state.path];
}

/**
 * Invisible finger targets. They are <circle> elements with a transparent fill (not
 * `fill:none`), which is what makes an SVG shape hit-testable while staying unseen.
 */
function renderHits() {
  const p = problem();
  const grid = p.grid;
  // Every tap rebuilds this layer, which would otherwise throw a keyboard user back
  // to the top of the page, so the focused peg is remembered and restored.
  const focused = document.activeElement?.classList?.contains("peg-hit")
    ? [document.activeElement.dataset.x, document.activeElement.dataset.y]
    : null;
  ui.hits.replaceChildren();
  for (let y = 0; y < grid.rows; y += 1) {
    for (let x = 0; x < grid.cols; x += 1) {
      const used = state.path.some((point) => samePoint(point, [x, y]));
      const isStart = state.path.length > 0 && samePoint(state.path[0], [x, y]);
      const node = svgNode("circle", {
        class: "peg-hit",
        cx: pegX(x, grid), cy: pegY(y, grid), r: HIT_RADIUS,
        "data-x": x, "data-y": y,
        role: "button", tabindex: state.solved ? -1 : 0,
        "aria-label": `${t("pegAria", { row: y + 1, col: x + 1 })} ${isStart ? t("pegStart") : used ? t("pegUsed") : t("pegFree")}`
      });
      ui.hits.append(node);
    }
  }
  if (focused) ui.hits.querySelector(`.peg-hit[data-x="${focused[0]}"][data-y="${focused[1]}"]`)?.focus?.();
}

function renderModel() {
  const p = problem();
  const grid = p.grid;
  ui.model.replaceChildren();
  ui.model.setAttribute("aria-label", `${t("modelAria")} — ${t(p.shapeNameKey)}`);
  ui.model.append(svgNode("rect", { class: "model-face", x: 0, y: 0, width: 100, height: 100, rx: 4 }));
  for (let y = 0; y < grid.rows; y += 1) {
    for (let x = 0; x < grid.cols; x += 1) {
      ui.model.append(svgNode("circle", { class: "peg model", cx: pegX(x, grid), cy: pegY(y, grid), r: PEG_RADIUS }));
    }
  }
  const layer = svgNode("g", { class: "model-band" });
  drawFigure(layer, targetPoints(p), grid, {});
  ui.model.append(layer);
  ui.modelShape.textContent = t(p.shapeNameKey);
}

/* ------------------------------------------------------- rule enforcement */

const edgeId = (a, b) => [pointKey(a), pointKey(b)].sort().join("-");

function currentEdges() {
  const points = currentPoints();
  const edges = [];
  for (let index = 0; index + 1 < points.length; index += 1) edges.push([points[index], points[index + 1]]);
  return edges;
}

/**
 * Would stretching a band from the last peg to `target` touch a band that is
 * already on the board? Returns the index of the offending edge so it can be
 * marked red, or -1. Neighbouring edges are allowed to meet at their shared peg
 * and nowhere else, which is the same rule hasSelfIntersection() applies to a
 * finished figure — this is its incremental twin, used while the child builds.
 */
function conflictingEdge(from, target) {
  const edges = currentEdges();
  for (let index = 0; index < edges.length; index += 1) {
    const [a, b] = edges[index];
    const adjacent = index === edges.length - 1; // shares the peg the new band starts at
    if (adjacent) {
      if (pointOnSegment(target, a, b) || pointOnSegment(a, from, target)) return index;
      continue;
    }
    if (segmentsIntersect(a, b, from, target)) return index;
  }
  return -1;
}

/**
 * Same question for the closing band, which meets TWO existing edges at its two
 * ends: the last edge (at the peg it leaves) and the first edge (at the peg it
 * returns to). Each of those may touch it only at that shared peg.
 */
function conflictingClosingEdge() {
  const edges = currentEdges();
  const from = state.path[state.path.length - 1];
  const target = state.path[0];
  for (let index = 0; index < edges.length; index += 1) {
    const [a, b] = edges[index];
    if (index === edges.length - 1) {
      // Shares `from`, which is this edge's second peg.
      if (pointOnSegment(target, a, b) || pointOnSegment(a, from, target)) return index;
      continue;
    }
    if (index === 0) {
      // Shares `target`, which is this edge's first peg.
      if (pointOnSegment(from, a, b) || pointOnSegment(b, from, target)) return index;
      continue;
    }
    if (segmentsIntersect(a, b, from, target)) return index;
  }
  return -1;
}

/**
 * Report a broken rule. Never praise, never reveal the answer: the child is told
 * only WHICH rule the tap broke, and the offending band or peg flashes red.
 */
function reportWrong(messageKey, marks) {
  state.wrong += 1;
  playTone("wrong");
  toast(t(messageKey));
  const flagged = marks || {};
  if (typeof flagged.edge === "number" && flagged.edge >= 0) {
    const node = ui.bands.querySelector(`line[data-edge="${flagged.edge}"]`);
    node?.classList.add("bad");
    setTimeout(() => node?.classList.remove("bad"), 620);
  }
  if (flagged.peg) {
    const [x, y] = flagged.peg;
    const p = problem();
    const marker = svgNode("circle", { class: "peg-flag", cx: pegX(x, p.grid), cy: pegY(y, p.grid), r: PEG_RADIUS * 2.1 });
    ui.bands.append(marker);
    setTimeout(() => marker.remove(), 620);
  }
  if (flagged.ghost) {
    const p = problem();
    const [a, b] = flagged.ghost;
    const ghost = svgNode("line", {
      class: "band ghost bad",
      x1: pegX(a[0], p.grid), y1: pegY(a[1], p.grid), x2: pegX(b[0], p.grid), y2: pegY(b[1], p.grid)
    });
    ui.bands.append(ghost);
    setTimeout(() => ghost.remove(), 620);
  }
}

/* ------------------------------------------------------------- tap handling */

function onPegTap(x, y) {
  if (state.solved || state.locked) return;
  const p = problem();
  const target = [x, y];
  const path = state.path;
  const wanted = p.vertices.length;

  if (path.length === 0) {
    path.push(target);
    playTone("tap");
    refresh();
    return;
  }

  const last = path[path.length - 1];
  const first = path[0];

  // Zero-length band: the child tapped the peg the band is already sitting on.
  if (samePoint(last, target)) return reportWrong("wrongSamePeg", { peg: target });

  if (samePoint(first, target)) {
    // Closing. Level 1's rule in force is "the shape must stay OPEN", so closing is
    // refused there instead of being silently accepted as a different figure.
    if (p.kind === "open") return reportWrong("wrongOpenOnly", { peg: target, ghost: [last, first] });
    if (path.length < 3) return reportWrong("wrongNeedThree", { peg: target });
    if (currentEdges().some(([a, b]) => edgeId(a, b) === edgeId(last, first))) {
      return reportWrong("wrongDupEdge", { peg: target, ghost: [last, first] });
    }
    const clash = conflictingClosingEdge();
    if (clash >= 0) return reportWrong("wrongCrossing", { edge: clash, ghost: [last, first] });
    state.closed = true;
    playTone("close");
    refresh();
    judge();
    return;
  }

  // Repeated vertex, and the special case where re-using a peg would also lay a
  // second band on top of one that is already there.
  if (path.some((point) => samePoint(point, target))) {
    if (currentEdges().some(([a, b]) => edgeId(a, b) === edgeId(last, target))) {
      return reportWrong("wrongDupEdge", { peg: target, ghost: [last, target] });
    }
    return reportWrong("wrongRepeatVertex", { peg: target });
  }

  const clash = conflictingEdge(last, target);
  if (clash >= 0) return reportWrong("wrongCrossing", { edge: clash, ghost: [last, target] });

  // A closed figure cannot grow past its model's corner count; the only tap left is
  // the first peg. This states the RULE, not the answer — the model already shows
  // how many corners the shape has.
  if (p.kind === "closed" && path.length >= wanted) return reportWrong("wrongCloseNow", { peg: target });

  path.push(target);
  playTone("tap");
  refresh();

  // An open path is finished the moment it has as many pegs as the model.
  if (p.kind === "open" && path.length === wanted) judge();
}

function judge() {
  const p = problem();
  const points = currentPoints();
  if (acceptsAnswer(p, points)) return solveProblem();

  // The figure obeys every rule but is not the model. Flash it, then clear the band
  // so the child starts the same way they started the first time: by tapping a peg.
  state.wrong += 1;
  state.locked = true;
  playTone("wrong");
  toast(t("wrongShape"));
  ui.bands.querySelectorAll(".band, .band-fill").forEach((node) => node.classList.add("bad"));
  setTimeout(() => {
    state.locked = false;
    clearBand();
  }, 900);
}

function clearBand() {
  state.path = [];
  state.closed = false;
  refresh();
}

function solveProblem() {
  state.solved = true;
  rewardProblem();
  playTone("success");
  showSuccess();
  refresh();
}

function showSuccess() {
  const words = ["successGood", "successGreat", "successPop"];
  ui.success.querySelector("strong").textContent = t(words[state.problem % words.length]);
  ui.success.classList.remove("show");
  void ui.success.offsetWidth;
  ui.success.classList.add("show");
}

// Points follow paper-fold exactly: one award per problem id ever, and only for a
// clean solve. The shared keys are read-modify-written, never replaced wholesale,
// and no other game's record is touched.
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
  const points = currentPoints();
  $("#levelLabel").textContent = t("levelLabel", { level: level.id });
  $("#problemLabel").textContent = `${state.problem + 1} / ${state.queue.length}`;
  $("#missionTitle").textContent = t(level.titleKey);
  $("#stars").textContent = "*".repeat(level.id) + "-".repeat(5 - level.id);
  ui.prompt.textContent = t(p.kind === "open" ? "promptOpen" : "promptClosed");
  ui.answerPrompt.textContent = t(p.kind === "open" ? "progressOpen" : "progressClosed", {
    done: state.path.length, total: p.vertices.length
  });

  // Live corner and side counts, straight from the exported pure helpers. They are
  // the vocabulary level 3 will ask about, so the child meets the words early.
  ui.stats.replaceChildren();
  [["statVertices", vertexCount(points)], ["statEdges", edgeCount(points)]].forEach(([key, count]) => {
    const chip = document.createElement("b");
    chip.textContent = t(key, { count });
    ui.stats.append(chip);
  });

  ui.next.hidden = !state.solved;
}

/** One redraw path for every state change, so the SVG can never fall out of sync. */
function refresh() {
  renderBoard();
  renderStatus();
}

function resetProblem() {
  state.path = [];
  state.closed = false;
  state.locked = false;
  state.solved = false;
  state.wrong = 0;
  state.hints = 0;
  ui.guide.classList.remove("show");
  renderModel();
  refresh();
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

const tutorialSteps = ["tutorial1", "tutorial2", "tutorial3", "tutorial4"];
let tutorialStep = 0;
let tutorialReturnFocus = null;

const tutorialPeg = (x, y, active, delay) => {
  const peg = svgNode("circle", { class: `tutorial-demo-peg${active ? " active" : ""}`, cx: x, cy: y, r: 4 });
  if (delay) peg.style.setProperty("--delay", delay);
  return peg;
};

function tutorialLine(a, b, delay, bad) {
  const line = svgNode("line", {
    class: `tutorial-demo-band${bad ? " bad" : ""}`,
    x1: a[0], y1: a[1], x2: b[0], y2: b[1], pathLength: 100
  });
  line.style.setProperty("--delay", delay);
  return line;
}

function tutorialTap(x, y, delay) {
  const tap = svgNode("circle", { class: "tutorial-demo-tap", cx: x, cy: y, r: 7 });
  tap.style.setProperty("--delay", delay);
  return tap;
}

function renderTutorialDemo() {
  ui.tutorialDemo.replaceChildren();
  ui.tutorialPegs.replaceChildren();
  const coords = [18, 39, 61, 82];
  coords.forEach((y, row) => coords.forEach((x, col) => {
    const sequence = tutorialStep === 0 && (row === 1 || row === 2) && (col === 1 || col === 2);
    ui.tutorialPegs.append(tutorialPeg(x, y, sequence, `${(row + col) * .16}s`));
  }));

  if (tutorialStep === 0) return;
  if (tutorialStep === 1) {
    ui.tutorialDemo.append(tutorialLine([39, 61], [82, 39], ".65s"));
    ui.tutorialDemo.append(tutorialTap(39, 61, "0s"), tutorialTap(82, 39, "1.05s"));
    return;
  }
  if (tutorialStep === 2) {
    ui.tutorialDemo.append(tutorialLine([18, 18], [82, 82], ".1s"));
    ui.tutorialDemo.append(tutorialLine([82, 18], [18, 82], ".8s", true));
    ui.tutorialDemo.append(tutorialTap(82, 18, ".35s"), tutorialTap(18, 82, "1.05s"));
    return;
  }

  const triangle = [[39, 82], [61, 39], [82, 82]];
  const fill = svgNode("polygon", {
    class: "tutorial-demo-fill",
    points: triangle.map((point) => point.join(",")).join(" ")
  });
  fill.style.setProperty("--delay", "1.85s");
  ui.tutorialDemo.append(fill);
  ui.tutorialDemo.append(tutorialLine(triangle[0], triangle[1], ".1s"));
  ui.tutorialDemo.append(tutorialLine(triangle[1], triangle[2], ".7s"));
  ui.tutorialDemo.append(tutorialLine(triangle[2], triangle[0], "1.3s"));
  ui.tutorialDemo.append(tutorialTap(triangle[0][0], triangle[0][1], "0s"));
  ui.tutorialDemo.append(tutorialTap(triangle[1][0], triangle[1][1], ".6s"));
  ui.tutorialDemo.append(tutorialTap(triangle[2][0], triangle[2][1], "1.2s"));
  ui.tutorialDemo.append(tutorialTap(triangle[0][0], triangle[0][1], "1.8s"));
}

// Only on the very first problem of a first visit — never again on this device.
function openTutorial() {
  if (state.problem !== 0 || state.level !== readyLevels[0].id) return;
  if (localStorage.getItem(TUTORIAL_KEY) === "done") return;
  tutorialReturnFocus = document.activeElement;
  ui.tutorial.hidden = false;
  renderTutorial();
  queueMicrotask(() => ui.tutorialNext.focus());
}

function renderTutorial() {
  const line = t(tutorialSteps[tutorialStep]);
  ui.tutorialText.textContent = line;
  renderTutorialDemo();
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
  $("#modelLabel").textContent = t("modelLabel");
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

// One delegated listener for the whole hit layer: pointerdown fires before any
// synthetic click, which keeps the band responsive on a touch screen.
ui.hits.addEventListener("pointerdown", (event) => {
  const node = event.target.closest(".peg-hit");
  if (!node) return;
  event.preventDefault();
  onPegTap(Number(node.dataset.x), Number(node.dataset.y));
});
// Keyboard users get the same single action on the same targets.
ui.hits.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const node = event.target.closest(".peg-hit");
  if (!node) return;
  event.preventDefault();
  onPegTap(Number(node.dataset.x), Number(node.dataset.y));
});

$("#hintButton").addEventListener("click", () => {
  state.hints += 1;
  cubiSays(t(problem().kind === "open" ? "hintOpen" : "hintClosed"));
});
$("#retryButton").addEventListener("click", () => {
  if (state.solved) return;
  state.locked = false;
  clearBand();
});
ui.next.addEventListener("click", nextProblem);
$("#levelButton").addEventListener("click", () => { ui.levelDialog.hidden = false; });
$("#closeLevels").addEventListener("click", () => { ui.levelDialog.hidden = true; });
ui.levelDialog.addEventListener("click", (event) => { if (event.target === ui.levelDialog) ui.levelDialog.hidden = true; });
ui.tutorialNext.addEventListener("click", () => {
  if (tutorialStep < tutorialSteps.length - 1) { tutorialStep += 1; renderTutorial(); return; }
  localStorage.setItem(TUTORIAL_KEY, "done");
  ui.tutorial.hidden = true;
  cubiSays(t("guideStart"));
  const target = tutorialReturnFocus instanceof HTMLElement && tutorialReturnFocus !== document.body
    ? tutorialReturnFocus
    : ui.hits.querySelector(".peg-hit");
  target?.focus();
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
renderModel();
refresh();
setTimeout(openTutorial, 200);
