'use strict';
// Local visual/interaction check. All external requests are blocked; no authentication is sent.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'../..'),out=process.env.NM_BOOK_ARTIFACTS;
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(root+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,b=await chromium.launch();const report=[];
try{if(out)fs.mkdirSync(out,{recursive:true});for(const [width,height,lang,motion]of [[375,667,'ko','reduce'],[390,667,'ko','no-preference'],[734,734,'ko','no-preference'],[1280,800,'ko','no-preference'],[390,844,'en','reduce'],[390,844,'zh','reduce'],[667,375,'ko','reduce']]){
 const c=await b.newContext({viewport:{width,height},reducedMotion:motion}),p=await c.newPage(),errors=[],external=[];p.on('pageerror',e=>errors.push(e.message));
 await c.route('**/*',r=>{if(r.request().url().startsWith(base+'/')&&r.request().method()==='GET')return r.continue();external.push(r.request().url());return r.abort();});
 await p.goto(base+'/number_magic/access.html?lang='+lang+'&ws=fixture');await p.locator('#cover-open img').last().waitFor({state:'visible'});
 assert.equal(await p.locator('#login-user').isVisible(),false);assert.equal(await p.locator('form').count(),1);assert.equal(await p.locator('[role=tab],#review-tab').count(),0);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow');
 const cta=await p.locator('#open-book').boundingBox();assert(cta.height>=44&&cta.x>=0&&cta.x+cta.width<=width,'CTA size');
 assert(await p.evaluate(()=>Array.from(document.querySelectorAll('#cover-open img')).every(i=>i.complete&&i.naturalWidth>0)),'cover assets loaded');
 if(out)await p.screenshot({path:path.join(out,`${width}-${height}-${lang}-cover.png`),fullPage:true});
 const url=p.url();await p.click('#open-book');await p.waitForFunction(()=>document.querySelector('#login-book').classList.contains('is-open'));
 assert.equal(p.url(),url,'browse opens a book on the same page');assert.equal(await p.evaluate(()=>document.activeElement.id),'login-user');
 if(motion==='no-preference'){
  await p.waitForTimeout(150);
  const active=await p.locator('.opening-cover').evaluate(e=>({transform:getComputedStyle(e).transform,animations:e.getAnimations().length}));assert(active.animations>0,'book cover must visibly turn');
  if(out)await p.screenshot({path:path.join(out,`${width}-${height}-${lang}-turning.png`)});
  await p.waitForTimeout(900);
 }
 const bounds=await p.locator('#login-book').boundingBox();assert(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=width+1&&bounds.y+bounds.height<=height+1,'book fits viewport');
 for(const id of ['login-user','login-password','login-submit','close-book']){const size=await p.locator('#'+id).evaluate(e=>({font:parseFloat(getComputedStyle(e).fontSize),h:e.getBoundingClientRect().height,w:e.getBoundingClientRect().width}));assert(size.h>=44&&size.w>=44,id+' touch target');if(id!=='close-book')assert(size.font>=16,id+' readable font');}
 if(out)await p.screenshot({path:path.join(out,`${width}-${height}-${lang}-open.png`)});
 for(let i=0;i<9;i++){await p.keyboard.press('Tab');assert(await p.evaluate(()=>document.querySelector('#login-book').contains(document.activeElement)),'focus remains inside the book');}
 await p.fill('#login-password','discard-fixture');await p.keyboard.press('Escape');assert.equal(await p.locator('#login-book').evaluate(e=>e.open),false);assert.equal(await p.evaluate(()=>document.activeElement.id),'open-book');
 await p.click('#open-login');assert.equal(await p.inputValue('#login-password'),'');await p.click('#close-book');assert.equal(await p.locator('#login-book').evaluate(e=>e.open),false);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);report.push({width,height,lang,motion,coverTurn:motion==='no-preference',focusTrap:true,passwordDiscarded:true,externalRequests:0});await c.close();
 }if(out)fs.writeFileSync(path.join(out,'book.json'),JSON.stringify(report,null,2));console.log('ACCESS_BOOK_OK '+JSON.stringify(report));}finally{await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
