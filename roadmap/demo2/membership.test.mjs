import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const read=n=>fs.readFileSync(new URL(n,import.meta.url),'utf8');
const API=read('membership-api.js'),STORAGE=read('planner-storage.js');
const local=new Map();
function store(map=new Map()){return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};}
function api({saved=null,reply={},status=200}={}){
 const sessionStorage=store(new Map(saved?[['gfield.roadmap.member.session.v1',JSON.stringify(saved)]]:[]));const calls=[];
 const window={sessionStorage,location:{href:'https://lete-on.gfieldacademy.net/roadmap/demo2/account.html',origin:'https://lete-on.gfieldacademy.net'}};
 vm.runInNewContext(API,{window,URL,AbortSignal,Date,fetch:async(url,opts)=>{calls.push({url,opts});return {ok:status<400,status,json:async()=>reply};}});
 return {A:window.RoadmapMembership,calls,sessionStorage};
}
test('missing or expired local session is not treated as approval',async()=>{
 const h=api();assert.equal(await h.A.status(),null);assert.equal(h.calls.length,0);
 const expired=api({saved:{token:'a'.repeat(64),expiresAt:'2000-01-01'}});assert.equal(await expired.A.status(),null);
});
test('every restored session is verified by server; 401 clears it',async()=>{
 const h=api({saved:{token:'a'.repeat(64),expiresAt:'2099-01-01'},status:401,reply:{error:'login_required'}});
 await assert.rejects(h.A.status());assert.equal(h.calls.length,1);assert.equal(h.sessionStorage.getItem('gfield.roadmap.member.session.v1'),null);
});
test('transient server errors never grant offline access',async()=>{
 const h=api({saved:{token:'a'.repeat(64),expiresAt:'2099-01-01'},status:503});await assert.rejects(h.A.status());
});
test('email proof and membership session use separate headers',async()=>{
 const h=api({saved:{token:'a'.repeat(64),expiresAt:'2099-01-01'}});
 await h.A.call('reset-pin',{pin:'58294716'},'verified-email-proof');
 const headers=h.calls[0].opts.headers;assert.equal(headers.Authorization,'Bearer verified-email-proof');assert.equal(headers['x-roadmap-session'],undefined);
});
test('redirects retain planner selections but reject external and unrelated pages',()=>{
 const {A}=api();assert.equal(A.destination('planner.html?senior=example'),'planner.html?senior=example');
 for(const s of ['https://evil.invalid','//evil.invalid/roadmap/demo2/planner.html','admin.html','javascript:alert(1)'])assert.equal(A.destination(s),'planner.html');
});
test('member record storage is isolated between verified owners',()=>{
 const session=store(),persist=store(local);
 function load(id){const w={sessionStorage:session,localStorage:persist,RoadmapMember:{user_id:id}};vm.runInNewContext(STORAGE,{window:w});return w.PlannerStorage;}
 const a=load('owner-a'),b=load('owner-b');a.setItem('gfield.demo2.profile.v1','student A');assert.equal(b.getItem('gfield.demo2.profile.v1'),null);
 b.setItem('gfield.demo2.profile.v1','student B');assert.equal(a.getItem('gfield.demo2.profile.v1'),'student A');
 assert.equal(load('owner-a').getItem('gfield.demo2.profile.v1'),'student A');
});
test('legacy unclaimed plan is preserved but never silently given to another member',()=>{
 const session=store(new Map([['gfield.demo2.test.v1','legacy']]));const w={sessionStorage:session,localStorage:store(),RoadmapMember:{user_id:'new'}};
 vm.runInNewContext(STORAGE,{window:w});assert.equal(w.PlannerStorage.getItem('gfield.demo2.test.v1'),null);assert.equal(session.getItem('gfield.demo2.test.v1'),'legacy');
});
test('all main planner scripts are deferred until verified membership',()=>{
 const html=read('planner.html'),scripts=[...html.matchAll(/<script\b([^>]*)>/g)].map(x=>x[1]);
 const actual=scripts.filter(x=>/\ssrc=/.test(x));assert.equal(actual.length,2);assert(actual.every(x=>/membership-(?:api|gate)\.js/.test(x)));
 assert(scripts.filter(x=>x.includes('data-member-src')).length>40);assert.match(html,/class="member-checking"/);
});
test('privacy and marketing checkboxes are separate and never prechecked',()=>{
 const w={};vm.runInNewContext(read('membership-policy.js'),{window:w});const html=w.RoadmapPolicy.checks();
 assert.equal((html.match(/type="checkbox"/g)||[]).length,4);assert(!/\bchecked\b/.test(html));
 assert.match(html,/name="privacy" required/);assert.match(html,/name="guardian" required/);assert.doesNotMatch(html,/name="marketing_(?:email|sms)" required/);
});
