// 사진에서 확인할 수 있는 외형과 측정값이 필요한 기준을 구별한다. 실제 채집/측정 기록을 만들지 않는다.
// 정식 교재와 같은 원본 사진을 쓴다. 예전 기록 자료는 바꾸지 않는다.
export const LEAF_CASES=Object.freeze([
 {
  "id": "strawberry",
  "name": "딸기",
  "image": "../assets/activities/s31-u03/strawberry-native.webp",
  "serrated": true,
  "text": "사진 가운데 크게 보이는 부분의 가장자리에 톱니 모양이 보여요."
 },
 {
  "id": "magnolia",
  "name": "목련",
  "image": "../assets/activities/s31-u03/magnolia-native.webp",
  "serrated": false,
  "text": "사진에서 크게 보이는 잎의 가장자리는 매끈한 모양이에요."
 },
 {
  "id": "cherry",
  "name": "벚나무",
  "image": "../assets/activities/s31-u03/cherry-native.webp",
  "serrated": true,
  "text": "사진의 잎 가장자리에 톱니 모양이 보여요."
 },
 {
  "id": "hyacinth",
  "name": "부레옥잠",
  "image": "../assets/activities/s31-u03/hyacinth-native.webp",
  "serrated": false,
  "text": "사진에서 보이는 잎의 가장자리는 매끈한 모양이에요."
 }
].map(Object.freeze));
export const LEAF_PHOTO_CREDIT="지필드 이론편 4-2-1단계 교사용 · 8쪽과 같은 원본 잎 관찰 사진";
export const LEAF_CRITERIA=Object.freeze({serrated:Object.freeze({title:'사진의 잎 가장자리가 톱니 모양인가?',yes:'톱니 모양',no:'매끈한 모양'}),length:Object.freeze({title:'실제 잎 길이가 5 cm 이상인가?',yes:'5 cm 이상',no:'5 cm 미만'})});
export const LEAF_LABELS=Object.freeze({yes:'해당함',no:'해당하지 않음',unknown:'자료 더 필요'});
export const leafGroups=criterion=>{if(!Object.hasOwn(LEAF_CRITERIA,criterion))throw Error('기준을 확인해 주세요.');return Object.fromEntries(LEAF_CASES.map(a=>[a.id,criterion==='length'?'unknown':a.serrated?'yes':'no']));};
export const validLeafPlacements=p=>p&&typeof p==='object'&&!Array.isArray(p)&&Object.keys(p).length===LEAF_CASES.length&&LEAF_CASES.every(a=>Object.hasOwn(p,a.id)&&Object.hasOwn(LEAF_LABELS,p[a.id]));
export function leafCompareRecord(criterion,placements){if(!validLeafPlacements(placements))throw Error('네 잎의 판단이나 더 확인을 먼저 골라 주세요.');return{kind:'잎 사진 기준 비교',criterion,placements:{...placements},groups:leafGroups(criterion)};}
export function validLeafCompareRow(row){if(!row||row.kind!=='잎 사진 기준 비교'||!validLeafPlacements(row.placements))return false;try{const g=leafGroups(row.criterion);return row.groups&&Object.keys(row.groups).length===4&&LEAF_CASES.every(a=>row.groups[a.id]===g[a.id]);}catch{return false;}}
export const leafSummary=groups=>['yes','no','unknown'].flatMap(key=>{const names=LEAF_CASES.filter(a=>groups[a.id]===key).map(a=>a.name);return names.length?[`${LEAF_LABELS[key]}: ${names.join('·')}`]:[];}).join(' / ');
export const leafRowValues=r=>[LEAF_CRITERIA[r.criterion].title,leafSummary(r.placements),leafSummary(r.groups)];
export const LEAF_SCALE_NOTE='이 사진에는 직접 잰 길이나 실제 길이를 알려 주는 눈금이 없어요. 사진의 확대 비율도 같다고 정할 수 없어 네 잎 모두 실제 측정 자료가 더 필요해요. 자료 더 필요는 세 번째 생물 모둠이 아니라 판단을 보류한다는 뜻이에요.';
