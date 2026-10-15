(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-plane-cut-models.js"));
 else root.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_MODELS=factory(root.HSE_SOURCE_GRADE6_PLANE_CUT_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(shared){
 "use strict";
 const id="6-2-u3-e4-mission-2",pools=[[3,2,4],[4,2,5],[3,3,5]];
 const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const minus=(a,b)=>a.map((n,i)=>n-b[i]),dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0),length=a=>Math.hypot(...a),unit=a=>a.map(n=>n/length(a));
 function solve(sourceItemId,variant){
  if(sourceItemId!==id||!Number.isSafeInteger(variant)||variant<0||variant>=pools.length)throw new RangeError("Unsupported three-point prism source or variant");
  const [width,height,depth]=pools[variant],dimensions=[width,height,depth],points={"ㄱ":[0,height,0],"ㄴ":[width,0,0],"ㄷ":[width,height,depth]};
  const plane=shared.planeFromPoints(Object.values(points).map(p=>p.map(n=>2*n))),cubes=[],cutCells=[],touchCells=[],sections=[],layers=[];
  for(let y=0;y<height;y++){
   const cells=[],cuts=[],touches=[];
   for(let x=0;x<width;x++)for(let z=0;z<depth;z++){
    const cell=[x,y,z],kind=shared.cubeClass(cell,plane);cubes.push(cell);cells.push([x,z]);
    if(kind.cut){cutCells.push(cell);cuts.push([x,z]);sections.push({cell,polygon:shared.sectionPolygon(cell,cell.map(n=>n+1),plane)});}
    if(kind.touch){touchCells.push(cell);touches.push([x,z]);}
   }
   layers.push({layer:y+1,cells,cutCells:cuts,touchCells:touches,cutCount:cuts.length,touchCount:touches.length});
  }
  const origin=points["ㄱ"],horizontal=unit(minus(points["ㄷ"],origin)),towardBottom=minus(points["ㄴ"],origin),vertical=unit(towardBottom.map((n,i)=>n-dot(towardBottom,horizontal)*horizontal[i]));
  const flatten=p=>[dot(minus(p,origin),horizontal),dot(minus(p,origin),vertical)],sectionEdges=[["ㄱ","ㄴ"],["ㄴ","ㄷ"],["ㄷ","ㄱ"]].map(([from,to])=>({from,to,a:points[from],b:points[to],style:"dashed"}));
  const section=shared.sectionPolygon([0,0,0],dimensions,plane);
  return freeze({sourceItemId:id,variant,width,height,depth,n:height,dimensions,points,plane,cubes,cutCells,touchCells,layers,sections:sections.map(s=>({...s,flatPolygon:s.polygon.map(flatten)})),
   planeSection:section,sectionEdges,flatSection:section.map(flatten),flatPoints:Object.fromEntries(Object.entries(points).map(([name,p])=>[name,flatten(p)])),
   cutCount:cutCells.length,touchCount:touchCells.length,totalCount:cubes.length,splitPieceCount:cubes.length+cutCells.length,directions:{x:"right",y:"up",z:"back"},
   solidFilled:true,boundaryContactIsCut:false,answerUniqueScope:"specified-three-point-plane-and-solid-interior-cut-definition",sourceExact:false,originalSourceReleaseStatus:"locked"});
 }
 return freeze({sourceItemId:id,sourceItemIds:[id],pools,solve});
});
