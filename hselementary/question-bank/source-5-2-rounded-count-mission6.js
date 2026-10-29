(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDED_COUNT_MISSION6 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-6-rounded-place-synthetic";
  const generatorKey = "source52RoundedCountMission6";
  const pools = Object.freeze([4300, 6700, 9200]);
  const offsets = Object.freeze([-100, 0, 100]);
  const fmt = value => Number(value).toLocaleString("ko-KR");

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const target = pools[variant] + offsets[difficultyOffset + 1];
    const tensRange = [target - 5, target + 4];
    const hundredsRange = [target - 50, target + 49];
    const tensCount = tensRange[1] - tensRange[0] + 1;
    const hundredsCount = hundredsRange[1] - hundredsRange[0] + 1;
    if (target % 100 !== 0 || target % 1000 === 0 || tensCount !== 10 || hundredsCount !== 100) return null;

    const prompt = `어떤 자연수를 반올림하여 나타내었더니 ${fmt(target)}이 되었습니다. 반올림은 십의 자리 이상으로 합니다. 이런 자연수는 적어도 (ㄱ)개이고 가장 많으면 (ㄴ)개입니다. ㄱ과 ㄴ에 알맞은 수를 각각 구하세요.`;
    const solution = `<ol><li>십의 자리까지 반올림하면 ${fmt(tensRange[0])}부터 ${fmt(tensRange[1])}까지 ${tensCount}개의 자연수가 ${fmt(target)}이 됩니다.</li><li>백의 자리까지 반올림하면 ${fmt(hundredsRange[0])}부터 ${fmt(hundredsRange[1])}까지 ${hundredsCount}개의 자연수가 ${fmt(target)}이 됩니다.</li><li>천의 자리 이상으로 반올림하면 결과는 1,000의 배수가 되므로 ${fmt(target)}이 될 수 없습니다. 따라서 가능한 반올림 자리에서 가장 적은 수는 ${tensCount}개, 가장 많은 수는 ${hundredsCount}개입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: `ㄱ=${tensCount}개, ㄴ=${hundredsCount}개`,
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
      answerVerification: "independent-place-value-enumeration-user-authorized",
      questionModel: { target, tensRange, hundredsRange, tensCount, hundredsCount },
      answerModel: { minimumCount: tensCount, maximumCount: hundredsCount }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedCountMission6Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52RoundedCountMission6Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, offsets, getQuestion, install, publisherKeyVerified: false });
});
