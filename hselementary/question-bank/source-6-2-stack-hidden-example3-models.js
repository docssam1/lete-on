(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_MODELS = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  }
  const fail = message => { throw new RangeError(message); };
  const sourceItemId = "6-2-u3-e2-example-3";
  const verification = freeze({ registrationOnly: true, learnerReleaseVerified: false,
    officialAnswerVerified: false, renderedFidelityVerified: false, cameraRenderVisibilityVerified: false });
  const sourceH = freeze([[6,5,4,3,2,1],[5,5,4,3,2,1],[4,4,3,2,1,0],
    [3,3,2,1,0,0],[2,2,1,0,0,0],[1,1,0,0,0,0]]);
  const source = freeze({ rawSourceItemId: sourceItemId, pdfPage: 32, printedPage: 34,
    independentReportFile: "remaining-four-independent-review.md", independentReportSection: "\uC608\uC81C 2-3",
    independentReportSha256: "DC272DED7B58546B03093F77C05E53FBEAACEFC224667CB9CE93CBCE2692D30C",
    cropFile: "example-3-original.png", cropXYWH: [205,1800,1450,310],
    cropSha256: "80C993835C2C83921B9C7E13A54A919F21E4650DAE79847B63A4AA85ED035781",
    shapeFile: "example-3-shape.png", shapeXYWH: [1300,1805,345,285],
    shapeSha256: "E67B4D25F58EA0B3294AFABA0E6A6D3A579E5D08E2A1DDA72CD6929C3BB4E507",
    enlargedShapeFile: "example-3-shape-3x.png",
    enlargedShapeSha256: "5A017F6094A80C43CA93332F4DA717232E7138B26CAAF961146E174E725E553E",
    pointerFile: "example-3-source-head-pointers.csv",
    pointerSha256: "323FACFFF174FCEB00988763A7C346E67A6DFBF227B235F73563A8A539E0D776",
    pageFile: "pdf-32-printed-34-source.png",
    pageSha256: "6B39C7FE96670285DED1F6980628F4F2DF3C7EDC9CC52C102BB24229A06EAF05",
    pdfOpenedInThisWork: false, publisherAnswerProvided: false,
    evidenceBasis: "Report, original crop, enlarged shape and 26 top-face pointers inspected; handwriting is not answer authority." });
  const viewConvention = freeze({ coordinates: "[x,y,z]", verticalAxis: "y", heightLookup: "H[z][x]",
    rows: "z: back to front", columns: "x: left to right", groundY: 0,
    reportToRepository: "report (x, horizontal-y, vertical-z) -> [x, vertical-z-1, horizontal-y]",
    sourcePointerProjection: { origin: [144,170.6], x: [20,11.8], z: [-20,11.8], height: [0,-23.5],
      meaning: "Approximate shape-crop pixel locator only; not a renderer or camera proof." } });
  const bottomRule = freeze({ groundBottomCountedVisible: true, bottomExcludedFromVisibility: false,
    groundCubesNeverHidden: true, worldGroundOcclusionIgnored: true });
  const conditionPolicy = freeze({ finitePoolOnly: true, nPool: [6,5,7], exactFootprint: true,
    gapFreeGroundSupportedColumns: true, extraCellsAllowed: false, holesAllowed: false,
    heightConstruction: "H_n[z][x] = max(0,min(n-x,n-z,n+1-x-z))",
    hiddenRule: "All six faces touch other cubes; this is not a one-camera-visible cube count.",
    requestedAnswer: "Number of fully enclosed cubes only.",
    variantPolicy: "N=6 preserves the source height table. N=5/7 are explicit source-structure constructions, not other printed source figures.",
    releaseBoundary: "Locked: teacher interpretation and 3D camera/render visibility still need proof; no UI, question or publication approval." });
  const definitions = freeze([{ sourceItemId, mode: "all-six-faces-hidden", variantCount: 3,
    pools: [{n:6},{n:5},{n:7}], source, sourceH, conditionPolicy, bottomRule, ...verification }]);
  const directions = freeze([
    { face:"left", delta:[-1,0,0] }, { face:"right", delta:[1,0,0] },
    { face:"bottom", delta:[0,-1,0] }, { face:"top", delta:[0,1,0] },
    { face:"back", delta:[0,0,-1] }, { face:"front", delta:[0,0,1] }
  ]);
  function validate(id, condition) {
    if (id !== sourceItemId) fail("Unsupported hidden-cube source item");
    if (!condition || typeof condition !== "object" || Array.isArray(condition) ||
      Reflect.ownKeys(condition).length !== 1 || !Object.hasOwn(condition,"n")) {
      fail("Only the exact finite {n:6}, {n:5}, {n:7} construction pool is supported");
    }
    const descriptor = Object.getOwnPropertyDescriptor(condition,"n");
    if (!Object.hasOwn(descriptor,"value") || !Number.isSafeInteger(descriptor.value) ||
      !conditionPolicy.nPool.includes(descriptor.value)) fail("Expected a finite numeric n data property");
    return descriptor.value;
  }
  function build(id, condition) {
    const n = validate(id,condition);
    const H = Array.from({length:n},(_,z) => Array.from({length:n},(_,x) =>
      Math.max(0,Math.min(n-x,n-z,n+1-x-z))));
    if (n === 6 && JSON.stringify(H) !== JSON.stringify(sourceH)) throw new Error("Source height table mismatch");
    const cubes = [], columns = [], requiredTopFaces = [];
    for (let z=0;z<n;z++) for (let x=0;x<n;x++) {
      const height = H[z][x];
      if (!height) continue;
      columns.push({x,z,height});
      requiredTopFaces.push({position:[x,height-1,z],face:"top",height});
      for (let y=0;y<height;y++) cubes.push([x,y,z]);
    }
    const occupied = new Set(cubes.map(position => position.join(",")));
    const layers = Array.from({length:n},(_,y) => ({y,count:0,positions:[]}));
    const hiddenPositions = [], exteriorPositions = [], faceRecords = [];
    const exposedByDirection = Object.fromEntries(directions.map(({face}) => [face,0]));
    let touchingFaces = 0, exposedFaces = 0, groundBottomFaces = 0;
    for (const position of cubes) {
      const [x,y,z] = position;
      layers[y].count++;
      layers[y].positions.push(position);
      const faces = directions.map(({face,delta}) => {
        const neighbor = position.map((coordinate,i) => coordinate+delta[i]);
        const touching = occupied.has(neighbor.join(","));
        const groundBottom = face === "bottom" && y === 0;
        if (touching) touchingFaces++;
        else { exposedFaces++; exposedByDirection[face]++; }
        if (groundBottom) groundBottomFaces++;
        return {face,neighbor,touching,exposed:!touching,groundBottom,countedVisible:!touching};
      });
      const touchingFaceCount = faces.filter(record => record.touching).length;
      const fullyHidden = touchingFaceCount === 6;
      (fullyHidden ? hiddenPositions : exteriorPositions).push(position);
      faceRecords.push({position,faces,touchingFaceCount,exposedFaceCount:6-touchingFaceCount,fullyHidden});
    }
    return freeze({ sourceItemId:id, n, mode:"all-six-faces-hidden", condition:{n}, sourceRef:source,
      H, heights:H, cubes, columns, totalCubes:cubes.length, columnCount:columns.length,
      layers, layerCounts:layers.map(layer => layer.count), requiredTopFaces,
      requiredTopFaceCount:requiredTopFaces.length, hiddenPositions, hiddenCount:hiddenPositions.length,
      exteriorPositions, exteriorCount:exteriorPositions.length, faceRecords,
      faceCounts:{total:6*cubes.length,touching:touchingFaces,exposed:exposedFaces,
        sharedFacePairs:touchingFaces/2,groundBottomFaces,exposedByDirection,qaInternalOnly:true},
      bottomRule, viewConvention, conditionPolicy, answer:hiddenPositions.length,
      answerStatus:"independent-calculation-under-all-six-faces-construction", ...verification });
  }
  function solve(id, variant = 0) {
    if (id !== sourceItemId || !Number.isSafeInteger(variant) || variant < 0 || variant > 2) fail("Unsupported hidden-cube source or variant");
    return freeze({...build(id,definitions[0].pools[variant]),variant});
  }
  return freeze({ definitions, build, solve, directions, viewConvention, conditionPolicy, bottomRule, ...verification });
});
