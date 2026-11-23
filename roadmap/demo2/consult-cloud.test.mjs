import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
const source=readFileSync(new URL('membership-cloud.js',import.meta.url),'utf8');
const storage=()=>{const m=new Map();return {get length(){return m.size;},key:i=>[...m.keys()][i],getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};
const plain=v=>JSON.parse(JSON.stringify(v));
function server(){const rows=new Map(),calls=[];return {rows,calls,async call(account,action,body){calls.push({account,action,body:plain(body)});assert.equal(body.accountId,account);const key=account+':'+body.studentId,old=rows.get(key);if(action==='consult-get')return {plan:old||null};assert.equal(action,'consult-save');if(old&&old.revision!==body.revision)return {...old,conflict:true};assert.equal(body.revision,old?.revision||0);const plan={document:plain(body.document),revision:(old?.revision||0)+1,updatedAt:'2026-11-17T07:00:00Z'};rows.set(key,plan);return {...plan,saved:true};}};}
function device(remote,account='account-a',student='main',initial={}){const localStorage=storage(),sessionStorage=storage();let offline=false,hold=null;const owner=student==='main'?account:account+'.c.'+student;
 for(const [key,value]of Object.entries(initial))localStorage.setItem('gfield.demo2.saved.member.'+owner+'.'+key.slice('gfield.demo2.'.length),value);
 const w={localStorage,sessionStorage,RoadmapMembership:{call:async(action,body)=>{if(offline)throw Error('offline');if(hold)await hold;return remote.call(account,action,body);}}};
 vm.runInNewContext(source,{window:w,crypto:webcrypto,TextEncoder,setTimeout:()=>1,clearTimeout(){},document:{}});
 const member={user_id:owner,consult:true,consultAccount:account,consultStudent:student};
 return {C:w.RoadmapCloud,member,localStorage,sessionStorage,prepare:()=>w.RoadmapCloud.prepare(member),edit(key,value){localStorage.setItem('gfield.demo2.saved.member.'+owner+'.'+key.slice('gfield.demo2.'.length),value);w.RoadmapCloud.changed(key,value);},offline(value){offline=value;},hold(value){hold=value;}};
}
const META='gfield.demo2.consult-meta.v1',COMMENT='gfield.demo2.consult-comment.v1';
test('consulting automatically saves plan, learning results and comments and restores them on another device',async()=>{
 const remote=server(),a=device(remote,'account-a','main',{[META]:'{"name":"검수"}','gfield.demo2.v1':'plan-a',[COMMENT]:'<p>상담</p>','gfield.demo2.unit-checklist.v1':'checks'});
 await a.prepare();assert.equal(a.C.status().enabled,true);await a.C.flush();assert.equal(a.C.status().mode,'saved');
 const b=device(remote);await b.prepare();assert.deepEqual(plain(b.C.snapshot()),plain(a.C.snapshot()));assert.equal(b.C.status().revision,1);
 assert.equal(remote.calls.some(c=>c.action==='plan-save'),false);assert.ok(remote.calls.every(c=>c.body.accountId==='account-a'&&c.body.studentId==='main'));
});
test('students and accounts retain independent documents even when student ids match',async()=>{
 const remote=server();for(const [account,student,value]of [['account-a','main','one'],['account-a','second','two'],['account-b','main','three']]){const d=device(remote,account,student,{'gfield.demo2.v1':value});await d.prepare();await d.C.flush();}
 for(const [account,student,value]of [['account-a','main','one'],['account-a','second','two'],['account-b','main','three']]){const d=device(remote,account,student);await d.prepare();assert.equal(d.C.snapshot()['gfield.demo2.v1'],value);}
});
test('concurrent devices never overwrite each other silently, and retain the unsaved local note',async()=>{
 const remote=server(),a=device(remote,'account-a','main',{'gfield.demo2.v1':'start'});await a.prepare();await a.C.flush();const b=device(remote);await b.prepare();
 a.edit(COMMENT,'device A');await a.C.flush();b.edit(COMMENT,'device B');await b.C.flush();
 assert.equal(b.C.status().conflict,true);assert.equal(b.C.snapshot()[COMMENT],'device B');assert.equal(remote.rows.get('account-a:main').document[COMMENT],'device A');
});
test('offline changes remain on the device and retry against the same student revision',async()=>{
 const remote=server(),a=device(remote,'account-a','second',{'gfield.demo2.v1':'base'});await a.prepare();await a.C.flush();a.offline(true);a.edit(COMMENT,'offline note');await a.C.flush();assert.equal(a.C.status().mode,'offline');assert.equal(a.C.snapshot()[COMMENT],'offline note');a.offline(false);await a.C.flush();assert.equal(remote.rows.get('account-a:second').document[COMMENT],'offline note');
});
test('a no-op planner redraw cannot create a conflict after another device has saved',async()=>{
 const remote=server(),a=device(remote,'account-a','main',{'gfield.demo2.v1':'base'});await a.prepare();await a.C.flush();const b=device(remote);await b.prepare();b.edit(COMMENT,'newer');await b.C.flush();
 const before=remote.calls.length;a.edit('gfield.demo2.v1','base');await a.C.flush();assert.equal(remote.calls.length,before);assert.equal(a.C.status().conflict,false);
});
test('switching students can await an in-flight save and include edits made while it was saving',async()=>{
 const remote=server(),a=device(remote,'account-a','main',{'gfield.demo2.v1':'base'});await a.prepare();await a.C.flush();let release;a.hold(new Promise(resolve=>release=resolve));a.edit(COMMENT,'first');const one=a.C.flush();await new Promise(resolve=>setImmediate(resolve));a.edit(COMMENT,'second');const two=a.C.flush();a.hold(null);release();await Promise.all([one,two]);assert.equal(remote.rows.get('account-a:main').document[COMMENT],'second');assert.equal(a.C.status().mode,'saved');
});
test('consulting accepts bounded photo notes but excludes sessions and reports oversized local records',async()=>{
 const remote=server(),a=device(remote,'account-a','main',{[COMMENT]:'x'.repeat(400000)});await a.prepare();await a.C.flush();assert.equal(a.C.status().mode,'saved');
 assert.equal(a.C.safeDocument({'gfield.roadmap.member.session.v1':'secret'}),false);a.edit(COMMENT,'x'.repeat(1200001));await a.C.flush();assert.equal(a.C.status().mode,'large');assert.equal(a.C.snapshot()[COMMENT].length,1200001);assert.equal(remote.rows.get('account-a:main').document[COMMENT].length,400000);
});

test('the main student snapshot excludes nested owners belonging to other consulting students',async()=>{
 const remote=server(),a=device(remote,'account-a','main',{'gfield.demo2.v1':'main'});a.localStorage.setItem('gfield.demo2.saved.member.account-a.c.second.v1','other student');a.localStorage.setItem('gfield.demo2.saved.member.account-a.c.second.consult-comment.v1','private second note');await a.prepare();assert.deepEqual(plain(a.C.snapshot()),{'gfield.demo2.v1':'main'});assert.equal(a.C.safeDocument({'gfield.demo2.c.second.v1':'nested'}),false);await a.C.flush();assert.equal(Object.keys(remote.rows.get('account-a:main').document).length,1);
});
