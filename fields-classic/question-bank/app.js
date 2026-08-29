import { AGE_STAGES, DOMAINS, ACADEMY_STYLES, TYPES, EXAMS, PRACTICE_EXAM_TYPES, DIAGNOSTIC_EXAM_TYPES, FINAL_EXAM_TYPES, CURRICULUM, SOURCE_QUESTION_INDEX, TEXTBOOK_STAGES, questionClassificationForType, representativeConceptForType, textbookGuideForType, typeById } from "./source-data.js?v=20260829a";
import { GENERATORS } from "./generators.js?v=20260827e";
import { learningMapForType, learningMapInlineLabel } from "./learning-map.js?v=20260821a";
import { book01Markup } from "./book01-renderers.js?v=20260829f";
import { book03Markup } from "./book03-renderers.js?v=20260827b";
import { book04Markup } from "./book04-renderers.js?v=20260826b";
import { book05Markup } from "./book05-renderers.js?v=20260829b";
import { book06Markup } from "./book06-renderers.js?v=20260829b";
import { book07Markup } from "./book07-renderers.js?v=20260822h";
import { book08Markup } from "./book08-renderers.js?v=20260822i";
import { book09Markup } from "./book09-renderers.js?v=20260829b";
import { book10Markup } from "./book10-renderers.js?v=20260822k";
import { mock06Markup } from "./mock06-renderers.js?v=20260823a";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const domainIndex = Object.fromEntries(DOMAINS.map((domain, index) => [domain.id, index]));
const EXAM_SOURCES = [...DIAGNOSTIC_EXAM_TYPES, ...EXAMS, ...PRACTICE_EXAM_TYPES, ...FINAL_EXAM_TYPES];
const OUR_MOCK_EXAM_GROUPS = [
  { label: "진단 모의고사", exams: DIAGNOSTIC_EXAM_TYPES },
  { label: "실전 모의고사", exams: PRACTICE_EXAM_TYPES },
  { label: "파이널 모의고사", exams: FINAL_EXAM_TYPES }
];
const MOCK_EXAM_NAV = [
  { id: "diagnostic", label: "진단 모의고사", exams: DIAGNOSTIC_EXAM_TYPES },
  ...PRACTICE_EXAM_TYPES.map((exam) => ({ id: `exam:${exam.id}`, label: exam.label.replace("실전 모의고사 ", "실전 "), exams: [exam] })),
  ...FINAL_EXAM_TYPES.map((exam) => ({ id: `exam:${exam.id}`, label: exam.label.replace("파이널 모의고사 ", "파이널 "), exams: [exam] }))
];
const academyStyleIdsByType = new Map(TYPES.map((item) => [item.id, new Set(item.academyStyleIds || [])]));
const sourceQuestionByKey = new Map(SOURCE_QUESTION_INDEX.map((item) => [item.sourceKey, item]));
for (const sourceQuestion of SOURCE_QUESTION_INDEX) {
  sourceQuestion.classifications.forEach((classification) => {
    const styleIds = academyStyleIdsByType.get(classification.detailedTypeId) || new Set();
    classification.academyStyleIds.forEach((styleId) => styleIds.add(styleId));
    academyStyleIdsByType.set(classification.detailedTypeId, styleIds);
  });
}
const stageIds = new Set([...AGE_STAGES.map((item) => item.id), ...MOCK_EXAM_NAV.map((item) => item.id)]);

function requestedStage() {
  const requested = params.get("age");
  if (requested === "ours" || requested === "diagnostic") return "diagnostic";
  if (requested === "practice") return `exam:${PRACTICE_EXAM_TYPES[0]?.id}`;
  if (requested === "final") return `exam:${FINAL_EXAM_TYPES[0]?.id}`;
  return stageIds.has(requested) ? requested : "diagnostic";
}

const state = {
  mode: "exam",
  stage: requestedStage(),
  selected: { exam: new Set(), curriculum: new Set(), unitTest: new Set(), type: new Set() },
  academyStyles: new Set(ACADEMY_STYLES.map((item) => item.id)),
  count: 20,
  difficulty: "actual",
  curriculumBookId: CURRICULUM[0]?.id || "book-01",
  curriculumStage: "type",
  order: "exam",
  includeSolution: true,
  watermark: true,
  questions: []
};

function activeTextbookStage() {
  return TEXTBOOK_STAGES.find((item) => item.id === state.curriculumStage) || TEXTBOOK_STAGES[1];
}

function activeDifficulty() {
  if (state.mode === "curriculum") return activeTextbookStage().difficulty;
  return state.difficulty === "basic" ? 1 : state.difficulty === "advanced" ? 3 : 2;
}

function withProblemContext(problem, item, reference, sourceClassification = null) {
  const studyStage = state.mode === "curriculum" ? activeTextbookStage() : null;
  const classification = sourceClassification || questionClassificationForType(item.id);
  return {
    ...problem,
    type: item,
    reference,
    classification,
    representativeConcept: representativeConceptForType(item.id),
    studyStage,
    conceptGuide: studyStage?.id === "concept" ? textbookGuideForType(item.id) : ""
  };
}

function isReady(item) {
  // 진단 유사문제 화면은 건드리지 않는다. 이 문제은행은 원본 1:1 대조(sourceMatched)
  // 또는 공용 엔진 독립 검산(bankApproved)을 통과하고 실제 생성 경로가 있는
  // 유형만 연다. 이름만 비슷한 레거시 이미지나 시제품은 열지 않는다.
  const ownGenerator = item?.generator && GENERATORS[item.generator];
  const geometryGenerator = item?.worksheetCode && globalThis.GW_GEN?.typeInfo(item.worksheetCode);
  const provenanceApproved = item?.sourceMatched || item?.bankApproved;
  if (item?.sourceAuditBlocked) return false;
  return Boolean(provenanceApproved && (ownGenerator || geometryGenerator));
}

function hasVerifiedSource(typeId) {
  return EXAM_SOURCES.some((exam) => exam.questions.some((sourceQuestion) => sourceQuestion.verified && sourceQuestion.typeId === typeId));
}

function isSelectableType(item) {
  // 선택 근거는 시험지 대조(hasVerifiedSource), 교재 대조(textbookSource),
  // 독립 검산된 연계 문제은행(worksheetSource) 세 가지다. 교재·연계 유형은
  // 대응하는 시험 문항이 없어도 유형·교재 탭에서 열 수 있다.
  // 시험지 탭은 이 함수와 별개로 문항별 verified 플래그를 함께 요구하므로,
  // 교재 대조만으로는 미검증 시험 문항이 열리지 않는다. 그 게이트는 절대 완화하지 않는다.
  return isReady(item) && (hasVerifiedSource(item.id) || Boolean(item.textbookSource) || Boolean(item.worksheetSource));
}

function typeStatus(item) {
  if (isReady(item)) return "무한 생성";
  if (item?.geometryGame) return "3D 렌더 연결 중";
  if (item?.status === "curriculum") return "교재 유형 분석 완료";
  return "생성기 제작 대기";
}

function typeSourceLabel(item) {
  if (hasVerifiedSource(item.id)) return "실제 출제 유형";
  if (item.textbookSource) return "교재 대조 유형 · 문제번호 색인 연결";
  if (item.bankApproved && item.worksheetSource) return `연계 문제은행 유형 · ${item.worksheetSource}`;
  return "원본 대조 유형";
}

function learningMapPreviewMarkup(item) {
  const map = learningMapForType(item);
  if (map.kind === "extension") {
    return `<section class="type-learning-map extension" aria-label="사고력 확장 위치">
      <div class="learning-map-title"><strong>${map.label}</strong><span>${map.relation}</span></div>
      <p>${map.note}</p>
    </section>`;
  }

  const groupRows = map.groups.map((groupItem) => `<div class="learning-map-row">
    <span>${groupItem.nationalDomain}</span>
    <strong>${groupItem.strand}</strong>
    <small>${groupItem.gradeBand} · ${groupItem.standardRange}</small>
  </div>`).join("");
  const flow = map.groups[0].flow.map((step) => `<span>${step}</span>`).join("");
  return `<section class="type-learning-map related" aria-label="교육과정 관련 위치">
    <div class="learning-map-title"><strong>${map.label}</strong><span>${map.relation}</span></div>
    <div class="learning-map-rows">${groupRows}</div>
    <div class="learning-map-flow" aria-label="학습 흐름">${flow}</div>
    <p>${map.note} 개인 진단 결과가 아닙니다.</p>
  </section>`;
}

const typePreviewCache = new Map();
let typePreviewPanel = null;
let typePreviewAnchor = null;
let typePreviewHideTimer = null;

function ensureTypePreviewPanel() {
  if (typePreviewPanel) return typePreviewPanel;
  typePreviewPanel = document.createElement("aside");
  typePreviewPanel.id = "typePreview";
  typePreviewPanel.className = "type-preview";
  typePreviewPanel.setAttribute("role", "tooltip");
  typePreviewPanel.hidden = true;
  typePreviewPanel.addEventListener("pointerenter", () => clearTimeout(typePreviewHideTimer));
  typePreviewPanel.addEventListener("pointerleave", hideTypePreviewSoon);
  document.body.append(typePreviewPanel);
  return typePreviewPanel;
}

function previewProblem(item) {
  const levelKey = state.mode === "curriculum" ? `curriculum:${state.curriculumStage}` : `source:${state.difficulty}`;
  const key = `${item.id}:${levelKey}`;
  if (!typePreviewCache.has(key)) {
    typePreviewCache.set(key, generatedProblem(item, 0, "유형 예시", `preview:${item.id}`, 0));
  }
  return typePreviewCache.get(key);
}

function positionTypePreview(anchor) {
  const panel = ensureTypePreviewPanel();
  const rect = anchor.getBoundingClientRect();
  const margin = 12;
  const width = Math.min(390, window.innerWidth - margin * 2);
  panel.style.width = `${width}px`;
  const left = rect.right + margin + width <= window.innerWidth
    ? rect.right + margin
    : Math.max(margin, rect.left - width - margin);
  const top = Math.max(margin, Math.min(rect.top, window.innerHeight - panel.offsetHeight - margin));
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function textbookConceptTutorialMarkup(problem, compact = false) {
  if (problem.studyStage?.id !== "concept" || !problem.representativeConcept) return "";
  const concept = problem.representativeConcept;
  const steps = [
    ["개념 찾기", concept.summary],
    ["풀이 순서", concept.principle || problem.conceptGuide],
    ["답 확인", "문제의 조건과 묻는 값을 다시 살펴보고 같은 원리로 답을 검산합니다."]
  ];
  return `<section class="textbook-concept-tutorial ${compact ? "compact" : ""}"><header><span>개념 튜토리얼</span><strong>${concept.label}</strong></header><ol>${steps.map(([label, text], index) => `<li><b>${index + 1}</b><div><strong>${label}</strong><p>${text}</p></div></li>`).join("")}</ol></section>`;
}

function textbookConceptSolutionMarkup(question) {
  if (question.studyStage?.id !== "concept" || !state.includeSolution || !question.solution) return "";
  return `<details class="concept-worked-solution"><summary>풀이 확인</summary><p>${escapeAttribute(question.solution).replaceAll("\n", "<br>")}</p></details>`;
}

function showTypePreview(anchor) {
  const item = typeById(anchor.dataset.previewType);
  if (!item || !isSelectableType(item)) return;
  clearTimeout(typePreviewHideTimer);
  const panel = ensureTypePreviewPanel();
  const problem = previewProblem(item);
  if (!problem) {
    hideTypePreview();
    return;
  }
  const domain = DOMAINS.find((entry) => entry.id === item.domain);
  const representativeConcept = representativeConceptForType(item.id);
  const isConceptStage = problem.studyStage?.id === "concept";
  panel.innerHTML = `<div class="type-preview-head"><span>${domain.label} · ${item.middle}</span><strong>${item.label}</strong></div>
    ${problem.studyStage ? `<div class="study-stage-banner ${problem.studyStage.id}"><strong>${problem.studyStage.label}</strong><span>${problem.studyStage.sourceLabel} · ${problem.studyStage.description}</span></div>` : ""}
    ${isConceptStage ? textbookConceptTutorialMarkup(problem, true) : representativeConcept ? `<section class="representative-concept"><strong>대표 개념 · ${representativeConcept.label}</strong><p>${representativeConcept.summary}</p><small>이 유형의 핵심 · ${representativeConcept.principle}</small></section>` : ""}
    ${learningMapPreviewMarkup(item)}
    ${!isConceptStage && problem.conceptGuide ? `<div class="concept-guide"><strong>개념 발판</strong><span>${problem.conceptGuide}</span></div>` : ""}
    <p>${problem.prompt.replaceAll("\n", "<br>")}</p>
    ${problem.image ? `<img src="${problem.image}" alt="${item.label} 예시 그림" />` : visualMarkup(problem.visual)}`;
  panel.hidden = false;
  typePreviewAnchor?.removeAttribute("aria-describedby");
  typePreviewAnchor = anchor;
  typePreviewAnchor.setAttribute("aria-describedby", panel.id);
  positionTypePreview(anchor);
}

function hideTypePreview() {
  if (!typePreviewPanel) return;
  typePreviewPanel.hidden = true;
  typePreviewAnchor?.removeAttribute("aria-describedby");
  typePreviewAnchor = null;
}

function hideTypePreviewSoon() {
  clearTimeout(typePreviewHideTimer);
  typePreviewHideTimer = setTimeout(hideTypePreview, 100);
}

function initTypePreviews() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  document.addEventListener("pointerover", (event) => {
    if (!canHover.matches) return;
    const anchor = event.target.closest("[data-preview-type]");
    if (!anchor || anchor.contains(event.relatedTarget)) return;
    showTypePreview(anchor);
  });
  document.addEventListener("pointerout", (event) => {
    if (!canHover.matches) return;
    const anchor = event.target.closest("[data-preview-type]");
    if (!anchor || anchor.contains(event.relatedTarget) || typePreviewPanel?.contains(event.relatedTarget)) return;
    hideTypePreviewSoon();
  });
  window.addEventListener("scroll", hideTypePreview, { passive: true });
  window.addEventListener("resize", hideTypePreview);
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll("#builderTabs button").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  $("examBuilder").hidden = mode !== "exam";
  $("curriculumBuilder").hidden = mode !== "curriculum";
  $("typeBuilder").hidden = mode !== "type";
  $("difficultySetting").hidden = mode === "curriculum";
  $("curriculumStageSetting").hidden = mode !== "curriculum";
  typePreviewCache.clear();
  hideTypePreview();
  updateSummary();
}

function renderStageButtons() {
  const button = (item) => `<button type="button" class="${item.id === state.stage ? "active" : ""}" data-stage="${item.id}">${item.label}</button>`;
  $("examAgeButtons").innerHTML = `${MOCK_EXAM_NAV.map(button).join("")}<span class="stage-separator">원본 선발시험</span>${AGE_STAGES.map(button).join("")}`;
  $("examAgeButtons").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.stage = button.dataset.stage;
    renderStageButtons();
    renderExamList();
  }));
}

function visibleExams() {
  const mockStage = MOCK_EXAM_NAV.find((item) => item.id === state.stage);
  if (mockStage) return mockStage.exams;
  return EXAMS.filter((exam) => exam.stage === state.stage);
}

function examKey(examId, number) {
  return `${examId}:${number}`;
}

function renderExamList() {
  const exams = visibleExams();
  const stage = AGE_STAGES.find((item) => item.id === state.stage);
  const mockStage = MOCK_EXAM_NAV.find((item) => item.id === state.stage);
  $("examStageTitle").textContent = stage?.label || mockStage?.label || "시험지 선택";
  $("examStageMeta").textContent = `${exams.length}개 시험지 · 원본 문항 번호 기준`;
  $("examNotice").textContent = state.stage === "diagnostic"
    ? "필즈 대비 선발 진단 모의고사의 문항을 고릅니다. 문항 구조를 유지한 유사문제를 만들 수 있습니다."
    : mockStage
      ? `${mockStage.label}의 문항을 고릅니다. 실제 출제 구조를 기준으로 유사문제를 만듭니다.`
      : "원본 선발시험의 문항 번호를 고른 뒤 유사문제를 만듭니다. 원본 시험 진단은 정답 대조가 끝난 시험지부터 별도로 제공합니다.";
  const examMarkup = (exam) => {
    const rows = exam.questions.map((sourceQuestion) => {
      const item = typeById(sourceQuestion.typeId);
      const verified = sourceQuestion.verified === true;
      const ready = verified && isSelectableType(item);
      const page = typeof exam.pageFor === "function" ? `원본 ${exam.pageFor(sourceQuestion.number)}쪽` : "원본 문항";
      const key = examKey(exam.id, sourceQuestion.number);
      const sourceTitle = sourceQuestion.note || item?.label || "분류 확인 중";
      const typeDetail = item?.label && sourceTitle !== item.label ? `세부 유형: ${item.label} · ` : "";
      return `<label class="exam-row ${ready ? "" : "not-ready"}"${ready ? ` data-preview-type="${item.id}"` : ""}>
        <span class="number">${sourceQuestion.number}번</span>
        <input type="checkbox" data-exam-key="${key}" ${state.selected.exam.has(key) ? "checked" : ""} ${ready ? "" : "disabled"} />
        <span><strong>${sourceTitle}</strong><span>${item?.middle || ""} · ${typeDetail}${page} · 실제 출제</span></span>
        <em class="type-status ${ready ? "" : "fixed"}">${verified ? typeStatus(item) : "원본 대조 중"}</em>
      </label>`;
    }).join("");
    // 원문 이미지가 없는 시험지(sourcePageCount 미설정)는 링크 자체를 내지 않는다.
    // 링크만 걸어 두면 빈 뷰어로 들어가게 된다.
    // 파일명에 붙은 괄호 안 시행일(230206 등)은 화면에 내보내지 않는다. 파일을 찾는 데만 쓰는 값이다.
    const fileName = String(exam.file || "").replace(/\((\d{6}|\d{8})\)/g, "");
    const diagnosisLink = exam.verified && exam.sourcePageCount ? `<a class="source-view-link" href="./original-diagnosis.html?exam=${exam.id}&student=${encodeURIComponent(student)}">빠른 채점·진단</a>` : "";
    const examReady = exam.questions.every((sourceQuestion) => sourceQuestion.verified === true && isSelectableType(typeById(sourceQuestion.typeId)));
    const diagnosisStatus = diagnosisLink || `<span class="exam-source-status">${examReady ? "원본 대조 완료" : "유형 대조 중"}</span>`;
    return `<details class="tree-group" open><summary><strong>${exam.label}</strong><span>${exam.questions.length}문항</span></summary><div class="exam-source"><span>${fileName}</span>${diagnosisStatus}</div>${rows}</details>`;
  };
  const groups = [{ label: "", exams }];
  $("examTypeList").innerHTML = groups.map((group) => {
    if (!group.exams.length) return "";
    const heading = group.label ? `<div class="exam-collection-title"><strong>${group.label}</strong><span>${group.exams.length}개 시험지</span></div>` : "";
    return `<section class="exam-collection">${heading}${group.exams.map(examMarkup).join("")}</section>`;
  }).join("") || `<div class="source-notice">이 시기의 원본 시험지는 아직 등록되지 않았습니다.</div>`;

  $("examTypeList").querySelectorAll("input[data-exam-key]").forEach((input) => input.addEventListener("change", () => {
    if (input.checked) state.selected.exam.add(input.dataset.examKey);
    else state.selected.exam.delete(input.dataset.examKey);
    updateSummary();
  }));
}

function curriculumKey(bookId, unitIndex, typeId) {
  return `${bookId}:${unitIndex}:${typeId}`;
}

function unitTestKey(bookId, number) {
  return `${bookId}:${number}`;
}

function hasBookSource(item, book, unit = null) {
  // 문제 번호별 typeStudyRefs는 해당 권 원본을 직접 대조했다는 가장 강한 근거다.
  // 다른 권에서 먼저 만든 생성기를 재사용해도 문자열 출처 때문에 잠기지 않아야 한다.
  return Boolean(unit?.typeStudyRefs?.[item?.id]) || Boolean(item?.textbookSource?.includes(`1과정 ${book.label}`));
}

function typeStageReferences(unit, typeId, stageId) {
  if (unit?.typeStudyRefs?.[typeId]) return unit.typeStudyRefs[typeId][stageId] || [];
  return unit?.studyRefs?.[stageId] || [];
}

function isSelectableCurriculumType(item, book, unit = null, stageId = activeTextbookStage().id) {
  // 원본 교재에 이 세부 유형이 등장하는 단계와, 문제은행에서 난이도를 바꾸어
  // 생성할 수 있는 단계는 구분한다. 원본 문항 번호가 없는 단계를 가짜 번호로
  // 채우지는 않되, 검산된 생성기는 개념·유형·연습·심화 변형으로 사용할 수 있다.
  const sourceAuditBlocked = unit?.sourceAuditBlockedStages?.[item?.id]?.includes(stageId);
  return !sourceAuditBlocked && isReady(item) && hasBookSource(item, book, unit);
}

function sourceStageLabels(unit, typeId) {
  return TEXTBOOK_STAGES
    .filter((candidate) => typeStageReferences(unit, typeId, candidate.id).length > 0)
    .map((candidate) => candidate.label);
}

function studyReferenceLabel(references = []) {
  const twoDigits = (value) => String(value).padStart(2, "0");
  const compactNumbers = (numbers) => {
    const values = [...new Set(numbers)].sort((a, b) => a - b);
    const groups = [];
    for (const value of values) {
      const last = groups.at(-1);
      if (last && value === last.at(-1) + 1) last.push(value);
      else groups.push([value]);
    }
    return groups.map((group) => group.length === 1
      ? twoDigits(group[0])
      : `${twoDigits(group[0])}~${twoDigits(group.at(-1))}`).join(", ");
  };
  return references.map((reference) => {
    const range = reference.numbers
      ? compactNumbers(reference.numbers)
      : `${twoDigits(reference.from)}~${twoDigits(reference.to)}`;
    if (reference.section === "activity") return `활동 ${twoDigits(reference.group)} 본문 ${range}`;
    if (reference.section === "check") return `활동 ${twoDigits(reference.group)} 확인 ${range}`;
    if (reference.section === "practice") return `더클 연습 ${range}`;
    return `더클 도전 ${range}`;
  }).join(" · ");
}

function renderCurriculum() {
  const activeBook = CURRICULUM.find((book) => book.id === state.curriculumBookId) || CURRICULUM[0];
  if ($("goldenBellLink")) $("goldenBellLink").href = `./golden-bell.html?student=${encodeURIComponent(student)}&book=${activeBook.id}`;
  const bookTabs = `<nav class="curriculum-book-tabs" aria-label="교재 권 선택">${CURRICULUM.map((book) =>
    `<button type="button" data-curriculum-book="${book.id}" class="${book.id === activeBook.id ? "active" : ""}">${book.label}</button>`
  ).join("")}</nav>`;
  const stageTabs = `<div class="curriculum-inline-stages" aria-label="교재 학습 단계 선택">${TEXTBOOK_STAGES.map((stage) =>
    `<button type="button" data-curriculum-stage="${stage.id}" class="${stage.id === state.curriculumStage ? `active ${stage.id}` : stage.id}"><strong>${stage.label}</strong><span>${stage.sourceLabel}</span></button>`
  ).join("")}</div>`;
  const activeBookMarkup = [activeBook].map((book) => {
    const sourceFolder = book.id.replace("-", "");
    const units = book.units.map((unit, unitIndex) => {
      const types = unit.typeIds.map((id) => typeById(id)).filter(Boolean);
      const typeRows = types.map((item) => {
        const key = curriculumKey(book.id, unitIndex, item.id);
        const stage = activeTextbookStage();
        const typeReferences = typeStageReferences(unit, item.id, stage.id);
        const ready = isSelectableCurriculumType(item, book, unit, stage.id);
        const sourceChecked = hasBookSource(item, book, unit);
        const sourceNumbers = studyReferenceLabel(typeReferences);
        const availableStageLabels = sourceStageLabels(unit, item.id);
        const alternateStageLabel = availableStageLabels.length ? `${availableStageLabels.join("·")}에서 선택 가능` : "교재 원본 문항 없음";
        const sourceAuditBlocked = unit?.sourceAuditBlockedStages?.[item.id]?.includes(stage.id);
        const sourceState = sourceNumbers
          ? `${stage.label} 원본 ${sourceNumbers}`
          : `${stage.label} 단계 변형 생성 · 원본은 ${alternateStageLabel}${sourceAuditBlocked ? " · 해당 단계 원본 검토 중" : ""}`;
        return `<label class="type-leaf curriculum-type ${ready ? "" : "not-ready"} ${sourceNumbers ? "source-stage" : "derived-stage"}"${ready ? ` data-preview-type="${item.id}"` : ""}>
          <input type="checkbox" data-curriculum-key="${key}" ${state.selected.curriculum.has(key) ? "checked" : ""} ${ready ? "" : "disabled"} />
          <span><strong>${item.label}</strong><span>${item.middle} · ${sourceChecked ? sourceState : "교재 원본 문항 대조 전"}</span></span>
          <em class="type-status ${ready ? "" : "fixed"}">${ready ? sourceNumbers ? "원본형 무한 생성" : "단계 변형 생성" : sourceChecked ? "생성기 검증 대기" : "원본 대조 대기"}</em>
        </label>`;
      }).join("");
      const readyCount = types.filter((item) => isSelectableCurriculumType(item, book, unit)).length;
      const stageMap = unit.studyRefs ? `<div class="curriculum-stage-map" aria-label="${book.label} ${unit.label} 교재 단계별 문항 번호">
        ${TEXTBOOK_STAGES.map((stage) => `<div class="${stage.id}"><strong>${stage.label}</strong><span>${studyReferenceLabel(unit.studyRefs[stage.id])}</span></div>`).join("")}
      </div>` : "";
      return `<details class="middle-group curriculum-unit" open>
        <summary><strong>${unit.label}</strong><span>${types.length}개 세부 유형 · ${readyCount}개 생성 가능</span></summary>
        ${stageMap}
        <div class="type-leaves">${typeRows}</div>
      </details>`;
    }).join("");
    const testQuestions = book.source.unitTestQuestions || [];
    const testReadyCount = testQuestions.filter((question) => question.verified && isSelectableType(typeById(question.typeId))).length;
    const testQuestionRows = testQuestions.length ? `<div class="unit-test-question-list" aria-label="${book.label} 단원 테스트 문항별 유사문제">
      ${testQuestions.map((question) => {
        const item = typeById(question.typeId);
        const ready = question.verified && isSelectableType(item);
        const key = unitTestKey(book.id, question.number);
        return `<label class="unit-test-question ${ready ? "" : "not-ready"}"${ready ? ` data-preview-type="${item.id}"` : ""}>
          <input type="checkbox" data-unit-test-key="${key}" ${state.selected.unitTest.has(key) ? "checked" : ""} ${ready ? "" : "disabled"} />
          <b>${question.number}번</b><span><strong>${question.label}</strong><small>${item?.middle || "유형 대조 중"}</small></span>
          <em>${ready ? "유사문제 연결" : "원본 구조 재설계 중"}</em>
        </label>`;
      }).join("")}
    </div>` : "";
    return `<details class="tree-group curriculum-book" open>
      <summary><strong>${book.label} · ${book.title}</strong><span>교재 4단원 + 단원 테스트 25문항</span></summary>
      <div class="curriculum-sources">
        <div><strong>교재 본문 유사문제</strong><span>아래 단원 안에서 세부 유형별 선택</span></div>
        <div><strong>교재 학습 단계</strong><span>개념·유형·연습·심화를 교재 원본 구조대로 유지</span></div>
        <div><strong>골든벨 학습</strong><span>${book.source.goldenBellStatus === "ready" ? "개념 → 골든벨 → 이야기" : "준비 중"}</span><a class="source-view-link" href="./golden-bell.html?student=${encodeURIComponent(student)}&book=${book.id}">${book.source.goldenBellStatus === "ready" ? "학습 열기" : "진행 상태"}</a></div>
        <div><strong>단원 테스트 원문</strong><span>${book.source.unitTest}</span><a class="source-view-link" href="./unit-test-viewer.html?book=${sourceFolder}&student=${encodeURIComponent(student)}">원문 보기</a></div>
        <div><strong>단원 테스트 유사문제</strong><span>${testQuestions.length ? `25문항 중 ${testReadyCount}문항 원본 구조 검증 완료` : "문항별 유형 대조 후 연결"}</span><em>${testQuestions.length ? "문항별 선택" : "분석 중"}</em></div>
        ${book.source.reviewSourceBookLabel ? `<div><strong>책 뒤 리뷰</strong><span>${book.source.reviewSourceBookLabel} 세부 유형의 복습·재출제 근거${book.source.reviewQuestionCount ? ` · ${book.source.reviewQuestionCount}문항` : ""}</span><em>${book.source.reviewVerified ? "문제번호 연결 완료" : "문제번호 연결 중"}</em></div>` : ""}
      </div>
      ${testQuestionRows}
      <div class="curriculum-units">${units}</div>
      <p class="book-policy">골든벨은 별도 개념 학습으로 연결${book.source.reviewSourceBookLabel ? ` · 리뷰는 ${book.source.reviewSourceBookLabel} 유형 복습으로 연결${book.source.reviewQuestionCount ? ` (${book.source.reviewQuestionCount}문항 대조)` : ""}` : " · 앞 권 리뷰 연결 없음"}</p>
    </details>`;
  }).join("");
  $("curriculumTree").innerHTML = `${bookTabs}${stageTabs}${activeBookMarkup}`;

  $("curriculumTree").querySelectorAll("button[data-curriculum-book]").forEach((button) => button.addEventListener("click", () => {
    state.curriculumBookId = button.dataset.curriculumBook;
    hideTypePreview();
    renderCurriculum();
  }));
  $("curriculumTree").querySelectorAll("button[data-curriculum-stage]").forEach((button) => button.addEventListener("click", () => {
    setCurriculumStage(button.dataset.curriculumStage);
  }));

  $("curriculumTree").querySelectorAll("input[data-curriculum-key]").forEach((input) => input.addEventListener("change", () => {
    if (input.checked) state.selected.curriculum.add(input.dataset.curriculumKey);
    else state.selected.curriculum.delete(input.dataset.curriculumKey);
    updateSummary();
  }));
  $("curriculumTree").querySelectorAll("input[data-unit-test-key]").forEach((input) => input.addEventListener("change", () => {
    if (input.checked) state.selected.unitTest.add(input.dataset.unitTestKey);
    else state.selected.unitTest.delete(input.dataset.unitTestKey);
    updateSummary();
  }));
}

function groupedTypes() {
  // 원본과 생성 경로가 모두 확정된 유형만 선택 목록에 노출한다. 미연결 분류
  // 자리는 데이터에 보존하되, 실제 문제처럼 회색 행으로 보여 주지 않는다.
  const matchesStyle = (item) => isSelectableType(item) && academyStyleIdsForType(item).some((id) => state.academyStyles.has(id));
  return DOMAINS.map((domain) => ({
    domain,
    middles: [...new Set(TYPES.filter((item) => item.domain === domain.id && matchesStyle(item)).map((item) => item.middle))].map((middle) => ({
      middle,
      types: TYPES.filter((item) => item.domain === domain.id && item.middle === middle && matchesStyle(item))
    }))
  })).filter((group) => group.middles.length);
}

function academyStyleIdsForType(item) {
  return [...(academyStyleIdsByType.get(item?.id) || new Set(item?.academyStyleIds || []))];
}

function academyStyleIdsFor(target) {
  if (target?.classification?.academyStyleIds) return target.classification.academyStyleIds;
  if (target?.academyStyleIds) return target.academyStyleIds;
  return academyStyleIdsForType(target);
}

function academyStyleLabels(target) {
  return academyStyleIdsFor(target)
    .map((id) => ACADEMY_STYLES.find((style) => style.id === id)?.label)
    .filter(Boolean);
}

