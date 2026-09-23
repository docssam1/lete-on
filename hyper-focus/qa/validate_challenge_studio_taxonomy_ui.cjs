/* Teacher-only local UI QA for taxonomy, concept guide and mixed uniqueness. */
'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'../..');
const out=path.join(root,'hyper-focus/output/qa/challenge-studio-taxonomy');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((request,response)=>{
 const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
 const target=path.resolve(root,'.'+pathname);
 if(!target.startsWith(root+path.sep)){response.writeHead(403).end();return;}
 fs.readFile(target,(error,data)=>{if(error){response.writeHead(404).end();return;}response.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');response.end(data);});
});

let checks=0;
function check(value,message){assert.ok(value,message);checks++;}

(async()=>{
 fs.mkdirSync(out,{recursive:true});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch();
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],external=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(!/^(127\.0\.0\.1|localhost)$/.test(new URL(request.url()).hostname))external.push(request.url());});
 try{
  const url=`http://127.0.0.1:${server.address().port}/hyper-focus/challenge/studio.html?teacherPreview=1&tab=bank`;
  await page.goto(url,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>!!window.HFChallengeStudio);

  check(await page.locator('.bank-row').count()===104,'all source occurrences must be listed');
  check(await page.locator('#areaFilter option').count()>1,'area filter must be populated');
  check(await page.locator('#subareaFilter option').count()>1,'major-type filter must be populated');
  check(await page.locator('#typeFilter option').count()>1,'subtype filter must be populated');
  check(await page.locator('.bank-area-group').count()>1,'rows must first be grouped by area');
  check(await page.locator('.bank-area-group .bank-subarea-groups>.bank-group').count()>1,'each area must contain major-type groups');

  const firstArea=await page.locator('#areaFilter option').nth(1).getAttribute('value');
  await page.locator('#areaFilter').selectOption(firstArea);
  const areaVisible=await page.locator('.bank-row').count();
  check(areaVisible>0&&await page.locator('.bank-area-group').count()===1,'area filter must cascade to one area group');
  check(await page.locator('#subareaFilter option').count()>1,'area selection must leave matching major types');
  await page.locator('#selectArea').click();
  check((await page.evaluate(()=>window.HFChallengeStudio.getSelection().length))===areaVisible,'whole-area selection must select every eligible visible occurrence');
  await page.locator('#clearSelection').click();

  const firstMajor=await page.locator('#subareaFilter option').nth(1).getAttribute('value');
  await page.locator('#subareaFilter').selectOption(firstMajor);
  check(await page.locator('.bank-group').count()===1,'major-type filter must cascade to one major group');
  check(await page.locator('#typeFilter option').count()>1,'major-type selection must populate subtypes');
  const firstSubtype=await page.locator('#typeFilter option').nth(1).getAttribute('value');
  await page.locator('#typeFilter').selectOption(firstSubtype);
  const subtypeVisible=await page.locator('.bank-row').count();
  await page.locator('#selectType').click();
  check((await page.evaluate(()=>window.HFChallengeStudio.getSelection().length))===subtypeVisible,'whole-subtype selection must select every matching occurrence');

  const row=page.locator('.bank-row').first(),concept=row.locator('[data-concept]');
  check(await concept.count()===1,'approved row must expose AI concept guide');
  check(await concept.evaluate(node=>node.getBoundingClientRect().height>=44),'concept button touch target must be at least 44px');
  await concept.focus();await page.keyboard.press('Enter');
  await page.locator('#conceptGuideDialog').waitFor({state:'visible'});
  check(await page.locator('#conceptGuideSteps>li').count()===3,'concept guide must contain exactly three steps');
  check(await page.locator('#conceptGuideHierarchy').innerText().then(text=>text.includes('영역')&&text.includes('대유형')&&text.includes('소유형')),'concept guide must show three-level hierarchy');
  check(await page.locator('#conceptGuideRule').innerText().then(text=>text.length>5),'concept guide must show an evidence-gated rule');
  await page.keyboard.press('Escape');
  check(!await page.locator('#conceptGuideDialog').isVisible(),'Escape must close concept guide');
  check(await concept.evaluate(node=>document.activeElement===node),'closing concept guide must restore focus to its trigger');
  check(await page.evaluate(()=>['conceptGuideHierarchy','conceptGuideTitle','conceptGuideEvidence','conceptGuideRule','conceptGuideSteps','conceptGuideMistake','conceptGuideSelfCheck'].every(id=>document.getElementById(id).textContent==='')),'closing concept guide must remove every concept field from DOM');
  await row.locator('[data-select]').uncheck();
  check(!await page.locator('#conceptGuideDialog').isVisible(),'checkbox interaction must not open concept guide');

  await page.setViewportSize({width:390,height:844});
  await concept.click();await page.locator('#conceptGuideDialog').waitFor({state:'visible'});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'concept guide must not create 390px page overflow');
  check(await page.locator('#conceptGuideDialog').evaluate(node=>node.scrollWidth<=node.clientWidth+1),'concept dialog must fit its mobile viewport');
  await page.locator('#conceptGuideDialog').screenshot({path:path.join(out,'concept-mobile.png')});
  await page.locator('#closeConceptGuide').click();

  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#clearSelection').click();
  await page.locator('#bankRoundFilter').selectOption('all');
  await page.locator('#areaFilter').selectOption('');
  for(const id of ['challenge-r1-main-14','challenge-r3-extra-04','challenge-r4-extra-01'])await page.locator(`[data-select="${id}"]`).check();
  await page.locator('#variantCount').fill('3');
  await page.locator('#buildPractice').click();
  await page.waitForFunction(()=>window.HFChallengeStudio.getSnapshot()?.entries.length===9,undefined,{timeout:30000});
  const uniqueness=await page.evaluate(()=>{
   const entries=window.HFChallengeStudio.getSnapshot().entries,signatures=entries.map(entry=>window.HFQuestionIdentity.signatures(entry.question));
   const unique=kind=>{const values=signatures.map(item=>item[kind]).filter(Boolean);return {count:values.length,unique:new Set(values).size};};
   return {requested:9,returned:entries.length,visible:unique('visible'),payload:unique('payload'),id:unique('id')};
  });
  check(uniqueness.returned===uniqueness.requested,'mixed worksheet must return the requested question count');
  check(uniqueness.visible.count===uniqueness.visible.unique,'mixed worksheet must not repeat a visible variant');
  check(uniqueness.payload.count===uniqueness.payload.unique,'mixed worksheet must not repeat a canonical payload when seed metadata changes');
  check(uniqueness.id.count===uniqueness.id.unique,'mixed worksheet must not repeat a question id');

  await page.locator('[data-concept]').first().click();await page.locator('#conceptGuideDialog').waitFor({state:'visible'});
  await page.evaluate(()=>{window.HFChallengeAccess={allow:()=>false,watermarkIdentity:()=>null};window.dispatchEvent(new Event('hfchallengeaccesschange'));});
  check(!await page.locator('#conceptGuideDialog').isVisible(),'access revocation must close concept guide');
  check(await page.locator('[data-concept]').count()===0,'unapproved rows must not expose concept buttons');
  check(await page.evaluate(()=>['conceptGuideHierarchy','conceptGuideTitle','conceptGuideEvidence','conceptGuideRule','conceptGuideSteps','conceptGuideMistake','conceptGuideSelfCheck'].every(id=>document.getElementById(id).textContent==='')),'access revocation must remove every concept field from DOM');
  check(errors.length===0,`browser errors: ${errors.join('; ')}`);
  check(external.length===0,`unexpected external requests: ${external.join('; ')}`);
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({status:'passed',checks,uniqueness,errors,external},null,2));
  console.log(JSON.stringify({status:'passed',checks,uniqueness,out},null,2));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
