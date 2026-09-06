import { GOLDEN_BELL_BOOKS, goldenBellBookById } from "./golden-bell-data.js?v=20260905e";
import { hasProtectedAnswer, hydrateProtectedAnswers, loadProtectedGoldenBellBook } from "./golden-bell-protected.js?v=20260906c";
import { appendProtectedRecoveryItems } from "./golden-bell-recovery.js?v=20260906b";
import { recordGoldenBellOutcome, summarizeGoldenBellLesson } from "./golden-bell-progress.js?v=20260901a";
import { guidedConceptPrintSummary, guidedConceptVisual } from "./golden-bell-guided-experiences.js?v=20260905d";
import { book01Markup } from "./book01-renderers.js?v=20260904c";
import { book02Markup } from "./book02-renderers.js?v=20260904b";
import { book03Markup } from "./book03-renderers.js?v=20260905a";
import { book04Markup } from "./book04-renderers.js?v=20260905d";
import { book05Markup } from "./book05-renderers.js?v=20260905d";
import { book06Markup } from "./book06-renderers.js?v=20260905d";
import { book07Markup } from "./book07-renderers.js?v=20260906a";
import { book08Markup } from "./book08-renderers.js?v=20260906a";
import { book09Markup } from "./book09-renderers.js?v=20260829b";
import { book10Markup } from "./book10-renderers.js?v=20260904c";
import { sourceAnimationsForLesson, sourceAnimationFrame, sourceAnimationDelay } from "./golden-bell-source-animations.js?v=20260906b";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const requestedBook = params.get("book") || "book-01";
const storageKey = `fields-classic-golden-bell:${student}`;
const protectedBooks = new Set();
const protectedLoads = new Map();
let protectedMessage = "정답과 풀이는 승인번호 확인 후 열립니다.";

async function ensureProtectedBook(bookId) {
  if (protectedBooks.has(bookId)) return true;
  if (protectedLoads.has(bookId)) return protectedLoads.get(bookId);
  const task = loadProtectedGoldenBellBook(bookId, student).then((payload) => {
    const book = goldenBellBookById(bookId);
    hydrateProtectedAnswers(book, payload.answers);
    const recovery = appendProtectedRecoveryItems(book, payload.answers);
    for (const lessonId of recovery.lessonIds) sourceAnimationCache.delete(book.lessons.find((lesson) => lesson.id === lessonId));
    protectedBooks.add(bookId);
    protectedMessage = "";
    return true;
  }).catch((error) => {
    protectedMessage = error.message === "login_required"
      ? "정답과 풀이를 보려면 학습 서재에서 승인번호로 접속해 주세요."
      : error.message === "protected_answers_incomplete"
        ? "정답 자료를 모두 불러오지 못해 채점을 잠시 멈췄어요. 오답으로 기록하지 않습니다."
        : "정답 보호 서버에 연결하지 못했습니다. 잠시 뒤 다시 열어 주세요.";
    return false;
  }).finally(() => protectedLoads.delete(bookId));
  protectedLoads.set(bookId, task);
  return task;
}

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(storageKey) || "{}") || {}; }
  catch { return {}; }
}

const state = {
  bookId: goldenBellBookById(requestedBook).id,
  lessonId: null,
  phase: "concept",
  sourceTrackId: null,
  selections: {},
  originalAssists: {},
  originalChecks: {},
  originalIndex: 0,
  extensionAssist: null,
  extensionIndex: 0,
  feedback: null,
  experience: { step: 0, previousStep: 0, checkStep: 0, answer: null, checks: {}, practice: {}, typeTrackId: null, typeTracks: {}, feedback: null, playing: false, speed: 1, timer: null, autoplayStarted: false },
  progress: loadProgress()
};

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(state.progress));
}

function recordOutcome(scope, itemId, status) {
  const lesson = activeLesson();
  recordGoldenBellOutcome(state.progress, {
    bookId: state.bookId,
    lessonId: lesson.id,
    scope,
    itemId,
    status,
    typeIds: lesson.sourceTypeIds || []
  });
  saveProgress();
}

function activeBook() { return goldenBellBookById(state.bookId); }
function activeLesson() { return activeBook().lessons.find((lesson) => lesson.id === state.lessonId) || activeBook().lessons[0]; }
const sourceAnimationCache = new WeakMap();
function sourceTracks(lesson = activeLesson()) {
  if (!protectedBooks.has(state.bookId)) return [];
  if (!sourceAnimationCache.has(lesson)) sourceAnimationCache.set(lesson, sourceAnimationsForLesson(lesson));
  return sourceAnimationCache.get(lesson);
}
function activeSourceAnimation(lesson = activeLesson()) {
  const tracks = sourceTracks(lesson);
  return tracks.find((track) => track.sourceItemId === state.sourceTrackId) || tracks[0];
}
function activeExperience() { return activeSourceAnimation() || activeLesson().experience; }
function lessonProgress(lesson = activeLesson()) { return state.progress[state.bookId]?.[lesson?.id] || {}; }
function extensionItems(lesson = activeLesson()) {
  return [{ ...lesson.extension, id: `${lesson.id}:extension`, estimatedMinutes: 4 }, ...(lesson.similarPractice || [])];
}
function activeExtensionItem(lesson = activeLesson()) { return extensionItems(lesson)[state.extensionIndex] || extensionItems(lesson)[0]; }

function clearExperiencePlayback() {
  if (state.experience.timer) window.clearTimeout(state.experience.timer);
  state.experience.timer = null;
  state.experience.playing = false;
}

function resetExperience() {
  clearExperiencePlayback();
  state.sourceTrackId = null;
  state.experience.step = 0;
  state.experience.previousStep = 0;
  state.experience.checkStep = 0;
  state.experience.answer = null;
  state.experience.checks = {};
  state.experience.practice = {};
  state.experience.typeTrackId = null;
  state.experience.typeTracks = {};
  state.experience.feedback = null;
  state.experience.autoplayStarted = false;
}

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

function originalProgressComplete(lesson) {
  const progress = lessonProgress(lesson);
  if (!progress.original) return false;
  return lesson.original.items.filter(item => item.answerRef?.startsWith("/recovery/")).every(item =>
    ["correct", "revealed", "skipped"].includes(progress.outcomes?.original?.[item.id]?.status));
}
function isLessonComplete(lesson) { return originalProgressComplete(lesson) && Boolean(lessonProgress(lesson).extension); }

function conceptReady(lesson = activeLesson()) {
  // Concept checks are optional practice, not a prerequisite for the lesson questions.
  return Boolean(lesson?.original?.items?.length);
}

function phaseAllowed(phase) {
  const progress = lessonProgress();
  if (phase === "concept") return true;
  if (phase === "original") return conceptReady();
  if (phase === "extension") return Boolean(progress.original);
  return isLessonComplete(activeLesson());
}

function setPhase(phase) {
  if (!phaseAllowed(phase)) return;
  clearExperiencePlayback();
  state.phase = phase;
  state.selections = {};
  state.originalAssists = {};
  state.originalChecks = {};
  if (phase === "original") {
    const progress = lessonProgress();
    const pending = progress.original ? activeLesson().original.items.findIndex(item =>
      item.answerRef?.startsWith("/recovery/") && !["correct", "revealed", "skipped"].includes(progress.outcomes?.original?.[item.id]?.status)) : -1;
    state.originalIndex = Math.max(0, pending);
  }
  state.extensionAssist = null;
  state.extensionIndex = phase === "extension" ? 0 : state.extensionIndex;
  state.feedback = null;
  render();
}

function clockValueAfterQuarterTurns(start, quarterTurns) {
  return ((start - 1 + quarterTurns * 3) % 12 + 12) % 12 + 1;
}

function clockGeometry(value, centerX = 120, centerY = 90, handLength = 46) {
  const angle = ((value % 12) * Math.PI) / 6;
  return {
    angle,
    x: centerX + Math.sin(angle) * handLength,
    y: centerY - Math.cos(angle) * handLength,
    rotation: (value % 12) * 30
  };
}

function clockArcPath(start, quarterTurns, centerX = 120, centerY = 90, radius = 56) {
  if (!quarterTurns) return "";
  const startPoint = clockGeometry(start, centerX, centerY, radius);
  const endPoint = clockGeometry(clockValueAfterQuarterTurns(start, quarterTurns), centerX, centerY, radius);
  if (Math.abs(quarterTurns) === 4) return `<circle class="experience-clock-trace full" cx="${centerX}" cy="${centerY}" r="${radius}" />`;
  const largeArc = Math.abs(quarterTurns) >= 2 ? 1 : 0;
  const sweep = quarterTurns > 0 ? 1 : 0;
  return `<path class="experience-clock-trace" d="M${startPoint.x.toFixed(1)} ${startPoint.y.toFixed(1)} A${radius} ${radius} 0 ${largeArc} ${sweep} ${endPoint.x.toFixed(1)} ${endPoint.y.toFixed(1)}" />`;
}

function experienceClockMarkup(experience, sceneState = state.experience) {
  const step = Math.max(0, Math.min(sceneState.step, experience.beats.length - 1));
  const previousStep = Math.max(0, Math.min(sceneState.previousStep, experience.beats.length - 1));
  const beat = experience.beats[step];
  const previous = experience.beats[previousStep] || beat;
  const start = experience.start;
  const current = clockValueAfterQuarterTurns(start, beat.quarterTurns);
  const previousValue = clockValueAfterQuarterTurns(start, previous.quarterTurns);
  const animate = step !== previousStep;
  const fromRotation = clockGeometry(previousValue).rotation;
  let toRotation = clockGeometry(current).rotation;
  if (beat.quarterTurns === 4 && previous.quarterTurns === 0) toRotation = fromRotation + 360;
  const ticks = Array.from({ length: 12 }, (_, index) => {
    const point = clockGeometry(index + 1, 120, 90, 61);
    const inner = clockGeometry(index + 1, 120, 90, 55);
    return `<line x1="${inner.x.toFixed(1)}" y1="${inner.y.toFixed(1)}" x2="${point.x.toFixed(1)}" y2="${point.y.toFixed(1)}" />`;
  }).join("");
  const labels = [[12, 120, 30], [3, 180, 94], [6, 120, 154], [9, 60, 94]];
  const trace = beat.action === "transform" ? clockArcPath(start, beat.quarterTurns) : "";
  return `<div class="experience-clock" data-experience-step="${step}" data-current-value="${current}"><svg viewBox="0 0 240 180" role="img" aria-label="${start}에서 출발해 ${current}을 가리키는 시계 바늘"><circle class="experience-clock-face" cx="120" cy="90" r="66" />${ticks}<g class="experience-clock-labels">${labels.map(([value, x, y]) => `<text x="${x}" y="${y}">${value}</text>`).join("")}</g>${trace}<g class="experience-clock-hand ${animate ? "is-moving" : ""}" style="--from-angle:${fromRotation}deg;--to-angle:${toRotation}deg"><line x1="120" y1="90" x2="120" y2="44" /><circle cx="120" cy="90" r="6" /></g><text class="experience-clock-current" x="120" y="176">지금 바늘: ${current}</text></svg><p class="experience-caption" aria-live="polite">${beat.caption}</p></div>`;
}

function clockExperienceSummaryMarkup(experience) {
  return `<div class="gold-print-experience"><p><strong>개념 순서</strong> 2에서 시작해 한 바퀴는 2, 반 바퀴는 8, 반의 반 바퀴는 시계 방향 5·반대 방향 11을 가리킵니다.</p>${experienceClockMarkup({ ...experience, beats: [experience.beats.at(-1)] }, { step: 0, previousStep: 0 })}</div>`;
}

function experienceControlsMarkup(experience, { atFirst, atLast, nextDisabled }) {
  return `<div class="experience-controls" aria-label="개념 재생 제어"><button type="button" class="icon-action" data-experience-action="previous" ${atFirst ? "disabled" : ""} aria-label="이전 단계">‹</button><button type="button" class="secondary-action experience-play" data-experience-action="play">${state.experience.playing ? "멈춤" : "재생"}</button><button type="button" class="icon-action" data-experience-action="next" ${atLast || nextDisabled ? "disabled" : ""} aria-label="다음 단계">›</button><button type="button" class="secondary-action experience-restart" data-experience-action="restart">다시</button><label class="experience-speed"><span>속도</span><select data-experience-speed aria-label="재생 속도"><option value="1" ${state.experience.speed === 1 ? "selected" : ""}>보통</option><option value="2" ${state.experience.speed === 2 ? "selected" : ""}>빠르게</option></select></label></div>`;
}

function renderClockExperience(experience) {
  const currentStep = state.experience.step;
  const atFirst = currentStep === 0;
  const atLast = currentStep === experience.beats.length - 1;
  const check = experience.check;
  const selected = state.experience.answer;
  const feedback = state.experience.feedback;
  return `<section class="concept-experience" aria-label="시계 바늘 체험"><header><div><span>직접 해보기</span><strong>바늘을 움직이며 자리를 확인해요</strong></div><span class="experience-progress">${currentStep + 1} / ${experience.beats.length}</span></header>${experienceClockMarkup(experience)}${experienceControlsMarkup(experience, { atFirst, atLast, nextDisabled: false })}<section class="experience-check"><p>${check.prompt}</p><div class="answer-choices">${check.options.map((option) => `<button type="button" class="${selected === option ? "selected" : ""}" data-experience-choice="${option}">${option}</button>`).join("")}</div>${feedback ? `<p class="feedback ${feedback.passed ? "success" : ""}">${feedback.message}</p>` : ""}</section></section>`;
}