function renderAcademyStyleFilters() {
  $("academyStyleFilters").innerHTML = ACADEMY_STYLES.map((style) => {
    const count = TYPES.filter((item) => isSelectableType(item) && academyStyleIdsForType(item).includes(style.id)).length;
    return `<label><input type="checkbox" data-academy-style="${style.id}" ${state.academyStyles.has(style.id) ? "checked" : ""}/><span>${style.label}</span><em>${count}</em></label>`;
  }).join("");
  $("academyStyleFilters").querySelectorAll("input[data-academy-style]").forEach((input) => input.addEventListener("change", () => {
    if (input.checked) state.academyStyles.add(input.dataset.academyStyle);
    else state.academyStyles.delete(input.dataset.academyStyle);
    for (const typeId of [...state.selected.type]) {
      const item = typeById(typeId);
      if (!academyStyleIdsForType(item).some((id) => state.academyStyles.has(id))) state.selected.type.delete(typeId);
    }
    renderTypeTree();
    updateSummary();
  }));
}

function setCurriculumStage(stageId) {
  if (!TEXTBOOK_STAGES.some((stage) => stage.id === stageId)) return;
  state.curriculumStage = stageId;
  $("curriculumStageChoices").querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.stage === stageId);
  });
  for (const key of [...state.selected.curriculum]) {
    const [bookId, indexText, typeId] = key.split(":");
    const book = CURRICULUM.find((item) => item.id === bookId);
    const unit = book?.units[Number(indexText)];
    if (!book || !unit || !isSelectableCurriculumType(typeById(typeId), book, unit, stageId)) {
      state.selected.curriculum.delete(key);
    }
  }
  typePreviewCache.clear();
  hideTypePreview();
  renderCurriculum();
  updateSummary();
}

function renderTypeTree() {
  $("bankTypeTree").innerHTML = groupedTypes().map(({ domain, middles }) => `<details class="tree-group" open>
    <summary><strong>${domain.label}</strong><span>${middles.reduce((sum, group) => sum + group.types.length, 0)}개 세부 유형</span></summary>
    ${middles.map(({ middle, types }) => `<details class="middle-group" open><summary><strong>${middle}</strong></summary><div class="type-leaves">
      ${types.map((item) => `<label class="type-leaf ${isSelectableType(item) ? "" : "not-ready"}"${isSelectableType(item) ? ` data-preview-type="${item.id}"` : ""}>
        <input type="checkbox" data-type-id="${item.id}" ${state.selected.type.has(item.id) ? "checked" : ""} ${isSelectableType(item) ? "" : "disabled"} />
        <span><strong>${item.label}</strong><span>${typeSourceLabel(item)}</span><small class="learning-map-inline ${learningMapForType(item).kind}">${learningMapInlineLabel(item)}</small></span>
        <em class="type-status ${isSelectableType(item) ? "" : "fixed"}">${isSelectableType(item) ? typeStatus(item) : "원본 대조 중"}</em>
      </label>`).join("")}
    </div></details>`).join("")}
  </details>`).join("");

  $("bankTypeTree").querySelectorAll("input[data-type-id]").forEach((input) => input.addEventListener("change", () => {
    if (input.checked) state.selected.type.add(input.dataset.typeId);
    else state.selected.type.delete(input.dataset.typeId);
    updateSummary();
  }));
}

function generationCaseForSource(sourceKind, sourceId, number) {
  const sourceKey = `${sourceKind}:${sourceId}:q${number}`;
  const sourceRecord = sourceQuestionByKey.get(sourceKey);
  return Object.freeze({
    mode: sourceRecord?.sourceFidelity === "exact-generator" ? "source" : "variant-from-source",
    sourceKey,
    sourceKind,
    sourceId,
    number,
    sourceFidelity: sourceRecord?.sourceFidelity || "classified"
  });
}

function selectedReferences() {
  if (state.mode === "type") return [...state.selected.type].map((typeId) => ({
    typeId,
    reference: `${typeById(typeId)?.label || "유형"} 기준`,
    classification: questionClassificationForType(typeId, { academyStyleIds: academyStyleIdsForType(typeById(typeId)) })
  }));
  if (state.mode === "curriculum") {
    const result = [];
    for (const key of state.selected.curriculum) {
      const [bookId, indexText, typeId] = key.split(":");
      const book = CURRICULUM.find((item) => item.id === bookId);
      const unit = book?.units[Number(indexText)];
      if (book && unit?.typeIds.includes(typeId) && isSelectableCurriculumType(typeById(typeId), book, unit)) {
        const stage = activeTextbookStage();
        const sourceNumbers = studyReferenceLabel(typeStageReferences(unit, typeId, stage.id));
        const availableStageLabels = sourceStageLabels(unit, typeId);
        const stageReference = sourceNumbers
          ? `${stage.label}(${sourceNumbers})`
          : `${stage.label} 단계 변형(원본 ${availableStageLabels.join("·") || "문항 대조 전"})`;
        result.push({
          typeId,
          reference: `${book.label} ${unit.label} · ${stageReference} · ${typeById(typeId)?.label || "세부 유형"}`,
          classification: questionClassificationForType(typeId)
        });
      }
    }
    for (const key of state.selected.unitTest) {
      const separator = key.lastIndexOf(":");
      const bookId = key.slice(0, separator);
      const number = Number(key.slice(separator + 1));
      const book = CURRICULUM.find((item) => item.id === bookId);
      const question = book?.source.unitTestQuestions?.find((item) => item.number === number);
      const type = typeById(question?.typeId);
      if (book && question?.verified && isSelectableType(type)) {
        result.push({
          typeId: question.typeId,
          reference: `${book.label} 단원 테스트 ${number}번 · ${question.label}`,
          difficulty: question.difficulty || 2,
          fixedSeed: `unit-test:${book.id}:${number}`,
          classification: question.classification,
          generationCase: generationCaseForSource("unit-test", book.id, number)
        });
      }
    }
    return result;
  }
  const result = [];
  for (const exam of EXAM_SOURCES) {
    for (const sourceQuestion of exam.questions) {
      if (state.selected.exam.has(examKey(exam.id, sourceQuestion.number))) {
        result.push({
          typeId: sourceQuestion.typeId,
          reference: `${exam.label} ${sourceQuestion.number}번`,
          fixedSeed: sourceQuestion.fixedSeed || null,
          classification: sourceQuestion.classification,
          generationCase: generationCaseForSource("exam", exam.id, sourceQuestion.number)
        });
      }
    }
  }
  return result;
}

function selectedTypeIds() {
  return selectedReferences().map((item) => item.typeId);
}

function updateSummary() {
  const typeIds = selectedTypeIds();
  const unique = new Set(typeIds);
  const ready = [...unique].filter((id) => isSelectableType(typeById(id))).length;
  $("selectionTotal").textContent = `${unique.size}개 유형 · ${state.count}문제`;
  $("selectionHelp").textContent = unique.size
    ? `${ready}개 유형은 지금 생성할 수 있고, 나머지는 원본 분류 완료 후 생성기를 연결합니다.`
    : "왼쪽에서 시험 문항이나 유형을 선택하세요.";
  $("buildButton").disabled = ready === 0;
}

function toggleVisible(selector, set, keyGetter) {
  const inputs = [...document.querySelectorAll(selector)].filter((input) => !input.disabled);
  const shouldSelect = inputs.some((input) => !input.checked);
  inputs.forEach((input) => {
    input.checked = shouldSelect;
    const key = keyGetter(input);
    if (shouldSelect) set.add(key);
    else set.delete(key);
  });
  updateSummary();
}

function toggleCurriculumSelections() {
  const curriculumInputs = [...document.querySelectorAll("#curriculumTree input[data-curriculum-key]")].filter((input) => !input.disabled);
  const testInputs = [...document.querySelectorAll("#curriculumTree input[data-unit-test-key]")].filter((input) => !input.disabled);
  const inputs = [...curriculumInputs, ...testInputs];
  const shouldSelect = inputs.some((input) => !input.checked);
  for (const input of inputs) {
    input.checked = shouldSelect;
    const isTest = Boolean(input.dataset.unitTestKey);
    const set = isTest ? state.selected.unitTest : state.selected.curriculum;
    const key = isTest ? input.dataset.unitTestKey : input.dataset.curriculumKey;
    if (shouldSelect) set.add(key);
    else set.delete(key);
  }
  updateSummary();
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function seededRandom(seedText) {
  let seed = 2166136261;
  for (const character of seedText) {
    seed ^= character.codePointAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeed(seedText, callback) {
  if (!seedText) return callback();
  const originalRandom = Math.random;
  Math.random = seededRandom(seedText);
  try {
    return callback();
  } finally {
    Math.random = originalRandom;
  }
}

function geometryWorksheetSolution(problem) {
  const answer = problem.answer || {};
  switch (problem.type) {
    case "TC":
      return answer.askTotal === false
        ? "앞과 오른쪽 옆에서는 각 줄에서 가장 높이 쌓인 층까지 칸을 그립니다."
        : `바탕그림의 각 칸에 적힌 수를 모두 더하면 ${answer.total}개입니다.${answer.drawViews ? " 앞과 옆에서는 각 줄에서 가장 높이 쌓인 층까지 칸을 그립니다." : ""}${answer.askHeight ? ` 가장 높은 곳은 ${answer.height}층입니다.` : ""}`;
    case "VC": {
      const values = (answer.numbers || []).flat().filter((value) => value > 0);
      return `위에서 본 모양의 각 자리에 앞·옆에서 본 가장 높은 층수를 맞춰 쓰고 더합니다. ${values.join(" + ")} = ${answer.count}이므로 ${answer.count}개입니다.`;
    }
    case "VM":
      return `세 방향의 모양을 모두 지키면서 각 자리에 놓을 수를 정합니다. 가장 많이 놓으면 ${answer.max}개, 가장 적게 놓으면 ${answer.min}개입니다.`;
    case "VP":
      return `위에서 본 모양으로 쌓은 자리를 찾고, 주어진 방향에서 보이는 가장 높은 층을 맞추면 ${answer.hiddenLabel}에서 본 모양이 정해집니다.`;
    case "IC":
      return `아래에서부터 층별로 보이는 칸과 가려진 칸을 빠짐없이 세면 모두 ${answer.total}개입니다.${answer.askFloor ? ` 그중 1층에는 ${answer.floor}개가 놓여 있습니다.` : ""}${answer.askUpper ? ` 2층 이상에는 ${answer.upper}개가 있습니다.` : ""}`;
    case "IH":
    case "IN":
      return `전체 ${answer.total}개에서 겉에서 보이는 ${answer.visible}개를 빼면 ${answer.total} - ${answer.visible} = ${answer.hidden}개입니다.`;
    case "FB":
    case "CU":
      return `상자를 가득 채우면 ${answer.total}개입니다. 지금 놓인 ${answer.placed}개를 빼면 ${answer.total} - ${answer.placed} = ${answer.need}개가 더 필요합니다.`;
    case "PN":
      return answer.variant === "faces"
        ? `겉에서 보이는 면을 방향별로 빠짐없이 세면 모두 ${answer.faces}면입니다.`
        : `쌓기나무를 하나씩 떼어 색칠된 면의 수대로 나누어 세면, ${answer.askFaces}면이 색칠된 쌓기나무는 ${answer.count}개입니다.`;
    case "BW":
      return `한 쌓기나무의 색을 정하면 맞닿은 쌓기나무는 반대색입니다. 차례로 세면 흰색 ${answer.white}개, 검은색 ${answer.black}개입니다.`;
    case "HL":
      return `가득 채운 ${answer.total}개에서 구멍으로 빠진 ${answer.removed}개를 빼면 ${answer.total} - ${answer.removed} = ${answer.remaining}개입니다.`;
    case "SQ": {
      const steps = (answer.stageTotals || []).map((value, index) => `${index + 1}번째 ${value}개`).join(" → ");
      return `${steps}${steps ? ". " : ""}규칙을 이어 보면 답은 ${problem.answerText}입니다.`;
    }
    default:
      return `그림의 조건을 차례로 확인하면 답은 ${problem.answerText}입니다.`;
  }
}

function generatedGeometryWorksheetProblem(item, sequence, reference, fixedSeed, attempt, difficultyOverride = null, sourceClassification = null) {
  const worksheet = globalThis.GW_GEN;
  const info = worksheet?.typeInfo(item.worksheetCode);
  if (!worksheet || !info) return null;
  const intensity = difficultyOverride || activeDifficulty();
  const requestedLevel = item.worksheetLevel || info.levels[0];
  const baseLevel = worksheet.typeSupportsLevel(item.worksheetCode, requestedLevel) ? requestedLevel : info.levels[0];
  const baseIndex = Math.max(0, info.levels.indexOf(baseLevel));
  const levelIndex = intensity === 3
    ? Math.min(info.levels.length - 1, baseIndex + 1)
    : intensity === 1
      ? Math.max(0, baseIndex - 1)
      : baseIndex;
  const level = info.levels[levelIndex];
  const randomPart = fixedSeed || `${Date.now()}:${Math.random()}`;
  const rng = worksheet.createRng(`FIELDS-QB:${item.id}:${level}:${intensity}:${randomPart}:${sequence}:${attempt}`);
  let made;
  try {
    made = worksheet.make(item.worksheetCode, rng, level, intensity, item.worksheetOptions || null);
  } catch (_error) {
    return null;
  }
  const answerVisualTypes = new Set(["VC", "VM", "VP", "HL"]);
  const hasAnswerVisual = answerVisualTypes.has(made.type) || (made.type === "TC" && made.answer.drawViews);
  const icPromptMode = made.type === "IC" ? item.worksheetOptions?.promptMode : null;
  if (icPromptMode === "total" || icPromptMode === "minimum") {
    made.answer.askFloor = false;
    made.answer.askUpper = false;
    made.answerText = `${made.answer.total}개`;
  }
  const prompt = icPromptMode === "total"
    ? "다음은 쌓기나무를 쌓아 만든 입체 모양입니다. 사용된 쌓기나무는 모두 몇 개입니까?"
    : icPromptMode === "minimum"
      ? "쌓기나무로 쌓은 모양입니다. 사용된 쌓기나무는 최소 몇 개입니까?"
      : made.prompt;
  return {
    ...withProblemContext({
    prompt,
    visual: { kind: "geometry-worksheet", problem: made, figures: made.figures },
    answer: made.answerText,
    answerVisual: hasAnswerVisual ? { kind: "geometry-worksheet-answer", problem: made } : null,
    solution: geometryWorksheetSolution(made),
    responseKind: made.type === "VP" || (made.type === "TC" && made.answer.askTotal === false) ? "drawing" : "text",
    meta: { worksheetType: made.type, worksheetLevel: made.level, intensity, ...made.answer },
    }, item, reference, sourceClassification),
    generationDifficulty: intensity
  };
}

function generatedProblem(item, sequence, reference, fixedSeed = null, attempt = 0, difficultyOverride = null, sourceClassification = null, generationCase = null) {
  if (item.generator && GENERATORS[item.generator]) {
    const difficulty = difficultyOverride || activeDifficulty();
    const seed = fixedSeed ? `${fixedSeed}:${difficulty}:${sequence}:${attempt}` : null;
    // 답이 유일해야 하는 배치·추리 생성기는 조건이 안 맞으면 null을 준다. 실패는 정상이므로
    // 다시 뽑는다(중복 회피 루프와 별개). 받아 주지 않으면 빈 문항 카드가 나간다.
    // 고정 시드일 때는 재시도 회차를 시드에 섞어 재현성을 지킨다.
    for (let retry = 0; retry < 400; retry += 1) {
      // retry 0은 기존 시드 형식 그대로 — 파이널 1회 교체본처럼 이미 고정 시드로 검수된
      // 문항의 출력이 바뀌면 안 된다. 접미사는 실패로 다시 뽑을 때만 붙는다.
      const retrySeed = seed ? (retry === 0 ? seed : `${seed}:r${retry}`) : null;
      const generated = withSeed(retrySeed, () => GENERATORS[item.generator]({ max: 30, difficulty, sourceCase: generationCase }));
      if (generated) return { ...withProblemContext(generated, item, reference, sourceClassification), generationDifficulty: difficulty, generationCase };
    }
  }
  if (!item.generator && item.worksheetCode && globalThis.GW_GEN?.typeInfo(item.worksheetCode)) {
    return generatedGeometryWorksheetProblem(item, sequence, reference, fixedSeed, attempt, difficultyOverride, sourceClassification);
  }
  return null;
}

function problemSignature(problem) {
  return JSON.stringify([problem.reference, problem.type.id, problem.prompt, problem.visual || null, problem.image || null]);
}

function buildQuestions() {
  let references = selectedReferences().filter((item) => isSelectableType(typeById(item.typeId)));
  if (!references.length) return;
  if (state.order === "domain") references.sort((a, b) => domainIndex[typeById(a.typeId).domain] - domainIndex[typeById(b.typeId).domain]);
  if (state.order === "mixed") references = shuffle(references);
  const counters = new Map();
  const signatures = new Set();
  const questions = Array.from({ length: state.count }, (_, index) => {
    const reference = references[index % references.length];
    const item = typeById(reference.typeId);
    const sequence = counters.get(item.id) || 0;
    counters.set(item.id, sequence + 1);
    let problem = null;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      problem = generatedProblem(item, sequence, reference.reference, reference.fixedSeed, attempt, reference.difficulty, reference.classification, reference.generationCase);
      if (!problem || !signatures.has(problemSignature(problem))) break;
    }
    if (problem) signatures.add(problemSignature(problem));
    return problem;
  });
  if (questions.some((problem) => !problem)) {
    state.questions = [];
    window.alert("문항을 끝까지 만들지 못했습니다. 같은 선택으로 다시 생성해 주세요.");
    return;
  }
  state.questions = questions;
  renderWorksheet();
  $("builderPanel").hidden = true;
  $("worksheetSection").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function syncQuestionCountControls() {
  state.count = state.questions.length;
  $("questionCount").value = String(state.count);
  $("countChoices").querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.count) === state.count);
  });
  updateSummary();
}

function moveQuestion(fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= state.questions.length || toIndex >= state.questions.length) return;
  const [question] = state.questions.splice(fromIndex, 1);
  state.questions.splice(toIndex, 0, question);
  renderWorksheet();
}

function replaceQuestion(index) {
  const current = state.questions[index];
  if (!current) return;
  if (current.generationCase?.mode === "source") return;
  const currentSignature = problemSignature(current);
  const otherSignatures = new Set(state.questions.filter((_, questionIndex) => questionIndex !== index).map(problemSignature));
  let replacement = null;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const candidate = generatedProblem(current.type, index + attempt, current.reference, null, attempt, current.generationDifficulty, current.classification);
    if (candidate && problemSignature(candidate) !== currentSignature && !otherSignatures.has(problemSignature(candidate))) {
      replacement = candidate;
      break;
    }
  }
  if (!replacement) {
    window.alert("같은 유형의 새 문항을 만들지 못했습니다. 잠시 후 다시 눌러 주세요.");
    return;
  }
  state.questions[index] = replacement;
  renderWorksheet();
}

function removeQuestion(index) {
  if (state.questions.length <= 1) {
    window.alert("시험지에는 한 문제 이상이 필요합니다.");
    return;
  }
  state.questions.splice(index, 1);
  syncQuestionCountControls();
  renderWorksheet();
}

function bindQuestionEditor() {
  const grid = $("questionGrid");
  let draggedIndex = null;
  grid.querySelectorAll(".question-card").forEach((card) => {
    const index = Number(card.dataset.questionIndex);
    const handle = card.querySelector("[data-drag-handle]");
    handle?.addEventListener("dragstart", (event) => {
      draggedIndex = index;
      card.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(index));
    });
    handle?.addEventListener("dragend", () => {
      draggedIndex = null;
      card.classList.remove("is-dragging");
      grid.querySelectorAll(".drop-target").forEach((item) => item.classList.remove("drop-target"));
    });
    card.addEventListener("dragover", (event) => {
      if (draggedIndex === null || draggedIndex === index) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      card.classList.add("drop-target");
    });
    card.addEventListener("dragleave", () => card.classList.remove("drop-target"));
    card.addEventListener("drop", (event) => {
      event.preventDefault();
      card.classList.remove("drop-target");
      const fromIndex = draggedIndex ?? Number(event.dataTransfer.getData("text/plain"));
      moveQuestion(fromIndex, index);
    });
  });
  grid.querySelectorAll("[data-question-action]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.questionIndex);
    if (button.dataset.questionAction === "up") moveQuestion(index, index - 1);
    if (button.dataset.questionAction === "down") moveQuestion(index, index + 1);
    if (button.dataset.questionAction === "replace") replaceQuestion(index);
    if (button.dataset.questionAction === "remove") removeQuestion(index);
  }));
  grid.querySelectorAll(".answer-input").forEach((input) => input.addEventListener("input", () => {
    const index = Number(input.dataset.questionIndex);
    if (state.questions[index]) state.questions[index].responseValue = input.value;
  }));
}

function escapeAttribute(value) {
  return String(value || "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function shapeSymbol(shape) {
  return shape === "동그라미" ? "●" : shape === "세모" ? "▲" : "■";
}

function numberCardMarkup(visual) {
  return `<div class="number-balls">${visual.values.map((value) => `<span>${value}</span>`).join("")}</div><div class="equation-row equation-row-three"><span class="equation-blank"></span><b>+</b><span class="equation-blank"></span><b>-</b><span class="equation-blank"></span><b>=</b><strong>${visual.target}</strong></div>`;
}

function hiddenCardConditionsMarkup(visual) {
  return `<div class="hidden-card-clues">${visual.clues.map((clue, index) => `<div class="hidden-card-row"><span>(${index + 1})</span><div>${clue.values.map((value) => `<i>${value}</i>`).join("")}</div><strong class="${clue.hasCard ? "has" : "not"}">→ ${clue.hasCard ? "있습니다." : "없습니다."}</strong></div>`).join("")}</div>`;
}

function shapeMatrixRuleMarkup(visual) {
  const hatchId = `shape-matrix-hatch-${visual.id}`;
  const shape = (kind, cx, cy, size, className, fill) => {
    const style = fill === "hatch" ? ` style="fill:url(#${hatchId})"` : "";
    if (kind === "circle") return `<circle class="${className} fill-${fill}" cx="${cx}" cy="${cy}" r="${size}"${style}/>`;
    if (kind === "square") return `<rect class="${className} fill-${fill}" x="${cx - size}" y="${cy - size}" width="${size * 2}" height="${size * 2}"${style}/>`;
    return `<polygon class="${className} fill-${fill}" points="${cx},${cy - size} ${cx - size},${cy + size * 0.82} ${cx + size},${cy + size * 0.82}"${style}/>`;
  };
  const cells = visual.cells.map((cell, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 15 + column * 110;
    const y = 15 + row * 110;
    const cx = x + 55;
    const cy = y + 55;
    const content = cell
      ? `${shape(cell.outer, cx, cy, 35, "matrix-outer", "plain")}${shape(cell.inner, cx, cy, 22, "matrix-inner", cell.fill)}`
      : `<text class="matrix-missing" x="${cx}" y="${cy + 8}">㉠</text>`;
    return `<g><rect class="matrix-cell" x="${x}" y="${y}" width="110" height="110"/>${content}</g>`;
  }).join("");
  return `<svg class="shape-matrix-svg" viewBox="0 0 360 360" role="img" aria-label="큰 도형, 작은 도형, 칠한 방법의 규칙을 찾는 3행 3열 문제"><defs><pattern id="${hatchId}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#627886" stroke-width="3"/></pattern></defs>${cells}</svg>`;
}

function tornCalendarMarkup(visual) {
  const headers = visual.headers.map((header, index) => {
    const weekday = visual.columns[index];
    return `<b class="${weekday === 0 ? "sunday" : weekday === 6 ? "saturday" : ""}">${header}</b>`;
  }).join("");
  const rows = visual.rows.flatMap((row) => row.map((date, index) => {
    const weekday = visual.columns[index];
    return `<span class="${weekday === 0 ? "sunday" : weekday === 6 ? "saturday" : ""}">${date || ""}</span>`;
  })).join("");
  return `<div class="torn-calendar" style="--calendar-columns:${visual.columns.length}"><strong>${visual.month}월</strong><div class="torn-calendar-grid">${headers}${rows}</div><svg viewBox="0 0 240 14" preserveAspectRatio="none" aria-hidden="true"><path d="M0 1L14 8 28 3 44 11 61 4 78 10 96 2 114 9 132 4 150 12 168 3 186 9 205 2 222 10 240 4V14H0Z"/></svg></div>`;
}

function twoTypeUnitsMarkup(visual) {
  const bicycle = (tricycle) => `<svg viewBox="0 0 150 90" aria-hidden="true"><g class="unit-drawing bike"><circle cx="35" cy="63" r="20"/><circle cx="${tricycle ? 112 : 115}" cy="63" r="20"/>${tricycle ? '<circle cx="76" cy="68" r="13"/>' : ""}<path d="M35 63L62 28 84 63H35L58 63 75 39 112 63M62 28H82M75 39L67 20M61 20H76"/></g></svg>`;
  const animal = (rabbit) => rabbit
    ? `<svg viewBox="0 0 150 90" aria-hidden="true"><g class="unit-drawing animal"><ellipse cx="70" cy="50" rx="39" ry="24"/><circle cx="109" cy="38" r="17"/><ellipse cx="101" cy="13" rx="6" ry="18"/><ellipse cx="116" cy="13" rx="6" ry="18"/><circle class="eye" cx="115" cy="35" r="2"/><path d="M44 65V82M62 68V82M83 68V82M101 64V82"/></g></svg>`
    : `<svg viewBox="0 0 150 90" aria-hidden="true"><g class="unit-drawing animal"><ellipse cx="72" cy="50" rx="34" ry="25"/><circle cx="108" cy="35" r="16"/><polygon points="123,34 142,42 123,47"/><circle class="eye" cx="112" cy="31" r="2"/><path d="M61 70V84M84 70V84M54 84H67M77 84H91"/></g></svg>`;
  return `<div class="two-type-units">${visual.items.map((item, index) => `<div>${visual.variant === "bicycles" ? bicycle(index === 1) : animal(index === 1)}<strong>${item.label}</strong><span>${visual.variant === "bicycles" ? "바퀴" : "다리"} ${item.units}개</span></div>`).join("")}</div>`;
}

function rowColumnCountMarkup(visual) {
  const cell = visual.size === 5 ? 42 : 48;
  const offset = 50;
  const gridSize = visual.size * cell;
  const width = offset + gridSize + 8;
  const height = offset + gridSize + 8;
  const lines = Array.from({ length: visual.size + 1 }, (_, index) => {
    const position = offset + index * cell;
    return `<path d="M${offset} ${position}H${offset + gridSize}M${position} ${offset}V${offset + gridSize}"/>`;
  }).join("");
  const topLabels = visual.columnCounts.map((count, index) => {
    const center = offset + index * cell + cell / 2;
    return `<polygon points="${center},6 ${center - 19},${offset - 5} ${center + 19},${offset - 5}"/><text x="${center}" y="${offset - 14}">${count}</text>`;
  }).join("");
  const rowLabels = visual.rowCounts.map((count, index) => {
    const center = offset + index * cell + cell / 2;
    return `<polygon points="6,${center} ${offset - 5},${center - 19} ${offset - 5},${center + 19}"/><text x="${offset - 18}" y="${center + 6}">${count}</text>`;
  }).join("");
  return `<div class="row-column-count-work"><div class="row-column-rule"><span>△ 안의 수 = 그 줄의 별 수</span><span>가로와 세로를 모두 맞추기</span></div><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="가로와 세로 별 개수 조건이 있는 ${visual.size} 곱하기 ${visual.size} 빈칸"><g class="count-labels">${topLabels}${rowLabels}</g><g class="count-grid">${lines}</g></svg></div>`;
}

function truthLieRankingMarkup(visual) {
  return `<div class="truth-lie-work"><div class="liar-note"><strong>거짓말</strong><span>${visual.liarNames.join(" · ")}</span></div><div class="ranking-statements">${visual.statements.map((statement) => `<div><b>${statement.speaker}</b><span>${statement.text}</span></div>`).join("")}</div></div>`;
}

function targetScoreCombinationsMarkup(visual) {
  const centerX = 150;
  const centerY = 108;
  const outerRadius = 92;
  const ringWidth = outerRadius / visual.scores.length;
  const rings = visual.scores.map((score, index) => {
    const radius = outerRadius - index * ringWidth;
    const innerRadius = Math.max(0, radius - ringWidth);
    const labelX = centerX + (radius + innerRadius) / 2;
    return `<circle class="target-ring band-${index % 2}" cx="${centerX}" cy="${centerY}" r="${radius.toFixed(2)}"/><text class="target-score-label" x="${labelX.toFixed(2)}" y="114">${score}</text>`;
  }).join("");
  const arrows = [
    [58, 31, 42],
    [78, 17, 50],
    [44, 52, 34]
  ].slice(0, visual.shotCount).map(([x, y, angle]) => `<g class="target-arrow" transform="translate(${x} ${y}) rotate(${angle})"><line x1="0" y1="0" x2="48" y2="0"/><path d="M48 0L36-6M48 0L36 6"/></g>`).join("");
  return `<svg class="target-score-svg" viewBox="0 0 300 225" role="img" aria-label="바깥쪽부터 ${visual.scores.join(", ")}점인 과녁">${rings}${arrows}<text class="target-shot-note" x="150" y="220">화살 ${visual.shotCount}번</text></svg>`;
}

function matchstickShapePoints(sides, index) {
  if (sides === 3) {
    const offset = Math.floor(index / 2) * 44;
    return index % 2 === 0
      ? [[offset, 38], [offset + 44, 38], [offset + 22, 0]]
      : [[offset + 44, 38], [offset + 66, 0], [offset + 22, 0]];
  }
  const offset = index * 44;
  if (sides === 4) return [[offset, 0], [offset + 44, 0], [offset + 44, 44], [offset, 44]];
  if (sides === 5) return [[offset, 48], [offset, 23], [offset + 22, 0], [offset + 44, 23], [offset + 44, 48]];
  return [[offset, 12], [offset + 22, 0], [offset + 44, 12], [offset + 44, 36], [offset + 22, 48], [offset, 36]];
}

function matchstickStageMarkup(visual, count) {
  const segments = new Map();
  const points = new Map();
  const pointKey = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`;
  const edgeKey = (from, to) => [pointKey(from), pointKey(to)].sort().join("|");
  for (let index = 0; index < count; index += 1) {
    const polygon = matchstickShapePoints(visual.sides, index);
    polygon.forEach((point, pointIndex) => {
      const next = polygon[(pointIndex + 1) % polygon.length];
      points.set(pointKey(point), point);
      points.set(pointKey(next), next);
      segments.set(edgeKey(point, next), [point, next]);
    });
  }
  const coordinates = [...points.values()];
  const minX = Math.min(...coordinates.map(([x]) => x));
  const maxX = Math.max(...coordinates.map(([x]) => x));
  const minY = Math.min(...coordinates.map(([, y]) => y));
  const maxY = Math.max(...coordinates.map(([, y]) => y));
  const padding = 9;
  const lines = [...segments.values()].map(([from, to]) => `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}"/>`).join("");
  const heads = coordinates.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8"/>`).join("");
  const matchCount = visual.sides + (count - 1) * (visual.sides - 1);
  return `<div class="matchstick-stage"><svg viewBox="${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}" role="img" aria-label="${visual.shape} ${count}개, 성냥개비 ${matchCount}개"><g class="matchstick-lines">${lines}</g><g class="matchstick-heads">${heads}</g></svg><span>${count}번째</span></div>`;
}

function matchstickShapeSequenceMarkup(visual) {
  return `<div class="matchstick-sequence-work"><div class="matchstick-stages">${[1, 2, 3].map((count) => matchstickStageMarkup(visual, count)).join("")}<b class="sequence-ellipsis">…</b><em class="sequence-target">${visual.target}번째</em></div><p>${visual.clue}</p></div>`;
}

