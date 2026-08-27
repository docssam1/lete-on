import { GOLDEN_BELL_BOOKS, goldenBellBookById } from "./golden-bell-data.js?v=20260828a";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const requestedBook = params.get("book") || "book-01";
const storageKey = `fields-classic-golden-bell:${student}`;

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(storageKey) || "{}") || {}; }
  catch { return {}; }
}

const state = {
  bookId: goldenBellBookById(requestedBook).id,
  lessonId: null,
  phase: "concept",
  selections: {},
  feedback: null,
  progress: loadProgress()
};

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(state.progress));
}

function activeBook() { return goldenBellBookById(state.bookId); }
function activeLesson() { return activeBook().lessons.find((lesson) => lesson.id === state.lessonId) || activeBook().lessons[0]; }
function lessonProgress(lesson = activeLesson()) { return state.progress[state.bookId]?.[lesson?.id] || {}; }

function completeOriginal() {
  const lesson = activeLesson();
  state.progress[state.bookId] ||= {};
  state.progress[state.bookId][lesson.id] ||= {};
  state.progress[state.bookId][lesson.id].original = true;
  saveProgress();
}

function completeExtension() {
  const lesson = activeLesson();
  state.progress[state.bookId] ||= {};
  state.progress[state.bookId][lesson.id] ||= {};
  state.progress[state.bookId][lesson.id].extension = true;
  state.progress[state.bookId][lesson.id].completedAt = new Date().toISOString();
  saveProgress();
}

function isLessonComplete(lesson) { return Boolean(lessonProgress(lesson).original && lessonProgress(lesson).extension); }

function phaseAllowed(phase) {
  const progress = lessonProgress();
  if (phase === "concept" || phase === "original") return true;
  if (phase === "extension") return Boolean(progress.original);
  return Boolean(progress.original && progress.extension);
}

function setPhase(phase) {
  if (!phaseAllowed(phase)) return;
  state.phase = phase;
  state.selections = {};
  state.feedback = null;
  render();
}

function clockMarkup(value) {
  const numbers = Array.from({ length: 12 }, (_, index) => {
    const number = index + 1;
    const angle = (number * Math.PI) / 6;
    const x = 100 + Math.sin(angle) * 72;
    const y = 100 - Math.cos(angle) * 72;
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${number}</text>`;
  }).join("");
  const ticks = Array.from({ length: 12 }, (_, index) => {
    const angle = (index * Math.PI) / 6;
    const x1 = 100 + Math.sin(angle) * 82;
    const y1 = 100 - Math.cos(angle) * 82;
    const x2 = 100 + Math.sin(angle) * 88;
    const y2 = 100 - Math.cos(angle) * 88;
    return `<line class="tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
  }).join("");
  const handAngle = ((value % 12) * Math.PI) / 6;
  const handX = 100 + Math.sin(handAngle) * 57;
  const handY = 100 - Math.cos(handAngle) * 57;
  return `<svg class="clock-svg" viewBox="0 0 200 200" role="img" aria-label="${value}를 가리키는 시계"><circle class="face" cx="100" cy="100" r="92" />${ticks}${numbers}<line class="hand" x1="100" y1="100" x2="${handX}" y2="${handY}" /><circle class="pin" cx="100" cy="100" r="7" /></svg>`;
}

function foldNotchMarkup() {
  const option = (number, path) => `<figure><svg viewBox="0 0 120 72" aria-label="${number}번 펼친 모양"><rect class="paper" x="8" y="9" width="104" height="54" /><path class="crease" d="M60 9V63" />${path}</svg><figcaption>${number}번</figcaption></figure>`;
  return `<div class="fold-original"><svg viewBox="0 0 180 120" aria-label="색종이를 오른쪽으로 한 번 접고 삼각형 모양을 자르는 과정"><rect class="paper" x="8" y="18" width="164" height="84" /><path class="crease" d="M90 18V102" /><path d="M18 60H78" fill="none" stroke="#178bc0" stroke-width="3" /><path d="M70 52l10 8-10 8" fill="none" stroke="#178bc0" stroke-width="3" /><path class="cut" d="M90 51l-18 9 18 9z" /></svg><div class="fold-options">${option(1,'<path class="cut" d="M60 27l-16 9 16 9z" />')}${option(2,'<path class="cut" d="M60 27l-16 9 16 9 16-9-16-9z" />')}${option(3,'<path class="cut" d="M8 27l16 9-16 9zM112 27L96 36l16 9z" />')}${option(4,'<path class="cut" d="M8 27l16 9-16 9zM60 27l-16 9 16 9z" />')}</div></div>`;
}

