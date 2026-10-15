(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_MODELS = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  function freeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze); Object.freeze(value);
    }
    return value;
  }
  const sourceItemId = "6-2-u3-e2-mission-5";
  const pools = freeze([6, 5, 7]);
  const sourceRef = freeze({ sourceItemId, pdfPage: 33, printedPage: 35,
    sourceSha256: "69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE",
    cropSha256: "E96A0E7BDCFCCC149D886E440768E03E01F47393BBC4E3CEA861F3AAB9EE9D48" });
  const directions = freeze([["right", 1, 0, 0], ["left", -1, 0, 0],
    ["top", 0, 1, 0], ["bottom", 0, -1, 0], ["front", 0, 0, 1], ["back", 0, 0, -1]]);
  const verification = freeze({ registrationOnly: true, sourceExact: false,
    originalSourceReleaseStatus: "locked", originalAnswerDeterminate: false,
    officialAnswerVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
    humanApproved: false, constructionConditionApproved: false, teacherReleaseVerified: false,
    learnerReleaseVerified: false, sourceFidelityVerified: false, renderedFidelityVerified: false,
    difficultyVerified: false, empiricallyCalibrated: false, independentMathReviewVerified: false });
  const constructionText = "맨 위층에 쌓기나무 한 개를 놓습니다. 아래로 한 층 내려갈 때마다 가로와 세로가 한 칸씩 늘어난 정사각형을 만들되, 그림에서 가장 앞쪽 모서리 한 칸에는 쌓기나무를 놓지 않습니다. 각 층의 뒤쪽 모서리는 맞추고 바닥부터 빈틈없이 쌓으며 그 밖에는 놓지 않습니다.";
  const visibilityText = "어느 방향에서든 바깥으로 드러난 면이 하나라도 있으면 보이는 쌓기나무이며 뒤쪽의 면도 포함합니다. 바닥에 닿은 면도 보이는 면으로 셉니다.";
  const conditionPolicy = freeze({ constructionText, visibilityText,
    explicitConstructionRequired: true, sourceConditionsClarified: true,
    sourceOnlyFutureAndVisibilityClarified: true, sourceUpperFourLayersPreserved: true,
    omittedSourceBottomLayers: 2, backCornersAligned: true, gapFreeGroundSupportedColumns: true,
    noOtherCubes: true, missingFrontCornerEveryNonTopLayer: true, topCubeKept: true,
    allSixNeighborFaces: true, groundBottomCountedVisible: true, rearFacesCountedVisible: true,
    cameraOcclusionDefinesVisibility: false, sourceIsFullSquarePyramid: false,
    filledStateIsExplicitCounterfactual: true, answerBasis: "conditional-independent-calculation",
    sourceSixLayerTeacherState: "original-notched; full-square only after explicit corner filling",
    clarificationScope: "future construction and exterior-face visibility only; original question retained",
    handwrittenAnswersAreOfficial: false, parentAutomaticallyApprovesHandwrittenAnswers: false });
  const viewConvention = freeze({ heightMatrix: "H[z][x]", cubeCoordinates: "[x,y,z]",
    layerCells: "[x,z]", layerNumber: "y+1, ascending from ground",
    backPeak: [0, 0], frontmostCorner: "[side-1,side-1]",
    xOrigin: 0, zOrigin: 0, groundY: 0, fixedOrientation: true });
  function build(n, filled = false) {
    if (!Number.isSafeInteger(n) || n < 1 || n > 7 || typeof filled !== "boolean") {
      throw new RangeError("Expected integer layer count 1..7 and boolean filled state");
    }
    const H = Array.from({ length: n }, (_, z) => Array.from({ length: n }, (_, x) =>
      n - Math.max(x, z) - (!filled && x === z && x > 0 ? 1 : 0)));
    const cubes = [];
    for (let z = 0; z < n; z++) for (let x = 0; x < n; x++) {
      for (let y = 0; y < H[z][x]; y++) cubes.push([x, y, z]);
    }
    const occupied = new Set(cubes.map(cube => cube.join(",")));
    const layers = Array.from({ length: n }, (_, y) => ({ layer: y + 1, y, side: n - y,
      cells: [], visibleCells: [], hiddenCells: [], occupied: 0, count: 0 }));
    const exposedByCube = cubes.map(cube => {
      const [x, y, z] = cube;
      const exposedFaces = directions.filter(([, dx, dy, dz]) =>
        !occupied.has([x + dx, y + dy, z + dz].join(",")))
        .map(([face]) => ({ face, reason: face === "bottom" && y === 0 ? "ground" : "exterior" }));
      const visible = exposedFaces.length > 0;
      const layer = layers[y];
      layer.cells.push([x, z]);
      layer[visible ? "visibleCells" : "hiddenCells"].push([x, z]);
      layer.occupied++; layer.count++;
      return { cube, exposedFaces, faces: exposedFaces.map(item => item.face),
        contacts: 6 - exposedFaces.length, visible, hidden: !visible };
    });
    const total = layers.reduce((sum, layer) => sum + layer.cells.length, 0);
    const hidden = layers.reduce((sum, layer) => sum + layer.hiddenCells.length, 0);
    const visible = total - hidden;
    const counts = { total, visible, hidden, difference: visible - hidden };
    return freeze({ sourceItemId, n, filled, state: filled ? "explicitly-filled-front-corners" : "original-notched",
      H, cubes, layers, exposedByCube, counts, ...counts, sourceTotal: total,
      sourceTotalBasis: "direct sum of occupied layer cells", sourceRef, conditionPolicy, viewConvention,
      answerStatus: "conditional-independent-calculation", requestedAnswerUnique: true,
      uniqueRequestedNumericAnswerUnderConstruction: true, ...verification });
  }
  function solve(variant = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length) {
      throw new RangeError("Unsupported notched Mission5 variant");
    }
    return freeze({ ...build(pools[variant]), variant, variantCount: pools.length });
  }
  return freeze({ build, solve, pools, sourceItemId, sourceRef, directions,
    constructionText, visibilityText, conditionPolicy, viewConvention, verification, ...verification });
});
