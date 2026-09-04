import { levels } from "../games/mirror-manor/levels.js?v=mirror-manor-11";
import { messages, text } from "../games/mirror-manor/i18n.js?v=mirror-manor-11";
import { curriculumBandLabel } from "../shared/curriculum-bands.js?v=curriculum-1";
import { readProfile } from "../shared/profile-storage.js";

const language = Object.hasOwn(messages, localStorage.getItem("gfield-language")) ? localStorage.getItem("gfield-language") : "ko";
const profile = readProfile();
const copy = {
  ko:{title:"거울대칭을 익히는 다섯 가지 활동",subtitle:"거울선에서 같은 줄과 같은 거리를 찾고, 모양과 기호가 비치는 방향을 살펴요.",heading:"거울대칭 활동 유형",description:"초등팩토 1에서 시작해 1031 입문·입문 수준까지 차례로 익혀요.",worksheetTitle:"거울대칭 학습지",worksheetDescription:"선택한 활동 유형과 같은 구조의 문제를 인쇄해요.",start:"시작하기"},
  en:{title:"Five Activities for Mirror Symmetry",subtitle:"Use equal lines and distances from a mirror, then study how shapes and symbols reflect.",heading:"Mirror symmetry activities",description:"Progress from Elementary FACTO 1 to the entry level of 1031 Intro.",worksheetTitle:"Mirror Symmetry Worksheet",worksheetDescription:"Print questions with the same activity structure.",start:"Start"},
  zh:{title:"认识镜面对称的五种活动",subtitle:"从镜线寻找同一行和相同距离，并观察图形与符号映出的方向。",heading:"镜面对称活动类型",description:"从小学 FACTO 1逐步学习到1031入门的起步水平。",worksheetTitle:"镜面对称练习纸",worksheetDescription:"打印与所选活动结构相同的题目。",start:"开始"},
  ja:{title:"鏡の対称を学ぶ五つの活動",subtitle:"鏡の線から同じ列と同じ距離を見つけ、形や記号が映る向きを考えます。",heading:"鏡の対称の活動",description:"小学生 FACTO 1から1031入門のはじめまで順に学びます。",worksheetTitle:"鏡の対称プリント",worksheetDescription:"選んだ活動と同じ構造の問題を印刷します。",start:"スタート"}
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

const artClass = {"paint-reflection":"paint", "drag-reflection":"drag", "distance-match":"distance", "symbol-reflection":"symbol", "double-mirror":"double"};
levels.filter((level) => level.ready).forEach((level) => {
  const card = document.createElement("a");
  card.className = `type-card card-${artClass[level.interaction]}`;
  card.href = `../games/mirror-manor/?level=${level.id}`;
  card.innerHTML = `<div class="type-art" aria-hidden="true"></div><div class="type-copy"><div class="type-meta"><span class="type-number">${level.id}</span><span class="type-band">${curriculumBandLabel("mirror-manor", level.id, language)}</span></div><h3>${text(language, level.titleKey)}</h3><p>${text(language, level.descKey)}</p><span class="type-difficulty">${text(language, level.difficultyKey)}</span><span class="type-start">${copy.start}<b aria-hidden="true">&#8594;</b></span></div>`;
  $("#typeGrid").append(card);
});