function valueCell(value, className = "") {
  return `<span class="${className} ${value == null ? "blank-value" : ""}">${value == null ? "?" : value}</span>`;
}

function lineDiagramMarkup(diagram) {
  if (diagram.shape === "tee") return `<div class="line-diagram"><div class="line-tee">${valueCell(diagram.left,"left")}${valueCell(diagram.center,"center")}${valueCell(diagram.right,"right")}${valueCell(diagram.down1,"down1")}${valueCell(diagram.down2,"down2")}</div></div>`;
  if (diagram.verticalMiddle != null) return `<div class="line-diagram"><div class="line-cross offset">${valueCell(diagram.top,"top")}${valueCell(diagram.center,"center")}${valueCell(diagram.right,"right")}${valueCell(diagram.verticalMiddle,"vmiddle")}${valueCell(diagram.bottom,"bottom")}</div></div>`;
  return `<div class="line-diagram"><div class="line-cross">${valueCell(diagram.top,"top")}${valueCell(diagram.left,"left")}${valueCell(diagram.center,"center")}${valueCell(diagram.right,"right")}${valueCell(diagram.bottom,"bottom")}</div></div>`;
}

function visualMarkup(visual) {
  if (!visual) return "";
  if (visual.kind === "clock") return clockMarkup(visual.value);
  if (visual.kind === "fold-notch-options") return foldNotchMarkup();
  if (visual.kind === "fold-star") return '<div class="fold-star"><div class="folded"></div><b>→</b><strong>펼치기</strong></div>';
  if (visual.kind === "equal-line-set") return `<div class="line-diagram-set">${visual.diagrams.map(lineDiagramMarkup).join("")}</div>`;
  if (visual.kind === "equal-line") return lineDiagramMarkup({ shape: "cross", ...visual });
  if (visual.kind === "logic-cards") return '<div class="logic-visual"><span>A</span><span>B</span><span>C</span><b>↔</b><span>서로 다른 선택</span></div>';
  if (visual.kind === "logic-food") return '<div class="logic-visual"><span>민지</span><span>서윤</span><span>도윤</span><b>↔</b><span>김밥</span><span>샌드위치</span><span>떡볶이</span></div>';
  return "";
}

function renderBookTabs() {
  $("bookTabs").innerHTML = GOLDEN_BELL_BOOKS.map((book) => `<button type="button" class="${book.id === state.bookId ? "active" : ""} ${book.status}" data-book="${book.id}">${book.label}</button>`).join("");
  $("bookTabs").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.bookId = button.dataset.book;
    state.lessonId = activeBook().lessons[0]?.id || null;
    state.phase = "concept";
    state.selections = {};
    state.feedback = null;
    const next = new URL(location.href);
    next.searchParams.set("book", state.bookId);
    history.replaceState(null, "", next);
    render();
  }));
}

function renderLessonList() {
  const book = activeBook();
  if (!book.lessons.length) {
    $("lessonList").innerHTML = "";
    return;
  }
  $("lessonList").innerHTML = book.lessons.map((lesson, index) => {
    const complete = isLessonComplete(lesson);
    return `<button type="button" class="lesson-button ${lesson.id === state.lessonId ? "active" : ""} ${complete ? "complete" : ""}" data-lesson="${lesson.id}"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${lesson.title}</strong><small>${lesson.unit}</small></div><em>${complete ? "완료" : "도전"}</em></button>`;
  }).join("");
  $("lessonList").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.lessonId = button.dataset.lesson;
    state.phase = "concept";
    state.selections = {};
    state.feedback = null;
    render();
  }));
}

