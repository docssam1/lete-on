"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), crypto = require("node:crypto");
const cases = [
  {name:"t-pattern", stem:"t-pattern-example2", id:"6-2-u3-e2-example-2", key:"sourceGrade6SecondSpaceE2TPatternCount", global:"HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION", image:()=>"./assets/source-6-2-t-pattern-example2/prefix-given.png"},
  {name:"stair", stem:"stair-mission1", id:"6-2-u3-e2-mission-1", key:"sourceGrade6SecondSpaceE2StairCount", global:"HSE_SOURCE_GRADE6_STAIR_MISSION1_PRESENTATION", image:()=>"./assets/source-6-2-stair-mission1/prefix-given.png"},
  {name:"notched", stem:"notched-mission5", id:"6-2-u3-e2-mission-5", key:"sourceGrade6SecondSpaceE2NotchedVisibility", global:"HSE_SOURCE_GRADE6_NOTCHED_MISSION5_PRESENTATION", image:v=>`./assets/source-6-2-notched-mission5/v${v}-given.png`}
];
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const report = {status:"running", accepted:0, rejected:0, sourceArtworkUnchanged:true, states:[], previews:[], pdfs:[], catalogStudentChecks:[], actualHttpTested:false, catalogChanged:false};
function generator(test, presentation) {
  const api = {names:[], generatorKey:()=>"legacy", generate:()=>"legacy"};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,`source-6-2-${test.stem}-questions.js`),"utf8"), {window:{HSE_GENERATORS:api,[test.global]:presentation}});
  return (v,l) => api.generate({sourceItemId:test.id,generatorKey:test.key,reviewLocked:false},1,l-1,123,v);
}
function unit() {
  for (const test of cases) {
    const presentation = require(`./source-6-2-${test.stem}-presentation.js`), generate = generator(test,presentation);
    for (let variant=0;variant<3;variant++) for (let level=0;level<3;level++) {
      const original = presentation.render(test.id,variant,level), q = generate(variant,level);
      assert(q); assert.equal(q.prompt,original.prompt); assert.equal(q.answer,original.answer); assert.equal(q.solution,original.solution);
      assert(q.answerVisual.includes(original.answerVisual)); assert.equal(q.originalSourceReleaseStatus,"locked");
      const image = path.join(__dirname,test.image(variant)), before=sha(fs.readFileSync(image));
      const imageTag=original.prompt.match(/<img\b[^>]*>/)[0];
      const poisons = [
        q=>({...q,prompt:q.prompt+'<table><tr><td>3층 21개</td></tr></table>'}),
        q=>({...q,prompt:q.prompt+'<svg data-layer="1"></svg>'}),
        q=>({...q,prompt:q.prompt+'<span class="math-inline-expression">21+11+4=36</span>'}),
        q=>({...q,prompt:q.prompt+q.answerVisual}),
        q=>({...q,prompt:q.prompt+q.solution}),
        q=>({...q,prompt:q.prompt+imageTag}),
        q=>({...q,prompt:q.prompt.replace(test.image(variant),'./assets/completed-layers.png')}),
        q=>({...q,prompt:q.prompt.replace(imageTag,"")}),
        q=>({...q,layerCue:{rows:[{layer:1,count:21}]}}),
        q=>({...q,prompt:null})
      ];
      for (const poison of poisons) {
        const bad = generator(test,{render:(...args)=>poison(presentation.render(...args))});
        assert.equal(bad(variant,level),null,`${test.name}/${variant}/${level}: unsafe student content accepted`); report.rejected++;
      }
      assert.equal(sha(fs.readFileSync(image)),before); report.accepted++;
    }
  }
}
async function browser(out) {
  const {chromium}=require("playwright"), browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE});
  const base=new URL("http://127.0.0.1:8909/hselementary/question-bank/"), root=path.resolve(__dirname,"../.."), errors=[];
  report.transport="read-only-static-file-browser-fixture";
  const loadedScripts=[...fs.readFileSync(path.join(__dirname,"index.html"),"utf8").matchAll(/<script\b[^>]*src="([^"?]+)[^"]*"/g)]
    .map(match=>match[1].replace(/^\.\//,"")).filter(file=>file.endsWith(".js")&&fs.existsSync(path.join(__dirname,file)));
  const runtimeFiles=[...new Set(["index.html","app.js","source-inventory-grade6.js",...loadedScripts,...cases.flatMap(test=>["questions.js","presentation.js","contracts.js"].map(s=>`source-6-2-${test.stem}-${s}`))])];
  const hashes=()=>Object.fromEntries(runtimeFiles.map(file=>[file,sha(fs.readFileSync(path.join(__dirname,file)))]));
  report.runtimeHashes=hashes();
  try {
    const page=await browser.newPage();page.on("pageerror",e=>errors.push(e.message));
    await page.route("**/*",route=>{
      const url=new URL(route.request().url());if(url.origin!==base.origin)return route.abort();
      const file=path.resolve(root,"."+decodeURIComponent(url.pathname)+(url.pathname.endsWith("/")?"index.html":"")), relative=path.relative(root,file);
      if(relative.startsWith("..")||path.isAbsolute(relative)||!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:"Not found"});
      const contentType={".js":"application/javascript",".mjs":"application/javascript",".html":"text/html; charset=utf-8",".css":"text/css",".png":"image/png",".woff2":"font/woff2"}[path.extname(file)]||"application/octet-stream";
      return route.fulfill({contentType,body:fs.readFileSync(file)});
    });
    async function check(area,test,variants) {
      assert.equal(await area.count(),variants.length);
      for (let i=0;i<variants.length;i++) {
        const element=area.nth(i);assert.equal(await element.locator('table,svg,.math-inline-expression,[data-source-answer-layer]').count(),0);
        const images=element.locator("img");assert.equal(await images.count(),1);assert.equal(await images.getAttribute("src"),test.image(variants[i]));
        assert(await images.evaluate(img=>img.complete&&img.naturalWidth===1600));
      }
    }
    for (const test of cases) for (const width of [1280,390,320]) for (const level of [0,1,2]) {
      if(process.argv.includes("--preview-only"))continue;
      await page.setViewportSize({width,height:1000});await page.goto(new URL(`?type=${test.id}&review=1&difficulty=${level-1}`,base).href);
      await page.locator("#worksheet:not([hidden])").waitFor();
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('#problemView img')].map(img=>img.decode()));});
      await check(page.locator("#problemView .question-prompt"),test,[0,1,2]);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
      if(level===1&&width!==320)await page.locator("#problemView").screenshot({path:path.join(out,`${test.name}-${width}-problem.png`)});
      if(width===1280&&level===1) {
        await page.evaluate(()=>{document.body.dataset.printMode="problem";dispatchEvent(new Event("beforeprint"));});
        await page.emulateMedia({media:"print"});await check(page.locator("#problemView .question-prompt"),test,[0,1,2]);
        const file=`${test.name}-problem.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push(file);
        await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
      }
      await page.locator("#solutionTab").click();assert(await page.locator('#solutionView svg').count()>0,"Teacher layer drawings must remain available");
      await page.locator("#solutionViewerButton").click();
      for(let variant=0;variant<3;variant++) {
        await page.locator(`#solutionViewerJump [data-solution-index="${variant}"]`).click();
        await page.locator("#solutionViewerContent .solution-viewer-prompt img").evaluate(img=>img.decode());
        await check(page.locator("#solutionViewerContent .solution-viewer-prompt"),test,[variant]);
      }
      await page.keyboard.press("Escape");report.states.push({type:test.id,width,level,variants:3,teacherDrawingsRetained:true});
    }
    for(const test of cases)for(const width of [1280,320]) {
      await page.setViewportSize({width,height:1000});await page.goto(base.href);
      await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
      const type=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),test.id);
      assert(type&&!type.reviewLocked);const row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);
      await row.locator(".tree-type-copy").click();const preview=page.locator("#typePreviewPopover");await preview.waitFor({state:"visible"});
      await preview.locator("img").evaluate(img=>img.decode());await check(preview,test,[0]);
      await page.locator("[data-close-type-preview]").click();report.previews.push({type:test.id,width,noAnswerHints:true});
    }
    report.catalogStudentChecks=await page.evaluate(()=>{
      const responseTableIds=new Set(["6-2-u3-e3-exploration","6-2-u3-e3-example-1","6-2-u3-e3-mission-2"]);
      const heightGridIds=new Set(["6-2-u3-e3-example-1","6-2-u3-e3-mission-2","6-2-u3-e3-mission-4"]);
      const layerSectionId="6-2-u3-e4-mission-3-1";
      const types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types)))
        .filter(t=>/^6-2-u3-/.test(t.sourceItemId||"")&&!t.reviewLocked);
      if(!types.length)throw new Error("No current space-and-solids types were checked");
      const results=[];
      function check(q,prompt=q.prompt){
        const template=document.createElement("template");template.innerHTML=prompt;const root=template.content;
        if(typeof prompt!=="string"||!prompt.trim())throw new Error("Missing student question");
        const layerSection=q.sourceItemId===layerSectionId;
        if(layerSection){
          const contract=window.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_CONTRACTS.generate("6-2-u3-e4-mission-3",q.variant,q.difficultyLevel);
          const expected=document.createElement("template");
          expected.innerHTML=window.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_BANK_PRESENTATION.problemHtml(contract);
          // Only the original blank response grids are allowed, never a completed layer.
          if(template.innerHTML!==expected.innerHTML||root.querySelector('polygon,[data-response-role="teacher"]'))
            throw new Error("Layer-section student givens differ from the verified blank response");
        }
        if(q.answerVisual&&prompt.includes(q.answerVisual))throw new Error("Completed answer copied into the question");
        for(const el of root.querySelectorAll("[class]"))if([...el.classList].some(c=>/^source62-.*(?:-answer(?:-|$)|-worked$)/.test(c)||["source62-painted-layers","source62-notched-layers"].includes(c)))
          throw new Error("Teacher diagram or worked table in the student question");
        if(root.querySelector('[data-answer-source],[data-source-answer-layer],[data-phase="answer"],[data-phase="cut"],[data-phase="touch"],[data-selected="true"]'))
          throw new Error("Solved layer or answer annotation in the student question");
        const tables=[...root.querySelectorAll("table")],needsTable=responseTableIds.has(q.sourceItemId)&&q.difficultyLevel!==0;
        if(tables.length!==(needsTable?1:0))throw new Error("Unexpected explanatory table");
        for(const table of tables){
          const headings=[...table.querySelectorAll("thead th")].map(el=>el.textContent.trim());
          const cells=[...table.querySelectorAll("tbody td")];
          if(headings.join("|")!=="0면|1면|2면|3면|4면|5면"||cells.length!==6||cells.some(el=>el.textContent.trim()||el.children.length)||table.querySelector("tfoot"))
            throw new Error("Original blank response table was filled or replaced");
        }
        for(const el of root.querySelectorAll("[data-layer]")){
          const layer=Number(el.dataset.layer);
          // Preserve the printed reference example, not a solved version of the current question.
          if(q.sourceItemId==="6-2-u3-e4-exploration"&&el.closest('.source62-cut-reference[data-reference-role="source-given-worked-example"]')&&[1,2].includes(layer))continue;
          if(heightGridIds.has(q.sourceItemId)&&el.matches('svg[data-role="height"][data-layer="0"]'))continue;
          if(el.matches('.source62-cut-response svg[data-phase="blank"]')&&q.responseLayers?.includes(layer))continue;
          if(layerSection&&el.matches('svg[data-response-role="problem"]')&&el.closest('[data-role="blank-response-grids"]')&&q.requestedLayers.includes(layer))continue;
          throw new Error(`Extra completed layer outside the original student givens: ${q.sourceItemId}`);
        }
      }
      for(const type of types)for(let offset=-1;offset<=1;offset++)for(let variant=0;variant<3;variant++){
        const q=window.HSE_GENERATORS.generate(type,1,offset,123,variant);if(!q)throw new Error(`Missing question: ${type.id}`);
        check(q);let rejected=0;
        const poisons=[
          q.prompt+'<table><tbody><tr><td>1층 21개</td></tr></tbody></table>',
          q.prompt+'<svg data-layer="1" data-selected="true"></svg>',
          q.prompt+'<div class="source62-painted-layers"><svg></svg></div>'
        ];
        if(q.answerVisual)poisons.push(q.prompt+q.answerVisual);
        if(q.sourceItemId===layerSectionId){
          poisons.push(q.prompt.replace('data-response-role="problem"','data-response-role="teacher"'));
          poisons.push(q.prompt.replace('</svg>','<path d="M 8 8 L 64 64" stroke="black"/></svg>'));
          poisons.push(q.prompt+'<svg data-layer="1" data-response-role="problem"></svg>');
        }
        for(const poison of poisons){let failed=false;try{check(q,poison);}catch{failed=true;}if(!failed)throw new Error(`Student boundary test did not reject a helper: ${type.id}`);rejected++;}
        results.push({sourceItemId:type.sourceItemId,level:offset+1,variant,studentBoundary:true,rejected});
      }
      return results;
    });
    assert.deepEqual(errors,[]);assert.deepEqual(hashes(),report.runtimeHashes);
  } finally {await browser.close();}
}
async function main() {
  const out=process.env.HSE_SCREENSHOT_DIR;if(out){assert(/^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});}
  try {unit();if(process.argv.includes("--browser")){assert(out);await browser(out);}report.status="passed-local-student-boundary";}
  catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{if(out)fs.writeFileSync(path.join(out,"student-given-result.json"),JSON.stringify(report,null,2)+"\n");}
  console.log(JSON.stringify({status:report.status,accepted:report.accepted,rejected:report.rejected,states:report.states.length,previews:report.previews.length,pdfs:report.pdfs.length,catalogStudentChecks:report.catalogStudentChecks.length,actualHttpTested:false}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
