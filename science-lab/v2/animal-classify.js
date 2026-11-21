// 사진/설명 자료를 두 생김새 기준으로 비교하는 활동. 실제 생물 수행 평가나 생물학적 분류 체계가 아니다.
import {animals} from '../data/activities/s31-u02.animal.js';
const facts={
 pigeon:{wings:true,feathers:true,text:'깃털로 덮인 몸과 날개가 있어요. 사진에서는 날개를 접고 있어요.'},
 bat:{wings:true,feathers:false,text:'날개에는 얇은 피부 막이 펼쳐져 있어요. 깃털 날개가 아니에요.'},
 dragonfly:{wings:true,feathers:false,text:'성충의 날개는 두 쌍이에요. 깃털로 덮인 날개가 아니에요.'},
 tiger:{wings:false,feathers:false,text:'몸이 털로 덮여 있고 다리가 있어요. 날개나 깃털은 없어요.'},
};
export const CLASSIFY_ANIMALS=Object.freeze(['pigeon','bat','dragonfly','tiger'].map(id=>Object.freeze({...animals.find(a=>a.id===id),...facts[id]})));
export const CLASSIFY_CRITERIA=Object.freeze({wings:Object.freeze({title:'날개가 있는가?',yes:'날개 있음',no:'날개 없음'}),feathers:Object.freeze({title:'몸이 깃털로 덮여 있는가?',yes:'깃털 있음',no:'깃털 없음'})});
export const CLASSIFY_LABELS=Object.freeze({yes:'해당함',no:'해당하지 않음',unknown:'자료 더 필요'});
export const classifyGroups=criterion=>{
 if(!Object.hasOwn(CLASSIFY_CRITERIA,criterion))throw Error('분류 기준을 확인해 주세요.');
 return Object.fromEntries(CLASSIFY_ANIMALS.map(a=>[a.id,a[criterion]?'yes':'no']));
};
export const validPlacements=p=>p&&typeof p==='object'&&!Array.isArray(p)&&Object.keys(p).length===CLASSIFY_ANIMALS.length&&CLASSIFY_ANIMALS.every(a=>Object.hasOwn(CLASSIFY_LABELS,p[a.id]));
export function classifyRecord(criterion,placements){
 if(!validPlacements(placements))throw Error('네 동물의 분류 또는 더 확인을 먼저 골라 주세요.');
 return{kind:'사진 분류 비교',criterion,placements:{...placements},groups:classifyGroups(criterion)};
}
export function validClassifyRow(row){
 if(!row||row.kind!=='사진 분류 비교'||!validPlacements(row.placements))return false;
 try{const groups=classifyGroups(row.criterion);return row.groups&&Object.keys(row.groups).length===CLASSIFY_ANIMALS.length&&CLASSIFY_ANIMALS.every(a=>row.groups[a.id]===groups[a.id]);}catch{return false;}
}
export const groupSummary=groups=>['yes','no','unknown'].flatMap(key=>{const names=CLASSIFY_ANIMALS.filter(a=>groups[a.id]===key).map(a=>a.name);return names.length?[`${CLASSIFY_LABELS[key]}: ${names.join('·')}`]:[];}).join(' / ');
export const classifyRowValues=r=>[CLASSIFY_CRITERIA[r.criterion].title,groupSummary(r.placements),groupSummary(r.groups)];
export const CLASSIFY_SOURCES=Object.freeze([
 {title:'Cornell Lab · Rock Pigeon',url:'https://www.allaboutbirds.org/guide/rock_pigeon/id'},
 {title:'San Diego Zoo · Bat',url:'https://animals.sandiegozoo.org/animals/bat'},
 {title:'Natural History Museum · Dragonflies',url:'https://www.nhm.ac.uk/discover/dragonflies-the-ultimate-hunters.html'},
]);
