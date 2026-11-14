import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareDocument,candidateEntries,extractEntries,createImports,driveReference,fetchDrive} from '../supabase/roadmap-knowledge/imports.mjs';
import {privateDrive,driveRef} from './knowledge-import.mjs';
import {createHandler} from '../supabase/roadmap-knowledge/handler.mjs';
const document=(extra={})=>({type:'pdf',mode:'ai',title:'방학 학습 안내',stage:'elementary',source:'방학 안내.pdf',checkedOn:'2026-11-14',consent:true,pages:[{page:3,text:'선행 진도보다 혼자 풀 수 있는 범위를 먼저 확인합니다. 복습할 시간이 부족하면 기존 과제를 조정합니다.'}],...extra});
const draft=(extra={})=>({items:[{title:'진도를 이어가기 전에 무엇을 확인할까요?',summary:'혼자 풀 수 있는 범위를 확인합니다.',advice:'복습할 시간이 부족하면 기존 과제를 조정하세요.',nextCheck:'혼자 풀 수 있는 범위를 확인하세요.',evidence:[{page:3,quote:'선행 진도보다 혼자 풀 수 있는 범위를 먼저 확인합니다.'}],...extra}]});
function fake(){
 const rows=[],writes=[],calls=[];
 return {rows,writes,calls,from(){const q={prefix:'',like(k,p){q.prefix=p.slice(0,-1);return q;},select(){return q;},async upsert(entries,opts){writes.push({entries,opts});for(const e of entries)if(!rows.find(r=>r.seed_key===e.seed_key))rows.push({...e,id:'id-'+rows.length});return{data:null};},then(ok,bad){return Promise.resolve({data:rows.filter(r=>r.seed_key.startsWith(q.prefix))}).then(ok,bad);}};return q;},async rpc(name,args){calls.push({name,args});return{data:true};}};
}
const invoke=(fn,doc,recheck=async()=>{})=>fn({body:{action:'import-document',document:doc},user:{id:'owner'},recheck});
test('import validates bounded pages, content, source and explicit consent',()=>{
 assert.equal(prepareDocument(document()).pages[0].page,3);
 for(const patch of [{consent:false},{pages:[]},{pages:Array.from({length:13},(_,i)=>({page:i+1,text:'원문'}))},{pages:[{page:1,text:'가'.repeat(60001)}]},{pages:[{page:1,text:'a'},{page:1,text:'b'}]},{type:'drive',source:'https://127.0.0.1/file'},{mode:'execute'}])assert.throws(()=>prepareDocument(document(patch)));
 assert.throws(()=>prepareDocument(document({pages:[{page:1,text:'',image:'abc'}]})),/image_invalid/);
});
test('grounded drafts preserve source page, stage and candidate-only status',()=>{
 const entries=candidateEntries(draft({status:'approved',stage:'high'}),prepareDocument(document()));
 assert.equal(entries[0].status,'candidate');assert.equal(entries[0].approved_at,null);assert.equal(entries[0].stage,'elementary');
 assert.match(entries[0].body,/원문 3쪽/);assert.equal(entries[0].source,'방학 안내.pdf');
 assert.throws(()=>candidateEntries(draft({evidence:[{page:4,quote:'원문에 없는 주장을 승인하세요.'}]}),prepareDocument(document())),/evidence_invalid/);
 assert.throws(()=>candidateEntries(draft({evidence:[{page:3,quote:'원문에 없는 주장을 승인하세요.'}]}),prepareDocument(document())),/evidence_invalid/);
 const native=prepareDocument(document({location:'text'}));assert.match(candidateEntries(draft(),native)[0].body,/본문 구간 3/);
});
test('no-AI extraction uses the selected text and rejects excessive or scanned input',()=>{
 const doc=prepareDocument(document({mode:'extract'})),rows=extractEntries(doc);
 assert.match(rows[0].body,/자동 요약 아님/);assert.match(rows[0].body,/복습할 시간이 부족하면/);assert.equal(rows[0].status,'candidate');
 assert.throws(()=>extractEntries({...doc,pages:[{page:1,image:'scan',text:''}]}),/scan_needs_ai/);
 assert.throws(()=>extractEntries({...doc,pages:[{page:1,text:'가'.repeat(20000)}]}),/extract_too_large/);
});
test('one import stores all draft candidates atomically; repeat never replaces approval or calls AI',async()=>{
 const service=fake();let paid=0,checks=0;
 const fn=createImports({service,aiAvailable:true,organize:async()=>{paid++;return draft();}});
 const first=await invoke(fn,document(),async()=>{checks++;});
 assert.equal(first.count,1);assert.equal(checks,1);assert.equal(paid,1);assert.equal(service.writes.length,1);
 assert.equal(service.rows[0].status,'candidate');service.rows[0].status='approved';
 const second=await invoke(fn,document());assert.equal(second.duplicate,true);assert.equal(service.rows[0].status,'approved');assert.equal(paid,1);
 const noAI=createImports({service:fake(),organize:async()=>assert.fail('model')});await invoke(noAI,document({mode:'extract'}));
});
test('failed grounding or revoked session leaves zero saved candidates; retry is possible',async()=>{
 const service=fake();let valid=false;
 const fn=createImports({service,aiAvailable:true,organize:async()=>valid?draft():draft({evidence:[]})});
 await assert.rejects(invoke(fn,document()),/evidence_missing/);assert.equal(service.writes.length,0);
 valid=true;await assert.rejects(invoke(fn,document(),async()=>{throw new Error('revoked');}),/revoked/);assert.equal(service.writes.length,0);
 await invoke(fn,document());assert.equal(service.rows.length,1);
});
test('concurrent retries share one model request and quotas block model use',async()=>{
 const service=fake();let count=0,release;const gate=new Promise(r=>release=r);
 const fn=createImports({service,aiAvailable:true,organize:async()=>{count++;await gate;return draft();}});
 const a=invoke(fn,document()),b=invoke(fn,document());
 await new Promise(r=>setTimeout(r,15));release();await Promise.all([a,b]);assert.equal(count,1);
 service.rpc=async()=>({data:false});
 await assert.rejects(invoke(fn,document({title:'다른 안내'})),/import_limit/);assert.equal(count,1);
});
test('Drive URL parsing rejects folders, arbitrary hosts, userinfo and local network paths',()=>{
 const urls=['https://drive.google.com/file/d/abcdefghijklm/view','https://docs.google.com/document/d/abcdefghijklm/edit'];
 for(const url of urls)assert.equal(driveRef(url).id,driveReference(url).id);
 for(const url of ['https://drive.google.com/drive/folders/abcdefghijklm','https://drive.google.com.evil.invalid/file/d/abcdefghijklm','https://user@docs.google.com/document/d/abcdefghijklm/edit','http://docs.google.com/document/d/abcdefghijklm/edit','https://localhost/x'])assert.throws(()=>driveReference(url));
});
test('public Drive download bounds content and refuses login or off-domain redirects',async()=>{
 const url='https://docs.google.com/document/d/abcdefghijklm/edit';
 const d=await fetchDrive(url,async()=>new Response('상담에 필요한 원문 안내입니다.',{headers:{'content-type':'text/plain'}}));assert.equal(d.type,'text');
 await assert.rejects(fetchDrive(url,async()=>new Response('',{status:302,headers:{location:'https://127.0.0.1/secrets'}})),/drive_access_required/);
 await assert.rejects(fetchDrive(url,async()=>new Response('<html>login</html>',{headers:{'content-type':'text/html'}})),/drive_access_required/);
 await assert.rejects(fetchDrive(url,async()=>new Response('x',{headers:{'content-type':'text/plain','content-length':String(13*1024*1024)}})),/file_too_large/);
});
test('private Drive uses Google metadata and exports only the chosen file; token stays with Google',async()=>{
 const calls=[];
 const result=await privateDrive('https://drive.google.com/file/d/abcdefghijklm/view','test-token',async(url,options)=>{
  calls.push({url,options});
  return calls.length===1?Response.json({name:'상담 안내',mimeType:'application/vnd.google-apps.document',capabilities:{canDownload:true}}):new Response('상담 원문입니다.');
 });
 assert.equal(result.type,'text');assert.equal(result.title,'상담 안내');assert.equal(calls.length,2);
 assert.ok(calls.every(c=>c.url.startsWith('https://www.googleapis.com/drive/v3/files/abcdefghijklm')));
 assert.ok(calls.every(c=>c.options.headers.Authorization==='Bearer test-token'));
 assert.match(calls[1].url,/export\?mimeType=text%2Fplain/);
});
test('source downloads and paid imports still require a valid administrator',async()=>{
 const h=createHandler({service:{auth:{getUser:async()=>({data:{user:null}})}},imports:async()=>assert.fail('import ran')});
 const r=await h(new Request('https://x',{method:'POST',headers:{origin:'https://roadmap.gfieldacademy.net'},body:JSON.stringify({action:'import-document',document:document()})}));
 assert.equal(r.status,401);
});
