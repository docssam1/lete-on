(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory();
  else root.HSE_SOURCE_GRADE6_PAINTED_COLOR_CLASSIFIER=factory();
})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  function freeze(v){if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  const directions=freeze([["right",1,0,0],["left",-1,0,0],["top",0,1,0],["bottom",0,-1,0],["front",0,0,1],["back",0,0,-1]]);
  function classify(heights,palette){
    if(!Array.isArray(heights)||heights.length<1||heights.length>64||!Array.isArray(heights[0])||heights[0].length<1||heights[0].length>64)throw new RangeError("Invalid painted colour height grid");
    const columns=heights[0].length,cells=[];
    for(let z=0;z<heights.length;z++){
      if(!Object.hasOwn(heights,z)||!Array.isArray(heights[z])||heights[z].length!==columns)throw new RangeError("Nonrectangular painted colour height grid");
      for(let x=0;x<columns;x++){
        const h=heights[z][x];if(!Object.hasOwn(heights[z],x)||!Number.isSafeInteger(h)||h<0||h>64)throw new RangeError("Invalid painted colour height");
        for(let y=0;y<h;y++)cells.push([x,y,z]);
      }
    }
    if(!cells.length||cells.length>10000)throw new RangeError("Unsupported painted colour cube count");
    if(!palette||typeof palette!=="object"||directions.some(([name])=>!Object.hasOwn(palette,name)||!["red","blue",null].includes(palette[name])))throw new RangeError("Incomplete painted direction palette");
    const occupied=new Set(cells.map(c=>c.join(","))),histograms={red:Array(7).fill(0),blue:Array(7).fill(0),painted:Array(7).fill(0)},maxHeight=Math.max(...heights.flat()),layerGrids={red:[],blue:[],painted:[]};
    for(const name of Object.keys(layerGrids))layerGrids[name]=Array.from({length:maxHeight},()=>heights.map(row=>row.map(()=>null)));
    const colored=cells.map(cell=>{
      const exposed=directions.filter(([,dx,dy,dz])=>!occupied.has([cell[0]+dx,cell[1]+dy,cell[2]+dz].join(","))).map(([direction])=>({direction,color:palette[direction]})),red=exposed.filter(f=>f.color==="red").length,blue=exposed.filter(f=>f.color==="blue").length,painted=red+blue;
      for(const [name,count]of Object.entries({red,blue,painted})){histograms[name][count]++;layerGrids[name][cell[1]][cell[2]][cell[0]]=count;}
      return {cell,exposed,red,blue,painted};
    });
    return freeze({heights:heights.map(row=>[...row]),cells,colored,palette:Object.fromEntries(directions.map(([name])=>[name,palette[name]])),histograms,layerGrids,redExactlyTwo:histograms.red[2],atLeastOnePainted:cells.length-histograms.painted[0],mixedColorCount:colored.filter(c=>c.red>0&&c.blue>0).length,registrationOnly:true});
  }
  return freeze({classify,directions,registrationOnly:true});
});
