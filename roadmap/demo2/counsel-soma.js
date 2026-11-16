/* Approved cohort reference + family-reported study needs. No inferred scores. */
(function(g){
 'use strict';
 const axes=[{id:'thinking',label:'사고력',track:'thinking'},{id:'supplement',label:'부교재',track:'thinking'},{id:'arithmetic',label:'연산',track:'arithmetic'},{id:'geometry',label:'도형',track:'thinking'}];
 const statuses={unknown:'아직 확인하지 않았어요',solo:'혼자 풀 수 있어요',help:'도움이 필요해요',unlearned:'아직 배우지 않았어요'};
 const clean=(value,max)=>String(value??'').trim().slice(0,max);
 function source(ctx){
  const current=g.PLANNER_SOMA_CURRENT;
  return current&&(ctx?.sources||[]).find(r=>(!r.status||r.status==='approved')&&String(r.source||'').includes(current.source.sha256)&&/현재\s*5세/u.test(r.body||''));
 }
 function restore(value){
  const rows=Array.isArray(value)?value:value?.rows||[];
  return axes.map(axis=>{const row=rows.find(r=>r?.id===axis.id)||{};return {id:axis.id,book:clean(row.book,100),unit:clean(row.unit,120),status:Object.hasOwn(statuses,row.status)?row.status:'unknown'};});
 }
 const when=(current,n)=>(current.startYear+Math.floor(n/12))+'.'+String(n%12+1).padStart(2,'0');
 function monthlyRows(current=g.PLANNER_SOMA_CURRENT){
  if(!current)return [];
  const points=[...new Set([current.start,current.end,...current.tracks.flatMap(t=>t.blocks.flatMap(b=>[b.start,b.end]))])].sort((a,b)=>a-b);
  return points.slice(0,-1).map((start,i)=>({start,end:points[i+1],period:when(current,start)+(points[i+1]-1===start?'':' ~ '+when(current,points[i+1]-1)),cells:current.tracks.map(t=>t.blocks.find(b=>b.start<=start&&start<b.end)?.label||'—')}));
 }
 function evaluate(value){
  return restore(value).map(row=>{
   const axis=axes.find(a=>a.id===row.id);
   const ready=row.status==='help'&&!!row.book&&!!row.unit;
   let advice=row.status==='solo'?'혼자 해결한 범위의 학습을 이어가요.':row.status==='unlearned'?'수업에서 배울 범위를 먼저 확인해요. 미학습을 부족한 수행률로 계산하지 않아요.':row.status==='help'?(ready?'현재 교재의 이 범위를 작은 분량으로 다시 풀고, 다음 주에 새 문제로 확인해요.':'보완할 교재와 단원·쪽수를 적으면 실제 일정에 연결할 수 있어요.'):'현재 범위에서 도움 없이 푸는 모습을 먼저 확인해요.';
   return {...row,label:axis.label,track:row.id==='supplement'&&/디딤돌|교과/u.test(row.book)?'curriculum':axis.track,ready,advice};
  });
 }
 function prefill(ctx){
  const rows=restore(ctx.somaAssessment);
  if(ctx.somaAssessment)return rows;
  const text=String(ctx.currentBooks||'');
  const patterns={thinking:/\bRay\s*(?:Kids\s*)?[AB]\s*\d\s*-\s*\d/iu,supplement:/(?:키즈\s*팩토|초등\s*팩토|디딤돌)\s*[A-Z0-9가-힣.+~-]*/iu,arithmetic:/소마(?:셈|연산)\s*[PA-B]?\s*\d*(?:학년)?/u,geometry:/소마\s*도형\s*[PA-B]?(?:단계)?/u};
  for(const row of rows)row.book=text.match(patterns[row.id])?.[0]?.trim()||'';
  return rows;
 }
 function summaries(value){
  const rows=evaluate(value);
  // Preserve all four domains within the API bounds; full ranges stay in the
  // confirmed roadmap assignments rather than being dropped from the last row.
  return {currentBooks:rows.filter(r=>r.book).map(r=>r.label+' · '+r.book).join('\n').slice(0,600),soloRange:rows.filter(r=>r.status!=='unknown').map(r=>r.label+(r.unit?' · '+r.unit.slice(0,100):'')+' · '+statuses[r.status]).join('\n').slice(0,600)};
 }
 function proposals(value,settings){return evaluate(value).filter(r=>r.ready).map(r=>({track:r.track,book:r.book,unit:r.unit,practice:settings.practice,recheck:settings.recheck,practiceCount:settings.practiceCount,recheckCount:settings.recheckCount}));}
 function mount(host,ctx,{onProfile,openSource}={}){
  const evidence=source(ctx);if(!host||!evidence)return false;
  const doc=g.document,el=(tag,attrs={},text)=>{const n=doc.createElement(tag);for(const [key,value]of Object.entries(attrs))n.setAttribute(key,value);if(text!=null)n.textContent=text;return n;};
  host.replaceChildren();host.className='cs-soma';
  const title=el('h3',{},'참고용 · 현재 5세 소마 월별 운영표');
  host.append(title,el('p',{},'2026년 현재 5세의 학원 운영 사례입니다. Ray A3-3은 교재 진도이며 별도 반 레벨이 아닙니다. 이 표를 아이의 필수 진도나 부족 판단 기준으로 쓰지 않습니다.'));
  const scroll=el('div',{class:'cs-table-scroll',tabindex:'0',role:'region','aria-label':'현재 5세 소마 월별 흐름 표. 좌우로 이동할 수 있습니다.'});
  const table=el('table');table.append(el('caption',{},'사고력·부교재·연산·도형 · 2026.11~2028.08'));
  const head=el('thead'),hr=el('tr');for(const text of ['기간','사고력','부교재','연산','도형'])hr.append(el('th',{scope:'col'},text));head.append(hr);table.append(head);
  const body=el('tbody');for(const row of monthlyRows()){const tr=el('tr');tr.append(el('th',{scope:'row'},row.period));for(const cell of row.cells)tr.append(el('td',{},cell));body.append(tr);}table.append(body);scroll.append(table);host.append(scroll);
  const note=el('p',{class:'cs-note'},'—는 원표에 표시되지 않은 구간입니다. 표의 마지막 달을 교재 완료월로 보지 않습니다. 연산의 B5~B8은 원표 표기이며, 소마연산 3학년은 교재 이름입니다.');
  const cite=el('button',{type:'button',class:'cc-citation'},'운영표 근거 보기');cite.onclick=()=>openSource?.(evidence.id);note.append(cite);host.append(note);
  const form=el('form',{class:'cs-assessment'});form.append(el('h4',{},'우리 아이는 지금 어디까지 혼자 하나요?'),el('p',{},'쓰고 있는 교재의 단원·쪽수와 풀이 모습을 알려주세요. 아래 입력한 범위로 이번 주 보완을 정해요. 학원 참고표보다 느리다는 이유로 부족으로 보지 않아요.'));
  const controls=new Map(),initial=prefill(ctx);
  for(const axis of axes){
   const row=initial.find(r=>r.id===axis.id),fields=el('fieldset');fields.append(el('legend',{},axis.label));
   const bookLabel=el('label',{},axis.label+' 현재 교재'),book=el('input',{type:'text',maxlength:'100',value:row.book,placeholder:'실제로 공부 중인 교재'});bookLabel.append(book);
   const rangeLabel=el('label',{},axis.label+' 단원·쪽수'),unit=el('input',{type:'text',maxlength:'120',value:row.unit,placeholder:'예: 규칙 찾기 / 12~15쪽'});rangeLabel.append(unit);
   const statusLabel=el('label',{},axis.label+' 혼자 푸는 정도'),status=el('select',{'aria-label':axis.label+' 혼자 푸는 정도'});for(const [value,label]of Object.entries(statuses)){const option=el('option',{value},label);option.selected=value===row.status;status.append(option);}statusLabel.append(status);
   fields.append(bookLabel,rangeLabel,statusLabel);form.append(fields);controls.set(axis.id,{book,unit,status});
  }
  let defaults;try{defaults=g.RoadmapCounselPlan.defaultDates();}catch{host.append(el('p',{},'현재 학습 일정을 읽지 못했어요. 새로고침 후 다시 확인해 주세요.'));return true;}
  const settings={...defaults,...ctx.somaAssessment?.settings};
  if(defaults.practice>g.PlannerWeeklyModel.today())form.append(el('p',{class:'cs-note'},'정해둔 학습 시작일에 맞춰 '+defaults.practice+'부터 보완 일정을 연결합니다.'));
  const dates=el('div',{class:'cs-dates'}),inputs={};
  for(const [key,label,type,min,max]of [['practice','이번 주 보완일','date',defaults.practice,''],['recheck','다음 주 재점검일','date',defaults.min,defaults.max],['practiceCount','보완 문제 수','number','1','99'],['recheckCount','재점검 문제 수','number','1','99']]){
   const l=el('label',{},label),input=el('input',{type,required:'',min,value:String(settings[key]??(key==='practiceCount'?3:2)),...(max?{max}:{})});l.append(input);dates.append(l);inputs[key]=input;
  }
  form.append(el('p',{class:'cs-note'},'지필드 보완 제안은 기본 3문제 → 다음 주 새 문제 2개입니다. 아이의 실제 분량에 맞춰 날짜와 문제 수를 바꿀 수 있어요.'),dates);
  const preview=el('div',{class:'cs-needs',role:'status','aria-live':'polite'}),submit=el('button',{type:'submit',class:'cc-primary'},'입력한 범위로 이번 주 학습 연결');
  const status=el('p',{class:'cs-status',role:'status'});if(ctx.somaMessage)status.textContent=ctx.somaMessage;
  form.append(preview,submit,status);host.append(form);
  const snapshot=()=>({rows:axes.map(axis=>{const f=controls.get(axis.id);return {id:axis.id,book:f.book.value,unit:f.unit.value,status:f.status.value};}),settings:{practice:inputs.practice.value,recheck:inputs.recheck.value,practiceCount:inputs.practiceCount.valueAsNumber,recheckCount:inputs.recheckCount.valueAsNumber}});
  const draw=()=>{
   preview.replaceChildren();
   for(const row of evaluate(snapshot())){
    const f=controls.get(row.id);f.book.required=f.unit.required=row.status==='help';
    const p=el('p');p.append(el('strong',{},row.label+' · '+statuses[row.status]),doc.createTextNode(' '+row.advice));preview.append(p);
   }
  };
  form.addEventListener('input',event=>{event.target.setCustomValidity?.('');draw();});form.addEventListener('change',draw);
  inputs.practice.addEventListener('input',()=>{
   if(!/^\d{4}-\d{2}-\d{2}$/.test(inputs.practice.value))return;
   const bounds=g.RoadmapCounselPlan.dateBounds(inputs.practice.value);inputs.recheck.min=bounds.min;inputs.recheck.max=bounds.max;
   if(inputs.recheck.value<bounds.min||inputs.recheck.value>bounds.max)inputs.recheck.value=g.PlannerWeeklyModel.addDays(inputs.practice.value,7);
  });
  const owner=g.RoadmapMember?.user_id;
  form.onsubmit=async event=>{
   event.preventDefault();if(submit.disabled)return;
   for(const f of controls.values())for(const input of [f.book,f.unit])input.setCustomValidity(input.required&&!input.value.trim()?'도움이 필요한 교재와 단원·쪽수를 적어 주세요.':'');
   if(!form.reportValidity())return;
   const state=snapshot(),plans=proposals(state,state.settings);submit.disabled=true;
   try{
    if(g.RoadmapGuest||!owner||owner!==g.RoadmapMember?.user_id)throw Error('학생 계정을 다시 확인해 주세요.');
    const results=plans.length?await g.RoadmapCounselPlan.saveBatch(plans,owner):[];
    const added=results.filter(r=>!r.duplicate).length;
    const message=plans.length?(added?'보완 '+added+'개 범위와 다음 주 재점검을 로드맵에 연결했어요.':'같은 주의 교재·범위가 이미 연결돼 있어요.'):'입력한 풀이 범위를 반영했어요. 도움이 필요하다고 확인한 범위가 없어 보완 일정을 추가하지 않았어요.';
    status.textContent=message;g.PlannerUnitPlanner?.refresh();onProfile?.(state,summaries(state),message);
    submit.disabled=false;
   }catch(error){status.textContent=error.message||'일정을 저장하지 못했어요. 다시 시도해 주세요.';submit.disabled=false;}
  };
  draw();
  if(ctx.somaMessage){const link=el('button',{type:'button',class:'cs-checklist'},'이번 주 체크리스트 열기');link.onclick=()=>g.RoadmapCounselPlan.openChecklist();host.append(link);}
  return true;
 }
 g.RoadmapCounselSoma=Object.freeze({axes,statuses,restore,source,monthlyRows,evaluate,summaries,proposals,mount});
})(typeof window==='undefined'?globalThis:window);