function renderStageSteps() {
  const phases = [
    ["concept", "1", "개념 이야기"],
    ["original", "2", "원본 확인"],
    ["extension", "3", "이야기 확장"],
    ["complete", "4", "레벨업"]
  ];
  const progress = lessonProgress();
  $("stageSteps").innerHTML = phases.map(([id, number, label]) => {
    const complete = id === "concept" ? state.phase !== "concept" : id === "original" ? progress.original : id === "extension" || id === "complete" ? progress.extension : false;
    return `<button type="button" class="stage-step ${state.phase === id ? "active" : ""} ${complete ? "complete" : ""}" data-phase="${id}" ${phaseAllowed(id) ? "" : "disabled"}><strong>${number}</strong><span>${label}</span></button>`;
  }).join("");
  $("stageSteps").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setPhase(button.dataset.phase)));
}

function renderConcept(lesson) {
  return `<p class="lesson-kicker">${lesson.unit} · 대표 개념</p><h2>${lesson.story.title}</h2><p class="lesson-lead">${lesson.representativeConcept}</p><span class="source-locator">원본 근거: ${lesson.sourceLocator}</span><div class="story-band"><span class="story-icon">?</span><div><strong>${lesson.story.title}</strong><p>${lesson.story.text}<br>${lesson.story.mission}</p></div></div><section class="concept-box"><strong>${lesson.explanation.headline}</strong><ol>${lesson.explanation.steps.map((step) => `<li>${step}</li>`).join("")}</ol></section><button type="button" class="primary-action" data-next-phase="original">원본 골든벨 풀기</button>`;
}

function choiceButtons(groupId, options) {
  return `<div class="answer-choices">${options.map((option) => `<button type="button" class="${state.selections[groupId] === option ? "selected" : ""}" data-choice-group="${groupId}" data-choice="${option}">${option}</button>`).join("")}</div>`;
}

function renderOriginal(lesson) {
  const result = state.feedback?.kind === "original" ? state.feedback : null;
  const allAnswered = lesson.original.items.every((item) => state.selections[item.id] != null);
  return `<div class="quiz-head"><div><span>${lesson.original.title}</span><h2>${lesson.title}</h2></div><b class="concept-chip">원본 구조 1:1</b></div><p class="lesson-lead">${lesson.original.prompt}</p><div class="quiz-visual">${visualMarkup(lesson.original.visual)}</div><div class="quiz-items">${lesson.original.items.map((item) => { const status = result ? state.selections[item.id] === item.answer ? "correct" : "incorrect" : ""; return `<section class="quiz-item ${status}"><strong>${item.prompt}</strong>${choiceButtons(item.id, item.options)}</section>`; }).join("")}</div>${result ? `<p class="feedback ${result.passed ? "success" : ""}">${result.message}</p>` : ""}<button type="button" class="primary-action" data-check="original" ${allAnswered ? "" : "disabled"}>${result?.passed ? "이야기 문제로 가기" : "원본 답 확인"}</button>`;
}

function renderExtension(lesson) {
  const groupId = `${lesson.id}:extension`;
  const result = state.feedback?.kind === "extension" ? state.feedback : null;
  const selected = state.selections[groupId];
  return `<div class="quiz-head"><div><span>${lesson.extension.title}</span><h2>${lesson.extension.story}</h2></div><b class="concept-chip">같은 원리 · 새 상황</b></div><p class="lesson-lead">${lesson.extension.prompt}</p><div class="quiz-visual">${visualMarkup(lesson.extension.visual)}</div><section class="quiz-item ${result ? selected === lesson.extension.answer ? "correct" : "incorrect" : ""}"><strong>${lesson.extension.prompt}</strong>${choiceButtons(groupId, lesson.extension.options)}</section>${result ? `<p class="feedback ${result.passed ? "success" : ""}">${result.message}</p>` : ""}<button type="button" class="primary-action" data-check="extension" ${selected == null ? "disabled" : ""}>${result?.passed ? "레벨업 확인" : "이야기 답 확인"}</button>`;
}

function renderComplete(lesson) {
  const book = activeBook();
  const nextLesson = book.lessons.find((candidate) => !isLessonComplete(candidate));
  return `<section class="complete-panel"><span class="medal">✓</span><h2>${lesson.title} 개념 통과</h2><p>원본 골든벨의 답을 모두 맞히고, 같은 원리를 새로운 이야기에서도 설명했습니다. 이 개념은 레벨업 준비가 되었습니다.</p>${nextLesson ? `<button type="button" class="primary-action" data-next-lesson="${nextLesson.id}">다음 개념 도전</button>` : '<button type="button" class="primary-action" data-book-complete>1권 레벨업 완료</button>'}</section>`;
}

