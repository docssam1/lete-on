import {LEVELS,HOUSES,WALL,seaModel} from '../scenes/sealevel-model.js';
export const CLIMATE_LEVELS=Object.freeze([...LEVELS]);
export const CLIMATE_PREDICTIONS=Object.freeze({fewer:'벽이 있는 모형에서 더 적다',same:'두 모형에서 같다',more:'벽이 있는 모형에서 더 많다',unknown:'자료를 더 살펴보겠다'});
export const CLIMATE_NOTICE='아래는 정한 규칙으로 계산한 모형 자료예요. 내가 직접 한 실험이나 실제 해안의 관측 기록은 아니에요.';
const clone=x=>JSON.parse(JSON.stringify(x));
export function climateComparison(level){
 if(!CLIMATE_LEVELS.includes(level))throw new RangeError('없는 물높이');
 return {level,wallHeight:WALL,houses:clone(HOUSES),rules:[seaModel(level,false),seaModel(level,true)]};
}
export function climateCompareRecord(level,prediction){
 if(!Object.hasOwn(CLIMATE_PREDICTIONS,prediction))throw new RangeError('먼저 예상해요.');
 return {kind:'climate-compare',level,prediction,material:climateComparison(level)};
}
export function validClimateCompareRow(row){
 if(row?.kind!=='climate-compare'||!CLIMATE_LEVELS.includes(row.level)||!Object.hasOwn(CLIMATE_PREDICTIONS,row.prediction)||!row.material)return false;
 return Object.entries(climateComparison(row.level)).every(([key,value])=>JSON.stringify(row.material[key])===JSON.stringify(value));
}
export const climateCompareValues=row=>[`${row.level} cm`,CLIMATE_PREDICTIONS[row.prediction],row.material.rules.map(m=>`${m.wall}: ${m.result}`).join(' / ')];
export function climateComparisonProgress(rows){
 const done=new Set((Array.isArray(rows)?rows:[]).filter(validClimateCompareRow).map(r=>r.level)).size;
 return {done,total:CLIMATE_LEVELS.length,complete:done===CLIMATE_LEVELS.length};
}
