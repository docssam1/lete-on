"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const bank=require("../competition/grade6-competition-type-bank.js");
const analysis=require("../competition/competition-practice-analysis.js");

const sasmo=bank.items.filter(function(item){return item.programId==="sasmo-g6";});

test("empty public practice evidence stays explicitly non-diagnostic",function(){
  const result=analysis.summarize(sasmo,new Map());
  assert.equal(result.attempted,0);
  assert.equal(result.formalDiagnostic,false);
  assert.equal(result.officialPrediction,false);
  assert.equal("domains" in result,false);
  assert.equal("readinessBand" in result,false);
  assert.equal("priorityAxis" in result,false);
  assert.equal("accuracy" in result,false);
  assert.equal("sections" in result,false);
  assert.equal("observedMisconceptions" in result,false);
});

test("first response drives the analysis even when a learner later solves the item",function(){
  const attempts=new Map([
    ["sasmo-g6-model-01",{responses:[{correct:false},{correct:true}],solved:true}],
    ["sasmo-g6-pattern-01",{responses:[{correct:true}],solved:true}]
  ]);
  const result=analysis.summarize(sasmo,attempts);
  assert.equal(result.attempted,2);
  assert.equal(result.solved,2);
  assert.equal(result.firstCorrect,1);
  assert.equal(result.itemEvidence[0].attemptCount,2);
  assert.equal(result.itemEvidence[0].firstCorrect,false);
  assert.equal("axis" in result.itemEvidence[0],false);
  assert.equal("misconception" in result.itemEvidence[0],false);
});

test("a solved flag without a recorded response cannot inflate solved totals",function(){
  const attempts=new Map([["sasmo-g6-model-01",{responses:[],solved:true}]]);
  const result=analysis.summarize(sasmo,attempts);
  assert.equal(result.attempted,0);
  assert.equal(result.solved,0);
  assert.equal(result.itemEvidence[0].solved,false);
});

test("completion reports item-level evidence without inventing a diagnostic band",function(){
  const attempts=new Map();
  sasmo.forEach(function(item,index){attempts.set(item.id,{responses:[{correct:index!==0}],solved:index!==0});});
  const result=analysis.summarize(sasmo,attempts);
  assert.equal(result.complete,true);
  assert.equal(result.firstCorrect,9);
  assert.equal("readinessBand" in result,false);
  assert.equal("domains" in result,false);
  assert.equal(result.itemEvidence.length,sasmo.length);
  assert.equal("accuracy" in result,false);
  assert.equal("sections" in result,false);
  assert.equal("tier" in result.itemEvidence[0],false);
});
