// A small presentation queue over the unchanged 104-question source catalog.
// Age changes order and wording, never course-entry permission or eligibility.
import { ageMonths, getAnswer } from './engine.mjs';

const copy = value => structuredClone(value);
const array = value => Array.isArray(value) ? value : [];
const unique = values => [...new Set(values)];
const textKnown = value => typeof value === 'string' && value.trim() !== '' && !['unknown', '미확인', '모름', '확인 필요', '기록 없음'].includes(value.trim());
const numberKnown = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const answered = answer => !!answer && (array(answer.values).length > 0 || typeof answer.note === 'string' && !!answer.note.trim());
const answerValues = (state, qid, courseId = '') => array(getAnswer(state, qid, courseId)?.values);
const INTAKE_QUESTIONS = new Set(['Q01', 'Q02', 'Q04', 'Q05', 'Q06', 'Q10', 'Q82']);
const POSITION_QUESTIONS = ['Q12', 'Q21', 'Q55', 'Q59', 'Q61'];
const HELP_QUESTIONS = ['Q16', 'Q26', 'Q30'];
const DEPTH_QUESTIONS = ['Q15', 'Q22'];
const INSTITUTION_QUESTIONS = new Set([...range(38, 54), ...range(68, 80), 'Q92', 'Q93']);
function range(start, end) { return Array.from({ length: end - start + 1 }, (_, i) => `Q${String(start + i).padStart(2, '0')}`); }
function gradeInfo(grade) {
  if (['미취학', 'preschool', '유치원', '어린이집'].includes(grade)) return { stage: 'preschool', gradeNumber: null };
  const match = /^(초|중|고)(?:등(?:학교)?|학교)?\s*([1-6])(?:학년)?$/.exec(String(grade || '').trim());
  if (!match) return { stage: 'unknown', gradeNumber: null };
  const value = Number(match[2]);
  if (match[1] !== '초' && value > 3) return { stage: 'unknown', gradeNumber: null };
  return { stage: match[1] === '초' ? 'elementary' : 'middlehigh', gradeNumber: value, schoolLevel: match[1] === '중' ? 'middle' : match[1] === '고' ? 'high' : 'elementary' };
}

export function surveyContext(state) {
  const profile = state.profile || {};
  const age = ageMonths(profile);
  const school = gradeInfo(profile.grade);
  const calendarReferenceAge = age.precision !== 'unknown' && !age.error
    ? Number(profile.asOf.slice(0, 4)) - Number(profile.birthMonth.slice(0, 4)) + 1 : null;
  let ageGroup = 'unknown';
  if (school.stage === 'elementary') ageGroup = 'elementary';
  else if (school.stage === 'middlehigh') ageGroup = school.schoolLevel;
  else if (school.stage === 'preschool' && calendarReferenceAge !== null) ageGroup = [5, 6].includes(calendarReferenceAge) ? 'preschool_5_6' : calendarReferenceAge === 7 ? 'preschool_7' : 'preschool_other';
  return {
    stage: school.stage, ageGroup, gradeNumber: school.gradeNumber, schoolLevel: school.schoolLevel || null,
    reportedGrade: profile.grade || '', age: copy(age), calendarReferenceAge,
    ageConvention: '원표의 5–7세 표시를 위한 기준연도−출생연도+1; 실제 완료개월수와 별도',
    schoolStageBasis: school.stage === 'unknown' ? 'reported_grade_unknown' : 'reported_grade',
    uncertain: school.stage === 'unknown' || age.precision === 'unknown',
    notes: [
      '가족이 입력한 실제 학년을 질문 순서에 우선 사용합니다. 출생월만으로 학교 재학 단계를 채우지 않습니다.',
      '연령은 질문의 노출 순서와 문안에만 사용하며 높은 과정 입력을 막지 않습니다.',
      ...(age.error ? [age.error] : []),
    ],
  };
}

function relevantCourses(state, qid, courseId) {
  const courses = array(state.courses);
  if (courseId) return courses.filter(course => course.id === courseId);
  const axis = ['Q21', 'Q22', 'Q55', 'Q59'].includes(qid) ? 'curriculum' : ['Q25', 'Q26', 'Q27', 'Q28'].includes(qid) ? 'thinking' : ['Q29', 'Q30', 'Q31'].includes(qid) ? 'arithmetic' : ['Q61', 'Q63', 'Q64'].includes(qid) ? 'science' : null;
  return axis ? courses.filter(course => course.axis === axis) : courses;
}
function everyCourse(courses, condition) { return courses.length > 0 && courses.every(condition); }
function personalRecords(state, courseId) {
  return array(state.records).filter(record => (!courseId || record.courseId === courseId) && !['forwarded_template', 'third_party_case', 'ai_summary', 'institution_notice'].includes(record.evidenceRole));
}

