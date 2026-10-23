/* 중등 진도 보기: 정규 과정 C29~C37의 원본 회차를 학년별 20묶음으로 모은다.
 * 주 1회는 20주, 주 2회는 같은 20묶음을 10주에 배운다.
 * 원본 Cxx-Sxx와 M1-S01~M3-S14 호출은 종전 원본 회차로 연결한다.
 * NM_COURSES 및 studyPlan은 이 파일보다 늦게 실리므로 처음 읽을 때 만든다.
 */
(function (w) {
  'use strict';
  const GRADES = { 1:{ tier:'middle1', courses:['C29','C30','C31'] },
                   2:{ tier:'middle2', courses:['C32','C33','C34'] },
                   3:{ tier:'middle3', courses:['C35','C36','C37'] } };
  /* 옛 편성 회차의 첫 블록 — 이것이 실린 정규 회차로 옛 번호를 잇는다 */
  const LEGACY = {
    'M1-S01':'DV8@1','M1-S02':'DV7@2','M1-S03':'MD82@1','M1-S04':'MD1@3','M1-S05':'MD2@2','M1-S06':'MD4@4','M1-S07':'MD47@2',
    'M1-S08':'MD49@3','M1-S09':'MD50@1','M1-S10':'MD50@3','M1-S11':'MD70@2','M1-S12':'MD68@1','M1-S13':'MD69@2','M1-S14':'MD7@3',
    'M2-S01':'MD8@2','M2-S02':'MD9@3','M2-S03':'MD10@1','M2-S04':'MD10@5','M2-S05':'MD12@4','M2-S06':'MD64@4','M2-S07':'MD71@1',
    'M2-S08':'MD63@2','M2-S09':'MD63@3','M2-S10':'MD72@2','M2-S11':'MD73@1','M2-S12':'MD74@2','M2-S13':'MD65@3','M2-S14':'MD75@2',
    'M3-S01':'MD15@1','M3-S02':'MD15@5','M3-S03':'MD17@3','M3-S04':'MD83@4','M3-S05':'MD19@2','M3-S06':'MD19@4','M3-S07':'MD20@5',
    'M3-S08':'MD20@2','M3-S09':'MD66@1','M3-S10':'MD66@3','M3-S11':'MD77@1','M3-S12':'MD78@4','M3-S13':'MD67@2','M3-S14':'MD80@1'
  };
  const name = t => { const th = (w.NM_THREADS || {})[t]; return th ? (th.name.ko || t) : t; };
  const blockOf = (d, role) => d.kind === 'drawing'
    ? { kind:'drawing', mode:d.mode, n:d.count || 6, role:'graph-drawing', title:(d.title && d.title.ko) || '그래프 직접 그리기' }
    : { t:d.t, lv:d.lv, n:d.count || d.n, role };
  const blocksOf=ss=>ss.test?(ss.pool||[]).map(d=>blockOf(d,'check')):[
    ...(ss.school || []).map(d=>blockOf(d,d.review?'review':'practice')),
    ...((ss.strategy && ss.strategy.practice) || []).map(d=>blockOf(d,'creative')),
    ...(ss.application || []).filter(a=>a.from!=='school').map(d=>blockOf(d,'application')),
    ...(ss.stretch||[]).map(d=>blockOf(d,'stretch'))
  ];
  let cache = null, cacheSource = '';
  function build(){
    const C = w.NM_COURSES;
    if(!C) return {};
    const grades = {};
    Object.keys(GRADES).forEach(g => {
      const G = GRADES[g], sessions = [], legacySessions=[];
      G.courses.forEach(key => {
        const course = C[key];
        if(!course) return;
        course.sessions.forEach((ss, i) => {
          if(ss.test) return;
          const idx = legacySessions.length, blocks=blocksOf(ss);
          legacySessions.push({
            id:`${key}-S${String(i + 1).padStart(2, '0')}`, course:key, sessionIndex:i,
            title:(ss.school || []).filter(d => !d.review).map(d => name(d.t)).join(' · ') || name(blocks[0] && blocks[0].t),
            week:Math.floor(idx / 2) + 1, day:idx % 2 + 1,
            minutes:ss.minutes || null, timeNote:`약 ${ss.minutes || 30}분 · 교과 → 창의 → 적용`,
            checkpoint:false, blocks
          });
        });
        const lessons=course.studyPlan&&course.studyPlan.lessons;
        if(!lessons)return;
        lessons.forEach(lesson=>{
          const idx=sessions.length, source=lesson.sourceIndices.map(i=>course.sessions[i]);
          const blocks=source.flatMap(blocksOf).concat((lesson.extraPractice||[]).map(d=>blockOf(d,'practice')));
          sessions.push({id:`${key}-B${String(lesson.index+1).padStart(2,'0')}`,bundle:true,
            course:key,lessonIndex:lesson.index,sessionIndex:lesson.startSession-1,
            sourceIndices:lesson.sourceIndices.slice(),extraPractice:(lesson.extraPractice||[]).map(d=>({...d})),
            title:(course.title&&course.title.ko)||key,
            week:Math.floor(idx/2)+1,day:idx%2+1,standardWeek:idx+1,
            minutes:lesson.minutes,estimatedMinutes:lesson.estimatedMinutes,
            timeNote:`예상 약 ${Math.round(lesson.estimatedMinutes??lesson.minutes)}분 · 교과 → 독셈 → 적용${source.some(s=>s.test)?' · 과정 확인':''}`,
            checkpoint:source.some(s=>s.test),blocks});
        });
      });
      grades[g] = { grade:+g, tier:G.tier, courseKeys:G.courses.slice(),
        title:`중${g} 연산 — 정규 과정 ${G.courses.join('·')}`,
        scope:G.courses.map(k => C[k] && C[k].title && C[k].title.ko).filter(Boolean).join(' / '),
        weeks:Math.ceil(sessions.length/2),weeksStandard:sessions.length,weeksAccelerated:Math.ceil(sessions.length/2),
        notes:['표준과 속진은 같은 학습 묶음의 주당 횟수 차이입니다.'],supplementary:[],sessions,legacySessions };
    });
    return grades;
  }
  function grades(){
    const C=w.NM_COURSES||{};
    const source=Object.values(GRADES).flatMap(g=>g.courses).map(k=>C[k]?.studyPlan?.version+':'+(C[k]?.studyPlan?.lessons||[]).length).join('|');
    if(!cache||source!==cacheSource){cache=build();cacheSource=source;}
    return cache;
  }
  w.NM_MIDDLE_PACING = {
    version:'20261023-middle25', derivedFrom:'NM_COURSES', sessionsPerWeek:2,
    get grades(){ return grades(); },
    getSession(grade, id){
      const plan = grades()[grade];
      if(!plan) return null;
      const hit = plan.sessions.concat(plan.legacySessions).find(s => s.id === id);
      if(hit || !LEGACY[id]) return hit || null;
      const [t, lv] = LEGACY[id].split('@'), L = +lv;
      return plan.legacySessions.find(s => s.blocks.some(b => b.t === t && b.lv === L))
        || plan.legacySessions.find(s => s.blocks.some(b => b.t === t)) || plan.legacySessions[0] || null;
    },
    legacyIds:Object.keys(LEGACY)
  };
})(window);
