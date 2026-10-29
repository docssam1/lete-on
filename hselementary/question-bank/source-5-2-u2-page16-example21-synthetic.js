(function (root, factory) {
  "use strict";
  const exported = factory();
  if (typeof module === "object" && module.exports) module.exports = exported;
  root.HSE_SOURCE_52_U2_PAGE16_EXAMPLE21 = exported;
  exported.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u2-e2-example-1-synthetic", generatorKey = "source52U2Page16Example21";
  const pools = Object.freeze([9, 15, 21]);
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = text => `<span class="math-inline-expression">${esc(text)}</span>`;
  const steps = lines => `<span class="source52-u2-solution">${lines.map((line, index) => `<span class="source52-u2-step">${index + 1}. ${line}</span>`).join("")}</span>`;
  const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  function derive(end) {
    if (!Number.isSafeInteger(end) || end < 6) throw new Error("연속 곱의 마지막 분모를 확인하세요.");
    let n = 1, d = 1;
    for (let k = 3; k <= end; k++) { n *= k + 2; d *= k; const g = gcd(n, d); n /= g; d /= g; }
    const numerator = (end + 1) * (end + 2), denominator = 3 * 4, divisor = gcd(numerator, denominator);
    if (n !== numerator / divisor || d !== denominator / divisor) throw new Error("연속 곱의 약분 결과가 일치하지 않습니다.");
    const answer = d === 1 ? String(n) : `${n}/${d}`;
    const terms = Array.from({ length: 4 }, (_, index) => `(1+2/${3 + index})`).join("×");
    return { end, numerator, denominator, divisor, reducedNumerator: n, reducedDenominator: d, answer, expression: `${terms}×…×(1+2/${end})` };
  }
  function build(end, difficultyOffset) {
    const v = derive(end), product = `5/3×6/4×7/5×8/6×…×${end + 2}/${end}`;
    const prompt = `다음을 계산하세요. ${math(v.expression)}${difficultyOffset === -1 ? `<span class="source52-u2-hint">도움말: 각 괄호를 분수로 바꾸면 분자와 분모에서 연속된 수가 약분됩니다.</span>` : ""}`;
    const lines = [
      `각 항을 ${math(`1+2/n=(n+2)/n`)}으로 바꾸면 연속된 분수의 곱이 됩니다.`,
      `따라서 ${math(product)}입니다.`,
      `분자와 분모에서 ${math(`5부터 ${end}까지`)}의 수가 약분되어 ${math(`(${end + 1}×${end + 2})/(3×4)`)}만 남습니다.`,
      `계산하면 ${math(`${v.numerator}/${v.denominator}=${v.answer}`)}이므로 답은 ${math(v.answer)}입니다.`
    ];
    if (difficultyOffset === -1) lines.splice(1, 0, "분자에 있는 수와 분모에 있는 같은 수를 차례로 약분합니다.");
    if (difficultyOffset === 1) lines.splice(2, 0, `약분되지 않고 남는 분자는 ${math(`${end + 1}, ${end + 2}`)}, 분모는 ${math(`3, 4`)}입니다.`);
    return { prompt, answer: v.answer, solution: `<div data-source-answer="${sourceItemId}">${steps(lines)}</div>`, questionModel: { kind: "telescoping-consecutive-fraction-product", firstDenominator: 3, lastDenominator: end, numeratorOffset: 2 }, answerModel: { numerator: v.numerator, denominator: v.denominator, reducedNumerator: v.reducedNumerator, reducedDenominator: v.reducedDenominator }};
  }
  function generate(type, variant = 0, difficultyOffset = 0) {
    if (!type || type.id !== sourceItemId || type.sourceItemId !== sourceItemId || type.generatorKey !== generatorKey) return null;
    if (type.reviewLocked !== false || type.sourceVerified !== true) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new Error("고정 변형 번호가 올바르지 않습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new Error("난이도는 -1, 0, 1이어야 합니다.");
    const poolIndex = variant % pools.length, item = build(pools[poolIndex], difficultyOffset);
    return Object.freeze({ ...item, prompt: `<div class="source52-u2-page16-example21" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${item.prompt}</div>`,
      sourceItemId, generator: generatorKey, generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, variantProvenance: "synthetic-source-structure", resultContract: "single-value", mathematicalContract: "consecutive-numerator-denominator-cancellation",
      answerVisualRequired: false, answerVisualStatus: "not-required", difficultyDesign: ["guided-factor-conversion-and-cancellation", "telescoping-range-and-exact-product", "explicit-cancelled-middle-interval-and-final-reduction"][difficultyOffset + 1], reasoningSteps: difficultyOffset === -1 ? 5 : 4,
      sourceStructurePreserved: true, sourceEvidenceRef: "canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.16 Example 2-1; physical PDF p.12; original/clean scan + Apple Vision OCR",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-telescoping-consecutive-product" });
  }
  const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey));
  function install(target) {
    const api = target?.HSE_GENERATORS; if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U2Page16Example21Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "") : previousKey(type);
    api.generate = (type, unitIndex, difficultyOffset, seed, variant = 0) => belongs(type) ? generate(type, variant, difficultyOffset ?? 0) : previousGenerate(type, unitIndex, difficultyOffset, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U2Page16Example21Installed", { value: true }); return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, derive, build, generate, install });
});
