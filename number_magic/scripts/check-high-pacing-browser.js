'use strict';
// Local content only. No student records, network writes, PDF publication or messages.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
async function checkScheduled(page){
  const result=await page.evaluate(async()=>{
    localStorage.setItem('nm_state_v1',JSON.stringify({name:'주간배정검수',progress:{'M-21':{steps:{stamp:true}}},
      roadPrints:{'C38-0':2},coins:17,adminPlan:{courseKey:'C38',sessionIndex:1,startDate:'2026-10-19',speed:1}}));
    const before=JSON.stringify({...localStorage}),course=NM_COURSES.C38;
    const options={compactHigh:true,startSession:1,highStartDate:'2026-10-19',highSpeed:1,cad:'w2',k:1};
    const first=NM_EXAM.weeklyEnvelope(course,'C38','2026-W43',options);
    const next=NM_EXAM.weeklyEnvelope(course,'C38','2026-W44',options);
    if(!first||!next||JSON.stringify(first.assignment.lessons)===JSON.stringify(next.assignment.lessons))throw Error('weekly assignment did not advance');
    const fast=NM_EXAM.weeklyEnvelope(course,'C38','2026-W43',{...options,highSpeed:1.5});
    const second=NM_EXAM.weeklyEnvelope(course,'C38','2026-W43',{...options,highSpeed:1.5,k:2});
    if(fast.lessons.length!==2||second.lessons.length!==1)throw Error('speed 1.5 did not assign 2+1 lessons');
    const whole=NM_EXAM.weeklyEnvelope(course,'C38','2026-W43',{...options,highWholeWeek:true});
    const wholeFast=NM_EXAM.weeklyEnvelope(course,'C38','2026-W43',{...options,highSpeed:1.5,highWholeWeek:true});
    if(whole.lessons.length!==2||wholeFast.lessons.length!==3||wholeFast.cover.studyDays!==5)throw Error('whole-week envelope lost assigned lessons or study days');
    const manual=NM_EXAM.weeklyEnvelope(course,'C38','2026-W43',{compactHigh:true,lesson:0,k:1});
    if(fast.items.reduce((n,it)=>n+(it.count||0),0)<=manual.items.reduce((n,it)=>n+(it.count||0),0))throw Error('fast envelope did not increase real questions');
    const cross=NM_EXAM.weeklyEnvelope(course,'C38','2026-W43',{...options,highSpeed:1.5,startSession:course.studyPlan.lessons[1].startSession});
    if(cross.assignedCourseKeys.length!==2)throw Error('course boundary not included');
    if(cross.assignedCourseKeys.some(key=>!cross.cover.courseTitle.includes(key)))throw Error('cross-course cover omitted course');
    if(NM_EXAM.weeklyEnvelope(course,'C38','2026-W43',{...options,highStartDate:'2024-10-21'})!==null)throw Error('finished plan wrapped to first lesson');
    const snapshots=[];
    for(const [name,e]of [['fast',fast],['cross',cross],['wholeWeek',wholeFast]]){
      const expected=e.items.reduce((n,it)=>n+(it.magicUnit?0:it.count||20),0);
      NM_EXAM.renderPrintMulti(e.items,e.wsId,{mixed:20,cover:e.cover,units:e.units,compactHigh:true});
      await document.fonts.ready;
      const sheet=document.querySelector('.nm-print-sheet');
      const actual=sheet.querySelectorAll('.nm-w2-item').length,keys=sheet.querySelectorAll('.nm-ak-item').length;
      const overflow=[...sheet.querySelectorAll('.nm-w2-page,.nm-w2-item,.nm-cvw')].filter(el=>el.scrollWidth>el.clientWidth+3||el.scrollHeight>el.clientHeight+3).map(el=>el.className);
      if(actual!==expected||keys!==actual||overflow.length)throw Error(name+' scheduled render failed '+JSON.stringify({actual,expected,keys,overflow}));
      if(!Number.isFinite(e.cover.lessonMinutes)||!Number.isFinite(e.cover.weeklyMinutes)||e.cover.weeklyMinutes<e.cover.lessonMinutes)throw Error(name+' time missing');
      snapshots.push({name,lessons:e.lessons.map(l=>({courseKey:l.courseKey,lessonIndex:l.lessonIndex})),expected,actual,keys,overflow,lessonMinutes:e.cover.lessonMinutes,weeklyMinutes:e.cover.weeklyMinutes,sourceGroups:[...new Set(e.items.map(it=>it.sourceSession))]});
    }
    if(before!==JSON.stringify({...localStorage}))throw Error('scheduled assignment changed saved learning state');
    return {week43:first.lessons.map(l=>({courseKey:l.courseKey,lessonIndex:l.lessonIndex})),week44:next.lessons.map(l=>({courseKey:l.courseKey,lessonIndex:l.lessonIndex})),fastWeekSplit:[fast.lessons.length,second.lessons.length],wholeWeekLessons:[whole.lessons.length,wholeFast.lessons.length],noWrap:true,storagePreserved:true,syntheticStudentFieldsPreserved:['progress','roadPrints','coins','adminPlan'],snapshots};
  });
  return {ok:true,scheduled:result,externalWrites:0};
}
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport:{width:1100,height:1000}}),page=await context.newPage();
    await context.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;window.print=()=>{};localStorage.setItem('nm_ws_solve','1');});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/ws.html?c=C38&w=2026-W43&auto=0&hp=1');
    await page.waitForFunction(()=>window.NM_WS_READY!==undefined,{timeout:60000});
    assert.equal(await page.evaluate(()=>NM_WS_READY),true,await page.locator('#wsBody').innerText());
    await page.evaluate(async()=>{
      const ids=[...new Set(Object.values(NM_COURSES).filter(c=>c.studyPlan).flatMap(c=>c.sessions.flatMap(s=>s.magic||[])))];
      await Promise.all(ids.filter(id=>!window.NM_UNITS?.[id]).map(id=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='data/units/'+id+'.js';s.onload=resolve;s.onerror=()=>reject(Error('unit '+id));document.head.appendChild(s);}))); 
    });
    if(process.argv.includes('--schedule-only')){
      await page.emulateMedia({media:'print'});
      await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
      const report=await checkScheduled(page);assert.deepEqual(errors,[]);
      if(process.env.NM_HIGH_PACING_REPORT)fs.writeFileSync(process.env.NM_HIGH_PACING_REPORT,JSON.stringify(report,null,2)+'\n');
      console.log(JSON.stringify(report,null,2));return;
    }
    const selections=await page.evaluate(()=>{
      let count=0;const before=JSON.stringify(Object.fromEntries(Object.entries(NM_COURSES).map(([k,c])=>[k,c.sessions])));
      for(const [key,c]of Object.entries(NM_COURSES).filter(([,c])=>c.studyPlan)){
        const visited=[];
        for(const l of c.studyPlan.lessons){
          const e=NM_EXAM.weeklyEnvelope(c,key,'2026-W43',{compactHigh:true,lesson:l.index,cad:'w2'});
          if(JSON.stringify(e.sourceSessions)!==JSON.stringify(l.sourceIndices.map(i=>i+1)))throw Error(key+' missing sources');
          for(const i of l.sourceIndices){
            visited.push(i);const group=e.items.filter(it=>it.sourceSession===key+'-S'+(i+1));
            if(!group.length)throw Error(key+' source '+i+' empty');
            if(c.sessions[i].test&&group.reduce((n,it)=>n+it.count,0)!==c.sessions[i].pool.reduce((n,d)=>n+d.n,0))throw Error(key+' test count');
          }
          count++;
        }
        if(JSON.stringify(visited)!==JSON.stringify(c.sessions.map((_,i)=>i)))throw Error(key+' incomplete coverage');
        for(let i=1;i<=c.sessions.length;i++){
          const e=NM_EXAM.weeklyEnvelope(c,key,'2026-W43',{compactHigh:true,startSession:i});
          if(e.sourceSessions[0]!==i)throw Error(key+' partial start '+i);
          const old=NM_EXAM.weeklyEnvelope(c,key,'2026-W43',{startSession:i,legacySession:true,k:2});
          if(JSON.stringify(old.session.drills)!==JSON.stringify(c.sessions[i-1].test?c.sessions[i-1].pool:c.sessions[i-1].drills))throw Error(key+' legacy '+i);
        }
      }
      if(before!==JSON.stringify(Object.fromEntries(Object.entries(NM_COURSES).map(([k,c])=>[k,c.sessions]))))throw Error('sessions mutated');
      return count;
    });
    assert.equal(selections,72);
    const legacySource=execFileSync('git',['show','HEAD:number_magic/app/exam.js'],{cwd:root,encoding:'utf8',maxBuffer:4*1024*1024});
    const legacyCases=await page.evaluate(source=>{
      const current=window.NM_EXAM;let count=0;
      try{
        (0,eval)(source);const old=window.NM_EXAM;
        for(const [key,c]of Object.entries(NM_COURSES).filter(([,c])=>c.studyPlan))for(let i=1;i<=c.sessions.length;i++)for(const k of [1,2]){
          const opts={startSession:i,k,cad:'w2',sessionIdx:i-1};
          if(JSON.stringify(old.weeklyEnvelope(c,key,'2026-W43',opts))!==JSON.stringify(current.weeklyEnvelope(c,key,'2026-W43',{...opts,legacySession:true})))throw Error(key+' legacy output differs at '+i+' k'+k);
          count++;
        }
      }finally{window.NM_EXAM=current;}
      return count;
    },legacySource);
    const targets=await page.evaluate(all=>all?Object.entries(NM_COURSES).filter(([,c])=>c.studyPlan).flatMap(([c,v])=>v.studyPlan.lessons.map(l=>({c,lesson:l.index,amount:1}))):[
      {c:'C38',lesson:0,amount:0.7},{c:'C38',lesson:1,amount:1.5},{c:'C59',lesson:0,amount:1},{c:'C59',lesson:1,amount:1},{c:'C64',lesson:1,amount:1}
    ],process.argv.includes('--all'));
    const sets=[];
    await page.emulateMedia({media:'print'});
    await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    for(const target of targets){
      const result=await page.evaluate(async t=>{
        NM_WS_AMOUNT=t.amount;
        const e=NM_EXAM.weeklyEnvelope(NM_COURSES[t.c],t.c,'2026-W43',{compactHigh:true,lesson:t.lesson,amount:t.amount,cad:'w2'});
        const expected=e.items.reduce((n,it)=>n+(it.magicUnit?0:it.count||20),0);
        NM_EXAM.renderPrintMulti(e.items,e.wsId,{mixed:20,cover:e.cover,units:e.units,compactHigh:true});
        await document.fonts.ready;
        const sheet=document.querySelector('.nm-print-sheet');
        const overflow=[...sheet.querySelectorAll('.nm-w2-page,.nm-w2-item,.nm-cvw')].filter(el=>el.scrollWidth>el.clientWidth+3||el.scrollHeight>el.clientHeight+3).map(el=>({cls:el.className,text:el.textContent.slice(0,180),w:el.clientWidth,sw:el.scrollWidth,h:el.clientHeight,sh:el.scrollHeight,code:el.closest('.nm-w2-page')?.querySelector('.nm-w2-head-code')?.textContent}));
        return {expected,actual:sheet.querySelectorAll('.nm-w2-item').length,keys:sheet.querySelectorAll('.nm-ak-item').length,
          pages:sheet.querySelectorAll('.nm-w2-page').length,overflow,tenMinutes:/하루 10분/.test(sheet.querySelector('.nm-cvw').textContent),
          magic:e.items.filter(it=>it.magicUnit).length,renderedMagic:sheet.querySelectorAll('.nm-w2-page-magic').length};
      },target);
      sets.push({...target,...result});
      assert.equal(result.actual,result.expected,JSON.stringify(target));assert.equal(result.keys,result.actual,'answer keys '+JSON.stringify(target));
      assert.deepEqual(result.overflow,[],'A4 overflow '+JSON.stringify(target));assert.equal(result.tenMinutes,false);
      assert(result.renderedMagic>=result.magic,'magic notes retained');
    }
    await page.emulateMedia({media:'screen'});
    await page.evaluate(()=>{
      const e=NM_EXAM.weeklyEnvelope(NM_COURSES.C59,'C59','2026-W43',{compactHigh:true,lesson:1,amount:1.5,cad:'w2'});
      window.__highExpected=e.items.reduce((n,it)=>n+(it.magicUnit?0:it.count||20),0);
      NM_EXAM.openPrintEditor(e.items,e.wsId,{mixed:20,cover:e.cover,units:e.units,courseKey:'C59',compactHigh:true});
    });
    const preview=await page.evaluate(()=>({expected:__highExpected,actual:document.querySelectorAll('#nm-pe-overlay .nm-w2-item').length,errors:document.querySelectorAll('[data-nm-unique-error]').length}));
    assert.equal(preview.errors,0);assert.equal(preview.actual,preview.expected,'preview count');
    await page.click('#nm-pe-print');
    assert.equal(await page.locator('.nm-print-sheet .nm-w2-item').count(),preview.actual,'preview and print count');
    assert.equal(await page.evaluate(()=>localStorage.getItem('nm_ws_solve')),'1','saved solve setting preserved');
    await page.click('#nm-pe-close');
    await page.evaluate(()=>{
      const host=document.createElement('main');host.id='high-road-test';document.body.prepend(host);
      NM_EXAM.renderExamSetup(host,()=>{}, {currentCourse:'C59',cadence:'w2'});
    });
    await page.click('#high-road-test [data-sec="road"]');
    assert.equal(await page.locator('[data-course-wrap="C59"] .nm-ex-road-session').count(),2,'road uses two lessons');
    await page.click('#high-road-test #nm-road-plan');
    assert.equal(await page.locator('.nm-print-plan tbody .nm-pp-cal').count(),12,'personal calendar lists twelve lessons');
    await page.click('[data-course-wrap="C59"] [data-session="0"].nm-ex-road-online-btn');
    const tabs=await page.locator('#high-road-test [data-tabidx]').count();assert(tabs>5,'all source sessions reachable on screen');
    // Visit the note tab, then a question tab, and return without submitting any response.
    const magicTab=await page.locator('#high-road-test [data-tabidx]').allTextContents();
    const noteIndex=magicTab.findIndex(t=>/로그|log/i.test(t));
    if(noteIndex>=0)await page.locator('#high-road-test [data-tabidx]').nth(noteIndex).click();
    await page.click('#high-road-test #nm-ws-back');
    assert.equal(await page.locator('[data-course-wrap="C59"] .nm-ex-road-session').count(),2);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({ok:true,selections,legacyCases,sets,preview,onlineTabs:tabs,externalWrites:0},null,2));
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
