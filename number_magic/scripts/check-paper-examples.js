#!/usr/bin/env node
'use strict';
/* Content checks on generated preschool questions, plus the finite-pool course
   tests that previously failed in the actual worksheet. No student/network writes. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('./lib/playwright');
const repo=path.resolve(__dirname,'../..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const f=path.resolve(repo,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(repo+path.sep)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch();const page=await browser.newPage();
 let src=fs.readFileSync(path.join(repo,'number_magic/app/exam.js'),'utf8').replace("if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_EXAM;",'window.__paperKit=w2PaperExampleKit();window.__paperBody=w2NeighborExampleHtml;\n'+"if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_EXAM;");
 src=src.replace("  const sheet = document.createElement('div');\n  sheet.className = 'nm-print-sheet nm-print-age-' + printAgeBand(items[0], allProblems)","  window.__paperRounds=rounds;\n  const sheet = document.createElement('div');\n  sheet.className = 'nm-print-sheet nm-print-age-' + printAgeBand(items[0], allProblems)");
 await page.route('**/app/exam.js?*',r=>r.fulfill({status:200,contentType:'text/javascript',body:src}));
 const origin='http://127.0.0.1:'+server.address().port;
 await page.goto(origin+'/number_magic/ws.html?c=C0&w=2026-W43&auto=0&p=1&s=1');await page.waitForFunction(()=>window.NM_WS_READY===true);
 const result=await page.evaluate(()=>{
  const refs=new Map(),widgets=new Set();let checked=0,semantic=0;
  function collect(o){if(!o||typeof o!=='object')return;if(/^NL\d+$/.test(o.t)&&o.lv)refs.set(o.t+'@'+o.lv,[o.t,o.lv]);for(const v of Object.values(o))if(typeof v==='object')collect(v);}
  collect(NM_COURSES.C0.sessions);
  if(__paperBody({widget:'g46LineDraw'})!=='')throw Error('Unsupported manual widget must keep its existing paper behavior');
  const eq=(a,b,msg)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(msg+': '+JSON.stringify(a)+' != '+JSON.stringify(b));semantic++;};
  for(const [ref,[t,lv]]of refs)for(let seed=1;seed<=12;seed++){
   const p=NM_EXAM.buildProblems(t,lv,1,seed*1907)[0];
   if(['pyramid','numberMachine','crossSum','dotToDot','pathSum','cubes'].includes(p.widget))continue;
   const original=JSON.stringify(p),m=NM_PAPER_EXAMPLES.model(p,__paperKit);
   if(!m||!m.steps.length||!m.after)throw Error('Incomplete worked example '+ref);
   if(/undefined|NaN|\[object Object\]|animal:/.test(m.after+' '+m.answer))throw Error('Broken picture/answer '+ref);
   eq(JSON.stringify(p),original,'Teaching changed practice input '+ref);
   const d=document.createElement('div');d.innerHTML=m.after;const text=d.textContent;
   for(const q of m.checks)eq(q.op==='+'?q.a+q.b:q.a-q.b,q.c,'False teaching equation '+ref);
   switch(p.widget){
    case 'numberBond':if(p.dir==='join'){const originalPic=document.createElement('div');originalPic.innerHTML=__paperKit.visual(p);for(const pic of [originalPic,d])for(const[k,n]of[['a',p.a],['b',p.b]]){const part=pic.querySelector('.nm-bond-objects-part[data-bond-part="'+k+'"]');if(!part)throw Error('Joining problem has words but no objects');eq(part.querySelectorAll('[data-bond-object]').length,n,'Object count must match its branch number');eq(Number(part.dataset.bondCount),n,'Wrong pictured group');if(n===0&&!part.querySelector('.nm-bond-zero'))throw Error('Empty group needs an explicit zero label');}eq(originalPic.querySelectorAll('.nm-bond text[x="80"]').length,0,'Practice total must stay blank');eq(d.querySelector('.nm-bond text[x="80"]').textContent,String(p.answer),'Completed total');}break;
    case 'g13Count':case 'frameRead':case 'tapCount':eq(m.answer,String(p.answer),'Wrong counted amount '+ref+' '+JSON.stringify(p));break;
    case 'balanceScale':eq(p.answer,/무거운/.test(p.prompt.ko)?(p.left>p.right?0:1):(p.left<p.right?0:1),'Wrong requested pan');eq(d.querySelector('[data-pe-balance-mark]')?.dataset.peBalanceMark,String(p.answer),'Wrong pan circled');break;
    case 'g11_cardEq':for(const line of p.sample.split(' · ')){const a=line.match(/^(\d+)\s*([+−-])\s*(\d+)\s*=\s*(\d+)$/);if(!a)throw Error('Unverified card equation');eq(a[2]==='+'?+a[1]+ +a[3]:+a[1]- +a[3],+a[4],'False card equation');if(p.target!=null)eq(+a[4],p.target,'Wrong card target');}break;
    case 'tapWrong':for(const token of p.tokens.ko.filter(x=>x.wrong)){if(!text.includes(String(p.answer)))throw Error('Wrong story was not corrected');}break;
    case 'machineBox':if([...d.querySelectorAll('.nm-nl-g79-bl')].some(e=>!e.textContent.trim()))throw Error('Solved machine still has an empty box');if(p.kind==='rule'){const delta=p.rows[0].out-p.rows[0].in;for(const r of p.rows)eq(r.out-r.in,delta,'Inconsistent machine rule');eq(p.q.out==null?p.q.in+delta:p.q.out-delta,p.answer,'Wrong machine output/input');}break;
    case 'hopLine':if([...d.querySelectorAll('.nm-nl-g79-bl')].some(e=>!e.textContent.trim()))throw Error('Solved number line still has an empty box');break;
    case 'shapeEq':eq([...d.querySelectorAll('[class*="-qbox"]')].map(e=>Number(e.textContent)),p.ask.map(k=>p.vals[k]),'Shape values not filled');break;
    case 'g10_surveyGrid':if(p.askMode==='tally')eq([...d.querySelectorAll('td.em')].map(e=>Number(e.textContent)),p.counts,'Survey counts not filled');break;
    case 'splitDraw':{const sums=[...d.querySelectorAll('.nm-pe-math p')].map(e=>e.textContent.match(/^(\d+) \+ (\d+) = (\d+)$/).slice(1).map(Number));eq(sums.length,p.rows,'Missing new split');eq(new Set(sums.map(([a,b])=>[a,b].sort((a,b)=>a-b).join(':'))).size,sums.length,'Repeated split');for(const[a,b,c]of sums){eq(a+b,p.total,'Split total');eq(c,p.total,'Printed total');if((p.preset||[]).some(q=>q.a===a&&q.b===b||q.a===b&&q.b===a))throw Error('New split repeats preset');}break;}
    case 'g12_partsFill':{const sums=[...d.querySelectorAll('.nm-pe-math p')].map(e=>e.textContent.split(' = ')[0].split(' + ').map(Number));for(const ns of sums){eq(ns.length,p.parts,'Partition count');eq(ns.reduce((a,b)=>a+b,0),p.whole,'Partition total');for(const[i,n]of Object.entries(p.given||{}))eq(ns[i],n,'Given part changed');if(p.equal)eq(new Set(ns).size,1,'Equal partition');if(ns.some(n=>n<(p.min||1)))throw Error('Partition below minimum');}break;}
    case 'g12_gridGroup':{const used=new Set();for(let gi=0;gi<p.need;gi++){const ns=[...d.querySelectorAll('[data-pe-group="'+gi+'"]')].map(e=>Number(e.dataset.peValue));eq(ns.length,p.size,'Group size');eq(ns.reduce((a,b)=>a+b,0),p.target,'Wrong grouped sum');const coords=p.solutionGroups[gi].map(c=>c.join(':'));for(const key of coords){if(used.has(key))throw Error('A cell belongs to two groups');used.add(key);}const reached=new Set([0]);for(let n=0;n<p.size;n++)for(let a=0;a<p.size;a++)for(let b=0;b<p.size;b++)if(reached.has(a)&&Math.max(Math.abs(p.solutionGroups[gi][a][0]-p.solutionGroups[gi][b][0]),Math.abs(p.solutionGroups[gi][a][1]-p.solutionGroups[gi][b][1]))<=1)reached.add(b);eq(reached.size,p.size,'Disconnected group');}break;}
    case 'g46Line':eq(d.querySelectorAll('.nm-nl-g46-ppl.nm-pe-ring').length,p.ask==='total'?p.total:p.ask==='convert'?1:p.ask==='behind'?p.total-p.mark-1:p.mark,'Wrong people marked');break;
    case 'g13Rep':case 'matchLine':case 'g46Match':for(const line of d.querySelectorAll('[data-pe-match]')){const[i,j]=line.dataset.peMatch.split(',').map(Number);eq(p.left[i],p.right[j],'Wrong matching line');}break;
    case 'gridPaint':case 'tapMake':eq(d.querySelectorAll('.nm-nl-cell-empty.nm-pe-filled').length,p.target,'Wrong number of filled cells');break;
   }
   widgets.add(p.widget);checked++;
  }
  return{refs:refs.size,checked,semantic,widgets:widgets.size};
 });
 assert(result.checked>900&&result.widgets>=60,JSON.stringify(result));console.log('PASS worked pictures',result);
 for(const[c,s]of[['C18',5],['C25',4]]){
  await page.goto(origin+'/number_magic/ws.html?c='+c+'&s='+s+'&p=1&w=2026-W43&auto=0');await page.waitForFunction(()=>window.NM_WS_READY!==undefined);
  const r=await page.evaluate(({c,s})=>({ready:NM_WS_READY,q:document.querySelectorAll('.nm-w2-item').length,examples:document.querySelectorAll('.nm-w2-example').length,pool:NM_COURSES[c].sessions[s-1].pool,rounds:__paperRounds.filter(r=>r.thread).map(r=>({t:r.thread,n:r.problems.length,noTeach:r.__redo?.item?.noTeach,mix:r.__redo?.item?.threadMix,topic:r.__redo?.item?.topicName})),err:document.querySelector('.ws-err')?.textContent}),{c,s});
  assert.equal(r.ready,true,r.err);assert.equal(r.examples,0,'Course tests must not teach the answer');for(const d of r.pool){const rr=r.rounds.find(x=>x.t===d.t&&!(x.topic||'').startsWith('단계 점검'));assert(rr);assert.equal(rr.n,d.n,'Use the official pool count for '+d.t);const planned=await page.evaluate(({c,s,t})=>NM_EXAM.weeklyEnvelope(NM_COURSES[c],c,'2026-W43',{startSession:s,legacySession:true}).items.find(it=>it.thread===t),{c,s,t:d.t});assert.equal(planned.noTeach,true);assert.equal(planned.threadMix.length,1,'A completed-course test must not ramp into a new level');assert.equal(planned.threadMix[0].lv,d.lv);}assert.equal(r.q,r.rounds.reduce((n,x)=>n+x.n,0));console.log('PASS course test',c,s,r.q);
 }
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
