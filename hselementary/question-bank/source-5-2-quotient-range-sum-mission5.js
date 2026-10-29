(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_QUOTIENT_RANGE_SUM_MISSION5 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-5-quotient-range-sum";
  const generatorKey = "source52QuotientRangeSumMissionFive";
  const pools = Object.freeze([
    Object.freeze({ roundedQuotientTarget: 60, truncatedQuotientTarget: 90 }),
    Object.freeze({ roundedQuotientTarget: 80, truncatedQuotientTarget: 120 }),
    Object.freeze({ roundedQuotientTarget: 100, truncatedQuotientTarget: 150 })
  ]);
  const format = value => Number(value).toLocaleString("ko-KR");

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[variant];
    const roundedQuotientTarget = pool.roundedQuotientTarget + difficultyOffset * 10;
    const truncatedQuotientTarget = pool.truncatedQuotientTarget + difficultyOffset * 10;
    const roundedRange = [9 * (roundedQuotientTarget - 5), 9 * (roundedQuotientTarget + 5) - 1];
    const truncatedRange = [6 * truncatedQuotientTarget, 6 * (truncatedQuotientTarget + 10) - 1];
    const intersection = [Math.max(roundedRange[0], truncatedRange[0]), Math.min(roundedRange[1], truncatedRange[1])];
    if (roundedQuotientTarget <= 5 || truncatedQuotientTarget <= 0 || intersection[0] > intersection[1]) return null;
    const candidateCount = intersection[1] - intersection[0] + 1;
    const candidateSum = (intersection[0] + intersection[1]) * candidateCount / 2;
    const prompt = `어떤 자연수를 9로 나눈 몫을 반올림하여 십의 자리까지 나타내면 ${format(roundedQuotientTarget)}이 되고, 6으로 나눈 몫을 버림하여 십의 자리까지 나타내면 ${format(truncatedQuotientTarget)}이 됩니다. 이러한 자연수들의 합을 구하세요.`;
    const solution = `<ol><li>자연수를 n이라 하면 9로 나눈 몫을 십의 자리까지 반올림해 ${format(roundedQuotientTarget)}이 되는 조건은 ${format(roundedQuotientTarget - 5)}≤n÷9&lt;${format(roundedQuotientTarget + 5)}입니다. 따라서 ${format(roundedRange[0])}≤n≤${format(roundedRange[1])}입니다.</li><li>6으로 나눈 몫을 십의 자리까지 버림해 ${format(truncatedQuotientTarget)}이 되는 조건은 ${format(truncatedQuotientTarget)}≤n÷6&lt;${format(truncatedQuotientTarget + 10)}입니다. 따라서 ${format(truncatedRange[0])}≤n≤${format(truncatedRange[1])}입니다.</li><li>두 범위에 모두 들어가는 자연수는 ${format(intersection[0])}부터 ${format(intersection[1])}까지입니다. 모두 ${format(candidateCount)}개입니다.</li><li>따라서 합은 (${format(intersection[0])}+${format(intersection[1])})×${format(candidateCount)}÷2=${format(candidateSum)}입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: format(candidateSum),
      solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`,
      sourceItemId, generator: generatorKey, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant, verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { roundedQuotientTarget, truncatedQuotientTarget, roundedRange, truncatedRange, intersection, candidateCount },
      answerModel: { candidateSum, intersection, candidateCount }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52QuotientRangeSumMission5Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52QuotientRangeSumMission5Installed", { value: true });
    return true;
  }

  return Object.freeze({ sourceItemId, generatorKey, pools, getQuestion, install, publisherKeyVerified: false });
});
