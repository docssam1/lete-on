'use strict';
// Local synthetic students only; complete middle bundles, drawing and legacy calls.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..'),mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true}),report={ok:false,sets:[],legacy:[],errors:[],externalWrites:0};
 try{
  const ctx=await browser.newContext({viewport:{width:1100,height:1000}}),page=await ctx.newPage();
  await ctx.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
  page.on('pageerror',e=>report.errors.push(e.message));
  await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;window.print=()=>{};localStorage.setItem('nm_ws_solve','1');
   localStorage.setItem('nm_state_v1',JSON.stringify({name:'중등묶음검수',lang:'ko',roadCadence:'w1',progress:{'M-1':{steps:{stamp:true}}},coins:17,roadPrints:{'C29-0':2}}));});
  await page.goto(base+'/ws.html?c=C29&w=2026-W43&cad=w1&hp=1&auto=0');
  await page.waitForFunction(()=>window.NM_WS_READY!==undefined,{timeout:60000});
  assert.equal(await page.evaluate(()=>NM_WS_READY),true,await page.locator('#wsBody').innerText());
  await page.evaluate(async()=>{
   const ids=[...new Set(Object.values(NM_COURSES).filter(c=>/^middle/.test(c.tier)).flatMap(c=>c.sessions.flatMap(s=>s.magic||[])).concat('M-25'))];
   await Promise.all(ids.filter(id=>!window.NM_UNITS?.[id]).map(id=>new Promise((resolve,reject)=>{const sc=document.createElement('script');sc.src='data/units/'+id+'.js';sc.onload=resolve;sc.onerror=()=>reject(Error(id));document.head.appendChild(sc);})));
  });
  const oldData=execFileSync('git',['show','HEAD:number_magic/data/middle-pacing.js'],{cwd:root,encoding:'utf8'});
  const oldExam=execFileSync('git',['show','HEAD:number_magic/app/exam.js'],{cwd:root,encoding:'utf8',maxBuffer:4*1024*1024});
  report.legacy=await page.evaluate(({oldData,oldExam})=>{
   const data=NM_MIDDLE_PACING,exam=NM_EXAM,cases=[[1,'M1-S01'],[1,'M1-S14'],[2,'M2-S01'],[2,'M2-S14'],[3,'M3-S01'],[3,'M3-S14']];
   const current=cases.map(([g,id])=>JSON.stringify(exam.middlePacingItems(g,id,'legacy-middle')));
   try{(0,eval)(oldData);(0,eval)(oldExam);return cases.map(([g,id],i)=>{
    if(JSON.stringify(NM_EXAM.middlePacingItems(g,id,'legacy-middle'))!==current[i])throw Error('legacy changed '+id);
    return {grade:g,id,preserved:true};
   });}finally{window.NM_MIDDLE_PACING=data;window.NM_EXAM=exam;}
  },{oldData,oldExam});
  const targets=await page.evaluate(()=>Object.values(NM_MIDDLE_PACING.grades).flatMap(g=>g.sessions.map(s=>({grade:g.grade,id:s.id,course:s.course,lesson:s.lessonIndex}))));
  assert.equal(targets.length,60);
  await page.emulateMedia({media:'print'});await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
  for(const target of targets.filter(t=>!process.argv.includes('--extra-only')||t.course==='C36'&&t.lesson===5)){
   const actual=await page.evaluate(async t=>{
    const e=NM_EXAM.middlePacingEnvelope(t.grade,t.id,'middle-bundles-qa');
    const expected=e.items.reduce((n,it)=>n+(it.magicUnit?0:it.count||20),0),drawing=e.items.filter(it=>it.kind==='drawing').reduce((n,it)=>n+it.count,0);
    if(e.items.some(it=>it.schoolTier!=='mid'))throw Error('wrong school tier '+t.id);
    if(t.course==='C36'&&t.lesson===NM_COURSES.C36.studyPlan.lessons.length-1){
     const extra=e.items.filter(it=>it.levelOnly);if(extra.length!==2||extra.some(it=>it.thread!=='MD25'||![1,2].includes(it.level)||it.count!==12))throw Error('factoring bridge mismatch');
     if(e.items.some(it=>it.magicUnit==='M-25'))throw Error('quartic unit added');
    }
    NM_EXAM.renderPrintMulti(e.items,e.wsId,{mixed:20,compactHigh:true,cover:e.cover,units:e.units});await document.fonts.ready;
    const sheet=document.querySelector('.nm-print-sheet');
    const overflow=[...sheet.querySelectorAll('.nm-w2-page,.nm-w2-item,.nm-cvw,.nm-draw-grid,.nm-draw-key-item')].filter(el=>el.scrollWidth>el.clientWidth+3||el.scrollHeight>el.clientHeight+3).map(el=>({cls:el.className,text:el.textContent.slice(0,110),w:el.clientWidth,sw:el.scrollWidth,h:el.clientHeight,sh:el.scrollHeight,code:el.closest('.nm-w2-page')?.querySelector('.nm-w2-head-code')?.textContent}));
    const extraPanels=[...sheet.querySelectorAll('.nm-level-only-concept')];
    const extraBad=extraPanels.some(el=>/사차|quartic|四次|합의 세제곱|차의 세제곱/.test(el.textContent));
    const extraTitles=extraPanels.map(el=>el.querySelector('h3').textContent);
    const drawLeak=sheet.querySelectorAll('.nm-draw-practice .nm-gp-curve,.nm-draw-practice .nm-gp-pt').length;
    return {expected,questions:sheet.querySelectorAll('.nm-w2-item').length,numericKeys:sheet.querySelectorAll('.nm-ak-item').length,drawingKeys:sheet.querySelectorAll('.nm-draw-key-item').length,drawing,drawLeak,overflow,extraPanels:extraPanels.length,extraBad,
      extraTitles,pages:sheet.querySelectorAll('.nm-w2-page').length,schoolMid:sheet.classList.contains('nm-print-school-mid'),highClaim:/12주.*고등/.test(sheet.querySelector('.nm-cvw').textContent)};
   },target);
   report.sets.push({...target,...actual});
   assert.equal(actual.questions,actual.expected,target.id+' complete questions');assert.equal(actual.numericKeys+actual.drawingKeys,actual.expected,target.id+' complete answers');
   assert.equal(actual.drawingKeys,actual.drawing);assert.equal(actual.drawLeak,0);assert.equal(actual.schoolMid,true);assert.equal(actual.highClaim,false);assert.equal(actual.extraBad,false);
   assert.deepEqual(actual.overflow,[],target.id+' A4 overflow');
   if(actual.extraPanels)assert.deepEqual(actual.extraTitles,['세제곱의 합 인수분해','세제곱의 차 인수분해']);
  }
  if(process.argv.includes('--extra-only')){report.ok=true;console.log(JSON.stringify({ok:true,extraOnly:true,sets:report.sets},null,2));return;}
  report.schedule=await page.evaluate(()=>{
   const before=localStorage.getItem('nm_state_v1'),o={compactHigh:true,highStartDate:'2026-10-19',highSpeed:1,cad:'w1',startSession:1};
   const a=NM_EXAM.weeklyEnvelope(NM_COURSES.C29,'C29','2026-W43',o),b=NM_EXAM.weeklyEnvelope(NM_COURSES.C29,'C29','2026-W44',o);
   const accelerated=NM_EXAM.weeklyEnvelope(NM_COURSES.C29,'C29','2026-W43',{...o,cad:'w2',highWholeWeek:true});
   if(a.lessons[0].lessonIndex===b.lessons[0].lessonIndex||accelerated.lessons.length!==2)throw Error('middle weekly progression/frequency mismatch');
   if(localStorage.getItem('nm_state_v1')!==before)throw Error('student record changed');
   return {first:a.lessons[0],next:b.lessons[0],acceleratedLessons:accelerated.lessons.length,studentPreserved:true};
  });
  await page.emulateMedia({media:'screen'});
  const drawingTarget=await page.evaluate(()=>Object.values(NM_MIDDLE_PACING.grades).flatMap(g=>g.sessions.map(s=>({grade:g.grade,id:s.id,draw:s.blocks.some(b=>b.kind==='drawing')}))).find(s=>s.draw));
  await page.evaluate(t=>NM_EXAM.openMiddlePacing(t.grade,t.id),drawingTarget);
  const preview=await page.locator('#nm-pe-overlay .nm-w2-item').count();assert(preview>0);
  assert.equal(await page.locator('[data-nm-unique-error]').count(),0);assert.equal(await page.locator('#nm-pe-count-seg').count(),0);
  await page.click('#nm-pe-print');assert.equal(await page.locator('.nm-print-sheet .nm-w2-item').count(),preview);
  assert.equal(await page.evaluate(()=>localStorage.getItem('nm_ws_solve')),'1');
  report.preview={id:drawingTarget.id,questions:preview,printMatches:true};
  assert.deepEqual(report.errors,[]);report.ok=true;
  console.log(JSON.stringify({ok:true,sets:report.sets.length,questions:report.sets.reduce((n,s)=>n+s.questions,0),legacy:report.legacy.length,schedule:report.schedule,preview:report.preview},null,2));
 }finally{
  if(process.env.NM_MIDDLE_PACING_REPORT)fs.writeFileSync(process.env.NM_MIDDLE_PACING_REPORT,JSON.stringify(report,null,2)+'\n');
  await browser.close();server.close();
 }
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
