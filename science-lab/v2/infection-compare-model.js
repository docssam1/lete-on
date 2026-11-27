import{FRIENDS,RULES,ROUNDS,WASHERS,glitterModel}from'../scenes/glitter-model.js';
export const INFECTION_ROUNDS=[1,2,3];
export const INFECTION_PREDICTIONS={fewer:'표식을 빼는 규칙에서 더 적다',same:'두 규칙에서 같다',more:'표식을 빼는 규칙에서 더 많다',unknown:'자료를 더 살펴보겠다'};
export const INFECTION_NOTICE='A~F 여섯 장의 카드로 옮겨 가는 과정을 나타내요. 표식은 병원체가 아니며 카드의 수는 실제 감염자 수가 아니에요.';
const clone=x=>JSON.parse(JSON.stringify(x));
export function infectionComparison(round){
 if(!INFECTION_ROUNDS.includes(round))throw new RangeError('없는 차례');
 return{round,start:['A'],pairs:clone(ROUNDS.slice(0,round)),washers:clone(WASHERS[1]),rules:RULES.map((label,rule)=>{const{who,n}=glitterModel(round,rule);return{label,rule:label,who,n};})};
}
export function infectionCompareRecord(round,prediction){if(!Object.hasOwn(INFECTION_PREDICTIONS,prediction))throw new RangeError('먼저 예상해요.');return{kind:'infection-compare',round,prediction,material:infectionComparison(round)};}
export function validInfectionCompareRow(row){
 if(row?.kind!=='infection-compare'||!INFECTION_ROUNDS.includes(row.round)||!Object.hasOwn(INFECTION_PREDICTIONS,row.prediction)||!row.material)return false;
 return Object.entries(infectionComparison(row.round)).every(([key,value])=>JSON.stringify(row.material[key])===JSON.stringify(value));
}
export const infectionCompareValues=row=>[`${row.round}차례 뒤`,INFECTION_PREDICTIONS[row.prediction],row.material.rules.map(m=>`${m.rule}: ${m.n}장(${m.who.join('·')})`).join(' / ')];
export function infectionComparisonProgress(rows){const done=new Set((Array.isArray(rows)?rows:[]).filter(validInfectionCompareRow).map(r=>r.round)).size;return{done,total:3,complete:done===3};}
export{FRIENDS};