function renderPending(book) {
  const message = book.status === "source-needed" ? "이 권은 골든벨 원본 자료를 더 확인해야 합니다. 원본 없이 비슷한 문제를 만들지 않습니다." : "원본 파일 위치는 확인했습니다. 교사용 정답과 학생용 문항을 1:1 대조한 뒤에만 학습을 엽니다.";
  return `<section class="pending-panel"><span>!</span><h2>${book.label} 골든벨 원본 대조 중</h2><p>${message}</p><small>${book.source.file || "원본 파일 보강 필요"}</small></section>`;
}

function bindLessonActions() {
  $("lessonContent").querySelector("[data-next-phase]")?.addEventListener("click", (event) => setPhase(event.currentTarget.dataset.nextPhase));
  $("lessonContent").querySelectorAll("[data-choice-group]").forEach((button) => button.addEventListener("click", () => {
    state.selections[button.dataset.choiceGroup] = button.dataset.choice;
    state.feedback = null;
    renderContent();
  }));
  $("lessonContent").querySelector('[data-check="original"]')?.addEventListener("click", () => {
    const lesson = activeLesson();
    if (state.feedback?.kind === "original" && state.feedback.passed) return setPhase("extension");
    const passed = lesson.original.items.every((item) => state.selections[item.id] === item.answer);
    if (passed) completeOriginal();
    state.feedback = {
      kind: "original",
      passed,
      message: passed ? "원본 골든벨을 모두 맞혔습니다. 이제 같은 원리를 새로운 이야기에서 사용해 봅시다." : `아직 다른 답이 있습니다. ${lesson.explanation.headline} 설명을 떠올리고 다시 골라 보세요.`
    };
    render();
  });
  $("lessonContent").querySelector('[data-check="extension"]')?.addEventListener("click", () => {
    const lesson = activeLesson();
    if (state.feedback?.kind === "extension" && state.feedback.passed) return setPhase("complete");
    const selected = state.selections[`${lesson.id}:extension`];
    const passed = selected === lesson.extension.answer;
    if (passed) completeExtension();
    state.feedback = { kind: "extension", passed, message: passed ? lesson.extension.explanation : `원본에서 배운 원리는 같습니다. ${lesson.explanation.steps[0]}` };
    render();
  });
  $("lessonContent").querySelector("[data-next-lesson]")?.addEventListener("click", (event) => {
    state.lessonId = event.currentTarget.dataset.nextLesson;
    state.phase = "concept";
    state.selections = {};
    state.feedback = null;
    render();
  });
}

function renderContent() {
  const book = activeBook();
  if (!book.lessons.length) {
    $("lessonContent").innerHTML = renderPending(book);
    return;
  }
  const lesson = activeLesson();
  const markup = state.phase === "concept" ? renderConcept(lesson)
    : state.phase === "original" ? renderOriginal(lesson)
      : state.phase === "extension" ? renderExtension(lesson)
        : renderComplete(lesson);
  $("lessonContent").innerHTML = markup;
  bindLessonActions();
}

function renderSummary() {
  const book = activeBook();
  const completed = book.lessons.filter(isLessonComplete).length;
  $("currentBookLabel").textContent = book.label;
  $("completedCount").textContent = `${completed} / ${book.lessons.length || "-"}`;
  $("levelState").textContent = book.lessons.length && completed === book.lessons.length ? "통과" : book.lessons.length ? "도전 중" : "준비 중";
  $("bookTitle").textContent = `${book.label} · ${book.title}`;
  $("bookSource").innerHTML = `<strong>원본 기준</strong><br>${book.source.note}<br>${book.source.file || "원본 파일 보강 필요"}`;
}

function render() {
  const book = activeBook();
  if (book.lessons.length && !book.lessons.some((lesson) => lesson.id === state.lessonId)) state.lessonId = book.lessons[0].id;
  renderBookTabs();
  renderLessonList();
  renderSummary();
  if (book.lessons.length) renderStageSteps();
  else $("stageSteps").innerHTML = '<div class="stage-step"><strong>-</strong><span>원본 대조 중</span></div>';
  renderContent();
}

$("studentName").textContent = student;
$("backLink").href = `./?student=${encodeURIComponent(student)}&mode=curriculum`;
render();
