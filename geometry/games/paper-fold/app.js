import { levels, validateLevels } from "./levels.js?v=paper-fold-5";
import { readGameProgress, saveGameProgress } from "../../shared/profile-storage.js";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const params = new URLSearchParams(location.search);
const saved = readGameProgress("paperFold");
const requestedLevel = Math.max(1, Math.min(5, Number(params.get("level")) || Number(saved.level) || 1));
const storedLanguage = localStorage.getItem("gfield-language") || "ko";
const language = ["ko", "zh", "ja", "en"].includes(storedLanguage) ? storedLanguage : "ko";
const SESSION_SIZE = 5;
const recentKey = "gfield-paper-fold-recent";

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function sessionFromIds(levelIndex, ids) {
  if (!Array.isArray(ids) || ids.length !== SESSION_SIZE) return null;
  const byId = new Map(levels[levelIndex].problems.map((item) => [item.id, item]));
  const session = ids.map((id) => byId.get(id)).filter(Boolean);
  return session.length === SESSION_SIZE && new Set(session).size === SESSION_SIZE ? session : null;
}

function createSession(levelIndex) {
  let recent = {};
  try { recent = JSON.parse(localStorage.getItem(recentKey) || "{}"); } catch { recent = {}; }
  const excluded = new Set(Array.isArray(recent[levelIndex + 1]) ? recent[levelIndex + 1] : []);
  let candidates = levels[levelIndex].problems.filter((item) => !excluded.has(item.id));
  if (candidates.length < SESSION_SIZE) candidates = levels[levelIndex].problems;
  const session = shuffled(candidates).slice(0, SESSION_SIZE);
  recent[levelIndex + 1] = session.map((item) => item.id);
  localStorage.setItem(recentKey, JSON.stringify(recent));
  return session;
}

const restoredSession = !params.has("level") && Number(saved.level) === requestedLevel ? sessionFromIds(requestedLevel - 1, saved.queue) : null;
const initialSession = restoredSession || createSession(requestedLevel - 1);
const state = {
  level: requestedLevel - 1,
  problem: params.has("level") || !restoredSession ? 0 : Math.max(0, Math.min(SESSION_SIZE - 1, Number(saved.problemIndex) || 0)),
  queue: initialSession,
  folded: false,
  busy: false,
  solved: false,
  wrong: 0,
  hints: 0,
  selections: new Set(),
  placements: [],
  selectedPlacement: null,
  stage: 1,
  audio: localStorage.getItem("gfield-audio-muted") !== "true",
  lang: language
};

