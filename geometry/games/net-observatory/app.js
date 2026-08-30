import { levels, validateLevels, GAME_ID, PROGRESS_KEY } from "./levels.js?v=net-5";
import { messages, text } from "./i18n.js?v=net-5";
import { NetFoldViewer } from "./fold-view.js?v=net-5";
import { sessionProblems } from "../../shared/problem-pool.js";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const storedLanguage = localStorage.getItem("gfield-language") || "ko";
const language = Object.hasOwn(messages, storedLanguage) ? storedLanguage : "ko";
const saved = readGameProgress(PROGRESS_KEY);
const SESSION_SIZE = 5;
const TUTORIAL_KEY = "gfield-net-observatory-tutorial-v1";
const SUCCESS_WORDS = ["GOOD JOB!", "GREAT JOB!", "SUCCESS!"];

const requestedLevel = Number(params.get("level")) || Number(saved.level) || 1;
const state = {
  level: Math.min(levels.length, Math.max(1, requestedLevel)), problemIndex: 0, queue: [], solved: false,
  folded: false, hints: 0, wrong: 0, lang: language,
  audio: localStorage.getItem("gfield-audio-muted") !== "true", viewer: null, choiceViewers: [], autoNextTimer: null
};

const ui = {
  stage: $("#stage"), choices: $("#choices"), prompt: $("#prompt"), answerPrompt: $("#answerPrompt"),
  fold: $("#foldButton"), hint: $("#hintButton"), next: $("#nextButton"), toast: $("#toast"),
  success: $("#success"), guide: $("#cubiGuide"), bubble: $("#guideBubble"),
  tutorial: $("#tutorial"), tutorialText: $("#tutorialText"), tutorialDots: $("#tutorialDots"),
  tutorialNext: $("#tutorialNext"), tutorialSkip: $("#tutorialSkip"),
  levelDialog: $("#levelDialog"), levelList: $("#levelList"), complete: $("#completeDialog")
};

const t = (key, vars) => text(state.lang, key, vars);
const level = () => levels[state.level - 1];
const problem = () => state.queue[state.problemIndex];
const modalReturnFocus = new WeakMap();

function focusableWithin(dialog) {
  return [...dialog.querySelectorAll("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])")]
    .filter((node) => !node.hidden && node.getClientRects().length);
}

function showModal(dialog) {
  modalReturnFocus.set(dialog, document.activeElement);
  dialog.hidden = false;
  requestAnimationFrame(() => focusableWithin(dialog)[0]?.focus({ preventScroll: true }));
}

function hideModal(dialog, restore = true) {
  dialog.hidden = true;
  if (!restore) return;
  const target = modalReturnFocus.get(dialog);
  const fallback = $("#levelButton");
  if (target?.isConnected && target.getClientRects().length) target.focus({ preventScroll: true });
  else fallback?.focus({ preventScroll: true });
}

function playTone(kind) {
  if (!state.audio || !window.AudioContext) return;
  try {
    const context = playTone.context ||= new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = kind === "wrong" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(kind === "wrong" ? 180 : kind === "fold" ? 430 : 680, context.currentTime);
    if (kind === "success") oscillator.frequency.exponentialRampToValueAtTime(1040, context.currentTime + .2);
    gain.gain.setValueAtTime(.055, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .23);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + .24);
  } catch { /* Sound is optional. */ }
}

function playSuccessVoice(word) {
  if (!state.audio) return;
  const slug = { "GOOD JOB!": "good-job", "GREAT JOB!": "great-job", "SUCCESS!": "success" }[word];
  const audio = new Audio(`../../assets/audio/cubi/success/${state.lang}/${slug}.mp3`);
  audio.volume = .82;
  audio.play().catch(() => playTone("success"));
}

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove("show"), 2200);
}

