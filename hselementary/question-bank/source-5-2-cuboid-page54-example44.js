(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE54_EXAMPLE44 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u5-e4-example-4-4";
  const generatorKey = "source52CuboidPage54Example44";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 50, sourcePrintedPage: 54 });
  const side = 58, depth = 28, height = 46, x0 = 16, y0 = 82;
  function cube(col, row, prefix) {
    const x = x0 + col * side + row * depth;
    const y = y0 - row * depth;
    return `<g class="die" data-die="${prefix}-${col}-${row}"><polygon class="top" points="${x},${y} ${x + side},${y} ${x + side + depth},${y - depth} ${x + depth},${y - depth}"/><polygon class="front" points="${x},${y} ${x + side},${y} ${x + side},${y + height} ${x},${y + height}"/><polygon class="right" points="${x + side},${y} ${x + side + depth},${y - depth} ${x + side + depth},${y - depth + height} ${x + side},${y + height}"/></g>`;
  }
  function shape(type) {
    const cubes = type === "line" ? [[0, 0], [1, 0], [2, 0], [3, 0]] : [[0, 1], [1, 1], [2, 1], [0, 0]];
    const drawn = [...cubes].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([col, row]) => cube(col, row, type)).join("");
    const label = type === "line" ? "가" : "나";
    return `<figure class="source52-p54e44-shape"><svg class="source52-p54e44-diagram" viewBox="0 0 330 170" role="img" aria-label="${label} 모양: 서로 맞닿게 붙인 주사위 네 개의 ${type === "line" ? "일렬 배열" : "ㄴ자 배열"}" xmlns="http://www.w3.org/2000/svg"><g stroke="#39342d" stroke-width="1.5" stroke-linejoin="round">${drawn}</g></svg><figcaption>(${label})</figcaption></figure>`;
  }
  function diagrams() { return `<div class="source52-p54e44-diagrams">${shape("line")}${shape("bent")}</div>`; }
  function makeQuestion() {
    const prompt = `<div class="source52-p54e44-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>마주 보는 두 면의 눈의 합이 7인 주사위 4개를 그림과 같이 두 가지 모양으로 붙였습니다. 맞닿는 두 면의 눈 수가 서로 같을 때, 다음 물음에 답하세요.</p>${diagrams()}<ol><li>겉면 눈의 합이 가장 클 때, (가)와 (나)의 겉면 눈의 합은 각각 얼마인가요?</li><li>겉면 눈의 합이 가장 작을 때, (가)와 (나)의 겉면 눈의 합은 각각 얼마인가요?</li></ol></div>`;
    const solution = `<div class="source52-p54e44-solution" data-source-answer="${sourceItemId}"><p>주사위 네 개에 적힌 눈의 합은 4×(1+2+3+4+5+6)=84입니다. 맞닿은 눈은 안쪽에서 두 번 세었으므로, 접촉 눈의 합을 두 배 해 빼면 겉면 눈의 합이 됩니다.</p><ol><li><strong>(가)</strong>를 일렬로 붙이면 접촉 눈은 x, 7−x, x입니다. 합은 7+x이고 x는 1~6이므로 접촉 눈 합은 8~13입니다.</li><li><strong>(나)</strong>는 일렬 접촉 두 곳의 눈 합이 7이고, 꺾인 주사위의 두 접촉면은 이웃한 서로 다른 면이어야 합니다. 전체 접촉 눈 합은 8~13 사이이고, 양 끝 값은 실제로 만들 수 있습니다. 예를 들어 직선 쪽을 5와 2로 하고 꺾인 접촉을 1 또는 6으로 둘 수 있습니다.</li><li>두 모양 모두 접촉 눈 합이 가장 작을 때 겉면 합은 84−2×8=68입니다. 접촉 눈 합이 가장 클 때는 84−2×13=58입니다.</li></ol><p class="source52-p54e44-final">(1) 최댓값: (가) 68, (나) 68<br>(2) 최솟값: (가) 58, (나) 58</p></div>`;
    return Object.freeze({ prompt, answer: "최댓값: (가) 68, (나) 68; 최솟값: (가) 58, (나) 58", solution, answerVisual: diagrams(), sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:source-four-dice-line-and-bent`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-contact-sum-bounds-and-constructive-extrema", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1 });
  }
  function verifyExtrema() {
    const all = [];
    for (let x = 1; x <= 6; x += 1) for (let branch = 1; branch <= 6; branch += 1) {
      if (branch === x || branch === 7 - x) continue; // distinct adjacent faces at the elbow are neither equal nor opposite
      all.push({ lineContacts: [x, 7 - x, x], lineExterior: 84 - 2 * (7 + x), bentContacts: [x, 7 - x, branch], bentExterior: 84 - 2 * (7 + branch) });
    }
    const extrema = values => ({ min: Math.min(...values), max: Math.max(...values) });
    const result = { line: extrema(all.map(row => row.lineExterior)), bent: extrema(all.map(row => row.bentExterior)), states: all.length };
    if (JSON.stringify(result.line) !== JSON.stringify({ min: 58, max: 68 }) || JSON.stringify(result.bent) !== JSON.stringify({ min: 58, max: 68 })) throw new Error("주사위 네 개 두 배열의 최댓값·최솟값이 68·58과 다릅니다.");
    return Object.freeze(result);
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P54E44Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : oldKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null : oldGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P54E44Installed", { value: true, configurable: false, enumerable: false });
    return true;
  }
  return Object.freeze({ definition, sourceItemId, generatorKey, shape, diagrams, makeQuestion, verifyExtrema, install });
});
