'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const V=require('../data/concept-visuals');
assert.equal(Object.keys(V.models).length,10);
for(const [key,m] of Object.entries(V.models)){
 if(m.kind==='decimal')assert.equal(m.answer,m.op==='+'?m.a+m.b:m.a-m.b);
 if(m.kind==='carry'||m.kind==='borrow'){
  const a=m.whole[0]*m.den+m.parts[0],b=m.whole[1]*m.den+m.parts[1];
  assert.equal(m.resultWhole*m.den+m.resultPart,m.kind==='carry'?a+b:a-b);
 }
 if(m.kind==='split')assert.equal(m.right-m.left,m.numerator);
 if(m.kind==='chain'){
  let sum=0;for(let i=1;i<m.end;i++)sum+=1/(i*(i+1));
  assert(Math.abs(sum-(1-1/m.end))<1e-12);
 }
 if(m.kind==='factorial'){let n=1;for(let i=1;i<=m.n;i++)n*=i;assert.equal(n,m.answer);}
 if(m.kind==='factorial-deep'){let n=1;for(let i=m.k+1;i<=m.n;i++)n*=i;assert.equal(n,m.answer);}
 for(const lang of ['ko','en','zh']){
  const html=V.html(...key.split(':'),lang);
  assert(!/undefined|NaN|javascript:/.test(html));
  assert.match(html,/viewBox="0 0 640 164"/);
  if(lang!=='ko')assert(!/[가-힣]/.test(html),'Korean leaked into '+lang+' '+key);
 }
}
assert.equal(V.html('DC1',1),'');
const root=path.resolve(__dirname,'..');
for(const page of ['index.html','drill.html','ws.html'])assert.match(fs.readFileSync(path.join(root,page),'utf8'),/src="data\/concept-visuals.js"/);
const {chromium}=require('./lib/playwright');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end();return;}
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
});
server.listen(0,async()=>{
 let browser;
 try{
  browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1100,height:1000}});
  await page.addInitScript(()=>window.NM_NO_AUTOPRINT=true);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://localhost:${server.address().port}/drill.html`);
  await page.waitForFunction(()=>window.NM_EXAM&&window.NM_CONCEPT_VISUALS);
  await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
  const out=process.env.NM_HANDOFF_ARTIFACTS;if(out)fs.mkdirSync(out,{recursive:true});
  for(const key of Object.keys(V.models)){
   const [thread,level]=key.split(':');
   await page.evaluate(({thread,level})=>{document.querySelectorAll('.nm-print-sheet').forEach(e=>e.remove());NM_EXAM.renderPrint({thread,level:+level,count:12,seed:'concept-review',grade:'6'});},{thread,level});
   await page.emulateMedia({media:'print'});
   await page.waitForTimeout(150);
   assert(await page.locator('[data-concept-visual="'+key+'"]').count(),'Missing printed concept '+key);
   const over=await page.locator('.nm-print-sheet .nm-w2-page').evaluateAll(pages=>pages.map(p=>p.scrollHeight-p.clientHeight));
   assert(over.every(n=>n<=3),'A4 overflow '+key+' '+over);
   if(out){await page.pdf({path:path.join(out,key.replace(':','-')+'.pdf'),format:'A4',printBackground:true});}
  }
  await page.emulateMedia({media:'screen'});
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>{
   document.querySelectorAll('style').forEach(s=>{if(s.textContent.includes('width:190mm!important'))s.remove();});
   document.body.innerHTML='<main style="padding:12px;background:#fff">'+Object.keys(NM_CONCEPT_VISUALS.models).map(k=>NM_CONCEPT_VISUALS.html(...k.split(':'),'ko')).join('')+'</main>';
   document.body.style.cssText='margin:0;overflow:auto;height:auto';document.documentElement.style.height='auto';
  });
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'390px horizontal overflow');
  if(out)await page.screenshot({path:path.join(out,'concepts-390.png'),fullPage:true});
  await page.setViewportSize({width:1100,height:1000});
  if(out)await page.screenshot({path:path.join(out,'concepts-desktop.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('PASS — 10 exact concept diagrams; ko/en/zh; 390px; A4; no runtime errors');
 }catch(e){console.error(e);process.exitCode=1;}finally{if(browser)await browser.close();server.close();}
});
