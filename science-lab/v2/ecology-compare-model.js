import{CHANGES,SPECIES,BASE,meadowRow}from'../scenes/meadow-model.js';
export{CHANGES,SPECIES,BASE};
export const ECOLOGY_PREDICTIONS={up:'늘어남',down:'줄어듦',same:'같음',absent:'없음',unknown:'자료 더 필요'};
export const ECOLOGY_COMPARE_NOTICE='사진은 생물과 주변 환경의 모습을 살피는 자료예요. 아래 숫자는 경향 비교를 위해 정한 모형 값이며 실제 조사 결과나 생존 예측이 아니에요.';
export function ecologyMaterial(change){if(!CHANGES.includes(change))throw new RangeError('없는 모형 조건');return meadowRow(change);}
export function ecologyCompareRecord(change,prediction){
 if(!SPECIES.every(([key])=>Object.hasOwn(ECOLOGY_PREDICTIONS,prediction?.[key])))throw new RangeError('세 생물의 예상을 먼저 골라요.');
 return{kind:'ecology-compare',change,prediction:Object.fromEntries(SPECIES.map(([key])=>[key,prediction[key]])),material:ecologyMaterial(change)};
}
export function validEcologyCompareRow(row){
 if(row?.kind!=='ecology-compare'||!CHANGES.includes(row.change)||!SPECIES.every(([key])=>Object.hasOwn(ECOLOGY_PREDICTIONS,row.prediction?.[key])))return false;
 const expected=ecologyMaterial(row.change);return !!row.material&&Object.keys(expected).every(key=>row.material[key]===expected[key]);
}
export function ecologyCompareValues(row){
 return[row.change,SPECIES.map(([key,name])=>`${name}: ${ECOLOGY_PREDICTIONS[row.prediction[key]]}`).join(' · '),SPECIES.map(([key,name])=>`${name} ${row.material[key]}`).join(' · ')+` / ${row.material.result}`];
}
export function ecologyComparisonProgress(rows){
 const conditions=new Set((Array.isArray(rows)?rows:[]).filter(validEcologyCompareRow).map(r=>r.change)),done=CHANGES.slice(0,2).filter(c=>conditions.has(c)).length;
 return{done,total:2,complete:done===2};
}
