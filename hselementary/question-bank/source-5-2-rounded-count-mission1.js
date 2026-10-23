(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDED_COUNT_MISSION1 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-1-rounded-count";
  const generatorKey = "source52RoundedCountMission1";
  const pools = Object.freeze([
    Object.freeze({ hundredTarget: 2300, tenCeilingTarget: 2350 }),
    Object.freeze({ hundredTarget: 3700, tenCeilingTarget: 3650 }),
    Object.freeze({ hundredTarget: 4800, tenCeilingTarget: 4850 })
  ]);
  const offsets = Object.freeze([-100, 0, 100]);
  const format = value => Number(value).toLocaleString("ko-KR");

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[variant];
    const delta = offsets[difficultyOffset + 1];
    const hundredTarget = pool.hundredTarget + delta;
    const tenCeilingTarget = pool.tenCeilingTarget + delta;
    const hundredRange = [hundredTarget - 50, hundredTarget + 49];
    const ceilingRange = [tenCeilingTarget - 9, tenCeilingTarget];
    const commonRange = [Math.max(hundredRange[0], ceilingRange[0]), Math.min(hundredRange[1], ceilingRange[1])];
    if (commonRange[0] > commonRange[1]) return null;
    const count = commonRange[1] - commonRange[0] + 1;
    const prompt = `어떤 자연수를 반올림하여 백의 자리까지 나타내면 ${format(hundredTarget)}이고, 올림하여 십의 자리까지 나타내면 ${format(tenCeilingTarget)}입니다. 두 조건을 모두 만족하는 자연수는 모두 몇 개인가요?`;
    const solution = `<ol><li>백의 자리까지 반올림하여 ${format(hundredTarget)}이 되는 자연수는 ${format(hundredRange[0])}부터 ${format(hundredRange[1])}까지입니다.</li><li>십의 자리까지 올림하여 ${format(tenCeilingTarget)}이 되는 자연수는 ${format(ceilingRange[0])}부터 ${format(ceilingRange[1])}까지입니다.</li><li>두 범위의 공통 부분은 ${format(commonRange[0])}부터 ${format(commonRange[1])}까지입니다.</li><li>${format(commonRange[1])}−${format(commonRange[0])}+1=${count}이므로 모두 ${count}개입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: `${count}개`,
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
      questionModel: { hundredTarget, tenCeilingTarget, hundredRange, ceilingRange, commonRange },
      answerModel: { count }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedCountMission1Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52RoundedCountMission1Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, offsets, getQuestion, install, publisherKeyVerified: false });
});
