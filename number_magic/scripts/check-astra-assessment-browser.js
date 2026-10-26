#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..');
const server=http.createServer((req,res)=>{
 const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');
 let text=fs.readFileSync(file);
 if(file.endsWith('/app/exam.js'))text=text.toString().replace('window.NM_EXAM = NM_EXAM;','window.NM_EXAM = NM_EXAM;window.__assessmentQA={buildProblems,runSessionTabs,gridCellHtml,scatterPlotHtml,withC0,w2ExampleBodyHtml,w2GuidedHtml};');
 res.end(text);
});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1100,height:1400}});
 await page.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());
 await page.goto(origin+'/number_magic/ws.html?c=C0&s=19&w=2026-W43&auto=0&p=1');
 await page.waitForFunction(()=>window.NM_WS_READY===true);
 await page.emulateMedia({media:'print'});
 await page.evaluate(async()=>{await window.NM_LAST_PRINT_READY;await document.fonts.ready;await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})));await new Promise(requestAnimationFrame);});
 const print=await page.evaluate(()=>({
  questions:document.querySelectorAll('.nm-print-sheet .nm-w2-item').length,
  answers:document.querySelectorAll('.nm-print-sheet .nm-ak-item').length,
  beads:document.querySelectorAll('.nm-print-sheet .nm-c0-concrete').length,
  missingImages:[...document.querySelectorAll('.nm-c0-concrete img')].filter(im=>!im.naturalWidth).length,
  overflow:[...document.querySelectorAll('.nm-print-sheet .nm-w2-page,.nm-print-sheet .nm-w2-item')].filter(el=>el.scrollHeight>el.clientHeight+3||el.scrollWidth>el.clientWidth+3).map(el=>el.className)
 }));
 assert.equal(print.questions,60);assert.equal(print.answers,60);assert.equal(print.beads,4);assert.equal(print.missingImages,0);assert.deepEqual(print.overflow,[]);
 await page.emulateMedia({media:'screen'});
 const assertions=await page.evaluate(()=>{
  let checks=0;const eq=(a,b)=>{checks++;if(a!==b)throw Error(JSON.stringify([a,b]));};
  const match=NM_EXAM.matchesAnswer;
  for(const [raw,answer,want] of [['3/2',3,false],['3abc',3,false],['3,4x',[3,4],false],['',0,false],[' ',0,false],['Infinity',Infinity,false],['1.50',1.5,true],['-.5',-.5,true],['3.',3,true],[' 3, -4 ',[3,-4],true]])eq(match(raw,answer),want);
  const p=__assessmentQA.buildProblems('MD87',1,1,NM_RNG.hashSeed('astraplot'))[0];
  eq(p.scatterPlot.mode,'plot');eq(match('6',p.answer,p),false);
  eq(match(JSON.stringify(p.scatterPlot.points.slice().reverse()),p.answer,p),true);
  eq(match(JSON.stringify(p.scatterPlot.points.slice(1)),p.answer,p),false);
  document.body.innerHTML='<main id="qa"></main>';window.__qaResult=null;
  NM_EXAM.runExam({thread:'MD87',level:1,count:1,timer:0,seed:'astraplot'},document.querySelector('#qa'),r=>window.__qaResult=r);
  window.__qaPoints=p.scatterPlot.points;return checks;
 });
 assert.equal(await page.locator('.nm-scatter-answer').count(),1);
 assert.equal(await page.locator('#nm-ex-ans').isVisible(),false);
 assert.equal(await page.locator('.nm-scatter-graph .nm-gp-pt').count(),0);
 for(const [x,y] of await page.evaluate(()=>__qaPoints)){
  await page.locator('[data-scatter-x]').fill(String(x));await page.locator('[data-scatter-y]').fill(String(y));await page.locator('[data-scatter-add]').click();
 }
 assert.equal(await page.locator('.nm-scatter-graph .nm-gp-pt').count(),6);
 await page.locator('#nm-ex-submit').click();assert.equal(await page.evaluate(()=>__qaResult.score),1);
 // Sequential input used to parseFloat before the shared grader: exercise it.
 await page.evaluate(()=>{__qaResult=null;NM_EXAM.runExam({thread:'AD1',level:1,count:1,timer:0,seed:'badinput'},document.querySelector('#qa'),r=>__qaResult=r);});
 const answer=await page.evaluate(()=>__assessmentQA.buildProblems('AD1',1,1,NM_RNG.hashSeed('badinput'))[0].answer);
 await page.locator('#nm-ex-ans').fill(answer+'oops');await page.locator('#nm-ex-submit').click();
 assert.equal(await page.evaluate(()=>__qaResult.score),0);
 assert.equal(await page.evaluate(()=>__qaResult.answers[0]),answer+'oops');
 // Tabbed worksheet uses the same real coordinates rather than the old count.
 await page.evaluate(()=>__assessmentQA.runSessionTabs(document.querySelector('#qa'),[{thread:'MD87',level:1,count:1,seed:'astraplot',noTeach:true}],{count:1}));
 for(const [x,y] of await page.evaluate(()=>__qaPoints)){
  await page.locator('[data-scatter-x]').fill(String(x));await page.locator('[data-scatter-y]').fill(String(y));await page.locator('[data-scatter-add]').click();
 }
 await page.locator('#nm-ws-grade').click();assert.match(await page.locator('.nm-grid-score').innerText(),/1\/1/);
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.querySelector('.nm-scatter-answer').scrollWidth<=document.querySelector('.nm-scatter-answer').clientWidth+1),true);
 console.log(`PASS: C0 round19 A4 60 questions/60 keys, four PNG bead models and overflow0; ${assertions} answer contracts; actual sequential and tabbed plotting; malformed sequential answer rejected; mobile controls.`);
 }finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
