"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const {inspect,candidateHtml}=require("./source-6-2-four-vertex-cut-bank-audit.js"),{inspect:prismInspect}=require("./source-6-2-plane-cut-bank-audit.js");
const base=new URL(process.env.HSE_BASE_URL),out=process.env.HSE_SCREENSHOT_DIR,id="6-2-u3-e4-example-2",prism="6-2-u3-e4-exploration";
const candidate=process.env.HSE_FOUR_VERTEX_CUT_CANDIDATE==="1";
assert(out&&/^E:[/\\]/i.test(out));assert(["localhost","127.0.0.1"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
const sha=b=>crypto.createHash("sha256").update(b).digest("hex"),files=["index.html","app.js","source-inventory-grade6.js","source-6-2-four-vertex-cut-questions.css","source-6-2-four-vertex-cut-questions.js","source-6-2-plane-cut-questions.css"];
const hashes=()=>Object.fromEntries(files.map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));
async function run(){
 const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE}),report={status:"running",candidateOverlay:candidate,runtimeHashes:hashes(),states:[],pdfs:[]};
 try{
  const page=await browser.newPage(),errors=[],network=[];page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)network.push(r.url());});
  await page.route("**/*",r=>new URL(r.request().url()).origin===base.origin?r.continue():r.abort());
  if(candidate)await page.route("**/source-inventory-grade6.js*",r=>r.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nObject.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{reviewLocked:false,reviewReason:'',generatorKey:'sourceGrade6SecondSpaceE4FourVertexCut',verifiedVariantCount:3,answerVisualStatus:'verified',sourceConditionsClarified:true});`}));
  if(candidate)await page.route(url=>url.origin===base.origin&&url.pathname===base.pathname,r=>r.fulfill({contentType:"text/html",body:candidateHtml()}));
  const loaded=()=>page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll("#worksheet img")].map(i=>i.decode()));});
  for(const width of[1280,390,320])for(let level=0;level<3;level++){
   await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
   const selected=await page.evaluate(ids=>{
    const types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(sub=>sub.types)));
    return ids.map(id=>{const t=types.find(t=>t.sourceItemId===id);if(!t||t.reviewLocked)throw new Error("Missing mixed fixture "+id);return t.id;});
   },[id,prism]);
   for(const type of selected)await page.locator(`.tree-type[data-preview-type-id="${type}"] input`).check();
   await page.locator(`#difficultyFilter [data-difficulty="${level-1}"]`).click();await page.locator("#questionCountInput").fill("6");await page.locator("#generateButton").click();await loaded();
   for(const mode of["problem","solution","answer-key"]){
    if(mode!=="answer-key")await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();
    else{await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);}
    await loaded();const selector=mode==="problem"?"#problemView .question-item":mode==="solution"?"#solutionView .solution-item":"#answerKeyView .answer-key-visuals>figure",items=await page.locator(selector).all();assert.equal(items.length,6);
    const fourVertexVariants=[],prismVariants=[];
    for(const item of items){
     if(await item.locator(".source62-four-vertex-given,.source62-four-vertex-answer").count()){
      const variant=await item.locator("[data-four-vertex-cut-context]").evaluate(el=>Number(el.dataset.variant));assert.deepEqual(await inspect(item,variant,level,mode),[]);fourVertexVariants.push(variant);
     }else{
      const file=await item.locator("[data-cut-solid] img").getAttribute("src"),variant=["3x2x2","4x3x3","5x4x4"].findIndex(dim=>file.includes(dim+"-"));assert(variant>=0);assert.deepEqual(await prismInspect(item,variant,level,mode),[]);prismVariants.push(variant);
     }
    }
    assert.deepEqual(fourVertexVariants.sort(),[0,1,2]);assert.deepEqual(prismVariants.sort(),[0,1,2]);
    if(level===1)await page.locator(mode==="problem"?"#problemView":mode==="solution"?"#solutionView":"#answerKeyView").screenshot({path:path.join(out,`${width}-${mode}.png`)});
    if(width===1280){
     if(mode!=="answer-key"){await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator(`button[data-print-mode="${mode}"]`).click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();}
     const file=`mixed-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});
    }
    await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
   }
   report.states.push({width,level,questions:6,fourVertexVariants:3,prismVariants:3});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(network,[]);assert.deepEqual(hashes(),report.runtimeHashes);report.status="passed";
 }catch(error){report.status="failed";report.error=error.stack;throw error;}finally{fs.writeFileSync(path.join(out,"mixed-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
 console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,candidateOverlay:candidate}));
}
run().catch(e=>{console.error(e);process.exitCode=1;});
