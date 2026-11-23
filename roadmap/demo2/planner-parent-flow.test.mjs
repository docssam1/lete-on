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
 const reported=F.build({grade:'3',school:{stage:'e:4-1',book:'소마 학원 교재',range:'3/6단원'}});
 assert.equal(reported.parentFlow.ranges.school,'');assert.equal(reported.parentFlow.academyReports.school.range,'3/6단원');
 assert.equal(reported[I.progressKey('schoolStatus')],undefined);assert.equal(F.inputModel(reported).school.range,'3/6단원');
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
test('age changes the language and order, while a young advanced learner keeps every curriculum choice',()=>{
 const young=F.ageCopy('5','pre'),low=F.ageCopy('9','2'),upper=F.ageCopy('12','5'),middle=F.ageCopy('15','8'),high=F.ageCopy('18','11');
 assert.match(young.intro,/과정이나 교재/);assert.equal(young.order[0],'thinking');assert.equal(low.order[1],'calc');assert.match(upper.intro,/앞선 과정/);assert.match(middle.intro,/개념·유형/);assert.match(high.intro,/과목/);
 assert.equal(new Set([young.solo,low.solo,upper.solo,middle.solo,high.solo]).size,5);
 const a=F.build({...input(),grade:'pre',age:'5',school:{stage:'h:공통수학1',book:'기본정석'}});assert.equal(a.schoolHigh,'공통수학1');assert.equal(a.parentFlow.currentAge,'5');
});
test('an actual age is retained separately from school grade and is never guessed from an old preschool age',()=>{
 const a=F.build({...input(),age:'10'});assert.equal(F.inputModel(a).age,'10');assert.equal(F.inputModel({grade:'3',age:'5'}).age,'');
 const edited=F.build({...input(),age:'11'},a);assert.equal(edited.parentFlow.currentAge,'11');assert.equal(edited.school,a.school);assert.equal(edited.schoolBook,a.schoolBook);
 assert.throws(()=>F.build({...input(),age:'99'}),/나이/);
 for(const age of ['3','8']){const early=F.build({grade:'pre',age,thinking:{book:'수 놀이 활동'}});assert.equal(I.firstMissing(early,{...fields,grade:'pre'}),undefined);}
});

test('preschool book picker is short and unique without excluding an advanced current book',()=>{
 const small=F.thinkingChoices('5','pre');
 assert.deepEqual(Array.from(small,r=>r[1]),['언어·수감각 키우기','킨더팩토','키즈팩토','초등팩토','PRE 1031']);
 const all=F.thinkingChoices('5','pre',true),names=Array.from(all,r=>r[1]);
 assert.equal(names.length,new Set(names).size);assert.ok(names.includes('1031 중급'));
 assert.ok(F.thinkingChoices('5','pre',false,'1031 중급').some(r=>r[1]==='1031 중급'));
 assert.equal(F.resolveBook('thinking','x:4').stored,'x:4');
});
test('verified book levels are optional and unsupported editions have no invented choices',()=>{
 assert.deepEqual(Array.from(F.thinkingLevels('킨더팩토')),['A','B','C','D']);
 assert.ok(F.thinkingLevels('키즈팩토').includes('원리 B'));assert.ok(F.thinkingLevels('키즈팩토').includes('기본 A'));
 assert.equal(F.thinkingLevels('내 사고력 책').length,0);
});
test('thinking level and independent observations roundtrip separately from studied fractions',()=>{
 const a=F.build({grade:'pre',age:'5',thinking:{book:'키즈팩토',level:'원리 B',range:'3/6단원',independent:'규칙은 혼자, 도형은 도움'}});
 const m=F.inputModel(a);assert.equal(m.thinking.level,'원리 B');assert.equal(m.thinking.independent,'규칙은 혼자, 도형은 도움');assert.equal(m.thinking.range,'3/6단원');
 assert.equal(I.progressValue(a,'thinkingStatus').done,3);assert.equal(a.mastery,undefined);assert.equal(a.score,undefined);
 const html=F.renderLearning(a,fields);assert.match(html,/키즈팩토 · 원리 B · 3\/6단원/);assert.match(html,/혼자 푸는 범위\(입력\)/);
 const model=F.automatic(a,fields,w.PlannerStandard.model(a,fields));assert.match(F.renderResult(model),/원리 B/);
});
test('changing a volume or custom book discards the previous scope evidence but preserves other settings',()=>{
 const base={grade:'pre',age:'5',thinking:{book:'키즈팩토',level:'원리 A',range:'3/6단원',independent:'수 비교'}};
 const a=F.build(base);a.parentFlow.enabled.science=false;
 const b=F.build({...base,thinking:{book:'키즈팩토',level:'원리 B'}},a);
 assert.equal(I.progressValue(b,'thinkingStatus'),null);assert.equal(b.parentFlow.independentRanges.thinking,'');assert.equal(b.parentFlow.enabled.science,false);
 const custom=F.build({...base,thinking:{book:'지금 쓰는 다른 책',level:'2권',independent:'조건 읽기'}},a);
 assert.equal(custom.parentFlow.actualBooks.thinking,'지금 쓰는 다른 책');assert.equal(custom.parentFlow.bookLevels.thinking,'2권');
 assert.equal(custom.mastery,undefined);
});
test('academy levels restore for reference but never enter personal thinking assignments',()=>{
 const a=F.build({grade:'pre',age:'5',thinking:{book:'소마 Ray',level:'A3-3',range:'규칙',independent:'수 세기'}});
 const m=F.inputModel(a);assert.equal(m.thinking.level,'A3-3');assert.equal(m.thinking.independent,'수 세기');
 assert.equal(F.thinkingStudy(a).book,'');assert.doesNotMatch(F.renderLearning(a,fields),/A3-3|소마 Ray/);
});

