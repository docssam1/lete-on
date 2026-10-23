#!/usr/bin/env node
'use strict';
// Targeted failure/concurrency review: real main functions, fake learner data,
// in-memory storage only. A failed assertion reports an actual preservation gap.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const main=fs.readFileSync(path.join(__dirname,'../app/main.js'),'utf8');
const wallet=require('../app/character-state.js'),attendance=require('../app/attendance.js'),learnerStorage=require('../app/learner-storage.js');
const reports=[];
function section(name,end){
  const a=main.indexOf('function '+name+'('),b=main.indexOf(end,a);
  assert(a>=0&&b>a,'actual function boundaries: '+name);return main.slice(a,b);
}
function line(name){const found=main.match(new RegExp('^function '+name+'\\([^\\n]+','m'));assert(found,name);return found[0];}
const purchaseStart=main.indexOf('      onPurchase(type,id){'),purchaseEnd=main.indexOf('\n      onSaveHuman(',purchaseStart);
assert(purchaseStart>=0&&purchaseEnd>purchaseStart,'actual closet purchase callback');
const purchase=main.slice(purchaseStart,purchaseEnd).trim().replace(/^onPurchase/,'function onPurchase').replace(/,$/,'');
const baseline=main.match(/^let stateStorageRaw=[^\n]+/m);assert(baseline,'actual tab baseline declarations');
const sources=[baseline[0],section('load','let S=load();'),section('stateStorageConflict','function save('),line('save'),section('coinAdd','/* ============================================================'),
  line('slotKey'),section('activeSlot','/* 비활성 슬롯'),section('switchToSlot','/* ---------- 체험 게이트'),
  section('checkAttendance','/* 주간 보너스'),section('clearSymbolAcquisition','/* §13 도감 초안'),purchase].join('\n');
const fixture=name=>({lang:'ko',name,onboarded:true,coins:100,progress:{},character:{number:3},character_unlocked:{},symbolDex:{},attend:{last:'2026-10-23',days:1,dates:['2026-10-23']}});
function runtime(state,shared=new Map(),fail=()=>false){
  const nodes=[],controls={},node=id=>controls[id]||(controls[id]={onclick:null,isConnected:false,removed:false,remove(){this.isConnected=false;this.removed=true;},classList:{toggle(){}}});
  const w={S:state,KEY:'nm_preview_state_v1',REVIEW:false,review:{username:'fixture'},SLOT_COUNT:3,SLOT_ACTIVE_KEY:'nm_preview_state_v1_active_slot',hadSave:false,stateOwnerId:null,learnerTransition:false,NM_LEARNER_STORAGE:learnerStorage,NM_PROFILE_AUTH:{peek:()=>null},
    booted:false,membership:null,attendanceSaveFailed:false,NM_CHARACTER_STATE:wallet,NM_ATTENDANCE:attendance,
    NM_AVATAR:{hats:[{id:'fixture_hat',price:30}]},NM_HUMANS:{},
    applyAdminSettings(){},cloudPushSoon(){},normalizeLoadedState(){},defaults:()=>fixture(''),
    document:{querySelectorAll:selector=>selector==='#nmSymModal'&&controls['#nmSymModal']?.isConnected?[controls['#nmSymModal']]:nodes,
      body:{insertAdjacentHTML(){const modal=node('#nmSymModal');modal.isConnected=true;modal.removed=false;}}},$:node,controls,
    symbolCardModalHtml:()=>'<div id="fixture"></div>',symbolAcquisitionCleanup:null,
    location:{reload(){w.reloads++;}},reloads:0,toast(){},
    localStorage:{getItem:key=>shared.has(key)?shared.get(key):null,
      setItem(key,value){if(fail(key,value))throw Error('fixture_storage_full');shared.set(key,String(value));},
      removeItem(key){if(fail(key))throw Error('fixture_storage_full');shared.delete(key);}},
    Date,JSON,Math,Number,Object,console};
  if(!shared.has('nm_preview_state_v1'))shared.set('nm_preview_state_v1',JSON.stringify(state));
  w.window=w;vm.createContext(w);vm.runInContext(sources,w,{filename:'actual-state-review-functions.js'});w.S=w.load();
  return{w,shared};
}
function record(name,ok,details){reports.push({name,passed:ok,...details});}

