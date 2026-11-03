'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),os=require('node:os'),fs=require('node:fs'),{execFileSync}=require('node:child_process'),{chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||'playwright');
const output=process.env.MAC_CHECK_OUTPUT||fs.mkdtempSync(path.join(os.tmpdir(),'gfield-overlap-'));
const bank=require('./source-5-2-congruence-page87-practice.js'),q=bank.build(46);assert.equal(q.answer,'75°');
const re=/M40 ([\d.]+) L([\d.]+) 110 L200 30 Z M40 ([\d.]+) L([\d.]+) 110 L200 190 Z/,m=q.prompt.match(re);assert(m);const [top,p1,bottom,p2]=m.slice(1).map(Number), P=[p1,110];assert(Math.abs(p1-p2)<1e-6);
function reflect([x,y],[ax,ay],[bx,by]){const dx=bx-ax,dy=by-ay,t=((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy);return [2*(ax+t*dx)-x,2*(ay+t*dy)-y]};
for(const [vertex,a,b] of [[[40,30],[40,top],[200,30]],[[40,190],[40,bottom],[200,190]]]){const r=reflect(vertex,a,b);assert(Math.hypot(r[0]-P[0],r[1]-P[1])<0.002)}
const u=[P[0]-40,P[1]-top],v=[160,30-top];const angle=Math.acos((u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))*180/Math.PI;assert(Math.abs(angle-75)<0.002);
const origin=process.env.HSE_AUDIT_ORIGIN||'http://127.0.0.1:8932';
(async()=>{const browser=await chromium.launch({headless:true});try{for(const width of [1280,375]){
 const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());await context.addInitScript(()=>{window.print=()=>{};});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`${origin}/hselementary/question-bank/`);
 await page.locator('#gradeFilter [data-grade="5"]').click();await page.locator('#termFilter [data-term="2"]').click();await page.locator('#unitFilter').selectOption('5-2-u3');
 for(const id of ['5-2-u3-t3','5-2-u3-practice-1-original','5-2-u3-practice-5-original','5-2-u3-practice-6-original'])await page.locator(`#typeList input[data-type-id="${id}"]`).check();
 await page.locator('#questionCountInput').fill('4');await page.locator('#difficultyFilter [data-difficulty="0"]').click();await page.locator('#generateButton').click();await page.waitForFunction(()=>!document.querySelector('#worksheet').hidden);
 assert.equal(await page.locator('#problemView .question-item').count(),4);const q=page.locator('#problemView [data-source-item-id="5-2-u3-practice-46-original"]');assert.equal(await q.count(),1);assert.equal(await q.locator('svg').count(),1);assert.equal(await page.locator('#problemView [data-source-answer]').count(),0);
 await page.locator('#solutionTab').click();const sol=page.locator('#solutionView [data-source-answer="5-2-u3-practice-46-original"]');await sol.waitFor({state:'visible'});assert.match(await sol.innerText(),/75°/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(width===1280)for(const mode of ['problem','solution']){await page.locator(mode==='problem'?'#problemTab':'#solutionTab').click();await page.locator('#printMenuButton').click();await page.locator(`#printMenuList [data-print-mode="${mode}"]`).click();await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);const file=path.join(output,`square-fold-${mode}.pdf`);await page.pdf({path:file,format:'A4',printBackground:true,preferCSSPageSize:true});if(mode==='problem')assert.match(execFileSync('pdfinfo',[file],{encoding:'utf8'}),/^Pages:\s+1$/m);await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));}
 assert.deepEqual(errors,[]);await context.close();
}}finally{await browser.close();}console.log('PASS: original square fold linked generation, PC/mobile and A4');})().catch(e=>{console.error(e);process.exitCode=1;});
