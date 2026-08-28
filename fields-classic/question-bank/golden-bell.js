import { GOLDEN_BELL_BOOKS, goldenBellBookById } from "./golden-bell-data.js?v=20260828f";

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
  const handAngle = ((value % 12) * Math.PI) / 6;
  const handX = 100 + Math.sin(handAngle) * 53;
  const handY = 92 - Math.cos(handAngle) * 53;
  const markerId = `clock-arrow-${value}`;
  return `<svg class="clock-svg source-clock" viewBox="0 0 200 150" role="img" aria-label="${value}를 가리키는 시계 바늘"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#178bc0" /></marker></defs><rect x="44" y="18" width="112" height="112" fill="#f5f6f7" /><line class="hand" x1="100" y1="92" x2="${handX.toFixed(1)}" y2="${handY.toFixed(1)}" marker-end="url(#${markerId})" /><circle cx="100" cy="92" r="10" fill="#a6a9ac" /><circle cx="100" cy="92" r="4" fill="#d9dcde" /></svg>`;
}

function foldNotchMarkup() {
  const option = (number, path) => `<figure><svg viewBox="0 0 120 72" aria-label="${number}번 펼친 모양"><rect class="paper" x="8" y="9" width="104" height="54" /><path class="crease" d="M60 9V63" />${path}</svg><figcaption>${number}번</figcaption></figure>`;
  return `<div class="fold-original"><svg viewBox="0 0 210 120" role="img" aria-label="왼쪽 색종이를 오른쪽으로 한 번 접고 칠해진 부분을 자르는 과정"><rect x="10" y="18" width="176" height="84" fill="#fff" stroke="#4e93aa" stroke-width="2" /><rect class="paper" x="98" y="18" width="88" height="84" /><path class="crease" d="M98 18V102" /><path d="M22 60H82" fill="none" stroke="#178bc0" stroke-width="3" /><path d="M74 52l10 8-10 8" fill="none" stroke="#178bc0" stroke-width="3" /><path d="M98 43h38l-15 17 15 17H98z" fill="#2d7d96" /></svg><div class="fold-options">${option(1,'<path class="cut" d="M38 24h22l-10 12 10 12H38z" />')}${option(2,'<path class="cut" d="M60 22L45 36 60 50 75 36z" />')}${option(3,'<path class="cut" d="M43 18h34L68 36l9 18H43l9-18z" />')}${option(4,'<path class="cut" d="M8 27l15 9-15 9zM112 27L97 36l15 9z" />')}</div></div>`;
}

function foldStoryMarkup() {
  const option = (number, stars) => `<figure><svg viewBox="0 0 120 72" aria-label="${number}번 펼친 초대장"><rect class="paper" x="8" y="9" width="104" height="54" /><path class="crease" d="M60 9V63" />${stars.map(([x, y]) => `<text class="story-star" x="${x}" y="${y}">★</text>`).join("")}</svg><figcaption>${number}번</figcaption></figure>`;
  return `<div class="fold-original"><svg viewBox="0 0 180 120" role="img" aria-label="초대장을 오른쪽으로 한 번 접고 별 모양 펀치로 뚫는 과정"><rect class="paper" x="8" y="18" width="164" height="84" /><path class="crease" d="M90 18V102" /><path d="M18 60H78" fill="none" stroke="#178bc0" stroke-width="3" /><path d="M70 52l10 8-10 8" fill="none" stroke="#178bc0" stroke-width="3" /><text class="story-star large" x="128" y="70">★</text></svg><div class="fold-options">${option(1,[[82,43]])}${option(2,[[38,43],[82,43]])}${option(3,[[76,35],[92,50]])}${option(4,[[32,35],[46,50],[76,35],[90,50]])}</div></div>`;
}

function valueCell(value, className = "") {
  return `<span class="${className} ${value == null ? "blank-value" : ""}">${value == null ? "?" : value}</span>`;
}

