"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const baseContracts=require("./source-6-2-painted-stacks-contracts.js"),mission3=process.env.HSE_PAINT_MISSION3==="1",mission5=process.env.HSE_PAINT_MISSION5==="1",mission6=process.env.HSE_PAINT_MISSION6==="1",example2=process.env.HSE_PAINT_EXAMPLE2==="1",example3=process.env.HSE_PAINT_EXAMPLE3==="1",figure=mission3||mission5||mission6||example2||example3,{visibleLayout}=require("./source-6-2-stack-operation-learner-audit.js");
assert([mission3,mission5,mission6,example2,example3].filter(Boolean).length<=1);
function coloredAnswerGroups(q){const groups=q.model.groupedLayers[q.red?"red":"painted"];return q.secondary?[...groups,...q.model.groupedLayers.red.map(group=>({...group,matrix:group.matrix.map((row,z)=>row.map((n,x)=>n===null?null:Number(n>0&&q.model.layerGrids.blue[group.layers[0]-1][z][x]>0)))}))]:groups;}
const contracts=example3?{generate(id,variant,level){const q=require("./source-6-2-painted-example3-contracts.js").generate(id,variant,level);return {...q,promptText:q.prompt,histogram:q.model.histograms[q.red?"red":"painted"],faceRows:[],answerGroups:coloredAnswerGroups(q)};}}:example2?{generate(id,variant,level){assert.equal(id,"6-2-u3-e3-example-2");const q=require("./source-6-2-painted-example2-contracts.js").generate(variant,level);return {...q,promptText:q.prompt,histogram:q.model.histogram,faceRows:[]};}}:mission6?{generate(id,variant,level){const q=require("./source-6-2-painted-mission6-contracts.js").generate(id,variant,level);return {...q,promptText:q.prompt,histogram:q.model.histogram,faceRows:[]};}}:mission5?{generate(id,variant,level){const q=require("./source-6-2-painted-mission5-contracts.js").generate(id,variant,level);return {...q,promptText:q.prompt,histogram:q.model.histogram,faceRows:[]};}}:mission3 ? {generate(id,variant,level){assert.equal(id,"6-2-u3-e3-mission-3");const q=require("./source-6-2-painted-mission3-contracts.js").generate(variant,level);return {...q,promptText:q.prompt,histogram:q.model.histogram,faceRows:[]};}} : baseContracts;
const definitions=[{id:"6-2-u3-e3-example-1",key:"sourceGrade6SecondSpaceE3PaintedFaceClasses"},{id:"6-2-u3-e3-mission-2",key:"sourceGrade6SecondSpaceE3NotchedPaintedFaceClasses"},{id:"6-2-u3-e3-mission-4",key:"sourceGrade6SecondSpaceE3AllPaintedArea"}];
if(process.env.HSE_PAINT_MISSION1==="1")definitions.splice(0,definitions.length,{id:"6-2-u3-e3-mission-1",key:"sourceGrade6SecondSpaceE3UnpaintedInnerCubes"});
if(mission3)definitions.splice(0,definitions.length,{id:"6-2-u3-e3-mission-3",key:"sourceGrade6SecondSpaceE3PaintedFourThree"});
if(mission5)definitions.splice(0,definitions.length,{id:"6-2-u3-e3-mission-5-1",key:"sourceGrade6SecondSpaceE3PaintedVolumeInverse",label:"두 면만 칠한 조각의 넓이로 입체의 부피 구하기"},{id:"6-2-u3-e3-mission-5-2",key:"sourceGrade6SecondSpaceE3PaintedSurfaceInverse",label:"두 면만 칠한 조각의 넓이로 입체의 겉넓이 구하기"});
if(mission6)definitions.splice(0,definitions.length,{id:"6-2-u3-e3-mission-6-1",key:"sourceGrade6SecondSpaceE3PaintedOneFace",label:"한 면만 색칠한 쌓기나무 수 구하기"},{id:"6-2-u3-e3-mission-6-2",key:"sourceGrade6SecondSpaceE3PaintedNoFace",label:"색칠하지 않은 쌓기나무 수 구하기"});
if(example2)definitions.splice(0,definitions.length,{id:"6-2-u3-e3-example-2",key:"sourceGrade6SecondSpaceE3PaintBeforeRemoval",label:"색칠한 뒤 빼낸 쌓기나무의 두 면 색칠 수 구하기"});
if(example3)definitions.splice(0,definitions.length,{id:"6-2-u3-e3-example-3-1",key:"sourceGrade6SecondSpaceE3ExactlyTwoRed",label:"빨간색이 두 면에 칠해진 쌓기나무 수 구하기"},{id:"6-2-u3-e3-example-3-2",key:"sourceGrade6SecondSpaceE3AtLeastOneColor",label:"한 면이라도 칠해진 쌓기나무 개수 구하기"});
const read=file=>fs.readFileSync(path.join(__dirname,file),"utf8"),sha=value=>crypto.createHash("sha256").update(value).digest("hex");
const runtime=["index.html","app.js","styles.css","curriculum.js","generators.js","source-inventory-grade6.js","source-6-2-painted-stacks-models.js","source-6-2-painted-stacks-contracts.js","source-6-2-painted-stacks-presentation.js","source-6-2-painted-stacks-questions.js","source-6-2-painted-stacks-questions.css"];
if(mission3)runtime.push("source-6-2-painted-mission3-models.js","source-6-2-painted-mission3-contracts.js","source-6-2-painted-mission3-presentation.js","source-6-2-painted-mission3-questions.js","source-6-2-painted-mission3-questions.css");
if(mission5)runtime.push("source-6-2-painted-mission3-presentation.js","source-6-2-painted-mission3-questions.css","source-6-2-painted-mission5-scale.js","source-6-2-painted-mission5-models.js","source-6-2-painted-mission5-contracts.js","source-6-2-painted-mission5-presentation.js","source-6-2-painted-mission5-questions.js");
if(mission6)runtime.push("source-6-2-painted-mission3-presentation.js","source-6-2-painted-mission3-questions.css","source-6-2-painted-mission6-models.js","source-6-2-painted-mission6-contracts.js","source-6-2-painted-mission6-presentation.js","source-6-2-painted-mission6-questions.js");
if(example2)runtime.push("source-6-2-painted-mission3-presentation.js","source-6-2-painted-removal.js","source-6-2-painted-example2-models.js","source-6-2-painted-example2-contracts.js","source-6-2-painted-example2-presentation.js","source-6-2-painted-example2-questions.js","source-6-2-painted-example2-questions.css");
if(example3)runtime.push("source-6-2-painted-mission3-presentation.js","source-6-2-painted-color-classifier.js","source-6-2-painted-example3-models.js","source-6-2-painted-example3-contracts.js","source-6-2-painted-example3-presentation.js","source-6-2-painted-example3-questions.js","source-6-2-painted-example3-questions.css");
const hashes=()=>Object.fromEntries(runtime.map(file=>[file,sha(read(file))]));
async function inspect(item,id,variant,level,mode,poison=false){
  const q=contracts.generate(id,variant,level),result=await item.evaluate((root,{q,mode,poison})=>{
    const errors=[],model=q.model;
    if(/<\/?span\b/.test(root.textContent))errors.push("HTML markup leaked as answer text");
    function grid(svg,expected){
      const matrix=svg.getScreenCTM(),ctx=document.createElement("canvas").getContext("2d"),seen=new Set();
      for(const cell of svg.querySelectorAll("g[data-x]")){
        const x=+cell.dataset.x,z=+cell.dataset.z,value=+cell.dataset.value,rect=cell.querySelector("rect"),text=cell.querySelector("text");
        if(poison){text.textContent="9";poison=false;}
        const style=getComputedStyle(text),r=rect.getBoundingClientRect();
        if(expected[z]?.[x]===null || expected[z]?.[x]!==value || text.textContent!==String(value) || seen.has(`${x},${z}`))errors.push("Wrong source value or cell address");seen.add(`${x},${z}`);
        if(+rect.getAttribute("x")!==8+x*28 || +rect.getAttribute("y")!==8+z*28 || +rect.getAttribute("width")!==28 || +rect.getAttribute("height")!==28)errors.push("Wrong cell geometry");
        const precision=64;ctx.font=`${style.fontStyle} ${style.fontWeight} ${parseFloat(style.fontSize)*precision}px ${style.fontFamily}`;const raw=ctx.measureText(text.textContent),m=Object.fromEntries(["width","actualBoundingBoxLeft","actualBoundingBoxRight","actualBoundingBoxAscent","actualBoundingBoxDescent"].map(key=>[key,raw[key]/precision]));
        const pen=text.x.baseVal.getItem(0).value-m.width/2,baseline=text.y.baseVal.getItem(0).value,ink={left:(pen-m.actualBoundingBoxLeft)*matrix.a+matrix.e,right:(pen+m.actualBoundingBoxRight)*matrix.a+matrix.e,top:(baseline-m.actualBoundingBoxAscent)*matrix.d+matrix.f,bottom:(baseline+m.actualBoundingBoxDescent)*matrix.d+matrix.f};
        if(!Object.values(ink).every(Number.isFinite) || ink.left<r.left+1 || ink.right>r.right-1 || ink.top<r.top+1 || ink.bottom>r.bottom-1)errors.push("Digit outside owning square");
        if(Math.abs((ink.left+ink.right)/2-(r.left+r.right)/2)>.6 || Math.abs((ink.top+ink.bottom)/2-(r.top+r.bottom)/2)>.6)errors.push("Digit not centered");
        if(style.fill!=="rgb(0, 0, 0)" || style.fontWeight!=="400" || parseFloat(style.fontSize)*matrix.a<12)errors.push("Wrong digit typography");
      }
      if(seen.size!==expected.flat().filter(value=>value!==null).length)errors.push("Missing source or answer cell");
    }
    if(mode==="problem"){
      const svg=root.querySelector('.source62-painted-given svg[data-role="height"]');
      if(q.sourceItemId.startsWith("6-2-u3-e3-example-3-")){
        const image=root.querySelector(".source62-example3-given img");if(poison&&image){image.dataset.variant="9";poison=false;}
        if(!image||!image.complete||image.naturalWidth!==1280||image.naturalHeight!==1120||image.dataset.glyphless!=="true"||+image.dataset.variant!==q.variant||!image.currentSrc.endsWith(`/source-6-2-painted-example3/v${q.variant}-given.png`))errors.push("Wrong or missing source 3D picture");
        for(const clause of [`${model.cells.length}개의 쌓기나무`,"뒤쪽과 왼쪽","파란색","보이는 5개의 면","빨간색","바닥면은 칠하지 않았습니다"])if(!root.textContent.includes(clause))errors.push("Missing painted colour source condition");
        if(q.level!==0&&root.textContent.includes(`쌓기나무는 모두 ${model.height}층`))errors.push("Easy height clue leaked into source difficulty");
        if(root.querySelector("svg,table,canvas"))errors.push("Answer-bearing grid in question view");
      }else if(q.sourceItemId==="6-2-u3-e3-example-2"){
        const images=[...root.querySelectorAll(".source62-example2-given img")];if(poison&&images[0]){images[0].dataset.phase="after";poison=false;}
        if(images.length!==2||images.some((image,i)=>{const phase=["before","after"][i];return !image.complete||image.naturalWidth!==1280||image.naturalHeight!==1040||image.dataset.glyphless!=="true"||+image.dataset.variant!==q.variant||image.dataset.phase!==phase||!image.currentSrc.endsWith(`/v${q.variant}-${phase}.png`);}))errors.push("Wrong or missing source 3D picture");
        for(const clause of ["밑면을 포함한","바닥부터 빈틈없이","빼낸 뒤에는 다시 색칠하지 않았습니다"])if(!root.textContent.includes(clause))errors.push("Missing paint-before-removal condition");
        if(q.level!==0&&root.textContent.includes(`빼내기 전 두 면에만 페인트가 칠해진 쌓기나무는 ${model.before.histogram[2]}개`))errors.push("Easy clue leaked into source difficulty");
        if(root.querySelector("svg,table,canvas"))errors.push("Answer-bearing grid in question view");
      }else if(q.sourceItemId==="6-2-u3-e3-mission-3"){
        const image=root.querySelector(".source62-m3-given img");if(poison && image){image.dataset.variant="9";poison=false;}
        if(!image || !image.complete || image.naturalWidth!==1280 || image.naturalHeight!==860 || image.dataset.glyphless!=="true" || +image.dataset.variant!==q.variant || !image.currentSrc.endsWith(`/v${q.variant}-given.png`))errors.push("Wrong or missing source 3D picture");
        for(let y=0;y<3;y++)if(!root.textContent.includes(`${y+1}층에 ${model.layerCounts[y]}개`))errors.push("Wrong source layer count");
        if(!root.textContent.includes("바닥 부분은 색칠하지 않습니다"))errors.push("Missing unpainted ground condition");
        if(q.level!==0 && root.textContent.includes(`㉮는 ${model.A}입니다`))errors.push("Easy clue leaked into source difficulty");
      }else if(q.sourceItemId.startsWith("6-2-u3-e3-mission-5-")){
        const image=root.querySelector(".source62-m5-given img");if(poison&&image){image.dataset.variant="9";poison=false;}
        if(!image||!image.complete||image.naturalWidth!==1280||image.naturalHeight!==860||image.dataset.glyphless!=="true"||+image.dataset.variant!==q.variant||!image.currentSrc.endsWith("/source-6-2-painted-mission5/source-given.png"))errors.push("Wrong or missing source 3D picture");
        if(!root.textContent.includes("쌓기나무 35개")||!root.textContent.includes("밑면을 제외")||!root.textContent.includes("허물었습니다")||!root.textContent.includes(String(model.areaOfExactlyTwoPaintedFaces)))errors.push("Missing inverse painted source condition");
        if(q.level!==0&&root.textContent.includes("두 면에만 색칠된 쌓기나무는 8개"))errors.push("Easy clue leaked into source difficulty");
        if(root.querySelector("svg,table,canvas"))errors.push("Invented learner clue diagram");
      }else if(q.sourceItemId.startsWith("6-2-u3-e3-mission-6-")){
        const image=root.querySelector(".source62-m6-given img");if(poison&&image){image.dataset.variant="9";poison=false;}
        if(!image||!image.complete||image.naturalWidth!==1280||image.naturalHeight!==1120||image.dataset.glyphless!=="true"||+image.dataset.variant!==q.variant||!image.currentSrc.endsWith(`/source-6-2-painted-mission6/v${q.variant}-given.png`))errors.push("Wrong or missing source 3D picture");
        if(!root.textContent.includes(`쌓기나무 ${model.cells.length}개`)||!root.textContent.includes("밑면을 포함하여 겉면")||!root.textContent.includes("낱개의 쌓기나무"))errors.push("Missing Mission6 paint-before-separation conditions");
        if(q.level!==0&&root.textContent.includes(`모두 ${model.height}층으로`))errors.push("Easy height clue leaked into source difficulty");
        if(root.querySelector("svg,table,canvas"))errors.push("Invented learner clue diagram");
      }else if(model.kind==="unpainted-inner-cubes"){
        if(poison){root.insertAdjacentHTML("afterbegin","<b>4×4×4</b>");poison=false;}
        if(root.querySelector("svg,table,img,canvas"))errors.push("An absent source diagram was invented");
        if(/\d+\s*[×x]\s*\d+\s*[×x]\s*\d+/.test(root.textContent))errors.push("Per-edge cube clue leaked in the question title");
        if(!root.textContent.includes(`쌓기나무 ${model.cells.length}개`) || !root.textContent.includes("바닥면을 포함한 모든 겉면") || !root.textContent.includes("다시 모두 떼어"))errors.push("Cube source conditions missing");
      }else if(!svg)errors.push("Missing source height drawing");else grid(svg,model.heights.map(row=>row.map(h=>h || null)));
      if(root.querySelector(".source62-painted-answer"))errors.push("Student answer leak");
      if(q.level===0 || model.kind!=="painted-face-counts"){
        if(root.querySelector(".source62-painted-histogram"))errors.push("Unexpected classification table");
      }else{const cells=[...root.querySelectorAll('.source62-painted-histogram td')];if(cells.length!==6 || cells.some(cell=>cell.textContent.trim()))errors.push("Student table filled with answers");}
      if(q.sourceItemId.endsWith("mission-4") && root.querySelectorAll('g[data-direction]').length!==2)errors.push("Missing original front/side arrows");
    }else{
      const layers=[...root.querySelectorAll('.source62-painted-answer svg[data-role="painted-faces"],.source62-painted-answer svg[data-role="red-painted-faces"],.source62-painted-answer svg[data-role="mixed-colors"]')];
      if(q.sourceItemId.startsWith("6-2-u3-e3-example-3-")){
        if(layers.length!==q.answerGroups.length)errors.push("Missing painted colour answer group");
        layers.forEach((svg,index)=>{const group=q.answerGroups[index];if(+svg.dataset.layer!==group.layers[0]||svg.closest("figure").dataset.sourceLayers!==group.layers.join(","))errors.push("Wrong colour layer grouping");grid(svg,group.matrix);});
        if(!root.querySelector(".source62-example3-legend")?.textContent.includes(q.red?"빨간색 면 수":"빨간색·파란색을 합친 면 수"))errors.push("Missing colour legend");
        if(q.red&&layers.slice(0,2).some(svg=>svg.dataset.role!=="red-painted-faces"||!svg.getAttribute("aria-label").includes("빨간색 면 수")))errors.push("Wrong red-only accessible label");
        if(q.secondary&&layers.slice(2).some(svg=>svg.dataset.role!=="mixed-colors"||!svg.getAttribute("aria-label").includes("모두 있는 칸은 1")))errors.push("Wrong mixed-colour accessible label");
      }else if(q.sourceItemId.startsWith("6-2-u3-e3-mission-6-")){
        if(layers.length!==model.groupedLayers.length)errors.push("Missing grouped answer layer");
        layers.forEach((svg,index)=>{const group=model.groupedLayers[index];if(+svg.dataset.layer!==group.layers[0]||svg.closest("figure").dataset.sourceLayers!==group.layers.join(","))errors.push("Wrong repeated layer grouping");grid(svg,group.matrix);});
      }else{if(layers.length!==model.layerGrids.length)errors.push("Missing answer layer");layers.forEach((svg,y)=>{if(+svg.dataset.layer!==y+1)errors.push("Wrong layer order");grid(svg,model.layerGrids[y]);});}
      if(model.kind==="painted-face-counts")for(const [k,n] of q.histogram.entries())if(root.querySelector(`.source62-painted-answer td[data-face-count="${k}"]`)?.textContent!==`${n}개`)errors.push("Wrong painted-face classification");
      const counts=[...root.querySelectorAll('.source62-painted-directions tbody td')].map(cell=>cell.textContent);
      if(JSON.stringify(counts)!==JSON.stringify(model.kind!=="painted-surface-area" ? [] : q.faceRows.map(row=>`${row.count}개`)))errors.push("Wrong independent face direction totals");
    }
    for(const group of root.querySelectorAll(".source62-painted-measure")){
      const unit=group.querySelector(".math-unit"),first=group.firstChild;if(!unit || first?.nodeType!==3){errors.push("Missing numeric area group");continue;}
      const range=document.createRange();range.selectNodeContents(first);const a=range.getBoundingClientRect(),b=unit.getBoundingClientRect();
      if(a.bottom<=b.top || a.top>=b.bottom)errors.push("Area value and unit on different lines");
    }
    if(model.kind==="unpainted-inner-cubes" && mode==="solution"){
      const expected=[`${model.heights.length}×${model.heights.length}×${model.heights.length}=${model.cells.length}`,`${model.heights.length}-2=${model.heights.length-2}개`,`${model.heights.length-2}×${model.heights.length-2}×${model.heights.length-2}=${q.answer}개`];
      if(q.secondary)expected.push(`${model.heights.length-2}×${model.heights.length-2}개`,`${model.heights.length-2}×${model.heights.length-2}×6=${q.secondary.answer}개`);
      const formulae=[...root.querySelectorAll(".math-inline-expression")];
      if(JSON.stringify(formulae.map(f=>f.textContent))!==JSON.stringify(expected))errors.push("Missing or incorrect solution equation");
      for(const formula of formulae){const range=document.createRange();range.selectNodeContents(formula);if(range.getClientRects().length!==1)errors.push("Solution equation broken across lines");}
    }
    if(q.sourceItemId==="6-2-u3-e3-mission-3"){
      const formula=mode==="problem" ? "10×㉮+㉯" : `10×${model.A}+${model.B}=${model.answer}`;
      if(mode!=="answer-key"){
        const expected=mode==="problem" ? [formula] : [formula,`㉮=${model.A}`,`㉯=${model.B}`];
        const matches=[...root.querySelectorAll(".math-inline-expression")].filter(f=>expected.includes(f.textContent));
        if(matches.length<1)errors.push("Missing source or solution equation");
        for(const formula of matches){const range=document.createRange();range.selectNodeContents(formula);if(range.getClientRects().length!==1)errors.push("Mission3 equation broken across lines");}
        if(expected.some(value=>!matches.some(f=>f.textContent===value)))errors.push("Missing atomic variable binding");
      }
    }
    if((q.sourceItemId.startsWith("6-2-u3-e3-mission-5-")&&mode!=="answer-key")||(mode==="solution"&&q.solutionEquations?.length)){
      const normalize=s=>s.replace(/\s+/g,"").replace(/²/g,"2").replace(/³/g,"3");
      const reference=document.createElement("div");reference.innerHTML=mode==="solution"?q.solution:q.prompt;
      const expected=[...reference.querySelectorAll(".math-inline-expression")].map(f=>normalize(f.textContent)),actual=[...root.querySelectorAll(".math-inline-expression")];
      if(expected.some(value=>!actual.some(f=>normalize(f.textContent)===value)))errors.push("Missing inverse source equation");
      for(const formula of actual){const r=formula.getBoundingClientRect();if(formula.getClientRects().length!==1||getComputedStyle(formula).whiteSpace!=="nowrap")errors.push("Inverse equation can break across lines");const range=document.createRange();range.selectNodeContents(formula);for(const c of range.getClientRects())if(c.left<r.left-.5||c.right>r.right+.5||c.top<r.top-3||c.bottom>r.bottom+3)errors.push("Inverse formula content outside atomic box");}
    }
    if(mode!=="problem"){const header=root.querySelector("header strong");if(header){const parent=getComputedStyle(header);for(const span of header.querySelectorAll("span")){const style=getComputedStyle(span);if([style.paddingTop,style.paddingRight,style.paddingBottom,style.paddingLeft].some(n=>parseFloat(n)!==0)||style.fontSize!==parent.fontSize||style.fontWeight!==parent.fontWeight)errors.push("Heading padding or typography leaked into answer units");}}}
    return {errors};
  },{q:JSON.parse(JSON.stringify(q)),mode,poison});
  if(poison)return result.errors;assert.deepEqual(result.errors,[]);await visibleLayout(item,false);
}
async function main(){
  const base=new URL(process.env.HSE_BASE_URL),out=process.env.HSE_SCREENSHOT_DIR,candidate=process.env.HSE_PAINT_CANDIDATE==="1";
  assert(["localhost","127.0.0.1"].includes(base.hostname));assert(out && /^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});
  const initial=hashes(),report={status:"running",candidateOverlay:candidate,states:[],pdfs:[],picker:[],negative:[],runtimeHashes:initial,fixtures:definitions.flatMap(d=>[0,1,2].map(level=>({id:d.id,level,variants:[0,1,2].map(v=>{
    const q=contracts.generate(d.id,v,level);return {heightGrid:q.model.kind==="unpainted-inner-cubes" || figure ? [] : q.model.heights.map(row=>row.map(n=>n || null)),layers:example3?q.answerGroups.map(g=>g.matrix):mission6?q.model.groupedLayers.map(g=>g.matrix):q.model.layerGrids,answer:q.answer,secondary:q.secondary,histogram:q.histogram,faceRows:q.faceRows,solutionEquations:q.solutionEquations||[],...(mission3 ? {sourceImage:`v${v}-given.png`,sourceAssetFamily:"source-6-2-painted-mission3",layerCounts:q.model.layerCounts,A:q.model.A,B:q.model.B,primaryAnswer:q.model.answer} : {}),...(mission5?{sourceImage:"source-given.png",sourceAssetFamily:"source-6-2-painted-mission5",primaryAnswer:d.id.endsWith("-1")?q.model.volume:q.model.surfaceArea,edge:q.model.edge,faceArea:q.model.faceArea,sourceArea:q.model.areaOfExactlyTwoPaintedFaces}:{}),...(mission6?{sourceImage:`v${v}-given.png`,sourceAssetFamily:"source-6-2-painted-mission6",primaryAnswer:q.primary,layerGroups:q.model.groupedLayers.map(g=>g.layers),height:q.model.height}:{}),...(example2?{sourceImages:[`v${v}-before.png`,`v${v}-after.png`],sourceAssetFamily:"source-6-2-painted-example2",primaryAnswer:q.primary}:{}),...(example3?{sourceImage:`v${v}-given.png`,sourceAssetFamily:"source-6-2-painted-example3",primaryAnswer:q.primary,layerGroups:q.answerGroups.map(g=>g.layers),height:q.model.height}:{})};
  })})))};
  const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE});
  try{
    const context=await browser.newContext();await context.route("**/*",route=>new URL(route.request().url()).origin===base.origin ? route.continue() : route.abort());
    async function prepare(page){if(candidate)await page.route("**/source-inventory-grade6.js*",route=>route.fulfill({contentType:"application/javascript",body:read("source-inventory-grade6.js")+`\nwindow.__paintBaseline=window.HSE_SOURCE_INVENTORY_GRADE6.items.map(i=>({sourceItemId:i.sourceItemId,reviewLocked:i.reviewLocked,generatorKey:i.generatorKey,verifiedVariantCount:i.verifiedVariantCount,answerVisualStatus:i.answerVisualStatus}));for(const d of ${JSON.stringify(definitions)})Object.assign(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId===d.id),{reviewLocked:false,generatorKey:d.key,variant:0,answerVisualStatus:'verified',verifiedVariantCount:3,generationMode:'fixed-verified-pool',verifiedVariantTarget:3,...(d.id==='6-2-u3-e3-mission-1'?{problemVisualRequired:false}:{}),...(d.label?{typeLabel:d.label}:{})});`}));}
    async function decode(page){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll(".source62-m3-given img,.source62-example2-given img")].map(image=>image.decode()));window.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION.align(document);});}
    async function inventory(page){
      await page.waitForFunction(()=>!!window.HSE_SOURCE_GRADE6_PAINTED_STACKS_QUESTIONS);
      const state=await page.evaluate(()=>({items:window.HSE_SOURCE_INVENTORY_GRADE6.items.map(i=>({sourceItemId:i.sourceItemId,reviewLocked:i.reviewLocked,generatorKey:i.generatorKey,verifiedVariantCount:i.verifiedVariantCount,answerVisualStatus:i.answerVisualStatus})),baseline:window.__paintBaseline}));
      for(const d of definitions){const item=state.items.find(i=>i.sourceItemId===d.id);assert(!item.reviewLocked && item.generatorKey===d.key && item.verifiedVariantCount===3);}
      if(candidate)for(const i of state.items.filter(i=>!definitions.some(d=>d.id===i.sourceItemId)))assert.deepEqual(i,state.baseline.find(b=>b.sourceItemId===i.sourceItemId));
      for(const id of ["6-2-u3-e2-mission-1","6-2-u3-e2-mission-3","6-2-u3-e2-mission-5"])assert(state.items.find(i=>i.sourceItemId===id).reviewLocked);
      const tPattern=await page.evaluate(()=>window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==="6-2-u3-e2-example-2"));
      assert.equal(tPattern.generatorKey,"sourceGrade6SecondSpaceE2TPatternCount");assert.equal(tPattern.reviewLocked,false);assert.equal(tPattern.verifiedVariantCount,3);
      assert.equal(tPattern.sourceConditionsClarified,true);assert.equal(tPattern.originalAnswerDeterminate,false);assert.equal(tPattern.originalSourceReleaseStatus,"locked");
      assert(!state.items.some(i=>i.sourceItemId==="6-2-u3-e3-example-4"),"Do not register a raw placeholder absent from the actual source page");
    }
    async function check(page,d,level,mode){const selector=mode==="problem" ? "#problemView .question-item" : mode==="answer-key" ? "#answerKeyView .answer-key-visuals>figure" : "#solutionView .solution-item",items=await page.locator(selector).all();assert.equal(items.length,3);for(let v=0;v<3;v++)await inspect(items[v],d.id,v,level,mode);}
    async function print(page,d,level,mode){
      await page.evaluate(mode=>{document.body.dataset.printMode=mode;dispatchEvent(new Event("beforeprint"));},mode);await page.emulateMedia({media:"print"});await decode(page);
      const file=`${d.id}-l${level}-${mode}.pdf`;await page.pdf({path:path.join(out,file),preferCSSPageSize:true,printBackground:true});report.pdfs.push({file,id:d.id,level,mode});await page.emulateMedia({media:"screen"});await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
    }
    for(const d of definitions)for(let level=0;level<3;level++)for(const width of [1280,390,320]){
      const page=await context.newPage(),errors=[],bad=[];page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400)bad.push({url:r.url(),status:r.status()});});page.on("requestfailed",r=>{if(new URL(r.url()).origin===base.origin)bad.push({url:r.url(),failure:r.failure()?.errorText});});await page.setViewportSize({width,height:900});
      try{
        await prepare(page);await page.goto(new URL(`?type=${d.id}&review=1&difficulty=${level-1}`,base).href);await inventory(page);await page.locator("#worksheet:not([hidden])").waitFor();await decode(page);
        await check(page,d,level,"problem");await page.locator("#problemView").screenshot({path:path.join(out,`${d.id}-l${level}-${width}-problem.png`),animations:"disabled"});if(width===1280 && process.env.HSE_CREATE_PDF==="1")await print(page,d,level,"problem");
        if(d.id==="6-2-u3-e3-mission-1" && width===1280 && level===1){assert((await inspect(page.locator("#problemView .question-item").first(),d.id,0,level,"problem",true)).includes("Per-edge cube clue leaked in the question title"));await page.locator("#newProblemButton").click();await decode(page);await check(page,d,level,"problem");report.negative.push(`${d.id}:leaked-edge-clue`);}
        if(figure){
          await page.locator("#problemView [data-m3-figure]").first().click();await page.locator('.source62-m3-figure-dialog[open][aria-busy="false"]').waitFor();
          const zoom=await page.locator(".source62-m3-figure-dialog").evaluate(dialog=>{const image=dialog.querySelector("img"),viewport=dialog.querySelector(".source62-m3-figure-viewport"),r=dialog.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right,imageWidth:image.clientWidth,src:image.currentSrc,scrollLeft:viewport.scrollLeft,viewportWidth:viewport.clientWidth};});
          assert(zoom.left>=0 && zoom.right<=width && zoom.imageWidth>=640);assert(zoom.src.endsWith(example2?"/v0-before.png":mission5?"/source-6-2-painted-mission5/source-given.png":"/v0-given.png"));
          if(width<640)assert(zoom.scrollLeft>0 && zoom.imageWidth>zoom.viewportWidth);await page.locator(".source62-m3-figure-dialog").screenshot({path:path.join(out,`zoom-l${level}-${width}.png`)});await page.keyboard.press("Escape");assert.equal(await page.locator(".source62-m3-figure-dialog[open]").count(),0);
          if(example2){await page.locator('#problemView [data-source-figure-phase="after"]').first().click();await page.locator('.source62-m3-figure-dialog[open][aria-busy="false"]').waitFor();assert((await page.locator('.source62-m3-figure-dialog img').getAttribute("src")).endsWith("/v0-after.png"));await page.keyboard.press("Escape");assert.equal(await page.locator(".source62-m3-figure-dialog[open]").count(),0);}
          if(width===1280 && level===1){assert((await inspect(page.locator("#problemView .question-item").first(),d.id,0,level,"problem",true)).includes("Wrong or missing source 3D picture"));await page.locator("#newProblemButton").click();await decode(page);await check(page,d,level,"problem");report.negative.push(`${d.id}:wrong-picture-variant`);
            await page.evaluate(()=>{window.__m3Decode=HTMLImageElement.prototype.decode;HTMLImageElement.prototype.decode=function(){return this.closest(".source62-m3-figure-dialog") ? new Promise(resolve=>window.__m3ReleaseDecode=resolve) : window.__m3Decode.call(this);};});
            await page.locator("#problemView [data-m3-figure]").first().click();await page.locator('.source62-m3-figure-dialog[open][aria-busy="true"]').waitFor();await page.keyboard.press("Escape");await page.waitForFunction(()=>!document.querySelector(".source62-m3-figure-dialog").open);
            await page.evaluate(async()=>{window.__m3ReleaseDecode();await new Promise(resolve=>setTimeout(resolve,50));HTMLImageElement.prototype.decode=window.__m3Decode;});assert.equal(await page.locator(".source62-m3-figure-dialog[open]").count(),0);report.negative.push(`${d.id}:closed-zoom-request-cannot-reopen`);
          }
        }
        await page.locator("#solutionTab").click();await decode(page);await check(page,d,level,"solution");await page.locator("#solutionView").screenshot({path:path.join(out,`${d.id}-l${level}-${width}-solution.png`),animations:"disabled"});if(width===1280 && process.env.HSE_CREATE_PDF==="1")await print(page,d,level,"solution");
        if(width===1280 && level===1){assert((await inspect(page.locator("#solutionView .solution-item").first(),d.id,0,level,"solution",true)).length>0);await page.locator("#newProblemButton").click();await page.locator("#solutionTab").click();await decode(page);await check(page,d,level,"solution");report.negative.push(`${d.id}:wrong-actual-answer-digit`);}
        await page.evaluate(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});await page.locator("#printMenuButton").click();await page.locator('button[data-print-mode="answer-key"]').click();await page.waitForFunction(()=>window.__printCalls===1);await decode(page);await check(page,d,level,"answer-key");if(width===1280 && process.env.HSE_CREATE_PDF==="1")await print(page,d,level,"answer-key");await page.evaluate(()=>dispatchEvent(new Event("afterprint")));
        await page.locator("#solutionViewerButton").click();for(let v=0;v<3;v++){await page.locator(`#solutionViewerJump [data-solution-index="${v}"]`).click();await decode(page);await inspect(page.locator("#solutionViewerContent"),d.id,v,level,"solution");if(figure && width===320 && level===1 && v===0){await page.locator("#solutionViewerContent [data-m3-figure]").first().click();await page.locator(".source62-m3-figure-dialog[open]").waitFor();await page.keyboard.press("Escape");assert.equal(await page.locator(".source62-m3-figure-dialog[open]").count(),0);assert.equal(await page.locator("#solutionViewer").getAttribute("hidden"),null);}}await page.keyboard.press("Escape");
        if(errors.length || bad.length)report.failedState={id:d.id,level,width,errors,bad};
        assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);report.states.push({id:d.id,level,width,variants:3,answerSafe:true,layerPositionsChecked:true});
      }finally{await page.close();}
    }
    for(const d of definitions)for(const width of [1280,390,320]){
      const page=await context.newPage();await page.setViewportSize({width,height:900});
      try{
        await prepare(page);await page.goto(base.href);await inventory(page);await page.locator('#gradeFilter [data-grade="6"]').click();await page.locator('#termFilter [data-term="2"]').click();
        const type=await page.evaluate(id=>window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).find(t=>t.sourceItemId===id),d.id),row=page.locator(`.tree-type[data-preview-type-id="${type.id}"]`);
        await row.locator("input").check();await row.locator(".tree-type-copy").click();await decode(page);await inspect(page.locator("#typePreviewPopover"),d.id,0,1,"problem");
        await page.locator("[data-close-type-preview]").click();await page.locator("#questionCountInput").fill("120");await page.locator("#generateButton").click();await decode(page);await check(page,d,1,"problem");report.picker.push({id:d.id,width,requested:120,generated:3});
      }finally{await page.close();}
    }
    assert.equal(report.states.length,definitions.length*9);assert.equal(report.picker.length,definitions.length*3);assert.deepEqual(hashes(),initial);report.status="passed";
  }catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{fs.writeFileSync(path.join(out,"painted-bank-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
  console.log(JSON.stringify({status:report.status,states:report.states.length,pdfs:report.pdfs.length,picker:report.picker.length,negative:report.negative.length,candidateOverlay:candidate}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
