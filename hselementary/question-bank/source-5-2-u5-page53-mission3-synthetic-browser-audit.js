"use strict";
const assert=require("node:assert/strict"), fs=require("node:fs"), http=require("node:http"), path=require("node:path");
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH || "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root=path.resolve(__dirname,"../.."), output="/tmp/grade52-u5-m3-practice-audit", id="5-2-u5-e3-mission-3-synthetic";
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let file=path.resolve(root,`.${pathname}`); if(pathname.endsWith("/"))file=path.join(file,"index.html");
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}
    const ext=path.extname(file);res.writeHead(200,{"content-type":ext===".css"?"text/css":ext===".js"?"text/javascript":"text/html"}).end(data);});
});
(async()=>{
  fs.mkdirSync(output,{recursive:true}); await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const origin=`http://127.0.0.1:${server.address().port}`, browser=await chromium.launch({headless:true});
  try {
    for(const width of [1440,375,320]){
      const context=await browser.newContext({viewport:{width,height:1150},serviceWorkers:"block"}), page=await context.newPage(), errors=[];
      await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
      page.on("pageerror",e=>errors.push(e.message)); await page.addInitScript(()=>{window.print=()=>{};});
      await page.goto(`${origin}/hselementary/question-bank/`,{waitUntil:"domcontentloaded",timeout:90000});
      await page.locator("#gradeFilter [data-grade='5']").click();await page.locator("#termFilter [data-term='2']").click();await page.locator("#unitFilter").selectOption("5-2-u5");
      const checkbox=page.locator(`#typeList input[data-type-id='${id}']`);assert.equal(await checkbox.isDisabled(),false);await checkbox.check();
      await page.locator("#questionCountInput").fill("1");await page.locator("#difficultyFilter [data-difficulty='0']").click();await page.locator("#generateButton").click();
      await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
      const problem=page.locator(`#problemView [data-source-item-id='${id}']`).first();await problem.waitFor({state:"visible"});
      assert.equal(await problem.locator("svg rect").count(),6);assert.match(await problem.innerText(),/최대공약수/);
      assert.equal(await page.locator(`#problemView [data-source-answer='${id}']`).count(),0);
      assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+1);
      await page.screenshot({path:path.join(output,`problem-${width}.png`),fullPage:true});
      await page.locator("#solutionTab").click();const solution=page.locator(`#solutionView [data-source-answer='${id}']`).first();await solution.waitFor({state:"visible"});
      assert.match(await solution.innerText(),/마주 보는 면/);assert.match(await solution.innerText(),/최대공약수/);
      assert.equal(await solution.locator("svg rect").count(),6);
      assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+1);
      await page.screenshot({path:path.join(output,`solution-${width}.png`),fullPage:true});
      if(width===1440)for(const mode of ["problem","solution"]){await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();await page.locator("#printMenuButton").click();await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();await page.waitForFunction(m=>document.body.dataset.printMode===m,mode);await page.pdf({path:path.join(output,`${mode}.pdf`),format:"A4",printBackground:true,preferCSSPageSize:true});}
      assert.deepEqual(errors,[]);await context.close();
    }
    // Generate the entire fixed pool at once and check question/solution order.
    const context=await browser.newContext({viewport:{width:1440,height:1150},serviceWorkers:"block"}),page=await context.newPage();
    await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
    await page.addInitScript(()=>{window.print=()=>{};});
    await page.goto(`${origin}/hselementary/question-bank/`,{waitUntil:"domcontentloaded",timeout:90000});
    await page.locator("#gradeFilter [data-grade='5']").click();await page.locator("#termFilter [data-term='2']").click();await page.locator("#unitFilter").selectOption("5-2-u5");
    await page.locator(`#typeList input[data-type-id='${id}']`).check();await page.locator("#questionCountInput").fill("3");
    await page.locator("#difficultyFilter [data-difficulty='0']").click();await page.locator("#generateButton").click();
    await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
    const problems=page.locator(`#problemView [data-source-item-id='${id}']`);
    assert.equal(await problems.count(),3);
    assert.deepEqual(await problems.evaluateAll(items=>items.map(item=>item.dataset.poolIndex)),["0","1","2"]);
    assert.deepEqual(await problems.evaluateAll(items=>items.map(item=>[...item.querySelectorAll("svg text")].map(el=>el.textContent))),
      [["3","4","5","6","7","9"],["2","5","7","8","9","11"],["3","5","7","8","10","11"]]);
    await page.locator("#solutionTab").click();const solutions=page.locator(`#solutionView [data-source-answer='${id}']`);
    assert.equal(await solutions.count(),3);
    assert.deepEqual(await solutions.evaluateAll(items=>items.map(item=>item.querySelector("b")?.textContent)),["12","5","5"]);
    for(const mode of ["problem","solution"]){await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();await page.locator("#printMenuButton").click();await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();await page.waitForFunction(m=>document.body.dataset.printMode===m,mode);await page.pdf({path:path.join(output,`three-${mode}.pdf`),format:"A4",printBackground:true,preferCSSPageSize:true});}
    await context.close();
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
  console.log(`Grade 5-2 Mission 3 practice: desktop/mobile, all three variants and A4 exports checked in ${output}`);
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
