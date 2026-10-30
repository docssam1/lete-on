"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),http=require("node:http"),path=require("node:path");
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH || "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root=path.resolve(__dirname,"../.."), output="/tmp/grade52-u1-e34-practice-audit";
const ids=[3,4].map(n=>`5-2-u1-e3-example-${n}-synthetic`);
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let file=path.resolve(root,`.${pathname}`);if(pathname.endsWith("/"))file=path.join(file,"index.html");
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}const ext=path.extname(file);res.writeHead(200,{"content-type":ext===".css"?"text/css":ext===".js"?"text/javascript":"text/html"}).end(data);});
});
(async()=>{
  fs.mkdirSync(output,{recursive:true});await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const origin=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch({headless:true});
  try{
    for(const width of [1440,375,320]){
      const context=await browser.newContext({viewport:{width,height:1150},serviceWorkers:"block"}),page=await context.newPage(),errors=[];
      await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
      page.on("pageerror",e=>errors.push(e.message));await page.addInitScript(()=>{window.print=()=>{};});
      await page.goto(`${origin}/hselementary/question-bank/`,{waitUntil:"domcontentloaded",timeout:90000});
      await page.locator("#gradeFilter [data-grade='5']").click();await page.locator("#termFilter [data-term='2']").click();await page.locator("#unitFilter").selectOption("5-2-u1");
      for(const id of ids){const checkbox=page.locator(`#typeList input[data-type-id='${id}']`);assert.equal(await checkbox.isDisabled(),false);await checkbox.check();}
      await page.locator("#questionCountInput").fill("6");await page.locator("#difficultyFilter [data-difficulty='0']").click();await page.locator("#generateButton").click();
      await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
      for(const id of ids){const problems=page.locator(`#problemView [data-source-item-id='${id}']`);assert.equal(await problems.count(),3);assert.deepEqual(await problems.evaluateAll(xs=>xs.map(x=>x.dataset.poolIndex)),["0","1","2"]);}
      assert.match(await page.locator(`#problemView [data-source-item-id='${ids[0]}']`).first().innerText(),/가능한 한 많이/);
      assert.match(await page.locator(`#problemView [data-source-item-id='${ids[1]}']`).first().innerText(),/짧아도 한 구간/);
      assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+1);
      await page.screenshot({path:path.join(output,`problem-${width}.png`),fullPage:true});
      await page.locator("#solutionTab").click();
      for(const id of ids)assert.equal(await page.locator(`#solutionView [data-source-answer='${id}']`).count(),3);
      assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+1);
      await page.screenshot({path:path.join(output,`solution-${width}.png`),fullPage:true});
      if(width===1440)for(const mode of ["problem","solution"]){await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();await page.locator("#printMenuButton").click();await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();await page.waitForFunction(m=>document.body.dataset.printMode===m,mode);await page.pdf({path:path.join(output,`${mode}.pdf`),format:"A4",printBackground:true,preferCSSPageSize:true});}
      assert.deepEqual(errors,[]);await context.close();
    }
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
  console.log(`Grade 5-2 unit 1: six sale/taxi practice variants, desktop/mobile and A4 checked in ${output}`);
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
