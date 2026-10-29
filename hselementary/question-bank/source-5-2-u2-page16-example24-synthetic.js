(function (root, factory) {
  "use strict";
  const exported = factory();
  if (typeof module === "object" && module.exports) module.exports = exported;
  root.HSE_SOURCE_52_U2_PAGE16_EXAMPLE24 = exported;
  exported.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u2-e2-example-4-synthetic", generatorKey = "source52U2Page16Example24", squareCount = 6;
  const pools = Object.freeze([4, 8, 16]);
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = text => `<span class="math-inline-expression">${esc(text)}</span>`;
  const steps = lines => `<span class="source52-u2-solution">${lines.map((line, index) => `<span class="source52-u2-step">${index + 1}. ${line}</span>`).join("")}</span>`;
  const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  const fraction = (n, d) => { if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || n < 0 || d <= 0) throw new Error("정사각형 넓이의 분수를 확인하세요."); const g = gcd(n, d); return { n: n / g, d: d / g }; };
  const add = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
  const multiply = (a, b) => fraction(a.n * b.n, a.d * b.d);
  const divide = (a, divisor) => fraction(a.n, a.d * divisor);
  const fractionText = value => { const whole = Math.floor(value.n / value.d), remainder = value.n % value.d; return remainder ? `${whole ? `${whole} ` : ""}${remainder}/${value.d}` : String(whole); };

  function derive(legCm) {
    if (!Number.isSafeInteger(legCm) || legCm <= 0) throw new Error("직각변의 길이는 양의 자연수여야 합니다.");
    let side = fraction(legCm, 2); const sides = [], areas = [];
    for (let index = 0; index < squareCount; index++) { sides.push(side); areas.push(multiply(side, side)); side = divide(side, 2); }
    const total = areas.reduce(add, fraction(0, 1));
    return { legCm, sides, areas, total, answer: fractionText(total), sideTexts: sides.map(fractionText), areaTexts: areas.map(fractionText) };
  }

  function diagram(v) {
    const left = 42, top = 38, right = 462, bottom = 458, outerSide = right - left;
    const rects = []; let currentTop = bottom, square = outerSide / 2;
    for (let index = 0; index < squareCount; index++) { const x = right - square, y = currentTop - square; rects.push(`<rect class="source52-p16e24-square" x="${x}" y="${y}" width="${square}" height="${square}"/>`); currentTop = y; square /= 2; }
    return `<svg class="source52-p16e24-diagram" viewBox="0 0 540 540" role="img" aria-label="직각변이 각각 ${v.legCm}cm인 직각이등변삼각형 안에 오른쪽 직각 꼭짓점부터 한 변이 절반씩 줄어드는 정사각형 여섯 개를 그린 그림" xmlns="http://www.w3.org/2000/svg">
      <path class="source52-p16e24-triangle" d="M${left} ${bottom} H${right} V${top} Z"/>${rects.join("")}
      <path class="source52-p16e24-dimension" d="M${left} ${bottom + 18} Q${left + outerSide / 2} ${bottom + 50} ${right} ${bottom + 18}"/><text class="source52-p16e24-dimension-label" x="${left + outerSide / 2}" y="${bottom + 58}" text-anchor="middle">${v.legCm} cm</text>
    </svg>`;
  }

  function build(legCm, difficultyOffset) {
    const v = derive(legCm), sideSequence = v.sideTexts.join(", "), areaSequence = v.areaTexts.join(" + "), sum = v.areaTexts.join("+");
    const prompt = `<div class="source52-p16e24-question"><p>그림과 같이 직각을 이루는 한 변이 ${math(`${legCm}cm`)}인 직각이등변삼각형 안에 정사각형을 차례로 그렸습니다. 처음 6개의 정사각형 넓이의 합을 구하세요.</p><figure>${diagram(v)}<figcaption>직각이등변삼각형 안에 차례로 그린 정사각형 6개</figcaption></figure>${difficultyOffset === -1 ? `<span class="source52-u2-hint">도움말: 먼저 정사각형의 한 변 길이를 차례로 구한 다음, 각 길이를 제곱해 넓이를 더해 보세요.</span>` : ""}</div>`;
    const commonDenominator = v.total.d;
    const totalNumerator = v.areas.reduce((sum, area) => sum + area.n * (commonDenominator / area.d), 0);
    const lines = difficultyOffset === -1 ? [
      `첫 번째 정사각형의 한 변은 삼각형 직각변의 절반인 ${math(`${legCm}÷2=${v.sideTexts[0]}cm`)}입니다.`,
      `남은 직각이등변삼각형도 같은 모양이므로 정사각형의 한 변은 차례로 절반이 됩니다: ${math(`${sideSequence}cm`)}.`,
      `각 한 변을 제곱하면 넓이는 ${math(`${areaSequence}cm²`)}입니다.`,
      `모두 더하면 ${math(`${sum}=${v.answer}cm²`)}입니다.`
    ] : difficultyOffset === 0 ? [
      `첫 정사각형의 한 변은 ${math(`${legCm}÷2=${v.sideTexts[0]}cm`)}이고, 다음 정사각형의 한 변은 앞 정사각형 한 변의 절반씩입니다.`,
      `처음 여섯 정사각형의 한 변은 ${math(`${sideSequence}cm`)}입니다.`,
      `따라서 넓이의 합은 ${math(`${areaSequence}=${totalNumerator}/${commonDenominator}cm²`)}입니다.`,
      `기약분수로 나타내면 ${math(`${v.total.n}/${v.total.d}=${v.answer}cm²`)}입니다.`
    ] : [
      `첫 정사각형의 넓이는 ${math(`(${legCm}÷2)²=${v.areaTexts[0]}cm²`)}입니다.`,
      `정사각형 한 변이 절반씩 줄면 넓이는 앞 넓이의 1/4씩 줄어듭니다.`,
      `여섯 넓이를 공통분모 ${commonDenominator}로 바꾸어 더하면 ${math(`${areaSequence}=${totalNumerator}/${commonDenominator}cm²`)}입니다.`,
      `따라서 처음 여섯 정사각형의 넓이의 합은 ${math(`${v.answer}cm²`)}입니다.`
    ];
    const svg = diagram(v);
    return { prompt, answer: `${v.answer}cm²`, solution: `<div data-source-answer="${sourceItemId}">${steps(lines)}</div>`, answerVisual: svg, questionModel: { kind: "right-isosceles-inscribed-six-squares", legCm, squareCount }, answerModel: { legCm, sides: v.sides, areas: v.areas, total: v.total }};
  }

  function generate(type, variant = 0, difficultyOffset = 0) {
    if (!type || type.id !== sourceItemId || type.sourceItemId !== sourceItemId || type.generatorKey !== generatorKey) return null;
    if (type.reviewLocked !== false || type.sourceVerified !== true) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new Error("고정 변형 번호가 올바르지 않습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new Error("난이도는 -1, 0, 1이어야 합니다.");
    const poolIndex = variant % pools.length, item = build(pools[poolIndex], difficultyOffset);
    return Object.freeze({ ...item, prompt: `<div data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${item.prompt}</div>`, sourceItemId, generator: generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, variantProvenance: "synthetic-source-structure", resultContract: "single-value-with-square-centimeters", mathematicalContract: "first-six-similar-inscribed-square-areas",
      answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", difficultyDesign: ["guided-side-sequence-and-area-sum", "exact-six-square-side-and-area-sum", "common-denominator-pattern-sum"][difficultyOffset + 1], reasoningSteps: 4,
      sourceStructurePreserved: true, sourceEvidenceRef: "canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.16 Example 2-4; physical PDF p.12; original/clean scan + Apple Vision OCR; diagram geometry visually reconstructed",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-six-term-square-area-sum" });
  }
  const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey));
  function install(target) {
    const api = target?.HSE_GENERATORS; if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U2Page16Example24Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "") : previousKey(type);
    api.generate = (type, unitIndex, difficultyOffset, seed, variant = 0) => belongs(type) ? generate(type, variant, difficultyOffset ?? 0) : previousGenerate(type, unitIndex, difficultyOffset, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U2Page16Example24Installed", { value: true }); return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, squareCount, derive, diagram, build, generate, install });
});
