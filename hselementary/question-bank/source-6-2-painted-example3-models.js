(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-color-classifier.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE3_MODELS=factory(root.HSE_SOURCE_GRADE6_PAINTED_COLOR_CLASSIFIER);
})(typeof window!=="undefined"?window:globalThis,function(classifier){
  "use strict";
  function freeze(v){if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  const heightsPerVariant=freeze([7,6,8]),sourceFootprint=freeze(Array.from({length:7},(_,depth)=>Array.from({length:8},(_,x)=>Number(depth>=3||x<6)))),palette=freeze({right:"red",left:"blue",top:"red",bottom:null,front:"red",back:"blue"});
  const fittedCamera=freeze({u:[28+2/3,137/7,-3/7],v:[-1/6,-141/7,-200/7]}),scale=-fittedCamera.v[2],projection=freeze({kind:"source-affine",horizontal:[fittedCamera.u[0]/scale,fittedCamera.u[2]/scale,-fittedCamera.u[1]/scale],vertical:[-fittedCamera.v[0]/scale,-fittedCamera.v[2]/scale,fittedCamera.v[1]/scale]}),faceColors=freeze([0xffc6bd,0xd0deff,0xffe0db,0xeeeeee,0xffd0c7,0xd0deff]);
  function solve(variant=0){
    if(!Number.isSafeInteger(variant)||variant<0||variant>=3)throw new RangeError("Unreviewed painted L prism variant");
    const height=heightsPerVariant[variant],sourceHeights=sourceFootprint.map(row=>row.map(on=>on*height)),heights=sourceHeights.slice().reverse().map(row=>[...row]),m=classifier.classify(heights,palette),groupedLayers={};
    for(const role of ["red","painted"]){groupedLayers[role]=[];for(const [y,matrix]of m.layerGrids[role].entries()){const key=JSON.stringify(matrix),group=groupedLayers[role].find(g=>g.key===key);if(group)group.layers.push(y+1);else groupedLayers[role].push({key,layers:[y+1],matrix});}}
    return freeze({...m,variant,height,sourceHeights,groupedLayers,projection,faceColors,sourceItemId:"6-2-u3-e3-example-3",normalizedTypeIds:["6-2-u3-e3-example-3-1","6-2-u3-e3-example-3-2"],
      sourceRef:{pdfPage:34,printedPage:36,printedItemLabel:"예제 3-3",sourceSha256:"69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE",pageImageSha256:"b757334291f959be19a69754ba7b8dc0337f70ff76142af2962a6256e4809175"},
      conditionPolicy:{groundedColumns:true,hiddenGaps:false,originalTotalUsesAllShownColumns:true,bottomFacesPainted:false,paintAfterStacking:true,cutAfterPainting:false,hiddenExteriorPaintedBlue:true,notchWallsPaintedRed:true,contactsPainted:false,sourceToRenderer:"[x,depth,up] -> [x,up,6-depth]"},
      requestedAnswerUnique:true,sourceGeometryVerificationPending:false,publisherAnswerVerified:false,learnerReleaseVerified:false,registrationOnly:true});
  }
  function rendererModel(variant=0){const model=solve(variant);return freeze({model,heights:model.heights,projection,faceColors,cubes(given){if(JSON.stringify(given)!==JSON.stringify(model.heights))throw new RangeError("Wrong painted L prism height grid");return model.cells;}});}
  return freeze({solve,rendererModel,sourceFootprint,heightsPerVariant,palette,projection,faceColors,fittedCamera,registrationOnly:true});
});
