(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U4_PAGE45_MISSION6=api;api.install(root);})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u4-e2-mission-6",key="source52OneDecimalFactorAndProductRangeCountPage45Mission6";
  const pools=Object.freeze([
    Object.freeze({factorTenths:35,lowerProduct:4,upperProduct:8}),
    Object.freeze({factorTenths:15,lowerProduct:2,upperProduct:7}),
    Object.freeze({factorTenths:45,lowerProduct:7,upperProduct:15})
  ]);
  const fmtScaled=(value,scale)=>{const whole=Math.floor(value/scale),rem=value%scale;if(!rem)return String(whole);return `${whole}.${String(rem).padStart(String(scale).length-1,"0").replace(/0+$/g,"")}`;};
  const fmtTenths=value=>fmtScaled(value,10),fmtHundredths=value=>fmtScaled(value,100);
  function enumerate(pool){
    if(!pool||![pool.factorTenths,pool.lowerProduct,pool.upperProduct].every(Number.isSafeInteger)||pool.factorTenths<=0||pool.lowerProduct<0||pool.lowerProduct>=pool.upperProduct)throw new TypeError("확인된 한 자리 소수와 범위만 사용할 수 있습니다.");
    const candidates=[];
    for(let n=1;n<=99;n++){
      const productHundredths=pool.factorTenths*n;
      if(n%10===0)continue;
      if(productHundredths<=pool.lowerProduct*100||productHundredths>=pool.upperProduct*100)continue;
      if(productHundredths%10!==0||productHundredths%100===0)continue;
      candidates.push(Object.freeze({n,xTenths:n,productHundredths,x:fmtTenths(n),product:fmtHundredths(productHundredths)}));
    }
    return Object.freeze(candidates);
  }
  function build(poolIndex=0,difficultyOffset=0){
    if(!Number.isSafeInteger(poolIndex)||poolIndex<0||poolIndex>=pools.length)throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if(![-1,0,1].includes(difficultyOffset))throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool=pools[poolIndex],factor=fmtTenths(pool.factorTenths),low=String(pool.lowerProduct),high=String(pool.upperProduct),candidates=enumerate(pool),xs=candidates.map(item=>item.x),products=candidates.map(item=>item.product),m=pool.factorTenths,nMin=Math.floor(pool.lowerProduct*100/m)+1,nMax=Math.ceil(pool.upperProduct*100/m)-1,ns=candidates.map(item=>item.xTenths);
    const symbol="□", object="□를", subject="□가", topic="□는";
    const prompt=`<div class="source52-u4-p45-m6-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>소수 ${factor}에 정수가 아닌 소수 한 자리 수 ${object} 곱하면 ${low}보다 크고 ${high}보다 작은 정수가 아닌 소수 한 자리 수가 됩니다. ${symbol}에 들어갈 수 있는 수는 모두 몇 개인가요?</p>${difficultyOffset<0?'<p class="source52-u4-p45-m6-hint">도움말: 가능한 수를 소수 첫째 자리씩 살펴보고, 곱한 값도 조건에 맞는지 확인해 보세요.</p>':""}</div>`;
    const solution=`<div class="source52-u4-p45-m6-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol><li>□의 10배를 자연수 n이라 하면 곱은 ${m}×n을 100으로 나눈 값입니다. 곱이 ${low}보다 크고 ${high}보다 작으므로 n은 ${nMin}부터 ${nMax}까지 살펴봅니다.</li><li>${subject} 정수가 아니려면 n이 10의 배수가 아니어야 합니다. 곱한 수도 소수 한 자리이고 정수가 아니려면 ${m}n은 10의 배수이되 100의 배수는 아니어야 합니다. 조건을 만족하는 n은 {${ns.join(", ")}}입니다.</li><li>따라서 가능한 ${topic} {${xs.join(", ")}}이고, 곱은 {${products.join(", ")}}입니다. 모두 ${candidates.length}개입니다.</li></ol><p class="source52-u4-p45-m6-answer">답: ${candidates.length}개</p></div>`;
    return Object.freeze({prompt,answer:`${candidates.length}개`,solution,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:pools.length,verifiedVariantTarget:pools.length,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",difficultyOffset,difficultyLevel:difficultyOffset+1,difficultyRank:difficultyOffset+1,sourceDifficultyRank:1,difficultyDesign:["guided-one-decimal-candidate-filter","independent-product-condition-filter","compact-exact-tenths-enumeration"][difficultyOffset+1],reasoningSteps:3,sourceStepCount:3,difficultyStepDelta:difficultyOffset,sourceStructurePreserved:true,sourcePdfPage:41,sourcePrintedPage:45,questionModel:{factor,lowerProduct:low,upperProduct:high,inputAndProductMustBeNonIntegerTenths:true},answerModel:{values:xs,products,count:candidates.length},answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"exact-integer-tenths-product-range-enumeration"});
  }
  function belongs(type){return Boolean(type&&(type.id===id||type.sourceItemId===id||type.generatorKey===key));}
  function resolves(type){return Boolean(type&&type.id===id&&type.sourceItemId===id&&type.generatorKey===key&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type))return null;if(!Number.isSafeInteger(variant)||variant<0)throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");return build(variant%pools.length,[-1,0,1].includes(difficulty)?difficulty:0);}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52U4Page45Mission6Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?key:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(key))bank.names.push(key);Object.defineProperty(bank,"__source52U4Page45Mission6Installed",{value:true});return true;}
  return Object.freeze({id,key,pools,enumerate,build,generate,belongs,resolves,install});
});
