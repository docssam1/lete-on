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
function resolvePaper(value){return (typeof value==='string'?PAPERS.find(p=>p.id===value):PAPERS.find(p=>p.exam===value?.exam&&p.level===value?.level))||g.PlannerMockLibrary?.find(value)||null;}
function paperLinks(value,{caption=false}={}){
 const p=resolvePaper(value),level=p?.level||value?.level;
 if(!p&&(!value?.exam||!['1','2','3'].includes(level)))return '';
 const title=p?.title||String(value.exam)+' · 고'+level+' 수학',list=p?.papers||'https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D'+({1:'100',2:'200',3:'300'}[level]);
 const link=(url,text,kind)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-mock-paper-file="${kind}" aria-label="${esc(title+' · '+text+' (새 창)')}">${text}<span aria-hidden="true"> ↗</span></a>`;
 return `<div class="mock-paper-links"${p?` data-mock-paper="${p.id}"`:''} role="group" aria-label="${esc(title+' 자료')}">${caption?`<p class="mock-paper-caption">${esc(title)}${p?' · EBSi 공식 기출':''}</p>`:''}${p?`${link(p.files.problem,'문제 PDF','problem')}<details class="mock-paper-answers"><summary>정답·해설</summary><div>${link(p.files.explanation,'정답·해설 PDF','explanation')}${link(list,'파일이 안 열리면 EBSi에서 찾기','search')}<small>공식 파일 확인 · 2026.11.06</small></div></details>`:`<p class="mock-paper-caption">이 시험은 직접 링크 확인 전입니다. 연도·학년·회차를 골라 주세요.</p>${link(list,'EBSi에서 기출 찾기','search')}`}</div>`;
}
const monthOK=v=>/^(20\d\d|2100)-(0[1-9]|1[0-2])$/.test(v||'');
function restore(v){const s={version:1,enabled:true,boundary:null,signature:null,spacing:1,overrides:{}};if(v?.version!==1)return s;s.enabled=v.enabled!==false;if([1,2,3].includes(+v.spacing))s.spacing=+v.spacing;if(BOUNDARIES.some(b=>b.id===v.boundary)&&typeof v.signature==='string'&&v.signature.length<=400){s.boundary=v.boundary;s.signature=v.signature;}for(const p of PAPERS){const o=v.overrides?.[p.id];if(o&&['auto','planned','done','skip'].includes(o.status)&&(!o.month||monthOK(o.month)))s.overrides[p.id]={status:o.status,month:o.month||null};}return s;}
const signature=a=>I.progressCourse(I.effective(a),'schoolStatus');
function update(v,input,a){const s=restore(v),errors=[];s.enabled=input.enabled==='on';if(![1,2,3].includes(+input.spacing))errors.push('점검 간격은 1~3개월 중 선택해 주세요.');else s.spacing=+input.spacing;
 const actual=C.actual(I.effective(a),'school',{}),boundary=BOUNDARIES.find(b=>b.id===input.boundary);
 if(input.boundary&&(!boundary||boundary.stage!==actual?.stage))errors.push('현재 교과 과목에서 실제 마친 범위를 선택해 주세요.');
 if(errors.length)return{state:restore(v),errors};s.boundary=boundary?.id||null;s.signature=signature(a);
 for(const p of PAPERS){const status=input[p.id+'-status']||'auto',month=input[p.id+'-month'];if(!['auto','planned','done','skip'].includes(status)||month&&!monthOK(month)){errors.push(p.title+'의 상태·월을 확인해 주세요.');continue;}s.overrides[p.id]={status,month:month||null};}
 return{state:errors.length?restore(v):s,errors};
}
const rank=stage=>[...Array.from({length:12},(_,n)=>g.Planner.SEM(n+1)),'초등 계통 대수심화',...g.Planner.MID,...I.highSubjects].indexOf(stage);
const relative=(m,value)=>{const [y,n]=value.split('-').map(Number);return y*12+n-m.year*12-m.month;};
const stamp=(m,n)=>{const d=C.date(m,n);return d.year+'-'+String(d.month).padStart(2,'0');};
function model(m,a={},fields={},value){
 const s=restore(value),actual=C.actual(I.effective(a),'school',fields),deep=C.actual(I.effective(a),'deep',fields),boundary=s.signature===signature(a)?BOUNDARIES.find(b=>b.id===s.boundary&&b.stage===actual?.stage):null;
 const lane=m.lanes.find(l=>l.id==='school'),warnings=[];
 const endAt=(stage,step=0)=>{
  if(!actual)return null;
  if(actual.stage===stage&&step&&boundary&&boundary.step>=step)return 0;
  if(Object.hasOwn(m.highReadyAt||{},stage))return m.highReadyAt[stage];
  if(rank(actual.stage)>rank(stage)||actual.stage===stage&&actual.done)return 0;
  const b=lane?.blocks.find(b=>b.stage===stage&&!b.endClipped&&!b.continues);
  return b&&Number.isFinite(b.end)?Math.max(0,b.end):null;
 };
 const rows=PAPERS.map(p=>{const times=p.needs.map(([stage,step])=>endAt(stage,step));
  if(p.middle&&deep&&rank(deep.stage)<=rank('중3-2')){const b=m.lanes.find(l=>l.id==='deep')?.blocks.find(b=>b.stage==='중3-2'&&!b.endClipped&&!b.continues);if(deep.stage==='중3-2'&&deep.done)times.push(0);else times.push(b?.end??null);}
  const known=times.every(n=>n!==null),ready=known?Math.ceil(Math.max(0,...times)-1e-8):null;
  return{...p,ready,status:s.overrides[p.id]?.status||'auto',requested:s.overrides[p.id]?.month||null,currentUnits:!!(boundary&&p.needs.some(([stage,step])=>stage===boundary.stage&&step&&boundary.step>=step))};
 });
 // Start with the most advanced paper already supported by reported learning;
 // earlier papers remain selectable for an explicit review purpose.
 const firstReady=rows.reduce((n,p,i)=>p.ready===0&&relative(m,p.availableMonth)<=0?i:n,-1);let cursor=0;
 for(let i=0;i<rows.length;i++){
  const p=rows[i],release=Math.max(0,relative(m,p.availableMonth));p.start=null;p.end=null;p.suggested=null;p.reason='';
  if(p.status==='done'){p.reason='점검 완료로 기록';p.suggested=p.requested;continue;}
  const coveredSooner=p.ready!==null&&rows.slice(i+1).some(q=>q.ready!==null&&q.status!=='skip'&&Math.max(q.ready,Math.max(0,relative(m,q.availableMonth)))<=Math.max(p.ready,release));
  if(p.status==='skip'||p.status==='auto'&&!p.requested&&(i<firstReady||coveredSooner)){p.reason=p.status==='skip'?'이번 계획에서 제외':'같거나 더 이른 시점에 넓은 범위로 점검 · 필요하면 복습으로 선택';continue;}
  if(p.ready===null){p.reason='현재 교과·심화 또는 이 범위의 학습 종료월 확인 필요';continue;}
  const requested=p.requested?relative(m,p.requested):null,earliest=Math.max(p.ready,release),start=Math.max(earliest,cursor,requested??0);
  if(requested!==null&&requested<earliest)warnings.push(p.title+'의 지정 월보다 선수 범위 완료·기출 공개 시점이 늦어 '+stamp(m,start)+'로 조정했습니다.');
  p.start=start;p.end=start+1;p.suggested=stamp(m,start);p.reason=p.ready===0?'현재 배운 범위부터 확인':'선수 범위를 마치는 달 이후 확인';
  if(!p.currentUnits&&p.needs.some(([stage,step])=>step&&endAt(stage,step)>0))p.reason+=' · 세부 단원 미확인 시 과목 종료월 기준';
  cursor=start+s.spacing;
 }
 return{state:s,actual,boundary,rows,warnings,enabled:s.enabled,year:m.year,month:m.month};
}
function attach(m,a,fields,value){const plan=model(m,a,fields,value);if(!plan.enabled)return{...m,mockCheckPlan:plan};
 const blocks=plan.rows.filter(p=>p.start!==null).map(p=>({id:'mock-check-'+p.id,title:p.title,start:p.start,end:p.end,full:1,guide:'mock',paperId:p.id,tasks:p.scope+' · '+p.reason+'. 한 달 안에 기출 풀이→오답 원인 정리→새 문항 확인을 배치합니다. 전체 한 달을 시험 공부로 채우는 기간은 아닙니다.',books:[p.title,'현재 교재에서 필요한 단원 복습']}));
 return{...m,mockCheckPlan:plan,lanes:blocks.length?[...m.lanes,{id:'mockCheck',title:'진도에 맞춘 고등 기출 점검',current:'기출 시행월과 별도로 계산한 실제 풀이 일정',blocks}]:m.lanes,horizon:Math.max(m.horizon||1,...blocks.map(b=>b.end)),warnings:[...(m.warnings||[]),...plan.warnings],ready:!!blocks.length||m.ready};
}
function controls(m,a,v){const plan=m.mockCheckPlan||model(m,a,{},v),s=plan.state;
 return `<section class="learning-evidence mock-check-controls"><h3>현재 진도에 맞춘 기출 일정</h3><p>기출의 ‘3월·6월’은 시험이 시행됐던 달입니다. 아래 ‘풀어볼 월’은 아이의 교과·심화 완료 시점으로 계산한 연습 일정이며 실제 시험 응시일이 아닙니다.</p><form data-mock-schedule-form class="curriculum-form"><label><span><input name="enabled" type="checkbox"${s.enabled?' checked':''}> 고1·고2 기출 점검을 로드맵에 표시</span></label><label>점검 사이 간격<select name="spacing">${[1,2,3].map(n=>`<option value="${n}"${s.spacing===n?' selected':''}>최소 ${n}개월</option>`).join('')}</select></label>${plan.actual&&BOUNDARIES.some(b=>b.stage===plan.actual.stage)?`<label>${esc(plan.actual.stage)}에서 실제 마친 범위<select name="boundary"><option value="">세부 범위 미확인 · 과목 종료월 기준</option>${BOUNDARIES.filter(b=>b.stage===plan.actual.stage).map(b=>`<option value="${b.id}"${plan.boundary?.id===b.id?' selected':''}>${esc(b.title)}</option>`).join('')}</select></label>`:'<input name="boundary" type="hidden" value="">'}<p>교재의 완료 비율을 특정 단원 이수로 간주하지 않습니다. 위 범위를 확인하면 이미 배운 기출을 먼저 배치합니다.</p><details><summary>기출별 월·완료·제외 조정</summary>${plan.rows.map(p=>`<fieldset><legend>${esc(p.title)}</legend><p>${esc(p.scope)}</p>${paperLinks(p)}<p>${p.suggested?'풀어볼 월 '+esc(p.suggested):esc(p.reason)}</p><div class="curriculum-fields"><label>계획 상태<select name="${p.id}-status">${[['auto','현재 진도에서 자동 연결'],['planned','이 기출을 포함'],['done','점검 완료'],['skip','이번 계획에서 제외']].map(([id,t])=>`<option value="${id}"${p.status===id?' selected':''}>${t}</option>`).join('')}</select></label><label>풀어볼 월 직접 지정 · 선택<input name="${p.id}-month" type="month" min="2000-01" max="2100-12" value="${p.requested||''}"></label></div></fieldset>`).join('')}</details><p role="alert" data-mock-schedule-error></p><button type="submit">현재 진도로 기출 일정 다시 계산</button></form><p><a href="${SOURCE}" target="_blank" rel="noopener noreferrer">교육청의 2026 출제 범위 확인 (새 창)</a> · <a href="${esc(EBS)}" target="_blank" rel="noopener noreferrer">EBSi 범위 대조 (새 창)</a></p><p>2026년 기출 범위를 2026-11-05 확인했습니다. 2025년 이전의 다른 교육과정·시행월을 같은 범위로 대체하지 않습니다. 필요한 교과 일정이 아직 없으면 날짜를 만들지 않고 범위 확인 후 연결합니다.</p></section>`;
}
function render(m,view='map'){
 const p=m.mockCheckPlan;if(!p?.enabled)return '';
 const active=p.rows.filter(r=>r.start!==null),pending=p.rows.filter(r=>r.ready===null&&r.status!=='skip'&&r.status!=='done');
 return `<section class="learning-evidence mock-check-schedule" data-mock-check-view="${view}"><h3>진도에 맞춘 고1·고2 기출 일정</h3><p>현재 학년보다 실제 배운 범위와 학습 종료월로 정합니다. 기출 시행월과 아래 풀이 일정은 서로 다릅니다.</p>${p.warnings.length?`<p>${p.warnings.map(esc).join(' ')}</p>`:''}${active.length&&view==='table'?`<div class="curriculum-table-scroll"><table><caption>현재 진도에 맞춰 잡은 실제 기출 풀이 월</caption><thead><tr><th>풀어볼 월</th><th>기출</th><th>점검 범위</th></tr></thead><tbody>${active.map(r=>`<tr><th>${esc(C.date(m,r.start).label)}</th><td><button type="button" data-curriculum-block="mock-check-${r.id}">${esc(r.title)}</button>${paperLinks(r)}</td><td>${esc(r.scope)}</td></tr>`).join('')}</tbody></table></div>`:active.length?`<ul>${active.map(r=>`<li><button type="button" data-curriculum-block="mock-check-${r.id}"><strong>${esc(r.title)}</strong><span>풀어볼 월 · ${esc(C.date(m,r.start).label)}</span><small>${esc(r.scope)}</small></button>${paperLinks(r)}<button type="button" data-mock-check-record="${r.id}">풀고 결과 기록</button></li>`).join('')}</ul>`:'<p>현재 범위를 확인하면 풀이 월이 이어집니다.</p>'}${pending.length?`<details><summary>학습 범위·종료월 확인 뒤 연결 · ${pending.length}회</summary><ul>${pending.map(r=>`<li>${esc(r.title)} · ${esc(r.reason)}</li>`).join('')}</ul></details>`:''}<button type="button" data-learning-evidence-open="mock">기출 일정·기록 조정</button> <button type="button" data-learning-evidence-open="papers">연도별 기출 보기</button></section>`;
}
function prefill(id){const p=PAPERS.find(p=>p.id===id);return p?{exam:p.exam,level:p.level,scope:p.scope}:null;}
g.PlannerMockSchedule=Object.freeze({PAPERS,BOUNDARIES,SOURCE,resolvePaper,paperLinks,restore,update,model,attach,controls,render,prefill});
})(window);
