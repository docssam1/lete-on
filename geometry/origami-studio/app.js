import { levels as foldLevels } from "../games/paper-fold/levels.js?v=paper-fold-9";
import { levels as turnLevels } from "../games/paper-turn/levels.js?v=paper-turn-1";
import { readProfile } from "../shared/profile-storage.js";

const $ = (selector) => document.querySelector(selector);
const lang = localStorage.getItem("gfield-language") || "ko";
const profile = readProfile();
const points = Number(localStorage.getItem("gfield-points") || 120);

const text = {
  ko:{worksheet:"학습지",title:"색종이 생각 놀이터",subtitle:"색종이를 접고 펼치며 자르기, 구멍, 계산과 순서를 알아봐요.",courseOne:"COURSE 1 · 접고 펼치기",foldCourseTitle:"자르고, 뚫고, 펼쳐 봐요",foldCourseDesc:"접어 자르기와 구멍 뚫기를 섞지 않고 각각 연습해요.",courseTwo:"COURSE 2 · 계산과 순서",applicationTitle:"접은 결과로 계산하고 순서를 찾아요",applicationDesc:"잘린 수의 합과 남은 수의 합, 겹친 색종이의 위아래 순서를 따로 연습해요.",applicationCount:"기존 문제은행 연계 학습지",courseThree:"COURSE 3 · 방향 추적",turnCourseTitle:"돌리고 뒤집은 결과를 찾아요",turnCourseDesc:"회전, 뒤집기와 여러 동작의 순서를 추적해요.",fiveEach:"기본 10문제 · 이어서 최대 20문제",fiveTurn:"레벨마다 10문제 · 한 번에 5문제",worksheetTitle:"색종이 접기 학습지",worksheetDesc:"접기 방향과 활동 유형을 골라 인쇄하고 풀이도 확인해요.",openWorksheet:"학습지 만들기",start:"시작하기",difficulty:"난이도"},
  zh:{worksheet:"练习纸",title:"折纸思维乐园",subtitle:"通过折叠和展开学习剪纸、打孔、计算与顺序。",courseOne:"课程 1 · 折叠与展开",foldCourseTitle:"剪开、打孔、再展开",foldCourseDesc:"分别练习折叠剪纸和折叠打孔。",courseTwo:"课程 2 · 计算与顺序",applicationTitle:"根据折叠结果计算并判断顺序",applicationDesc:"分别练习剪掉与剩下数字的和，以及彩纸的上下顺序。",applicationCount:"连接现有题库练习纸",courseThree:"课程 3 · 方向追踪",turnCourseTitle:"找出旋转和翻转后的结果",turnCourseDesc:"追踪旋转、翻转和连续操作。",fiveEach:"默认10题 · 最多继续到20题",fiveTurn:"每级10题 · 每次5题",worksheetTitle:"折纸练习纸",worksheetDesc:"选择折叠方向和活动类型，并查看解题过程。",openWorksheet:"制作练习纸",start:"开始",difficulty:"难度"},
  ja:{worksheet:"プリント",title:"おりがみ思考ひろば",subtitle:"色紙を折って開き、切り方、穴、計算、順序を考えます。",courseOne:"コース 1 · 折って開く",foldCourseTitle:"切って、穴をあけて、開こう",foldCourseDesc:"切る活動と穴をあける活動を分けて練習します。",courseTwo:"コース 2 · 計算と順序",applicationTitle:"折った結果から計算と順序を考えよう",applicationDesc:"切った数・残った数の和と、重なった色紙の順序を練習します。",applicationCount:"既存問題バンクのプリント",courseThree:"コース 3 · 向きの追跡",turnCourseTitle:"回転・反転した結果を探そう",turnCourseDesc:"回転、反転、連続する動きを追います。",fiveEach:"基本10問 · 続けて最大20問",fiveTurn:"各レベル10問 · 1回5問",worksheetTitle:"おりがみプリント",worksheetDesc:"折る向きと活動を選び、解き方も確認できます。",openWorksheet:"プリントを作る",start:"スタート",difficulty:"難易度"},
  en:{worksheet:"Worksheet",title:"Paper Thinking Studio",subtitle:"Fold and open paper to explore cutting, holes, calculation, and order.",courseOne:"COURSE 1 · Fold and Open",foldCourseTitle:"Cut, punch, and open",foldCourseDesc:"Practice fold-and-cut separately from fold-and-punch.",courseTwo:"COURSE 2 · Calculation and Order",applicationTitle:"Calculate and find order from folded results",applicationDesc:"Practice cut and remaining sums separately from overlapping paper order.",applicationCount:"Linked question-bank worksheets",courseThree:"COURSE 3 · Direction Tracking",turnCourseTitle:"Find the result after turns and flips",turnCourseDesc:"Track rotations, flips, and sequences of moves.",fiveEach:"10 by default · continue up to 20",fiveTurn:"10 per level · 5 each session",worksheetTitle:"Paper Folding Worksheet",worksheetDesc:"Choose a fold direction and activity, with worked solutions.",openWorksheet:"Make Worksheet",start:"Start",difficulty:"Difficulty"}
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

const applicationActivities = [
  {
    title:{ko:"접어 계산하기",zh:"折叠计算",ja:"折って計算する",en:"Fold and Calculate"},
    description:{ko:"잘린 수·남은 수의 합과 목표 합 역문제를 풀어요.",zh:"计算剪掉或剩下数字的和，并解决逆向目标和问题。",ja:"切った数・残った数の和と逆向きの問題を解きます。",en:"Find cut and remaining sums, then solve inverse target-sum problems."},
    href:"../worksheet/paper-fold/?modes=numcut,numsum,numinv,foldtop&count=10",stage:{ko:"수와 연산",zh:"数与运算",ja:"数と計算",en:"Number"}
  },
  {
    title:{ko:"겹친 색종이 순서",zh:"叠放彩纸顺序",ja:"重なった色紙の順序",en:"Overlapping Paper Order"},
    description:{ko:"보이는 부분을 비교해 가장 위·아래와 전체 순서를 찾아요.",zh:"比较可见部分，找出最上、最下和完整顺序。",ja:"見える部分を比べ、上下と全体の順序を考えます。",en:"Compare visible regions to find the top, bottom, and full order."},
    href:"../worksheet/paper-fold/?modes=stackfind,stackorder&count=10",stage:{ko:"순서 추론",zh:"顺序推理",ja:"順序推理",en:"Order"}
  }
];

function renderApplications(){
  const grid=$("#applicationGrid");
  applicationActivities.forEach((activity,index)=>{
    const card=document.createElement("a");
    card.className="level-card";
    card.href=activity.href;
    card.style.setProperty("--accent",["#e5b548","#57bba6"][index]);
    card.innerHTML=`<div class="level-visual"><span class="level-number">${index+1}</span><span class="paper-stack" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="level-copy"><small class="level-stage">${activity.stage[lang]||activity.stage.ko}</small><strong>${activity.title[lang]||activity.title.ko}</strong><p>${activity.description[lang]||activity.description.ko}</p><span>${t("openWorksheet")}</span></div>`;
    grid.append(card);
  });
}

renderApplications();
renderLevels(turnLevels, "#turnLevelGrid", "paper-turn", ["#57bba6", "#ec8c72", "#59a8da", "#8d75c9", "#e5b548"]);
