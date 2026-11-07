import{STUDENT_SCIENCE_LANGUAGE_VERSION,withStudentScienceQuestionLanguage}from'../data/book/student-science-language.js';
import{workbook20261104 as workbook}from'../data/book/c22-s62-u04.workbook.js?v=20261104-student-science-language';
import{questions as originalQuestions}from'../data/book/c22-s62-u04.questions.js';
import{taxonomy}from'../data/units/c22-s62-u04.taxonomy-current.js';
const clone=x=>JSON.parse(JSON.stringify(x)),byId=new Map(workbook.questions.map(q=>[q.id,q]));
export const CAREER_QUESTION_VERSION='20261104-career-book';
export const CAREER_CHANGED_NUMBERS=Object.freeze(originalQuestions.filter(q=>Object.entries(q).some(([key,value])=>JSON.stringify(value)!==JSON.stringify(byId.get(q.id)[key]))).map(q=>q.no));
export function careerBookItems(rows){return rows.map(q=>{
 if(!q.id?.startsWith('c22-s62-u04-')||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||(q.contentVersion||1)!==1)return q;
 const w=byId.get(q.bookQuestionId);if(!w||!CAREER_CHANGED_NUMBERS.includes(w.no))return q;
 const t=taxonomy.types.find(t=>t.id===w.type),c=clone(w.responseContract),ac={...clone(q.answerContract),seasonContract:c};
 if(ac.type==='single-choice')ac.answer=c.answer;
 if(ac.type==='multi-choice')ac.answers=clone(c.answers);
 if(ac.type==='short-text'){ac.answer=w.answer;ac.accepted=[w.answer];}
 if(ac.type==='written-explanation'){ac.sample=w.answer;ac.rubric={...ac.rubric,required:clone(w.requirements||c.required)};ac.teacherRequired=true;ac.reviewRequired=true;}
 const givens={};if(w.givens)givens.조건=clone(w.givens);if(w.table)givens.자료표=clone(w.table);if(w.options)givens.보기={머리:['보기'],행:w.options.map(x=>[x])};if(w.parts)givens.문항={머리:['문항'],행:w.parts.map(x=>[x])};
 const mis='M'+(w.section===8?(w.type==='T15'?'17':'18'):w.type.slice(1));
 const diagnosticOverride={version:CAREER_QUESTION_VERSION,typed:ac.type==='short-text'?{any:mis}:null,distractors:w.choices?Object.fromEntries(w.choices.map((_,i)=>[i,[].concat(c.answers??c.answer).includes(i)?null:mis]).filter(([,m])=>m)):null,cloze:null,cells:null};
 return{...q,prompt:w.prompt,choices:w.choices?clone(w.choices):null,givens:Object.keys(givens).length?givens:null,responseContract:c,answerContract:ac,explanation:w.explanation,verificationModel:w.verificationModel??null,taxonomy:{...q.taxonomy,topic:w.topic,concept:t.name,inquirySkill:t.desc},workbookRef:{id:w.id,no:w.no},diagnosticOverride,contentVersion:CAREER_QUESTION_VERSION,previousVersions:[{...clone(q),version:q.contentVersion||1}]};
});}

export const careerCurrentItems=rows=>rows.map(q=>{if(!q.id?.startsWith('c22-s62-u04-')||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||![1,CAREER_QUESTION_VERSION,STUDENT_SCIENCE_LANGUAGE_VERSION].includes(q.contentVersion||1))return q;return withStudentScienceQuestionLanguage(careerBookItems([q]),'c22-s62-u04')[0];});
