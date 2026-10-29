(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_AVERAGE_PAGE58_EXAMPLE14 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId="5-2-u6-e1-example-4";
  const generatorKey="source52AverageOriginalPage58Example14";
  const pools=Object.freeze([
    Object.freeze({a:[70,80,90,96],bKnown:[88,83,92],difference:2}),
    Object.freeze({a:[72,82,86,100],bKnown:[87,86,95],difference:3}),
    Object.freeze({a:[64,76,88,92],bKnown:[82,79,90],difference:2})
  ]);
  function makeQuestion(variant=0) {
    if(!Number.isSafeInteger(variant)||variant<0)return null;
    const index=variant%pools.length,p=pools[index],[b2,b3,b5]=p.bKnown,a=p.a.reduce((x,y)=>x+y,0)/4,b=p.a[3]+a-b2,meanB=a+p.difference,c=5*meanB-b-b2-b3-b5;
    if(![a,b,c].every(x=>Number.isInteger(x)&&x>=0&&x<=100))throw new Error("점수표 조건을 확인하세요.");
    const table=`<table class="source52-p58ex14-table"><caption>두 학생의 시험 점수</caption><thead><tr><th scope="col">구분</th>${[1,2,3,4,5].map(n=>`<th scope="col">${n}회</th>`).join("")}</tr></thead><tbody><tr><th scope="row">갑</th>${p.a.map(n=>`<td>${n}점</td>`).join("")}<td>㉠</td></tr><tr><th scope="row">을</th><td>㉡</td><td>${b2}점</td><td>${b3}점</td><td>㉢</td><td>${b5}점</td></tr></tbody></table>`;
    const prompt=`<div class="source52-p58ex14-question" data-source-item-id="${sourceItemId}" data-pool-index="${index}"><p>갑과 을이 각각 다섯 번 본 시험 점수입니다. 갑의 다섯 번째 점수는 갑의 평균과 같습니다.</p><p>을의 첫 두 점수의 평균은 갑의 네 번째와 다섯 번째 점수의 평균과 같고, 을의 전체 평균은 갑보다 ${p.difference}점 높습니다. ㉢을 구하세요.</p>${table}</div>`;
    const solution=`<div class="source52-p58ex14-solution" data-source-answer="${sourceItemId}"><p>갑의 다섯 번째 점수가 전체 평균과 같으므로 앞 네 점수의 평균도 같습니다. (${p.a.join(" + ")}) ÷ 4 = ${a}점이므로 ㉠ = ${a}입니다.</p><p>두 사람의 짝지은 두 점수의 합이 같으므로 ㉡ = ${p.a[3]} + ${a} − ${b2} = ${b}입니다.</p><p>을의 평균은 ${a} + ${p.difference} = ${meanB}점이고 다섯 점수의 합은 ${meanB} × 5입니다. 따라서 ㉢ = ${meanB} × 5 − (${b} + ${b2} + ${b3} + ${b5}) = <strong>${c}</strong>점입니다.</p></div>`;
    return Object.freeze({prompt,answer:`${c}점`,solution,sourceItemId,generator:generatorKey,variant:index,variantIndex:index,poolIndex:index,verifiedPoolIndex:index,verifiedVariantId:`${sourceItemId}:synthetic:${index}`,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,variantProvenance:"synthetic-source-structure",generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-score-table-equations",questionModel:Object.freeze({a:[...p.a],bKnown:[...p.bKnown],difference:p.difference}),answerModel:Object.freeze({a,b,c})});
  }
  function install(target) {
    const api=target?.HSE_GENERATORS;
    if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function") return false;
    if(api.__source52P58OriginalExample14Installed) return true;
    const previousKey=api.generatorKey.bind(api),previousGenerate=api.generate.bind(api);
    const matches=type=>type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey);
    api.generatorKey=type=>matches(type)?type.id===sourceItemId&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.reviewLocked===false&&type.sourceVerified===true?generatorKey:"":previousKey(type);
    api.generate=(type,rank,difficulty,seed,variant=0)=>matches(type)?api.generatorKey(type)?makeQuestion(variant):null:previousGenerate(type,rank,difficulty,seed,variant);
    if(Array.isArray(api.names)&&!api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api,"__source52P58OriginalExample14Installed",{value:true});return true;
  }
  return Object.freeze({sourceItemId,generatorKey,pools,makeQuestion,install});
});
