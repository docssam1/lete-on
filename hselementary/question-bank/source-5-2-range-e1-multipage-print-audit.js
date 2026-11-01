"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),http=require("node:http"),path=require("node:path");
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH || "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root=path.resolve(__dirname,"../.."),output=process.env.MAC_CHECK_OUTPUT || "/tmp/gfield-u1-range-print-audit";
assert(path.isAbsolute(output) && !path.resolve(output).startsWith(root+path.sep),"Use an absolute evidence directory outside the repository.");
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
    for(const count of [1,12]){
      const context=await browser.newContext({viewport:{width:1280,height:1000},serviceWorkers:"block"}),page=await context.newPage(),errors=[];
      await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
      page.on("pageerror",e=>errors.push(e.message));await page.addInitScript(()=>{window.print=()=>{};});
      await page.goto(`${origin}/hselementary/question-bank/`,{waitUntil:"domcontentloaded",timeout:90000});
      await page.locator("#gradeFilter [data-grade='5']").click();await page.locator("#termFilter [data-term='2']").click();await page.locator("#unitFilter").selectOption("5-2-u1");
      for(const n of (count===1?[1]:[1,2,3,4]))await page.locator(`#typeList input[data-type-id='5-2-u1-e1-example-1-${n}']`).check();
      await page.locator("#questionCountInput").fill(String(count));await page.locator("#difficultyFilter [data-difficulty='0']").click();await page.locator("#generateButton").click();
      await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
      assert.equal(await page.locator("#problemView .question-item").count(),count);
      await page.locator("#solutionTab").click();assert.equal(await page.locator("#solutionView .solution-item").count(),count);
      await page.locator("#printMenuButton").click();await page.locator("#printMenuList [data-print-mode='solution']").click();
      await page.waitForFunction(()=>document.body.dataset.printMode==="solution");
      await page.pdf({path:path.join(output,`range-${count}-solution.pdf`),format:"A4",printBackground:true,preferCSSPageSize:true});
      assert.deepEqual(errors,[]);await context.close();
    }
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
  console.log(`One and twelve question solution PDFs generated for margin review: ${output}`);
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
