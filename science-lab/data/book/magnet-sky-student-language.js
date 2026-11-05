export const MAGNET_SKY_LANGUAGE_VERSION='20261105-magnet-sky-student-language';
const units=new Set(['s41-u01','c22-s42-u01']);
const poleTool='막대/말굽은 두 끝에, 고리/둥근기둥/동전 모양은 넓은 두 면에 N/S극이 하나씩 있는 두 극 교구를 사용합니다. 고리 탑은 곧은 비자성 막대가 옆 움직임을 잡아 줍니다.';
const words={
 's41-u01':[
  [poleTool,'이 자료의 막대자석과 말굽자석은 두 끝에 N극과 S극이 있어요. 고리·둥근기둥·동전 모양 자석은 넓은 두 면에 N극과 S극이 하나씩 있어요. 가운데 막대는 자석에 붙지 않고 고리의 옆 움직임을 잡아 줘요.'],
  ['여러 재료 시료','여러 재료로 만든 물체'],['나무젓가락 시료를','나무젓가락을'],['시료','물체'],['비자성 가이드','자석에 붙지 않는 가운데 막대'],['비자성 막대','자석에 붙지 않는 막대'],['가이드','가운데 막대'],['사이 면','마주 보는 면'],['교구의 극 위치','자석의 극 위치'],
 ],
 'c22-s42-u01':[
  ['미관찰과 실제 기록의 구별','달을 보지 못한 날의 기록'],['미관찰 날','달을 관찰하지 못한 날'],['미관찰 표시','관찰하지 못했다는 표시'],
  ['미실행으로 표시하고 이유를 적는다.','관찰하러 나가지 못했다고 적고 그 까닭을 남긴다.'],['미확인을 기록하고 다음 기회를 정한다.','찾지 못했다고 적고 다음 관찰 계획을 세운다.'],
  ['미확인 내용을 표시할 방법','아직 확인하지 못한 내용을 적는 방법'],['근거에 맞는 공통점·차이와 미확인 설명하기','자료로 알 수 있는 공통점·차이점과 더 알아볼 점 설명하기'],
  ['같은 기준 두 가지로 공통점·차이와 미확인을 구별하고 출처 자리를 넣으세요.','같은 기준 두 가지로 공통점·차이점과 아직 알 수 없는 것을 구별하고, 자료의 출처를 적을 자리를 넣으세요.'],
  ['카드에 없는 특징은 미확인으로 남겨요.','카드에 나오지 않은 특징은 더 조사할 내용으로 남겨요.'],
 ],
};
export function magnetSkyLanguage(value,unit){
 if(!units.has(unit))return value;
 if(typeof value==='string')return words[unit].reduce((s,[a,b])=>s.replaceAll(a,b),value);
 if(Array.isArray(value))return value.map(v=>magnetSkyLanguage(v,unit));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,magnetSkyLanguage(v,unit)]));
 return value;
}
export function magnetSkyQuestionPresentation(q,unit,book=false){
 const next={...q};for(const key of (book?['topic','prompt','choices','given','parts']:['prompt','choices','givens']))if(Object.hasOwn(q,key))next[key]=magnetSkyLanguage(q[key],unit);
 if(!book&&q.taxonomy?.topic)next.taxonomy={...q.taxonomy,topic:magnetSkyLanguage(q.taxonomy.topic,unit)};
 return JSON.stringify(next)===JSON.stringify(q)?q:next;
}
export function withMagnetSkyStudentLanguage(workbook){
 if(!units.has(workbook.unit)||workbook.questions.length!==80)throw Error('자석/밤하늘 문항 편집 대상이 다릅니다.');
 return {...workbook,questions:workbook.questions.map(q=>magnetSkyQuestionPresentation(q,workbook.unit,true)),
  figures:Object.fromEntries(Object.entries(workbook.figures).map(([key,html])=>[key,html.replace(/>([^<]*)</g,(_,text)=>'>'+magnetSkyLanguage(text,workbook.unit)+'<')]))};
}
