/* Choice-only long-range roadmap. Editorial study links and parent confirmations
 * are independent of learning pace, official eligibility, and actual applications. */
(function(g){
'use strict';
const D=g.PlannerCollegeData,{COUNTRIES:C,CURRICULA:U,FIELDS:F,SOURCES}=D;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const has=(o,k)=>Object.hasOwn(o,k),pick=(v,list)=>list.includes(v)?v:null;
const FORMATS={kr:'국내 학년',grade:'Grade',year:'Year',other:'학교 자체 학년',unknown:'학년 체계 확인 전'};
const SCIENCE_BOOKS={school:'학교 과학 교재',otu:'오투 · 학기별 기본',julgi:'줄기과학 · 계통별 기본',wanza:'완자',hightop:'하이탑',cepheid1:'세페이드 1F',cepheid2:'세페이드 2F',cepheid3:'세페이드 3F',other:'다른 교재 · 판본 확인',unknown:'현재 교재 확인 전'};
const SCIENCE_RANGES=[...Array.from({length:6},(_,i)=>[(4+Math.floor(i/2))+'-'+(i%2+1),'초등 '+(4+Math.floor(i/2))+'-'+(i%2+1)]),...Array.from({length:6},(_,i)=>['중'+(1+Math.floor(i/2))+'-'+(i%2+1),'중등 '+(1+Math.floor(i/2))+'-'+(i%2+1)]),['physics','물리 분야'],['chemistry','화학 분야'],['life','생명 분야'],['earth','지구 분야'],['integrated','통합과학'],['unknown','현재 범위 확인 전']];
const PREP_GOALS=['none','private','giftedSchool','scienceHigh','general'];
const REVIEW_CHOICES=[['now','이번 달'],['next','다음 달'],['quarter','3개월 뒤'],['unknown','아직 미정']];
const OBS={pending:'아직 확인 전',help:'도움을 받아 적용',independent:'혼자 설명하고 적용'};
const RESULTS={unknown:'결과 확인 전',conditional:'조건부 합격 통지 확인',admitted:'합격 통지 확인',declined:'불합격 통지 확인',withdrawn:'지원 철회 확인',enrolled:'등록 절차 완료 확인'};
const STEPS=[['current','현재 공부','영역별 현재 교재와 풀이를 확인합니다.'],['explore','관심과 공부 연결','활동과 관심 계열을 비교하며 필요한 공부를 살펴봅니다.'],['subjects','과목·교육과정 선택','학교 개설 과목·선수학습과 목표 과정의 요건을 비교합니다.'],['prepare','지원 준비','공식 요건과 학교 공부·언어·활동·서류를 각각 확인합니다.'],['apply','지원 여부 확인','제출 여부와 최종 서류·일정을 부모가 확인합니다.'],['result','결과·조건 확인','대학 통지와 조건 충족 여부를 각각 확인합니다.'],['enroll','등록 확인','선택한 대학의 등록 절차 완료를 직접 확인합니다.']];
const PHASES=[['concept','개념·설명'],['apply','적용·오류 보완'],['depth','심화·다음 범위 확인']];
function years(now=new Date().getFullYear()){return Array.from({length:19},(_,i)=>String(now+i));}
function levels(format){return format==='kr'?Array.from({length:12},(_,i)=>[String(i+1),i<6?'초'+(i+1):i<9?'중'+(i-5):'고'+(i-8)]):['grade','year'].includes(format)?Array.from({length:format==='year'?13:12},(_,i)=>[String(i+1),FORMATS[format]+' '+(i+1)]):[['primary','초등 단계'],['middle','중등 단계'],['high','고등 단계'],['unknown','확인 전']];}
function empty(){return{version:1,enabled:false,school:{format:null,level:null,curriculum:'unknown',startMonth:null},countries:[],active:null,fields:[],entryYear:'unknown',routes:{},checks:{},outcomes:{},plans:{},preparations:{},scienceCurrent:{book:'unknown',range:'unknown',status:'unknown'},node:'current'};}
function routeScope(s,country=s.active){return [country,s.entryYear,s.school.curriculum,s.routes[country]||'explore'].join('|');}
function reviewDate(context={},when){
 const year=+context.fields?.year,month=+context.fields?.mon,offset={now:0,next:1,quarter:3}[when];
 const m=Number.isInteger(year)&&year>=2000&&year<=2098&&Number.isInteger(month)&&month>=1&&month<=12&&offset!==undefined?year*12+month-1+offset:null;
 return m===null?null:Math.floor(m/12)+'-'+String(m%12+1).padStart(2,'0');
}
function reviewSelection(task,context){if(!task.reviewAt)return task.id+':unknown';const found=REVIEW_CHOICES.find(([id])=>id!=='unknown'&&reviewDate(context,id)===task.reviewAt);return found?task.id+':'+found[0]:null;}
function prepGoal(context={}){return PREP_GOALS.includes(context.schoolGoal)?context.schoolGoal:'none';}
function prepScope(s,context={}){return s.active?routeScope(s)+'|'+prepGoal(context):null;}
function restore(v){
 const s=empty();if(v?.version!==1)return s;
 s.enabled=v.enabled===true;s.scienceCurrent={book:pick(v.scienceCurrent?.book,Object.keys(SCIENCE_BOOKS))||'unknown',range:pick(v.scienceCurrent?.range,SCIENCE_RANGES.map(x=>x[0]))||'unknown',status:pick(v.scienceCurrent?.status,['unknown','progress','done'])||'unknown'};s.school.format=pick(v.school?.format,Object.keys(FORMATS));s.school.level=pick(v.school?.level,levels(s.school.format).map(x=>x[0]));s.school.curriculum=pick(v.school?.curriculum,Object.keys(U))||'unknown';s.school.startMonth=Number.isInteger(v.school?.startMonth)&&v.school.startMonth>=1&&v.school.startMonth<=12?v.school.startMonth:null;
 s.countries=Array.isArray(v.countries)?[...new Set(v.countries.filter(x=>has(C,x)))]:[];s.active=s.countries.includes(v.active)?v.active:s.countries[0]||null;
 s.fields=Array.isArray(v.fields)?[...new Set(v.fields.filter(x=>has(F,x)))]:[];
 s.entryYear=/^20\d\d$/.test(v.entryYear||'')?v.entryYear:'unknown';s.node=pick(v.node,STEPS.map(x=>x[0]))||'current';
 for(const country of Object.keys(C))if(C[country].routes.some(([id])=>id===v.routes?.[country]))s.routes[country]=v.routes[country];
 for(const [key,values]of Object.entries(v.checks||{})){
  const [country,year,curriculum,route]=key.split('|');if(!has(C,country)||!has(U,curriculum)||!C[country].routes.some(([id])=>id===route)||!(year==='unknown'||/^20\d\d$/.test(year)))continue;
  s.checks[key]={};for(const [id]of C[country].checks)if(has(OBS,values?.[id]))s.checks[key][id]=values[id];
  // These are parent confirmations, never an automatically verified eligibility decision.
  for(const id of ['submitted','conditions','registration'])if(values?.[id]===true)s.checks[key][id]=true;
 }
 for(const [key,result]of Object.entries(v.outcomes||{}))if(s.checks[key]&&has(RESULTS,result)&&(result!=='enrolled'||s.checks[key].registration===true))s.outcomes[key]=result;
 for(const [key,plan]of Object.entries(v.plans||{})){
  const [curriculum,axis]=key.split('|');if(!has(U,curriculum)||!['math','science'].includes(axis))continue;
  const subjects=Array.isArray(plan?.subjects)?[...new Set(plan.subjects.filter(x=>U[curriculum][axis].includes(x)))]:[];
  const durations={};for(const [phase]of PHASES)if([1,2,3,4,6].includes(plan.durations?.[phase]))durations[phase]=plan.durations[phase];
  s.plans[key]={subjects,book:pick(plan.book,['current','concept','practice','depth','school'])||'current',placement:plan.placement==='current'?'current':'explore',durations};
 }
 for(const [key,items]of Object.entries(v.preparations||{})){
  const [country,year,curriculum,route,goal,...extra]=key.split('|');
  if(extra.length||!has(C,country)||!(year==='unknown'||/^20\d\d$/.test(year))||!has(U,curriculum)||!C[country].routes.some(([id])=>id===route)||!PREP_GOALS.includes(goal))continue;
  const record={};for(const id of Object.keys(D.PREPARATION))if(has(items||{},id)){
   const at=items[id]?.reviewAt;record[id]={reviewAt:/^20\d\d-(0[1-9]|1[0-2])$/.test(at||'')?at:null};
  }
  if(Object.keys(record).length)s.preparations[key]=record;
 }
 return s;
}
function choose(v,kind,id,context={}){
 const s=restore(v);s.enabled=true;
 const toggle=(list,x)=>list.includes(x)?list.filter(y=>y!==x):[...list,x];
 if(kind==='scienceCurrent'){const [key,value]=id.split(':');const list=key==='book'?Object.keys(SCIENCE_BOOKS):key==='range'?SCIENCE_RANGES.map(x=>x[0]):key==='status'?['unknown','progress','done']:[];if(list.includes(value))s.scienceCurrent[key]=value;}
 else if(kind==='preparation'&&s.active&&has(D.PREPARATION,id)){
  const scope=prepScope(s,context),record={...s.preparations[scope]};if(has(record,id))delete record[id];else record[id]={reviewAt:null};
  if(Object.keys(record).length)s.preparations[scope]=record;else delete s.preparations[scope];
 }
 else if(kind==='review'&&s.active){
  const [task,when]=id.split(':'),scope=prepScope(s,context),record=s.preparations[scope];
  if(record&&has(record,task)&&REVIEW_CHOICES.some(([key])=>key===when)){
   record[task]={reviewAt:reviewDate(context,when)};
  }
 }
 else if(kind==='format'&&has(FORMATS,id)){s.school.format=id;s.school.level=null;}
 else if(kind==='level'&&levels(s.school.format).some(([x])=>x===id))s.school.level=id;
 else if(kind==='curriculum'&&has(U,id))s.school.curriculum=id;
 else if(kind==='startMonth'&&/^([1-9]|1[0-2])$/.test(id))s.school.startMonth=+id;
 else if(kind==='country'&&has(C,id)){s.countries=toggle(s.countries,id);s.active=s.countries.includes(s.active)?s.active:s.countries[0]||null;}
 else if(kind==='active'&&s.countries.includes(id))s.active=id;
 else if(kind==='field'&&has(F,id))s.fields=id==='undecided'?['undecided']:toggle(s.fields.filter(x=>x!=='undecided'),id);
 else if(kind==='year'&&(id==='unknown'||years(context.year).includes(id)))s.entryYear=id;
 else if(kind==='route'&&s.active&&C[s.active].routes.some(([x])=>x===id))s.routes[s.active]=id;
 else if(kind==='node'&&STEPS.some(([x])=>x===id))s.node=id;
 else if(kind==='check'&&s.active){const [key,status]=id.split(':');if(C[s.active].checks.some(([x])=>x===key)&&has(OBS,status)){const scope=routeScope(s);s.checks[scope]={...s.checks[scope],[key]:status};}}
 else if(kind==='confirm'&&s.active&&['submitted','conditions','registration'].includes(id)){const scope=routeScope(s);s.checks[scope]={...s.checks[scope],[id]:!s.checks[scope]?.[id]};if(id==='registration'&&!s.checks[scope][id]&&s.outcomes[scope]==='enrolled')s.outcomes[scope]='admitted';}
 else if(kind==='outcome'&&s.active&&has(RESULTS,id)){const scope=routeScope(s);s.checks[scope]={...s.checks[scope]};if(id!=='enrolled'||(s.checks[scope].registration===true&&['admitted','conditional'].includes(s.outcomes[scope])&&(s.outcomes[scope]!=='conditional'||s.checks[scope].conditions===true)))s.outcomes[scope]=id;}
 else if(['subject','book','duration','placement'].includes(kind)){
  const [axis,...parts]=id.split(':');if(!['math','science'].includes(axis))return s;
  const key=s.school.curriculum+'|'+axis,p=s.plans[key]||{subjects:[],book:'current',placement:'explore',durations:{}};s.plans[key]=p;
  if(kind==='placement'&&['explore','current'].includes(parts[0]))p.placement=parts[0];
  if(kind==='subject'&&U[s.school.curriculum][axis].includes(parts.join(':'))){p.subjects=toggle(p.subjects,parts.join(':'));p.placement='explore';p.durations={};}
  if(kind==='book'&&['current','concept','practice','depth','school'].includes(parts[0]))p.book=parts[0];
  if(kind==='duration'&&PHASES.some(([x])=>x===parts[0])&&[1,2,3,4,6].includes(+parts[1]))p.durations[parts[0]]=+parts[1];
 }
 return restore(s);
}
function scienceLabel(v){const s=restore(v).scienceCurrent;return SCIENCE_BOOKS[s.book]+' · '+(SCIENCE_RANGES.find(([id])=>id===s.range)?.[1]||'현재 범위 확인 전')+' · '+({unknown:'상태 확인 전',progress:'진행 중',done:'완료'})[s.status];}
function schoolLabel(s){const value=restore(s).school;return levels(value.format).find(([x])=>x===value.level)?.[1]||'학년 확인 전';}
function dateAt(v,fields={},offset=0){
 const s=restore(v),m=(+fields.year||new Date().getFullYear())*12+(+fields.mon||1)-1+offset,year=Math.floor(m/12),month=m%12+1;
 let grade=schoolLabel(s);const p=s.school;
 if(p.format==='kr'&&p.level){const start=(+fields.mon||1),delta=Math.floor((start-3+offset)/12)-Math.floor((start-3)/12),n=+p.level+delta;grade=n<=6?'초'+n:n<=9?'중'+(n-6):n<=12?'고'+(n-9):'고교 이후';}
 else if(['grade','year'].includes(p.format)&&p.level&&p.startMonth){const start=(+fields.mon||1),delta=Math.floor((start-p.startMonth+offset)/12)-Math.floor((start-p.startMonth)/12);grade=FORMATS[p.format]+' '+(+p.level+delta);}
 else if(offset>0)grade='학년 전환 확인 전';
 return{year,month,quarter:Math.floor((month-1)/3)+1,grade,label:year+'년 '+month+'월'};
}
function bookLabel(s,axis,context={}){
 const plan=s.plans[s.school.curriculum+'|'+axis],name=axis==='math'?context.currentStudy?.school:context.scienceBook;
 if(!plan||plan.book==='current'){if(!name)return plan?.subjects.length?'선택한 과목에 맞는 교재를 고르세요.':'현재 공부부터 연결';return plan?.subjects.length&&!plan.subjects.some(x=>name.includes(x))?'기존 '+name+' 유지 · 새 과목 교재는 별도로 선택':name;}
 if(plan.book==='school'||s.school.curriculum!=='kr')return '학교 지정 교재 · 과목 안내와 판본 확인';
 return axis==='math'?({concept:'개념원리·수학의 정석 후보',practice:'쎈 등 유형 교재 후보',depth:'현재 심화 교재 유지·비교'})[plan.book]:({concept:'현재 과학 개념 교재 유지·비교',practice:'오투·완자 등 유형 교재 후보',depth:'중등 기본 이후 · 최상위 줄기과학·하이탑 수준 심화 비교'})[plan.book];
}
function studyLanes(v,fields={},context={}){
 const s=restore(v);return ['math','science'].map(axis=>{
  const p=s.plans[s.school.curriculum+'|'+axis],blocks=[];let t=0,unplaced=false;
  for(const [id,label]of PHASES){if(!p?.subjects.length||p.placement!=='current'||!p.durations[id]){unplaced=true;break;}const end=t+p.durations[id];blocks.push({id,label,start:t,end,subjects:p.subjects,book:bookLabel(s,axis,context),assumption:true});t=end;}
  return{axis,title:axis==='math'?'수학':'과학',subjects:p?.subjects||[],book:bookLabel(s,axis,context),blocks,unplaced};
 });
}
function schoolStage(value){
 const p=restore(value).school;
 return p.format==='kr'&&p.level?(+p.level<=6?'primary':+p.level<=9?'middle':'high'):p.format==='other'?({primary:'primary',middle:'middle',high:'high'})[p.level]||'unknown':'unknown';
}
function applicationVisible(value){
 const s=restore(value),scope=routeScope(s),checks=s.checks[scope]||{};
 return schoolStage(s)==='high'||checks.submitted===true||checks.registration===true||!!(s.outcomes[scope]&&s.outcomes[scope]!=='unknown');
}
function visibleSteps(value){return applicationVisible(value)?STEPS:STEPS.slice(0,4).map(x=>x[0]==='prepare'?['prepare','현재 학년의 준비','학교 공부·영어·관심 활동 중 지금 챙길 내용을 고르고, 다시 살펴볼 달을 정합니다.']:x);}
function preparationPlan(v,context={}){
 const s=restore(v),goal=prepGoal(context),scope=prepScope(s,context),saved=s.preparations[scope]||{},p=s.school;
 const stage=schoolStage(s);
 const goalNote={giftedSchool:'영재학교 목표에서는 수학·과학 심화·탐구를 이어가며 읽기·표현과 다른 교과도 함께 살핍니다.',scienceHigh:'과학고 목표에서는 학교 수학·과학과 탐구를 이어가며 과목 이수와 언어·표현을 함께 확인합니다.',private:'자사고별 개설 과목과 국내·해외 진학 지원 방식을 비교합니다. 국제트랙 유무를 학교에 확인합니다.',general:'일반고의 학교 공부를 중심에 두고 개설 과목·탐구·학교 상담으로 이어갑니다.',none:'고교 유형은 열어두고 현재 학교에서 가능한 공부와 준비를 살펴봅니다.'}[goal];
 const countryNote=s.active==='us'?'미국은 대학별 지원 방식·교과·시험·언어·서류 요건을 각각 확인합니다.':s.active==='uk'?'영국은 지원 과정의 인정 자격·선수과목·평가·언어 요건을 먼저 비교합니다.':s.active==='kr'?'국내는 해당 연도·대학·전형의 과목과 평가·서류 요건을 비교합니다.':'먼저 비교할 국가를 고르면 준비를 따로 남길 수 있습니다.';
 const tasks=Object.entries(D.PREPARATION).map(([id,d])=>{const [action,checkpoint]=d.stages[stage],at=saved[id]?.reviewAt;return{id,title:d.title,action,checkpoint,selected:has(saved,id),reviewAt:at||null,reviewLabel:at?at.slice(0,4)+'년 '+(Math.floor((+at.slice(5)-1)/3)+1)+'분기 · '+(+at.slice(5))+'월':'점검할 달 선택'};});
 return{scope,goal,stage,goalNote,countryNote,tasks,selected:tasks.filter(x=>x.selected)};
}
function preparationChoices(s,context){
 const p=preparationPlan(s,context);return '<section class="college-preparation-choice"><small>현재 학년에서 준비할 공부</small><h3>지금 어떤 공부를 챙겨볼까요?</h3><p>'+esc(p.goalNote)+'</p><p>'+esc(p.countryNote)+'</p>'+options('preparation',p.tasks.map(x=>[x.id,x.title]),p.selected.map(x=>x.id))+p.selected.map(x=>'<article class="college-preparation-task"><h4>'+esc(x.title)+'</h4><p>'+esc(x.action)+'</p><p>'+esc(x.checkpoint)+'</p><h5>언제 다시 확인할까요?</h5>'+options('review',REVIEW_CHOICES.map(([id,t])=>[x.id+':'+id,t]),reviewSelection(x,context))+'<p class="college-review-label">'+esc(x.reviewLabel)+'</p></article>').join('')+'<p>지금 공부는 유지하고 선택한 준비를 함께 챙깁니다. 정한 달에 실제로 해 본 내용과 부담을 살펴 다음 계획을 조정하세요.</p></section>';
}
function preparationSummary(s,context,view){
 const p=preparationPlan(s,context);if(!p.selected.length)return '<aside class="college-preparation-empty"><button type="button" data-college-open="prepare">우리 아이에게 맞는 준비 더하기 →</button></aside>';
 const title='선택한 진학 준비',rows=p.selected.map(x=>'<tr><th scope="row">'+esc(x.title)+'</th><td>'+esc(x.reviewLabel)+'</td><td>'+esc(x.action)+'<br>'+esc(x.checkpoint)+'</td></tr>').join('');
 if(view==='table')return '<section class="college-preparation-summary"><h4>'+title+'</h4><p>'+esc(p.goalNote)+'</p><div class="college-requirement-table"><table><caption>학습 과정과 별도로 살펴볼 준비 · 확인 시점</caption><thead><tr><th scope="col">준비</th><th scope="col">확인 시점</th><th scope="col">살펴볼 내용</th></tr></thead><tbody>'+rows+'</tbody></table></div><button type="button" data-college-open="prepare">준비·확인 시점 조정</button></section>';
 return '<section class="college-preparation-summary"><header><h4>'+title+'</h4><button type="button" data-college-open="prepare">준비 조정</button></header><p>'+esc(p.goalNote)+'</p><div class="college-preparation-grid">'+p.selected.map(x=>'<article><small>'+esc(x.reviewLabel)+'</small><h4>'+esc(x.title)+'</h4><p>'+esc(x.action)+'</p><details><summary>다음에 확인할 모습</summary><p>'+esc(x.checkpoint)+'</p></details></article>').join('')+'</div><p>현재 교재·수업 횟수·진도 속도는 유지합니다. 표시한 달은 함께 살펴볼 시점입니다.</p></section>';
}
function model(v,context={}){
 const s=restore(v),country=C[s.active],scope=s.active?routeScope(s):null,checks=s.checks[scope]||{},outcome=s.outcomes[scope]||'unknown',step=visibleSteps(s).find(([id])=>id===s.node)||visibleSteps(s).at(-1),fields=s.fields.map(id=>({id,...F[id]}));
 return{s,country,scope,checks,outcome,step,fields,school:schoolLabel(s),curriculum:U[s.school.curriculum],requirements:country?country.checks.map(([id,title])=>({id,title,status:checks[id]||'pending'})):[],lanes:studyLanes(s,context.fields,context),yearNote:s.entryYear==='unknown'?'목표 입학연도 미정 · 연도를 정한 뒤 해당 요강 확인':s.entryYear+(s.active==='kr'?'학년도':'년 입학')+' 목표 · 해당 대학·과정의 해당 연도 요건 확인 대기'};
}
const button=(kind,id,title,on=false)=>`<button type="button" data-college-kind="${kind}" data-college-value="${esc(id)}" aria-pressed="${on}">${esc(title)}${on?'<span class="college-selected">선택됨</span>':''}</button>`;
const options=(kind,items,current)=>'<div class="college-options">'+items.map(([id,title])=>button(kind,id,title,Array.isArray(current)?current.includes(id):current===id)).join('')+'</div>';
function source(id){const x=SOURCES[id];return x?`<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)} ↗</a><p>${esc(x.scope)} · ${x.checked} 확인${x.status==='verification_pending'?' · 확인 대기':''}</p>`:'';}
function caseExamples(context={}){
 const cases=[...D.CASES].sort((a,b)=>Number(b.goal===context.schoolGoal)-Number(a.goal===context.schoolGoal));
 return '<details class="college-cases"><summary>실제 해외 학부 사례 · 연도와 출처</summary><p>이번에 확인한 사례는 미국 학부 경로입니다. 고교 유형과 합격·진학 여부를 함께 살펴봅니다.</p><div class="college-case-grid">'+cases.map(x=>'<article data-college-case="'+esc(x.id)+'"><small>'+esc(x.type+' · '+x.year)+'</small><h4>'+esc(x.school)+' → '+esc(x.destination)+'</h4><span class="college-case-status">'+esc(x.status)+'</span>'+(x.person?'<p>'+esc(x.person)+'</p>':'')+'<p>'+esc(x.evidence)+'</p><a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc(x.source)+' ↗</a><small>'+esc(x.checked+' 확인'+(x.accessNote?' · '+x.accessNote:''))+'</small></article>').join('')+'</div><p>사례는 경로를 살펴보는 참고 자료입니다. 학교별 진학 비율·합격 가능성이나 특정 교재의 효과를 뜻하지 않습니다. 대학원·교환학생 사례는 이 목록에 포함하지 않았습니다.</p></details>';
}
function root(){return '<button type="button" data-college-open="school"><strong>대학 진학까지 로드맵 이어보기</strong><span>국내·미국·영국 · 학교 공부·언어·관심 활동에서 이어가는 준비</span></button>';}
function choices(v,page='school',context={}){
 const m=model(v,context),{s}=m,pages=[['school','학교·교육과정'],['country','국가·경로'],['fields','관심 계열'],['study','이어갈 공부'],['prepare','지금 준비할 공부'],...(applicationVisible(s)?[['result','결과·등록']]:[])];
 if(page==='result'&&!applicationVisible(s))page='prepare';
 let body='';
 if(page==='school')body='<h3>학교의 학년 체계</h3>'+options('format',Object.entries(FORMATS),s.school.format)+(s.school.format?'<h3>현재 학교 학년</h3>'+options('level',levels(s.school.format),s.school.level):'')+'<h3>실제 배우는 교육과정</h3>'+options('curriculum',Object.entries(U).map(([id,x])=>[id,x.title]),s.school.curriculum)+'<p>'+esc(m.curriculum.note)+'</p><button type="button" data-college-current>현재 교과·사고력·심화·연산 선택</button><details><summary>현재 과학 교재와 범위 확인</summary><h4>현재 교재</h4>'+options('scienceCurrent',Object.entries(SCIENCE_BOOKS).map(([id,t])=>['book:'+id,t]),'book:'+s.scienceCurrent.book)+'<h4>실제 공부한 범위</h4>'+options('scienceCurrent',SCIENCE_RANGES.map(([id,t])=>['range:'+id,t]),'range:'+s.scienceCurrent.range)+'<h4>진행 상태</h4>'+options('scienceCurrent',[['status:unknown','아직 확인 전'],['status:progress','현재 진행 중'],['status:done','완료한 범위']],'status:'+s.scienceCurrent.status)+'<p>현재 기록이며 과학 계획의 날짜·영재원 대비·수학 선수학습을 자동으로 바꾸지 않습니다. 판본의 실제 목차와 이수는 별도로 확인합니다.</p></details>'+(s.school.format&&s.school.format!=='kr'?'<details><summary>학년이 바뀌는 달 선택 · 학교 안내 확인 후</summary>'+options('startMonth',Array.from({length:12},(_,i)=>[String(i+1),(i+1)+'월']),String(s.school.startMonth))+'<p>학교에서 확인한 달만 선택합니다. 교육과정이나 국가로 달을 추정하지 않습니다.</p></details>':'');
 if(page==='country')body='<h3>어느 나라의 진학 로드맵을 비교할까요?</h3>'+options('country',Object.entries(C).map(([id,x])=>[id,x.title]),s.countries)+'<p>여러 나라를 함께 비교할 수 있습니다.</p>'+countryTabs(s)+(m.country?'<h3>'+m.country.title+' 지원 경로</h3>'+options('route',m.country.routes,s.routes[s.active])+'<p>'+esc(m.country.note)+'</p>':'')+'<details><summary>목표 입학연도 선택</summary>'+options('year',[['unknown','아직 미정'],...years(+context.fields?.year||undefined).map(x=>[x,x+(s.active==='kr'?'학년도':'년 입학')])],s.entryYear)+'</details><p>'+esc(m.yearNote)+'</p>';
 if(page==='fields')body='<button type="button" class="career-return" data-career-open="interests">관심·공부 연결에서 다시 살펴보기</button><h3>관심이 이어지는 공부부터 살펴볼까요?</h3>'+options('field',Object.entries(F).map(([id,x])=>[id,x.title+' · '+x.activity]),s.fields)+'<p>지금 전공을 정할 필요는 없습니다. 여러 분야를 살펴보면서 아이가 오래 궁금해하는 내용을 남겨 보세요.</p>'+fieldCards(m);
 if(page==='study')body='<p>'+esc(m.curriculum.title)+' · 실제 학교에서 배우거나 살펴볼 과목을 고릅니다.</p>'+['math','science'].map(axis=>{
  const p=s.plans[s.school.curriculum+'|'+axis],title=axis==='math'?'수학':'과학';return '<section class="college-study-choice"><h3>'+title+' 과목</h3>'+options('subject',m.curriculum[axis].map(x=>[axis+':'+x,x]),p?.subjects.map(x=>axis+':'+x)||[])+'<p>과목을 바꾸면 그 영역의 기간·배치 여부를 다시 확인합니다. 앞으로의 탐색으로 고른 과목은 지금의 진도에 넣지 않습니다.</p>'+options('placement',[[axis+':explore','앞으로 살펴볼 과목 · 일정 미정'],[axis+':current','현재 이 과목을 배우거나 선수학습을 확인했습니다']],axis+':'+(p?.placement||'explore'))+'<details><summary>'+title+' 교재·공부 기간 조정</summary><p>기존 학습 계획은 유지합니다. 아래는 선택 과목에 더해 보는 별도 계획입니다. 먼저 현재 공부와 겹치는지 확인합니다.</p>'+options('book',[['current','현재 교재 유지'],['school','학교 지정 교재'],['concept','개념 교재 비교'],['practice','유형·적용 교재 비교'],['depth','심화 교재 비교']].map(([id,t])=>[axis+':'+id,t]),axis+':'+(p?.book||'current'))+'<p>'+esc(bookLabel(s,axis,context))+' · 정확한 판본·대상 과목 확인 후 선택</p>'+PHASES.map(([id,t])=>'<h4>'+t+'에 둘 기간</h4>'+options('duration',[1,2,3,4,6].map(n=>[axis+':'+id+':'+n,n+'개월']),p?.durations[id]?axis+':'+id+':'+p.durations[id]:null)).join('')+'<p>현재 학습·선수범위 확인과 앞 단계 기간이 선택된 경우에만 달력에 배치합니다. 직접 선택한 기간의 배치안입니다. 교재의 표준 이수 기간·완료 기한이나 성취 예측이 아닙니다. 앞 단계 기간이 없으면 이후 날짜는 배정하지 않습니다.</p></details></section>';
 }).join('')+'<details><summary>교육과정 공식 안내와 확인 범위</summary>'+source(m.curriculum.source)+'</details>';
 if(page==='prepare')body=countryTabs(s)+(m.country?preparationChoices(s,context)+'<details class="college-official-checks"><summary>대학별 공식 요건과 준비 상태 확인</summary><p>'+esc(m.yearNote)+'</p><p>'+esc(m.country.note)+'</p>'+m.requirements.map(r=>'<fieldset class="college-check"><legend>'+esc(r.title)+'</legend>'+options('check',Object.entries(OBS).map(([id,t])=>[r.id+':'+id,id==='help'?'일부 확인 · 추가 확인 필요':id==='independent'?'자료를 직접 확인함':t]),r.id+':'+r.status)+'</fieldset>').join('')+'<p>부모의 확인 기록입니다. 지원자격 충족·합격 가능성 판정이 아닙니다. 대학·과정이 정해지면 최종 공식 요강을 다시 확인합니다.</p><details><summary>공식 출처와 적용 범위</summary>'+source(m.country.source)+(s.active==='us'?source('mit')+source('ucla')+source('mitFoundations'):'')+'</details></details>':'<p>먼저 비교할 국가를 선택해 주세요.</p><button type="button" data-college-page="country">국가 고르기</button>');
 if(page==='result')body=countryTabs(s)+(m.country?'<p>'+esc(m.yearNote)+'</p><p>실제 대학의 통지·제출·등록 내역을 확인한 경우에만 선택합니다. 준비 항목의 확인 수로 결과를 바꾸지 않습니다.</p>'+button('confirm','submitted','실제 지원서 제출 여부를 확인했습니다',m.checks.submitted===true)+options('outcome',Object.entries(RESULTS).filter(([id])=>id!=='enrolled'),m.outcome)+button('confirm','conditions','대학이 제시한 조건의 충족 여부를 확인했습니다',m.checks.conditions===true)+button('confirm','registration','선택한 대학의 등록 절차 완료를 확인했습니다',m.checks.registration===true)+(m.checks.registration&&['admitted','conditional'].includes(m.outcome)&&(m.outcome!=='conditional'||m.checks.conditions)?button('outcome','enrolled','등록 완료로 기록',false):m.checks.registration&&m.outcome!=='enrolled'?'<p>합격 통지와 필요한 조건의 확인 후 등록 완료를 기록할 수 있습니다.</p>':'')+'<p role="status">현재 결과 기록 · '+esc(RESULTS[m.outcome])+'</p>'+'<p>지원 제출 여부·조건·결과는 서로 다른 기록입니다. 국가·연도·교육과정·지원 경로별로 보관합니다.</p>':'<button type="button" data-college-page="country">국가 고르기</button>');
 if(page==='country')body+=caseExamples(context);
 const next=page===pages.at(-1)[0]?'<button type="button" data-college-finish>선택한 준비를 지도에서 보기 →</button>':'<button type="button" data-college-page="'+pages[Math.min(pages.length-1,Math.max(0,pages.findIndex(([id])=>id===page)+1))][0]+'">다음 갈림길 →</button>';
 return '<div class="college-controls"><nav aria-label="대학 진학 설계 단계">'+pages.map(([id,t])=>`<button type="button" data-college-page="${id}" aria-current="${id===page?'step':'false'}">${t}</button>`).join('')+'</nav>'+body+'<div class="college-next">'+next+(page===pages.at(-1)[0]?'':'<button type="button" data-flow-map>지도·표에서 비교</button>')+'</div></div>';
}
function countryTabs(s){return s.countries.length?'<div class="college-country-tabs" aria-label="살펴볼 국가">'+s.countries.map(id=>button('active',id,C[id].title,s.active===id)).join('')+'</div>':'';}
function fieldCards(m){return m.fields.map(x=>'<article class="college-field"><h4>'+esc(x.title)+'</h4><dl><dt>수학</dt><dd>'+esc(x.math)+'</dd><dt>과학</dt><dd>'+esc(x.science)+'</dd><dt>함께 이어갈 공부</dt><dd>'+esc(x.other)+'</dd></dl></article>').join('');}
function monthCells(l,dates){
 const cells=[];let i=0;
 while(i<dates.length){const b=l.blocks.find(x=>x.start<=i&&x.end>i),span=b?Math.min(dates.length-i,b.end-i):dates.length-i;cells.push('<td colspan="'+span+'" data-college-phase="'+(b?.id||'pending')+'">'+(b?'<strong>'+esc(b.label)+'</strong><small>'+esc(b.book)+'</small>':'<span>'+(l.blocks.length?'이후 과정은 앞선 공부를 점검한 뒤 연결합니다.':'이 영역은 현재 계획을 유지합니다.')+'</span>')+'</td>');i+=span;}
 return cells.join('');
}
function schedule(m,context){
 if(!m.lanes.some(l=>l.blocks.length))return '<section class="college-near-plan"><h4>선택 과목 · 배치 확인</h4><div class="college-bridges">'+m.lanes.map(l=>'<article><small>'+l.title+'</small><h4>'+esc(l.subjects.join(' · ')||'과목 선택 전')+'</h4><p>지금 공부를 이어가면서 다음 과목을 살펴봅니다. 시작할 준비가 되면 교재와 공부할 기간을 선택하세요.</p></article>').join('')+'</div><button type="button" data-college-open="study">과목·교재·기간 살펴보기</button><p>기존 공부의 월별 과정은 그대로 이어갑니다. 아래의 교재·월별 계획과 함께 비교합니다.</p></section>';
 const length=Math.max(...m.lanes.flatMap(l=>l.blocks.map(b=>b.end))),dates=Array.from({length},(_,i)=>dateAt(m.s,context.fields,i));
 return '<section class="college-near-plan"><h4>선택한 '+length+'개월의 과목 계획</h4><p>기존 교과·사고력·심화·연산·과학 일정은 그대로 유지합니다. 새로 선택한 과목의 배치안을 함께 비교합니다.</p><div class="college-calendar" tabindex="0" role="region" aria-label="선택 과목 '+length+'개월 과정표" aria-keyshortcuts="ArrowLeft ArrowRight Home End"><table><colgroup><col class="college-label-col"><col span="'+length+'" class="college-month-col"></colgroup><thead><tr><th scope="col">공부</th>'+dates.map(d=>'<th scope="col"><small>'+esc(d.year+'년 '+d.quarter+'분기')+'</small>'+d.month+'월<small>'+esc(d.grade)+'</small></th>').join('')+'</tr></thead><tbody>'+m.lanes.map(l=>'<tr><th scope="row">'+l.title+'<small>'+esc(l.subjects.join(' · ')||'과목 선택 전')+'</small></th>'+monthCells(l,dates)+'</tr>').join('')+'</tbody></table></div><p>선택한 기간까지 보여드립니다. 이후에는 이해한 범위와 과제 부담을 살펴 다음 과목을 이어가세요. 이 계획은 기존 진도 그래프의 속도를 바꾸지 않습니다.</p></section>';
}
function render(v,context={},view='map'){
 const m=model(v,context);if(!m.s.enabled)return view==='map'?'<section class="college-entry">'+root()+'</section>':'';
 const highSchool=g.PlannerSchoolGoals?.GOALS[context.schoolGoal]?.title||'고교 유형은 열어두고 비교';
 const highBridge='<div class="college-high-bridge"><small>중간 학교 목표 · '+esc(highSchool)+'</small><strong>고교 이후에도 진학 국가를 선택합니다.</strong><p>영재학교·과학고·자사고·일반고에서 국내 대학과 미국·영국 대학으로 각각 이어갈 수 있습니다. 해외 대학을 골라도 국내 교육과정과 현재 교재는 유지합니다.</p><div>'+countryTabs(m.s)+'</div><button type="button" data-college-open="country">고교 이후의 국가·지원 경로 비교 →</button></div>';
 const heading='<header class="college-heading"><div><small>지금의 공부에서 대학 진학까지</small><h3>'+esc(m.country?m.country.title+' · '+(m.fields.map(x=>x.title).join('·')||'관심 계열 탐색'):'국내·미국·영국 진학을 함께 살펴봅니다.')+'</h3><p>'+esc(m.school+' · '+m.curriculum.title)+'</p>'+(applicationVisible(m.s)?'<span class="college-result-status" data-result="'+m.outcome+'">'+esc(RESULTS[m.outcome])+'</span>':'')+'</div><button type="button" data-college-open="country">경로 조정</button></header>';
 let body='';
 if(view==='map')body='<ol class="college-route">'+visibleSteps(m.s).map(([id,title,copy],i)=>'<li class="'+(id===m.step[0]?'is-current':'')+'"><button type="button" data-college-kind="node" data-college-value="'+id+'" aria-pressed="'+(id===m.step[0])+'"><small>'+String(i+1).padStart(2,'0')+'</small><strong>'+title+'</strong></button></li>').join('')+'</ol><aside class="college-stage-note"><h4>'+m.step[1]+'</h4><p>'+m.step[2]+'</p><p>'+esc(m.yearNote)+'</p><button type="button" data-college-open="'+({current:'school',explore:'fields',subjects:'study',prepare:'prepare',apply:'result',result:'result',enroll:'result'})[m.step[0]]+'">이 단계 살펴보기 →</button></aside><details class="college-high-details"'+(!m.country?' open':'')+'><summary>'+esc(highSchool)+' 이후의 국내·해외 진학 비교</summary>'+highBridge+'</details>'+caseExamples(context)+'<div class="college-bridges">'+m.lanes.map(l=>'<article><small>'+l.title+'에서 이어갈 공부</small><h4>'+esc(l.subjects.join(' · ')||'현재 공부를 이어가며 선택')+'</h4><p>'+esc(l.book)+'</p><button type="button" data-college-open="study">교재·과정 선택</button></article>').join('')+'</div><details><summary>관심 계열과 연결된 공부 방법</summary>'+fieldCards(m)+'</details>';
 if(view==='table')body=schedule(m,context)+'<details><summary>지원 준비 항목과 확인 상태</summary>'+requirementTable(m)+'</details>';
 if(view==='graph')body='<div class="college-graph-note"><h4>학습 진도와 진학 준비를 함께 읽습니다.</h4><p>위의 진도 비교는 근거가 있는 학습 구간까지입니다. 아래 준비 상태는 부모가 확인한 항목이며 점수·합격률이나 대학까지의 진도 예측선이 아닙니다.</p>'+requirementTable(m)+'</div>';
 if(view==='records')body='<p>'+esc(m.yearNote)+'</p><p>지원서 제출: '+(m.checks.submitted?'부모 확인':'확인 전')+' · 결과: '+esc(RESULTS[m.outcome])+' · 조건 충족: '+(m.checks.conditions?'부모 확인':'확인 전')+'</p>'+requirementTable(m)+'<details><summary>교육과정·입시 자료의 출처와 확인 범위</summary>'+source(m.curriculum.source)+(m.country?source(m.country.source):'')+'<p>기존 입시 자료 목록을 재사용하되 과거 사례와 현재 공식 요건을 구분합니다. 아직 발표되지 않은 목표 연도의 조건은 확인 대기로 둡니다.</p></details>';
 if(['map','graph','table','records'].includes(view))body+=preparationSummary(m.s,context,view);
 if(['map','table','records'].includes(view))body+=admissionAdvice(m.s,context);
 if(view==='records')body+=caseExamples(context);
 return '<section class="college-roadmap" aria-label="대학 진학까지 연결한 로드맵">'+heading+body+'</section>';
}
function admissionContext(s,context){return {...context,country:s.active,school:s.school,entryYear:s.entryYear,route:s.routes[s.active]};}
function admissionAdvice(s,context){
 const a=g.PlannerAdmissionsEvidence?.model(admissionContext(s,context));if(!a?.visible)return '';
 return '<section class="college-admission-advice"><small>학년별 상담 메모</small><h4>'+esc(a.title)+'</h4><div class="college-admission-grid">'+a.comments.map((c,i)=>'<details'+(i===0?' open':'')+'><summary>'+esc(c.title)+'</summary><p>'+esc(c.text)+'</p></details>').join('')+'</div></section>';
}
function requirementTable(m){if(!m.country)return '<p>비교할 국가를 선택하면 준비 항목이 이어집니다.</p>';return '<div class="college-requirement-table"><table><caption>'+esc(m.country.title+' · '+m.yearNote)+'</caption><thead><tr><th scope="col">확인할 항목</th><th scope="col">부모 확인 기록</th></tr></thead><tbody>'+m.requirements.map(r=>'<tr><th scope="row">'+esc(r.title)+'</th><td>'+esc(({pending:'확인 전',help:'일부 확인',independent:'자료 직접 확인'})[r.status])+'</td></tr>').join('')+'</tbody></table></div>';}
function highStudy(answers,fields){
 if(!g.PlannerIntake.highBook(answers.schoolBook)&&!['10','11','12'].includes(String(g.PlannerIntake.gradeChoice(answers,fields))))return '';
 const rows=g.PlannerIntake.summary(answers,fields).slice(1);
 return '<section class="college-roadmap"><header><small>현재 공부에서 시작하는 고등 학습 흐름</small><h3>개념을 설명하고, 적용하고, 깊게 확인합니다.</h3></header><div class="college-current-high">'+rows.map(r=>'<article><small>'+esc(r.label)+'</small><strong>'+esc(r.text)+'</strong></article>').join('')+'</div><ol class="college-route college-high-stages">'+[['현재 범위','개념·식의 이유 설명'],['적용','대표 유형·조건 변화'],['병행 심화','낯선 문제·풀이 비교'],['재확인','다른 날 적용·오류 수정']].map(([t,d])=>'<li><strong>'+t+'</strong><p>'+d+'</p></li>').join('')+'</ol><p>단계별 날짜와 다음 과목은 현재 풀이와 실제 선수학습을 확인한 뒤 선택합니다. 교재 이름만으로 이수 기간이나 상위 레벨을 만들지 않습니다.</p><button type="button" data-college-open="study">현재 과목의 교재·기간을 직접 배치해 보기 →</button></section>';
}
function questions(v,context={}){const m=model(v,context);if(!m.s.enabled)return '';const qs=[['영재학교·과학고 이후에도 해외 대학으로 이어갈 수 있나요?','고교 유형과 대학 진학 국가는 별도 선택입니다. 국내 고교 교육과정으로 공부하면서도 미국·영국 지원 경로를 비교할 수 있습니다. MIT·UCLA 등은 학교별 신입학·국제 지원자·과목·시험 요건을 확인하며 AP·IB나 국제학교 전환을 자동으로 배정하지 않습니다.'],['사례의 합격과 실제 진학은 어떻게 구분하나요?','출처가 확인하는 단계까지만 표시합니다. 용인외대부고의 UCLA 사례는 합격 발표이며 최종 진학은 확인되지 않았습니다. 학교 진학현황과 본인 재학 이력도 출처의 성격을 함께 표시합니다. 대학원 유학은 고교 졸업 후 학부 진학 사례와 구분합니다.'],['지금부터 대학을 하나로 정해야 하나요?','관심 활동과 계열, 국가별 준비를 비교하는 단계입니다. 현재 공부를 유지하며 선택을 바꿀 수 있습니다. 대학·모집단위가 정해지면 해당 입학연도의 공식 요건을 별도로 확인합니다.'],[m.country?m.country.title+' 준비를 추가하면 기존 진도가 줄어드나요?':'진학 준비를 고르면 현재 공부도 바뀌나요?','목표·국가·계열 선택은 현재 교재와 공부 속도를 바꾸지 않습니다. 추가 과목과 준비는 별도로 배치하고 학교 과제·휴식과 겹치는 부담을 확인합니다.'],[m.curriculum.title+'에서 어떤 수학·과학을 골라야 하나요?',m.curriculum.note+' 현재 풀이·선수학습·학교 개설 여부를 보고 고릅니다. 관심 계열만으로 특정 과목이나 교재를 자동 배정하지 않습니다.'],['준비 항목을 모두 확인하면 지원자격을 갖춘 건가요?','이 기록은 부모가 자료를 확인했는지 표시합니다. 자격 충족이나 합격 판단이 아닙니다. 해당 대학·과정·지원자 구분·입학연도의 최종 요강과 개인 이력을 함께 확인합니다.']];const extra=g.PlannerAdmissionsEvidence?.questions(admissionContext(m.s,context))||[];qs.unshift(...extra.map(q=>[q.question,q.answer]));const prep=preparationPlan(v,context);if(prep.selected.length)qs.unshift(...prep.selected.map(x=>[m.school+'에서 '+x.title+' 준비는 무엇을 먼저 볼까요?',x.action+' '+x.checkpoint+' '+(x.reviewAt?x.reviewLabel+'에 다시 살펴보도록 선택했습니다.':'이번 달에 해 본 공부를 살펴보고 다음 점검할 달도 골라 보세요.')+' 기존 공부의 교재·횟수·속도는 그대로 유지합니다.']));return '<section class="pathway-parent-questions college-questions">'+qs.map(([q,a])=>'<details><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join('')+'</section>';}
g.PlannerCollege=Object.freeze({SCIENCE_BOOKS,SCIENCE_RANGES,scienceLabel,FORMATS,OBS,RESULTS,STEPS,PHASES,years,levels,empty,restore,choose,routeScope,schoolLabel,schoolStage,applicationVisible,visibleSteps,dateAt,bookLabel,studyLanes,model,root,choices,render,highStudy,questions,caseExamples,preparationPlan,prepScope});
})(window);
