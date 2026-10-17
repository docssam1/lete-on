"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const contracts=require("./source-6-2-opposite-removal-contracts.js");
const id=contracts.sourceItemId,key="sourceGrade6SecondSpaceE4OppositeFaceRemoval",other="6-2-u3-e4-example-2";
const base=new URL(process.env.HSE_BASE_URL),out=process.env.HSE_SCREENSHOT_DIR,candidate=process.env.HSE_REMOVAL_CANDIDATE==="1",mixed=process.env.HSE_REMOVAL_MIXED==="1",fixture=process.env.HSE_RENDER_FIXTURE==="1";
assert(out&&/^E:[/\\]/i.test(out));assert(["localhost","127.0.0.1"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
const files=["index.html","app.js","source-inventory-grade6.js","source-6-2-painted-mission3-presentation.js",...["models.js","assets.js","contracts.js","presentation.js","questions.js","questions.css"].map(s=>`source-6-2-opposite-removal-${s}`)];
const hashes=()=>Object.fromEntries(files.map(f=>[f,crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,f))).digest("hex")]));
async function inspect(root,variant,level,mode){
 const q=contracts.generate(id,variant,level);
 return root.evaluate((el,{q,mode})=>{
  const errors=[],problem=mode==="problem",area=el.querySelector(problem?".source62-opposite-removal-given":".source62-opposite-removal-answer");
  if(!area)return["Missing owned area"];
  const images=[...area.querySelectorAll("img")],phase=problem?"given":q.level===0?"after-two-directions":"after-three-directions";
  if(images.length!==1||!images[0]?.getAttribute("src").endsWith(`v${q.variant}-${phase}.png`))errors.push("Wrong image phase");
  for(const image of images){const b=image.getBoundingClientRect(),parent=area.getBoundingClientRect();if(!image.complete||image.naturalWidth!==1600||image.naturalHeight!==1600)errors.push("Image failed");if(b.left<parent.left-.5||b.right>parent.right+.5)errors.push("Clipped image");}
  if(problem){
   if(area.querySelector("table,svg,.math-inline-expression,[data-selected=true]"))errors.push("Invented answer hint");
   if(area.textContent.replace(/\s/g,"")!==q.promptText.replace(/\s/g,""))errors.push("Unexpected problem text");
  }else{
   const svgs=[...area.querySelectorAll("svg[data-layer]")];if(svgs.length!==(q.level===2?10:5))errors.push("Wrong answer grid count");
   for(const svg of svgs){
    const layer=Number(svg.dataset.layer),kind=svg.dataset.kind,row=q.model.layers[layer-1];if(!row||!["remaining","overlapping"].includes(kind)||kind==="overlapping"&&q.level!==2){errors.push("Wrong answer grid");continue;}
    const selected=[...svg.querySelectorAll('rect[data-selected="true"]')].map(r=>[Number(r.dataset.x),Number(r.dataset.z)].join(",")).sort();
    if(svg.querySelectorAll("rect").length!==25||JSON.stringify(selected)!==JSON.stringify(row[kind].map(c=>c.join(",")).sort()))errors.push("Wrong answer cells");
   }
   for(const span of el.querySelectorAll(".math-inline-expression")){const r=span.getBoundingClientRect(),b=el.getBoundingClientRect(),style=getComputedStyle(span);if(span.getClientRects().length!==1||style.whiteSpace!=="nowrap"||r.left<b.left-.5||r.right>b.right+.5)errors.push("Wrapped equation");if(style.color!=="rgb(0, 0, 0)"||style.fontWeight!=="400")errors.push("Wrong equation typography");}
  }
  if(document.documentElement.scrollWidth>innerWidth+1)errors.push("Viewport overflow");return [...new Set(errors)];
 },{q:JSON.parse(JSON.stringify(q)),mode});
}
async function run(){
 const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE}),report={status:"running",candidateOverlay:candidate,mixed,transport:fixture?"read-only-static-file-browser-fixture":"local-http",actualHttpTested:!fixture,runtimeHashes:hashes(),states:[],pdfs:[],picker:[],negative:[],errors:[],network:[]};
 try{
  const page=await browser.newPage(),root=path.resolve(__dirname,"../..");page.on("pageerror",e=>report.errors.push(e.message));page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)report.network.push(r.url());});
  await page.route("**/*",route=>{
   const url=new URL(route.request().url());if(url.origin!==base.origin)return route.abort();
   if(candidate&&url.pathname.endsWith("/source-inventory-grade6.js"))return route.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nObject.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{reviewLocked:false,reviewReason:'',generatorKey:'${key}',variant:0,verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualStatus:'verified',sourceConditionsClarified:true,originalSourceReleaseStatus:'locked',generationMode:'fixed-verified-pool'});`});
   if(!fixture)return route.continue();
   const file=path.resolve(root,"."+decodeURIComponent(url.pathname)+(url.pathname.endsWith("/")?"index.html":"")),relative=path.relative(root,file);
   if(relative.startsWith("..")||path.isAbsolute(relative)||!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:"Not found"});
   const contentType={".js":"application/javascript",".html":"text/html; charset=utf-8",".css":"text/css",".png":"image/png",".woff2":"font/woff2"}[path.extname(file)]||"application/octet-stream";return route.fulfill({contentType,body:fs.readFileSync(file)});
  });
  const loaded=()=>page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('#worksheet img,#typePreviewPopover img')].map(img=>img.decode()));});
  async function check(mode,level){
   const selector=mode==="problem"?"#problemView .question-item":mode==="solution"?"#solutionView .solution-item":"#answerKeyView .answer-key-visuals>figure",items=await page.locator(selector).all();assert.equal(items.length,mixed?6:3);const own=[],foreign=[];
   for(const item of items){if(await item.locator("[data-opposite-removal-context]").count()){
    const variant=await item.locator("[data-opposite-removal-context]").first().evaluate(e=>Number(e.dataset.variant));assert.deepEqual(await inspect(item,variant,level,mode),[]);own.push(variant);
   }else{
    assert(mixed);const variant=await item.locator("[data-four-vertex-cut-context]").first().evaluate(e=>Number(e.dataset.variant));const {inspect:fourInspect}=require("./source-6-2-four-vertex-cut-bank-audit.js");assert.deepEqual(await fourInspect(item,variant,level,mode),[]);foreign.push(variant);
   }}assert.deepEqual(own.sort(),[0,1,2]);if(mixed)assert.deepEqual(foreign.sort(),[0,1,2]);
  }
  async function print(level,mode){
   await page.evaluate(()=>{dispatchEvent(new Event("afterprint"));window.__printCalls=0;window.print=()=>window.__printCalls++;});
   await page.locator("#printMenuButton").click();await page.locator(`button[data-print-mode="${mode}"]`).click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();
   await page.emulateMedia({media:"print"});await check(mode,level);const file=`${mixed?"mixed":"removal"}-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
  }
  for(const width of[1280,390,320])for(let level=0;level<3;level++){
   await page.setViewportSize({width,height:1000});
   if(mixed){
    await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
    const selected=await page.evaluate(ids=>{const ts=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types)));return ids.map(id=>{const t=ts.find(t=>t.sourceItemId===id);if(!t||t.reviewLocked)throw Error("Missing candidate");return t.id;});},[id,other]);
    for(const type of selected)await page.locator(`.tree-type[data-preview-type-id="${type}"] input`).check();await page.locator(`#difficultyFilter [data-difficulty="${level-1}"]`).click();await page.locator("#questionCountInput").fill("6");await page.locator("#generateButton").click();
   }else await page.goto(new URL(`?type=${id}&review=1&difficulty=${level-1}`,base).href);
   await page.locator("#worksheet:not([hidden])").waitFor();await loaded();await check("problem",level);
   if(level===1)await page.locator("#problemView").screenshot({path:path.join(out,`${width}-problem.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"problem");
   const zoom=page.locator('#problemView [data-source-figure-family="opposite-removal"]').first();await zoom.click();await page.locator('.source62-m3-figure-dialog[open]:not([aria-busy=true])').waitFor();assert((await page.locator('.source62-m3-figure-dialog img').getAttribute("src")).endsWith("-given.png"));await page.keyboard.press("Escape");assert(await zoom.evaluate(e=>e===document.activeElement));
   if(!mixed&&width===1280&&level===0){
    await zoom.evaluate(button=>{button.dataset.sourceFigureFamily="notched-mission5";button.click();});
    await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await page.locator('.source62-m3-figure-dialog[open]').count(),0);await zoom.evaluate(button=>button.dataset.sourceFigureFamily="opposite-removal");report.negative.push("cross-family-owner-rejected");
    await zoom.click();await page.locator('.source62-m3-figure-dialog[open]:not([aria-busy=true])').waitFor();
    await zoom.evaluate(button=>{
     const dialog=document.querySelector('.source62-m3-figure-dialog'),decode=HTMLImageElement.prototype.decode,marker=document.createComment("zoom-race-regression");
     button.before(marker);window.__removalRace={button,marker,decode};
     HTMLImageElement.prototype.decode=function(){if(this.closest('.source62-m3-figure-dialog'))return new Promise((resolve,reject)=>{window.__removalRace.resume=()=>decode.call(this).then(resolve,reject);});return decode.call(this);};
     dialog.close();button.click();
    });
    await page.waitForFunction(()=>window.__removalRace?.resume&&document.querySelector('.source62-m3-figure-dialog')?.open);
    await page.evaluate(()=>{window.__removalRace.button.remove();window.__removalRace.resume();});
    await page.waitForFunction(()=>{const dialog=document.querySelector('.source62-m3-figure-dialog');return !dialog.open&&dialog.getAttribute("aria-busy")==="false";},null,{timeout:5000});
    await page.evaluate(()=>{const state=window.__removalRace;HTMLImageElement.prototype.decode=state.decode;state.marker.replaceWith(state.button);delete window.__removalRace;});report.negative.push("late-close-and-detached-generation-rejected");
   }
   await page.locator("#solutionTab").click();await loaded();await check("solution",level);if(level===1)await page.locator("#solutionView").screenshot({path:path.join(out,`${width}-solution.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"solution");
   await page.locator("#solutionViewerButton").click();const jumps=await page.locator("#solutionViewerJump [data-solution-index]").count();assert.equal(jumps,mixed?6:3);
   for(let index=0;index<jumps;index++){await page.locator(`#solutionViewerJump [data-solution-index="${index}"]`).click();await loaded();const content=page.locator("#solutionViewerContent");if(await content.locator('[data-opposite-removal-context="problem"]').count()){
    const variant=await content.locator('[data-opposite-removal-context="problem"]').evaluate(e=>Number(e.dataset.variant));assert.deepEqual(await inspect(content.locator(".solution-viewer-prompt"),variant,level,"problem"),[]);assert.deepEqual(await inspect(content,variant,level,"solution"),[]);
   }}await page.keyboard.press("Escape");
   await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();await check("answer-key",level);if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));report.states.push({width,level,questions:mixed?6:3,viewerQuestions:jumps,problemZoom:true});
  }
  if(!mixed)for(const width of[1280,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();const type=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),id),row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);await row.locator("input").check();await row.locator(".tree-type-copy").click();await loaded();assert.deepEqual(await inspect(page.locator("#typePreviewPopover"),0,1,"problem"),[]);await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await loaded();await check("problem",1);report.picker.push({width,requested:120,generated:3});
  }
  if(!candidate){
   await page.goto(base.href);await page.waitForFunction(()=>window.HSE_CURRICULUM&&window.HSE_GENERATORS);
   const actual=await page.evaluate(id=>{const t=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),q=window.HSE_GENERATORS.generate(t,1,0,1,0);return{locked:t.reviewLocked,key:window.HSE_GENERATORS.generatorKey(t),sourceExact:q?.sourceExact,originalSourceReleaseStatus:q?.originalSourceReleaseStatus};},id);
   assert.equal(actual.locked,false);assert.equal(actual.key,key);assert.equal(actual.sourceExact,false);assert.equal(actual.originalSourceReleaseStatus,"locked");report.actualCatalogConditionalReady=true;
  }
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.network,[]);assert.deepEqual(hashes(),report.runtimeHashes);report.status="passed";
 }catch(error){report.status="failed";report.error=error.stack;throw error;}finally{fs.writeFileSync(path.join(out,mixed?"mixed-result.json":"bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
 console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,candidateOverlay:candidate,mixed,actualHttpTested:!fixture}));
}
module.exports={inspect,run};if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});
