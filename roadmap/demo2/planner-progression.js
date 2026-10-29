/* 진도 예시 비교와 다음 학습 설계. 실제 답·성향·원본 기간·배치를 변경하지 않는다. */
(function(global){
'use strict';
const I=global.PlannerIntake,P=global.Planner,D=global.DemoContent,LEVELS=global.PLANNER_LEVELS;
const AXES=[
 {id:'school',label:'교과',key:'school',status:'schoolStatus',edit:'schoolCourse',prefix:/^school/,checks:['답을 구하는 데 쓴 개념과 식의 이유를 설명하는지 살펴봅니다.','조건이나 표현을 바꾼 문제에서도 같은 개념을 찾아 적용하는지 확인합니다.'],method:'현재 교재에서 막힌 개념을 다시 연결하고, 도움 없이 대표 문제를 푼 뒤 조건을 바꾼 문제로 확인합니다.'},
 {id:'comp',label:'사고력',key:'thinking',status:'thinkingStatus',edit:'thinkingExperience',prefix:/^(thinking|compExact|preDone)/,checks:['문제의 조건을 정리하고 스스로 시도할 방법을 찾는지 살펴봅니다.','한 풀이의 근거를 설명하고 다른 접근과 비교할 수 있는지 확인합니다.'],method:'현재 사고력 교재에서 먼저 스스로 시도한 흔적을 남기고, 힌트를 받은 지점과 다른 풀이를 비교합니다.'},
 {id:'calc',label:'연산',key:'calc',status:'calcStatus',edit:'calc',prefix:/^calc/,checks:['도움 없이 계산을 마치고 사용한 계산 원리를 설명하는지 살펴봅니다.','다른 날에도 같은 유형을 해결하며 오류의 이유를 찾아 고치는지 확인합니다.'],method:'현재 연산 범위의 오류를 원리·기호·계산 과정으로 나누어 보고, 관련 교과 문제에 다시 적용합니다.'},
 {id:'deep',label:'심화',key:'deepBook',status:'deepStatus',edit:'deepCourse',prefix:/^deep/,checks:['낯선 문제에서 조건을 연결하고 풀이를 시작할 수 있는지 살펴봅니다.','설명이나 해설을 본 뒤 새로운 조건에서도 풀이를 다시 구성하는지 확인합니다.'],method:'현재 심화 교재의 한 문제를 충분히 다룬 뒤, 풀이의 근거와 다른 접근을 비교합니다. 교과 진도와 별도로 깊이를 조정합니다.'}
];
const GOALS=[{id:'keep',title:'현재 흐름을 유지하며 보완',summary:'현재 교재와 진도를 유지하고 막힌 부분을 보완합니다.'},{id:'depth',title:'현재 범위에서 심화 확장',summary:'같은 범위에서 조건 해석·응용·풀이 설명의 깊이를 더합니다.'},{id:'step',title:'한 단계 앞선 진도 예시 비교',summary:'가까운 교과 예시보다 한 단계 앞선 학습 레벨의 진도와 영역별 차이를 살펴봅니다.'}];
const OBSERVATIONS=[
 {id:'independent',title:'혼자 풀고 이유도 설명합니다',summary:'숫자나 조건이 달라져도 같은 개념을 적용하는지 살펴봅니다.',step:'다른 조건에서도 풀어보기',method:'잘 풀었던 문제와 같은 개념을 쓰되 조건이 다른 문제를 골라 봅니다. 답뿐 아니라 왜 그 식을 세웠는지 설명할 수 있으면 다음 범위를 연결합니다.'},
 {id:'conditions',title:'문제를 급히 읽어 조건을 놓칩니다',summary:'연산량부터 늘리기보다, 구하는 것과 조건을 짚는 연습을 합니다.',step:'식을 세우기 전에 조건 짚기',method:'식부터 보지 않도록 구하는 것에 동그라미, 주어진 조건과 단위에 밑줄을 긋게 해 주세요. 무엇을 구하는 문제인지 한 문장으로 말한 다음 식을 세웁니다. 답을 낸 뒤에는 빠뜨린 조건이 없는지 돌아봅니다.'},
 {id:'concept',title:'개념이나 공식의 뜻을 설명하기 어렵습니다',summary:'현재 범위의 대표 문제로 돌아가 개념과 식을 연결합니다.',step:'대표 문제로 개념 다시 연결하기',method:'같은 책을 처음부터 다시 풀기보다 막힌 개념의 대표 문제 한 개를 설명하게 해 주세요. 그림이나 구체적인 예로 뜻을 확인한 뒤 숫자와 조건을 바꿔 다시 풉니다. 설명 없이 공식만 따라 쓰는지 살펴봅니다.'},
 {id:'approach',title:'개념은 알지만 풀이를 시작하기 어렵습니다',summary:'조건을 표나 그림으로 옮기고 첫 풀이를 만드는 연습을 합니다.',step:'풀이의 첫 단계 찾아보기',method:'바로 해설을 보여주기보다 아는 조건과 구할 것을 표·그림으로 정리합니다. 어디서 시작할지 스스로 생각할 시간을 주고, 힌트는 첫 단계까지만 줍니다. 다음 문제에서는 그 도움을 줄여 봅니다.'},
 {id:'calculation',title:'풀이 방향은 맞는데 계산에서 틀립니다',summary:'부호·자리값·식 변형 중 어디서 오류가 나는지 먼저 봅니다.',step:'틀린 계산 줄부터 확인하기',method:'답만 고치지 말고 처음 틀린 줄을 찾아 표시합니다. 부호, 자리값, 약분, 식 변형 중 반복되는 부분을 짧게 연습한 뒤 원래 교과 문제에 다시 적용합니다. 조건을 놓친 오류는 연산 실수와 나누어 봅니다.'},
 {id:'help',title:'힌트·해설이 있으면 해결합니다',summary:'어느 단계에서 도움이 필요한지 확인하고 그 도움을 조금씩 줄입니다.',step:'필요한 도움을 줄이기',method:'해설을 본 날에는 풀이를 이해했는지 설명하고, 다른 날에는 해설을 덮고 다시 풀어 봅니다. 혼자 시작할 수 있는 부분과 막히는 지점을 나누어 필요한 부분만 보완합니다.'},
 {id:'unknown',title:'아직 직접 확인하지 못했습니다',summary:'현재 교재의 풀이 몇 개를 함께 살펴본 뒤 정하겠습니다.',step:'현재 풀이부터 살펴보기',method:'현재 교재에서 익숙한 문제와 조금 어려운 문제를 골라 푸는 모습을 봅니다. 문제 읽기, 첫 식 세우기, 계산, 설명 중 어디서 도움이 필요한지 확인해 주세요.'}
];
const PACES=[{id:'term',title:'학기 중에는 심화·복습과 병행',summary:'학교 수업과 기존 과제를 유지하며 추가할 범위를 조정합니다.'},{id:'vacation',title:'방학에 학습량을 늘려 연결',summary:'학기 중에는 기초를 다지고, 방학의 여유와 휴식을 보고 분량을 늘립니다.'}];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function stage(text,axis){
 const t=D.shortText(text);
 if(axis==='school')return t.match(/^(?:[1-6]-[12]|중[1-3]-[12]|공통수학[12])/u)?.[0]||null;
 if(axis==='comp')return t.includes('킨더팩토')?'킨더팩토':t.includes('키즈팩토')?'키즈팩토':t.includes('초등팩토')?'초등팩토':t.includes('필즈 베이직')?'필즈 베이직':t.includes('1031 입문')?'1031 입문':t.includes('1031 초급')?'1031 초급':t.includes('1031 중급')?'1031 중급':t.includes('3% 1과정')?'3% 1과정':t.includes('왕수학 응용 4')?'왕수학 응용 4':null;
 if(axis==='calc')return t.match(/기적의 계산법 \d+/)?.[0]||t.match(/기적의 중학(?:연산|도형) [123](?:AB|권)/)?.[0]||(t.includes('소마셈 K')?'소마셈 K':null);
 return null;
}
function actualStage(a,axis){
 if(axis==='school')return I.highBook?.(a.schoolBook)?null:I.middleBook(a.schoolBook)?P.MID[+a.schoolExact-14]||null:/^[1-6]-[12]$/.test(a.school||'')?a.school:null;
 if(axis==='comp')return a.thinking==='advanced'?stage(P.COMP[+a.compExact]?.[0],axis):a.thinking==='PRE 1031'?(a.preDone==='1'?'필즈 베이직':'초등팩토'):stage(a.thinking,axis);
 return a.calc==='advanced'?stage(P.CALC[+a.calcExact]?.[0],axis):stage(a.calc,axis);
}
function context(answers,fields){
 const a=I.effective(answers),grade=I.gradeChoice(a,fields),now=!fields.internationalCalendar&&grade&&(grade!=='pre'||I.hasAnswer(a,fields,'age'))?D.monthOf(I.age(a,fields),fields.mon):null,order=I.order(a,fields),summary=I.summary(a,fields);
 const axes=AXES.map(axis=>{
  const required=order.filter(k=>axis.prefix.test(k)),ready=!!grade&&required.length>0&&required.every(k=>I.hasAnswer(a,fields,k))&&!fields.pendingStatus?.[axis.status]&&a[axis.status]&& !I.special(axis.id==='comp'?a.thinkingExperience:axis.id==='school'?a.schoolBook:axis.id==='deep'?a.deepBook:a.calc);
  return {...axis,ready:!!ready,current:summary.find(s=>s.key===axis.key)?.text||'현재 학습 확인 전',stage:ready&&axis.id!=='deep'?actualStage(a,axis.id):null,done:a[axis.status]==='done'};
 });
 const signature=JSON.stringify([grade,now,axes.map(x=>[x.ready,x.current,x.stage,x.done])]);
 return {grade,now,axes,signature};
}
function comparison(answers,fields){
 const c=context(answers,fields);
 const levels=LEVELS.map(l=>{
  const axes=c.axes.map(x=>{
   const blocks=l[x.id]||[],same=x.stage?blocks.find(b=>stage(b[0],x.id)===x.stage):null;
   const anchor=same?(x.done?same[2]:(same[1]+same[2])/2):null;
   const current=Number.isFinite(c.now)?blocks.find(b=>b[1]<=c.now&&c.now<=b[2]):null;
   const atNow=current&&stage(current[0],x.id)?current:null;
   return {...x,anchor,gap:anchor==null||c.now==null?null:c.now-anchor,reference:atNow?D.shortText(atNow[0]):null,referenceStage:atNow?stage(atNow[0],x.id):null,referenceReason:x.id==='deep'?'기존 레벨표에 별도 심화 기준 없음':!blocks.length?'비교 자료 없음':c.now>blocks.at(-1)[2]?'이 시기의 비교 자료 없음':'이 시기에 대응하는 과정 없음'};
  });
  return {id:l.id,axes,schoolGap:axes[0].gap};
 });
 // Same current school course, midpoint/end assumption; no cross-subject score averaging.
 const eligible=levels.filter(l=>l.schoolGap!=null),best=eligible.reduce((b,l)=>!b||Math.abs(l.schoolGap)<Math.abs(b.schoolGap)?l:b,null);
 const next=best&&+best.id.slice(1)>0?'L'+(+best.id.slice(1)-1):null;
 return {...c,levels,best:best?.id||null,next};
}
// Each area compares from its own reported course, not the curriculum's L reference.
function referenceForAxis(c,axis){
 const candidates=(c.levels||[]).filter(level=>level.axes.find(item=>item.id===axis)?.gap!=null);
 return candidates.reduce((best,level)=>!best||Math.abs(level.axes.find(item=>item.id===axis).gap)<Math.abs(best.axes.find(item=>item.id===axis).gap)?level:best,null)?.id||null;
}
// v1 signatures are structured JSON; this also reads existing saved plans.
function signatureDiff(signature,c){
 let old=null;try{const parts=JSON.parse(signature);if(Array.isArray(parts)&&parts.length===3&&Array.isArray(parts[2])&&parts[2].length===AXES.length&&parts[2].every(row=>Array.isArray(row)&&row.length===4))old=parts;}catch{}
 const environment=!!old&&old[0]===c.grade&&old[1]===c.now;
 return {environment,axes:Object.fromEntries(AXES.map((axis,i)=>[axis.id,environment&&JSON.stringify(old[2][i])===JSON.stringify([c.axes[i].ready,c.axes[i].current,c.axes[i].stage,c.axes[i].done])]))};
}
function restore(value,answers,fields){
 const c=comparison(answers,fields),diff=signatureDiff(value?.signature,c),v=value?.version===1&&(value.signature===c.signature||diff.axes.school||Object.hasOwn(diff.axes,value.focus)&&diff.axes[value.focus])?value:{};
 const goal=GOALS.some(g=>g.id===v.goal)?v.goal:null,target=LEVELS.some(l=>l.id===v.target)?v.target:null,focus=goal&&c.axes.some(x=>x.id===v.focus&&x.ready)?v.focus:null;
 const observation=focus&&(value?.signature===c.signature||diff.axes[focus])&&OBSERVATIONS.some(o=>o.id===v.observation)?v.observation:null,pace=observation&&PACES.some(p=>p.id===v.pace)?v.pace:null;
 return {version:1,signature:c.signature,goal,target,focus,observation,pace};
}
function choose(value,answers,fields,kind,id){
 const c=comparison(answers,fields),s=restore(value,answers,fields);
 if(kind==='goal'&&GOALS.some(g=>g.id===id)){if(s.goal===id)return s;return {...s,goal:id,target:id==='step'?c.next:null,focus:null,observation:null,pace:null};}
 if(kind==='target'&&LEVELS.some(l=>l.id===id)){if(s.target===id)return s;return {...s,target:id,focus:null,observation:null,pace:null};}
 if(kind==='focus'&&s.goal&&c.axes.some(x=>x.id===id&&x.ready)){if(s.focus===id)return s;return {...s,focus:id,observation:null,pace:null};}
 if(kind==='observation'&&s.focus&&OBSERVATIONS.some(o=>o.id===id)){if(s.observation===id)return s;return {...s,observation:id,pace:null};}
 if(kind==='pace'&&s.observation&&PACES.some(p=>p.id===id))return {...s,pace:id};
 return s;
}
function gapText(n){if(n==null)return '대응하는 비교 자료가 없습니다';const v=Math.round(Math.abs(n)*2)/2;return Math.abs(n)<.01?'같은 시점의 예시입니다':`같은 과정을 예시에서는 약 ${v}개월 ${n>0?'전':'후'}에 다룹니다`;}
function between(c,selected,axis){
 const x=c.axes.find(x=>x.id===axis),l=LEVELS.find(l=>l.id===selected);if(!x?.stage||!l||!Number.isFinite(c.now))return [];
 const bs=l[axis]||[],start=bs.findIndex(b=>stage(b[0],axis)===x.stage),target=bs.findIndex(b=>b[1]<=c.now&&c.now<=b[2]&&stage(b[0],axis));
 if(start<0||target<0||target<=start)return [];
 return bs.slice(start,target+1).filter(b=>stage(b[0],axis)).map(b=>({text:D.shortText(b[0]),current:stage(b[0],axis)===x.stage,done:stage(b[0],axis)===x.stage&&x.done}));
}
function graph(c,target){
 if(!target)return '<p class="progress-empty">현재 학년과 교과 학습을 선택하면 레벨별 진도를 비교할 수 있습니다.</p>';
 const series=target.axes.filter(x=>x.gap!=null),span=Math.max(3,...series.map(x=>Math.ceil(Math.abs(x.gap)/3)*3));
 return `<figure class="progress-figure"><figcaption>같은 학습 과정을 다루는 시점 비교 <small>○ 현재 · ◆ 학습 레벨 ${esc(levelLabel(c,target.id,true))}의 예시 시점</small></figcaption>${series.length?`<div class="progress-scale"><span>${span}개월 전</span><span>현재</span><span>${span}개월 후</span></div><div class="progress-chart" role="img" aria-label="현재와 비교 예시에서 같은 과정을 다루는 시점의 차이. 정확한 값은 아래 표에 표시됩니다.">${series.map(x=>{const pos=50-x.gap/span*50;return `<div class="progress-chart-row"><div><b>${esc(x.label)}</b><span>${esc(gapText(x.gap))}</span></div><div class="progress-bar" aria-hidden="true"><i class="progress-link" style="left:${Math.min(pos,50)}%;width:${Math.abs(pos-50)}%"></i><i class="progress-now"></i><i class="progress-dot" style="left:${pos}%"></i></div></div>`;}).join('')}</div>`:'<p>비교할 수 있는 과정이 아직 확인되지 않았습니다.</p>'}</figure>`;
}
function bridge(value,answers,fields){
 const c=comparison(answers,fields),s=restore(value,answers,fields),axis=c.axes.find(x=>x.id===s.focus),goal=GOALS.find(g=>g.id===s.goal),observation=OBSERVATIONS.find(o=>o.id===s.observation),pace=PACES.find(p=>p.id===s.pace),target=c.levels.find(l=>l.id===s.target),row=target?.axes.find(x=>x.id===s.focus),chain=between(c,s.target,s.focus);
 return {c,s,axis,goal,observation,pace,target,row,chain,steps:!axis?[]:[{title:'현재 학습 확인',text:axis.current},{title:s.goal==='depth'?'현재 범위에서 깊이 더하기':s.goal==='keep'?'현재 흐름 유지':'비교 대상과의 차이 확인',text:s.goal==='step'?(row?.reference?`${levelLabel(c,s.target,true)} 예시의 같은 시기: ${row.reference}`:'비교 대상의 이 시기 범위는 자료에 없습니다. 현재 범위를 확인한 뒤 다음 과정을 상담합니다.'):goal.summary},{title:observation?.step||'학습 모습 선택',text:observation?.method||axis.method},...(pace?[{title:'학기·방학의 학습량 배분',text:pace.summary}]:[]),{title:'다시 확인하고 조정',text:'다른 날이나 조건을 바꾼 문제로 풀이를 다시 확인하고, 담당 선생님과 다음 범위를 상의합니다. 계획 선택은 진급·합격·숙달 판정이 아닙니다.'}]};
}
function course(value,answers,fields){
 const b=bridge(value,answers,fields),a=I.effective(answers);if(!b.axis)return null;
 const id=b.axis.id,book=id==='deep'?a.deepBook:a.schoolBook,key=id==='comp'?'thinking':id==='calc'?'calc':I.highBook?.(book)?'high':I.middleBook(book)?'middle':id==='deep'?'elemDeep':'elem';
 return {title:b.axis.label+' · '+b.axis.current,guideKey:key,axis:id,kind:'step',sub:'현재 학습과 선택한 보완·심화 계획을 함께 살펴봅니다.'};
}
function levelScope(c){
 return c.grade==='pre'?'유아':Number(c.grade)>=10?'고등':Number(c.grade)>=7?'중등':Number(c.grade)>=1?'초등':'학년 확인 전';
}
function benchmarkLabel(c,id){
 const young=c.grade==='pre'||['1','2'].includes(String(c.grade)),source=LEVELS.find(l=>l.id===id);
 return young&&source&&/프리미어|필즈|소마|황소/.test(source.summary)?source.summary:null;
}
function levelMeaning(c,id){
 const level=c.levels.find(l=>l.id===id);if(!level)return null;
 const school=level.axes.find(x=>x.id==='school'),key=school?.referenceStage||'',source=LEVELS.find(l=>l.id===id),block=source?.school?.find(b=>b[1]<=c.now&&c.now<=b[2]),afterHigh=!!block&&/진로:/.test(block[0]),lastCourse=afterHigh?source.school.filter(b=>b[2]<block[1]&&stage(b[0],'school')).at(-1):null;
 const foundation=block&&/수학 문장 이해|지문 이해|조건 이해/.test(block[0]);
 const name=foundation?'수학 문장·조건 이해':/^공통수학/.test(key)?'고등 공통수학 학습':/^중/.test(key)?'중등 개념 학습':/^[56]-/.test(key)?'초등 고학년 교과':/^[34]-/.test(key)?'초등 중학년 교과':/^[12]-/.test(key)?'초등 기초 교과':afterHigh?'고등 교과 이후 탐색':'이 시기 진도 자료 없음';
 const previous=source?.school?.filter(b=>b[2]<c.now&&stage(b[0],'school')).at(-1),next=source?.school?.find(b=>b[1]>c.now&&stage(b[0],'school'));
 const depth=global.PLANNER_STANDARD_DETAILS?.[id]?.school2?.filter(b=>Number.isFinite(c.now)&&b.start<=c.now&&c.now<=b.end).map(b=>D.shortText(b.title)).join(' · ');
 const between=!block&&previous&&next?stage(previous[0],'school')+' → '+stage(next[0],'school')+' 사이 일정':null;
 return {id,scope:levelScope(c),benchmarkLabel:benchmarkLabel(c,id),name:between?'교과 사이 일정 확인':name,between,at:Number.isFinite(c.now)?I.labelMonth(c.now):'현재 학년 선택 전',axes:level.axes.map(x=>({label:x.label,text:x.id==='deep'&&depth?depth:x.id==='school'&&afterHigh?(lastCourse?D.shortText(lastCourse[0])+' 이후의 공부 방향 탐색 · 세부 교재 미정':'공부 방향 탐색 · 세부 교재 미정'):x.reference||(source?.[x.id]?.find(b=>Number.isFinite(c.now)&&b[1]<=c.now&&c.now<=b[2])?D.shortText(source[x.id].find(b=>b[1]<=c.now&&c.now<=b[2])[0]):x.id==='school'&&between?between:x.referenceReason)}))};
}
function renderLevelMeaning(c,id){
 const m=levelMeaning(c,id);if(!m)return '';
 return `<article class="level-meaning"><h5>${esc(levelLabel(c,id))} <span>${esc(m.name)}</span></h5><p>${esc(m.at)} 기준의 진도 예시</p><dl>${m.axes.map(x=>`<dt>${esc(x.label)}</dt><dd>${esc(x.text)}</dd>`).join('')}</dl></article>`;
}
function levelLabel(c,id,short=false){
 const m=levelMeaning(c,id);if(!m)return id||'비교 자료 확인 전';
 const key=c.levels.find(l=>l.id===id)?.axes.find(x=>x.id==='school')?.referenceStage||'';
 const description=/^[1-6]-[12]$/.test(key)?'초등 '+key+' 교과':/^중[1-3]-[12]$/.test(key)?key+' 교과':/^공통수학/.test(key)?key:m.between||m.name;
 return (short?'':'학습 레벨 ')+id+' ('+(m.benchmarkLabel?m.benchmarkLabel+' · ':'')+description+')';
}
function standardComparison(c,selected=null){
 if(!Number.isFinite(c.now)||!(c.grade==='pre'||['1','2'].includes(String(c.grade))))return null;
 const rows=LEVELS.map(source=>({id:source.id,label:benchmarkLabel(c,source.id),current:source.id===c.best,selected:source.id===selected,axes:['school','comp','calc'].map(axis=>{
  const block=source[axis]?.find(b=>b[1]<=c.now&&c.now<=b[2]);
  return {axis,title:block?D.shortText(block[0]):levelMeaning(c,source.id)?.axes.find(x=>x.label===AXES.find(a=>a.id===axis)?.label)?.text||'이 시기 진도 자료 없음',period:block?I.labelMonth(block[1])+' ~ '+I.labelMonth(block[2]):null,months:block?block[2]-block[1]+1:null};
 })}));
 return {at:I.labelMonth(c.now),best:c.best,selected,rows};
}
function renderStandardComparison(c,selected=null){
 const m=standardComparison(c,selected);if(!m)return '';
 return `<details class="level-standard-comparison"><summary><span>학습 레벨별 참고 진도 보기</span><small>${esc(m.at)}${m.best?' · 가까운 교과 예시 '+esc(m.best):''}</small></summary><div class="level-standard-content"><p>유아·초1~2 때 참고하는 학원 기준명과 같은 시기의 공부를 나란히 보겠습니다. 교과·사고력·연산은 각각 현재 공부와 비교해 주세요.</p><div class="level-standard-scroll" tabindex="0" role="region" aria-label="학습 레벨별 교과·사고력·연산 참고 진도"><table><caption>${esc(m.at)} 기준 · 표준 레벨별 진도와 전체 과정 기간</caption><thead><tr><th scope="col">표준 레벨 · 학원 기준</th><th scope="col">교과</th><th scope="col">사고력</th><th scope="col">연산</th></tr></thead><tbody>${m.rows.map(row=>`<tr${row.current?' class="is-current"':''}${row.selected?' data-selected-reference="true"':''}><th scope="row"><b>${esc(row.id)}</b><span>${esc(row.label||'교과 진도로 비교하는 레벨')}</span>${row.current?'<small>현재 교과와 가까운 예시</small>':''}${row.selected&&!row.current?'<small>선택한 비교 예시</small>':''}</th>${row.axes.map(axis=>`<td><strong>${esc(axis.title)}</strong>${axis.period?`<small>${esc(axis.period)}</small><span>전체 과정 ${axis.months}개월</span>`:''}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="level-standard-note">각 칸은 표준 진도의 참고 예시입니다. 표시한 기간은 해당 과정 전체의 기간이며, 지금부터 남은 기간은 실제 진행량에 따라 달라집니다. 학원 반 이름만으로 교재 이수나 현재 실력을 정하지는 않습니다.</p></div></details>`;
}
function render(value,answers,fields,options={}){
 const b=bridge(value,answers,fields),{c,s}=b,target=c.levels.find(l=>l.id===s.target)||c.levels.find(l=>l.id===c.best);
 if(!c.grade)return `<section class="progress-panel"><header><div><small>현재 위치에서 다음 공부로</small><h3>레벨 비교와 진행 방법</h3></div><button type="button" data-progress-open="goal">비교 시작하기</button></header><p>현재 학년과 학습을 선택하면 L0~L13 진도 예시와 비교하며 공부 계획을 살펴볼 수 있습니다.</p>${b.goal?`<p class="progress-intro"><b>선택한 방향 · ${esc(b.goal.title)}</b></p><button type="button" data-flow-intake>현재 학습 선택하기</button>`:''}</section>`;
 return `<section class="progress-panel" aria-label="레벨 비교와 다음 학습"><header><div><small>현재 위치·비교·보완·재확인</small><h3>레벨 비교와 다음 학습</h3></div><button type="button" data-progress-open="goal">${s.goal?'계획 다시 보기':'다음 단계 설계하기'}</button></header><p class="progress-intro">${c.best?`교과 진도에 가까운 예시 <b>${esc(levelLabel(c,c.best))}</b>.`:'교과 진도는 아직 비교할 수 없습니다.'} ${s.target?`비교 대상 <b>${esc(levelLabel(c,s.target))}</b>.`:''} L번호는 기존 진도표를 구분하는 이름입니다. 능력·순위·입시 판정을 나타내지 않습니다.</p>${options.timeline||graph(c,target)}${options.timeline?`<details class="progress-gap-detail"><summary>현재 과정의 시점 차이 자세히 보기</summary>${graph(c,target)}</details>`:''}<p class="progress-assumption">진행 중은 예시의 중간 시점, 완료는 마지막 시점으로 비교합니다. 실측 숙달도나 따라잡아야 할 기한을 뜻하지 않습니다.</p>${target?`<div class="progress-table-wrap"><table class="progress-table"><caption>현재 학습과 ${esc(levelLabel(c,target.id))} 비교</caption><thead><tr><th>영역</th><th>현재 학습</th><th>예시의 같은 시기</th></tr></thead><tbody>${target.axes.map(x=>`<tr><th scope="row">${esc(x.label)}</th><td>${esc(x.current)}${x.ready?'':`<button type="button" class="progress-edit" data-progress-edit="${x.edit}">다시 선택</button>`}</td><td>${esc(x.reference||x.referenceReason)}${x.gap!=null?`<small>${esc(gapText(x.gap))}</small>`:''}</td></tr>`).join('')}</tbody></table></div>`:''}<details class="progress-all"><summary>L0~L13 뜻과 학년별 진도 보기</summary><p>L번호는 진도표를 구분하는 이름입니다. 유아·초1~2는 학원 기준명과 현재 월의 진도를 함께 보고, 초3부터는 해당 시기의 학습 과정으로 설명합니다. 학교 학년과 교재 학년은 다를 수 있습니다. 자료가 끝난 뒤의 진도는 추정하지 않습니다. 레벨을 골라도 현재 학습 답변은 바뀌지 않습니다.</p><div class="progress-level-grid">${c.levels.map(l=>`<button type="button" data-progress-target="${l.id}" aria-pressed="${s.target===l.id}"><b>${esc(levelLabel(c,l.id))}</b><span>${esc(levelMeaning(c,l.id).at)} 기준</span>${levelMeaning(c,l.id).axes.map(x=>`<span>${esc(x.label)}: ${esc(x.text)}</span>`).join('')}<span>${l.schoolGap==null?'같은 과정의 시점은 비교할 수 없습니다':gapText(l.schoolGap)}</span>${l.id===c.best?'<small>교과 진도에 가까운 예시</small>':''}</button>`).join('')}</div></details>${s.goal?`<div class="progress-trail"><h4>선택한 진행 방법</h4><ol><li><button type="button" data-progress-open="goal">${esc(b.goal.title)}</button></li>${s.target?`<li><button type="button" data-progress-open="levels">비교 대상 · ${esc(levelLabel(c,s.target))}</button></li>`:''}${b.axis?`<li><button type="button" data-progress-open="focus">먼저 다룰 영역 · ${esc(b.axis.label)}</button></li>`:''}${b.observation?`<li><button type="button" data-progress-open="observation">학습 모습 · ${esc(b.observation.title)}</button></li>`:''}${b.pace?`<li><button type="button" data-progress-open="pace">${esc(b.pace.title)}</button></li>`:''}</ol>${b.axis?`<details class="progress-review"${b.pace?' open':''}><summary>다음 학습까지의 구체적인 과정</summary>${b.chain.length?`<h4>비교 대상까지 포함된 과정</h4><p>기존 비교 예시에 포함된 범위입니다. 모두 일률적으로 이수하라는 지정은 아닙니다.</p><ol>${b.chain.map(x=>`<li>${esc(x.text)}${x.current?x.done?' · 현재 완료 범위':' · 현재 진행 중':''}</li>`).join('')}</ol>`:''}<ol class="progress-steps">${b.steps.map(x=>`<li><b>${esc(x.title)}</b><p>${esc(x.text)}</p></li>`).join('')}</ol><h4>다음에 나아가기 전 살펴볼 점</h4><ul>${b.axis.checks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p>확인 결과는 아직 기록되지 않았습니다. 여기서의 선택은 학부모의 관찰을 바탕으로 세운 계획입니다.</p><button type="button" data-progress-books>이 영역의 교재와 공부 방법 보기</button></details>`:''}</div>`:''}<details class="progress-faq"><summary>레벨을 한 단계 올리려면 선행 분량을 늘리면 되나요?</summary><p>교과·사고력·연산의 월 차이는 같은 과정을 다루는 시점을 비교한 값입니다. 먼저 보완할 개념과 혼자 푸는 모습을 확인하고, 심화·복습과 새 진도의 비중을 정합니다. 모든 영역을 한꺼번에 앞당기거나 월 차이만큼 단기간에 따라잡는 일정은 배정하지 않습니다.</p></details><details class="progress-faq"><summary>교과는 앞서지만 사고력이나 연산의 흐름이 다르면 어떻게 하나요?</summary><p>영역별 현재 학습과 필요한 보완을 나누어 봅니다. 사고력 교재의 진도가 연산이나 교과 개념의 이해를 대신하지는 않습니다. 담당 선생님과 풀이 모습을 확인하며 유지할 공부와 집중할 공부를 조정해 주세요.</p></details></section>`;
}
global.PlannerProgression=Object.freeze({AXES,GOALS,OBSERVATIONS,PACES,stage,context,comparison,referenceForAxis,signatureDiff,restore,choose,between,bridge,course,levelScope,benchmarkLabel,levelMeaning,levelLabel,renderLevelMeaning,standardComparison,renderStandardComparison,render});
})(window);
