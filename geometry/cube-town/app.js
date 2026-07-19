import { groups, games } from "./catalog.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let language = localStorage.getItem("gfield-language") || "ko";

const copyLevelText = {
  ko: { title: "똑같이 쌓기", subtitle: "도전할 레벨을 골라 바로 시작해요.", close: "닫기", done: "완료!" },
  zh: { title: "搭出相同形状", subtitle: "选择等级并开始挑战。", close: "关闭", done: "完成！" },
  ja: { title: "同じ形を作ろう", subtitle: "挑戦するレベルを選んで始めよう。", close: "閉じる", done: "クリア！" },
  en: { title: "Copy the Build", subtitle: "Choose a level and start building.", close: "Close", done: "DONE!" }
};

// A copy-build level is COMPLETE when every one of its 10 problems has been
// solved (each solve writes `copy-build:{levelIndex}:{problemIndex}` into
// gfield-rewarded-games). Levels 4-5 run in shape-build, which has no solve
// tracking yet, so they never show the badge.
function completedCopyLevels() {
  let solved;
  try { solved = new Set(JSON.parse(localStorage.getItem("gfield-rewarded-games") || "[]")); }
  catch { solved = new Set(); }
  const done = new Set();
  for (let li = 0; li < 3; li += 1) {
    let count = 0;
    for (let pi = 0; pi < 10; pi += 1) {
      if (solved.has(`copy-build:${li}:${pi}`)) count += 1;
    }
    if (count >= 10) done.add(li + 1);
  }
  return done;
}

const copyLevels = [
  {
    level: 1, image: "./assets/copy-levels/level-1.png", href: "../games/copy-build/?level=1",
    title: { ko: "큐브 기초", zh: "方块基础", ja: "キューブの基本", en: "Cube Basics" },
    description: { ko: "낮은 원목과 컴러 모양을 따라 쌓아요.", zh: "搭出较低的木色和彩色形状。", ja: "低い木目とカラーの形を作ります。", en: "Copy low wooden and colored builds." }
  },
  {
    level: 2, image: "./assets/copy-levels/level-2.png", href: "../games/copy-build/?level=2",
    title: { ko: "입체 쌓기", zh: "立体搭建", ja: "立体を積む", en: "Build in 3D" },
    description: { ko: "3×3×3 안에서 높이와 색을 맞추요.", zh: "在3×3×3内匹配高度和颜色。", ja: "3×3×3で高さと色を合わせます。", en: "Match height and color in a 3×3×3 space." }
  },
  {
    level: 3, image: "./assets/copy-levels/level-3.png", href: "../games/copy-build/?level=3",
    title: { ko: "컴러와 큰 구조", zh: "颜色与大型结构", ja: "カラーと大きな形", en: "Color & Larger Builds" },
    description: { ko: "색 위치와 4×4×4 원목 구조에 도전해요.", zh: "挑战颜色位置和4×4×4木制结构。", ja: "色の位置と4×4×4の木目構造に挑戦します。", en: "Tackle color positions and 4×4×4 wooden builds." }
  },
  {
    level: 4, image: "./assets/copy-levels/level-4.png", href: "../games/shape-build/?level=4",
    title: { ko: "직육면체 방향", zh: "长方体方向", ja: "直方体の向き", en: "Rectangular Prisms" },
    description: { ko: "직육면체를 늽히고 세워 방향까지 맞추요.", zh: "横放或竖放长方体并匹配方向。", ja: "直方体を寝かせたり立てたりして向きを合わせます。", en: "Turn and stand rectangular prisms to match." }
  },
  {
    level: 5, image: "./assets/copy-levels/level-5.png", href: "../games/shape-build/?level=5",
    title: { ko: "여러 입체 만들기", zh: "组合多种立体", ja: "いろいろな立体", en: "Mixed Shape Studio" },
    description: { ko: "정육면체·직육면체·삼각기둥과 뿔로 만들어요.", zh: "用正方体、长方体、三棱柱和锥体创作。", ja: "立方体・直方体・三角柱・すいで作ります。", en: "Create with cubes, prisms, triangular prisms, and cones." }
  }
];

