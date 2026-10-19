(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory();
  else root.HSE_SOURCE_GRADE6_PAINTED_STACKS_MODELS=factory();
})(typeof window!=="undefined" ? window : globalThis,function(){
  "use strict";
  function freeze(value){if(value && typeof value==="object" && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  const original1=[[0,5,0,0],[0,3,0,0],[3,3,3,3],[0,2,2,2],[0,2,0,2]];
  const original2=[[0,2,3],[1,2,1],[2,0,2]],original4=[[3,2,0],[2,1,0],[3,2,1]];
  const copy=matrix=>matrix.map(row=>[...row]);
  const cube=side=>Array.from({length:side},()=>Array(side).fill(side));
  function withHeight(matrix,x,z,height){const result=copy(matrix);result[z][x]=height;return result;}
  const sourceSha256="69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE";
  const definitions=freeze([
    {sourceItemId:"6-2-u3-e3-example-1",kind:"painted-face-counts",pools:[{heights:original1,edge:1},{heights:withHeight(original1,1,0,4),edge:1},{heights:withHeight(original1,1,0,6),edge:1}],source:{pdfPage:34,printedPage:36,cropFile:"example1-source.png",cropSha256:"eca99089d59698d10b12ce0380407adf1137a9dc05e694474fb0e8d06b390dbd",sourceSha256}},
    {sourceItemId:"6-2-u3-e3-mission-2",kind:"painted-face-counts",pools:[{heights:original2,edge:1},{heights:withHeight(original2,1,1,3),edge:1},{heights:withHeight(original2,1,1,4),edge:1}],source:{pdfPage:35,printedPage:37,cropFile:"mission2-source.png",cropSha256:"cc9cb8348c627052a88433357d2c47f7832fc367d90e693f86b5fca5bea14c28",sourceSha256}},
    {sourceItemId:"6-2-u3-e3-mission-4",kind:"painted-surface-area",pools:[{heights:original4,edge:3},{heights:original4,edge:2},{heights:original4,edge:4}],source:{pdfPage:35,printedPage:37,cropFile:"mission4-source.png",cropSha256:"21208fdcb66679561a44e42cc655b44d400526f3b5f34066df53077275ba9a62",sourceSha256}},
    {sourceItemId:"6-2-u3-e3-mission-1",kind:"unpainted-inner-cubes",pools:[4,3,5].map(side=>({heights:cube(side),edge:1})),source:{pdfPage:35,printedPage:37,sourceSha256,learnerDiagramPresent:false}}
  ]);
  const directions=freeze([["right",1,0,0],["left",-1,0,0],["top",0,1,0],["bottom",0,-1,0],["front",0,0,1],["back",0,0,-1]]);
  function solve(sourceItemId,variant=0){
    const definition=definitions.find(d=>d.sourceItemId===sourceItemId);
    if(!definition || !Number.isSafeInteger(variant) || variant<0 || variant>=3)throw new RangeError("Unsupported painted stack source or variant");
    const {heights,edge}=definition.pools[variant],cells=[];
    for(let z=0;z<heights.length;z++)for(let x=0;x<heights[z].length;x++)for(let y=0;y<heights[z][x];y++)cells.push([x,y,z]);
    const keys=new Set(cells.map(cell=>cell.join(","))),histogram=Array(7).fill(0),faceCounts=Object.fromEntries(directions.map(([name])=>[name,0]));
    const colored=cells.map(cell=>{
      const faces=directions.filter(([,dx,dy,dz])=>!keys.has([cell[0]+dx,cell[1]+dy,cell[2]+dz].join(","))).map(([name])=>name);
      histogram[faces.length]++;faces.forEach(name=>faceCounts[name]++);return {cell,faces,painted:faces.length};
    });
    const maximum=Math.max(...heights.flat()),layerGrids=Array.from({length:maximum},(_,y)=>heights.map(row=>row.map(()=>null)));
    for(const {cell:[x,y,z],painted} of colored)layerGrids[y][z][x]=painted;
    const paintedFaces=Object.values(faceCounts).reduce((a,b)=>a+b,0),paintedArea=paintedFaces*edge*edge,withoutBottomArea=(paintedFaces-faceCounts.bottom)*edge*edge;
    return freeze({sourceItemId,variant,kind:definition.kind,heights:copy(heights),edge,cells,colored,histogram,faceCounts,paintedFaces,paintedArea,withoutBottomArea,layerGrids,sourceRef:definition.source,
      conditionPolicy:{groundedColumns:true,hiddenGaps:false,allExposedFacesPainted:true,bottomFacesPainted:true,occludedExternalFacesPainted:true,cutAfterPainting:false,...(definition.kind==="unpainted-inner-cubes" ? {separatedAfterPainting:true} : {}),viewConvention:"H[z][x], back-to-front rows, left-to-right columns",answerMeaning:"Painted physical faces, not only faces visible from one camera"},
      requestedAnswerUnique:true,variantCount:3,registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false,difficultyVerified:false});
  }
  return freeze({solve,definitions,directions,registrationOnly:true,learnerReleaseVerified:false});
});
