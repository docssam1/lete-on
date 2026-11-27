// Supported observations and short responses for grade-four magnet learning.
export const MAGNET_GUIDED_VERSION='20261124-magnet-guided-tasks';
const unit='s41-u01',prior='6be6d2e59fb53e17';
const review={
  "35": {
    "prompt": "집게의 손잡이와 끝부분이 자석에 붙는지 각각 알아보려고 해요. 두 부분에 가까이할 자석은 어떻게 준비하면 좋을까요?",
    "answer": "같은 자석을 써요.",
    "required": [
      "같은 자석으로 두 부분을 비교한다는 답"
    ],
    "explanation": "같은 자석을 같은 방법으로 가까이해 보아요. 손잡이와 끝부분은 따로 살피고, 안쪽 재료는 겉모습만으로 정하지 않아요.",
    "lines": 1,
    "before": "d0af75ad30d8d377",
    "bankId": "s41-u01-b08",
    "misconception": "겉모습만 보고 안쪽의 재료를 정하지 않아요."
  },
  "36": {
    "prompt": "표에서 종이 한 장을 사이에 두어도 클립이 움직였어요. 자석이 클립에 닿지 않아도 어떤 힘이 작용한 걸까요?",
    "answer": "자석이 클립을 끌어당기는 힘이에요.",
    "required": [
      "떨어져 있어도 자석이 클립을 끌어당겼다는 답"
    ],
    "explanation": "표에서는 같은 자석과 클립을 가까운 거리에 두었어요. 이 조건에서는 사이에 얇은 종이가 있어도 클립이 움직였어요.",
    "lines": 1,
    "before": "f54918da5ce8c6e0",
    "bankId": "s41-u01-b16",
    "misconception": "자석이 철 물체에 닿아야만 힘이 작용하는 것은 아니에요."
  },
  "37": {
    "prompt": "고리 하나를 뒤집기 전과 후에 서로 마주 보는 극을 비교하려고 해요. 각 고리의 윗면만 보아도 될까요? 어느 면을 살펴야 할지 짧게 쓰세요.",
    "answer": "두 고리가 서로 마주 보는 면을 살펴요.",
    "required": [
      "서로 마주 보는 두 면을 살핀다는 답"
    ],
    "explanation": "한 고리의 윗면과 아랫면은 서로 다른 극이에요. 아래 고리의 윗면과 위 고리의 아랫면이 마주 봐요.",
    "lines": 1,
    "before": "28e80cc8cb727a3e",
    "bankId": "s41-u01-b24",
    "misconception": "두 고리의 윗면 표식끼리만 비교하지 않아요."
  },
  "38": {
    "prompt": "교실에서 자석으로 줄이고 싶은 불편을 한 가지만 써 보세요.",
    "answer": "철 클립이 바닥에 흩어져 주워 담기 어려워요.",
    "required": [
      "자석을 이용해 줄일 수 있는 생활 속 불편 한 가지"
    ],
    "explanation": "흩어진 철 클립을 모으거나 종이가 흩어지지 않게 잡는 일처럼 자석이 도움을 줄 상황을 찾아요. 장치의 모습은 뒤의 그림 문제에서 생각해 보아요.",
    "lines": 1,
    "before": "d0a60f1da86f79e3",
    "bankId": "s41-u01-b40",
    "misconception": "먼저 줄이고 싶은 불편을 한 가지 정해요."
  },
  "39": {
    "prompt": "상자로 철 클립을 모으는 장치를 생각하고 있어요. 자석을 어디에 놓을지 한 곳을 정해 짧게 써 보세요.",
    "answer": "상자 입구 가까이에 놓아요.",
    "required": [
      "철 클립을 모을 수 있는 타당한 자석 위치"
    ],
    "explanation": "자석이 철 클립을 끌어당길 수 있는 자리를 골라요. 실제로 만들 때에는 자석이 빠지지 않게 단단히 고정하고 클립을 꺼낼 수 있게 해요.",
    "lines": 1,
    "before": "a1ac6c9df192e90f",
    "bankId": "s41-u01-b56",
    "misconception": "자석이 클립을 잡을 수 있는 자리를 생각해요."
  },
  "40": {
    "prompt": "기록에서 설계 그림은 완성했어요. 아직 만들거나 시험하지 않았는데, “실제로 잘 작동했다.”고 써도 될까요? 까닭을 짧게 쓰세요.",
    "answer": "아직 만들거나 시험하지 않았기 때문에 쓸 수 없어요.",
    "required": [
      "실제로 만들거나 시험하지 않았다는 까닭"
    ],
    "explanation": "그림을 완성한 일과 실제로 만들어 시험한 일은 달라요. 아직 하지 않은 일을 한 것처럼 적지 않아요.",
    "lines": 1,
    "before": "16768e7cc23c9f32",
    "bankId": "s41-u01-b64",
    "misconception": "설계 그림을 완성했다고 실제 작동을 확인한 것은 아니에요."
  },
  "53": {
    "prompt": "직접 본 나침반 바늘의 방향이 설명 그림과 달라요. 기록에는 어느 방향을 적어야 할까요?",
    "answer": "직접 본 바늘의 방향을 적어요.",
    "required": [
      "실제로 관찰한 방향을 그대로 적는다는 답"
    ],
    "explanation": "설명 그림과 다르다고 관찰 기록을 바꾸지 않아요. 수평인지, 가까이에 자석이나 쇠붙이가 있는지 살핀 뒤 다시 관찰할 수 있어요.",
    "lines": 1,
    "before": "118f68adc5fd53e7",
    "misconception": "설명 그림에 맞추려고 직접 본 방향을 바꾸지 않아요."
  },
  "54": {
    "prompt": "자료의 장치 나에서는 작은 자석이 빠졌어요. 이 장치를 다시 쓰기 전에 먼저 고칠 점을 한 가지 쓰세요.",
    "answer": "자석이 빠지지 않게 단단히 고정해요.",
    "required": [
      "작은 자석이 빠지지 않도록 고정하는 개선"
    ],
    "explanation": "빠진 자석은 어른에게 알리고, 자석이 빠지지 않도록 고정을 고쳐요. 고친 뒤에는 종이가 잘 잡히는지와 부품이 안전하게 고정되었는지도 다시 살펴요.",
    "lines": 1,
    "before": "fb6df593d18cc691",
    "misconception": "종이가 잡혔다고 빠지는 부품을 그대로 두지 않아요."
  },
  "75": {
    "prompt": "여러 재료로 만든 물체를 하나 고르고, 자석을 가까이할 두 부분을 그리세요. 각 부분에 짧은 이름표를 붙이고, 같은 자석을 가까이할 곳을 화살표로 표시하세요.",
    "answer": "물체의 서로 다른 두 부분과 이름표를 그리고 같은 자석을 가까이할 위치를 나타낸다.",
    "required": [
      "살펴볼 두 부분과 이름표",
      "같은 자석을 가까이할 위치"
    ],
    "explanation": "재료를 모르는 부분은 짐작해 이름을 붙이지 않아도 돼요. 두 부분에 같은 자석을 같은 방법으로 가까이할 준비를 나타내요.",
    "drawingExplanationLines": 0,
    "before": "4a36e1a7cc507a71",
    "misconception": "아직 모르는 재료는 짐작해 정하지 않아요."
  },
  "76": {
    "prompt": "이 고리 자석은 윗면과 아랫면의 극이 서로 달라요. 아래 고리의 윗면은 N극, 위 고리의 윗면은 S극이에요. 두 고리와 가운데 막대를 그리고, 서로 마주 보는 두 면에만 극을 표시하세요.",
    "answer": "아래 고리의 윗면 N극과 위 고리의 아랫면 N극을 표시하고 가운데 막대와 두 고리 사이의 틈을 나타낸다.",
    "required": [
      "서로 마주 보는 두 면의 N극 표시",
      "가운데 막대와 밀어 내어 생긴 틈"
    ],
    "explanation": "위 고리의 윗면이 S극이므로 아랫면은 N극이에요. N극과 N극이 마주 보면 서로 밀어 내요. 가운데 막대는 자석에 붙지 않는 재료예요.",
    "drawingExplanationLines": 0,
    "before": "852ae0778adbff99",
    "misconception": "윗면의 극과 마주 보는 면의 극을 구별해요."
  },
  "77": {
    "prompt": "자석과 철 물체 사이에 얇은 종이를 넣은 모습과 넣지 않은 모습을 두 칸에 그리세요. 같은 자석과 철 물체를 쓰고, 자석에서 철 물체까지의 거리는 같게 표시하세요.",
    "answer": "같은 자석과 철 물체의 전체 거리를 같게 나타내고 한 칸에만 얇은 종이를 넣는다.",
    "required": [
      "같은 자석과 철 물체",
      "같은 전체 거리와 종이의 유무 차이"
    ],
    "explanation": "종이가 있을 때와 없을 때를 비교하려면 자석에서 철 물체까지의 전체 거리를 같게 해요.",
    "drawingExplanationLines": 0,
    "before": "c4c3da886e8a2b62",
    "drawingPanels": 2,
    "misconception": "종이를 넣으며 전체 거리까지 다르게 하지 않아요."
  },
  "78": {
    "prompt": "같은 나침반을 수평으로 놓은 모습을 두 칸에 그리세요. 왼쪽은 다른 자석을 멀리하고, 오른쪽은 동쪽에 막대자석의 N극을 가까이한 준비 모습이에요. 막대자석의 자리와 N극을 표시하세요.",
    "answer": "같은 나침반을 수평으로 놓고, 왼쪽은 다른 자석을 멀리하며 오른쪽은 동쪽에 막대자석의 N극이 나침반을 향하게 놓는다.",
    "required": [
      "두 나침반을 수평으로 놓은 준비",
      "오른쪽 동쪽에 가까이한 N극의 자리"
    ],
    "explanation": "바늘이 실제로 어느 방향을 가리키는지는 직접 관찰한 뒤 기록해요. 준비 그림에 실제 결과를 미리 정해 넣지 않아요.",
    "drawingExplanationLines": 0,
    "before": "c2a9dd53f87c82a5",
    "drawingPanels": 2,
    "misconception": "준비 그림에 실제로 보지 않은 바늘 방향을 결과처럼 넣지 않아요."
  },
  "79": {
    "prompt": "종이가 흩어지지 않게 잡는 자석 장치를 그리세요. 자석과 서로 끌어당길 다른 부품을 어디에 놓을지 정하고, 두 부품에 짧은 이름표를 붙이세요.",
    "answer": "자석과 철판 또는 서로 다른 극을 마주 둔 두 자석으로 종이를 잡는 구조와 부품의 이름을 나타낸다.",
    "required": [
      "종이를 잡을 수 있는 두 부품의 배치",
      "부품의 재료 또는 극을 알 수 있는 이름표"
    ],
    "explanation": "자석이 철을 끌어당기는 성질이나 서로 다른 극끼리 끌어당기는 성질을 이용할 수 있어요. 실제로 만들 때에는 부품을 단단히 고정해요.",
    "drawingExplanationLines": 0,
    "before": "bf8088b2afcecf88",
    "misconception": "힘이 작용할 두 부품과 종이의 자리를 함께 나타내요."
  },
  "80": {
    "prompt": "자료의 장치 나에서는 작은 자석이 빠졌어요. 자석이 빠지지 않도록 고친 모습을 그리고, 바꾼 부분에 동그라미 하세요.",
    "answer": "작은 자석이 빠지지 않게 덮개나 고정 부분을 보완하고 바꾼 곳에 동그라미 한다.",
    "required": [
      "자석이 빠지지 않게 보완한 구조",
      "바꾼 부분의 동그라미"
    ],
    "explanation": "작은 자석을 단단히 고정할 방법을 그림에 나타내요. 실제로 만들 때에는 어른의 도움을 받아 고정 상태와 작동을 살펴요.",
    "drawingExplanationLines": 0,
    "before": "e5878ae9b581163b",
    "misconception": "빠지는 자석을 고정할 부분을 구체적으로 나타내요."
  }
};
const bankReview={
  "s41-u01-b08": {
    "prompt": "집게의 손잡이와 끝부분이 자석에 붙는지 각각 알아보려고 해요. 두 부분에 가까이할 자석은 어떻게 준비하면 좋을까요?",
    "answer": "같은 자석을 써요.",
    "required": [
      "같은 자석으로 두 부분을 비교한다는 답"
    ],
    "explanation": "같은 자석을 같은 방법으로 가까이해 보아요. 손잡이와 끝부분은 따로 살피고, 안쪽 재료는 겉모습만으로 정하지 않아요.",
    "before": [
      "d37d4b6ffe22d07d"
    ]
  },
  "s41-u01-b16": {
    "prompt": "표에서 종이 한 장을 사이에 두어도 클립이 움직였어요. 자석이 클립에 닿지 않아도 어떤 힘이 작용한 걸까요?",
    "answer": "자석이 클립을 끌어당기는 힘이에요.",
    "required": [
      "떨어져 있어도 자석이 클립을 끌어당겼다는 답"
    ],
    "explanation": "표에서는 같은 자석과 클립을 가까운 거리에 두었어요. 이 조건에서는 사이에 얇은 종이가 있어도 클립이 움직였어요.",
    "before": [
      "31e9a52b99bb47ad"
    ]
  },
  "s41-u01-b24": {
    "prompt": "고리 하나를 뒤집기 전과 후에 서로 마주 보는 극을 비교하려고 해요. 각 고리의 윗면만 보아도 될까요? 어느 면을 살펴야 할지 짧게 쓰세요.",
    "answer": "두 고리가 서로 마주 보는 면을 살펴요.",
    "required": [
      "서로 마주 보는 두 면을 살핀다는 답"
    ],
    "explanation": "한 고리의 윗면과 아랫면은 서로 다른 극이에요. 아래 고리의 윗면과 위 고리의 아랫면이 마주 봐요.",
    "before": [
      "7d2fc5b65d3ded18"
    ]
  },
  "s41-u01-b40": {
    "prompt": "교실에서 자석으로 줄이고 싶은 불편을 한 가지만 써 보세요.",
    "answer": "철 클립이 바닥에 흩어져 주워 담기 어려워요.",
    "required": [
      "자석을 이용해 줄일 수 있는 생활 속 불편 한 가지"
    ],
    "explanation": "흩어진 철 클립을 모으거나 종이가 흩어지지 않게 잡는 일처럼 자석이 도움을 줄 상황을 찾아요. 장치의 모습은 뒤의 그림 문제에서 생각해 보아요.",
    "before": [
      "0ba8d05966cfc907"
    ]
  },
  "s41-u01-b56": {
    "prompt": "상자로 철 클립을 모으는 장치를 생각하고 있어요. 자석을 어디에 놓을지 한 곳을 정해 짧게 써 보세요.",
    "answer": "상자 입구 가까이에 놓아요.",
    "required": [
      "철 클립을 모을 수 있는 타당한 자석 위치"
    ],
    "explanation": "자석이 철 클립을 끌어당길 수 있는 자리를 골라요. 실제로 만들 때에는 자석이 빠지지 않게 단단히 고정하고 클립을 꺼낼 수 있게 해요.",
    "before": [
      "395763bc03cc8f32"
    ]
  },
  "s41-u01-b64": {
    "prompt": "기록에서 설계 그림은 완성했어요. 아직 만들거나 시험하지 않았는데, “실제로 잘 작동했다.”고 써도 될까요? 까닭을 짧게 쓰세요.",
    "answer": "아직 만들거나 시험하지 않았기 때문에 쓸 수 없어요.",
    "required": [
      "실제로 만들거나 시험하지 않았다는 까닭"
    ],
    "explanation": "그림을 완성한 일과 실제로 만들어 시험한 일은 달라요. 아직 하지 않은 일을 한 것처럼 적지 않아요.",
    "before": [
      "016b349605996e74",
      "3759a36e7fb83f8c"
    ]
  },
  "s41-u01-b32": {
    "prompt": "친구가 바늘의 방향을 설명 그림과 같게 고쳐 적자고 해요. 실제 관찰 기록은 어떻게 해야 할지 짧게 써 보세요.",
    "answer": "실제로 본 방향을 그대로 적어요.",
    "required": [
      "실제로 관찰한 방향을 그대로 적는 답"
    ],
    "explanation": "그림과 다르다는 까닭으로 실제 기록을 바꾸지 않아요. 조건을 살핀 뒤 다시 본 결과는 새로 기록해요.",
    "before": [
      "9da6532e8878642c"
    ]
  },
  "s41-u01-b48": {
    "prompt": "두 장치 중 하나를 고르세요. 그 장치에서 서로 끌어당기는 두 부품의 이름을 쓰세요.",
    "answer": "가: 자석과 철판 / 나: 서로 다른 극을 마주 둔 두 자석",
    "required": [
      "고른 장치에 맞는 두 부품"
    ],
    "explanation": "자석이 철을 끌어당기거나 두 자석의 서로 다른 극끼리 끌어당기는 성질로 종이를 잡는 구조예요.",
    "before": [
      "aa1e98fe8c5237fc"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const bankCache=new WeakMap(),bookCache=new WeakMap();
const contract=(old,e)=>({...old,sample:e.answer,reviewRequired:true,rubric:{...old.rubric,required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 다른 예도 교사가 확인해요.'}});
export function magnetGuidedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type==='original'||!e.before.includes(fingerprint(q)))return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
  const result={...q,prompt:[e.prompt,...(e.parts||[])].join('\n'),answerContract:contract(q.answerContract,e),explanation:e.explanation,magnetGuidedResponse:MAGNET_GUIDED_VERSION,contentVersion:MAGNET_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,result);return result;
 });return changed?next:rows;
}
export function withMagnetGuidedClassroom(u,mod){const items=magnetGuidedItems(mod?.classroomItems,u);return items===mod?.classroomItems?mod:{...mod,classroomItems:items};}
const fields={
  "워밍업": [
    "워밍업",
    "자석을 써 본 물건을 하나 말해 보세요. 사진에서 자석에 가까이해 보고 싶은 물체를 짚어도 좋아요."
  ],
  "바꾼 조건과 같게 한 조건": [
    "알맞은 말에 동그라미 해요",
    "거리의 영향을 알아보려면 자석과 철 물체는 ( 같게 / 다르게 ), 두 물체 사이의 거리는 ( 같게 / 다르게 ) 해요."
  ],
  "더 확인할 것": [
    "짝과 말해요",
    "철 물체가 움직이지 않았다면 자석과의 거리를 어떻게 바꾸어 살펴볼지 말해 보세요."
  ],
  "내 비교 계획": [
    "알맞은 말에 동그라미 해요",
    "종이의 영향을 비교할 때 자석에서 철 물체까지의 전체 거리는 ( 같게 / 다르게 ) 해요."
  ],
  "위치를 비교하는 방법": [
    "알맞은 말에 동그라미 해요",
    "자석의 끝과 가운데에 가까이할 철 물체는 ( 같은 것 / 서로 다른 것 )을 써요."
  ],
  "처음 예상과 비교": [
    "표에서 찾아보아요",
    "서로 마주 보는 극이 같은 곳을 표에서 찾아 동그라미 하세요. 고리 사이에 틈이 생긴 곳과 짝지어 보세요."
  ],
  "내 그림으로 설명": [
    "알맞은 말에 동그라미 해요",
    "고리 사이에서 마주 보는 면은 ( 두 고리의 윗면 / 아래 고리의 윗면과 위 고리의 아랫면 )이에요."
  ],
  "공통점과 차이": [
    "표에서 짚어 보아요",
    "다른 자석을 멀리한 행에서 바늘의 N극 쪽이 가리키는 방향을 찾으세요. 가까이한 자석의 극이 달라진 두 행도 짚어 보세요."
  ],
  "나의 다른 아이디어": [
    "짝과 말해요",
    "자석으로 해결하고 싶은 불편을 하나 말하고, 짝의 생각도 들어 보세요."
  ],
  "고칠 부분을 찾아요": [
    "표에서 찾아 동그라미 해요",
    "작은 자석이 빠진 장치의 기호에 동그라미 하세요. 다시 쓰기 전에 고쳐야 할 부분을 짝과 말해 보세요."
  ],
  "친구와 의견 나누기": [
    "짝에게 물어보아요",
    "내 장치 그림을 보여 주고 “어디에 쓰는 장치일까?”라고 물어보세요. 알아보기 어려운 곳은 손으로 짚어 함께 고쳐 보세요."
  ]
};
const cues=[
  "자석에 가까이해 보고 싶은 물체를 사진에서 짚어 보세요.",
  "한 물체에서 재료가 다른 두 부분을 찾아보세요.",
  "닿기 전에 움직인 경우를 표에서 찾아보세요.",
  "종이 유무가 다르고 전체 거리는 같은 두 경우를 찾아보세요.",
  "같은 극끼리와 서로 다른 극끼리 가까이할 때를 나누어 보세요.",
  "표에서 두 고리 사이의 틈이 생긴 곳을 짚어 보세요.",
  "아래 고리의 윗면과 위 고리의 아랫면을 마주 짚어 보세요.",
  "나침반 주변의 자석을 멀리한 경우를 표에서 찾아보세요.",
  "자석 장치가 어느 불편을 줄여 주는지 말해 보세요.",
  "고정이 풀린 부분을 찾고 어떻게 고칠지 말해 보세요.",
  "물체의 이름과 그 부분을 만든 재료를 함께 살펴보세요.",
  "철 클립이 많이 붙는 곳을 그림에서 짚어 보세요.",
  "자석의 극과 멈춘 뒤 가리키는 방향을 구별해 보세요.",
  "나침반 바늘의 N극과 가까이한 자석의 극을 짚어 보세요.",
  "보기에서 철로 만든 물체를 찾아보세요.",
  "얇은 판이 있는 경우와 쇠구슬을 모으는 도구를 살펴보세요.",
  "자유롭게 도는 자석과 나침반의 공통점을 말해 보세요.",
  "붙는 물체의 재료와 클립이 많이 붙는 부분을 확인해 보세요.",
  "말굽자석의 극과 방충망을 닫는 부분을 짚어 보세요.",
  "자석이 가까이 있을 때 나침반 바늘이 달라지는지 살펴보세요.",
  "같은 극끼리 밀어 내는 모습과 다른 극끼리 끌어당기는 모습을 구별해 보세요.",
  "고리가 붙은 곳과 뜬 곳에서 마주 보는 극을 찾아보세요.",
  "자유롭게 멈춘 자석이 가리키는 방향을 찾아보세요.",
  "생활 속 장치에서 자석이 쓰일 두 부분을 찾아보세요.",
  "자석에 붙는 재료를 표에서 찾아보세요.",
  "두 자석에서 실제로 마주 보는 극을 하나씩 짚어 보세요.",
  "고리가 뜨는 배치와 나침반 바늘의 표식을 구별해 보세요.",
  "집게의 두 부분에 가까이할 자석을 같게 준비했는지 살펴보세요.",
  "종이가 있어도 클립이 움직인 행을 표에서 찾아보세요.",
  "뒤집은 고리의 윗면과 아랫면을 각각 살펴보세요.",
  "짝이 말한 불편을 줄일 자석의 쓰임을 함께 생각해 보세요.",
  "상자에서 철 클립을 모을 곳과 자석을 놓을 곳을 짚어 보세요.",
  "실제로 한 일과 아직 하지 않은 일을 나누어 말해 보세요.",
  "표에 적힌 재료와 닿기 전에 움직인 기록을 찾아보세요.",
  "전체 거리가 같은 계획과 고리의 마주 보는 두 면을 확인해 보세요.",
  "뒤집은 고리의 위아래 두 이웃을 찾아보세요.",
  "나침반을 수평으로 놓고 주변 쇠붙이를 멀리해야 할 때를 말해 보세요.",
  "종이를 사이에 두고 서로 끌어당길 두 부품을 짚어 보세요.",
  "밀어 내는 두 극과 달리한 거리를 찾아보세요.",
  "설명 그림과 달라도 내가 직접 본 방향을 그대로 말해 보세요.",
  "작은 자석이 빠진 장치에서 먼저 고칠 곳을 짚어 보세요.",
  "금속이어도 자석에 붙는 결과가 다른 경우를 찾아보세요.",
  "N-N, S-S, N-S를 손가락으로 짚고 작용을 말해 보세요.",
  "윗면이 N극인 고리의 아랫면을 말해 보세요.",
  "방위를 찾을 때 주변에서 멀리할 물체를 말해 보세요.",
  "불편 찾기와 실제로 시험하기를 나누어 말해 보세요.",
  "질문에서 알아볼 것과 표에서 읽을 것을 짝지어 보세요.",
  "바꿀 조건 하나와 같게 할 조건을 구별해 보세요.",
  "장치의 목적과 부품 이름을 짝에게 말해 보세요.",
  "처음 준비와 결과를 살피는 일을 차례로 짚어 보세요.",
  "나침반 바늘이 멈춘 뒤에 할 일을 찾아보세요.",
  "그림에서 자석을 가까이할 두 부분을 짚어 보세요.",
  "두 고리에서 N극끼리 마주 보는 곳을 짚어 보세요.",
  "두 그림에서 전체 거리가 같은지 확인해 보세요.",
  "두 준비 그림에서 자석의 유무와 자리를 비교해 보세요.",
  "종이를 잡는 두 부품을 짝에게 소개해 보세요.",
  "그림에서 바꾼 부분을 짚고 자석이 빠지지 않을지 말해 보세요."
];
const core={27:'두 부분을 같은 자석과 같은 방법으로 비교해요.',28:'자석은 떨어져 있는 철 물체도 끌어당길 수 있어요.',29:'두 고리가 실제로 마주 보는 면의 극을 살펴요.',30:'자석으로 줄일 수 있는 생활 속 불편을 찾아요.',31:'철 클립을 모을 자리를 생각하며 자석의 위치를 정해요.',32:'설계 그림과 실제로 만들어 시험한 결과는 달라요.',39:'그림과 달라도 내가 직접 본 바늘 방향을 그대로 적어요.',40:'부품이 빠진 장치는 다시 쓰기 전에 고쳐요.',51:'물체의 부분마다 같은 자석을 가까이해 비교해요.',52:'같은 극끼리 마주 보면 서로 밀어 내요.',53:'종이의 유무만 비교하려면 전체 거리도 같게 해요.',54:'다른 자석이 나침반 바늘에 영향을 줄 수 있어요.',55:'자석과 철, 또는 서로 다른 극의 두 자석으로 종이를 잡을 수 있어요.',56:'작은 자석이 빠지지 않도록 고정하는 방법을 생각해요.'};
export function withMagnetGuidedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(bookCache.has(w))return bookCache.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const changes={prompt:e.prompt,answer:e.answer,criteria:e.required.join(' / '),explanation:e.explanation,misconception:e.misconception,magnetGuidedResponse:MAGNET_GUIDED_VERSION};
 for(const k of ['lines','drawingPanels','drawingExplanationLines'])if(Object.hasOwn(e,k))changes[k]=e[k];
 if(e.bankId){changes.sourceContract=contract(q.sourceContract,e);changes.sourceExplanation=e.explanation;}
 return{...q,...changes};});
 const rewrite=(p,i)=>({...p,blocks:p.blocks.flatMap(b=>b.type==='field'&&fields[b.title]?[{type:'heading',text:fields[b.title][0]},{type:'text',text:fields[b.title][1]}]:[b]),rail:p.rail.map(n=>{if(n.title==='핵심 정리'&&core[i])return{...n,text:core[i]};if(n.title!=='내가 정리할 것')return n;const{write,...note}=n;return{...note,text:cues[i]};})});
 const pages=w.pages.map(rewrite);
 const teacherStudentPages=w.teacherStudentPages.map(p=>{if(p.kind==='duplex-blank')return p;let i=w.pages.findIndex(x=>JSON.stringify(x)===JSON.stringify(p));if(i>=0)return pages[i];const id=p.blocks.find(b=>b.type==='questions')?.ids[0];i=w.pages.findIndex(x=>x.blocks.some(b=>b.ids?.includes(id)));if(i<0)throw Error('자석 교사용 쪽의 학생용 기준이 없어요.');return rewrite(p,i);});
 const teacherPages=Array.from({length:Math.ceil(questions.length/3)},(_,i)=>({...w.teacherPages[0],section:`정답·해설 ${i*3+1}~${Math.min(i*3+3,questions.length)}`,blocks:[{type:'solutions',ids:questions.slice(i*3,i*3+3).map(q=>q.id)}]}));
 const figures=Object.fromEntries(Object.entries(w.figures).map(([key,html])=>[key,magnetGuidedFigure(key,html)]));
 // Short responses belong together; keep the complete question sequence and
 // the teacher's unrelated continued source-question page intact.
 const packs=[
  {nos:[35,36,37],section:'기본·적용 35~37',title:'자석의 성질을 비교해요',core:'같은 자석으로 비교하고, 떨어져 작용하는 힘과 서로 마주 보는 극을 살펴요.',cue:'자석과 클립 사이의 거리, 고리에서 마주 보는 두 면을 각각 짚어 보세요.'},
  {nos:[38,39,40],section:'생활 속 장치 38~40',title:'불편을 줄일 장치를 생각해요',core:'불편한 점과 자석을 놓을 자리를 정해요. 설계 그림과 실제 시험은 구별해요.',cue:'내 아이디어에서 해결할 불편과 자석을 놓을 자리를 짝에게 말해 보세요.'},
  {nos:[53,54],section:'자료로 생각하기 53~54',title:'관찰을 남기고 장치를 고쳐요',core:'직접 본 결과를 그대로 적고, 그 결과에 맞게 고칠 곳을 찾아요.',cue:'바늘이 실제로 가리킨 방향과 자석이 빠진 부분을 살펴보세요.'},
  {nos:[55,56,57,58,59],section:'빈칸 확인 55~59',title:'자석의 성질을 확인해요',core:'자석에 붙는 재료와 마주 보는 극을 살펴요.',cue:'헷갈린 낱말은 앞의 사진과 표에서 다시 찾아보세요.'},
  {nos:[60,61,62,63,64],upperFromNo:61,section:'빈칸 확인 60~64',title:'관찰과 생활 속 이용을 확인해요',core:'모형의 눈금과 실제 길이를 구별해요. 나침반을 바르게 쓰고 장치의 계획과 실제 시험을 나누어 살펴요.',cue:'실제로 관찰할 것과 앞으로 만들어 시험할 것을 각각 말해 보세요.'}
 ].map(p=>({...p,ids:p.nos.map(n=>`s41-u01-w${String(n).padStart(3,'0')}`)}));
 const compact=list=>{const emitted=new Set();const result=list.flatMap(p=>{const ids=p.blocks.flatMap(b=>b.ids||[]),pack=packs.find(x=>ids.some(id=>x.ids.includes(id)));if(!pack)return[p];if(emitted.has(pack))return[];if(!ids.every(id=>pack.ids.includes(id))||p.blocks.some(b=>b.type!=='questions'))throw Error('자석 묶음 쪽의 문항 구성을 확인해요.');emitted.add(pack);return[{...p,section:pack.section,title:pack.title,blocks:[{type:'questions',ids:pack.ids}],rail:p.rail.map(n=>n.title==='더 알아보기'&&pack.upperFromNo?{...n,text:list.find(p=>p.blocks.some(b=>b.ids?.includes(`s41-u01-w${String(pack.upperFromNo).padStart(3,'0')}`))).rail.find(n=>n.title==='더 알아보기').text}:n.title==='핵심 정리'?{...n,text:pack.core}:n.title==='내가 정리할 것'?{...n,text:pack.cue}:n)}];});const ids=pages=>pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));if(JSON.stringify(ids(list))!==JSON.stringify(ids(result)))throw Error('자석 교재의 문항 순서가 달라졌어요.');return result;};
 const result={...w,questions,pages:compact(pages),teacherStudentPages:compact(teacherStudentPages),teacherPages,figures};bookCache.set(w,result);return result;
}

