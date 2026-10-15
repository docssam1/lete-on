(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-notched-mission5-models.js"));
  else root.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_RENDER_MODELS=factory(root.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
  "use strict";
  function build(variant,phase){
    if(!["given","full","filled"].includes(phase))throw new RangeError("Unsupported notched stack phase");
    const complete=models.solve(variant),omitted=phase==="given"?2:0;
    const display=models.build(complete.n-omitted,phase==="filled"),heights=display.H,cells=display.cubes;
    const projectedSource=complete.cubes.filter(c=>c[1]>=omitted).map(([x,y,z])=>[x,y-omitted,z]);
    if(phase==="given"&&JSON.stringify(projectedSource)!==JSON.stringify(cells))throw new Error("Omitted-layer display changed source cells");
    return Object.freeze({variant,phase,omitted,sourceLayers:complete.n,heights,cells,
      topFaces:cells.filter(([x,y,z])=>y===heights[z][x]-1),
      labels:display.layers.map(layer=>({layer:layer.layer+omitted,cell:[layer.side-1,layer.y,0],point:[layer.side-.499,layer.y,0]})),
      cubeModel:{cubes(input){if(JSON.stringify(input)!==JSON.stringify(heights))throw new Error("Altered source display heights");return cells;}},
      originalSourceReleaseStatus:"locked",sourceExact:false,learnerReleaseVerified:false});
  }
  return Object.freeze({build,originalSourceReleaseStatus:"locked",learnerReleaseVerified:false});
});
