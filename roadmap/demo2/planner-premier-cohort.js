/* Three anonymous study paths, with independent curriculum milestones.
 * Rendering and coaching choices are local, pure values. */
(function(g){
'use strict';
const ID='premier2020';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FIELDS=[['school','교과'],['deep','심화'],['thinking','사고력'],['calc','연산']];
const PHASE_SHORT=['기초 표현','교과 병행','실전 적용','개념 보완','수강 선택'];
const ART={a:'dualseven',b:'dualpractice',c:'premierthree'};
const GROUP_NOTE='여러 학생의 공부와 선택을 함께 보는 사례입니다. 같은 교재와 속도가 우리 아이에게도 필수인 것은 아닙니다.';
function data(){const d=g.PlannerPremierCohortData;return d?.id===ID&&Array.isArray(d.phases)&&d.phases.length&&Array.isArray(d.students)?d:null;}
function isCase(id){return id===ID;}
function empty(){return {version:1,choices:{}};}
function restore(value){
 const ui=empty(),d=data();if(value?.version!==1||!d)return ui;
 for(const p of d.phases){const id=value.choices?.[p.id];if(typeof id==='string'&&p.choices?.some(c=>c.id===id))ui.choices[p.id]=id;}
 return ui;
}
function choose(value,phaseId,choiceId){
 const ui=restore(value),p=data()?.phases.find(p=>p.id===phaseId);
 if(p?.choices?.some(c=>c.id===choiceId))ui.choices[phaseId]=choiceId;
 return ui;
}
function caseDefinition(){
 const d=data();if(!d)return null;
 return {group:'recent',aggregate:true,sequenceOnly:true,start:{grade:0,month:3},horizon:5,
  title:d.title,short:d.short||d.title,outcome:d.outcome,intro:d.intro,
  route:(d.commonRoute||[]).join(' → '),thinkingRoute:'기초 사고력 → PRE 1031·필즈 베이직 → 1031 입문·필즈 1과정 → 실전·복습',
  stages:d.phases.map((p,index)=>({id:p.id,at:index,dateLabel:p.period,title:p.title,
   school:p.school,thinking:p.thinking,calc:p.calc,gifted:'',inquiry:p.comment,
   question:p.questions?.[0]?.q||'',answer:p.questions?.[0]?.a||'',study:{school:p.school,deep:p.deep,thinking:p.thinking,calc:p.calc}}))};
}
function model(stageIndex=0,value=null){
 const d=data();if(!d)return null;
 const index=Number.isInteger(stageIndex)?Math.min(d.phases.length-1,Math.max(0,stageIndex)):0;
 const ui=restore(value),phases=d.phases.map((p,i)=>({...p,index:i,selected:i===index}));
 const selected=phases[index];
 return {...d,id:ID,group:'recent',aggregate:true,sequenceOnly:true,stageIndex:index,index,phases,
  students:d.students.map(s=>({...s,milestones:(s.milestones||[]).map((x,i)=>({...x,_order:i})).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||a._order-b._order).map(({_order,...x})=>x)})),
  selected,ui,selectedChoice:selected.choices?.find(c=>c.id===ui.choices[selected.id])||null};
}
function asModel(value){return value?.id===ID&&value.selected&&value.phases?value:model();}
function unavailable(){return '<section class="pco-root pco-empty"><p>사례를 다시 열어 공부의 흐름을 살펴보세요.</p><button type="button" data-history-close>내 계획으로 돌아가기</button></section>';}
function character(id){return g.PlannerCounsellingHistory?.character?.(ART[id])||'';}
function dateLabel(date){const m=/^(\d{4})-(\d{2})$/.exec(date||'');return m?m[1]+'년 '+Number(m[2])+'월':date||'';}
function students(m,compact=false){return '<div class="pco-students'+(compact?' pco-students-compact':'')+'" aria-hidden="true">'+Object.keys(ART).map(id=>'<figure><span class="pco-character">'+character(id)+'</span></figure>').join('')+'</div>';}
function stageButton(m,index,label,attrs=''){return '<button type="button" data-history-stage="'+index+'"'+attrs+'>'+label+'</button>';}
function phaseNav(m){return '<nav class="pco-phase-nav" aria-label="함께 살펴볼 공부의 전환">'+m.phases.map((p,i)=>stageButton(m,i,'<b>'+(i+1)+'</b><span>'+esc(PHASE_SHORT[i]||p.title)+'</span>',' aria-label="'+esc(p.title)+'" aria-pressed="'+p.selected+'"')).join('')+'</nav>';}
function summary(value){
 const m=asModel(value);if(!m)return unavailable();
 return '<nav class="pco-root pco-travel" aria-label="프리미어 합격생 사례 이동"><div class="pco-travel-top"><button type="button" data-history-close>← 내 계획</button><span>합격생들의 공부 · '+(m.stageIndex+1)+' / '+m.phases.length+'</span></div><div class="pco-travel-steps">'+
  stageButton(m,Math.max(0,m.stageIndex-1),'← 이전',' data-history-step="prev"'+(m.stageIndex===0?' disabled':''))+'<strong>'+esc(m.selected.title)+'</strong>'+
  stageButton(m,Math.min(m.phases.length-1,m.stageIndex+1),'다음 →',' data-history-step="next"'+(m.stageIndex===m.phases.length-1?' disabled':''))+'</div></nav>';
}
function advice(m){return m.selectedChoice?'<aside class="pco-advice" aria-live="polite"><small>이 고민부터 살펴보세요</small><strong>'+esc(m.selectedChoice.title)+'</strong><p>'+esc(m.selectedChoice.advice)+'</p></aside>':'';}
function choices(value){
 const m=asModel(value);if(!m)return unavailable();const p=m.selected;
 return '<section class="pco-root pco-coach"><small class="pco-eyebrow">7세 합격생들의 공부와 고민</small><h2>지금 가장 궁금한 공부는?</h2><p>합격생들에게 공통으로 나타난 고민에서, 우리 아이에게 필요한 질문을 골라보세요.</p>'+phaseNav(m)+
  '<div class="pco-coach-heading"><small>'+esc(p.period)+'</small><h3>'+esc(p.questions?.[0]?.q||p.title)+'</h3></div><div class="pco-choice-list" role="group" aria-label="'+esc(p.title)+' 학부모 고민">'+(p.choices||[]).map(c=>'<button type="button" data-cohort-choice="'+esc(c.id)+'" aria-pressed="'+(m.selectedChoice?.id===c.id)+'"><strong>'+esc(c.title)+'</strong><span>'+esc(c.help)+'</span></button>').join('')+'</div>'+advice(m)+'<details class="pco-coach-detail"><summary>이 시기의 공부와 운영</summary><p>'+esc(p.comment)+'</p></details></section>';
}
function hero(m){return '<header class="pco-hero"><div><small class="pco-eyebrow">합격까지 이어진 공통 학습 흐름</small><h3>'+esc(m.title)+'</h3><p>'+esc(m.intro)+'</p><strong class="pco-outcome">'+esc(m.outcome)+'</strong></div>'+students(m)+'</header>';}
function study(m){return '<section class="pco-study" aria-label="'+esc(m.selected.title)+'의 병행 공부"><header><small>'+esc(m.selected.period)+'</small><h3>'+esc(m.selected.title)+'</h3></header><dl>'+FIELDS.filter(([key])=>m.selected[key]).map(([key,label])=>'<div data-study-area="'+key+'"><dt>'+label+'</dt><dd>'+esc(m.selected[key])+'</dd></div>').join('')+'</dl><p class="pco-operation"><b>공부를 이어간 방법</b>'+esc(m.selected.comment)+'</p>'+advice(m)+'</section>';}
function map(value){
 const m=asModel(value);if(!m)return unavailable();
 return '<section class="pco-root pco-map">'+hero(m)+'<ol class="pco-road" aria-label="다섯 가지 공부의 전환">'+m.phases.map((p,i)=>'<li'+(p.selected?' class="pco-active"':'')+'>'+stageButton(m,i,'<span class="pco-step">'+(i+1)+'</span><small>'+esc(p.period)+'</small><strong>'+esc(p.title)+'</strong>',' aria-pressed="'+p.selected+'"')+'</li>').join('')+'</ol>'+study(m)+'<p class="pco-note">'+GROUP_NOTE+'</p></section>';
}
function milestoneFields(x){return '<dl>'+FIELDS.filter(([key])=>x[key]).map(([key,label])=>'<div><dt>'+label+'</dt><dd>'+esc(x[key])+'</dd></div>').join('')+'</dl>';}
function commonTimeline(value){
 const m=asModel(value);if(!m)return [];
 const byDate=new Map();
 for(const s of m.students)for(const x of s.milestones){
  if(!byDate.has(x.date))byDate.set(x.date,{date:x.date,school:[],deep:[],thinking:[],calc:[],notes:[]});
  const row=byDate.get(x.date);for(const [key] of FIELDS)if(x[key]&&!row[key].includes(x[key]))row[key].push(x[key]);
  if(x.note&&!row.notes.includes(x.note))row.notes.push(x.note);
 }
 return [...byDate.values()].sort((a,b)=>a.date.localeCompare(b.date));
}
function commonDate(m,date){const match=/^(\d{4})-(\d{2})$/.exec(date||'');return match?(7+Number(match[1])-m.ageYear)+'세 '+Number(match[2])+'월':date||'';}
function sharedFields(row){return '<dl>'+FIELDS.filter(([key])=>row[key].length).map(([key,label])=>'<div><dt>'+label+'</dt><dd>'+row[key].map(esc).join('<br>')+'</dd></div>').join('')+'</dl>';}
function graph(value){
 const m=asModel(value);if(!m)return unavailable();const rows=commonTimeline(m);
 return '<section class="pco-root pco-paths"><header class="pco-section-title"><small>교과·사고력·연산을 함께</small><h3>시기별로 이어지는 공통 학습 흐름</h3><p>합격생들이 다뤘던 교재와 보완할 공부를 나이와 월에 맞춰 모았습니다. 교과를 앞서간 경우와 복습이 필요했던 경우를 함께 참고하세요.</p></header><section class="pco-student-path"><header><div><h4>기초 다지기에서 선발 준비까지</h4><p>교과와 사고력을 병행하고, 계산과 조건 읽기를 꾸준히 보완합니다.</p></div></header><div class="pco-path-scroll" tabindex="0" role="region" aria-label="합격생 공통 월별 공부 흐름"><ol>'+rows.map(x=>'<li><span class="pco-milestone-dot" aria-hidden="true"></span><time datetime="'+esc(x.date)+'">'+esc(commonDate(m,x.date))+'</time>'+sharedFields(x)+'</li>').join('')+'</ol></div></section><p class="pco-note">여러 사례에서 살펴본 학습 범위를 모았습니다. 한 학생이 같은 달에 모든 교재를 공부했다는 뜻은 아닙니다.</p></section>';
}
function table(value){
 const m=asModel(value);if(!m)return unavailable();const rows=commonTimeline(m);
 return '<section class="pco-root pco-curriculum"><header class="pco-section-title"><small>시기별 병행 공부</small><h3>교과·심화·사고력·연산을 한눈에</h3><p>합격생들의 공부에서 참고할 범위를 공통 표로 모았습니다. 현재 교과 진도와 혼자 해결하는 정도에 맞춰 필요한 공부를 골라보세요.</p></header><div class="pco-student-table"><div class="pco-table-scroll" tabindex="0" role="region" aria-label="합격생 공통 교재와 학년·학기 표"><table><caption>나이·월별로 살펴보는 병행 공부</caption><thead><tr><th scope="col">시점</th>'+FIELDS.map(([,label])=>'<th scope="col">'+label+'</th>').join('')+'<th scope="col">함께 살핀 점</th></tr></thead><tbody>'+rows.map(x=>'<tr><th scope="row"><time datetime="'+esc(x.date)+'">'+esc(commonDate(m,x.date))+'</time></th>'+FIELDS.map(([key])=>'<td>'+(x[key].length?x[key].map(esc).join('<br>'):'—')+'</td>').join('')+'<td>'+x.notes.map(esc).join('<br>')+'</td></tr>').join('')+'</tbody></table></div></div><p class="pco-note">교재와 진도는 사례에서 살펴본 범위이며, 같은 시기에 모두 해야 하는 필수 과정은 아닙니다.</p></section>';
}
function qa(items,openFirst=false){return (items||[]).map((x,i)=>'<details'+(openFirst&&i===0?' open':'')+'><summary>'+esc(x.q)+'</summary><p>'+esc(x.a)+'</p></details>').join('');}
function records(value){
 const m=asModel(value);if(!m)return unavailable();
 return '<section class="pco-root pco-records"><header class="pco-section-title"><small>공부와 부모의 선택을 함께</small><h3>전환마다 달라진 고민</h3><p>'+esc(m.intro)+'</p></header>'+m.phases.map((p,i)=>'<section class="pco-concern'+(p.selected?' pco-current-concern':'')+'"><header>'+stageButton(m,i,'<span>'+(i+1)+'</span><strong>'+esc(p.title)+'</strong>',' aria-pressed="'+p.selected+'"')+'<small>'+esc(p.period)+'</small></header><p>'+esc(p.comment)+'</p>'+qa(p.questions,p.selected)+'</section>').join('')+((m.notes||[]).length?'<aside class="pco-closing-notes">'+m.notes.map(n=>'<p>'+esc(n)+'</p>').join('')+'</aside>':'')+'</section>';
}
function questions(value){
 const m=asModel(value);if(!m)return unavailable();
 const items=[...(m.selected.questions||[]),{q:'합격생들의 교재와 속도를 그대로 따라가야 하나요?',a:'같은 나이에도 교과·심화·사고력·연산의 현재 수행은 다릅니다. 혼자 읽고 풀 수 있는 범위, 다시 설명이 필요한 부분, 일주일의 복습 시간을 함께 살펴 필요한 공부를 고르세요.'},{q:'합격한 뒤에는 무엇을 기준으로 공부를 이어가나요?',a:'새 진도와 함께 지금 배우는 내용을 스스로 풀고 설명하는지 봅니다. 영어와 다른 수업, 과제와 휴식까지 한 주에 넣어 보고 감당할 수 있는 공부부터 이어갑니다.'}];
 return '<section class="pco-root pco-questions"><h3>'+esc(m.selected.title)+' · 학부모 질문</h3>'+qa(items,true)+'</section>';
}
g.PlannerPremierCohort=Object.freeze({isCase,caseDefinition,empty,restore,choose,model,commonTimeline,summary,choices,map,graph,table,records,questions});
})(window);
