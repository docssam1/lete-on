(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE18_EXAMPLE32=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e3-example-2-synthetic",key="source52U2Page18Example32",pools=Object.freeze([
    {grade5:[1,4],boys:[3,5],girls:120,awardBoys:36},
    {grade5:[2,9],boys:[5,8],girls:90,awardBoys:45},
    {grade5:[3,10],boys:[7,12],girls:100,awardBoys:32}
  ]);
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),frac=(n,d)=>{if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0)throw new Error("분수 계산을 확인하세요.");const g=gcd(n,d);return{n:n/g,d:d/g}},fmt=x=>x.d===1?String(x.n):`${x.n}/${x.d}`;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${esc(s)}</span>`;
  function derive(index){const p=pools[index],grade5=frac(p.girls*p.boys[1],p.boys[1]-p.boys[0]);if(grade5.d!==1)throw new Error("5학년 여학생 수로 전체 5학년 회원 수를 구할 수 없습니다.");const school=frac(grade5.n*p.grade5[1],p.grade5[0]);if(school.d!==1)throw new Error("전체 회원 수가 자연수가 아닙니다.");if(p.awardBoys>grade5.n-p.girls)throw new Error("참가자 수가 남학생 수보다 큽니다.");const answer=frac(p.awardBoys,school.n);return{p,grade5,school,answer,text:fmt(answer)}}
  function build(index,difficulty){const v=derive(index),p=v.p,girlsFraction=frac(p.boys[1]-p.boys[0],p.boys[1]),grade5Fraction=frac(...p.grade5),answer=v.answer;
    const prompt=`<div class="source52-p18e32-question"><p>어린이 문화센터 회원의 ${math(fmt(grade5Fraction))}이 5학년입니다. 5학년 회원 중 ${math(fmt(frac(...p.boys)))}는 남학생이고, 여학생은 ${p.girls}명입니다. 5학년 남학생 중 ${p.awardBoys}명이 발표회에 참가했다면, 전체 회원 중 이 참가자가 차지하는 비율을 분수로 나타내세요.</p></div>`;
    const girlEquation=`1−${fmt(frac(...p.boys))}=${fmt(girlsFraction)}`;
    const steps=difficulty<0?[
      `5학년 여학생 비율은 ${math(girlEquation)}입니다. 여학생 ${p.girls}명이 5학년의 ${math(fmt(girlsFraction))}이므로 5학년 회원 수는 ${math(`${p.girls}÷${fmt(girlsFraction)}=${v.grade5.n}명`)}입니다.`,
      `5학년은 전체의 ${math(fmt(grade5Fraction))}이므로 전체 회원 수는 ${math(`${v.grade5.n}÷${fmt(grade5Fraction)}=${v.school.n}명`)}입니다. 따라서 구하는 비율은 ${math(`${p.awardBoys}/${v.school.n}=${fmt(answer)}`)}입니다.`
    ]:difficulty===0?[
      `5학년 여학생 비율은 ${math(girlEquation)}입니다. 따라서 5학년 회원 수는 ${math(`${p.girls}÷${fmt(girlsFraction)}=${v.grade5.n}명`)}입니다.`,
      `전체 회원 수는 ${math(`${v.grade5.n}÷${fmt(grade5Fraction)}=${v.school.n}명`)}입니다. 구하는 비율은 ${math(`${p.awardBoys}/${v.school.n}=${fmt(answer)}`)}입니다.`
    ]:[
      `5학년 여학생 비율은 ${math(fmt(girlsFraction))}이므로 전체 회원 수는 ${math(`${p.girls}÷${fmt(girlsFraction)}÷${fmt(grade5Fraction)}=${v.school.n}명`)}입니다.`,
      `따라서 발표회에 참가한 5학년 남학생의 전체 회원 중 비율은 ${math(`${p.awardBoys}/${v.school.n}=${fmt(answer)}`)}입니다.`
    ];
    return{prompt,answer:fmt(answer),solution:`<span data-source-answer="${id}" class="source52-u2-solution">${steps.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${s}</span>`).join("")}</span>`,answerVisual:"",answerModel:{numerator:answer.n,denominator:answer.d,unit:"",answer:fmt(answer)},questionModel:{kind:"nested-population-fractions-and-subgroup-count",sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["guided-nested-population-counts","standard-part-to-whole-fraction","efficient-nested-ratio-composition"][d+1],reasoningSteps:2,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.18 Example 3-2; PDF p.14; Apple Vision OCR + direct visual source cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-exact-nested-population-ratio"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page18Example32Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page18Example32Installed",{value:true});return true}
  return Object.freeze({id,key,pools,derive,build,generate,install});
});
