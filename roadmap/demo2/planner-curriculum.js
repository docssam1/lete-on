/* A selected core curriculum starts at the reported course, never a sample age.
 * All views share end-exclusive, relative-month blocks. Reference durations are
 * editable planning assumptions, not exam dates or promises of mastery.
 */
(function(global){
'use strict';
const I=global.PlannerIntake,P=global.Planner;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const round=n=>Math.round(n*1000)/1000;
const KMO=[
 {id:'foundation',title:'KMO 기초반',months:3,guide:'kmoFoundation',tier:0,areas:['integer','algebra','geometry','combinatorics'],tasks:'중등 심화의 핵심을 정리하고 경시 기초 지식과 풀이 방식을 익힙니다.',books:['지름길 중급 상','단계에 맞는 프린트 자료']},
 {id:'intro',title:'KMO 입문반',months:6,guide:'intro',tier:1,areas:['geometry','integer'],tasks:'기하·정수에 집중하며 경시 문제에서 조건을 연결하고 풀이를 설명합니다.',books:['CPG (Challenge Problems in Geometry)','평면기하의 아이디어','조합의 길잡이','마두식 정수론 (자료 표기)']},
 {id:'basic',title:'KMO 기본반',months:12,guide:'basic',tier:2,areas:['integer','algebra','geometry','combinatorics','sequences'],tasks:'영역별 기본서를 정리하고 문제 해결 전략을 익히며 KMO 1차 실전을 준비합니다.',books:['조합의 지름길','경시해법 시리즈','바이블 시리즈','지름길 중급 하','AMC·AIME 편집 자료']},
 {id:'advanced',title:'KMO 심화반',months:12,guide:'kmoDeep',tier:3,areas:['integer','algebra','geometry','combinatorics','sequences'],tasks:'영역별 심화를 정리하고 1차 고난도 문항과 증명 풀이에 집중합니다.',books:['IMTS·ARML 문제 자료','100 시리즈 (T. Andreescu)','지름길 고급 하','방정식과 부등식','winning solution (자료 표기)','모의고사 자료']},
 {id:'second',title:'KMO 2차 대비반',months:6,guide:'second',tier:3,areas:['integer','algebra','geometry','combinatorics','sequences'],tasks:'KMO 2차의 완결된 증명과 영재학교·과학고 심화 문제를 목표에 맞춰 준비합니다.',books:['통신강좌 시리즈','외국 문제 자료 (MOC·500제 등)','조합의 원리와 기법','PSS','이산수학','1400제']}
];
// Grouped from the user's subject slides. Tiers below are the planner's
// learning order, not an official syllabus or an all-books requirement.
const AREAS=[
 {id:'integer',title:'정수',groups:[{tier:0,title:'정수의 기본',items:['약수·배수·소수·배수 판정과 나눗셈','소인수분해, 약수의 개수와 합','유클리드 호제법과 최대공약수']},{tier:1,title:'나머지와 정수해',items:['합동식의 뜻과 기본 성질','인수분해·식 변형으로 부정방정식 풀기','기수법과 완전제곱수의 성질']},{tier:2,title:'정수론 확장',items:['페르마의 작은 정리·오일러의 정리','중국인의 나머지 정리·윌슨의 정리','정수의 분할과 특수한 소수의 예']},{tier:3,title:'산술함수·심화 해법',items:['오일러 φ 함수·최대정수함수·p 지수','잉여계·무한강하법·고차 부정방정식']}]},
 {id:'algebra',title:'대수',groups:[{tier:0,title:'식과 방정식',items:['인수분해·식 변형과 근·계수의 관계','대칭식·교대식, 기본 부등식']},{tier:1,title:'변형과 비교',items:['번분수·부분분수합·가비의 리','제곱근·산술·기하·조화평균 부등식']},{tier:2,title:'함수방정식·부등식',items:['정수값 다항식과 함수·그래프','변형·대입·치환, 미정계수법과 귀납법','코시·슈바르츠, 재배열·체비셰프 부등식']},{tier:3,title:'심화 부등식·삼각함수',items:['쉬르·젠센·횔더·민코프스키 부등식','삼각함수의 덧셈·배각·반각·합성','곱을 합·차로, 합·차를 곱으로 바꾸기']}]},
 {id:'geometry',title:'기하',groups:[{tier:0,title:'도형의 기본 관계',items:['삼각형의 오심·중점연결·피타고라스 정리','원주각·내접사각형과 넓이·길이']},{tier:1,title:'삼각형·원',items:['체바·메넬라우스·방멱의 정리','브리앙숑·톨레미·심슨의 정리','사인·코사인 정리와 보조선']},{tier:2,title:'연결과 변형',items:['중선·스튜어트, 반 아우벨·몰리의 정리','평행이동·회전·대칭, 일정한 값과 공통선·공선점','덮어씌우기, 존재·염색·극단성']},{tier:3,title:'기하 심화',items:['에르되시·모델·나폴레옹, 수족삼각형','오일러·카르노·브라마굽타·뫼비우스 관련 성질','데자르그·파스칼·나비의 정리','바리뇽·포이어바흐, 삼각형 넓이의 여러 표현']}]},
 {id:'combinatorics',title:'조합',groups:[{tier:0,title:'경우의 수',items:['합·곱의 법칙과 순열·조합','중복·누락 없이 경우 나누기']},{tier:1,title:'세기와 대응',items:['같은 것이 있는 순열, 중복순열·중복조합','집합의 분할과 대응 원리']},{tier:2,title:'조합의 핵심 원리',items:['포함·배제, 대칭성·극단성','비둘기집 원리와 불변량']},{tier:3,title:'분할·분배',items:['분할·분배와 블록 문제','제2종 스털링 수']}]},
 {id:'sequences',title:'수열·기타',groups:[{tier:2,title:'수열과 점화',items:['유계성·단조성·주기성','법에 따른 주기와 피보나치 수열']},{tier:3,title:'점화수열 해법',items:['부동점 방법·특성근법·소거법']}]}
];
const PERIODS=[['elemMonths','초등 교과 한 학기'],['bridgeMonths','초등 계통 대수 정리'],['midMonths','중등 교과 한 학기'],['highMonths','고등 교과 한 과목'],['deepMonths','중등 심화 한 학기'],...KMO.map(s=>[s.id+'Months',s.title])];
const validPeriod=n=>Number.isFinite(+n)&&+n>=.5&&+n<=24;
function restore(v){
 const s=v?.version===1?{...v,stage:({first:'basic',proof:'advanced'})[v.stage]||v.stage,periods:{...v.periods,...(v.periods?.firstMonths?{basicMonths:v.periods.firstMonths}:{}),...(v.periods?.proofMonths?{advancedMonths:v.periods.proofMonths}:{})}}:{};
 return {version:1,startMonth:/^(20\d\d|2100)-(0[1-9]|1[0-2])$/.test(s.startMonth||'')?s.startMonth:null,
  stage:['none',...KMO.map(x=>x.id),'complete'].includes(s.stage)?s.stage:'none',status:s.status==='done'?'done':'progress',
  done:Number.isFinite(s.done)&&s.done>=0?s.done:null,total:Number.isFinite(s.total)&&s.total>0?s.total:null,
  middleReady:['reported','done','unknown'].includes(s.middleReady)?s.middleReady:'reported',goal:s.goal==='first'?'first':'second',
  periods:Object.fromEntries(PERIODS.filter(([k])=>validPeriod(s.periods?.[k])).map(([k])=>[k,+s.periods[k]]))};
}
function update(v,values){
 const s=restore(v),errors=[];
 if(!/^(20\d\d|2100)-(0[1-9]|1[0-2])$/.test(values.startMonth||''))errors.push('시작월을 선택해 주세요.');
 const done=values.done===''?null:Number(values.done),total=values.total===''?null:Number(values.total);
 if(values.status!=='done'&&!['none','complete'].includes(values.stage)&&(done!==null||total!==null)&&(!Number.isInteger(done)||!Number.isInteger(total)||done<0||total<=0||total>9999||done>=total))errors.push('전체 분량은 1~9999의 정수로, 완료 분량은 전체보다 작은 정수로 입력해 주세요. 모두 끝냈다면 완료를 선택하세요.');
 for(const [k,title]of PERIODS)if(!validPeriod(values[k]))errors.push(title+' 기간을 0.5~24개월 사이로 입력해 주세요.');
 if(errors.length)return {state:s,errors};
 return {state:restore({...s,...values,done,total,periods:Object.fromEntries(PERIODS.map(([k])=>[k,+values[k]]))}),errors:[]};
}
function supports(path=[]){return path.some(id=>['contest','kmoBase','intro','kmoBasic','kmoDeep','second'].includes(id));}
function courses(){return [...Array.from({length:12},(_,n)=>({stage:P.SEM(n+1),type:'elem'})),{stage:'초등 계통 대수심화',type:'bridge'},...P.MID.map(stage=>({stage,type:'mid'})),...I.highSubjects.map(stage=>({stage,type:'high'}))];}
function actual(a,axis,fields){
 const school=axis==='school',book=a[school?'schoolBook':'deepBook'],status=school?'schoolStatus':'deepStatus';
 if(fields.pendingStatus?.[status]||!book||I.special(book)||!['progress','done'].includes(a[status]))return null;
 const stage=school&&a.schoolExact==='13'&&a.school==='advanced'?'초등 계통 대수심화':I.highBook(book)?a[school?'schoolHigh':'deepStage']:I.middleBook(book)?P.MID[+a[school?'schoolExact':'deepStage']-14]:a[school?'school':'deepStage'];
 const index=courses().findIndex(s=>s.stage===stage);if(index<0)return null;
 const p=I.progressValue(a,status),fraction=a[status]==='done'?1:p&&!p.estimated?p.done/p.total:0;
 return {stage,index,book,fraction,done:a[status]==='done',measured:!!p&&!p.estimated,status};
}
function defaults(fields){const b=P.BAND[fields.band]||P.BAND.B;return {elemMonths:b.elemS?3:Number(fields.speed)||2,bridgeMonths:4,midMonths:b.midLen,highMonths:6,deepMonths:b.midLen,...Object.fromEntries(KMO.map(x=>[x.id+'Months',x.months]))};}
function date(m,offset=0){const n=m.year*12+m.month-1+Math.floor(offset+1e-8);return {year:Math.floor(n/12),month:n%12+1,label:Math.floor(n/12)+'년 '+(n%12+1)+'월'};}
function period(m,b){const a=date(m,b.start),z=date(m,Math.max(b.start,b.end-.00001));return a.label+(a.label===z.label?'':' – '+(a.year===z.year?z.month+'월':z.label))+(b.continues?'까지 표시 · 이후 계속':'');}
function model(answers={},fields={},value){
 const a=I.effective(answers),s=restore(value),durations={...defaults(fields),...s.periods},all=courses(),common=all.findIndex(x=>x.stage==='공통수학2');
 const calendar=s.startMonth?s.startMonth.split('-').map(Number):[+fields.year||new Date().getFullYear(),+fields.mon||new Date().getMonth()+1];
 const m={state:s,year:calendar[0],month:calendar[1],lanes:[],warnings:[],durations,entry:null,complete:false,ready:false};
 const school=actual(a,'school',fields),deep=actual(a,'deep',fields),schoolLane={id:'school',title:'교과 핵심',current:school?I.summary(a,fields).find(x=>x.key==='school')?.text:'현재 교과 확인 필요',blocks:[]};
 let t=0;const endOf=new Map();
 if(school){
  for(let n=0;n<school.index+(school.done?1:0);n++)endOf.set(all[n].stage,0);
  for(let n=school.index+(school.done?1:0);n<all.length;n++){
   const c=all[n];if(c.type==='bridge'&&!(P.BAND[fields.band]||P.BAND.B).sys&&n!==school.index)continue;
   const full=durations[c.type==='bridge'?'bridgeMonths':c.type+'Months'],fraction=n===school.index?school.fraction:0,end=round(t+full*(1-fraction));
   schoolLane.blocks.push({id:'school-'+n,title:c.stage+' '+(n===school.index?school.book:c.type==='high'?'개념·유형':I.standardBook(fields.band||'B',c.type==='mid'?'mid':'elem','school')),stage:c.stage,type:c.type,start:t,end,full,fraction,guide:c.type==='high'?'high':c.type==='mid'?'middle':'elem',current:n===school.index});
   t=end;endOf.set(c.stage,t);
  }
  m.academicReady=endOf.get('공통수학2')??0;
  m.middleAcademicReady=endOf.get('중3-2')??0;
  if(!school.done&&!school.measured)m.warnings.push('현재 교과의 완료 분량을 입력하지 않아 해당 과정의 전체 기간을 잡았습니다. 현재 공부의 상태·완료 분량을 바꾸면 다시 계산합니다.');
 }else m.warnings.push('현재 교과·과목과 진행 상태를 확인하면 선수 개념과 다음 과정의 일정이 연결됩니다.');
 m.lanes.push(schoolLane);
 const deepLane={id:'deep',title:'심화 핵심',current:deep?I.summary(a,fields).find(x=>x.key==='deepBook')?.text:s.middleReady==='done'?'중등 대수·기하 심화 완료 확인':a.deepBook==='none'?'필요한 중등 심화부터 연결':'현재 심화 확인 필요',blocks:[]};
 const midStart=all.findIndex(x=>x.stage==='중1-1'),midEnd=all.findIndex(x=>x.stage==='중3-2');
 const applicationOnly=deep?.book==='RPM',reportedDeep=deep&&!applicationOnly;
 let deepReady=null;
 if(reportedDeep){
  let cursor=0;
  for(let n=deep.index+(deep.done?1:0);n<=(deep.index>midEnd?all.length-1:midEnd);n++){
   const c=all[n];if(c.type==='bridge')continue;
   const full=c.type==='elem'?2:c.type==='high'?durations.highMonths:durations.deepMonths,fraction=n===deep.index?deep.fraction:0,end=round(cursor+full*(1-fraction));
   deepLane.blocks.push({id:'deep-'+n,title:c.stage+' '+(n===deep.index?deep.book:c.type==='elem'?'최상위 S':c.type==='high'?'심화':'대수·기하 핵심 심화'),stage:c.stage,start:cursor,end,full,fraction,guide:c.type==='high'?'high':c.type==='elem'?'elemDeep':'middle',current:n===deep.index});cursor=end;
  }
  if(s.middleReady!=='unknown')deepReady=deep.index>midEnd?0:cursor;
 }else if(s.middleReady!=='unknown'&&applicationOnly&&school){
  let cursor=0;
  for(let n=midStart;n<=midEnd;n++){
   if(n<deep.index+(deep.done?1:0))continue;
   const c=all[n],full=durations.deepMonths,fraction=n===deep.index?deep.fraction:0,start=cursor,end=round(start+full*(1-fraction));
   deepLane.blocks.push({id:'deep-'+n,title:c.stage+' RPM · 응용',stage:c.stage,start,end,full,fraction,guide:'middle',current:n===deep.index});cursor=end;
  }
  deepReady=cursor;
 }
 if(a.deepBook==='none'){deepReady=0;deepLane.current='중등 심화 핵심은 KMO 기초반에서 정리';}
 if(s.middleReady==='done')deepReady=0;
 if(deepReady===null)m.warnings.push('중등 대수·기하 심화의 현재 범위를 확인해 기초반에서 보완할 부분을 골라 주세요.');
 if(applicationOnly)m.warnings.push('RPM 응용은 독립 진도로 이어갑니다. 경시를 시작할 때 중등 심화의 핵심을 기초반에서 따로 정리합니다.');
 if(reportedDeep&&!deep.done&&!deep.measured)m.warnings.push('현재 심화의 완료 분량이 없어 해당 과정의 전체 기간을 잡았습니다.');
 m.depthReady=deepReady;m.lanes.push(deepLane);
 const kmo={id:'kmo',title:'경시 핵심',current:s.stage==='none'?'KMO 시작 전':s.stage==='complete'?'KMO 과정 완료':KMO.find(x=>x.id===s.stage)?.title+' '+(s.status==='done'?'완료':'진행 중'),blocks:[]};
 const continuing=!['none','complete'].includes(s.stage),index=s.stage==='none'?0:KMO.findIndex(x=>x.id===s.stage)+(s.status==='done'?1:0),last=Math.max(s.goal==='first'?2:4,continuing&&s.status!=='done'?index:0);
 if(s.stage==='complete')m.complete=true;
 else if(continuing||school){
  let cursor=continuing?0:m.middleAcademicReady;m.entry=cursor;
  if(continuing&&(!school||deepReady===null||Math.max(m.academicReady||0,deepReady||0)>0))m.warnings.push('공부 중인 KMO는 현재 단계에서 이어갑니다. 함께 표시한 교과·심화의 필요한 개념도 담당 선생님과 확인하며 병행하세요.');
  for(let n=Math.max(0,index);n<=last;n++){
   if(n===1&&(s.stage==='none'||s.stage==='foundation')){
    if(!school){m.warnings.push('기초반 다음의 입문 시작월은 공통수학1·2 진도를 확인한 뒤 연결합니다.');break;}
    cursor=Math.max(cursor,m.academicReady);
   }
   const phase=KMO[n],current=continuing&&n===index&&s.status!=='done',fraction=current&&Number.isFinite(s.done)&&Number.isFinite(s.total)&&s.done<s.total?s.done/s.total:0,full=durations[phase.id+'Months'],end=round(cursor+full*(1-fraction));
   kmo.blocks.push({...phase,id:'kmo-'+phase.id,start:cursor,end,full,fraction,current});cursor=end;
  }
  if(!kmo.blocks.length&&index>last)m.complete=true;
 }else m.entry=null;
 m.introEntry=kmo.blocks.find(b=>b.id==='kmo-intro')?.start??null;m.lanes.push(kmo);
 if(global.PlannerStandard&&!fields.internationalCalendar){const parallel=global.PlannerStandard.model(a,fields,{calcDaysPerWeek:fields.calcDaysPerWeek});for(const lane of parallel.lanes.filter(l=>['thinking','calc'].includes(l.id)&&l.status==='known'&&l.blocks.length))m.lanes.push({...lane,title:lane.label,blocks:lane.blocks.map(b=>({...b,id:'parallel-'+b.id,guide:lane.id==='calc'?'calc':'thinking'}))});}
 m.horizon=Math.max(1,...m.lanes.flatMap(l=>l.blocks.map(b=>b.end)));m.ready=m.lanes.some(l=>l.blocks.length);
 m.assumptions='입력한 현재 과정·완료 분량과 과정별 기간으로 계산한 계획입니다. 앞선 교과를 공부 중이면 이전 교과를 이수한 흐름으로 연결하며, 낯선 문제 풀이로 필요한 개념을 확인합니다. 실제 시험 날짜·응시 자격·수상은 별도로 확인합니다.';
 return m;
}
function controls(m){const s=m.state;return `<form data-curriculum-form class="curriculum-form"><label>시작월<input name="startMonth" type="month" min="2000-01" max="2100-12" value="${m.year}-${String(m.month).padStart(2,'0')}" required></label><label>현재 KMO 단계<select name="stage">${[['none','아직 시작 전'],...KMO.map(x=>[x.id,x.title]),['complete','위 과정을 모두 마침']].map(([id,t])=>`<option value="${id}"${s.stage===id?' selected':''}>${t}</option>`).join('')}</select></label><label>단계 진행 상태<select name="status"><option value="progress"${s.status==='progress'?' selected':''}>진행 중</option><option value="done"${s.status==='done'?' selected':''}>완료 · 다음 단계부터</option></select></label><fieldset><legend>현재 KMO 단계에서 완료한 분량</legend><p>단원·회차·쪽수 중 같은 기준으로 입력하세요. 모르면 비워 두고 전체 기간으로 잡습니다.</p><div class="curriculum-fields"><label>전체<input name="total" type="number" min="1" max="9999" value="${s.total??''}"></label><label>완료<input name="done" type="number" min="0" max="9999" value="${s.done??''}"></label></div></fieldset><label>중등 대수·기하 심화<select name="middleReady">${[['reported','현재 심화 입력에서 이어서 계산'],['done','마쳤고 새 문제 풀이도 확인했어요'],['unknown','현재 범위·완료 여부 확인이 필요해요']].map(([id,t])=>`<option value="${id}"${s.middleReady===id?' selected':''}>${t}</option>`).join('')}</select></label><label>이번에 연결할 목표<select name="goal"><option value="first"${s.goal==='first'?' selected':''}>기본반 · 1차 실전까지</option><option value="second"${s.goal==='second'?' selected':''}>심화반·2차 대비까지</option></select></label><details><summary>과정별 기간 조정</summary><p>사진의 학년에 맞추기 위해 기간을 줄이지 않고 실제 학습량에 맞춰 정합니다. 각 영역은 별도 시간에 병행하는 계획입니다.</p><div class="curriculum-fields">${PERIODS.map(([key,title])=>`<label>${esc(title)} · 개월<input name="${key}" type="number" min="0.5" max="24" step="0.5" value="${m.durations[key]}" required></label>`).join('')}</div></details><p data-curriculum-error role="alert"></p><button type="submit" class="curriculum-apply">현재 진도와 기간으로 일정 다시 계산</button><button type="button" data-current-area="schoolCourse">현재 교과·완료 분량 수정</button><button type="button" data-current-area="deepCourse">현재 심화·완료 분량 수정</button></form>`;}
function header(m){return `<header class="curriculum-heading"><div><h3>${m.kind==='goal'?esc(m.goalTitle)+' · 현재 진도에서 이어지는 핵심 로드맵':'현재 진도에서 이어지는 핵심 로드맵'}</h3><p>${m.kind==='goal'?'계획 시작 · '+date(m,0).label:m.complete?'선택한 경시 과정 이후의 방향을 정합니다.':m.entry===null?'선수 개념 확인 후 KMO 시작월 계산':'KMO '+(m.state.stage==='none'?'기초 시작':'이어가기')+' · '+date(m,m.entry).label}${m.introEntry!==null?' · 입문 '+date(m,m.introEntry).label:''}</p></div><button type="button" ${m.kind==='goal'?'data-goal-curriculum-open':'data-curriculum-open'}>현재 단계·기간 조정</button></header>`;}
function windowRange(m,start){const s=Math.min(Math.max(0,Math.floor(+start||0)),Math.max(0,Math.ceil(m.horizon)-1));return {start:s,end:Math.min(s+24,Math.ceil(m.horizon))};}
function navigation(m,w){return `<div class="curriculum-window"><button type="button" data-curriculum-window="${Math.max(0,w.start-24)}"${w.start===0?' disabled':''}>이전 24개월</button><span>${date(m,w.start).label} – ${date(m,w.end-1).label}</span><button type="button" data-curriculum-window="${w.start+24}"${w.end>=Math.ceil(m.horizon)?' disabled':''}>다음 24개월</button>${m.entry!==null&&m.entry>=24?`<button type="button" data-curriculum-window="${Math.floor(m.entry/24)*24}">KMO 시작 구간 보기</button>`:''}</div>`;}
function render(m,view='map',start=0){
 const w=windowRange(m,start),notes=m.warnings.length?`<details class="curriculum-notes"><summary>확인하며 조정할 내용 · ${m.warnings.length}가지</summary><ul>${m.warnings.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`:'';
 let body='';
 if(view==='table')body=`${navigation(m,w)}<div class="curriculum-table-scroll" tabindex="0" role="region" aria-label="현재 진도에서 계산한 월별 과정"><table><caption>같은 계획의 월별 핵심 과정 병행</caption><thead><tr><th scope="col">월</th>${m.lanes.map(l=>`<th scope="col">${esc(l.title)}</th>`).join('')}</tr></thead><tbody>${Array.from({length:w.end-w.start},(_,i)=>i+w.start).map(n=>`<tr><th scope="row">${date(m,n).label}</th>${m.lanes.map(l=>`<td>${l.blocks.filter(b=>b.start<n+1-1e-8&&b.end>n+1e-8).map(b=>`<button type="button" data-curriculum-block="${b.id}">${esc(b.title)}</button>`).join(' / ')||'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 else if(view==='graph')body=navigation(m,w)+`<div class="curriculum-chart" tabindex="0" role="region" aria-label="현재 과정부터 이어지는 기간 그래프"><div class="curriculum-chart-inner"><div class="curriculum-chart-axis">${Array.from({length:w.end-w.start},(_,i)=>`<span>${date(m,w.start+i).month}월</span>`).join('')}</div>${m.lanes.map(l=>`<section><h4>${esc(l.title)}</h4><div class="curriculum-track">${l.blocks.filter(b=>b.start<w.end&&b.end>w.start).map(b=>`<button type="button" data-curriculum-block="${b.id}" style="left:${Math.max(0,b.start-w.start)/(w.end-w.start)*100}%;width:${(Math.min(b.end,w.end)-Math.max(b.start,w.start))/(w.end-w.start)*100}%"><strong>${esc(b.title)}</strong><small>${esc(period(m,b))}</small></button>`).join('')}</div></section>`).join('')}</div></div>`;
 else body=`<div class="curriculum-routes">${m.lanes.map(l=>`<section data-curriculum-lane="${l.id}"><h4>${esc(l.title)}</h4><p>${esc(l.current)}</p><ol>${l.blocks.map(b=>`<li><button type="button" data-curriculum-block="${b.id}"><strong>${esc(b.title)}</strong><span>${esc(period(m,b))}</span>${b.fraction?`<small>완료 ${Math.round(b.fraction*100)}% 반영 · 남은 ${round(b.end-b.start)}개월</small>`:''}</button></li>`).join('')||`<li>${l.id==='kmo'?m.complete?'선택한 단계 이후 방향 확인':'선수 개념 확인 후 연결':l.id==='deep'&&m.depthReady===0?'중등 심화 완료 확인':'현재 과정 확인 후 연결'}</li>`}</ol></section>`).join('')}</div>`;
 return `<section class="curriculum-plan" data-curriculum-view="${view}">${header(m)}${notes}${body}<p class="curriculum-assumption">${esc(m.assumptions)}</p><p>현재 사고력·연산·학교 과제는 각각의 진도로 병행합니다. 추가할 교재는 개념·심화·실전의 역할별로 필요한 것만 고릅니다.</p></section>`;
}
function detail(m,id){
 const b=m.lanes.flatMap(l=>l.blocks).find(x=>x.id===id);if(!b)return null;
 const materials=b.books?`<h3>이 단계의 교재 후보</h3><ul>${b.books.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p>필요한 역할의 교재를 고릅니다. 위 책을 모두 필수로 더하지 않습니다. 자료에 약자로 적힌 책은 실제 판본을 확인하세요.</p>`:'';
 const topics=b.areas?`<h3>필수 공부 목록</h3>${AREAS.filter(a=>b.areas.includes(a.id)).map(a=>`<details open><summary>${esc(a.title)}</summary>${a.groups.filter(g=>g.tier<=b.tier).map(g=>`<h4>${esc(g.title)}</h4><ul>${g.items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`).join('')}</details>`).join('')}<p>제공하신 영역별 자료를 단계에 맞게 묶은 학습 순서입니다. 배운 범위에서도 새 문제를 풀고 설명하는 모습을 확인합니다.</p>`:'';
 return {title:b.title,guide:b.guide,block:b,html:`<p>${esc(period(m,b))}${b.sustained?' · 꾸준히 병행':` · 남은 ${round(b.end-b.start)}개월`}</p><p>${esc(b.tasks||'개념과 대표 유형을 익히고, 낯선 문제에서 풀이의 이유를 설명합니다. 막힌 단원을 보완한 뒤 다음 과정을 연결합니다.')}</p>${b.fraction?`<p>현재 과정의 완료 ${Math.round(b.fraction*100)}%를 반영했습니다.</p>`:''}${materials}${topics}<button type="button" ${m.kind==='goal'?'data-goal-curriculum-open':'data-curriculum-open'}>현재 단계·기간 조정</button>`};
}
global.PlannerCurriculum=Object.freeze({KMO,AREAS,PERIODS,restore,update,supports,actual,defaults,model,date,period,render,controls,detail});
})(window);
