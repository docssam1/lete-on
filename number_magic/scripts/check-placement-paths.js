#!/usr/bin/env node
'use strict';
// Source-built plans; no browser, network, student data or source writes.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('index.html'),world={console};world.window=world;
const context=vm.createContext(world),plain=x=>JSON.parse(JSON.stringify(x));
const scripts=[...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(x=>x[1].split('?')[0]);
const sources=scripts.filter(x=>/^engine\/(?:generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(x));
const files=[...new Set([...sources,'data/curriculum.js','data/threads.js','data/middle-pacing.js','data/wordable.js','data/courses.js','data/stages.js',
  ...fs.readdirSync(path.join(root,'data/units')).filter(x=>x.endsWith('.js')).map(x=>'data/units/'+x),
  'data/placement-plan.js','data/placement-paths.js'])];
files.forEach(f=>vm.runInContext(read(f),context,{filename:f,timeout:10000}));
const paths=world.NM_PLACEMENT_PATHS,core=world.NM_PLACEMENT_PLAN,stages=core.stages();
const learningBefore=JSON.stringify([world.NM_COURSES,world.NM_THREADS,world.NM_UNITS]);
assert.equal(paths.goals.length,3);assert.equal(paths.goals[0].label.ko,'탄탄한 교과 학습을 위한 연산');
assert.equal(paths.targets.length,4);
assert.deepStrictEqual(plain(paths.normalize({goal:'<script>',goalTarget:'fields-s',cadence:'w9'})),{goal:'curriculum',goalTarget:'',cadence:'w2'});
assert.deepStrictEqual(plain(paths.normalize({goal:'science',goalTarget:'fields-s',cadence:'w1'})),{goal:'science',goalTarget:'',cadence:'w1'});
assert.throws(()=>paths.recommend(null,null,{}));
const configs=[{goal:'curriculum'},{goal:'science'},...['',...paths.targets.map(x=>x.id)].map(goalTarget=>({goal:'competition',goalTarget}))];
const patterns=['correct','one-earlier-wrong','previous-wrong','current-wrong','next-wrong','all-wrong','all-skip'];
function response(item,wrong,skipped){return {id:item.id,value:skipped?null:wrong?(Array.isArray(item.answer)?item.answer.map(x=>x+999):item.answer+999):plain(item.answer),
  validationFlags:{validTargets:!wrong},skipped,sec:1};}
let cases=0;
for(const stage of stages){
  const plan=core.build(stage.id,'goals-independent-fixed20'),before=JSON.stringify(plan);
  for(const pattern of patterns){
    const responses=plan.items.map((item,i)=>response(item,pattern==='all-wrong'||pattern==='one-earlier-wrong'&&i===0||
      pattern==='previous-wrong'&&item.band==='previous'||pattern==='current-wrong'&&item.band==='current'||pattern==='next-wrong'&&item.band==='next',pattern==='all-skip'));
    const result=core.summarize(plan,responses),summaryBefore=JSON.stringify(result);
    for(const config of configs)for(const cadence of ['w1','w2']){
      const selection=Object.assign({route:'topic',baselineId:stage.id},config,{cadence}),selectionBefore=JSON.stringify(selection);
      const rec=paths.recommend(plan,result,selection);
      assert.equal(rec.main.stageId,stage.id,'main stage never rolled back by an isolated error');
      assert.equal(rec.main.course,stage.course);assert.equal(rec.main.status,'selected-not-certified');
      const c=world.NM_COURSES[rec.main.course];assert(c&&!c.comingSoon);assert(c.sessions[rec.main.session-1]&&!c.sessions[rec.main.session-1].test);
      assert.equal(rec.assessment.correct,result.correct);assert.equal(rec.assessment.asked,20);
      assert.equal(rec.assessment.admissionReadiness,'not-assessed');assert.equal(rec.assessment.languageReadiness,'not-assessed');
      assert.equal(rec.schedule.weeks,null,'unverified target timelines must not be invented');assert.equal(rec.schedule.cadence,cadence);
      assert.equal(rec.schedule.targetMapping,config.goal==='curriculum'?'not-applicable':'pending');
      assert.equal(rec.config.goalTarget,config.goalTarget||'');
      const next=stages[stages.findIndex(x=>x.id===stage.id)+1];
      assert.equal(rec.next&&rec.next.stageId,next?next.id:null);if(rec.next)assert.equal(rec.next.status,'preview-not-advancement');
      assert.equal(new Set(rec.support.map(x=>[x.stageId,x.t,x.lv].join(':'))).size,rec.support.length);
      for(const support of rec.support){
        const matched=result.profile.filter(p=>p.band!=='next'&&p.stageId===support.stageId&&p.t===support.t&&p.lv===support.lv);
        assert.equal(support.wrong,matched.filter(p=>p.ok===false).length);assert.equal(support.skipped,matched.filter(p=>p.skipped).length);
        assert.equal(support.kind,support.wrong?'practice':'recheck');
        assert(plan.items.some(i=>i.course===support.course&&i.session===support.session&&i.thread===support.t&&i.level===support.lv));
        assert(world.NM_THREADS[support.t].levels.some(x=>x.id===support.lv));
      }
      if(pattern==='correct'||pattern==='next-wrong')assert.equal(rec.support.length,0);
      if(pattern==='one-earlier-wrong'){assert.equal(rec.support.length,1);assert.equal(rec.support[0].wrong,1);}
      if(pattern==='all-skip'){assert.equal(rec.assessment.answered,0);assert(rec.support.every(x=>x.kind==='recheck'&&x.wrong===0));}
      for(const lang of ['ko','en','zh']){
        assert(rec.goal.label[lang]&&rec.goal.direction[lang]&&rec.goal.focus[lang]&&rec.main.label[lang]);
        if(rec.target)assert(rec.target.label[lang]);
      }
      assert.equal(JSON.stringify(plan),before,'goal does not alter questions');assert.equal(JSON.stringify(result),summaryBefore,'goal does not alter scoring');
      assert.equal(JSON.stringify(selection),selectionBefore,'pure recommendation does not change selection');
      cases++;
    }
  }
}
assert.equal(JSON.stringify([world.NM_COURSES,world.NM_THREADS,world.NM_UNITS]),learningBefore,'curriculum and learning levels preserved');
console.log(`PLACEMENT_PATHS_OK stages=${stages.length} goals=3 subgoals=4 patterns=${patterns.length} cases=${cases} fixed20=true scoreInvariant=true noInventedWeeks=true`);
