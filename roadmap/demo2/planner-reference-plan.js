/* A public case is a reference for a decision, never an imported child profile. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TOPICS={
 book:{title:'현재 교과에서 다음 범위 설계',note:'사례의 고1 진도와 별도로, 지금 공부에서 이어갈 교재·범위를 고릅니다.',kind:'transition',page:'book'},
 deep:{title:'교과와 심화의 병행 방식 설계',note:'배운 범위를 반복하는 심화와 새 교과의 시기를 나누어 봅니다.',kind:'transition',page:'deep'},
 science:{title:'과학의 시작·병행 시점 설계',note:'우리 아이의 수학 진도와 현재 과학 교재를 기준으로 이어갑니다.',kind:'science'},
 tempo:{title:'감당할 학습량과 추가 회차 비교',note:'기존 복습·심화·연산을 유지하며 한 주의 부담을 비교합니다.',kind:'transition',page:'tempo'},
 table:{title:'사고력·연산의 월별 과정 확인',note:'현재 공부하는 사고력·연산을 각각의 과정으로 확인합니다.',kind:'table'},
 center:{title:'영재원 대비를 별도로 살펴보기',note:'기존 공부의 속도를 유지하며 필요한 대비를 추가로 봅니다.',kind:'gifted'},
 goal:{title:'진학 목표부터 확인하기',note:'중등 영재원은 영재학교·과학고 준비 경로에서 연결합니다.',kind:'goal'}
};
const OPTIONS={publicMiddle:['deep','science','tempo'],publicKsa:['book','science','tempo'],publicDaegu:['science','tempo','book'],publicGyeonggi:['table','center','tempo']};
const SHORT={book:'교과 범위',deep:'심화 병행',science:'과학 병행',tempo:'학습량',table:'사고력·연산',center:'영재원 대비',goal:'진학 목표'};
function empty(){return {version:1,caseId:null,stageId:null,topic:null,enabled:false,trail:[]};}
function validOrigin(value,cases){const c=cases?.[value?.caseId];return c?.group==='public'&&OPTIONS[value.caseId]&&c.stages.some(x=>x.id===value.stageId);}
function validTopic(value){return OPTIONS[value.caseId]?.includes(value.topic)||(value.topic==='goal'&&OPTIONS[value.caseId]?.includes('center'));}
function key(value){return [value.caseId,value.stageId,value.topic].join('/');}
function identity(value){return key(value.topic==='goal'?{...value,topic:'center'}:value);}
function entry(value){return {caseId:value.caseId,stageId:value.stageId,topic:value.topic};}
function restore(value,cases){
 const s=empty();if(value?.version!==1||!validOrigin(value,cases))return s;
 const topic=validTopic(value)?value.topic:null,trail=[],positions=new Map();
 // Stable case/stage/topic keys keep each reference once. Old one-topic saves migrate here.
 for(const item of [...(Array.isArray(value.trail)?value.trail:[]),...(topic?[value]:[])]){
  if(!validOrigin(item,cases)||!validTopic(item))continue;
  const id=identity(item);if(positions.has(id))trail[positions.get(id)]=entry(item);else{positions.set(id,trail.length);trail.push(entry(item));}
 }
 return {...s,caseId:value.caseId,stageId:value.stageId,topic,enabled:value.enabled===true,trail};
}
function start(caseId,stageId,cases,previous){return restore({version:1,caseId,stageId,enabled:true,trail:restore(previous,cases).trail},cases);}
function topicInfo(id,context={}){const item={id,...TOPICS[id]};if(!context.coursePlanning||!['transition','table','science'].includes(item.kind))return item;return {...item,kind:'college',page:'study',title:({book:'현재 과목에서 다음 공부 설계',deep:'현재 과목의 심화·병행 계획 설계',tempo:'현재 과목의 학습량 살펴보기',science:'현재 과학 과목·교재 설계',table:'현재 과정의 병행 공부 확인'})[id],note:'우리 아이의 교육과정·과목·교재를 기준으로 병행할 공부를 살펴봅니다.'};}
function options(v,cases,context={}){const s=restore(v,cases);return (OPTIONS[s.caseId]||[]).map(id=>id==='center'&&context.giftedAllowed===false?'goal':id).map(id=>topicInfo(id,context));}
function choose(v,topic,cases,context={}){const s=restore(v,cases);return context.ready!==false&&s.enabled&&options(s,cases,context).some(o=>o.id===topic)?restore({...s,topic},cases):s;}
function contextualTopic(topic,context){return topic==='center'&&context.giftedAllowed===false?'goal':topic;}
function destination(v,cases,context={}){const s=restore(v,cases),id=contextualTopic(s.topic,context);return context.ready&&s.enabled&&s.topic?topicInfo(id,context):null;}
function revisit(v,stepKey,cases){const s=restore(v,cases),selected=s.trail.find(x=>key(x)===stepKey);return selected?restore({...s,...selected,enabled:true},cases):s;}
function steps(v,cases,context={}){const s=restore(v,cases);return s.trail.map(item=>{const c=cases[item.caseId],stage=c.stages.find(x=>x.id===item.stageId),id=contextualTopic(item.topic,context);return {...item,key:key(item),title:topicInfo(id,context).title,short:SHORT[id],sourceTitle:c.title,stageTitle:stage.title,date:stage.dateLabel||'',note:context.notes?.[id]||'',active:key(s)===key(item)};});}
function origin(v,cases){const s=restore(v,cases),c=cases?.[s.caseId],stage=c?.stages.find(x=>x.id===s.stageId);return c&&stage?{...s,title:c.title,stageTitle:stage.title,date:stage.dateLabel||'',topicTitle:TOPICS[s.topic]?.title||''}:null;}
function breadcrumb(v,cases){const m=origin(v,cases);if(!m?.enabled)return '';return '<details class="reference-plan-context"><summary><small>참고한 공개 사례</small><strong>'+esc(m.title)+'</strong></summary><span>'+esc([m.date,m.stageTitle,m.topicTitle].filter(Boolean).join(' · '))+'</span><div><button type="button" data-reference-return>사례로 돌아가기</button><button type="button" data-reference-choices>참고할 부분 다시 고르기</button><button type="button" data-reference-dismiss>참고 표시 접기</button></div></details>';}
function renderTrail(v,cases,context={},view='map'){
 const s=restore(v,cases),items=steps(s,cases,context);if(!s.enabled||!items.length)return '';
 const button=(item,index)=>'<button type="button" data-reference-step="'+esc(item.key)+'"'+(item.active?' aria-current="step"':'')+' aria-label="'+esc(item.title+' 다시 살펴보기')+'"><b aria-hidden="true">'+String(index+1).padStart(2,'0')+'</b><strong>'+esc(item.short)+'</strong></button>';
 const folded=['graph','table'].includes(view),html='<section class="reference-design-trail'+(view==='records'?' reference-design-records':'')+'" aria-label="사례에서 참고해 살펴본 설계">'+(folded?'':'<header><h3>함께 살펴본 설계</h3><small>'+items.length+'가지</small></header>')+'<ol>'+items.map((item,index)=>'<li>'+button(item,index)+(view==='records'?'<p class="reference-live-plan">'+esc(item.note||'선택 화면에서 우리 아이의 계획을 살펴봅니다.')+'</p><details><summary>참고한 사례 보기</summary><p>'+esc(item.sourceTitle)+'<br>'+esc([item.date,item.stageTitle].filter(Boolean).join(' · '))+'</p><button type="button" data-reference-source="'+esc(item.key)+'">이 사례의 해당 시점으로 돌아가기</button></details>':'')+'</li>').join('')+'</ol>'+(view==='records'?'<p class="reference-trail-note">설계 주제를 누르면 다시 조정할 수 있습니다. 위 내용은 현재 선택한 계획으로, 이수 완료를 뜻하지 않습니다.</p>':'')+'</section>';
 return folded?'<details class="reference-design-fold"><summary>함께 살펴본 설계 <b>'+items.length+'가지</b></summary>'+html+'</details>':html;
}
function render(v,cases,context={}){const m=origin(v,cases);if(!m)return '';const current=context.current||{};const currentSummary='<details class="reference-current"><summary>우리 아이의 현재 공부 · 교과·심화·사고력·연산</summary><dl>'+[['school','교과'],['deep','심화'],['thinking','사고력'],['calc','연산']].map(([id,t])=>'<div><dt>'+t+'</dt><dd>'+esc(current[id]||'아직 선택 전')+'</dd></div>').join('')+'</dl></details>';return '<section class="reference-plan-choices">'+(context.ready?'<div class="pathway-options study-options">'+options(v,cases,context).map(o=>'<button type="button" data-reference-topic="'+o.id+'" aria-pressed="'+(m.topic===o.id)+'"><strong>'+esc(o.title)+'</strong><span>'+esc(o.note)+'</span></button>').join('')+'</div>':'<p>현재 학년과 공부를 먼저 고르면 교재·월별 과정에 연결할 수 있습니다.</p><div class="pathway-options"><button type="button" data-reference-intake><strong>우리 아이의 현재 공부 선택하기</strong></button></div>')+currentSummary+'<details class="choice-help"><summary>사례를 참고하는 방법</summary><p>공부를 이어간 방식만 참고하고, 교재·학기·회차는 우리 아이의 현재 공부에서 고릅니다. 참고한 사례와 돌아가기 버튼은 오른쪽 지도에 남아 있습니다.</p></details></section>';}
function questions(){return '<section class="pathway-parent-questions"><details><summary>합격생의 교재와 진도를 그대로 가져오나요?</summary><p>사례는 공부를 연결한 방식을 참고하는 기준입니다. 우리 아이의 현재 교과·심화·사고력·연산은 유지하고, 선택한 영역에서 교재·범위·회차를 직접 고릅니다.</p></details><details><summary>사례와 같은 학년까지 따라가야 하나요?</summary><p>사례의 도달 학년은 의무 목표가 아닙니다. 현재 풀이와 복습 여력을 확인하고, 필요한 교과·심화·과학을 나누어 설계합니다.</p></details><details><summary>사고력과 연산도 사례에 맞춰 바뀌나요?</summary><p>각각의 현재 과정으로 이어집니다. 공개 자료에 없는 사고력 단계나 연산 권을 임의로 넣지 않습니다.</p></details></section>';}
g.PlannerReferencePlan=Object.freeze({empty,restore,start,options,choose,destination,revisit,steps,origin,breadcrumb,renderTrail,render,questions});
})(window);
