/* Goal-aware guidance over the existing diagnosis. Does not generate questions,
 * change scores, mark mastery, or copy an external school's curriculum. */
(function () {
  'use strict';
  const W = typeof window !== 'undefined' ? window : globalThis;
  const text = (ko, en, zh) => ({ ko, en, zh });
  const clone = value => JSON.parse(JSON.stringify(value));
  const goals = [
    { id: 'curriculum', label: text('탄탄한 교과 학습을 위한 연산', 'Arithmetic for a strong school-math foundation', '为扎实的学校数学学习打好运算基础'),
      direction: text('개념을 이해하고 정확하게 계산한 뒤, 교과 문장제에 적용합니다.', 'Understand the concept, calculate accurately, then apply it to school word problems.', '理解概念、准确计算，再应用于学校文字题。'),
      focus: text('개념 확인 · 교과 연산 · 수 구조를 보는 창의 연산 · 문장제 적용', 'Concept checks · school arithmetic · creative number structure · word-problem application', '概念确认 · 学校运算 · 创意数结构 · 文字题应用') },
    { id: 'competition', label: text('소마·필즈 목표 진도에 맞춘 연산', 'Arithmetic aligned with a SOMA or Fields progress goal', '配合SOMA或Fields目标进度的运算'),
      direction: text('목표 진도에 필요한 연산과 함께 수 구조·조건 해석·문장제 연결을 연습합니다.', 'Practice the arithmetic needed for your goal alongside number structure, interpreting conditions, and word problems.', '练习目标进度所需的运算，同时训练数结构、条件理解与文字题。'),
      focus: text('정확한 교과 연산 · 수를 바꾸어 계산하기 · 조건 읽기 · 식 세우기', 'Accurate school arithmetic · restructuring numbers · reading conditions · forming expressions', '准确的学校运算 · 变换数进行计算 · 读懂条件 · 列式') },
    { id: 'science', label: text('이과 최상위권 진도를 준비하는 연산', 'Arithmetic preparation for an advanced science-math pathway', '为理科高阶数学进度准备的运算'),
      direction: text('다음 교과를 이해하는 데 필요한 선수 연산부터 준비합니다. 빠르기보다 개념과 정확성을 먼저 확인합니다.', 'Prepare the prerequisite arithmetic for the next school topics. Check concepts and accuracy before increasing pace.', '先准备理解下一阶段课程所需的运算基础。提高速度前，确认概念与准确性。'),
      focus: text('수 감각과 정확성 · 분수와 비례 · 문자식과 방정식 · 문장제의 수학적 표현', 'Number sense and accuracy · fractions and proportion · algebra and equations · mathematical expression of word problems', '数感与准确性 · 分数与比例 · 代数式与方程 · 文字题的数学表达') }
  ];
  const targets = [
    { id: 'soma-a', label: text('소마 A 진도', 'SOMA A progress', 'SOMA A进度') },
    { id: 'fields-e1', label: text('필즈 E1 진도', 'Fields E1 progress', 'Fields E1进度') },
    { id: 'fields-s', label: text('필즈 S 진도', 'Fields S progress', 'Fields S进度') },
    { id: 'premier', label: text('프리미어 진도', 'Premier progress', 'Premier进度') }
  ];
  function normalize(selection) {
    const s = selection || {};
    const goal = goals.some(x => x.id === s.goal) ? s.goal : 'curriculum';
    return { goal, goalTarget: goal === 'competition' && targets.some(x => x.id === s.goalTarget) ? s.goalTarget : '',
      cadence: s.cadence === 'w1' ? 'w1' : 'w2' };
  }
  function recommend(plan, result, selection) {
    if (!plan || !plan.baseline || !result || !Array.isArray(result.profile)) throw new Error('Diagnosis evidence is required');
    const config = normalize(selection), goal = goals.find(x => x.id === config.goal);
    const stages = W.NM_PLACEMENT_PLAN.stages(), at = stages.findIndex(x => x.id === plan.baseline.id);
    if (at < 0) throw new Error('Unknown source stage');
    const baseline = stages[at], supports = new Map();
    for (const p of result.profile) {
      if (p.band === 'next' || (p.ok !== false && !p.skipped)) continue;
      const item = plan.items.find(x => x.id === p.id);
      if (!item || (item.band !== 'previous' && item.band !== 'current')) continue;
      const key = [item.stageId, item.thread, item.level].join(':');
      if (!supports.has(key)) supports.set(key, { stageId: item.stageId, label: clone(item.stageLabel || stages.find(x => x.id === item.stageId).label),
        course: item.course, session: item.session, t: item.thread, lv: item.level, wrong: 0, skipped: 0 });
      const row = supports.get(key);
      if (p.skipped) row.skipped++; else row.wrong++;
    }
    const support = Array.from(supports.values()).map(row => Object.assign(row, { kind: row.wrong ? 'practice' : 'recheck' }));
    const next = stages[at + 1];
    const activities = [];
    plan.items.filter(x=>x.band==='current').forEach(item=>{
      const ref={course:item.course,session:item.session,t:item.thread,lv:item.level};
      if(!activities.some(x=>JSON.stringify(x)===JSON.stringify(ref)))activities.push(ref);
    });
    return { version: 'goal-path-v1', config, goal: clone(goal),
      target: config.goalTarget ? clone(targets.find(x => x.id === config.goalTarget)) : null,
      main: { stageId: baseline.id, course: baseline.course, session: baseline.kind === 'foundation' ? 1 : baseline.session,
        label: clone(baseline.label), status: 'selected-not-certified', practiceSessions: activities },
      support, next: next ? { stageId: next.id, course: next.course, session: next.kind === 'foundation' ? 1 : next.session,
        label: clone(next.label), status: 'preview-not-advancement' } : null,
      assessment: { answered: result.profile.filter(x => !x.skipped).length, correct: result.correct, asked: result.asked,
        admissionReadiness: 'not-assessed', languageReadiness: 'not-assessed' },
      schedule: { cadence: config.cadence, weeks: null, targetMapping: config.goal === 'curriculum' ? 'not-applicable' : 'pending',
        reason: text('실제 학습 속도와 보강량을 확인한 뒤 기간을 조정합니다.', 'Adjust the timeline after observing learning pace and practice needs.', '确认实际学习速度和补充练习量后，再调整周期。') } };
  }
  const api = { goals: clone(goals), targets: clone(targets), normalize, recommend };
  W.NM_PLACEMENT_PATHS = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
