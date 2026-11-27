export const MATERIAL_EARTH_LANGUAGE_VERSION='20261105-material-earth-student-language';
const units=new Set(['c22-s32-u01','c22-s32-u02']);
const clone=value=>JSON.parse(JSON.stringify(value));
function waterNoun(text,from,to){
 for(const [a,b]of[['라고','이라고'],['라는','이라는'],['는','은'],['가','이'],['를','을'],['와','과']])text=text.replaceAll(from+a,to+b);
 return text.replaceAll(from,to);
}
export function materialEarthLanguage(value,unit){
 if(!units.has(unit))return value;
 if(typeof value==='string'){
  if(unit==='c22-s32-u01')return value
   .replaceAll('시료의 구부러짐을 공정하게 비교하려면 어떻게 준비할까요?','재료에 따라 구부러지는 정도를 비교하려면 어떤 조건을 맞춰야 할까요?')
   .replaceAll('플라스틱 시료 하나가 불투명했어요.','관찰한 플라스틱은 불투명했어요.')
   .replaceAll('시료의 재료','물체를 이루는 재료').replaceAll('시료','재료')
   .replaceAll('공정한 비교','조건을 맞춘 비교').replaceAll('실온에서','실내의 보통 온도에서');
  let text=value.replaceAll('공정한 비교를 위해 같게 맞출 조건은 무엇인가요?','두 물을 가열한 뒤 남은 물질을 비교하려면 무엇을 같게 해야 할까요?')
   .replaceAll('두 물의 공정한 비교','바닷물과 육지의 물 비교')
   .replaceAll('시료 비교에서 확인한 사실로 쓸 수 있는 문장 두 가지를 고르세요.','두 종류의 물을 가열한 결과에서 확인한 사실 두 가지를 고르세요.')
   .replaceAll('나 수돗물 시료의 남은 물질은 눈에 잘 안 띄었다.','나 수돗물을 가열한 뒤 남은 물질은 눈에 잘 안 띄었다.')
   .replaceAll('공정한 증발 비교','가열한 뒤 남은 물질 비교').replaceAll('공정한 비교','조건을 맞춘 비교')
   .replaceAll('시료 이름','물의 종류').replaceAll('시료 출처','물을 가져온 곳')
   .replaceAll('제공 교재 원본 · 촬영 시각 미확인. 한쪽 사진으로 전체 넓이를 확정하지 않아요.','제공 교재의 지구 사진 · 보이는 육지와 바다를 찾아보아요.');
  for(const [from,to]of[['바닷물 시료','바닷물'],['수돗물 시료','수돗물'],['두 시료','두 종류의 물'],['시료','물']])text=waterNoun(text,from,to);
  return text;
 }
 if(Array.isArray(value))return value.map(v=>materialEarthLanguage(v,unit));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,materialEarthLanguage(v,unit)]));
 return value;
}
function presentation(q,unit,book=false){
 const next={...q};for(const key of(book?['topic','prompt','choices','given','parts']:['prompt','choices','givens']))if(Object.hasOwn(q,key))next[key]=materialEarthLanguage(q[key],unit);
 if(!book&&q.taxonomy?.topic)next.taxonomy={...q.taxonomy,topic:materialEarthLanguage(q.taxonomy.topic,unit)};
 return JSON.stringify(next)===JSON.stringify(q)?q:next;
}
export function materialEarthCurrentItems(rows,unit){
 if(!units.has(unit))return rows;
 return rows.map(q=>{
  if(!q.id?.startsWith(unit+'-')||!/^[abt]\d+$/.test(q.id.slice(unit.length+1))||q.sourceRef?.type==='similar'||(q.status!=='authored'&&!q.id.startsWith(unit+'-t'))||q.contentVersion===MATERIAL_EARTH_LANGUAGE_VERSION)return q;
  const next=presentation(q,unit);if(next===q)return q;
  return {...next,contentVersion:MATERIAL_EARTH_LANGUAGE_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
 });
}
export function withMaterialEarthStudentLanguage(workbook){
 if(!units.has(workbook.unit)||workbook.questions.length!==80)throw Error('물체/지구바다 문항 편집 대상이 다릅니다.');
 return {...workbook,questions:workbook.questions.map(q=>presentation(q,workbook.unit,true)),figures:Object.fromEntries(Object.entries(workbook.figures).map(([key,html])=>[key,html.replace(/>([^<]*)</g,(_,text)=>'>'+materialEarthLanguage(text,workbook.unit)+'<')]))};
}
