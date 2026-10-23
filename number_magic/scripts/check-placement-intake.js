#!/usr/bin/env node
'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const world={console};world.window=world;const context=vm.createContext(world);
const src=[...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(x=>x[1].split('?')[0]);
const files=[...src.filter(x=>/^engine\/(generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(x)),
  'data/curriculum.js','data/threads.js','data/middle-pacing.js','data/wordable.js','data/courses.js','data/stages.js',
  ...fs.readdirSync(path.join(root,'data/units')).filter(x=>x.endsWith('.js')).map(x=>'data/units/'+x),'data/placement-plan.js','data/placement-books.js','data/placement-paths.js'];
for(const f of new Set(files))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f});
const P=world.NM_PLACEMENT_PATHS,core=world.NM_PLACEMENT_PLAN,ids=new Set(core.stages().map(x=>x.id));
let cases=0;
for(let age=4;age<=19;age++)for(const route of ['age','unlearned']){
  const id=P.startingPoint({age:String(age),route});assert(ids.has(id));
  if(route==='unlearned')assert.equal(id,'f-count5');
  const plan=core.build(id,'intake');assert.equal(plan.items.length,20);cases++;
}
for(const grade of ['e1','e2','e3','e4','e5','e6','m1','m2','m3','h1','h2','h3']){
  const a=P.startingPoint({age:'12',route:'school',grade,semester:'1'});
  assert(ids.has(a));assert.equal(a,P.startingPoint({age:'12',route:'school',grade,semester:'2'}),'no invented semester mapping');cases++;
}
for(const age of ['',null,'school','bad','3','20','6.5'])assert.equal(P.startingPoint({age,route:'age'}),null);
assert.equal(P.startingPoint({age:'12',route:'school',grade:'bad'}),null);
assert.equal(P.startingPoint({age:'16',route:'age',grade:'m2'}),'c32','one age/grade route allows actual grade override');
assert.equal(P.startingPoint({age:'16',route:'age',grade:'pre'}),'f-count5','explicit preschool override must not revert to middle school');
assert.equal(P.startingPoint({age:'6',route:'book',series:'miracle',step:'pre-2023-v1-order',progress:'middle'}),'f-order10');
assert.equal(P.startingPoint({age:'6',route:'book',series:'miracle',step:'pre-2023-v1-order'}),'f-order10','selected narrow topic does not need invented progress');
assert.equal(P.startingPoint({age:'6',route:'book',series:'miracle',step:'pre-2023-v1-order',progress:'unknown'}),null,'unknown progress cannot certify a candidate');
let somaVolumes=0;
for(const [stage,count] of [['P',8],['K',8],['A',8],['B',8],['C',8],['D',6]]){
 const series='soma-'+stage.toLowerCase(),steps=world.NM_PLACEMENT_BOOKS.getSteps(series);
 assert.deepEqual(Array.from(steps,x=>x.id),Array.from({length:count},(_,i)=>'v'+(i+1)));
 assert.deepEqual(Array.from(steps,x=>x.label.ko),Array.from({length:count},(_,i)=>stage+(i+1)+'권'));
 const editions=world.NM_PLACEMENT_BOOKS.getEditions(series);
 assert(editions.some(x=>x.id==='2019'),series+' has the selected publication');
 const published=world.NM_PLACEMENT_BOOKS.getSteps(series,'2019');
 assert.deepEqual(Array.from(published,x=>x.id),Array.from(steps,x=>x.id),'publication choice keeps saved volume IDs');
 assert(published.every(x=>x.topicSummary&&x.sourceVerification==='retailer-topic-summary'&&x.verification==='topic-confirmation'&&!x.baselineId),
   series+' 2019 volume cues must not certify app question coverage');
 if(stage==='P'){
  const older=world.NM_PLACEMENT_BOOKS.getSteps(series,'2013');
  assert.notEqual(older[0].topicSummary.ko,published[0].topicSummary.ko,'P1 changed between published sets');
  assert.equal(world.NM_PLACEMENT_BOOKS.getSteps(series,'')[0].topicSummary,undefined,'unknown publication stays unknown');
 }
 for(const step of steps){
  assert.deepEqual(Array.from(world.NM_PLACEMENT_BOOKS.getBookCourses(series,step.id)),[]);
  assert.equal(P.startingPoint({age:'6',route:'book',series,step:step.id,progress:'complete'}),null,'a completed Soma volume never certifies an app course');
  const resolved=world.NM_PLACEMENT_BOOKS.resolve(series,step.id,'complete');
  assert.equal(resolved.baselineId,null);assert.equal(resolved.needsTopicConfirmation,true);
  somaVolumes++;
 }
}
const explicitTopicPlan=core.build('f-ten10','completed-volume-confirmed-topic');
assert.equal(explicitTopicPlan.items.length,20);
assert.deepEqual(['previous','current','next'].map(band=>explicitTopicPlan.items.filter(item=>item.band===band).length),[6,10,4],
 'a confirmed app topic retains the review/current/ahead 6/10/4 mix');
