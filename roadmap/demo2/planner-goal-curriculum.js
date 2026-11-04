/* Goal study plans distilled from the supplied medicine / science-school
 * lectures and roadmap photos. Adjustable study cycles are not admissions
 * deadlines, minimum grades, official course requirements, or mastery records. */
(function(g){
'use strict';
const C=g.PlannerCurriculum,I=g.PlannerIntake;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GOALS={medicine:'의대',giftedSchool:'영재학교',scienceHigh:'과학고'};
const SCIENCE=[
 {id:'elementary',title:'초등 과학 기본·탐구',months:6,material:'현재 학교 과학·줄기과학·오투 중 선택한 기본 교재',tasks:'관찰·실험·용어의 뜻을 설명하고 초등 과학의 빈 개념을 채웁니다.'},
 {id:'middle',title:'중등 과학 기본',months:13,material:'줄기과학 또는 오투 중등 · 현재 분야·학기',tasks:'물리·화학·생명·지구의 개념, 대표 탐구와 자료 해석을 정리합니다. 현재 분야와 완료 분량을 반영합니다.'},
 {id:'bridge',title:'중등 과학 심화·하이탑 복습',months:6,material:'최상위 줄기과학 또는 하이탑 · 필요한 분야',tasks:'기본 뒤 심화와 하이탑 대표 문제·오답 복습을 포함하는 전체 6개월 기준입니다. 앞의 기본을 다시 전권 배정하지 않습니다.'},
 {id:'integrated',title:'통합과학 개념·자료 해석',months:4,material:'현재 교육과정의 통합과학·학교 수업 자료',tasks:'물화생지 개념을 연결하고 그래프·실험 자료를 해석합니다. 선택 과목과 학교 편성을 함께 확인합니다.'},
 {id:'high',title:'고등 과학 선택 분야',months:6,material:'현재 학교 선택과목 교재·고등 하이탑 중 필요한 범위',tasks:'의대는 생명·화학을 포함한 지원 대학과 학교의 이수·권장 과목을 확인하고, 영과고는 물리·화학 등 실제 선택 분야를 깊게 공부합니다.'},
 {id:'advanced',title:'고급·일반과학 연결',months:6,material:'학교에서 지정한 고급·일반과학 교재',tasks:'영과고 입학 이후 자료의 대학 수준 과학을 실제 학교 수업·선수 개념에 맞춰 선택합니다. 모든 분야나 올림피아드를 일괄 필수로 더하지 않습니다.'}
];
const PREP=[
 {id:'question',title:'독서·교과에서 탐구 질문 만들기',months:3,tasks:'배운 개념과 읽은 글에서 궁금한 점을 고르고, 확인할 질문·근거를 짧게 기록합니다.'},
 {id:'experiment',title:'작은 탐구·자료 분석',months:3,tasks:'가설·변인·방법·결과·한계를 구분합니다. 안전하게 할 수 있는 탐구와 실제 자료를 사용합니다.'},
 {id:'record',title:'탐구 기록·서술·발표 정리',months:3,tasks:'자신이 한 활동, 바꾼 생각과 풀이의 근거를 정리하고 말·글로 설명합니다. 학생부 기록은 실제 학교 활동과 담당 교사의 기준을 확인합니다.'},
 {id:'interview',title:'지원 전 설명·면접 준비',months:3,tasks:'의대는 MMI의 상황 판단·윤리·소통과 자료 해석을, 영과고는 자기주도학습·탐구·문제 해결 과정을 본인 말로 설명합니다.'}
];
const POST=[
 {id:'review',title:'입학 전 고등 수학·서술 정리',months:3,tasks:'배운 고등 수학의 빈 개념과 서술을 정리합니다. 풀이의 논리·접근을 쓰며 입학 후 과제·복습을 스스로 관리할 연습을 합니다.'},
 {id:'calculus',title:'대학 수준 미적분학 연결',months:6,tasks:'고등 미적분과 대학 수준 미적분학을 구분합니다. 학교 교재와 실제 선수 개념을 확인하며 낯선 문제를 서술합니다.'},
 {id:'linear',title:'선형대수·선택 심화',months:6,tasks:'학교 교육과정에 따라 행렬·벡터와 선형대수 또는 필요한 수학 심화를 선택합니다. 과목 개설·학점 인정은 학교·대학 안내로 확인합니다.'},
 {id:'oral',title:'대입 심층·전공 설명 준비',months:3,tasks:'배운 교과와 탐구를 근거로 풀이와 생각을 설명합니다. 실제 지원 전형의 평가·수능 최저·면접 여부를 따로 확인합니다.'}
];
const PHASES={prepare:'진학 준비 중',accepted:'합격 후 입학 준비',enrolled:'입학 후 재학 중'};
const LANG={unknown:'현재 독해 범위 확인 전',basic:'어휘·문장 이해 중심',middle:'중등 지문·요약·서술',high:'고등 지문·학평 적용'};
const validMonth=v=>/^(20\d\d|2100)-(0[1-9]|1[0-2])$/.test(v||'');
const mathKeys=C.PERIODS.slice(0,5);
const periodKeys=[...SCIENCE.map(x=>['science-'+x.id,x.title,x.months]),...PREP.map(x=>['prep-'+x.id,x.title,x.months]),...POST.map(x=>['post-'+x.id,x.title,x.months])];
function supports(goal){return Object.hasOwn(GOALS,goal);}
function restore(v){
 const x=v?.version===1?v:{},s={version:1,science:'unknown',scienceStatus:'progress',scienceDone:null,scienceTotal:null,language:'unknown',activeRoute:null,goals:{}};
 if(['contest',...Object.keys(GOALS)].includes(x.activeRoute))s.activeRoute=x.activeRoute;
 if(['unknown','complete',...SCIENCE.map(x=>x.id)].includes(x.science))s.science=x.science;
 if(x.scienceStatus==='done')s.scienceStatus='done';
 for(const k of ['scienceDone','scienceTotal'])if(Number.isInteger(x[k])&&x[k]>=0&&x[k]<=9999)s[k]=x[k];
 if(Object.hasOwn(LANG,x.language))s.language=x.language;
 for(const goal of Object.keys(GOALS)){
  const r=x.goals?.[goal]||{};
  s.goals[goal]={phase:goal!=='medicine'&&Object.hasOwn(PHASES,r.phase)?r.phase:'prepare',goalMonth:validMonth(r.goalMonth)?r.goalMonth:null,entryMonth:validMonth(r.entryMonth)?r.entryMonth:null,includeContest:r.includeContest===true,extendedMath:r.extendedMath===true,
   prep:['unknown','none','complete',...PREP.map(x=>x.id)].includes(r.prep)?r.prep:'none',prepStatus:r.prepStatus==='done'?'done':'progress',
   post:['none','complete',...POST.map(x=>x.id)].includes(r.post)?r.post:'none',postStatus:r.postStatus==='done'?'done':'progress',periods:{},mathPeriods:{}};
  for(const k of ['prepDone','prepTotal','postDone','postTotal'])s.goals[goal][k]=Number.isInteger(r[k])&&r[k]>=0&&r[k]<=9999?r[k]:null;
  for(const [k]of mathKeys)if(Number.isFinite(+r.mathPeriods?.[k])&&+r.mathPeriods[k]>=.5&&+r.mathPeriods[k]<=24)s.goals[goal].mathPeriods[k]=+r.mathPeriods[k];
  for(const [k]of periodKeys)if(Number.isFinite(+r.periods?.[k])&&+r.periods[k]>=.5&&+r.periods[k]<=24)s.goals[goal].periods[k]=+r.periods[k];
 }return s;
}
function update(v,goal,input){
 const s=restore(v),errors=[];if(!supports(goal))return{state:s,errors:['진학 목표를 선택해 주세요.']};
 if(!validMonth(input.startMonth))errors.push('계획 시작월을 선택해 주세요.');
 for(const k of ['goalMonth','entryMonth'])if(input[k]&&!validMonth(input[k]))errors.push('목표월과 입학 예정월은 연·월로 입력해 주세요.');
 const n={...s.goals[goal],...input,includeContest:input.includeContest==='on',extendedMath:input.extendedMath==='on',periods:{},mathPeriods:{}};
 for(const [key,title]of mathKeys){const value=+input['math-'+key];if(!Number.isFinite(value)||value<.5||value>24)errors.push(title+'의 계획 기간을 0.5~24개월로 입력해 주세요.');else n.mathPeriods[key]=value;}
 for(const [key,title,defaultMonths]of periodKeys){const value=+input[key];if(!Number.isFinite(value)||value<.5||value>24)errors.push(title+'의 계획 기간을 0.5~24개월로 입력해 주세요.');n.periods[key]=Number.isFinite(value)?value:defaultMonths;}
 const globalState={...s,science:input.science,scienceStatus:input.scienceStatus,language:input.language};
 for(const [prefix,status,stage]of [['science',input.scienceStatus,input.science],['prep',input.prepStatus,input.prep],['post',input.postStatus,input.post]]){
  const done=input[prefix+'Done']===''?null:Number(input[prefix+'Done']),total=input[prefix+'Total']===''?null:Number(input[prefix+'Total']);
  if(status!=='done'&&!['unknown','none','complete'].includes(stage)&&(done!==null||total!==null)&&(!Number.isInteger(done)||!Number.isInteger(total)||done<0||total<1||total>9999||done>=total))errors.push('각 과정의 완료 분량은 전체보다 작은 정수여야 합니다. 다 마쳤다면 완료를 선택하세요.');
  if(prefix==='science'){globalState.scienceDone=done;globalState.scienceTotal=total;}else{n[prefix+'Done']=done;n[prefix+'Total']=total;}
 }
 if(errors.length)return{state:s,errors};globalState.goals[goal]=n;return{state:restore(globalState),errors:[]};
}
function offset(m,month){if(!validMonth(month))return null;const [y,mo]=month.split('-').map(Number);return(y-m.year)*12+mo-m.month;}
function fraction(status,done,total){return status==='done'?1:Number.isFinite(done)&&Number.isFinite(total)&&total>0&&done>=0&&done<total?done/total:0;}
function model(answers,fields,value,goal,curriculumState,options={}){
 const s=restore(value),r=s.goals[goal]||s.goals.medicine,base=C.model(answers,fields,{...C.restore(curriculumState),periods:{...C.restore(curriculumState).periods,...r.mathPeriods}}),medical=goal==='medicine';
 const m={...base,goal,goalTitle:GOALS[goal]||'진학',goalPhase:r.phase,kind:'goal',state:{...base.state,goalRoute:goal},lanes:base.lanes.filter(l=>l.id!=='kmo'||r.includeContest),warnings:[...base.warnings.filter(t=>r.includeContest||!/(KMO|기초반|입문반)/.test(t))],entry:null,introEntry:null,complete:false};
 if(medical&&!r.extendedMath)m.lanes=m.lanes.map(l=>l.id==='school'?{...l,blocks:l.blocks.filter(b=>!['미적분Ⅱ','기하'].includes(b.stage)||b.current)}:l);
 for(const l of m.lanes)if(l.id==='deep'&&l.current?.includes('KMO')){l.current='현재 교과에서 필요한 심화를 선택';m.depthReady=null;if(!r.includeContest)m.warnings.push('별도 심화가 없다면 현재 교과에서 스스로 풀 수 있는 범위를 확인하고 심화 과정을 선택해 주세요.');}
 const math=m.lanes.find(l=>l.id==='school')?.blocks||[],a=I.effective(answers),actual=C.actual(a,'school',fields);
 const readyAt=stage=>{const b=math.find(b=>b.stage===stage);if(b)return b.end;const ranks=['1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2','5-1','5-2','6-1','6-2','초등 계통 대수심화',...g.Planner.MID,...I.highSubjects],rank=ranks.indexOf(stage);return actual&&actual.index>rank||actual&&actual.stage===stage&&actual.done?0:null;};
 const science={id:'scienceCore',title:'과학 핵심',current:SCIENCE.find(x=>x.id===s.science)?.title|| (s.science==='complete'?'현재 선택 범위 완료':'현재 과학 확인 필요'),blocks:[]};
 let cursor=0,basicReady=null,highReady=null;
 const scienceIndex=SCIENCE.findIndex(x=>x.id===s.science);
 if(scienceIndex>=0){
  if(scienceIndex>1)basicReady=0;if(scienceIndex>4)highReady=0;
  for(let i=scienceIndex+(s.scienceStatus==='done'?1:0);i<SCIENCE.length-(medical&&scienceIndex<5?1:0);i++){
   const phase=SCIENCE[i],current=i===scienceIndex&&s.scienceStatus!=='done',f=current?fraction(s.scienceStatus,s.scienceDone,s.scienceTotal):0,full=r.periods['science-'+phase.id]||phase.months;
   let start=cursor;
   if(!current&&i>=3){const mathReady=readyAt('공통수학1');if(mathReady!==null)start=Math.max(start,mathReady);else{m.warnings.push('고등 과학의 시작월은 공통수학 준비 상태를 확인한 뒤 연결합니다.');break;}}
   const end=Math.round((start+full*(1-f))*1000)/1000;
   science.blocks.push({...phase,id:'goal-science-'+phase.id,start,end,full,fraction:f,guide:'science',tasks:phase.tasks+(medical&&phase.id==='high'?' 생명·화학 외에도 학교와 대학이 안내하는 이수 범위를 함께 확인합니다.':''),books:[phase.material]});cursor=end;
   if(i===1)basicReady=end;if(i===4)highReady=end;
  }
  if(s.scienceStatus==='done'&&scienceIndex===1)basicReady=0;if(s.scienceStatus==='done'&&scienceIndex===4)highReady=0;
 }else if(s.science==='complete'){basicReady=0;highReady=0;}else m.warnings.push('과학은 수학 진도로 추정하지 않습니다. 현재 과학 과정·완료 분량을 입력하면 그 범위부터 이어집니다.');
 m.lanes.push(science);
 const language={id:'languageCore',title:'국어·영어·학습 습관',current:LANG[s.language],blocks:[]};
 if(s.language!=='unknown')language.blocks.push({id:'goal-language-routine',title:LANG[s.language]+' · 읽기·요약·서술',start:0,end:24,sustained:true,continues:true,tasks:'현재 수준에서 어휘·독해를 꾸준히 공부하고 핵심과 인과관계를 요약합니다. 영어는 읽고 설명하는 힘을 유지합니다. 매달 지문과 풀이를 보고 다음 수준을 정하며, 달이 지났다는 이유로 수준을 자동 올리지 않습니다.'});
 language.blocks.push({id:'goal-study-habits',title:'주간 계획·백지복습·풀이 설명',start:0,end:24,sustained:true,continues:true,tasks:'계획한 분량과 실제 수행을 나누어 기록합니다. 과학은 배운 개념을 백지에서 연결하고 수학은 해설 없이 풀이를 설명합니다. 스마트폰 사용 규칙과 복습·수면 시간을 함께 정합니다.'});m.lanes.push(language);
 const post=r.phase!=='prepare',steps=post?POST:PREP,key=post?'post':'prep',stage=r[key],status=r[key+'Status'],index=stage==='none'?0:steps.findIndex(x=>x.id===stage)+(status==='done'?1:0),prep={id:'goalPreparation',title:post?'입학 이후 연결':'탐구·서술·지원 준비',current:post?PHASES[r.phase]:stage==='none'?'탐구 질문부터 시작':steps.find(x=>x.id===stage)?.title||'현재 준비 범위 확인 필요',blocks:[]};
 cursor=0;
 if(!['unknown','complete'].includes(stage))for(let i=Math.max(0,index);i<steps.length;i++){
  const phase=steps[i],current=stage!=='none'&&i===index&&status!=='done',f=current?fraction(status,r[key+'Done'],r[key+'Total']):0,full=r.periods[key+'-'+phase.id]||phase.months;
  let start=cursor;
  if(!post&&phase.id==='experiment'&&!current){if(basicReady!==null)start=Math.max(start,basicReady);else{m.warnings.push('탐구·실험의 다음 일정은 과학 기본의 현재 범위를 확인한 뒤 연결합니다.');break;}}
  if(!post&&phase.id==='interview'&&!current){const target=offset(m,r.goalMonth);if(target===null){m.warnings.push('지원 준비 목표월을 선택하면 면접·MMI 준비를 그 앞에 연결합니다. 현재 원서·면접 마감일을 자동 지정하지 않습니다.');break;}start=Math.max(start,target-full);}
  if(post&&phase.id==='calculus'&&!current){const mathReady=readyAt('기하');if(mathReady===null){m.warnings.push('대학 수준 미적분학은 실제 고등 수학 이수 범위를 확인한 뒤 연결합니다.');break;}start=Math.max(start,mathReady);}
  const end=Math.round((start+full*(1-f))*1000)/1000;
  prep.blocks.push({...phase,id:'goal-'+key+'-'+phase.id,title:medical&&phase.id==='interview'?'MMI·자료 해석·소통 준비':phase.title,start,end,full,fraction:f,tasks:phase.tasks,guide:'choice'});cursor=end;
 }
 if(stage==='complete')m.warnings.push('선택한 준비 범위는 완료로 기록했습니다. 현재 진학 단계에 맞는 다음 과정을 선택하세요.');
 m.lanes.push(prep);
 const target=offset(m,r.goalMonth),entry=offset(m,r.entryMonth);
 if(target!==null){const missing=[...math.filter(b=>medical?I.highSubjects.includes(b.stage):g.Planner.MID.includes(b.stage)),...science.blocks.filter(b=>medical?b.id==='goal-science-integrated':b.id==='goal-science-middle'),...prep.blocks].filter(b=>b.end>target);if(missing.length)m.warnings.push('현재 기간대로라면 목표월 뒤로 이어지는 과정이 '+missing.length+'개입니다. 목표와 핵심 범위·학습량을 다시 정하며, 남은 기간에 맞춰 자동 압축하지 않습니다.');}
 if(entry!==null&&post&&prep.blocks.some(b=>b.id==='goal-post-review'&&b.end>entry))m.warnings.push('입학 전 정리 계획이 입력한 입학 예정월 이후까지 이어집니다. 학교 과제와 실제 남은 범위를 보고 기간을 조정해 주세요.');
 m.sources=medical?['의대 표준 학습 로드맵 강의','SKY·의치한 및 의학계열 로드맵 사진']:['영과고·KMO 준비 로드맵 사진','프라이빗노트 심화·계단 쪼개기 강의','영과고 입학 이후 강의'];
 m.horizon=Math.max(24,...m.lanes.flatMap(l=>l.blocks.map(b=>b.end)));m.assumptions='현재 교과·심화·과학의 과정과 완료 분량에서 이어지는 '+m.goalTitle+' 학습 계획입니다. 자료에 기간이 정해지지 않은 탐구·언어·면접 등은 조정 가능한 설계 주기입니다. 학교별 권장·필수 이수, 지원자격·지역인재·전형 일정은 해당 연도의 공식 요강으로 따로 확인합니다.';
 return g.PlannerLearningEvidence?.attachReviews(m,options.evidence)||m;
}
function controls(value,goal,m){
 const s=restore(value),r=s.goals[goal],select=(name,label,items,value)=>`<label>${label}<select name="${name}">${items.map(([id,t])=>`<option value="${id}"${value===id?' selected':''}>${esc(t)}</option>`).join('')}</select></label>`,counts=(prefix,status,done,total)=>`${select(prefix+'Status','현재 과정의 상태',[['progress','진행 중'],['done','완료 · 다음 과정부터']],status)}<div class="curriculum-fields"><label>전체 분량<input name="${prefix}Total" type="number" min="1" max="9999" value="${total??''}"></label><label>완료 분량<input name="${prefix}Done" type="number" min="0" max="9999" value="${done??''}"></label></div>`;
 return `<form data-goal-curriculum-form class="curriculum-form"><p>${GOALS[goal]}의 학습 순서를 현재 진도에서 계산합니다. 전체·완료는 단원·회차·쪽수 중 같은 단위로 입력하세요. 모르면 비워 두고 전체 기간으로 잡습니다.</p><label>계획 시작월<input name="startMonth" type="month" value="${m.year}-${String(m.month).padStart(2,'0')}" required></label>${goal!=='medicine'?select('phase','현재 진학 단계',Object.entries(PHASES),r.phase):'<input type="hidden" name="phase" value="prepare">'}${select('science','현재 과학 과정',[['unknown','확인 전'],...SCIENCE.map(x=>[x.id,x.title]),['complete','현재 선택 범위 완료']],s.science)}${counts('science',s.scienceStatus,s.scienceDone,s.scienceTotal)}${select('language','현재 독해·요약 범위',Object.entries(LANG),s.language)}<label>지원 준비 목표월 · 선택<input name="goalMonth" type="month" value="${r.goalMonth||''}"></label><p>스스로 정한 준비 목표입니다. 원서·면접의 실제 마감일은 공식 요강에서 확인합니다.</p>${goal!=='medicine'?`<label>입학 예정월 · 선택<input name="entryMonth" type="month" value="${r.entryMonth||''}"></label>`:'<input type="hidden" name="entryMonth" value="">'}<details open><summary>현재 탐구·서술 준비</summary>${select('prep','어디까지 했나요?',[['none','질문 만들기부터'],...PREP.map(x=>[x.id,x.title]),['complete','선택 범위를 모두 마침'],['unknown','현재 범위 확인 전']],r.prep)}${counts('prep',r.prepStatus,r.prepDone,r.prepTotal)}</details>${goal!=='medicine'?`<details${r.phase!=='prepare'?' open':''}><summary>합격 후·재학 중 수학 연결</summary>${select('post','현재 입학 이후 준비',[['none','입학 전 정리부터'],...POST.map(x=>[x.id,x.title]),['complete','선택 범위를 모두 마침']],r.post)}${counts('post',r.postStatus,r.postDone,r.postTotal)}</details>`:'<input type="hidden" name="post" value="none"><input type="hidden" name="postStatus" value="progress"><input type="hidden" name="postDone" value=""><input type="hidden" name="postTotal" value="">'}<label${goal!=='medicine'?' hidden':''}><span><input name="extendedMath" type="checkbox"${r.extendedMath?' checked':''}> 미적분Ⅱ·기하 등 추가 심화도 연결</span></label><label><span><input name="includeContest" type="checkbox"${r.includeContest?' checked':''}> 경시 계획도 함께 연결</span></label><details><summary>과정별 계획 기간 조정</summary><p>중등 심화 브릿지는 복습을 포함한 전체 6개월 기준입니다. 나머지는 현재 범위와 학교 과제에 맞춰 조정합니다. 언어·주간 학습 습관은 계속 병행합니다.</p><div class="curriculum-fields">${mathKeys.map(([key,title])=>`<label>${esc(title)} · 개월<input name="math-${key}" type="number" min="0.5" max="24" step="0.5" value="${m.durations[key]}" required></label>`).join('')}${periodKeys.map(([key,title,n])=>`<label${goal==='medicine'&&key.startsWith('post-')?' hidden':''}>${esc(title)} · 개월<input name="${key}" type="number" min="0.5" max="24" step="0.5" value="${r.periods[key]||n}" required></label>`).join('')}</div></details><p role="alert" data-goal-curriculum-error></p><button type="submit" class="curriculum-apply">현재 진도로 핵심 과정·일정 계산</button><button type="button" data-current-area="schoolCourse">현재 교과·완료 분량 수정</button><button type="button" data-current-area="deepCourse">현재 심화·완료 분량 수정</button></form>`;
}
g.PlannerGoalCurriculum=Object.freeze({GOALS,SCIENCE,PREP,POST,PHASES,LANG,periodKeys,supports,restore,update,model,controls,offset});
})(window);
