import { domains, problemsFor } from "../games/perimeter/core.js?v=perimeter-1";
import { renderProblem } from "../games/perimeter/render.js?v=perimeter-1";

let lang="ko";
try { lang=localStorage.getItem("gfield-language") || "ko"; } catch { /* Default to Korean. */ }
if(!["ko","en","zh","ja"].includes(lang))lang="ko";
const copy={
  ko:["둘레 탐구","바깥 경계, 붙인 도형, 둘레 비교와 직접 만들기","영역마다 20문제 · 한 번에 5문제","시작하기"],
  en:["Perimeter Studio","Outside boundaries, joined shapes, comparison and construction","20 per activity · 5 each session","Start"],
  zh:["周长探究","外边界、组合图形、周长比较与作图","每个领域20题 · 每次5题","开始"],
  ja:["周りの長さの探究","外側のふち、合わせた図形、長さ比べと作図","各分野20問 · 1回5問","スタート"]
}[lang];
document.querySelector("#perimeterTitle").textContent=copy[0];
document.querySelector("#perimeterDesc").textContent=copy[1];
document.querySelector("#perimeterSession").textContent=copy[2];
document.querySelector("#perimeterLevels").innerHTML=domains.map(d=>`<a class="angle-card" href="../games/perimeter/?domain=${d.id}&level=${d.level}&lang=${lang}"><div class="angle-preview" aria-hidden="true">${renderProblem(problemsFor(d.id)[0],{lang})}</div><strong>${d.names[lang]}</strong><span>${copy[3]} →</span></a>`).join("");
