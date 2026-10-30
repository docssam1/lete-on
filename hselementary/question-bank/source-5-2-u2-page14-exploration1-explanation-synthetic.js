(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U2_EXPLORATION1_EXPLANATION = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u2-e1-exploration-1-explanation-synthetic";
  const key = "source52U2Exploration1Explanation";
  const pools = Object.freeze([
    Object.freeze({ count: 45, numerator: 3, denominator: 5 }),
    Object.freeze({ count: 56, numerator: 3, denominator: 7 }),
    Object.freeze({ count: 72, numerator: 5, denominator: 8 })
  ]);
  const math = text => `<span class="math-inline-expression">${text}</span>`;
  function build(pool, level) {
    const { count, numerator, denominator } = pool;
    const fraction = `${numerator}/${denominator}`, result = count / denominator * numerator;
    const prompt = `<div data-source-item-id="${id}"><p>${math(fraction)}을 ${count}번 더한 값과 ${count}의 ${math(fraction)}은 어떤 관계인가요? 두 값을 구하고 그 관계를 이유와 함께 설명하세요.</p>${level === -1 ? `<p>도움말: 같은 수를 여러 번 더하는 식을 곱셈으로 나타내 보세요.</p>` : ""}</div>`;
    const solution = `<div data-source-answer="${id}"><p>같은 수 ${math(fraction)}을 ${count}번 더한 값은 ${math(`${fraction}×${count}=${result}`)}입니다.</p><p>${count}의 ${math(fraction)}도 ${math(`${count}×${fraction}=${result}`)}입니다.</p><p>곱하는 두 수의 순서를 바꾸어도 곱은 같으므로 두 값은 같습니다. 두 값이 모두 ${result}라는 점과 곱셈의 관계를 설명하면 됩니다.</p></div>`;
    return { prompt, solution, answer: `두 값은 같고 각각 ${result}`, answerModel: { value: result, explanation: "곱하는 순서를 바꾸어도 값이 같다" }, questionModel: { ...pool, response: "calculation-and-explanation" }, answerVisualRequired: false, answerVisualStatus: "not-required" };
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U2ExplanationPracticeInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const belongs = t => t && (t.id === id || t.sourceItemId === id || t.generatorKey === key);
    const valid = t => t && t.id === id && t.sourceItemId === id && t.generatorKey === key && t.reviewLocked === false && t.sourceVerified === true;
    api.generatorKey = t => belongs(t) ? valid(t) ? key : "" : previousKey(t);
    api.generate = (t, unit, level, seed, variant = 0) => {
      if (!belongs(t)) return previousGenerate(t, unit, level, seed, variant);
      if (!valid(t) || !Number.isSafeInteger(variant) || variant < 0 || ![-1, 0, 1].includes(level ?? 0)) return null;
      const poolIndex = variant % pools.length;
      return Object.freeze({ ...build(pools[poolIndex], level ?? 0), sourceItemId: id, generator: key, variantProvenance: "synthetic-explanation-practice", generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3, verifiedVariantTarget: 3, publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-multiplication-and-explanation" });
    };
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U2ExplanationPracticeInstalled", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, build, install });
});
