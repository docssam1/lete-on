import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const context={window:{},console};vm.createContext(context);
for(const f of ['planner.js','demo-content.js','planner-intake.js','planner-high-study.js','planner-curriculum.js','planner-learning-evidence.js','planner-goal-curriculum.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),context);
const {Planner:P,PlannerIntake:I,DemoContent:D}=context.window;
const fields={grade:'2',mon:'10',band:'B',speed:'2'};
const answer={age:'9',thinkingExperience:'yes',thinking:'1031 초급',thinkingStatus:'done',schoolCourse:'elem',schoolBook:'디딤돌 응용',school:'2-1',schoolStatus:'progress',deepCourse:'elem',deepBook:'최상위 S',deepStage:'1-2',deepStatus:'progress',calc:'기적의 계산법 4권',calcStatus:'done',hw:'0',gifted:'0'};
const plain=v=>JSON.parse(JSON.stringify(v));
const row=(a,key,f=fields)=>I.profile(a,f).rows.find(r=>r.key===key);

test('교과와 심화의 교재·과정·상태를 각각 묻고 새 답이 없으면 완료하지 않는다',()=>{
 const order=I.order(answer,fields);
 for(const k of ['schoolBook','school','schoolStatus','deepBook','deepStage','deepStatus'])assert.ok(order.includes(k));
 assert.match(I.questions(answer,fields).schoolBook[0],/교과.*교재/);
 assert.match(I.questions(answer,fields).deepBook[0],/심화.*교재/);
 assert.equal(I.firstMissing(answer,fields),undefined);
 assert.equal(I.firstMissing({...answer,deepStatus:undefined},fields),'deepStatus');
 assert.equal(I.hasAnswer({...answer,deepBook:'A급'},fields,'deepStage'),false);
});

test('교과·심화의 진행/완료는 다른 과목의 계획을 바꾸지 않는다',()=>{
 const before=I.profile(answer,fields),schoolBefore=plain(row(answer,'school')),calcBefore=plain(row(answer,'calc'));
 const done={...answer,deepStatus:'done'},deep=row(done,'deep');
 assert.deepEqual(plain(row(done,'school')),schoolBefore);
 assert.deepEqual(plain(row(done,'calc')),calcBefore);
 assert.match(deep.remaining[0].shortText,/2-1 최상위 S/);
 assert.equal(deep.remaining[0].s,before.now);
 assert.match(row(answer,'deep').remaining[0].shortText,/1-2 최상위 S/);
 const schoolDone={...answer,schoolStatus:'done'};
 assert.equal(I.fieldChanges(schoolDone,fields,'schoolStatus').school,'4');
 assert.match(row(schoolDone,'school').remaining[0].shortText,/2-2/);
 assert.deepEqual(plain(row(schoolDone,'deep')),plain(row(answer,'deep')));
});

test('B→A→B 왕복은 같은 완료 답에서 중급 포함 여부를 다시 계산한다',()=>{
 const a={...answer},fA={...fields,band:'A'};
 assert.equal(I.fieldChanges(a,fields,'band').comp,'6');
 assert.equal(I.fieldChanges(a,fA,'band').comp,'5');
 assert.equal(I.fieldChanges(a,fA,'band').comp,I.fieldChanges(a,fA,'thinkingStatus').comp);
 assert.equal(I.fieldChanges(a,fields,'band').comp,'6');
 assert.deepEqual(a,answer);
});

test('C의 진행/완료 기간은 처음 선택과 묶음 전환에서 일치한다',()=>{
 for(const speed of ['2','3'])for(const status of ['progress','done']){
  const a={...answer,calcStatus:status},f={...fields,band:'C',speed};
  const changed=I.fieldChanges(a,f,'band'),selected=I.fieldChanges(a,f,'calcStatus');
  assert.equal(changed.calcLeft,status==='progress'?'3':'5');
  assert.equal(changed.calcLeft,selected.calcLeft);
  assert.equal(changed.calc,selected.calc);
 }
});

test('고급 연산의 다음 단계는 교과 미시작·사고력 경험 없음에도 그대로 남는다',()=>{
 const a={...answer,calc:'advanced',calcExact:'13',calcStatus:'progress'};
 const expected=plain(row(a,'calc'));
 for(const changed of [{schoolBook:'none'},{thinkingExperience:'none'},{thinkingExperience:'unknown'},{thinking:'키즈팩토'}]){
  const mixed={...a,...changed},r=row(mixed,'calc');
  assert.deepEqual(plain(r),expected);
  assert.match(r.next.shortText,/기적의 중학연산 2AB/);
  assert.ok(I.milestones(mixed,fields,I.profile(mixed,fields)).main.some(m=>/연산.*2AB/.test(m.title)));
 }
});

test('고급 교과와 심화도 다른 영역의 미시작 때문에 사라지지 않는다',()=>{
 const a={...answer,schoolCourse:'mid',schoolBook:'개념원리',school:'advanced',schoolExact:'16',deepCourse:'mid',deepBook:'RPM',deepStage:'14'};
 const changed={...a,thinkingExperience:'none',calc:'none'};
 for(const key of ['school','deep'])assert.deepEqual(plain(row(changed,key)),plain(row(a,key)));
 assert.match(row(changed,'school').next.shortText,/중2-2/);
 assert.match(row(changed,'deep').next.shortText,/중1-2 RPM/);
});

test('미경험과 모름은 과정을 강제로 배정하지 않고 과거 선택도 삭제하지 않는다',()=>{
 for(const value of ['none','unknown']){
  const a={...answer,thinkingExperience:value,schoolBook:value,deepBook:value,calc:value},snapshot=JSON.stringify(a);
  const order=I.order(a,fields);
  // 과정(학년·학기)은 교재보다 먼저 묻는다(원장님 2026-11-11). 교재가 없음·모름이면 상태만 묻지 않는다.
  for(const k of ['thinking','thinkingStatus','schoolStatus','deepStatus','calcStatus'])assert.ok(!order.includes(k));
  const p=I.profile(a,fields);assert.ok(p.rows.every(r=>r.remaining.length===0));
  assert.ok(!I.buildPlan(a,fields).rows.find(r=>r.key==='school2').blocks.length);
  assert.equal(JSON.stringify(a),snapshot);
  assert.equal(I.hasAnswer({...a,thinkingExperience:'yes'},fields,'thinking'),true);
 }
});

test('완료한 최종 과정은 진행 중으로 되돌리지 않는다',()=>{
 const variants=[
  [{calc:'advanced',calcExact:'17',calcStatus:'done'},'calc'],
  [{thinking:'advanced',compExact:'7',thinkingStatus:'done'},'thinking1'],
  [{schoolCourse:'mid',schoolBook:'개념원리',school:'advanced',schoolExact:'19',schoolStatus:'done'},'school'],
  [{deepStage:'6-2',deepStatus:'done'},'deep']
 ];
 for(const [values,key]of variants){const r=row({...answer,...values},key);assert.equal(r.remaining.length,0);assert.equal(r.next,null);}
});

test('원본 출처·한국 나이 월 경계와 과목별 독립 입력을 보존한다',()=>{
 assert.equal(D.SOURCE.sha256,'3fca0e5c0742d2e7c68c7d37a8cf1eef08ace0c0334dea5f4e859811afbc629a');
 assert.equal(I.gradeForAge(8,1),0);assert.equal(I.gradeForAge(8,3),1);
 for(const age of ['4','6','8','9'])for(const mon of ['1','2','3','12'])for(const band of ['A','B','C','D']){
  const a={...answer,age,thinking:'키즈팩토'},f={...fields,mon,band},p=I.profile(a,f);
  assert.equal(p.now,D.monthOf(+age,+mon));assert.equal(p.rows.length,4);
  for(const r of p.rows)for(const b of r.remaining)assert.ok(Number.isFinite(b.s)&&b.e>=b.remainingStart);
  const ms=I.milestones(a,f,p);assert.ok(ms.main.every(m=>Number.isFinite(m.m)));
 }
});

test('기존 답에는 교재·심화 확인을 요구하며 원래 값을 임의로 채우지 않는다',()=>{
 const old={age:'9',thinking:'1031 초급',thinkingStatus:'done',school:'2-1',calc:'기적의 계산법 4권',calcStatus:'done',hw:'pending',gifted:'0'},saved=JSON.stringify(old);
 assert.equal(I.firstMissing(old,fields),'thinkingExperience');
 assert.equal(I.firstMissing({...old,thinkingExperience:'yes'},fields),'schoolCourse');
 I.profile(old,fields);I.summary(old,fields);assert.equal(JSON.stringify(old),saved);
});


test('초등·중등 교재 목록과 A/B/C/D 표준을 구분한다',()=>{
 for(const band of ['A','B','C','D']){
  const f={...fields,band};
  for(const course of ['elem','mid']){
   const a={...answer,schoolCourse:course,deepCourse:course},q=I.questions(a,f);
   for(const [v]of q.schoolBook[2])assert.equal(I.middleBook(v),course==='mid');
   for(const [v]of q.deepBook[2])assert.equal(I.middleBook(v),course==='mid');
   if(band!=='D')assert.ok(q.schoolBook[1].includes(I.standardBook(band,course,'school')));
  }
 }
 assert.equal(I.standardBook('A','mid','school'),'원리해설');
 assert.equal(I.standardBook('B','mid','deep'),'A급');
 assert.equal(I.standardBook('C','mid','school'),'개념원리');
 assert.equal(I.standardBook('C','mid','deep'),'RPM · 응용 반복');
 assert.equal(I.standardBook('D','mid','school'),'개념응용 · 최상위라이트');
 assert.equal(I.standardBook('D','elem','school'),'개념응용 · 최상위');
});

test('과정 미시작 선택도 옛 교재·과정 값을 지우지 않는다',()=>{
 const a={...answer,schoolCourse:'none',deepCourse:'unknown'},saved=JSON.stringify(a),p=I.profile(a,fields);
 assert.ok(!I.order(a,fields).includes('schoolBook'));
 assert.ok(!I.order(a,fields).includes('deepBook'));
 assert.equal(row(a,'school').remaining.length,0);assert.equal(row(a,'deep').remaining.length,0);
 assert.equal(JSON.stringify(a),saved);assert.equal(a.school,'2-1');assert.equal(a.deepBook,'최상위 S');
 assert.ok(p.rows.find(r=>r.key==='calc').remaining.length>0);
});

test('교재·과정을 바꿔 상태 확인이 필요하면 옛 완료 답을 자동 적용하지 않는다',()=>{
 const f={...fields,pendingStatus:{deepStatus:true}};
 assert.equal(I.hasAnswer(answer,f,'deepStatus'),false);
 assert.equal(I.firstMissing(answer,f),'deepStatus');
 assert.match(I.summary(answer,f).find(x=>x.label==='심화').text,/상태 확인 전/);
});

test('D에서도 입력한 중등 교과는 표준 예시의 초등 시작점으로 되돌리지 않는다',()=>{
 const a={...answer,schoolCourse:'mid',schoolBook:'개념응용 · 최상위라이트',school:'advanced',schoolExact:'16',schoolStatus:'progress'};
 const f={...fields,band:'D'},p=I.buildPlan(a,f),current=p.rows.find(r=>r.key==='school').blocks.find(b=>b[1]<=p.now&&b[2]>=p.now);
 assert.match(current[0],/중2-1 개념응용 · 최상위라이트/);
});

// Execute the actual storage/controller functions with in-memory controls.
// No browser storage or production endpoints are used by these fixtures.
function storageFixture(saved){
 const ui=readFileSync(new URL('planner-ui.js',import.meta.url),'utf8');
 const values={grade:'2',mon:'10',band:'B',speed:'2',hw:'57'};
 const els=Object.fromEntries(Object.entries(values).map(([k,value])=>[k,{value,type:'select-one',options:[]} ]));
 els.hw.options=[{value:'57'}];
 const storageKey='gfield.demo2.v1',stored=new Map([[storageKey,JSON.stringify(saved)]]);let asked=null;
 const c={I,console,answers:{},history:[],manualPeriods:{},pendingStatus:{},legacyDraft:null,state:{},completed:false,question:'age',draftIds:['grade','mon','band','speed','hw','comp','compLeft','calc','calcLeft'],
  restoredRoadmapMode:null,standardPattern:null,standardAccepted:false,CP:context.window.PlannerCurriculum,curriculumState:null,LE:context.window.PlannerLearningEvidence,GP:context.window.PlannerGoalCurriculum,learningEvidence:null,goalCurricula:null,
  $:id=>els[id]||(els[id]={value:'',type:'select-one',options:[]}),
  PlannerStorage:{getItem:key=>stored.get(key)??null,setItem:(key,value)=>{stored.set(key,String(value));}},
  questionOrder:()=>I.order(c.answers,c.intakeFields()),storageKey,hwOptions(){},setSeg(){},draw(){},finish(){},ask(key){asked=key;},
  intakeFields:()=>({grade:els.grade.value,mon:els.mon.value,band:els.band.value,speed:els.speed.value,pendingStatus:c.pendingStatus})};
 vm.createContext(c);
 vm.runInContext(ui.slice(ui.indexOf('function saveDraft(){'),ui.indexOf("let question='grade';")),c);
 vm.runInContext(ui.slice(ui.indexOf('function applyAnswerChanges(key){'),ui.indexOf('function ask(key){')),c);
 return {c,els,get stored(){return JSON.parse(stored.get(storageKey));},get asked(){return asked;}};
}

test('v1 임시 저장은 원문 스냅샷과 답을 보존하고 새 교과·심화 질문을 요청한다',()=>{
 const old={version:1,answers:{age:'9',thinking:'1031 초급',thinkingStatus:'done',school:'2-1',calc:'기적의 계산법 4권',calcStatus:'done',hw:'pending',gifted:'0'},history:['age','thinking'],completed:true,question:'gifted',state:{hwOn:'pending',gifted:'0'},fields:{grade:'2',mon:'10',band:'B',speed:'2',hw:'57',comp:'6',compLeft:'4',calc:'4',calcLeft:'2'}};
 const f=storageFixture(old);assert.equal(f.c.restoreDraft(),true);
 assert.equal(f.asked,'thinkingExperience');
 assert.deepEqual(plain(f.c.answers),old.answers);
 f.c.saveDraft();assert.equal(f.stored.version,2);
 assert.deepEqual(f.stored.legacyDraft,old);
 assert.deepEqual(f.stored.answers,old.answers);
 assert.equal(f.stored.answers.schoolCourse,undefined);assert.equal(f.stored.answers.deepBook,undefined);
});

test('UI의 묶음 재계산은 수동 기간을 보존하고 새 상태 입력 때만 가정을 갱신한다',()=>{
 const f=storageFixture({version:2,answers:answer,fields:{grade:'2',mon:'10',band:'B',speed:'2',hw:'57',calc:'4',calcLeft:'2'},manualPeriods:{calcLeft:true},history:[],state:{}});
 assert.equal(f.c.restoreDraft(),true);f.els.band.value='A';f.c.applyAnswerChanges('band');
 assert.equal(f.els.comp.value,'5');assert.equal(f.els.calcLeft.value,'2');
 f.els.band.value='C';f.c.applyAnswerChanges('band');assert.equal(f.els.calcLeft.value,'2');
 f.c.applyAnswerChanges('calcStatus');assert.equal(f.els.calcLeft.value,'5');
 assert.equal(f.c.manualPeriods.calcLeft,undefined);
});


test('문자형 폼 값도 A 중급 이후 전체 사고력 순서를 유지한다',()=>{
 const p=I.buildPlan(answer,{...fields,band:'A'}),bs=p.rows.find(r=>r.key==='comp').blocks;
 assert.deepEqual(plain(bs.map(b=>b[0])),['1031 중급','3% 1과정','왕수학 응용 4']);
});

test('새 교재의 상태를 확인하기 전에는 옛 완료 값으로 계획을 만들지 않는다',()=>{
 const f={...fields,pendingStatus:{deepStatus:true,calcStatus:true}};
 assert.equal(row(answer,'deep',f).remaining.length,0);
 assert.equal(row(answer,'calc',f).remaining.length,0);
 assert.equal(I.profile(answer,f).comparison.best,null);
});

test('기존 계통·대수 진도를 중등 학기나 교재명으로 바꾸지 않는다',()=>{
 const a={...answer,schoolCourse:'mid',schoolBook:'개념원리',school:'advanced',schoolExact:'13',schoolStatus:'progress'};
 assert.equal(I.hasAnswer(a,fields,'schoolExact'),true);
 const text=I.summary(a,fields).find(x=>x.key==='school').text;
 assert.equal(text,'초등 계통 대수심화 진행 중');
 assert.equal(I.fieldChanges(a,fields,'schoolStatus').school,'13');
 assert.match(row(a,'school').current.shortText,/계통/);
});


test('첫 질문은 미취학·초·중·고이며 현재 학년 선택 뒤 나이를 다시 묻지 않는다',()=>{
 const q=I.questions({},fields).grade;
 assert.equal(q[0],'아이는 지금 몇 학년인가요?');
 assert.deepEqual(plain(q[2].map(x=>x[1])),['미취학','초1','초2','초3','초4','초5','초6','중1','중2','중3','고1','고2','고3']);
 assert.equal(I.firstMissing({},fields),'grade');
 for(let grade=1;grade<=6;grade++){
  const a={...answer,grade:String(grade),gradeInput:'current'};
  assert.equal(I.order(a,fields)[0],'grade');
  assert.ok(!I.order(a,fields).includes('age'));
  assert.equal(I.summary(a,fields)[0].text,'초'+grade);
 }
});

test('초1~초6 직접 선택은 1·2·3·12월에도 현재 학년과 학습 좌표를 유지한다',()=>{
 for(let grade=1;grade<=6;grade++)for(const mon of ['1','2','3','12']){
  const a={...answer,grade:String(grade),gradeInput:'current'},f={...fields,mon},saved=JSON.stringify(a);
  const expected=P.mOf(grade,+mon),p=I.profile(a,f);
  assert.equal(I.age(a,f),5+Math.floor(expected/12));
  assert.equal(I.fieldChanges(a,f,'grade').grade,String(grade));
  assert.equal(I.options(a,f).grade,grade);
  assert.equal(p.now,expected);
  assert.equal(p.nowLabel,'초'+grade+' '+mon+'월');
  assert.equal(I.milestones(a,f,p).main[0].title,'현재 · 초'+grade+' '+mon+'월');
  assert.equal(JSON.stringify(a),saved);
 }
});

test('미취학만 나이를 묻고 옛 초등 나이로 미취학 질문을 건너뛰지 않는다',()=>{
 for(const value of ['4','5','6','7']){
  const a={...answer,grade:'pre',age:value};
  assert.equal(I.order(a,fields)[1],'age');assert.equal(I.hasAnswer(a,fields,'age'),true);
  assert.equal(I.summary(a,fields)[0].text,'미취학 · '+value+'세');
 }
 assert.equal(I.firstMissing({...answer,grade:'pre'},fields),'age');
 assert.equal(I.hasAnswer({...answer,grade:'pre',age:'older'},fields,'age'),false);
 assert.equal(I.hasAnswer({...answer,grade:'pre',age:'8'},{...fields,mon:'1'},'age'),true);
 assert.equal(I.hasAnswer({...answer,grade:'pre',age:'8'},fields,'age'),false);
});

test('옛 9세 저장은 화면에서 학년으로 읽되 원래 나이·교재 값을 바꾸지 않는다',()=>{
 for(const mon of ['1','2','3','10']){
  const f={...fields,mon},a={...answer},saved=JSON.stringify(a),grade=+mon<3?'1':'2';
  assert.equal(I.gradeChoice(a,f),grade);
  assert.equal(I.summary(a,f)[0].text,'초'+grade);
  assert.equal(I.profile(a,f).nowLabel,'초'+grade+' '+mon+'월');
  assert.equal(JSON.stringify(a),saved);assert.equal(a.age,'9');assert.equal(a.grade,undefined);
 }
 const saved={version:2,answers:answer,completed:true,question:'gifted',fields:{...fields,hw:'57'},history:[],state:{}};
 const f=storageFixture(saved);assert.equal(f.c.restoreDraft(),true);f.c.saveDraft();
 assert.deepEqual(f.stored.answers,answer);assert.equal(f.stored.answers.grade,undefined);
});

test('실제 질문 선택 핸들러도 새 학년만 저장하고 옛 나이·교재는 보존한다',()=>{
 const f=storageFixture({version:2,answers:answer,fields:{...fields,hw:'57'},history:[],state:{}});
 f.c.restoreDraft();f.c.question='grade';f.c.handleCollegeClick=()=>false;f.c.collegeState={enabled:false};
 const ui=readFileSync(new URL('planner-ui.js',import.meta.url),'utf8');
 vm.runInContext(ui.slice(ui.indexOf("$('questionOptions').onclick="),ui.indexOf("$('questionBack').onclick=")),f.c);
 f.els.questionOptions.onclick({target:{closest:()=>({dataset:{answer:'3'}})}});
 assert.equal(f.c.answers.grade,'3');assert.equal(f.els.grade.value,'3');
 assert.equal(f.c.answers.age,'9');assert.equal(f.c.answers.schoolBook,answer.schoolBook);
 assert.equal(I.age(f.c.answers,f.c.intakeFields()),10);
 f.c.saveDraft();assert.equal(f.stored.answers.age,'9');assert.equal(f.stored.answers.grade,'3');
});

test('현재·이후 월 표시는 초등·중등 학년을 쓰고 미취학 출처 좌표는 보존한다',()=>{
 assert.equal(I.labelMonth(D.monthOf(9,10)),'초2 10월');
 assert.equal(I.labelMonth(P.mOf(1,1)),'초1 1월');
 assert.equal(I.labelMonth(P.mOf(6,2)),'초6 2월');
 assert.equal(I.labelMonth(P.mOf(7,3)),'중1 3월');
 assert.equal(I.labelMonth(D.monthOf(4,10)),D.labelMonth(D.monthOf(4,10)));
});


test('옛 나이 입력에 남은 이전 학년은 직접 선택으로 간주하지 않는다',()=>{
 const a={...answer,grade:'4'},saved=JSON.stringify(a);
 assert.equal(I.gradeChoice(a,fields),'2');assert.equal(I.age(a,fields),9);
 assert.equal(I.profile(a,fields).nowLabel,'초2 10월');assert.equal(JSON.stringify(a),saved);
 const selected={...a,gradeInput:'current'};
 assert.equal(I.gradeChoice(selected,fields),'4');assert.equal(I.age(selected,fields),11);
 assert.equal(I.profile(selected,fields).nowLabel,'초4 10월');
 assert.equal(I.gradeChoice({...a,age:'older'},fields),'4');
});

test('설명 연령은 확인한 학년을 따르며 선행 과정·기본 폼 학년으로 추정하지 않는다',()=>{
 const scenarios=[
  [{grade:'pre',age:'6'},'preschool'],
  [{grade:'2',gradeInput:'current',schoolCourse:'mid',schoolBook:'개념원리'},'lower'],
  [{grade:'5',gradeInput:'current'},'upper'],
  [{},'general']
 ];
 for(const [a,expected]of scenarios){const saved=JSON.stringify(a);assert.equal(I.audience(a,fields),expected);I.questions(a,fields);assert.equal(JSON.stringify(a),saved);}
 const old={age:'9',schoolCourse:'mid',schoolBook:'개념원리'};
 assert.equal(I.audience(old,fields),'lower');assert.equal(old.grade,undefined);
});

test('어린 연령의 쉬운 질문도 초등·중등 선택값과 교재 구분을 보존한다',()=>{
 for(const course of ['elem','mid']){
  const young={grade:'pre',age:'6',schoolCourse:course,deepCourse:course},older={grade:'5',gradeInput:'current',schoolCourse:course,deepCourse:course};
  const q=I.questions(young,fields),other=I.questions(older,fields);
  assert.match(q.calc[0],/수와 계산/);assert.match(other.calc[0],/연산/);
  assert.deepEqual(plain(q.schoolCourse[2]),plain(other.schoolCourse[2]));
  assert.deepEqual(plain(q.schoolBook[2]),plain(other.schoolBook[2]));
  assert.deepEqual(plain(q.deepBook[2]),plain(other.deepBook[2]));
 }
});

test('completed units change remaining months only for that course, including preschool source rows',()=>{
 const precise={...answer,schoolProgress:{done:1,total:4,unit:'unit',course:I.progressCourse(answer,'schoolStatus')}};
 assert.equal(I.fieldChanges(precise,{...fields,speed:'4'},'schoolStatus').schoolLeft,'3');
 assert.equal(I.fieldChanges({...precise,school:'3-1'},{...fields,speed:'4'},'schoolStatus').schoolLeft,'2');
 assert.deepEqual(plain(row(precise,'calc')),plain(row(answer,'calc')));
 assert.match(I.summary(precise,fields).find(x=>x.key==='school').text,/4 단원 중 1 완료/);
 const young={...answer,grade:'pre',age:'6',thinking:'1031 입문',thinkingStatus:'progress',school:'2-1'};
 young.thinkingProgress={done:0,total:10,unit:'session',course:I.progressCourse(young,'thinkingStatus')};
 const before=row({...young,thinkingProgress:undefined},'thinking1'),after=row(young,'thinking1');
 assert.ok(after.current.e>=before.current.e);assert.equal(after.remaining[0].remainingStart,I.profile(young,fields).now);assert.ok(Number.isInteger(after.current.e));
});
test('unknown progress keeps a full course and completion does not reuse the fraction',()=>{
 const a={...answer,schoolProgress:{done:0,total:1,estimated:true,course:I.progressCourse(answer,'schoolStatus')}};
 assert.equal(I.fieldChanges(a,{...fields,speed:'4'},'schoolStatus').schoolLeft,'4');
 assert.equal(I.fieldChanges({...a,schoolStatus:'done'},{...fields,speed:'4'},'schoolStatus').schoolLeft,'4');
 assert.equal(I.progressValue({...a,schoolBook:'디딤돌 기본+응용'},'schoolStatus'),null);
});

test('중등 개념·유형 교재를 실제 이름으로 교과에 기록할 수 있다',()=>{
 for(const book of ['쎈','RPM','개념+유형 라이트','개념+유형 파워']){
  const a={...answer,schoolCourse:'mid',schoolBook:book,schoolExact:'14'};
  assert.ok(I.bookList('mid','school').includes(book));
  assert.ok(!I.bookList('elem','school').includes(book));
  assert.ok(I.order(a,fields).includes('schoolExact'));
  assert.match(I.summary(a,fields).find(x=>x.key==='school').text,new RegExp(book.replace(/[+]/g,'\\+')));
 }
});

test('고등 선행·후행 심화 질문은 학년과 연산 범위를 추정하지 않는다',()=>{
 const a={schoolCourse:'high',schoolBook:'기본정석',schoolHigh:'대수',schoolStatus:'progress',deepCourse:'high',deepBook:'실력정석',deepStage:'공통수학2',deepStatus:'progress',calc:'unknown'};
 const q=I.questions(a,{mon:'11',band:'B'});
 assert.equal(I.gradeChoice(a,{mon:'11',band:'B'}),undefined);
 assert.equal(I.firstMissing(a,{mon:'11',band:'B'}),'grade');
 assert.match(q.deepStage[0],/현재 심화하는 과목/);
 assert.doesNotMatch(q.deepStage[1],/학년과 학기/);
 assert.match(q.calc[1],/고등 선행과 연산 범위는 다를/);
 assert.ok(q.calc[2].some(([key])=>key==='advanced'));
 assert.ok(q.calc[2].some(([key])=>key==='high'));
 assert.equal(a.calc,'unknown');
 assert.equal(a.deepStage,'공통수학2');
});

test('추가 현재 심화는 기존 답을 보존하고 같은 과목을 막으며 미확인과 없음을 구분한다',()=>{
 const a={...answer,deepCourse:'high',deepBook:'실력정석',deepStage:'공통수학2',deepStatus:'progress',deepExtra:'yes',deepExtraStage:'대수',deepExtraBook:'고쟁이',deepExtraStatus:'progress'};
 a.deepExtraProgress={course:I.progressCourse(a,'deepExtraStatus'),done:1,total:4,unit:'unit'};
 const before=JSON.stringify(a),extra=I.additionalDeep(a,fields);
 assert.equal(extra.stage,'대수');assert.equal(extra.fraction,.25);
 assert.ok(I.summary(a,fields).some(r=>r.key==='deepExtraBook'&&r.text.includes('대수')));
 assert.equal(JSON.stringify(a),before);
 assert.equal(I.additionalDeep({...a,deepExtraStage:'공통수학2'},fields),null);
 assert.ok(!I.questions(a,fields).deepExtraStage[2].some(([id])=>id==='공통수학2'));
 assert.match(I.summary({...a,deepExtra:undefined},fields).find(r=>r.key==='deepExtraBook').text,/확인 전/);
 assert.match(I.summary({...a,deepExtra:'no'},fields).find(r=>r.key==='deepExtraBook').text,/없음/);
 assert.equal(I.additionalDeep(a,{...fields,pendingStatus:{deepExtraStatus:true}}),null);
});

test('새 심화 상태 입력과 기존 요약 편집 모두 추가 심화 질문에 도달한다',()=>{
 const ui=readFileSync(new URL('planner-ui.js',import.meta.url),'utf8');
 assert.match(ui,/key==='deepStatus'&&answers.deepCourse==='high'\?'deepExtra'/);
 assert.match(ui,/it.key==='deepExtraBook'\?'deepExtra'/);
 const weekly=readFileSync(new URL('planner-weekly-planner.js',import.meta.url),'utf8');
 assert.match(weekly,/현재 병행하는 심화/);
 assert.match(weekly,/심화 회차를 자동으로 더하지 않습니다/);
});

test('사고력 질문은 초2 이하 또는 초3 이상 교과 초5완료 이하에서만 표시한다',()=>{
 const f={mon:'11',band:'B',grade:'1'};
 for(const grade of ['pre','1','2']){
  const a={grade,gradeInput:'current',age:grade==='pre'?'6':undefined,schoolCourse:'high',schoolHigh:'대수'};
  assert.equal(I.thinkingRequired(a,f),true);assert.ok(I.order(a,f).includes('thinkingExperience'));
 }
 for(const grade of ['3','6','7','10'])for(const [course,stage,status,expected] of [['elem','5-2','progress',true],['elem','5-2','done',true],['elem','6-1','progress',false],['elem','6-1','done',false],['mid',null,'progress',false],['high',null,'progress',false]]){
  const a={grade,gradeInput:'current',schoolCourse:course,school:stage,schoolStatus:status};
  assert.equal(I.thinkingRequired(a,f),expected);assert.equal(I.order(a,f).includes('thinkingExperience'),expected);
 }
 for(const a of [{},{grade:'3',gradeInput:'current'},{grade:'3',gradeInput:'current',schoolCourse:'unknown'},{grade:'3',gradeInput:'current',schoolCourse:'none'},{grade:'3',gradeInput:'current',schoolCourse:'elem'}])assert.equal(I.thinkingRequired(a,f),null);
});

test('초3 이상도 교과 과정→과목→교재→상태, 심화도 같은 순서로 묻고 연산 후 필요한 사고력을 묻는다',()=>{
 const a={grade:'4',gradeInput:'current',schoolCourse:'high',schoolHigh:'대수',deepCourse:'high',deepStage:'공통수학2',deepExtra:'yes',deepExtraStage:'대수'};
 const f={mon:'11',band:'B'},q=I.questions(a,f),order=I.order(a,f);
 assert.deepEqual(plain(order.slice(0,14)),['grade','schoolCourse','schoolHigh','schoolBook','schoolStatus','deepCourse','deepStage','deepBook','deepStatus','deepExtra','deepExtraStage','deepExtraBook','deepExtraStatus','calc']);
 assert.ok(q.deepStage[2].some(([id])=>id==='공통수학2'));
 assert.ok(!order.includes('thinkingExperience'));
 const low={...a,schoolCourse:'elem',school:'5-2'};
 assert.ok(I.order(low,f).indexOf('thinkingExperience')>I.order(low,f).indexOf('calc'));
 assert.equal(I.firstMissing({...a,schoolBook:'기본정석',schoolStatus:'progress',deepBook:'실력정석',deepStatus:'progress',deepExtraBook:'고쟁이',deepExtraStatus:'progress'},f),'calc');
 assert.notEqual(I.summary({...a,calc:undefined},f).find(x=>x.key==='calc').text,I.summary({...a,calc:'none'},f).find(x=>x.key==='calc').text);
 // Stale books from a former course must not determine the new subject choices.
 const mid=I.questions({...a,deepCourse:'mid',deepBook:'실력정석'},f);
 assert.ok(mid.deepStage[2].some(([id])=>id==='14'));assert.ok(!mid.deepStage[2].some(([id])=>id==='대수'));
});

test('사고력 질문을 생략해도 이전 기록과 경로 입력은 삭제하지 않는다',()=>{
 const a={...answer,grade:'4',gradeInput:'current',schoolCourse:'high',schoolBook:'기본정석',schoolHigh:'대수'};
 const before=JSON.stringify(a),progress=I.sourceInput(a,fields).thinking;
 I.order(a,fields);I.firstMissing(a,fields);I.questions(a,fields);
 assert.equal(JSON.stringify(a),before);assert.ok(progress.length>0);
 assert.equal(I.thinkingRequired({...a,schoolCourse:'unknown'},fields),null);
 assert.equal(I.thinkingRequired({schoolCourse:'high'},fields),null);
});

test('실제 질문 핸들러로 고등 복수심화 과목→교재→연산 순서를 끝까지 밟는다',()=>{
 const f=storageFixture({version:2,answers:{},fields:{...fields,hw:'57'},history:[],state:{}});
 f.c.restoreDraft();f.c.handleCollegeClick=()=>false;f.c.collegeState={enabled:false};
 const ui=readFileSync(new URL('planner-ui.js',import.meta.url),'utf8');
 vm.runInContext(ui.slice(ui.indexOf("$('questionOptions').onclick="),ui.indexOf("$('questionBack').onclick=")),f.c);
 const steps=[['grade','4'],['schoolCourse','high'],['schoolHigh','대수'],['schoolBook','기본정석'],['schoolStatus','progress'],['deepCourse','high'],['deepStage','공통수학2'],['deepBook','실력정석'],['deepStatus','progress'],['deepExtra','yes'],['deepExtraStage','대수'],['deepExtraBook','고쟁이'],['deepExtraStatus','progress'],['calc','unknown']];
 for(let i=0;i<steps.length;i++){
  const [key,value]=steps[i];f.c.question=key;
  f.els.questionOptions.onclick({target:{closest:()=>({dataset:{answer:value}})}});
  if(i<steps.length-1)assert.equal(f.asked,steps[i+1][0],key+' 다음 질문');
 }
 assert.equal(f.c.answers.calc,'unknown');assert.equal(f.c.answers.thinkingExperience,undefined);
 assert.equal(f.c.answers.deepStage,'공통수학2');assert.equal(f.c.answers.deepExtraStage,'대수');
});

test('2022 과목명 선택 ID는 유지하고 구 과목과 동일하지 않음을 설명한다',()=>{
 const a={...answer,schoolCourse:'high',schoolBook:'기본정석',deepCourse:'high',deepBook:'실력정석',deepStage:'공통수학2',calc:'high'};
 const q=I.questions(a,fields);
 for(const key of ['schoolHigh','deepStage','deepExtraStage','calcHigh']){
  assert.match(q[key][1],/대수는 구 수학Ⅰ/);
  assert.match(q[key][1],/미적분Ⅰ은 구 수학Ⅱ/);
  assert.match(q[key][1],/같은 과정은 아닙니다/);
  assert.ok(q[key][2].some(([id,label])=>id==='대수'&&label.includes('구 수학Ⅰ')));
  assert.ok(q[key][2].some(([id,label])=>id==='미적분Ⅰ'&&label.includes('구 수학Ⅱ')));
 }
 assert.ok(!I.highSubjects.includes('수학Ⅰ'));
});

test('대략 20/50/80 버튼은 저장 전 폼만 채우며 진행 상태 선택 시 분량으로 저장한다',()=>{
 for(const percent of [20,50,80]){
  const savedAnswers={...answer,schoolStatus:'progress',schoolProgress:{course:I.progressCourse(answer,'schoolStatus'),done:2,total:6,unit:'page'}};
  const f=storageFixture({version:2,answers:savedAnswers,fields:{...fields,hw:'57'},history:[],state:{}});
  f.c.restoreDraft();f.c.question='schoolStatus';f.c.handleCollegeClick=()=>false;f.c.collegeState={enabled:false};
  const ui=readFileSync(new URL('planner-ui.js',import.meta.url),'utf8');
  vm.runInContext(ui.slice(ui.indexOf("$('questionOptions').onclick="),ui.indexOf("$('questionBack').onclick=")),f.c);
  const before=JSON.stringify(f.c.answers);
  f.els.questionOptions.onclick({target:{closest:selector=>selector==='[data-progress-percent]'?{dataset:{progressPercent:String(percent)}}:null}});
  assert.equal(JSON.stringify(f.c.answers),before);
  assert.equal(f.els.progressTotal.value,'100');assert.equal(f.els.progressDone.value,String(percent));assert.equal(f.els.progressUnit.value,'percent');
  f.els.questionOptions.onclick({target:{closest:()=>({dataset:{answer:'progress'}})}});
  const p=I.progressValue(f.c.answers,'schoolStatus');
  assert.equal(p.done,percent);assert.equal(p.total,100);assert.equal(p.approximate,true);assert.notEqual(p.estimated,true);
  assert.equal(f.c.answers.schoolStatus,'progress');assert.match(I.progressText(f.c.answers,'schoolStatus'),new RegExp('약 '+percent+'%'));
  assert.match(I.progressText(f.c.answers,'schoolStatus'),/숙달 아님/);
  // Switching back to exact numbers removes the approximation marker.
  f.c.question='schoolStatus';f.els.progressUnit.value='page';f.els.progressTotal.value='6';f.els.progressDone.value='2';
  f.els.questionOptions.onclick({target:{closest:()=>({dataset:{answer:'progress'}})}});
  assert.equal(I.progressValue(f.c.answers,'schoolStatus').approximate,undefined);
  assert.match(I.progressText(f.c.answers,'schoolStatus'),/6 쪽 중 2 완료/);
 }
 const ui=readFileSync(new URL('planner-ui.js',import.meta.url),'utf8');
 assert.match(ui,/key.endsWith\('Status'\).*대략 진행 분량/s);
});

test('book choices and examples never offer the paired labels that are not real book names',()=>{
 for(const band of ['A','B','C','D'])for(const course of ['elem','mid']){
  const a={...answer,schoolCourse:course,deepCourse:course,schoolBook:'',deepBook:''},q=I.questions(a,{...fields,band});
  const offered=[...q.schoolBook[2],...q.deepBook[2]].map(o=>o[0]+' '+o[1]).join(' / ');
  assert.doesNotMatch(offered,/개념응용 · 최상위/,band+course);
  assert.doesNotMatch(q.schoolBook[1]+q.deepBook[1],/개념응용/,band+course);
 }
 const saved={...answer,deepCourse:'elem',deepBook:'개념응용 · 최상위'};
 assert.ok(I.questions(saved,fields).deepBook[2].some(o=>o[0]==='개념응용 · 최상위'),'a saved answer stays visible as chosen');
 assert.ok(I.deepBooks.includes('개념응용 · 최상위'),'saved answers still validate');
});

test('arithmetic is asked by school semester, whatever book the child uses, so multiplication by digit count is distinguishable',()=>{
 const q=I.questions({...answer,calc:''},fields).calc,labels=Object.fromEntries(q[2]);
 assert.match(q[1],/학년·학기/);assert.match(q[1],/소마셈·원리셈·두뇌로·구몬/);
 assert.equal(labels['기적의 계산법 5권'],'3-1 · 한 자리 수로 곱하기 · 첫 나눗셈');
 assert.equal(labels['기적의 계산법 6권'],'3-2 · 두 자리 수 곱셈 · 한 자리 수로 나누기');
 assert.equal(labels['기적의 계산법 7권'],'4-1 · 큰 자연수 곱셈 · 두 자리 수로 나누기');
 assert.equal(labels['기적의 계산법 10권'],'5-2 · 혼합 계산 · 분수·소수 곱셈');
 for(let n=1;n<=12;n++)assert.match(labels['기적의 계산법 '+n+'권'],new RegExp('^'+Math.ceil(n/2)+'-'+(n%2?1:2)+' · '),n+'권');
 assert.ok(!Object.values(labels).some(v=>/기적의 계산법/.test(v)),'no book name is forced in the choices');
 const pre=I.questions({...answer,age:'5',calc:''},{...fields,grade:'pre'}).calc[2].map(o=>o[0]);
 assert.ok(pre.includes('소마셈 K'));
 const old={...answer,calc:'기적의 계산법 4권',calcStatus:'done'};
 assert.equal(I.profile(old,fields).rows.find(r=>r.key==='calc').blocks.length>0,true,'saved answers keep working');
});

test('교과는 진도(과정)→학년·학기→교재, 심화도 과정→학년·학기→교재 순서이고 교재 질문에 고른 과정이 붙는다',()=>{
 const f={mon:'11',band:'B'};
 for(const a of [{grade:'5',gradeInput:'current',schoolCourse:'mid',schoolExact:'15',deepCourse:'elem',deepStage:'6-1'},{grade:'2',gradeInput:'current',schoolCourse:'elem',school:'3-2',deepCourse:'elem',deepStage:'2-2'}]){
  const o=I.order(a,f),at=k=>o.indexOf(k),stage=a.schoolCourse==='mid'?'schoolExact':'school';
  assert.ok(at('schoolCourse')<at(stage)&&at(stage)<at('schoolBook')&&at('schoolBook')<at('schoolStatus')&&at('schoolStatus')<at('deepCourse'));
  assert.ok(at('deepCourse')<at('deepStage')&&at('deepStage')<at('deepBook')&&at('deepBook')<at('deepStatus'));
  const q=I.questions(a,f);
  assert.equal(q.schoolCourse[0],'현재 공부하고 있는 수학 진도는 무엇인가요?');
  assert.match(q.schoolBook[0],a.schoolCourse==='mid'?/^중등 1학년 2학기 교과는/:/^초등 3학년 2학기 교과는/);
  assert.match(q.deepBook[0],/학기 심화는 어떤 교재로/);
 }
});
