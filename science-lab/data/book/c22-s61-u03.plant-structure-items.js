import {questions} from './c22-s61-u03.questions.js';
export const plantStructureKey=n=>'c22-s61-u03-b'+String(n).padStart(3,'0');
export const PLANT_STRUCTURE_CHECK_NUMBERS=[1,14,19,22,36,48,50,55,67,68,85,91,99,110,118,128];
const labels={choice:'객관식',multi:'복수 선택',blank:'빈칸 넣기',short:'단답형',match:'연결하기',order:'순서 배열',written:'서술형',draw:'그림 설명'};
export function plantStructureAuthoredItems(taxonomy){
 const by=Object.fromEntries(taxonomy.types.map(t=>[t.id,t]));
 return questions.map(q=>{
  const t=by[q.type];if(!t)throw Error('식물 창작 유형 없음 '+q.type);
  let ac;
  if(q.form==='choice')ac={type:'single-choice',answer:q.key,accepted:[q.key]};
  else if(q.form==='multi')ac={type:'multi-choice',answers:q.key};
  else if(['written','draw'].includes(q.form))ac={type:'written-explanation',sample:q.answer,rubric:{required:q.requirements,pass:'그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정'}};
  else ac={type:'short-text',answer:q.answer,accepted:[...new Set([q.answer,...q.accepted||[]])],...(['match','order'].includes(q.form)?{inputHint:q.form==='match'?'(1), (2), (3)의 답을 각각 이름표와 함께 써요.':'보기의 기호를 순서대로 써요.'}:{})};
  ac.plantAuthoredContract=q.responseContract;
  const givens={};
  if(q.dataNature)givens['자료 구분']='제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.';
  if(q.table)givens.자료표={머리:q.table.heads,행:q.table.rows};
  if(q.given)givens.보기={머리:['보기'],행:q.given.map(v=>[v])};
  if(q.parts)givens.문항=q.parts;
  return {id:plantStructureKey(q.no),status:'authored',sourceRef:{type:'authored-supplement',label:'현행 범위 독립 창작',bookNo:q.no,section:'교과 연결 사고력'},bookResponseForm:q.form,bookQuestionId:q.id,taxonomy:{curriculum:'2022 개정',grade:6,semester:1,unit:'u03',area:'생명',element:t.element,type:q.type,format:labels[q.form],level:'기본',track:'교과',standard:q.standard,topic:q.topic,concept:t.name,inquirySkill:t.desc},prompt:q.prompt,givens:Object.keys(givens).length?givens:null,choices:q.choices||null,responseContract:ac.type,answerContract:ac,explanation:q.explanation,evidence:{date:'2026-10-21',checkedBy:'창작128원고 재독·응답 계약/4자료모형 검산·사적PC/390px 검수',gates:['authored','science','answer'],note:'독립 창작. 제공 연습 자료와 실제 학생 관찰/수행은 구별하며 수업/지면 검수는 별도로 기록한다.'}};
 });
}
