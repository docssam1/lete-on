import {questions} from './c22-s61-u04.questions.js';
export const earthMotionKey=n=>'c22-s61-u04-b'+String(n).padStart(3,'0');
export const EARTH_MOTION_CHECK_NUMBERS=[1,4,22,27,35,39,53,62,69,73,87,94,107,110,121,128];
const formats={single:'객관식',multiple:'복수 선택',blank:'빈칸 넣기',match:'연결하기',sequence:'순서 배열',data:'자료 해석',reason:'까닭 설명','draw-design':'그림·설계'};
export function earthMotionAuthoredItems(taxonomy){
 const types=Object.fromEntries(taxonomy.types.map(t=>[t.id,t]));
 return questions.map(q=>{
  const t=types[q.type];if(!t)throw Error('지구의 운동 창작 유형 없음 '+q.type);
  const c=q.responseContract;let ac;
  if(c.kind==='single-choice')ac={type:'single-choice',answer:c.answer};
  else if(c.kind==='multi-choice')ac={type:'multi-choice',answers:c.answers};
  else if(c.teacherRequired)ac={type:'written-explanation',sample:q.answer,teacherRequired:true,rubric:{required:q.requirements,pass:'그림·근거와 실제 수행은 교사 확인 · 타당한 동등 표현 인정'}};
  else ac={type:'short-text',answer:q.answer,accepted:[q.answer],inputHint:c.kind==='ordered-label-sequence'?'보기의 기호를 순서대로 써요.':'각 이름표의 답을 따로 써요.'};
  ac.earthAuthoredContract=c;
  const givens={};
  if(q.givens)givens.조건=q.givens;
  if(q.table)givens.자료표=q.table;
  if(q.options)givens.보기={머리:['보기'],행:q.options.map(s=>[s])};
  if(q.parts)givens.문항={머리:['연결할 설명'],행:q.parts.map(s=>[s])};
  return {id:earthMotionKey(q.no),type:q.type,status:'authored',sourceRef:{type:'authored-supplement',label:'현행 범위 독립 창작',bookNo:q.no,section:q.sectionTitle,originalExam:false},bookResponseForm:q.bookResponseForm,bookQuestionId:q.id,taxonomy:{curriculum:'2022 개정',grade:6,semester:1,unit:'u04',area:'지구와 우주',element:t.element,type:t.id,format:formats[q.bookResponseForm],level:'기본',track:'교과',standard:q.standard,topic:q.topic,concept:t.name,inquirySkill:t.desc},prompt:q.prompt,givens:Object.keys(givens).length?givens:null,choices:q.choices||null,responseContract:c,answerContract:ac,explanation:q.explanation,standards:[q.standard],originalPromptCopied:false,originalFigureReused:false,evidence:q.evidence,...(q.verificationModel?{verificationModel:q.verificationModel}:{})};
 });
}
