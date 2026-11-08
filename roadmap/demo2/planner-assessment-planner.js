(function (g) {
  'use strict';
  const store=g.PlannerStorage, records=g.PlannerAssessmentRecords;
  const hosts=new Set();
  const currentDay=()=>g.PlannerWeeklyModel.today();
  let cacheKey, cached, pending=null, message='', busy=false;
  function read() {
    const raw=store.getLatestItem(records.key);
    if (!cached || cacheKey!==raw) {cacheKey=raw; cached=records.decode(raw);}
    return cached;
  }
  function prepare(doc) {
    const attempts=records.validate(doc,currentDay());
    pending=records.merge([],attempts);
    message='';
  }
  function onError(err) { pending=null; message=err.message || '결과를 읽지 못했어요.'; }
  async function save() {
    const chosen=pending;
    if (!chosen || busy) return;
    busy=true; refresh();
    const persist=async()=>{
      const prior=await records.decode(store.getLatestItem(records.key));
      const next=records.merge(prior,chosen);
      const text=await records.encode(next);
      if (text.length > 200000 || (g.RoadmapCloud && !g.RoadmapCloud.safeDocument({...g.RoadmapCloud.snapshot(),[records.key]:text}))) {
        throw new RangeError('이 로드맵의 저장 용량을 넘어요. 기존 기록은 유지됩니다.');
      }
      // Reading the shared copy inside the lock preserves imports in another tab.
      store.setItem(records.key,text);
      message=chosen.length+'개 평가를 반영했어요.';
      if (store.status()==='memory') message+=' 저장 공간을 쓸 수 없어 이 창에서만 유지돼요.';
    };
    try {
      if (g.navigator.locks) await g.navigator.locks.request('gfield.assessments.'+g.RoadmapMember.user_id,persist);
      else await persist();
      pending=null;
    } catch (err) { message=err instanceof RangeError ? err.message : '기존 결과와 합쳐 저장하지 못했어요. 다시 시도해 주세요.'; }
    busy=false; refresh();
  }
  async function mount(host) {
    if (!host) return;
    for (const el of hosts) if (!el.isConnected) hosts.delete(el);
    hosts.add(host);
    if (!host.querySelector('[data-results-chart]')) {
      host.innerHTML='<div data-results-chart></div><details class="assessment-transfer" data-results-transfer><summary>평가 결과 가져오기</summary>'+
        '<p>우리 아이의 단원평가에서 내보낸 결과 파일을 선택하세요. 같은 평가를 다시 가져오면 수정한 내용으로 갱신돼요.</p>'+
        '<label>결과 파일 <input type="file" accept=".json,application/json" data-results-file></label></details>'+
        '<div class="assessment-transfer" data-results-confirm hidden><p></p><button type="button" data-results-save>이 아이의 그래프에 반영</button> <button type="button" data-results-cancel>취소</button></div>'+
        '<p data-results-status role="status"></p>';
      host.querySelector('[data-results-file]').addEventListener('change',async e=>{
        const file=e.target.files[0]; e.target.value='';
        if (!file || busy) return;
        try {
          if (file.size>12000000) throw Error('결과 파일이 너무 커요. 평가 기간을 나누어 가져와 주세요.');
          prepare(JSON.parse(await file.text()));
        } catch (err) {onError(err instanceof SyntaxError?Error('평가 결과 JSON 파일을 선택해 주세요.'):err);}
        refresh();
      });
      host.querySelector('[data-results-save]').addEventListener('click',save);
      host.querySelector('[data-results-cancel]').addEventListener('click',()=>{if(!busy){pending=null;message='';refresh();}});
    }
    const bar=host.querySelector('[data-results-confirm]');
    bar.hidden=!pending;
    if (pending) {
      const dates=pending.map(a=>a.date).sort();
      const titles=[...new Set(pending.map(a=>a.unitTitle))];
      bar.querySelector('p').textContent=pending.length+'개 평가 · '+dates[0]+' ~ '+dates.at(-1)+' · '+titles.slice(0,2).join(', ')+(titles.length>2?' 외 '+(titles.length-2)+'개 단원':'');
    }
    for (const b of bar.querySelectorAll('button')) b.disabled=busy;
    host.querySelector('[data-results-status]').textContent=message;
    try {
      const source=read(), attempts=await source;
      if (source!==cached || !host.isConnected) return;
      g.PlannerAssessmentView.render(host.querySelector('[data-results-chart]'),{attempts,day:currentDay()});
    } catch {host.querySelector('[data-results-status]').textContent='저장한 평가 기록을 읽지 못했어요. 이 브라우저에서 다시 열어 주세요.';}
  }
  function refresh() {for(const el of [...hosts]) if(el.isConnected) mount(el);else hosts.delete(el);}
  g.addEventListener('focus',refresh);
  g.addEventListener('storage',e=>{if(e.key?.endsWith('.assessment-results.v1')) refresh();});
  const transfer=new URLSearchParams(g.location.search).get('assessment')==='1';
  if (transfer && g.opener) {
    // A local teacher HTML document has an opaque (null) origin. The ready
    // signal contains no account details. Incoming rows still require review.
    g.addEventListener('message',event=>{
      if (busy || event.source!==g.opener || !['null',g.location.origin].includes(event.origin) ||
        event.data?.type!=='gfield-assessment-import-v1') return;
      try {prepare(event.data.document);} catch(err) {onError(err);}
      refresh();
    });
    try {g.opener.postMessage({type:'gfield-assessment-ready-v1'},'*');} catch {}
  }
  g.PlannerAssessmentPlanner=Object.freeze({mount});
})(window);
