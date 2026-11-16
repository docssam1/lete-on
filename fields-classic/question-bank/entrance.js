import { EXAMS, PRACTICE_EXAM_TYPES, FINAL_EXAM_TYPES, typeById } from "./source-data.js?v=20261111g";
import { remediationUrl } from "./result-diagnosis-data.js?v=20261116d";
import { loggedIn, checkSession } from "./study-progress.js?v=20261111p";
import { TYPESET_EXAMS } from "./selection-test-originals/index.js?v=20261114c";
import { productForExam, openExamIds } from "./entrance-products.js?v=20261116a";

// 입학 모의고사 고르기(원장 2026-11-14). 시험은 문제은행에 이미 있는 것 그대로(source-data.js):
//   초1 입학 대비 = 7세 선발시험, 초2 입학 대비 = 초1 선발시험(원본 이미지·유형 대조가 끝난 것), 실전·파이널 모의고사.
//   「O/X 채점·진단」 → result-diagnosis.html?exam=  (약점 유형 → 유사문제, 7세 선발시험은 합격 가능 반)
//   「유사문제 만들기」 → 고르기 창(원장 2026-11-16 「문제별로 선택 · 문제 수 조절 · 더 어렵게 쉽게」) → 문제은행 시험지(3단계, 인쇄)
//   「시험지 인쇄」    → 우리 시험지 모양으로 다시 짠 선발시험(selection-test-paper.html, 원장 2026-11-14) — 다시 짠 회차만
// 선발시험(초1·초2 입학 대비)은 회차별 승인(원장 2026-11-16 「승인도 회차별로」, entrance-products.js) — 승인된 회차만 열린다.
// 온라인으로 풀고 자동 채점하는 선발 대비 모의고사는 ../mock/ 그대로. 화면 글에 회사·상품 이름(더 클래식 등)을 쓰지 않는다.
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const params = new URLSearchParams(location.search);
if (loggedIn()) await checkSession();   // 권한은 서버 값으로(이 탭에 적힌 것을 믿지 않는다)
const me = loggedIn();
const open = openExamIds(me);
const student = params.get("student") || (me && me.type !== "admin" ? me.name : "") || "DEMO";
const plain = (label) => String(label).replace(/^더\s*클래식\s*/u, "");
const typeIdsOf = (exam) => (exam.questions || []).map((q) => (typeof q === "string" ? q : q?.typeId)).filter(Boolean);

const GROUPS = [
  { title: "초1 입학 대비", sub: "7세 선발시험", exams: EXAMS.filter((e) => e.stage?.startsWith("k")) },
  { title: "초2 입학 대비", sub: "초1 선발시험", exams: EXAMS.filter((e) => e.stage?.startsWith("g1")) },
  { title: "실전 모의고사", sub: "실전 1~6회", exams: PRACTICE_EXAM_TYPES },
  { title: "파이널 모의고사", sub: "시험 직전", exams: FINAL_EXAM_TYPES },
];
const ALL = GROUPS.flatMap((g) => g.exams);
const lockedExam = (exam) => Boolean(productForExam(exam.id)) && !open.has(exam.id);

const card = (exam) => {
  const n = (exam.questions || []).length;
  if (lockedExam(exam)) {
    const next = `entrance.html${location.search}`;
    return `<li class="en-exam is-locked"><b>${esc(plain(exam.label))}</b><small>${n}문항 · 승인이 필요해요</small>
      <span class="en-acts">${me ? `<span class="en-lock-note">원장님께 이 회차 승인을 요청해 주세요</span>` : `<a class="ms-btn" href="./login.html?${esc(new URLSearchParams({ next }))}">승인번호로 로그인</a>`}</span></li>`;
  }
  const diagnose = `./result-diagnosis.html?${new URLSearchParams({ exam: exam.id, student, as: "student" })}`;
  const paper = TYPESET_EXAMS[exam.id] ? `./selection-test-paper.html?${new URLSearchParams({ exam: exam.id, ...(params.get("student") ? { student: params.get("student") } : {}) })}` : "";
  return `<li class="en-exam"><b>${esc(plain(exam.label))}</b><small>${n}문항</small>
    <span class="en-acts">${paper ? `<a class="ms-btn" href="${esc(paper)}">시험지 인쇄</a>` : ""}<a class="ms-btn primary" href="${esc(diagnose)}">O/X 채점·진단</a><button type="button" class="ms-btn" data-similar="${esc(exam.id)}">유사문제 만들기</button></span></li>`;
};

// ?only=k | g1 — 모의고사 서재의 「초1 입학 모의고사」·「초2 입학 모의고사」 카드에서 들어올 때 그 묶음만(원장 2026-11-15)
const ONLY = { k: GROUPS[0], g1: GROUPS[1] }[params.get("only")];
const shown = ONLY ? [ONLY] : GROUPS;
if (ONLY) { const name = `${ONLY.title.replace(" 대비", "")} 모의고사`; document.title = name; const h = document.querySelector(".ms-title strong"); if (h) h.textContent = name;
  const back = $("backHome"); back.href = "../program/"; back.innerHTML = `<span aria-hidden="true">←</span> 모의고사 서재`; }
