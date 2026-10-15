(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-plane-cut-models.js"));
 else root.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_MODELS=factory(root.HSE_SOURCE_GRADE6_PLANE_CUT_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(shared){
 "use strict";
 const id="6-2-u3-e4-mission-3",freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const minus=(a,b)=>a.map((n,i)=>n-b[i]),dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0),unit=a=>a.map(n=>n/Math.hypot(...a));
 function solve(sourceItemId,variant){
  if(sourceItemId!==id||!Number.isSafeInteger(variant)||variant<0||variant>2)throw new RangeError("Unsupported layer-section source or variant");
  const base=shared.solve(id,variant),n=base.n,origin=base.points.B,horizontal=unit(minus(base.points.A,origin)),towardBottom=minus(base.points.C,origin),vertical=unit(towardBottom.map((v,i)=>v-dot(towardBottom,horizontal)*horizontal[i]));
  const flatten=p=>[dot(minus(p,origin),horizontal),dot(minus(p,origin),vertical)];
  const layers=base.layers.map(row=>{
   const lower=row.layer-1,upper=row.layer,section=shared.sectionPolygon([0,lower,0],[n,upper,n],base.plane),bandXZ=[...new Map(section.map(p=>[[p[0],p[2]].map(v=>v.toFixed(10)).join(","),[p[0],p[2]]])).values()];
   return {...row,bandXZ,givenResponsePointsXZ:row.slabTraces[1].map(p=>p.slice())};
  });
  const sectionEdges=[["A","B"],["B","C"],["C","A"]].map(([from,to])=>({from,to,a:base.points[from],b:base.points[to],style:"solid"}));
  const sections=base.cutCells.map(cell=>{const polygon=shared.sectionPolygon(cell,cell.map(n=>n+1),base.plane);return{cell,polygon,flatPolygon:polygon.map(flatten)};});
  return freeze({...base,layers,sectionEdges,sections,flatSection:base.planeSection.map(flatten),flatPoints:Object.fromEntries(Object.entries(base.points).map(([name,p])=>[name,flatten(p)])),
   totalCount:base.cubes.length,splitPieceCount:base.cubes.length+base.cutCount,sourceProjection:{kind:"cabinet",depthX:.5,depthY:.5},
   sourceResponseOrder:layers.map(r=>r.layer).reverse(),sourceResponseGiven:"upper-face-section-trace-endpoints",responseGeometry:"actual-slab-section-projection-not-cut-cell-union",sourceExact:false,originalSourceReleaseStatus:"locked"});
 }
 return freeze({solve,sourceItemId:id,sourceItemIds:[id],registrationOnly:true,learnerReleaseVerified:false});
});
