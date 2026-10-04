import { createState, ageMonths, activeModules, routeCandidates, workload, acceptPlan, appendRecord, changePlanStatus, comparePlan, getAnswer, setAnswer, planningGuide, choiceConflicts } from './engine.mjs';
import { surveyContext, buildSurveyQueue } from './survey-flow.mjs';
import { openStore, loadState, saveState, exportState, isPersistent } from './store.mjs';
const rel = url => String(url ?? '').replace(/^\//, '');

const $ = (s, root = document) => root.querySelector(s);
const escape = value => String(value ?? '').replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]));
const arr = value => Array.isArray(value) ? value : value == null ? [] : [value];
const words = value => typeof value === 'string' ? value : Array.isArray(value) ? value.map(words).join(' · ') : value && typeof value === 'object' ? Object.entries(value).map(([k, v]) => `${k}: ${words(v)}`).join(' · ') : String(value ?? '');
const uid = prefix => `${prefix}-${crypto.randomUUID()}`;
const today = () => new Date().toLocaleDateString('en-CA');
const labels = {
  curriculum: '교과', thinking: '사고력', arithmetic: '연산', science: '과학', other: '타 과목',
  elementary: '초등 범위', middle: '중등 범위', high: '고등 범위', unknown: '확인 필요',
  active: '유지', reduced: '줄여서 진행', paused: '쉬는 중', ended: '종료',
  in_progress: '학습 중', reported_done: '완료했다고 보고', reviewed_done: '범위를 확인한 완료', not_started: '미시작',
  parent_report: '학부모 보고', child_report: '아이 설명', teacher_observation: '교사 관찰', reviewed_work: '검토한 풀이·과제', individual_result_notice: '개인 결과 통지', institution_notice: '기관 공지', forwarded_template: '전달·문자 템플릿', third_party_case: '다른 아이 사례', ai_summary: 'AI 요약',
  actual: '실제 학습', diagnostic: '진단 기록', correction: '기존 기록 정정',
  not_prepared: '아직 준비하지 않음', planned: '진단 예정', deferred_for_remediation: '보완 후 진단', not_taken: '미응시', partly_taken: '일부 응시', taken_unreviewed: '응시·검토 전', reviewed: '검토 완료', correction_pending: '정정 확인 중',
  met: '해당 조건 충족 확인', not_met: '해당 조건 미충족', conflicting: '기록 충돌',
  whole: '전체 범위', selected_ranges: '일부 범위 발췌', first: '첫 풀이', repeat: '재풀이', available: '원응답 있음', not_recorded: '원응답 미기록', missing: '원응답 없음',
  observed: '실제 채점', corrected: '정정한 실제 채점', teacher_hypothetical_estimate: '교사가 가정한 예상 점수', unreviewed: '문항·채점 검토 전', error_suspected: '문항 오류 의심', invalid_for_scoring: '해당 문항 채점 보류',
  class: '수업', homework: '과제·집 공부', travel: '이동', current: '현재 일정', candidate: '고려하는 일정',
  mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일',
};
const label = v => labels[v] || v || '미등록';
const opts = values => values.map(v => Array.isArray(v) ? v : [v, label(v)]);
const num = v => v === '' || v == null ? null : Number(v);
const axes = opts(['curriculum', 'thinking', 'arithmetic', 'science', 'other']);
const completionOptions = opts(['unknown', 'not_started', 'in_progress', 'reported_done', 'reviewed_done']);
const roles = opts(['parent_report', 'child_report', 'teacher_observation', 'reviewed_work', 'individual_result_notice', 'institution_notice', 'forwarded_template', 'third_party_case', 'ai_summary']);
const courseStatuses = opts(['active', 'reduced', 'paused', 'ended']);

let state, catalog, contract, research, reference;
let serverRevision = 0, saving = false, dirty = false, saveTimer, saveError = '', saveConflict = false, tab = 'intake';
let showAllQuestions = false, showAllRoutes = false, questionQuery = '', routeQuery = '', routeView = '', evidenceQuery = '';
let selectedCourseIds = [], planTitle = '', planReason = '', inspectedPlanId = '';
let lastSaved = '', toastTimer;
let questionContexts = {}, focusedBranchIds = [], focusedCourseId = '';
let detailedIntakeOpen = false, expandedRoutesOpen = false, advancedQuestionsOpen = false, quickCourseEditId = '';
function uiFlow() { return state.uiFlow ??= {}; }
function currentStep() { return Math.max(1, Math.min(5, Number(uiFlow().onboardingStep) || 1)); }
function rememberView() { Object.assign(uiFlow(), { tab, detailedIntakeOpen, expandedRoutesOpen, advancedQuestionsOpen }); }
const reviewTriggers = [['scope_completed', '정한 학습 범위를 마쳤을 때'], ['diagnostic_reviewed', '진단·풀이 검토를 마쳤을 때'], ['time_changed', '수업·가정 지원 시간이 바뀌었을 때'], ['new_notice', '새 모집·운영 공고가 나왔을 때'], ['goal_changed', '가족이나 아이의 목표가 바뀌었을 때'], ['manual', '가족이 직접 다시 검토할 때']];
function questionContext(id) { return questionContexts[id] ?? state.answers[id]?.courseId ?? ''; }
function answerFor(id, courseId = questionContext(id)) { return getAnswer(state, id, courseId) || { values: [], note: '' }; }
function answerPresent(answer) { return !!(arr(answer?.values).length || answer?.note); }
function writeQuestionAnswer(id, changes) { state = setAnswer(state, id, { ...answerFor(id), ...changes, recordedAt: new Date().toISOString() }, questionContext(id)); }
function draftReviewPoints() { return arr(state.planDraft?.reviewPoints); }
function openBranches(ids, courseId = '') { focusedBranchIds = [...new Set(arr(ids).filter(Boolean))]; focusedCourseId = courseId; routeView = ''; routeQuery = ''; showAllRoutes = false; expandedRoutesOpen = true; tab = 'routes'; rememberView(); changed(); render({ focusMain: true }); window.scrollTo({ top: 0 }); }

function field(title, name, value = '', { type = 'text', bind = false, hint = '', wide = false, required = false, min, max, step } = {}) {
  const id = `f-${name.replace(/[^\w-]/g, '-')}`;
  return `<label class="field${wide ? ' field-wide' : ''}" for="${id}"><span>${escape(title)}</span><input id="${id}" name="${escape(name)}" ${bind ? `data-bind="${escape(name)}"` : ''} type="${type}" value="${escape(value)}" ${required ? 'required' : ''}${min != null ? ` min="${min}"` : ''}${max != null ? ` max="${max}"` : ''}${step != null ? ` step="${step}"` : ''}>${hint ? `<small class="hint">${escape(hint)}</small>` : ''}</label>`;
}
function select(title, name, value, options, { bind = false, wide = false, hint = '' } = {}) {
  const id = `f-${name.replace(/[^\w-]/g, '-')}`;
  return `<label class="field${wide ? ' field-wide' : ''}" for="${id}"><span>${escape(title)}</span><select id="${id}" name="${escape(name)}" ${bind ? `data-bind="${escape(name)}"` : ''}>${options.map(([v, t]) => `<option value="${escape(v)}" ${String(value ?? '') === String(v) ? 'selected' : ''}>${escape(t)}</option>`).join('')}</select>${hint ? `<small class="hint">${escape(hint)}</small>` : ''}</label>`;
}
function area(title, name, value = '', { bind = false, wide = true, hint = '' } = {}) {
  const id = `f-${name.replace(/[^\w-]/g, '-')}`;
  return `<label class="field${wide ? ' field-wide' : ''}" for="${id}"><span>${escape(title)}</span><textarea id="${id}" name="${escape(name)}" ${bind ? `data-bind="${escape(name)}"` : ''}>${escape(value)}</textarea>${hint ? `<small class="hint">${escape(hint)}</small>` : ''}</label>`;
}
function checks(title, key, values, options) {
  return `<fieldset><legend>${escape(title)}</legend><div class="choices">${options.map(([v, t]) => `<label class="choice"><input type="checkbox" data-array="${escape(key)}" value="${escape(v)}" ${arr(values).includes(v) ? 'checked' : ''}><span>${escape(t)}</span></label>`).join('')}</div></fieldset>`;
}
function getPath(key) { return key.split('.').reduce((o, k) => o?.[k], state); }
function setPath(key, value) { const keys = key.split('.'); let target = state; while (keys.length > 1) { const k = keys.shift(); target = target[k] ??= {}; } target[keys[0]] = value; }
function announce(message) { $('#announcer').textContent = message; }
function toast(message) { $('.toast')?.remove(); const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; el.setAttribute('role', 'status'); document.body.append(el); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), 6500); }
function changed({ renderPage = false } = {}) { dirty = true; saveError = ''; clearTimeout(saveTimer); saveTimer = setTimeout(save, 350); if (renderPage) render(); else updateSaveStatus(); }
function updateSaveStatus() {
  const el = $('#save-status'); if (!el) return;
  el.classList.toggle('error', !!saveError);
  el.textContent = saveError || (saving ? '저장 중…' : dirty ? '변경 사항 저장 대기' : lastSaved ? `저장됨 · ${lastSaved}` : isPersistent() ? '입력하면 이 기기에 저장됩니다' : '이 기기에 저장되지 않습니다 · 사본을 내려받아 주세요');
  $('#retry-save').hidden = !saveError;
  $('#retry-save').textContent = saveConflict ? '현재 입력 보관 후 최신 기록 열기' : '저장 다시 시도';
}
async function save() {
  clearTimeout(saveTimer);
  if (saving || !dirty) return;
  saving = true; dirty = false; updateSaveStatus();
  const snapshot = structuredClone(state);
  snapshot.revision = serverRevision;
  try {
    let result;
    try { result = await saveState(snapshot, serverRevision); }
    catch (failure) { saveConflict = failure.status === 409; throw new Error(saveConflict ? '다른 창의 저장과 충돌했습니다. 이 화면의 입력을 별도 보관한 뒤 최신 기록을 열 수 있습니다.' : arr(failure.details).length ? words(failure.details) : failure.message || `저장 실패 (${failure.status})`); }
    serverRevision = result.revision; state.revision = result.revision; lastSaved = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }); saveError = ''; saveConflict = false;
  } catch (error) { dirty = true; saveError = error.message; }
  finally { saving = false; updateSaveStatus(); if (dirty && !saveError) void save(); }
}