function lineDiagramMarkup(diagram) {
  if (diagram.shape === "tee") return `<div class="line-diagram"><div class="line-tee">${valueCell(diagram.left,"left")}${valueCell(diagram.center,"center")}${valueCell(diagram.right,"right")}${valueCell(diagram.down1,"down1")}${valueCell(diagram.down2,"down2")}</div></div>`;
  if (diagram.verticalMiddle != null) return `<div class="line-diagram"><div class="line-cross offset">${valueCell(diagram.top,"top")}${valueCell(diagram.center,"center")}${valueCell(diagram.right,"right")}${valueCell(diagram.verticalMiddle,"vmiddle")}${valueCell(diagram.bottom,"bottom")}</div></div>`;
  return `<div class="line-diagram"><div class="line-cross">${valueCell(diagram.top,"top")}${valueCell(diagram.left,"left")}${valueCell(diagram.center,"center")}${valueCell(diagram.right,"right")}${valueCell(diagram.bottom,"bottom")}</div></div>`;
}

function matrixShape(name) {
  const labels = { oval: "동그라미", triangle: "세모", square: "네모", diamond: "마름모" };
  return `<i class="matrix-shape ${name}" role="img" aria-label="${labels[name] || name}"></i>`;
}

function matrixEquationMarkup(left, right, sum) {
  return `<div class="matrix-equation">${matrixShape(left)}<b>+</b>${matrixShape(right)}<b>=</b><strong>${sum}</strong></div>`;
}

function matrixGridMarkup(grid) {
  const cell = (shape, name) => `<span class="${name}">${shape ? matrixShape(shape) : ""}</span>`;
  return `<div class="shape-matrix-grid">${cell(grid.topLeft,"tl")}${cell(grid.topRight,"tr")}${cell(grid.bottomLeft,"bl")}${cell(grid.bottomRight,"br")}<strong class="row-top">${grid.rowTop ?? ""}</strong><strong class="row-bottom">${grid.rowBottom ?? "?"}</strong><strong class="col-left">${grid.colLeft ?? ""}</strong><strong class="col-right">${grid.colRight ?? "?"}</strong></div>`;
}

function matrixPanelMarkup(panel) {
  const body = panel.equations
    ? `${panel.equations.map((row) => matrixEquationMarkup(row[0], row[1], row[2])).join("")}<div class="matrix-target">${matrixShape(panel.target)}<b>= ?</b></div>`
    : matrixGridMarkup(panel.grid);
  return `<figure class="matrix-panel"><figcaption>${panel.label}</figcaption>${body}</figure>`;
}

function book02MatrixMarkup(story = false) {
  const panels = story ? [
    { label: "", equations: [["oval", "square", 14], ["square", "square", 18]], target: "oval" }
  ] : [
    { label: "(1)", equations: [["oval", "oval", 4], ["oval", "triangle", 5]], target: "triangle" },
    { label: "(2)", equations: [["oval", "square", 12], ["square", "square", 16]], target: "oval" },
    { label: "(3)-1", grid: { topLeft: "triangle", topRight: "triangle", bottomLeft: "oval", bottomRight: null, rowTop: 18, rowBottom: null, colLeft: 15, colRight: null } },
    { label: "(3)-2", grid: { topLeft: "triangle", topRight: "triangle", bottomLeft: "oval", bottomRight: "square", rowTop: 18, rowBottom: null, colLeft: 15, colRight: 13 } },
    { label: "(4)", grid: { topLeft: "diamond", topRight: "diamond", bottomLeft: "square", bottomRight: "oval", rowTop: 12, rowBottom: null, colLeft: 15, colRight: 13 } },
    { label: "(5)", grid: { topLeft: "square", topRight: "diamond", bottomLeft: "square", bottomRight: "oval", rowTop: 11, rowBottom: 13, colLeft: 16, colRight: null } }
  ];
  return `<div class="matrix-panel-set ${story ? "single" : ""}">${panels.map(matrixPanelMarkup).join("")}</div>`;
}

function balanceBeamMarkup(left, right, heavySide) {
  const sideClass = heavySide === "left" ? "left-heavy" : heavySide === "right" ? "right-heavy" : "level";
  return `<div class="balance-unit" role="img" aria-label="${left}와 ${right}의 양팔저울"><div class="balance-load left">${left}</div><div class="balance-load right">${right}</div><div class="balance-beam ${sideClass}"><span></span><span></span></div><div class="balance-stand"></div></div>`;
}

