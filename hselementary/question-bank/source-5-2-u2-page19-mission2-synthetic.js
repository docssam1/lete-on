(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE19_MISSION2=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e3-mission-2-synthetic",key="source52U2Page19Mission2",pools=Object.freeze([
    {train:[3,4],bus:[1,2],walk:[3,1]},
    {train:[5,6],bus:[2,5],walk:[21,5]},
    {train:[7,8],bus:[1,3],walk:[5,1]}
  ]);
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),frac=(n,d)=>{if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0)throw new Error("분수 계산을 확인하세요.");const g=gcd(n,d);return{n:n/g,d:d/g}},add=(a,b)=>frac(a.n*b.d+b.n*a.d,a.d*b.d),sub=(a,b)=>frac(a.n*b.d-b.n*a.d,a.d*b.d),mul=(a,b)=>frac(a.n*b.n,a.d*b.d),div=(a,b)=>frac(a.n*b.d,a.d*b.n),fmt=x=>x.d===1?x.n.toLocaleString("en-US"):x.n>x.d?`${Math.floor(x.n/x.d).toLocaleString("en-US")} ${x.n%x.d}/${x.d}`:`${x.n}/${x.d}`,esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${esc(s)}</span>`;
  function derive(index){const p=pools[index],train=frac(...p.train),bus=frac(...p.bus),walk=frac(...p.walk),walkShare=mul(sub(frac(1,1),train),sub(frac(1,1),bus)),total=div(walk,walkShare),ride=sub(total,walk);if(total.d!==1||ride.n<=0)throw new Error("전체 거리와 기차·버스 거리를 확인하세요.");return{p,train,bus,walk,walkShare,total,ride,answer:`${fmt(ride)}km`}}
  function build(index,difficulty){const v=derive(index),p=v.p,train=fmt(v.train),bus=fmt(v.bus),walk=fmt(v.walk),walkShare=fmt(v.walkShare),total=fmt(v.total),ride=fmt(v.ride);
    const prompt=`<div class="source52-p19m2-question"><p>하준이는 공원까지 가는 전체 거리의 ${math(train)}을 지하철로 갔습니다. 남은 거리의 ${math(bus)}는 버스로 가고, 그 밖의 ${math(`${walk}km`)}는 걸었습니다. 지하철과 버스로 이동한 거리는 합하여 몇 km인가요?</p></div>`;
    const steps=difficulty<0?[
      `지하철을 탄 뒤 남은 비율은 ${math(`1−${train}=${fmt(sub(frac(1,1),v.train))}`)}입니다. 그 남은 거리에서 버스를 타고 남은 비율은 전체의 ${math(`${fmt(sub(frac(1,1),v.train))}×(1−${bus})=${walkShare}`)}입니다.`,
      `걸은 ${math(`${walk}km`)}가 전체의 ${math(walkShare)}이므로 전체 거리는 ${math(`${walk}÷${walkShare}=${total}km`)}입니다. 지하철과 버스 거리는 ${math(`${total}−${walk}=${ride}km`)}입니다.`
    ]:difficulty===0?[
      `걸은 거리는 전체의 ${math(`(1−${train})×(1−${bus})=${walkShare}`)}입니다. 따라서 전체 거리는 ${math(`${walk}÷${walkShare}=${total}km`)}입니다.`,
      `지하철과 버스가 이동한 거리의 합은 전체에서 걸은 거리를 뺀 값이므로 ${math(`${total}−${walk}=${ride}km`)}입니다.`
    ]:[
      `걸은 비율은 전체의 ${math(`(1−${train})×(1−${bus})=${walkShare}`)}입니다.`,
      `전체 거리는 ${math(`${walk}÷${walkShare}=${total}km`)}, 지하철과 버스 거리의 합은 ${math(`${total}−${walk}=${ride}km`)}입니다.`

    ];
    return{prompt,answer:v.answer,solution:`<span data-source-answer="${id}" class="source52-u2-solution">${steps.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${s}</span>`).join("")}</span>`,answerVisual:"",answerModel:{numerator:v.ride.n,denominator:v.ride.d,totalNumerator:v.total.n,totalDenominator:v.total.d,unit:"km",answer:v.answer},questionModel:{kind:"successive-travel-fractions-and-remainder",sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["guided-successive-remainder","standard-walked-remainder-inversion","efficient-total-minus-walked-distance"][d+1],reasoningSteps:2,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.19 Mission 2; Apple Vision OCR + direct visual fraction cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-exact-successive-travel-ratios"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page19Mission2Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page19Mission2Installed",{value:true});return true}
  return Object.freeze({id,key,pools,derive,generate,build,install});
});
