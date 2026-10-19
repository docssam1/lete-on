(function(root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory(require("./source-6-2-plane-cut-models.js"));
  else root.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_MODELS = factory(root.HSE_SOURCE_GRADE6_PLANE_CUT_MODELS);
})(typeof window !== "undefined" ? window : globalThis, function(geometry) {
  "use strict";
  if (!geometry || !["planeFromPoints", "cubeClass", "sectionPolygon"].every(name => typeof geometry[name] === "function")) {
    throw new Error("Plane-cut geometry helpers must load first");
  }
  const sourceItemId = "6-2-u3-e4-example-2", sourceItemIds = [sourceItemId], pool = [4, 3, 5];
  const cycle = ["\uAC00", "\uB098", "\uB77C", "\uB2E4"];
  const freeze = value => { if (value && typeof value === "object" && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
  function build(n) {
    if (!pool.includes(n)) throw new RangeError("Unverified four-vertex cube size");
    const points = { "\uAC00": [0, n, n - 1], "\uB098": [n, n, n - 1], "\uB2E4": [0, 0, 0], "\uB77C": [n, 0, 0] };
    const plane = geometry.planeFromPoints([points[cycle[0]], points[cycle[1]], points[cycle[3]]].map(p => p.map(v => v * 2)));
    for (const point of Object.values(points)) {
      if (plane.normal.reduce((sum, coefficient, axis) => sum + coefficient * point[axis] * 2, 0) !== plane.constant) {
        throw new Error("Four source vertices must be coplanar");
      }
    }
    const cubes = [], cutCells = [], touchCells = [], layers = [];
    // Fixed-y sections also work when the x coefficient of the new plane is zero.
    const traceAt = height => geometry.sectionPolygon([0, height, 0], [n, height, n], plane).map(([x, , z]) => [x, z]);
    for (let y = 0; y < n; y++) {
      const cells = [], cuts = [], touches = [];
      for (let x = 0; x < n; x++) for (let z = 0; z < n; z++) {
        const cell = [x, y, z], kind = geometry.cubeClass(cell, plane);
        cubes.push(cell); cells.push([x, z]);
        if (kind.cut) { cutCells.push(cell); cuts.push([x, z]); }
        if (kind.touch) { touchCells.push(cell); touches.push([x, z]); }
      }
      layers.push({ layer: y + 1, cells, cells2D: cells, cutCells: cuts, touchCells: touches,
        cutCount: cuts.length, touchCount: touches.length, slabTraces: [traceAt(y), traceAt(y + 1)] });
    }
    const sectionEdges = cycle.map((from, index) => {
      const to = cycle[(index + 1) % cycle.length];
      return { from, to, a: points[from], b: points[to], style: "dashed" };
    });
    return freeze({ n, width: n, height: n, depth: n, dimensions: [n, n, n], points, plane, cubes, layers,
      cutCells, touchCells, cutCells3D: cutCells, touchCells3D: touchCells, cutCount: cutCells.length, touchCount: touchCells.length,
      planeSection: geometry.sectionPolygon([0, 0, 0], [n, n, n], plane), sectionEdges,
      directions: { x: "right", y: "up", z: "back" }, boundaryContactIsCut: false,
      answerUniqueScope: "four-specified-grid-vertices-and-interior-cut-definition",
      sourceReferenceSize: 4, sourceGeometryMatches: n === 4, variantDesignStatus: "authored-candidate-pending-adoption",
      originalSourceReleaseStatus: "locked", sourceExact: false, publisherAnswerVerified: false,
      humanApproved: false, learnerReleaseVerified: false, empiricallyCalibrated: false });
  }
  function solve(id, variant) {
    if (id !== sourceItemId || !Number.isSafeInteger(variant) || variant < 0 || variant >= pool.length) {
      throw new RangeError("Unsupported four-vertex source or variant");
    }
    return freeze({ ...build(pool[variant]), sourceItemId: id, variant, sourceRef: { pdfPage: 36, printedPage: 38, example: "4-2" } });
  }
  return freeze({ build, solve, sourceItemId, sourceItemIds, pool, pools: { [sourceItemId]: pool } });
});
