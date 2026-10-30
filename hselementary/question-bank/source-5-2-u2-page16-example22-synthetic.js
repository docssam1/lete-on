(function (root, factory) {
  "use strict";
  const exported = factory();
  if (typeof module === "object" && module.exports) module.exports = exported;
  root.HSE_SOURCE_52_U2_PAGE16_EXAMPLE22 = exported;
  exported.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u2-e2-example-2-synthetic", generatorKey = "source52U2Page16Example22";
  const pools = Object.freeze([
    Object.freeze({ width: [3, 3, 4], height: [2, 2, 5], aParts: 2, bParts: 3 }),
    Object.freeze({ width: [4, 1, 2], height: [3, 1, 3], aParts: 3, bParts: 4 }),
    Object.freeze({ width: [5, 1, 4], height: [2, 2, 7], aParts: 5, bParts: 6 })
  ]);
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = text => `<span class="math-inline-expression">${esc(text)}</span>`;
  const steps = lines => `<span class="source52-u2-solution">${lines.map((line, index) => `<span class="source52-u2-step">${index + 1}. ${line}</span>`).join("")}</span>`;
  const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  const fraction = (n, d) => { if (!d) throw new Error("넓이 계산의 분모가 0입니다."); const g = gcd(Math.abs(n), Math.abs(d)); return { n: n / g, d: d / g }; };
  const mixedValue = ([whole, numerator, denominator]) => fraction(whole * denominator + numerator, denominator);
  const mixedText = ([whole, numerator, denominator]) => `${whole}${numerator ? ` ${numerator}/${denominator}` : ""}`;
  const mixed = value => { const whole = Math.floor(value.n / value.d), rem = value.n % value.d; return rem ? `${whole ? `${whole} ` : ""}${rem}/${value.d}` : String(whole); };
  const formatFraction = value => value.d === 1 ? String(value.n) : `${value.n}/${value.d}`;
  function svgMixedLabel(value, unit, x, y, className, rotation = 0) {
    const match = /^(?:(\d+)\s+)?(\d+)\/(\d+)$/.exec(value);
    const transform = `translate(${x} ${y})${rotation ? ` rotate(${rotation})` : ""}`;
    if (!match) return `<text class="${className}" x="${x}" y="${y}" text-anchor="middle">${esc(value)} ${esc(unit)}</text>`;
    const whole = match[1], numerator = match[2], denominator = match[3];
    const fractionWidth = Math.max(13, 8 * Math.max(numerator.length, denominator.length));
    const wholeWidth = whole ? 10 * whole.length + 4 : 0;
    const unitWidth = unit.length * 9 + 4, left = -(wholeWidth + fractionWidth + unitWidth) / 2;
    const middle = left + wholeWidth + fractionWidth / 2;
    return `<g class="${className} source52-p16e22-stacked" transform="${transform}" aria-hidden="true">${whole ? `<text x="${left}" y="5">${esc(whole)}</text>` : ""}<text x="${middle}" y="-6" text-anchor="middle">${esc(numerator)}</text><path d="M${left + wholeWidth} -2 h${fractionWidth}"/><text x="${middle}" y="12" text-anchor="middle">${esc(denominator)}</text><text x="${left + wholeWidth + fractionWidth + 4}" y="5">${esc(unit)}</text></g>`;
  }

  function derive(pool) {
    const { width, height, aParts, bParts } = pool;
    if (![...width, ...height, aParts, bParts].every(Number.isSafeInteger) || width.length !== 3 || height.length !== 3 || width[0] <= 0 || height[0] <= 0 || width[2] <= 0 || height[2] <= 0 || width[1] < 0 || width[1] >= width[2] || height[1] < 0 || height[1] >= height[2] || aParts <= 0 || bParts <= 0) throw new Error("직사각형 치수와 넓이 비를 확인하세요.");
    const w = mixedValue(width), h = mixedValue(height), totalArea = fraction(w.n * h.n, w.d * h.d);
    const aArea = fraction(totalArea.n * aParts, totalArea.d * (aParts + bParts));
    const aspect = h.n / h.d / (w.n / w.d), ratio = aParts / (aParts + bParts), delta = 0.045;
    return { ...pool, w, h, totalArea, aArea, answer: mixed(aArea), widthText: mixedText(width), heightText: mixedText(height), ratio, aspect, partitionBottom: ratio - delta, partitionTop: ratio + delta };
  }
  function diagram(v, { solution = false } = {}) {
    const x = 46, y = 82, width = 420, height = width * v.aspect;
    const bottomX = x + width * v.partitionBottom, topX = x + width * v.partitionTop;
    const answerLabel = solution ? svgMixedLabel(v.answer, "cm²", x + width * v.ratio / 2, y + height * 0.75, "source52-p16e22-answer") : "";
    const aria = `가로 ${v.widthText}cm, 세로 ${v.heightText}cm인 직사각형을 ㉮와 ㉯로 나눈 그림${solution ? `, ㉮의 넓이는 ${v.answer}제곱센티미터` : ""}`;
    return `<svg class="source52-p16e22-diagram" viewBox="0 0 580 430" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg">
      <path class="source52-p16e22-dimension" d="M${x} 62 Q${x + width / 2} 28 ${x + width} 62"/>${svgMixedLabel(v.widthText, "cm", x + width / 2, 20, "source52-p16e22-dimension-label")}
      <path class="source52-p16e22-dimension" d="M${x + width + 14} ${y} Q${x + width + 38} ${y + height / 2} ${x + width + 14} ${y + height}"/>${svgMixedLabel(v.heightText, "cm", x + width + 68, y + height / 2, "source52-p16e22-dimension-label")}
      <rect class="source52-p16e22-rect" x="${x}" y="${y}" width="${width}" height="${height}" rx="0"/>
      <path class="source52-p16e22-divider" d="M${topX} ${y} L${bottomX} ${y + height}"/>
      <circle class="source52-p16e22-label-circle" cx="${x + width * v.ratio / 2}" cy="${y + height / 2}" r="17"/><text class="source52-p16e22-label" x="${x + width * v.ratio / 2}" y="${y + height / 2 + 6}" text-anchor="middle">㉮</text>
      <circle class="source52-p16e22-label-circle" cx="${x + width * (1 + v.ratio) / 2}" cy="${y + height / 2}" r="17"/><text class="source52-p16e22-label" x="${x + width * (1 + v.ratio) / 2}" y="${y + height / 2 + 6}" text-anchor="middle">㉯</text>${answerLabel}</svg>`;
  }
  function build(pool, difficultyOffset) {
    const v = derive(pool), totalAreaText = formatFraction(v.totalArea), productNumerator = v.totalArea.n * v.aParts, productDenominator = v.totalArea.d * (v.aParts + v.bParts), rawArea = formatFraction({ n: productNumerator, d: productDenominator });
    const prompt = `<div class="source52-p16e22-question"><p>그림과 같이 직사각형을 ㉮, ㉯ 두 부분으로 나누었습니다. ㉮의 넓이가 ㉯의 넓이의 ${math(`${v.aParts}/${v.bParts}`)}일 때, ㉮의 넓이를 구하세요.</p><figure>${diagram(v)}<figcaption>두 부분의 넓이 비와 직사각형의 가로·세로</figcaption></figure>${difficultyOffset === -1 ? `<span class="source52-u2-hint">도움말: 먼저 직사각형 전체 넓이를 구하고, ㉮가 전체에서 차지하는 비율을 생각하세요.</span>` : ""}</div>`;
    const lines = [
      `직사각형의 전체 넓이는 ${math(`${v.widthText}×${v.heightText}=${totalAreaText} cm²`)}입니다.`,
      `㉮:㉯=${math(`${v.aParts}:${v.bParts}`)}이므로 전체는 ${v.aParts + v.bParts}등분이고, ㉮는 전체의 ${math(`${v.aParts}/${v.aParts + v.bParts}`)}입니다.`,
      `따라서 ㉮의 넓이는 ${math(`${totalAreaText}×${v.aParts}/${v.aParts + v.bParts}=${rawArea}=${v.answer} cm²`)}입니다.`,
      `그러므로 ㉮의 넓이는 ${math(`${v.answer} cm²`)}입니다.`
    ];
    if (difficultyOffset === 1) lines.splice(1, 0, `같은 크기의 조각으로 생각하면 ㉮가 ${v.aParts}조각, ㉯가 ${v.bParts}조각입니다.`);
    const svg = diagram(v, { solution: true });
    return { prompt, answer: `${v.answer} cm²`, solution: `<div data-source-answer="${sourceItemId}">${steps(lines)}</div>`, answerVisual: svg, questionModel: { kind: "rectangle-part-area-from-ratio", ...pool }, answerModel: { width: v.w, height: v.h, totalArea: v.totalArea, aArea: v.aArea, ratio: [v.aParts, v.bParts], wholeParts: v.aParts + v.bParts }};
  }
  function generate(type, variant = 0, difficultyOffset = 0) {
    if (!type || type.id !== sourceItemId || type.sourceItemId !== sourceItemId || type.generatorKey !== generatorKey) return null;
    if (type.reviewLocked !== false || type.sourceVerified !== true) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new Error("고정 변형 번호가 올바르지 않습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new Error("난이도는 -1, 0, 1이어야 합니다.");
    const poolIndex = variant % pools.length, item = build(pools[poolIndex], difficultyOffset);
    return Object.freeze({ ...item, prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${item.prompt}</div>`,
      sourceItemId, generator: generatorKey, generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, variantProvenance: "synthetic-source-structure", resultContract: "single-value-with-square-centimeter-unit", mathematicalContract: "rectangle-area-times-ratio-part-of-whole",
      answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", difficultyDesign: ["guided-whole-area-and-part-ratio", "whole-area-times-a-over-a-plus-b", "equivalent-parts-model-and-exact-area"][difficultyOffset + 1], reasoningSteps: difficultyOffset === -1 ? 5 : 4,
      sourceStructurePreserved: true, sourceEvidenceRef: "canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.16 Example 2-2; physical PDF p.12; original/clean scan + Apple Vision OCR + visual diagram reconstruction",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-rectangle-area-ratio-and-partition-model" });
  }
  const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey));
  function install(target) {
    const api = target?.HSE_GENERATORS; if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U2Page16Example22Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "") : previousKey(type);
    api.generate = (type, unitIndex, difficultyOffset, seed, variant = 0) => belongs(type) ? generate(type, variant, difficultyOffset ?? 0) : previousGenerate(type, unitIndex, difficultyOffset, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U2Page16Example22Installed", { value: true }); return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, derive, diagram, build, generate, install });
});
