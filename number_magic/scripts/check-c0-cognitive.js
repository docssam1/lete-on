#!/usr/bin/env node
'use strict';
// The actual C0 print pipeline, including the profile (not just base generators).
// Local read-only server. No student, authentication, SMS or cloud writes.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'../..'),out=process.env.NM_C0_QA_DIR;
if(out)fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');let s=fs.readFileSync(f);if(f.endsWith('/app/exam.js'))s=s.toString().replace('window.NM_EXAM = NM_EXAM;','window.NM_EXAM = NM_EXAM; window.__c0QA={withC0,buildProblems,sessionRoleItems,assignStudyDays};');res.end(s);});
(async()=>{let b;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:1300}}),origin='http://127.0.0.1:'+server.address().port;
 await p.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());
 await p.goto(origin+'/number_magic/ws.html?c=C0&s=1&w=2026-W43&p=1&auto=0');await p.waitForFunction(()=>window.NM_WS_READY!==undefined);assert.equal(await p.evaluate(()=>NM_WS_READY),true);
 const model=await p.evaluate(()=>{
  const ss=NM_COURSES.C0.sessions,fail=m=>{throw Error(m)},dots=new Set(),kinds=new Set();let samples=0;
  if(ss.length!==19)fail('19 sessions required');
  const books=ss.flatMap(s=>s.magic);if(new Set(books).size!==15||books.length!==15||ss[18].magic[0]!=='N-11')fail('All 15 books once; N-11 in week19');
  for(const[sidx,s]of ss.entries()){
   const refs=[...s.school,...s.strategy.practice,...s.application];
   if(s.c0.incomplete||refs.reduce((n,d)=>n+d.count,0)!==60)fail('Incomplete or non-60 session '+(sidx+1));
   for(const d of refs){if(d.t==='NL5'&&d.lv===3||d.t==='NL52'&&d.lv===3)fail('Coins or vertical arithmetic');
    for(let seed=1;seed<=32;seed++){
     const q=__c0QA.withC0(s.c0,()=>__c0QA.buildProblems(d.t,d.lv,1,seed*1907))[0];samples++;
     if(!NM_C0.valuesInRange(q,s.c0.max))fail('Range '+sidx+' '+d.t+'@'+d.lv);
     if(/이\(가\)|은\(는\)|을\(를\)|농구공가|꽃를|풍선를|[013678]와\b/.test(q.prompt?.ko||''))fail('Korean particles');
     if(q.widget==='seqFill'&&q.seq[q.blank]!==q.answer)fail('Sequence answer must fill the indicated blank '+d.t+'@'+d.lv+' '+JSON.stringify(q));
     if(q.widget==='dotToDot'){dots.add(q.pts.length);if(new Set(q.pts.map(x=>x.join(','))).size!==q.pts.length)fail('Repeated dot');}
     if(d.t==='NL18'&&d.lv===1){kinds.add(q.answer);if(q.answer!==new Set(q.items.map(x=>x.e)).size||q.items.some(x=>!/^shape:(circle|square|triangle)$/.test(x.e)))fail('Flat shape count');}
     if(q.widget==='balanceScale'&&q.answer!==(/무거운/.test(q.prompt.ko)?(q.left>q.right?0:1):(q.left<q.right?0:1)))fail('Balance answer');
    }
   }
  }
  if(dots.size!==6||kinds.size!==3)fail('Variety: dots5–10 and shape kinds1–3');
  for(const [word,expected]of[['6와','6과'],['2과','2와'],['10와','10과'],['농구공가','농구공이']])if(NM_C0.korean(word+' ')!==expected+' ')fail('Particle fixture '+word);
  // Outside C0 the adapter must call the exact original function with its inputs.
  const opts={},rng=()=>.5,original=(a,b)=>({same:a===opts&&b===rng});if(!NM_C0.generate('NL1',1,opts,rng,original).same)fail('Non-C0 changed');
  return {samples,dots:[...dots].sort(),shapeKinds:[...kinds].sort(),weeks:ss.map((s,i)=>({week:i+1,block:s.c0.block,book:s.magic.join(','),range:s.c0.max,school:s.school.map(d=>d.t+'@'+d.lv),strategy:s.strategy.practice.map(d=>d.t+'@'+d.lv),application:s.application.map(d=>d.t+'@'+d.lv)}))};
 });
 const pages=[];
 await p.emulateMedia({media:'print'});
 for(let s=1;s<=19;s++){
  await p.goto(origin+'/number_magic/ws.html?c=C0&s='+s+'&w=2026-W43&p=1&auto=0');await p.waitForFunction(()=>window.NM_WS_READY!==undefined);assert.equal(await p.evaluate(()=>NM_WS_READY),true,'Render week '+s);
  await p.evaluate(async()=>{for(const im of document.images)im.loading='eager';await document.fonts.ready;await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})))});
  await p.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
  const result=await p.evaluate(()=>{const root=document.querySelector('.nm-print-sheet'),days={1:0,2:0,3:0},bad=[],symbols=[],copy=[],large=[];
   for(const [i,page]of [...root.querySelectorAll('.nm-w2-page')].entries()){
    const day=page.querySelector('.nm-w2-study-day')?.textContent.match(/([123])일차/);if(day)days[day[1]]+=page.querySelectorAll('.nm-w2-item').length;
    for(const el of [page,...page.querySelectorAll('.nm-w2-item')])if(el.scrollHeight>el.clientHeight+3||el.scrollWidth>el.clientWidth+3)bad.push(i+1);
    const walk=document.createTreeWalker(page,NodeFilter.SHOW_TEXT);while(walk.nextNode()){const n=walk.currentNode;if(n.parentElement.closest('style,script,.nm-w2-head-code,.nm-w2-foot-code,.nm-ak-subcode,.nm-w2-pg,.nm-w2-num,.nm-w2-qnum,.nm-w2-head-no,.nm-w2-study-day'))continue;const t=n.textContent;if(/[+＋=＝−－]/.test(t))symbols.push({page:i+1,text:t});if(/이\(가\)|은\(는\)|을\(를\)|쓰시오|하시오|고르시오|보시오|꽃를|풍선를|농구공가/.test(t))copy.push({page:i+1,text:t});if(page.classList.contains('nm-w2-page-magic')&&/\b(?:[1-9]\d+)\b/.test(t.replace(/10칸|10/g,'')))large.push({page:i+1,text:t});}
   }
   return{questions:root.querySelectorAll('.nm-w2-item').length,answers:root.querySelectorAll('.nm-ak-item').length,days,pages:root.querySelectorAll('.nm-w2-page').length,bad,symbols,copy,large,vertical:root.querySelectorAll('.nm-print-vp,.nm-w2-vp').length};});
  assert.equal(result.questions,60,'Question count week '+s);assert.equal(result.answers,60,'Answer count week '+s);assert.equal(Object.values(result.days).reduce((a,b)=>a+b,0),60,'Day count week '+s);assert(Math.max(...Object.values(result.days))<=24,'Day balance week '+s);assert.deepEqual(result.bad,[],'Overflow week '+s);assert.deepEqual(result.copy,[],'Copy week '+s);assert.deepEqual(result.large,[],'Large concept quantity week '+s);assert.equal(result.vertical,0);if(s<19)assert.deepEqual(result.symbols,[],'Symbols before week19');else assert(result.symbols.length>0);
  pages.push({week:s,...result});if(out&&[1,5,9,13,17,19].includes(s)){await p.locator('.nm-w2-page').first().screenshot({path:path.join(out,'week-'+s+'-concept.png')});const draw=p.locator('.nm-w2-page').filter({has:p.locator('.nm-c0-draw')}).first();if(await draw.count())await draw.screenshot({path:path.join(out,'week-'+s+'-drawing.png')});}
  console.log('PASS C0 week',s,'60 questions /',JSON.stringify(result.days),'/ pages',result.pages);
 }
 if(out)fs.writeFileSync(path.join(out,'c0-audit.json'),JSON.stringify({model,pages},null,2));
 console.log('PASS C0 cognitive',model.samples,'generated samples, 19 printed sessions, 1140 scored questions');
 }finally{if(b)await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
