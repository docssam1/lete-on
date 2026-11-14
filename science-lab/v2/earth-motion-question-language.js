import{observationPriorWorkbook as workbook}from'../data/book/c22-s61-u04.workbook.js?v=20261104-earth-motion-questions';
import{EARTH_QUESTION_PATCHES}from'../data/book/c22-s61-u04.editorial.js?v=20261104-earth-motion-questions';
import{taxonomy}from'../data/units/c22-s61-u04.taxonomy.js';

export const EARTH_MOTION_QUESTION_VERSION='20261104-earth-motion-questions';
export const EARTH_MOTION_CHANGED_NUMBERS=Object.freeze(Object.keys(EARTH_QUESTION_PATCHES).map(Number));
const clone=x=>JSON.parse(JSON.stringify(x));
const byId=new Map(workbook.questions.map(q=>[q.id,q]));
const diagnosticFor={115:'M05',118:'M02',119:'M02',120:'M08',124:'M05',126:'M05',128:'M05'};

// 원래 문항·저장 답안은 보존하고, 현재 교재에서 편집한 일곱 문항만 연결한다.
export function earthMotionCurrentItems(rows){return rows.map(q=>{
 if(q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||(q.contentVersion||1)!==1)return q;
 const w=byId.get(q.bookQuestionId);
 if(!w||!EARTH_MOTION_CHANGED_NUMBERS.includes(w.no))return q;
 const t=taxonomy.types.find(t=>t.id===w.type),contract=clone(w.responseContract);
 const ac={...clone(q.answerContract),earthAuthoredContract:contract};
 if(ac.type==='short-text'){
  ac.answer=w.answer;
  ac.accepted=[...new Set([w.answer,...w.accepted||[],...(contract.kind==='ordered-term-parts'&&contract.parts.length===1?contract.parts[0].accepted:[])])];
 }
 if(ac.type==='written-explanation'){
  ac.sample=w.answer;ac.rubric={...ac.rubric,required:clone(w.requirements||[w.criteria])};ac.reviewRequired=true;
 }
 const givens={};
 if(w.table)givens.자료표={머리:clone(w.table.머리||w.table.heads),행:clone(w.table.행||w.table.rows)};
 if(w.given)givens.보기={머리:['보기'],행:w.given.map(s=>[s])};
 if(w.parts)givens.문항=clone(w.parts);
 const mis=diagnosticFor[w.no];
 const diagnosticOverride={version:EARTH_MOTION_QUESTION_VERSION,typed:ac.type==='short-text'?{any:mis}:null,distractors:w.choices?Object.fromEntries(w.choices.map((_,i)=>[i,[].concat(w.key).includes(i)?null:mis]).filter(([,m])=>m)):null,cloze:null,cells:null};
 return{...q,type:w.type,prompt:w.prompt,choices:w.choices?clone(w.choices):null,givens:Object.keys(givens).length?givens:null,responseContract:clone(contract),answerContract:ac,standards:[w.standard],explanation:w.explanation,misconception:w.misconception,workbookRef:{id:w.id,no:w.no},taxonomy:{...q.taxonomy,type:w.type,element:t.element,standard:w.standard,topic:w.topic,concept:t.name,inquirySkill:t.desc},diagnosticOverride,contentVersion:EARTH_MOTION_QUESTION_VERSION,previousVersions:[{...clone(q),version:q.contentVersion||1}]};
});}
