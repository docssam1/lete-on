"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const vm = require("node:vm"), crypto = require("node:crypto");
const digest = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
const protectedNames = ["index.html","source-inventory-grade6.js","source-inventory/6-2-source-items.json",
  "source-inventory/6-2-u3-e1-readiness-review.json","assets/source-6-2-stacks/manifest.json",
  "source-6-2-stack-renderer.mjs","source-6-2-stack-count-models.js"];
// Snapshot dirty on-disk files, not HEAD: concurrent parent work must be preserved.
const before = Object.fromEntries(protectedNames.map(name => [name,digest(path.join(__dirname,name))]));
const api = require("./source-6-2-stack-pattern-models.js");
const modelText = fs.readFileSync(path.join(__dirname,"source-6-2-stack-pattern-models.js"),"utf8");
const clone = value => JSON.parse(JSON.stringify(value));
const id = suffix => `6-2-u3-e2-${suffix}`;
const canonical = cells => cells.map(cell => cell.join(",")).sort();
const sourceFilesBefore = {};
const evidenceDirectory = process.env.HSE_STACK_PATTERN_EVIDENCE_DIR;
assert(evidenceDirectory && /^[EG]:[/\\]/i.test(evidenceDirectory), "Set the private E: or G: evidence directory explicitly");
assert(!/[A-Z]:[/\\]/i.test(modelText), "Do not publish private absolute paths in the model");
for (const definition of api.definitions) {
  for (const [name,hash] of [[definition.source.cropFile,definition.source.cropSha256],
    [definition.source.independentReportFile,definition.source.independentReportSha256]]) {
    assert.equal(path.basename(name), name);
    const file = path.join(evidenceDirectory, name);
    assert.equal(digest(file),hash,"Source evidence bytes must match the cited provenance");
    sourceFilesBefore[file] = hash;
  }
  assert.equal(definition.source.rawSourceItemId,definition.sourceItemId);
  assert.equal(definition.source.printedPage,definition.source.pdfPage+2);
  assert.equal(definition.source.pdfSha256,"69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE");
}
function deeplyFrozen(value) {
  if (value && typeof value === "object") { assert(Object.isFrozen(value)); Object.values(value).forEach(deeplyFrozen); }
}
function checkVerification(value) {
  assert.equal(value.registrationOnly,true);
  for (const name of ["officialAnswerVerified","learnerReleaseVerified","renderedFidelityVerified",
    "difficultyVerified","constructionConditionApproved"]) assert.equal(value[name],false);
}
checkVerification(api); deeplyFrozen(api);
assert.equal(api.definitions.length,3);
assert.deepEqual(api.definitions.map(d => d.pools),[[{n:25},{n:20},{n:30}],[{n:5},{n:4},{n:6}],[{n:10},{n:8},{n:12}]]);
assert.equal(api.viewConvention.topRows,"back-to-front");
assert.equal(api.viewConvention.topColumns,"left-to-right");
assert.equal(api.patternConditionPolicy.firstThreeForceUniqueFuture,false);
assert.equal(api.patternConditionPolicy.plainConstructionWordingRequired,true);
assert.match(api.patternConditionPolicy.statement,/source first three.*do not force.*unique future/);
assert.match(api.patternConditionPolicy.hiddenBlocks,/no extra hidden columns/);
const definitionsBefore = JSON.stringify(api.definitions);
const initialFixtures = {
  "example-2": {
    H:[[[1,1,1],[0,1,0]],[[1,2,2,2,1],[0,0,2,0,0],[0,0,1,0,0]],
      [[1,2,3,3,3,2,1],[0,0,0,3,0,0,0],[0,0,0,2,0,0,0],[0,0,0,1,0,0,0]]],
    totals:[4,11,21], layers:[[4],[7,4],[10,7,4]],
    faces:[[2,2,4,4,3,3],[5,5,7,7,8,8],[9,9,10,10,15,15]], pairs:[3,13,29]
  },
  "mission-1": {
    // Independently transcribed report axes, then reversed to H[z][x].
    reportH:[[[1]],[[1,2],[2,2]],[[1,2,3],[2,2,3],[3,3,3]]],
    totals:[1,7,22], layers:[[1],[4,3],[9,8,5]],
    faces:[[1,1,1,1,1,1],[4,4,4,4,4,4],[9,9,9,9,9,9]], pairs:[0,9,39]
  },
  "mission-3": {
    rows:[["111","101","111"],["11111","10101","11011","10101","11111"],
      ["1111111","1010101","1101011","1010101","1101011","1010101","1111111"]],
    totals:[8,20,36], layers:[[8],[20],[36]],
    faces:[[4,4,8,8,4,4],[10,10,20,20,10,10],[20,20,36,36,20,20]], pairs:[8,20,32]
  }
};
function fixtureHeights(suffix,index) {
  const fixture=initialFixtures[suffix];
  if (fixture.H) return clone(fixture.H[index]);
  if (fixture.reportH) return clone(fixture.reportH[index]).reverse().map(row => row.reverse());
  return fixture.rows[index].map(row => [...row].map(Number));
}
function cubesFromTranscription(H,xOrigin) {
  const cubes=[];
  H.forEach((row,z) => row.forEach((height,column) => {
    for (let y=0;y<height;y++) cubes.push([column+xOrigin,y,z]);
  }));
  return cubes;
}
// Generate occupied coordinates from layer membership, edge numbers and zero cells,
// respectively. Never call the model's H builder or consume its output here.
function voxelOracle(suffix,n) {
  const cubes=[];
  if (suffix === "example-2") {
    for (let y=0;y<n;y++) for (let z=0;z<=n;z++) for (let x=-n;x<=n;x++) {
      const reach=n-y;
      if (z === 0 && x >= -reach && x <= reach || x === 0 && z >= 1 && z <= reach) cubes.push([x,y,z]);
    }
  } else if (suffix === "mission-1") {
    for (let i=1;i<=n;i++) for (let j=1;j<=n;j++) for (let layer=1;layer<=n;layer++) {
      if (layer <= i || layer <= j) cubes.push([n-i,layer-1,n-j]);
    }
  } else {
    const side=2*n+1, zeros=new Set();
    for (let z=1;z<side-1;z++) for (let x=z%2 === 1 ? 1 : 2;x<side-1;x+=2) zeros.add(`${x},${z}`);
    for (let z=0;z<side;z++) for (let x=0;x<side;x++) if (!zeros.has(`${x},${z}`)) cubes.push([x,0,z]);
  }
  return cubes;
}
const directions=[["positiveX",[1,0,0]],["negativeX",[-1,0,0]],
  ["positiveY",[0,1,0]],["negativeY",[0,-1,0]],["positiveZ",[0,0,1]],["negativeZ",[0,0,-1]]];
