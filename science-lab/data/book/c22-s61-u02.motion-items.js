// 같은 창작 원고를 수업·문제은행에서 읽는다. 원문/짝의 번호와 객체는 바꾸지 않는다.
import {questions} from './c22-s61-u02.questions.js';
import {art} from './c22-s61-u02.figures.js';
export const motionKey=n=>'c22-s61-u02-b'+String(n).padStart(3,'0');
export const MOTION_CHECK_NUMBERS=[1,9,27,33,52,67,69,79,81,96,98,104,107,113,126,128];
const labels={choice:'객관식',multi:'복수 선택',blank:'빈칸 넣기',short:'단답형',match:'연결하기',order:'순서 배열',written:'서술형',draw:'그림 완성'};
export function motionAuthoredItems(taxonomy){
 const by=Object.fromEntries(taxonomy.types.map(t=>[t.id,t]));
 return questions.map(q=>{
  const type=by[q.type];if(!type)throw Error('운동 유형 없음 '+q.type);
  let ac;
  if(q.form==='choice')ac={type:'single-choice',answer:q.key,accepted:[q.key]};
  else if(q.form==='multi')ac={type:'multi-choice',answers:q.key};
  else if(['written','draw'].includes(q.form))ac={type:'written-explanation',sample:q.answer,rubric:{required:q.requirements,pass:'실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정'}};
  else ac={type:'short-text',answer:q.answer,accepted:[...new Set([q.answer,...q.accepted||[]])]};
  ac.motionContract=q.responseContract;
  const givens={};
  if(q.table)givens.자료표={머리:q.table.heads,행:q.table.rows};
  if(q.given)givens.보기={머리:['보기'],행:q.given.map(x=>[x])};
  if(q.parts)givens.문항=q.parts;
  return {id:motionKey(q.no),status:'authored',sourceRef:{type:'authored-supplement',label:'현행 범위 독립 창작',bookNo:q.no,section:'교과 연결 사고력'},bookResponseForm:q.form,bookQuestionId:q.id,taxonomy:{curriculum:'2022 개정',grade:6,semester:1,unit:'u02',area:'운동과 에너지',element:type.element,type:q.type,format:labels[q.form],level:'기본',track:'교과',standard:q.standard,topic:q.topic,concept:type.name,inquirySkill:type.desc},prompt:q.prompt,givens:Object.keys(givens).length?givens:null,choices:q.choices||null,...(q.plot?{visualModel:{kind:'authored-svg',figure:q.figure,html:art[q.figure]}}:{}),responseContract:ac.type,answerContract:ac,explanation:q.explanation,evidence:{checkedBy:'창작 원고 재독·자료모형/응답 계약 검산',date:'2026-10-21',gates:['authored','science','answer'],note:'독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록.'}};
 });
}
