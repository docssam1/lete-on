"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const crypto = require("node:crypto"), vm = require("node:vm");
const assetRoot = "assets/source-6-2-operations-v3";
const names = { top: "위", front: "앞", right: "오른쪽", back: "뒤", left: "왼쪽" };
const label = index => String.fromCodePoint(0x3260 + index);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = file => fs.readFileSync(path.join(__dirname, file), "utf8");
// Independent, finite learner fixtures, including the visibility-corrected Example 2 pool.
const SOURCES = [
  { sourceItemId: "6-2-u3-e1-example-2", key: "sourceGrade6SecondSpaceE1StackRemovalLabels",
    pools: [[[2,3,1],[0,2,2],[0,2,1]], [[3,3,1],[0,2,2],[0,2,1]], [[2,3,1],[0,2,2],[0,3,1]]],
    columns: [[1,0],[2,0],[0,0],[1,1],[1,2],[2,1],[2,2]] },
  { sourceItemId: "6-2-u3-e1-mission-5", key: "sourceGrade6SecondSpaceE1StackAddViews",
    pools: [[[0,0,2],[3,2,1],[1,0,0]], [[0,0,3],[3,2,1],[1,0,0]], [[0,0,2],[4,2,1],[1,0,0]]],
    add: [[0,2,2],[1,1,1]], columns: [[0,2],[1,1]] },
  { sourceItemId: "6-2-u3-e1-mission-6", key: "sourceGrade6SecondSpaceE1StackRemoveBlackViews",
    pools: [[[0,2,2,1],[2,3,0,0],[0,1,0,0]], [[0,2,3,1],[2,3,0,0],[0,1,0,0]], [[0,2,2,2],[2,3,0,0],[0,1,0,0]]],
    marked: [[0,1,1],[1,2,1],[1,0,2]] }
];
function occupied(heights) {
  const cells = new Set();
  heights.forEach((row, z) => row.forEach((n, x) => { for (let y = 0; y < n; y++) cells.add([x,y,z].join(",")); }));
  return cells;
}
function project(cells, heights) {
  const top = heights.map(row => row.map(() => 0)), front = heights[0].map(() => 0), right = heights.map(() => 0);
  const frontPixels = new Set(), rightPixels = new Set();
  for (const address of cells) {
    const [x,y,z] = address.split(",").map(Number);
    top[z][x] = 1; front[x] = Math.max(front[x], y+1); right[heights.length-1-z] = Math.max(right[heights.length-1-z], y+1);
    frontPixels.add(`${x},${y}`); rightPixels.add(`${z},${y}`);
  }
  return { top, front, right, back: front.slice().reverse(), left: right.slice().reverse(), frontPixels, rightPixels };
}
const sameSet = (a,b) => a.size === b.size && [...a].every(value => b.has(value));
function compareUnrelatedInventory(actual, baseline) {
  assert(baseline,"Candidate baseline source disappeared");
  const expected=structuredClone(baseline);
  if(typeof expected.reviewLocked==="boolean" && !Object.hasOwn(expected,"verifiedVariantProvenance") &&
      Object.hasOwn(actual,"verifiedVariantProvenance")) {
    expected.verifiedVariantProvenance=expected.reviewLocked ? [] : ["source-values","source-structure-variant","source-structure-variant"];
  }
  assert.deepEqual(actual,expected,"Candidate overlay changed an unrelated source");
}
function oracle(source, variant) {
  const heights = source.pools[variant], cells = occupied(heights), before = project(cells, heights);
  const remaining = new Set(cells), primary = [], secondary = [], trials = [];
  if (source.add) {
    for (const [x,z,n] of source.add) for (let y=heights[z][x]; y<heights[z][x]+n; y++) {
      assert(!remaining.has(`${x},${y},${z}`)); remaining.add(`${x},${y},${z}`);
    }
  } else if (source.marked) source.marked.forEach(cell => assert(remaining.delete(cell.join(","))));
  else source.columns.forEach(([x,z], index) => {
    const trial = new Set(cells), cell = [x,heights[z][x]-1,z]; assert(trial.delete(cell.join(",")));
    const after = project(trial, heights), qualifies = sameSet(before.frontPixels,after.frontPixels) && sameSet(before.rightPixels,after.rightPixels);
    const changesTop = JSON.stringify(before.top) !== JSON.stringify(after.top);
    trials.push({ label: label(index), cell, qualifies, changesTop });
    if (qualifies) { primary.push(label(index)); if (changesTop) secondary.push(label(index)); }
  });
  return { heights, total: cells.size, before, after: project(remaining, heights), primary, secondary, trials };
}
function gridsFor(source, variant, level) {
  const model = oracle(source, variant), given = {}, answer = {}, blank = {};
  if (!source.add && !source.marked) {
    answer.front = model.before.front; answer.right = model.before.right;
    if (!level) { given.front = model.before.front; given.right = model.before.right; }
  } else if (source.add) {
    given.top = model.before.top;
    if (!level) given.right = model.before.right;
    answer.right = model.after.right;
    if (level === 2) answer.front = model.after.front;
  } else {
    if (!level) given.top = model.after.top;
    for (const view of level === 0 ? ["front","right"] : level === 1 ? ["top","front","right"] : ["top","front","right","back","left"]) answer[view] = model.after[view];
  }
  if (source.add || source.marked) Object.assign(blank, answer);
  return { model, given, answer, blank };
}
function matrixSpec(view, values, filled = true) {
  const rows = view === "top" ? values.length : Math.max(...values)+1;
  const cols = view === "top" ? values[0].length : values.length;
  const cells = [];
  for (let y=0; y<rows; y++) for (let x=0; x<cols; x++) if (filled && (view === "top" ? values[y][x] : rows-y <= values[x])) {
    cells.push({ x: 9+24*x, y: 9+24*y, width: 24, height: 24 });
  }
  return { name: names[view], width: cols*24+18, height: rows*24+18, rows, cols, cells };
}
const orderedCells = cells => cells.slice().sort((a,b) => a.y-b.y || a.x-b.x);
function validateGrid(actual, expected) {
  assert.equal(actual.name, expected.name); assert.equal(actual.width, expected.width); assert.equal(actual.height, expected.height);
  assert.equal(actual.viewBox, `0 0 ${expected.width} ${expected.height}`);
  assert.deepEqual(orderedCells(actual.cells), orderedCells(expected.cells), `Full occupied cell positions differ: ${expected.name}`);
}
function movedControl(spec) {
  const wrong = structuredClone(spec), bottom = wrong.cells.find(cell => cell.y > 9 && !wrong.cells.some(other => other.x === cell.x && other.y === 9));
  assert(bottom, "A profile must leave an empty top row for the position negative control"); bottom.y = 9;
  const counts = cells => cells.reduce((all,cell) => { all[cell.x] = (all[cell.x] || 0)+1; return all; }, {});
  assert.deepEqual(counts(wrong.cells), counts(spec.cells));
  assert.throws(() => validateGrid(wrong, spec), assert.AssertionError);
}
function wrapperChecks(api) {
  let rejected = 0;
  for (const source of SOURCES) {
    const type = { sourceItemId: source.sourceItemId, generatorKey: source.key, reviewLocked: false };
    assert.equal(api.generatorKey(type), source.key);
    assert.equal(api.generatorKey({...type,reviewLocked:true}), "");
    assert.equal(api.generate({...type,reviewLocked:true},1,0,1,0), null); rejected++;
    for (const other of SOURCES.filter(item => item !== source)) {
      assert.equal(api.generate({...type,generatorKey:other.key},1,0,1,0), null); rejected++;
    }
    assert.equal(api.generate({...type,sourceItemId:"wrong-source"},1,0,1,0), null); rejected++;
    for (const value of [-1,0.5,NaN,Infinity,"0",null,{},Number.MAX_SAFE_INTEGER+1]) {
      assert.throws(() => api.generate(type,1,0,1,value)); rejected++;
    }
    for (const value of [-2,2,0.5,NaN,Infinity,"0",{}]) {
      assert.throws(() => api.generate(type,1,value,1,0)); rejected++;
    }
    for (const offset of [-1,0,1]) for (let variant=0;variant<9;variant++) {
      const question = api.generate(type,1,offset,1,variant);
      assert.equal(question.verifiedPoolIndex, variant%3); assert.equal(question.verifiedVariantCount, 3);
      assert.equal(question.sourceItemId, source.sourceItemId); assert.equal(question.generator, source.key);
      assert.equal(question.difficultyLevel, offset+1); assert.equal(question.publisherAnswerVerified, false);
    }
  }
  return rejected;
}
function selfTest() {
  const inventoryFixture={sourceItemId:"6-1-u6-e2-exploration",commonTypeId:"cut-corners-box-volume",reviewLocked:false};
  const normalized={...inventoryFixture,verifiedVariantProvenance:["source-values","source-structure-variant","source-structure-variant"]};
  compareUnrelatedInventory(normalized,inventoryFixture);
  assert.throws(()=>compareUnrelatedInventory({...normalized,reviewLocked:true},inventoryFixture));
  assert.throws(()=>compareUnrelatedInventory({...normalized,verifiedVariantProvenance:["source-values"]},inventoryFixture));
  assert.throws(()=>compareUnrelatedInventory({...normalized,sourceItemId:"other"},inventoryFixture));
  compareUnrelatedInventory({...normalized,sourceItemId:"other"},{...inventoryFixture,sourceItemId:"other"});
  compareUnrelatedInventory({...inventoryFixture,reviewLocked:true,verifiedVariantProvenance:[]},{...inventoryFixture,reviewLocked:true});
  assert.throws(()=>compareUnrelatedInventory({...normalized,verifiedVariantProvenance:[]},inventoryFixture));
  assert.throws(()=>compareUnrelatedInventory({...normalized,reviewLocked:true},{...inventoryFixture,reviewLocked:true}));
  assert.throws(()=>compareUnrelatedInventory(normalized,{...inventoryFixture,verifiedVariantProvenance:[]}));
  let cases = 0;
  for (const source of SOURCES) for (let variant=0;variant<3;variant++) for (let level=0;level<3;level++) {
    const expected = gridsFor(source,variant,level);
    for (const [view,values] of Object.entries(expected.answer)) {
      const spec = matrixSpec(view,values); validateGrid({...spec,viewBox:`0 0 ${spec.width} ${spec.height}`},spec);
      if (view !== "top") movedControl({...spec,viewBox:`0 0 ${spec.width} ${spec.height}`});
    }
    cases++;
  }
  const original = oracle(SOURCES[0],0);
  assert.deepEqual(original.primary,[label(1),label(3),label(6)]); assert.deepEqual(original.secondary,[label(1),label(6)]);
  const topFiltered = original.trials.filter(trial => trial.qualifies && !trial.changesTop).map(trial => trial.label);
  assert.deepEqual(topFiltered,[label(3)]); assert.throws(() => assert.deepEqual(topFiltered,original.primary));
  assert.deepEqual(SOURCES[2].pools.map((_,v) => oracle(SOURCES[2],v).total),[11,12,12]);
  const context = {window:{HSE_GENERATORS:{names:[],generatorKey:()=>"",generate:()=>null}}};
  for (const file of ["source-6-2-stack-models.js","source-6-2-stack-operations.js","source-6-2-stack-operation-question-contracts.js","source-6-2-stack-operation-questions.js"]) vm.runInNewContext(read(file),context,{filename:file});
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.HSE_SOURCE_GRADE6_STACK_OPERATION_QUESTIONS.definitions)),SOURCES.map(({sourceItemId,key})=>({sourceItemId,key})));
  const rejected = wrapperChecks(context.window.HSE_GENERATORS);
  console.log(`SELF-TEST PASS: ${cases} independent contracts; full-cell/moved-cell and TOP-misuse controls; ${rejected} wrapper rejections. No files written.`);
}
function preflight() {
  const manifest = JSON.parse(read(`${assetRoot}/manifest.json`));
  assert.equal(manifest.assets.length,15); assert.equal(manifest.exportSettings.width,640); assert.equal(manifest.exportSettings.height,520);
  assert.equal(manifest.exportSettings.pixelRatio,2);
  assert(manifest.exportSettings.annotationFontSize >= 28 && manifest.exportSettings.directionFontSize >= 28);
  for (const [file,hash] of Object.entries(manifest.runtimeHashes)) assert.equal(sha(read(file).replaceAll("\r\n","\n")),hash,`Stale V3 asset provenance: ${file}`);
  const assets = new Map();
  for (const source of SOURCES) for (let variant=0;variant<3;variant++) for (const phase of source.add || source.marked ? ["before","after"] : ["before"]) {
    const file = `${source.sourceItemId}-v${variant}-${phase}.png`, entry = manifest.assets.find(asset => asset.file === file);
    assert(entry,`Missing V3 asset: ${file}`); assert.equal(entry.sourceItemId,source.sourceItemId); assert.equal(entry.variant,variant); assert.equal(entry.phase,phase);
    const bytes = fs.readFileSync(path.join(__dirname,assetRoot,file));
    assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a"); assert.equal(bytes.readUInt32BE(16),1280); assert.equal(bytes.readUInt32BE(20),1040);
    assert.equal(bytes.length,entry.byteLength); assert.equal(sha(bytes),entry.sha256);
    if (phase === "before" && source.columns) {
      const heights = source.pools[variant], addresses = source.columns.map(([x,z])=>`${x},${heights[z][x]-1},${z}`).sort();
      assert.deepEqual(Object.keys(entry.glyphPixels).sort(),addresses); assert(Object.values(entry.glyphPixels).every(n=>n>=100));
    }
    assets.set(file,entry);
  }
  return {manifest,assets};
}
async function decodeGrids(item, phase) {
  return item.locator(`.source62-operation-grids[data-phase="${phase}"] svg[data-view]`).evaluateAll(svgs => svgs.map(svg => ({
    name:svg.dataset.view,width:Number(svg.getAttribute("width")),height:Number(svg.getAttribute("height")),viewBox:svg.getAttribute("viewBox"),
    cells:[...svg.querySelectorAll("rect.stack-view-cell")].map(rect=>Object.fromEntries(["x","y","width","height"].map(name=>[name,Number(rect.getAttribute(name))])))
  })));
}
async function checkGrids(item, phase, expected, blank = false) {
  const actual = await decodeGrids(item,phase), specs = Object.entries(expected).map(([view,values])=>matrixSpec(view,values,!blank));
  assert.equal(actual.length,specs.length,`${phase} grid count`);
  for (let i=0;i<specs.length;i++) { validateGrid(actual[i],specs[i]); if (!blank && specs[i].name !== "위") movedControl({...actual[i]}); }
  return specs;
}
async function imageCheck(item, source, variant, phase, assets) {
  const selector = `.source62-operation-${phase === "before" ? "picture" : "after"} img`, image = item.locator(selector);
  assert.equal(await image.count(),1);
  const data = await image.evaluate(async img => { await img.decode(); return {src:img.currentSrc,w:img.naturalWidth,h:img.naturalHeight}; });
  const file = `${source.sourceItemId}-v${variant}-${phase}.png`;
  assert.equal(new URL(data.src).pathname.split("/").at(-1),file); assert(new URL(data.src).pathname.includes(`/${assetRoot}/`));
  assert.equal(data.w,1280); assert.equal(data.h,1040);
  const response = await item.page().request.get(data.src); assert(response.ok()); assert.equal(sha(await response.body()),assets.get(file).sha256);
}
async function checkItem(item, source, variant, level, phase, assets) {
  const expected = gridsFor(source,variant,level), isProblem = phase === "problem";
  if (isProblem) {
    await imageCheck(item,source,variant,"before",assets);
    assert.equal(await item.locator(".source62-operation-answer,.source62-operation-after,.source62-operation-label-answer").count(),0,"Student answer leak");
    await checkGrids(item,"given",expected.given); await checkGrids(item,"problem",expected.blank,true);
    assert.equal(await item.locator('.source62-operation-grids[data-phase="answer"]').count(),0);
    const prompt = await item.locator(".question-prompt,.type-preview-question,.solution-viewer-prompt").first().evaluate(el=>[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(" "));
    if (source.marked) { assert(prompt.includes(`쌓기나무 ${expected.model.total}개`)); assert(prompt.includes("검은색 쌓기나무 3개를 모두")); }
    if (source.add) { assert(prompt.includes("㉠ 위에 쌓기나무 2개, ㉡ 위에 쌓기나무 1개")); }
    if (!source.add && !source.marked) {
      assert(!/13개|14개|위.*변하지/.test(prompt)); assert(/각각 한 개씩 따로/.test(prompt));
      assert(!prompt.includes(expected.model.primary.join(", ")) && !prompt.includes(expected.model.secondary.join(", ")));
    }
  } else {
    const answer = item.locator(".source62-operation-answer"); assert.equal(await answer.count(),1);
    assert.equal(await answer.getAttribute("data-answer-source"),source.sourceItemId);
    await checkGrids(answer,"answer",expected.answer);
    assert.equal(await answer.locator('.source62-operation-grids[data-phase="given"],.source62-operation-grids[data-phase="problem"]').count(),0);
    if (source.add || source.marked) await imageCheck(answer,source,variant,"after",assets);
    else {
      assert.equal(await answer.locator("img").count(),0);
      const text = await answer.locator(".source62-operation-label-answer").innerText();
      const groups = level === 2 ? text.split(/\(1\)|\(2\)/).map(s=>s.trim()).filter(Boolean) : [text.trim()];
      const decoded = groups.map(s=>s.match(/[㉠-㉦]/g)||[]);
      assert.deepEqual(decoded,level === 2 ? [expected.model.primary,expected.model.secondary] : [expected.model.primary]);
      const wronglyFiltered = expected.model.trials.filter(t=>t.qualifies&&!t.changesTop).map(t=>t.label);
      assert.throws(()=>assert.deepEqual(decoded[0],wronglyFiltered),"TOP must not filter the original preservation set");
    }
  }
}
async function visibleLayout(root, typography = true) {
  const result = await root.evaluate((element,typography) => {
    const errors = [], overlaps = [], parts = [...element.querySelectorAll("img,svg[data-view],svg.source62-notched-grid")].filter(el=>el.getBoundingClientRect().width>0);
    const box = el => {const b=el.getBoundingClientRect();return {left:b.left,top:b.top,right:b.right,bottom:b.bottom,width:b.width,height:b.height};};
    const text = [];
    const walker = document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) {
      const node=walker.currentNode,owner=node.parentElement;
      if(!node.textContent.trim()||owner.closest("svg,[hidden]"))continue;
      const range=document.createRange();range.selectNodeContents(node);
      for(const r of range.getClientRects()) if(r.width>0&&r.height>0)text.push({text:node.textContent.trim(),owner,rect:{left:r.left,top:r.top,right:r.right,bottom:r.bottom}});
    }
    const contains=(a,b)=>b.left>=a.left-1&&b.right<=a.right+1&&b.top>=a.top-1&&b.bottom<=a.bottom+1;
    const collide=(a,b)=>a.left<b.right-.7&&a.right>b.left+.7&&a.top<b.bottom-.7&&a.bottom>b.top+.7;
    const bounds=box(element);
    const style=getComputedStyle(element),scrollingViewer=element.id==="solutionViewerContent" && ["auto","scroll"].includes(style.overflowY);
    const contentBounds=scrollingViewer ? {...bounds,top:bounds.top-element.scrollTop,bottom:bounds.top-element.scrollTop+element.scrollHeight} : bounds;
    for(const part of parts) {
      const scroller=[part.closest(".type-preview-question"),part.closest("#typePreviewPopover"),part.closest("#solutionViewerContent")]
        .find(el=>el && element.contains(el) && ["auto","scroll"].includes(getComputedStyle(el).overflowY));
      const frame=scroller ? box(scroller) : contentBounds;
      const allowed=scroller ? {...frame,top:frame.top-scroller.scrollTop,bottom:frame.top-scroller.scrollTop+scroller.scrollHeight} : contentBounds;
      const b=box(part);if(!contains(allowed,b))errors.push(`Part escapes its item: ${part.tagName} ${JSON.stringify({part:b,allowed,scroller:scroller?.id||null})}`);
      const glyphlessMission3=part.matches('.source62-m3-given img[data-glyphless="true"]');
      const tPatternPrefix=part.matches('.source62-t-pattern-given img,.source62-stair1-given img,.source62-notched-given img,.source62-notched-answer img');
      const sourceGlyphSize=tPatternPrefix ? 72*b.width/1600 : 28*b.width/640;
      if(part.tagName==="IMG" && !glyphlessMission3 && sourceGlyphSize<12)errors.push("Source glyph below 12px screen minimum");
      if(part.tagName==="IMG"&&(!part.complete||!part.naturalWidth||b.width<100))errors.push("Image missing or too small");
      for(const t of text)if(collide(b,t.rect))overlaps.push({part:part.tagName,text:t.text});
    }
    for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++)if(collide(box(parts[i]),box(parts[j])))errors.push("Pictures or grids overlap");
    if(typography)for(const el of element.querySelectorAll(".question-prompt,.type-preview-question,.solution-item > p,.solution-item header strong,.solution-item header span,.source62-operation-label-answer,.source62-operation-grids figcaption,.solution-viewer-solution,.solution-viewer-answer,.answer-key-page:has(.source62-operation-answer) .answer-key-grid span")) {
      const style=getComputedStyle(el);if(style.color!=="rgb(0, 0, 0)"||style.fontWeight!=="400")errors.push(`Non-normal black text: ${el.className||el.tagName}`);
    }
    return {errors,overlaps,overflow:document.documentElement.scrollWidth>innerWidth+1,bounds};
  },typography);
  assert.deepEqual(result.errors,[]);assert.deepEqual(result.overlaps,[]);assert(!result.overflow,"Horizontal viewport overflow");
  return result;
}
async function inventoryCheck(page,candidate) {
  await page.waitForFunction(()=>Array.isArray(window.HSE_SOURCE_GRADE6_STACK_OPERATION_QUESTIONS?.definitions)&&Array.isArray(window.HSE_SOURCE_INVENTORY_GRADE6?.items));
  const result=await page.evaluate(()=>({items:window.HSE_SOURCE_INVENTORY_GRADE6?.items,definitions:window.HSE_SOURCE_GRADE6_STACK_OPERATION_QUESTIONS?.definitions,
    baseline:window.__operationCandidateBaseline}));
  assert.deepEqual(result.definitions,SOURCES.map(({sourceItemId,key})=>({sourceItemId,key})));
  if(!candidate)assert.equal(result.baseline,undefined,"Actual inventory must not use a candidate overlay");
  for(const source of SOURCES) {
    const item=result.items.find(t=>t.sourceItemId===source.sourceItemId);assert(item);
    assert.equal(item.reviewLocked,false,candidate?"Candidate overlay did not apply":"Actual inventory remains locked; do not label this a learner release pass");
    assert.equal(item.generatorKey,source.key);assert.equal(item.verifiedVariantCount,3);assert.equal(item.answerVisualStatus,"verified");
  }
  if(candidate)for(const item of result.items.filter(i=>!SOURCES.some(s=>s.sourceItemId===i.sourceItemId))) {
    compareUnrelatedInventory(item,result.baseline.find(i=>i.sourceItemId===item.sourceItemId));
  }
  if(candidate)assert.deepEqual(result.items.map(i=>i.sourceItemId),result.baseline.map(i=>i.sourceItemId),"Candidate overlay added, removed, or reordered sources");
}
async function candidateOverlay(page,candidate) {
  if(!candidate)return;
  await page.route("**/source-inventory-grade6.js*",async route=>{
    // Candidate-only fixture: avoid a second simultaneous connection to the local static server.
    const body=read("source-inventory-grade6.js");
    await route.fulfill({status:200,contentType:"application/javascript",body:body+`\nwindow.__operationCandidateBaseline=JSON.parse(JSON.stringify(window.HSE_SOURCE_INVENTORY_GRADE6.items));
      ${JSON.stringify(SOURCES.map(({sourceItemId,key})=>({sourceItemId,key})))}.forEach(d=>{const i=window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId===d.sourceItemId);if(!i)throw new Error('Missing candidate');Object.assign(i,{reviewLocked:false,generatorKey:d.key,variant:0,answerVisualStatus:'verified',verifiedVariantCount:3,verifiedVariantTarget:3,generationMode:'fixed-verified-pool'});});`});
  });
}
async function printEvidence(page,source,offset,phase,output,evidence) {
  await page.evaluate(()=>{window.__operationPrints=0;window.print=()=>window.__operationPrints++;});
  await page.locator("#printMenuButton").click();await page.locator(`button[data-print-mode="${phase}"]`).click();
  await page.waitForFunction(()=>window.__operationPrints===1);
  await page.emulateMedia({media:"print"});await page.evaluate(()=>document.fonts.ready);
  const selector=phase==="problem"?"#problemView .question-item":phase==="solution"?"#solutionView .solution-item":"#answerKeyView .answer-key-visuals > figure";
  const items=await page.locator(selector).all();assert.equal(items.length,3);
  const proofs=[];
  for(let variant=0;variant<3;variant++) {
    await visibleLayout(items[variant]);
    const expected=gridsFor(source,variant,offset+1);
    proofs.push(await items[variant].evaluate((el,{variant,phase,source,expected,names})=>({
      variant,number:variant+1,
      images:[...el.querySelectorAll("img")].map(img=>({file:new URL(img.currentSrc).pathname.split("/").at(-1),width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height})),
      grids:Object.entries(phase==="problem"?{given:expected.given,problem:expected.blank}:{answer:expected.answer}).flatMap(([stage,views])=>Object.entries(views).map(([view,values])=>({name:names[view],stage,filled:stage!=="problem",values}))),
      textRuns:[...el.querySelectorAll(phase==="problem"?".question-prompt":"p,.source62-operation-label-answer")].map(p=>[...p.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(" ").trim()).filter(Boolean)
    }),{variant,phase,source:source.sourceItemId,expected:JSON.parse(JSON.stringify(expected)),names}));
  }
  const file=`${source.sourceItemId}-d${offset}-${phase}-a4.pdf`;
  await page.pdf({path:path.join(output,file),format:"A4",printBackground:true,preferCSSPageSize:true});
  await page.screenshot({path:path.join(output,file.replace(".pdf","-print.png")),fullPage:true});
  evidence.pdfs.push({file,sourceItemId:source.sourceItemId,offset,level:offset+1,phase,items:proofs});
  await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
}
async function learnerState(context,source,offset,width,options,evidence,assets) {
  const page=await context.newPage();await page.setViewportSize({width,height:900});
  page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(45000);const errors=[];page.on("pageerror",e=>errors.push(e.message));
  try {
    await candidateOverlay(page,options.candidate);
    const url=new URL(options.base);url.searchParams.set("type",source.sourceItemId);url.searchParams.set("review","1");url.searchParams.set("difficulty",String(offset));
    await page.goto(url.href,{waitUntil:"domcontentloaded"});await inventoryCheck(page,options.candidate);
    await page.locator("#worksheet:not([hidden])").waitFor();await page.evaluate(()=>document.fonts.ready);
    const problems=await page.locator("#problemView .question-item").all();assert.equal(problems.length,3);
    for(let variant=0;variant<3;variant++){await checkItem(problems[variant],source,variant,offset+1,"problem",assets);await visibleLayout(problems[variant]);}
    await page.screenshot({path:path.join(options.output,`${source.sourceItemId}-d${offset}-${width}-problem.png`),fullPage:true});
    // Student print evidence comes first, before solution, viewer, or picker checks.
    if(width===1280)await printEvidence(page,source,offset,"problem",options.output,evidence);
    await page.locator("#solutionTab").click();
    const solutions=await page.locator("#solutionView .solution-item").all();assert.equal(solutions.length,3);
    for(let variant=0;variant<3;variant++){await checkItem(solutions[variant],source,variant,offset+1,"answer",assets);await visibleLayout(solutions[variant]);}
    await page.screenshot({path:path.join(options.output,`${source.sourceItemId}-d${offset}-${width}-solution.png`),fullPage:true});
    if(width===1280)await printEvidence(page,source,offset,"solution",options.output,evidence);
    await page.evaluate(()=>{window.__operationPrints=0;window.print=()=>window.__operationPrints++;});
    await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__operationPrints===1);
    const keys=await page.locator("#answerKeyView .answer-key-visuals > figure").all();assert.equal(keys.length,3);
    for(let variant=0;variant<3;variant++){await checkItem(keys[variant],source,variant,offset+1,"answer",assets);await visibleLayout(keys[variant]);}
    await page.screenshot({path:path.join(options.output,`${source.sourceItemId}-d${offset}-${width}-answer-key.png`),fullPage:true});
    await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
    if(width===1280)await printEvidence(page,source,offset,"answer-key",options.output,evidence);
    await page.locator("#solutionViewerButton").click();
    for(let variant=0;variant<3;variant++) {
      await page.locator(`#solutionViewerJump [data-solution-index="${variant}"]`).click();
      const viewer=page.locator("#solutionViewerContent");await checkItem(viewer,source,variant,offset+1,"answer",assets);
      await imageCheck(viewer,source,variant,"before",assets);await visibleLayout(viewer);
      await viewer.screenshot({path:path.join(options.output,`${source.sourceItemId}-d${offset}-${width}-viewer-v${variant}.png`)});
    }
    await page.keyboard.press("Escape");assert(await page.locator("#solutionViewer").isHidden());
    const checks=await page.evaluate(()=>{
      const api=window.HSE_GENERATORS,definitions=window.HSE_SOURCE_GRADE6_STACK_OPERATION_QUESTIONS.definitions;
      return definitions.map(d=>({key:api.generatorKey({...d,generatorKey:d.key,reviewLocked:true}),locked:api.generate({...d,generatorKey:d.key,reviewLocked:true},1,0,1,0)}));
    });assert(checks.every(check=>check.key===""&&check.locked===null));assert.deepEqual(errors,[]);
    evidence.states.push({sourceItemId:source.sourceItemId,offset,width,variants:3,fullCellPositionsMatched:true,movedCellNegative:true,viewerVariants:3,studentAnswerSafe:true});
  } finally {await page.close();}
}
async function pickerState(context,source,width,options,evidence,assets) {
  const page=await context.newPage();await page.setViewportSize({width,height:900});page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(45000);
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  try {
    await candidateOverlay(page,options.candidate);await page.goto(options.base,{waitUntil:"domcontentloaded"});await inventoryCheck(page,options.candidate);
    await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
    const types=await page.evaluate(()=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(t=>t.types))));
    for(const other of SOURCES){const type=types.find(t=>t.sourceItemId===other.sourceItemId);assert(type);assert(await page.locator(`input[data-type-id="${type.id}"]`).isEnabled());}
    const type=types.find(t=>t.sourceItemId===source.sourceItemId),row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);
    await row.locator("input").check();await row.locator(".tree-type-copy").click();
    const popover=page.locator("#typePreviewPopover");await imageCheck(popover,source,0,"before",assets);await visibleLayout(popover);
    await popover.screenshot({path:path.join(options.output,`${source.sourceItemId}-${width}-picker.png`)});
    await popover.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("12");await page.locator("#generateButton").click();
    const problems=await page.locator("#problemView .question-item").all();assert.equal(problems.length,3,"Finite pools must not repeat to fill twelve requested items");
    for(let variant=0;variant<3;variant++)await checkItem(problems[variant],source,variant,1,"problem",assets);
    assert.deepEqual(errors,[]);evidence.picker.push({sourceItemId:source.sourceItemId,width,requested:12,generated:3,crossSourceAvailable:3});
  } finally {await page.close();}
}
async function runBrowser() {
  selfTest();const {manifest,assets}=preflight();
  const runtimeFiles=["index.html","app.js","curriculum.js","generators.js","source-inventory-grade6.js","source-6-2-stack-operation-questions.js","source-6-2-stack-operation-questions.css","source-6-2-stack-operation-question-contracts.js","styles.css","worksheet-tools.css"];
  const runtimeHashes=()=>Object.fromEntries(runtimeFiles.map(file=>[file,sha(read(file).replaceAll("\r\n","\n"))]));
  const learnerRuntimeHashes=runtimeHashes();
  const output=process.env.HSE_SCREENSHOT_DIR;assert(output&&/^E:[/\\]/i.test(output),"Set HSE_SCREENSHOT_DIR to an absolute E: evidence folder");
  assert(!path.resolve(output).toLowerCase().startsWith(__dirname.toLowerCase()+path.sep),"Evidence must not be written into the question bank");
  const base=new URL(process.env.HSE_BASE_URL||"http://127.0.0.1:8898/hselementary/question-bank/");
  assert(["127.0.0.1","localhost","[::1]"].includes(base.hostname)&&["http:","https:"].includes(base.protocol),"Only a local learner server is allowed");
  const sources=process.env.HSE_OPERATION_SOURCE?SOURCES.filter(s=>s.sourceItemId===process.env.HSE_OPERATION_SOURCE):SOURCES;
  assert(sources.length,"Invalid HSE_OPERATION_SOURCE");
  const options={base:base.href,output,candidate:process.env.HSE_OPERATION_CANDIDATE==="1",pickerOnly:process.env.HSE_OPERATION_PICKER_ONLY==="1",printOnly:process.env.HSE_OPERATION_PRINT_ONLY==="1"};
  assert(!(options.pickerOnly&&options.printOnly),"Choose picker-only or print-only, not both");
  const resultFile=options.pickerOnly ? "operation-picker-result.json" : "operation-learner-result.json";
  const executable=process.env.HSE_CHROMIUM_EXECUTABLE||["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(f=>fs.existsSync(f));
  assert(executable&&fs.existsSync(executable),"Set HSE_CHROMIUM_EXECUTABLE to the existing Chrome executable; no browser install is attempted");
  const {chromium}=require("playwright");fs.mkdirSync(output,{recursive:true});
  const evidence={schemaVersion:1,candidateOverlay:options.candidate,releaseApproval:false,assetRoot,assetManifestSha256:sha(read(`${assetRoot}/manifest.json`)),assets:manifest.assets,
    sourceIds:sources.map(s=>s.sourceItemId),learnerRuntimeHashes,pickerOnly:options.pickerOnly,printOnly:options.printOnly,states:[],pdfs:[],picker:[],limitations:["Canonical PNG geometry/own-face ink proof is a separate parent audit; hash identity is checked here.","160dpi PDF renders require human eye review and are not automatic teaching approval."]};
  if(process.env.HSE_OPERATION_RESUME==="1") {
    assert(!options.pickerOnly,"Resume requires learner and print evidence");
    const priorBytes=fs.readFileSync(path.join(output,resultFile)),prior=JSON.parse(priorBytes);
    assert.equal(prior.status,"failed");assert.match(prior.error,/page.goto: Timeout/);
    for(const key of ["candidateOverlay","assetManifestSha256","sourceIds","learnerRuntimeHashes","pickerOnly","printOnly"])
      assert.deepEqual(prior[key],evidence[key],`Cannot reuse changed evidence: ${key}`);
    const order=(options.printOnly?[1280]:[1280,390,320]).flatMap(width=>sources.flatMap(source=>[-1,0,1].map(offset=>({sourceItemId:source.sourceItemId,offset,width}))));
    assert.deepEqual(prior.states.map(({sourceItemId,offset,width})=>({sourceItemId,offset,width})),order.slice(0,prior.states.length),"Only a completed prefix can resume");
    assert(prior.states.every(s=>s.variants===3&&s.fullCellPositionsMatched&&s.studentAnswerSafe&&s.viewerVariants===3));
    assert.equal(prior.pdfs.length,prior.states.filter(s=>s.width===1280).length*3);
    const pickerOrder=sources.flatMap(source=>[1280,390].map(width=>({sourceItemId:source.sourceItemId,width})));
    assert.deepEqual(prior.picker.map(({sourceItemId,width})=>({sourceItemId,width})),pickerOrder.slice(0,prior.picker.length),"Only a completed picker prefix can resume");
    assert(prior.picker.every(p=>p.requested===12&&p.generated===3&&p.crossSourceAvailable===3));
    if(prior.picker.length)assert.equal(prior.states.length,order.length,"Picker evidence requires all learner states");
    const backup="operation-learner-navigation-failure.json";
    fs.writeFileSync(path.join(output,backup),priorBytes,{flag:"wx"});
    Object.assign(evidence,{states:prior.states,pdfs:prior.pdfs,picker:prior.picker,resumedFrom:{file:backup,sha256:sha(priorBytes),completedStates:prior.states.length,completedPicker:prior.picker.length}});
  }
  const browser=await chromium.launch({headless:true,executablePath:executable});
  try {
    const context=await browser.newContext();
    await context.route("**/*",route=>new URL(route.request().url()).origin===base.origin?route.continue():route.abort("blockedbyclient"));
    if(!options.pickerOnly)for(const width of options.printOnly ? [1280] : [1280,390,320])for(const source of sources)for(const offset of [-1,0,1]) {
      if(evidence.states.some(s=>s.sourceItemId===source.sourceItemId&&s.offset===offset&&s.width===width))continue;
      await learnerState(context,source,offset,width,options,evidence,assets);
    }
    for(const source of sources)for(const width of [1280,390]) {
      if(evidence.picker.some(p=>p.sourceItemId===source.sourceItemId&&p.width===width))continue;
      await pickerState(context,source,width,options,evidence,assets);
    }
    assert.equal(evidence.pdfs.length,options.pickerOnly ? 0 : sources.length*9);assert.equal(evidence.states.length,options.pickerOnly ? 0 : sources.length*(options.printOnly ? 3 : 9));assert.equal(evidence.picker.length,sources.length*2);
    assert.deepEqual(runtimeHashes(),learnerRuntimeHashes,"Learner files changed during the browser audit");
    preflight();fs.writeFileSync(path.join(output,resultFile),JSON.stringify({...evidence,status:"passed"},null,2)+"\n");
    console.log(`PASS: ${evidence.states.length} learner states, ${evidence.pdfs.length} A4 PDFs, ${evidence.picker.length} picker flows; mode=${options.candidate?"candidate-only":"actual-inventory"}. Run the PDF audit and inspect its 160dpi PNGs.`);
  } catch(error) {
    fs.writeFileSync(path.join(output,resultFile),JSON.stringify({...evidence,status:"failed",error:error.stack},null,2)+"\n");throw error;
  } finally {await browser.close();}
}
module.exports={SOURCES,oracle,gridsFor,matrixSpec,validateGrid,selfTest,preflight,visibleLayout};
if(require.main===module) {
  const mode=process.argv[2];
  if(mode==="--self-test")selfTest();
  else if(mode==="--preflight"){selfTest();preflight();console.log("PREFLIGHT PASS: 15 V3 PNGs, fixed fixture addresses, hashes and runtime provenance. No files written.");}
  else if(mode)throw new Error("Use --self-test, --preflight, or no argument for the actual learner audit");
  else runBrowser().catch(error=>{console.error(error);process.exitCode=1;});
}
