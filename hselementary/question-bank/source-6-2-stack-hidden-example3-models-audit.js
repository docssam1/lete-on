"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto"), vm = require("node:vm");
const api = require("./source-6-2-stack-hidden-example3-models.js");
const id = "6-2-u3-e2-example-3";
const clone = value => JSON.parse(JSON.stringify(value));
const digest = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
const args = process.argv.slice(2);
assert(args.length === 0 || args.length === 2 && args[0] === "--evidence-dir", "Use optional --evidence-dir PRIVATE_DIRECTORY only");
const evidenceDir = args.length ? path.resolve(args[1]) : null;
const protectedNames = fs.readdirSync(__dirname).filter(name =>
  /^(source-6-2-stack-(renderer|count-|minmax-mission2)|source-inventory|source-release-gate|app\.|index\.)/.test(name));
function protectedHashes() {
  const hashes = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      const file = path.join(dir,entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) hashes[path.relative(__dirname,file)] = digest(file);
    }
  }
  for (const name of protectedNames) {
    const file = path.join(__dirname,name);
    if (fs.statSync(file).isDirectory()) walk(file);
    else hashes[name] = digest(file);
  }
  return hashes;
}
const before = protectedHashes();
const source = api.definitions[0].source;
const sourcePairs = [[source.cropFile,source.cropSha256],[source.shapeFile,source.shapeSha256],
  [source.enlargedShapeFile,source.enlargedShapeSha256],[source.pointerFile,source.pointerSha256],
  [source.independentReportFile,source.independentReportSha256]];
let sourceHashChecked = false, sourcePointerChecked = false;
if (evidenceDir) {
  for (const [file,hash] of sourcePairs) assert.equal(digest(path.join(evidenceDir,file)),hash,file);
  assert.equal(digest(path.join(evidenceDir,"..",source.pageFile)),source.pageSha256);
  const report = fs.readFileSync(path.join(evidenceDir,source.independentReportFile),"utf8");
  const section = report.slice(report.indexOf("## "+source.independentReportSection),report.indexOf("## \uC608\uC81C 2-4"));
  assert(section.includes("26,19,13,8,4,1") && section.includes("\uBC14\uB2E5\uC5D0 \uB2FF\uC740 \uBA74\uC740 \uBCF4\uC774\uB294 \uAC83\uC73C\uB85C \uD55C\uB2E4"));
  sourceHashChecked = true;
}
const expectedH = [[6,5,4,3,2,1],[5,5,4,3,2,1],[4,4,3,2,1,0],
  [3,3,2,1,0,0],[2,2,1,0,0,0],[1,1,0,0,0,0]];
