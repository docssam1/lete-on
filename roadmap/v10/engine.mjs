// GFIELD v4: source-preserving questionnaire and personal-plan engine.
// This module proposes questions and stores evidence; it does not score ability or eligibility.
export const PRESERVED_MODELS = Object.freeze({
  section_month_columns: Object.freeze({ S1: 27, S2: 34, S3: 48, S4: 36 }),
  L0_to_L4_shifts: Object.freeze([0, 3, 7, 10, 12]),
  acceleration: Object.freeze({ first_actual_months: 2, first_factor: 1.1, later_factor: 1.2 }),
});
const clone = value => structuredClone(value);
const unique = values => [...new Set(values)];
const validNumber = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const present = value => value !== undefined && value !== null && value !== '';
const id = prefix => `${prefix}_${globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
const now = value => value || new Date().toISOString();
const list = value => Array.isArray(value) ? value : present(value) ? [value] : [];
const values = (state, questionId, courseId = '') => list(getAnswer(state, questionId, courseId)?.values);
const rangeIds = (prefix, start, end) => Array.from({ length: end - start + 1 }, (_, i) => `${prefix}${String(start + i).padStart(2, '0')}`);
const PLAN_STATUSES = ['draft', 'active', 'reduced', 'paused', 'ended'];
const COURSE_STATUSES = ['active', 'reduced', 'paused', 'ended'];
const COMPLETIONS = ['in_progress', 'reported_done', 'reviewed_done', 'not_started', 'unknown'];
const DIAGNOSTIC_STATES = ['not_prepared', 'planned', 'deferred_for_remediation', 'not_taken', 'partly_taken', 'taken_unreviewed', 'reviewed', 'correction_pending'];
const DAY_NAMES = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const REVIEW_TRIGGERS = ['scope_completed', 'diagnostic_reviewed', 'time_changed', 'new_notice', 'goal_changed', 'manual'];
const HWANGSO_REASONS = ['progress_pending', 'young_depth', 'thorough_alternative', 'time_fit', 'child_preference', 'other', 'unsure'];
const LATEST_HWANGSO_DECISION = 'U20261003-H01';
const validRouteId = value => typeof value === 'string' && /^B(?:0[1-9]|[1-9]\d|10[01])(?::P[1-9]\d*)?$/.test(value) && (!value.startsWith('B28:P') || /^B28:P[1-7]$/.test(value));
const validQuestionId = value => typeof value === 'string' && /^Q\d{2,3}$/.test(value) && Number(value.slice(1)) >= 1 && Number(value.slice(1)) <= 105 && value === `Q${String(Number(value.slice(1))).padStart(2, '0')}`;
const plainObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
const safeKey = value => !['__proto__', 'prototype', 'constructor'].includes(value);

export function createState(nowISO) {
  const at = now(nowISO);
  return {
    schemaVersion: 1, id: id('roadmap'), revision: 0,
    profile: { birthMonth: '', birthDay: '', asOf: at.slice(0, 10), grade: '', academicYear: '', region: '' },
    support: { weekdayMinutes: null, weekendMinutes: null, helpTypes: [], homeworkKnown: 'unknown' },
    academy: { currentFrequency: null, currentSessionMinutes: null, desiredFrequency: null, desiredSessionMinutes: null },
    courses: [], activities: [],
    goals: { parent: [], child: '', priority: '', premier: 'undecided', hwangso: 'undecided', hwangsoReasons: [], hwangsoTimingNote: '', hwangsoReasonNote: '', science: false, gifted: false, competition: false, highSchool: false, medical: false, competitionIntent: 'undecided', schoolTypes: [], admissionYear: '', institution: '' },
    answers: {}, courseAnswers: {}, researchAnswers: {}, selectedRouteIds: [], plans: [], activePlanId: null, records: [], events: [],
  };
}

// Looking at another course never copies the currently visible response into it.
// Legacy answers[QID].courseId stays in place; new per-course edits take precedence.
export function getAnswer(state, questionId, courseId = '') {
  if (!validQuestionId(questionId) || typeof courseId !== 'string' || !safeKey(courseId)) return null;
  const legacy = state.answers?.[questionId];
  let answer;
  if (courseId) answer = state.courseAnswers?.[courseId]?.[questionId] ?? (legacy?.courseId === courseId ? legacy : null);
  else answer = legacy?.courseId ? legacy.unscopedAnswer : legacy;
  if (!plainObject(answer)) return null;
  if (courseId && answer.scopeSnapshot) {
    const actual = state.courses?.find(course => course.id === courseId);
    if (!actual || ['volume','unit','range','course','edition','sourceCurriculum','isbn'].some(key => answer.scopeSnapshot[key] !== undefined && answer.scopeSnapshot[key] !== (actual[key] || ''))) return null;
  }
  const result = clone(answer);
  delete result.courseId;
  delete result.unscopedAnswer;
  return result;
}

export function setAnswer(state, questionId, answer, courseId = '') {
  checkedState(state);
  if (!validQuestionId(questionId)) throw new TypeError('지원하지 않는 질문 ID입니다.');
  if (typeof courseId !== 'string' || !safeKey(courseId) || courseId && !state.courses.some(course => course.id === courseId)) throw new TypeError('응답을 연결할 실제 과정을 확인해 주세요.');
  if (!plainObject(answer) || !Array.isArray(answer.values) || answer.values.some(value => typeof value !== 'string')) throw new TypeError('응답은 선택값 배열을 포함해야 합니다.');
  if (answer.courseId && answer.courseId !== courseId) throw new TypeError('다른 과정의 응답을 현재 과정으로 자동 변경할 수 없습니다.');
  if (answer.note !== undefined && typeof answer.note !== 'string') throw new TypeError('응답 메모는 문자열이어야 합니다.');
  if (answer.recordedAt !== undefined && typeof answer.recordedAt !== 'string') throw new TypeError('응답 기록일은 문자열이어야 합니다.');
  const stored = { values: unique(clone(answer.values)), note: answer.note || '', recordedAt: answer.recordedAt || now() };
  const next = clone(state);
  if (courseId) {
    next.courseAnswers ||= {};
    next.courseAnswers[courseId] ||= {};
    next.courseAnswers[courseId][questionId] = stored;
  } else if (next.answers[questionId]?.courseId) {
    // A legacy course response and a new general response share a question ID.
    // Keep the legacy fields untouched instead of silently moving or erasing them.
    next.answers[questionId].unscopedAnswer = stored;
  } else next.answers[questionId] = stored;
  next.revision += 1;
  checkedState(next);
  return next;
}

function calendarDate(text) {
  if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const [year, month, day] = text.split('-').map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? { year, month, day, stamp: date.getTime() } : null;
}
function daysInMonth(year, month) {
  const date = new Date(0);
  date.setUTCFullYear(year, month, 0);
  return date.getUTCDate();
}
function completedMonths(birth, asOf) {
  return (asOf.year - birth.year) * 12 + asOf.month - birth.month - (asOf.day < birth.day ? 1 : 0);
}
export function ageMonths(profile = {}) {
  const unknown = { min: null, max: null, precision: 'unknown', label: '개월수 미확인' };
  if (!profile.birthMonth) return unknown;
  if (!/^\d{4}-\d{2}$/.test(profile.birthMonth)) return { ...unknown, error: '출생 연월 형식을 확인해 주세요.' };
  const first = calendarDate(`${profile.birthMonth}-01`);
  const asOf = calendarDate(profile.asOf);
  if (!first || !asOf) return { ...unknown, error: '출생 연월 또는 기준일을 확인해 주세요.' };
  if (first.stamp > asOf.stamp) return { ...unknown, error: '출생일이 기준일보다 뒤에 있습니다.' };
  if (present(profile.birthDay)) {
    const dayText = String(profile.birthDay);
    const birth = calendarDate(dayText.includes('-') ? dayText : `${profile.birthMonth}-${dayText.padStart(2, '0')}`);
    if (!birth || `${birth.year}-${String(birth.month).padStart(2, '0')}` !== profile.birthMonth) return { ...unknown, error: '출생일과 출생 연월이 일치하는지 확인해 주세요.' };
    if (birth.stamp > asOf.stamp) return { ...unknown, error: '출생일이 기준일보다 뒤에 있습니다.' };
    const months = completedMonths(birth, asOf);
    return { min: months, max: months, precision: 'day', label: `만 ${months}개월` };
  }
  const lastDay = first.year === asOf.year && first.month === asOf.month ? asOf.day : daysInMonth(first.year, first.month);
  const min = Math.max(0, completedMonths({ ...first, day: lastDay }, asOf));
  const max = completedMonths(first, asOf);
  return { min, max, precision: 'month', label: min === max ? `만 ${min}개월 (출생월 기준)` : `만 ${min}–${max}개월 (출생일 미입력)` };
}

export function rampT(workMonths) {
  if (!validNumber(workMonths)) throw new RangeError('원자료 작업 개월수는 0 이상의 유한한 수여야 합니다.');
  return workMonths <= 2.2 ? workMonths / 1.1 : 2 + (workMonths - 2.2) / 1.2;
}

function and(states) {
  if (states.includes('not_met')) return 'not_met';
  if (states.includes('conflicting')) return 'conflicting';
  if (states.includes('unknown')) return 'unknown';
  return states.length ? 'met' : 'unknown';
}
function or(states) {
  if (states.includes('met')) return 'met';
  if (states.includes('conflicting')) return 'conflicting';
  if (states.includes('unknown')) return 'unknown';
  return states.length ? 'not_met' : 'unknown';
}
function compareValue(raw, comparator) {
  if (raw && !Array.isArray(raw) && typeof raw === 'object') {
    if (raw.state === 'conflicting' || raw.status === 'conflicting') return 'conflicting';
    if (raw.state === 'unknown' || raw.status === 'unknown') return 'unknown';
    if ('value' in raw) raw = raw.value;
    else return 'unknown';
  }
  if (!present(raw)) return 'unknown';
  if (Array.isArray(raw)) return raw.length ? or(raw.map(value => compareValue(value, comparator))) : 'unknown';
  const operators = typeof comparator === 'object' && comparator !== null ? comparator : { eq: comparator };
  const checks = Object.entries(operators).map(([operator, expected]) => {
    // An explicit unknown answer may itself be the subject of a rule (e.g. R06/R18).
    if (raw === 'unknown' && !((operator === 'eq' && expected === 'unknown') || (operator === 'in' && list(expected).includes('unknown')))) return 'unknown';
    switch (operator) {
      case 'eq': return raw === expected ? 'met' : 'not_met';
      case 'neq': return raw !== expected ? 'met' : 'not_met';
      case 'in': return list(expected).includes(raw) ? 'met' : 'not_met';
      case 'not_in': return list(expected).includes(raw) ? 'not_met' : 'met';
      case 'exists': return expected === true ? 'met' : 'not_met';
      default: return 'unknown';
    }
  });
  return and(checks);
}
export function evaluateCondition(condition, fields = {}) {
  if (!condition || typeof condition !== 'object' || Array.isArray(condition)) return 'unknown';
  if (Array.isArray(condition.all)) return and(condition.all.map(item => evaluateCondition(item, fields)));
  if (Array.isArray(condition.any)) return or(condition.any.map(item => evaluateCondition(item, fields)));
  if (condition.not) {
    const result = evaluateCondition(condition.not, fields);
    return result === 'met' ? 'not_met' : result === 'not_met' ? 'met' : result;
  }
  return and(Object.entries(condition).map(([key, comparator]) => {
    if (comparator?.exists !== undefined && !present(fields[key])) return comparator.exists ? 'not_met' : 'met';
    return compareValue(fields[key], comparator);
  }));
}

const ANSWER_MAPS = {
  Q03: { '학부모 기억': ['evidence_role', 'parent_report'], '학부모 교재 확인': ['evidence_role', 'parent_report'], '아이 설명': ['evidence_role', 'child_report'], '교사 관찰': ['evidence_role', 'teacher_observation'] },
  Q42: { '합격·등록': [['selection_state', 'selected'], ['registration_state', 'registered']], '합격·미등록': [['selection_state', 'selected'], ['registration_state', 'declined']], '미선발': ['selection_state', 'not_selected'], '선택 대기': ['registration_state', 'not_decided'] },
  Q68: { '희망 없음': ['competition_intent', 'do_not_enter'], '현재 참가': ['competition_intent', 'enter'], '경시 자료만 학습하고 대회 응시는 미정 또는 희망하지 않음': [['material_use', 'course_learning'], ['competition_intent', 'undecided']] },
  Q89: { '학습 중·진단 예정': ['assessment_state', 'planned'], '학습 완료·진단 미실시': [['scope_completion', 'reported_done'], ['assessment_state', 'not_taken']], '보완 후 진단': ['assessment_state', 'deferred_for_remediation'], '진단 일부 실시': ['assessment_state', 'partly_taken'], '아직 계획 없음': ['assessment_state', 'not_prepared'] },
  Q90: { '처음 보는 평가': ['attempt_kind', 'first'], '같은 문항 재풀이': ['attempt_kind', 'repeat'], '최초 풀이 기록 없음·소실': ['first_responses_state', 'missing'], '문항 자체 오류 의심': ['item_error_suspected', 'yes'], '채점 수정': ['diagnostic_correction', 'yes'] },
  Q91: { '개인 결과 통지': ['evidence_role', 'individual_result_notice'], '학원 전체 안내': [['evidence_role', 'institution_notice'], ['source_audience', 'group']], '예시·문자 템플릿': ['evidence_role', 'forwarded_template'], '다른 학생 사례': ['evidence_role', 'third_party_case'] },
  Q93: { '결과 대기': ['selection_state', 'pending'], '선발·반 배정 대기': [['selection_state', 'selected'], ['registration_state', 'not_decided']], '반 배정·시간 신청': ['registration_state', 'not_decided'], '등록 완료·시작 전': ['registration_state', 'registered'], '실제 수강 중': ['registration_state', 'registered'], '미등록 선택': ['registration_state', 'declined'] },
  Q96: { '그대로 진행': ['plan_intent', 'continue'], '부담을 줄여 진행': ['plan_intent', 'reduce'], '잠시 쉬기': ['plan_intent', 'pause'], '이 계획 종료': ['plan_intent', 'end'], '아직 결정하지 못함': ['plan_intent', 'undecided'] },
  Q97: { '지금 확인하고 재개 비교': ['plan_intent', 'resume'] },
  Q102: { '이 조합을 기준 계획으로 저장': ['plan_acceptance', 'accept'], '일부 조건 수정·다시 비교': ['plan_acceptance', 'revise'], '후보만 보관·미정': ['plan_acceptance', 'keep_candidate'] },
  Q103: { '실제 공부 기록': ['record_kind', 'actual'], '진단·관찰 결과': ['record_kind', 'diagnostic'], '목표·시간 변경 희망': ['record_kind', 'change_request'], '잘못된 기록 수정': ['record_kind', 'correction'] },
  Q104: { '새 버전을 기준으로 선택': ['plan_acceptance', 'accept'], '기존 계획 유지': ['plan_acceptance', 'keep_current'], '판단 보류': ['plan_acceptance', 'undecided'] },
};
function mappedAnswers(state, courseId, includeUnscoped = true) {
  const result = {};
  for (const [questionId, map] of Object.entries(ANSWER_MAPS)) {
    const answer = courseId ? getAnswer(state, questionId, courseId) : includeUnscoped ? getAnswer(state, questionId) : null;
    if (!answer) continue;
    for (const value of list(answer.values)) {
      const mapping = map[value];
      if (!mapping) continue;
      for (const [field, val] of Array.isArray(mapping[0]) ? mapping : [mapping]) (result[field] ||= []).push(val);
    }
  }
  for (const [key, val] of Object.entries(result)) {
    const distinct = unique(val);
    result[key] = distinct.length === 1 ? distinct[0] : ['evidence_role', 'record_kind'].includes(key) ? distinct : { state: 'conflicting', values: distinct };
  }
  return result;
}
function latest(records) {
  return [...records].sort((a, b) => String(b.occurredAt || b.recordedAt || '').localeCompare(String(a.occurredAt || a.recordedAt || '')) || String(b.recordedAt || '').localeCompare(String(a.recordedAt || '')))[0] || null;
}
const NONPERSONAL_ROLES = ['forwarded_template', 'third_party_case', 'ai_summary', 'institution_notice'];
function personalEvidence(record) {
  if (NONPERSONAL_ROLES.includes(record.evidenceRole || record.sourceRole)) return false;
  if (['group', 'general'].includes(record.sourceAudience) && !['confirmed', 'reported'].includes(record.individualParticipation)) return false;
  return true;
}
function diagnosticFields(record = {}) {
  return {
    assessment_state: record.diagnosticState || 'unknown', evidence_role: record.evidenceRole || 'unknown',
    first_responses_state: record.firstResponsesState || 'unknown', attempt_kind: record.attemptKind || 'unknown',
    item_error_suspected: ['error_suspected', 'correction_pending', 'invalid_for_scoring'].includes(record.itemValidityState) ? 'yes' : record.itemValidityState === 'reviewed' ? 'no' : 'unknown',
    diagnostic_correction: record.kind === 'correction' || record.diagnosticState === 'correction_pending' ? 'yes' : 'unknown',
  };
}
function normalizeChoice(value) { return ({ H_G2: 'grade2', H_G3: 'grade3', H_NONE: 'none', H_UNDECIDED: 'undecided' })[value] || value || 'unknown'; }
export function deriveFields(state) {
  const courses = state.courses || [];
  const records = state.records || [];
  const load = workload(state);
  const fields = {
    birth_precision: ageMonths(state.profile).precision, school_grade: state.profile?.grade || 'unknown',
    course_level: unique(courses.map(course => course.level || 'unknown')),
    hwangso_choice: normalizeChoice(state.goals?.hwangso), premier_interest: state.goals?.premier || 'unknown',
    science_interest: state.goals?.science || courses.some(course => course.axis === 'science') ? 'yes' : 'no',
    other_subject_interest: courses.some(course => course.axis === 'other') || values(state, 'Q100').some(value => ['영어', '국어·독서', '가족이 직접 입력'].includes(value)) ? 'yes' : 'no',
    competition_intent: state.goals?.competitionIntent || 'unknown',
    homework_duration_known: state.support?.homeworkKnown === 'yes' ? 'yes' : state.support?.homeworkKnown === 'no' ? 'no' : 'unknown',
    has_time_overlap: load.conflicts.some(value => value.includes('시간 겹침')) ? 'yes' : (state.activities || []).length && !load.unknown.some(value => value.includes('시간대')) ? 'no' : 'unknown',
    scope_completion: unique(courses.map(course => course.completion || 'unknown')),
    assessment_state: unique(records.filter(record => record.kind === 'diagnostic' || record.kind === 'correction').map(record => record.diagnosticState || 'unknown')),
    record_kind: unique(records.map(record => record.kind)),
    evidence_role: unique([...courses.map(course => course.sourceRole), ...records.map(record => record.evidenceRole)].filter(Boolean)),
    first_responses_state: unique(records.map(record => record.firstResponsesState).filter(Boolean)),
    attempt_kind: unique(records.map(record => record.attemptKind).filter(Boolean)),
    item_error_suspected: records.some(record => ['error_suspected', 'correction_pending', 'invalid_for_scoring'].includes(record.itemValidityState)) ? 'yes' : 'unknown',
    diagnostic_correction: records.some(record => record.kind === 'correction' || record.diagnosticState === 'correction_pending') ? 'yes' : 'unknown',
    source_audience: unique(courses.map(course => course.sourceAudience).filter(Boolean)),
    individual_participation: unique(courses.map(course => course.individualParticipation || 'unknown')),
    ...mappedAnswers(state),
  };
  fields._courseContexts = courses.flatMap(course => {
    const diagnostics = records.filter(record => record.courseId === course.id && personalEvidence(record) && (record.kind === 'diagnostic' || record.kind === 'correction'));
    const scopes = unique(diagnostics.map(record => record.range || '__course__'));
    if (!scopes.length) scopes.push('__course__');
    return scopes.map(scope => {
      const diagnostic = latest(diagnostics.filter(record => (record.range || '__course__') === scope));
      // A later test on a different unit cannot hide an unresolved test on this unit.
      const scopeApplies = scope === '__course__' || course.coverageIntent === 'whole' || scope === course.range;
      return {
        ...fields, _courseContexts: undefined, course_id: course.id, scope, course_level: course.level || 'unknown',
        scope_completion: scopeApplies && personalEvidence(course) ? course.completion || 'unknown' : 'unknown', ...diagnosticFields(diagnostic || {}),
        evidence_role: diagnostic?.evidenceRole || course.sourceRole || 'unknown',
        source_audience: course.sourceAudience || 'unknown', individual_participation: course.individualParticipation || 'unknown',
        ...mappedAnswers(state, course.id, false),
      };
    });
  });
  // A completion statement in one course must never combine with another course's diagnostic.
  const unscoped = mappedAnswers(state);
  if ('scope_completion' in unscoped || 'assessment_state' in unscoped) fields._courseContexts.push({ ...unscoped, course_id: null });
  return fields;
}

function interests(state) {
  const goals = state.goals || {};
  const courses = state.courses || [];
  const selected = unique([...list(goals.parent), ...values(state, 'Q04')]);
  const has = words => selected.some(value => words.some(word => value === word));
  const named = expression => courses.some(course => expression.test(course.course || ''));
  const hwangso = normalizeChoice(goals.hwangso);
  return {
    curriculum: courses.some(course => course.axis === 'curriculum'), thinking: courses.some(course => course.axis === 'thinking'), arithmetic: courses.some(course => course.axis === 'arithmetic'),
    middle: courses.some(course => ['middle', 'high'].includes(course.level)) || has(['누테/중등·고등']),
    high: courses.some(course => course.level === 'high'),
    premier: ['consider', 'current', 'later'].includes(goals.premier) || has(['프리미어/챌린지', '필즈']) || named(/소마|프리미어|챌린지|필즈/),
    hwangso: ['grade2', 'grade3', 'later'].includes(hwangso) || has(['황소']) || named(/황소/) || values(state, 'Q43').some(value => !['희망 없음', '미정'].includes(value)),
    hwangsoNone: hwangso === 'none',
    hwangsoContext: !!state.profile?.grade && state.profile.grade !== 'preschool' && state.profile.grade !== '미취학' || hwangso !== 'none' && list(goals.hwangsoReasons).some(reason => HWANGSO_REASONS.includes(reason)),
    science: goals.science === true || courses.some(course => course.axis === 'science') || has(['실험·탐구', '과학']),
    gifted: goals.gifted === true || has(['영재원 경험']) || named(/영재원|영재학급|브릿지/),
    competition: goals.competition === true || has(['경시/KMO']) || named(/KMO|경시/i) || values(state, 'Q68').some(value => !['희망 없음', '미정'].includes(value)),
    highSchool: goals.highSchool === true || goals.medical === true || (goals.schoolTypes || []).some(value => value !== 'undecided') || has(['영재고', '과학고', '자사고', '외고/국제고', '일반고', '의대']),
    other: courses.some(course => course.axis === 'other') || values(state, 'Q100').some(value => ['영어', '국어·독서', '가족이 직접 입력'].includes(value)),
  };
}
function relevantQuestion(questionId, flags) {
  const n = Number(questionId.slice(1));
  if (n >= 38 && n <= 42) return flags.premier;
  if (n >= 43 && n <= 48) return flags.hwangso || flags.hwangsoNone || flags.hwangsoContext;
  if (n >= 49 && n <= 54) return flags.gifted;
  if (n >= 55 && n <= 58) return flags.middle;
  if (n === 59 || n === 24) return flags.high;
  if (n >= 60 && n <= 67) return flags.science;
  if (n >= 68 && n <= 74) return flags.competition;
  if (n >= 75 && n <= 80) return flags.highSchool;
  return true;
}
function relevantBranch(branchId, flags) {
  const n = Number(branchId.slice(1));
  if (n >= 23 && n <= 27) return flags.premier;
  if (n >= 29 && n <= 35) return flags.hwangso;
  if (n >= 36 && n <= 43) return flags.gifted;
  if (n >= 44 && n <= 48) return flags.middle;
  if (n >= 51 && n <= 55) return flags.middle;
  if (n >= 57 && n <= 64) return flags.science;
  if (n >= 65 && n <= 71) return flags.competition;
  if (n >= 72 && n <= 77 || n === 80) return flags.highSchool;
  if (n === 11) return flags.middle;
  if (n === 12 || n === 13) return flags.high;
  return true;
}
function evaluateRule(rule, fields) {
  if (rule.id === 'R07' || rule.id === 'R09') {
    return or((fields._courseContexts || []).map(context => evaluateCondition(rule.when, context)));
  }
  return or([evaluateCondition(rule.when, fields), ...(fields._courseContexts || []).map(context => evaluateCondition(rule.when, context))]);
}
export function activeModules(state, contract = {}) {
  const flags = interests(state);
  const fields = deriveFields(state);
  const screens = new Set(['S01', 'S02', 'S03', 'S04', 'S06', 'S12', 'S13']);
  const questions = new Set([...rangeIds('Q', 1, 10), 'Q81', 'Q82', 'Q83', 'Q101', 'Q102']);
  const branches = new Set(['B01', 'B02', 'B03', 'B07', 'B08', 'B78', 'B81', 'B82', 'B83', 'B100']);
  const add = (screenId, qs, bs) => { if (screenId) screens.add(screenId); qs.forEach(q => questions.add(q)); bs.forEach(b => branches.add(b)); };
  const courses = state.courses || [];
  if (courses.length) {
    add('S05', [...rangeIds('Q', 11, 20), 'Q32', 'Q33', 'Q34', 'Q35', 'Q36', 'Q37', 'Q84', 'Q86', 'Q89', 'Q94', 'Q95', 'Q99'], ['B04', 'B05', 'B06', 'B84', 'B86', 'B89', 'B94', 'B98']);
    screens.add('S08');
  }
  if (flags.curriculum) add('S08', ['Q21', 'Q22'], ['B09', 'B10', 'B49', 'B50']);
  if (flags.thinking) add('S08', ['Q25', 'Q26', 'Q27', 'Q28'], rangeIds('B', 14, 18));
  if (flags.arithmetic) add('S08', ['Q29', 'Q30', 'Q31'], rangeIds('B', 19, 22));
  if (flags.middle) add('S08', ['Q21', 'Q22', 'Q55', 'Q56', 'Q57', 'Q58'], ['B11', ...rangeIds('B', 44, 48), ...rangeIds('B', 51, 56)]);
  if (flags.high) add('S08', ['Q24', 'Q59'], ['B12', 'B13']);
  if (flags.premier) add('S07', [...rangeIds('Q', 38, 42), 'Q91', 'Q92', 'Q93'], [...rangeIds('B', 23, 27), 'B91', 'B92', 'B93']);
  if (flags.hwangso) add('S07', [...rangeIds('Q', 43, 48), 'Q91', 'Q92', 'Q93'], ['B28', 'B32', 'B33', 'B34', 'B35', 'B91', 'B92', 'B93']);
  if (flags.hwangsoNone || flags.hwangsoContext) add(null, ['Q43'], ['B28']);
  if (flags.hwangsoNone) add('S08', ['Q21', 'Q22', 'Q25', 'Q29'], ['B09', 'B10', 'B14', 'B19']);
  if (flags.gifted) add('S09', rangeIds('Q', 49, 54), rangeIds('B', 36, 43));
  if (flags.science) add('S09', rangeIds('Q', 60, 67), rangeIds('B', 57, 64));
  if (flags.competition) add('S09', rangeIds('Q', 68, 74), rangeIds('B', 65, 71));
  if (flags.highSchool) add('S09', rangeIds('Q', 75, 80), [...rangeIds('B', 72, 77), 'B80']);
  if (flags.other) add('S10', ['Q100', 'Q98', 'Q94'], ['B97', 'B99']);
  if ((state.records || []).length) add('S11', ['Q03', 'Q18', 'Q85', 'Q87', 'Q90', 'Q91', 'Q103'], ['B85', 'B87', 'B90', 'B91']);
  if ((state.plans || []).length || (state.selectedRouteIds || []).length) add('S14', ['Q96', 'Q97', 'Q102', 'Q103', 'Q104'], ['B79', 'B95', 'B96', 'B100']);
  if (state.personality?.status === 'completed') add(null, ['Q105'], ['B101']);
  const matchedRules = [], unknownRules = [];
  for (const rule of contract.routing_rules || []) {
    if (['R03', 'R04', 'R06'].includes(rule.id) && !flags.hwangso && !flags.hwangsoContext) continue;
    if (rule.id === 'R17' && !flags.competition) continue;
    if (rule.id === 'R18' && !flags.premier && !flags.hwangso && !flags.gifted && !flags.competition && !flags.highSchool) continue;
    const result = evaluateRule(rule, fields);
    if (result === 'met') {
      matchedRules.push(rule.id);
      for (const q of rule.question_ids || []) if (relevantQuestion(q, flags)) questions.add(q);
      for (const b of rule.branch_ids || []) if (relevantBranch(b, flags)) branches.add(b);
    } else if (result === 'unknown' || result === 'conflicting') unknownRules.push(rule.id);
  }
  if (state.exploreAll === true) {
    for (const screen of contract.screens || []) add(screen.id, screen.question_ids || [], screen.branch_ids || []);
    rangeIds('Q', 1, 105).forEach(q => questions.add(q));
    rangeIds('B', 1, 101).forEach(b => branches.add(b));
  }
  return { screenIds: [...screens].sort(), questionIds: [...questions].sort(), branchIds: [...branches].sort(), matchedRules, unknownRules };
}

export function routeCandidates(state, catalog = {}, contract = {}) {
  const active = activeModules(state, contract);
  const fields = deriveFields(state);
  return (catalog.branches || []).filter(branch => active.branchIds.includes(branch.id)).map(branch => {
    const relevantRules = (contract.routing_rules || []).filter(rule => (rule.branch_ids || []).includes(branch.id) && active.matchedRules.includes(rule.id));
    const conditionState = fields.condition_state === 'conflicting' ? 'conflicting' : 'unknown';
    const reasons = relevantRules.map(rule => rule.result);
    const medicalSchoolReview = state.goals?.medical === true && (state.goals?.schoolTypes || []).some(type => ['gifted_school', 'science_school'].includes(type)) && ['B72', 'B73', 'B75', 'B76', 'B78', 'B80'].includes(branch.id);
    if (medicalSchoolReview) reasons.push('의학계열 희망과 영재학교·과학고 관심을 함께 기록했습니다. 해당 학교·지원 학년도의 의약학 진학 관련 공식 방침과 목표를 별도로 검토해야 합니다.');
    return {
      id: branch.id, branchId: branch.id, title: branch.title,
      reason: reasons.length ? reasons.join(' ') : '입력한 현재 과정·희망과 함께 검토할 수 있는 선택입니다. 진입 조건은 별도로 확인합니다.',
      paths: branch.id === 'B28' ? [
        {id:'B28:P1',label:' 초2 고려'.trim()}, {id:'B28:P2',label:'초3 고려'},
        {id:'B28:P3',label:'황소를 선택하지 않고 현재 학습 유지'},
        {id:'B28:P4',label:'실제 진도에 맞는 이후 경로 검토'},
        {id:'B28:P5',label:'아직 미정'}, {id:'B28:P6',label:'나중에 고려',decisionIds:[LATEST_HWANGSO_DECISION]},
        {id:'B28:P7',label:'학원 목표 없이 응용·심화 진행'}
      ] : [
        ...String(branch.available_paths || '현재 상태 확인').split(/\s+\/\s+/).map((label, index) => ({ id: `${branch.id}:P${index + 1}`, label: label.trim() })),
        ...(branch.id === 'B28' ? [{ id: 'B28:P6', label: '다른 시점·시점을 정하지 않고 나중에 검토', decisionIds: [LATEST_HWANGSO_DECISION] }] : []),
      ],
      ...(branch.id === 'B28' ? { decisionIds: [LATEST_HWANGSO_DECISION] } : {}),
      questionIds: branch.question_ids || [], sourceIds: branch.source_ids || [], conditionState,
      conditions: branch.entry_and_remediation || '조건 확인 필요', parallel: branch.parallel_courses || '',
      nextBranchIds: branch.next_branch_ids || [],
      explanation: branch.explanation || '', matchedRuleIds: relevantRules.map(rule => rule.id),
      conditionDetails: [
        { type: 'learning_and_entry', state: conditionState, text: branch.entry_and_remediation || '확인 필요' },
        ...(medicalSchoolReview ? [{ type: 'institution_medical_policy', state: 'unknown', text: '학교·학년도별 공식 방침 확인 필요. 모든 학교나 미래 학년도에 일괄 적용하지 않습니다.' }] : []),
        ...relevantRules.map(rule => ({ type: 'question_activation', state: evaluateRule(rule, fields), text: rule.label, ruleId: rule.id })),
      ],
    };
  });
}

export function planningGuide(state, catalog = {}, contract = {}) {
  const suggestions = [], missing = [], notes = [
    '아래 제안은 입력한 기록에서 이어지는 유지·확인·비교 사항입니다. 전체 갈림길 탐색 목록과 구분합니다.',
    '가족이 기준 계획으로 선택하기 전에는 계획을 변경하지 않습니다. 진도만으로 약점·합격 가능성·기관 진입을 판단하지 않습니다.',
  ];
  const branches = new Map((catalog.branches || []).map(branch => [branch.id, branch]));
  const questionIds = new Set((catalog.questions || []).map(question => question.id));
  const sourceIds = new Set(Array.isArray(catalog.sources) ? catalog.sources.map(source => source.id) : Object.keys(catalog.sources || {}));
  const add = (suggestionId, title, reason, kind, branchIds, courseId = '', decisionIds = []) => {
    const connected = unique(branchIds).map(branchId => branches.get(branchId)).filter(Boolean);
    if (!connected.length) return;
    suggestions.push({
      id: suggestionId, title, reason, kind, branchIds: connected.map(branch => branch.id),
      questionIds: unique(connected.flatMap(branch => branch.question_ids || [])).filter(questionId => questionIds.has(questionId)),
      sourceIds: unique(connected.flatMap(branch => branch.source_ids || [])).filter(sourceId => sourceIds.has(sourceId)),
      ...(courseId ? { courseId } : {}),
      ...(decisionIds.length ? { decisionIds: unique(decisionIds) } : {}),
    });
  };
  const namedAxes = { curriculum: '교과', thinking: '사고력', arithmetic: '연산', science: '과학', other: '타 과목' };
  const courseBranches = course => {
    if (course.axis === 'curriculum') return course.level === 'high' ? ['B12', 'B53'] : course.level === 'middle' ? ['B11', 'B51'] : ['B09'];
    return ({ thinking: ['B14'], arithmetic: ['B19'], science: ['B57'], other: ['B99'] })[course.axis] || ['B03'];
  };
  const unknownText = value => !String(value || '').trim() || ['unknown', '미확인', '모름', '확인 필요', '기록 없음'].includes(String(value).trim());
  const fields = deriveFields(state);
  const flags = interests(state);
  for (const course of state.courses || []) {
    const name = course.course || `${namedAxes[course.axis] || '과정'} 기록`;
    if (!personalEvidence(course)) {
      add(`evidence:${course.id}`, `${name}의 개인 학습 여부 확인`, '참고 자료의 진행·완료 표시를 아이의 실제 학습으로 계산하지 않고 본인 범위와 근거를 확인합니다.', 'clarify', ['B03', 'B91'], course.id);
      missing.push(`${name}: 개인의 실제 학습 여부와 근거 확인`);
      continue;
    }
    if (course.status === 'paused' || course.status === 'ended') {
      add(`status:${course.id}`, `${name}의 ${course.status === 'paused' ? '휴식 상태 유지·재개 비교' : '종료 기록 유지'}`, '기존 이력을 남깁니다. 다시 시작하기로 선택할 때 현재 범위와 시간을 확인하며, 지난 일정을 밀린 과제로 만들지 않습니다.', 'review', course.status === 'paused' ? ['B95', 'B96'] : ['B95', 'B79'], course.id);
    } else if (course.completion === 'not_started' || course.completion === 'unknown') {
      add(`status:${course.id}`, `${name}의 시작·현재 위치 확인`, `입력한 상태는 ${course.completion === 'not_started' ? '미시작' : '미확인'}입니다. 학습 중인 범위로 바꾸지 않고 시작 의사와 실제 위치를 먼저 확인합니다.`, 'clarify', ['B03', 'B04'], course.id);
    } else {
      add(`maintain:${course.id}`, `${name}의 기준 위치 유지`, ['reported_done', 'reviewed_done'].includes(course.completion)
        ? '기록한 완료 지점을 보존하고 다음 범위를 직접 선택합니다. 권 완료가 진단 완료나 다음 과정 진입을 뜻하지는 않습니다.'
        : `${namedAxes[course.axis] || '이 과정'}의 실제 범위를 별도로 유지하는 안입니다. 같은 축의 다른 과정을 합치거나 나이로 낮은 과정에 배정하지 않습니다.`, 'maintain', courseBranches(course), course.id);
    }
    const checks = [], checkBranches = [];
    if (unknownText(course.range)) { checks.push('권·단원 안에서 실제로 다룬 범위'); checkBranches.push('B04', 'B84'); }
    const depthKnown = !unknownText(course.depth) || values(state, 'Q15', course.id).some(value => ['개념·기본', '응용', '심화', '서술·증명', '경시 유형', '섞여 있음'].includes(value));
    if (!depthKnown) { checks.push('실제로 다룬 학습 깊이'); checkBranches.push('B05'); }
    const helpKnown = !unknownText(course.independence) || values(state, 'Q16', course.id).some(value => ['읽기만 도움', '힌트 도움', '풀이 함께', '해설 보고 재풀이', '혼자 풀이', '문제마다 다름'].includes(value));
    if (!helpKnown) { checks.push('혼자 해결한 범위와 도움 종류'); checkBranches.push('B05', 'B82'); }
    if (checks.length) {
      const detail = `${name}: ${checks.join(', ')} 미확인`;
      missing.push(detail);
      add(`clarify:${course.id}`, `${name}의 추가 확인`, `${checks.join(', ')}를 더 기록하면 현재 유지와 다음 선택을 비교할 수 있습니다. 미확인을 학습 부족으로 바꾸지 않습니다.`, 'clarify', checkBranches, course.id);
    }
    const explicitRemediation = values(state, 'Q34', course.id).some(value => ['원 진도 유지+별도 보완', '일부 보완 후 합류'].includes(value))
      || values(state, 'Q89', course.id).includes('보완 후 진단')
      || values(state, 'Q19', course.id).includes('구체 단원 있음');
    const unresolved = (fields._courseContexts || []).filter(context => context.course_id === course.id && context.assessment_state === 'deferred_for_remediation');
    const diagnosticRemediation = unresolved.some(context => context.item_error_suspected !== 'yes' && !NONPERSONAL_ROLES.includes(context.evidence_role));
    if (explicitRemediation || diagnosticRemediation) {
      add(`remediate:${course.id}`, `${name}의 보고된 범위 보완 검토`, explicitRemediation
        ? '이 과정의 응답에서 보완 검토를 직접 선택하거나 구체 범위가 있다고 보고했습니다. 대상 범위와 확인 방법을 정하고 현재 진도 유지·병행·보완 후 합류를 비교합니다.'
        : '이 과정에 보완 후 진단 상태가 기록되어 있습니다. 해당 범위만 확인하며 다른 권의 진행이나 전체 계획을 자동으로 중단하지 않습니다.', 'remediate', ['B06', 'B89', 'B79'], course.id);
    }
    const contexts = (fields._courseContexts || []).filter(context => context.course_id === course.id);
    if (contexts.some(context => Object.values(context).some(value => value?.state === 'conflicting'))) add(`conflict:${course.id}`, `${name}의 상충 응답 확인`, '현재 답변 안에 서로 다른 조건이 함께 선택되어 있습니다. 각각의 범위와 시점을 확인한 뒤 사용하며 평균이나 임의 결론으로 합치지 않습니다.', 'review', ['B87', 'B90'], course.id);
  }
  for (const axis of ['curriculum', 'thinking', 'arithmetic']) {
    if (!(state.courses || []).some(course => course.axis === axis)) {
      missing.push(`${namedAxes[axis]}: 현재 기록 없음 — 미시작인지 미확인인지 구분 필요`);
      add(`axis:${axis}`, `${namedAxes[axis]}의 현재 상태 확인`, '이 축의 과정이 아직 기록되지 않았습니다. 미시작·학습 중·모름 중 실제 상태를 확인하며 다른 축의 진도로 대신 계산하지 않습니다.', 'clarify', ['B03']);
    }
  }
  const hwangso = normalizeChoice(state.goals?.hwangso);
  const hwangsoDecision = [LATEST_HWANGSO_DECISION];
  if (hwangso === 'grade2') add('hwangso:grade2', '황소 초2 선택안과 현재 학습 비교', '초2 시점에 고려한다는 가족의 희망을 기준으로 범위·도움·회차·과제 시간을 확인합니다. 원자료의 코호트 날짜를 현재 공고나 공통 합격 조건으로 사용하지 않습니다.', 'review', ['B28', 'B29', 'B32', 'B33'], '', hwangsoDecision);
  else if (hwangso === 'grade3') add('hwangso:grade3', '황소 초3 선택안과 현재 학습 비교', '초3 시점에 고려한다는 희망을 남기고 지금의 과정을 유지하는 안을 함께 봅니다. 초3까지 기다리는 의무 과정이나 고정 진도 목표를 만들지 않습니다.', 'review', ['B28', 'B30', 'B31', 'B32'], '', hwangsoDecision);
  else if (hwangso === 'later') add('hwangso:later', '다른 시점·시점 보류와 현재 학습 비교', '초2·초3 중 하나로 정하지 않고 나중에 검토하려는 가족의 선택입니다. 현재 범위와 심화를 이어가면서 원하는 재검토 계기를 남길 수 있습니다. 진도가 높아져도 시점이나 참여 희망을 자동 변경하지 않습니다.', 'review', ['B28', 'B02', 'B79'], '', hwangsoDecision);
  else if (hwangso === 'none') add('hwangso:none', '황소를 선택하지 않는 현재 계획', '선발을 거치지 않고 기록한 교과·사고력·연산을 이어가는 독립적인 선택입니다. 미선택을 늦은 지원의 대기 상태로 바꾸지 않으며, 미선택 자체가 중등 진입이나 다른 목적 과정의 충족 조건은 아닙니다.', 'maintain', ['B28', ...(state.courses || []).filter(course => ['curriculum', 'thinking', 'arithmetic'].includes(course.axis)).flatMap(courseBranches)], '', hwangsoDecision);
  else if (flags.hwangso || flags.hwangsoContext) add('hwangso:undecided', '선발 선택을 미정으로 두고 비교', '황소 선택을 지금 확정하지 않아도 됩니다. 현재 공부와 시간 여건을 먼저 남기고 관심이나 목표가 바뀔 때 다시 선택할 수 있습니다.', 'review', ['B02', 'B07', 'B28'], '', hwangsoDecision);
  const reasonGuidance = {
    progress_pending: { title: '진도를 더 확인하며 선택 시점 검토', kind: 'clarify', branches: ['B28', 'B04', 'B05', 'B32'], reason: '가족이 진도 확인을 더 한 뒤 선택하고 싶다고 기록했습니다. 현재 권·단원·학습 깊이·도움을 검토할 회차의 범위와 구분해 확인합니다. 이 이유만으로 약점이나 진단 실패를 확정하지 않고, 확인하는 동안 현재 학습과 선택 시점을 유지합니다.' },
    young_depth: { title: '진도와 별개로 심화를 이어가는 선택', kind: 'maintain', branches: ['B28', 'B10', 'B05', 'B56'], reason: '가족이 아이가 아직 어리다고 판단해 서두르지 않고 심화로 배우길 원한다고 기록했습니다. 실제로 다룬 범위의 깊이·독립 설명·부담을 확인하며 유지·병행안을 비교합니다. 나이는 과정 입력을 제한하거나 황소 지원을 권하는 근거로 쓰지 않습니다.' },
    thorough_alternative: { title: '황소 없이 꼼꼼하게 배우는 경로 비교', kind: 'maintain', branches: ['B28', 'B09', 'B10', 'B14', 'B19'], reason: '가족이 학원 선택보다 현재 공부를 꼼꼼하게 이어가는 방향을 원한다고 기록했습니다. 교과·심화·사고력·연산을 각각 다루는 독립적인 선택으로 비교하며, 미선택을 실패나 향후 지원 대기로 취급하지 않습니다. 중등 진입을 강제하거나 현재 선택 의사를 자동 변경하지 않습니다.' },
    time_fit: { title: '시간과 지원 여건에 맞춰 시점 비교', kind: 'review', branches: ['B28', 'B07', 'B33', 'B82'], reason: '가족이 일정과 지원 여건을 선택 이유로 기록했습니다. 현재·고려 수업, 이동·과제, 아이와 보호자 시간을 나누어 확인합니다. 모르는 시간은 남겨 두고 병행이나 지원 시점을 확정하지 않습니다.' },
    child_preference: { title: '아이 의견과 가족 희망을 나누어 비교', kind: 'review', branches: ['B28', 'B02', 'B95'], reason: '아이의 의견을 선택 이유로 기록했습니다. 아이가 원하는 것과 학부모 희망을 별도로 확인하고 유지·나중 선택·미선택을 비교합니다. 아이 의견만으로 학습능력이나 부담 상태를 단정하지 않습니다.' },
    other: { title: '직접 적은 선택 이유 확인', kind: 'clarify', branches: ['B28', 'B02'], reason: '다른 선택 이유를 가족의 설명으로 보존합니다. 적어 둔 이유와 원하는 재검토 시점을 확인하며, 자유 메모를 실제 수행·지원 자격·완료 조건으로 자동 변환하지 않습니다.' },
    unsure: { title: '선택 이유를 아직 정하지 않고 현재 유지', kind: 'clarify', branches: ['B28', 'B02', 'B07'], reason: '선택 이유를 아직 정리 중인 상태로 남깁니다. 현재 공부와 원하는 방향을 먼저 확인하며 특정 지원 시점이나 학원을 대신 결정하지 않습니다.' },
  };
  for (const reason of unique(list(state.goals?.hwangsoReasons))) {
    const guidance = reasonGuidance[reason];
    if (guidance) {
      const actualMath = (state.courses || []).filter(course => ['curriculum', 'thinking', 'arithmetic'].includes(course.axis));
      const connectedBranches = reason === 'thorough_alternative'
        ? ['B28', ...(actualMath.length ? actualMath.flatMap(courseBranches) : ['B03']), ...(actualMath.some(course => course.axis === 'curriculum' && course.level === 'elementary') ? ['B10'] : [])]
        : guidance.branches;
      add(`hwangso:reason:${reason}`, guidance.title, guidance.reason, guidance.kind, connectedBranches, '', hwangsoDecision);
    }
  }
  if (flags.premier) add('goal:premier', '프리미어·필즈의 현재 반과 희망 확인', '기존 유아 과정과 월축을 보존합니다. 입력한 관심 또는 실제 재원 과정에 대해 반·코호트·희망 회차를 구분해 비교합니다.', 'review', ['B23', 'B24', 'B26']);
  if (flags.science) add('goal:science', '과학의 실제 경험과 목적 연결', '희망한 과학 분야와 실제 학습·실험 기록을 먼저 연결합니다. 수학 진도가 빠르다는 이유로 과학 숙달을 인정하거나 특정 과학 계획을 확정하지 않습니다.', 'clarify', ['B57', 'B63', 'B64']);
  if (flags.gifted) add('goal:gifted', '영재원 기관·회차별 조건 확인', '입력한 관심을 기관·지역·지원 학년도와 연결해 확인합니다. 옛 공고의 학년·이수 사례를 현재의 공통 자격으로 만들지 않습니다.', 'review', ['B36', 'B40']);
  if (flags.competition) add('goal:competition', '경시 자료 학습과 실제 응시 구분', '공부하려는 범위와 대회에 참가하려는 의사를 구분합니다. 자료를 학습하는 것만으로 응시·수상 목표를 생성하지 않습니다.', 'review', ['B65', 'B70']);
  if (flags.highSchool) add('goal:highschool', '희망 학교 유형과 준비 조건 확인', '가족이 밝힌 학교·진로 방향과 실제 범위·학교생활·해당 학년도 공고를 별도로 확인합니다. 선행 진도만으로 학교를 배정하지 않습니다.', 'review', ['B72', 'B75', 'B76']);
  const load = workload(state);
  const allUnknown = unique([...load.unknown, ...(load.byScope.candidate.unknown || [])]);
  if (allUnknown.length) {
    missing.push(...allUnknown);
    add('time:unknown', '병행 전에 소요 시간 확인', `현재·고려 일정에 미확인 시간이 있습니다. ${allUnknown.join(' ')} 병행 가능 여부를 확정하지 않고 조건부 비교안으로 남깁니다.`, 'clarify', ['B07', 'B82', 'B88']);
  }
  const currentCourses = (state.courses || []).filter(course => !['paused', 'ended'].includes(course.status) && personalEvidence(course));
  if (currentCourses.length > 1 || (state.activities || []).some(activity => activity.scope === 'candidate')) {
    add('parallel:current', '여러 과정의 병행 조합 비교', allUnknown.length
      ? '실제 과정들을 각각 유지하며 같은 범위·요일·지원이 겹치는지 비교합니다. 시간 미확인이 있어 병행 가능 확정이나 추가 수업 권고로 표시하지 않습니다.'
      : '입력한 과정과 시간대의 중복을 확인하며 유지·축소·후일 합류 조합을 비교합니다. 시간 기록이 있다는 것만으로 학습 적합성이나 기관 자격을 확정하지 않습니다.', 'parallel', ['B07', 'B56', 'B83']);
  }
  if (load.conflicts.length) add('time:conflict', '겹치는 시간과 지원 조정', `${load.conflicts.join(' ')} 겹친 활동을 확인하고 유지·축소·후일 합류를 직접 선택합니다.`, 'review', ['B07', 'B56', 'B95']);
  const plan = (state.plans || []).find(item => item.id === state.activePlanId);
  if (plan && JSON.stringify(state.goals) !== JSON.stringify(plan.goalsSnapshot)) add('goal:changed', '변경된 희망과 기존 기준 계획 비교', '목표가 선택 당시와 달라졌습니다. 현재 이력을 남긴 채 변경안을 비교하고 새 기준은 가족이 선택할 때만 만듭니다.', 'review', ['B78', 'B100']);
  if ((contract.preserved_models || catalog.preserved_models)) notes.push('기존 섹션 월축·기간·확정 증속 모델을 보존하며, 상세 범위의 기간 대응이 확인되기 전 새 달성일을 계산하지 않습니다.');
  return { suggestions, missing: unique(missing), notes };
}

function timeMinutes(text) {
  if (!/^\d{2}:\d{2}$/.test(text || '')) return null;
  const [hour, minute] = text.split(':').map(Number);
  return hour < 24 && minute < 60 ? hour * 60 + minute : null;
}
function unionMinutes(intervals) {
  let total = 0, end = -1;
  for (const [start, finish] of [...intervals].sort((a, b) => a[0] - b[0])) {
    total += Math.max(0, finish - Math.max(end, start));
    end = Math.max(end, finish);
  }
  return total;
}
function aggregateActivities(activities) {
  const seen = new Map(), unknown = [], conflicts = [], notes = [];
  for (const activity of activities) {
    if (seen.has(activity.id)) {
      const prior = seen.get(activity.id);
      const timing = item => JSON.stringify([item.day, item.start, item.end, item.minutes, item.adultMinutes, item.known, item.scope]);
      if (timing(prior) !== timing(activity)) {
        conflicts.push(`${activity.name || activity.id}: 같은 활동 ID에 서로 다른 시간이 있습니다.`);
        unknown.push(`${activity.name || activity.id}: 중복 활동의 시간 정정 필요`);
      } else notes.push(`${activity.name || activity.id}: 여러 과정에 연결된 활동을 한 번만 합산했습니다.`);
    } else seen.set(activity.id, activity);
  }
  const childIntervals = new Map(), adultIntervals = new Map(), intervalsForConflict = new Map();
  let childEstimate = 0, adultEstimate = 0, childKnown = false, adultKnown = false;
  for (const activity of seen.values()) {
    const name = activity.name || activity.id || '이름 없는 활동';
    if (activity.known === false) { unknown.push(`${name}: 소요 시간 미확인`); continue; }
    const start = timeMinutes(activity.start), end = timeMinutes(activity.end);
    const intervalValid = DAY_NAMES.includes(activity.day) && start !== null && end !== null && end >= start;
    const hasInterval = present(activity.start) || present(activity.end);
    if (intervalValid) {
      (childIntervals.get(activity.day) || childIntervals.set(activity.day, []).get(activity.day)).push([start, end]);
      const previous = intervalsForConflict.get(activity.day) || [];
      for (const item of previous) if (start < item.end && end > item.start) conflicts.push(`${activity.day}: ${item.name} / ${name} 시간 겹침`);
      previous.push({ start, end, name }); intervalsForConflict.set(activity.day, previous); childKnown = true;
      if (validNumber(activity.minutes) && activity.minutes !== end - start) conflicts.push(`${name}: 시간대와 입력 총량이 달라 시간대를 기준으로 계산했습니다.`);
      if (validNumber(activity.adultMinutes)) {
        adultKnown = true;
        if (activity.adultMinutes === end - start) (adultIntervals.get(activity.day) || adultIntervals.set(activity.day, []).get(activity.day)).push([start, end]);
        else {
          adultEstimate += activity.adultMinutes;
          if (activity.adultMinutes > 0) { notes.push(`${name}: 보호자 지원 ${activity.adultMinutes}분은 시간대 없는 추정입니다.`); unknown.push(`${name}: 보호자 지원 시간대 미확인`); }
        }
      } else unknown.push(`${name}: 보호자 지원 시간 미확인`);
    } else {
      if (hasInterval) unknown.push(`${name}: 요일·시작·종료 시간대를 확인해 주세요.`);
      if (validNumber(activity.minutes)) { childEstimate += activity.minutes; childKnown = true; notes.push(`${name}: 시간대 없는 총량 추정이며 겹침 여부 미확인`); unknown.push(`${name}: 활동 시간대 미확인`); }
      else unknown.push(`${name}: 아이 소요 시간 미확인`);
      if (validNumber(activity.adultMinutes)) { adultEstimate += activity.adultMinutes; adultKnown = true; if (activity.adultMinutes > 0) unknown.push(`${name}: 보호자 지원 시간대 미확인`); }
      else unknown.push(`${name}: 보호자 지원 시간 미확인`);
    }
  }
  return {
    childMinutes: childKnown ? [...childIntervals.values()].reduce((sum, periods) => sum + unionMinutes(periods), childEstimate) : null,
    adultMinutes: adultKnown ? [...adultIntervals.values()].reduce((sum, periods) => sum + unionMinutes(periods), adultEstimate) : null,
    unknown: unique(unknown), conflicts: unique(conflicts), notes: unique(notes),
  };
}
export function workload(state) {
  const activities = state.activities || [];
  const currentActivities = activities.filter(activity => activity.scope !== 'candidate');
  const candidateActivities = activities.filter(activity => activity.scope === 'candidate');
  const current = aggregateActivities(currentActivities), candidate = aggregateActivities(candidateActivities), combined = aggregateActivities(activities);
  const academy = state.academy || {};
  const fallback = (scope, rows, frequency, duration, name) => {
    if (rows.some(activity => activity.kind === 'class')) return 0;
    if (validNumber(frequency) && validNumber(duration)) {
      scope.childMinutes = (scope.childMinutes || 0) + frequency * duration;
      scope.notes.push(`${name}: 횟수×시간의 주간 추정이며 과정별 시간대와 중복은 미확인`);
      if (frequency * duration > 0) scope.unknown.push(`${name}: 수업 시간대 미확인`);
      return frequency * duration;
    } else if (present(frequency) || present(duration)) scope.unknown.push(`${name}: 주당 횟수 또는 회당 시간 미확인`);
    return 0;
  };
  const estimatedCurrent = fallback(current, currentActivities, academy.currentFrequency, academy.currentSessionMinutes, '현재 수업');
  const estimatedCandidate = fallback(candidate, candidateActivities, academy.desiredFrequency, academy.desiredSessionMinutes, '고려 수업');
  if (estimatedCurrent || estimatedCandidate) {
    combined.childMinutes = (combined.childMinutes || 0) + estimatedCurrent + estimatedCandidate;
    combined.notes.push('현재 수업과 고려 수업을 함께 선택한다고 가정한 단순 합계입니다. 시간대 중복은 미확인입니다.');
    combined.unknown.push('횟수×시간으로 입력한 수업의 시간대 미확인');
  }
  if (state.support?.homeworkKnown !== 'yes') current.unknown.push('과제·복습 소요 시간에 미확인 항목이 있습니다.');
  current.notes.push('아이 시간과 보호자 시간은 별도 예산입니다. 현재 시간과 고려 수업을 자동으로 합치지 않습니다.');
  return { ...current, unknown: unique(current.unknown), conflicts: unique([...current.conflicts, ...combined.conflicts]), byScope: { current: clone(current), candidate, combined } };
}

function checkedState(state) {
  const check = validateState(state);
  if (!check.valid) throw new TypeError(check.errors.join('\n'));
}
function addEvent(state, type, payload, at) { state.events.push({ id: id('event'), type, at, ...payload }); }
export function choiceConflicts(routeIds = []) {
  const alternatives = new Set(['B28:P1', 'B28:P2', 'B28:P3', 'B28:P5', 'B28:P6']);
  const selected = unique(list(routeIds)).filter(routeId => alternatives.has(routeId));
  return selected.length > 1 ? [{
    branchId: 'B28', routeIds: selected,
    message: '황소의 초2 고려·초3 고려·미선택·미정·다른 시점에 검토는 현재 기준에서 하나를 선택해 주세요. 지금 선택한 방향과 별도로 나중에 다시 검토하려면 다음 확인 지점에 남길 수 있습니다. 실제 진도에 맞는 이후 경로는 함께 선택할 수 있습니다.',
    decisionIds: [LATEST_HWANGSO_DECISION],
  }] : [];
}
function reviewPointErrors(points, courseIds, label = '다음 확인 지점') {
  if (points === undefined) return [];
  if (!Array.isArray(points)) return [`${label}: 배열이 필요합니다.`];
  const errors = [], seen = new Set();
  for (const point of points) {
    if (!plainObject(point)) { errors.push(`${label}: 객체가 필요합니다.`); continue; }
    if (typeof point.id !== 'string' || !point.id || seen.has(point.id)) errors.push(`${label}: 고유한 ID가 필요합니다.`);
    seen.add(point.id);
    if (typeof point.courseId !== 'string' || point.courseId && !courseIds.has(point.courseId)) errors.push(`${label}: 연결할 실제 과정을 확인해 주세요.`);
    if (typeof point.branchId !== 'string' || point.branchId && !/^B(?:0[1-9]|[1-9]\d|10[01])$/.test(point.branchId)) errors.push(`${label}: 연결할 원자료 갈림길을 확인해 주세요.`);
    if (!REVIEW_TRIGGERS.includes(point.trigger)) errors.push(`${label}: 확인 계기를 확인해 주세요.`);
    if (typeof point.condition !== 'string' || typeof point.nextAction !== 'string') errors.push(`${label}: 확인 조건과 다음 선택은 문자열이어야 합니다.`);
    if (point.courseSnapshot !== undefined && point.courseSnapshot !== null && (!plainObject(point.courseSnapshot) || !point.courseId || point.courseSnapshot.id !== point.courseId)) errors.push(`${label}: 연결 과정의 보존 스냅샷을 확인해 주세요.`);
  }
  return errors;
}
export function acceptPlan(state, selection, nowISO) {
  checkedState(state);
  if (!selection || typeof selection !== 'object') throw new TypeError('선택할 계획이 필요합니다.');
  const routeIds = unique(list(selection.routeIds));
  const courseIds = unique(list(selection.courseIds));
  if (!routeIds.length && !courseIds.length) throw new TypeError('하나 이상의 경로나 현재 과정을 선택해 주세요.');
  if (routeIds.some(routeId => !validRouteId(routeId))) throw new TypeError('유효하지 않은 경로 ID입니다.');
  const conflicts = choiceConflicts(routeIds);
  if (conflicts.length) throw new TypeError(conflicts.map(conflict => conflict.message).join('\n'));
  if (courseIds.some(courseId => !state.courses.some(course => course.id === courseId))) throw new TypeError('현재 기록에 없는 과정은 기준 계획에 연결할 수 없습니다.');
  const reviewErrors = reviewPointErrors(selection.reviewPoints, new Set(state.courses.map(course => course.id)));
  if (reviewErrors.length) throw new TypeError(reviewErrors.join('\n'));
  const reviewPoints = clone(selection.reviewPoints || []).map(point => ({
    ...point, courseSnapshot: point.courseId ? clone(state.courses.find(course => course.id === point.courseId)) : null,
  }));
  const status = selection.status || 'active';
  if (!PLAN_STATUSES.includes(status)) throw new TypeError('유효하지 않은 계획 상태입니다.');
  const next = clone(state), at = now(nowISO), courseSnapshots = clone(next.courses.filter(course => courseIds.includes(course.id)));
  const trackStatuses = Object.fromEntries(courseSnapshots.map(course => [course.id, selection.trackStatuses?.[course.id] || course.status || 'active']));
  if (Object.values(trackStatuses).some(value => !COURSE_STATUSES.includes(value))) throw new TypeError('유효하지 않은 과정 상태입니다.');
  const plan = {
    id: id('plan'), version: Math.max(0, ...next.plans.map(item => item.version)) + 1, previousVersionId: next.activePlanId,
    acceptedAt: at, title: String(selection.title || '우리 아이의 기준 계획'), reason: String(selection.reason || ''), status,
    selection: { routeIds, courseIds, reviewPoints: clone(reviewPoints) }, routeIds, courseIds, courseSnapshots, trackStatuses, reviewPoints,
    profileSnapshot: clone(next.profile), goalsSnapshot: clone(next.goals), supportSnapshot: clone(next.support), academySnapshot: clone(next.academy),
    personalitySnapshot: clone(next.personality || null), wizardSnapshot: clone(next.wizard || null),
    activitySnapshots: clone(next.activities), answerSnapshot: clone(next.answers), courseAnswerSnapshot: clone(next.courseAnswers || {}),
    unknowns: [...workload(next).unknown, '교재 범위와 원표 기간의 대응이 확인되지 않은 과정은 달성일을 계산하지 않습니다.'],
    periodMappingState: 'not_verified', conditionState: 'unknown',
  };
  next.plans.push(plan); next.activePlanId = plan.id; next.selectedRouteIds = clone(routeIds);
  addEvent(next, 'plan_accepted', { planId: plan.id, previousVersionId: plan.previousVersionId }, at);
  next.revision += 1;
  return next;
}
export function appendRecord(state, record, nowISO) {
  checkedState(state);
  if (!record || !['actual', 'diagnostic', 'correction'].includes(record.kind)) throw new TypeError('학습·진단·정정 중 기록 종류를 선택해 주세요.');
  if (!state.courses.some(course => course.id === record.courseId)) throw new TypeError('기록을 연결할 실제 과정을 선택해 주세요.');
  if (record.id && state.records.some(item => item.id === record.id)) throw new TypeError('중복 기록 ID입니다.');
  if (record.kind === 'correction') {
    const original = state.records.find(item => item.id === record.correctsRecordId);
    if (!original || original.courseId !== record.courseId) throw new TypeError('같은 과정의 정정 대상 기록을 지정해 주세요.');
  }
  const next = clone(state), at = now(nowISO);
  const added = { ...clone(record), id: record.id || id('record'), recordedAt: at, occurredAt: record.occurredAt || at.slice(0, 10), linkedPlanId: state.activePlanId };
  if (record.kind === 'diagnostic') {
    added.diagnosticState ||= 'taken_unreviewed'; added.firstResponsesState ||= 'not_recorded';
    added.attemptKind ||= 'unknown'; added.itemValidityState ||= 'unreviewed';
    // Scoring and completion are never inferred from an attached diagnostic state.
  }
  next.records.push(added); addEvent(next, 'record_added', { recordId: added.id, planId: state.activePlanId }, at); next.revision += 1;
  checkedState(next);
  return next;
}
export function changePlanStatus(state, planId, status, courseId, nowISO) {
  checkedState(state);
  const original = state.plans.find(plan => plan.id === planId);
  if (!original) throw new TypeError('변경할 기준 계획을 찾을 수 없습니다.');
  if (!(courseId ? COURSE_STATUSES : PLAN_STATUSES).includes(status)) throw new TypeError('유효하지 않은 계획 상태입니다.');
  if (courseId && !original.courseIds.includes(courseId)) throw new TypeError('해당 계획에 없는 과정입니다.');
  const next = clone(state), at = now(nowISO), plan = clone(original);
  plan.id = id('plan'); plan.version = Math.max(0, ...next.plans.map(item => item.version)) + 1;
  plan.previousVersionId = original.id; plan.acceptedAt = at;
  if (courseId) plan.trackStatuses[courseId] = status; else plan.status = status;
  plan.reason = `${courseId ? '선택한 과정' : '기준 계획'} 상태 변경: ${status}`;
  plan.change = { type: 'status', courseId: courseId || null, from: courseId ? original.trackStatuses[courseId] : original.status, to: status };
  if (plan.versionContract === 10 && courseId) {
    plan.courseIntents[courseId] = ({ active: 'continue', reduced: 'reduce', paused: 'pause', ended: 'undecided' })[status];
    const course = state.courses.find(c => c.id === courseId) || plan.courseSnapshots.find(c => c.id === courseId);
    const scope = Object.fromEntries(['course','volume','unit','range','edition','sourceCurriculum','isbn'].map(k => [k,course[k] || '']));
    plan.courseRelations.push({ id: id('relation'), kind: 'R07', sourceCourseIds: [courseId], targetPlannedCourseIds: [],
      parallelCourseIds: plan.courseIds.filter(cid => cid !== courseId), scopeSnapshots: [{ courseId, scope }],
      condition: '상태 변경 후 현재 범위·도움·부담·시간과 가족의 의사를 다시 확인', reviewTrigger: 'family_review',
      conditionEvidenceIds: [], conditionEvidenceSnapshots: [], unresolved: ['변경한 과정의 현재 수행 확인'],
      status: 'family_selected', automaticJoin: false, sourceIds: ['UF03','U2'] });
  }
  if (status === 'active' && (original.status === 'paused' || original.trackStatuses?.[courseId] === 'paused')) {
    plan.unknowns = unique([...(plan.unknowns || []), '재개 시점의 실제 범위와 시간 확인이 필요합니다. 지난 일정을 압축하지 않습니다.']);
  }
  next.plans.push(plan); next.activePlanId = plan.id;
  addEvent(next, 'plan_status_changed', { planId: plan.id, previousVersionId: original.id, courseId: courseId || null, status }, at);
  next.revision += 1;
  return next;
}

export function comparePlan(state, planId = state.activePlanId) {
  const plan = state.plans.find(item => item.id === planId);
  if (!plan) return { summary: '선택한 기준 계획이 없습니다.', items: [], changes: [], unknowns: ['후보 조합 또는 현재 과정을 기준 계획으로 선택해 주세요.'] };
  const unknowns = [], changes = [];
  if (JSON.stringify(state.goals) !== JSON.stringify(plan.goalsSnapshot)) changes.push('가족의 희망이 기준 계획 선택 당시와 달라졌습니다. 변경안을 비교할 수 있습니다.');
  if (JSON.stringify(state.support) !== JSON.stringify(plan.supportSnapshot) || JSON.stringify(state.academy) !== JSON.stringify(plan.academySnapshot)) changes.push('시간·지원 조건이 기준 계획 선택 당시와 달라졌습니다.');
  if (JSON.stringify(state.activities) !== JSON.stringify(plan.activitySnapshots)) changes.push('활동 일정이 기준 계획 선택 당시와 달라졌습니다.');
  const items = plan.courseSnapshots.map(course => {
    const records = state.records.filter(record => record.courseId === course.id);
    const actualRecords = records.filter(record => record.kind === 'actual' && personalEvidence(record));
    const referenceRecords = records.filter(record => !personalEvidence(record));
    const diagnostics = records.filter(record => (record.kind === 'diagnostic' || record.kind === 'correction') && personalEvidence(record));
    const actual = latest(actualRecords), diagnostic = latest(diagnostics), itemUnknowns = [];
    const plannedRange = course.plannedRange || course.range || '';
    if (!actual) itemUnknowns.push('실제 학습 기록이 없습니다. 미학습으로 단정하지 않습니다.');
    if (referenceRecords.length) itemUnknowns.push('학원 공지·예시·다른 사례·AI 요약은 참고 기록이며 개인의 수행 사실로 계산하지 않습니다.');
    if (!plannedRange) itemUnknowns.push('기준 계획의 세부 범위가 미확인입니다.');
    if (actual && plannedRange && actual.range !== plannedRange) itemUnknowns.push('계획 범위와 실제 기록 범위를 직접 대조해야 합니다. 진도율을 자동 계산하지 않습니다.');
    if (!diagnostic) itemUnknowns.push('이 과정의 진단 기록은 없습니다. 교재 완료와 별개입니다.');
    if (diagnostics.some(item => ['missing', 'not_recorded'].includes(item.firstResponsesState))) itemUnknowns.push('최초 풀이가 없거나 소실된 평가가 있습니다. 응답을 재구성하지 않습니다.');
    if (diagnostics.some(item => ['error_suspected', 'correction_pending', 'invalid_for_scoring'].includes(item.itemValidityState))) itemUnknowns.push('문항·채점 검토가 필요한 평가가 있습니다. 해당 항목의 판정을 유보합니다.');
    if (diagnostics.some(item => item.attemptKind === 'repeat')) itemUnknowns.push('재풀이 기록은 새로운 독립 수행으로 환산하지 않습니다.');
    if (diagnostics.some(item => item.scoreKind === 'teacher_hypothetical_estimate')) itemUnknowns.push('교사의 가정 점수는 실제 점수와 구분합니다.');
    unknowns.push(...itemUnknowns.map(message => `${course.course || course.id}: ${message}`));
    return {
      courseId: course.id, course: course.course || '', axis: course.axis, plannedRange,
      status: plan.trackStatuses[course.id] || course.status, recordCount: records.length, actualRecords: clone(actualRecords), referenceRecords: clone(referenceRecords), latestActual: clone(actual), diagnostics: clone(diagnostics),
      diagnosticState: diagnostic?.diagnosticState || 'not_prepared', unknowns: itemUnknowns,
      coverageState: actual && plannedRange && actual.range === plannedRange ? 'reported_same_range' : 'unknown',
    };
  });
  const load = workload(state); unknowns.push(...load.unknown); changes.push(...load.conflicts);
  const recordsPresent = items.some(item => item.actualRecords.length > 0 || item.diagnostics.some(personalEvidence));
  const summary = !recordsPresent ? '기록 부족' : changes.length ? '시간·목표에 맞춰 계획 재검토' : '기록상 계획을 이어가는 중';
  return { summary, items, changes: unique(changes), unknowns: unique(unknowns), planId: plan.id, planVersion: plan.version, status: plan.status, workload: load };
}

export function validateState(state) {
  const errors = [];
  const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
  if (!object(state)) return { valid: false, errors: ['상태는 JSON 객체여야 합니다.'] };
  if (state.schemaVersion !== 1) errors.push('지원하지 않는 상태 버전입니다.');
  if (typeof state.id !== 'string' || !state.id) errors.push('상태 ID가 필요합니다.');
  if (!Number.isInteger(state.revision) || state.revision < 0) errors.push('상태 revision이 올바르지 않습니다.');
  for (const name of ['profile', 'support', 'academy', 'goals', 'answers']) if (!object(state[name])) errors.push(`${name}: 객체가 필요합니다.`);
  for (const name of ['courses', 'activities', 'selectedRouteIds', 'plans', 'records', 'events']) if (!Array.isArray(state[name])) errors.push(`${name}: 배열이 필요합니다.`);
  if (errors.length) return { valid: false, errors };
  if (!calendarDate(state.profile.asOf)) errors.push('기록 기준일이 올바르지 않습니다.');
  const age = ageMonths(state.profile); if (age.error) errors.push(age.error);
  if (state.profile.reportedAge !== undefined && state.profile.reportedAge !== null && (!Number.isInteger(state.profile.reportedAge) || state.profile.reportedAge < 4 || state.profile.reportedAge > 18)) errors.push('보고한 나이를 확인해 주세요.');
  if (state.profile.reportedBirthMonth !== undefined && state.profile.reportedBirthMonth !== null && (!Number.isInteger(state.profile.reportedBirthMonth) || state.profile.reportedBirthMonth < 1 || state.profile.reportedBirthMonth > 12)) errors.push('보고한 생월을 확인해 주세요.');
  for (const [name, value] of Object.entries(state.support)) if (name.endsWith('Minutes') && value !== null && !validNumber(value)) errors.push(`지원 시간 ${name}을 확인해 주세요.`);
  for (const [name, value] of Object.entries(state.academy)) if (value !== null && !validNumber(value)) errors.push(`수업 시간/횟수 ${name}을 확인해 주세요.`);
  if (!Array.isArray(state.support.helpTypes) || !Array.isArray(state.goals.parent)) errors.push('지원 종류와 학부모 희망은 배열이어야 합니다.');
  for (const key of ['science', 'gifted', 'competition', 'highSchool', 'medical']) if (typeof state.goals[key] !== 'boolean') errors.push(`${key}: 희망 선택은 참/거짓 값이어야 합니다.`);
  if (!['grade2', 'grade3', 'later', 'none', 'undecided', 'unknown', 'H_G2', 'H_G3', 'H_NONE', 'H_UNDECIDED'].includes(state.goals.hwangso)) errors.push('황소 선택 값을 확인해 주세요.');
  if (state.goals.hwangsoReasons !== undefined && (!Array.isArray(state.goals.hwangsoReasons) || state.goals.hwangsoReasons.some(reason => !HWANGSO_REASONS.includes(reason)))) errors.push('황소 선택 이유 값을 확인해 주세요.');
  for (const key of ['hwangsoTimingNote', 'hwangsoReasonNote']) if (state.goals[key] !== undefined && typeof state.goals[key] !== 'string') errors.push(`${key}: 가족의 설명은 문자열이어야 합니다.`);
  if (!['consider', 'current', 'later', 'none', 'undecided', 'unknown'].includes(state.goals.premier)) errors.push('프리미어 선택 값을 확인해 주세요.');
  if (!['enter', 'do_not_enter', 'undecided', 'unknown'].includes(state.goals.competitionIntent)) errors.push('대회 참가 희망 값을 확인해 주세요.');
  if (state.selectedRouteIds.some(value => !validRouteId(value))) errors.push('선택한 경로 ID가 올바르지 않습니다.');
  if (state.goals.schoolTypes !== undefined && (!Array.isArray(state.goals.schoolTypes) || state.goals.schoolTypes.some(value => !['gifted_school', 'science_school', 'autonomous', 'general', 'undecided'].includes(value)))) errors.push('관심 학교 유형을 확인해 주세요.');
  if (state.researchAnswers !== undefined && !object(state.researchAnswers)) errors.push('자료별 응답은 객체여야 합니다.');
  const checkIds = (items, label) => {
    const seen = new Set();
    for (const item of items) {
      if (!object(item) || typeof item.id !== 'string' || !item.id) { errors.push(`${label}: 유효한 ID와 객체가 필요합니다.`); continue; }
      if (seen.has(item.id)) errors.push(`${label}: 중복 ID ${item.id}`);
      seen.add(item.id);
    }
    return seen;
  };
  const courseIds = checkIds(state.courses, '과정'), planIds = checkIds(state.plans, '계획'), recordIds = checkIds(state.records, '기록');
  checkIds(state.activities, '활동'); checkIds(state.events, '사건');
  for (const course of state.courses.filter(object)) {
    for (const field of ['subject', 'course', 'edition', 'volume', 'unit', 'range', 'depth', 'independence', 'plannedRange', 'sourceRole', 'evidenceDate', 'note']) if (course[field] !== undefined && typeof course[field] !== 'string') errors.push(`${course.id}: ${field}는 문자열이어야 합니다.`);
    if (!['curriculum', 'thinking', 'arithmetic', 'science', 'other'].includes(course.axis)) errors.push(`${course.id}: 학습 축을 확인해 주세요.`);
    if (!['elementary', 'middle', 'high', 'other', 'unknown'].includes(course.level)) errors.push(`${course.id}: 실제 과정 수준을 확인해 주세요.`);
    if (!COMPLETIONS.includes(course.completion)) errors.push(`${course.id}: 완료 상태를 확인해 주세요.`);
    if (!COURSE_STATUSES.includes(course.status)) errors.push(`${course.id}: 과정 상태를 확인해 주세요.`);
    if (!['whole', 'selected_ranges', 'unknown'].includes(course.coverageIntent)) errors.push(`${course.id}: 학습 범위 유형을 확인해 주세요.`);
  }
  for (const activity of state.activities.filter(object)) {
    if (activity.known !== undefined && typeof activity.known !== 'boolean') errors.push(`${activity.id}: 시간 확인 상태는 참/거짓 값이어야 합니다.`);
    for (const key of ['minutes', 'adultMinutes']) if (activity[key] !== null && activity[key] !== undefined && !validNumber(activity[key])) errors.push(`${activity.id}: ${key}를 확인해 주세요.`);
    if (activity.day && !DAY_NAMES.includes(activity.day)) errors.push(`${activity.id}: 요일이 올바르지 않습니다.`);
    if (activity.start && timeMinutes(activity.start) === null || activity.end && timeMinutes(activity.end) === null) errors.push(`${activity.id}: 시간 형식이 올바르지 않습니다.`);
    if (activity.start && activity.end && timeMinutes(activity.end) < timeMinutes(activity.start)) errors.push(`${activity.id}: 같은 날의 종료 시간은 시작 뒤여야 합니다.`);
    if (activity.scope && !['current', 'candidate'].includes(activity.scope)) errors.push(`${activity.id}: 현재/후보 일정 구분을 확인해 주세요.`);
    if (activity.courseIds && (!Array.isArray(activity.courseIds) || activity.courseIds.some(courseId => !courseIds.has(courseId)))) errors.push(`${activity.id}: 연결한 과정을 확인해 주세요.`);
  }
  const checkAnswer = (questionId, answer, label, contextId = '', allowLegacy = true) => {
    if (!validQuestionId(questionId)) errors.push(`${label}: 지원하지 않는 질문 ID입니다.`);
    if (!object(answer) || !Array.isArray(answer.values) || answer.values.some(value => typeof value !== 'string')) { errors.push(`${label}: 응답 형식이 올바르지 않습니다.`); return; }
    if (answer.note !== undefined && typeof answer.note !== 'string') errors.push(`${label}: 응답 메모는 문자열이어야 합니다.`);
    if (answer.recordedAt !== undefined && typeof answer.recordedAt !== 'string') errors.push(`${label}: 기록일은 문자열이어야 합니다.`);
    if (answer.courseId && (!courseIds.has(answer.courseId) || contextId && answer.courseId !== contextId)) errors.push(`${label}: 응답과 연결된 과정이 올바르지 않습니다.`);
    if (answer.unscopedAnswer !== undefined) {
      if (!allowLegacy || !answer.courseId) errors.push(`${label}: 별도 공통 응답은 기존 과정 응답과의 호환에만 사용합니다.`);
      else {
        if (answer.unscopedAnswer?.courseId) errors.push(`${label}: 공통 응답에 과정 ID를 지정할 수 없습니다.`);
        checkAnswer(questionId, answer.unscopedAnswer, `${label} 공통 응답`, '', false);
      }
    }
  };
  for (const [questionId, answer] of Object.entries(state.answers)) checkAnswer(questionId, answer, questionId);
  if (state.courseAnswers !== undefined) {
    if (!object(state.courseAnswers)) errors.push('과정별 응답은 객체여야 합니다.');
    else for (const [courseId, answers] of Object.entries(state.courseAnswers)) {
      if (!safeKey(courseId) || !courseIds.has(courseId)) errors.push(`${courseId}: 과정별 응답과 연결된 실제 과정이 없습니다.`);
      if (!object(answers)) { errors.push(`${courseId}: 과정별 응답 묶음은 객체여야 합니다.`); continue; }
      for (const [questionId, answer] of Object.entries(answers)) checkAnswer(questionId, answer, `${courseId} ${questionId}`, courseId, false);
    }
  }
  if (state.planDraft !== undefined) {
    if (!object(state.planDraft)) errors.push('계획 초안은 객체여야 합니다.');
    else errors.push(...reviewPointErrors(state.planDraft.reviewPoints, courseIds, '초안의 다음 확인 지점'));
  }
  for (const record of state.records.filter(object)) {
    for (const field of ['range', 'completion', 'depth', 'independence', 'evidenceRole', 'note', 'diagnosticState', 'attemptKind', 'firstResponsesState', 'scoreKind', 'itemValidityState']) if (record[field] !== undefined && typeof record[field] !== 'string') errors.push(`${record.id}: ${field}는 문자열이어야 합니다.`);
    if (!courseIds.has(record.courseId)) errors.push(`${record.id}: 연결한 과정이 없습니다.`);
    if (!['actual', 'diagnostic', 'correction'].includes(record.kind)) errors.push(`${record.id}: 기록 종류가 올바르지 않습니다.`);
    if (!calendarDate(String(record.occurredAt || '').slice(0, 10))) errors.push(`${record.id}: 사건일을 확인해 주세요.`);
    if (record.completion && !COMPLETIONS.includes(record.completion)) errors.push(`${record.id}: 완료 상태가 올바르지 않습니다.`);
    if (record.diagnosticState && !DIAGNOSTIC_STATES.includes(record.diagnosticState)) errors.push(`${record.id}: 진단 상태가 올바르지 않습니다.`);
    if (record.attemptKind && !['first', 'repeat', 'unknown'].includes(record.attemptKind)) errors.push(`${record.id}: 시도 종류가 올바르지 않습니다.`);
    if (record.firstResponsesState && !['available', 'not_recorded', 'missing'].includes(record.firstResponsesState)) errors.push(`${record.id}: 첫 풀이 보존 상태가 올바르지 않습니다.`);
    if (record.scoreKind && !['observed', 'corrected', 'teacher_hypothetical_estimate'].includes(record.scoreKind)) errors.push(`${record.id}: 점수 종류가 올바르지 않습니다.`);
    if (record.itemValidityState && !['unreviewed', 'reviewed', 'error_suspected', 'correction_pending', 'invalid_for_scoring'].includes(record.itemValidityState)) errors.push(`${record.id}: 문항 검토 상태가 올바르지 않습니다.`);
    if (record.kind === 'correction') {
      const priorIndex = state.records.findIndex(item => object(item) && item.id === record.correctsRecordId);
      const recordIndex = state.records.indexOf(record), prior = state.records[priorIndex];
      if (!recordIds.has(record.correctsRecordId) || priorIndex < 0 || priorIndex >= recordIndex || prior?.courseId !== record.courseId) errors.push(`${record.id}: 정정 대상은 같은 과정의 앞선 기록이어야 합니다.`);
    }
  }
  const planVersions = new Set();
  for (const plan of state.plans.filter(object)) {
    if (!Number.isInteger(plan.version) || plan.version < 1 || !PLAN_STATUSES.includes(plan.status)) errors.push(`${plan.id}: 계획 버전/상태를 확인해 주세요.`);
    if (planVersions.has(plan.version)) errors.push(`${plan.id}: 중복 계획 버전입니다.`);
    planVersions.add(plan.version);
    if (!Array.isArray(plan.courseIds) || !Array.isArray(plan.routeIds) || !Array.isArray(plan.courseSnapshots) || !object(plan.trackStatuses)) errors.push(`${plan.id}: 계획 스냅샷이 올바르지 않습니다.`);
    else {
      if (plan.courseIds.some(value => typeof value !== 'string') || plan.routeIds.some(value => !validRouteId(value))) errors.push(`${plan.id}: 계획의 과정/경로 ID가 올바르지 않습니다.`);
      const snapshots = plan.courseSnapshots.filter(object);
      if (snapshots.length !== plan.courseSnapshots.length || snapshots.some(course => typeof course.id !== 'string' || !plan.courseIds.includes(course.id))) errors.push(`${plan.id}: 계획의 과정 스냅샷을 확인해 주세요.`);
      if (plan.courseIds.some(courseId => !snapshots.some(course => course.id === courseId))) errors.push(`${plan.id}: 계획의 과정 스냅샷이 누락됐습니다.`);
      if (Object.entries(plan.trackStatuses).some(([courseId, status]) => !plan.courseIds.includes(courseId) || !COURSE_STATUSES.includes(status))) errors.push(`${plan.id}: 과정별 계획 상태를 확인해 주세요.`);
    }
    if (plan.previousVersionId) {
      const previous = state.plans.find(item => object(item) && item.id === plan.previousVersionId);
      if (!planIds.has(plan.previousVersionId) || previous?.version >= plan.version) errors.push(`${plan.id}: 이전 버전 연결이 올바르지 않습니다.`);
    }
    const pointCourseIds = new Set([...courseIds, ...(Array.isArray(plan.courseSnapshots) ? plan.courseSnapshots.filter(object).map(course => course.id) : [])]);
    errors.push(...reviewPointErrors(plan.reviewPoints, pointCourseIds, `${plan.id} 다음 확인 지점`));
    if (plan.selection?.reviewPoints !== undefined) errors.push(...reviewPointErrors(plan.selection.reviewPoints, pointCourseIds, `${plan.id} 선택한 확인 지점`));
  }
  if (state.activePlanId !== null && !planIds.has(state.activePlanId)) errors.push('선택한 기준 계획을 찾을 수 없습니다.');
  return { valid: errors.length === 0, errors: unique(errors) };
}