// "모름" is still an answer: a short session must not immediately ask it again.
// Coverage here means the same intake concept was supplied, not mastery verified.
export function questionCovered(state, qid, courseId = '') {
  if (answered(getAnswer(state, qid, courseId))) return true;
  for (const group of [POSITION_QUESTIONS, HELP_QUESTIONS, DEPTH_QUESTIONS]) {
    if (group.includes(qid) && group.some(other => answered(getAnswer(state, other, courseId)))) return true;
  }
  const courses = relevantCourses(state, qid, courseId), goals = state.goals || {}, support = state.support || {};
  const records = personalRecords(state, courseId);
  switch (qid) {
    case 'Q01': return ageMonths(state.profile).precision !== 'unknown' && !!state.profile?.grade;
    case 'Q02': return !!state.profile?.asOf && !!state.profile?.academicYear;
    case 'Q03': return everyCourse(courses, course => textKnown(course.sourceRole));
    case 'Q04': return array(goals.parent).length > 0 || !!state.uiFlow?.quickGoal;
    case 'Q05': return textKnown(goals.child);
    case 'Q06': return textKnown(goals.priority);
    case 'Q07': return array(state.activities).length > 0 && state.activities.every(activity => activity.known !== false && (numberKnown(activity.minutes) || activity.day && activity.start && activity.end)) && support.homeworkKnown === 'yes';
    case 'Q08': return state.uiFlow?.quickGoal === 'maintain' || array(goals.parent).includes('maintain');
    case 'Q10': return courses.length > 0 || ['learning', 'not_started', 'unknown'].includes(state.uiFlow?.studyStatus);
    case 'Q11': return everyCourse(courses, course => textKnown(course.course));
    case 'Q12': return everyCourse(courses, course => textKnown(course.range));
    case 'Q13': return everyCourse(courses, course => course.completion && course.completion !== 'unknown' || ['paused', 'ended'].includes(course.status));
    case 'Q15': case 'Q22': return everyCourse(courses, course => textKnown(course.depth));
    case 'Q16': case 'Q26': case 'Q30': return everyCourse(courses, course => textKnown(course.independence));
    case 'Q18': return records.length > 0 || everyCourse(courses, course => course.sourceRole === 'reviewed_work');
    case 'Q21': case 'Q25': case 'Q29': case 'Q55': case 'Q59': case 'Q61': return everyCourse(courses, course => textKnown(course.course) && textKnown(course.range));
    case 'Q38': return courses.some(course => textKnown(course.cohort) || /(?:프리미어\s*P[1-3]|소마\s*A\d|필즈\s*[SE]\d)/i.test(course.course || ''));
    case 'Q39': return goals.premier === 'none' || goals.premier === 'current' || goals.premier === 'later';
    case 'Q43': return ['grade2', 'grade3', 'later', 'none', 'H_G2', 'H_G3', 'H_NONE'].includes(goals.hwangso);
    case 'Q49': return textKnown(goals.giftedInstitution) && textKnown(goals.giftedField);
    case 'Q60': return textKnown(goals.sciencePurpose);
    case 'Q68': return goals.competitionIntent === 'do_not_enter';
    case 'Q75': return array(goals.schoolTypes).length > 0 || textKnown(goals.institution);
    case 'Q82': return array(support.helpTypes).length > 0 || numberKnown(support.weekdayMinutes) || numberKnown(support.weekendMinutes);
    case 'Q89': return records.some(record => ['diagnostic', 'correction'].includes(record.kind) && !!record.diagnosticState);
    case 'Q90': return records.some(record => ['diagnostic', 'correction'].includes(record.kind) && !!record.firstResponsesState && !!record.attemptKind && !!record.itemValidityState);
    case 'Q91': return everyCourse(courses, course => textKnown(course.sourceRole)) || records.some(record => textKnown(record.evidenceRole));
    case 'Q95': return everyCourse(courses, course => ['whole', 'selected_ranges'].includes(course.coverageIntent));
    case 'Q96': return !!state.activePlanId && array(state.plans).some(plan => plan.id === state.activePlanId && !!plan.status);
    case 'Q100': return courses.some(course => course.axis === 'other');
    case 'Q101': return array(state.activities).length > 0 && state.activities.every(activity => numberKnown(activity.adultMinutes));
    case 'Q102': return !!state.activePlanId;
    default: return false;
  }
}

