#!/usr/bin/env node
'use strict';
/* Advertising-only language acceptance. Genuine local media and WebGL; no lesson
 * generators are modified. Reuse the same repository-root server and fit checks. */
const assert=require('assert/strict'),fs=require('fs');
const {server,chromium,OUT,expectView,route,imageReady,fit,watch,screenshot,filmLayout,coverReadability}=require('./check-promo-book');
const LANGS=['ko','en','zh'];
const NAV={ko:['영상','발견','체험','마을','학습지','로드맵'],en:['Film','Discover','Labs','Village','Practice','Journey'],zh:['视频','发现','实验','村庄','学习单','路线']};
const NOTE={en:{video:'Original film in Korean',sample:'Original worksheet samples in Korean'},zh:{video:'韩语原版视频',sample:'韩语原版学习单节选'}};
async function learningState(page){return page.evaluate(()=>({book:NMPromoBook.getState(),experiments:Object.fromEntries(Object.entries(NMPromoBook.experience()).map(([k,v])=>[k,v?.getState()||null])),storage:Object.fromEntries(Object.entries(localStorage).filter(([k])=>k!=='nmLang'))}));}
async function choose(page,lang){
  await page.waitForFunction(()=>Object.values(NMPromoBook.experience()).every(v=>!v||v.getState().renderer!=='loading'));
  const before=await learningState(page),url=new URL(page.url());
  await page.locator('[data-promo-language]:visible').selectOption(lang);
  await page.waitForFunction(lang=>NMPromoI18n.getLanguage()===lang&&document.documentElement.dataset.promoLang===lang,lang);
  assert.deepEqual(await learningState(page),before,'Language changes presentation, never the current chapter, sample or experiment state');
  const after=new URL(page.url());assert.equal(after.hash,url.hash,'Language preserves chapter hash');assert.equal(after.searchParams.get('lang'),lang);assert.equal(after.searchParams.get('qa'),url.searchParams.get('qa'),'Other URL parameters remain intact');
  assert.equal(await page.evaluate(()=>localStorage.getItem('nmLang')),lang);
  assert.deepEqual(await page.locator('[data-promo-language]').evaluateAll(nodes=>nodes.map(n=>n.value)),[lang,lang]);
  assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':lang);
  assert.deepEqual(await page.locator('.chapter-nav [data-route]').allTextContents(),NAV[lang]);
}
async function languageFit(page,lang,label){
  await fit(page,label);
  const issues=await page.evaluate(lang=>{
    const issues=[],visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&!el.closest('[hidden],[inert],[aria-hidden="true"]');};
    for(const el of document.querySelectorAll('button,select,h1,h2,h3,.cover-kicker,.cover-edition,.cover-name-ko,.open-hint,.promo-language-note,.nm-experience__instruction,.nm-experience__feedback')){
      if(!visible(el)||el.matches('.closed-book,.skip-link,.t3d-lab')||el.closest('.cover-opening-stage,.nm-curl-overlay'))continue;
      const r=el.getBoundingClientRect(),name=el.id||el.className||el.tagName;
      if(r.left<-.8||r.right>innerWidth+.8||r.top<-.8||r.bottom>innerHeight+.8)issues.push({name,why:'viewport'});
      if(el.clientWidth&&el.scrollWidth>el.clientWidth+2)issues.push({name,why:'text overflows its own width',scroll:el.scrollWidth,width:el.clientWidth});
      if(lang!=='ko'&&el.tagName!=='SELECT'&&/[가-힣]/.test(el.textContent))issues.push({name,why:'untranslated visible Korean',text:el.textContent});
    }
    if(lang!=='ko'){
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
      while((node=walker.nextNode())){const el=node.parentElement;if(!el||!visible(el)||el.closest('script,style,noscript,select,option,.t3d-lab'))continue;if(/[가-힣]/.test(node.textContent))issues.push({name:el.id||el.className||el.tagName,why:'untranslated visible text node',text:node.textContent});}
      for(const el of document.querySelectorAll('[aria-label],[alt],[title]')){if(!visible(el)||el.matches('[data-promo-language]')||el.closest('.t3d-lab'))continue;for(const attr of ['aria-label','alt','title'])if(/[가-힣]/.test(el.getAttribute(attr)||''))issues.push({name:el.id||el.className||el.tagName,why:'untranslated accessible '+attr,text:el.getAttribute(attr)});}
    }
    return issues;
  },lang);
  if(issues.length)await screenshot(page,label+'-FAIL');assert.deepEqual(issues,[],label+' translated text and controls must fit');
}
async function note(page,lang,kind){const locator=page.locator('[data-media-note="'+kind+'"]');assert.equal(await locator.count(),1);if(lang==='ko')assert.equal(await locator.isVisible(),false);else{assert.equal(await locator.innerText(),NOTE[lang][kind]);assert.equal(await locator.isVisible(),true,'Untranslated original media must be clearly disclosed');}}
async function checkLanguage(page,lang,label){
  await choose(page,lang);await coverReadability(page);await languageFit(page,lang,label+'-cover');await screenshot(page,label+'-cover');
  await page.locator('#openBook').click();await expectView(page,'video');await filmLayout(page,'full',label);await note(page,lang,'video');await languageFit(page,lang,label+'-video');await screenshot(page,label+'-video');
  await page.locator('#introVideo').evaluate(v=>v.pause());await page.waitForFunction(()=>!document.querySelector('#cinemaPlay').hidden);assert.equal(await page.locator('#playToggle').getAttribute('aria-label'),{ko:'재생',en:'Play',zh:'播放'}[lang]);
  await route(page,'menu');await page.waitForFunction(()=>NMPromoBook.experience().hero?.getState().renderer==='webgl');await page.locator('#heroExperience [data-xp-action="split"][data-xp-value="1"]').click();await languageFit(page,lang,label+'-discovery');await screenshot(page,label+'-discovery');
  await route(page,'labs');await page.waitForFunction(()=>{const e=NMPromoBook.experience();return e.lab?.getState().renderer==='webgl'&&e.highLab?.getState().renderer==='webgl';});
  const mobile=await page.evaluate(()=>matchMedia('(max-width:700px)').matches);
  for(const mode of ['middle','high']){if(mobile)await page.locator('[data-lab-select="'+mode+'"]').click();const host=mode==='middle'?'#labExperience':'#highLabExperience';await page.locator(host+' [data-xp-action="'+(mode==='middle'?'sign':'divisions')+'"][data-xp-value="'+(mode==='middle'?'-6':'32')+'"]').click();await languageFit(page,lang,label+'-labs-'+mode);await screenshot(page,label+'-labs-'+mode);}
  // Re-translation after interaction must not reset either independent model.
  await choose(page,LANGS[(LANGS.indexOf(lang)+1)%3]);await choose(page,lang);
  assert.equal(await page.evaluate(()=>NMPromoBook.experience().lab.getState().k),-6);assert.equal(await page.evaluate(()=>NMPromoBook.experience().highLab.getState().divisions),32);
  await route(page,'worksheet');for(const mode of ['preschool','elementary','middle','high']){await page.locator('[data-sample="'+mode+'"]').click();await imageReady(page,'#sampleCover');await note(page,lang,'sample');await languageFit(page,lang,label+'-sample-'+mode);}
  await page.locator('[data-sample="elementary"]').click();await page.locator('#openSamples').click();await imageReady(page,'#sheetA');await page.locator('#sheetNext').click();await imageReady(page,'#sheetA');const sample=await page.locator('#sheetA').getAttribute('src');await choose(page,LANGS[(LANGS.indexOf(lang)+1)%3]);await choose(page,lang);assert.equal(await page.locator('#sheetA').getAttribute('src'),sample,'Translating does not change the original sample or current page');await languageFit(page,lang,label+'-sample-reader');await screenshot(page,label+'-sample-reader');
  await route(page,'roadmap');assert.equal(await page.locator('.roadmap-stop').count(),7);for(let i=0;i<7;i++){await page.locator('.roadmap-stop').nth(i).click();await languageFit(page,lang,label+'-stage-'+i);}await page.locator('#allCourses').click();assert.equal(await page.locator('.course-row').count(),46);const canonical=await page.evaluate(lang=>NM_COURSE_SPEC.map(s=>({id:String(s.id),title:s.title[lang]||s.title.ko})),lang);assert.deepEqual(await page.locator('.course-row').evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.course,title:n.querySelector('b').textContent}))),canonical,'Translated course list retains all 46 canonical IDs and labels');await languageFit(page,lang,label+'-roadmap');await screenshot(page,label+'-roadmap');await page.locator('#allCourses').click();await page.locator('#roadmapPlay').click();assert.equal(await page.locator('#roadmapPlay').getAttribute('aria-pressed'),'true');await languageFit(page,lang,label+'-roadmap-playing');await page.locator('#roadmapPlay').click();
  await route(page,'village');const frame=page.frameLocator('#villageFrame');await frame.locator('html[data-renderer="webgl"][data-active="true"]').waitFor({timeout:20000});await page.waitForFunction(lang=>{const d=document.querySelector('#villageFrame').contentDocument;return d&&d.documentElement.lang===(lang==='zh'?'zh-CN':lang);},lang);const child=page.frames().find(f=>/\/promo\/village\.html/.test(f.url()));await languageFit(child,lang,label+'-village');await frame.locator('[data-stop="paper"]').click();await languageFit(child,lang,label+'-village-paper');await screenshot(page,label+'-village');await frame.locator('#tourAction').click();await expectView(page,'worksheet');await page.locator('#bookHome').click();await expectView(page,'cover');
  return{language:lang,chapters:6,independentExperiments:2,originalMediaDisclosed:true,canonicalCourses:46,studyStatePreserved:true};
}
async function persistence(browser,base){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage(),clean=watch(page);
  try{await page.goto(base+'?qa=preserve#labs');await expectView(page,'labs');await page.evaluate(()=>{localStorage.setItem('qa-student-progress',JSON.stringify({course:17,completed:[1,3,7]}));});await choose(page,'zh');await page.reload();await expectView(page,'labs');assert.equal(await page.evaluate(()=>NMPromoI18n.getLanguage()),'zh');assert.equal(new URL(page.url()).hash,'#labs');await page.goto(base+'?qa=preserve#worksheet');await expectView(page,'worksheet');assert.equal(await page.evaluate(()=>NMPromoI18n.getLanguage()),'zh','Stored language works without a query override');await page.goto(base+'?lang=en&qa=preserve#roadmap');await expectView(page,'roadmap');assert.equal(await page.evaluate(()=>NMPromoI18n.getLanguage()),'en','Explicit language query wins over stored preference');assert.equal(await page.evaluate(()=>localStorage.getItem('qa-student-progress')),'{"course":17,"completed":[1,3,7]}');const snapshot=await learningState(page);assert.equal(await page.evaluate(()=>NMPromoI18n.setLanguage('invalid')),false);assert.deepEqual(await learningState(page),snapshot);clean();return{reload:true,storedPreference:true,queryPrecedence:true,studentProgressUntouched:true};}finally{await context.close();}
}
module.exports={checkLanguage,persistence};
if(require.main===module)(async()=>{if(OUT)fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{browser=await chromium.launch({headless:true});const base='http://127.0.0.1:'+server.address().port+'/number_magic/promo/',results=[];for(const [width,height]of[[1366,768],[390,844],[844,390],[320,740]]){const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage(),clean=watch(page);try{await page.goto(base+'?qa=preserve');await expectView(page,'cover');for(const lang of LANGS){results.push({viewport:[width,height],...await checkLanguage(page,lang,width+'x'+height+'-'+lang)});console.log('PASS '+width+'x'+height+' '+lang);}clean();}finally{await context.close();}}const state=await persistence(browser,base);console.log(JSON.stringify({ok:true,results,persistence:state},null,2));}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
