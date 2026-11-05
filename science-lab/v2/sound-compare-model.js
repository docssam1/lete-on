import {rulerModel} from '../scenes/ruler-model.js';
export const SOUND_NOTICE='세기와 높낮이의 차이를 살피는 모형 소리예요. 실제 자를 녹음한 소리나 내가 한 실험 결과는 아니에요.';
export const SOUND_PREDICTIONS={pitch:'높낮이가 다를 것 같다',loud:'세기가 다를 것 같다',both:'세기와 높낮이가 모두 다를 것 같다',unknown:'아직 모르겠다'};
const pairs={
 pitch:{label:'길이만 바꾸기',settings:[[5,'약하게'],[15,'약하게']],reason:'같은 자·고정·튕기는 정도로 책상 밖 길이만 바꿨어요. 이 모형에서는 짧은 쪽이 높은 소리, 긴 쪽이 낮은 소리예요. 세기 설정은 같아요.'},
 loud:{label:'튕기는 정도만 바꾸기',settings:[[10,'약하게'],[10,'세게']],reason:'내민 길이는10 cm로 같고 튕기는 정도만 바꿨어요. 이 모형에서는 높낮이는 같고 세기 설정이 달라요.'},
 mixed:{label:'두 조건을 함께 바꾸기',settings:[[5,'약하게'],[15,'세게']],reason:'길이와 튕기는 정도가 모두 달라요. 높은 작은 소리와 낮은 큰 소리를 나누어 볼 수 있지만 길이만의 효과를 알아보는 비교는 아니에요.'},
};
const clone=x=>JSON.parse(JSON.stringify(x));
export const SOUND_PAIR_IDS=Object.keys(pairs);
export function soundPair(id){if(!Object.hasOwn(pairs,id))throw new RangeError('없는 소리 비교');const p=clone(pairs[id]);return{...p,sounds:p.settings.map(([len,strength])=>rulerModel(len,strength))};}
export function soundCompareRecord(id,prediction){if(!Object.hasOwn(SOUND_PREDICTIONS,prediction))throw new RangeError('먼저 예상해요.');return{kind:'sound-compare',pair:id,prediction,material:soundPair(id)};}
export function validSoundCompareRow(row){if(row?.kind!=='sound-compare'||!Object.hasOwn(pairs,row.pair)||!Object.hasOwn(SOUND_PREDICTIONS,row.prediction))return false;const expected=soundPair(row.pair);return !!row.material&&Object.entries(expected).every(([k,v])=>JSON.stringify(row.material[k])===JSON.stringify(v));}
export const soundCompareValues=row=>[row.material.label,SOUND_PREDICTIONS[row.prediction],row.material.reason];
export function soundComparisonProgress(rows){const done=new Set((Array.isArray(rows)?rows:[]).filter(validSoundCompareRow).map(r=>r.pair)).size;return{done,total:SOUND_PAIR_IDS.length,complete:done===SOUND_PAIR_IDS.length};}