const I18N = {
  ko: {
    back: "색종이 접기 마을로 나가기", levels: "레벨", hint: "힌트", retry: "다시", worksheet: "학습지",
    rotate: "돌리기", flip: "뒤집기", next: "다음 문제", level: "레벨", chooseLevel: "레벨 선택", close: "닫기",
    levelComplete: "레벨 {level} 완료!", completeText: "차근차근 접고 펼치며 정확하게 해결했어요.", nextLevel: "다음 레벨", studio: "색종이 접기 마을", practice: "같은 레벨 더 풀기",
    openPaper: "펼친 색종이", foldedPaper: "접은 색종이", openResult: "펼친 결과", foldAria: "{axis} 접기선을 눌러 접기",
    vertical: "세로", horizontal: "가로", "diag-main": "오른쪽 아래 대각선", "diag-anti": "왼쪽 아래 대각선",
    foldFirst: "먼저 빛나는 {axis} 접기선을 눌러 보세요.", choiceMatch: "접은 색종이와 펼친 결과를 알맞게 연결해 보세요.", choiceResult: "색종이를 펼치면 어떤 모양이 될까요?",
    gridCut: "잘려 나간 위치를 모두 눌러 보세요.", gridPunch: "구멍이 생기는 위치를 모두 눌러 보세요.", gridTriangleCut: "대각선으로 잘려 나간 삼각형 칸을 모두 눌러 보세요.", gridTrianglePunch: "대각선으로 접었을 때 구멍이 생기는 삼각형 칸을 모두 눌러 보세요.",
    shapePlace: "같은 종류의 도형을 색종이 위로 끌어 대칭 위치에 놓으세요. 필요하면 돌리거나 뒤집을 수 있어요.", shapeTray: "도형 보관함", dragShape: "{shape} 끌기", moveShape: "{shape} 옮기기",
    checkLocations: "위치 확인", checkPlacement: "놓은 자리 확인", cutPattern: "접은 종이의 잘린 부분", numberPaper: "펼친 색종이의 수", stage1: "1단계: 잘려 나간 칸과 삼각형을 모두 선택하세요.", checkSelected: "선택 확인", stage2: "2단계: {expression} = ?", sumAria: "잘려 나간 수의 합", checkSum: "합 확인", chooseAgain: "위치 다시 고르기",
    afterFold: "이제 접힌 부분을 거꾸로 펼친다고 생각해 보세요.", correct: "정확해요! 색종이가 거꾸로 펼쳐지는 모습을 볼까요?", wrong: "조금 달라요. 접기선을 거울처럼 생각해 보세요.", sumPlacesCorrect: "잘려 나간 위치를 모두 찾았어요. 표시된 수만 더해 볼까요?", allPieces: "보관함의 도형을 모두 사용했어요.",
    solvedPrompt: "색종이가 펼쳐지며 대칭인 답을 보여 줍니다.", foldedPrompt: "{axis}로 접었어요. 아래 문제를 해결하세요.", readyPrompt: "빛나는 {axis} 접기선을 눌러 한 번 접으세요.", folding: "접는 중...", unfolded: "펼친 결과", foldComplete: "접기 완료", tapCrease: "접기선 누르기",
    hintFolded: "{axis} 접기선을 거울이라고 생각해 보세요.", hintReady: "밝게 빛나는 선이 접기선이에요.", tutorial1: "안녕! 나는 폴디야. 색종이를 한 단계씩 직접 접고 펼쳐 볼 거야.", tutorial2: "빛나는 접기선을 누르면 종이 면이 실제처럼 뒤집혀 접혀.", tutorial3: "정답을 맞히면 색종이가 거꾸로 펼쳐지는 모습을 확인할 수 있어. 시작할까?", start: "시작", tutorialNext: "다음", startGuide: "빛나는 접기선부터 눌러 보세요.",
    soundOn: "소리 끄기", soundOff: "소리 켜기", resultChoice: "결과 {choice} 선택", rowCol: "{row}행 {col}열{part}"
  },
  zh: {
    back: "返回折纸村", levels: "关卡", hint: "提示", retry: "重来", worksheet: "学习单", rotate: "旋转", flip: "翻转", next: "下一题", level: "关卡", chooseLevel: "选择关卡", close: "关闭",
    levelComplete: "第 {level} 关完成！", completeText: "你一步一步折叠并准确解决了问题。", nextLevel: "下一关", studio: "折纸村", practice: "再练同一关",
    openPaper: "展开的纸", foldedPaper: "折叠的纸", openResult: "展开结果", foldAria: "沿{axis}折痕折叠", vertical: "竖直", horizontal: "水平", "diag-main": "右下对角线", "diag-anti": "左下对角线",
    foldFirst: "先点击发光的{axis}折痕。", choiceMatch: "把折叠的纸和展开结果配对。", choiceResult: "纸展开后会是什么图形？", gridCut: "点击所有被剪掉的位置。", gridPunch: "点击所有出现孔的位置。", gridTriangleCut: "点击所有沿对角线剪掉的三角格。", gridTrianglePunch: "点击所有出现孔的三角格。",
    shapePlace: "把同类图形拖到纸上的对称位置。需要时可旋转或翻转。", shapeTray: "图形托盘", dragShape: "拖动{shape}", moveShape: "移动{shape}", checkLocations: "检查位置", checkPlacement: "检查摆放", cutPattern: "折叠纸上的剪切部分", numberPaper: "展开纸上的数字", stage1: "第1步：选择所有被剪掉的格子和三角形。", checkSelected: "检查选择", stage2: "第2步：{expression} = ?", sumAria: "被剪掉数字的和", checkSum: "检查总和", chooseAgain: "重新选择位置",
    afterFold: "想象把折叠部分反向展开。", correct: "正确！看看纸反向展开。", wrong: "再想一想，把折痕当作镜子。", sumPlacesCorrect: "所有位置都找到了。现在只加高亮数字。", allPieces: "托盘里的图形都用完了。", solvedPrompt: "纸展开并显示对称答案。", foldedPrompt: "已沿{axis}折叠。完成下面的任务。", readyPrompt: "点击发光的{axis}折痕折一次。", folding: "折叠中...", unfolded: "展开结果", foldComplete: "折叠完成", tapCrease: "点击折痕", hintFolded: "把{axis}折痕想成镜子。", hintReady: "发光的线就是折痕。",
    tutorial1: "你好，我是Foldy。我们会一步一步折叠并展开纸张。", tutorial2: "点击发光的折痕，纸面会像真的一样翻过去。", tutorial3: "答对后，可以看到纸反向展开。开始吧？", start: "开始", tutorialNext: "下一步", startGuide: "先点击发光的折痕。", soundOn: "关闭声音", soundOff: "打开声音", resultChoice: "选择结果{choice}", rowCol: "第{row}行第{col}列{part}"
  },
  ja: {
    back: "おりがみ村へ戻る", levels: "レベル", hint: "ヒント", retry: "やり直す", worksheet: "プリント", rotate: "回す", flip: "反転", next: "次の問題", level: "レベル", chooseLevel: "レベルを選ぶ", close: "閉じる",
    levelComplete: "レベル {level} クリア！", completeText: "順番に折って開き、正しく解けました。", nextLevel: "次のレベル", studio: "おりがみ村", practice: "同じレベルを練習",
    openPaper: "開いた紙", foldedPaper: "折った紙", openResult: "開いた結果", foldAria: "{axis}の折り線で折る", vertical: "たて", horizontal: "よこ", "diag-main": "右下への斜め", "diag-anti": "左下への斜め",
    foldFirst: "まず光る{axis}の折り線を押しましょう。", choiceMatch: "折った紙と開いた結果をつなぎましょう。", choiceResult: "紙を開くとどの形になりますか？", gridCut: "切り取られる場所を全部押しましょう。", gridPunch: "穴ができる場所を全部押しましょう。", gridTriangleCut: "斜めに切り取られる三角のマスを全部押しましょう。", gridTrianglePunch: "穴ができる三角のマスを全部押しましょう。",
    shapePlace: "同じ種類の形を紙の対称な位置へドラッグします。必要なら回転・反転できます。", shapeTray: "形のトレイ", dragShape: "{shape}をドラッグ", moveShape: "{shape}を動かす", checkLocations: "場所を確認", checkPlacement: "置き方を確認", cutPattern: "折った紙の切った部分", numberPaper: "開いた紙の数字", stage1: "1段階：切り取られるマスと三角を全部選びます。", checkSelected: "選択を確認", stage2: "2段階：{expression} = ?", sumAria: "切り取られる数の合計", checkSum: "合計を確認", chooseAgain: "場所を選び直す",
    afterFold: "折った部分を逆に開くと考えましょう。", correct: "正解！紙が逆に開く様子を見ましょう。", wrong: "もう一度。折り線を鏡だと考えましょう。", sumPlacesCorrect: "切り取られる場所を全部見つけました。色の付いた数だけ足しましょう。", allPieces: "トレイの形を全部使いました。", solvedPrompt: "紙が開いて対称な答えを見せます。", foldedPrompt: "{axis}に折りました。下の問題を解きましょう。", readyPrompt: "光る{axis}の折り線を押して一回折ります。", folding: "折っています...", unfolded: "開いた結果", foldComplete: "折り終わり", tapCrease: "折り線を押す", hintFolded: "{axis}の折り線を鏡だと考えましょう。", hintReady: "光っている線が折り線です。",
    tutorial1: "こんにちは、Foldyです。紙を一段階ずつ折って開きます。", tutorial2: "光る折り線を押すと、紙の面が本物のように裏返ります。", tutorial3: "正解すると、紙が逆に開く様子を確認できます。始めますか？", start: "スタート", tutorialNext: "次へ", startGuide: "光る折り線から押しましょう。", soundOn: "音を消す", soundOff: "音を出す", resultChoice: "結果{choice}を選ぶ", rowCol: "{row}行{col}列{part}"
  },
  en: {
    back: "Back to Origami Studio", levels: "Levels", hint: "Hint", retry: "Restart", worksheet: "Worksheet", rotate: "Rotate", flip: "Flip", next: "Next", level: "Level", chooseLevel: "Choose a level", close: "Close",
    levelComplete: "Level {level} complete!", completeText: "You folded and unfolded each step carefully.", nextLevel: "Next level", studio: "Origami Studio", practice: "Practice again",
    openPaper: "OPEN PAPER", foldedPaper: "FOLDED PAPER", openResult: "OPEN RESULT", foldAria: "Fold along the {axis} crease", vertical: "vertical", horizontal: "horizontal", "diag-main": "down-right diagonal", "diag-anti": "down-left diagonal",
    foldFirst: "Fold along the glowing {axis} crease first.", choiceMatch: "Match the folded paper to the result.", choiceResult: "Which result appears when the paper opens?", gridCut: "Tap every cut-away place.", gridPunch: "Tap every place where a hole appears.", gridTriangleCut: "Tap every triangular region cut along the diagonal.", gridTrianglePunch: "Tap every triangular region where a hole appears.",
    shapePlace: "Drag each matching shape to its reflected place. Rotate or flip it when needed.", shapeTray: "Shape tray", dragShape: "Drag {shape}", moveShape: "Move {shape}", checkLocations: "Check locations", checkPlacement: "Check placement", cutPattern: "Cut on folded paper", numberPaper: "Numbers on open paper", stage1: "Stage 1 of 2: select every cut-away cell or triangle.", checkSelected: "Check selected places", stage2: "Stage 2 of 2: {expression} = ?", sumAria: "Sum of the cut-away numbers", checkSum: "Check sum", chooseAgain: "Choose places again",
    afterFold: "Now imagine opening the folded part in reverse.", correct: "Correct. Watch the reflected result open out.", wrong: "Almost. Check the crease and its reflection.", sumPlacesCorrect: "You found every cut-away place. Add only the highlighted numbers.", allPieces: "All tray pieces are already on the paper.", solvedPrompt: "The paper unfolds to show the reflected answer.", foldedPrompt: "The crease was {axis}. Solve the mission below.", readyPrompt: "Tap the glowing {axis} crease to make one fold.", folding: "Folding...", unfolded: "Unfolded result", foldComplete: "Fold complete", tapCrease: "Tap the crease", hintFolded: "Think of the {axis} crease as a mirror.", hintReady: "The bright line is the fold line.",
    tutorial1: "Hi, I am Foldy. We will fold real paper surfaces one step at a time.", tutorial2: "Tap the glowing crease. The flap turns over just like real paper.", tutorial3: "After a correct answer, watch it unfold in reverse. Ready?", start: "Start", tutorialNext: "Next", startGuide: "Start with the glowing crease.", soundOn: "Mute sound", soundOff: "Turn sound on", resultChoice: "Choose result {choice}", rowCol: "Row {row}, column {col}{part}"
  }
};

