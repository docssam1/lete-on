import{items}from'./c22-s62-u04.js';
import{taxonomy as original}from'./c22-s62-u04.taxonomy.js';
import{taxonomy as current}from'./c22-s62-u04.taxonomy-current.js';
import{careerCurrentItems}from'../../v2/career-question-language.js?v=20261104-student-science-language';
export const misconceptions=Object.fromEntries(original.types.map(t=>['M'+t.id.slice(1),{label:t.name,terms:[t.name],fix:t.desc,element:t.element}]));
for(const[id,code]of[['T15','M17'],['T16','M18']]){const t=current.types.find(t=>t.id===id);misconceptions[code]={label:t.name,terms:[t.name],fix:t.desc,element:t.element};}
export const typed={},distractors={},written={},cloze={},cells={};
for(const q of items){const ac=q.answerContract,mis='M'+q.type.slice(1);if(ac.type==='short-text')typed[q.id]={any:mis};if(q.choices)distractors[q.id]=Object.fromEntries(q.choices.map((_,i)=>[i,[].concat(ac.answers??ac.answer).includes(i)?null:mis]).filter(([,m])=>m));}
export const remedy=Object.fromEntries(Object.keys(misconceptions).map(code=>[code,{step:3}]));
export const revisionItems=careerCurrentItems(items).filter(q=>q.contentVersion);