function interests(state) {
  const goals = state.goals || {}, courses = array(state.courses), focus = state.uiFlow?.selectionFocus;
  const parent = unique([...array(goals.parent), ...answerValues(state, 'Q04')]);
  const parentHas = choices => choices.some(value => parent.includes(value));
  const named = pattern => courses.some(course => pattern.test(course.course || ''));
  const hwangsoNo = ['none', 'H_NONE'].includes(goals.hwangso) || answerValues(state, 'Q43').includes('희망 없음');
  const hwangsoExplicit = ['grade2', 'grade3', 'later', 'H_G2', 'H_G3'].includes(goals.hwangso) || focus === 'hwangso' || parentHas(['황소']) || named(/황소/) || answerValues(state, 'Q43').some(value => ['재원', '신규 지원', '재지원', '편입', '경험만'].includes(value));
  return {
    premier: goals.premier !== 'none' && (['consider', 'current', 'later'].includes(goals.premier) || focus === 'premier' || parentHas(['프리미어/챌린지', '필즈']) || named(/프리미어|챌린지|필즈/)),
    hwangso: !hwangsoNo && hwangsoExplicit,
    hwangsoDetailed: !hwangsoNo && (['grade2', 'grade3', 'H_G2', 'H_G3'].includes(goals.hwangso) || answerValues(state, 'Q43').some(value => ['신규 지원', '재지원', '편입'].includes(value))),
    gifted: goals.gifted === true || focus === 'gifted' || parentHas(['영재원 경험']) || named(/영재원|영재학급|브릿지/),
    science: goals.science === true || courses.some(course => course.axis === 'science'),
    competition: goals.competition === true || parentHas(['경시/KMO']) || named(/KMO|경시/i),
    highSchool: goals.highSchool === true || goals.medical === true || focus === 'highSchool' || array(goals.schoolTypes).some(value => value !== 'undecided') || parentHas(['영재고', '과학고', '자사고', '외고/국제고', '일반고']),
    advancedMath: courses.some(course => course.axis === 'curriculum' && ['middle', 'high'].includes(course.level)) || parentHas(['누테/중등·고등']),
    oldName: courses.some(course => course.axis === 'curriculum' && /수학\s*상|수학\s*하|수Ⅰ|수Ⅱ/.test(course.course || '')),
    timeConcern: array(goals.hwangsoReasons).includes('time_fit') || state.uiFlow?.quickGoal === 'adaptation' || answerValues(state, 'Q08').includes('줄이고 싶음'),
  };
}

