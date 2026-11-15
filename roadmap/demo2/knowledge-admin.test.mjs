import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHandler,cleanEntry} from '../supabase/roadmap-knowledge/handler.mjs';

const ORIGIN='https://lete-on.gfieldacademy.net',UID='11111111-1111-1111-1111-111111111111',SID='22222222-2222-2222-2222-222222222222';
const b64=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
const TOKEN='h.'+b64({sub:UID,session_id:SID})+'.s';
function fakeService({role='admin',student='DOCSSAM',meta='admin',sessionActive=true,rows=[]}={}){
 const writes=[];
 const table=name=>{const q={eqs:{},op:'select',patch:null,select(){return q;},eq(k,v){q.eqs[k]=v;return q;},order(){return q;},limit(){return q;},neq(){return q;},
  update(p){q.op='update';q.patch=p;return q;},insert(p){q.op='insert';q.patch=p;return q;},
  async maybeSingle(){
   if(name==='hs_accounts')return{data:{role,active:true,student}};
   if(q.op==='update'){writes.push(['update',q.eqs.id,q.patch]);const r=rows.find(x=>x.id===q.eqs.id);return{data:r?{...r,...q.patch}:null};}
   if(q.op==='insert'){writes.push(['insert',q.patch]);return{data:{id:'new',...q.patch}};}
   return{data:rows.find(r=>r.id===q.eqs.id)||null};},
  then(ok,bad){return Promise.resolve({data:q.eqs.status?rows.filter(r=>r.status===q.eqs.status):rows}).then(ok,bad);}};return q;};
 return {writes,from:table,auth:{async getUser(t){return t===TOKEN?{data:{user:{id:UID,email:'a@b.c',email_confirmed_at:'x',app_metadata:{role:meta}}}}:{data:{user:null},error:{}};}},
  async rpc(fn,args){if(fn==='roadmap_knowledge_status'){writes.push(['status',args.p_id,{status:args.p_status,approved_at:'now'}]);return {data:rows.find(r=>r.id===args.p_id)||null};}return{data:fn==='roadmap_email_session_active'?sessionActive:null};}};
}
const req=(body,headers={})=>new Request('https://x/functions/v1/roadmap-knowledge',{method:'POST',headers:{origin:ORIGIN,authorization:'Bearer '+TOKEN,...headers},body:JSON.stringify(body)});
const ID='33333333-3333-3333-3333-333333333333';
const entry={kind:'knowhow',stage:'elementary',title:'방학 특강 기준',body:'선행보다 복습을 먼저 권합니다.',source:'',checkedOn:'2026-11-13'};

test('only the DOCSSAM admin can list knowledge',async()=>{
 for(const opts of [{role:'teacher'},{student:'OTHER'},{meta:'user'}])assert.equal((await createHandler({service:fakeService(opts)})(req({action:'list'}))).status,403);
 assert.equal((await createHandler({service:fakeService({sessionActive:false})})(req({action:'list'}))).status,401);
 assert.equal((await createHandler({service:fakeService()})(req({action:'list'},{authorization:''}))).status,401);
 assert.equal((await createHandler({service:fakeService()})(req({action:'list'},{origin:'https://evil.example'}))).status,403);
 const rows=[{id:ID,status:'candidate',title:'후보'},{id:'x',status:'approved',title:'승인'}];
 const d=await (await createHandler({service:fakeService({rows})})(req({action:'list',status:'candidate'}))).json();
 assert.deepEqual(d.items.map(r=>r.title),['후보']);assert.deepEqual(d.counts,{candidate:1,approved:1,archived:0});
});
test('new entries and edits await explicit approval',async()=>{
 const service=fakeService({rows:[{id:ID,status:'candidate'}]}),h=createHandler({service,now:()=>Date.parse('2026-11-13T00:00:00Z')});
 assert.equal((await h(req({action:'save',entry}))).status,200);
 assert.equal(service.writes[0][1].status,'candidate');assert.equal(service.writes[0][1].origin,'admin');assert.equal(service.writes[0][1].approved_at,undefined);
 assert.equal((await h(req({action:'save',id:ID,entry}))).status,200);assert.equal(service.writes[1][2].status,'candidate');
 assert.equal((await h(req({action:'status',id:ID,status:'approved'}))).status,200);assert.ok(service.writes[2][2].approved_at);
 assert.equal((await h(req({action:'status',id:ID,status:'deleted'}))).status,400);
 assert.equal((await h(req({action:'status',id:'not-a-uuid',status:'archived'}))).status,400);
});
test('cleanEntry checks kind, stage, sizes and dates',()=>{
 assert.equal(cleanEntry(entry).checked_on,'2026-11-13');
 for(const bad of [{kind:'other'},{stage:'college'},{title:''},{title:'가'.repeat(121)},{body:'가'.repeat(4001)},{checkedOn:'2026-13-40'},{checkedOn:'어제'}])
  assert.throws(()=>cleanEntry({...entry,...bad}));
 assert.equal(cleanEntry({...entry,body:'가\u0000나\n\n\n\n다'}).body,'가나\n\n다');
});
test('editing approved content creates a candidate and leaves its published source intact',async()=>{
 const original={id:ID,status:'approved',body:'기존 승인 본문'};
 const service=fakeService({rows:[original]}),h=createHandler({service});
 const response=await h(req({action:'save',id:ID,entry}));
 assert.equal(response.status,200);
 assert.equal(service.writes[0][0],'insert');
 assert.equal(service.writes[0][1].status,'candidate');
 assert.equal(service.writes[0][1].supersedes_id,ID);
 assert.equal(original.body,'기존 승인 본문');
 assert.equal((await response.json()).pending,true);
});
test('the admin page loads the knowledge script after the member script and keeps no inline handlers',()=>{
 const html=readFileSync(new URL('./admin.html',import.meta.url),'utf8');
 assert.ok(html.indexOf('membership-admin.js')<html.indexOf('knowledge-admin.js'));
 assert.match(html,/id="adminKnowledge"[^>]*hidden/);assert.doesNotMatch(html,/\son[a-z]+="/);
 const js=readFileSync(new URL('./membership-admin.js',import.meta.url),'utf8');
 assert.match(js,/roadmap-admin-ready/);assert.match(js,/roadmap-admin-signed-out/);
});
test('the site seed is approved site guidance without personal fields',()=>{
 const seed=JSON.parse(readFileSync(new URL('../supabase/knowledge-seed/seed.json',import.meta.url),'utf8'));
 assert.ok(seed.length>=40);assert.equal(new Set(seed.map(r=>r.seed_key)).size,seed.length);
 for(const r of seed){assert.equal(r.status,'approved');assert.equal(r.kind,'site');assert.ok(r.title.length<=120&&r.body.length<=4000);assert.doesNotMatch(r.body,/01\d-?\d{3,4}-?\d{4}|@/);}
});
