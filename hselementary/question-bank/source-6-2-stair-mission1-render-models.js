(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-stack-pattern-models.js"));
  else root.HSE_SOURCE_GRADE6_STAIR_MISSION1_RENDER_MODELS=factory(root.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS);
})(typeof window!=="undefined" ? window : globalThis,function(models){
  "use strict";
  const id="6-2-u3-e2-mission-1";
  function freeze(value){if(value && typeof value==="object" && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  function exactArray(actual,expected){
    if(!Array.isArray(actual)||actual.length!==expected.length||Reflect.ownKeys(actual).length!==expected.length+1)return false;
    return expected.every((value,index)=>{const descriptor=Object.getOwnPropertyDescriptor(actual,index);return descriptor && Object.hasOwn(descriptor,"value") && (Array.isArray(value)?exactArray(descriptor.value,value):descriptor.value===value);});
  }
  function build(mode){
    if(!["prefix","4","5","6"].includes(mode))throw new RangeError("Invalid stair source figure");
    if(mode!=="prefix"){
      const source=models.build(id,{n:Number(mode)});return freeze({mode,heights:source.H,cells:source.cubes,topFaces:source.columns.map(c=>[c.x,c.height-1,c.z]),
        captions:[],groups:[],sourceStage:Number(mode),constructionAdoptionStatus:"pending-user-choice",registrationOnly:true,learnerReleaseVerified:false});
    }
    const stages=models.firstStates(id),translations=[[0,0,7],[1,0,4],[3,0,0]],heights=Array.from({length:8},()=>Array(6).fill(0)),cells=[],groups=[];
    stages.forEach((stage,index)=>{
      const shift=translations[index],positions=stage.cubes.map(cell=>cell.map((coordinate,axis)=>coordinate+shift[axis]));
      for(const [x,y,z] of positions){if(heights[z][x]>y+1)throw new Error("Overlapping prefix columns");heights[z][x]=y+1;cells.push([x,y,z]);}
      const front=stage.n-1;groups.push({stage:stage.n,cells:positions,translation:shift,lowestFront:[shift[0]+front,0,shift[2]+front],
        caption:["첫째","둘째","셋째"][index],captionPoint:[shift[0]+front+.5,-.5,shift[2]+front+.5]});
    });
    const topFaces=[];for(let z=0;z<heights.length;z++)for(let x=0;x<heights[z].length;x++)if(heights[z][x])topFaces.push([x,heights[z][x]-1,z]);
    const cellKeys=new Set(cells.map(cell=>cell.join(",")));if(cellKeys.size!==30)throw new Error("Wrong prefix source cell count");
    const canonicalCells=[];for(let z=0;z<heights.length;z++)for(let x=0;x<heights[z].length;x++)for(let y=0;y<heights[z][x];y++)canonicalCells.push([x,y,z]);
    if(canonicalCells.length!==cells.length || canonicalCells.some(cell=>!cellKeys.has(cell.join(","))))throw new Error("Prefix cells must be grounded without hidden fillers");
    const cubeModel={cubes(input){if(!exactArray(input,heights))throw new Error("Only this finite prefix scene is supported");return canonicalCells;}};
    return freeze({mode,heights,cells:canonicalCells,topFaces,groups,captions:groups.map(group=>({text:group.caption,point:group.captionPoint})),cubeModel,
      constructionAdoptionStatus:"pending-user-choice",registrationOnly:true,learnerReleaseVerified:false});
  }
  return freeze({build,registrationOnly:true,learnerReleaseVerified:false});
});
