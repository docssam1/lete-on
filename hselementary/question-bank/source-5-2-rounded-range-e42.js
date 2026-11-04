(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDED_RANGE_E42 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-example-2";
  const generatorKey = "source52RoundedRangeExample42";
  const originalId = "5-2-u1-e4-example-2-original";
  const originalKey = "source52RoundedRangeExample42Original";
  // Synthetic target quotients intentionally differ from the source targets 50 and 70.
  const pools = Object.freeze([[40, 60], [80, 120], [100, 150]]);
  const format = value => Number(value).toLocaleString("en-US");

  function getQuestion(variant = 0, difficultyOffset = 0, original = false) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= (original ? 1 : pools.length) || ![-1, 0, 1].includes(difficultyOffset)) return null;
    if (original) difficultyOffset=0;
    const itemId=original ? originalId : sourceItemId;
    const [firstTargetBase, secondTargetBase] = original ? [50,70] : pools[variant];
    const firstTarget = firstTargetBase + difficultyOffset * 20;
    const secondTarget = secondTargetBase + difficultyOffset * 20;
    const firstRange = [6 * (firstTarget - 5), 6 * (firstTarget + 5)];
    const secondRange = [4 * (secondTarget - 5), 4 * (secondTarget + 5)];
    const minimum = Math.max(firstRange[0], secondRange[0]);
    const upperExclusive = Math.min(firstRange[1], secondRange[1]);
    if (minimum >= upperExclusive) return null;
    const prompt = `어떤 자연수를 6으로 나눈 몫을 반올림하여 십의 자리까지 나타내었더니 ${format(firstTarget)}이 되었다. 또 이 자연수를 4로 나눈 몫을 반올림하여 십의 자리까지 나타내었더니 ${format(secondTarget)}이 되었다. 이 자연수의 범위를 이상과 미만을 사용하여 나타내어라.`;
    const solution = `<ol><li>6으로 나눈 몫이 ${format(firstTarget)}으로 반올림되려면 몫은 ${format(firstTarget - 5)} 이상 ${format(firstTarget + 5)} 미만입니다. 자연수 n은 ${format(firstRange[0])} 이상 ${format(firstRange[1])} 미만입니다.</li><li>4로 나눈 몫이 ${format(secondTarget)}으로 반올림되려면 몫은 ${format(secondTarget - 5)} 이상 ${format(secondTarget + 5)} 미만입니다. 자연수 n은 ${format(secondRange[0])} 이상 ${format(secondRange[1])} 미만입니다.</li><li>두 범위의 공통 부분은 ${format(minimum)} 이상 ${format(upperExclusive)} 미만입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${itemId}" data-source-item-id="${itemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: `${format(minimum)} 이상 ${format(upperExclusive)} 미만`,
      solution: `<div data-source-answer="${itemId}">${solution}</div>`,
      sourceItemId: itemId, generator: original ? originalKey : generatorKey, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant, verifiedVariantCount: original ? 1 : 3, verifiedVariantTarget: original ? 1 : 3,
      verifiedVariantId: `${itemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true, answerVisualRequired: false,
      answerVisualStatus: "not-required", publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      answerModel: { firstTarget, secondTarget, firstRange, secondRange, minimum, upperExclusive }
    });
  }

  function getOriginal(variant = 0, difficultyOffset = 0) { return getQuestion(variant, difficultyOffset, true); }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedRangeE42Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey || type.id === originalId || type.sourceItemId === originalId || type.generatorKey === originalKey);
    generators.generatorKey = type => !isType(type) ? previousKey(type)
      : ((type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey) || (type.id === originalId && type.sourceItemId === originalId && type.generatorKey === originalKey)) && type.reviewLocked === false && type.sourceVerified === true ? type.generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type)
      ? previousGenerate(type, rank, difficulty, seed, variant)
      : generators.generatorKey(type) ? (type.id === originalId ? getOriginal(variant, difficulty ?? 0) : getQuestion(variant, difficulty ?? 0)) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    if (Array.isArray(generators.names) && !generators.names.includes(originalKey)) generators.names.push(originalKey);
    Object.defineProperty(generators, "__source52RoundedRangeE42Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, getQuestion, getOriginal, install, publisherKeyVerified: false });
});
