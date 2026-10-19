"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const {inspect}=require("./source-6-2-plane-cut-bank-audit.js"),base=new URL(process.env.HSE_BASE_URL),out=process.env.HSE_SCREENSHOT_DIR,candidate=process.env.HSE_PLANE_CUT_CANDIDATE==="1";
assert(out&&/^E:[/\\]/i.test(out));assert(["localhost","127.0.0.1"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
const id="6-2-u3-e4-exploration",sha=b=>crypto.createHash("sha256").update(b).digest("hex"),files=["index.html","app.js","source-inventory-grade6.js","source-6-2-plane-cut-questions.css","source-6-2-plane-cut-questions.js"];
const hashes=()=>Object.fromEntries(files.map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));
async function run(){
 const{chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE}),report={status:"running",candidateOverlay:candidate,runtimeHashes:hashes(),states:[],pdfs:[]};
 try{
  const page=await browser.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));await page.route("**/*",r=>new URL(r.request().url()).origin===base.origin?r.continue():r.abort());
  if(candidate)await page.route("**/source-inventory-grade6.js*",r=>r.fulfill({contentType:"application/javascript",body:fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8")+`\nObject.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==='${id}'),{reviewLocked:false,generatorKey:'sourceGrade6SecondSpaceE4PrismCut',verifiedVariantCount:3,answerVisualStatus:'verified'});`}));
  const loaded=()=>page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll("#worksheet img")].map(i=>i.decode()));});
  for(const width of [1280,390,320])for(let level=0;level<3;level++){
   await page.setViewportSize({width,height:1000});await page.goto(base.href);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
   const selected=await page.evaluate(({id,level})=>{
    const types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(sub=>sub.types.map(t=>({...t,semesterId:s.id,grade:s.grade,term:s.term,unitId:u.id,unitNumber:u.number,unitName:u.name,subunitId:sub.id,subunitNumber:sub.number,subunitName:sub.name}))))),all=types.filter(t=>t.grade===6&&t.term===2&&!t.reviewLocked),plane=all.find(t=>t.sourceItemId===id),notched=all.find(t=>t.sourceItemId==="6-2-u3-e2-mission-5");
    const text=all.find(t=>{if(t.sourceItemId===id||t.sourceItemId===notched.sourceItemId)return false;const q=window.HSE_GENERATORS.generate(t,1,level-1,17,0);return q&&!/<(?:svg|img|canvas)\b/.test(q.prompt)&&!/<img\b/.test(q.answerVisual||"");});
    if(!plane||!notched||!text)throw new Error(`Mixed fixture not available: plane=${Boolean(plane)}, notched=${Boolean(notched)}, text=${Boolean(text)}, ready=${all.length}`);return [plane,notched,text].map(t=>({id:t.id,sourceItemId:t.sourceItemId}));
   },{id,level});
   for(const t of selected)await page.locator(`.tree-type[data-preview-type-id="${t.id}"] input`).check();
   await page.locator('#difficultyFilter [data-difficulty="'+(level-1)+'"]').click();await page.locator("#questionCountInput").fill("9");await page.locator("#generateButton").click();await loaded();
   for(const mode of ["problem","solution"]){
    await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();await loaded();
    const root=page.locator(mode==="problem"?"#problemView":"#solutionView"),items=await root.locator(mode==="problem"?".question-item:has(.source62-cut-given)":".solution-item:has(.source62-cut-answer)").all();assert.equal(items.length,3);
    for(let v=0;v<3;v++)assert.deepEqual(await inspect(items[v],v,level,mode),[]);
    assert.equal(await root.locator(mode==="problem"?".question-item":".solution-item").count(),9);
    if(level===1)await root.screenshot({path:path.join(out,`${width}-${mode}.png`)});
    if(width===1280){
     await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator(`button[data-print-mode="${mode}"]`).click();await page.waitForFunction(()=>window.__printCalls===1);await loaded();
     const file=`mixed-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,level,mode});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
    }
   }
   report.states.push({width,level,questions:9,planeVariants:3,fixture:selected});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(hashes(),report.runtimeHashes);report.status="passed";
 }catch(error){report.status="failed";report.error=error.stack;throw error;}finally{fs.writeFileSync(path.join(out,"mixed-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
 console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,candidateOverlay:candidate}));
}
run().catch(e=>{console.error(e);process.exitCode=1;});
