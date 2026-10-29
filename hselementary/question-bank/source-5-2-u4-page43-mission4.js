(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE43_MISSION4 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u4-e1-mission-4";
  const key = "source52DecimalArithmeticSequenceTermPage43Mission4";
  const pools = Object.freeze([
    { firstHundredths: 1735, differenceHundredths: 264, termNumber: 300 },
    { firstHundredths: 1326, differenceHundredths: 318, termNumber: 300 },
    { firstHundredths: 2641, differenceHundredths: 273, termNumber: 300 }
  ].map(Object.freeze));
  const formatHundredths = value => {
    if (!Number.isSafeInteger(value) || value < 0) throw new TypeError("0 이상의 정확한 소수 둘째 자리까지만 사용할 수 있습니다.");
    return `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;
  };
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function calculate(pool) {
    if (!pool || !Number.isSafeInteger(pool.firstHundredths) || pool.firstHundredths <= 0
      || !Number.isSafeInteger(pool.differenceHundredths) || pool.differenceHundredths <= 0
      || !Number.isSafeInteger(pool.termNumber) || pool.termNumber < 2) {
      throw new TypeError("확인된 첫째 항·증가량·항 번호만 사용할 수 있습니다.");
    }
    const jumps = pool.termNumber - 1;
    const increaseHundredths = pool.differenceHundredths * jumps;
    const answerHundredths = pool.firstHundredths + increaseHundredths;
    if (![jumps, increaseHundredths, answerHundredths].every(Number.isSafeInteger)) throw new Error("정확하게 계산되는 수열만 사용할 수 있습니다.");
    return Object.freeze({
      first: formatHundredths(pool.firstHundredths),
      difference: formatHundredths(pool.differenceHundredths),
      termNumber: pool.termNumber, jumps, increase: formatHundredths(increaseHundredths),
      answerHundredths, answer: formatHundredths(answerHundredths),
      firstTerms: Object.freeze(Array.from({ length: 5 }, (_, index) => formatHundredths(pool.firstHundredths + pool.differenceHundredths * index)))
    });
  }

  function build(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool = pools[poolIndex];
    const result = calculate(pool);
    const displayedTerms = result.firstTerms;
    const hint = difficultyOffset < 0
      ? '<p class="source52-u4-p43-m4-hint">도움말: 이웃한 두 수의 차를 구한 뒤, 첫째 수에서 300번째 수까지 몇 번 더하는지 세어 보세요.</p>'
      : difficultyOffset > 0
        ? '<p class="source52-u4-p43-m4-hint">첫째 항부터 300번째 항까지는 공차를 몇 번 더해야 하는지 식으로 나타내 보세요.</p>'
        : "";
    const prompt = `<div class="source52-u4-p43-m4-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>다음과 같은 규칙으로 수를 나열할 때 ${pool.termNumber}번째 수는 얼마인가요?</p><p class="source52-u4-p43-m4-sequence">${displayedTerms.join(", ")}, …</p>${hint}</div>`;
    const steps = [
      `이웃한 두 항의 차를 구하면 ${result.firstTerms[1]}−${result.first}=${result.difference}입니다.`,
      `첫째 항에서 ${pool.termNumber}번째 항까지는 ${pool.termNumber}−1=${result.jumps}번 커집니다.`,
      `첫째 항부터 늘어난 수는 ${result.difference}×${result.jumps}=${result.increase}입니다.`,
      `${pool.termNumber}번째 항은 ${result.first}+${result.increase}=${result.answer}입니다.`
    ];
    const solution = `<div class="source52-u4-p43-m4-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol>${steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol><p class="source52-u4-p43-m4-answer"><strong>답: ${result.answer}</strong></p></div>`;
    return Object.freeze({
      prompt, answer: result.answer, solution, sourceItemId: id, generator: key,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${id}:v${poolIndex}`, variantProvenance: "synthetic-source-structure",
      difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["guided-common-difference-and-jump-count", "sequence-term-arithmetic", "independent-term-formula-check"][difficultyOffset + 1],
      reasoningSteps: 4, sourceStepCount: 1, difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true, sourcePdfPage: 39, sourcePrintedPage: 43,
      questionModel: { ...pool, answerModel: result }, answerModel: result,
      answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "exact-decimal-arithmetic-sequence-term"
    });
  }
  function belongs(type) { return Boolean(type && (type.id === id || type.sourceItemId === id || type.generatorKey === key)); }
  function resolves(type) { return Boolean(type && type.id === id && type.sourceItemId === id && type.generatorKey === key && type.sourceVerified === true && type.reviewLocked === false); }
  function generate(type, user, difficultyOffset, seed, variant = 0) {
    if (!belongs(type) || !resolves(type)) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");
    return build(variant % pools.length, [-1, 0, 1].includes(difficultyOffset) ? difficultyOffset : 0);
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U4Page43Mission4Installed) return true;
    const oldKey = api.generatorKey.bind(api); const oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? key : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U4Page43Mission4Installed", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, calculate, build, generate, belongs, resolves, install });
});
