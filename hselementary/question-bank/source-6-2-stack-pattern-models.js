(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const copy = value => JSON.parse(JSON.stringify(value));
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze); Object.freeze(value);
    }
    return value;
  }
  const fail = message => { throw new RangeError(message); };
  const isInteger = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max;
  const verification = freeze({ registrationOnly: true, officialAnswerVerified: false, learnerReleaseVerified: false,
    renderedFidelityVerified: false, difficultyVerified: false, constructionConditionApproved: false });
  const patternConditionPolicy = freeze({
    sourceFirstThreeOnly: true, firstThreeForceUniqueFuture: false, plainConstructionWordingRequired: true,
    statement: "The source first three states suggest, but do not force, a unique future. Ambiguous future growth needs plain construction wording before any learner use.",
    hiddenBlocks: "Trace only the explicit source construction: fill each specified column from the ground, with no extra hidden columns, protrusions or cavities. Perspective drawings alone do not prove these assumptions.",
    answerBasis: "Conditional independent calculation; handwritten numbers are not official keys.",
    surfaceMeaning: "All exposed faces, including hole walls and occluded sides, not a fixed camera's visible faces. Exclude every ground-contact bottom face.",
    approvalBoundary: "No rendered fidelity, difficulty, official answer, construction adoption or learner release approval."
  });
  const viewConvention = freeze({ topRows: "back-to-front", topColumns: "left-to-right",
    heightMatrix: "H[z][column], with x = column + xOrigin", cubeCoordinates: "[x,y,z]; y is zero-based vertical height",
    layerNumber: "y + 1, counted from the ground", depthAxis: "z increases toward the front",
    supportedColumns: true, preserveEmptyRowsAndColumns: true, fixedOrientation: true,
    quotientByRotationOrReflection: false });
  function make(suffix, mode, stages, pdfPage, crop, cropSha256, cropXYWH, firstHeights, learnerRecipe) {
    const sourceItemId = `6-2-u3-e2-${suffix}`;
    return { sourceItemId, mode, pools: stages.map(n => ({ n })), variantCount: stages.length,
      supportedStageRange: { minimum: 1, maximum: Math.max(...stages) },
      sourceFirstThreeHeights: firstHeights, learnerRecipe, patternConditionPolicy, ...verification,
      source: { rawSourceItemId: sourceItemId, pdfPage, printedPage: pdfPage + 2,
        pdfSha256: "69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE",
        pdfHashBasis: "Independent source report; this pure model does not open the PDF.",
        pageImage: `pdf-${pdfPage}-printed-${pdfPage + 2}-source.png`,
        pageImageSha256: pdfPage === 32 ? "6B39C7FE96670285DED1F6980628F4F2DF3C7EDC9CC52C102BB24229A06EAF05" : "D5DC7DE2921D99B0253A0568160093DBD17078C02FDE89C1CE8979DB869D553D",
        cropFile: crop, cropSha256, cropXYWH,
        independentReportFile: "independent-pattern-review.md",
        independentReportSha256: "8140B3E7AC8200C9F7D15BE163A293AB7272F0C18AF088955A73ACCDAAD541E1",
        parentDirectSourceRecheck: "Separate parent crop inspection; not publisher answer verification.",
        firstStatesBasis: "Explicit source height transcriptions in the independent report, normalized to the stated axes." }
    };
  }
  const definitions = freeze([
    make("example-2", "t-layer-total-and-difference", [25,20,30], 32, "example2-2-original.png",
      "FFDD0604850EE125343A37D7879B7BEFD94128BE455A94BE84619E003D2D2ED0", [200,1370,1450,430],
      [[[1,1,1],[0,1,0]], [[1,2,2,2,1],[0,0,2,0,0],[0,0,1,0,0]],
        [[1,2,3,3,3,2,1],[0,0,0,3,0,0,0],[0,0,0,2,0,0,0],[0,0,0,1,0,0,0]]],
      ["Use as many layers as the stage number. On the top layer place three cubes in a line and one cube in front of the middle cube.",
        "For each layer below, fill the same positions as the layer above and extend each of the three arms by one cube. Continue down to the ground and place no other cubes."]),
    make("mission-1", "two-direction-stair-total", [5,4,6], 33, "mission1-original.png",
      "27910D959229ED790459CA4616EFA08A983AB9E3174BA2C30918EB8375DD437B", [166,270,780,670],
      [[[1]], [[2,2],[2,1]], [[3,3,3],[3,2,2],[3,2,1]]],
      ["Make a square base with as many cells along each side as the stage number. From the lowest front corner number both base edges, starting at one.",
        "For each position, use the larger of its two edge numbers as the column height. Fill every column from the ground without gaps and place no cubes elsewhere."]),
    make("mission-3", "border-checker-surface-minus-count", [10,8,12], 33, "mission3-original.png",
      "606FFE5D17DFFEDED10AC6C9F59B69FD33F4974C2050506755515CC756AB5A12", [115,1650,826,745],
      [[[1,1,1],[1,0,1],[1,1,1]],
        [[1,1,1,1,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,1,1,1,1]],
        [[1,1,1,1,1,1,1],[1,0,1,0,1,0,1],[1,1,0,1,0,1,1],[1,0,1,0,1,0,1],
          [1,1,0,1,0,1,1],[1,0,1,0,1,0,1],[1,1,1,1,1,1,1]]],
      ["Make a square height grid whose side length is twice the stage number plus one. Put one cube in each border cell.",
        "Inside the border alternate empty cells and single cubes in both directions, starting with an empty cell at the upper left of the interior. Rebuild this pattern at every stage; do not merely append a border to the old state.",
        "Count all faces not touching another cube, including sides facing holes, but none of the faces touching the ground. Subtract the cube-count number from the surface-area number; this is a numeric difference, not subtraction of physical units."])
  ]);
  const directions = freeze([["positiveX",1,0,0],["negativeX",-1,0,0],
    ["positiveY",0,1,0],["negativeY",0,-1,0],["positiveZ",0,0,1],["negativeZ",0,0,-1]]);
  function definitionFor(sourceItemId) {
    const definition = definitions.find(item => item.sourceItemId === sourceItemId);
    if (!definition) fail("Unsupported stack pattern source");
    return definition;
  }
  function validate(definition, condition) {
    if (!condition || typeof condition !== "object" || Array.isArray(condition) ||
      Reflect.ownKeys(condition).length !== 1 || !Object.hasOwn(condition,"n") ||
      !isInteger(condition.n,1,definition.supportedStageRange.maximum)) fail("Unsupported stack pattern stage or condition");
  }
  function heightGrid(definition, n) {
    if (definition.mode === "t-layer-total-and-difference") {
      const H = Array.from({length:n+1},() => Array(2*n+1).fill(0));
      for (let x=-n;x<=n;x++) H[0][x+n] = x === 0 ? n : n-Math.abs(x)+1;
      for (let z=1;z<=n;z++) H[z][n] = n-z+1;
      return { H, xOrigin: -n };
    }
    if (definition.mode === "two-direction-stair-total") {
      // Report coordinates i,j start at the lowest front corner: i=n-x, j=n-z.
      return { H: Array.from({length:n},(_,z) => Array.from({length:n},(_,x) => n-Math.min(x,z))), xOrigin: 0 };
    }
    const side = 2*n+1;
    return { H: Array.from({length:side},(_,z) => Array.from({length:side},(_,x) =>
      x === 0 || z === 0 || x === side-1 || z === side-1 || (x+z)%2 === 1 ? 1 : 0)), xOrigin: 0 };
  }
  function summarize(cubes, highest) {
    const occupied = new Set(cubes.map(cube => cube.join(",")));
    const layers = Array.from({length:highest},(_,i) => ({layer:i+1,cells:[],count:0}));
    const exposedByDirection = Object.fromEntries(directions.map(([name]) => [name,0]));
    let directedContacts=0, groundBottomFaces=0;
    for (const [x,y,z] of cubes) {
      layers[y].cells.push([x,z]); layers[y].count++;
      for (const [name,dx,dy,dz] of directions) {
        if (occupied.has([x+dx,y+dy,z+dz].join(","))) directedContacts++;
        else { exposedByDirection[name]++; if (dy === -1 && y === 0) groundBottomFaces++; }
      }
    }
    const allExposedFaces = Object.values(exposedByDirection).reduce((a,b) => a+b,0);
    return { layers, layerCounts: layers.map(layer => layer.count), surface: { exposedByDirection,
      sharedFacePairs: directedContacts/2, allExposedFaces, groundBottomFaces,
      exposedFacesExcludingAllBottom: allExposedFaces-groundBottomFaces } };
  }
  function formulas(definition, n) {
    if (definition.mode === "t-layer-total-and-difference") return {
      totalCubes: n*(3*n+5)/2, layerCounts: Array.from({length:n},(_,y) => 3*(n-y)+1),
      layerDifference: 3*(n-1), columnTotal: n+3*n*(n+1)/2,
      allExposedFaces: 3*n*n+13*n+2, exposedFacesExcludingAllBottom: 3*n*n+10*n+1 };
    if (definition.mode === "two-direction-stair-total") return {
      totalCubes: n*(n+1)*(4*n-1)/6, layerCounts: Array.from({length:n},(_,y) => n*n-y*y),
      columnTotal: Array.from({length:n},(_,i) => (i+1)*(2*i+1)).reduce((a,b) => a+b,0),
      allExposedFaces: 6*n*n, exposedFacesExcludingAllBottom: 5*n*n };
    const zeroCells = n*n+(n-1)*(n-1), totalCubes = 2*n*(n+3), sharedFacePairs = 12*n-4;
    return { totalCubes, layerCounts:[totalCubes], zeroCells, sharedFacePairs,
      rowTotal: 2*(2*n+1)+n*(n+1)+(n-1)*(n+2),
      allExposedFaces: 6*totalCubes-2*sharedFacePairs,
      exposedFacesExcludingAllBottom: totalCubes+4*(2*n+1)+4*zeroCells,
      sharedFaceSurfaceExcludingAllBottom: 5*totalCubes-2*sharedFacePairs,
      numericDifference: 4*(2*n+1)+4*zeroCells };
  }
  function build(sourceItemId, condition) {
    const definition = definitionFor(sourceItemId);
    validate(definition,condition);
    const { n } = condition, { H, xOrigin } = heightGrid(definition,n), cubes=[], columns=[];
    for (let z=0;z<H.length;z++) for (let column=0;column<H[z].length;column++) if (H[z][column]) {
      const x=column+xOrigin, height=H[z][column]; columns.push({x,z,height});
      for (let y=0;y<height;y++) cubes.push([x,y,z]);
    }
    const highest = Math.max(...columns.map(column => column.height)), summary=summarize(cubes,highest);
    if (definition.mode === "border-checker-surface-minus-count") {
      summary.surface.cubeEdgeLengthCm = 1;
      summary.surface.surfaceAreaExcludingAllBottomCm2 = summary.surface.exposedFacesExcludingAllBottom;
    }
    const totalCubes=cubes.length, firstLayerCount=summary.layerCounts[0], lastLayerCount=summary.layerCounts.at(-1);
    const layerDifference=firstLayerCount-lastLayerCount;
    const numericDifference=summary.surface.exposedFacesExcludingAllBottom-totalCubes;
    const expected=formulas(definition,n);
    const matches = totalCubes === expected.totalCubes &&
      summary.layerCounts.every((count,i) => count === expected.layerCounts[i]) &&
      summary.surface.allExposedFaces === expected.allExposedFaces &&
      summary.surface.exposedFacesExcludingAllBottom === expected.exposedFacesExcludingAllBottom;
    if (!matches) throw new Error("Stack pattern construction/formula mismatch");
    const answer = definition.mode === "t-layer-total-and-difference" ? { totalCubes,layerDifference } :
      definition.mode === "two-direction-stair-total" ? totalCubes : numericDifference;
    return freeze({ sourceItemId, mode:definition.mode, n, condition:copy(condition), sourceRef:definition.source,
      H, heights:H, xOrigin, zOrigin:0, columns, cubes, highest, totalCubes, ...summary,
      firstLayerCount, lastLayerCount, layerDifference, numericDifference, answer,
      formulaAudit:{expected,matches}, viewConvention, learnerRecipe:definition.learnerRecipe, patternConditionPolicy,
      answerStatus:"conditional-independent-calculation", uniqueRequestedNumericAnswerUnderConstruction:true,
      ...verification });
  }
  function solve(sourceItemId, variant = 0) {
    const definition = definitionFor(sourceItemId);
    if (!isInteger(variant,0,definition.variantCount-1)) fail("Unsupported stack pattern variant");
    return freeze({...build(sourceItemId,definition.pools[variant]),variant});
  }
  function firstStates(sourceItemId) {
    definitionFor(sourceItemId);
    return freeze([1,2,3].map(n => build(sourceItemId,{n})));
  }
  return freeze({ definitions, build, solve, firstStates, viewConvention, patternConditionPolicy, ...verification });
});
