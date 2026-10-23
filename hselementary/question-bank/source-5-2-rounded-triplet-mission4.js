(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDED_TRIPLET_MISSION4 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u1-e4-mission-4-rounded-seven-million-range";
  const generatorKey = "source52RoundedTripletMission4";
  const unit = 100000;
  const pools = Object.freeze([
    Object.freeze({ roundedTarget: 2300000, truncatedTarget: 2300000, ceilingTarget: 2400000 }),
    Object.freeze({ roundedTarget: 5600000, truncatedTarget: 5500000, ceilingTarget: 5600000 }),
    Object.freeze({ roundedTarget: 8900000, truncatedTarget: 8800000, ceilingTarget: 8900000 })
  ]);
  const offsets = Object.freeze([-unit, 0, unit]);
  const format = value => Number(value).toLocaleString("ko-KR");
  const formatInterval = (lower, lowerInclusive, upper, upperInclusive) =>
    `${lowerInclusive ? "[" : "("}${format(lower)}, ${format(upper)}${upperInclusive ? "]" : ")"}`;

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[variant];
    const shift = offsets[difficultyOffset + 1];
    const roundedTarget = pool.roundedTarget + shift;
    const truncatedTarget = pool.truncatedTarget + shift;
    const ceilingTarget = pool.ceilingTarget + shift;
    const intervals = [
      { lower: roundedTarget - unit / 2, lowerInclusive: true, upper: roundedTarget + unit / 2, upperInclusive: false },
      { lower: truncatedTarget, lowerInclusive: true, upper: truncatedTarget + unit, upperInclusive: false },
      { lower: ceilingTarget - unit, lowerInclusive: false, upper: ceilingTarget, upperInclusive: true }
    ];
    const lower = Math.max(...intervals.map(range => range.lower));
    const upper = Math.min(...intervals.map(range => range.upper));
    const lowerInclusive = intervals.filter(range => range.lower === lower).every(range => range.lowerInclusive);
    const upperInclusive = intervals.filter(range => range.upper === upper).every(range => range.upperInclusive);
    if (lower > upper || (lower === upper && !(lowerInclusive && upperInclusive))) return null;
    const lowerWord = lowerInclusive ? "이상" : "초과";
    const upperWord = upperInclusive ? "이하" : "미만";
    const answer = `${format(lower)} ${lowerWord} ${format(upper)} ${upperWord}`;
    const prompt = `어떤 수를 반올림하여 십만의 자리까지 나타내면 ${format(roundedTarget)}이고, 버림하여 십만의 자리까지 나타내면 ${format(truncatedTarget)}, 올림하여 십만의 자리까지 나타내면 ${format(ceilingTarget)}입니다. 어떤 수의 범위를 구하세요.`;
    const solution = `<ol><li>반올림 조건을 만족하는 범위는 ${formatInterval(intervals[0].lower, intervals[0].lowerInclusive, intervals[0].upper, intervals[0].upperInclusive)}입니다.</li><li>버림 조건을 만족하는 범위는 ${formatInterval(intervals[1].lower, intervals[1].lowerInclusive, intervals[1].upper, intervals[1].upperInclusive)}입니다.</li><li>올림 조건을 만족하는 범위는 ${formatInterval(intervals[2].lower, intervals[2].lowerInclusive, intervals[2].upper, intervals[2].upperInclusive)}입니다.</li><li>세 범위의 공통 부분은 ${formatInterval(lower, lowerInclusive, upper, upperInclusive)}이므로 답은 ${answer}입니다.</li></ol>`;
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}"><p>${prompt}</p></div>`,
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
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { unit, roundedTarget, truncatedTarget, ceilingTarget, intervals, intersection: { lower, lowerInclusive, upper, upperInclusive } },
      answerModel: { lower, lowerInclusive, upper, upperInclusive }
    });
  }

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52RoundedTripletMission4Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const isType = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    const resolves = type => type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true;
    generators.generatorKey = type => !isType(type) ? previousKey(type) : resolves(type) ? generatorKey : "";
    generators.generate = (type, rank, difficulty, seed, variant = 0) => !isType(type) ? previousGenerate(type, rank, difficulty, seed, variant) : resolves(type) ? getQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52RoundedTripletMission4Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, unit, pools, offsets, getQuestion, install, publisherKeyVerified: false });
});
