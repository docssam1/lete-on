(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE55_M6 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e4-mission-6";
  const generatorKey = "source52FourDiceOuterPipsMaxPage55Mission6";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 51, sourcePrintedPage: 55 });
  const shapes = Object.freeze({
    square: Object.freeze({ label: "정사각형 모양", coords: Object.freeze([[0, 0], [1, 0], [0, 1], [1, 1]]), contacts: Object.freeze([1, 2, 2, 1]), contactSum: 6, outerMax: 72 }),
    zigzag: Object.freeze({ label: "꺾인 모양", coords: Object.freeze([[0, 0], [1, 0], [1, 1], [2, 1]]), contacts: Object.freeze([1, 2, 1]), contactSum: 4, outerMax: 76 })
  });
  const witnesses = Object.freeze({
    square: Object.freeze([
      Object.freeze({ xp: 1, xn: 6, yp: 2, yn: 5, zp: 3, zn: 4 }),
      Object.freeze({ xp: 6, xn: 1, yp: 2, yn: 5, zp: 4, zn: 3 }),
      Object.freeze({ xp: 1, xn: 6, yp: 5, yn: 2, zp: 4, zn: 3 }),
      Object.freeze({ xp: 6, xn: 1, yp: 5, yn: 2, zp: 3, zn: 4 })
    ]),
    zigzag: Object.freeze([
      Object.freeze({ xp: 1, xn: 6, yp: 2, yn: 5, zp: 3, zn: 4 }),
      Object.freeze({ xp: 6, xn: 1, yp: 2, yn: 5, zp: 4, zn: 3 }),
      Object.freeze({ xp: 1, xn: 6, yp: 5, yn: 2, zp: 4, zn: 3 }),
      Object.freeze({ xp: 6, xn: 1, yp: 2, yn: 5, zp: 4, zn: 3 })
    ])
  });

  function cube(x, bottom, size, dx, dy, showFront, showSide) {
    return `<g class="source52-p55m6-cube"><polygon class="source52-p55m6-top" points="${x},${bottom - size} ${x + dx},${bottom - size - dy} ${x + size + dx},${bottom - size - dy} ${x + size},${bottom - size}"/>${showSide ? `<polygon class="source52-p55m6-side" points="${x + size},${bottom - size} ${x + size + dx},${bottom - size - dy} ${x + size + dx},${bottom - dy} ${x + size},${bottom}"/>` : ""}${showFront ? `<rect class="source52-p55m6-front" x="${x}" y="${bottom - size}" width="${size}" height="${size}"/>` : ""}</g>`;
  }

  function shapeSvg(name) {
    const shape = shapes[name];
    if (!shape) throw new Error(`Unknown source shape: ${name}`);
    const size = 62, dx = 22, dy = 16, originX = 22, baseBottom = 169;
    const maxX = Math.max(...shape.coords.map(([x]) => x));
    const width = originX + maxX * size + dx + size + dx + 12;
    const occupied = new Set(shape.coords.map(([x, y]) => `${x},${y}`));
    const ordered = [...shape.coords].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    const cubes = ordered.map(([gx, gy]) => cube(originX + gx * size + gy * dx, baseBottom - gy * dy, size, dx, dy, !occupied.has(`${gx},${gy - 1}`), !occupied.has(`${gx + 1},${gy}`))).join("");
    return `<svg class="source52-p55m6-shape source52-p55m6-shape--${name}" data-source-shape="${name}" viewBox="0 0 ${width} 205" role="img" aria-label="${shape.label}: 네 주사위가 맞닿은 면끼리 이어져 있습니다." xmlns="http://www.w3.org/2000/svg">${cubes}</svg>`;
  }

  function figures({ answer = false } = {}) {
    return `<div class="source52-p55m6-figures">${["square", "zigzag"].map(name => {
      const shape = shapes[name];
      return `<figure class="source52-p55m6-figure"><figcaption>${shape.label}</figcaption>${shapeSvg(name)}${answer ? `<p class="source52-p55m6-contact">맞닿은 눈: ${shape.contacts.join(" + ")} = ${shape.contactSum}</p><p class="source52-p55m6-outer">겉면의 눈의 합 최댓값 <strong>${shape.outerMax}</strong></p>` : ""}</figure>`;
    }).join("")}</div>`;
  }

  function answerVisual() {
    return `<div class="source52-p55m6-answer-visual" aria-label="정사각형 배열은 72, 꺾인 배열은 76">${figures({ answer: true })}</div>`;
  }

  function verifyStructure() {
    for (const [name, shape] of Object.entries(shapes)) {
      if (shape.coords.length !== 4 || shape.contacts.length !== (name === "square" ? 4 : 3)) throw new Error(`${name} 배열의 주사위 수 또는 접촉 수가 원문과 다릅니다.`);
      if (shape.contactSum !== shape.contacts.reduce((a, b) => a + b, 0) || shape.outerMax !== 84 - 2 * shape.contactSum) throw new Error(`${name} 배열의 겉면 합 계산이 맞지 않습니다.`);
    }
    if (shapes.square.outerMax !== 72 || shapes.zigzag.outerMax !== 76) throw new Error("원문의 순서대로 정사각형은 72, 꺾인 배열은 76이어야 합니다.");
    for (const [name, assignments] of Object.entries(witnesses)) {
      const coords = shapes[name].coords;
      if (assignments.length !== 4 || assignments.some(d => Object.values(d).sort((a, b) => a - b).join(",") !== "1,2,3,4,5,6")) throw new Error(`${name}의 최댓값 달성 배치가 표준 주사위가 아닙니다.`);
      for (const d of assignments) if (d.xp + d.xn !== 7 || d.yp + d.yn !== 7 || d.zp + d.zn !== 7) throw new Error(`${name} 증명 배치에서 마주 보는 면의 합이 7이 아닙니다.`);
      const index = new Map(coords.map((pt, i) => [pt.join(","), i]));
      let edgeValues = [];
      for (let i = 0; i < coords.length; i += 1) {
        const [x, y] = coords[i];
        for (const [dx, dy, face, opposite] of [[1, 0, "xp", "xn"], [0, 1, "yp", "yn"]]) {
          const j = index.get(`${x + dx},${y + dy}`);
          if (j !== undefined) {
            if (assignments[i][face] !== assignments[j][opposite]) throw new Error(`${name} witness has unequal pips at a joined pair.`);
            edgeValues.push(assignments[i][face]);
          }
        }
      }
      if (edgeValues.slice().sort((a, b) => a - b).join(",") !== shapes[name].contacts.slice().sort((a, b) => a - b).join(",")) throw new Error(`${name} witness contacts do not attain the recorded minimum.`);
    }
    return Object.freeze({ sourceItemId, totalPips: 84, squareContactMin: 6, squareOuterMax: 72, zigzagContactMin: 4, zigzagOuterMax: 76, witnessesVerified: true, publisherAnswerKeyVerified: false });
  }

  function makeQuestion() {
    const answerModel = verifyStructure();
    const prompt = `<div class="source52-p55m6-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>마주 보는 두 면의 눈의 합이 7인 주사위 4개로 눈이 같은 면끼리 이어 붙여 다음 두 모양을 만들었습니다. 겉면의 눈의 합이 가장 클 때, 두 모양의 겉면의 눈의 합은 각각 얼마인가요?</p>${figures()}<p class="source52-p55m6-answer-line">정사각형 모양: ______　　꺾인 모양: ______</p></div>`;
    const solution = `<div class="source52-p55m6-solution" data-source-answer="${sourceItemId}"><p>주사위 네 개의 전체 눈의 합은 21×4=84입니다. 맞닿은 면은 겉면에 포함되지 않으므로, 맞닿은 눈의 합을 먼저 가장 작게 만들면 겉면의 합이 가장 커집니다.</p><ol><li><strong>정사각형 모양:</strong> 네 접촉 자리의 눈은 같은 주사위의 서로 다른 두 면에 있으므로 각각 적어도 1과 2입니다. 주사위 네 개에서 접촉 눈을 모두 세면 적어도 (1+2)×4=12이고, 각 접촉을 양쪽 주사위에서 두 번 세었으므로 접촉쌍의 합은 적어도 6입니다. 접촉 자리마다 1과 2를 번갈아 놓으면 이 값에 도달합니다. 따라서 84−2×6=<strong>72</strong>입니다.</li><li><strong>꺾인 모양:</strong> 양 끝 주사위는 한 번씩 맞닿아 각 1, 가운데 주사위 두 개는 서로 다른 두 면으로 맞닿아 각각 적어도 1+2입니다. 접촉 눈의 전체 합은 적어도 1+(1+2)+(1+2)+1=8이므로 접촉쌍의 합은 적어도 4입니다. 세 접촉에 1, 2, 1을 놓으면 달성됩니다. 따라서 84−2×4=<strong>76</strong>입니다.</li></ol><p class="source52-p55m6-final-answer">정사각형 모양: 72　·　꺾인 모양: 76</p></div>`;
    return Object.freeze({ prompt, answer: "72, 76", solution, answerVisual: answerVisual(), sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:two-contact-shapes`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: true, answerVisualStatus: "verified-contact-witnesses", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "exhaustive-die-orientation-equal-contact-optimization", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P55M6Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P55M6Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, shapes, witnesses, shapeSvg, figures, answerVisual, verifyStructure, makeQuestion, install });
});
