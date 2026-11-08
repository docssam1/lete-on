// Translate the child's book observations and dated mock plan into weekly work.
// These are assignments. Only the learner can record study or independent solving.
(function (g) {
  'use strict';

  const trackNames = {curriculum: '교과', arithmetic: '연산', thinking: '사고력'};
  const compact = text => String(text || '').replace(/\s/g, '');
  const key = (...parts) => JSON.stringify(parts);
  const usable = title => title && !/미선택|확인 전|공부할 범위 확인|현재 범위 확인|경험 없음|진행 안 함|시작 전|배운 범위 유지·복습/.test(title);

  function courseOf(title) {
    // Match middle before elementary: '중2-1' and '2-1' are different courses.
    const name = compact(title);
    const semester = name.match(/중[1-3]-[12]|[1-6]-[12]/)?.[0];
    if (semester) return semester;
    if (/초등|중등/.test(name)) return '';
    return g.PlannerIntake.highSubjects.find(course => name.includes(compact(course))) || '';
  }

  function booksFor(answers, fields, week, actual) {
    const a = g.PlannerIntake.effective(answers);
    const calc = a.calc === 'advanced' ? g.Planner.CALC[+a.calcExact]?.[0] : a.calc === 'high' ? a.calcHigh : a.calc;
    const thinking = a.thinking === 'advanced' ? g.Planner.COMP[+a.compExact]?.[0] : a.thinking;
    const current = {
      curriculum: actual && !actual.done ? [actual.book, actual.stage].join(' ') : '',
      arithmetic: a.calcStatus === 'progress' && !fields.pendingStatus?.calcStatus ? calc : '',
      thinking: a.thinkingStatus === 'progress' && !fields.pendingStatus?.thinkingStatus ? thinking : ''
    };
    return Object.keys(trackNames).flatMap(track => {
      const assigned = week?.tracks?.[track];
      const rows = assigned ? (assigned.pace ? assigned.items : []) : [{title: current[track]}];
      return (rows || []).filter(row => usable(row.title) && !g.PlannerIntake.special(row.title)).map(row => ({track, name: row.title}));
    });
  }

  function bookItem(track, bookName, u, detail, url) {
    return {id: key('book', track, bookName, u.id), kind: 'book', track, unitId: u.id,
      unitLabel: u.title, title: bookName, bookName, detail, ...(url ? {url} : {})};
  }

  function sameSchoolBook(name, actual) {
    return !!actual && courseOf(name) === actual.stage && compact(name).includes(compact(actual.book));
  }

  function bookIdentity(book, actual) {
    return book.track === 'curriculum' && sameSchoolBook(book.name,actual) ?
      key(actual.stage,actual.book) : compact(book.name);
  }

  function schoolCandidates(book, ctx) {
    const {actual, answers, fields, bookChecks, mock} = ctx;
    const name = book.name, stage = courseOf(name);
    if (!stage) return [];
    // A checked edition applies only to the book the child actually identified.
    // Other titles scheduled this week get curriculum-topic suggestions instead.
    if (sameSchoolBook(name,actual)) {
      const descriptor = g.PlannerBookChecks.descriptor('school', answers, fields);
      const observed = g.PlannerBookChecks.model(bookChecks, descriptor);
      if (observed.confirmed) {
        return observed.units.filter(u => u.status !== 'independent')
          .sort((a,b) => Number(b.status === 'help') - Number(a.status === 'help'))
          .map(u => bookItem(book.track, name, {id: key('edition', observed.book.id, u.id), title: u.title},
            u.id + '단원 · ' + u.title + (u.status === 'help' ? ' · 지난 관찰에서 도움을 받은 단원' : ' · 확인한 판본 목차'), observed.book.sourceUrl));
      }
    }
    if (fields.internationalCalendar) return [];
    const taxonomy = g.PlannerMockItems.UNITS.filter(u => u.course === stage);
    const learned = new Set(mock?.mockCheckPlan?.knowledge?.learned || []);
    const next = taxonomy.findIndex(u => !learned.has(u.id));
    if (taxonomy.length) {
      return [...taxonomy.slice(Math.max(next,0)), ...taxonomy.slice(0,Math.max(next,0))].map(u =>
        bookItem(book.track, name, u, u.title + ' · ' + (learned.has(u.id) ? '배운 내용 복습' : '교과 범위에서 추천') + ' · 책에서 해당 유형 찾기'));
    }
    // A reference edition supplies an elementary curriculum topic, never a
    // chapter number/page for another book without an explicitly matched ISBN.
    const example = (g.PLANNER_BOOK_CATALOG || []).find(b => b.volume === stage &&
      b.family === 'didimdol_application' && b.sourceCurriculum === '2022' && b.verification === 'publisher_toc');
    return (example?.units || []).map(u => bookItem(book.track, name,
      {id:key('elementary',stage,u.title),title:u.title}, u.title + ' · 학기 범위에서 추천 · 책에서 해당 내용 찾기'));
  }

  function bookRows(ctx) {
    const items = [], notices = [], manualBooks = [];
    const mastered = new Set(ctx.mastered || []);
    for (const book of booksFor(ctx.answers, ctx.fields, ctx.week, ctx.actual)) {
      let candidates = [];
      if (book.track === 'curriculum') candidates = schoolCandidates(book, ctx);
      if (book.track === 'arithmetic') {
        const topic = g.PlannerIntake.calc.find(([title]) => compact(title) === compact(book.name))?.[1];
        if (topic) candidates = [bookItem(book.track, book.name,
          {id:key('arithmetic',book.name,topic),title:topic}, topic + ' · 현재 권에서 해당 계산 연습')];
      }
      const identity = bookIdentity(book,ctx.actual);
      for (const item of candidates) item.id = key('book',book.track,identity,item.unitId);
      const bookId = key('range',book.track,identity);
      const range = typeof ctx.manualRanges?.[bookId] === 'string' ? ctx.manualRanges[bookId].trim().slice(0,120) : '';
      manualBooks.push({id:bookId, title:book.name, track:book.track, range});
      if (range) {
        const match = candidates.find(row => compact(row.unitLabel) === compact(range));
        const u = {id:match?.unitId || key('own',bookId,range),title:range};
        const item = bookItem(book.track,book.name,u,range + ' · 직접 입력한 범위');
        item.id = key('manual',bookId,range);
        items.push(item);
        continue;
      }
      const item = candidates.find(i => !mastered.has(i.id));
      if (item) items.push(item);
      else notices.push(trackNames[book.track] + ' · ' + book.name + '에서 이번 주 공부할 단원이나 쪽수를 직접 추가하세요.');
    }
    return {items, notices, manualBooks};
  }

  function addRepairBooks(plan, start, end, items) {
    if (plan.reviewDone || plan.start > end || plan.end <= start) return;
    for (const topic of plan.bookPlan?.topics || []) {
      for (const task of topic.items || []) {
        if (task.completed >= task.planned) continue;
        const unitId = topic.unitId || key('repair',task.course,task.bookName,task.unitTitle);
        items.push({kind:'book',track:'curriculum',id:key('repair',plan.id,task.id),unitId,unitLabel:task.unitTitle,
          title:task.bookName,bookName:task.bookName,detail:[task.unitTitle,task.location,'모평 보완'].filter(Boolean).join(' · ')});
      }
    }
  }

  function addPaper(paperId, date, targets, ctx, seen, items, notices) {
    const paper = g.PlannerMockLibrary.find(paperId);
    if (!paper || seen.has(paperId) || !g.PlannerMockMatching.available(paper, ctx.today)) {
      notices.push('이 주 기출 일정에 연결할 공개·미풀이 회차를 확인하고 있어요.');
      return;
    }
    const source = g.PlannerMockItems;
    const learned = ctx.mock.mockCheckPlan?.knowledge?.learned || [];
    const selection = source.select(paper, learned, targets ? {mode:'remedial',target:targets} : {});
    const questions = source.items(paper);
    if (!selection?.selected.length) {
      notices.push(paper.title + ' · 배운 단원에서 확인된 문항이 생기면 번호가 표시됩니다.');
      return;
    }
    for (const number of selection.selected) {
      const question = questions.find(q => q.number === number);
      const unit = source.UNIT[source.focusUnit(selection,question)];
      items.push({kind:'mock',track:'curriculum',id:key('mock',paper.id,number),unitId:unit.id,unitLabel:unit.title,
        title:paper.title + ' ' + number + '번',detail:(targets ? '보완 재점검 · ' : '') + unit.title,
        date,paperId:paper.id,questionNumber:number,url:paper.files.problem});
    }
  }

  function build({answers = {}, fields = {}, bookChecks, mock, weekStart, week, today = g.PlannerWeeklyModel.today(), mastered = [], manualRanges = {}} = {}) {
    const start = weekStart || week?.start;
    if (!g.PlannerMockFeedback.dayOK(start)) return {items:[],notices:[],manualBooks:[]};
    const end = g.PlannerWeeklyModel.addDays(start,6);
    const actual = g.PlannerCurriculum.actual(g.PlannerIntake.effective(answers),'school',fields);
    const ctx = {answers, fields, bookChecks, mock, week, today, mastered, manualRanges, actual};
    const {items, notices, manualBooks} = bookRows(ctx);
    const plan = mock?.mockCheckPlan;
    const seen = g.PlannerMockMatching.seen(mock?.mockFeedback?.records || [],plan?.state);
    const scheduled = date => g.PlannerMockFeedback.dayOK(date) && date >= start && date <= end;
    if (plan?.enabled) {
      for (const row of plan.rows) {
        if (row.start == null || ['done','skip'].includes(row.status) || !scheduled(row.practiceDate)) continue;
        addPaper(row.selectedPaperId,row.practiceDate,null,ctx,seen,items,notices);
      }
    }
    for (const followup of mock?.mockFeedback?.plans || []) {
      addRepairBooks(followup,start,end,items);
      if (!scheduled(followup.recheck)) continue;
      const paper = followup.paper;
      if (!paper?.fresh || paper.pending) {
        notices.push('재점검 · 같은 범위의 다른 연도 기출을 확인하고 있어요.');
        continue;
      }
      const target = paper.questionSelection?.mode === 'current' ? null : g.PlannerMockItems.targetUnits(followup.topics);
      addPaper(paper.id,followup.recheck,target,ctx,seen,items,notices);
    }
    if (!items.some(i => i.kind === 'mock') && !notices.some(t => /기출|재점검|문항/.test(t))) {
      notices.push(plan?.enabled ? '이번 주에 예정된 기출 문항이 없습니다.' : '현재 계획에서 고1·고2 기출 일정이 꺼져 있습니다.');
    }
    return {items:[...new Map(items.map(i => [i.id,i])).values()],notices:[...new Set(notices)],manualBooks:[...new Map(manualBooks.map(b => [b.id,b])).values()]};
  }

  // An alternate paper is useful only if it contains a verified item for the
  // weak unit and every prerequisite has already been learned. Preserve the
  // original item's identity so a checked recheck can resolve that exact need.
  function reviewWork(groups, {answers = {}, fields = {}, mock, weekStart,
    today = g.PlannerWeeklyModel.today(), usedPaperIds = []} = {}) {
    const items = [], notices = [];
    if (!groups?.length || !g.PlannerMockFeedback.dayOK(weekStart) || !mock?.mockCheckPlan?.enabled) return {items,notices};
    const a = g.PlannerIntake.effective(answers), match = g.PlannerMockMatching, source = g.PlannerMockItems;
    const actual = g.PlannerCurriculum.actual(a,'school',fields);
    const deep = g.PlannerCurriculum.actual(a,'deep',fields);
    const records = mock.mockFeedback?.records || [], schedule = mock.mockCheckPlan.state;
    const reserved = new Set(usedPaperIds);
    for (const group of groups) for (const item of group.items || []) if (item.paperId) reserved.add(item.paperId);
    const learned = mock.mockCheckPlan.knowledge?.learned || [];
    const publishedBy = today < weekStart ? today : weekStart;
    const assignedQuestions = new Set();
    for (const group of groups) {
      const unit = source.UNIT[group.unitId];
      const originals = (group.items || []).filter(i => i.kind === 'mock' && i.unitId === unit?.id && i.paperId);
      if (!unit || !originals.length) continue;
      const current = [actual,deep].find(c => c && !c.done && c.stage === unit.course);
      if (current) {
        const name = current.book + ' ' + current.stage;
        const item = bookItem('curriculum',name,unit,unit.title + ' · 현재 교재에서 해당 유형 다시 풀기');
        item.id = key('book','curriculum',bookIdentity({track:'curriculum',name},current),unit.id);
        items.push(item);
      }
      let replacement = null;
      for (const original of originals) {
        const from = g.PlannerMockLibrary.find(original.paperId);
        const scope = from && match.sourceFor(from);
        if (!scope) continue;
        const avoid = new Set(reserved);
        let paper;
        while ((paper = match.selectRecheck(from,records,schedule,publishedBy,avoid))) {
          const picked = source.select(paper,learned,{mode:'remedial',target:[unit.id]});
          const number = picked?.selected.find(n => !assignedQuestions.has(key('mock',paper.id,n)));
          if (number) {
            const covered = originals.filter(i => {
              const old = g.PlannerMockLibrary.find(i.paperId);
              return old && old.year !== paper.year && match.sourceFor(old)?.scopeKey === paper.scopeKey;
            });
            replacement = {id:key('mock',paper.id,number),kind:'mock',track:'curriculum',unitId:unit.id,unitLabel:unit.title,
              title:paper.title + ' ' + number + '번',detail:'보완 재점검 · ' + unit.title,date:weekStart,
              url:paper.files.problem,paperId:paper.id,questionNumber:number,reviewOf:covered.map(i => i.id)};
            break;
          }
          avoid.add(paper.id);
        }
        if (replacement) break;
      }
      if (replacement) {
        assignedQuestions.add(replacement.id);
        items.push(replacement);
      } else notices.push(unit.title + ' · 같은 범위의 다른 연도에서 확인된 재점검 문항이 아직 없습니다.');
    }
    return {items,notices};
  }

  g.PlannerUnitSources = Object.freeze({build,reviewWork});
})(window);