function triangularLayerFormula(layerCount) {
  return Array.from({ length: Math.ceil((Math.sqrt(8 * layerCount + 1) - 1) / 2) }, (_, index) => index + 1).join(" + ");
}

function triangularStairMarkup(beat, reveal) {
  const visual = { kind: "book5", subtype: "tetrahedral-stair", previewStages: [beat.stage], targetStages: reveal ? [] : [beat.stage] };
  const geometry = book05Markup(visual);
  const layerFormula = triangularLayerFormula(beat.layerCount);
  return `<div class="experience-stair" data-experience-step="${state.experience.step}" data-stage="${beat.stage}" data-layer-count="${beat.layerCount}" data-total-count="${beat.totalCount}"><div class="book05-visual experience-stair-model">${geometry}</div><div class="experience-stair-ledger"><p><strong>${beat.stage}층</strong><span>새 층의 삼각 바닥</span></p><b>${reveal ? `${layerFormula} = ${beat.layerCount}개` : `${layerFormula} = ?개`}</b>${reveal ? `<small>지금까지 쌓인 쌓기나무: ${beat.totalCount}개</small>` : ""}</div></div>`;
}

function triangularExperienceSummaryMarkup(experience) {
  const finalBeat = experience.beats.at(-1);
  return `<div class="gold-print-experience gold-print-triangular-experience"><p><strong>개념 순서</strong> 한 층씩 삼각형 바닥이 넓어집니다. 1층은 1개, 2층은 1 + 2 = 3개, 3층은 1 + 2 + 3 = 6개입니다. 각 층의 수를 차례로 더해 다음 단계를 구합니다.</p>${triangularStairMarkup(finalBeat, true)}</div>`;
}

function experienceSummaryMarkup(experience) {
  if (experience.kind === "clock-turning") return clockExperienceSummaryMarkup(experience);
  if (experience.kind === "triangular-stair") return triangularExperienceSummaryMarkup(experience);
  if (experience.kind === "guided-concept") return guidedConceptPrintSummary(experience);
  if (experience.kind === "progressive-concept") return `<div class="gold-print-experience progressive-print-summary"><p><strong>개념 순서</strong> ${experience.beats.map((beat, index) => `${index + 1}. ${beat.caption}`).join(" ")}</p></div>`;
  return "";
}

function conceptPracticeVisual(practice) {
  if (practice.kind === "triangular") {
    return `<div class="concept-practice-triangle" aria-hidden="true">${practice.rows.map((count) => `<span>${Array.from({ length: count }, () => "<i></i>").join("")}</span>`).join("")}</div>`;
  }
  if (practice.kind === "square") {
    const side = Math.sqrt(practice.rows.reduce((sum, value) => sum + value, 0));
    return `<div class="concept-practice-square" style="--practice-side:${side}" aria-hidden="true">${Array.from({ length: side * side }, () => "<i></i>").join("")}</div>`;
  }
  return `<div class="concept-practice-pattern" aria-hidden="true">${practice.values.map((value) => `<b>${value}</b>`).join("<i>→</i>")}</div>`;
}

function conceptPracticeMarkup(experience) {
  if (!experience.practice?.length) return "";
  const cards = experience.practice.map((practice, index) => {
    const result = state.experience.practice[practice.id] || {};
    const complete = ["correct", "revealed"].includes(result.status);
    const feedback = result.status === "correct"
      ? `맞아요. ${practice.explanation}`
      : result.status === "revealed"
        ? `답: ${practice.answer}. ${practice.explanation}`
        : result.status === "wrong"
          ? "그림의 줄을 다시 세어 보고, 필요하면 답 보기를 눌러 확인하세요."
          : "";
    return `<article class="concept-practice-card ${complete ? "complete" : ""}"><header><span>연습 ${index + 1}</span>${complete ? "<b>확인</b>" : ""}</header>${conceptPracticeVisual(practice)}<p>${practice.prompt}</p><div class="answer-choices">${practice.options.map((option) => `<button type="button" class="${result.selected === option ? "selected" : ""}" data-concept-practice-choice="${practice.id}" data-concept-practice-value="${option}">${option}</button>`).join("")}</div><div class="concept-practice-actions"><button type="button" class="secondary-action" data-concept-practice-answer="${practice.id}">답 보기</button></div>${feedback ? `<p class="feedback ${result.status === "correct" ? "success" : ""}">${feedback}</p>` : ""}</article>`;
  }).join("");
  return `<section class="concept-practice" aria-label="삼각수와 사각수 개념 연습"><header><span>개념 연습</span><strong>그림을 보고 바로 확인해요</strong></header><div>${cards}</div></section>`;
}

function oneLineCubeStairMarkup(stage) {
  const geometry = globalThis.GW_GEN;
  const renderer = globalThis.GW_RENDER;
  if (!geometry?.buildSQShape || !geometry?.mapTotal || !renderer?.renderIso) return "";
  const map = geometry.buildSQShape("stair", stage);
  const total = stage * (stage + 1) / 2;
  if (geometry.mapTotal(map) !== total) throw new Error(`One-line cube stair total mismatch at stage ${stage}.`);
  const svg = renderer.renderIso(map, stage, 1, { u: 20 })
    .replace('class="ws-iso"', `class="ws-iso type-track-cube-svg" role="img" aria-label="${stage}단계 한 줄 계단 쌓기나무 ${total}개" data-geometry-kind="one-line-stair" data-stage="${stage}" data-total="${total}"`);
  return `<div class="type-track-cube"><figure>${svg}<figcaption>${stage}단계 · 1 + 2 + 3 = ${total}개</figcaption></figure></div>`;
}

function typeTrackVisual(track) {
  const visual = track.visual || {};
  if (visual.kind === "triangular-rows") {
    return `<div class="type-track-triangle" aria-label="1개, 2개, 3개를 줄마다 놓은 삼각수">${visual.rows.map((count) => `<span>${Array.from({ length: count }, () => "<i></i>").join("")}</span>`).join("")}<b>${visual.formula}</b></div>`;
  }
  if (visual.kind === "triangle-boundaries") {
    return `<div class="type-track-number-rows triangle" aria-label="줄마다 하나씩 늘어나는 수 배열">${visual.rows.map((row) => `<span>${row.map((number, index) => `<i class="${index === 0 || index === row.length - 1 ? "edge" : ""}">${number}</i>`).join("")}</span>`).join("")}<b>줄의 처음과 끝을 함께 봐요</b></div>`;
  }
  if (visual.kind === "square-odd-rows") return `<div class="type-track-book05">${book05Markup({ kind: "book5", subtype: "odd-square", target: visual.odds.length, odds: visual.odds })}</div>`;
  if (visual.kind === "square-array") return `<div class="type-track-book05">${book05Markup({ kind: "book5", subtype: "square-paper-growth", previewStages: visual.stages, target: visual.stages.at(-1) + 1 })}</div>`;
  if (visual.kind === "triangle-tile-square") {
    return `<div class="type-track-triangle-tiles" aria-label="작은 삼각형 조각 수가 1, 4, 9로 늘어나는 배열">${visual.stages.map((count, index) => `<figure><span style="--tile-side:${index + 1}">${Array.from({ length: count }, () => "<i></i>").join("")}</span><figcaption>${count}개</figcaption></figure>`).join("")}</div>`;
  }
  if (visual.kind === "cube-stair") return oneLineCubeStairMarkup(visual.stage);
  if (visual.kind === "tetrahedral") return `<div class="type-track-book05">${book05Markup({ kind: "book5", subtype: "tetrahedral-stair", previewStages: [visual.stage], targetStages: [] })}</div>`;
  return "";
}

function typeTrackRecord(id) {
  return state.experience.typeTracks[id] || {};
}

function typeTrackComplete(record) {
  return ["correct", "revealed"].includes(record.checkStatus) && ["correct", "revealed"].includes(record.practiceStatus);
}

function typeTrackQuestionMarkup(track, stage, record) {
  const item = track[stage];
  const status = record[`${stage}Status`];
  const selected = record[`${stage}Value`];
  const complete = ["correct", "revealed"].includes(status);
  const feedback = status === "correct"
    ? `맞아요. ${item.explanation}`
    : status === "revealed"
      ? `답: ${item.answer}. ${item.explanation}`
      : status === "wrong"
        ? "그림의 줄과 칸을 다시 세어 보고, 필요하면 답 보기를 눌러 확인하세요."
        : "";
  const title = stage === "check" ? "바로 확인" : "유형 문제";
  return `<section class="type-track-question ${complete ? "complete" : ""}"><header><span>${title}</span>${complete ? "<b>확인</b>" : ""}</header><p>${item.prompt}</p><div class="answer-choices">${item.options.map((option) => `<button type="button" class="${selected === option ? "selected" : ""}" data-type-track-check="${track.id}" data-type-track-stage="${stage}" data-type-track-value="${option}" ${complete ? "disabled" : ""}>${option}</button>`).join("")}</div><div class="type-track-actions"><button type="button" class="secondary-action" data-type-track-answer="${track.id}" data-type-track-stage="${stage}" ${complete ? "disabled" : ""}>답 보기</button></div>${feedback ? `<p class="feedback ${status === "correct" ? "success" : ""}">${feedback}</p>` : ""}</section>`;
}

function typeTracksMarkup(experience) {
  const tracks = experience.typeTracks || [];
  if (!tracks.length) return "";
  const activeId = tracks.some((track) => track.id === state.experience.typeTrackId) ? state.experience.typeTrackId : tracks[0].id;
  state.experience.typeTrackId = activeId;
  const active = tracks.find((track) => track.id === activeId);
  const record = typeTrackRecord(active.id);
  const checkComplete = ["correct", "revealed"].includes(record.checkStatus);
  const completedCount = tracks.filter((track) => typeTrackComplete(typeTrackRecord(track.id))).length;
  const tabs = tracks.map((track) => {
    const complete = typeTrackComplete(typeTrackRecord(track.id));
    return `<button type="button" class="${track.id === active.id ? "active" : ""} ${complete ? "complete" : ""}" data-type-track-select="${track.id}" aria-pressed="${track.id === active.id}"><span>${track.group}</span><strong>${track.label}</strong>${complete ? "<i>✓</i>" : ""}</button>`;
  }).join("");
  return `<section class="type-study" aria-label="삼각수와 사각수 유형별 학습"><header><div><span>유형별 개념 지도</span><strong>그림 구조가 다르면 읽는 방법도 달라요</strong></div><b>${completedCount} / ${tracks.length} 유형 확인</b></header><nav class="type-track-tabs" aria-label="삼각수와 사각수 유형 선택">${tabs}</nav><article class="type-track-panel"><header><div><span>${active.group}</span><h3>${active.label}</h3></div><em>교재 연결 유형</em></header><p class="type-track-explanation">${active.explanation}</p>${typeTrackVisual(active)}${typeTrackQuestionMarkup(active, "check", record)}${checkComplete ? typeTrackQuestionMarkup(active, "practice", record) : ""}</article></section>`;
}

function renderTriangularStairExperience(experience) {
  const currentStep = state.experience.step;
  const beat = experience.beats[currentStep];
  const atFirst = currentStep === 0;
  const atLast = currentStep === experience.beats.length - 1;
  const checkBeat = experience.beats[state.experience.checkStep];
  const checked = state.experience.checks[checkBeat.id] === true;
  const checksComplete = experience.beats.every((candidate) => state.experience.checks[candidate.id] === true);
  const feedback = state.experience.feedback;
  const progress = experience.beats.map((candidate, index) => `<i class="${index < currentStep ? "done" : index === currentStep ? "current" : ""}" aria-label="${candidate.stage}층 ${index < currentStep ? "설명 완료" : "설명 중"}">${candidate.stage}</i>`).join("");
  const successBurst = feedback?.passed ? `<div class="experience-success-burst show" aria-hidden="true"><strong>정확해!</strong><span></span><span></span><span></span><span></span><span></span><span></span></div>` : "";
  const nextCheck = checked && !checksComplete ? `<button type="button" class="secondary-action experience-check-next" data-experience-action="next-check">다음 확인</button>` : "";
  const stageCheck = `<section class="experience-stage-check" aria-label="단계별 확인"><header><span>단계별 확인</span><strong>${state.experience.checkStep + 1}층을 확인해요</strong><b>${state.experience.checkStep + 1} / ${experience.beats.length}</b></header><div class="experience-check"><p>${checkBeat.check.prompt}</p><div class="answer-choices">${checkBeat.check.options.map((option) => `<button type="button" class="${state.experience.answer === option ? "selected" : ""}" data-experience-choice="${option}" ${checked ? "disabled" : ""}>${option}</button>`).join("")}</div>${feedback ? `<p class="feedback ${feedback.passed ? "success" : ""}">${feedback.message}</p>` : ""}${nextCheck}</div></section>`;
  return `${typeTracksMarkup(experience)}<section class="concept-experience concept-experience-stair" aria-label="삼각 계단 쌓기나무 설명과 확인"><header><div><span>개념 설명</span><strong>${experience.title}</strong></div><span class="experience-progress">${currentStep + 1} / ${experience.beats.length}</span></header><div class="experience-step-track" aria-label="쌓기나무가 자라는 순서">${progress}</div>${triangularStairMarkup(beat, true)}${experienceControlsMarkup(experience, { atFirst, atLast, nextDisabled: false })}<details class="concept-hint"><summary>개념 힌트</summary><p>${experience.hint}</p></details>${stageCheck}${checksComplete ? conceptPracticeMarkup(experience) : ""}${successBurst}</section>`;
}

