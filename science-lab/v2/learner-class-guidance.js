import {plantStructureCase,validPlantStructureCompareRow} from './plant-structure-compare-model.js';
export const LEARNER_CLASS_GUIDANCE_VERSION='20261108-student-reading';
const clone=value=>structuredClone(value);
const caseWording={
 starch:{
  heads:['비교할 잎','녹말을 확인한 색 반응'],
  rows:[['처리 전 비교','푸른 검은색으로 변하지 않음'],['빛을 받은 뒤','푸른 검은색으로 변함'],['어둠에 둔 뒤','푸른 검은색으로 변하지 않음']],
  reason:'빛을 달리하기 전과 뒤의 색 반응을 함께 비교해요. 빛을 받은 잎에서 푸른 검은색 반응이 나타난 것은 녹말이 만들어졌다는 근거가 돼요. 색 반응이 없다고 녹말이 전혀 없다고 단정하거나 모든 양분을 검사했다고 하지는 않아요.'
 },
 organs:{rows:[['뿌리로 흡수한 물','뿌리에서 줄기를 지나 잎으로 이동'],['잎에서 만든 양분','다른 기관의 자람이나 저장에 이용']]},
 transpiration:{label:'잎에서 수증기가 나가는 작용'}
};
const casePrior={
 starch:{heads:['시료','녹말 검출 반응'],rows:[['처리 전 비교','미검출'],['빛을 받은 뒤','청람색'],['어둠에 둔 뒤','미검출']],reason:'처리 전 상태와 빛을 달리한 뒤의 반응을 함께 비교해요. 이번 결과는 빛을 받은 잎에서 녹말이 만들어지는 것과 관련돼요. 녹말 반응으로 모든 양분의 종류를 검사한 것은 아니에요.'},
 organs:{rows:[['뿌리로 흡수한 물','뿌리에서 줄기를 지나 잎으로 이동'],['잎에서 만든 양분','다른 기관의 생장이나 저장에 이용']]},
 transpiration:{label:'잎과 수증기의 배출'}
};
// 화면의 쉬운 표현만 만든다. 기록 생성/검증은 기존 material 전체를 그대로 쓴다.
export function plantStructureCasePresentation(id){
 const material=plantStructureCase(id),patch=caseWording[id];
 return patch&&Object.entries(casePrior[id]).every(([key,value])=>JSON.stringify(material[key])===JSON.stringify(value))?{...material,...clone(patch)}:material;
}
export function plantStructureComparePresentationValues(row){
 if(!validPlantStructureCompareRow(row))throw RangeError('확인이 필요한 식물 자료예요.');
 const material=plantStructureCasePresentation(row.case);
 return [material.label,material.options[row.prediction],material.reason];
}
const flowWording={
 starchprepare:{steps:{0:[
  '처리 전 녹말 상태를 확인할 시료와 빛을 받은 잎·가린 잎을 구별해요.',
  '빛을 달리하기 전 녹말을 확인할 잎과 빛을 받은 잎·가린 잎을 구별해요.'
 ]}},
 starchobserve:{steps:{
  0:['각 잎의 표기를 확인하고 아이오딘-아이오딘화 칼륨 용액에 의한 반응을 살펴요.','어느 잎인지 이름표를 확인하고 아이오딘-아이오딘화 칼륨 용액의 색 반응을 살펴요.'],
  1:['청람색으로 변했는지, 변하지 않았는지, 구별하기 어려운지 기록해요.','푸른 검은색으로 변했는지, 변하지 않았는지, 구별하기 어려운지 적어요.']
 }},
 starchunexpected:{
  title:['두 잎 모두 청람색이라면?','두 잎 모두 푸른 검은색으로 변했다면?'],
  text:{0:[
   '관찰한 반응을 그대로 기록하고 처리 전 녹말 상태와 빛을 가린 방법, 시료 표기를 확인해요. 녹말 반응으로 식물에 들어 있는 모든 양분의 종류를 알아본 것은 아니에요.',
   '관찰한 색은 그대로 적어요. 빛을 달리하기 전의 녹말 반응과 빛을 가린 방법, 잎의 이름표를 다시 확인해요. 이 검사는 녹말의 반응을 살핀 것이며 모든 양분의 종류를 알아본 것은 아니에요.'
  ]}
 }
};
const planWording=[
 '여러 차시로 나누는 수업 예시예요. 식물의 사전 처리와 기다리는 시간, 표본과 시료 준비는 별도로 확보해요. 관찰과 실험을 마친 뒤 자료를 만들고 설명하는 활동을 이어 가요.',
 '여러 차시로 나누는 수업 예시예요. 식물을 미리 준비하고 기다리는 시간은 따로 필요해요. 세포를 관찰할 식물 표본과 비교할 잎을 준비해요. 관찰과 실험을 마친 뒤 소개 자료를 만들고 설명해요.'
];
const cue=page=>[page.title+(/[.?!]$/.test(page.title)?'':'.'),...(page.text||[]),...(page.steps||[])].join(' ');
const grade3CueWording={
 'c22-s32-u01':{
  share:['설계와 실제 제작, 시험을 나누고 받은 질문으로 보완해요.','그림으로 나타낸 생각과 직접 만들어 시험한 결과를 나누어 설명해요. 친구의 질문을 듣고 그림이나 설명에 더할 내용을 찾아보아요.'],
  end:['비교한 시료와 조건을 밝히고 성질로 분류와 설계를 설명했나요?','어떤 재료를 어떤 방법으로 비교했나요? 같은 물질로 만든 물체끼리 묶어 보고, 쓰임에 맞는 재료를 고른 까닭을 설명해 보아요.']
 },
 'c22-s32-u02':{
  share:['친구에게 가치와 행동을 설명하고 받은 질문으로 보완해요.','친구에게 갯벌이 소중한 까닭과 함께 지킬 방법을 설명해요. 친구의 질문을 듣고 설명을 더해 보아요.'],
  end:['자료의 범위를 지키며 두 물, 물 높이, 갯벌 보전을 설명했나요?','바닷물과 수돗물을 어떻게 비교했나요? 바닷가의 물 높이가 달라지는 모습과 갯벌을 지킬 방법도 설명해 보아요.']
 },
 's31-u01':{
  apply:['두 주장 중 하나를 골라, 자료에서 찾은 근거로 설명을 고쳐 보아요.','두 생각 중 하나를 골라 보아요. 물체를 놓은 거리나 안에 담긴 것을 살펴보고, 그 생각이 맞지 않는 때도 있을지 설명해요.']
 }
};
function withGrade3GuidanceCues(mod){
 const unit=mod?.chapter?.unit;if(!Object.hasOwn(grade3CueWording,unit))return mod;
 const cues=mod.chapter.slideCues;if(!cues)return mod;
 let next=cues;
 for(const[id,[before,after]]of Object.entries(grade3CueWording[unit]))if(cues[id]===before)next={...next,[id]:after};
 return next===cues?mod:{...mod,chapter:{...mod.chapter,slideCues:next}};
}
function withAcidGuidance(mod){
 const chapter=mod?.chapter;
 if(chapter?.unit!=='c22-s61-u01'||!Array.isArray(chapter.acidFlow))return mod;
 let changed=false,cues=chapter.slideCues;
 const acidFlow=chapter.acidFlow.map(page=>{
  if(page.id!=='litmusplan'||page.steps?.[1]!=='시료마다 새 시험지와 깨끗한 도구를 나누어 준비해요.')return page;
  const steps=[...page.steps];steps[1]='용액마다 새 시험지와 깨끗한 도구를 나누어 준비해요.';
  const next={...page,steps};changed=true;
  if(cues?.[page.id]===cue(page))cues={...cues,[page.id]:cue(next)};
  return next;
 });
 return changed?{...mod,chapter:{...chapter,acidFlow,...(cues!==chapter.slideCues?{slideCues:cues}:{})}}:mod;
}
export function withLearnerClassGuidance(mod){
 mod=withGrade3GuidanceCues(mod);
 mod=withAcidGuidance(mod);
 if(mod?.chapter?.unit!=='c22-s61-u03')return mod;
 const chapter=mod.chapter;let changed=false,cues=chapter.slideCues;
 const flow=chapter.plantStructureFlow.map(page=>{
  const patch=flowWording[page.id];if(!patch)return page;
  let next=page;
  for(const[field,replacements]of Object.entries(patch)){
   if(field==='title'){
    if(page.title===replacements[0])next={...next,title:replacements[1]};
   }else if(Array.isArray(page[field])){
    const values=page[field].map((value,i)=>replacements[i]?.[0]===value?replacements[i][1]:value);
    if(values.some((v,i)=>v!==page[field][i]))next={...next,[field]:values};
   }
  }
  if(next===page)return page;changed=true;
  if(cues?.[page.id]===cue(page))cues={...cues,[page.id]:cue(next)};
  return next;
 });
 const plan=mod.plan?.note===planWording[0]?{...mod.plan,note:planWording[1]}:mod.plan;
 if(!changed&&plan===mod.plan)return mod;
 return {...mod,chapter:changed?{...chapter,plantStructureFlow:flow,slideCues:cues}:chapter,plan};
}
export const FORCE_END_GUIDANCE=Object.freeze({
 title:'배운 내용을 설명해 보아요',
 points:Object.freeze([
  '미는 방향과 당기는 방향, 같게 할 조건',
  '받침점에서 같은 거리에 놓아 무게 비교하기, 거리를 바꾸어 수평 찾기',
  '저울을 0에 맞추기, 잴 수 있는 범위와 단위 확인하기, 표시가 멈춘 뒤 무게 읽기',
  '지레와 빗면이 일을 도와주는 모습과 생활 속 쓰임'
 ]),
 afterword:'오늘 배운 내용을 문제로 한 번 더 확인해요. 직접 해 본 활동에서 무엇을 관찰했는지도 설명해 보아요.'
});
