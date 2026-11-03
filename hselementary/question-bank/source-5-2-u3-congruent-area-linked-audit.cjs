'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),os=require('node:os'),fs=require('node:fs'),{execFileSync}=require('node:child_process'),{chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||'playwright');
const output=process.env.MAC_CHECK_OUTPUT||fs.mkdtempSync(path.join(os.tmpdir(),'gfield-overlap-'));
const bank=require('./source-5-2-congruence-page87-practice.js'),q=bank.build(47);assert.equal(q.answer,'80cm²');
const m=q.prompt.match(/M100 30 L([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+) Z M([\d.]+) ([\d.]+) L[\d.]+ [\d.]+ L([\d.]+) ([\d.]+) Z/);assert(m);const [mx,my,dx,dy,bx,by,rx,ry]=m.slice(1).map(Number),G=[100,30],N=[30,180],M=[mx,my],D=[dx,dy],B=[bx,by],R=[rx,ry];
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),area=(a,b,c)=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;
for(const [x,y] of [[dist(G,N),dist(G,R)],[dist(N,D),dist(R,M)],[dist(D,G),dist(M,G)]])assert(Math.abs(x-y)<0.002);
const shaded=area(G,M,D)+area(B,D,R),other=area(G,N,B);assert(Math.abs(shaded-other)<0.05);assert(Math.abs(shaded*(20/dist(G,N))**2-80)<0.002);
const origin=process.env.HSE_AUDIT_ORIGIN||'http://127.0.0.1:8932';
(async()=>{const browser=await chromium.launch({headless:true});try{for(const width of [1280,375]){
 const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());await context.addInitScript(()=>{window.print=()=>{};});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`${origin}/hselementary/question-bank/`);
 await page.locator('#gradeFilter [data-grade="5"]').click();await page.locator('#termFilter [data-term="2"]').click();await page.locator('#unitFilter').selectOption('5-2-u3');
 for(const id of ['5-2-u3-t4','5-2-u3-practice-1-original','5-2-u3-practice-5-original','5-2-u3-practice-6-original'])await page.locator(`#typeList input[data-type-id="${id}"]`).check();
 await page.locator('#questionCountInput').fill('4');await page.locator('#difficultyFilter [data-difficulty="0"]').click();await page.locator('#generateButton').click();await page.waitForFunction(()=>!document.querySelector('#worksheet').hidden);
 assert.equal(await page.locator('#problemView .question-item').count(),4);const q=page.locator('#problemView [data-source-item-id="5-2-u3-practice-47-original"]');assert.equal(await q.count(),1);assert.equal(await q.locator('svg').count(),1);assert.equal(await page.locator('#problemView [data-source-answer]').count(),0);
 await page.locator('#solutionTab').click();const sol=page.locator('#solutionView [data-source-answer="5-2-u3-practice-47-original"]');await sol.waitFor({state:'visible'});assert.match(await sol.innerText(),/80cm[²2]/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(width===1280)for(const mode of ['problem','solution']){await page.locator(mode==='problem'?'#problemTab':'#solutionTab').click();await page.locator('#printMenuButton').click();await page.locator(`#printMenuList [data-print-mode="${mode}"]`).click();await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);const file=path.join(output,`congruent-area-${mode}.pdf`);await page.pdf({path:file,format:'A4',printBackground:true,preferCSSPageSize:true});if(mode==='problem')assert.match(execFileSync('pdfinfo',[file],{encoding:'utf8'}),/^Pages:\s+1$/m);await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));}
 assert.deepEqual(errors,[]);await context.close();
}}finally{await browser.close();}console.log('PASS: original congruent triangle area linked generation, PC/mobile and A4');})().catch(e=>{console.error(e);process.exitCode=1;});
