(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_QUOTIENT_SUM_MISSION5 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-5-quotient-range-sum";
  const generatorKey = "source52QuotientSumMission5";
  const pools = Object.freeze([
    Object.freeze({ roundedTarget: 50, truncatedTarget: 70 }),
    Object.freeze({ roundedTarget: 60, truncatedTarget: 80 }),
    Object.freeze({ roundedTarget: 80, truncatedTarget: 110 })
  ]);
  const format = value => Number(value).toLocaleString("ko-KR");

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[variant];
    const roundedTarget = pool.roundedTarget + 10 * difficultyOffset;
    const truncatedTarget = pool.truncatedTarget + 10 * difficultyOffset;
    const roundedQuotientRange = [roundedTarget - 5, roundedTarget + 4];
    const truncatedQuotientRange = [truncatedTarget, truncatedTarget + 9];
    const dividedByNineRange = [roundedQuotientRange[0] * 9, (roundedQuotientRange[1] + 1) * 9 - 1];
    const dividedBySixRange = [truncatedQuotientRange[0] * 6, (truncatedQuotientRange[1] + 1) * 6 - 1];
    const commonRange = [Math.max(dividedByNineRange[0], dividedBySixRange[0]), Math.min(dividedByNineRange[1], dividedBySixRange[1])];
    if (commonRange[0] > commonRange[1]) return null;
    const count = commonRange[1] - commonRange[0] + 1;
    const sum = ((commonRange[0] + commonRange[1]) * count) / 2;
    const prompt = `어떤 자연수를 9로 나눈 몫을 반올림하여 십의 자리까지 나타내면 ${format(roundedTarget)}이 되고, 6으로 나눈 몫을 버림하여 십의 자리까지 나타내면 ${format(truncatedTarget)}이 됩니다. 조건에 맞는 자연수들의 합을 구하세요.`;
    const solution = `<ol><li>9로 나눈 몫을 반올림해 ${format(roundedTarget)}이 되려면 몫은 ${format(roundedQuotientRange[0])}부터 ${format(roundedQuotientRange[1])}까지입니다. 따라서 자연수는 ${format(dividedByNineRange[0])}부터 ${format(dividedByNineRange[1])}까지입니다.</li><li>6으로 나눈 몫을 버림해 ${format(truncatedTarget)}이 되려면 몫은 ${format(truncatedQuotientRange[0])}부터 ${format(truncatedQuotientRange[1])}까지입니다. 따라서 자연수는 ${format(dividedBySixRange[0])}부터 ${format(dividedBySixRange[1])}까지입니다.</li><li>두 범위의 공통 자연수는 ${format(commonRange[0])}부터 ${format(commonRange[1])}까지 ${count}개입니다.</li><li>그 합은 (${format(commonRange[0])}+${format(commonRange[1])})×${count}÷2=${format(sum)}입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: format(sum),
      solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`,
      sourceItemId,
      generator: generatorKey,
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant,
      verifiedVariantCount: pools.length,
      verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`,
      difficultyOffset,
      difficultyLevel: difficultyOffset + 1,
      difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true,
      answerVisualRequired: false,
      answerVisualStatus: "not-required",
      publisherKeyVerified: false,
      publisherAnswerVerified: false,
      handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { roundedTarget, truncatedTarget, roundedQuotientRange, truncatedQuotientRange, dividedByNineRange, dividedBySixRange, commonRange, count },
      answerModel: { sum }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52QuotientSumMission5Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52QuotientSumMission5Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, getQuestion, install, publisherKeyVerified: false });
});
