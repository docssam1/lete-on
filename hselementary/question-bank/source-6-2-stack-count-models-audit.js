"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), crypto = require("node:crypto");
const api = require("./source-6-2-stack-count-models.js");
const digest = name => crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,name))).digest("hex");
const protectedNames = ["source-inventory-grade6.js","source-inventory/6-2-source-items.json","index.html"];
const before = Object.fromEntries(protectedNames.map(name=>[name,digest(name)]));
const clone = value => JSON.parse(JSON.stringify(value));
const equal = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const fixtures = [
  {suffix:"exploration-1",top:[[0,1,0,0],[0,1,0,0],[0,1,1,1],[1,1,1,1]],front:[4,4,2,1],right:[4,4,2,1],answer:12},
  {suffix:"exploration-2",top:[[0,1,0,0],[0,1,0,0],[0,1,1,1],[1,1,1,1]],front:[4,4,2,1],right:[4,4,2,1],answer:38},
  {suffix:"example-1",top:[[1,0,0],[1,0,1],[1,1,1]],total:10,highest:3,answer:75},
  {suffix:"mission-4",top:[[1,1,1],[1,1,1],[0,0,1]],front:[1,2,2],right:[1,2,2],answer:7},
  {suffix:"mission-6",top:[[1,0],[1,1],[1,1]],total:8,highest:3,answer:20},
  {suffix:"mission-2",top:[[1,0,0],[1,1,1],[0,1,1],[1,1,1]],front:[4,2,3],right:[4,3,1,3],answer:37}
];
function deeplyFrozen(value) {
  if (value && typeof value === "object") { assert(Object.isFrozen(value)); Object.values(value).forEach(deeplyFrozen); }
}
// Build each column's choices by testing occupied pixels against the supplied views.
// Compare complete pixel sets afterwards, without the production maxima or solve().
function voxelOracle(condition) {
  const rows=condition.top.length, cols=condition.top[0].length, positions=[];
  for(let z=0;z<rows;z++) for(let x=0;x<cols;x++) if(condition.top[z][x]) positions.push([x,z]);
  const limit=condition.highest || Math.max(...condition.front,...condition.right), found=[];
  const expected = heights => new Set(heights.flatMap((n,x)=>Array.from({length:n},(_,y)=>`${x},${y}`)));
  const f=condition.front ? expected(condition.front) : null,r=condition.right ? expected(condition.right) : null;
  const choices=positions.map(([x,z])=>Array.from({length:limit},(_,i)=>i+1).filter(height=>
    !f || Array.from({length:height},(_,y)=>y).every(y=>f.has(`${x},${y}`) && r.has(`${rows-1-z},${y}`))));
  const candidates=choices.reduce((n,values)=>n*values.length,1);
  const h=condition.top.map(row=>row.map(()=>0));
  for(let code=0;code<candidates;code++) {
    let cursor=code;
    positions.forEach(([x,z],i)=>{h[z][x]=choices[i][cursor%choices[i].length];cursor=Math.floor(cursor/choices[i].length);});
    if(condition.fixedHeights && positions.some(([x,z])=>condition.fixedHeights[z][x]!==null && condition.fixedHeights[z][x]!==h[z][x])) continue;
    const cubes=[];
    for(const [x,z] of positions) for(let y=0;y<h[z][x];y++) cubes.push([x,y,z]);
    if(condition.total!==undefined && cubes.length!==condition.total) continue;
    if(condition.highest!==undefined && !cubes.some(cell=>cell[1]===condition.highest-1)) continue;
    if(condition.front) {
      const frontPixels=new Set(cubes.map(([x,y])=>`${x},${y}`)), rightPixels=new Set(cubes.map(([,y,z])=>`${rows-1-z},${y}`));
      if(frontPixels.size!==f.size || [...frontPixels].some(pixel=>!f.has(pixel)) || rightPixels.size!==r.size || [...rightPixels].some(pixel=>!r.has(pixel))) continue;
    }
    found.push(clone(h));
  }
  return {arrangements:found,candidates};
}
function choose(n,k) {
  if(k<0 || k>n) return 0;
  let value=1;for(let i=1;i<=k;i++) value=value*(n-i+1)/i;return value;
}
function handCountTotal(positions,total) {
  // Partition extras between height-3 and height-2 columns, then place the groups.
  let ways=0;
  for(let tall=1;tall<=positions;tall++) {
    const middle=total-positions-2*tall;
    if(middle>=0 && tall+middle<=positions) ways += choose(positions,tall)*choose(positions-tall,middle);
  }
  return ways;
}
assert.equal(api.registrationOnly,true);assert.equal(api.learnerReleaseVerified,false);assert.equal(api.officialAnswerVerified,false);
assert.equal(api.definitions.length,6);deeplyFrozen(api);
const fullDefinitionsBefore=JSON.stringify(api.definitions);
let modelCount=0,enumeratedAccepted=0,oracleTrials=0;
for(const fixture of fixtures) {
  const {suffix,answer,...sourceCondition}=fixture,id=`6-2-u3-e2-${suffix}`;
  const definition=api.definitions.find(item=>item.sourceItemId===id);
  assert.deepEqual(definition.pools[0],sourceCondition);assert.equal(definition.variantCount,3);
  if(suffix.startsWith("exploration")) {
    assert.equal(definition.source.rawSourceItemId,"6-2-u3-e2-exploration");assert.equal(definition.source.subquestion,Number(suffix.at(-1)));
  } else assert.equal(definition.source.rawSourceItemId,id);
  for(let variant=0;variant<3;variant++) {
    const condition=definition.pools[variant],snapshot=JSON.stringify(condition),result=api.solve(id,variant);
    const oracle=voxelOracle(condition);
    const canonical = arrays => arrays.map(matrix=>JSON.stringify(matrix)).sort();
    assert.deepEqual(canonical(result.arrangements),canonical(oracle.arrangements));
    assert.equal(result.visited,result.searchSize);assert.equal(result.arrangementCount,oracle.arrangements.length);
    assert.equal(result.uniqueRequestedNumericAnswer,true);assert.equal(result.uniqueArrangement,false);
    assert.equal(result.officialAnswerVerified,false);assert.equal(result.learnerReleaseVerified,false);
    const totals=oracle.arrangements.map(matrix=>matrix.flat().reduce((a,b)=>a+b,0));
    assert.equal(result.minimum,Math.min(...totals));assert.equal(result.maximum,Math.max(...totals));assert.equal(result.minMaxSum,result.minimum+result.maximum);
    for(const [name,total] of [["minimumWitness",result.minimum],["maximumWitness",result.maximum]]) {
      assert(oracle.arrangements.some(matrix=>equal(matrix,result[name])));assert.equal(result[name].flat().reduce((a,b)=>a+b,0),total);
    }
    if(suffix.startsWith("exploration")) {
      const peak=condition.front[0];assert.equal(result.arrangementCount,peak*3);
      assert.equal(result.minimum,2*peak+9);assert.equal(result.maximum,3*peak+9);assert.equal(result.minMaxSum,5*peak+18);
    } else if(suffix === "mission-4") {
      const low=condition.front[1]-1;assert.equal(result.arrangementCount,2*low*low+4*low+1);
    } else if(suffix === "mission-2") {
      const separate=require("./source-6-2-stack-minmax-mission2-models.js").solve(id,variant);
      assert.deepEqual(result.condition,separate.condition);assert.deepEqual(canonical(result.arrangements),canonical(separate.arrangements));
      const peak=condition.front[0];assert.equal(result.arrangementCount,9);
      assert.equal(result.minimum,peak+13);assert.equal(result.maximum,peak+16);
      assert.equal(result.answer,2*peak+29);
    } else assert.equal(result.arrangementCount,handCountTotal(condition.top.flat().filter(Boolean).length,condition.total));
    if(variant===0) assert.equal(result.answer,answer);
    assert.equal(JSON.stringify(condition),snapshot);deeplyFrozen(result);
    modelCount++;enumeratedAccepted+=result.arrangementCount;oracleTrials+=oracle.candidates;
  }
}
// Empty margins are meaningful coordinates, not automatic cropping.
const padded={top:[[0,0,0],[0,1,1],[0,1,0]],front:[0,2,1],right:[1,2,0]};
const paddedResult=api.enumerate(padded);
assert.equal(paddedResult.arrangementCount,1);assert.deepEqual(paddedResult.arrangements[0],[[0,0,0],[0,2,1],[0,1,0]]);
assert.deepEqual(paddedResult.condition,padded);
const sourceExample=clone(api.definitions[2].pools[0]);
assert.equal(api.enumerate({...sourceExample,top:[[1,0,1],[1,1,1]]}).arrangementCount,50);
assert.equal(api.enumerate(sourceExample).arrangementCount,75); // A missing square changes the answer.
const small={top:[[1,0],[1,1],[1,1]],total:8,highest:3};
assert.equal(api.enumerate(small).arrangementCount,20);
assert.equal(voxelOracle({...small,highest:2}).arrangements.length,10); // Exact highest, not "at most 3".
const fixed=clone(small);fixed.fixedHeights=[[3,0],[null,null],[null,null]];
assert.equal(api.enumerate(fixed).arrangementCount,4);assert.equal(voxelOracle(fixed).arrangements.length,4);
const reversed=clone(api.definitions[0].pools[0]);reversed.right.reverse();
assert.equal(voxelOracle(reversed).arrangements.length,0);
let negativeTests=0;
const bad=[null,{},[],{top:[]},{top:[[0]]},{top:[[1],[1,0]],total:3,highest:2},
  {top:[[2]],total:2,highest:2},{top:[[true]],total:1,highest:1},{top:[[1]]},
  {top:[[1]],front:[1]},{top:[[1]],front:[1],right:[0]},{top:[[1]],front:[0],right:[1]},
  {top:[[1]],front:[1,1],right:[1]},{top:[[1]],front:[7],right:[7]},
  {top:[[1]],total:0,highest:1},{top:[[1]],total:2,highest:1},{top:[[1]],total:1,highest:0},
  {top:[[1]],total:1.5,highest:1},{top:[[1]],total:1,highest:1,hidden:1},
  {top:[[1]],total:1,highest:1,fixedHeights:[[2]]},{top:[[1,0]],total:1,highest:1,fixedHeights:[[1,1]]},
  {top:[[1]],total:1,highest:1,fixedHeights:[]},{top:[[1]],total:1,highest:2,fixedHeights:[[0]]},
  {top:[[1]],total:1,highest:2},reversed,
  {top:Array.from({length:6},()=>Array(6).fill(1)),total:40,highest:6}];
