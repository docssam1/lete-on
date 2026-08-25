import { DOMAINS, EXAMS, typeById } from "./source-data.js?v=20260823a";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const domainById = Object.fromEntries(DOMAINS.map((domain) => [domain.id, domain]));
const DIAGNOSIS_EXAMS = EXAMS.filter((item) => item.verified);
let exam = DIAGNOSIS_EXAMS.find((item) => item.id === params.get("exam")) || DIAGNOSIS_EXAMS[0];
let responses = loadResponses(exam.id);
let resultOpen = false;

if (params.get("exam") !== exam.id) {
  const next = new URL(location.href);
  next.searchParams.set("exam", exam.id);
  history.replaceState(null, "", next);
}

$("studentName").textContent = student + " 학생";
for (let row = 0; row < 3; row += 1) {
  const label = document.createElement("span");
  label.textContent = student + " 학생 · GFIELD";
  $("studentWatermark").appendChild(label);
}
$("examSelect").innerHTML = DIAGNOSIS_EXAMS.map((item) => "<option value=\"" + item.id + "\"" + (item.id === exam.id ? " selected" : "") + ">" + item.label + "</option>").join("");
$("examSelect").addEventListener("change", () => {
  exam = DIAGNOSIS_EXAMS.find((item) => item.id === $("examSelect").value) || DIAGNOSIS_EXAMS[0];
  responses = loadResponses(exam.id);
  resultOpen = false;
  const next = new URL(location.href);
  next.searchParams.set("exam", exam.id);
  history.replaceState(null, "", next);
  render();
});
$("clearAnswers").addEventListener("click", () => {
  responses = {};
  resultOpen = false;
  saveResponses();
  render();
});
$("showResult").addEventListener("click", () => {
  resultOpen = true;
  render();
  $("resultPanel").scrollIntoView({ behavior: "smooth", block: "start" });
});