// A failed write must neither advertise a grant nor keep an unpersisted claim.
{
  const original=fixture('Storage fixture'),stored=JSON.stringify(original),shared=new Map([['nm_preview_state_v1',stored]]);
  let failState=true;const{w}=runtime(JSON.parse(stored),shared,key=>failState&&key==='nm_preview_state_v1');
  const granted=w.coinAdd(78,'unit','unit:fixture');
  record('reward-write-failure',granted===0&&JSON.stringify(w.S)===stored,{
    granted,inMemoryCoins:w.S.coins,storedCoins:JSON.parse(shared.get('nm_preview_state_v1')).coins,
    claimKept:!!w.S.coinRewards?.claims?.['unit|unit:fixture']});
  failState=false;const retried=w.coinAdd(78,'unit','unit:fixture');
  record('reward-write-retry',retried===15&&JSON.parse(shared.get('nm_preview_state_v1')).coins===115,{
    granted:retried,storedCoins:JSON.parse(shared.get('nm_preview_state_v1')).coins});
}

// A newer tab can have exactly the same wallet but additional learning progress.
// The purchase callback must not overwrite that newer non-wallet state.
{
  const stale=fixture('Purchase fixture'),newer=fixture('Purchase fixture');newer.progress['N-01']={done:true,steps:{stamp:true}};
  const shared=new Map([['nm_preview_state_v1',JSON.stringify(stale)]]),{w}=runtime(stale,shared);
  shared.set('nm_preview_state_v1',JSON.stringify(newer));
  const result=w.onPurchase('hat','fixture_hat'),disk=JSON.parse(shared.get('nm_preview_state_v1'));
  record('purchase-with-newer-progress',!!disk.progress['N-01']?.done,{
    purchaseSucceeded:result.ok,spent:result.spent||0,newerUnitRetained:!!disk.progress['N-01']?.done,
    inMemoryUnitRetained:!!w.S.progress['N-01']?.done,reloads:w.reloads});
  w.S.view='town';const saved=w.save();
  record('save-after-purchase-conflict',!!JSON.parse(shared.get('nm_preview_state_v1')).progress['N-01']?.done,{
    saved,newerUnitRetained:!!JSON.parse(shared.get('nm_preview_state_v1')).progress['N-01']?.done});
}

// If the final active-slot marker write fails, the switch must be atomic.
{
  const first=fixture('Sibling A'),second=fixture('Sibling B'),a=JSON.stringify(first),b=JSON.stringify(second);
  // Older installs legitimately have no marker (the default slot is 1).
  // Creating its first marker can hit quota after the preceding writes fit.
  const shared=new Map([['nm_preview_state_v1',a],['nm_state_slot2',b]]),before=JSON.stringify([...shared]);
  let failMarker=true;const{w}=runtime(first,shared,key=>failMarker&&key==='nm_preview_state_v1_active_slot');w.switchToSlot(2);
  const consistent=shared.get('nm_preview_state_v1')===a&&w.activeSlot()===1;
  record('slot-marker-write-failure',consistent&&w.reloads===0,{
    activeSlot:w.activeSlot(),rawSlotMarker:shared.get('nm_preview_state_v1_active_slot')||null,activeLearner:JSON.parse(shared.get('nm_preview_state_v1')).name,
    originalSlotBackup:JSON.parse(shared.get('nm_state_slot1')||'null')?.name,reloads:w.reloads,
    storageUnchanged:JSON.stringify([...shared])===before});
  failMarker=false;w.switchToSlot(2);const restarted=runtime(fixture('Unused defaults'),shared).w;
  record('slot-failure-retry-and-restart',restarted.S.name===second.name&&JSON.parse(shared.get('nm_state_slot1')).name===first.name,{
    restartedName:restarted.S.name,firstSiblingBackup:JSON.parse(shared.get('nm_state_slot1')).name});
}

// A tab belonging to a previous sibling must not save over the newly active one.
{
  const a=fixture('Sibling A'),b=fixture('Sibling B'),shared=new Map([['nm_preview_state_v1',JSON.stringify(a)],['nm_preview_state_v1_active_slot','1'],['nm_state_slot2',JSON.stringify(b)]]);
  const oldTab=runtime(a,shared).w,newTab=runtime(JSON.parse(JSON.stringify(a)),shared).w;
  newTab.switchToSlot(2);oldTab.S.progress['N-09']={done:true};const saved=oldTab.save();
  const disk=JSON.parse(shared.get('nm_preview_state_v1'));
  record('stale-sibling-tab-save',disk.name==='Sibling B',{
    staleSaveAccepted:saved,activeSlot:shared.get('nm_preview_state_v1_active_slot'),activeLearner:disk.name,
    expectedLearner:'Sibling B',staleTabUnitWritten:!!disk.progress['N-09']?.done});
}

