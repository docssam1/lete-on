(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-plane-cut-models.js"));
 else root.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_MODELS=factory(root.HSE_SOURCE_GRADE6_PLANE_CUT_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(geometry){
 "use strict";
 if(!geometry||!["planeFromPoints","cubeClass","sectionPolygon"].every(name=>typeof geometry[name]==="function"))throw new Error("Existing plane geometry must load first");
 const id="6-2-u3-e4-mission-1",freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const key=c=>c.join(","),sourceRows=["00010","11010","01010","01110"],pool=[0,1,2],width=5,height=4,depth=5;
 const frontPools=freeze([sourceRows,sourceRows.map((row,index)=>index===2?"01110":row),sourceRows.map((row,index)=>index===1?"11110":index===3?"00110":row)]);
 function cellsFromMask(frontRows){return frontRows.flatMap((row,index)=>[...row].flatMap((value,x)=>value==="1"?Array.from({length:depth},(_,z)=>[x,height-1-index,z]):[]));}
 function solve(sourceItemId,variant=0){
  if(sourceItemId!==id||!Number.isSafeInteger(variant)||!pool.includes(variant))throw new RangeError("Unverified colored-cut source or variant");
  const frontRows=frontPools[variant],topRows=Array.from({length:depth},()=>frontRows[0]),points={"\uAC00":[0,height,depth],"\uB098":[0,height,0],"\uB2E4":[width,0,0],"\uB77C":[width,0,depth]};
  const plane=geometry.planeFromPoints([points["\uAC00"],points["\uB098"],points["\uB2E4"]].map(p=>p.map(n=>2*n)));
  if(Object.values(points).some(p=>p.reduce((n,v,i)=>n+2*v*plane.normal[i],0)!==plane.constant))throw new Error("Four source vertices are not coplanar");
  const darkCells=cellsFromMask(frontRows),dark=new Set(darkCells.map(key)),cubes=[],cutCells=[],touchCells=[],darkCutCells=[],darkUncutCells=[],layers=[],frontCells=[];
  for(let y=0;y<height;y++){
   const cells=[],cut=[],touch=[],darkRow=[],darkCut=[],darkUncut=[];
   for(let x=0;x<width;x++)for(let z=0;z<depth;z++){
    const cell=[x,y,z],kind=geometry.cubeClass(cell,plane),colored=dark.has(key(cell));cubes.push(cell);cells.push([x,z]);
    if(kind.cut){cutCells.push(cell);cut.push([x,z]);}if(kind.touch){touchCells.push(cell);touch.push([x,z]);}
    if(colored){darkRow.push([x,z]);if(kind.cut){darkCutCells.push(cell);darkCut.push([x,z]);}else{darkUncutCells.push(cell);darkUncut.push([x,z]);}}
    if(z===0)frontCells.push({x,y,dark:colored,cut:kind.cut,touch:kind.touch});
   }
   layers.push({layer:y+1,cells,cutCells:cut,touchCells:touch,darkCells:darkRow,darkCutCells:darkCut,darkUncutCells:darkUncut});
  }
  const cycle=["\uAC00","\uB098","\uB2E4","\uB77C"],answerSectionEdges=cycle.map((from,i)=>({from,to:cycle[(i+1)%4],a:points[from],b:points[cycle[(i+1)%4]],style:i===3?"dashed":"solid"}));
  return freeze({sourceItemId:id,variant,width,height,depth,n:height,dimensions:[width,height,depth],points,plane,cubes,frontRows,topRows,frontCells,darkCells,darkCutCells,darkUncutCells,cutCells,touchCells,layers,
   frontDarkCutCells:frontCells.filter(c=>c.dark&&c.cut).map(c=>[c.x,c.y,0]),frontDarkUncutCells:frontCells.filter(c=>c.dark&&!c.cut).map(c=>[c.x,c.y,0]),
   darkCount:darkCells.length,darkCutCount:darkCutCells.length,darkUncutCount:darkUncutCells.length,cutCount:cutCells.length,
   planeSection:geometry.sectionPolygon([0,0,0],[width,height,depth],plane),sectionEdges:[],answerSectionEdges,
   sourceProjection:{kind:"source-affine",horizontal:[Math.sqrt(3)/2,0,-Math.sqrt(3)/2],vertical:[-.5,1,-.5]},
   darkPatternScope:"exact-union-of-shown-face-dark-rods-no-hidden-extras",boundaryContactIsCut:false,
   sourceRef:{pdfPage:37,printedPage:39,mission:1},sourceGeometryMatches:variant===0,requiresOriginalReview:true,originalSourceReleaseStatus:"locked",sourceExact:false,
   publisherAnswerVerified:false,officialAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,empiricallyCalibrated:false,learnerReleaseVerified:false,registrationOnly:true});
 }
 function matchesExactDarkPattern(model,cells){
  if(!model||model.sourceItemId!==id||!Number.isSafeInteger(model.variant)||!pool.includes(model.variant)||!Array.isArray(cells)||cells.some(c=>!Array.isArray(c)||c.length!==3||c.some(n=>!Number.isSafeInteger(n))))return false;
  const expected=new Set(cellsFromMask(frontPools[model.variant]||[]).map(key)),actual=new Set(cells.map(key));
  return expected.size===cells.length&&actual.size===cells.length&&[...actual].every(c=>expected.has(c));
 }
 return freeze({solve,matchesExactDarkPattern,sourceItemId:id,sourceItemIds:[id],pool,frontPools,registrationOnly:true,learnerReleaseVerified:false});
});
