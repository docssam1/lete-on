"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const contracts=require("./source-6-2-plane-cut-contracts.js"),presentation=require("./source-6-2-plane-cut-presentation.js");
const out=process.env.HSE_SCREENSHOT_DIR,base=new URL(process.env.HSE_BASE_URL),candidate=process.env.HSE_PLANE_CUT_CANDIDATE==="1";
assert(out&&/^E:[/\\]/i.test(out));assert(["localhost","127.0.0.1"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
const id="6-2-u3-e4-exploration",key="sourceGrade6SecondSpaceE4PrismCut",sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const runtime=["index.html","app.js","source-inventory-grade6.js","source-6-2-plane-cut-models.js","source-6-2-plane-cut-assets.js","source-6-2-plane-cut-reference.js","source-6-2-plane-cut-contracts.js","source-6-2-plane-cut-presentation.js","source-6-2-plane-cut-questions.js","source-6-2-plane-cut-questions.css"];
const hashes=()=>Object.fromEntries(runtime.map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));
async function inspect(root,variant,level,mode){
 const q=contracts.generate(id,variant,level);
 return root.evaluate((root,{q,mode,expectedPrompt})=>{
  const errors=[],level=q.level,problem=mode==="problem",area=root.querySelector(problem?".source62-cut-given":".source62-cut-answer");
  if(!area)return ["Missing owned area"];
  const normal=s=>s.replace(/\s/g,""),images=[...area.querySelectorAll("img")],target=area.querySelector("[data-cut-solid] img"),dims=q.model.dimensions.join("x");
  if(images.length!==(problem?4:1))errors.push("Wrong picture count");
  if(!target?.getAttribute("src").endsWith(`${dims}-${problem?"given":level===0?"cut-top":"cut-all"}.png`))errors.push("Wrong target picture");
  for(const img of images){const box=img.getBoundingClientRect();if(!img.complete||img.naturalWidth!==1600)errors.push("Missing native image");if(img===target&&72*box.width/1600<12-.1)errors.push("Small point label");if(box.left<root.getBoundingClientRect().left-.5||box.right>root.getBoundingClientRect().right+.5)errors.push("Clipped image");}
  if(problem){
   const panels=area.querySelectorAll('[data-reference-role="source-given-worked-example"]');if(panels.length!==1)errors.push("Missing original example");
   const refs=[...area.querySelectorAll("[data-cut-reference] img")].map(i=>i.getAttribute("src").split("/").at(-1)).sort();if(JSON.stringify(refs)!==JSON.stringify(["reference-layer-1.png","reference-layer-2.png","reference-solid.png"]))errors.push("Wrong reference pictures");
   if(JSON.stringify([...area.querySelectorAll("[data-reference-number]")].map(e=>Number(e.dataset.referenceNumber)))!==JSON.stringify([1,2,3,4]))errors.push("Wrong original numbering");
   if(area.querySelector("table,.math-inline-expression,svg[data-layer],[data-selected=true],.source62-cut-answer"))errors.push("Invented answer hint");
   const text=normal(area.textContent);if(!text.includes(normal(q.promptText))||!text.includes(normal(q.sourceReferencePromptText)))errors.push("Missing source instruction");
   if(text!==normal(new DOMParser().parseFromString(expectedPrompt,"text/html").body.textContent))errors.push("Unexpected student text");
  }else{
   if(area.querySelector(".source62-cut-reference"))errors.push("Reference duplicated into answer");
   const diagrams=[...area.querySelectorAll("svg[data-layer]")],expected=q.requestedLayers.length*(level===2?2:1);if(diagrams.length!==expected)errors.push("Wrong answer diagram count");
   for(const svg of diagrams){const layer=Number(svg.dataset.layer),phase=svg.dataset.phase,row=q.model.layers[layer-1],want=phase==="touch"?row.touchCells:row.cutCells;
    if(!q.requestedLayers.includes(layer)||!["cut","touch"].includes(phase)||phase==="touch"&&level!==2){errors.push("Wrong answer layer");continue;}
    const cells=[...svg.querySelectorAll('rect[data-selected="true"]')].map(r=>[Number(r.dataset.x),Number(r.dataset.z)].join(",")).sort();if(JSON.stringify(cells)!==JSON.stringify(want.map(c=>c.join(",")).sort()))errors.push("Wrong cut cells");
   }
   for(const span of root.querySelectorAll(".math-inline-expression")){const b=span.getBoundingClientRect(),s=getComputedStyle(span);if(span.getClientRects().length!==1||s.whiteSpace!=="nowrap"||b.right>root.getBoundingClientRect().right+.5)errors.push("Wrapped equation");if(s.color!=="rgb(0, 0, 0)"||s.fontWeight!=="400")errors.push("Math typography");}
  }
  if(document.documentElement.scrollWidth>innerWidth+1)errors.push("Viewport overflow");return [...new Set(errors)];
 },{q:JSON.parse(JSON.stringify(q)),mode,expectedPrompt:presentation.renderBank(id,variant,level).prompt});
}
async function run(){
 const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE}),report={status:"running",candidateOverlay:candidate,runtimeHashes:hashes(),states:[],pdfs:[],picker:[],negative:[]};
 try{
  const page=await browser.newPage(),errors=[],network=[];page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)network.push(r.url());});
  await page.route("**/*",r=>new URL(r.request().url()).origin===base.origin?r.continue():r.abort());
  if(candidate)await page.route("**/source-inventory-grade6.js*",r=>r.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nObject.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{reviewLocked:false,reviewReason:'',generatorKey:'${key}',variant:0,verifiedVariantCount:3,answerVisualStatus:'verified',sourceConditionsClarified:true,originalSourceReleaseStatus:'locked'});`}));
  const loaded=()=>page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll(".source62-cut-zoom img")].map(i=>i.decode().catch(error=>{throw new Error(`${error.name}: ${i.currentSrc||i.src}; connected=${i.isConnected}; complete=${i.complete}; width=${i.naturalWidth}`);})));});
  async function check(mode,level){const selector=mode==="problem"?"#problemView .question-item":mode==="answer-key"?"#answerKeyView .answer-key-visuals>figure":"#solutionView .solution-item",roots=await page.locator(selector).all();assert.equal(roots.length,3);for(let v=0;v<3;v++)assert.deepEqual(await inspect(roots[v],v,level,mode),[],`${mode}/l${level}/v${v}`);}
  async function print(level,mode){
   await page.evaluate(()=>{dispatchEvent(new Event("afterprint"));document.body.removeAttribute("data-print-mode");window.__printCalls=0;window.print=()=>window.__printCalls++;});
   await page.locator("#printMenuButton").click();await page.locator(`button[data-print-mode="${mode}"]`).click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();
   await page.emulateMedia({media:"print"});const file=`plane-cut-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});
   await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
  }
  for(const width of [1280,390,320])for(const level of [0,1,2]){
   await page.setViewportSize({width,height:1000});await page.goto(new URL(`?type=${id}&review=1&difficulty=${level-1}`,base).href);await page.locator("#worksheet:not([hidden])").waitFor();await loaded();await check("problem",level);
   if(width===1280&&level===0){
    const root=page.locator("#problemView .question-item").first(),given=root.locator(".source62-cut-given");
    await given.evaluate(el=>el.insertAdjacentHTML("beforeend",'<table data-test-leak="true"><tr><td>2층 5개</td></tr></table>'));assert((await inspect(root,0,level,"problem")).includes("Invented answer hint"));await given.locator("[data-test-leak]").evaluate(e=>e.remove());report.negative.push("invented-layer-table");
    const image=given.locator('[data-cut-solid="given"] img');await image.evaluate(e=>{const clone=e.cloneNode(true);clone.dataset.testDuplicate="true";e.after(clone);});assert((await inspect(root,0,level,"problem")).includes("Wrong picture count"));await given.locator("[data-test-duplicate]").evaluate(e=>e.remove());report.negative.push("duplicated-native-image");
    const number=given.locator('[data-reference-number="1"]');await number.evaluate(e=>e.dataset.referenceNumber="7");assert((await inspect(root,0,level,"problem")).includes("Wrong original numbering"));await given.locator('[data-reference-number="7"]').evaluate(e=>e.dataset.referenceNumber="1");report.negative.push("target-answer-in-reference");
    await given.evaluate(e=>e.insertAdjacentHTML("beforeend",'<span data-test-leak="true">정답은 5개입니다.</span>'));assert((await inspect(root,0,level,"problem")).includes("Unexpected student text"));await given.locator("[data-test-leak]").evaluate(e=>e.remove());report.negative.push("plain-answer-hint");await check("problem",level);
   }
   await page.locator("#problemView").screenshot({path:path.join(out,`l${level}-${width}-problem.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"problem");
   const zoom=page.locator('#problemView [data-cut-solid="given"] .source62-cut-zoom').first();await zoom.click();await page.locator('.source62-cut-figure-dialog[open]:not([aria-busy=true])').waitFor();assert((await page.locator('.source62-cut-figure-dialog img').getAttribute("src")).endsWith("3x2x2-given.png"));await page.keyboard.press("Escape");assert(await zoom.evaluate(e=>e===document.activeElement));
   await page.locator("#solutionTab").click();await loaded();await check("solution",level);await page.locator("#solutionView").screenshot({path:path.join(out,`l${level}-${width}-solution.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"solution");
   await page.locator("#solutionViewerButton").click();for(let v=0;v<3;v++){await page.locator(`#solutionViewerJump [data-solution-index="${v}"]`).click();await loaded();assert.deepEqual(await inspect(page.locator("#solutionViewerContent .solution-viewer-prompt"),v,level,"problem"),[]);assert.deepEqual(await inspect(page.locator("#solutionViewerContent"),v,level,"solution"),[]);}await page.keyboard.press("Escape");
   await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();await check("answer-key",level);if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));report.states.push({width,level,variants:3,viewerVariants:3,zoom:true});
  }
  for(const width of [1280,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();const type=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),id),row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);await row.locator("input").check();await row.locator(".tree-type-copy").click();await loaded();assert.deepEqual(await inspect(page.locator("#typePreviewPopover"),0,1,"problem"),[]);await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await loaded();await check("problem",1);report.picker.push({width,requested:120,generated:3});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(network,[]);assert.deepEqual(hashes(),report.runtimeHashes);report.status="passed";
 }catch(error){report.status="failed";report.error=error.stack;throw error;}finally{fs.writeFileSync(path.join(out,"bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
 console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,candidateOverlay:candidate}));
}
module.exports={inspect,run};if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});
