(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE19_MISSION1=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e3-mission-1-synthetic",key="source52U2Page19Mission1",pools=Object.freeze([
    {perimeter:480,widthRatio:3,heightRatio:2},
    {perimeter:560,widthRatio:4,heightRatio:3},
    {perimeter:640,widthRatio:5,heightRatio:3}
  ]);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${esc(s)}</span>`,num=n=>n.toLocaleString("en-US");
  function derive(index){const p=pools[index],half=p.perimeter/2,parts=p.widthRatio+p.heightRatio;if(!Number.isInteger(half/parts))throw new Error("가로와 세로 길이가 자연수인지 확인하세요.");const unit=half/parts,width=p.widthRatio*unit,height=p.heightRatio*unit,area=width*height;return{p,half,parts,unit,width,height,area,answer:`${num(area)}cm²`}}
  function build(index,difficulty){const v=derive(index),p=v.p,ratio=`${p.widthRatio}/${p.heightRatio}`,ratioText=math(ratio),halfText=`${num(v.half)}cm`,width=`${num(v.width)}cm`,height=`${num(v.height)}cm`,area=v.answer;
    const prompt=`<div class="source52-p19m1-question"><p>직사각형 모양 텃밭의 둘레는 ${num(p.perimeter)}cm입니다. 가로 길이가 세로 길이의 ${ratioText}배일 때, 텃밭의 넓이는 몇 cm²인가요?</p></div>`;
    const steps=[
      `가로와 세로의 합은 둘레의 절반인 ${math(halfText)}입니다. 가로와 세로의 길이 비는 ${math(`${p.widthRatio}:${p.heightRatio}`)}입니다.`,
      `전체 ${v.parts}부분은 ${math(halfText)}이므로 한 부분은 ${math(`${num(v.half)}÷${v.parts}=${num(v.unit)}cm`)}입니다.`,
      `가로는 ${math(`${p.widthRatio}×${num(v.unit)}=${width}`)}, 세로는 ${math(`${p.heightRatio}×${num(v.unit)}=${height}`)}이므로 넓이는 ${math(`${num(v.width)}×${num(v.height)}=${area}`)}입니다.`
    ];
    if(difficulty<0)steps.unshift("둘레는 가로와 세로의 합을 두 번 더한 길이입니다.");
    return{prompt,answer:area,solution:`<span data-source-answer="${id}" class="source52-u2-solution">${steps.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${s}</span>`).join("")}</span>`,answerVisual:"",answerModel:{width:v.width,height:v.height,area:v.area,unit:"cm²",answer:area},questionModel:{kind:"rectangle-perimeter-and-side-ratio-area",sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["guided-perimeter-ratio-parts","standard-side-ratio-calculation","efficient-ratio-unit-and-product"][d+1],reasoningSteps:d<0?4:3,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.19 Mission 1; source image + Apple Vision OCR and direct visual fraction cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-exact-rectangle-perimeter-side-ratio-area"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page19Mission1Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page19Mission1Installed",{value:true});return true}
  return Object.freeze({id,key,pools,derive,build,generate,install});
});
