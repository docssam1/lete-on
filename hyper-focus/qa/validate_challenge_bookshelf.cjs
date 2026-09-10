'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/qa/challenge-bookshelf');
async function main(){
 fs.mkdirSync(out,{recursive:true});let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
 const server=http.createServer((req,res)=>{const relative=decodeURIComponent(new URL(req.url,'http://local').pathname);const file=path.resolve(root,'.'+relative);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html; charset=utf-8');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});
 try{
 for(const width of [1200,390]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});let errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{if(new URL(route.request().url()).hostname!=='127.0.0.1')return route.abort();return route.continue();});
 await page.goto(base+'/challenge/index.html?teacherPreview=1');await page.waitForFunction(()=>document.querySelector('[data-access]')?.getAttribute('aria-disabled')==='false');
 ok(await page.locator('.book-object').count()===6,'six books');ok(await page.locator('.book-spine').count()===6,'six spines');ok(await page.locator('.book-pages').count()===6,'six paper edges');
 ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow '+width);
 ok(await page.locator('[data-access]').evaluateAll(rows=>rows.every(a=>new URL(a.href).searchParams.get('teacherPreview')==='1')),'teacher links preserve preview');
 ok(await page.locator('.cover-brand img').evaluateAll(rows=>rows.every(img=>img.complete&&img.naturalWidth>0)),'all cover logos load');
 ok(await page.locator('.book-cover').evaluateAll(rows=>rows.every(el=>el.scrollHeight<=el.clientHeight+2)),'cover content fits '+width);
 ok(await page.locator('.book-object').evaluateAll(rows=>rows.every(el=>getComputedStyle(el).transformStyle==='preserve-3d'&&getComputedStyle(el).filter==='none')),'book layers preserve true 3D '+width);
 const first=page.locator('[data-access]').first();await first.focus();ok(await first.evaluate(el=>el===document.activeElement),'keyboard focus');ok(await first.evaluate(el=>getComputedStyle(el).outlineStyle==='solid'),'focus visible');
 await page.screenshot({path:path.join(out,'shelf-'+width+'.png'),fullPage:true});ok(errors.length===0,'no page errors');
 await first.press('Enter');await page.waitForURL('**/concepts.html?round=1&teacherPreview=1');ok(true,'keyboard opens correct book');
 await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:850}});
 await page.route('**/access-service.js',route=>route.fulfill({contentType:'application/javascript',body:"window.HFChallengeAccess={isTeacherPreview:()=>false,status:()=>({verified:false}),allow:()=>false,refresh:()=>Promise.resolve()};"}));
 await page.route('**/supabase-client.js',route=>route.fulfill({contentType:'application/javascript',body:''}));
 await page.goto(base+'/challenge/index.html');await page.waitForFunction(()=>document.querySelector('[data-access]')?.getAttribute('aria-disabled')==='true');
 ok(await page.locator('[aria-disabled=true]').count()===6,'all unauthorized books locked');
 await page.locator('[data-access]').last().focus();await page.keyboard.press('Enter');ok(page.url().endsWith('/challenge/index.html'),'locked keyboard does not navigate');ok((await page.locator('#accessStatus').innerText()).includes('승인'),'locked action explains approval');
 await page.screenshot({path:path.join(out,'locked-390.png'),fullPage:true});
 await page.evaluate(()=>{window.HFChallengeAccess.allow=key=>key==='challenge-mock-2';window.dispatchEvent(new Event('hfchallengeaccesschange'));});
 ok(await page.locator('[aria-disabled=false]').count()===1,'individual approval only opens one book');
 ok(await page.locator('[data-access="challenge-mock-2"]').getAttribute('aria-disabled')==='false','correct round approved');
 await page.evaluate(()=>{window.HFChallengeAccess.allow=()=>false;window.dispatchEvent(new Event('hfchallengeaccesschange'));});
 ok(await page.locator('[aria-disabled=true]').count()===6,'revocation immediately relocks every book');
 ok(await page.locator('[data-access]').evaluateAll(rows=>rows.every(a=>!new URL(a.href).searchParams.has('teacherPreview'))),'student links never gain teacher preview');
 await page.close();
 const report={checks,status:'PASS',viewports:[1200,390],scope:'Local bookshelf UI only; no live deployment or student records.'};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
