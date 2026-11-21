import {solutionCase,validSolutionCompareRow} from './solution-compare-model.js';
export const SOLUTION_LEARNING_LANGUAGE_VERSION='20261108-solution-learning-language';
const wording={
 "mass": {
  "prior": {
   "label": "같은 전체의 무게",
   "question": "흘림·증발이 없고 같은 물건 전체를 잰다면 전후 무게는?",
   "heads": [
    "단계",
    "포함한 물건·연습 값"
   ],
   "rows": [
    [
     "전",
     "물80g + 컵46g + 설탕12g + 약포지1g"
    ],
    [
     "후",
     "설탕물92g + 같은 컵46g + 빈 약포지1g"
    ]
   ],
   "conditions": "물건 목록을 같게 하고 설탕은 모두 녹았다고 정했어요. 사진의 저울 숫자를 읽은 값은 아니에요.",
   "options": {
    "same": "두 전체의 무게가 같다",
    "less": "후가12g 더 가볍다",
    "cannot": "설탕물92g과 전체139g을 그대로 비교한다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "전후 같은 전체는 모두139g이에요. 설탕물만의92g과 컵·약포지를 포함한 전체139g은 재는 범위가 달라요. 실제 값이 다르면 그대로 남기고 누락·흘림·영점 등을 확인해요."
  },
  "display": {
   "reason": "전후에 같은 물건 전체를 재면 모두 139g이에요. 설탕물만의 92g과 컵·약포지를 포함한 전체 139g은 서로 재는 물건이 달라요. 직접 잰 값이 다르면 그대로 적어요. 빠진 물건이나 흘린 것이 있는지, 빈 저울이 0을 가리키는지도 확인해요."
  }
 },
 "temperature": {
  "prior": {
   "label": "물 온도와 녹는 양",
   "question": "같은 조건에서 온도만 다른 제공 자료가 뒷받침하는 것은?",
   "heads": [
    "별도 제공 조건",
    "더 저어 관찰한 결과"
   ],
   "rows": [
    [
     "같은 백반·물 양·투입량, 낮은 온도",
     "고체 일부가 계속 남음"
    ],
    [
     "같은 백반·물 양·투입량, 높은 온도",
     "투입한 고체가 모두 녹음"
    ]
   ],
   "conditions": "교사 시범/제공 기록을 읽는 사례예요. 정확한 온도나 학생이 가열한 값을 새로 만들지 않아요.",
   "options": {
    "amount": "이 백반 사례에서는 높은 온도에 더 많이 녹을 수 있었다",
    "speed": "녹는 데 걸린 시간만 확인했다",
    "all": "모든 물질이 언제나 똑같이 녹는다고 확인했다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "같은 백반·물 양·투입량에서 충분히 관찰한 고체의 잔류를 비교해요. 빠르기를 잰 자료와는 다르며 모든 물질로 확대하지 않아요."
  },
  "display": {
   "question": "온도만 달리한 이 자료에서 무엇을 알 수 있나요?",
   "heads": [
    "비교한 조건",
    "더 저은 뒤 살펴본 결과"
   ],
   "rows": [
    [
     "같은 백반·물의 양·넣은 양, 낮은 온도",
     "녹지 않은 고체가 계속 남음"
    ],
    [
     "같은 백반·물의 양·넣은 양, 높은 온도",
     "넣은 고체가 모두 녹음"
    ]
   ],
   "reason": "같은 백반과 같은 양의 물을 준비하고 백반도 같은 양을 넣었어요. 충분히 저은 뒤 남은 고체를 비교해요. 녹는 데 걸린 시간을 잰 자료는 아니에요. 이 백반의 결과가 모든 물질에서 같을 것이라고 정하지 않아요."
  }
 },
 "floating": {
  "prior": {
   "label": "같은 물체의 자유 부유",
   "question": "제시한 조건에서 상대적으로 가장 진한 설탕물은?",
   "heads": [
    "설탕물",
    "같은 물체의 제공 관찰"
   ],
   "rows": [
    [
     "가",
     "완전히 잠겨 자유롭게 떠 있음"
    ],
    [
     "나",
     "수면 위로 조금 드러남"
    ],
    [
     "다",
     "수면 위로 더 많이 드러남"
    ]
   ],
   "conditions": "같은 물체를 차례로 넣고 같은 종류의 설탕물·온도를 비교해요. 충분한 깊이에서 벽·바닥 접촉과 붙은 기포가 없다고 정했어요.",
   "options": {
    "last": "다",
    "first": "가",
    "same": "세 용액이 모두 같다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "같은 물체가 자유롭게 뜨는 조건에서 수면 위로 더 많이 드러난 다가 상대적으로 더 진해요. 사진에서 정확한 진하기 수치를 재는 것은 아니에요."
  },
  "display": {
   "label": "같은 물체가 물에 뜬 모습",
   "heads": [
    "설탕물",
    "같은 물체를 넣고 본 모습"
   ],
   "rows": [
    [
     "가",
     "물속에 완전히 잠긴 채 벽·바닥에 닿지 않고 떠 있음"
    ],
    [
     "나",
     "물 위로 조금 드러남"
    ],
    [
     "다",
     "물 위로 더 많이 드러남"
    ]
   ],
   "question": "이 조건에서 가장 진한 설탕물은 무엇인가요?",
   "reason": "같은 물체가 벽이나 바닥에 닿지 않고 떠 있어요. 이때 물 위로 더 많이 드러난 다가 셋 중 가장 진해요. 사진에서 정확한 진하기를 숫자로 잰 것은 아니에요."
  }
 },
 "contact": {
  "prior": {
   "label": "바닥에 닿은 두 결과",
   "question": "같은 물체가 두 용액에서 모두 바닥에 닿았다면?",
   "heads": [
    "설탕물",
    "제공 관찰"
   ],
   "rows": [
    [
     "A",
     "물체가 바닥에 닿음"
    ],
    [
     "B",
     "물체가 바닥에 닿음"
    ]
   ],
   "conditions": "다른 조건은 같게 했지만 자유롭게 뜨는 모습을 비교하지 못했어요.",
   "options": {
    "cannot": "진하기가 같다고 확정할 수 없어 비교 조건을 더 확인한다",
    "same": "두 용액은 반드시 같은 진하기다",
    "A": "A가 반드시 더 진하다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "바닥에 닿은 결과만으로 진하기가 같다고 정할 수 없어요. 같은 물체의 자유 부유·충분한 깊이·접촉·기포 등을 교사와 확인해 다시 비교해요."
  },
  "display": {
   "conditions": "다른 조건은 같게 했지만 물체가 벽·바닥에 닿지 않고 뜨는 모습을 비교하지 못했어요.",
   "reason": "물체가 둘 다 바닥에 닿았다는 것만으로 진하기가 같다고 정할 수는 없어요. 물이 충분히 깊은지, 물체가 벽·바닥에 닿거나 기포가 붙었는지 선생님과 확인해요. 같은 물체가 닿지 않고 뜨는 모습으로 다시 비교해요."
  }
 }
};
export function solutionMaterialPresentation(id,material){
 const entry=Object.hasOwn(wording,id)?wording[id]:undefined;
 return entry&&JSON.stringify(material)===JSON.stringify(entry.prior)?{...structuredClone(material),...structuredClone(entry.display)}:material;
}
export function solutionCasePresentation(id){return solutionMaterialPresentation(id,solutionCase(id));}
export function solutionComparePresentationValues(row){
 if(!validSolutionCompareRow(row))throw RangeError('확인이 필요한 용액 자료예요.');
 const material=solutionCasePresentation(row.case);
 return [material.label,material.options[row.prediction],material.reason];
}
const cues={observe:['처음 모습과 충분히 저은 뒤 잔류를 살펴요.','처음 모습과 충분히 저은 뒤 녹지 않고 남은 고체를 살펴요.'],communicate:['실제로 설명하고 받은 질문과 미수신을 구별해요.','친구에게 설명하고 어떤 질문을 받았는지 적어요. 아직 답을 듣지 못했다면 다음에 물어볼 점을 정해요.']};
export function withSolutionLearnerCues(mod){
 if(mod?.chapter?.unit!=='c22-s51-u03'||!mod.chapter.slideCues)return mod;
 const before=mod.chapter.slideCues;let next=before;
 for(const[id,[old,text]]of Object.entries(cues))if(before[id]===old)next={...next,[id]:text};
 return next===before?mod:{...mod,chapter:{...mod.chapter,slideCues:next}};
}
