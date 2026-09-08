import { domains, problemsFor } from "../games/angle-studio/core.js?v=angle-1";
import { renderProblem } from "../games/angle-studio/render.js?v=angle-1";

let lang = "ko";
try { lang = localStorage.getItem("gfield-language") || "ko"; } catch { /* Default language is Korean. */ }
if (!["ko", "en", "zh", "ja"].includes(lang)) lang = "ko";
const text = {
  ko: ["각 탐구실", "각의 크기에서 직각, 다각형, 평행선의 관계까지", "영역마다 20문제 · 한 번에 5문제", "시작하기"],
  en: ["Angle Studio", "Explore angle size, right angles, polygons, and parallel lines", "20 per area · 5 each session", "Start"],
  zh: ["角度探究室", "探索角的大小、直角、多边形和平行线", "每个领域20题 · 每次5题", "开始"],
  ja: ["角の探究室", "角の大きさ、直角、多角形、平行線を探究", "各領域20問 · 1回5問", "スタート"]
}[lang];
document.querySelector("#angleTitle").textContent = text[0];
document.querySelector("#angleDesc").textContent = text[1];
document.querySelector("#angleSession").textContent = text[2];
document.querySelector("#angleLevels").innerHTML = domains.map(domain => `<a class="angle-card" href="../games/angle-studio/?domain=${domain.id}&level=${domain.level}"><div class="angle-preview" aria-hidden="true">${renderProblem(problemsFor(domain.id)[0])}</div><strong>${domain.names[lang]}</strong><span>${text[3]} →</span></a>`).join("");