function cubiSays(message) {
  ui.bubble.textContent = message;
  ui.guide.classList.add("show");
  clearTimeout(cubiSays.timer);
  cubiSays.timer = setTimeout(() => ui.guide.classList.remove("show"), 5200);
}

function loadSession() {
  state.queue = sessionProblems(GAME_ID, state.level, level().problems, SESSION_SIZE);
  const canRestore = !params.has("level") && Number(saved.level) === state.level;
  state.problemIndex = canRestore ? Math.min(SESSION_SIZE - 1, Math.max(0, Number(saved.problemIndex) || 0)) : 0;
}

function makeNetSvg(cells, faces = []) {
  const maxX = Math.max(...cells.map(([x]) => x));
  const maxY = Math.max(...cells.map(([, y]) => y));
  const faceMap = new Map(faces.map((face) => [face.cell.join(","), face]));
  const size = 58;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `-4 -4 ${(maxX + 1) * size + 8} ${(maxY + 1) * size + 8}`);
  svg.classList.add("net-svg");
  cells.forEach(([x, y]) => {
    const face = faceMap.get(`${x},${y}`);
    const group = document.createElementNS(svg.namespaceURI, "g");
    const rect = document.createElementNS(svg.namespaceURI, "rect");
    rect.setAttribute("x", x * size); rect.setAttribute("y", y * size);
    rect.setAttribute("width", size); rect.setAttribute("height", size);
    rect.setAttribute("rx", "5"); rect.setAttribute("fill", face?.color || "#e7bc78");
    group.append(rect);
    if (face?.label) {
      const label = document.createElementNS(svg.namespaceURI, "text");
      label.setAttribute("x", x * size + size / 2); label.setAttribute("y", y * size + (face.arrow ? 27 : 37));
      label.textContent = face.label; group.append(label);
    }
    if (face?.arrow) {
      const arrow = document.createElementNS(svg.namespaceURI, "text");
      arrow.classList.add("net-arrow");
      arrow.setAttribute("x", x * size + size / 2); arrow.setAttribute("y", y * size + 50);
      arrow.textContent = { up: "↑", right: "→", down: "↓", left: "←" }[face.arrow]; group.append(arrow);
    }
    svg.append(group);
  });
  return svg;
}

function disposeChoiceViewers(){state.choiceViewers.forEach((viewer)=>viewer.dispose());state.choiceViewers=[];}

function choiceButton(label, value, visual) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "answer-choice";
  button.dataset.value = String(value);
  button.setAttribute("aria-label", label);
  button.append(visual);
  button.addEventListener("click", () => answer(value, button));
  return button;
}

function solidSvg(solid) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 220 170");
  svg.classList.add("solid-svg", `solid-${solid.id}`);
  const shapes = {
    tetra: [[110,18,32,140,188,140], [110,18,110,112,32,140], [110,18,188,140,110,112]],
    cube: [[55,55,115,22,175,55,115,88], [55,55,115,88,115,150,55,116], [115,88,175,55,175,116,115,150]],
    octa: [[110,10,28,84,110,80], [110,10,192,84,110,80], [28,84,110,80,110,160], [192,84,110,80,110,160]],
    dodeca: [[110,12,170,45,155,110,110,150,65,110,50,45], [50,45,110,76,65,110], [170,45,110,76,155,110]],
    icosa: [[110,8,32,58,74,80], [110,8,74,80,110,70], [110,8,110,70,146,80], [110,8,146,80,188,58], [32,58,74,80,42,140], [74,80,110,70,110,158], [146,80,110,70,110,158], [188,58,146,80,178,140]]
  };
  (shapes[solid.id] || []).forEach((points, index) => {
    const polygon = document.createElementNS(svg.namespaceURI, "polygon");
    polygon.setAttribute("points", points.join(" "));
    polygon.setAttribute("class", `facet f${index}`);
    svg.append(polygon);
  });
  return svg;
}