test('finishing a named volume never claims that the whole thinking series is complete',()=>{
 const a=F.build({grade:'pre',age:'5',thinking:{book:'키즈팩토',level:'원리 B',status:'done',range:'3/6단원'}});
 assert.equal(a.thinkingStatus,'progress');assert.equal(a.parentFlow.statuses.thinking,'done');assert.equal(F.inputModel(a).thinking.status,'done');assert.equal(I.progressValue(a,'thinkingStatus'),null);
 assert.match(F.renderLearning(a,fields),/다음에 공부할 범위를 확인/);
 const all=F.build({grade:'pre',age:'5',thinking:{book:'키즈팩토',status:'done'}});assert.equal(all.thinkingStatus,'done');
});

test('thinking balance notices compare actual course intervals on each axis, independently of age',()=>{
 const current={...input(),school:{stage:'e:1-1',book:'디딤돌 응용'},thinking:{book:'1031 중급'},calc:{book:'기적의 계산법 1권'}};
 const a=F.build({...current,age:'10'}),before=JSON.stringify(a),m=F.thinkingBalance(a);
 assert.deepEqual(plain(m.ahead.map(row=>row.axis)),['school','calc']);assert.ok(m.ahead.every(row=>row.samples>=3));
 const young=F.build({...current,age:'5',grade:'pre'});
 assert.deepEqual(plain(F.thinkingBalance(young)),plain(m));assert.equal(JSON.stringify(a),before);
 const html=F.balanceNotice(a);assert.match(html,/교과·연산보다 앞서/);assert.match(html,/1031 중급/);assert.match(html,/1-1/);assert.match(html,/일정은 자동으로 바꾸지/);
 assert.doesNotMatch(html,/몇 개월|개월 뒤|상위.*%/);
});
test('balance notice clears when curriculum and arithmetic have caught up, and reports only the lagging axis',()=>{
 const current={...input(),school:{stage:'e:6-2',book:'디딤돌 응용'},thinking:{book:'1031 중급'},calc:{book:'기적의 계산법 2권'}};
 assert.deepEqual(plain(F.thinkingBalance(F.build(current)).ahead.map(row=>row.axis)),['calc']);
 const caught=F.build({...current,calc:{book:'기적의 계산법 12권'}});
 assert.equal(F.balanceNotice(caught),'');
 const normal=F.build({...current,school:{stage:'e:3-1',book:'디딤돌 응용'},thinking:{book:'키즈팩토'},calc:{book:'기적의 계산법 6권'}});
 assert.equal(F.balanceNotice(normal),'');
});
test('missing, unlisted, and academy reference scopes never invent a thinking-balance judgment',()=>{
 assert.equal(F.balanceNotice(F.build({...input(),thinking:{book:'확인 전의 사고력 교재'}})),'');
 assert.equal(F.balanceNotice(F.build({...input(),thinking:{book:'소마 Ray A3-3'}})),'');
 const unknown=F.build({...input(),school:{stage:'unknown'},thinking:{book:'1031 중급'},calc:{book:'직접 쓰는 계산책'}});
 assert.equal(F.balanceNotice(unknown),'');
 assert.equal(F.balanceNotice({}),'');
});
test('the same balance notice follows the submitted current study into result and learning screens',()=>{
 const a=F.build({...input(),school:{stage:'e:1-1',book:'디딤돌 응용'},thinking:{book:'1031 중급'},calc:{book:'기적의 계산법 2권'}});
 const model=F.automatic(a,fields,w.PlannerStandard.model(a,fields));
 assert.match(F.renderResult(model),/class="parent-balance"/);assert.match(F.renderLearning(a,fields),/class="parent-balance"/);
 assert.equal(F.renderResult(model).split('class="parent-balance"').length,2);
});

