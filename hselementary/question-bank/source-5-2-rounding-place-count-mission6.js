(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDING_PLACE_COUNT_MISSION6 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-6-rounding-place-count";
  const generatorKey = "source52RoundingPlaceCountMission6";
  const pools = Object.freeze([2300, 5400, 8600]);
  const format = value => Number(value).toLocaleString("ko-KR");

  function candidateRange(target, unit) {
    if (target % unit !== 0) return null;
    const first = target - unit / 2;
    const last = target + unit / 2 - 1;
    return { first, last, count: last - first + 1 };
  }

  function solve(target) {
    const tens = candidateRange(target, 10);
    const hundreds = candidateRange(target, 100);
    const higherPlaceCanProduceTarget = target % 1000 === 0;
    if (!tens || !hundreds || higherPlaceCanProduceTarget) throw new Error("Mission 6 pool must have tens and hundreds candidates, but no thousand-place result");
    return Object.freeze({
      target,
      tens,
      hundreds,
      minimumCount: Math.min(tens.count, hundreds.count),
      maximumCount: Math.max(tens.count, hundreds.count)
    });
  }

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const target = pools[variant] + difficultyOffset * 100;
    const model = solve(target);
    const answer = `${format(model.minimumCount)}개, ${format(model.maximumCount)}개`;
    const prompt = `어떤 자연수를 반올림해서 나타낸 값이 ${format(target)}입니다. 그 자연수가 될 수 있는 수의 개수는 최소 (ㄱ)개, 최대 (ㄴ)개입니다. ㄱ과 ㄴ에 알맞은 수를 각각 구하세요.`;
    const solution = `<ol><li>일의 자리까지 반올림하면 수가 바뀌지 않으므로, 어림하는 자리인 십의 자리부터 살핍니다.</li><li>십의 자리까지 반올림하면 ${format(model.tens.first)}부터 ${format(model.tens.last)}까지가 ${format(target)}이 되므로 ${format(model.tens.count)}개입니다.</li><li>백의 자리까지 반올림하면 ${format(model.hundreds.first)}부터 ${format(model.hundreds.last)}까지가 ${format(target)}이 되므로 ${format(model.hundreds.count)}개입니다.</li><li>천의 자리 이상으로 반올림한 결과는 천의 자리 이상의 배수입니다. ${format(target)}은 천의 배수가 아니므로 그런 자리에서는 이 결과가 나올 수 없습니다.</li><li>따라서 가능한 개수의 최솟값은 ${format(model.minimumCount)}개, 최댓값은 ${format(model.maximumCount)}개입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}"><p>${prompt}</p></div>`,
      answer,
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
      answerVerification: "independent-enumeration-user-authorized",
      questionModel: model,
      answerModel: { minimumCount: model.minimumCount, maximumCount: model.maximumCount }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundingPlaceCountMission6Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52RoundingPlaceCountMission6Installed", { value: true });
    return true;
  }

  return Object.freeze({ sourceItemId, generatorKey, pools, candidateRange, solve, getQuestion, install, publisherKeyVerified: false });
});
