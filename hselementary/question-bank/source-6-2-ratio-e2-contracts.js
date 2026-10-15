(function(root,factory){"use strict";if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-ratio-e2-models.js"),require("./source-6-2-ratio-e1-models.js"));else root.HSE_SOURCE_GRADE6_RATIO_E2_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_RATIO_E2_MODELS,root.HSE_SOURCE_GRADE6_RATIO_E1_MODELS);})(typeof window!=="undefined"?window:globalThis,function(models,math){
 "use strict";
 const f=math.fmt,r=a=>a.join(":"),decimal=a=>{const exact=math.rat(...a);let denominator=exact[1];while(denominator%2===0)denominator/=2;while(denominator%5===0)denominator/=5;return denominator===1?String(math.value(exact)):f(exact);},freeze=o=>{if(o&&typeof o==="object"&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o);}return o;},icons=["①","②","③","④"];
 const changes={
  exploration:["비례식 두 개만 계산합니다.","비례식 네 개와 두 막대의 조건을 모두 사용합니다.","다섯 답을 구한 뒤 네 빈칸의 크기를 비교합니다."],
  "example-1":["▲의 값을 주어 ■를 구합니다.","두 비례식을 연결하여 두 수의 합을 구합니다.","두 수의 합과 두 수의 비를 모두 구합니다."],
  "example-2":["보폭의 비와 같은 걸음 수로 이동 거리를 구합니다.","보폭과 같은 시간에 걷는 걸음 수를 함께 사용합니다.","두 사람이 걸은 거리의 합에서 한 사람의 거리를 구합니다."],
  "example-3":["각 병에서 마신 양의 비율을 바로 줍니다.","처음 양과 남은 양에서 마신 비율을 각각 구합니다.","들이의 비와 두 병의 들이를 각각 구합니다."],
  "example-4":["전체 평균과의 차를 바로 비교합니다.","두 반 평균과 전체 평균에서 학생 수의 비를 구합니다.","두 반 학생 수의 차를 더해 각 반 학생 수까지 구합니다."],
  "mission-1":["공통 빈칸의 값을 주어 ♥를 구합니다.","첫 비례식에서 빈칸을 구해 둘째 비례식에 넣습니다.","♥를 구한 뒤 공통 빈칸과의 합도 구합니다."],
  "mission-2":["할인 뒤 남는 가격의 비율을 바로 줍니다.","할인 비율과 할인 가격의 관계에서 정가의 비를 구합니다.","정가의 합에서 각각의 가격까지 구합니다."],
  "mission-3":["두 도형의 넓이를 수로 줍니다.","넓이의 비와 겹친 부분의 비율을 연결합니다.","겹친 비율과 겹치지 않은 두 부분의 넓이의 비를 구합니다."],
  "mission-4":["쓰고 남은 돈의 비율을 바로 줍니다.","쓴 돈의 비율에서 남은 돈의 비율을 먼저 구합니다.","처음 돈의 비와 각각의 금액을 모두 구합니다."],
  "mission-5":["새는 물의 양을 바로 줍니다.","수도와 구멍의 물의 양의 비에서 남은 물을 구합니다.","수도를 잠근 뒤 구멍으로 물만 빠지는 단계를 더합니다."],
  "mission-6":["현재 마릿수와 각각의 늘어나는 비율을 줍니다.","1분 전과 현재 마릿수에서 각각의 늘어나는 비율을 구합니다.","각각의 늘어나는 비율을 구해 두 번 연달아 적용합니다."]
 };
 function linear(e){const[a,b,c,d,p,q]=e,term=(co,constant)=>`${f(co)} × □ ${constant[0]<0?"-":"+"} ${f([Math.abs(constant[0]),constant[1]])}`;return `${term(a,b)} : ${term(c,d)} = ${f(p)} : ${f(q)}`;}
 function generate(id,variant=0,level=1){
  const model=models.solve(id,variant,level),d=model.givens,x=model.facts,k=model.kind,parts=[],steps=[],visible={};
  if(k==="exploration"){
   const equationLines=d.equations.map((e,i)=>i===0?`${f(e[1])} : ${decimal(e[3])} = ${f(e[4])} : ( ${f(e[5])} + □ )`:linear(e));
   parts.push("(1) 다음 비례식에서 □ 안에 알맞은 수를 각각 구하시오.",...equationLines.slice(0,level===0?2:4).map((line,i)=>`${icons[i]} ${line}`));visible.equations=equationLines.slice(0,level===0?2:4);
   if(level!==0){parts.push(`(2) 길이의 차가 ${d.rodDifference} cm인 두 막대 ㉮와 ㉯를 깊이가 일정한 연못의 바닥에 수직으로 세웠습니다. 꺼냈더니 ㉮는 전체 길이의 ${f(d.wet[0])}, ㉯는 전체 길이의 ${f(d.wet[1])}만큼 물에 젖었습니다. 연못의 깊이는 몇 cm입니까?`);visible.rodDifference=d.rodDifference;visible.wetFractions=d.wet;}
   if(level===2)parts.push("(3) (1)의 네 빈칸 중 가장 큰 수가 들어가는 것의 번호를 쓰시오.");
   x.blankValues.slice(0,level===0?2:4).forEach((v,i)=>{
    if(i===0){const e=d.equations[0];steps.push(`(1) ① □ = ${f(e[4])} × ${decimal(e[3])} ÷ ${f(e[1])} - ${f(e[5])} = ${f(v)}`);return;}
    const[a,b,c,constant,p,q]=d.equations[i],coefficient=math.sub(math.mul(q,a),math.mul(p,c)),rhs=math.sub(math.mul(p,constant),math.mul(q,b)),positive=coefficient[0]>0,co=positive?coefficient:math.mul(coefficient,[-1,1]),amount=positive?rhs:math.mul(rhs,[-1,1]);
    steps.push(`(1) ${icons[i]} 같은 빈칸이 들어간 항끼리 모으면 ${f(co)} × □ = ${f(amount)}입니다.`, `□ = ${f(amount)} ÷ ${f(co)} = ${f(v)}`);
   });
   if(level!==0)steps.push(`(2) 두 막대 길이의 비는 ${f(math.div([1,1],d.wet[0]))} : ${f(math.div([1,1],d.wet[1]))}입니다.`, `연못의 깊이는 ${d.rodDifference} ÷ (${f(math.div([1,1],d.wet[1]))} - ${f(math.div([1,1],d.wet[0]))}) = ${f(x.depth)} cm입니다.`);
   if(level===2)steps.push(`(3) 가장 큰 수가 들어가는 빈칸은 ${icons[model.responses.at(-1).value-1]}입니다.`);
  }else if(k==="example-1"){
   const[a,b,c]=d.first;parts.push("▲와 ■에 알맞은 수를 구하여 ▲ + ■의 값을 구하시오.",level===0?`▲ = ${f(x.triangle)}`:`${a} : ${b} = ${c} : ▲`,`■ : ▲ = ${decimal(d.second[0])} : ${decimal(d.second[1])}`);if(level===2)parts.push("▲ : ■도 간단한 자연수의 비로 나타내시오.");Object.assign(visible,level===0?{triangle:x.triangle}:{first:d.first},{second:d.second});
   steps.push(`▲ = ${f(x.triangle)}, ■ = ${f(x.square)}이므로 ▲ + ■ = ${f(math.add(x.triangle,x.square))}입니다.`);if(level===2)steps.push(`▲ : ■ = ${r(model.responses[1].value)}`);
  }else if(k==="example-2"){
   parts.push(`민지가 ${d.stride[0]}걸음으로 걷는 거리를 서인이는 ${d.stride[1]}걸음으로 걷습니다.`,level===0?"두 사람이 같은 걸음 수를 걸었습니다.":`서인이가 ${d.steps[1]}걸음 걸을 동안 민지는 ${d.steps[0]}걸음을 걷습니다.`,level===2?`같은 시간 동안 두 사람이 걸은 거리의 합은 ${f(x.totalDistance)} km입니다. 서인이는 몇 km를 걸었습니까?`:`민지가 ${decimal(d.minjiDistance)} km를 걸을 때 서인이는 몇 km를 걸었습니까?`,"두 사람의 보폭과 걷는 빠르기는 각각 일정합니다.");
   const dist=level===0?math.mul(d.minjiDistance,math.rat(...d.stride)):x.seoinDistance;
   // Easy uses the same-step-count premise, not the source's time-step ratio.
   if(level===0){steps.push(`서인이의 한 걸음은 민지의 ${f(math.rat(...d.stride))}입니다. ${decimal(d.minjiDistance)} × ${f(math.rat(...d.stride))} = ${f(dist)} km입니다.`);}else steps.push(`같은 시간 동안 걸은 거리의 비는 민지 : 서인 = ${r(math.ratio([1,1],x.seoinToMinji))}입니다.`, `서인이가 걸은 거리는 ${f(x.seoinDistance)} km입니다.`);
   Object.assign(visible,{stride:d.stride},level===0?{sameStepCount:true,minjiDistance:d.minjiDistance}:{steps:d.steps,...(level===2?{totalDistance:x.totalDistance}:{minjiDistance:d.minjiDistance})});
  }else if(k==="example-3"){
   parts.push("크기가 다른 병 ㉮와 ㉯가 있습니다.",level===0?`㉮에서 전체 들이의 ${f(x.drankFractions[0])}, ㉯에서 전체 들이의 ${f(x.drankFractions[1])}만큼 주스를 마셨습니다. 마신 양은 같습니다.`:`처음 주스의 양은 ㉮가 전체 들이의 ${f(d.initial[0])}, ㉯가 전체 들이의 ${decimal(math.mul(d.initial[1],[100,1]))}%입니다. 두 병에서 같은 양을 마셨더니 ㉮에는 전체 들이의 ${f(d.remaining[0])}, ㉯에는 전체 들이의 ${f(d.remaining[1])}만큼 남았습니다.`,"㉮와 ㉯의 들이의 비를 간단한 자연수의 비로 나타내시오.");
   if(level===2)parts.push(`두 병 들이의 합이 ${d.totalCapacity} mL일 때, 각각의 들이도 구하시오.`);Object.assign(visible,level===0?{drankFractions:x.drankFractions}:{initial:d.initial,remaining:d.remaining},level===2?{totalCapacity:d.totalCapacity}:{});
   steps.push(`마신 양은 각각 전체 들이의 ${f(x.drankFractions[0])}, ${f(x.drankFractions[1])}입니다. 마신 양이 같으므로 들이의 비는 ${r(x.capacityRatio)}입니다.`);if(level===2)steps.push(`㉮는 ${f(x.capacities[0])} mL, ㉯는 ${f(x.capacities[1])} mL입니다.`);
  }else if(k==="example-4"){
   parts.push(level===0?`두 반 전체 평균보다 A반 평균은 ${decimal(x.deviations[0])}점 낮고, B반 평균은 ${decimal(x.deviations[1])}점 높습니다.`:`A반과 B반의 영어 평균은 각각 ${d.means[0]}점, ${d.means[1]}점이고 두 반 전체 평균은 ${decimal(d.whole)}점입니다.`,"A반과 B반 학생 수의 비를 간단한 자연수의 비로 나타내시오.");if(level===2)parts.push(`A반은 B반보다 학생이 ${d.countDifference}명 더 많습니다. 각 반의 학생 수도 구하시오.`);Object.assign(visible,level===0?{deviations:x.deviations}:{means:d.means,whole:d.whole},level===2?{countDifference:d.countDifference}:{});
   steps.push(`전체 평균과의 차는 A반 ${decimal(x.deviations[0])}점, B반 ${decimal(x.deviations[1])}점입니다.`, `학생 수는 차와 반대의 비이므로 ${f(x.deviations[1])} : ${f(x.deviations[0])} = ${r(x.countRatio)}입니다.`);if(level===2)steps.push(`A반은 ${x.counts[0]}명, B반은 ${x.counts[1]}명입니다.`);
  }else if(k==="mission-1"){
   parts.push("두 비례식의 □에는 같은 수가 들어갑니다. ♥에 알맞은 수를 구하시오.",level===0?`□ = ${f(x.blank)}`:`${decimal(d.first[0])} : □ = ${decimal(d.first[1])} : ${decimal(d.first[2])}`,`□ : ${decimal(d.second[0])} = ${decimal(d.second[1])} : ♥`);if(level===2)parts.push("□ + ♥의 값도 구하시오.");Object.assign(visible,level===0?{blank:x.blank}:{first:d.first},{second:d.second});steps.push(`□ = ${f(x.blank)}, ♥ = ${f(x.heart)}입니다.`);if(level===2)steps.push(`□ + ♥ = ${f(model.responses[1].value)}`);
  }else if(k==="mission-2"){
   parts.push(level===0?`할인한 수박 가격은 정가의 ${f(x.remaining[0])}, 할인한 파인애플 가격은 정가의 ${f(x.remaining[1])}입니다.`:`수박 한 통은 정가에서 ${decimal(math.mul(d.discount[0],[100,1]))}% 할인하고, 파인애플 한 개는 정가의 ${f(d.discount[1])}만큼 할인했습니다.`,`할인한 수박 가격은 할인한 파인애플 가격의 ${d.saleMultiple}배입니다. 수박과 파인애플의 정가의 비를 간단한 자연수의 비로 나타내시오.`);if(level===2)parts.push(`두 정가의 합이 ${d.totalPrice}원일 때 각각의 정가도 구하시오.`);Object.assign(visible,level===0?{remaining:x.remaining}:{discount:d.discount},{saleMultiple:d.saleMultiple},level===2?{totalPrice:d.totalPrice}:{});steps.push(`할인 뒤 가격은 각각 정가의 ${f(x.remaining[0])}, ${f(x.remaining[1])}입니다.`, `정가의 비는 (${d.saleMultiple} × ${f(x.remaining[1])}) : ${f(x.remaining[0])} = ${r(x.originalRatio)}입니다.`);if(level===2)steps.push(`수박 ${f(x.prices[0])}원, 파인애플 ${f(x.prices[1])}원입니다.`);
  }else if(k==="mission-3"){
   parts.push(level===0?`그림의 직각삼각형 ㉮와 정사각형 ㉯의 넓이는 각각 ${d.areaRatio[0]} cm², ${d.areaRatio[1]} cm²입니다.`:`그림의 직각삼각형 ㉮와 정사각형 ㉯의 넓이의 비는 ${r(d.areaRatio)}입니다.`,`겹친 부분의 넓이가 ㉮ 넓이의 ${f(d.overlapOfTriangle)}일 때, 겹친 부분의 넓이는 ㉯ 넓이의 몇 %입니까?`);if(level===2)parts.push("겹치지 않은 ㉮ 부분과 겹치지 않은 ㉯ 부분의 넓이의 비도 구하시오.");Object.assign(visible,{areaRatio:d.areaRatio,overlapOfTriangle:d.overlapOfTriangle});steps.push(`㉯의 넓이를 1로 보면 ㉮는 ${f(x.triangleArea)}이고, 겹친 부분은 ${f(x.triangleArea)} × ${f(d.overlapOfTriangle)} = ${f(x.overlap)}입니다.`, `${f(x.overlap)} × 100 = ${f(x.percent)}%`);if(level===2)steps.push(`겹치지 않은 두 부분의 비는 ${r(model.responses[1].value)}입니다.`);
  }else if(k==="mission-4"){
   parts.push(level===0?`신영이와 지현이는 처음 돈의 각각 ${f(x.remaining[0])}, ${f(x.remaining[1])}만큼을 남겼습니다.`:`신영이는 가진 돈의 ${f(d.spent[0])}, 지현이는 가진 돈의 ${f(d.spent[1])}만큼을 썼습니다.`,`남은 돈의 비가 신영 : 지현 = ${r(d.remainingRatio)}일 때, 처음 돈의 비를 간단한 자연수의 비로 나타내시오.`);if(level===2)parts.push(`두 사람의 처음 돈의 합이 ${d.totalMoney}원일 때, 각각의 처음 돈도 구하시오.`);Object.assign(visible,level===0?{remaining:x.remaining}:{spent:d.spent},{remainingRatio:d.remainingRatio},level===2?{totalMoney:d.totalMoney}:{});steps.push(`남은 비율은 각각 ${f(x.remaining[0])}, ${f(x.remaining[1])}입니다.`, `처음 돈의 비는 (${d.remainingRatio[0]} ÷ ${f(x.remaining[0])}) : (${d.remainingRatio[1]} ÷ ${f(x.remaining[1])}) = ${r(x.originalRatio)}입니다.`);if(level===2)steps.push(`신영이는 ${f(x.amounts[0])}원, 지현이는 ${f(x.amounts[1])}원입니다.`);
  }else if(k==="mission-5"){
   parts.push(`빈 욕조에 1분에 ${decimal(d.tap)} L의 물이 나오는 수도로 물을 받습니다. 욕조의 구멍으로도 물이 샙니다.`,level===0?`구멍으로는 1분에 ${decimal(x.leak)} L가 샙니다.`:`1분 동안 수도에서 나온 물의 양과 구멍으로 샌 물의 양의 비는 ${r(d.flowRatio)}입니다.`,level===2?`${d.minutes}분 동안 물을 받은 뒤 수도를 잠그고 ${d.drainOnlyMinutes}분 더 지났습니다. 이때 욕조에 남은 물은 몇 L입니까?`:`${d.minutes}분 뒤 욕조에 남은 물은 몇 L입니까?`,"수도에서 나오는 물의 양과 구멍으로 새는 물의 양은 각각 일정하고, 물은 넘치지 않습니다.");Object.assign(visible,{tap:d.tap,minutes:d.minutes},level===0?{leak:x.leak}:{flowRatio:d.flowRatio},level===2?{drainOnlyMinutes:d.drainOnlyMinutes}:{});steps.push(`1분에 새는 양은 ${decimal(x.leak)} L, 남는 양은 ${decimal(x.net)} L입니다.`, `남은 물은 ${decimal(x.water)} L입니다.`);
  }else if(k==="mission-6"){
   parts.push(level===0?`현재 세균 ㉮는 ${d.now[0]}마리, ㉯는 ${d.now[1]}마리입니다. 매분 ㉮는 직전 마릿수의 ${f(x.multipliers[0])}배, ㉯는 ${f(x.multipliers[1])}배가 됩니다.`:`1분 전 ${d.past[0]}마리이던 세균 ㉮는 현재 ${d.now[0]}마리, 1분 전 ${d.past[1]}마리이던 세균 ㉯는 현재 ${d.now[1]}마리가 되었습니다. 두 세균은 각각 매분 일정한 비율로 늘어납니다.`,`${level===2?2:1}분 뒤 ㉮와 ㉯의 마릿수의 비를 간단한 자연수의 비로 나타내시오.`);Object.assign(visible,{now:d.now,futureMinutes:level===2?2:1},level===0?{multipliers:x.multipliers}:{past:d.past});steps.push(`㉮는 매분 ${f(x.multipliers[0])}배, ㉯는 매분 ${f(x.multipliers[1])}배가 됩니다.`, `${level===2?2:1}분 뒤 마릿수는 각각 ${f(x.future[0])}마리, ${f(x.future[1])}마리이므로 비는 ${r(model.responses[0].value)}입니다.`);
  }
  const formatResponse=a=>a.type==="ratio"?r(a.value):a.type==="index"?icons[a.value-1]:`${Array.isArray(a.value)?f(a.value):a.value}${({cm:" cm",km:" km",ml:" mL",people:"명",won:"원",percent:"%",L:" L"})[a.type]||""}`;
  const answerText=k==="exploration"?`(1) ${model.responses.filter(a=>a.id.startsWith("blank-")).map((a,i)=>`${icons[i]} ${f(a.value)}`).join(", ")}${level!==0?`; (2) ${f(x.depth)} cm`:""}${level===2?`; (3) ${icons[model.responses.at(-1).value-1]}`:""}`:model.responses.map((a,i)=>`${model.responses.length>1?`(${i+1}) `:""}${formatResponse(a)}`).join("; ");
  const summaries={exploration:"비례식의 안쪽 두 수의 곱과 바깥쪽 두 수의 곱이 같음을 이용합니다.","example-1":"앞 비례식에서 구한 수를 뒤 비례식에 넣습니다.","example-2":"한 걸음의 길이와 걸음 수를 함께 비교합니다.","example-3":"같은 양을 마셨으므로 각 병에서 줄어든 비율을 비교합니다.","example-4":"전체 평균보다 낮은 만큼과 높은 만큼의 총합은 같습니다.","mission-1":"두 비례식의 빈칸에는 같은 수를 넣습니다.","mission-2":"할인한 뒤의 가격에서 정가를 거꾸로 구합니다.","mission-4":"남은 돈을 처음 돈의 비율로 나누어 비교합니다.","mission-5":"들어오는 양에서 새는 양을 빼서 계산합니다.","mission-6":"두 세균이 각각 늘어나는 비율을 따로 적용합니다."};
  return freeze({...model,model,promptParts:parts,solutionSteps:steps,solutionSummary:summaries[k]||"",answerText,answerVisualRequired:true,learner_stage:"초등 6학년 2학기 · 황소 심화 · 비례식과 비례배분",sourceWholeResponseCount:level===1&&k==="exploration"?5:undefined,
   difficultyDesign:{mode:["easy","source","hard"][level],structuralChange:changes[k][level],sourceReferenceLevel:1,sourceGivensMatch:variant===0&&level===1,sourceTaskMatches:level===1,adoptionStatus:"pending",empiricallyCalibrated:false},studentGiven:{promptParts:parts,parameters:visible,figureKinds:model.figures.map(v=>v.kind),sourceResponseIds:model.responses.map(v=>v.id)}});
 }
 return freeze({generate,sourceItemIds:models.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
