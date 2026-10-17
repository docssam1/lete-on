"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {visibleLayout}=require("./source-6-2-stack-operation-learner-audit.js");
const ids=["6-2-u3-e3-example-1","6-2-u3-e3-mission-2","6-2-u3-e3-mission-4","6-2-u3-e1-mission-6","6-2-u3-e2-mission-2","6-2-u3-e2-example-4"];
if(process.env.HSE_PAINT_MISSION3==="1")ids.splice(0,3,"6-2-u3-e3-mission-3","6-2-u3-e3-mission-1","6-2-u3-e3-example-1");
if(process.env.HSE_PAINT_EXPLORATION==="1")ids[0]="6-2-u3-e3-exploration";
const tPattern=process.env.HSE_T_PATTERN_MIXED==="1";
if(tPattern)ids[0]="6-2-u3-e2-example-2";
const out=process.env.HSE_SCREENSHOT_DIR,base=new URL(process.env.HSE_BASE_URL);assert(out && /^E:[/\\]/i.test(out));assert(["localhost","127.0.0.1"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
async function main(){
  const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE});
  const report={status:"running",states:[],pdfs:[],scope:"Three new painted-stack types mixed with three existing source-specific stack types; not a full-bank visual audit"};
  if(process.env.HSE_PAINT_MISSION3==="1")report.scope="Mission 3 mixed with five previously verified source-specific stack types; not a full-bank visual audit";
  if(process.env.HSE_PAINT_EXPLORATION==="1")report.scope="Conditional 3D exploration mixed with five existing source-specific stack types; not a full-bank visual audit";
  if(tPattern)report.scope="Conditional T-pattern type mixed with five existing source-specific stack types; not a full-bank visual audit";
  try{
    const page=await browser.newPage(),errors=[],failed=[];page.on("pageerror",e=>errors.push(e.message));page.on("requestfailed",r=>{if(new URL(r.url()).origin===base.origin)failed.push(r.url());});
    await page.route("**/*",r=>new URL(r.request().url()).origin===base.origin ? r.continue() : r.abort());
    for(const width of [1280,320]){
      await page.setViewportSize({width,height:900});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
      const types=await page.evaluate(ids=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).filter(t=>ids.includes(t.sourceItemId)),ids);assert.equal(types.length,6);
      for(const type of types)await page.locator(`.tree-type[data-preview-type-id="${type.id}"] input`).check();
      await page.locator("#questionCountInput").fill("40");await page.locator("#generateButton").click();await page.evaluate(async()=>{await document.fonts.ready;window.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION.align(document);for(const image of document.images)if(image.src)await image.decode();});
      assert.equal(await page.locator("#problemView .question-item").count(),18);assert.equal(await page.locator("#problemView .source62-painted-given").count(),tPattern?6:9);
      if(tPattern)assert.equal(await page.locator("#problemView .source62-t-pattern-given").count(),3);
      assert.equal(await page.locator("#problemView .source62-count-given").count(),3);assert.equal(await page.locator("#problemView .source62-color-given").count(),3);
      for(const item of await page.locator("#problemView .question-item").all())await visibleLayout(item,false);
      await page.locator("#solutionTab").click();await page.evaluate(()=>window.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION.align(document));assert.equal(await page.locator("#solutionView .solution-item").count(),18);
      for(const item of await page.locator("#solutionView .solution-item").all())await visibleLayout(item,false);
      assert.equal(await page.locator("#solutionView .source62-painted-answer").count(),tPattern?6:9);
      if(tPattern)assert.equal(await page.locator("#solutionView .source62-t-pattern-answer").count(),3);
      await page.locator("#solutionView").screenshot({path:path.join(out,`mixed-${width}-solution.png`),animations:"disabled"});
      if(width===1280)for(const mode of ["problem","solution"]){await page.evaluate(mode=>{document.body.dataset.printMode=mode;dispatchEvent(new Event("beforeprint"));},mode);await page.emulateMedia({media:"print"});
        const file=`mixed-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({mode,file});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));}
      report.states.push({width,selectedSourceTypes:6,requested:40,distinctGenerated:18,newQuestions:9,existingQuestions:9});
    }
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);report.status="passed";
  }catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{fs.writeFileSync(path.join(out,"painted-mixed-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
  console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,requested:40,distinctGenerated:18}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
