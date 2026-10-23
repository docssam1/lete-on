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
  /* 2026-10-15: maintain current workload and observe first. This supersedes
   * the 10-04 score/goal-based starting-multiplier policy. Historical results
   * stay unchanged; no function here awards mastery or predicts admission. */
  const MULTS = [0.7, 0.85, 1, 1.25, 1.5];
  function autoPlan(result, selection, current) {
    if (!result || !result.bands) throw new Error('Diagnosis result is required');
    const config = normalize(selection), b = result.bands;
    const prev = (b.previous && b.previous.correct) || 0, cur = (b.current && b.current.correct) || 0;
    /* Supersedes the 10-04 automatic adjustment: the 10-15 decision requires
       observation before any increase. O/X is not a measure of learning speed. */
    const speed = current && MULTS.includes(current.speed) ? current.speed : 1;
    const amount = current && MULTS.includes(current.amount) ? current.amount : 1;
    const reasons = [];
    reasons.push(text('진단 직후에는 지금의 속도와 분량을 유지합니다.', 'Keep the current pace and amount immediately after this check.', '测评后先保持当前速度与分量。'));
    reasons.push(text('완료한 학습, 정확도, 반복되는 오답과 실제 걸린 시간을 관찰한 뒤 조금씩 조정합니다.', 'Observe completed study, accuracy, recurring errors and actual study time before gradual changes.', '观察完成的学习、准确率、重复错题和实际用时，再逐步调整。'));
    return { version: 'observe-plan-v2', goal: config.goal, cadence: current && ['w1','w2'].includes(current.cadence) ? current.cadence : config.cadence, preferredCadence:config.cadence, speed, amount, basis: 'observe', applied: false,
      evidence: { previous: prev, current: cur }, reasons,
      note: text('점수만으로 학습시간이나 횟수를 늘리지 않습니다. 관찰 기록이 없으면 목표 도달일은 아직 계산하지 않습니다.', 'Scores alone do not increase study time or frequency. Without observation records, no target arrival date is calculated.', '不会只凭分数增加学习时间或次数。没有观察记录，暂不计算目标到达日期。') };
  }
  // Existing grade-entry anchors, not semester mastery or admission standards.
  const gradeStarts = { e1:'c1', e2:'c3', e3:'c8', e4:'c13', e5:'c19', e6:'c22', m1:'c29', m2:'c32', m3:'c35', h1:'c38', h2:'c41', h3:'c45' };
  function startingPoint(selection) {
    const s = selection || {};
    if (s.route === 'unlearned') return 'f-count5';
    if (s.route === 'school') return gradeStarts[s.grade] || null;
    if (s.route === 'book') {
      const rows=Array.isArray(s.completedBooks)&&s.completedBooks.length?s.completedBooks:[s];
      if(rows.length!==1)return null;
      const row=rows[0];
      const book=W.NM_PLACEMENT_BOOKS&&W.NM_PLACEMENT_BOOKS.resolve(row.series,row.step,s.progress,row.editionId);
      return book&&book.baselineId||null;
    }
    if (s.route !== 'age') return null;
    const age = Number(String(s.age || '').replace(/^pre/, ''));
    if (!Number.isInteger(age) || age < 4 || age > 19) return null;
    if(s.grade==='pre'&&age>=8)return 'f-count5';
    if(s.grade&&s.grade!=='pre')return gradeStarts[s.grade]||null;
    // A conservative candidate only. Every earlier foundation remains selectable.
    if (age <= 5) return 'f-count5';
    if (age === 6) return 'f-split5';
    if (age === 7) return 'f-ten10';
    const grades = ['e1','e2','e3','e4','e5','e6','m1','m2','m3','h1','h2','h3'];
    return gradeStarts[grades[Math.min(age - 8, grades.length - 1)]];
  }
  function paperAnalysis(plan, marks, selection) {
    if (!plan || !Array.isArray(plan.items) || !Array.isArray(marks) || marks.length !== 20 || Array.from(marks).some(x => !['o','x','n',''].includes(x)))
      throw new Error('Invalid paper marks');
    const responses = plan.items.map((it, i) => ({ id:it.id, skipped:marks[i]==='n'||marks[i]==='',
      value:marks[i]==='o'?clone(it.answer):null, validationFlags:{validTargets:true} }));
    const result = W.NM_PLACEMENT_PLAN.summarize(plan, responses);
    const notLearned = {previous:0,current:0,next:0};
    plan.items.forEach((it,i)=>{ if(marks[i]==='n') notLearned[it.band]++; });
    return { result, path:recommend(plan,result,selection), notLearned, workload:autoPlan(result,selection),
      comment:text('이전·현재의 X는 보강 후보입니다. 모르는 내용은 함께 살펴보고 다시 확인합니다. 다음 진도의 X만으로 현재 진도 부족을 판단하지 않습니다.',
        'Earlier/current X marks suggest focused practice. Explore unknown content together before rechecking. Next-stage X marks alone do not show a current-stage gap.',
        '此前与当前的错题是补充练习候选。不会的内容一起学习后再确认，不仅凭后续题的错答判断当前进度不足。'),
      limitation:text('O/X만으로 풀이 속도나 틀린 원인을 알 수 없습니다.', 'O/X marks alone cannot reveal solution speed or error causes.', '仅凭对错无法判断解题速度或错误原因。') };
  }
  const api = { goals: clone(goals), targets: clone(targets), normalize, recommend, autoPlan, startingPoint, paperAnalysis };
  W.NM_PLACEMENT_PATHS = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
