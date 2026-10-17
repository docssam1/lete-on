"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const models=require("./source-6-2-stack-count-models.js"),api=require("./source-6-2-stack-count-contracts.js");
const digest=name=>crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,name))).digest("hex");
const protectedNames=["index.html","source-inventory-grade6.js","source-inventory/6-2-source-items.json"];
const before=Object.fromEntries(protectedNames.map(name=>[name,digest(name)]));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const clone=value=>JSON.parse(JSON.stringify(value));
const totals=[
  [[4,12,12],[5,15,15],[6,18,18]],
  [[37,38,38],[42,43,43],[47,48,48]],
  [[15,75,75],[5,30,30],[30,120,120]],
  [[2,7,7],[3,17,17],[4,31,31]],
  [[4,20,20],[10,40,40],[16,50,50]],
  [[36,37,37],[38,39,39],[40,41,41]]
];
const secondaryAnswers=[[9,12,15],[2,2,2],[15,5,30],[2,8,18],[4,10,16],[2,2,2]];
let contractCount=0;
for(const [i,definition] of api.definitions.entries()) for(let variant=0;variant<3;variant++) {
  const original=models.solve(definition.sourceItemId,variant);
  const originalGrids=original.arrangements;
  for(let level=0;level<3;level++) {
    const q=api.generate(definition.sourceItemId,variant,level);
    assert.equal(q.answer,totals[i][variant][level]);
    assert.deepEqual(q.sourceRef,definition.source);assert.equal(q.level,level);assert.equal(q.variant,variant);
    assert.equal(q.learnerReleaseVerified,false);assert.equal(q.officialAnswerVerified,false);
    assert.equal(q.difficultyDesign.empiricallyCalibrated,false);
    assert(Object.isFrozen(q));assert(Object.isFrozen(q.arrangements));
    assert.deepEqual(Object.keys(q.givenViews),q.condition.front ? ["top","front","right"] : ["top"]);
    assert.deepEqual(q.givenViews.top,definition.pools[variant].top);
    const valid=level===0 ? originalGrids.filter(h=>h[q.clue.z][q.clue.x]===q.clue.height) : originalGrids;
    assert.deepEqual(q.arrangements,valid);
    assert(q.arrangements.length>0);
    if(level===0) {
      assert(q.arrangements.length<originalGrids.length);assert(q.clue);
      assert(q.promptText.includes(`뒤에서 ${q.clue.z+1}번째 줄, 왼쪽에서 ${q.clue.x+1}번째 칸은 ${q.clue.height}층`));
      assert(q.condition.fixedHeights.flat().filter(n=>n!==null && n>0).length===1);
    } else {assert.equal(q.clue,null);assert.deepEqual(q.condition,definition.pools[variant]);}
    if(level===2) {
      assert.equal(q.secondary.answer,secondaryAnswers[i][variant]);assert(q.promptText.includes(q.secondary.question));
      if(q.sourceItemId==="6-2-u3-e2-mission-2") assert.equal(q.secondary.countExpression,"1+1");
      assert(q.secondary.witnesses.length>0);assert(q.solutionText.includes(q.secondary.explanation));
      for(const witness of q.secondary.witnesses) {
        assert(valid.some(h=>equal(h,witness.heights)));
        if(q.secondary.kind==="minimum-arrangements") assert.equal(witness.heights.flat().reduce((a,b)=>a+b,0),q.minimum);
        else if(q.secondary.kind==="exactly-two-highest-columns") assert.equal(witness.heights.flat().filter(n=>n===Math.max(...q.condition.front,...q.condition.right)).length,2);
        else assert.equal(witness.heights[q.secondary.z][q.secondary.x],q.condition.highest);
      }
    }
    else assert.equal(q.secondary,null);
    if(q.sourceItemId==="6-2-u3-e2-mission-2" && level===0) assert(q.solutionText.includes(`칸은 ${q.clue.height}층으로 그대로 둡니다.`));
    if(definition.mode==="min-max-sum") {
      assert.deepEqual(q.groups.map(group=>group.label),["최소","최대"]);
      assert.equal(q.answer,q.minimum+q.maximum);
    } else assert.equal(q.groups.reduce((n,group)=>n+group.count,0),q.answer);
    for(const group of q.groups) {
      assert(valid.some(h=>equal(h,group.heights)));
      if(group.highestCount!==undefined) assert.equal(group.heights.flat().filter(n=>n===q.condition.highest).length,group.highestCount);
      if(group.total!==undefined) assert.equal(group.heights.flat().reduce((a,b)=>a+b,0),group.total);
    }
    assert(!/(조합|순열|제곱|프로필|투영|전수|힌트|최댓값)/.test(q.promptText));
    contractCount++;
  }
}
for(const level of [-1,3,.5,"1",null,undefined]) assert.throws(()=>api.generate(api.definitions[0].sourceItemId,0,level),RangeError);
for(const variant of [-1,3,.5,"0",null]) assert.throws(()=>api.generate(api.definitions[0].sourceItemId,variant,1),RangeError);
assert.throws(()=>api.generate("missing",0,1),RangeError);
const input=clone(models.definitions[0].pools[0]),snapshot=JSON.stringify(input);
models.enumerate(input);assert.equal(JSON.stringify(input),snapshot);
for(const name of protectedNames) assert.equal(digest(name),before[name]);
console.log(JSON.stringify({status:"passed",contractCount,negativeInputs:12,protectedFilesUnchanged:true,
  easierCasesAreStrictSubsets:true,sourceConditionsPreserved:true,harderPrimaryAnswersUnchanged:true,
  finitePools:3,officialAnswerVerified:false,learnerReleaseVerified:false,unlockCount:0},null,2));
