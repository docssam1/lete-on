(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_MODELS=factory();
})(typeof window!=="undefined"?window:globalThis,function(){
 "use strict";
 const id="6-2-u3-e4-example-3",n=5,key=cell=>cell.join(",");
 const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const original={top:[[1,2],[2,2],[3,2],[2,1]],front:[[1,3],[2,2],[3,1]],right:[[2,3],[2,2],[1,1],[3,1]]};
 const definitions=freeze([
  {variant:0,n,faces:original,change:"source-reference-face-patterns"},
  {variant:1,n,faces:{...original,top:[[2,1],[2,2],[2,3],[3,2]]},change:"turn-only-the-top-face-pattern"},
  {variant:2,n,faces:{...original,front:[[1,3],[2,2],[3,2]],right:[[2,3],[3,2],[1,1],[3,1]]},change:"change-one-front-and-one-right-face-mark"}
 ]);
 function solve(sourceItemId,variant=0,level=1){
  if(sourceItemId!==id||!Number.isSafeInteger(variant)||variant<0||variant>=definitions.length||!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Unsupported opposite-removal candidate");
  const definition=definitions[variant],faces=definition.faces,axes=level===0?["top","right"]:["top","front","right"];
  for(const [face,marks]of Object.entries(faces)){
   if(!["top","front","right"].includes(face)||new Set(marks.map(key)).size!==marks.length||!marks.every(c=>Array.isArray(c)&&c.length===2&&c.every(v=>Number.isSafeInteger(v)&&v>0&&v<n-1)))throw new Error("Painted marks must be distinct interior face cells");
  }
  const rays=[];
  for(const axis of axes)for(const [a,b]of faces[axis]){
   const cells=Array.from({length:n},(_,t)=>axis==="top"?[a,n-1-t,b]:axis==="front"?[a,b,t]:[n-1-t,b,a]);
   rays.push({axis,mark:[a,b],cells});
  }
  const owners=new Map();for(const ray of rays)for(const cell of ray.cells){const k=key(cell);if(!owners.has(k))owners.set(k,new Set());owners.get(k).add(ray.axis);}
  const cells=[],remaining=[],removed=[],overlapping=[],coverage=[],layers=[];
  for(let y=0;y<n;y++){
   const row={layer:y+1,cells:[],remaining:[],removed:[],overlapping:[]};
   for(let x=0;x<n;x++)for(let z=0;z<n;z++){
    const cell=[x,y,z],paths=[...(owners.get(key(cell))||[])],count=paths.length;
    cells.push(cell);row.cells.push([x,z]);coverage.push({cell,axes:paths,count});
    if(count){removed.push(cell);row.removed.push([x,z]);}else{remaining.push(cell);row.remaining.push([x,z]);}
    if(count>=2){overlapping.push(cell);row.overlapping.push([x,z]);}
   }
   layers.push(row);
  }
  const paintCells=[...faces.top.map(([x,z])=>[x,n-1,z]),...faces.front.map(([x,y])=>[x,y,0]),...faces.right.map(([z,y])=>[n-1,y,z])];
  return freeze({sourceItemId:id,variant,level,n,dimensions:[n,n,n],faces,axes,rays,cells,paintCells,coverage,remaining,removed,overlapping,layers,
   totalCount:cells.length,remainingCount:remaining.length,removedCount:removed.length,overlapCount:overlapping.length,
   answer:level===2?[remaining.length,overlapping.length]:remaining.length,conditionScope:"gap-free-cube-and-complete-opposite-face-rays-at-original-lattice-positions",
   directions:{x:"right",y:"up",z:"back"},change:definition.change,sourceGeometryMatches:variant===0,sourceRef:{pdfPage:36,printedPage:38,example:"4-3"},
   sourceExact:false,originalSourceReleaseStatus:"locked",publisherAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,empiricallyCalibrated:false,
   registrationOnly:true,learnerReleaseVerified:false,requiresOriginalReview:true,variantDesignStatus:"candidate-pending-visual-and-independent-review"});
 }
 return freeze({solve,sourceItemId:id,sourceItemIds:[id],definitions,pool:[0,1,2],registrationOnly:true,learnerReleaseVerified:false});
});
