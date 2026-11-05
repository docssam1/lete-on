import{STUDENT_SCIENCE_LANGUAGE_VERSION,withStudentScienceQuestionLanguage}from'../data/book/student-science-language.js';
import{workbook20261104 as workbook}from'../data/book/c22-s62-u03.workbook.js?v=20261104-student-science-language';
import{questions as originalQuestions}from'../data/book/c22-s62-u03.questions.js';
import{taxonomy}from'../data/units/c22-s62-u03.taxonomy.js';
import{electricityLanguage}from'../data/book/c22-s62-u03.editorial.js?v=20261104-electricity-book';
export const ELECTRICITY_QUESTION_VERSION='20261104-electricity-book';
const clone=x=>JSON.parse(JSON.stringify(x)),byId=new Map(workbook.questions.map(q=>[q.id,q]));
export const ELECTRICITY_CHANGED_NUMBERS=Object.freeze(originalQuestions.filter(old=>{const w=byId.get(old.id);return Object.entries(old).some(([key,value])=>JSON.stringify(value)!==JSON.stringify(w[key]));}).map(q=>q.no));
export function electricityBookItems(rows){return rows.map(q=>{
 if(!q.id?.startsWith('c22-s62-u03-'))return q;
 if(q.contentVersion===ELECTRICITY_QUESTION_VERSION||q.contentVersion===STUDENT_SCIENCE_LANGUAGE_VERSION)return q;
 const w=byId.get(q.bookQuestionId);
 if(!w){
  if(q.bookQuestionId)return q;
  const next=electricityLanguage(q);if(JSON.stringify(next)===JSON.stringify(q))return q;
  const c=next.responseContract,old=q.responseContract;
  const aliases=(a,b)=>{if(a.accepted&&b.accepted)a.accepted=[...new Set([...a.accepted,...b.accepted])];};
  aliases(c,old);if(c.parts)c.parts.forEach((part,i)=>aliases(part,old.parts[i]));
  next.answerContract.seasonContract=clone(c);
  if(next.answerContract.type==='short-text')next.answerContract.accepted=[...new Set([...(next.answerContract.accepted||[]),...(q.answerContract.accepted||[])])];
  const mis='M'+(next.type||next.taxonomy.type).slice(1),ac=next.answerContract;
  const diagnosticOverride={version:ELECTRICITY_QUESTION_VERSION,typed:ac.type==='short-text'?{any:mis}:null,distractors:next.choices?Object.fromEntries(next.choices.map((_,i)=>[i,[].concat(c.answers??c.answer).includes(i)?null:mis]).filter(([,m])=>m)):null,cloze:null,cells:null};
  return{...next,diagnosticOverride,contentVersion:ELECTRICITY_QUESTION_VERSION,previousVersions:[{...clone(q),version:q.contentVersion||1}]};
 }
 if(!ELECTRICITY_CHANGED_NUMBERS.includes(w.no))return q;
 const t=taxonomy.types.find(t=>t.id===w.type),c=clone(w.responseContract),ac={...clone(q.answerContract),seasonContract:c};
 if(ac.type==='single-choice')ac.answer=c.answer;
 if(ac.type==='multi-choice')ac.answers=clone(c.answers);
 if(ac.type==='short-text'){ac.answer=w.answer;ac.accepted=[...new Set([w.answer,...(c.kind==='ordered-term-parts'&&c.parts.length===1?c.parts[0].accepted||[]:[])])];}
 if(ac.type==='written-explanation'){ac.sample=w.answer;ac.rubric={...ac.rubric,required:clone(w.requirements||c.required)};ac.teacherRequired=true;ac.reviewRequired=true;}
 const givens={};if(w.givens)givens.조건=clone(w.givens);if(w.table)givens.자료표=clone(w.table);if(w.options)givens.보기={머리:['보기'],행:w.options.map(s=>[s])};if(w.parts)givens.문항={머리:['문항'],행:w.parts.map(s=>[s])};
 const mis='M'+w.type.slice(1),diagnosticOverride={version:ELECTRICITY_QUESTION_VERSION,typed:ac.type==='short-text'?{any:mis}:null,distractors:w.choices?Object.fromEntries(w.choices.map((_,i)=>[i,[].concat(c.answers??c.answer).includes(i)?null:mis]).filter(([,m])=>m)):null,cloze:null,cells:null};
 return{...q,type:w.type,prompt:w.prompt,choices:w.choices?clone(w.choices):null,givens:Object.keys(givens).length?givens:null,responseContract:clone(c),answerContract:ac,standards:[w.standard],explanation:w.explanation,workbookRef:{id:w.id,no:w.no},verificationModel:w.verificationModel??null,taxonomy:{...q.taxonomy,type:w.type,element:'E'+w.section,standard:w.standard,topic:w.topic,concept:t.name,inquirySkill:t.desc},diagnosticOverride,contentVersion:ELECTRICITY_QUESTION_VERSION,previousVersions:[{...clone(q),version:q.contentVersion||1}]};
});}

export const electricityCurrentItems=rows=>withStudentScienceQuestionLanguage(electricityBookItems(rows),'c22-s62-u03');
