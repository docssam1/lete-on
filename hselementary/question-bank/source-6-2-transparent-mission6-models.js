(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.HSE_SOURCE_GRADE6_TRANSPARENT_MISSION6_MODELS=factory();
})(typeof window!=="undefined"?window:globalThis,function(){
 "use strict";
 const id="6-2-u3-e4-mission-6",dimensions=[3,3,2],freeze=v=>{if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 const definitions=freeze([
  {variant:0,topRowsBackToFront:[[0,1,1],[1,0,0]],frontRowsTopToBottom:[[1,0,0],[0,1,1],[0,1,0]],change:"original-projection-patterns"},
  {variant:1,topRowsBackToFront:[[0,1,1],[1,0,0]],frontRowsTopToBottom:[[0,1,1],[1,0,0],[0,0,1]],change:"change-front-given-not-the-camera"},
  {variant:2,topRowsBackToFront:[[1,0,1],[1,1,0]],frontRowsTopToBottom:[[1,1,1],[1,1,1],[0,0,0]],change:"multiple-hidden-arrangements-with-one-requested-right-view"}
 ]);
 const bitMask=rows=>rows.flat().reduce((sum,n,i)=>sum+(n<<i),0),rowsFromMask=(mask,width,height)=>Array.from({length:height},(_,r)=>Array.from({length:width},(_,c)=>(mask>>(r*width+c))&1));
 function analyze(topRowsBackToFront,frontRowsTopToBottom){
  const[w,h,d]=dimensions;
  for(const[rows,width,height]of[[topRowsBackToFront,w,d],[frontRowsTopToBottom,w,h]])if(!Array.isArray(rows)||rows.length!==height||rows.some(r=>!Array.isArray(r)||r.length!==width||r.some(n=>n!==0&&n!==1)))throw RangeError("Invalid transparent source projection");
  const targetTop=bitMask(topRowsBackToFront),targetFront=bitMask(frontRowsTopToBottom),allowed=[];
  for(let y=0;y<h;y++)for(let z=0;z<d;z++)for(let x=0;x<w;x++)if(topRowsBackToFront[d-1-z][x]&&frontRowsTopToBottom[h-1-y][x])allowed.push({cell:[x,y,z],top:1<<((d-1-z)*w+x),front:1<<((h-1-y)*w+x),right:1<<((h-1-y)*d+z)});
  const candidates=[],rightMasks=new Set();
  for(let mask=0;mask<2**allowed.length;mask++){let top=0,front=0,right=0;const cells=[];
   for(let i=0;i<allowed.length;i++)if(mask&(1<<i)){const a=allowed[i];top|=a.top;front|=a.front;right|=a.right;cells.push(a.cell);}
   if(top!==targetTop||front!==targetFront)continue;
   candidates.push({cells,blackCount:cells.length,rightMask:right});rightMasks.add(right);
  }
  const views=[...rightMasks].sort((a,b)=>a-b).map(mask=>({mask,rows:rowsFromMask(mask,d,h)}));
  return freeze({allowedCells:allowed.map(a=>a.cell),testedAllowedSubsets:2**allowed.length,totalOriginalSubsets:2**(w*h*d),zeroProjectionExcludesEveryOtherCell:true,candidates,views,candidateCount:candidates.length,requestedProjectionCount:views.length,
   minBlackCount:candidates.length?Math.min(...candidates.map(c=>c.blackCount)):null,maxBlackCount:candidates.length?Math.max(...candidates.map(c=>c.blackCount)):null});
 }
 function solve(source,variant=0,level=1){
  if(source!==id||!Number.isSafeInteger(variant)||variant<0||variant>=definitions.length||!Number.isSafeInteger(level)||level<0||level>2)throw RangeError("Unsupported transparent-box candidate");
  const def=definitions[variant],result=analyze(def.topRowsBackToFront,def.frontRowsTopToBottom);
  if(result.candidateCount===0||result.requestedProjectionCount!==1)throw Error("The requested right view must be determined by all placements");
  const rightRowsTopToBottom=result.views[0].rows,requestedRows=level===0?[rightRowsTopToBottom[0]]:rightRowsTopToBottom,cubes=[];
  for(let x=0;x<3;x++)for(let y=0;y<3;y++)for(let z=0;z<2;z++)cubes.push([x,y,z]);
  return freeze({sourceItemId:id,variant,level,dimensions,cubes,points:{A:[0,3,2],B:[0,3,0],C:[3,3,0],D:[3,3,2],E:[0,0,0],F:[3,0,0],G:[3,0,2]},sectionEdges:[],planeSection:[],
   topRowsBackToFront:def.topRowsBackToFront,frontRowsTopToBottom:def.frontRowsTopToBottom,rightRowsTopToBottom,requestedRows,answer:level===2?{rightRows:requestedRows,minBlack:result.minBlackCount,maxBlack:result.maxBlackCount}:requestedRows,
   result,finiteVariantCount:3,totalBoxCount:18,sourceGeometryMatches:true,sourceProjectionMatches:variant===0,change:def.change,visibilityRule:"at-least-one-opaque-cube-on-ray",requestedDrawingUnique:true,positionsPreserved:true,
   sourceExact:false,originalSourceReleaseStatus:"locked",officialAnswerVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,learnerReleaseVerified:false,empiricallyCalibrated:false,registrationOnly:true});
 }
 return freeze({solve,analyze,definitions,sourceItemId:id,sourceItemIds:[id],pool:[0,1,2],registrationOnly:true,learnerReleaseVerified:false});
});