test('an older saved semester can still be compared and notice content is escaped',()=>{
 const legacy={grade:'3',school:'1-1',schoolBook:'디딤돌 응용',thinking:'1031 초급',calc:'기적의 계산법 2권'};
 assert.ok(F.thinkingBalance(legacy).ahead.some(row=>row.axis==='school'));
 const a=F.build({...input(),school:{stage:'e:1-1',book:'디딤돌 응용'},thinking:{book:'1031 중급'},calc:{book:'기적의 계산법 2권'}});
 a.parentFlow.actualBooks.thinking='<img src=x onerror=alert(1)>';
 assert.doesNotMatch(F.balanceNotice(a),/<img/);assert.match(F.balanceNotice(a),/&lt;img/);
});

test('the detailed interview uses one learner selector and then follows each learning order',()=>{
 for(const [age,grade,order]of [['5','pre',['thinking','calc','school','deep']],['9','2',['thinking','calc','school','deep']],['10','3',['calc','school','deep']],['14','7',['calc','school','deep']]]){
  const steps=F.slidePlan(age,grade);
  assert.deepEqual(plain(steps.map(s=>s.id)),['learner',...order,'review']);
  assert.equal(new Set(steps.map(s=>s.id)).size,order.length+2);assert.ok(steps.every(s=>s.label&&s.title));
 }
 assert.match(F.slidePlan('5','pre')[1].title,/사고력 수학/);
 assert.match(F.slidePlan('14','7')[1].title,/연산/);
});

test('quick draft needs only one current fact, including a semester without a book',()=>{
 for(const [age,grade,axis] of [['5','pre','thinking'],['10','3','calc'],['14','7','calc']]){
  assert.deepEqual(plain(F.slidePlan(age,grade,true).map(s=>s.id)),['current']);
  assert.equal(F.ageCopy(age,grade).order[0],axis);
 }
 const semester=F.build({age:'10',grade:'3',quickDraft:true,school:{stage:'e:4-1'}});
 assert.ok(semester.parentFlow.quickDraft);
 assert.match(F.draftMarkup(semester),/초등 4-1/);
 assert.equal(semester.parentFlow.actualBooks.school,'');
 assert.equal(semester.calc,'unknown');
 const book=F.build({age:'14',grade:'7',quickDraft:true,school:{book:'나의 <개념> 교재'}});
 assert.equal(book.schoolCourse,'unknown');assert.equal(F.inputModel(book).school.book,'나의 <개념> 교재');
 assert.match(F.draftMarkup(book),/나의 &lt;개념&gt; 교재/);
 assert.doesNotMatch(F.draftMarkup(book),/고등 과정|교재를 마쳤/);
 const detail=F.build({...F.inputModel(book),quickDraft:false},book);
 assert.equal(detail.parentFlow.quickDraft,false);assert.equal(detail.parentFlow.actualBooks.school,'나의 <개념> 교재');
});