function renderGuidedConceptExperience(experience) {
  const currentStep = state.experience.step;
  const atFirst = currentStep === 0;
  const atLast = currentStep === experience.beats.length - 1;
  const checkKey = `guided:${activeLesson().id}`;
  const checkStatus = state.experience.checks[checkKey];
  const complete = ["correct", "revealed"].includes(checkStatus);
  const progress = experience.beats.map((beat, index) => `<i class="${index < currentStep ? "done" : index === currentStep ? "current" : ""}">${index + 1}</i>`).join("");
  const check = atLast ? `<section class="experience-check guided-check"><p>${experience.check.prompt}</p><div class="answer-choices">${experience.check.options.map((option) => `<button type="button" class="${state.experience.answer === option ? "selected" : ""}" data-experience-choice="${escapeAttribute(option)}" ${complete ? "disabled" : ""}>${option}</button>`).join("")}</div><button type="button" class="secondary-action guided-answer" data-experience-answer ${complete ? "disabled" : ""}>답 보기</button>${state.experience.feedback ? `<p class="feedback ${state.experience.feedback.passed ? "success" : ""}">${state.experience.feedback.message}</p>` : ""}</section>` : '<p class="guided-check-wait">마지막 장면까지 살펴보면 확인 문제가 열립니다.</p>';
  return `<section class="concept-experience guided-concept" data-guided-family="${experience.family}"><header><div><span>직접 해보기</span><strong>${experience.title}</strong></div><span class="experience-progress">${currentStep + 1} / ${experience.beats.length}</span></header><div class="experience-step-track">${progress}</div><div class="guided-concept-scene">${guidedConceptVisual(experience, currentStep)}<p class="experience-caption">${experience.beats[currentStep].caption}</p></div>${experienceControlsMarkup(experience, { atFirst, atLast, nextDisabled: false })}<details class="concept-hint"><summary>개념 힌트</summary><p>${experience.hint}</p></details>${check}</section>`;
}

function renderSourceExperience(lesson) {
  const tracks = sourceTracks(lesson);
  const animation = activeSourceAnimation(lesson);
  const authorized = protectedBooks.has(state.bookId);
  const step = authorized ? Math.min(state.experience.step, animation.beats.length - 1) : 0;
  const beat = animation.beats[step];
  const animate = authorized && state.experience.previousStep < step && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const picker = `<label class="source-animation-picker"><span>함께 풀어볼 문제</span><select data-source-track aria-label="설명할 문제 선택">${tracks.map((track, index) => `<option value="${escapeAttribute(track.sourceItemId)}" ${track === animation ? "selected" : ""}>${index + 1}. ${escapeAttribute(track.label)}</option>`).join("")}</select></label>`;
  const steps = animation.beats.map((frame, index) => `<button type="button" data-source-step="${index}" aria-label="${index + 1}단계${authorized ? `: ${escapeAttribute(frame.caption)}` : ""}" ${index === step ? 'aria-current="step"' : ""} ${!authorized && index > 0 ? "disabled" : ""}>${index + 1}</button>`).join("");
  const markup = `<section class="concept-experience source-animation" data-source-family="${escapeAttribute(animation.family)}" data-source-item="${escapeAttribute(animation.sourceItemId)}"><header><div><span>개념 설명</span><strong>${escapeAttribute(animation.title)}</strong></div><span class="experience-progress">${step + 1} / ${animation.beats.length}</span></header>${picker}<p class="source-animation-problem">${escapeAttribute(animation.problem)}</p><div class="experience-step-track" aria-label="풀이 순서">${steps}</div><div class="source-animation-scene">${sourceAnimationFrame(animation, step, { animate })}</div><p class="experience-caption">${escapeAttribute(beat.caption)}</p>${experienceControlsMarkup(animation, { atFirst: step === 0, atLast: step === animation.beats.length - 1, nextDisabled: !authorized })}</section>`;
  state.experience.previousStep = step;
  return markup;
}

function progressiveSumMatrixMarkup(lesson, visualStep, currentStep) {
  const visual = lesson.original.visual.panels[0].visual;
  const symbols = visual.cells.flat();
  const valuesByCell = visualStep.valuesByCell || {};
  const valuesBySymbol = visualStep.valuesBySymbol || {};
  const cells = symbols.map((symbol, index) => {
    const value = valuesByCell[index] ?? valuesBySymbol[symbol];
    const solved = value !== undefined;
    return `<span class="${solved ? "solved" : ""}" data-symbol="${escapeAttribute(symbol)}">`
      + `<i aria-hidden="true">${symbol}</i>${solved ? `<strong class="matrix-revealed-value" data-matrix-value="${escapeAttribute(value)}">${value}</strong>` : ""}</span>`;
  }).join("");
  const target = visualStep.target || "?";
  return `<div class="progressive-sum-matrix" data-matrix-step="${currentStep + 1}" role="img" aria-label="도형값을 차례로 바꾸어 넣는 덧셈 매트릭스"><div class="b8-sum-matrix"><div class="cells">${cells}</div><div class="rows">${visual.rowTotals.map((value) => `<b>${value}</b>`).join("")}</div><div class="columns">${visual.columnTotals.map((value) => `<b class="${value === "?" ? "target" : ""}">${value === "?" ? target : value}</b>`).join("")}</div></div><p class="matrix-substitution-ledger">${visualStep.calculation}</p></div>`;
}

function progressiveVisualMarkup(lesson, experience, currentStep) {
  const beatVisual = experience.beats[currentStep]?.visual;
  if (beatVisual) return visualMarkup(beatVisual);
  const visualStep = experience.visualProgression?.[currentStep];
  if (lesson.id === "addition-sum-matrix" && visualStep) return progressiveSumMatrixMarkup(lesson, visualStep, currentStep);
  return visualMarkup(lesson.original.visual);
}

function renderProgressiveConceptExperience(lesson, experience) {
  const currentStep = state.experience.step;
  const atFirst = currentStep === 0;
  const atLast = currentStep === experience.beats.length - 1;
  const checkKey = `guided:${lesson.id}`;
  const complete = ["correct", "revealed"].includes(state.experience.checks[checkKey]);
  const actionLabels = { reveal: "문제 살펴보기", highlight: "규칙 찾기", verify: "풀이 확인" };
  const progress = experience.beats.map((beat, index) => `<i class="${index < currentStep ? "done" : index === currentStep ? "current" : ""}" aria-label="${index + 1}단계 ${index < currentStep ? "완료" : index === currentStep ? "학습 중" : "대기"}">${index + 1}</i>`).join("");
  const beat = experience.beats[currentStep];
  const check = atLast ? `<section class="experience-check progressive-check"><p>${experience.check.prompt}</p><div class="answer-choices">${experience.check.options.map((option) => `<button type="button" class="${state.experience.answer === option ? "selected" : ""}" data-experience-choice="${escapeAttribute(option)}" ${complete ? "disabled" : ""}>${option}</button>`).join("")}</div><button type="button" class="secondary-action guided-answer" data-experience-answer ${complete ? "disabled" : ""}>답 보기</button>${state.experience.feedback ? `<p class="feedback ${state.experience.feedback.passed ? "success" : ""}">${state.experience.feedback.message}</p>` : ""}</section>` : '<p class="guided-check-wait">설명을 끝까지 살펴보면 확인 문제가 열립니다.</p>';
  return `<section class="concept-experience progressive-concept" data-progressive-family="${escapeAttribute(experience.family)}" data-progressive-step="${currentStep + 1}"><header><div><span>개념 설명</span><strong>${experience.title}</strong></div><span class="experience-progress">${currentStep + 1} / ${experience.beats.length}</span></header><div class="experience-step-track" aria-label="개념 학습 순서">${progress}</div><div class="progressive-concept-scene"><div class="progressive-visual">${progressiveVisualMarkup(lesson, experience, currentStep)}</div><div class="progressive-reasoning"><span>${actionLabels[beat.action]}</span><p>${beat.caption}</p></div></div>${experienceControlsMarkup(experience, { atFirst, atLast, nextDisabled: false })}<details class="concept-hint"><summary>개념 힌트</summary><p>${experience.hint}</p></details>${check}</section>`;
}

function renderExperience(lesson) {
  if (sourceTracks(lesson).length) return renderSourceExperience(lesson);
  const experience = lesson.experience;
  if (!experience) return "";
  if (experience.kind === "clock-turning") return renderClockExperience(experience);
  if (experience.kind === "triangular-stair") return renderTriangularStairExperience(experience);
  if (experience.kind === "guided-concept") return renderGuidedConceptExperience(experience);
  if (experience.kind === "progressive-concept") return renderProgressiveConceptExperience(lesson, experience);
  return "";
}

function updateExperienceStep(step, { animate = true } = {}) {
  const experience = activeExperience();
  if (!experience) return;
  if (experience.kind === "source-animation" && !protectedBooks.has(state.bookId)) return;
  clearExperiencePlayback();
  state.experience.previousStep = animate ? state.experience.step : step;
  state.experience.step = Math.max(0, Math.min(step, experience.beats.length - 1));
  renderContent();
}

function playExperience() {
  const experience = activeExperience();
  if (!experience) return;
  if (experience.kind === "source-animation" && !protectedBooks.has(state.bookId)) return;
  if (state.experience.playing) {
    clearExperiencePlayback();
    renderContent();
    return;
  }
  if (state.experience.step >= experience.beats.length - 1) {
    state.experience.previousStep = 0;
    state.experience.step = 0;
  }
  state.experience.playing = true;
  const next = () => {
    if (!state.experience.playing) return;
    if (state.experience.step >= experience.beats.length - 1) {
      clearExperiencePlayback();
      renderContent();
      return;
    }
    state.experience.previousStep = state.experience.step;
    state.experience.step += 1;
    renderContent();
    state.experience.timer = window.setTimeout(next, experience.kind === "source-animation"
      ? sourceAnimationDelay(experience, state.experience.step, state.experience.speed)
      : 1500 / state.experience.speed);
  };
  renderContent();
  state.experience.timer = window.setTimeout(next, experience.kind === "source-animation"
    ? sourceAnimationDelay(experience, state.experience.step, state.experience.speed)
    : 500 / state.experience.speed);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.experience.playing) {
    clearExperiencePlayback();
    renderContent();
  }
});

function scheduleTriangularAutoplay(lesson) {
  if (state.phase !== "concept" || lesson?.experience?.kind !== "triangular-stair" || state.experience.autoplayStarted) return;
  state.experience.autoplayStarted = true;
  window.setTimeout(() => {
    if (state.phase === "concept" && activeLesson()?.id === lesson.id) playExperience();
  }, 650);
}