function header() {
  const starting = tab === 'intake' && !detailedIntakeOpen && !uiFlow().onboardingComplete;
  const age = ageMonths(state.profile);
  const nav = [['intake', '내 아이 정보'], ['questions', '필요한 질문'], ['routes', '길 살펴보기'], ['plan', '기준 계획·기록'], ['evidence', '참고 자료']];
  return `<header class="topbar"><div class="shell topbar-inner"><div class="brand">GFIELD<span>우리 아이 로드맵</span></div><div class="save-cluster"><span id="save-status" class="save-status" role="status"></span><button id="retry-save" hidden>저장 다시 시도</button>${!detailedIntakeOpen ? '<button class="quiet-button" data-action="open-detailed-intake">상세 기록 편집</button>' : ''}${starting ? '' : '<button data-action="export">E·G에 사본 보관</button>'}</div></div></header><div class="shell">${starting ? '' : `<div class="compact-page-header"><p class="hint">${escape(state.profile.grade || '학년 미입력')} · ${escape(age.label || '개월수 미확인')}</p></div><nav class="tabs" aria-label="로드맵 작업">${nav.map(([key, title]) => `<button class="tab" data-tab="${key}" ${tab === key ? 'aria-current="page"' : ''}>${title}</button>`).join('')}</nav>`}<main id="main" tabindex="-1">`;
}
function hwangsoPreferenceDetails(goals) {
  return `<div class="stack hwangso-preference-details">${checks('황소 선택을 그렇게 생각하는 이유 (복수 선택)', 'goals.hwangsoReasons', goals.hwangsoReasons, [['progress_pending', '진도 보완 후 검토'], ['young_depth', '아직 어리다고 보아 심화를 더 학습'], ['thorough_alternative', '황소 없이 꼼꼼히 학습'], ['time_fit', '시간·과제 여건'], ['child_preference', '아이의 의사'], ['other', '기타'], ['unsure', '아직 판단 중']])}<div class="field-grid">${field('생각하는 시점·다시 볼 때', 'goals.hwangsoTimingNote', goals.hwangsoTimingNote, { bind: true, hint: '학년·회차를 모르거나 시점을 정하지 않았다면 그대로 적어 주세요.' })}${field('선택 이유에 대한 설명', 'goals.hwangsoReasonNote', goals.hwangsoReasonNote, { bind: true })}</div><p class="hint">선택 시점·가족이 생각하는 이유·확인된 실력은 따로 기록합니다. 늦게 고려하거나 선택하지 않는 이유만으로 진도·심화 수준·진입 조건을 판단하지 않습니다.</p></div>`;
}
function hwangsoHopeDifference() {
  const current = state.goals.hwangso;
  const choices = { 'B28:P1': 'grade2', 'B28:P2': 'grade3', 'B28:P3': 'none', 'B28:P5': 'undecided', 'B28:P6': 'later' };
  const names = { grade2: '초2 시점 고려', grade3: '초3 시점 고려', none: '선택하지 않음', undecided: '미정', later: '나중에 고려' };
  const selected = [...new Set(state.selectedRouteIds.map(id => choices[id]).filter(Boolean))];
  if (!current || current === 'undecided' || !selected.length || selected.every(choice => choice === current)) return '';
  return `입력한 희망은 ‘${names[current] || current}’, 기준으로 고른 황소 경로는 ‘${selected.map(choice => names[choice]).join(' / ')}’입니다.`;
}
function sidebar() {
  const work = workload(state), active = activeModules(state, contract), plan = state.plans.find(p => p.id === state.activePlanId);
  return `<aside class="side-panel"><h3>현재 기록</h3><ul class="summary-list">${axes.map(([axis, title]) => `<li><strong>${title}</strong>${state.courses.filter(c => c.axis === axis).length ? `${state.courses.filter(c => c.axis === axis).length}개 과정` : '미등록 · 미시작으로 추정하지 않음'}</li>`).join('')}<li><strong>이어지는 질문</strong>${new Set(active.questionIds).size}개 · 답변과 실제 과정에 따라 조정</li><li><strong>현재 일정의 확인된 시간</strong>아이 ${work.childMinutes == null ? '미확인' : `${work.childMinutes}분/주`}<br>보호자 ${work.adultMinutes == null ? '미확인' : `${work.adultMinutes}분/주`}${work.unknown?.length ? '<br><span class="muted small">미확인 시간이 있어 일부 합계입니다.</span>' : ''}</li><li><strong>선택한 기준 계획</strong>${plan ? `${escape(plan.title)} · ${plan.version}번째 기준` : '아직 선택하지 않았습니다.'}</li></ul><p class="hint">모르는 항목은 비워 두어도 됩니다. 기록된 진도만으로 약점이나 합격 가능성을 판단하지 않습니다.</p></aside>`;
}
function quickChoices(title, key, value, options) {
  return `<fieldset><legend>${escape(title)}</legend><div class="quick-choices">${options.map(([id, text]) => `<label class="choice"><input type="radio" name="${escape(key)}" data-flow-choice="${escape(key)}" value="${escape(id)}" ${value === id ? 'checked' : ''}><span>${escape(text)}</span></label>`).join('')}</div></fieldset>`;
}
function quickCourseForm() {
  const draft = uiFlow().quickCourseDraft || {};
  return `<form id="quick-course-form"><div class="field-grid">${field('지금 쓰는 교재·과정 이름', 'quick.course', draft.course, { hint: '이름을 모르면 비워 두셔도 됩니다.' })}${select('어느 공부인가요?', 'quick.axis', draft.axis || 'curriculum', axes)}</div><details class="quick-detail"><summary>권·단원·진도도 알고 있다면 (선택)</summary><div class="field-grid">${field('권', 'quick.volume', draft.volume)}${field('단원', 'quick.unit', draft.unit)}${field('실제로 다룬 범위', 'quick.range', draft.range)}${select('교재의 실제 수준', 'quick.level', draft.level || 'unknown', opts(['unknown', 'elementary', 'middle', 'high', 'other']))}${select('확인한 학습 상태', 'quick.completion', draft.completion || 'unknown', completionOptions)}</div><p class="hint">어린 나이여도 높은 과정을 입력할 수 있습니다. 이름만으로 완료를 판단하지 않습니다.</p></details><div class="actions"><button type="submit">${quickCourseEditId ? '과정 수정' : '과정 추가'}</button></div></form>`;
}
function selectionFocusField() {
  return select('어떤 방향을 생각하나요? (선택)', 'uiFlow.selectionFocus', uiFlow().selectionFocus || '', [['', '지금은 정하지 않음'], ['premier', '프리미어·필즈'], ['hwangso', '황소 초등'], ['gifted', '영재원'], ['highSchool', '고등학교·진학'], ['other', '다른 목표']], { bind: true });
}
function intake() {
  if (detailedIntakeOpen) return `<div class="mode-note"><span>상세 기록을 편집하고 있습니다.</span><button data-action="return-quick-intake">간단한 시작으로 돌아가기</button></div>${detailedIntake()}`;
  const step = currentStep(), flow = uiFlow(), context = surveyContext(state);
  const titles = ['아이의 현재 시점을 알려 주세요.', '지금 어떤 공부를 하고 있나요?', '집에서 얼마나 도울 수 있나요?', '학원 수업은 어느 정도 생각하나요?', '가까운 바람 하나만 골라 주세요.'];
  const intros = ['출생 연월과 실제 학년을 따로 기록해요.', '아는 것만 적어 주세요. 자세한 진도는 나중에 확인할 수 있어요.', '평소 가능한 정도면 됩니다. 아직 몰라도 괜찮아요.', '현재 시간표를 모두 적을 필요는 없어요.', '아이의 현재 시점에 맞춰 먼저 물어볼게요. 나중에 바꿀 수 있어요.'];
  let content = '';
  if (step === 1) content = `<div class="field-grid">${field('출생 연월', 'profile.birthMonth', state.profile.birthMonth, { type: 'month', bind: true })}${select('실제 학년', 'profile.grade', state.profile.grade, [['', '아직 입력하지 않음'], ['미취학', '미취학'], ...Array.from({ length: 6 }, (_, i) => [`초${i + 1}`, `초등 ${i + 1}학년`]), ...Array.from({ length: 3 }, (_, i) => [`중${i + 1}`, `중학교 ${i + 1}학년`]), ...Array.from({ length: 3 }, (_, i) => [`고${i + 1}`, `고등학교 ${i + 1}학년`]), ['기타', '기타·해외·학년 구분 없음']], { bind: true })}</div><p class="hint">학년으로 공부할 수 있는 과정을 제한하지 않습니다.</p>`;
  if (step === 2) content = `${quickChoices('현재 공부하는 과정이 있나요?', 'studyStatus', flow.studyStatus || (state.courses.length ? 'learning' : ''), [['learning', '지금 하는 공부가 있어요'], ['not_started', '아직 시작하지 않았어요'], ['unknown', '지금은 잘 모르겠어요']])}${state.courses.length ? `<ul class="quick-course-list">${state.courses.map(c => `<li><span><strong>${escape(c.course || c.subject)}</strong><small>${label(c.axis)} · ${label(c.completion)}</small></span><button data-quick-edit="${escape(c.id)}">수정</button></li>`).join('')}</ul>` : ''}${(flow.studyStatus === 'learning' || (!flow.studyStatus && state.courses.length)) ? (!state.courses.length || flow.quickAddingCourse || quickCourseEditId ? quickCourseForm() : '<button data-action="quick-add-course">다른 과정도 추가</button>') : '<p class="hint">여기서 선택해도 기존 과정 기록은 지우지 않습니다.</p>'}`;
  if (step === 3) content = `<div class="field-grid">${field('평일 하루 도울 시간 (분)', 'support.weekdayMinutes', state.support.weekdayMinutes, { type: 'number', min: 0, bind: true, hint: '모르면 빈칸, 도움이 필요 없으면 0' })}${field('주말 하루 도울 시간 (분)', 'support.weekendMinutes', state.support.weekendMinutes, { type: 'number', min: 0, bind: true })}</div>`;
  if (step === 4) content = `<div class="field-grid">${field('생각하는 수업 횟수 (주)', 'academy.desiredFrequency', state.academy.desiredFrequency, { type: 'number', min: 0, bind: true })}${field('회당 수업 시간 (분)', 'academy.desiredSessionMinutes', state.academy.desiredSessionMinutes, { type: 'number', min: 0, bind: true })}</div><p class="hint">아직 정하지 않았다면 그대로 넘어가세요. 수업 횟수만으로 학습 속도를 정하지 않습니다.</p>`;
  if (step === 5) {
    const options = context.stage === 'preschool' || context.stage === 'unknown' ? [['adaptation', '공부와 조금 더 친해지기'], ['maintain', '지금 하는 공부 잘 이어가기'], ['depth', '서두르지 않고 깊이 배우기'], ['undecided', '아직 잘 모르겠어요']] : context.stage === 'middlehigh' ? [['maintain', '학교 공부와 균형 잡기'], ['depth', '심화 학습 꼼꼼히 이어가기'], ['selection', '진학 방향도 함께 살펴보기'], ['undecided', '아직 잘 모르겠어요']] : [['maintain', '기본을 꼼꼼하게 다지기'], ['depth', '심화도 차근차근 배우기'], ['selection', '선발 과정도 함께 살펴보기'], ['undecided', '아직 잘 모르겠어요']];
    content = `${quickChoices('지금 가장 가까운 바람은 무엇인가요?', 'quickGoal', flow.quickGoal || '', options)}${flow.quickGoal === 'selection' ? `<div class="quick-followup">${selectionFocusField()}</div>` : ''}<details class="quick-detail"><summary>다른 목표를 직접 입력·추가하고 싶어요</summary>${field('직접 적는 희망', 'goals.priority', state.goals.priority, { bind: true })}${flow.quickGoal !== 'selection' ? selectionFocusField() : ''}<p class="hint">나이와 상관없이 다른 선발·높은 과정도 적을 수 있습니다. 필요한 상세 기록은 나중에 더할 수 있어요.</p></details>`;
  }
  return `<section class="onboarding" id="onboarding" data-step="${step}"><div class="onboarding-progress"><span>짧은 시작 ${step} / 5</span><span>아는 만큼만 답해도 돼요</span></div><progress value="${step}" max="5" aria-label="짧은 시작 ${step}단계, 전체 5단계"></progress><div class="onboarding-content"><h1>${titles[step - 1]}</h1><p class="section-intro">${intros[step - 1]}</p>${content}</div><div class="onboarding-actions">${step > 1 ? '<button data-onboarding-prev>이전</button>' : ''}<button class="primary" data-onboarding-next>${step === 5 ? '답한 만큼 길 보기' : '다음'}</button><button class="quiet-button" data-onboarding-skip>${step === 5 ? '바람은 나중에 정하기' : '이 내용은 나중에 입력'}</button></div><p class="hint">입력한 내용과 지금 위치는 저장됩니다.</p></section>`;
}
function commitQuickCourse() {
  const form = $('#quick-course-form');
  const raw = form ? Object.fromEntries(new FormData(form)) : Object.fromEntries(Object.entries(uiFlow().quickCourseDraft || {}).map(([key, value]) => [`quick.${key}`, value]));
  const draft = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key.replace(/^quick\./, ''), value]));
  if (!String(draft.course || '').trim()) return false;
  const existing = state.courses.find(c => c.id === quickCourseEditId);
  const course = { id: quickCourseEditId || uid('course'), axis: 'curriculum', subject: '', course: '', edition: '', volume: '', unit: '', range: '', level: 'unknown', completion: 'unknown', coverageIntent: 'unknown', depth: '', independence: '', status: 'active', plannedRange: '', sourceRole: 'parent_report', evidenceDate: state.profile.asOf, note: '', ...existing, ...draft, course: draft.course.trim() };
  const index = state.courses.findIndex(c => c.id === course.id);
  if (index < 0) state.courses.push(course); else state.courses[index] = course;
  if (!selectedCourseIds.includes(course.id)) selectedCourseIds.push(course.id);
  quickCourseEditId = ''; uiFlow().quickCourseEditId = ''; uiFlow().quickCourseDraft = {}; uiFlow().quickAddingCourse = false; uiFlow().studyStatus = 'learning';
  return true;
}
function detailedIntake() {
  const p = state.profile, s = state.support, a = state.academy, g = state.goals;
  return `<div class="layout"><div class="stack"><section class="panel"><h2>아이의 현재 시점</h2><p class="section-intro">실제 나이·학년과 공부하는 수준을 각각 기록합니다.</p><div class="field-grid">${field('출생 연월', 'profile.birthMonth', p.birthMonth, { type: 'month', bind: true })}${field('출생일 (선택)', 'profile.birthDay', p.birthDay, { type: 'number', min: 1, max: 31, bind: true, hint: '일자를 모르면 개월수 범위로 보여 드립니다.' })}${select('실제 학년', 'profile.grade', p.grade, [['', '선택 / 확인 필요'], ['미취학', '미취학'], ...Array.from({ length: 6 }, (_, i) => [`초${i + 1}`, `초등 ${i + 1}학년`]), ...Array.from({ length: 3 }, (_, i) => [`중${i + 1}`, `중학교 ${i + 1}학년`]), ...Array.from({ length: 3 }, (_, i) => [`고${i + 1}`, `고등학교 ${i + 1}학년`]), ['기타', '기타·해외·학년 구분 없음']], { bind: true })}${field('기록 기준일', 'profile.asOf', p.asOf, { type: 'date', bind: true })}${field('학교 학년도', 'profile.academicYear', p.academicYear, { type: 'number', min: 1900, max: 2200, bind: true })}${field('학교 소재 지역 / 권역', 'profile.region', p.region, { bind: true, hint: '영재원·학교별 지원 조건을 확인할 때 사용합니다.' })}</div></section>
  <section class="panel"><h2>집에서 도울 수 있는 범위</h2><p class="section-intro">가능한 시간과 도움의 종류를 나눕니다. 아래 시간은 희망·지원 여건이며 실제 일정 합계와 별도로 보관합니다.</p><div class="field-grid">${field('평일 하루 보호자 지원 가능 시간 (분)', 'support.weekdayMinutes', s.weekdayMinutes, { type: 'number', min: 0, bind: true, hint: '모르면 빈칸으로 둡니다.' })}${field('주말 하루 보호자 지원 가능 시간 (분)', 'support.weekendMinutes', s.weekendMinutes, { type: 'number', min: 0, bind: true })}<div class="field-wide">${checks('가능한 도움 (복수 선택)', 'support.helpTypes', s.helpTypes, [['reading', '문제 읽기'], ['explanation', '풀이 설명'], ['materials', '교재·준비물'], ['marking', '채점'], ['travel', '이동'], ['routine', '습관·일정 관리'], ['independent', '아이 혼자 진행'], ['unknown', '아직 모름']])}</div>${select('현재 과제에 걸리는 시간을 알고 있나요?', 'support.homeworkKnown', s.homeworkKnown, [['unknown', '확인 필요'], ['yes', '확인한 시간이 있음'], ['no', '아직 확인하지 못함']], { bind: true, wide: true })}</div></section>
  <section class="panel"><h2>현재 수업과 고려하는 수업</h2><div class="field-grid">${field('현재 수학 수업 횟수 (주)', 'academy.currentFrequency', a.currentFrequency, { type: 'number', min: 0, bind: true })}${field('현재 회당 수업 시간 (분)', 'academy.currentSessionMinutes', a.currentSessionMinutes, { type: 'number', min: 0, bind: true })}${field('고려하는 수업 횟수 (주)', 'academy.desiredFrequency', a.desiredFrequency, { type: 'number', min: 0, bind: true })}${field('고려하는 회당 시간 (분)', 'academy.desiredSessionMinutes', a.desiredSessionMinutes, { type: 'number', min: 0, bind: true })}</div><p class="hint">정확한 시간표·이동·과제는 아래 ‘요일별 일정’에 따로 추가합니다. 횟수로 학습 속도를 결정하지 않습니다.</p></section>
  <section class="panel"><div class="row"><div><h2>지금 하는 공부</h2><p class="section-intro">교과·사고력·연산을 따로, 병행하는 과정은 여러 개 추가해 주세요.</p></div><button class="primary" data-action="add-course">과정 추가</button></div>${courseList()}<div class="notice">학년이 낮아도 중등·고등 범위를 입력할 수 있습니다. 교재명과 함께 실제로 다룬 권·단원·범위를 기록해 주세요.</div></section>
  <section class="panel"><h2>가족이 원하는 방향</h2><div class="stack">${checks('가까운 시기에 바라는 것', 'goals.parent', g.parent, [['adaptation', '학습 적응'], ['depth', '깊이 있게 이해'], ['progress', '다음 범위 학습'], ['selection', '선발 고려'], ['exploration', '탐구 경험'], ['maintain', '현재 공부 유지'], ['undecided', '아직 미정']])}<div class="field-grid">${field('우선순위와 생각하는 시점', 'goals.priority', g.priority, { bind: true })}${field('아이의 의견', 'goals.child', g.child, { bind: true })}${select('프리미어·필즈에 대한 생각', 'goals.premier', g.premier, [['undecided', '미정'], ['consider', '고려 중'], ['current', '현재 재원'], ['later', '나중에 검토'], ['none', '선택하지 않음']], { bind: true })}${select('황소 초등 선택', 'goals.hwangso', g.hwangso, [['undecided', '미정 · 현재 공부 유지하며 비교'], ['grade2', '초2 시점 고려'], ['grade3', '초3 시점 고려'], ['later', '나중에 고려 · 시점은 별도로 기록'], ['none', '선택하지 않음']], { bind: true })}</div>${hwangsoPreferenceDetails(g)}<fieldset><legend>함께 살펴볼 분야 (복수 선택)</legend><div class="choices">${[['science', '과학'], ['gifted', '영재원'], ['competition', '경시'], ['highSchool', '고등학교 선택'], ['medical', '의학 계열 진로']].map(([key, title]) => `<label class="choice"><input type="checkbox" data-bool="goals.${key}" ${g[key] ? 'checked' : ''}><span>${title}</span></label>`).join('')}</div></fieldset>${g.competition ? select('경시 자료 학습과 대회 응시', 'goals.competitionIntent', g.competitionIntent, [['undecided', '응시 여부 미정'], ['enter', '대회 응시도 고려'], ['do_not_enter', '자료를 공부하되 응시하지 않음']], { bind: true }) : ''}${g.highSchool || g.medical ? `<div class="field-grid">${checks('비교하고 싶은 고등학교 유형', 'goals.schoolTypes', g.schoolTypes, [['gifted_school', '영재고'], ['science_school', '과학고'], ['autonomous', '자사고'], ['general', '일반고'], ['undecided', '아직 미정']])}${field('희망 기관·학교 (여러 곳 가능)', 'goals.institution', g.institution, { bind: true })}${field('목표 입학 학년도', 'goals.admissionYear', g.admissionYear, { type: 'number', min: 1900, max: 2200, bind: true })}</div>` : ''}${g.medical && arr(g.schoolTypes).some(x => ['gifted_school', 'science_school'].includes(x)) ? '<div class="notice">의학 계열 진로와 영재고·과학고를 함께 비교하고 있습니다. 학교별 설립 목적·지원 안내·의약학 계열 진학 정책을 참고 자료에서 확인한 뒤 목표를 다시 검토해 주세요.</div>' : ''}</div></section>
  <section class="panel"><div class="row"><div><h2>요일별 일정</h2><p class="section-intro">수업·과제·이동을 따로 적으면 병행 후보의 시간 겹침을 확인할 수 있습니다.</p></div><button data-action="add-activity">일정 추가</button></div>${activityList()}${workloadBlock()}</section><div class="actions"><button class="primary" data-tab="questions">현재 기록에 따른 추가 질문 보기</button><button data-tab="routes">먼저 경로 비교하기</button></div></div>${sidebar()}</div>`;
}
function courseList() {
  if (!state.courses.length) return '<div class="empty">등록한 과정이 없습니다. 알고 있는 과정부터 추가하세요.</div>';
  return `<div class="course-list">${state.courses.map(c => `<article class="course-item"><div class="row"><div><h3>${escape(c.course || c.subject || '과정명 미등록')}</h3><p>${escape([c.volume, c.unit, c.range].filter(Boolean).join(' · ') || '권·단원·범위 확인 필요')}</p></div><button data-edit-course="${escape(c.id)}">과정 수정</button></div><div class="course-meta"><span class="badge">${label(c.axis)}</span><span class="badge">${label(c.level)}</span><span class="badge">${label(c.completion)}</span><span class="badge">${label(c.status)}</span></div><p class="muted small">${escape(c.depth || '깊이 미확인')} · ${escape(c.independence || '도움 정도 미확인')} · ${label(c.sourceRole)}</p></article>`).join('')}</div>`;
}
function activityList() {
  return state.activities.length ? `<ul class="record-list">${state.activities.map(a => `<li><div class="row"><div><strong>${escape(a.name)} <span class="badge">${label(a.scope)}</span></strong>${label(a.day)} · ${a.start && a.end ? `${escape(a.start)}–${escape(a.end)}` : a.minutes != null ? `${a.minutes}분` : '시간 미확인'} · ${label(a.kind)}<br><span class="muted">보호자 ${a.adultMinutes == null ? '시간 미확인' : `${a.adultMinutes}분`}</span></div><button data-edit-activity="${escape(a.id)}">수정</button></div></li>`).join('')}</ul>` : '<div class="empty">요일별 일정은 아직 없습니다. 주간 수업 희망 횟수와 실제 시간표는 별도입니다.</div>';
}
function workloadBlock() {
  const w = workload(state);
  return `<div class="notice"><p><strong>현재 일정의 확인된 시간</strong> · 아이 ${w.childMinutes == null ? '미확인' : `${w.childMinutes}분/주`} · 보호자 ${w.adultMinutes == null ? '미확인' : `${w.adultMinutes}분/주`}</p>${arr(w.unknown).length ? `<p>미확인: ${escape(words(w.unknown))}</p>` : ''}${arr(w.conflicts).length ? `<p>시간 겹침: ${escape(words(w.conflicts))}</p>` : ''}${arr(w.notes).length ? `<p class="small">${escape(words(w.notes))}</p>` : ''}</div>`;
}

