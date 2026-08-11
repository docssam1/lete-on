import { EXAMS } from "./source-data.js?v=20260812h";

const params = new URLSearchParams(location.search);
const examId = params.get("exam") || EXAMS[0].id;
const student = params.get("student") || "DEMO";
const exam = EXAMS.find((item) => item.id === examId) || EXAMS[0];
const $ = (id) => document.getElementById(id);

$("title").textContent = exam.label;
$("subtitle").textContent = `원문 ${exam.questions.length}문항 · 문항별 유형 대조용`;
$("pages").innerHTML = Array.from({ length: exam.sourcePageCount }, (_, index) => {
  const page = String(index + 1).padStart(2, "0");
  return `<figure><img src="./assets/selection-tests/${exam.id}/page-${page}.png" alt="${exam.label} 원문 ${index + 1}페이지" loading="${index > 1 ? "lazy" : "eager"}" /></figure>`;
}).join("");
$("watermark").innerHTML = Array.from({ length: 3 }, () => `<span>${student} · GFIELD · ${student} · GFIELD · ${student}</span>`).join("");
$("printButton").addEventListener("click", () => window.print());
