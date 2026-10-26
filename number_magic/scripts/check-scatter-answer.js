#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..');
const c={console,document:{documentElement:{lang:'ko'}}};c.window=c;vm.createContext(c);
for(const f of ['engine/rng.js','engine/threads/mid15.js','app/scatter-answer.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const api=c.NM_SCATTER_ANSWER;
for(let seed=0;seed<256;seed++){
  const p=c.NM_TGEN.md87_scatter({mode:'plot'},c.NM_RNG.mulberry32(seed));
  const pts=JSON.parse(JSON.stringify(p.scatterPlot.points));
  assert(api.matches(JSON.stringify(pts.reverse()),p));
  for(const bad of ['', '[]','6',JSON.stringify(pts.slice(1)),JSON.stringify([...pts,pts[0]]),JSON.stringify([...pts,[11,1]]),'[[1.5,2]]','[[1,"2"]]','null','{}','[[1,2,3]]','[[true,2]]'])assert(!api.matches(bad,p),bad);
  const different=pts.map(v=>[...v]);different[0]=[10,10];assert(!api.matches(JSON.stringify(different),p));
  assert(!api.isPlot({scatterPlot:{mode:'read'}}));
}
(async()=>{
  const browser=await chromium.launch();
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.setContent('<html lang="ko"><body><main></main></body></html>');
    await page.addScriptTag({path:path.join(root,'app/scatter-answer.js')});
    await page.evaluate(()=>{
      window.p={graph:{xr:[0,10],yr:[0,10]},scatterPlot:{mode:'plot',points:[[1,2],[4,5]]}};window.answers=[''];window.changes=[];
      window.graph=(p,points)=>'<table><caption>자료</caption><tr><th>x</th><td>1</td><td>4</td></tr><tr><th>y</th><td>2</td><td>5</td></tr></table><p data-preview>'+JSON.stringify(points)+'</p>';
      const el=document.querySelector('main');el.innerHTML=NM_SCATTER_ANSWER.html(p,'',0,graph);
      NM_SCATTER_ANSWER.bind(el,[p],answers,graph,(i,raw)=>changes.push([i,raw]));
      NM_SCATTER_ANSWER.bind(el,[p],answers,graph,(i,raw)=>changes.push([i,raw]));
    });
    const x=page.locator('[data-scatter-x]'),y=page.locator('[data-scatter-y]');
    await page.locator('[data-scatter-add]').click();assert.equal(await x.getAttribute('aria-invalid'),'true');
    await x.fill('11');await y.fill('2');await y.press('Enter');assert.equal(await page.evaluate(()=>answers[0]),'');
    await x.fill('1');await y.fill('2');await y.press('Enter');assert.equal(await page.evaluate(()=>answers[0]),'[[1,2]]');
    assert.equal(await page.evaluate(()=>changes.length),1,'rebinding must not duplicate listeners');
    assert(await x.evaluate(e=>e===document.activeElement));
    await x.fill('1');await y.fill('2');await y.press('Enter');assert.equal(await page.evaluate(()=>changes.length),1);
    await x.fill('4');await y.fill('5');await page.locator('[data-scatter-add]').click();assert(await page.evaluate(()=>NM_SCATTER_ANSWER.matches(answers[0],p)));
    assert.equal(await page.locator('[data-preview]').textContent(),'[[1,2],[4,5]]');
    await page.locator('[data-scatter-remove="0"]').click();assert.equal(await page.evaluate(()=>answers[0]),'[[4,5]]');
    await page.locator('[data-scatter-clear]').click();assert.equal(await page.evaluate(()=>answers[0]),'[]');assert(!await page.evaluate(()=>NM_SCATTER_ANSWER.matches(answers[0],p)));
    for(const width of [390,1100]){
      await page.setViewportSize({width,height:844});
      const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,small:[...document.querySelectorAll('input,button')].some(e=>e.getBoundingClientRect().height<44||e.getBoundingClientRect().width<44)}));
      assert(!layout.overflow);assert(!layout.small);
    }
    await page.screenshot({path:'/tmp/nm-scatter-answer-ui.png'});
    assert.deepEqual(errors,[]);
    console.log('PASS: 256 seeded point-set grading samples; keyboard/add/remove/clear/duplicate/range/rebind/ARIA/390px and desktop UI checks.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
