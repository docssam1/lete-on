"use strict";
const assert=require("node:assert/strict"),contracts=require("./source-6-2-stack-color-example4-contracts.js");
let questions=0,witnessCells=0;
for(let v=0;v<3;v++)for(let level=0;level<3;level++){
  const q=contracts.generate("6-2-u3-e2-example-4",v,level),h=[5,4,6][v],minimum=10+3*(h-1),maximum=10+12*(h-1);
  assert.deepEqual(q.answer,{maximum,minimum});assert.equal(q.rows.reduce((sum,row)=>sum+row.minimum,0),minimum);assert.equal(q.rows.reduce((sum,row)=>sum+row.maximum,0),maximum);
  assert.equal(q.clue?.unshownCount??null,level===0 ? 9*(h-1) : null);
  assert.equal(q.secondary?.answer??null,level===2 ? Math.floor(9*(h-1)/2) : null);
  if(level===2){
    assert(q.promptText.includes("그림에서 색을 확인할 수 없는 쌓기나무 중 어두운 색"));
    assert.equal(q.witnessLayers.flat(2).reduce((a,b)=>a+b,0),q.secondary.targetDark);
    for(let y=0;y<h;y++)for(let z=0;z<4;z++)for(let x=0;x<4;x++){
      witnessCells++;if(y===h-1 || x===3 || z===3)assert.equal(q.witnessLayers[y][z][x],q.minimumLayers[y][z][x]);
    }
  }
  assert.equal(q.conditionPolicy.unshownColorsAreFree,true);assert.equal(q.conditionPolicy.alternatingHiddenColors,false);assert.equal(q.officialAnswerVerified,false);questions++;
}
let negative=0;for(const [id,v,l] of [["other",0,1],["6-2-u3-e2-example-4",3,1],["6-2-u3-e2-example-4",0,3],["6-2-u3-e2-example-4",0,-1],["6-2-u3-e2-example-4",0,"1"],["6-2-u3-e2-example-4",0,NaN]]){assert.throws(()=>contracts.generate(id,v,l));negative++;}
console.log(JSON.stringify({status:"passed",questions,witnessCells,negativeControls:negative,learnerReleaseVerified:false}));
