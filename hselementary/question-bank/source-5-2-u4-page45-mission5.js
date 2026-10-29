(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U4_PAGE45_MISSION5=api;api.install(root);})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u4-e2-mission-5",key="source52TwoDecimalsPointOmissionPairProductPage45Mission5";
  const pools=Object.freeze([
    Object.freeze({aHundredths:432,bHundredths:215}),
    Object.freeze({aHundredths:826,bHundredths:347}),
    Object.freeze({aHundredths:684,bHundredths:129})
  ]);
  const fmtScaled=(value,scale)=>{const whole=Math.floor(value/scale),rem=value%scale;if(!rem)return String(whole);return `${whole}.${String(rem).padStart(String(scale).length-1,"0").replace(/0+$/g,"")}`;};
  const fmtCents=value=>fmtScaled(value,100),esc=value=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function calculate(pool){
    if(!pool||![pool.aHundredths,pool.bHundredths].every(Number.isSafeInteger)||pool.aHundredths<=0||pool.bHundredths<=0)throw new TypeError("확인된 두 소수 조건만 사용할 수 있습니다.");
    if(pool.aHundredths===pool.bHundredths)throw new RangeError("서로 다른 두 수를 사용해야 합니다.");
    const sumHundredths=pool.aHundredths+pool.bHundredths;
    const omittedDifferenceHundredths=100*pool.aHundredths-pool.bHundredths;
    const productNumerator=pool.aHundredths*pool.bHundredths;
    if(![sumHundredths,omittedDifferenceHundredths,productNumerator].every(Number.isSafeInteger))throw new RangeError("계산 범위를 벗어났습니다.");
    const recoveredA=(sumHundredths+omittedDifferenceHundredths)/101;
    if(!Number.isInteger(recoveredA)||recoveredA!==pool.aHundredths)throw new RangeError("두 조건에서 가가 정확한 소수 둘째 자리 수로 정해져야 합니다.");
    const recoveredB=sumHundredths-recoveredA;
    if(recoveredB!==pool.bHundredths)throw new RangeError("두 조건에서 나가 정확한 소수 둘째 자리 수로 정해져야 합니다.");
    return Object.freeze({sumHundredths,omittedDifferenceHundredths,recoveredA,recoveredB,productNumerator,answer:fmtScaled(productNumerator,10000)});
  }
  function build(poolIndex=0,difficultyOffset=0){
    if(!Number.isSafeInteger(poolIndex)||poolIndex<0||poolIndex>=pools.length)throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if(![-1,0,1].includes(difficultyOffset))throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool=pools[poolIndex],r=calculate(pool),a=fmtCents(pool.aHundredths),b=fmtCents(pool.bHundredths),sum=fmtCents(r.sumHundredths),difference=fmtCents(r.omittedDifferenceHundredths),aTimes=fmtScaled(r.recoveredA,100),bTimes=fmtScaled(r.recoveredB,100);
    const prompt=`<div class="source52-u4-p45-m5-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>소수 둘째 자리까지 나타낸 두 수 가와 나가 있습니다. 가와 나의 합은 ${sum}입니다. 가에서 나를 뺄 때 가의 소수점을 빠뜨리고 계산했더니 ${difference}가 되었습니다. 가와 나의 곱을 구하세요.</p>${difficultyOffset<0?'<p class="source52-u4-p45-m5-hint">도움말: 가의 소수점을 빠뜨리면 가는 100배가 됩니다. 두 조건을 식으로 나타내 보세요.</p>':""}</div>`;
    const solution=`<div class="source52-u4-p45-m5-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol><li>가의 소수점을 빠뜨린 값은 100가이므로<br>가+나=${sum}, 100가−나=${difference}입니다.</li><li>두 식을 더하면 101가=${sum}+${difference}=${fmtCents(r.sumHundredths+r.omittedDifferenceHundredths)}입니다.<br>따라서 가=${fmtCents(r.sumHundredths+r.omittedDifferenceHundredths)}÷101=${aTimes}, 나=${sum}−${aTimes}=${bTimes}입니다.</li><li>가×나=${aTimes}×${bTimes}=${r.answer}입니다.</li></ol><p class="source52-u4-p45-m5-answer">답: ${r.answer}</p></div>`;
    return Object.freeze({prompt,answer:r.answer,solution,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:pools.length,verifiedVariantTarget:pools.length,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",difficultyOffset,difficultyLevel:difficultyOffset+1,difficultyRank:difficultyOffset+1,sourceDifficultyRank:1,difficultyDesign:["guided-point-omission-equation","independent-equation-combination","compact-pair-recovery-and-product"][difficultyOffset+1],reasoningSteps:3,sourceStepCount:3,difficultyStepDelta:difficultyOffset,sourceStructurePreserved:true,sourcePdfPage:41,sourcePrintedPage:45,questionModel:{sum,omittedPointDifference:difference,bothHaveHundredths:true},answerModel:{a:aTimes,b:bTimes,product:r.answer},answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"exact-hundredths-linear-equation-and-product"});
  }
  function belongs(type){return Boolean(type&&(type.id===id||type.sourceItemId===id||type.generatorKey===key));}
  function resolves(type){return Boolean(type&&type.id===id&&type.sourceItemId===id&&type.generatorKey===key&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type))return null;if(!Number.isSafeInteger(variant)||variant<0)throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");return build(variant%pools.length,[-1,0,1].includes(difficulty)?difficulty:0);}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52U4Page45Mission5Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?key:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(key))bank.names.push(key);Object.defineProperty(bank,"__source52U4Page45Mission5Installed",{value:true});return true;}
  return Object.freeze({id,key,pools,calculate,build,generate,belongs,resolves,install});
});
