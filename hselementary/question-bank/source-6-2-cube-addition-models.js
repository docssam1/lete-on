(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./generators.js"));
 else root.HSE_SOURCE_GRADE6_CUBE_ADDITION_MODELS=factory(root.HSE_GENERATORS?.polycubes);
})(typeof window!=="undefined"?window:globalThis,function(geometry){
 "use strict";
 if(!geometry||typeof geometry.canonicalPolycube!=="function"||geometry.rotationTransforms?.length!==24)throw new Error("Existing polycube geometry must load first");
 const id="6-2-u3-e4-example-4",key=c=>c.join(","),directions=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const sorted=cells=>cells.map(c=>[...c]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
 const definitions=freeze([[1,2,2,1],[3,2,1],[2,1,1,2]].map((heights,variant)=>({variant,cells:heights.flatMap((h,x)=>Array.from({length:h},(_,y)=>[x,y,0])),change:["source-six-cube-shape","six-cube-staircase","six-cube-raised-ends"][variant]})));
 const rotations=freeze(geometry.rotationTransforms.map((transform,index)=>{
  const columns=[[1,0,0],[0,1,0],[0,0,1]].map(transform),matrix=[0,1,2].map(row=>columns.map(c=>c[row]));
  const m=matrix,det=m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
  if(det!==1)throw new Error("Reflections are not physical rotations");return{index,matrix,determinant:det};
 }));
 if(new Set(rotations.map(r=>JSON.stringify(r.matrix))).size!==24)throw new Error("Duplicate physical rotations");
 function valid(cells){return Array.isArray(cells)&&[6,7].includes(cells.length)&&new Set(cells.map(key)).size===cells.length&&cells.every(c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger));}
 function orient(cells,index){if(!valid(cells)||!Number.isSafeInteger(index)||index<0||index>=24)throw new RangeError("Invalid rigid orientation");return cells.map(c=>rotations[index].matrix.map(row=>row.reduce((sum,n,i)=>sum+n*c[i],0)));}
 function solve(sourceItemId,variant=0,level=1){
  if(sourceItemId!==id||!Number.isSafeInteger(variant)||variant<0||variant>=3||!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Unsupported cube-addition candidate");
  const definition=definitions[variant],cells=definition.cells,occupied=new Set(cells.map(key)),frontier=new Map();
  if(!valid(cells))throw new Error("Invalid six-cube base");
  for(const c of cells)for(const d of directions){const p=c.map((n,i)=>n+d[i]);if(!occupied.has(key(p)))frontier.set(key(p),p);}
  const allPositions=sorted([...frontier.values()]),positions=level===0?allPositions.filter(c=>c[2]===0):allPositions,groups=new Map();
  for(const added of positions){const result=[...cells,added],canonical=geometry.canonicalPolycube(result);if(!groups.has(canonical))groups.set(canonical,[]);groups.get(canonical).push(added);}
  const classes=[...groups].sort(([a],[b])=>a.localeCompare(b,"en")).map(([canonical,members],index)=>{
   const ordered=sorted(members);return{index,canonical,positions:ordered,placementCount:ordered.length,
    witnesses:ordered.map(added=>({added,cells:sorted([...cells,added]),faceContacts:directions.reduce((sum,d)=>sum+Number(occupied.has(key(added.map((n,i)=>n+d[i])))),0)}))};
  });
  const independentCount=level===0?new Set(positions.map(p=>geometry.canonicalPolycube([...cells,p]))).size:geometry.addedCubeShapeCount(cells);
  if(classes.length!==independentCount||classes.reduce((sum,c)=>sum+c.placementCount,0)!==positions.length)throw new Error("Incomplete attachment partition");
  return freeze({sourceItemId:id,variant,level,cells,allPositions,positions,classes,baseCubeCount:6,resultCubeCount:7,shapeCount:classes.length,placementCount:positions.length,
   answer:level===2?[classes.length,positions.length]:classes.length,sourceGeometryMatches:variant===0,change:definition.change,
   equivalenceMode:"translation-and-24-proper-rotations",addedCubeDistinguishedInComparison:false,allowedAttachment:"aligned-whole-square-face",gluedRigid:true,groundRestriction:false,
   sourceRef:{pdfPage:36,printedPage:38,example:"4-4"},requiresOriginalReview:true,originalSourceReleaseStatus:"locked",sourceExact:false,
   publisherAnswerVerified:false,officialAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,empiricallyCalibrated:false,learnerReleaseVerified:false,registrationOnly:true});
 }
 return freeze({solve,orient,rotations,definitions,pool:[0,1,2],sourceItemId:id,sourceItemIds:[id],canonical:geometry.canonicalPolycube,registrationOnly:true,learnerReleaseVerified:false});
});
