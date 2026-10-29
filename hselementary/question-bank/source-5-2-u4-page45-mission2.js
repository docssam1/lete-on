(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE45_MISSION2 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u4-e2-mission-2";
  const key = "source52HundredthsDigitBetweenProductsPage45Mission2";
  const pools = Object.freeze([
    Object.freeze({ lowerHundredths:124, lowerFactor:12, upperHundredths:132, upperFactor:14 }),
    Object.freeze({ lowerHundredths:117, lowerFactor:16, upperHundredths:131, upperFactor:19 }),
    Object.freeze({ lowerHundredths:136, lowerFactor:14, upperHundredths:127, upperFactor:18 })
  ]);
  const fmtHundredths = value => `${Math.floor(value/100)}.${String(value%100).padStart(2,"0")}`;
  const andParticle = value => [0,1,3,6,7,8].includes(value%10) ? "과" : "와";
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  function calculate(pool) {
    if (!pool || ![pool.lowerHundredths,pool.lowerFactor,pool.upperHundredths,pool.upperFactor].every(Number.isSafeInteger) || pool.lowerHundredths<=0 || pool.upperHundredths<=0 || pool.lowerFactor<=0 || pool.upperFactor<=0) throw new TypeError("확인된 양 끝 곱셈 조건만 사용할 수 있습니다.");
    const lower=pool.lowerHundredths*pool.lowerFactor, upper=pool.upperHundredths*pool.upperFactor;
    if (lower>=upper) throw new RangeError("아래 경계는 위 경계보다 작아야 합니다.");
    const candidates=[];
    for(let hundredths=lower+1;hundredths<upper;hundredths+=1) if(hundredths%10===8)candidates.push(hundredths);
    if(!candidates.length) throw new RangeError("범위 안에 조건에 맞는 두 자리 소수가 있어야 합니다.");
    return Object.freeze({lower,upper,first:candidates[0],last:candidates[candidates.length-1],count:candidates.length,candidates:Object.freeze(candidates)});
  }
  function build(poolIndex=0,difficultyOffset=0){
    if(!Number.isSafeInteger(poolIndex)||poolIndex<0||poolIndex>=pools.length)throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if(![-1,0,1].includes(difficultyOffset))throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool=pools[poolIndex], result=calculate(pool);
    const lowerExpression=`${fmtHundredths(pool.lowerHundredths)}×${pool.lowerFactor}=${fmtHundredths(result.lower)}`;
    const upperExpression=`${fmtHundredths(pool.upperHundredths)}×${pool.upperFactor}=${fmtHundredths(result.upper)}`;
    const prompt=`<div class="source52-u4-p45-m2-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${esc(`${fmtHundredths(pool.lowerHundredths)}×${pool.lowerFactor}`)}${andParticle(pool.lowerFactor)} ${esc(`${fmtHundredths(pool.upperHundredths)}×${pool.upperFactor}`)} 사이에 있는 <strong>소수 둘째 자리까지 나타낸 수</strong> 중에서 소수 둘째 자리의 숫자가 8인 수는 모두 몇 개인가요?</p><p class="source52-u4-p45-m2-boundary">양 끝값은 포함하지 않습니다.</p>${difficultyOffset<0?'<p class="source52-u4-p45-m2-hint">도움말: 조건에 맞는 수는 0.10씩 커집니다. 가장 작은 수와 가장 큰 수를 먼저 찾아 보세요.</p>':""}</div>`;
    const solution=`<div class="source52-u4-p45-m2-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol><li>${esc(lowerExpression)}이고 ${esc(upperExpression)}입니다.</li><li>범위 안에서 조건에 맞는 첫 수는 ${fmtHundredths(result.first)}이고, 마지막 수는 ${fmtHundredths(result.last)}입니다. 그 사이에서 0.10씩 커집니다.</li><li>수의 개수는 (${fmtHundredths(result.last)}−${fmtHundredths(result.first)})÷0.10+1=${result.count}입니다.</li></ol><p class="source52-u4-p45-m2-answer">답: ${result.count}개</p></div>`;
    return Object.freeze({prompt,answer:`${result.count}개`,solution,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:pools.length,verifiedVariantTarget:pools.length,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",difficultyOffset,difficultyLevel:difficultyOffset+1,difficultyRank:difficultyOffset+1,sourceDifficultyRank:1,difficultyDesign:["guided-first-and-last-candidates","independent-boundary-count","compact-counting-expression"][difficultyOffset+1],reasoningSteps:3,sourceStepCount:3,difficultyStepDelta:difficultyOffset,sourceStructurePreserved:true,sourcePdfPage:41,sourcePrintedPage:45,questionModel:{lowerExpression,upperExpression,lowerHundredths:result.lower,upperHundredths:result.upper,firstCandidate:result.first,lastCandidate:result.last,candidateCount:result.count,strictBounds:true,hundredthsDigit:8},answerModel:{count:result.count,first:fmtHundredths(result.first),last:fmtHundredths(result.last),stepHundredths:10},answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"exact-integer-hundredths-strict-interval-count"});
  }
  function belongs(type){return Boolean(type&&(type.id===id||type.sourceItemId===id||type.generatorKey===key));}
  function resolves(type){return Boolean(type&&type.id===id&&type.sourceItemId===id&&type.generatorKey===key&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type))return null;if(!Number.isSafeInteger(variant)||variant<0)throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");return build(variant%pools.length,[-1,0,1].includes(difficulty)?difficulty:0);}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52U4Page45Mission2Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?key:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(key))bank.names.push(key);Object.defineProperty(bank,"__source52U4Page45Mission2Installed",{value:true});return true;}
  return Object.freeze({id,key,pools,calculate,build,generate,belongs,resolves,install});
});