// Positive controls: a healthy tab can make sequential saves and a restarted
// runtime reads the complete persisted state, not its setup defaults.
{
  const original=fixture('Sequential fixture'),{w,shared}=runtime(original);
  w.S.coins=99;const first=w.save();w.S.coins=98;w.S.progress['N-02']={done:true};const second=w.save();
  const restarted=runtime(fixture('Unused defaults'),shared).w;
  record('normal-save-and-restart',first===true&&second===true&&restarted.S.name===original.name&&restarted.S.coins===98&&!!restarted.S.progress['N-02']?.done,{
    first,second,restartedName:restarted.S.name,restartedCoins:restarted.S.coins,progressRetained:!!restarted.S.progress['N-02']?.done});
}
{
  const a=fixture('Healthy sibling A'),b=fixture('Healthy sibling B');
  const shared=new Map([['nm_preview_state_v1',JSON.stringify(a)],['nm_preview_state_v1_active_slot','1'],['nm_state_slot2',JSON.stringify(b)]]),first=runtime(a,shared).w;
  first.switchToSlot(2);const second=runtime(fixture('Unused defaults'),shared).w;
  second.S.progress['N-03']={done:true};const saved=second.save();second.switchToSlot(1);
  const returned=runtime(fixture('Unused defaults'),shared).w;
  record('normal-sibling-switch-and-restart',first.reloads===1&&second.reloads===1&&saved===true&&returned.S.name===a.name&&!returned.S.progress['N-03']&&!!JSON.parse(shared.get('nm_state_slot2')).progress['N-03']?.done,{
    firstReloads:first.reloads,secondReloads:second.reloads,saved,returnedName:returned.S.name,siblingProgressIsolated:!returned.S.progress['N-03']});
}

// Attendance's own transaction already rolls back a failed local write.
{
  const original=fixture('Attendance fixture'),stored=JSON.stringify(original),shared=new Map([['nm_preview_state_v1',stored]]);
  const{w}=runtime(JSON.parse(stored),shared,key=>key==='nm_preview_state_v1');const result=w.checkAttendance();
  record('attendance-write-failure',result===null&&JSON.stringify(w.S)===stored,{
    result,inMemoryCoins:w.S.coins,storedCoins:JSON.parse(shared.get('nm_preview_state_v1')).coins,errorFlag:w.attendanceSaveFailed});
}

