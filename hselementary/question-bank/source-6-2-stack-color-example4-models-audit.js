"use strict";
const assert=require("node:assert/strict"),models=require("./source-6-2-stack-color-example4-models.js");
const answers=[[58,22],[46,19],[70,25]],sourceTop=[[1,1,1,1],[0,1,0,0],[1,1,1,1],[0,1,0,0]],front=[0,1,0,0],right=[1,0,1,0];
let cells=0,layerAssignments=0;
for(let v=0;v<3;v++){
  const m=models.solve("6-2-u3-e2-example-4",v);assert.deepEqual([m.maximum,m.minimum],answers[v]);assert.equal(m.shown.length,16+7*(m.height-1));assert.equal(m.unshown.length,9*(m.height-1));
  const independentlyShown=new Map();
  for(let z=0;z<4;z++)for(let x=0;x<4;x++)independentlyShown.set([x,m.height-1,z].join(","),sourceTop[z][x]);
  for(let y=0;y<m.height;y++)for(let x=0;x<4;x++){const k=[x,y,3].join(",");if(independentlyShown.has(k))assert.equal(independentlyShown.get(k),front[x]);independentlyShown.set(k,front[x]);}
  for(let y=0;y<m.height;y++)for(let z=0;z<4;z++){const k=[3,y,z].join(",");if(independentlyShown.has(k))assert.equal(independentlyShown.get(k),right[z]);independentlyShown.set(k,right[z]);}
  assert.equal(independentlyShown.size,m.shown.length);assert.equal([...independentlyShown.values()].filter(Boolean).length,m.minimum);
  for(const mode of ["minimum","maximum"]){
    const layers=m[`${mode}Layers`],marked=new Set(m[`marked${mode[0].toUpperCase()+mode.slice(1)}`].map(cell=>cell.join(",")));
    for(const cell of m.cells){cells++;const [x,y,z]=cell,k=cell.join(","),shown=independentlyShown.get(k);assert.equal(layers[y][z][x],marked.has(k)?1:0);if(shown!==undefined)assert.equal(layers[y][z][x],shown);}
    assert.equal(layers.flat(2).reduce((a,b)=>a+b,0),m[mode]);
  }
  // Enumerate each free nine-cell layer. Extremes combine independently across lower layers.
  for(let y=0;y<m.height-1;y++){
    let lo=Infinity,hi=-Infinity;
    for(let bits=0;bits<512;bits++){
      let dark=3;for(let bit=0;bit<9;bit++)dark+=(bits>>bit)&1;lo=Math.min(lo,dark);hi=Math.max(hi,dark);layerAssignments++;
    }assert.equal(lo,3);assert.equal(hi,12);
  }
  assert.equal(m.minimum,10+3*(m.height-1));assert.equal(m.maximum,10+12*(m.height-1));assert.equal(m.conditionPolicy.alternatingHiddenColors,false);
}
let negative=0;for(const [id,v] of [["other",0],["6-2-u3-e2-example-4",-1],["6-2-u3-e2-example-4",3],["6-2-u3-e2-example-4",.5],["6-2-u3-e2-example-4","0"],["6-2-u3-e2-example-4",NaN]]){assert.throws(()=>models.solve(id,v));negative++;}
console.log(JSON.stringify({status:"passed",variants:3,cells,independentLayerAssignments:layerAssignments,negativeControls:negative,learnerReleaseVerified:false}));