function connectedLineDegreeSumMarkup(visual) {
  const lines = visual.edges.map(([first, second]) => {
    const from = visual.nodes[first];
    const to = visual.nodes[second];
    return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>`;
  }).join("");
  const nodes = visual.nodes.map((node, index) => `<g><circle cx="${node.x}" cy="${node.y}" r="18"/>${visual.shown.includes(index) ? `<text x="${node.x}" y="${node.y + 6}">${visual.degrees[index]}</text>` : ""}</g>`).join("");
  return `<div class="connected-line-work"><svg viewBox="0 0 ${visual.width} ${visual.height}" role="img" aria-label="여러 원이 선으로 연결된 그림"><g class="connected-edges">${lines}</g><g class="connected-nodes">${nodes}</g></svg><p>${visual.clue}</p></div>`;
}

function letterBlockTileMarkup(word, transformed = false, blank = false) {
  const length = Array.from(word).length;
  const horizontal = !transformed && length > 1;
  const width = horizontal ? 152 : 88;
  const height = transformed && length > 1 ? 152 : 108;
  const fontSize = length > 1 ? 43 : 54;
  const content = blank
    ? ""
    : transformed
      ? `<g transform="translate(${width / 2} ${height / 2}) scale(-1 1)"><g transform="rotate(-90)"><text style="font-size:${fontSize}px" x="0" y="2">${word}</text></g></g>`
      : `<text style="font-size:${fontSize}px" x="${width / 2}" y="${height / 2 + 2}">${word}</text>`;
  const label = blank ? "답을 그릴 빈 상자" : transformed ? `${word}를 움직인 결과` : `${word} 글자 블록`;
  return `<svg class="letter-block-tile ${blank ? "blank" : ""}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}"><rect x="2" y="2" width="${width - 4}" height="${height - 4}"/>${content}</svg>`;
}

function letterBlockTransformMarkup(visual) {
  const pair = (word, showResult, label) => `<div class="letter-transform-pair"><b>${label}</b><div>${letterBlockTileMarkup(word)}<span>→</span>${showResult ? letterBlockTileMarkup(word, true) : letterBlockTileMarkup(word, false, true)}</div></div>`;
  return `<div class="letter-transform-work">${pair(visual.example, true, "보기")}${pair(visual.target, false, "문제")}<p>${visual.guide}</p></div>`;
}

function mixedSequencesMarkup(visual) {
  return `<div class="mixed-sequences-work">${visual.rows.map((row) => `<div class="mixed-sequence-row"><b>${row.label}</b><div>${row.terms.map((value, index) => `<span class="${index === row.blankIndex ? "blank" : ""}">${index === row.blankIndex ? row.answerLabel : value}</span>`).join("<i>,</i>")}<em>…</em></div>${row.clue ? `<small>${row.clue}</small>` : ""}</div>`).join("")}</div>`;
}

function vennNeitherMarkup(visual) {
  const { shown } = visual;
  const firstValue = shown.mode === "parts" || shown.mode === "hidden-overlap" ? `${shown.firstOnly}${visual.unit}` : "";
  const overlapValue = shown.mode === "hidden-overlap" ? "?" : `${shown.both}${visual.unit}`;
  const secondValue = shown.mode === "parts" ? `${shown.secondOnly}${visual.unit}` : "";
  const firstTotal = shown.mode === "parts" ? "" : `전체 ${shown.firstTotal}${visual.unit}`;
  const secondTotal = shown.mode === "parts" ? "" : `전체 ${shown.secondTotal}${visual.unit}`;
  return `<div class="venn-neither-work"><div class="venn-total">전체 ${visual.total}${visual.unit}</div><svg viewBox="0 0 420 205" role="img" aria-label="두 조건에 모두 해당하지 않는 수를 찾는 겹친 원 그림"><circle class="venn-circle first" cx="165" cy="112" r="76"/><circle class="venn-circle second" cx="255" cy="112" r="76"/><text class="venn-label" x="112" y="22">${visual.first}</text><text class="venn-total-label" x="112" y="39">${firstTotal}</text><text class="venn-label" x="308" y="22">${visual.second}</text><text class="venn-total-label" x="308" y="39">${secondTotal}</text><text class="venn-value" x="125" y="116">${firstValue}</text><text class="venn-value overlap" x="210" y="116">${overlapValue}</text><text class="venn-value" x="295" y="116">${secondValue}</text><text class="venn-neither-label" x="210" y="199">어느 쪽에도 해당하지 않음: ?</text></svg></div>`;
}

function hiddenScoreRankingMarkup(visual) {
  const scoreCells = (row) => String(row.score).split("").map((digit, index) => `<span class="${index === row.blankIndex ? "hidden" : ""}">${index === row.blankIndex ? row.symbol : digit}</span>`).join("");
  const candidates = visual.candidates ? `<div class="hidden-score-candidates"><b>사용할 숫자</b>${visual.candidates.map((value) => `<span>${value}</span>`).join("")}</div>` : "";
  return `<div class="hidden-score-work">${candidates}<div class="hidden-score-table"><div class="heading"><b>이름</b><b>우표의 수(장)</b><b>많이 모은 순서</b></div>${visual.rows.map((row) => `<div class="row"><strong>${row.name}</strong><span class="score">${scoreCells(row)}</span><em>${row.rank}</em></div>`).join("")}</div></div>`;
}

function evenCardCountMarkup(visual) {
  return `<div class="even-card-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="even-card-template"><span></span><span></span><b>짝수</b></div></div>`;
}

function reverseCountTimelineMarkup(visual) {
  return `<div class="reverse-count-work"><span class="unknown">처음 ?${visual.unit}</span>${visual.operations.map((operation) => `<i>→</i><span class="${operation.delta > 0 ? "plus" : "minus"}">${operation.delta > 0 ? "+" : "-"}${Math.abs(operation.delta)}${visual.unit}</span>`).join("")}<i>→</i><span class="final">마지막 ${visual.final}${visual.unit}</span></div>`;
}

function eraseExpressionTargetMarkup(visual) {
  return `<div class="erase-expression-work"><span>${visual.first}</span>${visual.terms.map((term) => `<span class="erasable">${term.sign > 0 ? "+" : "-"}${term.value}</span>`).join("")}<b>=</b><strong>${visual.target}</strong></div>`;
}

function collectionRepeatGapMarkup(visual) {
  const shown = visual.shownCircles.map((value, index) => `<span class="circle">${value}</span>${index < visual.shownCircles.length - 1 ? `<i><b>${visual.sums[index % 2]}</b></i>` : ""}`).join("");
  return `<div class="collection-repeat-work">${shown}<em>…</em><span class="circle target">${visual.start}</span></div>`;
}

function mixedOperationCardsMarkup(visual) {
  const slot = (index) => visual.given?.index === index
    ? `<span class="mixed-card-slot given">${visual.given.value}</span>`
    : '<span class="mixed-card-slot"></span>';
  return `<div class="mixed-card-work">
    <div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div>
    <div class="mixed-card-board">
      <div class="mixed-card-top"><b>${visual.base}</b><i>+</i>${slot(0)}<i>=</i>${slot(1)}</div>
      <div class="mixed-card-columns">
        <div><i>×</i>${slot(2)}<i>=</i>${slot(3)}</div>
        <div><i>-</i>${slot(4)}<i>=</i><b>${visual.target}</b></div>
      </div>
      ${visual.extraTarget == null ? "" : `<div class="mixed-card-extra"><i>-</i>${slot(5)}<i>=</i><b>${visual.extraTarget}</b></div>`}
    </div>
  </div>`;
}

function twoDigitCardEnumerationMarkup(visual) {
  return `<div class="two-digit-enumeration-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><strong>${visual.condition} 두 자리 수</strong></div>`;
}

function closestCardSumMarkup(visual) {
  const blank = () => '<span class="digit-card-blank"></span>';
  return `<div class="closest-card-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="closest-card-equation"><span class="two-digit-blank">${blank()}${blank()}</span><b>+</b><span class="two-digit-blank">${blank()}${blank()}</span><b>=</b><span class="sum-blank"></span></div><small>${visual.target}에 가장 가까운 합</small></div>`;
}

function edgeSumCycleMarkup(visual) {
  const cycle = (values, edges, showValues, given = null) => {
    const [top, right, bottom, left] = edges;
    const positions = [[95,68],[235,68],[235,184],[95,184]];
    const placedValues = showValues
      ? values.map((value, index) => ({ value, index }))
      : given ? [given] : [];
    return `<div class="edge-cycle"><div class="edge-number-strip">${values.map((value) => `<span>${value}</span>`).join("")}</div><svg viewBox="0 0 330 220" role="img" aria-label="네 원 안에 수를 넣고 각 변의 합을 맞추는 문제"><line x1="95" y1="62" x2="235" y2="62"/><line x1="235" y1="62" x2="235" y2="178"/><line x1="235" y1="178" x2="95" y2="178"/><line x1="95" y1="178" x2="95" y2="62"/><circle cx="95" cy="62" r="25"/><circle cx="235" cy="62" r="25"/><circle cx="235" cy="178" r="25"/><circle cx="95" cy="178" r="25"/>${placedValues.map(({ value, index }) => `<text class="edge-inside" x="${positions[index][0]}" y="${positions[index][1]}">${value}</text>`).join("")}<text x="165" y="53">합 ${top}</text><text x="257" y="122">합 ${right}</text><text x="165" y="205">합 ${bottom}</text><text x="39" y="122">합 ${left}</text></svg></div>`;
  };
  return `<div class="edge-cycle-work"><div class="edge-cycle-example"><b>[보기]</b>${cycle([2,4,8,6], [6,12,14,8], true)}</div><div>${cycle(visual.values, visual.edges, false, visual.given)}</div></div>`;
}

function equalizeBagsMarkup(visual) {
  const item = visual.item || "사탕";
  const bag = (name, count) => `<div class="candy-bag"><strong>${name}</strong><div class="bag-shape" aria-label="${item} ${count}개">${Array.from({ length: count }, () => "<i></i>").join("")}</div></div>`;
  return `<div class="equalize-bags">${bag(visual.names[0], visual.higher)}<span class="transfer-arrow">몇 개를<br>줄까요?</span>${bag(visual.names[1], visual.lower)}</div>`;
}

function numberPyramidMarkup(visual) {
  return `<div class="pyramid-wrap"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div>${visual.hint ? `<small>${visual.hint}</small>` : ""}<svg class="pyramid-svg" viewBox="0 0 300 215" role="img" aria-label="세 수를 이웃한 두 수끼리 두 번 모으는 수 피라미드"><g class="pyramid-links"><path d="M55 64L100 101M150 64L100 101M150 64L200 101M245 64L200 101M100 149L150 179M200 149L150 179"/></g><g class="pyramid-boxes"><rect x="31" y="16" width="48" height="48"/><rect x="126" y="16" width="48" height="48"/><rect x="221" y="16" width="48" height="48"/><rect x="76" y="101" width="48" height="48"/><rect x="176" y="101" width="48" height="48"/></g><text class="pyramid-blank-label" x="150" y="48">㉠</text><text class="pyramid-target-label" x="150" y="207">${visual.target}</text></svg></div>`;
}

function totalDifferenceShareMarkup(visual) {
  const hint = visual.showHint ? `<strong>차이 ${visual.difference}개를 먼저 떼어 보기</strong>` : "";
  const transfer = visual.transfer ? `<small>${visual.transfer}개를 준 뒤 차이 ${visual.afterDifference}개</small>` : "";
  return `<div class="total-difference-work">${hint}<div class="share-cubes" style="--cube-columns:${visual.total <= 20 ? 5 : 7}" aria-label="큐브 ${visual.total}개">${Array.from({ length: visual.total }, () => "<i></i>").join("")}</div>${transfer}</div>`;
}

function fiveCardPyramidMarkup(visual) {
  const bottomLeft = visual.given?.index === 0 ? visual.given.value : "";
  return `<div class="five-card-pyramid-wrap"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><svg class="five-card-pyramid-svg" viewBox="0 0 360 245" role="img" aria-label="아래 세 칸과 가운데 두 칸에 수 카드를 넣는 합 피라미드"><g class="five-pyramid-links"><path d="M180 42L130 72M180 42L230 72M130 120L80 153M130 120L180 153M230 120L180 153M230 120L280 153"/></g><g class="five-pyramid-boxes"><rect x="105" y="72" width="50" height="48"/><rect x="205" y="72" width="50" height="48"/><rect x="55" y="153" width="50" height="48"/><rect x="155" y="153" width="50" height="48"/><rect x="255" y="153" width="50" height="48"/></g><text class="five-pyramid-target" x="180" y="33">${visual.target}</text>${bottomLeft === "" ? "" : `<text class="five-pyramid-given" x="80" y="184">${bottomLeft}</text>`}<text class="five-pyramid-blank" x="180" y="184">㉠</text></svg></div>`;
}

function lGridPlacementMarkup(visual) {
  const cell = (index, className) => {
    const given = visual.given?.index === index ? visual.given.value : "";
    const content = index === visual.targetIndex ? "㉠" : given;
    return `<span class="${className}${given !== "" ? " given" : ""}${index === visual.targetIndex ? " target" : ""}">${content}</span>`;
  };
  return `<div class="l-grid-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul><div class="l-grid">${cell(0,"p0")}${cell(1,"p1")}${cell(2,"p2")}${cell(3,"p3")}</div></div>`;
}

function stairGridPlacementMarkup(visual) {
  const given = visual.given?.index === 0 ? visual.given.value : "";
  return `<div class="stair-grid-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="stair-grid"><span class="cell p0 given">${given}</span><span class="cell p1">㉠</span><span class="cell p2"></span><span class="cell p3"></span></div></div>`;
}

function verticalStairGridPlacementMarkup(visual) {
  const given = visual.given?.index === 2 ? visual.given.value : "";
  return `<div class="stair-grid-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="vertical-stair-grid"><span class="cell p0">㉠</span><span class="cell p1"></span><span class="cell p2 given">${given}</span><span class="cell p3"></span></div></div>`;
}

function raceOrderMarkup(visual, conditions) {
  return `<div class="race-order"><div class="race-track-row"><b>앞</b><div class="race-track" style="--race-count:${visual.total}">${Array.from({ length: visual.total }, (_, index) => `<span><i></i><b>${index + 1}등</b></span>`).join("")}</div><b>뒤</b></div><ul>${conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div>`;
}

function linePositionSevenMarkup(visual) {
  const hint = visual.hint ? `<small>${visual.hint}</small>` : "";
  return `<div class="line-position-work"><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul>${hint}<div class="line-position-row"><b>앞</b><div style="--line-count:${visual.total}">${Array.from({ length: visual.total }, () => "<i></i>").join("")}</div><b>뒤</b></div></div>`;
}

function totalDifferenceCandyMarkup(visual) {
  const hint = visual.showHint ? `<small>먼저 ${visual.difference}개를 떼어 놓고, 남은 사탕을 둘로 똑같이 나누어 보세요.</small>` : "";
  return `<div class="candy-share-work"><div class="candy-count" style="--candy-columns:${Math.min(10, Math.ceil(Math.sqrt(visual.total)))}">${Array.from({ length: visual.total }, () => '<span aria-hidden="true">🍬</span>').join("")}</div>${hint}${visual.transfer ? `<p>한 사람이 다른 사람에게 <b>${visual.transfer}개</b>를 주었습니다.</p>` : `<p>두 사람의 차이는 <b>${visual.difference}개</b>입니다.</p>`}</div>`;
}

function additionTableGridMarkup(visual) {
  const givenMap = new Map(visual.givens.map((item) => [`${item.row}:${item.column}`, item.value]));
  const cells = Array.from({ length: visual.size * visual.size }, (_, index) => {
    const row = Math.floor(index / visual.size);
    const column = index % visual.size;
    const key = `${row}:${column}`;
    const isTarget = row === visual.target.row && column === visual.target.column;
    return `<span class="${isTarget ? "target" : givenMap.has(key) ? "given" : "blank"}">${isTarget ? "㉠" : givenMap.get(key) ?? ""}</span>`;
  }).join("");
  const hint = visual.hint ? `<small class="addition-table-hint">${visual.hint}</small>` : "";
  return `<div class="addition-table-work">${hint}<div class="addition-table-grid" style="--table-size:${visual.size}">${cells}</div></div>`;
}

function discNumberRuleMarkup(visual) {
  const disc = (item, offset) => `<g transform="translate(${offset},76)"><circle class="disc-outer" r="52"/><path class="disc-line" d="M0-52V52M-52 0H52"/><circle class="disc-inner" r="24"/><text x="-27" y="-22">${item.northWest}</text><text x="27" y="-22">${item.northEast}</text><text x="-27" y="33">${item.southWest}</text><text x="27" y="33">${item.southEast}</text><text class="disc-center" y="7">${item.center}</text></g>`;
  return `<svg class="disc-rule-svg" viewBox="0 0 390 152" role="img" aria-label="원판 수 규칙 문제">${visual.discs.map((item, index) => disc(item, 70 + index * 125)).join("")}</svg>`;
}

function shapeSumTableMarkup(visual) {
  return `<div class="shape-sum-work"><div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div><div class="shape-sum-target"><div class="shape-sum-grid"><span>◇</span><span>◇</span><b>${visual.rowOne}</b><span>□</span><span>○</span><b>㉠</b><b>${visual.columnOne}</b><b>${visual.columnTwo}</b></div></div></div>`;
}

function shapeSumRowTargetMarkup(visual) {
  const example = visual.showExample ? `<div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div>` : "";
  const hint = visual.revealDiamond ? `<small class="shape-sum-hint">도움: ◇ = ${visual.diamond}</small>` : "";
  return `<div class="shape-sum-work source-layout ${visual.showExample ? "" : "single"}">${example}<div class="shape-sum-target">${hint}<div class="shape-sum-source-grid"><span>◇</span><span>□</span><b>${visual.rowOne}</b><span>◇</span><span>○</span><b class="target">㉠</b><b>${visual.columnOne}</b><b>${visual.columnTwo}</b></div></div></div>`;
}

function shapeSumBottomTargetMarkup(visual) {
  const example = visual.showExample ? `<div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div>` : "";
  const hint = visual.revealDiamond ? `<small class="shape-sum-hint">도움: ◇ = ${visual.diamond}</small>` : "";
  return `<div class="shape-sum-work source-layout ${visual.showExample ? "" : "single"}">${example}<div class="shape-sum-target">${hint}<div class="shape-sum-source-grid"><span>◇</span><span>○</span><b>${visual.rowOne}</b><span>◇</span><span>□</span><b>${visual.rowTwo}</b><b>${visual.columnOne}</b><b class="target">㉠</b></div></div></div>`;
}

function shapeSumColumnTargetMarkup(visual) {
  const example = visual.showExample ? `<div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div>` : "";
  const hint = visual.revealSquare ? `<small class="shape-sum-hint">도움: □ = ${visual.square}</small>` : "";
  return `<div class="shape-sum-work source-layout ${visual.showExample ? "" : "single"}">${example}<div class="shape-sum-target">${hint}<div class="shape-sum-source-grid"><span>◇</span><span>○</span><b>${visual.rowOne}</b><span>□</span><span>□</span><b>${visual.rowTwo}</b><b class="target">㉠</b><b>${visual.columnTwo}</b></div></div></div>`;
}

function shapeSumRepeatedColumnTargetMarkup(visual) {
  const example = visual.showExample ? `<div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div>` : "";
  const hint = visual.revealCircle ? `<small class="shape-sum-hint">도움: ○ = ${visual.circle}</small>` : "";
  return `<div class="shape-sum-work source-layout ${visual.showExample ? "" : "single"}">${example}<div class="shape-sum-target">${hint}<div class="shape-sum-source-grid"><span>◇</span><span>○</span><b>${visual.rowOne}</b><span>□</span><span>○</span><b>${visual.rowTwo}</b><b class="target">㉠</b><b>${visual.columnTwo}</b></div></div></div>`;
}

function repeatShapeSequenceMarkup(visual) {
  const symbol = (item) => item === "세모" ? "△" : "○";
  return `<div class="repeat-sequence">${visual.items.map((item, index) => `<span>${symbol(item)}<small>${index + 1}</small></span>`).join("")}<b>…</b><strong>${visual.target}번째<br>모양 (　)</strong></div>`;
}

function repeatShapeColorDualMarkup(visual) {
  const guide = visual.showGuide ? `<small>모양 ${visual.shapeCount}개 주기 · 색 ${visual.fillCount}개 주기</small>` : "";
  return `<div class="dual-pattern-work">${guide}<div class="dual-pattern-sequence" style="--preview-count:${visual.previewCount}">${visual.items.map((item, index) => `<span class="${item.filled ? "filled" : "outline"}"><b>${item.symbol}</b><i>${index + 1}</i></span>`).join("")}</div><div class="dual-pattern-target"><b>…</b><strong>${visual.target}번째<br><i>(　　　　)</i></strong></div></div>`;
}

function threeShapeCycleMarkup(visual) {
  const guide = visual.showGuide ? `<strong class="cycle-guide">반복마디 ${visual.cycle.map((shape) => shape.symbol).join(" ")}</strong>` : "";
  return `<div class="three-shape-cycle">${guide}<div class="cycle-items">${visual.items.map((shape, index) => `<span><b>${shape.symbol}</b><small>${index + 1}번째</small></span>`).join("")}<i>…</i><strong><b>(　)</b><small>${visual.target}번째</small></strong></div></div>`;
}

function arrowNumberGridMarkup(visual) {
  const marker = `arrow-head-${visual.start}`;
  const step = (x1, y1, x2, y2) => {
    const direction = x2 > x1 ? "→" : x2 < x1 ? "←" : y2 > y1 ? "↓" : "↑";
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${marker})"/><text class="step-arrow" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 + 5}">${direction}</text>`;
  };
  const steps = [[43,172,77,172],[87,172,121,172],[126,167,126,127],[131,122,179,122],[184,117,184,77],[179,72,137,72],[127,72,85,72],[80,67,80,27]].map((coords) => step(...coords)).join("");
  return `<div class="arrow-number-rule"><svg class="arrow-legend-svg" viewBox="0 0 250 120" role="img" aria-label="화살표 규칙 보기"><defs><marker id="legend-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs><rect x="4" y="4" width="242" height="112" rx="16"/><text x="125" y="27">[보기]</text><rect x="102" y="42" width="46" height="34"/><rect x="28" y="75" width="46" height="34"/><rect x="102" y="75" width="46" height="34"/><rect x="176" y="75" width="46" height="34"/><text x="125" y="64">5</text><text x="51" y="97">14</text><text x="125" y="97">15</text><text x="199" y="97">16</text><path d="M125 75V67M102 92H76M148 92H174M125 75V79"/></svg><svg class="arrow-grid-svg" viewBox="0 0 270 210" role="img" aria-label="화살표 수 규칙 문제"><defs><marker id="${marker}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs><g class="arrow-steps">${steps}</g><rect x="12" y="148" width="40" height="40"/><circle cx="82" cy="172" r="18"/><circle cx="126" cy="172" r="18"/><circle cx="126" cy="122" r="18"/><circle cx="184" cy="122" r="18"/><circle cx="184" cy="72" r="18"/><circle cx="132" cy="72" r="18"/><circle cx="80" cy="72" r="18"/><rect x="60" y="2" width="40" height="40"/><text x="32" y="174">${visual.start}</text><text x="80" y="28">㉠</text></svg></div>`;
}

function arrowNumberHorizontalTensMarkup(visual) {
  const marker = `arrow-tens-${visual.start}-${visual.directions.join("")}`;
  const minX = Math.min(...visual.points.map((point) => point.x));
  const maxX = Math.max(...visual.points.map((point) => point.x));
  const minY = Math.min(...visual.points.map((point) => point.y));
  const maxY = Math.max(...visual.points.map((point) => point.y));
  const placed = visual.points.map((point) => ({ x: (point.x - minX) * 62 + 34, y: (point.y - minY) * 62 + 34 }));
  const width = (maxX - minX) * 62 + 68;
  const height = (maxY - minY) * 62 + 68;
  const arrows = placed.slice(0, -1).map((point, index) => {
    const next = placed[index + 1];
    const ux = Math.sign(next.x - point.x);
    const uy = Math.sign(next.y - point.y);
    return `<line x1="${point.x + ux * 24}" y1="${point.y + uy * 24}" x2="${next.x - ux * 25}" y2="${next.y - uy * 25}" marker-end="url(#${marker})"/>`;
  }).join("");
  const nodes = placed.map((point, index) => {
    if (index === 0) return `<rect x="${point.x - 22}" y="${point.y - 22}" width="44" height="44"/><text x="${point.x}" y="${point.y + 6}">${visual.start}</text>`;
    if (index === placed.length - 1) return `<rect class="target" x="${point.x - 22}" y="${point.y - 22}" width="44" height="44"/><text x="${point.x}" y="${point.y + 6}">㉠</text>`;
    return `<circle cx="${point.x}" cy="${point.y}" r="21"/>`;
  }).join("");
  const legend = visual.legend;
  return `<div class="arrow-number-rule"><svg class="arrow-legend-svg" viewBox="0 0 230 178" role="img" aria-label="가로는 10, 세로는 1이 변하는 화살표 규칙 보기"><defs><marker id="${marker}-legend" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs><text x="115" y="16">[보기]</text><rect x="92" y="72" width="46" height="34"/><rect x="20" y="72" width="46" height="34"/><rect x="164" y="72" width="46" height="34"/><rect x="92" y="24" width="46" height="34"/><rect x="92" y="120" width="46" height="34"/><text x="115" y="94">${legend.center}</text><text x="43" y="94">${legend.left}</text><text x="187" y="94">${legend.right}</text><text x="115" y="46">${legend.up}</text><text x="115" y="142">${legend.down}</text><path style="marker-end:url(#${marker}-legend)" d="M92 89H69M138 89H161M115 72V61M115 106V117"/></svg><svg class="arrow-grid-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="화살표를 따라 수를 찾는 문제"><defs><marker id="${marker}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs><g class="arrow-steps">${arrows}</g><g>${nodes}</g></svg></div>`;
}

function arrowNumberPathSevenMarkup(visual) {
  const minX = Math.min(...visual.points.map((point) => point.x));
  const maxX = Math.max(...visual.points.map((point) => point.x));
  const minY = Math.min(...visual.points.map((point) => point.y));
  const maxY = Math.max(...visual.points.map((point) => point.y));
  const width = (maxX - minX) * 66 + 100;
  const height = (maxY - minY) * 66 + 100;
  const placed = visual.points.map((point) => ({ x: (point.x - minX) * 66 + 50, y: (point.y - minY) * 66 + 50 }));
  const arrows = placed.slice(0, -1).map((point, index) => {
    const next = placed[index + 1];
    const ux = Math.sign(next.x - point.x);
    const uy = Math.sign(next.y - point.y);
    const sx = point.x + ux * 28;
    const sy = point.y + uy * 28;
    const ex = next.x - ux * 28;
    const ey = next.y - uy * 28;
    const bx = ex - ux * 8;
    const by = ey - uy * 8;
    const px = -uy * 4;
    const py = ux * 4;
    return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}"/><path d="M${ex} ${ey}L${bx + px} ${by + py}L${bx - px} ${by - py}Z"/>`;
  }).join("");
  const nodes = placed.map((point, index) => {
    if (index === 0) return `<rect x="${point.x - 22}" y="${point.y - 22}" width="44" height="44"/><text x="${point.x}" y="${point.y + 6}">${visual.start}</text>`;
    if (index === placed.length - 1) return `<rect class="target" x="${point.x - 22}" y="${point.y - 22}" width="44" height="44"/><text x="${point.x}" y="${point.y + 6}">㉠</text>`;
    return `<circle cx="${point.x}" cy="${point.y}" r="21"/>`;
  }).join("");
  const legend = `<svg class="arrow-path-legend" viewBox="0 0 210 150" role="img" aria-label="화살표 수 규칙 보기"><text x="105" y="16">[보기]</text><rect x="84" y="55" width="42" height="42"/><rect x="18" y="55" width="42" height="42"/><rect x="150" y="55" width="42" height="42"/><rect x="84" y="3" width="42" height="42"/><rect x="84" y="107" width="42" height="42"/><text x="105" y="82">15</text><text x="39" y="82">14</text><text x="171" y="82">16</text><text x="105" y="30">5</text><text x="105" y="134">25</text><text class="legend-arrow" x="70" y="82">←</text><text class="legend-arrow" x="140" y="82">→</text><text class="legend-arrow" x="105" y="52">↑</text><text class="legend-arrow" x="105" y="108">↓</text></svg>`;
  return `<div class="arrow-path-work">${legend}<svg class="arrow-path-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="화살표를 따라 수를 찾는 경로"><g class="path-arrows">${arrows}</g><g class="path-nodes">${nodes}</g></svg></div>`;
}

function busStopsMarkup(visual) {
  const events = visual.events || [
    { action: "leave", count: visual.left },
    { action: "board", count: visual.boarded }
  ];
  const eventText = events.map((event, index) => `<li>${["첫", "두", "세"][index]} 번째 정류장에서 <strong>${event.count}명</strong>이 ${event.action === "board" ? "탔습니다" : "내렸습니다"}.</li>`).join("");
  return `<div class="bus-stops"><ul>${eventText}</ul>${visual.hintAfterFirst ? `<p>${visual.hintAfterFirst}</p>` : ""}</div>`;
}

function foldNumberCutSumMarkup(visual) {
  const cell = 42;
  const paperSize = visual.size * cell;
  const gridLines = Array.from({ length: visual.size - 1 }, (_, index) => {
    const point = (index + 1) * cell;
    return `<path d="M${point} 0V${paperSize}M0 ${point}H${paperSize}"/>`;
  }).join("");
  const mainDiagonal = visual.foldDirection === "main";
  const shaded = visual.foldMask.map(([row, column]) => {
    const x = column * cell;
    const y = row * cell;
    if (mainDiagonal && row === column) return `<path d="M${x} ${y}H${x + cell}V${y + cell}Z"/>`;
    if (!mainDiagonal && row + column === visual.size - 1) return `<path d="M${x} ${y}H${x + cell}L${x} ${y + cell}Z"/>`;
    return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}"/>`;
  }).join("");
  const foldLine = mainDiagonal ? `M0 0L${paperSize} ${paperSize}` : `M0 ${paperSize}L${paperSize} 0`;
  const foldArrow = mainDiagonal
    ? `<path class="fold-arrow" d="M${paperSize - 30} 36Q${paperSize - 58} 58 ${paperSize - 82} 82"/><path class="fold-arrow-head" d="M${paperSize - 82} 82l12 -3l-4 12Z"/>`
    : `<path class="fold-arrow" d="M${paperSize - 34} ${paperSize - 45}Q${paperSize - 60} ${paperSize - 78} ${paperSize - 93} ${paperSize - 88}"/><path class="fold-arrow-head" d="M${paperSize - 93} ${paperSize - 88}l12 -5l-4 12Z"/>`;
  const paper = `<svg class="fold-cut-paper" viewBox="-8 -24 ${paperSize + 16} ${paperSize + 34}" role="img" aria-label="대각선으로 접고 칠한 부분을 자르는 색종이"><text x="${paperSize / 2}" y="-8">한 번 접기</text><rect width="${paperSize}" height="${paperSize}"/><g class="fold-cut-grid">${gridLines}</g><path class="fold-line" d="${foldLine}"/><g class="cut-shade">${shaded}</g>${foldArrow}</svg>`;
  const numberGrid = `<div class="fold-cut-number-grid" style="--fold-size:${visual.size}">${visual.grid.map((value) => `<span>${value}</span>`).join("")}</div>`;
  return `<div class="fold-number-cut-work">${paper}<b class="fold-process-arrow">→</b>${numberGrid}</div>`;
}

function equalLineSumEightCardsMarkup(visual) {
  const positions = [[45, 45], [130, 45], [215, 45], [215, 130], [215, 215], [130, 215], [45, 215], [45, 130]];
  const lines = `<path d="M45 45H215V215H45Z"/>`;
  const nodes = positions.map(([x, y], index) => {
    const label = index === visual.targetIndex ? "㉠" : visual.givenIndices.includes(index) ? visual.layout[index] : "";
    const className = index === visual.targetIndex ? "target" : label ? "given" : "blank";
    return `<g class="${className}"><rect x="${x - 28}" y="${y - 28}" width="56" height="56"/><text x="${x}" y="${y + 7}">${label}</text></g>`;
  }).join("");
  return `<div class="equal-line-eight-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><svg viewBox="0 0 260 260" role="img" aria-label="가로와 세로 네 줄의 합을 같게 만드는 여덟 수 카드"><g class="equal-eight-lines">${lines}</g><g class="equal-eight-nodes">${nodes}</g><text class="equal-eight-sum" x="130" y="136">합: ${visual.targetSum}</text></svg></div>`;
}

