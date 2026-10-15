(function(root,factory){"use strict";if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-ratio-e1-models.js"));else root.HSE_SOURCE_GRADE6_RATIO_E2_MODELS=factory(root.HSE_SOURCE_GRADE6_RATIO_E1_MODELS);})(typeof window!=="undefined"?window:globalThis,function(math){
 "use strict";
 const {rat,add,sub,mul,div,cmp,value,fmt,ratio}=math,prefix="6-2-u4-e2-",freeze=o=>{if(o&&typeof o==="object"&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
 // Rows 2-4 use (a * blank + b) : (c * blank + d) = p : q.
 const pools=freeze({
  exploration:[
   {equations:[[[0,1],[7,24],[0,1],[1,4],[14,1],[2,1]],[[3,1],[800,1],[2,1],[300,1],[7,1],[3,1]],[[7,1],[-36,1],[4,1],[-15,1],[2,1],[5,1]],[[5,1],[-8,1],[3,1],[7,1],[4,1],[3,1]]],rodDifference:42,wet:[[5,8],[4,7]]},
   {equations:[[[0,1],[5,18],[0,1],[1,3],[10,1],[2,1]],[[2,1],[500,1],[3,1],[200,1],[3,1],[2,1]],[[6,1],[-20,1],[3,1],[-5,1],[2,1],[3,1]],[[4,1],[-3,1],[2,1],[5,1],[3,1],[2,1]]],rodDifference:24,wet:[[3,5],[1,2]]},
   {equations:[[[0,1],[7,20],[0,1],[1,5],[14,1],[3,1]],[[4,1],[900,1],[3,1],[300,1],[5,1],[3,1]],[[8,1],[-30,1],[3,1],[-6,1],[3,1],[4,1]],[[5,1],[-4,1],[2,1],[7,1],[3,1],[2,1]]],rodDifference:30,wet:[[2,3],[3,5]]}
  ],
  "example-1":[{first:[105,90,7],second:[[1,2],[3,1]]},{first:[84,60,7],second:[[2,5],[2,1]]},{first:[72,120,6],second:[[3,4],[5,1]]}],
  "example-2":[{stride:[2,3],steps:[7,6],minjiDistance:[9,5]},{stride:[3,4],steps:[5,4],minjiDistance:[5,2]},{stride:[4,5],steps:[9,8],minjiDistance:[27,10]}],
  "example-3":[{initial:[[2,3],[2,5]],remaining:[[1,6],[1,5]],totalCapacity:1400},{initial:[[3,4],[3,5]],remaining:[[1,4],[1,5]],totalCapacity:1800},{initial:[[4,5],[1,2]],remaining:[[1,5],[1,4]],totalCapacity:1700}],
  "example-4":[{means:[67,72],whole:[347,5],countDifference:3},{means:[64,70],whole:[133,2],countDifference:4},{means:[71,79],whole:[747,10],countDifference:6}],
  "mission-1":[{first:[[4,1],[6,1],[21,2]],second:[[2,1],[28,1]]},{first:[[5,1],[8,1],[12,1]],second:[[3,1],[30,1]]},{first:[[6,1],[9,1],[12,1]],second:[[3,1],[24,1]]}],
  "mission-2":[{discount:[[4,25],[1,5]],saleMultiple:2,totalPrice:6100},{discount:[[1,5],[1,4]],saleMultiple:3,totalPrice:6100},{discount:[[1,4],[1,5]],saleMultiple:2,totalPrice:4700}],
  "mission-3":[{areaRatio:[8,3],overlapOfTriangle:[6,25]},{areaRatio:[5,2],overlapOfTriangle:[3,10]},{areaRatio:[3,2],overlapOfTriangle:[2,5]}],
  "mission-4":[{spent:[[3,4],[2,5]],remainingRatio:[7,3],totalMoney:3300},{spent:[[2,3],[1,4]],remainingRatio:[5,2],totalMoney:5300},{spent:[[4,5],[1,3]],remainingRatio:[3,2],totalMoney:1200}],
  "mission-5":[{tap:[42,5],flowRatio:[8,1],minutes:20,drainOnlyMinutes:5},{tap:[36,5],flowRatio:[6,1],minutes:25,drainOnlyMinutes:4},{tap:[48,5],flowRatio:[8,1],minutes:15,drainOnlyMinutes:3}],
  "mission-6":[{past:[2000,4608],now:[2400,5760]},{past:[1600,1500],now:[2000,1800]},{past:[2500,2560],now:[3000,3200]}]
 });
 function solveInput(kind,input,level){
  if(!Object.hasOwn(pools,kind)||!Number.isSafeInteger(level)||level<0||level>2)throw RangeError("Unsupported ratio E2 scope");const keys=Object.keys(pools[kind][0]);if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).length!==keys.length||keys.some(k=>!Object.hasOwn(input,k)))throw RangeError("Unexpected source input");
  const d=JSON.parse(JSON.stringify(input)),facts={},responses=[],figures=[],respond=(id,type,v)=>responses.push({id,type,value:v});
  if(kind==="exploration"){
   const eqs=d.equations.map(e=>e.map(v=>rat(...v)));facts.blankValues=eqs.map((e,i)=>{
    if(i===0){const[,a,,b,c,offset]=e;return sub(div(mul(c,b),a),offset);}
    const[a,b,c,d,p,q]=e,coefficient=sub(mul(q,a),mul(p,c)),constant=sub(mul(p,d),mul(q,b));if(!value(coefficient))throw Error("Blank not unique");const x=div(constant,coefficient);if(value(add(mul(a,x),b))<=0||value(add(mul(c,x),d))<=0)throw Error("Positive ratio terms required");return x;
   });
   const wetDifference=sub(div(rat(1),d.wet[1]),div(rat(1),d.wet[0]));facts.depth=div(rat(d.rodDifference),wetDifference);if(value(facts.depth)<=0)throw Error("Positive pond depth required");
   const count=level===0?2:4;facts.blankValues.slice(0,count).forEach((v,i)=>respond(`blank-${i+1}`,"fraction",v));if(level!==0)respond("pond-depth","cm",facts.depth);
   if(level===2){const ordered=facts.blankValues.map((v,i)=>({v,i:i+1})).sort((a,b)=>cmp(a.v,b.v));if(ordered.some((r,i)=>i&&cmp(r.v,ordered[i-1].v)===0))throw Error("Unique greatest blank required");respond("greatest-blank-index","index",ordered.at(-1).i);}
  }else if(kind==="example-1"){
   const[a,b,c]=d.first;facts.triangle=rat(b*c,a);facts.square=mul(facts.triangle,div(...d.second));respond("symbol-sum","fraction",add(facts.triangle,facts.square));if(level===2)respond("triangle-square","ratio",ratio(facts.triangle,facts.square));
  }else if(kind==="example-2"){
   facts.seoinToMinji=level===0?rat(...d.stride):mul(rat(...d.stride),rat(d.steps[1],d.steps[0]));facts.seoinDistance=mul(d.minjiDistance,facts.seoinToMinji);facts.totalDistance=add(d.minjiDistance,facts.seoinDistance);respond("seoin-distance","km",facts.seoinDistance);
  }else if(kind==="example-3"){
   facts.drankFractions=d.initial.map((v,i)=>sub(v,d.remaining[i]));if(facts.drankFractions.some(v=>value(v)<=0))throw Error("Each bottle must lose positive juice");facts.capacityRatio=ratio(facts.drankFractions[1],facts.drankFractions[0]);respond("A-B-capacity","ratio",facts.capacityRatio);
   facts.capacities=facts.capacityRatio.map(v=>div(rat(d.totalCapacity*v),rat(facts.capacityRatio[0]+facts.capacityRatio[1])));if(level===2)facts.capacities.forEach((v,i)=>respond(`capacity-${i}`,"ml",v));
  }else if(kind==="example-4"){
   if(cmp(d.whole,rat(d.means[0]))<=0||cmp(d.whole,rat(d.means[1]))>=0)throw Error("Whole mean must lie between class means");facts.deviations=[sub(d.whole,rat(d.means[0])),sub(rat(d.means[1]),d.whole)];facts.countRatio=ratio(facts.deviations[1],facts.deviations[0]);respond("A-B-student-count","ratio",facts.countRatio);
   const gap=Math.abs(facts.countRatio[0]-facts.countRatio[1]);if(!gap)throw Error("Unequal class sizes required");facts.counts=facts.countRatio.map(v=>v*d.countDifference/gap);if(level===2){if(facts.counts.some(v=>!Number.isSafeInteger(v)||v<=0))throw Error("Positive whole pupil counts required");facts.counts.forEach((v,i)=>respond(`count-${i}`,"people",v));}
  }else if(kind==="mission-1"){
   const[a,b,c]=d.first;facts.blank=div(mul(a,c),b);facts.heart=div(mul(...d.second),facts.blank);respond("heart","fraction",facts.heart);if(level===2)respond("blank-heart-sum","fraction",add(facts.blank,facts.heart));
  }else if(kind==="mission-2"){
   facts.remaining=d.discount.map(v=>sub(rat(1),v));facts.originalRatio=ratio(mul(rat(d.saleMultiple),facts.remaining[1]),facts.remaining[0]);respond("watermelon-pineapple-price","ratio",facts.originalRatio);facts.prices=facts.originalRatio.map(v=>rat(d.totalPrice*v,facts.originalRatio[0]+facts.originalRatio[1]));if(level===2)facts.prices.forEach((v,i)=>respond(`price-${i}`,"won",v));
  }else if(kind==="mission-3"){
   facts.triangleArea=rat(...d.areaRatio);facts.overlap=mul(facts.triangleArea,d.overlapOfTriangle);if(value(facts.overlap)<=0.5||value(facts.overlap)>=1)throw Error("Source intersection must cross square top");facts.percent=mul(facts.overlap,rat(100));respond("overlap-square-percent","percent",facts.percent);if(level===2)respond("uncovered-triangle-square","ratio",ratio(sub(facts.triangleArea,facts.overlap),sub(rat(1),facts.overlap)));
   const slopeRatio=2*(1-value(facts.overlap)),b=Math.sqrt(2*value(facts.triangleArea)*slopeRatio),h=b/slopeRatio;if(b<=1||h<=1||b-slopeRatio<=b-1)throw Error("Source topology invalid");const cross=[b-slopeRatio,1];figures.push({kind:"triangle-square-overlap",triangle:[[0,0],[b,0],[0,h]],square:[[b-1,0],[b,0],[b,1],[b-1,1]],overlap:[[b-1,0],[b,0],cross,[b-1,1]],squareSide:1,base:b,height:h,crossing:cross,triangleToSquare:d.areaRatio,overlapOfTriangle:d.overlapOfTriangle});
  }else if(kind==="mission-4"){
   facts.remaining=d.spent.map(v=>sub(rat(1),v));facts.originalRatio=ratio(div(rat(d.remainingRatio[0]),facts.remaining[0]),div(rat(d.remainingRatio[1]),facts.remaining[1]));respond("original-A-B-money","ratio",facts.originalRatio);facts.amounts=facts.originalRatio.map(v=>rat(d.totalMoney*v,facts.originalRatio[0]+facts.originalRatio[1]));if(level===2)facts.amounts.forEach((v,i)=>respond(`money-${i}`,"won",v));
  }else if(kind==="mission-5"){
   facts.leak=mul(d.tap,rat(d.flowRatio[1],d.flowRatio[0]));facts.net=sub(d.tap,facts.leak);facts.water=mul(facts.net,rat(d.minutes));if(level===2)facts.water=sub(facts.water,mul(facts.leak,rat(d.drainOnlyMinutes)));if(value(facts.water)<=0)throw Error("No empty-tub stage allowed");respond("remaining-water","L",facts.water);
  }else if(kind==="mission-6"){
   if(d.past.some(n=>!Number.isSafeInteger(n)||n<=0)||d.now.some(n=>!Number.isSafeInteger(n)||n<=0))throw Error("Whole bacteria counts required");facts.multipliers=d.now.map((v,i)=>rat(v,d.past[i]));facts.future=d.now.map((n,i)=>mul(rat(n),facts.multipliers[i]));if(level===2)facts.future=facts.future.map((n,i)=>mul(n,facts.multipliers[i]));if(facts.future.some(v=>v[1]!==1))throw Error("Whole future bacteria required");respond("future-A-B-count","ratio",ratio(...facts.future));
  }
  if(!responses.length)throw Error("Missing answer");return freeze({kind,level,givens:d,facts,responses,figures,requestedAnswerUnique:true,sourceExact:false,originalSourceReleaseStatus:"locked",officialAnswerVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,learnerReleaseVerified:false,empiricallyCalibrated:false});
 }
 const ids=Object.keys(pools).map(k=>prefix+k);
 function solve(id,variant=0,level=1){if(!ids.includes(id)||!Number.isSafeInteger(variant)||variant<0||variant>2)throw RangeError("Unsupported finite E2 request");return freeze({...solveInput(id.slice(prefix.length),pools[id.slice(prefix.length)][variant],level),sourceItemId:id,variant,finiteVariantCount:3,structuralFingerprint:`${id}:v${variant}:l${level}`});}
 return freeze({solve,solveInput,pools,sourceItemIds:ids,registrationOnly:true,learnerReleaseVerified:false});
});
