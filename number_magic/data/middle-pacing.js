/* 중등 진도 보기 — 정규 과정 C29~C37 에서 **계산해 만드는 보기**(2026-09-25 통합).
 *
 * 2026-09-24 에 이 파일은 학년별 14회·42회의 별도 편성이었다. 정규 과정(C29~C37, 113회)과
 * 같은 중등 내용을 두 벌의 진도표가 서로 다른 주차로 안내했다. 원장 결정: 정본은 유아부터
 * 이어지는 C0~C37 하나. 그래서 이 파일은 더 이상 편성을 갖지 않는다 — NM_COURSES 의 회차를
 * 학년(middle1~3)별로 모아 옛 화면·인쇄 API 모양으로 돌려줄 뿐이다.
 *
 * 옛 편성에만 있던 것은 정규 과정으로 옮겼다(data/courses.js): 소인수분해·최대공약수(DV8·DV7 → C29),
 * MD11@4(C32), MD64@4(C33), 제곱근 대소 MD15@4~6(C35), 그래프 직접 그리기 4종(C31 정비례·반비례,
 * C34 일차함수, C37 이차함수 — 적용 칸).
 *
 * 옛 회차 번호(M1-S01 ~ M3-S14)는 저장·URL 어디에도 없었지만, 화면 버튼과 NM_EXAM.openMiddlePacing
 * 이 받던 값이라 계속 받는다 — 그 회차의 첫 블록 유형·레벨이 실린 정규 회차로 연결한다.
 * NM_COURSES 는 이 파일보다 늦게 실리므로 처음 읽을 때 만든다.
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
  let cache = null;
  function build(){
    const C = w.NM_COURSES;
    if(!C) return {};
    const grades = {};
    Object.keys(GRADES).forEach(g => {
      const G = GRADES[g], sessions = [];
      G.courses.forEach(key => {
        const course = C[key];
        if(!course) return;
        course.sessions.forEach((ss, i) => {
          if(ss.test) return;
          const idx = sessions.length;
          const blocks = [
            ...(ss.school || []).map(d => blockOf(d, d.review ? 'review' : 'practice')),
            ...((ss.strategy && ss.strategy.practice) || []).map(d => blockOf(d, 'creative')),
            ...(ss.application || []).filter(a => a.from !== 'school').map(d => blockOf(d, 'application'))
          ];
          sessions.push({
            id:`${key}-S${String(i + 1).padStart(2, '0')}`, course:key, sessionIndex:i,
            title:(ss.school || []).filter(d => !d.review).map(d => name(d.t)).join(' · ') || name(blocks[0] && blocks[0].t),
            week:Math.floor(idx / 2) + 1, day:idx % 2 + 1,
            minutes:ss.minutes || null, timeNote:`약 ${ss.minutes || 30}분 · 교과 → 창의 → 적용`,
            checkpoint:false, blocks
          });
        });
      });
      grades[g] = { grade:+g, tier:G.tier, courseKeys:G.courses.slice(),
        title:`중${g} 연산 — 정규 과정 ${G.courses.join('·')}`,
        scope:G.courses.map(k => C[k] && C[k].title && C[k].title.ko).filter(Boolean).join(' / '),
        weeks:Math.ceil(sessions.length / 2), notes:[], supplementary:[], sessions };
    });
    return grades;
  }
  function grades(){ if(!cache || !Object.keys(cache).length) cache = build(); return cache; }
  w.NM_MIDDLE_PACING = {
    version:'2026-09-25-derived', derivedFrom:'NM_COURSES', sessionsPerWeek:2,
    get grades(){ return grades(); },
    getSession(grade, id){
      const plan = grades()[grade];
      if(!plan) return null;
      const hit = plan.sessions.find(s => s.id === id);
      if(hit || !LEGACY[id]) return hit || null;
      const [t, lv] = LEGACY[id].split('@'), L = +lv;
      return plan.sessions.find(s => s.blocks.some(b => b.t === t && b.lv === L))
        || plan.sessions.find(s => s.blocks.some(b => b.t === t)) || plan.sessions[0] || null;
    },
    legacyIds:Object.keys(LEGACY)
  };
})(window);
