(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE42_EXAMPLE11 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const id = "5-2-u4-e1-example-1";
  const key = "source52DecimalNaturalProductsPage42Example11";
  const pools = Object.freeze([
    { base: 80, number: 2021, decimals: ["0.1", "0.25", "0.5"], common: "0.16", coefficients: [3, 4, 1, 2], values: [14, 8, 22, 12] },
    { base: 100, number: 2022, decimals: ["0.1", "0.2", "0.5"], common: "0.25", coefficients: [2, 3, 1, 2], values: [17, 6, 26, 12] },
    { base: 50, number: 2023, decimals: ["0.2", "0.25", "0.4"], common: "0.12", coefficients: [4, 3, 2, 1], values: [14, 8, 13, 7] }
  ].map(pool => Object.freeze({ ...pool, decimals: Object.freeze(pool.decimals), coefficients: Object.freeze(pool.coefficients), values: Object.freeze(pool.values) })));

  const decimalFraction = value => {
    const [whole, fraction = ""] = String(value).split(".");
    return { numerator: BigInt(`${whole}${fraction}`), denominator: 10n ** BigInt(fraction.length) };
  };
  const gcd = (a, b) => b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);
  const productFraction = pool => {
    let numerator = BigInt(pool.base * pool.number), denominator = 1n;
    for (const decimal of pool.decimals) {
      const part = decimalFraction(decimal);
      numerator *= part.numerator;
      denominator *= part.denominator;
    }
    const divisor = gcd(numerator, denominator);
    return { numerator: numerator / divisor, denominator: denominator / divisor };
  };
  const fmtHundredths = value => {
    const whole = Math.floor(value / 100);
    const cents = String(value % 100).padStart(2, "0");
    return cents === "00" ? String(whole) : cents.endsWith("0") ? `${whole}.${cents[0]}` : `${whole}.${cents}`;
  };
  const decimalTimesInteger = (decimal, integer) => {
    const part = decimalFraction(decimal);
    const numerator = part.numerator * BigInt(integer) * 100n;
    if (numerator % part.denominator !== 0n) throw new Error("곱의 소수 둘째 자리 표현을 확인할 수 없습니다.");
    return Number(numerator / part.denominator);
  };
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function calculate(pool) {
    const first = productFraction(pool);
    if (first.denominator !== 1n) throw new Error("첫째 식의 고정 풀 답이 정수가 아닙니다.");
    const bracket = pool.coefficients[0] * pool.values[0]
      - pool.coefficients[1] * pool.values[1]
      + pool.coefficients[2] * pool.values[2]
      - pool.coefficients[3] * pool.values[3];
    const commonHundredths = Number(decimalFraction(pool.common).numerator);
    const secondHundredths = commonHundredths * bracket;
    return { first: Number(first.numerator), bracket, secondHundredths, second: fmtHundredths(secondHundredths), tuple: `(${first.numerator}, ${fmtHundredths(secondHundredths)})` };
  }

  function build(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool = pools[poolIndex];
    const result = calculate(pool);
    const decimalTerms = pool.coefficients.map(coefficient => fmtHundredths(decimalTimesInteger(pool.common, coefficient)));
    const firstProduct = pool.decimals.map(decimalFraction).reduce((acc, part) => ({ numerator: acc.numerator * part.numerator, denominator: acc.denominator * part.denominator }), { numerator: 1n, denominator: 1n });
    const firstProductReduced = (() => { const divisor = gcd(firstProduct.numerator, firstProduct.denominator); return { numerator: firstProduct.numerator / divisor, denominator: firstProduct.denominator / divisor }; })();
    if (BigInt(pool.base) * firstProductReduced.numerator !== firstProductReduced.denominator) throw new Error("첫째 식의 상쇄 조건이 정확히 1인지 확인할 수 없습니다.");

    const expression1 = `${pool.base} × ${pool.number} × ${pool.decimals.join(" × ")}`;
    const expression2 = `${decimalTerms[0]} × ${pool.values[0]} − ${decimalTerms[1]} × ${pool.values[1]} + ${decimalTerms[2]} × ${pool.values[2]} − ${decimalTerms[3]} × ${pool.values[3]}`;
    const hint = difficultyOffset < 0
      ? `<p class="source52-u4-p42-e11-hint">도움말: (1) 소수 세 수의 곱부터 계산하고, (2) 네 소수가 모두 ${esc(pool.common)}의 몇 배인지 찾아 보세요.</p>`
      : "";
    const firstExplanation = difficultyOffset < 0
      ? `${pool.decimals[0]} × ${pool.decimals[1]} × ${pool.decimals[2]} = 1/${pool.base}이고 ${pool.base} × ${pool.number} × 1/${pool.base} = ${result.first}입니다.`
      : difficultyOffset === 0
        ? `소수 세 수의 곱은 1/${pool.base}입니다. ${pool.base} × ${pool.number} × 1/${pool.base} = ${result.first}입니다.`
        : `${pool.decimals.map(decimal => { const part = decimalFraction(decimal); return `${decimal}=${part.numerator}/${part.denominator}`; }).join(", ")}이고, 소수 세 수의 곱은 1/${pool.base}입니다. ${pool.base} × ${pool.number} × 1/${pool.base} = ${result.first}입니다.`;
    const signedTerms = `${pool.coefficients[0]}×${pool.values[0]} − ${pool.coefficients[1]}×${pool.values[1]} + ${pool.coefficients[2]}×${pool.values[2]} − ${pool.coefficients[3]}×${pool.values[3]}`;
    const factorRelations = decimalTerms.map((term, index) => `${term}=${pool.common}×${pool.coefficients[index]}`).join(", ");
    const secondExplanation = difficultyOffset < 0
      ? `각 소수를 ${pool.common}의 배수로 바꾸면 ${factorRelations}입니다. ${pool.common} × (${signedTerms}) = ${pool.common} × ${result.bracket} = ${result.second}입니다.`
      : difficultyOffset === 0
        ? `${expression2} = ${pool.common} × (${signedTerms})입니다. 괄호 안은 ${result.bracket}이므로 ${pool.common} × ${result.bracket} = ${result.second}입니다.`
        : `${factorRelations}이므로 공통인 ${pool.common}을 묶습니다. ${pool.common} × (${signedTerms}) = ${pool.common} × ${result.bracket} = ${result.second}입니다.`;
    const prompt = `<div class="source52-u4-p42-e11-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>다음을 계산하여라.</p><ol><li>${esc(expression1)}</li><li>${esc(expression2)}</li></ol>${hint}</div>`;
    const solution = `<div class="source52-u4-p42-e11-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol><li><span class="source52-u4-p42-e11-expression">${esc(expression1)}</span><p>${esc(firstExplanation)}</p></li><li><span class="source52-u4-p42-e11-expression">${esc(expression2)}</span><p>${esc(secondExplanation)}</p></li></ol><p class="source52-u4-p42-e11-answer"><strong>답: ${esc(result.tuple)}</strong></p></div>`;
    return Object.freeze({
      prompt, answer: result.tuple, solution, sourceItemId: id, generator: key,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${id}:v${poolIndex}`, variantProvenance: "synthetic-source-structure",
      difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["guided-decimal-cancellation-and-common-factor", "factor-decimal-coefficients", "exact-fraction-and-integer-factorization"][difficultyOffset + 1],
      reasoningSteps: 4, sourceStepCount: 1, difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true, sourcePdfPage: 38, sourcePrintedPage: 42,
      questionModel: { expression1, expression2, operation: "decimal-product-and-common-factor" },
      answerModel: { orderedTuple: [result.first, result.second], first: result.first, second: result.second },
      answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false,
      handwrittenAnswerVerified: false, answerVerification: "exact-rational-decimal-arithmetic"
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
    if (api.__source52U4Page42Example11Installed) return true;
    const oldKey = api.generatorKey.bind(api);
    const oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? key : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U4Page42Example11Installed", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, build, calculate, generate, belongs, resolves, install });
});
