import { domains, problemsFor } from "../games/unit-area/core.js?v=area-1";
import { renderProblem } from "../games/unit-area/render.js?v=area-1";

let lang = "ko";
try { lang = localStorage.getItem("gfield-language") || "ko"; } catch { /* Korean is the default. */ }
if (!["ko", "en", "zh", "ja"].includes(lang)) lang = "ko";
const copy = {
  ko: ["단위넓이 탐구", "온칸과 반칸으로 넓이를 재고, 비교하고, 직접 만들기", "영역마다 20문제 · 한 번에 5문제", "시작하기"],
  en: ["Unit Area Studio", "Measure, compare, and create with whole and half squares", "20 per activity · 5 each session", "Start"],
  zh: ["单位面积探究", "用整格和半格测量、比较并创造图形", "每个领域20题 · 每次5题", "开始"],
  ja: ["単位面積の探究", "一マスと半マスで面積を測り、比べ、図形を作る", "各領域20問 · 1回5問", "スタート"]
}[lang];
document.querySelector("#areaTitle").textContent = copy[0];
document.querySelector("#areaDesc").textContent = copy[1];
document.querySelector("#areaSession").textContent = copy[2];
document.querySelector("#areaLevels").innerHTML = domains.map(d => `<a class="angle-card" href="../games/unit-area/?domain=${d.id}&level=${d.level}&lang=${lang}"><div class="angle-preview" aria-hidden="true">${renderProblem(problemsFor(d.id)[0], { lang })}</div><strong>${d.names[lang]}</strong><span>${copy[3]} →</span></a>`).join("");
