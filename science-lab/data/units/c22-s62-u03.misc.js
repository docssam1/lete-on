import{items}from'./c22-s62-u03.js';
import{taxonomy}from'./c22-s62-u03.taxonomy.js';
// T06의 두 서술 문항은 교사가 확인하며 자동 오개념 진단에 넣지 않는다.
const automaticTypes=new Set(items.filter(q=>q.answerContract.type!=='written-explanation').map(q=>q.type||q.taxonomy.type));
export const misconceptions=Object.fromEntries(taxonomy.types.filter(t=>automaticTypes.has(t.id)).map(t=>['M'+t.id.slice(1),{label:t.name,terms:[t.name],fix:t.desc,element:t.element}]));
export const typed={},distractors={},written={},cloze={},cells={};
for(const q of items){const ac=q.answerContract,mis='M'+(q.type||q.taxonomy.type).slice(1);if(ac.type==='short-text')typed[q.id]={any:mis};if(q.choices)distractors[q.id]=Object.fromEntries(q.choices.map((_,i)=>[i,[].concat(ac.answers??ac.answer).includes(i)?null:mis]).filter(([,m])=>m));}
export const remedy=Object.fromEntries(Object.keys(misconceptions).map(code=>[code,{step:3}]));
