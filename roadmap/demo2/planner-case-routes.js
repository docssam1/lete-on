/* Case-only continuations reuse the existing pathway catalogue.
 * Route choices do not assign admissions or completion dates, read storage,
 * or change the learner's standard/custom plan.
 */
(function(global){
'use strict';
const FAMILY=Object.freeze({
 gifted:Object.freeze({title:'영재원 대비',prefix:Object.freeze(['center']),root:'center'}),
 middle:Object.freeze({title:'중등 학습 이어가기',prefix:Object.freeze(['academic','middle']),root:'middle'})
});
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const catalogue=()=>global.PlannerPathways;
const isFamily=key=>typeof key==='string'&&Object.hasOwn(FAMILY,key);
function validTrail(value,family){
 const X=catalogue();if(!X||!isFamily(family))return [];
 const trail=X.normalize(value),prefix=FAMILY[family].prefix;
 return prefix.every((id,i)=>trail[i]===id)?trail:[];
}
function restore(value){
 const input=value&&typeof value==='object'&&!Array.isArray(value)&&value.version===1?value:{};
 const state={version:1,active:null,trails:{gifted:[],middle:[]},focus:{gifted:null,middle:null}};
 for(const family of Object.keys(FAMILY)){
  const trail=validTrail(input.trails?.[family],family);state.trails[family]=trail;
  const requested=input.focus?.[family];state.focus[family]=trail.includes(requested)&&requested!=='academic'?requested:trail.at(-1)||null;
 }
 if(isFamily(input.active)&&state.trails[input.active].length)state.active=input.active;
 return state;
}
function select(value,family,from,to){
 const state=restore(value),X=catalogue();if(!X||!isFamily(family))return state;
 const config=FAMILY[family];
 if(from==null){
  if(to===config.root){if(!state.trails[family].length)state.trails[family]=[...config.prefix];}
  else if(!state.trails[family].includes(to)||to==='academic')return state;
  state.active=family;state.focus[family]=to;return state;
 }
 const before=state.trails[family];
 if(!before.includes(from)||!X.paths[from]?.next.includes(to))return state;
 const trail=validTrail(X.select(before,from,to),family);if(!trail.length)return state;
 state.trails[family]=trail;state.active=family;state.focus[family]=trail.at(-1);return state;
}
// Goal links operate on the isolated case, never on the learner's saved plan.
function goalEntry(value,key){
 const entries={middle:['middle'],high:['middle','high'],mock:['middle','high','mock'],intro:['middle','contest','intro'],basic:['middle','contest','kmoBasic']};
 if(!Object.hasOwn(entries,key))return restore(value);
 const route=entries[key];
 let state=select(value,'middle',null,'middle');
 for(let i=1;i<route.length;i++)state=select(state,'middle',route[i-1],route[i]);
 return state;
}
function dateLabel(caseModel,offset){
 if(!Number.isFinite(offset))return '시작 시기 확인';
 const known=caseModel?.months?.find(month=>month.offset===offset);
 return known?.label||global.PlannerCase?.dateAt(offset)?.label||'시작 시기 확인';
}
function timing(family,caseModel){
 if(family==='gifted')return caseModel?.state?.gifted==='later'?'지원 시기 재검토 · 지역·해당 연도 요강 확인':'초3 말 지원 검토 · 지역·해당 연도 요강 확인';
 return dateLabel(caseModel,caseModel?.middleStart)+' 시작 · 중등 전체 18개월 계획';
}
function guidance(id){
 const X=catalogue(),path=X.paths[id];
 let sections=[];
 if(global.PlannerCourseGuide){
  const detail=X.detail(id,{audience:'upper',schoolGuide:'elem',deepGuide:'elemDeep'});
  sections=(detail?.sections||[]).map(section=>{
   // The source guide's L0–L2 standard is not a prescription for this L9 case.
   if(/학습 레벨 L0~L2/.test(section.books||''))return {...section,books:section.other,other:''};
   return {...section};
  });
 }
 return {id,title:path.title,short:path.short,summary:path.summary,what:[...path.what],parallel:[...path.parallel],advice:path.advice,books:path.books||'',sections};
}
function model(value,caseModel){
 const state=restore(value),X=catalogue();
 const families=Object.entries(FAMILY).map(([id,config])=>{
  const trail=state.trails[id],visible=trail.filter(key=>key!=='academic'),focused=state.focus[id];
  const next=focused?(X.paths[focused]?.next||[]).filter(to=>validTrail(X.select(trail,focused,to),id).length).map(to=>({id:to,title:X.paths[to].short,summary:X.paths[to].summary})):[];
  return {id,title:config.title,root:config.root,trail:[...trail],chosen:!!trail.length,focused,timing:timing(id,caseModel),steps:visible.map(key=>guidance(key)),detail:focused?guidance(focused):null,next};
 });
 return {state,families,active:state.active,focused:families.find(family=>family.id===state.active)||null};
}
function attrs(family,to,from){return `data-case-route-family="${esc(family)}" data-case-route-to="${esc(to)}"${from==null?'':` data-case-route-from="${esc(from)}"`}`;}
function rootButton(family,active){return `<button type="button" class="case-route-root" ${attrs(family.id,family.root)} aria-pressed="${active===family.id}"><span class="case-route-symbol" aria-hidden="true">${family.id==='gifted'?'✧':'↗'}</span><span><strong>${esc(family.title)}</strong><small>${esc(family.timing)}</small></span><span aria-hidden="true">→</span></button>`;}
function detailHTML(detail){
 const list=items=>`<ul>${items.map(text=>`<li>${esc(text)}</li>`).join('')}</ul>`;
 return `<details class="case-route-guidance"><summary>공부 방법과 교재 살펴보기</summary><div><h5>무엇을 공부하나요?</h5>${list(detail.what)}<h5>함께 이어갈 공부</h5>${list(detail.parallel)}${detail.books?`<p>${esc(detail.books)}</p>`:''}${detail.sections.map(section=>`<div class="case-route-books"><strong>${esc(section.title)}</strong><p>${esc(section.books)}</p>${section.other?`<p>${esc(section.other)}</p>`:''}<p>${esc(section.advice)}</p></div>`).join('')}<p class="case-route-advice">${esc(detail.advice)}</p></div></details>`;
}
function renderChoices(value,caseModel,extraRoot='',scienceBody=''){
 const m=model(value,caseModel),f=m.focused;
 return `<section class="case-route-choices" aria-label="영재원과 중등의 다음 갈림길"><div class="case-route-heading"><span>지금 공부에서 다음 로드맵로</span><h3>어떤 공부를 더 이어볼까요?</h3></div><div class="case-route-roots">${m.families.map(family=>rootButton(family,scienceBody?null:m.active)).join('')}${extraRoot}</div>${scienceBody|| (f?`<nav class="case-route-breadcrumb" aria-label="${esc(f.title)}에서 선택한 로드맵">${f.steps.map(step=>`<button type="button" ${attrs(f.id,step.id)} ${f.focused===step.id?'aria-current="step"':''}>${esc(step.short)}</button>`).join('<span aria-hidden="true">›</span>')}</nav><div class="case-route-focus"><h4>${esc(f.detail.title)}</h4><p>${esc(f.detail.summary)}</p>${f.id==='gifted'?'<p class="case-route-advice">영재원 대비는 기존 공부에 추가합니다. 교과·사고력·심화·연산의 진도와 진행 속도는 유지합니다.</p>':''}${detailHTML(f.detail)}</div><div class="case-route-next" aria-label="${esc(f.detail.short)}의 다음 갈림길">${f.next.map(next=>`<button type="button" ${attrs(f.id,next.id,f.focused)}><strong>${esc(next.title)}</strong><span aria-hidden="true">→</span></button>`).join('')}</div>`:'<p class="case-route-empty">영재원 대비와 중등 공부를 각각 골라 함께 이어갈 수 있습니다.</p>')}</section>`;
}
function renderMap(value,caseModel){
 const m=model(value,caseModel),chosen=m.families.filter(family=>family.chosen);
 return `<section class="case-route-map" aria-label="선택한 다음 공부"><div class="case-route-heading"><span>지금 계획에 이어지는 길</span><h3>선택한 다음 공부</h3></div>${chosen.length?chosen.map(family=>`<section class="case-route-map-family" data-case-route-lane="${family.id}"><header><h4>${esc(family.title)}</h4><p>${esc(family.timing)}</p></header><ol>${family.steps.map((step,i)=>`<li><button type="button" ${attrs(family.id,step.id)} ${m.active===family.id&&family.focused===step.id?'aria-current="step"':''}><span class="case-route-step-number" aria-hidden="true">${i+1}</span><span><strong>${esc(step.short)}</strong><small>${esc(step.summary)}</small></span></button></li>`).join('')}</ol></section>`).join(''):`<div class="case-route-roots">${m.families.map(family=>rootButton(family,m.active)).join('')}</div>`}</section>`;
}
function renderContext(value,caseModel){
 const m=model(value,caseModel),chosen=m.families.filter(family=>family.chosen);
 if(!chosen.length)return '';
 return `<aside class="case-route-context" aria-label="그래프에 함께 보는 다음 공부">${chosen.map(family=>`<div><strong>${esc(family.title)}</strong><span>${esc(family.timing)}</span><p>${family.steps.map(step=>esc(step.short)).join(' <span aria-hidden="true">→</span> ')}</p></div>`).join('')}<small>교과 진도와 함께 살펴볼 준비 방향입니다.</small></aside>`;
}
function questions(value,caseModel){
 const m=model(value,caseModel),f=m.focused;if(!f)return [];
 const contextual=f.id==='gifted'?{id:'case-route-gifted-timing',question:'영재원 준비를 고르면 초3 말 지원이 확정되나요?',answer:caseModel?.state?.gifted==='later'?'현재 지원 시기는 다시 검토하는 상태입니다. 준비 방향을 먼저 고르고, 지원 여부와 시기는 지역·해당 연도 모집요강의 자격 및 일정을 확인한 뒤 정합니다.':'초3 말은 이 사례에서 지원을 검토하자고 제안한 시점입니다. 지역·해당 연도 모집요강에서 지원 학년과 평가 방식을 확인하고 준비합니다. 이 선택은 지원 자격이나 합격 판정이 아닙니다.'}:{id:'case-route-middle-timing',question:'중등의 다음 로드맵을 고르면 언제부터 공부하나요?',answer:`이 사례의 중등 시작은 ${dateLabel(caseModel,caseModel?.middleStart)}이며 전체 18개월 계획입니다. 초등 계통 대수심화 뒤에 중등 기본·심화를 이어갑니다. 이후 고등·경시·학원 경로의 시작 시기는 실제 이수 범위와 선택한 교재를 보고 정합니다.`};
 const reused=catalogue().questions(f.trail,f.focused).map(item=>({id:'case-route-'+item.id,question:item.q,answer:item.a,...(item.url?{url:item.url,label:item.label}:{})}));
 return [contextual,...reused];
}
global.PlannerCaseRoutes=Object.freeze({restore,select,goalEntry,model,renderChoices,renderMap,renderContext,questions});
})(window);
