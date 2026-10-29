import { levels } from "../games/geoboard/levels.js?v=geoboard-8";
import { messages, text } from "../games/geoboard/i18n.js?v=geoboard-8";
import { curriculumBandLabel } from "../shared/curriculum-bands.js?v=curriculum-1";
import { readProfile } from "../shared/profile-storage.js";

const language = Object.hasOwn(messages, localStorage.getItem("gfield-language")) ? localStorage.getItem("gfield-language") : "ko";
const profile = readProfile();
const copy = {
  ko:{title:"점과 선으로 탐구하는 여섯 가지 활동",subtitle:"점을 잇고 도형을 만들며, 각과 도형의 성질을 눈과 손으로 확인해요.",heading:"점판 활동 유형",description:"도형을 잇고, 한붓으로 길을 찾아요.",worksheetTitle:"점판 도형 학습지",worksheetDescription:"선택한 활동 유형과 같은 구조의 문제를 인쇄해요.",start:"시작하기"},
  en:{title:"Six Shape and Path Activities",subtitle:"Join pegs, find hidden shapes, and divide figures while thinking with your hands.",heading:"Which geoboard activity will you try?",description:"Choose an activity type, then start its questions.",worksheetTitle:"Geoboard Activity Worksheet",worksheetDescription:"Choose questions from the same activity type to print.",start:"Start"},
  zh:{title:"六种图形与路径活动",subtitle:"连结点、寻找隐藏图形、用线分割图形，用双手思考形状。",heading:"想试试哪一种钉板活动？",description:"选择活动类型后，马上开始这一类题目。",worksheetTitle:"钉板活动练习纸",worksheetDescription:"选择同类活动题目后打印。",start:"开始"},
  ja:{title:"六つの図形と道のあそび",subtitle:"点をつなぎ、かくれた図形を見つけ、線で分けながら手で形を考えます。",heading:"どのジオボードあそびをする？",description:"あそびの種類をえらぶと、その問題をすぐ始められます。",worksheetTitle:"ジオボードあそびプリント",worksheetDescription:"同じあそびの問題をえらんで印刷します。",start:"スタート"}
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
const eulerCopy={ko:["한붓그리기","모든 선을 한 번씩 지나는 길을 찾아요.","점과 선 탐구"],en:["One-Stroke Drawing","Find a path that uses every line exactly once.","Points and paths"],zh:["一笔画","找出每条线只走一次的路线。","点与路径"],ja:["一筆書き","すべての線を一度ずつ通る道を探そう。","点と道"]}[language];
const euler=document.createElement("a");euler.className="type-card card-euler";euler.href="../games/geoboard/?activity=one-stroke";
euler.innerHTML=`<div class="type-art" aria-hidden="true"><svg viewBox="0 0 140 100"><defs><pattern id="eulerPreviewWood" width="140" height="100" patternUnits="userSpaceOnUse"><image href="../assets/ui/wood-light.webp" width="140" height="100" preserveAspectRatio="none"/></pattern></defs><rect x="3" y="3" width="134" height="94" rx="3" fill="url(#eulerPreviewWood)" stroke="#ad7e42" stroke-width="4"/><path d="M24 28H62V72H116" fill="none" stroke="#85715c" stroke-width="3"/><path d="M24 28H62V72" fill="none" stroke="#23887d" stroke-width="4"/>${[[24,28],[62,28],[62,72],[116,72]].map(([cx,cy])=>`<circle cx="${cx}" cy="${cy}" r="6" fill="#edc67d" stroke="#885e28" stroke-width="2"/>`).join("")}</svg></div><div class="type-copy"><div class="type-meta"><span class="type-number">6</span><span class="type-band">${eulerCopy[2]}</span></div><h3>${eulerCopy[0]}</h3><p>${eulerCopy[1]}</p><span class="type-start">${copy.start}<b aria-hidden="true">&#8594;</b></span></div>`;
$("#typeGrid").append(euler);
