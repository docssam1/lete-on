(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.HSE_SOURCE_GRADE6_COLORED_REMOVAL_MISSION5_MODELS=factory();
})(typeof window!=="undefined"?window:globalThis,function(){
 "use strict";
 const id="6-2-u3-e4-mission-5",dimensions=[5,4,6],key=p=>p.join(","),freeze=v=>{if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 const faces=freeze({top:[[1,1],[2,1],[3,1],[2,2],[2,3],[1,4],[2,4],[3,4]],front:[[1,1],[2,1],[3,1],[1,2],[2,2],[3,2]],right:[[1,1],[2,1],[3,1],[4,1],[2,2],[3,2]]});
 function solve(source,variant=0,level=1){
  if(source!==id||variant!==0||!Number.isSafeInteger(level)||level<0||level>2)throw RangeError("Unsupported colored rectangular removal candidate");
  const[w,h,d]=dimensions,axes=level===0?["top","right"]:["top","front","right"],rays=[];
  for(const axis of axes)for(const[a,b]of faces[axis]){const limit=axis==="top"?h:axis==="front"?d:w,cells=Array.from({length:limit},(_,t)=>axis==="top"?[a,h-1-t,b]:axis==="front"?[a,b,t]:[w-1-t,b,a]);rays.push({axis,mark:[a,b],cells});}
  const owners=new Map();for(const ray of rays)for(const p of ray.cells){const k=key(p);if(!owners.has(k))owners.set(k,new Set());owners.get(k).add(ray.axis);}
  const cells=[],remaining=[],removed=[],overlapping=[],coverage=[],layers=[];
  for(let y=0;y<h;y++){const row={layer:y+1,cells:[],remaining:[],removed:[],overlapping:[]};
   for(let x=0;x<w;x++)for(let z=0;z<d;z++){const p=[x,y,z],paths=[...(owners.get(key(p))||[])];cells.push(p);row.cells.push([x,z]);coverage.push({cell:p,axes:paths,count:paths.length});if(paths.length){removed.push(p);row.removed.push([x,z]);}else{remaining.push(p);row.remaining.push([x,z]);}if(paths.length>=2){overlapping.push(p);row.overlapping.push([x,z]);}}
   layers.push(row);
  }
  const paintCells=[...faces.top.map(([x,z])=>[x,h-1,z]),...faces.front.map(([x,y])=>[x,y,0]),...faces.right.map(([z,y])=>[w-1,y,z])];
  if(cells.length!==w*h*d||remaining.length+removed.length!==cells.length||new Set(paintCells.map(key)).size!==paintCells.length)throw Error("Invalid rectangular removal partition");
  return freeze({sourceItemId:id,variant,level,dimensions,faces,axes,rays,cells,paintCells,coverage,remaining,removed,overlapping,layers,totalCount:cells.length,remainingCount:remaining.length,removedCount:removed.length,overlapCount:overlapping.length,
   answer:level===2?[remaining.length,overlapping.length]:remaining.length,conditionScope:"filled-rectangular-solid-and-full-opposite-face-rows",finiteVariantCount:1,sourceGeometryMatches:true,positionsPreserved:true,
   sourceExact:false,sourceOriginalStillUnderReview:true,originalSourceReleaseStatus:"locked",officialAnswerVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,learnerReleaseVerified:false,empiricallyCalibrated:false,registrationOnly:true});
 }
 return freeze({solve,sourceItemId:id,sourceItemIds:[id],pool:[0],registrationOnly:true,learnerReleaseVerified:false});
});