const steps = [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]];
const faces = ["left","right","bottom","top","back","front"];
const keys = positions => positions.map(p => p.join(",")).sort();
function frozen(value) {
  if (value && typeof value === "object") {
    assert(Object.isFrozen(value));
    Object.values(value).forEach(frozen);
  }
}
// Integer half-spaces construct the oracle directly, without production H or neighbors.
function integerOracle(n) {
  const cubes = [], hidden = [], layers = Array(n).fill(0), hiddenLayers = Array(n).fill(0);
  for (let y=0;y<n;y++) for (let z=0;z<n;z++) for (let x=0;x<n;x++) {
    if (x+y <= n-1 && z+y <= n-1 && x+z+y <= n) {
      cubes.push([x,y,z]); layers[y]++;
      if (x >= 1 && z >= 1 && y >= 1 && x+z+y <= n-1) {
        hidden.push([x,y,z]); hiddenLayers[y]++;
      }
    }
  }
  return {cubes,hidden,layers,hiddenLayers};
}
function outsideAir(cubes,n) {
  const occupied = new Set(keys(cubes)), visited = new Set(["-1,-1,-1"]), queue = [[-1,-1,-1]];
  for (let cursor=0;cursor<queue.length;cursor++) {
    for (const delta of steps) {
      const next = queue[cursor].map((v,i) => v+delta[i]), key = next.join(",");
      if (next.some(v => v < -1 || v > n) || occupied.has(key) || visited.has(key)) continue;
      visited.add(key); queue.push(next);
    }
  }
  const cavities = [];
  for (let x=0;x<n;x++) for (let y=0;y<n;y++) for (let z=0;z<n;z++) {
    const key = [x,y,z].join(",");
    if (!occupied.has(key) && !visited.has(key)) cavities.push([x,y,z]);
  }
  return {visited,cavities};
}
function countWithoutBottom(cubes) {
  const occupied = new Set(keys(cubes));
  return cubes.filter(p => steps.filter((_,i) => i !== 2).every(d =>
    occupied.has(p.map((v,j) => v+d[j]).join(",")))).length;
}
function positiveCameraProxy(cubes) {
  const occupied = new Set(keys(cubes));
  return cubes.filter(p => p[1] > 0 && [steps[1],steps[3],steps[5]].every(d =>
    occupied.has(p.map((v,j) => v+d[j]).join(",")))).length;
}
function verify(result) {
  const {n} = result, oracle = integerOracle(n);
  assert.deepEqual(keys(result.cubes),keys(oracle.cubes));
  assert.equal(new Set(keys(result.cubes)).size,result.totalCubes);
  assert.deepEqual(result.layerCounts,oracle.layers);
  assert.deepEqual(keys(result.hiddenPositions),keys(oracle.hidden));
  assert.equal(result.hiddenCount,oracle.hidden.length);
  assert.equal(result.answer,result.hiddenCount);
  const columnTotal = result.H.flat().reduce((a,b) => a+b,0);
  assert.equal(columnTotal,result.totalCubes);
  assert.equal(result.layerCounts.reduce((a,b) => a+b,0),columnTotal);
  const columnKeys = new Set();
  for (const column of result.columns) {
    const {x,z,height} = column;
    assert.equal(result.H[z][x],height);
    assert(!columnKeys.has(`${x},${z}`)); columnKeys.add(`${x},${z}`);
    assert.deepEqual(result.cubes.filter(p => p[0] === x && p[2] === z).map(p => p[1]),
      Array.from({length:height},(_,y) => y));
  }
  assert.equal(columnKeys.size,result.columnCount);
  assert.equal(result.columnCount,result.requiredTopFaceCount);
  assert.deepEqual(keys(result.requiredTopFaces.map(f => f.position)),
    keys(result.columns.map(c => [c.x,c.height-1,c.z])));
  result.requiredTopFaces.forEach(f => { assert.equal(f.face,"top"); assert.equal(f.height,f.position[1]+1); });
  const occupied = new Set(keys(oracle.cubes)), hidden = new Set(keys(result.hiddenPositions));
  const exterior = new Set(keys(result.exteriorPositions));
  assert.equal(exterior.size+hidden.size,occupied.size);
  for (const key of occupied) assert.notEqual(hidden.has(key),exterior.has(key));
  assert.equal(result.exteriorCount,exterior.size);
  const air = outsideAir(oracle.cubes,n);
  assert.deepEqual(air.cavities,[]);
  let touching = 0, exposed = 0, bottom = 0;
  const byDirection = Object.fromEntries(faces.map(face => [face,0]));
  assert.equal(result.faceRecords.length,occupied.size);
  assert.deepEqual(keys(result.faceRecords.map(r => r.position)),keys(result.cubes));
  for (const record of result.faceRecords) {
    assert.equal(record.faces.length,6);
    let contacts = 0;
    record.faces.forEach((face,i) => {
      const next = record.position.map((v,j) => v+steps[i][j]);
      const hasCube = occupied.has(next.join(","));
      const isBottom = i === 2 && record.position[1] === 0;
      assert.equal(face.face,faces[i]); assert.deepEqual(face.neighbor,next);
      assert.equal(face.touching,hasCube); assert.equal(face.exposed,!hasCube);
      assert.equal(face.countedVisible,!hasCube); assert.equal(face.groundBottom,isBottom);
      if (hasCube) { contacts++; touching++; }
      else { exposed++; byDirection[faces[i]]++; assert(air.visited.has(next.join(","))); }
      if (isBottom) { bottom++; assert(face.countedVisible); assert(!record.fullyHidden); }
    });
    assert.equal(record.touchingFaceCount,contacts);
    assert.equal(record.exposedFaceCount,6-contacts);
    assert.equal(record.fullyHidden,contacts === 6);
    assert.equal(record.fullyHidden,hidden.has(record.position.join(",")));
  }
  assert.deepEqual(result.faceCounts,{total:6*occupied.size,touching,exposed,
    sharedFacePairs:touching/2,groundBottomFaces:bottom,exposedByDirection:byDirection,qaInternalOnly:true});
  assert.equal(touching+exposed,6*occupied.size);
  assert.equal(bottom,result.columnCount);
  result.layers.forEach((layer,y) => {
    assert.equal(layer.y,y); assert.equal(layer.count,oracle.layers[y]);
    assert.deepEqual(keys(layer.positions),keys(oracle.cubes.filter(p => p[1] === y)));
  });
  assert.equal(result.bottomRule.bottomExcludedFromVisibility,false);
  assert.equal(result.bottomRule.groundBottomCountedVisible,true);
  assert(result.hiddenPositions.every(p => p[1] > 0));
  for (const key of ["learnerReleaseVerified","officialAnswerVerified","renderedFidelityVerified","cameraRenderVisibilityVerified"]) assert.equal(result[key],false);
  assert.equal(result.registrationOnly,true);
  frozen(result);
  return {n,totalCubes:result.totalCubes,columns:result.columnCount,hidden:result.hiddenCount,
    layerCounts:oracle.layers,hiddenLayerCounts:oracle.hiddenLayers,faceChecks:6*occupied.size,
    cavities:air.cavities.length,bottomIgnoredWrongCount:countWithoutBottom(oracle.cubes),
    positiveCameraProxyWrongCount:positiveCameraProxy(oracle.cubes)};
}
frozen(api);
assert.deepEqual(api.definitions[0].pools,[{n:6},{n:5},{n:7}]);
assert.equal(api.viewConvention.heightLookup,"H[z][x]");
assert.equal(api.viewConvention.verticalAxis,"y");
const results = [0,1,2].map(v => api.solve(id,v));
const summaries = results.map(verify);
assert.deepEqual(summaries.map(s => [s.n,s.totalCubes,s.hidden]),[[6,71,10],[5,45,4],[7,105,20]]);
assert.deepEqual(results[0].H,expectedH);
assert.deepEqual(results[0].layerCounts,[26,19,13,8,4,1]);
assert.equal(results[0].requiredTopFaceCount,26);
const wrongRows = clone(expectedH); [wrongRows[0],wrongRows[1]] = [wrongRows[1],wrongRows[0]];
assert.equal(wrongRows.flat().reduce((a,b) => a+b,0),71);
assert.notDeepEqual(wrongRows,results[0].H,"Total count cannot validate row orientation");
assert.throws(() => verify({...results[0],H:wrongRows}),assert.AssertionError);
const shiftedAxis = results[0].cubes.map(([x,y,z]) => [x,z,y]);
assert.notDeepEqual(keys(shiftedAxis),keys(results[0].cubes),"Report vertical axis must not become horizontal");
assert.throws(() => verify({...results[0],cubes:shiftedAxis}),assert.AssertionError);
assert.equal(summaries[0].positiveCameraProxyWrongCount,26);
summaries.forEach(s => { assert.notEqual(s.bottomIgnoredWrongCount,s.hidden); assert.notEqual(s.positiveCameraProxyWrongCount,s.hidden); });
const reversedRows = clone(expectedH).reverse();
assert.notDeepEqual(reversedRows,results[0].H);
assert.throws(() => verify({...results[0],H:reversedRows}),assert.AssertionError);
for (const wrongCount of [summaries[0].bottomIgnoredWrongCount,summaries[0].positiveCameraProxyWrongCount]) {
  assert.throws(() => verify({...results[0],hiddenCount:wrongCount,answer:wrongCount}),assert.AssertionError);
}
if (evidenceDir) {
  // The hash pins this known unquoted CSV dialect; reject quotes before splitting fields.
  const csv = fs.readFileSync(path.join(evidenceDir,source.pointerFile),"utf8").trim();
  assert(!csv.includes('"'));
  const [header,...lines] = csv.split(/\r?\n/);
  assert.equal(header,"id,x,y,height,cropPixelX,cropPixelY,sourcePixelX,sourcePixelY,centerBrightness,note");
  assert.equal(lines.length,26);
  const seen = new Set(), projected = api.viewConvention.sourcePointerProjection;
  lines.forEach((line,i) => {
    const fields = line.split(","); assert.equal(fields.length,10);
    const [pointerId,x,z,height,cropX,cropY,pageX,pageY] = fields.slice(0,8).map(Number);
    assert.equal(pointerId,i+1); assert.equal(expectedH[z][x],height);
    const key = `${x},${z}`; assert(!seen.has(key)); seen.add(key);
    assert.equal(pageX,cropX+source.shapeXYWH[0]);
    assert(Math.abs(pageY-cropY-source.shapeXYWH[1]) < 1e-8);
    for (const [axis,pixel] of [cropX,cropY].entries()) {
      const predicted = projected.origin[axis]+x*projected.x[axis]+z*projected.z[axis]+height*projected.height[axis];
      assert(Math.abs(predicted-pixel) <= 0.051);
    }
    assert(results[0].requiredTopFaces.some(f => f.position.join(",") === [x,height-1,z].join(",")));
  });
  assert.equal(seen.size,results[0].columnCount);
  sourcePointerChecked = true;
}
for (const condition of [null,undefined,[],{}, {n:4},{n:8},{n:"6"},{n:NaN},{n:Infinity},
  {n:6.5},{n:6,H:expectedH},{n:6,ignoreBottom:true},Object.create({n:6}),{n:6,[Symbol("extra")]:1}]) {
  assert.throws(() => api.build(id,condition),RangeError);
}
let getterRead = false;
assert.throws(() => api.build(id,{get n() { getterRead = true; return 6; }}),RangeError);
assert.equal(getterRead,false);
for (const variant of [-1,3,NaN,Infinity,1.5,"0",null]) assert.throws(() => api.solve(id,variant),RangeError);
for (const badId of [undefined,null,"6-2-u3-e2-example-4",{},6]) {
  assert.throws(() => api.solve(badId),RangeError);
  assert.throws(() => api.build(badId,{n:6}),RangeError);
}
const condition = {n:6}, stable = api.build(id,condition);
condition.n = 5; assert.equal(stable.n,6);
assert.throws(() => { stable.H[0][0] = 0; },TypeError);
assert.throws(() => { stable.cubes.push([9,9,9]); },TypeError);
assert.throws(() => { stable.faceRecords[0].faces[0].touching = true; },TypeError);
assert.deepEqual(api.solve(id),results[0]);
const browserContext = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"source-6-2-stack-hidden-example3-models.js"),"utf8"),browserContext);
const browserApi = browserContext.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_MODELS;
assert.equal(JSON.stringify(browserApi.solve(id,2)),JSON.stringify(results[2]));
frozen(browserApi);
assert.deepEqual(protectedHashes(),before,"Protected renderer/count/M2/catalog/index/locks changed");
if (evidenceDir) {
  for (const [file,hash] of sourcePairs) assert.equal(digest(path.join(evidenceDir,file)),hash);
  assert.equal(digest(path.join(evidenceDir,"..",source.pageFile)),source.pageSha256);
}
console.log(JSON.stringify({pass:true,sourceItemId:id,variants:summaries,sourceHashChecked,sourcePointerChecked,
  protectedFilesUnchanged:Object.keys(before).length,registrationOnly:true,learnerReleaseVerified:false,
  officialAnswerVerified:false,renderedFidelityVerified:false,cameraRenderVisibilityVerified:false,
  residual:"Teacher interpretation and 3D visibility proof remain pending; no unlock or learner release."},null,2));
