import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const context={window:{},console};vm.createContext(context);
for(const f of ['planner.js','demo-content.js','planner-intake.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),context);
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
  for(const k of ['thinking','thinkingStatus','school','schoolStatus','deepStage','deepStatus','calcStatus'])assert.ok(!order.includes(k));
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
   assert.match(q.schoolBook[1],new RegExp(band+' 기준'));
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
 let stored=JSON.stringify(saved),asked=null;
 const c={I,console,answers:{},history:[],manualPeriods:{},pendingStatus:{},legacyDraft:null,state:{},completed:false,question:'age',draftIds:['grade','mon','band','speed','hw','comp','compLeft','calc','calcLeft'],
  $:id=>els[id]||(els[id]={value:'',type:'select-one',options:[]}),
  sessionStorage:{getItem:()=>stored,setItem:(_,value)=>{stored=value;}},
  questionOrder:()=>I.order(c.answers,c.intakeFields()),storageKey:'gfield.demo2.v1',hwOptions(){},setSeg(){},draw(){},finish(){},ask(key){asked=key;},
  intakeFields:()=>({grade:els.grade.value,mon:els.mon.value,band:els.band.value,speed:els.speed.value,pendingStatus:c.pendingStatus})};
 vm.createContext(c);
 vm.runInContext(ui.slice(ui.indexOf('function saveDraft(){'),ui.indexOf("let question='age';")),c);
 vm.runInContext(ui.slice(ui.indexOf('function applyAnswerChanges(key){'),ui.indexOf('function ask(key){')),c);
 return {c,els,get stored(){return JSON.parse(stored);},get asked(){return asked;}};
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
 assert.equal(text,'계통·대수 진행 중');
 assert.equal(I.fieldChanges(a,fields,'schoolStatus').school,'13');
 assert.match(row(a,'school').current.shortText,/계통/);
});
