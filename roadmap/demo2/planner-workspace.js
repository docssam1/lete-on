/* Parent workspace: live selections over an illustration; all dates come from the existing timeline. */
(function(global){
'use strict';
const T=global.PlannerTransition,G=global.PlannerProgression,I=global.PlannerIntake;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function model(value,progress,answers,fields,path=[]){
 const d=T.detail(value,progress,answers,fields),m=T.timeline({...T.restore(value,progress,answers,fields),axis:'school'},progress,answers,fields),c=T.catchDetail(m),grade=I.gradeChoice(answers,fields),root=path[0],route=root==='boarding'?'보딩 준비':root==='international'?'국제학교':'학습 설계',catchCourse=m.catch?T.schoolNumber(G.stage(m.catch.course,'school')):null,within=!!(m.catch&&d.range&&catchCourse>=d.n&&catchCourse<=d.range.end);
 const state=!d.book||!d.range?'books':d.s.tempo!=='gradual'?'keep':!d.checkpoint||d.s.checkpoint==='pending'?'check':!d.s.allocation?'allocation':d.s.allocation==='review'?'review':!m.profile?'load':m.catch?(within?'catch':'outside'):'no-catch';
 const dateAt=x=>Number.isFinite(x)&&Number.isFinite(m.now)?T.calendarAt(m.now,x-m.now,fields):null;
 const date=x=>dateAt(x)?.label??null;
 const rows=d.rows.map(r=>{const s=m.segments.find(x=>x.gain>0&&T.schoolNumber(G.stage(x.course,'school'))===r.id),currentDone=r.id===d.n&&d.b.c.axes.find(x=>x.id==='school')?.done;return {...r,start:s?date(s.scenarioEnd-s.duration):null,end:s?date(s.scenarioEnd):null,startDate:s?dateAt(s.scenarioEnd-s.duration):null,endDate:s?dateAt(s.scenarioEnd):null,duration:s?.duration??null,baseline:T.classBaseline(T.schoolLabel(r.id)),timing:s&&s.scenarioEnd<=m.now+24?'estimate':currentDone?'done':'unavailable',afterCatch:within&&r.id>=catchCourse,maintenanceExtra:s?.upperDuration>0&&T.classBaseline(T.schoolLabel(r.id))?Math.max(0,T.classBaseline(T.schoolLabel(r.id)).sessions*(s.baseDuration/s.upperDuration-1)/m.transfer):null,extraActive:!!(m.adjusting&&s&&m.window&&s.scenarioEnd-s.duration<m.chase.end&&s.scenarioEnd>m.window.start)};});
 const depthSlots=[...m.segments.filter(s=>s.gain===0&&s.depthTitle).map(s=>({...s,parallel:false})),...(m.parallelDepth||[]).filter(s=>!s.omitted&&s.depthTitle).map(s=>({...s,parallel:true}))].filter(s=>rows.some(r=>r.id===T.schoolNumber(s.scopeStage))).map(s=>({...s,id:T.schoolNumber(s.scopeStage),start:date(s.scenarioStart??s.scenarioEnd-s.duration),end:date(s.scenarioEnd)}));
 const same=c?.after.map(r=>{const n=T.schoolNumber(G.stage(r.course,'school')),chosen=rows.find(x=>x.id===n);return {...r,chosen:!!chosen,book:chosen?.school||r.course};})||[];
 let meeting='회차 선택 전',after='교재와 범위부터 선택';
 if(state==='books')meeting=d.book?'범위 선택 전':'교재 선택 전';else if(state==='keep')meeting='현재 속도 유지';else if(state==='check')meeting='풀이 확인 후 비교';else if(state==='allocation')meeting='추가 분량 용도 선택';else if(state==='review')meeting='진도 유지 · 깊이 더하기';else if(state==='no-catch')meeting='24개월 안에는 만나지 않음';else if(c)meeting='현재부터 약 '+c.months.toFixed(1)+'개월';
 if(c)after=state==='outside'?'이후 일정은 참고용':'같은 과정 속도로';else if(state==='no-catch')after='목표 회차 유지 · 이후 미정';else if(d.book)after='확인하며 다음 범위로';
 const newDepthBook=!!(d.deep?.book&&d.deepScope?.id==='actual'&&d.deep.book!==d.a.deepBook);
 const study=global.PlannerStandard?.model({...d.a,...(d.deep?.book&&d.deepScope?.id==='actual'?{deepBook:d.deep.book,...(newDepthBook?{deepStatus:'progress'}:{})}:{})},fields,{pattern:'thinking',calcDaysPerWeek:fields.calcDaysPerWeek,supplement:fields.supplementDecision});
 const supplements=study?.supplements||[];
 const independentLanes=(study?.lanes||[]).filter(row=>row.status==='known'&&row.blocks.length&&(row.id==='thinking'||row.id==='calc'||row.id==='deep'&&(!d.deep||d.deep.id==='none'||d.deepScope?.id==='actual')));
 if(newDepthBook){const row=independentLanes.find(lane=>lane.id==='deep');if(row?.blocks.length){
  const first=row.blocks[0],full=I.middleBook(d.deep.book)?global.Planner.BAND[fields.band||'B'].midLen:d.deep.book==='개념응용 · 최상위'?3:2,shift=full-first.end;
  row.blocks=row.blocks.map((block,index)=>({...block,start:index?block.start+shift:0,end:Math.min(24,index?block.end+shift:full),current:false,proposed:true})).filter(block=>block.start<block.end);
  row.current='선택한 심화 · '+d.deep.book+' '+first.stage+'부터';
 }}
 // An actual depth scope advances on its own calendar, never once per curriculum semester.
 if(d.deepScope?.id==='actual')depthSlots.length=0;

 return {supplements,independentLanes,newDepthBook,grade,route,root,state,within,catchCourse,meeting,after,book:d.book?.book||null,range:d.range?T.rangeLabel(d.n,d.range.end):null,load:m.profile?.title||null,rows,depthSlots,same,d,m,c,date,catchDate:m.catch?date(m.catch.x):null,extraEnd:m.window?date(m.chase.end):null,parallel:{calcRange:d.calc?.chain.length?d.calc.chain.length===1?d.calc.chain[0]:d.calc.chain[0]+' → '+d.calc.chain.at(-1):'필요한 연산 보완',deep:d.deep?.id==='none'?'교과 응용 유지':d.deep?(d.deep.book+' · '+(d.deepScope?.title||'범위 선택 전')):'심화 선택 전',calc:d.calc?.title||'연산 선택 전'}};
}
// Month tiles describe the existing timeline; they never invent chapters, dates or book rates.
function monthsFor(p,fields){
 if(!p.rows.length||!Number.isFinite(p.m.now))return [];
 const segments=[];let cursor=p.m.now;
 for(const s of p.m.segments){const start=cursor,end=Number.isFinite(s.scenarioEnd)?s.scenarioEnd:cursor+s.duration;cursor=end;
  const row=s.gain>0?p.rows.find(r=>r.id===T.schoolNumber(G.stage(s.course,'school'))):null;
  const depth=p.depthSlots?.find(d=>d.scopeStage===s.scopeStage&&d.scenarioEnd===s.scenarioEnd);
  segments.push({start,end,row,gap:s.gain===0,depth});
 }
 for(const depth of p.depthSlots.filter(s=>s.parallel))segments.push({start:depth.scenarioStart,end:depth.scenarioEnd,row:null,gap:false,depth});
 const last=Math.max(p.m.now,...segments.filter(s=>s.row||s.depth).map(s=>s.end));
 return Array.from({length:Math.min(24,Math.ceil(last-p.m.now))},(_,i)=>{
  const start=p.m.now+i,end=start+1,active=segments.filter(s=>s.start<end-1e-8&&s.end>start+1e-8),rows=active.filter(s=>s.row).map(s=>s.row),gap=active.some(s=>s.gap),date=T.calendarAt(p.m.now,i,fields);
  return {date,rows,gap,depth:active.filter(s=>s.depth).map(s=>s.depth),empty:!rows.length&&!gap,extra:!!(rows.length&&p.m.adjusting&&p.m.window&&end>p.m.window.start&&start<p.m.chase.end)};
 });
}
// Current learning comes only from the intake answers, never from the future plan.
function currentSummary(answers={},fields={}){
 const a=I.effective(answers),summaries=I.summary(a,fields),order=I.order(a,fields);
 const axes=[
  {id:'school',label:'교과',key:'school',prefix:/^school/,status:'schoolStatus',absent:a.schoolBook},
  {id:'thinking',label:'사고력',key:'thinking',prefix:/^(thinking|compExact|preDone)/,status:'thinkingStatus',absent:a.thinkingExperience},
  {id:'calc',label:'연산',key:'calc',prefix:/^calc/,status:'calcStatus',absent:a.calc},
  {id:'deep',label:'심화',key:'deepBook',prefix:/^deep/,status:'deepStatus',absent:a.deepBook}
 ];
 return `<section class="current-learning-summary" aria-label="현재 공부 종합"><header><span>현재 공부</span><small>${esc(I.studentLabel(a,fields)==='미선택'?'학년 확인 전':I.studentLabel(a,fields))}</small></header><dl class="current-learning-axes">${axes.map(axis=>{
  const touched=Object.keys(answers).some(key=>axis.prefix.test(key)),required=order.filter(key=>axis.prefix.test(key)),ready=touched&&required.every(key=>I.hasAnswer(a,fields,key))&&!fields.pendingStatus?.[axis.status];
  let text=touched?(summaries.find(row=>row.key===axis.key)?.text||'확인 전'):'확인 전';
  const absent=I.special(axis.absent),status=!touched||absent?'':fields.pendingStatus?.[axis.status]?'상태 확인 전':ready&&a[axis.status]==='done'?'완료':ready&&a[axis.status]==='progress'?'진행 중':'선택 중';
  if(touched&&!absent){text=text.replace(/\s+(진행 중|완료|상태 확인 전)$/,'').replace(/미선택/g,'범위 확인 전');if(axis.id==='calc'&&a.calc&&!['advanced','high'].includes(a.calc)&&!text.includes(a.calc))text=a.calc+' · '+text;}
  return `<div class="current-learning-axis ${ready?'is-confirmed':touched?'is-building':'is-empty'}" data-axis="${axis.id}" data-study-area="${axis.id}"><dt>${axis.label}</dt><dd><button type="button" class="current-study-edit" data-current-area="${{school:'schoolCourse',thinking:'thinkingExperience',deep:'deepCourse',calc:'calc'}[axis.id]}" aria-label="${esc(axis.label+' 현재 진도 변경 · '+text)}"><strong>${esc(text)}</strong>${status?`<small>${esc(status)}</small>`:''}</button></dd></div>`;
 }).join('')}</dl></section>`;
}
function summary(value,progress,answers,fields,path=[]){
 const p=model(value,progress,answers,fields,path),first=p.rows.find(r=>r.timing==='estimate');
 return `<div class="workspace-summary" role="status" aria-live="polite"><div><small>이번에 설계한 계획 · ${esc(p.route)}</small><strong>${esc(p.book||'갈림길에서 공부를 선택해 주세요')}${p.range?' <span>'+esc(p.range)+'</span>':''}</strong></div><div class="workspace-summary-meta"><span>${esc(p.load?p.load+' 목표':p.state==='review'?'복습·심화에 배분':'기본 회차 유지')}</span><small>${esc(first?first.start:p.book?'범위를 고르면 월별 과정이 연결됩니다':'선택한 내용이 이곳에 쌓입니다')}</small></div></div>`;
}
// Compact node dates use exactly the same boundaries as the table and popover.
function nodeSchedule(row){
 if(row.timing==='done')return '<span class="course-stop-schedule is-undated">현재 완료한 범위</span>';
 if(row.timing!=='estimate'||!row.startDate||!row.endDate)return '<span class="course-stop-schedule is-undated">'+(row.id==='pending'?'범위 선택 후 일정':'일정 확인 필요')+'</span>';
 const label=d=>d.grade+' · '+(Number.isInteger(d.year)?String(d.year).slice(-2)+'.':'')+String(d.month).padStart(2,'0')+(Number.isInteger(d.year)?'':'월');
 return '<span class="course-stop-schedule"><span>'+esc(label(row.startDate))+'</span><span>→ '+esc(label(row.endDate))+'</span></span>';
}
function render(value,progress,answers,fields,path=[],options={}){
 const p=model(value,progress,answers,fields,path),{m,c}=p,rows=p.rows;
 const chosen=rows.find(r=>String(r.id)===String(options.course))||rows[0],nodes=rows.length?rows:[{id:'pending',school:p.book||'현재 공부부터',deep:p.parallel.deep}];
 const height=490+Math.max(0,Math.ceil(nodes.length/3)-1)*300;
 const steps=nodes.map((r,i)=>{const level=Math.floor(i/3),col=level%2?2-i%3:i%3;return {...r,x:[18,47,79][col],y:[.63,.49,.27][col]*490+level*300,row:level,col,index:i};});
 const route=steps.map((n,i)=>i?`C${steps[i-1].x*10+60} ${steps[i-1].y+50} ${n.x*10-80} ${n.y+50} ${n.x*10} ${n.y}`:`M${n.x*10} ${n.y}`).join(' ');
 const timing=r=>r.timing==='done'?'현재 완료한 범위':r.timing==='estimate'?r.start+' → '+r.end:r.id==='pending'?'교재와 범위를 선택해 주세요':'일정 확인 필요';
 const months=monthsFor(p,fields),total=months.length,groups=[];
 months.forEach((month,index)=>{const key=month.date.year+'년 '+month.date.quarter+'분기';if(groups.at(-1)?.key===key)groups.at(-1).count++;else groups.push({key,start:index,count:1});});
 const bars=rows.flatMap((row,index)=>{
  const segment=m.segments.find(s=>s.gain>0&&T.schoolNumber(G.stage(s.course,'school'))===row.id);
  if(!segment||!total||!Number.isFinite(segment.scenarioEnd)||!Number.isFinite(segment.duration))return [];
  const start=Math.max(0,segment.scenarioEnd-segment.duration-m.now),end=Math.min(total,segment.scenarioEnd-m.now);
  if(end<=start)return [];
  return [{row,index,start,end}];
 });
 for(const slot of p.depthSlots||[]){const start=Math.max(0,slot.scenarioEnd-slot.duration-m.now),end=Math.min(total,slot.scenarioEnd-m.now);if(end>start)bars.push({row:{id:slot.id,school:slot.depthTitle},start,end,depth:true});}bars.sort((a,b)=>a.start-b.start);
 for(const support of p.supplements)for(const b of support.blocks){const end=Math.min(total,b.end);if(end>b.start)bars.push({row:{id:b.id,school:b.title},start:b.start,end,support:support.id});}
 const outcome={books:'교재와 범위를 고르면 월별 과정이 이어집니다.',keep:'지금의 공부 속도를 기준으로 이어갑니다.',check:'현재 범위의 풀이를 확인한 뒤 다음 과정을 조정합니다.',allocation:'추가 분량의 용도를 고르면 비교에 반영됩니다.',review:'새 진도는 유지하며 복습과 심화에 더 배분합니다.',load:'추가할 목표 회차를 고르면 월별 일정이 바뀝니다.',catch:T.meetingText(m)+' 이후는 학습 성향에 따라 달라짐',outside:T.meetingText(m)+' 선택한 범위 밖의 참고 일정입니다.','no-catch':'24개월 안 합류 없음 · 목표 회차는 더 늘리지 않음'}[p.state];
 const monthDetails=months.map(month=>`<li class="${month.gap?'has-review':''} ${month.extra?'has-extra':''}"><small>${esc(month.date.year+' · '+month.date.grade+' · '+month.date.quarter+'분기')}</small><strong>${month.date.month}월</strong>${month.rows.map(r=>`<button type="button" data-workspace-course="${r.id}" aria-pressed="${chosen?.id===r.id}">${esc(T.schoolLabel(r.id))}<span>${esc(p.book)}</span></button>`).join('')}${month.depth?.length?month.depth.map(d=>'<span class="month-review">'+esc(d.depthTitle)+'</span>').join(''):month.gap?'<span class="month-review">원본의 별도 과정 · 진행 방식 확인</span>':''}${month.empty?'<span class="month-review">일정 확인 필요</span>':''}${month.extra?'<span class="month-extra">학습량을 서서히 늘리는 구간</span>':''}</li>`).join('');
 const popover=chosen?`<section class="course-popover" aria-label="선택한 과정의 병행 계획"><div class="popover-top"><span>살펴보는 과정 · ${esc(T.schoolLabel(chosen.id))}</span><span class="course-number">${String(rows.indexOf(chosen)+1).padStart(2,'0')}</span></div><h3>${esc(chosen.school)}</h3><p class="course-date">${esc(timing(chosen))}</p><div class="parallel-tags"><button type="button" data-transition-open="deep"><span>심화</span> ${esc(chosen.deep)}</button><button type="button" data-transition-open="calc"><span>연산</span> ${esc(p.parallel.calcRange)}</button></div><p class="course-action">${esc(chosen.checkpoint)}. 설명·적용·오류 수정을 함께 살펴봅니다.</p><button type="button" class="course-change" data-transition-open="book">교재 변경</button></section>`:'';
 const reading=chosen?`<details class="course-inspector workspace-note"><summary>이 과정의 공부 방법과 다음 범위 전 확인</summary><header><div><small>살펴보는 과정 · ${T.schoolLabel(chosen.id)}</small><h4>${esc(chosen.school)}</h4></div></header><p class="course-date">${esc(timing(chosen))}</p><p>교과의 개념·대표 유형을 스스로 적용하고, 응용 문제의 조건·식의 이유와 오류 재풀이까지 확인합니다.</p><p>심화: ${esc(chosen.deep)} · 한 문제의 조건 연결과 풀이 근거를 비교합니다.</p><p>연산: ${esc(chosen.calc)}. 권수에 맞춰 급히 끝내지 않고 원리·정확성·오류 수정을 확인합니다.</p><p>${esc(chosen.checkpoint)}. 도움이 계속 필요하면 해당 부분을 보완하고 다른 공부는 유지합니다.</p></details>`:'<div class="course-empty"><p>왼쪽 갈림길에서 고른 교재와 범위가 학기별 지점으로 추가됩니다.</p></div>';
 const calendar=total?`<div class="month-ribbon" tabindex="0" role="region" aria-label="월별 교재와 병행 과정" style="--month-count:${total}"><div class="quarter-axis" style="grid-template-columns:repeat(${total},minmax(42px,1fr))">${groups.map(group=>`<span style="grid-column:${group.start+1} / span ${group.count}">${esc(group.key)}</span>`).join('')}</div><div class="month-axis" style="grid-template-columns:repeat(${total},minmax(42px,1fr))">${months.map(month=>`<span>${esc(month.date.grade)}<b>${month.date.month}월</b></span>`).join('')}</div><div class="course-bars" style="height:${Math.max(1,bars.length)*30}px">${bars.map((bar,index)=>`<button type="button" class="course-bar ${bar.depth?'is-depth':''}" data-study-area="${bar.support||(bar.depth?'deep':'school')}" data-course-tone="${Math.max(0,rows.findIndex(r=>r.id===bar.row.id))%2}" ${bar.support?`data-standard-block="${bar.row.id}"`:`data-workspace-course="${bar.row.id}" aria-pressed="${chosen?.id===bar.row.id}"`} style="left:${bar.start/total*100}%;width:${(bar.end-bar.start)/total*100}%;top:${index*30}px"><span>${esc(bar.row.school)}</span></button>`).join('')}</div></div><details class="month-detail workspace-note"><summary>월별 교재·복습·학습량 자세히</summary><div class="month-detail-scroll"><ol>${monthDetails}</ol></div></details>`:'<p class="course-empty">범위를 고르면 학년·월과 교재가 함께 표시됩니다.</p>';
 return `<section class="learning-landscape course-landscape" aria-label="선택한 교재와 월별 공부 경로"><div class="course-terrain" style="--terrain-height:${height}px;--stop-rows:${Math.ceil(nodes.length/3)}"><img src="assets/learning-landscape-20261023.png" alt="도서관과 배움의 공간을 잇는 입체적인 풍경" width="1536" height="1024" fetchpriority="high"><header class="landscape-heading map-title"><span class="live-dot" aria-hidden="true"></span><span>선택한 교재와 예상 일정</span><button type="button" data-transition-open="range">범위 조정</button></header><svg viewBox="0 0 1000 ${height}" preserveAspectRatio="none" class="course-route" aria-hidden="true"><path d="${route}"/></svg><ol class="course-stops">${steps.map((r,i)=>`<li style="--stop-x:${r.x}%;--stop-y:${r.y}px;--stop-row:${r.row};--stop-col:${r.col};--stop-color:${i%2?'#9575ae':'#6c4b91'}"><button type="button" class="course-stop ${chosen?.id===r.id?'is-active':''}" ${r.id==='pending'?'data-transition-open="book"':`data-workspace-course="${r.id}" aria-pressed="${chosen?.id===r.id}"`}><span class="course-stop-label"><small>${r.id==='pending'?'출발점 선택':i===0?'현재 범위':i===1?'다음 과정':'이어갈 과정'}</small><strong>${esc(r.id==='pending'?'준비 중':T.schoolLabel(r.id))}</strong><span>${esc(r.school)}</span>${nodeSchedule(r)}</span><span class="stop-base" aria-hidden="true"><b>${i+1}</b></span></button></li>`).join('')}</ol></div>${popover}${reading}<div class="month-plan"><div class="month-heading"><h4>월별로 놓아보면</h4><small>학년은 국내 학제 기준 · 교재 학기와 별도</small></div>${horizontalPlan(p,fields)}<details class="workspace-note"><summary>교과 연결과 학습량 자세히</summary>${calendar}</details></div><div class="landscape-outcome" role="status"><span class="landscape-outcome-dot" aria-hidden="true"></span><p>${esc(outcome)}</p><button type="button" data-workspace-view="graph">그래프로 비교</button></div></section>`;
}
function horizontalPlan(p,fields){
 const planned=monthsFor(p,fields),months=Number.isFinite(p.m.now)&&p.independentLanes?.length?Array.from({length:24},(_,i)=>({date:T.calendarAt(p.m.now,i,fields)})):planned,total=months.length;if(!total)return '';
 const groups=[];months.forEach((month,index)=>{const name=month.date.year+'년 '+month.date.quarter+'분기';if(groups.at(-1)?.name===name)groups.at(-1).count++;else groups.push({name,start:index,count:1});});
 const blocks={school:[],thinking:[],deep:[],calc:[]};
 for(const [index,row] of p.rows.entries()){
  const segment=p.m.segments.find(s=>s.gain>0&&T.schoolNumber(G.stage(s.course,'school'))===row.id);if(!segment)continue;
  const start=Math.max(0,segment.scenarioEnd-segment.duration-p.m.now),end=Math.min(total,segment.scenarioEnd-p.m.now);if(end>start)blocks.school.push({id:row.id,title:row.school,start,end,tone:index%2});
 }
 for(const slot of p.depthSlots){const start=Math.max(0,slot.scenarioEnd-slot.duration-p.m.now),end=Math.min(total,slot.scenarioEnd-p.m.now);if(end>start)blocks.deep.push({id:slot.id,title:slot.depthTitle,start,end,tone:Math.max(0,p.rows.findIndex(r=>r.id===slot.id))%2});}
 const calcPlan=global.PlannerStandard?.calculationPlan(p.d.a,fields,fields.calcDaysPerWeek);
 const allowedCalc=new Set((p.d.calc?.chain||[]).map(title=>G.stage(title,'calc')));
 if(calcPlan?.supported&&p.d.calc?.id!=='repair')blocks.calc=calcPlan.blocks.filter(b=>allowedCalc.has(b.stage)&&b.start<total).map((b,index)=>({...b,id:b.id,end:Math.min(total,b.end),tone:index%2}));
 const independent=p.independentLanes||[];for(const row of independent)blocks[row.id]=row.blocks.filter(b=>b.start<total).map((b,index)=>({...b,end:Math.min(total,b.end),tone:index%2}));
 const period=b=>{const a=T.calendarAt(p.m.now,b.start,fields),z=T.calendarAt(p.m.now,b.end-.001,fields);return a.year+'년 '+a.month+'월 – '+(a.year===z.year?'':z.year+'년 ')+z.month+'월';};
 const supporting=p.supplements;
 for(const row of supporting)blocks[row.id]=row.blocks.filter(b=>b.start<total).map(b=>({...b,end:Math.min(total,b.end),tone:0}));
 const rows=[{id:'school',label:'교과',current:p.book||p.d.current?.current||'교과 범위 다시 선택'},...(independent.some(row=>row.id==='thinking')?[independent.find(row=>row.id==='thinking')]:[]),{id:'deep',label:'심화',current:independent.find(row=>row.id==='deep')?.current||p.parallel.deep},...(blocks.calc.length?[{id:'calc',label:'연산·도형',current:independent.find(row=>row.id==='calc')?.current||p.parallel.calcRange}]:[]),...supporting];
 return `<div class="standard-calendar horizontal-course-grid" tabindex="0" role="region" aria-label="선택한 교재의 가로 월별 과정표" style="--timeline-months:${total}"><div class="standard-calendar-inner"><div class="standard-quarter-axis" style="grid-template-columns:repeat(${total},minmax(0,1fr))">${groups.map(g=>`<span style="grid-column:${g.start+1}/span ${g.count}">${esc(g.name)}</span>`).join('')}</div><div class="standard-month-axis" style="grid-template-columns:repeat(${total},minmax(0,1fr))">${months.map(m=>`<span><small>${esc(m.date.grade)}</small>${m.date.month}월</span>`).join('')}</div><div class="standard-lanes">${rows.map(row=>`<section class="standard-lane" data-study-area="${row.id}"><header><strong>${row.label}</strong><span>${esc(row.current)}</span>${row.id==='thinking'?'<button type="button" class="timeline-book-change" data-current-area="thinkingExperience">현재 진도 변경</button>':['deep','calc'].includes(row.id)?`<button type="button" class="timeline-book-change" data-transition-open="${row.id}">교재 변경</button>`:''}</header><div class="standard-lane-track">${blocks[row.id].map(b=>`<button type="button" class="standard-block" data-course-tone="${b.tone}" ${row.id==='thinking'?'data-current-area="thinkingExperience"':['deep','calc'].includes(row.id)?`data-transition-open="${row.id}"`:row.id==='school'?`data-workspace-course="${b.id}"`:`data-standard-block="${b.id}"`} style="left:${b.start/total*100}%;width:${(b.end-b.start)/total*100}%" aria-label="${esc(row.label+' · '+b.title+' · '+period(b)+(row.id==='deep'?' · 심화 교재 변경':''))}"><strong>${esc(b.title)}</strong><small>${esc(period(b))}</small></button>`).join('')||'<p class="standard-lane-empty">선택한 범위의 일정을 확인합니다.</p>'}</div></section>`).join('')}</div></div></div>${p.newDepthBook?'<p class="workspace-note">새 심화 교재는 선택한 범위의 처음부터 배치한 참고 일정입니다. 기존 교과·사고력·연산의 기간은 유지합니다.</p>':''}<div class="horizontal-parallel" data-study-area="calc"><strong>연산 병행</strong><span>${esc(p.parallel.calcRange)} · 독립 진도 유지</span><button type="button" data-transition-open="calc">연산 변경</button></div>`;
}
function renderSchedule(value,progress,answers,fields,path=[]){
 const p=model(value,progress,answers,fields,path);if(!p.book||!p.range)return p.independentLanes?.length?'<section class="workspace-schedule"><h3>기존 공부는 따로 이어갑니다.</h3><p>교과 교재·범위는 다시 확인하며, 사고력·심화·연산의 선택은 유지합니다.</p>'+horizontalPlan(p,fields)+'</section>':'';
 const baseline=b=>b?'주 '+b.sessions+'회 × '+b.hours+'시간':'수업 기준 확인';
 return `<section class="workspace-schedule" aria-label="선택한 교재의 기간과 회차"><header><div><small>선택한 교재 · ${esc(p.range)}</small><h3>교재와 수업 계획</h3></div><button type="button" data-transition-open="summary">계획 수정</button></header>${horizontalPlan(p,fields)}<details class="horizontal-plan-details"><summary>교재별 수업·추가 회차 상세</summary><div class="workspace-table-scroll" tabindex="0" role="region" aria-label="교재별 일정 표"><table><caption>교과의 과정별 참고 일정</caption><thead><tr><th scope="col">교재·범위</th><th scope="col">참고 기간</th><th scope="col">기본 수업</th><th scope="col">추가 학습량</th></tr></thead><tbody>${p.rows.map((r,index)=>`<tr data-study-area="school" data-course-tone="${index%2}"><th scope="row">${esc(r.school)}<small>심화 · ${esc(r.deep)}<br>연산 · ${esc(p.parallel.calcRange)}</small>${r.afterCatch?'<small>합류 뒤 남은 범위는 같은 속도</small>':''}</th><td>${r.timing==='done'?'현재 완료한 범위':r.timing==='estimate'?`약 ${r.duration.toFixed(1)}개월<small>${esc(r.start)}<br>→ ${esc(r.end)}</small>`:'24개월 안 일정 확인 필요'}</td><td>${esc(baseline(r.baseline))}</td><td>${r.timing==='done'?'추가 없음':p.state==='review'?'복습·심화':r.afterCatch?r.maintenanceExtra==null?'유지 회차 확인':r.maintenanceExtra<.001?'추격 종료 · 추가 0회':esc('유지 평균 주 '+T.frequency(r.maintenanceExtra)+'회 추가'):r.extraActive&&p.load?esc(p.load+' 목표 · 서서히'):'기본 배분 유지'}</td></tr>`).join('')}${p.depthSlots.map(slot=>`<tr class="schedule-depth" data-study-area="deep" data-course-tone="${Math.max(0,p.rows.findIndex(r=>r.id===slot.id))%2}"><th scope="row">${esc(slot.depthTitle)}<small>${esc(T.schoolLabel(slot.id))} 교과${slot.parallel?'와 병행':' 다음 심화'}</small></th><td>약 ${slot.duration.toFixed(1)}개월<small>${esc(slot.start)} → ${esc(slot.end)}</small></td><td>${slot.parallel?'교과와 별도 시간에 병행':'기존 교과 시간에 순서대로'}</td><td>심화 시간 유지</td></tr>`).join('')}</tbody></table></div></details>${p.c?`<p class="catch-meeting-note">${esc(T.meetingText(p.m))}</p><div class="workspace-meeting"><div><small>${p.within?'선택 범위의 합류':'범위 밖 참고 합류'}</small><strong>약 ${p.c.months.toFixed(1)}개월 뒤</strong><span>학습량을 늘려 공부하는 기간 약 ${p.c.extraMonths.toFixed(1)}개월</span></div><div><small>만나는 시점의 추가 회차</small><strong>평균 주 ${T.frequency(p.c.extraAtCatch)}회</strong><span>${p.c.afterWindow?'6개월 적응 뒤 목표 회차 유지':'목표 회차까지 서서히 늘린 결과'}</span></div></div>`:''}<details class="workspace-note"><summary>기간과 회차를 읽는 기준</summary><p>기간은 기존 진도표의 같은 과정을 참고한 비교 가정입니다. 교재 종류별 이수 기간 자료는 없어 교재 이름만 바꾸어 속도를 다르게 계산하지 않습니다. 선택 범위 이후의 그래프는 참고 일정이며 다음 교재를 자동 배정하지 않습니다.</p><p>기본 수업은 교과·사고력 각각 초등 주1회×2시간, 중등 주2회×2시간, 고등 주2회×3시간입니다. 늘린 학습량은 교과 새 진도에 쓰며 기존 복습·심화·연산을 유지합니다. 목표 추가의 2개월50%·4개월80%·6개월100%를 가정합니다. 그 뒤에는 회차를 더 늘리지 않고 합류까지 유지합니다. 추가 회차의 절반을 진도에 반영하는 비율은 실측 효과가 아닙니다.</p>${p.same.length?`<table><caption>합류 뒤 같은 과정 기간 비교</caption><thead><tr><th>과정</th><th>이 경로</th><th>상위 예시</th><th>기본·유지 회차</th></tr></thead><tbody>${p.same.map(r=>`<tr><th>${esc(r.book)}<small>${r.chosen?'선택한 교재 범위':'선택 범위 밖 · 교재 미배정'}</small></th><td>${r.own.toFixed(1)}개월</td><td>${r.upper.toFixed(1)}개월</td><td>주${r.sessions}회×${r.hours}시간${r.maintenanceExtra>.001?' + 평균 주'+T.frequency(r.maintenanceExtra)+'회':''}</td></tr>`).join('')}</tbody></table>`:''}<p>이후는 학습 성향에 따라 달라짐. 합류 뒤에는 상위의 같은 과정 속도를 참고하며 복습·심화 배치는 아이에게 맞춰 조정합니다. 책의 완료와 설명·적용·오류 수정의 확인은 구분합니다. 국제학교의 학년 환산이나 방학 달은 자동 지정하지 않습니다.</p></details></section>`;
}
function renderQuestions(value,progress,answers,fields,path=[]){
 const p=model(value,progress,answers,fields,path);if(!p.book||!p.range||!p.d.deep?.book||!p.d.deepScope)return '';
 const scope=p.d.deepScope.lag===null?T.schoolLabel(p.d.deepScope.start):p.d.deepScope.title,book=p.d.deep.book;
 const items=[{q:book+' '+scope+' 범위를 바꾸면 교과 진도도 바뀌나요?',a:'심화는 '+book+' '+scope+'에서 따로 이어갑니다. 교과 '+p.book+' '+p.range+'와 현재 사고력·연산의 기간은 유지합니다. '+(p.newDepthBook?'새로 선택한 심화 교재는 해당 범위의 처음부터 배치한 참고 일정입니다.':'현재 심화의 남은 범위와 이후 과정을 별도로 확인합니다.')},{q:'현재 심화 진도를 고치면 추가 회차를 다시 골라야 하나요?',a:(p.load?p.load+' 목표와 교과의 풀이 확인·배분 선택은 유지합니다.':'교과의 추가 회차는 별도 갈림길에서 선택합니다.')+' 심화 진도만 수정하면 심화의 교재·월별 과정이 바뀌고 교과의 비교 그래프와 다른 영역의 일정은 유지합니다. 교과 자체의 출발점이나 풀이 확인을 바꾸면 그 교과의 적용 조건은 다시 확인합니다.'}];
 return '<section class="pathway-parent-questions custom-area-questions">'+items.map(item=>'<details><summary>'+esc(item.q)+'</summary><p>'+esc(item.a)+'</p></details>').join('')+'</section>';
}
function compactCoach(root){
 if(!root)return;
 for(const options of root.querySelectorAll('.pathway-options')){
  if(options.dataset.compact==='yes')continue;options.dataset.compact='yes';const entries=[];
  for(const b of options.querySelectorAll(':scope > button')){const lines=[...b.children].filter(n=>n.tagName==='SPAN'&&n.getAttribute('aria-hidden')!=='true'&&!n.classList.contains('pathway-option-dot')&&!n.querySelector('strong'));if(!lines.length)continue;const item=document.createElement('div'),h=document.createElement('h4');h.textContent=b.querySelector('strong')?.textContent||'';item.append(h,...lines);entries.push(item);}
  if(entries.length){const help=document.createElement('details');help.className='choice-help';const s=document.createElement('summary');s.textContent='선택 도움말';help.append(s,...entries);options.after(help);}
 }
 for(const advice of root.querySelectorAll('.pathway-coach-advice')){if(advice.parentElement.tagName==='DETAILS')continue;let help=root.querySelector('.choice-help');if(help){help.insertBefore(advice,help.children[1]||null);}else{help=document.createElement('details');help.className='choice-help';const s=document.createElement('summary');s.textContent='선택 기준';advice.before(help);help.append(s,advice);}}
}
global.PlannerWorkspace=Object.freeze({model,monthsFor,currentSummary,summary,render,renderSchedule,renderQuestions,compactCoach});
})(window);
