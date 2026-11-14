import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('./planner-consult.js',import.meta.url),'utf8');
function load(initial={}){
 const data=new Map(Object.entries(initial)),reloads=[];
 const window={localStorage:{getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v))},location:{reload:()=>reloads.push(1)}};
 vm.runInNewContext(code,{window});
 return {C:window.RoadmapConsult,data,reloads};
}
test('first student keeps the account owner so earlier review plans stay visible',()=>{
 const {C,data}=load();const r=C.prepare({user_id:'rev'});
 assert.equal(r.owner,'rev');assert.equal(r.name,'');
 assert.deepEqual(JSON.parse(data.get('gfield.consult.v1.rev')),{students:[{id:'main',name:''}],current:'main'});
});
test('a chosen student gets its own storage owner',()=>{
 const {C}=load({'gfield.consult.v1.rev':JSON.stringify({students:[{id:'main',name:'가'},{id:'k2x9',name:'나'}],current:'k2x9'})});
 const r=C.prepare({user_id:'rev'});assert.equal(r.owner,'rev.c.k2x9');assert.equal(r.name,'나');
});
test('broken or hostile stored lists are cleaned before use',()=>{
 const {C}=load();
 const s=C.restore(JSON.stringify({students:[{id:'../x',name:'a'},{id:'ok1',name:'<b>철수</b>'}],current:'../x'}));
 assert.equal(s.students.map(x=>x.id).join(','),'main,ok1');assert.equal(s.students[1].name,'b철수/b');assert.equal(s.current,'main');
 assert.equal(C.restore('not json').current,'main');
});
