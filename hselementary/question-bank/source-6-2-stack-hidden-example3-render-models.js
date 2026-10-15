(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports) module.exports=factory(require("./source-6-2-stack-hidden-example3-models.js"));
  else root.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_RENDER_MODELS=factory(root.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_MODELS);
})(typeof window!=="undefined" ? window : globalThis,function(models){
  "use strict";
  function freeze(value){if(value && typeof value==="object" && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  function exactArray(input,expected) {
    if(!Array.isArray(input) || input.length!==expected.length || Reflect.ownKeys(input).length!==expected.length+1) return false;
    return expected.every((value,i)=>{const descriptor=Object.getOwnPropertyDescriptor(input,String(i));
      return descriptor && Object.hasOwn(descriptor,"value") && (Array.isArray(value) ? exactArray(descriptor.value,value) : descriptor.value===value);
    });
  }
  function build(variant,part="outer") {
    if(!["outer","inner"].includes(part)) throw new RangeError("Invalid hidden stack part");
    const source=models.solve("6-2-u3-e2-example-3",variant);
    const translation=part==="inner" ? [1,1,1] : [0,0,0];
    const cells=(part==="inner" ? source.hiddenPositions : source.cubes).map(cell=>cell.map((n,i)=>n-translation[i]));
    const rows=Math.max(...cells.map(cell=>cell[2]))+1,cols=Math.max(...cells.map(cell=>cell[0]))+1;
    const heights=Array.from({length:rows},()=>Array(cols).fill(0));
    for(const [x,y,z] of cells) heights[z][x]=Math.max(heights[z][x],y+1);
    const expected=heights.flatMap((row,z)=>row.flatMap((height,x)=>Array.from({length:height},(_,y)=>[x,y,z])));
    const canonical=values=>values.map(cell=>cell.join(",")).sort().join(";");
    if(canonical(expected)!==canonical(cells)) throw new Error("Inner translation must preserve all cube positions without closing gaps");
    const cubeModel=freeze({cubes(input){
      if(!exactArray(input,heights)) throw new RangeError("Only the selected verified finite height matrix is allowed");
      return cells;
    }});
    const layers=part==="outer" ? Array.from({length:source.n},(_,i)=>{
      const layer=source.n-i,x=source.n-layer,cell=[x,layer-1,0];
      if(!cells.some(c=>c.every((n,j)=>n===cell[j]))) throw new Error("Layer anchor missing from the source model");
      return {layer,cell,point:[x+.38,layer-.499,-.38],text:`${layer}층`};
    }) : [];
    return freeze({sourceItemId:source.sourceItemId,variant,part,n:source.n,source,heights,cells,cubeModel,layers,
      translation,answerOrigin:"Inner answer cells are translated by the same [1,1,1] offset; relative adjacency is preserved.",
      topFaces:heights.flatMap((row,z)=>row.flatMap((height,x)=>height ? [[x,height-1,z]] : [])),
      registrationOnly:true,learnerReleaseVerified:false,renderedFidelityVerified:false});
  }
  return freeze({build,registrationOnly:true,learnerReleaseVerified:false});
});
