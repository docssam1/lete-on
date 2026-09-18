import { levels as foldLevels } from "../games/paper-fold/levels.js?v=paper-fold-8";
import { levels as turnLevels } from "../games/paper-turn/levels.js?v=paper-turn-1";
import { readProfile } from "../shared/profile-storage.js";

const $ = (selector) => document.querySelector(selector);
const lang = localStorage.getItem("gfield-language") || "ko";
const profile = readProfile();
const points = Number(localStorage.getItem("gfield-points") || 120);

const text = {
  ko:{worksheet:"학습지",title:"색종이 생각 놀이터",subtitle:"색종이를 한 번 접어 자르고 펼친 모양을 여러 방식으로 알아봐요.",courseOne:"COURSE 1 · 한 번 접어 자르기",foldCourseTitle:"접고, 자르고, 펼쳐 봐요",foldCourseDesc:"일반 반 접기와 대각선 접기 두 유형을 선택과 선 잇기로 유연하게 연습해요.",courseTwo:"COURSE 2 · 방향 추적",turnCourseTitle:"돌리고 뒤집은 결과를 찾아요",turnCourseDesc:"회전, 뒤집기와 여러 동작의 순서를 추적해요.",fiveEach:"기본 10문제 · 이어서 최대 20문제",fiveTurn:"레벨마다 10문제 · 한 번에 5문제",worksheetTitle:"색종이 접기 학습지",worksheetDesc:"접기 방향과 활동 유형을 골라 인쇄하고 풀이도 확인해요.",openWorksheet:"학습지 만들기",start:"시작하기",difficulty:"난이도"},
  zh:{worksheet:"练习纸",title:"折纸思维乐园",subtitle:"把彩纸对折一次，剪开并用多种方式判断展开图形。",courseOne:"课程 1 · 对折一次再剪",foldCourseTitle:"折叠、剪开、再展开",foldCourseDesc:"通过选择和连线练习普通对折与对角线对折。",courseTwo:"课程 2 · 方向追踪",turnCourseTitle:"找出旋转和翻转后的结果",turnCourseDesc:"追踪旋转、翻转和连续操作。",fiveEach:"默认10题 · 最多继续到20题",fiveTurn:"每级10题 · 每次5题",worksheetTitle:"折纸练习纸",worksheetDesc:"选择折叠方向和活动类型，并查看解题过程。",openWorksheet:"制作练习纸",start:"开始",difficulty:"难度"},
  ja:{worksheet:"プリント",title:"おりがみ思考ひろば",subtitle:"色紙を一回折って切り、開いた形をいろいろな方法で考えます。",courseOne:"コース 1 · 一回折って切る",foldCourseTitle:"折って、切って、開こう",foldCourseDesc:"普通の半分折りと対角線折りを、選択と線結びで練習します。",courseTwo:"コース 2 · 向きの追跡",turnCourseTitle:"回転・反転した結果を探そう",turnCourseDesc:"回転、反転、連続する動きを追います。",fiveEach:"基本10問 · 続けて最大20問",fiveTurn:"各レベル10問 · 1回5問",worksheetTitle:"おりがみプリント",worksheetDesc:"折る向きと活動を選び、解き方も確認できます。",openWorksheet:"プリントを作る",start:"スタート",difficulty:"難易度"},
  en:{worksheet:"Worksheet",title:"Paper Thinking Studio",subtitle:"Fold once, cut, and reason about the open shape in different ways.",courseOne:"COURSE 1 · Fold Once and Cut",foldCourseTitle:"Fold, cut, and open",foldCourseDesc:"Practise straight and diagonal half-folds through choices and matching.",courseTwo:"COURSE 2 · Direction Tracking",turnCourseTitle:"Find the result after turns and flips",turnCourseDesc:"Track rotations, flips, and sequences of moves.",fiveEach:"10 by default · continue up to 20",fiveTurn:"10 per level · 5 each session",worksheetTitle:"Paper Folding Worksheet",worksheetDesc:"Choose a fold direction and activity, with worked solutions.",openWorksheet:"Make Worksheet",start:"Start",difficulty:"Difficulty"}
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

renderLevels(foldLevels, "#foldLevelGrid", "paper-fold", ["#eb7f6a", "#57a7d7"]);
renderLevels(turnLevels, "#turnLevelGrid", "paper-turn", ["#57bba6", "#ec8c72", "#59a8da", "#8d75c9", "#e5b548"]);