function book02BalanceMarkup(story = false) {
  const balances = story
    ? [["🐰", "🐢", "left"], ["🐢", "🐿️", "left"]]
    : [["A", "B", "left"], ["C", "A", "right"], ["C", "B", "left"]];
  return `<div class="balance-set">${balances.map((item) => balanceBeamMarkup(...item)).join("")}</div>`;
}

function patternMarkup(story = false) {
  const symbols = story
    ? ["△", "■", "○", "☆", "▲", "□", "○", "★", "△", "■", "●", "☆", "?"]
    : ["○", "◆", "☆", "♡", "●", "◇", "☆", "♥", "○", "◇", "★", "♡", "○", "?"];
  return `<div class="dual-pattern" role="img" aria-label="모양과 색이 함께 반복되는 규칙">${symbols.map((symbol, index) => `<span class="${symbol === "?" ? "pattern-blank" : ""}">${symbol === "?" ? "" : symbol}</span>${index < symbols.length - 1 ? "" : ""}`).join("")}</div>`;
}

function promiseDiamondMarkup(diagram) {
  return `<div class="promise-diamond">${valueCell(diagram.top,"promise-top")}${valueCell(diagram.left,"promise-left")}${valueCell(diagram.right,"promise-right")}${valueCell(diagram.bottom,"promise-bottom")}</div>`;
}

function book02PromiseMarkup(story = false) {
  const diagrams = story ? [
    { top: 10, left: 2, right: 3, bottom: 5 },
    { top: 15, left: 4, right: 5, bottom: 6 },
    { top: null, left: 6, right: 7, bottom: 8 }
  ] : [
    { top: 6, left: 1, right: 2, bottom: 3 },
    { top: 12, left: 2, right: 3, bottom: 7 },
    { top: 16, left: 5, right: 7, bottom: 4 },
    { top: null, left: 1, right: 8, bottom: 9 },
    { top: 21, left: 10, right: null, bottom: 2 }
  ];
  return `<div class="promise-set">${diagrams.map(promiseDiamondMarkup).join("")}</div>`;
}

function visualMarkup(visual) {
  if (!visual) return "";
  if (visual.kind === "clock") return clockMarkup(visual.value);
  if (visual.kind === "fold-notch-options") return foldNotchMarkup();
  if (visual.kind === "fold-story-options") return foldStoryMarkup();
  if (visual.kind === "fold-star") return '<div class="fold-star"><div class="folded"></div><b>→</b><strong>펼치기</strong></div>';
  if (visual.kind === "equal-line-set") return `<div class="line-diagram-set">${visual.diagrams.map(lineDiagramMarkup).join("")}</div>`;
  if (visual.kind === "equal-line") return lineDiagramMarkup({ shape: "cross", ...visual });
  if (visual.kind === "logic-cards") return '<div class="logic-visual"><span>A</span><span>B</span><span>C</span><b>↔</b><span>서로 다른 선택</span></div>';
  if (visual.kind === "logic-food") return '<div class="logic-visual"><span>민지</span><span>서윤</span><span>도윤</span><b>↔</b><span>김밥</span><span>샌드위치</span><span>떡볶이</span></div>';
  if (visual.kind === "book02-matrix-original") return book02MatrixMarkup(false);
  if (visual.kind === "book02-matrix-story") return book02MatrixMarkup(true);
  if (visual.kind === "book02-balance-original") return book02BalanceMarkup(false);
  if (visual.kind === "book02-balance-story") return book02BalanceMarkup(true);
  if (visual.kind === "book02-dual-pattern-original") return patternMarkup(false);
  if (visual.kind === "book02-dual-pattern-story") return patternMarkup(true);
  if (visual.kind === "book02-promise-original") return book02PromiseMarkup(false);
  if (visual.kind === "book02-promise-story") return book02PromiseMarkup(true);
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
    return `<button type="button" class="lesson-button ${lesson.id === state.lessonId ? "active" : ""} ${complete ? "complete" : ""}" data-lesson="${lesson.id}"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${lesson.title}</strong><small>${lesson.unit}</small></div><em>${complete ? "완료" : "학습"}</em></button>`;
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
    ["concept", "1", "개념"],
    ["original", "2", "골든벨"],
    ["extension", "3", "이야기"],
    ["complete", "4", "완료"]
  ];
  const progress = lessonProgress();
  $("stageSteps").innerHTML = phases.map(([id, number, label]) => {
    const complete = id === "concept" ? state.phase !== "concept" : id === "original" ? progress.original : id === "extension" || id === "complete" ? progress.extension : false;
    return `<button type="button" class="stage-step ${state.phase === id ? "active" : ""} ${complete ? "complete" : ""}" data-phase="${id}" ${phaseAllowed(id) ? "" : "disabled"}><strong>${number}</strong><span>${label}</span></button>`;
  }).join("");
  $("stageSteps").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setPhase(button.dataset.phase)));
}