const figureInputs={"materialData": ["919864145984c50e"], "distanceData": ["e913cef262dad228"], "plateData": ["41697ed82bd42a62"], "deviceData": ["f492ef005ac25cf2"], "given-s41-u01-b16": ["ca7302cc6b75546a"], "given-s41-u01-b64": ["8100d4f6e0bb4740"]};
const figureWords={'가상 관찰 자료':'관찰 기록의 예','가상 기록':'기록의 예','가상 관찰':'관찰','가상 설계 시험':'장치 시험의 예','다음은 조건을 비교하기 위해 정한 수업용 가상 관찰 자료예요. 실제 학생이 관찰하거나 힘을 측정한 결과가 아니에요.':'자석을 비교하는 예예요. 직접 해 볼 때에는 그때 본 모습을 새로 기록해요.','같은 종이·사용 방법으로 비교했다고 정한 가상 자료예요. 모든 실제 사용에서의 기능/안전 보장이 아니에요.':'같은 종이와 방법으로 두 장치를 비교하는 예예요. 직접 만든 장치는 고정 상태와 작동을 다시 살펴요.'};
export function magnetGuidedFigure(key,html){if(!figureInputs[key]?.includes(fingerprint(html)))return html;let next=html;for(const[a,b]of Object.entries(figureWords).sort((a,b)=>b[0].length-a[0].length))next=next.replaceAll(a,b);return next;}
