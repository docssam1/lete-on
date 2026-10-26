'use strict';
// Local content only. No student records, network writes, PDF publication or messages.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const calculus=process.argv.includes('--calculus');
const tiers=calculus?['calculus1']:['highmath1','highmath2','algebra'];
const initialCourse=calculus?'C70':'C38',previewCourse=calculus?'C72':'C59';
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
async function checkCalculusScheduled(page){
  const result=await page.evaluate(async()=>{
    localStorage.setItem('nm_state_v1',JSON.stringify({name:'미적분배정검수',progress:{'M-43':{steps:{stamp:true}}},
      roadPrints:{'C70-0':2},coins:17,adminPlan:{courseKey:'C70',sessionIndex:1,startDate:'2026-10-19',speed:1}}));
    const before=JSON.stringify({...localStorage}),course=NM_COURSES.C70;
    const options={compactHigh:true,startSession:1,highStartDate:'2026-10-19',highSpeed:1,cad:'w2',k:1};
    const weeks=['2026-W43','2026-W44','2026-W45','2026-W46','2026-W47','2026-W48','2026-W49','2026-W50','2026-W51','2026-W52','2026-W53','2027-W01'];
    const assigned=[];
    for(const week of weeks)for(const k of [1,2]){
      const e=NM_EXAM.weeklyEnvelope(course,'C70',week,{...options,k});
      if(e)assigned.push(...e.lessons.map(l=>l.courseKey+'-S'+l.startSession));
    }
    const expected=Object.entries(NM_COURSES).filter(([,c])=>c.tier==='calculus1').flatMap(([key,c])=>c.sessions.map((_,i)=>key+'-S'+(i+1)));
    if(JSON.stringify(assigned)!==JSON.stringify(expected))throw Error('calculus 12-week source coverage '+JSON.stringify({assigned,expected}));
    if(new Set(assigned).size!==20)throw Error('calculus source duplicated');
    if(NM_EXAM.weeklyEnvelope(course,'C70','2027-W02',options)!==null)throw Error('finished calculus wrapped to first lesson');
    const snapshots=[];
    for(const [name,week,extra]of [['first','2026-W43',{}],['fast','2026-W43',{highSpeed:1.5}],['cross','2026-W48',{highWholeWeek:true}],['last','2027-W01',{highWholeWeek:true}]]){
      const e=NM_EXAM.weeklyEnvelope(course,'C70',week,{...options,...extra});
      if(!e)throw Error(name+' calculus envelope missing');
      const expected=e.items.reduce((n,it)=>n+(it.magicUnit?0:it.count||20),0);
      NM_EXAM.renderPrintMulti(e.items,e.wsId,{mixed:20,cover:e.cover,units:e.units,compactHigh:true});await document.fonts.ready;
      const sheet=document.querySelector('.nm-print-sheet');
      const actual=sheet.querySelectorAll('.nm-w2-item').length,keys=sheet.querySelectorAll('.nm-ak-item').length;
      const overflow=[...sheet.querySelectorAll('.nm-w2-page,.nm-w2-item,.nm-cvw')].filter(el=>el.scrollWidth>el.clientWidth+3||el.scrollHeight>el.clientHeight+3).map(el=>el.className);
      if(actual!==expected||keys!==actual||overflow.length)throw Error(name+' calculus scheduled render '+JSON.stringify({actual,expected,keys,overflow}));
      if(!Number.isFinite(e.cover.lessonMinutes)||!Number.isFinite(e.cover.weeklyMinutes)||e.cover.weeklyMinutes+0.5<e.cover.lessonMinutes)throw Error(name+' calculus time missing '+JSON.stringify({lesson:e.cover.lessonMinutes,weekly:e.cover.weeklyMinutes}));
      if(e.cover.highPlanVersion!=='20261026-calculus3m-v2')throw Error(name+' calculus compact version missing');
      snapshots.push({name,lessons:e.lessons.map(l=>({courseKey:l.courseKey,lessonIndex:l.lessonIndex})),expected,actual,keys,overflow,lessonMinutes:e.cover.lessonMinutes,weeklyMinutes:e.cover.weeklyMinutes});
    }
    if(before!==JSON.stringify({...localStorage}))throw Error('calculus assignment changed saved learning state');
    return {weeks:weeks.length,sources:assigned.length,uniqueSources:new Set(assigned).size,noWrap:true,storagePreserved:true,snapshots};
  });
  return {ok:true,calculus:true,scheduled:result,externalWrites:0};
}
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport:{width:1100,height:1000}}),page=await context.newPage();
    await context.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;window.print=()=>{};localStorage.setItem('nm_ws_solve','1');});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/ws.html?c='+initialCourse+'&w=2026-W43&auto=0&hp=1');
    await page.waitForFunction(()=>window.NM_WS_READY!==undefined,{timeout:60000});
    assert.equal(await page.evaluate(()=>NM_WS_READY),true,await page.locator('#wsBody').innerText());
    await page.evaluate(async tiers=>{
      const ids=[...new Set(Object.values(NM_COURSES).filter(c=>c.studyPlan&&tiers.includes(c.tier)).flatMap(c=>c.sessions.flatMap(s=>s.magic||[])))];
      await Promise.all(ids.filter(id=>!window.NM_UNITS?.[id]).map(id=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='data/units/'+id+'.js';s.onload=resolve;s.onerror=()=>reject(Error('unit '+id));document.head.appendChild(s);}))); 
    },tiers);
    if(process.argv.includes('--schedule-only')){
      await page.emulateMedia({media:'print'});
      await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
      const report=calculus?await checkCalculusScheduled(page):await checkScheduled(page);assert.deepEqual(errors,[]);
      if(process.env.NM_HIGH_PACING_REPORT)fs.writeFileSync(process.env.NM_HIGH_PACING_REPORT,JSON.stringify(report,null,2)+'\n');
      console.log(JSON.stringify(report,null,2));return;
    }
    const selections=await page.evaluate(tiers=>{
      let count=0;const before=JSON.stringify(Object.fromEntries(Object.entries(NM_COURSES).map(([k,c])=>[k,c.sessions])));
      for(const [key,c]of Object.entries(NM_COURSES).filter(([,c])=>c.studyPlan&&tiers.includes(c.tier))){
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
    },tiers);
    assert.equal(selections,calculus?20:72);
    if(calculus)assert.equal(await page.evaluate(()=>Object.values(NM_COURSES).filter(c=>c.tier==='calculus1').reduce((n,c)=>n+c.sessions.filter(s=>s.test).length,0)),4,'all four calculus checks retained');
    const legacySource=execFileSync('git',['show','HEAD:number_magic/app/exam.js'],{cwd:root,encoding:'utf8',maxBuffer:4*1024*1024});
    const legacyCases=await page.evaluate(({source,tiers})=>{
      const current=window.NM_EXAM;let count=0;
      try{
        (0,eval)(source);const old=window.NM_EXAM;
        for(const [key,c]of Object.entries(NM_COURSES).filter(([,c])=>c.studyPlan&&tiers.includes(c.tier)))for(let i=1;i<=c.sessions.length;i++)for(const k of [1,2]){
          const opts={startSession:i,k,cad:'w2',sessionIdx:i-1};
          if(JSON.stringify(old.weeklyEnvelope(c,key,'2026-W43',opts))!==JSON.stringify(current.weeklyEnvelope(c,key,'2026-W43',{...opts,legacySession:true})))throw Error(key+' legacy output differs at '+i+' k'+k);
          count++;
        }
      }finally{window.NM_EXAM=current;}
      return count;
    },{source:legacySource,tiers});
    const targets=await page.evaluate(({all,tiers})=>all?Object.entries(NM_COURSES).filter(([,c])=>c.studyPlan&&tiers.includes(c.tier)).flatMap(([c,v])=>v.studyPlan.lessons.map(l=>({c,lesson:l.index,amount:1}))):[
      {c:'C38',lesson:0,amount:0.7},{c:'C38',lesson:1,amount:1.5},{c:'C59',lesson:0,amount:1},{c:'C59',lesson:1,amount:1},{c:'C64',lesson:1,amount:1}
    ],{all:calculus||process.argv.includes('--all'),tiers});
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
      if(calculus&&target.lesson===0&&process.env.NM_EVIDENCE_DIR){
        fs.mkdirSync(process.env.NM_EVIDENCE_DIR,{recursive:true});
        await page.locator('.nm-print-sheet .nm-w2-page').first().screenshot({path:path.join(process.env.NM_EVIDENCE_DIR,'calculus-print-'+target.c+'.png')});
      }
    }
    await page.emulateMedia({media:'screen'});
    await page.evaluate(previewCourse=>{
      const e=NM_EXAM.weeklyEnvelope(NM_COURSES[previewCourse],previewCourse,'2026-W43',{compactHigh:true,lesson:1,amount:1.5,cad:'w2'});
      window.__highExpected=e.items.reduce((n,it)=>n+(it.magicUnit?0:it.count||20),0);
      NM_EXAM.openPrintEditor(e.items,e.wsId,{mixed:20,cover:e.cover,units:e.units,courseKey:previewCourse,compactHigh:true});
    },previewCourse);
    const preview=await page.evaluate(()=>({expected:__highExpected,actual:document.querySelectorAll('#nm-pe-overlay .nm-w2-item').length,errors:document.querySelectorAll('[data-nm-unique-error]').length}));
    assert.equal(preview.errors,0);assert.equal(preview.actual,preview.expected,'preview count');
    await page.click('#nm-pe-print');
    assert.equal(await page.locator('.nm-print-sheet .nm-w2-item').count(),preview.actual,'preview and print count');
    assert.equal(await page.evaluate(()=>localStorage.getItem('nm_ws_solve')),'1','saved solve setting preserved');
    await page.click('#nm-pe-close');
    await page.evaluate(previewCourse=>{
      const host=document.createElement('main');host.id='high-road-test';document.body.prepend(host);
      NM_EXAM.renderExamSetup(host,()=>{}, {currentCourse:previewCourse,cadence:'w2'});
    },previewCourse);
    await page.click('#high-road-test [data-sec="road"]');
    const expectedRows=await page.evaluate(key=>NM_COURSES[key].studyPlan.lessons.length,previewCourse);
    assert.equal(await page.locator('[data-course-wrap="'+previewCourse+'"] .nm-ex-road-session').count(),expectedRows,'road uses study-plan lessons');
    const expectedCalculusCalendar=calculus?await page.evaluate(()=>{
      const monday=new Date();monday.setHours(0,0,0,0);monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
      const counts=new Map();
      // Eleven remaining intact sessions in C72+C73, each six fifths of a
      // scheduling unit. A week holds ten fifths at the standard cadence.
      return Array.from({length:11},(_,index)=>{
        const weekOff=Math.ceil((index+1)*6/10)-1,kth=(counts.get(weekOff)||0)+1;counts.set(weekOff,kth);
        const date=new Date(monday);date.setDate(date.getDate()+weekOff*7);
        return `${date.getMonth()+1}월 ${Math.floor((date.getDate()-1)/7)+1}-${kth}주차`;
      });
    }):null;
    if(calculus)assert.deepEqual((await page.locator('[data-course-wrap="'+previewCourse+'"] .nm-ex-road-cal').allTextContents()).map(t=>t.replace(/^🗓\s*/,'')),expectedCalculusCalendar.slice(0,expectedRows),'road lesson labels follow weighted completion weeks');
    await page.click('#high-road-test #nm-road-plan');
    const expectedCalendarRows=await page.evaluate(key=>Math.min(12,Object.entries(NM_COURSES).filter(([,c])=>c.order>=NM_COURSES[key].order).reduce((n,[,c])=>n+(c.studyPlan?.lessons.length||c.sessions.length),0)),previewCourse);
    assert.equal(await page.locator('.nm-print-plan tbody .nm-pp-cal').count(),expectedCalendarRows,'personal calendar lists available next lessons');
    const calendarLabels=await page.locator('.nm-print-plan tbody .nm-pp-cal').allTextContents();
    if(calculus)assert.deepEqual(calendarLabels,expectedCalculusCalendar,'printed calendar matches weighted 12-week assignment');
    await page.click('[data-course-wrap="'+previewCourse+'"] [data-session="0"].nm-ex-road-online-btn');
    const tabs=await page.locator('#high-road-test [data-tabidx]').count();assert(tabs>(calculus?1:5),'all source sessions reachable on screen');
    // Visit the note tab, then a question tab, and return without submitting any response.
    const magicTab=await page.locator('#high-road-test [data-tabidx]').allTextContents();
    const noteIndex=magicTab.findIndex(t=>/로그|log/i.test(t));
    if(noteIndex>=0)await page.locator('#high-road-test [data-tabidx]').nth(noteIndex).click();
    await page.click('#high-road-test #nm-ws-back');
    assert.equal(await page.locator('[data-course-wrap="'+previewCourse+'"] .nm-ex-road-session').count(),expectedRows);
    const scheduled=calculus?await checkCalculusScheduled(page):undefined;
    const legacyExactLinks=[];
    if(calculus)for(const [courseKey,session]of [['C70',2],['C73',5]]){
      const legacyPage=await context.newPage();
      await legacyPage.addInitScript(()=>{
        window.__envelopeCalls=[];let api;
        Object.defineProperty(window,'NM_EXAM',{configurable:true,get:()=>api,set:value=>{
          api=value;const original=value.weeklyEnvelope;
          value.weeklyEnvelope=function(course,key,week,options){window.__envelopeCalls.push({key,week,options:{...options}});return original.call(this,course,key,week,options);};
        }});
      });
      await legacyPage.goto(base+'/ws.html?c='+courseKey+'&w=2026-W43&p=1&s='+session+'&auto=0');
      await legacyPage.waitForFunction(()=>window.NM_WS_READY!==undefined,{timeout:60000});
      assert.equal(await legacyPage.evaluate(()=>NM_WS_READY),true,'legacy exact worksheet renders '+courseKey+'/'+session);
      const actual=await legacyPage.evaluate(()=>({call:__envelopeCalls[0],questions:document.querySelectorAll('.nm-print-sheet .nm-w2-item').length,answers:document.querySelectorAll('.nm-print-sheet .nm-ak-item').length}));
      assert.equal(actual.call.key,courseKey);assert.equal(actual.call.options.startSession,session);
      assert.equal(actual.call.options.legacySession,true);assert.equal(actual.call.options.compactHigh,false);
      assert(actual.questions>0);assert.equal(actual.questions,actual.answers,'legacy answer count');
      legacyExactLinks.push({courseKey,session,questions:actual.questions,answers:actual.answers,legacySession:true,compactHigh:false});
      await legacyPage.close();
    }
    assert.deepEqual(errors,[]);
    const report={ok:true,calculus,selections,legacyCases,legacyExactLinks,sets,preview,calendarLabels,onlineTabs:tabs,...(scheduled?{scheduled:scheduled.scheduled}:{}),externalWrites:0};
    if(process.env.NM_HIGH_PACING_REPORT)fs.writeFileSync(process.env.NM_HIGH_PACING_REPORT,JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
