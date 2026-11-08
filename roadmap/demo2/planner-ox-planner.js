// A single O/X panel follows the child's roadmap across map redraws.
(function (g) {
  'use strict';
  const records=g.PlannerAssessmentPlanner;
  const today=()=>g.PlannerWeeklyModel.today();
  const dock=document.createElement('details');
  dock.className='ox-entry'; dock.id='plannerOxCheck';
  dock.innerHTML='<summary>초등 단원평가 O·X <small>초1-1 ~ 초6-2</small></summary><div data-ox-error role="status" hidden></div><div data-ox-body></div>';
  const body=dock.querySelector('[data-ox-body]');
  const summary=dock.querySelector('summary');
  const errorBox=dock.querySelector('[data-ox-error]');
  let options={}, catalogRequest, revision=0, dialog, queueRequested=false;
  const setNames={m:'중',h:'상',x:'최상'};
  async function fetchJson(file) {
    const response=await fetch(file+'?v=20261108-ox1');
    if (!response.ok) throw Error('단원평가 자료를 열지 못했어요.');
    return response.json();
  }
  function catalog() {
    if (!catalogRequest) {
      catalogRequest=Promise.all([fetchJson('planner-ox-catalog.json'),fetchJson('planner-ox-supplements.json')])
        .then(([bank,extra])=>({...bank,units:bank.units.map(u=>({...u,supplements:extra.units[u.id] || []}))}))
        .catch(error=>{catalogRequest=null;throw error;});
    }
    return catalogRequest;
  }
  function schedules(bank,tasks) {
    document.querySelectorAll('[data-ox-schedule]').forEach(el=>el.remove());
    if (!tasks.length) return;
    const units=new Map(bank.units.map(u=>[u.id,u]));
    function group(target,list,first=false) {
      if (!target || !list.length) return;
      const section=document.createElement('div'); section.dataset.oxSchedule=''; section.className='ox-week-due';
      const title=document.createElement('button'); title.type='button'; title.dataset.oxOpen='queue';
      title.textContent='단원평가 보완 일정 · '+list.length+'유형'; section.append(title);
      const ol=document.createElement('ul');
      for (const task of list) {
        const u=units.get(task.unitId), li=document.createElement('li');
        const item=task.itemId ? (setNames[task.set] ? setNames[task.set]+' 세트 '+task.number+'번' : '추가 연습문제') : '새 문제 확인 필요';
        li.textContent=task.due+' · 초'+u.semester+' '+u.number+'단원 · '+task.typeTitle+' · '+item;
        ol.append(li);
      }
      section.append(ol); if (first) target.prepend(section); else target.append(section);
    }
    const table=document.getElementById('workspace-panel-table');
    const weeks=[...(table?.querySelectorAll('[data-week-start][data-week-end]')||[])];
    for (const [i,week] of weeks.entries()) group(week,tasks.filter(t=>(!i || t.due>=week.dataset.weekStart) && t.due<=week.dataset.weekEnd));
    if (!weeks.length) group(table,tasks,true);
    else group(table,tasks.filter(t=>t.due>weeks.at(-1).dataset.weekEnd),true);
    const checklist=document.getElementById('plannerUnitChecklist'), weekStart=options.weekStart;
    if (!weekStart || !checklist) return;
    const next=g.PlannerWeeklyModel.addDays(weekStart,7);
    group(checklist.querySelector('.uc-week'),tasks.filter(t=>t.due<next));
    group(checklist.querySelector('.uc-review'),tasks.filter(t=>t.due>=next && t.due<g.PlannerWeeklyModel.addDays(next,7)));
  }
  async function commit(change) {
    const bank=await catalog();
    try {
      return await records.update(prior=>{
        const day=today();
        if (change.date!==day) throw Error('날짜가 바뀌었어요. 오늘 일정에서 다시 표시해 주세요.');
        return g.PlannerOxModel.apply(bank,prior,change,day);
      });
    } catch (error) {
      await refresh();
      throw error;
    }
  }
  function showGraph() {
    if (dialog?.open) {
      const chart=dialog.querySelector('[data-ox-standalone-graph]');
      chart.hidden=false; records.mount(chart);
      chart.scrollIntoView({block:'start'});
    } else options.onGraph?.();
  }
  async function refresh() {
    if (!dock.isConnected) return;
    const seq=++revision;
    try {
      const attempts=await records.read();
      if (seq!==revision) return;
      const hasOx=attempts.some(a=>a.track==='curriculum' && a.unitId.startsWith('didimdol22-'));
      if (!dock.open && !hasOx) {schedules({units:[]},[]);return;}
      const bank=await catalog();
      if (seq!==revision || !dock.isConnected) return;
      errorBox.hidden=true;body.hidden=false;
      const day=today();
      schedules(bank,g.PlannerOxModel.state(bank,attempts,day).tasks);
      if (dock.open) {
        g.PlannerOxView.render(body,{catalog:bank,attempts,day,commit,semester:options.context?.actual?.stage,onGraph:showGraph});
        if (queueRequested) {queueRequested=false;g.PlannerOxView.openQueue(body);}
      }
    } catch {
      if (seq!==revision) return;
      errorBox.hidden=false;body.hidden=true;
      const note=document.createElement('p');note.textContent='단원평가 자료를 열지 못했어요. 연결을 확인해 주세요.';
      const retry=document.createElement('button');retry.type='button';retry.textContent='다시 열기';retry.onclick=refresh;
      errorBox.replaceChildren(note,retry);
    }
  }
  function mount(host,next) {
    options=next;
    const route=host.querySelector('.uc-route');
    if (route && !dialog?.open && route.nextElementSibling!==dock) route.after(dock);
    refresh();
  }
  function open(queue=false) {
    const route=document.querySelector('#workspace-panel-map:not([hidden]) .uc-route');
    if (route && !dialog?.open) route.after(dock);
    else if (!dialog?.open) {
      if (!dialog) {
        dialog=document.createElement('dialog'); dialog.className='ox-direct-dialog'; dialog.setAttribute('aria-label','초등 단원평가');
        dialog.innerHTML='<form method="dialog"><button aria-label="단원평가 닫기">닫기</button></form><div data-ox-standalone-graph hidden></div>';
        document.body.append(dialog);
        dialog.addEventListener('close',()=>{dialog.querySelector('[data-ox-standalone-graph]').hidden=true;const r=document.querySelector('#plannerUnitChecklist .uc-route');if(r)r.after(dock);});
      }
      dialog.querySelector('form').after(dock);
      dialog.showModal();
    }
    queueRequested=queue;
    dock.open=true;
    summary.focus({preventScroll:true});dock.scrollIntoView({block:'start'});
    refresh();
  }
  dock.addEventListener('toggle',refresh);
  g.addEventListener('planner-assessment-saved',refresh);
  g.addEventListener('storage',event=>{if(event.key?.endsWith('.assessment-results.v1'))refresh();});
  g.addEventListener('focus',refresh);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  g.PlannerOxPlanner=Object.freeze({mount,open});
})(window);
