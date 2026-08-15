import { levels } from "../games/paper-fold/levels.js?v=paper-fold-5";
import { readProfile } from "../shared/profile-storage.js";

const $ = (selector) => document.querySelector(selector);
const lang = localStorage.getItem("gfield-language") || "ko";
const profile = readProfile();
const points = Number(localStorage.getItem("gfield-points") || 120);

const text = {
  ko:{worksheet:"학습지",title:"색종이 접기",subtitle:"한 번 접기부터 잘려 나간 수 더하기까지, 한 단계씩 익혀요.",course:"5단계 코스",choose:"시작할 레벨을 골라요",fiveEach:"레벨마다 10문제 · 한 번에 5문제",worksheetTitle:"색종이 접기 학습지",worksheetDesc:"게임과 같은 유형을 섞어 인쇄하고 풀이도 확인해요.",openWorksheet:"학습지 만들기",start:"시작하기"},
  zh:{worksheet:"练习纸",title:"折纸",subtitle:"从一次对折到计算剪去数字的和，一步一步学习。",course:"5级课程",choose:"选择开始等级",fiveEach:"每级10题 · 每次5题",worksheetTitle:"折纸练习纸",worksheetDesc:"混合游戏题型并打印，还能查看解题过程。",openWorksheet:"制作练习纸",start:"开始"},
  ja:{worksheet:"プリント",title:"おりがみ",subtitle:"一回折りから切り取った数の合計まで、一歩ずつ学びます。",course:"5レベル",choose:"レベルを選ぼう",fiveEach:"各レベル10問 · 1回5問",worksheetTitle:"おりがみプリント",worksheetDesc:"ゲームと同じ問題を混ぜて印刷し、解き方も確認できます。",openWorksheet:"プリントを作る",start:"スタート"},
  en:{worksheet:"Worksheet",title:"Paper Folding",subtitle:"Learn one step at a time, from a single fold to adding cut-away numbers.",course:"5-Level Course",choose:"Choose a level",fiveEach:"10 per level · 5 each session",worksheetTitle:"Paper Folding Worksheet",worksheetDesc:"Mix the same activity types, print them, and review worked solutions.",openWorksheet:"Make Worksheet",start:"Start"}
};
const t = (key) => text[lang]?.[key] || text.ko[key];

document.documentElement.lang = lang;
document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
$("#playerName").textContent = profile.name || "GFIELD";
$("#playerPoints").textContent = `${Number.isFinite(points) ? points : 120} P`;

const accents = ["#55b99c", "#57a7d7", "#8b72c7", "#eb7f6a", "#e7b83d"];
const grid = $("#levelGrid");
levels.forEach((level, index) => {
  const card = document.createElement("a");
  card.className = "level-card";
  card.href = `../games/paper-fold/?level=${level.id}`;
  card.style.setProperty("--accent", accents[index]);
  card.innerHTML = `<div class="level-visual"><span class="level-number">${level.id}</span><span class="paper-stack" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="level-copy"><strong>${level.title[lang] || level.title.ko}</strong><p>${level.description[lang] || level.description.ko}</p><span>${t("start")}</span></div>`;
  grid.append(card);
});
