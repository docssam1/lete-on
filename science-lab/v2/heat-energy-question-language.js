import{HEAT_QUESTION_LANGUAGE}from'../data/book/c22-s52-u02.editorial.js?v=20261104-heat-book';
import{ENERGY_QUESTION_LANGUAGE}from'../data/book/c22-s52-u04.editorial.js?v=20261104-energy-book';
export const HEAT_BANK_VERSION='20261104-heat-class';
export const ENERGY_BANK_VERSION='20261104-energy-class';
const clone=value=>JSON.parse(JSON.stringify(value));
// Share the already reviewed classroom revision with the current question bank.
// Original and similar banks keep their canonical text and answer contracts.
export function heatEnergyCurrentItems(rows,unit){
 if(!['c22-s52-u02','c22-s52-u04'].includes(unit))return rows;
 const heat=unit==='c22-s52-u02',version=heat?HEAT_BANK_VERSION:ENERGY_BANK_VERSION;
 return rows.map(q=>{
  const n=q.workbookRef?.no;
  if(q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||(q.contentVersion||1)!==1||q.workbookRef?.unit!==unit||q.id!==`${unit}-b${String(n).padStart(3,'0')}`||!(heat?[65,67].includes(n):n===51)||q.contentVersion===version||q.previousVersions?.some(p=>p.version===version))return q;
  const l=(heat?HEAT_QUESTION_LANGUAGE:ENERGY_QUESTION_LANGUAGE)[q.workbookRef.id];if(!l)throw Error(`검토한 수업 문항이 없습니다: ${q.id}`);
  const patch=heat?(n===65?{givens:{...q.givens,보기:l.given},explanation:l.explanation}:{prompt:l.prompt,explanation:l.explanation,misconception:l.misconception,taxonomy:{...q.taxonomy,topic:l.topic},answerContract:{...q.answerContract,sample:l.answer,reviewRequired:true,rubric:{...q.answerContract.rubric,required:[l.criteria]}}}):{prompt:l.prompt,explanation:l.explanation,misconception:l.misconception,taxonomy:{...q.taxonomy,element:'E6',type:'T05',topic:l.topic,concept:'같은 효과의 에너지 이용·자료 비교',inquirySkill:'개념과 이용 연결'},diagnosticOverride:{version,typed:null},answerContract:{...q.answerContract,answer:l.answer,accepted:l.accepted}};
  return{...q,...patch,contentVersion:version,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{version:q.contentVersion||1,...clone(q)}]};
 });
}