function equalLineCrossMarkup(visual) {
  return `<div class="equal-line-cross"><div class="cross-cards">${[1,2,3,4,5].map((value) => `<span>${value}</span>`).join("")}</div><div class="cross-grid"><span></span><b>${visual.top}</b><span></span><b>${visual.left}</b><b>㉠</b><i></i><span></span><i></i><span></span></div></div>`;
}

function numberConditionsMarkup(visual) {
  return `<div class="number-conditions"><p>십의 자리 숫자와 일의 자리 숫자의 합은 <strong>${visual.sum}</strong>입니다.</p><p>십의 자리 숫자가 일의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.</p></div>`;
}

function twoDigitParityGapMarkup(visual) {
  const gapCondition = visual.onesGreater
    ? `일의 자리 숫자가 십의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.`
    : `십의 자리 숫자가 일의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.`;
  return `<div class="number-conditions parity-gap-conditions"><ul><li><strong>${visual.lower}</strong>보다 크고 <strong>${visual.upper}</strong>보다 작은 짝수입니다.</li><li>${gapCondition}</li>${visual.digitSum === null ? "" : `<li>십의 자리 숫자와 일의 자리 숫자의 합은 <strong>${visual.digitSum}</strong>입니다.</li>`}</ul>${visual.choices.length ? `<div class="parity-gap-choices"><b>[보기]</b>${visual.choices.map((value) => `<span>${value}</span>`).join("")}</div>` : ""}</div>`;
}

function twoDigitOddGapMarkup(visual) {
  return `<div class="number-conditions parity-gap-conditions"><ul><li><strong>${visual.upper}</strong>보다 작은 홀수입니다.</li><li>십의 자리 숫자가 일의 자리 숫자보다 <strong>${visual.gap}</strong> 작습니다.</li></ul>${visual.choices.length ? `<div class="parity-gap-choices"><b>[보기]</b>${visual.choices.map((value) => `<span>${value}</span>`).join("")}</div>` : ""}</div>`;
}

function twoDigitOddBoundedGapMarkup(visual) {
  return `<div class="number-conditions parity-gap-conditions"><ul><li><strong>${visual.lower}</strong>보다 크고 <strong>${visual.upper}</strong>보다 작은 홀수입니다.</li><li>일의 자리 숫자가 십의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.</li>${visual.digitSum === null ? "" : `<li>십의 자리 숫자와 일의 자리 숫자의 합은 <strong>${visual.digitSum}</strong>입니다.</li>`}</ul>${visual.choices.length ? `<div class="parity-gap-choices"><b>[보기]</b>${visual.choices.map((value) => `<span>${value}</span>`).join("")}</div>` : ""}</div>`;
}

function triangleTileGrowthMarkup(visual) {
  const stage = (size) => {
    const height = 86;
    const stepX = 88 / size;
    const stepY = height / size;
    const point = (row, column) => ({ x: 50 - row * stepX / 2 + column * stepX, y: 4 + row * stepY });
    const lines = [];
    for (let row = 1; row <= size; row += 1) {
      for (let column = 0; column < row; column += 1) {
        const left = point(row, column);
        const right = point(row, column + 1);
        lines.push(`<line x1="${left.x}" y1="${left.y}" x2="${right.x}" y2="${right.y}" />`);
      }
      for (let column = 0; column <= row; column += 1) {
        const lower = point(row, column);
        if (column > 0) {
          const upperLeft = point(row - 1, column - 1);
          lines.push(`<line x1="${lower.x}" y1="${lower.y}" x2="${upperLeft.x}" y2="${upperLeft.y}" />`);
        }
        if (column < row) {
          const upperRight = point(row - 1, column);
          lines.push(`<line x1="${lower.x}" y1="${lower.y}" x2="${upperRight.x}" y2="${upperRight.y}" />`);
        }
      }
    }
    return `<div class="triangle-growth-stage stage-${size}"><svg viewBox="0 0 100 94" role="img" aria-label="${size}번째 정삼각형 조각 배열"><g>${lines.join("")}</g></svg><b>${size}번째</b>${visual.showCounts ? `<span>${size * size}장</span>` : ""}</div>`;
  };
  return `<div class="triangle-growth-work growth-theme-${visual.theme || "navy"}">${visual.stages.map(stage).join("")}<strong>…</strong><em>${visual.askIndex ? `${visual.pieceCount}장` : `${visual.target}번째`}</em></div>`;
}

function squareTileGrowthMarkup(visual) {
  const stage = (size) => {
    const cells = Array.from({ length: size * size }, (_, index) => {
      const row = Math.floor(index / size);
      const column = index % size;
      return `<rect x="${column * 100 / size}" y="${row * 100 / size}" width="${100 / size}" height="${100 / size}" />`;
    }).join("");
    return `<div class="square-growth-stage stage-${size}"><svg viewBox="-1 -1 102 102" role="img" aria-label="${size}번째 정사각형 조각 배열"><g>${cells}</g></svg><b>${size}번째</b>${visual.showCounts ? `<span>${size * size}장</span>` : ""}</div>`;
  };
  return `<div class="square-growth-work growth-theme-${visual.theme || "navy"}">${visual.stages.map(stage).join("")}<strong>…</strong><em>${visual.askIndex ? `${visual.pieceCount}장` : `${visual.target}번째`}</em></div>`;
}

function growingDotSquareMarkup(visual) {
  const stage = (size) => `<div><i style="--dots:${size}">${Array.from({ length: size * size }, () => "<b></b>").join("")}</i><span>${size}번째</span></div>`;
  return `<div class="growing-dot-squares growth-theme-${visual.theme || "navy"}">${[1,2,3,4].map(stage).join("")}<strong>…</strong><em>${visual.target}번째</em></div>`;
}

function symbolSumGridMarkup(visual) {
  const cells = ["☆", "□", "△", visual.rowOne, "□", "□", "☆", visual.rowTwo, "△", "□", "○", visual.rowThree, visual.rowOne, visual.columnTwo, "㉠"];
  return `<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div>`;
}

function shapeSumGridTriangleTopMarkup(visual) {
  const cells = [
    "△", "△", "△", visual.rowSums[0],
    "□", "□", "△", visual.rowSums[1],
    "○", "◇", "♡", "㉠",
    visual.columnSums[0], visual.columnSums[1], visual.columnSums[2]
  ];
  return `<div class="shape-sum-grid-top-work">${visual.hint ? `<p>${visual.hint}</p>` : ""}<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div></div>`;
}

function shapeSumGridTopTargetMarkup(visual) {
  const sumLabel = (value, key) => visual.hiddenSums.includes(key) ? "" : value;
  const cells = [
    "△", "□", "○", "㉠",
    "◇", "□", "○", sumLabel(visual.rowSums[1], "row-2"),
    "○", "△", "○", sumLabel(visual.rowSums[2], "row-3"),
    sumLabel(visual.columnSums[0], "column-1"), sumLabel(visual.columnSums[1], "column-2"), sumLabel(visual.columnSums[2], "column-3")
  ];
  return `<div class="shape-sum-grid-top-work">${visual.hint ? `<p>${visual.hint}</p>` : ""}<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div></div>`;
}

function shapeSumGridTriangleColumnTargetMarkup(visual) {
  const sumLabel = (value, key) => visual.hiddenSums.includes(key) ? "" : value;
  const cells = [
    "△", "○", "◇", "㉠",
    "△", "□", "□", sumLabel(visual.rowSums[1], "row-2"),
    "△", "◇", "□", sumLabel(visual.rowSums[2], "row-3"),
    sumLabel(visual.columnSums[0], "column-1"), sumLabel(visual.columnSums[1], "column-2"), sumLabel(visual.columnSums[2], "column-3")
  ];
  return `<div class="shape-sum-grid-top-work">${visual.hint ? `<p>${visual.hint}</p>` : ""}<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div></div>`;
}

function symbolSumGridSquareTopMarkup(visual) {
  const sumLabel = (value, key) => visual.hiddenSums.includes(key) ? "" : value;
  const cells = [
    "□", "□", "□", sumLabel(visual.rowSums[0], "row-1"),
    "□", "◇", "△", sumLabel(visual.rowSums[1], "row-2"),
    "◇", "○", "○", sumLabel(visual.rowSums[2], "row-3"),
    sumLabel(visual.columnSums[0], "column-1"), sumLabel(visual.columnSums[1], "column-2"), "㉠"
  ];
  return `<div class="symbol-sum-square-top-work">${visual.hint ? `<p>${visual.hint}</p>` : ""}<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div></div>`;
}

function shapeEquationAddSubtractMarkup(visual) {
  const token = (value) => {
    if (value === "square") return '<i class="shape-equation-symbol square" aria-label="네모">□</i>';
    if (value === "heart") return '<i class="shape-equation-symbol heart" aria-label="하트">♡</i>';
    if (value === "star") return '<i class="shape-equation-symbol star" aria-label="별">☆</i>';
    return `<strong>${value}</strong>`;
  };
  const line = (equation) => `<div class="shape-equation-line">${token(equation.left)}<b>${equation.operator}</b>${token(equation.right)}<b>=</b>${token(equation.result)}</div>`;
  const example = visual.example;
  return `<div class="shape-equation-work">
    <section class="shape-equation-example"><b>[보기]</b><div><span class="circled-number">${example.circle}</span><b>+</b><strong>${example.addend}</strong><b>=</b><strong>${example.sum}</strong></div><div><strong>${example.minuend}</strong><b>-</b><span class="circled-number">${example.circle}</span><b>=</b><strong>${example.difference}</strong></div></section>
    <section class="shape-equation-target">${visual.equations.map(line).join("")}<p>${token(visual.target)} = (　　)</p></section>
  </div>`;
}

function sourcePianoMarkup() {
  const notes = ["도", "레", "미", "파", "솔", "라", "시", "도"];
  const rows = [[1,2,3,4,5,6,7,8],[14,13,12,11,10,9,8,""],[15,16,17,18,19,20,21,22]];
  return `<div class="source-piano"><div class="source-piano-keys">${notes.map((note, index) => `<span class="${[0,1,3,4,5].includes(index) ? "has-black" : ""}"><b>${note}</b></span>`).join("")}</div><div class="piano-sequence">${rows.map((row) => row.map((number) => `<span>${number}</span>`).join("")).join("")}</div><em>…</em></div>`;
}

function balanceRelationsMarkup(visual) {
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}">${kind === "circle" ? "○" : kind === "star" ? "☆" : ""}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  return `<div class="balance-relations"><p>양쪽에 있는 물건의 무게가 같을 때 저울은 수평이 됩니다.</p>${scale(`${pieces("circle", visual.leftCircleCount)}${pieces("square", visual.starRectangles)}`, `${pieces("star", 1)}${pieces("circle", visual.rightCircleCount)}`, "[그림 1]")}${scale(pieces("circle", visual.rectangleWeight * visual.middleRectangleCount), pieces("rectangle", visual.middleRectangleCount), "[그림 2]")}${scale(`${pieces("star", 1)}${pieces("rectangle", visual.targetRectangles)}`, `<strong>○ (　)개</strong>`, "[그림 3]")}${visual.hint ? `<p>${visual.hint}</p>` : ""}</div>`;
}

function balanceScaleThreeObjectsMarkup(visual) {
  const symbols = { circle: "○", square: "□", star: "☆", diamond: "◇" };
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}" aria-label="${symbols[kind]}">${symbols[kind]}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example three-object-scale"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  const first = scale(pieces("circle", 1), `${pieces("square", visual.squareBesideStar)}${pieces("star", 1)}`, "[그림 1]");
  const second = scale(`${pieces("circle", 1)}${pieces("square", visual.squareBesideCircle)}`, `${pieces("diamond", 1)}${pieces("star", 1)}`, "[그림 2]");
  const third = scale(pieces("star", 1), `${pieces("square", visual.squareBesideDiamond)}${pieces("diamond", 1)}`, "[그림 3]");
  const target = visual.askCombined ? "○ + ◇ = □ (　)개" : "○ = □ (　)개";
  return `<div class="three-object-balances">${first}${second}${third}${visual.hint ? `<p class="balance-hint">도움: ${visual.hint}</p>` : ""}<strong class="balance-target">${target}</strong></div>`;
}

function balanceScaleCircleTargetMarkup(visual) {
  const symbols = { circle: "○", star: "☆", diamond: "◇" };
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}" aria-label="${symbols[kind]}">${symbols[kind]}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example three-object-scale"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  const first = scale(`${pieces("circle", visual.circleCount)}${pieces("diamond", visual.diamondCount)}`, pieces("star", visual.starCount), "[그림 1]");
  const second = scale(`${pieces("diamond", visual.secondDiamondCount)}${pieces("star", visual.secondStarCount)}`, pieces("circle", visual.secondCircleCount), "[그림 2]");
  const third = scale(`${pieces("diamond", visual.targetDiamondCount)}${pieces("star", visual.targetStarCount)}`, "<strong>○ (　)개</strong>", "[그림 3]");
  return `<div class="three-object-balances">${first}${second}${third}${visual.hint ? `<p class="balance-hint">${visual.hint}</p>` : ""}</div>`;
}

function balanceScaleStarTargetMarkup(visual) {
  const symbols = { circle: "○", square: "□", star: "☆", triangle: "△" };
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}" aria-label="${symbols[kind]}">${symbols[kind]}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example three-object-scale"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  if (visual.mode === "direct") {
    const first = scale(pieces("circle", visual.circleCount), pieces("square", visual.squareCount), "[그림 1]");
    return `<div class="three-object-balances balance-learning-step is-direct">${first}<strong class="balance-target">○ 1개 = □ (　)개</strong></div>`;
  }
  if (visual.mode === "cancel") {
    const first = scale(`${pieces("circle", visual.circleCount)}${pieces("triangle", visual.triangleCount)}`, `${pieces("square", visual.squareCount)}${pieces("triangle", visual.triangleCount)}`, "[그림 1]");
    return `<div class="three-object-balances balance-learning-step is-cancel">${first}<p class="balance-hint">양쪽에 똑같이 있는 △를 함께 지워 보세요.</p><strong class="balance-target">○ 1개 = □ (　)개</strong></div>`;
  }
  const first = scale(pieces("circle", visual.circleCount), pieces("square", visual.squareCount), "[그림 1]");
  const second = scale(`${pieces("star", visual.starCount)}${pieces("square", visual.extraSquares)}`, pieces("circle", visual.rightCircleCount), "[그림 2]");
  return `<div class="three-object-balances balance-learning-step is-substitute">${first}${second}<p class="balance-hint">[그림 1]의 ○를 □로 바꾸어 넣어 보세요.</p><strong class="balance-target">☆ 1개 = □ (　)개</strong></div>`;
}

function balanceScaleFourObjectsMarkup(visual) {
  const symbols = { circle: "○", square: "□", star: "☆", diamond: "◇" };
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}" aria-label="${symbols[kind]}">${symbols[kind]}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example three-object-scale"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  const first = scale(pieces("circle", 1), `${pieces("square", visual.circleSquareCount)}${pieces("diamond", visual.circleDiamondCount)}`, "[그림 1]");
  const second = scale(pieces("star", visual.starCount), pieces("diamond", visual.diamondCount), "[그림 2]");
  const third = scale(pieces("square", 1), `${pieces("star", visual.squareStarCount)}${pieces("diamond", visual.squareDiamondCount)}`, "[그림 3]");
  return `<div class="three-object-balances four-object-balances">${first}${second}${third}${visual.hint ? `<p class="balance-hint">도움: ${visual.hint}</p>` : ""}<strong class="balance-target">○ 1개 = ◇ (　)개</strong></div>`;
}

function symbolRelationsMarkup(visual) {
  const repeat = (symbol, count) => Array.from({ length: count }, () => symbol).join(" + ");
  return `<div class="symbol-relations">${visual.hint ? `<small>${visual.hint}</small>` : ""}<p>${repeat("☆", visual.firstStar)} = ${repeat("○", visual.firstCircle)}</p><p>☆ + ○ = ▽ + ▽</p><p>${visual.final.join(" + ")} = □</p></div>`;
}

function numberLineSixPointsMarkup(visual) {
  const d = visual.distances;
  const gaps = visual.gaps || [
    d.ac - (d.bd - (d.ad - d.ac)),
    d.bd - (d.ad - d.ac),
    d.ad - d.ac,
    d.ce - (d.ad - d.ac),
    d.bf - (d.bd - (d.ad - d.ac)) - (d.ad - d.ac) - (d.ce - (d.ad - d.ac))
  ];
  const total = gaps.reduce((sum, value) => sum + value, 0);
  const displayGaps = gaps.map((value) => 20 + (310 * value) / total);
  const labels = ["A", "B", "C", "D", "E", "F"];
  let running = 0;
  const xs = Object.fromEntries(labels.map((label, index) => {
    if (index > 0) running += displayGaps[index - 1];
    return [label, 28 + running];
  }));
  const arc = (from, to, value, side, height, className = "") => {
    const x1 = xs[from];
    const x2 = xs[to];
    const controlY = side === "top" ? 78 - height : 78 + height;
    const labelY = side === "top" ? controlY + 7 : controlY - 3;
    return `<path class="distance-arc ${className}" d="M ${x1} 78 Q ${(x1 + x2) / 2} ${controlY} ${x2} 78"/><text class="distance-label ${className}" x="${(x1 + x2) / 2}" y="${labelY}">${value}</text>`;
  };
  const hints = visual.hints.map((hint) => `<span>${hint.from}${hint.to} = ${hint.value}</span>`).join("");
  const targetArc = visual.target === "AF" ? arc("A", "F", "?", "top", 72, "target") : arc("E", "F", "?", "top", 30, "target");
  return `<div class="six-point-line-work"><svg viewBox="0 0 466 180" role="img" aria-label="A부터 F까지 여섯 점과 겹쳐 표시한 거리">
    <line class="number-line-base" x1="28" y1="78" x2="438" y2="78"/>
    ${arc("A", "D", d.ad, "top", 60)}${arc("C", "E", d.ce, "top", 48)}${arc("A", "C", d.ac, "bottom", 40)}${arc("B", "D", d.bd, "bottom", 55)}${arc("B", "F", d.bf, "bottom", 87)}${targetArc}
    ${Object.entries(xs).map(([label, x]) => `<circle cx="${x}" cy="78" r="4"/><text class="point-label" x="${x}" y="94">${label}</text>`).join("")}
  </svg>${hints ? `<div class="line-distance-hints"><b>도움</b>${hints}</div>` : ""}<strong>구할 거리: ${visual.target[0]}와 ${visual.target[1]}</strong></div>`;
}

function goStoneDifferenceInverseMarkup(visual) {
  const stage = (size) => `<div class="go-triangle-stage">${Array.from({ length: size }, (_, rowIndex) => {
    const row = rowIndex + 1;
    const color = row % 2 === 1 ? "black" : "white";
    return `<div>${Array.from({ length: row }, () => `<i class="${color}"></i>`).join("")}</div>`;
  }).join("")}<span>${size}번째</span></div>`;
  return `<div class="go-difference-work"><div class="go-triangle-stages">${Array.from({ length: visual.stages }, (_, index) => stage(index + 1)).join("")}<b>…</b></div>${visual.hint ? `<p>${visual.hint}</p>` : ""}<strong>${visual.targetText || `${visual.targetColor}이 ${visual.difference}개 더 많은 때`}</strong></div>`;
}

function fiveCellPlacementMarkup(visual) {
  const cells = [
    [140, 12, "top"], [76, 76, "target"], [140, 76, "center"], [204, 76, "right"], [204, 140, "bottom"]
  ];
  const givenValue = visual.given?.position === "top" ? visual.given.value : "";
  return `<div class="five-cell-placement-work"><div class="five-cell-cards">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="five-cell-body"><svg viewBox="0 0 340 212" role="img" aria-label="위 한 칸, 가운데 세 칸, 오른쪽 아래 한 칸으로 이어진 다섯 칸"><g>${cells.map(([x, y, position]) => `<rect x="${x}" y="${y}" width="64" height="64"/><text x="${x + 32}" y="${y + 39}">${position === "target" ? "㉠" : position === "top" ? givenValue : ""}</text>`).join("")}</g></svg><div class="five-cell-clues">${visual.clues.map((clue) => `<p>${clue}</p>`).join("")}${visual.extra ? `<strong>${visual.extra}</strong>` : ""}</div></div></div>`;
}

function coloredShapeNumberMarkup(visual) {
  const examples = [[1,[0,0,0,1]],[2,[0,0,0,2]],[5,[0,0,1,1]],[8,[0,0,2,0]],[19,[0,1,0,3]],[68,[1,0,1,0]]];
  const grid = (digits, label, target = false) => `<div class="base-four-grid ${target ? "target" : ""}">${Array.from({ length: 3 }, (_, row) => digits.map((count) => `<i class="${row >= 3 - count ? "filled" : ""}"></i>`).join("")).join("")}<span>${label}</span></div>`;
  return `<div class="colored-shape-number"><div class="color-examples">${examples.map(([label, digits]) => grid(digits, label)).join("")}</div>${grid(visual.digits, "?", true)}</div>`;
}

function sourceGoStonesMarkup(visual) {
  const patterns = [
    [[1,0],[0,0]],
    [[1,0,1],[0,0,1],[1,1,1]],
    [[1,0,1,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],
    [[1,0,1,0,1],[0,0,1,0,1],[1,1,1,0,1],[0,0,0,0,1],[1,1,1,1,1]]
  ];
  return `<div class="source-go-stones">${patterns.map((pattern, index) => `<div><i style="--size:${index + 2}">${pattern.flat().map((black) => `<b class="${black ? "black" : "white"}"></b>`).join("")}</i><span>${index + 1}번째</span></div>`).join("")}<strong>…</strong><em>${visual.target}번째</em></div>`;
}

function nonadjacentPyramidMarkup(visual) {
  const rows = [[visual.top], [visual.left, ""], ["", "", ""], ["", "", "㉠", ""]];
  return `<div class="nonadjacent-pyramid">${rows.map((row, rowIndex) => `<div style="--row:${rowIndex}">${row.map((value) => `<span>${value}</span>`).join("")}</div>`).join("")}</div>`;
}

function polygonPoints(sides, radius, cx, cy) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / sides;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
}

function polygonStoneDots(sides, perSide, radius, cx, cy) {
  const vertices = polygonPoints(sides, radius, cx, cy);
  const dots = [];
  vertices.forEach(([x1, y1], index) => {
    const [x2, y2] = vertices[(index + 1) % sides];
    for (let step = 0; step < perSide - 1; step += 1) {
      const ratio = step / (perSide - 1);
      dots.push([x1 + (x2 - x1) * ratio, y1 + (y2 - y1) * ratio]);
    }
  });
  return dots;
}

