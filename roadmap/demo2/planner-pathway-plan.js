/* 로드맵에서 선택한 공부 경로의 교재·병행 방법. 체험 과제와 별개이다. */
(function(global){
'use strict';
const X=global.PlannerPathways,G=global.PlannerCourseGuide;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function scope(value,active){const path=X.normalize(value),at=path.indexOf(active);return at<0?path:path.slice(0,at+1);}
function primaryBook(text){return String(text||'').split(' · 심화 · ')[0].replace(/^교과 · /,'');}
function contextKey(c){return JSON.stringify([c.grade||null,c.schoolGuide||null,primaryBook(c.currentStudy?.school||c.currentBooks)]);}
function compatibleContext(saved,c){if(saved===contextKey(c))return true;try{const old=JSON.parse(saved);return Array.isArray(old)&&old.length===4&&old[0]===(c.grade||null)&&old[1]===(c.schoolGuide||null)&&primaryBook(old[3])===primaryBook(c.currentStudy?.school||c.currentBooks);}catch{return false;}}

function books(trail,active,context={}){
 const path=scope(trail,active),id=path.at(-1),d=X.detail(id,context);if(!d)return [];
 if(path[0]==='center'&&Number(context.grade)>=7&&!['giftedSchool','scienceHigh'].includes(context.schoolGoal))return [];
 let sections=d.sections;
 if(!sections.length&&['boarding','international','globalBridge','globalAlgebra','globalTransition','mathLanguage'].includes(id)&&context.schoolGuide)sections=G.detail({title:d.title,guideKey:context.schoolGuide},{audience:context.audience}).sections;
 const science=path[0]==='science',currentBooks=science?'':context.currentBooks;
 const rows=[{id:'current',title:science?'학교 과학 교재·수업 자료부터':currentBooks?'지금 쓰는 교재 유지':'학교 교재·수업 자료부터',summary:currentBooks||(science?'현재 학교 과학의 단원과 필요한 개념부터 살펴봐요.':'현재 학교에서 배우는 범위부터 살펴봐요.'),why:'현재 교재를 활용할 수 있다면 그대로 이어가도 좋습니다. 새로 필요한 공부만 더해 보겠습니다.',advice:d.books||d.advice,other:''}];
 for(const s of sections){
  if(['unknown','choice','thinking','calc','science'].includes(s.guideKey))continue;
  rows.push({id:s.guideKey,title:s.books.replace(/^표준 교재: |^심화 교재: /,''),summary:s.summary,why:'지금 공부와 이어갈 수 있는 교재입니다. 먼저 필요한 학기·범위를 고르고, 같은 역할의 책을 중복해서 더하지 않도록 보겠습니다.',advice:s.advice,other:s.other});
 }
 return rows;
}
function parallelPlan(context={}){
 const current=context.currentStudy||{},known=t=>t&&!/미선택|잘 모르|시작 전|경험 없음|확인 전|확인 필요/.test(t);
 return [
  {axis:'school',label:'교과',current:current.school||context.currentBooks||'학교 단원 확인 전',method:'현재 학교의 단원·과제·평가를 중심에 둡니다. 학교 학년과 교재 학기는 구분하며 Grade·Year를 한국 학년으로 자동 환산하지 않습니다.'},
  ...(Object.hasOwn(current,'thinking')?[{axis:'thinking',label:'사고력',current:current.thinking||'현재 사고력 범위 확인 전',method:'현재 사고력 교재에서 조건 정리·첫 시도·풀이 설명을 이어갑니다. 교과나 심화 진도에 맞춰 단계를 자동으로 올리지 않습니다.'}]:[]),
  {axis:'deep',label:'심화',current:current.deep||'현재 심화 범위 확인 전',method:known(current.deep)?'선택한 심화 범위를 독립적으로 이어갑니다. 새 교과와 같은 학기로 맞추거나 다음 권으로 자동 이동하지 않고 조건을 바꾼 적용과 풀이 설명을 확인합니다.':'교과의 개념·대표 유형과 풀이 설명부터 확인합니다. 심화 추가 여부와 범위는 갈림길에서 따로 고르며 학년만으로 어려운 교재를 배정하지 않습니다.'},
  {axis:'calc',label:'연산',current:current.calc||'현재 연산 범위 확인 전',method:known(current.calc)?'현재 연산 범위의 원리·정확성·오류 재풀이를 확인하며 별도 흐름으로 이어갑니다. 새 교과 학기마다 연산 전권을 다시 반복하거나 권수·시간을 두 배로 늘리지 않습니다.':'학교·교과 문제에서 막힌 계산의 원리를 먼저 보완합니다. 연산 교재·범위를 확인하기 전에는 새 권수나 완료 시기를 정하지 않습니다.'}
 ];
}
function methods(trail,active,context={}){
 const path=scope(trail,active),id=path.at(-1),d=X.detail(id,context);if(!d)return [];
 if(path[0]==='center'&&Number(context.grade)>=7&&!['giftedSchool','scienceHigh'].includes(context.schoolGoal))return [];
 if(['boarding','international'].includes(path[0]))return [
  {id:'school',title:'학교 공부를 중심으로 병행',summary:'학교 수업을 유지하며 심화·연산을 각각 이어갑니다.',steps:[...parallelPlan(context).map(x=>x.label+' · '+x.current+'. '+x.method),...d.parallel,'학기에는 심화·복습을 꾸준히, 방학에는 휴식과 복습을 보고 가능한 분량을 조정합니다.']},
  {id:'language',title:'수학 이해와 풀이 설명을 함께',summary:'개념·수학 영어와 심화·연산의 역할을 나눠 챙깁니다.',steps:['수학 개념과 수업 언어 중 어디에서 막히는지 나누어 살펴봅니다. 같은 개념을 편한 언어와 영어로 읽고 식·그림·말로 설명합니다.',...parallelPlan(context).map(x=>x.label+' · '+x.current+'. '+x.method),...d.parallel]}
 ];
 if(path[0]==='center')return [
  {id:'parallel',title:'기존 공부에 영재원 대비 추가',summary:'교과·사고력·심화·연산의 진행 속도를 유지하고 별도로 준비합니다.',steps:['기존 교재와 월별 과정의 진도·진행 속도는 유지합니다. 영재원 대비를 선택해도 기존 과정의 기간을 늘리거나 다음 과정을 늦추지 않습니다.',...d.parallel,d.advice]},
  {id:'repair',title:'필요한 준비부터 별도로 추가',summary:'현재 공부 속도는 유지하면서 영재원 대비에 필요한 개념·탐구·설명을 더합니다.',steps:['영재원 대비에서 낯선 부분을 별도 시간에 보완합니다. 기존 교과·사고력·심화·연산의 기간과 진행 속도는 유지합니다.',d.what[0],d.advice]}
 ];
 if(['contest','gifted'].includes(path[0]))return [
  {id:'parallel',title:'교과를 유지하며 심화 병행',summary:'학교 수학은 이어가고, 대회·선발에 필요한 문제 해결을 별도로 연습합니다.',steps:['교과와 연산을 꾸준히 이어가세요. 심화에서는 문제의 조건에 표시하고, 스스로 시도한 방법과 풀이의 이유를 끝까지 써 보는 연습을 더하겠습니다.',...d.parallel,d.advice]},
  {id:'repair',title:'선수 개념을 보완하고 합류',summary:'필요한 개념과 풀이를 확인한 뒤 다음 단계로 이어가요.',steps:['최근에 틀린 문제를 개념 부족·조건 누락·계산 오류로 나누어 보세요. 막힌 개념을 보완한 뒤 다른 문제에서 다시 써 볼 수 있는지 확인하겠습니다.',d.what[0],d.advice]}
 ];
 if(path[0]==='science')return [
  {id:'concept',title:'교과 개념부터 차근차근',summary:'학교 과학과 중등 기본을 먼저 익히고, 과학에 쓰이는 수학 개념도 함께 점검합니다.',steps:[d.what[0],...d.parallel,d.advice]},
  {id:'reason',title:'개념과 탐구·설명을 병행',summary:'개념을 배우고 실험·그래프에 적용한 뒤, 왜 그렇게 해석했는지 설명합니다.',steps:['물리·화학·생명·지구에서 현재 배우는 단원을 먼저 보겠습니다. 개념을 설명하고 자료를 해석할 수 있어야 심화로 넘어갑니다. 중학생은 학교 단원과 내신도 나란히 챙깁니다.',...d.parallel,d.advice]}
 ];
 return [
  {id:'parallel',title:'교과와 심화를 함께 이어가기',summary:'교과는 새 개념을 배우고, 심화는 이미 배운 범위를 깊게 다룹니다.',steps:['교과와 심화의 학기가 달라도 괜찮습니다. 교과에서는 개념과 대표 유형을, 심화에서는 조건을 바꾼 문제와 서술을 다루겠습니다.',...d.parallel,'학교 시험 기간에는 내신을 먼저 챙기고, 그 밖의 기간에는 새 진도와 오답 복습을 함께 가져갑니다. 방학에는 미완성 문제를 마친 뒤 추가할 분량을 정하세요.']},
  {id:'repair',title:'필요한 단원만 보완하고 이어가기',summary:'현재 진도를 이어가면서 자꾸 틀리는 개념·조건 읽기·계산을 보완합니다.',steps:['식을 쓰기 전에 무엇을 구하는지 말하고 조건에 표시해 보세요. 풀이 뒤에는 부호·단위·답의 범위를 확인합니다.','틀린 이유를 설명하고 며칠 뒤 비슷한 문제를 다시 풀어 봅니다. 다른 과정은 이어가며 필요한 단원을 보완하면 됩니다.',d.advice]}
 ];
}
function restore(value,trail,active,context={}){
 const path=scope(trail,active),key=path.join('/'),stamp=contextKey(context),v=value?.version===1&&value.path===key&&compatibleContext(value.context,context)?value:{};
 const book=books(path,null,context).some(b=>b.id===v.book)?v.book:null;
 const method=book&&methods(path,null,context).some(m=>m.id===v.method)?v.method:null;
 return {version:1,path:key,context:stamp,book,method};
}
function choose(value,trail,active,context,kind,id){const s=restore(value,trail,active,context);if(kind==='book'&&books(trail,active,context).some(b=>b.id===id))return {...s,book:id,method:s.book===id?s.method:null};if(kind==='method'&&s.book&&methods(trail,active,context).some(m=>m.id===id))return {...s,method:id};return s;}
function detail(value,trail,active,context={}){const path=scope(trail,active),s=restore(value,path,null,context),b=books(path,null,context),m=methods(path,null,context);return {...s,title:X.paths[path.at(-1)]?.short||'',books:b,methods:m,bookInfo:b.find(b=>b.id===s.book)||null,methodInfo:m.find(m=>m.id===s.method)||null};}
function renderTrail(value,trail,context={}){
 if(typeof value?.path!=='string'||!value.path)return '';const p=value.path.split('/'),path=X.normalize(trail);if(p.length>path.length||p.some((id,i)=>path[i]!==id))return '';
 const d=detail(value,p,null,context);if(!d.bookInfo)return '';
 const rows=[{id:'books',label:'살펴볼 교재',title:d.bookInfo.title,summary:d.title},...(d.methodInfo?[{id:'methods',label:'공부할 방법',title:d.methodInfo.title,summary:d.methodInfo.summary}]:[])];
 return `<section class="pathway-trail study-trail" aria-labelledby="pathwayPlanTitle"><div class="pathway-heading"><h3 id="pathwayPlanTitle">교재와 공부 계획</h3><p>고른 교재와 공부 방법을 로드맵에 담았습니다. 이전 지점을 누르면 다시 조정할 수 있습니다.</p></div><ol>${rows.map(r=>`<li><button type="button" data-plan-open="${r.id}"><span class="pathway-point" aria-hidden="true"></span><small>${esc(r.label)}</small><strong>${esc(r.title)}</strong><span class="pathway-point-summary">${esc(r.summary)}</span></button></li>`).join('')}</ol>${d.methodInfo&&['boarding','international'].includes(p[0])?`<section class="study-parallel-plan" aria-label="이 경로의 교과 심화 연산 병행"><h4>교과·심화·연산을 나란히 이어갑니다</h4>${parallelPlan(context).map(x=>`<article data-study-axis="${x.axis}"><h5>${esc(x.label)}</h5><p class="study-parallel-current">${esc(x.current)}</p><p>${esc(x.method)}</p></article>`).join('')}<p class="study-parallel-note">위 범위는 현재 선택한 학습입니다. 다음 학기나 다음 권의 이수·완료를 뜻하지 않으며, 교재·범위와 병행 계획에서 바꿀 수 있습니다.</p></section>`:''}</section>`;
}
global.PlannerPathwayPlan=Object.freeze({scope,books,parallelPlan,methods,restore,choose,detail,renderTrail});
})(window);
