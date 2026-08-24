import { DOMAINS, EXAMS, typeById } from "./source-data.js?v=20260822m";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const domainById = Object.fromEntries(DOMAINS.map((domain) => [domain.id, domain]));
const DIAGNOSIS_EXAMS = EXAMS.filter((item) => item.verified);
let exam = DIAGNOSIS_EXAMS.find((item) => item.id === params.get("exam")) || DIAGNOSIS_EXAMS[0];
let responses = loadResponses(exam.id);

if (params.get("exam") !== exam.id) {
  const next = new URL(location.href);
  next.searchParams.set("exam", exam.id);
  history.replaceState(null, "", next);
}

$("studentName").textContent = student;
for (let row = 0; row < 3; row += 1) {
  const label = document.createElement("span");
  label.textContent = `${student} 학생 · GFIELD`;
  $("studentWatermark").appendChild(label);
}
$("examSelect").innerHTML = DIAGNOSIS_EXAMS.map((item) => `<option value="${item.id}" ${item.id === exam.id ? "selected" : ""}>${item.label}</option>`).join("");
$("examSelect").addEventListener("change", () => {
  exam = DIAGNOSIS_EXAMS.find((item) => item.id === $("examSelect").value) || DIAGNOSIS_EXAMS[0];
  responses = loadResponses(exam.id);
  const next = new URL(location.href);
  next.searchParams.set("exam", exam.id);
  history.replaceState(null, "", next);
  render();
});
$("clearAnswers").addEventListener("click", () => {
  responses = {};
  saveResponses();
  render();
});

function storageKey() {
  return `fields-classic-original-diagnosis:${student}:${exam.id}`;
}

function loadResponses(examId) {
  try {
    return JSON.parse(localStorage.getItem(`fields-classic-original-diagnosis:${student}:${examId}`) || "{}") || {};
  } catch {
    return {};
  }
}

function saveResponses() {
  localStorage.setItem(storageKey(), JSON.stringify(responses));
}

function stageLabel() {
  const labels = {
    k6_winter: "6세 12월~7세 2월",
    k7_spring: "7세 3월~5월",
    k7_summer: "7세 6월~8월",
    k7_november: "7세 9월~12월",
    k7_to_g1: "7세 12월~초1 2월",
    g1_spring: "초1 3월~5월",
    g1_summer: "초1 6월~8월",
    g1_fall: "초1 8월~10월",
    g1_winter: "초1 11월~1월"
  };
  return labels[exam.stage] || "원본 시험";
}

function responseCard(sourceQuestion) {
  const item = typeById(sourceQuestion.typeId);
  const domain = domainById[item?.domain];
  const choice = responses[sourceQuestion.number];
  const typeLabel = sourceQuestion.note || item?.label || "유형 대조 중";
  return `<article class="response-card ${choice ? `is-${choice}` : ""}">
    <div class="question-id"><span>${String(sourceQuestion.number).padStart(2, "0")}</span><em>${domain?.label || "유형"}</em></div>
    <strong>${typeLabel}</strong>
    <small>${item?.middle || "세부 유형"}</small>
    <div class="ox-actions" role="group" aria-label="${sourceQuestion.number}번 채점 결과">
      <button type="button" data-number="${sourceQuestion.number}" data-result="correct" class="${choice === "correct" ? "active" : ""}">O</button>
      <button type="button" data-number="${sourceQuestion.number}" data-result="incorrect" class="${choice === "incorrect" ? "active" : ""}">X</button>
    </div>
  </article>`;
}

function renderResults(answered, correct) {
  const completed = answered === exam.questions.length;
  $("resultPanel").hidden = !completed;
  if (!completed) return;
  const wrong = exam.questions.filter((question) => responses[question.number] === "incorrect");
  const grouped = wrong.reduce((result, question) => {
    const item = typeById(question.typeId);
    const key = item?.id || question.typeId;
    if (!result.has(key)) result.set(key, { item, count: 0, numbers: [] });
    const row = result.get(key);
    row.count += 1;
    row.numbers.push(question.number);
    return result;
  }, new Map());
  const rows = [...grouped.values()].sort((a, b) => b.count - a.count || a.numbers[0] - b.numbers[0]);
  $("resultSummary").innerHTML = `<strong>${correct} / ${exam.questions.length}</strong><span>${wrong.length ? `틀린 ${wrong.length}문항을 유형별로 살펴보세요.` : "모든 문항을 맞혔습니다. 다음 시험 시기의 원본 시험도 확인해 보세요."}</span>`;
  $("weakTypes").innerHTML = rows.length
    ? rows.map(({ item, count, numbers }) => `<article><span>${domainById[item?.domain]?.label || "유형"}</span><strong>${item?.label || "유형 대조 중"}</strong><p>${item?.middle || "세부 유형"} · ${numbers.join(", ")}번 · ${count}문항</p></article>`).join("")
    : "";
}

function render() {
  $("examTiming").textContent = stageLabel();
  $("responseTitle").textContent = exam.label;
  $("responseGrid").innerHTML = exam.questions.map(responseCard).join("");
  $("responseGrid").querySelectorAll("button[data-result]").forEach((button) => button.addEventListener("click", () => {
    responses[button.dataset.number] = button.dataset.result;
    saveResponses();
    render();
  }));
  const values = Object.values(responses);
  const answered = values.length;
  const correct = values.filter((value) => value === "correct").length;
  $("answeredCount").textContent = `${answered} / ${exam.questions.length}`;
  $("correctCount").textContent = String(correct);
  $("scoreValue").textContent = answered ? `${Math.round((correct / exam.questions.length) * 100)}점` : "-";
  renderResults(answered, correct);
}

render();