function renderConcept(lesson) {
  return `<p class="lesson-kicker">${lesson.unit} · 대표 개념</p><h2>${lesson.story.title}</h2><p class="lesson-lead">${lesson.representativeConcept}</p><div class="story-band"><span class="story-icon">?</span><div><strong>${lesson.story.title}</strong><p>${lesson.story.text}<br>${lesson.story.mission}</p></div></div><section class="concept-box"><strong>${lesson.explanation.headline}</strong><ol>${lesson.explanation.steps.map((step) => `<li>${step}</li>`).join("")}</ol></section><button type="button" class="primary-action" data-next-phase="original">다음</button>`;
}

function choiceButtons(groupId, options) {
  return `<div class="answer-choices">${options.map((option) => `<button type="button" class="${state.selections[groupId] === option ? "selected" : ""}" data-choice-group="${groupId}" data-choice="${option}">${option}</button>`).join("")}</div>`;
}

function normalizeAnswer(value) {
  return String(value ?? "").normalize("NFC").trim();
}

function answersMatch(actual, expected) {
  return normalizeAnswer(actual) === normalizeAnswer(expected);
}

function hasAnswer(value) {
  return normalizeAnswer(value) !== "";
}

function escapeAttribute(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function answerControl(groupId, item, scope) {
  if (item.answerMode !== "input") return choiceButtons(groupId, item.options);
  const inputMode = item.inputMode === "numeric" ? "numeric" : "text";
  const label = inputMode === "numeric" ? "답을 숫자로 쓰세요" : "답을 쓰세요";
  return `<label class="answer-input-wrap"><span>${label}</span><input type="text" inputmode="${inputMode}" autocomplete="off" spellcheck="false" value="${escapeAttribute(state.selections[groupId])}" aria-label="${escapeAttribute(item.prompt)} 답" data-input-group="${groupId}" data-answer-scope="${scope}" /></label>`;
}

function renderOriginal(lesson) {
  const result = state.feedback?.kind === "original" ? state.feedback : null;
  const allAnswered = lesson.original.items.every((item) => hasAnswer(state.selections[item.id]));
  return `<div class="quiz-head"><div><span>${lesson.original.title}</span><h2>${lesson.title}</h2></div></div><p class="lesson-lead">${lesson.original.prompt}</p><div class="quiz-visual">${visualMarkup(lesson.original.visual)}</div><div class="quiz-items">${lesson.original.items.map((item) => { const status = result ? answersMatch(state.selections[item.id], item.answer) ? "correct" : "incorrect" : ""; const conditions = item.conditions?.length ? `<ul class="original-conditions">${item.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul>` : ""; return `<section class="quiz-item ${status}"><strong>${item.prompt}</strong>${conditions}${answerControl(item.id, item, "original")}</section>`; }).join("")}</div>${result ? `<p class="feedback ${result.passed ? "success" : ""}">${result.message}</p>` : ""}<button type="button" class="primary-action" data-check="original" ${allAnswered ? "" : "disabled"}>${result?.passed ? "다음" : "확인"}</button>`;
}

function renderExtension(lesson) {
  const groupId = `${lesson.id}:extension`;
  const result = state.feedback?.kind === "extension" ? state.feedback : null;
  const selected = state.selections[groupId];
  return `<div class="quiz-head"><div><span>${lesson.extension.title}</span><h2>${lesson.extension.story}</h2></div></div><p class="lesson-lead">${lesson.extension.prompt}</p><div class="quiz-visual">${visualMarkup(lesson.extension.visual)}</div><section class="quiz-item ${result ? answersMatch(selected, lesson.extension.answer) ? "correct" : "incorrect" : ""}"><strong>${lesson.extension.prompt}</strong>${answerControl(groupId, lesson.extension, "extension")}</section>${result ? `<p class="feedback ${result.passed ? "success" : ""}">${result.message}</p>` : ""}<button type="button" class="primary-action" data-check="extension" ${hasAnswer(selected) ? "" : "disabled"}>${result?.passed ? "완료" : "확인"}</button>`;
}

function renderComplete(lesson) {
  const book = activeBook();
  const nextLesson = book.lessons.find((candidate) => !isLessonComplete(candidate));
  return `<section class="complete-panel"><span class="medal">✓</span><h2>${lesson.title} 학습 완료</h2><p>이 개념을 잘 익혔습니다.</p>${nextLesson ? `<button type="button" class="primary-action" data-next-lesson="${nextLesson.id}">다음</button>` : `<button type="button" class="primary-action" data-book-complete>${book.label} 학습 완료</button>`}</section>`;
}

function renderPending(book) {
  return `<section class="pending-panel"><span>!</span><h2>${book.label} 골든벨 학습 준비 중</h2><p>학습 자료를 준비하고 있습니다.</p></section>`;
}

function bindLessonActions() {
  $("lessonContent").querySelector("[data-next-phase]")?.addEventListener("click", (event) => setPhase(event.currentTarget.dataset.nextPhase));
  $("lessonContent").querySelectorAll("[data-choice-group]").forEach((button) => button.addEventListener("click", () => {
    state.selections[button.dataset.choiceGroup] = button.dataset.choice;
    state.feedback = null;
    renderContent();
  }));
  $("lessonContent").querySelectorAll("[data-input-group]").forEach((input) => input.addEventListener("input", () => {
    state.selections[input.dataset.inputGroup] = input.value;
    state.feedback = null;
    input.closest(".quiz-item")?.classList.remove("correct", "incorrect");
    $("lessonContent").querySelector(".feedback")?.remove();
    const lesson = activeLesson();
    const scope = input.dataset.answerScope;
    const checkButton = $("lessonContent").querySelector(`[data-check="${scope}"]`);
    if (!checkButton) return;
    checkButton.disabled = scope === "original"
      ? !lesson.original.items.every((item) => hasAnswer(state.selections[item.id]))
      : !hasAnswer(state.selections[`${lesson.id}:extension`]);
    checkButton.textContent = "확인";
  }));
  $("lessonContent").querySelector('[data-check="original"]')?.addEventListener("click", () => {
    const lesson = activeLesson();
    if (state.feedback?.kind === "original" && state.feedback.passed) return setPhase("extension");
    const passed = lesson.original.items.every((item) => answersMatch(state.selections[item.id], item.answer));
    if (passed) completeOriginal();
    const retryVerb = lesson.original.items.every((item) => item.answerMode === "input") ? "써" : "골라";
    state.feedback = {
      kind: "original",
      passed,
      message: passed ? "잘했어요. 다음으로 가요." : `${lesson.explanation.headline} 설명을 떠올리고 다시 ${retryVerb} 보세요.`
    };
    render();
  });
  $("lessonContent").querySelector('[data-check="extension"]')?.addEventListener("click", () => {
    const lesson = activeLesson();
    if (state.feedback?.kind === "extension" && state.feedback.passed) return setPhase("complete");
    const selected = state.selections[`${lesson.id}:extension`];
    const passed = answersMatch(selected, lesson.extension.answer);
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
  $("levelState").textContent = book.lessons.length && completed === book.lessons.length ? "완료" : book.lessons.length ? "학습 중" : "준비 중";
  $("bookTitle").textContent = `${book.label} · ${book.title}`;
  $("bookSource").innerHTML = `<strong>학습 안내</strong><br>${book.lessons.length ? "개념을 골든벨과 이야기로 익힙니다." : "준비 중입니다."}`;
}

function render() {
  const book = activeBook();
  if (book.lessons.length && !book.lessons.some((lesson) => lesson.id === state.lessonId)) state.lessonId = book.lessons[0].id;
  renderBookTabs();
  renderLessonList();
  renderSummary();
  if (book.lessons.length) renderStageSteps();
  else $("stageSteps").innerHTML = '<div class="stage-step"><strong>-</strong><span>준비 중</span></div>';
  renderContent();
}

$("studentName").textContent = student;
$("backLink").href = `./?student=${encodeURIComponent(student)}&mode=curriculum`;
render();
