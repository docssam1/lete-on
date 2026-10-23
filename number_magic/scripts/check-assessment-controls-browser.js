'use strict';
// Exercise online answers, explicit paper entry, resume, reset and separate achievement history.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_ASSESSMENT_ARTIFACTS||'/tmp/nm-assessment-controls-20261023';
const bridge=`window.__ASSESS={reset:()=>{checkAttendance();S._diag=NM_PLACEMENT_UI.initial();assessmentChooseMethod=false;S.placement={course:'C5',session:1,self:true,baselineId:'c5'};S.achievementChecks=[];S.view='placement';render();},start:()=>startPlacement(),state:()=>JSON.parse(JSON.stringify({run:S._diag,placement:S.placement,checks:S.achievementChecks,age:S.schoolAge,coins:S.coins,progress:S.progress,speed:S.roadSpeed,amount:S.roadAmount}))};`;
const server=http.createServer((req,res)=>{
 const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!f.startsWith(ROOT+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');
 let s=fs.readFileSync(f);if(f.endsWith('/app/main.js')){s=s.toString();const i=s.lastIndexOf('\n})();');s=s.slice(0,i)+bridge+s.slice(i);}res.end(s);
});
async function answer(p){
 const item=await p.evaluate(()=>{const d=__ASSESS.state().run;return d.plan.items[d.index];});
 const fields=p.locator('.pd-answer');
 if(await fields.count()){const values=Array.isArray(item.answer)?item.answer:[item.answer];for(let i=0;i<values.length;i++)await fields.nth(i).fill(String(values[i]));}
 else if(item.responseMode==='count-tap'){for(let i=0;i<item.renderData.items.length;i++)if(item.renderData.items[i].target)await p.click('[data-tap="'+i+'"]');}
 else if(item.responseMode==='make'){for(let i=0;i<item.answer;i++)await p.click('#pdAdd');}
 else await p.click('[data-choice="'+item.answer+'"]');
 await p.click('#pdSubmit');
}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const b=await chromium.launch({args:['--disable-webgl','--disable-webgl2']}),report=[];
 try{for(const [width,lang,band,baseline]of [[390,'ko','middle','c29'],[1280,'ko','high','c41'],[390,'en','foundation','f-split9'],[390,'zh','middle','c32']].filter(([w,l])=>!process.env.NM_ASSESSMENT_CASE||process.env.NM_ASSESSMENT_CASE===w+'-'+l)){
  const c=await b.newContext({viewport:{width,height:850},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
  await c.route('**/functions/v1/nm-review',r=>r.fulfill({json:{scope:'learning_review',username:'assessment-fixture',token:'a'.repeat(64),expiresAt:new Date(Date.now()+7200000).toISOString()}}));
  await p.goto(base+'/number_magic/access.html?lang='+lang);await p.click('#open-book');await p.fill('#login-user','assessment-fixture');await p.fill('#login-password','fixture-only');await p.click('#login-submit');await p.waitForFunction(()=>window.__ASSESS&&document.querySelector('#nmReviewLogout'));await p.evaluate(()=>__ASSESS.reset());
  await p.selectOption('#pdAge','10');await p.selectOption('#pdGrade','e3');await p.selectOption('#pdStudyBand',band);await p.selectOption('#pdBaseline',baseline);
  const keep=await p.evaluate(()=>__ASSESS.state());
  assert.equal(await p.locator('#pdPrintOptions').getAttribute('open'),null);assert(await p.locator('#pdPaperAnswers').isHidden());
  assert.equal(await p.locator('[data-purpose]').count(),2);await p.screenshot({path:path.join(OUT,width+'-'+lang+'-setup.png'),fullPage:true});
  await p.click('#pdStart');assert.equal(await p.locator('.pd-mark-row').count(),0);assert(await p.locator('#pdSubmit').isVisible());await answer(p);
  const active=await p.evaluate(()=>__ASSESS.state().run);assert.equal(active.responses.length,1);
  await p.click('#pdRetry');await p.locator('dialog [data-cancel]').click();assert.deepEqual(await p.evaluate(()=>__ASSESS.state().run),active,'cancel preserves current attempt');
  await p.click('#pdRetry');await p.locator('dialog [data-confirm]').click();let st=await p.evaluate(()=>__ASSESS.state());assert.equal(st.run.responses.length,0);assert.notEqual(st.run.seed,active.seed);assert.equal(st.run.selection.baselineId,baseline);assert.equal(st.run.phase,'setup');
  await p.click('#pdPrintOptions summary');await p.click('#pdPaperAnswers');await p.locator('[data-mark=o]').first().click();const paper=await p.evaluate(()=>__ASSESS.state().run);
  if(width===390&&lang==='ko'){
   await p.reload();await p.waitForSelector('#pdResumeOnline,#open-book');
   if(await p.locator('#open-book').isVisible()){await p.click('#open-book');await p.fill('#login-user','assessment-fixture');await p.fill('#login-password','fixture-only');await p.click('#login-submit');await p.waitForFunction(()=>window.__ASSESS&&document.querySelector('#nmReviewLogout'));await p.locator('.nm-title3d [data-id="diag"]:visible,#ttDiag:visible').first().click();}
  }else{await p.click('#pdBack');await p.evaluate(()=>__ASSESS.start());}
  await p.waitForSelector('#pdResumeOnline');assert.equal(await p.locator('.pd-mark-row').count(),0,'re-entry asks how to continue, never defaults to O/X');
  assert.deepEqual((await p.evaluate(()=>__ASSESS.state().run)).plan,paper.plan);await p.click('#pdResumeOnline');assert(await p.locator('#pdSubmit').isVisible());await p.click('#pdQuestionPaper');assert.deepEqual((await p.evaluate(()=>__ASSESS.state().run)).paperMarks,paper.paperMarks);
  await p.click('#pdReset');await p.locator('dialog [data-confirm]').click();st=await p.evaluate(()=>__ASSESS.state());assert.equal(st.run.phase,'setup');assert.equal(st.run.plan,null);assert.deepEqual(st.run.selection.completedBooks,[]);assert.equal(st.run.selection.baselineId,'');assert.equal(st.run.selection.profileGrade,'e3');assert.equal(st.run.selection.birthYear,keep.run.selection.birthYear);assert.deepEqual(st.placement,keep.placement);
  await p.click('[data-purpose=achievement]');await p.selectOption('#pdStudyBand',band);await p.selectOption('#pdBaseline',baseline);await p.click('#pdStart');
  for(let i=0;i<20;i++)await answer(p);
  await p.waitForSelector('.pd-check-history');st=await p.evaluate(()=>__ASSESS.state());assert.equal(st.run.result.correct,20);assert.equal(st.checks.length,1);assert.equal(st.checks[0].bands.current.correct,10);assert.equal(st.checks[0].source,'online');assert.equal(await p.locator('.pd-calendar').count(),0);assert.deepEqual(st.placement,keep.placement,'achievement cannot replace placement');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.locator('.pd-header').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(OUT,width+'-'+lang+'-achievement.png')});
  // A subsequent parent-marked check remains explicitly labelled and separate.
  await p.click('#pdAgain');await p.locator('dialog [data-confirm]').click();await p.click('#pdPrintOptions summary');await p.click('#pdPaperAnswers');await p.click('#pdPaperForm button[type=submit]');await p.waitForSelector('.pd-check-history');st=await p.evaluate(()=>__ASSESS.state());assert.equal(st.checks.length,2);assert.equal(st.checks[1].source,'paper-marks');assert.equal(st.checks[1].profile.filter(x=>x.skipped).length,20);assert.equal(await p.locator('.pd-check-history li').count(),2);
  assert.deepEqual(st.placement,keep.placement);assert.deepEqual(st.progress,keep.progress);assert.equal(st.coins,keep.coins);assert.equal(st.speed,keep.speed);assert.equal(st.amount,keep.amount);assert.deepEqual(errors,[]);
  await p.click('#pdAgain');await p.locator('dialog [data-confirm]').click();assert.equal(await p.locator('.pd-check-history li').count(),2,'saved checks are accessible before taking another test');
  report.push({width,lang,baseline,onlineCorrect:20,retryAndReset:true,resumeChoice:true,paperDraftPreserved:true,separateAchievementHistory:true,noLearningMutation:true,externalWrites:0});console.log('CASE_OK '+width+' '+lang);await c.close();
 }fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2));console.log('ASSESSMENT_CONTROLS_OK '+JSON.stringify(report));}
 finally{await b.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