const t = (key, vars = {}) => {
  const source = I18N[state.lang]?.[key] ?? I18N.ko[key] ?? key;
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), source);
};

const ui = {
  paper: $("#paper"), status: $("#foldStatus"), prompt: $("#prompt"), answerPrompt: $("#answerPrompt"), interaction: $("#interaction"), next: $("#nextButton"),
  rotate: $("#rotateButton"), flip: $("#flipButton"), guide: $("#foldyGuide"), bubble: $("#guideBubble"), toast: $("#toast"), success: $("#success"),
  tutorial: $("#tutorial"), tutorialText: $("#tutorialText"), tutorialDots: $("#tutorialDots"), tutorialNext: $("#tutorialNext"), levelDialog: $("#levelDialog"), levelList: $("#levelList"), complete: $("#completeDialog")
};

const problem = () => state.queue[state.problem];
const title = (level) => level.title[state.lang] || level.title.ko;
const description = (level) => level.description[state.lang] || level.description.ko;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, reducedMotion ? 0 : ms));
const axisText = (axis) => t(axis);
const normalizedRotation = (rotation) => ((rotation % 360) + 360) % 360;
const equalSets = (left, right) => left.size === right.length && right.every((item) => left.has(item));

function setGuide(message) {
  ui.bubble.textContent = message;
  ui.guide.classList.add("show");
  clearTimeout(setGuide.timer);
  setGuide.timer = setTimeout(() => ui.guide.classList.remove("show"), 2600);
}

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => ui.toast.classList.remove("show"), 1800);
}

