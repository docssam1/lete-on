(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-color-classifier.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_MODELS=factory(root.HSE_SOURCE_GRADE6_PAINTED_COLOR_CLASSIFIER);
})(typeof window!=="undefined"?window:globalThis,function(classifier){
  "use strict";
  function freeze(v){if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  const sourceItemId="6-2-u3-e3-exploration",original=freeze([[4,3,0,0],[4,3,2,1],[4,3,2,2],[4,4,4,4]]);
  const change=(x,depth)=>original.map((row,d)=>row.map((h,c)=>h+Number(c===x&&d===depth)));
  const pools=freeze([original,change(0,3),change(3,3)]),palette=freeze({right:"blue",left:"blue",top:"blue",bottom:"blue",front:"blue",back:"blue"});
  const fittedCamera=freeze({u:[48.97383177231343,24.52726921794348,0.003591131183671033],v:[-0.03531324305519945,-22.094278294090326,-48.217754124862296]});
  const scale=-fittedCamera.v[2],projection=freeze({kind:"source-affine",horizontal:[fittedCamera.u[0]/scale,fittedCamera.u[2]/scale,-fittedCamera.u[1]/scale],vertical:[-fittedCamera.v[0]/scale,-fittedCamera.v[2]/scale,fittedCamera.v[1]/scale]});
  const faceColors=freeze([0xd2e8ef,0xd2e8ef,0xe9f3f5,0xd2e8ef,0xdceef2,0xd2e8ef]);
  function solve(variant=0){
    if(!Number.isSafeInteger(variant)||variant<0||variant>=3)throw new RangeError("Unverified painted exploration variant");
    const sourceHeights=pools[variant].map(row=>[...row]),heights=sourceHeights.slice().reverse().map(row=>[...row]),m=classifier.classify(heights,palette);
    if(m.histograms.painted[6]!==0)throw new Error("A six-face cube cannot fit the source answer table");
    return freeze({...m,sourceItemId,variant,sourceHeights,histogram:m.histograms.painted,layerGrids:m.layerGrids.painted,paintedFaces:m.colored.reduce((n,c)=>n+c.painted,0),projection,faceColors,
      sourceRef:{pdfPage:34,printedPage:36,printedItemLabel:"개념탐구 3",sourceSha256:"69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE",pageImageSha256:"b757334291f959be19a69754ba7b8dc0337f70ff76142af2962a6256e4809175"},
      conditionPolicy:{allColumnTopsShown:true,groundedColumns:true,hiddenGaps:false,hiddenExtraColumns:false,bottomFacesPainted:true,paintAfterStacking:true,contactsPainted:false,sealedCavities:false,sourceToRenderer:"[x,depth,up] -> [x,up,3-depth]"},
      sourceConditionsClarified:true,clarifiedConditionClauses:2,originalAnswerDeterminate:false,originalSourceReleaseStatus:"locked",requestedAnswerUnique:true,sourceGeometryVerificationPending:false,registrationOnly:true,publisherAnswerVerified:false,learnerReleaseVerified:false});
  }
  function rendererModel(variant=0){const model=solve(variant);return freeze({model,heights:model.heights,projection,faceColors,cubes(given){if(JSON.stringify(given)!==JSON.stringify(model.heights))throw new RangeError("Wrong exploration height grid");return model.cells;}});}
  return freeze({solve,rendererModel,pools,palette,fittedCamera,projection,faceColors,sourceItemId,registrationOnly:true});
});
