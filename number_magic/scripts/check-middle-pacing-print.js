#!/usr/bin/env node
'use strict';
// Real 190mm print body, then actual roadmap → preview → reroll → print → close.
// Produces JSON/PNG evidence only; deliberately never calls page.pdf().
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..'),out=process.env.NM_CONCEPT_ARTIFACTS;
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(res);
});
const report={sets:[],screens:[],failures:[],errors:[]};
function inspectSheet(){
  const s=document.querySelector('.nm-print-sheet');if(!s)throw Error('Missing printed sheet');
  const bad=[],rectData=r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height});
  for(const e of s.querySelectorAll('.nm-w2-page,.nm-w2-head-run,.nm-w2-head-top,.nm-mid-concept,.nm-w2-example,.nm-w2-item,.nm-draw-grid,.nm-draw-table,.nm-draw-lesson,.nm-draw-example,.nm-ak-grid,.nm-draw-key-item')){
    const rect=e.getBoundingClientRect(),parent=e.closest('.nm-w2-page'),pageRect=parent&&parent.getBoundingClientRect();
    if(e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3||(pageRect&&(rect.bottom>pageRect.bottom+3||rect.left<pageRect.left-3||rect.right>pageRect.right+3)))
      bad.push({cls:e.className,text:e.textContent.slice(0,110),w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight,rect:rectData(rect),page:pageRect&&rectData(pageRect)});
  }
  const drawing=s.querySelectorAll('.nm-draw-practice .nm-draw-item');
  for(const e of drawing){
    if(e.querySelector('.nm-gp-curve,.nm-gp-pt'))bad.push({reason:'Student drawing graph leaks curve or point'});
    const rows=e.querySelectorAll('.nm-draw-table tr');
    if(rows.length!==2||rows[1].querySelectorAll('td').length===0)bad.push({reason:'Student drawing y table missing'});
    else if([...rows[1].querySelectorAll('td')].some(td=>td.textContent.trim()!==''))bad.push({reason:'Student drawing table leaks y answer'});
  }
  const practice=[...s.querySelectorAll('.nm-w2-page')].map(e=>e.querySelectorAll('.nm-w2-item').length).filter(Boolean);
  if(practice.some(n=>n<6))bad.push({reason:'Practice page has fewer than six questions',practice});
  return {questions:s.querySelectorAll('.nm-w2-item').length,numericKeys:s.querySelectorAll('.nm-ak-item').length,
    drawingQuestions:drawing.length,drawingKeys:s.querySelectorAll('.nm-draw-key-item').length,
    pages:s.querySelectorAll('.nm-w2-page').length,katexErrors:s.querySelectorAll('.katex-error').length,
    scratch:s.querySelectorAll('[class*="nm-w2-scratch"]').length,legacySolve:localStorage.getItem('nm_ws_solve'),practice,bad};
}
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  if(out)fs.mkdirSync(out,{recursive:true});
  try{
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1100,height:1100}});
    page.setDefaultTimeout(45000);
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    page.on('pageerror',e=>report.errors.push(e.message));
    await page.addInitScript(()=>{
      window.NM_NO_AUTOPRINT=true;window.__printCalls=0;window.print=()=>{window.__printCalls++;};
      // A previous ordinary worksheet's sparse solve-mode preference must not
      // reduce the planned session, and must remain untouched after printing.
      localStorage.setItem('nm_ws_solve','1');
      localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'진도 검수',view:'courseroad',avatar:{kind:'boy'},cloudLinked:false,progress:{},account:{status:'active'},placement:{course:'C29',self:true},roadCadence:'w2'}));
    });
    const url='http://127.0.0.1:'+server.address().port;
    await page.goto(url+'/drill.html',{waitUntil:'networkidle',timeout:60000});
    await page.waitForFunction(()=>window.NM_EXAM&&window.NM_MIDDLE_PACING);
    await page.emulateMedia({media:'print'});
    const style=await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    const targets=await page.evaluate(()=>Object.values(NM_MIDDLE_PACING.grades).flatMap(p=>p.sessions.map(s=>({grade:p.grade,id:s.id,
      questions:s.blocks.reduce((n,b)=>n+b.n,0),numericKeys:s.blocks.filter(b=>b.kind!=='drawing').reduce((n,b)=>n+b.n,0),drawingKeys:s.blocks.filter(b=>b.kind==='drawing').reduce((n,b)=>n+b.n,0)}))));
    /* 2026-09-25: 보기는 정규 과정에서 계산 — 회차 수도 데이터에서(옛 판은 42 고정) */
    assert.equal(targets.length,await page.evaluate(()=>Object.values(NM_MIDDLE_PACING.grades).reduce((n,p)=>n+p.sessions.length,0)));
    assert(targets.length>0,'중등 진도 보기가 비었다 — 이 페이지가 data/courses.js 를 싣는지 볼 것');
    for(const target of targets.filter(()=>!process.env.NM_PACING_UI_ONLY)){
      try{
        await page.evaluate(async target=>{
          const items=NM_EXAM.middlePacingItems(target.grade,target.id,'pacing-qa');
          NM_EXAM.renderPrintMulti(items,target.id,{mixed:12,pacing:true});
          await document.fonts.ready;
          await Promise.all([...document.querySelectorAll('.nm-w2-brand-logo')].map(i=>i.decode()));
          await new Promise(requestAnimationFrame);
        },target);
        const result=await page.evaluate(inspectSheet);report.sets.push({...target,actual:result});
        if(result.questions!==target.questions||result.numericKeys!==target.numericKeys||result.drawingKeys!==target.drawingKeys||result.drawingQuestions!==target.drawingKeys||result.legacySolve!=='1'||result.katexErrors||result.scratch||result.bad.length)
          report.failures.push({...target,actual:result});
        if(out&&target.drawingKeys){
          await page.locator('.nm-draw-teaching').screenshot({path:path.join(out,target.id+'-drawing-concept.png')});
          await page.locator('.nm-draw-practice').screenshot({path:path.join(out,target.id+'-drawing-practice.png')});
          await page.locator('.nm-draw-key-grid').screenshot({path:path.join(out,target.id+'-drawing-key.png')});
        }
      }catch(e){report.failures.push({...target,error:e.message});}
    }
    await style.evaluate(e=>e.remove());await page.emulateMedia({media:'screen'});
    for(const width of [1440,390]){
      try{
        await page.setViewportSize({width,height:1050});
        await page.goto(url+'/index.html?enter=1',{waitUntil:'networkidle',timeout:60000});
        await page.waitForFunction(()=>window.NM_EXAM&&window.NM_MIDDLE_PACING);
        if(await page.locator('#ttRoad').isVisible())await page.locator('#ttRoad').click();
        if(await page.locator('#townCourseRoad').isVisible())await page.locator('#townCourseRoad').click();
        await page.waitForSelector('#middlePacing1');
        await page.locator('#middlePacing1 summary').click();
        /* 그리기가 있는 첫 회차(옛 판의 M1-S13 반비례 자리) */
        const target=targets.find(t=>t.grade===1&&t.drawingKeys);
        await page.locator(`[data-middle-grade="1"][data-middle-session="${target.id}"]`).click();
        await page.waitForSelector('#nm-pe-overlay');
        assert.equal(await page.locator('#nm-pe-overlay').evaluate(e=>getComputedStyle(e).position),'fixed');
        assert.equal(await page.locator('#nm-pe-overlay .nm-w2-item').count(),target.questions);
        assert.equal(await page.locator('#nm-pe-overlay .nm-draw-practice .nm-gp-curve,#nm-pe-overlay .nm-draw-practice .nm-gp-pt').count(),0);
        assert.equal(await page.locator('#nm-pe-count-seg').count(),0,'Designed session counts should not be overwritten by a per-type control.');
        const before=await page.locator('#nm-pe-overlay .nm-pe-round').evaluateAll(es=>es.map(e=>e.dataset.code).join('|'));
        await page.locator('#nm-pe-reroll-all').click();
        const after=await page.locator('#nm-pe-overlay .nm-pe-round').evaluateAll(es=>es.map(e=>e.dataset.code).join('|'));
        assert.notEqual(after,before,'New set did not change replay seeds');
        assert.equal(await page.locator('#nm-pe-overlay .nm-w2-item').count(),target.questions);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Editor causes horizontal document overflow');
        if(out)await page.screenshot({path:path.join(out,'pacing-preview-'+width+'.png')});
        await page.evaluate(()=>{window.NM_NO_AUTOPRINT=false;});
        await page.locator('#nm-pe-print').click();
        await page.waitForFunction(()=>window.__printCalls===1);
        await page.evaluate(()=>{window.NM_NO_AUTOPRINT=true;});
        assert.equal(await page.locator('.nm-print-sheet .nm-w2-item').count(),target.questions);
        assert.equal(await page.locator('.nm-print-sheet .nm-ak-item').count(),target.numericKeys);
        assert.equal(await page.locator('.nm-print-sheet .nm-draw-key-item').count(),target.drawingKeys);
        await page.locator('#nm-pe-close').click();
        assert.equal(await page.locator('#nm-pe-overlay').count(),0);
        assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')).progress),{});
        assert.equal(await page.evaluate(()=>localStorage.getItem('nm_ws_solve')),'1','Pacing changed ordinary worksheet solve preference');
        report.screens.push({width,session:target.id,questions:target.questions,rerolled:true,printCalls:1,closed:true,learnerProgressUnchanged:true,legacySolveUnchanged:true});
      }catch(e){report.failures.push({width,error:e.message});}
    }
    if(out)fs.writeFileSync(path.join(out,'middle-pacing-print-results.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify({uiOnly:!!process.env.NM_PACING_UI_ONLY,sets:report.sets.length,questions:report.sets.reduce((n,s)=>n+s.actual.questions,0),pages:report.sets.reduce((n,s)=>n+s.actual.pages,0),screens:report.screens,errors:report.errors,failureCount:report.failures.length,failures:report.failures.slice(0,8)},null,2));
    assert.equal(report.failures.length,0,'See middle-pacing-print-results.json for exact failures');assert.deepEqual(report.errors,[]);
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{if(out)fs.writeFileSync(path.join(out,'middle-pacing-print-results.json'),JSON.stringify(report,null,2));console.error(e);process.exitCode=1;});