function clockMarkup(value) {
  const handAngle = ((value % 12) * Math.PI) / 6;
  const handX = 100 + Math.sin(handAngle) * 34;
  const handY = 74 - Math.cos(handAngle) * 34;
  const markerId = `clock-arrow-${value}`;
  return `<svg class="clock-svg source-clock" viewBox="0 0 200 150" role="img" aria-label="12, 3, 6, 9가 표시되고 ${value}를 가리키는 시계 바늘"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#178bc0" /></marker></defs><rect x="44" y="18" width="112" height="112" fill="#f5f6f7" /><text class="clock-cardinal" x="100" y="30">12</text><text class="clock-cardinal" x="144" y="74">3</text><text class="clock-cardinal" x="100" y="118">6</text><text class="clock-cardinal" x="56" y="74">9</text><line class="hand" x1="100" y1="74" x2="${handX.toFixed(1)}" y2="${handY.toFixed(1)}" marker-end="url(#${markerId})" /><circle cx="100" cy="74" r="9" fill="#a6a9ac" /><circle cx="100" cy="74" r="4" fill="#d9dcde" /></svg>`;
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
  const accessibleLeft = String(left).replace(/<[^>]*>/g, "").trim() || "왼쪽 물체";
  const accessibleRight = String(right).replace(/<[^>]*>/g, "").trim() || "오른쪽 물체";
  return `<div class="balance-unit" role="img" aria-label="${accessibleLeft}와 ${accessibleRight}의 양팔저울"><div class="balance-load left">${left}</div><div class="balance-load right">${right}</div><div class="balance-beam ${sideClass}"><span></span><span></span></div><div class="balance-stand"></div></div>`;
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

function book03SixMarkup(story = false) {
  if (story) return '<div class="equation-board single"><span>8 × 25 + 16</span><b>=</b><span>8 × <i>□</i></span></div>';
  const equations = [
    "6 + 6 + 6 + 6 + 60 = 6 × □",
    "6 × 20 + 6 = 6 × □",
    "6 × 28 + 6 + 6 = 6 × □",
    "6 + 6 + 6 + 6 = 6 × □ = 12 × □ = 24 × □",
    "12 × 7 = 6 × □ = 3 × □ = 2 × □",
    "6 × 124 - 6 = 6 × □",
    "6 × 79 - 12 = 6 × □",
    "275 × 6 - 18 = 6 × □"
  ];
  return `<div class="equation-board">${equations.map((equation) => `<span>${equation.replaceAll("□", "<i>□</i>")}</span>`).join("")}</div>`;
}

function unitBarMarkup(count, label) {
  return `<div class="unit-bar" aria-label="${label} ${count}칸"><b>${label}</b><span>${Array.from({ length: count }, () => "<i></i>").join("")}</span></div>`;
}

function dotGroupMarkup(count, label) {
  return `<div class="dot-group" aria-label="${label} ${count}개"><b>${label}</b><span>${Array.from({ length: count }, () => "<i></i>").join("")}</span></div>`;
}

function book03MultipleMarkup(story = false) {
  if (story) return `<div class="multiple-story"><strong>48</strong><span>${Array.from({ length: 8 }, () => "<i>6</i>").join("")}</span></div>`;
  return `<div class="multiple-board"><div>${unitBarMarkup(1,"A")}${unitBarMarkup(4,"B")}</div><div>${dotGroupMarkup(6,"A")}${dotGroupMarkup(1,"B")}</div><div class="multiple-facts"><span>6+6+6+6+6+6+6 = 42</span><span>16은 8과 2의 배수</span><span>35는 7과 5의 배수</span></div></div>`;
}

function verticalAdditionMarkup(rows, label) {
  const result = rows.at(-1);
  const addends = rows.slice(0, -1);
  return `<figure class="vertical-addition"><figcaption>${label}</figcaption><div>${addends.map((row, index) => `<span>${index === addends.length - 1 ? "<b>+</b>" : ""}${row}</span>`).join("")}<strong>${result}</strong></div></figure>`;
}

function book03CryptarithmMarkup(story = false) {
  const panels = story
    ? [["□", "□", "□", "△2"]]
    : [["□", "□", "6"], ["□", "□", "△6"], ["□", "□", "□", "6"], ["□", "□", "□", "△1"]];
  return `<div class="vertical-addition-set ${story ? "single" : ""}">${panels.map((rows, index) => verticalAdditionMarkup(rows, story ? "" : `(${index + 1})`)).join("")}</div>`;
}

function magicGridMarkup(cells, label) {
  return `<figure class="magic-grid-wrap"><figcaption>${label}</figcaption><div class="magic-grid">${cells.map((cell) => `<span class="${cell === "△" ? "target" : ""}">${cell ?? ""}</span>`).join("")}</div></figure>`;
}

function book03MagicMarkup(story = false) {
  const grids = story
    ? [["2","7","6","9","5","1","4","△","8"]]
    : [
      [null,null,null,"6","10","14","8","△",null],
      ["12","9",null,null,"15",null,null,"△","18"],
      [null,null,"11","△","9",null,"7",null,"3"],
      [null,"3","8",null,"7","△","6",null,null]
    ];
  return `<div class="magic-grid-set ${story ? "single" : ""}">${grids.map((cells, index) => magicGridMarkup(cells, story ? "" : `${index + 1}`)).join("")}</div>`;
}

function polyominoShapeMarkup(cells, label) {
  const width = Math.max(...cells.map(([x]) => x)) + 1;
  const height = Math.max(...cells.map(([, y]) => y)) + 1;
  const blocks = cells.map(([x, y]) => `<i style="grid-column:${x + 1};grid-row:${y + 1}"></i>`).join("");
  return `<figure class="polyomino-shape" aria-label="${label}"><div style="--shape-columns:${width};--shape-rows:${height}">${blocks}</div></figure>`;
}

const polyominoNames = ["", "모노미노", "도미노", "트리미노", "테트로미노"];

function polyominoVocabularyMarkup() {
  const terms = polyominoNames.slice(1).map((name, index) => {
    const count = index + 1;
    const sample = Array.from({ length: count }, (_, x) => [x, 0]);
    return `<div class="polyomino-term" data-polyomino-count="${count}"><dt><span>정사각형 ${count}개</span><strong>${name}</strong></dt><dd>${polyominoShapeMarkup(sample, `${name}: 정사각형 ${count}개를 변끼리 붙인 모양의 한 예`)}</dd></div>`;
  }).join("");
  return `<section class="polyomino-vocabulary" aria-label="폴리오미노 이름 알아보기"><h3>조각 수에 따라 이름이 달라요</h3><p>크기가 같은 정사각형을 변끼리 이어 만든 평면 모양을 <strong>폴리오미노</strong>라고 해요. 꼭짓점만 닿게 붙이지 않아요.</p><dl>${terms}</dl><p>이름은 <strong>정사각형 조각의 수</strong>를 알려 줘요. 만들 수 있는 모양의 가짓수와는 달라요.</p><p>이 활동에서는 돌리거나 뒤집어서 꼭 포개지면 같은 종류로 세어요.</p></section>`;
}

function polyominoFamilyMarkup(count, shapes) {
  return `<section class="polyomino-family"><strong>정사각형 ${count}개 · ${polyominoNames[count]}</strong><div>${shapes.map((shape, index) => polyominoShapeMarkup(shape, `${polyominoNames[count]} 모양 ${index + 1}`)).join("")}</div></section>`;
}

function book04PolyominoMarkup(story = false) {
  const families = [
    [1, [[[0, 0]]]],
    [2, [[[0, 0], [1, 0]]]],
    [3, [[[0, 0], [1, 0], [2, 0]], [[0, 0], [0, 1], [1, 1]]]],
    [4, [
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[0, 0], [1, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [2, 0], [1, 1]],
      [[0, 0], [0, 1], [0, 2], [1, 2]],
      [[1, 0], [2, 0], [0, 1], [1, 1]]
    ]]
  ];
  const visible = story ? families.slice(2) : families;
  return `<div class="polyomino-board ${story ? "story" : ""}">${visible.map(([count, shapes]) => polyominoFamilyMarkup(count, shapes)).join("")}</div>`;
}

function normalizedHeightMap(map) {
  const depth = map.length;
  const width = Math.max(...map.map((row) => row.length));
  return map.map((row) => Array.from({ length: width }, (_, index) => Number(row[index] || 0)));
}

function hiddenCubeSceneMetrics(scene) {
  const geometry = globalThis.GW_GEN;
  if (!geometry?.mapTotal || !geometry?.countHiddenWalled) {
    throw new Error("Geometry worksheet cube data is required for hidden-cube visuals.");
  }
  const map = normalizedHeightMap(scene.map);
  const total = geometry.mapTotal(map);
  const hidden = geometry.countHiddenWalled(map);
  const visible = total - hidden;
  if (scene.expected) {
    for (const [key, actual] of Object.entries({ total, visible, hidden })) {
      if (Number(scene.expected[key]) !== actual) throw new Error(`Hidden-cube ${key} mismatch: expected ${scene.expected[key]}, received ${actual}.`);
    }
  }
  return { map, width: map[0].length, depth: map.length, total, visible, hidden };
}

function hiddenCubeIsoMarkup(scene, options = {}) {
  const renderer = globalThis.GW_RENDER;
  if (!renderer?.renderIso) throw new Error("Geometry worksheet cube renderer is required for hidden-cube visuals.");
  const metrics = hiddenCubeSceneMetrics(scene);
  const label = `전체 ${metrics.total}개 · 보이는 것 ${metrics.visible}개`;
  const svg = renderer.renderIso(metrics.map, metrics.width, metrics.depth, {
    u: options.u || 24,
    topLabels: options.topLabels !== false,
    topLabelColor: "#d9473f",
    topLabelSize: options.topLabelSize || 15
  }).replace('class="ws-iso"', `class="ws-iso book04-geometry-cubes" role="img" aria-label="${label}" data-geometry-kind="hidden-height-map" data-total="${metrics.total}" data-visible="${metrics.visible}" data-hidden="${metrics.hidden}"`);
  return { ...metrics, label, svg };
}

function cubeHeightMapMarkup(map) {
  const width = map[0].length;
  const cells = map.flatMap((row, z) => row.map((height, x) => `<span class="${height ? "filled" : "empty"}" data-column-x="${x}" data-column-z="${z}">${height || ""}</span>`)).join("");
  return `<figure class="cube-height-map"><div style="--height-map-columns:${width}">${cells}</div><figcaption>위에서 본 바탕 그림</figcaption></figure>`;
}

function book04HiddenCubeConceptMarkup(visual) {
  const scene = hiddenCubeIsoMarkup(visual, { u: 28, topLabels: true, topLabelSize: 17 });
  const phase = visual.phase || "height";
  const equation = phase === "height"
    ? `<strong>윗면의 수 = 그 기둥의 층수</strong><span>${scene.map.flat().filter(Boolean).join(" · ")}</span>`
    : phase === "total"
      ? `<strong>${scene.map.flat().filter(Boolean).join(" + ")} = ${scene.total}</strong><span>층수를 모두 더하면 전체 수</span>`
      : `<strong>${scene.total} - ${scene.visible} = ${scene.hidden}</strong><span>전체 수 - 보이는 수 = 숨은 수</span>`;
  return `<div class="hidden-cube-concept-visual" data-hidden-cube-phase="${phase}" data-total="${scene.total}" data-visible="${scene.visible}" data-hidden="${scene.hidden}"><figure class="hidden-cube-iso">${scene.svg}<figcaption>각 윗면의 숫자를 먼저 읽어요</figcaption></figure>${phase === "height" ? "" : cubeHeightMapMarkup(scene.map)}<p class="hidden-cube-equation">${equation}</p></div>`;
}

function book04HiddenCubesMarkup(visual) {
  const scenes = visual.scenes || [];
  const markup = scenes.map((scene) => {
    const rendered = hiddenCubeIsoMarkup(scene, { u: scenes.length === 1 ? 25 : 18, topLabels: visual.topLabels !== false, topLabelSize: scenes.length === 1 ? 16 : 13 });
    return `<figure class="cube-scene" data-hidden="${rendered.hidden}">${rendered.svg}<figcaption>${rendered.label}</figcaption></figure>`;
  }).join("");
  return `<div class="cube-scene-set ${scenes.length === 1 ? "single" : ""}">${markup}</div>`;
}

function balanceTokensMarkup(symbol, count, className) {
  return `<span class="balance-tokens ${className}">${Array.from({ length: count }, () => `<i>${symbol}</i>`).join("")}</span>`;
}

function book04BalanceMarkup(story = false) {
  const square = (count) => balanceTokensMarkup("", count, "squares");
  const triangle = (count) => balanceTokensMarkup("", count, "triangles");
  const circle = (count) => balanceTokensMarkup("", count, "circles");
  const star = (count) => balanceTokensMarkup("★", count, "stars");
  if (story) return `<div class="balance-substitution single">${balanceBeamMarkup(star(1), square(2), "level")}${balanceBeamMarkup(circle(1), `${star(1)}${square(1)}`, "level")}</div>`;
  return `<div class="balance-substitution"><section><strong>(1)</strong>${balanceBeamMarkup(`${triangle(2)}${square(2)}`, square(6), "level")}${balanceBeamMarkup(circle(1), `${triangle(1)}${square(1)}`, "level")}</section><section><strong>(2)</strong>${balanceBeamMarkup(`${triangle(2)}${square(5)}`, `${triangle(3)}${square(3)}`, "level")}${balanceBeamMarkup(triangle(4), '<span class="balance-question">?</span>', "level")}</section></div>`;
}

function directionMapMarkup(markerIndex, label) {
  const cells = Array.from({ length: 4 }, (_, index) => `<span class="${index === markerIndex ? "target" : ""}"><i></i>${index === markerIndex ? "㉮" : ""}</span>`).join("");
  return `<figure class="direction-map"><div class="direction-grid">${cells}<b class="north">북</b><b class="south">남</b><b class="west">서</b><b class="east">동</b></div><figcaption>${label}</figcaption></figure>`;
}

function book04DirectionMarkup(story = false) {
  const maps = story ? [directionMapMarkup(0, "마을 건물")] : [directionMapMarkup(0, "장소"), directionMapMarkup(3, "친구의 집")];
  return `<div class="direction-map-set ${story ? "single" : ""}">${maps.join("")}</div>`;
}

function book05SetMarkup(visual) {
  return `<div class="gold-b5-set">${visual.panels.map((panel) => `<figure><div class="book05-visual">${book05Markup({ kind: "book5", ...panel.visual })}</div><figcaption>${panel.label}</figcaption></figure>`).join("")}</div>`;
}

function book06SetMarkup(visual) {
  return `<div class="gold-b6-set">${visual.panels.map((panel) => `<figure><div class="book06-visual">${book06Markup({ kind: "book6", ...panel.visual })}</div><figcaption>${panel.label}</figcaption></figure>`).join("")}</div>`;
}

function book07SetMarkup(visual) {
  return `<div class="gold-b7-set">${visual.panels.map((panel) => `<figure><div class="book07-visual">${book07Markup({ kind: "book7", ...panel.visual })}</div><figcaption>${panel.label}</figcaption></figure>`).join("")}</div>`;
}

function book08SetMarkup(visual) {
  return `<div class="gold-b8-set">${visual.panels.map((panel) => `<figure><div class="book08-visual">${book08Markup({ kind: "book8", ...panel.visual })}</div><figcaption>${panel.label}</figcaption></figure>`).join("")}</div>`;
}

function book09SetMarkup(visual) {
  return `<div class="gold-b9-set">${visual.panels.map((panel) => `<figure><div class="book09-visual">${book09Markup({ kind: "book9", ...panel.visual })}</div><figcaption>${panel.label}</figcaption></figure>`).join("")}</div>`;
}

function generatedShapeSumMarkup(visual) {
  return `<div class="similar-shape-sum" role="img" aria-label="가로와 세로의 합 표"><div><span>◇</span><span>◇</span><b>${visual.rowOne}</b><span>□</span><span>○</span><b>?</b><b>${visual.columnOne}</b><b>${visual.columnTwo}</b></div></div>`;
}

function generatedBalanceOrderMarkup(visual) {
  const scale = ({ left, right, heavier }) => `<div class="similar-balance ${heavier}"><strong>${left}</strong><span><i></i></span><strong>${right}</strong></div>`;
  return `<div class="similar-balance-set" aria-label="두 물체의 무게를 비교하는 양팔저울">${visual.relations.map(scale).join("")}</div>`;
}

function generatedPatternMarkup(visual) {
  const symbols = { circle: ["○", "●"], triangle: ["△", "▲"], square: ["□", "■"], diamond: ["◇", "◆"], star: ["☆", "★"] };
  const item = (value) => Array.from({ length: value.count }, () => symbols[value.shape]?.[value.filled ? 1 : 0] || "○").join("");
  return `<div class="similar-pattern" role="img" aria-label="모양과 색의 반복 규칙">${visual.items.map((value) => `<span>${item(value)}</span>`).join("")}<b>?</b></div>`;
}

function generatedCenterRuleMarkup(visual) {
  return `<div class="similar-center-rules">${visual.items.map((item, index) => `<figure><div><span class="top">${item.outer[0]}</span><span class="right">${item.outer[1]}</span><span class="bottom">${item.outer[2]}</span><span class="left">${item.outer[3]}</span><strong>${item.hidden ? "?" : item.center}</strong></div><figcaption>${index + 1}</figcaption></figure>`).join("")}</div>`;
}

function generatedCryptarithmMarkup(visual) {
  const addends = visual.addends || [visual.first, visual.second];
  const width = Math.max(...addends.map((row) => row.length), visual.sum.length);
  const row = (cells, sign = "") => `<div><b>${sign}</b>${Array.from({ length: width - cells.length }, () => "<i></i>").join("")}${cells.map((cell) => `<i>${cell}</i>`).join("")}</div>`;
  return `<div class="similar-cryptarithm">${addends.map((cells, index) => row(cells, index === addends.length - 1 ? "+" : "")).join("")}<hr>${row(visual.sum)}</div>`;
}

function book04SourceBalanceMarkup(visual) {
  const shapes = { "네모": "squares", "세모": "triangles", "동그라미": "circles", "별": "stars" };
  const load = (objects) => Object.entries(objects).map(([label, count]) => {
    if (label === "빈접시" || count == null) return '<span class="balance-question">?</span>';
    if (shapes[label]) return balanceTokensMarkup(label === "별" ? "★" : "", count, shapes[label]);
    return `<span class="balance-tokens labeled">${Array.from({ length: count }, () => `<i>${escapeAttribute(label)}</i>`).join("")}</span>`;
  }).join("");
  const sameLoad = (left, right) => Object.keys(left).length === Object.keys(right).length
    && Object.entries(left).every(([key, value]) => right[key] === value);
  const equations = [...visual.equations];
  if (!equations.some((equation) => sameLoad(equation.left, visual.target.left) || sameLoad(equation.right, visual.target.left))) equations.push(visual.target);
  return `<div class="balance-substitution single source-balance-board">${equations.map((equation) => balanceBeamMarkup(load(equation.left), load(equation.right), "level")).join("")}</div>`;
}

function simplePracticeMarkup(visual) {
  if (visual.kind === "practice-expression") return `<div class="practice-expression">${visual.expression}</div>`;
  if (visual.kind === "practice-groups") return `<div class="practice-groups"><strong>${visual.total}</strong><span>${Array.from({ length: visual.groups }, () => `<i>${visual.unit}</i>`).join("")}</span></div>`;
  return "";
}

function visualMarkup(visual) {
  if (!visual) return "";
  if (visual.kind === "book2") return `<div class="book02-visual">${book02Markup(visual)}</div>`;
  if (visual.kind === "book1") return `<div class="book01-visual">${book01Markup(visual)}</div>`;
  if (visual.kind === "book3") return `<div class="book03-visual">${book03Markup(visual)}</div>`;
  if (visual.kind === "book4" && visual.subtype === "source-hidden-cube") {
    return book04HiddenCubesMarkup({ scenes: [visual], topLabels: true });
  }
  if (visual.kind === "book4" && visual.subtype === "source-balance-equations") return book04SourceBalanceMarkup(visual);
  if (visual.kind === "book4") return `<div class="book04-visual">${book04Markup(visual)}</div>`;
  if (visual.kind === "shape-sum-table") return generatedShapeSumMarkup(visual);
  if (visual.kind === "balance-order-chain") return generatedBalanceOrderMarkup(visual);
  if (visual.kind === "symbol-pattern-sequence") return generatedPatternMarkup(visual);
  if (visual.kind === "center-number-rule") return generatedCenterRuleMarkup(visual);
  if (visual.kind === "cryptarithm-vertical") return generatedCryptarithmMarkup(visual);
  if (visual.kind.startsWith("practice-")) return simplePracticeMarkup(visual);
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
  if (visual.kind === "book03-six-original") return book03SixMarkup(false);
  if (visual.kind === "book03-six-story") return book03SixMarkup(true);
  if (visual.kind === "book03-multiple-original") return book03MultipleMarkup(false);
  if (visual.kind === "book03-multiple-story") return book03MultipleMarkup(true);
  if (visual.kind === "book03-cryptarithm-original") return book03CryptarithmMarkup(false);
  if (visual.kind === "book03-cryptarithm-story") return book03CryptarithmMarkup(true);
  if (visual.kind === "book03-magic-original") return book03MagicMarkup(false);
  if (visual.kind === "book03-magic-story") return book03MagicMarkup(true);
  if (visual.kind === "book04-polyomino-original") return book04PolyominoMarkup(false);
  if (visual.kind === "book04-polyomino-story") return book04PolyominoMarkup(true);
  if (visual.kind === "book04-hidden-cube-concept") return book04HiddenCubeConceptMarkup(visual);
  if (visual.kind === "book04-hidden-cubes-original") return book04HiddenCubesMarkup(visual);
  if (visual.kind === "book04-hidden-cubes-story") return book04HiddenCubesMarkup(visual);
  if (visual.kind === "book04-balance-original") return book04BalanceMarkup(false);
  if (visual.kind === "book04-balance-story") return book04BalanceMarkup(true);
  if (visual.kind === "book04-direction-original") return book04DirectionMarkup(false);
  if (visual.kind === "book04-direction-story") return book04DirectionMarkup(true);
  if (visual.kind === "book5") return `<div class="book05-visual">${book05Markup(visual)}</div>`;
  if (visual.kind === "book5-set") return book05SetMarkup(visual);
  if (visual.kind === "book6") return `<div class="book06-visual">${book06Markup(visual)}</div>`;
  if (visual.kind === "book6-set") return book06SetMarkup(visual);
  if (visual.kind === "book7") return `<div class="book07-visual">${book07Markup(visual)}</div>`;
  if (visual.kind === "book7-set") return book07SetMarkup(visual);
  if (visual.kind === "book8") return `<div class="book08-visual">${book08Markup(visual)}</div>`;
  if (visual.kind === "book8-set") return book08SetMarkup(visual);
  if (visual.kind === "book9") return `<div class="book09-visual">${book09Markup(visual)}</div>`;
  if (visual.kind === "book9-set") return book09SetMarkup(visual);
  if (visual.kind === "book10") return `<div class="book10-visual">${book10Markup(visual)}</div>`;
  return "";
}

function renderBookTabs() {
  $("bookTabs").innerHTML = GOLDEN_BELL_BOOKS.map((book, index) => `<button type="button" class="${book.id === state.bookId ? "active" : ""} ${book.status}" data-book="${book.id}" ${book.id === state.bookId ? 'aria-current="page"' : ""}><span>${String(index + 1).padStart(2, "0")}</span><strong>${book.label}</strong></button>`).join("");
  $("bookTabs").querySelectorAll("button").forEach((button) => button.addEventListener("click", async () => {
    state.bookId = button.dataset.book;
    state.lessonId = activeBook().lessons[0]?.id || null;
    state.phase = "concept";
    state.selections = {};
    state.originalAssists = {};
    state.originalChecks = {};
    state.originalIndex = 0;
    state.extensionAssist = null;
    state.extensionIndex = 0;
    state.feedback = null;
    resetExperience();
    const next = new URL(location.href);
    next.searchParams.set("book", state.bookId);
    history.replaceState(null, "", next);
    render();
    await ensureProtectedBook(state.bookId);
    render();
  }));
  requestAnimationFrame(() => {
    const tabs = $("bookTabs");
    const activeTab = tabs.querySelector("button.active");
    if (activeTab) tabs.scrollLeft = activeTab.offsetLeft - (tabs.clientWidth - activeTab.offsetWidth) / 2;
  });
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
    state.originalAssists = {};
    state.originalChecks = {};
    state.originalIndex = 0;
    state.extensionAssist = null;
    state.extensionIndex = 0;
    state.feedback = null;
    resetExperience();
    render();
  }));
}

