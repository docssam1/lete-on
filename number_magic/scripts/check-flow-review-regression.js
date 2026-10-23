#!/usr/bin/env node
'use strict';
// Focused regression for observed warm-up flow defects. No app/server writes.
// --observe reports the current behavior instead of enforcing corrected expectations.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),main=fs.readFileSync(path.join(root,'app/main.js'),'utf8'),stats=fs.readFileSync(path.join(root,'app/progress-stats.js'),'utf8');
const wallet=require('../app/character-state.js');
const section=(name,end)=>{const a=main.indexOf('function '+name+'('),b=main.indexOf(end,a);assert(a>=0&&b>a);return main.slice(a,b);};
function setup(completed,options={}){
 const store=options.store||new Map(),nodes={},timers=[],events={saves:0,renders:0,statsWrites:0,failStats:options.failStats||0,failSaves:options.failSaves||0},node=id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',onclick:null,classList:{add(){},remove(){}},querySelectorAll:()=>[],querySelector:()=>null,setAttribute(){},removeAttribute(){}});
 const w={console,Date:options.Date||Date,Math,JSON,Number,Set,Map,
  S:{view:'boost',lang:'ko',coins:0,character:{number:3},boost:{doneWeeks:{},log:[]},_boost:{threadId:'AD3',level:1,weekKey:'2026-W43',sessionId:'boost:fixture-session',i:completed?5:0,need:5,score:completed?1:0,cur:completed?null:{prompt:{ko:'합성 점검'},tex:'3',answer:3}}},
  document:{getElementById:()=>null,querySelectorAll:()=>[]},
  localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>{if(key.startsWith('nm_thread_stats_v1')){events.statsWrites++;if(events.failStats){events.failStats--;throw Error('fixture statistics quota');}}store.set(key,String(value));}},
  $:node,t:key=>key,L:value=>value?.ko||'',esc:value=>String(value||''),townCleanup:null,mgTimer:null,lessonVersion:0,
  clearInterval(){},clearTimeout(){},setTimeout:fn=>{timers.push(fn);return timers.length;},
  save:()=>{events.saves++;if(events.failSaves){events.failSaves--;return false;}return true;},render:()=>{events.renders++;w.lessonVersion++;},
  coinAdd:n=>{w.S.coins+=n;return n;},maybeAwardWeeklyBonus(){},
  renderMath(){},playSfx(){},logDaily(){},dots:()=>'',labExprHtml:value=>value,applyMinusKey:value=>value==='-'?'':'-',
  navigationLabel:view=>'Return to '+view,unitReturnLabel:()=> 'Return to village',buildNumpad:(pad,callback)=>{w.padCallback=callback;},NM_VOICE:{isSpeaking:()=>false},
  NM_RNG:{hashSeed:()=>1,mulberry32:()=>()=>.5},NM_THREADS:{},NM_TGEN:{}};
 w.window=w;vm.createContext(w);vm.runInContext(stats,w,{filename:'actual-progress-stats.js'});
 vm.runInContext(section('lessonLater','function stopVoice(')+'\n'+section('screenBoost','/* 목록: 이번 주'),w,{filename:'actual-screenBoost.js'});
 if(options.actualWallet){w.NM_CHARACTER_STATE=wallet;vm.runInContext(section('coinAdd','/* ============================================================'),w,{filename:'actual-coinAdd.js'});}
 return {w,nodes,timers,events,store};
}
function setupCheckup(){
 const runtime=setup(false),w=runtime.w;
 w.S.view='checkup';w.S._checkup={run:1,num:3,stage:'q',i:0,
  items:[0,1,2].map(()=>({t:'AD3',lv:1,kind:'calc',pv:false})),
  calcOk:0,calcTotal:3,wpOk:0,wpTotal:0,creOk:0,creTotal:0,log:[],qStart:Date.now(),
  cur:{prompt:{ko:'합성 점검'},tex:'3',answer:3}};
 vm.runInContext(section('screenCheckup','/* 학년 고치기'),w,{filename:'actual-screenCheckup.js'});
 return runtime;
}
const findings=[];
{
 const {w}=setup(true);w.screenBoost();w.S.lang='en';w.screenBoost();
 findings.push({case:'result-language-rerender',sessions:w.NM_STATS.sessionsOf('AD3').length,logEntries:w.S.boost.log.length,falseNeedsBoost:w.NM_STATS.needsBoost('AD3'),score:w.S._boost.score,need:w.S._boost.need});
}
{
 const {w}=setup(false);w.screenBoost();w.padCallback('3');w.padCallback('ok');w.padCallback('ok');
 findings.push({case:'same-answer-double-submit',answered:w.S._boost.i,score:w.S._boost.score});
}
{
 const {w,nodes,timers}=setup(false);w.screenBoost();w.padCallback('3');w.padCallback('ok');nodes['#boostBack'].onclick();
 // A learner leaves the mailbox for another unit before the old feedback delay ends.
 w.S.view='unit';w.S.unit='A-02';w.render();for(const timer of timers.splice(0))timer();
 findings.push({case:'old-feedback-after-navigation',view:w.S.view,unit:w.S.unit});
}
{
 const {w,events}=setup(true,{failStats:1});w.screenBoost();
 const failed={sessions:w.NM_STATS.sessionsOf('AD3').length,statsRecorded:w.S._boost.statsRecorded};
 w.screenBoost();
 findings.push({case:'statistics-save-failure-retry',failed,sessions:w.NM_STATS.sessionsOf('AD3').length,statsRecorded:w.S._boost.statsRecorded,logEntries:w.S.boost.log.length,writes:events.statsWrites});
}
{
 const first=setup(true);first.w.screenBoost();
 // Simulate a tab restart after statistics persisted but the main profile save failed.
 // The restored unfinished result has the same durable identity as at session start.
 const second=setup(true,{store:first.store});second.w.screenBoost();
 const before=second.w.NM_STATS.sessionsOf('AD3').length;
 second.w.NM_STATS.record('AD4',1,1,5,{boost:true,sessionId:'boost:fixture-session'});
 second.w.NM_STATS.record('AD5',1,1,5);second.w.NM_STATS.record('AD5',1,1,5);
 findings.push({case:'statistics-restart-idempotency',sessions:before,threadScoped:second.w.NM_STATS.sessionsOf('AD4').length,legacySessions:second.w.NM_STATS.sessionsOf('AD5').length,statsWrites:second.events.statsWrites});
}
{
 const clock=now=>class extends Date{static now(){return now;}};
 const first=setup(true,{Date:clock(1000)});delete first.w.S._boost.sessionId;first.w.screenBoost();
 // Old saves predate sessionId. Their migration must also survive a failed main
 // save, otherwise each restart gives the same old result a fresh identity.
 const second=setup(true,{Date:clock(2000),store:first.store});delete second.w.S._boost.sessionId;second.w.screenBoost();
 findings.push({case:'legacy-statistics-restart',sessions:second.w.NM_STATS.sessionsOf('AD3').length});
}
{
 const {w}=setup(true,{actualWallet:true,failSaves:1});w.screenBoost();
 const first={coins:w.S.coins,rewarded:!!w.S._boostRewarded};w.screenBoost();
 findings.push({case:'reward-storage-failure-retry',first,coins:w.S.coins,rewarded:!!w.S._boostRewarded});
}
{
 const {w,store}=setup(false),api=w.NM_STATS;
 api.record('AD3',1,0,5);api.record('AD3',1,0,5);
 const legacy=store.get(api._KEY);let scope='local:slot1';api.bind({scope:()=>scope});
 const startsEmpty=api.sessionsOf('AD3').length===0&&!api.needsBoost('AD3');
 api.record('AD3',1,0,5,{sessionId:'shared-id'});scope='local:slot2';api.record('AD3',1,0,5,{sessionId:'shared-id'});
 const siblingB={sessions:api.sessionsOf('AD3').length,needsBoost:api.needsBoost('AD3')};
 scope='local:slot1';const siblingA={sessions:api.sessionsOf('AD3').length,needsBoost:api.needsBoost('AD3')};
 api.record('AD3',1,0,5,{sessionId:'second-a'});
 const ownBoost=api.needsBoost('AD3')&&api.boostList().length===1;
 scope='local:slot2';const siblingStillSeparate=!api.needsBoost('AD3')&&api.boostList().length===0;
 let distinctEmpty=true;for(const next of ['review:docssam1','guardian:owner1:childA','guardian:owner1:childB','guardian:owner2:childA']){
  scope=next;distinctEmpty=distinctEmpty&&api.sessionsOf('AD3').length===0&&api.boostList().length===0;
  api.record('AD3',1,0,5,{sessionId:'shared-id'});
 }
 scope='review:docssam1';const reviewRetained=api.sessionsOf('AD3').length===1;
 scope='guardian:owner1:childA';const guardianRetained=api.sessionsOf('AD3').length===1;
 findings.push({case:'statistics-scope-isolation',startsEmpty,siblingA,siblingB,ownBoost,siblingStillSeparate,distinctEmpty,reviewRetained,guardianRetained,legacyPreserved:store.get(api._KEY)===legacy,scopedKeys:[...store.keys()].filter(k=>k.startsWith(api._KEY+'_scope_')).length});
}
{
 const {w,store}=setup(false),api=w.NM_STATS;let scope='local:slot1';api.bind({scope:()=>scope});api.record('AD3',1,0,5);
 const before=JSON.stringify([...store]);scope=null;
 const denied={record:api.record('AD3',1,0,5),sessions:api.sessionsOf('AD3').length,needsBoost:api.needsBoost('AD3'),boostList:api.boostList().length};
 api.bind({scope:()=>{throw Error('stale fixture owner');}});
 const thrownDenied=api.record('AD3',1,0,5)===false&&api.sessionsOf('AD3').length===0&&!api.needsBoost('AD3')&&api.boostList().length===0;
 api.bind({scope:null});const invalidBindDenied=api.record('AD3',1,0,5)===false;
 findings.push({case:'statistics-blocked-scope',denied,thrownDenied,invalidBindDenied,storageUnchanged:JSON.stringify([...store])===before});
}
{
 const first=setup(false),second=setup(false,{store:first.store}),scope='guardian:owner:child';
 for(const runtime of [first,second])runtime.w.NM_STATS.bind({scope:()=>scope});
 first.w.NM_STATS.record('AD3',1,0,5,{sessionId:'first'});
 second.w.NM_STATS.record('AD3',1,0,5,{sessionId:'second'});
 const latestRead=first.w.NM_STATS.sessionsOf('AD3').length===2&&first.w.NM_STATS.needsBoost('AD3')&&first.w.NM_STATS.boostList().length===1;
 first.events.failStats=1;const failed=first.w.NM_STATS.record('AD3',1,5,5,{sessionId:'third'}),afterFailure=first.w.NM_STATS.sessionsOf('AD3').length;
 const retry=first.w.NM_STATS.record('AD3',1,5,5,{sessionId:'third'});
 const restarted=setup(false,{store:first.store});restarted.w.NM_STATS.bind({scope:()=>scope});
 restarted.w.NM_STATS.record('AD3',1,5,5,{sessionId:'third'});
 findings.push({case:'scoped-statistics-latest-save-and-restart',latestRead,failed,afterFailure,retry,sessions:restarted.w.NM_STATS.sessionsOf('AD3').length,duplicateWrites:restarted.events.statsWrites,legacyKeyUntouched:!first.store.has(first.w.NM_STATS._KEY)});
}
{
 const {w}=setupCheckup();w.screenCheckup();w.padCallback('3');w.padCallback('ok');w.padCallback('ok');
 findings.push({case:'checkup-same-answer-double-submit',answered:w.S._checkup.i,score:w.S._checkup.calcOk,logEntries:w.S._checkup.log.length});
}
{
 const {w,nodes,timers}=setupCheckup();w.screenCheckup();w.padCallback('3');w.padCallback('ok');nodes['#cuBack'].onclick();
 w.S.view='unit';w.S.unit='A-02';w.render();for(const timer of timers.splice(0))timer();
 findings.push({case:'checkup-old-feedback-after-navigation',view:w.S.view,unit:w.S.unit});
}
{
 const {w,store}=setup(false),a=main.indexOf('if(window.NM_STATS?.bind)'),b=main.indexOf("window.addEventListener('nm:study-record-error'",a);assert(a>=0&&b>a,'actual main statistics binding');
 let storageCurrent=true,authOwner=null;Object.assign(w,{stateStorageCurrent:()=>storageCurrent,REVIEW:false,review:{username:'master-fixture'},stateOwnerId:null,NM_PROFILE_AUTH:{peek:()=>authOwner?{user:{id:authOwner}}:null}});
 vm.runInContext(main.slice(a,b),w,{filename:'actual-main-statistics-binding.js'});
 const api=w.NM_STATS;api.record('AD3',1,0,5);w.stateOwnerId='owner1';authOwner='owner1';
 const localSeparate=api.sessionsOf('AD3').length===0;api.record('AD3',1,0,5);
 w.S.cloudLinked=true;w.S.cloudOwnerId='owner1';w.S.name='childA';
 const guardianSeparate=api.sessionsOf('AD3').length===0;api.record('AD3',1,0,5);
 w.S.name='childB';const profileSeparate=api.sessionsOf('AD3').length===0;api.record('AD3',1,0,5);
 w.S.cloudOwnerId='owner2';w.stateOwnerId='owner2';authOwner='owner2';const ownerSeparate=api.sessionsOf('AD3').length===0;api.record('AD3',1,0,5);
 const beforeMismatch=JSON.stringify([...store]);authOwner='wrong-owner';
 const ownerMismatchBlocked=api.record('AD3',1,0,5)===false&&api.sessionsOf('AD3').length===0&&JSON.stringify([...store])===beforeMismatch;
 authOwner='owner2';w.REVIEW=true;const reviewSeparate=api.sessionsOf('AD3').length===0;api.record('AD3',1,0,5);
 const before=JSON.stringify([...store]);storageCurrent=false;
 const staleBlocked=api.record('AD3',1,0,5)===false&&api.sessionsOf('AD3').length===0&&!api.needsBoost('AD3')&&api.boostList().length===0&&JSON.stringify([...store])===before;
 findings.push({case:'actual-main-statistics-scope-binding',localSeparate,guardianSeparate,profileSeparate,ownerSeparate,reviewSeparate,ownerMismatchBlocked,staleBlocked,scopedKeys:store.size});
}
{
 const {w}=setup(true);delete w.S._boost.sessionId;w.S._boostRewarded=true;
 w.S.boost.log.push({weekKey:'2026-W43',thread:'AD3',level:1,score:1,need:5,ts:1234});
 w.screenBoost();w.screenBoost();
 findings.push({case:'completed-legacy-upgrade',logEntries:w.S.boost.log.length,newStats:w.NM_STATS.sessionsOf('AD3').length,completedAt:w.S._boost.completedAt});
}
console.log(JSON.stringify({source:'actual main.js screenBoost + actual progress-stats.js',findings},null,2));
if(!process.argv.includes('--observe')){
 assert.equal(findings[0].sessions,1,'one completed warm-up must create one statistics session');
 assert.equal(findings[0].logEntries,1,'rerender must not append another parent-report log');
 assert.equal(findings[0].falseNeedsBoost,false,'one low result is not two consecutive low sessions');
 assert.equal(findings[1].answered,1,'same visible answer cannot skip the next question');
 assert.equal(findings[1].score,1,'same answer cannot score twice');
 assert.equal(findings[2].view,'unit','an obsolete feedback timer cannot replace a later learning screen');
 assert.equal(findings[3].failed.sessions,0,'failed statistics storage must not leave a phantom in-memory session');
 assert.equal(findings[3].failed.statsRecorded,false,'failed statistics storage remains retryable');
 assert.equal(findings[3].sessions,1,'a successful retry creates exactly one session');
 assert.equal(findings[3].statsRecorded,true);
 assert.equal(findings[3].logEntries,1,'statistics retry cannot append another completion log');
 assert.equal(findings[3].writes,2);
 assert.equal(findings[4].sessions,1,'a restarted result with the same identity cannot append statistics twice');
 assert.equal(findings[4].threadScoped,1,'session identities are scoped to the thread');
 assert.equal(findings[4].legacySessions,2,'legacy calls without an identity still record each session');
 assert.equal(findings[4].statsWrites,3,'a restarted duplicate must not rewrite statistics');
 assert.equal(findings[5].sessions,1,'an old save without sessionId must retain the same identity after a restart');
 assert.equal(findings[6].coins,2,'a failed reward save must remain retryable after storage recovers');
 assert.equal(findings[6].rewarded,true);
 const isolated=findings[7];
 for(const key of ['startsEmpty','ownBoost','siblingStillSeparate','distinctEmpty','reviewRetained','guardianRetained','legacyPreserved'])assert.equal(isolated[key],true,key);
 for(const sibling of [isolated.siblingA,isolated.siblingB]){assert.equal(sibling.sessions,1);assert.equal(sibling.needsBoost,false,'siblings cannot combine one low session each into a false boost');}
 assert.equal(isolated.scopedKeys,6,'two local siblings, review, and three owner/profile identities stay distinct');
 const blocked=findings[8];assert.equal(blocked.denied.record,false);assert.equal(blocked.denied.sessions,0);assert.equal(blocked.denied.needsBoost,false);assert.equal(blocked.denied.boostList,0);
 assert.equal(blocked.thrownDenied,true);assert.equal(blocked.invalidBindDenied,true);assert.equal(blocked.storageUnchanged,true);
 const latest=findings[9];assert.equal(latest.latestRead,true);assert.equal(latest.failed,false);assert.equal(latest.afterFailure,2);assert.equal(latest.retry,true);assert.equal(latest.sessions,3);assert.equal(latest.duplicateWrites,0);assert.equal(latest.legacyKeyUntouched,true);
 assert.equal(findings[10].answered,1,'same checkup answer cannot skip a question');assert.equal(findings[10].score,1);assert.equal(findings[10].logEntries,1);
 assert.equal(findings[11].view,'unit','obsolete checkup feedback cannot replace the next screen');
 for(const key of ['localSeparate','guardianSeparate','profileSeparate','ownerSeparate','reviewSeparate','ownerMismatchBlocked','staleBlocked'])assert.equal(findings[12][key],true,key);
 assert.equal(findings[12].scopedKeys,6);
 assert.equal(findings[13].logEntries,1);assert.equal(findings[13].newStats,0);assert.equal(findings[13].completedAt,1234);
 console.log('OK: fourteen flow/statistics regressions: boost/checkup completion/answer/timer guards, failed storage retry, restart idempotency, actual main scope binding, sibling/guardian/review isolation, blocked scopes, latest scoped reads and legacy preservation.');
}
