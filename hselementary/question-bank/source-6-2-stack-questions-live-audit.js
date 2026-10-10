"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");
const output = process.env.HSE_SCREENSHOT_DIR;
assert(output && /^[EG]:[/\\]/i.test(output), "Evidence must stay on E: or G:.");
fs.mkdirSync(output, {recursive:true});
const ids = ["6-2-u3-e1-example-4", "6-2-u3-e1-mission-3"];
const keys = ["sourceGrade6SecondSpaceE1StackExample4", "sourceGrade6SecondSpaceE1StackMission3"];
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname,"assets/source-6-2-stacks/manifest.json"),"utf8"));
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const files = ["index.html","app.js","source-inventory-grade6.js","source-6-2-stack-questions.js","source-6-2-stack-questions.css","source-6-2-stack-questions-live-audit.js","source-6-2-stack-questions-pdf-audit.py","assets/source-6-2-stacks/manifest.json",...manifest.assets.map(asset=>`assets/source-6-2-stacks/${asset.file}`),...Object.keys(manifest.runtimeHashes)];
const hashes = () => Object.fromEntries(files.map(file=>[file,sha(fs.readFileSync(path.join(__dirname,file)))]));
const initial = hashes();
// These observations are read from the two original pages, not from generator models.
const originals = [
  {top:[[1,0,0],[1,1,1],[0,1,0]],front:[3,1,2],right:[1,2,3],total:8},
  {top:[[1,1],[1,0],[1,0]],front:[3,2],right:[1,2,3],total:null}
];
function solve(given) {
  const rows=given.top.length, cols=given.top[0].length;
  const positions=[];
  given.top.forEach((row,r)=>row.forEach((v,c)=>{if(v)positions.push([r,c]);}));
  const heights=given.top.map(row=>row.map(()=>0)), answers=[];
  let visited=0;
  function visit(index) {
    if(index<positions.length) {
      const [r,c]=positions[index], cap=Math.min(given.front[c]??Infinity,given.right[rows-1-r]);
      for(let h=1;h<=cap;h++) { if(given.cue&&given.cue.r===r&&given.cue.c===c&&h!==given.cue.height)continue; heights[r][c]=h; visit(index+1); }
      heights[r][c]=0;
      return;
    }
    visited++;
    // Voxel projections use occupied y levels, independently of the producer's max-height method.
    const front=Array.from({length:cols},()=>new Set()), right=Array.from({length:rows},()=>new Set());
    let total=0;
    for(const [r,c] of positions)for(let y=0;y<heights[r][c];y++) {front[c].add(y);right[rows-1-r].add(y);total++;}
    const f=front.map(s=>s.size), s=right.map(s=>s.size);
    if(given.front.some((v,i)=>v!==null&&v!==f[i])||given.right.some((v,i)=>v!==s[i]))return;
    if(given.total!==null&&total!==given.total)return;
    if(given.frontSum!==null&&f.reduce((a,b)=>a+b,0)!==given.frontSum)return;
    answers.push({heights:heights.map(row=>[...row]),top:given.top.map(row=>[...row]),front:f,right:s,...(given.total!==null?{total}:{})});
  }
  visit(0);
  return {answers,visited};
}
function validate(given,asset,id) {
  const result=solve(given);
  assert.equal(result.answers.length,1,`${id}: learner-visible conditions need exactly one answer`);
  assert.equal(sha(JSON.stringify({sourceItemId:id,countGiven:id===ids[0],pool:result.answers[0]})),asset.contractSha256,`${id}: reconstructed answer differs from verified PNG geometry`);
  return result;
}
async function readProblems(page) {
  return page.locator("#problemView .question-item").evaluateAll(items=>items.map(item=>{
    const views=[...item.querySelectorAll(".source62-stack-view")];
    const read=name=>{
      const svg=views.find(el=>el.dataset.view===name), lines=[...svg.querySelectorAll("line")];
      const n=(Math.max(...lines.map(l=>+l.getAttribute("y2")))-10)/18;
      const cells=[...svg.querySelectorAll(".stack-view-cell")].map(el=>({r:(+el.getAttribute("y")-10)/18-1,c:(+el.getAttribute("x")-10)/18-1}));
      if(name==="위") {
        const rows=Math.max(...cells.map(v=>v.r))+1,cols=Math.max(...cells.map(v=>v.c))+1;
        const top=Array.from({length:rows},()=>Array(cols).fill(0));cells.forEach(v=>top[v.r][v.c]=1);
        const cue=svg.querySelector("text");
        return {top,cue:cue?{r:(+cue.getAttribute("y")-10)/18-1.5,c:(+cue.getAttribute("x")-10)/18-1.5}:null};
      }
      const cols=Math.max(...cells.map(v=>v.c))+1, heights=Array(cols).fill(0);
      cells.forEach(v=>heights[v.c]++);
      for(let c=0;c<cols;c++) {
        const ys=cells.filter(v=>v.c===c).map(v=>v.r).sort((a,b)=>a-b);
        if(ys.length&&ys.some((v,i)=>v!==n-3-ys.length+1+i))throw Error("Projection has floating or missing squares");
      }
      if(svg.querySelector("text"))heights[1]=null;
      return heights;
    };
    const top=read("위"),front=read("앞"),right=read("오른쪽"),text=item.querySelector(".question-prompt").innerText;
    const direct=text.match(/모두\s*(\d+)개/),added=text.match(/그 위에\s*(\d+)개/),cue=text.match(/㉠칸에는 쌓기나무\s*(\d+)개/),sum=text.match(/합은\s*(\d+)칸/);
    const floor=top.top.flat().filter(Boolean).length;
    return {top:top.top,front,right,total:direct?+direct[1]:added?floor+(+added[1]):null,frontSum:sum?+sum[1]:null,cue:top.cue?{...top.cue,height:+cue[1]}:null,text};
  }));
}
async function inspect(page,phase) {
  const result=await page.evaluate(phase=>{
    const root=document.querySelector(phase==="problem"?"#problemView":phase==="solution"?"#solutionView":"#answerKeyView"),errors=[];
    const count=root.querySelectorAll(phase==="problem"?".question-item":phase==="solution"?".solution-item":".answer-key-visuals figure").length;
    for(const el of root.querySelectorAll(".question-prompt,.solution-item p,.solution-item header strong")) {
      const style=getComputedStyle(el);
      if(style.color!=="rgb(0, 0, 0)"||+style.fontWeight!==400)errors.push("Nonstandard text tone/weight");
    }
    for(const svg of root.querySelectorAll(".source62-stack-view")) {
      const frame=svg.getBoundingClientRect();
      for(const text of svg.querySelectorAll("text")) {
        const r=text.getBoundingClientRect();
        if(r.height<10||r.left<frame.left||r.right>frame.right||r.top<frame.top||r.bottom>frame.bottom)errors.push("Small or clipped symbol");
        const transform=svg.getScreenCTM();
        for(const line of svg.querySelectorAll("line")) {
          const a=new DOMPoint(+line.getAttribute("x1"),+line.getAttribute("y1")).matrixTransform(transform);
          const b=new DOMPoint(+line.getAttribute("x2"),+line.getAttribute("y2")).matrixTransform(transform);
          const samples=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)));
          for(let i=0;i<=samples;i++) {const x=a.x+(b.x-a.x)*i/samples,y=a.y+(b.y-a.y)*i/samples;if(x>r.left&&x<r.right&&y>r.top&&y<r.bottom) {errors.push(`Grid/symbol collision ${text.textContent}/${JSON.stringify({r:{left:r.left,top:r.top,width:r.width,height:r.height},a,b,font:getComputedStyle(text).fontSize})}`);break;}}
        }
      }
      for(const line of svg.querySelectorAll("line")) {const style=getComputedStyle(line);if(style.stroke!=="rgb(0, 0, 0)"||parseFloat(style.strokeWidth)!==.8)errors.push("Nonstandard grid line");}
    }
    for(const dots of root.querySelectorAll(".source62-stack-dotgrid")) {
      if(dots.querySelector("text,path,line,polygon,image"))errors.push("Answer leaked into blank dot grid");
      const points=[...dots.querySelectorAll("circle")];
      if(points.length<150)errors.push("Insufficient isometric grid");
      for(const p of points) {const x=+p.getAttribute("cx"),y=+p.getAttribute("cy");if(x<16||x>316||y<16||y>160)errors.push("Dot grid overflow");}
    }
    for(const img of root.querySelectorAll(".source62-stack-answer img")) {
      if(!img.complete||img.naturalWidth!==1280||img.naturalHeight!==1040)errors.push("Missing answer image");
      if(28*img.getBoundingClientRect().width/640<12)errors.push(`Answer direction label below 12px/${img.getBoundingClientRect().width}`);
    }
    for(const expression of root.querySelectorAll(".math-inline-expression"))if(expression.getClientRects().length!==1)errors.push("Broken calculation line");
    const leak=phase==="problem"&&!!root.querySelector("img,[data-answer-source],[data-model],[data-stack-heights]");
    return {errors,count,leak,overflow:document.documentElement.scrollWidth>innerWidth+1,grids:root.querySelectorAll(".source62-stack-dotgrid").length};
  },phase);
  if(result.errors.length)await page.locator(phase==="problem"?"#problemView .question-item":phase==="solution"?"#solutionView .solution-item":"#answerKeyView").first().screenshot({path:path.join(output,`failure-${phase}.png`)});
  assert.deepEqual(result.errors,[],`${phase}: ${JSON.stringify(result)}`);
  assert.equal(result.count,3);assert(!result.leak&&!result.overflow);assert.equal(result.grids,phase==="problem"?3:0);
}
async function overlay(page) {
  if(process.env.HSE_STACK_CANDIDATE!=="1")return;
  await page.route("**/source-inventory-grade6.js*",async route=>{
    const body=fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8");
    const append=`\nwindow.HSE_SOURCE_INVENTORY_GRADE6.items.forEach(item=>{const ids=${JSON.stringify(ids)},keys=${JSON.stringify(keys)};const index=ids.indexOf(item.sourceItemId);if(index>=0)Object.assign(item,{generatorKey:keys[index],variant:0,sourceVerified:true,reviewLocked:false,reviewReason:"",answerVisualStatus:"verified",verifiedVariantCount:3});});`;
    await route.fulfill({status:200,contentType:"application/javascript",body:body+append});
  });
}
async function inspectPrintGuard(browser,base) {
  const page=await browser.newPage({viewport:{width:1280,height:900}}),alerts=[];
  page.on("dialog",async dialog=>{alerts.push(dialog.message());await dialog.dismiss();});
  try {
    await overlay(page);await page.goto(`${base}?type=${ids[0]}&review=1`,{waitUntil:"domcontentloaded"});
    await page.locator("#worksheet:not([hidden])").waitFor();
    await page.locator("#solutionView img").evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
    await page.evaluate(()=>{
      window.__printCalls=0;window.print=()=>window.__printCalls++;
      window.__realDecode=HTMLImageElement.prototype.decode;
      window.__decodeGate=new Promise(resolve=>window.__releaseDecode=resolve);
      HTMLImageElement.prototype.decode=function(){return window.__decodeGate.then(()=>window.__realDecode.call(this));};
    });
    await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="solution"]').click();
    await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.__printCalls),0,"Do not print before image decoding");
    await page.evaluate(()=>window.__releaseDecode());await page.waitForFunction(()=>window.__printCalls===1);
    await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="solution"]').click();
    await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.__printCalls),1,"Repeated print requests must not overlap");
    await page.evaluate(()=>{HTMLImageElement.prototype.decode=window.__realDecode;dispatchEvent(new Event("afterprint"));});
    await page.route("**/missing-stack-audit.png",route=>route.fulfill({status:404,body:"missing"}));
    await page.locator("#answerKeyView img").first().evaluate(img=>img.src="./missing-stack-audit.png");
    await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();
    await page.waitForFunction(()=>!document.body.hasAttribute("data-print-mode"));
    assert.equal(await page.evaluate(()=>window.__printCalls),1,"Failed answer asset must block printing");assert.equal(alerts.length,1);
    await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="problem"]').click();
    await page.waitForFunction(()=>window.__printCalls===2);await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
    await page.evaluate(()=>{window.print=()=>{throw Error("test print failure");};});
    await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="problem"]').click();
    await page.waitForFunction(()=>!document.body.hasAttribute("data-print-mode"));assert.equal(alerts.length,2);
    await page.evaluate(()=>{
      window.print=()=>window.__printCalls++;
      window.__decodeGate=new Promise(resolve=>window.__releaseDecode=resolve);
      HTMLImageElement.prototype.decode=function(){return window.__decodeGate.then(()=>window.__realDecode.call(this));};
    });
    await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="solution"]').click();
    await page.locator("#backButton").click();await page.evaluate(()=>window.__releaseDecode());
    await page.waitForFunction(()=>!document.body.hasAttribute("data-print-mode"));assert.equal(await page.evaluate(()=>window.__printCalls),2,"Returning to selection cancels a pending print");
    return {delayedDecode:true,repeatedClick:true,missingAnswerImage:true,problemOnlyIndependentOfMissingAnswer:true,printFailureRestored:true,backCancelsPendingPrint:true};
  } finally {await page.close();}
}
async function inspectMixed(browser,base) {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  try {
    await overlay(page);await page.goto(`${base}?type=${ids[0]}&review=1`,{waitUntil:"domcontentloaded"});
    await page.locator("#worksheet:not([hidden])").waitFor();await page.locator("#backButton").click();
    await page.locator(`input[data-type-id="${ids[1]}"]`).evaluate(input=>input.click());
    await page.locator("#questionCountInput").fill("40");await page.locator("#questionCountInput").dispatchEvent("input");
    await page.locator("#generateButton").click();
    await page.locator("#worksheet:not([hidden])").waitFor();
    const givens=await readProblems(page);assert.equal(givens.length,6,"Two finite three-variant pools must cap the requested paper at six");
    await page.locator("#solutionTab").click();await page.locator("#solutionView img").evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
    const images=await page.locator("#solutionView .source62-stack-answer img").evaluateAll(images=>images.map(img=>img.getAttribute("src")));
    assert.equal(new Set(images).size,6,"No repeated stack diagrams in a mixed paper");
    for(const [index,given] of givens.entries()) {const asset=manifest.assets.find(a=>a.file===path.basename(images[index]));validate(given,asset,asset.sourceItemId);}
    const pdfs=[];
    for(const phase of ["problem","solution"]) {
      await page.locator(phase==="problem"?"#problemTab":"#solutionTab").click();await page.emulateMedia({media:"print"});
      const file=path.join(output,`mixed-${phase}-a4.pdf`);await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
      const pages=+execFileSync(process.env.HSE_PDFINFO_EXECUTABLE,[file],{encoding:"utf8"}).match(/^Pages:\s+(\d+)/m)[1];
      assert.equal(pages,2,"Six stacks must fit two A4 sheets, with no blank leading page");pdfs.push({phase,pages});await page.emulateMedia({media:"screen"});
    }
    return {requested:40,actual:6,uniqueAnswerAssets:6,pdfs};
  } finally {await page.close();}
}
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE});
  const base=process.env.HSE_BASE_URL||"http://127.0.0.1:8897/hselementary/question-bank/",records=[],pdfs=[];
  let states=0,negativeControls=0,printGuard,mixed;
  try {
    for(const [index,id] of ids.entries())for(const difficulty of [-1,0,1])for(const width of [1280,390,320]) {
      const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
      page.setDefaultNavigationTimeout(60000);page.on("pageerror",e=>errors.push(e.message));await overlay(page);
      await page.goto(`${base}?type=${id}&review=1&difficulty=${difficulty}`,{waitUntil:"domcontentloaded"});
      await page.locator("#worksheet:not([hidden])").waitFor({state:"visible"});await page.evaluate(()=>document.fonts.ready);
      const givens=await readProblems(page);
      assert.equal(givens.length,3);
      if(difficulty===0)for(const field of ["top","front","right","total"])assert.deepEqual(givens[0][field],originals[index][field],`Original ${id}/${field}`);
      await page.locator("#solutionTab").click();
      await page.locator("#solutionView .source62-stack-answer img").evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
      const images=await page.locator("#solutionView .source62-stack-answer img").evaluateAll(images=>images.map(img=>img.getAttribute("src")));
      for(const [variant,given] of givens.entries()) {
        const asset=manifest.assets.find(a=>a.file===path.basename(images[variant]));assert(asset);
        const solved=validate(given,asset,id);assert.equal(asset.variant,variant);
        const bytes=await (await page.request.get(new URL(images[variant],base).href)).body();assert.equal(sha(bytes),asset.sha256);
        if(width===1280) {
          records.push({id,difficulty,variant,given,visited:solved.visited,answerCount:solved.answers.length,answerAsset:asset.file});
          assert.throws(()=>validate(given,manifest.assets.find(a=>a.sourceItemId===id&&a.variant===(variant+1)%3),id));negativeControls++;
          if(difficulty===-1) {const noCue={...given,cue:null};assert(solve(noCue).visited>solved.visited,"Easy clue must reduce independent search");assert.equal(given.cue.height,solved.answers[0].heights[given.cue.r][given.cue.c]);}
          if(index===0) {assert(solve({...given,total:null,cue:null}).answers.length>1,"Example 4 without added easy clue needs the count");negativeControls++;}
          if(difficulty===1&&index===1) {assert.equal(given.front[1],null);assert(solve({...given,frontSum:null}).answers.length>1,"Hard requires an extra front-height calculation");negativeControls++;}
          if(given.cue) {assert.equal(solve({...given,cue:{...given.cue,height:0}}).answers.length,0);negativeControls++;}
        }
      }
      await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});
      for(const phase of ["problem","solution","answer-key"]) {
        if(phase==="answer-key") {
          await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();
          await page.waitForFunction(()=>window.__printCalls===1);
        } else {
        await page.locator(phase==="problem"?"#problemTab":"#solutionTab").click();await inspect(page,phase);
        }
        await inspect(page,phase);
        const prefix=`${id}-d${difficulty}-${width}-${phase}`;
        await page.locator(phase==="problem"?"#problemView .question-item":phase==="solution"?"#solutionView .solution-item":"#answerKeyView .answer-key-visuals figure").first().screenshot({path:path.join(output,`${prefix}.png`)});
        if(width===1280) {
          await page.emulateMedia({media:"print"});await inspect(page,phase);
          const file=path.join(output,`${id}-d${difficulty}-${phase}-a4.pdf`);
          await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
          const pages=+execFileSync(process.env.HSE_PDFINFO_EXECUTABLE,[file],{encoding:"utf8"}).match(/^Pages:\s+(\d+)/m)[1];
          assert.equal(pages,1,`${id}/${difficulty}/${phase}: three items must fit one A4`);
          pdfs.push({id,difficulty,phase,pages});await page.emulateMedia({media:"screen"});
        }
        if(phase==="answer-key")await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
      }
      await page.locator("#solutionViewerButton").click();
      await page.locator("#solutionViewerContent img").evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
      const viewer=await page.locator("#solutionViewerContent").evaluate(root=>({
        projections:root.querySelectorAll(".source62-stack-view").length,
        images:root.querySelectorAll(".source62-stack-answer img").length,
        readable:28*root.querySelector("img").getBoundingClientRect().width/640>=12,
        typography:[...root.querySelectorAll(".solution-viewer-prompt,.solution-viewer-answer,.solution-viewer-solution")].every(el=>getComputedStyle(el).color==="rgb(0, 0, 0)"&&+getComputedStyle(el).fontWeight===400),
        overflow:document.documentElement.scrollWidth>innerWidth+1
      }));
      assert.deepEqual(viewer,{projections:3,images:1,readable:true,typography:true,overflow:false});
      if(difficulty===0&&width===390)await page.locator("#solutionViewerContent").screenshot({path:path.join(output,`${id}-viewer-390.png`)});
      await page.keyboard.press("Escape");
      const boundaries=await page.evaluate(({id,key})=>{
        const api=window.HSE_GENERATORS,type=window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId===id);
        const rejected=[];
        for(const variant of [-1,.5,NaN,Number.MAX_SAFE_INTEGER+1]) {try {api.generate(type,1,0,1,variant);rejected.push(false);}catch{rejected.push(true);}}
        for(const offset of [-2,2,.5]) {try {api.generate(type,1,offset,1,0);rejected.push(false);}catch{rejected.push(true);}}
        rejected.push(api.generate({...type,reviewLocked:true},1,0,1,0)===null);
        rejected.push(api.generate({...type,sourceItemId:"wrong-source",generatorKey:key},1,0,1,0)===null);
        return rejected;
      },{id,key:keys[index]});assert(boundaries.every(Boolean));assert.deepEqual(errors,[]);
      await page.close();states++;console.log(`Stack bank ${states}/18: ${id}/${difficulty}/${width}`);
    }
    printGuard=await inspectPrintGuard(browser,base);
    mixed=await inspectMixed(browser,base);
  } finally {await browser.close();}
  assert.deepEqual(hashes(),initial,"Source changed during verification");
  fs.writeFileSync(path.join(output,"browser-result.json"),JSON.stringify({candidateOverlay:process.env.HSE_STACK_CANDIDATE==="1",states,negativeControls,records,pdfs,printGuard,mixed,assetHashes:initial},null,2));
  console.log(`Passed ${states} actual-bank states, ${records.length} unique question contracts, ${negativeControls} negative controls, ${pdfs.length} A4 files.`);
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
