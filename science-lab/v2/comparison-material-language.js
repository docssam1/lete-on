export const COMPARISON_MATERIAL_LANGUAGE_VERSION='20261108-comparison-material-language';
const wording={
 "water-compare:tube": {
  "prior": {
   "label": "세 단계 높이·전체 무게",
   "question": "이 연습 자료에서 달라진 양은?",
   "heads": [
    "단계",
    "높이(cm)",
    "전체 무게(g)"
   ],
   "rows": [
    [
     "처음 물",
     "4.0",
     "32.5"
    ],
    [
     "다 언 얼음",
     "4.4",
     "32.5"
    ],
    [
     "다 녹은 물",
     "4.0",
     "32.5"
    ]
   ],
   "conditions": "같은 곧은 용기·마개·물,물의 출입 없음,겉 물기 제거를 전제한 교재 모형 값이에요. 높이 비율을 모든 실제 용기의 측정값으로 쓰지 않아요.",
   "options": {
    "height": "얼 때 높이는 늘고 녹은 뒤 처음으로 돌아오며 전체 무게는 같다",
    "both": "얼 때 높이와 전체 무게가 모두 늘었다",
    "mass": "높이는 같고 전체 무게만 달라졌다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "높이는4.0→4.4→4.0cm,같은 전체 무게는 모두32.5g이에요. 물기둥 높이로 부피의 변화를 비교하며 높이와 무게는 따로 읽어요."
  },
  "display": {
   "conditions": "같은 곧은 용기와 마개, 같은 물로 비교한 모형 값이에요. 물이 드나들지 않고 겉에 묻은 물기는 닦았다고 정했어요. 이 모형의 높이 비율을 다른 용기의 실제 값으로 그대로 쓰지는 않아요."
  }
 },
 "magnet-compare:design": {
  "prior": {
   "label": "종이를 잡는 장치 설계",
   "question": "장치의 설계를 설명할 때 무엇이 필요할까요?",
   "heads": [
    "생각할 것",
    "설계의 예"
   ],
   "rows": [
    [
     "목적",
     "종이를 쉽게 붙이고 꺼내기"
    ],
    [
     "힘이 작용하는 두 부분",
     "고정한 자석과 철 부분"
    ],
    [
     "사용 방법",
     "종이가 사이에 들어가도록 배치"
    ]
   ],
   "conditions": "가능한 설계 중 하나예요. 두 자석의 다른 극을 마주 놓는 등 다른 타당한 설계도 있어요.",
   "options": {
    "parts": "두 부분의 재료·배치·이용하는 자석의 성질과 고정 방법을 표시한다",
    "name": "상자에 자석이 있다는 문장만 쓴다",
    "must": "설계를 배우려면 반드시 실제 제작과 성공 시험까지 끝내야 한다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "자석의 어떤 성질을 이용하는지 그림에 나타내요. 설계한 것이 반드시 만들기로 이어져야 하는 것은 아니에요. 만들거나 시험하지 않았다면 확인할 방법을 제안해요."
  },
  "display": {
   "conditions": "장치를 만들기 전에 생각한 방법 중 하나예요. 두 자석의 서로 다른 극을 마주 놓는 등 같은 목적에 맞는 다른 방법도 있어요.",
   "reason": "자석의 어떤 성질을 이용하는지 그림에 나타내요. 그림으로 나타낸 생각과 직접 만들고 시험한 결과는 나누어 설명해요. 아직 만들거나 시험해 보지 않았다면 어떻게 확인할지 생각해 보아요."
  }
 },
 "ground-compare:practice": {
  "prior": {
   "label": "의견·수정 계획과 재연습",
   "question": "계단 입구가 붐볐다는 의견 뒤 아직 확인하지 못한 것은?",
   "heads": [
    "단계",
    "교재의 가상 상황"
   ],
   "rows": [
    [
     "첫 연습 뒤 의견",
     "계단 입구에서 친구가 몰렸다는 의견"
    ],
    [
     "수정 계획",
     "교사와 순서·도움 배치를 보완"
    ],
    [
     "다음에 할 일",
     "안전한 재연습 뒤 실제 효과 확인"
    ]
   ],
   "conditions": "교재 예제의 가상 의견이에요. 내가 실제로 받은 의견·고친 점·재연습 결과와 구별해요.",
   "options": {
    "next": "계획은 보완했지만 재연습 전에는 개선 효과를 확인했다고 하지 않는다",
    "done": "계획 그림을 고쳤으므로 실제 대처가 완벽해졌다고 한다",
    "invent": "재연습하지 않고 성공한 수치와 결과를 채운다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "첫 연습의 근거·받은 의견·수정 계획·실제 재연습을 나누어요. 실제로 다시 살핀 뒤 어려움과 효과를 확인하고 아직 못 한 일은 다음 계획으로 남겨요."
  },
  "display": {
   "label": "받은 의견과 고친 계획, 다시 연습하기",
   "rows": [
    [
     "첫 연습 뒤 의견",
     "계단 입구에서 친구가 몰렸다는 의견"
    ],
    [
     "고칠 계획",
     "선생님과 이동 순서와 도움받을 방법을 고칠 계획"
    ],
    [
     "다음에 할 일",
     "선생님과 안전하게 다시 연습한 뒤 무엇이 나아졌는지 살피기"
    ]
   ],
   "conditions": "교재의 예시로 만든 이야기예요. 직접 받은 의견과 고친 계획, 다시 연습해 본 결과는 따로 적어요.",
   "options": {
    "next": "계획은 고쳤지만 다시 연습하기 전에는 무엇이 나아졌는지 아직 모른다",
    "done": "계획 그림을 고쳤으니 실제 대처도 완벽해졌다고 한다",
    "invent": "다시 연습하지 않고 성공한 숫자와 결과를 채운다",
    "unknown": "자료를 더 살펴보겠다"
   },
   "reason": "처음 연습에서 한 일, 받은 의견, 고친 계획, 다시 연습해 본 결과를 나누어 살펴요. 다시 해 본 뒤 나아진 점과 아직 어려운 점을 찾아요. 아직 해 보지 못한 일은 다음에 언제 할지 정해요."
  }
 },
 "combustion-compare:ecosystem": {
  "prior": {
   "label": "껍데기 생장의 가상 자료",
   "heads": [
    "조건",
    "14일 동안 새로 자란 껍데기 길이(mm)"
   ],
   "rows": [
    [
     "A: 처음 비교 조건",
     2.1
    ],
    [
     "B: 이산화 탄소가 더 많은 바닷물 조건",
     1.2
    ]
   ],
   "figureKey": "shells",
   "conditions": "14일 동안의 껍데기 생장을 비교하는 가상 모형 값이에요. NOAA의 실측값이나 우리 반 실험값이 아니며 사진도 피해 비교 사진이 아니에요.",
   "question": "이 자료로 어디까지 설명할 수 있을까요?",
   "options": {
    "scope": "이 가상 자료에서 B의 생장 길이가 A보다 0.9mm 작다",
    "real": "이 수치는 국내 모든 조개의 현재 피해 실측값이다",
    "all": "모든 바다 생물은 언제나 같은 크기의 피해를 받는다",
    "unknown": "아직 잘 모르겠다"
   },
   "reason": "2.1−1.2=0.9mm로 이 가상 자료의 B에서 새로 자란 길이가 작아요. 실제 사례는 장소·시기·생물과 자료의 출처를 조사해 설명해요. 가상 값을 현실의 피해 수치로 바꾸지 않아요."
  },
  "display": {
   "label": "껍데기가 자란 길이의 예시 자료",
   "conditions": "14일 동안 껍데기가 얼마나 자랐는지 비교하도록 만든 모형 값이에요. NOAA의 실제 관측값이나 우리 반 실험값은 아니에요. 사진도 피해를 비교한 사진은 아니에요.",
   "options": {
    "scope": "이 예시 자료에서 B의 새로 자란 길이가 A보다 0.9mm 짧다",
    "real": "이 숫자는 우리나라 모든 조개의 지금 피해를 직접 잰 값이다",
    "all": "모든 바다 생물은 언제나 같은 크기의 피해를 받는다",
    "unknown": "아직 잘 모르겠다"
   }
  }
 }
};
const matches=(material,prior)=>!!material&&Object.keys(material).length===Object.keys(prior).length&&Object.entries(prior).every(([key,value])=>Object.hasOwn(material,key)&&JSON.stringify(material[key])===JSON.stringify(value));
export function learnerComparisonMaterial(kind,id,material){
 const key=kind+':'+id,entry=Object.hasOwn(wording,key)?wording[key]:undefined;
 return entry&&matches(material,entry.prior)?{...structuredClone(material),...structuredClone(entry.display)}:material;
}
export function learnerComparisonValues(kind,row,validate){
 if(row?.kind!==kind||typeof validate!=='function'||!validate(row))throw RangeError('확인이 필요한 비교 자료예요.');
 const material=learnerComparisonMaterial(kind,row.case,row.material);
 return [material.label,material.options[row.prediction],material.reason];
}
const priorPage={"id":"seacase","phase":"ecosystem","title":"연습 자료와 실제 피해 사례를 구별해요","text":["아래 수치는 껍데기 생장 비교를 연습하도록 만든 가상 자료예요. NOAA 글에 나온 실측값이 아니에요."],"kind":"think","standards":["6과14-04"],"caseId":"ecosystem"},priorCue="연습 자료와 실제 피해 사례를 구별해요. 아래 수치는 껍데기 생장 비교를 연습하도록 만든 가상 자료예요. NOAA 글에 나온 실측값이 아니에요.",newText="아래 숫자는 껍데기가 새로 자란 길이를 비교하도록 만든 예시 자료예요. NOAA 글에 나온 실제 관측값은 아니에요.";
export function withComparisonLearnerCues(mod){
 const chapter=mod?.chapter;
 if(chapter?.unit==='s41-u03'&&chapter.slideCues?.feedback==='받은 의견·수정 계획·실제 재연습 효과를 나누어요.')return {...mod,chapter:{...chapter,slideCues:{...chapter.slideCues,feedback:'받은 의견과 고친 계획, 다시 연습해 본 결과를 나누어 설명해요.'}}};
 if(chapter?.unit!=='c22-s62-u02'||!Array.isArray(chapter.combustionFlow))return mod;
 let changed=false;
 const flow=chapter.combustionFlow.map(page=>{if(page.id!=='seacase'||!matches(page,priorPage))return page;changed=true;return {...page,text:[newText,...page.text.slice(1)]};});
 if(!changed)return mod;
 const cues=chapter.slideCues?.seacase===priorCue?{...chapter.slideCues,seacase:priorPage.title+'. '+newText}:chapter.slideCues;
 return {...mod,chapter:{...chapter,combustionFlow:flow,slideCues:cues}};
}
