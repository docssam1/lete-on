#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const W=require('../app/character-state.js'),H=require('../data/human-avatars.js');
const world={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data/numi-avatar.js'),'utf8'),world);
const av=world.window.NM_AVATAR,at='2026-10-24T03:00:00.000Z',next='2026-10-25T03:00:00.000Z';
let cases=0;
for(const [n,reason,expected]of [[3,'attendance',1],[10,'weekly',3],[20,'game',1],[2,'training',1],
  [6,'boost',2],[63,'history',1],[20,'unit',4],[78,'unit',15],[4,'unit',1],
  [3,'checkup',1],[63,'checkup',12],[999,'unexpected',3],[2,undefined,2],[999,'purchase',3]]){
  assert.equal(W.quoteReward(n,reason),expected);
  const s={coins:50};assert.equal(W.reward(s,n,reason,'quote-'+cases,at),true);
  assert.equal(s.coins,50+expected);assert.equal(s.coinLedger.at(-1).amount,expected);cases++;
}
for(const n of [-1,0,NaN,Infinity,Number.MAX_SAFE_INTEGER+1,1.5,'20',null,undefined]){
  const s={coins:42,coinLedger:[{amount:5,reason:'old'}]},before=JSON.stringify(s);
  assert.equal(W.quoteReward(n,'unit'),0);assert.equal(W.reward(s,n,'unit','invalid',at),false);
  assert.equal(JSON.stringify(s),before,'invalid input is read-only');cases++;
}
for(const now of ['not-a-date',new Date(NaN),Infinity,{},'+275760-09-13T00:00:00.000Z']){
  const s={coins:42},before=JSON.stringify(s);
  assert.equal(W.reward(s,20,'unit','bad-time',now),false);
  assert.equal(JSON.stringify(s),before);cases++;
}
for(const key of ['', ' ',1,{},'x'.repeat(161)]){
  const s={coins:42};assert.equal(W.reward(s,20,'unit',key,at),false);assert.equal(s.coins,42);cases++;
}
const old={coins:12345,coinLedger:[{amount:100,reason:'unit',at:'2026-10-01',balance:12345,label:'old'}],
  character_unlocked:{number_42:true,outfit_royal:true},progress:{'A-01':{done:true}},name:'보존 학생',account:{status:'active'}};
const invariant=JSON.stringify({rights:old.character_unlocked,progress:old.progress,name:old.name,account:old.account});
assert.equal(old.coins,12345,'loading policy never rescales an existing balance');
const historic=JSON.stringify(old.coinLedger[0]);
assert.equal(W.reward(old,20,'unit','A-02',at),true);assert.equal(old.coins,12349);
assert.equal(JSON.stringify(old.coinLedger[0]),historic,'old ledger entry unchanged');
assert.equal(invariant,JSON.stringify({rights:old.character_unlocked,progress:old.progress,name:old.name,account:old.account}));
const after=JSON.stringify(old);assert.equal(W.reward(old,20,'unit','A-02',at),false);
assert.equal(JSON.stringify(old),after,'same claim cannot pay again');
assert.equal(W.reward(old,20,'unit','A-02',next),false,'claim survives the daily boundary');
assert.equal(W.reward(old,20,'unit',' A-02 ',next),false,'claim whitespace cannot bypass deduplication');cases+=4;
const games={coins:0};
assert.equal(W.reward(games,20,'game','round-1',at),true);
assert.equal(W.reward(games,20,'game','round-1',at),false,'same game instance pays once');
assert.equal(W.reward(games,12,'game','round-2',at),true);
assert.equal(W.reward(games,20,'game','round-3',at),false,'two daily game coins');
assert.equal(games.coins,2);assert.equal(games.coinRewards.days['2026-10-24'].game,2);
assert.equal(W.reward(games,20,'game','round-1',next),false,'same instance cannot pay on a different day');
assert.equal(W.reward(games,20,'game','round-4',next),true);assert.equal(games.coins,3);cases+=6;
const capped={coins:1000};
assert.equal(W.reward(capped,78,'unit','big-unit',at),true);
assert.equal(W.reward(capped,63,'checkup','check-1',at),true);
assert.equal(capped.coins,1020,'last reward is clipped to the remaining daily budget');
assert.deepEqual(capped.coinLedger.map(x=>x.amount),[15,5]);
assert.equal(W.reward(capped,10,'weekly','week-1',at),false);
assert.equal(W.reward(capped,999,'new-unknown-reason','bypass',at),false,'unknown reason cannot bypass global cap');
assert.equal(capped.coinRewards.days['2026-10-24'].total,20);
const paid=av.colors.find(x=>!x.free&&Number.isSafeInteger(x.price)&&x.price>0);
assert(paid,'real priced catalog item');
const budget=JSON.stringify(capped.coinRewards),buy=W.purchase(capped,'color',paid.id,av,H);
assert.equal(buy.ok,true);assert.equal(buy.spent,paid.price);
assert.equal(JSON.stringify(capped.coinRewards),budget,'purchase neither consumes nor restores reward budget');
assert.equal(W.reward(capped,3,'attendance','after-spend',at),false,'spending cannot reopen daily budget');
// The display history can be truncated or replaced without resetting the
// separately retained budget and claim keys.
capped.coinLedger=Array.from({length:100},(_,i)=>({amount:-1,reason:'purchase',label:'older-'+i}));
assert.equal(W.reward(capped,20,'unit','big-unit',next),false,'claim survives ledger eviction');
assert.equal(W.reward(capped,3,'attendance','new-day',next),true);
assert.equal(capped.coinLedger.length,100,'existing bounded display history contract');
assert.equal(W.reward(capped,3,'attendance','old-day',at),false,'clock rollback cannot reset a previous day');cases+=10;
const midnight={coins:0};
assert.equal(W.reward(midnight,78,'unit','before',new Date('2026-10-24T14:59:59.000Z')),true);
assert.equal(midnight.coinRewards.days['2026-10-24'].total,15);
assert.equal(W.reward(midnight,78,'unit','after','2026-10-24T15:00:00.000Z'),true);
assert.equal(midnight.coinRewards.days['2026-10-25'].total,15,'midnight follows KST, not the machine timezone');cases+=2;
const secondStudent={coins:0};assert.equal(W.reward(secondStudent,20,'game','round-1',at),true);
assert.equal(secondStudent.coins,1);assert.equal(games.coins,3,'student wallets are isolated');cases++;
const overflow={coins:Number.MAX_SAFE_INTEGER};assert.equal(W.reward(overflow,3,'attendance','max',at),false);
assert.equal(overflow.coins,Number.MAX_SAFE_INTEGER);assert.equal(overflow.coinRewards,undefined);cases++;
const noClaim={coins:0};for(let i=0;i<40;i++)W.reward(noClaim,999,'unknown',undefined,at);
assert.equal(noClaim.coins,20,'legacy boolean contract still receives the global daily cap');cases++;
assert.equal(W.policy.dailyLimit,20);assert.equal(W.policy.gameDailyLimit,2);
assert.equal(Object.isFrozen(W.policy),true);assert.equal(Object.isFrozen(W.gifts),true);
assert.deepEqual(W.gifts.map(g=>g.course),[7,16,24,37]);
for(const gift of W.gifts){
  const list=gift.type==='symbol'?av.symbols:gift.type==='number'?av.numbers:[];
  assert(list.some(item=>String(item.id)===gift.id),'gift is a real existing collectible');
}
assert.equal(JSON.stringify(W.gifts).includes('frac'),false,'nonexistent fraction symbol is not advertised');cases+=4;
console.log('REWARD_ECONOMY_OK cases='+cases+' dailyCap=20 gameCap=2 KSTBoundary=true durableClaims=true legacyBalancesPreserved=true purchasesSeparated=true gifts=4');
