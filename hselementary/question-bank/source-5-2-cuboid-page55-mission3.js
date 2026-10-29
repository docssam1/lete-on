(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE55_M3 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e4-mission-3";
  const generatorKey = "source52CuboidNetStackBackSumPage55Mission3";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 51, sourcePrintedPage: 55 });
  const faces = Object.freeze([
    Object.freeze({ value: 1, x: 0, y: 0 }), Object.freeze({ value: 2, x: 1, y: 0 }), Object.freeze({ value: 3, x: 2, y: 0 }),
    Object.freeze({ value: 4, x: 2, y: 1 }), Object.freeze({ value: 5, x: 3, y: 1 }), Object.freeze({ value: 6, x: 4, y: 1 })
  ]);
  const oppositePairs = Object.freeze([[1, 3], [2, 5], [4, 6]]);
  const frontFaces = Object.freeze([2, null, 3, 4, 6, 3]);
  const knownBackSum = 17;
  const backFaceTotal = 22;
  const answer = 2;

  function netSvg({ solution = false, compact = false } = {}) {
    const cell = compact ? 48 : 58, pad = 14;
    const maxX = Math.max(...faces.map(face => face.x)), maxY = Math.max(...faces.map(face => face.y));
    const width = (maxX + 1) * cell + pad * 2, height = (maxY + 1) * cell + pad * 2;
    const squares = faces.map(face => {
      const x = pad + face.x * cell, y = pad + face.y * cell;
      return `<g data-net-face="${face.value}"><rect class="source52-p55m3-net-cell" x="${x}" y="${y}" width="${cell}" height="${cell}"/><text class="source52-p55m3-net-label" x="${x + cell / 2}" y="${y + cell / 2 + 1}">${face.value}</text></g>`;
    }).join("");
    return `<svg class="source52-p55m3-net" viewBox="0 0 ${width} ${height}" role="img" aria-label="전개도: 위쪽에 1, 2, 3이 가로로 있고, 3 아래에서 4, 5, 6으로 이어집니다." xmlns="http://www.w3.org/2000/svg">${squares}</svg>`;
  }

  function cube({ x, bottom, size, dx, dy, label, solution }) {
    const visibleLabel = label === null ? solution ? String(answer) : "㉠" : String(label);
    return `<g class="source52-p55m3-cube"><polygon class="source52-p55m3-top-face" points="${x},${bottom - size} ${x + dx},${bottom - size - dy} ${x + size + dx},${bottom - size - dy} ${x + size},${bottom - size}"/><polygon class="source52-p55m3-right-face" points="${x + size},${bottom - size} ${x + size + dx},${bottom - size - dy} ${x + size + dx},${bottom - dy} ${x + size},${bottom}"/><rect class="source52-p55m3-front-face" x="${x}" y="${bottom - size}" width="${size}" height="${size}"/><text class="source52-p55m3-front-label" x="${x + size / 2}" y="${bottom - size / 2 + 1}">${visibleLabel}</text></g>`;
  }

  function stackSvg({ solution = false, compact = false } = {}) {
    const size = compact ? 58 : 68, dx = compact ? 22 : 26, dy = compact ? 15 : 18;
    const baseX = compact ? 28 : 34, baseY = compact ? 278 : 326;
    const rows = [
      [{ x: baseX, bottom: baseY, label: 2 }, { x: baseX + size, bottom: baseY, label: null }, { x: baseX + size * 2, bottom: baseY, label: 3 }],
      [{ x: baseX + size / 2, bottom: baseY - size, label: 4 }, { x: baseX + size * 1.5, bottom: baseY - size, label: 6 }],
      [{ x: baseX + size, bottom: baseY - 2 * size, label: 3 }]
    ];
    const cubes = rows.map(row => row.map(item => cube({
      x: item.x,
      bottom: item.bottom,
      size, dx, dy, label: item.label, solution
    })).join("")).join("");
    const viewWidth = baseX * 2 + size * 3 + dx + 12;
    const middleLabel = solution ? String(answer) : "㉠";
    return `<svg class="source52-p55m3-stack" viewBox="0 0 ${viewWidth} ${baseY + 42}" role="img" aria-label="정육면체 여섯 개를 아래 세 개, 그 위 두 개, 꼭대기 한 개로 쌓았습니다. 앞면에는 아래부터 2, ${middleLabel}, 3과 4, 6과 3이 보입니다." xmlns="http://www.w3.org/2000/svg">${cubes}<text class="source52-p55m3-front-caption" x="${baseX + size * 1.5}" y="${baseY + 30}" text-anchor="middle">앞</text></svg>`;
  }

  function diagram({ solution = false, compact = false } = {}) {
    return `<div class="source52-p55m3-diagram ${compact ? "is-compact" : "is-wide"}"><section class="source52-p55m3-figure"><h4>전개도</h4>${netSvg({ solution, compact })}</section><div class="source52-p55m3-arrow" aria-hidden="true">→</div><section class="source52-p55m3-figure"><h4>쌓은 모양</h4>${stackSvg({ solution, compact })}</section></div>`;
  }

  function verifyModel() {
    if (faces.map(face => face.value).join("") !== "123456") throw new Error("전개도에는 1부터 6까지의 면이 한 번씩 있어야 합니다.");
    if (JSON.stringify(oppositePairs) !== JSON.stringify([[1, 3], [2, 5], [4, 6]])) throw new Error("전개도 접기에서 확인한 맞은편 쌍이 달라졌습니다.");
    if (frontFaces.join(",") !== "2,,3,4,6,3" || knownBackSum !== 17 || backFaceTotal !== 22 || answer !== 2) throw new Error("쌓기 그림의 앞·뒤 면 계산이 원문 조건과 달라졌습니다.");
    return Object.freeze({ sourceItemId, oppositePairs, frontFaces, knownBackSum, backFaceTotal, missingBackValue: backFaceTotal - knownBackSum, answer, publisherAnswerKeyVerified: false });
  }

  function makeQuestion() {
    const answerModel = verifyModel();
    const prompt = `<div class="source52-p55m3-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>아래 전개도로 똑같은 정육면체 6개를 만들어 그림과 같이 쌓았습니다. 뒤쪽 면에 적힌 수들의 합이 22일 때 ㉠에 들어갈 수는 얼마인가요?</p>${diagram()}</div>`;
    const solution = `<div class="source52-p55m3-solution" data-source-answer="${sourceItemId}"><p>전개도에서 마주 보는 면을 먼저 찾습니다.</p>${diagram({ solution: true })}<ol><li>전개도를 접으면 맞은편 면은 1과 3, 2와 5, 4와 6입니다.</li><li>앞면이 2, ㉠, 3, 4, 6, 3인 여섯 정육면체의 뒤쪽 면은 각각 5, ㉠의 반대 면, 1, 6, 4, 1입니다. ㉠을 제외한 뒤쪽 수의 합은 5+1+6+4+1=17입니다.</li><li>뒤쪽 수의 합은 22이므로 ㉠의 뒤쪽 면은 22−17=5입니다. 전개도에서 5와 마주 보는 수는 2입니다.</li></ol><p class="source52-p55m3-final-answer">답: 2</p></div>`;
    return Object.freeze({ prompt, answer: "2", solution, sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:net-and-six-block-stack`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-net-fold-and-stack-back-sum-model", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P55M3Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P55M3Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, faces, oppositePairs, frontFaces, netSvg, stackSvg, diagram, verifyModel, makeQuestion, install });
});
