import{observationPriorWorkbook as workbook}from'../data/book/c22-s61-u02.workbook.js?v=20261104-motion-book';
import{questions as original}from'../data/book/c22-s61-u02.questions.js';
import{taxonomy}from'../data/units/c22-s61-u02.taxonomy.js';
export const MOTION_QUESTION_VERSION='20261104-motion-class';
export const MOTION_CHANGED_NUMBERS=Object.freeze(workbook.questions.filter((q,i)=>JSON.stringify(q)!==JSON.stringify(original[i])).map(q=>q.no));
const clone=x=>JSON.parse(JSON.stringify(x)),typeFor={116:'T13',117:'T08',122:'T09',123:'T09'},diagnosticFor={115:'M05',120:'M06',121:'M07',117:'M08',122:'M09',123:'M09',128:'M08'};
export function motionCurrentItems(rows){return rows.map(q=>{
 if(q.contentVersion===MOTION_QUESTION_VERSION)return q;
 const w=workbook.questions.find(w=>w.id===q.bookQuestionId);if(!w||!MOTION_CHANGED_NUMBERS.includes(w.no))return q;
 const type=typeFor[w.no]||w.type,t=taxonomy.types.find(t=>t.id===type),ac={...clone(q.answerContract),motionContract:clone(w.responseContract)};
 if(ac.type==='short-text'){ac.answer=w.answer;ac.accepted=[...new Set([w.answer,...w.accepted||[]])];}
 if(ac.type==='written-explanation'){ac.sample=w.answer;ac.rubric={...ac.rubric,required:w.responseContract.required||[w.criteria]};ac.reviewRequired=true;}
 const givens={};if(w.table)givens.자료표={머리:w.table.heads,행:w.table.rows};if(w.given)givens.보기={머리:['보기'],행:w.given.map(s=>[s])};if(w.parts)givens.문항=w.parts;
 const mis=diagnosticFor[w.no]||`M${type.slice(1)}`,changedMeaning=[92,95,115,116,117,120,121,122,123,126,128].includes(w.no),diagnosticOverride={version:MOTION_QUESTION_VERSION,typed:ac.type==='short-text'?{any:mis}:null,distractors:w.choices?Object.fromEntries(w.choices.map((_,i)=>[i,[].concat(w.key).includes(i)?null:mis]).filter(([,m])=>m)):null,cloze:null,cells:null};
 return{...q,prompt:w.prompt,choices:w.choices||null,givens:Object.keys(givens).length?givens:null,answerContract:ac,explanation:w.explanation,misconception:w.misconception,workbookRef:{id:w.id,no:w.no},taxonomy:{...q.taxonomy,type,element:t.element,standard:w.standard,topic:w.topic,concept:t.name,inquirySkill:t.desc},...(changedMeaning?{diagnosticOverride}:{}),contentVersion:MOTION_QUESTION_VERSION,previousVersions:[{version:q.contentVersion||1,...clone(q)}]};
});}
