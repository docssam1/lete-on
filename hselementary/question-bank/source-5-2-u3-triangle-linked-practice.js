(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.HSE_SOURCE52_U3_TRIANGLE_LINKED=api;api.install(root);})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const rows=Object.freeze([
 Object.freeze({id:'5-2-u3-t1-2',source:'5-2-u3-practice-24-linked-similar',parent:'5-2-u3-practice-24-original',key:'source52U3LinkedTriangleSideChoices',answer:'13개',prompt:'<p>길이가 4cm, 6cm, 7cm, 9cm, 12cm, 15cm인 선분 중 3개를 골라 삼각형을 그리려고 합니다. 그릴 수 있는 서로 다른 삼각형은 모두 몇 개인가요?</p>',solution:'<p>여섯 길이 중 세 길이를 고르는 방법은 20가지입니다. 삼각형이 되려면 짧은 두 변의 합이 가장 긴 변보다 커야 합니다.</p><p>불가능한 조합은 (4, 6, 12), (4, 6, 15), (4, 7, 12), (4, 7, 15), (4, 9, 15), (6, 7, 15), (6, 9, 15)의 7가지입니다. 따라서 20−7=<strong>13개</strong>입니다.</p>'}),
 Object.freeze({id:'5-2-u3-t1-3',source:'5-2-u3-practice-20-linked-similar',parent:'5-2-u3-practice-20-original',key:'source52U3LinkedTriangleAngleChoices',answer:'7가지',prompt:'<p>한 변의 길이를 알 때, 그 양 끝 각을 35°, 55°, 75°, 100°, 125° 중에서 서로 다른 두 각으로 골라 삼각형을 그리려고 합니다. 그릴 수 있는 서로 다른 삼각형은 모두 몇 가지인가요?</p>',solution:'<p>다섯 각 중 두 각을 고르는 방법은 10가지입니다. 두 각의 합이 180°보다 작아야 나머지 한 각이 생깁니다.</p><p>두 각의 합이 180° 이상인 조합은 (55°, 125°), (75°, 125°), (100°, 125°)의 3가지입니다. 따라서 10−3=<strong>7가지</strong>입니다.</p>'}),
 Object.freeze({id:'5-2-u3-t2',source:'5-2-u3-practice-22-linked-similar',parent:'5-2-u3-practice-22-original',key:'source52U3LinkedTriangleThirdSide',answer:'11개',prompt:'<p>두 변의 길이가 각각 9cm, 6cm인 삼각형이 있습니다. 나머지 한 변의 길이가 될 수 있는 자연수는 모두 몇 개인가요?</p>',solution:'<p>나머지 변의 길이는 두 변의 차인 3cm보다 크고 두 변의 합인 15cm보다 작아야 합니다.</p><p>가능한 자연수는 4부터 14까지이므로 <strong>11개</strong>입니다.</p>'}),
 Object.freeze({id:'5-2-u3-t2-2',source:'5-2-u3-practice-19-linked-similar',parent:'5-2-u3-practice-19-original',key:'source52U3LinkedTriangleSticks',answer:'7가지',prompt:'<p>길이가 3cm, 5cm, 6cm, 8cm, 10cm인 나무 도막이 하나씩 있습니다. 이 중 3개를 골라 삼각형을 만들 때, 서로 다른 삼각형은 모두 몇 가지인가요?</p>',solution:'<p>다섯 도막 중 세 개를 고르는 방법은 10가지입니다. 짧은 두 도막 길이의 합이 가장 긴 길이보다 커야 삼각형이 됩니다.</p><p>불가능한 조합은 (3, 5, 8), (3, 5, 10), (3, 6, 10)의 3가지입니다. 따라서 10−3=<strong>7가지</strong>입니다.</p>'})
]);
function match(t){return rows.find(q=>t&&(t.id===q.id||t.sourceItemId===q.source||t.generatorKey===q.key));}
function resolves(t,q){return !!(t&&q&&t.id===q.id&&t.sourceItemId===q.source&&t.generatorKey===q.key&&t.sourceVerified===true&&t.reviewLocked===false);}
const extraPools=Object.freeze({
 '5-2-u3-t1-2':[[3,4,6,7,8,11],[3,5,6,7,8,11],[3,4,8,9,10,11]],
 '5-2-u3-t1-3':[[20,45,60,135,145],[20,35,60,120,145],[20,30,60,90,120]],
 '5-2-u3-t2':[[8,5],[11,7],[12,8]],
 '5-2-u3-t2-2':[[3,4,5,7,11],[3,4,8,9,11],[3,7,8,9,11]]
});
function choose(values,n,start=0,prefix=[],result=[]){if(prefix.length===n){result.push(prefix);return result;}for(let i=start;i<=values.length-(n-prefix.length);i++)choose(values,n,i+1,[...prefix,values[i]],result);return result;}
function variantData(q,index){
 if(index===0)return q;
 const values=extraPools[q.id][index-1], tuple=a=>`(${a.join(', ')})`;
 if(q.id==='5-2-u3-t2'){
  const [a,b]=values,lo=Math.abs(a-b)+1,hi=a+b-1,answer=`${hi-lo+1}개`;
  return {answer,prompt:`<p>두 변의 길이가 각각 ${a}cm, ${b}cm인 삼각형이 있습니다. 나머지 한 변의 길이가 될 수 있는 자연수는 모두 몇 개인가요?</p>`,solution:`<p>나머지 변의 길이는 두 변의 차인 ${a-b}cm보다 크고 두 변의 합인 ${a+b}cm보다 작아야 합니다.</p><p>가능한 자연수는 ${lo}부터 ${hi}까지이므로 <strong>${answer}</strong>입니다.</p>`};
 }
 const isAngles=q.id==='5-2-u3-t1-3', isSticks=q.id==='5-2-u3-t2-2';
 const choices=choose(values,isAngles?2:3),invalid=choices.filter(a=>isAngles?a[0]+a[1]>=180:a[0]+a[1]<=a[2]);
 const answer=`${choices.length-invalid.length}${isAngles||isSticks?'가지':'개'}`;
 if(isAngles){const list=values.map(v=>`${v}°`).join(', '),bad=invalid.map(a=>tuple(a.map(v=>`${v}°`))).join(', ');return {answer,prompt:`<p>한 변의 길이를 알 때, 그 양 끝 각을 ${list} 중에서 서로 다른 두 각으로 골라 삼각형을 그리려고 합니다. 그릴 수 있는 서로 다른 삼각형은 모두 몇 가지인가요?</p>`,solution:`<p>다섯 각 중 두 각을 고르는 방법은 ${choices.length}가지입니다. 두 각의 합이 180°보다 작아야 나머지 한 각이 생깁니다.</p><p>두 각의 합이 180° 이상인 조합은 ${bad}의 ${invalid.length}가지입니다. 따라서 ${choices.length}−${invalid.length}=<strong>${answer}</strong>입니다.</p>`};}
 const list=values.map(v=>`${v}cm`).join(', '),bad=invalid.map(tuple).join(', ');
 const prompt=isSticks?`<p>길이가 ${list}인 나무 도막이 하나씩 있습니다. 이 중 3개를 골라 삼각형을 만들 때, 서로 다른 삼각형은 모두 몇 가지인가요?</p>`:`<p>길이가 ${list}인 선분 중 3개를 골라 삼각형을 그리려고 합니다. 그릴 수 있는 서로 다른 삼각형은 모두 몇 개인가요?</p>`;
 return {answer,prompt,solution:`<p>${isSticks?'다섯 도막':'여섯 길이'} 중 세 개를 고르는 방법은 ${choices.length}가지입니다. 짧은 두 변의 합이 가장 긴 변보다 커야 삼각형이 됩니다.</p><p>불가능한 조합은 ${bad}의 ${invalid.length}가지입니다. 따라서 ${choices.length}−${invalid.length}=<strong>${answer}</strong>입니다.</p>`};
}
function build(q,index){const v=variantData(q,index);return Object.freeze({prompt:`<div class="u3p87practice-question" data-source-item-id="${q.source}" data-pool-index="${index}">${v.prompt}</div>`,solution:`<div class="u3p87practice-solution" data-source-answer="${q.source}">${v.solution}</div>`,answer:v.answer,automaticGrading:true,resultContract:'single-value',answerVisual:'',answerVisualRequired:false,answerVisualStatus:'not-required',sourceItemId:q.source,sourceParentItemId:q.parent,generator:q.key,variant:index,variantIndex:index,poolIndex:index,verifiedPoolIndex:index,verifiedVariantId:`${q.source}:${index}`,generationMode:'fixed-verified-pool',verifiedVariantCount:4,verifiedVariantTarget:4,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,variantProvenance:'synthetic-source-structure',sourcePdfPage:83,alternateSourcePdfPage:82,sourcePrintedPage:87,publisherKeyVerified:false,publisherAnswerVerified:false});}
function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=='function'||typeof bank.generate!=='function')return false;if(bank.__source52U3TriangleLinkedInstalled)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=t=>{const q=match(t);return q?(resolves(t,q)?q.key:''):oldKey(t);};bank.generate=(t,user,difficulty,seed,variant=0)=>{const q=match(t),index=Number(variant);return q?(resolves(t,q)&&Number.isInteger(index)&&index>=0&&index<4?build(q,index):null):oldGenerate(t,user,difficulty,seed,variant);};if(Array.isArray(bank.names))for(const q of rows)if(!bank.names.includes(q.key))bank.names.push(q.key);Object.defineProperty(bank,'__source52U3TriangleLinkedInstalled',{value:true});return true;}
return Object.freeze({rows,match,resolves,build,install});
});
