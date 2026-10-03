#!/usr/bin/env node
'use strict';
// Pure integration checks; rendered UI is checked separately in Playwright.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const world={console};world.window=world;const context=vm.createContext(world);
const scripts=[...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(x=>x[1].split('?')[0]);
const sources=scripts.filter(x=>/^engine\/(?:generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(x));
const files=[...new Set([...sources,'data/curriculum.js','data/threads.js','data/middle-pacing.js','data/wordable.js','data/courses.js','data/stages.js',
  ...fs.readdirSync(path.join(root,'data/units')).filter(x=>x.endsWith('.js')).map(x=>'data/units/'+x),
  'data/placement-plan.js','data/placement-books.js','data/placement-paths.js','app/placement-ui.js'])];
files.forEach(file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file,timeout:10000}));
const ui=world.NM_PLACEMENT_UI,plan=world.NM_PLACEMENT_PLAN,books=world.NM_PLACEMENT_BOOKS;
const plain=x=>JSON.parse(JSON.stringify(x));
assert.equal(ui.initial().version,ui.version);assert.equal(ui.initial().phase,'setup');
for(const [raw,want] of [['123456789',123456789],['−23',-23],['-0.75',-.75],['＋3',null],['１２．５',12.5],['',null],['12x',null],['Infinity',null],['1e3',null]])assert.equal(ui.parseNumber(raw),want,raw);
assert.deepEqual(plain(ui.readValues(['-2','-3','4.5'])),[-2,-3,4.5]);
assert.equal(ui.readValues(['-2','']),null);assert.equal(ui.readValues(['12','12x']),null);
const stages=plan.stages(),ids=new Set(stages.map(x=>x.id));
let mapped=0,pending=0;
assert.equal(books.series.length,9);
for(const series of books.series)for(const step of books.getSteps(series.id))for(const progress of ['start','middle','complete']){
  const r=books.resolve(series.id,step.id,progress);assert(r,series.id+'/'+step.id);
  if(r.needsTopicConfirmation){assert.equal(r.baselineId,null);pending++;}
  else {assert(ids.has(r.baselineId),r.baselineId);assert.equal(plan.build(r.baselineId,'integration').items.length,20);mapped++;}
}
assert(mapped>0&&pending>0);assert.equal(books.resolve('unknown','unknown','complete'),null);
const main=fs.readFileSync(path.join(root,'app/main.js'),'utf8');
const entry=main.slice(main.indexOf('function screenPlacement(){'),main.indexOf('function screenLegacyPlacement(){'));
assert(entry.includes('ui.render('));assert(entry.includes('S._diag.version!==ui.version'));
assert(!entry.includes('placementNext(')&&!entry.includes('renderPlacementQuestion('));
for(const file of ['data/placement-plan.js','data/placement-books.js','data/placement-paths.js','app/placement-ui.js'])assert(scripts.indexOf(file)<scripts.indexOf('app/main.js')&&scripts.indexOf(file)>scripts.indexOf('data/courses.js'),file+' load order');
assert(scripts.indexOf('data/placement-paths.js')<scripts.indexOf('app/placement-ui.js'),'pathway data loads before UI');
// Run the real entry against disposable saved states. A reload enters the portal;
// the diagnostic entry must not discard a compatible setup or answered plan.
const startEntry=main.slice(main.indexOf('function startPlacement(){'),main.indexOf('/* 진단 천장'));
world.save=()=>{};world.render=()=>{};
vm.runInContext(startEntry,context,{filename:'startPlacement-entry'});
let resumeContracts=0;
for(const phase of ['setup','question']){
  const run=ui.initial();run.phase=phase;run.selection.goal='competition';run.selection.goalTarget='fields-e1';run.seed='preserve-seed';
  if(phase==='question'){run.plan=plan.build('c3',run.seed);run.index=3;run.responses=run.plan.items.slice(0,3).map(x=>({id:x.id,value:null,skipped:true}));}
  world.S={_diag:run,coins:321,progress:{synthetic:true}};const before=JSON.stringify(run);
  world.startPlacement();assert.strictEqual(world.S._diag,run);assert.equal(JSON.stringify(run),before);assert.equal(world.S.view,'placement');resumeContracts++;
}
world.S={_diag:{version:'adaptive-old',phase:'question',responses:[{id:'old'}]}};
world.startPlacement();assert.equal(world.S._diag.version,ui.version);assert.equal(world.S._diag.phase,'setup');assert.equal(world.S._diag.responses.length,0);resumeContracts++;
const done=ui.initial();done.phase='result';done.selection.goal='science';done.selection.cadence='w1';
world.S={_diag:done};world.startPlacement();assert.notStrictEqual(world.S._diag,done);assert.equal(world.S._diag.phase,'setup');assert.equal(world.S._diag.selection.goal,'science');assert.equal(world.S._diag.selection.cadence,'w1');resumeContracts++;
world.S={placement:{pathRecommendation:{config:{goal:'competition',goalTarget:'fields-s',cadence:'w2'}}}};
world.startPlacement();assert.equal(world.S._diag.selection.goalTarget,'fields-s');assert.equal(world.S._diag.responses.length,0);resumeContracts++;
// Execute the actual result callback: later-stage probes are not weak spots
// in already-learned material, and skips remain separate from wrong answers.
let capture;
world.NM_PLACEMENT_UI={version:ui.version,initial:ui.initial,render:c=>{capture=c;}};
world.townCleanup=null;world.mgTimer=null;world.clearInterval=()=>{};world.$=()=>({});world.renderMath=()=>{};
vm.runInContext(entry,context,{filename:'screenPlacement-entry'});
let resultContracts=0;
for(const mode of ['next-wrong','one-earlier-wrong','all-skip']){
  const run=ui.initial();run.plan=plan.build('c3','result-contract');run.selection.baselineId='c3';
  const responses=run.plan.items.map((x,i)=>({id:x.id,value:mode==='all-skip'?null:mode==='next-wrong'&&x.band==='next'||mode==='one-earlier-wrong'&&i===0?Array.isArray(x.answer)?x.answer.map(n=>n+999):x.answer+999:plain(x.answer),validationFlags:{validTargets:!(mode==='one-earlier-wrong'&&i===0)},skipped:mode==='all-skip',sec:1}));
  const result=plan.summarize(run.plan,responses);result.pathRecommendation=world.NM_PLACEMENT_PATHS.recommend(run.plan,result,run.selection);
  world.S={_diag:run,coins:321,progress:{synthetic:true},completed:['preserve']};world.screenPlacement();capture.onResult(result,run);
  assert.equal(world.S.placement.course,'C3');assert.equal(world.S.coins,321);assert.deepEqual(plain(world.S.progress),{synthetic:true});
  assert.equal(world.S.placement.weak.length,mode==='one-earlier-wrong'?1:0);resultContracts++;
}
world.NM_PLACEMENT_UI=ui;

