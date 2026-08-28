import { DOMAINS } from "./source-data.js?v=20260829a";
import {
  RESULT_EXAM_BY_ID,
  RESULT_EXAM_GROUPS,
  analyzeExamResults,
  remediationUrl,
  resultStorageKey,
  stageLabelForExam
} from "./result-diagnosis-data.js?v=20260829a";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const initialExam = RESULT_EXAM_BY_ID.get(params.get("exam")) || RESULT_EXAM_GROUPS[0].exams[0];
let activeGroupId = RESULT_EXAM_GROUPS.find((group) => group.exams.some((exam) => exam.id === initialExam.id))?.id || RESULT_EXAM_GROUPS[0].id;
let exam = RESULT_EXAM_BY_ID.get(initialExam.id);
let responses = loadResponses(exam.id);
let diagnosisOpen = false;

$("studentName").textContent = `${student} 학생`;
$("printStudent").textContent = `${student} 학생`;
$("printWatermark").innerHTML = Array.from({ length: 6 }, () => `<span>${student} 학생 · GFIELD</span>`).join("");
$("backToBank").href = `./index.html?student=${encodeURIComponent(student)}`;
$("groupSelect").innerHTML = RESULT_EXAM_GROUPS.map((group) => `<option value="${group.id}">${group.label} · ${group.exams.length}종</option>`).join("");
$("groupSelect").value = activeGroupId;

function groupById(id) {
  return RESULT_EXAM_GROUPS.find((group) => group.id === id) || RESULT_EXAM_GROUPS[0];
}

