import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const network=[];
for(const name of ['fetch','XMLHttpRequest','WebSocket','EventSource'])globalThis[name]=()=>{network.push(name);throw Error('Network prohibited');};
const {createState}=await import('../../roadmap/v31/engine.mjs');
const {ensureWizard,addBook}=await import('../../roadmap/v31/flow.mjs');
const {ensureQuick,collectQuick,commitLearning,quickScreen}=await import('../../roadmap/v31/quick-flow.mjs');
const {validateReviewState}=await import('../../roadmap/v31/review-validation.mjs');
const {prepareTutorial,tutorialEntryScreen,nextTutorialEntry,collectTutorialBirth,tutorialCue}=await import('../../roadmap/v31/tutorial-intake.mjs');
const {startScene,sceneScreen,chooseScene,nextScene,collectScene,backScene}=await import('../../roadmap/v31/scene-intake.mjs');
const {startCompact,collectCompact,isCompactStep}=await import('../../roadmap/v31/compact-intake.mjs');
const {resultHubScreen}=await import('../../roadmap/v31/result-hub.mjs');
const form=v=>new Map(Object.entries(v));
const copy=v=>structuredClone(v);
function fresh(stage='p5'){
 const s=ensureQuick(ensureWizard(createState('2026-10-19T00:00:00.000Z')));
 s.wizard.quick.stage=stage;prepareTutorial(s);return s;
}
function learning(s){s.wizard.step='learning';startScene(s);return s;}
const cursor=s=>s.wizard.quick.scene.cursor;
function finish(s){chooseScene(s,'unknown');const next=chooseScene(s,'unknown');commitLearning(s,{sceneOnly:true});return next;}