function renderLevel1(p) {
  const intro = document.createElement("div");
  intro.className = "stage-intro";
  intro.innerHTML = "<span class=fold-mark></span><strong>2D</strong><i>→</i><strong>3D</strong>";
  ui.stage.append(intro);
  p.choices.forEach((choice, index) => ui.choices.append(choiceButton(t("answerChoice", { number: index + 1 }), choice.id, makeNetSvg(choice.cells))));
}

function renderFoldProblem(p) {
  const viewerHost = document.createElement("div");
  viewerHost.className = "viewer-host";
  ui.stage.append(viewerHost);
  state.viewer = new NetFoldViewer(viewerHost);
  state.viewer.setNet(p.cells, p.faces, p.choices.find((choice) => choice.id === p.answer));
  ui.fold.hidden = false;
  p.choices.forEach((choice, index) => {
    const host=document.createElement("div");host.className="choice-cube-host";
    const button=choiceButton(t("answerChoice", { number: index + 1 }), choice.id, host);ui.choices.append(button);
    const viewer=new NetFoldViewer(host);viewer.setNet(p.cells,p.faces,choice);viewer.setProgress(1);viewer.controls.enabled=false;state.choiceViewers.push(viewer);
  });
}

function renderNetOpposite(p) {
  const viewerHost = document.createElement("div");
  viewerHost.className = "viewer-host opposite-viewer";
  ui.stage.append(viewerHost);
  state.viewer = new NetFoldViewer(viewerHost);
  state.viewer.setNet(p.cells, p.faces);
  ui.fold.hidden = false;
  p.choices.forEach((choice, index) => {
    const visual = document.createElement("span");
    visual.className = "face-choice";
    visual.style.setProperty("--face-color", choice.color);
    visual.textContent = choice.label;
    ui.choices.append(choiceButton(t("answerChoice", { number: index + 1 }), choice.id, visual));
  });
}

function renderDice(p) {
  const card = document.createElement("div");
  card.className = "dice-stage";
  const die = document.createElement("span");
  die.className = "die";
  die.textContent = p.interaction === "dice-opposite" ? p.face : "?";
  const rule = document.createElement("p");
  rule.textContent = state.lang === "ko" ? "마주 보는 두 면의 합이 7인 주사위" : t("hintDice");
  card.append(die, rule); ui.stage.append(card);
  p.choices.forEach((value, index) => {
    const shown = Array.isArray(value) ? value.join("  ↔  ") : String(value);
    const visual = document.createElement("strong"); visual.className = "number-choice"; visual.textContent = shown;
    ui.choices.append(choiceButton(t("answerChoice", { number: index + 1 }), index, visual));
  });
}

function renderSolid(p) {
  const display = document.createElement("div");
  display.className = "solid-stage";
  display.append(solidSvg(p.solid));
  const description = document.createElement("strong");
  description.textContent = t("faces", { count: p.solid.faces, shape: t(p.solid.faceShape) });
  display.append(description); ui.stage.append(display);
  p.choices.forEach((choice, index) => {
    const value = typeof choice === "object" ? choice.id : choice;
    const visual = document.createElement("span");
    visual.className = "solid-choice-label";
    visual.textContent = typeof choice === "object" ? t(choice.nameKey) : String(choice);
    ui.choices.append(choiceButton(t("answerChoice", { number: index + 1 }), value, visual));
  });
}

