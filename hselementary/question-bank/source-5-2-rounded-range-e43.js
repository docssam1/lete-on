(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDED_RANGE_E43 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-example-3";
  const generatorKey = "source52RoundedRangeExample43";
  // Original targets 900 and 400 are intentionally absent from all synthetic pools.
  const pools = Object.freeze([[600, 200], [1200, 600], [1500, 700]]);
  const fmt = value => Number(value).toLocaleString("en-US");

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const [sumBase, differenceBase] = pools[variant];
    const sumTarget = sumBase + difficultyOffset * 100;
    const differenceTarget = differenceBase + difficultyOffset * 100;
    const sumRange = [sumTarget - 50, sumTarget + 50];
    const differenceRange = [differenceTarget - 50, differenceTarget + 50];
    const minimum = (sumRange[0] + differenceRange[0]) / 2;
    const upperExclusive = (sumRange[1] + differenceRange[1]) / 2;
    if (!Number.isInteger(minimum) || !Number.isInteger(upperExclusive) || sumRange[0] <= differenceRange[1]) return null;
    const prompt = `두 수의 합을 반올림하여 백의 자리까지 나타내면 ${fmt(sumTarget)}이고, 두 수의 차를 반올림하여 백의 자리까지 나타내면 ${fmt(differenceTarget)}이다. 두 수 중 더 큰 수가 될 수 있는 수의 범위를 구하여라.`;
    const solution = `<ol><li>합을 백의 자리까지 반올림해 ${fmt(sumTarget)}이 되는 합은 ${fmt(sumRange[0])} 이상 ${fmt(sumRange[1])} 미만입니다.</li><li>차를 백의 자리까지 반올림해 ${fmt(differenceTarget)}이 되는 차는 ${fmt(differenceRange[0])} 이상 ${fmt(differenceRange[1])} 미만입니다.</li><li>큰 수는 (합+차)÷2이므로 가장 작을 때는 (${fmt(sumRange[0])}+${fmt(differenceRange[0])})÷2=${fmt(minimum)}입니다.</li><li>큰 수는 (${fmt(sumRange[1])}+${fmt(differenceRange[1])})÷2보다 작으므로 ${fmt(upperExclusive)} 미만입니다. 따라서 범위는 ${fmt(minimum)} 이상 ${fmt(upperExclusive)} 미만입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: `${fmt(minimum)} 이상 ${fmt(upperExclusive)} 미만`,
      solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`,
      sourceItemId, generator: generatorKey, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant, verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true, answerVisualRequired: false,
      answerVisualStatus: "not-required", publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      answerModel: { sumTarget, differenceTarget, sumRange, differenceRange, minimum, upperExclusive }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedRangeE43Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    generators.generatorKey = type => !isType(type) ? previousKey(type)
      : type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type)
      ? previousGenerate(type, rank, difficulty, seed, variant)
      : generators.generatorKey(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52RoundedRangeE43Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, getQuestion, install, publisherKeyVerified: false });
});