const dunoroSteps=world.NM_PLACEMENT_BOOKS.getSteps('dunoro');
assert.deepEqual(Array.from(dunoroSteps,x=>x.id),['level-1','level-2','level-3','contents']);
assert.deepEqual(Array.from(dunoroSteps.slice(0,3),x=>x.label.ko),[
 'Level 1 · 교재 과정 1~10','Level 2 · 교재 과정 11~16','Level 3 · 교재 과정 17~25']);
assert(dunoroSteps.every(x=>x.sourceVerification==='unconfirmed'));
for(const [stepId,first,last] of [['level-1',1,10],['level-2',11,16],['level-3',17,25]]){
 const numbers=world.NM_PLACEMENT_BOOKS.getBookCourses('dunoro',stepId);
 assert.deepEqual(Array.from(numbers),Array.from({length:last-first+1},(_,i)=>first+i));
 for(const bookCourseNumber of numbers)assert.equal(P.startingPoint({age:'6',route:'book',series:'dunoro',step:stepId,bookCourseNumber}),null,'book course number is stored without assigning an app course');
}
assert.deepEqual(Array.from(world.NM_PLACEMENT_BOOKS.getBookCourses('dunoro','contents')),[]);
for(const step of dunoroSteps)for(const progress of ['', 'start','middle','complete']){
 const selection={age:'6',route:'book',series:'dunoro',step:step.id,progress};
 assert.equal(P.startingPoint(selection),null,'book course numbers never become app course numbers');
 const resolved=world.NM_PLACEMENT_BOOKS.resolve('dunoro',step.id,progress);
 assert.equal(resolved.baselineId,null);assert.equal(resolved.needsTopicConfirmation,true);
}
for(const series of ['soma-p','soma-k','soma-a','soma-b','soma-c','soma-d','kumon','dunoro']){
 assert(world.NM_PLACEMENT_BOOKS.series.some(x=>x.id===series));
 assert.equal(P.startingPoint({age:'6',route:'book',series,step:world.NM_PLACEMENT_BOOKS.getSteps(series)[0].id,progress:'middle'}),null,'unverified book never assigns a course');
}
let paper=0;
for(const id of ['f-count5','f-ten10','c3','c29','c45','c73']){
  const plan=core.build(id,'paper-intake'),before=JSON.stringify(plan);
  for(const kind of ['o','x','n','','mixed','next-wrong']){
    const marks=plan.items.map((x,i)=>kind==='mixed'?['o','x','n'][i%3]:kind==='next-wrong'?(x.band==='next'?'x':'o'):kind);
    const out=P.paperAnalysis(plan,marks,{goal:'science'});
    assert.equal(out.result.correct,marks.filter(x=>x==='o').length);
    assert.equal(out.result.profile.filter(x=>x.skipped).length,marks.filter(x=>x==='n'||x==='').length);
    assert.equal(out.workload.applied,false);assert.equal(out.workload.speed,1);assert.equal(out.workload.amount,1);
    if(kind==='next-wrong')assert.equal(out.path.support.length,0);
    assert.equal(JSON.stringify(plan),before);paper++;
  }
  for(const marks of [[],new Array(20),Array(19).fill('o'),Array(20).fill('bad')])assert.throws(()=>P.paperAnalysis(plan,marks,{}),/Invalid paper marks/);
}
console.log('PLACEMENT_INTAKE_OK starts='+cases+' paperPatterns='+paper+' somaVolumes='+somaVolumes+' fixed20=true noSemesterCertification=true');
