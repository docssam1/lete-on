'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require('playwright');
const {startServer}=require('./fixtures/student-workspace.cjs');
require('../data/academy-engagement.js');
const programs=HIGHSELECT_ACADEMY_ENGAGEMENT.programs.filter(p=>['DP','WM','ED'].includes(p.code));
let server,browser;
test.before(async()=>{server=await startServer();browser=await chromium.launch({headless:true});});
test.after(async()=>{await browser?.close();await server?.close();});
for(const width of [320,390,1440])test(`admission and mock status stay separate on every course at ${width}`,async()=>{
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try {
    for(const program of programs){
      await page.goto(server.base+'promo/#academy='+program.code);
      assert.equal(await page.locator('.course-banner:visible').count(),program.courses.length,'all courses visible without expanding preparation');
      for(const course of program.courses){
        await page.goto(server.base+'promo/#academy='+program.code+'&course='+course.id);
        await page.locator('#admission-title').waitFor();
        assert.equal(await page.locator('#selected-course-title').textContent(),course.label);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,program.code+':'+course.id);
        for(const link of await page.locator('.admission-link').all()){
          assert.equal(new URL(await link.getAttribute('href')).hostname,'blog.naver.com');
          assert((await link.boundingBox()).height>=44);
        }
        if(['algebra-direct','calculus1-basic','common2-basic'].includes(course.id)){
          assert.equal(await page.locator('.round-card').count(),0,'guide must not open another course mock');
          assert((await page.locator('.course-admission').boundingBox()).y<(await page.locator('.course-empty').boundingBox()).y,'admission guidance comes before the unavailable-mock message');
        }
      }
    }
    if(process.env.HIGHSELECT_UI_ARTIFACT_DIR){
      await fs.mkdir(process.env.HIGHSELECT_UI_ARTIFACT_DIR,{recursive:true});
      await page.goto(server.base+'promo/#academy=WM&course=algebra-direct');
      await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:path.join(process.env.HIGHSELECT_UI_ARTIFACT_DIR,'admission-wm-'+width+'.png'),fullPage:true});
    }
    assert.deepEqual(errors,[]);
  }finally{await page.close();}
});
test('notice filters follow course routes and can be changed on academy and home lists',async()=>{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  try {
    await page.goto(server.base+'promo/#academy=DP&course=common1-basic');
    await page.locator('[data-admission-jump]').click();
    assert.equal(await page.locator('#admission-title').evaluate(e=>document.activeElement===e),true);
    assert.equal(await page.locator('.round-card').count(),2);
    await page.goto(server.base+'promo/#academy=WM&course=algebra-direct');
    assert.match(await page.locator('#notice-title').innerText(),/실력직행/);
    const titles=await page.locator('#academy-notice-board .news-content h3').allTextContents();
    assert(titles.length>0);assert(titles.every(title=>title.includes('대수')&&title.includes('실력직행')));
    await page.goto(server.base+'promo/#academy=WM');
    await page.locator('#academy-notice-board select').selectOption('high-dual');
    const dual=await page.locator('#academy-notice-board .news-content h3').allTextContents();
    assert(dual.length>0);assert(dual.every(title=>title.includes('듀얼')));
    await page.goto(server.base+'promo/');
    await page.locator('#home-notice-board [data-filter="academy"][data-value="ED"]').click();
    await page.locator('#home-notice-board select').selectOption('high-advance');
    assert((await page.locator('#home-notice-board .news-content h3').allTextContents()).every(title=>/공통수학1.*기본/.test(title)));
    await page.locator('#home-notice-board [data-filter="academy"][data-value="WM"]').click();
    assert.equal(await page.locator('#home-notice-board select').inputValue(),'');
  }finally{await page.close();}
});
