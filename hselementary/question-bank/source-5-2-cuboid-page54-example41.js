(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE54_EXAMPLE41 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u5-e4-example-4-1";
  const generatorKey = "source52CuboidPage54Example41";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 50, sourcePrintedPage: 54 });
  const directions = Object.freeze(["+x", "-x", "+y", "-y", "+z", "-z"]);
  const opposite = Object.freeze({ "+x": "-x", "-x": "+x", "+y": "-y", "-y": "+y", "+z": "-z", "-z": "+z" });
  const diceOrientations = Object.freeze((() => {
    const pairs = [[1, 6], [2, 5], [3, 4]], values = [];
    const permutations = items => items.length ? items.flatMap((item, index) => permutations([...items.slice(0, index), ...items.slice(index + 1)]).map(rest => [item, ...rest])) : [[]];
    for (const order of permutations(pairs)) {
      for (let mask = 0; mask < 8; mask += 1) {
        const state = {};
        order.forEach(([a, b], axis) => {
          state[directions[axis * 2]] = (mask >> axis) & 1 ? b : a;
          state[directions[axis * 2 + 1]] = (mask >> axis) & 1 ? a : b;
        });
        values.push(Object.freeze(state));
      }
    }
    return values;
  })());
  const faces = Object.freeze([
    Object.freeze({ id: "elbow", known: { "+z": 4 } }),
    Object.freeze({ id: "row1" }),
    Object.freeze({ id: "row2" }),
    Object.freeze({ id: "end", known: { "+x": 2 } }),
    Object.freeze({ id: "branch1" }),
    Object.freeze({ id: "blank" })
  ]);
  const joins = Object.freeze([
    Object.freeze(["elbow", "+x", "row1", "-x"]),
    Object.freeze(["row1", "+x", "row2", "-x"]),
    Object.freeze(["row2", "+x", "end", "-x"]),
    Object.freeze(["elbow", "+y", "branch1", "-y"]),
    Object.freeze(["branch1", "+y", "blank", "-y"])
  ]);
  function enumerateModels() {
    const solutions = [], assignment = {};
    function visit(index) {
      if (index === faces.length) { solutions.push(Object.freeze({ ...assignment })); return; }
      const face = faces[index];
      for (const orientation of diceOrientations) {
        if (Object.entries(face.known || {}).some(([direction, value]) => orientation[direction] !== value)) continue;
        let fits = true;
        for (const [leftId, leftDirection, rightId, rightDirection] of joins) {
          const left = assignment[leftId], right = assignment[rightId];
          if (face.id === leftId && right && orientation[leftDirection] + right[rightDirection] !== 8) fits = false;
          if (face.id === rightId && left && left[leftDirection] + orientation[rightDirection] !== 8) fits = false;
        }
        if (!fits) continue;
        assignment[face.id] = orientation;
        visit(index + 1);
        delete assignment[face.id];
      }
    }
    visit(0);
    return Object.freeze(solutions);
  }
  function verifyModel() {
    const models = enumerateModels();
    if (models.length === 0) throw new Error("인쇄된 주사위 배치 조건을 만족하는 방향 배치가 없습니다.");
    const answers = [...new Set(models.map(model => model.blank["+y"]))].sort((a, b) => a - b);
    if (JSON.stringify(answers) !== "[4]") throw new Error(`빈 면의 답이 하나로 정해지지 않았습니다: ${answers.join(", ")}`);
    if (models.some(model => directions.some(direction => model.elbow[direction] + model.elbow[opposite[direction]] !== 7))) throw new Error("마주 보는 면의 합이 7이 아닌 배치가 포함됐습니다.");
    return Object.freeze({ modelCount: models.length, answers: Object.freeze(answers), answer: answers[0] });
  }
  function diagram({ solution = false } = {}) {
    const unit = 54, X = [unit, 0], Y = [-unit, 30], Z = [0, -46], origin = [260, 132];
    const positions = [
      { id: "elbow", x: 0, y: 0 }, { id: "row1", x: 1, y: 0 }, { id: "row2", x: 2, y: 0 }, { id: "end", x: 3, y: 0 },
      { id: "branch1", x: 0, y: 1 }, { id: "blank", x: 0, y: 2 }
    ];
    const map = new Map(positions.map(item => [`${item.x},${item.y}`, item.id]));
    const add = (a, b) => [a[0] + b[0], a[1] + b[1]], point = (x, y) => [origin[0] + x * X[0] + y * Y[0], origin[1] + x * X[1] + y * Y[1]];
    const polygon = points => points.map(([x, y]) => `${x},${y}`).join(" ");
    const cells = positions.slice().sort((a, b) => a.x + a.y - b.x - b.y || a.x - b.x);
    const groups = cells.map(cell => {
      const p = point(cell.x, cell.y), px = add(p, X), py = add(p, Y), pxy = add(px, Y);
      const top = [add(p, Z), add(px, Z), add(pxy, Z), add(py, Z)];
      const right = [px, pxy, add(pxy, Z), add(px, Z)];
      const front = [py, pxy, add(pxy, Z), add(py, Z)];
      const rightNeighbor = map.has(`${cell.x + 1},${cell.y}`), frontNeighbor = map.has(`${cell.x},${cell.y + 1}`);
      const texts = [];
      if (cell.id === "elbow") texts.push(`<text class="top-label" x="${(top[0][0] + top[2][0]) / 2}" y="${(top[0][1] + top[2][1]) / 2 + 5}">4</text>`);
      if (cell.id === "end") texts.push(`<text class="side-label" x="${(right[0][0] + right[2][0]) / 2}" y="${(right[0][1] + right[2][1]) / 2 + 5}">2</text>`);
      if (cell.id === "blank") texts.push(`<text class="blank-label" x="${(front[0][0] + front[2][0]) / 2}" y="${(front[0][1] + front[2][1]) / 2 + 5}">${solution ? "4" : "㉮"}</text>`);
      return `<g class="die die-${cell.id}"><polygon class="top" points="${polygon(top)}"/>${!rightNeighbor ? `<polygon class="right" points="${polygon(right)}"/>` : ""}${!frontNeighbor ? `<polygon class="front" points="${polygon(front)}"/>` : ""}${texts.join("")}</g>`;
    }).join("");
    return `<svg class="source52-p54e41-diagram" viewBox="0 0 520 300" role="img" aria-label="주사위 여섯 개가 ㄴ자로 붙어 있습니다. 꺾이는 주사위의 윗면은 4, 오른쪽 끝의 바깥 면은 2, 앞쪽 끝면은 ${solution ? "4" : "㉮"}입니다." xmlns="http://www.w3.org/2000/svg">${groups}</svg>`;
  }
  function makeQuestion() {
    const model = verifyModel();
    const prompt = `<div class="source52-p54e41-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>각 면에 1부터 6까지의 수가 적힌 정육면체 주사위 6개를 그림과 같이 붙였습니다. 각 주사위에서 마주 보는 두 면의 수의 합은 7이고, 서로 붙은 두 면의 수의 합은 8입니다. 면 ㉮에 적힌 수를 구하세요.</p><figure>${diagram()}<figcaption>붙인 주사위 여섯 개</figcaption></figure></div>`;
    const solution = `<div class="source52-p54e41-solution" data-source-answer="${sourceItemId}"><p>각 주사위의 마주 보는 면의 합은 7, 맞붙은 면의 합은 8이라는 두 조건을 차례로 씁니다.</p><ol><li>오른쪽 끝 주사위의 바깥 면이 2이므로, 그 주사위의 반대쪽 면은 5입니다. 여기에 붙은 면은 합이 8이어야 하므로 이웃한 주사위의 면은 3입니다.</li><li>마주 보는 면의 합이 7이므로 그 주사위의 반대쪽 면은 4입니다. 이 값과 맞붙는 다음 면은 4, 그 주사위의 반대쪽 면은 3입니다. 이 과정을 꺾이는 주사위까지 이어 가면 그 주사위의 좌우 면은 5와 2입니다.</li><li>꺾이는 주사위의 윗면은 4이므로 아랫면은 3입니다. 이미 좌우에 5와 2가 있으므로 남은 앞뒤 면은 1과 6입니다.</li><li>앞쪽으로 이어지는 주사위와 맞붙은 면의 합은 8입니다. 1과 맞붙으면 다른 면이 7이어야 해서 불가능하므로, 꺾이는 주사위의 앞면은 6이고 그 옆 주사위의 붙은 면은 2입니다.</li><li>그 주사위의 반대쪽 붙은 면은 5이고, 시작 주사위의 붙은 면은 3입니다. 따라서 시작 주사위의 앞면 ㉮는 그 반대 면인 <strong>4</strong>입니다.</li></ol><p class="source52-p54e41-final">답: 4</p></div>`;
    return Object.freeze({ prompt, answer: "4", solution, answerVisual: diagram({ solution: true }), sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:source-six-dice-elbow`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-exhaustive-die-orientation-enumeration", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel: model });
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P54E41Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : oldKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null : oldGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P54E41Installed", { value: true });
    return true;
  }
  return Object.freeze({ definition, diceOrientations, faces, joins, enumerateModels, verifyModel, diagram, makeQuestion, install });
});
