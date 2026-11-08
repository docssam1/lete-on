// Attach the existing model data required to solve these authored questions on their own.
import {MATERIALS,NOTE,TESTS,materialResult} from '../../scenes/material-model.js';
import {WATERS as EVAP_WATERS,evapModel} from '../../scenes/seawater-model.js';
import {LENGTHS,STRENGTHS,rulerModel} from '../../scenes/ruler-model.js';
import {ROUNDS,glitterModel} from '../../scenes/glitter-model.js';
import {moonModel} from '../../scenes/moon-model.js';
import {BASE,YEARS,meadowAt} from '../../scenes/meadow-model.js';
import {HOUSES,WALL} from '../../scenes/sealevel-model.js';
import {START,MINUTES,WATERS as BREAD_WATERS,breadModel} from '../../scenes/bread-model.js';
export const LESSON_REFERENCE_DATA_VERSION='20261108-lesson-reference-data';
const entries={
  "c22-s32-u01-t05": {
    "prompt": "네 막대를 물에 넣었을 때의 결과를 써요.",
    "previousVersion": 1,
    "reference": "materialWater"
  },
  "c22-s32-u01-t09": {
    "prompt": "네 막대 실험의 결과를 바르게 말한 친구는?",
    "previousVersion": 1,
    "reference": "materialAll"
  },
  "c22-s32-u01-t10": {
    "prompt": "물에 띄워 노는 장난감 배의 몸체를 이 실험 결과만 보고 고른다면, 어느 막대의 물질이 가장 알맞을까요?",
    "previousVersion": 1,
    "reference": "materialWater"
  },
  "c22-s32-u02-t07": {
    "prompt": "두 물을 공정하게 비교하려고 같게 맞춘 조건으로 알맞은 것은?",
    "previousVersion": 1,
    "reference": "evaporation"
  },
  "c22-s32-u02-t12": {
    "prompt": "증발 접시 실험 결과를 근거로, 바닷물과 수돗물의 다른 점을 설명해요.",
    "previousVersion": 1,
    "reference": "evaporation"
  },
  "c22-s32-u03-t12": {
    "prompt": "자를 튕긴 결과를 보고, ‘자를 길게 내밀면 소리가 더 커진다’는 친구의 말을 바르게 고쳐 쓰세요.",
    "previousVersion": "20261108-grade3-practice-language",
    "reference": "ruler"
  },
  "c22-s32-u04-t05": {
    "prompt": "아무도 손을 씻지 않는 반짝이 가루 손 모형이에요. 악수 차례마다 반짝이가 묻은 친구의 수를 쓰세요.",
    "previousVersion": "20261108-grade3-practice-language",
    "reference": "glitterPairs"
  },
  "c22-s32-u04-t12": {
    "prompt": "‘B·D·F가 손 씻기’ 모형의 결과를 보세요. 모형에서 본 내용을 넣어 손 씻기가 감염병 예방에 도움이 되는 까닭을 쓰세요.",
    "previousVersion": "20261108-grade3-practice-language",
    "reference": "glitterWash"
  },
  "c22-s42-u01-t12": {
    "prompt": "「달은 매일 같은 시각에 같은 모양으로 같은 자리에 떠요」라는 친구의 생각을, 달 관찰 결과를 근거로 고쳐 써요.",
    "previousVersion": 1,
    "reference": "moon"
  },
  "c22-s42-u02-t05": {
    "prompt": "풀밭 모형에서 한 가지 조건만 바꾼 결과예요. 각 조건에서 3년 뒤 풀의 양이 처음보다 어떻게 달라졌는지 써 보세요.",
    "previousVersion": "20261108-ecology-elementary",
    "reference": "meadowGrass"
  },
  "c22-s42-u02-t12": {
    "prompt": "친구는 “여우는 토끼를 잡아먹으니, 여우가 모두 사라지면 풀밭이 더 좋아진다”고 생각해요. 풀밭 모형의 결과를 보고 이 생각을 고쳐 써 보세요.",
    "previousVersion": "20261108-ecology-elementary",
    "reference": "meadowFox"
  },
  "c22-s42-u04-t05": {
    "prompt": "해안 마을 모형(방파제 없음)에서 물높이마다 물에 닿은 집의 수를 써요.",
    "previousVersion": 1,
    "reference": "coast"
  },
  "c22-s42-u04-t08": {
    "prompt": "모형에서 바다 바로 옆에 있는 집 A는 물높이가 4 cm일 때도 젖지 않았어요. 그 까닭으로 알맞은 것은?",
    "previousVersion": "20261106-climate-readable-workbook",
    "reference": "coast"
  },
  "c22-s42-u04-t09": {
    "prompt": "높이 3.5 cm의 방파제를 세운 모형에서 물높이를 3 cm, 4 cm로 차례로 높였어요. 결과로 알맞은 것은?",
    "previousVersion": "20261106-climate-readable-workbook",
    "reference": "coast"
  },
  "c22-s42-u04-t12": {
    "prompt": "모형에서 바다 바로 옆의 집 A보다 바다에서 더 먼 집 D가 먼저 물에 닿았어요. 그 까닭을 땅의 높이와 이어 써요.",
    "previousVersion": 1,
    "reference": "coast"
  },
  "s41-u04-t05": {
    "prompt": "효모빵 반죽 실험실에서 40분 뒤 반죽의 부피(모형 값)를 써요.",
    "previousVersion": 1,
    "reference": "bread"
  },
  "s41-u04-t12": {
    "prompt": "효모빵 실험의 모형 자료를 보고, ‘물이 뜨거울수록 빵이 더 많이 부푼다’는 친구의 말을 바르게 고쳐 쓰세요. 자료에서 알게 된 내용을 넣어 설명하세요.",
    "previousVersion": "20261108-biology-elementary-bank",
    "reference": "bread"
  }
};
export const LESSON_REFERENCE_UNITS=[...new Set(Object.keys(entries).map(id=>id.replace(/-t\d+$/,'')))];
const table=(caption,머리,행)=>({caption,머리,행});
const materialName=m=>m+'('+NOTE[m]+')';
const materialNotice='같은 모양과 크기의 막대 네 개를 같은 방법으로 비교한 모형 자료예요. 이 표에 나온 막대의 결과이며, 물질의 종류가 달라지면 결과도 달라질 수 있어요.';
function referenceData(kind){
 if(kind==='materialWater')return {자료:materialNotice,결과표:table('물에 넣기 · 막대 모형',['막대','물에 넣었을 때'],MATERIALS.map(m=>[materialName(m),materialResult('물에 넣기',m).text]))};
 if(kind==='materialAll')return {자료:materialNotice,결과표:table('네 막대 비교 · 모형 자료',['막대',...TESTS],MATERIALS.map(m=>[materialName(m),...TESTS.map(t=>materialResult(t,m).text)]))};
 if(kind==='evaporation')return {자료:'두 물을 같은 양씩 같은 모양의 접시에 담아 같은 방법으로 가열한 모형 자료예요. 수돗물에도 물질이 조금 녹아 있을 수 있지만, 이 모형에서는 눈에 띄는 알갱이가 거의 남지 않는 것으로 나타냈어요.',결과표:table('증발 접시 · 모형 자료',['물의 종류','처음 물의 양','물을 모두 증발시킨 뒤'],EVAP_WATERS.map(w=>{const m=evapModel(w,20);return[w,m.ml+' mL',m.look];}))};
 if(kind==='ruler')return {자료:'같은 플라스틱 자에서 내민 길이와 튕기는 세기를 바꾼 모형 자료예요. 소리의 높낮이와 크기를 나누어 읽어 보세요.',결과표:table('자 튕기기 · 모형 자료',['내민 길이','튕기는 세기','소리의 높낮이','소리의 크기'],LENGTHS.flatMap(len=>STRENGTHS.map(strength=>{const m=rulerModel(len,strength);return[len+' cm',strength,m.pitch,m.loud];})))};
 if(kind==='glitterPairs')return {자료:'여섯 친구 A~F 중 처음에는 A에게만 반짝이가 묻어 있어요. 아무도 손을 씻지 않아요. 반짝이가 묻은 친구와 악수하면 두 친구 모두 반짝이가 묻는다고 정해요. 같은 차례의 세 짝은 동시에 악수해요. 반짝이는 손으로 옮겨 가는 모습을 나타낸 표식이에요.',악수표:table('반짝이 모형의 규칙',['차례','악수하는 짝'],ROUNDS.map((pairs,i)=>[(i+1)+'차례',pairs.map(pair=>pair.join('–')).join(' / ')]))};
 if(kind==='glitterWash')return {자료:'여섯 친구 A~F 중 처음에는 A에게만 반짝이가 묻어 있어요. 손 씻기 조건에서는 매 차례 악수하기 전에 B·D·F의 반짝이를 지워요. 반짝이는 손으로 옮겨 가는 모습을 나타낸 표식이에요. 인원수는 모형 규칙으로 나온 값이에요.',결과표:table('반짝이가 묻은 친구 · 모형 자료',['차례','손 씻기 없음','B·D·F가 차례마다 손 씻기'],[0,1,2,3].map(round=>[round?round+'차례 뒤':'처음',glitterModel(round,0).result,glitterModel(round,1).result]))};
 if(kind==='moon')return {자료:'같은 시각을 비교하려고 정한 달 관찰 모형 자료예요. 날짜와 방향은 대표적인 모습이며, 실제 관찰에서는 계절과 날짜에 따라 조금씩 달라질 수 있어요.',관찰표:table('달 관찰 모형',['음력 날짜','비교 시각','달의 모양','보이는 방향'],[3,7,15].map(day=>{const m=moonModel(day);return[day+'일',m.time,m.name+' · '+m.side,m.dir];}))};
 if(kind==='meadowGrass')return {자료:'풀 → 토끼 → 여우의 한 먹이 사슬만 나타낸 모형이에요. 바깥에서 새 먹이가 들어오지 않는다고 정했어요. 아래 수는 변화를 비교하려고 정한 모형 값이에요.',결과표:table('풀의 양 · 모형 자료',['바꾼 조건','변화 전 풀(포기)',YEARS+'년 뒤 풀(포기)'],['그대로','여우가 사라짐','토끼가 사라짐'].map(change=>[change,BASE.grass,meadowAt(change,YEARS).grass]))};
 if(kind==='meadowFox'){
  const result=meadowAt('여우가 사라짐',YEARS);
  return {자료:'풀 → 토끼 → 여우의 한 먹이 사슬만 나타낸 모형이에요. 바깥에서 새 먹이가 들어오지 않는다고 정했어요. 아래 수는 실제 생태계의 미래를 알아낸 값이 아니라 모형 값이에요.',결과표:table('여우가 사라진 조건 · 모형 자료',['생물','변화 전',YEARS+'년 뒤'],[['풀(포기)',BASE.grass,result.grass],['토끼(마리)',BASE.rabbit,result.rabbit],['여우(마리)',BASE.fox,result.fox]])};
 }
 if(kind==='coast')return {자료:'집의 위치와 땅의 모양을 고정한 해안 마을 모형이에요. 물높이가 집이 놓인 땅의 높이와 같거나 더 높으면 그 집이 물에 닿는다고 정했어요. 이 높이는 통 바닥에서 잰 모형 값이에요.',집배치표:table('해안 마을 · 모형의 집 배치',['집','집이 놓인 땅의 높이(cm)','바다와의 위치'],HOUSES.map(h=>[h.id,h.base,h.near])),방파제:'방파제가 없으면 물이 안쪽으로 들어와요. 방파제가 있으면 물높이가 '+WALL+' cm보다 높아질 때만 방파제를 넘어 안쪽으로 들어온다고 정한 모형이에요.'};
 if(kind==='bread')return {자료:'처음 반죽은 모두 '+START+' mL예요. 물의 온도만 다르게 하고 같은 양의 밀가루·설탕·효모로 만든 반죽을 같은 따뜻한 곳에 둔 모형 자료예요. 부피는 실제로 잰 값이 아니라 변화를 비교하려고 정한 값이에요.',결과표:table('효모빵 반죽 · 모형 자료',['반죽할 때 넣은 물','처음 부피(mL)',MINUTES+'분 뒤 부피(mL)','모형에서 나타낸 모습'],BREAD_WATERS.map(w=>{const m=breadModel(w);return[w,START,m.vol,m.shape];}))};
 throw new RangeError('unknown lesson reference');
}
const clone=value=>JSON.parse(JSON.stringify(value));
const cache=new WeakMap();
export function lessonReferenceItems(rows,unit){
 if(!LESSON_REFERENCE_UNITS.includes(unit)||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const entry=entries[q.id];
  if(!entry||!q.id.startsWith(unit+'-')||q.status!=='authored'||q.sourceRef?.type!=='authored-lesson'||q.prompt!==entry.prompt||(q.contentVersion||1)!==entry.previousVersion||q.givens!=null||q.figure||q.visualModel||q.sourceContent||q.diagnosticOverride)return q;
  changed=true;if(cache.has(q))return cache.get(q);
  const current={...q,givens:referenceData(entry.reference),contentVersion:LESSON_REFERENCE_DATA_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
  cache.set(q,current);return current;
 });return changed?next:rows;
}
export function withLessonReferenceClassroom(unit,mod){
 const items=lessonReferenceItems(mod.classroomItems,unit);
 return items===mod.classroomItems?mod:{...mod,classroomItems:items};
}
