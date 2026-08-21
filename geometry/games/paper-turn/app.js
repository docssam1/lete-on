import { levels, levelMeta, operationMeta, applyOperation, validateLevels } from "./levels.js?v=paper-turn-1";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const saved = readGameProgress("paperTurn");
const storedLanguage = localStorage.getItem("gfield-language") || "ko";
const lang = ["ko", "zh", "ja", "en"].includes(storedLanguage) ? storedLanguage : "ko";
const requestedLevel = Math.max(1, Math.min(5, Number(params.get("level")) || Number(saved.level) || 1));
const SESSION_SIZE = 5;
const recentKey = "gfield-paper-turn-recent";
const tutorialKey = "gfield-paper-turn-tutorial-v1";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const copy = {
  ko:{levels:"레벨",level:"레벨",hint:"힌트",retry:"다시",worksheet:"학습지",next:"다음 문제",source:"시작 모양",choice:"알맞은 결과",operation:"순서대로 움직여요",play:"움직임 보기",choose:"화살표 방향으로 움직인 뒤의 모양을 찾아보세요.",cutChoose:"펼친 결과를 보고 접힌 종이의 자른 선을 되짚어 보세요.",correct:"정확해요! 움직임을 순서대로 확인해 볼까요?",wrong:"방향이 조금 달라요. 기준이 되는 칸부터 다시 따라가 보세요.",hintText:"첫 번째 화살표만 천천히 움직여 볼게요.",levelComplete:"레벨 {level} 완료!",complete:"방향을 끝까지 정확하게 따라갔어요.",nextLevel:"다음 레벨",practice:"같은 레벨 더 풀기",studio:"오리가미 스튜디오",chooseLevel:"레벨 선택",tutorial1:"이번에는 접힌 색종이를 돌리고 뒤집으며 방향을 추적해 볼 거야.",tutorial2:"시작 모양을 보고 화살표를 왼쪽부터 한 번씩 적용해 보자.",tutorial3:"보기는 같은 계열의 모양만 나와. 꼭짓점과 튀어나온 칸의 방향을 끝까지 확인해.",start:"시작",tutorialNext:"다음",soundOn:"소리 끄기",soundOff:"소리 켜기",result:"결과 {n}"},
  zh:{levels:"关卡",level:"关卡",hint:"提示",retry:"重来",worksheet:"练习纸",next:"下一题",source:"开始图形",choice:"正确结果",operation:"按顺序移动",play:"播放移动",choose:"找出按箭头移动后的图形。",cutChoose:"根据展开结果反推折纸上的切线。",correct:"正确！按顺序看看移动过程。",wrong:"方向有一点不同，请从基准格重新追踪。",hintText:"先慢慢演示第一个箭头。",levelComplete:"第 {level} 关完成！",complete:"你准确地追踪了所有方向。",nextLevel:"下一关",practice:"再练同一关",studio:"折纸工作室",chooseLevel:"选择关卡",tutorial1:"这次我们要旋转和翻转折纸来追踪方向。",tutorial2:"看开始图形，从左到右逐个应用箭头。",tutorial3:"选项都是相似图形，请仔细看凸出格和角的方向。",start:"开始",tutorialNext:"下一步",soundOn:"关闭声音",soundOff:"打开声音",result:"结果 {n}"},
  ja:{levels:"レベル",level:"レベル",hint:"ヒント",retry:"やり直す",worksheet:"プリント",next:"次の問題",source:"はじめの形",choice:"正しい結果",operation:"順番に動かそう",play:"動きを見る",choose:"矢印の向きに動かしたあとの形を探しましょう。",cutChoose:"開いた結果から、折った紙の切り線をたどりましょう。",correct:"正解！順番に動きを見てみましょう。",wrong:"向きが少し違います。基準のマスからもう一度たどりましょう。",hintText:"最初の矢印だけゆっくり動かします。",levelComplete:"レベル {level} クリア！",complete:"最後まで正しく向きを追えました。",nextLevel:"次のレベル",practice:"同じレベルを練習",studio:"おりがみスタジオ",chooseLevel:"レベルを選ぶ",tutorial1:"今度は折った紙を回したり裏返したりして向きを追います。",tutorial2:"はじめの形を見て、左から矢印を一つずつ使いましょう。",tutorial3:"似た形の中から、出ているマスと角の向きを確認します。",start:"スタート",tutorialNext:"次へ",soundOn:"音を消す",soundOff:"音を出す",result:"結果 {n}"},
  en:{levels:"Levels",level:"Level",hint:"Hint",retry:"Restart",worksheet:"Worksheet",next:"Next",source:"Start shape",choice:"Choose the result",operation:"Move in order",play:"Play moves",choose:"Find the shape after following the arrows.",cutChoose:"Use the open result to trace the cut back to the folded paper.",correct:"Correct. Watch each move in order.",wrong:"The direction is different. Trace again from one reference cell.",hintText:"Here is the first arrow, slowly.",levelComplete:"Level {level} complete!",complete:"You tracked every direction correctly.",nextLevel:"Next level",practice:"Practice again",studio:"Origami Studio",chooseLevel:"Choose a level",tutorial1:"This course turns and flips folded paper to track direction.",tutorial2:"Start with the first shape and apply each arrow from left to right.",tutorial3:"The choices use similar shapes, so follow corners and sticking-out cells carefully.",start:"Start",tutorialNext:"Next",soundOn:"Mute sound",soundOff:"Turn sound on",result:"Result {n}"}
};