test('one draft includes each supplied study area in the age-appropriate order',()=>{
 const study={thinking:{book:'킨더팩토'},calc:{book:'기적의 계산법 2권'},school:{stage:'e:2-1'},deep:{stage:'e:1-2'}};
 const younger=F.build({age:'5',grade:'pre',quickDraft:true,...study});
 const older=F.build({...F.inputModel(younger),age:'',grade:'3',quickDraft:true},younger);
 const labels=html=>[...html.matchAll(/<dt>([^<]*)<\/dt>/g)].map(match=>match[1]);
 assert.deepEqual(labels(F.draftMarkup(younger)),['사고력 수학','연산','교과 선행','교과 심화']);
 assert.deepEqual(labels(F.draftMarkup(older)),['연산','교과 선행','교과 심화']);
 assert.equal(F.inputModel(older).thinking.book,'킨더팩토');
});

test('first activities and a deliberate not-started answer produce distinct drafts',()=>{
 const young={age:'5',grade:'pre',quickDraft:true};
 const activity=F.build({...young,thinking:{book:'블록 규칙 찾기'}});
 assert.match(F.draftMarkup(activity),/블록 규칙 찾기/);assert.doesNotMatch(F.draftMarkup(activity),/이번 주|설명해 보세요/);
 const starting=F.build({...young,notStarted:true});assert.match(F.draftMarkup(starting),/아직 수학 공부를 시작하기 전/);
 const now=F.build({...young,calc:{book:'10까지 수 세기'}},starting);
 assert.equal(now.parentFlow.notStarted,false);assert.match(F.draftMarkup(now),/10까지 수 세기/);
 const academy=F.build({...young,thinking:{book:'소마 Ray A3-3',source:'academy'}});
 assert.match(F.draftMarkup(academy),/학원 수업 참고/);
 assert.equal(F.draftMarkup(academy).match(/Ray A3-3/g)?.length,1);
 for(const a of [activity,starting,academy])assert.doesNotMatch(F.draftMarkup(a),/이번 주|수 놀이·사고력|문제 하나/);
 assert.throws(()=>F.build(young),/한 가지/);
});

test('adding a named arithmetic book keeps the original semester visible in the full plan',()=>{
 const a=F.build({grade:'3',age:'10',quickDraft:true,school:{stage:'e:4-2'}});
 const updated=F.build({...F.inputModel(a),quickDraft:false,calc:{book:'기적의 계산법 6권'}},a);
 const m=F.automatic(updated,fields,w.PlannerStandard.model(updated,fields));
 assert.match(F.renderResult(m),/초등 4-2/);assert.match(F.renderResult(m),/기적의 계산법 6권/);
 assert.equal(F.inputModel(updated).calc.book,'기적의 계산법 6권');
});

test('preschool starting course is reported separately from textbook attainment',()=>{
 const early={age:'5',grade:'pre',quickDraft:true};
 const foundation=F.build({...early,thinking:{book:'언어·수감각 키우기',status:'done',range:'1/2단원'}});
 const p=foundation.parentFlow,html=F.draftMarkup(foundation);
 assert.equal(p.thinkingStage,'언어·수감각 키우기');assert.equal(p.actualBooks.thinking,'');
 assert.equal(foundation.thinking,'unknown');assert.equal(I.progressValue(foundation,'thinkingStatus'),null);
 assert.equal(F.inputModel(foundation).thinking.book,p.thinkingStage);
 assert.match(html,/언어·수감각 키우기/);assert.match(html,/다음 과정 · 킨더팩토/);assert.doesNotMatch(html,/이번 주|학습 완료/);
 const kinder=F.build({...early,thinking:{book:'킨더팩토'}},foundation);
 assert.equal(kinder.parentFlow.thinkingStage,'');assert.equal(kinder.parentFlow.actualBooks.thinking,'킨더팩토');
 assert.doesNotMatch(F.draftMarkup(kinder),/언어·수감각 키우기|다음 과정/);
 const gradeOnly=F.build({grade:'3',school:{stage:'e:4-2'}},foundation);
 assert.equal(F.inputModel(gradeOnly).age,'');assert.equal(F.ageCopy('','3').tier,'elementary-upper');
});
