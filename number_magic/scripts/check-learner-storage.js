#!/usr/bin/env node
'use strict';
// Fake storage only. No Auth, database, email, browser profile or network calls.
const assert=require('node:assert/strict'),storage=require('../app/learner-storage.js');
const A='owner-a',B='owner-b',LEGACY=storage.LEGACY_KEY,reports=[];
function fake(entries=[],options={}){
  const data=new Map(entries),writes=[];let gets=0;
  return {data,writes,getItem(key){gets++;if(options.failGet?.(key,gets))throw Error('fixture read');return data.has(key)?data.get(key):null;},
    setItem(key,value){assert.notEqual(key,LEGACY,'legacy is never overwritten');if(options.failSet)throw Error('fixture write');writes.push(key);data.set(key,options.mismatch?'fixture mismatched write':String(value));},
    removeItem(){throw Error('the migration never removes any key');}};
}
function test(name,run){run();reports.push(name);}
function source(s){return JSON.stringify({name:'Fixture learner',progress:{'N-01':{done:true}},coins:17,...s});}
test('opaque account keys, encoded uniqueness and preview key',()=>{
  assert.equal(storage.keyFor(null),'nm_preview_state_v1');
  assert.equal(storage.keyFor(A),'nm_learner_state_v1_owner-a');
  assert.notEqual(storage.keyFor('a/b'),storage.keyFor('a%2Fb'));
  for(const invalid of [undefined,'',' a','a b','a\nb',{},1,'x'.repeat(129),'\ud800'])assert.throws(()=>storage.keyFor(invalid));
});
test('existing own key has priority without altering either original',()=>{
  const own=source({name:'Existing A'}),old=source({cloudOwnerId:B}),f=fake([[storage.keyFor(A),own],[LEGACY,old]]),r=storage.read(f,A);
  assert.equal(r.ok,true);assert.equal(r.raw,own);assert.equal(r.migrated,false);assert.equal(f.data.get(LEGACY),old);assert.equal(f.writes.length,0);
});
test('matching legacy owner copies exact bytes once',()=>{
  const old='  '+source({cloudOwnerId:A,cloudLinked:true})+'\n',f=fake([[LEGACY,old]]),r=storage.read(f,A);
  assert.equal(r.ok,true);assert.equal(r.raw,old);assert.equal(r.migrated,true);assert.equal(f.data.get(LEGACY),old);assert.equal(f.data.get(storage.keyFor(A)),old);
  assert.equal(storage.read(f,A).migrated,false);assert.equal(f.writes.length,1);
});
test('unknown or other owner is never copied to a signed-in learner',()=>{
  for(const fields of [{},{cloudOwnerId:B},{cloudOwnerId:null},{cloudOwnerId:23},{cloudOwnerId:' owner-a'},{cloudOwnerId:'OWNER-A'}]){
    const old=source(fields),f=fake([[LEGACY,old]]),r=storage.read(f,A);assert.equal(r.ok,true);assert.equal(r.raw,null);assert.equal(r.legacySkipped,true);assert.equal(f.writes.length,0);assert.equal(f.data.get(LEGACY),old);
  }
});
test('pure guest imports to preview only without inventing an owner',()=>{
  const old=source({schoolAge:{entryYear:2025}}),f=fake([[LEGACY,old]]),r=storage.read(f,null);
  assert.equal(r.ok,true);assert.equal(r.raw,old);assert.equal(r.migrated,true);assert.equal(f.data.get(LEGACY),old);assert.equal(Object.hasOwn(JSON.parse(r.raw),'cloudOwnerId'),false);
  assert.equal(storage.read(f,A).raw,null);assert.equal(f.data.has(storage.keyFor(A)),false);
});
test('account traces, including signed-out false/null, cannot become preview',()=>{
  for(const fields of [{cloudOwnerId:A},{cloudOwnerId:null},{cloudLinked:true},{cloudLinked:false},{guardianManaged:true},{guardianManaged:false}]){
    const old=source(fields),f=fake([[LEGACY,old]]),r=storage.read(f,null);assert.equal(r.ok,true);assert.equal(r.raw,null);assert.equal(r.legacySkipped,true);assert.equal(f.writes.length,0);assert.equal(f.data.get(LEGACY),old);
  }
});
test('new account and preview remain empty rather than receiving legacy ownership',()=>{
  const f=fake();for(const owner of [A,null]){const r=storage.read(f,owner);assert.equal(r.ok,true);assert.equal(r.raw,null);assert.equal(r.migrated,false);}assert.equal(f.data.size,0);
});
test('invalid legacy is preserved and never imported',()=>{
  for(const old of ['broken json','null','[]','42','"text"'])for(const owner of [A,null]){
    const f=fake([[LEGACY,old]]),r=storage.read(f,owner);assert.equal(r.ok,true);assert.equal(r.raw,null);assert.equal(r.legacySkipped,true);assert.equal(f.data.get(LEGACY),old);assert.equal(f.writes.length,0);
  }
});
test('damaged current value is returned for caller recovery without replacement',()=>{
  const f=fake([[storage.keyFor(A),'damaged'],[LEGACY,source({cloudOwnerId:A})]]),r=storage.read(f,A);assert.equal(r.raw,'damaged');assert.equal(f.writes.length,0);
});
test('read failure never reports a successful empty learner',()=>{
  const old=source({cloudOwnerId:A}),f=fake([[LEGACY,old]],{failGet:()=>true}),r=storage.read(f,A);assert.equal(r.ok,false);assert.equal(r.raw,null);assert.equal(r.error,'storage_read_failed');assert.equal(f.data.get(LEGACY),old);assert.equal(f.writes.length,0);
});
test('migration write failure keeps legacy intact and reports failure',()=>{
  const old=source({cloudOwnerId:A}),f=fake([[LEGACY,old]],{failSet:true}),r=storage.read(f,A);assert.equal(r.ok,false);assert.equal(r.raw,null);assert.equal(r.migrated,false);assert.equal(f.data.get(LEGACY),old);assert.equal(f.data.has(storage.keyFor(A)),false);
});
test('write verification failure is not a successful migration',()=>{
  const old=source({cloudOwnerId:A}),f=fake([[LEGACY,old]],{mismatch:true}),r=storage.read(f,A);assert.equal(r.ok,false);assert.equal(r.raw,null);assert.equal(r.migrated,false);assert.equal(r.error,'migration_verify_failed');assert.equal(f.data.get(LEGACY),old);
});
test('verification read throwing also fails without losing the original',()=>{
  const old=source({cloudOwnerId:A}),f=fake([[LEGACY,old]],{failGet:(_key,n)=>n===3}),r=storage.read(f,A);assert.equal(r.ok,false);assert.equal(r.raw,null);assert.equal(r.migrated,false);assert.equal(f.data.get(LEGACY),old);
});
test('A and B reads do not copy progress across owners',()=>{
  const old=source({cloudOwnerId:A}),f=fake([[LEGACY,old]]);assert.equal(storage.read(f,B).raw,null);assert.equal(storage.read(f,A).raw,old);assert.equal(storage.read(f,B).raw,null);
  const b=source({name:'B',cloudOwnerId:B,progress:{'A-01':{done:true}}});f.setItem(storage.keyFor(B),b);assert.equal(storage.read(f,A).raw,old);assert.equal(storage.read(f,B).raw,b);assert.equal(f.data.get(LEGACY),old);
});
test('invalid owner cannot fall back to preview or read legacy',()=>{
  const old=source({}),f=fake([[LEGACY,old]]),r=storage.read(f,undefined);assert.equal(r.ok,false);assert.equal(r.key,null);assert.equal(r.error,'invalid_owner');assert.equal(f.writes.length,0);
});
console.log(JSON.stringify({fakeStorageOnly:true,networkCalls:0,cases:reports.length,reports},null,2));
console.log('OK: '+reports.length+' learner-storage cases, account/preview isolation, exact-owner migration, legacy preservation and storage-failure reporting.');