const messages = {
  ko: { back: "← 지도", eyebrow: "CUBE LEARNING PATH", title: "쌓기나무로 여는 공간 사고의 세계", subtitle: "기초 조작부터 세 방향 추론까지, 단계별로 도전해요.", worksheet: "문제은행 학습지", worksheetDesc: "레벨과 문제 수를 골라 인쇄해요", level: "LEVEL", ready: "플레이", soon: "준비 중" },
  zh: { back: "← 地图", eyebrow: "CUBE LEARNING PATH", title: "用方块开启空间思维世界", subtitle: "从基础操作到三方向推理，逐级挑战。", worksheet: "题库练习纸", worksheetDesc: "选择等级和题量后打印", level: "等级", ready: "开始", soon: "即将推出" },
  ja: { back: "← 地図", eyebrow: "CUBE LEARNING PATH", title: "つみきで広がる空間思考の世界", subtitle: "基本操作から三方向推理まで、段階的に挑戦します。", worksheet: "問題バンク学習プリント", worksheetDesc: "レベルと問題数を選んで印刷", level: "レベル", ready: "プレイ", soon: "準備中" },
  en: { back: "← Map", eyebrow: "CUBE LEARNING PATH", title: "A World of Spatial Thinking with Cubes", subtitle: "Progress from hands-on building to three-view reasoning.", worksheet: "Question Bank Worksheets", worksheetDesc: "Choose a level and question count, then print", level: "LEVEL", ready: "PLAY", soon: "COMING SOON" }
};

function t(key) { return messages[language]?.[key] || messages.ko[key] || key; }

function renderCopyLevelDialog() {
  const text = copyLevelText[language] || copyLevelText.ko;
  $("#copyLevelTitle").textContent = text.title;
  $("#copyLevelSubtitle").textContent = text.subtitle;
  $("#closeCopyLevelDialog").setAttribute("aria-label", text.close);
  const options = $("#copyLevelOptions");
  const done = completedCopyLevels();
  options.replaceChildren();
  copyLevels.forEach((entry) => {
    const isDone = done.has(entry.level);
    const link = document.createElement("a");
    link.className = `copy-level-card${isDone ? " completed" : ""}`;
    link.href = entry.href;
    link.innerHTML = `
      <img src="${entry.image}" alt="" />
      ${isDone ? `<span class="copy-level-done">✓ ${text.done}</span>` : ""}
      <span class="copy-level-number">LEVEL ${entry.level}</span>
      <strong>${entry.title[language] || entry.title.ko}</strong>
      <p>${entry.description[language] || entry.description.ko}</p>
      <b aria-hidden="true">→</b>
    `;
    options.append(link);
  });
}

function openCopyLevelDialog() {
  renderCopyLevelDialog();
  $("#copyLevelDialog").hidden = false;
  document.body.classList.add("dialog-open");
  $("#closeCopyLevelDialog").focus();
}

function closeCopyLevelDialog() {
  $("#copyLevelDialog").hidden = true;
  document.body.classList.remove("dialog-open");
  document.querySelector('[data-game-id="copy-build"]')?.focus();
}

function render() {
  document.documentElement.lang = language;
  $$("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  $$("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === language));
  $("#levelGroups").replaceChildren();

  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = `level-section level-${group.color}`;
    section.innerHTML = `
      <header>
        <span>${t("level")} ${group.level}</span>
        <h2>${group.title[language] || group.title.ko}</h2>
      </header>
      <div class="game-grid"></div>
    `;
    const grid = section.querySelector(".game-grid");
    games.filter((game) => game.group === group.id).forEach((game) => {
      const copyBuild = game.id === "copy-build";
      const element = document.createElement(game.ready ? (copyBuild ? "button" : "a") : "article");
      element.className = `game-card ${game.ready ? "ready" : "locked"}`;
      if (game.ready && !copyBuild) element.href = game.href;
      if (copyBuild) {
        element.type = "button";
        element.dataset.gameId = game.id;
        element.addEventListener("click", openCopyLevelDialog);
      }
      element.innerHTML = `
        <div class="game-thumb thumb-${game.thumb}">
          <span class="thumb-art"><i></i><i></i><i></i><i></i></span>
          <span class="card-status">${t(game.ready ? "ready" : "soon")}</span>
          <span class="game-level">${game.levels}</span>
        </div>
        <div class="game-copy">
          <span class="game-number">${game.number}</span>
          <h3>${game.name[language] || game.name.ko}</h3>
          <p>${game.description[language] || game.description.ko}</p>
        </div>
      `;
      grid.append(element);
    });
    $("#levelGroups").append(section);
  });
  renderCopyLevelDialog();
}

const profile = JSON.parse(localStorage.getItem("gfield-profile") || "{}");
const characterIndex = { cubi: 0, orbi: 1, pyra: 2, cylo: 3, recto: 4, arco: 5, coni: 6, pris: 7, nova: 8 }[profile.character] || 0;
$("#avatar").className = `avatar character-sprite sprite-${characterIndex} color-${profile.color || "original"}`;
$("#playerName").textContent = profile.name || "";
$("#points").textContent = localStorage.getItem("gfield-points") || "120";
$$("[data-lang]").forEach((button) => button.addEventListener("click", () => {
  language = button.dataset.lang;
  localStorage.setItem("gfield-language", language);
  render();
}));
$("#closeCopyLevelDialog").addEventListener("click", closeCopyLevelDialog);
$("#copyLevelDialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeCopyLevelDialog();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#copyLevelDialog").hidden) closeCopyLevelDialog();
});
render();
