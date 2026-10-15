"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const root=process.env.HSE_FINAL_MISSIONS_EVIDENCE_DIR||"E:/Codex/visualizations/2026/08/21/01a0242e-3982-7661-8225-b287285e6742/source-6-2-u3-e4-review-20261014",out=path.join(root,"mission-4-5-6-preview-actual"),presentation=require("./source-6-2-e4-final-missions-presentation.js"),base=new URL("http://127.0.0.1:8909/hselementary/question-bank/");
async function run(){
 fs.mkdirSync(out,{recursive:true});const prior=path.join(out,"preview-result.json"),checkpoint=path.join(out,"initial-desktop-rule-failure.json");if(fs.existsSync(prior)&&!fs.existsSync(checkpoint))fs.copyFileSync(prior,checkpoint);const{chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||"playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE||"C:/Users/user/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe"}),result={status:"running",candidateOverlay:false,actualHttpTested:false,states:[],errors:[],network:[]};
 try{
  const page=await browser.newPage(),repo=path.resolve(__dirname,"../.."),files=new Map();page.on("pageerror",e=>result.errors.push(e.message));page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)result.network.push(r.url());});
  await page.route("**/*",route=>{const u=new URL(route.request().url());if(u.origin!==base.origin)return route.abort();const f=path.resolve(repo,"."+decodeURIComponent(u.pathname)+(u.pathname.endsWith("/")?"index.html":"")),relative=path.relative(repo,f);if(relative.startsWith("..")||path.isAbsolute(relative)||!fs.existsSync(f)||!fs.statSync(f).isFile())return route.fulfill({status:404,body:"Not found"});const bytes=fs.readFileSync(f);files.set(path.relative(__dirname,f),crypto.createHash("sha256").update(bytes).digest("hex"));return route.fulfill({contentType:{".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css",".png":"image/png",".woff2":"font/woff2"}[path.extname(f)]||"application/octet-stream",body:bytes});});
  for(const width of[1280,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
   for(const id of Object.keys(presentation.profiles)){
    await page.locator(`[data-preview-type-id="${id}"] .tree-type-copy`).click();const preview=page.locator("#typePreviewPopover");await preview.waitFor({state:"visible"});await page.evaluate(async()=>{await document.fonts.ready;for(const img of document.querySelectorAll("#typePreviewPopover img"))await img.decode();});
    const q=presentation.profiles[id].generate(id,0,1);assert.equal(await preview.locator("[data-final-mission-owner=problem] p").textContent(),q.promptText);assert.equal(await preview.locator("img").count(),1);assert.equal(await preview.locator('table,[data-layer],[data-final-mission-owner=teacher],svg[data-projection-role=answer]').count(),0);
    assert.equal(await preview.locator('svg[data-projection-role=response] [data-cell-value]').count(),0);
    const layout=await preview.evaluate((e,id)=>{const b=e.getBoundingClientRect(),anchor=e.previousElementSibling,next=e.nextElementSibling,mobile=innerWidth<=700;return{horizontal:b.left>=-1&&b.right<=innerWidth+1&&document.documentElement.scrollWidth<=innerWidth+1,vertical:mobile?getComputedStyle(e).position==="static"&&anchor?.dataset.previewTypeId===id&&anchor.getBoundingClientRect().bottom<=b.top+.5&&(!next||next.getBoundingClientRect().top>=b.bottom-.5):b.top>=-1&&b.bottom<=innerHeight+1,inlineMobile:mobile};},id);
    assert(layout.horizontal&&layout.vertical,JSON.stringify(layout));
    await preview.screenshot({path:path.join(out,`${id}-${width}.png`)});await page.locator("[data-close-type-preview]").click();assert.equal(await preview.isVisible(),false);result.states.push({width,id,studentOnly:true,withinHorizontalViewport:true,noOverlay:true,inlineMobile:layout.inlineMobile});
   }
  }
  assert.deepEqual(result.errors,[]);assert.deepEqual(result.network,[]);for(const[file,hash]of files)assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.resolve(__dirname,file))).digest("hex"),hash);result.runtimeHashes=Object.fromEntries(files);result.status="passed-actual-preview";
 }catch(error){result.status="failed";result.error=error.stack;throw error;}finally{fs.writeFileSync(path.join(out,"preview-result.json"),JSON.stringify(result,null,2)+"\n");await browser.close();}
 console.log(JSON.stringify({status:result.status,states:result.states.length,actualHttpTested:false}));
}
run().catch(e=>{console.error(e);process.exitCode=1;});
