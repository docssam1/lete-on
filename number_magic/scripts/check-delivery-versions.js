#!/usr/bin/env node
'use strict';
// Local-only compatibility checks. No account, network-write or delivery client.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),DP=require('../app/delivery-plan.js'),legacy=require('../data/delivery-courses-v1.js');
const B=require('../../scripts/build-nm-delivery-runtime.cjs'),WS=require('../../scripts/nm-weekly-worksheets.cjs');
const {courses}=B.loadCourses();
const p={courseKey:'C29',sessionIndex:1,startDate:'2026-10-19',speed:1,amount:1,cadence:'w2',pace:'p2'},week='2026-W43';
const config=(version,plan=p)=>({courseKey:plan.courseKey,sessionIndex:plan.sessionIndex,week,k:1,amount:plan.amount,cadence:plan.cadence,deliveryPlanVersion:version,learningPlan:plan});
let checks=0;function check(fn){fn();checks++;}
check(()=>assert.deepEqual(DP.decode(DP.encode(p)),p));
for(const version of [DP.LEGACY_VERSION,DP.VERSION]){
 check(()=>assert.deepEqual(DP.fromConfig(config(version)),p));
 const target=WS.worksheetTarget({name:'local-fixture',deliveryPlanVersion:version,learningPlan:p});
 check(()=>assert.equal(new URL(WS.buildWorksheetUrl('http://localhost',week,target,1)).searchParams.get('dv'),version));
}
check(()=>assert.equal(DP.fromConfig(config('future')),null));
check(()=>assert.equal(DP.fromConfig(config(DP.LEGACY_VERSION,{...p,curriculumRevision:DP.CURRICULUM_REVISION})),null));
check(()=>assert.equal(DP.normalize({...p,curriculumRevision:'future'}),null));
check(()=>assert.equal(DP.fromConfig(config(DP.VERSION,{...p,curriculumRevision:DP.CURRICULUM_REVISION})).curriculumRevision,DP.CURRICULUM_REVISION));
const frozen=JSON.stringify(legacy),clone=JSON.parse(JSON.stringify(courses));
// Demonstrate that updating current placement cannot alter the v1 references.
clone.C29.studyPlan.lessons[0].sourceIndices=[0];clone.C29.studyPlan.lessons[0].endSession=1;
check(()=>assert.deepEqual(DP.assignment(clone,p,week,DP.LEGACY_VERSION),DP.assignment(legacy,p,week,DP.LEGACY_VERSION)));
check(()=>assert.notDeepEqual(DP.assignment(clone,p,week,DP.VERSION).weekLessons[0].sourceIndices,DP.assignment(clone,p,week,DP.LEGACY_VERSION).weekLessons[0].sourceIndices));
check(()=>assert.equal(JSON.stringify(legacy),frozen));
// Stable course identities / saved 1-based source ranges; source content can differ in v2.
for(const key of Object.keys(legacy))check(()=>assert.equal(courses[key].sessions.length,legacy[key].sessions.length,key));
check(()=>assert.equal(legacy.C0.sessions.length,19));
check(()=>assert.equal(Object.keys(legacy).length,74));
check(()=>assert.equal(Object.values(legacy).reduce((n,c)=>n+c.sessions.length,0),551));
for(const [key,oldVersion,newVersion] of [['C29','20261023-middle25','20261026-middle25-v2'],['C38','20261023-high3m','20261026-high3m-v2'],['C70','20261024-calculus3m','20261026-calculus3m-v2']]){
  check(()=>assert.equal(DP.managedVersion(key,oldVersion),DP.LEGACY_VERSION));
  check(()=>assert.equal(DP.managedVersion(key,newVersion),DP.VERSION));
  check(()=>assert.equal(DP.managedVersion(key,'future'),null));
  const target=WS.worksheetTarget({name:'fixture',courseKey:key,highPlanVersion:oldVersion,cadence:'w2',amount:1});
  check(()=>assert.equal(target.highPlanVersion,oldVersion));
  check(()=>assert.equal(new URL(WS.buildWorksheetUrl('http://localhost',week,target,1)).searchParams.get('highPlanVersion'),oldVersion));
}
// Fixed lesson counts, same source coverage and no worsening peak within a
// course (the only legal split boundaries are between whole source sessions).
for(const [key,c]of Object.entries(courses).filter(([k,c])=>c.studyPlan)){
  const before=legacy[key].studyPlan.lessons,after=c.studyPlan.lessons;
  check(()=>assert.equal(after.length,before.length,key));
  check(()=>assert.deepEqual(after.flatMap(l=>l.sourceIndices),Array.from({length:c.sessions.length},(_,i)=>i),key));
  check(()=>assert(Math.max(...after.map(l=>l.estimatedMinutes))<=Math.max(...before.map(l=>l.estimatedMinutes))+1e-8,key));
}
(async()=>{
 const runtime=await import(path.join(root,B.OUTPUT));
 for(const version of [DP.LEGACY_VERSION,DP.VERSION])for(const key of ['C0','C29','C35','C38','C60','C70'])for(const speed of [.7,.85,1,1.25,1.5])for(const cadence of ['w1','w2']){
   const plan={...p,courseKey:key,speed,cadence},cfg=config(version,plan),expected=DP.assignment(courses,plan,week,version);
   check(()=>assert.equal(runtime.personalDeliveryState(cfg),expected?.weekLessons.length?'scheduled':expected?'empty':'invalid'));
 }
 console.log('DELIVERY_VERSIONS_OK checks='+checks+' legacyCourses=74 legacySources=551 v1PlacementFrozen=true v2Current=true historicalGenerators=false networkWrites=0');
})().catch(e=>{console.error(e);process.exitCode=1;});
