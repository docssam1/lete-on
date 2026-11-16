import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const w={},c=vm.createContext({window:w});
for(const file of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-high-study.js','planner-standard.js','planner-curriculum.js','planner-korean.js','planner-language.js','planner-science-levels.js','planner-science-curriculum.js','planner-science.js','planner-parent-flow.js'])vm.runInContext(readFileSync(new URL(file,import.meta.url),'utf8'),c,{filename:file});
const F=w.PlannerParentFlow,I=w.PlannerIntake,plain=v=>JSON.parse(JSON.stringify(v));
const input=()=>({grade:'3',school:{stage:'e:4-1',book:'디딤돌 응용',status:'progress',range:'3단원'},deep:{stage:'unknown'},thinking:{book:'unknown'},calc:{book:'기적의 계산법 6권'},solo:'긴 문장제는 도움이 필요해요.'});
const fields={year:'2026',mon:'11',grade:'3',band:'B',speed:'2'};
test('one current-study submission needs no character, goal or academy choices',()=>{
 const a=F.build(input());assert.equal(I.firstMissing(a,fields),undefined);
 assert.equal(a.hw,'pending');assert.equal(a.gifted,'pending');assert.equal(a.deepCourse,'unknown');assert.equal(a.thinkingExperience,'unknown');
 assert.equal(a.schoolBook,'디딤돌 응용');assert.equal(a.parentFlow.ranges.school,'3단원');assert.equal(a.parentFlow.solo,input().solo);
 assert.equal(a.schoolProgress,undefined);assert.equal(a.mastery,undefined);assert.equal(a.score,undefined);
});
test('automatic options default on and explicit opt-outs survive further current-study edits',()=>{
 const a=F.build(input()),pref=F.preferences(a.parentFlow);assert.ok(Object.values(pref.enabled).every(Boolean));
 pref.enabled.science=false;pref.enabled.gifted=false;const edited=F.build({...input(),calc:{book:'기적의 계산법 7권'}},{...a,parentFlow:pref});
 assert.equal(edited.parentFlow.enabled.science,false);assert.equal(edited.parentFlow.enabled.gifted,false);assert.equal(edited.school,a.school);assert.equal(edited.schoolBook,a.schoolBook);
});
test('only actual valid study is accepted and empty inputs do not invent defaults',()=>{
 assert.throws(()=>F.build({grade:'3'}),/한 가지/);assert.throws(()=>F.build({...input(),grade:''}),/학년/);
 assert.throws(()=>F.build({...input(),grade:'pre',age:'2'}),/나이/);
 assert.throws(()=>F.build({...input(),school:{stage:'h:가짜과목',book:'기본정석'}}),/학기·과목/);
 const custom=F.build({...input(),school:{stage:'e:4-1',book:'지금 쓰는 다른 교재'}});assert.equal(custom.schoolBook,'unknown');assert.equal(custom.parentFlow.actualBooks.school,'지금 쓰는 다른 교재');
});
test('a book change removes stale fraction while another unchanged book retains its evidence-free progress estimate',()=>{
 const a=F.build(input());const pk=I.progressKey('schoolStatus');a[pk]={done:2,total:6,unit:'unit',course:I.progressCourse(a,'schoolStatus')};
 const same=F.build(input(),a);assert.deepEqual(plain(same[pk]),plain(a[pk]));
 const changed=F.build({...input(),school:{stage:'e:4-2',book:'디딤돌 응용'}},a);assert.equal(changed[pk],undefined);
});
test('math-only evidence creates Korean and science proposals without invented subject attainment',()=>{
 const a=F.build(input()),standard=w.PlannerStandard.model(a,fields),m=F.automatic(a,fields,standard);
 assert.equal(m.language.subjects.korean.enabled,true);assert.equal(m.language.subjects.korean.current,'unknown');
 assert.equal(m.science.enabled,true);assert.equal(m.science.scienceStage,'unknown');assert.deepEqual(plain(m.science.completed),[]);
 assert.ok(m.korean.tracks.length);assert.equal(m.references.nute.stage,'elementary');
 const markup=F.renderResult(m);assert.match(markup,/학원 선택 없이/);assert.match(markup,/대학 진학까지/);assert.match(markup,/data-parent-study/);
});
test('academy conditions follow learned math scope and do not alter the core schedule',()=>{
 const a=F.build({...input(),grade:'2',school:{stage:'m:19',book:'개념원리'},thinking:{book:'1031 초급'}});
 const f={...fields,grade:'2'},standard=w.PlannerStandard.model(a,f),before=JSON.stringify(standard);
 let m=F.automatic(a,f,standard);assert.equal(m.references.nute.stage,'middle');assert.match(m.references.nute.text,/중등.*누적/);
 a.parentFlow.enabled.hwangso=false;a.parentFlow.enabled.nute=false;m=F.automatic(a,f,standard);
 assert.equal(JSON.stringify(standard),before);assert.equal(m.preferences.enabled.hwangso,false);
});
test('membership grades translate once while preschool age is preserved',()=>{
 assert.equal(F.memberGrade({school:'middle',grade:2}),'8');assert.equal(F.memberGrade({school:'high',grade:1}),'10');
 const m=F.inputModel({}, {school:'preschool',grade:5});assert.equal(m.grade,'pre');assert.equal(m.age,'5');
});

test('unlisted Soma or arithmetic books remain actual reports without claiming a catalogue level',()=>{
 const a=F.build({grade:'pre',age:'5',thinking:{book:'Ray A3-3',range:'규칙 찾기'},calc:{book:'소마셈 P2',range:'10 가르기'}});
 assert.equal(a.thinkingExperience,'unknown');assert.equal(a.calc,'unknown');assert.equal(a.parentFlow.actualBooks.thinking,'');assert.equal(a.parentFlow.actualBooks.calc,'');assert.equal(a.parentFlow.academyReports.thinking.book,'Ray A3-3');assert.equal(a.parentFlow.academyReports.calc.book,'소마셈 P2');
 assert.equal(I.firstMissing(a,{...fields,grade:'pre'}),undefined);
});
test('explicit numerator and denominator change remaining amount, never mastery',()=>{
 const a=F.build({...input(),school:{stage:'e:4-1',book:'디딤돌 응용',range:'3/6단원'}});
 const p=I.progressValue(a,'schoolStatus');assert.equal(p.done,3);assert.equal(p.total,6);assert.equal(p.unit,'unit');assert.equal(p.mastery,undefined);
 assert.equal(F.fraction('3단원까지'),null);assert.equal(F.fraction('6/3단원'),null);
});

test('an unlisted middle or high textbook is retained literally and never reclassified from its title',()=>{
 for(const stage of ['m:14','h:공통수학1']){const a=F.build({...input(),school:{stage,book:'현재 수학 문제집',range:'함수 12쪽'}});assert.equal(a.schoolBook,'unknown');assert.equal(a.parentFlow.actualBooks.school,'현재 수학 문제집');assert.equal(a.parentFlow.stages.school,stage);assert.equal(I.firstMissing(a,fields),undefined);}
});

test('academy textbooks and reference stages never become independent study assignments',()=>{
 for(const book of ['Ray A3-3','소마셈 P2','소마도형 P','필즈 베이직','더클래식 1과정'])assert.equal(F.isAcademyBook(book),true);
 for(const book of ['1031 초급','디딤돌 응용','쎈','기본정석'])assert.equal(F.isAcademyBook(book),false);
 const a=F.build({grade:'pre',age:'5',thinking:{book:'Ray A3-3'}});const markup=F.renderLearning(a,fields);
 assert.doesNotMatch(markup,/Ray A3-3|소마셈|더클래식/u);assert.match(markup,/fields-classic\/question-bank\/home.html/);assert.match(markup,/number_magic\/index.html/);
});
