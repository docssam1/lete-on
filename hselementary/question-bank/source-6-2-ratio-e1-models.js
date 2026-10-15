(function(root,factory){"use strict";if(typeof module==="object"&&module.exports)module.exports=factory();else root.HSE_SOURCE_GRADE6_RATIO_E1_MODELS=factory();})(typeof window!=="undefined"?window:globalThis,function(){
 "use strict";
 const prefix="6-2-u4-e1-",freeze=o=>{if(o&&typeof o==="object"&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
 const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
 function rat(n,d=1){if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||!d)throw RangeError("Exact safe integer fraction required");if(d<0){n=-n;d=-d;}const g=gcd(n,d);return[n/g,d/g];}
 const add=(a,b)=>rat(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),sub=(a,b)=>rat(a[0]*b[1]-b[0]*a[1],a[1]*b[1]),mul=(a,b)=>rat(a[0]*b[0],a[1]*b[1]),div=(a,b)=>rat(a[0]*b[1],a[1]*b[0]),cmp=(a,b)=>a[0]*b[1]-b[0]*a[1],value=a=>a[0]/a[1];
 const ratio=(a,b)=>{const r=div(a,b);if(r[0]<=0)throw RangeError("Positive ratio terms required");return r;};
 const fmt=a=>{if(!Array.isArray(a))return String(a);const[n,d]=rat(...a),whole=Math.trunc(n/d),rem=n%d;return d===1?String(n):whole?`${whole} ${Math.abs(rem)}/${d}`:`${n}/${d}`;};
 const roots=freeze({
  exploration:[
   {a:[3,7],b:[5,8],c:[9,1],ratios:[[[27,100],[81,100],["0.27","0.81"]],[[9,4],[27,5],["2 1/4","5 2/5"]],[[13,5],[9,5],["2 3/5","1.8"]],[[13,2],[17,2],["6.5","8 1/2"]]]},
   {a:[2,5],b:[7,12],c:[6,1],ratios:[[[42,100],[126,100],["0.42","1.26"]],[[5,3],[25,6],["1 2/3","4 1/6"]],[[9,4],[3,2],["2 1/4","1.5"]],[[9,2],[15,2],["4.5","7 1/2"]]]},
   {a:[5,9],b:[7,10],c:[10,1],ratios:[[[36,100],[84,100],["0.36","0.84"]],[[7,2],[35,6],["3 1/2","5 5/6"]],[[9,5],[9,10],["1 4/5","0.9"]],[[36,5],[48,5],["7.2","9 3/5"]]]}
  ],
  "example-1":[{first:[5,6],total:[19,12]},{first:[7,8],total:[13,8]},{first:[11,12],total:[7,4]}],
  "example-2":[{capacities:[96,114],minutes:[12,19]},{capacities:[84,126],minutes:[7,18]},{capacities:[105,150],minutes:[15,10]}],
  "example-3":[{ratioValue:[9,50],decimal:"0.18",differenceLimit:2020,sumLower:2000},{ratioValue:[7,25],decimal:"0.28",differenceLimit:1000,sumLower:800},{ratioValue:[3,20],decimal:"0.15",differenceLimit:850,sumLower:500}],
  "example-4":[{short:15,long:27},{short:12,long:20},{short:14,long:24}],
  "mission-1":[{given:[48,40],lower:10,upper:30,firstUpper:28},{given:[63,42],lower:8,upper:25,firstUpper:30},{given:[54,72],lower:12,upper:41,firstUpper:25}],
  "mission-2":[{olderToMother:[6,7],youngerToOlder:[11,12]},{olderToMother:[4,5],youngerToOlder:[7,8]},{olderToMother:[5,6],youngerToOlder:[9,10]}],
  "mission-3":[{total:116,multiple:2,extra:8,transfer:12},{total:154,multiple:3,extra:10,transfer:15},{total:158,multiple:2,extra:14,transfer:9}],
  "mission-4":[{sides:[30,25]},{sides:[24,18]},{sides:[35,28]}],
  "mission-5":[{squares:6,shaded:[1,4]},{squares:8,shaded:[2,6]},{squares:10,shaded:[3,7]}],
  "mission-6":[{fillHours:[5,4],bothHours:[1,1],aOnlyHours:[1,2]},{fillHours:[6,4],bothHours:[1,1],aOnlyHours:[1,3]},{fillHours:[8,5],bothHours:[1,1],aOnlyHours:[1,2]}]
 });
 function solveInput(kind,input,level){
  if(!Object.hasOwn(roots,kind)||!Number.isSafeInteger(level)||level<0||level>2)throw RangeError("Unsupported ratio source scope");
  const required=Object.keys(roots[kind][0]);if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).length!==required.length||required.some(key=>!Object.hasOwn(input,key)))throw RangeError("Unexpected or missing source parameters");
  const d=JSON.parse(JSON.stringify(input)),responses=[],facts={},figures=[];const respond=(id,type,v)=>responses.push({id,type,value:v});
  if(kind==="exploration"){
   if(level===0){const c=value(d.c);d.a=rat(3);d.b=rat(5);d.c=rat(c);d.ratios=d.ratios.slice(0,2);}
   facts.missing=div(mul(d.b,d.c),d.a);facts.simpleRatios=d.ratios.map(([a,b])=>ratio(a,b));respond("missing","fraction",facts.missing);facts.simpleRatios.forEach((r,i)=>respond(`ratio-${i+1}`,"ratio",r));
   if(level===2){const ordered=facts.simpleRatios.map((r,i)=>({r,i:i+1})).sort((a,b)=>cmp(a.r,b.r));if(ordered.some((o,i)=>i&&cmp(o.r,ordered[i-1].r)===0))throw Error("Extremum must be unique");facts.minimumIndex=ordered[0].i;facts.maximumIndex=ordered.at(-1).i;respond("greatest-index","number",facts.maximumIndex);respond("least-index","number",facts.minimumIndex);}
  }else if(kind==="example-1"){
   const second=sub(d.total,d.first);if(value(second)<=0||cmp(d.first,second)===0)throw Error("Two positive unequal tapes required");const sorted=[d.first,second].sort(cmp);facts.second=second;facts.short=sorted[0];facts.long=sorted[1];facts.difference=sub(facts.long,facts.short);respond("short-long","ratio",ratio(facts.short,facts.long));
   figures.push({kind:"tapes",segments:[{id:"first",from:[0,0],to:[value(d.first),0],length:d.first},{id:"second",from:[value(d.first),0],to:[value(d.total),0],length:second}],total:d.total,givenMode:level===0?"two-parts":level===1?"first-and-total":"total-and-difference"});
  }else if(kind==="example-2"){
   if(d.capacities.some(n=>!Number.isSafeInteger(n)||n<=0)||d.minutes.some(n=>!Number.isSafeInteger(n)||n<=0))throw RangeError("Positive capacity and duration required");facts.rates=d.capacities.map((n,i)=>rat(n,level===2?d.minutes[i]:1));respond("A-B-output","ratio",ratio(...facts.rates));
  }else if(kind==="example-3"){
   const[a,b]=rat(...d.ratioValue),gap=Math.abs(a-b);if(!gap)throw RangeError("Nonunit positive ratio required");const maxK=Math.ceil(d.differenceLimit/gap)-1,minK=level===2?Math.floor(d.sumLower/(a+b))+1:1;
   facts.base=[a,b];facts.kInterval=[minK,maxK];facts.legalMultipliers=Array.from({length:Math.max(0,maxK-minK+1)},(_,i)=>minK+i);respond("equivalent-ratio-count","count",facts.legalMultipliers.length);
  }else if(kind==="example-4"){
   const s=d.short,l=d.long;if(!Number.isSafeInteger(s)||!Number.isSafeInteger(l)||s<=0||l<=s)throw RangeError("Positive unequal rectangle sides required");facts.rectangleArea=s*l;facts.innerSide=l-s;facts.innerArea=(l-s)*(l-s);facts.outerSide=l+s;facts.outerArea=(l+s)*(l+s);respond("horizontal-vertical","ratio",ratio(rat(s),rat(l)));if(level===2)respond("ring-outer-perimeters","ratio",ratio(rat(4*(l+s)+4*(l-s)),rat(4*(l+s))));
   figures.push({kind:"pinwheel",outer:[0,0,l+s,l+s],inner:[s,s,l,l],rectangles:[{id:"top",box:[0,0,l,s]},{id:"right",box:[l,0,l+s,l]},{id:"bottom",box:[s,l,l+s,l+s]},{id:"left",box:[0,s,s,l+s]}],short:s,long:l});
  }else if(kind==="mission-1"){
   const[a,b]=ratio(rat(d.given[0]),rat(d.given[1]));facts.base=[a,b];facts.legalRatios=[];for(let second=d.lower+1;second<d.upper;second++)if(second%b===0){const first=second/b*a;if(level!==2||first<d.firstUpper)facts.legalRatios.push([first,second]);}respond("bounded-ratio-count","count",facts.legalRatios.length);
  }else if(kind==="mission-2"){
   facts.youngerToMother=mul(d.olderToMother,d.youngerToOlder);if(cmp(facts.youngerToMother,rat(1))>=0)throw Error("Source height ordering reversed");respond("mother-younger","ratio",ratio(rat(1),facts.youngerToMother));if(level===2)respond("height-difference-older","ratio",ratio(sub(rat(1),facts.youngerToMother),d.olderToMother));
  }else if(kind==="mission-3"){
   const a=(d.total-d.extra)/(d.multiple+1),b=d.total-a;if(!Number.isSafeInteger(a)||a<=0||!Number.isSafeInteger(b)||b<=d.transfer)throw Error("Sheet counts must be positive integers");facts.counts=[a,b];facts.afterTransfer=[a+d.transfer,b-d.transfer];respond("sojeong-minjeong","ratio",ratio(rat(level===2?facts.afterTransfer[0]:a),rat(level===2?facts.afterTransfer[1]:b)));
  }else if(kind==="mission-4"){
   const[a,b]=d.sides;if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||a<=0||b<=0)throw RangeError("Cube sides must be positive integers");facts.surfaceAreas=[6*a*a,6*b*b];facts.edgeSums=[12*a,12*b];facts.volumes=[a*a*a,b*b*b];respond("all-edges-A-B","ratio",ratio(...facts.edgeSums.map(n=>rat(n))));if(level===2)respond("volumes-A-B","ratio",ratio(...facts.volumes.map(n=>rat(n))));
  }else if(kind==="mission-5"){
   const n=d.squares,[a,b]=d.shaded;if(!Number.isSafeInteger(n)||n<2||!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||a<0||b<=a||b>=n)throw RangeError("Two distinct source shade columns required");
   const regions=d.shaded.map((i,index)=>({id:index?"B":"A",column:i,polygon:[[i,0],[i+1,0],[i+1,1-(i+1)/n],[i,1-i/n]],area:rat(2*n-2*i-1,2*n)}));facts.areas=regions.map(r=>r.area);facts.shadedArea=add(...facts.areas);facts.unshadedArea=sub(rat(n),facts.shadedArea);
   if(level===0)respond("A-unit-square","fraction",facts.areas[0]);else{respond("A-B-areas","ratio",ratio(...facts.areas));if(level===2)respond("shaded-unshaded","ratio",ratio(facts.shadedArea,facts.unshadedArea));}
   figures.push({kind:"diagonal-strip",squares:n,outline:[[0,0],[n,0],[n,1],[0,1]],diagonal:[[0,1],[n,0]],regions});
  }else if(kind==="mission-6"){
   const[a,b]=d.fillHours,t=d.bothHours;facts.bothVolumes=[div(t,rat(a)),div(t,rat(b))];if(value(add(...facts.bothVolumes))>=1)throw Error("Both-open stage must not fill the pool");
   facts.aOnlyVolume=level===2?div(d.aOnlyHours,rat(a)):rat(0);facts.finalAVolume=add(facts.bothVolumes[0],facts.aOnlyVolume);facts.finalBVolume=sub(rat(1),facts.finalAVolume);facts.bFinalVolume=sub(facts.finalBVolume,facts.bothVolumes[1]);if(value(facts.bFinalVolume)<=0)throw Error("A positive final B-only stage is required");respond("A-B-total-volume","ratio",level===0?ratio(...facts.bothVolumes):ratio(facts.finalAVolume,facts.finalBVolume));
  }
  if(!responses.length||responses.some(r=>r.type==="count"&&!Number.isSafeInteger(r.value)))throw Error("Invalid ratio answer contract");
  return freeze({kind,level,givens:d,facts,figures,responses,requestedAnswerUnique:true,sourceExact:false,originalSourceReleaseStatus:"locked",officialAnswerVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,learnerReleaseVerified:false,empiricallyCalibrated:false});
 }
 const ids=Object.keys(roots).map(k=>prefix+k);
 function solve(id,variant=0,level=1){if(!ids.includes(id)||!Number.isSafeInteger(variant)||variant<0||variant>2)throw RangeError("Unsupported ratio item or pool");return freeze({...solveInput(id.slice(prefix.length),roots[id.slice(prefix.length)][variant],level),sourceItemId:id,variant,finiteVariantCount:3,structuralFingerprint:`${id}:v${variant}:l${level}`});}
 return freeze({solve,solveInput,sourceItemIds:ids,pools:roots,rat,add,sub,mul,div,cmp,value,fmt,ratio,registrationOnly:true,learnerReleaseVerified:false});
});
