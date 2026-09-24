#!/usr/bin/env node
'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const levelDefs=[
  {id:1,params:{mode:'quartilesOdd'},concept:{ko:'자료를 정렬한 뒤 전체 중앙값을 제외하고 양쪽 절반의 중앙값을 구합니다.'}},
  {id:2,params:{mode:'quartilesEven'},concept:{ko:'짝수 개 자료는 같은 수의 두 절반으로 나누어 Q1과 Q3를 구합니다.'}},
  {id:3,params:{mode:'spread'},concept:{ko:'범위는 최댓값−최솟값, 사분위수 범위는 Q3−Q1입니다.'}},
  {id:4,params:{mode:'fiveNumber'},concept:{ko:'최솟값, Q1, 중앙값, Q3, 최댓값을 차례로 구합니다.'}},
  {id:5,params:{mode:'boxRead'},concept:{ko:'수염 끝, 상자 끝, 상자 안의 선을 눈금에 맞추어 읽습니다.'}},
  {id:6,params:{mode:'boxDraw'},concept:{ko:'다섯 수를 표시하고 Q1~Q3 상자, 중앙선, 양끝 수염을 그립니다.'}}
];
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const pageErrors=[];
  const artifacts=process.env.NM_MD86_ARTIFACTS?path.resolve(process.env.NM_MD86_ARTIFACTS):null;if(artifacts)fs.mkdirSync(artifacts,{recursive:true});
  try{
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1440,height:1100}});page.on('pageerror',e=>pageErrors.push(e.message));
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;});
    const url='http://127.0.0.1:'+server.address().port;
    await page.goto(url+'/drill.html',{waitUntil:'networkidle'});
    await page.addScriptTag({url:url+'/engine/threads/mid14.js'});
    await page.addScriptTag({url:url+'/data/units/M-86.js'});
    await page.evaluate(defs=>{
      NM_THREADS.MD86={name:{ko:'사분위수와 상자그림',en:'Quartiles and Box Plots',zh:'四分位数与箱形图'},gen:'md86_quartileBox',prereq:['MD84'],concept:{ko:'자료를 정렬해 사분위수와 상자그림을 구합니다.'},levels:defs};
      NM_MIDDLE_CONCEPTS=Object.assign({},NM_MIDDLE_CONCEPTS,{MD86:{source:'3-2:128-143',why:'자료를 네 구간으로 나누어 중심과 퍼짐을 한눈에 봅니다.',rule:'\\mathrm{IQR}=Q_3-Q_1',steps:['자료를 정렬합니다.','Q2를 구하고 홀수면 제외합니다.','Q1, Q3와 다섯 수를 구합니다.'],caution:'상자그림만 보고 평균이나 정확한 자료 수를 정할 수 없습니다.'}});
    },levelDefs);
    assert.equal(await page.evaluate(()=>typeof NM_TGEN.md86_quartileBox),'function');
    assert.equal(await page.evaluate(()=>!!NM_UNITS['M-86']),true);
    await page.emulateMedia({media:'print'});
    for(let level=1;level<=6;level++){
      const count=level<=2?12:24;
      const result=await page.evaluate(async cfg=>{
        NM_EXAM.renderPrint(cfg);await document.fonts.ready;await new Promise(requestAnimationFrame);
        const s=document.querySelector('.nm-print-sheet'),bad=[];
        for(const e of s.querySelectorAll('.nm-w2-page,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-item,.nm-print-answer-key')){
          if(e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3)bad.push({cls:e.className,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight});
        }
        const pageCounts=[...s.querySelectorAll('.nm-w2-page')].map(p=>p.querySelectorAll('.nm-w2-item').length).filter(Boolean);
        return{concept:s.querySelectorAll('[data-middle-concept]').length,example:s.querySelectorAll('.nm-w2-example').length,guides:s.querySelectorAll('.nm-w2-guide-item').length,questions:s.querySelectorAll('.nm-w2-item').length,keys:s.querySelectorAll('.nm-ak-item').length,katex:s.querySelectorAll('.katex-error').length,plots:s.querySelectorAll('.nm-gp-boxplot').length,blank:s.querySelectorAll('.nm-gp-boxplot.nm-bp-blank').length,completed:s.querySelectorAll('.nm-gp-boxplot:not(.nm-bp-blank)').length,solutionGrid:s.querySelectorAll('.nm-ak-boxplot-item').length,bad,pageCounts};
      },{thread:'MD86',level,count,seed:'md86-browser-'+level});
      assert.equal(result.concept,1,'L'+level+' concept');assert.equal(result.example,1,'L'+level+' example');assert.equal(result.guides,3,'L'+level+' guides');
      assert.equal(result.questions,count,'L'+level+' questions');assert.equal(result.keys,count,'L'+level+' answer keys');assert.equal(result.katex,0,'L'+level+' KaTeX');assert.deepEqual(result.bad,[],'L'+level+' overflow '+JSON.stringify(result.bad));
      assert(result.pageCounts.slice(0,-1).every(n=>n>=6),'L'+level+' fewer than six on non-final practice page '+result.pageCounts);
      if(level===5){assert(result.completed>=count+4,'L5 completed plots missing');assert.equal(result.blank,0,'L5 must not show blank plots');}
      if(level===6){assert(result.blank>=count+3,'L6 student blank plots missing');assert(result.completed>=count+1,'L6 teacher/example complete plots missing');assert.equal(result.solutionGrid,count,'L6 teacher solutions');}
      console.log('PASS A4 MD86 L'+level+': '+count+' questions; pages '+result.pageCounts.join('/')+'; plots '+result.plots+' (blank '+result.blank+', complete '+result.completed+')');
    }
    if(artifacts){await page.locator('.nm-w2-page:has(.nm-bp-blank)').filter({has:page.locator('.nm-w2-item')}).first().screenshot({path:path.join(artifacts,'md86-l6-a4-practice.png')});await page.locator('.nm-ak-boxplot-item').first().screenshot({path:path.join(artifacts,'md86-l6-answer.png')});}
    await page.emulateMedia({media:'screen'});await page.setViewportSize({width:1440,height:1000});
    await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD86',level:5,count:24,seed:'md86-1440'}],'중3 사분위수와 상자그림',{pacing:true}));
    await page.waitForFunction(()=>document.querySelectorAll('#nm-pe-overlay .nm-w2-item').length===24);
    const desktop=await page.evaluate(()=>{const o=document.querySelector('#nm-pe-overlay');return{questions:o.querySelectorAll('.nm-w2-item').length,plots:o.querySelectorAll('.nm-gp-boxplot').length,katex:o.querySelectorAll('.katex-error').length,docOverflow:document.documentElement.scrollWidth>innerWidth+2,overlayOverflow:o.scrollWidth>o.clientWidth+2};});
    assert.equal(desktop.questions,24);assert(desktop.plots>=28);assert.equal(desktop.katex,0);assert.equal(desktop.docOverflow,false);assert.equal(desktop.overlayOverflow,false);if(artifacts)await page.locator('#nm-pe-overlay').screenshot({path:path.join(artifacts,'md86-l5-desktop.png')});
    console.log('PASS 1440px preview: '+JSON.stringify(desktop));await page.click('#nm-pe-close');
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD86',level:6,count:24,seed:'md86-390'}],'중3 사분위수와 상자그림',{pacing:true}));
    await page.waitForFunction(()=>document.querySelectorAll('#nm-pe-overlay .nm-w2-item').length===24);
    const mobile=await page.evaluate(()=>{const o=document.querySelector('#nm-pe-overlay'),s=o.querySelector('.nm-pe-sheet');return{questions:o.querySelectorAll('.nm-w2-item').length,blank:o.querySelectorAll('.nm-bp-blank').length,solutions:o.querySelectorAll('.nm-ak-boxplot-item').length,katex:o.querySelectorAll('.katex-error').length,docOverflow:document.documentElement.scrollWidth>innerWidth+2,overlayOverflow:o.scrollWidth>o.clientWidth+2,sheetWidth:s.getBoundingClientRect().width,viewport:innerWidth};});
    assert.equal(mobile.questions,24);assert(mobile.blank>=27);assert.equal(mobile.katex,0);assert.equal(mobile.docOverflow,false);assert.equal(mobile.overlayOverflow,false);
    if(artifacts)await page.locator('#nm-pe-overlay').screenshot({path:path.join(artifacts,'md86-l6-mobile.png')});
    console.log('PASS 390px preview: '+JSON.stringify(mobile));assert.deepEqual(pageErrors,[]);
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
