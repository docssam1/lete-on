(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.HSE_SOURCE_52_DOT_CUT = api;
  api.install(root);
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const id = '5-2-u3-e8-mission-3-dot-cut-synthetic';
  const key = 'source52DotCutSynthetic';
  const paths = Object.freeze([
    [[0,0],[4,2]], [[0,0],[1,1],[3,1],[4,2]], [[0,0],[3,1],[1,1],[4,2]],
    [[1,0],[3,2]], [[1,0],[1,1],[3,1],[3,2]], [[1,0],[3,1],[1,1],[3,2]],
    [[2,0],[2,2]], [[2,0],[1,1],[3,1],[2,2]], [[4,1],[0,1]]
  ].map(path => Object.freeze(path.map(point => Object.freeze(point)))));
  const pools = Object.freeze([1, 2, 7]);
  function figure(path, label) {
    const p = ([x,y]) => `${20 + 32*x},${20 + 32*y}`;
    const dots = Array.from({ length: 15 }, (_, i) => `<circle cx="${20 + 32*(i%5)}" cy="${20 + 32*Math.floor(i/5)}" r="2.6" fill="#191511"/>`).join('');
    return `<svg viewBox="0 0 168 104" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(260px,100%);height:auto;margin:6px auto"><rect x="20" y="20" width="128" height="64" fill="#fffaf0" stroke="#191511" stroke-width="1.6"/><polyline points="${path.map(p).join(' ')}" fill="none" stroke="#191511" stroke-width="2.6"/>${dots}</svg>`;
  }
  function makeQuestion(variant = 0, difficulty = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || ![-1, 0, 1].includes(difficulty)) return null;
    const index = variant % pools.length, excluded = pools[index];
    const prompt = `<div data-source-item-id="${id}" data-pool-index="${index}"><p>가로 4칸, 세로 2칸인 직사각형 점판을 점과 점을 잇는 자름선 하나로 잘라 합동인 두 조각을 만듭니다. 자름선은 테두리에서 시작해 테두리에서 끝나며, 중간에 방향을 바꾸는 곳은 안쪽 점입니다. 자름선은 스스로 교차하거나 중간에 테두리를 만나지 않습니다.</p><p>보기와 같은 조각 모양은 빼고, 서로 다른 조각 모양은 모두 몇 가지인가요? 돌리거나 뒤집어 겹치는 조각은 같은 모양으로 셉니다.</p><p>보기</p>${figure(paths[excluded], '합동인 두 조각으로 나누는 보기')}</div>`;
    const gallery = paths.map((path, i) => ({ path, i })).filter(x => x.i !== excluded).map(({path}, i) => `<div><span>${i+1}</span>${figure(path, `다른 조각 모양 ${i+1}의 자름선`)}</div>`).join('');
    const solution = `<div data-source-answer="${id}"><p>테두리의 시작점과 끝점, 안쪽의 세 점을 지나는 자름선을 조건에 맞게 조사합니다. 각 조각을 돌리거나 뒤집어 짝과 겹치는지 확인합니다.</p><p>같은 조각 모양끼리 묶으면 보기를 포함해 9가지이고, 보기의 조각 모양 한 가지를 빼면 <b>8가지</b>입니다. 그림은 나머지 8가지의 자름선을 하나씩 나타냅니다.</p></div>`;
    return { prompt, solution, answer: '8가지', answerVisual: `<div data-dot-cut-answers style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;text-align:center">${gallery}</div>`, answerVisualRequired: true, answerVisualStatus: 'verified-reconstruction', sourceItemId: id, generator: key, generationMode: 'fixed-verified-pool', verifiedPoolIndex: index, verifiedVariantCount: 3, verifiedVariantTarget: 3, difficultyOffset: difficulty, difficultyLevel: difficulty + 2, difficultyRank: difficulty + 2, variantProvenance: 'synthetic-explicit-cut-contract', resultContract: 'single-count', automaticGrading: true, publisherKeyVerified: false, questionModel: { excludedPathIndex: excluded }, answerModel: { allShapes: 9, remainingShapes: 8 } };
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== 'function' || typeof api.generate !== 'function') return false;
    if (api.__source52DotCutInstalled) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === id || type.sourceItemId === id || type.generatorKey === key);
    api.generatorKey = type => matches(type) ? type.id === id && type.sourceItemId === id && type.generatorKey === key && type.reviewLocked === false && type.sourceVerified === true ? key : '' : oldKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) ? makeQuestion(variant, difficulty ?? 0) : null : oldGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, '__source52DotCutInstalled', { value: true });
    return true;
  }
  return Object.freeze({ id, key, paths, pools, figure, makeQuestion, install });
});
