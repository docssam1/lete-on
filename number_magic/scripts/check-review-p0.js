#!/usr/bin/env node
'use strict';
// Independent regression cases from the Argon/Opus review. Local rendering only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..');
const server=http.createServer((req,res)=>{
 const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');
 let content=fs.readFileSync(file);
 if(file.endsWith('/app/exam.js'))content=content.toString().replace('window.NM_EXAM = NM_EXAM;','window.NM_EXAM = NM_EXAM;window.__reviewQA={applyPartialBlanks,printAskText,w2CellHtml,stripConceptTags,sortRoundProblems,assignStudyDays,prosePowersHtml,w2LevelInstruction,rampLevelFor,withC0};');
 res.end(content);
});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));try{
 const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1100,height:1400}});
 await page.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
 await page.goto(origin+'/number_magic/ws.html?c=C4&s=1&p=1&auto=0&w=2026-W43');
 await page.waitForFunction(()=>window.NM_WS_READY!==undefined);assert.equal(await page.evaluate(()=>NM_WS_READY),true);
 const result=await page.evaluate(()=>{
  let assertions=0;const eq=(a,b,msg)=>{assertions++;if(JSON.stringify(a)!==JSON.stringify(b))throw Error(msg+': '+JSON.stringify(a)+' != '+JSON.stringify(b));};
  const ok=(v,msg)=>eq(!!v,true,msg),Q=__reviewQA;
  const gen=(t,lv,seed)=>{const th=NM_THREADS[t],l=th.levels.find(x=>x.id===lv);return NM_TGEN[th.gen](l.params||{},NM_RNG.mulberry32(seed));};
  for(const tex of ['\\int_{-1}^{1}x^2\\,dx','\\int^1_0 x^1 dx','\\sum_{k=1}^{1} k','\\prod_{i=0}^{1}i','\\lim_{x\\to1}x^{1}']){
   const got=NM_TEX.tidy(tex);ok(got.includes(tex.match(/^\\\w+(?:[_^](?:\{[^}]*\}|\w)){0,2}/)[0]),'Operator limit was removed');
  }
  eq(NM_TEX.tidy('x^{1}+2^{1}'),'x+2','Ordinary exponent one still simplifies');
  for(let seed=1;seed<=240;seed++){
   const root=gen('MD66',5,seed),m=root.solution[0].tex.match(/\\dfrac\{(-?\d+)\}\{2\}/);
   eq(+m[1]/2,root.answer,'Double-root solution sign');
   const pow=gen('MD10',5,seed); // locate the actual distribution level below as well
   ok(pow&&pow.tex,'Power generation');
   const dist=NM_TGEN[NM_THREADS.MD10.gen]({mode:'distribute'},NM_RNG.mulberry32(seed));
   ok(!dist.solution.some(s=>/(^|[= ])-\d+\^/.test(s.tex)),'Negative base needs parentheses');
   const log=gen('MD54',3,seed),t=log.tex.match(/\\log_\{(\d+)\}\((\d+)x ([+-]) (\d+)\) (\\le|\\ge) (\d+)/);
   if(!t)throw Error('Log fixture not understood: '+log.tex);
   const a=+t[1],p=+t[2],q=(t[3]==='-'?-1:1)*+t[4],bound=log.answer,lower=-q/p;
   eq(p*bound+q,a**+t[6],'Log equality boundary');
   if(t[5]==='\\le')ok(log.tex.includes('< x \\le \\square'),'Log upper-bound solution must include its domain');
   for(const x of [lower-1,lower,lower+.01,bound,bound+1]){
    const analytic=p*x+q>0&&(t[5]==='\\le'?Math.log(p*x+q)/Math.log(a)<=+t[6]+1e-9:Math.log(p*x+q)/Math.log(a)>=+t[6]-1e-9);
    eq(analytic,t[5]==='\\le'?x>lower&&x<=bound:x>=bound,'Log solution set');
   }
   const fr=gen('FR4',2,seed),step=fr.steps[1];
   const f=step.tex.match(/\\frac\{(\d+)\}\{(\d+)\} ([+-])\s*\\frac\{(\d+)\}\{(\d+)\}/);
   if(f)eq(step.blank,f[3]==='+'?+f[1]+ +f[4]:+f[1]- +f[4],'Fraction carry/borrow intermediate numerator');
  }
  for(const [n,a,b,want] of [['3/2','과','와','3/2과'],['2/3','과','와','2/3와'],['장','이에요','예요','장이에요'],['1','으로','로','1로'],['6','으로','로','6으로']])eq(NM_RNG.koJosa(n,a,b),want,'Spoken Korean particle');
  const inline=Q.prosePowersHtml('A^C와 2^(2/3)은 수식이에요.');
  ok(inline.includes('data-tex="A^C"')&&inline.includes('data-tex="2^{2/3}"')&&inline.includes('와 '),'Inline powers retain surrounding prose');
  const indexed=Q.prosePowersHtml('log_a N=k, a_n은 일반항이에요.');
  ok(indexed.includes('data-tex="\\log_a N"')&&indexed.includes('data-tex="a_n"'),'Logarithm bases and sequence indices are typeset as math');
  ok(!Q.w2LevelInstruction('MD86',1).includes('상자그림'),'Quartile calculation is not a drawing instruction');
  ok(Q.w2LevelInstruction('MD86',6).includes('상자그림'),'Box drawing keeps its drawing instruction');
  ok(!Q.w2LevelInstruction('MD87',2).includes('표의 순서쌍'),'Scatter reading is not point plotting');
  ok(Q.w2LevelInstruction('MD15',4).includes('①'),'Comparison explains the answer codes');
  const rounds=[{problems:Array(60).fill({}),html:[0,24,6,12,18].map(n=>'<div class="nm-w2-page">'+Array(n).fill('<div class="nm-w2-item"></div>').join('')+'</div>').join('')}];
  eq(Q.assignStudyDays(rounds,3),3,'Three study days');
  const loads=[0,0,0];[0,24,6,12,18].forEach((n,i)=>loads[rounds[0].pageStudyDays[i]-1]+=n);
  eq(loads,[24,18,18],'Balance whole pages without splitting a question');
  eq(rounds[0].pageStudyDays[0],rounds[0].pageStudyDays[1],'Concept remains with following practice');
  for(const c of Object.values(NM_COURSES)){
    const learned={};for(const session of c.sessions.filter(s=>!s.test))for(const d of (session.drills||[]).concat(session.creative||[]))if(d?.t)learned[d.t]=Math.max(learned[d.t]||0,d.lv||0);
    for(const entry of c.sessions.find(s=>s.test)?.pool||[])if(learned[entry.t])eq(entry.lv,learned[entry.t],'Course test uses its actual practised level C'+c.order+' '+entry.t);
  }
  for(let seed=1;seed<=240;seed++){
   for(const t of ['ML6','ML15','ML21']){
    const p=gen(t,1,seed),m=p.tex.match(/(\d+) \\times (\d+)/);
    eq(p.answer,+m[1]*+m[2],'Scaffold changes preserve multiplication '+t);
    if(t==='ML6'&&+m[1]%10===0)eq(p.steps.length,1,'Do not print the whole product as the tens subtotal');
    if(t==='ML15')ok(p.steps.every(s=>!new RegExp('(^|[^0-9])'+p.answer+'(?![0-9])').test(s.tex)),'x11 steps must not print the final product');
    if(t==='ML21')ok(!p.steps.some(s=>/\\text\{\d+자리\}/.test(s.tex)),'Predicting digit count must remain the learner task');
   }
   const fr=gen('FR2',1,seed),im=fr.tex.match(/^\\frac\{(\d+)\}\{(\d+)\} = \\square/);
   if(im){eq(fr.answer,Math.floor(+im[1]/+im[2]),'Improper to mixed quotient');ok(fr.steps.every(s=>/\\square/.test(s.tex)),'Keep both quotient/mixed steps incomplete');ok(/= \\square \\cdots/.test(fr.steps[0].tex),'Quotient must not be prefilled');}
   else{const m=fr.tex.match(/^(\d+)\\frac\{(\d+)\}\{(\d+)\}/);eq(fr.answer,+m[1]*+m[3]+ +m[2],'Mixed to improper numerator');ok(fr.steps.at(-1).tex.includes('\\frac{\\square}'),'Final numerator must not be prefilled');}
   const dc=gen('DC1',1,seed),m=dc.tex.match(/^0\.(\d) ([+-]) 0\.(\d)/);
   eq(dc.answer,m[2]==='+'?+m[1]+ +m[3]:+m[1]- +m[3],'Decimal tenths arithmetic');
   if(m[2]==='+'&&dc.answer>=10)eq(dc.steps.at(-1).tex,dc.tex,'Carry step does not print the decimal answer');
   const gp=gen('MD69',3,seed),x=+gp.tex.match(/x = (-?\d+)/)[1];
   eq(gp.graph.pts.length,0,'Graph reading must not label the answer coordinate');
   eq(gp.answer,gp.graph.kind==='line'?gp.graph.m*x+gp.graph.b:gp.graph.k/x,'Curve still represents the requested value');
   const vertex=gen('MD67',1,seed);
   ok(!vertex.solution.some(s=>/y = -?\\times/.test(s.tex)),'A scalar coefficient 1 must not disappear before a multiplication sign');
   const rad=gen('MD18',3,seed),n=+rad.tex.match(/\\sqrt\{(\d+)\}/)[1],a=rad.solution[0].blank[0],b=rad.solution[0].blank[1];
   eq(a*a*b,n,'Root decomposition');eq(rad.answer,[b,a*b],'Rationalization answer preserved');
   ok(rad.solution.every(s=>/\\square/.test(s.tex)),'Rationalization steps must require completion');
   eq((rad.tex.match(/=/g)||[]).length,1,'Remove the already-simplified denominator from the question');
  }
  eq(Q.rampLevelFor('NS3',1),null,'A bond-of-five lesson must not silently become bonds of ten');
  eq(Q.rampLevelFor('NS4',1),null,'Tens complements must not silently become ones subtraction');
  for(let seed=1;seed<=400;seed++){
   for(const [lv,target]of[[1,5],[2,10]]){
    const p=gen('NS3',lv,seed);eq(p.cubes.moveTo,target,'Keep the fixed bond target');
    eq(p.answer,target-p.cubes.piles[0],'Fixed bond arithmetic');
   }
   for(const [lv,target,step]of[[1,100,10],[2,100,1],[3,1000,1]]){
    const p=gen('NS4',lv,seed),m=p.steps[0].tex.match(/^(\d+) \+ \\square = (\d+)/);
    eq(+m[2],target,'Keep the hundred/thousand target');eq(+m[1]%step,0,'Known addend stays in the level step');
    eq(p.answer,target- +m[1],'Hundred/thousand complement');
   }
  }
  for(let seed=1;seed<=120;seed++){
   const p=gen('WP3',1,seed);
   ok(!/변화|부분전체|비교|동수누가|등분제|포함제/.test(p.answerNote.ko),'Keep teacher classification out of the public answer note');
  }
  const visibleBonds=new Set(),rawBonds=new Set();
  for(let k=1;k<5;k++)for(let form=0;form<8;form++){
   const values=[.5,(k-.5)/4,(form+.5)/8];let pos=0;
   const p=NM_TGEN.ns3_comp510({target:5},()=>values[pos++]);p.__bond=true;
   const h=Q.w2CellHtml(p,1,'NS3',false,false,'visual',0,1,false,'');
   ok(h.includes('nm-bond')&&h.includes('nm-w2-tex'),'Bond picture and equation both remain visible');
   rawBonds.add(p.tex);visibleBonds.add(h);
   const infant=Q.withC0(NM_COURSES.C0.sessions[0].c0,()=>Q.w2CellHtml(p,1,'NS3',false,false,'visual',0,1,false,''));
   ok(!infant.includes('data-tex='),'Do not add equation notation to the C0 picture profile');
  }
  eq(rawBonds.size,32,'Finite fixed-target pool');eq(visibleBonds.size,32,'A hidden expression alone is not a new visible problem');
  const blocks=[0,1,2,3].map(()=>({base10:{tens:5,ones:6},tex:'50 + 6 = \\square',answer:56}));
  Q.applyPartialBlanks(blocks,'medium',{});eq(blocks.map(p=>p.answer),[56,56,56,56],'Pictures retain their whole-number answer');
  for(const [t,lv]of[['MD34',3],['MD85',4],['MD101',2],['MD105',2],['MD110',3],['MD127',3],['MD153',1],['MD156',2],['MD158',2],['MD159',2]]){
   for(let seed=1;seed<=12;seed++){const p=gen(t,lv,seed),ask=Q.printAskText(p,t);ok(ask&&ask.length>5,'Required prompt missing '+t);const html=Q.w2CellHtml(p,1,t,false,false,'long',0,1,false,'');ok(html.includes('nm-print-ask'),'Printed question lost condition '+t);}
  }
  for(let seed=1;seed<=24;seed++){
   const p=gen('ML25',1,seed),h=Q.w2CellHtml(p,1,'ML25',false,false,'visual',0,1,false,'');
   ok(h.includes('nm-print-ask'),'Number line needs a question');if(p.numline.blank<0)ok(h.includes('뛴 횟수')&&h.includes('boxed'),'Hop count needs a writing box');
  }
  const lt=NM_LANG_THINK.pageHtml(12,'review','ko','C0','review',true),key=NM_LANG_THINK.pageHtml(12,'review','ko','C0','review',true,true);
  ok(!lt.includes('nm-lt-answers'),'Answers leaked onto student language page');ok(key.includes('nm-lt-answer-key'),'Language answers must remain in guardian key');
  eq(Q.stripConceptTags('<b>조건</b> 1<x<3, x>0'),'조건 1<x<3, x>0','Inequalities must survive HTML stripping');
  for(const c of Object.values(NM_COURSES).filter(c=>c.order>0&&c.order%3===0)){
   for(let i=0;i<c.sessions.length;i++){
    const e=NM_EXAM.weeklyEnvelope(c,'C'+c.order,'2026-W43',{startSession:i+1,legacySession:true});
    if(e)eq(e.items.some(it=>(it.topicName||'').startsWith('단계 점검')),i===c.sessions.length-1,'Stage-check timing C'+c.order+' S'+(i+1));
   }
  }
  return{assertions};
 });
 console.log('PASS review P0',result);
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
