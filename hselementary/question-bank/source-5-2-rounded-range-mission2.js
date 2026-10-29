(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDED_RANGE_MISSION2 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-2-rounded-floor-range";
  const generatorKey = "source52RoundedRangeMissionTwo";
  // Avoid the source targets 4,000 / 3,000 in every generated configuration.
  const targets = Object.freeze([8000, 11000, 14000]);
  const difficultyOffsets = Object.freeze([-1, 0, 1]);
  const format = value => Number(value).toLocaleString("ko-KR");

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= targets.length || !difficultyOffsets.includes(difficultyOffset)) return null;
    const hundredRoundTarget = targets[variant] + difficultyOffset * 1000;
    const thousandFloorTarget = hundredRoundTarget - 1000;
    const hundredRoundRange = [hundredRoundTarget - 50, hundredRoundTarget + 49];
    const thousandFloorRange = [thousandFloorTarget, thousandFloorTarget + 999];
    const intersection = [Math.max(hundredRoundRange[0], thousandFloorRange[0]), Math.min(hundredRoundRange[1], thousandFloorRange[1])];
    if (intersection[0] > intersection[1]) return null;
    const upperExclusive = intersection[1] + 1;
    const prompt = `어떤 자연수를 반올림하여 백의 자리까지 나타내면 ${format(hundredRoundTarget)}이고, 버림하여 천의 자리까지 나타내면 ${format(thousandFloorTarget)}입니다. 이 조건을 모두 만족하는 자연수는 모두 몇 개인가요?`;
    const solution = `<ol><li>백의 자리까지 반올림하여 ${format(hundredRoundTarget)}이 되는 자연수는 ${format(hundredRoundRange[0])} 이상 ${format(hundredRoundRange[1] + 1)} 미만입니다.</li><li>천의 자리까지 버림하여 ${format(thousandFloorTarget)}이 되는 자연수는 ${format(thousandFloorRange[0])} 이상 ${format(thousandFloorRange[1] + 1)} 미만입니다.</li><li>두 범위의 공통 부분은 ${format(intersection[0])} 이상 ${format(upperExclusive)} 미만입니다.</li><li>${format(intersection[1])}−${format(intersection[0])}+1=${intersection[1]-intersection[0]+1}이므로 모두 ${intersection[1]-intersection[0]+1}개입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: `${intersection[1]-intersection[0]+1}개`,
      solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`,
      sourceItemId, generator: generatorKey, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant, verifiedVariantCount: targets.length, verifiedVariantTarget: targets.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { hundredRoundTarget, thousandFloorTarget, hundredRoundRange, thousandFloorRange, intersection, upperExclusive },
      answerModel: { lowerInclusive: intersection[0], upperExclusive, count: intersection[1]-intersection[0]+1 }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedRangeMission2Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52RoundedRangeMission2Installed", { value: true });
    return true;
  }

  return Object.freeze({ sourceItemId, generatorKey, targets, difficultyOffsets, getQuestion, install, publisherKeyVerified: false });
});
