// Short supported tasks for grade-three infection prevention learning.
export const INFECTION_GUIDED_VERSION='20261124-infection-guided-tasks';
const unit='c22-s32-u04',prior='d897a26ce8544556';
const review={
  "7": {
    "prompt": "깨끗해 보이는 손에도 병원체가 있을 수 있어요. 밥 먹기 전에 할 일을 짧게 써 보세요.",
    "answer": "비누와 흐르는 물로 손을 씻어요.",
    "required": [
      "식사 전 손 씻기라는 행동"
    ],
    "explanation": "병원체는 너무 작아 맨눈으로 보기 어려워요. 손이 깨끗해 보여도 식사 전에는 손을 씻어요.",
    "lines": 1,
    "before": "9c9924c70e838d8d"
  },
  "10": {
    "prompt": "병원체가 묻은 음식을 먹어 감염된 이야기예요. 병원체는 무엇을 거쳐 몸에 들어갔나요?",
    "answer": "음식",
    "required": [
      "음식을 통한 감염이라는 답"
    ],
    "explanation": "이 이야기에서는 음식 속 병원체가 음식을 먹을 때 몸에 들어갔어요. 배가 아프다는 모습만으로 원인을 정한 것은 아니에요.",
    "lines": 1,
    "before": "df030a57971b049d"
  },
  "17": {
    "prompt": "처음에는 A에게만 반짝이가 있었어요. 악수할 때 반짝이는 무엇을 통해 다른 친구에게 옮겨 갔나요?",
    "answer": "손",
    "required": [
      "손의 접촉을 통한 이동"
    ],
    "explanation": "반짝이가 묻은 손이 다른 손에 닿으면 옮겨 갈 수 있어요. 옮겨 받은 친구도 다음 차례에 다른 친구에게 옮길 수 있어요.",
    "lines": 1,
    "before": "455280997b09cc47"
  },
  "20": {
    "prompt": "반짝이는 맨눈으로 볼 수 있어요. 세균·바이러스 같은 병원체도 맨눈으로 볼 수 있을까요? 짧게 써 보세요.",
    "answer": "너무 작아서 맨눈으로 보기 어려워요.",
    "required": [
      "맨눈으로 보기 어렵다는 답"
    ],
    "explanation": "모형에서는 눈에 보이는 반짝이로 병원체가 옮겨 가는 길을 나타내요. 반짝이 자체가 병원체는 아니에요.",
    "lines": 1,
    "before": "7257fdce1ccc6f6c"
  },
  "24": {
    "prompt": "손바닥으로 입을 가리고 기침했어요. 침방울이 묻을 수 있는 몸의 부분을 쓰세요.",
    "answer": "손바닥",
    "required": [
      "손 또는 손바닥이라는 답"
    ],
    "explanation": "침방울이 묻은 손으로 다른 손이나 물건을 만지면 옮겨 갈 수 있어요. 기침할 때는 휴지나 옷소매로 입과 코를 가려요.",
    "lines": 1,
    "before": "7b9657f017c97e4e"
  },
  "28": {
    "prompt": "손 씻기 그림에서 빠뜨리기 쉬운 곳을 하나 찾아 이름을 써 보세요.",
    "answer": "손톱 밑",
    "required": [
      "손톱 밑·엄지손가락·손가락 사이 등 알맞은 한 부위"
    ],
    "explanation": "손바닥만 씻지 않고 손등·손가락 사이·엄지손가락·손톱 밑까지 꼼꼼히 씻어요.",
    "lines": 1,
    "before": "941899da4fe2dfa4"
  },
  "30": {
    "prompt": "감기에 걸려 걱정하는 친구에게 해 주고 싶은 말을 한 문장으로 써 보세요.",
    "answer": "푹 쉬고 얼른 나아.",
    "required": [
      "친구를 탓하지 않고 걱정을 덜어 주는 말"
    ],
    "explanation": "친구의 걱정을 듣고 따뜻하게 말해요. 우리도 손 씻기와 기침 예절을 지켜요.",
    "lines": 1,
    "before": "34c6c73dd64ccde3"
  },
  "32": {
    "prompt": "표에는 날씨가 같은지 적혀 있지 않아요. 손 씻기 외에 결석이 줄어든 까닭을 알아보려면 더 살필 것을 한 가지 쓰세요.",
    "answer": "날씨",
    "required": [
      "날씨·감기 유행 정도·다른 예방 행동 등 관련된 조건 한 가지"
    ],
    "explanation": "손 씻기와 함께 다른 조건도 달라졌을 수 있어요. 이 표만으로 결석이 줄어든 까닭을 하나로 정하기는 어려워요.",
    "lines": 1,
    "before": "579e4b57f218d2dd"
  },
  "46": {
    "prompt": "두 규칙의 3차례 뒤 결과를 비교해요. 빈칸을 완성하세요.",
    "answer": "(1) 6 (2) 2",
    "required": [
      "표식이 남은 친구 수 6명과 2명"
    ],
    "explanation": "아무도 씻지 않는 규칙은 6명, B·D·F가 씻는 규칙은 2명이에요. 이 수는 모형의 표식 수이며 실제 감염자 수가 아니에요.",
    "lines": 2,
    "before": "74ab8cc1ac711de7",
    "parts": [
      "(1) 아무도 씻지 않음: __________명",
      "(2) B·D·F가 씻음: __________명"
    ]
  },
  "48": {
    "prompt": "우리 반에서 지킬 예방 약속이에요. 빈칸을 완성하세요.",
    "answer": "(1) 비누 (2) 옷소매 (3) 환기",
    "required": [
      "비누로 손 씻기·옷소매로 가리기·환기"
    ],
    "explanation": "손 씻기, 기침 예절, 환기를 함께 실천해요. 창문을 안전하게 열기 어려우면 어른에게 도움을 요청해요.",
    "lines": 3,
    "before": "115074ae19608c0c",
    "parts": [
      "(1) 손: 물과 __________로 씻어요.",
      "(2) 기침: 휴지나 __________로 입과 코를 가려요.",
      "(3) 공기: 창문을 안전하게 열어 __________해요."
    ]
  },
  "55": {
    "prompt": "둘째 규칙도 처음에는 A에만 표식이 있어야 해요. 첫 규칙을 마친 카드에 표식이 남아 있다면, 둘째 규칙을 시작하기 전에 어떻게 해야 할까요?",
    "answer": "표식을 정리하고 A에만 놓아요.",
    "required": [
      "처음 표식 위치를 A 하나로 되돌리는 답"
    ],
    "explanation": "표식을 빼는 규칙만 비교하려면 처음 위치와 짝·차례를 같게 두어요.",
    "lines": 1,
    "before": "f3cd7a60bcf04c6a"
  },
  "63": {
    "prompt": "급식 전에 손을 씻으려는데 줄이 너무 길어요. 차례를 나누어 씻을 수 있도록 누구에게 도움을 요청하면 좋을까요?",
    "answer": "선생님",
    "required": [
      "선생님 등 차례를 함께 조정할 어른"
    ],
    "explanation": "친구를 탓하지 않고 선생님과 손 씻을 시간이나 차례를 의논해요.",
    "lines": 1,
    "before": "0683390b25457471"
  },
  "71": {
    "prompt": "자료 나에는 “이 비누만 쓰면 모든 감염병이 0”이라고 쓰여 있어요. 손 씻기를 해도 기침 예절이나 환기가 필요한 까닭을 짧게 써 보세요.",
    "answer": "병원체가 손 이외의 길로도 옮겨 갈 수 있기 때문이에요.",
    "required": [
      "손 이외에도 병원체가 옮겨 가는 길이 있다는 답"
    ],
    "explanation": "손 씻기는 감염의 위험을 줄이는 데 도움이 돼요. 모든 감염병을 손 씻기 하나로 막는다고 말하지 않아요.",
    "lines": 1,
    "before": "6ae8134a3517a288"
  },
  "79": {
    "prompt": "아픈 친구에게 “네가 옮겼으니 오지 마.”라고 했어요. 친구를 탓하지 않는 말로 한 문장만 고쳐 보세요.",
    "answer": "편히 쉬고 얼른 나아.",
    "required": [
      "아픈 친구를 탓하거나 따돌리지 않는 말"
    ],
    "explanation": "누구에게서 옮았는지 알 수 없는데 친구를 원인으로 정하지 않아요. 친구를 배려하며 우리도 예방 수칙을 지켜요.",
    "lines": 1,
    "before": "53c992964d677b3c"
  },
  "34": {
    "prompt": "친구 A~F를 그리고, 2차례 뒤 반짝이가 남은 친구만 색칠하세요. 표에서 차례를 확인하며 1차례에는 A→B, 2차례에는 A→F 화살표를 그리세요. B의 표식은 다음 차례 전에 빼므로 지운 표시를 하세요.",
    "answer": "A·F를 색칠한다. 1차례 A→B, 2차례 A→F를 표시하고 B의 표식을 지운다.",
    "required": [
      "A·F에 남은 표식",
      "차례별 화살표와 B의 표식을 지운 표시"
    ],
    "explanation": "표식을 빼는 단계와 악수하는 단계를 차례대로 살펴요. 표식이 남은 친구와 실제 감염자는 같지 않아요.",
    "drawingExplanationLines": 0,
    "before": "59f0bf9220fe91fc"
  },
  "47": {
    "prompt": "손 씻기·기침 예절·환기 중 두 가지를 골라, 두 칸에 하나씩 그리세요. 친구에게 알려 줄 짧은 말을 붙여도 좋아요.",
    "answer": "손 씻기와 옷소매로 입과 코를 가리는 모습 등 예방 행동 두 가지를 그린다.",
    "required": [
      "알맞은 예방 행동 두 가지"
    ],
    "explanation": "친구가 그림을 보고 따라 할 수 있게 예방 행동을 나타내요.",
    "drawingExplanationLines": 0,
    "before": "5cc6b7741652213a",
    "drawingPanels": 2
  },
  "56": {
    "prompt": "두 칸에 카드 A~D를 하나씩 그리세요. 3차례 뒤 표식이 남은 카드에 동그라미 하세요. 왼쪽은 「표식을 빼지 않음」, 오른쪽은 「B의 표식을 뺌」이에요.",
    "answer": "왼쪽은 A·B·C, 오른쪽은 A에 동그라미 한다.",
    "required": [
      "두 규칙에 맞는 카드 표시"
    ],
    "explanation": "정한 카드 규칙의 결과를 두 그림으로 비교해요. 종이 표식의 수로 실제 감염자 수를 알 수는 없어요.",
    "drawingExplanationLines": 0,
    "before": "9786320ee045b1d8",
    "drawingPanels": 2
  },
  "64": {
    "prompt": "아직 쓰지 않은 손 씻기 점검표를 그리세요. 「언제」·「씻었나요?」·「필요한 도움」 세 칸을 넣으세요. 씻었는지 모르면 물음표(?)로 남길 수 있게 하세요.",
    "answer": "세 항목이 있는 빈 점검표를 그린다. 씻었는지 모르는 경우 물음표를 쓸 수 있게 한다.",
    "required": [
      "세 항목을 갖춘 빈 점검표",
      "모르는 경우를 표시할 방법"
    ],
    "explanation": "실제로 씻은 때에는 그때의 일을 적어요. 하지 않음과 했는지 모름은 다르게 표시해요.",
    "drawingExplanationLines": 0,
    "before": "ef377c20283b901a"
  },
  "72": {
    "drawingPanels": 3,
    "prompt": "손 씻기를 세 장면으로 그리세요. 「비누 거품 내기 → 꼼꼼히 문지르기 → 헹구고 말리기」를 차례로 그리고 화살표로 이으세요.",
    "answer": "비누 거품을 내고, 30초 이상 여러 부위를 꼼꼼히 문지르고, 흐르는 물로 헹군 뒤 깨끗하게 말리는 세 장면을 그린다.",
    "required": [
      "거품 내기·꼼꼼히 씻기·헹구고 말리기 순서"
    ],
    "explanation": "비누와 흐르는 물로 30초 이상 꼼꼼히 씻는 순서를 그림으로 알려요.",
    "drawingExplanationLines": 0,
    "before": "3f2e023798d4ebc5"
  },
  "80": {
    "prompt": "교실의 손 씻는 곳을 그리세요. 「세면대」·「기다리는 곳」·「비누」·「손을 말릴 도구」 이름표를 붙이고, 차례를 기다렸다가 이동하는 길을 화살표로 표시하세요.",
    "answer": "기다리는 곳에서 세면대로 이어지는 길과 비누·손을 말릴 도구를 표시한다.",
    "required": [
      "네 곳의 이름표",
      "기다리는 곳과 손 씻는 곳을 구별한 길"
    ],
    "explanation": "서두르지 않고 차례를 지켜요. 준비물이나 시간이 부족하면 선생님께 도움을 요청해요.",
    "drawingExplanationLines": 0,
    "before": "a84d3486d4583b10"
  }
};
const bankReview={
  "c22-s32-u04-b08": {
    "prompt": "감염병이 유행하면 학교나 집에서 어떤 어려움이 생길 수 있나요? 한 가지만 짧게 써 보세요.",
    "answer": "아파서 학교 수업에 참여하기 어려울 수 있어요.",
    "required": [
      "감염병으로 생기는 생활의 어려움 한 가지"
    ],
    "explanation": "아프면 쉬어야 해서 학교나 집의 생활이 달라질 수 있어요.",
    "before": [
      "77e6ed6e32a36644",
      "f7563825ae2c99ab"
    ]
  },
  "c22-s32-u04-b16": {
    "prompt": "친구가 “예방 수칙을 지켜도 아플 수 있으니 수칙은 필요 없어.”라고 했어요. 예방 수칙이 필요한 까닭을 한 문장으로 써 보세요.",
    "answer": "감염의 위험을 줄이는 데 도움이 되기 때문이에요.",
    "required": [
      "감염 위험을 줄인다는 답"
    ],
    "explanation": "예방 수칙은 감염의 위험을 줄이는 데 도움이 돼요. 한 친구가 아프다는 사실만으로 필요 없다고 할 수는 없어요.",
    "before": [
      "04b38d755000b28b"
    ]
  },
  "c22-s32-u04-b24": {
    "prompt": "함께 쓰는 물건을 만진 뒤 간식을 먹으려고 해요. 먹기 전에 할 일을 짧게 쓰세요.",
    "answer": "비누와 흐르는 물로 손을 씻어요.",
    "required": [
      "간식 전 손 씻기"
    ],
    "explanation": "손에 묻었을 수 있는 병원체가 음식이나 입으로 옮겨 가는 것을 줄여요.",
    "before": [
      "8f4db944ea016d96"
    ]
  },
  "c22-s32-u04-b32": {
    "prompt": "기침할 때 휴지가 없어요. 무엇으로 입과 코를 가리면 좋을까요?",
    "answer": "옷소매 안쪽",
    "required": [
      "옷소매로 가린다는 답"
    ],
    "explanation": "기침할 때는 휴지나 옷소매 안쪽으로 입과 코를 가려요.",
    "before": [
      "20b76c17bc605b9d"
    ]
  },
  "c22-s32-u04-b40": {
    "prompt": "손 씻기 외에 교실에서 함께 할 수 있는 감염병 예방 행동을 한 가지 쓰세요.",
    "answer": "기침할 때 옷소매로 입과 코를 가려요.",
    "required": [
      "기침 예절·환기 등 알맞은 행동 한 가지"
    ],
    "explanation": "병원체가 옮겨 가는 길은 여러 가지예요. 상황에 맞는 예방 행동을 함께 실천해요.",
    "before": [
      "471d1df3ed340215"
    ]
  },
  "c22-s32-u04-b48": {
    "prompt": "카드에 붙은 표식 수가 줄었어요. 이 수가 실제 감염자 수를 뜻할까요? 짧게 답하세요.",
    "answer": "아니요. 카드의 표식 수예요.",
    "required": [
      "모형의 표식 수와 실제 감염자 수가 다르다는 답"
    ],
    "explanation": "카드 모형은 표식이 옮겨 가는 모습을 보여 줘요. 실제로 누가 감염되는지는 알 수 없어요.",
    "before": [
      "c76fbf41d4c2a237"
    ]
  },
  "c22-s32-u04-b56": {
    "prompt": "오늘 손을 씻었는지 떠올려 보세요. 씻었다면 언제 씻었는지, 아직 씻지 않았다면 다음에 씻을 때를 짧게 쓰세요.",
    "answer": "아직 씻지 않았어요. 점심을 먹기 전에 씻을 거예요.",
    "required": [
      "실제 씻은 때 또는 아직 씻지 않았다는 말과 다음에 씻을 때"
    ],
    "explanation": "실제로 한 일과 앞으로 할 일을 나누어 말해요.",
    "before": [
      "110dd1c937733bef"
    ]
  },
  "c22-s32-u04-b64": {
    "prompt": "기침할 때 지킬 우리 반 약속을 한 문장으로 쓰세요.",
    "answer": "휴지나 옷소매로 입과 코를 가려요.",
    "required": [
      "기침 예절에 맞는 구체적인 행동"
    ],
    "explanation": "친구가 따라 할 수 있도록 할 행동을 구체적으로 말해요.",
    "before": [
      "bee7ad685fee63f6"
    ]
  },
  "c22-s32-u04-b72": {
    "prompt": "손 씻기 포스터를 아직 누구에게도 알려 주지 않았어요. 누구에게 보여 주고 싶은지 한 사람만 쓰세요.",
    "answer": "가족",
    "required": [
      "포스터를 보여 줄 대상 한 사람"
    ],
    "explanation": "아직 보여 주지 않았다면 앞으로 보여 줄 사람을 정해요. 보여 준 뒤에는 실제로 나눈 이야기를 떠올려 보아요.",
    "before": [
      "88e4a47fe5fb3ca1"
    ]
  },
  "c22-s32-u04-b80": {
    "prompt": "예방 약속을 지키기 어려울 때 필요한 도움을 한 가지 쓰세요.",
    "answer": "손 씻을 차례를 정하도록 선생님께 도움을 요청해요.",
    "required": [
      "어려움에 맞는 도움 한 가지"
    ],
    "explanation": "친구를 탓하지 않고 시간·차례·준비물 중 필요한 도움을 요청해요.",
    "before": [
      "1b76811453b68dea"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const bankCache=new WeakMap(),bookCache=new WeakMap();
const contract=(old,e)=>({...old,sample:e.answer,reviewRequired:true,rubric:{...old.rubric,required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 다른 예도 교사가 확인해요.'}});
export function infectionGuidedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type==='original'||!e.before.includes(fingerprint(q)))return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
  const result={...q,prompt:[e.prompt,...(e.parts||[])].join('\n'),answerContract:contract(q.answerContract,e),explanation:e.explanation,infectionGuidedResponse:INFECTION_GUIDED_VERSION,contentVersion:INFECTION_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,result);return result;
 });return changed?next:rows;
}
export function withInfectionGuidedClassroom(u,mod){const items=infectionGuidedItems(mod?.classroomItems,u);return items===mod?.classroomItems?mod:{...mod,classroomItems:items};}
const fields={
  "2": [
    {
      "type": "heading",
      "text": "워밍업"
    },
    {
      "type": "text",
      "text": "감기에 걸려 쉬었던 때를 떠올려 보세요. 학교나 집에서 달라진 일을 하나 말해 보세요."
    }
  ],
  "4": [
    {
      "type": "heading",
      "text": "표에서 찾아보아요"
    },
    {
      "type": "text",
      "text": "감기와 독감에 모두 나타날 수 있는 모습을 손으로 짚어 보세요. 기침만으로 병 이름을 정할 수 있는지도 짝과 말해 보세요."
    }
  ],
  "6": [
    {
      "type": "heading",
      "text": "알맞은 말에 동그라미 해요"
    },
    {
      "type": "text",
      "text": "기침을 했다는 말만으로 병 이름을 ( 알 수 있어요 / 알 수 없어요 )."
    }
  ],
  "8": [
    {
      "type": "heading",
      "text": "짝과 이어요"
    },
    {
      "type": "table",
      "heads": [
        "상황",
        "선으로 이어요",
        "예방 행동"
      ],
      "rows": [
        [
          "기침할 때",
          "",
          "비누로 손 씻기"
        ],
        [
          "간식을 먹기 전",
          "",
          "휴지나 옷소매로 가리기"
        ]
      ]
    }
  ],
  "10": [
    {
      "type": "heading",
      "text": "손가락으로 따라가요"
    },
    {
      "type": "text",
      "text": "표에서 손 → 문손잡이 → 다른 친구의 손 순서로 짚어 보세요. 손을 씻으면 어느 연결을 줄일 수 있을지 말해 보세요."
    }
  ],
  "12": [
    {
      "type": "heading",
      "text": "알맞은 말에 동그라미 해요"
    },
    {
      "type": "text",
      "text": "둘째 규칙도 처음 표식은 ( A에만 / 첫 규칙의 마지막 위치에 ) 놓고 시작해요."
    }
  ],
  "13": [
    {
      "type": "heading",
      "text": "알맞은 말에 동그라미 해요"
    },
    {
      "type": "text",
      "text": "두 규칙에서 짝과 차례는 ( 같게 / 다르게 ) 해요. 달리하는 것은 표식을 ( 빼는지 / 어디에 처음 놓는지 )예요."
    }
  ],
  "15": [
    {
      "type": "heading",
      "text": "표에서 짚어 보아요"
    },
    {
      "type": "text",
      "text": "2차례 전에 B의 표식을 빼는 행을 찾으세요. 그다음 A와 짝이 되는 친구를 짚어 보세요."
    }
  ],
  "18": [
    {
      "type": "heading",
      "text": "알맞은 말에 동그라미 해요"
    },
    {
      "type": "text",
      "text": "이 모형에서 센 것은 ( 표식이 남은 카드 수 / 실제 환자 수 )예요."
    }
  ],
  "19": [
    {
      "type": "heading",
      "text": "손에서 짚어 보아요"
    },
    {
      "type": "text",
      "text": "내 손에서 엄지손가락·손가락 사이·손톱 밑을 하나씩 짚어 보세요. 씻을 때 빠뜨리지 않을 곳이에요."
    }
  ],
  "21": [
    {
      "type": "heading",
      "text": "알맞은 말에 동그라미 해요"
    },
    {
      "type": "text",
      "text": "휴지가 없으면 ( 손바닥 / 옷소매 안쪽 )으로 입과 코를 가려요. 창문이 너무 높으면 ( 의자에 올라가요 / 어른에게 도움을 요청해요 )."
    }
  ],
  "25": [
    {
      "type": "heading",
      "text": "짝과 말해요"
    },
    {
      "type": "text",
      "text": "걱정하는 친구에게 해 주고 싶은 말을 골라 보세요. “네 잘못이야.” / “푹 쉬고 얼른 나아.”"
    }
  ],
  "28": [
    {
      "type": "heading",
      "text": "표에서 찾아 동그라미 해요"
    },
    {
      "type": "text",
      "text": "약속을 실천한 친구는 ( 늘었어요 / 줄었어요 ). 감기로 결석한 친구는 ( 늘었어요 / 줄었어요 )."
    }
  ],
  "32": [
    {
      "type": "heading",
      "text": "알맞게 이어요"
    },
    {
      "type": "table",
      "heads": [
        "언제",
        "선으로 이어요",
        "할 일"
      ],
      "rows": [
        [
          "밥을 먹기 전",
          "",
          "옷소매로 입과 코 가리기"
        ],
        [
          "기침할 때",
          "",
          "비누로 손 씻기"
        ]
      ]
    }
  ],
  "39": [
    {
      "type": "heading",
      "text": "해 본 뒤에만 적어요"
    },
    {
      "type": "text",
      "text": "카드로 해 보기 전에는 예상이고, 해 본 뒤에 얻은 결과는 실제 기록이에요."
    },
    {
      "type": "table",
      "heads": [
        "두 규칙",
        "표식이 남은 카드 이름"
      ],
      "rows": [
        [
          "표식을 빼지 않음",
          ""
        ],
        [
          "B의 표식을 뺌",
          ""
        ]
      ]
    }
  ],
  "41": [
    {
      "type": "heading",
      "text": "알맞은 말에 동그라미 해요"
    },
    {
      "type": "text",
      "text": "화요일에 적지 않은 칸은 ( 안 했다는 뜻 / 했는지 모른다는 뜻 )이에요. 수요일 0번은 ( 안 했다는 뜻 / 했는지 모른다는 뜻 )이에요."
    }
  ],
  "44": [
    {
      "type": "heading",
      "text": "도움을 골라 보아요"
    },
    {
      "type": "text",
      "text": "손을 씻을 곳이 붐비면 ( 친구 탓하기 / 선생님과 차례 나누기 )를 해요. 비누가 없으면 누구에게 알릴지 짝과 말해 보세요."
    }
  ],
  "49": [
    {
      "type": "heading",
      "text": "짝에게 물어보아요"
    },
    {
      "type": "text",
      "text": "안내 그림을 보여 주고 “무엇을 하라는 그림일까?”라고 물어보세요. 친구가 알아보기 어려워한 곳을 손으로 짚어 함께 고쳐 보세요."
    }
  ],
  "54": [
    {
      "type": "field",
      "title": "한 가지만 적어요",
      "hint": "앞으로 지킬 예방 약속 한 가지를 짧게 써 보세요.",
      "lines": 1,
      "draw": false
    }
  ]
};
const cues=[
  "사진에서 반짝이가 묻은 손을 찾아보세요. 악수한 뒤 어떻게 될지 예상해 보세요.",
  "학교에 못 가고 쉬면 어떤 점이 아쉬울지 짝과 말해 보세요.",
  "감염병과 다친 경우를 구별해 보세요.",
  "표에서 손을 거쳐 옮겨 갈 수 있는 감염병을 찾아보세요.",
  "겉모습이 깨끗해 보여도 손을 씻어야 할 때를 말해 보세요.",
  "독감이라고 안내받은 카드와 기침만 적힌 카드를 나누어 짚어 보세요.",
  "고른 답과 맞는 내용을 앞쪽 표에서 찾아보세요.",
  "상황과 예방 행동을 선으로 이어 보세요.",
  "음식과 손을 거쳐 옮겨 가는 길을 구별해 보세요.",
  "표에서 문손잡이 앞뒤에 나오는 손을 짚어 보세요.",
  "기침 예절과 손 씻기가 필요한 때를 짝과 말해 보세요.",
  "처음 표식 위치와 짝·차례가 모두 같은 계획을 찾아보세요.",
  "같게 할 짝·차례와 달리할 표식 빼기 규칙을 구별해 보세요.",
  "표식을 빼는 일과 실제 손을 씻는 일은 어떻게 다른지 말해 보세요.",
  "1차례 뒤와 2차례 전 사이에 달라진 카드를 찾아보세요.",
  "표식이 옮겨 간 길을 화살표로 따라가 보세요.",
  "눈에 보이는 반짝이와 아주 작은 병원체를 구별해 보세요.",
  "모형이 알려 주는 것과 알 수 없는 것을 표에서 찾아보세요.",
  "손에서 빠뜨리기 쉬운 곳 세 군데를 짚어 보세요.",
  "손 씻을 때와 씻을 곳을 그림에서 찾아보세요.",
  "휴지나 옷소매로 입과 코를 가리는 모습을 해 보세요. 실제로 기침할 필요는 없어요.",
  "손바닥으로 기침을 가린 뒤 손을 씻어야 하는 까닭을 말해 보세요.",
  "손 씻을 시간과 여러 부위를 함께 확인해 보세요.",
  "밥 먹기 전과 기침한 뒤에 할 행동을 골라 보세요.",
  "나와 친구를 함께 지키는 행동을 표에서 찾아보세요.",
  "병원체가 옮겨 가는 길에 맞는 행동을 짚어 보세요.",
  "아픈 친구에게 해 줄 따뜻한 말을 짝과 말해 보세요.",
  "표에 적힌 변화와 적혀 있지 않은 조건을 찾아보세요.",
  "세 주 동안 달라졌을 수 있는 것을 한 가지 말해 보세요.",
  "물건과 손을 잇는 길을 자료에서 짚어 보세요.",
  "예방 행동을 한 뒤에도 살펴야 할 것을 짝과 말해 보세요.",
  "손 씻기·기침 예절·환기를 각각 할 때를 말해 보세요.",
  "고른 답을 앞에서 배운 개념으로 확인해 보세요.",
  "두 규칙의 표식 수와 실제 감염자 수를 구별해 보세요.",
  "안내문에 넣을 예방 행동 두 가지를 골라 보세요.",
  "빈칸의 말을 넣어 우리 반 약속을 소리 내어 읽어 보세요.",
  "카드 모형에서 처음 표식이 놓인 곳을 찾아보세요.",
  "표식을 빼기 전과 뺀 뒤를 나누어 살펴보세요.",
  "두 규칙을 각각 A에만 표식이 있는 상태에서 시작했는지 확인해 보세요.",
  "두 그림에 표식이 남은 카드가 어떻게 다른지 짚어 보세요.",
  "0번과 적지 않은 칸의 뜻을 구별해 보세요.",
  "적지 않은 칸을 짐작해 채워도 될지 짝과 말해 보세요.",
  "표에 적힌 실천과 앞으로 할 계획을 구별해 보세요.",
  "기다릴 시간이나 준비물이 부족할 때 요청할 도움을 골라 보세요.",
  "점검표에서 손을 씻었는지 모를 때 쓸 표시를 찾아보세요.",
  "안내문을 어디서 언제 만들었는지 찾아보세요.",
  "모든 감염병을 막는다는 말이 알맞은지 살펴보세요.",
  "손 씻기와 함께 지킬 예방 행동을 말해 보세요.",
  "친구가 알아보기 어려운 그림을 손으로 짚어 함께 고쳐 보세요.",
  "세 장면에서 거품 내기·문지르기·헹구고 말리기를 찾아보세요.",
  "혼자 하기 어려운 일을 도와줄 어른을 떠올려 보세요.",
  "아픈 친구를 탓하지 않는 말을 골라 보세요.",
  "기다리는 곳에서 손 씻는 곳으로 가는 길을 따라가 보세요.",
  "내가 고른 예방 약속을 짝에게 말해 보세요."
];
const core={0:'손을 거쳐 병원체가 옮겨 갈 수 있어요. 손 씻기는 옮겨 가는 것을 줄이는 데 도움이 돼요.',1:'감염병의 사례와 옮겨 가는 길을 알고, 생활 속 예방 행동을 함께 실천해요.',3:'겉으로 나타난 모습만으로 병 이름을 정할 수는 없어요.',11:'표식을 빼는 규칙만 비교하려면 처음 위치와 짝·차례는 같게 해요.',14:'정한 카드의 표식을 먼저 빼고, 그다음 짝을 따라가요.',17:'모형에서 센 카드 수로 실제 환자 수를 알 수는 없어요.',27:'손 씻기와 함께 날씨나 다른 생활 습관도 달라졌을 수 있어요.',34:'친구가 따라 할 수 있는 예방 행동을 그림으로 알려요.',35:'손·기침·공기를 떠올리며 우리 반 약속을 정해요.',40:'하지 않은 일과 했는지 모르는 일은 달라요.',45:'안내문을 누가 언제 만들었는지 살펴요.',47:'예방 수칙을 친구에게 알리고 함께 실천해요.',53:'생활 속에서 지킬 예방 약속을 하나 정해요.',33:'모형에서 표식이 남은 수와 실제 감염자 수는 달라요.',39:'두 규칙의 결과를 카드 그림으로 비교해요.',44:'실제로 한 일과 했는지 모르는 일을 다르게 표시해요.',49:'비누와 흐르는 물로 30초 이상 여러 부위를 꼼꼼히 씻어요.',52:'차례를 지키고 준비물이나 시간이 부족하면 선생님께 도움을 요청해요.'};
export function withInfectionGuidedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(bookCache.has(w))return bookCache.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const changes={prompt:e.prompt,answer:e.answer,criteria:e.required.join(' / '),explanation:e.explanation,infectionGuidedResponse:INFECTION_GUIDED_VERSION};
 for(const k of ['lines','drawingPanels','drawingExplanationLines'])if(Object.hasOwn(e,k))changes[k]=e[k];
 if(q.form==='written'||q.form==='draw')changes.responseContract={...q.responseContract,teacherRequired:true,requiredElements:[...e.required]};
 if(e.parts){changes.parts=[...e.parts];changes.answerPerPart=true;}
 return{...q,...changes};});
 const titles={0:'손에서 손으로 옮겨 가요',4:'배운 내용으로 골라요',8:'배운 내용으로 골라요',13:'배운 내용으로 골라요',19:'배운 내용으로 골라요',21:'배운 내용으로 골라요',25:'배운 내용으로 골라요',14:'표식을 빼고 다음 차례를 시작해요',17:'카드 수와 환자 수는 같을까요?',27:'손 씻기만으로 달라졌을까요?',38:'카드로 직접 해 보아요',40:'안 했을까요, 적지 않았을까요?',44:'손 씻기 점검표를 만들어요',45:'누가 언제 만든 안내문일까요?',46:'안내문의 말을 살펴요',47:'예방 행동을 알려요',51:'앞으로 할 일과 해 본 일을 나누어요',53:'내가 지킬 예방 약속'};
 const pages=w.pages.map((p,i)=>({...p,...(titles[i]?{title:titles[i]}:{}),blocks:p.blocks.flatMap(b=>b.type==='field'&&fields[i+1]?clone(fields[i+1]):[b]),rail:p.rail.map(n=>{if(n.title==='핵심 정리'&&core[i])return{...n,text:core[i]};if(n.title!=='내가 정리할 것')return n;const{write,...note}=n;return{...note,text:cues[i]};})}));
 const teacherStudentPages=w.teacherStudentPages.map(p=>{const i=w.pages.findIndex(x=>JSON.stringify(x)===JSON.stringify(p));return i>=0?pages[i]:p;});
 const teacherPages=Array.from({length:Math.ceil(questions.length/3)},(_,i)=>({...w.teacherPages[0],section:`정답·해설 ${i*3+1}~${Math.min(i*3+3,questions.length)}`,blocks:[{type:'solutions',ids:questions.slice(i*3,i*3+3).map(q=>q.id)}]}));
 pages[0]={...pages[0],lead:'손을 거쳐 옮겨 가는 모습을 살펴보고, 함께 지킬 예방 행동을 알아봐요.'};
 // Keep the teacher's front matter on the same reviewed page objects.
 for(let i=0;i<teacherStudentPages.length;i++){const index=w.pages.findIndex(x=>JSON.stringify(x)===JSON.stringify(w.teacherStudentPages[i]));if(index>=0)teacherStudentPages[i]=pages[index];}
 const result={...w,questions,pages,teacherStudentPages,teacherPages};bookCache.set(w,result);return result;
}