for(const condition of bad) {assert.throws(()=>api.enumerate(condition),RangeError);negativeTests++;}
for(const [source,variant] of [["missing",0],[fixtures[0].suffix,0],[api.definitions[0].sourceItemId,-1],[api.definitions[0].sourceItemId,3],[api.definitions[0].sourceItemId,.5]]) {
  assert.throws(()=>api.solve(source,variant),RangeError);negativeTests++;
}
assert.equal(JSON.stringify(api.definitions),fullDefinitionsBefore);
assert.throws(()=>{api.definitions[2].pools[0].top[0][0]=0;},TypeError);
const sentinel={names:["existing"],generate:()=>"existing"}, browser={window:{HSE_GENERATORS:sentinel}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"source-6-2-stack-count-models.js"),"utf8"),browser);
assert.equal(browser.window.HSE_GENERATORS,sentinel);assert.deepEqual(sentinel.names,["existing"]);
assert.equal(browser.window.HSE_SOURCE_GRADE6_STACK_COUNT_MODELS.solve("6-2-u3-e2-example-1").answer,75);
for(const name of protectedNames) assert.equal(digest(name),before[name]);
console.log(JSON.stringify({status:"passed",modelCount,sourceAnswers:fixtures.map(item=>({sourceItemId:`6-2-u3-e2-${item.suffix}`,answer:item.answer})),
  enumeratedAccepted,oracleTrials,negativeTests,missingCellControl:true,exactHighestControl:true,reverseDirectionControl:true,
  protectedFilesUnchanged:true,generatorRegistration:false,learnerRelease:false,unlockCount:0},null,2));
