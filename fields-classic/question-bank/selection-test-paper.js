import { EXAMS } from "./source-data.js?v=20261111g";
import { loggedIn } from "./study-progress.js?v=20261111p";
import { TYPESET_EXAMS } from "./selection-test-originals/index.js?v=20261114a";

// 선발시험 시험지(다시 짠 것) 보기·인쇄 — 원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」.
// 권별 테스트(unit-test-viewer.js)와 같은 방식: 문제 글·수·배치는 원문 그대로, 글꼴·색·그림은 우리 것.
// 회차마다 selection-test-originals/<시험 id>.js 가 { perPage, questions:[{ number, prompt, figure(), answer:{label,unit}|null }] } 를 내보낸다.
// 원본 이미지 보기(selection-test-viewer.js)는 잠근 그대로다. 정답은 여기 없다 — 채점은 「O/X 채점·진단」(result-diagnosis.html).
// 다시 짠 회차 목록은 selection-test-originals/index.js.

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const params = new URLSearchParams(location.search);
const me = loggedIn();
const student = params.get("student") || (me && me.type !== "admin" ? me.name : "") || "";
const plain = (label) => String(label).replace(/^더\s*클래식\s*/u, "");
const exam = EXAMS.find((item) => item.id === params.get("exam")) || null;
const groupOf = (item) => (item.stage?.startsWith("k") ? "초1 입학 대비" : item.stage?.startsWith("g1") ? "초2 입학 대비" : "선발시험");
// ?preview=1 — 목록에 올리기 전에 만드는 사람이 원문과 나란히 대조할 때
const tag = exam ? (TYPESET_EXAMS[exam.id] || (params.get("preview") === "1" ? String(Date.now()) : "")) : "";
const original = tag ? await import(`./selection-test-originals/${exam.id}.js?v=${tag}`).catch((error) => { console.error(error); return null; }) : null;

const back = new URLSearchParams();
if (params.get("student")) back.set("student", params.get("student"));
$("backLink").href = `./entrance.html${back.size ? `?${back}` : ""}`;

function questionMarkup(question) {
  const answer = question.answer ? `<p class="ut-q-ans">${esc(question.answer.label || "답")} <span aria-hidden="true">(</span><i></i><span aria-hidden="true">)</span>${question.answer.unit ? esc(question.answer.unit) : ""}</p>` : "";
  return `<section class="ut-q" aria-label="${question.number}번"><div class="ut-q-head"><b>${question.number}</b><p>${esc(question.prompt)}</p></div><div class="ut-q-fig">${question.figure ? question.figure() : ""}</div>${answer}</section>`;
}
function pagesMarkup() {
  const questions = original.questions;
  const per = original.perPage || 2;
  const title = plain(exam.label);
  const group = groupOf(exam);
  const pages = [];
  for (let start = 0; start < questions.length; start += per) pages.push(questions.slice(start, start + per));
  const head = (index) => index === 0
    ? `<header class="ut-test-head"><p class="ut-test-band"><span>${esc(group)}</span><span>선발시험</span></p><h1>${esc(title)}</h1><dl><div><dt>이름</dt><dd></dd></div><div><dt>날짜</dt><dd></dd></div><div><dt>맞은 개수</dt><dd><span>/ ${questions.length}</span></dd></div></dl></header>`
    : `<header class="ut-test-run"><span>${esc(group)} · ${esc(title)}</span><span>선발시험</span></header>`;
  return pages.map((group, index) => `<article class="ut-test-page ${per === 2 ? "st-two" : ""}" aria-label="${index + 1}쪽">${head(index)}<div class="ut-test-body">${group.map(questionMarkup).join("")}</div><footer class="ut-test-foot"><span>지필드 영재교육</span><span>${index + 1}</span></footer></article>`).join("");
}

if (!exam || !original) {
  document.title = "선발시험 시험지";
  $("title").textContent = exam ? plain(exam.label) : "선발시험 시험지";
  $("pages").innerHTML = `<p class="st-empty">${exam ? "이 회차 시험지는 아직 우리 시험지로 옮기는 중이에요." : "등록되지 않은 시험지입니다."} <a href="./entrance.html">입학 모의고사로 돌아가기</a></p>`;
  $("printButton").hidden = true;
  $("checkLink").hidden = !exam;
} else {
  document.title = `${plain(exam.label)} 시험지`;
  $("title").textContent = plain(exam.label);
  $("eyebrow").textContent = `${groupOf(exam)} · ${exam.questions.length}문항`;
  document.body.classList.add("is-typeset");
  $("pages").innerHTML = pagesMarkup();
  if (student) $("watermark").innerHTML = Array.from({ length: 4 }, () => `<span>${esc(student)} · GFIELD · ${esc(student)} · GFIELD · ${esc(student)}</span>`).join("");
  $("printButton").addEventListener("click", () => window.print());
}
if (exam) $("checkLink").href = `./result-diagnosis.html?${new URLSearchParams({ exam: exam.id, student: student || "DEMO" })}`;