function renderStageSteps() {
  const sourceLabel = activeBook().source?.origin === "textbook-derived" ? "교재" : "골든벨";
  const phases = [
    ["concept", "1", "개념"],
    ["original", "2", sourceLabel],
    ["extension", "3", "추가 학습"],
    ["complete", "4", "완료"]
  ];
  const progress = lessonProgress();
  $("stageSteps").innerHTML = phases.map(([id, number, label]) => {
    const complete = id === "concept" ? state.phase !== "concept" : id === "original" ? originalProgressComplete(activeLesson()) : id === "extension" ? progress.extension : id === "complete" ? isLessonComplete(activeLesson()) : false;
    return `<button type="button" class="stage-step ${state.phase === id ? "active" : ""} ${complete ? "complete" : ""}" data-phase="${id}" ${state.phase === id ? 'aria-current="step"' : ""} ${phaseAllowed(id) ? "" : "disabled"}><strong>${complete ? "✓" : number}</strong><span>${label}</span></button>`;
  }).join("");
  $("stageSteps").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setPhase(button.dataset.phase)));
}

function conceptOpeningQuestion(lesson) {
  const experience = lesson.experience;
  return experience?.openingPrompt
    || experience?.check?.prompt
    || experience?.typeTracks?.[0]?.check?.prompt
    || experience?.beats?.[0]?.check?.prompt
    || lesson.original?.prompt
    || lesson.story.mission;
}

function renderConcept(lesson) {
  if (sourceTracks(lesson).length) return `<p class="lesson-kicker">${escapeAttribute(lesson.unit)} · 개념 학습</p><h2>${escapeAttribute(lesson.title)}</h2>${renderSourceExperience(lesson)}<button type="button" class="primary-action" data-next-phase="original">문제로 확인하기</button>`;
  const tutorialSteps = lesson.explanation.steps.map((step, index) => `<li><span>${index + 1}</span><div><strong>${index + 1}단계</strong><p>${step}</p></div></li>`).join("");
  const experience = renderExperience(lesson);
  const openingQuestion = conceptOpeningQuestion(lesson);
  const terminology = lesson.id === "polyomino-family-count" ? polyominoVocabularyMarkup() : "";
  const typeOverview = lesson.typeOverview?.length
    ? `<section class="concept-type-overview"><h3>이 단원에서 만나는 문제</h3><div>${lesson.typeOverview.map((item, index) => `<article><span>${index + 1}</span><strong>${item.label}</strong><p>${item.text}</p></article>`).join("")}</div></section>`
    : "";
  return `<p class="lesson-kicker">${lesson.unit} · 개념 튜토리얼</p><h2>${lesson.title}</h2><p class="lesson-lead">${lesson.representativeConcept}</p>${terminology}<section class="concept-opening-question"><span>생각할 문제</span><strong>${openingQuestion}</strong></section><div class="story-band"><span class="story-icon" aria-hidden="true">?</span><div><small>상황 이해</small><strong>${lesson.story.title}</strong><p>${lesson.story.text}</p></div></div>${typeOverview}${experience}<section class="concept-tutorial"><header><span>${experience ? "핵심 정리" : "풀이 튜토리얼"}</span><strong>${lesson.explanation.headline}</strong></header><ol class="tutorial-steps">${tutorialSteps}</ol><p class="tutorial-check"><strong>문제에서 확인할 것</strong><span>${lesson.story.mission}</span></p></section><button type="button" class="primary-action" data-next-phase="original" ${conceptReady(lesson) ? "" : "disabled"}>문제로 확인하기</button>`;
}

