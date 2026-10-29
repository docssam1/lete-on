/* Science planning uses relative, start-inclusive/end-exclusive months.
 * Durations and branching rules: user corrections, 2026-10-24/25.
 * These are proposed dates, never evidence of actual science attainment.
 */
(function(global){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PREP_POLICY='영재원 대비는 기존 공부에 추가하는 별도 과정입니다. 교과·사고력·심화·연산과 기존 과학의 진도·진행 속도는 유지합니다.';
const MID2=122; // actual school grade 8, March, in the existing planner month coordinates
const ELEMENTARY_DEADLINE=105; // grade 6, October: final included study month in the current policy
const CEPHEID_SOURCE='https://sangsangedu.ac/home/무한상상교재/무한상상-세페이드시리즈/';
const HIGHTOP_SOURCE='https://www.bookdonga.com/event/event_view.donga?event_seq=293&pagenum=1';
const KPHO_SOURCE='https://newkpho.kps.or.kr/notice/notice_detail/361';
const TPL_SOURCE='https://kphe.kps.or.kr/notice/notice_detail/25';
const OPTIONS={scienceStage:['unknown','experiment','elementary','middle','depth','high'],elementaryScope:['upper','all'],experimentPlan:['none','alongside'],schoolGoal:['none','private','giftedSchool','scienceHigh','general'],physicsGoal:['none','consider'],physicsScope:['unknown','elementary','middle','high'],physicsMath:['unknown','algebra','calculus'],physicsTime:['unknown','available','limited'],bridgeBook:['julgi','highTop'],extension:['highTop','bridge','foundation'],highDeep:['none','3F'],route:['auto','physicsFirst','lifeFirst','otu'],elementaryBook:['auto','school','otu','reference'],prep:['concept','types','mock'],institute:['none','education','university'],region:['unknown','seoul','gyeonggi','busan','other'],evaluation:['unknown','written','course','interview'],otuStart:['auto','1-1','1-2','2-1','2-2','3-1','3-2']};
const TITLES={experiment:'실험과학',elementary:'초5·6 과학',physics:'중등 물리',chemistry:'중등 화학',life:'중등 생명과학',earth:'중등 지구과학'};
const REGIONS={unknown:'지역 선택 전',seoul:'서울',gyeonggi:'경기',busan:'부산',other:'다른 지역'};
const INSTITUTES={none:'준비 방향부터',education:'교육청 영재원',university:'대학부설 영재원'};
const EVALUATIONS={unknown:'평가 방식 확인 전',written:'지필·서술 평가',course:'선교육·과제 평가',interview:'면접·산출물 평가'};
const OTU_SOURCE='https://book.visang.com/books/info/6084';
function restore(value,enabled=false){
 const v=value?.version===1?value:{},s={version:1,enabled:!!enabled,scienceStage:'unknown',elementaryScope:'upper',experimentPlan:'none',schoolGoal:'none',physicsGoal:'none',physicsScope:'unknown',physicsMath:'unknown',physicsTime:'unknown',route:'auto',bridgeBook:'julgi',extension:'highTop',highDeep:'none',elementaryBook:'auto',prep:'concept',institute:'none',region:'unknown',evaluation:'unknown',otuStart:'auto',completed:[]};
 if(typeof v.enabled==='boolean')s.enabled=v.enabled;
 for(const key of Object.keys(OPTIONS))if(OPTIONS[key].includes(v[key]))s[key]=v[key];
 s.completed=Array.isArray(v.completed)?[...new Set(v.completed.filter(id=>Object.hasOwn(TITLES,id)))]:[];
 return s;
}
function choose(value,key,id){
 const s=restore(value);
 if(key==='enabled'&&['yes','no'].includes(id))return {...s,enabled:id==='yes'};
 if(key==='completed'&&Object.hasOwn(TITLES,id))return {...s,completed:s.completed.includes(id)?s.completed.filter(x=>x!==id):[...s.completed,id]};
 if(Object.hasOwn(OPTIONS,key)&&OPTIONS[key].includes(id))return {...s,[key]:id,...(['region','institute'].includes(key)&&s[key]!==id?{evaluation:'unknown'}:{})};
 return s;
}
function date(context,offset){
 if(!Number.isFinite(context?.now)||!Number.isFinite(offset))return {label:'수학 일정 확인 후 연결',month:null,grade:null};
 const m=Math.floor(context.now+offset),month=((m%12)+12)%12+1,g=Math.floor((m-2)/12)-2;
 const grade=g<=0?'유아':g<=6?'초'+g:g<=9?'중'+(g-6):'고'+(g-9);
 const year=Number.isInteger(context.year)?context.year+Math.floor(m/12)-Math.floor(context.now/12):null;
 return {label:(year?year+'년 ':'')+grade+' '+month+'월',month,grade,year,quarter:Math.floor((month-1)/3)+1};
}
function caseContext(m){
 // Current counselling plans may be customised; recorded senior histories are
 // not recast as a new curriculum or assigned new completion dates.
 const currentPlan=m.benchmarkScope==='individual-case';
 return {now:m.now,year:null,anchor:m.lanes?.find(l=>l.id==='school')?.blocks?.find(b=>b.stage==='중2-1')?.end??null,basis:'상담 사례의 중2-1 완료 계획 · 중등 학기별 3개월 배분 가정',...(currentPlan?{level:m.level,curriculumPolicy:2}:{})};
}
function normalContext(standard,timeline=null,fields={}){
 const now=standard.now,selected=timeline?.segments?.find(s=>s.stage==='중2-1'&&s.gain>0),anchor=selected&&Number.isFinite(selected.scenarioEnd)?selected.scenarioEnd-now:standard.scienceAnchor;
 return {now,year:Number(fields.year)||null,level:standard.level,curriculumPolicy:2,anchor:Number.isFinite(anchor)?anchor:null,basis:selected?'선택한 수학 중2-1 완료 계획':'표준 수학 중2-1 완료 계획'};
}
function institutePolicy(value,context={}){const state=restore(value),at=date(context,0),grade=Number(context.grade)||(/^초/.test(at.grade||'')?Number(at.grade.slice(1)):/^중/.test(at.grade||'')?Number(at.grade.slice(1))+6:/^고/.test(at.grade||'')?Number(at.grade.slice(1))+9:null),middle=grade!=null&&grade>=7;return {grade,middle,allowed:!middle||['giftedSchool','scienceHigh'].includes(state.schoolGoal),note:middle?'중등 영재원은 영재학교·과학고 대비 경로에서만 연결합니다.':'초등 영재원 대비는 별도 추가 과정입니다. 중학교 이후에는 영재학교·과학고 대비 경로에서만 영재원을 연결합니다.'};}
function model(value,context={}){
 const state=restore(value),policy=institutePolicy(state,context),known=Number.isFinite(context.now)&&Number.isFinite(context.anchor),threshold=Number.isFinite(context.now)?MID2-context.now:null;
 const late=known&&context.anchor>threshold,route=global.PlannerScienceCurriculum?global.PlannerScienceCurriculum.route(state,context,late):state.route==='auto'?(late?'lifeFirst':'physicsFirst'):state.route;
 const curriculum=global.PlannerScienceCurriculum?.policy(context);
 // Elementary science has its own school-age deadline. Protect its six-month
 // minimum; shorten/omit the separate experiment course before compressing it.
 const mk=(id,start,end,extra={})=>({id,title:TITLES[id],start,end,completed:state.completed.includes(id),...extra});
 let start=known?Math.max(0,route==='physicsFirst'?context.anchor:Math.min(context.anchor,threshold)):null;
 const requestedStart=start,deadline=known?ELEMENTARY_DEADLINE-context.now:null;
 const elementaryDone=state.completed.includes('elementary'),experimentDone=state.completed.includes('experiment');
 const upperElementary=known&&context.now>=86; // grade 5 March and later
 let phases=[],preparation=null;
 if(known){
  if(elementaryDone){
   if(experimentDone)phases.push(mk('experiment',null,null));
   phases.push(mk('elementary',null,null));
   preparation={mode:'completed',deadline,experimentMonths:0,deadlineMissed:false};
  }else{
   const basicMonths=state.elementaryScope==='all'?8:6;
   const end=curriculum?.active?basicMonths:Math.max(basicMonths,Math.min(start,deadline));
   const begin=curriculum?.active?0:upperElementary?0:Math.max(0,end-(state.elementaryScope==='all'?8:6));
   const experimentMonths=!upperElementary&&!experimentDone?Math.min(12,begin):0;
   if(experimentDone)phases.push(mk('experiment',null,null));
   else if(experimentMonths>0)phases.push(mk('experiment',begin-experimentMonths,begin,{months:experimentMonths}));
   phases.push(mk('elementary',begin,end,{months:end-begin,gradual:end-begin>6}));
   start=Math.max(start,end);
   const deadlineMissed=(curriculum?.active?end-1:end)>deadline;
   preparation={mode:deadlineMissed?'catchup':end-begin>6?'gradual':'standard',deadline,experimentMonths,deadlineMissed};
  }
 }
 // An explicit route survives later math changes. No duplicate automatic restart.
 if(known&&route==='otu'&&curriculum?.active)start=Math.max(0,phases.find(b=>b.id==='elementary'&&!b.completed)?.end??0);
 if(known&&route==='otu'&&!curriculum?.active){
  start=Math.ceil((context.now+start-2)/6)*6+2-context.now;
  const grade=Math.floor((context.now+start-2)/12)-2,desired=state.otuStart==='auto'?(grade<7?3:date(context,start).month):state.otuStart.endsWith('1')?3:9;
  if(date(context,start).month!==desired)start+=6;
 }
 const elementary=phases.find(b=>b.id==='elementary');
 if(elementary&&!elementary.completed&&elementary.end<start)phases.push({id:'review',title:'초5·6 개념·탐구 복습',start:elementary.end,end:start,months:start-elementary.end,completed:false,review:true});
 const order=route==='lifeFirst'?['life','earth','physics','chemistry']:['physics','chemistry','life','earth'];
 const next=route==='otu'?[]:order.map((id,i)=>mk(id,i===0?start:null,null,{order:i+1}));
 const semesters=['1-1','1-2','2-1','2-2','3-1','3-2'];
 const autoTerm='1-1'; // School month is not evidence that earlier Otu books were studied.
 const termIndex=semesters.indexOf(state.otuStart==='auto'?autoTerm:state.otuStart);
 const terms=known&&route==='otu'?semesters.slice(termIndex).map((stage,i)=>({id:'otu-'+stage,title:'오투 중학 과학 '+stage,stage,start:start+i*6,end:start+(i+1)*6,months:6,schoolTerm:true,completed:false})):[];
 const continuation=[...(state.extension==='foundation'?[{id:'cepheid1',title:'세페이드 1F · 물리·화학 기초'}]:[]),...(['bridge','foundation'].includes(state.extension)?[{id:'cepheid2',title:'세페이드 2F · 중등 심화'}]:[]),{id:'highTop',title:'고등 하이탑 · 분야별 개념'},...(state.highDeep==='3F'?[{id:'cepheid3',title:'세페이드 3F · 고등 심화',parallel:true}]:[])].map(b=>({...b,start:null,end:null,completed:false,continuation:true}));
 const blocks=[...phases,...next,...terms,...continuation],scheduled=blocks.filter(b=>Number.isFinite(b.start));
 const min=Math.min(0,known?start:0,...scheduled.filter(b=>!b.completed).map(b=>b.start));
 const max=Math.max(24,known?start+12:24,...terms.map(b=>b.end));
 const from=Math.floor(min),to=Math.ceil(max),months=known?Array.from({length:to-from},(_,i)=>({offset:from+i,...date(context,from+i)})):[];
 const prepBook={concept:'영재성검사·창의적 문제해결력 교재 · 기존 참고 자료',types:'맛있는 영재 수학·과학 · 기존 참고 자료',mock:'맛있는 영재 모의고사 · 기존 참고 자료'}[state.prep];
 const result={institutePolicy:policy,prepPlan:state.institute==='none'||!policy.allowed?null:{mode:'additional',preserveExistingPace:true,book:prepBook,start:null,end:null},goalPlan:goalPlan(state,policy.allowed),state,context,known,threshold,late,route,start,requestedStart,preparation,phases,next,terms,continuation,blocks,from,to,months,prepBook,institute:INSTITUTES[state.institute],region:REGIONS[state.region],evaluation:EVALUATIONS[state.evaluation],orderLabel:route==='otu'?'오투 · 학년·학기별':order.map(id=>TITLES[id].replace('중등 ','')).join(' → '),anchorLabel:date(context,context.anchor).label,startLabel:date(context,start).label};
 return global.PlannerScienceCurriculum?global.PlannerScienceCurriculum.apply(result):result;
}
function preparationNote(m){
 if(!m.known)return '현재 학년과 수학 일정을 확인해 초5·6 과학을 늦어도 초6 10월까지 마치도록 연결합니다. 초등 과학은 최소 6개월을 확보하고, 시간이 부족하면 별도 실험과학을 줄이거나 생략합니다.';
 if(m.preparation.mode==='completed')return m.preparation.scopeCheck?'확인한 초5·6 과학 이수는 유지합니다. 초등 전체 범위를 선택했으므로 앞 학년의 남은 개념·탐구를 확인합니다. 전체를 이수했다고 보거나 8개월을 다시 배정하지 않습니다. 중등 일정은 기존 참고 계획이며, 필요한 보완 범위를 확인한 뒤 조정합니다.':'확인한 초5·6 과학 이수 범위는 유지하고 중등 과학으로 연결합니다. 이미 공부한 과정을 다시 배정하지 않습니다.';
 const b=m.phases.find(x=>x.id==='elementary'),experiment=m.preparation.experimentMonths;
 const parallelExperiment=m.phases.find(x=>x.id==='experiment'&&x.parallel&&!x.completed);
 const experimentLead=parallelExperiment?'실험과학은 교과와 별도로 병행합니다. ':'';
 const scope=m.state.elementaryScope==='all'?'초등 과학 전체 범위':'초5·6 과학';
 if(m.curriculum&&m.state.elementaryScope==='all')return experimentLead+date(m.context,b.start).label+'부터 '+date(m.context,b.end-1).label+'까지 '+scope+'를 8개월에 걸쳐 공부하는 참고 계획입니다. 이미 배운 단원은 복습하고 처음 배우는 개념·탐구에 시간을 더 둡니다. '+(m.preparation.deadlineMissed?'초6 10월까지 남은 기간이 부족하면 지난 범위를 확인하고 실제 필요한 보완부터 정합니다.':'초6 10월까지 완료를 기준으로 다음 과정을 연결합니다.');
 return (parallelExperiment?experimentLead:experiment?`실험과학은 ${experiment}개월로 ${experiment<12?'줄이고':'두고'}, `:'별도 실험과학 과정 없이 ')+date(m.context,b.start).label+'부터 '+date(m.context,b.end-(m.curriculum?1:0)).label+'까지 초5·6 과학을 '+b.months+'개월에 걸쳐 '+(b.gradual?'천천히 ':'')+'공부합니다. '+(m.preparation.deadlineMissed?'초6 10월까지 마칠 시간이 부족해 초등 과학을 6개월 미만으로 압축하지 않고, 현재부터 보완한 뒤 중등 과정으로 연결합니다.':'초5·6 과학은 늦어도 초6 10월까지 마치는 계획입니다.')+(m.phases.some(x=>x.review)?' 이후 중등 과학 시작 전까지 배운 개념과 탐구를 복습합니다.':'');
}
// Advisory suggestions use selected actual study, never planned math dates or L.
// They are not official eligibility or admission thresholds.
function goalPlan(s,instituteAllowed=true){
 const targets=[];
 if(s.institute==='university'&&instituteAllowed)targets.push({id:'university',title:'대학부설 영재원',steps:['지원 학년·모집 분야 확인','요강에 맞춘 문제해결·탐구·설명','필요한 서류·서술·면접 준비'],note:'초등·중등 모집 과정에 맞춰 범위를 고릅니다. 고등 하이탑이나 3F 전체 이수를 공통 조건으로 두지 않습니다.'});
 if(['giftedSchool','scienceHigh'].includes(s.schoolGoal))targets.push({id:s.schoolGoal,title:s.schoolGoal==='giftedSchool'?'영재학교 진학 탐색':'과학고 진학 탐색',steps:['중등 개념·탐구 확인','세페이드 2F 중 필요한 단원','고등 하이탑 · 분야별 연결'],note:'낯선 자료의 조건을 해석하고 설명하는 힘을 함께 봅니다. 3F는 고등 개념과 필요한 분야만 병행합니다. 지원 학교·학년도별 전형을 별도로 확인합니다.'});
 let physics=null;
 if(s.physicsGoal==='consider'){
  const ready=s.physicsScope==='high'&&s.physicsMath!=='unknown'&&s.physicsTime==='available';
  const id=ready?'general':s.physicsScope==='unknown'?'check':s.physicsTime==='limited'?'balance':s.physicsScope==='high'?'tools':'bridge';
  const title={general:'일반물리 교육을 검토할 수 있는 단계',check:'현재 물리 풀이부터 확인',balance:'교과와 복습을 유지하며 심화부터',tools:'수학 도구와 공부 여유를 확인',bridge:'중등 물리 심화부터 연결'}[id];
  const steps=s.physicsTime==='limited'?['기존 교과·복습 유지','현재 물리의 필요한 단원 보완','시간 배분 후 올림피아드 다시 검토']:ready?['고등 물리 개념·서술 점검',s.physicsMath==='calculus'?'미적분 사용 일반물리 검토':'미적분 미사용 일반물리 검토','공식 강의·과제와 평가 준비']:s.physicsScope==='elementary'?['초등 실험·개념','중등 물리 · 식과 그래프','필요하면 1F 보완 → 2F 물리']:s.physicsScope==='middle'?['세페이드 2F 물리 · 필요한 단원','하이탑 물리 개념·적용','일반물리 준비 여부 다시 확인']:s.physicsScope==='high'?['고등 물리의 낯선 문제·서술','식·벡터·삼각비 등 수학 적용','기존 공부와 과제 시간 조정']:['현재 교재의 실제 풀이','식·그래프와 실험 결과 설명','다음 준비 단계 선택'];
  physics={id,title:s.physicsScope==='elementary'&&id==='bridge'?'초등 실험·개념에서 중등 물리로':title,ready,steps,note:ready?'선택한 실제 학습 상황을 바탕으로 한 상담 제안입니다. 수강 가능 여부나 선발 통과를 판정한 결과는 아닙니다. 해당 연도 모집요강의 학년·연령·과정·일정을 확인합니다.':'수학 중2-1 완료 예정일이나 교재를 끝낸 사실만으로 일반물리를 바로 권하지 않습니다. 현재 풀이·설명과 기존 공부를 유지할 여유를 함께 봅니다.'};
 }
 return {targets,physics};
}
function goalChoices(s){return `<details class="science-settings"${s.schoolGoal!=='none'||s.physicsGoal!=='none'?' open':''}><summary>진학 목표·물리 올림피아드 갈림길</summary><h4>고등학교 진학 방향도 살펴볼까요?</h4><div class="science-options">${[['none','아직 정하지 않기','현재 개념과 탐구를 충분히'],['private','자사고 목표','교과·심화와 학교 학습을 함께'],['general','일반고 상위권 목표','내신·응용·학평을 꾸준히'],['giftedSchool','영재학교를 생각하고 있어요','대학부설 영재원과 별도의 진학 목표'],['scienceHigh','과학고를 생각하고 있어요','지원 학교의 전형과 준비 범위 확인']].map(([id,t,sub])=>button('schoolGoal',id,t,sub,s.schoolGoal===id)).join('')}</div><h4>물리 올림피아드 준비도 살펴볼까요?</h4><div class="science-options">${button('physicsGoal','none','지금 공부에 집중하기','물리 심화는 이후에도 선택 가능',s.physicsGoal==='none')}${button('physicsGoal','consider','가능한 준비 과정을 살펴보기','현재 물리·수학 적용과 공부 여유로 연결',s.physicsGoal==='consider')}</div>${s.physicsGoal==='consider'?`<h4>현재 스스로 설명하며 푸는 물리 범위</h4><div class="science-options">${[['unknown','아직 확인하지 않았어요','계획상 진도와 실제 풀이를 구분'],['elementary','초등 과학·실험을 공부해요','현상과 관찰 결과를 설명'],['middle','중등 물리 문제를 풀어요','비례·식·그래프로 현상 설명'],['high','고등 물리 개념을 적용해요','배운 범위의 낯선 문제와 서술도 확인']].map(([id,t,sub])=>button('physicsScope',id,t,sub,s.physicsScope===id)).join('')}</div><h4>물리 문제에서 쓰는 수학은 어떤가요?</h4><div class="science-options">${[['unknown','실제 적용은 확인 전','수학 교재 진도만으로 판단하지 않기'],['algebra','식·벡터·삼각비 등을 적용해요','미적분을 사용하지 않는 과정부터 검토'],['calculus','미분·적분도 물리에 적용해요','미적분을 사용하는 과정도 검토']].map(([id,t,sub])=>button('physicsMath',id,t,sub,s.physicsMath===id)).join('')}</div><h4>기존 공부를 유지하며 시간을 낼 수 있나요?</h4><div class="science-options">${[['unknown','아직 시간 배분을 확인하지 않았어요'],['available','교과·복습과 함께 과제를 할 여유가 있어요'],['limited','지금은 공부 부담을 늘리기 어려워요']].map(([id,t])=>button('physicsTime',id,t,'',s.physicsTime===id)).join('')}</div>`:''}</details>`;}
function goalView(m){const {targets,physics}=m.goalPlan;if(!targets.length&&!physics)return '';return `<section class="science-goals" aria-label="선택한 목표와 다음 준비"><header><small>선택한 목표에 맞춰</small><h4>현재 공부에서 다음 준비로</h4></header>${targets.map(t=>`<article><h5>${esc(t.title)}</h5><ol>${t.steps.map(x=>'<li>'+esc(x)+'</li>').join('')}</ol><p>${esc(t.note)}</p></article>`).join('')}${physics?`<article class="science-physics"><h5>물리 올림피아드 · ${esc(physics.title)}</h5><ol>${physics.steps.map(x=>'<li>'+esc(x)+'</li>').join('')}</ol><p>${esc(physics.note)}</p><details><summary>공부 방법과 물리대회·올림피아드의 차이</summary><p>그림·조건·단위와 법칙을 고르고, 그래프와 계산 결과의 의미를 설명합니다. 실험의 측정·오차와 예상이 다른 이유도 함께 다룹니다. 낯선 문제를 다시 풀고 수업 과제를 소화할 수 있는지 살펴봅니다.</p><p>한국물리학회 물리대회(TPL)는 학습 수준을 확인·보완하는 선택지입니다. 물리 올림피아드 일반물리 통신교육 및 이후 선발과는 별개이며, TPL 응시·수상을 필수 선행 조건으로 두지 않습니다.</p><p>일반물리는 미적분 사용·미사용 과정으로 나뉩니다. 세페이드·하이탑은 앞 단계 개념 연결에 활용하며, 일반물리 교재는 선택한 공식 과정의 지정·권장 자료를 확인합니다. 학부모 선택만으로 수강 자격이나 완료 개월 수를 확정하지 않습니다.</p><a href="${KPHO_SOURCE}" target="_blank" rel="noopener">한국물리학회 일반물리 교육 안내 · 2026 참고</a><a href="${TPL_SOURCE}" target="_blank" rel="noopener">물리대회와 중학생 물리대회 관계 · 공식 FAQ</a></details></article>`:''}${targets.some(t=>t.id!=='university')&&m.state.extension==='highTop'?`<div class="science-options">${button('extension','bridge',m.curriculum?'심화 브릿지 6개월을 계획에 추가':'세페이드 2F 연결을 계획에 반영','현재 수학·과학 날짜와 이수 기록은 유지')}</div>`:''}</section>`;}
function button(key,id,title,summary='',on=false){return `<button type="button" data-science-kind="${key}" data-science-value="${id}" aria-pressed="${on}"><strong>${esc(title)}</strong>${summary?`<small>${esc(summary)}</small>`:''}</button>`;}
function root(value,caseMode=false,active=false){const s=restore(value);return `<button type="button" class="case-route-root science-entry" data-science-open aria-pressed="${active}"${caseMode?' data-science-case':''}><span class="case-route-symbol" aria-hidden="true">◇</span><span><strong>과학 공부 이어가기</strong><small>초5·6 과학 → 중등 과학 · 현재 시점에 맞춰</small></span><span aria-hidden="true">→</span></button>`;}
function choices(value,context){
 const m=model(value,context),s=m.state;
 return `<section class="science-choices" aria-label="과학 과정과 영재원 준비 선택"><div data-science-step="depth">${m.curriculum?global.PlannerScienceCurriculum.choices(m,button):'<p class="science-note">'+esc(preparationNote(m))+'</p>'}</div><div data-science-step="route"><h3>과학 공부 흐름을 선택해 주세요.</h3><div class="science-options">${button('route','auto','현재 기준의 표준 과정',m.curriculum?.middle?'학교 과학·내신 + 수학에 맞춘 선행':m.curriculum?.system?'L6까지 · 줄기과학 계통별':'L7부터 · 오투 학기별',s.route==='auto')}${button('route','physicsFirst','물리부터 계통별로','수학 중2-1과 초등 기본 이수 후 · 줄기과학',s.route==='physicsFirst')}${button('route','lifeFirst','생명·지구부터 계통별로','필요한 수학을 준비하며 기본 개념 연결',s.route==='lifeFirst')}${button('route','otu','오투로 학년·학기별','중1-1부터 선택한 범위를 순서대로',s.route==='otu')}</div>${m.route==='otu'?`<details class="science-settings" open><summary>오투 시작 범위</summary><p>학년·시작 월만으로 이전 권을 이수했다고 판단하지 않습니다.</p><div class="science-options">${OPTIONS.otuStart.map(x=>button('otuStart',x,x==='auto'?'처음부터 · 중1-1':'중'+x+' 과학 · 학기별 기본','오투 · 이미 마친 권 다음부터 선택',s.otuStart===x)).join('')}</div></details>`:''}</div><div data-science-step="depth">${goalChoices(s)}<details class="science-settings"><summary>기본 이후 심화 과정 선택</summary><div class="science-options">${button('extension','highTop','표준 과정 유지','계통별은 브릿지 6개월과 하이탑 반복 · 학기별은 기본 우선',s.extension==='highTop')}${button('extension','bridge','학기별 기본 뒤에도 브릿지 추가','중등 기본 이후 심화 브릿지 전체 6개월 → 하이탑 반복',s.extension==='bridge')}${button('extension','foundation','목표에 따른 추가 심화 검토','기본·브릿지 뒤 영과고 목표의 세페이드 선택 경로',s.extension==='foundation')}</div><p>중등 기본 이수와 심화 반복을 먼저 확인합니다. 세페이드와 고등 과학은 모든 학생의 공통 필수로 추가하지 않습니다.</p></details>${m.curriculum&&(['giftedSchool','scienceHigh'].includes(s.schoolGoal)||s.physicsGoal==='consider')?`<details class="science-settings"><summary>고등 개념 이후의 추가 심화 선택</summary><p>중등 기본·심화 브릿지·하이탑 반복을 먼저 확인합니다. 고등 과학의 개념을 배우게 될 때 필요한 분야의 추가 심화를 고릅니다.</p><div class="science-options">${button('highDeep','none','지금 기본·심화 반복에 집중','고등 심화는 이후 검토',s.highDeep==='none')}${button('highDeep','3F','고등 개념 이후 세페이드 3F 검토','이후 선택으로 유지 · 기본을 건너뛰거나 시작 월을 확정하지 않음',s.highDeep==='3F')}</div></details>`:''}</div><div data-science-step="current">${global.PlannerScienceLevels?global.PlannerScienceLevels.choices(m,button):''}<details class="science-settings"><summary>초등 과학 범위·교재 조정</summary><h4>지금 이어갈 초등 과학 범위</h4><div class="science-options">${button('elementaryScope','upper','초5·6 과학을 이어갈게요','기본 6개월 · 이미 배운 앞 범위를 바탕으로',s.elementaryScope==='upper')}${button('elementaryScope','all','초등 전체 범위를 정리할게요','기존 설계표의 8개월 참고 과정',s.elementaryScope==='all')}</div><h4>실험과학 병행</h4><div class="science-options">${button('experimentPlan','none','교과의 탐구와 실험을 함께','별도 실험과학 수업 추가 없음',s.experimentPlan==='none')}${!m.curriculum?.middle&&m.curriculum?.grade<5?button('experimentPlan','alongside','실험과학 수업도 병행','1년 참고 과정 · 교과 진도와 별도 행으로 표시',s.experimentPlan==='alongside'):'<p>초5 이상은 교과 개념과 해당 단원의 탐구를 우선합니다.</p>'}</div><h4>기본 교재</h4><div class="science-options">${button('elementaryBook','auto','현재 기준의 기본 교재','계통별은 줄기과학 · 학기별은 오투',s.elementaryBook==='auto')}${button('elementaryBook','school','학교 과학 교재·수업 자료','현재 자료와 목차를 중심으로',s.elementaryBook==='school')}${button('elementaryBook','otu','오투 초등 과학 5·6학년','각 학년·학기와 판본을 맞춰 선택',s.elementaryBook==='otu')}${button('elementaryBook','reference','최상위 줄기과학 · 참고 자료','기존 자료의 교재명 · 판본·범위 확인 후 선택',s.elementaryBook==='reference')}</div><p class="science-note">과학 문제 유형 연습 자료로 안쌤 과학100제도 참고할 수 있습니다. 현재 단원·판본·필요한 범위를 확인하며 과학 진도 교재 전체를 대신하거나 전권을 자동 추가하지 않습니다.</p></details><details class="science-settings"><summary>이미 공부한 과학 범위 유지</summary><p>확인한 이수 범위만 선택합니다. 완료한 과정은 반복 배정하지 않습니다. 공부 중인 과정은 완료로 고르지 않아도 괜찮습니다.</p><div class="science-options">${Object.entries(TITLES).map(([id,title])=>button('completed',id,title,s.completed.includes(id)?'이수 범위로 유지':'완료했다면 선택',s.completed.includes(id))).join('')}</div></details></div><div data-science-step="gifted"><details class="science-settings"${s.institute!=='none'?' open':''}><summary>영재원 대비</summary><p class="science-note">${esc(PREP_POLICY)}</p><p class="science-note">${esc(m.institutePolicy.note)}</p>${m.institutePolicy.allowed?`<div class="science-options">${Object.entries(INSTITUTES).map(([id,t])=>button('institute',id,t,'',s.institute===id)).join('')}</div>${s.institute!=='none'?`<h4>지원 지역</h4><div class="science-options science-options-small">${Object.entries(REGIONS).filter(([id])=>id!=='unknown').map(([id,t])=>button('region',id,t,'',s.region===id)).join('')}</div><p class="science-note">지역·기관·지원 학년도 요강에서 지원 학년과 평가 방식을 확인합니다.</p><h4>요강에서 확인한 평가 방식</h4><div class="science-options">${Object.entries(EVALUATIONS).filter(([id])=>id!=='unknown').map(([id,t])=>button('evaluation',id,t,'',s.evaluation===id)).join('')}</div><h4>영재원 대비 교재</h4><p class="science-note">준비 목적에 맞는 교재를 고릅니다. 과학 진도 교재와는 별개입니다. 지원 학년·모집 분야·평가 방식에 맞는 권으로 준비해 주세요.</p><div class="science-options">${[['concept','영재성·창의적 문제해결력','영재성검사·창의적 문제해결력 교재'],['types','수학·과학 문제 유형과 자료 해석','맛있는 영재 수학·과학'],['mock','서술·실전 연습','맛있는 영재 모의고사']].map(([id,t,sub])=>button('prep',id,t,sub,s.prep===id)).join('')}</div>`:''}`:'<button type="button" data-school-goal-open>진학 목표 비교·선택</button>'}</details></div></section>`;
}
function phaseText(m,b){
 if(b.completed)return '기존 이수 범위 · 새 일정 배정 없음';
 if(!Number.isFinite(b.start))return '앞 과정 확인 후 연결 · 기간 미정';
 const from=date(m.context,b.start).label,to=Number.isFinite(b.end)?date(m.context,b.end-(m.curriculum?1:0)).label:null;
 return from+(to?' → '+to:b.repeat?' 시작 · 반복 완료 월은 학습 후 조정':' 시작 · 분야별 기간 미정')+(Number.isFinite(b.end)&&b.end<=0?' · 표준 계획상 이전 구간 · 이수 확인 필요':b.start<0?' · 표준 계획상 이전 시작 · 이수 확인 필요':'');
}
function guidance(m,id){
 const b=m.blocks.find(x=>x.id===id);if(!b)return null;
 if(m.curriculum){const detail=global.PlannerScienceCurriculum.guidance(m,b);if(detail)return detail;}
 let book,method;
 if(b.continuation){
  book=b.title;
  method=id==='cepheid1'?'중등 물리·화학 기초 개념을 정리하고 창의 문제와 설명 과제로 적용합니다. 1F의 구성은 물리·화학 상·하이며 생명·지구까지 포함한 중등 전 영역 과정으로 표시하지 않습니다.':id==='cepheid2'?'중등 물리·화학·생명·지구의 개념을 심화·창의 문제와 연결합니다. 자료의 조건을 읽고 풀이와 실험 결과의 근거를 설명합니다. 이미 익힌 단원은 중복 분량을 조정합니다.':id==='cepheid3'?'출판사가 고등 과학Ⅰ의 기초·심화로 안내하는 단계입니다. 고등 하이탑에서 배우는 관련 개념과 필요한 분야를 연결해 병행하며, 현행 교육과정의 과목명·범위와 실제 판본 목차를 대조합니다.':'선택한 분야의 고등 하이탑에서 개념의 관계와 문제 적용을 이어갑니다. 물리의 식·그래프 등 필요한 수학을 함께 확인하고, 중등에서 익힌 부분과 새 개념을 나누어 설명합니다.';
  return {title:b.title,html:'<div class="science-detail"><p>중등 이후 연결 방향 · 시작 시기와 분야별 기간은 실제 이수 범위 확인 후 결정</p><h3>'+esc(book)+'</h3><p>'+esc(method)+'</p><p>영재학교·과학고 준비를 고려하는 선택 경로입니다. 교재 이수와 지원 자격·합격 판단은 구분합니다.</p><a href="'+(id==='highTop'?HIGHTOP_SOURCE:CEPHEID_SOURCE)+'" target="_blank" rel="noopener">출판사 단계·교재 안내</a></div>'};
 }
 if(id==='experiment'){book='현재 실험과학 수업·기관의 교재와 실험 기록';method='예상한 결과, 바꿀 조건과 같게 둘 조건, 관찰·측정 결과를 구분합니다. 표·그래프로 정리하고 예상과 다른 이유를 설명하며, 교과 개념과 연결합니다. 수업 자료와 실제 실험 경험을 함께 확인합니다.';}
 else if(id==='elementary'){book=m.state.elementaryBook==='otu'?'오투 초등 과학 5·6학년 · 학기와 판본 확인':m.state.elementaryBook==='reference'?'최상위 줄기과학 · 기존 자료의 판본·대상 범위 확인':'학교 과학 교재·수업 자료 · 초5·6 범위';method='초5·6 과학의 개념과 용어를 익히고 실험·자료 해석 문제에서 근거를 설명합니다. '+(b.gradual?'현재 계획은 '+b.months+'개월에 걸쳐 천천히 진행합니다. ':'초5·6 전체 범위에 최소 6개월을 확보합니다. ')+'각 학년·학기의 개념과 탐구를 확인하며, 각 권을 같은 속도로 끝내도록 정한 뜻은 아닙니다.';}
 else if(b.review){book='초5·6 과학에서 공부한 교재와 탐구 기록';method='새 진도를 자동으로 추가하지 않고, 배운 개념과 용어를 다시 설명하고 실험·자료 해석 문제를 복습합니다. 중등 과학으로 넘어가기 전 필요한 부분을 확인합니다.';}
 else if(b.schoolTerm){book=b.title+' · 학교 적용 교육과정·학기 확인';method='학교 학기별 개념과 탐구를 공부하고 자료 해석·문제 적용·오류 재풀이를 이어갑니다. 표시한 6개월은 학기별 범위 배분이며 책 한 권의 숙달을 예측한 기간이 아닙니다.';}
 else{book='현재 쓰는 '+b.title+' 분야별 교재·수업 자료';method='분야의 개념을 그림·표·자료와 연결합니다. '+(id==='physics'?'비례 관계·식·그래프에서 사용하는 수학을 함께 확인합니다. ':'현상의 조건과 근거를 설명하고 다른 자료에 적용합니다. ')+'분야별 이수 기간과 다음 교재는 실제 풀이와 수업 범위에 맞춰 정합니다.';}
 return {title:b.title,html:`<div class="science-detail"><p>${esc(phaseText(m,b))}</p><h3>${esc(book)}</h3><p>${esc(method)}</p><p>${esc(m.context.basis||'선택한 수학 계획')}을 기준으로 역산한 과학 계획입니다. 실제 이수 여부는 별도로 확인합니다.</p>${b.schoolTerm||m.state.elementaryBook==='otu'?'<a href="'+OTU_SOURCE+'" target="_blank" rel="noopener">오투 중2-1 공식 안내·판본 예시</a>':''}</div>`};
}
function extension(m){if(m.curriculum)return `<section class="science-extension"><h4>기본에서 심화로 이어가는 과정</h4><ol>${m.continuation.map(b=>`<li><button type="button" data-science-block="${b.id}"><small>${esc(b.courseMethod||'이후 선택')}</small><strong>${esc(b.title)}</strong><span>${esc(b.material||'현재 기본과 심화 이수 후 검토')}</span><span>${esc(phaseText(m,b))}</span></button></li>`).join('')}</ol>${!m.continuation.length?'<p>오투의 학년·학기별 기본을 먼저 이어갑니다. 심화 브릿지는 기본 이수 후 필요할 때 별도로 선택합니다.</p>':'<p>심화 브릿지는 선택한 분야 전체 6개월입니다. 하이탑은 중등 해당 분야를 반복하며, 기본 없이 고등 과정으로 바로 넘어가지 않습니다.</p>'}</section>`;return `<section class="science-extension" aria-label="중등 심화와 고등 하이탑 연결"><header><small>중등 다음의 공부</small><h4>중등 심화에서 고등 개념으로</h4></header><ol>${m.continuation.map(b=>`<li><button type="button" data-science-block="${b.id}"><small>${b.parallel?'하이탑과 필요한 분야 병행':b.id==='highTop'?'고등 개념':b.id==='cepheid1'?'물리·화학 기초':'중등 4영역 심화'}</small><strong>${esc(b.title)}</strong></button></li>`).join('')}</ol><p>이후 시작 시점·분야별 기간은 실제 과학 이수 범위를 보고 연결합니다.</p><a href="${CEPHEID_SOURCE}" target="_blank" rel="noopener">세페이드 1F·2F·3F 출판사 안내</a></section>`;}
function gifted(m){if(m.state.institute==='none')return '';if(!m.institutePolicy.allowed)return '<aside class="science-gifted"><strong>중등 영재원 연결 기준</strong><p>'+esc(m.institutePolicy.note)+'</p><p>기존 공부와 선택한 과학 과정은 유지합니다.</p></aside>';return `<aside class="science-gifted"><span>영재원 대비</span><strong>${esc(m.institute)} · ${esc(m.region)}</strong><p>${esc(PREP_POLICY)}</p><p>${esc(m.institutePolicy.note)}</p><p>${esc(m.evaluation)} · ${esc(m.prepBook)}</p><p>${m.state.evaluation==='interview'?'실제 탐구의 질문·시도·수정·결과와 본인의 역할을 설명하고, 제출 가능한 자료·분량을 해당 요강에서 확인합니다.':m.state.evaluation==='course'?'선교육의 개념·과제를 실제로 수행하고 과정과 이유를 설명하는 준비를 병행합니다.':m.state.evaluation==='written'?'개념·자료 해석·풀이 근거를 서술하며 실전 연습을 더합니다.':'해당 기관 요강에서 평가 방식을 확인한 뒤 필요한 준비를 선택합니다.'}</p></aside>`;}
function timeline(m){
 if(!m.known&&!m.schoolTerms?.length)return '<p class="science-note">'+esc(preparationNote(m))+'</p>';
 const n=m.to-m.from,rows=m.curriculum?global.PlannerScienceCurriculum.rows(m):[['실험과학',m.phases.filter(b=>b.id==='experiment')],['초등 과학',m.phases.filter(b=>b.id==='elementary'||b.review)],['중등 과학',m.terms.length?m.terms:m.next]],groups=[];
 for(const d of m.months){const title=(d.year?d.year+'년 ':'')+d.grade+' '+d.quarter+'분기';if(groups.at(-1)?.title===title)groups.at(-1).count++;else groups.push({title,start:d.offset-m.from,count:1});}
 return `<div class="science-timeline-scroll" tabindex="0" role="region" aria-label="과학 월별 가로 과정표"><div class="science-timeline" style="--science-months:${n}"><div class="science-quarters">${groups.map(g=>`<span style="grid-column:${g.start+1}/span ${g.count}">${esc(g.title)}</span>`).join('')}</div><div class="science-months">${m.months.map(d=>`<span class="${d.offset<0?'is-prior':''}"><small>${esc(d.grade)}</small><b>${d.month}월</b></span>`).join('')}</div>${rows.filter(([,blocks])=>blocks.length).map(([label,blocks])=>`<div class="science-lane science-tone-${label==='실험과학'?0:label==='초등 과학'?1:2}"><header>${label}</header><div class="science-track">${blocks.filter(b=>Number.isFinite(b.start)&&!b.completed).map((b,i)=>`<button type="button" data-science-block="${b.id}" class="${b.end==null?'is-open':''} ${b.schoolStudy?'is-school':''}" style="left:${(b.start-m.from)/n*100}%;width:${((b.end??m.to)-b.start)/n*100}%;--science-course:${i%2}"><strong>${esc(m.curriculum&&b.review?'개념·탐구 복습':b.title)}</strong>${b.material?'<span class="science-material">'+esc(b.schoolStudy?'학교 교과서·수업 자료':b.material)+'</span>':''}<small>${b.repeat?'반복 학습 · 완료 월은 조정':b.schoolTerm?'학기별 범위 배분':b.months?b.months+'개월'+(b.gradual?' · 천천히':b.review?' · 복습':' 계획'):'시작 이후 기간 미정'}</small></button>`).join('')}${blocks.every(b=>b.completed)?'<span class="science-kept">기존 이수 범위 유지 · 중복 배정 없음</span>':!blocks.some(b=>Number.isFinite(b.start)&&!b.completed)?'<span class="science-kept">다음 분야의 시작 시기를 확인해 연결</span>':''}</div></div>`).join('')}</div></div>`;
}
function render(value,context,view='map'){
 const m=model(value,context);if(!m.state.enabled)return '';
 const chain=[...m.phases,...(m.terms.length?m.terms:m.next),...(m.curriculum?m.continuation.filter(b=>b.bridge||b.repeat):[])];
 const levelView=global.PlannerScienceLevels?global.PlannerScienceLevels.render(m):'';
 const head=`<header class="science-heading"><div><small>학년과 수학 진도에 맞춘 과학 과정</small><h3>과학 공부</h3></div><button type="button" data-science-open>과학 갈림길 조정 ↗</button></header>`;
 const note=`<p class="science-note">${esc(m.context.basis||'수학 계획 확인 후 연결')} · ${m.known?'중등 과학 '+m.startLabel+' 시작':'시점 확인 전'}${m.late?' · 실제 중2에서 분야별／학기별 갈림길':''}</p><p class="science-route-label">${esc(m.orderLabel)}</p>${m.curriculum?'<p class="science-note">'+esc(global.PlannerScienceCurriculum.label(m))+'</p>':''}<p class="science-note">${esc(preparationNote(m))}</p>`;
 if(view==='graph'&&m.curriculum)return `<section class="science-plan">${head}${levelView}${note}${m.known||m.schoolTerms?.length?global.PlannerScienceCurriculum.graph(m):''}${timeline(m)}${goalView(m)}${extension(m)}${gifted(m)}</section>`;
 if(view==='graph'){
  const from=m.from,to=m.to,n=to-from,x=v=>70+(v-from)/n*870;
  return `<section class="science-plan">${head}${levelView}${note}${m.known?`<div class="science-chart" tabindex="0" role="region" aria-label="과학 역산 기간과 수학 완료 기준"><svg viewBox="0 0 1000 245" role="img" aria-label="초등 과학의 완료 시기와 중등 과학 시작을 비교"><line x1="70" y1="190" x2="940" y2="190" stroke="#dbd2e1"/>${m.phases.filter(b=>!b.completed).map((b,i)=>`<rect x="${x(b.start)}" y="${60+i*40}" width="${(b.end-b.start)/n*870}" height="34" rx="5" fill="${b.id==='experiment'?'#dbe9df':b.review?'#d6bd96':'#e5dbc5'}"/><text x="${x(b.start)+8}" y="${82+i*40}">${esc(b.title)} · ${b.months}개월</text>`).join('')}<line x1="${x(m.start)}" y1="30" x2="${x(m.start)}" y2="190" stroke="#826199" stroke-dasharray="4 4"/><text x="${Math.min(x(m.start)+8,720)}" y="40">${esc(m.terms[0]?.title||m.next[0]?.title||'중등 과학')} 시작</text>${[...new Set([...m.phases.flatMap(b=>[b.start,b.end]),m.start,m.to].filter(Number.isFinite))].map(v=>`<text x="${x(v)}" y="215" text-anchor="middle">${esc(date(context,v).label)}</text>`).join('')}</svg></div>`:''}<p class="science-note">과학의 기간을 나란히 비교합니다. 분야별 과학을 수학 레벨이나 능력 점수로 환산하지 않습니다.</p>${goalView(m)}${extension(m)}${gifted(m)}</section>`;
 }
 return `<section class="science-plan">${head}${levelView}${note}${view==='map'?`<ol class="science-chain">${chain.map(b=>`<li><button type="button" data-science-block="${b.id}" class="science-tone-${b.id==='experiment'?0:b.id==='elementary'||b.review?1:2}"><small>${b.completed?'이수 범위 유지':b.months?b.schoolTerm?'학기별':b.months+'개월':'다음 분야'}</small><strong>${esc(b.title)}</strong>${b.material?'<span>'+esc(b.material)+'</span>':''}<span>${esc(phaseText(m,b))}</span></button></li>`).join('')}</ol>`:''}${view==='map'?'<details class="science-settings"><summary>학년·월별 전체 과정표</summary>'+timeline(m)+'</details>':timeline(m)}${goalView(m)}${extension(m)}${gifted(m)}<details class="science-settings"><summary>역산 기준과 과학 공부 방법</summary><p>수학 중2-1 완료 시점에 중등 물리를 연결합니다. 실제 중2 시점에도 수학 중2-1을 마치지 못하는 표준 계획은 생명·지구·물리·화학 순서로 연결하며, 오투 학기별 과정으로 바꿀 수 있습니다.</p><p>표시된 날짜는 계획이며 실제 과학 이수 기록과 구분합니다. 기존 이수로 선택한 범위는 다시 배정하지 않습니다. 초5·6 과학은 늦어도 초6 10월 완료를 기준으로 두고 최소 6개월을 확보합니다. 별도 실험과학은 남은 기간에 맞춰 줄이거나 생략합니다. 이미 그 시기를 지난 경우에는 과거에 이수한 것으로 표시하지 않고 보완할 기간을 확보합니다. 실험과학 수업 시간·중등 분야별 이수 개월 수는 임의로 정하지 않습니다.</p>${m.state.completed.length?'<p>유지하는 이수 범위: '+m.state.completed.map(id=>esc(TITLES[id])).join(' · ')+'</p>':''}</details></section>`;
}
function questions(value,context){const m=model(value,context);return [
 ...(global.PlannerScienceLevels?global.PlannerScienceLevels.questions(m):[]),
 ...(m.curriculum?global.PlannerScienceCurriculum.questions(m):[]),
 ...(m.prepPlan?[{question:'영재원 대비를 추가하면 기존 공부 속도가 줄어드나요?',answer:PREP_POLICY+' 영재원 대비 교재·탐구·서술·면접 준비는 별도 시간에 더합니다. 선택만으로 기존 교재의 기간이나 수학 중2-1 완료 시점, 과학 시작 시점을 늦추지 않습니다. 기존 과제와 수면을 지킬 수 있는 시간부터 정하고, 지원 과정의 평가 방식에 맞춰 준비 범위를 좁혀주세요.'}]:[]),
 ...(m.goalPlan.physics?[{question:'물리 올림피아드는 지금부터 준비할 수 있나요?',answer:m.goalPlan.physics.title+'. '+m.goalPlan.physics.steps.join(' → ')+'. '+m.goalPlan.physics.note+' 물리대회(TPL)와 올림피아드 교육은 별개입니다. 일반물리의 미적분 사용 여부는 실제 수학 적용 수준과 맞추어 선택합니다.'}]:[]),
 ...(m.prepPlan&&m.state.institute==='university'?[{question:'대학부설 영재원 대비와 과학 공부는 같은 과정인가요?',answer:'과학 진도 공부와 영재원 대비는 별도로 이어갑니다. 영재원 대비는 지원 과정의 학년·모집 분야·평가 방식에 맞춰 주신 대비 교재와 필요한 서류·서술·면접 준비를 더합니다. 고등 하이탑·세페이드 3F·물리 올림피아드를 모든 지원자의 필수 과정으로 정하지 않습니다.'}]:[]),
 ...(['giftedSchool','scienceHigh'].includes(m.state.schoolGoal)?[{question:'영재학교·과학고 목표를 고르면 일정이 빨라지나요?',answer:'진학 목표만으로 현재 교과·심화·연산이나 과학 날짜를 앞당기지 않습니다. 중등 기본 이후 6개월 심화 브릿지와 하이탑 심화 반복을 먼저 이어갑니다. 세페이드와 고등 과학은 그 이후 실제 풀이와 부담을 보고 선택합니다. 전형 준비와 올림피아드 교육도 각각 별도로 검토합니다.'}]:[]),
 {question:'세페이드 1F·2F·3F를 모두 순서대로 해야 하나요?',answer:'출판사 기준 1F는 중등 물리·화학 기초, 2F는 중등 과학 4영역의 기초·심화, 3F는 고등 과학Ⅰ 수준의 기초·심화입니다. 각 단계에 분야별 상·하 권이 나뉩니다. 중등 심화가 필요하면 2F를 고등 하이탑 전 연결 과정으로 살펴보고, 기초 보완이 필요한 물리·화학은 1F부터 선택할 수 있습니다. 3F는 고등 개념을 공부하며 필요한 분야에 병행합니다. 모든 단계를 일괄 필수로 배정하지 않습니다.'},
 {question:m.phases.some(x=>x.id==='experiment'&&!x.completed)?'실험과학은 얼마나 병행하나요?':'실험과학 없이 초5·6 과학부터 공부해도 되나요?',answer:preparationNote(m)+' 별도 실험과학을 생략해도 초등 과학 교재의 관찰·실험·자료 해석과 설명은 함께 공부합니다. 실제 이수로 확인한 범위만 유지합니다.'},
 {question:m.late?'실제 중2인데 수학 중2-1 선행이 안 되면 과학은 어떻게 하나요?':'수학 진도가 바뀌면 과학도 이동하나요?',answer:m.late?'생명 → 지구 → 물리 → 화학을 기본 흐름으로 보여주고, 오투로 학년·학기별 공부를 선택할 수 있습니다. 명시적으로 고른 경로와 이수 범위는 이후 수학 계획이 바뀌어도 유지하며 전환할 때 다시 선택합니다.':'중등 물리의 시작은 수학 중2-1 완료 시점과 비교하되 초5·6 과학 완료를 중학교까지 미루지 않습니다. 초6 10월 완료와 최소 6개월의 공부 시간을 먼저 확보하고 실험과학 기간을 조정합니다. 별도로 고른 분야별／오투 흐름과 확인한 이수 기록은 유지합니다.'},
 ...(m.institutePolicy.allowed?[{question:'영재원 대비 교재를 모두 공부해야 하나요?',answer:'영재성·창의적 문제해결력, 수학·과학 문제 유형과 자료 해석, 서술·실전 연습 중 필요한 준비를 선택합니다. 과학 진도 교재와는 별개입니다. 선택한 교재는 '+m.prepBook+'입니다. 기존 참고 자료의 책은 판본·대상·평가 유형을 확인한 뒤 필요한 범위만 연결합니다. '+m.region+'의 해당 기관·지원 학년도 요강에서 자격·평가·제출 자료를 확인합니다.'}]:[{question:'중학생은 어떤 목표에서 영재원을 연결하나요?',answer:m.institutePolicy.note+' 자사고·일반고 상위권 경로에서는 기존 공부와 필요한 준비를 이어갑니다.'}])
 ];}
function renderQuestions(value,context){if(!restore(value).enabled)return '';return '<section class="pathway-parent-questions">'+questions(value,context).map(q=>`<details><summary>${esc(q.question)}</summary><p>${esc(q.answer)}</p></details>`).join('')+'</section>';}
global.PlannerScience=Object.freeze({restore,choose,date,institutePolicy,caseContext,normalContext,model,root,choices,render,guidance,questions,renderQuestions});
})(window);
