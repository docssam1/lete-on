"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const models=require("./source-6-2-colored-cut-mission1-models.js"),contracts=require("./source-6-2-colored-cut-mission1-contracts.js"),assets=require("./source-6-2-colored-cut-mission1-assets.js");
const id=models.sourceItemId,key="sourceGrade6SecondSpaceE4ColoredPlaneCut",other="6-2-u3-e4-example-3",base=new URL(process.env.HSE_BASE_URL),out=process.env.HSE_SCREENSHOT_DIR;
const candidate=process.env.HSE_COLORED_CANDIDATE==="1",mixed=process.env.HSE_COLORED_MIXED==="1";assert(out&&/^E:[/\\]/i.test(out)&&["localhost","127.0.0.1"].includes(base.hostname));
const files=["index.html","app.js","source-inventory-grade6.js","source-6-2-painted-mission3-presentation.js","generators.js",...["models.js","assets.js","contracts.js","presentation.js","questions.js","questions.css"].map(s=>`source-6-2-colored-cut-mission1-${s}`)];
const hashes=()=>Object.fromEntries(files.map(f=>[f,crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,f))).digest("hex")]));
async function inspect(root,variant,level,mode){
 const q=contracts.generate(id,variant,level),a=assets.image(variant,mode==="problem"?"given":"answer");
 return root.evaluate((el,{q,a,mode})=>{
  const errors=[],problem=mode==="problem",area=el.querySelector(problem?".source62-colored-cut-given":".source62-colored-cut-answer");if(!area)return["Missing colored-cut area"];
  const imgs=[...area.querySelectorAll("img")];if(imgs.length!==1||!imgs[0]?.getAttribute("src").endsWith("/"+a.file))errors.push("Wrong native image");
  for(const img of imgs){const b=img.getBoundingClientRect(),p=area.getBoundingClientRect();if(!img.complete||img.naturalWidth!==1600||img.naturalHeight!==1649)errors.push("Failed native image");if(b.left<p.left-.5||b.right>p.right+.5)errors.push("Clipped native image");}
  if(problem){if(area.querySelector("table,svg,.math-inline-expression,[data-layer]"))errors.push("Invented answer hint");if(area.textContent.replace(/\\s/g,"")!==q.promptText.replace(/\\s/g,""))errors.push("Extra student explanation");}
  else{
   const svg=area.querySelector(".source62-colored-cut-front"),cells=svg?[...svg.querySelectorAll("rect")]:[];
   if(!svg||cells.length!==20)errors.push("Wrong front grid");
   for(const rect of cells){const x=Number(rect.dataset.x),y=Number(rect.dataset.y),cell=q.model.frontCells.find(c=>c.x===x&&c.y===y);
    if(!cell||rect.dataset.dark!==String(cell.dark)||rect.dataset.cut!==String(cell.cut)||rect.getAttribute("fill")!==(cell.dark?(cell.cut?"#b9d4bc":"#555555"):"#ffffff")||Number(rect.getAttribute("x"))!==32+42*x||Number(rect.getAttribute("y"))!==32+42*(3-y))errors.push("Wrong front cell");}
   const line=svg?.querySelector('[data-role="front-plane-trace"]');if(!line||line.getAttribute("x1")!=="32"||line.getAttribute("y1")!=="32"||line.getAttribute("x2")!=="242"||line.getAttribute("y2")!=="200")errors.push("Wrong cut trace");
   for(const span of el.querySelectorAll(".math-inline-expression")){const b=span.getBoundingClientRect(),p=el.getBoundingClientRect(),style=getComputedStyle(span);if(span.getClientRects().length!==1||style.whiteSpace!=="nowrap"||b.left<p.left-.5||b.right>p.right+.5||style.color!=="rgb(0, 0, 0)"||style.fontWeight!=="400")errors.push("Equation typography or overflow");}
  }
  if(document.documentElement.scrollWidth>innerWidth+1)errors.push("Viewport overflow");return[...new Set(errors)];
 },{q:JSON.parse(JSON.stringify(q)),a,mode});
}
async function run(){
 fs.mkdirSync(out,{recursive:true});const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE});
 const report={status:"running",candidateOverlay:candidate,mixed,transport:"read-only-static-file-browser-fixture",actualHttpTested:false,runtimeHashes:hashes(),states:[],pdfs:[],picker:[],negative:[],errors:[],network:[]};
 try{
  const page=await browser.newPage(),repo=path.resolve(__dirname,"../..");page.on("pageerror",e=>report.errors.push(e.message));page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)report.network.push(r.url());});
  await page.route("**/*",route=>{
   const url=new URL(route.request().url());if(url.origin!==base.origin)return route.abort();
   if(candidate&&url.pathname.endsWith("/source-inventory-grade6.js"))return route.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nObject.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{reviewLocked:false,reviewReason:'',generatorKey:'${key}',variant:0,verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualStatus:'verified',sourceConditionsClarified:true,originalSourceReleaseStatus:'locked',generationMode:'fixed-verified-pool'});`});
   const file=path.resolve(repo,"."+decodeURIComponent(url.pathname)+(url.pathname.endsWith("/")?"index.html":"")),relative=path.relative(repo,file);
   if(relative.startsWith("..")||path.isAbsolute(relative)||!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:"Not found"});
   const contentType={".js":"application/javascript",".html":"text/html; charset=utf-8",".css":"text/css",".png":"image/png",".woff2":"font/woff2"}[path.extname(file)]||"application/octet-stream";return route.fulfill({contentType,body:fs.readFileSync(file)});
  });
  const loaded=()=>page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('#worksheet img,#typePreviewPopover img')].map(img=>img.decode()));});
  async function check(mode,level){
   const selector=mode==="problem"?"#problemView .question-item":mode==="solution"?"#solutionView .solution-item":"#answerKeyView .answer-key-visuals>figure",items=await page.locator(selector).all();assert.equal(items.length,mixed?6:3);const own=[],foreign=[];
   for(const item of items){if(await item.locator("[data-colored-cut-context]").count()){const variant=await item.locator("[data-colored-cut-context]").first().evaluate(e=>Number(e.dataset.variant));assert.deepEqual(await inspect(item,variant,level,mode),[]);own.push(variant);}
    else{assert(mixed);const variant=await item.locator("[data-opposite-removal-context]").first().evaluate(e=>Number(e.dataset.variant));assert.deepEqual(await require("./source-6-2-opposite-removal-bank-audit.js").inspect(item,variant,level,mode),[]);foreign.push(variant);}}
   assert.deepEqual(own.sort(),[0,1,2]);if(mixed)assert.deepEqual(foreign.sort(),[0,1,2]);
  }
  async function print(level,mode){
   await page.evaluate(()=>{dispatchEvent(new Event("afterprint"));window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator(`button[data-print-mode="${mode}"]`).click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();await page.emulateMedia({media:"print"});await check(mode,level);
   const file=`${mixed?"mixed":"colored-cut"}-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
  }
  for(const width of[1280,390,320])for(let level=0;level<3;level++){
   await page.setViewportSize({width,height:1000});
   if(mixed){await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
    const selected=await page.evaluate(ids=>{const ts=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types)));return ids.map(id=>{const t=ts.find(t=>t.sourceItemId===id);if(!t||t.reviewLocked)throw Error("Missing candidate");return t.id;});},[id,other]);
    for(const type of selected)await page.locator(`.tree-type[data-preview-type-id="${type}"] input`).check();await page.locator(`#difficultyFilter [data-difficulty="${level-1}"]`).click();await page.locator("#questionCountInput").fill("6");await page.locator("#generateButton").click();
   }else await page.goto(new URL(`?type=${id}&review=1&difficulty=${level-1}`,base).href);
   await page.locator("#worksheet:not([hidden])").waitFor();await loaded();await check("problem",level);if(level===1)await page.locator("#problemView").screenshot({path:path.join(out,`${width}-problem.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"problem");
   const zoom=page.locator('#problemView [data-source-figure-family="colored-cut-mission1"]').first();await zoom.click();await page.locator('.source62-m3-figure-dialog[open]:not([aria-busy=true])').waitFor();assert((await page.locator('.source62-m3-figure-dialog img').getAttribute("src")).endsWith("-given.png"));await page.keyboard.press("Escape");assert(await zoom.evaluate(e=>e===document.activeElement));
   if(!mixed&&width===1280&&level===0){
    for(const family of["notched-mission5","opposite-removal"]){await zoom.evaluate((button,family)=>{button.dataset.sourceFigureFamily=family;button.click();},family);await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await page.locator('.source62-m3-figure-dialog[open]').count(),0);}await zoom.evaluate(button=>button.dataset.sourceFigureFamily="colored-cut-mission1");report.negative.push("cross-family-owner-rejected");
    await zoom.evaluate(button=>{button.dataset.sourceFigurePhase="front";button.click();});await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await page.locator('.source62-m3-figure-dialog[open]').count(),0);await zoom.evaluate(button=>button.dataset.sourceFigurePhase="given");report.negative.push("teacher-phase-in-problem-rejected");
   }
   await page.locator("#solutionTab").click();await loaded();await check("solution",level);if(level===1){await page.locator("#solutionView").screenshot({path:path.join(out,`${width}-solution.png`)});if(width===390)await page.locator("#solutionView .solution-item").first().screenshot({path:path.join(out,"390-first-solution.png")});}if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"solution");
   const teacher=page.locator('#solutionView [data-source-figure-family="colored-cut-mission1"]');for(let index=0;index<await teacher.count();index++){const button=teacher.nth(index),front=(await button.getAttribute("data-source-figure-phase"))==="front",src=front?null:await button.locator("img").getAttribute("src");await button.click();await page.locator('.source62-m3-figure-dialog[open]:not([aria-busy=true])').waitFor();if(front)assert((await page.locator('.source62-m3-figure-dialog img').getAttribute("src")).startsWith("data:image/svg+xml"));else assert.equal(await page.locator('.source62-m3-figure-dialog img').getAttribute("src"),src);await page.keyboard.press("Escape");}
   await page.locator("#solutionViewerButton").click();const jumps=await page.locator("#solutionViewerJump [data-solution-index]").count();assert.equal(jumps,mixed?6:3);
   for(let index=0;index<jumps;index++){await page.locator(`#solutionViewerJump [data-solution-index="${index}"]`).click();await loaded();const content=page.locator("#solutionViewerContent");if(await content.locator('[data-colored-cut-context="problem"]').count()){const variant=await content.locator('[data-colored-cut-context="problem"]').evaluate(e=>Number(e.dataset.variant));assert.deepEqual(await inspect(content.locator(".solution-viewer-prompt"),variant,level,"problem"),[]);assert.deepEqual(await inspect(content,variant,level,"solution"),[]);}}await page.keyboard.press("Escape");
   await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();await check("answer-key",level);if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));report.states.push({width,level,questions:mixed?6:3,viewerQuestions:jumps,allTeacherClassZooms:true});
  }
  if(!mixed)for(const width of[1280,320]){await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();const type=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),id),row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);await row.locator("input").check();await row.locator(".tree-type-copy").click();await loaded();assert.deepEqual(await inspect(page.locator("#typePreviewPopover"),0,1,"problem"),[]);await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await loaded();await check("problem",1);report.picker.push({width,requested:120,generated:3});}
  if(!candidate){await page.goto(base.href);await page.waitForFunction(()=>window.HSE_CURRICULUM&&window.HSE_GENERATORS);const state=await page.evaluate(id=>{const t=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id);return{locked:t.reviewLocked,key:window.HSE_GENERATORS.generatorKey(t)};},id);assert.equal(state.locked,false);assert.equal(state.key,key);report.actualCatalogConditionalReady=true;}
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.network,[]);assert.deepEqual(hashes(),report.runtimeHashes);report.status="passed";
 }catch(error){report.status="failed";report.error=error.stack;throw error;}finally{fs.writeFileSync(path.join(out,mixed?"mixed-result.json":"bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
 console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,candidateOverlay:candidate,mixed,actualHttpTested:false}));
}
module.exports={inspect,run};if(require.main===module)run().catch(error=>{console.error(error);process.exitCode=1;});
