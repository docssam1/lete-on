import test from 'node:test';
import assert from 'node:assert/strict';
import {createAssetHandler, hex, sha256} from '../../supabase/functions/highselect-exams/storage-assets-core.mjs';

const raw='a'.repeat(64), key=await crypto.subtle.importKey('raw',new TextEncoder().encode('local-test-signing-key'),{name:'HMAC',hash:'SHA-256'},false,['sign']);
const now=1900000000000, future=new Date(now+3600000).toISOString(), sub=await sha256(raw);
const bytes=new Uint8Array([255,216,255,0,1,2,255,217]);
const item={kind:'paper',page:1,path:'exam-r03/v1-1234/paper/001.jpg',bytes:bytes.length,sha256:await sha256(bytes),base64:Buffer.from(bytes).toString('base64')};
const bank={bucket:'highselect-private-pages',exams:[{id:'exam-r03',pages:[item]}]};
const bucket={id:bank.bucket,public:false,file_size_limit:1048576,allowed_mime_types:['image/jpeg']};
const config={runId:'local-fixed-run',studentId:'own-test-id',controlExamId:'exam-r03',deadline:now+60000,batches:[{id:'batch-01',pages:[item]}]};
async function url(values={}) {
 const p={exam:'exam-r03',sub,kind:'paper',page:'1',exp:String(Math.floor(now/1000)+300),...values};
 p.sig=hex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode([p.exam,p.sub,p.kind,p.page,p.exp].join('|'))));
 return 'https://function.invalid/?'+new URLSearchParams({action:'asset',...p});
}
function fixture(options={}) {
 const state={bucket: options.missingBucket?null:structuredClone(bucket),objects:new Map(options.empty?[]:[[item.path,bytes]]),uploads:0,downloads:0,creates:0,queries:0,...options};
 const db={
  from(table) {return {select(){return this;},eq(){return this;},async maybeSingle(){state.queries++;
   if(state.dbError)return {data:null,error:{}};
   if(table==='highselect_sessions')return {data:state.missingSession?null:{student_id:state.studentId||'own-test-id',expires_at:state.expiredSession?'2000-01-01':future}};
   return {data:{id:state.studentId||'own-test-id',is_test:state.isTest!==false,active:state.active!==false,expires_at:state.expiredAccount?'2000-01-01':future,exam_grants:state.grants||['exam-r03']}};
  }};},
  storage:{
   async getBucket(){return state.bucket?{data:state.bucket}:{data:null,error:{}};},
   async createBucket(name,settings){state.creates++;state.bucket={id:name,public:settings.public,file_size_limit:settings.fileSizeLimit,allowed_mime_types:settings.allowedMimeTypes};return {data:state.bucket};},
   from(name){assert.equal(name,bank.bucket);return {
    async download(path){state.downloads++;const data=state.objects.get(path);return data?{data:new Blob([data])}:{data:null,error:{}};},
    async upload(path,data,settings){state.uploads++;assert.equal(settings.upsert,false);assert.equal(settings.contentType,'image/jpeg');if(state.objects.has(path))return {error:{statusCode:state.conflictCode||'400'}};if(state.uploadFails)return {error:{}};state.objects.set(path,data);return {data:{path}};},
   };},
  },
 };
 const opts={db,signingKey:key,bank,now:()=>now};const readHandler=createAssetHandler(opts);
 return {db,state,readHandler};
}
async function seedRequest(overrides={}) {
 const u=new URL(await url());u.searchParams.set('action','seed');u.searchParams.set('batch','batch-01');
 if(overrides.query)for(const [k,v] of Object.entries(overrides.query))u.searchParams.set(k,v);
 return new Request(u,{method:overrides.method||'POST',headers:{authorization:'Bearer '+raw,'x-highselect-migration':config.runId,...overrides.headers},...(overrides.body?{body:overrides.body}:{})});
}
test('legacy signed GET returns byte-identical private JPEG, no write operations',async()=>{
 const f=fixture();const r=await f.readHandler(new Request(await url(),{headers:{origin:'https://lete-on.gfieldacademy.net'}}));
 assert.equal(r.status,200);assert.deepEqual(new Uint8Array(await r.arrayBuffer()),bytes);assert.equal(r.headers.get('content-type'),'image/jpeg');assert.match(r.headers.get('cache-control'),/private, no-store/);assert.equal(r.headers.get('x-content-type-options'),'nosniff');assert.equal(f.state.uploads+f.state.creates,0);
});
test('missing/tampered/expired signatures and unsupported origins never download',async()=>{
 for(const change of [u=>u.searchParams.delete('sig'),u=>u.searchParams.set('exam','other'),u=>u.searchParams.set('kind','answers'),u=>u.searchParams.set('page','2'),u=>u.searchParams.set('exp','1')]){
  const f=fixture(),u=new URL(await url());change(u);assert.equal((await f.readHandler(new Request(u))).status,403);assert.equal(f.state.downloads,0);
 }
 const f=fixture();assert.equal((await f.readHandler(new Request(await url(),{headers:{origin:'https://evil.invalid'}}))).status,403);assert.equal(f.state.queries,0);
});
test('session revocation, expiry, inactive accounts and missing grants fail before storage',async()=>{
 for(const flags of [{missingSession:true},{expiredSession:true},{active:false},{expiredAccount:true},{grants:['other']}]){
  const f=fixture(flags),r=await f.readHandler(new Request(await url()));assert.ok([401,403].includes(r.status));assert.equal(f.state.downloads,0);
 }
});
test('DB failure, public bucket, missing object and size/hash corruption fail closed',async()=>{
 for(const setup of [f=>f.state.dbError=true,f=>f.state.bucket.public=true,f=>f.state.objects.clear(),f=>f.state.objects.set(item.path,new Uint8Array([1])),f=>f.state.objects.set(item.path,new Uint8Array(bytes.length))]){
  const f=fixture();setup(f);assert.equal((await f.readHandler(new Request(await url()))).status,503);assert.equal(f.state.uploads,0);
 }
});
test('unknown mapped page returns 404; request-supplied object paths cannot redirect reads',async()=>{
 const f=fixture();assert.equal((await f.readHandler(new Request(await url({page:'2'})))).status,404);
 const u=new URL(await url());u.searchParams.set('path','another/exam/answers.jpg');const r=await f.readHandler(new Request(u));assert.equal(r.status,200);assert.deepEqual(new Uint8Array(await r.arrayBuffer()),bytes);
});
test('final reader rejects seed POST and all other write methods',async()=>{
 const f=fixture();assert.equal((await f.readHandler(await seedRequest())).status,404);for(const method of ['POST','PUT','DELETE','PATCH'])assert.equal((await f.readHandler(new Request(await url(),{method}))).status,404);assert.equal(f.state.uploads+f.state.creates,0);
});
