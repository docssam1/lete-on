#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const H=require('../data/human-avatars'),W=require('../app/character-state'),crypto=require('node:crypto');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data/numi-avatar.js'),'utf8'),ctx);
const av=ctx.window.NM_AVATAR;
const state={coins:100,character_unlocked:{number_42:true},name:'Student',owner_id:'guardian',progress:{'N-01':{done:true}},account:{status:'active'}};
const invariant=JSON.stringify({name:state.name,owner_id:state.owner_id,progress:state.progress,account:state.account});
assert.equal(H.looks.length,8);assert.equal(H.outfits.length,9);
const portraits=new Set();let portraitCount=0;
for(const look of H.looks)for(const outfit of H.outfits){
  if(['boy','girl'].includes(look.id)&&outfit.id==='original')continue;
  const file=path.join(__dirname,'../assets/characters/portraits',look.id+'-'+outfit.id+'.png'),png=fs.readFileSync(file);
  assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),240);assert.equal(png.readUInt32BE(20),300);
  portraits.add(crypto.createHash('sha256').update(png).digest('hex'));portraitCount++;
}
assert.equal(portraitCount,70);assert.equal(portraits.size,70,'every look/outfit has its own portrait');

assert.equal(new Set(H.looks.map(x=>JSON.stringify(H.model({look:x.id})))).size,8,'looks have distinct models');
assert.equal(new Set(H.outfits.map(x=>JSON.stringify(H.model({look:'forest-boy',outfit:x.id})))).size,9,'all outfits change appearance');
assert.deepEqual(H.clean({kind:'girl'}),{id:'legacy',name:'',kind:'girl',look:'girl',outfit:'original'});
assert.equal(H.clean({name:'  나\u202e\u0000의  친구  '}).name,'나의 친구');
assert.equal(Array.from(H.clean({name:'🌱'.repeat(20)}).name).length,16);
assert.equal(H.clean({look:'not-a-look',outfit:'bad',kind:'girl'}).look,'girl');
const buy=W.purchase(state,'color','gold',av,H);assert.equal(buy.spent,15);assert.equal(state.coins,85);
assert.equal(W.purchase(state,'color','gold',av,H).spent,0);assert.equal(state.coins,85,'owned item never charges twice');
assert.equal(W.purchase(state,'color','blue',av,H).spent,0,'free items cost zero');
assert.equal(W.purchase(state,'outfit','royal',av,H).spent,30);assert.equal(state.coins,55);
const before=JSON.stringify(state);assert.equal(W.purchase(state,'fake','royal',av,H).ok,false);assert.equal(JSON.stringify(state),before);
assert.equal(W.purchase(state,'number','99',av,H).ok,false);assert.equal(JSON.stringify(state),before,'insufficient purchase is atomic');
const one=H.clean({id:'one',look:'forest-boy',name:'내 친구',outfit:'royal'}),two=H.clean({id:'two',look:'mint-girl',name:'두 번째'});
assert.equal(W.humans(state,one,[one,two],H),true);assert.equal(state.avatarCollection.length,2);
const allBefore=JSON.stringify(state);
assert.equal(W.humans(state,{...one,outfit:'starry'},[{...one,outfit:'starry'},two],H),false,'cannot equip unpaid outfit');
assert.equal(W.humans(state,one,[one,one],H),false,'duplicate character IDs rejected');assert.equal(JSON.stringify(state),allBefore);
assert.equal(W.reward(state,-5,'attendance'),false);assert.equal(W.reward(state,NaN,'attendance'),false);
assert.equal(W.reward(state,3,'attendance'),true);assert.equal(state.coins,56);
assert.equal(state.coinLedger.at(-1).reason,'attendance');assert.equal(state.coinLedger.length,3);
assert.equal(state.character_unlocked.number_42,true,'existing course unlock retained');
for(let i=0;i<110;i++){
  const day=new Date(Date.UTC(2026,9,24+i)).toISOString();
  assert.equal(W.reward(state,1,'training','history-'+i,day),true);
}
assert.equal(state.coinLedger.length,100,'bounded history across multiple capped days');
assert.equal(invariant,JSON.stringify({name:state.name,owner_id:state.owner_id,progress:state.progress,account:state.account}),'cosmetics never change student, guardian, progress or membership');
const restored={avatar:{kind:'girl'},avatarCollection:[{id:'partial',name:'보존한 이름',look:'night-boy',outfit:'royal'}],character_unlocked:{}};
W.normalizeAvatars(restored,H);assert.equal(restored.avatar.kind,'girl');assert.equal(restored.avatarCollection.length,2);
assert.equal(restored.avatarCollection[1].name,'보존한 이름');assert.equal(restored.avatarCollection[1].outfit,'original');
const renamed={...restored.avatar,name:'새 이름'};
assert.equal(W.humans(restored,renamed,[renamed,restored.avatarCollection[1]],H),true,'partial restore cannot block naming');
console.log('OK: character migration, 8 looks, 9 outfits, exact-once purchases, balance/ownership gates, collections, safe names, bounded reward history, student preservation');
