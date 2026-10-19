(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory();
  else root.HSE_SOURCE_GRADE6_STACK_COLOR_EXAMPLE4_MODELS=factory();
})(typeof window!=="undefined" ? window : globalThis,function(){
  "use strict";
  function freeze(value){if(value && typeof value==="object" && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  const sourceItemId="6-2-u3-e2-example-4",top=freeze([[1,1,1,1],[0,1,0,0],[1,1,1,1],[0,1,0,0]]),front=freeze([0,1,0,0]),right=freeze([1,0,1,0]);
  const sourceRef=freeze({sourceItemId,rawSourceItemId:sourceItemId,pdfPage:32,printedPage:34,sourceHeight:5,
    sourceTop:top,sourceFront:front,sourceRight:right,publisherAnswerProvided:false,
    cropFile:"example-4-original.png",cropSha256:"7CD8EDCBC6007517A68F8B471F400EF7963EDACC9E6C2993FFDD145D52906F96",
    pointerFile:"example-4-source-head-pointers.csv",pointerSha256:"5AED50CA6AD8960661F3AD57D18DC6D6EB76882D57B61E02770A22302CF14E86",
    evidenceBasis:"Original crop, sixteen top faces, five side rows and three-face color consistency; handwriting is not answer authority."});
  const definitions=freeze([{sourceItemId,heights:[5,4,6],variantCount:3,sourceRef,
    conditionPolicy:{oneColorPerCube:true,unshownColorsAreFree:true,alternatingHiddenColors:false,fullCuboid:true,finitePoolOnly:true},
    registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false}]);
  const key=cell=>cell.join(",");
  function solve(id,variant=0){
    if(id!==sourceItemId || !Number.isSafeInteger(variant) || variant<0 || variant>2)throw new RangeError("Invalid color-cuboid source or finite variant");
    const height=definitions[0].heights[variant],cells=[],shown=[],unshown=[],markedMinimum=[],markedMaximum=[],colorAt={};
    for(let z=0;z<4;z++)for(let x=0;x<4;x++)for(let y=0;y<height;y++){
      const cell=[x,y,z],observations=[];cells.push(cell);
      if(y===height-1)observations.push(top[z][x]);if(z===3)observations.push(front[x]);if(x===3)observations.push(right[z]);
      if(new Set(observations).size>1)throw new Error("The same cube has inconsistent shown colors");
      const color=observations.length ? observations[0] : null;colorAt[key(cell)]=color;
      (color===null ? unshown : shown).push(cell);
      if(color===1)markedMinimum.push(cell);if(color!==0)markedMaximum.push(cell);
    }
    const layers=(marked)=>{const dark=new Set(marked.map(key));return Array.from({length:height},(_,y)=>Array.from({length:4},(_,z)=>Array.from({length:4},(_,x)=>dark.has(key([x,y,z])) ? 1 : 0)));};
    const minimum=markedMinimum.length,maximum=markedMaximum.length;
    return freeze({sourceItemId:id,variant,height,sourceRef,heights:Array.from({length:4},()=>Array(4).fill(height)),cells,shown,unshown,colorAt,
      markedMinimum,markedMaximum,minimum,maximum,shownDark:minimum,shownLight:shown.length-minimum,
      minimumLayers:layers(markedMinimum),maximumLayers:layers(markedMaximum),top,front,right,
      conditionPolicy:definitions[0].conditionPolicy,registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
  }
  return freeze({solve,definitions,registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
});
