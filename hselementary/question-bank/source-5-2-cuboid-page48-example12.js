(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE48_E12 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e1-example-2";
  const generatorKey = "source52CuboidViewsPage48Example12";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 44, sourcePrintedPage: 48 });
  const dimensions = Object.freeze({ width: 12, depth: 4, height: 10 });
  const answerCm = 4 * (dimensions.width + dimensions.depth + dimensions.height);

  function verifyModel() {
    const { width, depth, height } = dimensions;
    if (width <= 0 || depth <= 0 || height <= 0) throw new Error("모서리 길이는 양수여야 합니다.");
    if (width !== 12 || depth !== 4 || height !== 10) throw new Error("원문 세 방향 치수가 바뀌었습니다.");
    if (answerCm !== 104) throw new Error("모든 모서리 합은 104cm여야 합니다.");
    return Object.freeze({ width, depth, height, edgeCount: 12, answerCm, formula: "4 × (12 + 4 + 10)" });
  }

  function diagram({ mobile = false } = {}) {
    verifyModel();
    const attrs = 'fill="none" stroke="#29251f" stroke-width="2.2"';
    const dim = 'fill="none" stroke="#71695c" stroke-width="1.35"';
    const text = (x, y, value, klass = "dimension") => `<text class="source52-p48e12-${klass}" x="${x}" y="${y}">${value}</text>`;
    const top = `<g class="source52-p48e12-view"><rect x="72" y="58" width="216" height="72" ${attrs}/><path d="M72 150v10 M288 150v10 M72 156h216 M300 58h17 M300 130h17 M310 58v72" ${dim}/><path d="m78 153-6 3 6 3 M282 153l6 3-6 3 M307 64l3-6 3 6 M307 124l3 6 3-6" ${dim}/>${text(180,181,"12cm")}${text(337,99,"4cm")}${text(180,224,"위","view-label")}</g>`;
    const side = `<g class="source52-p48e12-view"><rect x="475" y="22" width="72" height="180" ${attrs}/><path d="M475 213v10 M547 213v10 M475 219h72 M559 22h17 M559 202h17 M569 22v180" ${dim}/><path d="m481 216-6 3 6 3 M541 216l6 3-6 3 M566 28l3-6 3 6 M566 196l3 6 3-6" ${dim}/>${text(511,244,"4cm")}${text(596,116,"10cm")}${text(511,275,"옆","view-label")}</g>`;
    if (mobile) {
      return `<div class="source52-p48e12-mobile"><svg viewBox="40 38 330 205" role="img" aria-label="위에서 본 직육면체: 가로 12cm, 세로 4cm" xmlns="http://www.w3.org/2000/svg">${top}</svg><svg viewBox="450 6 190 284" role="img" aria-label="옆에서 본 직육면체: 가로 4cm, 높이 10cm" xmlns="http://www.w3.org/2000/svg">${side}</svg></div>`;
    }
    return `<svg class="source52-p48e12-desktop" viewBox="35 0 620 300" role="img" aria-label="위에서 본 그림은 12cm와 4cm, 옆에서 본 그림은 4cm와 10cm인 직육면체" xmlns="http://www.w3.org/2000/svg">${top}${side}</svg>`;
  }

  function makeQuestion() {
    const answerModel = verifyModel();
    const prompt = `<div class="source52-p48e12-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>어떤 직육면체를 위와 옆에서 본 그림이 다음과 같다. 이 직육면체의 모든 모서리의 합은 몇 cm인가?</p>${diagram()}${diagram({ mobile: true })}</div>`;
    const solution = `<div class="source52-p48e12-solution" data-source-answer="${sourceItemId}"><p>모든 모서리의 길이를 더해 봅시다.</p><ol><li>위에서 본 그림에서 가로는 12cm, 세로는 4cm입니다.</li><li>옆에서 본 그림에서 세로는 4cm, 높이는 10cm입니다.</li><li>직육면체에는 각 방향의 모서리가 4개씩 있으므로 <strong>4 × (12 + 4 + 10) = 104</strong>입니다.</li></ol><p class="source52-p48e12-final-answer">답: 104cm</p>${diagram()}${diagram({ mobile: true })}</div>`;
    return Object.freeze({ prompt, answer: "104cm", solution, sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0,
      verifiedVariantId: `${sourceItemId}:source-orthographic-views`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2,
      sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-three-dimension-edge-sum",
      generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P48E12Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P48E12Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, dimensions, answerCm, verifyModel, diagram, makeQuestion, install });
});
