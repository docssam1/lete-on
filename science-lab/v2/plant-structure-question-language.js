import{plantStructureReadablePriorWorkbook as workbook}from'../data/book/c22-s61-u03.workbook.js?v=20261106-plant-structure-readable-workbook';
import{PLANT_QUESTION_PATCHES}from'../data/book/c22-s61-u03.editorial.js?v=20261104-plant-structure-book';
import{taxonomy}from'../data/units/c22-s61-u03.taxonomy.js';
export const PLANT_STRUCTURE_QUESTION_VERSION='20261104-plant-structure-class';
export const PLANT_STRUCTURE_CHANGED_NUMBERS=Object.freeze(Object.keys(PLANT_QUESTION_PATCHES).map(Number));
const clone=x=>JSON.parse(JSON.stringify(x)),diagnosticFor={114:'M07',119:'M13',120:'M09',121:'M03',122:'M13',125:'M05'};
export function plantStructureCurrentItems(rows){return rows.map(q=>{
 if(q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||(q.contentVersion||1)!==1)return q;
 const w=workbook.questions.find(w=>w.id===q.bookQuestionId);if(!w||!PLANT_STRUCTURE_CHANGED_NUMBERS.includes(w.no))return q;
 const t=taxonomy.types.find(t=>t.id===w.type),ac={...clone(q.answerContract),plantAuthoredContract:clone(w.responseContract)};
 if(ac.type==='short-text'){ac.answer=w.answer;ac.accepted=[...new Set([w.answer,...w.accepted||[]])];}
 if(ac.type==='written-explanation'){ac.sample=w.answer;ac.rubric={...ac.rubric,required:w.requirements||[w.criteria]};ac.reviewRequired=true;}
 const givens={};if(w.dataNature)givens['자료 구분']='제공된 연습 자료';if(w.table)givens.자료표={머리:w.table.heads,행:w.table.rows};if(w.given)givens.보기={머리:['보기'],행:w.given.map(s=>[s])};if(w.parts)givens.문항=w.parts;
 const mis=diagnosticFor[w.no],diagnosticOverride=mis?{version:PLANT_STRUCTURE_QUESTION_VERSION,typed:ac.type==='short-text'?{any:mis}:null,distractors:w.choices?Object.fromEntries(w.choices.map((_,i)=>[i,[].concat(w.key).includes(i)?null:mis]).filter(([,m])=>m)):null,cloze:null,cells:null}:null;
 return{...q,prompt:w.prompt,choices:w.choices||null,givens:Object.keys(givens).length?givens:null,answerContract:ac,explanation:w.explanation,misconception:w.misconception,workbookRef:{id:w.id,no:w.no},taxonomy:{...q.taxonomy,type:w.type,element:t.element,standard:w.standard,topic:w.topic,concept:t.name,inquirySkill:t.desc},...(diagnosticOverride?{diagnosticOverride}:{}),contentVersion:PLANT_STRUCTURE_QUESTION_VERSION,previousVersions:[{version:q.contentVersion||1,...clone(q)}]};
});}
