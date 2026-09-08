import { domains, problemsFor } from "../games/quadrilateral/core.js?v=quad-1";
import { renderProblem } from "../games/quadrilateral/render.js?v=quad-1";

let lang = "ko";
try { lang = localStorage.getItem("gfield-language") || "ko"; } catch { /* Language storage is optional. */ }
if (!["ko", "en", "zh", "ja"].includes(lang)) lang = "ko";
const copy = {
  ko: ["사각형 탐구", "평행한 변, 직각, 성질에 따른 분류와 점판 완성", "영역마다 20문제 · 한 번에 5문제", "시작하기"],
  en: ["Quadrilateral Studio", "Parallel sides, right angles, classification and completion", "20 per activity · 5 each session", "Start"],
  zh: ["四边形探究", "平行边、直角、按性质分类与补全图形", "每个领域20题 · 每次5题", "开始"],
  ja: ["四角形の探究", "平行な辺、直角、性質による分類と図形の完成", "各分野20問 · 1回5問", "スタート"]
}[lang];
document.querySelector("#quadrilateralTitle").textContent = copy[0];
document.querySelector("#quadrilateralDesc").textContent = copy[1];
document.querySelector("#quadrilateralSession").textContent = copy[2];
document.querySelector("#quadrilateralLevels").innerHTML = domains.map(d => `<a class="angle-card" href="../games/quadrilateral/?domain=${d.id}&level=${d.level}&lang=${lang}"><div class="angle-preview" aria-hidden="true">${renderProblem(problemsFor(d.id)[0], { lang })}</div><strong>${d.names[lang]}</strong><span>${copy[3]} →</span></a>`).join("");
