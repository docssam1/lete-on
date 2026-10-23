#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),main=fs.readFileSync(path.join(root,'app/main.js'),'utf8');
const W=require('../app/character-state.js'),learnerStorage=require('../app/learner-storage.js');
function section(name,end){
  const a=main.indexOf('function '+name+'('),b=main.indexOf(end,a);
  assert(a>=0&&b>a,'real function boundaries: '+name);return main.slice(a,b);
}
function line(name){const s=main.match(new RegExp('^function '+name+'\\([^\\n]+','m'));assert(s,name);return s[0];}
const data={console};data.window=data;vm.createContext(data);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
for(const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
  const file=m[1].split(/[?#]/)[0];if(!/^(engine|data)\//.test(file))continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),data,{filename:file});
  if(file==='data/symbol-dex.js')break;
}
for(const file of ['data/numi-avatar.js','data/cosmetics-catalog.js'])
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),data,{filename:file});
let clock='2026-10-24T03:00:00.000Z',saves=0;
class FixedDate extends Date{constructor(...args){super(...(args.length?args:[clock]));}static now(){return Date.parse(clock);}}
const controls={},coinNode={textContent:''},timers=[],storage=new Map(),requests=[],toasts=[],overlays=[];
const node=id=>controls[id]||(controls[id]={innerHTML:'',textContent:'',onclick:null,
  querySelectorAll:()=>[],querySelector:selector=>node(selector),appendChild(child){this.child=child;},
  classList:{add(){}},remove(){},setAttribute(){}});
const w={console,Date:FixedDate,Math,JSON,Promise,Number,Map,Set,
  S:{},NM_CHARACTER_STATE:{...W,reward:(s,n,reason,key)=>W.reward(s,n,reason,key,clock)},
  NM_COURSES:data.NM_COURSES,NM_AVATAR:data.NM_AVATAR,UNITS:data.NM_UNITS,NM_ATTENDANCE:require('../app/attendance.js'),
  document:{querySelectorAll:selector=>selector==='.nm-coins b'?[coinNode]:[],createElement:()=>node('created')},
  $:node,save:()=>{saves++;return true;},render(){},clearInterval(){},townCleanup:null,mgTimer:null,
  clearTimeout(){},setTimeout:callback=>{timers.push(callback);return timers.length;},
  t:key=>key,L:value=>typeof value==='string'?value:value?.ko||'',esc:value=>String(value||''),
  boosterPick:()=>null,boosterDoneThisWeek:key=>!!w.S.boost?.doneWeeks?.[key],
  toast:text=>toasts.push(text),checkupKeyFor:n=>'C'+n,
  hostStripHtml:()=>'',unitFlowOf:()=>[{key:'practice'},{key:'arena'},{key:'stamp'}],
  gotoStep:step=>{w.redirected=step;},lineageEvoCardHtml:()=>'',checkLineageCompletion:()=>null,
  playSfx:()=>null,confetti(){},sayAfterSfx(){},bindLineageEvoCard(){},exitUnit(){},lessonLater(){},
  screenHistQuiz(){},showUnlockOverlay:items=>overlays.push(items),
  hqPuzzle:{picked:[0,1,2,3]},NM_STATS:{record(){}},
  KEY:learnerStorage.keyFor('guardian-fixture'),REVIEW:false,membership:null,booted:false,applyAdminSettings(){},
  defaults:()=>({coins:0,progress:{}}),hadSave:false,stateOwnerId:'guardian-fixture',learnerTransition:false,NM_LEARNER_STORAGE:learnerStorage,NM_PROFILE_AUTH:{peek:()=>({user:{id:'guardian-fixture'}})},
  localStorage:{getItem:key=>storage.has(key)?storage.get(key):null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)},
  SLOT_COUNT:3,SLOT_ACTIVE_KEY:learnerStorage.keyFor('guardian-fixture')+'_active_slot',location:{reload(){}},
  cloudTimer:null,cloudSyncError:false,SB_URL:'https://fixture.invalid',
  cloudCredentials:async()=>({owner:'guardian-fixture',headers:{Authorization:'Bearer fixture'}}),
  isGuardianOwner:owner=>owner==='guardian-fixture',renderIdCard(){},
  fetch:async(url,options)=>{assert(url.startsWith('https://fixture.invalid/'));requests.push({url,...options});return {ok:true,json:async()=>[{}]};}};
