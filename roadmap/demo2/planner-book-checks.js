/* Publisher TOC facts are separate from parent observations. Never advances a
 * course, changes its duration, assigns a score, or establishes admissions eligibility. */
(function(g){
'use strict';
const I=g.PlannerIntake,CATALOG=g.PLANNER_BOOK_CATALOG||[];
const AXES={school:'교과',thinking:'사고력',deep:'심화',calc:'연산',science:'과학'};
const STATUSES={pending:'아직 확인 전',help:'도움을 받아 적용',independent:'혼자 설명하고 적용'};
const METHODS={school:['사용한 개념과 식의 이유를 말·그림·식으로 설명합니다.','조건이나 수를 바꾼 문제에 적용하고, 다른 날 다시 확인합니다.'],deep:['낯선 문제에서 어떤 조건을 연결했는지 설명합니다.','해설을 본 문제와 새로운 문제를 구분하고 다른 접근을 비교합니다.'],thinking:['조건을 정리하고 스스로 시도한 방법을 남깁니다.','막힌 지점과 힌트 뒤 달라진 생각을 설명하고 다른 방법과 비교합니다.'],calc:['계산 원리와 기호·자리값을 설명합니다.','반복 오류를 고친 뒤 교과 문제에서도 정확하게 적용하는지 확인합니다.'],science:['개념·단위·자료의 관계를 설명합니다.','가설·변인·관찰·결론을 구분하고 예상과 다른 결과의 이유를 살펴봅니다.']};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function descriptor(axis,answers,fields,science=''){
 const key={school:'school',thinking:'thinking',deep:'deepBook',calc:'calc'}[axis];
 const name=(axis==='science'?science:I.summary(answers,fields).find(x=>x.key===key)?.text||'').replace(/\s*(진행 중|완료|상태 확인 전)\s*$/,'').trim();
 return{axis,name:name||'현재 범위 확인 전',key:JSON.stringify([axis,name||'unknown'])};
}
function candidates(d){
 const vol=d.name.match(/[1-6]-[12]/)?.[0];if(!vol||!['school','deep'].includes(d.axis))return [];
 const family=/최상위\s*S|최상위에스/.test(d.name)?'didimdol_s':/최상위\s*(수학)?/.test(d.name)&&!/개념응용/.test(d.name)?'didimdol_top':/디딤돌/.test(d.name)?'didimdol_application':null;
 return CATALOG.filter(b=>b.family===family&&b.volume===vol&&b.verification==='publisher_toc');
}
function restore(v){
 const result={version:1,records:{}};if(v?.version!==1)return result;
 for(const [key,r]of Object.entries(v.records||{})){
  let parsed;try{parsed=JSON.parse(key);}catch{continue;}if(!Array.isArray(parsed)||!Object.hasOwn(AXES,parsed[0])||typeof parsed[1]!=='string')continue;
  const book=CATALOG.find(b=>b.id===r?.edition),units=book?new Set(['current',...book.units.map(x=>String(x.order))]):new Set(['current']),observations={};
  for(const [unit,value]of Object.entries(r?.observations||{}))if(units.has(unit)&&Object.hasOwn(STATUSES,value))observations[unit]=value;
  result.records[key]={edition:book?.id||null,confirmed:!!book&&r.confirmed===true,observations};
 }
 return result;
}
function choose(value,d,kind,id){
 const s=restore(value);if(!Object.hasOwn(AXES,d.axis))return s;
 const record=s.records[d.key]||{edition:null,confirmed:false,observations:{}};s.records[d.key]=record;
 if(kind==='edition'){
  if(id==='unknown'){if(record.edition)s.records[JSON.stringify([d.axis,d.name,record.edition])]={...record,observations:{...record.observations}};const old=s.records[JSON.stringify([d.axis,d.name,'current'])];record.edition=null;record.confirmed=false;record.observations={...old?.observations};}
  else if(candidates(d).some(x=>x.id===id)&&record.edition!==id){s.records[JSON.stringify([d.axis,d.name,record.edition||'current'])]={...record,observations:{...record.observations}};const old=s.records[JSON.stringify([d.axis,d.name,id])];record.edition=id;record.confirmed=false;record.observations={...old?.observations};}
 }else if(kind==='confirm'&&record.edition)record.confirmed=!record.confirmed;
 else if(kind==='observe'){
  const [unit,status]=id.split(':'),book=CATALOG.find(b=>b.id===record.edition),valid=record.confirmed?book?.units.some(u=>String(u.order)===unit):unit==='current';
  if(valid&&Object.hasOwn(STATUSES,status))record.observations[unit]=status;
 }
 return restore(s);
}
function model(value,d){
 const s=restore(value),record=s.records[d.key]||{edition:null,confirmed:false,observations:{}},book=candidates(d).find(x=>x.id===record.edition),confirmed=!!book&&record.confirmed;
 const units=confirmed?book.units.map(u=>({id:String(u.order),title:u.title})): [{id:'current',title:'현재 공부 중인 부분 · 단원·판본 확인 전'}];
 return {descriptor:d,record,book,confirmed,units:units.map(u=>({...u,status:record.observations[u.id]||'pending'})),methods:METHODS[d.axis],candidates:candidates(d)};
}
function render(value,d){
 const m=model(value,d),control=(kind,id,title,on)=>`<button type="button" data-book-check-kind="${kind}" data-book-check-value="${esc(id)}" aria-pressed="${!!on}">${esc(title)}${on?' · 선택됨':''}</button>`;
 return `<section class="book-observation" aria-label="교재 단원별 공부 확인"><header><small>${AXES[d.axis]} · 부모 관찰</small><h3>${esc(d.name)}</h3></header><p>현재 공부한 부분의 적용과 설명을 확인합니다. 교재 완료·공식 성적·숙달 판정과는 별도 기록입니다.</p>${m.candidates.length?'<details><summary>현재 책의 정확한 판본 확인</summary><p>제목·권·ISBN이 같은 책만 선택합니다. 기본+응용과 응용, 출판연도·판본이 다르면 목차를 적용하지 않습니다.</p><div class="book-editions">'+m.candidates.map(b=>control('edition',b.id,b.title+' · ISBN '+b.isbn,m.record.edition===b.id)).join('')+control('edition','unknown','목록에 없거나 잘 모르겠습니다',!m.record.edition)+'</div>'+(m.book?control('confirm','yes','실제 책의 제목·ISBN·판본이 일치합니다',m.confirmed):'')+'</details>':'<p class="book-source-note">이 교재·판본의 확인된 목차가 없습니다. 단원명·쪽수는 만들지 않고 현재 공부 중인 부분의 관찰만 기록합니다.</p>'}${m.confirmed?'<p class="book-source-note">출판사 목차 확인 · '+esc(m.book.checkedOn)+' · <a href="'+esc(m.book.sourceUrl)+'" target="_blank" rel="noopener">출판사 안내 ↗</a></p>':''}<div class="book-unit-checks">${m.units.map(u=>'<fieldset><legend>'+esc(u.title)+'</legend><div>'+Object.entries(STATUSES).map(([id,title])=>control('observe',u.id+':'+id,title,u.status===id)).join('')+'</div><p>'+esc(u.status==='help'?'도움이 필요했던 개념·조건을 다시 연결하고 같은 범위에서 재적용합니다. 다른 영역의 공부는 유지합니다.':u.status==='independent'?'조건을 바꾼 문제와 다른 날에도 같은 모습인지 살펴본 뒤 다음 범위를 선택합니다. 자동 완료·승급은 하지 않습니다.':'현재 교재에서 풀이·설명·오류 수정을 먼저 살펴봅니다.')+'</p></fieldset>').join('')}</div><aside><h4>이 영역의 공부 방법</h4><ul>${m.methods.map(t=>'<li>'+esc(t)+'</li>').join('')}</ul></aside><p>관찰을 기록해도 다른 영역의 교재·월별 일정·추가 회차는 바뀌지 않습니다.</p><div class="book-next"><button type="button" data-book-study="${d.axis}">관찰을 참고해 다음 공부 고르기 →</button></div></section>`;
}
function summary(value,descriptors){
 const items=descriptors.map(d=>({d,m:model(value,d)}));return '<section class="book-check-summary"><header><h3>현재 교재에서 확인할 공부</h3><p>교과·사고력·심화·연산·과학을 각각 살펴봅니다.</p></header><div>'+items.map(({d,m})=>'<button type="button" data-book-check-open="'+d.axis+'"><small>'+AXES[d.axis]+'</small><strong>'+esc(d.name)+'</strong><span>'+esc(m.confirmed?'판본 확인 · '+m.units.filter(u=>u.status!=='pending').length+'개 단원 관찰 기록':m.units[0].status==='pending'?'현재 범위 관찰 전':'현재 범위 관찰 기록 있음')+'</span></button>').join('')+'</div></section>';
}
g.PlannerBookChecks=Object.freeze({AXES,STATUSES,METHODS,descriptor,candidates,restore,choose,model,render,summary});
})(window);
