// Brief responses, observation and labeled models for grade-five strata and fossils.
export const GEOLOGY_GUIDED_VERSION='20261124-geology-guided-tasks';
const unit='c22-s51-u01',prior='fb5d74f02bf0affe';
const review={
  "11": {
    "prompt": "지층이 쌓인 순서를 알아보려 해요. 층이 뒤집혔는지와 관련하여 먼저 확인할 점을 짧게 쓰세요.",
    "answer": "층이 뒤집히거나 순서가 바뀌지 않았는지 확인해요.",
    "required": [
      "층이 뒤집히거나 쌓인 순서가 바뀌었는지 확인한다는 답"
    ],
    "explanation": "순서가 바뀌지 않은 지층에서는 아래층이 먼저 쌓였어요. 색이나 두께만으로 쌓인 순서를 정하지 않아요.",
    "before": "6e31ba7fea6f1db9",
    "lines": 1
  },
  "42": {
    "prompt": "이암·사암·역암을 나눌 때 무엇의 크기를 비교하나요?",
    "answer": "암석을 이루는 알갱이의 크기를 비교해요.",
    "required": [
      "암석 전체가 아닌 암석을 이루는 알갱이의 크기"
    ],
    "explanation": "매우 작은 진흙 알갱이가 중심인 이암, 모래 크기 알갱이가 중심인 사암, 자갈 크기 알갱이가 뚜렷한 역암을 같은 기준으로 나누어요.",
    "before": "ffb08b2354a63ec9",
    "lines": 1
  },
  "66": {
    "prompt": "생물의 몸 전체 말고 화석으로 남을 수 있는 것을 한 가지만 쓰세요.",
    "answer": "과거 생물의 발자국 같은 활동 흔적도 남을 수 있어요.",
    "required": [
      "과거 생물의 몸 일부·잎이나 껍데기 모양·활동 흔적 중 알맞은 예 하나"
    ],
    "explanation": "몸의 일부나 활동 흔적도 지층 등에 보존되어 화석으로 남을 수 있어요. 오늘 남긴 무늬나 사람이 만든 모형과는 구별해요.",
    "before": "a9fc8b07c591781d",
    "lines": 1
  },
  "67": {
    "prompt": "바다에서 살던 생물의 화석이 그 지층에 남아 있다고 조사했어요. 지층이 쌓일 무렵 어떤 환경이었을지 짧게 쓰세요.",
    "answer": "바다와 관련된 환경이었을 수 있어요.",
    "required": [
      "그 지층이 쌓일 무렵 바다와 관련된 환경이었다는 추리"
    ],
    "explanation": "생물이 바다에서 살았다는 자료와 그 지층에 화석이 남았다는 자료를 함께 읽어요. 지금도 바다인지, 정확한 수온과 연도는 이 자료만으로 정할 수 없어요.",
    "before": "c7bf8c9e74820f70",
    "lines": 1
  },
  "21": {
    "prompt": "사진 속 지층의 실제 두께를 알아보려 해요. 사진에 어떤 표시가 더 있어야 할까요? 짧게 쓰세요.",
    "answer": "자처럼 실제 크기를 알려 주는 표시가 있어야 해요.",
    "required": [
      "자·눈금·축척 등 실제 크기를 알려 주는 표시"
    ],
    "explanation": "사진은 실제보다 크게 또는 작게 보일 수 있어요. 크기를 알려 주는 표시나 실제 측정 자료가 있어야 두께를 알아볼 수 있어요.",
    "before": "e9569487c0c88531",
    "lines": 1
  },
  "22": {
    "prompt": "진흙 → 모래 → 자갈을 한 종류씩 따로 쌓고 뒤집거나 깎지 않았어요. 가장 아래에 있는 재료를 넣은 차례와 함께 짧게 쓰세요.",
    "answer": "처음 넣은 진흙이에요.",
    "required": [
      "처음 넣은 진흙이 맨 아래에 놓였다는 답"
    ],
    "explanation": "따로 쌓은 모형에서는 처음 넣은 재료가 아래에 놓여요. 여러 재료를 한꺼번에 섞어 물에서 가라앉히는 실험과는 달라요.",
    "before": "44b1b23d47ad54ab",
    "lines": 1
  },
  "49": {
    "prompt": "붉은색이라는 것만으로 사암이라고 정하기는 어려워요. 사암인지 알아보려면 알갱이에서 무엇을 살펴야 할까요?",
    "answer": "모래 크기의 알갱이인지 살펴요.",
    "required": [
      "모래 크기 알갱이인지 관찰한다는 답"
    ],
    "explanation": "사암은 모래 크기 알갱이가 중심인 퇴적암이에요. 색만으로 이름을 정하지 않고 알갱이를 살펴요. 잘 보이지 않으면 돋보기로 더 관찰해요.",
    "before": "afb560243641dbda",
    "lines": 1
  },
  "77": {
    "prompt": "지금은 산인 곳이에요. 자료로 볼 때 이 지층이 쌓일 무렵에는 어떤 환경이었을지 짧게 쓰세요.",
    "answer": "바다와 관련된 환경이었을 수 있어요.",
    "required": [
      "바다에 살던 생물과 그 지층에 남은 화석으로 바다와 관련된 과거 환경을 추리함"
    ],
    "explanation": "생물 A가 바다에 살았다는 자료와 이 지층에 화석이 남았다는 자료를 연결해요. 지금 산이라고 과거에도 늘 산이었던 것은 아니에요.",
    "before": "c33c0c996636f9ff",
    "lines": 1
  },
  "14": {
    "prompt": "모래·자갈·진흙을 한 종류씩 넣을 차례를 정하고 세 층을 그리세요. 아래·가운데·위에 재료 이름표를 붙이고, 처음 넣은 재료에 동그라미 하세요. 뒤집거나 깎지 않아요.",
    "answer": "예: 아래 모래·가운데 자갈·위 진흙으로 그리고 처음 넣은 모래에 표시해요.",
    "required": [
      "정한 순서에 맞는 세 층의 이름표와 처음 넣은 재료 표시"
    ],
    "explanation": "세 재료를 한 종류씩 쌓으면 넣은 차례가 아래부터 위로 나타나요. 실제로 만든 모형과 그림으로 정한 계획도 구별해요.",
    "before": "7c892eb8b2b69916",
    "drawingExplanationLines": 0
  },
  "28": {
    "prompt": "가: 자갈 → 모래 → 진흙, 나: 진흙 → 모래 → 자갈로 한 종류씩 쌓고 뒤집거나 깎지 않았어요. 두 칸에 세 층을 그리고 각 층에 재료 이름표를 붙이세요.",
    "answer": "가: 아래 자갈·가운데 모래·위 진흙. 나: 아래 진흙·가운데 모래·위 자갈.",
    "required": [
      "두 순서에 맞는 아래·가운데·위의 재료 이름표"
    ],
    "explanation": "큰 자갈이 언제나 맨 아래에 놓이는 것은 아니에요. 한 종류씩 따로 쌓은 모형에서는 먼저 넣은 재료가 아래에 놓여요.",
    "before": "bf4b84aa8b94d4ac",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "55": {
    "prompt": "가·나·다의 관찰 기록을 보고 암석 소개 카드를 세 칸에 그리세요. 각 카드에는 알갱이 모습과 암석 이름을 짧게 나타내세요.",
    "answer": "가 이암·나 사암·다 역암과 각각 매우 작은 알갱이·모래·자갈 크기의 모습",
    "required": [
      "가·나·다의 알갱이 크기에 맞는 세 암석 이름과 간단한 그림"
    ],
    "explanation": "매우 작은 알갱이가 중심인 가는 이암, 모래 크기인 나는 사암, 자갈 크기가 뚜렷한 다는 역암이에요. 잘 보이지 않는 표본은 더 관찰해요.",
    "before": "8294722c7c919f0a",
    "drawingExplanationLines": 0,
    "drawingPanels": 3
  },
  "56": {
    "prompt": "통에 쌓은 모래와 실제 사암을 두 칸에 그리세요. 각 칸에 쌓인 모래, 오랫동안 다져지고 굳은 사암이라는 이름표를 붙이세요.",
    "answer": "쌓여 있는 모래 알갱이 / 다져지고 굳어 있는 사암을 두 칸으로 나누어요.",
    "required": [
      "쌓인 모래와 다져지고 굳은 사암을 구별한 두 그림과 이름표"
    ],
    "explanation": "통에 모래를 쌓은 것만으로 사암이 되지는 않아요. 실제 사암이 만들어질 때에는 오랫동안 다져지고 굳는 과정이 있어요.",
    "before": "a2062a5030bbc3e6",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "72": {
    "prompt": "자료에서 짐작한 과거 환경을 그림으로 나타내세요. 그렇게 짐작하는 데 도움이 된 자료 한 곳에 동그라미 하세요.",
    "answer": "바다와 관련된 환경을 그리고, 바다에 살던 생물 또는 그 지층에 남은 화석 자료에 표시해요.",
    "required": [
      "자료에 맞는 바다와 관련된 환경의 그림과 근거가 된 자료 한 곳의 표시"
    ],
    "explanation": "바다에서 살던 생물 A의 화석이 그 지층에 보존되었다는 두 자료로 과거 환경을 짐작해요. 정확한 수온과 연도까지 정한 그림은 아니에요.",
    "before": "5b07aabf4050b94d",
    "drawingExplanationLines": 0
  },
  "80": {
    "prompt": "조개 모양 교구를 점토에 눌렀다 떼는 모습을 세 칸에 그리세요. 누르기 전·누를 때·떼어 낸 뒤의 이름표와 남은 무늬를 나타내세요. 점토는 데우지 않아요.",
    "answer": "점토와 교구 준비 / 가볍게 누르기 / 떼어 낸 뒤 남은 윤곽과 무늬를 세 칸에 나타내요.",
    "required": [
      "세 단계의 차례와 교구를 떼어 낸 뒤 남은 윤곽·무늬"
    ],
    "explanation": "실온에서 안전한 교구를 가볍게 눌렀다 떼어요. 실제 화석이 만들어지는 오랜 시간과 모든 과정을 재현한 것은 아니에요.",
    "before": "d953c6cffc66afa5",
    "drawingExplanationLines": 0,
    "drawingPanels": 3
  }
};
const bankReview={
  "c22-s51-u01-b008": {
    "prompt": "지층을 관찰할 때 살펴볼 특징을 한 가지만 쓰세요.",
    "answer": "층의 색을 살펴요.",
    "required": [
      "층의 색·두께·모양·경계 등 관찰할 수 있는 특징 하나"
    ],
    "explanation": "층의 색과 두께, 층이 놓인 모양과 경계를 살펴요. 정확히 몇 년에 만들어졌는지는 사진만으로 알 수 없어요.",
    "before": [
      "220d6387e3bdbf05"
    ]
  },
  "c22-s51-u01-b016": {
    "prompt": "지층 사진에서 가려져 보이지 않는 곳이 있어요. 그곳을 어떻게 기록하면 좋을까요?",
    "answer": "사진에서 확인하지 못했다고 적어요.",
    "required": [
      "가려진 곳을 추측으로 채우지 않고 확인하지 못했다고 표시함"
    ],
    "explanation": "보이는 곳의 특징과 가려져 알 수 없는 곳을 나누어요. 보이지 않는 모습을 지어 채우지 않아요.",
    "before": [
      "bd5cc0797d22841f"
    ]
  },
  "c22-s51-u01-b024": {
    "prompt": "지층이 쌓인 순서를 알아보려 해요. 층이 뒤집혔는지와 관련하여 먼저 확인할 점을 짧게 쓰세요.",
    "answer": "층이 뒤집히거나 순서가 바뀌지 않았는지 확인해요.",
    "required": [
      "층이 뒤집히거나 쌓인 순서가 바뀌었는지 확인한다는 답"
    ],
    "explanation": "순서가 바뀌지 않은 지층에서는 아래층이 먼저 쌓였어요. 색이나 두께만으로 쌓인 순서를 정하지 않아요.",
    "before": [
      "1806b4ca32e50d00"
    ]
  },
  "c22-s51-u01-b032": {
    "prompt": "모래·자갈·진흙을 한 종류씩 쌓는 모형을 만들려 해요. 세 재료를 넣을 차례를 정해 쓰세요.",
    "answer": "예: 모래 → 자갈 → 진흙",
    "required": [
      "세 재료를 한 종류씩 넣는 구체적인 순서 하나"
    ],
    "explanation": "정한 차례대로 실제로 쌓아 아래·가운데·위에 어떤 재료가 놓였는지 살펴요. 뒤집거나 깎으면 처음의 순서가 달라질 수 있어요.",
    "before": [
      "74280f67c6eacc11"
    ]
  },
  "c22-s51-u01-b040": {
    "prompt": "통에 쌓은 모래가 실제 사암이 되려면 어떤 과정이 더 필요할까요? 짧게 쓰세요.",
    "answer": "오랫동안 다져지고 굳는 과정이 필요해요.",
    "required": [
      "모래가 오랫동안 다져지고 굳는 과정"
    ],
    "explanation": "모래를 쌓은 모형은 층이 생기는 모습을 나타내요. 쌓기만 했다고 곧바로 단단한 사암이 되는 것은 아니에요.",
    "before": [
      "8f65554eaec58fcc"
    ]
  },
  "c22-s51-u01-b048": {
    "prompt": "두 모둠이 서로 다르게 확대한 사진으로 알갱이를 비교했어요. 먼저 맞춰 볼 사진의 정보를 한 가지만 쓰세요.",
    "answer": "사진의 배율을 확인해요.",
    "required": [
      "사진의 배율 또는 실제 크기를 알려 주는 기준"
    ],
    "explanation": "사진을 확대한 정도가 다르면 알갱이도 다르게 보일 수 있어요. 인쇄한 사진 크기만 같게 하는 것과 실제 배율을 맞추는 것은 달라요.",
    "before": [
      "78ab0c0f4f6fbe0d"
    ]
  },
  "c22-s51-u01-b056": {
    "prompt": "이암·사암·역암을 나눌 때 무엇의 크기를 비교하나요?",
    "answer": "암석을 이루는 알갱이의 크기를 비교해요.",
    "required": [
      "암석 전체가 아닌 암석을 이루는 알갱이의 크기"
    ],
    "explanation": "매우 작은 진흙 알갱이가 중심인 이암, 모래 크기 알갱이가 중심인 사암, 자갈 크기 알갱이가 뚜렷한 역암을 같은 기준으로 나누어요.",
    "before": [
      "822b04ac7763d5be"
    ]
  },
  "c22-s51-u01-b064": {
    "prompt": "암석 분류표에 이름만 적혀 있어요. 왜 그렇게 나누었는지 알려면 어떤 관찰 내용을 더 적어야 할까요?",
    "answer": "관찰한 알갱이의 크기를 적어요.",
    "required": [
      "분류 근거인 알갱이 크기 관찰 내용"
    ],
    "explanation": "암석 이름 옆에 관찰한 알갱이의 크기를 함께 나타내요. 잘 보이지 않으면 이름을 서둘러 정하지 않고 더 관찰해요.",
    "before": [
      "dc4eab35152a2773"
    ]
  },
  "c22-s51-u01-b072": {
    "prompt": "생물의 몸 전체 말고 화석으로 남을 수 있는 것을 한 가지만 쓰세요.",
    "answer": "과거 생물의 발자국 같은 활동 흔적도 남을 수 있어요.",
    "required": [
      "과거 생물의 몸 일부·잎이나 껍데기 모양·활동 흔적 중 알맞은 예 하나"
    ],
    "explanation": "몸의 일부나 활동 흔적도 지층 등에 보존되어 화석으로 남을 수 있어요. 오늘 남긴 무늬나 사람이 만든 모형과는 구별해요.",
    "before": [
      "386ec4d673a3dbdc"
    ]
  },
  "c22-s51-u01-b080": {
    "prompt": "조개 모양 교구를 점토에 눌렀다 떼었어요. 남은 모양에서 살펴볼 특징을 한 가지만 쓰세요.",
    "answer": "조개의 무늬가 남았는지 살펴요.",
    "required": [
      "남은 윤곽·무늬·모양의 선명함 등 관찰할 특징 하나"
    ],
    "explanation": "남은 윤곽과 무늬를 원래 교구와 비교해요. 짧은 시간에 사람이 만든 점토 모형과 실제 화석은 생기는 시간과 과정이 달라요.",
    "before": [
      "7de7e10e17417cc4"
    ]
  },
  "c22-s51-u01-b088": {
    "prompt": "바다에서 살던 생물의 화석이 그 지층에 남아 있다고 조사했어요. 지층이 쌓일 무렵 어떤 환경이었을지 짧게 쓰세요.",
    "answer": "바다와 관련된 환경이었을 수 있어요.",
    "required": [
      "그 지층이 쌓일 무렵 바다와 관련된 환경이었다는 추리"
    ],
    "explanation": "생물이 바다에서 살았다는 자료와 그 지층에 화석이 남았다는 자료를 함께 읽어요. 지금도 바다인지, 정확한 수온과 연도는 이 자료만으로 정할 수 없어요.",
    "before": [
      "0e9bf160c6a117ae"
    ]
  },
  "c22-s51-u01-b096": {
    "prompt": "화석이 소중한 까닭을 한 가지만 쓰세요.",
    "answer": "과거에 어떤 생물이 살았는지 알아보는 데 도움이 돼요.",
    "required": [
      "과거 생물이나 환경을 알아보는 자료가 된다는 설명 하나"
    ],
    "explanation": "화석에 남은 특징과 관련 자료는 지구의 과거를 알아보는 데 도움이 돼요. 관심 있는 화석을 조사해 친구에게 소개해 보아요.",
    "before": [
      "ebc3f938f8936896"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const bankCache=new WeakMap(),bookCache=new WeakMap();
const contract=(old,e)=>({...old,sample:e.answer,reviewRequired:true,rubric:{...old.rubric,required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 다른 예도 교사가 확인해요.'}});
export function geologyGuidedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type==='original'||!e.before.includes(fingerprint(q)))return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
  const result={...q,prompt:[e.prompt,...(e.parts||[])].join('\n'),answerContract:contract(q.answerContract,e),explanation:e.explanation,geologyGuidedResponse:GEOLOGY_GUIDED_VERSION,contentVersion:GEOLOGY_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,result);return result;
 });return changed?next:rows;
}
export function withGeologyGuidedClassroom(u,mod){if(u!==unit)return mod;const items=geologyGuidedItems(mod?.classroomItems,u);return items===mod?.classroomItems?mod:{...mod,classroomItems:items};}
const fields={
  "워밍업": [
    "워밍업",
    "줄무늬가 있는 돌이나 화석 사진을 본 경험을 말해 보세요. 경험이 없다면 사진에서 층 하나를 짚어 보세요."
  ],
  "궁금한 점": [
    "궁금한 것을 말해요",
    "지층·암석·화석 중 더 살펴보고 싶은 것을 한 가지만 말해 보세요."
  ],
  "지층의 특징 관찰하기": [
    "사진에서 짚어 보아요",
    "색이나 두께가 서로 다른 두 층을 사진에서 찾아 짝에게 보여 주세요."
  ],
  "아직 모르는 것": [
    "더 살펴볼 곳을 골라요",
    "가려진 부분이나 크기를 알려 주는 표시 중 더 살펴볼 것을 하나 골라 말해 보세요."
  ],
  "층의 위치 비교하기": [
    "넣은 차례와 짝지어요",
    "표에서 처음 넣은 재료를 찾아 아래층의 재료와 짝지어 보세요."
  ],
  "층의 순서를 비교할 때 확인할 점": [
    "층의 순서를 살펴요",
    "모형을 뒤집거나 깎았는지 확인하고 넣은 차례와 층의 위치를 비교해 보세요."
  ],
  "실제와 다른 점": [
    "실제로 만들어 보아요",
    "정한 차례대로 재료를 한 종류씩 쌓아 모형을 만들어요. 어느 재료가 아래·가운데·위에 놓였는지 살펴보고 짝과 말해요."
  ],
  "나의 설명": [
    "쌓인 모래와 사암을 구별해요",
    "모래를 쌓은 모습과 오랫동안 다져지고 굳어 사암이 된 모습을 표에서 짝지어 보세요."
  ],
  "알갱이를 관찰하는 방법": [
    "알갱이를 직접 살펴요",
    "같은 표본을 눈과 돋보기로 관찰하고 알갱이 크기를 말해요."
  ],
  "분류가 다를 때 다시 살펴보기": [
    "같은 기준으로 비교해요",
    "친구와 분류가 다르면 같은 표본의 알갱이 크기를 함께 다시 살펴보세요."
  ],
  "사진에서 본 특징": [
    "화석의 모양을 찾아요",
    "이쪽의 물고기 몸과 다음 쪽의 고사리 잎에서 보이는 특징을 짚어 말해 보세요."
  ],
  "오해 고치기": [
    "몸과 흔적을 나누어요",
    "다음 쪽 표에서 생물의 몸 일부가 남은 것과 활동 흔적이 남은 것을 각각 찾아보세요."
  ],
  "모형 계획과 관찰할 것": [
    "화석 모형을 직접 만들어요",
    "교구의 겉모양을 먼저 살피고 점토에 가볍게 눌렀다 떼어 보세요. 남은 윤곽이나 무늬를 교구와 비교해요. 잘 남지 않은 부분은 한 가지 방법을 바꾸어 다시 만들어 보아요."
  ],
  "비교 설명": [
    "모형과 실제를 비교해요",
    "점토 모형과 실제 화석이 생기는 시간이나 과정을 표에서 비교해 말해 보세요."
  ],
  "알아낸 것과 더 알아볼 것": [
    "두 자료를 연결해요",
    "화석이 나온 지층과 그 생물이 살던 곳의 자료를 각각 짚고, 과거 환경을 짐작해 보세요."
  ],
  "내가 소개할 근거": [
    "관심 있는 화석을 소개해요",
    "박물관이나 기관 자료에서 화석 하나를 조사해 친구에게 소개해요. 어떤 특징을 보았고 어떤 자료에서 알았는지 말해요."
  ],
  "질문을 듣고 보완하기": [
    "질문을 듣고 다시 설명해요",
    "친구가 실제로 물어본 것을 듣고 자료를 더 찾아 설명해 보세요. 아직 소개하지 않았다면 다음에 할 일로 말해요."
  ],
  "내가 배운 내용 설명하기": [
    "한 가지를 골라 말해요",
    "지층·퇴적암·화석 중 하나를 골라 관찰한 것과 알게 된 것을 짝에게 말해 보세요."
  ]
};
const cues=[
  "사진에서 색이나 두께가 다른 층을 짚어 보세요.",
  "더 살펴보고 싶은 것 하나를 말해 보세요.",
  "보이는 곳과 가려진 곳을 나누어 살펴보세요.",
  "처음 넣은 재료가 놓인 곳을 짚어 보세요.",
  "실제 모형의 세 층을 넣은 차례와 짝지어 보세요.",
  "쌓인 모래와 굳은 사암의 차이를 말해 보세요.",
  "돌 전체와 알갱이의 크기를 나누어 보세요.",
  "같은 크기 기준으로 세 암석을 짝지어 보세요.",
  "물고기의 몸이나 고사리 잎에서 보이는 것을 짚어 보세요.",
  "몸 일부와 활동 흔적을 짝지어 보세요.",
  "교구를 떼기 전과 후를 실제로 비교해 보세요.",
  "점토 모형과 실제 화석이 생기는 시간을 비교해 보세요.",
  "생물이 살던 곳과 화석이 나온 지층을 연결해 보세요.",
  "조사한 화석의 특징과 자료를 친구에게 소개해 보세요.",
  "관찰한 것 중 한 가지를 골라 말해 보세요.",
  "층의 색과 두께를 사진에서 찾아보세요.",
  "그림에서 휘어진 층을 찾아보세요.",
  "층이 끊어진 곳을 짚어 보세요.",
  "아래층과 위층의 위치를 찾아보세요.",
  "층의 순서가 바뀌지 않았는지 살펴보세요.",
  "모형이 나타내는 모습을 찾아보세요.",
  "여러 겹의 층이 있는 곳을 짚어 보세요.",
  "뒤집혔는지 먼저 살펴야 하는 까닭을 말해 보세요.",
  "넣은 차례와 아래부터의 순서를 짝지어 보세요.",
  "그림에 쓸 세 재료의 이름을 골라 보세요.",
  "사진에서 보이는 지층의 특징을 찾아보세요.",
  "사진에서 쌓인 모습을 살펴보세요.",
  "수평·휘어짐·끊어짐을 구별해 보세요.",
  "가와 나에서 넣은 차례를 찾아보세요.",
  "사진 크기와 실제 크기를 나누어 말해 보세요.",
  "실제 크기를 알려 주는 표시를 찾아보세요.",
  "처음 넣은 재료가 어디에 놓였는지 말해 보세요.",
  "색·두께·경계를 찾아보세요.",
  "정한 계획과 실제로 만든 일을 구별해 보세요.",
  "고친 방법과 실제로 달라진 모습을 살펴보세요.",
  "두 칸의 아래층 재료를 비교해 보세요.",
  "쌓인 퇴적물과 굳은 퇴적암을 짝지어 보세요.",
  "알갱이를 더 크게 볼 도구를 골라 보세요.",
  "색 대신 알갱이의 크기를 살펴보세요.",
  "같은 기준으로 암석을 나누어 보세요.",
  "눈과 돋보기로 보이는 차이를 말해 보세요.",
  "쌓이는 과정과 굳는 과정을 나누어 보세요.",
  "알갱이를 관찰할 도구를 찾아보세요.",
  "모래 크기 알갱이를 찾아보세요.",
  "돌 전체와 알갱이 중 무엇의 크기인지 말해 보세요.",
  "알갱이 크기와 암석 이름을 짝지어 보세요.",
  "쌓인 물질과 굳은 암석을 구별해 보세요.",
  "자갈과 작은 알갱이를 각각 찾아보세요.",
  "세 암석에 같은 기준을 적용해 보세요.",
  "사암에서 살펴볼 알갱이를 말해 보세요.",
  "작은 알갱이를 더 살펴볼 도구를 짚어 보세요.",
  "보이는 것과 더 관찰할 것을 짝지어 보세요.",
  "실제로 관찰한 표본의 특징을 말해 보세요.",
  "세 카드에서 알갱이 크기를 구별해 보세요.",
  "쌓인 모래와 굳은 사암의 모습을 비교해 보세요.",
  "동물·식물·활동 흔적을 구별해 보세요.",
  "모형과 실제 화석의 공통점과 차이를 찾아보세요.",
  "화석과 그 생물이 살던 곳의 자료를 짝지어 보세요.",
  "화석이 소중한 까닭을 말해 보세요.",
  "모형이 나타낸 점과 실제와 다른 점을 찾아보세요.",
  "몸 전체 말고 남을 수 있는 것을 찾아보세요.",
  "생물의 생활 자료와 발견된 지층을 연결해 보세요.",
  "화석에 남은 몸의 특징을 찾아보세요.",
  "실제로 본 것과 자료로 짐작한 것을 나누어 보세요.",
  "그림을 그리는 데 도움이 된 자료를 골라 보세요.",
  "몸 일부와 활동 흔적의 예를 찾아보세요.",
  "사진에서 본 것과 더 필요한 자료를 구별해 보세요.",
  "교구를 누른 뒤 남은 무늬를 찾아보세요.",
  "현재 모습과 과거 환경을 구별해 말해 보세요.",
  "어느 자료를 연결해 짐작했는지 짚어 보세요.",
  "누르기 전·누를 때·떼어 낸 뒤를 차례로 말해 보세요."
];
export function withGeologyGuidedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(bookCache.has(w))return bookCache.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const criteria=e.required.join(' / '),changes={prompt:e.prompt,answer:e.answer,criteria,explanation:e.explanation,misconception:'관찰한 특징과 자료의 조건에 맞게 짧게 나타냈는지 살펴요.',responseContract:{type:q.form,teacherRequired:true,criteria},geologyGuidedResponse:GEOLOGY_GUIDED_VERSION,contentVersion:GEOLOGY_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['lines','drawingPanels','drawingExplanationLines'])if(Object.hasOwn(e,k))changes[k]=e[k];
  if(q.sourceContract&&bankReview[q.sourceId]){const source=bankReview[q.sourceId];changes.sourceContract=contract(q.sourceContract,source);changes.sourceExplanation=source.explanation;}return{...q,...changes};});
 const titles={11:'층의 순서를 확인해요',14:'세 층을 그림으로 나타내요',21:'사진에서 실제 두께를 알려면',22:'가장 아래의 재료는 무엇일까요?',28:'쌓는 순서가 다른 두 모형',42:'암석을 나누는 같은 기준',49:'사암의 알갱이를 살펴요',55:'세 암석 소개 카드',56:'쌓인 모래와 굳은 사암',66:'몸의 일부와 활동 흔적',67:'과거 환경을 짐작해요',72:'자료로 과거 환경을 그려요',77:'지금은 산인 곳의 과거 환경',80:'점토에 무늬가 남는 세 장면'};
 const rewritten=w.pages.map((p,i)=>{const ns=p.blocks.flatMap(b=>b.ids||[]).map(id=>questions.find(q=>q.id===id)?.no);return{...p,...(ns.length===1&&titles[ns[0]]?{title:titles[ns[0]]}:{}),blocks:p.blocks.flatMap(b=>b.type==='field'?[{type:'heading',text:fields[b.title][0]},{type:'text',text:fields[b.title][1]}]:[b]),rail:p.rail.map(n=>n.title==='내가 정리할 것'?Object.fromEntries([...Object.entries(n).filter(([k])=>k!=='write'&&k!=='text'),['text',cues[i]]]):n)};});
 const mergePairs=new Map([[10,11],[20,21],[22,23],[41,42],[47,49],[65,66],[67,68]]),drop=new Set([11,21,23,42,49,66,68]);
 const firstNo=p=>questions.find(q=>q.id===p.blocks.flatMap(b=>b.ids||[])[0])?.no;
 const teacherDivided=rewritten.flatMap((p,i)=>{
  if(i===6)return[{...p,title:'퇴적암의 알갱이를 관찰해요'}];
  if(i===8)return[{...p,title:'화석에서 몸과 흔적을 찾아요',blocks:[p.blocks[0],rewritten[9].blocks[1],...p.blocks.slice(3),...rewritten[9].blocks.slice(2)]}];
  if(i===9)return[{...p,title:'화석의 특징과 과거 환경',blocks:[rewritten[8].blocks[1],p.blocks[0],rewritten[8].blocks[2]]}];
  const no=firstNo(p);if(drop.has(no))return[];if(!mergePairs.has(no))return[p];
  const next=rewritten[i+1];if(firstNo(next)!==mergePairs.get(no))throw Error('지층의 짧은 답 묶음 순서가 달라요.');
  return[{...p,title:{10:'지층의 이름과 쌓인 순서',20:'사진과 실제 두께를 비교해요',22:'층의 위치와 넣은 차례',41:'사암과 알갱이 크기',47:'같은 기준으로 암석을 나누어요',65:'화석 모형과 생물의 흔적',67:'과거 환경을 알려 주는 화석'}[no],blocks:[...p.blocks,...next.blocks],rail:[p.rail[0],p.rail[1],{title:'내가 정리할 것',text:{10:'지층의 이름과 순서가 바뀌었는지 살펴보세요.',20:'실제 크기를 알려 주는 표시를 찾아보세요.',22:'처음 넣은 재료와 아래층을 짝지어 보세요.',41:'사암을 이루는 알갱이의 크기를 말해 보세요.',47:'같은 알갱이 크기 기준으로 세 암석을 나누어 보세요.',65:'모형과 실제 화석의 차이, 몸 일부와 활동 흔적을 찾아보세요.',67:'과거 환경을 짐작할 때 연결한 자료를 짚어 보세요.'}[no]}]}];
 });
 const ids=ps=>ps.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));const studentDivided=teacherDivided.flatMap(p=>{const ns=p.blocks.flatMap(b=>b.ids||[]).map(id=>questions.find(q=>q.id===id)?.no);return JSON.stringify(ns)==='[52,53]'?ns.map(n=>({...p,section:`연습 ${n}`,blocks:[{type:'questions',ids:[questions[n-1].id]}]})):[p];});
 const packs={student:[[10,11,12,13],[39,40,41,42],[43,44,45],[50,51,52],[53,54]],teacher:[[10,11,12,13],[39,40,41,42],[43,44,45]]};
 const join=(ps,sets)=>{const consumed=new Set();return ps.flatMap((p,i)=>{if(consumed.has(i))return[];const no=firstNo(p),set=sets.find(ns=>ns[0]===no);if(!set)return[p];const collected=[];let j=i;while(collected.length<set.length){const next=ps[j];if(!next||next.blocks.some(b=>b.type!=='questions'))throw Error('지층 짧은 문제 묶음에 다른 활동이 있어요.');collected.push(...next.blocks.flatMap(b=>b.ids||[]).map(id=>questions.find(q=>q.id===id)?.no));if(j>i)consumed.add(j);j++;}if(JSON.stringify(collected)!==JSON.stringify(set))throw Error('지층 짧은 문제 묶음의 문항이 달라요.');return[{...p,title:{10:'지층의 이름과 쌓인 순서',39:'퇴적암의 이름과 알갱이',43:'알갱이와 퇴적암을 비교해요',50:'알갱이를 살피고 암석을 분류해요',53:'관찰하며 분류하는 방법'}[no],section:`연습 ${set[0]}~${set.at(-1)}`,blocks:[{type:'questions',ids:set.map(n=>questions[n-1].id)}]}];});};
 const pages=join(studentDivided,packs.student),teacherStudentPages=join(teacherDivided,packs.teacher);
 if(JSON.stringify(ids(pages))!==JSON.stringify(ids(w.pages))||JSON.stringify(ids(teacherStudentPages))!==JSON.stringify(ids(pages)))throw Error('지층과 화석 문항 순서가 달라요.');
 const solutionPacks=Array.from({length:Math.ceil(questions.length/3)},(_,i)=>questions.slice(i*3,i*3+3).map(q=>q.no)).flatMap(ns=>ns[0]===70?[[70,71],[72]]:[ns]);const teacherPages=solutionPacks.map(ns=>({...w.teacherPages[0],section:`정답·해설 ${ns[0]}~${ns.at(-1)}`,blocks:[{type:'solutions',ids:ns.map(n=>questions[n-1].id)}]}));
 const result={...w,questions,pages,teacherStudentPages,teacherPages};bookCache.set(w,result);return result;
}
