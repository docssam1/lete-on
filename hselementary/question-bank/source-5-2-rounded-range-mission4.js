(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDED_RANGE_MISSION4 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-4-rounded-seven-million-range";
  const generatorKey = "source52RoundedRangeMissionFour";
  const targets = Object.freeze([5600000, 7000000, 9200000]);
  const hundredThousand = 100000;
  const format = value => Number(value).toLocaleString("ko-KR");

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= targets.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const roundedTarget = targets[variant] + difficultyOffset * hundredThousand;
    if (roundedTarget <= 0 || roundedTarget === 7900000) return null;
    const truncatedTarget = roundedTarget;
    const ceilingTarget = roundedTarget + hundredThousand;
    const lowerExclusive = roundedTarget;
    const upperExclusive = roundedTarget + hundredThousand / 2;
    const prompt = `어떤 수를 십만의 자리까지 반올림하여 나타내면 ${format(roundedTarget)}이고, 버림하여 나타내면 ${format(truncatedTarget)}, 올림하여 나타내면 ${format(ceilingTarget)}입니다. 이 수의 범위를 구하세요.`;
    const solution = `<ol><li>십만의 자리까지 반올림해 ${format(roundedTarget)}이 되는 수는 ${format(roundedTarget - hundredThousand / 2)} 이상 ${format(roundedTarget + hundredThousand / 2)} 미만입니다.</li><li>십만의 자리까지 버림해 ${format(truncatedTarget)}이 되는 수는 ${format(truncatedTarget)} 이상 ${format(truncatedTarget + hundredThousand)} 미만입니다.</li><li>십만의 자리까지 올림해 ${format(ceilingTarget)}이 되는 수는 ${format(roundedTarget)} 초과 ${format(ceilingTarget)} 이하입니다. ${format(roundedTarget)} 자체는 올림해도 ${format(roundedTarget)}이므로 제외됩니다.</li><li>세 범위의 공통 부분은 ${format(lowerExclusive)} 초과 ${format(upperExclusive)} 미만입니다. ${format(upperExclusive)}에서는 반올림 결과가 ${format(roundedTarget + hundredThousand)}이 되므로 끝점도 제외합니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
      answer: `${format(lowerExclusive)} 초과 ${format(upperExclusive)} 미만`,
      solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`,
      sourceItemId, generator: generatorKey, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: variant, verifiedVariantCount: targets.length, verifiedVariantTarget: targets.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { roundedTarget, truncatedTarget, ceilingTarget, lowerExclusive, upperExclusive, roundingInterval: [roundedTarget - hundredThousand / 2, roundedTarget + hundredThousand / 2], truncationInterval: [truncatedTarget, truncatedTarget + hundredThousand], ceilingInterval: [roundedTarget, ceilingTarget] },
      answerModel: { lowerExclusive, upperExclusive, domain: "positive real numbers; no natural-number restriction in source" }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedRangeMission4Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52RoundedRangeMission4Installed", { value: true });
    return true;
  }

  return Object.freeze({ sourceItemId, generatorKey, targets, getQuestion, install, publisherKeyVerified: false });
});
