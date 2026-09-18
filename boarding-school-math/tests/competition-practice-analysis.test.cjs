"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const bank=require("../competition/grade6-competition-type-bank.js");
const analysis=require("../competition/competition-practice-analysis.js");

const sasmo=bank.items.filter(function(item){return item.programId==="sasmo-g6";});

test("empty public practice evidence stays explicitly non-diagnostic",function(){
  const result=analysis.summarize(sasmo,new Map());
  assert.equal(result.attempted,0);
  assert.equal(result.accuracy,null);
  assert.equal(result.readinessBand,"collecting");
  assert.equal(result.formalDiagnostic,false);
  assert.equal(result.officialPrediction,false);
  assert.deepEqual(result.unmeasuredAxes,analysis.AXES);
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
  assert.equal(result.accuracy,50);
  assert.equal(result.priorityAxis,"problem-solving-strategies");
  assert.equal(result.strengthAxis,"patterns-algebra");
  assert.deepEqual(result.observedMisconceptions,["halve-total-without-removing-difference"]);
  assert.equal(result.itemEvidence[0].attemptCount,2);
  assert.equal(result.itemEvidence[0].firstCorrect,false);
});

test("a readiness band appears only after every item has first-attempt evidence",function(){
  const attempts=new Map();
  sasmo.forEach(function(item,index){attempts.set(item.id,{responses:[{correct:index!==0}],solved:index!==0});});
  const result=analysis.summarize(sasmo,attempts);
  assert.equal(result.complete,true);
  assert.equal(result.firstCorrect,9);
  assert.equal(result.accuracy,90);
  assert.equal(result.readinessBand,"strong");
  const dataDomain=result.domains.find(function(domain){return domain.axis==="data-probability";});
  assert.equal(dataDomain.itemCount,0);
  assert.equal(dataDomain.evidenceState,"unmeasured");
});
