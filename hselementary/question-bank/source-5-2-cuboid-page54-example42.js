(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE54_EXAMPLE42 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u5-e4-example-4-2";
  const generatorKey = "source52CuboidPage54Example42";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 50, sourcePrintedPage: 54 });
  const labels = Object.freeze("ABCDEF".split(""));
  const directions = Object.freeze(["+x", "-x", "+y", "-y", "+z", "-z"]);
  const vectors = Object.freeze({ "+x": [1, 0, 0], "-x": [-1, 0, 0], "+y": [0, 1, 0], "-y": [0, -1, 0], "+z": [0, 0, 1], "-z": [0, 0, -1] });
  const observations = Object.freeze([["D", "A", "C"], ["D", "C", "B"], ["C", "F", "B"]].map(view => Object.freeze(view)));
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const directionsByVector = Object.freeze(Object.fromEntries(Object.entries(vectors).map(([direction, vector]) => [vector.join(","), direction])));
  function permutations(items) {
    return items.length ? items.flatMap((item, index) => permutations([...items.slice(0, index), ...items.slice(index + 1)]).map(rest => [item, ...rest])) : [[]];
  }
  const rotations = Object.freeze((() => {
    const values = [];
    for (const top of directions) {
      for (const front of directions) {
        const topVector = vectors[top], frontVector = vectors[front];
        if (topVector.reduce((sum, value, index) => sum + value * frontVector[index], 0) !== 0) continue;
        const right = directionsByVector[cross(frontVector, topVector).join(",")];
        if (right) values.push(Object.freeze({ top, front, right }));
      }
    }
    return values;
  })());
  function enumerateModels() {
    const models = [];
    for (const order of permutations(labels)) {
      const faces = Object.freeze(Object.fromEntries(directions.map((direction, index) => [direction, order[index]])));
      const matches = observations.every(observation => rotations.some(rotation => [faces[rotation.top], faces[rotation.front], faces[rotation.right]].join("") === observation.join("")));
      if (matches) models.push(faces);
    }
    return Object.freeze(models);
  }
  function oppositePairs(faces) {
    return Object.freeze([["+x", "-x"], ["+y", "-y"], ["+z", "-z"]].map(pair => pair.map(direction => faces[direction]).sort()).sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1])).map(pair => Object.freeze(pair)));
  }
  function verifyModel() {
    if (rotations.length !== 24) throw new Error(`정육면체 회전 수가 24가 아닙니다: ${rotations.length}`);
    const models = enumerateModels();
    if (models.length !== 24) throw new Error(`세 그림과 맞는 방향 배치가 24개가 아닙니다: ${models.length}`);
    const pairs = [...new Set(models.map(faces => JSON.stringify(oppositePairs(faces))))];
    if (pairs.length !== 1) throw new Error(`마주 보는 면이 유일하지 않습니다: ${pairs.length}개 조합`);
    const resultPairs = JSON.parse(pairs[0]);
    const answers = ["A", "D", "E"].map(label => resultPairs.find(pair => pair.includes(label)).find(value => value !== label));
    if (JSON.stringify(answers) !== JSON.stringify(["B", "F", "C"])) throw new Error(`요청 순서 A,D,E의 답이 다릅니다: ${answers.join(",")}`);
    return Object.freeze({ rotationCount: rotations.length, modelCount: models.length, oppositePairs: Object.freeze(resultPairs.map(pair => Object.freeze(pair))), requested: Object.freeze(["A", "D", "E"]), answers: Object.freeze(answers), answer: "A→B, D→F, E→C" });
  }
  function cubeView([topLabel, frontLabel, rightLabel], index) {
    return `<figure><svg class="source52-p54e42-cube" viewBox="0 0 130 125" role="img" aria-label="그림 ${index}: 윗면 ${topLabel}, 앞면 ${frontLabel}, 오른쪽 면 ${rightLabel}" xmlns="http://www.w3.org/2000/svg"><polygon class="top" points="18,35 60,10 112,35 67,61"/><polygon class="front" points="18,35 67,61 67,108 18,83"/><polygon class="right" points="67,61 112,35 112,82 67,108"/><text class="top-label" x="65" y="39">${topLabel}</text><text class="front-label" x="42" y="81">${frontLabel}</text><text class="right-label" x="88" y="74">${rightLabel}</text></svg><figcaption>그림 ${index}</figcaption></figure>`;
  }
  function diagrams() { return `<div class="source52-p54e42-diagrams">${observations.map((view, index) => cubeView(view, index + 1)).join("")}</div>`; }
  function makeQuestion() {
    const model = verifyModel();
    const prompt = `<div class="source52-p54e42-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>각 면에 A, B, C, D, E, F가 하나씩 적힌 정육면체를 서로 다른 방향에서 본 그림입니다. A, D, E가 적힌 면과 마주 보는 면에 쓰인 알파벳을 차례로 구하세요.</p>${diagrams()}</div>`;
    const solution = `<div class="source52-p54e42-solution" data-source-answer="${sourceItemId}"><p>같은 면을 기준으로 두 그림을 비교합니다.</p><ol><li>첫째와 둘째 그림에서 D는 모두 윗면입니다. 오른쪽에 있던 C가 앞쪽으로 오도록 돌리면 첫째 그림의 A가 있던 방향과 둘째 그림의 B가 있는 방향은 서로 반대가 됩니다. 따라서 A와 B는 마주 봅니다.</li><li>둘째와 셋째 그림에서 B는 모두 오른쪽 면입니다. 앞쪽의 C가 위쪽으로 오도록 돌리면, 둘째 그림의 윗면 D와 셋째 그림의 앞면 F는 서로 반대쪽에 놓입니다. 따라서 D와 F가 마주 봅니다.</li><li>마주 보는 두 쌍 A–B, D–F를 제외하면 남은 두 면은 C와 E이므로 C와 E가 마주 봅니다. 마주 보는 쌍은 A–B, C–E, D–F입니다.</li></ol><p class="source52-p54e42-final">A, D, E의 맞은편을 차례로 쓰면 <strong>답: B, F, C</strong>입니다.</p></div>`;
    return Object.freeze({ prompt, answer: model.answer, solution, answerVisual: diagrams(), sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:source-three-cube-views`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-proper-cube-rotation-enumeration", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel: model });
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P54E42Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : oldKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null : oldGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P54E42Installed", { value: true });
    return true;
  }
  return Object.freeze({ definition, labels, directions, observations, rotations, permutations, enumerateModels, oppositePairs, verifyModel, diagrams, makeQuestion, install });
});
