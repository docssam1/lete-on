const SHAPES = {
  L: [[0, 0], [0, 1], [1, 1]],
  T: [[0, 0], [1, 0], [2, 0], [1, 1]],
  S: [[1, 0], [2, 0], [0, 1], [1, 1]],
  I: [[0, 0], [1, 0], [2, 0]],
  O: [[0, 0], [1, 0], [0, 1], [1, 1]],
  P: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]]
};

const ACTIVITIES = [
  { id: "same", track: "kinder", icon: "=", ko: ["같은 모양 찾기", "돌려도 같은 조각을 찾아요."], en: ["Find the Same Shape", "Find the piece that is still the same after a turn."], zh: ["找相同图形", "找出旋转后仍相同的拼片。"], ja: ["同じ形を探す", "回しても同じピースを探します。"], target: "L", choices: ["T", "L", "S"], answer: 1 },
  { id: "gap", track: "kinder", icon: "+", ko: ["빈칸 완성하기", "빈자리에 꼭 맞는 조각을 골라요."], en: ["Fill the Gap", "Choose the piece that fits the empty space."], zh: ["补上空格", "选择正好放进空格的拼片。"], ja: ["空きをうめる", "空いた所にぴったりのピースを選びます。"], target: "T", choices: ["L", "T", "O"], answer: 1 },
  { id: "hide", track: "kinder", icon: "o", ko: ["보이게 가리기", "필요한 그림만 남게 할 조각을 골라요."], en: ["Cover and Reveal", "Choose a piece to leave only what you need to see."], zh: ["遮住再发现", "选择拼片，只留下需要看的图案。"], ja: ["かくして見つける", "見たいものだけ残すピースを選びます。"], target: "O", choices: ["I", "O", "L"], answer: 1 },
  { id: "blanket", track: "kinder", icon: "#", ko: ["담요 만들기", "같은 조각으로 판을 덮을 수 있는 모양을 찾아요."], en: ["Make a Blanket", "Find the shape that can cover the little board."], zh: ["制作小毯子", "找出可以盖满小棋盘的形状。"], ja: ["毛布を作る", "小さな板をおおえる形を探します。"], target: "I", choices: ["S", "I", "T"], answer: 1 },
  { id: "move", track: "kids", icon: "1", ko: ["한 칸만 옮기기", "한 칸을 옮긴 뒤 생기는 모양을 찾아요."], en: ["Move One Cell", "Find the shape after moving one square."], zh: ["只移动一格", "找出移动一格后形成的图形。"], ja: ["一マス動かす", "一マス動かしたあとの形を探します。"], target: "S", choices: ["T", "S", "L"], answer: 1 },
  { id: "missing", track: "kids", icon: "?", ko: ["빠진 조각 찾기", "그림을 완성할 마지막 조각을 찾아요."], en: ["Find the Missing Piece", "Find the last piece needed to finish the picture."], zh: ["找缺少的拼片", "找出完成图形的最后一块。"], ja: ["足りないピース", "形を完成させる最後のピースを探します。"], target: "P", choices: ["P", "T", "S"], answer: 0 },
  { id: "two", track: "kids", icon: "2", ko: ["두 가지 방법 찾기", "같은 모양을 만드는 또 다른 방법을 찾아요."], en: ["Find Another Way", "Find another way to make the same shape."], zh: ["寻找另一种方法", "找出组成同一图形的另一种方法。"], ja: ["もう一つの方法", "同じ形を作る別の方法を探します。"], target: "L", choices: ["S", "L", "T"], answer: 1 }
];

const copy = {
  ko: { name: "조각 놀이", kinder: "킨더", kids: "키즈", types: "게임 유형", chooseType: "어떤 조각 놀이를 할까요?", typeDescription: "유형을 고른 뒤 문제를 시작해요.", choose: "알맞은 조각을 눌러 보세요.", good: "맞아요! 다음 유형도 해 볼까요?", again: "다시 살펴봐요.", next: "다음 유형", start: "시작하기", backToTypes: "유형 고르기" },
  en: { name: "Piece Play", kinder: "Kinder", kids: "Kids", types: "Game Types", chooseType: "Which piece game will you play?", typeDescription: "Choose a game type, then start a problem.", choose: "Tap the piece that fits.", good: "That is right! Try the next type?", again: "Look one more time.", next: "Next type", start: "Start", backToTypes: "Choose a type" },
  zh: { name: "拼片游戏", kinder: "幼儿", kids: "儿童", types: "游戏类型", chooseType: "想玩哪一种拼片游戏？", typeDescription: "先选择游戏类型，再开始题目。", choose: "点击合适的拼片。", good: "答对了！试试下一个类型吧？", again: "再看一看。", next: "下一个类型", start: "开始", backToTypes: "选择类型" },
  ja: { name: "ピースあそび", kinder: "キンダー", kids: "キッズ", types: "ゲームの種類", chooseType: "どのピースあそびをする？", typeDescription: "種類を選んでから問題を始めます。", choose: "合うピースを押してみよう。", good: "正解！次の種類もやってみよう。", again: "もう一度見てみよう。", next: "次の種類", start: "スタート", backToTypes: "種類を選ぶ" }
};

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const lang = localStorage.getItem("gfield-language") || "ko";
const ui = copy[lang] || copy.ko;
let activeTrack = params.get("track") === "kids" ? "kids" : "kinder";
let activeId = null;
let solved = false;

function activitiesFor(track) { return ACTIVITIES.filter((item) => item.track === track); }
function activityFor(track, id) { return activitiesFor(track).find((item) => item.id === id) || null; }
function activeActivity() { return ACTIVITIES.find((item) => item.id === activeId); }
function labels(item) { return item[lang] || item.en; }
function trackName(track) { return track === "kids" ? ui.kids : ui.kinder; }

