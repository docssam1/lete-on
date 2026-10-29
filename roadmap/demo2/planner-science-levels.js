/* Independent science study stages, not a conversion of the math L references.
 * The supplied old MSG elementary-science roadmap informs the progression.
 * Current user corrections (2026-10-26) take precedence for books and durations.
 * A selected stage is self-report. Only the existing completion controls record
 * completed study; all dates below come from the existing science plan blocks.
 */
(function(global){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STAGES=[
 {id:'experiment',number:1,name:'실험탐구',choice:'관찰·실험부터 하고 있어요',summary:'실험과학 · 관찰하고 기록하기',scope:'관찰·비교·간단한 실험과 결과 기록',books:['실험과학'],readiness:'무엇을 바꿨고 어떤 결과가 나왔는지 자기 말로 설명해 봅니다. 실험 경험과 교과 개념 공부를 따로 확인합니다.'},
 {id:'elementary',number:2,name:'초등교과',choice:'초등 과학 개념을 공부해요',summary:'줄기과학·오투 · 초등 해당 범위',scope:'초등 과학의 용어·개념·탐구를 학년·학기 순서로 연결',books:['줄기과학 또는 오투 초등 과학 · 해당 범위'],readiness:'배운 용어와 대표 탐구를 설명하고, 관찰한 결과를 개념과 연결할 수 있는지 확인합니다.'},
 {id:'middle',number:3,name:'중등기본',choice:'중등 과학 기본을 공부해요',summary:'줄기과학 계통별 또는 오투 학기별',scope:'중등 물리·화학·생명과학·지구과학의 기본 개념과 대표 탐구',books:['줄기과학 · 계통별 기본','오투 중학 과학 · 학기별 기본'],readiness:'초등 기본을 먼저 확인합니다. 중등 물리는 수학 중2-1의 식·비례·그래프를 실제 현상에 적용할 수 있는지 함께 봅니다.'},
 {id:'depth',number:4,name:'중등심화',choice:'중등 과학 심화를 공부해요',summary:'심화 브릿지·하이탑 반복 · 세페이드는 선택',scope:'중등 기본 다음의 심화·자료 해석·서술과 필요한 분야 반복',books:['최상위 줄기과학 또는 하이탑 · 심화 브릿지','하이탑 · 중등 해당 분야 반복'],readiness:'중등 기본을 먼저 공부합니다. 브릿지는 전체 6개월이고, 이후 하이탑을 반복해 설명·적용을 확인합니다. 세페이드는 필요한 분야만 선택합니다.'},
 {id:'high',number:5,name:'고등개념',choice:'고등 과학 개념을 공부해요',summary:'하이탑 · 필요한 고등 분야부터',scope:'필요한 고등 과학 분야의 개념을 수학 도구와 연결',books:['하이탑 · 고등 해당 분야'],readiness:'중등 기본·심화에서 빈 부분을 확인하고, 필요한 수학 도구와 과학 개념을 연결합니다. 고등 심화는 목표와 실제 풀이를 보고 따로 정합니다.'}
];
const SOURCE_NOTE='제공한 구형 MSG 초등과학 로드맵의 실험·초등 기본·중등 기본·심화 흐름을 참고했습니다. 교재와 기간은 2026년 10월 26일 확인한 현재 기준을 우선하며, 옛 학년별 예시를 아이의 이수 기록으로 옮기지 않습니다.';
const list=value=>Array.isArray(value)?value:[];
function blocks(m){
 const found=new Map();
 for(const b of [...list(m.phases),...list(m.next),...list(m.terms),...list(m.continuation)])if(b&&typeof b.id==='string'&&!found.has(b.id))found.set(b.id,b);
 return [...found.values()];
}
function belongs(stage,b){
 if(stage==='experiment')return b.id==='experiment';
 if(stage==='elementary')return b.id==='elementary';
 if(stage==='middle')return ['physics','chemistry','life','earth'].includes(b.id)||b.schoolTerm===true||/^otu-/.test(b.id);
 if(stage==='depth')return b.bridge===true||b.repeat===true||['scienceBridge','highTopRepeat','cepheid1','cepheid2'].includes(b.id);
 return b.id==='cepheid3'||b.id==='highTop'&&/^고등/.test(b.title||'');
}
function calendar(m,offset){
 if(!Number.isFinite(offset)||!Number.isFinite(m.context?.now)||typeof global.PlannerScience?.date!=='function')return null;
 const value=global.PlannerScience.date(m.context,offset);
 return value&&typeof value.label==='string'?{...value,offset}:null;
}
function schedule(m,source){
 const pending=source.filter(b=>!b.completed),dated=pending.filter(b=>Number.isFinite(b.start));
 if(!dated.length)return null;
 const start=Math.min(...dated.map(b=>b.start));
 const completeWindow=pending.every(b=>Number.isFinite(b.start)&&Number.isFinite(b.end)&&b.end>b.start);
 const end=completeWindow?Math.max(...pending.map(b=>b.end)):null;
 const startDate=calendar(m,start),endDate=end===null?null:calendar(m,end-1);
 const repeat=pending.some(b=>b.repeat),label=startDate?(endDate?startDate.label+' → '+endDate.label:startDate.label+' 시작 · '+(repeat?'반복 종료 시점은 학습 후 조정':'이후 일정은 확인 후 연결')):null;
 return {kind:'planned',start,end,startDate,endDate,label,repeat,blocks:pending.map(b=>({id:b.id,start:Number.isFinite(b.start)?b.start:null,end:Number.isFinite(b.end)?b.end:null}))};
}
function material(m,stage,source){
 const chosen=[...new Set(source.map(b=>b.material).filter(v=>typeof v==='string'&&v.trim()))];
 if(stage.id==='experiment')return {books:['실험과학'],bookSummary:'실험과학'};
 if(stage.id==='middle'){
  if(m.route==='otu'){
   const terms=source.filter(b=>typeof b.stage==='string');
   const range=terms.length?terms[0].stage+(terms.length>1?' ~ '+terms.at(-1).stage:''):'선택한 학기';
   return {books:chosen.length?chosen:['오투 중학 과학 · '+range],bookSummary:'오투 중학 과학 · '+range};
  }
  return {books:chosen.length?chosen:['줄기과학 · 중등 분야별 기본'],bookSummary:'줄기과학 · 중등 분야별 기본'};
 }
 if(stage.id==='depth'){
  const books=chosen.length?chosen:[...stage.books];
  if(source.some(b=>b.id==='cepheid1'))books.push('세페이드 1F · 필요한 물리·화학 분야');
  if(source.some(b=>b.id==='cepheid2'))books.push('세페이드 2F · 필요한 중등 분야');
  const bridge=source.find(b=>b.bridge),hasCepheid=source.some(b=>['cepheid1','cepheid2'].includes(b.id));
  return {books:[...new Set(books)],bookSummary:(bridge?.material||'최상위 줄기과학 또는 하이탑')+' → 하이탑 반복'+(hasCepheid?' · 세페이드 선택':'')};
 }
 if(stage.id==='high'){
  const books=chosen.length?chosen:[...stage.books];
  if(source.some(b=>b.id==='cepheid3'))books.push('세페이드 3F · 고등 개념 이후 선택 심화');
  return {books:[...new Set(books)],bookSummary:'하이탑 · 고등 해당 분야'+(source.some(b=>b.id==='cepheid3')?' · 세페이드 3F 선택':'')};
 }
 const books=chosen.length?chosen:[m.state?.elementaryBook==='school'?'학교 과학 교재·수업 자료':m.state?.elementaryBook==='otu'||m.route==='otu'?'오투 초등 과학 · 해당 학년·학기':m.state?.elementaryBook==='reference'?'최상위 줄기과학 · 해당 학년·학기':'줄기과학 · 해당 학년·학기'];
 return {books,bookSummary:books.join(' · ')};
}
function parentComment(m){
 const goal=m.state?.schoolGoal;
 if(['giftedSchool','scienceHigh'].includes(goal))return '영재학교·과학고를 생각한다면 초등 때부터 개념을 설명하고 탐구 결과를 기록하는 습관을 쌓습니다. 중등 기본을 먼저 다진 뒤 심화와 필요한 고등 개념을 연결합니다. 영재원·올림피아드 준비는 목표와 공부 여유에 따라 따로 선택합니다.';
 if(['private','general'].includes(goal))return '자사고·일반고 방향이라면 학교 과학의 개념·탐구·서술형을 충분히 익히고 필요한 선행을 더합니다. 초등 기본이 비어 있으면 먼저 보완하며, 세페이드나 올림피아드를 공통 필수로 넣지 않습니다.';
 return '아직 진학 목표를 정하지 않아도 괜찮습니다. 이른 실험 경험은 관찰과 설명의 바탕이 되고, 교과 개념은 별도로 차근차근 확인합니다. 책을 끝낸 양보다 배운 내용을 설명하고 다시 적용하는 모습을 봅니다.';
}
function model(scienceModel={}){
 const m=scienceModel||{},state=m.state||{},selected=STAGES.some(s=>s.id===state.scienceStage)?state.scienceStage:'unknown',all=blocks(m);
 const stages=STAGES.map(s=>{
  const source=all.filter(b=>belongs(s.id,b));
  return {...s,title:'과학 '+s.number+'단계 · '+s.name,...material(m,s,source),scope:s.id==='elementary'&&source[0]?.scope?source[0].scope:s.scope,schedule:schedule(m,source),sourceBlockIds:source.map(b=>b.id),inPlan:source.length>0,selected:s.id===selected};
 });
 const index=stages.findIndex(s=>s.id===selected),current=index<0?{id:'unknown',name:'현재 과학 공부 확인 전',title:'현재 과학 공부 확인 전',explanation:'지금 공부하는 과학 범위를 선택해 주세요. 수학 레벨이나 학년만으로 과학 단계를 정하지 않습니다.',schedule:null,sourceBlockIds:[],inPlan:false,selected:true}: {...stages[index],explanation:'지금 '+stages[index].name+' 범위를 공부 중이라고 선택했어요. 이미 마친 범위는 별도의 이수 기록과 맞춰 봅니다.'};
 const middle=m.curriculum?.middle===true||(Number.isFinite(m.context?.now)&&Math.floor((m.context.now-2)/12)-2>=7);
 return {selected,known:index>=0,current,next:index<0?[]:stages.slice(index+1,index+3),stages,parentComment:parentComment(m),schoolNote:middle?'중학생은 학교 과학·내신을 함께 챙기고, 별도 과학 선행은 수학 진도와 필요한 개념에 맞춥니다.':null,note:'과학 단계는 공부 범위의 구분입니다. 수학 L번호·성적 순위와 별개이며, 선택만으로 이전 과정을 완료 처리하지 않습니다.',sourceNote:SOURCE_NOTE};
}
function defaultButton(key,id,title,summary,on){return '<button type="button" data-science-kind="'+esc(key)+'" data-science-value="'+esc(id)+'" aria-pressed="'+!!on+'"><strong>'+esc(title)+'</strong><span>'+esc(summary)+'</span></button>';}
function choices(scienceModel,button=defaultButton){
 const m=model(scienceModel),make=typeof button==='function'?button:defaultButton;
 return '<div class="science-level-choices"><h3>지금 과학은 어디까지 공부하고 있나요?</h3><p class="science-level-note">지금 배우는 범위에 가까운 것을 골라 주세요. 잘 모르겠다면 확인 전으로 두어도 괜찮습니다.</p><div class="science-options">'+make('scienceStage','unknown','아직 확인하지 않았어요','교재와 배운 단원을 보고 함께 확인',m.selected==='unknown')+STAGES.map(s=>make('scienceStage',s.id,s.choice,s.summary,m.selected===s.id)).join('')+'</div><p class="science-level-note">공부 중인 단계와 이미 마친 범위는 다를 수 있어요. 아래 이수 범위 선택에서 확인한 것만 표시해 주세요.</p></div>';
}
function card(stage,label,current){
 return '<article class="science-level-card'+(current?' is-current':'')+'"><small>'+esc(label)+'</small><h5>'+esc(stage.title)+'</h5>'+(current?'<p>'+esc(stage.explanation)+'</p>':'')+'<dl><div><dt>배울 범위</dt><dd>'+esc(stage.scope)+'</dd></div><div><dt>교재</dt><dd>'+esc(stage.bookSummary)+'</dd></div><div><dt>확인할 점</dt><dd>'+esc(stage.readiness)+'</dd></div></dl>'+(stage.schedule?.label?'<p class="science-level-date">예상 일정 · '+esc(stage.schedule.label)+'</p>':'<p class="science-level-date">'+(stage.inPlan?'일정은 현재 범위 확인 후 연결':'현재 범위와 앞 과정 확인 후 일정 연결')+'</p>')+'</article>';
}
function render(scienceModel){
 const m=model(scienceModel);
 return '<section class="science-levels" aria-label="우리 아이의 과학 공부 단계"><header><small>수학과 별도로 확인하는 과학</small><h4>우리 아이의 과학 공부 단계</h4></header><ol class="science-level-ladder">'+m.stages.map(s=>'<li'+(s.selected?' class="is-current" aria-current="step"':'')+'><span>'+s.number+'단계</span><strong>'+esc(s.name)+'</strong></li>').join('')+'</ol>'+(m.known?'<div class="science-level-cards">'+card(m.current,'현재 선택',true)+m.next.map((s,i)=>card(s,i?'그다음 단계':'다음 단계',false)).join('')+'</div>':'<p class="science-level-note">'+esc(m.current.explanation)+'</p>')+'<p class="science-level-note">'+esc(m.note)+'</p>'+(m.schoolNote?'<p class="science-level-note">'+esc(m.schoolNote)+'</p>':'')+'<details class="science-level-details"><summary>단계 연결과 목표에 따른 공부 방법</summary><p>'+esc(m.parentComment)+'</p><p>실험탐구는 교과 공부와 나란히 할 수 있습니다. 모두 1단계부터 다시 시작하는 뜻은 아닙니다. 기본을 확인하고 다음 범위를 고르며, 단계 선택만으로 교재나 고등 과학 시작 날짜를 새로 배정하지 않습니다.</p></details></section>';
}
function questions(scienceModel){
 const m=model(scienceModel);
 return [
  {question:'수학 레벨과 과학 단계는 같은가요?',answer:m.note+' '+(m.known?'현재 선택은 '+m.current.title+'입니다.':m.current.explanation)},
  {question:'지금 과학 공부에서 다음에는 무엇을 하나요?',answer:!m.known?'현재 과학 교재와 배운 단원부터 확인합니다. 단계와 실제 이수 범위를 고른 뒤 다음 과정을 연결합니다.':m.next.length?m.next.map(s=>s.title+': '+s.scope+'. '+s.readiness).join(' '):'고등 개념에서 배운 분야를 설명하고 낯선 문제에 적용하는지 확인합니다. 부족한 중등 기본을 보완하고, 추가 심화는 목표와 공부 여유를 보고 정합니다.'},
  {question:'실험과학을 했으면 초등 과학도 마친 건가요?',answer:'관찰·실험 경험과 교과 개념 이수는 따로 확인합니다. 실험에서 본 현상을 용어와 개념으로 설명하고, 배우지 않은 초등 단원이 있는지 살펴봅니다.'},
  {question:'진학 목표에 따라 과학 공부가 달라지나요?',answer:m.parentComment+(m.schoolNote?' '+m.schoolNote:'')}
 ];
}
global.PlannerScienceLevels=Object.freeze({model,choices,render,questions});
})(window);
