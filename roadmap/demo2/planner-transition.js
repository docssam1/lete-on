/* 교재·범위·병행 선택과 조건부 진도 시나리오. 숙달/승급 예측 모델이 아니다. */
(function(global){
'use strict';
const G=global.PlannerProgression,I=global.PlannerIntake,P=global.Planner,D=global.DemoContent,L=global.PLANNER_LEVELS;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CHECKS=[
 {id:'pending',title:'아직 풀이를 확인하지 않았습니다',summary:'현재 범위의 풀이·설명·오류 수정을 먼저 확인합니다. 학습량을 늘린 경우는 아직 비교하지 않습니다.'},
 {id:'practice',title:'도움을 줄이며 다시 푸는 중입니다',summary:'현재와 다음 범위를 익힐 시간을 충분히 두고, 그 뒤 학습량을 늘리는 일정을 비교합니다.'},
 {id:'observed',title:'다른 날에도 혼자 풀고 설명했습니다',summary:'학부모가 관찰한 참고입니다. 현재 과정을 확인한 뒤 다음 과정부터 점진적으로 조정해 봅니다.'}
];
const TEMPOS=[{id:'keep',title:'지금 공부 속도 유지',summary:'현재 과정의 남은 범위와 기존 예시의 과정별 기간을 유지합니다.'},{id:'gradual',title:'이해를 확인하며 학습량 늘리기',summary:'현재 범위를 충분히 익힌 뒤 학습량을 조금씩 늘려 봅니다. 복습·심화·연산을 유지하고 새 진도에 더 배분한 경우의 일정을 비교합니다.'}];
const ALLOCATIONS=[{id:'review',title:'복습·심화와 오류 보완에 먼저 쓰기',summary:'추가 분량을 현재 범위의 설명·응용·오류 수정에 씁니다. 진도선은 유지하며 공부의 깊이를 더합니다.'},{id:'advance',title:'확인한 뒤 새 진도에도 일부 쓰기',summary:'복습·심화·연산과 휴식을 유지하며, 교과의 새 범위에도 일부 배분합니다. 적응이 이어지는 경우의 일정만 비교합니다.'}];
const LOADS=Object.freeze([{id:'weekly',title:'주 1회 추가',summary:'기본 수업에 주 1회를 더하는 목표입니다. 회당 시간은 초등·중등 2시간, 고등 3시간이며 6개월 동안 목표까지 서서히 늘립니다.',sessions:1},{id:'twiceWeekly',title:'주 2회 추가',summary:'기본 수업에 주 2회를 더하는 목표입니다. 회당 시간은 초등·중등 2시간, 고등 3시간이며 6개월 동안 목표까지 서서히 늘립니다.',sessions:2}].map(Object.freeze));
const CADENCES=Object.freeze([
 {id:'sequential',title:'교과를 다룬 뒤 심화 이어가기',summary:'원자료에 따로 마련된 심화 기간에 선택한 교재와 범위를 다룹니다. 교과 사이의 다른 간격은 유지합니다.'},
 {id:'parallel',title:'교과와 심화를 나란히 병행',summary:'선택한 심화를 교과와 함께 다룹니다. 원자료의 별도 심화 기간을 교과의 대기 기간으로 다시 더하지 않습니다.'}
].map(Object.freeze));
function cadenceOptions(){return CADENCES;}
const TRANSFER=.5,ADAPT_MONTHS=6; // 진도 반영 몫과 목표 회차 적응 기간. 적응 이후 회차를 더 늘리지 않는다.
const CLASS_BASELINES=Object.freeze({elem:Object.freeze({label:'초등 과정',sessions:1,hours:2}),middle:Object.freeze({label:'중등 과정',sessions:2,hours:2}),high:Object.freeze({label:'고등 과정',sessions:2,hours:3})});
const AXES=[{id:'school',title:'교과',summary:'학년·학기와 과정의 진행을 비교합니다.'},{id:'comp',title:'사고력',summary:'사고력 과정의 순서를 별도로 비교합니다.'},{id:'calc',title:'연산',summary:'연산 교재 과정의 순서를 별도로 비교합니다.'}];
function defaultAxis(answers,fields){return I.gradeChoice(I.effective(answers),fields)==='pre'?'comp':'school';}
function scope(progress,answers,fields){const s=G.restore(progress,answers,fields);return JSON.stringify([s.signature,s.goal,s.target,s.focus,s.observation,s.pace]);}
function schoolKey(text){return G.stage(text,'school');}
function schoolNumber(key){if(/^[1-6]-[12]$/.test(key||''))return (+key[0]-1)*2+(+key[2]);const m=P.MID.indexOf(key);return m<0?null:14+m;}
function rangeLabel(n,end){return n===end?schoolLabel(n)+' 범위 충분히 다루기':schoolLabel(n)+' → '+schoolLabel(end);}
function schoolLabel(n){return n<=12?P.SEM(n):P.MID[n-14]||'';}
function baseContext(progress,answers,fields){const b=G.bridge(progress,answers,fields),a=I.effective(answers),current=b.c.axes.find(x=>x.id==='school'),key=current?.ready?current.stage:null,n=schoolNumber(key),selected=b.c.levels.find(l=>l.id===b.s.target),targetKey=selected?.axes[0].referenceStage,targetNumber=schoolNumber(targetKey);return {b,a,current,key,n,targetKey,targetNumber};}
function bookOptions(progress,answers,fields){const {a,n,current}=baseContext(progress,answers,fields);if(!current?.ready||n==null)return [];
 const names=n<=12?['디딤돌 기본+응용','디딤돌 응용']:['원리해설','개념원리'];
 return [{id:'current',title:'현재 교과 교재 유지',summary:current.current,book:a.schoolBook},...names.filter(x=>x!==a.schoolBook).map((x,i)=>({id:'book'+i,title:x+' 선택',summary:'선택한 학기·과정에서 개념·대표 유형·응용과 오류 재풀이를 다룹니다.',book:x}))];
}
function rangeOptions(progress,answers,fields){const {b,n,targetNumber}=baseContext(progress,answers,fields);if(n==null)return [];
 const end=n<=12?12:19,next=n<end?n+1:null,target=targetNumber!=null&&targetNumber>n&&targetNumber<=end?targetNumber:null;
 return [{id:'current',title:schoolLabel(n)+' 범위부터 충분히 다루기',summary:'현재 범위의 개념·대표 유형·응용·오류 재풀이를 확인합니다.',end:n},...(next?[{id:'next',title:schoolLabel(next)+'까지 연결',summary:schoolLabel(n)+'에서 확인을 거쳐 다음 한 학기 범위를 연결합니다.',end:next}]:[]),...(target&&target!==next?[{id:'target',title:schoolLabel(target)+'까지 단계별로 비교',summary:G.levelLabel(b.c,b.s.target,true)+' 예시의 현재 범위입니다. 중간 범위를 생략하거나 기한을 정하지 않습니다.',end:target}]:[]),...(['4','5','6'].includes(String(b.c.grade))&&n<12&&next!==12&&target!==12?[{id:'sequence',title:'6-2까지 학기별로 설계',summary:'초등 과정의 끝 범위까지 차례로 살펴봅니다. 완료 기한이나 중등 진입을 자동으로 정하지 않습니다.',end:12}]:[])];
}
function deepBooks(progress,answers,fields){const {a,n}=baseContext(progress,answers,fields);
 const current=I.deepBooks.includes(a.deepBook)&&!I.special(a.deepCourse)&&I.hasAnswer(a,fields,'deepStage')&&I.hasAnswer(a,fields,'deepStatus'),own=current?(I.middleBook(a.deepBook)?+a.deepStage:schoolNumber(a.deepStage)):null,domain=own??n,names=domain==null?[]:domain<=12?['최상위 S','최상위 수학']:['RPM','A급'];
 return [...(current?[{id:'current',title:'현재 심화 교재 유지',summary:I.summary(a,fields).find(x=>x.key==='deepBook').text,book:a.deepBook}]:[]),...names.filter(x=>x!==a.deepBook||!current).map((x,i)=>({id:'deep'+i,title:x,summary:x==='A급'?'중등 심화를 더 다룰 때 비교할 후보입니다. 현재 풀이와 부담을 먼저 살펴봅니다.':'선택한 범위에서 조건 해석과 풀이 근거를 깊이 다룹니다.',book:x})),{id:'none',title:'심화 교재 추가는 보류',summary:'교과의 응용과 필요한 부분 보완을 유지합니다.',book:null}];
}
function deepScopes(progress,answers,fields,book){const {a,n}=baseContext(progress,answers,fields);if(!book||book.id==='none')return [];
 const actual=I.deepBooks.includes(a.deepBook)&&a.deepStage&&I.hasAnswer(a,fields,'deepStage')&&I.hasAnswer(a,fields,'deepStatus');
 const aligned=n!=null&&I.middleBook(book.book)===(n>=14);
 return [...(actual&&I.middleBook(book.book)===I.middleBook(a.deepBook)?[{id:'actual',title:'현재 심화 범위를 독립적으로 유지',summary:I.summary(a,fields).find(x=>x.key==='deepBook').text,start:I.middleBook(a.deepBook)?+a.deepStage:schoolNumber(a.deepStage),lag:null}]:[]),...(aligned?[{id:'same',title:'교과와 같은 학기·과정',summary:schoolLabel(n)+' 교과와 같은 범위의 심화를 다룹니다. 이어서 할지 병행할지는 다음 선택에서 정합니다.',start:n,lag:0},...(n>=3&&n<=12?[{id:'lag',title:'교과보다 한 학년 아래 범위',summary:'교과 '+schoolLabel(n)+' ↔ 심화 '+schoolLabel(n-2)+'. 새 교과와 이미 배운 범위의 심화를 나누어 다룹니다.',start:n-2,lag:2}]:[])]:[])];
}
function calcName(a){if(a.calc==='high')return (a.calcHigh||'고등 과목 확인 전')+' 계산·식 변형 연습';return a.calc==='advanced'?P.CALC[+a.calcExact]?.[0]:a.calc&&!I.special(a.calc)?a.calc:null;}
function calcOptions(progress,answers,fields){const {a,b}=baseContext(progress,answers,fields),current=b.c.axes.find(x=>x.id==='calc'),name=calcName(a),own=G.referenceForAxis(b.c,'calc'),next=own&&Number(own.slice(1))>0?'L'+(Number(own.slice(1))-1):null,targetId=b.s.focus==='calc'&&b.s.target?b.s.target:next,target=b.c.levels.find(l=>l.id===targetId)?.axes.find(x=>x.id==='calc').reference;
 const source=L.find(l=>l.id===targetId)?.calc||[],from=source.findIndex(x=>G.stage(x[0],'calc')===current?.stage),to=source.findIndex(x=>x[0]===target),chain=from>=0&&to>=from?source.slice(from,to+1).map(x=>D.shortText(x[0])):[];
 return [...(current?.ready&&name?[{id:'current',title:'현재 연산 교재를 유지',summary:name+'의 현재 범위를 원리·정확성·오류 수정까지 다룹니다.',chain:[name]}]:[]),...(chain.length>1?[{id:'bridge',title:chain.at(-1)+'까지 차례로 비교',summary:chain.join(' → ')+'. 현재 원리와 독립 계산을 확인하며 범위를 정합니다.',chain}]:[]),{id:'repair',title:'교과에서 드러난 연산만 먼저 보완',summary:'교과 문제의 계산 오류를 찾아 관련 연산을 다시 다룹니다. 새 연산 권수는 아직 배정하지 않습니다.',chain:[]}];
}
function restore(value,progress,answers,fields){
 const stamp=scope(progress,answers,fields),c=G.context(answers,fields);let prior=null;try{const raw=JSON.parse(value?.scope);if(Array.isArray(raw)&&raw.length===6)prior=raw;}catch{}
 const diff=G.signatureDiff(prior?.[0],c),intent=JSON.parse(stamp);
 const valid=value?.version===1&&(value.scope===stamp||diff.environment),v=valid?value:{};
 const schoolCompatible=value?.scope===stamp||diff.axes.school;
 const targetChanged=!!prior&&prior[2]!==intent[2],schoolObservationChanged=!!prior&&(prior[3]==='school'||intent[3]==='school')&&prior[4]!==intent[4];
 // Validate each area independently. A missing depth choice cannot erase calculation or school work.
 const matchBook=(options,id,area)=>{
  if(typeof id!=='string'||!(area==='school'?/^(current|book\d+)$/:/^(current|deep\d+|none)$/).test(id))return null;
  const fixed=v.bookBindings?.[area]==='selected'||id!=='current';
  if(fixed&&v.bookNames?.[area])return options.find(x=>x.book===v.bookNames[area]);
  if(area==='deep'&&value?.scope!==stamp&&!diff.axes.deep&&!v.bookNames&&id!=='current'&&id!=='none')return null;
  return options.find(x=>x.id===id);
 };
 const books=bookOptions(progress,answers,fields),book=schoolCompatible?matchBook(books,v.book,'school'):null,range=book&&!(v.range==='target'&&targetChanged)&&rangeOptions(progress,answers,fields).find(x=>x.id===v.range);
 const deeps=deepBooks(progress,answers,fields),deep=matchBook(deeps,v.deep,'deep'),deepScope=deep&&deepScopes(progress,answers,fields,deep).find(x=>x.id===v.deepScope);
 const calc=calcOptions(progress,answers,fields).find(x=>x.id===v.calc),checkpoint=schoolCompatible&&!schoolObservationChanged&&range&&CHECKS.some(x=>x.id===v.checkpoint)?v.checkpoint:null;
 const source=restoreCadenceSource(v.cadenceSource),explicitCadence=CADENCES.some(x=>x.id===v.cadence)?v.cadence:null;
 const cadence=explicitCadence&&deep?.id==='none'?'parallel':explicitCadence;
 return {version:1,scope:stamp,book:book?.id||null,range:range?.id||null,deep:deep?.id||null,deepScope:deepScope?.id||null,calc:calc?.id||null,checkpoint,tempo:TEMPOS.some(x=>x.id===v.tempo)?v.tempo:'keep',allocation:ALLOCATIONS.some(x=>x.id===v.allocation)?v.allocation:null,load:v.allocation==='advance'&&LOADS.some(x=>x.id===v.load)?v.load:null,axis:AXES.some(x=>x.id===v.axis)?v.axis:defaultAxis(answers,fields),cadence,cadenceSource:source,bookNames:{school:book?.book||null,deep:deep?.book||null},bookBindings:{school:v.bookBindings?.school|| (v.book==='current'?'reported':'selected'),deep:v.bookBindings?.deep||(v.deep==='current'?'reported':'selected')}};
}
function restoreCadenceSource(value){
 const metadata=value&&global.PLANNER_STANDARD_DETAILS?.[value.levelId];
 if(!metadata||!['elementary','middle'].includes(value.stage))return null;
 const sourceCadence=value.stage==='elementary'&&metadata.elementaryMode.id==='application-then-depth'?'sequential':'parallel';
 if(['thinking','deep'].includes(value.pattern)){
  const cadence=value.pattern==='thinking'?'parallel':sourceCadence;
  return value.cadence==null||value.cadence===cadence?{levelId:value.levelId,stage:value.stage,pattern:value.pattern,cadence}:null;
 }
 return value.pattern===sourceCadence?{levelId:value.levelId,stage:value.stage,pattern:sourceCadence,cadence:sourceCadence}:null;
}
function inheritCadence(value,progress,answers,fields,levelId,pattern){
 const s=restore(value,progress,answers,fields),c=baseContext(progress,answers,fields),metadata=global.PLANNER_STANDARD_DETAILS?.[levelId];
 if(!metadata||c.n==null)return s;
 if(s.cadence&&s.cadenceSource)return s;
 const stage=c.n<=12?'elementary':'middle',sourceCadence=stage==='elementary'&&metadata.elementaryMode.id==='application-then-depth'?'sequential':'parallel',sourcePattern=['thinking','deep'].includes(pattern)?pattern:sourceCadence,defaultCadence=sourcePattern==='thinking'?'parallel':sourceCadence;
 return {...s,cadence:s.cadence||(s.deep==='none'?'parallel':defaultCadence),cadenceSource:{levelId,stage,pattern:sourcePattern,cadence:defaultCadence}};
}
function cadenceLabel(s){return s.deep==='none'&&s.cadence==='parallel'?'교과 응용·연산 유지 · 별도 심화 없음':CADENCES.find(x=>x.id===s.cadence)?.title||'진행 방식 확인 전';}
function cadenceNote(s){
 if(!s.cadence)return '교과와 심화의 진행 방식은 아직 고르지 않았습니다. 원자료의 기간과 간격을 유지한 참고 일정이며, 빈 기간을 선택한 심화 교재에 자동 배정하지 않습니다.';
 if(s.deep==='none')return '교과 응용과 연산을 유지하며 별도 심화 교재는 배정하지 않습니다. 원자료에서 심화로 확인된 간격만 교과의 대기 기간에서 제외합니다.';
 if(s.cadence==='parallel')return '선택한 심화를 교과와 나란히 배치합니다. 원자료에서 심화로 확인된 기간을 교과의 대기 기간으로 다시 더하지 않으며, 심화 자체의 기간과 그 밖의 미지정 간격은 유지합니다.';
 return '선택한 교과 다음에 선택한 심화 교재와 범위를 이어갑니다. 원자료에 명시된 별도 심화 기간을 유지하며, 근거가 없는 범위의 기간을 임의로 만들지 않습니다.';
}
function choose(value,progress,answers,fields,kind,id){const s=restore(value,progress,answers,fields);
 if(kind==='cadence'&&CADENCES.some(x=>x.id===id)&&s.deep&&(s.deep==='none'||s.deepScope))return {...s,cadence:s.deep==='none'?'parallel':id};
 if(kind==='axis'&&AXES.some(x=>x.id===id))return {...s,axis:id};
 if(kind==='allocation'&&s.tempo==='gradual'&&ALLOCATIONS.some(x=>x.id===id))return s.allocation===id?s:{...s,allocation:id,load:null};
 if(kind==='load'&&s.tempo==='gradual'&&s.allocation==='advance'&&LOADS.some(x=>x.id===id))return {...s,load:id};
 if(kind==='tempo'&&TEMPOS.some(x=>x.id===id))return {...s,tempo:id};
 const d=detail(s,progress,answers,fields),list=({book:d.books,range:d.ranges,deep:d.deepBooks,deepScope:d.deepScopes,calc:d.calcs,checkpoint:CHECKS})[kind],chosen=list?.find(x=>x.id===id);if(!chosen)return s;
 if(s[kind]===id)return kind==='deep'&&id==='none'?{...s,cadence:'parallel'}:s;
 const next={...s,[kind]:id,bookNames:{...s.bookNames},bookBindings:{...s.bookBindings}};
 if(kind==='book'){next.range=null;next.checkpoint=null;next.bookNames.school=chosen.book;next.bookBindings.school=id==='current'?'reported':'selected';}
 if(kind==='deep'){
  next.bookNames.deep=chosen.book;next.bookBindings.deep=id==='current'?'reported':'selected';
  if(id==='none'){next.deepScope=null;next.cadence='parallel';}
  else if(s.deep==='none'&&s.cadenceSource)next.cadence=s.cadenceSource.cadence;
 }
 // Range, depth scope, and calculation choices do not clear another area's decisions.
 return restore(next,progress,answers,fields);
}
function detail(value,progress,answers,fields){const s=restore(value,progress,answers,fields),c=baseContext(progress,answers,fields),books=bookOptions(progress,answers,fields),book=books.find(x=>x.id===s.book),ranges=rangeOptions(progress,answers,fields),range=ranges.find(x=>x.id===s.range),deeps=deepBooks(progress,answers,fields),deep=deeps.find(x=>x.id===s.deep),scopes=deepScopes(progress,answers,fields,deep),deepScope=scopes.find(x=>x.id===s.deepScope),calcs=calcOptions(progress,answers,fields),calc=calcs.find(x=>x.id===s.calc),checkpoint=CHECKS.find(x=>x.id===s.checkpoint);
 const rows=range&&book?Array.from({length:range.end-c.n+1},(_,i)=>{const n=c.n+i,deepN=deepScope?.lag===null?deepScope.start:deepScope?n-deepScope.lag:null;return {id:n,school:book.book+' '+schoolLabel(n),deep:deep?.id==='none'?'교과 응용·부분 보완 유지':deep&&deepN!=null&&schoolLabel(deepN)?deep.book+' '+schoolLabel(deepN):'심화 범위 선택 전',calc:calc?.id==='current'?calc.chain[0]+' · 원리와 오류 재확인':calc?.id==='bridge'?'별도 연산 흐름을 유지하며 이 교과 범위에서 필요한 계산을 확인':calc?'이 범위의 계산 오류를 골라 보완':'연산 방법 선택 전',checkpoint:'개념과 식의 이유 → 도움 없이 적용 → 다른 조건·다른 날 재확인'};}):[];
 return {...c,s,books,book,ranges,range,deepBooks:deeps,deep,deepScopes:scopes,deepScope,calcs,calc,checkpoint,rows,cadence:CADENCES.find(x=>x.id===s.cadence)||null,cadenceTitle:cadenceLabel(s),cadenceChanged:!!(s.cadenceSource&&s.cadence!==s.cadenceSource.cadence)};
}
const catalogCache=new Map();
function catalog(axis){if(!catalogCache.has(axis)){const all=L[0][axis]||[];catalogCache.set(axis,Object.freeze([...new Set(all.map(b=>G.stage(b[0],axis)).filter(Boolean))]));}return catalogCache.get(axis);}
function ordinal(text,axis){const key=G.stage(text,axis);return catalog(axis).indexOf(key);}
function sourcePoints(level,axis){const bs=level?.[axis]||[],out=[];for(const b of bs){const n=ordinal(b[0],axis);if(n<0)continue;out.push({x:b[1],y:n,label:D.shortText(b[0])},{x:b[2]+1,y:n+1,label:D.shortText(b[0])});}return out;}
function at(points,x){if(!points.length||x<points[0].x||x>points.at(-1).x)return null;for(let i=1;i<points.length;i++){if(x<=points[i].x){const a=points[i-1],b=points[i];return a.y+(b.y-a.y)*(x-a.x)/(b.x-a.x||1);}}return points.at(-1).y;}
// Display references only: existing L1/L2 source schedules, never a learner's assigned work.
const ACADEMY_LINES=Object.freeze([
 Object.freeze({id:'premier',label:'프리미어1',short:'프리미어1'}),
 Object.freeze({id:'fields',label:'필즈 S',short:'필즈 S'}),
 Object.freeze({id:'fields-e1',label:'필즈 E1',short:'필즈 E1'}),
 Object.freeze({id:'soma',label:'소마 A',short:'소마 A'})
]);
function restoreAcademyLines(value){return {version:1,...Object.fromEntries(ACADEMY_LINES.map(x=>[x.id,value?.version===1&&typeof value[x.id]==='boolean'?value[x.id]:true]))};}
function toggleAcademyLine(value,id){const s=restoreAcademyLines(value);return ACADEMY_LINES.some(x=>x.id===id)?{...s,[id]:!s[id]}:s;}
function academyContext(c){return Number.isFinite(c?.now)&&(c.grade==='pre'||['1','2'].includes(String(c.grade)));}
function academyReferences(c,axis='school',value=null){
 if(!academyContext(c)||!AXES.some(x=>x.id===axis))return [];
 const state=restoreAcademyLines(value),end=c.now+24;
 return (global.PLANNER_ACADEMY_ROADMAPS?.courses||[]).map(course=>({...course,enabled:state[course.id],window:{start:c.now,end},tracks:[course.main,...course.parallel].map(track=>({...track,visible:track.blocks.filter(b=>b.kind!=='sequence'&&b.start<end&&b.end>c.now).map(b=>({...b,from:Math.max(c.now,b.start),to:Math.min(end,b.end)}))}))}));
}
function renderAcademyControls(c,value=null,{jump=false}={}){
 if(!academyContext(c))return '';
 const state=restoreAcademyLines(value);
 return `<div class="academy-line-controls" role="group" aria-label="학원별 로드맵 표시"><span class="academy-line-caption">학원별 로드맵</span>${ACADEMY_LINES.map(ref=>`<button type="button" class="academy-line-toggle beam-${ref.id}" data-academy-beam="${ref.id}" aria-label="${esc(ref.label)} 로드맵" aria-pressed="${state[ref.id]}"><i aria-hidden="true"></i><span>${esc(ref.label)}</span><b data-academy-state>${state[ref.id]?'켬':'끔'}</b></button>`).join('')}${jump?'<button type="button" class="academy-graph-jump" data-workspace-view="graph">그래프에서 비교 ↗</button>':''}</div>`;
}
function academyMonthPlan(ref,c,fields={}){
 if(!ref||!Number.isFinite(c?.now)||!['fields-e1','soma'].includes(ref.id))return [];
 const main=[ref.main,...ref.parallel],groups=ref.id==='soma'?[{id:'main',title:'소마 A반',tracks:main.filter(t=>!t.source||t.source.caseId===ref.source?.caseId)},...main.filter(t=>t.source&&t.source.caseId!==ref.source?.caseId).map((t,i)=>({id:'example'+i,title:t.title,tracks:[t]}))]:[{id:'main',title:ref.label,tracks:[...main.filter(t=>t.title==='수업 횟수·시간'),...main.filter(t=>t.title!=='수업 횟수·시간')]}];
 return groups.map(group=>{
  const tracks=group.tracks.map(t=>({...t,blocks:t.blocks.filter(b=>b.kind!=='sequence'&&Number.isInteger(b.start)&&Number.isInteger(b.end)&&b.end>b.start)})).filter(t=>t.blocks.length),periods=tracks.flatMap(t=>t.blocks);
  if(!periods.length)return null;
  const start=Math.min(...periods.map(b=>b.start)),end=Math.max(...periods.map(b=>b.end));
  const months=Array.from({length:end-start},(_,i)=>({at:start+i,...calendarAt(c.now,start+i-c.now,fields),current:Math.floor(c.now)===start+i}));
  const rows=tracks.map(t=>({title:t.title,cells:months.map(month=>{const index=t.blocks.findIndex(b=>b.start<=month.at&&b.end>month.at),b=t.blocks[index];return {start:month.at,end:month.at+1,span:1,label:b?.label||'',note:b?.note||'',kind:b?.kind||'empty',index,sourceStart:b?.start??null,sourceEnd:b?.end??null,sourceRow:b?.sourceRow||''};}).reduce((cells,cell)=>{const last=cells.at(-1);if(last&&last.index===cell.index){last.end=cell.end;last.span++;}else cells.push({...cell});return cells;},[])}));
  const years=months.reduce((list,m)=>{const key=Math.floor(m.at/12),last=list.at(-1);if(last&&last.key===key)last.end=m.at+1;else list.push({key,year:m.year,start:m.at,end:m.at+1});return list;},[]);
  return {id:group.id,title:group.title,start,end,months,rows,years};
 }).filter(Boolean);
}
function renderAcademyMonthCourse(ref,c,fields={}){
 const plans=academyMonthPlan(ref,c,fields);if(!plans.length)return '';
 const table=(plan,start=plan.start,end=plan.end)=>{
  const months=plan.months.filter(m=>m.at>=start&&m.at<end),quarters=months.reduce((list,m)=>{const key=[m.year,m.quarter].join('-'),last=list.at(-1);if(last?.key===key)last.span++;else list.push({key,span:1,label:(m.year?m.year+'년 ':'')+m.quarter+'분기'});return list;},[]);
  return `<table class="academy-month-table" data-academy-month-table="${ref.id}" data-month-start="${start}" data-month-end="${end}"><caption>${esc(plan.title)} · ${esc(months[0].grade+' '+months[0].month+'월')} ~ ${esc(months.at(-1).grade+' '+months.at(-1).month+'월')}</caption><colgroup><col class="academy-month-row-col">${months.map(()=>'<col class="academy-month-col">').join('')}</colgroup><thead><tr><th rowspan="2" scope="col">함께 공부할 과정</th>${quarters.map(q=>`<th scope="colgroup" colspan="${q.span}">${esc(q.label)}</th>`).join('')}</tr><tr>${months.map(m=>`<th scope="col" data-month="${m.at}"${m.current?' class="is-current" aria-label="현재 '+esc(m.label)+'"':''}><small>${esc(m.grade)}</small><b>${m.month}월</b></th>`).join('')}</tr></thead><tbody>${plan.rows.map(row=>`<tr><th scope="row">${esc(row.title)}</th>${row.cells.filter(cell=>cell.start<end&&cell.end>start).map(cell=>{const span=Math.min(end,cell.end)-Math.max(start,cell.start);return `<td colspan="${span}" class="${cell.kind==='empty'?'is-empty':'tone-'+cell.index%4}${cell.kind==='event'?' is-event':''}" data-source-start="${cell.sourceStart??''}" data-source-end="${cell.sourceEnd??''}"${cell.note?' title="'+esc(cell.note)+'"':''}>${cell.kind==='empty'?'<span aria-label="별도 과정 표시 없음">—</span>':`<strong>${esc(cell.label)}</strong>`}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;
 };
 return plans.map(plan=>`<section class="academy-month-plan" aria-label="${esc(plan.title+' 월별 과정표')}"><div class="academy-month-screen" role="region" aria-label="${esc(plan.title+' 전체 월별 표')}" tabindex="0" style="--academy-month-count:${plan.end-plan.start}">${table(plan)}</div><div class="academy-month-print">${plan.years.map(y=>table(plan,y.start,y.end)).join('')}</div></section>`).join('');
}
function renderAcademyMonthly(refs,c,fields={}){
 const courses=refs.filter(ref=>['fields-e1','soma'].includes(ref.id));if(!courses.length)return '';
 return `<section class="academy-monthly-comparison" aria-label="학원별 월별 로드맵"><header><h3>학원별 월별 로드맵</h3><p>학원 운영표의 수업과 병행 교재를 월별로 살펴봅니다.</p></header>${courses.map(ref=>`<article class="academy-monthly-card beam-${ref.id}" data-academy-beam-layer="${ref.id}" aria-hidden="${!ref.enabled}"><h4>${esc(ref.label)}</h4>${renderAcademyMonthCourse(ref,c,fields)}</article>`).join('')}<p class="academy-month-empty-note">— 별도 과정 표시 없음 · 교재 묶음의 기간이며, 개별 권의 완료월을 나눈 표가 아닙니다.</p></section>`;
}
function renderAcademyRoadmaps(refs,c,fields){
 if(!refs.length)return '';
 const date=m=>calendarAt(c.now,m-c.now,fields).label,shortDate=m=>{const d=calendarAt(c.now,m-c.now,fields);return d.grade+' '+d.month+'월';};
 const detailTrack=track=>`<h6>${esc(track.title)}</h6><ul>${track.blocks.map(b=>`<li><strong>${esc(b.label)}</strong><span>${b.kind==='sequence'?'배울 순서':b.kind==='event'?esc(date(b.start)):esc(date(b.start)+' ~ '+date(b.end-1))}${b.note?' · '+esc(b.note):''}</span></li>`).join('')}</ul>`;
 const start=c.now,end=c.now+24,pct=m=>((m-start)/24*100).toFixed(3);
 const previewTrack=(ref,track)=>`<div class="academy-track" data-academy-track-title="${esc(track.title)}" role="img" aria-label="${esc(ref.label+' · '+track.title+' · '+track.visible.map(b=>shortDate(b.start)+' '+b.label).join(' · '))}">${track.visible.map(b=>b.kind==='event'?`<span class="academy-event${+pct(b.start)<8?' is-start':+pct(b.start)>92?' is-end':''}" style="left:${pct(b.start)}%" title="${esc(date(b.start)+' · '+b.label+' '+b.note)}"><i></i><b>${esc(b.label)}</b></span>`:`<span class="academy-period${b.shortLabel?' is-compact':''}" style="left:${pct(b.from)}%;width:${((b.to-b.from)/24*100).toFixed(3)}%" title="${esc(b.label+' · '+date(b.start)+' ~ '+date(b.end-1))}"><b>${esc(b.shortLabel||b.label)}</b></span>`).join('')}${!track.visible.length?'<span class="academy-next-note">다음 과정은 반 진도에 맞춰 이어갑니다.</span>':''}</div>`;
 return `<section class="academy-roadmaps" aria-label="학원별 실제 과정과 이정표"><header><h5>학원별로 이어지는 과정</h5><p>같은 시기의 학원 과정과 시작·완료 시점을 나란히 봅니다.</p></header><div class="academy-calendar" aria-hidden="true">${[0,6,12,18,24].map(n=>`<span style="left:${pct(start+n)}%">${esc(shortDate(start+n))}</span>`).join('')}</div>${refs.map(ref=>{
  const preview=ref.tracks.find(t=>t.title===ref.previewTrack&&t.visible.length)||ref.tracks.find(t=>t.visible.length)||ref.tracks[0],paired=!!ref.previewTrack&&preview!==ref.tracks[0],next=ref.main.blocks.filter(b=>b.kind==='event'&&b.start>=end).slice(0,2);
  const overview=paired?`<header class="academy-paired-heading"><strong>${esc(ref.label)}</strong><small>${esc(ref.cohort)}</small></header><span class="academy-preview-label">${esc(ref.mainPreviewLabel||'더클래식 본 과정')}</span>${previewTrack(ref,ref.tracks[0])}<span class="academy-preview-label">${esc(ref.parallelPreviewLabel||'사고력 병행 교재')}</span>${previewTrack(ref,preview)}`:`<header><strong>${esc(ref.label)}</strong><small>${esc(ref.cohort)} · ${esc(preview.title)}</small></header>${previewTrack(ref,preview)}`;
  return `<article class="academy-roadmap beam-${ref.id}" data-academy-beam-layer="${ref.id}" aria-hidden="${!ref.enabled}">${overview}${ref.paceNote?'<p class="academy-pace-note">'+esc(ref.paceNote)+'</p>':''}${next.length?'<p class="academy-next-target">그다음 · '+next.map(b=>esc(shortDate(b.start)+' '+b.label.replace(/^초\d\s*\d+월경\s*/,''))).join(' / ')+'</p>':''}<details class="academy-course-detail"><summary>월별 과정·병행 교재 보기</summary><p>${esc(ref.cohort)}</p>${renderAcademyMonthCourse(ref,c,fields)}${[ref.main,...ref.parallel].map(detailTrack).join('')}${ref.notes.map(n=>'<p>'+esc(n)+'</p>').join('')}${ref.archive?`<details class="academy-archive"><summary>${esc(ref.archive.label)} 별도로 보기</summary><p>${esc(ref.archive.cohort)} · 위 A반 사례와 다른 코호트입니다.</p>${[ref.archive.main,...ref.archive.parallel].map(detailTrack).join('')}</details>`:''}</details></article>`;
 }).join('')}<p class="academy-timing-note">구간은 과정 기간, 점은 시작·완료 이정표입니다. 반별 운영 일정에 따라 달라질 수 있습니다.</p></section>`;
}
function classBaseline(text){const key=G.stage(text,'school')||text||'';return /^[1-6]-[12]$/.test(key)?CLASS_BASELINES.elem:/^중[1-3]-[12]$/.test(key)?CLASS_BASELINES.middle:/^공통수학/.test(key)?CLASS_BASELINES.high:null;}
function rampFraction(t){return t<=0?0:t<2?t/4:t<4?.5+.15*(t-2):t<ADAPT_MONTHS?.8+.1*(t-4):1;}
// Integrate the 0/50/80/100% adaptation, then hold the bounded target until catch-up.
function rampIntegral(t){const x=Math.max(0,t);return x<=2?x*x/8:x<=4?.5+.5*(x-2)+.075*(x-2)*(x-2):x<=ADAPT_MONTHS?1.8+.8*(x-4)+.05*(x-4)*(x-4):3.6+x-ADAPT_MONTHS;}
function workClock(t,extraRatio){return t+extraRatio*TRANSFER*rampIntegral(t);}
function scenarioDuration(baseDuration,elapsed,extraRatio){let lo=baseDuration/(1+extraRatio*TRANSFER),hi=baseDuration;for(let i=0;i<44;i++){const mid=(lo+hi)/2;if(workClock(elapsed+mid,extraRatio)-workClock(elapsed,extraRatio)<baseDuration)lo=mid;else hi=mid;}return (lo+hi)/2;}
function findCatch(reference,start,duration,position,extraStart){
 if(!reference?.points.length)return null;const points=reference.points,cuts=[0,duration,...points.filter(p=>p.x>start&&p.x<start+duration).map(p=>p.x-start),...[0,2,4,6].map(t=>extraStart+t-start).filter(t=>t>0&&t<duration)].sort((a,b)=>a-b);
 let prev=null;for(const t of cuts){const y=at(points,start+t);if(y==null){prev=null;continue;}const diff=position(t)-y;if(diff>=-1e-9){if(!prev)return t;let lo=prev.t,hi=t;for(let i=0;i<48;i++){const mid=(lo+hi)/2;if(position(mid)-at(points,start+mid)<0)lo=mid;else hi=mid;}return (lo+hi)/2;}prev={t,diff};}return null;
}
// Only exact source gap bounds and neighboring stages can identify omitted depth.
// Unspecified gaps are retained; neither a two-month length nor a title guess is evidence.
function gapParts(base,axis,previous,next){
 const start=previous[2]+1,end=next[1]-1;if(end<start)return [];
 const scopeStage=G.stage(previous[0],'school'),metadata=axis==='school'?global.PLANNER_STANDARD_DETAILS?.[base.id]:null;
 const gap=metadata?.schoolGaps.find(g=>g.start===start&&g.end===end&&g.fromStage===scopeStage&&g.toStage===G.stage(next[0],'school'));
 const depths=gap?metadata.school2.filter(b=>gap.depthIds.includes(b.id)&&b.start<=end&&b.end>=start):[];
 const cuts=[...new Set([start,end+1,...depths.flatMap(b=>[Math.max(start,b.start),Math.min(end+1,b.end+1)])])].sort((a,b)=>a-b);
 return cuts.slice(0,-1).map((a,i)=>{const b=cuts[i+1],active=depths.filter(x=>x.start<=a&&x.end+1>=b);return {sourceStart:a,sourceEnd:b-1,duration:b-a,scopeStage,sourceDepthIds:active.map(x=>x.id),sourceDepthTitle:active.map(x=>x.title).join(' · '),sourceDepthStage:active.length===1?active[0].stage:null,kind:active.length?'depth':'gap'};});
}
function chosenDepth(d,scopeStage){
 const row=d.rows.find(r=>schoolLabel(r.id)===scopeStage);if(!row||!d.deep||d.deep.id==='none'||!d.deepScope)return null;
 const n=d.deepScope.lag===null?d.deepScope.start:row.id-d.deepScope.lag;
 return {title:row.deep,stage:schoolLabel(n)||null};
}
function timeline(value,progress,answers,fields){
 const d=detail(value,progress,answers,fields),{c}=d.b,axis=d.s.axis,actual=c.axes.find(x=>x.id===axis),base=L.find(l=>l.id===(axis==='school'?c.best:G.referenceForAxis(c,axis))),n=base?+base.id.slice(1):null,selected=d.b.s.target&&(axis==='school'||d.b.s.focus===axis)?+d.b.s.target.slice(1):null,upperStart=selected!=null&&selected<n?selected:n==null?null:n-1,uppers=upperStart==null?[]:[upperStart,upperStart-1].filter(i=>i>=0).map(i=>L[i]),now=c.now,horizon=24;
 const references=uppers.map(l=>({id:l.id,points:sourcePoints(l,axis)})),profile=LOADS.find(x=>x.id===d.s.load)||null;
 const bs=base?.[axis]||[],start=actual?.ready?bs.findIndex(b=>G.stage(b[0],axis)===actual.stage):-1,ord=start>=0?ordinal(bs[start][0],axis):-1;
 if(!Number.isFinite(now)||start<0||ord<0)return {axis,now,horizon,base:base?.id||null,references,keep:[],gradual:[],segments:[],parallelDepth:[],cadenceUnscheduled:[],cadence:{id:d.s.cadence||'unknown',title:cadenceLabel(d.s),source:d.s.cadenceSource,changed:d.cadenceChanged,state:'unavailable'},profile,reason:'현재 과정에 대응하는 기간 자료가 없어 아이의 진행 예시는 표시하지 않았습니다.'};
 const fraction=actual.done?1:.5,keep=[{x:now,y:ord+fraction}],gradual=[{x:now,y:ord+fraction}],segments=[],parallelDepth=[];let kt=now,gt=now,extraStart=null,caught=null;
 const upper=uppers[0],hold=d.s.checkpoint==='practice'?2:1,checked=d.s.checkpoint==='observed'||d.s.checkpoint==='practice',enabled=checked&&!!d.s.allocation&&(d.s.allocation!=='advance'||!!profile),adjusting=enabled&&d.s.allocation==='advance'&&axis==='school';
 const last=bs.findLastIndex(b=>ordinal(b[0],axis)>=0);let seen=0;
 for(let i=start;i<=last;i++){
  const b=bs[i],rank=ordinal(b[0],axis),full=b[2]-b[1]+1,portion=i===start?1-fraction:1,gap=i>start?Math.max(0,b[1]-bs[i-1][2]-1):0;
  if(gap)for(const part of gapParts(base,axis,bs[i-1],b)){
   const selectedDepth=chosenDepth(d,part.scopeStage),isDepth=part.kind==='depth',assigned=isDepth&&d.s.cadence==='sequential'&&!!selectedDepth;
   const depthTitle=assigned?selectedDepth.title:isDepth?part.sourceDepthTitle:null,stage=assigned?selectedDepth.stage:part.sourceDepthStage;
   if(isDepth&&d.s.cadence==='parallel'){
    const preceding=segments.findLast(s=>s.gain>0&&s.scopeStage===part.scopeStage);
    const scenarioStart=preceding?.scenarioStart??gt,keepStart=preceding?.keepStart??kt;
    // This is an independent depth lane, not a faster copy of the school lane.
    // Keep the source depth duration even when added school sessions shorten a course.
    parallelDepth.push({...part,baseDuration:part.duration,depthTitle:d.deep?.id==='none'?null:selectedDepth?.title||part.sourceDepthTitle,stage:selectedDepth?.stage||part.sourceDepthStage,assigned:!!selectedDepth,omitted:d.deep?.id==='none',scenarioStart,scenarioEnd:scenarioStart+part.duration,keepStart,keepEnd:keepStart+part.duration});
    continue;
   }
   const scenarioStart=gt,keepStart=kt;kt+=part.duration;gt+=part.duration;
   keep.push({x:kt,y:keep.at(-1).y});gradual.push({x:gt,y:gradual.at(-1).y});
   segments.push({...part,course:assigned?depthTitle:isDepth?part.sourceDepthTitle:'원자료의 미지정 간격',depthTitle,stage,baseDuration:part.duration,duration:part.duration,upperDuration:null,factor:1,phase:assigned?'교과 뒤 심화':'기존 간격 보존',gain:0,assigned,assignment:assigned?'selected':'reference',cadence:d.s.cadence||'unknown',scenarioStart,scenarioEnd:gt,keepStart,keepEnd:kt});
  }
  const gain=rank<0?0:portion,baseDuration=full*portion;if(!portion)continue;const k=rank>=0?seen++:seen,ub=upper?.[axis]?.find(x=>G.stage(x[0],axis)===G.stage(b[0],axis)&&G.stage(x[0],axis)),upperFull=ub?ub[2]-ub[1]+1:null,before=gt,gy=gradual.at(-1).y,ky=keep.at(-1).y,baseline=classBaseline(b[0]),eligible=adjusting&&k>=hold&&rank>=0&&!!baseline;
  kt+=baseDuration;keep.push({x:kt,y:rank<0?ky:rank+1,label:D.shortText(b[0])});
  if(eligible&&extraStart==null&&!caught)extraStart=gt;
  const elapsed=extraStart==null?0:gt-extraStart,extraRatio=profile&&baseline?profile.sessions/baseline.sessions:0,canAdd=eligible&&!caught;
  let duration=caught&&rank>=0&&upperFull!=null?upperFull*portion:canAdd?scenarioDuration(baseDuration,elapsed,extraRatio):baseDuration;
  const position=dt=>rank<0?gy:gy+(canAdd?(workClock(elapsed+dt,extraRatio)-workClock(elapsed,extraRatio))/full:dt/(caught&&upperFull!=null?upperFull:full));
  const hit=eligible&&!caught&&rank>=0?findCatch(references[0],before,duration,position,extraStart??before):null;
  const firstPart=hit==null?duration:hit;
  if(canAdd){const cuts=[2-elapsed,4-elapsed,6-elapsed];for(let dt=1/8;dt<firstPart-1e-9;dt+=1/8)cuts.push(dt);for(const dt of [...new Set(cuts.filter(t=>t>0&&t<firstPart-1e-9))].sort((a,b)=>a-b))gradual.push({x:before+dt,y:position(dt)});}
  if(hit!=null){const y=position(hit);caught={x:before+hit,y,target:references[0].id,course:D.shortText(b[0]),baselineSessions:baseline?.sessions||null,sessionHours:baseline?.hours||null,maintenanceExtra:baseline&&upperFull!=null?Math.max(0,baseline.sessions*(full/upperFull-1)/TRANSFER):null};gradual.push({x:caught.x,y});duration=hit+(rank+1-y)*(upperFull??full);}
  gt=before+duration;gradual.push({x:gt,y:rank<0?gy:rank+1,label:D.shortText(b[0])});
  segments.push({course:D.shortText(b[0]),kind:rank>=0?'school':'support',stage:G.stage(b[0],axis),scopeStage:G.stage(b[0],axis),scenarioStart:before,keepStart:kt-baseDuration,baseDuration,duration,upperDuration:upperFull==null?null:upperFull*portion,factor:duration/baseDuration,phase:!checked?'확인 전 · 유지':!d.s.allocation?'추가 분량 용도 선택 전':d.s.allocation==='advance'&&!profile?'추가 회차 선택 전':!adjusting?'현재 진도 유지':caught?'합류 후 같은 과정 속도':k<hold?'확인 구간':rank<0?'기존 과정 유지':elapsed>=ADAPT_MONTHS?'목표 회차 유지 · 합류까지':'학습량을 서서히 늘리는 중',gain,windowElapsedBefore:elapsed,windowElapsedAfter:extraStart==null?0:gt-extraStart,keepEnd:kt,scenarioEnd:gt,baselineSessions:baseline?.sessions||null,sessionHours:baseline?.hours||null});
 }
 const cadenceUnscheduled=axis==='school'&&d.s.cadence==='sequential'&&d.deep?.id!=='none'?d.rows.filter(row=>!segments.some(s=>s.kind==='depth'&&s.scopeStage===schoolLabel(row.id)&&s.assigned)).map(row=>({scopeStage:schoolLabel(row.id),depthTitle:row.deep,reason:'이 범위의 별도 심화 기간은 원자료에서 확인되지 않습니다.'})):[];
 const cadence={id:d.s.cadence||'unknown',title:cadenceLabel(d.s),source:d.s.cadenceSource,changed:d.cadenceChanged,state:!d.s.cadence?'unselected':d.deep?.id==='none'?'no-depth':cadenceUnscheduled.length?'needs-duration':'applied'};
 const end=now+horizon,clip=pts=>{const visible=pts.filter(p=>p.x<=end);if(pts.some(p=>p.x>end)){const y=at(pts,end);if(y!=null)visible.push({x:end,y});}return visible;};
 const milestone=adjusting?segments.filter(x=>x.gain>0&&x.keepEnd<=end&&x.scenarioEnd<=end&&x.keepEnd-x.scenarioEnd>1e-6).at(-1)||null:null;
 const sample=[0,3,6,9,12,15,18,21,24].map(t=>({month:t,label:calendarAt(now,t,fields).label,keep:at(keep,now+t),gradual:enabled?at(gradual,now+t):null,refs:references.map(r=>({id:r.id,value:at(r.points,now+t)}))}));
 const currentBase=classBaseline(bs[start][0]),sameUpper=upper?.[axis]?.find(x=>G.stage(x[0],axis)===G.stage(bs[start][0],axis)),currentFull=bs[start][2]-bs[start][1]+1,upperFull=sameUpper?sameUpper[2]-sameUpper[1]+1:null,extraForPace=currentBase&&upperFull!=null?Math.max(0,currentBase.sessions*(currentFull/upperFull-1)/TRANSFER):null;
 return {axis,now,horizon,base:base.id,references,keep:clip(keep),gradual:enabled?clip(gradual):[],segments,parallelDepth,cadence,cadenceUnscheduled,sample,enabled,adjusting,profile,milestone,catch:caught&&caught.x<=end?caught:null,window:extraStart==null?null:{start:extraStart,end:extraStart+ADAPT_MONTHS},chase:extraStart==null?null:{start:extraStart,end:Math.min(caught?.x??Infinity,end,gradual.at(-1).x)},followup:'이후는 학습 성향에 따라 달라짐',pace:{currentBase,extraForPace,target:references[0]?.id||null},adaptMonths:ADAPT_MONTHS,transfer:TRANSFER,reason:enabled?'선택한 확인 조건과 추가 회차를 가정한 일정 비교입니다.':'다음 과정 전 확인과 추가 회차를 고를 때까지 현재 흐름을 유지합니다.'};
}
function frequency(n){return Number(n.toFixed(2)).toString();}
function scenarioNote(d,m){
 if(!m.keep.length)return '이 영역은 현재 과정의 기간 자료가 없어 속도 조정을 비교하지 않습니다.';
 if(d.s.tempo!=='gradual')return '지금 공부 속도를 유지할 때의 일정을 보여드립니다.';
 if(!d.checkpoint||d.s.checkpoint==='pending')return '풀이 확인 전입니다. 추가 회차를 골라도 빠른 진행선으로 바꾸지 않습니다.';
 if(!d.s.allocation)return '추가 분량을 어디에 쓸지 먼저 선택해 주세요. 용도 선택 전에는 빠른 진행선을 그리지 않습니다.';
 if(d.s.allocation==='review')return '추가 분량은 현재 범위의 복습·심화·오류 보완에 씁니다. 진도선은 유지하고 공부의 깊이를 더하는 선택입니다.';
 if(!m.profile)return '교과 새 진도에 더할 목표 회차를 주 1회 또는 주 2회 중에서 골라 주세요. 추가 회차를 고르면 일정 차이를 비교할 수 있습니다.';
 if(m.axis!=='school')return '추가 회차는 교과의 새 진도에만 배분합니다. 이 영역과 기존 심화·연산은 각자의 계획을 유지합니다.';
 return '목표 평균 주 '+frequency(m.profile.sessions)+'회 추가를 기준으로, 추가 회차의 50%를 2개월째, 80%를 4개월째, 100%를 6개월째에 배분합니다. '+(m.catch?'상위 예시와 같은 범위에 이른 뒤에는 추격을 멈추고 같은 과정 속도로 이어갑니다. 이후는 학습 성향에 따라 달라짐.':'6개월 뒤에는 목표 회차를 더 늘리지 않고 유지하며 상위 예시를 천천히 따라가는 경우를 비교합니다. 자료가 있는 24개월 안에 만나지 않으면 합류 시점은 미정입니다.');
}
function differenceText(m){if(!m.milestone)return '';const gap=m.milestone.keepEnd-m.milestone.scenarioEnd;return m.milestone.course+' 범위 일정 · 유지할 때보다 '+(gap<.1?'0.1개월 미만':('약 '+gap.toFixed(1)+'개월'))+' 앞서는 예시';}
function curveNote(d,m){if(!m.enabled)return scenarioNote(d,m);if(d.s.allocation==='review')return '늘린 학습량으로 복습·심화 보완 · 교과 진도는 유지';if(!m.adjusting)return scenarioNote(d,m);return '비교 가정 · 목표 평균 주 '+frequency(m.profile.sessions)+'회 추가 · 2개월 50% / 4개월 80% / 6개월 100% · 목표 회차는 합류까지 유지 · 복습·심화·연산 유지';}
function renderScenario(d,m,fields={}){if(d.s.tempo!=='gradual')return '';const pb=m.pace?.currentBase;return `<section class="transition-scenario" aria-label="추가 학습량의 배분과 확인"><h5>늘린 분량을 어디에 쓰나요?</h5><p>${esc(scenarioNote(d,m))}</p><button type="button" data-transition-open="allocation">${d.s.allocation?'추가 분량의 용도 바꾸기':'추가 분량의 용도 고르기'}</button>${d.s.allocation==='advance'?` <button type="button" data-transition-open="load">${m.profile?'추가 회차 가정 바꾸기':'새 진도에 더할 회차 고르기'}</button>`:''}<table class="scenario-baseline"><caption>교과·사고력 각각의 수업 기준</caption><thead><tr><th>공부하는 과정</th><th>주당 횟수</th><th>회당 시간</th></tr></thead><tbody>${Object.values(CLASS_BASELINES).map(b=>`<tr><th>${b.label}</th><td>주 ${b.sessions}회</td><td>${b.hours}시간</td></tr>`).join('')}</tbody></table><p>학교 학년이 아니라 현재 공부하는 과정에 적용합니다. 수업을 늘리더라도 배운 내용을 혼자 다시 풀 시간과 휴식은 남겨두어야 합니다. 사고력·심화·연산의 추가 회차를 자동 배정하지 않습니다.</p>${m.adjusting?`<table class="scenario-ramp"><caption>학습량을 늘리기 시작한 뒤의 추가 회차</caption><thead><tr><th>시점</th><th>목표 추가분 반영</th><th>평균 추가 회차</th></tr></thead><tbody>${[[0,0],[2,.5],[4,.8],[6,1]].map(([t,f])=>`<tr><th>${t?t+'개월째':'시작'}</th><td>${f*100}%</td><td>주 ${frequency(m.profile.sessions*f)}회</td></tr>`).join('')}</tbody></table><p>표의 소수 회차는 적응 구간 동안 추가 수업을 배분한 평균입니다. 기본 수업은 매주 유지하며, 목표 추가 회차에 처음부터 모두 도달하는 뜻은 아닙니다. 현재 기준 회당 ${pb?.hours||2}시간이며 과정이 바뀌면 위 기준을 따릅니다.</p><dl class="scenario-assumptions"><dt>현재 기본 배분</dt><dd>${pb?pb.label+' · 주 '+pb.sessions+'회 × '+pb.hours+'시간':'현재 과정 확인 전'}. 기존 복습·심화·연산과 휴식은 유지합니다.</dd><dt>상위와 같은 과정 속도</dt><dd>${m.pace.extraForPace==null?'동일 과정의 기간 자료가 없어 추가 회차를 계산하지 않았습니다.':m.pace.extraForPace<.001?'현재 원자료의 같은 과정 기간은 비슷합니다. 같은 속도를 맞추기 위한 추가 회차는 0회로 계산되지만 앞서 시작한 진도 차이는 남습니다.':'같은 과정 속도에 필요한 추가 회차는 평균 주 '+frequency(m.pace.extraForPace)+'회입니다. 현재 기본 회차에 더하는 계산상 참고값이며 담당 선생님과 실제 부담을 확인합니다.'}</dd><dt>같은 범위에 이를 때까지의 학습량</dt><dd>목표 평균 주 ${frequency(m.profile.sessions)}회 추가. ${m.window?esc(calendarAt(m.now,m.window.start-m.now,fields).label)+'부터 '+esc(calendarAt(m.now,m.window.end-m.now,fields).label)+'까지 목표 회차에 적응하는 참고 구간입니다. ':''}확인 구간 뒤 6개월에 걸쳐 목표 회차까지 조금씩 늘립니다. 그 뒤에는 회차를 더 늘리지 않고 같은 목표를 유지하며 합류할 때까지만 추격합니다. 교과 뒤에 배치한 심화와 미지정 간격은 추가 회차 때문에 줄이지 않습니다.</dd><dt>진도 반영 가정</dt><dd>추가 회차의 최대 절반을 새 범위 진행에, 나머지를 새 개념의 재풀이·적용 여유에 반영합니다. 효과를 측정한 비율이 아닙니다.</dd><dt>합류 뒤</dt><dd>${m.catch?'현재부터 약 '+(m.catch.x-m.now).toFixed(1)+'개월 시점에 '+m.catch.target+'의 범위와 만나는 예시입니다. 그 뒤에는 해당 예시의 같은 과정 속도를 사용합니다. 합류한 과정의 기본 주 '+m.catch.baselineSessions+'회에 '+(m.catch.maintenanceExtra==null?'같은 속도에 필요한 추가 회차를 확인해야 합니다.':'평균 주 '+frequency(m.catch.maintenanceExtra)+'회를 더하는 유지 가정이며 회당 '+m.catch.sessionHours+'시간입니다.')+' 유지 부담이 맞지 않으면 기본 배분으로 조정합니다.':'이 선택으로는 자료가 있는 24개월 안에 합류하지 않습니다. 목표 회차를 계속 늘려 합류를 만들지 않으며 그 이후 시점은 미정입니다.'} 이후는 학습 성향에 따라 달라짐. 상위의 같은 과정 기간을 참고하고 복습·심화 배치는 실제 학습 모습에 맞춰 조정합니다.</dd></dl>${m.milestone?`<section class="scenario-difference" aria-label="같은 범위의 일정 차이"><h6>${esc(m.milestone.course)} 범위 일정 비교</h6><dl><dt>지금 배분 유지</dt><dd>${esc(calendarAt(m.now,m.milestone.keepEnd-m.now,fields).label)} · 현재부터 약 ${(m.milestone.keepEnd-m.now).toFixed(1)}개월</dd><dt>학습량을 늘린 경우</dt><dd>${esc(calendarAt(m.now,m.milestone.scenarioEnd-m.now,fields).label)} · 현재부터 약 ${(m.milestone.scenarioEnd-m.now).toFixed(1)}개월</dd></dl><p>${esc(differenceText(m))}. 선택한 교재의 끝 범위 이후라면 그래프의 참고 일정입니다.</p></section>`:''}<p>추격 기간·반영 비율·회차는 일정 비교 가정입니다. 합류는 숙달·성적·입시 판정이 아니며, 설명·적용·오류·피로를 확인해 실제 배분을 조정합니다.</p>`:''}<p class="study-parallel-note">국제학교의 방학 달은 자동 지정하지 않습니다. 방학의 추가 분량도 새 진도에 전부 쓰지 않습니다.</p></section>`;}
function catchDetail(m){
 if(!m.catch||!m.profile||!m.window)return null;
 const elapsed=Math.max(0,m.catch.x-m.window.start),extraMonths=elapsed,ratio=rampFraction(elapsed),after=m.segments.filter(s=>s.gain>0&&s.scenarioEnd-s.duration>=m.catch.x-1e-7&&s.upperDuration!=null).slice(0,3);
 return {months:m.catch.x-m.now,extraMonths,afterWindow:elapsed>6,extraAtCatch:m.profile.sessions*ratio,after:after.map(s=>({course:s.course,own:s.duration,upper:s.upperDuration,sessions:s.baselineSessions,hours:s.sessionHours,maintenanceExtra:Math.max(0,s.baselineSessions*(s.baseDuration/s.upperDuration-1)/TRANSFER)}))};
}
function meetingText(m){return m.catch?'현재부터 약 '+(m.catch.x-m.now).toFixed(1)+'개월 뒤 '+m.catch.target+' 예시와 같은 진도에 도달합니다. 이후에는 같은 과정 속도로 진행합니다.':'자료가 있는 24개월 안에는 같은 진도에 도달하는 시점이 미정입니다.';}
function renderCatchDetail(m){const c=catchDetail(m);if(!c)return '';return `<section class="catch-detail" aria-label="따라잡기까지와 이후의 회차"><h5>같은 범위에 이른 뒤에는 어떻게 공부하나요?</h5><p class="catch-meeting-note">${esc(meetingText(m))}</p><dl><dt>현재부터 만나는 시점</dt><dd>약 ${c.months.toFixed(1)}개월 뒤 · ${esc(m.catch.target)}. 기존 일정과 확인 구간을 포함한 총기간입니다.</dd><dt>학습량을 늘려 공부한 기간</dt><dd>약 ${c.extraMonths.toFixed(1)}개월. 목표 평균 주 ${frequency(m.profile.sessions)}회 추가를 서서히 늘리는 가정입니다.</dd><dt>만나는 시점의 추가 회차</dt><dd>평균 주 ${frequency(c.extraAtCatch)}회. ${c.afterWindow?'6개월 적응 뒤 목표 회차를 더 늘리지 않고 유지한 결과입니다. 같은 범위에 이르면 따라잡기 위한 학습을 마치고, 이후에 필요한 회차로 조정합니다.':'같은 범위에 이르면 따라잡기 위한 학습을 마치고, 이후에 필요한 회차로 조정합니다.'}</dd><dt>이후 기본 수업</dt><dd>주 ${m.catch.baselineSessions}회 × ${m.catch.sessionHours}시간${m.catch.maintenanceExtra==null?'이며, 유지에 필요한 추가 회차는 확인이 필요합니다':m.catch.maintenanceExtra>.001?' + 평균 주 '+frequency(m.catch.maintenanceExtra)+'회 추가':'이며, 이 과정에서 유지에 필요한 추가 회차는 없습니다'}. 중등은 주2회×2시간, 고등은 주2회×3시간으로 과정 기준이 바뀝니다.</dd></dl><table><caption>만난 뒤 다음 과정의 공부 속도 비교</caption><thead><tr><th>과정</th><th>이 예시</th><th>${esc(m.catch.target)}</th><th>유지 회차</th></tr></thead><tbody>${c.after.map(s=>`<tr><th>${esc(s.course)}</th><td>${s.own.toFixed(1)}개월</td><td>${s.upper.toFixed(1)}개월</td><td>기본 주${s.sessions}회×${s.hours}시간${s.maintenanceExtra>.001?' + 평균 주'+frequency(s.maintenanceExtra)+'회':''}</td></tr>`).join('')}</tbody></table><p>같은 과정에 쓰는 기간으로 속도를 비교합니다. 이후는 학습 성향에 따라 달라짐. 복습·심화 배치를 실제 학습 모습에 맞춰 조정합니다. 합류는 숙달·성적 판정이 아닙니다.</p></section>`;}
function curveLabel(y,axis){if(y==null)return '자료 범위 밖';const list=catalog(axis),boundary=Math.round(y);if(boundary>0&&Math.abs(y-boundary)<1e-6)return list[Math.min(list.length-1,boundary-1)]+' 완료 시점';return list[Math.min(list.length-1,Math.max(0,Math.floor(y)))]+ ' 과정';}
function calendarAt(now,offset,fields={}){
 const value=Math.floor(now+offset),month=((value%12)+12)%12+1,quarter=Math.floor((month-1)/3)+1;
 const year=Number.isInteger(+fields.year)&&+fields.year>=2020&&+fields.year<=2100?+fields.year+Math.floor(value/12)-Math.floor(now/12):null;
 const grade=I.labelMonth(value).replace(/\s+\d+월$/,'');
 return {month,quarter,year,grade,label:(year?year+'년 ':'')+grade+' '+quarter+'분기 · '+month+'월'};
}
// Explain the current age-specific reference without changing any curve data.
function displayReferences(m){
 // L0 has no earlier reference. Its lower neighbours are visual comparisons,
 // never catch-up targets and never inputs to the workload calculation.
 return m.base==='L0'?[1,2].map(n=>L.find(l=>l.id==='L'+n)).filter(Boolean).map(l=>({id:l.id,points:sourcePoints(l,m.axis),relation:'lower'})):m.references;
}
function thinkingPreparations(m,fields={}){
 if(m.axis!=='comp')return [];
 return m.segments.filter(s=>s.gain===0&&/프리미어/.test(s.course)&&s.keepEnd>m.now&&s.keepStart<m.now+m.horizon).map(s=>({title:'프리미어 대비',sourceTitle:s.course,start:s.keepStart,end:s.keepEnd,months:s.baseDuration,startLabel:calendarAt(m.now,s.keepStart-m.now,fields).label,endLabel:calendarAt(m.now,Math.max(s.keepStart-m.now,Math.ceil(s.keepEnd-m.now)-1),fields).label,next:m.segments.find(n=>n.gain>0&&n.keepStart>=s.keepEnd-1e-7)?.course||null}));
}
function levelComparison(d,m){
 const c=d.b.c,axis=m.axis,axisName=AXES.find(x=>x.id===axis)?.title||'교과',base=Number(m.base?.slice(1));
 if(!m.base||!Number.isFinite(base))return '';
 const lower=base===0,ids=[m.base,...(lower?[1,2]:[base-1,base-2].filter(n=>n>=0)).map(n=>'L'+n)],scope=G.levelScope(c);
 const pace=(id,own)=>{
  const source=L.find(l=>l.id===id),blocks=(source?.[axis]||[]).filter(b=>G.stage(b[0],axis));
  const actual=c.axes.find(x=>x.id===axis),active=blocks.find(b=>b[1]<=m.now&&m.now<=b[2]);
  const b=own?blocks.find(b=>G.stage(b[0],axis)===actual?.stage):active||blocks.find(b=>b[1]>m.now);
  if(!b)return {title:'이 시기 속도 자료 없음',note:'자료가 끝난 뒤의 속도를 연장하지 않습니다.'};
  const stage=G.stage(b[0],axis),months=b[2]-b[1]+1,next=blocks[blocks.indexOf(b)+1],gap=next?Math.max(0,next[1]-b[2]-1):0;
  const parts=axis==='school'&&gap>0?gapParts(source,axis,b,next):[],depthMonths=parts.filter(x=>x.kind==='depth').reduce((sum,x)=>sum+x.duration,0);
  const prepBlocks=axis==='comp'&&gap>0?(source.comp||[]).filter(x=>/프리미어 학습 집중/.test(D.shortText(x[0]))&&x[1]>=b[2]+1&&x[2]<next[1]).sort((x,y)=>x[1]-y[1]):[];
  let prepEnd=b[2]+1;for(const prep of prepBlocks)if(prep[1]<=prepEnd)prepEnd=Math.max(prepEnd,prep[2]+1);
  const prepMonths=gap>0&&prepEnd===next?.[1]?gap:0;
  const parallel=own&&d.s.cadence==='parallel';
  let note=prepMonths?'프리미어 대비 '+prepMonths+'개월':gap?[...(depthMonths?[parallel?'심화 '+depthMonths+'개월은 교과와 병행':'교과 뒤 심화 '+depthMonths+'개월 별도']:[]),...(gap>depthMonths?['다음 과정 전 간격 '+(gap-depthMonths)+'개월']:[])].join(' · '):'다음 과정으로 차례로 연결';
  if(own&&axis==='school'&&d.deep?.id==='none')note='교과 응용·연산 유지 · 별도 심화 없음'+(gap>depthMonths?' · 미지정 간격 '+(gap-depthMonths)+'개월 유지':'');
  else if(own&&axis==='school'&&d.deepScope?.id==='actual')note='현재 심화는 독립 진도로 '+(d.s.cadence==='parallel'?'병행':'유지')+(gap>depthMonths?' · 미지정 간격 '+(gap-depthMonths)+'개월 유지':'');
  const baseline=axis==='school'?classBaseline(b[0]):axis==='comp'?(/^3%/.test(stage)?CLASS_BASELINES.middle:CLASS_BASELINES.elem):null;
  return {title:(!own&&!active?'다음 ':'')+stage+' · 한 과정 '+months+'개월',note,baseline:baseline?'수업 비교 기준 주 '+baseline.sessions+'회 · 회당 '+baseline.hours+'시간':null};
 };
 const selected=displayReferences(m).map(r=>r.id),immediate=ids.slice(1),different=JSON.stringify(selected)!==JSON.stringify(immediate);
 return `<section class="level-comparison" aria-label="현재와${lower?' 아래':' 바로 위'} 두 레벨의 학습과 속도"><header><h5>${esc(I.labelMonth(m.now))} · ${esc(scope)} ${axisName} 기준</h5><p>같은 L번호라도 유아·초등·중등의 같은 학습 범위를 뜻하지 않습니다. 현재 학년·월의 진도 예시로 읽어주세요. 숫자가 작을수록 앞선 일정의 예시입니다.${lower?' L0에서는 아래 두 단계인 L1·L2의 범위와 속도를 나란히 봅니다.':''}</p></header><div class="level-comparison-grid">${ids.map((id,index)=>{
  const meaning=G.levelMeaning(c,id),rate=pace(id,index===0),actual=c.axes.find(x=>x.id===axis);
  const range=index===0?actual?.current||'현재 범위 확인 전':meaning.axes.find(x=>x.label===axisName)?.text||meaning.name;
  const rows=index===0?c.axes.map(x=>{const book=x.id==='calc'?calcName(d.a):null;return {label:x.label,text:book&&!x.current.includes(book)?book+' · '+x.current:x.current};}):meaning.axes;
  return `<article class="level-comparison-card ${index===0?'is-current':''}"><header><small>${index===0?'우리 아이 · 가까운 진도 예시':index===1?lower?'바로 아래 예시':'바로 위 예시':lower?'두 단계 아래 예시':'두 단계 위 예시'}</small><h6>${esc(scope)} 기준 ${id}</h6>${meaning.benchmarkLabel?'<p class="level-comparison-meaning">'+esc(meaning.benchmarkLabel)+'</p>':''}<p>${esc(range)}</p></header><div class="level-comparison-pace"><strong>${esc(rate.title)}</strong><span>${esc(rate.note)}</span>${rate.baseline?'<small>'+esc(rate.baseline)+'</small>':''}</div><dl>${rows.map(x=>'<dt>'+esc(x.label)+'</dt><dd>'+esc(x.text)+'</dd>').join('')}</dl>${index===0?'<small class="level-comparison-note">'+axisName+'에 가까운 L번호가 다른 영역의 수준을 대신하지 않습니다. 위 기간은 한 과정 전체의 비교 기준이며, 현재 남은 기간은 지도·월별 표에 표시합니다.</small>':'<small class="level-comparison-note">같은 학년·월의 참고 일정입니다. 우리 아이에게 교재를 자동 배정하지 않습니다.</small>'}</article>`;
 }).join('')}</div>${ids.length<3?'<p>이보다 앞선 예시는 자료에 '+(ids.length-1)+'개 있어, 없는 레벨은 만들지 않습니다.</p>':''}${different?'<p>그래프는 별도로 선택한 '+selected.map(id=>esc(scope+' 기준 '+id)).join(' · ')+'와 비교합니다. 위에는 현재 위치에서 바로 위 두 예시를 보여줍니다.</p>':''}</section>`;
}
function renderGraph(value,progress,answers,fields,options={}){
 const d=detail(value,progress,answers,fields),m=timeline(value,progress,answers,fields);if(!d.b.c.grade||!Number.isFinite(d.b.c.now))return '';
 const levelLabel=(id,short=false)=>{if(m.axis==='school')return G.levelLabel(d.b.c,id,short);const meaning=G.levelMeaning(d.b.c,id),axisName=AXES.find(x=>x.id===m.axis).title,text=meaning?.axes.find(x=>x.label===axisName)?.text||'범위 확인 전';return (short?'':'학습 레벨 ')+id+' ('+axisName+' · '+text+')';};
 const comparisonRefs=displayReferences(m),lower=m.base==='L0',preparations=thinkingPreparations(m,fields);
 const series=[{id:'keep',title:'지금 공부 속도 유지',points:m.keep,cls:'curve-keep'},...(d.s.tempo==='gradual'&&m.gradual.length?[{id:'gradual',title:'학습량을 서서히 늘린 경우'+(m.profile?' · 목표 주 '+frequency(m.profile.sessions)+'회 추가':'')+' · 일정 예시',points:m.gradual,cls:'curve-gradual'}]:[]),...comparisonRefs.map((r,i)=>({id:r.id,referenceId:r.id,title:(lower?'아래 단계 진도 예시 ':'상위 진도 예시 ')+levelLabel(r.id,true),points:r.points,cls:'curve-upper'+i}))];
 const academyRefs=options.academyLines===false?[]:academyReferences(d.b.c,m.axis,options.academyLines);
 // Toggle visibility without moving the axes or the child's existing curves.
 const samples=[...series.flatMap(s=>Array.from({length:97},(_,i)=>({x:m.now+i*.25,y:at(s.points,m.now+i*.25)})).filter(p=>p.y!=null))];
 const min=Math.max(0,Math.floor(samples.length?Math.min(...samples.map(p=>p.y)):0)),max=Math.max(min+2,Math.ceil(samples.length?Math.max(...samples.map(p=>p.y)):2));
 const W=760,H=400,left=126,right=730,top=28,bottom=288,X=x=>left+(x-m.now)/24*(right-left),Y=y=>bottom-(y-min)/(max-min)*(bottom-top);
 const ticks=Array.from({length:Math.min(6,max-min+1)},(_,i)=>Math.round(min+i*(max-min)/Math.min(5,max-min))).filter((x,i,a)=>a.indexOf(x)===i);
 return `<section class="transition-graph" aria-label="시간에 따른 레벨과 속도 비교">
 <header><div><small>진도와 속도 · 함께 보는 24개월</small><h4>학습량에 따른 진도 비교</h4></div><div class="atlas-graph-actions"><a class="catch-example-link" href="planner-catch-example.html" target="_blank" rel="noopener">따라잡는 예시 보기</a><button type="button" data-atlas-full="graph">그래프 전체 화면</button><button type="button" data-transition-open="tempo">공부 속도 비교하기</button></div></header>
 <dl class="transition-overview"><div><dt>현재 참고 레벨</dt><dd>${m.base?esc('학습 레벨 '+m.base+' ('+(d.b.c.axes.find(x=>x.id===m.axis)?.current||'현재 범위 확인 전')+')'):'현재 학습 확인 전'}</dd></div><div><dt>${lower?'아래 두 단계 비교':'상위 비교 레벨'}</dt><dd>${comparisonRefs.length?comparisonRefs.map(r=>esc(levelLabel(r.id,true))).join(' / '):'비교 자료 확인 전'}</dd></div><div><dt>선택한 공부 속도</dt><dd>${!m.keep.length?'현재 학습 확인 필요':d.s.tempo==='gradual'&&m.enabled?(d.s.allocation==='review'?'복습·심화에 추가 분량 배분':'확인 후 새 진도에 일부 배분'):'지금 공부 속도 유지'}</dd></div></dl>
 <div class="transition-axis-buttons" role="group" aria-label="그래프의 영역">${AXES.map(x=>`<button type="button" data-transition-kind="axis" data-transition-value="${x.id}" aria-pressed="${d.s.axis===x.id}">${esc(x.title)}</button>`).join('')}</div>
 ${options.academyLines===false?'':renderAcademyControls(d.b.c,options.academyLines)}
 ${d.book&&d.range?`<p class="graph-selected-scope"><b>${esc(d.book.book)}</b> · ${esc(rangeLabel(d.n,d.range.end))}<span>이후 과정은 비교용 참고 일정</span></p>`:''}<p class="transition-chart-caption">${esc(AXES.find(x=>x.id===m.axis).title)} 과정의 순서 · ${esc(calendarAt(m.now,0,fields).label)}부터 2년간 비교합니다. 학교 학년과 교재 학년은 다를 수 있습니다.</p>${d.s.tempo==='gradual'?`<p class="transition-curve-note">${esc(curveNote(d,m))}${m.catch?`<strong class="catch-summary">${esc(meetingText(m))} 학습량을 늘려 공부하는 기간 약 ${catchDetail(m).extraMonths.toFixed(1)}개월 · 이후는 학습 성향에 따라 달라짐</strong>`:''}${m.milestone?`<strong>${esc(differenceText(m))}</strong>`:''}</p>`:''}
 ${m.keep.length?`<div class="transition-chart-wrap" tabindex="0" role="region" aria-label="좌우로 볼 수 있는 진도 그래프"><svg viewBox="0 0 ${W} ${H}" data-domain-min="${min}" data-domain-max="${max}" role="img" aria-label="지금 속도, 학습량을 늘린 경우와 ${lower?'아래 두 단계':'상위'} 예시를 비교합니다. 학원별 실제 과정은 아래의 같은 24개월 일정에서 함께 살펴봅니다.">
 ${Array.from({length:8},(_,i)=>`<rect x="${X(m.now+i*3)}" y="${top}" width="${(right-left)/8}" height="${bottom-top}" class="curve-quarter-band band-${i%2}"/><line x1="${X(m.now+i*3)}" x2="${X(m.now+i*3)}" y1="${top}" y2="${bottom}" class="curve-calendar-grid"/>`).join('')}
 ${m.adjusting&&m.chase&&m.chase.start<m.now+24&&m.chase.end>m.chase.start?`<rect x="${X(Math.max(m.now,m.chase.start))}" y="${top}" width="${X(m.chase.end)-X(Math.max(m.now,m.chase.start))}" height="${bottom-top}" class="curve-chase-window"/><text x="${X((Math.max(m.now,m.chase.start)+m.chase.end)/2)}" y="${top+16}" text-anchor="middle" class="curve-chase-label">합류까지 · 회차 상한 유지</text>`:''}
 ${preparations.map(p=>{const start=Math.max(m.now,p.start),end=Math.min(m.now+24,p.end),x=X(start),width=X(end)-x;return `<g class="curve-preparation" aria-label="${esc(p.title+' · '+p.startLabel+' ~ '+p.endLabel)}"><rect x="${x}" y="${top}" width="${width}" height="${bottom-top}" class="curve-preparation-window" fill="#e7d9ef" fill-opacity=".45"/><text x="${x+width/2}" y="${top+18}" text-anchor="middle" class="curve-preparation-label">프리미어 대비</text></g>`;}).join('')}
 <line x1="${left}" x2="${left}" y1="${top}" y2="${bottom}" class="curve-now-line"/>
 ${ticks.map(v=>`<line x1="${left}" x2="${right}" y1="${Y(v)}" y2="${Y(v)}" class="curve-grid"/><text x="${left-10}" y="${Y(v)+4}" text-anchor="end">${esc(catalog(m.axis)[Math.min(v,catalog(m.axis).length-1)]?.replace('기적의 계산법 ','계산법 ').replace('기적의 중학','중학 ')||'')}</text>`).join('')}
 ${[0,3,6,9,12,15,18,21,24].map(t=>{const date=calendarAt(m.now,t,fields),x=X(m.now+t);return `<text class="curve-calendar" x="${x}" y="${bottom+26}" text-anchor="middle"><tspan x="${x}">${esc(date.grade)}</tspan><tspan x="${x}" dy="20">${date.month}월${t===0?' 현재':''}</tspan><tspan class="curve-quarter" x="${x}" dy="20">${date.year?String(date.year).slice(-2)+'년 ':''}${date.quarter}분기</tspan></text>`;}).join('')}
 ${series.map(s=>{let pen=false,path='';for(let i=0;i<=192;i++){const x=m.now+i/8,y=at(s.points,x);if(y==null){pen=false;continue;}path+=(pen?'L':'M')+X(x).toFixed(2)+' '+Y(y).toFixed(2)+' ';pen=true;}const first=s.id==='keep'?s.points[0]:null;return `<path d="${path}" class="${s.cls}"/>${first?`<circle cx="${X(first.x)}" cy="${Y(first.y)}" r="4" class="curve-current-point"/>`:' '}`;}).join('')}${m.catch&&d.s.tempo==='gradual'?`<line x1="${X(m.catch.x)}" x2="${X(m.catch.x)}" y1="${top}" y2="${bottom}" class="curve-catch-line"/><circle cx="${X(m.catch.x)}" cy="${Y(m.catch.y)}" r="5" class="curve-catch-point"/><text x="${Math.min(right-4,X(m.catch.x)+10)}" y="${Math.max(top+16,Y(m.catch.y)-12)}" class="curve-catch-label" text-anchor="${X(m.catch.x)>right-160?'end':'start'}">약 ${(m.catch.x-m.now).toFixed(1)}개월 · 같은 범위</text>`:''}</svg></div><ul class="transition-legend">${series.map(s=>`<li class="${s.cls}"><i aria-hidden="true"></i>${esc(s.title)}</li>`).join('')}</ul>`:`<p>${esc(m.reason)}</p>`}
 ${preparations.map(p=>`<aside class="transition-prep-note" aria-label="독쌤의 프리미어 대비 안내"><strong>${esc(p.title)} · ${p.months}개월</strong><small>${esc(p.startLabel)} ~ ${esc(p.endLabel)}</small><p>프리미어 대비에 집중하는 기간입니다. <u>사고력 새 진도 대신 배운 문제의 조건·풀이 설명과 발표</u>를 연습합니다. <mark>교과·심화·연산은 각 일정대로 이어갑니다.</mark>${p.next?' 이 기간 뒤에는 '+esc(p.next)+'으로 연결합니다.':''}</p></aside>`).join('')}
 ${renderAcademyRoadmaps(academyRefs,d.b.c,fields)}
 ${levelComparison(d,m)}
 <div class="transition-graph-actions"><button type="button" data-transition-open="book">교재·범위와 병행 계획 고르기</button></div><p class="transition-condition">${d.range?'선택한 교재 계획은 '+schoolLabel(d.range.end)+'까지입니다. 그 이후는 공부 속도를 비교하기 위한 참고 일정입니다. ':''}${esc(scenarioNote(d,m))} ${esc(cadenceNote(d.s))}</p>
 <details class="graph-reading"><summary>합류 뒤 회차와 계산 가정</summary>${renderCatchDetail(m)}
 ${renderScenario(d,m,fields)}
 ${d.s.tempo==='gradual'?`<details class="progress-faq volume-faq"><summary>${d.s.allocation==='review'?'공부를 더 하는데 진도선이 그대로여도 괜찮나요?':!m.enabled?'추가 분량을 골라야 일정 차이가 보이는 이유는 무엇인가요?':'학습량을 늘리면 상위 레벨과의 격차도 바로 줄어드나요?'}</summary><p>${esc(scenarioNote(d,m))} 책의 완료 여부와 별개로 조건을 바꾼 문제의 적용·풀이 설명·오류 수정·피로를 다시 살펴봅니다. 같은 과정의 속도가 비슷해져도 먼저 시작한 진도 차이는 남을 수 있습니다.</p></details>`:''}
 ${m.adjusting?`<details class="progress-faq frequency-faq"><summary>상위 예시와 같은 속도로 공부하려면 주 몇 회가 필요한가요?</summary><p>교과·사고력 각각 초등은 주1회·2시간, 중등은 주2회·2시간, 고등은 주2회·3시간을 기본으로 둡니다. ${m.pace.extraForPace==null?'같은 과정의 기간 자료가 없어 필요한 추가 회차는 보류합니다.':m.pace.extraForPace<.001?'현재 비교 예시는 같은 과정을 다루는 기간이 비슷해 속도를 맞추기 위한 추가 회차는 0회로 계산됩니다. 먼저 시작한 진도 차이를 따라잡는 일과는 다릅니다.':'현재 같은 과정의 속도에 필요한 추가 회차는 평균 주 '+frequency(m.pace.extraForPace)+'회라는 비교 가정입니다.'} 선택한 추격 배분은 목표 평균 주 ${frequency(m.profile.sessions)}회 추가이며, 2개월50%·4개월80%·6개월100%까지 늘린 뒤 목표 회차를 유지합니다. 합류하면 추격은 끝내고 상위 과정 속도에 맞춥니다. 이후는 학습 성향에 따라 달라짐. 같은 속도에 도달하거나 합류한 뒤에도 실제 유지 부담을 확인합니다. 횟수만으로 숙달을 판단하지 않습니다.</p></details>`:''}

 <details><summary>그래프의 일정 계산 방법 보기</summary>
 <p>${m.base?'현재 '+(AXES.find(x=>x.id===m.axis)?.title||'학습')+' 진도에 가까운 '+levelLabel(m.base)+'의 기간을 아이의 일정과 비교할 때 참고합니다.':''}${!lower&&m.references.length<2?' 원자료에서 비교할 상위 예시는 '+m.references.length+'개입니다.':''} 세로축은 ${esc(AXES.find(x=>x.id===m.axis).title)} 과정의 순서, 가로축은 지금부터 24개월입니다. 학습 능력 점수가 아니며, 과정 한 칸마다 분량과 난도가 같지는 않습니다.</p>
 <p>학습 경험에서 측정한 예측값이 아닌 계획 비교입니다. 기본 수업은 교과·사고력 각각 초등 주1회·2시간, 중등 주2회·2시간, 고등 주2회·3시간입니다. 추가 회차는 교과 새 진도만을 대상으로 합니다. 목표 추가 회차의 반영은 시작0%, 2개월50%, 4개월80%, 6개월100%이며 그 사이를 연속적으로 연결합니다. 추가 회차의 최대 절반을 새 범위 진행으로 계산하고 나머지는 재풀이·적용 여유로 둡니다. 이 비율은 실측 효과가 아닙니다. 6개월은 달력 기준의 적응 기간이며 그 사이의 심화·미지정 간격도 포함합니다. 이후 목표 회차는 더 늘리지 않고 합류할 때까지 유지하며 적응 기간을 다시 시작하지 않습니다. 상위 첫 예시의 범위와 만나면 추격 추가를 멈추고 같은 과정의 기간을 참고합니다. 이후는 학습 성향에 따라 달라짐. 같은 과정 속도를 기준으로 삼되 기존 복습·심화 간격은 유지한 참고 일정이며 실제 이후 배치는 성향에 맞춰 조정합니다. 상위 예시의 동일 과정 자료가 없으면 그 과정은 기존 기간을 유지합니다.</p>
 <p>원자료가 끝난 선은 그 지점에서 끝납니다. 과정 순서 축에 포함되지 않은 초등 계통 대수심화 기간에는 선이 평평하게 보일 수 있습니다. ${esc(cadenceNote(d.s))} 교과선이 올라가도 심화·연산·개념 이해의 숙달을 뜻하지 않습니다. 학기와 방학 시기는 실제 학교에서 확인합니다.</p>
 ${m.sample?`<div class="transition-sample-wrap"><table><caption>학년·분기별로 살펴보는 공부 범위</caption><thead><tr><th>시점</th><th>지금 공부 속도</th><th>학습량을 늘릴 때</th>${comparisonRefs.map(r=>`<th>${esc(levelLabel(r.id,true))}</th>`).join('')}</tr></thead><tbody>${m.sample.map(r=>`<tr><th>${esc(r.label)}</th><td>${esc(curveLabel(r.keep,m.axis))}</td><td>${d.s.tempo==='gradual'?esc(curveLabel(r.gradual,m.axis)):'미선택'}</td>${(lower?comparisonRefs.map(ref=>({id:ref.id,value:at(ref.points,m.now+r.month)})):r.refs).map(x=>`<td>${esc(curveLabel(x.value,m.axis))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}</details></details></section>`;
}
function renderTrail(value,progress,answers,fields){const d=detail(value,progress,answers,fields);if(!d.book)return '';
 const rows=[['book','교과 교재',d.book.book],...(d.range?[['range','이어갈 범위',rangeLabel(d.n,d.range.end)]]:[]),...(d.deep?[['deep','심화 교재',d.deep.title]]:[]),...(d.deepScope?[['deepScope','심화 범위',d.deepScope.title]]:[]),...(d.s.cadence?[['cadence','교과·심화 진행 방식',d.cadenceTitle]]:[]),...(d.calc?[['calc','연산 병행',d.calc.title]]:[]),...(d.checkpoint?[['checkpoint','다음 과정 전 확인',d.checkpoint.title],['tempo','공부 속도',TEMPOS.find(x=>x.id===d.s.tempo).title],...(d.s.tempo==='gradual'&&d.s.allocation?[['allocation','추가 분량의 용도',ALLOCATIONS.find(x=>x.id===d.s.allocation).title],...(d.s.allocation==='advance'&&d.s.load?[['load','새 진도 추가 회차',LOADS.find(x=>x.id===d.s.load).title]]:[])]:[])]:[])];
 return `<section class="transition-trail" aria-label="교재와 범위의 세부 계획"><header><small>선택한 만큼 지도에 연결됩니다</small><h3>교재·범위와 심화·연산 병행</h3></header><ol class="transition-nodes">${rows.map(([id,label,text])=>`<li><button type="button" data-transition-open="${id}"><small>${esc(label)}</small><strong>${esc(text)}</strong></button></li>`).join('')}</ol>${d.range?`<details class="transition-plan-detail"><summary>과정별로 어디까지 어떻게 공부하나요?</summary><div class="transition-rows">${d.rows.map((r,i)=>`<article><h4>${i+1}. ${esc(r.school)}</h4><dl><dt>교과에서 다룰 범위</dt><dd>개념과 대표 유형을 스스로 적용하고, 응용 문제의 조건·식의 이유와 오류 재풀이까지 확인합니다.</dd><dt>심화 과정</dt><dd>${esc(r.deep)} · 한 문제의 조건 연결과 풀이 근거를 비교합니다.</dd><dt>연산 병행</dt><dd>${esc(r.calc)}. 권수에 맞춰 급히 끝내지 않고 원리·정확성·오류 수정을 확인합니다.</dd><dt>다음 범위 전 확인</dt><dd>${esc(r.checkpoint)}. 도움이 계속 필요하면 해당 부분을 보완하고 다른 공부는 유지합니다.</dd></dl></article>`).join('')}</div>${d.calc?.chain.length?`<section class="transition-calc-lane"><h4>교과와 나란히 이어가는 연산 흐름</h4><ol>${d.calc.chain.map((name,i)=>`<li><strong>${esc(name)}</strong><p>${i===0?'현재 범위의 원리와 오류 재풀이부터 확인합니다.':'앞 범위를 독립적으로 계산하고 설명하는지 확인한 뒤 이 범위를 다룹니다.'}</p></li>`).join('')}</ol><p>각 교과 학기에 연산 전권을 맞추지 않습니다. 다음 교과에 필요한 대표 계산을 먼저 확인하고, 막히는 부분을 이 연산 흐름에서 보완합니다.</p></section>`:''}<p>쪽수·세부 목차는 판본이 확인되지 않아 지정하지 않았습니다. 선택한 교재의 실제 목차와 학교 수업 범위를 담당 선생님과 확인해 주세요. 연산은 독립된 흐름이며 각 교과 학기마다 같은 연산 전권을 반복하라는 뜻이 아닙니다.</p></details>`:''}</section>`;
}
global.PlannerTransition=Object.freeze({CHECKS,TEMPOS,ALLOCATIONS,LOADS,CADENCES,cadenceOptions,cadenceLabel,cadenceNote,inheritCadence,AXES,defaultAxis,CLASS_BASELINES,classBaseline,rampFraction,rampIntegral,workClock,scenarioDuration,findCatch,frequency,catchDetail,meetingText,renderCatchDetail,differenceText,curveNote,scenarioNote,renderScenario,scope,calendarAt,schoolNumber,schoolLabel,rangeLabel,bookOptions,rangeOptions,deepBooks,deepScopes,calcOptions,restore,choose,detail,catalog,ordinal,sourcePoints,at,ACADEMY_LINES,restoreAcademyLines,toggleAcademyLine,academyReferences,renderAcademyControls,academyMonthPlan,renderAcademyMonthCourse,renderAcademyMonthly,renderAcademyRoadmaps,timeline,displayReferences,thinkingPreparations,levelComparison,renderGraph,renderTrail});
})(window);
