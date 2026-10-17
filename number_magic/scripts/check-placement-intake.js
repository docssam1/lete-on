#!/usr/bin/env node
'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const world={console};world.window=world;const context=vm.createContext(world);
const src=[...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(x=>x[1].split('?')[0]);
const files=[...src.filter(x=>/^engine\/(generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(x)),
  'data/curriculum.js','data/threads.js','data/middle-pacing.js','data/wordable.js','data/courses.js','data/stages.js',
  ...fs.readdirSync(path.join(root,'data/units')).filter(x=>x.endsWith('.js')).map(x=>'data/units/'+x),'data/placement-plan.js','data/placement-paths.js'];
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
let paper=0;
for(const id of ['f-count5','f-ten10','c3','c29','c45','c73']){
  const plan=core.build(id,'paper-intake'),before=JSON.stringify(plan);
  for(const kind of ['o','x','n','mixed','next-wrong']){
    const marks=plan.items.map((x,i)=>kind==='mixed'?['o','x','n'][i%3]:kind==='next-wrong'?(x.band==='next'?'x':'o'):kind);
    const out=P.paperAnalysis(plan,marks,{goal:'science'});
    assert.equal(out.result.correct,marks.filter(x=>x==='o').length);
    assert.equal(out.result.profile.filter(x=>x.skipped).length,marks.filter(x=>x==='n').length);
    assert.equal(out.workload.applied,false);assert.equal(out.workload.speed,1);assert.equal(out.workload.amount,1);
    if(kind==='next-wrong')assert.equal(out.path.support.length,0);
    assert.equal(JSON.stringify(plan),before);paper++;
  }
  for(const marks of [[],new Array(20),Array(20).fill(''),Array(19).fill('o'),Array(20).fill('bad')])assert.throws(()=>P.paperAnalysis(plan,marks,{}),/20 marks/);
}
console.log('PLACEMENT_INTAKE_OK starts='+cases+' paperPatterns='+paper+' fixed20=true noSemesterCertification=true');