function g1SourceMarkup(visual) {
  if (visual.kind === "g1-bus-two-stops") {
    return `<div class="g1-event-flow"><strong>출발 ${visual.start}명</strong>${visual.events.map(({ left, boarded }, index) => `<span>→</span><section><b>${index + 1}번째 정류장</b><small>${left}명 내림</small><small>${boarded}명 탐</small></section>`).join("")}</div>`;
  }
  if (visual.kind === "g1-condition-list") {
    return `<div class="g1-condition-panel"><strong>${visual.title}</strong><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div>`;
  }
  if (visual.kind === "g1-equation-panel") {
    return `<div class="g1-equation-panel">${visual.equations.map((equation) => `<p>${equation}</p>`).join("")}${visual.hint ? `<small>${visual.hint}</small>` : ""}</div>`;
  }
  if (visual.kind === "g1-fold-cut-pieces") {
    const folds = visual.folds.map((fold, index) => `<section><i class="g1-fold-paper fold-${index + 1}"></i><b>${fold}</b></section><span>→</span>`).join("");
    return `<div class="g1-fold-flow tone-${visual.paperTone}">${folds}<section><i class="g1-fold-paper cut cut-${visual.cutPattern} ${visual.folds.length === 1 ? "cut-once" : ""}"></i><b>${visual.cuts}</b></section></div>`;
  }
  if (visual.kind === "g1-repeated-digit-addition") {
    const resultText = String(visual.result).split("").join(" ");
    return `<div class="g1-vertical-addition"><p>${visual.digitSymbol} ${visual.otherSymbol}</p><p><b>+</b> ${visual.digitSymbol} ${visual.otherSymbol}</p><hr><p>${resultText}</p></div>`;
  }
  if (visual.kind === "g1-balance-three-relations") {
    const repeated = (symbol, count) => Array.from({ length: count }, () => symbol).join(" ");
    return `<div class="g1-balance-relations"><section><span>${repeated("▭", visual.triangleRectangles)}</span><b>=</b><span>△</span><small>[그림 1]</small></section><section><span>${repeated("▭", visual.circleRectangles)} ${repeated("△", visual.circleTriangles)}</span><b>=</b><span>○</span><small>[그림 2]</small></section><section><span>△ ○</span><b>=</b><span>▭ (　)개</span><small>[그림 3]</small></section></div>`;
  }
  if (visual.kind === "g1-summer-height-order") {
    return `<div class="g1-height-order"><div class="g1-condition-panel"><strong>어린이들의 말</strong><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div><div class="g1-rank-slots"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div></div>`;
  }
  if (visual.kind === "g1-summer-balance-chain") {
    const pieces = (symbol, count, center) => {
      const spacing = Math.min(20, 54 / Math.max(1, count - 1));
      return Array.from({ length: count }, (_, index) => `<text x="${center - (count - 1) * spacing / 2 + index * spacing}" y="33">${symbol}</text>`).join("");
    };
    const scale = (left, right, label) => `<section><svg viewBox="0 0 220 104" role="img" aria-label="${label} 양팔저울"><line x1="24" y1="62" x2="196" y2="62"/><line x1="110" y1="54" x2="110" y2="87"/><path d="M84 88h52l-12 10H96z"/><ellipse cx="58" cy="55" rx="39" ry="7"/><ellipse cx="162" cy="55" rx="39" ry="7"/>${left}${right}</svg><small>${label}</small></section>`;
    return `<div class="g1-summer-balance">${scale(pieces("○", visual.circles, 58), pieces("□", visual.squares, 162), "[그림 1]")}${scale(pieces("□", 1, 58), pieces("△", visual.triangles, 162), "[그림 2]")}${scale(pieces("○", 1, 58), `<text x="162" y="33" class="target">△ (　)개</text>`, "[그림 3]")}</div>`;
  }
  if (visual.kind === "g1-summer-five-box-weight") {
    const slots = Array.from({ length: visual.boxCount }, () => "<span>　</span>").join("<b>&gt;</b>");
    return `<div class="g1-five-box-weight"><div class="g1-condition-panel"><strong>상자 무게 조건</strong><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div><div class="g1-box-order" aria-label="무거운 순서 빈칸">${slots}</div></div>`;
  }
  if (visual.kind === "g1-summer-four-shape-chain") {
    return `<div class="g1-summer-shape-chain"><p>☆ + ○ = ${visual.sum}</p><p>◇ − ☆ = ${visual.difference}</p><p>◇ + ◇ = ${visual.diamond * 2}</p><p>○ − □ = ${visual.difference}</p></div>`;
  }
  if (visual.kind === "g1-summer-pentagon-product") {
    const [, upperLeft, lowerLeft, lowerRight, upperRight] = visual.values;
    const [topLeftProduct, leftProduct, bottomProduct, rightProduct, topRightProduct] = visual.products;
    return `<svg class="g1-summer-pentagon" viewBox="0 0 320 270" role="img" aria-label="오각형의 이웃한 두 수의 곱"><path d="M160 28L68 96L103 212H217L252 96Z"/><circle cx="160" cy="28" r="25" class="target"/><circle cx="68" cy="96" r="25"/><circle cx="103" cy="212" r="25"/><circle cx="217" cy="212" r="25"/><circle cx="252" cy="96" r="25"/><rect x="94" y="47" width="46" height="34" rx="2"/><rect x="67" y="137" width="46" height="34" rx="2"/><rect x="137" y="196" width="46" height="34" rx="2"/><rect x="207" y="137" width="46" height="34" rx="2"/><rect x="180" y="47" width="46" height="34" rx="2"/><text x="160" y="35" class="target-text">　</text><text x="68" y="103">${upperLeft}</text><text x="103" y="219">${lowerLeft}</text><text x="217" y="219">${lowerRight}</text><text x="252" y="103">${upperRight}</text><text x="117" y="70" class="product">${topLeftProduct}</text><text x="90" y="160" class="product">${leftProduct}</text><text x="160" y="219" class="product">${bottomProduct}</text><text x="230" y="160" class="product">${rightProduct}</text><text x="203" y="70" class="product">${topRightProduct}</text></svg>`;
  }
  if (visual.kind === "g1-summer-four-by-four-sum") {
    const cells = visual.cells || ["□", "□", "□", "□", "△", "◇", "☆", "○", "△", "☆", "☆", "○", "△", "△", "◇", "◇"];
    const targetRow = Number.isInteger(visual.targetRow) ? visual.targetRow : 2;
    return `<div class="g1-sum-layout"><div class="g1-sum-core">${cells.map((cell) => `<span>${cell}</span>`).join("")}</div><div class="g1-sum-rows">${visual.rowSums.map((sum, index) => `<b class="${index === targetRow ? "target" : ""}">${index === targetRow ? "　" : sum}</b>`).join("")}</div><div class="g1-sum-columns">${visual.columnSums.map((sum) => `<b>${sum}</b>`).join("")}</div></div>`;
  }
  if (visual.kind === "g1-summer-circle-points") {
    const pointMarkup = Array.from({ length: visual.points }, (_, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / visual.points;
      const x = 120 + Math.cos(angle) * 82;
      const y = 120 + Math.sin(angle) * 82;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`;
    }).join("");
    return `<svg class="g1-summer-circle-points" viewBox="0 0 240 240" role="img" aria-label="원 위의 ${visual.points}개 점"><circle cx="120" cy="120" r="82" class="outline"/>${pointMarkup}</svg>`;
  }
  if (visual.kind === "g1-summer-vertical-shape-addition") {
    return `<div class="g1-summer-vertical-addition"><p>◎　□</p><p>＋◆　□</p><hr/><p>◆　◆　${visual.finalDigit}</p></div>`;
  }
  if (visual.kind === "g1-summer-one-three-rods") {
    return `<div class="g1-summer-rods"><section><i>㉠</i></section><section><i>㉡</i><i>㉡</i><i>㉡</i></section><strong><i>㉠</i><i>㉡</i><b>${visual.total}cm</b></strong></div>`;
  }
  if (visual.kind === "g1-summer-square-composition") {
    const n = visual.targetUnits;
    const u = 23;
    const width = (n * 2 + 1) * u;
    const height = n * 2 * u;
    const rightX = (n + 1) * u;
    const targetY = n * u;
    const leftTop = (n - 1) * u;
    const smallX = leftTop;
    return `<svg class="g1-summer-square-composition" viewBox="0 0 ${width + 12} ${height + 12}" role="img" aria-label="정사각형을 붙여 만든 도형"><rect x="6" y="6" width="${width}" height="${height}"/><rect x="6" y="6" width="${leftTop}" height="${leftTop}"/><rect x="${6 + smallX}" y="6" width="${u}" height="${u}"/><rect x="${6 + smallX + u}" y="6" width="${u}" height="${u}"/><rect x="${6 + smallX}" y="${6 + u}" width="${u * 2}" height="${leftTop - u}"/><rect x="6" y="${6 + leftTop}" width="${rightX}" height="${rightX}"/><rect x="${6 + rightX}" y="6" width="${n * u}" height="${n * u}"/><rect class="target" x="${6 + rightX}" y="${6 + targetY}" width="${n * u}" height="${n * u}"/><text x="${6 + smallX + u / 2}" y="${6 + u * .68}">㉠</text><text x="${6 + rightX + n * u / 2}" y="${6 + targetY + n * u / 2 + 8}">㉡</text><text x="${6 + smallX + u / 2}" y="${6 + u + 15}" class="measure">${visual.unit}cm</text></svg>`;
  }
  if (visual.kind === "g1-summer-fold-cut-triangles") {
    const diagonal = visual.diagonal === "left" ? "M18 68L68 16" : "M18 16L68 68";
    return `<div class="g1-summer-fold-cut"><svg viewBox="0 0 130 130" role="img" aria-label="첫 번째 접기"><rect x="12" y="12" width="104" height="104"/><path class="dash" d="M64 12V116"/><path class="arrow" d="M98 58Q84 85 65 79"/><path class="arrow-head" d="M65 79l9-2-4 8z"/></svg><b>→</b><svg viewBox="0 0 82 130" role="img" aria-label="두 번째 접기"><rect x="8" y="12" width="60" height="104"/><path class="dash" d="M8 64H68"/><path class="arrow" d="M52 40Q39 56 44 77"/><path class="arrow-head" d="M44 77l-5-8 9 3z"/></svg><b>→</b><svg viewBox="0 0 84 130" role="img" aria-label="대각선 자르기"><text x="9" y="19">✂</text><rect x="18" y="22" width="50" height="72"/><path class="seam" d="M43 22V94"/><path class="cut" d="${diagonal}"/></svg></div>`;
  }
  if (visual.kind === "g1-summer-four-symbol-relation") {
    return `<div class="g1-summer-four-symbol"><p>☆ + □ = ◇</p><p>☆ + ☆ + ☆ = ○ + ○ + ○ + ○</p><p>☆ + ☆ = ◇ + ○</p></div>`;
  }
  if (visual.kind === "g1-summer-shape-height-cycle") {
    const stack = ({ shape, height, number }) => `<section><span>${Array.from({ length: height }, () => `<i>${shape}</i>`).join("")}</span><b>${number}</b></section>`;
    return `<div class="g1-summer-shape-cycle">${visual.items.map(stack).join("")}<em>…</em><section class="target"><span></span><b>${visual.target}</b></section></div>`;
  }
  if (visual.kind === "g1-summer-orange-ratio") {
    return `<div class="g1-summer-orange-ratio"><section><b>어린이</b><span>○ ○ ○</span><em>귤 1개</em></section><section><b>어른</b><span>○</span><em>귤 3개</em></section><strong>모두 ${visual.people}명 · 귤 ${visual.oranges}개</strong></div>`;
  }
  if (visual.kind === "g1-summer-rectilinear-perimeter") {
    const { height, top, inner, lower, notch } = visual;
    const scale = 18;
    const h = height * scale;
    const topW = top * scale;
    const lowerW = lower * scale;
    const notchW = notch * scale;
    const insetX = topW - notchW;
    const upperY = h * .33;
    const lowerY = h * .67;
    return `<svg class="g1-summer-perimeter" viewBox="0 0 ${lowerW + 90} ${h + 62}" role="img" aria-label="직각으로 꺾인 도형의 둘레"><path d="M43 20H${43 + topW}V${20 + upperY}H${43 + insetX}V${20 + lowerY}H${43 + lowerW}V${20 + h}H43Z"/><path class="measure" d="M43 11H${43 + topW}"/><text x="${43 + topW / 2}" y="10">${top}cm</text><path class="measure" d="M30 20V${20 + h}"/><text x="15" y="${20 + h / 2}">${height}cm</text><path class="measure" d="M${43 + insetX} ${20 + lowerY - 10}H${43 + lowerW}"/><text x="${43 + insetX + (lowerW - insetX) / 2}" y="${20 + lowerY - 13}">${inner}cm</text><path class="measure" d="M43 ${h + 33}H${43 + lowerW}"/><text x="${43 + lowerW / 2}" y="${h + 52}">${lower}cm</text></svg>`;
  }
  if (visual.kind === "g1-summer-opposite-sequences") {
    const top = Array.from({ length: 4 }, (_, index) => visual.topStart + visual.topStep * index);
    const bottom = Array.from({ length: 4 }, (_, index) => visual.bottomStart + visual.bottomStep * index);
    return `<table class="g1-summer-sequences"><tbody><tr>${top.map((item) => `<td>${item}</td>`).join("")}<td>…</td><td>${visual.topLast}</td></tr><tr>${bottom.map((item) => `<td>${item}</td>`).join("")}<td>…</td><td>㉠</td></tr></tbody></table>`;
  }
  if (visual.kind === "g1-fall-linear-table") {
    const columns = [...visual.anchors, { input: visual.targetInput, output: "㉠" }];
    return `<table class="g1-fall-linear-table"><tbody><tr><th>윗줄</th>${columns.map((item) => `<td>${item.input}</td>`).join("")}</tr><tr><th>아랫줄</th>${columns.map((item) => `<td class="${item.output === "㉠" ? "target" : ""}">${item.output}</td>`).join("")}</tr></tbody></table>`;
  }
  if (visual.kind === "g1-fall-three-person-transfer") {
    return `<div class="g1-fall-transfer"><div>${visual.people.map((person) => `<section><b>${person.name}</b><span>${person.count ?? "?"}개</span></section>`).join("")}</div><p><strong>${visual.people[1].name}</strong><em>구슬 ${visual.transfer}개</em><strong>${visual.people[2].name}</strong></p></div>`;
  }
  if (visual.kind === "g1-fall-number-set-chain") {
    return `<div class="g1-fall-number-chain"><div>${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><ol>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ol></div>`;
  }
  if (visual.kind === "g1-fall-latin-two-target") {
    const cells = visual.grid.map((value, index) => {
      const targetIndex = visual.targetIndices.indexOf(index);
      const label = targetIndex === 0 ? "㉠" : targetIndex === 1 ? "㉡" : "";
      const shown = visual.clueIndices.includes(index) ? value : label;
      return `<span class="${label ? "target" : ""}">${shown}</span>`;
    }).join("");
    return `<div class="g1-fall-latin" style="--latin-size:${visual.size}">${cells}</div>`;
  }
  if (visual.kind === "g1-fall-pentagon-products-all") {
    const productPositions = [[117, 70], [90, 160], [160, 219], [230, 160], [203, 70]];
    const circles = [[160, 28], [68, 96], [103, 212], [217, 212], [252, 96]];
    return `<svg class="g1-fall-pentagon" viewBox="0 0 320 270" role="img" aria-label="오각형의 다섯 원과 이웃한 두 수의 곱"><path d="M160 28L68 96L103 212H217L252 96Z"/>${circles.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="25"/><text x="${x}" y="${y + 7}">　</text>`).join("")}${productPositions.map(([x, y], index) => `<rect x="${x - 23}" y="${y - 17}" width="46" height="34"/><text x="${x}" y="${y + 7}" class="product">${visual.products[index]}</text>`).join("")}</svg>`;
  }
  if (visual.kind === "g1-fall-shape-sum-four-targets") {
    return `<div class="g1-fall-four-sums"><div class="core">${visual.symbols.map((symbol) => `<span>${symbol}</span>`).join("")}</div><div class="rows">${visual.rowSums.map((sum, index) => `<b class="${visual.hiddenRows.includes(index) ? "target" : ""}">${visual.hiddenRows.includes(index) ? "　" : sum}</b>`).join("")}</div><div class="columns">${visual.columnSums.map((sum, index) => `<b class="${visual.hiddenColumns.includes(index) ? "target" : ""}">${visual.hiddenColumns.includes(index) ? "　" : sum}</b>`).join("")}</div></div>`;
  }
  if (visual.kind === "g1-fall-four-one-rods") {
    return `<div class="g1-fall-rods"><section class="short">${Array.from({ length: visual.shortCount }, () => "<i>㉠</i>").join("")}</section><section class="long"><i>㉡</i></section><strong><span>㉠</span><span>㉡</span><b>${visual.total}cm</b></strong></div>`;
  }
  if (visual.kind === "g1-fall-stacked-square-sides") {
    return `<svg class="g1-fall-stacked-squares" viewBox="0 0 230 145" role="img" aria-label="크기가 다른 정사각형 네 개"><rect x="8" y="8" width="120" height="120"/><rect x="128" y="8" width="80" height="80"/><rect x="128" y="88" width="40" height="40"/><rect x="168" y="88" width="40" height="40"/><text x="68" y="72">가</text><text x="168" y="52">나</text><text x="148" y="113">다</text><text x="188" y="113">라</text><path d="M8 136H128"/><text x="68" y="143" class="measure">${visual.big}cm</text></svg>`;
  }
  if (visual.kind === "g1-fall-three-fold-crease-cut") {
    const diagonal = visual.diagonal === "up" ? "M20 100L100 20" : "M20 20L100 100";
    const otherDiagonal = visual.diagonal === "up" ? "M20 20L100 100" : "M20 100L100 20";
    const panels = [`<svg viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100"/><path class="dash" d="M10 60H110"/><path class="arrow" d="M88 35Q60 50 60 76"/></svg>`, `<svg viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100"/><path class="dash" d="M60 10V110"/><path class="arrow" d="M88 55Q70 67 53 61"/></svg>`];
    if (visual.folds >= 3) panels.push(`<svg viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100"/><path class="dash" d="${diagonal}"/><path class="arrow" d="M82 84Q63 70 54 53"/></svg>`);
    if (visual.folds >= 4) panels.push(`<svg viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100"/><path class="dash" d="${otherDiagonal}"/><path class="arrow" d="M38 84Q57 70 66 53"/></svg>`);
    return `<div class="g1-fall-crease-cut">${panels.map((panel, index) => `${index ? "<b>→</b>" : ""}${panel}`).join("")}</div>`;
  }
  if (visual.kind === "g1-fall-triple-share") {
    return `<div class="g1-fall-triple-share"><strong>모두 ${visual.total}장</strong><div><section><b>${visual.largerName}</b><span>□ □ □</span></section><section><b>${visual.smallerName}</b><span>□</span></section></div></div>`;
  }
  if (visual.kind === "g1-fall-four-blank-addition") {
    const width = Math.max(...visual.rows.map((row) => row.length));
    const row = (digits, sign = "") => `<p><b>${sign}</b>${Array.from({ length: width - digits.length }, () => "<i></i>").join("")}${digits.map((digit) => `<i class="${digit === null ? "blank" : ""}">${digit === null ? "" : digit}</i>`).join("")}</p>`;
    return `<div class="g1-fall-blank-addition">${row(visual.rows[0])}${row(visual.rows[1], "+")}<hr/>${row(visual.rows[2])}</div>`;
  }
  if (visual.kind === "g1-fall-square-chain-perimeter") {
    return `<svg class="g1-fall-square-chain" viewBox="0 0 245 190" role="img" aria-label="여러 정사각형을 붙인 직사각형"><rect x="10" y="10" width="150" height="150"/><rect x="160" y="10" width="60" height="60"/><rect x="160" y="70" width="60" height="60"/><rect x="160" y="130" width="30" height="30"/><rect class="target" x="190" y="130" width="30" height="30"/><path class="measure" d="M10 174H220"/><text x="115" y="187">${visual.totalWidth}cm</text></svg>`;
  }
  if (visual.kind === "g1-fall-consecutive-three-sum") {
    const shown = (value) => {
      const digits = String(value).split("");
      return digits.map((digit, index) => index < digits.length - visual.visibleDigits ? "□" : digit).join("");
    };
    return `<div class="g1-fall-consecutive-sum"><p>${shown(visual.values[0])}</p><p>＋ ${shown(visual.values[1])}</p><p>${shown(visual.values[2])}</p><hr/><strong>${visual.total}</strong></div>`;
  }
  if (visual.kind === "g1-winter-shared-box-multiplication") {
    return `<svg class="g1-winter-shared-box" viewBox="0 0 300 225" role="img" aria-label="공유 상자가 있는 두 단계 곱셈"><path d="M150 50L55 103M150 50L150 103M150 137L150 180M245 103L150 180"/><rect x="116" y="12" width="68" height="46"/><rect class="target" x="21" y="80" width="68" height="46"/><rect x="116" y="80" width="68" height="46"/><rect x="211" y="80" width="68" height="46"/><rect x="116" y="168" width="68" height="46"/><text x="150" y="43">${visual.topProduct}</text><text x="55" y="111">㉠</text><text x="150" y="111">　</text><text x="245" y="111">${visual.right}</text><text x="150" y="199">${visual.bottomProduct}</text><text class="times" x="103" y="112">×</text><text class="times" x="198" y="112">×</text></svg>`;
  }
  if (visual.kind === "g1-winter-shape-sum-target-row") {
    return `<div class="g1-winter-sum-layout"><div class="core">${visual.grid.flat().map((symbol) => `<span>${symbol}</span>`).join("")}</div><div class="rows">${visual.rowSums.map((value, index) => `<b class="${index === visual.targetRow ? "target" : ""}">${value === null ? "㉠" : value}</b>`).join("")}</div><div class="columns">${visual.columnSums.map((value) => `<b>${value}</b>`).join("")}</div></div>`;
  }
  if (visual.kind === "g1-winter-opponent-step-game") {
    const width = visual.limit * 34 + 30;
    const points = Array.from({ length: visual.limit }, (_, index) => `${18 + index * 34},${visual.limit * 13 - index * 13 + 18} ${50 + index * 34},${visual.limit * 13 - index * 13 + 18} ${50 + index * 34},${visual.limit * 13 - index * 13 + 5}`).join(" ");
    return `<div class="g1-winter-step-game"><div class="events"><b>시작 ${visual.start}번째</b><span>A 승리 ${visual.wins}번</span><span>비김 ${visual.draws}번</span><span>A 패배 ${visual.losses}번</span></div><svg viewBox="0 0 ${width} ${visual.limit * 13 + 42}" role="img" aria-label="계단 이동"><polyline points="${points}"/>${Array.from({ length: visual.limit }, (_, index) => `<text x="${34 + index * 34}" y="${visual.limit * 13 - index * 13 + 13}">${index + 1}</text>`).join("")}</svg></div>`;
  }
  if (visual.kind === "g1-winter-sudoku-four-full") {
    return `<div class="g1-winter-sudoku">${visual.puzzle.flat().map((value, index) => `<span class="r${Math.floor(index / 4)} c${index % 4}">${value ?? ""}</span>`).join("")}</div>`;
  }
  if (visual.kind === "g1-winter-product-placement-four") {
    return `<div class="g1-winter-product-layout"><div class="core">${Array.from({ length: 16 }, (_, index) => `<span class="${visual.shadedIndices.includes(index) ? "target" : "plain"}">${visual.shadedIndices.includes(index) ? "" : "·"}</span>`).join("")}</div><div class="rows">${visual.rowProducts.map((value) => `<b>${value}</b>`).join("")}</div><div class="columns">${visual.columnProducts.map((value) => `<b>${value}</b>`).join("")}</div><div class="cards">${visual.numbers.map((value) => `<i>${value}</i>`).join("")}</div></div>`;
  }
  if (visual.kind === "g1-winter-three-digit-cards-above") {
    return `<div class="g1-winter-card-threshold"><div>${visual.digits.map((digit) => `<span>${digit}</span>`).join("")}</div><strong>${visual.threshold}보다 큰 수</strong></div>`;
  }
  if (visual.kind === "g1-winter-three-balance-substitution") {
    const repeat = (symbol, count) => Array.from({ length: count }, () => symbol).join(" ");
    const r = visual.relations;
    return `<div class="g1-winter-three-balance"><section><span>${repeat("☆", r.starCount)}</span><b>=</b><span>${repeat("◇", r.diamondCount)}</span></section><section><span>□</span><b>=</b><span>${repeat("☆", r.squareStars)} ${repeat("◇", r.squareDiamonds)}</span></section><section><span>○</span><b>=</b><span>${repeat("□", r.circleSquares)} ${repeat("◇", r.circleDiamonds)}</span></section><p>○ 1개 = ◇ (　)개</p></div>`;
  }
  if (visual.kind === "g1-winter-three-cards-parity-chain") {
    return `<div class="g1-winter-card-chain"><div>${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div>`;
  }
  if (visual.kind === "g1-stacked-shape-cycle") {
    return `<div class="g1-stacked-cycle">${visual.items.map((item, index) => `<section><span>${Array.from({ length: item.count }, () => `<i>${item.shape}</i>`).join("")}</span><b>${index + 1}</b></section>`).join("")}<em>…</em><strong>${visual.target}번째</strong></div>`;
  }
  if (visual.kind === "g1-triangle-color-difference") {
    const stage = (size) => `<section><div>${Array.from({ length: size }, (_, row) => `<span>${Array.from({ length: row + 1 }, () => "△").join("")}</span>${row < size - 1 ? `<span class="filled">${Array.from({ length: row + 1 }, () => "▽").join("")}</span>` : ""}`).join("")}</div><b>${size}번째</b></section>`;
    return `<div class="g1-triangle-growth">${[1, 2, 3].map(stage).join("")}<em>…</em><strong>${visual.target}번째</strong></div>`;
  }
  if (visual.kind === "g1-shape-sum-grid-four") {
    const cells = ["○", "○", "◇", "◇", visual.rowSums[0], "□", "▣", "◇", "◇", visual.rowSums[1], "□", "○", "○", "○", visual.rowSums[2], "○", "▣", "□", "◇", "㉠", ...visual.columnSums];
    return `<div class="g1-shape-grid-wrap">${visual.hint ? `<small>${visual.hint}</small>` : ""}<div class="g1-shape-grid">${cells.map((cell, index) => `<span class="${index % 5 === 4 || index >= 20 ? "sum" : ""}">${cell}</span>`).join("")}</div></div>`;
  }
  if (visual.kind === "g1-rod-ratio-total") {
    return `<div class="g1-rods"><section>${Array.from({ length: visual.topUnits }, () => "<i>㉠</i>").join("")}</section><section>${Array.from({ length: visual.bottomUnits }, () => "<i>㉡</i>").join("")}</section><strong><i>㉠</i><i>㉡</i><b>${visual.total}cm</b></strong></div>`;
  }
  if (visual.kind === "g1-polygon-stones") {
    const sourceVertices = polygonPoints(visual.sourceSides, 62, 80, 76).map((point) => point.join(",")).join(" ");
    const targetVertices = polygonPoints(visual.targetSides, 62, 240, 76).map((point) => point.join(",")).join(" ");
    const sourceDots = polygonStoneDots(visual.sourceSides, Math.min(visual.sourcePerSide, 12), 62, 80, 76);
    const targetDots = polygonStoneDots(visual.targetSides, Math.min(visual.targetPerSide, 12), 62, 240, 76);
    return `<svg class="g1-polygon-stones" viewBox="0 0 320 165" role="img" aria-label="다각형 둘레에 놓인 바둑돌을 다른 다각형으로 다시 늘어놓기"><polygon points="${sourceVertices}"/><polygon points="${targetVertices}"/>${sourceDots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join("")}${targetDots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join("")}<text x="80" y="158">${visual.sourceName} · 한 변 ${visual.sourcePerSide}개</text><text x="240" y="158">${visual.targetName} · 한 변 ?개</text></svg>`;
  }
  if (visual.kind === "g1-paired-sequences") {
    const top = Array.from({ length: 4 }, (_, index) => visual.topStart + index * visual.topStep);
    const bottom = Array.from({ length: 4 }, (_, index) => visual.bottomStart + index * visual.bottomStep);
    return `<div class="g1-paired-table"><span>${top.join("　")}</span><b>…</b><strong>${visual.topLast}</strong><span>${bottom.join("　")}</span><b>…</b><strong>㉮</strong></div>`;
  }
  if (visual.kind === "g1-ratio-distribution") {
    return `<div class="g1-ratio-panel"><section><b>어린이</b><span>${visual.childGroup}명</span><em>귤 1개</em></section><section><b>어른</b><span>1명</span><em>귤 ${visual.adultItems}개</em></section><strong>모두 ${visual.people}명 · 귤 ${visual.items}개</strong></div>`;
  }
  if (visual.kind === "g1-odd-even-difference") {
    return `<div class="g1-odd-even-strip"><span>1, 2, 3, 4, … ,</span><strong>㉠</strong><small>홀수 합과 짝수 합의 차: ${visual.difference}</small></div>`;
  }
  return "";
}

function cryptarithmVerticalMarkup(visual) {
  // 자리를 오른쪽으로 맞춰 세로셈처럼 세운다. 자리 수가 다르면 왼쪽을 빈칸으로 채운다.
  const addends = visual.addends || [visual.first, visual.second];
  const width = Math.max(...addends.map((row) => row.length), visual.sum.length);
  const pad = (row) => Array.from({ length: width - row.length }, () => "").concat(row);
  const line = (row, sign) => `<div class="cv-row">${sign ? `<b class="cv-sign">${sign}</b>` : `<b class="cv-sign"></b>`}${pad(row).map((cell) => `<span>${cell}</span>`).join("")}</div>`;
  return `<div class="cryptarithm-vertical" style="--cv-cols:${width}">${addends.map((row, index) => line(row, index === addends.length - 1 ? "+" : "")).join("")}<div class="cv-bar"></div>${line(visual.sum, "")}</div>`;
}

function foldGeometryHelpers() {
  const KEEP = {
    v: (p) => 0.5 - p.x,
    h: (p) => 0.5 - p.y,
    vq: (p) => 0.25 - p.x,
    hq: (p) => 0.25 - p.y,
    d1: (p) => p.x - p.y,
    d2: (p) => 1 - p.x - p.y
  };
  const MIRROR = {
    v: (p) => ({ x: 1 - p.x, y: p.y }),
    h: (p) => ({ x: p.x, y: 1 - p.y }),
    vq: (p) => ({ x: 0.5 - p.x, y: p.y }),
    hq: (p) => ({ x: p.x, y: 0.5 - p.y }),
    d1: (p) => ({ x: p.y, y: p.x }),
    d2: (p) => ({ x: 1 - p.y, y: 1 - p.x })
  };
  const clip = (polygon, keep) => {
    const out = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (da >= -1e-9) out.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    return out;
  };
  const foldLine = (polygon, fold) => {
    const keep = KEEP[fold];
    const points = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (Math.abs(da) < 1e-9) points.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        points.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    if (points.length < 2) return null;
    let best = null;
    let far = -1;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (d > far) { far = d; best = [points[i], points[j]]; }
      }
    }
    return far > 1e-6 ? best : null;
  };
  const foldArrow = (polygon, dir) => {
    const keep = KEEP[dir];
    const mirror = MIRROR[dir];
    const away = clip(polygon, (p) => -keep(p));
    if (away.length < 3) return "";
    const from = { x: away.reduce((t, p) => t + p.x, 0) / away.length, y: away.reduce((t, p) => t + p.y, 0) / away.length };
    const to = mirror(from);
    return { from, to };
  };
  return { KEEP, MIRROR, clip, foldLine, foldArrow };
}

function foldArrowSvg(from, to, shift, top, size) {
  if (!from) return "";
  const sx = shift + from.x * size;
  const sy = top + from.y * size;
  const ex = shift + to.x * size;
  const ey = top + to.y * size;
  const nx = -(ey - sy);
  const ny = ex - sx;
  const len = Math.hypot(nx, ny) || 1;
  const bulge = Math.min(size * 0.22, 20);
  const cx = (sx + ex) / 2 + (nx / len) * bulge;
  const cy = (sy + ey) / 2 + (ny / len) * bulge;
  const angle = Math.atan2(ey - cy, ex - cx);
  const head = [
    `${(ex + 6 * Math.cos(angle)).toFixed(1)},${(ey + 6 * Math.sin(angle)).toFixed(1)}`,
    `${(ex - 13 * Math.cos(angle - 0.5)).toFixed(1)},${(ey - 13 * Math.sin(angle - 0.5)).toFixed(1)}`,
    `${(ex - 13 * Math.cos(angle + 0.5)).toFixed(1)},${(ey - 13 * Math.sin(angle + 0.5)).toFixed(1)}`
  ].join(" ");
  return `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/><polygon points="${head}" fill="#c0392b"/>`;
}

function foldStepArrowSvg(x, y) {
  return `<path d="M${x} ${y} H${x + 30}" stroke="#95a5a6" stroke-width="3"/><polygon points="${x + 30},${y} ${x + 20},${y - 7} ${x + 20},${y + 7}" fill="#95a5a6"/>`;
}

function foldNumberGridMarkup(visual) {
  const N = 4;
  const cell = 30;
  const size = N * cell;
  const numberGrid = (grid, ox, oy, dim, showNumbers) => {
    let out = `<rect x="${ox}" y="${oy}" width="${dim.w * cell}" height="${dim.h * cell}" fill="${showNumbers ? "#f9c8c4" : "#fbdad6"}" stroke="#e8968f" stroke-width="2"/>`;
    for (let k = 1; k < dim.w; k += 1) out += `<line x1="${ox + k * cell}" y1="${oy}" x2="${ox + k * cell}" y2="${oy + dim.h * cell}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
    for (let k = 1; k < dim.h; k += 1) out += `<line x1="${ox}" y1="${oy + k * cell}" x2="${ox + dim.w * cell}" y2="${oy + k * cell}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
    if (showNumbers) {
      for (let r = 0; r < dim.h; r += 1) for (let c = 0; c < dim.w; c += 1) {
        out += `<text x="${ox + c * cell + cell / 2}" y="${oy + r * cell + cell / 2 + 5}" text-anchor="middle" font-size="15" font-weight="600" fill="#333">${grid[r][c]}</text>`;
      }
    }
    return out;
  };

  let x = 8;
  const top = 6;
  let parts = numberGrid(visual.grid, x, top, { w: N, h: N }, true);
  parts += `<line x1="${x + 2 * cell}" y1="${top}" x2="${x + 2 * cell}" y2="${top + size}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  parts += `<line x1="${x}" y1="${top + 2 * cell}" x2="${x + size}" y2="${top + 2 * cell}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  x += size + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  const midW = visual.hDir === "up" || visual.hDir === "down" ? N : 2;
  const midH = 2;
  const midGrid = visual.hDir === "up" ? [visual.grid[0], visual.grid[1]] : [visual.grid[2], visual.grid[3]];
  parts += numberGrid(midGrid, x, top + cell, { w: N, h: 2 }, false);
  parts += `<line x1="${x + 2 * cell}" y1="${top + cell}" x2="${x + 2 * cell}" y2="${top + cell + 2 * cell}" stroke="#7ba7bb" stroke-width="1.6" stroke-dasharray="5 4"/>`;
  x += size + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  const half = size / 2;
  parts += numberGrid([[0, 0], [0, 0]], x, top + cell / 2, { w: 2, h: 2 }, false).replace(/width="[\d.]+" height="[\d.]+"/, `width="${half}" height="${half}"`);
  const cutSet = new Set(visual.cells.map((c) => c.r * 2 + c.c));
  for (const cell2 of visual.cells) {
    const cx2 = x + (cell2.c * half) / 2;
    const cy2 = top + cell / 2 + (cell2.r * half) / 2;
    parts += `<rect x="${cx2}" y="${cy2}" width="${half / 2}" height="${half / 2}" fill="#b03a5b"/>`;
  }
  x += half + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  parts += numberGrid(visual.grid, x, top, { w: N, h: N }, true);

  return `<svg class="fold-number-svg" viewBox="0 0 ${x + size + 10} ${size + 16}" role="img" aria-label="수가 쓰인 색종이 접기 문제">${parts}</svg>`;
}

function foldDiagonalGridMarkup(visual) {
  const N = 4;
  const cell = 34;
  const size = N * cell;
  const top = 6;
  let x = 8;

  let parts = `<rect x="${x}" y="${top}" width="${size}" height="${size}" fill="#fdeeec" stroke="#eec6c1" stroke-width="1" stroke-dasharray="4 3"/>`;
  for (let k = 1; k < N; k += 1) {
    parts += `<line x1="${x + k * cell}" y1="${top}" x2="${x + k * cell}" y2="${top + size}" stroke="#eec6c1" stroke-dasharray="4 3"/>`;
    parts += `<line x1="${x}" y1="${top + k * cell}" x2="${x + size}" y2="${top + k * cell}" stroke="#eec6c1" stroke-dasharray="4 3"/>`;
  }
  const tri = visual.keepLower
    ? [[0, 0], [0, N], [N, N]]
    : [[0, 0], [N, 0], [N, N]];
  const triPoints = tri.map(([px, py]) => `${x + px * cell},${top + py * cell}`).join(" ");
  parts += `<polygon points="${triPoints}" fill="#fbdad6" stroke="#e8968f" stroke-width="2.4"/>`;
  for (const u of visual.region) {
    const cx = x + u.c * cell;
    const cy = top + u.r * cell;
    if (!u.half) {
      parts += `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="#b03a5b"/>`;
    } else {
      const points = visual.keepLower
        ? `${cx},${cy} ${cx},${cy + cell} ${cx + cell},${cy + cell}`
        : `${cx},${cy} ${cx + cell},${cy} ${cx + cell},${cy + cell}`;
      parts += `<polygon points="${points}" fill="#b03a5b"/>`;
    }
  }
  parts += `<line x1="${x}" y1="${top}" x2="${x + size}" y2="${top + size}" stroke="#e8968f" stroke-width="1.4" stroke-dasharray="5 4"/>`;

  x += size + 40;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  for (let r = 0; r < N; r += 1) for (let c = 0; c < N; c += 1) {
    const cx = x + c * cell;
    const cy = top + r * cell;
    parts += `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="#f9c8c4" stroke="#e0aaa4" stroke-width="1"/>`;
    parts += `<text x="${cx + cell / 2}" y="${cy + cell / 2 + 5}" text-anchor="middle" font-size="15" font-weight="600" fill="#333">${visual.grid[r][c]}</text>`;
  }
  for (let k = 1; k < N; k += 1) {
    parts += `<line x1="${x + k * cell}" y1="${top}" x2="${x + k * cell}" y2="${top + size}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
    parts += `<line x1="${x}" y1="${top + k * cell}" x2="${x + size}" y2="${top + k * cell}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  }
  parts = `<rect x="${x - 2}" y="${top - 2}" width="${size + 4}" height="${size + 4}" fill="none" stroke="#e8968f" stroke-width="2.4"/>` + parts;

  return `<svg class="fold-diag-svg" viewBox="0 0 ${x + size + 10} ${size + 16}" role="img" aria-label="대각선 접기 수 색종이 문제">${parts}</svg>`;
}

function foldNumberInverseMarkup(visual) {
  const N = 4;
  const cell = 30;
  const size = N * cell;
  const top = 6;
  let x = 8;
  const rect = (rows, ox, oy, cellSize, showNumbers) => {
    const h = rows.length;
    const w = rows[0].length;
    let out = `<rect x="${ox}" y="${oy}" width="${w * cellSize}" height="${h * cellSize}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2.2"/>`;
    for (let k = 1; k < w; k += 1) out += `<line x1="${ox + k * cellSize}" y1="${oy}" x2="${ox + k * cellSize}" y2="${oy + h * cellSize}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
    for (let k = 1; k < h; k += 1) out += `<line x1="${ox}" y1="${oy + k * cellSize}" x2="${ox + w * cellSize}" y2="${oy + k * cellSize}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
    if (showNumbers) {
      for (let r = 0; r < h; r += 1) for (let c = 0; c < w; c += 1) {
        out += `<text x="${ox + c * cellSize + cellSize / 2}" y="${oy + r * cellSize + cellSize / 2 + 5}" text-anchor="middle" font-size="15" font-weight="600" fill="#333">${rows[r][c]}</text>`;
      }
    }
    return out;
  };

  let parts = rect(visual.grid, x, top, cell, true);
  parts += `<line x1="${x + 2 * cell}" y1="${top}" x2="${x + 2 * cell}" y2="${top + size}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  parts += `<line x1="${x}" y1="${top + 2 * cell}" x2="${x + size}" y2="${top + 2 * cell}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  x += size + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  const mid = visual.firstFold === "h"
    ? [visual.grid[visual.packetRow], visual.grid[visual.packetRow + 1]]
    : visual.grid.map((row) => [row[visual.packetCol], row[visual.packetCol + 1]]);
  const midW = visual.firstFold === "h" ? N : 2;
  const midTop = visual.firstFold === "h" ? top + cell : top;
  parts += rect(mid, x, midTop, cell, true);
  x += midW * cell + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  const packet = [
    [visual.grid[visual.packetRow][visual.packetCol], visual.grid[visual.packetRow][visual.packetCol + 1]],
    [visual.grid[visual.packetRow + 1][visual.packetCol], visual.grid[visual.packetRow + 1][visual.packetCol + 1]]
  ];
  parts += rect(packet, x, top + cell, cell + 6, true);

  return `<svg class="fold-inverse-svg" viewBox="0 0 ${x + 2 * (cell + 6) + 10} ${size + 16}" role="img" aria-label="목표 합이 되게 색칠하기 문제">${parts}</svg>`;
}

function foldCutPiecesMarkup(visual) {
  const { foldLine, foldArrow } = foldGeometryHelpers();
  const n = visual.stages.length;
  const size = n <= 3 ? 100 : 84;
  const gap = 34;
  let shift = 6;
  let parts = "";
  visual.stages.forEach((stage, index) => {
    const points = stage.polygon.map((p) => `${(shift + p.x * size).toFixed(1)},${(6 + p.y * size).toFixed(1)}`).join(" ");
    parts += `<polygon points="${points}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    if (stage.fold) {
      const segment = foldLine(stage.polygon, stage.fold);
      if (segment) parts += `<line x1="${(shift + segment[0].x * size).toFixed(1)}" y1="${(6 + segment[0].y * size).toFixed(1)}" x2="${(shift + segment[1].x * size).toFixed(1)}" y2="${(6 + segment[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      const arrow = foldArrow(stage.polygon, stage.fold);
      if (arrow) parts += foldArrowSvg(arrow.from, arrow.to, shift, 6, size);
    } else {
      for (const [a, b] of visual.cuts) {
        parts += `<line x1="${(shift + a.x * size).toFixed(1)}" y1="${(6 + a.y * size).toFixed(1)}" x2="${(shift + b.x * size).toFixed(1)}" y2="${(6 + b.y * size).toFixed(1)}" stroke="#b03a5b" stroke-width="2.6"/>`;
      }
    }
    shift += size + 12;
    if (index < n - 1) { parts += foldStepArrowSvg(shift, 6 + size / 2); shift += gap; }
  });
  return `<svg class="fold-pieces-svg" viewBox="0 0 ${shift + 6} ${size + 16}" role="img" aria-label="색종이 접어 자르기 조각 개수 문제">${parts}</svg>`;
}

function foldPunchMarkup(visual) {
  const { foldLine, foldArrow } = foldGeometryHelpers();
  const n = visual.stages.length;
  const size = n <= 3 ? 100 : 84;
  const gap = 34;
  let shift = 6;
  let parts = "";
  visual.stages.forEach((stage, index) => {
    const points = stage.polygon.map((p) => `${(shift + p.x * size).toFixed(1)},${(6 + p.y * size).toFixed(1)}`).join(" ");
    parts += `<polygon points="${points}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    if (stage.fold) {
      const segment = foldLine(stage.polygon, stage.fold);
      if (segment) parts += `<line x1="${(shift + segment[0].x * size).toFixed(1)}" y1="${(6 + segment[0].y * size).toFixed(1)}" x2="${(shift + segment[1].x * size).toFixed(1)}" y2="${(6 + segment[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      const arrow = foldArrow(stage.polygon, stage.fold);
      if (arrow) parts += foldArrowSvg(arrow.from, arrow.to, shift, 6, size);
    } else {
      for (const q of visual.punches) {
        const cx = shift + q.cx * size;
        const cy = 6 + q.cy * size;
        const r = q.r * size;
        if (q.type === "full") {
          parts += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#8a8a94" stroke-width="1.8"/>`;
        } else {
          // 남는 반쪽은 법선의 반대편이다 — 개수 판정 규칙(dot <= 0)과 같은 쪽.
          // 시작각 θ+π/2에서 sweep-flag 1로 그리면 θ+π(법선 반대편)를 지나 안쪽으로 부푼다.
          // 화면이 작으면 밖으로 나간 것처럼 보이지만 아니다 — 네 가장자리 208개를 좌표로
          // 재봐서 전부 종이 안임을 확인했다. 눈으로만 보고 방향을 뒤집지 말 것.
          const a0 = Math.atan2(q.ny, q.nx) + Math.PI / 2;
          const a1 = a0 + Math.PI;
          const sx = cx + r * Math.cos(a0);
          const sy = cy + r * Math.sin(a0);
          const ex = cx + r * Math.cos(a1);
          const ey = cy + r * Math.sin(a1);
          parts += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)} Z" fill="#fff" stroke="#8a8a94" stroke-width="1.8"/>`;
        }
      }
    }
    shift += size + 12;
    if (index < n - 1) { parts += foldStepArrowSvg(shift, 6 + size / 2); shift += gap; }
  });
  return `<svg class="fold-punch-svg" viewBox="0 0 ${shift + 6} ${size + 16}" role="img" aria-label="반원·원 펀치 문제">${parts}</svg>`;
}

