(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HSE_SOURCE_GRADE6_STACK_COUNT_MODELS = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const copy = value => JSON.parse(JSON.stringify(value));
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze); Object.freeze(value);
    }
    return value;
  }
  const isInteger = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max;
  const fail = message => { throw new RangeError(message); };
  const explorationTop = [[0,1,0,0],[0,1,0,0],[0,1,1,1],[1,1,1,1]];
  const explorationPools = [4,5,6].map(peak => ({ top: copy(explorationTop), front: [peak,peak,2,1], right: [peak,peak,2,1] }));
  const missionTop = [[1,1,1],[1,1,1],[0,0,1]];
  const projectionPools = [2,3,4].map(peak => ({ top: copy(missionTop), front: [1,peak,peak], right: [1,peak,peak] }));
  const make = (suffix, mode, pools, pdfPage, printedPage, rawSourceItemId, subquestion) => ({
    sourceItemId: `6-2-u3-e2-${suffix}`, mode, pools, source: { pdfPage, printedPage, rawSourceItemId, subquestion },
    officialAnswerVerified: false, learnerReleaseVerified: false, variantCount: pools.length
  });
  const definitions = freeze([
    make("exploration-1", "arrangement-count", explorationPools, 32, 34, "6-2-u3-e2-exploration", 1),
    make("exploration-2", "min-max-sum", explorationPools, 32, 34, "6-2-u3-e2-exploration", 2),
    make("example-1", "arrangement-count", [10,9,11].map(total => ({ top: [[1,0,0],[1,0,1],[1,1,1]], total, highest: 3 })), 32, 34, "6-2-u3-e2-example-1", null),
    make("mission-4", "arrangement-count", projectionPools, 33, 35, "6-2-u3-e2-mission-4", null),
    make("mission-6", "arrangement-count", [8,9,10].map(total => ({ top: [[1,0],[1,1],[1,1]], total, highest: 3 })), 33, 35, "6-2-u3-e2-mission-6", null),
    make("mission-2", "min-max-sum", [4,5,6].map(peak => ({ top: [[1,0,0],[1,1,1],[0,1,1],[1,1,1]], front: [peak,2,3], right: [peak,3,1,3] })), 33, 35, "6-2-u3-e2-mission-2", null)
  ]);
  const viewConvention = freeze({ topRows: "back-to-front", topColumns: "left-to-right", front: "left-to-right", right: "front-to-back",
    supportedColumns: true, preserveEmptyRowsAndColumns: true, fixedOrientation: true, quotientByRotationOrReflection: false });
  function validate(condition) {
    if (!condition || typeof condition !== "object" || Array.isArray(condition)) fail("Expected stack count conditions");
    if (Object.keys(condition).some(key => !["top","front","right","highest","total","fixedHeights"].includes(key))) fail("Unknown stack count condition");
    const { top } = condition;
    if (!Array.isArray(top) || !isInteger(top.length,1,6) || !Array.isArray(top[0]) || !isInteger(top[0].length,1,6)) fail("Invalid footprint dimensions");
    const rows = top.length, cols = top[0].length;
    if (top.some(row => !Array.isArray(row) || row.length !== cols || row.some(n => n !== 0 && n !== 1)) || !top.flat().some(Boolean)) fail("Footprint must contain binary cells");
    const hasFront = Object.hasOwn(condition,"front"), hasRight = Object.hasOwn(condition,"right");
    if (hasFront !== hasRight) fail("Both ordered side views are required");
    const hasHighest = Object.hasOwn(condition,"highest"), hasTotal = Object.hasOwn(condition,"total");
    if (hasHighest && !isInteger(condition.highest,1,6)) fail("Invalid highest layer");
    if (hasTotal && !isInteger(condition.total,1,216)) fail("Invalid total");
    if (!hasFront && (!hasHighest || !hasTotal)) fail("A footprint alone does not bound the intended count");
    if (hasFront) {
      for (const [profile, size] of [[condition.front,cols],[condition.right,rows]]) {
        if (!Array.isArray(profile) || profile.length !== size || profile.some(n => !isInteger(n,0,6))) fail("Invalid ordered side view");
      }
      for (let x=0;x<cols;x++) if (!!condition.front[x] !== top.some(row => !!row[x])) fail("Front occupancy conflicts with footprint");
      for (let z=0;z<rows;z++) if (!!condition.right[rows-1-z] !== top[z].some(Boolean)) fail("Right occupancy conflicts with footprint");
    }
    const fixed = condition.fixedHeights;
    if (fixed !== undefined && (!Array.isArray(fixed) || fixed.length !== rows || fixed.some((row,z) =>
      !Array.isArray(row) || row.length !== cols || row.some((n,x) => n !== null && (!isInteger(n,0,6) || !!n !== !!top[z][x]))))) fail("Invalid fixed-height clues");
    const cells = [], upper = top.map(row => row.map(() => 0));
    let searchSize = 1;
    for (let z=0;z<rows;z++) for (let x=0;x<cols;x++) if (top[z][x]) {
      let max = hasFront ? Math.min(condition.front[x], condition.right[rows-1-z]) : condition.highest;
      if (hasHighest) max = Math.min(max, condition.highest);
      const clue = fixed?.[z][x];
      if (clue !== undefined && clue !== null && clue > max) fail("A fixed height exceeds a visible bound");
      if (max < 1) fail("No positive height fits an occupied cell");
      upper[z][x] = max;
      const values = clue !== undefined && clue !== null ? [clue] : Array.from({length:max},(_,i) => i+1);
      cells.push({x,z,values}); searchSize *= values.length;
      if (searchSize > 500000) fail("Stack count exceeds the exhaustive search budget");
    }
    if (hasTotal && (condition.total < cells.length || condition.total > upper.flat().reduce((a,b)=>a+b,0))) fail("Total is outside the possible range");
    return {rows,cols,cells,upper,searchSize};
  }
  function enumerate(condition) {
    const {rows,cols,cells,upper,searchSize} = validate(condition);
    const heights = Array.from({length:rows},() => Array(cols).fill(0));
    const arrangements = [], histogram = {}, highestCountHistogram = {};
    let visited = 0;
    function visit(position) {
      if (position < cells.length) {
        const {x,z,values} = cells[position];
        for (const height of values) { heights[z][x] = height; visit(position+1); }
        return;
      }
      visited++;
      const total = heights.flat().reduce((a,b)=>a+b,0), highest = Math.max(...heights.flat());
      if (Object.hasOwn(condition,"total") && total !== condition.total || Object.hasOwn(condition,"highest") && highest !== condition.highest) return;
      if (condition.front && condition.front.some((n,x) => Math.max(...heights.map(row=>row[x])) !== n)) return;
      if (condition.right && condition.right.some((n,i) => Math.max(...heights[rows-1-i]) !== n)) return;
      arrangements.push(copy(heights));
      histogram[total] = (histogram[total] || 0)+1;
      const topCount = heights.flat().filter(n=>n===highest).length;
      highestCountHistogram[topCount] = (highestCountHistogram[topCount] || 0)+1;
    }
    visit(0);
    if (!arrangements.length) fail("The given conditions cannot produce any stack");
    const totals = Object.keys(histogram).map(Number), minimum = Math.min(...totals), maximum = Math.max(...totals);
    const totalOf = matrix => matrix.flat().reduce((a,b)=>a+b,0);
    return freeze({ condition: copy(condition), viewConvention, upperBounds: upper, searchSize, visited,
      arrangementCount: arrangements.length, arrangements, totalHistogram: histogram, highestCountHistogram,
      minimum, maximum, minMaxSum: minimum+maximum,
      minimumWitness: copy(arrangements.find(matrix=>totalOf(matrix)===minimum)),
      maximumWitness: copy(arrangements.find(matrix=>totalOf(matrix)===maximum)),
      uniqueRequestedNumericAnswer: true, uniqueArrangement: arrangements.length === 1,
      officialAnswerVerified: false, learnerReleaseVerified: false });
  }
  function solve(sourceItemId, variant = 0) {
    const definition = definitions.find(item=>item.sourceItemId === sourceItemId);
    if (!definition || !isInteger(variant,0,definition.variantCount-1)) fail("Invalid stack count source or variant");
    const result = enumerate(definition.pools[variant]);
    return freeze({ ...result, sourceItemId, variant, mode: definition.mode, sourceRef: definition.source,
      answer: definition.mode === "min-max-sum" ? result.minMaxSum : result.arrangementCount });
  }
  return freeze({definitions, enumerate, solve, viewConvention, registrationOnly:true,
    officialAnswerVerified:false, learnerReleaseVerified:false});
});
