"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const contracts=require("./source-6-2-stair-mission1-contracts.js"),presentation=require("./source-6-2-stair-mission1-presentation.js"),{visibleLayout}=require("./source-6-2-stack-operation-learner-audit.js");
const id="6-2-u3-e2-mission-1",key="sourceGrade6SecondSpaceE2StairCount",out=process.env.HSE_SCREENSHOT_DIR,base=new URL(process.env.HSE_BASE_URL),candidate=process.env.HSE_STAIR_MISSION1_CANDIDATE==="1";
assert(out&&/^E:[/\\]/i.test(out));assert(["localhost","127.0.0.1"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
const runtime=["index.html","app.js","source-inventory-grade6.js","source-6-2-painted-mission3-presentation.js","source-6-2-stack-pattern-models.js","source-6-2-stair-mission1-contracts.js","source-6-2-stair-mission1-presentation.js","source-6-2-stair-mission1-questions.js","source-6-2-stair-mission1-questions.css"];
const sha=b=>crypto.createHash("sha256").update(b).digest("hex"),hashes=()=>Object.fromEntries(runtime.map(file=>[file,sha(fs.readFileSync(path.join(__dirname,file)))]));
function fixture(variant,level){const q=contracts.generate(id,variant,level);return {variant,level,n:q.model.n,answer:q.answer,solutionEquations:q.solutionEquations,layers:q.model.layers.map(row=>row.layer).map(layer=>({layer,cells:q.model.layers[layer-1].cells})),layerCue:q.layerCue};}
async function inspect(root,variant,level,mode){
  const q=contracts.generate(id,variant,level),render=presentation.render(id,variant,level);
  return root.evaluate((element,{q,render,mode})=>{
    const errors=[],norm=s=>s.replace(/[\s,]/g,""),text=norm(element.textContent);
    if(mode==="problem"){
      const given=element.querySelector(".source62-stair1-given"),image=given?.querySelector("img");
      if(!text.includes(norm(q.learnerConditions)))errors.push("Missing construction");
      if(!image?.complete||image.naturalWidth!==1600||image.naturalHeight!==852||!image.currentSrc.endsWith("/prefix-given.png"))errors.push("Wrong source prefix");
      if(image&&72*image.getBoundingClientRect().width/1600<12)errors.push("Caption under twelve pixels");
      if(!given||q.layerCue!==null||given.querySelector("table,[data-role=given-layer-counts],[data-layer-count]"))errors.push("Given leaks layer table");
      if(given?.querySelector(".math-inline-expression")||/[=+×]/.test(given?.textContent||""))errors.push("Given leaks equation");
      if(q.level===0&&(!q.promptText.includes("그림에 보이는")||q.model.n!==[3,2,1][q.variant]||(q.promptText.match(/몇 개인지/g)||[]).length!==1))errors.push("Easy is not one visible state");
      if(element.querySelector(".source62-stair1-answer,svg[data-layer]"))errors.push("Given leaks answer geometry");
    }else{
      if(element.innerHTML.includes("다르게 세면"))errors.push("Alternate reviewer solution leaked");
      const answer=element.querySelector(".source62-stair1-answer");if(!answer||answer.dataset.source!==q.sourceItemId)errors.push("Wrong answer source");
      if(mode!=="answer-key"&&!text.includes(norm(render.answer)))errors.push("Wrong ordered answer");
      const expected=q.model.layers.map(row=>row.layer),grids=[...element.querySelectorAll("svg[data-layer]")];
      if(grids.length!==expected.length)errors.push("Missing answer layers");
      grids.forEach((svg,index)=>{
        const layer=Number(svg.dataset.layer);if(layer!==expected[index])errors.push("Wrong answer layer");
        const cells=[...svg.querySelectorAll("rect[data-x]")].map(rect=>[Number(rect.dataset.x),Number(rect.dataset.z)]),actual=new Set(cells.map(c=>c.join(","))),wanted=q.model.layers[layer-1]?.cells||[];
        const removed=svg.closest("figure")?.dataset.removed==="true",expectedRemoved=Boolean(q.removedTopLayers?.rows.some(row=>row.layer===layer));if(removed!==expectedRemoved)errors.push("Wrong removed layer");
        for(const rect of svg.querySelectorAll("rect[data-x]")){if(Number(rect.getAttribute("x"))!==8+24*Number(rect.dataset.x)||Number(rect.getAttribute("y"))!==8+24*Number(rect.dataset.z)||Number(rect.getAttribute("width"))!==24||Number(rect.getAttribute("height"))!==24)errors.push("Incorrect drawn cell coordinates");}
        if(actual.size!==cells.length||cells.length!==wanted.length||wanted.some(c=>!actual.has(c.join(","))))errors.push("Wrong answer cells");
        const b=svg.getBoundingClientRect(),parent=element.getBoundingClientRect();if(b.left<parent.left-.5||b.right>parent.right+.5)errors.push("Layer outside column");
        for(const rect of svg.querySelectorAll("rect[data-x]")){const style=getComputedStyle(rect);if(style.stroke!=="rgb(0, 0, 0)")errors.push("Wrong layer line colour");}
      });
      for(const equation of element.querySelectorAll(".math-inline-expression")){
        const b=equation.getBoundingClientRect(),parent=element.getBoundingClientRect(),style=getComputedStyle(equation);
        if(equation.getClientRects().length!==1||style.whiteSpace!=="nowrap"||b.left<parent.left-.5||b.right>parent.right+.5)errors.push("Equation outside one line");
        if(style.color!=="rgb(0, 0, 0)"||style.fontWeight!=="400")errors.push("Wrong equation typography");
      }
    }
    return errors;
  },{q:JSON.parse(JSON.stringify(q)),render,mode});
}
async function main(){
  const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE});
  const report={status:"running",candidateOverlay:candidate,actualInventoryTested:!candidate,runtimeHashes:hashes(),states:[],pdfs:[],picker:[],negative:[],fixtures:[0,1,2].map(level=>({level,variants:[0,1,2].map(v=>fixture(v,level))}))};
  try{
    const page=await browser.newPage(),errors=[],failed=[];page.on("pageerror",e=>errors.push(e.message));page.on("requestfailed",r=>{if(new URL(r.url()).origin===base.origin)failed.push(r.url());});page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)failed.push(`${r.status()}:${r.url()}`);});
    await page.route("**/*",route=>new URL(route.request().url()).origin===base.origin?route.continue():route.abort());
    if(candidate)await page.route("**/source-inventory-grade6.js*",route=>route.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nwindow.__stairBaseline=JSON.stringify(window.HSE_SOURCE_INVENTORY_GRADE6.items.filter(i=>i.sourceItemId!=='${id}'));Object.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{typeLabel:"두 방향 계단 모양의 쌓기나무 수 구하기",reviewLocked:false,generatorKey:'${key}',variant:0,verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualStatus:'verified',generationMode:'fixed-verified-pool',sourceConditionsClarified:true,originalAnswerDeterminate:false,originalSourceReleaseStatus:'locked'});`}));
    async function decode(){await page.evaluate(async()=>{await document.fonts.ready;for(const image of document.querySelectorAll(".source62-stair1-given img"))await image.decode();});}
    async function check(mode,level){const selector=mode==="problem"?"#problemView .question-item":mode==="solution"?"#solutionView .solution-item":"#answerKeyView .answer-key-visuals>figure",items=await page.locator(selector).all();assert.equal(items.length,3);for(let v=0;v<3;v++){assert.deepEqual(await inspect(items[v],v,level,mode),[],`${mode} ${level}/${v}`);if(mode!=="answer-key")await visibleLayout(items[v],false);}}
    async function print(level,mode){await page.evaluate(mode=>{document.body.dataset.printMode=mode;dispatchEvent(new Event("beforeprint"));},mode);await page.emulateMedia({media:"print"});await decode();const file=`stair1-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));}
    for(const width of [1280,390,320])for(let level=0;level<3;level++){
      await page.setViewportSize({width,height:1000});await page.goto(new URL(`?type=${id}&review=1&difficulty=${level-1}`,base).href);await page.locator("#worksheet:not([hidden])").waitFor();await decode();
      if(candidate){const compared=await page.evaluate(id=>({before:JSON.parse(window.__stairBaseline),actual:window.HSE_SOURCE_INVENTORY_GRADE6.items.filter(i=>i.sourceItemId!==id)}),id);assert.equal(compared.actual.length,632);for(const item of compared.actual){const previous=compared.before.find(i=>i.sourceItemId===item.sourceItemId);if(!Object.hasOwn(previous,"verifiedVariantProvenance")&&Object.hasOwn(item,"verifiedVariantProvenance"))previous.verifiedVariantProvenance=previous.reviewLocked?[]:["source-values","source-structure-variant","source-structure-variant"];assert.deepEqual(item,previous);}}
      await check("problem",level);await page.locator("#problemView").screenshot({path:path.join(out,`l${level}-${width}-problem.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"problem");
      await page.locator(".source62-stair1-given button").first().click();await page.locator(".source62-m3-figure-dialog[open]:not([aria-busy=true])").waitFor();assert((await page.locator(".source62-m3-figure-dialog img").getAttribute("src")).endsWith("/prefix-given.png"));assert((await page.locator(".source62-m3-figure-dialog img").evaluate(i=>i.clientWidth))>=640);await page.keyboard.press("Escape");assert.equal(await page.locator(".source62-m3-figure-dialog[open]").count(),0);
      await page.locator("#solutionTab").click();await decode();await check("solution",level);await page.locator("#solutionView").screenshot({path:path.join(out,`l${level}-${width}-solution.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"solution");
      const layerButton=page.locator('.source62-stair1-answer [data-source-figure-family="stair-mission1-layer"]').first();await layerButton.click();await page.locator(".source62-m3-figure-dialog[open]:not([aria-busy=true])").waitFor();assert((await page.locator(".source62-m3-figure-dialog img").getAttribute("src")).startsWith("data:image/svg+xml"));assert((await page.locator(".source62-m3-figure-dialog img").evaluate(i=>i.clientWidth))>=640);await page.keyboard.press("Escape");
      assert(await layerButton.evaluate(el=>document.activeElement===el));
      await page.locator("#solutionViewerButton").click();
      for(let v=0;v<3;v++){
        await page.locator(`#solutionViewerJump [data-solution-index="${v}"]`).click();await decode();
        const viewer=page.locator("#solutionViewerContent");
        assert.deepEqual(await inspect(viewer.locator(".solution-viewer-prompt"),v,level,"problem"),[]);
        assert.deepEqual(await inspect(viewer,v,level,"solution"),[]);await visibleLayout(viewer,false);
      }
      await page.keyboard.press("Escape");assert(await page.locator("#solutionViewer").isHidden());
      if(width===1280){const root=page.locator("#solutionView .solution-item").first(),cell=root.locator("rect[data-x]").first(),old=await cell.getAttribute("data-x");await cell.evaluate(el=>el.dataset.x="999");assert((await inspect(root,0,level,"solution")).includes("Wrong answer cells"));await cell.evaluate((el,value)=>el.dataset.x=value,old);report.negative.push(`l${level}:moved-cell`);const equation=root.locator(".math-inline-expression").first(),oldText=await equation.textContent();await equation.evaluate(el=>{el.style.position="relative";el.style.left="1000px";});assert((await inspect(root,0,level,"solution")).includes("Equation outside one line"));await equation.evaluate(el=>{el.style.removeProperty("position");el.style.removeProperty("left");});assert.equal(await equation.textContent(),oldText);report.negative.push(`l${level}:equation-outside`);}
      await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);await decode();await check("answer-key",level);
      const answers=await page.locator("#answerKeyView .answer-key-grid>div>span").allTextContents();assert.deepEqual(answers.map(s=>s.replace(/[\s,]/g,"")),[0,1,2].map(v=>presentation.render(id,v,level).answer.replace(/[\s,]/g,"")));if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));report.states.push({width,level,variants:3,prefixZoom:true,answerLayerZoom:true});
    }
    for(const width of [1280,320]){
      await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();const type=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),id),row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);await row.locator("input").check();await row.locator(".tree-type-copy").click();await decode();assert.deepEqual(await inspect(page.locator("#typePreviewPopover"),0,1,"problem"),[]);await visibleLayout(page.locator("#typePreviewPopover"),false);await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await decode();await check("problem",1);report.picker.push({width,requested:120,generated:3});
    }
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(hashes(),report.runtimeHashes);report.status="passed";
  }catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{fs.writeFileSync(path.join(out,"bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
  console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,negative:report.negative.length,candidateOverlay:candidate}));
}
module.exports={inspect};
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
