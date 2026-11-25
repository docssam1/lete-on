'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const ctx={};vm.createContext(ctx);
for(const f of ['data/available-mocks.js','promo/course-navigation.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
const rows=JSON.parse(JSON.stringify(ctx.HIGHSELECT_AVAILABLE_MOCKS));
const baseline=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/ed-common1-final-origin-main-baseline-v1.json'),'utf8'));
const VERSION='ed-common1-final-v5-reviewed-20261126-layout-b59c76ddc20d234b-pdf-v8-06ed4b87594f614f';
const FINAL_ID='ed-common1-basic-final';
const final=rows.find(x=>x.id===FINAL_ID);
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const leakCounts=text=>({
 directDriveURLs:[...text.matchAll(/https?:\/\/(?:www\.)?(?:drive\.google\.com|docs\.google\.com|storage\.googleapis\.com)(?:\/|\b)/gi)].length,
 directPDFOrZIPLinks:[...text.matchAll(/(?:href|src)\s*=\s*["'][^"']+\.(?:pdf|zip)(?:[?#][^"']*)?["']/gi)].length,
 privateObjectPaths:[...text.matchAll(/\b[a-z0-9-]+\/v\d+\/(?:paper|answers|analysis)\/\d{3}-[a-f0-9]{64}\.jpg\b/gi)].length,
 privatePayloadKeys:[...text.matchAll(/["'](?:stem|answer|solution|questions|assetFunctions|storagePath|objectRoute|objectName)["']\s*:/gi)].length
});
test('final metadata appends as round 50 and binds 30 self-check items, 100 minutes and 12/16/4 pages',()=>{
 assert.equal(baseline.originMainCommit,'d4eb98fdcf088c07fb8c82f9477b61865dff117e');
 assert.equal(baseline.availableMocksCount,49);assert.equal(baseline.questionCount,1920);
 assert.equal(baseline.recordsCanonicalSHA256,'39a303366b1b9b8ba1c8761b0a04a46f9bc46e2ecd41c66c0588413a7a248781');
 assert.equal(rows.length,50);assert.equal(rows.reduce((n,x)=>n+x.questionCount,0),1950);
 assert.deepEqual(rows.slice(0,-1).map(x=>x.id),baseline.orderedIds);
 assert.equal(digest(rows.slice(0,-1)),'39a303366b1b9b8ba1c8761b0a04a46f9bc46e2ecd41c66c0588413a7a248781');
 assert.deepEqual(final,{id:FINAL_ID,programId:'ED',title:'이든 공통수학1 기본반 최종(마무리)',scope:'중2·중3 전 과정 · 대수20·기하10',mode:'released',durationMinutes:100,sectionMinutes:null,breakMinutes:0,questionCount:30,pageCount:12,answerPageCount:16,analysisPageCount:4,responseMode:'self-check'});
});
test('all pre-existing 49 course mappings and grouped order are preserved; final joins ED high-advance last',()=>{
 const nav=ctx.HIGHSELECT_PROMO_NAV;
 for(const id of baseline.orderedIds)assert.deepEqual(JSON.parse(JSON.stringify(nav.selectionForExam(id))),baseline.courseSelectionById[id],id);
 for(const [key,ids] of Object.entries(baseline.courseGroups)){
  const [program,course]=key.split(':');
  assert.deepEqual(JSON.parse(JSON.stringify(nav.examsFor(program,course,rows))).map(x=>x.id).filter(id=>id!==FINAL_ID),ids,key);
 }
 assert.deepEqual(JSON.parse(JSON.stringify(nav.selectionForExam(FINAL_ID))),{program:'ED',course:'high-advance'});
 assert.deepEqual(JSON.parse(JSON.stringify(nav.examsFor('ED','high-advance',rows))).map(x=>x.id),['ed-common1-basic-r01','ed-common1-basic-r02','ed-common1-basic-r03','ed-common1-basic-r04',FINAL_ID]);
});
test('both browser entries use coherent version tags and the actual public surfaces have zero direct private links',()=>{
 for(const file of ['promo/index.html','public/exam-entry.html']){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  const tags=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/g)].map(m=>m[1]);
  for(const name of ['available-mocks.js','course-navigation.js']){
   const found=tags.filter(src=>src.split('?')[0].endsWith(name));assert.equal(found.length,1,`${file} ${name}`);
   assert.equal(new URL(found[0],'https://candidate.invalid/').searchParams.get('v'),VERSION,`${file} ${name} cache version`);
  }
 }
 const surfaces=['data/available-mocks.js','promo/course-navigation.js','promo/index.html','public/exam-entry.html','README.md','docs/EDEN_COMMON1_FINAL_RELEASE_PREP_20261126.md'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
 assert.deepEqual(leakCounts(surfaces),{directDriveURLs:0,directPDFOrZIPLinks:0,privateObjectPaths:0,privatePayloadKeys:0});
 assert.deepEqual(Object.keys(final).sort(),['id','programId','title','scope','mode','durationMinutes','sectionMinutes','breakMinutes','questionCount','pageCount','answerPageCount','analysisPageCount','responseMode'].sort());
 const doc=fs.readFileSync(path.join(root,'docs/EDEN_COMMON1_FINAL_RELEASE_PREP_20261126.md'),'utf8');
 assert.match(doc,/현재 공개 목록은 49회·1,920문항/);assert.match(doc,/실제 공개 또는 운영 승인을 뜻하지 않는다/);
});
test('synthetic privacy fixtures prove direct-link, object-path and private-payload checks reject forbidden patterns',()=>{
 const synthetic={
  drive:'https://drive'+'.google.com/file/d/'+'SYNTHETIC-DRIVE-ID/view',
  pdf:'<a href="/fixtures/synthetic-sample.'+'pdf">sample</a>',
  object:['synthetic-exam','v1','paper','001-'+'a'.repeat(64)+'.jpg'].join('/'),
  payload:{stem:'synthetic only',answer:'synthetic only',solution:'synthetic only',assetFunctions:[]}
 };
 const syntheticText=JSON.stringify(synthetic)+' <a href="/fixtures/synthetic-sample.'+'pdf">sample</a>';
 const found=leakCounts(syntheticText);
 assert.equal(found.directDriveURLs,1);assert.equal(found.directPDFOrZIPLinks,1);assert.equal(found.privateObjectPaths,1);assert.equal(found.privatePayloadKeys,4);
});