function foldStackMarkup(visual) {
  const u = 46;
  const ox = 6;
  const oy = 6;
  let parts = "";
  for (let k = 7; k >= 0; k -= 1) {
    const p = visual.pos[visual.z[k]];
    parts += `<rect x="${ox + p.c * u}" y="${oy + p.r * u}" width="${2 * u}" height="${2 * u}" fill="#fff" stroke="#3f7f9e" stroke-width="2"/>`;
  }
  visual.spots.forEach((spot, index) => {
    parts += `<text x="${ox + spot.x * u}" y="${oy + spot.y * u + 6}" text-anchor="middle" font-size="17" font-weight="700" fill="#333">${visual.order[index]}</text>`;
  });
  return `<svg class="fold-stack-svg" viewBox="0 0 ${4 * u + 12} ${4 * u + 12}" role="img" aria-label="겹친 색종이 순서 문제">${parts}</svg>`;
}

function foldUnfoldChoiceMarkup(visual) {
  const { foldLine, foldArrow, clip } = foldGeometryHelpers();
  const size = 92;
  const square = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  let x = 6;
  const top = 6;
  let parts = `<polygon points="${square.map((p) => `${(x + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ")}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
  const seg1 = foldLine(square, visual.directions[0]);
  if (seg1) parts += `<line x1="${(x + seg1[0].x * size).toFixed(1)}" y1="${(top + seg1[0].y * size).toFixed(1)}" x2="${(x + seg1[1].x * size).toFixed(1)}" y2="${(top + seg1[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  const arrow1 = foldArrow(square, visual.directions[0]);
  if (arrow1) parts += foldArrowSvg(arrow1.from, arrow1.to, x, top, size);
  x += size + 10;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 42;

  const half = clip(square, { v: (p) => 0.5 - p.x, h: (p) => 0.5 - p.y, d1: (p) => p.x - p.y, d2: (p) => 1 - p.x - p.y }[visual.directions[0]]);
  parts += `<polygon points="${half.map((p) => `${(x + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ")}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
  const seg2 = foldLine(half, visual.directions[1]);
  if (seg2) parts += `<line x1="${(x + seg2[0].x * size).toFixed(1)}" y1="${(top + seg2[0].y * size).toFixed(1)}" x2="${(x + seg2[1].x * size).toFixed(1)}" y2="${(top + seg2[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  const arrow2 = foldArrow(half, visual.directions[1]);
  if (arrow2) parts += foldArrowSvg(arrow2.from, arrow2.to, x, top, size);
  x += size + 10;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 42;

  const quad = clip(half, { v: (p) => 0.5 - p.x, h: (p) => 0.5 - p.y, d1: (p) => p.x - p.y, d2: (p) => 1 - p.x - p.y }[visual.directions[1]]);
  parts += `<polygon points="${quad.map((p) => `${(x + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ")}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
  parts += `<polygon points="${visual.cut.map((p) => `${(x + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ")}" fill="#b03a5b"/>`;

  const stageSvg = `<svg class="fold-unfold-stage-svg" viewBox="0 0 ${x + size + 10} ${size + 16}" role="img" aria-label="색종이 접기 단계">${parts}</svg>`;

  const optionSvg = visual.options.map((opt, index) => {
    let optParts = `<polygon points="${square.map((p) => `${(6 + p.x * size).toFixed(1)},${(6 + p.y * size).toFixed(1)}`).join(" ")}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    optParts += `<line x1="${6 + size / 2}" y1="6" x2="${6 + size / 2}" y2="${6 + size}" stroke="#d4756c" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    optParts += `<line x1="6" y1="${6 + size / 2}" x2="${6 + size}" y2="${6 + size / 2}" stroke="#d4756c" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    for (const poly of opt.polygons) {
      optParts += `<polygon points="${poly.map((p) => `${(6 + p.x * size).toFixed(1)},${(6 + p.y * size).toFixed(1)}`).join(" ")}" fill="#fff"/>`;
    }
    return `<div class="fold-unfold-option"><svg viewBox="0 0 ${size + 12} ${size + 12}" role="img" aria-label="보기 ${"①②③④"[index]}">${optParts}</svg><b>${"①②③④"[index]}</b></div>`;
  }).join("");

  return `<div class="fold-unfold-choice-work">${stageSvg}<div class="fold-unfold-options">${optionSvg}</div></div>`;
}

function foldCutUnfoldDrawMarkup(visual) {
  const { foldLine, foldArrow } = foldGeometryHelpers();
  const size = 92;
  const top = 7;
  const polygonPoints = (polygon, shift) => polygon.map((point) => `${(shift + point.x * size).toFixed(1)},${(top + point.y * size).toFixed(1)}`).join(" ");
  if (visual.reveal) {
    let answer = `<rect x="7" y="${top}" width="${size}" height="${size}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    for (let line = 1; line < 4; line += 1) {
      answer += `<line x1="${7 + line * size / 4}" y1="${top}" x2="${7 + line * size / 4}" y2="${top + size}" stroke="#d6a09a" stroke-width="1" stroke-dasharray="4 3"/>`;
      answer += `<line x1="7" y1="${top + line * size / 4}" x2="${7 + size}" y2="${top + line * size / 4}" stroke="#d6a09a" stroke-width="1" stroke-dasharray="4 3"/>`;
    }
    for (const cut of visual.unfoldedCuts) answer += `<polygon points="${polygonPoints(cut, 7)}" fill="#fff" stroke="#b03a5b" stroke-width="1.4"/>`;
    return `<svg class="fold-cut-draw-svg" viewBox="0 0 ${size + 14} ${size + 14}" role="img" aria-label="색종이를 펼친 정답 그림">${answer}</svg>`;
  }

  let shift = 7;
  let parts = "";
  visual.stages.forEach((stage, index) => {
    parts += `<polygon points="${polygonPoints(stage.polygon, shift)}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    if (stage.fold) {
      const segment = foldLine(stage.polygon, stage.fold);
      if (segment) parts += `<line x1="${(shift + segment[0].x * size).toFixed(1)}" y1="${(top + segment[0].y * size).toFixed(1)}" x2="${(shift + segment[1].x * size).toFixed(1)}" y2="${(top + segment[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      const arrow = foldArrow(stage.polygon, stage.fold);
      if (arrow) parts += foldArrowSvg(arrow.from, arrow.to, shift, top, size);
    } else {
      parts += `<polygon points="${polygonPoints(visual.cut, shift)}" fill="#b03a5b"/>`;
    }
    if (index < visual.stages.length - 1) {
      shift += size + 10;
      parts += foldStepArrowSvg(shift, top + size / 2);
      shift += 42;
    }
  });
  shift += size + 10;
  parts += foldStepArrowSvg(shift, top + size / 2);
  shift += 42;
  parts += `<rect x="${shift}" y="${top}" width="${size}" height="${size}" fill="#fff" stroke="#7ba7bb" stroke-width="2"/>`;
  for (let line = 1; line < 4; line += 1) {
    parts += `<line x1="${shift + line * size / 4}" y1="${top}" x2="${shift + line * size / 4}" y2="${top + size}" stroke="#9fc2d2" stroke-width="1" stroke-dasharray="4 3"/>`;
    parts += `<line x1="${shift}" y1="${top + line * size / 4}" x2="${shift + size}" y2="${top + line * size / 4}" stroke="#9fc2d2" stroke-width="1" stroke-dasharray="4 3"/>`;
  }
  return `<svg class="fold-cut-draw-svg" viewBox="0 0 ${shift + size + 8} ${size + 14}" role="img" aria-label="색종이를 접어 자른 뒤 펼친 모양 그리기">${parts}</svg>`;
}

function foldTwoDiagonalGridMarkup(visual) {
  const { clip } = foldGeometryHelpers();
  const keep = {
    d1: (point) => point.x - point.y,
    d2: (point) => 1 - point.x - point.y
  };
  const square = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  const first = clip(square, keep[visual.directions[0]]);
  const folded = clip(first, keep[visual.directions[1]]);
  const size = 118;
  const top = 7;
  const points = (polygon, shift) => polygon.map((point) => `${(shift + point.x * size).toFixed(1)},${(top + point.y * size).toFixed(1)}`).join(" ");
  let shift = 7;
  let parts = `<rect x="${shift}" y="${top}" width="${size}" height="${size}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
  for (let row = 0; row < 4; row += 1) for (let column = 0; column < 4; column += 1) {
    const x = shift + column * size / 4;
    const y = top + row * size / 4;
    parts += `<rect x="${x}" y="${y}" width="${size / 4}" height="${size / 4}" fill="none" stroke="#d6a09a" stroke-width="1"/>`;
    parts += `<text x="${x + size / 8}" y="${y + size / 8 + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#333">${visual.grid[row][column]}</text>`;
  }
  const firstLine = visual.directions[0] === "d1" ? [0, 0, 1, 1] : [0, 1, 1, 0];
  parts += `<line x1="${shift + firstLine[0] * size}" y1="${top + firstLine[1] * size}" x2="${shift + firstLine[2] * size}" y2="${top + firstLine[3] * size}" stroke="#d4756c" stroke-width="2" stroke-dasharray="6 4"/>`;
  shift += size + 14;
  parts += foldStepArrowSvg(shift, top + size / 2);
  shift += 42;
  parts += `<polygon points="${points(first, shift)}" fill="#fbdad6" stroke="#e8968f" stroke-width="2"/>`;
  const secondLine = visual.directions[1] === "d1" ? [0, 0, 1, 1] : [0, 1, 1, 0];
  parts += `<line x1="${shift + secondLine[0] * size}" y1="${top + secondLine[1] * size}" x2="${shift + secondLine[2] * size}" y2="${top + secondLine[3] * size}" stroke="#d4756c" stroke-width="2" stroke-dasharray="6 4"/>`;
  shift += size + 14;
  parts += foldStepArrowSvg(shift, top + size / 2);
  shift += 42;
  parts += `<polygon points="${points(folded, shift)}" fill="#fbdad6" stroke="#e8968f" stroke-width="2"/>`;
  parts += `<circle cx="${shift + visual.target.x * size}" cy="${top + visual.target.y * size}" r="8" fill="#b03a5b"/>`;
  return `<svg class="fold-two-diagonal-svg" viewBox="0 0 ${shift + size + 8} ${size + 14}" role="img" aria-label="수가 쓰인 색종이를 대각선으로 두 번 접어 자르기">${parts}</svg>`;
}

function paperFoldMarkup(visual) {
  const SIZE = visual.stages.length > 3 ? 84 : 100;
  const GAP = 34;
  const KEEP = {
    v: (p) => 0.5 - p.x,
    h: (p) => 0.5 - p.y,
    vq: (p) => 0.25 - p.x,
    hq: (p) => 0.25 - p.y,
    d1: (p) => p.x - p.y,
    d2: (p) => 1 - p.x - p.y
  };
  const MIRROR = {
    v: (p) => ({ x: 1 - p.x, y: p.y }),
    h: (p) => ({ x: p.x, y: 1 - p.y }),
    vq: (p) => ({ x: 0.5 - p.x, y: p.y }),
    hq: (p) => ({ x: p.x, y: 0.5 - p.y }),
    d1: (p) => ({ x: p.y, y: p.x }),
    d2: (p) => ({ x: 1 - p.y, y: 1 - p.x })
  };
  // 접혀 넘어가는 쪽을 잘라내 그 무게중심을 잡는다. 화살표는 거기서 거울점으로 향한다.
  const clip = (polygon, keep) => {
    const out = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (da >= -1e-9) out.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    return out;
  };
  const foldLine = (polygon, fold) => {
    const keep = KEEP[fold];
    const points = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (Math.abs(da) < 1e-9) points.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        points.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    if (points.length < 2) return null;
    let best = null;
    let far = -1;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (d > far) { far = d; best = [points[i], points[j]]; }
      }
    }
    return far > 1e-6 ? best : null;
  };

  const width = visual.stages.length * SIZE + (visual.stages.length - 1) * GAP + 8;
  let offset = 4;
  const parts = visual.stages.map((stage, index) => {
    const shift = offset;
    offset += SIZE + GAP;
    const points = stage.polygon.map((p) => `${(shift + p.x * SIZE).toFixed(1)},${(4 + p.y * SIZE).toFixed(1)}`).join(" ");
    let piece = `<polygon points="${points}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    if (stage.fold) {
      const segment = foldLine(stage.polygon, stage.fold);
      if (segment) {
        piece += `<line x1="${(shift + segment[0].x * SIZE).toFixed(1)}" y1="${(4 + segment[0].y * SIZE).toFixed(1)}" x2="${(shift + segment[1].x * SIZE).toFixed(1)}" y2="${(4 + segment[1].y * SIZE).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      }
      // 접는 방향 화살표 — 어느 쪽이 어디로 넘어가는지 보여준다. 이게 없으면 접는 선만 보인다.
      const away = clip(stage.polygon, (p) => -KEEP[stage.fold](p));
      if (away.length >= 3) {
        const from = { x: away.reduce((t, p) => t + p.x, 0) / away.length, y: away.reduce((t, p) => t + p.y, 0) / away.length };
        const to = MIRROR[stage.fold](from);
        const sx = shift + from.x * SIZE;
        const sy = 4 + from.y * SIZE;
        const ex = shift + to.x * SIZE;
        const ey = 4 + to.y * SIZE;
        const nx = -(ey - sy);
        const ny = ex - sx;
        const length = Math.hypot(nx, ny) || 1;
        const bulge = Math.min(20, SIZE * 0.22);
        const cx = (sx + ex) / 2 + (nx / length) * bulge;
        const cy = (sy + ey) / 2 + (ny / length) * bulge;
        const angle = Math.atan2(ey - cy, ex - cx);
        const head = [
          `${(ex + 3 * Math.cos(angle)).toFixed(1)},${(ey + 3 * Math.sin(angle)).toFixed(1)}`,
          `${(ex - 9 * Math.cos(angle - 0.5)).toFixed(1)},${(ey - 9 * Math.sin(angle - 0.5)).toFixed(1)}`,
          `${(ex - 9 * Math.cos(angle + 0.5)).toFixed(1)},${(ey - 9 * Math.sin(angle + 0.5)).toFixed(1)}`
        ].join(" ");
        piece += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/><polygon points="${head}" fill="#c0392b"/>`;
      }
    } else {
      piece += visual.holes.map((hole) => `<circle cx="${(shift + hole.x * SIZE).toFixed(1)}" cy="${(4 + hole.y * SIZE).toFixed(1)}" r="6" fill="#fff" stroke="#c0392b" stroke-width="1.8"/>`).join("");
    }
    if (index < visual.stages.length - 1) {
      const ax = shift + SIZE + 8;
      const ay = 4 + SIZE / 2;
      piece += `<path d="M${ax} ${ay} H${ax + 16}" stroke="#95a5a6" stroke-width="2.5"/><path d="M${ax + 18} ${ay} l-7 -5 v10 z" fill="#95a5a6"/>`;
    }
    return piece;
  }).join("");

  return `<svg class="paper-fold-svg" viewBox="0 0 ${width} ${SIZE + 8}" role="img" aria-label="색종이 접기 문제">${parts}</svg>`;
}


// ── main 갈래에서 이식한 파이널 2·3회 시각자료 (2026-08-18) ──────────────

function magicSquareMarkup(visual) {
  const cards = visual.cards.map((value) => `<span>${value}</span>`).join("");
  const grid = visual.shown.flat()
    .map((value) => (value === null ? `<span class="ms-blank"></span>` : `<span>${value}</span>`)).join("");
  return `<div class="magic-square-work"><div class="number-balls">${cards}</div><div class="magic-square-grid">${grid}</div></div>`;
}

function sumGridMarkup(visual) {
  const columns = visual.cells[0].length;
  const cell = (item) => {
    if (item === null) return `<span class="sg-void"></span>`;
    if (item.t === "num") return `<span>${item.v}</span>`;
    if (item.t === "shape") return `<span class="sg-shape">${item.s}</span>`;
    return `<span class="sg-blank"></span>`;
  };
  const sum = (value) => (value === null || value === undefined
    ? `<b class="sg-void"></b>`
    : `<b>${value}</b>`);
  const rows = visual.cells.map((row, index) => (
    row.map(cell).join("") + sum(visual.rowSums[index])
  )).join("");
  const footer = visual.colSums.map(sum).join("") + `<b class="sg-void"></b>`;
  const cards = visual.cards
    ? `<div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div>`
    : "";
  return `<div class="sum-grid-work">${cards}<div class="sum-grid" style="--sg-cols:${columns + 1}">${rows}${footer}</div></div>`;
}

// 파이널 2회 16번 전용. 합을 표 바깥에 숫자로 적는 sum-grid와 달리, 원본은 합을 삼각형
// 안에 적고 삼각형이 자기가 가리키는 쪽 칸들을 뜻한다 — 위 삼각형은 그 아래 세로줄,
// 오른쪽 삼각형은 그 왼쪽 가로줄. 왼쪽 위처럼 칸이 비는 자리가 있으면 세로줄 삼각형은
// 그 줄에서 실제로 가장 위에 있는 칸 위에 앉는다(원본 그림이 그렇다).
function triangleSumGridMarkup(visual) {
  const S = 46;          // 칸 한 변
  const TH = 28;         // 위 삼각형 높이
  const TW = 30;         // 오른쪽 삼각형 너비
  const rowCount = visual.cells.length;
  const colCount = visual.cells[0].length;
  const X0 = 2;
  const Y0 = TH + 2;
  const width = X0 + colCount * S + TW + 4;
  const height = Y0 + rowCount * S + 4;
  const has = (r, c) => visual.cells[r] && visual.cells[r][c] !== null && visual.cells[r][c] !== undefined;

  let parts = "";
  for (let r = 0; r < rowCount; r += 1) {
    for (let c = 0; c < colCount; c += 1) {
      if (!has(r, c)) continue;
      const item = visual.cells[r][c];
      const x = X0 + c * S;
      const y = Y0 + r * S;
      parts += `<rect x="${x}" y="${y}" width="${S}" height="${S}" class="tsg-cell"/>`;
      if (item && item.t === "num") parts += `<text x="${x + S / 2}" y="${y + S / 2}" class="tsg-num">${item.v}</text>`;
    }
  }
  visual.colSums.forEach((value, c) => {
    if (value === null || value === undefined) return;
    let top = -1;
    for (let r = 0; r < rowCount; r += 1) if (has(r, c)) { top = r; break; }
    if (top < 0) return;
    const x = X0 + c * S;
    const y = Y0 + top * S;
    parts += `<polygon points="${x},${y} ${x + S},${y} ${x + S / 2},${y - TH}" class="tsg-tri"/>` +
      `<text x="${x + S / 2}" y="${y - TH * 0.32}" class="tsg-sum">${value}</text>`;
  });
  visual.rowSums.forEach((value, r) => {
    if (value === null || value === undefined) return;
    let last = -1;
    for (let c = 0; c < colCount; c += 1) if (has(r, c)) last = c;
    if (last < 0) return;
    const x = X0 + (last + 1) * S;
    const y = Y0 + r * S;
    parts += `<polygon points="${x},${y} ${x},${y + S} ${x + TW},${y + S / 2}" class="tsg-tri"/>` +
      `<text x="${x + TW * 0.34}" y="${y + S / 2}" class="tsg-sum">${value}</text>`;
  });

  return `<div class="triangle-sum-grid"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="삼각형 합 채우기">${parts}</svg></div>`;
}

function checkerSquareGrowthMarkup(visual) {
  const stage = (side) => {
    const cells = [];
    for (let r = 0; r < side; r += 1) {
      for (let c = 0; c < side; c += 1) cells.push(`<b class="${(r + c) % 2 === 0 ? "white" : "black"}"></b>`);
    }
    return `<div><i style="--side:${side}">${cells.join("")}</i><span>${side - 2}번째</span></div>`;
  };
  return `<div class="checker-growth">${visual.shown.map(stage).join("")}<strong>…</strong><em>${visual.target}번째</em></div>`;
}

function stoneTriangleRowsMarkup(visual) {
  const rows = Array.from({ length: visual.shown }, (_, index) => {
    const count = index + 1;
    const color = count % 2 === 1 ? "black" : "white";
    return `<div>${Array.from({ length: count }, () => `<b class="${color}"></b>`).join("")}<span>${count}번째 줄</span></div>`;
  });
  return `<div class="stone-triangle-rows">${rows.join("")}<strong>⋮</strong></div>`;
}

function statementListMarkup(visual) {
  return `<ul class="statement-list">${visual.items.map((text) => `<li>${text}</li>`).join("")}</ul>`;
}

function equalPartitionTreeMarkup(visual) {
  const box = (x, y, value = "") => `<rect x="${x - 29}" y="${y - 22}" width="58" height="44" rx="5"/><text x="${x}" y="${y + 7}">${value}</text>`;
  if (visual.parts === 4) {
    const leaves = [65, 155, 245, 335];
    return `<svg class="equal-partition-svg" viewBox="0 0 400 235" role="img" aria-label="${visual.top}을 반으로 가른 뒤 다시 반으로 가르는 수 가르기">
      <path d="M200 51V72M200 72L110 104M200 72L290 104M110 128V150M110 150L65 181M110 150L155 181M290 128V150M290 150L245 181M290 150L335 181"/>
      ${box(200, 30, visual.top)}${box(110, 106, visual.middle)}${box(290, 106, visual.middle)}${leaves.map((x) => box(x, 204)).join("")}
    </svg>`;
  }
  const xs = visual.parts === 2 ? [120, 280] : [70, 200, 330];
  return `<svg class="equal-partition-svg" viewBox="0 0 400 180" role="img" aria-label="${visual.top}을 ${visual.parts}부분으로 똑같이 가르는 수 가르기">
    ${xs.map((x) => `<path d="M200 51V70L${x} 126"/>`).join("")}
    ${box(200, 30, visual.top)}${xs.map((x) => box(x, 148)).join("")}
  </svg>`;
}

function balanceOrderChainMarkup(visual) {
  const scale = (row) => `<div class="balance-compare ${row.heavier}"><div class="balance-load">${row.left}</div><div class="balance-beam"><i></i></div><div class="balance-load">${row.right}</div></div>`;
  return `<div class="balance-order-work">${visual.relations.map(scale).join("")}</div>`;
}

const DIAGNOSTIC_ANIMAL_ASSETS = {
  토끼: "animal-rabbit.png", 거북: "animal-turtle.png", 다람쥐: "animal-squirrel.png",
  여우: "animal-fox.png", 사슴: "animal-deer.png", 오리: "animal-duck.png"
};

function diagnosticAnimalBalanceOrderMarkup(visual) {
  const load = (name) => `<div class="animal-balance-load"><img src="../mock/assets/${DIAGNOSTIC_ANIMAL_ASSETS[name]}" alt="${name}" /><strong>${name}</strong></div>`;
  const scale = (row, index) => `<figure class="animal-balance ${row.heavier}">${load(row.left)}<span class="animal-balance-beam"></span><span class="animal-balance-pivot"></span>${load(row.right)}<figcaption>[저울 ${index + 1}]</figcaption></figure>`;
  return `<div class="animal-balance-order-work">${visual.relations.map(scale).join("")}</div>`;
}

function balanceUnitEquationsMarkup(visual) {
  const side = (items) => `<div class="balance-equation-side">${items.map((item) => `<i>${item}</i>`).join("")}</div>`;
  return `<div class="balance-unit-work"><p>${visual.unit} = ${visual.unitGrams}g</p>${visual.equations.map((row) => `<div>${side(row.left)}<b>=</b>${side(row.right)}</div>`).join("")}</div>`;
}

function distinctShapeEquationsMarkup(visual) {
  const side = (items) => items.map((item) => `<i>${item}</i>`).join(`<b>+</b>`);
  return `<div class="distinct-shape-work"><div class="shape-number-range">${Array.from({ length: visual.limit }, (_, index) => `<span>${index + 1}</span>`).join("")}</div><div class="shape-equation-rows">${visual.rows.map((row) => `<p>${side(row.left)}<b>=</b>${side(row.right)}</p>`).join("")}</div><strong>${visual.target} = ?</strong></div>`;
}

function symbolPatternSequenceMarkup(visual) {
  const symbols = {
    circle: ["○", "●"], triangle: ["△", "▲"], square: ["□", "■"], diamond: ["◇", "◆"], star: ["☆", "★"]
  };
  const group = (item) => `<span class="symbol-pattern-group">${Array.from({ length: item.count }, () => `<i>${symbols[item.shape][item.filled ? 1 : 0]}</i>`).join("")}</span>`;
  return `<div class="symbol-pattern-work">${visual.items.map(group).join("")}<b>→</b><span class="symbol-pattern-target">?</span></div>`;
}

function progressiveNumberTableMarkup(visual) {
  return `<div class="progressive-table-work">${visual.stages.map((grid, stageIndex) => `<figure><div style="--table-cols:${grid[0].length}">${grid.flat().map((value) => `<span class="${value === null ? "blank" : ""}">${value ?? ""}</span>`).join("")}</div><figcaption>${stageIndex + 1}단계</figcaption></figure>`).join("<b>→</b>")}</div>`;
}

function matchstickGrowthStage(variant, count) {
  const unit = 28;
  const lines = [];
  if (variant === "square") {
    for (let index = 0; index < count; index += 1) {
      const x = index * unit + 3;
      lines.push(`<line x1="${x}" y1="5" x2="${x + unit}" y2="5"/><line x1="${x}" y1="33" x2="${x + unit}" y2="33"/>`);
    }
    for (let index = 0; index <= count; index += 1) {
      const x = index * unit + 3;
      lines.push(`<line x1="${x}" y1="5" x2="${x}" y2="33"/>`);
    }
  } else {
    for (let index = 0; index < count; index += 1) {
      const x = index * unit + 3;
      lines.push(`<line x1="${x}" y1="18" x2="${x}" y2="42"/><line x1="${x}" y1="42" x2="${x + unit}" y2="42"/><line x1="${x}" y1="18" x2="${x + unit / 2}" y2="3"/><line x1="${x + unit / 2}" y1="3" x2="${x + unit}" y2="18"/>`);
    }
    const end = count * unit + 3;
    lines.push(`<line x1="${end}" y1="18" x2="${end}" y2="42"/>`);
  }
  return `<svg class="growth-matchstick" viewBox="0 0 ${count * unit + 8} 47">${lines.join("")}</svg>`;
}

function triangleStoneStage(stage) {
  const side = stage + 2;
  const dots = [];
  for (let row = 0; row < side; row += 1) {
    dots.push(`<span>` + Array.from({ length: row + 1 }, (_, column) => `<i class="${row === side - 1 || column === 0 || column === row ? "black" : "white"}"></i>`).join("") + `</span>`);
  }
  return `<div class="growth-triangle-stones">${dots.join("")}</div>`;
}

function squareStoneStage(stage) {
  const side = stage + 1;
  return `<div class="growth-square-stones" style="--stone-side:${side}">${Array.from({ length: side * side }, (_, index) => {
    const row = Math.floor(index / side);
    const column = index % side;
    return `<i class="${row === 0 || row === side - 1 || column === 0 || column === side - 1 ? "black" : "white"}"></i>`;
  }).join("")}</div>`;
}

function staircaseStage(stage) {
  return `<div class="growth-staircase">${Array.from({ length: stage }, (_, row) => `<span>${Array.from({ length: stage - row }, () => "<i></i>").join("")}</span>`).join("")}</div>`;
}

function foldCutStage(stage, punch = false) {
  const pieces = 2 ** stage;
  return `<div class="growth-fold-paper" style="--fold-pieces:${pieces};--fold-width:${Math.max(30, 82 - stage * 14)}px">${Array.from({ length: Math.min(pieces, 8) }, () => `<i>${punch ? "•" : ""}</i>`).join("")}</div>`;
}

function coloredTriangleStage(stage) {
  return `<div class="growth-colored-triangle">${Array.from({ length: stage }, (_, row) => `<span>${Array.from({ length: row + 1 }, (_, column) => `${column ? "<i class=\"white\">▽</i>" : ""}<i>▲</i>`).join("")}</span>`).join("")}</div>`;
}

function nestedCircleStage(stage) {
  return `<div class="growth-nested-circles">${Array.from({ length: stage }, (_, row) => `<span>${Array.from({ length: row + 1 }, () => "<i></i>").join("")}</span>`).join("")}</div>`;
}

function segmentGrowthStage(stage) {
  const lines = [];
  for (let row = 0; row < stage; row += 1) {
    for (let column = 0; column <= row; column += 1) {
      const x = 50 + (column - row / 2) * 20;
      const y = 8 + row * 17;
      const direction = (row + column) % 3;
      const dx = direction === 0 ? 0 : direction === 1 ? -8 : 8;
      lines.push(`<line x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + 14}"/>`);
    }
  }
  return `<svg class="growth-segments" viewBox="0 0 100 ${stage * 17 + 12}">${lines.join("")}</svg>`;
}

