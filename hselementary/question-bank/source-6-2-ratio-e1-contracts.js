(function(root,factory){"use strict";if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-ratio-e1-models.js"));else root.HSE_SOURCE_GRADE6_RATIO_E1_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_RATIO_E1_MODELS);})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const f=models.fmt,n=v=>Number(v).toLocaleString("ko-KR"),r=v=>v.map(n).join(":"),freeze=o=>{if(o&&typeof o==="object"&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
 const designs={
  exploration:["정수 비례식과 두 가지 비만 계산합니다.","원문의 비례식 한 개와 비 네 개를 모두 계산합니다.","다섯 계산에 더해 네 비의 비율을 비교합니다."],
  "example-1":["두 길이를 모두 주어 비를 구합니다.","부분과 전체 길이에서 나머지 길이를 구한 뒤 순서를 정합니다.","두 길이의 합과 차에서 각각의 길이를 구합니다."],
  "example-2":["분당 물의 양을 바로 비교합니다.","같은 시간에 찬 두 물통의 양을 비교합니다.","서로 다른 시간으로 각각의 분당 양을 구해 비교합니다."],
  "example-3":["간단한 자연수의 비와 차의 한 조건을 사용합니다.","소수인 비율에서 간단한 비와 가능한 배수를 찾습니다.","차와 합의 두 조건을 동시에 만족하는 배수를 찾습니다."],
  "example-4":["바깥과 안쪽 정사각형의 변을 주어 두 변을 구합니다.","직사각형과 안쪽 정사각형의 넓이로 변을 구합니다.","두 변의 비와 안쪽 테두리를 포함한 둘레의 비를 함께 구합니다."],
  "mission-1":["간단한 비에서 뒤의 수 범위를 확인합니다.","비를 간단히 한 뒤 뒤의 수 범위를 확인합니다.","앞의 수와 뒤의 수 범위를 함께 확인합니다."],
  "mission-2":["어머니에 대한 동생 키의 비율을 바로 사용합니다.","연결된 두 비율로 어머니와 동생을 비교합니다.","연결된 비율로 키의 차와 형의 키까지 비교합니다."],
  "mission-3":["두 사람의 수를 바로 비교합니다.","전체와 몇 배보다 많은 조건으로 두 수를 찾습니다.","두 수를 찾은 다음 일부를 주고받은 뒤 비교합니다."],
  "mission-4":["모서리 길이에서 전체 모서리 길이의 합을 비교합니다.","겉넓이에서 모서리 길이를 구해 비교합니다.","겉넓이에서 모서리 길이의 합과 부피를 모두 비교합니다."],
  "mission-5":["한 색칠 영역의 넓이를 단위 정사각형과 비교합니다.","두 색칠 영역의 넓이를 비교합니다.","두 영역의 비와 전체 색칠·미색칠 넓이의 비를 함께 구합니다."],
  "mission-6":["같은 시간 동안 두 수도가 채운 양을 비교합니다.","같이 채운 뒤 나머지를 한 수도로 채웁니다.","같이 채운 뒤 첫 수도만 따로 쓰는 단계를 추가합니다."]
 };
 function generate(id,variant=0,level=1){
  const model=models.solve(id,variant,level),d=model.givens,x=model.facts,k=model.kind,parts=[],steps=[];
  if(k==="exploration"){
   parts.push(`(1) ${f(d.a)} : ${f(d.b)} = ${f(d.c)} : □일 때, □ 안에 알맞은 수를 구하시오.`,`(2) 다음 비를 간단한 자연수의 비로 나타내시오.`,...d.ratios.map((row,i)=>`${["①","②","③","④"][i]} ${row[2][0]} : ${row[2][1]}`));
   if(level===2)parts.push("(3) (2)의 비 중 비율이 가장 큰 것과 가장 작은 것의 번호를 차례로 쓰시오.");
   steps.push(`(1) □ = ${f(d.c)} × ${f(d.b)} ÷ ${f(d.a)} = ${f(x.missing)}`,...x.simpleRatios.map((a,i)=>`(2) ${["①","②","③","④"][i]} ${r(a)}`));if(level===2)steps.push(`(3) 가장 큰 비는 ${x.maximumIndex}번, 가장 작은 비는 ${x.minimumIndex}번입니다.`);
  }else if(k==="example-1"){
   parts.push("길이가 다른 두 테이프를 겹치지 않게 이어 붙였습니다.",level===0?"그림을 보고 짧은 테이프와 긴 테이프의 길이의 비를 간단한 자연수의 비로 나타내시오.":level===1?"짧은 테이프와 긴 테이프의 길이의 비를 간단한 자연수의 비로 나타내시오.":`두 테이프의 길이의 차는 ${f(x.difference)} m입니다. 짧은 테이프와 긴 테이프의 길이의 비를 간단한 자연수의 비로 나타내시오.`);
   if(level===1)steps.push(`다른 테이프의 길이는 ${f(d.total)} - ${f(d.first)} = ${f(x.second)} m입니다.`);if(level===2)steps.push(`짧은 테이프는 (${f(d.total)} - ${f(x.difference)}) ÷ 2 = ${f(x.short)} m, 긴 테이프는 (${f(d.total)} + ${f(x.difference)}) ÷ 2 = ${f(x.long)} m입니다.`);steps.push(`${f(x.short)} : ${f(x.long)} = ${r(model.responses[0].value)}`);
  }else if(k==="example-2"){
   parts.push(level===0?`가 수도에서 1분에 ${n(d.capacities[0])} L, 나 수도에서 1분에 ${n(d.capacities[1])} L의 물이 나옵니다.`:`들이가 ${n(d.capacities[0])} L인 물통은 가 수도에서, ${n(d.capacities[1])} L인 물통은 나 수도에서 각각 가득 채웠습니다. `+(level===1?"두 물통을 가득 채우는 데 걸린 시간은 같습니다.":`가 수도는 ${d.minutes[0]}분, 나 수도는 ${d.minutes[1]}분이 걸렸습니다.`),"1분에 가 수도와 나 수도에서 나온 물의 양의 비를 간단한 자연수의 비로 나타내시오.");
   if(level===2)steps.push(`가 수도: ${n(d.capacities[0])} ÷ ${d.minutes[0]} = ${f(x.rates[0])} L`, `나 수도: ${n(d.capacities[1])} ÷ ${d.minutes[1]} = ${f(x.rates[1])} L`);steps.push(`${f(x.rates[0])} : ${f(x.rates[1])} = ${r(model.responses[0].value)}`);
  }else if(k==="example-3"){
   parts.push(level===0?`두 수의 비는 ${r(x.base)}입니다.`:`두 수의 비율은 ${d.decimal}입니다.`, `자연수로 이루어진 같은 비 중 두 수의 차가 ${n(d.differenceLimit)}보다 작은 비는 모두 몇 개인지 구하시오.`,...(level===2?[`두 수의 합은 ${n(d.sumLower)}보다 커야 합니다.`]:[]));
   steps.push(`간단한 비는 ${r(x.base)}이고 두 수의 차는 ${Math.abs(x.base[0]-x.base[1])}의 배수입니다.`, `가능한 배수는 ${x.kInterval[0]}배부터 ${x.kInterval[1]}배까지이므로 ${x.legalMultipliers.length}개입니다.`);
  }else if(k==="example-4"){
   parts.push(`합동인 직사각형 4개를 겹치지 않게 붙여 큰 정사각형을 만들었습니다. `+(level===0?`큰 정사각형의 한 변은 ${x.outerSide} cm, 가운데 색칠되지 않은 정사각형의 한 변은 ${x.innerSide} cm입니다.`:`직사각형 한 개의 넓이는 ${n(x.rectangleArea)} cm²이고, 가운데 색칠되지 않은 정사각형의 넓이는 ${n(x.innerArea)} cm²입니다.`),"직사각형의 세로가 가로보다 길 때, 가로와 세로의 길이의 비를 간단한 자연수의 비로 나타내시오.",...(level===2?["색칠된 부분 전체의 둘레(안쪽 테두리 포함)와 큰 정사각형 둘레의 비도 구하시오."]:[]));
   if(level!==0)steps.push(`큰 정사각형의 넓이는 ${n(x.rectangleArea)} × 4 + ${n(x.innerArea)} = ${n(x.outerArea)} cm²입니다.`,`${x.outerSide} × ${x.outerSide} = ${n(x.outerArea)}이고, ${x.innerSide} × ${x.innerSide} = ${n(x.innerArea)}입니다.`);
   steps.push(`가로는 (${x.outerSide} - ${x.innerSide}) ÷ 2 = ${d.short} cm, 세로는 (${x.outerSide} + ${x.innerSide}) ÷ 2 = ${d.long} cm입니다.`,`${d.short} : ${d.long} = ${r(model.responses[0].value)}`);if(level===2)steps.push(`색칠 부분의 둘레는 ${x.outerSide} × 4 + ${x.innerSide} × 4입니다. 큰 정사각형 둘레와의 비는 ${r(model.responses[1].value)}입니다.`);
  }else if(k==="mission-1"){
   parts.push(`${level===0?r(x.base):r(d.given)}과 같은 비 중 두 수가 모두 자연수이고, 뒤의 수가 ${d.lower}보다 크고 ${d.upper}보다 작은 비는 모두 몇 개인지 구하시오.`,...(level===2?[`앞의 수는 ${d.firstUpper}보다 작아야 합니다.`]:[]));
   steps.push(`간단한 비는 ${r(x.base)}입니다.`,`${x.legalRatios.map(r).join(", ")}의 ${x.legalRatios.length}개입니다.`);
  }else if(k==="mission-2"){
   parts.push(level===0?`동생의 키는 어머니 키의 ${f(x.youngerToMother)}입니다.`:`형의 키는 어머니 키의 ${f(d.olderToMother)}이고, 동생의 키는 형 키의 ${f(d.youngerToOlder)}입니다.`,"어머니와 동생의 키의 비를 간단한 자연수의 비로 나타내시오.",...(level===2?["어머니와 동생의 키의 차와 형의 키의 비도 구하시오."]:[]));
   steps.push(`어머니의 키를 1로 보면 동생은 ${f(x.youngerToMother)}입니다.`,`1 : ${f(x.youngerToMother)} = ${r(model.responses[0].value)}`);if(level===2)steps.push(`(1 - ${f(x.youngerToMother)}) : ${f(d.olderToMother)} = ${r(model.responses[1].value)}`);
  }else if(k==="mission-3"){
   parts.push(level===0?`소정이는 색종이를 ${x.counts[0]}장, 민정이는 ${x.counts[1]}장 가졌습니다.`:`소정이와 민정이가 색종이 ${d.total}장을 나누어 가졌습니다. 민정이는 소정이가 가진 수의 ${d.multiple}배보다 ${d.extra}장 더 많이 가졌습니다.`,...(level===2?[`민정이가 소정이에게 ${d.transfer}장을 주었습니다. 그 뒤 두 사람이 가진 색종이 수를 비교합니다.`]:[]),"소정이와 민정이가 가진 색종이 수의 비를 간단한 자연수의 비로 나타내시오.");
   if(level!==0)steps.push(`소정이는 (${d.total} - ${d.extra}) ÷ (${d.multiple} + 1) = ${x.counts[0]}장, 민정이는 ${d.total} - ${x.counts[0]} = ${x.counts[1]}장입니다.`);if(level===2)steps.push(`주고받은 뒤 소정이는 ${x.afterTransfer[0]}장, 민정이는 ${x.afterTransfer[1]}장입니다.`);steps.push(`두 수의 비는 ${r(model.responses[0].value)}입니다.`);
  }else if(k==="mission-4"){
   parts.push(level===0?`정육면체 ㉮와 ㉯의 한 모서리는 각각 ${d.sides[0]} cm, ${d.sides[1]} cm입니다.`:`정육면체 ㉮와 ㉯의 겉넓이는 각각 ${n(x.surfaceAreas[0])} cm², ${n(x.surfaceAreas[1])} cm²입니다.`,"두 정육면체의 모든 모서리 길이의 합의 비를 ㉮:㉯ 순서로 간단히 나타내시오.",...(level===2?["두 정육면체의 부피의 비도 ㉮:㉯ 순서로 구하시오."]:[]));
   if(level!==0)steps.push(`㉮의 한 면은 ${n(x.surfaceAreas[0])} ÷ 6 = ${n(d.sides[0]*d.sides[0])} cm²이므로 한 모서리는 ${d.sides[0]} cm입니다.`,`㉯도 같은 방법으로 한 모서리가 ${d.sides[1]} cm입니다.`);steps.push(`모든 모서리 길이의 합은 각각 모서리 길이의 12배이므로 비는 ${r(model.responses[0].value)}입니다.`);if(level===2)steps.push(`(${d.sides[0]} × ${d.sides[0]} × ${d.sides[0]}) : (${d.sides[1]} × ${d.sides[1]} × ${d.sides[1]}) = ${r(model.responses[1].value)}`);
  }else if(k==="mission-5"){
   parts.push(`한 변의 길이가 1인 정사각형 ${d.squares}개를 이어 붙였습니다.`,level===0?"㉮의 넓이는 정사각형 한 개의 넓이의 얼마인지 분수로 나타내시오.":"㉮와 ㉯의 넓이의 비를 간단한 자연수의 비로 나타내시오.",...(level===2?["색칠된 부분 전체와 색칠되지 않은 부분의 넓이의 비도 구하시오."]:[]));
   steps.push(`㉮의 넓이는 ${f(x.areas[0])}, ㉯의 넓이는 ${f(x.areas[1])}입니다.`);if(level!==0)steps.push(`${f(x.areas[0])} : ${f(x.areas[1])} = ${r(model.responses[0].value)}`);if(level===2)steps.push(`색칠된 넓이는 ${f(x.shadedArea)}, 색칠되지 않은 넓이는 ${f(x.unshadedArea)}이므로 비는 ${r(model.responses[1].value)}입니다.`);
  }else if(k==="mission-6"){
   parts.push(`빈 수영장을 가 수도로 가득 채우는 데 ${d.fillHours[0]}시간, 나 수도로는 ${d.fillHours[1]}시간이 걸립니다. 두 수도로 동시에 ${f(d.bothHours)}시간 동안 물을 채웠습니다.`,...(level===0?[]:level===2?[`이어서 가 수도만 ${f(d.aOnlyHours)}시간 동안 사용한 뒤, 나머지를 나 수도로 채웠습니다.`]:["나머지를 나 수도로 채웠습니다."]),`가 수도로 채운 물의 양과 나 수도로 채운 물의 양의 비를 간단한 자연수의 비로 나타내시오. 두 수도에서 나오는 물의 양은 각각 일정합니다.`);
   steps.push(`처음에 가 수도는 전체의 ${f(x.bothVolumes[0])}, 나 수도는 ${f(x.bothVolumes[1])}을 채웁니다.`);if(level===2)steps.push(`가 수도가 따로 채운 양은 ${f(x.aOnlyVolume)}이므로 가 수도가 채운 전체 양은 ${f(x.finalAVolume)}입니다.`);if(level!==0)steps.push(`나 수도가 채운 전체 양은 1 - ${f(x.finalAVolume)} = ${f(x.finalBVolume)}입니다.`);steps.push(`가:나 = ${r(model.responses[0].value)}`);
  }
  const answerText=k==="exploration"?`(1) ${f(x.missing)}; (2) ${x.simpleRatios.map((a,i)=>`${["①","②","③","④"][i]} ${r(a)}`).join(", ")}${level===2?`; (3) 큰 것 ${["①","②","③","④"][x.maximumIndex-1]}, 작은 것 ${["①","②","③","④"][x.minimumIndex-1]}`:""}`:model.responses.map((a,i)=>`${model.responses.length>1?`(${i+1}) `:""}${a.type==="ratio"?r(a.value):a.type==="fraction"?f(a.value):a.type==="count"?`${a.value}개`:`${a.value}번`}`).join("; ");
  const summary={exploration:"비의 두 항에 같은 수를 곱하거나 나누어 비교합니다.","example-2":level===2?"각 수도에서 1분에 나온 양을 먼저 구합니다.":"같은 시간에 나온 물의 양의 비를 비교합니다.","example-3":"간단한 비의 두 수에 같은 자연수를 곱해 조건에 맞는 것을 셉니다.","mission-1":"비의 앞의 수와 뒤의 수가 모든 범위를 만족해야 합니다.","mission-2":"어머니의 키를 1로 놓고 형과 동생의 키를 차례로 비교합니다.","mission-3":"전체 수와 두 사람이 가진 수의 관계를 함께 사용합니다.","mission-4":"겉넓이는 한 면의 넓이의 6배이고, 모서리는 모두 12개입니다.","mission-6":"전체 물의 양을 1로 놓고 각 수도가 채운 양을 구합니다."};
  return freeze({...model,model,promptParts:parts,solutionSteps:steps,solutionSummary:summary[k]||"",answerText,answerVisualRequired:true,learner_stage:"초등 6학년 2학기 · 황소 심화 · 비례식과 비례배분",sourceWholeResponseCount:level===1&&k==="exploration"?5:undefined,
   difficultyDesign:{mode:["easy","source","hard"][level],structuralChange:designs[k][level],sourceReferenceLevel:1,sourceGivensMatch:variant===0&&level===1,sourceTaskMatches:level===1,adoptionStatus:"pending",empiricallyCalibrated:false},studentGiven:{promptParts:parts,figureKinds:model.figures.map(g=>g.kind),sourceResponseIds:model.responses.map(a=>a.id)}});
 }
 return freeze({generate,sourceItemIds:models.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
