"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {inspect}=require("./source-6-2-stair-mission1-bank-audit.js"),{visibleLayout}=require("./source-6-2-stack-operation-learner-audit.js"),contracts=require("./source-6-2-stair-mission1-contracts.js");
const id="6-2-u3-e2-mission-1",key="sourceGrade6SecondSpaceE2StairCount",sources=[id,"6-2-u3-e2-example-2","6-2-u3-e1-mission-5"],base=new URL(process.env.HSE_BASE_URL),out=process.env.HSE_SCREENSHOT_DIR,candidate=process.env.HSE_STAIR_MISSION1_CANDIDATE==="1";
assert(out&&/^E:[/\\]/i.test(out));assert(["127.0.0.1","localhost"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
async function main(){
  const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE}),report={status:"running",candidateOverlay:candidate,sources,states:[],pdfs:[],fixtures:[0,1,2].map(level=>({level,variants:[0,1,2].map(variant=>{const q=contracts.generate(id,variant,level);return {variant,answer:q.answer,solutionEquations:q.solutionEquations,cells:q.model.layers.flatMap(l=>l.cells)};})}))};
  try{
    const page=await browser.newPage(),errors=[],failed=[];page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)failed.push(r.url());});
    await page.route("**/*",r=>new URL(r.request().url()).origin===base.origin?r.continue():r.abort());
    if(candidate)await page.route("**/source-inventory-grade6.js*",r=>r.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nObject.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{typeLabel:'두 방향 계단 모양의 쌓기나무 수 구하기',reviewLocked:false,generatorKey:'${key}',variant:0,verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualStatus:'verified',generationMode:'fixed-verified-pool',sourceConditionsClarified:true,originalAnswerDeterminate:false,originalSourceReleaseStatus:'locked'});`}));
    for(const width of [1280,390,320])for(const level of [0,1,2]){
      await page.setViewportSize({width,height:1000});await page.goto(new URL(`?difficulty=${level-1}`,base).href);
      await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
      const ids=await page.evaluate(sources=>sources.map(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id).id),sources);
      for(const typeId of ids)await page.locator(`input[data-type-id="${typeId}"]`).check();
      await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await page.locator("#worksheet:not([hidden])").waitFor();
      for(const mode of ["problem","solution"]){
        if(mode==="solution")await page.locator("#solutionTab").click();
        await page.evaluate(async()=>{await document.fonts.ready;for(const image of document.querySelectorAll("#problemView img,#solutionView img"))await image.decode();});
        const view=page.locator(mode==="problem"?"#problemView":"#solutionView"),items=view.locator(mode==="problem"?".question-item":".solution-item");assert.equal(await items.count(),9);
        const stairs=items.filter({has:page.locator(mode==="problem"?".source62-stair1-given":".source62-stair1-answer")});assert.equal(await stairs.count(),3);
        for(let v=0;v<3;v++)assert.deepEqual(await inspect(stairs.nth(v),v,level,mode),[]);
        for(const item of await items.all())await visibleLayout(item,false);
        assert.equal(await view.locator(mode==="problem"?".source62-t-pattern-given":".source62-t-pattern-answer").count(),3);
        const operations=view.locator('img[src*="source-6-2-operations-v3/"]');assert.equal(await operations.count(),3);assert(await operations.evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth===1280&&i.naturalHeight===1040)));
        if(mode==="problem")assert.equal(await view.locator(".source62-stair1-answer,.source62-t-pattern-answer,.source62-operation-answer").count(),0);
        if(width===1280&&process.env.HSE_CREATE_PDF==="1"){
          await page.evaluate(mode=>{document.body.dataset.printMode=mode;dispatchEvent(new Event("beforeprint"));},mode);await page.emulateMedia({media:"print"});
          if(mode==="solution"){
            const columns=await view.locator(".solution-list").evaluateAll(nodes=>nodes.map(el=>({className:el.className,display:getComputedStyle(el).display,tracks:getComputedStyle(el).gridTemplateColumns,items:[...el.querySelectorAll(".solution-item")].map(i=>i.querySelector("[data-source]")?.dataset.source||i.querySelector("[data-answer-source]")?.dataset.answerSource)})));
            assert(columns.every(el=>el.className.includes("solution-list--two-column")?el.display==="grid"&&el.tracks.split(" ").length===2:el.items.every(id=>id==="6-2-u3-e1-mission-5")),JSON.stringify(columns));
          }
          const file=`mixed-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
        }
        if(level===1)await view.screenshot({path:path.join(out,`mixed-${width}-${mode}.png`)});
        report.states.push({width,level,mode,generated:9,stairVariants:3,existingTVariants:3,existingOperationVariants:3});
      }
    }
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);report.status="passed";
  }catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{fs.writeFileSync(path.join(out,"mixed-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
  console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,candidateOverlay:candidate}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
