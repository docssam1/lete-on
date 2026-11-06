import{seasonReadablePriorWorkbook as workbook}from'../data/book/c22-s62-u01.workbook.js?v=20261106-season-readable-workbook';
import{questions as originalQuestions}from'../data/book/c22-s62-u01.questions.js';
import{taxonomy}from'../data/units/c22-s62-u01.taxonomy.js';
import{seasonLanguage}from'../data/book/c22-s62-u01.editorial.js?v=20261104-season-book';
export const SEASON_QUESTION_VERSION='20261104-season-book';
const clone=x=>JSON.parse(JSON.stringify(x)),byId=new Map(workbook.questions.map(q=>[q.id,q]));
export const SEASON_CHANGED_NUMBERS=Object.freeze(originalQuestions.filter(old=>{const w=byId.get(old.id);return Object.entries(old).some(([key,value])=>JSON.stringify(value)!==JSON.stringify(w[key]));}).map(q=>q.no));
export function seasonCurrentItems(rows){return rows.map(q=>{
 if(!q.id?.startsWith('c22-s62-u01-'))return q;
 if(q.status!=='authored'||!['authored-supplement','authored-pair'].includes(q.sourceRef?.type)||(q.contentVersion||1)!==1)return q;
 const w=byId.get(q.bookQuestionId);
 if(!w){
  if(q.bookQuestionId)return q;
  const next=seasonLanguage(q);if(JSON.stringify(next)===JSON.stringify(q))return q;
  const c=next.responseContract,old=q.responseContract;
  const aliases=(a,b)=>{if(a.accepted&&b.accepted)a.accepted=[...new Set([...a.accepted,...b.accepted])];};
  aliases(c,old);if(c.parts)c.parts.forEach((part,i)=>aliases(part,old.parts[i]));
  next.answerContract.seasonContract=clone(c);
  if(next.answerContract.type==='short-text')next.answerContract.accepted=[...new Set([...(next.answerContract.accepted||[]),...(q.answerContract.accepted||[])])];
  const mis='M'+(next.type||next.taxonomy.type).slice(1),ac=next.answerContract;
  const diagnosticOverride={version:SEASON_QUESTION_VERSION,typed:ac.type==='short-text'?{any:mis}:null,distractors:next.choices?Object.fromEntries(next.choices.map((_,i)=>[i,[].concat(c.answers??c.answer).includes(i)?null:mis]).filter(([,m])=>m)):null,cloze:null,cells:null};
  return{...next,diagnosticOverride,contentVersion:SEASON_QUESTION_VERSION,previousVersions:[{...clone(q),version:q.contentVersion||1}]};
 }
 if(!SEASON_CHANGED_NUMBERS.includes(w.no))return q;
 const t=taxonomy.types.find(t=>t.id===w.type),c=clone(w.responseContract),ac={...clone(q.answerContract),seasonContract:c};
 if(ac.type==='single-choice')ac.answer=c.answer;
 if(ac.type==='multi-choice')ac.answers=clone(c.answers);
 if(ac.type==='short-text'){ac.answer=w.answer;ac.accepted=[...new Set([w.answer,...(c.kind==='ordered-term-parts'&&c.parts.length===1?c.parts[0].accepted||[]:[])])];}
 if(ac.type==='written-explanation'){ac.sample=w.answer;ac.rubric={...ac.rubric,required:clone(w.requirements||c.required)};ac.teacherRequired=true;ac.reviewRequired=true;}
 const givens={};if(w.givens)givens.조건=clone(w.givens);if(w.table)givens.자료표=clone(w.table);if(w.options)givens.보기={머리:['보기'],행:w.options.map(s=>[s])};if(w.parts)givens.문항={머리:['문항'],행:w.parts.map(s=>[s])};
 const mis='M'+w.type.slice(1),diagnosticOverride={version:SEASON_QUESTION_VERSION,typed:ac.type==='short-text'?{any:mis}:null,distractors:w.choices?Object.fromEntries(w.choices.map((_,i)=>[i,[].concat(c.answers??c.answer).includes(i)?null:mis]).filter(([,m])=>m)):null,cloze:null,cells:null};
 return{...q,type:w.type,prompt:w.prompt,choices:w.choices?clone(w.choices):null,givens:Object.keys(givens).length?givens:null,responseContract:clone(c),answerContract:ac,standards:[w.standard],explanation:w.explanation,workbookRef:{id:w.id,no:w.no},taxonomy:{...q.taxonomy,type:w.type,element:t.element,standard:w.standard,topic:w.topic,concept:t.name,inquirySkill:t.desc},diagnosticOverride,contentVersion:SEASON_QUESTION_VERSION,previousVersions:[{...clone(q),version:q.contentVersion||1}]};
});}
