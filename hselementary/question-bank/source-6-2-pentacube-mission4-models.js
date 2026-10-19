(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./generators.js"));
 else root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_MODELS=factory(root.HSE_GENERATORS?.polycubes);
})(typeof window!=="undefined"?window:globalThis,function(geometry){
 "use strict";
 if(!geometry||typeof geometry.canonicalPolycube!=="function"||geometry.rotationTransforms?.length!==24)throw Error("Verified polycube geometry must load first");
 const id="6-2-u3-e4-mission-4",base=[[0,0,0],[0,1,0],[0,0,1],[1,0,1]],key=c=>c.join(","),directions=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 const freeze=v=>{if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;},sorted=cells=>cells.map(c=>c.slice()).sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
 const rotations=geometry.rotationTransforms.map((transform,index)=>{const columns=[[1,0,0],[0,1,0],[0,0,1]].map(transform),m=[0,1,2].map(row=>columns.map(c=>c[row])),det=m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);if(det!==1)throw Error("Reflection is not a physical rotation");return{index,matrix:m,determinant:det};});
 const valid=cells=>Array.isArray(cells)&&[4,5].includes(cells.length)&&new Set(cells.map(key)).size===cells.length&&cells.every(c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger));
 function orient(cells,index){if(!valid(cells)||!Number.isSafeInteger(index)||index<0||index>=24)throw RangeError("Invalid pentacube rigid orientation");return cells.map(c=>rotations[index].matrix.map(row=>row.reduce((sum,n,i)=>sum+n*c[i],0)));}
 function solve(sourceItemId,variant=0,level=1){
  if(sourceItemId!==id||variant!==0||!Number.isSafeInteger(level)||level<0||level>2)throw RangeError("Unsupported finite pentacube question");
  const cells=sorted(base),occupied=new Set(cells.map(key)),frontier=new Map();
  for(const c of cells)for(const d of directions){const p=c.map((n,i)=>n+d[i]);if(!occupied.has(key(p)))frontier.set(key(p),p);}
  const allPositions=sorted([...frontier.values()]),supported=p=>p[1]===0||p[1]>0&&occupied.has(key([p[0],p[1]-1,p[2]]));
  const positions=level===0?allPositions.filter(p=>p[1]===0):level===1?allPositions.filter(supported):allPositions,groups=new Map();
  for(const added of positions){const canonical=geometry.canonicalPolycube([...cells,added]);if(!groups.has(canonical))groups.set(canonical,[]);groups.get(canonical).push(added);}
  const classes=[...groups].sort(([a],[b])=>a.localeCompare(b,"en")).map(([canonical,members],index)=>{const ordered=sorted(members);return{index,canonical,positions:ordered,placementCount:ordered.length,witnesses:ordered.map(added=>({added,cells:sorted([...cells,added]),faceContacts:directions.reduce((sum,d)=>sum+Number(occupied.has(key(added.map((n,i)=>n+d[i])))),0)}))};});
  if(classes.reduce((sum,g)=>sum+g.placementCount,0)!==positions.length)throw Error("Incomplete pentacube partition");
  if(level===2&&classes.length!==geometry.addedCubeShapeCount(cells))throw Error("Pentacube frontier and existing counter disagree");
  return freeze({sourceItemId:id,variant,level,cells,allPositions,positions,classes,baseCubeCount:4,resultCubeCount:5,shapeCount:classes.length,placementCount:positions.length,answer:level===2?[classes.length,positions.length]:classes.length,
   equivalenceMode:"translation-and-24-proper-rotations",addedCubeDistinguishedInComparison:false,allowedAttachment:"aligned-whole-square-face",baseRigid:true,gluedRigid:level===2,groundRestriction:["added-cube-on-fixed-ground","supported-on-fixed-ground-or-original-cube","none"][level],scope:["ground-addition-only","natural-fixed-floor-stacking","rigid-whole-face-attachment"][level],finiteVariantCount:1,
   originalSourceReleaseStatus:"locked",sourceExact:false,officialAnswerVerified:false,publisherAnswerVerified:false,humanApproved:false,empiricallyCalibrated:false,learnerReleaseVerified:false,registrationOnly:true});
 }
 return freeze({solve,orient,rotations,sourceItemId:id,sourceItemIds:[id],canonical:geometry.canonicalPolycube,pool:[0],registrationOnly:true,learnerReleaseVerified:false});
});
