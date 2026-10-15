"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const models=require("./source-6-2-layer-cut-mission3-models.js"),contracts=require("./source-6-2-layer-cut-mission3-contracts.js"),presentation=require("./source-6-2-layer-cut-mission3-presentation.js"),assets=require("./source-6-2-plane-cut-assets.js");
const root="E:/Codex/visualizations/2026/08/21/01a0242e-3982-7661-8225-b287285e6742/source-6-2-u3-e4-review-20261014",independent=JSON.parse(fs.readFileSync(path.join(root,"mission-4-3-independent/variant-result.json"))),out=path.resolve(process.argv[2]||path.join(root,"mission-4-3-contracts"));
const keys=rows=>rows.map(p=>p.map(v=>Number(v)).join(",")).sort(),area=polygon=>Math.abs(polygon.reduce((sum,p,i)=>{const q=polygon[(i+1)%polygon.length];return sum+p[0]*q[1]-p[1]*q[0];},0))/2;
const rational=s=>{const [a,b="1"]=String(s).split("/");assert(/^-?\d+$/.test(a)&&/^\d+$/.test(b));return Number(a)/Number(b);};
let checks=0;function eq(a,b){assert.deepEqual(a,b);checks++;}
for(let variant=0;variant<3;variant++){
 const actual=models.solve(models.sourceItemId,variant),expected=independent.geometryByVariant[variant];
 eq(actual.dimensions,expected.dimensions);eq(actual.cutCount,expected.cutCount);eq(actual.splitPieceCount,expected.retainedUnitCubeFragmentCount);eq(keys(actual.cutCells),keys(expected.cutCells));eq(keys(actual.touchCells),keys(expected.touchOnlyCells));
 for(const row of actual.layers){const ref=expected.layersBottomToTop.find(r=>r.layer===row.layer);eq(keys(row.bandXZ),keys(ref.bandPolygonXZ));eq(area(row.bandXZ),rational(ref.bandAreaXZ));eq(keys(row.givenResponsePointsXZ),keys(ref.upperTraceXZ));eq(row.cutCount,ref.cutCount);assert(area(row.bandXZ)<row.cutCount,"Full-cell substitution must fail");checks++;}
 const file=`${actual.dimensions.join("x")}-given.png`,asset=assets.image(file);eq(crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,"assets/source-6-2-plane-cut",file))).digest("hex"),asset.sha256);
 for(let level=0;level<3;level++){
  const q=contracts.generate(models.sourceItemId,variant,level),ref=independent.cases.find(c=>c.variant===variant&&c.level===level),view=presentation.render(models.sourceItemId,variant,level);
  eq(Array.isArray(q.answer)?q.answer:[q.answer],ref.expectedOrderedAnswers);eq(q.requestedLayers,ref.responseLayerOrder);eq(q.requiresLayerDrawing,true);eq(q.numericAnswerDoesNotValidateDrawing,true);eq(q.originalSourceReleaseStatus,"locked");eq(q.learnerReleaseVerified,false);eq(q.officialAnswerVerified,false);
  assert(!/<table|data-role="section-band"|data-response-role="teacher"|cut-all\.png|cut-top\.png/.test(view.prompt),"Student content must not explain or solve the figure");checks++;
  for(const layer of q.requestedLayers){const grid=presentation.grid(q,layer,"problem");eq((grid.match(/data-role="given-endpoint"/g)||[]).length,2);assert(!grid.includes("<polygon"));eq((presentation.grid(q,layer,"teacher").match(/data-role="section-band"/g)||[]).length,1);}
  assert.throws(()=>presentation.grid(q,0,"problem"));assert.throws(()=>presentation.grid(q,q.requestedLayers[0],"answer"));checks+=2;
 }
}
for(const value of[-1,3,NaN,1.5]){assert.throws(()=>contracts.generate(models.sourceItemId,value,1));assert.throws(()=>contracts.generate(models.sourceItemId,0,value));checks+=2;}
eq(fs.readFileSync(path.join(__dirname,"index.html"),"utf8").includes("source-6-2-layer-cut-mission3-questions.js"),true);
const hash=bytes=>crypto.createHash("sha256").update(bytes).digest("hex");
const report={status:"passed-candidate-only",checks,independentDecision:independent.decision,independentInputSha256:hash(fs.readFileSync(path.join(root,"mission-4-3-independent/variant-result.json"))),runtimeHashes:Object.fromEntries(["source-6-2-plane-cut-models.js","source-6-2-plane-cut-assets.js",... ["models.js","contracts.js","presentation.js"].map(s=>`source-6-2-layer-cut-mission3-${s}`)].map(file=>[file,hash(fs.readFileSync(path.join(__dirname,file)))])),sourceQuestion:"whole-layer-drawing-plus-count",studentExplanatoryTable:false,studentSolvedLayers:false,teacherUsesActualBand:true,catalogChanged:false,originalLocked:true,officialAnswerVerified:false,humanApproved:false,requiresNativeRasterAndActualBankReview:true};
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"result.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report));
