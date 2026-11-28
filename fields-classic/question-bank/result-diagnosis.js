import { DOMAINS } from "./source-data.js?v=20261128b";
import {
  RESULT_EXAM_BY_ID,
  RESULT_EXAM_GROUPS,
  analyzeExamResults,
  remediationUrl,
  resultStorageKey,
  stageLabelForExam
} from "./result-diagnosis-data.js?v=20261128b";
import { loggedIn, checkSession } from "./study-progress.js?v=20261117a";
import { hasBank } from "./entrance-products.js?v=20261116b";
import { loadSelectionAnswers, selectionVideoHref, selectionVideoFrom, answerVisualMarkup, workMarkup, isListVisual } from "./selection-answers.js?v=20261116e";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
// 입학 모의고사(entrance.html)에서 들어오면 as=student — 약점 유사문제를 문제은행 시험지로 바로 연다(원장 2026-11-16)
const asStudent = params.get("as") === "student";
// 등급(원장 2026-11-16 「등급에 따라 오답문제만 1문제씩 · 문제은행 서비스는 추가 유료서비스」): 학생 쪽에서 문제은행 권한이 없으면
// 보충 학습지는 고르기 없이 「틀린 문항마다 같은 유형 1문제씩」만. 권한이 있으면(또는 원장 쪽 문제은행에서 열면) 예전처럼 고른다.
if (asStudent && loggedIn()) await checkSession();
const simpleOnly = asStudent && !hasBank(loggedIn());
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
let lastAnalysis = null;
// 선발시험은 번호마다 정답을 같이 보여 준다(원장 2026-11-16 「답안이 없어」) — 비공개 표에서 받아 온다(selection-answers.js)
let answerKey = null, answerKeyExam = "";
async function fetchAnswerKey() {
  const id = exam.id;
  answerKeyExam = id; answerKey = null; openSteps.clear();
  const answers = await loadSelectionAnswers(id);
  if (exam.id === id && answers) { answerKey = answers; render(); }
}
// 화면 글에 회사·상품 이름(더 클래식)을 쓰지 않는다
const plain = (label) => String(label ?? "").replace(/더\s*클래식\s*/gu, "");
const initialExam = RESULT_EXAM_BY_ID.get(params.get("exam")) || RESULT_EXAM_GROUPS[0].exams[0];
let activeGroupId = RESULT_EXAM_GROUPS.find((group) => group.exams.some((exam) => exam.id === initialExam.id))?.id || RESULT_EXAM_GROUPS[0].id;
let exam = RESULT_EXAM_BY_ID.get(initialExam.id);
let responses = loadResponses(exam.id);
let diagnosisOpen = false;

$("studentName").textContent = `${student} 학생`;
$("printStudent").textContent = `${student} 학생`;
$("printWatermark").innerHTML = Array.from({ length: 6 }, () => `<span>${student} 학생 · GFIELD</span>`).join("");
$("backToBank").href = `./index.html?student=${encodeURIComponent(student)}`;
if (asStudent) { $("backToBank").href = `./entrance.html?student=${encodeURIComponent(student)}`; $("backToBank").textContent = "입학 모의고사"; }
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
  $("examSelect").innerHTML = group.exams.map((item) => `<option value="${item.id}">${plain(item.label)} · ${item.questions.length}문항</option>`).join("");
  if (!group.exams.some((item) => item.id === exam.id)) exam = RESULT_EXAM_BY_ID.get(group.exams[0].id);
  $("examSelect").value = exam.id;
}

// 정답 + 풀이(간단히 · 설명 보기, 원장 2026-11-16). 정답이 있는 시험은 한 문항을 가로 한 줄로 —
// 번호·유형·정답 | 풀이(식) | O X (원장 2026-11-16 「답안과 풀이도 ox 안해도 한번에 볼 수 있도록 · ox는 가로로」).
// 간단히 보기와 식은 늘 펼쳐 두고, 설명 보기는 하나씩 또는 「설명 모두 펼치기」로 연다. O/X를 눌러도 열린 것은 그대로.
let allSteps = false;
const openSteps = new Set();
function keyMarkup(key, number) {
  return `<em class="response-key">정답${isListVisual(key.answerVisual) ? "" : ` ${escapeHtml(key.text)}`}${answerVisualMarkup(key.answerVisual)}</em>`;
}
function solutionMarkup(key, number) {
  const brief = key.brief ? `<p><b>간단히</b> ${escapeHtml(key.brief)}</p>` : "";
  const open = allSteps || openSteps.has(String(number)) ? " open" : "";
  const steps = key.steps?.length ? `<details class="response-steps" data-number="${number}"${open}><summary>설명 보기</summary><ol>${key.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></details>` : "";
  const href = selectionVideoHref(exam.id, number, { student, title: `${plain(exam.label)} ${number}번 해설` });
  const video = href ? `<a class="response-video" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="${escapeHtml(selectionVideoFrom(exam.id, number))}">해설 영상</a>` : "";
  return brief || key.work?.length || steps || video ? `<div class="response-sol">${brief}${workMarkup(key.work)}${steps}${video}</div>` : "";
}

