"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const contracts=require("./source-6-2-notched-mission5-contracts.js"),presentation=require("./source-6-2-notched-mission5-presentation.js");
const id="6-2-u3-e2-mission-5",key="sourceGrade6SecondSpaceE2NotchedVisibility",out=process.env.HSE_SCREENSHOT_DIR,base=new URL(process.env.HSE_BASE_URL),candidate=process.env.HSE_NOTCHED_MISSION5_CANDIDATE==="1";
assert(out&&/^E:[/\\]/i.test(out));assert(["localhost","127.0.0.1"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
const sha=b=>crypto.createHash("sha256").update(b).digest("hex"),files=["index.html","app.js","source-inventory-grade6.js","source-6-2-painted-mission3-presentation.js","source-6-2-notched-mission5-contracts.js","source-6-2-notched-mission5-presentation.js","source-6-2-notched-mission5-questions.js","source-6-2-notched-mission5-questions.css"],hashes=()=>Object.fromEntries(files.map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));
async function inspect(root,variant,level,mode){
  const q=contracts.generate(id,variant,level),render=presentation.render(id,variant,level);
  return root.evaluate((root,{q,render,mode})=>{
    const errors=[],norm=s=>s.replace(/\s/g,""),text=norm(root.textContent),problem=mode==="problem";
    if(problem){for(const condition of q.learnerConditions)if(!text.includes(norm(condition)))errors.push("Missing condition");if(root.querySelector(".source62-notched-answer,table,svg[data-layer],.math-inline-expression")||/층에는\d+개/.test(text))errors.push("Answer leaks");}
    else if(mode!=="answer-key"&&!text.includes(norm(render.answer)))errors.push("Wrong answer");
    const area=problem?root.querySelector(".source62-notched-given"):root.querySelector(".source62-notched-answer");
    if(!area)return ["Missing owned presentation"];
    const images=[...area.querySelectorAll("img")],phases=problem?["given"]:q.level===2?["full","filled"]:["full"];
    if(images.length!==phases.length)errors.push("Wrong picture count");
    images.forEach((image,index)=>{const r=image.getBoundingClientRect(),phase=phases[index];if(!image.complete||image.naturalWidth!==1600||image.naturalHeight!==(phase==="given"?1575:1445)||!image.getAttribute("src").endsWith(`v${q.variant}-${phase}.png`))errors.push("Wrong/unloaded picture");if(72*r.width/1600<12-.1)errors.push(`Layer label too small: ${r.width}px image, ${72*r.width/1600}px label`);});
    if(!problem){
      const svgs=[...area.querySelectorAll("svg[data-layer]")];if(svgs.length!==q.model.n*(q.level===2?2:1))errors.push("Wrong layer count");
      const seen=new Set();for(const svg of svgs){
        const layer=Number(svg.dataset.layer),phase=svg.dataset.phase,k=`${phase}:${layer}`,row=(phase==="filled"?q.filledModel:q.model)?.layers[layer-1];
        if(!row||seen.has(k)){errors.push("Wrong/duplicate layer");continue;}seen.add(k);
        const rects=[...svg.querySelectorAll("rect")],hidden=new Set(row.hiddenCells.map(c=>c.join(",")));
        if(rects.length!==row.cells.length)errors.push("Wrong cell count");
        for(let i=0;i<rects.length;i++){
          const r=rects[i],x=Number(r.dataset.x),z=Number(r.dataset.z),cell=row.cells[i];
          if(!cell||x!==cell[0]||z!==cell[1]||Number(r.getAttribute("x"))!==6+20*x||Number(r.getAttribute("y"))!==6+20*z||r.getAttribute("width")!=="20"||r.getAttribute("height")!=="20")errors.push("Wrong cell position");
          const hiddenExpected=hidden.has([x,z].join(","));if((r.dataset.hidden==="true")!==hiddenExpected||r.getAttribute("fill")!==(hiddenExpected?"#555":"#fff"))errors.push("Wrong hidden shading");
        }
      }
      for(const eq of root.querySelectorAll(".math-inline-expression")){const r=eq.getBoundingClientRect(),b=root.getBoundingClientRect(),s=getComputedStyle(eq);if(eq.getClientRects().length!==1||s.whiteSpace!=="nowrap"||r.left<b.left-.5||r.right>b.right+.5)errors.push("Equation wraps/outside");if(s.color!=="rgb(0, 0, 0)"||s.fontWeight!=="400")errors.push("Math typography");}
    }
    if(document.documentElement.scrollWidth>innerWidth+1)errors.push("Viewport overflow");return [...new Set(errors)];
  },{q:JSON.parse(JSON.stringify(q)),render,mode});
}
async function main(){
  const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE}),report={status:"running",candidateOverlay:candidate,actualInventoryTested:!candidate,runtimeHashes:hashes(),states:[],pdfs:[],picker:[],negative:[],fixtures:[0,1,2].map(level=>({level,variants:[0,1,2].map(variant=>{const q=contracts.generate(id,variant,level);return {variant,level,answer:q.answer,solutionEquations:q.solutionEquations.map(s=>s.replace(/<[^>]+>/g,"")),model:q.model,filledModel:q.filledModel};})}))};
  try{
    const page=await browser.newPage(),errors=[],network=[];page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)network.push(r.url());});
    await page.route("**/*",r=>new URL(r.request().url()).origin===base.origin?r.continue():r.abort());
    if(candidate)await page.route("**/source-inventory-grade6.js*",r=>r.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nObject.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{typeLabel:'앞쪽 모서리가 빈 쌓기나무의 보이는 개수와 보이지 않는 개수 비교하기',reviewLocked:false,reviewReason:'',generatorKey:'${key}',variant:0,verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualStatus:'verified',generationMode:'fixed-verified-pool',sourceConditionsClarified:true,originalSourceReleaseStatus:'locked'});`}));
    async function loaded(){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll(".source62-notched-image img")].map(i=>i.decode()));});}
    async function check(mode,level){const selector=mode==="problem"?"#problemView .question-item":mode==="solution"?"#solutionView .solution-item":"#answerKeyView .answer-key-visuals>figure",items=await page.locator(selector).all();assert.equal(items.length,3);for(let v=0;v<3;v++)assert.deepEqual(await inspect(items[v],v,level,mode),[],`${mode}/${level}/${v}`);}
    async function print(level,mode){await page.evaluate(mode=>{document.body.dataset.printMode=mode;dispatchEvent(new Event("beforeprint"));},mode);await page.emulateMedia({media:"print"});await loaded();const file=`notched-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));}
    for(const width of [1280,390,320])for(const level of [0,1,2]){
      await page.setViewportSize({width,height:1000});await page.goto(new URL(`?type=${id}&review=1&difficulty=${level-1}`,base).href);await page.locator("#worksheet:not([hidden])").waitFor();await loaded();
      await check("problem",level);await page.locator("#problemView").screenshot({path:path.join(out,`l${level}-${width}-problem.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"problem");
      await page.locator('.source62-notched-given [data-source-figure-family="notched-mission5"]').first().click();await page.locator('.source62-m3-figure-dialog[open]:not([aria-busy=true])').waitFor();assert((await page.locator('.source62-m3-figure-dialog img').getAttribute("src")).includes("v0-given.png"));await page.keyboard.press("Escape");
      await page.locator("#solutionTab").click();await loaded();await check("solution",level);await page.locator("#solutionView").screenshot({path:path.join(out,`l${level}-${width}-solution.png`)});if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"solution");
      const button=page.locator('.source62-notched-answer [data-source-figure-family="notched-mission5-layer"]').first();await button.click();await page.locator('.source62-m3-figure-dialog[open]:not([aria-busy=true])').waitFor();assert((await page.locator('.source62-m3-figure-dialog img').getAttribute("src")).startsWith("data:image/svg+xml"));await page.keyboard.press("Escape");assert(await button.evaluate(el=>el===document.activeElement));
      if(width===1280){const root=page.locator("#solutionView .solution-item").first(),rect=root.locator('svg rect[data-hidden="true"]').first(),fill=await rect.getAttribute("fill");await rect.evaluate(r=>r.setAttribute("fill","#fff"));assert((await inspect(root,0,level,"solution")).includes("Wrong hidden shading"));await rect.evaluate((r,v)=>r.setAttribute("fill",v),fill);report.negative.push(`l${level}:wrong-shading`);const x=await rect.getAttribute("x");await rect.evaluate(r=>r.setAttribute("x",Number(r.getAttribute("x"))+20));assert((await inspect(root,0,level,"solution")).includes("Wrong cell position"));await rect.evaluate((r,v)=>r.setAttribute("x",v),x);report.negative.push(`l${level}:moved-cell`);}
      await page.locator("#solutionViewerButton").click();for(let v=0;v<3;v++){await page.locator(`#solutionViewerJump [data-solution-index="${v}"]`).click();await loaded();const viewer=page.locator("#solutionViewerContent");assert.deepEqual(await inspect(viewer.locator(".solution-viewer-prompt"),v,level,"problem"),[]);assert.deepEqual(await inspect(viewer,v,level,"solution"),[]);}await page.keyboard.press("Escape");
      await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();await check("answer-key",level);if(width===1280&&process.env.HSE_CREATE_PDF==="1")await print(level,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));report.states.push({width,level,variants:3,viewerVariants:3,pictureZoom:true,answerLayerZoom:true});
    }
    for(const width of [1280,320]){
      await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();const t=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),id),row=page.locator(`.tree-type[data-preview-type-id="${t.id}"]`);await row.locator("input").check();await row.locator(".tree-type-copy").click();await loaded();assert.deepEqual(await inspect(page.locator("#typePreviewPopover"),0,1,"problem"),[]);await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await loaded();await check("problem",1);report.picker.push({width,requested:120,generated:3});
    }
    assert.deepEqual(errors,[]);assert.deepEqual(network,[]);assert.deepEqual(hashes(),report.runtimeHashes);report.status="passed";
  }catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{fs.writeFileSync(path.join(out,"bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
  console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,negative:report.negative.length,candidateOverlay:candidate}));
}
module.exports={inspect};if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
