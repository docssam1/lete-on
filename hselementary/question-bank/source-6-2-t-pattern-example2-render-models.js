(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-stack-pattern-models.js"));
  else root.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_RENDER_MODELS=factory(root.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
  "use strict";
  const id="6-2-u3-e2-example-2";
  function freeze(value){if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  function build(){
    const heights=Array.from({length:14},()=>Array(15).fill(0)),cells=[],groups=[];
    const shifts=[[0,0,12],[4,0,6],[8,0,0]];
    models.firstStates(id).forEach((source,index)=>{
      const shift=shifts[index],translated=source.cubes.map(([x,y,z])=>[x-source.xOrigin+shift[0],y,z+shift[2]]);
      for(const [x,y,z]of translated){if(heights[z][x]&&heights[z][x]>y+1)throw new Error("Overlapping T-pattern columns");heights[z][x]=y+1;cells.push([x,y,z]);}
      const highest=source.n;
      groups.push({stage:highest,cells:translated,translation:shift,caption:["첫째","둘째","셋째"][index],
        captionPoint:[shift[0]+source.n,-.5,shift[2]+source.n]});
    });
    const keys=new Set(cells.map(cell=>cell.join(","))),canonical=[],tops=[];
    for(let z=0;z<heights.length;z++)for(let x=0;x<heights[z].length;x++)if(heights[z][x]){
      for(let y=0;y<heights[z][x];y++)canonical.push([x,y,z]);
      tops.push([x,heights[z][x]-1,z]);
    }
    if(keys.size!==36||canonical.length!==36||canonical.some(cell=>!keys.has(cell.join(","))))throw new Error("Invalid T-pattern prefix scene");
    const frozenHeights=JSON.stringify(heights),cubeModel={cubes(input){
      if(JSON.stringify(input)!==frozenHeights)throw new RangeError("Unsupported T-pattern scene");return canonical;
    }};
    return freeze({heights,cells:canonical,topFaces:tops,groups,captions:groups.map(g=>({text:g.caption,point:g.captionPoint})),cubeModel,
      sourceItemId:id,firstStatesOnly:true,sourceFirstThreeCubeCounts:[4,11,21],
      originalSourceReleaseStatus:"locked",constructionAdoptionStatus:"explicit-clarified-candidate",registrationOnly:true,learnerReleaseVerified:false});
  }
  return freeze({build,registrationOnly:true,learnerReleaseVerified:false});
});
