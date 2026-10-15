"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),crypto=require("node:crypto");
const presentation=require("./source-6-2-stack-hidden-example3-presentation.js"),contracts=require("./source-6-2-stack-hidden-example3-contracts.js");
const {visibleLayout}=require("./source-6-2-stack-operation-learner-audit.js");
const id="6-2-u3-e2-example-3",key="sourceGrade6SecondSpaceE2HiddenCubes",read=file=>fs.readFileSync(path.join(__dirname,file),"utf8");
const runtime=["index.html","app.js","styles.css","worksheet-tools.css","curriculum.js","generators.js","source-inventory-grade6.js",
  "source-6-2-stack-hidden-example3-models.js","source-6-2-stack-hidden-example3-contracts.js","source-6-2-stack-hidden-example3-presentation.js","source-6-2-stack-hidden-example3-questions.js","source-6-2-stack-hidden-example3-questions.css"];
const sha=bytes=>crypto.createHash("sha256").update(bytes).digest("hex"),hashes=()=>Object.fromEntries(runtime.map(file=>[file,sha(read(file))]));
function wrapperTest(){
  const window={HSE_GENERATORS:{generatorKey:()=>"old",generate:()=>({old:true}),names:[]},HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_PRESENTATION:presentation};
  vm.runInNewContext(read("source-6-2-stack-hidden-example3-questions.js"),{window});const api=window.HSE_GENERATORS,type={sourceItemId:id,generatorKey:key,reviewLocked:false};let negative=0;
  assert.equal(api.generatorKey({...type,reviewLocked:true}),"");assert.equal(api.generate({...type,reviewLocked:true},1,0,1),null);negative++;
  for(const invalid of [{...type,generatorKey:"other"},{...type,sourceItemId:"other"}]){assert.equal(api.generate(invalid,1,0,1),null);negative++;}
  for(const v of [-1,.5,NaN,Infinity,"0",null,{},Number.MAX_SAFE_INTEGER+1]){assert.throws(()=>api.generate(type,1,0,1,v));negative++;}
  for(const d of [-2,2,.5,NaN,Infinity,"0",{}]){assert.throws(()=>api.generate(type,1,d,1,0));negative++;}
  for(const d of [-1,0,1])for(let v=0;v<9;v++){const q=api.generate(type,1,d,1,v),expected=presentation.render(id,v%3,d+1);assert.equal(q.prompt,expected.prompt);assert.equal(q.answer,expected.answer);assert.equal(q.verifiedPoolIndex,v%3);assert.equal(q.verifiedVariantCount,3);}
  assert.equal(api.generatorKey({sourceItemId:"old"}),"old");assert.equal(api.generate({sourceItemId:"old"},1,0,1).old,true);return negative;
}
async function inspect(item,variant,level,mode){
  const q=contracts.generate(id,variant,level),check=await item.evaluate((root,{q,mode})=>{
    const errors=[],container=root.querySelector(mode==="problem" ? ".source62-hidden-given" : ".source62-hidden-answer")??root,image=container.querySelector("img");
    if(!image || !image.complete || image.naturalWidth!==1280 || image.naturalHeight!==1040 || !image.src.endsWith(`v${q.variant}-${mode==="problem" ? "outer" : "inner"}.png`))errors.push("Wrong or unloaded source image");
    if(mode==="problem"){
      if(root.querySelector(".source62-hidden-answer,table") || !root.textContent.includes("바닥에 닿은 면은 보이는"))errors.push("Student answer boundary or ground rule failed");
      if(!root.textContent.includes(q.promptText))errors.push("Source condition changed");
    }else{
      if(!container.textContent.includes(q.secondary ? `(1) ${q.answer}개, (2) ${q.secondary.answer}개` : `${q.answer}개`))errors.push("Wrong answer");
      if(!container.querySelector("figcaption")?.textContent.includes("꺼낸 모양"))errors.push("Inner model not distinguished");
      const headings=[...container.querySelectorAll("thead th")].slice(1).map(el=>+el.textContent),counts=[...container.querySelectorAll("tbody td")].map(el=>+el.textContent);
      if(JSON.stringify(headings)!==JSON.stringify(q.rows.map(row=>row.layer)) || JSON.stringify(counts)!==JSON.stringify(q.rows.map(row=>row.hidden)))errors.push("Wrong layer answer table");
    }
    const b=image?.getBoundingClientRect(),r=container.getBoundingClientRect();if(b && (b.left<r.left-1 || b.right>r.right+1 || b.top<r.top-1 || b.bottom>r.bottom+1))errors.push("Image outside its figure container");
    if(root.id==="solutionViewerContent" && root.scrollHeight>root.clientHeight && !["auto","scroll"].includes(getComputedStyle(root).overflowY))errors.push("Viewer content cannot scroll to the answer");
    if(image && getComputedStyle(document.body).getPropertyValue("--bank-font") && 28*image.getBoundingClientRect().width/640<12)errors.push(`Image label below 12px: ${image.getBoundingClientRect().width}px in ${root.id||root.className}; ${JSON.stringify({root:root.getBoundingClientRect().width,question:root.querySelector('.type-preview-question')?.getBoundingClientRect().width,padding:root.querySelector('.type-preview-question') ? getComputedStyle(root.querySelector('.type-preview-question')).padding : null})}`);
    return {errors};
  },{q:JSON.parse(JSON.stringify(q)),mode});assert.deepEqual(check.errors,[]);await visibleLayout(item,false);
}
async function main(){
  const output=process.env.HSE_SCREENSHOT_DIR,base=new URL(process.env.HSE_BASE_URL);assert(output && /^E:[/\\]/i.test(output));assert(["127.0.0.1","localhost"].includes(base.hostname));fs.mkdirSync(output,{recursive:true});
  const candidate=process.env.HSE_HIDDEN_CANDIDATE==="1",pickerOnly=process.env.HSE_HIDDEN_PICKER_ONLY==="1",initial=hashes(),report={status:"running",partialScope:pickerOnly,candidateOverlay:candidate,actualInventoryTested:!candidate,runtimeHashes:initial,wrapperRejections:wrapperTest(),states:[],pdfs:[],picker:[]};
  const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE});
  try{
    const context=await browser.newContext();await context.route("**/*",route=>new URL(route.request().url()).origin===base.origin ? route.continue() : route.abort());
    async function prepare(page){
      if(candidate)await page.route("**/source-inventory-grade6.js*",route=>route.fulfill({contentType:"application/javascript",body:read("source-inventory-grade6.js")+`\nwindow.__hiddenBaseline=window.HSE_SOURCE_INVENTORY_GRADE6.items.map(i=>({sourceItemId:i.sourceItemId,reviewLocked:i.reviewLocked,generatorKey:i.generatorKey,verifiedVariantCount:i.verifiedVariantCount,answerVisualStatus:i.answerVisualStatus}));const item=window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId===${JSON.stringify(id)});Object.assign(item,{reviewLocked:false,generatorKey:${JSON.stringify(key)},variant:0,answerVisualStatus:'verified',verifiedVariantCount:3,generationMode:'fixed-verified-pool',verifiedVariantTarget:3});`}));
    }
    async function inventory(page){
      await page.waitForFunction(()=>!!window.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_QUESTIONS);
      const {items,baseline}=await page.evaluate(()=>({items:window.HSE_SOURCE_INVENTORY_GRADE6.items.map(i=>({sourceItemId:i.sourceItemId,reviewLocked:i.reviewLocked,generatorKey:i.generatorKey,verifiedVariantCount:i.verifiedVariantCount,answerVisualStatus:i.answerVisualStatus})),baseline:window.__hiddenBaseline}));
      const item=items.find(i=>i.sourceItemId===id);assert(!item.reviewLocked && item.generatorKey===key && item.verifiedVariantCount===3 && item.answerVisualStatus==="verified");
      if(candidate){assert.equal(items.length,baseline.length);for(const other of items.filter(i=>i.sourceItemId!==id))assert.deepEqual(other,baseline.find(i=>i.sourceItemId===other.sourceItemId));}else assert.equal(baseline,undefined);
      for(const locked of ["6-2-u3-e2-example-2","6-2-u3-e2-example-4","6-2-u3-e2-mission-1","6-2-u3-e2-mission-3","6-2-u3-e2-mission-5"])assert(items.find(i=>i.sourceItemId===locked).reviewLocked);
    }
    async function decoded(page){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});}
    async function check(items,level,mode){assert.equal(items.length,3);for(let v=0;v<3;v++)await inspect(items[v],v,level,mode);}
    async function print(page,level,mode){
      await page.evaluate(mode=>{document.body.dataset.printMode=mode;dispatchEvent(new Event("beforeprint"));},mode);await page.emulateMedia({media:"print"});await decoded(page);
      const file=`hidden-bank-l${level}-${mode}.pdf`;await page.pdf({path:path.join(output,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
    }
    for(const width of pickerOnly ? [] : [1280,390,320])for(let level=0;level<3;level++){
      const page=await context.newPage();await page.setViewportSize({width,height:900});const errors=[],bad=[];page.on("pageerror",error=>errors.push(error.message));page.on("response",response=>{if(response.status()>=400)bad.push(response.url());});
      try{
        await prepare(page);await page.goto(new URL(`?type=${id}&review=1&difficulty=${level-1}`,base).href);await inventory(page);await page.locator("#worksheet:not([hidden])").waitFor();await decoded(page);
        await check(await page.locator("#problemView .question-item").all(),level,"problem");await page.locator("#problemView").screenshot({animations:"disabled",path:path.join(output,`hidden-bank-l${level}-${width}-problem.png`)});if(width===1280)await print(page,level,"problem");
        await page.locator("#solutionTab").click();await decoded(page);await check(await page.locator("#solutionView .solution-item").all(),level,"solution");await page.locator("#solutionView").screenshot({animations:"disabled",path:path.join(output,`hidden-bank-l${level}-${width}-solution.png`)});if(width===1280)await print(page,level,"solution");
        await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);
        await decoded(page);await check(await page.locator("#answerKeyView .answer-key-visuals > figure").all(),level,"solution");if(width===1280)await print(page,level,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
        await page.locator("#solutionViewerButton").click();for(let v=0;v<3;v++){await page.locator(`#solutionViewerJump [data-solution-index="${v}"]`).click();await decoded(page);await inspect(page.locator("#solutionViewerContent"),v,level,"solution");}
        await page.keyboard.press("Escape");assert(await page.locator("#solutionViewer").isHidden());assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);report.states.push({width,level,variants:3,viewerVariants:3,answerImages:true,studentAnswerSafe:true});
      }finally{await page.close();}
    }
    for(const width of [1280,390,320]){
      const page=await context.newPage();await page.setViewportSize({width,height:900});
      try{
        await prepare(page);await page.goto(base.href);await inventory(page);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
        const type=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(t=>t.types))).find(t=>t.sourceItemId===id),id);
        const row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);await row.locator("input").check();await row.locator(".tree-type-copy").click();await decoded(page);await inspect(page.locator("#typePreviewPopover"),0,1,"problem");await page.locator("#typePreviewPopover").screenshot({animations:"disabled",path:path.join(output,`hidden-bank-picker-${width}.png`)});
        await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await decoded(page);await check(await page.locator("#problemView .question-item").all(),1,"problem");report.picker.push({width,requested:120,generated:3,otherLocksPreserved:true});
      }finally{await page.close();}
    }
    assert.equal(report.states.length,pickerOnly ? 0 : 9);assert.equal(report.pdfs.length,pickerOnly ? 0 : 9);assert.equal(report.picker.length,3);assert.deepEqual(hashes(),initial);report.status="passed";
  }catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{fs.writeFileSync(path.join(output,"hidden-bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
  console.log(JSON.stringify({status:report.status,candidateOverlay:candidate,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,wrapperRejections:report.wrapperRejections}));
}
if(process.argv[2]==="--self-test")console.log(JSON.stringify({status:"passed",wrapperRejections:wrapperTest()}));else main().catch(error=>{console.error(error);process.exitCode=1;});
