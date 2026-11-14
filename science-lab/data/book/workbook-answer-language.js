import{materialEarthLanguage}from'./material-earth-student-language.js';
import{magnetSkyLanguage}from'./magnet-sky-student-language.js';
import{solutionQuantityLanguage}from'./solution-student-language.js';
export const WORKBOOK_ANSWER_LANGUAGE_VERSION='20261105-workbook-answer-language';
export const WORKBOOK_ANSWER_LANGUAGE_UNITS=Object.freeze(['c22-s32-u01','c22-s32-u02','s41-u01','c22-s42-u01','c22-s51-u03']);
const night=[
 ['미확인 생각','아직 확인하지 못한 생각'],
 ['공통점·차이·미확인을 설명해요','공통점·차이점과 더 알아볼 점을 설명해요'],
 ['공통점/차이 또는 미확인','공통점/차이 또는 아직 알 수 없는 점'],
 ['찾지 못하면 미확인으로 남긴다.','찾지 못하면 그 사실을 기록한다.'],
 ['확인하지 못하면 미확인으로 남기는 등','아직 확인하지 못한 내용은 더 알아볼 점으로 남기는 등'],
 ['미확인을 구별한다','아직 확인하지 못한 내용을 구별한다'],
 ['실제 미확인 상태','실제 하늘에서 찾지 못한 상태'],
 ['미확인·다음 확인점','아직 찾지 못한 별과 다음 관찰 계획'],
 ['확대 지형 / 미확인 /','확대 지형 / 더 알아볼 점 /'],
];
function wording(value,unit){
 if(unit==='c22-s32-u01'&&value==='물체·물질·성질을 구별하고 자료에서 확인한 시료의 범위 안에서 설명해요.')return '물체와 물질을 구별하고, 관찰한 물질의 성질을 근거로 설명해요.';
 if(unit==='c22-s32-u02'&&value==='자료에 나타난 장소·시료·조건에서 확인한 것과 더 확인할 것을 나누어요.')return '자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.';
 if(unit==='c22-s32-u01')return materialEarthLanguage(value.replaceAll('다 시료는','다로 표시한 재료는').replaceAll('이번 플라스틱 시료 하나예요.','이번에 관찰한 플라스틱 판이에요.'),unit);
 if(unit==='c22-s32-u02')return materialEarthLanguage(value,unit);
 if(unit==='c22-s51-u03')return solutionQuantityLanguage(value)
  .replaceAll('따뜻한 많은 물과 차가운 적은 물을 비교하면 두 변인이 섞인다.','물의 양과 온도를 함께 바꾸면 어느 조건 때문에 녹는 양이 달라졌는지 알기 어려워요.')
  .replaceAll('알아볼 용질 종류를 바꾸고 물의 양과 온도를 맞춘다. 다른 선택은 다른 질문이거나 변인이 섞였다.','용질의 종류만 바꾸고 물의 양과 온도를 같게 해요. 그래야 용질의 종류에 따라 녹는 양을 비교할 수 있어요.');
 const text=magnetSkyLanguage(value,unit);return unit==='c22-s42-u01'?night.reduce((s,[a,b])=>s.replaceAll(a,b),text):text;
}
// Printed explanations and sample wording only. Scoring keys, accepted strings,
// source contracts, historical versions, page references and writing space remain intact.
export function withWorkbookAnswerLanguage(workbook){
 if(!WORKBOOK_ANSWER_LANGUAGE_UNITS.includes(workbook.unit)||workbook.questions.length!==(workbook.unit==='c22-s51-u03'?96:80))throw Error('해설 용어 편집 대상이 다릅니다.');
 return {...workbook,questions:workbook.questions.map(q=>{
  let next=q;for(const key of['answer','explanation','criteria','misconception'])if(typeof q[key]==='string'){
   const text=wording(q[key],workbook.unit);if(text!==q[key]){if(next===q)next={...q};next[key]=text;}
  }return next;
 })};
}