function choiceButtons(groupId, options) {
  return `<div class="answer-choices">${options.map((option) => `<button type="button" class="${state.selections[groupId] === option ? "selected" : ""}" data-choice-group="${groupId}" data-choice="${option}">${option}</button>`).join("")}</div>`;
}

function normalizeAnswer(value) {
  return String(value ?? "").normalize("NFC").replace(/\s+/g, "").trim();
}

function answersMatch(actual, expected) {
  if (!hasAnswer(actual) || !hasProtectedAnswer({ answer: expected })) return false;
  const approved = Array.isArray(expected) ? expected : [expected];
  return approved.some((value) => normalizeAnswer(actual) === normalizeAnswer(value));
}

function hasAnswer(value) {
  return normalizeAnswer(value) !== "";
}

function approvedAnswer(item) {
  return Array.isArray(item.answer) ? item.answer[0] : item.answer;
}

function canCheckAnswer(item) {
  return protectedBooks.has(state.bookId) && hasProtectedAnswer(item);
}

function originalItemResolved(item) {
  if (!item) return false;
  if (["revealed", "skipped"].includes(state.originalAssists[item.id])) return true;
  if (item.parts?.length) return item.parts.every((part) => hasAnswer(state.selections[`${item.id}:${part.id}`]));
  return hasAnswer(state.selections[item.id]);
}

function originalItemCorrect(item) {
  if (state.originalAssists[item.id]) return true;
  if (item.parts?.length) return item.parts.every((part) => answersMatch(state.selections[`${item.id}:${part.id}`], part.answer));
  return answersMatch(state.selections[item.id], item.answer);
}

function originalItemComplete(item) {
  return ["revealed", "skipped"].includes(state.originalAssists[item.id]) || state.originalChecks[item.id]?.passed === true;
}

function approvedOriginalAnswer(item) {
  if (!item.parts?.length) return approvedAnswer(item);
  return item.parts.map((part) => `${part.label} ${approvedAnswer(part)}${part.unit || ""}`).join(" · ");
}

