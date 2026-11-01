(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.HSE_SOURCE52_U5_PACKING_PRACTICE=api;
  api.install(root);
})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u5-check108-q8-packing-synthetic",key="source52U5LayerPackingPractice";
  const cases=Object.freeze([{scale:1,layers:1},{scale:2,layers:3},{scale:1,layers:4},{scale:2,layers:5}].map(Object.freeze));
  function model(index){
    const item=cases[index];if(!item)throw new Error("검증된 연습문항 범위를 벗어났습니다.");
    const {scale:s,layers}=item, container=[25*s,20*s,(4+6*layers)*s], object=[4*s,5*s,6*s], answer=16+25*layers;
    return {scale:s,layers,container,object,answer};
  }
  function build(index){const m=model(index),[w,d,h]=m.container,[a,b,c]=m.object,volume=w*d*h,unit=a*b*c,baseHeight=4*m.scale,answer=m.answer;
    return {prompt:`<div data-source-item-id="${id}" data-pool-index="${index}"><p>가로 ${w}cm, 세로 ${d}cm, 높이 ${h}cm인 직육면체 상자에 가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 같은 물건을 겹치지 않게 최대한 많이 넣으려고 합니다. 물건의 방향을 바꾸어 넣을 수 있을 때 최대 몇 개인가요?</p></div>`,
      answer:`${answer}개`,solution:`<div data-source-answer="${id}"><p>상자의 부피는 ${w}×${d}×${h}=${volume}cm³이고 물건 한 개의 부피는 ${a}×${b}×${c}=${unit}cm³입니다. ${volume}÷${unit}에서 소수 부분을 버리면 ${answer}개를 넘을 수 없습니다.</p><p>이 개수가 실제로 가능한지 확인합니다. 맨 아래 높이 ${baseHeight}cm 층에는 물건을 ${c}cm×${b}cm×${a}cm 방향으로 놓아 4×4=16개를 넣습니다. 남은 높이는 ${c}cm짜리 ${m.layers}층이며, 각 층에는 ${b}cm×${a}cm×${c}cm 방향으로 5×5=25개씩 넣습니다.</p><p>따라서 16+25×${m.layers}=<strong>${answer}개</strong>를 넣을 수 있습니다. 부피로 구한 상한과 같으므로 최대는 ${answer}개입니다.</p></div>`,
      answerVisual:"",answerVisualRequired:false,answerVisualStatus:"not-required",answerModel:m};
  }
  function generate(type,user,difficulty,seed,variant=0){if(!type||type.id!==id||type.generatorKey!==key||!type.sourceVerified||type.reviewLocked!==false)return null;if(!Number.isSafeInteger(variant)||variant<0)throw new Error("변형 번호 오류");const index=variant%cases.length;return {...build(index),sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:index,verifiedVariantCount:4,verifiedVariantTarget:4,verifiedVariantId:`${id}:v${index}`,variantProvenance:"synthetic-different-dimensions",publisherKeyVerified:false,publisherAnswerVerified:false,answerVerification:"independent-layer-packing-and-volume-upper-bound"};}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generate!=="function"||typeof api.generatorKey!=="function")return false;if(api.__source52U5PackingPracticeInstalled)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api),matches=t=>t?.id===id||t?.sourceItemId===id||t?.generatorKey===key;api.generatorKey=t=>matches(t)?t.id===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:"":oldKey(t);api.generate=(t,u,d,s,v=0)=>matches(t)?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U5PackingPracticeInstalled",{value:true});return true;}
  return Object.freeze({id,key,cases,model,build,generate,install});
});
