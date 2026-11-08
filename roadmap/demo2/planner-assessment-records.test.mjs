import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const g={CompressionStream,DecompressionStream};
const env={window:g,Blob,Response,Uint8Array,atob,btoa};
for(const name of ['planner-book-pace','planner-assessment-records']){
  runInNewContext(readFileSync(new URL(name+'.js',import.meta.url),'utf8'),env);
}
const R=g.PlannerAssessmentRecords, day='2026-11-08';
const first={id:'sitting1',track:'curriculum',semester:'1-1',unitId:'u1',unitTitle:'9까지의 수',date:'2026-11-01',
  items:[{id:'중-q3',phase:'initial',outcome:'wrong',answer:'private'}],name:'private'};
const doc=a=>({schema:R.schema,attempts:a});
test('imports only result fields and keeps sessions for different books and tracks',async()=>{
  const good=R.validate(doc([first]),day);
  assert.ok(!JSON.stringify(good).includes('private'));
  const added=R.validate(doc([{...first,track:'thinking',bookId:'사고력 1'}]),day);
  const corrected=R.validate(doc([{...first,items:[{id:'중-q3',phase:'initial',outcome:'independent'}]}]),day);
  const next=R.merge(R.merge(good,added),corrected);
  assert.equal(next.length,2);
  assert.equal(next[0].items[0].outcome,'independent');
  assert.equal(JSON.stringify(await R.decode(await R.encode(next))),JSON.stringify(next));
});
test('larger classroom result list survives compressed storage and preserves category names',async()=>{
  const rows=R.validate(doc(Array.from({length:200},(_,i)=>({...first,id:'attempt-'+i}))),day);
  const packed=await R.encode(rows);
  assert.ok(packed.startsWith('z:'));
  assert.equal(JSON.stringify(await R.decode(packed)),JSON.stringify(rows));
});
test('rejects incompatible documents atomically and disallows future, invalid, and sample scores',()=>{
  for(const payload of [doc([]),{...doc([first]),demo:true},doc([first,{...first,sample:true}]),doc([{...first,date:'2026-11-09'}]),doc([{...first,date:'2026-02-30'}]),doc([{...first,items:[{id:'a',phase:'first',outcome:'independent'}]}])]){
    assert.throws(()=>R.validate(payload,day));
  }
});
