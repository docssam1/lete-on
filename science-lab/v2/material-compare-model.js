import{MATERIALS,TESTS,NOTE,ASK,materialRow}from'../scenes/material-model.js';
export{MATERIALS,TESTS,NOTE,ASK};
export const MATERIAL_COMPARE_NOTICE='같은 모양·크기의 네 막대를 같은 방법으로 비교한 모형 자료예요. 실제 학생의 측정 결과가 아니며 같은 이름의 모든 물질에 일반화하지 않아요.';
export function materialChoices(test){if(!TESTS.includes(test))throw new RangeError('없는 시험');return[...new Set(MATERIALS.map(m=>materialRow(test)[m])),'자료 더 필요'];}
export function materialCompareRecord(test,prediction){
 const choices=materialChoices(test);if(!MATERIALS.every(m=>choices.includes(prediction?.[m])))throw new RangeError('네 막대의 결과를 먼저 예상해요.');
 return{kind:'material-compare',test,prediction:Object.fromEntries(MATERIALS.map(m=>[m,prediction[m]])),material:materialRow(test)};
}
export function validMaterialCompareRow(row){
 if(row?.kind!=='material-compare'||!TESTS.includes(row.test))return false;const expected=materialRow(row.test),choices=materialChoices(row.test);
 return MATERIALS.every(m=>choices.includes(row.prediction?.[m]))&&!!row.material&&Object.keys(expected).every(key=>row.material[key]===expected[key]);
}
export const materialCompareValues=row=>[row.test,MATERIALS.map(m=>`${m}: ${row.prediction[m]}`).join(' · '),MATERIALS.map(m=>`${m}: ${row.material[m]}`).join(' · ')];
export function materialComparisonProgress(rows){const done=new Set((Array.isArray(rows)?rows:[]).filter(validMaterialCompareRow).map(r=>r.test)).size;return{done,total:TESTS.length,complete:done===TESTS.length};}
