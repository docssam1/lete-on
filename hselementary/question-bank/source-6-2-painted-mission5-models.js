(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-painted-mission5-scale.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION5_MODELS=factory(root.HSE_SOURCE_GRADE6_PAINTED_MISSION5_SCALE);
})(typeof window!=="undefined" ? window : globalThis,function(scale){
  "use strict";
  function freeze(v){if(v && typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  const heights=freeze([[1,2,2,2,2,3],[1,1,1,2,3,3],[0,1,1,2,2,2],[0,0,1,1,1,1]]),edges=freeze([6,3,9]);
  const directions=freeze([["right",1,0,0],["left",-1,0,0],["top",0,1,0],["bottom",0,-1,0],["front",0,0,1],["back",0,0,-1]]);
  function solve(variant=0){
    if(!Number.isSafeInteger(variant)||variant<0||variant>=3)throw new RangeError("Unreviewed Mission5 scale variant");
    const edge=edges[variant],cells=[];
    heights.forEach((row,z)=>row.forEach((h,x)=>{for(let y=0;y<h;y++)cells.push([x,y,z]);}));
    const occupied=new Set(cells.map(c=>c.join(","))),histogram=Array(7).fill(0),faceCounts=Object.fromEntries(directions.map(([name])=>[name,0]));
    const layerGrids=Array.from({length:3},()=>heights.map(row=>row.map(()=>null)));
    const colored=cells.map(cell=>{
      const boundary=directions.filter(([,dx,dy,dz])=>!occupied.has([cell[0]+dx,cell[1]+dy,cell[2]+dz].join(",")));
      boundary.forEach(([name])=>faceCounts[name]++);
      const faces=boundary.filter(([,dx,dy])=>!(dy===-1&&cell[1]===0)).map(([name])=>name);
      histogram[faces.length]++;layerGrids[cell[1]][cell[2]][cell[0]]=faces.length;
      return {cell,faces,painted:faces.length};
    });
    const externalFaceCount=Object.values(faceCounts).reduce((a,b)=>a+b,0),paintedFaces=histogram.reduce((sum,n,k)=>sum+n*k,0);
    const areaOfExactlyTwoPaintedFaces=histogram[2]*2*edge*edge;
    const arithmetic=scale.solve({cubeCount:cells.length,exactlyTwoPaintedCubes:histogram[2],externalFaceCount,floorFaceCount:faceCounts.bottom,areaOfExactlyTwoPaintedFaces});
    return freeze({sourceItemId:"6-2-u3-e3-mission-5",normalizedTypeIds:["6-2-u3-e3-mission-5-1","6-2-u3-e3-mission-5-2"],variant,edge,heights,cells,colored,histogram,layerGrids,faceCounts,externalFaceCount,paintedFaces,areaOfExactlyTwoPaintedFaces,...arithmetic,
      sourceRef:{pdfPage:35,printedPage:37,sourceSha256:"69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE",cropSha256:"d4d476e01f92513bf01fb81f62ba762775c8e8811b2eb9c06a9f6c3dc9890d36"},
      conditionPolicy:{groundedColumns:true,hiddenGaps:false,bottomFacesPainted:false,occludedExteriorFacesPainted:true,separatedAfterPainting:true,repaintAfterSeparation:false,surfaceAreaIncludesBottom:true,answerAreaOfOriginalSolid:true},
      requestedAnswerUnique:true,sourceFidelityVerified:true,registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false,empiricallyCalibrated:false});
  }
  function rendererModel(){
    const model=solve(),rotated=Array.from({length:6},()=>Array(4).fill(0));
    heights.forEach((row,z)=>row.forEach((height,x)=>rotated[5-x][z]=height));
    const cells=model.cells.map(([x,y,z])=>[z,y,5-x]);
    return freeze({heights:rotated,sourceToRenderer:"[x,y,z] -> [z,y,5-x]; rigid quarter-turn, not a reflection",cameraDirection:[1.3,1.1,1],
      cubes(given){if(JSON.stringify(given)!==JSON.stringify(rotated))throw new RangeError("Only the verified Mission5 renderer matrix is allowed");return cells;}});
  }
  return freeze({solve,rendererModel,heights,edges,directions,registrationOnly:true,learnerReleaseVerified:false});
});
