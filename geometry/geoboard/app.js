import { levels } from "../games/geoboard/levels.js?v=geoboard-8";
import { messages, text } from "../games/geoboard/i18n.js?v=geoboard-8";
import { curriculumBandLabel } from "../shared/curriculum-bands.js?v=curriculum-1";
import { readProfile } from "../shared/profile-storage.js";

const language = Object.hasOwn(messages, localStorage.getItem("gfield-language")) ? localStorage.getItem("gfield-language") : "ko";
const profile = readProfile();
const copy = {
  ko:{title:"점과 선으로 탐구하는 다섯 가지 활동",subtitle:"점을 잇고 도형을 만들며, 각과 도형의 성질을 눈과 손으로 확인해요.",heading:"점판 활동 유형",description:"1031 입문·입문에서 시작해 1031 초급까지 차례로 익혀요.",worksheetTitle:"점판 도형 학습지",worksheetDescription:"선택한 활동 유형과 같은 구조의 문제를 인쇄해요.",start:"시작하기"},
  en:{title:"Five Shape Activities with Rubber Bands",subtitle:"Join pegs, find hidden shapes, and divide figures while thinking with your hands.",heading:"Which geoboard activity will you try?",description:"Choose an activity type, then start its questions.",worksheetTitle:"Geoboard Activity Worksheet",worksheetDescription:"Choose questions from the same activity type to print.",start:"Start"},
  zh:{title:"用橡皮筋玩的五种图形活动",subtitle:"连结点、寻找隐藏图形、用线分割图形，用双手思考形状。",heading:"想试试哪一种钉板活动？",description:"选择活动类型后，马上开始这一类题目。",worksheetTitle:"钉板活动练习纸",worksheetDescription:"选择同类活动题目后打印。",start:"开始"},
  ja:{title:"ゴムで作る五つの図形あそび",subtitle:"点をつなぎ、かくれた図形を見つけ、線で分けながら手で形を考えます。",heading:"どのジオボードあそびをする？",description:"あそびの種類をえらぶと、その問題をすぐ始められます。",worksheetTitle:"ジオボードあそびプリント",worksheetDescription:"同じあそびの問題をえらんで印刷します。",start:"スタート"}
}[language];
const $ = (selector) => document.querySelector(selector);

document.documentElement.lang = language;
$("#title").textContent = copy.title;
$("#subtitle").textContent = copy.subtitle;
$("#typeHeading").textContent = copy.heading;
$("#typeDescription").textContent = copy.description;
$("#worksheetTitle").textContent = copy.worksheetTitle;
$("#worksheetDescription").textContent = copy.worksheetDescription;
$("#worksheetLink").textContent = text(language, "worksheet");
$("#playerName").textContent = profile.name || "GFIELD";
$("#playerPoints").textContent = `${Number(localStorage.getItem("gfield-points") || 120)} P`;

const artClass = {open:"open", closed:"closed", "square-count":"square", "triangle-count":"triangle", partition:"partition"};
levels.filter((level) => level.ready).forEach((level) => {
  const card = document.createElement("a");
  card.className = `type-card card-${artClass[level.kind]}`;
  card.href = `../games/geoboard/?level=${level.id}`;
  card.innerHTML = `<div class="type-art" aria-hidden="true"></div><div class="type-copy"><div class="type-meta"><span class="type-number">${level.id}</span><span class="type-band">${curriculumBandLabel("geoboard", level.id, language)}</span></div><h3>${text(language, level.titleKey)}</h3><p>${text(language, level.descKey)}</p><span class="type-difficulty">${text(language, level.stage === "초급" ? "difficultyBeginner" : "difficultyIntermediate")} · ${text(language, level.difficulty === "하" ? "difficultyLow" : level.difficulty === "중" ? "difficultyMiddle" : "difficultyHigh")}</span><span class="type-start">${copy.start}<b aria-hidden="true">&#8594;</b></span></div>`;
  $("#typeGrid").append(card);
});
