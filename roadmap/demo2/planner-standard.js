/* Standard first: source curriculum shifted to the learner's actual course.
 * Coordinates exposed by this module are relative months, end-exclusive.
 * Source rows stay untouched; unknown learning is never filled from school grade.
 */
(function(global){
'use strict';
const I=global.PlannerIntake,G=global.PlannerProgression,P=global.Planner,D=global.DemoContent;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LIMIT=24;
const rounded=n=>Math.round(n*1000)/1000;
const label=id=>({school:'교과',thinking:'사고력',deep:'심화',calc:'연산'}[id]);
function monthAt(fields,index){const n=(Number(fields.year)||2026)*12+(Number(fields.mon)||1)-1+index,year=Math.floor(n/12),month=n%12+1;return{index,year,month,quarter:Math.floor((month-1)/3)+1,label:year+'년 '+month+'월'};}
function known(title,axis){return!!G.stage(title,axis)||axis==='comp'&&/프리미어 학습 집중/.test(title)||axis==='school'&&/수학 문장 이해|지문 이해|조건 이해|계통/.test(title)||axis==='calc'&&/소마셈/.test(title);}
function status(a,axis,c){
 const value=axis==='thinking'?a.thinkingExperience:axis==='school'?a.schoolBook:axis==='deep'?a.deepBook:a.calc;
 if(value==='none')return'none';if(value==='unknown')return'unknown';
 const ref=c.axes.find(x=>x.id===(axis==='thinking'?'comp':axis));
 return ref?.ready?'known':'pending';
}
function lane(id,a,c){const axis=c.axes.find(x=>x.id===(id==='thinking'?'comp':id));return{id,label:label(id),current:axis?.current||'현재 학습 확인 전',status:status(a,id,c),blocks:[],source:null,anchor:null,note:''};}
function clipped(title,start,end,id,kind,extra={},horizon=LIMIT){
 const s=Math.max(0,start),e=Math.min(horizon,end);
 if(!Number.isFinite(s)||!Number.isFinite(e)||e<=s)return null;
 return{id,title:D.shortText(title),start:rounded(s),end:rounded(e),kind,current:start<=0&&end>0,...extra};
}
function fromSource(rows,anchor,id,axis,options={}){
 return rows.flatMap((b,index)=>{
  const title=b.title??b[0],start=b.start??b[1],end=b.end??b[2];
  const transitionReview=axis==='school'&&/^여유.*초등 대수 심화.*선택/.test(title);
  if(!options.all&&!known(title,axis)&&!transitionReview)return[];
  const preparation=axis==='comp'&&/프리미어 학습 집중/.test(title);
  const block=clipped(transitionReview?'중등 진입 전 점검 · 다음 과정 선택':title,start-anchor,end+1-anchor,b.id||id+'-'+index,id,{source:'level-table',stage:b.stage||G.stage(title,axis),sourceStart:start,sourceEnd:end,...(transitionReview?{phase:'transition-review',instruction:false,method:'중등 시작 전, 배운 초등 교과의 취약 단원과 현재 심화·연산을 점검하는 여유 기간입니다. 원자료의 선택 구간을 표시한 것이며, 초등 계통 대수심화를 한 달에 끝내는 계획은 아닙니다. 대수심화를 추가할지는 풀이와 병행 부담을 보고 별도로 선택합니다.'}:{}),...(preparation?{phase:'premier-prep',method:'프리미어 대비에 집중합니다. 사고력 새 진도 대신 배운 문제의 조건·풀이 설명과 발표를 연습하고, 교과·심화·연산은 각 일정대로 병행합니다.'}:{})},options.horizon??LIMIT);
  return block?[block]:[];
 });
}
function sourceAnchor(rows,axis,stage,done){
 const same=stage&&rows.find(b=>G.stage(b[0],axis)===stage);
 return same?same[1]+(same[2]-same[1]+1)*(done?1:.5):null;
}
function profileBlocks(profile,id){
 const row=profile?.rows?.find(r=>r.key===(id==='thinking'?'thinking1':id));
 return(row?.remaining||row?.blocks||[]).flatMap((b,index)=>{
  const title=b.shortText||b.text;
  if(!title||!Number.isFinite(b.s)||!Number.isFinite(b.e))return[];
  const block=clipped(title,Math.max(b.s,b.remainingStart??b.s)-profile.now,b.e+1-profile.now,id+'-profile-'+index,id,{source:'current-profile',stage:G.stage(title,id==='thinking'?'comp':id==='deep'?'school':id)});
  return block?[block]:[];
 });
}
function fillIndependent(row,a,c,source,profile){
 if(row.status!=='known'){row.note=row.status==='none'?'아직 시작하지 않은 영역입니다. 시작 교재는 조정 단계에서 선택할 수 있습니다.':row.status==='unknown'?'현재 교재와 범위를 확인한 뒤 연결합니다.':'현재 학습 선택을 마치면 과정이 연결됩니다.';return;}
 const axis=row.id==='thinking'?'comp':row.id,actual=c.axes.find(x=>x.id===axis),rows=source?.[axis]||[];
 const anchor=sourceAnchor(rows,axis,actual?.stage,actual?.done);
 if(anchor!==null){row.blocks=fromSource(rows,anchor,row.id,axis);row.source='level-table';row.anchor=anchor;}
 else{row.blocks=profileBlocks(profile,row.id);row.source='current-profile';}
 if(!row.blocks.length)row.note='확인된 자료의 다음 과정이 없습니다. 새로운 교재는 조정 단계에서 선택합니다.';
}
// Choose a thinking reference from that area's actual course, independently of school.
function thinkingSource(c){return(global.PLANNER_LEVELS||[]).find(level=>level.id===G.referenceForAxis(c,'comp'))||null;}
function calculationPlan(answers={},fields={},days=5){
 const a=I.effective(answers),c=G.comparison(a,fields),actual=c.axes.find(x=>x.id==='calc');
 const daysPerWeek=[3,5].includes(+days)?+days:5,fullWeeks=50/daysPerWeek,weeksPerMonth=365.2425/12/7;
 const sequence=[...Array.from({length:12},(_,i)=>({title:'기적의 계산법 '+(i+1)+'권',stage:'기적의 계산법 '+(i+1),rank:i+1,days:50})),...Array.from({length:3},(_,i)=>[{title:'기적의 중학연산 '+(i+1)+'AB',stage:'기적의 중학연산 '+(i+1)+'AB',rank:13+i*2,months:2},{title:'기적의 중학도형 '+(i+1)+'권',stage:'기적의 중학도형 '+(i+1)+'권',rank:14+i*2,months:2}]).flat()];
 const index=sequence.findIndex(b=>b.stage===actual?.stage),supported=!!actual?.ready&&index>=0;
 const result={daysPerWeek,fullWeeks,blocks:[],supported,hasElementary:supported&&index<12,current:actual?.current||'현재 연산 확인 전',source:'https://school.gilbut.co.kr/book/view?bookcode=BN003280',note:''};
 if(!supported){result.note='현재 연산 교재의 하루 분량과 남은 범위를 확인한 뒤 기간을 연결합니다.';return result;}
 let cursor=0;for(let i=index+(actual.done?1:0);i<sequence.length;i++){
  const book=sequence[i],current=i===index&&!actual.done,fraction=current?0.5:1,studyDays=book.days?book.days*fraction:null,weeks=studyDays?studyDays/daysPerWeek:null,duration=book.months?book.months*fraction:weeks/weeksPerMonth,end=cursor+duration;
  const b=clipped(book.title,cursor,end,'calc-practice-'+book.rank,'calc',{source:book.months?'user-middle-alternation':'publisher-workload',stage:book.stage,rank:book.rank,current,studyDays,weeks,fullMonths:book.months||null,remainingAssumption:current,continues:end>LIMIT,progressEnd:book.rank+(current?0.5:0)+(current?0.5:1)*Math.min(1,(LIMIT-cursor)/duration)});if(b)result.blocks.push(b);cursor=end;
 }
 result.note=(result.hasElementary?'초등 기적의 계산법 2021판 기준 계획 예시 · 주 '+daysPerWeek+'일 · 하루 1장 · 한 권 50일분(약 '+Number(fullWeeks.toFixed(1))+'주). ':'')+'중등은 중학연산 1AB → 중학도형 1권 → 연산 2AB → 도형 2권 → 연산 3AB → 도형 3권을 각각 2개월씩 이어갑니다. 진행 중인 현재 과정은 절반이 남은 가정이며, 재복습·휴일은 별도입니다. 다음 과정은 정확도와 풀이를 확인한 뒤 조정합니다.';
 return result;
}
function renderCalculationChoices(plan){return`<section class="calculation-routine" aria-label="연산 연습 빈도"><strong>연산·도형의 독립 과정</strong>${plan.hasElementary?`<div role="group" aria-label="초등 연산 주당 연습 일수">${[5,3].map(days=>`<button type="button" data-calc-days="${days}" aria-pressed="${plan.daysPerWeek===days}">초등 연산 주 ${days}일 · 하루 1장</button>`).join('')}</div>`:''}<p>${esc(plan.note)}</p>${plan.hasElementary?`<a href="${plan.source}" target="_blank" rel="noopener">초등 교재 분량 근거</a>`:''}</section>`;}
function renderCalculationGraph(plan){
 const axes='<div class="transition-axis-buttons" role="group" aria-label="그래프의 영역">'+[['school','교과'],['comp','사고력'],['calc','연산']].map(([id,title])=>`<button type="button" data-transition-kind="axis" data-transition-value="${id}" aria-pressed="${id==='calc'}">${title}</button>`).join('')+'</div>';
 if(!plan.supported||!plan.blocks.length)return`<section class="calculation-routine"><h3>연산 학습 계획</h3>${axes}<p>${esc(plan.note)}</p></section>`;
 const blocks=plan.blocks,first=blocks[0].rank,last=blocks.at(-1).rank+1,min=first,max=Math.max(first+1,last),x=n=>70+n/24*900,y=n=>330-(n-min)/(max-min)*270;
 const points=[[0,first+(blocks[0].remainingAssumption?0.5:0)],...blocks.map(b=>[b.end,b.progressEnd])];
 return`<section class="calculation-routine calculation-graph"><h3>연산·도형 과정별 계획</h3>${axes}${renderCalculationChoices(plan)}<div class="calculation-chart" tabindex="0" role="region" aria-label="연산 분량에 따른 계획 그래프"><svg viewBox="0 0 1000 390" role="img" aria-label="선택한 연습 일수에 따른 연산 권별 참고 일정">${[0,6,12,18,24].map(n=>`<path d="M${x(n)} 50V330" stroke="#dbe3ee"/><text x="${x(n)}" y="360" text-anchor="middle">${n}개월</text>`).join('')}${Array.from({length:max-min+1},(_,i)=>min+i).map(n=>`<path d="M70 ${y(n)}H970" stroke="#dbe3ee"/><text x="58" y="${y(n)+5}" text-anchor="end">${n<=12?n+'권':n===19?'다음 확인':'중'+Math.ceil((n-12)/2)+' '+(n%2?'연산':'도형')}</text>`).join('')}<polyline points="${points.map(([a,b])=>x(a)+','+y(b)).join(' ')}" fill="none" stroke="#486b94" stroke-width="4"/></svg></div><p>교재 분량에 따른 일정 비교입니다. 권을 마쳤다고 숙달이나 상위 레벨 도달을 뜻하지 않습니다.</p></section>`;
}
function withoutDepthSlots(blocks,gaps,anchor,horizon=LIMIT){
 const removedBefore=point=>gaps.filter(g=>g.coveredByDepth).reduce((n,g)=>n+Math.max(0,Math.min(point,g.end+1-anchor)-Math.max(0,g.start-anchor)),0);
 return blocks.map(b=>({...b,start:rounded(Math.max(0,b.start-removedBefore(b.start))),end:rounded(Math.min(horizon,b.end-removedBefore(b.end))),cadence:'parallel'})).filter(b=>b.end>b.start);
}
const SUPPLEMENT_CHOICES=[['covered','현재 수업·부교재에서 이미 배워요'],['needed','현재 수업 외에 보완이 필요해요'],['review','아직 확인이 필요해요']];
function chooseSupplement(answers,fields,choice){
 return{version:1,signature:G.context(answers,fields).signature,choice:SUPPLEMENT_CHOICES.some(([id])=>id===choice)?choice:null};
}
function renderSupplementChoices(m){
 if(!m.supplementEligible)return'';
 const message=m.supplementChoice==='covered'?'현재 수업·부교재에서 배우는 문장제·도형을 이어갑니다. 같은 내용을 별도 보충으로 더하지 않습니다.':m.supplementEnabled?'현재 수준에 맞는 문제해결의 길잡이·소마 도형을 꾸준히 병행합니다. 소마 수업과 겹치는 부분은 제외하고 부족한 내용부터 살펴봅니다.':m.supplementChoice==='review'?'현재 수업에서 배우는 범위와 혼자 해결하는 모습을 먼저 확인합니다. 확인 전에는 별도 보충을 추가하지 않습니다.':'현재 수업에서 이미 배우는 내용인지 먼저 확인합니다. 현재 수업·부교재와 겹치는 내용은 중복으로 배정하지 않습니다.';
 return`<section class="supplement-choice" aria-label="초1·2 문장제·도형 학습 확인"><strong>문장제·도형은 지금 어떻게 배우고 있나요?</strong><div role="group" aria-label="현재 수업과 보충 필요">${SUPPLEMENT_CHOICES.map(([id,title])=>`<button type="button" data-supplement="${id}" aria-pressed="${m.supplementChoice===id}">${title}</button>`).join('')}</div><p aria-live="polite">${message}</p></section>`;
}
function model(answers={},fields={},options={}){
 const a=I.effective(answers),c=G.comparison(a,fields),source=(global.PLANNER_LEVELS||[]).find(l=>l.id===c.best),detail=global.PLANNER_STANDARD_DETAILS?.[c.best],levelNumber=source?Number(source.id.slice(1)):null;
 const defaultPattern=a.thinkingExperience==='yes'?'thinking':levelNumber!==null&&levelNumber>=10?'deep':'thinking';
 const pattern=['thinking','deep'].includes(options.pattern)?options.pattern:defaultPattern;
 const band=levelNumber===null?(fields.band||'B'):levelNumber<=3?'A':levelNumber<=9?'B':'C';
 const school=lane('school',a,c),thinking=lane('thinking',a,c),deep=lane('deep',a,c),calc=lane('calc',a,c);
 // Reported depth is already an independent course; a suggested pattern cannot replace it.
 const independentDepth=deep.status==='known';
 const schoolParallel=pattern==='thinking'||independentDepth;
 let profile=null;try{profile=I.profile(a,{...fields,band:fields.band||'B'});}catch{}
 fillIndependent(school,a,c,source,profile);
 const calcPlan=calculationPlan(a,fields,options.calcDaysPerWeek);calc.blocks=calcPlan.blocks;calc.source=calcPlan.supported?'publisher-workload':null;calc.anchor=calcPlan.blocks[0]?.stage;calc.note=calcPlan.note;if(calcPlan.supported&&calcPlan.hasElementary)calc.current='기적의 계산법 · '+calc.current;
 if(schoolParallel&&detail?.elementaryMode?.id==='application-then-depth'&&school.anchor!==null)school.blocks=withoutDepthSlots(fromSource(source.school,school.anchor,'school','school',{horizon:Infinity}),detail.schoolGaps||[],school.anchor);
 fillIndependent(thinking,a,c,thinkingSource(c),profile);
 if(independentDepth){
  deep.blocks=profileBlocks(profile,'deep');deep.source='current-profile';deep.anchor=deep.blocks[0]?.stage||null;
  deep.note=deep.blocks.length?'현재 심화 교재·범위에서 별도로 이어가는 과정입니다. 교과와 사고력의 진도는 유지합니다.':'현재 심화 과정 이후 교재·범위는 풀이를 확인한 뒤 연결합니다.';
 }else if(pattern==='deep'&&deep.status!=='unknown'&&school.blocks.length&&source&&school.anchor!==null){
  // This is a proposed standard only when no independent depth course is reported.
  const elementary=(detail?.school2||[]).filter(b=>/^[1-6]-[12]$/.test(b.stage||'')||!/중|공통|고등/.test(b.title)&&/최상위/.test(b.title));
  deep.blocks=fromSource(elementary,school.anchor,'deep','school',{all:true});deep.source='standard-depth';deep.anchor=school.anchor;
  if(band==='C'){
   for(const block of school.blocks){if(!/^중[1-3]-[12]$/.test(block.stage||''))continue;
    deep.blocks.push({...block,id:'deep-current-policy-'+block.id,title:block.stage+' '+I.standardBook('C','mid','deep'),kind:'deep',source:'current-engine-C'});
   }
  }
  deep.note=deep.blocks.length?'아직 별도로 공부 중인 심화가 없을 때 비교하는 표준 심화 과정입니다.':'이 범위의 심화 교재는 현재 학습과 풀이를 확인한 뒤 연결합니다.';
 }else deep.note=deep.status==='unknown'?'현재 심화 교재와 범위를 확인한 뒤 연결합니다.':deep.status==='none'?'아직 시작하지 않은 영역입니다. 시작 교재는 조정 단계에서 선택할 수 있습니다.':'현재 심화 학습을 선택하면 과정이 연결됩니다.';
 if(band==='C')school.blocks=school.blocks.map(block=>/^중/.test(block.stage||'')&&block.source==='level-table'?{...block,title:block.stage+' '+I.standardBook('C','mid','school'),source:'current-engine-C'}:block);
 let scienceAnchor=null;
 if(source&&school.anchor!==null){
  let full=fromSource(source.school,school.anchor,'science-reference','school',{horizon:Infinity});
  if(schoolParallel&&detail?.elementaryMode?.id==='application-then-depth')full=withoutDepthSlots(full,detail.schoolGaps||[],school.anchor,Infinity);
  const middle=full.find(b=>b.stage==='중2-1');
  if(middle)scienceAnchor=middle.end;
  else{const raw=source.school.find(b=>G.stage(b[0],'school')==='중2-1');if(raw&&raw[2]+1<=school.anchor)scienceAnchor=raw[2]+1-school.anchor;}
 }
 const lastSchoolEnd=Math.max(0,...school.blocks.map(b=>b.end));
 if(school.blocks.length&&lastSchoolEnd<LIMIT)school.note='표준 자료에 있는 교과 일정은 '+monthAt(fields,Math.max(0,Math.ceil(lastSchoolEnd)-1)).label+'까지입니다. 이후 교재와 기간은 맞춤 조정에서 선택합니다. 공통수학이나 다음 과정을 이수했다고 보거나 자동으로 배정하지 않습니다.';
 const actualSchool=c.axes.find(x=>x.id==='school');
 // Keep the reported current book visible, even when its name differs from the standard example.
 if(actualSchool?.ready&&!actualSchool.done&&a.schoolBook&&!I.special(a.schoolBook))school.blocks=school.blocks.map(block=>block.current&&block.stage===actualSchool.stage?{...block,title:actualSchool.stage+' '+a.schoolBook,reported:true}:block);
 const lanes=[school,thinking,deep,calc];for(const row of lanes)row.blocks.sort((x,y)=>x.start-y.start||x.end-y.end);
 const ready=!!I.gradeChoice(a,fields)&&school.blocks.length>0,months=ready?Array.from({length:LIMIT},(_,i)=>({...monthAt(fields,i),grade:Number.isFinite(c.now)?I.labelMonth(c.now+i).replace(/\s+\d+월$/,''):''})):[];
 // L is a curriculum reference, not evidence of Soma attendance or topic coverage.
 // Ignore the former boolean/threshold policy; a choice must match this child's current learning.
 const supplementEligible=!fields.internationalCalendar&&['1','2'].includes(String(I.gradeChoice(a,fields)));
 const decision=options.supplement,supplementChoice=supplementEligible&&decision?.version===1&&decision.signature===c.signature&&SUPPLEMENT_CHOICES.some(([id])=>id===decision.choice)?decision.choice:null;
 const supplementEnabled=supplementChoice==='needed';
 const supplements=[];
 if(supplementEnabled){
  const beyond=months.findIndex(d=>!/^초[12]$/.test(d.grade)),end=beyond<0?LIMIT:beyond;
  for(const item of [{id:'supportWords',label:'문장제 보충',title:'문제해결의 길잡이',method:'문제를 읽고 조건·그림·식을 연결하며 부족한 유형을 보완합니다.'},{id:'supportGeometry',label:'도형 보충',title:'소마 도형',method:'도형을 관찰하고 비교하며 설명하는 연습을 꾸준히 병행합니다.'}]){
   const row={...item,current:'수업과 겹치지 않는 내용 · 지속 병행',status:'proposed',note:'초1·2에서 현재 수업 외 보완이 필요하다는 선택입니다. 수업·부교재와 겹치는 부분은 제외하고, 단계와 권별 이수 기간은 따로 확인합니다.',blocks:end>0?[{id:item.id+'-steady',title:item.title+' · 꾸준히 병행',kind:item.id,start:0,end,current:false,source:'user-supplement-policy',sustained:true}]:[]};
   supplements.push(row);lanes.push(row);
  }
 }
 const sequential=!schoolParallel&&detail?.elementaryMode?.id==='application-then-depth';
 const stages=(sequential?[...school.blocks,...deep.blocks.filter(b=>/^[1-6]-[12]$/.test(b.stage||''))]:school.blocks).sort((x,y)=>x.start-y.start||x.end-y.end).slice(0,3);
 const assumptions=[
  '표준표의 현재 교과 과정을 출발점으로 옮긴 24개월 계획입니다. 진행 중은 해당 과정의 중간, 완료는 해당 과정의 끝에서 시작합니다.',
  '각 과정의 끝을 포함한 원자료 월을 화면에서는 시작 포함·끝 미포함 기간으로 바꿉니다. 예를 들어 3개월 과정의 중간에서 시작하면 1.5개월이 남습니다.',
  '교과·사고력·심화·연산은 각각 선택한 현재 교재에서 시작합니다. 한 영역의 진도를 바꾸어도 다른 영역의 교재·기간을 자동으로 바꾸지 않습니다.',
  '자료가 없는 구간은 새 교재나 복습으로 채우지 않습니다. 모르는 영역은 현재 교재 확인 후 조정합니다.',
  '월별 배치는 학습 계획 예시이며 완독·숙달·진급을 확정하는 일정이 아닙니다. 풀이를 확인하며 실제 기간을 조정합니다.'
 ];
 if(sequential)assumptions.push('이 표준의 초등 과정은 같은 학기의 응용 3개월 뒤 심화 2개월을 이어갑니다. 교과선의 빈 두 달은 해당 심화 과정이며 임의의 휴식이나 진도 누락이 아닙니다.');
 else if(detail?.elementaryMode?.id==='application-then-depth')assumptions.push(independentDepth?'이미 별도로 진행 중인 심화가 있어 교과 뒤에 표준 심화 2개월을 추가하지 않습니다. 현재 심화의 범위·기간과 사고력·연산은 각각 별도로 이어갑니다.':'교과·사고력 중심 구성에서는 교과 뒤의 별도 심화 2개월을 배정하지 않고 다음 교과를 잇습니다. 다른 영역의 현재 출발점은 그대로 유지합니다.');
 if(band==='C')assumptions.push('중등은 더 최근의 기존 엔진 기준인 개념원리·RPM 과정을 사용합니다. 이전 자료의 중등 A급을 그대로 배정하지 않습니다.');
 assumptions.push(calcPlan.note);
 if(supplementEligible)assumptions.push('초1·2 문장제·도형 보충은 교과 진도나 L 번호로 자동 배정하지 않습니다. 현재 수업·부교재에서 이미 배우는 내용은 이어가며, 수업 외 보완이 필요하다고 선택한 경우에만 별도 과정을 연결합니다.');
 if(supplementEnabled)assumptions.push('문제해결의 길잡이와 소마 도형 중 수업과 겹치지 않는 내용을 꾸준히 병행합니다. 표시 범위는 병행할 시기이며 한 권의 이수 기간이 아닙니다. 현재 단계와 풀이를 보고 조정합니다.');
 const composition=['교과',...(thinking.status==='known'||pattern==='thinking'?['사고력']:[]),...(independentDepth||pattern==='deep'?['심화']:[]),'연산'].join(' · ');
 return{ready,pattern,composition,independentDepth,scienceAnchor,level:c.best||null,levelLabel:c.best?G.levelLabel(c,c.best):'현재 학습에서 시작',band,lanes,months,stages,now:c.now,horizon:LIMIT,sequential,calcPlan,supplementEligible,supplementChoice,supplementEnabled,supplements,assumptions,partial:lanes.some(l=>!l.blocks.length),reason:ready?'':school.note||'현재 교과와 진도를 선택하면 표준 계획을 먼저 보여드립니다.'};
}
function period(m,b){const start=monthAt({year:m.months[0]?.year,mon:m.months[0]?.month},Math.floor(b.start)),end=monthAt({year:m.months[0]?.year,mon:m.months[0]?.month},Math.max(0,Math.ceil(b.end)-1));return start.label+(start.label===end.label?'':' – '+(start.year===end.year?end.month+'월':end.label));}
function renderSummary(m){return`<div class="standard-summary"><div><small>현재 공부에서 이어지는 표준 계획</small><strong>${esc(m.composition)}</strong></div><span>${esc(m.levelLabel)}</span></div>`;}
function supplementFaq(m){return (m.supplementEligible?[m.supplementEnabled?{question:'보충학습은 소마 수업과 어떻게 나누면 좋을까요?',answer:'소마 등 현재 수업에서 이미 다루는 내용은 반복해서 배정하지 않고, 부족한 문장제·도형부터 골라 꾸준히 보완합니다. 문제해결의 길잡이는 조건을 그림·식으로 연결하는지, 소마 도형은 관찰하고 비교하며 설명하는지 살펴봅니다. 가로 막대는 병행할 시기이며 한 권의 이수 기간이 아닙니다.'}:m.supplementChoice==='covered'?{question:'수업·부교재에서 이미 배우는데 보충 교재를 더 해야 하나요?',answer:'현재 수업·부교재에서 문장제·도형을 이미 배우므로 같은 내용을 별도 보충으로 더하지 않습니다. 수업 내용을 혼자 해결하고 풀이를 설명하는지 살펴보세요. 특정 내용이 계속 어렵다면 그 부분만 담당 선생님과 확인한 뒤 보완합니다.'}:{question:'문장제·도형 보충이 필요한지는 어떻게 확인하나요?',answer:'현재 수업이 있다면 다루는 범위와 혼자 해결하는 모습을 먼저 확인합니다. 현재 수업·부교재에서 이미 배우는 내용은 중복 배정하지 않습니다. 초1·2에서 수업 외 보완이 필요한 경우 문제해결의 길잡이·소마 도형 중 부족한 내용을 꾸준히 이어갑니다.'}]:[]);}
function faq(m){return[
 ...supplementFaq(m),
 {question:'응용 다음에 같은 학기 심화를 공부하는 이유는 무엇인가요?',answer:m.sequential?'이 표준은 초등 한 학기를 응용 3개월과 심화 2개월로 구성합니다. 새 학기로 넘어가기 전에 같은 개념을 낯선 조건에 적용하고 풀이를 설명하는 시간을 둡니다. 이미 진행 중인 응용 과정은 남은 부분부터 이어갑니다.':'현재 공부하는 교과·사고력·심화·연산은 각자의 출발점에서 나란히 이어집니다. 별도로 공부 중인 심화가 있다면 교과 뒤에 같은 학기의 표준 심화를 추가로 배정하지 않습니다.'},
 {question:'교과·사고력·심화·연산 진도가 서로 달라도 괜찮나요?',answer:'네 영역은 서로 다른 출발점으로 기록했습니다. 각 영역은 선택한 현재 교재에서 이어지고, 교과 학년만으로 다른 영역의 더 높은 권을 배정하지 않습니다. 아직 시작하지 않은 영역과 잘 모르는 영역도 구분해 두었습니다.'},
 {question:'지금 하는 심화 교재가 표준 계획과 다르면 어떻게 하나요?',answer:'현재 심화가 확인되면 그 교재와 학기에서 별도로 이어갑니다. 예를 들어 교과 5-2·심화 4-1을 공부하면 두 범위를 각각 유지하며, 사고력과 연산도 따로 이어집니다. 아직 시작하지 않은 심화의 표준 제안과 실제 진행 중인 심화는 구분합니다.'}
 ];}
function renderQuestionList(items){return items.length?`<div class="standard-faq pathway-parent-questions">${items.map(x=>`<details><summary>${esc(x.question)}</summary><p>${esc(x.answer)}</p></details>`).join('')}</div>`:'';}
function renderFAQ(m){return renderQuestionList(faq(m));}
function renderSupplementQuestions(m){return renderQuestionList(supplementFaq(m));}
function render(m,options={}){
 const tone=b=>Math.max(0,m.lanes.find(row=>row.blocks.some(x=>x.id===b.id))?.blocks.findIndex(x=>x.id===b.id)??0)%2;
 const routine=m.calcPlan?.supported?renderCalculationChoices(m.calcPlan):'';
 const supplements=renderSupplementChoices(m);
 const summary=options.summary===false?'':renderSummary(m);
 const tail=row=>{const end=Math.max(0,...row.blocks.map(b=>b.end));return row.id==='school'&&row.blocks.length&&end<LIMIT?`<span class="standard-lane-tail" style="position:absolute;left:${end/LIMIT*100}%;width:${(LIMIT-end)/LIMIT*100}%" title="${esc(row.note)}" aria-label="이후 교재·기간 선택 전">${LIMIT-end<1?'…':LIMIT-end<2?'다음 과정 선택 전':'이후 교재·기간 선택 전'}</span>`:'';};
 if(!m.ready)return`<section class="standard-roadmap standard-pending">${summary}<p>${esc(m.reason)}</p></section>`;
 const groups=[];m.months.forEach((d,i)=>{const name=d.year+'년 '+d.quarter+'분기';if(groups.at(-1)?.name===name)groups.at(-1).count++;else groups.push({name,start:i,count:1});});
 const endNote=m.lanes.find(row=>row.id==='school')?.note;
 const pendingNote=endNote?`<p class="standard-source-end">${esc(endNote)}</p>`:'';
 const assumptions=`<details class="standard-assumptions"><summary>표준 계획의 기간과 연결 기준</summary><ul>${m.assumptions.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></details>`;
 const calendar=`<div class="standard-calendar" tabindex="0" aria-label="24개월 영역별 학습 일정"><div class="standard-calendar-inner"><div class="standard-quarter-axis" style="display:grid;grid-template-columns:repeat(24,minmax(0,1fr))">${groups.map(g=>`<span style="grid-column:${g.start+1}/span ${g.count}">${esc(g.name)}</span>`).join('')}</div><div class="standard-month-axis" style="display:grid;grid-template-columns:repeat(24,minmax(0,1fr))">${m.months.map(d=>`<span><small>${esc(d.grade)}</small>${d.month}월</span>`).join('')}</div><div class="standard-lanes">${m.lanes.map(row=>`<section class="standard-lane" data-lane="${row.id}" data-study-area="${row.id}"><header><strong>${esc(row.label)}</strong><span>${esc(row.current)}</span></header><div class="standard-lane-track">${row.blocks.map(b=>`<button type="button" class="standard-block ${b.current?'is-current':''}" data-course-tone="${tone(b)}" data-standard-block="${esc(b.id)}" style="left:${b.start/LIMIT*100}%;width:${(b.end-b.start)/LIMIT*100}%" aria-label="${esc(row.label+' · '+b.title+' · '+period(m,b))}"><strong>${esc(row.id==='calc'?b.title.replace('기적의 계산법 ' ,''):b.title)}</strong><small>${b.weeks?'약 '+Number(b.weeks.toFixed(1))+'주 · ':b.fullMonths?'과정 '+b.fullMonths+'개월 · ':''}${esc(period(m,b))}${b.continues?' · 이후 계속':''}</small></button>`).join('')||`<p class="standard-lane-empty">${esc(row.note)}</p>`}${tail(row)}</div></section>`).join('')}</div></div></div>`;
 if(options.view==='table')return`<section class="standard-roadmap">${summary}<h3 class="horizontal-plan-title">월별 세부 로드맵</h3>${calendar.replace('class="standard-calendar"','class="standard-calendar horizontal-course-grid"')}${pendingNote}${routine}${supplements}<details class="horizontal-plan-details"><summary>교재별 기간 상세</summary><div class="standard-table-wrap"><table class="standard-table"><caption>표준 교재와 월별 과정</caption><thead><tr><th>영역</th><th>기간</th><th>공부할 교재·과정</th></tr></thead><tbody>${m.lanes.map(row=>row.blocks.length?row.blocks.map(b=>`<tr data-study-area="${row.id}" data-course-tone="${tone(b)}"><th scope="row">${esc(row.label)}</th><td>${esc(period(m,b))}</td><td>${esc(b.title)}${b.reported?' · 현재 교재':''}</td></tr>`).join(''):`<tr data-study-area="${row.id}"><th scope="row">${esc(row.label)}</th><td>연결 전</td><td>${esc(row.current)}<small>${esc(row.note)}</small></td></tr>`).join('')}</tbody></table></div></details>${assumptions}</section>`;
 return`<section class="standard-roadmap">${summary}<div class="standard-landscape" style="background-image:url('assets/learning-landscape-20261023.png')"><div class="standard-stage-cards">${m.stages.map((b,i)=>`<button type="button" class="standard-stage" data-study-area="${b.kind}" data-course-tone="${tone(b)}" data-standard-block="${esc(b.id)}"><small>${i===0?'현재부터':i===1?'다음 과정':'그다음 과정'} · ${esc(label(b.kind))}</small><strong>${esc(b.title)}</strong><span>${esc(period(m,b))}</span></button>`).join('')}</div></div>${calendar}${pendingNote}${routine}${supplements}${assumptions}</section>`;
}
global.PlannerStandard=Object.freeze({model,render,renderSummary,faq,renderFAQ,renderQuestions:renderFAQ,calculationPlan,renderCalculationGraph,chooseSupplement,renderSupplementChoices,renderSupplementQuestions});
})(window);
