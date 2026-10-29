(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U4_PAGE45_MISSION4=api;api.install(root);})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u4-e2-mission-4",key="source52SameDirectionSpeedDistanceGapPage45Mission4";
  const pools=Object.freeze([
    Object.freeze({carSpeedCents:7260,busPer15Cents:1920,durationMinutes:150}),
    Object.freeze({carSpeedCents:8130,busPer15Cents:2160,durationMinutes:180}),
    Object.freeze({carSpeedCents:10470,busPer15Cents:2730,durationMinutes:120})
  ]);
  const fmtCents=value=>{const whole=Math.floor(value/100),rem=value%100;if(!rem)return String(whole);return `${whole}.${String(rem).padStart(2,"0").replace(/0+$/g,"")}`;};
  const fmtDuration=m=>`${Math.floor(m/60)}시간${m%60?` ${m%60}분`:""}`;
  const esc=value=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function calculate(pool){
    if(!pool||![pool.carSpeedCents,pool.busPer15Cents,pool.durationMinutes].every(Number.isSafeInteger)||pool.carSpeedCents<=0||pool.busPer15Cents<=0||pool.durationMinutes<=0||pool.durationMinutes%6!==0)throw new TypeError("확인된 속력과 시간 조건만 사용할 수 있습니다.");
    const busHourlyCents=pool.busPer15Cents*4;
    if(busHourlyCents<=pool.carSpeedCents)throw new RangeError("같은 방향 거리 차 계산에서는 버스가 더 빠른 풀만 사용할 수 있습니다.");
    const carNumerator=pool.carSpeedCents*pool.durationMinutes,busNumerator=busHourlyCents*pool.durationMinutes;
    if(carNumerator%60||busNumerator%60)throw new RangeError("이동 거리는 정확히 0.01km 단위로 나타나야 합니다.");
    const carDistanceCents=carNumerator/60,busDistanceCents=busNumerator/60,gapCents=busDistanceCents-carDistanceCents;
    return Object.freeze({busHourlyCents,carDistanceCents,busDistanceCents,gapCents,hoursTenths:pool.durationMinutes/6,answer:fmtCents(gapCents)});
  }
  function build(poolIndex=0,difficultyOffset=0){
    if(!Number.isSafeInteger(poolIndex)||poolIndex<0||poolIndex>=pools.length)throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if(![-1,0,1].includes(difficultyOffset))throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const p=pools[poolIndex],r=calculate(p),car=fmtCents(p.carSpeedCents),bus15=fmtCents(p.busPer15Cents),busHour=fmtCents(r.busHourlyCents),duration=fmtDuration(p.durationMinutes),hours=fmtCents(r.hoursTenths*10);
    const prompt=`<div class="source52-u4-p45-m4-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>승용차는 1시간에 ${car}km를 달리고, 버스는 15분에 ${bus15}km를 달립니다. 두 탈것이 동시에 같은 곳에서 같은 방향으로 출발하여 각각 일정한 속력으로 달립니다. ${duration} 후 승용차와 버스 사이의 거리는 몇 km인가요?</p>${difficultyOffset<0?'<p class="source52-u4-p45-m4-hint">도움말: 버스가 1시간 동안 가는 거리와 두 탈것이 달린 시간을 각각 시간 단위로 바꾸세요.</p>':""}</div>`;
    const solution=`<div class="source52-u4-p45-m4-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol><li>버스는 1시간에 ${bus15}×4=${busHour}km를 갑니다.</li><li>${duration}=${p.durationMinutes}÷60=${hours}시간입니다.</li><li>승용차는 ${car}×${hours}=${fmtCents(r.carDistanceCents)}km, 버스는 ${busHour}×${hours}=${fmtCents(r.busDistanceCents)}km를 갑니다.</li><li>두 이동 거리의 차는 ${fmtCents(r.busDistanceCents)}−${fmtCents(r.carDistanceCents)}=${r.answer}km입니다.</li></ol><p class="source52-u4-p45-m4-answer">답: ${r.answer}km</p></div>`;
    return Object.freeze({prompt,answer:`${r.answer}km`,solution,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:pools.length,verifiedVariantTarget:pools.length,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",difficultyOffset,difficultyLevel:difficultyOffset+1,difficultyRank:difficultyOffset+1,sourceDifficultyRank:1,difficultyDesign:["guided-rate-and-time-conversion","separate-distance-calculation","independent-relative-distance"][difficultyOffset+1],reasoningSteps:4,sourceStepCount:4,difficultyStepDelta:difficultyOffset,sourceStructurePreserved:true,sourcePdfPage:41,sourcePrintedPage:45,questionModel:{carSpeed:car,busDistancePer15Minutes:bus15,busHourlySpeed:busHour,durationMinutes:p.durationMinutes,duration:fmtDuration(p.durationMinutes),sameDirection:true},answerModel:{carDistance:fmtCents(r.carDistanceCents),busDistance:fmtCents(r.busDistanceCents),distanceGap:r.answer},answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"exact-cent-speed-time-and-relative-distance"});
  }
  function belongs(type){return Boolean(type&&(type.id===id||type.sourceItemId===id||type.generatorKey===key));}
  function resolves(type){return Boolean(type&&type.id===id&&type.sourceItemId===id&&type.generatorKey===key&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type))return null;if(!Number.isSafeInteger(variant)||variant<0)throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");return build(variant%pools.length,[-1,0,1].includes(difficulty)?difficulty:0);}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52U4Page45Mission4Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?key:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(key))bank.names.push(key);Object.defineProperty(bank,"__source52U4Page45Mission4Installed",{value:true});return true;}
  return Object.freeze({id,key,pools,calculate,build,generate,belongs,resolves,install});
});
