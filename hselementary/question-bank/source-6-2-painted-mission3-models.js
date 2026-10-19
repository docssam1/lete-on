(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory();
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION3_MODELS=factory();
})(typeof window!=="undefined" ? window : globalThis,function(){
  "use strict";
  function freeze(value){if(value && typeof value==="object" && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  const id="6-2-u3-e3-mission-3",base=[[0,0,1,0,0,0],[2,3,2,0,0,0],[2,1,1,1,1,2]];
  const directions=freeze([["right",1,0,0],["left",-1,0,0],["top",0,1,0],["bottom",0,-1,0],["front",0,0,1],["back",0,0,-1]]);
  const pools=freeze([1,2,3].map(height=>base.map((row,z)=>row.map((h,x)=>z===0 && x===2 ? height : h))));
  function solve(variant=0){
    if(!Number.isSafeInteger(variant) || variant<0 || variant>=3)throw new RangeError("Unreviewed Mission3 variant");
    const heights=pools[variant].map(row=>[...row]),cells=[];
    for(let z=0;z<heights.length;z++)for(let x=0;x<heights[z].length;x++)for(let y=0;y<heights[z][x];y++)cells.push([x,y,z]);
    const occupied=new Set(cells.map(cell=>cell.join(","))),histogram=Array(7).fill(0),layerGrids=Array.from({length:3},()=>heights.map(row=>row.map(()=>null)));
    const colored=cells.map(cell=>{
      const faces=directions.filter(([,dx,dy,dz])=>!(dy===-1 && cell[1]===0) && !occupied.has([cell[0]+dx,cell[1]+dy,cell[2]+dz].join(","))).map(([name])=>name);
      histogram[faces.length]++;layerGrids[cell[1]][cell[2]][cell[0]]=faces.length;
      return {cell,faces,painted:faces.length};
    });
    const layerCounts=layerGrids.map(grid=>grid.flat().filter(n=>n!==null).length),A=histogram[4],B=histogram[3];
    return freeze({sourceItemId:id,variant,heights,cells,colored,histogram,layerGrids,layerCounts,A,B,answer:10*A+B,paintedFaces:histogram.reduce((sum,n,k)=>sum+n*k,0),
      sourceRef:{pdfPage:35,printedPage:37,sourceSha256:"69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE",cropSha256:"44f3eb61b8dce46409456d2ab5ba11bd29099ed8efc5fa4178844de9fce9e4fa"},
      projection:{kind:"cabinet",depthX:.75,depthY:.48},conditionPolicy:{groundedColumns:true,hiddenGaps:false,bottomFacesPainted:false,allOtherExposedFacesPainted:true,occludedExteriorFacesPainted:true,repaintAfterSeparation:false,viewConvention:"H[z][x], back-to-front rows, left-to-right columns"},
      requestedAnswerUnique:true,variantCount:3,registrationOnly:true,officialAnswerVerified:false,sourceFidelityVerified:false,learnerReleaseVerified:false,difficultyVerified:false});
  }
  function rendererModel(variant=0){
    const model=solve(variant);
    return freeze({model,cubes(heights){if(JSON.stringify(heights)!==JSON.stringify(model.heights))throw new RangeError("Only the selected Mission3 height matrix is allowed");return model.cells;}});
  }
  return freeze({solve,rendererModel,sourceItemId:id,pools,directions,registrationOnly:true,learnerReleaseVerified:false});
});
