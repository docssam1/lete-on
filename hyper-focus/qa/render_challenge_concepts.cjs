const fs=require('fs'),path=require('path'),http=require('http'),{chromium}=require('playwright');
const {draw}=require('./render_challenge_more.cjs'),{tileBases}=require('./challenge-more-solvers.cjs');
const lessons=require('../challenge/concept-catalog.js').build(),specials=require('../challenge/concept-specials.js').get();
const root=path.resolve(__dirname,'../..'),assets=path.join(root,'hyper-focus/challenge/assets/concepts'),out=path.join(root,'hyper-focus/output/qa/challenge-concepts');
fs.mkdirSync(assets,{recursive:true});fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(b);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1000,height:1200},deviceScaleFactor:2});
const base='http://127.0.0.1:'+server.address().port+'/hyper-focus/challenge/',errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
try{
 if(!process.env.CONCEPT_SKIP_ASSETS){
  for(const q of Object.values(specials).flat().filter(q=>q.visual))for(const answer of q.visual.answer?[false,true]:[false]){const data=await page.evaluate(draw,{v:q.visual,answer,bases:tileBases});fs.writeFileSync(path.join(assets,q.id+(answer?'-answer':'')+'.png'),Buffer.from(data.split(',')[1],'base64'));}
  const selected=process.env.CONCEPT_ASSET_UNITS?.split(',').map(Number);
  for(const l of lessons.filter(l=>!selected||selected.includes(l.number)))for(const phase of ['example','practice'])for(const answer of [false,true]){
   const content=l[phase][answer?'solutionDiagram':'problemHtml'];if(!content)continue;
   await page.setContent('<!doctype html><html><head><base href="'+base+'"><link rel="stylesheet" href="review.css"><link rel="stylesheet" href="exam.css"><style>html,body{margin:0;padding:0;background:white;color:#183a56;font:16px "Malgun Gothic",sans-serif}#stage{width:660px;padding:8px;display:flow-root;background:white}#stage img,#stage svg{display:block;max-width:100%;width:100%;height:auto;max-height:300px;object-fit:contain}#stage table{margin:auto}#stage .problem-diagram{margin:0}</style></head><body><div id="stage">'+content+'</div></body></html>');
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
   await page.locator('#stage').screenshot({path:path.join(assets,'unit-'+String(l.number).padStart(2,'0')+'-'+phase+(answer?'-answer':'')+'.png')});
  }
 }
 await page.goto(base+'concepts.html');await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});await page.emulateMedia({media:'print'});
 const audit=await page.evaluate(()=>{const pages=[...document.querySelectorAll('.concept-page')],problems=[];for(const [i,p] of pages.entries()){const footer=p.querySelector('.foot'),limit=footer?footer.getBoundingClientRect().top:p.getBoundingClientRect().bottom-25;for(const child of [...p.children].filter(e=>e!==footer)){if(child.getBoundingClientRect().bottom>limit)problems.push({page:i+1,unit:p.dataset.unit,kind:'footer-overlap',tag:child.tagName,bottom:child.getBoundingClientRect().bottom,limit});}if(p.scrollHeight>p.clientHeight+2)problems.push({page:i+1,kind:'overflow'});}return {units:document.querySelectorAll('.lesson').length,pages:pages.length,answerCover:pages.indexOf(document.querySelector('.answer-cover'))+1,problems};});
 await page.pdf({path:path.join(root,'hyper-focus/challenge/output/pdf/challenge-concepts-complete.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
 for(const n of [1,6,14,21,51,54,55,56,58,59,65,66,71,72,74])await page.locator('#unit-'+n).screenshot({path:path.join(out,'unit-'+n+'.png')});
 await page.emulateMedia({media:'screen'});await page.setViewportSize({width:390,height:844});await page.selectOption('#unit','72');await page.check('#answers');const mobile=await page.evaluate(()=>({width:innerWidth,bodyWidth:document.body.scrollWidth,visibleUnits:[...document.querySelectorAll('.lesson')].filter(e=>getComputedStyle(e).display!=='none').length,answerVisible:getComputedStyle(document.querySelector('#unit-72 .practice-key')).display!=='none'}));await page.screenshot({path:path.join(out,'mobile390.png'),fullPage:true});
 const result={errors,audit,mobile};fs.writeFileSync(path.join(out,'layout-report.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(errors.length||audit.problems.length||audit.answerCover%2!==1||mobile.bodyWidth>390||mobile.visibleUnits!==1||!mobile.answerVisible)process.exitCode=1;
}finally{await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