function book2GrowthMarkup(visual) {
  const stageMarkup = (stage) => {
    if (visual.subtype === "matchstick") return matchstickGrowthStage(visual.variant, stage);
    if (visual.subtype === "triangle-stones") return triangleStoneStage(stage);
    if (visual.subtype === "square-stones") return squareStoneStage(stage);
    if (visual.subtype === "staircase") return staircaseStage(stage);
    if (visual.subtype === "fold-cut") return foldCutStage(stage, false);
    if (visual.subtype === "colored-triangle") return coloredTriangleStage(stage);
    if (visual.subtype === "nested-circles") return nestedCircleStage(stage);
    if (visual.subtype === "segments") return segmentGrowthStage(stage);
    if (visual.subtype === "fold-punch") return foldCutStage(stage, stage === Math.max(...visual.stages));
    return "";
  };
  return `<div class="book2-growth-work">${visual.stages.map((stage) => `<figure>${stageMarkup(stage)}<figcaption>${stage + (visual.subtype.startsWith("fold-") ? "번 접음" : "번째")}</figcaption></figure>`).join("<b>→</b>")}<strong>…<br>${visual.target}${visual.subtype.startsWith("fold-") ? "번" : "번째"}</strong></div>`;
}

function centerNumberRuleMarkup(visual) {
  return `<div class="center-rule-work">${visual.items.map((item, index) => `<figure><div class="center-rule-cluster"><span class="top">${item.outer[0]}</span><span class="right">${item.outer[1]}</span><span class="bottom">${item.outer[2]}</span><span class="left">${item.outer[3]}</span><strong>${item.hidden ? "㉠" : item.center}</strong></div><figcaption>${index + 1}</figcaption></figure>`).join("")}</div>`;
}

function numberRuleGridMarkup(visual) {
  return `<div class="number-rule-grid">${visual.rows.flat().map((value) => `<span class="${value === null ? "blank" : ""}">${value ?? "㉠"}</span>`).join("")}</div>`;
}

function twoDigitComposeRuleMarkup(visual) {
  const digit = (number, index, itemIndex, field) => {
    const hidden = visual.hidden.item === itemIndex && visual.hidden.field === field && visual.hidden.digit === index;
    return `<i class="${hidden ? "blank" : ""}">${hidden ? "㉠" : String(number).padStart(2, "0")[index]}</i>`;
  };
  return `<div class="compose-rule-work">${visual.items.map((item, itemIndex) => {
    const resultHidden = visual.hidden.item === itemIndex && visual.hidden.field === "result";
    return `<figure><div class="compose-pair"><p>${digit(item.first, 0, itemIndex, "first")}${digit(item.first, 1, itemIndex, "first")}</p><b>${visual.operation === "add" ? "+" : "−"}</b><p>${digit(item.second, 0, itemIndex, "second")}${digit(item.second, 1, itemIndex, "second")}</p><strong>${resultHidden ? "㉠" : item.result}</strong></div><figcaption>${itemIndex + 1}</figcaption></figure>`;
  }).join("")}</div>`;
}

function sudokuGridMarkup(visual) {
  const { size, grid, regions, target } = visual;
  const cellStyle = (row, column) => {
    if (!regions) return "";
    const region = regions[row][column];
    const top = row === 0 || regions[row - 1][column] !== region ? 3 : 1;
    const right = column === size - 1 || regions[row][column + 1] !== region ? 3 : 1;
    const bottom = row === size - 1 || regions[row + 1][column] !== region ? 3 : 1;
    const left = column === 0 || regions[row][column - 1] !== region ? 3 : 1;
    return `border-width:${top}px ${right}px ${bottom}px ${left}px`;
  };
  return `<div class="sudoku-work"><div class="sudoku-grid" style="--sudoku-size:${size}">${grid.flatMap((row, rowIndex) => row.map((value, column) => {
    const marked = target[0] === rowIndex && target[1] === column;
    return `<span class="${marked ? "target" : value ? "given" : "empty"}" style="${cellStyle(rowIndex, column)}">${marked ? "㉠" : value || ""}</span>`;
  })).join("")}</div><p>1부터 ${size}까지 한 번씩</p></div>`;
}

function triangleEdgeSumMarkup(visual) {
  // 꼭짓점 3 + 변 가운데 3. 자리 번호는 생성기와 같다(0·1·2 꼭짓점, 3·4·5 변 가운데).
  const W = 300, H = 260, r = 21;
  const P = [
    { x: W / 2, y: 26 },          // 0 위 꼭짓점
    { x: 34, y: H - 26 },         // 1 왼쪽 아래
    { x: W - 34, y: H - 26 },     // 2 오른쪽 아래
  ];
  P[3] = { x: (P[0].x + P[1].x) / 2, y: (P[0].y + P[1].y) / 2 };
  P[4] = { x: (P[1].x + P[2].x) / 2, y: (P[1].y + P[2].y) / 2 };
  P[5] = { x: (P[2].x + P[0].x) / 2, y: (P[2].y + P[0].y) / 2 };
  const givenMap = new Map((visual.given || []).map((g) => [g.slot, g.value]));
  const edges = [[0, 1], [1, 2], [2, 0]].map(([a, b]) =>
    `<line x1="${P[a].x}" y1="${P[a].y}" x2="${P[b].x}" y2="${P[b].y}" />`).join("");
  const slots = P.map((p, i) => {
    const v = givenMap.get(i);
    return `<circle cx="${p.x}" cy="${p.y}" r="${r}" class="${v == null ? "tes-blank" : "tes-given"}" />` +
      (v == null ? "" : `<text x="${p.x}" y="${p.y + 6}" text-anchor="middle">${v}</text>`);
  }).join("");
  const cards = `<div class="tes-cards">${visual.numbers.map((n) => `<span>${n}</span>`).join("")}</div>`;
  return `<div class="triangle-edge-sum">${cards}<svg class="tes-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="삼각형 여섯 자리에 수 놓기">${edges}${slots}</svg></div>`;
}


// ── main 갈래에서 이식: 파이널 2·3회 시각자료 (2026-08-18) ──────────────

function symbolChainMarkup(visual) {
  const symbols = { square: "□", circle: "○", doubleCircle: "◎", heart: "♥", club: "♣", diamond: "◆", star: "★", triangle: "▲" };
  const token = (value) => symbols[value]
    ? `<span class="chain-symbol ${value}">${symbols[value]}</span>`
    : `<span class="chain-token">${value}</span>`;
  const givens = Object.entries(visual.given).map(([key, value]) => `${token(key)}<b>=</b><strong>${value}</strong>`).join("");
  return `<div class="symbol-chain"><div class="symbol-chain-given">${givens}</div><div class="symbol-chain-board">${visual.rows.map((row) => `<p>${row.map(token).join("")}</p>`).join("")}</div></div>`;
}

function alignedRodLengthsMarkup(visual) {
  const rows = visual.rows.map((row) => `<div class="aligned-rod-row">${row.map((part) => `<span style="--rod-part:${part.length}" title="막대 ${part.label}">${part.label}</span>`).join("")}</div>`).join("");
  return `<div class="aligned-rods"><div class="aligned-rod-board">${rows}</div><p><b>${visual.knownLabel}</b> 막대 = ${visual.knownLength}cm${visual.showTotal ? ` · 전체 ${visual.total}cm` : ""}</p></div>`;
}

function twoFunctionMachinesMarkup(visual) {
  const examples = (items, shape) => `<div class="function-example-list">${items.map(({ input, output }) => `<p><span class="function-shape ${shape}">${input}</span><b>→</b><strong>${output}</strong></p>`).join("")}</div>`;
  return `<div class="two-function-machines"><section><header>동그라미 규칙</header>${examples(visual.firstExamples, "circle")}${visual.firstHint ? `<small>${visual.firstHint}</small>` : ""}</section><section><header>네모 규칙</header>${examples(visual.secondExamples, "square")}${visual.secondHint ? `<small>${visual.secondHint}</small>` : ""}</section><div class="function-target"><span class="function-shape circle">${visual.targetInput}</span><b>→</b><span class="function-shape square blank">?</span><b>→</b><span class="function-result blank">?</span></div></div>`;
}

function unusedCardEquationsMarkup(visual) {
  const cards = `<div class="number-cards compact">${visual.cards.map((value) => `<span class="number-card">${value}</span>`).join("")}</div>`;
  const equations = `<div class="unused-card-equations">${visual.targets.map((target) => `<p><i></i><b>+</b><i></i><b>=</b><strong>${target}</strong></p>`).join("")}</div>`;
  return `<div class="unused-card-work">${cards}${equations}</div>`;
}

function recorderMatchstickLengthMarkup(visual) {
  const segment = (item) => item.kind === "match"
    ? `<i class="measure-match" style="--measure-span:${item.units}" aria-label="성냥개비"></i>`
    : `<i class="measure-pencil" style="--measure-span:${item.units}" aria-label="연필"></i>`;
  const rows = visual.rows.map((row) => `<div class="measure-row" style="--measure-columns:${visual.totalUnits}">${row.map(segment).join("")}</div>`).join("");
  return `<div class="recorder-measure"><div class="recorder-shape" aria-label="리코더"><i></i><span></span></div>${rows}</div>`;
}

const transformOperationLabels = {
  "flip-lr": ["↔", "오른쪽으로 뒤집기"],
  "flip-tb": ["↕", "아래로 뒤집기"],
  "rotate-cw": ["↻", "오른쪽으로 1/4바퀴"],
  "rotate-ccw": ["↺", "왼쪽으로 1/4바퀴"]
};

function shapeTransformGridSvg(grid, blank = false) {
  const cells = Array.from({ length: 4 }, (_, index) => {
    const row = Math.floor(index / 2);
    const column = index % 2;
    const x = 8 + column * 72;
    const y = 8 + row * 72;
    if (blank) return `<rect x="${x}" y="${y}" width="72" height="72"/>`;
    const cell = grid[index];
    const cx = x + 36;
    const cy = y + 36;
    const shape = matrixShapeSvg(cell.shape, cx, cy, 31, cell.shape === "circle" ? "#f8e8e6" : "#fff", "#4b5d68", 2.5);
    return `<rect x="${x}" y="${y}" width="72" height="72"/><g transform="rotate(${(cell.direction || 0) * 90} ${cx} ${cy})">${shape}</g>`;
  }).join("");
  return `<svg class="shape-transform-grid" viewBox="0 0 160 160" role="img" aria-label="네 칸 도형 배치"><g>${cells}</g></svg>`;
}

function shapeTransformGridMarkup(visual) {
  if (visual.answerOnly) return `<div class="shape-transform-answer">${shapeTransformGridSvg(visual.final)}</div>`;
  const operations = visual.operations.map((operation) => {
    const [symbol, label] = transformOperationLabels[operation];
    return `<div class="shape-transform-operation"><b>${symbol}</b><span>${label}</span></div>`;
  }).join("");
  return `<div class="shape-transform-work">${shapeTransformGridSvg(visual.start)}<div class="shape-transform-operations">${operations}</div><b class="shape-transform-arrow">→</b>${shapeTransformGridSvg(null, true)}</div>`;
}

function cubeAddToMatchMarkup(visual) {
  const renderer = globalThis.GW_RENDER;
  if (!renderer?.renderIso) return "";
  const actual = renderer.renderIso(visual.map, visual.width, visual.depth, { u: 22 });
  const full = renderer.renderIso(visual.fullMap, visual.width, visual.depth, { u: 22 });
  return `<div class="cube-add-match"><figure><div>${actual}</div><figcaption>현재 모양</figcaption></figure><b>→</b><figure><div>${full}</div><figcaption>완성 모양</figcaption></figure></div>`;
}

function overlappingRunSequenceMarkup(visual) {
  return `<div class="overlapping-run-sequence">${visual.items.map((value) => value === null ? "<i>?</i>" : `<span>${value}</span>`).join("<b>,</b>")}<strong>…</strong></div>`;
}

function alternatingPeopleMarkup(visual) {
  return `<div class="alternating-people" aria-label="남학생과 여학생이 번갈아 선 모습">${visual.line.map((kind) => `<i class="${kind}"><b>${kind === "boy" ? "남" : "여"}</b></i>`).join("")}</div>`;
}

function matrixShapeSvg(shape, cx, cy, size, fill = "none", stroke = "#596a73", width = 2) {
  if (shape === "circle") return `<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  if (shape === "square") return `<rect x="${cx - size / 2}" y="${cy - size / 2}" width="${size}" height="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  if (shape === "diamond") return `<polygon points="${cx},${cy - size * 0.62} ${cx + size * 0.62},${cy} ${cx},${cy + size * 0.62} ${cx - size * 0.62},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const top = cy - size * 0.58;
  const bottom = cy + size * 0.46;
  return `<polygon points="${cx},${top} ${cx - size * 0.58},${bottom} ${cx + size * 0.58},${bottom}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
}

function shapeMatrixThreeMarkup(visual) {
  const cellSize = 76;
  const figures = visual.cells.map((cell) => {
    const cx = cell.column * cellSize + cellSize / 2;
    const cy = cell.row * cellSize + cellSize / 2;
    if (cell.missing && !cell.hintOuter) return "";
    if (cell.missing) return `${matrixShapeSvg(cell.outer, cx, cy, 47, "none", "#b6c3c9", 2)}<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="19" font-weight="800" fill="#8da0aa">?</text>`;
    const fill = cell.fill === "gray" ? "#b8bdc1" : cell.fill === "hatch" ? "url(#matrix-hatch)" : "#fff";
    return `${matrixShapeSvg(cell.outer, cx, cy, 48, "#fff")}${matrixShapeSvg(cell.inner, cx, cy, 30, fill)}`;
  }).join("");
  const lines = Array.from({ length: 4 }, (_, index) => `<line x1="${index * cellSize}" y1="0" x2="${index * cellSize}" y2="${cellSize * 3}"/><line x1="0" y1="${index * cellSize}" x2="${cellSize * 3}" y2="${index * cellSize}"/>`).join("");
  return `<svg class="shape-matrix-three" viewBox="0 0 ${cellSize * 3} ${cellSize * 3}" role="img" aria-label="도형 규칙 3 곱하기 3 표"><defs><pattern id="matrix-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#71818a" stroke-width="2"/></pattern></defs><g class="matrix-grid">${lines}</g>${figures}</svg>`;
}

function triangleCycleSvg(position = null) {
  const points = {
    top: "50,5 27.5,45 72.5,45",
    "bottom-left": "5,85 27.5,45 50,85",
    "bottom-right": "95,85 72.5,45 50,85",
    center: "27.5,45 72.5,45 50,85"
  };
  const fill = position ? `<polygon points="${points[position]}" fill="#8dd7ef"/>` : "";
  return `<svg viewBox="0 0 100 90" role="img" aria-label="${position ? "한 칸이 칠해진" : "빈"} 삼각형">${fill}<path d="M50 5L5 85H95Z M27.5 45H72.5 M27.5 45L50 85 M72.5 45L50 85" fill="none" stroke="#65b6ce" stroke-width="2"/></svg>`;
}

function trianglePositionCycleMarkup(visual) {
  const shown = visual.sequence.map((position, index) => `<figure>${triangleCycleSvg(position)}<figcaption>${index + 1}번째</figcaption></figure>`).join("");
  return `<div class="triangle-cycle">${shown}<b aria-hidden="true">…</b><figure class="target">${triangleCycleSvg()}<figcaption>${visual.target}번째</figcaption></figure></div>`;
}

function overlapBondsMarkup(visual) {
  const count = visual.shownParts.length;
  const width = count * 78;
  const partX = (index) => 39 + index * 78;
  const bonds = visual.totals.map((total, index) => {
    const x = (partX(index) + partX(index + 1)) / 2;
    return `<path d="M${x} 34V52 M${x} 62L${partX(index)} 88 M${x} 62L${partX(index + 1)} 88"/><rect class="total" x="${x - 16}" y="4" width="32" height="30"/><text x="${x}" y="24">${total}</text><rect class="junction" x="${x - 12}" y="50" width="24" height="24"/>`;
  }).join("");
  const parts = visual.shownParts.map((value, index) => {
    const label = value === "star" ? "☆" : value === "blank" ? "?" : value;
    const shared = visual.highlightShared && index === 1 ? " shared" : "";
    return `<rect class="part${shared}" x="${partX(index) - 16}" y="87" width="32" height="30"/><text x="${partX(index)}" y="108">${label}</text>`;
  }).join("");
  return `<svg class="overlap-bonds" viewBox="0 0 ${width} 124" role="img" aria-label="서로 이어진 가르기 모으기">${bonds}${parts}</svg>`;
}

function geometryWorksheetMarkup(visual) {
  const renderer = globalThis.GW_RENDER;
  const card = globalThis.GW_CARD;
  const problem = visual.problem || { figures: visual.figures };
  const figures = problem.figures;
  if (!renderer || !figures) return "";
  if (card?.renderFigures) {
    const method = problem.methodHint ? `<p class="geometry-method">${problem.methodHint}</p>` : "";
    const solveArea = problem.type === "HL"
      ? `<div class="geometry-hole-solve">${renderer.renderHoleLayers(problem, { blank: true })}</div>`
      : "";
    return `${method}<div class="ws-figures">${card.renderFigures(problem)}</div>${solveArea}`;
  }
  if (figures.kind === "sequence") {
    return `<div class="geometry-sequence">${figures.shapes.map((shape) => `
      <figure><div>${renderer.renderIso(shape.map, shape.width, shape.depth)}</div><figcaption>${shape.n}단계</figcaption></figure>
    `).join("")}<strong aria-hidden="true">…</strong></div>`;
  }
  if (figures.kind === "iso-box") {
    return `<figure class="geometry-box"><div>${renderer.renderIsoBox(figures.map, figures.width, figures.depth, figures.boxH)}</div><figcaption>점선은 상자 테두리입니다.</figcaption></figure>`;
  }
  if (figures.kind === "iso-walled") {
    return `<figure class="geometry-hidden"><div>${renderer.renderIsoWalled(figures.map, figures.width, figures.depth)}</div><figcaption>뒤와 왼쪽의 회색 면은 벽입니다.</figcaption></figure>`;
  }
  return "";
}

function geometryWorksheetAnswerMarkup(visual) {
  const renderer = globalThis.GW_RENDER;
  const problem = visual.problem;
  if (!renderer || !problem) return "";
  const answer = problem.answer || {};
  const figure = (label, svg) => `<figure><figcaption>${label}</figcaption>${svg}</figure>`;
  if (problem.type === "TC") {
    return `<div class="geometry-answer-row">${figure("앞", renderer.renderMiniFilled(answer.front))}${figure("오른쪽 옆", renderer.renderMiniFilled(answer.side))}</div>`;
  }
  if (problem.type === "VC") {
    return figure("위에서 본 모양에 쓴 수", renderer.renderSolveTable(
      problem.figures.footprint,
      problem.figures.width,
      problem.figures.depth,
      { numbers: answer.numbers, colMax: answer.colMax, rowMax: answer.rowMax }
    ));
  }
  if (problem.type === "VM") {
    const maximum = figure("가장 많이 놓은 경우", renderer.renderSolveTable(
      problem.figures.footprint,
      problem.figures.width,
      problem.figures.depth,
      { numbers: answer.numbers, colMax: answer.colMax, rowMax: answer.rowMax }
    ));
    const minimum = figure("가장 적게 놓은 경우", renderer.renderSolveTable(
      problem.figures.footprint,
      problem.figures.width,
      problem.figures.depth,
      { numbers: answer.minNumbers, colMax: answer.colMax, rowMax: answer.rowMax }
    ));
    return `<div class="geometry-answer-row geometry-answer-minmax">${maximum}${minimum}</div>`;
  }
  if (problem.type === "VP") return figure(answer.hiddenLabel, renderer.renderMiniFilled(answer.hidden, 18));
  if (problem.type === "HL") return renderer.renderHoleLayers(problem);
  return "";
}

function cellShapeMarkup(visual) {
  const unit = 30;
  const minR = Math.min(...visual.cells.map((cell) => cell[0]));
  const minC = Math.min(...visual.cells.map((cell) => cell[1]));
  const maxR = Math.max(...visual.cells.map((cell) => cell[0]));
  const maxC = Math.max(...visual.cells.map((cell) => cell[1]));
  const width = unit * (maxC - minC + 1) + 2;
  const height = unit * (maxR - minR + 1) + 2;
  const squares = visual.cells.map(([r, c]) => `<rect x="${1 + unit * (c - minC)}" y="${1 + unit * (r - minR)}" width="${unit}" height="${unit}" />`).join("");
  return `<svg class="cell-shape-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="칸을 붙여 만든 도형">${squares}</svg>`;
}

function repeatShapeAnswerMarkup(visual) {
  const symbols = { "동그라미": "○", "세모": "△", "네모": "□", "마름모": "◇", "별": "☆" };
  return `<div class="repeat-shape-answer" role="img" aria-label="정답 ${visual.item}">${symbols[visual.item] || "○"}</div>`;
}

function numberSequencesMarkup(visual) {
  return `<div class="number-sequences">${visual.rows.map((row, index) => `<div><b>(${index + 1})</b>${row.items.map((value) => `<span${value === null ? ' class="blank"' : ""}>${value === null ? "" : value}</span>`).join("")}</div>`).join("")}</div>`;
}

function heightExtremesMarkup(visual) {
  return `<div class="height-extremes-work"><div class="height-name-row">${visual.names.map((name) => `<span>${name}</span>`).join("")}</div><ul>${visual.clues.map((clue) => `<li>${clue}</li>`).join("")}</ul></div>`;
}

function diagnosticPartWholeBarMarkup(visual) {
  const parts = visual.parts.map((value, index) => `<span style="--part-width:${visual.widths[index]}"><b>${value === null ? "?" : value}</b></span>`).join("");
  return `<div class="diagnostic-part-whole"><div class="whole"><small>전체</small><b>${visual.total}</b></div><div class="parts">${parts}</div></div>`;
}

function diagnosticNumberDiscMarkup(disc, label) {
  const positions = [[55, 55], [115, 55], [55, 112], [115, 112]];
  const values = disc.outer.map((value, index) => `<text class="${disc.blankIndex === index ? "blank" : ""}" x="${positions[index][0]}" y="${positions[index][1]}">${disc.blankIndex === index ? "?" : value}</text>`).join("");
  return `<div class="diagnostic-disc"><svg viewBox="0 0 170 165" role="img" aria-label="바깥 네 수와 가운데 수의 관계 원판"><circle class="outer" cx="85" cy="82" r="66"/><circle class="inner" cx="85" cy="82" r="28"/><path d="M85 16V54M85 110V148M19 82H57M113 82H151"/>${values}<text class="center" x="85" y="89">${disc.center}</text></svg><b>${label}</b></div>`;
}

function diagnosticNumberRelationMarkup(visual) {
  const examples = visual.examples.map((disc, index) => diagnosticNumberDiscMarkup(disc, visual.examples.length === 1 ? "보기" : `보기 ${index + 1}`)).join("");
  const targets = visual.targets.map((disc, index) => diagnosticNumberDiscMarkup(disc, visual.targets.length === 1 ? "문제" : `문제 ${index + 1}`)).join("");
  return `<div class="diagnostic-number-relation"><div>${examples}${targets}</div>${visual.showHint ? "<p>힌트: 바깥 네 수를 모두 더해 보세요.</p>" : ""}</div>`;
}

function cubeDifferentShapeMarkup(visual) {
  const labels = ["①", "②", "③", "④", "⑤", "⑥"];
  return `<div class="cube-different-shape-work">${visual.options.map((coords, index) => `<figure>${globalThis.GW_RENDER?.renderIsoCoords(coords, { u: 24 }) || ""}<figcaption>${labels[index]}</figcaption></figure>`).join("")}</div>`;
}

function maskedAdditionNumberMarkup(value, hiddenIndexes = []) {
  const hidden = new Set(hiddenIndexes);
  return [...String(value)].map((digit, index) => hidden.has(index)
    ? '<i class="masked-digit" aria-label="가려진 숫자"></i>'
    : `<b>${digit}</b>`).join("");
}

function maskedVerticalAdditionsMarkup(visual) {
  const labels = ["①", "②", "③"];
  return `<div class="masked-vertical-additions-work">${visual.equations.map((equation, index) => `<figure><figcaption>${labels[index]}</figcaption><div class="masked-vertical-equation"><div class="top"><span></span><p>${maskedAdditionNumberMarkup(equation.top, equation.hidden.top)}</p></div><div class="bottom"><span>+</span><p>${maskedAdditionNumberMarkup(equation.bottom, equation.hidden.bottom)}</p></div><hr><div class="result"><span></span><p>${maskedAdditionNumberMarkup(equation.result, equation.hidden.result)}</p></div></div></figure>`).join("")}</div>`;
}

function givenShapeExpressionMarkup(visual) {
  const values = visual.entries.map((entry) => `<span><i>${entry.symbol}</i><b>=</b><strong>${entry.value}</strong></span>`).join("");
  const expression = visual.terms.map((term, index) => `${index ? `<b>${term.operator}</b>` : ""}<i>${term.symbol}</i>`).join("");
  return `<div class="given-shape-expression-work"><div class="given-shape-values">${values}</div><div class="given-shape-calculation">${expression}<b>=</b><em>?</em></div></div>`;
}

function pairedGrowingSequencesMarkup(visual) {
  const labels = ["①", "②"];
  return `<div class="paired-growing-sequences-work">${visual.rows.map((row, rowIndex) => `<div><b>${labels[rowIndex]}</b><p style="--sequence-count:${row.items.length}">${row.items.map((value) => `<span class="${value === null ? "blank" : ""}">${value === null ? "" : value}</span>`).join("")}</p></div>`).join("")}</div>`;
}

function triangleFanCountMarkup(visual) {
  const apexX = 180;
  const apexY = 22;
  const baseY = 205;
  const baseHalf = 145;
  const rays = Array.from({ length: visual.rayCount }, (_, index) => {
    const x = apexX - baseHalf + (baseHalf * 2 * index) / (visual.rayCount - 1);
    return `<line x1="${apexX}" y1="${apexY}" x2="${x}" y2="${baseY}"/>`;
  }).join("");
  const horizontals = visual.horizontalFractions.map((fraction) => {
    const y = apexY + (baseY - apexY) * fraction;
    const halfWidth = baseHalf * fraction;
    return `<line x1="${apexX - halfWidth}" y1="${y}" x2="${apexX + halfWidth}" y2="${y}"/>`;
  }).join("");
  return `<svg class="triangle-fan-count" viewBox="0 0 360 230" role="img" aria-label="꼭짓점에서 여러 선과 가로선으로 나뉜 삼각형"><g>${rays}${horizontals}<line x1="${apexX - baseHalf}" y1="${baseY}" x2="${apexX + baseHalf}" y2="${baseY}"/></g></svg>`;
}

function reverseOperationLadderMarkup(visual) {
  const topY = 50;
  const bottomY = 210;
  const leftX = visual.columnCount === 3 ? 80 : 48;
  const rightX = visual.columnCount === 3 ? 280 : 312;
  const xs = Array.from({ length: visual.columnCount }, (_, index) => leftX + ((rightX - leftX) * index) / (visual.columnCount - 1));
  const rails = xs.map((x, index) => `<line class="rail" x1="${x}" y1="${topY}" x2="${x}" y2="${bottomY}"/><rect class="top-blank" x="${x - 20}" y="7" width="40" height="35" rx="4"/><circle class="bottom-value" cx="${x}" cy="232" r="19"/><text class="bottom-text" x="${x}" y="237">${visual.bottomValues[index]}</text>`).join("");
  const rungs = visual.rungs.map((rung) => {
    const x1 = xs[rung.left];
    const x2 = xs[rung.right];
    const y1 = topY + (bottomY - topY) * rung.leftY;
    const y2 = topY + (bottomY - topY) * rung.rightY;
    const labelX = (x1 + x2) / 2;
    const labelY = (y1 + y2) / 2 - 7;
    return `<line class="rung" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text class="operation-label" x="${labelX}" y="${labelY}">${rung.label}</text>`;
  }).join("");
  return `<svg class="reverse-operation-ladder" viewBox="0 0 360 258" role="img" aria-label="계산이 표시된 사다리 타기">${rails}${rungs}</svg>`;
}

function plusMinusExpressionMarkup(numbers, operators, target, blankOperators = false) {
  const terms = numbers.slice(1).map((value, index) => `${blankOperators ? '<i class="operator-blank" aria-label="연산 기호 빈칸"></i>' : `<b>${operators[index]}</b>`}<span>${value}</span>`).join("");
  return `<p><span>${numbers[0]}</span>${terms}<em>=</em><strong>${target}</strong></p>`;
}

function plusMinusMultiTargetMarkup(visual) {
  const labels = ["①", "②", "③", "④"];
  const exampleOperators = Array(visual.numbers.length - 1).fill("+");
  const rows = visual.rows.map((row, index) => `<figure><figcaption>${labels[index]}</figcaption>${plusMinusExpressionMarkup(visual.numbers, row.operators, row.target, true)}</figure>`).join("");
  return `<div class="plus-minus-multi-target-work"><div class="plus-minus-example"><small>보기</small>${plusMinusExpressionMarkup(visual.numbers, exampleOperators, visual.exampleResult)}</div><div class="plus-minus-targets">${rows}</div></div>`;
}

function twoCustomOperationsMarkup(visual) {
  const labels = ["①", "②"];
  const definitions = visual.definitions.map((definition) => `<p><span>가</span><b>${definition.symbol}</b><span>나</span><em>=</em><strong>${definition.expression}</strong></p>`).join("");
  const queries = visual.queries.map((query, index) => `<p><small>${labels[index]}</small><span>${query.left}</span><b>${query.symbol}</b><span>${query.right}</span><em>=</em><i aria-label="답을 쓰는 빈칸"></i></p>`).join("");
  return `<div class="two-custom-operations-work"><div class="custom-operation-definitions">${definitions}</div><div class="custom-operation-queries">${queries}</div></div>`;
}

