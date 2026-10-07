import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.SCIENCE_PLAYWRIGHT||'playwright');
const base=process.env.PILOT_URL||'http://127.0.0.1:39247/science-lab/popcorn/fabre-09/current/';
const out=process.env.PILOT_SHOTS;if(!out)throw new Error('PILOT_SHOTS must name an evidence directory');
await mkdir(out,{recursive:true});
const browser=await chromium.launch();const cases=[];
try{
 for(const vp of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'landscape',width:844,height:390}]){
  const context=await browser.newContext({viewport:vp});const page=await context.newPage();const errors=[];let answerRequests=0;
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('workbook-feedback.js'))answerRequests++});
  await page.addInitScript(()=>{window.__audios=[];const Native=window.Audio;window.Audio=function(...args){const audio=new Native(...args);window.__audios.push(audio);return audio};localStorage.setItem('qa.sentinel','private learner record');});
  await page.goto(base+'workbook.html');await page.locator('[data-workbook-ready="true"]').waitFor();
  if(vp.name==='landscape'){await page.locator('#workbook-preview').evaluate(el=>el.requestFullscreen());assert.equal(await page.evaluate(()=>!!document.fullscreenElement),true)}
  const checks=[];const pass=s=>checks.push(s);
  assert.equal(await page.locator('.wb-coach').count(),17);pass('supplied Popcorn explains on all 17 pages');
  assert.equal(await page.locator('[data-book-evaluation]').count(),9);pass('nine source self evaluation items are present');
  for(const id of [1,2,3,5,6,7,8,9,13,14,15,16,17]){
   await page.locator(`[data-workbook-page="${id}"]`).click();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.locator(`.workbook-page[data-page="${id}"]`).evaluate(el=>el.scrollWidth>el.clientWidth+2),false);
  }pass('concept, questions, photos, character and articles fit all viewports');
  await page.locator('[data-workbook-page="9"]').click();assert.equal(answerRequests,0);
  assert.equal(await page.locator('[data-book-feedback]').isVisible(),false);pass('answer explanation is absent before the learner submits');
  await page.locator('[data-book-check="source"]').click();assert.match(await page.locator('[data-book-feedback]').textContent(),/먼저/);assert.equal(answerRequests,0);
  await page.locator('input[name="wb-source-choice"][value="1"]').check();await page.locator('[data-book-check="source"]').click();await page.waitForFunction(()=>!document.querySelector('[data-book-check]').disabled);
  assert.equal(answerRequests,1);assert.match(await page.locator('[data-book-feedback]').textContent(),/③/);
  assert.equal(await page.locator('input[name="wb-source-choice"]:checked').inputValue(),'1');pass('feedback loads after submission and preserves the selected answer');
  await page.locator('input[name="wb-source-choice"][value="3"]').check();await page.locator('[data-book-check="source"]').click();await page.waitForFunction(()=>!document.querySelector('[data-book-check]').disabled);
  assert.match(await page.locator('[data-book-feedback]').textContent(),/잘 찾/);pass('source question permits an explained retry');
  await page.locator('[data-workbook-page="13"]').click();await page.locator('[data-book-evaluation="1"]').selectOption({label:'보통'});
  await page.locator('[data-workbook-page="14"]').click();await page.locator('[data-workbook-page="13"]').click();assert.equal(await page.locator('[data-book-evaluation="1"]').inputValue(),'보통');pass('self evaluation survives page navigation during this reading');
  await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));
  assert.equal(await page.locator('.workbook-print-root input:checked').count(),0);assert.equal(await page.locator('.workbook-print-root [data-book-feedback]:visible').count(),0);
  assert.equal(await page.locator('.workbook-print-root [data-book-evaluation="1"]').inputValue(),'');await page.evaluate(()=>dispatchEvent(new Event('afterprint')));pass('blank handout stays blank after quiz and evaluation interactions');
  await page.locator('[data-workbook-page="8"]').click();await page.locator('[data-book-voice="fabre09-concept"]').click();
  await page.waitForFunction(()=>window.__audios.some(a=>a.currentTime>0&&!a.paused));
  const audio=await page.evaluate(async()=>{const m=await (await fetch('./assets/audio/voices.json')).json();return {caption:document.querySelector('[data-page="8"] .wb-voice-caption').textContent,text:m.lines['fabre09-concept'].text,src:window.__audios.at(-1).src,expected:m.lines['fabre09-concept'].file,speaking:document.querySelector('[data-page="8"] .wb-coach').classList.contains('wb-speaking')}});
  assert.equal(audio.caption,audio.text);assert.ok(audio.src.endsWith(audio.expected));assert.equal(audio.speaking,true);pass('Popcorn speaks an actual approved clip with its matching original caption');
  await page.locator('[data-workbook-page="9"]').click();assert.equal(await page.evaluate(()=>window.__audios.every(a=>a.paused)),true);pass('page navigation stops the preceding narration');
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-workbook-page="8"]').click();await page.locator('[data-page="8"] [data-book-voice]').click();
  await page.waitForFunction(()=>window.__audios.at(-1).currentTime>0&&!window.__audios.at(-1).paused);assert.equal(await page.locator('[data-page="8"] .wb-coach').getAttribute('data-audio-pose'),'talk');
  await page.locator('[data-book-voice="fabre09-concept"]').click();assert.equal(await page.evaluate(()=>window.__audios.every(a=>a.paused)),true);pass('reduced motion uses a static pose and voice can be stopped');
  for(const [num,id] of [[16,'Js6CZPD5XfE'],[17,'mmD34B3cr1I']]){
   await page.locator(`[data-workbook-page="${num}"]`).click();assert.equal(await page.locator('iframe').count(),0);await page.locator(`[data-book-video="${id}"]`).click();
   assert.match(await page.locator('.wb-video-player iframe').getAttribute('src'),new RegExp(id));assert.ok(await page.locator('.wb-video-player iframe').getAttribute('title'));
   assert.equal(await page.locator(`.wb-inline-video [href="https://www.youtube.com/watch?v=${id}"]`).getAttribute('target'),'_blank');
   await page.locator('[data-workbook-page="15"]').click();assert.equal(await page.locator('iframe').count(),0);
  }pass('both selected history video embeds have a fallback and stop on page navigation');
  assert.equal(await page.locator('.wb-history-photo img').evaluate(img=>img.complete&&img.naturalWidth===2000),true);pass('credited official palace photo decodes');
  assert.equal(await page.evaluate(()=>localStorage.getItem('qa.sentinel')),'private learner record');assert.equal(await page.evaluate(()=>localStorage.length),1);pass('standalone reading never loads or mutates learner records');
  assert.deepEqual(errors,[]);pass('no browser exceptions');
  await page.locator('[data-workbook-page="17"]').click();await page.screenshot({path:out+'/'+vp.name+'-palace.png'});
  cases.push({viewport:vp.name,checks,errors,videoLimitation:'embed, source and fallback verified; full external playback not asserted'});await context.close();
 }
 await writeFile(out+'/living-book-qa.json',JSON.stringify({base,cases,passed:cases.length,checksPassed:cases.reduce((n,c)=>n+c.checks.length,0)},null,2));console.log({passed:cases.length,checksPassed:cases.reduce((n,c)=>n+c.checks.length,0)});
}finally{await browser.close()}