// A minimal DOM contract supplements (not replaces) the real browser transition audit.
const stub=()=>({dataset:{},setAttribute(){},appendChild(){},before(){}});
world.document={createElement:stub};
let markup='',view=null;
const screen={scrollTop:230,
  get innerHTML(){return markup;},
  set innerHTML(value){markup=value;const match=value.match(/data-pd-view="([^"]+)"/);view=match?{dataset:{pdView:match[1]}}:null;},
  querySelector(selector){return selector==='.nm-placement'?view:stub();},
  querySelectorAll(){return [];}};
const state=ui.initial(),ctx={root:screen,state,lang:'ko',close(){},save(){},renderMath(){},onResult(){},seeCourse(){},pick(){}};
ui.render(ctx);assert.equal(screen.scrollTop,0,'first entry resets old screen position');
screen.scrollTop=123;state.selection.age='pre6';ui.render(ctx);assert.equal(screen.scrollTop,123,'same setup keeps selection position');
state.plan=plan.build('f-compare5','scroll-contract');state.phase='question';state.index=0;
screen.scrollTop=234;ui.render(ctx);assert.equal(screen.scrollTop,0,'setup to first question resets');
screen.scrollTop=75;ui.render(ctx);assert.equal(screen.scrollTop,75,'same question redraw keeps position');
state.index=1;screen.scrollTop=234;ui.render(ctx);assert.equal(screen.scrollTop,0,'next question resets');
state.phase='result';state.result=plan.summarize(state.plan,[]);screen.scrollTop=234;ui.render(ctx);assert.equal(screen.scrollTop,0,'result resets');
state.phase='setup';screen.scrollTop=234;ui.render(ctx);assert.equal(screen.scrollTop,0,'restart setup resets');
console.log(`PLACEMENT_INTEGRATION_OK stages=${stages.length} bookSelections=${mapped+pending} mapped=${mapped} manual=${pending} numericInput=9 scrollContract=7 resumeContracts=${resumeContracts} resultContracts=${resultContracts}`);