function originalAnswerControl(item) {
  if (!item.parts?.length) return answerControl(item.id, item, "original");
  return `<div class="answer-part-grid">${item.parts.map((part) => {
    const key = `${item.id}:${part.id}`;
    const inputMode = part.inputMode === "text" ? "text" : "numeric";
    return `<label class="answer-part"><span>${escapeAttribute(part.label)}</span><span class="answer-part-field"><input type="text" inputmode="${inputMode}" autocomplete="off" spellcheck="false" value="${escapeAttribute(state.selections[key])}" aria-label="${escapeAttribute(part.label)} 답" data-input-group="${escapeAttribute(key)}" data-answer-scope="original" />${part.unit ? `<b>${escapeAttribute(part.unit)}</b>` : ""}</span></label>`;
  }).join("")}</div>`;
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
  if (lesson.original.mode === "paged") {
    const items = lesson.original.items;
    const item = items[Math.min(state.originalIndex, items.length - 1)];
    const assist = state.originalAssists[item.id];
    const resolved = originalItemResolved(item);
    const correct = Boolean(state.originalChecks[item.id]?.passed || result?.passed && result.itemId === item.id);
    const status = assist === "skipped" ? "skipped" : assist === "revealed" ? "assisted" : correct ? "correct" : result && result.itemId === item.id ? "incorrect" : "";
    const solution = assist === "revealed"
      ? `<section class="quiz-item-solution" aria-live="polite"><span>풀이</span><p>${escapeAttribute(item.solution)}</p><strong>답 ${escapeAttribute(approvedOriginalAnswer(item))}</strong></section>`
      : assist === "skipped"
        ? '<p class="quiz-item-assist skipped">넘어간 문제입니다. 학습 기록에서 다시 확인할 수 있어요.</p>'
        : correct
          ? `<section class="quiz-item-solution" aria-live="polite"><span>풀이 확인</span><p>${escapeAttribute(item.solution)}</p><strong>답 ${escapeAttribute(approvedOriginalAnswer(item))}</strong></section>`
          : "";
    const dots = items.map((candidate, index) => `<span class="${index === state.originalIndex ? "active" : originalItemComplete(candidate) ? "complete" : ""}">${candidate.sourceNo || index + 1}</span>`).join("");
    const nextLabel = state.originalIndex === items.length - 1 ? "추가 학습으로" : "다음 문제";
    const sourceCount = lesson.original.sourceQuestionCount || items.length;
    const progressLabel = sourceCount === items.length
      ? `${sourceCount}문제 중 ${state.originalIndex + 1}번째`
      : `${sourceCount}문항 · ${items.length}개 풀이 중 ${state.originalIndex + 1}번째`;
    return `<div class="quiz-head daily-quiz-head"><div><span>${lesson.original.title} · ${item.typeLabel}</span><h2>${lesson.title}</h2></div><aside><strong>${progressLabel}</strong><small>교재 ${item.sourceNo || state.originalIndex + 1}번</small></aside></div><div class="daily-question-progress source-question-progress" aria-label="교재 연습문제 진행">${dots}</div><section class="source-question-card"><header><span>문제 ${item.sourceNo || state.originalIndex + 1}</span><strong>${item.typeLabel}</strong></header><p class="lesson-lead">${item.prompt}</p><div class="quiz-visual item-quiz-visual">${visualMarkup(item.visual || lesson.original.visual)}</div><section class="quiz-item ${status}" data-original-item="${escapeAttribute(item.id)}">${originalAnswerControl(item)}<div class="quiz-item-actions"><button type="button" class="secondary-action" data-original-answer="${escapeAttribute(item.id)}">풀이 보기</button><button type="button" class="secondary-action" data-original-skip="${escapeAttribute(item.id)}">${assist === "skipped" ? "넘어감" : "넘어가기"}</button></div>${solution}</section></section>${result && result.itemId === item.id ? `<p class="feedback ${result.passed ? "success" : ""}">${result.message}</p>` : ""}<button type="button" class="primary-action" data-check="original" ${resolved ? "" : "disabled"}>${correct || assist ? nextLabel : "확인"}</button>`;
  }
  const allComplete = lesson.original.items.every(originalItemComplete);
  const itemVisuals = lesson.original.items.some((item) => item.visual);
  const sharedVisual = itemVisuals ? "" : `<div class="quiz-visual">${visualMarkup(lesson.original.visual)}</div>`;
  return `<div class="quiz-head"><div><span>${lesson.original.title}</span><h2>${lesson.title}</h2></div></div><p class="lesson-lead">${lesson.original.prompt}</p>${sharedVisual}<div class="quiz-items">${lesson.original.items.map((item) => {
    const assist = state.originalAssists[item.id];
    const check = state.originalChecks[item.id];
    const status = assist === "skipped" ? "skipped" : assist === "revealed" ? "assisted" : check?.passed ? "correct" : check ? "incorrect" : "";
    const conditions = item.conditions?.length ? `<ul class="original-conditions">${item.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul>` : "";
    const assistNote = assist === "revealed"
      ? `<section class="quiz-item-solution" aria-live="polite"><span>풀이</span><p>${escapeAttribute(item.solution)}</p><strong>답 ${escapeAttribute(approvedOriginalAnswer(item))}</strong></section>`
      : assist === "skipped"
        ? '<p class="quiz-item-assist skipped">넘어간 문제입니다. 다음에 다시 풀어 보세요.</p>'
        : check?.passed
          ? `<section class="quiz-item-solution" aria-live="polite"><span>풀이 확인</span><p>${escapeAttribute(item.solution)}</p><strong>답 ${escapeAttribute(approvedOriginalAnswer(item))}</strong></section>`
          : check
            ? `<p class="quiz-item-feedback" aria-live="polite">${escapeAttribute(check.message)}</p>`
            : "";
    const itemVisual = item.visual ? `<div class="quiz-visual item-quiz-visual">${visualMarkup(item.visual)}</div>` : "";
    return `<section class="quiz-item ${status}" data-original-item="${escapeAttribute(item.id)}"><strong>${item.prompt}</strong>${conditions}${itemVisual}${originalAnswerControl(item)}<div class="quiz-item-actions"><button type="button" class="primary-action item-check-action" data-original-check="${escapeAttribute(item.id)}" ${originalItemResolved(item) ? "" : "disabled"}>${originalItemComplete(item) ? "확인 완료" : "확인"}</button><button type="button" class="secondary-action" data-original-answer="${escapeAttribute(item.id)}">풀이 보기</button><button type="button" class="secondary-action" data-original-skip="${escapeAttribute(item.id)}">${assist === "skipped" ? "넘어감" : "넘어가기"}</button></div>${assistNote}</section>`;
  }).join("")}</div><button type="button" class="primary-action grouped-next-action" data-complete-original ${allComplete ? "" : "disabled"}>추가 학습으로</button>`;
}

function renderExtension(lesson) {
  const items = extensionItems(lesson);
  const item = activeExtensionItem(lesson);
  const groupId = item.id;
  const result = state.feedback?.kind === "extension" && state.feedback.itemId === groupId ? state.feedback : null;
  const selected = state.selections[groupId];
  const revealed = state.extensionAssist === "revealed";
  const skipped = state.extensionAssist === "skipped";
  const correct = Boolean(result?.passed);
  const resolved = correct || revealed || skipped;
  const status = skipped ? "skipped" : revealed ? "assisted" : correct ? "correct" : result ? "incorrect" : "";
  const solution = correct || revealed
    ? `<section class="extension-solution" aria-live="polite"><span>풀이</span><p>${escapeAttribute(item.explanation)}</p><strong>답 ${escapeAttribute(approvedAnswer(item))}</strong></section>`
    : skipped
      ? '<p class="quiz-item-assist skipped">넘어간 문제입니다. 완료 뒤 이 유형을 다시 연습할 수 있어요.</p>'
      : "";
  const dots = items.map((candidate, index) => `<span class="${index === state.extensionIndex ? "active" : index < state.extensionIndex ? "complete" : ""}">${index + 1}</span>`).join("");
  const nextLabel = state.extensionIndex === items.length - 1 ? "학습 완료" : "다음 문제";
  return `<div class="quiz-head daily-quiz-head"><div><span>오늘의 추가 학습 · ${item.title}</span><h2>${item.story}</h2></div><aside><strong>${items.length}문제 중 ${state.extensionIndex + 1}번째</strong><small>이 권 ${activeBook().dailyPractice?.problemCount || 8}문제 · 약 ${activeBook().dailyPractice?.estimatedMinutes || 30}분</small></aside></div><div class="daily-question-progress" aria-label="추가 학습 문제 진행">${dots}</div><p class="lesson-lead">배운 원리를 같은 유형의 새 문제에 적용해 보세요.</p><div class="quiz-visual">${visualMarkup(item.visual)}</div><section class="quiz-item extension-study ${status}"><strong>${item.prompt}</strong>${answerControl(groupId, item, "extension")}<div class="quiz-item-actions"><button type="button" class="secondary-action" data-extension-answer>풀이 보기</button><button type="button" class="secondary-action" data-extension-skip>${skipped ? "넘어감" : "넘어가기"}</button></div></section>${solution}${result ? `<p class="feedback ${result.passed ? "success" : ""}">${result.message}</p>` : ""}<button type="button" class="primary-action" data-check="extension" ${hasAnswer(selected) || resolved ? "" : "disabled"}>${resolved ? nextLabel : "확인"}</button>`;
}

function renderComplete(lesson) {
  const book = activeBook();
  const nextLesson = book.lessons.find((candidate) => !isLessonComplete(candidate));
  const summary = summarizeGoldenBellLesson(lessonProgress(lesson));
  const completionMessage = summary.review
    ? "답을 보거나 넘어간 문제는 다시 연습해 보세요."
    : "이 개념을 잘 익혔습니다.";
  const record = summary.total ? `<section class="learning-record"><h3>이번 학습 기록</h3><dl><div><dt>혼자 해결</dt><dd>${summary.correct}</dd></div><div><dt>답 확인</dt><dd>${summary.revealed}</dd></div><div><dt>넘어감</dt><dd>${summary.skipped}</dd></div><div><dt>다시 볼 문항</dt><dd>${summary.review}</dd></div></dl>${summary.reviewTypeIds.length ? `<a href="../prescription/?student=${encodeURIComponent(student)}&types=${encodeURIComponent(summary.reviewTypeIds.join(","))}&view=type">이 유형 다시 연습</a>` : ""}</section>` : "";
  return `<section class="complete-panel"><span class="medal">✓</span><h2>${lesson.title} 학습 완료</h2><p>${completionMessage}</p>${record}${nextLesson ? `<button type="button" class="primary-action" data-next-lesson="${nextLesson.id}">다음</button>` : `<button type="button" class="primary-action" data-book-complete>${book.label} 학습 완료</button>`}</section>`;
}

function renderPending(book) {
  return `<section class="pending-panel"><span>!</span><h2>${book.label} 골든벨 학습 준비 중</h2><p>학습 자료를 준비하고 있습니다.</p></section>`;
}

function printResponseMarkup(item) {
  if (item.parts?.length) return `<span class="gold-print-part-answers">${item.parts.map((part) => `<span><b>${escapeAttribute(part.label)}</b><i></i>${part.unit ? `<small>${escapeAttribute(part.unit)}</small>` : ""}</span>`).join("")}</span>`;
  if (item.answerMode === "input") return `<span class="gold-print-answer${item.answerRef?.startsWith("/recovery/") ? " recovered-source-answer" : ""}" aria-label="답 쓰는 칸"><b>답</b><i></i></span>`;
  return `<span class="gold-print-options">${item.options.map((option, index) => `${index + 1}. ${option}`).join("　")}</span>`;
}

function printSourceStoryboards(lesson, lessonNumber, book) {
  if (!sourceTracks(lesson).length || !protectedBooks.has(book.id)) return "";
  const animation = lesson === activeLesson() ? activeSourceAnimation(lesson) : sourceTracks(lesson)[0];
  const selectedSteps = animation.printSteps || [0, animation.beats.length - 1];
  const pages = [];
  const framesPerPage = animation.family.startsWith("book10-") ? 1 : 2;
  for (let start = 0; start < selectedSteps.length; start += framesPerPage) {
    const pageNumber = start / framesPerPage + 1;
    const frames = selectedSteps.slice(start, start + framesPerPage).map((step) => `<section class="source-animation-print-frame" data-source-item="${escapeAttribute(animation.sourceItemId)}"><h2>${step + 1}단계</h2>${sourceAnimationFrame(animation, step, { animate: false })}<p>${escapeAttribute(animation.beats[step].caption)}</p></section>`).join("");
    pages.push(`<article class="gold-print-page source-animation-print-page" data-print-book="${escapeAttribute(book.id)}" data-print-lesson="${escapeAttribute(lesson.id)}" data-print-part="animation-${pageNumber}" data-watermark="${escapeAttribute(student)} · GFIELD"><header class="gold-print-head"><div><span>FIELDS CLASSIC · 함께 풀어보기</span><h1>${book.label} ${lessonNumber}. ${escapeAttribute(animation.title)}</h1></div><dl><div><dt>이름</dt><dd>${escapeAttribute(student)}</dd></div></dl></header><p class="gold-print-concept">${escapeAttribute(animation.problem)}</p>${frames}<footer class="gold-print-footer">${book.label} · ${escapeAttribute(lesson.unit)} · 설명 ${pageNumber}</footer></article>`);
  }
  return pages.join("");
}

function printLessonPage(lesson, lessonNumber, book) {
  const vocabulary = lesson.id === "polyomino-family-count"
    ? `<article class="gold-print-page polyomino-vocabulary-page" data-print-book="${escapeAttribute(book.id)}" data-print-lesson="${escapeAttribute(lesson.id)}" data-print-part="vocabulary" data-watermark="${escapeAttribute(student)} · GFIELD"><header class="gold-print-head"><div><span>FIELDS CLASSIC · 개념 학습</span><h1>${book.label} ${lessonNumber}. 모양의 이름을 알아요</h1></div><dl><div><dt>이름</dt><dd>${escapeAttribute(student)}</dd></div></dl></header>${polyominoVocabularyMarkup()}<footer class="gold-print-footer">${book.label} · ${escapeAttribute(lesson.unit)} · 개념</footer></article>`
    : "";
  return vocabulary + printSourceStoryboards(lesson, lessonNumber, book) + printLessonExercises(lesson, lessonNumber, book);
}

function printLessonExercises(lesson, lessonNumber, book) {
  const header = (part) => `<header class="gold-print-head"><div><span>FIELDS CLASSIC · GOLDEN BELL · ${part}</span><h1>${book.label} ${lessonNumber}. ${lesson.title}</h1></div><dl><div><dt>이름</dt><dd>${escapeAttribute(student)}</dd></div><div><dt>날짜</dt><dd></dd></div></dl></header>`;
  const footer = `<footer class="gold-print-footer">${book.label} · ${lesson.unit}</footer>`;
  const concept = `<p class="gold-print-concept"><strong>생각할 개념</strong><br>${lesson.representativeConcept}</p>`;
  const sourcePrintPaged = lesson.original.mode === "paged" || lesson.original.printMode === "paged";
  const separateConceptPrint = Boolean(lesson.original.separateConceptPrint);
  const sourcePageCount = (sourcePrintPaged ? new Set(lesson.original.items.map((item) => item.printGroup)).size : 1) + (separateConceptPrint ? 1 : 0);
  const storyPages = extensionItems(lesson).map((item, index, items) => `<article class="gold-print-page" data-print-book="${escapeAttribute(book.id)}" data-print-lesson="${escapeAttribute(lesson.id)}" data-print-part="story-${index + 1}" data-watermark="${escapeAttribute(student)} · GFIELD">${header(String(sourcePageCount + index + 1).padStart(2, "0"))}${concept}<section class="gold-print-block gold-print-story"><h2>추가 학습 ${index + 1} / ${items.length}</h2><p>${item.story}<br>${item.prompt}</p><div class="gold-print-visual">${visualMarkup(item.visual)}</div><ol class="gold-print-items"><li class="gold-print-item"><span>${item.prompt}</span>${printResponseMarkup(item)}</li></ol></section>${footer}</article>`).join("");
  if (sourcePrintPaged) {
    const groups = new Map();
    lesson.original.items.forEach((item) => {
      const key = item.printGroup || groups.size + 1;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    const sourceExperience = !sourceTracks(lesson).length && lesson.experience ? experienceSummaryMarkup(lesson.experience) : "";
    const conceptPage = separateConceptPrint
      ? `<article class="gold-print-page source-practice-print concept-print-page" data-print-book="${escapeAttribute(book.id)}" data-print-lesson="${escapeAttribute(lesson.id)}" data-print-part="concept" data-watermark="${escapeAttribute(student)} · GFIELD">${header("01")}${concept}${sourceExperience}${footer}</article>`
      : "";
    const sourcePages = [...groups.entries()].map(([group, items], pageIndex) => {
      const blocks = items.map((item) => `<section class="gold-print-source-item"><h2><span>${escapeAttribute(item.sourceNo)}</span>${escapeAttribute(item.typeLabel)}</h2><p>${escapeAttribute(item.prompt)}</p><div class="gold-print-visual">${visualMarkup(item.visual || lesson.original.visual)}</div>${printResponseMarkup(item)}</section>`).join("");
      const printConcept = !separateConceptPrint && pageIndex === 0 ? concept + sourceExperience : "";
      return `<article class="gold-print-page source-practice-print" data-print-book="${escapeAttribute(book.id)}" data-print-lesson="${escapeAttribute(lesson.id)}" data-print-part="original-${group}" data-watermark="${escapeAttribute(student)} · GFIELD">${header(String(pageIndex + 1 + (separateConceptPrint ? 1 : 0)).padStart(2, "0"))}${printConcept}<section class="gold-print-block"><h2>교재 연습 ${pageIndex + 1} / ${groups.size}</h2>${blocks}</section>${footer}</article>`;
    }).join("");
    return conceptPage + sourcePages + storyPages;
  }
  const visualHasResponseBoxes = lesson.original.visual.kind === "book03-six-original";
  const hasItemVisuals = lesson.original.items.some((item) => item.visual);
  const sharedVisual = !hasItemVisuals || visualHasResponseBoxes ? `<div class="gold-print-visual">${visualMarkup(lesson.original.visual)}</div>` : "";
  const originalItems = visualHasResponseBoxes ? "" : lesson.original.items.map((item, index) => `<section class="gold-print-source-item"><h2><span>${escapeAttribute(item.sourceNo || index + 1)}</span>${escapeAttribute(item.typeLabel || "문제")}</h2><p>${escapeAttribute(item.prompt)}${item.conditions?.length ? `<br>${item.conditions.map(escapeAttribute).join(" · ")}` : ""}</p>${item.visual ? `<div class="gold-print-visual">${visualMarkup(item.visual)}</div>` : ""}${printResponseMarkup(item)}</section>`).join("");
  const sharedClass = !hasItemVisuals && !visualHasResponseBoxes ? " shared-source-visual" : "";
  const originalPage = `<article class="gold-print-page source-practice-print${sharedClass}" data-print-book="${escapeAttribute(book.id)}" data-print-lesson="${escapeAttribute(lesson.id)}" data-print-part="original" data-watermark="${escapeAttribute(student)} · GFIELD">${header("01")}${concept}${lesson.experience ? experienceSummaryMarkup(lesson.experience) : ""}<section class="gold-print-block"><h2>골든벨</h2><p>${lesson.original.prompt}</p>${sharedVisual}${originalItems ? `<div class="gold-print-source-items">${originalItems}</div>` : ""}</section>${footer}</article>`;
  return originalPage + storyPages;
}

async function printLessons(lessons) {
  clearExperiencePlayback();
  renderContent();
  const book = activeBook();
  const root = $("goldPrintRoot");
  root.innerHTML = lessons.map((lesson) => printLessonPage(lesson, book.lessons.indexOf(lesson) + 1, book)).join("");
  root.setAttribute("aria-hidden", "false");
  if (document.fonts?.ready) await document.fonts.ready;
  await Promise.all([...root.querySelectorAll("img")].map((image) => image.complete
    ? Promise.resolve()
    : new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      })));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.print();
}

function bindLessonActions() {
  $("lessonContent").querySelector("[data-source-track]")?.addEventListener("change", (event) => {
    clearExperiencePlayback();
    state.sourceTrackId = event.currentTarget.value;
    state.experience.step = 0;
    state.experience.previousStep = 0;
    renderContent();
  });
  $("lessonContent").querySelectorAll("[data-source-step]").forEach((button) => button.addEventListener("click", () => {
    const step = Number(button.dataset.sourceStep);
    updateExperienceStep(step, { animate: false });
  }));
  $("lessonContent").querySelector("[data-next-phase]")?.addEventListener("click", (event) => setPhase(event.currentTarget.dataset.nextPhase));
  $("lessonContent").querySelectorAll("[data-experience-action]").forEach((button) => button.addEventListener("click", () => {
    const action = button.dataset.experienceAction;
    if (action === "previous") updateExperienceStep(state.experience.step - 1);
    else if (action === "next") updateExperienceStep(state.experience.step + 1);
    else if (action === "next-check") {
      const experience = activeLesson().experience;
      if (!experience || experience.kind !== "triangular-stair" || state.experience.checks[experience.beats[state.experience.checkStep]?.id] !== true) return;
      state.experience.checkStep = Math.min(state.experience.checkStep + 1, experience.beats.length - 1);
      state.experience.answer = null;
      state.experience.feedback = null;
      renderContent();
    }
    else if (action === "restart") {
      state.experience.previousStep = 0;
      state.experience.step = 0;
      clearExperiencePlayback();
      renderContent();
    } else if (action === "play") playExperience();
  }));
  $("lessonContent").querySelector("[data-experience-speed]")?.addEventListener("change", (event) => {
    state.experience.speed = Number(event.currentTarget.value) || 1;
    if (state.experience.playing) {
      clearExperiencePlayback();
      playExperience();
    }
  });
  $("lessonContent").querySelectorAll("[data-type-track-select]").forEach((button) => button.addEventListener("click", () => {
    state.experience.typeTrackId = button.dataset.typeTrackSelect;
    renderContent();
  }));
  $("lessonContent").querySelectorAll("[data-type-track-check]").forEach((button) => button.addEventListener("click", () => {
    const experience = activeLesson().experience;
    const track = experience?.typeTracks?.find((item) => item.id === button.dataset.typeTrackCheck);
    if (!track || !canCheckAnswer(track[button.dataset.typeTrackStage])) return;
    const stage = button.dataset.typeTrackStage;
    const record = state.experience.typeTracks[track.id] || {};
    const selected = button.dataset.typeTrackValue;
    record[`${stage}Value`] = selected;
    record[`${stage}Status`] = selected === track[stage].answer ? "correct" : "wrong";
    state.experience.typeTracks[track.id] = record;
    renderContent();
  }));
  $("lessonContent").querySelectorAll("[data-type-track-answer]").forEach((button) => button.addEventListener("click", () => {
    const experience = activeLesson().experience;
    const track = experience?.typeTracks?.find((item) => item.id === button.dataset.typeTrackAnswer);
    if (!track || !canCheckAnswer(track[button.dataset.typeTrackStage])) return;
    const stage = button.dataset.typeTrackStage;
    const record = state.experience.typeTracks[track.id] || {};
    record[`${stage}Value`] = track[stage].answer;
    record[`${stage}Status`] = "revealed";
    state.experience.typeTracks[track.id] = record;
    renderContent();
  }));
  $("lessonContent").querySelectorAll("[data-experience-choice]").forEach((button) => button.addEventListener("click", () => {
    const experience = activeLesson().experience;
    const check = experience?.kind === "triangular-stair" ? experience.beats[state.experience.checkStep]?.check : experience?.check;
    if (!canCheckAnswer(check)) return;
    state.experience.answer = button.dataset.experienceChoice;
    if (["guided-concept", "progressive-concept"].includes(experience.kind)) {
      const passed = state.experience.answer === experience.check.answer;
      state.experience.checks[`guided:${activeLesson().id}`] = passed ? "correct" : "wrong";
      state.experience.feedback = { passed, message: passed ? `맞아요. ${experience.check.explanation}` : "조건과 마지막 장면을 다시 살펴보세요. 필요하면 답 보기를 눌러 확인할 수 있습니다." };
    } else if (experience.kind === "triangular-stair") {
      clearExperiencePlayback();
      const beat = experience.beats[state.experience.checkStep];
      const passed = state.experience.answer === beat.check.answer;
      state.experience.checks[beat.id] = passed;
      state.experience.feedback = {
        passed,
        message: passed ? beat.check.success : "쌓기나무를 줄마다 다시 세어 보세요. 새 층은 삼각형 바닥으로 놓입니다."
      };
    } else {
      state.experience.feedback = {
        passed: state.experience.answer === experience.check.answer,
        message: state.experience.answer === experience.check.answer ? "맞아요. 반 바퀴는 맞은편을 가리켜 8입니다." : "시계판의 맞은편을 다시 찾아보세요. 2의 맞은편은 8입니다."
      };
    }
    if (["guided-concept", "progressive-concept"].includes(experience.kind)) render();
    else renderContent();
  }));
  $("lessonContent").querySelector("[data-experience-answer]")?.addEventListener("click", () => {
    const lesson = activeLesson();
    const experience = lesson.experience;
    if (!["guided-concept", "progressive-concept"].includes(experience?.kind)) return;
    if (!canCheckAnswer(experience.check)) return;
    state.experience.answer = experience.check.answer;
    state.experience.checks[`guided:${lesson.id}`] = "revealed";
    state.experience.feedback = { passed: false, message: `답: ${experience.check.answer}. ${experience.check.explanation}` };
    render();
  });
  $("lessonContent").querySelectorAll("[data-concept-practice-choice]").forEach((button) => button.addEventListener("click", () => {
    const experience = activeLesson().experience;
    const practice = experience?.practice?.find((item) => item.id === button.dataset.conceptPracticeChoice);
    if (!practice || !canCheckAnswer(practice)) return;
    const selected = button.dataset.conceptPracticeValue;
    state.experience.practice[practice.id] = {
      selected,
      status: selected === practice.answer ? "correct" : "wrong"
    };
    render();
  }));
  $("lessonContent").querySelectorAll("[data-concept-practice-answer]").forEach((button) => button.addEventListener("click", () => {
    const experience = activeLesson().experience;
    const practice = experience?.practice?.find((item) => item.id === button.dataset.conceptPracticeAnswer);
    if (!practice || !canCheckAnswer(practice)) return;
    state.experience.practice[practice.id] = { selected: practice.answer, status: "revealed" };
    render();
  }));
  $("lessonContent").querySelectorAll("[data-choice-group]").forEach((button) => button.addEventListener("click", () => {
    state.selections[button.dataset.choiceGroup] = button.dataset.choice;
    if (button.dataset.choiceGroup.includes(":extension")) state.extensionAssist = null;
    else {
      const itemId = button.closest("[data-original-item]")?.dataset.originalItem || button.dataset.choiceGroup;
      delete state.originalAssists[itemId];
      delete state.originalChecks[itemId];
    }
    state.feedback = null;
    renderContent();
  }));
  $("lessonContent").querySelectorAll("[data-original-answer]").forEach((button) => button.addEventListener("click", () => {
    const item = activeLesson().original.items.find((candidate) => candidate.id === button.dataset.originalAnswer);
    if (!canCheckAnswer(item)) return;
    if (item.parts?.length) item.parts.forEach((part) => { state.selections[`${item.id}:${part.id}`] = approvedAnswer(part); });
    else state.selections[item.id] = approvedAnswer(item);
    state.originalAssists[item.id] = "revealed";
    delete state.originalChecks[item.id];
    recordOutcome("original", item.id, "revealed");
    state.feedback = null;
    renderContent();
  }));
  $("lessonContent").querySelectorAll("[data-original-skip]").forEach((button) => button.addEventListener("click", () => {
    const item = activeLesson().original.items.find((candidate) => candidate.id === button.dataset.originalSkip);
    if (!item) return;
    if (item.parts?.length) item.parts.forEach((part) => { delete state.selections[`${item.id}:${part.id}`]; });
    else delete state.selections[item.id];
    state.originalAssists[item.id] = "skipped";
    delete state.originalChecks[item.id];
    recordOutcome("original", item.id, "skipped");
    state.feedback = null;
    renderContent();
  }));
  $("lessonContent").querySelectorAll("[data-input-group]").forEach((input) => input.addEventListener("input", () => {
    state.selections[input.dataset.inputGroup] = input.value;
    if (input.dataset.answerScope === "extension") state.extensionAssist = null;
    else {
      const itemId = input.closest("[data-original-item]")?.dataset.originalItem || input.dataset.inputGroup;
      delete state.originalAssists[itemId];
      delete state.originalChecks[itemId];
    }
    state.feedback = null;
    input.closest(".quiz-item")?.classList.remove("correct", "incorrect", "assisted", "skipped");
    $("lessonContent").querySelector(".feedback")?.remove();
    const lesson = activeLesson();
    const scope = input.dataset.answerScope;
    const itemId = input.closest("[data-original-item]")?.dataset.originalItem;
    const checkButton = scope === "original" && lesson.original.mode !== "paged"
      ? $("lessonContent").querySelector(`[data-original-check="${CSS.escape(itemId || "")}"]`)
      : $("lessonContent").querySelector(`[data-check="${scope}"]`);
    if (!checkButton) return;
    const currentItem = scope === "original"
      ? lesson.original.mode === "paged" ? lesson.original.items[state.originalIndex] : lesson.original.items.find(candidate => candidate.id === itemId)
      : activeExtensionItem(lesson);
    checkButton.disabled = !canCheckAnswer(currentItem) || (scope === "original"
      ? lesson.original.mode === "paged"
        ? !originalItemResolved(lesson.original.items[state.originalIndex])
        : !originalItemResolved(lesson.original.items.find((candidate) => candidate.id === itemId))
      : !hasAnswer(state.selections[activeExtensionItem(lesson).id]));
    checkButton.textContent = "확인";
  }));
  $("lessonContent").querySelectorAll("[data-original-check]").forEach((button) => button.addEventListener("click", () => {
    const item = activeLesson().original.items.find((candidate) => candidate.id === button.dataset.originalCheck);
    if (!canCheckAnswer(item) || !originalItemResolved(item) || state.originalAssists[item.id]) return;
    const passed = originalItemCorrect(item);
    state.originalChecks[item.id] = {
      passed,
      message: passed ? "맞았어요. 풀이 순서까지 확인해 보세요." : "아직 맞지 않아요. 조건과 계산을 다시 확인해 보세요."
    };
    recordOutcome("original", item.id, passed ? "correct" : "wrong");
    renderContent();
  }));
  $("lessonContent").querySelector('[data-check="original"]')?.addEventListener("click", () => {
    const lesson = activeLesson();
    if (lesson.original.mode === "paged") {
      const items = lesson.original.items;
      const item = items[state.originalIndex];
      const assisted = state.originalAssists[item.id];
      const passedAlready = state.originalChecks[item.id]?.passed || state.feedback?.kind === "original" && state.feedback.itemId === item.id && state.feedback.passed;
      if (passedAlready || assisted) {
        if (state.originalIndex < items.length - 1) {
          state.originalIndex += 1;
          state.feedback = null;
          return render();
        }
        completeOriginal();
        return setPhase("extension");
      }
      if (!canCheckAnswer(item) || !originalItemResolved(item)) return;
      const passed = originalItemCorrect(item);
      state.originalChecks[item.id] = { passed };
      recordOutcome("original", item.id, passed ? "correct" : "wrong");
      state.feedback = {
        kind: "original",
        itemId: item.id,
        passed,
        message: passed ? "맞았어요. 풀이 순서를 확인하고 다음 문제로 가요." : "조건을 식으로 다시 옮겨 보세요. 어려우면 풀이 보기 또는 넘어가기를 눌러도 됩니다."
      };
      return render();
    }
  });
  $("lessonContent").querySelector("[data-complete-original]")?.addEventListener("click", () => {
    const lesson = activeLesson();
    if (!lesson.original.items.every(originalItemComplete)) return;
    completeOriginal();
    setPhase("extension");
  });
  $("lessonContent").querySelector('[data-check="extension"]')?.addEventListener("click", () => {
    const lesson = activeLesson();
    const items = extensionItems(lesson);
    const item = activeExtensionItem(lesson);
    const groupId = item.id;
    const resolved = state.feedback?.kind === "extension" && state.feedback.itemId === groupId && state.feedback.passed
      || ["revealed", "skipped"].includes(state.extensionAssist);
    if (resolved) {
      if (state.extensionIndex < items.length - 1) {
        state.extensionIndex += 1;
        state.extensionAssist = null;
        state.feedback = null;
        return render();
      }
      completeExtension();
      return setPhase("complete");
    }
    const selected = state.selections[groupId];
    if (!canCheckAnswer(item) || !hasAnswer(selected)) return;
    const passed = answersMatch(selected, item.answer);
    recordOutcome("extension", groupId, passed ? "correct" : "wrong");
    state.feedback = { kind: "extension", itemId: groupId, passed, message: passed ? "맞았어요. 풀이로 생각한 순서를 확인해 보세요." : "이 문제의 조건과 그림을 다시 살펴보세요. 어려우면 풀이를 확인해도 괜찮아요." };
    render();
  });
  $("lessonContent").querySelector("[data-extension-answer]")?.addEventListener("click", () => {
    const lesson = activeLesson();
    const item = activeExtensionItem(lesson);
    if (!canCheckAnswer(item)) return;
    const groupId = item.id;
    state.selections[groupId] = approvedAnswer(item);
    state.extensionAssist = "revealed";
    recordOutcome("extension", groupId, "revealed");
    state.feedback = { kind: "extension", itemId: groupId, passed: false, message: "풀이를 확인했어요. 학습 기록에 다시 볼 문제로 표시합니다." };
    render();
  });
  $("lessonContent").querySelector("[data-extension-skip]")?.addEventListener("click", () => {
    const lesson = activeLesson();
    const groupId = activeExtensionItem(lesson).id;
    delete state.selections[groupId];
    state.extensionAssist = "skipped";
    recordOutcome("extension", groupId, "skipped");
    state.feedback = { kind: "extension", itemId: groupId, passed: false, message: "넘어간 문제로 기록했어요. 학습 뒤 이 유형을 다시 연습할 수 있어요." };
    render();
  });
  $("lessonContent").querySelector("[data-next-lesson]")?.addEventListener("click", (event) => {
    state.lessonId = event.currentTarget.dataset.nextLesson;
    state.phase = "concept";
    state.selections = {};
    state.originalAssists = {};
    state.originalChecks = {};
    state.originalIndex = 0;
    state.extensionAssist = null;
    state.extensionIndex = 0;
    state.feedback = null;
    resetExperience();
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
  if (!protectedBooks.has(state.bookId)) {
    const notice = document.createElement("div");
    notice.className = "protected-answer-notice";
    notice.textContent = protectedMessage;
    $("lessonContent").prepend(notice);
    $("lessonContent").querySelectorAll("[data-experience-choice],[data-experience-answer],[data-type-track-check],[data-type-track-answer],[data-concept-practice-choice],[data-concept-practice-answer],[data-original-answer],[data-original-check],[data-check],[data-extension-answer]").forEach((control) => { control.disabled = true; });
    $("lessonContent").querySelectorAll('.source-animation [data-experience-action="play"]').forEach((control) => { control.disabled = true; });
  }
  scheduleTriangularAutoplay(lesson);
}

function renderSummary() {
  const book = activeBook();
  const completed = book.lessons.filter(isLessonComplete).length;
  $("currentBookLabel").textContent = book.label;
  $("completedCount").textContent = `${completed} / ${book.lessons.length || "-"}`;
  $("levelState").textContent = book.lessons.length && completed === book.lessons.length ? "완료" : book.lessons.length ? "학습 중" : "준비 중";
  $("bookTitle").textContent = `${book.label} · ${book.title}`;
  const readyNote = book.source?.origin === "textbook-derived"
    ? `교재 기반 학습입니다. ${book.source.note}`
    : "개념을 골든벨과 이야기로 익힙니다.";
  const dailyNote = book.lessons.length ? `<br>추가 학습 ${book.dailyPractice?.problemCount || 8}문제 · 약 ${book.dailyPractice?.estimatedMinutes || 30}분` : "";
  $("bookSource").innerHTML = `<strong>학습 안내</strong><br>${book.lessons.length ? readyNote : "준비 중입니다."}${dailyNote}`;
  $("printLessonButton").disabled = !book.lessons.length;
  $("printBookButton").disabled = !book.lessons.length;
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
$("printLessonButton").addEventListener("click", () => printLessons([activeLesson()]));
$("printBookButton").addEventListener("click", () => printLessons(activeBook().lessons));
window.addEventListener("keydown", (event) => {
  const lesson = activeLesson();
  if (state.phase !== "concept" || !lesson?.experience || !["clock-turning", "triangular-stair", "guided-concept"].includes(lesson.experience.kind)) return;
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    updateExperienceStep(state.experience.step - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    updateExperienceStep(state.experience.step + 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    updateExperienceStep(0);
  } else if (event.key === "End") {
    event.preventDefault();
    updateExperienceStep(lesson.experience.beats.length - 1);
  } else if (event.key === " ") {
    event.preventDefault();
    playExperience();
  }
});
render();
ensureProtectedBook(state.bookId).then(() => render());