function playTone(kind) {
  if (!state.audio || reducedMotion || !window.AudioContext) return;
  try {
    const context = playTone.context ||= new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = kind === "success" ? 740 : kind === "wrong" ? 180 : 460;
    gain.gain.setValueAtTime(.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.035, context.currentTime + .02);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + .17);
  } catch { /* Audio is optional. */ }
}

function markHtml(marks, type = "punch") {
  return marks.map(([x, y]) => `<i class="${type === "cut" ? "mini-cut" : "mini-hole"}" style="left:${x * 100}%;top:${y * 100}%"></i>`).join("");
}

function resultChoiceHtml(item, p) {
  return `<button class="result-choice" type="button" data-choice="${item.key}" aria-label="${t("resultChoice", { choice: item.key.toUpperCase() })}"><span class="result-letter">${item.key.toUpperCase()}</span><span class="mini-paper"><span class="mini-crease ${p.fold.axis}"></span>${markHtml(item.result.marks, p.action.type)}</span></button>`;
}

function renderPaper() {
  const p = problem();
  const showGrid = ["grid-select", "punch-select", "cut-number-sum"].includes(p.interaction) && state.folded;
  const showShapes = p.interaction === "shape-place" && state.folded;
  const sumProblem = p.interaction === "cut-number-sum";
  const showSum = sumProblem && state.folded;
  const actionPoint = p.action?.point || [.62, .38];
  ui.paper.className = `paper axis-${p.fold.axis} side-${p.fold.side}${sumProblem ? " is-sum" : ""}${state.solved ? " is-unfolded" : state.folded ? " is-folded" : " ready"}${state.busy ? " is-busy" : ""}`;
  ui.paper.innerHTML = `
    <div class="sheet-base"><span class="paper-label">${state.solved ? t("openResult") : state.folded ? t("foldedPaper") : t("openPaper")}</span></div>
    <div class="fold-flap"></div>
    <button class="crease-control" type="button" data-fold aria-label="${t("foldAria", { axis: axisText(p.fold.axis) })}"><span></span></button>
    ${state.folded && !showGrid && !showShapes ? `<span class="folded-action ${p.action.type}" style="left:${actionPoint[0] * 100}%;top:${actionPoint[1] * 100}%"></span>` : ""}
    ${state.solved && ["result-choice", "match"].includes(p.interaction) ? `<span class="unfolded-marks">${markHtml(p.choices.find((item) => item.key === p.answer).result.marks, p.action.type)}</span>` : ""}
    ${showSum ? `<div class="sum-board"><div class="fold-preview"><span>${t("cutPattern")}</span><div class="fold-preview-grid"></div></div><div class="number-side"><span>${t("numberPaper")}</span><div class="board-grid number-board"></div></div></div>` : showGrid ? `<div class="board-grid"></div>` : ""}
    ${showShapes ? `<div class="shape-givens"></div><div class="shape-board"></div>` : ""}`;
  if (showGrid) {
    renderGrid(ui.paper.querySelector(".board-grid"));
    if (showSum) renderReferenceGrid(ui.paper.querySelector(".fold-preview-grid"), p.cutRegions, p.action?.type || "cut");
  }
  if (showShapes) renderPlacements();
}