function storageKey() { return "fields-classic-original-diagnosis:" + student + ":" + exam.id; }
function loadResponses(examId) {
  try { return JSON.parse(localStorage.getItem("fields-classic-original-diagnosis:" + student + ":" + examId) || "{}") || {}; }
  catch { return {}; }
}
function saveResponses() { localStorage.setItem(storageKey(), JSON.stringify(responses)); }
function stageLabel() {
  const labels = {
    k6_winter: "6세 12월~7세 2월", k7_spring: "7세 3월~5월", k7_summer: "7세 6월~8월",
    k7_november: "7세 9월~12월", k7_to_g1: "7세 12월~초1 2월", g1_spring: "초1 3월~5월",
    g1_summer: "초1 6월~8월", g1_fall: "초1 8월~10월", g1_winter: "초1 11월~1월"
  };
  return labels[exam.stage] || "원본 시험";
}
function activeResponses() {
  return Object.fromEntries(exam.questions
    .filter((question) => responses[question.number] === "correct" || responses[question.number] === "incorrect")
    .map((question) => [question.number, responses[question.number]]));
}
function responseCard(sourceQuestion) {
  const item = typeById(sourceQuestion.typeId);
  const domain = domainById[item?.domain];
  const choice = responses[sourceQuestion.number];
  const typeLabel = sourceQuestion.note || item?.label || "유형 대조 중";
  return '<article class="response-card ' + (choice ? "is-" + choice : "") + '">' +
    '<div class="question-id"><span>' + String(sourceQuestion.number).padStart(2, "0") + '번</span><em>' + (domain?.label || "유형") + '</em></div>' +
    "<strong>" + typeLabel + "</strong><small>" + (item?.middle || "세부 유형") + "</small>" +
    '<div class="ox-actions" role="group" aria-label="' + sourceQuestion.number + '번 채점 결과">' +
    '<button type="button" data-number="' + sourceQuestion.number + '" data-result="correct" class="' + (choice === "correct" ? "active" : "") + '">O</button>' +
    '<button type="button" data-number="' + sourceQuestion.number + '" data-result="incorrect" class="' + (choice === "incorrect" ? "active" : "") + '">X</button></div></article>';
}
function metrics() {
  const active = activeResponses();
  const answered = Object.keys(active).length;
  const correct = Object.values(active).filter((value) => value === "correct").length;
  return { answered, correct, score: answered ? Math.round((correct / exam.questions.length) * 100) : 0 };
}
function renderResults({ correct, score }) {
  $("resultPanel").hidden = !resultOpen;
  if (!resultOpen) return;
  const wrong = exam.questions.filter((question) => responses[question.number] === "incorrect");
  const domainStats = exam.questions.reduce((map, question) => {
    const item = typeById(question.typeId);
    const domain = domainById[item?.domain];
    const key = domain?.id || "other";
    if (!map.has(key)) map.set(key, { label: domain?.label || "기타", total: 0, correct: 0 });
    const row = map.get(key);
    row.total += 1;
    if (responses[question.number] === "correct") row.correct += 1;
    return map;
  }, new Map());
  const weakStats = wrong.reduce((map, question) => {
    const item = typeById(question.typeId);
    const key = item?.id || question.typeId;
    if (!map.has(key)) map.set(key, { item, numbers: [] });
    map.get(key).numbers.push(question.number);
    return map;
  }, new Map());
  $("resultScore").textContent = score + "점";
  $("resultTitle").textContent = exam.label + " · " + correct + " / " + exam.questions.length + "문항";
  $("resultMessage").textContent = wrong.length ? "틀린 " + wrong.length + "문항의 유형을 아래에서 확인하세요." : "모든 문항을 맞혔습니다. 다음 시기의 시험도 이어서 진단해 보세요.";
  $("domainAnalysis").innerHTML = [...domainStats.values()].map((row) => {
    const percentage = Math.round((row.correct / row.total) * 100);
    return '<div class="domain-row"><span>' + row.label + "</span><i><b style=\"width:" + percentage + '%\"></b></i><em>' + row.correct + "/" + row.total + "</em></div>";
  }).join("");
  $("weakTypes").innerHTML = weakStats.size ? [...weakStats.values()].map(({ item, numbers }) =>
    '<div class="weak-type"><span>' + (domainById[item?.domain]?.label || "유형") + "</span><strong>" + (item?.label || "유형 대조 중") + "</strong><p>" + numbers.join(", ") + "번 · " + (item?.middle || "세부 유형") + "</p></div>"
  ).join("") : '<p class="all-clear">약점 유형이 없습니다. 훌륭합니다.</p>';
  $("resultDetails").innerHTML = exam.questions.map((question) => {
    const item = typeById(question.typeId);
    const domain = domainById[item?.domain];
    const isCorrect = responses[question.number] === "correct";
    return "<tr><td>" + question.number + "번</td><td>" + (domain?.label || "유형") + "</td><td>" + (question.note || item?.label || "유형 대조 중") + '</td><td class="' + (isCorrect ? "result-o" : "result-x") + '">' + (isCorrect ? "O · 정답" : "X · 오답") + "</td></tr>";
  }).join("");
}
function render() {
  const { answered, correct, score } = metrics();
  $("examTiming").textContent = stageLabel();
  $("responseTitle").textContent = exam.label;
  $("responseGrid").innerHTML = exam.questions.map(responseCard).join("");
  $("responseGrid").querySelectorAll("button[data-result]").forEach((button) => button.addEventListener("click", () => {
    responses[button.dataset.number] = button.dataset.result;
    resultOpen = false;
    saveResponses();
    render();
  }));
  $("answeredCount").textContent = answered + " / " + exam.questions.length;
  $("correctCount").textContent = String(correct);
  $("scoreValue").textContent = answered ? score + "점" : "-";
  $("progressBar").style.width = (answered / exam.questions.length) * 100 + "%";
  $("showResult").disabled = answered !== exam.questions.length;
  renderResults({ correct, score });
}
render();