function responseRow(question) {
  const classification = question.classification;
  const result = responses[question.number];
  const typeLabel = question.note || classification?.detailedTypeLabel || "유형 확인 필요";
  const key = answerKey?.[question.number];
  return `<article class="response-row ${result ? `is-${result}` : ""}">
    <span>${String(question.number).padStart(2, "0")}</span>
    <div class="response-copy"><strong>${typeLabel}</strong><small>${classification?.majorDomainLabel || "미분류"} · ${classification?.minorDomain || "미분류"}</small>${key ? keyMarkup(key, question.number) : ""}</div>
    ${key ? solutionMarkup(key, question.number) : ""}
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

// 합격 가능 반(원장 2026-11-16 「초1 모의고사 30점 주1회 낮은반 · 50 주1회 높은반 · 65 E2 · 80 E1 합격 가능」):
// 초1 입학 대비 = 7세 선발시험(stage k…). 점수는 100점 만점(맞은 문항 ÷ 전체). 낮은 줄부터.
// 원장 2026-11-16 「초1 선발 나머지 회차도 합격 가능 반 기준 넣어」 → 초1 선발시험(stage g1…, 초2 입학 대비)도 같은 줄.
const PASS_LINES = [
  { score: 30, label: "주1회 낮은반" },
  { score: 50, label: "주1회 높은반" },
  { score: 65, label: "E2" },
  { score: 80, label: "E1" },
];
const passGrade = (item) => { const stage = String(item?.stage || ""); return stage.startsWith("k") ? "초1" : stage.startsWith("g1") ? "초2" : ""; };
const passLinesFor = (item) => (passGrade(item) ? PASS_LINES : null);
function renderPass(analysis) {
  const lines = passLinesFor(exam);
  $("passSection").hidden = !lines;
  $("passVerdict").hidden = !lines;
  if (!lines) return;
  const score = analysis.score, per = analysis.total ? 100 / analysis.total : 5;
  const reached = lines.filter((line) => score >= line.score).at(-1);
  const toGo = (line) => Math.ceil((line.score - score) / per);
  $("passVerdict").textContent = reached ? `${reached.label} 합격 가능` : `${lines[0].label}까지 ${toGo(lines[0])}문항`;
  $("passNote").textContent = `${passGrade(exam)} 입학 기준 · 한 문항 ${Math.round(per * 10) / 10}점`;
  $("passLadder").innerHTML = [...lines].reverse().map((line) => {
    const ok = score >= line.score;
    const here = reached === line;
    return `<li class="${ok ? "is-ok" : ""}${here ? " is-here" : ""}"><b>${line.label}</b><span>${line.score}점 이상</span><em>${ok ? (here ? "합격 가능 · 지금 여기" : "합격 가능") : `${toGo(line)}문항 더`}</em></li>`;
  }).join("");
}

function renderDiagnosis(analysis) {
  $("diagnosisPanel").hidden = !diagnosisOpen;
  if (!diagnosisOpen) return;
  $("diagnosisTitle").textContent = `${plain(exam.label)} · ${analysis.correct}/${analysis.total}문항`;
  $("diagnosisMessage").textContent = analysis.wrong
    ? `오답 ${analysis.wrong}문항을 ${analysis.weakTypes.length}개 세부 유형으로 정리했습니다.`
    : "오답이 없습니다. 다음 시험이나 더 높은 난이도로 이어가세요.";
  $("scoreValue").textContent = `${analysis.score}점`;
  renderPass(analysis);
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
  lastAnalysis = analysis;
  $("remediationTypes").innerHTML = analysis.weakTypes.map((row, index) => `<label class="remediation-choice"><input type="checkbox" value="${row.id}" ${index < 6 ? "checked" : ""}><span><strong>${row.label}</strong><small>${row.wrongNumbers.join(", ")}번 오답</small></span></label>`).join("");
  updateRemediationLink();
  $("remediationTypes").querySelectorAll("input").forEach((input) => input.addEventListener("change", updateRemediationLink));
}

function selectedWeakTypeIds() {
  return [...$("remediationTypes").querySelectorAll("input:checked")].map((input) => input.value);
}

function updateRemediationLink() {
  const link = $("remediationLink");
  if (simpleOnly) {
    // 틀린 문항마다 1문제(같은 유형) — 문항 수 = 문제 수, 난이도는 원본과 같게
    const wrong = (lastAnalysis?.questionResults || []).filter((row) => row.result === "incorrect");
    link.href = wrong.length ? remediationUrl(wrong.map((row) => row.typeId), student, wrong.length, { paper: true, level: "actual", title: `${plain(exam.label)} · 오답 유사문제` }) : "#";
    link.textContent = wrong.length ? `오답 유사문제 ${wrong.length}문제 만들기` : "틀린 문항이 없어요";
    link.classList.toggle("is-disabled", !wrong.length);
    link.setAttribute("aria-disabled", String(!wrong.length));
    return;
  }
  const typeIds = selectedWeakTypeIds();
  link.href = typeIds.length ? remediationUrl(typeIds, student, Number($("remediationCount").value),
    asStudent ? { paper: true, level: $("remediationLevel").value, title: `${plain(exam.label)} · 약점 유사문제` } : {}) : "#";
  link.classList.toggle("is-disabled", !typeIds.length);
  link.setAttribute("aria-disabled", String(!typeIds.length));
}

function render() {
  renderExamOptions();
  if (answerKeyExam !== exam.id) fetchAnswerKey();
  const analysis = analyzeExamResults(exam, responses);
  $("examStage").textContent = `${exam.resultGroupLabel || groupById(activeGroupId).label} · ${stageLabelForExam(exam)}`;
  $("examTitle").textContent = plain(exam.label);
  $("answeredCount").textContent = `${analysis.answered} / ${analysis.total}`;
  $("correctCount").textContent = String(analysis.correct);
  $("wrongCount").textContent = String(analysis.wrong);
  $("progressBar").style.width = `${analysis.total ? (analysis.answered / analysis.total) * 100 : 0}%`;
  const hasKey = !!answerKey && answerKeyExam === exam.id;
  $("responseGrid").classList.toggle("has-key", hasKey);
  $("stepsToggle").hidden = !hasKey || !Object.values(answerKey || {}).some((key) => key?.steps?.length);
  $("stepsToggle").textContent = allSteps ? "설명 모두 접기" : "설명 모두 펼치기";
  $("stepsToggle").setAttribute("aria-pressed", String(allSteps));
  $("responseGrid").innerHTML = exam.questions.map(responseRow).join("");
  $("responseGrid").querySelectorAll("details.response-steps").forEach((box) => box.addEventListener("toggle", () => {
    if (box.open) openSteps.add(box.dataset.number); else openSteps.delete(box.dataset.number);
  }));
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

$("stepsToggle").addEventListener("click", () => {
  allSteps = !allSteps;
  openSteps.clear();
  render();
});

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
$("remediationLevel").addEventListener("change", updateRemediationLink);
if (!asStudent) { const l = $("remediationLevel").closest("label"); l.hidden = true; l.style.display = "none"; }
if (simpleOnly) {
  $("remediationHead").textContent = "오답 유사문제";
  $("remediationLead").textContent = "틀린 문항마다 같은 유형으로 1문제씩 만들어 시험지로 인쇄해요. 문항·문제 수·난이도를 골라 만드는 문제은행은 추가 서비스예요.";
  // hidden 속성은 화면 CSS(label display)가 덮으므로 style로 숨긴다
  [$("remediationTypes"), $("remediationCountLabel"), $("remediationLevel").closest("label")].forEach((el) => { el.hidden = true; el.style.display = "none"; });
}   // 원장 쪽은 문제은행 1단계에서 난이도를 고른다

updateUrl();
render();