function needsTriangles(p = problem()) {
  const source = p.interaction === "cut-number-sum" ? p.answer.cells : p.targetRegions;
  return source?.some((region) => region.includes("-"));
}

function renderGrid(gridEl) {
  const p = problem();
  const values = p.grid?.values;
  const triangles = needsTriangles(p);
  for (let row = 1; row <= 4; row += 1) {
    for (let col = 1; col <= 4; col += 1) {
      const base = `r${row}c${col}`;
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      if (values) cell.innerHTML = `<b>${values[row - 1][col - 1]}</b>`;
      const regions = triangles ? ["nw", "ne", "sw", "se"].map((part) => `${base}-${part}`) : [base];
      regions.forEach((region) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.region = region;
        button.className = `grid-region${triangles ? ` triangle-${region.slice(-2)}` : ""}`;
        button.classList.toggle("selected", state.selections.has(region));
        button.classList.toggle("source-region", p.interaction !== "cut-number-sum" && p.sourceRegions?.includes(region));
        button.classList.toggle("answer-highlight", p.interaction === "cut-number-sum" && state.stage === 2 && p.answer.cells.includes(region));
        button.disabled = state.busy || state.solved || (p.interaction === "cut-number-sum" && state.stage === 2);
        button.setAttribute("aria-label", t("rowCol", { row, col, part: triangles ? `, ${region.slice(-2)}` : "" }));
        cell.append(button);
      });
      gridEl.append(cell);
    }
  }
}

function renderReferenceGrid(gridEl, regions, type) {
  const triangles = regions.some((region) => region.includes("-"));
  for (let row = 1; row <= 4; row += 1) {
    for (let col = 1; col <= 4; col += 1) {
      const base = `r${row}c${col}`;
      const cell = document.createElement("div");
      cell.className = "grid-cell preview-cell";
      const parts = triangles ? ["nw", "ne", "sw", "se"] : [""];
      parts.forEach((part) => {
        const region = part ? `${base}-${part}` : base;
        if (!regions.includes(region)) return;
        const mark = document.createElement("span");
        mark.className = `preview-region ${type}${part ? ` triangle-${part}` : ""}`;
        cell.append(mark);
      });
      gridEl.append(cell);
    }
  }
}

function shapeHtml(shape, placement, index, tray = false) {
  const styles = tray ? "" : `style="left:${placement.x * 100}%;top:${placement.y * 100}%;--rotation:${placement.rotation}deg;--flip:${placement.flipped ? -1 : 1}"`;
  return `<button type="button" class="shape-piece shape-${shape}${state.selectedPlacement === index ? " selected" : ""}${tray ? " tray-shape" : ""}" ${styles} data-placement="${index}" data-shape="${shape}" aria-label="${t(tray ? "dragShape" : "moveShape", { shape })}"><span></span></button>`;
}

function givenShapeHtml(placement) {
  return `<span class="shape-piece given-piece shape-${placement.shape}" style="left:${placement.x * 100}%;top:${placement.y * 100}%;--rotation:${placement.rotation}deg;--flip:${placement.flipped ? -1 : 1}" aria-hidden="true"><span></span></span>`;
}

function renderPlacements() {
  const givens = ui.paper.querySelector(".shape-givens");
  const board = ui.paper.querySelector(".shape-board");
  problem().givens.forEach((placement) => givens.insertAdjacentHTML("beforeend", givenShapeHtml(placement)));
  state.placements.forEach((placement, index) => board.insertAdjacentHTML("beforeend", shapeHtml(placement.shape, placement, index)));
}

function renderInteraction() {
  const p = problem();
  const foldedOnly = state.folded && !state.busy;
  ui.interaction.replaceChildren();
  ui.rotate.hidden = p.interaction !== "shape-place" || !state.folded;
  ui.flip.hidden = p.interaction !== "shape-place" || !state.folded;
  ui.next.hidden = !state.solved;

  if (!state.folded) {
    ui.answerPrompt.textContent = t("foldFirst", { axis: axisText(p.fold.axis) });
    return;
  }
  if (["result-choice", "match"].includes(p.interaction)) {
    ui.answerPrompt.textContent = t(p.interaction === "match" ? "choiceMatch" : "choiceResult");
    ui.interaction.innerHTML = `<div class="result-choices">${p.choices.map((item) => resultChoiceHtml(item, p)).join("")}</div>`;
    ui.interaction.querySelectorAll("[data-choice]").forEach((button) => {
      button.disabled = !foldedOnly || state.solved;
      button.addEventListener("click", () => checkChoice(button.dataset.choice, button));
    });
    return;
  }
  if (["grid-select", "punch-select"].includes(p.interaction)) {
    const triangle = needsTriangles(p);
    const promptKey = p.action.type === "punch" ? (triangle ? "gridTrianglePunch" : "gridPunch") : (triangle ? "gridTriangleCut" : "gridCut");
    ui.answerPrompt.textContent = t(promptKey);
    ui.interaction.innerHTML = `<button class="check-button" type="button" ${foldedOnly ? "" : "disabled"}>${t("checkLocations")}</button>`;
    ui.interaction.querySelector("button").addEventListener("click", checkGrid);
    return;
  }
  if (p.interaction === "shape-place") {
    ui.answerPrompt.textContent = t("shapePlace");
    ui.interaction.innerHTML = `<div class="shape-tray" aria-label="${t("shapeTray")}">${p.tray.map((shape, index) => shapeHtml(shape, null, index, true)).join("")}</div><button class="check-button" type="button" ${foldedOnly ? "" : "disabled"}>${t("checkPlacement")}</button>`;
    ui.interaction.querySelectorAll(".tray-shape").forEach((button) => button.addEventListener("pointerdown", startTrayDrag));
    ui.interaction.querySelector(".check-button").addEventListener("click", checkPlacement);
    return;
  }
  if (p.interaction === "cut-number-sum") {
    renderSumInteraction(p, foldedOnly);
  }
}

