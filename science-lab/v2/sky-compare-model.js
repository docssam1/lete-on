// 교재의 관찰 계획은 조건만 비교한다. 아직 결과가 없는 계획에 관찰값을 만들지 않는다.
export const SKY_JUDGMENTS=Object.freeze({fair:'비교 조건이 알맞다',revise:'계획을 고쳐야 한다',unknown:'자료를 더 살펴보겠다'});
export const SKY_NOTICE='여러 날 달의 모양과 위치를 비교하기 위한 가상 계획이에요. 실제 관찰 결과는 아직 없어요.';
const plans={
 a:{label:'가',places:['같은 곳','같은 곳'],times:['저녁 7시','저녁 7시'],sources:['직접 관찰','직접 관찰'],fair:true,reason:'장소·시각·기록 종류를 맞추었어요. 실제로 관찰할 때에는 날짜·바라본 방향·날씨와 가림도 남겨요.'},
 b:{label:'나',places:['같은 곳','같은 곳'],times:['저녁 7시','새벽 6시'],sources:['직접 관찰','직접 관찰'],fair:false,reason:'시각이 달라요. 같은 저녁 시각의 변화를 알아보려면 시각을 맞추어요. 이미 다른 시각에 본 기록은 지우지 않고 조건을 밝혀 따로 비교해요.'},
 c:{label:'다',places:['같은 곳','다른 곳'],times:['저녁 7시','저녁 7시'],sources:['직접 관찰','직접 관찰'],fair:false,reason:'관찰 장소도 달라요. 날짜에 따른 위치를 비교하려면 같은 장소와 기준 풍경·방향을 맞추어요. 장소가 달랐던 기록은 그 사실을 남겨요.'},
 d:{label:'라',places:['같은 곳','같은 곳'],times:['저녁 7시','저녁 7시'],sources:['직접 관찰','예상 그림'],fair:false,reason:'예상 그림은 직접 관찰 결과가 아니에요. 직접 본 날과 아직 보지 않은 날을 나누고, 확인하지 못한 모양을 관찰값으로 채우지 않아요.'},
};
const clone=x=>JSON.parse(JSON.stringify(x));
export const SKY_PLAN_IDS=Object.freeze(Object.keys(plans));
export function skyPlan(id){if(!Object.hasOwn(plans,id))throw new RangeError('없는 관찰 계획');return clone(plans[id]);}
export function skyCompareRecord(id,judgment){if(!Object.hasOwn(SKY_JUDGMENTS,judgment))throw new RangeError('먼저 판단해요.');return {kind:'sky-compare',plan:id,judgment,material:skyPlan(id)};}
export function validSkyCompareRow(row){if(row?.kind!=='sky-compare'||!Object.hasOwn(plans,row.plan)||!Object.hasOwn(SKY_JUDGMENTS,row.judgment)||!row.material)return false;return Object.entries(skyPlan(row.plan)).every(([key,value])=>JSON.stringify(row.material[key])===JSON.stringify(value));}
export const skyCompareValues=row=>[row.material.label,SKY_JUDGMENTS[row.judgment],row.material.reason];
export function skyComparisonProgress(rows){const done=new Set((Array.isArray(rows)?rows:[]).filter(validSkyCompareRow).map(r=>r.plan)).size;return {done,total:SKY_PLAN_IDS.length,complete:done===SKY_PLAN_IDS.length};}
