import { EXAMS, PRACTICE_EXAM_TYPES, FINAL_EXAM_TYPES } from "./source-data.js?v=20260818a";

const params = new URLSearchParams(location.search);
const examId = params.get("exam") || EXAMS[0].id;
const student = params.get("student") || "DEMO";
// 실전·파이널 시험지는 EXAMS가 아니라 별도 배열에 있다. 예전에는 EXAMS에서만 찾고 못 찾으면
// EXAMS[0]으로 넘어가서, 실전 3회 원문을 누르면 7세 1차 선발시험 원문이 떴다.
// 다른 시험지의 원본을 보여 주는 것은 빈 화면보다 나쁘므로 폴백을 없앤다.
const exam = [...EXAMS, ...PRACTICE_EXAM_TYPES, ...FINAL_EXAM_TYPES].find((item) => item.id === examId) || null;
const $ = (id) => document.getElementById(id);

if (!exam) {
  $("title").textContent = "원문을 찾을 수 없습니다";
  $("subtitle").textContent = "";
  $("pages").innerHTML = `<p class="viewer-empty">등록되지 않은 시험지입니다. <a href="./index.html">문제은행으로 돌아가기</a></p>`;
  $("printButton").hidden = true;
} else if (!exam.sourcePageCount) {
  // 원문 이미지를 아직 올리지 않은 시험지. 없는 페이지를 그리면 깨진 이미지만 늘어선다.
  $("title").textContent = exam.label;
  $("subtitle").textContent = "";
  $("pages").innerHTML = `<p class="viewer-empty">원문 이미지가 아직 등록되지 않았습니다. <a href="./index.html">문제은행으로 돌아가기</a></p>`;
  $("printButton").hidden = true;
} else {
  $("title").textContent = exam.label;
  $("subtitle").textContent = `원문 ${exam.questions.length}문항 · 문항별 유형 대조용`;
  $("pages").innerHTML = Array.from({ length: exam.sourcePageCount }, (_, index) => {
    const page = String(index + 1).padStart(2, "0");
    return `<figure><img src="./assets/selection-tests/${exam.id}/page-${page}.png" alt="${exam.label} 원문 ${index + 1}페이지" loading="${index > 1 ? "lazy" : "eager"}" /></figure>`;
  }).join("");
  $("watermark").innerHTML = Array.from({ length: 3 }, () => `<span>${student} · GFIELD · ${student} · GFIELD · ${student}</span>`).join("");
  $("printButton").addEventListener("click", () => window.print());
}