function renderSumInteraction(p, foldedOnly) {
  if (state.stage === 1) {
    ui.answerPrompt.textContent = t("stage1");
    ui.interaction.innerHTML = `<button class="check-button" type="button" ${foldedOnly ? "" : "disabled"}>${t("checkSelected")}</button>`;
    ui.interaction.querySelector("button").addEventListener("click", checkSumRegions);
    return;
  }
  ui.answerPrompt.textContent = t("stage2", { expression: p.answer.expression });
  ui.interaction.innerHTML = `<div class="sum-entry"><span>${p.answer.values.join(" + ")} =</span><input id="sumInput" inputmode="numeric" pattern="[0-9]*" aria-label="${t("sumAria")}" autofocus><button class="check-button" type="button">${t("checkSum")}</button><button class="change-regions" type="button">${t("chooseAgain")}</button></div>`;
  ui.interaction.querySelector(".check-button").addEventListener("click", checkSum);
  ui.interaction.querySelector("#sumInput").addEventListener("keydown", (event) => { if (event.key === "Enter") checkSum(); });
  ui.interaction.querySelector(".change-regions").addEventListener("click", () => { state.stage = 1; renderAll(); });
}

async function foldPaper() {
  if (state.busy || state.solved || state.folded) return;
  state.busy = true;
  ui.paper.classList.add("folding");
  playTone("fold");
  await wait(520);
  state.folded = true;
  state.busy = false;
  renderAll();
  setGuide(t("afterFold"));
}

async function reverseUnfold() {
  state.busy = true;
  ui.paper.classList.add("unfolding");
  await wait(560);
  state.busy = false;
}

async function resolveCorrect() {
  if (state.busy || state.solved) return;
  await reverseUnfold();
  state.solved = true;
  rewardProblem();
  playTone("success");
  showSuccess();
  setGuide(t("correct"));
  renderAll();
}

function markWrong(button) {
  state.wrong += 1;
  playTone("wrong");
  button?.classList.add("wrong");
  setTimeout(() => button?.classList.remove("wrong"), 420);
  setGuide(t("wrong"));
}

function checkChoice(value, button) {
  if (state.busy || state.solved) return;
  if (value === problem().answer) resolveCorrect(); else markWrong(button);
}

function checkGrid(event) {
  if (state.busy || state.solved) return;
  if (equalSets(state.selections, problem().targetRegions)) resolveCorrect(); else { flashWrongRegions(problem().targetRegions); markWrong(event.currentTarget); }
}

function flashWrongRegions(expected) {
  const expectedSet = new Set(expected);
  const incorrect = [...state.selections].filter((region) => !expectedSet.has(region));
  const targets = incorrect.length ? incorrect.map((region) => ui.paper.querySelector(`[data-region="${region}"]`)).filter(Boolean) : [ui.paper.querySelector(".board-grid")].filter(Boolean);
  targets.forEach((element) => element.classList.add("wrong-region"));
  setTimeout(() => targets.forEach((element) => element.classList.remove("wrong-region")), 520);
}

function checkSumRegions(event) {
  const p = problem();
  if (state.busy || state.solved) return;
  if (!equalSets(state.selections, p.answer.cells)) { flashWrongRegions(p.answer.cells); return markWrong(event.currentTarget); }
  state.stage = 2;
  renderAll();
  setGuide(t("sumPlacesCorrect"));
}

function checkSum() {
  if (state.busy || state.solved || state.stage !== 2) return;
  const input = $("#sumInput");
  if (Number(input.value) === problem().answer.sum) resolveCorrect(); else markWrong(input);
}

function placementIsCorrect() {
  const p = problem();
  if (state.placements.length !== p.targets.length) return false;
  const unused = new Set(state.placements.map((_, index) => index));
  return p.targets.every((target) => {
    const match = [...unused].find((index) => {
      const item = state.placements[index];
      const orientationMatches = ["circle", "square"].includes(item.shape) || (normalizedRotation(item.rotation) === target.rotation && item.flipped === target.flipped);
      return item.shape === target.shape && Math.abs(item.x - target.x) < .075 && Math.abs(item.y - target.y) < .075 && orientationMatches;
    });
    if (match === undefined) return false;
    unused.delete(match);
    return true;
  });
}

