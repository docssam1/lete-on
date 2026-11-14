import { COURSE2_TESTS } from "./course2-test-originals/index.js?v=20261114b";
import { mathText } from "./math-markup.js?v=20261027p";

// 2과정 권별 테스트 시험지 보기·인쇄 — 원장 2026-11-14 「G4 테스트는 다시 만들어」.
// 권마다 course2-test-originals/<권>.js 가 { perPage, meta:{course,book,title}, questions:[{ number, prompt, figure(), answer }] } 를 내보낸다.
// 시험지 꼴은 선발시험·권별 테스트와 같다(unit-test-solve.css + selection-test-paper.css). 정답은 여기 없다.
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const params = new URLSearchParams(location.search);
const book = String(params.get("book") || "").toLowerCase();
const tag = COURSE2_TESTS[book] || (params.get("preview") === "1" && /^[ag][1-5]$/.test(book) ? String(Date.now()) : "");
const original = tag ? await import(`./course2-test-originals/${book}.js?v=${tag}`).catch((error) => { console.error(error); return null; }) : null;

function questionMarkup(question) {
  const blank = (a) => `<span class="st-ans">${mathText(esc(a.label || "답"))} <span aria-hidden="true">(</span><i></i><span aria-hidden="true">)</span>${a.unit ? esc(a.unit) : ""}</span>`;
  const list = [].concat(question.answer || []);
  const answer = list.length ? `<p class="ut-q-ans${list.length > 1 ? " is-multi" : ""}">${list.map(blank).join("")}</p>` : "";
  return `<section class="ut-q" aria-label="${question.number}번"><div class="ut-q-head"><b>${question.number}</b><p>${question.mathPrompt ? mathText(esc(question.prompt)) : esc(question.prompt)}</p></div><div class="ut-q-fig">${question.figure ? question.figure() : ""}</div>${answer}</section>`;
}
function pagesMarkup() {
  const { questions, meta } = original;
  const per = original.perPage || 4;
  const band = `${meta.course} · ${meta.book}`;
  const pages = [];
  for (let start = 0; start < questions.length; start += per) pages.push(questions.slice(start, start + per));
  const head = (index) => index === 0
    ? `<header class="ut-test-head"><p class="ut-test-band"><span>${esc(band)}</span><span>권별 테스트</span></p><h1>${esc(meta.title)}</h1><dl><div><dt>이름</dt><dd></dd></div><div><dt>날짜</dt><dd></dd></div><div><dt>맞은 개수</dt><dd><span>/ ${questions.length}</span></dd></div></dl></header>`
    : `<header class="ut-test-run"><span>${esc(band)} 권별 테스트</span><span>${esc(meta.title)}</span></header>`;
  return pages.map((group, index) => `<article class="ut-test-page ${per === 2 ? "st-two" : ""}" aria-label="${index + 1}쪽">${head(index)}<div class="ut-test-body">${group.map(questionMarkup).join("")}</div><footer class="ut-test-foot"><span>지필드 영재교육</span><span>${index + 1}</span></footer></article>`).join("");
}

if (!original) {
  $("title").textContent = "권별 테스트";
  $("pages").innerHTML = `<p class="st-empty">이 권의 시험지는 아직 준비 중이에요.</p>`;
  $("printButton").hidden = true;
} else {
  document.title = `${original.meta.course} ${original.meta.book} 권별 테스트`;
  $("title").textContent = `${original.meta.book} 권별 테스트 · ${original.meta.title}`;
  $("eyebrow").textContent = `${original.meta.course} · ${original.questions.length}문항`;
  document.body.classList.add("is-typeset");
  $("pages").innerHTML = pagesMarkup();
  $("printButton").addEventListener("click", () => window.print());
}
