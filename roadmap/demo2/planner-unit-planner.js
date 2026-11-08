/* Bring the personal roadmap, the verified item sources, and the weekly schedule together. */
(function (g) {
  'use strict';
  const storage = g.PlannerStorage;
  const checks = g.PlannerUnitChecks;
  const key = 'gfield.demo2.unit-checklist.v1';
  const host = document.createElement('section');
  host.id = 'plannerUnitChecklist';
  host.tabIndex = -1;
  let context, program, courses, visible, lastText, lastDay;

  const params = new URLSearchParams(g.location.search);
  let trendTrack = params.get('assessment') === '1' ? 'assessment' : params.get('weekly') === '1' ? 'all' : 'book';
  let trendRecords, books = [], selectedBookId, bookMessage = '', lastBookText, bookState;
  const bookPlan = g.PlannerBookPacePlan;
  const comparisonTrend = document.createElement('div');
  comparisonTrend.dataset.weeklyTrend = '';

  function drawTrend() {
    if (!visible || !host.isConnected) return;
    const comparison = document.getElementById('workspace-panel-graph');
    if (comparison && comparison.firstElementChild !== comparisonTrend) comparison.prepend(comparisonTrend);
    const track = trendTrack;
    const trend = track === 'book' || track === 'assessment' ? {track} : track === 'units'
      ? g.PlannerUnitTrend.build({records:trendRecords,program,day:lastDay})
      : g.PlannerWeeklyTrend.build({program,day:lastDay,track});
    const bookModel = track === 'book' ? bookPlan.model(books,selectedBookId,bookState,lastDay,bookMessage) : null;
    trend.hasProgram = !!program;
    for (const target of [host.querySelector('[data-weekly-trend]'),comparisonTrend]) {
      if (!target?.isConnected) continue;
      g.PlannerWeeklyTrendView.render(target,trend,visible.route);
      if (track === 'assessment') g.PlannerAssessmentPlanner.mount(target.querySelector('[data-assessment-host]'));
      if (bookModel) g.PlannerBookPaceView.render(target.querySelector('[data-book-pace-host]'),bookModel,visible.route);
    }
  }

  function chooseTrendTrack(event) {
    const track = event.detail?.track;
    if (track === trendTrack || !['assessment','book','all','units',...g.PlannerWeeklyModel.TRACKS].includes(track)) return;
    trendTrack = track;
    drawTrend();
  }
  host.addEventListener('planner-trend-track',chooseTrendTrack);
  comparisonTrend.addEventListener('planner-trend-track',chooseTrendTrack);

  async function changeBook(event) {
    const input = event.detail || {};
    const book = books.find(row => row.id === input.bookId);
    if (!book) return;
    const action = event.type.slice('planner-book-'.length);
    selectedBookId = book.id;
    if (action === 'select') { bookMessage = ''; drawTrend(); return; }
    const fieldValue = state => {
      const saved = state.books[book.id];
      return action === 'goal' ? saved?.goals?.[input.unit] : saved?.observations?.[input.unit]?.[input.date];
    };
    const expected = JSON.stringify(fieldValue(bookState));
    const persist = () => {
      const latest = bookPlan.restore(storage.getLatestItem(bookPlan.key));
      if (JSON.stringify(fieldValue(latest)) !== expected) throw Error('다른 화면에서 같은 기록이 바뀌었어요. 최신 값을 확인해 주세요.');
      const next = bookPlan.apply(latest,book,action,input,g.PlannerWeeklyModel.today());
      storage.setItem(bookPlan.key,JSON.stringify(next));
    };
    try {
      if (g.navigator.locks) await g.navigator.locks.request('gfield.book-pace.'+g.RoadmapMember.user_id,persist);
      else persist();
      bookMessage = action === 'remove' ? '직접 입력한 기록을 삭제했어요.' : action === 'goal' ? '교재 목표를 저장했어요.' : '혼자 풀 수 있는 범위를 저장했어요.';
    } catch (err) { bookMessage = err?.message || '저장하지 못했어요. 다시 시도해 주세요.'; }
    lastBookText = storage.getLatestItem(bookPlan.key);
    bookState = bookPlan.restore(lastBookText);
    drawTrend();
  }
  for (const target of [host,comparisonTrend]) for (const action of ['select','goal','observe','remove']) {
    target.addEventListener('planner-book-'+action,changeBook);
  }

  function state() {
    const text = storage.getLatestItem(key);
    let value;
    try { value = JSON.parse(text); } catch {}
    return {text, records: value?.records || null, ranges: value?.ranges || {}};
  }

  // The learning start weekday can change after a learner types a range.
  // Keep the date they entered it so the same work stays in the overlapping week.
  function rangesFor(saved, start) {
    const end = g.PlannerWeeklyModel.addDays(start,6);
    const found = new Map();
    for (const [original,byBook] of Object.entries(saved)) {
      if (!byBook || typeof byBook !== 'object') continue;
      for (const [book,value] of Object.entries(byBook)) {
        const date = value?.day || original;
        const range = typeof value==='string' ? value : value?.range;
        if (typeof range!=='string' || (original!==start && (date<start || date>end))) continue;
        const previous = found.get(book);
        if (!previous || date>previous.date || (date===previous.date && original===start)) {
          found.set(book,{range,date});
        }
      }
    }
    return Object.fromEntries([...found].map(([book,item])=>[book,item.range]));
  }

  function route() {
    const {actual, answers, fields, grade, gender, goalTitle} = context;
    if (fields.internationalCalendar) {
      const subject = answers.schoolHigh || g.PlannerCollegeData?.CURRICULA?.[fields.schoolContext?.curriculum]?.title;
      return {grade, gender, stages: subject ? [{id:'school',title:subject,current:true}] : [],
        currentLabel: subject ? '현재 학교 과정 · '+subject : '현재 학교의 수학 과정을 확인해 주세요.'};
    }
    const stages = [
      ['elem','초등 교과'], ['mid','중등 교과'], ['common1','공통수학1'],
      ['common2','공통수학2'], ['high','고등 선택과목']
    ];
    const name = actual?.stage || '';
    const id = /^중[1-3]/.test(name) ? 'mid' : /^공통수학[12]$/.test(name) ? 'common'+name.slice(-1)
      : g.PlannerIntake.highSubjects.includes(name) ? 'high' : name ? 'elem' : null;
    const detail = name ? (/^[1-6]-[12]$/.test(name) ? '초'+name : name) + (actual.done ? ' · 최근 완료' : ' · 공부 중') : '현재 교과 범위를 입력하면 위치가 표시돼요.';
    const school = context.mock?.lanes?.find(lane=>lane.id==='school');
    const next = school?.blocks?.find(block=>block.stage && block.stage!==name && block.end>0 &&
      (block.start>0 || actual?.done));
    if (id==='high') stages[stages.length-1][1]=name;
    return {grade,gender,goalTitle,nextCourse:name ? next?.stage : '',stages:stages.map(([key,title])=>({id:key,title,current:key===id})),currentLabel:detail};
  }

  function tableReview(view) {
    const table = document.querySelector('[data-weekly-schedule="table"]');
    if (!table) return;
    table.querySelectorAll('[data-unit-schedule-review]').forEach(el=>el.remove());
    const weeks = table.querySelectorAll('.weekly-schedule-week');
    function append(week, titles) {
      if (!week || !titles.length) return;
      const note = document.createElement('p');
      note.dataset.unitScheduleReview = '';
      note.className = 'weekly-schedule-pending';
      note.textContent = '보완할 단원 · '+[...new Set(titles)].join(', ');
      week.append(note);
    }
    append(weeks[0],view.rows.filter(row=>row.review && !row.solo).map(row=>row.unitLabel || row.title));
    append(weeks[1],view.nextReview.map(row=>row.unitLabel));
  }

  function byUnit(rows) {
    const groups = new Map();
    for (const item of rows) {
      if (!groups.has(item.unitId)) groups.set(item.unitId,{unitId:item.unitId,unitLabel:item.unitLabel,items:[]});
      groups.get(item.unitId).items.push(item);
    }
    return [...groups.values()];
  }

  function draw(message='') {
    if (!host.isConnected || !context) return;
    const stored = state();
    const day = g.PlannerWeeklyModel.today();
    const week = program ? g.PlannerWeeklySchedule.model(program,courses,day)?.weeks[0] : null;
    const weekStart = checks.weekStart(day,program?.startDate);
    const raw = stored.records;
    const records = checks.restore(raw);
    const usedBefore = start => records.entries.filter(entry=>entry.item.paperId && entry.marks.some(([week,,day])=>(day||week)<start))
      .map(entry=>entry.item.paperId);
    const inputs = {...context,today:day,weekStart,week,manualRanges:rangesFor(stored.ranges,weekStart),
      mastered:checks.mastered(records,weekStart)};
    const source = g.PlannerUnitSources.build(inputs);
    const initial = checks.view(records,{weekStart,items:source.items});
    const due = byUnit(initial.rows.filter(row=>row.review && !row.solo));
    const reviewWork = (groups,start,usedPaperIds) => groups.length
      ? g.PlannerUnitSources.reviewWork(groups,{...inputs,weekStart:start,usedPaperIds})
      : {items:[],notices:[]};
    const current = reviewWork(due,weekStart,usedBefore(weekStart));
    const view = current.items.length ? checks.view(records,{weekStart,items:[...current.items,...source.items]}) : initial;
    const future = reviewWork(view.nextReview,view.nextWeekStart,usedBefore(view.nextWeekStart));
    view.nextReview = view.nextReview.map(group=>({...group,practice:future.items.filter(item=>item.unitId===group.unitId)}));
    lastText = stored.text;
    lastDay = day;
    trendRecords = records;
    books = g.PlannerBookPaceSources.build({source,context,program,courses,records,today:day}).books;
    lastBookText = storage.getLatestItem(bookPlan.key);
    bookState = bookPlan.restore(lastBookText);
    visible = {...view,route:route(),notices:[...new Set([...source.notices,...current.notices,...future.notices])],manualBooks:source.manualBooks||[],message,readOnly:weekStart>day};
    g.PlannerUnitChecklistView.render(host,visible);
    drawTrend();
    tableReview(view);
  }

  function mount(next, currentProgram, savedCourses) {
    context = next;
    program = currentProgram;
    courses = savedCourses;
    const map = document.getElementById('workspace-panel-map');
    if (!map || !context) return;
    if (map.firstElementChild!==host) map.prepend(host);
    const peek = document.getElementById('flowMapPeek');
    if (peek && !peek.querySelector('[data-unit-checklist-open]')) {
      const button = document.createElement('button');
      button.type='button';
      button.dataset.unitChecklistOpen='';
      button.textContent='이번 주 체크리스트';
      peek.append(button);
    }
    draw();
  }

  // Merge touches from separate tabs inside the same account lock. Never apply
  // a checkbox from an old, still-open week to the new week's assignments.
  async function change(event) {
    if (!visible || visible.readOnly) return;
    const model = visible, input = event.detail;
    const item = model.rows.find(row=>row.id===input?.id);
    const book = model.manualBooks.find(row=>row.id===input?.bookId);
    const manual = event.type==='planner-unit-range';
    if (manual ? !book || typeof input.range!=='string' : !item || !['studied','solo'].includes(input?.field) || typeof input?.value!=='boolean') return;
    const persist = () => {
      if (checks.weekStart(g.PlannerWeeklyModel.today(),program?.startDate)!==model.weekStart) {
        draw('새 주가 시작됐어요. 이번 주 목록을 확인해 주세요.');
        return;
      }
      const stored = state();
      let records = stored.records, ranges = stored.ranges;
      if (manual) {
        const next = {...ranges[model.weekStart]};
        const range = input.range.trim().slice(0,120);
        const day = g.PlannerWeeklyModel.today();
        next[book.id] = {range,day};
        // Only the neighboring week keys can overlap after a start-date edit.
        const earliest = g.PlannerWeeklyModel.addDays(model.weekStart,-6);
        ranges = Object.fromEntries(Object.entries({...ranges,[model.weekStart]:next}).filter(([week])=>week>=earliest));
      } else {
        records = checks.update(records,{weekStart:model.weekStart,item,field:input.field,value:input.value});
      }
      storage.setItem(key,JSON.stringify({version:1,records,ranges}));
      draw(manual?'이번 주 교재 범위를 저장했어요.':'체크를 저장했어요.');
    };
    try {
      if (g.navigator.locks) await g.navigator.locks.request('gfield.unit-checklist.'+g.RoadmapMember.user_id,persist);
      else persist();
    } catch {
      draw('저장하지 못했어요. 체크 상태를 확인하고 다시 시도해 주세요.');
    }
  }
  host.addEventListener('planner-unit-change',change);
  host.addEventListener('planner-unit-range',change);
  function refresh() {
    if (host.isConnected && (lastDay!==g.PlannerWeeklyModel.today() || lastText!==storage.getLatestItem(key) || lastBookText!==storage.getLatestItem(bookPlan.key))) draw();
  }
  g.addEventListener('focus',refresh);
  g.addEventListener('storage',event=>{if(event.key?.endsWith('.unit-checklist.v1') || event.key?.endsWith('.book-pace.v1'))refresh();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  function open() {
    if (!host.isConnected) return;
    host.focus({preventScroll:true});
    const panel = host.closest('.workspace-panel');
    if (panel && /auto|scroll/.test(g.getComputedStyle(panel).overflowY)) {
      const box = panel.getBoundingClientRect();
      panel.scrollTop += host.getBoundingClientRect().top - box.top;
      if (box.bottom<=0 || box.top>=g.innerHeight) panel.scrollIntoView({block:'nearest'});
    } else host.scrollIntoView({block:'start'});
  }
  g.PlannerUnitPlanner=Object.freeze({mount,open,refresh});
})(window);