// The normal card collector retains the modal and rolls the collection back.
// Its dependency-failure fallback must provide the same persistence guarantee.
for(const modern of [true,false]){
  const original=fixture('Symbol fixture'),stored=JSON.stringify(original),shared=new Map([['nm_preview_state_v1',stored]]);
  const{w}=runtime(JSON.parse(stored),shared,key=>key==='nm_preview_state_v1');
  if(modern)w.NM_SYMBOL_CARDS={bindAcquisition(_node,options){w.collect=options.onCollect;return()=>{};}};
  w.showSymbolCardModal([{sym:'+'}],0,{id:'N-fixture'});
  const result=modern?w.collect():w.controls['#nmSymClose'].onclick();
  record(modern?'symbol-card-write-failure':'symbol-fallback-write-failure',JSON.stringify(w.S)===stored,{
    result:result===undefined?'undefined':result,unpersistedSymbolKept:!!w.S.symbolDex['+'],modalRemoved:w.controls['#nmSymModal']?.removed||false});
}
const cloudGlobals=main.match(/^let cloudTimer=[^\n]+/m);assert(cloudGlobals,'actual cloud queue declarations');
const cloudSource=cloudGlobals[0]+'\n'+section('cloudPushSoon','/* 주간 요약');
function deferred(){let resolve;return{promise:new Promise(r=>resolve=r),resolve:value=>resolve(value)};}
async function until(test){for(let i=0;i<50&&!test();i++)await Promise.resolve();assert(test(),'fixture async checkpoint');}
function cloudRuntime(options={}){
  const timers=new Map(),sent=[],notices=[];let nextTimer=0,remote=null;
  const w={S:{...fixture('Cloud fixture'),cloudLinked:true,cloudOwnerId:'owner-A'},REVIEW:false,SB_URL:'https://fixture.invalid',currentOwner:'owner-A',
    Date,JSON,console,stateStorageCurrent:()=>true,
    setTimeout(callback){const id=++nextTimer;timers.set(id,callback);return id;},clearTimeout:id=>timers.delete(id),
    cloudCredentials:()=>options.credentials?options.credentials(w):Promise.resolve({owner:w.currentOwner,headers:{}}),
    isGuardianOwner:owner=>owner===w.currentOwner,
    renderIdCard(){notices.push({owner:w.S.cloudOwnerId,name:w.S.name,error:vm.runInContext('cloudSyncError',w)});},
    fetch:async(url,request)=>{
      assert(url.startsWith('https://fixture.invalid/'));assert.equal(request.method,'PATCH');
      const payload=JSON.parse(request.body),index=sent.length;sent.push({url,payload});
      if(options.fetch){const result=await options.fetch(index,payload,w);if(result)return result;}
      remote=payload.state;return{ok:true,json:async()=>[{name:payload.state.name}]};
    }};
  vm.createContext(w);vm.runInContext(cloudSource,w,{filename:'actual-cloud-queue.js'});
  return{w,sent,notices,remote:()=>remote,queue:()=>vm.runInContext('({sending:cloudSending,pending:cloudPending,error:cloudSyncError})',w),
    fire(){assert(timers.size,'fixture timer exists');const[id,callback]=timers.entries().next().value;timers.delete(id);return callback();}};
}
async function cloudRegressions(){
  // The previously failing sequence: the old request is delayed while two
  // newer saves arrive. There may be only one in flight and one newest waiter.
  {
    const old=deferred();let active=0,maxActive=0;
    const run=cloudRuntime({fetch:async index=>{active++;maxActive=Math.max(maxActive,active);if(index===0)await old.promise;active--;}});
    run.w.S.progress['N-01']={done:true};run.w.cloudPushSoon();const flushing=run.fire();await until(()=>run.sent.length===1);
    run.w.S.progress['N-02']={done:true};run.w.cloudPushSoon();run.w.S.progress['N-03']={done:true};run.w.cloudPushSoon();await run.fire();
    assert.equal(run.sent.length,1,'newer PATCH cannot overtake an in-flight request');assert(run.queue().pending.state.progress['N-03']);
    old.resolve();await flushing;
    record('cloud-patch-order-and-latest-waiter',run.sent.length===2&&maxActive===1&&!!run.remote().progress['N-03']?.done,{
      requests:run.sent.length,maxInFlight:maxActive,remoteUnits:Object.keys(run.remote().progress),pending:!!run.queue().pending});
  }
  // Authentication reads also belong to the lock; a slow first read cannot
  // let the next snapshot write before the old read has finished.
  {
    const auth=deferred();let reads=0;
    const run=cloudRuntime({credentials:async w=>{reads++;return reads===1?auth.promise:{owner:w.currentOwner,headers:{}};}});
    run.w.S.progress['N-01']={done:true};run.w.cloudPushSoon();const flushing=run.fire();await until(()=>reads===1);
    run.w.S.progress['N-02']={done:true};run.w.cloudPushSoon();await run.fire();
    assert.equal(reads,1);assert.equal(run.sent.length,0);auth.resolve({owner:'owner-A',headers:{}});await flushing;
    record('cloud-auth-read-is-serialized',reads===2&&run.sent.length===2&&!!run.remote().progress['N-02']?.done,{credentialReads:reads,requests:run.sent.length});
  }
  // A failed old request must not set the next owner's/profile's error flag.
  for(const changeOwner of [true,false]){
    const old=deferred(),run=cloudRuntime({fetch:async index=>{if(index===0){await old.promise;return{ok:false,json:async()=>[]};}}});
    run.w.cloudPushSoon();const flushing=run.fire();await until(()=>run.sent.length===1);
    run.w.currentOwner=changeOwner?'owner-B':'owner-A';
    run.w.S={...fixture('Second cloud fixture'),cloudLinked:true,cloudOwnerId:run.w.currentOwner};run.w.S.progress['N-02']={done:true};
    run.w.cloudPushSoon();await run.fire();old.resolve();await flushing;
    record(changeOwner?'cloud-late-owner-response':'cloud-late-profile-response',run.notices.length===0&&!run.queue().error&&run.remote().name==='Second cloud fixture'&&run.remote().cloudOwnerId===run.w.currentOwner,{
      requests:run.sent.length,lateErrorNotices:run.notices.length,currentOwner:run.w.currentOwner,remoteName:run.remote().name,error:run.queue().error});
  }
}
cloudRegressions().then(()=>{
  console.log('STATE_REVIEW_REGRESSION '+JSON.stringify({realMainFunctions:true,externalWrites:0,reports}));
  assert(reports.every(report=>report.passed),'Confirmed preservation failures: '+reports.filter(report=>!report.passed).map(report=>report.name).join(', '));
}).catch(error=>{console.error(error);process.exitCode=1;});