function faceOracle(cubes) {
  const occupied=new Set(cubes.map(cube => cube.join(","))), faces=[], byDirection={}, layers=[], layerCells=[];
  let contacts=0, exposed=0, bottom=0;
  assert.equal(occupied.size,cubes.length,"No duplicate cubes");
  for (const [name,delta] of directions) {
    byDirection[name]=0;
    for (const cube of cubes) {
      const neighbor=cube.map((coordinate,i) => coordinate+delta[i]);
      const shared=occupied.has(neighbor.join(",")), groundBottom=delta[1] === -1 && cube[1] === 0;
      faces.push({cube:clone(cube),direction:name,neighbor,shared,groundBottom,exposed:!shared});
      if (shared) contacts++;
      else { byDirection[name]++; exposed++; if (groundBottom) bottom++; }
    }
  }
  for (const [x,y,z] of cubes) {
    layers[y]=(layers[y] || 0)+1;
    (layerCells[y] ||= []).push([x,z]);
    if (y > 0) assert(occupied.has([x,y-1,z].join(",")),"Every cube is supported");
  }
  assert.equal(faces.length,6*cubes.length);
  assert.equal(contacts%2,0);
  assert.equal(exposed,6*cubes.length-contacts);
  return {faces,byDirection,layers,layerCells,sharedFacePairs:contacts/2,allExposedFaces:exposed,
    groundBottomFaces:bottom,exposedFacesExcludingAllBottom:exposed-bottom};
}
function independentFormulas(suffix,n) {
  let columnSum=0, layerSum=0, expectedLayers=[], allExposed, nonBottom, directional;
  if (suffix === "example-2") {
    for (let height=1;height<=n;height++) columnSum+=3*height;
    columnSum+=n;
    for (let layer=1;layer<=n;layer++) expectedLayers.push(3*(n-layer+1)+1);
    directional=[n*(n+3)/2,n*(n+3)/2,3*n+1,3*n+1,n*(n+2),n*(n+2)];
    allExposed=3*n*n+13*n+2; nonBottom=allExposed-(3*n+1);
    assert.equal(columnSum,n*(3*n+5)/2);
  } else if (suffix === "mission-1") {
    let missing=0;
    for (let height=1;height<=n;height++) columnSum+=height*(2*height-1);
    for (let layer=1;layer<=n;layer++) { missing+=(layer-1)*(layer-1); expectedLayers.push(n*n-(layer-1)*(layer-1)); }
    assert.equal(columnSum,n*n*n-missing);
    assert.equal(columnSum,n*(n+1)*(4*n-1)/6);
    directional=Array(6).fill(n*n); allExposed=6*n*n; nonBottom=5*n*n;
  } else {
    const zeroCells=n*n+(n-1)*(n-1), side=2*n+1, cubes=side*side-zeroCells, edges=12*n-4;
    columnSum=2*side+n*(n+1)+(n-1)*(n+2); expectedLayers=[cubes];
    assert.equal(cubes,2*n*(n+3)); assert.equal(columnSum,cubes);
    allExposed=6*cubes-2*edges; nonBottom=cubes+4*side+4*zeroCells;
    assert.equal(nonBottom,5*cubes-2*edges);
    directional=[side+zeroCells,side+zeroCells,cubes,cubes,side+zeroCells,side+zeroCells];
  }
  layerSum=expectedLayers.reduce((a,b) => a+b,0); assert.equal(columnSum,layerSum);
  return {total:columnSum,layers:expectedLayers,allExposed,nonBottom,directional};
}
let stageChecks=0, faceChecks=0, initialCubes=0, initialFaces=0, variants=0, negativeTests=0;
function verifyStage(suffix,n,result) {
  const cubes=voxelOracle(suffix,n), oracle=faceOracle(cubes), formula=independentFormulas(suffix,n);
  assert.deepEqual(canonical(result.cubes),canonical(cubes));
  assert.equal(result.totalCubes,cubes.length); assert.equal(result.totalCubes,formula.total);
  assert.deepEqual(result.layerCounts,oracle.layers); assert.deepEqual(result.layerCounts,formula.layers);
  assert.deepEqual(result.surface.exposedByDirection,oracle.byDirection);
  assert.deepEqual(directions.map(([name]) => oracle.byDirection[name]),formula.directional);
  for (const name of ["sharedFacePairs","allExposedFaces","groundBottomFaces","exposedFacesExcludingAllBottom"])
    assert.equal(result.surface[name],oracle[name]);
  assert.equal(result.surface.allExposedFaces,formula.allExposed);
  assert.equal(result.surface.exposedFacesExcludingAllBottom,formula.nonBottom);
  if (suffix === "mission-3") {
    assert.equal(result.surface.surfaceAreaExcludingAllBottomCm2,formula.nonBottom);
    assert.equal(result.surface.cubeEdgeLengthCm,1);
  } else {
    assert(!Object.hasOwn(result.surface,"surfaceAreaExcludingAllBottomCm2"));
    assert(!Object.hasOwn(result.surface,"cubeEdgeLengthCm"));
  }
  assert.equal(result.formulaAudit.matches,true); assert.equal(result.numericDifference,formula.nonBottom-formula.total);
  assert.equal(result.layerDifference,formula.layers[0]-formula.layers.at(-1));
  assert.equal(result.uniqueRequestedNumericAnswerUnderConstruction,true);
  assert.equal(result.patternConditionPolicy.firstThreeForceUniqueFuture,false);
  result.layers.forEach((layer,i) => {
    assert.equal(layer.layer,i+1); assert.equal(layer.count,oracle.layers[i]);
    assert.deepEqual(canonical(layer.cells),canonical(oracle.layerCells[i]));
  });
  assert.equal(result.columns.reduce((sum,column) => sum+column.height,0),result.totalCubes);
  for (const {x,z,height} of result.columns) assert.equal(result.H[z][x-result.xOrigin],height);
  assert.equal(result.H.length,suffix === "example-2" ? n+1 : suffix === "mission-1" ? n : 2*n+1);
  assert(result.H.every(row => row.length === (suffix === "example-2" || suffix === "mission-3" ? 2*n+1 : n)));
  if (suffix === "example-2") assert.deepEqual(result.answer,{totalCubes:formula.total,layerDifference:3*(n-1)});
  else assert.equal(result.answer,suffix === "mission-1" ? formula.total : formula.nonBottom-formula.total);
  checkVerification(result); deeplyFrozen(result); stageChecks++; faceChecks+=oracle.faces.length;
  return oracle;
}
for (const definition of api.definitions) {
  const suffix=definition.sourceItemId.slice("6-2-u3-e2-".length), fixture=initialFixtures[suffix];
  checkVerification(definition);
  assert.equal(definition.variantCount,3);
  for (const recipe of definition.learnerRecipe) {
    assert(!/[\^\u00b2\u00b3]|\*\*|\b(?:choose|combination|binomial|power|squared|cubed)\b/i.test(recipe));
    assert(!/\b(?:1000|72|95|260|1068|808)\b/.test(recipe),"Construction wording must not give the target answers");
  }
  const firstStates=api.firstStates(definition.sourceItemId); deeplyFrozen(firstStates);
  assert.equal(firstStates.length,3);
  firstStates.forEach((result,index) => {
    const H=fixtureHeights(suffix,index), origin=suffix === "example-2" ? -index-1 : 0;
    assert.deepEqual(result.H,H); assert.deepEqual(definition.sourceFirstThreeHeights[index],H);
    assert.equal(result.xOrigin,origin);
    assert.deepEqual(canonical(result.cubes),canonical(cubesFromTranscription(H,origin)));
    assert.equal(result.totalCubes,fixture.totals[index]); assert.deepEqual(result.layerCounts,fixture.layers[index]);
    assert.deepEqual(directions.map(([name]) => result.surface.exposedByDirection[name]),fixture.faces[index]);
    assert.equal(result.surface.sharedFacePairs,fixture.pairs[index]);
    initialCubes+=result.cubes.length; initialFaces+=6*result.cubes.length;
  });
  for (let n=1;n<=definition.supportedStageRange.maximum;n++) {
    const condition={n}, snapshot=JSON.stringify(condition), result=api.build(definition.sourceItemId,condition);
    verifyStage(suffix,n,result);
    assert.equal(JSON.stringify(condition),snapshot); assert.equal(Object.isFrozen(condition),false);
    condition.n=999; assert.equal(result.condition.n,n); assert.equal(result.n,n);
    const second=api.build(definition.sourceItemId,{n}); assert.deepEqual(second,result);
    assert.notEqual(second.H,result.H); assert.notEqual(second.cubes,result.cubes);
  }
  for (let variant=0;variant<3;variant++) {
    const result=api.solve(definition.sourceItemId,variant);
    assert.equal(result.n,definition.pools[variant].n); assert.equal(result.variant,variant);
    verifyStage(suffix,result.n,result); variants++;
  }
  for (const n of [-1,0,definition.supportedStageRange.maximum+1,Number.MAX_SAFE_INTEGER,1.5,"1",null,undefined,NaN,Infinity,true]) {
    assert.throws(() => api.build(definition.sourceItemId,{n}),RangeError); negativeTests++;
  }
  for (const variant of [-1,3,100,0.5,"0",null,NaN,Infinity,{},true]) {
    assert.throws(() => api.solve(definition.sourceItemId,variant),RangeError); negativeTests++;
  }
  for (const condition of [null,undefined,[],{}, {n:1,hiddenBlocks:1},{n:1,H:[[9]]},{n:1,[Symbol("extra")]:true}]) {
    assert.throws(() => api.build(definition.sourceItemId,condition),RangeError); negativeTests++;
  }
  const bad={n:0}, badSnapshot=JSON.stringify(bad);
  assert.throws(() => api.build(definition.sourceItemId,bad),RangeError); assert.equal(JSON.stringify(bad),badSnapshot);
  assert.equal(Object.isFrozen(bad),false);
  assert.deepEqual(api.solve(definition.sourceItemId),api.solve(definition.sourceItemId,0));
}
assert.equal(initialCubes,130); assert.equal(initialFaces,780);
const example=api.solve(id("example-2")), mission1=api.solve(id("mission-1")), mission3=api.solve(id("mission-3"));
assert.deepEqual(example.answer,{totalCubes:1000,layerDifference:72});
assert.equal(example.firstLayerCount,76); assert.equal(example.lastLayerCount,4);
assert.equal(mission1.answer,95); assert.deepEqual(mission1.layerCounts,[25,24,21,16,9]);
assert.equal(mission3.totalCubes,260); assert.equal(mission3.H.length,21);
assert.equal(mission3.surface.exposedFacesExcludingAllBottom,1068); assert.equal(mission3.answer,808);
assert.equal(mission3.surface.groundBottomFaces,260); assert.equal(mission3.surface.sharedFacePairs,116);
// Controls reject equal-count lookalikes and the incorrect append-only border rule.
const t=api.build(id("example-2"),{n:1});
assert.deepEqual(canonical(t.cubes),canonical([[-1,0,0],[0,0,0],[1,0,0],[0,0,1]]));
assert.notDeepEqual(canonical(t.cubes),canonical([[-1,0,0],[0,0,0],[1,0,0],[-1,0,1]]));
const oldBorder=api.build(id("mission-3"),{n:2}), newBorder=api.build(id("mission-3"),{n:3});
assert.equal(oldBorder.H[0][0],1); assert.equal(newBorder.H[1][1],0);
const appended=clone(newBorder.H);
oldBorder.H.forEach((row,z) => row.forEach((height,x) => { appended[z+1][x+1]=height; }));
assert.notDeepEqual(appended,newBorder.H);
assert.notEqual(cubesFromTranscription(appended,0).length,newBorder.totalCubes);
assert(api.definitions[2].learnerRecipe.some(recipe => /Rebuild.*do not merely append/.test(recipe)));
for (const source of ["missing","6-2-u3-e2-example-1", "6-2-u3-e2-exploration-1",null,{},1]) {
  assert.throws(() => api.solve(source),RangeError);
  assert.throws(() => api.build(source,{n:1}),RangeError);
  assert.throws(() => api.firstStates(source),RangeError); negativeTests+=3;
}
assert.equal(JSON.stringify(api.definitions),definitionsBefore);
assert.throws(() => { example.H[0][0]=99; },TypeError);
assert.throws(() => { example.cubes[0][1]=99; },TypeError);
assert.throws(() => { example.sourceRef.cropXYWH[0]=0; },TypeError);
assert.throws(() => { api.definitions[0].pools[0].n=1; },TypeError);
assert.throws(() => { example.layers[0].cells.push([99,99]); },TypeError);
const sentinel={names:["existing"],generate:() => "existing"};
const browser={window:{HSE_GENERATORS:sentinel,existingCatalog:{locked:true}}};
vm.runInNewContext(modelText,browser);
assert.equal(browser.window.HSE_GENERATORS,sentinel); assert.deepEqual(sentinel.names,["existing"]);
assert.deepEqual(browser.window.existingCatalog,{locked:true});
assert.deepEqual(Object.keys(browser.window).sort(),["HSE_GENERATORS","HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS","existingCatalog"].sort());
const browserApi=browser.window.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS;
assert.equal(JSON.stringify(browserApi.solve(id("example-2")).answer),JSON.stringify(example.answer));
checkVerification(browserApi); deeplyFrozen(browserApi);
const globals={}; vm.runInNewContext(modelText,globals);
assert.equal(globals.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS.solve(id("mission-3")).answer,808);
const commonJS={module:{exports:{}},window:{HSE_GENERATORS:sentinel}};
vm.runInNewContext(modelText,commonJS);
assert.equal(commonJS.module.exports.solve(id("mission-1")).answer,95);
assert.equal(commonJS.window.HSE_GENERATORS,sentinel);
assert(!Object.hasOwn(commonJS.window,"HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS"));
const after=Object.fromEntries(protectedNames.map(name => [name,digest(path.join(__dirname,name))]));
assert.deepEqual(after,before,"Existing index, source catalog, renderer and parent count model must remain unchanged");
for (const [file,hash] of Object.entries(sourceFilesBefore)) assert.equal(digest(file),hash);
console.log(JSON.stringify({status:"passed",stageChecks,variants,firstSourceStates:9,initialCubes,initialFaces,
  allSixFaceAdjacencyChecks:faceChecks,negativeTests,immutableInputsAndOutputs:true,
  firstThreeDoNotForceUniqueFuture:true,tNotLControl:true,borderRebuildControl:true,
  sourceAnswers:[{sourceItemId:example.sourceItemId,totalCubes:1000,firstLayer:76,lastLayer:4,layerDifference:72},
    {sourceItemId:mission1.sourceItemId,totalCubes:95,layers:mission1.layerCounts},
    {sourceItemId:mission3.sourceItemId,totalCubes:260,exposedFacesExcludingAllBottom:1068,numericDifference:808}],
  sourceEvidenceUnchanged:true,protectedFilesUnchanged:true,protectedHashes:{before,after},
  generatorRegistration:false,officialAnswerVerified:false,learnerReleaseVerified:false,
  renderedFidelityVerified:false,difficultyVerified:false,unlockCount:0},null,2));