function renderShape(node, shape, className = "") {
  const data = SHAPES[shape];
  const cols = Math.max(...data.map(([x]) => x)) + 1;
  const rows = Math.max(...data.map(([, y]) => y)) + 1;
  node.className = `piece ${className}`;
  node.style.setProperty("--cols", cols);
  node.style.setProperty("--rows", rows);
  data.forEach(([x, y]) => {
    const cell = document.createElement("i");
    cell.style.gridColumn = x + 1;
    cell.style.gridRow = y + 1;
    node.append(cell);
  });
}

function setRoute(track, activityId = null) {
  activeTrack = track;
  activeId = activityFor(track, activityId)?.id || null;
  const next = new URLSearchParams({ track });
  if (activityId) next.set("activity", activityId);
  history.pushState({}, "", `?${next}`);
  render();
}

function renderCatalog() {
  $("#playView").hidden = true;
  $("#typeLobby").hidden = false;
  $("#backLink").href = "../../shape-garden/";
  $("#backLink").setAttribute("aria-label", "Back to Shape Garden");
  $("#subtitle").textContent = ui.name;
  $("#trackLabel").textContent = ui.types;
  $("#eyebrow").textContent = `${ui.name.toUpperCase()} · ${ui.types.toUpperCase()}`;
  $("#title").textContent = ui.name;
  $("#description").textContent = ui.typeDescription;
  $("#lobbyEyebrow").textContent = `${trackName(activeTrack)} · ${ui.types}`;
  $("#lobbyTitle").textContent = ui.chooseType;
  $("#lobbyDescription").textContent = ui.typeDescription;

  const tabs = $("#trackTabs");
  tabs.replaceChildren();
  ["kinder", "kids"].forEach((track) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = track === activeTrack ? "active" : "";
    button.textContent = trackName(track);
    button.addEventListener("click", () => setRoute(track));
    tabs.append(button);
  });

  const cards = $("#typeCards");
  cards.replaceChildren();
  activitiesFor(activeTrack).forEach((item, index) => {
    const [title, description] = labels(item);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "type-card";
    button.setAttribute("aria-label", `${title} ${ui.start}`);
    const preview = document.createElement("span");
    preview.className = "type-preview";
    const shape = document.createElement("span");
    renderShape(shape, item.target);
    preview.append(shape);
    const text = document.createElement("span");
    text.className = "type-card-copy";
    text.innerHTML = `<b>${String(index + 1).padStart(2, "0")}</b><strong>${title}</strong><small>${description}</small><em>${ui.start} ›</em>`;
    button.append(preview, text);
    button.addEventListener("click", () => setRoute(activeTrack, item.id));
    cards.append(button);
  });
}

function renderGame() {
  const item = activeActivity();
  if (!item) { renderCatalog(); return; }
  const [title, description] = labels(item);
  const items = activitiesFor(activeTrack);
  const position = items.findIndex((entry) => entry.id === item.id);
  $("#typeLobby").hidden = true;
  $("#playView").hidden = false;
  $("#backLink").href = `?track=${activeTrack}`;
  $("#backLink").setAttribute("aria-label", ui.backToTypes);
  $("#subtitle").textContent = ui.name;
  $("#trackLabel").textContent = trackName(activeTrack);
  $("#eyebrow").textContent = `${trackName(activeTrack)} · ${ui.types} ${position + 1} / ${items.length}`;
  $("#title").textContent = title;
  $("#description").textContent = description;
  $("#step").textContent = `${trackName(activeTrack)} · ${item.icon}`;
  $("#prompt").textContent = title;
  $("#hint").textContent = ui.choose;
  $("#feedback").textContent = "";
  $("#next").hidden = true;
  solved = false;

  const target = $("#target");
  target.replaceChildren();
  renderShape(target, item.target, "target-piece");
  const choices = $("#choices");
  choices.replaceChildren();
  item.choices.forEach((shape, choiceIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.setAttribute("aria-label", `${title} ${choiceIndex + 1}`);
    renderShape(button, shape);
    button.addEventListener("click", () => judge(choiceIndex, button));
    choices.append(button);
  });

  const list = $("#activityList");
  list.replaceChildren();
  items.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = entry.id === item.id ? "active" : "";
    button.textContent = labels(entry)[0];
    button.addEventListener("click", () => setRoute(activeTrack, entry.id));
    list.append(button);
  });
}

function judge(choiceIndex, button) {
  if (solved) return;
  const item = activeActivity();
  if (choiceIndex === item.answer) {
    solved = true;
    button.classList.add("correct");
    $("#feedback").textContent = ui.good;
    $("#next").textContent = ui.next;
    $("#next").hidden = false;
  } else {
    button.classList.add("wrong");
    $("#feedback").textContent = ui.again;
    setTimeout(() => button.classList.remove("wrong"), 500);
  }
}

$("#next").addEventListener("click", () => {
  const items = activitiesFor(activeTrack);
  const current = items.findIndex((item) => item.id === activeId);
  setRoute(activeTrack, items[(current + 1) % items.length].id);
});

window.addEventListener("popstate", () => {
  const next = new URLSearchParams(location.search);
  activeTrack = next.get("track") === "kids" ? "kids" : "kinder";
  activeId = activityFor(activeTrack, next.get("activity"))?.id || null;
  render();
});

activeId = activityFor(activeTrack, params.get("activity"))?.id || null;
function render() { if (activeId) renderGame(); else renderCatalog(); }
render();
