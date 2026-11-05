/* Verified 2026 practice-paper scopes. Dates below are practice appointments,
 * driven by the selected study calendar, not registrations for future exams. */
(function(g){
'use strict';
const C=g.PlannerCurriculum,I=g.PlannerIntake;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SOURCE='https://use.go.kr/jinhak/sat/sat_2.jsp';
const EBS='https://www.ebsi.co.kr/ebs/ent/enta/retrieveExmSchedRngNext.ebs?tab=1&targetCd=D100';
const BOUNDARIES=[
 {id:'c1-equations',stage:'공통수학1',step:1,title:'여러 가지 방정식·부등식까지'},
 {id:'c1-all',stage:'공통수학1',step:2,title:'경우의 수·행렬까지 전 범위'},
 {id:'c2-geometry',stage:'공통수학2',step:1,title:'도형의 방정식까지'},
 {id:'c2-all',stage:'공통수학2',step:2,title:'집합·명제·함수까지 전 범위'},
 {id:'alg-trig',stage:'대수',step:1,title:'삼각함수까지'},
 {id:'alg-all',stage:'대수',step:2,title:'수열까지 전 범위'},
 {id:'cal-limit',stage:'미적분Ⅰ',step:1,title:'함수의 극한까지'},
 {id:'cal-coefficient',stage:'미적분Ⅰ',step:2,title:'미분계수까지'},
 {id:'cal-all',stage:'미적분Ⅰ',step:3,title:'전 범위'}
];
// EBS original PDF headers and matching explanations checked 2026-11-06.
// Store official links only; never embed or redistribute the question/answer files.
const PAPER_FILES={
 "h1-03": {
  "problem": "https://wdown.ebsi.co.kr/W61001/01exam/20260324/go1/math_mun_OCK6KM91.pdf",
  "explanation": "https://wdown.ebsi.co.kr/W61001/01exam/20260324/go1/math_hsj_43S8DA11.pdf"
 },
 "h1-06": {
  "problem": "https://wdown.ebsi.co.kr/W61001/01exam/20260604/go1/math_mun_D7P5UME3.pdf",
  "explanation": "https://wdown.ebsi.co.kr/W61001/01exam/20260604/go1/math_hsj_AX588329.pdf"
 },
 "h1-09": {
  "problem": "https://wdown.ebsi.co.kr/W61001/01exam/20260902/go1/math_mun_7L76TL61.pdf",
  "explanation": "https://wdown.ebsi.co.kr/W61001/01exam/20260902/go1/math_hsj_F42K4C49.pdf"
 },
 "h1-10": {
  "problem": "https://wdown.ebsi.co.kr/W61001/01exam/20261020/go1/math_mun_Y46IAKH1.pdf",
  "explanation": "https://wdown.ebsi.co.kr/W61001/01exam/20261020/go1/math_hsj_9LW1PC49.pdf"
 },
 "h2-03": {
  "problem": "https://wdown.ebsi.co.kr/W61001/01exam/20260324/go2/math_mun_53A7J811_1.pdf",
  "explanation": "https://wdown.ebsi.co.kr/W61001/01exam/20260324/go2/math_hsj_Y2JA7LIE.pdf"
 },
 "h2-06": {
  "problem": "https://wdown.ebsi.co.kr/W61001/01exam/20260604/go2/math_mun_3U2G34HF.pdf",
  "explanation": "https://wdown.ebsi.co.kr/W61001/01exam/20260604/go2/math_hsj_322HZ5AE.pdf"
 },
 "h2-09": {
  "problem": "https://wdown.ebsi.co.kr/W61001/01exam/20260902/go2/math_mun_895U99J8.pdf",
  "explanation": "https://wdown.ebsi.co.kr/W61001/01exam/20260902/go2/math_hsj_GTK7Z5PQ.pdf"
 },
 "h2-10": {
  "problem": "https://wdown.ebsi.co.kr/W61001/01exam/20261020/go2/math_mun_2O8F6113.pdf",
  "explanation": "https://wdown.ebsi.co.kr/W61001/01exam/20261020/go2/math_hsj_227HZ894.pdf"
 }
};
const PAPERS=[
 {id:'h1-03',level:'1',month:3,needs:[['중3-2']],scope:'중등 수학 전 범위',middle:true},
 {id:'h1-06',level:'1',month:6,needs:[['공통수학1',1]],scope:'공통수학1 · 방정식·부등식까지'},
 {id:'h1-09',level:'1',month:9,needs:[['공통수학1',2]],scope:'공통수학1 전 범위'},
 {id:'h1-10',level:'1',month:10,needs:[['공통수학2',1]],scope:'공통수학1과 공통수학2의 도형의 방정식까지'},
 {id:'h2-03',level:'2',month:3,needs:[['공통수학2',2]],scope:'공통수학1·2 전 범위'},
 {id:'h2-06',level:'2',month:6,needs:[['대수',1]],scope:'대수 · 삼각함수까지'},
 {id:'h2-09',level:'2',month:9,needs:[['대수',2],['미적분Ⅰ',1]],scope:'대수와 미적분Ⅰ의 함수의 극한까지'},
 {id:'h2-10',level:'2',month:10,needs:[['대수',2],['미적분Ⅰ',2]],scope:'대수와 미적분Ⅰ의 미분계수까지'}
].map(p=>({...p,files:PAPER_FILES[p.id],year:2026,title:'2026년 고'+p.level+' '+p.month+'월 수학 기출',exam:'2026년 '+p.month+'월 학평',availableMonth:'2026-'+String(p.month).padStart(2,'0'),source:SOURCE,papers:'https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D'+(p.level==='1'?'100':'200')}));
// Records have their own IDs: resolve objects by exact exam + grade, never record.id.
function resolvePaper(value){
 if(value?.pending)return null;
 if(value?.selectedPaperId)return g.PlannerMockLibrary?.find(value.selectedPaperId)||PAPERS.find(p=>p.id===value.selectedPaperId)||null;
 return g.PlannerMockLibrary?.find(value)||(typeof value==='string'?PAPERS.find(p=>p.id===value):PAPERS.find(p=>p.exam===value?.exam&&p.level===value?.level))||null;
}
function paperLinks(value,{caption=false}={}){
 if(value?.pending)return '';
 const p=resolvePaper(value),level=p?.level||value?.level;
 if(!p&&(!value?.exam||!['1','2','3'].includes(level)))return '';
 const title=p?.title||String(value.exam)+' · 고'+level+' 수학',list=p?.papers||'https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D'+({1:'100',2:'200',3:'300'}[level]);
 const link=(url,text,kind)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-mock-paper-file="${kind}" aria-label="${esc(title+' · '+text+' (새 창)')}">${text}<span aria-hidden="true"> ↗</span></a>`;
 return `<div class="mock-paper-links"${p?` data-mock-paper="${p.id}"`:''} role="group" aria-label="${esc(title+' 자료')}">${caption?`<p class="mock-paper-caption">${esc(title)}${p?' · EBSi 공식 기출':''}</p>`:''}${p?`${link(p.files.problem,'문제 PDF','problem')}<details class="mock-paper-answers"><summary>정답·해설</summary><div>${link(p.files.explanation,'정답·해설 PDF','explanation')}${link(list,'파일이 안 열리면 EBSi에서 찾기','search')}<small>공식 파일 확인 · 2026.11.06</small></div></details>`:`<p class="mock-paper-caption">이 시험은 직접 링크 확인 전입니다. 연도·학년·회차를 골라 주세요.</p>${link(list,'EBSi에서 기출 찾기','search')}`}</div>`;
}
const monthOK=v=>/^(20\d\d|2100)-(0[1-9]|1[0-2])$/.test(v||'');
function restore(v){
 const s={version:1,enabled:true,boundary:null,signature:null,spacing:1,overrides:{},seenPaperIds:[],assignments:{},practiceDates:{},knowledge:null};
 if(v?.version!==1)return s;
 const known=new Set([...(g.PlannerMockLibrary?.PAPERS||[]),...PAPERS].map(p=>p.id));
 s.knowledge=g.PlannerMockItems?.restoreKnowledge(v.knowledge)||null;
 s.enabled=v.enabled!==false;if([1,2,3].includes(+v.spacing))s.spacing=+v.spacing;
 if(BOUNDARIES.some(b=>b.id===v.boundary)&&typeof v.signature==='string'&&v.signature.length<=400){s.boundary=v.boundary;s.signature=v.signature;}
 s.seenPaperIds=[...new Set((Array.isArray(v.seenPaperIds)?v.seenPaperIds:[]).filter(id=>known.has(id)))];
 for(const p of PAPERS){
  const o=v.overrides?.[p.id];
  if(o&&['auto','planned','done','skip'].includes(o.status)&&(!o.month||monthOK(o.month)))s.overrides[p.id]={status:o.status,month:o.month||null,...(known.has(o.paperId)?{paperId:o.paperId}:{})};
  if(known.has(v.assignments?.[p.id]))s.assignments[p.id]=v.assignments[p.id];
  const d=v.practiceDates?.[p.id];if(typeof d==='string'&&/^(20\d\d|2100)-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d)s.practiceDates[p.id]=d;
 }
 return s;
}
function markSeen(value,id,seen=true){const s=restore(value);if(!resolvePaper(id))return s;s.seenPaperIds=s.seenPaperIds.filter(x=>x!==id);if(seen)s.seenPaperIds.push(id);return s;}
const signature=a=>I.progressCourse(I.effective(a),'schoolStatus');
function update(v,input,a){const s=restore(v),errors=[];s.enabled=input.enabled==='on';if(![1,2,3].includes(+input.spacing))errors.push('점검 간격은 1~3개월 중 선택해 주세요.');else s.spacing=+input.spacing;
 const actual=C.actual(I.effective(a),'school',{}),boundary=BOUNDARIES.find(b=>b.id===input.boundary);
 if(input.boundary&&(!boundary||boundary.stage!==actual?.stage))errors.push('현재 교과 과목에서 실제 마친 범위를 선택해 주세요.');
 if(errors.length)return{state:restore(v),errors};if(s.boundary!==(boundary?.id||null)&&input.knowledgeEdited!=='on')s.knowledge=null;s.boundary=boundary?.id||null;s.signature=signature(a);
 if(input.knowledgeEdited==='on')s.knowledge=g.PlannerMockItems?.knowledgeInput(input,a,actual)||null;
 for(const p of PAPERS){const status=input[p.id+'-status']||'auto',month=input[p.id+'-month'];if(!['auto','planned','done','skip'].includes(status)||month&&!monthOK(month)){errors.push(p.title+'의 상태·월을 확인해 주세요.');continue;}if(status==='done'&&Object.hasOwn(input,p.id+'-paper')&&!input[p.id+'-paper']){errors.push('완료할 기출 회차를 먼저 선택해 주세요.');continue;}const paper=resolvePaper(input[p.id+'-paper']||s.overrides[p.id]?.paperId||p.id);s.overrides[p.id]={status,month:month||null,...(paper?{paperId:paper.id}:{})};}
 return{state:errors.length?restore(v):s,errors};
}
const rank=stage=>[...Array.from({length:12},(_,n)=>g.Planner.SEM(n+1)),'초등 계통 대수심화',...g.Planner.MID,...I.highSubjects].indexOf(stage);
const relative=(m,value)=>{const [y,n]=value.split('-').map(Number);return y*12+n-m.year*12-m.month;};
const stamp=(m,n)=>{const d=C.date(m,n);return d.year+'-'+String(d.month).padStart(2,'0');};
function model(m,a={},fields={},value,records=[]){
 const s=restore(value),actual=C.actual(I.effective(a),'school',fields),deep=C.actual(I.effective(a),'deep',fields),rawBoundary=s.signature===signature(a)?BOUNDARIES.find(b=>b.id===s.boundary&&b.stage===actual?.stage):null,knowledge=g.PlannerMockItems?.knowledge(a,s,actual),boundary=rawBoundary&&(!knowledge?.explicit||g.PlannerMockItems.projectedUnits({needs:[[rawBoundary.stage,rawBoundary.step]]},{learned:[]}).every(id=>knowledge.learned.includes(id)))?rawBoundary:null;
 const lane=m.lanes.find(l=>l.id==='school'),warnings=[];
 const endAt=(stage,step=0)=>{
  if(!actual)return null;
  if(actual.stage===stage&&step&&boundary&&boundary.step>=step)return 0;
  if(Object.hasOwn(m.highReadyAt||{},stage))return m.highReadyAt[stage];
  if(rank(actual.stage)>rank(stage)||actual.stage===stage&&actual.done)return 0;
  const b=lane?.blocks.find(b=>b.stage===stage&&!b.endClipped&&!b.continues);
  return b&&Number.isFinite(b.end)?Math.max(0,b.end):null;
 };
 const matching=g.PlannerMockMatching,seen=matching?.seen(records,s),catalog=matching?.catalog()||[];
 const releaseAt=p=>{if(!matching)return Math.max(0,relative(m,p.availableMonth));const dates=catalog.filter(x=>x.checkpoint===p.id&&!seen.has(x.id)).map(x=>x.examDate||x.year+'-12-31').sort();return dates.length?Math.max(0,relative(m,dates[0].slice(0,7))):0;};
 const rows=PAPERS.map(p=>{const times=p.needs.map(([stage,step])=>endAt(stage,step));
  if(p.middle&&deep&&rank(deep.stage)<=rank('중3-2')){const b=m.lanes.find(l=>l.id==='deep')?.blocks.find(b=>b.stage==='중3-2'&&!b.endClipped&&!b.continues);if(deep.stage==='중3-2'&&deep.done)times.push(0);else times.push(b?.end??null);}
  const partial=g.PlannerMockItems?.partialCheckpoint(knowledge)===p.id&&catalog.some(x=>x.checkpoint===p.id&&g.PlannerMockItems.select(x,knowledge.learned)?.selected.length);
  if(partial){times.length=0;times.push(0);}
  const known=times.every(n=>n!==null),ready=known?Math.max(0,Math.ceil(Math.max(0,...times)-1e-8)):null;
  return{...p,ready,release:releaseAt(p),status:s.overrides[p.id]?.status||'auto',requested:s.overrides[p.id]?.month||null,currentUnits:!!(boundary&&p.needs.some(([stage,step])=>stage===boundary.stage&&step&&boundary.step>=step))};
 });
 // Start with the most advanced paper already supported by reported learning;
 // earlier papers remain selectable for an explicit review purpose.
 const firstReady=rows.reduce((n,p,i)=>p.ready===0&&p.release===0?i:n,-1);let cursor=0;
 for(let i=0;i<rows.length;i++){
  const p=rows[i],release=p.release;p.start=null;p.end=null;p.suggested=null;p.reason='';
  if(p.status==='done'){p.reason='점검 완료로 기록';p.suggested=p.requested;continue;}
  const coveredSooner=p.ready!==null&&rows.slice(i+1).some(q=>q.ready!==null&&q.status!=='skip'&&Math.max(q.ready,q.release)<=Math.max(p.ready,release));
  if(p.status==='skip'||p.status==='auto'&&!p.requested&&(i<firstReady||coveredSooner)){p.reason=p.status==='skip'?'이번 계획에서 제외':'같거나 더 이른 시점에 넓은 범위로 점검 · 필요하면 복습으로 선택';continue;}
  if(p.ready===null){p.reason='현재 교과·심화 또는 이 범위의 학습 종료월 확인 필요';continue;}
  const requested=p.requested?relative(m,p.requested):null,earliest=Math.max(p.ready,release),start=Math.max(earliest,cursor,requested??0);
  if(requested!==null&&requested<earliest)warnings.push(p.title+'의 지정 월보다 선수 범위 완료·기출 공개 시점이 늦어 '+stamp(m,start)+'로 조정했습니다.');
  p.start=start;p.end=start+1;p.suggested=stamp(m,start);p.reason=p.ready===0?'현재 배운 범위부터 확인':'선수 범위를 마치는 달 이후 확인';
  if(!p.currentUnits&&p.needs.some(([stage,step])=>step&&endAt(stage,step)>0))p.reason+=' · 세부 단원 미확인 시 과목 종료월 기준';
  cursor=start+s.spacing;
 }
 return assignRows({state:s,actual,boundary,knowledge,rows,warnings,enabled:s.enabled,year:m.year,month:m.month},{records,calendar:m});
}
// Slot IDs keep saved calendar overrides stable; selectedPaperId identifies the actual PDF.
function assignRows(plan,{records=[],reserved=new Set(),calendar=plan}={}){
 const matching=g.PlannerMockMatching;if(!matching)return plan;
 const used=matching.seen(records,plan.state),taken=new Set(reserved),catalog=matching.catalog();
 const today=g.PlannerMockFeedback?.localToday?.()||new Date().toISOString().slice(0,10);
 const rows=plan.rows.map(row=>{
  const base=PAPERS.find(p=>p.id===row.id),r={...row,reason:row.baseReason??row.reason,baseReason:row.baseReason??row.reason};
  if(!base)return r;
  const day=(r.suggested||stamp(calendar,Math.max(0,r.ready||0)))+'-01';
  const heldDate=plan.state.practiceDates?.[r.id];
  r.practiceDate=heldDate?.slice(0,7)===day.slice(0,7)?heldDate:day.slice(0,7)===today.slice(0,7)?today:day;
  const [y,mon]=day.split('-').map(Number),availableDay=new Date(Date.UTC(y,mon,0)).toISOString().slice(0,10);
  const completed=plan.state.overrides[r.id]?.status==='done';
  const saved=completed?(plan.state.overrides[r.id]?.paperId||r.id):plan.state.assignments?.[r.id];
  let paper=catalog.find(p=>p.id===saved&&(completed||p.checkpoint===r.id&&!used.has(p.id)&&!taken.has(p.id)&&matching.available(p,availableDay)));
  if(!paper&&!completed)paper=matching.selectInitial(r.id,records,plan.state,availableDay,taken);
  if(paper){r.practiceDate=[r.practiceDate,paper.examDate||paper.year+'-12-31'].sort().at(-1);Object.assign(r,{selectedPaperId:paper.id,title:paper.title,exam:paper.exam,scope:paper.scope,scopeKey:paper.scopeKey,scopeSources:paper.scopeSources,files:paper.files,papers:paper.papers,year:paper.year,month:paper.month,pending:false});if(r.start!==null)taken.add(paper.id);}
  else Object.assign(r,{selectedPaperId:null,title:'고'+base.level+' · '+base.scope+' 점검',exam:null,scope:base.scope,files:null,scopeKey:null,pending:true,reason:(r.reason?r.reason+' · ':'')+'같은 범위의 미풀이 기출 확인 대기'});
  if(paper&&g.PlannerMockItems&&plan.knowledge){const MI=g.PlannerMockItems,projected=r.ready!==0;r.questionSelection=MI.select(paper,projected?MI.projectedUnits(base,plan.knowledge):plan.knowledge.learned,{projected});}
  return r;
 });
 return{...plan,rows};
}
function blocks(plan){return plan.enabled?plan.rows.filter(p=>p.start!==null).map(p=>({id:'mock-check-'+p.id,title:p.title+(p.pending?' · 기출 확인 대기':''),start:p.start,end:p.end,calendarStart:p.practiceDate,full:1,guide:'mock',slotId:p.id,paperId:p.selectedPaperId||p.id,tasks:p.scope+' · '+p.reason+'. '+(p.questionSelection?(g.PlannerMockItems.numberText(p.questionSelection)+' · '):'')+(p.pending?'풀이 일정은 유지합니다. 같은 범위의 미풀이 기출이 확인되면 연결합니다.':'기출 풀이→오답 원인 정리→다른 연도 재점검으로 이어집니다.'),books:[p.title,'현재 교재에서 필요한 단원 복습']})):[];}
function sync(value,m){const s=restore(value),plan=m?.mockCheckPlan;if(!plan)return s;for(const p of plan.rows)if(p.start!==null&&!p.pending&&p.selectedPaperId){s.assignments[p.id]=p.selectedPaperId;s.practiceDates[p.id]=p.practiceDate;}return s;}
function attach(m,a,fields,value,records=[]){const plan=model(m,a,fields,value,records),items=blocks(plan);if(!plan.enabled)return{...m,mockCheckPlan:plan};
 return{...m,mockCheckPlan:plan,lanes:items.length?[...m.lanes,{id:'mockCheck',title:'진도에 맞춘 고등 기출 점검',current:'연도·학년·월 기출과 실제 풀이 일정',blocks:items}]:m.lanes,horizon:Math.max(m.horizon||1,...items.map(b=>b.end)),warnings:[...(m.warnings||[]),...plan.warnings],ready:!!items.length||m.ready};
}
function controls(m,a,v){const plan=m.mockCheckPlan||model(m,a,{},v),s=plan.state;
 return `<section class="learning-evidence mock-check-controls"><h3>현재 진도에 맞춘 기출 일정</h3><p>기출의 ‘3월·6월’은 시험이 시행됐던 달입니다. 아래 ‘풀어볼 월’은 아이의 교과·심화 완료 시점으로 계산한 연습 일정이며 실제 시험 응시일이 아닙니다.</p><form data-mock-schedule-form class="curriculum-form"><label><span><input name="enabled" type="checkbox"${s.enabled?' checked':''}> 고1·고2 기출 점검을 로드맵에 표시</span></label><label>점검 사이 간격<select name="spacing">${[1,2,3].map(n=>`<option value="${n}"${s.spacing===n?' selected':''}>최소 ${n}개월</option>`).join('')}</select></label>${plan.actual&&BOUNDARIES.some(b=>b.stage===plan.actual.stage)?`<label>${esc(plan.actual.stage)}에서 실제 마친 범위<select name="boundary"><option value="">세부 범위 미확인 · 과목 종료월 기준</option>${BOUNDARIES.filter(b=>b.stage===plan.actual.stage).map(b=>`<option value="${b.id}"${plan.boundary?.id===b.id?' selected':''}>${esc(b.title)}</option>`).join('')}</select></label>`:'<input name="boundary" type="hidden" value="">'}<p>교재의 완료 비율을 특정 단원 이수로 간주하지 않습니다. 위 범위를 확인하면 이미 배운 기출을 먼저 배치합니다.</p>${g.PlannerMockItems&&plan.knowledge?g.PlannerMockItems.knowledgeFields(plan.knowledge):''}<details><summary>기출별 월·완료·제외 조정</summary>${plan.rows.map(p=>`<fieldset><legend>${esc(p.title)}</legend><input type="hidden" name="${p.id}-paper" value="${esc(p.pending?'':p.selectedPaperId||p.id)}"><p>${esc(p.scope)}</p>${paperLinks(p)}<p>${p.suggested?'풀어볼 월 '+esc(p.suggested):esc(p.reason)}</p><div class="curriculum-fields"><label>계획 상태<select name="${p.id}-status">${[['auto','현재 진도에서 자동 연결'],['planned','이 기출을 포함'],['done','점검 완료'],['skip','이번 계획에서 제외']].map(([id,t])=>`<option value="${id}"${p.status===id?' selected':''}>${t}</option>`).join('')}</select></label><label>풀어볼 월 직접 지정 · 선택<input name="${p.id}-month" type="month" min="2000-01" max="2100-12" value="${p.requested||''}"></label></div></fieldset>`).join('')}</details><p role="alert" data-mock-schedule-error></p><button type="submit">현재 진도로 기출 일정 다시 계산</button></form><p><a href="${SOURCE}" target="_blank" rel="noopener noreferrer">교육청의 2026 출제 범위 확인 (새 창)</a> · <a href="${esc(EBS)}" target="_blank" rel="noopener noreferrer">EBSi 범위 대조 (새 창)</a></p><p>연도별 공식 출제 범위를 대조해 현재 진도로 풀 수 있는 기출을 고릅니다. 결과 기록이나 ‘이미 푼 기출’로 표시한 회차는 제외합니다. 같은 월이라도 교육과정·단원이 다르면 재점검에 섞지 않습니다. 선수 범위 종료월이 없으면 확인 후 일정을 연결합니다.</p></section>`;
}
function render(m,view='map'){
 const p=m.mockCheckPlan;if(!p?.enabled)return '';
 const active=p.rows.filter(r=>r.start!==null),pending=p.rows.filter(r=>r.ready===null&&r.status!=='skip'&&r.status!=='done');
 return `<section class="learning-evidence mock-check-schedule" data-mock-check-view="${view}"><h3>진도에 맞춘 고1·고2 기출 일정</h3><p>현재 학년보다 실제 배운 범위와 학습 종료월로 정합니다. 기출 시행월과 아래 풀이 일정은 서로 다릅니다.</p>${p.warnings.length?`<p>${p.warnings.map(esc).join(' ')}</p>`:''}${active.length&&view==='table'?`<div class="curriculum-table-scroll"><table><caption>현재 진도에 맞춰 잡은 실제 기출 풀이 월</caption><thead><tr><th>풀어볼 월</th><th>기출</th><th>점검 범위</th></tr></thead><tbody>${active.map(r=>`<tr><th>${esc(C.date(m,r.start).label)}</th><td><button type="button" data-curriculum-block="mock-check-${r.id}">${esc(r.title)}</button>${paperLinks(r)}</td><td>${esc(r.scope)}</td></tr>`).join('')}</tbody></table></div>`:active.length?`<ul>${active.map(r=>`<li><button type="button" data-curriculum-block="mock-check-${r.id}"><strong>${esc(r.title)}</strong><span>풀어볼 월 · ${esc(C.date(m,r.start).label)}</span><small>${esc(r.scope)}</small></button>${paperLinks(r)}${g.PlannerMockItems?.summary(r.questionSelection)||''}${r.pending?'<p>미풀이 기출 확인 대기 · 일정은 유지됩니다.</p>':`<button type="button" data-mock-print-check="${r.id}">학습 안내지 인쇄</button><button type="button" data-mock-check-record="${r.id}">풀고 결과 기록</button>`}</li>`).join('')}</ul>`:'<p>현재 범위를 확인하면 풀이 월이 이어집니다.</p>'}${pending.length?`<details><summary>학습 범위·종료월 확인 뒤 연결 · ${pending.length}회</summary><ul>${pending.map(r=>`<li>${esc(r.title)} · ${esc(r.reason)}</li>`).join('')}</ul></details>`:''}<button type="button" data-learning-evidence-open="mock">기출 일정·기록 조정</button> <button type="button" data-learning-evidence-open="papers">연도별 기출 보기</button></section>`;
}
function prefill(id,m){let p=m?.mockCheckPlan?m.mockCheckPlan.rows.find(p=>p.id===id):resolvePaper(id);if(p&&!m?.mockCheckPlan)p=g.PlannerMockMatching?.sourceFor(p)||PAPERS.find(x=>x.id===p.id)||p;return p&&!p.pending?{exam:p.exam,level:p.level,scope:p.scope||'',...(m?.mockCheckPlan?{rangeMode:'whole'}:{}),...(g.PlannerMockItems&&m?.mockCheckPlan?.knowledge?g.PlannerMockItems.forRecord(p,m.mockCheckPlan.knowledge):{})}:null;}

g.PlannerMockSchedule=Object.freeze({PAPERS,BOUNDARIES,SOURCE,resolvePaper,paperLinks,restore,markSeen,update,model,assignRows,blocks,sync,attach,controls,render,prefill});
})(window);
