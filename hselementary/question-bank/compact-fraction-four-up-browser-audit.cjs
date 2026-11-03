'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.HSE_PLAYWRIGHT_PATH || 'playwright');
const origin = process.env.HSE_AUDIT_ORIGIN || 'http://127.0.0.1:8932';
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const context = await browser.newContext({viewport:{width:794,height:1123},serviceWorkers:'block'});
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname.endsWith('/hselementary/question-bank/app.js')) {
        const source = fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
        const needle = '  function renderProblems() {';
        assert(source.includes(needle));
        return route.fulfill({contentType:'application/javascript',body:source.replace(needle, '  window.__compactAudit = {isCompactFractionProblem, problemWeight, render: questions => { state.questions = questions; renderProblems(); }};\n'+needle)});
      }
      return route.continue();
    });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${origin}/hselementary/question-bank/`);
    await page.waitForFunction(() => window.__compactAudit && window.HSE_GENERATORS);
    await page.emulateMedia({media:'print'});
    const result = await page.evaluate(async () => {
      document.querySelector('#bankLayout').hidden=true;
      document.querySelector('#worksheet').hidden=false;
      document.body.dataset.printMode='problem';
      const types = HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(g=>g.types.map(t=>({...t, __auditUnitName:u.name}))))).filter(t=>!t.reviewLocked);
      const longType=types.find(t=>t.id==='4-2-u1-t6-2');
      const longQuestion=HSE_GENERATORS.generate(longType,0,0,0,0);
      const longWeight=__compactAudit.problemWeight({...longQuestion,type:longType,sourceItemId:longType.id});
      const candidates = [];
      for (const type of types) for (const seed of [0, 69173, 92741]) {
        try {
          const q=HSE_GENERATORS.generate(type,0,0,seed,0);
          if (!q) continue;
          const item={...q, type:{...type,grade:Number(type.id.split('-')[0])||5,term:Number(type.id.split('-')[1])||1,unitName:type.__auditUnitName},level:{},difficulty:'심화 기준',sourceItemId:q.sourceItemId||type.sourceItemId||type.id};
          if (__compactAudit.isCompactFractionProblem(item) && __compactAudit.problemWeight(item)<3) candidates.push(item);
        } catch (_) { /* Some generators do not support this seed. */ }
      }
      const failures=[];
      for (let offset=0;offset<candidates.length;offset+=4) {
        const group=candidates.slice(offset,offset+4).map((q,i)=>({...q,number:i+1}));
        __compactAudit.render(group);
        const sheet=document.querySelector('#problemView .print-page');
        const grid=sheet.querySelector('.question-grid');
        const boxes=[...sheet.querySelectorAll('.question-item')];
        if (!sheet.classList.contains('print-page--four-up') || grid.getBoundingClientRect().height>920) failures.push({ids:group.map(q=>q.type.id),reason:'page height'});
        for (const item of boxes) {
          const a=item.querySelector('.answer-line').getBoundingClientRect(), p=item.querySelector('.question-prompt').getBoundingClientRect(), b=item.getBoundingClientRect();
          if(p.bottom>a.top+1 || a.bottom>b.bottom+1 || p.right>b.right+1) failures.push({id:item.dataset.typeId,reason:'overlap or overflow'});
          for (const node of item.querySelectorAll('.question-prompt *')) {
            const r=node.getBoundingClientRect();
            if(r.width>0 && (r.right>b.right+2 || r.left<b.left-2)) failures.push({id:item.dataset.typeId,reason:'child outside column',html:node.outerHTML.slice(0,200)});
          }
        }
      }
      return {cases:candidates.length,types:new Set(candidates.map(q=>q.type.id)).size,failures,longWeight};
    });
    assert(result.longWeight < 3, 'fraction equation uses the wrapped four-up layout');
    assert(result.types>=65, `expected broad coverage, got ${result.types} types`);
    assert.deepEqual(result.failures,[]);
    assert.deepEqual(errors,[]);
    console.log(`PASS: ${result.cases} generated compact fraction cases across ${result.types} types fit four-up columns`);
    await context.close();
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
