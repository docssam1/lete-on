(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CITRUS_SALES_MISSION6 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u1-e3-mission-6-citrus-sales";
  const generatorKey = "source52ApplicationMissionSixCitrusSales";
  // Synthetic values preserve the source's three-day total → full-box count → sales model.
  const pools = [
    { harvest: [3267, 4118, 2579], boxSize: 400, boxPrice: 120000 },
    { harvest: [5273, 3021, 4082], boxSize: 600, boxPrice: 125000 },
    { harvest: [6811, 2734, 4465], boxSize: 700, boxPrice: 110000 }
  ];
  const thirdDayDeltas = [-1, 0, 1];
  const fmt = value => Number(value).toLocaleString("en-US");

  function build(variant, difficultyOffset) {
    const source = pools[variant];
    const harvest = [...source.harvest];
    harvest[2] += thirdDayDeltas[difficultyOffset + 1];
    const total = harvest.reduce((sum, count) => sum + count, 0);
    const fullBoxes = Math.floor(total / source.boxSize);
    const unpacked = total % source.boxSize;
    const revenue = fullBoxes * source.boxPrice;
    const hint = difficultyOffset === -1
      ? `<p class="source52-citrus-sales-hint">도움말: 전체 수를 한 상자에 담는 수로 나누고, 몫과 나머지를 구분하세요.</p>` : "";
    const extension = difficultyOffset === 1
      ? `<p>계산 과정에 포장하지 못하고 남은 감귤 수도 함께 적으세요.</p>` : "";
    const prompt = `<div class="source52-citrus-sales-question"><p>감귤 농장에서 3일 동안 수확한 감귤은 첫째 날 ${fmt(harvest[0])}개, 둘째 날 ${fmt(harvest[1])}개, 셋째 날 ${fmt(harvest[2])}개이다. 감귤을 ${fmt(source.boxSize)}개씩 상자에 담아 한 상자에 ${fmt(source.boxPrice)}원에 판매한다. 감귤을 모두 포장할 수는 없으며, 완성된 상자만 모두 판매한다면 판매 금액은 얼마인가?</p>${extension}${hint}</div>`;
    const solution = `<div class="source52-citrus-sales-solution"><ol><li>3일 동안 수확한 감귤은 ${fmt(harvest[0])}+${fmt(harvest[1])}+${fmt(harvest[2])}=${fmt(total)}개입니다.</li><li>${fmt(total)}÷${fmt(source.boxSize)}=${fmt(fullBoxes)}…${fmt(unpacked)}이므로 완성 상자는 ${fmt(fullBoxes)}개이고 ${fmt(unpacked)}개가 남습니다.</li><li>완성된 상자만 판매하므로 ${fmt(fullBoxes)}×${fmt(source.boxPrice)}=${fmt(revenue)}원입니다.</li></ol></div>`;
    return {
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${prompt}</div>`,
      answer: `${fmt(revenue)}원`, solution, sourceItemId, generator: generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: variant,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      difficultyDesign: ["guided-quotient-and-remainder", "independent-box-and-revenue-calculation", "include-unpacked-remainder"][difficultyOffset + 1],
      reasoningSteps: 2 + difficultyOffset + 1, sourceStructurePreserved: true,
      answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { harvest, boxSize: source.boxSize, boxPrice: source.boxPrice },
      answerModel: { harvest, total, boxSize: source.boxSize, boxPrice: source.boxPrice, fullBoxes, unpacked, revenue }
    };
  }

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    return Object.freeze(build(variant, difficultyOffset));
  }
  const definition = Object.freeze({ sourceItemId, generatorKey, poolCount: pools.length });
  function resolves(type) { return Boolean(type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey); }
  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52ApplicationMissionSixInstalled) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey));
    generators.generatorKey = type => !belongs(type) ? previousKey(type) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "";
    generators.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => !belongs(type) ? previousGenerate(type, levelRank, difficultyOffset, seed, variant) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? getQuestion(variant, difficultyOffset ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52ApplicationMissionSixInstalled", { value: true });
    return true;
  }
  return Object.freeze({ definition, pools, getQuestion, resolves, install, publisherKeyVerified: false });
});
