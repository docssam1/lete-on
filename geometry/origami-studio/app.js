import { levels as foldLevels } from "../games/paper-fold/levels.js?v=paper-fold-6";
import { levels as turnLevels } from "../games/paper-turn/levels.js?v=paper-turn-1";
import { readProfile } from "../shared/profile-storage.js";

const $ = (selector) => document.querySelector(selector);
const lang = localStorage.getItem("gfield-language") || "ko";
const profile = readProfile();
const points = Number(localStorage.getItem("gfield-points") || 120);

const text = {
  ko:{worksheet:"학습지",title:"색종이 생각 놀이터",subtitle:"접기 횟수와 방향, 자르기, 구멍, 숫자와 층의 순서를 차례로 익혀요.",courseOne:"COURSE 1 · 접기와 작업",foldCourseTitle:"접고 자르고, 층을 따라가요",foldCourseDesc:"한 번·두 번 접기, 구멍 뚫기, 숫자 색종이와 맨 위 수를 서로 다른 단계로 배워요.",courseTwo:"COURSE 2 · 방향 추적",turnCourseTitle:"돌리고 뒤집은 결과를 찾아요",turnCourseDesc:"회전, 뒤집기와 여러 동작의 순서를 추적해요.",fiveEach:"레벨마다 10문제 · 한 번에 5문제",worksheetTitle:"색종이 접기 학습지",worksheetDesc:"접기 횟수와 작업별 유형을 골라 인쇄하고 풀이도 확인해요.",openWorksheet:"학습지 만들기",start:"시작하기",difficulty:"난이도"},
  zh:{worksheet:"练习纸",title:"折纸思维乐园",subtitle:"逐步学习折叠次数、方向、剪切、打孔、数字和纸层顺序。",courseOne:"课程 1 · 折叠与操作",foldCourseTitle:"剪切、打孔并追踪纸层",foldCourseDesc:"分别学习一次折叠、两次折叠、打孔、数字折纸和最上层。",courseTwo:"课程 2 · 方向追踪",turnCourseTitle:"找出旋转和翻转后的结果",turnCourseDesc:"追踪旋转、翻转和连续操作。",fiveEach:"每级10题 · 每次5题",worksheetTitle:"折纸练习纸",worksheetDesc:"按折叠次数和操作类型选择题目，并查看解题过程。",openWorksheet:"制作练习纸",start:"开始",difficulty:"难度"},
  ja:{worksheet:"プリント",title:"おりがみ思考ひろば",subtitle:"折る回数と向き、切る、穴をあける、数、重なり順を段階的に学びます。",courseOne:"コース 1 · 折りと作業",foldCourseTitle:"切って、穴をあけて、重なりをたどろう",foldCourseDesc:"一回折り、二回折り、穴、数字おりがみ、一番上を別々に学びます。",courseTwo:"コース 2 · 向きの追跡",turnCourseTitle:"回転・反転した結果を探そう",turnCourseDesc:"回転、反転、連続する動きを追います。",fiveEach:"各レベル10問 · 1回5問",worksheetTitle:"おりがみプリント",worksheetDesc:"折る回数と作業別に問題を選び、解き方も確認できます。",openWorksheet:"プリントを作る",start:"スタート",difficulty:"難易度"},
  en:{worksheet:"Worksheet",title:"Paper Thinking Studio",subtitle:"Learn fold counts, directions, cutting, punching, numbers, and layer order one step at a time.",courseOne:"COURSE 1 · Folds and Actions",foldCourseTitle:"Cut, punch, and track the layers",foldCourseDesc:"Keep one fold, two folds, holes, number paper, and the top layer as distinct stages.",courseTwo:"COURSE 2 · Direction Tracking",turnCourseTitle:"Find the result after turns and flips",turnCourseDesc:"Track rotations, flips, and sequences of moves.",fiveEach:"10 per level · 5 each session",worksheetTitle:"Paper Folding Worksheet",worksheetDesc:"Choose worksheet types by fold count and action, with worked solutions.",openWorksheet:"Make Worksheet",start:"Start",difficulty:"Difficulty"}
};
const t = (key) => text[lang]?.[key] || text.ko[key];
const difficultyText = {
  입문: { ko:"입문", zh:"入门", ja:"入門", en:"Intro" },
  초급: { ko:"초급", zh:"初级", ja:"初級", en:"Beginner" },
  중급: { ko:"중급", zh:"中级", ja:"中級", en:"Intermediate" }
};
const difficulty = (value) => difficultyText[value]?.[lang] || value;

document.documentElement.lang = lang;
document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
$("#playerName").textContent = profile.name || "GFIELD";
$("#playerPoints").textContent = `${Number.isFinite(points) ? points : 120} P`;

function renderLevels(levels, selector, game, accents) {
  const grid = $(selector);
  levels.forEach((level, index) => {
    const card = document.createElement("a");
    card.className = "level-card";
    card.href = `../games/${game}/?level=${level.id}`;
    card.style.setProperty("--accent", accents[index]);
    card.innerHTML = `<div class="level-visual"><span class="level-number">${level.id}</span><span class="paper-stack" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="level-copy"><small class="level-stage">${level.difficulty ? `${t("difficulty")} · ${difficulty(level.difficulty)}` : ""}</small><strong>${level.title[lang] || level.title.ko}</strong><p>${level.description[lang] || level.description.ko}</p><span>${t("start")}</span></div>`;
    grid.append(card);
  });
}

renderLevels(foldLevels, "#foldLevelGrid", "paper-fold", ["#55b99c", "#57a7d7", "#8b72c7", "#eb7f6a", "#e7b83d"]);
renderLevels(turnLevels, "#turnLevelGrid", "paper-turn", ["#57bba6", "#ec8c72", "#59a8da", "#8d75c9", "#e5b548"]);
