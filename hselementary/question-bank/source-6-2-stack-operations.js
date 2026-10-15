(() => {
  "use strict";
  const freeze = value => {
    if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
  };
  const models = typeof module !== "undefined" ? require("./source-6-2-stack-models.js") : window.HSE_SOURCE_GRADE6_STACK_MODELS;
  const definitions = freeze([
    {sourceItemId:"6-2-u3-e1-example-2",operation:"remove-one-labelled-top",requestedViews:["front","right"],
      labelledColumns:[[1,0],[2,0],[0,0],[1,1],[1,2],[2,1],[2,2]],
      pools:[[[2,3,1],[0,2,2],[0,2,1]],[[3,3,1],[0,2,2],[0,2,1]],[[2,3,1],[0,2,2],[0,3,1]]]},
    {sourceItemId:"6-2-u3-e1-mission-5",operation:"add-to-labelled-columns",requestedViews:["right"],givenViews:["top"],
      additions:[{column:[0,2],count:2},{column:[1,1],count:1}],
      pools:[[[0,0,2],[3,2,1],[1,0,0]],[[0,0,3],[3,2,1],[1,0,0]],[[0,0,2],[4,2,1],[1,0,0]]]},
    {sourceItemId:"6-2-u3-e1-mission-6",operation:"remove-marked-cubes",requestedViews:["top","front","right"],
      markedCells:[[0,1,1],[1,2,1],[1,0,2]],countGiven:true,
      pools:[[[0,2,2,1],[2,3,0,0],[0,1,0,0]],[[0,2,3,1],[2,3,0,0],[0,1,0,0]],[[0,2,2,2],[2,3,0,0],[0,1,0,0]]]}
  ]);
  function project(cells, rows, cols) {
    const top = Array.from({length:rows},()=>Array(cols).fill(0)), front = Array(cols).fill(0), right = Array(rows).fill(0);
    for (const [x,y,z] of cells) {top[z][x]=1;front[x]=Math.max(front[x],y+1);right[rows-1-z]=Math.max(right[rows-1-z],y+1);}
    return {top,front,right};
  }
  const address = cell => cell.join(",");
  function remove(cells, target) {
    if (!cells.some(cell=>address(cell)===address(target))) throw new Error("Removal target is not occupied");
    return cells.filter(cell=>address(cell)!==address(target));
  }
  function solve(id, variant=0) {
    const definition = definitions.find(d=>d.sourceItemId===id);
    if (!definition || !Number.isSafeInteger(variant) || variant<0 || variant>=definition.pools.length) throw new Error("Invalid operation source or variant");
    const heights = definition.pools[variant], cells = models.cubes(heights), rows=heights.length, cols=heights[0].length;
    const original = project(cells,rows,cols);
    if (definition.operation==="remove-one-labelled-top") {
      const trials = definition.labelledColumns.map(([x,z],index)=>{
        const target=[x,heights[z][x]-1,z], after=project(remove(cells,target),rows,cols);
        return {label:String.fromCodePoint(0x3260+index),target,after,
          qualifies:definition.requestedViews.every(name=>JSON.stringify(original[name])===JSON.stringify(after[name]))};
      });
      return {definition,heights,cells,original,trials,answer:trials.filter(t=>t.qualifies).map(t=>t.label)};
    }
    let afterCells;
    if (definition.operation==="add-to-labelled-columns") {
      afterCells=cells.concat(definition.additions.flatMap(({column:[x,z],count})=>Array.from({length:count},(_,i)=>[x,heights[z][x]+i,z])));
    } else afterCells=definition.markedCells.reduce(remove,cells);
    const after=project(afterCells,rows,cols);
    return {definition,heights,cells,original,afterCells,after,answer:Object.fromEntries(definition.requestedViews.map(name=>[name,after[name]]))};
  }
  const api=freeze({definitions,project,remove,solve,registrationOnly:true,learnerReleaseVerified:false});
  if (typeof module!=="undefined") module.exports=api;
  if (typeof window!=="undefined") window.HSE_SOURCE_GRADE6_STACK_OPERATIONS=api;
})();
