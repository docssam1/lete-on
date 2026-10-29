(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE51_M6 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e2-mission-6";
  const generatorKey = "source52CuboidNetPerimeterPage51Mission6";
  const sourcePrompt = "둘레가 98cm인 어떤 정육면체의 전개도가 있다. 이 전개도를 접어서 만든 정육면체의 모든 모서리의 길이의 합을 구하여라.";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 47, sourcePrintedPage: 51 });

  function verifyModel() {
    const faceCount = 6;
    const seamCount = faceCount - 1;
    const perimeterEdges = faceCount * 4 - seamCount * 2;
    const edgeCount = 12;
    const sourcePerimeterCm = 98;
    if (perimeterEdges !== 14 || sourcePerimeterCm % perimeterEdges !== 0) {
      throw new Error("전개도 외곽 둘레에서 모서리 길이를 정수로 구할 수 없습니다.");
    }
    const edgeLengthCm = sourcePerimeterCm / perimeterEdges;
    const totalEdgeLengthCm = edgeCount * edgeLengthCm;
    if (edgeLengthCm !== 7 || totalEdgeLengthCm !== 84) {
      throw new Error("원문 둘레에서 정육면체 모서리 합을 확인할 수 없습니다.");
    }
    return Object.freeze({ sourceItemId, faceCount, seamCount, perimeterEdges, sourcePerimeterCm, edgeLengthCm, edgeCount, totalEdgeLengthCm, unique: true });
  }

  function makeQuestion() {
    const model = verifyModel();
    const prompt = `<div class="source52-p51m6-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>${sourcePrompt}</p></div>`;
    const solution = `<div class="source52-p51m6-solution" data-source-answer="${sourceItemId}"><p>정육면체 전개도는 정사각형 여섯 개로 이루어집니다. 여섯 면의 둘레를 모두 더하면 한 모서리 길이의 24배입니다.</p><p>전개도에서 여섯 면을 이어 주는 접힘선은 다섯 개입니다. 접힘선은 바깥 둘레에 속하지 않고 각 면의 둘레에서 두 번씩 세었으므로, 한 모서리 길이의 10배를 뺍니다. 따라서 바깥 둘레는 한 모서리 길이의 24−10=14배입니다.</p><ol><li>한 모서리의 길이: 98 ÷ 14 = 7(cm)</li><li>정육면체의 모서리는 12개이므로, 모든 모서리 길이의 합: 7 × 12 = <strong>84(cm)</strong></li></ol></div>`;
    return Object.freeze({
      prompt, answer: "84cm", solution, sourceItemId, generator: generatorKey,
      variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0,
      verifiedVariantId: `${sourceItemId}:cube-net-perimeter`, difficultyOffset: 0,
      difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true,
      answerVisualRequired: false, publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-six-face-net-perimeter-proof",
      generationMode: "fixed-verified-pool", verifiedVariantCount: 1,
      verifiedVariantTarget: 1, answerModel: model
    });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P51M6Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P51M6Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, verifyModel, makeQuestion, install });
});
