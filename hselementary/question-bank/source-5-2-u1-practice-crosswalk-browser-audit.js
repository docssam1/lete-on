'use strict';
// Verify source-review links through the app's real loaded curriculum and generator.
const assert=require('node:assert/strict');
const readiness=require('./source-inventory/5-2-u1-readiness-review.json');
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH || 'playwright');
const origin=process.env.HSE_AUDIT_ORIGIN || 'http://127.0.0.1:8918';
(async()=>{
 const rows=readiness.items.filter(x=>x.publicDecision==='locked');
 assert.equal(rows.length,39);assert(rows.every(x=>x.implementationStatus==='review-locked'&&x.practiceRuntimeId));
 const ids=[...new Set(rows.map(x=>x.practiceRuntimeId))];assert.equal(ids.length,33);
 const browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE||undefined});
 try {
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(`${origin}/hselementary/question-bank/`,{waitUntil:'load'});assert.equal(response.status(),200);
  const results=await page.evaluate(ids=>{
   const types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(g=>g.types)));
   return ids.map(id=>{const matches=types.filter(t=>t.id===id);if(matches.length!==1)return{id,error:`matches=${matches.length}`};const t=matches[0],key=window.HSE_GENERATORS.generatorKey(t);let generated=0;for(let v=0;v<3;v++)for(let d of [-1,0,1]){const q=window.HSE_GENERATORS.generate(t,1,d,1,v);if(q?.prompt&&q?.solution&&q.answer!==undefined)generated++;}return{id,key,locked:t.reviewLocked,generated};});
  },ids);
  for(const result of results){assert.equal(result.error,undefined,JSON.stringify(result));assert.equal(result.locked,false,result.id);assert(result.key,result.id);assert.equal(result.generated,9,result.id);}
  assert.deepEqual(errors,[]);console.log(`PASS: ${rows.length} locked source rows link to ${ids.length} distinct practices; ${results.reduce((n,r)=>n+r.generated,0)} local configurations generate.`);
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
