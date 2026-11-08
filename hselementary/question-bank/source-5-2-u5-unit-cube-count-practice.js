(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.HSE_U5_UNIT_CUBE_COUNT_PRACTICE = api;
  api.install(root);
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const typeId = '5-2-u5-t1';
  const source = '5-2-u5-e1-example-1-1-unit-cubes-practice';
  const parent = '5-2-u5-e1-example-1-1';
  const key = 'source52U5UnitCubeCountPractice';
  const cases = Object.freeze([[3,2,2],[4,2,2],[5,2,2],[4,3,2],[5,3,2],[5,4,2],[4,4,3],[5,3,3],[5,5,2]].map(Object.freeze));
  function build(root, index) {
    if (!Number.isSafeInteger(index) || index < 0 || index >= cases.length) return null;
    const grid = root.HSE_SOURCE52_U5_GRID_PRACTICE;
    if (!grid || typeof grid.diagram !== 'function') return null;
    const [w,h,d] = cases[index];
    const count = w*h*d;
    return {
      prompt:`<div data-source-item-id="${source}" data-pool-index="${index}"><p>그림의 직육면체를 그어진 선을 모두 따라 잘라 같은 크기의 작은 정육면체로 나눕니다. 작은 정육면체는 모두 몇 개인가요?</p>${grid.diagram([w,h,d])}</div>`,
      answer:`${count}개`,
      solution:`<div data-source-answer="${source}"><p>앞면 한 줄에는 ${w}개, 한 층에는 ${w}×${d}=${w*d}개가 있습니다.</p><p>이런 층이 ${h}층이므로 ${w*d}×${h}=<strong>${count}개</strong>입니다.</p></div>`,
      automaticGrading:true, resultContract:'single-value', sourceItemId:source, sourceParentItemId:parent,
      generator:key, generationMode:'fixed-verified-pool', verifiedPoolIndex:index,
      verifiedVariantId:`${source}:${index}`, verifiedVariantCount:cases.length, verifiedVariantTarget:cases.length,
      sourceStructurePreserved:false, variantProvenance:'synthetic-explicit-all-grid-cuts',
      sourcePdfPage:44, sourcePrintedPage:48, publisherKeyVerified:false, publisherAnswerVerified:false,
      answerVisualRequired:false, answerVisualStatus:'not-required'
    };
  }
  function install(root) {
    const api=root?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== 'function' || typeof api.generate !== 'function') return false;
    if (api.__u5UnitCubeCountPracticeInstalled) return true;
    const oldKey=api.generatorKey.bind(api), oldGenerate=api.generate.bind(api);
    const matches=t=>t && (t.id===typeId || t.sourceItemId===source || t.generatorKey===key);
    const resolves=t=>t && t.id===typeId && t.sourceItemId===source && t.generatorKey===key && t.sourceVerified===true && t.reviewLocked===false;
    api.generatorKey=t=>matches(t) ? (resolves(t) ? key : '') : oldKey(t);
    api.generate=(t,rank,difficulty,seed,index=0)=>matches(t) ? (resolves(t) ? build(root,Number(index)) : null) : oldGenerate(t,rank,difficulty,seed,index);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api,'__u5UnitCubeCountPracticeInstalled',{value:true});
    return true;
  }
  return Object.freeze({typeId,source,parent,key,cases,build,install});
});
