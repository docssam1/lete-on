#!/usr/bin/env node
'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..'),out=process.env.NM_MD87_ARTIFACTS;
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const errors=[],results=[];
  try{
    if(out)fs.mkdirSync(out,{recursive:true});
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1100,height:1100}});page.setDefaultTimeout(45000);
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'산점도 검수',avatar:{kind:'boy'},cloudLinked:false,progress:{}}));});
    const url='http://127.0.0.1:'+server.address().port;
    await page.goto(url+'/drill.html',{waitUntil:'networkidle',timeout:60000});
    await page.addScriptTag({url:url+'/engine/threads/mid15.js'});await page.addScriptTag({url:url+'/data/units/M-87.js'});
    await page.evaluate(()=>{
      NM_THREADS.MD87={name:{ko:'산점도와 상관관계'},gen:'md87_scatter',unit:'M-87',widgets:['numpad','graphPlane'],levels:[
        {id:1,label:{ko:'순서쌍 직접 찍기'},params:{mode:'plot'}},{id:2,label:{ko:'조건에 맞는 점 세기'},params:{mode:'read'}},{id:3,label:{ko:'양·음·무상관'},params:{mode:'correlation'}},{id:4,label:{ko:'방향과 강도'},params:{mode:'strength'}}]};
      const current=Object.assign({},window.NM_MIDDLE_CONCEPTS||{});
      current.MD87={why:'두 변량의 같은 대상 자료를 (x,y)로 묶어 점으로 나타내면 전체 변화 경향을 볼 수 있습니다.',rule:'\\nearrow: 양의 상관, \\searrow: 음의 상관, 방향 없음: 상관관계 없음',steps:['표의 같은 열을 (x,y)로 묶습니다.','x축에서 먼저 찾고 y축 높이로 이동해 점을 찍습니다.','전체 점구름의 방향과 모인 정도를 봅니다.'],caution:'점을 선으로 잇지 않고 한 점보다 전체 경향을 봅니다.',source:'3-2:144-153'};
      window.NM_MIDDLE_CONCEPTS=current;
    });
    await page.emulateMedia({media:'print'});await page.addStyleTag({content:'@media print{html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}}'});
    for(let level=1;level<=4;level++){
      const count=level===1||level===3?12:24;
      const result=await page.evaluate(async cfg=>{
        NM_EXAM.renderPrint(cfg);await document.fonts.ready;await new Promise(requestAnimationFrame);
        const s=document.querySelector('.nm-print-sheet'),practice=[...s.querySelectorAll('.nm-w2-page')].filter(p=>p.querySelector('.nm-w2-item'));
        const bad=[];
        for(const e of s.querySelectorAll('.nm-w2-page,.nm-w2-item,.nm-scatter,.nm-scatter-table,.nm-gp')){
          const rect=e.getBoundingClientRect(),parent=e.closest('.nm-w2-page'),pr=parent&&parent.getBoundingClientRect();
          if(e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3||(pr&&(rect.bottom>pr.bottom+3||rect.left<pr.left-3||rect.right>pr.right+3)))bad.push({cls:String(e.className),w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight});
        }
        return{questions:s.querySelectorAll('.nm-w2-item').length,keys:s.querySelectorAll('.nm-ak-item').length,katex:s.querySelectorAll('.katex-error').length,
          pageCounts:practice.map(p=>p.querySelectorAll('.nm-w2-item').length),studentPoints:practice.reduce((n,p)=>n+p.querySelectorAll('.nm-gp-pt').length,0),
          tables:practice.reduce((n,p)=>n+p.querySelectorAll('.nm-scatter-table').length,0),teacherPlots:s.querySelectorAll('.nm-scatter-ak-item').length,
          teacherPoints:s.querySelectorAll('.nm-scatter-ak .nm-gp-pt').length,bad};
      },{thread:'MD87',level,count,seed:'md87-browser-'+level});
      assert.equal(result.questions,count);assert.equal(result.keys,count);assert.equal(result.katex,0);assert.deepEqual(result.bad,[],'L'+level+' overflow '+JSON.stringify(result.bad));
      assert(result.pageCounts.every(n=>n>=6),'L'+level+' fewer than six on practice page: '+result.pageCounts);
      if(level===1){assert.equal(result.tables,12);assert.equal(result.studentPoints,0,'student plotting grid must be blank');assert.equal(result.teacherPlots,12);assert.equal(result.teacherPoints,72,'teacher key must complete all six points');}
      else{assert.equal(result.tables,0);assert.equal(result.studentPoints,count*8);assert.equal(result.teacherPlots,0);}
      results.push({level,count,...result});
      if(out&&(level===1||level===4))await page.locator('.nm-w2-page').filter({has:page.locator('.nm-w2-item')}).first().screenshot({path:path.join(out,'MD87-L'+level+'-a4-practice.png')});
      if(out&&level===1)await page.locator('.nm-scatter-ak').screenshot({path:path.join(out,'MD87-L1-teacher-completed-plots.png')});
    }
    await page.emulateMedia({media:'screen'});
    for(const width of [1440,390]){
      await page.setViewportSize({width,height:width===390?844:1000});
      await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD87',level:4,count:24,seed:'md87-preview'}],'중3 산점도',{pacing:true}));
      await page.waitForSelector('#nm-pe-overlay [data-scatter-mode="strength"]');
      const ui=await page.evaluate(()=>{const o=document.querySelector('#nm-pe-overlay');return{questions:o.querySelectorAll('.nm-w2-item').length,katex:o.querySelectorAll('.katex-error').length,docOverflow:document.documentElement.scrollWidth>innerWidth+2,overlayOverflow:o.scrollWidth>o.clientWidth+2,viewport:innerWidth};});
      if(out)await page.screenshot({path:path.join(out,'MD87-L4-preview-'+width+'.png')});
      assert.equal(ui.questions,24);assert.equal(ui.katex,0);assert.equal(ui.docOverflow,false,JSON.stringify(ui));assert.equal(ui.overlayOverflow,false,JSON.stringify(ui));results.push(ui);
      await page.locator('#nm-pe-close').click();
    }
    assert.deepEqual(errors,[]);if(out)fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));
    console.log(JSON.stringify({ok:true,results,errors},null,2));
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