function beginQuestionBatch(mode = 'quick') {
  const prior = uiFlow().followup || {};
  const dismissedKeys = arr(prior.dismissedKeys);
  const queue = buildSurveyQueue(state, catalog, { mode, dismissedKeys, limit: 3 });
  uiFlow().followup = { batchKeys: arr(queue.batchKeys), items: structuredClone(arr(queue.items)), cursor: 0, dismissedKeys, initialized: true };
  changed();
}
function questionPanel() {
  if (advancedQuestionsOpen) return `<div class="mode-note"><span>전체 질문을 직접 살펴보는 상세 보기입니다.</span><button data-action="return-quick-questions">한 번에 하나씩 보기</button></div>${advancedQuestionPanel()}`;
  if (!uiFlow().followup?.initialized) beginQuestionBatch();
  const followup = uiFlow().followup;
  const items = arr(followup.items), cursor = Number(followup.cursor) || 0;
  const item = items[cursor];
  if (!item) {
    const more = buildSurveyQueue(state, catalog, { mode: 'more', dismissedKeys: [...arr(followup.dismissedKeys), ...arr(followup.batchKeys)], limit: 3 });
    return `<section class="onboarding followup-card"><p class="eyebrow">필요한 만큼만</p><h1>${items.length ? '여기까지 답해도 충분해요.' : '답한 내용으로 먼저 살펴볼게요.'}</h1><p class="section-intro">모르는 내용은 남겨 두고, 지금까지의 기록으로 길을 비교할 수 있습니다.</p><div class="actions"><button class="primary" data-tab="routes">답한 만큼 길 보기</button>${arr(more.items).length ? '<button data-action="more-questions">원하면 질문을 조금 더 보기</button>' : ''}</div><details class="quick-detail"><summary>직접 찾아볼 질문이 있다면</summary><button data-action="advanced-questions">전체 질문 직접 살펴보기</button></details></section>`;
  }
  const q = catalog.questions.find(question => question.id === (item.questionId || item.id));
  if (!q) return '<div class="empty">질문 정보를 확인하지 못했습니다. 입력한 기록은 유지됩니다.</div>';
  questionContexts[q.id] = item.courseId || '';
  return `<section class="onboarding followup-card" id="quick-question" data-question-id="${escape(q.id)}"><div class="onboarding-progress"><span>선택 질문 ${cursor + 1} / ${items.length}</span><span>지금은 최대 3개만</span></div><p class="hint">${escape(item.reason || '현재 기록과 관련 있는 내용만 확인해요.')}</p>${questionMarkup({ ...q, prompt: item.prompt || q.prompt, answer_options: item.answerOptions || q.answer_options }, { compact: true })}<div class="onboarding-actions">${cursor > 0 ? '<button data-followup-prev>이전</button>' : ''}<button class="primary" data-followup-next>${cursor + 1 === items.length ? '여기까지 답하고 길 보기' : '다음 질문'}</button><button class="quiet-button" data-followup-skip>지금은 잘 모르겠어요</button></div><details class="quick-detail"><summary>다른 질문을 직접 찾고 싶어요</summary><button data-action="advanced-questions">전체 질문 직접 살펴보기</button></details></section>`;
}
function advancedQuestionPanel() {
  const active = activeModules(showAllQuestions ? { ...state, exploreAll: true } : state, contract);
  const ids = new Set(active.questionIds);
  const list = catalog.questions.filter(q => ids.has(q.id) && `${q.prompt} ${q.module} ${q.followup}`.toLowerCase().includes(questionQuery.toLowerCase()));
  const groups = [...new Set(list.map(q => q.module))];
  const answeredIds = catalog.questions.filter(q => ['', ...state.courses.map(c => c.id)].some(courseId => answerPresent(getAnswer(state, q.id, courseId)))).map(q => q.id);
  const answered = answeredIds.length;
  const inactiveAnswers = answeredIds.filter(id => !ids.has(id));
  return `<section class="panel"><h2>현재 기록에 따라 이어지는 질문</h2><p class="section-intro">관련 있는 질문을 묶어 보여 드립니다. 모름·미정도 답변으로 남길 수 있고, 설명은 과정별로 연결할 수 있습니다.</p><div class="toolbar">${field('질문 찾기', 'question-search', questionQuery, { type: 'search' })}<label class="choice"><input type="checkbox" id="show-all-questions" ${showAllQuestions ? 'checked' : ''}><span>전체 ${catalog.questions.length}개 질문 살펴보기</span></label></div><p class="small muted">현재 ${list.length}개 질문 · 전체 답변 기록 ${answered}개${inactiveAnswers.length ? ` · 이전 조건의 답변 ${inactiveAnswers.length}개 보존` : ''}</p></section><div class="stack" style="margin-top:20px">${groups.map((group, groupIndex) => { const qs = list.filter(q => q.module === group); return `<details class="question-group" data-group="${escape(group)}" ${groupIndex === 0 ? 'open' : ''}><summary>${escape(group)}<span>${qs.length}개 질문</span></summary>${qs.map(questionMarkup).join('')}</details>`; }).join('') || '<div class="empty">검색에 맞는 질문이 없습니다. 검색어를 지우거나 전체 질문을 열어 보세요.</div>'}</div><div class="actions"><button class="primary" data-tab="routes">답변으로 경로 비교하기</button><button data-tab="intake">현재 과정 수정하기</button></div>`;
}
function questionMarkup(q, { compact = false } = {}) {
  const context = questionContext(q.id);
  const answer = answerFor(q.id, context);
  const contextName = state.courses.find(c => c.id === context)?.course || '공통';
  const courseChoice = !compact && state.courses.length ? `<label class="field question-context" for="course-${q.id}"><span>어느 과정에 대한 답변인가요?</span><select id="course-${q.id}" data-answer-course="${q.id}"><option value="" ${!context ? 'selected' : ''}>공통 답변${answerPresent(getAnswer(state, q.id, '')) ? ' · 기록 있음' : ''}</option>${state.courses.map(c => `<option value="${escape(c.id)}" ${context === c.id ? 'selected' : ''}>${escape(c.course || c.subject)} · ${label(c.axis)}${answerPresent(getAnswer(state, q.id, c.id)) ? ' · 기록 있음' : ''}</option>`).join('')}</select><small class="hint">과정을 바꾸면 그 과정의 독립된 답변을 엽니다. 다른 과정에 쓴 답변은 그대로 남습니다.</small></label>` : '';
  const note = `<label class="field" for="note-${q.id}"><span>해당 범위·시점·설명 (선택)</span><textarea id="note-${q.id}" data-answer-note="${q.id}">${escape(answer.note)}</textarea></label>`;
  return `<article class="question" id="question-${q.id}"><h3 class="question-title">${escape(q.prompt)}</h3>${courseChoice}${!compact || context ? `<p class="answer-context-label small"><strong>${escape(contextName)} 답변</strong>${answerPresent(answer) ? ' · 기록 있음' : ''}</p>` : ''}<div class="choices">${arr(q.answer_options).map((option, i) => `<label class="choice"><input type="checkbox" id="answer-${q.id}-${i}" data-answer="${q.id}" value="${escape(words(option))}" ${arr(answer.values).includes(words(option)) ? 'checked' : ''}><span>${escape(words(option))}</span></label>`).join('')}</div>${compact ? `<details class="quick-detail"><summary>설명을 덧붙이기 (선택)</summary>${note}</details>` : note}<details><summary>질문의 이유·근거</summary><p class="small">${escape(q.followup)}</p>${sourceList(q.source_ids)}</details></article>`;
}
function sourceList(ids) {
  return `<ul class="source-list">${arr(ids).map(id => { const s = catalog.sources?.[id]; return `<li>${escape(s ? `${s.file || s.title} · ${s.year || '기준 연도 미상'} · ${s.locator || ''}` : id)}</li>`; }).join('')}</ul>`;
}
function allRoutes() { return routeCandidates({ ...state, exploreAll: true }, catalog, contract); }
function pathLabel(id) { for (const route of allRoutes()) { const path = route.paths.find(p => p.id === id); if (path) return `${route.title} — ${path.label}`; if (route.id === id) return route.title; } return id; }
function officialRouteSources(branchId) {
  const entries = arr(research.items).filter(item => arr(item.branchIds).includes(branchId));
  return entries.length ? `<h4>관련 공식 자료</h4><ul class="source-list">${entries.map(item => `<li><a href="${escape(rel(item.url))}" target="_blank" rel="noopener noreferrer">${escape(item.title)}</a> · ${escape(item.academicYear || '적용 연도 확인 필요')}${/conflict/i.test(item.status || '') ? ' · 연도 표시 충돌 확인 필요' : /existence/i.test(item.status || '') ? ' · 자료 존재만 확인' : ''}</li>`).join('')}</ul><p class="hint">기관·지역·목표 학년도가 맞는지 별도로 확인합니다. 상세 질문은 참고 자료에서 확인할 수 있습니다.</p>` : '';
}
function planningGuideMarkup() {
  const guide = planningGuide(state, catalog, contract);
  return `<section class="panel planning-guide"><h2>이번 기록에서 먼저 살펴볼 내용</h2><p class="section-intro">작성한 답변·실제 과정·희망을 연결한 검토 제안입니다. 이유를 확인한 뒤 관련 질문이나 갈림길을 직접 열어 보세요.</p><div class="guide-list">${arr(guide.suggestions).map(suggestion => `<article class="guide-item"><h3>${escape(suggestion.title)}</h3><p>${escape(suggestion.reason)}</p>${arr(suggestion.decisionIds).includes('U20261003-H01') ? '<p class="hint">이번 대화의 사용자 결정 · 황소 선택 이유 분리</p>' : ''}<div class="actions">${arr(suggestion.branchIds).length ? `<button data-open-branches="${escape(suggestion.branchIds.join(','))}" data-route-course="${escape(suggestion.courseId || '')}">관련 갈림길 비교</button>` : ''}${arr(suggestion.questionIds).map(id => `<button class="mini" data-open-question="${escape(id)}" data-question-course="${escape(suggestion.courseId || '')}">${escape(catalog.questions.find(q => q.id === id)?.prompt || '추가 질문 보기')}</button>`).join('')}</div>${arr(suggestion.sourceIds).length ? `<details class="evidence-details"><summary>이 제안의 근거</summary>${sourceList(suggestion.sourceIds)}</details>` : ''}</article>`).join('') || '<p class="muted">현재 기록만으로 좁힌 제안이 없습니다. 아는 과정과 희망부터 추가하거나 아래에서 직접 탐색해 보세요.</p>'}</div>${arr(guide.missing).length ? `<div class="notice"><strong>더 확인하면 비교에 도움이 되는 내용</strong><ul class="plain">${guide.missing.map(item => `<li>${escape(words(item))}</li>`).join('')}</ul></div>` : ''}${arr(guide.notes).length ? `<p class="hint">${escape(words(guide.notes))}</p>` : ''}</section>`;
}
function reviewPointDraftMarkup() {
  return `<section class="review-point-editor"><hr class="divider"><h3>보완 후 다시 볼 지점</h3><p class="hint">어떤 일이 확인되면 어느 갈림길을 다시 볼지 정합니다. 충족·합류를 자동 처리하지 않습니다.</p>${draftReviewPoints().length ? `<ul class="review-point-list">${draftReviewPoints().map(point => `<li><strong>${escape(point.condition || '조건 미정')}</strong><p class="small">${escape(reviewTriggers.find(([id]) => id === point.trigger)?.[1] || '사건 미정')}<br>${escape(point.nextAction || '다음 행동 미정')}</p><div class="actions"><button data-review-edit="${escape(point.id)}">지점 수정</button><button data-review-remove="${escape(point.id)}">초안에서 제외</button></div></li>`).join('')}</ul>` : '<p class="small muted">아직 정한 지점이 없습니다. 필요할 때 여러 개 추가할 수 있습니다.</p>'}<button data-action="add-review-point">다시 볼 지점 추가</button></section>`;
}
function reviewPointsMarkup(plan) {
  const points = arr(plan.reviewPoints || plan.selection?.reviewPoints);
  if (!points.length) return '<p class="hint">이 기준에는 별도로 정한 재검토 지점이 없습니다. 변경안을 비교할 때 추가할 수 있습니다.</p>';
  return `<section class="plan-review-points"><h3>보완 후 다시 볼 지점</h3><p class="hint">선택 당시 정한 검토 조건입니다. 실제 기록이 생겨도 완료·합류로 자동 변경하지 않습니다.</p><ul class="review-point-list">${points.map(point => { const course = point.courseSnapshot || arr(plan.courseSnapshots).find(c => c.id === point.courseId) || state.courses.find(c => c.id === point.courseId); const branch = catalog.branches.find(b => b.id === point.branchId); return `<li><h4>${escape(point.condition || '조건 미정')}</h4><p><strong>다시 볼 사건</strong> · ${escape(reviewTriggers.find(([id]) => id === point.trigger)?.[1] || '직접 검토')}</p><p><strong>영향받는 과정</strong> · ${escape(course?.course || (point.courseId ? '과정 확인 필요' : '공통'))}</p><p><strong>돌아갈 갈림길</strong> · ${escape(branch?.title || '당시 기록으로 관련 경로 다시 비교')}</p><p><strong>다음 행동</strong> · ${escape(point.nextAction || '직접 정할 예정')}</p><button data-review-revisit="${escape(point.branchId || '')}" data-review-condition="${escape(point.condition || '')}" data-review-course="${escape(point.courseId || '')}">이 지점 다시 비교</button></li>`; }).join('')}</ul></section>`;
}
function routesPanel() {
  if (expandedRoutesOpen) return `<div class="mode-note"><span>경로와 근거를 자세히 비교하고 있습니다.</span><button data-action="return-quick-routes">먼저 볼 내용만 보기</button></div>${expandedRoutesPanel()}`;
  const guide = planningGuide(state, catalog, contract);
  const seen = new Set();
  const actions = arr(guide.suggestions).filter(item => { const key = arr(item.branchIds).join('|') || item.id; if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 3);
  return `<section class="quick-results" id="quick-results"><p class="eyebrow">답한 만큼 먼저 보기</p><h1>우선 이 부분부터 살펴보세요.</h1><p class="section-intro">${state.courses.length ? `기록한 ${state.courses.length}개 과정과 현재 바람을 바탕으로 골랐어요.` : '아직 자세한 진도는 모르므로, 공부할 과정을 단정하지 않고 확인할 일부터 보여 드려요.'}</p><div class="quick-result-list">${actions.map((item, index) => `<article class="quick-result-item"><span class="small muted">${index + 1}</span><h2>${escape(item.title)}</h2><p>${escape(item.reason)}</p>${arr(item.branchIds).length ? `<button data-open-branches="${escape(item.branchIds.join(','))}" data-route-course="${escape(item.courseId || '')}">이 내용 자세히 보기</button>` : ''}<details class="quick-detail"><summary>왜 이 내용을 보여 주나요?</summary>${sourceList(item.sourceIds)}${arr(item.decisionIds).includes('U20261003-H01') ? '<p class="hint">이번 대화의 사용자 결정 · 황소 선택 이유 분리</p>' : ''}</details></article>`).join('') || '<p>현재 공부와 바람을 남겨 두었습니다. 원하는 경로부터 직접 살펴볼 수 있어요.</p>'}</div><div class="actions"><button class="primary" data-tab="questions">필요한 질문만 조금 더 답하기</button><button data-action="expand-routes">경로를 직접 비교·선택하기</button></div><p class="hint">여기 보이는 내용은 검토 제안입니다. 기준 계획은 가족이 선택한 뒤에 남습니다.</p></section>`;
}
function expandedRoutesPanel() {
  const selectionConflicts = choiceConflicts(state.selectedRouteIds);
  const hopeDifference = hwangsoHopeDifference();
  const routes = routeCandidates(showAllRoutes || focusedBranchIds.length ? { ...state, exploreAll: true } : state, catalog, contract);
  const viewBranches = routeView ? new Set(contract.views.find(v => v.id === routeView)?.branch_ids || []) : null;
  const filtered = routes.filter(r => (!focusedBranchIds.length || focusedBranchIds.includes(r.branchId)) && (!viewBranches || viewBranches.has(r.branchId) || arr(contract.common_branch_ids).includes(r.branchId)) && `${r.title} ${r.reason} ${r.paths.map(p => p.label).join(' ')}`.toLowerCase().includes(routeQuery.toLowerCase()));
  return `<div class="layout"><div class="stack">${planningGuideMarkup()}<section class="panel"><h2>여러 갈림길을 함께 비교합니다</h2><p class="section-intro">현재를 유지하는 경로, 보완 후 합류하는 경로, 병행하는 경로를 조합할 수 있습니다. 아래 후보는 답변과 관련 있는 비교안입니다.</p>${focusedBranchIds.length || focusedCourseId ? `<div class="notice">${focusedCourseId ? `<p><strong>검토하는 과정</strong> · ${escape(state.courses.find(c => c.id === focusedCourseId)?.course || '과정 확인 필요')}</p>` : ''}<p>선택한 확인 지점: ${escape(focusedBranchIds.map(id => catalog.branches.find(b => b.id === id)?.title || id).join(" / "))}</p><button data-action="clear-branch-focus">현재 기록의 전체 후보로 돌아가기</button></div>` : ''}<div class="toolbar">${select('살펴볼 구간', 'route-view', routeView, [['', '전체 구간'], ...contract.views.map(v => [v.id, v.label])])}${field('과정·경로 찾기', 'route-search', routeQuery, { type: 'search' })}</div><label class="choice"><input type="checkbox" id="show-all-routes" ${showAllRoutes ? 'checked' : ''}><span>현재 답변 밖의 전체 ${catalog.branches.length}개 갈림길도 탐색</span></label><p class="small muted">표시 ${filtered.length}개 갈림길 · 선택한 세부 경로 ${state.selectedRouteIds.length}개</p>${workloadBlock()}</section><div class="route-list">${filtered.map(r => `<article class="route" id="route-${escape(r.branchId)}"><div class="row"><h3>${escape(r.title)}</h3><span class="badge ${escape(r.conditionState)}">${label(r.conditionState)}</span></div><p class="reason">${escape(r.reason)}</p><div class="route-paths">${r.paths.map(p => `<label class="choice"><input type="checkbox" data-route="${escape(p.id)}" ${state.selectedRouteIds.includes(p.id) ? 'checked' : ''}><span>${escape(p.label)}</span></label>`).join('')}</div><dl><dt>진입·보완에 확인할 조건</dt><dd>${escape(words(r.conditions))}</dd><dt>병행 가능한 과정</dt><dd>${escape(words(r.parallel))}</dd></dl><details class="evidence-details"><summary>추가 질문·다음 갈림길·근거 보기</summary><p>추가 질문: ${arr(r.questionIds).map(id => `<button class="mini" data-open-question="${escape(id)}">${escape(catalog.questions.find(q => q.id === id)?.prompt || id)}</button>`).join(' ')}</p><p>다음 갈림길: ${escape(arr(r.nextBranchIds).map(id => catalog.branches.find(b => b.id === id)?.title || id).join(' / '))}</p>${sourceList(r.sourceIds)}${officialRouteSources(r.branchId)}</details></article>`).join('') || '<div class="empty">해당 구간·검색어의 후보가 없습니다. 현재 과정과 희망을 추가하거나 전체 갈림길을 탐색해 보세요.</div>'}</div></div><aside class="side-panel"><h3>우리 가족이 고른 조합</h3><p class="hint">후보 선택은 기준 계획 확정과 별도입니다.</p>${state.selectedRouteIds.length ? `<ul class="selected-list">${state.selectedRouteIds.map(id => `<li>${escape(pathLabel(id))}<button data-remove-route="${escape(id)}" aria-label="${escape(pathLabel(id))} 선택 해제">해제</button></li>`).join('')}</ul>` : '<p class="small muted">선택한 세부 경로가 없습니다.</p>'}<hr class="divider"><fieldset><legend>기준으로 유지할 현재 과정</legend><div class="stack">${state.courses.map(c => `<label class="choice"><input type="checkbox" data-plan-course="${escape(c.id)}" ${selectedCourseIds.includes(c.id) ? 'checked' : ''}><span>${escape(c.course || c.subject)}<br><small>${escape(c.plannedRange || c.range || '기준 범위 미등록')}</small></span></label>`).join('') || '<p class="hint">과정을 먼저 추가하면 현재 공부만으로도 기준 계획을 만들 수 있습니다.</p>'}</div></fieldset><div class="stack" style="margin-top:20px">${field('기준 계획 이름', 'plan-title', planTitle || `우리 아이 기준 계획 ${state.plans.length + 1}`)}${area('선택한 이유·다음 검토 시점', 'plan-reason', planReason)}</div>${reviewPointDraftMarkup()}${hopeDifference ? `<div class="notice" role="status"><strong>입력 희망과 선택 경로가 다릅니다.</strong><p>${escape(hopeDifference)}</p><p>비교한 뒤 다르게 선택할 수 있습니다. 위에 선택 이유를 기록해 주세요. 입력한 희망과 실제 학습 상태는 그대로 보존합니다.</p></div>` : ''}${selectionConflicts.length ? `<div class="notice warn" role="status"><strong>지금 기준으로 삼을 선택을 정해 주세요.</strong><p>${escape(selectionConflicts.map(item => item.message).join(" "))}</p><p>지금 기준으로 삼을 하나를 남기고, 다음 시점은 다시 볼 지점에 기록해 주세요. 다른 갈림길의 병행 선택은 유지할 수 있습니다.</p></div>` : ''}<div class="actions"><button class="primary" data-action="accept-plan" ${selectionConflicts.length || (!state.selectedRouteIds.length && !selectedCourseIds.length) ? 'disabled' : ''}>이 조합을 새 기준으로 선택</button></div><p class="hint">이전 기준과 실제 기록은 남습니다. 미확인 조건도 함께 보관합니다.</p></aside></div>`;
}

function diagnosticScopesMarkup(item) {
  const groups = new Map();
  for (const record of arr(item.diagnostics)) {
    const key = record.range || '범위 미등록';
    const previous = groups.get(key);
    if (!previous || String(record.occurredAt || '') >= String(previous.occurredAt || '')) groups.set(key, record);
  }
  if (!groups.size) return '<p>진단: 아직 개인 진단 기록이 없습니다.</p>';
  return `<div class="diagnostic-scopes"><p><strong>범위별 진단 상태</strong></p>${[...groups].map(([scope, record]) => `<p>${escape(scope)} · ${label(record.diagnosticState)}<br><span class="hint">${escape(record.occurredAt || '')} · ${label(record.attemptKind)} · ${label(record.firstResponsesState)}</span></p>`).join('')}<p class="hint">다른 단원의 진단 완료로 이 범위를 완료 처리하지 않습니다.</p></div>`;
}

function planPanel() {
  const plan = state.plans.find(p => p.id === (inspectedPlanId || state.activePlanId));
  const comparison = plan ? comparePlan(state, plan.id) : null;
  return `<div class="layout"><div class="stack"><section class="panel"><div class="row"><div><h2>기준 계획과 실제 진행</h2><p class="section-intro">선택한 기준을 남기고, 이후 학습·진단·정정을 따로 쌓습니다.</p></div><button data-action="add-record" ${!state.courses.length ? 'disabled' : ''}>학습·진단 기록 추가</button></div>${plan ? `${select('살펴볼 기준 버전', 'inspected-plan', plan.id, state.plans.map(p => [p.id, `${p.version}번째 · ${p.title}${p.id === state.activePlanId ? ' (현재 기준)' : ''}`]))}<div class="plan-header"><h3>${escape(plan.title)}</h3><p>${plan.version}번째 기준 · ${escape((plan.acceptedAt || '').slice(0, 10))} · ${label(plan.status)}</p><p class="small">${escape(plan.reason || '선택 이유 미등록')}</p></div><p>${escape(words(comparison.summary))}</p>${arr(plan.routeIds || plan.selection?.routeIds).length ? `<details class="evidence-details"><summary>선택한 세부 경로 ${arr(plan.routeIds || plan.selection?.routeIds).length}개</summary><ul class="plain">${arr(plan.routeIds || plan.selection?.routeIds).map(id => `<li>${escape(pathLabel(id))}</li>`).join('')}</ul></details>` : ''}${arr(comparison.items).map(item => `<article class="comparison"><h3>${escape(typeof item.course === 'object' ? item.course.course : item.course || state.courses.find(c => c.id === item.courseId)?.course || '과정')} <span class="badge">${label(item.axis)}</span></h3><div class="comparison-grid"><div><strong>선택 당시 기준</strong><p>${escape(item.plannedRange || '목표 범위 미등록')}</p><p>상태: ${label(item.status)}</p></div><div><strong>이후 실제 기록</strong><p>${arr(item.actualRecords).length}건 · ${escape(item.latestActual?.range || '실제 학습 범위 미등록')}</p>${diagnosticScopesMarkup(item)}${arr(item.referenceRecords).length ? `<p class="hint">기관 공지·타인 사례 등 참고 기록 ${item.referenceRecords.length}건은 개인 진도에서 제외</p>` : ''}</div></div>${arr(item.unknowns).length ? `<p class="hint">${escape(words(item.unknowns))}</p>` : ''}${plan.id === state.activePlanId ? `<div class="inline-status"><label for="status-${escape(item.courseId)}">이 과정의 계획 상태</label><select id="status-${escape(item.courseId)}" data-plan-status="${escape(item.courseId)}">${courseStatuses.map(([v, t]) => `<option value="${v}" ${item.status === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div>` : ''}</article>`).join('')}${arr(comparison.changes).length ? `<div class="notice"><strong>기준 이후의 변화</strong><ul class="plain">${comparison.changes.map(x => `<li>${escape(words(x))}</li>`).join('')}</ul></div>` : ''}${arr(comparison.unknowns).length ? `<p class="hint">확인할 내용: ${escape(words(comparison.unknowns))}</p>` : ''}${reviewPointsMarkup(plan)}<div class="actions"><button class="primary" data-tab="routes">변경안을 비교하고 새 기준 선택</button></div>` : '<div class="empty">아직 선택한 기준 계획이 없습니다. 경로 비교에서 세부 경로와 유지할 과정을 골라 주세요. 실제 학습 기록은 먼저 남겨도 됩니다.</div><div class="actions"><button class="primary" data-tab="routes">기준 계획 선택하러 가기</button></div>'}</section><section class="panel"><h2>누적 학습·진단 기록</h2><p class="hint">학습 완료와 진단 완료는 서로 다른 상태입니다. 진단 원응답·채점이 없는 기록을 점수나 합격 판단으로 바꾸지 않습니다.</p>${recordsMarkup()}</section></div>${sidebar()}</div>`;
}
function recordsMarkup() {
  if (!state.records.length) return '<div class="empty">아직 학습·진단 기록이 없습니다.</div>';
  return `<ul class="record-list">${[...state.records].reverse().map(r => `<li><strong>${escape(state.courses.find(c => c.id === r.courseId)?.course || '과정 확인 필요')} · ${label(r.kind)}</strong><span class="muted">${escape(r.occurredAt)} · ${label(r.evidenceRole)}</span><p>${escape(r.range || '범위 미등록')} · ${label(r.completion)}</p>${r.kind === 'diagnostic' ? `<p>진단: ${label(r.diagnosticState)} · ${label(r.attemptKind)} · ${label(r.firstResponsesState)}</p>` : ''}${r.correctsRecordId ? '<p class="small">이전 기록을 보존한 정정 기록</p>' : ''}<p>${escape(r.note)}</p></li>`).join('')}</ul>`;
}

function evidenceStatus(entry) {
  const status = String(entry.status || '');
  if (/conflict/i.test(status)) return '<div class="notice warn"><strong>공식 자료 사이의 연도 표시가 다릅니다.</strong><p>적용 학년도를 확인하기 전에는 현재 지원 조건으로 확정하지 않습니다.</p></div>';
  if (/existence|only.*title|attachment/i.test(status)) return '<div class="notice"><strong>자료 게시·존재 확인</strong><p>전형 조건 본문 전체를 확인한 자료와 구분합니다. 첨부 모집요강의 조건을 추가로 확인해야 합니다.</p></div>';
  if (status === 'verified_document_scope_only') return '<p class="hint">확인 상태: 해당 공식 문서에 적힌 내용·적용 범위 확인. 아이 개인의 지원 자격은 별도 확인합니다.</p>';
  return '<p class="hint">확인 상태: 추가 검토 필요. 현재 조건으로 자동 적용하지 않습니다.</p>';
}

function evidencePanel() {
  const entries = arr(research.items || research.sources || research);
  const filtered = entries.filter(x => `${x.title} ${x.institution} ${words(x.scope)} ${words(x.questionImplications)}`.toLowerCase().includes(evidenceQuery.toLowerCase()));
  return `<section class="panel"><h2>과정과 선택을 확인하는 참고 자료</h2><p class="section-intro">유아 과정과 기존 월별 로드맵을 보존하고, 영재원부터 고등학교·진로까지 공식 자료를 연결합니다. 지원 조건은 자료의 해당 기관·지역·학년도에 한해 확인해야 합니다.</p><h3>기존 확장 로드맵 원본 보기</h3><div class="reference-links">${arr(reference.sections).map(s => `<a class="button" href="${escape(rel(s.url))}" target="_blank" rel="noopener">${escape(s.title || s.section)} ↗</a>`).join('')}</div><p class="hint">원본의 월축·기간을 그대로 보는 참고 화면입니다. 개인 진도로 계산한 결과와 구분합니다.</p><div class="toolbar">${field('기관·학교·분야 찾기', 'evidence-search', evidenceQuery, { type: 'search' })}</div><p class="small muted">확인일 ${escape(research.checkedAt || '미등록')} · ${filtered.length}개 자료${research.pending ? ' · 공식 자료 추가 확인 중' : ''}</p></section><div class="research-grid" style="margin-top:20px">${filtered.map(e => `<article class="research-card"><span class="badge">${escape(e.academicYear || e.year || '적용 연도 별도 확인')}</span><h3>${escape(e.title)}</h3>${evidenceStatus(e)}<p class="muted">${escape(e.institution || '')}${e.scope ? ` · ${escape(words(e.scope))}` : ''}</p>${arr(e.verifiedClaims).length ? `<ul class="plain">${e.verifiedClaims.map(c => `<li>${escape(words(c))}</li>`).join('')}</ul>` : ''}${arr(e.questionImplications).length ? `<h4>이 경로에서 확인할 질문</h4><ul class="plain">${e.questionImplications.map(c => `<li>${escape(words(c))}</li>`).join('')}</ul>` : ''}${e.url && /^https?:\/\//i.test(e.url) ? `<p><a href="${escape(rel(e.url))}" target="_blank" rel="noopener noreferrer">공식 원문 확인 ↗</a></p>` : ''}${arr(e.limitations).length ? `<p class="hint">적용 범위: ${escape(words(e.limitations))}</p>` : ''}<label class="field" for="research-${escape(e.id)}"><span>우리 아이에게 확인할 내용</span><textarea id="research-${escape(e.id)}" data-research-note="${escape(e.id)}">${escape(state.researchAnswers?.[e.id]?.note || '')}</textarea></label></article>`).join('') || '<div class="empty">검색에 맞는 공식 자료가 없습니다. 확인되지 않은 일정·조건을 현재 기준으로 적용하지 않습니다.</div>'}</div>`;
}

function render({ focusMain = false } = {}) {
  const focusId = document.activeElement?.id, start = document.activeElement?.selectionStart, end = document.activeElement?.selectionEnd;
  const openGroups = [...document.querySelectorAll('.question-group[open]')].map(e => e.dataset.group);
  $('#app').innerHTML = `<a class="button" href="./">독샘 설문·현재 위치로 돌아가기</a>${header()}${({ intake, questions: questionPanel, routes: routesPanel, plan: planPanel, evidence: evidencePanel })[tab]()}<footer class="footer-note">지필드 · 가족의 선택, 확인된 학습, 다음 제안을 나누어 기록합니다.</footer></main></div><dialog id="editor"></dialog>`;
  updateSaveStatus();
  if (tab === 'questions' && openGroups.length) document.querySelectorAll('.question-group').forEach(e => e.open = openGroups.includes(e.dataset.group));
  if (focusMain) $('#main').focus();
  else if (focusId) { const target = document.getElementById(focusId); if (target) { target.focus({ preventScroll: true }); if (typeof target.setSelectionRange === 'function' && start != null) try { target.setSelectionRange(start, end); } catch {} } }
}

function openEditor(title, content, formId, id = '') {
  const dialog = $('#editor');
  dialog.innerHTML = `<div class="dialog-heading"><h2>${escape(title)}</h2><button type="button" data-close-editor aria-label="편집창 닫기">닫기</button></div><form id="${formId}" data-id="${escape(id)}">${content}<p id="form-error" class="error-text" role="alert"></p><div class="actions"><button class="primary" type="submit">기록 저장</button><button type="button" data-close-editor>취소</button></div></form>`;
  dialog.showModal();
}
function courseEditor(id) {
  const c = state.courses.find(x => x.id === id) || { axis: 'curriculum', level: 'unknown', completion: 'unknown', status: 'active', coverageIntent: 'unknown', sourceRole: 'parent_report' };
  openEditor(id ? '현재 과정 수정' : '공부하는 과정 추가', `<div class="field-grid">${select('학습 축', 'axis', c.axis, axes)}${field('과목·영역', 'subject', c.subject, { hint: '예: 수학, 과학, 영어 읽기' })}${field('실제 과정·교재명', 'course', c.course, { required: true })}${field('판본·발행 연도', 'edition', c.edition)}${select('실제 학습 범위', 'level', c.level, opts(['unknown', 'elementary', 'middle', 'high', 'other']))}${field('권', 'volume', c.volume)}${field('단원', 'unit', c.unit)}${field('실제로 다룬 범위·진행량', 'range', c.range, { hint: '페이지·문항·소단원 등 확인한 범위로 입력' })}${select('학습 상태', 'completion', c.completion, completionOptions)}${select('전체·발췌 학습', 'coverageIntent', c.coverageIntent, opts(['unknown', 'whole', 'selected_ranges']))}${field('실제 경험한 깊이', 'depth', c.depth, { hint: '기본·응용·심화 중 다룬 범위와 근거' })}${field('혼자 해결하는 정도·도움', 'independence', c.independence, { hint: '혼자 / 읽기 도움 / 힌트 / 설명 / 함께 등' })}${select('현재 과정 상태', 'status', c.status, courseStatuses)}${field('기준 계획에 담을 다음 범위', 'plannedRange', c.plannedRange)}${select('기록의 근거', 'sourceRole', c.sourceRole, roles)}${field('확인한 날짜', 'evidenceDate', c.evidenceDate, { type: 'date' })}${area('빠진 범위·별도 보완·기타 설명', 'note', c.note)}</div><p class="hint">다음 권을 시작해도 앞 권의 완료·진단 상태를 자동으로 바꾸지 않습니다.</p>`, 'course-form', id);
}
function activityEditor(id) {
  const a = state.activities.find(x => x.id === id) || { day: 'mon', scope: 'current', kind: 'class', courseIds: [], known: false };
  openEditor(id ? '일정 수정' : '요일별 일정 추가', `<div class="field-grid">${field('일정 이름', 'name', a.name, { required: true })}${select('현재 / 고려 일정', 'scope', a.scope, opts(['current', 'candidate']))}${select('종류', 'kind', a.kind, opts(['class', 'homework', 'travel', 'other']))}${select('요일', 'day', a.day, opts(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']))}${field('시작 시각', 'start', a.start, { type: 'time' })}${field('종료 시각', 'end', a.end, { type: 'time' })}${field('시각을 모를 때 소요 시간 (분)', 'minutes', a.minutes, { type: 'number', min: 0, hint: '시작·종료 시각이 있으면 구간으로 계산합니다.' })}${field('보호자가 함께 쓰는 시간 (분)', 'adultMinutes', a.adultMinutes, { type: 'number', min: 0, hint: '모르면 빈칸, 필요 없음을 확인했다면 0' })}<fieldset class="field-wide"><legend>관련 과정</legend><div class="choices">${state.courses.map(c => `<label class="choice"><input type="checkbox" name="courseIds" value="${escape(c.id)}" ${arr(a.courseIds).includes(c.id) ? 'checked' : ''}><span>${escape(c.course || c.subject)}</span></label>`).join('')}</div></fieldset></div>`, 'activity-form', id);
}
function recordEditor() {
  const recordOptions = [['', '정정 대상 없음'], ...state.records.map(r => [r.id, `${r.occurredAt} · ${label(r.kind)} · ${r.range || '범위 미등록'}`])];
  openEditor('학습·진단 기록 추가', `<div class="field-grid">${select('연결할 과정', 'courseId', state.courses[0]?.id, state.courses.map(c => [c.id, c.course || c.subject]))}${select('기록 종류', 'kind', 'actual', opts(['actual', 'diagnostic', 'correction']))}${field('실제 학습·평가일', 'occurredAt', today(), { type: 'date', required: true })}${field('실제로 확인한 범위', 'range', '')}${select('이 범위의 학습 상태', 'completion', 'unknown', completionOptions)}${select('근거 종류', 'evidenceRole', 'parent_report', roles)}${field('깊이·풀이 경험', 'depth', '')}${field('도움·혼자 해결하는 정도', 'independence', '')}</div><details class="evidence-details" open><summary>진단·평가 기록의 세부 상태</summary><p class="hint">진단 기록일 때 별도로 저장합니다. 아직 진단하지 않았다면 학습 상태와 구분해 남겨 주세요.</p><div class="field-grid">${select('진단 상태', 'diagnosticState', 'not_prepared', opts(['not_prepared', 'planned', 'deferred_for_remediation', 'not_taken', 'partly_taken', 'taken_unreviewed', 'reviewed', 'correction_pending']))}${select('첫 풀이 / 재풀이', 'attemptKind', 'unknown', opts(['unknown', 'first', 'repeat']))}${select('원래 응답 기록', 'firstResponsesState', 'not_recorded', opts(['not_recorded', 'available', 'missing']))}${select('점수의 성격', 'scoreKind', '', [['', '점수 없음·채점 전'], ...opts(['observed', 'corrected', 'teacher_hypothetical_estimate'])])}${select('문항·채점 확인 상태', 'itemValidityState', 'unreviewed', opts(['unreviewed', 'reviewed', 'error_suspected', 'correction_pending', 'invalid_for_scoring']))}${select('정정할 이전 기록', 'correctsRecordId', '', recordOptions)}</div></details>${area('관찰·보완 내용·근거 위치', 'note', '', { hint: '원응답·첨부 자료는 보관 위치와 확인 내용을 적습니다. 자동 채점은 아직 연결하지 않았습니다.' })}`, 'record-form');
}
function reviewPointEditor(id) {
  const point = draftReviewPoints().find(item => item.id === id) || { trigger: 'manual', courseId: '', branchId: '' };
  openEditor(id ? '다시 볼 지점 수정' : '보완 후 다시 볼 지점 추가', `<p class="section-intro">사건과 확인 조건, 돌아갈 갈림길을 함께 정합니다. 조건의 충족이나 다음 과정 합류를 자동으로 결정하지 않습니다.</p><div class="field-grid">${field('어떤 조건을 확인할까요?', 'condition', point.condition, { required: true, wide: true, hint: '예: 지금 보완하는 단원의 독립 풀이를 확인한 뒤' })}${select('언제 다시 볼까요?', 'trigger', point.trigger, reviewTriggers)}${select('영향받는 과정', 'courseId', point.courseId, [['', '공통 · 과정 미정'], ...state.courses.map(c => [c.id, `${c.course || c.subject} · ${label(c.axis)}`])])}${select('돌아갈 갈림길', 'branchId', point.branchId, [['', '현재 기록으로 관련 경로 다시 비교'], ...catalog.branches.map(branch => [branch.id, branch.title])], { wide: true })}${field('다음에 할 행동', 'nextAction', point.nextAction, { required: true, wide: true, hint: '예: 진단 기록과 과제 시간을 놓고 병행 여부 다시 선택' })}</div>`, 'review-point-form', id);
}

document.addEventListener('click', async event => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.hasAttribute('data-onboarding-prev')) { uiFlow().onboardingStep = currentStep() - 1; rememberView(); changed(); render({ focusMain: true }); return; }
  if (button.hasAttribute('data-onboarding-next') || button.hasAttribute('data-onboarding-skip')) {
    const step = currentStep(), skip = button.hasAttribute('data-onboarding-skip');
    if (step === 2 && !skip) commitQuickCourse();
    uiFlow().skippedSteps = skip ? [...new Set([...arr(uiFlow().skippedSteps), step])] : arr(uiFlow().skippedSteps).filter(value => value !== step);
    if (step < 5) uiFlow().onboardingStep = step + 1;
    else { uiFlow().onboardingComplete = true; tab = 'routes'; }
    rememberView(); changed(); render({ focusMain: true }); window.scrollTo({ top: 0 }); return;
  }
  if (button.hasAttribute('data-followup-prev')) { uiFlow().followup.cursor = Math.max(0, (uiFlow().followup.cursor || 0) - 1); changed(); render({ focusMain: true }); return; }
  if (button.hasAttribute('data-followup-next') || button.hasAttribute('data-followup-skip')) {
    const followup = uiFlow().followup, item = followup.items[followup.cursor || 0];
    if (item && (button.hasAttribute('data-followup-skip') || !answerPresent(getAnswer(state, item.questionId || item.id, item.courseId || '')))) followup.dismissedKeys = [...new Set([...arr(followup.dismissedKeys), item.key])];
    followup.cursor = (followup.cursor || 0) + 1;
    if (followup.cursor >= followup.items.length) tab = 'routes';
    rememberView(); changed(); render({ focusMain: true }); window.scrollTo({ top: 0 }); return;
  }
  if (button.dataset.quickEdit) { const course = state.courses.find(c => c.id === button.dataset.quickEdit); if (course) { quickCourseEditId = course.id; uiFlow().quickCourseEditId = course.id; uiFlow().quickCourseDraft = structuredClone(course); uiFlow().studyStatus = 'learning'; changed(); render(); $('#f-quick-course')?.focus(); } return; }
  if (button.dataset.tab) { tab = button.dataset.tab; inspectedPlanId = ''; rememberView(); changed(); render({ focusMain: true }); window.scrollTo({ top: 0 }); return; }
  if (button.hasAttribute('data-close-editor')) { $('#editor').close(); return; }
  if (button.dataset.editCourse) { courseEditor(button.dataset.editCourse); return; }
  if (button.dataset.editActivity) { activityEditor(button.dataset.editActivity); return; }
  if (button.dataset.openBranches) { openBranches(button.dataset.openBranches.split(','), button.dataset.routeCourse || ''); return; }
  if (button.dataset.reviewEdit) { reviewPointEditor(button.dataset.reviewEdit); return; }
  if (button.dataset.reviewRemove) { state.planDraft ??= {}; state.planDraft.reviewPoints = draftReviewPoints().filter(point => point.id !== button.dataset.reviewRemove); changed({ renderPage: true }); return; }
  if (button.hasAttribute('data-review-revisit')) { openBranches(button.dataset.reviewRevisit ? [button.dataset.reviewRevisit] : [], button.dataset.reviewCourse || ''); toast(`검토할 조건: ${button.dataset.reviewCondition || '현재 기록 다시 확인'}. 기준 계획은 유지됩니다.`); return; }
  if (button.dataset.removeRoute) { state.selectedRouteIds = state.selectedRouteIds.filter(id => id !== button.dataset.removeRoute); changed({ renderPage: true }); return; }
  if (button.dataset.openQuestion) {
    const id = button.dataset.openQuestion;
    if (button.hasAttribute('data-question-course')) questionContexts[id] = button.dataset.questionCourse;
    tab = 'questions'; showAllQuestions = true; questionQuery = '';
    if (!advancedQuestionsOpen) { const q = catalog.questions.find(q => q.id === id); const courseId = questionContext(id); uiFlow().followup = { initialized: true, batchKeys: [`${id}${courseId ? `@${courseId}` : ''}`], cursor: 0, dismissedKeys: arr(uiFlow().followup?.dismissedKeys), items: [{ key: `${id}${courseId ? `@${courseId}` : ''}`, questionId: id, courseId, prompt: q?.prompt, answerOptions: q?.answer_options, reason: '직접 선택한 내용의 추가 질문입니다.' }] }; }
    rememberView(); changed(); render(); const target = document.getElementById(`question-${id}`); if (target) { const group = target.closest('details'); if (group) group.open = true; target.scrollIntoView({ behavior: 'smooth', block: 'start' }); target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); } return;
  }
  if (button.id === 'retry-save') {
    if (!saveConflict) { saveError = ''; await save(); return; }
    button.disabled = true;
    try {
      const backup = await exportState(state);
      const latest = await loadState().catch(() => { throw new Error('입력 사본은 보관했지만 최신 기록을 불러오지 못했습니다.'); });
      if (!latest.state) throw new Error('최신 기록이 없어 현재 입력을 유지합니다.');
      clearTimeout(saveTimer); state = latest.state; serverRevision = latest.revision; dirty = false; saveError = ''; saveConflict = false; lastSaved = '다른 창의 최신 기록 불러옴';
      selectedCourseIds = state.plans.find(p => p.id === state.activePlanId)?.courseIds || state.courses.filter(c => c.status !== 'ended').map(c => c.id);
      render(); toast(`이전 입력을 별도 보관하고 최신 기록을 열었습니다. ${backup.path}`);
    } catch (error) { saveError = error.message; updateSaveStatus(); button.disabled = false; }
    return;
  }
  const action = button.dataset.action;
  if (action === 'open-detailed-intake') { if ($('#quick-course-form')) commitQuickCourse(); detailedIntakeOpen = true; tab = 'intake'; rememberView(); changed(); render({ focusMain: true }); return; }
  if (action === 'return-quick-intake') { detailedIntakeOpen = false; tab = 'intake'; rememberView(); changed(); render({ focusMain: true }); return; }
  if (action === 'advanced-questions') { advancedQuestionsOpen = true; showAllQuestions = true; tab = 'questions'; rememberView(); changed(); render({ focusMain: true }); return; }
  if (action === 'return-quick-questions') { advancedQuestionsOpen = false; tab = 'questions'; rememberView(); changed(); render({ focusMain: true }); return; }
  if (action === 'expand-routes') { expandedRoutesOpen = true; tab = 'routes'; rememberView(); changed(); render({ focusMain: true }); return; }
  if (action === 'return-quick-routes') { expandedRoutesOpen = false; tab = 'routes'; rememberView(); changed(); render({ focusMain: true }); return; }
  if (action === 'more-questions') { const previous = uiFlow().followup || {}; previous.dismissedKeys = [...new Set([...arr(previous.dismissedKeys), ...arr(previous.batchKeys)])]; uiFlow().followup = previous; beginQuestionBatch('more'); tab = 'questions'; rememberView(); changed(); render({ focusMain: true }); return; }
  if (action === 'quick-add-course') { uiFlow().quickAddingCourse = true; quickCourseEditId = ''; uiFlow().quickCourseEditId = ''; uiFlow().quickCourseDraft = {}; changed(); render(); $('#f-quick-course')?.focus(); return; }
  if (action === 'add-course') courseEditor();
  if (action === 'add-activity') activityEditor();
  if (action === 'add-record') recordEditor();
  if (action === 'add-review-point') reviewPointEditor();
  if (action === 'clear-branch-focus') { focusedBranchIds = []; focusedCourseId = ''; render(); }
  if (action === 'accept-plan') {
    if (hwangsoHopeDifference() && !planReason.trim()) { toast('입력한 희망과 선택 경로가 다릅니다. 선택한 이유를 적어 두면 현재 희망을 보존한 채 새 기준으로 선택할 수 있습니다.'); $('#f-plan-reason')?.focus(); return; }
    try { state = acceptPlan(state, { routeIds: [...state.selectedRouteIds], courseIds: [...selectedCourseIds], title: planTitle || `우리 아이 기준 계획 ${state.plans.length + 1}`, reason: planReason, reviewPoints: structuredClone(draftReviewPoints()) }); changed(); tab = 'plan'; inspectedPlanId = ''; render({ focusMain: true }); toast('선택한 조합을 새 기준 버전으로 남겼습니다.'); }
    catch (error) { toast(error.message); }
  }
  if (action === 'export') {
    button.disabled = true;
    try { const result = await exportState(state); toast(`사본 보관 완료: ${result.path}`); }
    catch (error) { toast(`사본을 보관하지 못했습니다. ${error.message}`); }
    finally { button.disabled = false; }
  }
});

document.addEventListener('change', event => {
  const el = event.target;
  if (el.dataset.flowChoice) {
    uiFlow()[el.dataset.flowChoice] = el.value;
    if (el.dataset.flowChoice === 'quickGoal') state.goals.parent = [...arr(state.goals.parent).filter(value => !['adaptation', 'maintain', 'depth', 'selection', 'undecided'].includes(value)), el.value];
    changed({ renderPage: true });
  }
  else if (el.closest('#quick-course-form')) { uiFlow().quickCourseDraft = Object.fromEntries([...new FormData($('#quick-course-form'))].map(([key, value]) => [key.replace(/^quick\./, ''), value])); changed(); }
  else if (el.dataset.bind) {
    setPath(el.dataset.bind, el.type === 'number' && !['profile.birthDay', 'profile.academicYear', 'goals.admissionYear'].includes(el.dataset.bind) ? num(el.value) : el.value);
    if (el.dataset.bind === 'uiFlow.selectionFocus') {
      if (el.value === 'hwangso') state.goals.parent = [...new Set([...arr(state.goals.parent), '황소'])];
      if (el.value === 'premier') state.goals.premier = 'consider';
      if (el.value === 'gifted') state.goals.gifted = true;
      if (el.value === 'highSchool') state.goals.highSchool = true;
    }
    changed({ renderPage: el.tagName === 'SELECT' });
  }
  else if (el.dataset.array) { const set = new Set(arr(getPath(el.dataset.array))); el.checked ? set.add(el.value) : set.delete(el.value); setPath(el.dataset.array, [...set]); changed({ renderPage: true }); }
  else if (el.dataset.bool) { setPath(el.dataset.bool, el.checked); changed({ renderPage: true }); }
  else if (el.dataset.answerCourse) {
    questionContexts[el.dataset.answerCourse] = el.value;
    render(); announce('선택한 과정의 독립된 답변을 열었습니다. 이전 과정의 답변은 유지됩니다.');
  }
  else if (el.dataset.answer || el.dataset.answerNote) {
    const id = el.dataset.answer || el.dataset.answerNote;
    const answer = answerFor(id);
    if (el.dataset.answer) { const values = new Set(answer.values); el.checked ? values.add(el.value) : values.delete(el.value); writeQuestionAnswer(id, { values: [...values] }); }
    if (el.dataset.answerNote) writeQuestionAnswer(id, { note: el.value });
    changed({ renderPage: !!el.dataset.answer });
  }
  else if (el.dataset.route) { const set = new Set(state.selectedRouteIds); el.checked ? set.add(el.dataset.route) : set.delete(el.dataset.route); state.selectedRouteIds = [...set]; changed({ renderPage: true }); }
  else if (el.dataset.planCourse) { const set = new Set(selectedCourseIds); el.checked ? set.add(el.dataset.planCourse) : set.delete(el.dataset.planCourse); selectedCourseIds = [...set]; render(); }
  else if (el.dataset.planStatus) { try { state = changePlanStatus(state, state.activePlanId, el.value, el.dataset.planStatus); inspectedPlanId = ''; changed({ renderPage: true }); toast('과정 상태를 새 기준 버전으로 남겼습니다. 실제 기록은 유지됩니다.'); } catch (error) { toast(error.message); } }
  else if (el.dataset.researchNote) { state.researchAnswers ??= {}; state.researchAnswers[el.dataset.researchNote] = { note: el.value, recordedAt: new Date().toISOString() }; changed(); }
  else if (el.id === 'show-all-questions') { showAllQuestions = el.checked; render(); }
  else if (el.id === 'show-all-routes') { showAllRoutes = el.checked; focusedBranchIds = []; focusedCourseId = ''; render(); }
  else if (el.name === 'route-view') { routeView = el.value; render(); }
  else if (el.name === 'inspected-plan') { inspectedPlanId = el.value; render(); }
});

document.addEventListener('input', event => {
  const el = event.target;
  if (el.closest('#quick-course-form')) { uiFlow().quickCourseDraft = Object.fromEntries([...new FormData($('#quick-course-form'))].map(([key, value]) => [key.replace(/^quick\./, ''), value])); changed(); }
  if (el.dataset.bind && el.tagName !== 'SELECT') { setPath(el.dataset.bind, el.type === 'number' && !['profile.birthDay', 'profile.academicYear', 'goals.admissionYear'].includes(el.dataset.bind) ? num(el.value) : el.value); changed(); }
  if (el.dataset.answerNote) { writeQuestionAnswer(el.dataset.answerNote, { note: el.value }); changed(); }
  if (el.dataset.researchNote) { state.researchAnswers ??= {}; state.researchAnswers[el.dataset.researchNote] = { note: el.value, recordedAt: new Date().toISOString() }; changed(); }
  if (el.name === 'question-search') { questionQuery = el.value; render(); }
  if (el.name === 'route-search') { routeQuery = el.value; render(); }
  if (el.name === 'evidence-search') { evidenceQuery = el.value; render(); }
  if (el.name === 'plan-title') planTitle = el.value;
  if (el.name === 'plan-reason') planReason = el.value;
});

document.addEventListener('submit', event => {
  const form = event.target;
  if (form.id === 'quick-course-form') { event.preventDefault(); if (commitQuickCourse()) { changed({ renderPage: true }); toast('과정을 기록했습니다. 아는 내용만으로 다음 단계로 갈 수 있어요.'); } else toast('과정 이름을 알고 있다면 적어 주세요. 모르면 추가하지 않고 넘어가도 됩니다.'); return; }
  if (!['course-form', 'activity-form', 'record-form', 'review-point-form'].includes(form.id)) return;
  event.preventDefault();
  const fd = new FormData(form), values = Object.fromEntries(fd.entries());
  try {
    if (form.id === 'course-form') {
      const course = { ...values, id: form.dataset.id || uid('course') };
      const index = state.courses.findIndex(c => c.id === course.id);
      if (index < 0) state.courses.push(course); else state.courses[index] = { ...state.courses[index], ...course };
      if (!selectedCourseIds.includes(course.id)) selectedCourseIds.push(course.id);
    }
    if (form.id === 'activity-form') {
      if (values.start && values.end && values.start >= values.end) throw new Error('종료 시각은 시작 시각보다 늦게 입력해 주세요. 날짜가 바뀌는 일정은 나누어 기록합니다.');
      const activity = { ...values, id: form.dataset.id || uid('activity'), minutes: num(values.minutes), adultMinutes: num(values.adultMinutes), known: !!(values.start && values.end) || values.minutes !== '', courseIds: fd.getAll('courseIds') };
      const index = state.activities.findIndex(a => a.id === activity.id);
      if (index < 0) state.activities.push(activity); else state.activities[index] = activity;
    }
    if (form.id === 'review-point-form') {
      const point = { id: form.dataset.id || uid('review'), courseId: values.courseId, branchId: values.branchId, trigger: values.trigger, condition: values.condition.trim(), nextAction: values.nextAction.trim() };
      if (!point.condition || !point.nextAction) throw new Error('확인할 조건과 다음 행동을 적어 주세요. 아직 미정이라면 미정이라고 남길 수 있습니다.');
      const points = structuredClone(draftReviewPoints());
      const index = points.findIndex(item => item.id === point.id);
      if (index < 0) points.push(point); else points[index] = point;
      state.planDraft ??= {}; state.planDraft.reviewPoints = points;
    }
    if (form.id === 'record-form') {
      if (!values.courseId) throw new Error('기록할 과정을 먼저 추가해 주세요.');
      if (values.kind === 'correction' && !values.correctsRecordId) throw new Error('정정할 이전 기록을 선택해 주세요.');
      if (values.kind === 'actual') for (const key of ['diagnosticState', 'attemptKind', 'firstResponsesState', 'scoreKind', 'itemValidityState']) delete values[key];
      if (!values.correctsRecordId) delete values.correctsRecordId;
      state = appendRecord(state, { ...values, id: uid('record') });
    }
    $('#editor').close(); changed({ renderPage: true }); toast('기록을 추가했습니다.');
  } catch (error) { $('#form-error').textContent = error.message; }
});

window.addEventListener('beforeunload', event => { if (dirty || saving) { event.preventDefault(); event.returnValue = ''; } });

async function init() {
  try {
    await openStore();
    const urls = ['data/catalog.json', 'data/contract.json', 'data/research.json', 'data/reference-index.json'];
    const results = await Promise.all(urls.map(async url => { const response = await fetch(url, { cache: 'no-store' }); if (!response.ok) throw new Error(`${url} 자료를 불러오지 못했습니다 (${response.status}).`); return response.json(); }));
    [catalog, contract, research, reference] = results;
    const saved = await loadState(); state = saved.state || createState(); serverRevision = saved.revision || 0;
    state.selectedRouteIds ??= []; state.researchAnswers ??= {};
    selectedCourseIds = state.plans.find(p => p.id === state.activePlanId)?.courseIds || state.courses.filter(c => c.status !== 'ended').map(c => c.id);
    if (saved.state) lastSaved = '기존 기록 불러옴';
    detailedIntakeOpen = true; expandedRoutesOpen = true; advancedQuestionsOpen = true;
    tab = new URLSearchParams(location.search).get('tab') || 'plan';
    if (!['intake','questions','routes','plan','evidence'].includes(tab)) tab='plan';
    render();
  } catch (error) {
    $('#app').innerHTML = `<main class="loading"><h1>로드맵을 불러오지 못했습니다</h1><p class="error-text" role="alert">${escape(error.message)}</p><p>입력 자료를 불러온 뒤 다시 시작합니다.</p><button id="retry-init">다시 불러오기</button></main>`;
    $('#retry-init').addEventListener('click', init);
  }
}
await init();
