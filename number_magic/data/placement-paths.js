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
  /* ── 자동 편성(2026-10-04, 원장 "자동 편성을 하고 그 이후 수동 조절 가능하도록") ──
     진단 결과 + 고른 목표 → 로드맵의 '속도'·'양' 시작값. 이 값은 **처음 맞춰 두는 값**이고, 로드맵의 '속도 · 양 조절'에서
     언제든 직접 바꾼다(바꾸면 그 뒤 새 진단이 덮어쓰지 않고 제안만 한다).
     · 목표 기본값: 교과=속도 1·양 1 / 소마·필즈=양 1.25(수를 바꾸고 조건을 읽는 연습을 더) / 이과 최상위=속도 1.25(선수 연산을 먼저).
     · 진단 보정(이전 6·현재 10 의 맞힌 수만 본다. 다음 4문항은 승급 근거로 쓰지 않는다):
         안정(이전 ≥5 그리고 현재 ≥9) → 속도 한 칸 위로 / 흔들림(현재 ≤5 또는 이전 ≤3) → 속도 한 칸 아래로 + 양 한 칸 위로.
       모름은 맞힌 것으로 세지 않는다. 한 문제 실수로 크게 움직이지 않게 한 칸씩만, 속도는 0.85~1.5 안에서만 움직인다.
     · 숫자는 설계 시작값이며 실제 학습 기록으로 검증한 것이 아니다. 합격·숙달·도달 시점을 뜻하지 않는다. */
  const MULTS = [0.7, 0.85, 1, 1.25, 1.5];
  const step = (v, d, lo, hi) => MULTS[Math.max(MULTS.indexOf(lo), Math.min(MULTS.indexOf(hi), MULTS.indexOf(v) + d))];
  function autoPlan(result, selection) {
    if (!result || !result.bands) throw new Error('Diagnosis result is required');
    const config = normalize(selection), b = result.bands;
    const prev = (b.previous && b.previous.correct) || 0, cur = (b.current && b.current.correct) || 0;
    let speed = 1, amount = 1;
    const reasons = [];
    if (config.goal === 'competition') { amount = 1.25; reasons.push(text('소마·필즈 목표: 수를 바꾸고 조건을 읽는 연습을 조금 더 하도록 양을 1.25배로 시작해요.', 'SOMA/Fields goal: start with 1.25× amount for more number-restructuring and condition-reading practice.', '目标为SOMA/Fields：分量从1.25倍开始，多练换数计算和读条件。')); }
    else if (config.goal === 'science') { speed = 1.25; reasons.push(text('이과 최상위권 준비: 다음 교과에 필요한 선수 연산을 먼저 만나도록 속도를 1.25배로 시작해요.', 'Advanced science-math prep: start at 1.25× speed so prerequisite arithmetic arrives sooner.', '理科高阶准备：速度从1.25倍开始，先接触后续所需的先修运算。')); }
    else reasons.push(text('탄탄한 교과 학습: 정해 둔 편성 그대로(속도 1배·양 1배)로 시작해요.', 'Strong school foundation: start with the set plan (1× speed, 1× amount).', '扎实的学校学习：按既定安排（速度1倍、分量1倍）开始。'));
    let basis = 'goal';
    if (prev >= 5 && cur >= 9) {
      speed = step(speed, 1, 0.85, 1.5); basis = 'stable';
      reasons.push(text('이전 ' + prev + '/6 · 현재 ' + cur + '/10으로 안정적이라 속도를 한 칸 올렸어요.', 'Earlier ' + prev + '/6 and current ' + cur + '/10 look steady, so speed moves up one step.', '之前' + prev + '/6、现在' + cur + '/10较稳定，速度上调一档。'));
    } else if (cur <= 5 || prev <= 3) {
      speed = step(speed, -1, 0.85, 1.5); amount = step(amount, 1, 1, 1.5); basis = 'shaky';
      reasons.push(text('이전 ' + prev + '/6 · 현재 ' + cur + '/10이라 속도는 한 칸 낮추고 양은 한 칸 늘려 더 많이 연습하도록 했어요.', 'Earlier ' + prev + '/6 and current ' + cur + '/10: speed moves down one step and amount up one step for more practice.', '之前' + prev + '/6、现在' + cur + '/10：速度下调一档、分量上调一档，多做练习。'));
    } else reasons.push(text('이전 ' + prev + '/6 · 현재 ' + cur + '/10이라 목표 기본값을 그대로 둬요.', 'Earlier ' + prev + '/6 and current ' + cur + '/10: keep the goal default.', '之前' + prev + '/6、现在' + cur + '/10：保持目标默认值。'));
    return { version: 'auto-plan-v1', goal: config.goal, cadence: config.cadence, speed, amount, basis, evidence: { previous: prev, current: cur }, reasons,
      note: text('처음 맞춰 둔 값이에요. ‘속도 · 양 조절’에서 언제든 바꿀 수 있고, 정답이나 합격을 뜻하지 않아요.', 'These are starting values. Change them any time under “Speed · amount”; they do not predict results or admission.', '这是起始值，可随时在“速度 · 分量”中修改；不代表结果或录取。') };
  }
  const api = { goals: clone(goals), targets: clone(targets), normalize, recommend, autoPlan };
  W.NM_PLACEMENT_PATHS = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