test('new entry greets before any experience, academy or catalog controls',()=>{
 const s=fresh(),view=tutorialEntryScreen(s);
 assert.equal(s.wizard.step,'intro');assert.match(view.say,/안녕하세요.*독쌤/);
 assert.match(view.html,/<details class="tutorial-import">/);assert.doesNotMatch(view.html,/\bopen\b|academy:|learn:|WHY 1/);assert.equal(view.next,'독쌤과 시작하기');assert.equal(nextTutorialEntry(s),'stage');
 assert.equal(isCompactStep(s),false);
});
test('stage and birth month are separate questions, with a validated optional month',()=>{
 const s=fresh();s.wizard.step='stage';const view=tutorialEntryScreen(s);
 assert.match(view.html,/name="stage"/);assert.doesNotMatch(view.html,/birthMonth|academy|목차/);
 collectQuick(s,form({stage:'p5'}));assert.equal(nextTutorialEntry(s),'tutorial-birth');
 s.wizard.step='tutorial-birth';assert.match(tutorialEntryScreen(s).html,/name="birthMonth"/);
 collectTutorialBirth(s,'');assert.equal(s.profile.reportedBirthMonth,null);
 collectTutorialBirth(s,'12');assert.equal(s.profile.reportedBirthMonth,12);
 for(const v of ['0','13','x','1.5'])assert.throws(()=>collectTutorialBirth(s,v));
 assert.equal(nextTutorialEntry(s),'learning');
});
for(const stage of ['p7','초1','초5','중2','고3'])test(`${stage} begins with thinking experience after basic information`,()=>{
 const s=fresh(stage);s.wizard.step='stage';assert.equal(nextTutorialEntry(s),'learning');learning(s);
 assert.equal(cursor(s),'thinking-kind');assert.equal(s.wizard.quick.scene.version,2);
 const view=sceneScreen(s);assert.equal(view.title,'사고력으로 공부한 경험이 있나요?');
 assert.equal((view.html.match(/data-scene-answer=/g)||[]).length,5);
 assert.doesNotMatch(view.html,/academy:|WHY 1|프리미어|참고 목차|learn:/);
});
test('unselected or malformed age cannot advance',()=>{
 const s=fresh('');s.wizard.step='stage';assert.throws(()=>nextTutorialEntry(s));
 s.wizard.quick.stage='초7';assert.throws(()=>nextTutorialEntry(s));
});
test('academy path separates institution, its level and timing',()=>{
 const s=learning(fresh());chooseScene(s,'academy');assert.equal(cursor(s),'thinking-academy');
 assert.doesNotMatch(sceneScreen(s).html,/academy:level|academy:timing|WHY 1/);
 chooseScene(s,'필즈');assert.equal(cursor(s),'thinking-academy-level');
 const html=sceneScreen(s).html;assert.match(html,/>G \(주 1회\)</);assert.match(html,/>H \(주 1회\)</);
 assert.doesNotMatch(html,/academy:institution|academy:timing|<input/);
 collectScene(s,form({'academy:level':'G'}),'academy:level');nextScene(s);assert.equal(cursor(s),'thinking-academy-timing');
 assert.doesNotMatch(sceneScreen(s).html,/academy:level/);chooseScene(s,'past');assert.equal(cursor(s),'application-kind');
 assert.equal(finish(s),'position-quick');assert.equal(s.wizard.academies.length,1);
 assert.deepEqual(Object.fromEntries(['institution','level','status','timingReported'].map(k=>[k,s.wizard.academies[0][k]])),{institution:'필즈',level:'G',status:'past',timingReported:true});
});
test('CMS stays WHY 1–15; Simath skips a new level question',()=>{
 const cms=learning(fresh());chooseScene(cms,'academy');chooseScene(cms,'CMS');
 const html=sceneScreen(cms).html;assert.match(html,/WHY 15/);assert.doesNotMatch(html,/WHY 16|WHY 9-1/);
 const sim=learning(fresh());sim.wizard.academies=[{id:'old',institution:'시매쓰',level:'옛단계'}];
 chooseScene(sim,'academy');chooseScene(sim,'시매쓰');assert.equal(cursor(sim),'thinking-academy-timing');
 chooseScene(sim,'current');finish(sim);assert.equal(sim.wizard.academies[0].level,'옛단계');
});
test('custom academy name does not open a free level input',()=>{
 const s=learning(fresh());chooseScene(s,'academy');chooseScene(s,'other');assert.equal(cursor(s),'thinking-academy-name');
 assert.throws(()=>nextScene(s));collectScene(s,form({'academy:name':'우리 학원'}));nextScene(s);
 assert.equal(cursor(s),'thinking-academy-timing');assert.doesNotMatch(sceneScreen(s).html,/academy:level|<input/);
});
test('book-only path never asks an academy and separates name, scope and completion',()=>{
 const s=learning(fresh());chooseScene(s,'book');assert.equal(cursor(s),'thinking-book');
 assert.match(sceneScreen(s).html,/learn:thinking:name/);assert.doesNotMatch(sceneScreen(s).html,/learn:thinking:volume|academy/);
 assert.throws(()=>nextScene(s));collectScene(s,form({'learn:thinking:name':'키즈팩토'}));nextScene(s);
 assert.equal(cursor(s),'thinking-scope');assert.doesNotMatch(sceneScreen(s).html,/learn:thinking:name/);
 collectScene(s,form({'learn:thinking:volume':'A단계'}));nextScene(s);assert.equal(cursor(s),'thinking-progress');
 collectScene(s,form({'learn:thinking:completion':'in_progress'}),'learn:thinking:completion');nextScene(s);finish(s);
 assert.equal(s.courses.length,1);assert.equal(s.courses[0].course,'키즈팩토');assert.equal(s.courses[0].volume,'A단계');assert.equal(s.courses[0].completion,'in_progress');assert.equal(s.wizard.academies.length,0);
});
test('both path records academy and a separate book without class-to-book inference',()=>{
 const s=learning(fresh());chooseScene(s,'both');chooseScene(s,'소마');collectScene(s,form({'academy:level':'프리미어2'}));nextScene(s);chooseScene(s,'current');
 assert.equal(cursor(s),'thinking-book');assert.equal(s.courses.length,0);
 collectScene(s,form({'learn:thinking:name':'초등팩토'}));nextScene(s);collectScene(s,form({'learn:thinking:volume':'1권'}));nextScene(s);collectScene(s,form({'learn:thinking:completion':''}));nextScene(s);finish(s);
 assert.equal(s.courses.length,1);assert.equal(s.courses[0].course,'초등팩토');assert.equal(s.wizard.academies[0].level,'프리미어2');
});
test('not started and unknown remain distinct and never erase old courses',()=>{
 for(const value of ['not_started','unknown']){
  const s=fresh();learning(s);chooseScene(s,value);assert.equal(s.wizard.axisStatus.thinking,value);
  const old=fresh();const c=addBook(old,'thinking','기존 교재');c.volume='K';const before=copy(old.courses);learning(old);chooseScene(old,value);finish(old);assert.deepEqual(old.courses,before);
 }
});
test('back and JSON resume keep institution-specific old free values without cross inheritance',()=>{
 const s=fresh();s.wizard.academies=[{id:'s',institution:'소마',level:'P',status:'unknown'},{id:'c',institution:'CMS',level:'옛 자유 반',status:'past'}];s.wizard.quick.academyId='s';learning(s);
 chooseScene(s,'academy');chooseScene(s,'소마');assert.match(sceneScreen(s).html,/기존 입력 · P/);
 collectScene(s,form({'academy:level':'A2'}));assert.equal(backScene(s),true);chooseScene(s,'CMS');
 assert.equal(s.wizard.quick.draft['academy:level'],'옛 자유 반');assert.match(sceneScreen(s).html,/기존 입력 · 옛 자유 반/);
 const restored=JSON.parse(JSON.stringify(s));prepareTutorial(restored);assert.equal(cursor(restored),'thinking-academy-level');
 backScene(restored);chooseScene(restored,'소마');assert.equal(restored.wizard.quick.draft['academy:level'],'A2');
 assert.equal(backScene(restored),true);assert.equal(cursor(restored),'thinking-academy');
 assert.match(sceneScreen(restored).say,/앞에서/);assert.equal(tutorialCue(restored,sceneScreen(restored)).id,'roadmap.thinking-academy.review');
 assert.equal(s.wizard.academies[0].level,'P');assert.equal(s.wizard.academies[1].level,'옛 자유 반');
});
test('compact pending custom book, scope and academy draft survive entering the greeting',()=>{
 const s=ensureQuick(ensureWizard(createState('2026-10-19T00:00:00.000Z')));s.wizard.step='learning';s.wizard.quick.stage='초3';startCompact(s);
 collectCompact(s,form({'compact:thinking:choice':'__custom__'}),'compact:thinking:choice');
 collectCompact(s,form({'compact:thinking:name':'이름 그대로'}),'compact:thinking:name');
 collectCompact(s,form({'compact:thinking:volume':'__custom__','compact:thinking:customVolume':'권 그대로'}),'compact:thinking:customVolume');
 collectCompact(s,form({'compact:academy:choice':'소마'}),'compact:academy:choice');collectCompact(s,form({'compact:academy:level':'A2'}),'compact:academy:level');
 const before=copy(s.wizard.quick.compact);prepareTutorial(s);assert.equal(s.wizard.step,'intro');assert.equal(isCompactStep(s),false);
 assert.deepEqual(s.wizard.quick.compact,before);assert.equal(s.wizard.quick.draft['learn:thinking:name'],'이름 그대로');assert.equal(s.wizard.quick.draft['learn:thinking:volume'],'권 그대로');
 learning(s);assert.equal(s.wizard.quick.draft['academy:level'],'A2');assert.equal(s.courses.length,0);
});
test('re-submitting the same linked middle book preserves its ID, school level and unrelated history',()=>{
 const s=fresh('초3'),c=addBook(s,'application','쎈 중등 수학');Object.assign(c,{volume:'1-1',level:'middle',completion:'in_progress',range:'50쪽',note:'그대로'});s.wizard.quick.courseIds.application=c.id;
 learning(s);chooseScene(s,'unknown');chooseScene(s,'book');quickScreen(s,{});const id=c.id;
 nextScene(s);collectScene(s,form({'learn:application:volume':'1-2'}));nextScene(s);collectScene(s,form({'learn:application:completion':'in_progress'}));nextScene(s);chooseScene(s,'unknown');commitLearning(s,{sceneOnly:true});
 assert.equal(s.courses.length,1);assert.equal(s.courses[0].id,id);assert.equal(s.courses[0].level,'middle');assert.equal(s.courses[0].range,'50쪽');assert.equal(s.courses[0].note,'그대로');
 assert.equal(validateReviewState(s).valid,true);
});
test('unchanged legacy progress does not become an explicit unknown answer',()=>{
 const s=fresh(),c=addBook(s,'thinking','기존 교재');c.volume='K';c.completion='unknown';delete c.completionInput;s.wizard.quick.courseIds.thinking=c.id;
 const before=copy(s.courses);learning(s);chooseScene(s,'book');quickScreen(s,{});nextScene(s);nextScene(s);
 assert.match(sceneScreen(s).html,/<option value="" selected>아직 입력하지 않을게요/);
 collectScene(s,form({'learn:thinking:completion':''}));nextScene(s);finish(s);assert.deepEqual(s.courses,before);
 commitLearning(s,{sceneOnly:true});assert.deepEqual(s.courses,before);
});
test('pending replacement book does not inherit the previous book progress',()=>{
 const s=ensureQuick(ensureWizard(createState('2026-10-19T00:00:00.000Z')));s.wizard.quick.stage='초3';s.wizard.step='learning';
 const c=addBook(s,'thinking','기존 교재');Object.assign(c,{volume:'K',completion:'reported_done',range:'99쪽'});s.wizard.quick.courseIds.thinking=c.id;startCompact(s);
 collectCompact(s,form({'compact:thinking:choice':'키즈팩토'}),'compact:thinking:choice');prepareTutorial(s);
 assert.equal(s.wizard.quick.draft['learn:thinking:name'],'키즈팩토');assert.equal(s.wizard.quick.draft['learn:thinking:range'],'');assert.equal(s.wizard.quick.draft['learn:thinking:completion'],'unknown');assert.equal(c.range,'99쪽');
});
test('all institution drafts survive transition from the compact form',()=>{
 const s=ensureQuick(ensureWizard(createState('2026-10-19T00:00:00.000Z')));s.wizard.quick.stage='초3';s.wizard.step='learning';startCompact(s);
 collectCompact(s,form({'compact:academy:choice':'CMS'}),'compact:academy:choice');collectCompact(s,form({'compact:academy:level':'WHY 7'}),'compact:academy:level');
 collectCompact(s,form({'compact:academy:choice':'소마'}),'compact:academy:choice');collectCompact(s,form({'compact:academy:level':'A1'}),'compact:academy:level');prepareTutorial(s);learning(s);chooseScene(s,'academy');chooseScene(s,'CMS');
 assert.equal(s.wizard.quick.draft['academy:level'],'WHY 7');backScene(s);chooseScene(s,'소마');assert.equal(s.wizard.quick.draft['academy:level'],'A1');
});
test('an unchanged stale compact snapshot cannot replace a newer saved book value',()=>{
 const s=ensureQuick(ensureWizard(createState('2026-10-19T00:00:00.000Z')));s.wizard.quick.stage='초3';s.wizard.step='learning';
 const c=addBook(s,'application','쎈 중등 수학');Object.assign(c,{volume:'1-1',level:'middle',range:'옛 범위'});s.wizard.quick.courseIds.application=c.id;startCompact(s);
 const draft=copy(s.wizard.quick.compact);c.volume='1-2';c.range='새 범위';prepareTutorial(s);learning(s);chooseScene(s,'unknown');chooseScene(s,'book');quickScreen(s,{});
 assert.deepEqual(s.wizard.quick.compact,draft);assert.equal(s.wizard.quick.draft['learn:application:volume'],'1-2');assert.equal(s.wizard.quick.draft['learn:application:range'],'새 범위');
});
test('an untouched academy cache follows the saved raw value instead of resurrecting a stale level',()=>{
 const s=ensureQuick(ensureWizard(createState('2026-10-19T00:00:00.000Z')));s.wizard.quick.stage='초3';s.wizard.step='learning';
 s.wizard.academies=[{id:'old',institution:'CMS',level:'W5',status:'unknown'}];startCompact(s);s.wizard.academies[0].level='옛 직접 입력';prepareTutorial(s);learning(s);chooseScene(s,'academy');chooseScene(s,'CMS');
 assert.equal(s.wizard.quick.draft['academy:level'],'옛 직접 입력');assert.equal(s.wizard.academies[0].level,'옛 직접 입력');
});
test('finished result is not automatically restarted by preparing the tutorial',()=>{
 const s=fresh();s.wizard.step='overview';const state=JSON.stringify(s);prepareTutorial(s);assert.equal(JSON.stringify(s),state);
});
test('result academy catalogs are behind a closed optional disclosure',()=>{
 const s=fresh('초3');s.wizard.academies=[{id:'c',institution:'CMS',level:'WHY 9'}];s.wizard.step='overview';
 const html=resultHubScreen(s).html;assert.match(html,/<details class="result-hub-academy-details"><summary>학원 경험과 참고 목차 보기/);
 assert.doesNotMatch(html,/<details class="result-hub-academy-details"[^>]*\bopen\b/);
});
test('entry controls and guide metadata contain no voice runtime or game/worksheet routing',()=>{
 const s=learning(fresh()),cue=tutorialCue(s,sceneScreen(s));assert.equal(cue.id,'roadmap.thinking-kind');assert.equal(cue.scene,'thinking-kind');assert.ok(cue.text);
 const source=readFileSync(new URL('../../roadmap/v31/tutorial-intake.mjs',import.meta.url),'utf8');assert.doesNotMatch(source,/fetch\(|new Audio|speechSynthesis|mediaDevices|ws\.html|\/w\/|gameUrl/);
 assert.deepEqual(network,[]);
});
test('published entry versions changed modules consistently before loading the app',()=>{
 const index=readFileSync(new URL('../../roadmap/v31/index.html',import.meta.url),'utf8');
 const map=JSON.parse(index.match(/<script type="importmap">([\s\S]*?)<\/script>/)[1]).imports;
 assert.equal(map['./scene-intake.mjs'],map['./scene-intake.mjs?v=35']);
 assert.equal(map['./quick-flow.mjs'],'./quick-flow.mjs?v=37');
 assert.ok(index.indexOf('type="importmap"')<index.indexOf('type="module"'));assert.match(index,/src="app.mjs\?v=37"/);assert.match(index,/scene-ui\.css\?v=37/);
 for(const url of new Set(Object.values(map))){assert.match(url,/^\.\/(?:data\/)?[^/]+\.mjs\?v=37$/);assert.ok(readFileSync(new URL('../../roadmap/v31/'+url.slice(2).split('?')[0],import.meta.url)).length);}
});


test('a legacy completed result adopts the guide without erasing records or restarting intake',()=>{
 const s=ensureQuick(ensureWizard(createState('2026-10-19T00:00:00.000Z')));s.wizard.step='overview';s.wizard.quick.stage='초3';
 const c=addBook(s,'thinking','기존 교재');c.volume='K';s.wizard.academies=[{id:'old',institution:'소마',level:'P',status:'unknown'}];
 const courses=copy(s.courses),academies=copy(s.wizard.academies);prepareTutorial(s);
 assert.equal(s.wizard.step,'overview');assert.equal(s.wizard.quick.intakeMode,'tutorial');assert.deepEqual(s.courses,courses);assert.deepEqual(s.wizard.academies,academies);
 s.wizard.step='intro';assert.match(tutorialEntryScreen(s).say,/안녕하세요/);assert.equal(isCompactStep(s),false);
});
