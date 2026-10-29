(function (root, factory) {
  "use strict";
  const exported = factory();
  if (typeof module === "object" && module.exports) module.exports = exported;
  root.HSE_SOURCE_52_U2_PAGE17_MISSION2 = exported;
  exported.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u2-e2-mission-2-synthetic", key = "source52U2Page17Mission2";
  const pools = Object.freeze([
    { homeSchool: [7, 2], schoolCity: [7, 3], cityFire: [7, 4] },
    { homeSchool: [25, 4], schoolCity: [8, 5], cityFire: [5, 2] },
    { homeSchool: [16, 7], schoolCity: [7, 2], cityFire: [4, 3] }
  ]);
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const frac = (n, d) => { if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d <= 0) throw new Error("분수 계산을 확인하세요."); const g = gcd(n, d); return { n: n / g, d: d / g }; };
  const mul = (a, b) => frac(a.n * b.n, a.d * b.d);
  const text = x => { const w = Math.floor(x.n / x.d), r = x.n % x.d; return r ? `${w ? `${w} ` : ""}${r}/${x.d}` : String(w); };
  const mixed = ([n, d]) => `${Math.floor(n / d)} ${n % d}/${d}`;
  const escape = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const math = s => `<span class="math-inline-expression">${escape(s)}</span>`;
  function derive(index) {
    const p = pools[index], factors = [frac(...p.homeSchool), frac(...p.schoolCity), frac(...p.cityFire)];
    const distances = [factors[0], mul(factors[0], factors[1]), mul(mul(factors[0], factors[1]), factors[2])];
    return { p, factors, distances, answer: text(distances[2]) };
  }
  function build(index, difficulty) {
    const value = derive(index), [home, city, fire] = value.distances;
    const prompt = `<div class="source52-p17m2-question"><p>민서의 집에서 도서관까지의 거리는 ${math(`${mixed(value.p.homeSchool)} km`)}입니다. 집에서 미술관까지의 거리는 집에서 도서관까지 거리의 ${math(mixed(value.p.schoolCity))}배이고, 집에서 수영장까지 거리는 집에서 미술관까지 거리의 ${math(mixed(value.p.cityFire))}배입니다. 민서의 집에서 수영장까지의 거리를 구하여라.</p>${difficulty < 0 ? `<span class="source52-u2-hint">도움말: 먼저 집에서 미술관까지의 거리를 구한 뒤, 그 결과에 다음 배율을 곱하세요.</span>` : ""}</div>`;
    const lines = difficulty < 0 ? [
      `대분수를 가분수로 바꾸어 집에서 도서관까지 거리를 나타냅니다: ${math(`${value.p.homeSchool[0]}/${value.p.homeSchool[1]} km`)}.`,
      `먼저 미술관까지는 ${math(`${text(home)}×${text(value.factors[1])}=${text(city)} km`)}입니다. 이를 한 번 더 곱하면 ${math(`${text(city)}×${text(value.factors[2])}=${text(fire)} km`)}입니다.`
    ] : difficulty === 0 ? [
      `세 거리를 연속된 배율로 나타냅니다: ${math(`${text(home)}×${text(value.factors[1])}×${text(value.factors[2])} km`)}.`,
      `차례로 계산하면 집에서 미술관까지 ${math(`${text(city)} km`)}, 집에서 수영장까지 ${math(`${text(fire)} km`)}입니다.`
    ] : [
      `대분수를 가분수로 고치고 연속된 배율을 곱합니다: ${math(`${value.p.homeSchool[0]}/${value.p.homeSchool[1]}×${value.p.schoolCity[0]}/${value.p.schoolCity[1]}×${value.p.cityFire[0]}/${value.p.cityFire[1]}`)}.`,
      `약분해 계산한 거리는 ${math(`${text(fire)} km`)}입니다.`
    ];
    return { prompt, answer: `${value.answer}km`, solution: `<span data-source-answer="${id}" class="source52-u2-solution">${lines.map((s, i) => `<span class="source52-u2-step">${i + 1}. ${s}</span>`).join("")}</span>`, answerVisual: "", answerModel: { numerator: fire.n, denominator: fire.d, unit: "km", answer: `${value.answer}km` }, questionModel: { kind: "chained-distance-multipliers", sourceSubitem: id }, sourceValuesExcluded: true };
  }
  function generate(type, unitIndex, difficulty, seed, variant = 0) {
    if (type?.sourceItemId !== id || type?.id !== id || type?.sourceVerified !== true || type?.reviewLocked !== false || type?.generatorKey !== key) return null;
    if (!Number.isSafeInteger(variant) || variant < 0 || ![-1, 0, 1].includes(difficulty)) throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");
    const poolIndex = variant % pools.length, question = build(poolIndex, difficulty);
    return Object.freeze({ ...question, prompt: `<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficulty}" data-level="${difficulty + 1}">${question.prompt}</div>`, sourceItemId: id, generator: key, generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length, verifiedVariantId: `${id}:v${poolIndex}`, variantProvenance: "synthetic-source-structure", answerVisualRequired: false, answerVisualStatus: "not-required", difficultyDesign: ["guided-chained-distance-calculation", "standard-exact-mixed-number-product", "efficient-exact-fraction-product"][difficulty + 1], reasoningSteps: 2, sourceStructurePreserved: true, sourceEvidenceRef: "canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.17 Mission 2; PDF p.13; Apple Vision OCR + direct visual source cross-check", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-exact-chained-fraction-product" });
  }
  function install(target) {
    const api = target?.HSE_GENERATORS; if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U2Page17Mission2Installed) return true;
    const prevKey = api.generatorKey.bind(api), prevGenerate = api.generate.bind(api);
    api.generatorKey = type => type?.sourceItemId === id || type?.id === id || type?.generatorKey === key ? (type.id === id && type.sourceItemId === id && type.generatorKey === key && type.sourceVerified === true && type.reviewLocked === false ? key : "") : prevKey(type);
    api.generate = (type, u, d, s, v = 0) => type?.sourceItemId === id || type?.id === id || type?.generatorKey === key ? generate(type, u, d, s, v) : prevGenerate(type, u, d, s, v);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U2Page17Mission2Installed", { value: true }); return true;
  }
  return Object.freeze({ id, key, pools, derive, build, generate, install });
});