function checkPlacement(event) {
  if (state.busy || state.solved) return;
  if (placementIsCorrect()) resolveCorrect(); else markWrong(event.currentTarget);
}

function updatePlacementElement(index) {
  const item = state.placements[index];
  const el = ui.paper.querySelector(`[data-placement="${index}"]`);
  if (!el || !item) return;
  el.style.left = `${item.x * 100}%`;
  el.style.top = `${item.y * 100}%`;
}

function bindDrag(index, event) {
  const move = (pointer) => {
    const rect = ui.paper.getBoundingClientRect();
    const item = state.placements[index];
    item.x = Math.max(.06, Math.min(.94, (pointer.clientX - rect.left) / rect.width));
    item.y = Math.max(.06, Math.min(.94, (pointer.clientY - rect.top) / rect.height));
    updatePlacementElement(index);
  };
  const end = () => {
    const item = state.placements[index];
    const near = problem().targets.find((target) => Math.abs(item.x - target.x) < .06 && Math.abs(item.y - target.y) < .06);
    if (near) { item.x = near.x; item.y = near.y; updatePlacementElement(index); }
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end, { once: true });
  move(event);
}

function startTrayDrag(event) {
  if (state.busy || state.solved) return;
  event.preventDefault();
  const p = problem();
  if (state.placements.length >= p.tray.length) return showToast(t("allPieces"));
  const placement = { shape: event.currentTarget.dataset.shape, x: .5, y: .5, rotation: 0, flipped: false };
  state.placements.push(placement);
  state.selectedPlacement = state.placements.length - 1;
  renderPaper();
  bindDrag(state.selectedPlacement, event);
}

function startPlacedDrag(event) {
  const button = event.target.closest("[data-placement]");
  if (!button || state.busy || state.solved) return;
  event.preventDefault();
  state.selectedPlacement = Number(button.dataset.placement);
  ui.paper.querySelectorAll(".shape-piece").forEach((piece) => piece.classList.remove("selected"));
  button.classList.add("selected");
  bindDrag(state.selectedPlacement, event);
}

function rotateSelected() {
  const item = state.placements[state.selectedPlacement];
  if (!item || state.busy || state.solved) return;
  item.rotation = normalizedRotation(item.rotation + 90);
  renderPaper();
}

function flipSelected() {
  const item = state.placements[state.selectedPlacement];
  if (!item || state.busy || state.solved) return;
  item.flipped = !item.flipped;
  renderPaper();
}

function toggleRegion(region) {
  const p = problem();
  if (state.busy || state.solved || !state.folded || (p.interaction === "cut-number-sum" && state.stage !== 1)) return;
  if (state.selections.has(region)) state.selections.delete(region); else state.selections.add(region);
  renderPaper();
}

function rewardProblem() {
  const id = `paper-fold:${problem().id}`;
  let rewards = [];
  try { rewards = JSON.parse(localStorage.getItem("gfield-rewarded-games") || "[]"); } catch { rewards = []; }
  if (!Array.isArray(rewards)) rewards = [];
  if (!rewards.includes(id)) {
    rewards.push(id);
    localStorage.setItem("gfield-rewarded-games", JSON.stringify(rewards));
    if (!state.hints && state.wrong === 0) localStorage.setItem("gfield-points", String(Number(localStorage.getItem("gfield-points") || 120) + 10));
  }
  saveGameProgress("paperFold", { level: state.level + 1, problemIndex: state.problem, queue: state.queue.map((item) => item.id), completedProblem: problem().id });
}

function showSuccess() {
  ui.success.querySelector("strong").textContent = ["GOOD JOB!", "GREAT JOB!", "SUCCESS!"][state.problem % 3];
  ui.success.classList.remove("show");
  void ui.success.offsetWidth;
  ui.success.classList.add("show");
}

function resetProblem() {
  state.folded = false; state.busy = false; state.solved = false; state.wrong = 0; state.hints = 0; state.selections = new Set(); state.placements = []; state.selectedPlacement = null; state.stage = 1;
  renderAll();
}

function nextProblem() {
  if (!state.solved) return;
  if (state.problem < state.queue.length - 1) {
    state.problem += 1;
    saveGameProgress("paperFold", { level: state.level + 1, problemIndex: state.problem, queue: state.queue.map((item) => item.id) });
    resetProblem();
  } else showComplete();
}

function showComplete() {
  $("#completeTitle").textContent = t("levelComplete", { level: state.level + 1 });
  $("#completeText").textContent = t("completeText");
  $("#nextLevelButton").textContent = state.level < 4 ? t("nextLevel") : t("studio");
  ui.complete.hidden = false;
}

