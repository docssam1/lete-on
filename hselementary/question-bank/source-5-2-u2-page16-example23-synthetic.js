(function (root, factory) {
  "use strict";
  const exported = factory();
  if (typeof module === "object" && module.exports) module.exports = exported;
  root.HSE_SOURCE_52_U2_PAGE16_EXAMPLE23 = exported;
  exported.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u2-e2-example-3-synthetic", generatorKey = "source52U2Page16Example23";
  const pools = Object.freeze([
    Object.freeze({ height: [5, 1, 2], rebound: [1, 2] }),
    Object.freeze({ height: [4, 4, 5], rebound: [3, 5] }),
    Object.freeze({ height: [6, 1, 3], rebound: [1, 4] })
  ]);
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = text => `<span class="math-inline-expression">${esc(text)}</span>`;
  const steps = lines => `<span class="source52-u2-solution">${lines.map((line, index) => `<span class="source52-u2-step">${index + 1}. ${line}</span>`).join("")}</span>`;
  const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  const fraction = (n, d) => { if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d <= 0 || n < 0) throw new Error("이동 거리의 분수를 확인하세요."); const g = gcd(n, d); return { n: n / g, d: d / g }; };
  const add = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
  const multiply = (a, b) => fraction(a.n * b.n, a.d * b.d);
  const mixedValue = ([whole, numerator, denominator]) => fraction(whole * denominator + numerator, denominator);
  const mixedText = ([whole, numerator, denominator]) => `${whole}${numerator ? ` ${numerator}/${denominator}` : ""}`;
  const fractionText = value => { const whole = Math.floor(value.n / value.d), remainder = value.n % value.d; return remainder ? `${whole ? `${whole} ` : ""}${remainder}/${value.d}` : String(whole); };

  function derive(pool) {
    const { height, rebound } = pool;
    if (![...height, ...rebound].every(Number.isSafeInteger) || height.length !== 3 || rebound.length !== 2 || height[0] <= 0 || height[1] < 0 || height[1] >= height[2] || height[2] <= 0 || rebound[0] <= 0 || rebound[0] >= rebound[1] || rebound[1] <= 0) throw new Error("시작 높이와 반동 비율을 확인하세요.");
    const initial = mixedValue(height), ratio = fraction(rebound[0], rebound[1]), firstRebound = multiply(initial, ratio), secondRebound = multiply(firstRebound, ratio);
    const total = add(add(add(initial, firstRebound), firstRebound), secondRebound);
    const formulaNumerator = (ratio.d + ratio.n) * (ratio.d + ratio.n), formulaDenominator = ratio.d * ratio.d;
    const formulaTotal = multiply(initial, fraction(formulaNumerator, formulaDenominator));
    if (total.n !== formulaTotal.n || total.d !== formulaTotal.d) throw new Error("이동 거리 항의 합과 계산식 결과가 일치하지 않습니다.");
    return { height, rebound, initial, ratio, firstRebound, secondRebound, total, answer: fractionText(total), heightText: mixedText(height), ratioText: `${rebound[0]}/${rebound[1]}` };
  }

  function build(pool, difficultyOffset) {
    const v = derive(pool), twiceFirst = multiply(v.firstRebound, fraction(2, 1));
    const prompt = `<div class="source52-u2-page16-example23" data-source-item="${sourceItemId}"><p>${math(v.heightText)}m의 높이에서 공을 떨어뜨립니다. 이 공은 떨어진 높이의 ${math(v.ratioText)}만큼 튀어 오릅니다. 두 번째로 튀어 올랐을 때까지 공이 움직인 거리는 모두 몇 m인가요?</p>${difficultyOffset === -1 ? `<span class="source52-u2-hint">도움말: 첫 낙하, 첫 상승과 낙하, 두 번째 상승까지의 거리를 순서대로 적어 보세요.</span>` : ""}</div>`;
    const lines = [
      `처음 떨어진 거리는 ${math(`${v.heightText}m`)}입니다.`,
      `처음 튀어 오른 높이는 ${math(`${v.heightText}×${v.ratioText}=${fractionText(v.firstRebound)}m`)}이고, 다시 떨어진 거리도 같습니다.`,
      `두 번째 튀어 오른 높이는 ${math(`${fractionText(v.firstRebound)}×${v.ratioText}=${fractionText(v.secondRebound)}m`)}입니다.`,
      `모두 더하면 ${math(`${v.heightText}+${fractionText(v.firstRebound)}+${fractionText(v.firstRebound)}+${fractionText(v.secondRebound)}=${v.answer}m`)}입니다.`
    ];
    if (difficultyOffset === 1) lines.splice(3, 0, `첫 상승과 그 뒤 낙하를 합하면 ${math(`${fractionText(v.firstRebound)}×2=${fractionText(twiceFirst)}m`)}입니다.`);
    if (difficultyOffset === -1) lines.unshift(`두 번째 상승까지의 거리는 처음 낙하, 첫 상승, 첫 반동 뒤 낙하, 두 번째 상승을 더합니다.`);
    return { prompt, answer: `${v.answer}m`, solution: `<div data-source-answer="${sourceItemId}">${steps(lines)}</div>`, questionModel: { kind: "two-rebounds-total-distance", ...pool }, answerModel: { initial: v.initial, reboundRatio: [v.rebound[0], v.rebound[1]], firstRebound: v.firstRebound, secondRebound: v.secondRebound, total: v.total }};
  }

  function generate(type, variant = 0, difficultyOffset = 0) {
    if (!type || type.id !== sourceItemId || type.sourceItemId !== sourceItemId || type.generatorKey !== generatorKey) return null;
    if (type.reviewLocked !== false || type.sourceVerified !== true) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new Error("고정 변형 번호가 올바르지 않습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new Error("난이도는 -1, 0, 1이어야 합니다.");
    const poolIndex = variant % pools.length, item = build(pools[poolIndex], difficultyOffset);
    return Object.freeze({ ...item, prompt: `<div data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${item.prompt}</div>`, sourceItemId, generator: generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, variantProvenance: "synthetic-source-structure", resultContract: "single-value-with-meters", mathematicalContract: "total-distance-through-second-rebound",
      answerVisualRequired: false, answerVisualStatus: "not-required", difficultyDesign: ["guided-four-travel-segments", "exact-rebound-height-and-segment-sum", "explicit-paired-first-rebound-segments"][difficultyOffset + 1], reasoningSteps: difficultyOffset === -1 ? 5 : 4,
      sourceStructurePreserved: true, sourceEvidenceRef: "canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.16 Example 2-3; physical PDF p.12; original/clean scan + Apple Vision OCR; fractions visually cross-checked",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-two-rebound-distance-sum" });
  }
  const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey));
  function install(target) {
    const api = target?.HSE_GENERATORS; if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U2Page16Example23Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "") : previousKey(type);
    api.generate = (type, unitIndex, difficultyOffset, seed, variant = 0) => belongs(type) ? generate(type, variant, difficultyOffset ?? 0) : previousGenerate(type, unitIndex, difficultyOffset, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U2Page16Example23Installed", { value: true }); return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, derive, build, generate, install });
});
