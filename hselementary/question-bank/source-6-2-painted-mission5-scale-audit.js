"use strict";
const assert=require("node:assert/strict"),scale=require("./source-6-2-painted-mission5-scale.js");
let cases=0;
// Rectangular solids are calibration fixtures, not replacements for the source picture.
for(let x=2;x<=7;x++)for(let y=2;y<=7;y++)for(let z=2;z<=7;z++)for(const edge of [1,2,3,4,6,9]){
  let exactlyTwo=0;
  for(let a=0;a<x;a++)for(let b=0;b<y;b++)for(let c=0;c<z;c++){
    const count=Number(a===0)+Number(a===x-1)+Number(b===0)+Number(b===y-1)+Number(c===z-1);
    if(count===2)exactlyTwo++;
  }
  const cubeCount=x*y*z,externalFaceCount=2*(x*y+y*z+z*x),floorFaceCount=x*y;
  const result=scale.solve({cubeCount,exactlyTwoPaintedCubes:exactlyTwo,externalFaceCount,floorFaceCount,areaOfExactlyTwoPaintedFaces:exactlyTwo*2*edge*edge});
  assert.equal(result.edge,edge);assert.equal(result.volume,(x*edge)*(y*edge)*(z*edge));
  const bottom=x*edge*y*edge,front=x*edge*z*edge,side=y*edge*z*edge;
  assert.equal(result.surfaceArea,2*(bottom+front+side));assert.equal(result.paintedArea,bottom+2*(front+side));
  assert.equal(result.surfaceArea-result.paintedArea,bottom);assert.equal(result.learnerReleaseVerified,false);cases++;
}
const valid={cubeCount:8,exactlyTwoPaintedCubes:4,externalFaceCount:24,floorFaceCount:4,areaOfExactlyTwoPaintedFaces:32};
const invalid=[null,{},...Object.keys(valid).map(key=>({...valid,[key]:0})),...Object.keys(valid).map(key=>({...valid,[key]:1.5})),{...valid,areaOfExactlyTwoPaintedFaces:33},{...valid,areaOfExactlyTwoPaintedFaces:16},{...valid,exactlyTwoPaintedCubes:9},{...valid,floorFaceCount:9},{...valid,externalFaceCount:49},{...valid,externalFaceCount:4},{...valid,areaOfExactlyTwoPaintedFaces:Number.MAX_SAFE_INTEGER}];
invalid.forEach(facts=>assert.throws(()=>scale.solve(facts)));
let irregularCases=0;
for(let code=1;code<4**6;code++){
  let value=code;
  const heights=Array.from({length:2},()=>Array.from({length:3},()=>{const h=value%4;value=Math.floor(value/4);return h;}));
  const cells=[];
  heights.forEach((row,z)=>row.forEach((height,x)=>{for(let y=0;y<height;y++)cells.push([x,y,z]);}));
  const occupied=new Set(cells.map(c=>c.join(","))),directions=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  let two=0,exposed=0;
  for(const [x,y,z] of cells){
    let painted=0;
    for(const [dx,dy,dz] of directions)if(!occupied.has([x+dx,y+dy,z+dz].join(","))){exposed++;if(!(dy===-1&&y===0))painted++;}
    if(painted===2)two++;
  }
  if(!two)continue;
  const floor=heights.flat().filter(h=>h>0).length;
  let boundary=floor*2;
  heights.forEach((row,z)=>row.forEach((h,x)=>{if(!h)return;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])boundary+=Math.max(0,h-(heights[z+dz]?.[x+dx]||0));}));
  assert.equal(exposed,boundary);
  const result=scale.solve({cubeCount:cells.length,exactlyTwoPaintedCubes:two,externalFaceCount:exposed,floorFaceCount:floor,areaOfExactlyTwoPaintedFaces:two*18});
  assert.equal(result.volume,cells.length*27);assert.equal(result.surfaceArea,boundary*9);assert.equal(result.paintedArea,(boundary-floor)*9);irregularCases++;
}
assert(Object.isFrozen(scale.solve(valid)));
console.log(JSON.stringify({status:"passed",syntheticScaleCases:cases,irregularHeightMaps:irregularCases,rejected:invalid.length,sourceModelVerified:false,registered:false}));
