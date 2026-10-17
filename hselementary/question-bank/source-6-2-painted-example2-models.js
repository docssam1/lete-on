(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-removal.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE2_MODELS=factory(root.HSE_SOURCE_GRADE6_PAINTED_REMOVAL);
})(typeof window!=="undefined"?window:globalThis,function(removal){
  "use strict";
  function freeze(v){if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  const sides=freeze([3,4,5]),projection=freeze({kind:"source-affine",horizontal:[44/(130/3),0,-(68/3)/(130/3)],vertical:[0,1,-20/(130/3)]});
  function cells(heights){const result=[];heights.forEach((row,z)=>row.forEach((h,x)=>{for(let y=0;y<h;y++)result.push([x,y,z]);}));return result;}
  function solve(variant=0){
    if(!Number.isSafeInteger(variant)||variant<0||variant>=3)throw new RangeError("Unreviewed paint-before-removal variant");
    const side=sides[variant],sourceBefore=Array.from({length:side},()=>Array(side).fill(side)),sourceAfter=sourceBefore.map(row=>[...row]);
    sourceAfter[0][side-2]=side-2;sourceAfter[0][side-1]=0;sourceAfter[1][side-2]=side-1;sourceAfter[1][side-1]=side-1;
    const beforeHeights=sourceBefore.slice().reverse(),heights=sourceAfter.slice().reverse(),before=removal.solve(side,cells(beforeHeights)),after=removal.solve(side,cells(heights));
    return freeze({...after,variant,sourceItemId:"6-2-u3-e3-example-2",sourceBefore,sourceAfter,beforeHeights,heights,before,projection,
      sourceRef:{pdfPage:34,printedPage:36,printedItemLabel:"예제 3-2",sourceSha256:"69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE",pageImageSha256:"b757334291f959be19a69754ba7b8dc0337f70ff76142af2962a6256e4809175"},
      sourceOriginalAmbiguous:true,sourceConditionsClarified:true,clarifiedCondition:"남은 쌓기나무는 각 칸에 바닥부터 빈틈없이 쌓여 있습니다.",
      conditionPolicy:{...after.conditionPolicy,groundedColumns:true,hiddenGaps:false,sourceFrameConversion:"source [x,depth,up] -> renderer [x,up,side-1-depth]"},
      registrationOnly:true,requestedAnswerUnique:true,publisherAnswerVerified:false,learnerReleaseVerified:false});
  }
  function rendererModel(variant=0,phase="after"){
    if(!["before","after"].includes(phase))throw new RangeError("Invalid removal phase");
    const model=solve(variant),heights=phase==="before"?model.beforeHeights:model.heights,verifiedCells=phase==="before"?model.before.cells:model.cells;
    return freeze({model,phase,heights,projection,cubes(given){if(JSON.stringify(given)!==JSON.stringify(heights))throw new RangeError("Wrong paint-before-removal height grid");return verifiedCells;}});
  }
  return freeze({solve,rendererModel,sides,projection,registrationOnly:true});
});
