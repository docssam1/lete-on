// 검수한 교재의 비교 계획 다섯 가지. 결과가 없는 계획에 관찰값을 만들지 않는다.
export const EARTH_SEA_JUDGMENTS={fair:'비교 조건이 알맞다',revise:'계획을 고쳐야 한다',unknown:'자료를 더 살펴보겠다'};
export const EARTH_SEA_NOTICE='두 물의 차이를 알아보기 위한 연습 계획이에요. 아직 가열한 결과가 아니며, 물의 종류 외 조건을 맞추었는지 판단해요.';
const plans={
 a:{label:'가',waters:['바닷물','수돗물'],amounts:[20,20],dishes:['깨끗함','깨끗함'],fair:true,reason:'물의 종류만 다르고 양과 접시 상태는 같아요.'},
 b:{label:'나',waters:['바닷물','수돗물'],amounts:[10,40],dishes:['깨끗함','깨끗함'],fair:false,reason:'물의 양도 달라요. 같은 양을 담아 물의 종류에 따른 차이를 비교해요.'},
 c:{label:'다',waters:['수돗물','수돗물'],amounts:[20,20],dishes:['깨끗함','깨끗함'],fair:false,reason:'두 접시의 물 종류가 같아 바닷물과 수돗물의 차이를 알아볼 수 없어요.'},
 d:{label:'라',waters:['바닷물','수돗물'],amounts:[20,20],dishes:['깨끗함','소금 묻음'],fair:false,reason:'한 접시에 소금이 묻어 있어요. 남은 것이 물에서 나온 것인지 구별하려면 접시를 모두 깨끗하게 준비해요.'},
 e:{label:'마',waters:['바닷물','수돗물'],amounts:[10,10],dishes:['깨끗함','깨끗함'],fair:true,reason:'이 비교안도 물의 종류만 다르고 두 접시의 양은 같아요. 가와 마의 양이 달라도 각 비교안 안에서 조건을 맞추었는지 살펴요.'},
};
const clone=value=>JSON.parse(JSON.stringify(value));
export const EARTH_SEA_PLAN_IDS=Object.keys(plans);
export function earthSeaPlan(id){if(!Object.hasOwn(plans,id))throw new RangeError('없는 비교안');return clone(plans[id]);}
export function earthSeaCompareRecord(id,judgment){if(!Object.hasOwn(EARTH_SEA_JUDGMENTS,judgment))throw new RangeError('먼저 판단해요.');return{kind:'earth-sea-compare',plan:id,judgment,material:earthSeaPlan(id)};}
export function validEarthSeaCompareRow(row){if(row?.kind!=='earth-sea-compare'||!Object.hasOwn(plans,row.plan)||!Object.hasOwn(EARTH_SEA_JUDGMENTS,row.judgment))return false;const expected=earthSeaPlan(row.plan);return !!row.material&&Object.entries(expected).every(([key,value])=>JSON.stringify(row.material[key])===JSON.stringify(value));}
export const earthSeaCompareValues=row=>[row.material.label,EARTH_SEA_JUDGMENTS[row.judgment],row.material.reason];
export function earthSeaComparisonProgress(rows){const done=new Set((Array.isArray(rows)?rows:[]).filter(validEarthSeaCompareRow).map(r=>r.plan)).size;return{done,total:EARTH_SEA_PLAN_IDS.length,complete:done===EARTH_SEA_PLAN_IDS.length};}
