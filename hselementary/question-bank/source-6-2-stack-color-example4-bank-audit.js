"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),vm=require("node:vm");
const contracts=require("./source-6-2-stack-color-example4-contracts.js"),presentation=require("./source-6-2-stack-color-example4-presentation.js"),{visibleLayout}=require("./source-6-2-stack-operation-learner-audit.js");
const id="6-2-u3-e2-example-4",key="sourceGrade6SecondSpaceE2ColorExtrema",read=file=>fs.readFileSync(path.join(__dirname,file),"utf8"),sha=bytes=>crypto.createHash("sha256").update(bytes).digest("hex");
const runtime=["index.html","app.js","curriculum.js","generators.js","styles.css","worksheet-tools.css","source-inventory-grade6.js","source-6-2-stack-color-example4-models.js","source-6-2-stack-color-example4-contracts.js","source-6-2-stack-color-example4-presentation.js","source-6-2-stack-color-example4-questions.js","source-6-2-stack-color-example4-questions.css"];
const hashes=()=>Object.fromEntries(runtime.map(file=>[file,sha(read(file))]));
function wrapperTest(){
  const window={HSE_GENERATORS:{generatorKey:()=>"old",generate:()=>({old:true}),names:[]},HSE_SOURCE_GRADE6_STACK_COLOR_EXAMPLE4_PRESENTATION:presentation};
  vm.runInNewContext(read("source-6-2-stack-color-example4-questions.js"),{window});const api=window.HSE_GENERATORS,type={sourceItemId:id,generatorKey:key,reviewLocked:false};let negative=0;
  assert.equal(api.generatorKey({...type,reviewLocked:true}),"");assert.equal(api.generate({...type,reviewLocked:true},1,0,1),null);negative++;
  for(const wrong of [{...type,generatorKey:"other"},{...type,sourceItemId:"other"}]){assert.equal(api.generate(wrong,1,0,1),null);negative++;}
  for(const v of [-1,.5,NaN,Infinity,"0",null,{},Number.MAX_SAFE_INTEGER+1]){assert.throws(()=>api.generate(type,1,0,1,v));negative++;}
  for(const d of [-2,2,.5,NaN,Infinity,"0",{}]){assert.throws(()=>api.generate(type,1,d,1,0));negative++;}
  for(const d of [-1,0,1])for(let v=0;v<9;v++){const q=api.generate(type,1,d,1,v),p=presentation.render(id,v%3,d+1);assert.equal(q.prompt,p.prompt);assert.equal(q.answer,p.answer);assert.equal(q.verifiedPoolIndex,v%3);assert.equal(q.publisherAnswerVerified,false);}
  assert.equal(api.generate({sourceItemId:"old"},1,0,1).old,true);return negative;
}
async function inspect(item,variant,level,mode,poison=false){
  const q=contracts.generate(id,variant,level),check=await item.evaluate((root,{q,mode,poison})=>{
    const errors=[],answer=root.querySelector(".source62-color-answer")??root;
    function grid(svg,expected){
      const rects=[...svg.querySelectorAll("rect")],actual=Array.from({length:4},()=>Array(4).fill(null));
      if(poison && rects.length)rects[0].setAttribute("class",rects[0].classList.contains("is-dark") ? "is-light" : "is-dark");
      for(const rect of rects){const x=(+rect.getAttribute("x")-4)/28,z=(+rect.getAttribute("y")-4)/28;
        if(!Number.isInteger(x)||!Number.isInteger(z)||x<0||x>3||z<0||z>3||actual[z][x]!==null||+rect.getAttribute("width")!==28||+rect.getAttribute("height")!==28){errors.push("Wrong layer square address");continue;}
        const fill=getComputedStyle(rect).fill;if(!["rgb(68, 68, 68)","rgb(255, 255, 255)"].includes(fill))errors.push("Wrong layer colors");actual[z][x]=fill==="rgb(68, 68, 68)"?1:0;
      }if(rects.length!==16 || JSON.stringify(actual)!==JSON.stringify(expected))errors.push("Wrong source layer color positions");
    }
    if(mode==="problem"){
      const image=root.querySelector(".source62-color-given img");if(!image?.complete||image.naturalWidth!==1280||image.naturalHeight!==1040||!image.src.endsWith(`v${q.variant}-given.png`))errors.push("Wrong or unloaded given picture");
      if(!root.textContent.includes(q.promptText)||root.querySelector(".source62-color-answer,svg.source62-color-grid"))errors.push("Wrong prompt or learner answer leak");
      if(image && image.getBoundingClientRect().width*28/640<12)errors.push("Source direction glyph too small");
    }else{
      for(const name of ["maximum","minimum"]){const section=answer.querySelector(`[data-extreme="${name}"]`),svgs=[...section.querySelectorAll("svg")];if(svgs.length!==2)errors.push("Missing extreme layers");else{grid(svgs[0],q[`${name}Layers`].at(-1));grid(svgs[1],q[`${name}Layers`][0]);}}
      const witness=[...answer.querySelectorAll(".source62-color-witness svg")];if(witness.length!==(q.secondary?q.height:0))errors.push("Missing additional witness");witness.forEach((svg,y)=>grid(svg,q.witnessLayers[y]));
      if(!answer.textContent.includes(`최대 ${q.maximum}개`) || !answer.textContent.includes(`최소 ${q.minimum}개`))errors.push("Extrema order changed");
    }return {errors};
  },{q:JSON.parse(JSON.stringify(q)),mode,poison});
  if(poison)return check.errors;assert.deepEqual(check.errors,[]);await visibleLayout(item,false);
}
async function main(){
  const output=process.env.HSE_SCREENSHOT_DIR,base=new URL(process.env.HSE_BASE_URL),candidate=process.env.HSE_COLOR_CANDIDATE==="1";assert(output && /^E:[/\\]/i.test(output));assert(["127.0.0.1","localhost"].includes(base.hostname));fs.mkdirSync(output,{recursive:true});
  const initial=hashes(),report={status:"running",candidateOverlay:candidate,actualInventoryTested:!candidate,runtimeHashes:initial,wrapperRejections:wrapperTest(),states:[],pdfs:[],picker:[],negative:[]};
  const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE});
  try{
    const context=await browser.newContext();await context.route("**/*",route=>new URL(route.request().url()).origin===base.origin ? route.continue() : route.abort());
    async function prepare(page){if(candidate)await page.route("**/source-inventory-grade6.js*",route=>route.fulfill({contentType:"application/javascript",body:read("source-inventory-grade6.js")+`\nwindow.__colorBaseline=window.HSE_SOURCE_INVENTORY_GRADE6.items.map(i=>({sourceItemId:i.sourceItemId,reviewLocked:i.reviewLocked,generatorKey:i.generatorKey,verifiedVariantCount:i.verifiedVariantCount,answerVisualStatus:i.answerVisualStatus}));Object.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId===${JSON.stringify(id)}),{reviewLocked:false,generatorKey:${JSON.stringify(key)},variant:0,answerVisualStatus:'verified',verifiedVariantCount:3,generationMode:'fixed-verified-pool',verifiedVariantTarget:3});`}));}
    async function inventory(page){
      await page.waitForFunction(()=>!!window.HSE_SOURCE_GRADE6_STACK_COLOR_EXAMPLE4_QUESTIONS);
      const {items,baseline}=await page.evaluate(()=>({items:window.HSE_SOURCE_INVENTORY_GRADE6.items.map(i=>({sourceItemId:i.sourceItemId,reviewLocked:i.reviewLocked,generatorKey:i.generatorKey,verifiedVariantCount:i.verifiedVariantCount,answerVisualStatus:i.answerVisualStatus})),baseline:window.__colorBaseline}));
      const item=items.find(i=>i.sourceItemId===id);assert(!item.reviewLocked && item.generatorKey===key && item.verifiedVariantCount===3 && item.answerVisualStatus==="verified");
      if(candidate)for(const other of items.filter(i=>i.sourceItemId!==id))assert.deepEqual(other,baseline.find(i=>i.sourceItemId===other.sourceItemId));else assert.equal(baseline,undefined);
      for(const locked of ["6-2-u3-e2-example-2","6-2-u3-e2-mission-1","6-2-u3-e2-mission-3","6-2-u3-e2-mission-5"])assert(items.find(i=>i.sourceItemId===locked).reviewLocked);
    }
    async function decode(page){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});}
    async function check(items,level,mode){assert.equal(items.length,3);for(let v=0;v<3;v++)await inspect(items[v],v,level,mode);}
    async function print(page,level,mode){
      await page.evaluate(mode=>{document.body.dataset.printMode=mode;dispatchEvent(new Event("beforeprint"));},mode);await page.emulateMedia({media:"print"});await decode(page);
      const file=`color-bank-l${level}-${mode}.pdf`;await page.pdf({path:path.join(output,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
    }
    for(const width of [1280,390,320])for(let level=0;level<3;level++){
      const page=await context.newPage();await page.setViewportSize({width,height:900});const errors=[],bad=[];page.on("pageerror",error=>errors.push(error.message));page.on("response",response=>{if(response.status()>=400)bad.push(response.url());});
      try{
        await prepare(page);await page.goto(new URL(`?type=${id}&review=1&difficulty=${level-1}`,base).href);await inventory(page);await page.locator("#worksheet:not([hidden])").waitFor();await decode(page);
        await check(await page.locator("#problemView .question-item").all(),level,"problem");await page.locator("#problemView").screenshot({animations:"disabled",path:path.join(output,`color-bank-l${level}-${width}-problem.png`)});if(width===1280)await print(page,level,"problem");
        await page.locator("#solutionTab").click();await check(await page.locator("#solutionView .solution-item").all(),level,"solution");await page.locator("#solutionView").screenshot({animations:"disabled",path:path.join(output,`color-bank-l${level}-${width}-solution.png`)});if(width===1280)await print(page,level,"solution");
        if(width===1280 && level===1){assert((await inspect(page.locator("#solutionView .solution-item").first(),0,level,"solution",true)).length>0);await page.locator("#newProblemButton").click();await page.locator("#solutionTab").click();await decode(page);await check(await page.locator("#solutionView .solution-item").all(),level,"solution");report.negative.push("wrong-visible-answer-cell-colors");}
        await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);await check(await page.locator("#answerKeyView .answer-key-visuals>figure").all(),level,"solution");if(width===1280)await print(page,level,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
        await page.locator("#solutionViewerButton").click();for(let v=0;v<3;v++){await page.locator(`#solutionViewerJump [data-solution-index="${v}"]`).click();await decode(page);await inspect(page.locator("#solutionViewerContent"),v,level,"solution");}await page.keyboard.press("Escape");
        assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);report.states.push({width,level,variants:3,viewerVariants:3,sourceColorsPreserved:true,studentAnswerSafe:true});
      }finally{await page.close();}
    }
    for(const width of [1280,390,320]){
      const page=await context.newPage();await page.setViewportSize({width,height:900});
      try{
        await prepare(page);await page.goto(base.href);await inventory(page);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
        const type=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(t=>t.types))).find(t=>t.sourceItemId===id),id),row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);
        await row.locator("input").check();await row.locator(".tree-type-copy").click();await decode(page);await inspect(page.locator("#typePreviewPopover"),0,1,"problem");await page.locator("#typePreviewPopover").screenshot({animations:"disabled",path:path.join(output,`color-bank-picker-${width}.png`)});
        await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await decode(page);await check(await page.locator("#problemView .question-item").all(),1,"problem");report.picker.push({width,requested:120,generated:3,otherLocksPreserved:true});
      }finally{await page.close();}
    }
    assert.equal(report.states.length,9);assert.equal(report.pdfs.length,9);assert.equal(report.picker.length,3);assert.deepEqual(hashes(),initial);report.status="passed";
  }catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{fs.writeFileSync(path.join(output,"color-bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
  console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,candidateOverlay:candidate,wrapperRejections:report.wrapperRejections}));
}
if(process.argv[2]==="--self-test")console.log(JSON.stringify({status:"passed",wrapperRejections:wrapperTest()}));else main().catch(error=>{console.error(error);process.exitCode=1;});
