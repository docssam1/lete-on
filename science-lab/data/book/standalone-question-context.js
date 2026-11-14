export const STANDALONE_CONTEXT_VERSION='20261115-standalone-question-context';
const clone=value=>JSON.parse(JSON.stringify(value));
const bacteriaFigure='assets/bank/s41-u04/s3-q11.webp';
const bacteriaNote='세균의 네 가지 확대 사진. 오른쪽 위에는 초록색으로 표현된 길쭉한 막대 모양의 세균이 보입니다.';
// The three existing rows from career question 18, shared without loading its full manuscript.
const waterTable={머리:['상황','쓸 수 있는 물','필요한 물'],행:[['ㄱ','60 L','50 L'],['ㄴ','60 L','70 L'],['ㄷ','60 L','55 L']]};
const waterNotice='연습을 위해 만든 자료예요. 실제 지역·인물의 통계나 학생이 직접 조사한 결과, 진로 검사 결과는 아니에요.';
const entries={
 's41-u04-b09':{
  unit:'s41-u04',version:'20261106-biology-readable-workbook',
  prompt:'세균의 전자 현미경 사진을 초록색으로 처리했습니다. 사진만으로 말할 수 있는 것을 고르세요.',
  fields:{prompt:'다음 확대 사진의 오른쪽 위를 보세요. 초록색은 구별하기 쉽게 입힌 색이라고 정했어요. 사진만 보고 말할 수 있는 것을 고르세요.',figure:bacteriaFigure,figureNote:bacteriaNote},
 },
 's41-u04-b16':{
  unit:'s41-u04',version:'20261106-biology-readable-workbook',
  prompt:'초록색으로 색을 입힌 세균 사진을 보고 “초록색이니 식물처럼 잎이 있다”고 적었어요. 이 기록을 어떻게 고쳐야 할까요?',
  fields:{prompt:'다음 확대 사진의 오른쪽 위를 보고 “초록색이니 식물처럼 잎이 있다”고 적었어요. 초록색은 구별하기 쉽게 입힌 색이라고 정했어요. 이 기록을 어떻게 고쳐야 할까요?',figure:bacteriaFigure,figureNote:bacteriaNote},
 },
 'c22-s62-u04-b032':{
  unit:'c22-s62-u04',version:'20261107-career-readable-workbook',
  prompt:'이 연습 자료에서 물이 부족한 까닭을 더 알아보려 해요. 물이 오는 곳·쓰이는 곳·시기와 알아볼 질문을 연결해 그리세요.',
  fields:{givens:{조건:waterNotice,자료표:waterTable}},
 },
};
const cache=new WeakMap();
export function standaloneQuestionContexts(rows,unit){
 if(!['s41-u04','c22-s62-u04'].includes(unit)||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const entry=Object.hasOwn(entries,q.id)?entries[q.id]:null;
  if(!entry||entry.unit!==unit||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||q.contentVersion!==entry.version||q.prompt!==entry.prompt||q.givens!=null||q.figure||q.photoLabels||q.sourceContent||q.visualModel)return q;
  changed=true;if(cache.has(q))return cache.get(q);
  const current={...q,...clone(entry.fields),contentVersion:STANDALONE_CONTEXT_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion,snapshotKind:'full-question'}]};
  cache.set(q,current);return current;
 });
 return changed?next:rows;
}
export function withStandaloneContextClassroom(unit,mod){
 const items=standaloneQuestionContexts(mod.classroomItems,unit);
 return items===mod.classroomItems?mod:{...mod,classroomItems:items};
}
export function withCareerStandaloneContext(workbook){
 if(workbook.unit!=='c22-s62-u04')return workbook;
 const entry=entries['c22-s62-u04-b032'];let changed=false;
 const questions=workbook.questions.map(q=>{
  if(q.id!=='c22-s62-u04-w032'||q.prompt!==entry.prompt||q.given||q.givens||q.figure||q.table)return q;
  if(!workbook.figures?.['career-question-data-18'])return q;
  changed=true;
  return {...q,givens:waterNotice,given:[waterNotice],table:clone(waterTable),figure:'career-question-data-18'};
 });
 return changed?{...workbook,questions}:workbook;
}