$("groups").insertAdjacentHTML("beforeend", `${ONLY ? "" : `
  <section class="en-group en-online"><h2>선발 대비 모의고사 <small>온라인으로 풀고 바로 채점</small></h2>
    <a class="ms-btn primary" href="../mock/index.html">모의고사 풀러 가기 ›</a></section>`}
  ${shown.filter((g) => g.exams.length).map((g) => `<section class="en-group"><h2>${esc(g.title)} <small>${esc(g.sub)} · ${g.exams.length}회</small></h2>
    <ul class="en-list">${g.exams.map(card).join("")}</ul></section>`).join("")}`);
if (params.get("student") && !ONLY) $("backHome").href = `./home.html?${new URLSearchParams({ student: params.get("student") })}`;

// ── 유사문제 고르기 창: 문항 고르기 · 문제 수 · 난이도 → 문제은행 시험지(인쇄) ──
const LEVELS = [["basic", "더 쉽게"], ["actual", "원본과 같게"], ["advanced", "더 어렵게"]];
const pick = { exam: null, numbers: new Set(), count: 20, level: "actual" };
const dialog = $("similarDialog");
const numberOf = (exam, q, index) => (typeof q === "object" && q.number) || index + 1;
function renderPick() {
  const exam = pick.exam;
  $("simTitle").textContent = `${plain(exam.label)} · 유사문제`;
  $("simNumbers").innerHTML = exam.questions.map((q, index) => {
    const n = numberOf(exam, q, index), typeId = typeof q === "string" ? q : q.typeId;
    return `<label class="en-sim-q"><input type="checkbox" value="${n}" ${pick.numbers.has(n) ? "checked" : ""}><b>${n}</b><span>${esc(typeById(typeId)?.label || "")}</span></label>`;
  }).join("");
  $("simLevels").innerHTML = LEVELS.map(([id, label]) => `<button type="button" data-level="${id}" aria-pressed="${pick.level === id}">${label}</button>`).join("");
  updatePick();
}
function updatePick() {
  const exam = pick.exam;
  const types = [...new Set(exam.questions.filter((q, index) => pick.numbers.has(numberOf(exam, q, index))).map((q) => (typeof q === "string" ? q : q.typeId)))];
  const count = Math.max(1, Math.min(50, Number($("simCount").value) || 1));
  pick.count = count;
  $("simSummary").textContent = types.length ? `${pick.numbers.size}문항 고름 · ${types.length}가지 유형 · ${count}문제 · ${LEVELS.find(([id]) => id === pick.level)[1]}` : "문항을 하나 이상 골라 주세요";
  const make = $("simMake");
  make.setAttribute("aria-disabled", String(!types.length));
  const levelWord = pick.level === "basic" ? " · 쉽게" : pick.level === "advanced" ? " · 어렵게" : "";
  const partial = pick.numbers.size < exam.questions.length ? " · 고른 문항" : "";
  make.href = types.length ? remediationUrl(types, student, count, { paper: true, level: pick.level, title: `${plain(exam.label)} · 유사문제${partial}${levelWord}` }) : "#";
}
document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-similar]");
  if (!opener) return;
  const exam = ALL.find((item) => item.id === opener.dataset.similar);
  if (!exam) return;
  pick.exam = exam;
  pick.numbers = new Set(exam.questions.map((q, index) => numberOf(exam, q, index)));
  pick.level = "actual";
  $("simCount").value = String(exam.questions.length);
  renderPick();
  dialog.showModal();
});
$("simNumbers").addEventListener("change", (event) => {
  const box = event.target.closest("input[type=checkbox]");
  if (!box) return;
  const n = Number(box.value);
  if (box.checked) pick.numbers.add(n); else pick.numbers.delete(n);
  updatePick();
});
$("simAll").addEventListener("click", () => { pick.numbers = new Set(pick.exam.questions.map((q, index) => numberOf(pick.exam, q, index))); renderPick(); });
$("simNone").addEventListener("click", () => { pick.numbers.clear(); renderPick(); });
$("simCounts").addEventListener("click", (event) => {
  const b = event.target.closest("[data-count]");
  if (!b) return;
  $("simCount").value = b.dataset.count === "same" ? String(pick.numbers.size || 1) : b.dataset.count;
  updatePick();
});
$("simCount").addEventListener("input", updatePick);
$("simLevels").addEventListener("click", (event) => {
  const b = event.target.closest("[data-level]");
  if (!b) return;
  pick.level = b.dataset.level;
  $("simLevels").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  updatePick();
});
$("simMake").addEventListener("click", (event) => { if ($("simMake").getAttribute("aria-disabled") === "true") event.preventDefault(); });
$("simClose").addEventListener("click", () => dialog.close());