function renderProblem() {
  clearTimeout(state.autoNextTimer);state.autoNextTimer=null;state.viewer?.dispose(); state.viewer = null;disposeChoiceViewers();
  state.solved = false; state.folded = false;
  ui.stage.replaceChildren(); ui.choices.replaceChildren(); ui.next.hidden = true; ui.fold.hidden = true;
  ui.fold.textContent = t("fold");
  const p = problem();
  document.documentElement.lang = state.lang;
  $("#brandName").textContent = t("brand");
  $("#worksheetLink").textContent = t("worksheet");
  $("#levelLabel").textContent = `${t(level().bandKey)} · ${t("level")} ${state.level}`;
  $("#problemLabel").textContent = `${state.problemIndex + 1} / ${state.queue.length}`;
  $("#stars").textContent = "●".repeat(state.problemIndex + 1) + "○".repeat(state.queue.length - state.problemIndex - 1);
  $("#missionTitle").textContent = t(level().titleKey);
  const vars = p.interaction === "dice-opposite" ? { face: p.face }
    : p.interaction === "net-opposite" ? { mark: p.query.label }
      : p.solid ? { solid: t(p.solid.nameKey) } : {};
  ui.prompt.textContent = t(p.promptKey, vars);
  ui.answerPrompt.textContent = t("chooseAnswer");
  if (p.interaction === "choose-net") renderLevel1(p);
  else if (p.interaction === "net-opposite") renderNetOpposite(p);
  else if (p.interaction === "fold-view" || p.interaction === "symbol-view") renderFoldProblem(p);
  else if (p.interaction.startsWith("dice")) renderDice(p);
  else renderSolid(p);
  saveGameProgress(PROGRESS_KEY, { level: state.level, problemIndex: state.problemIndex });
}

function isCorrect(value) {
  const p = problem();
  if (p.interaction === "dice-pair") return Number(value) === p.answer;
  if (p.interaction === "dice-opposite") return p.choices[Number(value)] === p.answer;
  if (p.interaction === "solid-adjacent") return Number(value) === p.answer;
  return String(value) === String(p.answer);
}

function answer(value, button) {
  if (state.solved) return;
  if (!isCorrect(value)) {
    state.wrong += 1;
    button.classList.remove("wrong"); void button.offsetWidth; button.classList.add("wrong");
    playTone("wrong"); showToast(t("wrong")); return;
  }
  state.solved = true;
  button.classList.add("correct");
  ui.choices.querySelectorAll("button").forEach((node) => { node.disabled = true; });
  const word = SUCCESS_WORDS[(state.problemIndex + state.level) % SUCCESS_WORDS.length];
  ui.success.querySelector("strong").textContent = word;
  ui.success.classList.remove("burst"); void ui.success.offsetWidth; ui.success.classList.add("burst");
  playSuccessVoice(word);
  ui.next.hidden = false;
  state.autoNextTimer=setTimeout(nextProblem,1150);
}

function showComplete() {
  state.viewer?.dispose(); state.viewer = null;disposeChoiceViewers();
  $("#completeTitle").textContent = t("completeTitle");
  $("#completeText").textContent = t("completeText");
  $("#nextLevelButton").textContent = t("nextLevel");
  $("#practiceButton").textContent = t("practice");
  $("#mapLink").textContent = t("back");
  $("#nextLevelButton").hidden = state.level >= levels.length;
  showModal(ui.complete);
  cubiSays(t("completeText"));
  saveGameProgress(PROGRESS_KEY, { level: state.level, problemIndex: 0, completed: true });
}

function nextProblem() {
  if (!state.solved) return;
  clearTimeout(state.autoNextTimer);state.autoNextTimer=null;
  if (state.problemIndex >= state.queue.length - 1) { showComplete(); return; }
  state.problemIndex += 1; renderProblem();
}

function selectLevel(levelId) {
  state.level = levelId; state.problemIndex = 0; hideModal(ui.levelDialog, false); hideModal(ui.complete, false);
  state.queue = sessionProblems(GAME_ID, state.level, level().problems, SESSION_SIZE);
  renderProblem();
  history.replaceState({}, "", `?level=${levelId}`);
}

function renderLevels() {
  ui.levelList.replaceChildren();
  levels.forEach((item) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "level-card";
    if (item.id === state.level) button.classList.add("active");
    button.innerHTML = `<span>${t(item.bandKey)}</span><strong>${item.id}. ${t(item.titleKey)}</strong><small>${t(item.subtitleKey)}</small>`;
    button.addEventListener("click", () => selectLevel(item.id)); ui.levelList.append(button);
  });
  $("#dialogTitle").textContent = t("levels");
}