function selectLevel(index) {
  state.level = Math.max(0, Math.min(4, index)); state.problem = 0; state.queue = createSession(state.level); ui.levelDialog.hidden = true; ui.complete.hidden = true;
  saveGameProgress("paperFold", { level: state.level + 1, problemIndex: 0, queue: state.queue.map((item) => item.id) });
  resetProblem();
}

function renderLevelList() {
  ui.levelList.replaceChildren();
  levels.forEach((level, index) => {
    const button = document.createElement("button");
    button.type = "button"; button.className = "level-card";
    button.innerHTML = `<span>${level.id}</span><strong>${title(level)}</strong><small>${description(level)}</small>`;
    button.addEventListener("click", () => selectLevel(index));
    ui.levelList.append(button);
  });
}

function renderAll() {
  const p = problem();
  const level = levels[state.level];
  $("#levelLabel").textContent = `LEVEL ${level.id}`;
  $("#problemLabel").textContent = `${state.problem + 1} / ${state.queue.length}`;
  $("#missionTitle").textContent = title(level);
  $("#stars").textContent = "*".repeat(level.id) + "-".repeat(5 - level.id);
  ui.prompt.textContent = state.solved ? t("solvedPrompt") : state.folded ? t("foldedPrompt", { axis: axisText(p.fold.axis) }) : t("readyPrompt", { axis: axisText(p.fold.axis) });
  ui.status.textContent = state.busy ? t("folding") : state.solved ? t("unfolded") : state.folded ? t("foldComplete") : t("tapCrease");
  renderPaper(); renderInteraction();
}

const tutorialKey = "gfield-paper-fold-tutorial-v2";
const tutorial = ["tutorial1", "tutorial2", "tutorial3"];
let tutorialStep = 0;
function openTutorial() {
  if (state.level || state.problem || localStorage.getItem(tutorialKey) === "done") return;
  ui.tutorial.hidden = false; renderTutorial();
}
function renderTutorial() {
  ui.tutorialText.textContent = t(tutorial[tutorialStep]);
  ui.tutorialDots.innerHTML = tutorial.map((_, index) => `<i class="${index === tutorialStep ? "active" : ""}"></i>`).join("");
  ui.tutorialNext.textContent = t(tutorialStep === tutorial.length - 1 ? "start" : "tutorialNext");
}

function applyLanguage() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : state.lang;
  document.title = `GFIELD ${title(levels[state.level])}`;
  $(".exit").setAttribute("aria-label", t("back"));
  $("#levelButton").textContent = t("levels");
  ui.rotate.textContent = t("rotate");
  ui.flip.textContent = t("flip");
  $("#hintButton").textContent = t("hint");
  $("#retryButton").textContent = t("retry");
  $(".tool-panel a").textContent = t("worksheet");
  ui.next.textContent = t("next");
  $("#dialogTitle").textContent = t("chooseLevel");
  $("#closeLevels").setAttribute("aria-label", t("close"));
  $("#practiceButton").textContent = t("practice");
  $(".complete-actions a").textContent = t("studio");
  $("#soundButton").textContent = state.audio ? "🔊" : "🔇";
  $("#soundButton").setAttribute("aria-label", t(state.audio ? "soundOn" : "soundOff"));
}

ui.paper.addEventListener("click", (event) => {
  const region = event.target.closest("[data-region]");
  if (region) return toggleRegion(region.dataset.region);
  if (event.target.closest("[data-fold]")) return foldPaper();
});
ui.paper.addEventListener("pointerdown", startPlacedDrag);
$("#hintButton").addEventListener("click", () => { state.hints += 1; const p = problem(); setGuide(state.folded ? t("hintFolded", { axis: axisText(p.fold.axis) }) : t("hintReady")); });
$("#retryButton").addEventListener("click", resetProblem);
ui.rotate.addEventListener("click", rotateSelected); ui.flip.addEventListener("click", flipSelected);
ui.next.addEventListener("click", nextProblem);
$("#levelButton").addEventListener("click", () => { ui.levelDialog.hidden = false; });
$("#closeLevels").addEventListener("click", () => { ui.levelDialog.hidden = true; });
ui.levelDialog.addEventListener("click", (event) => { if (event.target === ui.levelDialog) ui.levelDialog.hidden = true; });
ui.tutorialNext.addEventListener("click", () => { if (tutorialStep < tutorial.length - 1) { tutorialStep += 1; renderTutorial(); } else { localStorage.setItem(tutorialKey, "done"); ui.tutorial.hidden = true; setGuide(t("startGuide")); } });
$("#nextLevelButton").addEventListener("click", () => state.level < 4 ? selectLevel(state.level + 1) : location.assign("../../origami-studio/"));
$("#practiceButton").addEventListener("click", () => selectLevel(state.level));
$("#soundButton").addEventListener("click", (event) => { state.audio = !state.audio; localStorage.setItem("gfield-audio-muted", String(!state.audio)); event.currentTarget.classList.toggle("muted", !state.audio); applyLanguage(); });

applyLanguage();
renderLevelList();
renderAll();
setTimeout(openTutorial, 200);
