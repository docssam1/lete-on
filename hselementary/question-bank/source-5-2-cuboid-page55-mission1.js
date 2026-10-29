(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE55_M1 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e4-mission-1";
  const generatorKey = "source52CuboidDiceChainPage55Mission1";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 51, sourcePrintedPage: 55 });
  const source = Object.freeze({ dieCount: 5, topMarker: 2, outerRightMarker: 2, contactSum: 8, oppositeSum: 7, answer: 4 });

  function verifyModel() {
    const { dieCount, topMarker, outerRightMarker, contactSum, oppositeSum, answer } = source;
    const reverseSteps = Object.freeze([
      Object.freeze({ deduction: "오른쪽 끝 바깥면 2의 반대 면", value: oppositeSum - outerRightMarker }),
      Object.freeze({ deduction: "마지막 접촉면", value: contactSum - (oppositeSum - outerRightMarker) }),
      Object.freeze({ deduction: "그 주사위의 반대 접촉면", value: oppositeSum - (contactSum - (oppositeSum - outerRightMarker)) }),
      Object.freeze({ deduction: "가운데 주사위의 다음 접촉면", value: contactSum - (oppositeSum - (contactSum - (oppositeSum - outerRightMarker))) })
    ]);
    if (dieCount !== 5 || oppositeSum !== 7 || contactSum !== 8 || topMarker !== 2 || outerRightMarker !== 2) {
      throw new Error("원문 주사위 수, 표시 눈, 접촉면과 반대면 조건이 보존되어야 합니다.");
    }
    if (reverseSteps.map(step => step.value).join(",") !== "5,3,4,4" || answer !== 4) {
      throw new Error("원문 접촉 연쇄와 정답 4가 일치해야 합니다.");
    }
    return Object.freeze({ dieCount, topMarker, outerRightMarker, contactSum, oppositeSum, reverseSteps, answer });
  }

  function cube({ x, y, size, dx, dy, showFront, showRight, frontLabel = "", topLabel = "", rightLabel = "" }) {
    const front = showFront ? `<path class="source52-p55m1-face source52-p55m1-front" d="M${x} ${y - size}H${x + size}V${y}H${x}Z"/>` : "";
    const right = showRight ? `<path class="source52-p55m1-face source52-p55m1-right" d="M${x + size} ${y - size}L${x + size + dx} ${y - size - dy}V${y - dy}L${x + size} ${y}Z"/>` : "";
    const top = `<path class="source52-p55m1-face source52-p55m1-top" d="M${x} ${y - size}L${x + dx} ${y - size - dy}H${x + size + dx}L${x + size} ${y - size}Z"/>`;
    const frontText = frontLabel ? `<text class="source52-p55m1-label" x="${x + size / 2}" y="${y - size / 2 + 6}" text-anchor="middle">${frontLabel}</text>` : "";
    const topText = topLabel ? `<text class="source52-p55m1-label" x="${x + size / 2 + dx / 2}" y="${y - size - dy / 2 + 6}" text-anchor="middle">${topLabel}</text>` : "";
    const rightText = rightLabel ? `<text class="source52-p55m1-label" x="${x + size + dx / 2}" y="${y - size / 2 - dy / 2 + 6}" text-anchor="middle">${rightLabel}</text>` : "";
    return `<g>${top}${right}${front}${topText}${rightText}${frontText}</g>`;
  }

  function diagram() {
    const model = verifyModel();
    const size = 84, dx = 40, dy = 30, baseX = 48, baseY = 272;
    const path = [
      { key: "A", i: 0, j: 0 }, { key: "B", i: 0, j: 1 }, { key: "C", i: 0, j: 2 },
      { key: "D", i: 1, j: 2 }, { key: "E", i: 2, j: 2 }
    ];
    const occupied = new Set(path.map(item => `${item.i},${item.j}`));
    const layers = path.slice().sort((a, b) => (b.i + b.j) - (a.i + a.j) || b.i - a.i);
    const cubes = layers.map(item => {
      const x = baseX + item.i * size + item.j * dx;
      const y = baseY - item.j * dy;
      return cube({ x, y, size, dx, dy,
        showFront: !occupied.has(`${item.i},${item.j - 1}`),
        showRight: !occupied.has(`${item.i + 1},${item.j}`),
        frontLabel: item.key === "A" ? "㉠" : "",
        topLabel: item.key === "C" ? String(model.topMarker) : "",
        rightLabel: item.key === "E" ? String(model.outerRightMarker) : ""
      });
    }).join("");
    return `<svg class="source52-p55m1-diagram" viewBox="25 48 470 242" role="img" aria-label="정육면체 다섯 개가 ㄴ자 모양으로 이어져 있습니다. 위쪽 표시 면은 ${model.topMarker}, 오른쪽 끝 바깥 면은 ${model.outerRightMarker}, 첫 주사위 앞면은 ㉠입니다." xmlns="http://www.w3.org/2000/svg">${cubes}</svg>`;
  }

  function makeQuestion() {
    const model = verifyModel();
    const prompt = `<div class="source52-p55m1-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>정육면체의 면에는 각각 1, 2, 3, 4, 5, 6의 숫자가 쓰여 있고, 마주 보는 면에 쓰인 두 수의 합은 모두 7입니다. 다음과 같이 정육면체 5개를 나란히 이어 놓았을 때, 마주 붙인 면의 두 수의 합은 모두 8입니다. 면 ㉠에 적힌 수는 얼마인가요?</p>${diagram()}</div>`;
    const solution = `<div class="source52-p55m1-solution" data-source-answer="${sourceItemId}"><p>오른쪽 끝 주사위에서부터 반대 면과 맞닿은 면을 차례로 찾습니다. 맞닿은 면은 그림 안쪽에 가려져 있습니다.</p>${diagram()}<ol><li>오른쪽 끝 바깥 면이 2이므로 그 반대인 안쪽 면은 5입니다. 맞닿은 면의 합이 8이므로 바로 왼쪽 주사위의 접촉 면은 3입니다.</li><li>그 주사위의 반대 면은 4입니다. 이 면과 맞닿는 윗면이 2인 주사위의 오른쪽 면도 4입니다.</li><li>윗면이 2인 주사위에서 남은 앞·뒤 면은 1과 6입니다. 1은 맞닿은 면의 합을 8로 만들 수 없으므로 앞쪽에 붙은 면은 6이고, 이 면과 맞닿는 주사위의 면은 2입니다.</li><li>㉠이 있는 주사위 바로 뒤의 주사위에서 2의 반대 면은 5입니다. 따라서 ㉠이 있는 주사위의 붙은 면은 3이고, 그 반대쪽 앞면은 <strong>4</strong>입니다.</li></ol><p class="source52-p55m1-final-answer">답: 4</p></div>`;
    return Object.freeze({ prompt, answer: "4", solution, sourceItemId, generator: generatorKey,
      variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0,
      verifiedVariantId: `${sourceItemId}:fixed-five-dice-chain-2-2`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2,
      sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-exhaustive-five-dice-chain-enumeration", generationMode: "fixed-verified-pool",
      verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel: model });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P55M1Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P55M1Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, source, verifyModel, diagram, makeQuestion, install });
});