const t = (key, vars = {}) => Object.entries(vars).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, replacement), copy[lang]?.[key] || copy.ko[key] || key);

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function makeSession(levelIndex) {
  let recent = {};
  try { recent = JSON.parse(localStorage.getItem(recentKey) || "{}"); } catch { recent = {}; }
  const excluded = new Set(recent[levelIndex + 1] || []);
  let pool = levels[levelIndex].problems.filter((problem) => !excluded.has(problem.id));
  if (pool.length < SESSION_SIZE) pool = levels[levelIndex].problems;
  const session = shuffle(pool).slice(0, SESSION_SIZE);
  recent[levelIndex + 1] = session.map((problem) => problem.id);
  localStorage.setItem(recentKey, JSON.stringify(recent));
  return session;
}

const state = {
  level: requestedLevel - 1,
  index: 0,
  queue: makeSession(requestedLevel - 1),
  solved: false,
  busy: false,
  audio: localStorage.getItem("gfield-audio-muted") !== "true",
  tutorialStep: 0,
  previewMatrix: null
};

const ui = {
  levelLabel: $("#levelLabel"), problemLabel: $("#problemLabel"), missionTitle: $("#missionTitle"), prompt: $("#prompt"), sourceTitle: $("#sourceTitle"), choiceTitle: $("#choiceTitle"), operationTitle: $("#operationTitle"), source: $("#sourceBoard"), operations: $("#operationSteps"), choices: $("#choiceGrid"), play: $("#playButton"), hint: $("#hintButton"), retry: $("#retryButton"), next: $("#nextButton"), sound: $("#soundButton"), levels: $("#levelButton"), levelDialog: $("#levelDialog"), levelList: $("#levelList"), closeLevels: $("#closeLevels"), guide: $("#foldyGuide"), bubble: $("#guideBubble"), tutorial: $("#tutorial"), tutorialText: $("#tutorialText"), tutorialDots: $("#tutorialDots"), tutorialNext: $("#tutorialNext"), complete: $("#completeDialog"), completeTitle: $("#completeTitle"), completeText: $("#completeText"), nextLevel: $("#nextLevelButton"), practice: $("#practiceButton"), success: $("#success"), toast: $("#toast")
};

function problem() { return state.queue[state.index]; }
function level() { return levels[state.level]; }

function board(matrix, extraClass = "") {
  const node = document.createElement("div");
  node.className = `matrix-board ${extraClass}`;
  node.style.setProperty("--size", matrix.length);
  matrix.flat().forEach((value) => {
    const cell = document.createElement("i");
    cell.className = `matrix-cell${value ? " filled" : ""}`;
    node.append(cell);
  });
  return node;
}

function localizedOperation(operation) {
  const meta = operationMeta[operation];
  return { symbol: meta.symbol, label: meta[lang] || meta.ko };
}

