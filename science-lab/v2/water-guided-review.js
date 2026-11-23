// Supported observations, brief responses and device making for grade four.
export const WATER_GUIDED_VERSION='20261124-water-guided-tasks';
const unit='s41-u02',prior='0855cddb016903ad';
const review={
  "49": {
    "prompt": "열린 접시에서 줄어든 물은 어디로 갔을까요? 짧게 쓰세요.",
    "answer": "수증기로 변해 공기 중으로 갔어요.",
    "required": [
      "물이 증발하여 수증기로 공기 중에 나갔다는 답"
    ],
    "explanation": "물의 출입이 없는 같은 물과 용기 전체는 얼기 전후 무게가 같아요. 열린 접시에서는 물이 증발해 공기 중으로 나갈 수 있어요.",
    "misconception": "물의 상태가 변한 일과 물이 접시 밖으로 나간 일을 구별해요.",
    "before": "a5c0a43d54434277",
    "lines": 1,
    "given": [
      "같은 물과 용기 전체를 물의 출입 없이 재었더니, 얼기 전과 후의 무게가 같았어요.",
      "열린 접시에서는 접시에 남은 물이 줄었어요."
    ]
  },
  "50": {
    "prompt": "바람의 영향만 비교하려면 두 방의 온도를 어떻게 해야 할까요?",
    "answer": "같게 해야 해요.",
    "required": [
      "두 방의 온도를 같게 한다는 답"
    ],
    "explanation": "온도와 바람이 모두 다르면 어느 것 때문에 마른 정도가 달라졌는지 알기 어려워요. 천의 재질·크기, 처음 물의 양과 관찰 시간도 같게 해요.",
    "misconception": "바람의 영향만 비교할 때 온도까지 다르게 하지 않아요.",
    "before": "2386b7d869b0a9ca",
    "lines": 1,
    "given": [
      "천 가: 따뜻한 방의 선풍기 앞 / 천 나: 서늘한 방의 바람 없는 곳",
      "두 천의 크기와 처음 물의 양은 같았어요."
    ]
  },
  "51": {
    "prompt": "친구는 “금속판 자체가 1.3g 더 무거워졌어.”라고 말했어요. 표를 보면 금속판과 함께 무엇을 재어서 무게가 늘어난 걸까요?",
    "answer": "금속판에 맺힌 물방울이에요.",
    "required": [
      "금속판에 맺힌 물방울을 함께 쟀다는 답"
    ],
    "explanation": "물방울을 닦자 금속판은 다시 50.0g이었어요. 이 기록에서는 금속판 자체보다 금속판에 더해진 물방울을 살펴야 해요.",
    "misconception": "금속판과 물방울을 함께 잰 무게를 금속판만의 무게로 읽지 않아요.",
    "before": "dd15e4b6a3401378",
    "lines": 1,
    "given": [
      "물을 뿌리지 않은 차갑고 마른 금속판을 살펴본 기록이에요."
    ],
    "figure": "water-guided-plate-mass"
  },
  "52": {
    "prompt": "컵의 물 3mL를 모두 응결해서 모은 물이라고 말하기 어려운 까닭은 무엇일까요?",
    "answer": "원래 물이 컵으로 튀어 들어갔기 때문이에요.",
    "required": [
      "원래 물이 컵에 직접 들어갔다는 까닭"
    ],
    "explanation": "컵에 물이 있다고 모두 응결해서 모였다고 할 수는 없어요. 다시 만들 때에는 컵 입구를 원래 물보다 높게 두고, 물이 직접 튀거나 흘러 들어가지 않게 해요.",
    "misconception": "처음 물이 직접 섞인 양까지 응결한 물이라고 하지 않아요.",
    "before": "b37fbf3b7e7b3381",
    "lines": 1,
    "given": [
      "덮개에 물방울이 보였고, 컵에는 물 3mL가 있었어요.",
      "큰 그릇을 옮기다가 원래 물이 컵으로 튀어 들어갔어요."
    ]
  },
  "53": {
    "prompt": "표에서 컵에 물이 모인 장치를 찾아 기호를 쓰세요.",
    "answer": "나",
    "required": [
      "장치 나를 고른 답"
    ],
    "explanation": "같은 조건으로 40분 동안 살핀 예에서 가의 컵에는 0mL, 나의 컵에는 4mL가 모였어요. 두 장치 모두 덮개에 물방울이 보였어요.",
    "misconception": "덮개의 물방울과 컵에 모인 물을 나누어 살펴요.",
    "before": "d3cd0058b46659ae",
    "lines": 1
  },
  "54": {
    "prompt": "지금 “장치가 잘 작동했어요.”라고 말할 수 없는 까닭을 짧게 쓰세요.",
    "answer": "아직 만들거나 시험하지 않았기 때문이에요.",
    "required": [
      "아직 만들거나 시험하지 않았다는 까닭"
    ],
    "explanation": "장치 그림과 고칠 계획은 완성했지만 실제로 만들고 물이 모이는지 시험하는 일은 남았어요.",
    "misconception": "고칠 계획을 세운 일과 실제로 고쳐 시험한 일은 달라요.",
    "before": "853d2ab2f5aac69c",
    "lines": 1,
    "given": [
      "장치 그림을 그리고 컵 위치를 고칠 계획을 세웠어요.",
      "아직 장치를 만들거나 시험하지는 않았어요."
    ]
  },
  "75": {
    "prompt": "접시 위 얼음이 녹고, 그 물이 실온에서 증발했어요. 세 칸에 차례대로 나타내세요. 얼음과 물은 그리고, 보이지 않는 수증기는 이름표로 나타내세요. 화살표 위에는 녹기와 증발을 알맞게 쓰세요.",
    "answer": "얼음(고체) → 녹기 → 물(액체) → 증발 → 수증기(기체·보이지 않음)로 나타낸다.",
    "required": [
      "얼음·물·보이지 않는 수증기의 순서",
      "녹기와 증발을 알맞게 연결한 화살표"
    ],
    "explanation": "수증기는 눈에 보이지 않으므로 흰 구름처럼 그리지 않고 이름표로 나타내요.",
    "misconception": "흰 김인 작은 물방울을 기체인 수증기로 나타내지 않아요.",
    "before": "38ebd6bf6f742211",
    "drawingExplanationLines": 0,
    "drawingPanels": 3
  },
  "76": {
    "prompt": "표에 나온 세 단계의 물기둥 높이를 간단한 막대 세 개나 그림으로 나타내세요. 각 높이에 cm를 붙이세요.",
    "answer": "처음 물 4.0cm, 다 언 얼음 4.4cm, 다 녹은 물 4.0cm로 높이를 나타낸다.",
    "required": [
      "단계 순서와 4.0·4.4·4.0cm 높이"
    ],
    "explanation": "같은 곧은 용기의 모형에서는 얼 때 높이가 늘고, 다 녹으면 처음 높이로 돌아왔어요. 전체 무게는 세 단계 모두 32.5g이에요. 이 높이 비율이 모든 실제 얼음에 같은 것은 아니에요.",
    "misconception": "높이가 늘어난 것을 전체 무게가 늘어난 것으로 읽지 않아요.",
    "before": "10567579e1d1b25b",
    "drawingExplanationLines": 0
  },
  "77": {
    "prompt": "물이 새거나 흐르지 않는 차가운 병 바깥에 물방울이 맺혔어요. 병과 물방울을 그리고, 공기 중 수증기에서 물방울로 가는 화살표에 응결이라고 쓰세요. 보이지 않는 수증기는 이름표로 나타내세요.",
    "answer": "병 바깥의 공기 중 수증기에서 바깥 물방울로 향하는 화살표와 응결 이름을 나타낸다.",
    "required": [
      "병 바깥에 맺힌 물방울",
      "공기 중 수증기에서 물방울로 향하는 화살표와 응결 표시"
    ],
    "explanation": "병이 새지 않는 조건에서 바깥의 공기 중 수증기가 차가운 병 표면에서 물방울로 변한 모습을 나타내요.",
    "misconception": "병 안의 물이 병 벽을 통과한 것처럼 그리지 않아요.",
    "before": "e9441121dc325307",
    "drawingExplanationLines": 0
  },
  "78": {
    "prompt": "큰 그릇·물·빈 컵·투명 덮개로 물을 모을 장치를 그리세요. 컵 입구는 원래 물보다 높게 그리고, 덮개의 물방울이 컵으로 떨어질 길을 화살표로 표시하세요.",
    "answer": "원래 물보다 입구가 높은 빈 컵과, 덮개의 낮은 부분에서 컵으로 떨어지는 물방울의 길을 나타낸다.",
    "required": [
      "컵 입구가 원래 물보다 높은 배치",
      "덮개에서 컵으로 이어지는 물방울의 길"
    ],
    "explanation": "큰 그릇의 물이 증발하고 덮개에서 응결한 뒤 컵에 모이게 해요. 실제로 만들 때에는 덮개를 고정하고 원래 물이 컵에 직접 들어가지 않는지 확인해요.",
    "misconception": "물방울이 생기는 곳과 컵에 모이는 길을 함께 생각해요.",
    "before": "7d5b6d4e9e1bd878",
    "drawingExplanationLines": 0
  },
  "79": {
    "prompt": "표의 장치 가에서는 물방울이 컵 옆으로 떨어졌어요. 왼쪽에는 지금 모습, 오른쪽에는 컵 위치를 고칠 계획을 그리세요. 오른쪽 위에 계획이라고 쓰고, 바꿀 부분에 동그라미 하세요.",
    "answer": "현재는 컵 옆으로 떨어지는 길을, 계획에는 덮개의 낮은 부분 아래로 옮길 컵을 나타내고 바꿀 곳에 동그라미 한다.",
    "required": [
      "현재와 고칠 계획을 나눈 두 그림",
      "덮개의 낮은 부분과 컵의 위치를 맞출 계획"
    ],
    "explanation": "아직 고치거나 다시 시험하지 않았어요. 고친 다음에는 다른 조건을 같게 하여 컵에 물이 모이는지 다시 살펴요.",
    "misconception": "고칠 계획을 실제로 고친 뒤의 결과처럼 나타내지 않아요.",
    "before": "b1a2454f0fc90421",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "80": {
    "prompt": "두 칸에 젖은 천을 말릴 준비 모습을 그리세요. 왼쪽에만 선풍기 바람이 닿게 하고, 두 칸에 바람 있음과 바람 없음 이름표를 붙이세요.",
    "answer": "같은 조건의 두 천을 두고 왼쪽에만 선풍기 바람이 닿는 준비와 두 이름표를 나타낸다.",
    "required": [
      "같은 조건의 천 두 장",
      "바람의 유무만 다른 준비와 이름표"
    ],
    "explanation": "천의 재질·크기, 처음 물의 양, 온도와 관찰 시간을 같게 하고 바람의 유무만 다르게 해요. 실제로 마른 정도는 관찰한 뒤 비교해요.",
    "misconception": "아직 관찰하지 않은 마른 정도를 결과처럼 그리지 않아요.",
    "before": "9d819bc99cef8f43",
    "drawingExplanationLines": 0,
    "drawingPanels": 2,
    "given": [
      "천의 재질과 크기, 처음 물의 양, 주변 온도와 관찰 시간은 같게 해요."
    ]
  }
};
const bankReview={
  "s41-u02-b08": {
    "prompt": "밤에 차가워진 판에 수증기가 응결해 물방울이 맺혔어요. 흐르는 물방울을 받으려면 통을 판의 어느 쪽에 놓으면 좋을까요?",
    "answer": "물방울이 흘러내리는 판의 아래쪽에 놓아요.",
    "required": [
      "판에서 흘러내리는 물방울을 받을 아래쪽 위치"
    ],
    "explanation": "판에 물방울이 생기는 응결과 그 물방울을 통에 모으는 길을 함께 생각해요. 실제로 물방울이 생기는지는 날씨와 판의 온도에 따라 달라요.",
    "before": [
      "b38d47b80970e9da"
    ]
  },
  "s41-u02-b09": {
    "prompt": "젖은 수건이 마르는 데 바람이 어떤 영향을 주는지 비교하려고 해요. 같은 재질과 크기의 수건 두 장에서 처음 물의 양은 어떻게 해야 할까요?",
    "answer": "같게 해야 해요.",
    "required": [
      "처음 물의 양을 같게 한다는 답"
    ],
    "explanation": "바람의 유무만 다르게 해요. 수건의 재질·크기, 처음 물의 양, 온도와 관찰 시간은 같게 해요.",
    "before": [
      "aed535e2b606faec"
    ]
  },
  "s41-u02-b22": {
    "prompt": "얼음이 녹아 물이 되었고, 그 물이 마르며 공기 중으로 나갔어요. 이때 공기 중으로 나간 기체 상태의 물을 무엇이라고 하나요?",
    "answer": "수증기",
    "required": [
      "수증기라는 답"
    ],
    "explanation": "얼음은 녹아 액체인 물이 되고, 물은 증발하여 기체인 수증기가 될 수 있어요. 수증기는 눈에 보이지 않아요.",
    "before": [
      "27cb2ece930665a4"
    ]
  },
  "s41-u02-b30": {
    "prompt": "같은 병과 물을 함께 재었더니 얼기 전에는 162g, 언 뒤에는 168g이었어요. 언 병 바깥에는 물방울이 묻어 있었어요. 다시 비교하기 전에 병 바깥을 어떻게 해야 할까요?",
    "answer": "병 바깥의 물방울을 닦아요.",
    "required": [
      "겉 물방울을 닦고 다시 잰다는 답"
    ],
    "explanation": "병 바깥 물방울이 함께 저울에 올라갔을 수 있어요. 겉을 닦고 같은 병과 물 전체를 다시 재요. 흘림이나 물의 출입도 살펴요.",
    "before": [
      "dfd58bf841ffe322"
    ]
  },
  "s41-u02-b38": {
    "prompt": "젖은 천이 마를 때와 선생님이 물을 끓일 때에는 모두 액체인 물이 어떤 상태로 변하나요?",
    "answer": "기체 상태의 수증기로 변해요.",
    "required": [
      "기체 또는 수증기로 변한다는 답"
    ],
    "explanation": "증발과 끓음은 모두 액체인 물이 기체로 변하는 변화예요. 물속에서 큰 기포가 생겨 올라오는 끓음의 모습은 증발과 달라요.",
    "before": [
      "1fa3a56b3735c995"
    ]
  },
  "s41-u02-b46": {
    "prompt": "차가운 컵 바깥에 물방울이 맺혔어요. 컵 안의 물이 새어 나온 것인지 먼저 살피려면 컵에서 무엇을 확인하면 좋을까요?",
    "answer": "컵이 깨지거나 물이 새는 곳이 있는지 확인해요.",
    "required": [
      "컵의 깨짐이나 물이 새는 곳을 확인한다는 답"
    ],
    "explanation": "물방울 사진만으로 물이 어디서 왔는지 정하지 않아요. 컵에서 물이 새지 않는지, 물을 흘리지 않았는지 먼저 살펴요.",
    "before": [
      "811f3dc48f8d6182"
    ]
  },
  "s41-u02-b54": {
    "prompt": "큰 그릇의 물 위에 빈 컵을 놓고 투명 덮개로 덮어 물을 모으려 해요. 수증기가 물방울로 변하는 곳은 덮개의 안쪽과 바깥쪽 중 어디인가요?",
    "answer": "덮개의 안쪽이에요.",
    "required": [
      "덮개 안쪽이라는 답"
    ],
    "explanation": "큰 그릇의 물이 증발해 생긴 수증기가 덮개 안쪽에서 응결하고 물방울이 컵으로 떨어지게 해요. 컵에 원래 물이 직접 들어가면 안 돼요.",
    "before": [
      "7a871c98209b654e"
    ]
  },
  "s41-u02-b62": {
    "prompt": "물의 상태 변화를 이용해 물을 모으는 장치를 직접 만들려고 해요. 큰 그릇의 원래 물이 빈 컵에 바로 들어가지 않으려면, 원래 물의 높이는 컵 입구보다 높아야 할까요, 낮아야 할까요?",
    "answer": "컵 입구보다 낮아야 해요.",
    "required": [
      "원래 물 높이가 컵 입구보다 낮다는 답"
    ],
    "explanation": "안정된 그릇에 컵을 놓고, 컵 입구보다 낮게 물을 넣어요. 덮개를 고정한 뒤 물이 직접 튀거나 흐르지 않는지도 확인해요. 도구 사용은 선생님과 안전을 확인하고 진행해요.",
    "before": [
      "070053ee80e45aa8"
    ]
  },
  "s41-u02-b70": {
    "prompt": "같은 곳에 30분 동안 둔 장치의 덮개에는 물방울이 보였지만 컵은 비어 있었어요. 컵이 비어 있어도 물방울이 생겼다는 것을 알 수 있는 곳은 어디인가요?",
    "answer": "덮개예요.",
    "required": [
      "덮개에 물방울이 보였다는 답"
    ],
    "explanation": "덮개에 물방울이 생긴 일과 컵에 물이 모인 일은 달라요. 물방울이 어느 쪽으로 흐르는지 다음에 살펴볼 수 있어요.",
    "before": [
      "12cd69cdddc7151b"
    ]
  },
  "s41-u02-b78": {
    "prompt": "친구가 “덮개의 물방울이 컵 옆으로 떨어져.”라고 말했어요. 아직 고치지는 않았어요. 물방울이 컵에 떨어지게 하려면 덮개의 낮은 부분과 무엇의 위치를 맞추면 좋을까요?",
    "answer": "컵의 위치를 맞추면 좋아요.",
    "required": [
      "덮개의 낮은 부분과 컵의 위치를 맞춘다는 답"
    ],
    "explanation": "물방울이 떨어지는 곳 아래로 컵을 옮길 계획을 세워요. 실제로 고친 뒤에는 다른 조건을 같게 하여 다시 시험해요.",
    "before": [
      "0500bc5fc77b2679"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const bankCache=new WeakMap(),bookCache=new WeakMap();
const contract=(old,e)=>({...old,sample:e.answer,reviewRequired:true,rubric:{...old.rubric,required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 다른 예도 교사가 확인해요.'}});
export function waterGuidedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type==='original'||!e.before.includes(fingerprint(q)))return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
  const result={...q,prompt:[e.prompt,...(e.parts||[])].join('\n'),answerContract:contract(q.answerContract,e),explanation:e.explanation,waterGuidedResponse:WATER_GUIDED_VERSION,contentVersion:WATER_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,result);return result;
 });return changed?next:rows;
}
export function withWaterGuidedClassroom(u,mod){const items=waterGuidedItems(mod?.classroomItems,u);return items===mod?.classroomItems?mod:{...mod,classroomItems:items};}
const fields={
  "워밍업": [
    "워밍업",
    "얼음이 녹거나 젖은 빨래가 마르는 모습을 본 적이 있나요? 기억나는 모습을 말해 보세요."
  ],
  "주변에서 찾기": [
    "그림에서 찾아보아요",
    "얼음과 액체인 물을 짚어 보세요. 눈에 보이지 않는 것은 ( 얼음 / 수증기 )예요. 알맞은 말에 동그라미 하세요."
  ],
  "나의 비교 계획": [
    "알맞은 말에 동그라미 해요",
    "얼기 전후를 비교할 때 물과 용기는 ( 같게 / 다르게 ) 준비해요. 무게를 재기 전에는 용기 바깥의 물기를 닦아요."
  ],
  "예상과 결과": [
    "표에서 찾아보아요",
    "다 언 얼음의 높이는 처음 물보다 ( 높아졌고 / 낮아졌고 ), 같은 전체 무게는 ( 같아요 / 달라요 )."
  ],
  "확인할 순서": [
    "표에서 짚어 보아요",
    "바깥이 마른 두 기록의 무게를 찾아보세요. 물방울이 묻은 병은 겉을 닦기 전과 후 중 언제 다시 재면 좋을지 말해 보세요."
  ],
  "관찰과 설명": [
    "알맞은 말에 동그라미 해요",
    "열린 접시에 남은 물의 양은 ( 늘었어요 / 줄었어요 ). 물이 흘러 나가지 않았다면 어디로 갔을지 말해 보세요."
  ],
  "더 공정한 비교": [
    "같게 할 것을 짚어 보아요",
    "바람의 영향만 알아보려 해요. 같은 천과 처음 물의 양, 같은 온도와 관찰 시간을 준비하고, 바람의 유무만 다르게 해요."
  ],
  "같음과 다름": [
    "알맞은 말에 동그라미 해요",
    "증발과 끓음은 모두 ( 고체 / 액체 )가 ( 액체 / 기체 )로 변하는 변화예요. 두 모습에서 큰 기포가 보이는 쪽을 짚어 보세요."
  ],
  "사진에서 알 수 없는 것": [
    "짝과 말해요",
    "사진만 보고 병이 새지 않았다고 알 수 있을까요? 물방울이 어디서 왔는지 알아보려면 병의 어느 곳을 살필지 말해 보세요."
  ],
  "자료로 설명하기": [
    "표에서 찾아보아요",
    "안의 물 온도만 다른 두 병을 비교해요. 바깥에 물방울이 보인 병을 표에서 찾아 동그라미 하세요."
  ],
  "아직 모르는 것": [
    "짝과 말해요",
    "이 표만 보고 날마다 같은 양의 물방울이 생긴다고 말할 수 있을까요? 날씨가 달라지는 날도 떠올려 보세요."
  ],
  "나의 장치 그림": [
    "표에서 짚어 보아요",
    "물방울이 생기는 곳과 모이는 곳을 표에서 차례로 짚어 보세요. 컵 입구를 원래 물보다 높게 둘지 낮게 둘지 짝과 말해 보세요. 내 장치는 뒤의 그림 문제에서 그려요."
  ],
  "근거로 고치기": [
    "표에서 찾아보아요",
    "덮개에는 물방울이 있지만 컵에 모이지 않은 장치를 찾으세요. 물방울이 떨어질 곳과 컵의 자리를 짚어 보세요."
  ],
  "친구에게 설명하기": [
    "짝에게 물어보아요",
    "표의 장치 가를 보며 “컵에 물이 모이려면 어디를 바꿀까?”라고 물어보세요. 덮개의 낮은 부분과 컵의 자리를 함께 생각해 보세요."
  ]
};
const cues=[
  "물의 모습이 달라진 경험을 하나 말해 보세요.",
  "얼음·물과 보이지 않는 수증기를 구별해 보세요.",
  "같은 물과 용기를 준비할 조건을 표에서 찾아보세요.",
  "높이가 달라진 줄과 무게가 같은 줄을 각각 찾아보세요.",
  "바깥 물방울을 닦기 전후의 무게를 비교해 보세요.",
  "접시에 남은 물이 줄어든 줄을 찾아보세요.",
  "증발과 끓음에서 공통으로 변한 상태를 말해 보세요.",
  "물방울 사진 외에 더 살필 병의 부분을 짚어 보세요.",
  "차가운 물이 든 병의 관찰을 찾아보세요.",
  "덮개와 컵의 역할을 표에서 찾아 차례대로 짚어 보세요.",
  "컵 옆으로 떨어지는 물방울과 컵의 자리를 짚어 보세요.",
  "액체인 물의 성질을 보기에서 찾아보세요.",
  "마르는 물이 어떤 상태로 변하는지 말해 보세요.",
  "얼기와 녹기를 처음과 나중 상태로 나누어 보세요.",
  "물 자체의 부피와 용기를 포함한 전체 무게를 구별해 보세요.",
  "작은 물방울을 오래 두면 어떻게 달라질지 생각해 보세요.",
  "물기가 마르는 두 상황을 찾아보세요.",
  "세 장면에서 물의 상태를 하나씩 짚어 보세요.",
  "그릇을 옮긴 물과 고드름의 변화를 나누어 보세요.",
  "처음과 나중의 상태를 짚어 보세요.",
  "같은 전체를 잰 기록인지 확인해 보세요.",
  "기포가 보이는 관찰과 흰 김을 구별해 보세요.",
  "물에서 수증기로 변한 장면을 찾아보세요.",
  "두 실험에서 물속의 기포를 살펴보세요.",
  "공기 중 수증기가 닿는 차가운 곳을 찾아보세요.",
  "물방울까지 함께 잰 때와 얼음의 모양을 각각 살펴보세요.",
  "얼음이 녹은 기록과 물이 언 기록을 나누어 보세요.",
  "열린 통에서 물이 나갈 길을 생각해 보세요.",
  "물속에서 큰 기포가 올라오는 영상을 찾아보세요.",
  "물방울을 닦은 뒤 금속판만의 무게를 찾아보세요.",
  "수증기가 물방울이 되는 변화와 물을 모으는 순서를 짚어 보세요.",
  "표에서 처음과 나중의 상태를 찾아보세요.",
  "물 표면에서 일어난 변화와 함께 잰 물방울을 살펴보세요.",
  "장치 덮개의 변화와 수증기의 이름을 확인해 보세요.",
  "끓는 물의 모습과 보이지 않는 수증기를 구별해 보세요.",
  "차가운 유리창에 닿기 전후 물의 상태를 말해 보세요.",
  "같은 시간 동안 줄어든 물의 양을 비교해 보세요.",
  "물의 모습과 같은 전체를 비교하는 계획을 찾아보세요.",
  "접시에 남은 물과 증발·끓음의 공통점을 살펴보세요.",
  "병에서 물이 새는지와 장치의 물방울 길을 확인해 보세요.",
  "자료에 있는 사실과 아직 하지 않은 일을 나누어 보세요.",
  "열린 접시에서 물이 나갈 수 있는 곳을 말해 보세요.",
  "두 방에서 바람 외에 달랐던 것을 찾아보세요.",
  "물방울을 닦기 전과 후의 무게를 짚어 보세요.",
  "원래 물이 컵에 튄 장면을 찾아보세요.",
  "컵에 물이 모인 행을 표에서 짚어 보세요.",
  "완성한 계획과 남은 제작·시험을 나누어 말해 보세요.",
  "세 상태와 눈에 보이는 작은 물방울을 구별해 보세요.",
  "물기둥의 높이와 전체 무게를 나누어 확인해 보세요.",
  "실온에서도 물 표면에서 일어나는 변화를 찾아보세요.",
  "공기 중 수증기에서 물방울로 가는 변화를 말해 보세요.",
  "처음 빈 컵인지와 원래 물이 직접 들어가는지를 살펴보세요.",
  "생활 속 장면과 변화 이름을 짝지어 보세요.",
  "장치 각 부분이 하는 일을 짚어 보세요.",
  "물의 상태와 다음에 확인할 일을 나누어 보세요.",
  "같은 물을 살피는 순서와 컵에 물이 모이는 순서를 따라가 보세요.",
  "처음 만들기와 만든 뒤 고치기의 차례를 짚어 보세요.",
  "수증기는 그림 대신 보이지 않음 이름표로 나타내 보세요.",
  "세 단계 중 물기둥 높이가 가장 높은 곳을 짚어 보세요.",
  "병 바깥 공기에서 물방울로 이어지는 화살표를 짚어 보세요.",
  "컵 입구와 원래 물 높이, 물방울의 길을 살펴보세요.",
  "현재 모습과 앞으로 고칠 계획을 나누어 보세요.",
  "두 준비 그림에서 바람의 유무만 다른지 확인해 보세요."
];
const core={
  "41": "열린 접시에서는 물이 증발해 공기 중으로 나갈 수 있어요.",
  "42": "바람의 영향만 비교하려면 온도를 같게 해요.",
  "43": "금속판과 물방울을 함께 잰 무게를 구별해요.",
  "44": "원래 물이 컵에 직접 들어갔는지 확인해요.",
  "45": "덮개의 물방울과 컵에 모인 물을 나누어 살펴요.",
  "46": "그림과 계획을 완성해도 실제 제작과 시험은 남아 있어요.",
  "57": "얼음은 녹아 물이 되고 물은 증발해 보이지 않는 수증기가 돼요.",
  "58": "같은 곧은 용기에서 물기둥의 높이를 비교해요.",
  "59": "공기 중 수증기가 차가운 병 바깥에서 물방울로 변할 수 있어요.",
  "60": "원래 물은 컵에 직접 들어가지 않고 덮개의 물방울이 컵으로 떨어지게 해요.",
  "61": "아직 고치지 않은 그림에는 계획이라고 표시해요.",
  "62": "바람의 영향만 비교할 때에는 다른 조건을 같게 해요."
};
const plateMass="<div class=\"book-card\"><p>금속판과 물방울을 잰 기록의 예</p><table class=\"dk-tbl\"><thead><tr><th>잰 것</th><th>무게</th></tr></thead><tbody><tr><td>처음 마른 금속판만</td><td>50.0g</td></tr><tr><td>금속판과 맺힌 물방울</td><td>51.3g</td></tr><tr><td>물방울을 닦은 뒤 금속판만</td><td>50.0g</td></tr></tbody></table></div>";
export function withWaterGuidedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(bookCache.has(w))return bookCache.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if([39,40].includes(q.no))return{...q,lines:2,waterGuidedLayout:WATER_GUIDED_VERSION};if(!e||fingerprint(q)!==e.before)return q;
 const changes={prompt:e.prompt,answer:e.answer,criteria:e.required.join(' / '),explanation:e.explanation,misconception:e.misconception,waterGuidedResponse:WATER_GUIDED_VERSION};
 for(const k of ['lines','drawingPanels','drawingExplanationLines','given','figure'])if(Object.hasOwn(e,k))changes[k]=e[k];
 if(e.bankId){changes.sourceContract=contract(q.sourceContract,e);changes.sourceExplanation=e.explanation;}
 return{...q,...changes};});
 const rewrite=(p,i)=>({...p,blocks:p.blocks.flatMap(b=>b.type==='field'&&fields[b.title]?[{type:'heading',text:fields[b.title][0]},{type:'text',text:fields[b.title][1]}]:[b]),rail:p.rail.map(n=>{if(n.title==='핵심 정리'&&core[i])return{...n,text:core[i]};if(n.title!=='내가 정리할 것')return n;const{write,...note}=n;return{...note,text:cues[i]};})});
 const pages=w.pages.map(rewrite);
 const teacherStudentPages=w.teacherStudentPages.map(p=>{if(p.kind==='duplex-blank')return p;let i=w.pages.findIndex(x=>JSON.stringify(x)===JSON.stringify(p));if(i>=0)return pages[i];const id=p.blocks.find(b=>b.type==='questions')?.ids[0];i=w.pages.findIndex(x=>x.blocks.some(b=>b.ids?.includes(id)));if(i<0)throw Error('물 교사용 쪽의 학생용 기준이 없어요.');return rewrite(p,i);});
 const teacherPages=Array.from({length:Math.ceil(questions.length/3)},(_,i)=>({...w.teacherPages[0],section:`정답·해설 ${i*3+1}~${Math.min(i*3+3,questions.length)}`,blocks:[{type:'solutions',ids:questions.slice(i*3,i*3+3).map(q=>q.id)}]}));
 const figures={...Object.fromEntries(Object.entries(w.figures).map(([key,html])=>[key,waterGuidedFigure(key,html)])), 'water-guided-plate-mass':plateMass};
 // Short responses belong together; keep the complete question sequence and
 // the teacher's unrelated continued source-question page intact.
 const packs=[
  {
    "nos": [
      39,
      40
    ],
    "section": "원문 연결 39~40",
    "title": "물방울과 줄어든 물을 설명해요",
    "core": "차가운 유리창에서는 응결을, 두 기록에서는 같은 시간 동안 줄어든 물의 양을 살펴요.",
    "cue": "물방울이 생기기 전후의 상태와 표에 적힌 물의 양을 각각 짚어 보세요."
  },
  {
    "nos": [
      49,
      50
    ],
    "section": "짧게 생각하기 49~50",
    "title": "물이 간 곳과 비교할 조건",
    "core": "열린 접시의 물은 증발해 공기 중으로 나갈 수 있어요. 바람만 비교할 때에는 온도도 같게 해요.",
    "cue": "열린 접시에서 물이 나간 길과 두 방에서 달랐던 조건을 말해 보세요."
  },
  {
    "nos": [
      51,
      52
    ],
    "section": "짧게 생각하기 51~52",
    "title": "어떤 물을 함께 쟀을까요?",
    "core": "물방울까지 함께 잰 무게와 금속판만의 무게를 구별해요. 원래 물이 컵에 튀어 들어갔는지도 확인해요.",
    "cue": "금속판에 더해진 물방울과 컵에 직접 들어간 물을 각각 짚어 보세요."
  },
  {
    "nos": [
      53,
      54
    ],
    "section": "짧게 생각하기 53~54",
    "title": "자료와 아직 남은 일",
    "core": "컵에 모인 물은 표에서 찾아요. 계획한 일과 실제로 만들고 시험한 일은 구별해요.",
    "cue": "표에서 컵에 물이 모인 행을 찾고 앞으로 실제로 할 일을 말해 보세요."
  },
  {
    "nos": [
      55,
      56,
      57,
      58,
      59
    ],
    "section": "빈칸 확인 55~59",
    "title": "물의 상태와 변화를 확인해요",
    "core": "보이지 않는 수증기와 작은 물방울을 구별해요. 물기둥 높이와 전체 무게는 따로 살펴요.",
    "cue": "헷갈린 낱말은 앞의 그림과 표에서 다시 찾아보세요."
  },
  {
    "nos": [
      60,
      61,
      62,
      63,
      64
    ],
    "section": "빈칸 확인 60~64",
    "title": "물 모으는 과정을 확인해요",
    "core": "증발한 수증기가 응결한 뒤 컵에 모여요. 직접 물이 섞이지 않았는지 살피고, 고친 장치는 다시 시험해요.",
    "cue": "덮개에서 컵까지 물방울이 가는 길과 실제로 확인할 일을 짚어 보세요.",
    "upperFromNo": 61
  }
].map(p=>({...p,ids:p.nos.map(n=>`s41-u02-w${String(n).padStart(3,'0')}`)}));
 const compact=list=>{const emitted=new Set();const result=list.flatMap(p=>{const ids=p.blocks.flatMap(b=>b.ids||[]),pack=packs.find(x=>ids.some(id=>x.ids.includes(id)));if(!pack)return[p];if(emitted.has(pack))return[];if(!ids.every(id=>pack.ids.includes(id))||p.blocks.some(b=>b.type!=='questions'))throw Error('물 묶음 쪽의 문항 구성을 확인해요.');emitted.add(pack);return[{...p,section:pack.section,title:pack.title,blocks:[{type:'questions',ids:pack.ids}],rail:p.rail.map(n=>n.title==='더 알아보기'&&pack.upperFromNo?{...n,text:list.find(p=>p.blocks.some(b=>b.ids?.includes(`s41-u02-w${String(pack.upperFromNo).padStart(3,'0')}`))).rail.find(n=>n.title==='더 알아보기').text}:n.title==='핵심 정리'?{...n,text:pack.core}:n.title==='내가 정리할 것'?{...n,text:pack.cue}:n)}];});const ids=pages=>pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));if(JSON.stringify(ids(list))!==JSON.stringify(ids(result)))throw Error('물 교재의 문항 순서가 달라졌어요.');return result;};
 const result={...w,questions,pages:compact(pages),teacherStudentPages:compact(teacherStudentPages),teacherPages,figures};bookCache.set(w,result);return result;
}

const figureInputs={
  "evaporationData": [
    "864044306b03adba"
  ],
  "condensationData": [
    "1186667c01397fbe"
  ],
  "collectionData": [
    "1ff476aa1b5eaf24"
  ]
};
const figureWords={
  "다음은 비교와 설명을 연습하는 수업용 가상 자료예요. 내 실제 관찰·측정·제작 결과와 구별해요.": "물의 변화를 비교하는 예예요. 직접 해 볼 때에는 그때 본 모습을 새로 기록해요."
};
export function waterGuidedFigure(key,html){if(!figureInputs[key]?.includes(fingerprint(html)))return html;let next=html;for(const[a,b]of Object.entries(figureWords).sort((a,b)=>b[0].length-a[0].length))next=next.replaceAll(a,b);return next;}
