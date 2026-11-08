(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.HSE_SOURCE_52_FLOWER_RING = api;
  api.install(root);
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const id = '5-2-u3-e8-mission-6-flower-ring-synthetic';
  const key = 'source52FlowerRingSynthetic';
  const originalId = '5-2-u3-e8-mission-6-original';
  const originalKey = 'source52FlowerRingPage39Original';
  const pools = Object.freeze([9, 11, 15]);
  function figure(count) {
    const petals = Array.from({ length: count }, (_, i) => `<ellipse cx="110" cy="62" rx="9" ry="38" transform="rotate(${360 * i / count} 110 110)" fill="#fffaf0" stroke="#191511" stroke-width="1.5"/>`).join('');
    return `<svg viewBox="0 0 220 220" role="img" aria-label="꽃잎 ${count}개가 원형으로 달린 꽃" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(240px,100%);height:auto;margin:10px auto">${petals}<circle cx="110" cy="110" r="11" fill="#f1e7cd" stroke="#191511" stroke-width="1.5"/></svg>`;
  }
  function makeQuestion(variant = 0, difficulty = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || ![-1, 0, 1].includes(difficulty)) return null;
    const index = variant % pools.length, n = pools[index];
    const remaining = (n - 3) / 2;
    const prompt = `<div data-source-item-id="${id}" data-pool-index="${index}"><p>꽃잎 ${n}개가 원형으로 달린 꽃이 있습니다. 두 사람이 번갈아 한 번에 꽃잎 한 개 또는 처음 꽃에서 서로 이웃한 꽃잎 두 개를 뗍니다. 마지막 꽃잎을 떼는 사람이 이깁니다. 반드시 이길 수 있는 사람은 누구이며, 어떻게 하면 이길 수 있는지 설명하세요.</p>${figure(n)}</div>`;
    const solution = `<div data-source-answer="${id}"><p>나중에 하는 사람이 첫 대응에서 꽃잎을 두 무리로 똑같이 나눕니다.</p><p>처음 하는 사람이 한 잎을 떼면, 그 자리의 반대쪽에 이웃한 두 잎을 뗍니다. 처음 하는 사람이 이웃한 두 잎을 떼면, 그 두 잎의 반대쪽 한 잎을 뗍니다. 어느 경우든 남는 꽃잎은 ${remaining}개씩인 두 무리입니다.</p><p>그다음부터는 상대가 한 무리에서 뗀 잎과 대칭인 위치의 잎을 다른 무리에서 같은 개수만큼 뗍니다. 두 무리가 함께 없어질 때까지 대응할 수 있으므로 마지막 꽃잎은 나중에 하는 사람이 뗍니다.</p></div>`;
    return { prompt, solution, answer: '나중에 하는 사람', sourceItemId: id, generator: key, generationMode: 'fixed-verified-pool', verifiedPoolIndex: index, verifiedVariantCount: 3, verifiedVariantTarget: 3, difficultyOffset: difficulty, difficultyLevel: difficulty + 2, difficultyRank: difficulty + 2, variantProvenance: 'synthetic-source-structure', resultContract: 'strategy-explanation', automaticGrading: false, publisherKeyVerified: false, answerVisualRequired: false, answerVisualStatus: 'not-required', questionModel: { petals: n }, answerModel: { winner: 'second', equalGroups: remaining } };
  }
  function makeOriginal() {
    const prompt = `<div data-source-item-id="${originalId}" data-pool-index="0"><p>13개의 잎이 원형으로 달린 코스모스가 있습니다. 두 사람이 번갈아 한 잎 또는 이웃한 두 잎을 땝니다. 마지막 잎을 딴 사람이 이깁니다. 반드시 이길 수 있는 사람은 누구이며, 첫 대응은 어떻게 해야 하나요?</p><p>처음 하는 사람이 딴 잎의 반대쪽에서 첫 대응을 할 때 빈칸을 채우세요.</p><p>(　　　) 하는 사람이 (　　　) 하는 사람이 따낸 꽃잎의 위치와 (　　　)쪽 꽃잎을 (　　　) 하는 사람과 (　　　) 개수만큼 따냅니다.</p><p>보기: 처음, 나중, 같은, 다른, 반대, 오른, 왼</p></div>`;
    const solution = `<div data-source-answer="${originalId}"><p>빈칸은 차례대로 <b>나중, 처음, 반대, 처음, 다른</b>입니다.</p><ol><li>처음 사람이 한 잎을 떼면 반대쪽에 이웃한 두 잎을, 두 잎을 떼면 반대쪽 한 잎을 뗍니다. 남은 잎은 다섯 잎씩 두 무리입니다.</li><li>그다음부터는 상대가 한 무리에서 뗀 잎에 대응하는 반대편 잎을 <b>같은 개수</b>만큼 뗍니다. 매번 두 무리가 똑같이 남으므로 나중에 하는 사람이 마지막 잎을 뗍니다.</li></ol><p>‘다른 개수’는 첫 대응에 적용하며, 이후에는 같은 개수로 대응합니다.</p></div>`;
    return {prompt,solution,answer:'나중, 처음, 반대, 처음, 다른',sourceItemId:originalId,generator:originalKey,generationMode:'fixed-verified-pool',verifiedPoolIndex:0,verifiedVariantCount:1,verifiedVariantTarget:1,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,sourcePrintedPage:39,publisherKeyVerified:false,publisherAnswerVerified:false,answerVerification:'independent-minimax-and-paired-strategy',answerAssumption:'원문의 다른 개수는 첫 대응으로 명확화',automaticGrading:false,resultContract:'strategy-explanation',answerVisualRequired:false};
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== 'function' || typeof api.generate !== 'function') return false;
    if (api.__source52FlowerRingInstalled) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === id || type.sourceItemId === id || type.generatorKey === key || type.id === originalId || type.sourceItemId === originalId || type.generatorKey === originalKey);
    api.generatorKey = type => !matches(type) ? oldKey(type) : type.reviewLocked !== false || type.sourceVerified !== true ? '' : type.id === id && type.sourceItemId === id && type.generatorKey === key ? key : type.id === originalId && type.sourceItemId === originalId && type.generatorKey === originalKey ? originalKey : '';
    api.generate = (type, rank, difficulty, seed, variant = 0) => !matches(type) ? oldGenerate(type, rank, difficulty, seed, variant) : api.generatorKey(type) === originalKey && Number(variant) === 0 ? makeOriginal() : api.generatorKey(type) === key ? makeQuestion(variant, difficulty ?? 0) : null;
    if (Array.isArray(api.names)) for (const k of [key, originalKey]) if (!api.names.includes(k)) api.names.push(k);
    Object.defineProperty(api, '__source52FlowerRingInstalled', { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, figure, makeQuestion, originalId, originalKey, makeOriginal, install });
});
