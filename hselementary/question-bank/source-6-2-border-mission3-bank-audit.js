"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const contracts=require("./source-6-2-border-mission3-contracts.js"),presentation=require("./source-6-2-border-mission3-presentation.js");
const id="6-2-u3-e2-mission-3",key="sourceGrade6SecondSpaceE2BorderDifference",out=process.env.HSE_SCREENSHOT_DIR,base=new URL(process.env.HSE_BASE_URL),candidate=process.env.HSE_BORDER_MISSION3_CANDIDATE==="1";
assert(out&&/^E:[/\\]/i.test(out));assert(["localhost","127.0.0.1"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
const files=["index.html","app.js","source-inventory-grade6.js","source-6-2-painted-mission3-presentation.js","source-6-2-stack-pattern-models.js","source-6-2-border-mission3-contracts.js","source-6-2-border-mission3-figures.js","source-6-2-border-mission3-presentation.js","source-6-2-border-mission3-questions.js","source-6-2-border-mission3-questions.css"];
const sha=b=>crypto.createHash("sha256").update(b).digest("hex"),hashes=()=>Object.fromEntries(files.map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));
function fixture(v,l){const q=contracts.generate(id,v,l);return {variant:v,level:l,stage:q.stage,answer:Array.isArray(q.answer)?q.answer:[q.answer],solutionEquations:q.solutionEquations,grids:l===2?[q.model.H,q.filledModel.H]:[q.model.H]};}
async function inspect(root,v,l,mode,print=false){
  const q=contracts.generate(id,v,l),render=presentation.render(id,v,l);
  return root.evaluate((root,{q,render,mode,print})=>{
    const errors=[],norm=s=>s.replace(/[\s,]/g,""),text=norm(root.textContent),isProblem=mode==="problem";
    if(isProblem){
      if(!text.includes(norm(q.learnerConditions))||!text.includes(norm(q.faceDefinition)))errors.push("Missing construction/face definition");
      if(!text.includes(norm(`${q.stage}번째`)))errors.push("Wrong stage");
      if(q.level===0&&!text.includes(norm(`쌓기나무는 ${q.countCue.cubeCount}개이고 안쪽 빈칸은 ${q.countCue.emptyInteriorCount}칸`)))errors.push("Wrong easy cue");
      if(q.level!==0&&text.includes("안쪽빈칸은"))errors.push("Easy cue leaks");
      if(root.querySelector(".source62-border-answer"))errors.push("Answer leaks");
    }else if(mode!=="answer-key"&&!text.includes(norm(render.answer)))errors.push("Wrong numeric answer");
    const svgs=[...root.querySelectorAll(isProblem?".source62-border-given svg":".source62-border-answer svg")];
    const expected=isProblem?q.sourcepolicy.sourceEvidence.sourceFirstThreeHeights:q.level===2?[q.model.H,q.filledModel.H]:[q.model.H];
    if(isProblem?svgs.length!==1:svgs.length!==expected.length)errors.push("Wrong figure count");
    const ctx=document.createElement("canvas").getContext("2d");
    let matrixIndex=0;
    for(const svg of svgs){
      const ctm=svg.getScreenCTM(),box=svg.getBoundingClientRect(),frame=svg.closest("figure").getBoundingClientRect(),scroller=svg.closest("figure");
      if(!print&&box.width>frame.width+1&&(!["auto","scroll"].includes(getComputedStyle(scroller).overflowX)||scroller.scrollWidth<=scroller.clientWidth))errors.push("Clipped grid cannot scroll");
      if(isProblem&&(box.left<frame.left-.5||box.right>frame.right+.5))errors.push("Given outside frame");
      for(const group of svg.querySelectorAll("g[data-stage]")){
        const H=expected[matrixIndex++],cells=[...group.children];if(!H||cells.length!==H.length*H.length){errors.push("Missing cells");continue;}
        const seen=new Set();
        for(const cell of cells){
          const x=Number(cell.dataset.x),z=Number(cell.dataset.z),value=Number(cell.dataset.value),rect=cell.querySelector("rect"),label=cell.querySelector("text"),style=getComputedStyle(label),b=rect.getBoundingClientRect();
          seen.add(`${x},${z}`);if(H[z]?.[x]!==value||label.textContent!==String(value))errors.push("Wrong height digit");
          if(Number(rect.getAttribute("width"))!==24||Number(rect.getAttribute("height"))!==24)errors.push("Wrong cell size");
          ctx.font=`${style.fontStyle} ${style.fontWeight} ${parseFloat(style.fontSize)*64}px ${style.fontFamily}`;
          const raw=ctx.measureText(label.textContent),m=Object.fromEntries(["width","actualBoundingBoxLeft","actualBoundingBoxRight","actualBoundingBoxAscent","actualBoundingBoxDescent"].map(k=>[k,raw[k]/64])),pen=Number(label.getAttribute("x"))-m.width/2,baseline=Number(label.getAttribute("y"));
          const ink={left:(pen-m.actualBoundingBoxLeft)*ctm.a+ctm.e,right:(pen+m.actualBoundingBoxRight)*ctm.a+ctm.e,top:(baseline-m.actualBoundingBoxAscent)*ctm.d+ctm.f,bottom:(baseline+m.actualBoundingBoxDescent)*ctm.d+ctm.f};
          if(!Object.values(ink).every(Number.isFinite)||ink.left<b.left+.5||ink.right>b.right-.5||ink.top<b.top+.5||ink.bottom>b.bottom-.5)errors.push("Digit outside own cell");
          if(Math.abs((ink.left+ink.right)/2-(b.left+b.right)/2)>.5||Math.abs((ink.top+ink.bottom)/2-(b.top+b.bottom)/2)>.5)errors.push("Digit off center");
          if(style.fill!=="rgb(0, 0, 0)"||style.fontWeight!=="400"||parseFloat(style.fontSize)*ctm.a<(print?12:12)-.01)errors.push("Digit typography");
        }
        if(seen.size!==H.length*H.length)errors.push("Duplicate cells");
      }
    }
    for(const equation of root.querySelectorAll(".math-inline-expression")){
      const b=equation.getBoundingClientRect(),r=root.getBoundingClientRect(),s=getComputedStyle(equation);
      if(equation.getClientRects().length!==1||s.whiteSpace!=="nowrap"||b.left<r.left-.5||b.right>r.right+.5)errors.push("Equation outside one line");
      if(s.color!=="rgb(0, 0, 0)"||s.fontWeight!=="400")errors.push("Equation typography");
    }
    if(document.documentElement.scrollWidth>innerWidth+1)errors.push("Viewport overflow");return [...new Set(errors)];
  },{q:JSON.parse(JSON.stringify(q)),render,mode,print});
}
async function main(){
  const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE}),report={status:"running",candidateOverlay:candidate,actualInventoryTested:!candidate,runtimeHashes:hashes(),states:[],pdfs:[],picker:[],negative:[],fixtures:[0,1,2].map(l=>({level:l,variants:[0,1,2].map(v=>fixture(v,l))}))};
  try{
    const page=await browser.newPage(),errors=[],network=[];page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)network.push(r.url());});
    await page.route("**/*",r=>new URL(r.request().url()).origin===base.origin?r.continue():r.abort());
    if(candidate)await page.route("**/source-inventory-grade6.js*",r=>r.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nwindow.__borderBaseline=JSON.stringify(window.HSE_SOURCE_INVENTORY_GRADE6.items.filter(i=>i.sourceItemId!=='${id}'));Object.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{typeLabel:'구멍이 있는 한 층 도형의 면의 넓이와 쌓기나무 수 비교하기',reviewLocked:false,generatorKey:'${key}',variant:0,verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualStatus:'verified',generationMode:'fixed-verified-pool',sourceConditionsClarified:true,originalAnswerDeterminate:false,originalSourceReleaseStatus:'locked'});`}));
    async function align(){await page.evaluate(async()=>{await document.fonts.ready;window.HSE_SOURCE_GRADE6_BORDER_MISSION3_FIGURES.align(document);await new Promise(r=>requestAnimationFrame(r));});}
    async function check(mode,l){const selector=mode==="problem"?"#problemView .question-item":mode==="solution"?"#solutionView .solution-item":"#answerKeyView .answer-key-visuals>figure",items=await page.locator(selector).all();assert.equal(items.length,3);for(let v=0;v<3;v++)assert.deepEqual(await inspect(items[v],v,l,mode),[],`${mode}/${l}/${v}`);}
    async function print(l,mode){await page.evaluate(mode=>{document.body.dataset.printMode=mode;dispatchEvent(new Event("beforeprint"));},mode);await page.emulateMedia({media:"print"});await align();const file=`border-l${l}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level:l,mode});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));}
    for(const width of [1280,390,320])for(const l of [0,1,2]){
      await page.setViewportSize({width,height:1000});await page.goto(new URL(`?type=${id}&review=1&difficulty=${l-1}`,base).href);await page.locator("#worksheet:not([hidden])").waitFor();await align();
      await check("problem",l);await page.locator("#problemView").screenshot({path:path.join(out,`l${l}-${width}-problem.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(l,"problem");
      await page.locator('.source62-border-given [data-source-grid-role="prefix"]').first().click();await page.locator('.source62-m3-figure-dialog[open]:not([aria-busy=true])').waitFor();assert((await page.locator('.source62-m3-figure-dialog img').getAttribute("src")).startsWith("data:image/svg+xml"));await page.keyboard.press("Escape");
      await page.locator("#solutionTab").click();await align();await check("solution",l);await page.locator("#solutionView").screenshot({path:path.join(out,`l${l}-${width}-solution.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(l,"solution");
      const button=page.locator('.source62-border-answer [data-source-grid-role="answer-original"]').first();await button.click();await page.locator('.source62-m3-figure-dialog[open]:not([aria-busy=true])').waitFor();assert((await page.locator('.source62-m3-figure-dialog img').evaluate(i=>i.clientWidth))>=640);await page.keyboard.press("Escape");assert(await button.evaluate(el=>el===document.activeElement));
      if(width===1280){const root=page.locator("#solutionView .solution-item").first(),label=root.locator('g[data-value="0"] text').first(),value=await label.textContent();await label.evaluate(el=>el.textContent="1");assert((await inspect(root,0,l,"solution")).includes("Wrong height digit"));await label.evaluate((el,s)=>el.textContent=s,value);report.negative.push(`l${l}:wrong-digit`);const x=await label.getAttribute("x");await label.evaluate(el=>el.setAttribute("x",Number(el.getAttribute("x"))+24));assert((await inspect(root,0,l,"solution")).includes("Digit outside own cell"));await label.evaluate((el,x)=>el.setAttribute("x",x),x);report.negative.push(`l${l}:moved-digit`);}
      await page.locator("#solutionViewerButton").click();for(let v=0;v<3;v++){await page.locator(`#solutionViewerJump [data-solution-index="${v}"]`).click();await align();const viewer=page.locator("#solutionViewerContent");assert.deepEqual(await inspect(viewer.locator(".solution-viewer-prompt"),v,l,"problem"),[]);assert.deepEqual(await inspect(viewer,v,l,"solution"),[]);}await page.keyboard.press("Escape");
      await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);await align();await check("answer-key",l);if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(l,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));report.states.push({width,level:l,variants:3,viewerVariants:3,prefixZoom:true,answerZoom:true});
    }
    for(const width of [1280,320]){
      await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();const t=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),id),row=page.locator(`.tree-type[data-preview-type-id="${t.id}"]`);await row.locator("input").check();await row.locator(".tree-type-copy").click();await align();assert.deepEqual(await inspect(page.locator("#typePreviewPopover"),0,1,"problem"),[]);await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await align();await check("problem",1);report.picker.push({width,requested:120,generated:3});
    }
    assert.deepEqual(errors,[]);assert.deepEqual(network,[]);assert.deepEqual(hashes(),report.runtimeHashes);report.status="passed";
  }catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{fs.writeFileSync(path.join(out,"bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
  console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,negative:report.negative.length,candidateOverlay:candidate}));
}
module.exports={inspect};if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
