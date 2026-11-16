import { EXAMS } from "./source-data.js?v=20261111g";
import { loggedIn, checkSession } from "./study-progress.js?v=20261111p";
import { productForExam, openExamIds } from "./entrance-products.js?v=20261116b";
import { TYPESET_EXAMS } from "./selection-test-originals/index.js?v=20261114c";
import { loadSelectionAnswers } from "./selection-answers.js?v=20261116a";

// 선발시험 시험지(다시 짠 것) 보기·인쇄 — 원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」.
// 권별 테스트(unit-test-viewer.js)와 같은 방식: 문제 글·수·배치는 원문 그대로, 글꼴·색·그림은 우리 것.
// 회차마다 selection-test-originals/<시험 id>.js 가 { perPage, questions:[{ number, prompt, figure(), answer:{label,unit}|null }] } 를 내보낸다.
// 원본 이미지 보기(selection-test-viewer.js)는 잠근 그대로다. 정답은 git에 없다 — 「정답 보기」를 누를 때 비공개 표에서 받아(selection-answers.js)
// 화면에 펼치고 「답안지 인쇄」로 정답만 인쇄한다(원장 2026-11-16 「답안이 없어」). 채점은 「O/X 채점·진단」(result-diagnosis.html).
// 다시 짠 회차 목록은 selection-test-originals/index.js.

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const params = new URLSearchParams(location.search);
// 회차별 승인(원장 2026-11-16 「승인도 회차별로」): 로그인했으면 서버에 세션·권한을 다시 묻고, 그 회차가 열려 있어야 시험지를 그린다
if (loggedIn()) await checkSession();
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
  // 답 칸: { label, unit } 하나, 또는 답이 둘 이상이면 그 배열(한 줄에 나란히)
  const blank = (a) => `<span class="st-ans">${esc(a.label || "답")} <span aria-hidden="true">(</span><i></i><span aria-hidden="true">)</span>${a.unit ? esc(a.unit) : ""}</span>`;
  const list = [].concat(question.answer || []);
  const answer = list.length ? `<p class="ut-q-ans${list.length > 1 ? " is-multi" : ""}">${list.map(blank).join("")}</p>` : "";
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

const locked = exam && productForExam(exam.id) && !openExamIds(me).has(exam.id);
if (locked) {
  document.title = "선발시험 시험지";
  $("title").textContent = plain(exam.label);
  const next = `selection-test-paper.html${location.search}`;
  $("pages").innerHTML = `<p class="st-empty">이 회차는 승인을 받아야 열려요. ${me ? "원장님께 이 회차 승인을 요청해 주세요." : `<a href="./login.html?${new URLSearchParams({ next })}">승인번호로 로그인</a>`} · <a href="./entrance.html">입학 모의고사로 돌아가기</a></p>`;
  $("printButton").hidden = true;
  $("checkLink").hidden = true;
} else if (!exam || !original) {
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
  $("answerButton").hidden = false;
  $("answerButton").addEventListener("click", showAnswers);
  $("answerPrintButton").addEventListener("click", () => { document.body.classList.add("print-answers"); window.print(); });
  window.addEventListener("afterprint", () => document.body.classList.remove("print-answers"));
}
// 정답 보기 · 답안지 인쇄 — 한 번 받으면 화면 위쪽에 펼친다(인쇄 때는 「답안지 인쇄」만 정답 쪽을 찍는다)
async function showAnswers() {
  const panel = $("answerSheet");
  if (!panel.hidden) { panel.hidden = true; $("answerButton").textContent = "정답 보기"; return; }
  $("answerButton").disabled = true;
  $("answerButton").textContent = "정답을 불러오는 중…";
  const answers = await loadSelectionAnswers(exam.id);
  $("answerButton").disabled = false;
  if (!answers) { $("answerButton").textContent = "정답을 불러오지 못했어요 · 다시 누르기"; return; }
  const items = original.questions.map((q) => `<section class="ut-ans-item"><b>${q.number}</b><div><p>${esc(answers[q.number]?.text || "")}</p></div></section>`).join("");
  panel.innerHTML = `<header class="ut-test-run"><span>${esc(groupOf(exam))} · ${esc(plain(exam.label))}</span><span>정답</span></header><h2 class="ut-ans-title">${esc(plain(exam.label))} · 정답</h2><div class="ut-ans-grid">${items}</div><footer class="ut-test-foot"><span>지필드 영재교육</span><span>정답</span></footer>`;
  panel.hidden = false;
  $("answerButton").textContent = "정답 접기";
  $("answerPrintButton").hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}
if (exam) $("checkLink").href = `./result-diagnosis.html?${new URLSearchParams({ exam: exam.id, student: student || "DEMO" })}`;
