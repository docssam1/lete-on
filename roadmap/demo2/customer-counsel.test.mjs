import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../supabase/roadmap-counsel/handler.mjs';
import {selectKnowledge,clean} from '../supabase/roadmap-counsel/search.mjs';
const row=(extra={})=>({id:'one',kind:'knowhow',stage:'middle',status:'approved',title:'중등 함수 복습',body:'함수의 뜻을 설명하고 기본 문제를 혼자 풀어 보세요.',source:'학원 상담 기준',checked_on:'2026-11-14',updated_at:'2026-11-14T00:00:00Z',...extra});
function fake({rows=[row()],active=true,allowed=true}={}){
 const calls=[];
 return {rows,calls,from(name){
  const q={filter:{},select(){return q},eq(k,v){q.filter[k]=v;return q},gt(){return q},order(){return q},range(a,b){q.range=[a,b];return q},
   async maybeSingle(){
    if(name==='roadmap_sessions')return{data:{user_id:'u',session_version:1}};
    if(name==='roadmap_members')return{data:{user_id:'u',session_version:active?1:2,student_name:'김하늘'}};
    return{data:null};
   },
   then(ok,bad){return Promise.resolve({data:rows.filter(r=>!q.filter.status||r.status===q.filter.status).slice(q.range?.[0]||0,(q.range?.[1]??999)+1)}).then(ok,bad)}
  };return q;
 },async rpc(name,args){calls.push({name,args});return{data:allowed}}};
}
const req=(action='lookup',extra={},headers={})=>new Request('https://x',{method:'POST',headers:{origin:'https://roadmap.gfieldacademy.net','x-roadmap-session':'a'.repeat(64),...headers},body:JSON.stringify({action,question:'함수 복습은 어떻게 하나요?',stage:'middle',progress:'중1-1 함수 단원',...extra})});
test('lookup is grounded, excludes candidates and never calls a model or quota',async()=>{
 const service=fake({rows:[row(),row({id:'pending',status:'candidate',body:'이 답은 미승인'})]});
 const h=createHandler({service,aiAvailable:true,ask:async()=>{assert.fail('model called')}});
 const d=await (await h(req())).json();
 assert.equal(d.generated,false);assert.equal(d.sources.length,1);assert.doesNotMatch(JSON.stringify(d),/미승인/);assert.equal(service.calls.length,0);
});
test('stage, unrelated question and masking constrain retrieval',()=>{
 const rows=[row(),row({id:'baby',stage:'preschool'})];
 assert.deepEqual(selectKnowledge(rows,{question:'함수',stage:'middle'}).map(r=>r.id),['one']);
 assert.equal(selectKnowledge(rows,{question:'축구 취미',stage:'middle'}).length,0);
 assert.doesNotMatch(clean('010-1234-5678 a@b.com'),/010|a@b/);
});
test('optional explanation caches only matching approval versions',async()=>{
 const service=fake();let calls=0,seen;
 const h=createHandler({service,aiAvailable:true,ask:async x=>{calls++;seen=x;return '기본 문제를 다시 살펴보세요. [1]'}});
 await h(req('lookup'));
 const a=await (await h(req('explain',{progress:'김하늘 010-1234-5678'}))).json();
 const b=await (await h(req('explain',{progress:'김하늘 010-1234-5678'}))).json();
 assert.equal(calls,1);assert.equal(b.reused,true);assert.equal(service.calls.length,1);
 assert.doesNotMatch(JSON.stringify(seen),/김하늘|010-1234-5678/);
 service.rows.push(row({id:'new',title:'함수 복습 수정',updated_at:'2026-11-15T00:00:00Z'}));
 const c=await (await h(req('explain',{progress:'김하늘 010-1234-5678'}))).json();
 assert.notEqual(a.revision,c.revision);assert.equal(calls,2);
});
test('candidates appear only after approval and approved material disappears after archival',async()=>{
 const candidate=row({id:'candidate',status:'candidate'});
 const service=fake({rows:[candidate]});
 const h=createHandler({service});
 assert.equal((await (await h(req())).json()).sources.length,0);
 candidate.status='approved';const data=await (await h(req())).json();assert.equal(data.sources.length,1);
 candidate.status='archived';assert.equal((await (await h(req())).json()).sources.length,0);
});
test('missing login, stale session, denied origin and absent source never reach a model',async()=>{
 const h=createHandler({service:fake(),aiAvailable:true,ask:async()=>assert.fail('model')});
 assert.equal((await h(req('lookup',{}, {'x-roadmap-session':''}))).status,401);
 assert.equal((await createHandler({service:fake({active:false})})(req())).status,401);
 assert.equal((await h(req('lookup',{}, {origin:'https://evil.invalid'}))).status,403);
 assert.equal((await h(req('explain',{question:'축구 취미'}))).status,422);
 assert.equal((await createHandler({service:fake()})(req('explain'))).status,503);
});
test('concurrent repeats share one model call; daily refusal prevents paid requests',async()=>{
 let count=0,release;const block=new Promise(r=>release=r),service=fake();
 const h=createHandler({service,aiAvailable:true,ask:async()=>{count++;await block;return '설명'}});
 const a=h(req('explain')),b=h(req('explain'));
 await new Promise(r=>setTimeout(r,20));release();
 assert.equal((await a).status,200);assert.equal((await b).status,200);assert.equal(count,1);assert.equal(service.calls.length,1);
 const denied=createHandler({service:fake({allowed:false}),aiAvailable:true,ask:async()=>assert.fail('model')});
 assert.equal((await denied(req('explain'))).status,429);
});
test('optional previous result enters a follow-up request and internal Drive sources stay private',async()=>{
 const internal='원장님 자료 https://docs.google.com/document/d/internal-example/edit';
 let received;
 const h=createHandler({service:fake({rows:[row({kind:'drive',source:internal})]}),aiAvailable:true,
  ask:async context=>{received=context;return '복습을 이어가세요.';}});
 const data=await (await h(req('explain',{previous:'김하늘 · 010-1234-5678 · 함수 · 혼자 풀 수 있어요'}))).json();
 assert.equal(data.sources[0].source,'원장님 승인 상담 자료');
 assert.match(received.context.previous,/함수 · 혼자 풀 수 있어요/);
 assert.doesNotMatch(JSON.stringify([received,data]),/internal-example|김하늘|010-1234/);
});
