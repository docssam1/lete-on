// Member-scoped assignments. The weekly checklist owns the observations.
(function (g) {
  'use strict';
  const key = 'gfield.demo2.counsel-plan.v1';
  const unitKey = 'gfield.demo2.unit-checklist.v1';
  const normalize = value => String(value ?? '').normalize('NFKC').replace(/\s+/g, '').toLowerCase();
  const text = value => typeof value === 'string' ? value.trim() : '';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));
  const tracks = {curriculum:'교과', thinking:'사고력·경시', arithmetic:'연산'};
  const steps = {practice:'보완 학습', recheck:'독립 풀이 재점검'};
  function read(name) {
    const raw = g.PlannerStorage.getLatestItem(name);
    return raw ? JSON.parse(raw) : null;
  }
  const validDate = day => typeof day === 'string' && /^(?:20|21)\d\d-\d\d-\d\d$/.test(day) && !!g.PlannerUnitChecks.weekStart(day);
  const count = n => Number.isInteger(n) && n >= 1 && n <= 99;
  function valid(plan) {
    return plan && text(plan.id) && plan.id.length <= 80 && text(plan.book) && plan.book.length <= 100 &&
      text(plan.unit) && plan.unit.length <= 120 && Object.hasOwn(tracks, plan.track) &&
      validDate(plan.practice) && validDate(plan.recheck) && plan.recheck > plan.practice &&
      count(plan.practiceCount) && count(plan.recheckCount);
  }
  function saved() {
    const state = read(key);
    if (state == null) return [];
    if (state.version !== 1 || !Array.isArray(state.plans) || !state.plans.every(valid)) throw Error('기존 상담 일정을 읽지 못했어요. 새로고침한 뒤 다시 시도해 주세요.');
    return state.plans;
  }
  function samePlan(a,b,anchor) {
    return a.track === b.track && normalize(a.book) === normalize(b.book) && normalize(a.unit) === normalize(b.unit) &&
      g.PlannerUnitChecks.weekStart(a.practice,anchor) === g.PlannerUnitChecks.weekStart(b.practice,anchor);
  }
  const anchorDate = () => g.PlannerWeeklyModel.restore(read('gfield.demo2.weekly-study.v1')?.program)?.startDate;
  function dates(practice, anchor) {
    const start = g.PlannerUnitChecks.weekStart(practice,anchor);
    return {min:g.PlannerWeeklyModel.addDays(start,7), max:g.PlannerWeeklyModel.addDays(start,13)};
  }
  function item(plan, step) {
    const practice = step === 'practice';
    const bookId = JSON.stringify(['counsel', plan.id, 'practice']);
    const n = practice ? plan.practiceCount : plan.recheckCount;
    return {id:practice ? bookId : JSON.stringify(['counsel',plan.id,step]), unitId:JSON.stringify(['counsel-unit',plan.track,normalize(plan.book),normalize(plan.unit)]),
      kind:'book', track:plan.track, counselId:plan.id, counselStep:step, unitLabel:plan.unit, bookName:plan.book,
      title:plan.book + ' · ' + steps[step], date:plan[step],
      detail:practice ? plan.unit+' · '+n+'문제. 막혔던 유형을 다시 풀고 풀이가 끊긴 곳을 표시해 보세요.'
        : plan.unit+' · 처음 푸는 유사문제 '+n+'개를 골라 힌트 없이 풀고 방법을 설명해 보세요.',
      ...(practice ? {} : {reviewOf:[bookId]})};
  }
  function weekItems(plans,start,records) {
    const end=g.PlannerWeeklyModel.addDays(start,6);
    const entries=new Map((records?.entries || []).map(row=>[row.item.id,row.marks]));
    return plans.flatMap(plan=>Object.keys(steps).flatMap(step=>{
      const task=item(plan,step);
      if (task.date > end) return [];
      if (task.date >= start) return [task];
      // An outstanding recheck is still actionable after a missed week. Marks,
      // including a studied-only mark, continue through the normal review queue.
      if (entries.has(task.id)) return [];
      const lastRecheck = entries.get(item(plan,'recheck').id)?.at(-1);
      return lastRecheck && (lastRecheck[1] & 2) ? [] : [task];
    }));
  }
  function obviousLearning(ctx) {
    if (!ctx?.sources?.length) return false;
    const q=text(ctx.question);
    if (!q || /대기|비용|수강료|모집|경쟁률|진학률|주소|합격선|등록|면접|합격자|전형|입시결과|학원.*(?:추천|어디)|(?:영어|국어|물리|화학|과학)\s*(?:학원|교재|공부|진도)/.test(q)) return false;
    return /복습|보완|재점검|혼자.{0,5}(?:풀|못)|힌트|막[혀힌히]|풀이|틀리|틀린|어려워|선행|심화|학습량|공부량|진도|단원|오답|이번\s*주.{0,8}공부/.test(q);
  }
  function foundIn(value, candidates) {
    const input = normalize(value);
    return [...new Set(candidates.filter(v=>typeof v==='string' && v.trim().length>=2))]
      .sort((a,b)=>normalize(b).length - normalize(a).length).find(name=>input.includes(normalize(name))) || '';
  }
  function draft(ctx, data, day, anchor) {
    const I=g.PlannerIntake, a=data?.answers || {}, fields={...data?.fields,pendingStatus:data?.pendingStatus};
    const actual=I && g.PlannerCurriculum?.actual(I.effective(a),'school',fields);
    const progress=text(ctx.progress), q=text(ctx.question);
    const rawBooks=[...(g.GFIELD_MATH_BOOKS || []).map(b=>b.title),...(I?.thinking || []),
      ...(I?.schoolBooks || []),...(I?.deepBooks || []),'기본정석','실력정석','수학의 정석','개념원리','디딤돌 응용','고쟁이','쎈','RPM'];
    const bookIn = value => foundIn(value,rawBooks) || (/쎈/.test(value)?'쎈':'');
    const courseIn = value => foundIn(value,I?.highSubjects || []) || value.match(/중\s*[1-3]\s*-\s*[12]|[1-6]\s*-\s*[12]/)?.[0]?.replace(/\s/g,'') || '';
    const track=/사고력|경시|KMO/i.test(q) ? 'thinking' : /연산/.test(q) ? 'arithmetic' : 'curriculum';
    const unitTitles = [...(g.PlannerMockItems?.UNITS || []).map(u=>u.title),
      ...(g.PLANNER_BOOK_CATALOG || []).flatMap(b=>(b.units || []).map(u=>u.title)),
      '함수','분수','소인수분해','이차방정식','합동식','정수론','덧셈','뺄셈','곱셈','나눗셈'];
    const topicIn = value => foundIn(value,unitTitles) || (value ? g.PlannerMockBooks?.lookup(value)?.[0] : '');
    const unit=topicIn(q) || topicIn(progress) || (q+' '+progress).match(/(?:제\s*)?\d{1,2}\s*단원/)?.[0] || '';
    // Intake summaries can contain several tracks. Prefer the book named next
    // to the discussed unit, then the explicit report, then the selected book.
    const lines=progress.split(/\n/).filter(Boolean);
    const unitLine=unit && lines.find(line=>normalize(line).includes(normalize(unit)));
    const reportedLine=unitLine || (lines.length===1 ? lines[0] : '');
    const currentTrackBook = track === 'curriculum' ? actual && !actual.done && (I.bookName(actual.book) || actual.book) :
      track === 'thinking' && a.thinkingStatus==='progress' && a.thinking !== 'advanced' ? a.thinking :
      track === 'arithmetic' && a.calcStatus==='progress' && !['advanced','high'].includes(a.calc) ? a.calc : '';
    const name=bookIn(reportedLine) || bookIn(q) || currentTrackBook || '';
    const course=courseIn(reportedLine) || courseIn(q) || (track==='curriculum' && name===currentTrackBook ? actual?.stage : '');
    // A catalogue series such as “쎈 공통수학” can end in the course stem.
    // Keep the child's volume number without repeating that stem.
    const stem=course?.match(/^(.+?)([12ⅠⅡ]+)$/);
    const book=course && name && !normalize(name).includes(normalize(course))
      ? stem && normalize(name).endsWith(normalize(stem[1])) ? name+stem[2] : name+' '+course
      : name;
    const practice=anchor && anchor > day ? anchor : day;
    return {book, unit, track, practice, practiceCount:3, recheck:g.PlannerWeeklyModel.addDays(practice,7), recheckCount:2};
  }
  const formatStatus = flags => flags & 2 ? '혼자 풀 수 있어요' : flags & 1 ? '공부했어요 · 혼자 풀기는 미확인' : '미기록';
  function previousSummary() {
    if (g.RoadmapGuest || !g.RoadmapMember?.user_id) return '';
    const plans=saved();
    if (!plans.length) return '';
    const recentMarks=new Map(g.PlannerUnitChecks.restore(read(unitKey)?.records).entries.map(e=>[e.item.id,e.marks.at(-1)]));
    const markFor=(plan,step)=>recentMarks.get(item(plan,step).id);
    const on=mark=>mark?.[2] || mark?.[0] || '';
    // A newly saved, unstarted plan must not hide yesterday's retest result.
    let plan=plans.at(-1), latest='';
    for (const candidate of plans) {
      const day=[on(markFor(candidate,'practice')),on(markFor(candidate,'recheck'))].sort().at(-1);
      if (day && day>=latest) { plan=candidate; latest=day; }
    }
    const describe=step=>{
      const mark=markFor(plan,step), date=on(mark);
      return plan[step]+' '+steps[step]+' '+plan[step+'Count']+'문제 · '+formatStatus(mark?.[1] || 0)+(date ? ' ('+date+' 기록)' : '');
    };
    return plan.book+' · '+plan.unit+'\n'+describe('practice')+'\n'+describe('recheck');
  }
  function renderPrevious(host) {
    if (!host) return;
    host.replaceChildren();
    let summary;
    try { summary=previousSummary(); } catch { summary='지난 일정을 불러오지 못했어요.'; }
    host.hidden=!summary;
    if (summary) {
      const title=g.document.createElement('strong');
      title.textContent='지난 상담에서 정한 공부';
      const body=g.document.createElement('p');
      body.textContent=summary;
      host.append(title,body);
      if (g.RoadmapMember?.user_id && !g.RoadmapGuest) host.append(checklistLink());
      host.classList.add('cp-previous');
    }
  }
  // Re-read inside the same owner's lock: adjacent tabs adding the same
  // confirmed assignment get the same result without appending a second pair.
  async function save(input, owner) {
    const write=()=>{
      if (g.RoadmapGuest || !owner || owner!==g.RoadmapMember?.user_id) throw Error('학생 계정을 다시 확인해 주세요.');
      const today=g.PlannerWeeklyModel.today(), anchor=anchorDate();
      const plan={...input,id:g.crypto.randomUUID(),book:text(input.book),unit:text(input.unit)};
      if (!valid(plan) || plan.practice < today || (anchor && plan.practice < anchor)) throw Error('교재·단원과 보완일, 문제 수를 확인해 주세요.');
      const limits=dates(plan.practice,anchor);
      if (plan.recheck < limits.min || plan.recheck > limits.max) throw Error('재점검일은 보완 학습 다음 주에서 골라 주세요.');
      const plans=saved(), found=plans.find(p=>samePlan(p,plan,anchor));
      if (found) return {plan:found,duplicate:true};
      g.PlannerStorage.setItem(key,JSON.stringify({version:1,plans:[...plans,plan]}));
      return {plan,duplicate:false};
    };
    return g.navigator?.locks ? g.navigator.locks.request('gfield.counsel-plan.'+owner,write) : write();
  }
  function mount(host,ctx) {
    if (!host) return;
    host.replaceChildren();
    host.hidden=true;
    const owner=g.RoadmapMember?.user_id;
    if (!owner || g.RoadmapGuest || !obviousLearning(ctx)) return;
    let d, anchor;
    try {
      anchor=anchorDate();
      d=draft(ctx,read('gfield.demo2.v1'),g.PlannerWeeklyModel.today(),anchor);
    } catch { return; }
    host.hidden=false;
    const bounds=dates(d.practice,anchor);
    const form=g.document.createElement('form');
    form.className='cp-form';
    form.innerHTML='<h3>이번 주에 보완하고 다음 주에 확인하기</h3><p>쓰고 있는 교재에서 막힌 부분을 골라 주세요. 문제 수와 날짜는 바꿀 수 있어요.</p>'+
      '<div class="cp-fields"><label>학습 영역<select name="track">'+Object.entries(tracks).map(([k,v])=>'<option value="'+k+'"'+(k===d.track?' selected':'')+'>'+v+'</option>').join('')+'</select></label>'+
      '<label>사용 중인 교재<input name="book" maxlength="100" required placeholder="예) 쎈 공통수학1" value="'+esc(d.book)+'"></label>'+
      '<label class="cp-full">보완할 단원·범위<input name="unit" maxlength="120" required placeholder="책에서 공부할 단원명이나 쪽수" value="'+esc(d.unit)+'"></label></div>'+
      '<div class="cp-steps">'+Object.entries(steps).map(([s,label])=>'<fieldset><legend>'+label+'</legend><label>날짜<input name="'+s+'" type="date" required min="'+(s==='practice'?d.practice:bounds.min)+'" '+(s==='recheck'?'max="'+bounds.max+'"':'')+' value="'+d[s]+'"></label><label>문제 수<input name="'+s+'Count" type="number" inputmode="numeric" min="1" max="99" required value="'+d[s+'Count']+'"></label><small>'+(s==='practice'?'막혔던 유형을 다시 풀어 봐요.':'같은 단원의 새 문제를 힌트 없이 풀어요.')+'</small></fieldset>').join('')+
      '</div><button type="submit" class="cp-save">내 로드맵에 일정 추가</button><p class="cp-status" role="status"></p>';
    host.append(form);
    const f=form.elements;
    f.practice.addEventListener('input',()=>{
      if (!validDate(f.practice.value)) return;
      const b=dates(f.practice.value,anchor);
      f.recheck.min=b.min; f.recheck.max=b.max;
      if (f.recheck.value < b.min || f.recheck.value > b.max) f.recheck.value=g.PlannerWeeklyModel.addDays(f.practice.value,7);
    });
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      const submit=form.querySelector('[type=submit]'), status=form.querySelector('.cp-status');
      if (submit.disabled || !form.reportValidity()) return;
      submit.disabled=true;
      try {
        const {plan,duplicate}=await save({track:f.track.value,book:f.book.value,unit:f.unit.value,practice:f.practice.value,
          recheck:f.recheck.value,practiceCount:f.practiceCount.valueAsNumber,recheckCount:f.recheckCount.valueAsNumber},owner);
        const message=(duplicate?'이미 같은 주에 담은 일정이에요. ':'내 로드맵에 담았어요. ')+plan.book+' · '+plan.unit+'\n'+
          plan.practice+' 보완 '+plan.practiceCount+'문제 → '+plan.recheck+' 재점검 '+plan.recheckCount+'문제';
        for (const field of Array.from(form.elements)) field.disabled=true;
        const state=g.PlannerStorage.status();
        status.textContent=message+(state==='memory'?' · 현재 화면에만 임시 저장됐어요.':state==='session'?' · 현재 탭에 저장됐어요.':'');
        status.append(g.document.createElement('br'),checklistLink());
        g.PlannerUnitPlanner?.refresh();
      } catch (err) {
        submit.disabled=false;
        status.textContent=err.message || '일정을 저장하지 못했어요. 다시 시도해 주세요.';
      }
    });
  }

  function checklistLink() {
    const link=g.document.createElement('a');
    link.href='planner.html?checklist=1';
    link.textContent='이번 주 체크리스트 열기';
    link.addEventListener('click',event=>{
      if (!read('gfield.demo2.v1')?.completed) {
        event.preventDefault();
        openChecklist();
      }
    });
    return link;
  }

  // A member can start from consultation before finishing the roadmap intake.
  // Both views use the same per-item IDs, evidence record, weekly anchor and
  // cross-tab lock, so later intake setup retains every previous observation.
  let standalone;
  function openChecklist() {
    if (!g.RoadmapMember?.user_id || g.RoadmapGuest) return;
    if (!standalone) {
      standalone=g.document.createElement('dialog');
      standalone.className='cp-checklist';
      standalone.setAttribute('aria-labelledby','cpChecklistTitle');
      standalone.innerHTML='<header><h2 id="cpChecklistTitle">상담 학습 체크리스트</h2><button type="button">닫기</button></header><div class="unit-checklist" data-cp-work></div><p role="status" aria-live="polite"></p>';
      standalone.querySelector('header button').onclick=()=>standalone.close();
      standalone.addEventListener('close',()=>{
        for (const previous of g.document.querySelectorAll('.cp-previous')) renderPrevious(previous);
      });
      standalone.addEventListener('change',changeStandalone);
      g.document.body.append(standalone);
    }
    drawStandalone();
    if (!standalone.open) standalone.showModal();
  }
  function standaloneView() {
    const day=g.PlannerWeeklyModel.today(), start=g.PlannerUnitChecks.weekStart(day,anchorDate());
    const value=read(unitKey) || {};
    const records=g.PlannerUnitChecks.restore(value.records);
    const plans=saved(), tasks=weekItems(plans,start,records);
    const future=plans.flatMap(plan=>Object.keys(steps).map(step=>item(plan,step)))
      .filter(task=>task.date>g.PlannerWeeklyModel.addDays(start,6)).sort((a,b)=>a.date.localeCompare(b.date));
    const view=g.PlannerUnitChecks.view(records,{weekStart:start,items:tasks});
    view.rows=view.rows.filter(row=>row.counselId);
    view.nextReview=view.nextReview.map(group=>({...group,items:group.items.filter(row=>row.counselId)})).filter(group=>group.items.length);
    Object.assign(view,{counselUpcoming:future,readOnly:start>day});
    return {view,value,day};
  }
  function drawStandalone(message='') {
    const panel=standalone.querySelector('[data-cp-work]');
    const active=g.document.activeElement;
    let view;
    try {
      view=standaloneView().view;
      panel.innerHTML=g.PlannerUnitChecklistView.checklist(view);
      // Preserve keyboard position while the evidence and review list redraw.
      if (active?.dataset.ucId) Array.from(panel.querySelectorAll('input[data-uc-id]')).find(input=>
        input.dataset.ucId===active.dataset.ucId && input.dataset.ucField===active.dataset.ucField)?.focus({preventScroll:true});
      standalone.dataset.weekStart=view.weekStart;
      standalone.dataset.owner=g.RoadmapMember.user_id;
    } catch { panel.replaceChildren(); message='일정을 불러오지 못했어요. 다시 열어 주세요.'; }
    standalone.querySelector('[role=status]').textContent=message;
  }
  async function changeStandalone(event) {
    const input=event.target.closest('input[data-uc-field]');
    if (!input || !standalone.open) return;
    const {owner,weekStart}=standalone.dataset;
    const field=input.dataset.ucField, id=input.dataset.ucId, value=input.checked;
    const write=()=>{
      if (g.RoadmapGuest || !owner || owner!==g.RoadmapMember?.user_id) throw Error('학생 계정을 다시 확인해 주세요.');
      const {view,value:stored,day}=standaloneView();
      const row=view.rows.find(task=>task.id===id);
      if (!row || view.readOnly || view.weekStart!==weekStart) throw Error('이번 주 일정이 바뀌었어요. 목록을 확인해 주세요.');
      const records=g.PlannerUnitChecks.update(stored.records,{weekStart,item:row,field,value,day});
      g.PlannerStorage.setItem(unitKey,JSON.stringify({...stored,version:1,records}));
    };
    input.disabled=true;
    try {
      if (g.navigator.locks) await g.navigator.locks.request('gfield.unit-checklist.'+owner,write);
      else write();
      drawStandalone('체크를 저장했어요.');
      g.PlannerUnitPlanner?.refresh();
    } catch (err) { drawStandalone(err.message || '체크를 저장하지 못했어요. 다시 시도해 주세요.'); }
  }
  if (g.document && g.RoadmapMember?.user_id && !g.RoadmapGuest) {
    g.addEventListener('storage',event=>{
      if (standalone?.open && [key,unitKey].some(name=>event.key?.endsWith(name.slice('gfield.demo2.'.length)))) drawStandalone();
    });
    if (new URLSearchParams(g.location.search).get('checklist')==='1') {
      try { if (!read('gfield.demo2.v1')?.completed && saved().length) openChecklist(); } catch {}
    }
  }

  g.RoadmapCounselPlan=Object.freeze({key,saved,item,weekItems,draft,obviousLearning,samePlan,previousSummary,renderPrevious,mount,save,openChecklist});
})(typeof window==='undefined'?globalThis:window);
