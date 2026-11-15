import{items}from'./c22-s62-u03.js';
import{taxonomy}from'./c22-s62-u03.taxonomy.js';
// T06의 두 서술 문항은 교사가 확인하며 자동 오개념 진단에 넣지 않는다.
const automaticTypes=new Set(items.filter(q=>q.answerContract.type!=='written-explanation').map(q=>q.type||q.taxonomy.type));
export const misconceptions=Object.fromEntries(taxonomy.types.filter(t=>automaticTypes.has(t.id)).map(t=>['M'+t.id.slice(1),{label:t.name,terms:[t.name],fix:t.desc,element:t.element}]));
Object.assign(misconceptions,{
 M19:{label:'전지의 방향과 전자석의 극을 연결해요',terms:['전지 방향과 전자석의 극'],fix:'같은 전자석에서 전지의 방향을 반대로 연결하면 전자석의 N극과 S극이 서로 바뀌어요. 세기를 바꾸는 방법과 극을 바꾸는 방법을 구별해요.',element:'E6'},
 M20:{label:'전기를 쓰는 기구와 쓰지 않는 도구를 구별해요',terms:['전기 사용과 도구의 작동'],fix:'선풍기와 에어컨은 전기를 써서 작동하지만 손으로 부치는 부채는 전기를 쓰지 않아요. 작동에 전기가 필요한지 살펴보아요.',element:'E8'},
 M21:{label:'전지의 수와 연결 방법을 함께 살펴요',terms:['전지의 수·연결 방법'],fix:'전지의 수만 세지 말고 어느 극끼리 연결했는지 확인해요. 같은 부품과 닫힌 회로에서 전지의 수와 연결 방법에 따른 밝기를 비교해요.',element:'E4'},
});
export const typed={},distractors={},written={},cloze={},cells={};
for(const q of items){const ac=q.answerContract,mis='M'+(q.type||q.taxonomy.type).slice(1);if(ac.type==='short-text')typed[q.id]={any:mis};if(q.choices)distractors[q.id]=Object.fromEntries(q.choices.map((_,i)=>[i,[].concat(ac.answers??ac.answer).includes(i)?null:mis]).filter(([,m])=>m));}
export const remedy=Object.fromEntries(Object.keys(misconceptions).map(code=>[code,{step:3}]));
