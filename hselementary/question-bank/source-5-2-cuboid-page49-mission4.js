(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE49_M4 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e1-mission-4";
  const generatorKey = "source52Cuboid27CubesPage49Mission4";
  const dimensions = Object.freeze({ width: 3, height: 3, depth: 3 });
  const pieceCount = dimensions.width * dimensions.height * dimensions.depth;
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 45, sourcePrintedPage: 49 });

  function verifyModel() {
    const { width, height, depth } = dimensions;
    if (width !== 3 || height !== 3 || depth !== 3) throw new Error("원문 격자는 가로 3칸, 높이 3칸, 깊이 3칸이어야 합니다.");
    const frontPieces = width * height;
    if (frontPieces !== 9 || pieceCount !== 27) throw new Error("격자 한 칸씩 나뉜 조각은 27개 격자 조각이어야 합니다.");
    return Object.freeze({ ...dimensions, frontPieces, pieceCount, formula: "3³ + 2³ + 1³", answer: 36,
      interpretation: "모든 격자 경계 정육면체를 세고 전체를 포함한다" });
  }

  function diagram() {
    verifyModel();
    const edge = (x1, y1, x2, y2, cls = "outline") => `<line class="source52-p49m4-${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    const frontLeft = 50, frontTop = 68, cell = 55, depthX = 22, depthY = 17;
    const frontRight = frontLeft + 3 * cell, frontBottom = frontTop + 3 * cell;
    const backLeft = frontLeft + 3 * depthX, backRight = frontRight + 3 * depthX;
    const backTop = frontTop - 3 * depthY, backBottom = frontBottom - 3 * depthY;
    const lines = [];
    // Front: three columns by three rows.
    for (let x = 1; x < 3; x++) lines.push(edge(frontLeft + x * cell, frontTop, frontLeft + x * cell, frontBottom, "grid"));
    for (let y = 1; y < 3; y++) lines.push(edge(frontLeft, frontTop + y * cell, frontRight, frontTop + y * cell, "grid"));
    // Top: three columns by three depth rows.
    for (let x = 1; x < 3; x++) lines.push(edge(frontLeft + x * cell, frontTop, frontLeft + x * cell + 3 * depthX, backTop, "grid"));
    for (let z = 1; z < 3; z++) lines.push(edge(frontLeft + z * depthX, frontTop - z * depthY, frontRight + z * depthX, frontTop - z * depthY, "grid"));
    // Right: three depth columns by three rows.
    for (let z = 1; z < 3; z++) lines.push(edge(frontRight + z * depthX, frontTop - z * depthY, frontRight + z * depthX, frontBottom - z * depthY, "grid"));
    for (let y = 1; y < 3; y++) lines.push(edge(frontRight, frontTop + y * cell, backRight, frontTop + y * cell - 3 * depthY, "grid"));
    const outline = [
      edge(frontLeft, frontTop, frontRight, frontTop), edge(frontRight, frontTop, backRight, backTop),
      edge(backRight, backTop, backRight, backBottom), edge(backRight, backBottom, frontRight, frontBottom),
      edge(frontRight, frontBottom, frontLeft, frontBottom), edge(frontLeft, frontBottom, frontLeft, frontTop),
      edge(frontLeft, frontTop, backLeft, backTop), edge(backLeft, backTop, backRight, backTop)
    ].join("");
    return `<svg class="source52-p49m4-diagram" viewBox="0 0 430 245" role="img" aria-label="그어진 선을 따라 가로 세 칸, 높이 세 칸, 깊이 세 칸으로 나뉜 직육면체" xmlns="http://www.w3.org/2000/svg"><g>${lines.join("")}${outline}</g></svg>`;
  }

  function makeQuestion() {
    const answerModel = verifyModel();
    const prompt = `<div class="source52-p49m4-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음 그림은 쌓기나무 27개로 만든 정육면체입니다. 이 도형에서 선을 따라 잘라서 만들 수 있는 크고 작은 정육면체가 모두 몇 개인가? (단, 그대로 둔 전체 모양도 한 가지로 봅니다.)</p>${diagram()}</div>`;
    const solution = `<div class="source52-p49m4-solution" data-source-answer="${sourceItemId}"><p>격자선으로 만들 수 있는 정육면체를 크기별로 빠짐없이 세어 봅시다. 전체 모양도 한 가지로 셉니다.</p><ol><li>한 칸짜리 정육면체는 3×3×3=27개입니다.</li><li>두 칸짜리는 시작 칸이 각 방향에 2개씩이므로 2×2×2=8개입니다.</li><li>세 칸짜리 정육면체는 전체 모양 1개입니다. 따라서 모두 27+8+1=<strong>36</strong>개입니다.</li></ol><p class="source52-p49m4-final-answer">답: 36개</p></div>`;
    return Object.freeze({ prompt, answer: "36개", solution, answerVisual: diagram(), sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0,
      poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:all-grid-cubes-including-whole`, difficultyOffset: 0,
      difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: true,
      answerVisualStatus: "verified-reconstruction", publisherKeyVerified: false, publisherAnswerVerified: false,
      handwrittenAnswerVerified: false, answerVerification: "independent-grid-cube-count-including-whole", generationMode: "fixed-verified-pool",
      verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P49M4Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P49M4Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, dimensions, pieceCount, verifyModel, diagram, makeQuestion, install });
});