function hint() {
  state.hints += 1;
  const interaction = problem().interaction;
  const key = interaction === "choose-net" ? "hintValidNet"
    : interaction === "net-opposite" || interaction === "fold-view" ? "hintFold"
      : interaction.startsWith("dice") ? "hintDice"
        : interaction === "symbol-view" ? "hintSymbol" : "hintSolid";
  cubiSays(t(key));
  if (["net-opposite", "fold-view", "symbol-view"].includes(interaction) && !state.folded) toggleFold();
}

function toggleFold() {
  if (!state.viewer) return;
  state.folded = !state.folded;
  state.viewer.animateTo(state.folded ? 1 : 0);
  ui.fold.textContent = t(state.folded ? "unfold" : "fold");
  playTone("fold");
}

function setupTutorial() {
  const steps = [t("tutorial1"), t("tutorial2"), t("tutorial3")];
  let index = 0;
  const render = () => {
    ui.tutorialText.textContent = steps[index]; ui.tutorialDots.replaceChildren();
    steps.forEach((_, at) => { const dot = document.createElement("i"); if (at === index) dot.className = "active"; ui.tutorialDots.append(dot); });
    ui.tutorialNext.textContent = t(index === steps.length - 1 ? "tutorialStart" : "tutorialNext");
  };
  const finish = () => {
    localStorage.setItem(TUTORIAL_KEY, "done"); hideModal(ui.tutorial, false);
    if (!params.has("level")) showModal(ui.levelDialog);
  };
  ui.tutorialNext.addEventListener("click", () => { if (index < steps.length - 1) { index += 1; render(); } else finish(); });
  ui.tutorialSkip.textContent = t("skip"); ui.tutorialSkip.addEventListener("click", finish);
  const show = params.get("tutorial") === "1" || localStorage.getItem(TUTORIAL_KEY) !== "done";
  if (show) showModal(ui.tutorial);
  else if (!params.has("level")) showModal(ui.levelDialog);
  render();
}

function updateSoundButton() {
  $("#soundButton").classList.toggle("muted", !state.audio);
  $("#soundButton").textContent = state.audio ? "♪" : "×";
  $("#soundButton").setAttribute("aria-label", t(state.audio ? "soundOn" : "soundOff"));
}

loadSession(); renderLevels(); renderProblem(); setupTutorial(); updateSoundButton();
$("#rotateMessage").textContent = t("rotate"); $("#rotateExit").textContent = t("rotateExit");
$("#levelButton").textContent = t("levels"); ui.hint.textContent = t("hint"); ui.next.textContent = t("next");
ui.next.addEventListener("click", nextProblem); ui.hint.addEventListener("click", hint); ui.fold.addEventListener("click", toggleFold);
$("#levelButton").addEventListener("click", () => { renderLevels(); showModal(ui.levelDialog); });
$("#closeLevels").addEventListener("click", () => hideModal(ui.levelDialog));
$("#soundButton").addEventListener("click", () => { state.audio = !state.audio; localStorage.setItem("gfield-audio-muted", String(!state.audio)); updateSoundButton(); });
$("#nextLevelButton").addEventListener("click", () => selectLevel(state.level + 1));
$("#practiceButton").addEventListener("click", () => { location.href = `?level=${state.level}&practice=1`; });

document.addEventListener("keydown", (event) => {
  const dialogs = [ui.tutorial, ui.levelDialog, ui.complete];
  const open = dialogs.find((dialog) => !dialog.hidden);
  if (!open) return;
  if (event.key === "Escape") {
    event.preventDefault();
    if (open === ui.tutorial) ui.tutorialSkip.click();
    else hideModal(open);
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = focusableWithin(open);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});
