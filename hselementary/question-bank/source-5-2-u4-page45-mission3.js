(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U4_PAGE45_MISSION3=api;api.install(root);})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u4-e2-mission-3",key="source52WrongDecimalDivisionRestoreProductPage45Mission3";
  const pools=Object.freeze([
    Object.freeze({divisorHundredths:1640,particle:"를",quotientTenths:32,remainderHundredths:48}),
    Object.freeze({divisorHundredths:2360,particle:"을",quotientTenths:45,remainderHundredths:72}),
    Object.freeze({divisorHundredths:3420,particle:"를",quotientTenths:28,remainderHundredths:84})
  ]);
  const fmt=(value,scale)=>{const whole=Math.floor(value/scale),rem=value%scale;if(!rem)return String(whole);return `${whole}.${String(rem).padStart(String(scale).length-1,"0").replace(/0+$/g,"")}`;};
  const decimal=value=>fmt(value,100),quotient=value=>fmt(value,10);
  const esc=value=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function calculate(pool){
    if(!pool||![pool.divisorHundredths,pool.quotientTenths,pool.remainderHundredths].every(Number.isSafeInteger)||pool.divisorHundredths<=0||pool.quotientTenths<0||pool.remainderHundredths<0)throw new TypeError("확인된 나누기 조건만 사용할 수 있습니다.");
    if(pool.remainderHundredths>=pool.divisorHundredths)throw new RangeError("나머지는 나누는 수보다 작아야 합니다.");
    const dividendHundredths=pool.divisorHundredths*pool.quotientTenths/10+pool.remainderHundredths;
    if(!Number.isSafeInteger(dividendHundredths))throw new RangeError("나누기 전 수가 백분의 일 단위로 정확히 나타나야 합니다.");
    const productNumerator=dividendHundredths*pool.divisorHundredths;
    if(!Number.isSafeInteger(productNumerator))throw new RangeError("곱셈 결과 범위를 벗어났습니다.");
    return Object.freeze({dividendHundredths,productNumerator,answer:fmt(productNumerator,10000)});
  }
  function build(poolIndex=0,difficultyOffset=0){
    if(!Number.isSafeInteger(poolIndex)||poolIndex<0||poolIndex>=pools.length)throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if(![-1,0,1].includes(difficultyOffset))throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool=pools[poolIndex],result=calculate(pool),divisor=decimal(pool.divisorHundredths),q=quotient(pool.quotientTenths),remainder=decimal(pool.remainderHundredths),dividend=decimal(result.dividendHundredths);
    const partialHundredths=pool.divisorHundredths*pool.quotientTenths/10,partial=decimal(partialHundredths);
    const prompt=`<div class="source52-u4-p45-m3-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>어떤 수에 ${divisor}${pool.particle} 곱해야 하는데 잘못하여 ${divisor}로 나누었더니 몫이 ${q}, 나머지가 ${remainder}가 되었습니다. 바르게 계산한 값은 얼마인가요?</p>${difficultyOffset<0?'<p class="source52-u4-p45-m3-hint">도움말: 먼저 나눗셈의 기본식으로 어떤 수를 구하고, 그 수에 원래 곱해야 했던 수를 곱하세요.</p>':""}</div>`;
    const solution=`<div class="source52-u4-p45-m3-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol><li>나누기 전의 수는 나누는 수×몫+나머지입니다.</li><li>${divisor}×${q}=${partial}이고, ${partial}+${remainder}=${dividend}입니다.</li><li>원래 해야 했던 곱셈은 ${dividend}×${divisor}=${result.answer}입니다.</li></ol><p class="source52-u4-p45-m3-answer">답: ${result.answer}</p></div>`;
    return Object.freeze({prompt,answer:result.answer,solution,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:pools.length,verifiedVariantTarget:pools.length,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",difficultyOffset,difficultyLevel:difficultyOffset+1,difficultyRank:difficultyOffset+1,sourceDifficultyRank:1,difficultyDesign:["guided-quotient-remainder-restoration","two-step-restoration-and-correction","independent-operation-correction"][difficultyOffset+1],reasoningSteps:3,sourceStepCount:3,difficultyStepDelta:difficultyOffset,sourceStructurePreserved:true,sourcePdfPage:41,sourcePrintedPage:45,questionModel:{divisor,quotient:q,remainder,strictRemainderCheck:pool.remainderHundredths<pool.divisorHundredths},answerModel:{restoredNumber:dividend,product:result.answer},answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"exact-hundredths-division-remainder-and-product"});
  }
  function belongs(type){return Boolean(type&&(type.id===id||type.sourceItemId===id||type.generatorKey===key));}
  function resolves(type){return Boolean(type&&type.id===id&&type.sourceItemId===id&&type.generatorKey===key&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type))return null;if(!Number.isSafeInteger(variant)||variant<0)throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");return build(variant%pools.length,[-1,0,1].includes(difficulty)?difficulty:0);}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52U4Page45Mission3Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?key:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(key))bank.names.push(key);Object.defineProperty(bank,"__source52U4Page45Mission3Installed",{value:true});return true;}
  return Object.freeze({id,key,pools,calculate,build,generate,belongs,resolves,install});
});
