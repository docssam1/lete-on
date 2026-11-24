(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.HSE_SOURCE_GRADE6_COLORED_REMOVAL_MISSION5_MODELS=factory();
})(typeof window!=="undefined"?window:globalThis,function(){
 "use strict";
 const id="6-2-u3-e4-mission-5",key=p=>p.join(","),freeze=v=>{if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 // pool 0은 원문 직육면체(가로 5, 높이 4, 세로 6). pool 1·2는 같은 물음을 다른 크기·색칠 무늬로 묻는 변형이다.
 // 칸 좌표: 윗면 [x,z], 앞면(z=0) [x,y], 오른쪽 면(x=가로-1) [z,y]. 색칠한 칸은 모두 테두리 안쪽에 두고, 빼낸 뒤 남은 쌓기나무가 한 덩어리로 이어지게 했다.
 const variants=freeze([
  {dimensions:[5,4,6],faces:{top:[[1,1],[2,1],[3,1],[2,2],[2,3],[1,4],[2,4],[3,4]],front:[[1,1],[2,1],[3,1],[1,2],[2,2],[3,2]],right:[[1,1],[2,1],[3,1],[4,1],[2,2],[3,2]]}},
  {dimensions:[6,4,5],faces:{top:[[1,1],[2,1],[3,1],[4,1],[4,2],[1,3],[2,3],[3,3],[4,3]],front:[[1,1],[1,2],[2,1],[3,1],[4,1],[4,2]],right:[[1,1],[2,1],[3,1],[2,2]]}},
  {dimensions:[5,5,5],faces:{top:[[1,1],[2,1],[3,1],[2,2],[2,3]],front:[[2,1],[1,2],[2,2],[3,2],[2,3]],right:[[1,1],[3,1],[2,2],[1,3],[3,3]]}}
 ]);
 function solve(source,variant=0,level=1){
  if(source!==id||!Number.isSafeInteger(variant)||variant<0||variant>=variants.length||!Number.isSafeInteger(level)||level<0||level>2)throw RangeError("Unsupported colored rectangular removal candidate");
  const{dimensions,faces}=variants[variant],[w,h,d]=dimensions,axes=level===0?["top","right"]:["top","front","right"],rays=[];
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
   answer:level===2?[remaining.length,overlapping.length]:remaining.length,conditionScope:"filled-rectangular-solid-and-full-opposite-face-rows",finiteVariantCount:variants.length,sourceGeometryMatches:variant===0,positionsPreserved:true,
   sourceExact:false,sourceOriginalStillUnderReview:true,originalSourceReleaseStatus:"locked",officialAnswerVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,learnerReleaseVerified:false,empiricallyCalibrated:false,registrationOnly:true});
 }
 return freeze({solve,sourceItemId:id,sourceItemIds:[id],pool:[0,1,2],variants,registrationOnly:true,learnerReleaseVerified:false});
});
