import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { domains, problemsFor, answerFor, promptPartsFor, learner_stage } from './core.js';

const base=process.env.GFIELD_BASE_URL || 'http://127.0.0.1:8765';
const out=fileURLToPath(new URL('./qa-artifacts/',import.meta.url));
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],languages=['ko','en','zh','ja'];
page.on('pageerror',error=>errors.push(error.message));
let flows=0,layouts=0,negativeAnswers=0,animationBeats=0,cancellations=0,edgeGuards=0,lifecycleChecks=0;
async function visit(domain,lang='ko') {
  await page.goto(`${base}/geometry/games/circle-studio/?domain=${domain}&lang=${lang}`);await page.waitForSelector('#board svg');
}
async function layout() {
  const result=await page.evaluate(()=>{
    const svg=document.querySelector('#board svg'),b=svg.getBoundingClientRect();
    return {overflow:document.documentElement.scrollWidth>innerWidth,
      text:[...document.querySelectorAll('h1,h2,button,summary,.domain-tabs a,.choices label,.conditions,#traceStatus')].filter(el=>el.clientWidth&&el.scrollWidth>el.clientWidth+1).map(el=>el.textContent),
      labels:[...svg.querySelectorAll('text')].filter(el=>{const r=el.getBoundingClientRect();return r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom+1;}).map(el=>el.textContent),width:b.width,height:b.height};
  });
  assert.equal(result.overflow,false,JSON.stringify(result));assert.deepEqual(result.text,[],JSON.stringify(result));assert.deepEqual(result.labels,[],JSON.stringify(result));assert.ok(Math.abs(result.width-result.height)<1);layouts++;
}
async function radius(n) {
  let current=Number(await page.locator('#radius').getAttribute('data-radius'));
  while(current!==n) {await page.locator(current<n?'#increase':'#decrease').click();current=Number(await page.locator('#radius').getAttribute('data-radius'));}
}
async function build(center,r) {
  await page.locator(`[data-point="${center}"]`).click();await radius(r);await page.locator('#trace').click();
  await page.waitForSelector('[data-trace="complete"]');
}
async function correct(p) {
  const a=answerFor(p);
  if(p.domain==='center')await page.locator(`[data-point="${a}"]`).click();
  if(p.domain==='parts')for(const id of a)await page.locator(`#choice-${id}`).check();
  if(p.domain==='measure')await page.locator('#length').fill(String(a));
  if(p.domain==='draw')await build(a.center,a.radius);
  await page.locator('#check').click();assert.equal(await page.locator('#review').isVisible(),true,p.id);
}
async function pixels() {
  return page.evaluate(async()=>{
    const svg=document.querySelector('#board svg'),url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'})),img=new Image();
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
    const canvas=document.createElement('canvas');canvas.width=400;canvas.height=400;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);URL.revokeObjectURL(url);
    const data=ctx.getImageData(0,0,400,400).data;let count=0;
    for(let i=0;i<data.length;i+=4)if(data[i+3]&&Math.max(data[i],data[i+1],data[i+2])-Math.min(data[i],data[i+1],data[i+2])>20)count++;
    return count;
  });
}
try {
  await visit('center');
  const preserved={name:'QA fixture',progress:{perimeter:{untouched:true},other:{score:91}},settings:{a:1}};
  await page.evaluate(profile=>localStorage.setItem('gfield-profile',JSON.stringify(profile)),preserved);
  for(const width of [1280,390]) {
    await page.setViewportSize({width,height:900});
    for(const domain of domains)for(let round=0;round<4;round++) {
      const lang=languages[round];
      await page.evaluate(({level,round})=>localStorage.setItem(`gfield-pool-circle-studio-${level}`,String(round)),{level:domain.level,round});
      await visit(domain.id,lang);
      for(let i=0;i<5;i++) {
        const p=problemsFor(domain.id)[round*5+i],a=answerFor(p);
        assert.equal(await page.locator('#board').getAttribute('data-problem-id'),p.id);
        assert.equal(await page.locator('#review').isVisible(),false);assert.equal(await page.locator('#check').isDisabled(),true);
        assert.deepEqual({question:await page.locator('#prompt').textContent(),conditions:await page.locator('#conditions p').allTextContents()},promptPartsFor(p,lang));
        await layout();
        if(i===0&&round===0)await page.screenshot({path:`${out}/${domain.id}-${width}-student.png`,fullPage:true});
        if(domain.id==='center') {
          assert.equal(await page.locator('[data-selected-center],[data-center-label]').count(),0);
          await page.locator('[data-point="0,0"]').click();
        } else if(domain.id==='parts') {
          assert.equal(await page.locator('[data-part]').count(),4);
          for(const id of ['A','B','C','D'])await page.locator(`#choice-${id}`).check();
        } else if(domain.id==='measure') {
          assert.equal(await page.locator('[data-answer-length]').count(),0);await page.locator('#length').fill(String(a+1));
        } else {
          assert.equal(await page.locator('[data-trace],[data-compass-arm]').count(),0);
          assert.equal(await page.locator('#increase').isDisabled(),true);
          await page.locator('[data-point="0,0"]').click();await radius(3);
          assert.equal(await page.locator('#trace').isDisabled(),true);assert.equal(await page.locator('#traceStatus').getAttribute('data-out-of-grid'),'true');edgeGuards++;
          await page.locator('#retry').click();
          const wrongRadius=String(p.center)==='3,3'&&p.radius===1?2:1;
          await build([3,3],wrongRadius);
          assert.equal(await page.locator('[data-construction-center]').getAttribute('data-construction-center'),'3,3');
          assert.equal(await page.locator('[data-construction-radius]').getAttribute('data-construction-radius'),String(wrongRadius));
        }
        await page.locator('#check').click();assert.equal(await page.locator('#review').isVisible(),false,p.id);negativeAnswers++;
        if(domain.id==='draw')assert.equal(await page.locator('[data-construction-center]').getAttribute('data-construction-center'),'3,3');
        await page.locator('#retry').click();await correct(p);await layout();flows++;
        assert.ok(await page.locator('#solution').textContent());
        if(i===0&&round===0) {assert.ok(await pixels()>500);await page.screenshot({path:`${out}/${domain.id}-${width}-answer.png`,fullPage:true});}
        await page.locator('#next').click();
      }
      assert.equal(await page.locator('#completion').isVisible(),true);await page.keyboard.press('Escape');
    }
  }
  for(const width of [320,768])for(const lang of languages)for(const domain of domains) {
    await page.setViewportSize({width,height:900});await visit(domain.id,lang);await layout();
    assert.equal(await page.locator('html').getAttribute('lang'),lang);
    assert.ok((await page.locator('#worksheet').getAttribute('href')).includes(`domain=${domain.id}&lang=${lang}`));
    if(['center','draw'].includes(domain.id)) {
      assert.equal(await page.locator('[data-point]').count(),49);
      if(width===320) {const b=await page.locator('[data-point="2,2"] rect').boundingBox();assert.ok(b.width>=44&&b.height>=44,JSON.stringify(b));}
    }
    await page.screenshot({path:`${out}/${domain.id}-${width}-${lang}.png`,fullPage:true});
  }
  await visit('measure');
  for(const bad of ['-1','0','1.5','21','999999999999999999999']) {
    await page.locator('#length').fill(bad);await page.locator('#check').click();
    assert.equal(await page.locator('#review').isVisible(),false);assert.equal(await page.locator('#length').getAttribute('aria-invalid'),'true');negativeAnswers++;
  }
  await page.locator('#length').fill('');assert.equal(await page.locator('#check').isDisabled(),true);
  await visit('center');await page.locator('[data-point="0,0"]').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press(' ');
  assert.equal(await page.locator('[data-point="1,0"]').getAttribute('aria-pressed'),'true');
  await page.selectOption('#language','ja');assert.equal(await page.locator('[data-point="1,0"]').getAttribute('tabindex'),'0');
  await page.locator('#undo').click();assert.equal(await page.locator('[aria-pressed="true"]').count(),0);
  await visit('parts');await page.locator('#choice-A').focus();await page.keyboard.press(' ');assert.equal(await page.locator('#choice-A').isChecked(),true);
  await page.selectOption('#language','zh');assert.equal(await page.locator('#choice-A').isChecked(),true);
  await page.locator('#undo').click();assert.equal(await page.locator('#choice-A').isChecked(),false);
  const profile=await page.evaluate(()=>JSON.parse(localStorage.getItem('gfield-profile')));
  assert.equal(profile.name,preserved.name);assert.deepEqual(profile.settings,preserved.settings);assert.deepEqual(profile.progress.perimeter,preserved.progress.perimeter);assert.deepEqual(profile.progress.other,preserved.progress.other);assert.ok(profile.progress['circle-studio']);
  await visit('draw');
  for(const lang of languages)for(const center of [[0,0],[6,6],[0,6],[6,0],[1,3],[5,3]]) {
    await page.selectOption('#language',lang);await page.locator(`[data-point="${center}"]`).click();await radius(3);
    assert.equal(await page.locator('#trace').isDisabled(),true);assert.equal(await page.locator('#check').isDisabled(),true);assert.equal(await page.locator('[data-trace]').count(),0);
    assert.equal(await page.locator('#traceStatus').getAttribute('data-out-of-grid'),'true');edgeGuards++;await layout();
  }
  await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1280,height:900});
  for(const lang of languages)for(const r of [1,2,3]) {
    await visit('draw',lang);await page.locator('[data-point="3,3"]').click();await radius(r);
    assert.equal(await page.locator('[data-trace]').count(),0);assert.equal(await page.locator('#check').isDisabled(),true);
    await page.locator('#trace').click();
    for(const target of [.15,.45,.75]) {
      await page.waitForFunction(target=>Number(document.querySelector('[data-trace-progress]')?.dataset.traceProgress)>=target,target);
      const beat=await page.locator('[data-construction-center]').evaluate(node=>{
        const arm=node.querySelector('[data-compass-arm]'),n=k=>Number(arm.getAttribute(k));
        return {progress:Number(node.dataset.traceProgress),length:Math.hypot(n('x2')-n('x1'),n('y2')-n('y1')),trace:node.querySelector('[data-trace]')?.dataset.trace};
      });
      assert.ok(beat.progress<1);assert.ok(Math.abs(beat.length-r*56)<1e-6);assert.equal(beat.trace,'partial');assert.equal(await page.locator('#check').isDisabled(),true);animationBeats++;
      if(lang==='ko'&&r===2&&target===.45)await page.screenshot({path:`${out}/compass-mid-sweep.png`,fullPage:true});
    }
    await page.waitForSelector('[data-trace="complete"]');assert.equal(await page.locator('#check').isDisabled(),false);animationBeats++;
  }
  for(const action of ['cancel','undo','retry','language','center','radius']) {
    await visit('draw');await page.locator('[data-point="3,3"]').click();await radius(2);await page.locator('#trace').click();
    await page.waitForSelector('[data-trace="partial"]');
    if(action==='language')await page.selectOption('#language','en');
    else if(action==='center')await page.locator('[data-point="2,2"]').click();
    else if(action==='radius')await page.locator('#increase').click();
    else await page.locator(`#${action}`).click();
    await page.waitForTimeout(1700);assert.equal(await page.locator('[data-trace]').count(),0,action);assert.equal(await page.locator('#check').isDisabled(),true,action);cancellations++;
  }
  await page.emulateMedia({reducedMotion:'reduce'});await visit('draw');await page.locator('[data-point="3,3"]').click();await page.locator('#trace').click();
  assert.equal(await page.locator('[data-trace]').getAttribute('data-trace'),'complete');
  await page.selectOption('#language','ja');assert.equal(await page.locator('[data-trace]').count(),0);
  const restore=()=>page.evaluate(()=>{
    dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));
    dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));
  });
  await visit('draw');
  const restoreId=await page.locator('#board').getAttribute('data-problem-id'),restoreProblem=problemsFor('draw').find(p=>p.id===restoreId),restoreAnswer=answerFor(restoreProblem);
  await build(restoreAnswer.center,restoreAnswer.radius);await restore();
  assert.equal(await page.locator('[data-trace="complete"]').count(),1);assert.equal(await page.locator('#check').isDisabled(),false);
  await page.locator('#check').click();assert.equal(await page.locator('#review').isVisible(),true);lifecycleChecks++;
  await restore();assert.equal(await page.locator('[data-trace="complete"]').count(),1);assert.equal(await page.locator('#review').isVisible(),true);lifecycleChecks++;
  await page.emulateMedia({reducedMotion:'no-preference'});await visit('draw');await page.locator('[data-point="3,3"]').click();await page.locator('#trace').click();
  await page.waitForSelector('[data-trace="partial"]');await restore();await page.waitForTimeout(1700);
  assert.equal(await page.locator('[data-trace]').count(),0);assert.equal(await page.locator('#check').isDisabled(),true);assert.equal(await page.locator('#board').getAttribute('data-trace-state'),'empty');lifecycleChecks++;
  const touch=await browser.newContext({viewport:{width:320,height:844},hasTouch:true,isMobile:true,serviceWorkers:'block',reducedMotion:'reduce'}),tp=await touch.newPage();
  await tp.goto(`${base}/geometry/games/circle-studio/?domain=draw`);await tp.waitForSelector('[data-point]');
  await tp.locator('[data-point="3,3"]').tap();await tp.locator('#increase').tap();await tp.locator('#trace').tap();assert.equal(await tp.locator('[data-trace="complete"]').count(),1);await touch.close();
  const blocked=await browser.newContext({serviceWorkers:'block'});
  await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Unavailable','QuotaExceededError');};});
  const bp=await blocked.newPage();await bp.goto(`${base}/geometry/games/circle-studio/?domain=measure`);await bp.waitForSelector('#board svg');
  const id=await bp.locator('#board').getAttribute('data-problem-id'),problem=problemsFor('measure').find(p=>p.id===id);
  await bp.locator('#length').fill(String(answerFor(problem)));await bp.locator('#check').click();assert.equal(await bp.locator('#review').isVisible(),true);assert.ok(await bp.locator('#storageWarning').textContent());await blocked.close();
  await visit('center');const first=await page.locator('#board').getAttribute('data-problem-id');
  await page.goto(`${base}/geometry/games/circle-studio/?domain=center&level=1&practice=1`);await page.waitForSelector('#board svg');assert.notEqual(await page.locator('#board').getAttribute('data-problem-id'),first);
  assert.deepEqual(errors,[]);
  const sourceHashes={};for(const file of ['app.js','core.js','render.js','i18n.js','styles.css','index.html'])sourceHashes[file]=createHash('sha256').update(await readFile(new URL(file,import.meta.url))).digest('hex');
  const report={passed:true,flows,layouts,negativeAnswers,animationBeats,cancellations,edgeGuards,lifecycleChecks,lifecycleMethod:'Synthetic persisted pagehide/pageshow: complete ungraded, accepted, interrupted sweep',touch:true,keyboard:true,reducedMotion:true,profilePreserved:true,storageFailureHandled:true,languages,viewports:[320,390,768,1280],learner_stage,'learner-fit':{language:'All four languages exercised through complete flows',representations:'Fixed true circles, four separate parts diagrams, cm labels, 49-point grid',prerequisites:'Grid points, cm, doubling and halving even whole numbers','reasoning-load':'Four separate domains; five questions per visit','response-mode':'Roving point buttons, native checkboxes, numeric cm input, integer opening and compass trace'},sourceHashes,errors};
  await writeFile(`${out}/game-report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
} catch(error) {await page.screenshot({path:`${out}/game-failure.png`,fullPage:true});throw error;}
finally {await browser.close();}
