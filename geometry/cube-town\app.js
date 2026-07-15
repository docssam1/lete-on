import { groups, games } from "./catalog.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let language = localStorage.getItem("gfield-language") || "ko";

const messages = {
  ko: { back: "← 지도", printMode: "인쇄 학습", eyebrow: "CUBE LEARNING PATH", title: "쌓기나무로 여는 공간 사고의 세계", subtitle: "기초 조작부터 세 방향 추론까지, 단계별로 도전해요.", worksheet: "문제은행 학습지", worksheetDesc: "레벨과 문제 수를 골라 인쇄해요", level: "LEVEL", ready: "플레이", soon: "준비 중" },
  zh: { back: "← 地图", printMode: "打印学习", eyebrow: "CUBE LEARNING PATH", title: "用方块开启空间思维世界", subtitle: "从基础操作到三方向推理，逐级挑战。", worksheet: "题库练习纸", worksheetDesc: "选择等级和题量后打印", level: "等级", ready: "开始", soon: "即将推出" },
  ja: { back: "← 地図", printMode: "印刷学習", eyebrow: "CUBE LEARNING PATH", title: "つみきで広がる空間思考の世界", subtitle: "基本操作から三方向推理まで、段階的に挑戦します。", worksheet: "問題バンク学習プリント", worksheetDesc: "レベルと問題数を選んで印刷", level: "レベル", ready: "プレイ", soon: "準備中" },
  en: { back: "← Map", printMode: "Print Study", eyebrow: "CUBE LEARNING PATH", title: "A World of Spatial Thinking with Cubes", subtitle: "Progress from hands-on building to three-view reasoning.", worksheet: "Question Bank Worksheets", worksheetDesc: "Choose a level and question count, then print", level: "LEVEL", ready: "PLAY", soon: "COMING SOON" }
};

function t(key) { return messages[language]?.[key] || messages.ko[key] || key; }

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
      const element = document.createElement(game.ready ? "a" : "article");
      element.className = `game-card ${game.ready ? "ready" : "locked"}`;
      if (game.ready) element.href = game.href;
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
}

const profile = JSON.parse(localStorage.getItem("gfield-profile") || "{}");
const characterIndex = { cubi: 0, orbi: 1, pyra: 2, cylo: 3, recto: 4, arco: 5, coni: 6, pris: 7, nova: 8 }[profile.character] || 0;
$("#avatar").className = `avatar character-sprite sprite-${characterIndex} color-${profile.color || "original"}`;
$("#points").textContent = localStorage.getItem("gfield-points") || "120";
$$("[data-lang]").forEach((button) => button.addEventListener("click", () => {
  language = button.dataset.lang;
  localStorage.setItem("gfield-language", language);
  render();
}));
render();
