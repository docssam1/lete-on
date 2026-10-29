(function (root, factory) {
  "use strict";
  const exported = factory();
  if (typeof module === "object" && module.exports) module.exports = exported;
  root.HSE_SOURCE_52_U2_PAGE16_EXPLORATION22 = exported;
  exported.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u2-e2-exploration-2-synthetic", generatorKey = "source52U2Page16Exploration22";
  const pools = Object.freeze([
    Object.freeze({ first: [[1, 2], [3, 5], [5, 6]], second: [[1, 1, 2], [2, 3], [3, 4]] }),
    Object.freeze({ first: [[3, 4], [2, 5], [5, 9]], second: [[1, 1, 3], [3, 8], [4, 5]] }),
    Object.freeze({ first: [[5, 6], [3, 7], [14, 15]], second: [[1, 1, 4], [8, 15], [9, 10]] })
  ]);
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = text => `<span class="math-inline-expression">${esc(text)}</span>`;
  const steps = lines => `<span class="source52-u2-solution">${lines.map((line, index) => `<span class="source52-u2-step">${index + 1}. ${line}</span>`).join("")}</span>`;
  const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  const fraction = (n, d = 1) => { const g = gcd(Math.abs(n), Math.abs(d)); return { n: n / g, d: d / g }; };
  const times = factors => factors.reduce((result, value) => fraction(result.n * value[0], result.d * value[1]), fraction(1));
  const plus = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
  const renderFactor = factor => factor.length === 3 ? `${factor[0]} ${factor[1]}/${factor[2]}` : `${factor[0]}/${factor[1]}`;
  const renderProduct = factors => factors.map(renderFactor).join("×");
  const mixed = value => { const whole = Math.floor(value.n / value.d), rem = value.n % value.d; return rem ? `${whole ? `${whole} ` : ""}${rem}/${value.d}` : String(whole); };
  function derive(pool) {
    const lists = [pool.first, pool.second];
    for (const factors of lists) for (const f of factors) {
      if (!Array.isArray(f) || !f.every(Number.isSafeInteger) || f.length < 2 || f.length > 3 || f.at(-1) <= 0 || f[0] <= 0 || (f.length === 2 && f[0] >= f[1]) || (f.length === 3 && (f[1] <= 0 || f[1] >= f[2]))) throw new Error("분수와 대분수의 곱을 확인하세요.");
    }
    const first = times(pool.first.map(f => f.length === 3 ? [f[0] * f[2] + f[1], f[2]] : f));
    const second = times(pool.second.map(f => f.length === 3 ? [f[0] * f[2] + f[1], f[2]] : f));
    const sum = plus(first, second);
    return { first, second, sum, firstText: renderProduct(pool.first), secondText: renderProduct(pool.second), answer: mixed(sum) };
  }
  function build(pool, difficultyOffset) {
    const v = derive(pool);
    const prompt = `다음을 계산하세요. ${math(`${v.firstText} + ${v.secondText}`)}${difficultyOffset === -1 ? `<span class="source52-u2-hint">도움말: 각 곱에서 약분할 수 있는 분자와 분모를 먼저 찾아보세요.</span>` : ""}`;
    const lines = [
      `첫째 곱을 약분하여 계산하면 ${math(`${v.firstText} = ${v.first.n}/${v.first.d}`)}입니다.`,
      `둘째 곱을 약분하여 계산하면 ${math(`${v.secondText} = ${v.second.n}/${v.second.d}`)}입니다.`,
      `두 결과를 더하면 ${math(`${v.first.n}/${v.first.d} + ${v.second.n}/${v.second.d} = ${v.answer}`)}입니다.`,
      `따라서 답은 ${math(v.answer)}입니다.`
    ];
    if (difficultyOffset === -1) lines.splice(0, 0, "곱셈식마다 분자와 분모에서 약분할 수 있는 수를 찾아 계산합니다.");
    if (difficultyOffset === 1) lines.splice(2, 0, "두 곱의 분모가 다르면 공통분모로 바꾸어 더하고, 마지막에 기약분수로 나타냅니다.");
    return { prompt, answer: v.answer, solution: `<div data-source-answer="${sourceItemId}">${steps(lines)}</div>`, questionModel: { kind: "sum-of-two-fraction-products", ...pool }, answerModel: { first: v.first, second: v.second, sum: v.sum }};
  }
  function generate(type, variant = 0, difficultyOffset = 0) {
    if (!type || type.id !== sourceItemId || type.sourceItemId !== sourceItemId || type.generatorKey !== generatorKey) return null;
    if (type.reviewLocked !== false || type.sourceVerified !== true) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new Error("고정 변형 번호가 올바르지 않습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new Error("난이도는 -1, 0, 1이어야 합니다.");
    const poolIndex = variant % pools.length, item = build(pools[poolIndex], difficultyOffset);
    return Object.freeze({ ...item, prompt: `<div class="source52-u2-page16-exploration22" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${item.prompt}</div>`,
      sourceItemId, generator: generatorKey, generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, variantProvenance: "synthetic-source-structure", resultContract: "single-value", mathematicalContract: "sum-of-two-exact-fraction-products",
      answerVisualRequired: false, answerVisualStatus: "not-required", difficultyDesign: ["guided-cross-cancellation-and-product-sum", "exact-products-common-denominator-and-addition", "explicit-cancellation-and-reduced-final-sum"][difficultyOffset + 1], reasoningSteps: difficultyOffset === -1 ? 5 : 4,
      sourceStructurePreserved: true, sourceEvidenceRef: "canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.16 Concept Exploration 2 (2); physical PDF p.12; original/clean scan + Apple Vision OCR",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-exact-fraction-products-and-sum" });
  }
  const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey));
  function install(target) {
    const api = target?.HSE_GENERATORS; if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U2Page16Exploration22Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "") : previousKey(type);
    api.generate = (type, unitIndex, difficultyOffset, seed, variant = 0) => belongs(type) ? generate(type, variant, difficultyOffset ?? 0) : previousGenerate(type, unitIndex, difficultyOffset, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U2Page16Exploration22Installed", { value: true }); return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, derive, build, generate, install });
});
