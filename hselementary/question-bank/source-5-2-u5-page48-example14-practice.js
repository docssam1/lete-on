(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.HSE_SOURCE52_U5_STRING_PRACTICE=api;
  api.install(root);
})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u5-e1-example-1-4-synthetic", key="source52U5ThreeLoopPractice";
  // The synthetic examples have a different difference and rope lengths from the source.
  const heights=Object.freeze([4,5,6]);
  function model(index){
    const height=heights[index];
    if(!height)throw new Error("검증된 연습문항 범위를 벗어났습니다.");
    const width=3*height,depth=width-3,total=4*(width+depth+height);
    return {height,width,depth,total,difference:3};
  }
  function diagram(){return `<svg viewBox="0 0 400 220" role="img" aria-label="직육면체를 가로·세로, 가로·높이, 세로·높이의 세 방향으로 각각 한 바퀴 묶은 그림" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,330px);height:auto;margin:8px auto"><g fill="none" stroke="#191511" stroke-width="2" stroke-linejoin="round"><path d="M55 80H275L345 35H125Z M55 80V180H275V80 M275 180L345 135V35"/><g stroke="#191511" stroke-width="3"><path d="M55 130H275L345 85 M90 57H310V157 M160 180V80L230 35"/></g></g></svg>`;}
  function build(index){const m=model(index);return {
    prompt:`<div data-source-item-id="${id}" data-pool-index="${index}"><p>길이가 ${m.total}cm인 끈으로 상자를 그림처럼 세 방향으로 각각 한 바퀴 묶었습니다. 가로는 높이의 3배이고 세로보다 3cm 깁니다. 매듭의 길이는 무시할 때 가로는 몇 cm인가요?</p>${diagram()}</div>`,
    answer:`${m.width}cm`,
    solution:`<div data-source-answer="${id}"><p>세 방향 끈의 길이를 합하면 가로·세로·높이가 각각 네 번씩 나타납니다. 세 변의 합은 ${m.total}÷4=${m.total/4}cm입니다.</p><p>높이를 한 부분으로 보면 가로는 세 부분, 세로는 세 부분에서 3cm를 뺀 길이입니다. 따라서 일곱 부분은 ${m.total/4}+3=${m.total/4+3}cm이고 한 부분은 ${m.height}cm입니다.</p><p>가로는 ${m.height}×3=<strong>${m.width}cm</strong>입니다. 확인: 4×(${m.width}+${m.depth}+${m.height})=${m.total}cm입니다.</p></div>`,
    answerVisual:"",answerVisualRequired:false,answerVisualStatus:"not-required",answerModel:m,sourceValuesExcluded:true};}
  function generate(type,user,difficulty,seed,variant=0){
    if(!type||type.id!==id||type.generatorKey!==key||!type.sourceVerified||type.reviewLocked!==false)return null;
    if(!Number.isSafeInteger(variant)||variant<0)throw new Error("변형 번호 오류");
    const index=variant%heights.length;
    return {...build(index),sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:index,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${index}`,variantProvenance:"synthetic-different-values",publisherKeyVerified:false,publisherAnswerVerified:false,answerVerification:"independent-loop-length-and-linear-constraints"};
  }
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generate!=="function"||typeof api.generatorKey!=="function")return false;if(api.__source52U5ThreeLoopInstalled)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api),matches=t=>t?.id===id||t?.sourceItemId===id||t?.generatorKey===key;api.generatorKey=t=>matches(t)?t.id===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:"":oldKey(t);api.generate=(t,u,d,s,v=0)=>matches(t)?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U5ThreeLoopInstalled",{value:true});return true;}
  return Object.freeze({id,key,heights,model,diagram,build,generate,install});
});
