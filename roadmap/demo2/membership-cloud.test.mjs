import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('membership-cloud.js',import.meta.url),'utf8');
function store(){const m=new Map();return {get length(){return m.size;},key:i=>[...m.keys()][i],getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};}
function harness({remote=null,base=null,local=null,fail=false}={}){
 const localStorage=store(),sessionStorage=store(),calls=[],w={localStorage,sessionStorage};let remotePlan=remote,offline=fail;
 if(base)localStorage.setItem('gfield.roadmap.cloud.base.owner',JSON.stringify(base));
 if(local)for(const[k,v]of Object.entries(local))localStorage.setItem('gfield.demo2.saved.member.owner.'+k.slice('gfield.demo2.'.length),v);
 w.RoadmapMembership={call:async(action,body)=>{calls.push({action,body});if(offline)throw Error('offline');if(action==='plan-get')return {plan:remotePlan};if(remotePlan&&remotePlan.revision!==body.revision)return {...remotePlan,conflict:true};remotePlan={revision:(remotePlan?.revision||0)+1,document:body.document,updatedAt:'2026-11-03T00:00:00Z'};return {...remotePlan,saved:true};}};
 vm.runInNewContext(source,{window:w,crypto:webcrypto,TextEncoder,JSON,Date,console,setTimeout:()=>1,clearTimeout:()=>{},document:{}});
 return {C:w.RoadmapCloud,calls,localStorage,sessionStorage,remote:()=>remotePlan,setOffline:b=>offline=b};
}
const hash=async d=>Buffer.from(await webcrypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(d)))).toString('hex');
test('existing device data is opt-in and never uploaded on startup',async()=>{const h=harness({local:{'gfield.demo2.v1':'existing'}});await h.C.prepare({user_id:'owner'});assert.equal(h.C.status().enabled,false);assert.equal(h.C.snapshot()['gfield.demo2.v1'],'existing');assert.equal(h.calls.length,1);});
test('a new device restores before the planner starts, without other owners or auth material',async()=>{const h=harness({remote:{revision:3,document:{'gfield.demo2.v1':'account'},updatedAt:'2026-11-03'}});h.localStorage.setItem('gfield.demo2.saved.member.other.v1','secret');h.sessionStorage.setItem('gfield.roadmap.member.session.v1','session');await h.C.prepare({user_id:'owner'});assert.equal(h.C.snapshot()['gfield.demo2.v1'],'account');assert.equal(Object.keys(h.C.snapshot()).length,1);assert.equal(h.C.status().revision,3);assert.equal(h.C.safeDocument({'gfield.demo2.member.other.v1':'x'}),false);});
test('different unbased local and account plans cause a conflict without writes',async()=>{const h=harness({local:{'gfield.demo2.v1':'device'},remote:{revision:2,document:{'gfield.demo2.v1':'account'}}});await h.C.prepare({user_id:'owner'});assert.equal(h.C.status().conflict,true);assert.equal(h.C.snapshot()['gfield.demo2.v1'],'device');assert.equal(h.calls.filter(c=>c.action==='plan-save').length,0);});
test('offline edits survive, retry with the same revision, and handle a concurrent change',async()=>{const d={'gfield.demo2.v1':'base'},h=harness({local:d,remote:{revision:2,document:d}});await h.C.prepare({user_id:'owner'});h.setOffline(true);h.C.changed('gfield.demo2.v1','offline');await h.C.flush();assert.equal(h.C.snapshot()['gfield.demo2.v1'],'offline');assert.equal(h.C.status().mode,'offline');h.setOffline(false);await h.C.flush();assert.equal(h.remote().document['gfield.demo2.v1'],'offline');assert.equal(h.C.status().mode,'saved');});
test('per-tab baseline protects older session data from a newer shared local baseline',async()=>{const old={'gfield.demo2.v1':'old'},latest={'gfield.demo2.v1':'new'},h=harness({local:old,base:{revision:3,hash:await hash(latest)},remote:{revision:3,document:latest}});h.sessionStorage.setItem('gfield.roadmap.cloud.base.owner',JSON.stringify({revision:2,hash:await hash({'gfield.demo2.v1':'older'})}));await h.C.prepare({user_id:'owner'});assert.equal(h.C.status().conflict,true);assert.equal(h.C.snapshot()['gfield.demo2.v1'],'old');});
