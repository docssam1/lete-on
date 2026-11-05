import {withAcidItemStandards} from '../data/book/c22-s61-u01.standards.js';
import {acidClass20261104Workbook as workbook} from '../data/book/c22-s61-u01.workbook.js?v=20261105-acid-student-language';
import {ACID_QUESTION_LANGUAGE} from '../data/book/c22-s61-u01.editorial.js?v=20261104-acid-book';
export const ACID_QUESTION_VERSION='20261104-acid-class';
const typeFor={39:'T06',45:'T06',63:'T09',67:'T03',75:'T06',76:'T06',79:'T09',80:'T09',90:'T03',94:'T09',95:'T09',96:'T09',115:'T09',117:'T09',118:'T04',122:'T09',124:'T09',126:'T03',128:'T09'};
const element={T03:'E2',T04:'E2',T06:'E3',T09:'E6'};
const standard={T03:'6과09-01',T04:'6과09-01',T06:'6과09-02',T09:'6과09-04'};
// 원래 문항과 답을 보존하고 검수한 교재의 표현을 버전별로 적용한다.
export function acidCurrentItems(rows){return rows.map(q=>{
 if(q.contentVersion===ACID_QUESTION_VERSION||q.previousVersions?.some(p=>p.version===ACID_QUESTION_VERSION))return q;
 const w=workbook.questions.find(w=>w.id===q.workbookRef?.id),patch=w&&ACID_QUESTION_LANGUAGE[w.id];if(!patch)return q;
 const type=typeFor[w.no]||q.taxonomy.type,answerContract={...q.answerContract};
 if(answerContract.type==='written-explanation'){answerContract.sample=w.answer;answerContract.rubric={...answerContract.rubric,required:[w.criteria]};answerContract.reviewRequired=true;}
 if(Object.hasOwn(patch,'answer')&&answerContract.type==='short-text'){answerContract.answer=w.answer;answerContract.accepted=w.accepted||[w.answer];}
 const givens=patch.parts?{...q.givens,문항:w.parts}:patch.given?{...q.givens,자료:w.given}:q.givens;
 const sameMeaning=[35,45,68,107].includes(w.no),diagnostic=type==='T11'?'M09':`M${type.slice(1)}`;
 const diagnosticOverride={version:ACID_QUESTION_VERSION,typed:answerContract.type==='short-text'?{any:diagnostic}:null,distractors:null,cloze:null,cells:null};
 if(w.choices)diagnosticOverride.distractors=Object.fromEntries(w.choices.map((_,i)=>[i,[].concat(w.key).includes(i)?null:diagnostic]).filter(([,v])=>v));
 return {...q,prompt:w.prompt,...(patch.choices?{choices:w.choices}:{}),...(givens?{givens}:{}),explanation:w.explanation,misconception:w.misconception,answerContract,
  taxonomy:{...q.taxonomy,type,element:element[type]||q.taxonomy.element,standard:standard[type]||q.taxonomy.standard,topic:w.topic,concept:workbook.pages.find(p=>p.blocks.some(b=>b.type==='questions'&&b.ids.includes(w.id)))?.title||w.topic,inquirySkill:'관찰한 변화와 비교 조건을 근거로 설명하기'},
  ...(!sameMeaning?{diagnosticOverride}:{}),contentVersion:ACID_QUESTION_VERSION,previousVersions:[{version:q.contentVersion||1,...JSON.parse(JSON.stringify(q))}]};
}).map(withAcidItemStandards);}