function candidates(state, context, mode) {
  const result = [], added = new Set(), flags = interests(state);
  const add = (qid, courseId, concept, priority, reason) => {
    const key = courseId ? `${qid}@${courseId}` : qid;
    if (INTAKE_QUESTIONS.has(qid) || added.has(key) || questionCovered(state, qid, courseId)) return;
    added.add(key); result.push({ key, id: qid, questionId: qid, courseId, concept, priority, reason });
  };
  const young = context.stage === 'preschool' || context.stage === 'unknown';
  const quickProviderAllowed = context.stage === 'elementary' || context.stage === 'middlehigh' || context.ageGroup === 'preschool_7';
  for (const course of array(state.courses)) {
    if (['paused', 'ended'].includes(course.status) || course.completion === 'not_started') continue;
    const prefix = course.course || '기록한 과정';
    // Quick asks three different concepts; details are attached to a real course.
    const detailOrder = young ? [['Q12', 'position'], ['Q16', 'help'], ['Q15', 'depth']] : [['Q12', 'position'], ['Q15', 'depth'], ['Q16', 'help']];
    for (let i = 0; i < detailOrder.length; i++) add(detailOrder[i][0], course.id, detailOrder[i][1], 10 + i * 10, `${prefix}에 아직 기록하지 않은 내용만 짧게 확인합니다.`);
    if (mode === 'more') {
      if (course.axis === 'curriculum' && course.level === 'middle') add('Q55', course.id, 'position', 5, '실제 중등 학습을 입력했으므로 학교 나이와 별도로 현재 범위를 확인합니다.');
      if (course.axis === 'curriculum' && course.level === 'high') add('Q59', course.id, 'position', 5, '실제 고등 과정을 입력했으므로 나이 제한 없이 해당 범위 질문을 엽니다.');
      if (course.axis === 'science') add('Q61', course.id, 'position', 5, '입력한 과학의 실제 범위를 별도로 확인합니다.');
      add('Q95', course.id, 'coverage', 45, '전체 학습과 발췌 학습을 구분할 때 필요한 항목입니다.');
      if (course.completion === 'reported_done' || course.completion === 'reviewed_done') add('Q89', course.id, 'diagnostic', 50, '완료 보고와 진단 여부는 별도이므로 모르는 부분만 확인합니다.');
      if (personalRecords(state, course.id).some(record => record.kind === 'diagnostic' || record.kind === 'correction')) add('Q90', course.id, 'assessment_context', 52, '이미 기록한 평가의 첫 풀이·재풀이 정보를 확인합니다.');
    }
  }
  if (flags.premier && (mode === 'more' || quickProviderAllowed)) add('Q39', '', 'premier_intent', 8, '프리미어·필즈에 직접 관심을 표시한 경우에만 묻습니다.');
  if (flags.hwangso && (mode === 'more' || context.stage === 'elementary' || context.stage === 'middlehigh')) add('Q43', '', 'hwangso_intent', 8, '황소에 관심을 표시했으므로 우선 현재 의사 하나만 확인합니다. 선택 이유를 모두 요구하지 않습니다.');
  if (mode === 'more') {
    if (flags.premier && answered(getAnswer(state, 'Q39')) && state.goals?.premier !== 'later') add('Q40', '', 'premier_notice', 65, '구체적인 선택 의사를 밝힌 뒤 해당 회차 안내를 확인합니다.');
    if (flags.hwangsoDetailed) add('Q45', '', 'hwangso_notice', 60, '지원·재지원 등 직접 고른 의사가 있을 때만 실제 회차를 확인합니다.');
    if (flags.gifted) {
      add('Q49', '', 'gifted_interest', 55, '영재원에 직접 관심을 표시해 기관·분야부터 확인합니다.');
      if (questionCovered(state, 'Q49')) add('Q50', '', 'gifted_notice', 65, '선택한 영재원 기관의 해당 학년도 조건을 따로 확인합니다.');
    }
    if (flags.science) add('Q60', '', 'science_goal', 55, '과학에 대한 실제 관심·학습이 있어 목적을 확인합니다.');
    if (flags.competition) {
      add('Q68', '', 'competition_intent', 55, '경시 자료 학습과 실제 대회 응시를 구분합니다.');
      if (state.goals?.competitionIntent === 'enter') add('Q69', '', 'competition_notice', 65, '직접 대회 응시를 고려한다고 밝힌 경우의 질문입니다.');
    }
    // Gifted-center interest alone never opens high-school choice questions.
    if (flags.highSchool) {
      add('Q75', '', 'school_goal', 55, '고등학교 선택에 직접 관심을 표시한 경우에만 묻습니다.');
      if (questionCovered(state, 'Q75')) add('Q77', '', 'school_notice', 65, '직접 선택한 학교 유형의 해당 학년도 조건을 확인합니다.');
    }
    if (flags.oldName) add('Q24', '', 'edition_mapping', 58, '직접 입력한 구 교과명을 현재 과정으로 임의 치환하지 않기 위한 질문입니다.');
    if (flags.advancedMath && !array(state.courses).some(course => course.axis === 'curriculum' && ['middle', 'high'].includes(course.level))) add('Q55', '', 'position', 40, '중등·고등 학습에 명시적 관심이 있어 시작 전·실제 진도를 구분합니다.');
    if (flags.timeConcern && array(state.courses).length) add('Q07', '', 'actual_time', 55, '지원 가능 시간과 별도로 실제 활동 시간의 미확인 내용을 확인합니다.');
  }
  return result.sort((a, b) => a.priority - b.priority || a.key.localeCompare(b.key, 'ko'));
}

