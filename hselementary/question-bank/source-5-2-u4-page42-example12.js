(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE42_EXAMPLE12 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const id = "5-2-u4-e1-example-2";
  const key = "source52DecimalPointOmissionNaturalNumberPage42Example12";
  const pools = Object.freeze([
    { decimal: "1.25", hundredths: 125, difference: 2970, naturalNumber: 24 },
    { decimal: "2.35", hundredths: 235, difference: 4653, naturalNumber: 20 },
    { decimal: "0.86", hundredths: 86, difference: 2979.9, naturalNumber: 35 }
  ].map(Object.freeze));
  const fmtHundredths = value => {
    const whole = Math.floor(value / 100);
    const cents = String(value % 100).padStart(2, "0");
    return cents === "00" ? String(whole) : cents.endsWith("0") ? `${whole}.${cents[0]}` : `${whole}.${cents}`;
  };
  const comma = value => Number(value).toLocaleString("en-US");
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function calculate(pool) {
    const coefficientHundredths = pool.hundredths * 99;
    const differenceHundredths = Math.round(pool.difference * 100);
    if (coefficientHundredths * pool.naturalNumber !== differenceHundredths) throw new Error("소수점 생략 차이와 자연수의 관계가 일치하지 않습니다.");
    const trueProductHundredths = pool.hundredths * pool.naturalNumber;
    const omittedProduct = pool.hundredths * pool.naturalNumber;
    return Object.freeze({
      coefficient: fmtHundredths(coefficientHundredths),
      difference: pool.difference,
      naturalNumber: pool.naturalNumber,
      trueProduct: fmtHundredths(trueProductHundredths),
      trueProductFixed: `${Math.floor(trueProductHundredths / 100)}.${String(trueProductHundredths % 100).padStart(2, "0")}`,
      omittedProduct,
      differenceHundredths
    });
  }

  function build(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool = pools[poolIndex];
    const result = calculate(pool);
    const hint = difficultyOffset < 0
      ? "도움말: 곱한 수에 소수점을 찍지 않으면 원래 값의 100배가 됩니다. 잘못 쓴 값과 원래 값의 차를 식으로 나타내 보세요."
      : "";
    const explanation = difficultyOffset < 0
      ? [`${pool.decimal}에 자연수 n을 곱한 원래 답은 ${pool.decimal}n입니다. 소수점을 없앤 값은 100배인 ${pool.hundredths}n입니다.`, `두 값의 차는 ${pool.hundredths}n − ${pool.decimal}n = ${result.coefficient}n입니다.`, `${result.coefficient}n = ${comma(pool.difference)}이므로 n = ${comma(pool.difference)} ÷ ${result.coefficient} = ${pool.naturalNumber}입니다.`]
      : difficultyOffset === 0
        ? [`곱한 자연수를 n이라 하면 원래 곱은 ${pool.decimal}n이고, 소수점을 없앤 값은 100배인 ${pool.hundredths}n입니다.`, `차가 ${comma(pool.difference)}이므로 ${pool.hundredths}n − ${pool.decimal}n = ${result.coefficient}n = ${comma(pool.difference)}입니다.`, `n = ${comma(pool.difference)} ÷ ${result.coefficient} = ${pool.naturalNumber}입니다. 검산하면 ${pool.decimal}×${pool.naturalNumber}=${result.trueProductFixed}, 소수점을 없앤 값은 ${comma(result.omittedProduct)}이며 차는 ${comma(pool.difference)}입니다.`]
        : [`소수점을 없앤 값은 원래 곱의 100배이므로 차는 (100−1)×${pool.decimal}×n = 99×${pool.decimal}×n입니다.`, `99×${pool.decimal} = ${result.coefficient}이므로 ${result.coefficient}n = ${comma(pool.difference)}입니다.`, `n = ${comma(pool.difference)} ÷ ${result.coefficient} = ${pool.naturalNumber}. 검산: 원래 곱 ${result.trueProductFixed}, 소수점을 없앤 값 ${comma(result.omittedProduct)}, 차 ${comma(pool.difference)}입니다.`];
    const prompt = `<div class="source52-u4-p42-e12-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${esc(pool.decimal)}에 어떤 자연수를 곱한 후 그 답에 소수점을 안 찍어 정답보다 ${comma(pool.difference)}만큼 크게 되었다. 곱한 자연수는 얼마인가?</p><p>곱은 소수 둘째 자리까지 쓰려고 했습니다.</p>${hint ? `<p class="source52-u4-p42-e12-hint">${esc(hint)}</p>` : ""}</div>`;
    const solution = `<div class="source52-u4-p42-e12-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol>${explanation.map(step => `<li>${esc(step)}</li>`).join("")}</ol><p class="source52-u4-p42-e12-answer"><strong>답: ${pool.naturalNumber}</strong></p></div>`;
    return Object.freeze({
      prompt, answer: String(pool.naturalNumber), solution, sourceItemId: id, generator: key,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${id}:v${poolIndex}`, variantProvenance: "synthetic-source-structure",
      difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["guided-decimal-point-place-value", "difference-equation", "generalized-times-99-equation"][difficultyOffset + 1],
      reasoningSteps: 3, sourceStepCount: 1, difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true, sourcePdfPage: 38, sourcePrintedPage: 42,
      questionModel: { decimal: pool.decimal, difference: pool.difference, unknown: "natural-number", operation: "decimal-point-omission" },
      answerModel: { naturalNumber: pool.naturalNumber, decimal: pool.decimal, trueProduct: result.trueProduct, omittedProduct: result.omittedProduct, difference: pool.difference, coefficient: result.coefficient },
      answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false,
      handwrittenAnswerVerified: false, answerVerification: "exact-hundredths-difference"
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
    if (api.__source52U4Page42Example12Installed) return true;
    const oldKey = api.generatorKey.bind(api);
    const oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? key : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U4Page42Example12Installed", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, build, calculate, generate, belongs, resolves, install });
});
