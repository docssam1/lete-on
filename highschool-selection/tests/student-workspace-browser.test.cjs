'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require('playwright');const {startServer,installApi,editions}=require('./fixtures/student-workspace.cjs');
const artifact=process.env.HIGHSELECT_UI_ARTIFACT_DIR;const liveBase=process.env.HIGHSELECT_UI_BASE;let server,browser,base;
test.before(async()=>{server=await startServer();base=liveBase||server.base;browser=await chromium.launch({headless:true});if(artifact)await fs.mkdir(artifact,{recursive:true});});
test.after(async()=>{await browser?.close();await server?.close();});
async function open(width,height=900,options={}){const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));const api=await installApi(page,options);return {page,api,errors};}
async function login(page,id='ui-workspace'){await page.goto(base+'login.html?v=student-flow-20261107&exam='+id);await page.locator('#student-name').fill('화면 검수');await page.locator('#student-code').fill('fixture-code');await page.locator('#student-login button').click();await page.locator('.exam-page.is-current img').waitFor();await page.waitForFunction(()=>!document.getElementById('print-paper').disabled);await page.evaluate(()=>document.fonts.ready);}
async function ox(page,width){if(width<=800)await page.locator('#mobile-answers').click();}
async function paper(page,width){if(width<=800)await page.locator('#mobile-paper').click();}
async function activeContrast(page,selector){
 const item=page.locator(selector);await item.hover();const ratio=await item.evaluate(e=>{const s=getComputedStyle(e),rgb=v=>v.match(/[\d.]+/g).slice(0,3).map(Number),lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0),a=lum(rgb(s.color)),b=lum(rgb(s.backgroundColor));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});assert(ratio>=4.5,'active/hover text contrast '+ratio);
}
async function shot(page,name){if(artifact)await page.screenshot({path:path.join(artifact,(liveBase?'published-fixture-':'fixture-')+name+'.png')});}
for(const [width,height] of [[1440,1000],[768,1024],[390,844],[320,700]])test(`student reading, O/X, save and result flow at ${width}`,async()=>{
 const {page,api,errors}=await open(width,height,{compact:true});try{
  await login(page);assert.equal(await page.title(),'화면 검수용 모의고사 · 공통수학1 기본 1회 | LETE-ON');
  assert.equal(await page.locator('.exam-page:visible').count(),1);assert.equal(await page.locator('#page-zoom').inputValue(),width<=800?'200':'100');assert.equal(await page.locator('#previous-page').isDisabled(),true);if(width<=800){const nav=await page.locator('.page-navigation').boundingBox(),dock=await page.locator('.mobile-workspace-nav').boundingBox();assert(nav.y+nav.height<=dock.y,'page controls covered by mobile dock');}await shot(page,'paper-'+width);
  await page.locator('#next-page').click();assert.equal(await page.locator('#page-position').innerText(),'2 / 3쪽');await page.locator('#page-select').selectOption('2');assert.equal(await page.locator('#next-page').isDisabled(),true);
  await page.locator('#page-zoom').selectOption('200');assert.equal(await page.locator('#paper-viewport').getAttribute('data-zoom'),'200');assert(await page.locator('#paper-viewport').evaluate(e=>e.scrollWidth>e.clientWidth));
  await page.locator('#view-answers').click();await page.waitForFunction(()=>document.getElementById('view-answers').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('#page-position').innerText(),'1 / 2쪽');await page.locator('#next-page').click();
  await page.locator('#view-paper').click();await page.waitForFunction(()=>document.getElementById('view-paper').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('#page-position').innerText(),'3 / 3쪽');
  await page.locator('#view-analysis').click();await page.waitForFunction(()=>document.getElementById('view-analysis').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('#page-position').innerText(),'1 / 1쪽');
  await ox(page,width);await page.locator('[name="ox-1"][value="O"]').check({force:true});await page.locator('[name="ox-2"][value="X"]').check({force:true});assert.match(await page.locator('#check-count').innerText(),/표시 2 \/ 50 · 미확인 48/);
  await page.locator('#first-unmarked').click();assert.equal(await page.evaluate(()=>document.activeElement.name),'ox-3');await shot(page,'ox-'+width);
  await paper(page,width);await page.locator('#back-library').click();await page.locator('[data-exam="ui-workspace"]').click();await page.waitForFunction(()=>document.getElementById('draft-status').textContent.includes('불러왔습니다'));await ox(page,width);assert.equal(await page.locator('[name="ox-1"][value="O"]').isChecked(),true);assert.match(await page.locator('#draft-status').innerText(),/불러왔습니다/);
  await page.locator('[data-clear="2"]').click();assert.equal(await page.locator('[name="ox-2"]:checked').count(),0);await page.locator('[name="ox-2"][value="X"]').check({force:true});
  const saveBox=await page.locator('#submit-responses').boundingBox();assert(saveBox.y+saveBox.height<=height-(width<=800?60:0),'save action outside viewport');
  await page.locator('#submit-responses').click();await page.locator('#save-confirm[open]').waitFor();assert.match(await page.locator('#save-confirm-detail').innerText(),/48문항/);await page.locator('#cancel-save').click();assert.equal(api.submissions.length,0);
  await page.locator('#submit-responses').click();await page.locator('#confirm-save').click();await page.locator('#report-view:not([hidden])').waitFor();assert.equal(api.submissions.length,1);assert.equal(api.submissions[0].method,'self-check');assert.deepEqual(api.submissions[0].responses.slice(0,3),['O','X','']);assert.equal(await page.locator('#report-content .result-items li').count(),50);
  await page.locator('[data-result-filter="wrong"]').click();await activeContrast(page,'[data-result-filter="wrong"]');assert.equal(await page.locator('.result-items li:visible').count(),1);await shot(page,'report-'+width);await page.locator('[data-result-filter="blank"]').click();assert.equal(await page.locator('.result-items li:visible').count(),48);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.deepEqual(errors,[]);
  await page.locator('#report-reopen').click();await page.waitForFunction(()=>document.getElementById('view-answers').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('#exam-title').innerText(),'화면 검수용 모의고사 · 공통수학1 기본 1회');
  await page.locator('#logout').click();await page.locator('#login-view:not([hidden])').waitFor();assert.equal(await page.locator('.exam-page').count(),0);assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).filter(k=>k.startsWith('highselect')).length),0);
 }finally{await page.close();}
});
test('22 approved edition metadata stays readable at desktop and mobile',async()=>{
 let count=0;for(const width of [1440,390]){const {page,errors}=await open(width,900);try{await page.addInitScript(()=>sessionStorage.setItem('highselectExamToken','ui-fixture-session-token'));for(const e of editions){await page.goto(base+'login.html?exam='+e.id);await page.locator('#exam-view:not([hidden])').waitFor();await page.waitForFunction(()=>!document.getElementById('print-paper').disabled);assert.equal(await page.locator('#exam-title').innerText(),e.title);const spec=await page.locator('#exam-spec').innerText();assert(spec.includes(e.questionCount+'문항'));if(e.sectionMinutes)assert(spec.includes(e.id.startsWith('wm-common1-basic-')?'대수 90분 · 기하 90분 · 휴식 20분 별도':'대수 70분 · 기하 70분 · 휴식 20분 별도'));else assert(spec.includes(e.durationMinutes+'분'));assert.equal(await page.locator('.ox-row').count(),e.questionCount);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);count++;}assert.deepEqual(errors,[]);}finally{await page.close();}}
 assert.equal(count,44);
});
test('loading retry, failed save, draft retention and empty result filters',async()=>{
 const {page,api}=await open(390,844,{compact:true});try{
  api.failImage=true;await page.goto(base+'login.html?exam=ui-workspace');await page.locator('#student-name').fill('화면 검수');await page.locator('#student-code').fill('fixture-code');await page.locator('#student-login button').click();await page.locator('#retry-pages:not([hidden])').waitFor();assert.equal(await page.locator('#print-paper').isDisabled(),true);await page.locator('#retry-pages').click();await page.waitForFunction(()=>!document.getElementById('print-paper').disabled);
  await ox(page,390);await page.locator('[name="ox-1"][value="O"]').check({force:true});api.failSubmit=true;await page.locator('#submit-responses').click();await page.locator('#confirm-save').click();await page.waitForFunction(()=>document.getElementById('save-error').textContent.length>0);assert.equal(await page.locator('#save-confirm').evaluate(e=>e.open),true);assert.equal(await page.locator('[name="ox-1"][value="O"]').isChecked(),true);assert.equal(api.submissions.length,0);
  api.failSubmit=false;await page.locator('#confirm-save').click();await page.locator('#report-view:not([hidden])').waitFor();await page.locator('[data-result-filter="wrong"]').click();await activeContrast(page,'[data-result-filter="wrong"]');assert.equal(await page.locator('#result-empty').isVisible(),true);
 }finally{await page.close();}
});
test('renewal retains page, scroll and O/X; changed edition blocks save',async()=>{
 const {page,api}=await open(1440,1000,{compact:true});try{
  await page.clock.install();await login(page);await page.locator('#next-page').click();await page.locator('[name="ox-1"][value="O"]').check({force:true});await page.locator('#paper-viewport').evaluate(e=>e.scrollTop=120);const before=api.requests.filter(a=>a==='manifest').length;await page.clock.fastForward(8*60000+10);await page.waitForFunction(()=>document.getElementById('print-paper').disabled===false);await page.waitForTimeout(30);assert(api.requests.filter(a=>a==='manifest').length>before);assert.equal(await page.locator('#page-position').innerText(),'2 / 3쪽');assert.equal(await page.locator('[name="ox-1"][value="O"]').isChecked(),true);assert.equal(await page.locator('#paper-viewport').evaluate(e=>e.scrollTop),120);
  api.versionChanged=true;await page.locator('#view-answers').click();await page.waitForFunction(()=>document.getElementById('submit-responses').disabled);assert.match(await page.locator('#message').innerText(),/변경/);
 }finally{await page.close();}
});
test('document requests cannot replace a newer selection; denied and expired sessions stay protected',async()=>{
 const {page,api}=await open(390,844,{compact:true});try{
  await login(page);api.answerDelay=250;await page.locator('#view-answers').click();await page.locator('#view-analysis').click();await page.waitForFunction(()=>document.getElementById('view-analysis').getAttribute('aria-pressed')==='true');await page.waitForTimeout(300);assert.equal(await page.locator('#view-analysis').getAttribute('aria-pressed'),'true');
  api.expired=true;await page.locator('#view-paper').click();await page.locator('#login-view:not([hidden])').waitFor();assert.equal(await page.locator('.exam-page').count(),0);assert.match(await page.locator('#message').innerText(),/다시 로그인/);api.expired=false;api.denied=true;await page.locator('#student-name').fill('화면 검수');await page.locator('#student-code').fill('fixture-code');await page.locator('#student-login button').click();await page.locator('#library-view:not([hidden])').waitFor();await page.locator('[data-exam="ui-workspace"]').click();await page.waitForFunction(()=>document.getElementById('message').textContent.includes('승인'));assert.equal(await page.locator('#exam-view').isVisible(),false);
 }finally{await page.close();}
});
test('printing uses every page of only the selected document, at A4',async()=>{
 const {page}=await open(1440,1000,{compact:true});try{await login(page);for(const [kind,count] of [['paper',3],['answers',2],['analysis',1]]){await page.locator('#view-'+kind).click();await page.waitForFunction(kind=>document.getElementById('view-'+kind).getAttribute('aria-pressed')==='true',kind);await page.waitForFunction(()=>!document.getElementById('print-paper').disabled);await page.locator('#page-zoom').selectOption('300');await page.emulateMedia({media:'print'});assert.equal(await page.locator('.exam-page:visible').count(),count);assert.equal(await page.locator('.response-panel').isVisible(),false);assert.equal(await page.locator('.reader-tools').isVisible(),false);if(artifact&&!liveBase)await page.pdf({path:path.join(artifact,'print-fixture-'+kind+'.pdf'),preferCSSPageSize:true,printBackground:true});await page.emulateMedia({media:'screen'});}}finally{await page.close();}
});
test('keyboard controls, confirmation escape, touch targets and local font',async()=>{
 const {page}=await open(390,844,{compact:true});try{
  await login(page);await activeContrast(page,'#view-paper');await page.locator('#view-answers').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.getElementById('view-answers').getAttribute('aria-pressed')==='true');await page.locator('#next-page').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#page-position').innerText(),'2 / 2쪽');
  await page.locator('#mobile-answers').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'response-title');await page.locator('[name="ox-1"][value="O"]').focus();await page.keyboard.press('Space');assert.equal(await page.locator('[name="ox-1"][value="O"]').isChecked(),true);await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[name="ox-1"][value="X"]').isChecked(),true);
  await page.locator('#submit-responses').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#save-confirm').evaluate(e=>e.open),false);await page.waitForFunction(()=>document.activeElement.id==='submit-responses');
  const small=await page.locator('button:visible,select:visible,.ox-row label span:visible').evaluateAll(nodes=>nodes.filter(n=>!n.disabled).filter(n=>{const r=n.getBoundingClientRect();return r.width<44||r.height<44;}).map(n=>n.id||n.textContent));assert.deepEqual(small,[]);assert.equal(await page.evaluate(()=>document.fonts.check('500 16px "LETE Pretendard"')),true);assert.equal(await page.evaluate(()=>getComputedStyle(document.body).fontSize),'16px');
 }finally{await page.close();}
});

