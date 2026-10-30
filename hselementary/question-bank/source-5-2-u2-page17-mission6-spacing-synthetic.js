(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U2_PAGE17_MISSION6_SPACING = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u2-e2-mission-6-spacing-synthetic";
  const key = "source52U2Page17Mission6Spacing";
  const diametersInHalves = Object.freeze([5, 7, 9]);
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  function mixed(n, d) {
    const g = gcd(n, d); n /= g; d /= g;
    const whole = Math.floor(n / d), rest = n % d;
    return rest ? `${whole ? `${whole} ` : ""}${rest}/${d}` : String(whole);
  }
  const math = text => `<span class="math-inline-expression">${text}</span>`;
  function diagram(halfDiameter) {
    const diameter = 112, radius = diameter / 2, step = diameter / halfDiameter;
    const left = 26, top = 36, width = diameter + 9 * step, centerY = top + radius;
    const circles = Array.from({ length: 10 }, (_, i) => {
      const x = left + radius + i * step;
      return `<circle cx="${x.toFixed(3)}" cy="${centerY}" r="${radius}" fill="none" stroke="#222" stroke-width="1.4"/><circle cx="${x.toFixed(3)}" cy="${centerY}" r="2.1" fill="#222"/>`;
    }).join("");
    return `<svg class="source52-u2-overlap-circles" data-circle-count="10" data-diameter-halves="${halfDiameter}" data-spacing-halves="1" viewBox="0 0 ${Math.ceil(width + 52)} 184" role="img" aria-label="같은 원 10개가 일정한 중심 간격으로 겹쳐진 직사각형" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:520px;height:auto;margin:12px auto"><rect x="${left}" y="${top}" width="${width.toFixed(3)}" height="${diameter}" fill="none" stroke="#222" stroke-width="2"/>${circles}</svg>`;
  }
  function build(halfDiameter, level) {
    const diameter = mixed(halfDiameter, 2), width = mixed(halfDiameter + 9, 2), answer = mixed(halfDiameter * (halfDiameter + 9), 4);
    const prompt = `<div data-source-item-id="${id}"><p>같은 크기의 원 10개가 그림처럼 가로로 일정한 간격으로 겹쳐 있습니다. 각 원은 직사각형의 윗변과 아랫변에 닿고, 맨 왼쪽 원과 맨 오른쪽 원은 각각 직사각형의 왼쪽 변과 오른쪽 변에도 닿습니다. 원의 지름이 ${math(`${diameter}cm`)}이고 이웃한 두 원의 중심 사이 거리가 ${math("1/2cm")}일 때, 직사각형의 넓이를 구하세요.</p>${diagram(halfDiameter)}${level === -1 ? `<p>도움말: 이웃한 중심 사이 간격은 몇 군데인가요?</p>` : ""}</div>`;
    const solution = `<div data-source-answer="${id}"><p>원 10개의 중심 사이에는 같은 간격이 9개 있습니다. 직사각형의 세로는 원의 지름인 ${math(`${diameter}cm`)}입니다.</p><p>가로는 원의 지름에 중심 간격 9개를 더한 길이이므로 ${math(`${diameter}+1/2×9=${width}cm`)}입니다.</p><p>따라서 직사각형의 넓이는 ${math(`${diameter}×${width}=${answer}cm²`)}입니다.</p></div>`;
    return { prompt, solution, answer: `${answer}cm²`, answerModel: { diameterHalves: halfDiameter, spacingHalves: 1, circleCount: 10, widthHalves: halfDiameter + 9, areaNumerator: halfDiameter * (halfDiameter + 9), areaDenominator: 4 }, questionModel: { circleCount: 10, diameterHalves: halfDiameter, spacingHalves: 1 }, answerVisualRequired: false, answerVisualStatus: "not-required" };
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U2Mission6SpacingInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const belongs = t => t && (t.id === id || t.sourceItemId === id || t.generatorKey === key);
    const valid = t => t && t.id === id && t.sourceItemId === id && t.generatorKey === key && t.reviewLocked === false && t.sourceVerified === true;
    api.generatorKey = t => belongs(t) ? valid(t) ? key : "" : previousKey(t);
    api.generate = (t, unit, level, seed, variant = 0) => {
      if (!belongs(t)) return previousGenerate(t, unit, level, seed, variant);
      if (!valid(t) || !Number.isSafeInteger(variant) || variant < 0 || ![-1, 0, 1].includes(level ?? 0)) return null;
      const poolIndex = variant % diametersInHalves.length;
      return Object.freeze({ ...build(diametersInHalves[poolIndex], level ?? 0), sourceItemId: id, generator: key, variantProvenance: "synthetic-explicit-center-spacing", generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: 3, verifiedVariantTarget: 3, publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-explicit-spacing-geometry" });
    };
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U2Mission6SpacingInstalled", { value: true });
    return true;
  }
  return Object.freeze({ id, key, diametersInHalves, mixed, diagram, build, install });
});
