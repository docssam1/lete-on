// 독립 교재 원고용 어댑터. 실제 단원·차례·교재 연결과 출력 검수는 별도이다.
import {questions} from './c22-s62-u04.questions.js';
export const careerKey=n=>'c22-s62-u04-b'+String(n).padStart(3,'0');
const formats={single:'객관식',multiple:'복수 선택',blank:'빈칸 넣기',match:'연결하기',sequence:'순서 배열',data:'자료 해석',reason:'까닭 설명','draw-design':'그림·설계'};
export function careerAuthoredItems(taxonomy){
 const types=Object.fromEntries(taxonomy.types.map(t=>[t.id,t]));
 return questions.map(q=>{
  const t=types[q.type];if(!t)throw Error('진로 창작 유형 없음 '+q.type);
  const c=q.responseContract;let ac;
  if(c.kind==='single-choice')ac={type:'single-choice',answer:c.answer};
  else if(c.kind==='multi-choice')ac={type:'multi-choice',answers:c.answers};
  else if(c.teacherRequired)ac={type:'written-explanation',sample:q.answer,teacherRequired:true,rubric:{required:q.requirements,pass:'자료·업무·과학 연결 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요.'}};
  else ac={type:'short-text',answer:q.answer,accepted:[q.answer],inputHint:c.kind==='ordered-label-sequence'?'기호를 순서대로 써요.':'각 부분의 답과 필요한 단위를 따로 써요.'};
  ac.seasonContract=c;
  const givens={};if(q.givens)givens.조건=q.givens;if(q.table)givens.자료표=q.table;if(q.options)givens.보기={머리:['보기'],행:q.options.map(s=>[s])};if(q.parts)givens.문항={머리:['연결할 설명'],행:q.parts.map(s=>[s])};
  return {id:careerKey(q.no),type:q.type,status:'authored',sourceRef:{type:'authored-supplement',label:'현행 범위 독립 창작',bookNo:q.no,section:q.sectionTitle,originalExam:false},bookResponseForm:q.bookResponseForm,bookQuestionId:q.id,taxonomy:{curriculum:'2022 개정',grade:6,semester:2,unit:'u04',area:'과학과 사회',element:'E'+q.section,type:t.id,format:formats[q.bookResponseForm],level:'기본',track:'교과',standard:q.standard,topic:q.topic,concept:t.name,inquirySkill:t.desc},prompt:q.prompt,givens:Object.keys(givens).length?givens:null,choices:q.choices||null,responseContract:c,answerContract:ac,explanation:q.explanation,standards:[q.standard],originalPromptCopied:false,originalFigureReused:false,evidence:q.evidence,...(q.verificationModel?{verificationModel:q.verificationModel}:{})};
 });
}
