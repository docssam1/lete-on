import { EXAMS } from "./source-data.js?v=20261125g";
import { loggedIn, checkSession } from "./study-progress.js?v=20261117a";
import { productForExam, openExamIds } from "./entrance-products.js?v=20261116b";
import { TYPESET_EXAMS } from "./selection-test-originals/index.js?v=20261116a";
import { loadSelectionAnswers, selectionVideoHref, selectionVideoFrom, SELECTION_SAME_PAPER, answerVisualMarkup, workMarkup, isListVisual } from "./selection-answers.js?v=20261116e";

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
let solMode = "brief";
function setSolMode(mode) {
  solMode = mode;
  document.body.classList.toggle("sol-brief", mode === "brief" || mode === "steps");
  document.body.classList.toggle("sol-steps", mode === "steps");
  document.querySelectorAll("[data-sol]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sol === mode)));
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
  // 풀이 두 단계(원장 2026-11-16 「간단히 보기와 설명보기」): 본책 학습지의 「답 확인 → 풀이」처럼 정답 아래에 붙인다.
  // 위의 고르기(정답만 · 간단히 보기 · 설명 보기)가 화면과 「답안지 인쇄」를 함께 정한다(body 클래스 sol-brief · sol-steps).
  const hasSolutions = original.questions.some((q) => answers[q.number]?.brief || answers[q.number]?.steps || answers[q.number]?.work);
  const items = original.questions.map((q) => {
    const a = answers[q.number] || {};
    // 간단히 보기 = 핵심 한 줄 + 식(원장 2026-11-16 「텍스트 위주보다 이미지 또는 식 형태」)
    const brief = a.brief || a.work?.length ? `<div class="st-sol-brief">${a.brief ? `<p><b>간단히</b> ${esc(a.brief)}</p>` : ""}${workMarkup(a.work)}</div>` : "";
    const steps = a.steps?.length ? `<ol class="st-sol-steps">${a.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>` : "";
    const href = selectionVideoHref(exam.id, q.number, { student: student || "학생", title: `${plain(exam.label)} ${q.number}번 해설` });
    const video = href ? `<a class="st-video" href="${esc(href)}" target="_blank" rel="noopener">해설 영상 <small>${esc(selectionVideoFrom(exam.id, q.number))}${SELECTION_SAME_PAPER[exam.id] ? "" : "과 같은 문제"}</small></a>` : "";
    return `<section class="ut-ans-item"><b>${q.number}</b><div><div class="st-ans-row">${isListVisual(a.answerVisual) ? "" : `<p class="st-ans-text">${esc(a.text || "")}</p>`}${answerVisualMarkup(a.answerVisual)}</div>${brief}${steps}${video}</div></section>`;
  }).join("");
  const modes = hasSolutions ? `<div class="st-sol-modes" role="group" aria-label="풀이 보기">${[["none", "정답만"], ["brief", "간단히 보기"], ["steps", "설명 보기"]].map(([id, label]) => `<button type="button" data-sol="${id}" aria-pressed="${solMode === id}">${label}</button>`).join("")}</div>` : "";
  panel.innerHTML = `${modes}<header class="ut-test-run"><span>${esc(groupOf(exam))} · ${esc(plain(exam.label))}</span><span>정답</span></header><h2 class="ut-ans-title">${esc(plain(exam.label))} · 정답${hasSolutions ? " · 풀이" : ""}</h2>${SELECTION_SAME_PAPER[exam.id] ? `<p class="st-same-paper">이 시험지는 ${esc(SELECTION_SAME_PAPER[exam.id])}와 같은 시험지예요. 번호마다 「해설 영상」으로 그 회차 해설을 볼 수 있어요(번호도 같아요).</p>` : ""}<div class="ut-ans-grid">${items}</div><footer class="ut-test-foot"><span>지필드 영재교육</span><span>정답</span></footer>`;
  panel.querySelectorAll("[data-sol]").forEach((button) => button.addEventListener("click", () => setSolMode(button.dataset.sol)));
  setSolMode(solMode);
  panel.hidden = false;
  $("answerButton").textContent = "정답 접기";
  $("answerPrintButton").hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}
if (exam) $("checkLink").href = `./result-diagnosis.html?${new URLSearchParams({ exam: exam.id, student: student || "DEMO" })}`;
