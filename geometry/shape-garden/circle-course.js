import { domains, problemsFor } from "../games/circle-studio/core.js?v=circle-1";
import { renderProblem } from "../games/circle-studio/render.js?v=circle-1";

let lang = "ko";
try { lang = localStorage.getItem("gfield-language") || "ko"; } catch { /* Optional language storage. */ }
if (!["ko", "en", "zh", "ja"].includes(lang)) lang = "ko";
const copy = {
  ko: ["원 탐구", "원의 중심, 반지름과 지름, 컴퍼스로 원 그리기", "영역마다 20문제 · 한 번에 5문제", "시작하기"],
  en: ["Circle Studio", "Centers, radii, diameters and compass drawing", "20 per activity · 5 each session", "Start"],
  zh: ["圆的探究", "圆心、半径、直径与圆规画圆", "每个领域20题 · 每次5题", "开始"],
  ja: ["円の探究", "円の中心、半径と直径、コンパスで円をかく", "各分野20問 · 1回5問", "スタート"]
}[lang];
document.querySelector("#circleTitle").textContent = copy[0];
document.querySelector("#circleDesc").textContent = copy[1];
document.querySelector("#circleSession").textContent = copy[2];
document.querySelector("#circleLevels").innerHTML = domains.map(d => `<a class="angle-card" href="../games/circle-studio/?domain=${d.id}&level=${d.level}&lang=${lang}"><div class="angle-preview" aria-hidden="true">${renderProblem(problemsFor(d.id)[0], { lang })}</div><strong>${d.names[lang]}</strong><span>${copy[3]} →</span></a>`).join("");