function shortPresentation(item, question, state, context, mode) {
  let prompt = question.prompt, answerOptions = copy(question.answer_options || []);
  if (mode !== 'all') {
    const prompts = {
      Q12: '지금 배우는 범위는 어디까지인가요?',
      Q15: '이 범위를 어느 정도 깊이로 배웠나요?',
      Q16: '요즘 문제를 풀 때 어느 정도 도움이 필요한가요?',
      Q39: '프리미어·필즈에서는 무엇을 비교할까요?',
      Q43: '황소 초등은 어떤 방향으로 생각하고 있나요?',
    };
    prompt = prompts[item.id] || prompt;
    if (item.id === 'Q39') answerOptions = answerOptions.filter(option => ['현재 반 유지', '프리미어/챌린지 지원', '필즈 지원', '미정'].includes(option));
    if (item.id === 'Q43') answerOptions = answerOptions.filter(option => ['재원', '신규 지원', '희망 없음', '미정'].includes(option));
    const course = array(state.courses).find(entry => entry.id === item.courseId);
    if (item.id === 'Q15' && context.stage === 'preschool' && !['middle', 'high'].includes(course?.level)) answerOptions = answerOptions.filter(option => !['서술·증명', '경시 유형'].includes(option));
  }
  return {
    ...item, prompt, answerOptions,
    sourcePrompt: question.prompt, sourceAnswerOptions: copy(question.answer_options || []),
    sourceIds: copy(question.source_ids || []), module: question.module,
    courseLabel: array(state.courses).find(course => course.id === item.courseId)?.course || '',
    covered: questionCovered(state, item.id, item.courseId),
  };
}

/**
 * Render `next` only. Keep returned batchKeys for the current short session;
 * passing those keys back prevents automatic replenishment after every answer.
 * Request mode:'more' without batchKeys only when the family asks for more.
 * mode:'all' is the explicit advanced option and returns the original 104 items.
 */
export function buildSurveyQueue(state, catalog, options = {}) {
  const mode = ['quick', 'more', 'all'].includes(options.mode) ? options.mode : 'quick';
  const context = surveyContext(state), sourceQuestions = array(catalog?.questions);
  const questionMap = new Map(sourceQuestions.map(question => [question.id, question]));
  const branchesFor = qid => array(catalog?.branches).filter(branch => array(branch.question_ids).includes(qid)).map(branch => branch.id);
  const dismissed = new Set(array(options.dismissedKeys));
  const notes = ['한 번에 다음 질문 하나만 보여 주세요. 모름·나중 확인도 답변으로 남기며 같은 짧은 확인에서 다시 묻지 않습니다.'];
  let available;
  if (mode === 'all') {
    available = sourceQuestions.map(question => ({ key: question.id, id: question.id, questionId: question.id, courseId: '', concept: question.module || question.id, reason: '가족이 직접 연 전체 질문 탐색입니다.' }));
  } else {
    available = candidates(state, context, mode).filter(item => questionMap.has(item.id) && !dismissed.has(item.key));
    // Preserve a single question per concept/course; Q55 and Q12 can describe
    // the same entered middle-school scope, so never ask both in one queue.
    const seenConcepts = new Set();
    available = available.filter(item => {
      const conceptKey = `${item.concept}@${item.courseId}`;
      if (seenConcepts.has(conceptKey)) return false;
      seenConcepts.add(conceptKey); return true;
    });
  }
  const requestedLimit = Number.isInteger(options.limit) && options.limit >= 0 ? options.limit : 3;
  const limit = mode === 'quick' ? Math.min(3, requestedLimit) : Math.min(104, requestedLimit);
  let selected, batchKeys;
  if (mode === 'all') { selected = available; batchKeys = available.map(item => item.key); }
  else if (Array.isArray(options.batchKeys)) {
    batchKeys = unique(options.batchKeys.filter(key => typeof key === 'string'));
    const byKey = new Map(available.map(item => [item.key, item]));
    selected = batchKeys.map(key => byKey.get(key)).filter(Boolean).slice(0, limit);
  } else {
    const concepts = new Set();
    selected = available.filter(item => {
      if (mode === 'quick' && concepts.has(item.concept)) return false;
      concepts.add(item.concept); return true;
    }).slice(0, limit);
    batchKeys = selected.map(item => item.key);
  }
  const items = selected.map(item => ({ ...shortPresentation(item, questionMap.get(item.id), state, context, mode), branchIds: branchesFor(item.id) }));
  const remainingCount = Math.max(0, available.length - items.length);
  if (mode === 'quick') notes.push('빠른 추가 확인은 필요한 질문만 0~3개이며, 세 개를 채우기 위해 질문을 만들지 않습니다.');
  if (mode !== 'all') notes.push('나중 단계의 질문은 명시한 관심 또는 실제 과정이 있을 때 더 보기에서 엽니다. 전체 104개는 고급 선택으로 직접 볼 수 있습니다.');
  return { context, mode, items, next: items[0] || null, batchKeys, remainingCount, totalRelevantCount: available.length, hasMore: remainingCount > 0, notes };
}