function render() {
  state.solved = false;
  state.busy = false;
  const current = problem();
  const meta = levelMeta[state.level];
  document.documentElement.lang = lang;
  ui.levelLabel.textContent = `${t("level")} ${state.level + 1}`;
  ui.problemLabel.textContent = `${state.index + 1} / ${SESSION_SIZE}`;
  ui.missionTitle.textContent = meta.title[lang] || meta.title.ko;
  ui.prompt.textContent = current.interaction === "cut-backtrack" ? t("cutChoose") : t("choose");
  ui.sourceTitle.textContent = t("source");
  ui.choiceTitle.textContent = t("choice");
  ui.operationTitle.textContent = t("operation");
  ui.play.querySelector("b").textContent = t("play");
  ui.hint.textContent = t("hint");
  ui.retry.textContent = t("retry");
  ui.next.textContent = t("next");
  ui.levels.textContent = t("levels");
  ui.sound.setAttribute("aria-label", state.audio ? t("soundOn") : t("soundOff"));
  ui.sound.innerHTML = state.audio ? "&#9835;" : "&#9834;&#824;";
  ui.source.replaceChildren(board(current.start, "source-board"));
  ui.operations.replaceChildren();
  current.operations.forEach((operation, index) => {
    const value = localizedOperation(operation);
    const item = document.createElement("span");
    item.className = "operation-step";
    item.dataset.index = index;
    item.textContent = value.symbol;
    item.title = value.label;
    item.setAttribute("aria-label", `${index + 1}. ${value.label}`);
    ui.operations.append(item);
  });
  ui.choices.replaceChildren();
  current.choices.forEach((matrix, index) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.dataset.choice = index;
    button.setAttribute("aria-label", t("result", { n: index + 1 }));
    button.append(board(matrix));
    const label = document.createElement("b");
    label.textContent = index + 1;
    button.append(label);
    button.addEventListener("click", () => choose(index, button));
    ui.choices.append(button);
  });
  ui.next.hidden = true;
  saveGameProgress("paperTurn", { level: state.level + 1, problemIndex: state.index, queue: state.queue.map((item) => item.id) });
}

function tone(kind) {
  if (!state.audio) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const notes = kind === "success" ? [523, 659, 784] : kind === "place" ? [440, 554] : [180, 150];
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = kind === "wrong" ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime + index * .08);
    gain.gain.exponentialRampToValueAtTime(.11, context.currentTime + index * .08 + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + index * .08 + .18);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + index * .08);
    oscillator.stop(context.currentTime + index * .08 + .2);
  });
  setTimeout(() => context.close(), 700);
}

function showGuide(message, duration = 2600) {
  ui.bubble.textContent = message;
  ui.guide.classList.add("show");
  clearTimeout(showGuide.timer);
  showGuide.timer = setTimeout(() => ui.guide.classList.remove("show"), duration);
}

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove("show"), 1800);
}

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

async function previewOperations(limit = problem().operations.length) {
  if (state.busy) return;
  state.busy = true;
  ui.play.disabled = true;
  let visual = ui.source.querySelector(".matrix-board");
  let matrix = problem().start;
  for (let index = 0; index < Math.min(limit, problem().operations.length); index += 1) {
    const operation = problem().operations[index];
    ui.operations.querySelectorAll(".operation-step").forEach((node, nodeIndex) => node.classList.toggle("active", nodeIndex === index));
    if (!reducedMotion) {
      visual.classList.add(`preview-${operation}`);
      await sleep(480);
    }
    matrix = applyOperation(matrix, operation);
    visual.replaceWith(board(matrix, "source-board"));
    visual = ui.source.querySelector(".matrix-board");
    await sleep(reducedMotion ? 10 : 170);
  }
  ui.operations.querySelectorAll(".operation-step").forEach((node) => node.classList.remove("active"));
  await sleep(reducedMotion ? 10 : 260);
  ui.source.replaceChildren(board(problem().start, "source-board"));
  ui.play.disabled = false;
  state.busy = false;
}

async function choose(index, button) {
  if (state.busy || state.solved) return;
  state.busy = true;
  if (index !== problem().answer) {
    button.classList.add("wrong");
    tone("wrong");
    await sleep(440);
    button.classList.remove("wrong");
    state.busy = false;
    showToast(t("wrong"));
    return;
  }
  state.solved = true;
  button.classList.add("correct");
  ui.choices.querySelectorAll("button").forEach((item) => { item.disabled = true; });
  tone("place");
  await previewSolved();
  celebrate();
  saveGameProgress("paperTurn", { level: state.level + 1, problemIndex: state.index, queue: state.queue.map((item) => item.id), completedProblem: problem().id });
  state.busy = false;
  ui.next.hidden = false;
}

