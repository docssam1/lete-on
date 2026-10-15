"use strict";
const assert=require("node:assert/strict"),contracts=require("./source-6-2-stack-hidden-example3-contracts.js");
const counts=[[10,6,4],[4,3,1],[20,10,10]],sourceH=[[6,5,4,3,2,1],[5,5,4,3,2,1],[4,4,3,2,1,0],[3,3,2,1,0,0],[2,2,1,0,0,0],[1,1,0,0,0,0]];
let questions=0,cells=0,negative=0;
for(let variant=0;variant<3;variant++)for(let level=0;level<3;level++){
  const q=contracts.generate("6-2-u3-e2-example-3",variant,level),H=q.condition.heights,hidden=[];
  if(variant===0)assert.deepEqual(H,sourceH);
  // Use column heights, not the generator's neighbor-set predicate.
  for(let z=0;z<H.length;z++)for(let x=0;x<H[0].length;x++)for(let y=0;y<H[z][x];y++){
    cells++;
    if(y>0 && y+1<H[z][x] && (H[z]?.[x-1]??0)>y && (H[z]?.[x+1]??0)>y && (H[z-1]?.[x]??0)>y && (H[z+1]?.[x]??0)>y)hidden.push([x,y,z]);
  }
  assert.deepEqual(q.answerCells,hidden);assert.equal(q.answer,counts[variant][0]);assert(q.condition.groundBottomCountedVisible);
  for(const row of q.rows)assert.equal(row.hidden,hidden.filter(cell=>cell[1]===row.layer-1).length);
  assert.equal(q.rows.reduce((sum,row)=>sum+row.hidden,0),q.answer);
  assert.equal(q.clue?.hidden??null,level===0 ? counts[variant][1] : null);
  assert.equal(q.secondary?.answer??null,level===2 ? counts[variant][2] : null);
  if(level===2){assert(q.promptText.includes("(1)") && q.promptText.includes("(2)"));assert(q.secondary.question.startsWith("어느 한 면도 보이지 않는 쌓기나무 중 원래 입체의 3층 이상"));}
  assert(q.promptText.includes("바닥부터 빈틈없이"));assert(q.promptText.includes("바닥에 닿은 면은 보이는"));
  assert.equal(q.difficultyDesign.empiricallyCalibrated,false);assert.equal(q.officialAnswerVerified,false);assert.equal(q.learnerReleaseVerified,false);
  questions++;
}
for(const [id,v,l] of [["wrong",0,1],["6-2-u3-e2-example-3",3,1],["6-2-u3-e2-example-3",-1,1],["6-2-u3-e2-example-3",0,-1],["6-2-u3-e2-example-3",0,3],["6-2-u3-e2-example-3",0,1.5],["6-2-u3-e2-example-3",0,"1"]]){assert.throws(()=>contracts.generate(id,v,l));negative++;}
console.log(JSON.stringify({status:"passed",questions,cells,negativeControls:negative,sourceHidden:10,learnerReleaseVerified:false}));
