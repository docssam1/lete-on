(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE49_M5 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e1-mission-5";
  const generatorKey = "source52CuboidEightBlocksPage49Mission5";
  const block = Object.freeze({ length: 5, width: 3, height: 1, count: 8 });
  const allocations = Object.freeze([
    [8, 1, 1], [1, 8, 1], [1, 1, 8],
    [4, 2, 1], [4, 1, 2], [2, 4, 1], [2, 1, 4], [1, 4, 2], [1, 2, 4],
    [2, 2, 2]
  ].map(row => Object.freeze(row)));
  const dimensions = allocation => Object.freeze([block.length * allocation[0], block.width * allocation[1], block.height * allocation[2]]);
  const canonical = dims => [...dims].sort((a, b) => b - a).join("×");
  const arrangements = Object.freeze(allocations.map((allocation, index) => Object.freeze({
    index: index + 1,
    blocks: allocation,
    dims: dimensions(allocation),
    canonicalDimensions: canonical(dimensions(allocation))
  })));
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 45, sourcePrintedPage: 49 });

  function verifyModel() {
    if (block.length !== 5 || block.width !== 3 || block.height !== 1 || block.count !== 8) throw new Error("원문 블록은 5×3×1cm 8개여야 합니다.");
    if (allocations.length !== 10 || allocations.some(([a, b, c]) => a * b * c !== block.count)) throw new Error("블록 수가 8개인 축별 배열을 빠짐없이 열거해야 합니다.");
    const uniqueDims = new Set(arrangements.map(row => row.canonicalDimensions));
    if (uniqueDims.size !== arrangements.length) throw new Error("회전·뒤집기 동치로 합친 뒤 결과 크기가 중복됩니다.");
    const groups = [allocations.filter(row => row.slice().sort((a, b) => b - a).join(",") === "8,1,1").length,
      allocations.filter(row => row.slice().sort((a, b) => b - a).join(",") === "4,2,1").length,
      allocations.filter(row => row[0] === 2 && row[1] === 2 && row[2] === 2).length];
    if (groups.join(",") !== "3,6,1") throw new Error("8개 블록 분배는 3+6+1가지여야 합니다.");
    return Object.freeze({ block, allocations, arrangements, groups: Object.freeze(groups), answer: 10 });
  }

  function diagram() {
    const line = (x1, y1, x2, y2, cls = "outline") => `<line class="source52-p49m5-${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    const left = 75, top = 116, frontW = 210, frontH = 48, depthX = 105, depthY = -70;
    const right = left + frontW, bottom = top + frontH, backLeft = left + depthX, backRight = right + depthX, backTop = top + depthY, backBottom = bottom + depthY;
    const outline = [line(left, top, right, top), line(right, top, backRight, backTop), line(backRight, backTop, backRight, backBottom),
      line(backRight, backBottom, right, bottom), line(right, bottom, left, bottom), line(left, bottom, left, top),
      line(left, top, backLeft, backTop), line(backLeft, backTop, backRight, backTop)].join("");
    const dimensions = `<g class="source52-p49m5-dimensions">
      <line x1="${left}" y1="${bottom + 15}" x2="${right}" y2="${bottom + 15}"/><line x1="${left}" y1="${bottom + 8}" x2="${left}" y2="${bottom + 22}"/><line x1="${right}" y1="${bottom + 8}" x2="${right}" y2="${bottom + 22}"/><text x="${left + frontW / 2}" y="${bottom + 36}" text-anchor="middle">5cm</text>
      <line x1="${right + 12}" y1="${top - 2}" x2="${backRight + 12}" y2="${backTop - 2}"/><text x="${right + 62}" y="${backTop - 9}" text-anchor="middle">3cm</text>
      <line x1="${backRight + 17}" y1="${backTop}" x2="${backRight + 17}" y2="${backBottom}"/><text x="${backRight + 29}" y="${(backTop + backBottom) / 2 + 4}">1cm</text>
    </g>`;
    return `<svg class="source52-p49m5-diagram" viewBox="0 0 430 235" role="img" aria-label="5cm, 3cm, 1cm 변의 길이를 가진 직육면체 한 개" xmlns="http://www.w3.org/2000/svg"><g>${outline}</g>${dimensions}</svg>`;
  }

  function arrangementTable() {
    return `<div class="source52-p49m5-table-wrap"><table class="source52-p49m5-table"><caption>축별 블록 수와 완성한 직육면체의 크기</caption><thead><tr><th scope="col">가로·세로·높이 방향 블록 수</th><th scope="col">완성한 직육면체 크기(회전·뒤집기 동치)</th></tr></thead><tbody>${arrangements.map(row => `<tr><td>${row.blocks.join("×")}개</td><td>${row.canonicalDimensions}cm</td></tr>`).join("")}</tbody></table></div>`;
  }

  function makeQuestion() {
    const answerModel = verifyModel();
    const prompt = `<div class="source52-p49m5-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>가로, 세로, 높이가 각각 5cm, 3cm, 1cm인 직육면체 8개를 차곡차곡 쌓아 한 개의 직육면체를 만들려고 합니다. 같은 크기의 면끼리 닿게 하여 만들고, 돌리거나 뒤집어서 겹치는 모양은 같은 것으로 볼 때 서로 다른 직육면체는 모두 몇 개인가요?</p>${diagram()}</div>`;
    const solution = `<div class="source52-p49m5-solution" data-source-answer="${sourceItemId}"><p>각 조각은 5cm, 3cm, 1cm의 서로 다른 변을 가집니다. 같은 크기의 면끼리 맞닿으면 같은 길이 방향끼리 이어지므로, 큰 직육면체의 세 방향에 놓인 조각 수를 각각 a, b, c라고 할 수 있습니다.</p><ol><li>조각이 모두 8개이므로 <strong>a×b×c=8</strong>입니다.</li><li>8을 세 방향으로 나누는 방법은 (8,1,1)의 순서 바꾸기 3가지, (4,2,1)의 순서 바꾸기 6가지, (2,2,2) 1가지입니다. 모두 3+6+1=10가지입니다.</li><li>완성한 크기를 회전·뒤집기 동치로 한 번 더 합쳐 확인해도 열 가지 크기는 서로 겹치지 않습니다.</li></ol>${arrangementTable()}<p class="source52-p49m5-final-answer">답: 10가지</p></div>`;
    return Object.freeze({ prompt, answer: "10가지", solution, answerVisual: diagram(), sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0,
      poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:ten-distinct-prism-arrangements`, difficultyOffset: 0,
      difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: true,
      answerVisualStatus: "verified-reconstruction", publisherKeyVerified: false, publisherAnswerVerified: false,
      handwrittenAnswerVerified: false, answerVerification: "independent-distinct-dimensions-factor-triples", generationMode: "fixed-verified-pool",
      verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P49M5Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P49M5Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, block, allocations, arrangements, verifyModel, diagram, makeQuestion, install });
});