async function previewSolved() {
  let visual = ui.source.querySelector(".matrix-board");
  let matrix = problem().start;
  for (let index = 0; index < problem().operations.length; index += 1) {
    const operation = problem().operations[index];
    ui.operations.querySelectorAll(".operation-step").forEach((node, nodeIndex) => node.classList.toggle("active", nodeIndex === index));
    if (!reducedMotion) {
      visual.classList.add(`preview-${operation}`);
      await sleep(410);
    }
    matrix = applyOperation(matrix, operation);
    visual.replaceWith(board(matrix, "source-board"));
    visual = ui.source.querySelector(".matrix-board");
    await sleep(reducedMotion ? 10 : 120);
  }
  ui.operations.querySelectorAll(".operation-step").forEach((node) => node.classList.remove("active"));
}

function celebrate() {
  const words = ["GOOD JOB!", "GREAT JOB!", "SUCCESS!"];
  ui.success.querySelector("strong").textContent = words[Math.floor(Math.random() * words.length)];
  ui.success.classList.remove("show");
  void ui.success.offsetWidth;
  ui.success.classList.add("show");
  tone("success");
}

function nextProblem() {
  if (!state.solved || state.busy) return;
  if (state.index < SESSION_SIZE - 1) {
    state.index += 1;
    render();
    return;
  }
  ui.completeTitle.textContent = t("levelComplete", { level: state.level + 1 });
  ui.completeText.textContent = t("complete");
  ui.nextLevel.textContent = t("nextLevel");
  ui.nextLevel.hidden = state.level === levels.length - 1;
  ui.practice.textContent = t("practice");
  ui.complete.querySelector("a").textContent = t("studio");
  ui.complete.hidden = false;
}

function startLevel(index) {
  state.level = index;
  state.index = 0;
  state.queue = makeSession(index);
  ui.levelDialog.hidden = true;
  ui.complete.hidden = true;
  render();
}

function renderLevelDialog() {
  ui.levelList.replaceChildren();
  levelMeta.forEach((meta, index) => {
    const button = document.createElement("button");
    button.className = "level-card";
    button.type = "button";
    button.style.setProperty("--level-color", meta.color);
    button.innerHTML = `<span>${meta.id}</span><strong>${meta.title[lang] || meta.title.ko}</strong><small>${meta.description[lang] || meta.description.ko}</small>`;
    button.addEventListener("click", () => startLevel(index));
    ui.levelList.append(button);
  });
}

function tutorial() {
  const steps = [t("tutorial1"), t("tutorial2"), t("tutorial3")];
  ui.tutorialText.textContent = steps[state.tutorialStep];
  ui.tutorialDots.innerHTML = steps.map((_, index) => `<i class="${index === state.tutorialStep ? "active" : ""}"></i>`).join("");
  ui.tutorialNext.textContent = state.tutorialStep === steps.length - 1 ? t("start") : t("tutorialNext");
}

ui.play.addEventListener("click", () => previewOperations());
ui.hint.addEventListener("click", () => { showGuide(t("hintText")); previewOperations(1); });
ui.retry.addEventListener("click", render);
ui.next.addEventListener("click", nextProblem);
ui.sound.addEventListener("click", () => {
  state.audio = !state.audio;
  localStorage.setItem("gfield-audio-muted", String(!state.audio));
  ui.sound.setAttribute("aria-label", state.audio ? t("soundOn") : t("soundOff"));
  ui.sound.innerHTML = state.audio ? "&#9835;" : "&#9834;&#824;";
});
ui.levels.addEventListener("click", () => { ui.levelDialog.hidden = false; });
ui.closeLevels.addEventListener("click", () => { ui.levelDialog.hidden = true; });
ui.nextLevel.addEventListener("click", () => startLevel(Math.min(levels.length - 1, state.level + 1)));
ui.practice.addEventListener("click", () => startLevel(state.level));
ui.tutorialNext.addEventListener("click", () => {
  if (state.tutorialStep < 2) { state.tutorialStep += 1; tutorial(); return; }
  localStorage.setItem(tutorialKey, "done");
  ui.tutorial.hidden = true;
  showGuide(t("choose"));
});

renderLevelDialog();
render();
if (localStorage.getItem(tutorialKey) !== "done") { ui.tutorial.hidden = false; tutorial(); }