w.window=w;vm.createContext(w);
const functions=[section('navigationLabel','function enterUnit('),section('coinAdd','/* ============================================================'),
  section('todayKey','/* 출석 체크'),section('checkAttendance','/* 주간 보너스'),
  section('weekFullyDone','function maybeAwardWeeklyBonus('),section('maybeAwardWeeklyBonus','function pickVoice('),
  section('settleMiniGameReward','function _renderMiniGame('),section('_renderMiniGame','function screenGradeCourse('),
  section('finishCheckup','/* 문장제 한 문항'),section('screenBoost','/* 목록: 이번 주'),
  section('bindHistQuizPuzzle','function bindHistQuizSuccess('),section('stepStamp','/* ---------- 공통 UI'),
  section('courseMagicIds','/* 콘텐츠가 실제로'),section('courseProgress','/* 주차'),
  section('courseConquered','function conquestCount('),section('syncProgressUnlocks','/* 새 친구 도착'),
  line('unitDone'),line('stepDone')];
vm.runInContext(functions.join('\n'),w,{filename:'actual-main-reward-functions.js'});
const fresh=()=>({lang:'ko',coins:0,progress:{},character:{number:3},boost:{doneWeeks:{},log:[]},histQuiz:{done:{}},account:{status:'active'}});
let cases=0;
w.S=fresh();assert.equal(w.coinAdd(78,'unit','delta'),15);assert.equal(w.S.coins,15);assert.equal(coinNode.textContent,15);
assert.equal(w.coinAdd(78,'unit','delta'),0);assert.equal(w.S.coins,15);cases+=2;
w.S=fresh();assert.equal(w.checkAttendance(),1);assert.equal(w.S.coins,1);assert.equal(w.S.attend.reward,1);
assert.equal(w.checkAttendance(),null);assert.equal(w.S.coins,1);cases+=2;
clock='2026-10-24T14:59:59.000Z';w.S=fresh();assert.equal(w.checkAttendance(),1);
assert.equal(w.S.attend.last,'2026-10-24');clock='2026-10-24T15:00:00.000Z';
assert.equal(w.checkAttendance(),2);assert.equal(w.S.attend.last,'2026-10-25');assert.equal(w.S.coins,2);
clock='2026-10-24T03:00:00.000Z';cases++;
w.S=fresh();w.S.mailbox={opened:{'2026-W43':true}};w.maybeAwardWeeklyBonus('2026-W43');
assert.equal(w.S.coins,3);w.S.weeklyBonus={};w.maybeAwardWeeklyBonus('2026-W43');assert.equal(w.S.coins,3,'stable week claim survives flag reset');cases+=2;
w.S=fresh();const first={id:'make10',startTs:1,done:true,pairs:4,tiles:[]};w.S.miniGame=first;
w._renderMiniGame();assert.equal(first.rewardCoins,1);assert.equal(w.S.coins,1);assert(node('#screen').innerHTML.includes('🪙 +1'));
node('#mgContinue').onclick();assert.equal(w.S.coins,1,'continue does not award again');
w.settleMiniGameReward({...first,rewardCoins:undefined},4);assert.equal(w.S.coins,1,'same finished instance reopened');
w.settleMiniGameReward({id:'make10_3',startTs:2,done:true},4);assert.equal(w.S.coins,2);
const third={id:'make10',startTs:3,done:true};w.settleMiniGameReward(third,4);assert.equal(third.rewardCoins,0);assert.equal(w.S.coins,2);
w.settleMiniGameReward({id:'make10',startTs:4,done:false},4);assert.equal(w.S.coins,2);cases+=6;
w.S=fresh();w.S._boost={threadId:'AD3',level:1,weekKey:'2026-W43',i:5,need:5,score:4};w.screenBoost();
assert.equal(w.S.coins,2);assert.equal(w.S._boost.rewardCoins,2);assert(node('#screen').innerHTML.includes('🪙 +2'));
w.S._boostRewarded=false;w.S._boost={...w.S._boost,rewardCoins:undefined};w.screenBoost();assert.equal(w.S.coins,2,'week claim prevents restarted booster reward');cases+=2;
w.S=fresh();const check={num:3,calcOk:12,calcTotal:12,creOk:3,creTotal:3,wpOk:6,wpTotal:6};w.finishCheckup(check);
assert.equal(w.S.coins,4,'raw twenty-one correct answers are divided by five once');assert.equal(check.rewardCoins,4);
w.finishCheckup({...check,rewarded:false});assert.equal(w.S.coins,4,'same checkpoint repeated');cases+=2;
w.S=fresh();const training=node('training');w.hqPuzzle={picked:[0,1,2,3]};w.bindHistQuizPuzzle(training,'A-01',{});
node('#hqCheck').onclick();assert.equal(w.S.coins,1);assert.equal(toasts.at(-1),'🪙 +1');
node('#hqCheck').onclick();assert.equal(w.S.coins,1,'same story repeated');cases+=2;
const unit=Object.values(w.UNITS).find(u=>u.stamp?.coins===78);assert(unit);
w.S=fresh();w.S.unit=unit.id;w.S.progress[unit.id]={steps:{practice:true,arena:true}};
const body=node('stamp');w.stepStamp(body,unit);assert.equal(w.S.coins,15);assert(body.innerHTML.includes('🪙 +15'));
w.stepStamp(body,unit);assert.equal(w.S.coins,15);assert(body.innerHTML.includes('🪙 +0'),'stamp revisit shows no fictitious repeated grant');cases+=2;
w.S=fresh();w.S.unit=unit.id;w.S.progress[unit.id]={steps:{practice:true,arena:true}};
for(let i=0;i<6;i++)w.coinAdd(3,'learning','pre-cap-'+i);
w.stepStamp(body,unit);assert.equal(w.S.coins,20);assert(body.innerHTML.includes('🪙 +2'),'UI displays clipped actual grant');cases++;
w.S=fresh();w.S.unit=unit.id;w.S.progress[unit.id]={steps:{practice:true}};w.stepStamp(body,unit);
assert.equal(w.redirected,'arena');assert.equal(w.S.coins,0,'unfinished learning cannot claim stamp');cases++;
w.S=fresh();w.S.placement={course:'C73',self:true};w.S.character_unlocked={existing_collected:true};
w.syncProgressUnlocks();assert.deepEqual(Object.keys(w.S.character_unlocked),['existing_collected'],'choosing advanced course gives no gifts');
assert.equal(W.gifts.length,4);assert.deepEqual(W.gifts.map(g=>g.course),[7,16,24,37]);
for(const gift of W.gifts){
  const course=w.NM_COURSES['C'+gift.course],ids=w.courseUnitIds(course);assert(ids.length>0,'gift milestone can actually be completed');
  for(const id of ids)w.S.progress[id]={steps:{practice:true}};
  const key=gift.type+'_'+gift.id;w.syncProgressUnlocks();assert.equal(w.S.character_unlocked[key],undefined,'course visitation is insufficient');
  for(const id of ids)w.S.progress[id]={done:true,steps:{stamp:true}};
  const progress=JSON.stringify(w.S.progress),coins=w.S.coins;w.syncProgressUnlocks();
  assert.equal(w.S.character_unlocked[key],true);assert.equal(JSON.stringify(w.S.progress),progress);assert.equal(w.S.coins,coins);cases++;
}
assert.equal(Object.keys(w.S.character_unlocked).length,5,'four gifts plus the old right');
const gifts=JSON.stringify(w.S.character_unlocked);w.syncProgressUnlocks();assert.equal(JSON.stringify(w.S.character_unlocked),gifts,'gift sync is idempotent');
assert.equal(w.courseUnitIds(w.NM_COURSES.C25).length,0,'old impossible gift point is not used');cases+=2;
// A failed grant must remain retryable at each real completion caller.
const successfulSave=w.save;let failRewardSave=true;
w.save=()=>{saves++;return !failRewardSave;};
w.S=fresh();w.S.mailbox={opened:{'2026-W43':true}};w.maybeAwardWeeklyBonus('2026-W43');
assert.equal(w.S.coins,0);assert.equal(w.S.weeklyBonus['2026-W43'],undefined);
failRewardSave=false;w.maybeAwardWeeklyBonus('2026-W43');assert.equal(w.S.coins,3);assert.equal(w.S.weeklyBonus['2026-W43'],true);cases++;
failRewardSave=true;w.S=fresh();const retryCheck={num:3,calcOk:12,calcTotal:12,creOk:3,creTotal:3,wpOk:6,wpTotal:6};w.finishCheckup(retryCheck);
assert.equal(w.S.coins,0);assert.equal(retryCheck.rewarded,false);assert.equal(w.S.checkups.C3,undefined);
failRewardSave=false;w.finishCheckup(retryCheck);assert.equal(w.S.coins,4);assert.equal(retryCheck.rewarded,true);assert.equal(retryCheck.rewardSavePending,undefined);cases++;
failRewardSave=true;w.S=fresh();w.S.unit=unit.id;w.S.progress[unit.id]={steps:{practice:true,arena:true}};w.stepStamp(body,unit);
assert.equal(w.S.coins,0);assert.equal(w.S.progress[unit.id].done,undefined);assert(body.innerHTML.includes('stampRetry'));
failRewardSave=false;node('#stampRetry').onclick();assert.equal(w.S.coins,15);assert.equal(w.S.progress[unit.id].done,true);cases++;
failRewardSave=true;w.S=fresh();const retryGame={id:'make10',startTs:99,done:true};w.settleMiniGameReward(retryGame,4);
assert.equal(w.S.coins,0);assert.equal(retryGame.rewardCoins,undefined);
failRewardSave=false;w.settleMiniGameReward(retryGame,4);assert.equal(w.S.coins,1);assert.equal(retryGame.rewardCoins,1);cases++;
failRewardSave=true;w.S=fresh();w.hqPuzzle={picked:[0,1,2,3]};w.bindHistQuizPuzzle(training,'A-01',{});node('#hqCheck').onclick();
assert.equal(w.S.coins,0);assert.equal(w.S.histQuiz.done['A-01'],undefined);
failRewardSave=false;node('#hqCheck').onclick();assert.equal(w.S.coins,1);assert.equal(w.S.histQuiz.done['A-01'],true);cases++;
failRewardSave=true;w.S=fresh();w.S._boost={threadId:'AD3',level:1,weekKey:'2026-W43',i:5,need:5,score:4};w.screenBoost();
assert.equal(w.S.coins,0);assert.equal(w.S._boostRewarded,false);
failRewardSave=false;w.screenBoost();assert.equal(w.S.coins,2);assert.equal(w.S._boostRewarded,true);assert.equal(w.S.boost.log.length,1);cases++;
w.save=successfulSave;
// Exercise the real serialization functions with in-memory storage and a fake
// endpoint. This confirms the new budget is not stripped by a field allowlist.
const storageBaseline=main.match(/^let stateStorageRaw=[^\n]+/m);assert(storageBaseline,'actual tab baseline declarations');
const cloudQueue=main.match(/^let cloudTimer=[^\n]+/m);assert(cloudQueue,'actual cloud queue declarations');
vm.runInContext(storageBaseline[0]+'\n'+section('load','let S=load();')+'\n'+
  section('stateStorageConflict','function save(')+'\n'+line('save')+'\n'+
  section('backupBeforeCloudResume','async function cloudClaim(')+'\n'+
  cloudQueue[0]+'\n'+section('cloudPushSoon','/* 주간 요약')+'\n'+
  section('readSlotState','/* 슬롯 전환')+'\n'+section('switchToSlot','/* ---------- 체험 게이트')+'\n'+
  line('slotKey')+'\n'+section('activeSlot','/* 비활성 슬롯'),w);
