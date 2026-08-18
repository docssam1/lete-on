import { levels as foldLevels } from "../games/paper-fold/levels.js?v=paper-fold-5";
import { levels as turnLevels } from "../games/paper-turn/levels.js?v=paper-turn-1";
import { readProfile } from "../shared/profile-storage.js";

const $ = (selector) => document.querySelector(selector);
const lang = localStorage.getItem("gfield-language") || "ko";
const profile = readProfile();
const points = Number(localStorage.getItem("gfield-points") || 120);

const text = {
  ko:{worksheet:"학습지",title:"색종이 생각 놀이터",subtitle:"접고 펼치고, 돌리고 뒤집으며 종이의 변화를 단계별로 익혀요.",courseOne:"COURSE 1 · 접고 펼치기",foldCourseTitle:"접은 종이를 펼치면?",foldCourseDesc:"한 번 접기, 작업 위치, 대칭 도형과 잘린 수를 익혀요.",courseTwo:"COURSE 2 · 접고 돌리고 뒤집기",turnCourseTitle:"방향을 끝까지 따라가요",turnCourseDesc:"뒤집기, 돌리기와 여러 동작의 순서를 추적해요.",fiveEach:"레벨마다 10문제 · 한 번에 5문제",worksheetTitle:"색종이 접기 학습지",worksheetDesc:"두 과정의 게임 유형을 골라 섞어 인쇄하고 풀이도 확인해요.",openWorksheet:"학습지 만들기",start:"시작하기"},
  zh:{worksheet:"练习纸",title:"折纸思维乐园",subtitle:"通过折叠、展开、旋转和翻转逐步理解纸张变化。",courseOne:"课程 1 · 折叠与展开",foldCourseTitle:"折纸展开后是什么？",foldCourseDesc:"学习一次折叠、操作位置、对称图形和剪去数字。",courseTwo:"课程 2 · 旋转与翻转",turnCourseTitle:"追踪每一个方向",turnCourseDesc:"学习翻转、旋转和连续动作顺序。",fiveEach:"每级10题 · 每次5题",worksheetTitle:"折纸练习纸",worksheetDesc:"选择并混合两个课程的游戏题型，还能查看解题过程。",openWorksheet:"制作练习纸",start:"开始"},
  ja:{worksheet:"プリント",title:"おりがみ思考ひろば",subtitle:"折る・開く・回す・裏返す変化を段階的に学びます。",courseOne:"コース 1 · 折って開く",foldCourseTitle:"折った紙を開くと？",foldCourseDesc:"一回折り、作業位置、対称の形、切った数を学びます。",courseTwo:"コース 2 · 回して裏返す",turnCourseTitle:"向きを最後までたどろう",turnCourseDesc:"裏返し、回転、連続する動きの順番を追います。",fiveEach:"各レベル10問 · 1回5問",worksheetTitle:"おりがみプリント",worksheetDesc:"2コースの問題を選んで混ぜ、解き方も確認できます。",openWorksheet:"プリントを作る",start:"スタート"},
  en:{worksheet:"Worksheet",title:"Paper Thinking Studio",subtitle:"Learn paper transformations by folding, opening, turning, and flipping.",courseOne:"COURSE 1 · Fold and Open",foldCourseTitle:"What appears when it opens?",foldCourseDesc:"Practice one fold, work positions, symmetry, and cut-away sums.",courseTwo:"COURSE 2 · Turn and Flip",turnCourseTitle:"Follow every direction",turnCourseDesc:"Track flips, rotations, and sequences of moves.",fiveEach:"10 per level · 5 each session",worksheetTitle:"Paper Folding Worksheet",worksheetDesc:"Choose and mix game types from both courses with worked solutions.",openWorksheet:"Make Worksheet",start:"Start"}
};
const t = (key) => text[lang]?.[key] || text.ko[key];

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
    card.innerHTML = `<div class="level-visual"><span class="level-number">${level.id}</span><span class="paper-stack" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="level-copy"><strong>${level.title[lang] || level.title.ko}</strong><p>${level.description[lang] || level.description.ko}</p><span>${t("start")}</span></div>`;
    grid.append(card);
  });
}

renderLevels(foldLevels, "#foldLevelGrid", "paper-fold", ["#55b99c", "#57a7d7", "#8b72c7", "#eb7f6a", "#e7b83d"]);
renderLevels(turnLevels, "#turnLevelGrid", "paper-turn", ["#57bba6", "#ec8c72", "#59a8da", "#8d75c9", "#e5b548"]);
