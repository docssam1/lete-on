(function (root) {
  'use strict';
  // Admission information is separate from released mocks and pass decisions.
  // These references identify courses, not current vacancies or a live booking.
  const blog = (name, post) => 'https://blog.naver.com/' + name + '/' + post;
  const ED = blog('edenmath', '223377125950');
  const FAQ = blog('edenmath', '223377125157');
  const ED_CLASSES = blog('edenmath', '224408371284');
  const DP_ZERO = blog('dpmath', '224426268104');
  const DP_MIDDLE = blog('dpmath', '224407474293');
  const WM_ALGEBRA = blog('wonmath563', '224440523829');
  const records = {
    'DP:middle1': { pattern: '중1.*(?:입학|시작|신규)|중1-1', links: [] },
    'DP:common1-basic': { pattern: '공(?:통수학|수)\\s*1\\s*기본', entryScope: '중2·중3 전 과정', links: [
      { label: '중등관 모집·입반 안내', url: DP_MIDDLE, note: '대치 중등관 · 12월 개강 · 시험 150분' },
      { label: '제로관 모집·입반 안내', url: DP_ZERO, note: '대치 제로관 · 12월 개강 · 기본과정 시험 120분' }
    ] },
    'DP:common2-basic': { pattern: '공(?:통수학|수)\\s*2\\s*기본', links: [{ label: '제로관 모집·입반 안내', url: DP_ZERO, note: '대치 제로관 · 기본과정 시험 120분 · 범위는 지원 반 확인' }] },
    'DP:common1-skill': { pattern: '공(?:통수학|수)\\s*1\\s*실력', links: [{ label: '제로관 모집·입반 안내', url: DP_ZERO, note: '대치 제로관 · 실력과정 시험 150분' }] },
    'DP:common2-skill': { pattern: '공(?:통수학|수)\\s*2\\s*실력', links: [{ label: '제로관 모집·입반 안내', url: DP_ZERO, note: '대치 제로관 · 실력과정 시험 150분' }] },
    'DP:algebra-basic': { pattern: '대수\\s*기본', links: [{ label: '제로관 모집·입반 안내', url: DP_ZERO, note: '대치 제로관 · 대수 기본 시험 150분' }] },
    'DP:middle-transfer': { pattern: '중등관.*진도|중[123].*편입', links: [{ label: '중등관 진도·입반 안내', url: blog('dpmath', '224408399028'), note: '대치 중등관 · 지원 반의 진도·결원 확인' }] },
    'WM:middle21-basic': { pattern: '중2\\s*[-·]\\s*1\\s*기본', entryScope: '중1 대수·기하 · 통계 제외', links: [{ label: '모집·입반 안내', url: blog('wonmath563', '224393421982'), note: '대치 · 2026년 10월 개강 공지' }] },
    'WM:common1-basic': { pattern: '공(?:통수학|수)\\s*1\\s*기본', entryScope: '중2·중3 대수·기하 · 확률 포함', links: [{ label: '모집·입반 안내', url: blog('wonmath563', '224443076138'), note: '대치 · 2026년 12월 개강 공지' }] },
    'WM:middle22-basic': { pattern: '중2\\s*[-·]\\s*2\\s*기본', links: [{ label: '편입 안내', url: blog('wonmath563', '224364373777'), note: '대치 · 2026년 9월 공지 · 범위는 회차별 확인' }] },
    'WM:middle31-basic': { pattern: '중3\\s*[-·]\\s*1\\s*기본', links: [{ label: '편입 안내', url: blog('wonmath563', '224397883830'), note: '대치 · 2026년 10월 공지 · 범위는 회차별 확인' }] },
    'WM:middle-transfer': { pattern: '중[23].*(?:기본|편입|심화)', links: [] },
    'WM:middle2-dual': { pattern: '중2\\s*[-·]?\\s*심화\\s*듀얼', links: [{ label: '편입 안내', url: blog('wonmath563', '224429755520'), note: '대치 · 2026년 11월 공지' }] },
    'WM:common2-basic': { pattern: '공(?:통수학|수)\\s*2\\s*기본', entryScope: '시험 범위는 해당 회차 원문 확인', level: '공통수학1 기본과 중등 기하 심화 학습자를 위한 과정', links: [{ label: '편입·지원 기준', url: blog('wonmath563', '224391221213'), note: '대치 · 2026년 10월 개강 공지' }] },
    'WM:high-dual': { pattern: '실력\\s*공(?:통수학|수).*듀얼', level: '공통수학1·2 기본과정을 충실히 학습한 학생', links: [{ label: '편입·지원 기준', url: blog('wonmath563', '224392477146'), note: '대치 · 2026년 10월 개강 공지' }] },
    'WM:algebra-basic': { pattern: '대수.*기본', links: [{ label: '대수 모집·입반 안내', url: WM_ALGEBRA, note: '대치 · 초등 11월 / 중1 12월 개강' }] },
    'WM:algebra-direct': { pattern: '대수.*실력\\s*직행', links: [{ label: '실력직행반 모집 안내', url: WM_ALGEBRA, note: '대치 · 12월 개강 · 기본반과 구분' }] },
    'ED:middle1': { pattern: '중1.*(?:시작|신규)|1-1.*신규', entryScope: '초5·초6 전 과정', links: [{ label: '초등관 과정·입반 안내', url: blog('edenmath', '224367798692'), note: '대치 초등관 · 중1 시작반' }] },
    'ED:high-advance': { pattern: '공(?:통수학|수)\\s*1\\s*기본', entryScope: '중2·중3 전 과정 · 대수 20 + 기하 10', links: [{ label: '모집·입반 안내', url: blog('edenmath', '224434054175'), note: '대치 · 12월 개강 · 30문항 · 100분' }] },
    'ED:common2-skill': { pattern: '공(?:통수학|수)\\s*2\\s*실력', entryScope: '공통수학1 실력 + 공통수학2 기본 (FAQ 예시)', links: [{ label: '입반 범위·FAQ', url: FAQ, note: '공식 범위 예시 · 실제 응시 범위는 지원 반 확인' }] },
    'ED:algebra-basic': { pattern: '대수\\s*기본', entryScope: '공통수학1·2 실력 (FAQ 예시)', links: [{ label: '입반 범위·FAQ', url: FAQ, note: '공식 범위 예시 · 실제 응시 범위는 지원 반 확인' }] }
  };
  const edenPatterns = {
    'common1-skill': '공(?:통수학|수)\\s*1\\s*실력',
    'common2-basic': '공(?:통수학|수)\\s*2\\s*기본',
    'common-math-high': '공(?:통수학|수).*하이|공(?:통수학|수).*High',
    'algebra-skill': '대수\\s*실력', 'calculus1-basic': '미적(?:분)?\\s*1\\s*기본',
    'calculus1-skill': '미적(?:분)?\\s*1\\s*실력', 'algebra-calculus1-high': '대수.*미적.*(?:하이|High)',
    'calculus2-basic': '미적(?:분)?\\s*2\\s*기본', 'calculus2-high': '미적(?:분)?\\s*2.*(?:하이|High)',
    'probability-integrated': '확통.*통합', 'geometry-basic': '기하\\s*기본'
  };
  for (const [id, pattern] of Object.entries(edenPatterns)) records['ED:' + id] = { pattern, links: [] };
  function forCourse(program, course) {
    const record = records[program + ':' + course];
    if (!record) return null;
    const links = [...record.links];
    if (program === 'ED') {
      if (!['middle1','common-math-high','probability-integrated','geometry-basic'].includes(course) && !links.some(link => link.url === ED_CLASSES)) links.push({ label: '정규반 진도·모집 안내', url: ED_CLASSES, note: '대치 중등관 · 10월 1일 기준 진도표' });
      links.push({ label: '과정·레벨 구성', url: ED, note: '공식 교육과정 · 기본·실력·High-level 구분' });
    }
    return { checkedAt: '2026-11-09', branch: '대치', ...record, links };
  }
  function matchesNotice(program, course, notice) {
    if (notice.academy !== program) return false;
    const record = forCourse(program, course);
    if (!record) return false;
    // A shared timetable can cover several courses. It never grants exam access.
    return record.links.some(link => link.url === notice.url) || new RegExp(record.pattern, 'i').test(notice.title);
  }
  const api = Object.freeze({ forCourse, matchesNotice });
  root.HIGHSELECT_COURSE_ADMISSIONS = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
