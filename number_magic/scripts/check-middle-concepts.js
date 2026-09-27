#!/usr/bin/env node
'use strict';
// NODE_PATH / NM_CHROMIUM: 기존 브라우저 재사용. NM_CONCEPT_ARTIFACTS 지정 시 대표 PDF/PNG도 생성.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..'),out=process.env.NM_CONCEPT_ARTIFACTS;
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  const result={sets:0,pages:0,failures:[],errors:[],pdf:[]};
  if(out)fs.mkdirSync(out,{recursive:true});
  try{
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1100,height:1100}});
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    page.on('pageerror',e=>result.errors.push(e.message));
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;});
    const url='http://127.0.0.1:'+server.address().port;
    await page.goto(url+'/drill.html');
    await page.emulateMedia({media:'print'});
    const geometryStyle=await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    const targets=await page.evaluate(()=>{
      const ids=Object.keys(NM_MIDDLE_CONCEPTS);
      if(ids.length<47)throw Error('Expected at least 47 explicit middle-school topics');
      for(const id of ids){const d=NM_MIDDLE_CONCEPTS[id];if(!NM_THREADS[id]||!d.why||!d.rule||d.steps.length!==3||!d.caution||!d.source)throw Error('Incomplete '+id);}
      return ids.flatMap(thread=>NM_THREADS[thread].levels.map(l=>({thread,level:l.id})));
    });
    result.topics=targets.length?new Set(targets.map(t=>t.thread)).size:0;result.levels=targets.length;
    // 3 seeds across every level. No changes to generator contracts or learner records.
    for(const cfg of targets.filter(t=>!process.env.NM_CONCEPT_THREADS||process.env.NM_CONCEPT_THREADS.split(',').includes(t.thread)))for(const seed of ['concept-a','concept-b','concept-c']){
      const r=await page.evaluate(async cfg=>{
        NM_EXAM.renderPrint(cfg);await document.fonts.ready;await new Promise(requestAnimationFrame);
        const s=document.querySelector('.nm-print-sheet');
        const bad=[];
        const tip=s.querySelector('.nm-mid-tip');
        if(['MD51','MD69'].includes(cfg.thread)){
          if(!tip||!tip.textContent.includes('한 점의 x좌표 × y좌표 = 비례상수 a')||!tip.textContent.includes('−2 × 3 = −6'))bad.push({reason:'missing inverse proportion tip'});
        }else if(tip)bad.push({reason:'inverse proportion tip in unrelated topic'});
        const problemPages=[...s.querySelectorAll('.nm-w2-page')].map(e=>e.querySelectorAll('.nm-w2-item').length).filter(Boolean);
        if(problemPages.slice(0,-1).some(n=>n<6))bad.push({reason:'fewer than six questions before last practice page',problemPages});
        for(const e of s.querySelectorAll('.nm-w2-page,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-guide-item,.nm-w2-item,.nm-ak-grid')){
          const rect=e.getBoundingClientRect(),parent=e.closest('.nm-w2-page');
          if(e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3||(parent&&rect.bottom>parent.getBoundingClientRect().bottom+3))bad.push({cls:e.className,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight});
        }
        const graph=NM_EXAM.buildProblems(cfg.thread,cfg.level,10,NM_RNG.hashSeed(cfg.seed)).some(p=>p.graph);
        return{concept:s.querySelectorAll('[data-middle-concept]').length,example:s.querySelectorAll('.nm-w2-example').length,guides:s.querySelectorAll('.nm-w2-guide-item').length,guideKeys:s.querySelectorAll('.nm-ak-guide-item').length,questions:s.querySelectorAll('.nm-w2-item').length,keys:s.querySelectorAll('.nm-ak-item').length,graph,graphs:s.querySelectorAll('.nm-teach-graph svg').length,katexErrors:s.querySelectorAll('.katex-error').length,bad,pages:s.querySelectorAll('.nm-w2-page').length};
      },{...cfg,count:10,seed});
      if(r.concept!==1||r.example!==1||r.guides!==3||r.guideKeys!==3||r.questions!==10||r.keys!==10||r.katexErrors||r.bad.length||(r.graph&&r.graphs!==4))result.failures.push({...cfg,seed,...r});
      result.sets++;result.pages+=r.pages;
      if(out&&cfg.thread==='MD69'&&cfg.level===2&&seed==='concept-a')await page.locator('.nm-w2-page').first().screenshot({path:path.join(out,'MD69-L2-tip-a4.png')});
    }
    // Teaching changes must not change the scored questions/answers for the same replay code.
    result.seedInvariant=await page.evaluate(()=>{
      for(const thread of Object.keys(NM_MIDDLE_CONCEPTS)){
        const cfg={thread,level:1,count:10,seed:'same-replay'};
        const snapshot=()=>{NM_EXAM.renderPrint(cfg);const s=document.querySelector('.nm-print-sheet');return JSON.stringify([...s.querySelectorAll('.nm-w2-item,.nm-ak-item')].map(e=>e.textContent));};
        const withLessons=snapshot(),data=window.NM_MIDDLE_CONCEPTS;window.NM_MIDDLE_CONCEPTS={};
        let without;try{without=snapshot();}finally{window.NM_MIDDLE_CONCEPTS=data;}
        if(withLessons!==without)throw Error('Scored content changed: '+thread);
      }return true;
    });
    result.noTeach=await page.evaluate(()=>{
      NM_EXAM.renderPrint({thread:'MD69',level:1,count:10,seed:'assessment',noTeach:true});
      const s=document.querySelector('.nm-print-sheet');
      if(s.querySelector('.nm-w2-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-strategy'))throw Error('Assessment leaked teaching');
      return true;
    });
    // Do not add Korean material to the existing English/Chinese routes.
    for(const lang of ['en','zh']){
      await page.evaluate(lang=>{window.S={...(window.S||{}),lang};localStorage.setItem('nm_state_v1',JSON.stringify({lang}));NM_EXAM.renderPrint({thread:'MD69',level:1,count:10,seed:'lang'});},lang);
      assert.equal(await page.locator('[data-middle-concept]').count(),0,lang+' must retain its own language');
    }
    await page.evaluate(()=>{window.S={...(window.S||{}),lang:'ko'};localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko'}));});
    await geometryStyle.evaluate(e=>e.remove());
    if(out && process.argv.includes('--pdf')){
      for(const [thread,level] of [['MD2',2],['MD9',4],['MD63',3],['MD69',2],['MD74',4],['MD78',1],['MD83',5]]){
        await page.evaluate(cfg=>NM_EXAM.renderPrint(cfg),{thread,level,count:12,seed:'source-concept-proof'});await page.evaluate(()=>document.fonts.ready);
        const file=thread+'-L'+level;await page.pdf({path:path.join(out,file+'.pdf'),format:'A4',printBackground:true});result.pdf.push(file+'.pdf');
      }
      await page.emulateMedia({media:'screen'});
      for(const width of [1440,390]){
        await page.setViewportSize({width,height:1050});
        await page.evaluate(()=>localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'검수용',avatar:{kind:'boy'},cloudLinked:false,progress:{},account:{status:'active'}})));
        await page.goto(url+'/index.html?enter=1');
        // 앱 공용 미리보기 편집기를 열고 실제 옵션/레벨 UI를 조작한다.
        await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD69',level:2,seed:'mobile-concept'}],'중등 개념 확인',{count:10}));
        await page.waitForSelector('#nm-pe-overlay');
        assert.equal(await page.locator('#nm-pe-overlay').evaluate(e=>getComputedStyle(e).position),'fixed','Real app preview CSS must be loaded');
        assert.equal(await page.locator('#nm-pe-overlay [data-middle-concept]').count(),1);
        assert.equal(await page.locator('#nm-pe-overlay .nm-teach-graph svg').count(),4);
        await page.locator('#nm-pe-count-seg [data-n="20"]').click();
        assert.equal(await page.locator('#nm-pe-overlay .nm-w2-item').count(),20);
        await page.locator('[data-lvl-sel="0"]').selectOption('1');
        assert.equal(await page.locator('#nm-pe-overlay [data-middle-concept]').count(),1);
        await page.screenshot({path:path.join(out,'preview-'+width+'.png')});
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
        if(overflow)result.failures.push({screenWidth:width,reason:'preview horizontal overflow'});
        await page.locator('#nm-pe-close').click();assert.equal(await page.locator('#nm-pe-overlay').count(),0);
      }
    }
    if(out)fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));
    console.log(JSON.stringify({...result,failures:result.failures.map(f=>({thread:f.thread,level:f.level,seed:f.seed,bad:f.bad,reason:f.reason})).slice(0,8),failureCount:result.failures.length},null,2));assert.equal(result.failures.length,0,'See results.json for all failures');assert.deepEqual(result.errors,[]);
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
