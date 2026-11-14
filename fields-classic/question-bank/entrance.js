import { EXAMS, PRACTICE_EXAM_TYPES, FINAL_EXAM_TYPES } from "./source-data.js?v=20261111g";
import { remediationUrl } from "./result-diagnosis-data.js?v=20261111g";
import { loggedIn } from "./study-progress.js?v=20261111p";
import { TYPESET_EXAMS } from "./selection-test-originals/index.js?v=20261114a";

// 입학 모의고사 고르기(원장 2026-11-14). 시험은 문제은행에 이미 있는 것 그대로(source-data.js):
//   초1 입학 대비 = 7세 선발시험, 초2 입학 대비 = 초1 선발시험(원본 이미지·유형 대조가 끝난 것), 실전·파이널 모의고사.
//   「O/X 채점·진단」 → result-diagnosis.html?exam=  (약점 유형 → 유사문제)
//   「유사문제 풀기」  → 그 시험 모든 유형의 유사문제 학습지(result-diagnosis-data.js remediationUrl)
//   「시험지 인쇄」    → 우리 시험지 모양으로 다시 짠 선발시험(selection-test-paper.html, 원장 2026-11-14) — 다시 짠 회차만
// 온라인으로 풀고 자동 채점하는 선발 대비 모의고사는 ../mock/ 그대로. 화면 글에 회사·상품 이름(더 클래식 등)을 쓰지 않는다.
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const params = new URLSearchParams(location.search);
const me = loggedIn();
const student = params.get("student") || (me && me.type !== "admin" ? me.name : "") || "DEMO";
const plain = (label) => String(label).replace(/^더\s*클래식\s*/u, "");
const typeIdsOf = (exam) => (exam.questions || []).map((q) => (typeof q === "string" ? q : q?.typeId)).filter(Boolean);

const GROUPS = [
  { title: "초1 입학 대비", sub: "7세 선발시험", exams: EXAMS.filter((e) => e.stage?.startsWith("k")) },
  { title: "초2 입학 대비", sub: "초1 선발시험", exams: EXAMS.filter((e) => e.stage?.startsWith("g1")) },
  { title: "실전 모의고사", sub: "실전 1~6회", exams: PRACTICE_EXAM_TYPES },
  { title: "파이널 모의고사", sub: "시험 직전", exams: FINAL_EXAM_TYPES },
];

const card = (exam) => {
  const n = (exam.questions || []).length;
  const diagnose = `./result-diagnosis.html?${new URLSearchParams({ exam: exam.id, student })}`;
  const paper = TYPESET_EXAMS[exam.id] ? `./selection-test-paper.html?${new URLSearchParams({ exam: exam.id, ...(params.get("student") ? { student: params.get("student") } : {}) })}` : "";
  return `<li class="en-exam"><b>${esc(plain(exam.label))}</b><small>${n}문항</small>
    <span class="en-acts">${paper ? `<a class="ms-btn" href="${esc(paper)}">시험지 인쇄</a>` : ""}<a class="ms-btn primary" href="${esc(diagnose)}">O/X 채점·진단</a><a class="ms-btn" href="${esc(remediationUrl(typeIdsOf(exam), student))}">유사문제 풀기</a></span></li>`;
};

$("groups").insertAdjacentHTML("beforeend", `
  <section class="en-group en-online"><h2>선발 대비 모의고사 <small>온라인으로 풀고 바로 채점</small></h2>
    <a class="ms-btn primary" href="../mock/index.html">모의고사 풀러 가기 ›</a></section>
  ${GROUPS.filter((g) => g.exams.length).map((g) => `<section class="en-group"><h2>${esc(g.title)} <small>${esc(g.sub)} · ${g.exams.length}회</small></h2>
    <ul class="en-list">${g.exams.map(card).join("")}</ul></section>`).join("")}`);
if (params.get("student")) $("backHome").href = `./home.html?${new URLSearchParams({ student: params.get("student") })}`;
