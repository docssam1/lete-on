import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { domains, problemsFor, answerFor, grade, optionLabels } from './core.js';

const base=process.env.GFIELD_BASE_URL || 'http://127.0.0.1:8765';
const out=fileURLToPath(new URL('./qa-artifacts/',import.meta.url));
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];
page.on('pageerror',error=>errors.push(error.message));
let flows=0,layouts=0,alternateSolutions=0;
async function layout() {
  const result=await page.evaluate(()=>{
    const svg=document.querySelector('#board svg'),bounds=svg.getBoundingClientRect();
    return {overflow:document.documentElement.scrollWidth>innerWidth,
      text:[...document.querySelectorAll('h1,h2,button,summary,.domain-tabs a,.choices label,.conditions')].filter(el=>el.clientWidth&&el.scrollWidth>el.clientWidth+1).map(el=>el.textContent),
      labels:[...svg.querySelectorAll('text')].filter(el=>{const b=el.getBoundingClientRect();return b.left<bounds.left-1||b.right>bounds.right+1||b.top<bounds.top-1||b.bottom>bounds.bottom+1;}).map(el=>el.textContent),width:bounds.width,height:bounds.height};
  });
  assert.equal(result.overflow,false,JSON.stringify(result));assert.deepEqual(result.text,[],JSON.stringify(result));assert.deepEqual(result.labels,[],JSON.stringify(result));assert.ok(Math.abs(result.width-result.height)<1);layouts++;
}
async function select(ids) {
  for(const input of await page.locator('#choices input:checked').all())await input.uncheck();
  for(const id of ids)await page.locator(`#choice-${id}`).check();
}
async function student(p) {
  assert.equal(await page.locator('#review').isVisible(),false);
  assert.equal(await page.locator('#check').isDisabled(),true);
  if(p.domain==='parallel'||p.domain==='right')assert.equal(await page.locator('#board [data-mark]').count(),0);
  if(p.domain==='build') {assert.equal(await page.locator('#board [data-label="D"]').count(),0);assert.equal(await page.locator('[data-shape="complete"]').count(),0);}
}
try {
  await page.goto(`${base}/geometry/games/quadrilateral/`);await page.waitForSelector('#board svg');
  const preserved={name:'QA learner',progress:{perimeter:{untouched:true},other:{score:91}},settings:{a:1}};
  await page.evaluate(profile=>localStorage.setItem('gfield-profile',JSON.stringify(profile)),preserved);
  for(const width of [1280,390]) {
    await page.setViewportSize({width,height:900});
    for(const domain of domains)for(let round=0;round<4;round++) {
      await page.evaluate(({level,round})=>localStorage.setItem(`gfield-pool-quadrilateral-${level}`,String(round)),{level:domain.level,round});
      await page.goto(`${base}/geometry/games/quadrilateral/?domain=${domain.id}&lang=ko`);await page.waitForSelector('#board svg');
      for(let i=0;i<5;i++) {
        const p=problemsFor(domain.id)[round*5+i],answers=answerFor(p);
        assert.equal(await page.locator('#board').getAttribute('data-problem-id'),p.id);await student(p);await layout();
        if(i===0&&round===0)await page.screenshot({path:`${out}/${domain.id}-${width}-student.png`,fullPage:true});
        if(domain.id==='build') {
          const occupied=p.vertices[0];await page.locator(`[data-point="${occupied}"]`).click();
          assert.equal(await page.locator('[data-label="D"]').count(),0);assert.equal(await page.locator('[data-shape="complete"]').count(),0);
          await page.locator('#check').click();assert.equal(await page.locator('#review').isVisible(),false);assert.ok(await page.locator('#feedback').textContent());
          await page.locator('#undo').click();assert.equal(await page.locator('[aria-pressed="true"]').count(),0);
          const choice=answers.find(point=>String(point)!==String(p.example)) || answers[0];
          if(String(choice)!==String(p.example))alternateSolutions++;
          assert.equal(grade(p,choice).correct,true);await page.locator(`[data-point="${choice}"]`).click();
          await page.selectOption('#language','ja');assert.equal(await page.locator(`[data-point="${choice}"]`).getAttribute('aria-pressed'),'true');
          await page.selectOption('#language','ko');
        } else {
          assert.deepEqual(await page.locator('#choices input').evaluateAll(nodes=>nodes.map(node=>node.value)),optionLabels(domain.id).map(o=>o.id));
          const wrong=answers.includes('none')?[optionLabels(domain.id)[0].id]:['none'];
          await select(wrong);await page.locator('#check').click();assert.equal(await page.locator('#review').isVisible(),false);
          await select(answers);await page.selectOption('#language','en');
          assert.deepEqual((await page.locator('#choices input:checked').evaluateAll(nodes=>nodes.map(n=>n.value))).sort(),[...answers].sort());
          await page.selectOption('#language','ko');
        }
        await page.locator('#check').click();assert.equal(await page.locator('#review').isVisible(),true,JSON.stringify({id:p.id,width,answers,feedback:await page.locator('#feedback').textContent(),selection:await page.locator('#choices input:checked').evaluateAll(nodes=>nodes.map(n=>n.value)),readout:await page.locator('#pointReadout').textContent()}));await layout();flows++;
        if(domain.id==='build')assert.ok((await page.locator('#solution').textContent()).includes((await page.locator('#pointReadout').textContent()).match(/\(.*\)/)[0]));
        if(i===0&&round===0)await page.screenshot({path:`${out}/${domain.id}-${width}-answer.png`,fullPage:true});
        await page.locator('#next').click();
      }
      assert.equal(await page.locator('#completion').isVisible(),true);
      await page.keyboard.press('Escape');assert.equal(await page.locator('#completion').isVisible(),false);
      assert.equal(await page.locator('#review').isVisible(),true);
    }
  }
  for(const width of [320,768])for(const lang of ['ko','en','zh','ja'])for(const domain of domains) {
    await page.setViewportSize({width,height:900});await page.goto(`${base}/geometry/games/quadrilateral/?domain=${domain.id}&lang=${lang}`);await page.waitForSelector('#board svg');await layout();
    assert.equal(await page.locator('html').getAttribute('lang'),lang);
    const completePrompt=await page.evaluate(async()=>{const {problemsFor,promptPartsFor}=await import('./core.js?v=quad-1');const p=problemsFor(new URL(location.href).searchParams.get('domain')).find(p=>p.id===document.querySelector('#board').dataset.problemId);return promptPartsFor(p,document.documentElement.lang);});
    assert.deepEqual({question:await page.locator('#prompt').textContent(),conditions:await page.locator('#conditions p').allTextContents()},completePrompt);
    assert.ok((await page.locator('#worksheet').getAttribute('href')).includes(`domain=${domain.id}&lang=${lang}`));
    await page.screenshot({path:`${out}/${domain.id}-${width}-${lang}.png`,fullPage:true});
  }
  await page.goto(`${base}/geometry/games/quadrilateral/?domain=build&lang=ko`);await page.waitForSelector('[data-point]');
  await page.locator('[data-point="0,0"]').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press(' ');
  assert.equal(await page.locator('[data-point="1,0"]').getAttribute('aria-pressed'),'true');
  await page.selectOption('#language','zh');assert.equal(await page.locator('[data-point="1,0"]').getAttribute('tabindex'),'0');
  await page.locator('#retry').click();assert.equal(await page.locator('[aria-pressed="true"]').count(),0);assert.equal(await page.locator('#check').isDisabled(),true);
  await page.goto(`${base}/geometry/games/quadrilateral/?domain=right`);await page.waitForSelector('[data-vertex]');
  await page.locator('#choice-none').check();await page.locator('[data-vertex="A"]').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('Enter');
  assert.equal(await page.locator('#choice-B').isChecked(),true);assert.equal(await page.locator('#choice-none').isChecked(),false);
  await page.locator('#undo').click();assert.equal(await page.locator('#choice-none').isChecked(),true);
  await page.locator('#choice-A').check();assert.equal(await page.locator('#choice-none').isChecked(),false);
  await page.locator('#choice-none').check();assert.equal(await page.locator('#choices input:checked').count(),1);
  await page.locator('#retry').click();assert.equal(await page.locator('#choices input:checked').count(),0);
  const profile=await page.evaluate(()=>JSON.parse(localStorage.getItem('gfield-profile')));
  assert.equal(profile.name,preserved.name);assert.deepEqual(profile.settings,preserved.settings);assert.deepEqual(profile.progress.perimeter,preserved.progress.perimeter);assert.deepEqual(profile.progress.other,preserved.progress.other);assert.ok(profile.progress.quadrilateral);
  const touch=await browser.newContext({viewport:{width:320,height:844},hasTouch:true,isMobile:true,serviceWorkers:'block'}),tp=await touch.newPage();
  await tp.goto(`${base}/geometry/games/quadrilateral/?domain=build`);await tp.waitForSelector('[data-point]');
  const bounds=await tp.locator('[data-point="2,2"] rect').boundingBox();assert.ok(bounds.width>=44&&bounds.height>=44,JSON.stringify(bounds));
  await tp.locator('[data-point="2,2"]').tap();assert.equal(await tp.locator('[data-point="2,2"]').getAttribute('aria-pressed'),'true');await touch.close();
  await page.goto(`${base}/geometry/games/quadrilateral/?domain=parallel&level=1`);await page.waitForSelector('#board svg');
  const first=await page.locator('#board').getAttribute('data-problem-id');
  await page.goto(`${base}/geometry/games/quadrilateral/?domain=parallel&level=1&practice=1`);await page.waitForSelector('#board svg');assert.notEqual(await page.locator('#board').getAttribute('data-problem-id'),first);
  const nonblank=await page.evaluate(async()=>{
    const svg=document.querySelector('#board svg'),url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'})),img=new Image();
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
    const canvas=document.createElement('canvas');canvas.width=400;canvas.height=400;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);URL.revokeObjectURL(url);
    const pixels=ctx.getImageData(0,0,400,400).data;let count=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i+3]>0&&Math.max(pixels[i],pixels[i+1],pixels[i+2])-Math.min(pixels[i],pixels[i+1],pixels[i+2])>20)count++;return count;
  });assert.ok(nonblank>500,`Blank diagram: ${nonblank}`);
  const renderAudit=await page.evaluate(async()=>{
    const {renderProblem}=await import('./render.js?v=quad-1'),{problemsFor}=await import('./core.js?v=quad-1');
    const host=document.createElement('div');host.style.cssText='width:400px;position:absolute;left:0;top:0';document.body.append(host);
    let attempts=0;const failures=[];
    for(const lang of ['ko','en','zh','ja'])for(const p of problemsFor('build'))for(let y=0;y<7;y++)for(let x=0;x<7;x++) {
      host.innerHTML=renderProblem(p,{lang,interactive:true,selectedPoint:[x,y]});
      const svg=host.querySelector('svg'),outer=svg.getBoundingClientRect(),labels=[...svg.querySelectorAll('text')].map(el=>({id:el.textContent,b:el.getBoundingClientRect()}));
      for(const {id,b} of labels)if(b.left<outer.left||b.right>outer.right||b.top<outer.top||b.bottom>outer.bottom)failures.push({p:p.id,x,y,id,kind:'bounds'});
      for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++) {const a=labels[i].b,b=labels[j].b;if(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)failures.push({p:p.id,x,y,kind:'overlap'});}
      const occupied=p.vertices.some(v=>v[0]===x&&v[1]===y);if(occupied&&svg.querySelector('[data-label="D"]'))failures.push({p:p.id,x,y,kind:'occupied'});
      const xml=new DOMParser().parseFromString(host.innerHTML,'image/svg+xml');if(xml.querySelector('parsererror'))failures.push({p:p.id,x,y,kind:'xml'});attempts++;
    }
    host.remove();return {attempts,failures};
  });
  assert.deepEqual(renderAudit.failures,[]);assert.deepEqual(errors,[]);
  const report={flows,layouts,alternateSolutions,allCandidateRenderings:renderAudit.attempts,nonblankPixels:nonblank,touch:true,keyboard:true,noneExclusive:true,profilePreserved:true,errors,learner_stage:'초등 도형 · 사각형의 성질과 분류','learner-fit':{language:'Four localized flows; inclusive trapezoid rule visible in all languages',representations:'Exact equal-scale 7x7 grid; no preanswer marks or D; every candidate checked',prerequisites:'Recognizing parallel lines and right angles; classification is enrichment','reasoning-load':'Separate parallel/right/classify/build domains, five problems per session','response-mode':'Native multi-selection and direct point construction with touch and keyboard'}};
  await writeFile(`${out}/game-report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
} catch(error) {await page.screenshot({path:`${out}/failure.png`,fullPage:true});throw error;}
finally {await browser.close();}
