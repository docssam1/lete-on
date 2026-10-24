#!/usr/bin/env node
'use strict';
// Read-only parity checks. No DB, network, mail, SMS or storage clients exist here.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url'),{spawnSync}=require('node:child_process');
const BUILD=require('./build-nm-delivery-runtime.cjs');
const ROOT=path.resolve(__dirname,'..'),DAY=86400000,base=Date.parse('2026-10-19T00:00:00Z');
let checks=0,parity=0,scheduled=0,empty=0;
const check=fn=>{fn();checks++;};
function week(offset){const ms=base+offset*7*DAY,y=new Date(ms+3*DAY).getUTCFullYear(),jan4=Date.UTC(y,0,4),first=jan4-(new Date(jan4).getUTCDay()+6)%7*DAY;return y+'-W'+String(1+Math.round((ms-first)/(7*DAY))).padStart(2,'0');}
function plan(p={}){return {courseKey:'C29',sessionIndex:1,startDate:'2026-10-19',speed:1,amount:1,cadence:'w2',pace:'p2',...p};}
function config(p,w=week(0)){return {courseKey:p.courseKey,sessionIndex:p.sessionIndex,week:w,k:1,amount:p.amount,cadence:p.cadence,deliveryPlanVersion:'20261024-personal1',learningPlan:p};}
async function main(){
  const names=['NM_COURSES','NM_HIGH_PACING','NM_MIDDLE_EXTENSION','NM_LEARNING_PLAN','NM_PLAN_CONTROL','NM_DELIVERY_PLAN'];
  const before=names.map(k=>Object.getOwnPropertyDescriptor(globalThis,k));
  const runtime=await import(pathToFileURL(path.join(ROOT,BUILD.OUTPUT)).href);
  check(()=>assert.deepEqual(names.map(k=>Object.getOwnPropertyDescriptor(globalThis,k)),before,'the generated ESM keeps every browser namespace private'));
  check(()=>assert.deepEqual(Object.keys(runtime),['personalDeliveryState']));
  const built=BUILD.buildRuntime(),disk=fs.readFileSync(path.join(ROOT,BUILD.OUTPUT),'utf8');
  check(()=>assert.equal(disk,built,'generated source bytes, source hashes and course metadata must be current'));
  for(const file of BUILD.MODULES)check(()=>assert(disk.includes(fs.readFileSync(path.join(ROOT,'number_magic',file),'utf8')),'exact module text is reused: '+file));
  check(()=>assert.match(disk,/courseSourceGraph.*courseMetadata.*modules/));
  const gate=spawnSync(process.execPath,[path.join(__dirname,'build-nm-delivery-runtime.cjs'),'--check'],{encoding:'utf8'});
  check(()=>assert.equal(gate.status,0,gate.stderr));
  const {courses}=BUILD.loadCourses(),DP=require('../number_magic/app/delivery-plan.js'),E=require('../number_magic/data/middle-extension.js');
  function same(p,offset){
    const c=config(p,week(offset)),at=DP.assignment(courses,p,c.week),expected=at?(at.weekLessons.length?'scheduled':'empty'):'invalid';
    assert.equal(runtime.personalDeliveryState(c),expected,JSON.stringify({course:p.courseKey,session:p.sessionIndex,speed:p.speed,cadence:p.cadence,anchor:p.extensionAnchor,week:c.week}));
    parity++;if(expected==='scheduled')scheduled++;if(expected==='empty')empty++;
  }
  const speeds=[.7,.85,1,1.25,1.5],cadences=['w1','w2'];
  for(const grade of [1,2,3])for(const speed of speeds)for(const cadence of cadences){
    const first={1:'C29',2:'C32',3:'C35'}[grade],last={1:'C31',2:'C34',3:'C37'}[grade],next={1:'C32',2:'C35',3:'C38'}[grade];
    for(const selected of [false,true]){
      const p=plan({courseKey:first,speed,cadence,...(selected?{middleExtensions:{[grade]:E.version}}:{})});
      for(const offset of [-1,...Array.from({length:32},(_,i)=>i),80,160,300])same(p,offset);
    }
    // Exact legacy partial sources remain inside their original compact bundle.
    for(const sessionIndex of [2,courses[first].sessions.length]){
      const p=plan({courseKey:first,sessionIndex,speed,cadence,middleExtensions:{[grade]:E.version}});
      for(const offset of [0,1,3,5,9,15,24,50])same(p,offset);
    }
    // All late-entry resume sources and both extension boundaries use the same
    // sequence as the full browser courses, without a duplicate core prefix.
    for(let source=1;source<=courses[next].sessions.length;source++)for(const index of [0,11]){
      const p=plan({courseKey:last,sessionIndex:courses[last].sessions.length,speed,cadence,middleExtensions:{[grade]:E.version},extensionAnchor:{grade,index,resume:{courseKey:next,sessionIndex:source}}});
      for(const offset of [-1,0,1,5,9,17])same(p,offset);
    }
  }
  // Elementary rounding, elementary→middle, high, and weighted calculus edges.
  for(const key of ['C0','C1','C4','C25','C28','C38','C49','C60','C70','C73'])for(const speed of speeds)for(const cadence of cadences){
    for(const sessionIndex of [1,courses[key].sessions.length]){
      const p=plan({courseKey:key,sessionIndex,speed,cadence,pace:key==='C0'?'p4':'p2'});
      for(const offset of [-1,0,1,2,4,8,12,24,80,160,300])same(p,offset);
    }
  }
  const emptySlow=config(plan({courseKey:'C73',speed:.7,cadence:'w1'}));
  check(()=>assert.equal(runtime.personalDeliveryState(emptySlow),'empty','the reported slow-calculus first week has no worksheet'));
  check(()=>assert.equal(runtime.personalDeliveryState({...emptySlow,week:week(1)}),'scheduled'));
  check(()=>assert.equal(runtime.personalDeliveryState({...emptySlow,week:week(300)}),'empty','completed schedules never emit another worksheet'));
  check(()=>assert.equal(runtime.personalDeliveryState(config(plan({startDate:'2026-11-02'}))),'empty','future starts are skipped'));
  for(const value of [null,{},[],{...emptySlow,deliveryPlanVersion:'future'},{...emptySlow,highPlanVersion:'20261023-high3m'},{...emptySlow,k:2},{...emptySlow,week:'2025-W53'},{...emptySlow,amount:.85},{...emptySlow,learningPlan:plan({courseKey:'C73',speed:99})}])check(()=>assert.equal(runtime.personalDeliveryState(value),'invalid'));
  check(()=>assert(parity>5000&&scheduled>0&&empty>0));
  console.log('NM_DELIVERY_RUNTIME_OK checks='+checks+' parity='+parity+' scheduled='+scheduled+' empty='+empty+' privateScope=true exactSources=true realNetworkWrites=0');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
