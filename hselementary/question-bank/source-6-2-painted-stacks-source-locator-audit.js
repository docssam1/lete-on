"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
global.window={};require("./source-inventory-grade6.js");
const models=require("./source-6-2-painted-stacks-models.js"),readiness=JSON.parse(fs.readFileSync(path.join(__dirname,"source-inventory/6-2-u3-e3-readiness-review.json"),"utf8"));
const sourceItems=JSON.parse(fs.readFileSync(path.join(__dirname,"source-inventory/6-2-source-items.json"),"utf8")).items;
const expected=[
  {id:"6-2-u3-e3-example-1",label:"예제 3-1",section:"example",page:36,kind:"height-grid",grid:[[0,5,0,0],[0,3,0,0],[3,3,3,3],[0,2,2,2],[0,2,0,2]]},
  {id:"6-2-u3-e3-mission-2",label:"Mission 2",section:"mission",page:37,kind:"height-grid",grid:[[0,2,3],[1,2,1],[2,0,2]]},
  {id:"6-2-u3-e3-mission-4",label:"Mission 4",section:"mission",page:37,kind:"height-grid-with-directions",grid:[[3,2,0],[2,1,0],[3,2,1]]}
];
function check(item,record,reference){assert.equal(item.sourceItemId,reference.id);assert.equal(item.sourceItemLabel,reference.label);assert.equal(item.sourceSection,reference.section);assert.equal(record.printedItemLabel,reference.label);assert.equal(record.sourceDiagramKind,reference.kind);assert.equal(models.solve(reference.id,0).sourceRef.printedPage,reference.page);assert.deepEqual(models.solve(reference.id,0).heights,reference.grid);}
let negative=0;
for(const reference of expected){
  const item=window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId===reference.id),record=readiness.items.find(i=>i.sourceItemId===reference.id);
  const source=sourceItems.find(i=>i.sourceItemId===reference.id);assert(source.sourceShape.includes("원문 자체가 위에서 본"));assert.equal(source.implementationStatus,"fixed-verified-pool");assert.equal(source.reviewReason,"");
  check(item,record,reference);
  assert.throws(()=>check({...item,sourceItemLabel:"개념탐구 3"},record,reference));negative++;
  assert.throws(()=>check(item,{...record,sourceDiagramKind:"perspective-3d"},reference));negative++;
}
const exploration=window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId==="6-2-u3-e3-exploration"),explorationSource=sourceItems.find(i=>i.sourceItemId===exploration.sourceItemId);assert.equal(exploration.sourceItemLabel,"개념탐구 3");assert.equal(exploration.generatorKey,"sourceGrade6SecondSpaceE3PaintedExploration");assert.equal(exploration.sourceConditionsClarified,true);assert.equal(exploration.originalAnswerDeterminate,false);assert.equal(explorationSource.originalSourceDecision,"locked");assert.equal(explorationSource.clarifiedCandidateCount,1);
console.log(JSON.stringify({status:"passed",sourceItems:3,separateExplorationPreserved:true,negativeCases:negative,sourceScope:"printed item and section, not page alone"}));
