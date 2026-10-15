"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const contracts=require("./source-6-2-four-vertex-cut-contracts.js"),presentation=require("./source-6-2-four-vertex-cut-presentation.js");
const out=process.env.HSE_SCREENSHOT_DIR,base=new URL(process.env.HSE_BASE_URL),id="6-2-u3-e4-example-2",key="sourceGrade6SecondSpaceE4FourVertexCut";
const candidate=process.env.HSE_FOUR_VERTEX_CUT_CANDIDATE==="1";
assert(out&&/^E:[/\\]/i.test(out));assert(["localhost","127.0.0.1"].includes(base.hostname));
fs.mkdirSync(out,{recursive:true});
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const files=["index.html","app.js","source-inventory-grade6.js","source-6-2-four-vertex-cut-models.js","source-6-2-four-vertex-cut-assets.js","source-6-2-four-vertex-cut-contracts.js","source-6-2-four-vertex-cut-presentation.js","source-6-2-four-vertex-cut-questions.js","source-6-2-four-vertex-cut-questions.css"];
const hashes=()=>Object.fromEntries(files.map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));
function candidateHtml(){
 const tags='<link rel="stylesheet" href="./source-6-2-four-vertex-cut-questions.css">'+["models","assets","contracts","presentation","questions"].map(name=>`<script defer src="./source-6-2-four-vertex-cut-${name}.js"></script>`).join(""),html=fs.readFileSync(path.join(__dirname,"index.html"),"utf8"),needle='<script defer src="./app.js';
 assert.equal(html.split(needle).length,2,"Exactly one actual app entry is required");return html.replace(needle,tags+needle);
}
async function inspect(root,variant,level,mode){
 const q=contracts.generate(id,variant,level),expected=presentation.renderBank(id,variant,level).prompt;
 return root.evaluate((el,{q,expected,mode})=>{
  const errors=[],level=q.level,problem=mode==="problem",area=el.querySelector(problem?".source62-four-vertex-given":".source62-four-vertex-answer");
  if(!area)return["Missing owned area"];
  const image=area.querySelector("[data-four-vertex-solid] img"),images=[...area.querySelectorAll("img")],rect=el.getBoundingClientRect(),file=`n${q.model.n}-${problem?"given":q.level===0?"cut-top":"cut-all"}.png`;
  if(images.length!==1||!image?.getAttribute("src").endsWith(file))errors.push("Wrong native image");
  for(const img of images){const b=img.getBoundingClientRect();if(!img.complete||img.naturalWidth!==1600)errors.push("Missing native image");if(72*b.width/1600<12-.1)errors.push("Small point label");if(b.left<rect.left-.5||b.right>rect.right+.5)errors.push("Clipped image");}
  if(problem){
   if(area.querySelector("table,svg,.math-inline-expression,[data-selected=true],.source62-four-vertex-answer"))errors.push("Invented answer hint");
   const normal=s=>s.replace(/\s/g,"");if(normal(area.textContent)!==normal(new DOMParser().parseFromString(expected,"text/html").body.textContent))errors.push("Unexpected student text");
  }else{
   const diagrams=[...area.querySelectorAll("svg[data-layer]")];if(diagrams.length!==q.requestedLayers.length*(level===2?2:1))errors.push("Wrong answer diagram count");
   for(const svg of diagrams){const layer=Number(svg.dataset.layer),phase=svg.dataset.phase,row=q.model.layers[layer-1];
    if(!row||!q.requestedLayers.includes(layer)||!["cut","touch"].includes(phase)||phase==="touch"&&level!==2){errors.push("Wrong answer layer");continue;}
    const cells=[...svg.querySelectorAll('rect[data-selected="true"]')].map(r=>[Number(r.dataset.x),Number(r.dataset.z)].join(",")).sort(),want=(phase==="touch"?row.touchCells:row.cutCells).map(c=>c.join(",")).sort();
    if(JSON.stringify(cells)!==JSON.stringify(want))errors.push("Wrong cut cells");
   }
   for(const span of el.querySelectorAll(".math-inline-expression")){const b=span.getBoundingClientRect(),s=getComputedStyle(span);if(span.getClientRects().length!==1||s.whiteSpace!=="nowrap"||b.right>rect.right+.5)errors.push("Wrapped equation");if(s.color!=="rgb(0, 0, 0)"||s.fontWeight!=="400")errors.push("Math typography");}
  }
  if(document.documentElement.scrollWidth>innerWidth+1)errors.push("Viewport overflow");return[...new Set(errors)];
 },{q:JSON.parse(JSON.stringify(q)),expected,mode});
}
async function run(){
 const{chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE}),report={status:"running",candidateOverlay:candidate,runtimeHashes:hashes(),states:[],pdfs:[],picker:[],negative:[],browserErrors:[],failedResponses:[]};
 try{
  const page=await browser.newPage(),errors=report.browserErrors,network=report.failedResponses;page.on("pageerror",e=>errors.push(e.message));page.on("requestfailed",r=>{if(new URL(r.url()).origin===base.origin)network.push({url:r.url(),failure:r.failure()});});page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)network.push(r.url());});
  await page.addInitScript(()=>addEventListener("error",event=>{(window.__sourceLoadErrors||=[]).push({message:event.message,api:typeof window.HSE_GENERATORS,generate:typeof window.HSE_GENERATORS?.generate,key:typeof window.HSE_GENERATORS?.generatorKey,names:Array.isArray(window.HSE_GENERATORS?.names),planePresentation:typeof window.HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION?.renderBank,planeAssets:typeof window.HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS?.image});}));
  await page.route("**/*",r=>new URL(r.request().url()).origin===base.origin?r.continue():r.abort());
  const overlay=r=>r.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nObject.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{reviewLocked:false,reviewReason:'',generatorKey:'${key}',variant:0,verifiedVariantCount:3,answerVisualStatus:'verified',sourceConditionsClarified:true,originalSourceReleaseStatus:'locked'});`});
  if(candidate){
   await page.route("**/source-inventory-grade6.js*",overlay);
   await page.route(url=>url.origin===base.origin&&url.pathname===base.pathname,r=>r.fulfill({contentType:"text/html",body:candidateHtml()}));
  }
  const loaded=()=>page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll(".source62-four-vertex-cut-zoom img")].map(i=>i.decode()));});
  async function check(mode,level){const selector=mode==="problem"?"#problemView .question-item":mode==="answer-key"?"#answerKeyView .answer-key-visuals>figure":"#solutionView .solution-item",roots=await page.locator(selector).all();assert.equal(roots.length,3);for(let v=0;v<3;v++)assert.deepEqual(await inspect(roots[v],v,level,mode),[],`${mode}/l${level}/v${v}`);}
  async function print(level,mode){
   await page.evaluate(()=>{dispatchEvent(new Event("afterprint"));document.body.removeAttribute("data-print-mode");window.__printCalls=0;window.print=()=>window.__printCalls++;});
   await page.locator("#printMenuButton").click();await page.locator(`button[data-print-mode="${mode}"]`).click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();
   await page.emulateMedia({media:"print"});const file=`four-vertex-cut-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});
   await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
  }
  for(const width of[1280,390,320])for(const level of[0,1,2]){
   await page.setViewportSize({width,height:1000});await page.goto(new URL(`?type=${id}&review=1&difficulty=${level-1}`,base).href);await page.locator("#worksheet:not([hidden])").waitFor();await loaded();await check("problem",level);
   if(width===1280&&level===0){
    const root=page.locator("#problemView .question-item").first(),given=root.locator(".source62-four-vertex-given");
    await given.evaluate(el=>el.insertAdjacentHTML("beforeend",'<table data-test-leak><tr><td>2층 6개</td></tr></table>'));assert((await inspect(root,0,level,"problem")).includes("Invented answer hint"));await given.locator("[data-test-leak]").evaluate(e=>e.remove());report.negative.push("invented-layer-table");
    await given.evaluate(el=>el.insertAdjacentHTML("beforeend",'<span data-test-leak>정답은 19개입니다.</span>'));assert((await inspect(root,0,level,"problem")).includes("Unexpected student text"));await given.locator("[data-test-leak]").evaluate(e=>e.remove());report.negative.push("plain-answer-hint");
   }
   await page.locator("#problemView").screenshot({path:path.join(out,`l${level}-${width}-problem.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"problem");
   const zoom=page.locator('#problemView [data-four-vertex-solid="given"] .source62-four-vertex-cut-zoom').first();await zoom.click();await page.locator('.source62-four-vertex-cut-figure-dialog[open]:not([aria-busy=true])').waitFor();assert((await page.locator('.source62-four-vertex-cut-figure-dialog img').getAttribute("src")).endsWith("n4-given.png"));await page.keyboard.press("Escape");assert(await zoom.evaluate(e=>e===document.activeElement));
   await page.locator("#solutionTab").click();await loaded();await check("solution",level);await page.locator("#solutionView").screenshot({path:path.join(out,`l${level}-${width}-solution.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"solution");
   const teacherZoom=page.locator('#solutionView [data-four-vertex-solid="answer"] .source62-four-vertex-cut-zoom').first();await teacherZoom.click();await page.locator('.source62-four-vertex-cut-figure-dialog[open]:not([aria-busy=true])').waitFor();assert((await page.locator('.source62-four-vertex-cut-figure-dialog img').getAttribute("src")).endsWith(`n4-${level===0?"cut-top":"cut-all"}.png`));await page.keyboard.press("Escape");
   await page.locator("#solutionViewerButton").click();for(let v=0;v<3;v++){await page.locator(`#solutionViewerJump [data-solution-index="${v}"]`).click();await loaded();assert.deepEqual(await inspect(page.locator("#solutionViewerContent .solution-viewer-prompt"),v,level,"problem"),[]);assert.deepEqual(await inspect(page.locator("#solutionViewerContent"),v,level,"solution"),[]);}await page.keyboard.press("Escape");
   await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();await check("answer-key",level);if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));report.states.push({width,level,variants:3,viewerVariants:3,zoom:true});
  }
  for(const width of[1280,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();const type=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),id),row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);await row.locator("input").check();await row.locator(".tree-type-copy").click();await loaded();assert.deepEqual(await inspect(page.locator("#typePreviewPopover"),0,1,"problem"),[]);await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await loaded();await check("problem",1);report.picker.push({width,requested:120,generated:3});
  }
  if(candidate)await page.unroute("**/source-inventory-grade6.js*",overlay);await page.goto(base.href);
  const actual=await page.evaluate(id=>{const t=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id);return{locked:t.reviewLocked,key:window.HSE_GENERATORS.generatorKey(t),value:window.HSE_GENERATORS.generate(t,1,0,1,0)};},id);
  if(candidate){assert.equal(actual.locked,true);assert.equal(actual.key,"");assert.equal(actual.value,null);report.actualCatalogStillLocked=true;}
  else{assert.equal(actual.locked,false);assert.equal(actual.key,key);assert(actual.value);assert.equal(actual.value.originalSourceReleaseStatus,"locked");assert.equal(actual.value.sourceExact,false);report.actualCatalogConditionalReady=true;}
  report.lastPageLoadErrors=await page.evaluate(()=>window.__sourceLoadErrors||[]);assert.deepEqual(errors,[]);assert.deepEqual(network,[]);assert.deepEqual(hashes(),report.runtimeHashes);report.status="passed";
 }catch(error){report.status="failed";report.error=error.stack;throw error;}finally{fs.writeFileSync(path.join(out,"bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
 console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,candidateOverlay:candidate,actualCatalogConditionalReady:report.actualCatalogConditionalReady}));
}
module.exports={inspect,run,candidateHtml};if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});
