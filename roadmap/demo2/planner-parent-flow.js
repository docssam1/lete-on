/* Parent entry: current study is input; university preparation is the horizon.
 * Automatic proposals never assert attainment or enrolment in an academy. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={korean:'국어',science:'과학',gifted:'영재원',hwangso:'황소',nute:'누테'};
function preferences(value){const p=value?.version===1?value:{};return {version:1,currentAge:/^(?:[3-9]|1[0-9])$/.test(String(p.currentAge||''))?String(p.currentAge):'',initialized:p.initialized===true,enabled:Object.fromEntries(Object.keys(names).map(id=>[id,typeof p.enabled?.[id]==='boolean'?p.enabled[id]:true])),ranges:{...p.ranges},actualBooks:{...p.actualBooks},statuses:{...p.statuses},stages:{...p.stages},academyReports:{...p.academyReports},solo:String(p.solo||'').slice(0,600)};}
function ageCopy(age,grade){
 const n=Number(age),young=n<=7||n===8&&grade==='pre',low=!young&&(n<=9||n<=10&&['1','2'].includes(grade)),tier=young?'preschool':low?'elementary-low':n<=13?'elementary-upper':n<=16?'middle':'high';
 const rows={
  preschool:{intro:'지금 하는 수 놀이·사고력 활동·연산부터 알려주세요. 교재가 없어도 하고 있는 활동을 적을 수 있어요.',bookLabel:'교재 또는 하고 있는 활동',book:'예: 수 세기 활동 · 지금 보는 수학책',range:'예: 10까지 세기 · 모양 찾기',solo:'예: 10까지 혼자 세고, 규칙 찾기는 함께해요.',order:['thinking','calc','school','deep'],labels:{thinking:'수 놀이·사고력',calc:'수 개념·연산',school:'교과 수학 (하고 있다면)',deep:'응용·심화 (하고 있다면)'}},
  'elementary-low':{intro:'지금 하는 교과수학·연산·사고력 공부를 알려주세요. 문제를 읽거나 풀이를 설명할 때 도움이 필요한지도 함께 봐요.',bookLabel:'지금 공부하는 교재',book:'예: 현재 교과·연산·사고력 교재',range:'예: 덧셈과 뺄셈 · 2단원',solo:'예: 덧셈은 혼자 풀고, 문장제는 같이 읽어요.',order:['school','calc','thinking','deep'],labels:{school:'교과 수학',calc:'연산',thinking:'사고력',deep:'응용·심화 (선택)'}},
  'elementary-upper':{intro:'현재 교과 진도와 응용·심화, 연산·사고력에서 공부하는 범위를 알려주세요. 앞선 과정을 하고 있어도 그대로 적어 주세요.',bookLabel:'지금 공부하는 교재',book:'예: 현재 교과·응용·심화 교재',range:'예: 분수의 나눗셈 · 3단원',solo:'예: 분수 계산은 혼자 풀고, 도형 응용은 힌트가 필요해요.',order:['school','deep','thinking','calc'],labels:{school:'교과 수학',deep:'응용·심화',thinking:'사고력·경시 (선택)',calc:'연산'}},
  middle:{intro:'지금 공부하는 학기·과목과 교재를 알려주세요. 개념·유형과 심화를 나누고, 혼자 풀 수 있는 범위를 함께 확인해요.',bookLabel:'현재 학습 중인 교재',book:'예: 개념원리 · 쎈 · 현재 심화 교재',range:'예: 일차함수 · 12~15쪽',solo:'예: 방정식 기본 문제는 혼자 풀고, 함수 활용은 힌트가 필요해요.',order:['school','deep','thinking','calc'],labels:{school:'교과 개념·유형',deep:'심화·활용',thinking:'경시·사고력 (선택)',calc:'계산·연산 (선택)'}},
  high:{intro:'지금 배우는 과목과 교재, 개념·유형 중 혼자 풀 수 있는 범위를 알려주세요. 심화 학습은 따로 적고, 아직 배우지 않은 과목은 비워 두세요.',bookLabel:'현재 학습 중인 교재',book:'예: 기본정석·쎈 · 지금 공부하는 교재',range:'예: 지수함수 · 해당 소단원',solo:'예: 지수함수 유형은 혼자 풀고, 고난도 문제는 힌트가 필요해요.',order:['school','deep','thinking','calc'],labels:{school:'교과 개념·유형',deep:'심화·활용',thinking:'경시·사고력 (선택)',calc:'계산·연산 (선택)'}}
 };
 return {tier,soloLabel:young?'혼자 할 수 있는 활동·범위':'혼자 풀 수 있는 범위',...rows[tier]};
}
function memberGrade(member){const n=Number(member?.grade);return member?.school==='preschool'?'pre':member?.school==='middle'&&n>=1&&n<=3?String(n+6):member?.school==='high'&&n>=1&&n<=3?String(n+9):n>=1&&n<=12?String(n):'';}
function stageValue(a,axis){const course=a[axis+'Course'];if(['none','unknown'].includes(course))return course;if(course==='high'||course==='foreign')return 'h:'+(axis==='school'?a.schoolHigh:a.deepStage);if(course==='mid')return 'm:'+(axis==='school'?a.schoolExact:a.deepStage);return /^\d-[12]$/.test(axis==='school'?a.school:a.deepStage)?'e:'+(axis==='school'?a.school:a.deepStage):'unknown';}
function stages(){return [['unknown','현재 범위를 모르겠어요'],['none','지금은 공부하지 않아요'],...Array.from({length:12},(_,i)=>['e:'+g.Planner.SEM(i+1),'초등 '+g.Planner.SEM(i+1)]),...g.Planner.MID.map((v,i)=>['m:'+(14+i),v]),...g.PlannerIntake.highSubjects.map(v=>['h:'+v,v])];}
function thinkingBooks(){return [['unknown','지금 하는 교재가 없거나 확인 전'],['none','아직 시작 전'],...g.PlannerIntake.thinking.map(v=>[v,v]),...g.Planner.COMP.map((b,i)=>['x:'+i,b[0]])];}
function calcBooks(){return [['unknown','현재 범위 확인 전'],['none','아직 시작 전'],...g.PlannerIntake.calc.map(([v,label])=>[v,label]),...g.Planner.CALC.slice(12).map((b,i)=>['x:'+(i+12),b[0]]),...g.PlannerIntake.highSubjects.map(v=>['h:'+v,'고등 연산 · '+v])];}
function isAcademyBook(value){return /(?:\bray\s*(?:kids\s*)?[ab]\s*\d|소마|필즈|황소|누테|더클래식|돌파수학|원수학|이든수학|학원.{0,15}(?:교재|숙제))/iu.test(String(value||''));}
const compact=v=>String(v||'').replace(/\s+/g,'').toLowerCase();
function resolveBook(axis,value,course){
 const raw=String(value||'').trim().slice(0,100);if(!raw||['none','unknown'].includes(raw))return {stored:raw||'unknown',actual:'',custom:false};
 const list=axis==='school'||axis==='deep'?(course?g.PlannerIntake.bookList(course,axis==='school'?'school':'deep').map(v=>[v,g.PlannerIntake.bookName(v)]):[]):axis==='thinking'?thinkingBooks():calcBooks();
 const match=list.find(([id,label])=>compact(id)===compact(raw)||compact(label)===compact(raw));
 return match?{stored:match[0],actual:match[1],custom:false}:{stored:'unknown',actual:raw,custom:true};
}
function fraction(value){const m=String(value||'').match(/^\s*(\d+)\s*\/\s*(\d+)\s*(단원|쪽|회차|%)\s*$/u);if(!m)return null;const done=Number(m[1]),total=Number(m[2]);return Number.isInteger(done)&&total>0&&total<=9999&&done>=0&&done<total?{done,total,unit:({단원:'unit',쪽:'page',회차:'session','%':'percent'})[m[3]],...(m[3]==='%'?{approximate:true}:{})}:null;}
function build(input,previous={}){
 const I=g.PlannerIntake,a={...previous},p=preferences(previous.parentFlow),grade=String(input.grade||'');
 if(!/^(pre|[1-9]|1[0-2])$/.test(grade))throw Error('현재 학년을 확인해 주세요.');
 if(input.age&&!/^(?:[3-9]|1[0-9])$/.test(String(input.age)))throw Error('현재 나이를 확인해 주세요.');
 if(input.age)p.currentAge=String(input.age);
 if(grade==='pre'&&!['3','4','5','6','7','8'].includes(String(input.age)))throw Error('미취학 아이의 나이를 확인해 주세요.');
 a.grade=grade;a.gradeInput='current';if(grade==='pre')a.age=String(input.age);
 let supplied=0;
 for(const axis of ['school','deep']){
  const row=input[axis]||{},value=String(row.stage||'unknown'),parts=value.split(':'),course={e:'elem',m:'mid',h:'high'}[parts[0]];
  if(!course&&!['none','unknown'].includes(value))throw Error('현재 공부 범위를 다시 확인해 주세요.');
  if(course&&!stages().some(([id])=>id===value))throw Error('현재 학기·과목을 다시 확인해 주세요.');
  a[axis+'Course']=course||value;
  if(course){
   const resolved=resolveBook(axis,row.book,course),book=resolved.stored;p.actualBooks[axis]=resolved.actual;p.stages[axis]=value;
   a[axis+'Book']=book;
   if(axis==='school'){a.school=course==='elem'?parts[1]:'advanced';if(course==='mid')a.schoolExact=parts[1];if(course==='high')a.schoolHigh=parts[1];}
   else a.deepStage=parts[1];
   if(p.actualBooks[axis])supplied++;
  }else{a[axis+'Book']=value;p.actualBooks[axis]='';p.stages[axis]=value;}
  a[axis+'Status']=row.status==='done'?'done':'progress';p.statuses[axis]=a[axis+'Status'];
  const status=axis+'Status';if(a[axis+'Book']!==previous[axis+'Book']||stageValue(a,axis)!==stageValue(previous,axis)||a[status]!==previous[status])delete a[I.progressKey(status)];
  p.ranges[axis]=String(row.range||'').trim().slice(0,160);
 }
 const thinking=input.thinking||{},tr=resolveBook('thinking',thinking.book),tb=tr.stored;p.actualBooks.thinking=tr.actual;
 a.thinkingExperience=['unknown','none'].includes(tb)?tb:'yes';
 a.thinking=tb.startsWith('x:')?'advanced':tb;if(tb.startsWith('x:'))a.compExact=tb.slice(2);
 a.thinkingStatus=thinking.status==='done'?'done':'progress';
 if(a.thinking!==previous.thinking||a.compExact!==previous.compExact||a.thinkingStatus!==previous.thinkingStatus)delete a[I.progressKey('thinkingStatus')];
 p.ranges.thinking=String(thinking.range||'').trim().slice(0,160);if(tr.actual)supplied++;p.statuses.thinking=a.thinkingStatus;
 const calc=input.calc||{},cr=resolveBook('calc',calc.book),cb=cr.stored;p.actualBooks.calc=cr.actual;
 a.calc=cb.startsWith('x:')?'advanced':cb.startsWith('h:')?'high':cb;if(cb.startsWith('x:'))a.calcExact=cb.slice(2);if(cb.startsWith('h:'))a.calcHigh=cb.slice(2);
 a.calcStatus=calc.status==='done'?'done':'progress';if(a.calc!==previous.calc||a.calcExact!==previous.calcExact||a.calcHigh!==previous.calcHigh||a.calcStatus!==previous.calcStatus)delete a[I.progressKey('calcStatus')];
 p.ranges.calc=String(calc.range||'').trim().slice(0,160);if(cr.actual)supplied++;p.statuses.calc=a.calcStatus;
 if(!supplied)throw Error('공부 중인 교재나 연산 범위를 한 가지 이상 알려주세요.');
 for(const [axis,status]of [['school','schoolStatus'],['deep','deepStatus'],['thinking','thinkingStatus'],['calc','calcStatus']]){const range=fraction(p.ranges[axis]);if(range&&a[status]==='progress')a[I.progressKey(status)]={...range,course:I.progressCourse(a,status)};}
 for(const axis of ['school','deep','thinking','calc']){const book=p.actualBooks[axis],stored=axis==='thinking'?a.thinking:axis==='calc'?a.calc:a[axis+'Book'];if(isAcademyBook(book)||isAcademyBook(stored)){p.academyReports[axis]={book:String(input[axis]?.book||book).slice(0,100),range:p.ranges[axis],status:p.statuses[axis]};p.actualBooks[axis]='';p.ranges[axis]='';delete a[I.progressKey(axis+'Status')];if(axis==='thinking'){a.thinkingExperience='unknown';a.thinking='unknown';delete a.compExact;}else if(axis==='calc'){a.calc='unknown';delete a.calcExact;}else a[axis+'Book']='unknown';}else delete p.academyReports[axis];}
 p.solo=String(input.solo||'').trim().slice(0,600);a.parentFlow=p;
 // No academy attendance, exam preparation, mastery or previous completion inferred.
 if(a.hw===undefined)a.hw='pending';if(a.gifted===undefined)a.gifted='pending';
 return a;
}
function inputModel(a={},member={}){const p=preferences(a.parentFlow);return {grade:a.grade||memberGrade(member),age:p.currentAge||(a.grade==='pre'?a.age:'')||String((!a.grade||a.grade==='pre')&&member.school==='preschool'&&(member.age||member.grade)||''),school:{stage:stageValue(a,'school'),book:p.actualBooks.school||p.academyReports.school?.book||a.schoolBook||'unknown',status:a.schoolStatus||'progress',range:p.ranges.school||p.academyReports.school?.range||''},deep:{stage:stageValue(a,'deep'),book:p.actualBooks.deep||p.academyReports.deep?.book||a.deepBook||'unknown',status:a.deepStatus||'progress',range:p.ranges.deep||p.academyReports.deep?.range||''},thinking:{book:p.actualBooks.thinking||p.academyReports.thinking?.book||(a.thinking==='advanced'?'x:'+a.compExact:a.thinkingExperience==='none'?'none':a.thinking||'unknown'),status:a.thinkingStatus||'progress',range:p.ranges.thinking||p.academyReports.thinking?.range||''},calc:{book:p.actualBooks.calc||p.academyReports.calc?.book||(a.calc==='advanced'?'x:'+a.calcExact:a.calc==='high'?'h:'+a.calcHigh:a.calc||'unknown'),status:a.calcStatus||'progress',range:p.ranges.calc||p.academyReports.calc?.range||''},solo:p.solo};}
let formSequence=0;
function mount(host,{answers={},member={},onSubmit,onAdvanced}={}){
 const formId='parent-current-'+(++formSequence),booksId=axis=>formId+'-books-'+axis;
 const doc=g.document,m=inputModel(answers,member),select=(label,key,options,value)=>`<label>${label}<select name="${key}">${options.map(([id,title])=>`<option value="${esc(id)}"${String(id)===String(value)?' selected':''}>${esc(title)}</option>`).join('')}</select></label>`;
 const bookInput=(axis,options,value)=>`<label data-parent-book-label="${axis}">지금 공부하는 교재<input name="${axis}Book" list="${booksId(axis)}" maxlength="100" value="${esc(['none','unknown'].includes(String(value))?'':(options.find(([id])=>id===value)?.[1]||value))}" placeholder="교재 이름 입력 · 목록에서 선택도 가능" autocomplete="off"><datalist id="${booksId(axis)}">${options.filter(([id])=>!['none','unknown'].includes(id)).map(([,title])=>`<option value="${esc(title)}"></option>`).join('')}</datalist></label>`;
 host.innerHTML=`<form class="parent-current-form">
 <section class="parent-age-intake" aria-labelledby="${formId}-age"><h2 id="${formId}-age">현재 나이를 알려주세요.</h2><p class="parent-intro">연령에 맞는 질문으로 지금 하는 공부를 확인할게요.</p>${select('현재 나이 (한국 나이)','age',[['','나이 선택'],...Array.from({length:17},(_,i)=>[String(i+3),(i+3)+'세'])],m.age)}</section>
 <section data-parent-study-section aria-labelledby="${formId}-study"><h2 id="${formId}-study">지금 진행하고 있는 수학 학습을 알려주세요.</h2><p class="parent-intro" data-parent-age-copy></p>
 <div class="parent-student">${select('현재 학교 단계·학년','grade',[['','학년 확인'],['pre','미취학'],...Array.from({length:12},(_,i)=>[String(i+1),i<6?'초'+(i+1):i<9?'중'+(i-5):'고'+(i-8)])],m.grade)}</div>
 <div class="parent-current-rows">${['school','deep','thinking','calc'].map(axis=>`<fieldset data-parent-axis="${axis}"><legend></legend><div class="parent-current-row">${axis==='school'||axis==='deep'?select('현재 학기·과목',axis+'Stage',stages(),m[axis].stage)+bookInput(axis,[],m[axis].book):bookInput(axis,axis==='thinking'?thinkingBooks():calcBooks(),m[axis].book)}${select('진행 상태',axis+'Status',[['progress','공부 중'],['done','마쳤어요']],m[axis].status)}<label class="parent-range">단원·쪽수 <span>(알면 입력)</span><input name="${axis}Range" maxlength="160" value="${esc(m[axis].range)}"></label></div></fieldset>`).join('')}</div>
 <label class="parent-solo">혼자 풀 수 있는 범위 <span>(선택)</span><textarea name="solo" rows="2" maxlength="600">${esc(m.solo)}</textarea></label>
 <button type="submit" class="parent-primary">우리 아이 로드맵 보기</button><p class="parent-form-note">지금 하는 항목만 적어 주세요. 국어·과학은 결과에서 자동으로 연결합니다. 학원 교재는 수업 참고로만 보관해요.</p>
 ${onAdvanced?'<button type="button" class="parent-advanced">기존 상세 입력으로 수정</button>':''}</section><p role="alert" tabindex="-1" class="parent-form-error"></p></form>`;
 const form=host.querySelector('form'),f=form.elements;
 const books=axis=>{const course={e:'elem',m:'mid',h:'high'}[f[axis+'Stage'].value.split(':')[0]],book=f[axis+'Book'];form.querySelector('#'+booksId(axis)).innerHTML=(course?g.PlannerIntake.bookList(course,axis==='school'?'school':'deep').filter(v=>!/^개념응용 ·/.test(v)).map(v=>g.PlannerIntake.bookName(v)):[]).map(title=>`<option value="${esc(title)}"></option>`).join('');book.disabled=!course;};
 for(const axis of ['school','deep']){books(axis);f[axis+'Stage'].addEventListener('change',()=>books(axis));}
 const visibility=axis=>{const course={e:'elem',m:'mid',h:'high'}[f[axis+'Stage']?.value.split(':')[0]],active=axis==='school'||axis==='deep'?!!course:!!f[axis+'Book'].value.trim()&&!['none','unknown'].includes(f[axis+'Book'].value);f[axis+'Status'].closest('label').hidden=!active;f[axis+'Range'].closest('label').hidden=!active;if(axis==='school'||axis==='deep')f[axis+'Book'].closest('label').hidden=!active;form.querySelector('[data-parent-axis="'+axis+'"]').dataset.active=String(active);};
 for(const axis of ['school','deep','thinking','calc']){visibility(axis);f[axis+'Book'].addEventListener('input',()=>visibility(axis));f[axis+'Stage']?.addEventListener('change',()=>visibility(axis));}
 const adapt=()=>{const selected=!!f.age.value,copy=ageCopy(f.age.value,f.grade.value);form.querySelector('[data-parent-study-section]').hidden=!selected;form.querySelector('[data-parent-age-copy]').textContent=copy.intro;form.dataset.ageTier=copy.tier;form.querySelector('.parent-solo').firstChild.textContent=copy.soloLabel+' ';f.solo.placeholder=copy.solo;for(const axis of copy.order){const row=form.querySelector('[data-parent-axis="'+axis+'"]');row.querySelector('legend').textContent=copy.labels[axis];form.querySelector('[data-parent-book-label="'+axis+'"]').firstChild.textContent=copy.bookLabel;f[axis+'Book'].placeholder=copy.book;f[axis+'Range'].placeholder=copy.range;form.querySelector('.parent-current-rows').append(row);}};adapt();f.age.addEventListener('change',adapt);f.grade.addEventListener('change',adapt);
 form.querySelector('.parent-advanced')?.addEventListener('click',()=>onAdvanced());
 form.onsubmit=async event=>{event.preventDefault();if(form.dataset.busy)return;const input={grade:f.grade.value,age:f.age.value,solo:f.solo.value};for(const axis of ['school','deep','thinking','calc'])input[axis]={stage:f[axis+'Stage']?.value,book:f[axis+'Book'].value,status:f[axis+'Status'].value,range:f[axis+'Range'].value};const error=form.querySelector('[role=alert]');try{if(!input.age)throw Error('현재 나이를 먼저 알려주세요.');const next=build(input,answers);form.dataset.busy='1';const locks=[...form.querySelectorAll('button,input,select,textarea')].map(n=>[n,n.disabled]);form._parentLocks=locks;for(const [n]of locks)n.disabled=true;error.textContent='입력한 공부에서 이어지는 계획을 준비하고 있어요.';await onSubmit(next,input);}catch(e){delete form.dataset.busy;for(const [n,disabled]of form._parentLocks||[])n.disabled=disabled;error.textContent=e.message||'입력한 범위를 다시 확인해 주세요.';error.focus();}};
 return form;
}
function automatic(a,fields,standard,{language,science}={}){
 const I=g.PlannerIntake,p=preferences(a.parentFlow),grade=I.gradeChoice(a,fields),n=Number(grade),now=standard.now,context={grade,age:Number(a.age)||null,year:fields.year,mon:fields.mon};
 const l=g.PlannerLanguage,lang=l?.restore(language);if(lang){const row=lang.subjects.korean;row.enabled=p.enabled.korean;if(!row.current){row.current='unknown';row.focus=grade==='pre'||n<=2?'foundation':'evidence';row.book='current';row.rhythm='keep';}}
 const korean=lang&&l.model(lang,'korean',context);
 const s=g.PlannerScience,sc=s?.normalContext(standard,null,fields),sci=s?.restore(science);if(sci)sci.enabled=p.enabled.science;
 const scienceModel=sci&&s.model(sci,{...sc,grade});
 const scope=a.schoolCourse==='high'?'high':a.schoolCourse==='mid'?'middle':/^6-[12]$/.test(a.school||'')?'upper':'elementary';
 const hwangso={title:'황소 · 학습 범위 점검',text:scope==='middle'||scope==='high'?'중등·고등과정 선발은 중등 대수·함수·기하의 누적 풀이를 확인하는 참고 조건입니다.':grade==='pre'||n<=4?'초등 선발의 사고력·조건 해석을 중간 점검으로 참고합니다. 지금 공부는 현재 교재에서 이어갑니다.':'초등 선발과 중등과정 편입은 범위를 나누어 봅니다. 현재 학기의 응용·심화를 먼저 확인합니다.',stage:scope};
 const nute={title:'누테 · 누적 범위 점검',text:scope==='middle'||scope==='high'?'공통수학 시작반의 참고 조건인 중등 대수·함수·기하 누적 범위를 확인합니다.':'중등 시작반을 살펴볼 때 초5·6 교과 개념·응용·연산의 누적 범위를 확인합니다.',stage:scope};
 const gifted={title:'영재원 · 탐구 경험 연결',text:grade==='pre'||n<=2?'지금은 읽기·조건 설명·관찰 기록을 쌓는 시기입니다. 지원 가능한 학년이 되면 지역 교육청·대학부설 과정을 비교합니다.':n<=6?'현재 교과·사고력과 함께 지역 교육청·대학부설 영재원의 지원 학년·분야·평가 방식을 확인합니다. 이수와 합격을 대학 진학의 필수 조건으로 삼지 않습니다.':'중등 영재원은 영재학교·과학고 방향과 맞을 때 검토합니다. 현재 수학·과학 이수와 대학 진학 준비를 중심에 둡니다.',eligibleNow:grade!=='pre'&&n>=3&&n<=6,candidates:grade==='pre'||n<=2?[]:n<=6?['교육청 영재원 · 교과 적용·서술','대학부설 영재원 · 탐구·설명']:[]};
 return {preferences:p,language:lang,science:sci,korean,scienceModel,context:{...context,now},references:{gifted,hwangso,nute}};
}
function renderResult(m){const on=(id)=>m.preferences.enabled[id],toggle=id=>`<label class="parent-support-toggle"><input type="checkbox" data-parent-support="${id}"${on(id)?' checked':''}>${on(id)?'포함':'꺼짐'}</label>`;
 const korean=m.korean?.tracks?.filter(t=>['vocabulary',m.korean?.course?.young?'foundation':'evidence','writing'].includes(t.id)).slice(0,3)||[],science=m.scienceModel,first= science?.blocks?.find(b=>!b.completed&&Number.isFinite(b.start));
 return `<section class="parent-result" aria-label="현재 공부에서 대학 진학까지"><header><div><h2>현재 공부에서 대학 진학까지</h2><p>지금 교재에서 기본·심화·독립 풀이를 쌓고, 국어·과학과 진학 준비를 함께 이어갑니다.</p></div><button type="button" data-parent-study class="parent-primary">학습하기</button></header><div class="parent-input-summary">${Object.entries(m.preferences.actualBooks).filter(([,book])=>book).map(([axis,book])=>`<p><b>${esc(({school:'교과',deep:'심화·활용',thinking:'사고력',calc:'연산'})[axis])}</b> ${esc(book)}${m.preferences.ranges[axis]?' · '+esc(m.preferences.ranges[axis]):''}</p>`).join('')}</div>${Object.values(m.preferences.academyReports).length?'<p class="parent-result-note">학원 수업 참고 · '+Object.values(m.preferences.academyReports).map(r=>esc(r.book)).join(', ')+' · 학습 과제로 배정하지 않습니다.</p>':''}<p class="parent-result-note">학원은 중간 실력 확인에 참고합니다. 학원 선택 없이 공부하고 점검할 수 있어요.</p><div class="parent-auto-subjects"><article><header><h3>국어</h3>${toggle('korean')}</header>${on('korean')?`<strong>${esc(m.korean?.course?.title||'읽기·어휘·근거 설명')}</strong><p>현재 읽는 책·교과서로 시작하는 기본 제안입니다. 실제 읽기 범위에 맞춰 조절해요.</p><ul>${korean.map(t=>`<li>${esc(t.title)} · ${esc(t.weekly)}</li>`).join('')}</ul>`:'<p>국어 자동 제안을 껐어요. 기존 학습 기록은 남아 있습니다.</p>'}</article><article><header><h3>과학</h3>${toggle('science')}</header>${on('science')?`<strong>${esc(first?.title||'관찰·교과 개념·탐구 설명')}</strong><p>${first?esc(g.PlannerScience.date(science.context,first.start).label)+'부터 · '+esc(first.material||first.scope||'현재 과학 자료로 학습'):'현재 학년의 과학·관찰을 이어가며, 수학의 식·비례·그래프 준비에 맞춰 다음 과정을 연결합니다.'}</p><p>과학 기본 계획을 자동 제안합니다. 이미 배운 단원은 확인해 반복을 줄여요.</p>`:'<p>과학 자동 제안을 껐어요. 기존 이수 기록은 남아 있습니다.</p>'}</article></div><section class="parent-reference-checks"><h3>과정 중 확인할 조건</h3><p>준비 범위를 참고해 부족한 단원을 점검합니다. 지원·수강이나 별도 입학 준비를 자동으로 신청하지 않습니다.</p>${Object.entries(m.references).map(([id,r])=>`<article><header><h4>${esc(r.title)}</h4>${toggle(id)}</header>${on(id)?`<p>${esc(r.text)}</p>${r.candidates?.length?'<ul>'+r.candidates.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul><p class="parent-result-note">추천 검토 대상이며 지원 자격은 지역·지원 학년도 요강에서 확인합니다. <a href="https://ged.kedi.re.kr/slct/noti/slctNotiStat.do" target="_blank" rel="noopener noreferrer">공식 모집요강</a></p>':''}`:''}</article>`).join('')}</section><p class="parent-result-note">이번 주 교재·문항은 ‘학습하기’에서 확인하고, 공부 여부와 혼자 푸는 정도를 따로 기록합니다.</p></section>`;
}
function renderLearning(a,fields){
 const p=preferences(a.parentFlow),stage=a.schoolCourse==='elem'?a.school:a.schoolCourse==='mid'?g.Planner.MID[Number(a.schoolExact)-14]:a.schoolCourse==='high'?a.schoolHigh:null;
 const elementary=/^[1-6]-[12]$/.test(stage||'');
 return `<section class="parent-own-learning" aria-label="지필드 학습하기"><header><h2>현재 범위에서 학습하기</h2><button type="button" data-parent-result>전체 로드맵으로</button></header><p>현재 개념과 풀이 범위에 맞는 지필드 문제로 연습하고, 부족한 유형을 다시 확인해요.</p><div class="parent-learning-areas"><article><h3>교과 확인·보완</h3><p>${esc(stage||'현재 개념 범위 확인')}${p.ranges.school?' · '+esc(p.ranges.school):''}</p>${elementary?`<button type="button" data-parent-unit-bank="${esc(stage)}">지필드 단원 문제 풀기</button>`:'<a href="../../number_magic/index.html">지필드 개념·수학 학습</a>'}</article><article><h3>사고력</h3><p>조건 이해 · 풀이 설명 · 부족 유형 연습</p><a href="../../fields-classic/question-bank/home.html">지필드 사고력 학습</a></article><article><h3>연산</h3><p>원리 확인 · 계산 연습 · 틀린 유형 재점검</p><a href="../../number_magic/index.html">지필드 연산 학습</a></article></div><p class="parent-result-note">공부한 내용과 혼자 해결한 범위를 아래에 따로 기록하세요. 진도와 점검 결과에 따라 다음 공부를 조정합니다.</p></section>`;
}
g.PlannerParentFlow=Object.freeze({preferences,ageCopy,memberGrade,stageValue,stages,thinkingBooks,calcBooks,build,isAcademyBook,resolveBook,fraction,inputModel,mount,automatic,renderResult,renderLearning});
})(typeof window==='undefined'?globalThis:window);
