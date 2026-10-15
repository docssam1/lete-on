(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory();
  else root.HSE_SOURCE_GRADE6_PAINTED_REMOVAL=factory();
})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  function freeze(value){if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  const directions=freeze([["right",1,0,0],["left",-1,0,0],["top",0,1,0],["bottom",0,-1,0],["front",0,0,1],["back",0,0,-1]]);
  function solve(side,remaining){
    if(!Number.isSafeInteger(side)||side<2||side>16)throw new RangeError("Unsupported original cube side");
    if(!Array.isArray(remaining)||!remaining.length||remaining.length>side**3)throw new RangeError("Invalid remaining cube list");
    const occupied=new Set(),cells=remaining.map(cell=>{
      if(!Array.isArray(cell)||cell.length!==3||!cell.every(n=>Number.isSafeInteger(n)&&n>=0&&n<side))throw new RangeError("Remaining cube is outside the original solid");
      const copy=[...cell],key=copy.join(",");if(occupied.has(key))throw new RangeError("Duplicate remaining cube");occupied.add(key);return copy;
    }),histogram=Array(7).fill(0),faceCounts=Object.fromEntries(directions.map(([name])=>[name,0])),newlyExposedCounts=Object.fromEntries(directions.map(([name])=>[name,0]));
    // Paint belongs to the original cube. Removing a neighbour does not add paint.
    const colored=cells.map(cell=>{
      const faces=[],newlyExposed=[];
      for(const [name,dx,dy,dz] of directions){
        const neighbour=[cell[0]+dx,cell[1]+dy,cell[2]+dz];
        if(neighbour.some(n=>n<0||n>=side)){faces.push(name);faceCounts[name]++;}
        else if(!occupied.has(neighbour.join(","))){newlyExposed.push(name);newlyExposedCounts[name]++;}
      }
      histogram[faces.length]++;return {cell,faces,painted:faces.length,newlyExposed};
    }),removed=[];
    for(let z=0;z<side;z++)for(let x=0;x<side;x++)for(let y=0;y<side;y++)if(!occupied.has([x,y,z].join(",")))removed.push([x,y,z]);
    const layerGrids=Array.from({length:side},()=>Array.from({length:side},()=>Array(side).fill(null)));
    for(const {cell:[x,y,z],painted} of colored)layerGrids[y][z][x]=painted;
    return freeze({side,cells,colored,removed,histogram,faceCounts,newlyExposedCounts,layerGrids,originalCubeCount:side**3,
      conditionPolicy:{paintBeforeRemoval:true,bottomFacesPainted:true,repaintAfterRemoval:false,newlyExposedFacesPainted:false},registrationOnly:true});
  }
  return freeze({solve,directions,registrationOnly:true});
});