async function persistence(){
  w.S=fresh();w.S.name='Fixture';w.S.cloudLinked=true;w.S.cloudOwnerId='guardian-fixture';
  storage.set(w.KEY,JSON.stringify(w.S));w.S=w.load();
  w.coinAdd(20,'unit','persisted-unit');const budget=JSON.stringify(w.S.coinRewards);
  assert.equal(w.save(),true);const loaded=w.load();assert.equal(JSON.stringify(loaded.coinRewards),budget);
  w.S=loaded;assert.equal(w.coinAdd(20,'unit','persisted-unit'),0,'reload retains duplicate guard');cases+=2;
  const send=timers.at(-1);assert.equal(typeof send,'function');await send();
  assert.equal(JSON.stringify(JSON.parse(requests.at(-1).body).state.coinRewards),budget,'guardian cloud patch carries the complete budget');cases++;
  assert.equal(w.backupBeforeCloudResume('guardian-fixture'),true);
  assert.equal(JSON.stringify(JSON.parse(storage.get(w.KEY+'_preresume')).coinRewards),budget,'pre-resume backup retains budget');cases++;
  storage.set('nm_state_slot2',JSON.stringify({coins:5,coinRewards:{version:W.policy.version,days:{},claims:{other:'2026-10-01'}}}));
  w.switchToSlot(2);assert.equal(JSON.stringify(w.readSlotState(1).coinRewards),budget,'slot backup retains the first student budget');
  assert.equal(w.load().coinRewards.claims.other,'2026-10-01','target student keeps own budget');cases++;
  console.log('REWARD_INTEGRATION_OK cases='+cases+' realMainFunctions=true actualAwardUI=true gifts=4 realGiftUnits=18 saveLoadCloudBackup=true externalWrites=0');
}
persistence().catch(error=>{console.error(error);process.exitCode=1;});