test('mobile starts large and positional buttons preserve reading, marks and whole-page access',async()=>{
 const {page,errors}=await open(390,844,{compact:true});try{
  await login(page);assert.equal(await page.locator('#page-zoom').inputValue(),'200');assert.equal(await page.locator('#reader-pan').isVisible(),true);await page.locator('#next-page').click();assert((await page.locator('#paper-viewport').boundingBox()).y<220);
  await page.locator('#paper-viewport').evaluate(e=>e.scrollTop=160);await page.locator('#pan-right').click();assert.equal(await page.locator('#pan-right').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#paper-viewport').evaluate(e=>e.scrollLeft>=e.scrollWidth-e.clientWidth-1),true);assert.equal(await page.locator('#paper-viewport').evaluate(e=>e.scrollTop),160);await activeContrast(page,'#pan-right');await shot(page,'right-mobile');
  await page.locator('#page-zoom').selectOption('300');assert.equal(await page.locator('#pan-center').isVisible(),true);await page.locator('#pan-center').click();assert.equal(await page.locator('#pan-center').getAttribute('aria-pressed'),'true');await page.locator('#pan-left').click();assert.equal(await page.locator('#paper-viewport').evaluate(e=>e.scrollLeft),0);await shot(page,'left-300-mobile');
  await page.locator('#page-zoom').selectOption('100');assert.equal(await page.locator('#reader-pan').isVisible(),false);assert.equal(await page.locator('#paper-viewport').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);await page.locator('#page-zoom').selectOption('200');await page.locator('#pan-right').click();await page.locator('#next-page').click();assert.equal(await page.locator('#paper-viewport').evaluate(e=>e.scrollLeft),0);assert.equal(await page.locator('#page-zoom').inputValue(),'200');
  await ox(page,390);await page.locator('[name="ox-1"][value="X"]').check({force:true});await paper(page,390);assert.equal(await page.locator('#page-zoom').inputValue(),'200');await page.locator('#pan-right').click();await ox(page,390);assert.equal(await page.locator('[name="ox-1"][value="X"]').isChecked(),true);assert.deepEqual(errors,[]);
 }finally{await page.close();}
});

test('selected entry context is public metadata and pending courses are compact',async()=>{
 const {page,errors}=await open(390,844);try{
  await page.goto(base+'promo/#academy=DP');assert.equal(await page.locator('.course-banner.is-ready:visible').count(),1);assert.equal(await page.locator('.is-preparing:visible').count(),6);assert.equal(await page.locator('.preparing-courses').count(),0);
  await page.locator('.is-ready').click();await page.locator('#selected-course-title').waitFor();await page.evaluate(()=>document.fonts.ready);await shot(page,'compact-rounds-390');const firstRoundY=(await page.locator('.round-card').first().boundingBox()).y;assert(firstRoundY<420,'first round begins at '+firstRoundY);await page.locator('.round-card').first().click();await page.locator('#entry-selection:not([hidden])').waitFor();assert.match(await page.locator('#entry-exam-title').innerText(),/돌파/);assert.match(await page.locator('#entry-exam-spec').innerText(),/150분/);assert.equal(await page.locator('#entry-course-back').getAttribute('href'),'./promo/#academy=DP&course=common1-basic');await shot(page,'selected-login-390');
  await page.locator('#entry-course-back').click();assert.equal(await page.locator('.round-card').count(),2);await page.goto(base+'login.html?exam=unknown');assert.equal(await page.locator('#entry-selection').isVisible(),false);assert.deepEqual(errors,[]);
 }finally{await page.close();}
});
for(const width of [1440,390,320])test(`back, reload, exact reading position and O/X drafts at ${width}`,async()=>{
 const {page,api,errors}=await open(width,900,{compact:true});try{
  await login(page);await page.locator('#next-page').click();await page.locator('#page-zoom').selectOption('300');await page.locator('#pan-right').click();await page.locator('#paper-viewport').evaluate(e=>e.scrollTop=140);await ox(page,width);await page.locator('[name="ox-1"][value="O"]').check({force:true});await paper(page,width);
  await page.locator('#view-answers').click();await page.waitForFunction(()=>document.getElementById('view-answers').getAttribute('aria-pressed')==='true');await page.locator('#next-page').click();await page.locator('#paper-viewport').evaluate(e=>e.scrollTop=90);
  await page.locator('#view-paper').click();await page.waitForFunction(()=>document.getElementById('view-paper').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('#page-position').innerText(),'2 / 3쪽');assert.equal(await page.locator('#page-zoom').inputValue(),'300');assert.equal(await page.locator('#paper-viewport').evaluate(e=>e.scrollTop),140);assert.equal(await page.locator('#pan-right').getAttribute('aria-pressed'),'true');
  await page.goBack();await page.locator('#library-view:not([hidden])').waitFor();await page.goForward();await page.locator('#exam-view:not([hidden])').waitFor();await page.waitForFunction(()=>document.getElementById('print-paper').disabled===false);assert.equal(await page.locator('#page-position').innerText(),'2 / 3쪽');await ox(page,width);assert.equal(await page.locator('[name="ox-1"][value="O"]').isChecked(),true);await paper(page,width);
  await page.reload();await page.locator('#exam-view:not([hidden])').waitFor();await page.waitForFunction(()=>document.getElementById('print-paper').disabled===false);assert.equal(await page.locator('#page-position').innerText(),'2 / 3쪽');assert.equal(await page.locator('#page-zoom').inputValue(),'300');await ox(page,width);assert.equal(await page.locator('[name="ox-1"][value="O"]').isChecked(),true);
  await page.locator('#submit-responses').click();await page.locator('#confirm-save').click();await page.locator('#saved-result-status:not([hidden])').waitFor();assert.equal(api.submissions.length,1);for(const label of await page.locator('.domain-summary li>span').all()){const box=await label.boundingBox();assert(box.height<36,'domain label remains horizontal');}await shot(page,'saved-domains-'+width);await page.goBack();await page.locator('#exam-view:not([hidden])').waitFor();await page.goForward();await page.locator('#report-view:not([hidden])').waitFor();assert.equal(api.submissions.length,1);await page.reload();await page.locator('#report-view:not([hidden])').waitFor();assert.equal(api.submissions.length,1);assert.deepEqual(errors,[]);
 }finally{await page.close();}
});
test('save is single-flight and late reply cannot interrupt a different view',async()=>{
 const {page,api}=await open(390,844,{compact:true});try{
  await login(page);await ox(page,390);await page.locator('[name="ox-1"][value="X"]').check({force:true});api.submitDelay=300;await page.locator('#submit-responses').click();await page.locator('#confirm-save').click();assert.equal(await page.locator('[name="ox-1"]').first().isDisabled(),true);await page.keyboard.press('Escape');await page.locator('#back-library').click();await page.locator('#library-view:not([hidden])').waitFor();await page.waitForTimeout(450);assert.equal(await page.locator('#library-view').isVisible(),true);assert.equal(api.submissions.length,1);assert.equal(await page.locator('[data-result]').count(),1);
 }finally{await page.close();}
});

test('all academy courses keep actual round links and readable layouts at four widths',async()=>{
 require('../data/academy-engagement.js');const programs=globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT.programs;const nav=require('../promo/course-navigation.js');
 for(const width of [1440,768,390,320]){const {page,errors}=await open(width,900);try{
  for(const program of programs){for(const course of nav.coursesFor(program,editions).filter(c=>c.exams.length)){
   await page.goto(base+'promo/#academy='+program.code+'&course='+course.id);await page.waitForFunction(label=>document.getElementById('selected-course-title')?.textContent===label,course.label);await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.round-card').count(),course.exams.length);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,program.code+' '+width);const links=await page.locator('.round-card').evaluateAll(nodes=>nodes.map(n=>new URL(n.href).searchParams.get('exam')));assert.deepEqual(links,course.exams.map(e=>e.id));
   if(width===320&&program.code==='WM')await shot(page,'wonmath-long-time-320');
  }}assert.deepEqual(errors,[]);
 }finally{await page.close();}}
});

test('saved O/X survives a page reload and reopening the same edition',async()=>{
 const {page}=await open(390,844,{compact:true});try{
  await login(page);await ox(page,390);await page.locator('[name="ox-1"][value="O"]').check();await page.locator('[name="ox-2"][value="X"]').check();
  await page.locator('#submit-responses').click();await page.locator('#confirm-save').click();await page.locator('#report-view:not([hidden])').waitFor();
  await page.reload();await page.locator('#report-view:not([hidden])').waitFor();await page.locator('#report-reopen').click();await page.locator('#exam-view:not([hidden])').waitFor();await ox(page,390);
  assert.equal(await page.locator('[name="ox-1"][value="O"]').isChecked(),true);
  assert.equal(await page.locator('[name="ox-2"][value="X"]').isChecked(),true);
  assert.match(await page.locator('#check-count').innerText(),/표시 2 \/ 50 · 미확인 48/);
 }finally{await page.close();}
});

test('an unsaved O/X draft takes priority over the saved result',async()=>{
 const {page}=await open(390,844,{compact:true});try{
  await login(page);await ox(page,390);await page.locator('[name="ox-1"][value="O"]').check();await page.locator('[name="ox-2"][value="X"]').check();await page.locator('#submit-responses').click();await page.locator('#confirm-save').click();await page.locator('#report-view:not([hidden])').waitFor();await page.locator('#report-reopen').click();await ox(page,390);
  await page.locator('[data-clear="1"]').click();await page.reload();await page.locator('#exam-view:not([hidden])').waitFor();await ox(page,390);
  assert.equal(await page.locator('[name="ox-1"]:checked').count(),0);assert.equal(await page.locator('[name="ox-2"][value="X"]').isChecked(),true);
 }finally{await page.close();}
});

test('saved restoration excludes another edition, another exam, automatic grading and incomplete rows',async()=>{
 for(const invalid of ['version','exam','grading','rows']){
  const {page,api}=await open(390,844,{compact:true});try{
   const report={exam:{id:'ui-workspace',version:'ui-v1',title:'검수 기록'},gradingMethod:'self-reported',correctCount:1,wrongCount:0,blankCount:49,reviewCount:0,total:50,domains:[],items:Array.from({length:50},(_,i)=>({number:i+1,state:i?'blank':'correct'}))};
   if(invalid==='version')report.exam.version='old-edition';if(invalid==='exam')report.exam.id='another-exam';if(invalid==='grading')report.gradingMethod='automatic';if(invalid==='rows')report.items.pop();api.attempts=[{id:'saved-fixture',report}];
   await login(page);await ox(page,390);assert.equal(await page.locator('#response-fields input:checked').count(),0,invalid);
  }finally{await page.close();}
 }
});