function loadResponses(examId) {
  try {
    const value = JSON.parse(localStorage.getItem(resultStorageKey(student, examId)) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function saveResponses() {
  localStorage.setItem(resultStorageKey(student, exam.id), JSON.stringify(responses));
}

function updateUrl() {
  const next = new URL(location.href);
  next.searchParams.set("student", student);
  next.searchParams.set("exam", exam.id);
  history.replaceState(null, "", next);
}

function setExam(nextExam) {
  exam = RESULT_EXAM_BY_ID.get(nextExam.id) || nextExam;
  responses = loadResponses(exam.id);
  diagnosisOpen = false;
  updateUrl();
  render();
}

function renderExamOptions() {
  const group = groupById(activeGroupId);
  $("examSelect").innerHTML = group.exams.map((item) => `<option value="${item.id}">${item.label} · ${item.questions.length}문항</option>`).join("");
  if (!group.exams.some((item) => item.id === exam.id)) exam = RESULT_EXAM_BY_ID.get(group.exams[0].id);
  $("examSelect").value = exam.id;
}

function responseRow(question) {
  const classification = question.classification;
  const result = responses[question.number];
  const typeLabel = question.note || classification?.detailedTypeLabel || "유형 확인 필요";
  return `<article class="response-row ${result ? `is-${result}` : ""}">
    <span>${String(question.number).padStart(2, "0")}</span>
    <div class="response-copy"><strong>${typeLabel}</strong><small>${classification?.majorDomainLabel || "미분류"} · ${classification?.minorDomain || "미분류"}</small></div>
    <div class="ox-buttons" role="group" aria-label="${question.number}번 결과">
      <button type="button" data-number="${question.number}" data-result="correct" class="${result === "correct" ? "active" : ""}" aria-pressed="${result === "correct"}">O</button>
      <button type="button" data-number="${question.number}" data-result="incorrect" class="${result === "incorrect" ? "active" : ""}" aria-pressed="${result === "incorrect"}">X</button>
    </div>
  </article>`;
}

function textbookSummary(references) {
  if (!references.length) return "교재 연결 위치 확인 중";
  const labels = references.slice(0, 3).map((ref) => `${ref.bookLabel} ${ref.unitLabel} · ${ref.stageLabel}`);
  return labels.join(" / ") + (references.length > 3 ? ` 외 ${references.length - 3}곳` : "");
}

function renderDiagnosis(analysis) {
  $("diagnosisPanel").hidden = !diagnosisOpen;
  if (!diagnosisOpen) return;
  $("diagnosisTitle").textContent = `${exam.label} · ${analysis.correct}/${analysis.total}문항`;
  $("diagnosisMessage").textContent = analysis.wrong
    ? `오답 ${analysis.wrong}문항을 ${analysis.weakTypes.length}개 세부 유형으로 정리했습니다.`
    : "오답이 없습니다. 다음 시험이나 더 높은 난이도로 이어가세요.";
  $("scoreValue").textContent = `${analysis.score}점`;
  $("domainAnalysis").innerHTML = analysis.domainStats.map((row) => `<div class="domain-row"><span>${row.label}</span><i><b style="width:${row.correctRate}%"></b></i><em>${row.correct}/${row.total}</em></div>`).join("");
  $("weakTypeList").innerHTML = analysis.weakTypes.length ? analysis.weakTypes.map((row) => `<article class="weak-type">
    <div><h4>${row.label}</h4><p>${row.domainLabel} · ${row.middle} · 대표 개념: ${row.representativeConceptLabel}<br>${textbookSummary(row.textbookReferences)}</p>
    <div class="type-meta">${row.academyStyleLabels.map((label) => `<span>${label}</span>`).join("")}<span>실제 출제 기준</span></div></div>
    <strong>X ${row.wrong} · ${row.wrongRate}%</strong>
  </article>`).join("") : '<p class="all-clear">모든 문항을 맞혔습니다. 취약 유형이 없습니다.</p>';
  $("questionDetails").innerHTML = analysis.questionResults.map((row) => `<tr>
    <td>${row.number}번</td><td class="${row.result === "correct" ? "result-o" : "result-x"}">${row.result === "correct" ? "O" : "X"}</td>
    <td>${row.domainLabel}</td><td>${row.middle}</td><td>${row.typeLabel}</td><td>${row.difficulty === "actual" ? "실제 출제" : row.difficulty}</td>
  </tr>`).join("");
  $("remediationTypes").innerHTML = analysis.weakTypes.map((row, index) => `<label class="remediation-choice"><input type="checkbox" value="${row.id}" ${index < 6 ? "checked" : ""}><span><strong>${row.label}</strong><small>${row.wrongNumbers.join(", ")}번 오답</small></span></label>`).join("");
  updateRemediationLink();
  $("remediationTypes").querySelectorAll("input").forEach((input) => input.addEventListener("change", updateRemediationLink));
}

function selectedWeakTypeIds() {
  return [...$("remediationTypes").querySelectorAll("input:checked")].map((input) => input.value);
}

function updateRemediationLink() {
  const typeIds = selectedWeakTypeIds();
  const link = $("remediationLink");
  link.href = typeIds.length ? remediationUrl(typeIds, student, Number($("remediationCount").value)) : "#";
  link.classList.toggle("is-disabled", !typeIds.length);
  link.setAttribute("aria-disabled", String(!typeIds.length));
}

function render() {
  renderExamOptions();
  const analysis = analyzeExamResults(exam, responses);
  $("examStage").textContent = `${exam.resultGroupLabel || groupById(activeGroupId).label} · ${stageLabelForExam(exam)}`;
  $("examTitle").textContent = exam.label;
  $("answeredCount").textContent = `${analysis.answered} / ${analysis.total}`;
  $("correctCount").textContent = String(analysis.correct);
  $("wrongCount").textContent = String(analysis.wrong);
  $("progressBar").style.width = `${analysis.total ? (analysis.answered / analysis.total) * 100 : 0}%`;
  $("responseGrid").innerHTML = exam.questions.map(responseRow).join("");
  $("responseGrid").querySelectorAll("button[data-result]").forEach((button) => button.addEventListener("click", () => {
    responses[button.dataset.number] = button.dataset.result;
    diagnosisOpen = false;
    saveResponses();
    render();
  }));
  $("entryMessage").textContent = analysis.complete ? "입력이 완료되었습니다." : `${analysis.unanswered}문항을 더 입력하면 진단할 수 있습니다.`;
  $("showResult").disabled = !analysis.complete;
  renderDiagnosis(analysis);
}

$("groupSelect").addEventListener("change", () => {
  activeGroupId = $("groupSelect").value;
  const nextExam = groupById(activeGroupId).exams[0];
  setExam(nextExam);
});
$("examSelect").addEventListener("change", () => setExam(RESULT_EXAM_BY_ID.get($("examSelect").value)));
$("clearAnswers").addEventListener("click", () => {
  responses = {};
  diagnosisOpen = false;
  saveResponses();
  render();
});
$("showResult").addEventListener("click", () => {
  diagnosisOpen = true;
  render();
  $("diagnosisPanel").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("printResult").addEventListener("click", () => window.print());
$("remediationCount").addEventListener("change", updateRemediationLink);

updateUrl();
render();
