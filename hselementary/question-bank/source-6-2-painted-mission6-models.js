(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory();
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION6_MODELS=factory();
})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  function freeze(v){if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  const sourceFootprint=freeze([[1,1,1,0,1,1],[1,1,1,1,1,1],[0,0,1,1,1,0],[0,0,1,1,1,1],[1,1,1,0,1,1],[1,1,1,0,1,1]]),heightsPerVariant=freeze([5,4,6]);
  const directions=freeze([["right",1,0,0],["left",-1,0,0],["top",0,1,0],["bottom",0,-1,0],["front",0,0,1],["back",0,0,-1]]);
  const fittedCamera=freeze({u:[35.22962962962961,-.02666666666667794,20.93518518518517],v:[6.6888888888888545,-34.88000000000001,-20.777777777777775]});
  const scale=-fittedCamera.v[1],projection=freeze({kind:"source-affine",horizontal:[fittedCamera.u[0]/scale,fittedCamera.u[1]/scale,-fittedCamera.u[2]/scale],vertical:[-fittedCamera.v[0]/scale,-fittedCamera.v[1]/scale,fittedCamera.v[2]/scale]});
  function solve(variant=0){
    if(!Number.isSafeInteger(variant)||variant<0||variant>=3)throw new RangeError("Unreviewed Mission6 height variant");
    const height=heightsPerVariant[variant],sourceHeights=sourceFootprint.map(row=>row.map(on=>on*height)),heights=sourceHeights.slice().reverse().map(row=>[...row]),cells=[];
    heights.forEach((row,z)=>row.forEach((h,x)=>{for(let y=0;y<h;y++)cells.push([x,y,z]);}));
    const occupied=new Set(cells.map(c=>c.join(","))),histogram=Array(7).fill(0),faceCounts=Object.fromEntries(directions.map(([name])=>[name,0]));
    const layerGrids=Array.from({length:height},()=>heights.map(row=>row.map(()=>null)));
    const colored=cells.map(cell=>{const faces=directions.filter(([,dx,dy,dz])=>!occupied.has([cell[0]+dx,cell[1]+dy,cell[2]+dz].join(","))).map(([name])=>name);histogram[faces.length]++;faces.forEach(name=>faceCounts[name]++);layerGrids[cell[1]][cell[2]][cell[0]]=faces.length;return {cell,faces,painted:faces.length};});
    const paintedFaces=Object.values(faceCounts).reduce((sum,n)=>sum+n,0),horizontalExposureCounts=Array(5).fill(0);
    heights.forEach((row,z)=>row.forEach((h,x)=>{if(h)horizontalExposureCounts[[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dz])=>!heights[z+dz]?.[x+dx]).length]++;}));
    const groupedLayers=[];layerGrids.forEach((matrix,y)=>{const key=JSON.stringify(matrix),group=groupedLayers.find(g=>g.key===key);if(group)group.layers.push(y+1);else groupedLayers.push({key,layers:[y+1],matrix});});
    return freeze({sourceItemId:"6-2-u3-e3-mission-6",variant,height,sourceHeights,heights,cells,colored,histogram,faceCounts,paintedFaces,horizontalExposureCounts,layerGrids,groupedLayers,projection,
      sourceRef:{pdfPage:35,printedPage:37,printedItemLabel:"Mission 6",sourceSha256:"69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE",cropSha256:"278207f245d2a4b1cbbb0cd94bd380fe49434abe34ec6ddcb643a26c9738aef3"},
      conditionPolicy:{groundedColumns:true,hiddenGaps:false,bottomFacesPainted:true,allExposedFacesPainted:true,separatedAfterPainting:true,repaintAfterSeparation:false,sourceToRenderer:"[x,y,z] -> [x,y,5-z]; source front-to-back axis is opposite the renderer row axis"},
      requestedAnswerUnique:true,registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false,empiricallyCalibrated:false});
  }
  function rendererModel(variant=0){const model=solve(variant);return freeze({model,heights:model.heights,projection,
    cubes(given){if(JSON.stringify(given)!==JSON.stringify(model.heights))throw new RangeError("Only the verified Mission6 matrix is allowed");return model.cells;}});}
  return freeze({solve,rendererModel,sourceFootprint,heightsPerVariant,directions,projection,fittedCamera,registrationOnly:true});
});
