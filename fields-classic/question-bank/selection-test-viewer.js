import { EXAMS } from "./source-data.js?v=20260812h";

// 원문 보기 잠금. 문제은행의 "원문 보기" 링크는 그대로 두고, 들어오면 권한 없음만 보여준다.
// 다시 열 때는 이 값을 true로 되돌린다(단원 테스트 뷰어에도 같은 이름 상수가 있다).
const SOURCE_VIEWER_ENABLED = false;

const params = new URLSearchParams(location.search);
const examId = params.get("exam") || EXAMS[0].id;
const student = params.get("student") || "DEMO";
const exam = EXAMS.find((item) => item.id === examId) || EXAMS[0];
const $ = (id) => document.getElementById(id);

$("title").textContent = exam.label;
$("subtitle").textContent = `원문 ${exam.questions.length}문항 · 문항별 유형 대조용`;

if (!SOURCE_VIEWER_ENABLED) {
  $("subtitle").textContent = "";
  $("pages").innerHTML = `<p class="viewer-locked">권한이 없습니다.</p>`;
  const printButton = $("printButton");
  if (printButton) printButton.hidden = true;
} else {
$("pages").innerHTML = Array.from({ length: exam.sourcePageCount }, (_, index) => {
  const page = String(index + 1).padStart(2, "0");
  return `<figure><img src="./assets/selection-tests/${exam.id}/page-${page}.png" alt="${exam.label} 원문 ${index + 1}페이지" loading="${index > 1 ? "lazy" : "eager"}" /></figure>`;
}).join("");
$("watermark").innerHTML = Array.from({ length: 3 }, () => `<span>${student} · GFIELD · ${student} · GFIELD · ${student}</span>`).join("");
$("printButton").addEventListener("click", () => window.print());
}