function visualMarkup(visual) {
  if (!visual) return "";
  if (visual.kind.startsWith("mock6-")) return `<div class="visual mock06-visual">${mock06Markup(visual)}</div>`;
  if (visual.kind === "book1") return `<div class="visual book01-visual">${book01Markup(visual)}</div>`;
  if (visual.kind === "book3") return `<div class="visual book03-visual">${book03Markup(visual)}</div>`;
  if (visual.kind === "book4") return `<div class="visual book04-visual">${book04Markup(visual)}</div>`;
  if (visual.kind === "book5") return `<div class="visual book05-visual">${book05Markup(visual)}</div>`;
  if (visual.kind === "book6") return `<div class="visual book06-visual">${book06Markup(visual)}</div>`;
  if (visual.kind === "book7") return `<div class="visual book07-visual">${book07Markup(visual)}</div>`;
  if (visual.kind === "book8") return `<div class="visual book08-visual">${book08Markup(visual)}</div>`;
  if (visual.kind === "book9") return `<div class="visual book09-visual">${book09Markup(visual)}</div>`;
  if (visual.kind === "book10") return `<div class="visual book10-visual">${book10Markup(visual)}</div>`;
  if (visual.kind.startsWith("g1-")) return `<div class="visual g1-source-visual">${g1SourceMarkup(visual)}</div>`;
  if (visual.kind === "hidden-card-conditions") return `<div class="visual hidden-card-visual">${hiddenCardConditionsMarkup(visual)}</div>`;
  if (visual.kind === "shape-matrix-rule") return `<div class="visual shape-matrix-visual">${shapeMatrixRuleMarkup(visual)}</div>`;
  if (visual.kind === "torn-calendar") return `<div class="visual torn-calendar-visual">${tornCalendarMarkup(visual)}</div>`;
  if (visual.kind === "two-type-units") return `<div class="visual two-type-units-visual">${twoTypeUnitsMarkup(visual)}</div>`;
  if (visual.kind === "row-column-count-placement") return `<div class="visual row-column-count-visual">${rowColumnCountMarkup(visual)}</div>`;
  if (visual.kind === "truth-lie-ranking") return `<div class="visual truth-lie-ranking-visual">${truthLieRankingMarkup(visual)}</div>`;
  if (visual.kind === "target-score-combinations") return `<div class="visual target-score-visual">${targetScoreCombinationsMarkup(visual)}</div>`;
  if (visual.kind === "matchstick-shape-sequence") return `<div class="visual matchstick-sequence-visual">${matchstickShapeSequenceMarkup(visual)}</div>`;
  if (visual.kind === "connected-line-degree-sum") return `<div class="visual connected-line-visual">${connectedLineDegreeSumMarkup(visual)}</div>`;
  if (visual.kind === "letter-block-transform") return `<div class="visual letter-transform-visual">${letterBlockTransformMarkup(visual)}</div>`;
  if (visual.kind === "mixed-sequences") return `<div class="visual mixed-sequences-visual">${mixedSequencesMarkup(visual)}</div>`;
  if (visual.kind === "venn-neither") return `<div class="visual venn-neither-visual">${vennNeitherMarkup(visual)}</div>`;
  if (visual.kind === "hidden-score-ranking") return `<div class="visual hidden-score-visual">${hiddenScoreRankingMarkup(visual)}</div>`;
  if (visual.kind === "even-card-count") return `<div class="visual even-card-visual">${evenCardCountMarkup(visual)}</div>`;
  if (visual.kind === "reverse-count-timeline") return `<div class="visual reverse-count-visual">${reverseCountTimelineMarkup(visual)}</div>`;
  if (visual.kind === "erase-expression-target") return `<div class="visual erase-expression-visual">${eraseExpressionTargetMarkup(visual)}</div>`;
  if (visual.kind === "collection-repeat-gap") return `<div class="visual collection-repeat-visual">${collectionRepeatGapMarkup(visual)}</div>`;
  if (visual.kind === "mixed-operation-cards") return `<div class="visual mixed-operation-card-visual">${mixedOperationCardsMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-card-enumeration") return `<div class="visual two-digit-enumeration-visual">${twoDigitCardEnumerationMarkup(visual)}</div>`;
  if (visual.kind === "closest-card-sum") return `<div class="visual closest-card-visual">${closestCardSumMarkup(visual)}</div>`;
  if (visual.kind === "number-card-plus-minus") return `<div class="visual card-equation-visual">${numberCardMarkup(visual)}</div>`;
  if (visual.kind === "edge-sum-cycle") return `<div class="visual edge-sum-visual">${edgeSumCycleMarkup(visual)}</div>`;
  if (visual.kind === "five-cell-placement") return `<div class="visual five-cell-placement-visual">${fiveCellPlacementMarkup(visual)}</div>`;
  if (visual.kind === "equalize-bags") return `<div class="visual equalize-visual">${equalizeBagsMarkup(visual)}</div>`;
  if (visual.kind === "total-difference-share") return `<div class="visual total-difference-visual">${totalDifferenceShareMarkup(visual)}</div>`;
  if (visual.kind === "number-pyramid") return `<div class="visual pyramid-visual">${numberPyramidMarkup(visual)}</div>`;
  if (visual.kind === "five-card-pyramid") return `<div class="visual five-card-pyramid-visual">${fiveCardPyramidMarkup(visual)}</div>`;
  if (visual.kind === "stair-grid-placement") return `<div class="visual stair-grid-placement-visual">${stairGridPlacementMarkup(visual)}</div>`;
  if (visual.kind === "vertical-stair-grid-placement") return `<div class="visual stair-grid-placement-visual">${verticalStairGridPlacementMarkup(visual)}</div>`;
  if (visual.kind === "l-grid-placement") return `<div class="visual l-grid-placement-visual">${lGridPlacementMarkup(visual)}</div>`;
  if (visual.kind === "race-order") return `<div class="visual race-order-visual">${raceOrderMarkup(visual, visual.conditions || [])}</div>`;
  if (visual.kind === "line-position-seven") return `<div class="visual line-position-visual">${linePositionSevenMarkup(visual)}</div>`;
  if (visual.kind === "total-difference-candy") return `<div class="visual total-difference-candy-visual">${totalDifferenceCandyMarkup(visual)}</div>`;
  if (visual.kind === "addition-table-grid") return `<div class="visual addition-table-visual">${additionTableGridMarkup(visual)}</div>`;
  if (visual.kind === "disc-number-rule") return `<div class="visual disc-rule-visual">${discNumberRuleMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-table") return `<div class="visual shape-sum-visual">${shapeSumTableMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-row-target") return `<div class="visual shape-sum-visual">${shapeSumRowTargetMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-bottom-target") return `<div class="visual shape-sum-visual">${shapeSumBottomTargetMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-column-target") return `<div class="visual shape-sum-visual">${shapeSumColumnTargetMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-repeated-column-target") return `<div class="visual shape-sum-visual">${shapeSumRepeatedColumnTargetMarkup(visual)}</div>`;
  if (visual.kind === "repeat-shape-sequence") return `<div class="visual repeat-sequence-visual">${repeatShapeSequenceMarkup(visual)}</div>`;
  if (visual.kind === "repeat-shape-answer") return `<div class="visual repeat-shape-answer-visual">${repeatShapeAnswerMarkup(visual)}</div>`;
  if (visual.kind === "number-sequences") return `<div class="visual number-sequences-visual">${numberSequencesMarkup(visual)}</div>`;
  if (visual.kind === "height-extremes") return `<div class="visual height-extremes-visual">${heightExtremesMarkup(visual)}</div>`;
  if (visual.kind === "diagnostic-part-whole-bar") return `<div class="visual diagnostic-part-whole-visual">${diagnosticPartWholeBarMarkup(visual)}</div>`;
  if (visual.kind === "diagnostic-number-relation") return `<div class="visual diagnostic-number-relation-visual">${diagnosticNumberRelationMarkup(visual)}</div>`;
  if (visual.kind === "cube-different-shape") return `<div class="visual cube-different-shape-visual">${cubeDifferentShapeMarkup(visual)}</div>`;
  if (visual.kind === "masked-vertical-additions") return `<div class="visual masked-vertical-additions-visual">${maskedVerticalAdditionsMarkup(visual)}</div>`;
  if (visual.kind === "given-shape-expression") return `<div class="visual given-shape-expression-visual">${givenShapeExpressionMarkup(visual)}</div>`;
  if (visual.kind === "paired-growing-sequences") return `<div class="visual paired-growing-sequences-visual">${pairedGrowingSequencesMarkup(visual)}</div>`;
  if (visual.kind === "triangle-fan-count") return `<div class="visual triangle-fan-count-visual">${triangleFanCountMarkup(visual)}</div>`;
  if (visual.kind === "reverse-operation-ladder") return `<div class="visual reverse-operation-ladder-visual">${reverseOperationLadderMarkup(visual)}</div>`;
  if (visual.kind === "plus-minus-multi-target") return `<div class="visual plus-minus-multi-target-visual">${plusMinusMultiTargetMarkup(visual)}</div>`;
  if (visual.kind === "two-custom-operations") return `<div class="visual two-custom-operations-visual">${twoCustomOperationsMarkup(visual)}</div>`;
  if (visual.kind === "equal-partition-tree") return `<div class="visual equal-partition-visual">${equalPartitionTreeMarkup(visual)}</div>`;
  if (visual.kind === "balance-order-chain") return `<div class="visual balance-order-visual">${balanceOrderChainMarkup(visual)}</div>`;
  if (visual.kind === "diagnostic-animal-balance-order") return `<div class="visual diagnostic-animal-balance-visual">${diagnosticAnimalBalanceOrderMarkup(visual)}</div>`;
  if (visual.kind === "balance-unit-equations") return `<div class="visual balance-unit-visual">${balanceUnitEquationsMarkup(visual)}</div>`;
  if (visual.kind === "distinct-shape-equations") return `<div class="visual distinct-shape-visual">${distinctShapeEquationsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-pattern-sequence") return `<div class="visual symbol-pattern-visual">${symbolPatternSequenceMarkup(visual)}</div>`;
  if (visual.kind === "progressive-number-table") return `<div class="visual progressive-table-visual">${progressiveNumberTableMarkup(visual)}</div>`;
  if (visual.kind === "book2-growth") return `<div class="visual book2-growth-visual">${book2GrowthMarkup(visual)}</div>`;
  if (visual.kind === "center-number-rule") return `<div class="visual center-number-rule-visual">${centerNumberRuleMarkup(visual)}</div>`;
  if (visual.kind === "number-rule-grid") return `<div class="visual number-rule-grid-visual">${numberRuleGridMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-compose-rule") return `<div class="visual two-digit-compose-visual">${twoDigitComposeRuleMarkup(visual)}</div>`;
  if (visual.kind === "sudoku-grid") return `<div class="visual sudoku-grid-visual">${sudokuGridMarkup(visual)}</div>`;
  if (visual.kind === "repeat-shape-color-dual") return `<div class="visual repeat-sequence-visual">${repeatShapeColorDualMarkup(visual)}</div>`;
  if (visual.kind === "three-shape-cycle") return `<div class="visual three-shape-cycle-visual">${threeShapeCycleMarkup(visual)}</div>`;
  if (visual.kind === "arrow-number-grid") return `<div class="visual arrow-grid-visual">${arrowNumberGridMarkup(visual)}</div>`;
  if (visual.kind === "arrow-number-horizontal-tens") return `<div class="visual arrow-grid-visual">${arrowNumberHorizontalTensMarkup(visual)}</div>`;
  if (visual.kind === "arrow-number-path-seven") return `<div class="visual arrow-path-seven-visual">${arrowNumberPathSevenMarkup(visual)}</div>`;
  if (visual.kind === "bus-stops") return `<div class="visual bus-stops-visual">${busStopsMarkup(visual)}</div>`;
  if (visual.kind === "fold-number-cut-sum") return `<div class="visual fold-number-cut-visual">${foldNumberCutSumMarkup(visual)}</div>`;
  if (visual.kind === "equal-line-eight-cards") return `<div class="visual equal-line-eight-visual">${equalLineSumEightCardsMarkup(visual)}</div>`;
  if (visual.kind === "equal-line-cross") return `<div class="visual equal-line-cross-visual">${equalLineCrossMarkup(visual)}</div>`;
  if (visual.kind === "number-conditions") return `<div class="visual number-conditions-visual">${numberConditionsMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-parity-gap") return `<div class="visual number-conditions-visual">${twoDigitParityGapMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-odd-gap") return `<div class="visual number-conditions-visual">${twoDigitOddGapMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-odd-bounded-gap") return `<div class="visual number-conditions-visual">${twoDigitOddBoundedGapMarkup(visual)}</div>`;
  if (visual.kind === "triangle-tile-growth") return `<div class="visual triangle-tile-growth-visual">${triangleTileGrowthMarkup(visual)}</div>`;
  if (visual.kind === "square-tile-growth") return `<div class="visual square-tile-growth-visual">${squareTileGrowthMarkup(visual)}</div>`;
  if (visual.kind === "growing-dot-square") return `<div class="visual growing-dot-square-visual">${growingDotSquareMarkup(visual)}</div>`;
  if (visual.kind === "symbol-sum-grid") return `<div class="visual symbol-sum-grid-visual">${symbolSumGridMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-grid-triangle-top") return `<div class="visual symbol-sum-grid-visual">${shapeSumGridTriangleTopMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-grid-top-target") return `<div class="visual symbol-sum-grid-visual">${shapeSumGridTopTargetMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-grid-triangle-column-target") return `<div class="visual symbol-sum-grid-visual">${shapeSumGridTriangleColumnTargetMarkup(visual)}</div>`;
  if (visual.kind === "symbol-sum-grid-square-top") return `<div class="visual symbol-sum-grid-visual">${symbolSumGridSquareTopMarkup(visual)}</div>`;
  if (visual.kind === "shape-equation-add-subtract") return `<div class="visual shape-equation-add-subtract-visual">${shapeEquationAddSubtractMarkup(visual)}</div>`;
  if (visual.kind === "source-piano") return `<div class="visual source-piano-visual">${sourcePianoMarkup()}</div>`;
  if (visual.kind === "balance-relations") return `<div class="visual balance-relations-visual">${balanceRelationsMarkup(visual)}</div>`;
  if (visual.kind === "balance-scale-three-objects") return `<div class="visual balance-relations-visual">${balanceScaleThreeObjectsMarkup(visual)}</div>`;
  if (visual.kind === "balance-scale-circle-target") return `<div class="visual balance-relations-visual">${balanceScaleCircleTargetMarkup(visual)}</div>`;
  if (visual.kind === "balance-scale-star-target") return `<div class="visual balance-relations-visual">${balanceScaleStarTargetMarkup(visual)}</div>`;
  if (visual.kind === "balance-scale-four-objects") return `<div class="visual balance-relations-visual">${balanceScaleFourObjectsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-relations") return `<div class="visual symbol-relations-visual">${symbolRelationsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-relation-two-to-three") return `<div class="visual symbol-relations-visual">${symbolRelationsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-relation-three-to-four") return `<div class="visual symbol-relations-visual">${symbolRelationsMarkup(visual)}</div>`;
  if (visual.kind === "number-line-six-points") return `<div class="visual number-line-six-points-visual">${numberLineSixPointsMarkup(visual)}</div>`;
  if (visual.kind === "go-stone-difference-inverse") return `<div class="visual go-stone-difference-inverse-visual">${goStoneDifferenceInverseMarkup(visual)}</div>`;
  if (visual.kind === "colored-shape-number") return `<div class="visual colored-shape-number-visual">${coloredShapeNumberMarkup(visual)}</div>`;
  if (visual.kind === "source-go-stones") return `<div class="visual source-go-stones-visual">${sourceGoStonesMarkup(visual)}</div>`;
  if (visual.kind === "nonadjacent-pyramid") return `<div class="visual nonadjacent-pyramid-visual">${nonadjacentPyramidMarkup(visual)}</div>`;
  if (visual.kind === "cards") return `<div class="visual"><div class="number-cards">${visual.values.map((value) => `<span class="number-card">${value}</span>`).join("")}</div></div>`;
  if (visual.kind === "bus") return `<div class="visual"><div class="bus-row"><span>${visual.start}명</span><b>+</b><span class="bus-icon">버스</span><span>+${visual.boarded}</span><span>-${visual.left}</span></div></div>`;
  if (visual.kind === "place") return `<div class="visual"><div class="place-grid"><b>십의 자리</b><b>일의 자리</b><strong>${visual.tens}</strong><strong>${visual.ones}</strong></div></div>`;
  if (visual.kind === "shapes") return `<div class="visual"><div class="shape-row">${visual.items.map((token) => `<span class="shape-token ${token.color === "검은색" ? "black" : "white"}">${shapeSymbol(token.shape)}</span>`).join("")}</div></div>`;
  if (visual.kind === "piano") return `<div class="visual"><div class="piano-row">${Array.from({ length: visual.keys }, (_, index) => `<span class="piano-key">${index + 1}</span>`).join("")}</div></div>`;
  if (visual.kind === "line") return `<div class="visual"><div class="people-row">${Array.from({ length: visual.total }, (_, index) => `<i class="${index + 1 === visual.first ? "marked" : ""}">${index + 1}</i>`).join("")}</div></div>`;
  // 옛 요약 그림("한 번 접기 → 구멍 → 펼치기")은 접는 방향을 안 보여줬다.
  // 이제 생성기가 단계 폴리곤(stages)을 주므로 실제 접는 과정을 화살표와 함께 그린다.
  if (visual.kind === "triangle-edge-sum") return `<div class="visual triangle-edge-sum-visual">${triangleEdgeSumMarkup(visual)}</div>`;
  if (visual.kind === "symbol-chain") return `<div class="visual symbol-chain-visual">${symbolChainMarkup(visual)}</div>`;
  if (visual.kind === "aligned-rod-lengths") return `<div class="visual aligned-rods-visual">${alignedRodLengthsMarkup(visual)}</div>`;
  if (visual.kind === "two-function-machines") return `<div class="visual two-function-machines-visual">${twoFunctionMachinesMarkup(visual)}</div>`;
  if (visual.kind === "unused-card-equations") return `<div class="visual unused-card-equations-visual">${unusedCardEquationsMarkup(visual)}</div>`;
  if (visual.kind === "recorder-matchstick-length") return `<div class="visual recorder-matchstick-visual">${recorderMatchstickLengthMarkup(visual)}</div>`;
  if (visual.kind === "shape-transform-grid") return `<div class="visual shape-transform-grid-visual">${shapeTransformGridMarkup(visual)}</div>`;
  if (visual.kind === "cube-add-to-match") return `<div class="visual cube-add-to-match-visual">${cubeAddToMatchMarkup(visual)}</div>`;
  if (visual.kind === "overlapping-run-sequence") return `<div class="visual overlapping-run-sequence-visual">${overlappingRunSequenceMarkup(visual)}</div>`;
  if (visual.kind === "alternating-people") return `<div class="visual alternating-people-visual">${alternatingPeopleMarkup(visual)}</div>`;
  if (visual.kind === "shape-matrix-three") return `<div class="visual shape-matrix-three-visual">${shapeMatrixThreeMarkup(visual)}</div>`;
  if (visual.kind === "triangle-position-cycle") return `<div class="visual triangle-position-cycle-visual">${trianglePositionCycleMarkup(visual)}</div>`;
  if (visual.kind === "triangle-position-answer") return `<div class="visual triangle-position-answer-visual">${triangleCycleSvg(visual.position)}</div>`;
  if (visual.kind === "overlap-bonds") return `<div class="visual overlap-bonds-visual">${overlapBondsMarkup(visual)}</div>`;
  if (visual.kind === "geometry-worksheet") return `<div class="visual geometry-worksheet-visual">${geometryWorksheetMarkup(visual)}</div>`;
  if (visual.kind === "geometry-worksheet-answer") return `<div class="geometry-worksheet-answer-visual">${geometryWorksheetAnswerMarkup(visual)}</div>`;
  if (visual.kind === "triangle-sum-grid") return `<div class="visual triangle-sum-grid-visual">${triangleSumGridMarkup(visual)}</div>`;
  if (visual.kind === "sum-grid") return `<div class="visual sum-grid-visual">${sumGridMarkup(visual)}</div>`;
  if (visual.kind === "magic-square") return `<div class="visual magic-square-visual">${magicSquareMarkup(visual)}</div>`;
  if (visual.kind === "statement-list") return `<div class="visual statement-visual">${statementListMarkup(visual)}</div>`;
  if (visual.kind === "stone-triangle-rows") return `<div class="visual stone-triangle-visual">${stoneTriangleRowsMarkup(visual)}</div>`;
  if (visual.kind === "cell-shape") return `<div class="visual cell-shape-visual">${cellShapeMarkup(visual)}</div>`;
  if (visual.kind === "checker-square-growth") return `<div class="visual checker-growth-visual">${checkerSquareGrowthMarkup(visual)}</div>`;
  if (visual.kind === "paper-fold") return `<div class="visual paper-fold-visual">${paperFoldMarkup(visual)}</div>`;
  if (visual.kind === "cryptarithm-vertical") return `<div class="visual cryptarithm-vertical-visual">${cryptarithmVerticalMarkup(visual)}</div>`;
  if (visual.kind === "fold-number-grid") return `<div class="visual fold-number-visual">${foldNumberGridMarkup(visual)}</div>`;
  if (visual.kind === "fold-diagonal-grid") return `<div class="visual fold-diagonal-visual">${foldDiagonalGridMarkup(visual)}</div>`;
  if (visual.kind === "fold-number-inverse") return `<div class="visual fold-inverse-visual">${foldNumberInverseMarkup(visual)}</div>`;
  if (visual.kind === "fold-cut-pieces") return `<div class="visual fold-pieces-visual">${foldCutPiecesMarkup(visual)}</div>`;
  if (visual.kind === "fold-punch") return `<div class="visual fold-punch-visual">${foldPunchMarkup(visual)}</div>`;
  if (visual.kind === "fold-stack") return `<div class="visual fold-stack-visual">${foldStackMarkup(visual)}</div>`;
  if (visual.kind === "fold-unfold-choice") return `<div class="visual fold-unfold-visual">${foldUnfoldChoiceMarkup(visual)}</div>`;
  if (visual.kind === "fold-cut-unfold-draw") return `<div class="visual fold-unfold-visual">${foldCutUnfoldDrawMarkup(visual)}</div>`;
  if (visual.kind === "fold-two-diagonal-grid") return `<div class="visual fold-diagonal-visual">${foldTwoDiagonalGridMarkup(visual)}</div>`;
  return "";
}

function worksheetVisualMarkup(question) {
  if (question.image) return `<img class="legacy-image" src="${question.image}" alt="${question.type.label} 문제 그림" />`;
  if (!Array.isArray(question.parts) || question.parts.length <= 1) return visualMarkup(question.visual);
  return `<div class="multi-part-visuals">${question.parts.map((part, index) => {
    const picture = visualMarkup(part.visual);
    return `<figure><figcaption>(${index + 1})</figcaption>${part.prompt ? `<p>${part.prompt}</p>` : ""}${picture}</figure>`;
  }).join("")}</div>`;
}

function answerVisualMarkup(question) {
  if (Array.isArray(question.answerVisuals) && question.answerVisuals.some(Boolean)) {
    return `<div class="multi-part-visuals answer-part-visuals">${question.answerVisuals.map((visual, index) => (
      `<figure><figcaption>(${index + 1})</figcaption>${visual ? visualMarkup(visual) : ""}</figure>`
    )).join("")}</div>`;
  }
  if (!question.answerVisual) return "";
  if (question.answerVisual.kind === "letter-block-answer") {
    return `<div class="letter-answer-preview">${letterBlockTileMarkup(question.answerVisual.word, true)}</div>`;
  }
  return visualMarkup(question.answerVisual);
}

function watermarkMarkup() {
  return Array.from({ length: 3 }, () => `<span>${student} · GFIELD · ${student} · GFIELD · ${student}</span>`).join("");
}

function renderWorksheet() {
  hideTypePreview();
  const title = state.mode === "exam" ? "맞춤 모의고사" : state.mode === "curriculum" ? "필즈 더 클래식 단원 학습지" : "유형별 맞춤 학습지";
  $("worksheetTitle").textContent = title;
  const questionCards = state.questions.map((question, index) => {
    const domain = DOMAINS.find((item) => item.id === question.type.domain);
    return `<article class="question-card" data-question-index="${index}">
      <div class="question-edit-tools" aria-label="${index + 1}번 문항 편집">
        <button type="button" draggable="true" data-drag-handle title="끌어서 순서 변경" aria-label="끌어서 순서 변경">↕</button>
        <button type="button" data-question-action="up" data-question-index="${index}" title="위로 이동" aria-label="위로 이동" ${index === 0 ? "disabled" : ""}>↑</button>
        <button type="button" data-question-action="down" data-question-index="${index}" title="아래로 이동" aria-label="아래로 이동" ${index === state.questions.length - 1 ? "disabled" : ""}>↓</button>
        ${question.generationCase?.mode === "source" ? "" : `<button type="button" data-question-action="replace" data-question-index="${index}" title="같은 유형의 새 문제" aria-label="같은 유형의 새 문제">↻</button>`}
        <button type="button" data-question-action="remove" data-question-index="${index}" title="문항 삭제" aria-label="문항 삭제" ${state.questions.length <= 1 ? "disabled" : ""}>×</button>
      </div>
      <div class="question-top"><span class="question-number">${String(index + 1).padStart(2, "0")}</span><span class="question-type">${domain.label} · ${question.type.middle} · ${question.type.label}</span></div>
      <div class="question-style-tags">${academyStyleLabels(question).map((label) => `<span>${label}</span>`).join("")}</div>
      ${question.representativeConcept && question.studyStage?.id !== "concept" ? `<div class="question-concept"><strong>대표 개념</strong><span>${question.representativeConcept.label}</span></div>` : ""}
      ${question.studyStage ? `<div class="study-stage-banner ${question.studyStage.id}"><strong>${question.studyStage.label}</strong><span>${question.studyStage.sourceLabel} · ${question.studyStage.description}</span></div>` : ""}
      <span class="question-reference">기준 문제: ${question.reference}</span>
      ${textbookConceptTutorialMarkup(question)}
      ${question.studyStage?.id !== "concept" && question.conceptGuide ? `<div class="concept-guide"><strong>개념 발판</strong><span>${question.conceptGuide}</span></div>` : ""}
      <p class="question-prompt">${question.prompt.replaceAll("\n", "<br>")}</p>
      ${worksheetVisualMarkup(question)}
      ${question.responseKind === "drawing"
        ? '<span class="drawing-answer-note">위 빈 상자 안에 그림을 그리세요.</span>'
        : question.responseKind === "visual-fill"
          ? '<span class="drawing-answer-note">그림의 빈칸에 수를 써 넣으세요.</span>'
          : `<label class="answer-line ${question.responseKind === "list" ? "wide-answer-line" : ""}">답 <input class="answer-input" data-question-index="${index}" value="${escapeAttribute(question.responseValue)}" aria-label="${index + 1}번 답" /></label>`}
      ${textbookConceptSolutionMarkup(question)}
    </article>`;
  });
  const pages = [];
  for (let index = 0; index < questionCards.length; index += 2) {
    pages.push(`<section class="question-page" aria-label="${Math.floor(index / 2) + 1}쪽">${questionCards.slice(index, index + 2).join("")}</section>`);
  }
  $("questionGrid").innerHTML = pages.join("");
  $("watermark").innerHTML = state.watermark ? watermarkMarkup() : "";
  $("answerWatermark").innerHTML = state.watermark ? watermarkMarkup() : "";
  bindQuestionEditor();
}

function openAnswers() {
  $("answerBody").innerHTML = state.questions.map((question, index) => {
    const domain = DOMAINS.find((item) => item.id === question.type.domain);
    // 답이 그림인 문항은 답안지에도 그림이 있어야 한다. 예전에는 글자 블록만 그렸고
    // 나머지 answerVisual은 조용히 버려져서, 도형 행렬·삼각형 위치 문항의 답안이
    // 말로만 적혀 나왔다. 그림을 그리되 글로 쓴 답도 함께 남긴다 — 채점자가 그림만
    // 보고 판단하지 않아도 되게.
    const answerPicture = answerVisualMarkup(question);
    const answer = answerPicture ? `${answerPicture}<div class="answer-text">${question.answer}</div>` : question.answer;
    return `<tr><td>${index + 1}</td><td>${domain.label}</td><td>${question.type.middle}</td><td>${question.type.label}</td><td>${question.representativeConcept?.label || question.type.middle}</td><td>${academyStyleLabels(question).join(" · ")}</td><td>${answer}</td><td>${state.includeSolution ? question.solution : "-"}</td></tr>`;
  }).join("");
  $("answerDialog").showModal();
}

function initControls() {
  $("studentName").textContent = student;
  $("worksheetStudent").textContent = student;
  if ($("resultDiagnosisLink")) $("resultDiagnosisLink").href = `./result-diagnosis.html?student=${encodeURIComponent(student)}`;
  $("goldenBellLink").href = `./golden-bell.html?student=${encodeURIComponent(student)}&book=${state.curriculumBookId}`;
  $("builderTabs").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  $("toggleExamTypes").addEventListener("click", () => toggleVisible("#examTypeList input[data-exam-key]", state.selected.exam, (input) => input.dataset.examKey));
  $("toggleCurriculum").addEventListener("click", toggleCurriculumSelections);
  $("toggleBankTypes").addEventListener("click", () => toggleVisible("#bankTypeTree input[data-type-id]", state.selected.type, (input) => input.dataset.typeId));
  $("countChoices").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.count = Number(button.dataset.count);
    $("questionCount").value = state.count;
    $("countChoices").querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    updateSummary();
  }));
  $("questionCount").addEventListener("change", (event) => {
    state.count = Math.max(1, Math.min(50, Number(event.target.value) || 20));
    event.target.value = state.count;
    updateSummary();
  });
  $("difficultyChoices").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.difficulty = button.dataset.level;
    $("difficultyChoices").querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    typePreviewCache.clear();
  }));
  $("curriculumStageChoices").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    setCurriculumStage(button.dataset.stage);
  }));
  $("orderChoices").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.order = button.dataset.order;
    $("orderChoices").querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  }));
  $("solutionToggle").addEventListener("change", (event) => { state.includeSolution = event.target.checked; });
  $("watermarkToggle").addEventListener("change", (event) => { state.watermark = event.target.checked; });
  $("buildButton").addEventListener("click", buildQuestions);
  $("backToBuilder").addEventListener("click", () => { $("worksheetSection").hidden = true; $("builderPanel").hidden = false; });
  $("regenerateButton").addEventListener("click", buildQuestions);
  $("answerButton").addEventListener("click", openAnswers);
  $("printButton").addEventListener("click", () => window.print());
  $("closeAnswer").addEventListener("click", () => $("answerDialog").close());
  $("closeAnswerBottom").addEventListener("click", () => $("answerDialog").close());
  $("printAnswerButton").addEventListener("click", () => {
    document.body.classList.add("printing-answers");
    window.print();
    setTimeout(() => document.body.classList.remove("printing-answers"), 400);
  });
}

renderStageButtons();
renderExamList();
renderCurriculum();
renderAcademyStyleFilters();
renderTypeTree();
initControls();
initTypePreviews();
setMode(params.get("mode") === "curriculum" ? "curriculum" : params.get("mode") === "type" ? "type" : "exam");

// ?exam=<시험지 id> 로 들어오면 그 시험지에서 열려 있는 문항을 모두 골라 둔다.
// 프로그램 페이지의 모의고사 카드에서 바로 넘어올 때 쓴다. 잠긴 문항은 건드리지 않으므로
// 검증 게이트는 그대로다.
(function preselectExam() {
  const wanted = params.get("exam");
  if (!wanted) return;
  const exam = EXAM_SOURCES.find((item) => item.id === wanted);
  if (!exam) return;
  if (DIAGNOSTIC_EXAM_TYPES.includes(exam)) state.stage = "diagnostic";
  else if (FINAL_EXAM_TYPES.includes(exam) || PRACTICE_EXAM_TYPES.includes(exam)) state.stage = `exam:${exam.id}`;
  else if (exam.stage && stageIds.has(exam.stage)) state.stage = exam.stage;
  renderStageButtons();
  renderExamList();
  let picked = 0;
  exam.questions.forEach((sourceQuestion) => {
    if (!sourceQuestion.verified || !isSelectableType(typeById(sourceQuestion.typeId))) return;
    state.selected.exam.add(examKey(exam.id, sourceQuestion.number));
    picked += 1;
  });
  if (!picked) return;
  state.count = picked;
  $("questionCount").value = String(picked);
  $("countChoices").querySelectorAll("button").forEach((button) => button.classList.toggle("active", Number(button.dataset.count) === picked));
  renderExamList();
  updateSummary();
})();

// 진단 결과에서 넘어온 여러 취약 유형을 유형별 탭에 미리 체크한다.
// 원격 링크가 오래되어도 현재 선택 가능한 유형만 남겨 검증 게이트를 우회하지 않는다.
(function preselectTypes() {
  const requested = [
    ...params.getAll("type"),
    ...(params.get("types") || "").split(",")
  ].map((id) => id.trim()).filter(Boolean);
  if (!requested.length) return;
  setMode("type");
  state.selected.type.clear();
  requested.forEach((typeId) => {
    const item = typeById(typeId);
    if (item && isSelectableType(item)) state.selected.type.add(typeId);
  });
  const requestedCount = Number(params.get("count"));
  if (Number.isFinite(requestedCount) && requestedCount >= 1 && requestedCount <= 50) {
    state.count = requestedCount;
    $("questionCount").value = String(requestedCount);
    $("countChoices").querySelectorAll("button").forEach((button) => button.classList.toggle("active", Number(button.dataset.count) === requestedCount));
  }
  renderTypeTree();
  updateSummary();
})();
