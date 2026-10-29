(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE48_E13 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e1-example-3";
  const generatorKey = "source52CuboidFourPiecesPage48Example13";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 44, sourcePrintedPage: 48 });
  const source = Object.freeze({ width: 7, depth: 5, height: 3, xCutRatio: 1 / 3, depthCutRatio: 0.43 });

  function verifyModel() {
    const { width, depth, height } = source;
    for (const [xCutRatio, depthCutRatio] of [[source.xCutRatio, source.depthCutRatio], [0.19, 0.28], [0.67, 0.81]]) {
      if (xCutRatio <= 0 || xCutRatio >= 1 || depthCutRatio <= 0 || depthCutRatio >= 1) throw new Error("두 절단은 각각 직육면체 안쪽에 있어야 합니다.");
      const cutWidths = [width * xCutRatio, width * (1 - xCutRatio)];
      const cutDepths = [depth * depthCutRatio, depth * (1 - depthCutRatio)];
      const cutPieces = cutWidths.flatMap(pieceWidth => cutDepths.map(pieceDepth => ({ width: pieceWidth, depth: pieceDepth, height })));
      const cutTotals = [
        cutPieces.reduce((sum, piece) => sum + piece.width, 0),
        cutPieces.reduce((sum, piece) => sum + piece.depth, 0),
        cutPieces.reduce((sum, piece) => sum + piece.height, 0)
      ];
      const cutEdgeTotal = cutPieces.reduce((sum, piece) => sum + 4 * (piece.width + piece.depth + piece.height), 0);
      if (cutPieces.length !== 4 || Math.abs(cutTotals[0] - 14) > 1e-9 || Math.abs(cutTotals[1] - 10) > 1e-9 || cutTotals[2] !== 12 || Math.abs(cutEdgeTotal - 144) > 1e-9) {
        throw new Error("절단 위치와 관계없이 네 조각의 모서리 합은 144cm여야 합니다.");
      }
    }
    const widths = [width * source.xCutRatio, width * (1 - source.xCutRatio)];
    const depths = [depth * source.depthCutRatio, depth * (1 - source.depthCutRatio)];
    const pieces = widths.flatMap(pieceWidth => depths.map(pieceDepth => Object.freeze({ width: pieceWidth, depth: pieceDepth, height })));
    if (pieces.length !== 4 || pieces.some(piece => piece.width <= 0 || piece.depth <= 0 || piece.height !== 3)) throw new Error("원문처럼 네 개의 양의 크기 직육면체가 만들어져야 합니다.");
    const sumWidth = pieces.reduce((sum, piece) => sum + piece.width, 0);
    const sumDepth = pieces.reduce((sum, piece) => sum + piece.depth, 0);
    const sumHeight = pieces.reduce((sum, piece) => sum + piece.height, 0);
    const sumPieceEdgeLengths = pieces.reduce((sum, piece) => sum + 4 * (piece.width + piece.depth + piece.height), 0);
    if (Math.abs(sumWidth - 14) > 1e-9 || Math.abs(sumDepth - 10) > 1e-9 || sumHeight !== 12 || Math.abs(sumPieceEdgeLengths - 144) > 1e-9) {
      throw new Error("네 조각의 전체 모서리 길이 합은 144cm여야 합니다.");
    }
    return Object.freeze({ width, depth, height, pieces: pieces.map(piece => Object.freeze({ ...piece })), sumWidth, sumDepth, sumHeight,
      edgeCount: 12, answerCm: 144, formula: "4 × (2 × 7 + 2 × 5 + 4 × 3)" });
  }

  function diagram() {
    verifyModel();
    const edge = (x1, y1, x2, y2, cls = "edge") => `<line class="source52-p48e13-${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    const label = (x, y, value, cls = "dimension") => `<text class="source52-p48e13-${cls}" x="${x}" y="${y}">${value}</text>`;
    const A = [110, 270], B = [460, 270], C = [560, 170], D = [210, 170];
    const At = [110, 120], Bt = [460, 120], Ct = [560, 20], Dt = [210, 20];
    const xRatio = source.xCutRatio, dRatio = source.depthCutRatio;
    const xf = A[0] + (B[0] - A[0]) * xRatio;
    const xb = D[0] + (C[0] - D[0]) * xRatio;
    const yf = At[1] + (Dt[1] - At[1]) * dRatio;
    const yr = Bt[1] + (Ct[1] - Bt[1]) * dRatio;
    const yFrontSide = B[1] + (C[1] - B[1]) * dRatio;

    const outer = [
      edge(...At, ...Bt), edge(...Bt, ...Ct), edge(...Ct, ...Dt), edge(...Dt, ...At),
      edge(...At, ...A), edge(...A, ...B), edge(...B, ...Bt), edge(...B, ...C), edge(...C, ...Ct),
    ].join("");
    const cuts = [
      edge(xf, At[1], xf, A[1], "cut-edge"), edge(xf, At[1], xb, Dt[1], "cut-edge"),
      edge(At[0] + (Dt[0] - At[0]) * dRatio, yf, Bt[0] + (Ct[0] - Bt[0]) * dRatio, yf, "cut-edge"), edge(Bt[0] + (Ct[0] - Bt[0]) * dRatio, yr, B[0] + (C[0] - B[0]) * dRatio, yFrontSide, "cut-edge")
    ].join("");
    const dimensionLines = [
      edge(A[0], 292, A[0], 315, "dimension-line"), edge(B[0], 292, B[0], 315, "dimension-line"), edge(A[0], 307, B[0], 307, "dimension-line"),
      edge(469, B[1] - 3, 492, B[1] - 3, "dimension-line"), edge(569, C[1] - 3, 592, C[1] - 3, "dimension-line"), edge(485, B[1], 585, C[1], "dimension-line"),
      edge(580, C[1], 612, C[1], "dimension-line"), edge(580, Ct[1], 612, Ct[1], "dimension-line"), edge(600, Ct[1], 600, C[1], "dimension-line")
    ].join("");
    const arrows = [
      `<path d="M110 307l8-4v8zM460 307l-8-4v8zM485 270l8-1-4-6zM585 170l-8 1 4 6zM600 20l-4 8h8zM600 170l-4-8h8z" class="source52-p48e13-arrow"/>`
    ].join("");
    return `<svg class="source52-p48e13-diagram" viewBox="65 -2 570 344" role="img" aria-label="가로 7cm, 세로 5cm, 높이 3cm인 직육면체를 밑면의 두 방향으로 잘라 네 개의 직육면체로 나눈 그림" xmlns="http://www.w3.org/2000/svg"><g class="source52-p48e13-solid">${outer}${cuts}</g><g class="source52-p48e13-dimensions">${dimensionLines}${arrows}${label(285,338,"7cm")}${label(558,262,"5cm")}${label(627,100,"3cm")}</g></svg>`;
  }

  function makeQuestion() {
    const answerModel = verifyModel();
    const prompt = `<div class="source52-p48e13-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>가로, 세로, 높이가 각각 7cm, 5cm, 3cm인 직육면체를 그림과 같이 네 개의 작은 직육면체로 잘랐다. 네 개의 직육면체에 있는 모서리의 길이를 모두 더하면 몇 cm인가?</p>${diagram()}</div>`;
    const solution = `<div class="source52-p48e13-solution" data-source-answer="${sourceItemId}"><p>절단 위치가 달라도 네 조각의 가로 길이 합은 원래 가로의 두 배, 세로 길이 합은 원래 세로의 두 배입니다.</p><ol><li>네 조각에서 가로 길이의 합은 2×7=14cm입니다.</li><li>세로 길이의 합은 2×5=10cm이고, 높이 길이의 합은 4×3=12cm입니다.</li><li>직육면체 한 개의 모서리 길이 합은 가로·세로·높이 합의 4배입니다. 따라서 네 조각의 모서리 길이 합은 <strong>4×(14+10+12)=144cm</strong>입니다.</li></ol><p class="source52-p48e13-final-answer">답: 144cm</p></div>`;
    return Object.freeze({ prompt, answer: "144cm", solution, sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0,
      verifiedVariantId: `${sourceItemId}:source-two-direction-four-piece-cut`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2,
      sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-four-piece-edge-sum-partition-model", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P48E13Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P48E13Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, source, verifyModel, diagram, makeQuestion, install });
});
