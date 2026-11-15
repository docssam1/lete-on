export const BODY_CONTEXT_VERSION='20261115-body-workbook-context';
// Revise only the exact authored question/page that was reviewed.
const review={
 "patches": [
  {
   "previous": {
    "id": "body-book-04",
    "no": 4,
    "status": "authored",
    "form": "written",
    "topic": "자료와 실제 관찰",
    "prompt": "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요? 까닭을 써 보세요.",
    "answer": "아니에요. 주어진 표를 읽은 것과 내가 직접 맥박 수를 센 것은 달라요.",
    "explanation": "제공된 표를 읽은 것과 내가 직접 맥박을 관찰한 것은 달라요. 직접 관찰했다면 날짜와 방법, 실제로 센 횟수를 따로 적어요.",
    "misconception": "정답이나 기록칸 수를 실제 수행으로 바꾸지 않는다.",
    "criteria": "주어진 표를 읽은 것과 직접 맥박 수를 센 것은 다르다는 까닭을 설명하면 돼요.",
    "lines": 8,
    "previousCriteria": "자료/직접 수행 구별1, 실제 관찰 근거1.",
    "standard": "6과04-02",
    "origin": "previous96"
   },
   "fields": {
    "prompt": "자료에서 “운동 뒤 맥박 수가 늘었다”는 설명을 읽었어요. 이 글을 읽은 것만으로 내가 직접 관찰했다고 할 수 있을까요? 까닭을 쓰세요.",
    "answer": "아니에요. 자료의 설명을 읽은 것과 내가 직접 맥박 수를 센 것은 달라요.",
    "explanation": "자료의 설명을 읽는 것과 직접 맥박을 관찰하는 것은 달라요. 직접 관찰했다면 같은 방법과 시간으로 센 실제 횟수를 따로 남겨요.",
    "criteria": "자료를 읽는 것과 직접 맥박을 관찰하는 것은 다르다는 까닭을 설명하면 인정해요."
   }
  },
  {
   "previous": {
    "id": "body-book-45",
    "no": 45,
    "status": "authored",
    "form": "draw",
    "topic": "소개 자료",
    "prompt": "한 기관 관련 질병의 예방법을 알리는 카드 초안을 그리세요. 기관·예방 행동·까닭·출처가 들어갈 곳을 표시하세요.",
    "answer": "제목과 관련 기관, 실제 조사로 확인한 예방 행동과 까닭, 출처/확인 날짜, 아직 미확인인 부분을 배치한다.",
    "explanation": "카드에 관련 기관과 예방 행동, 그 행동이 도움이 되는 까닭을 넣어요. 자료를 찾은 곳과 확인 날짜를 적을 자리도 표시해요.",
    "misconception": "그림이나 계획을 실제 제작·공유로 바꾸지 않는다.",
    "criteria": "관련 기관/질병1, 행동과 까닭1, 출처/미확인 표시1.",
    "drawing": "large",
    "previousCriteria": "관련 기관/질병1, 행동과 까닭1, 출처/미확인 표시1.",
    "standard": "6과04-03",
    "origin": "previous96"
   },
   "fields": {
    "criteria": "관련 질병과 기관, 예방 행동과 그 까닭, 출처가 들어갈 곳을 표시하면 인정해요. 아직 확인하지 못한 내용을 넣었다면 그 부분을 따로 표시해요."
   }
  },
  {
   "previous": {
    "id": "body-book-48",
    "no": 48,
    "status": "authored",
    "form": "written",
    "topic": "원인과 모형",
    "prompt": "같은 간격으로 끝까지 눌렀다 놓는 펌프에서 1회에 이동하는 물은 같았습니다. 10초 동안 누른 횟수만 늘렸다면 1회 양과 10초 총량을 구별해 설명하세요.",
    "answer": "1회 양은 같은 조건이고, 같은 10초 동안 누른 횟수가 늘면 그동안 이동한 총량은 늘어난다.",
    "explanation": "한 번에 옮긴 물의 양이 같아도 10초 동안 더 많이 누르면 그동안 옮긴 총량은 늘어요. 모형의 한 번 양과 정한 시간의 총량을 나누어 읽어요.",
    "misconception": "빠르게 누르면 반드시 한 번 양도 늘어난다고 말하지 않는다.",
    "criteria": "1회 양 고정1, 같은 시간 총량 증가1.",
    "previousCriteria": "1회 양 고정1, 같은 시간 총량 증가1.",
    "lines": 8,
    "standard": "6과04-02",
    "origin": "previous96"
   },
   "fields": {
    "prompt": "펌프를 끝까지 눌렀다 놓을 때마다 이동하는 물의 양은 같았어요. 10초 동안 누르는 횟수만 늘렸다면, 한 번에 이동하는 양과 10초 동안 이동한 전체 양을 구별해 설명하세요."
   }
  },
  {
   "previous": {
    "id": "body-book-50",
    "no": 50,
    "status": "authored",
    "form": "draw",
    "topic": "모형 설계",
    "prompt": "실을 당기면 팔꿈치가 굽혀지는 모형을 그리세요. 뼈와 관절을 나타내는 부분, 실을 당기는 방향, 실제 근육과 다른 점을 표시하세요.",
    "answer": "두 막대와 관절 연결, 당길 줄의 부착점·방향과 굽힘, 모형 줄은 스스로 수축하지 않는다는 한계를 표시한다.",
    "explanation": "뼈를 나타내는 막대와 관절을 나타내는 연결 부분을 그려요. 어디에 실을 붙여 어느 방향으로 당기면 굽혀질지 표시하고, 실은 실제 근육처럼 스스로 수축하지 않는다고 써요.",
    "misconception": "관절을 움직였다는 것만으로 근육의 작용을 완전히 재현했다고 하지 않는다.",
    "criteria": "뼈/관절 대응1, 당김과 움직임1, 모형 한계/안전1.",
    "drawing": "large",
    "previousCriteria": "뼈/관절 대응1, 당김과 움직임1, 모형 한계/안전1.",
    "standard": "6과04-01",
    "origin": "previous96"
   },
   "fields": {
    "criteria": "뼈와 관절을 나타내는 부분, 실을 당기는 방향과 굽혀지는 움직임, 실을 사람이 당긴다는 점처럼 실제 근육과 다른 점을 나타내면 인정해요."
   }
  },
  {
   "previous": {
    "id": "body-book-56",
    "no": 56,
    "status": "authored",
    "form": "written",
    "topic": "실제 소통",
    "prompt": "발표 자료를 저장했지만 아직 설명하지 않았습니다. 제작과 전달의 상태를 어떻게 적을까요?",
    "answer": "자료 제작/저장은 실제로 했고 전달은 미실행으로 적는다. 누구에게 언제 어떤 방법으로 설명할지 계획은 따로 남긴다.",
    "explanation": "자료를 만들어 저장한 것은 했지만 아직 친구에게 설명하지 않았어요. 앞으로 누구에게 언제 어떻게 보여 줄지 따로 계획해요.",
    "misconception": "예정일을 실제 전달일로 바꾸지 않는다.",
    "criteria": "제작과 미공유 구별1, 전달 계획 구별1.",
    "previousCriteria": "제작과 미공유 구별1, 전달 계획 구별1.",
    "lines": 8,
    "standard": "6과04-03",
    "origin": "previous96"
   },
   "fields": {
    "criteria": "자료를 만들어 저장한 일은 했지만 아직 친구에게 설명하지 않았다는 두 상태를 구별해 적으면 인정해요. 전달할 계획을 덧붙였다면 실제로 한 일과 구별해요."
   }
  },
  {
   "previous": {
    "id": "body-book-57",
    "no": 57,
    "status": "authored",
    "form": "multi",
    "topic": "근거의 한계",
    "prompt": "이 수업에서 관찰한 것만으로는 말하기 어려운 주장을 모두 고르세요.",
    "answer": "②, ③",
    "explanation": "한 번 손을 씻었다고 앞으로 모든 감염병을 막는 것은 아니에요. 연습 표의 값으로 친구의 건강 순위를 정할 수도 없어요. 실제로 관찰한 모습과 아직 알 수 없는 것을 나누어요.",
    "misconception": "올바른 실천도 결과를100% 보장하는 치료로 쓰지 않는다.",
    "criteria": "한 번 손씻기로 모든 감염병 예방·연습 표로 친구 건강 순위의 두 과잉 주장을 고른다.",
    "choices": [
     "모형 막을 내렸을 때 풍선이 커졌다고 적는다.",
     "한 번 손씻기를 했으니 앞으로 모든 감염병에 걸리지 않는다고 쓴다.",
     "제공된 연습 표의 값으로 친구의 건강 순위를 정한다.",
     "불분명한 맥박은 다시 확인할 점으로 남긴다."
    ],
    "key": [
     1,
     2
    ],
    "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
    "standard": "6과04-03",
    "origin": "previous96"
   },
   "fields": {
    "prompt": "모형과 연습 자료만으로는 말하기 어려운 주장을 모두 고르세요."
   }
  },
  {
   "previous": {
    "id": "body-book-95",
    "no": 95,
    "status": "authored",
    "form": "written",
    "topic": "자료 보완",
    "prompt": "친구가 “어느 기관과 관련된 예방법인지 모르겠어.”라고 했습니다. 소개 자료를 어떻게 고치고 기록할까요?",
    "answer": "관련 기관/질병 이름과 예방 행동·까닭의 연결을 표시하고, 실제 받은 의견·수정 전후·다시 설명했는지 날짜와 함께 남긴다.",
    "explanation": "관련 기관과 질병 이름을 넣고 예방 행동이 왜 도움이 되는지 연결해요. 친구의 질문과 고친 내용을 적고, 다시 설명했다면 그 날짜도 남겨요.",
    "misconception": "받지 않은 의견이나 하지 않은 재설명을 꾸미지 않는다.",
    "criteria": "기관/행동 연결 보완1, 실제 의견/수정/재전달 구별1.",
    "previousCriteria": "기관/행동 연결 보완1, 실제 의견/수정/재전달 구별1.",
    "lines": 8,
    "standard": "6과04-03",
    "origin": "previous96"
   },
   "fields": {
    "criteria": "친구가 관련 기관과 예방 행동의 관계를 알 수 있도록 고칠 내용을 제안하고, 받은 질문과 고친 내용을 기록하는 방법을 설명하면 인정해요."
   }
  }
 ],
 "directions": [
  {
   "previous": {
    "section": "뼈·관절·근육 5~6",
    "title": "뼈와 관절",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-05",
       "body-book-06"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "뼈와 뼈가 연결되는 부분을 관절이라고 해요."
     },
     {
      "title": "더 알아보기",
      "text": "관절의 생김새에 따라 움직일 수 있는 방향이 달라요. 팔꿈치와 어깨를 비교하면 연결 구조와 움직임의 관계를 더 알아볼 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "관절의 위치와 갈비뼈가 둘러싼 기관을 짚어 보아요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-05",
     "no": 5,
     "status": "authored",
     "form": "blank",
     "topic": "뼈와 관절",
     "prompt": "뼈와 뼈가 연결되는 부분을 [ ]이라고 한다.",
     "answer": "관절",
     "explanation": "뼈와 뼈가 연결되는 부분은 관절이에요. 팔꿈치 관절에서는 팔을 굽히고 펼 수 있어요.",
     "misconception": "뼈 한가운데가 고무처럼 휜다고 생각하지 않는다.",
     "criteria": "뼈와 뼈가 연결되는 관절을 넣는다. 근육과 구별한다.",
     "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
     "standard": "6과04-01",
     "origin": "previous96"
    },
    {
     "id": "body-book-06",
     "no": 6,
     "status": "authored",
     "form": "choice",
     "topic": "뼈의 기능",
     "prompt": "갈비뼈의 생김새와 기능을 바르게 연결한 것은?",
     "answer": "③",
     "explanation": "휘어진 갈비뼈들이 가슴을 둘러싸 심장과 폐를 보호해요.",
     "misconception": "뼈의 이름만 외우지 않고 형태와 기능을 연결한다.",
     "criteria": "휘어진 여러 뼈가 가슴 공간을 이루어 심장·폐를 보호한다는 보기를 고른다.",
     "choices": [
      "납작한 여러 부분이 머리를 둘러싸 뇌를 보호한다.",
      "짧은 뼈들이 기둥처럼 이어져 척수를 보호한다.",
      "여러 뼈가 휘어 가슴 공간을 이루고 심장·폐를 보호한다.",
      "긴 뼈가 관절로 이어져 팔꿈치를 굽히고 펴게 한다."
     ],
     "key": 2,
     "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
     "standard": "6과04-01",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "관절의 위치와 갈비뼈가 둘러싼 기관을 짚어 보아요.",
     "value": "뼈와 뼈가 연결된 곳을 무엇이라고 하는지 쓰고, 갈비뼈가 보호하는 기관을 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "순환 기관",
    "title": "심장·혈관·혈액의 역할을 나누어요",
    "blocks": [
     {
      "type": "diagram",
      "key": "heart",
      "caption": "심장 겉모양 교육 모형이에요. 빨강/파랑은 구분 표시이며 실제 피가 파란색이라는 뜻이 아니에요."
     },
     {
      "type": "table",
      "heads": [
       "부분",
       "역할"
      ],
      "rows": [
       [
        "심장",
        "펌프처럼 혈액을 내보냄"
       ],
       [
        "혈관",
        "온몸에 이어진 혈액의 길"
       ],
       [
        "혈액",
        "영양소·산소·이산화탄소·노폐물 등을 운반"
       ]
      ]
     },
     {
      "type": "text",
      "text": "심장은 두 폐 사이 가슴 가운데에서 약간 몸의 왼쪽에 있어요. 모형을 보는 나의 좌우와 몸 기준 좌우를 먼저 구별해요."
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "심장·혈관·혈액은 필요한 물질을 몸의 여러 곳으로 운반하는 데 함께 관여해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 심장의 네 방과 판막을 배워요. 판막은 혈액이 거꾸로 흐르는 것을 막는 데 도움을 주어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "모형에서 심장의 위치를 찾고 하는 일을 써요.",
      "write": 5
     }
    ],
    "kind": "learn",
    "lead": ""
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "모형에서 심장의 위치를 찾고 하는 일을 써요.",
     "value": "심장·혈관·혈액이 하는 일을 각각 한 문장으로 정리해요."
    }
   ]
  },
  {
   "previous": {
    "section": "순환과 운반 19~20",
    "title": "심장의 위치",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-19",
       "body-book-20"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "심장은 두 폐 사이에서 몸의 왼쪽으로 조금 치우쳐 있어요."
     },
     {
      "title": "더 알아보기",
      "text": "심장의 오른쪽과 왼쪽은 서로 다른 순환으로 혈액을 내보내요. 그림을 볼 때에도 관찰자의 좌우와 몸의 좌우를 구별해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내 몸 기준 왼쪽을 정한 뒤 모형의 심장 위치를 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-19",
     "no": 19,
     "status": "authored",
     "form": "choice",
     "topic": "심장의 위치",
     "prompt": "몸 모형을 앞에서 보았어요. 모형 속 사람을 기준으로 심장의 위치를 바르게 설명한 것은?",
     "answer": "③",
     "explanation": "심장은 가슴 가운데의 두 폐 사이에서 몸의 왼쪽으로 조금 치우쳐 있어요. 앞에서 모형을 볼 때에는 모형 속 사람의 왼쪽과 내가 보는 왼쪽이 서로 다르다는 점을 살펴요.",
     "misconception": "“왼쪽 가슴 아래”만 외워 배에 있다고 표시하지 않는다.",
     "criteria": "몸 기준 가슴 가운데에서 약간 왼쪽에 있는 심장 위치를 고른다. 그림을 보는 사람의 좌우와 구별한다.",
     "choices": [
      "가슴 가운데에서 약간 몸의 오른쪽",
      "배 윗부분에서 약간 몸의 왼쪽",
      "가슴 가운데에서 약간 몸의 왼쪽",
      "가슴 왼쪽 가장자리에서 팔 쪽"
     ],
     "key": 2,
     "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
     "standard": "6과04-02",
     "origin": "previous96"
    },
    {
     "id": "body-book-20",
     "no": 20,
     "status": "authored",
     "form": "order",
     "topic": "순환의 연결",
     "prompt": "혈액이 산소를 받아 온몸으로 운반하는 순환의 큰 흐름을 배열하세요.",
     "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
     "explanation": "폐에서 산소를 받은 혈액(ㄴ)은 심장에서 온몸으로 보내져요(ㄹ). 온몸을 지난 뒤(ㄱ) 다시 심장으로 돌아와요(ㄷ).",
     "misconception": "한 번 온몸에 가면 혈액이 사라진다고 생각하지 않는다.",
     "criteria": "폐에서 산소 받기→심장이 온몸으로 보냄→온몸→심장으로 돌아옴의 큰 흐름을 문항 기호로 확인한다.",
     "given": [
      "ㄱ 온몸   ㄴ 폐에서 산소 받기   ㄷ 심장으로 돌아오기   ㄹ 심장에서 온몸으로 보내기"
     ],
     "previousCriteria": "각 단계의 선후 관계를 따로 확인한다.",
     "standard": "6과04-02",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내 몸 기준 왼쪽을 정한 뒤 모형의 심장 위치를 표시해요.",
     "value": "모형 속 사람의 왼쪽을 기준으로 심장의 위치를 설명해요."
    }
   ]
  },
  {
   "previous": {
    "section": "호흡과 모형 27~28",
    "title": "공기가 나가는 길",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-27",
       "body-book-28"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "내쉴 때 공기는 폐에서 기관지·기관을 거쳐 코로 나와요."
     },
     {
      "title": "더 알아보기",
      "text": "기체 교환은 산소와 이산화탄소가 폐포와 혈액 사이를 이동하는 과정이에요. 공기가 코로 드나드는 호흡 운동과 구별해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "풍선 모형에서 직접 본 변화를 써요. 폐와 혈액 사이에서 산소와 이산화 탄소를 주고받는 모습도 이 모형으로 볼 수 있는지 생각해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-27",
     "no": 27,
     "status": "authored",
     "form": "order",
     "topic": "공기가 나가는 길",
     "prompt": "코로 내쉴 때의 공기 이동을 배열하세요.",
     "answer": "ㄷ → ㄹ → ㄱ → ㄴ",
     "explanation": "내쉬는 공기는 폐(ㄷ) → 기관지(ㄹ) → 기관(ㄱ) → 코(ㄴ)의 순서로 나가요.",
     "misconception": "들이쉬는 방향을 그대로 쓰지 않는다.",
     "criteria": "이 문항 기호로 폐→기관지→기관→코의 날숨 공기 순서를 확인한다.",
     "given": [
      "ㄱ 기관   ㄴ 코   ㄷ 폐   ㄹ 기관지"
     ],
     "previousCriteria": "각 단계의 선후 관계를 따로 확인한다.",
     "standard": "6과04-02",
     "origin": "previous96"
    },
    {
     "id": "body-book-28",
     "no": 28,
     "status": "authored",
     "form": "written",
     "topic": "모형과 실제 몸",
     "prompt": "병과 풍선 모형이 실제 몸의 호흡을 모두 똑같이 보여 주지 못하는 점을 하나 설명하세요.",
     "answer": "병은 실제 갈비뼈처럼 움직이지 않고, 모형 풍선은 실제 폐의 세부 구조나 기체 교환을 보여 주지 못한다.",
     "explanation": "예를 들어 병은 실제 갈비뼈처럼 움직이지 않아요. 또 풍선만으로 실제 폐와 혈액 사이에서 산소와 이산화탄소가 오가는 모습까지 보여 줄 수는 없어요.",
     "misconception": "풍선이 커졌다는 것만으로 산소와 이산화탄소 교환을 측정했다고 하지 않는다.",
     "criteria": "구체적인 모형 한계1, 실제 기관과 비교1.",
     "previousCriteria": "구체적인 모형 한계1, 실제 기관과 비교1.",
     "lines": 8,
     "standard": "6과04-02",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "풍선 모형에서 직접 본 변화를 써요. 폐와 혈액 사이에서 산소와 이산화 탄소를 주고받는 모습도 이 모형으로 볼 수 있는지 생각해요.",
     "value": "27번의 공기 이동 순서를 쓰고, 28번 모형이 실제 호흡에서 보여 주지 못하는 점을 한 가지 적어요."
    }
   ]
  },
  {
   "previous": {
    "section": "협력과 관찰 조건 39~40",
    "title": "기관의 협력",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-39",
       "body-book-40"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "몸의 변화는 관찰한 사람과 활동 조건을 함께 보고 설명해요."
     },
     {
      "title": "더 알아보기",
      "text": "몸속 이산화탄소 등의 변화는 호흡 조절과 관련돼요. 고등학교에서는 감각 정보와 신경을 통한 조절을 더 자세히 알아보아요."
     },
     {
      "title": "내가 정리할 것",
      "text": "호흡이나 맥박 자료에서 알게 된 변화를 써요. 이 자료만으로 누가 더 건강한지 판단할 수 있는지도 생각해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-39",
     "no": 39,
     "status": "authored",
     "form": "written",
     "topic": "기관의 협력",
     "prompt": "몸을 움직일 때 호흡과 맥박이 보통 빨라지는 까닭을 써요. 호흡 기관과 순환 기관이 어떻게 함께 일하는지 설명하세요.",
     "answer": "활동하는 몸에 필요한 산소 등을 얻기 위해 호흡이 빨라지고, 혈액으로 필요한 물질을 운반하기 위해 심장이 더 빨리 뛰는 변화가 나타날 수 있다.",
     "explanation": "몸을 움직일 때에는 필요한 산소를 받아들이는 호흡이 보통 빨라져요. 그 산소 등을 혈액으로 운반하는 심장도 더 빨리 뛸 수 있어요. 실제 횟수는 사람과 상황에 따라 달라요.",
     "misconception": "한 번의 관찰이 모든 사람에게 같은 숫자로 나타난다고 하지 않는다.",
     "criteria": "산소 필요/호흡 연결1, 혈액 운반/심장 연결1.",
     "previousCriteria": "산소 필요/호흡 연결1, 혈액 운반/심장 연결1.",
     "lines": 8,
     "standard": "6과04-02",
     "origin": "previous96"
    },
    {
     "id": "body-book-40",
     "no": 40,
     "status": "authored",
     "form": "written",
     "topic": "건강 판정의 한계",
     "prompt": "한 친구의 운동 뒤 맥박 수가 다른 친구보다 적었습니다. 이것만으로 더 건강하다고 말할 수 없는 까닭은?",
     "answer": "사람과 운동량·쉰 시간·관찰 방법 등이 달라 영향을 주며, 한 번의 맥박 수만으로 건강을 진단할 수 없기 때문이다.",
     "explanation": "운동한 양과 쉰 시간, 관찰 방법 등이 서로 다를 수 있어요. 한 번 센 맥박 횟수만으로 친구의 건강을 판단할 수는 없어요.",
     "misconception": "자료 문제의 모형 값을 건강의 정상/이상 기준으로 쓰지 않는다.",
     "criteria": "다른 조건 예1, 건강 판정 불가1.",
     "previousCriteria": "다른 조건 예1, 건강 판정 불가1.",
     "lines": 8,
     "standard": "6과04-02",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "호흡이나 맥박 자료에서 알게 된 변화를 써요. 이 자료만으로 누가 더 건강한지 판단할 수 있는지도 생각해요.",
     "value": "몸을 움직일 때 호흡 기관과 순환 기관이 함께 하는 일을 써요. 친구의 맥박 수만으로 건강을 비교할 수 없는 까닭도 생각해요."
    }
   ]
  },
  {
   "previous": {
    "section": "생활 실천과 자료 41~42",
    "title": "조사 근거",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-41",
       "body-book-42"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "공공 보건기관의 자료에서 질병과 관련 기관을 확인해요."
     },
     {
      "title": "더 알아보기",
      "text": "호흡기 감염병은 코·목·기관지·폐 등 서로 다른 부위와 관련될 수 있어요. 모든 호흡기 감염병이 폐에서만 생긴다고 하지는 않아요."
     },
     {
      "title": "내가 정리할 것",
      "text": "이 자료가 어느 질병과 어느 기관을 설명하는지 찾아요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-41",
     "no": 41,
     "status": "authored",
     "form": "blank",
     "topic": "조사 근거",
     "prompt": "질병의 예방법을 소개할 때 자료 제목·제공 기관·쪽/주소와 [ ] 날짜를 남긴다.",
     "answer": "확인한",
     "explanation": "자료 제목과 만든 기관, 쪽이나 주소, 실제로 확인한 날짜를 적어요. 그러면 친구도 같은 자료를 다시 찾아 읽을 수 있어요.",
     "misconception": "출처 이름만 적고 내용을 확인했다고 주장하지 않는다.",
     "criteria": "자료를 다시 찾을 수 있는 확인한 날짜를 넣는다. 미래 계획 날짜와 구별한다.",
     "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
     "standard": "6과04-03",
     "origin": "previous96"
    },
    {
     "id": "body-book-42",
     "no": 42,
     "status": "authored",
     "form": "choice",
     "topic": "기관과 질병",
     "prompt": "질병 조사 주제와 관련 기관계를 바르게 연결한 것은?",
     "answer": "④",
     "explanation": "장염은 소화 기관과 관련된 질병의 사례예요. 관련 기관과 예방 행동은 믿을 만한 자료를 찾아 함께 살펴요.",
     "misconception": "증상 한 가지를 보고 친구의 병명을 정하지 않는다.",
     "criteria": "장염과 소화 기관의 관련을 바르게 연결한 보기를 고른다.",
     "choices": [
      "식중독—호흡 기관만",
      "인플루엔자—소화 기관만",
      "방광염—순환 기관만",
      "장염—소화 기관"
     ],
     "key": 3,
     "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
     "standard": "6과04-03",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "이 자료가 어느 질병과 어느 기관을 설명하는지 찾아요.",
     "value": "42번에서 바르게 연결된 질병과 관련 기관을 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "모형·자료·그림으로 깊이 풀기 47~48",
    "title": "모형과 실제 몸을 비교해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-47",
       "body-book-48"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "모형의 연결 상태와 실제로 바꾼 부분을 확인해 결과를 설명해요."
     },
     {
      "title": "더 알아보기",
      "text": "기체가 든 공간의 압력은 부피와 관련돼요. 호흡 모형에서는 병이 새지 않아야 막을 내렸을 때 생기는 압력 차이를 살피기 쉬워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "풍선이 커지지 않을 때 먼저 확인할 곳을 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-47",
     "no": 47,
     "status": "authored",
     "form": "choice",
     "topic": "모형 해석",
     "prompt": "풍선 호흡 모형의 아래 막만 당겼는데 풍선이 커지지 않았습니다. 먼저 점검할 일은?",
     "answer": "②",
     "explanation": "병과 관, 풍선이 연결된 곳에서 공기가 새는지 살펴요. 처음에 풍선이 커지지 않은 결과도 남겨요. 모형이 잘되지 않았다고 실제 사람의 호흡도 같다고 할 수는 없어요.",
     "misconception": "모형 실패를 곧바로 실제 기관의 실패로 일반화하지 않는다.",
     "criteria": "밀폐·관/풍선 연결을 확인하고 처음 실패도 남기는 방법을 고른다. 사람 폐의 건강으로 결론내지 않는다.",
     "choices": [
      "풍선이 안 커졌으니 실제 사람도 숨을 못 쉰다고 결론낸다.",
      "밀폐 상태와 관·풍선 연결을 확인하고 처음 결과를 남긴다.",
      "예상 그림처럼 풍선을 크게 그려 결과로 제출한다.",
      "막을 입에 대고 불어 더 세게 시험한다."
     ],
     "key": 1,
     "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
     "standard": "6과04-02",
     "origin": "previous96"
    },
    {
     "id": "body-book-48",
     "no": 48,
     "status": "authored",
     "form": "written",
     "topic": "원인과 모형",
     "prompt": "같은 간격으로 끝까지 눌렀다 놓는 펌프에서 1회에 이동하는 물은 같았습니다. 10초 동안 누른 횟수만 늘렸다면 1회 양과 10초 총량을 구별해 설명하세요.",
     "answer": "1회 양은 같은 조건이고, 같은 10초 동안 누른 횟수가 늘면 그동안 이동한 총량은 늘어난다.",
     "explanation": "한 번에 옮긴 물의 양이 같아도 10초 동안 더 많이 누르면 그동안 옮긴 총량은 늘어요. 모형의 한 번 양과 정한 시간의 총량을 나누어 읽어요.",
     "misconception": "빠르게 누르면 반드시 한 번 양도 늘어난다고 말하지 않는다.",
     "criteria": "1회 양 고정1, 같은 시간 총량 증가1.",
     "previousCriteria": "1회 양 고정1, 같은 시간 총량 증가1.",
     "lines": 8,
     "standard": "6과04-02",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "풍선이 커지지 않을 때 먼저 확인할 곳을 표시해요.",
     "value": "풍선이 커지지 않을 때 점검할 부분과, 같은 시간에 펌프를 누르는 횟수를 바꾸었을 때 달라지는 양을 각각 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "모형·자료·그림으로 깊이 풀기 55~56",
    "title": "질병 자료를 조사하고 소개해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-55",
       "body-book-56"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "조사 자료에서 알아낸 내용과 친구에게 실제로 설명한 내용을 구별해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 건강 정보를 물질대사와 관련지어 해석해요. 원인과 효과를 주장하는 자료는 조사 대상과 비교 방법도 함께 살펴요."
     },
     {
      "title": "내가 정리할 것",
      "text": "질병 자료의 제공 기관과 설명할 핵심 내용을 적어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-55",
     "no": 55,
     "status": "authored",
     "form": "choice",
     "topic": "조사 대상과 범위",
     "prompt": "질병 예방법을 조사할 자료로 가장 알맞은 것은?",
     "answer": "④",
     "explanation": "관련 기관과 예방 행동을 설명하고, 누가 만든 자료인지와 내용을 다시 확인할 수 있는 공공 보건기관 자료를 골라요.",
     "misconception": "공공기관 이름만 있다고 실제 내용을 읽지 않아도 되는 것은 아니다.",
     "criteria": "관련 기관·예방 행동·대상을 설명하는 공공 보건기관 자료를 고른다.",
     "choices": [
      "출처·날짜를 모르는 광고 댓글",
      "병명을 찍어 맞히는 친구 사진",
      "개인 경험만 적은 홍보 문구",
      "공공 보건기관이 관련 기관·예방 행동·대상을 설명한 자료"
     ],
     "key": 3,
     "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
     "standard": "6과04-03",
     "origin": "previous96"
    },
    {
     "id": "body-book-56",
     "no": 56,
     "status": "authored",
     "form": "written",
     "topic": "실제 소통",
     "prompt": "발표 자료를 저장했지만 아직 설명하지 않았습니다. 제작과 전달의 상태를 어떻게 적을까요?",
     "answer": "자료 제작/저장은 실제로 했고 전달은 미실행으로 적는다. 누구에게 언제 어떤 방법으로 설명할지 계획은 따로 남긴다.",
     "explanation": "자료를 만들어 저장한 것은 했지만 아직 친구에게 설명하지 않았어요. 앞으로 누구에게 언제 어떻게 보여 줄지 따로 계획해요.",
     "misconception": "예정일을 실제 전달일로 바꾸지 않는다.",
     "criteria": "제작과 미공유 구별1, 전달 계획 구별1.",
     "previousCriteria": "제작과 미공유 구별1, 전달 계획 구별1.",
     "lines": 8,
     "standard": "6과04-03",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "질병 자료의 제공 기관과 설명할 핵심 내용을 적어요.",
     "value": "55번에서 고른 자료가 알맞은 까닭과, 56번에서 아직 하지 않은 일을 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "단원 확인 71~72",
    "title": "소화와 순환 연결",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-71",
       "body-book-72"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "마신 물도 흡수된 뒤 혈액을 통해 몸의 여러 곳으로 운반돼요."
     },
     {
      "title": "더 알아보기",
      "text": "흡수한 물이 모두 곧바로 오줌으로 나가지는 않아요. 세포와 혈액 등에 쓰이고, 콩팥은 몸의 상태에 맞게 물의 배출을 조절해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "식도에서 오줌관으로 바로 이어 그린 화살표를 고쳐요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-71",
     "no": 71,
     "status": "authored",
     "form": "multi",
     "topic": "소화와 순환 연결",
     "prompt": "알맞은 설명을 모두 고르세요.",
     "answer": "①, ③, ④",
     "explanation": "입에서는 이가 음식물을 잘게 부수는 데 쓰여요. 흡수된 영양소는 혈액이 운반하고, 큰창자는 남은 내용물에서 물을 흡수해요. 음식물이 간 속으로 직접 지나가지는 않아요.",
     "misconception": "직접 지나는 기관과 돕는 기관을 구별한다.",
     "criteria": "이의 음식물 잘게 부수기·흡수한 영양소 운반·큰창자 물 흡수를 고른다. 간에 밥알이 직접 지난다는 선택은 제외한다.",
     "choices": [
      "입에서 음식물을 잘게 부수는 데 이가 쓰인다.",
      "간 속으로 밥알이 직접 지나간다.",
      "흡수된 영양소는 혈액으로 운반된다.",
      "큰창자는 남은 내용물에서 물을 흡수한다."
     ],
     "key": [
      0,
      2,
      3
     ],
     "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
     "standard": "6과04-02",
     "origin": "previous96"
    },
    {
     "id": "body-book-72",
     "no": 72,
     "status": "authored",
     "form": "written",
     "topic": "다른 경로",
     "prompt": "친구가 “물은 식도에서 곧바로 오줌관으로 내려간다.”고 합니다. 흡수·혈액·콩팥을 넣어 고치세요.",
     "answer": "마신 물은 소화 기관에서 흡수되어 혈액으로 운반되며, 콩팥에서 혈액 속 물질을 걸러 오줌이 만들어진 뒤 오줌관을 지난다.",
     "explanation": "마신 물은 소화 기관에서 흡수되어 혈액으로 운반돼요. 콩팥이 혈액 속 물질을 걸러 오줌을 만들고, 그 오줌이 오줌관으로 가요. 식도에서 바로 오줌관으로 이어지지는 않아요.",
     "misconception": "직접 연결된 하나의 관처럼 그리지 않는다.",
     "criteria": "흡수/혈액 연결1, 콩팥 뒤 오줌관1.",
     "lines": 8,
     "previousCriteria": "흡수/혈액 연결1, 콩팥 뒤 오줌관1.",
     "standard": "6과04-02",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "식도에서 오줌관으로 바로 이어 그린 화살표를 고쳐요.",
     "value": "72번 친구의 설명을 흡수·혈액·콩팥을 넣어 고쳐요."
    }
   ]
  },
  {
   "previous": {
    "section": "오개념 다시 보기 91~92",
    "title": "시간 다시 보기",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-91",
       "body-book-92"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "관찰 시간 없는 맥박 횟수와 직접 하지 않은 실험 기록을 다시 살펴요."
     },
     {
      "title": "더 알아보기",
      "text": "측정값에는 관찰 방법과 측정 시점의 영향이 있어요. 생리적 변화를 연구할 때에는 어떤 방법으로 얻은 값인지도 함께 비교해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "맥박 기록에 빠진 시간과 사진을 살펴본 방법을 밝혀요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-91",
     "no": 91,
     "status": "authored",
     "form": "short",
     "topic": "시간 다시 보기",
     "prompt": "맥박 기록을 비교할 때 “30회,40회”라는 숫자만 있습니다. 먼저 확인해야 할 조건 하나는?",
     "answer": "각각 얼마 동안 관찰했는지 확인한다.",
     "explanation": "각각 얼마 동안 센 횟수인지 먼저 확인해요. 같은 사람에게서 같은 방법으로 관찰했는지, 걷기 전과 후 중 어느 때인지도 살펴요.",
     "misconception": "시간을 확인하지 않은 채40회 쪽이 더 빠르다고 단정하지 않는다.",
     "criteria": "각 횟수를 얼마 동안 관찰했는지 등 비교 가능한 조건을 하나 쓴다. 숫자만으로 건강을 판단하지 않는다.",
     "previousCriteria": "조건에 맞는 동등한 표현을 인정한다.",
     "standard": "6과04-02",
     "origin": "previous96"
    },
    {
     "id": "body-book-92",
     "no": 92,
     "status": "authored",
     "form": "written",
     "topic": "모형과 실측 구별",
     "prompt": "제공된 호흡 모형 사진을 보고 내 실험 결과라고 적었어요. 어떻게 고쳐야 할까요?",
     "answer": "제공된 설명 자료를 읽은 것으로 고치고 실제 관찰 여부는 별도로 적는다. 직접 실험했다면 날짜·조작·실제 풍선 변화와 불분명을 남긴다.",
     "explanation": "제공된 사진을 읽어 알게 된 내용이라고 고쳐요. 직접 실험했다면 언제 막을 어떻게 움직였고 풍선이 실제로 어떻게 달라졌는지 따로 적어요.",
     "misconception": "AI 이미지의 모형 상태를 내 실측값으로 바꾸지 않는다.",
     "criteria": "자료의 성격 구별1, 실제 수행 근거/미실행1.",
     "previousCriteria": "자료의 성격 구별1, 실제 수행 근거/미실행1.",
     "lines": 8,
     "standard": "6과04-02",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "맥박 기록에 빠진 시간과 사진을 살펴본 방법을 밝혀요.",
     "value": "맥박을 센 시간처럼 비교에 필요한 조건을 쓰고, 교재 그림을 본 일과 직접 실험한 일을 구별해요."
    }
   ]
  },
  {
   "previous": {
    "section": "오개념 다시 보기 95~96",
    "title": "자료 보완",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "body-book-95",
       "body-book-96"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "친구가 궁금해한 기관과 예방 행동의 관계를 그림과 글로 보완해요."
     },
     {
      "title": "더 알아보기",
      "text": "생명과학의 설명은 구조·기능·물질 이동을 연결해요. 같은 호흡 기관을 소개해도 겉모양만 보일 때와 기체 교환을 설명할 때 필요한 그림이 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "자료에서 실제로 고친 문장과 그 까닭을 써요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": ""
   },
   "questions": [
    {
     "id": "body-book-95",
     "no": 95,
     "status": "authored",
     "form": "written",
     "topic": "자료 보완",
     "prompt": "친구가 “어느 기관과 관련된 예방법인지 모르겠어.”라고 했습니다. 소개 자료를 어떻게 고치고 기록할까요?",
     "answer": "관련 기관/질병 이름과 예방 행동·까닭의 연결을 표시하고, 실제 받은 의견·수정 전후·다시 설명했는지 날짜와 함께 남긴다.",
     "explanation": "관련 기관과 질병 이름을 넣고 예방 행동이 왜 도움이 되는지 연결해요. 친구의 질문과 고친 내용을 적고, 다시 설명했다면 그 날짜도 남겨요.",
     "misconception": "받지 않은 의견이나 하지 않은 재설명을 꾸미지 않는다.",
     "criteria": "기관/행동 연결 보완1, 실제 의견/수정/재전달 구별1.",
     "previousCriteria": "기관/행동 연결 보완1, 실제 의견/수정/재전달 구별1.",
     "lines": 8,
     "standard": "6과04-03",
     "origin": "previous96"
    },
    {
     "id": "body-book-96",
     "no": 96,
     "status": "authored",
     "form": "written",
     "topic": "처음 생각과 비교",
     "prompt": "처음 답 중 하나를 골라 지금의 설명과 비교하세요. 기관이 하는 일과 서로 관련된 점, 알게 된 근거와 아직 모르는 점 중 필요한 것을 넣으세요.",
     "answer": "예: 폐만 일하면 된다고 생각했지만 폐가 받은 산소를 혈액이 운반한다는 근거로 여러 기관의 협력이 필요하다고 고쳤다.",
     "explanation": "처음 설명과 지금 설명에서 달라진 점을 찾아 써요. 어떤 기관이 함께 일한다는 자료 때문에 생각을 고쳤는지, 아직 더 궁금한 것은 무엇인지 덧붙여요.",
     "misconception": "맞은 개수만 적고 설명의 근거를 생략하지 않는다.",
     "criteria": "처음/지금 비교1, 과학적 기능/근거1.",
     "previousCriteria": "처음/지금 비교1, 과학적 기능/근거1.",
     "lines": 8,
     "standard": "6과04-02",
     "origin": "previous96"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "자료에서 실제로 고친 문장과 그 까닭을 써요.",
     "value": "95번에서 고칠 문장이나 그림을 정하고 그 까닭을 쓰세요."
    }
   ]
  }
 ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withBodyContextWorkbook(workbook){
 if(workbook?.unit!=='c22-s51-u04'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 const source=new Map(workbook.questions.map(q=>[q.id,q]));let changed=false;
 const questions=workbook.questions.map(q=>{const patch=review.patches.find(p=>p.previous.id===q.id&&same(p.previous,q));if(!patch)return q;changed=true;return{...q,...clone(patch.fields)};});
 const revise=rows=>rows?.map(page=>{const patch=review.directions.find(p=>same(p.previous,page)&&p.questions.every(q=>same(source.get(q.id),q)));if(!patch)return page;changed=true;const next=clone(page);for(const f of patch.fields){let at=next;for(const key of f.path.slice(0,-1))at=at[key];at[f.path.at(-1)]=clone(f.value);}return next;});
 const pages=revise(workbook.pages),teacher=revise(workbook.teacherStudentPages);return changed?{...workbook,questions,pages,...(teacher?{teacherStudentPages:teacher}:{})}:workbook;
}

const bankPatches=[
 {
  "previous": {
   "id": "c22-s51-u04-b004",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 우리 몸 독립 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u04",
    "area": "생명",
    "element": "E7",
    "type": "T14",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과04-03",
    "topic": "자료와 실제 관찰",
    "concept": "관찰 근거·자료 제작·실제 소통과 보완",
    "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
   },
   "prompt": "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요? 까닭을 써 보세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "아니에요. 주어진 표를 읽은 것과 내가 직접 맥박 수를 센 것은 달라요.",
    "rubric": {
     "required": [
      "주어진 표를 읽은 것과 직접 맥박 수를 센 것은 다르다는 까닭을 설명하면 돼요."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s51-u04",
    "id": "body-book-04",
    "no": 4
   },
   "explanation": "제공된 표를 읽은 것과 내가 직접 맥박을 관찰한 것은 달라요. 직접 관찰했다면 날짜와 방법, 실제로 센 횟수를 따로 적어요.",
   "misconception": "정답이나 기록칸 수를 실제 수행으로 바꾸지 않는다.",
   "evidence": {
    "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
    "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
   },
   "contentVersion": "20261115-grade5-question-review",
   "previousVersions": [
    {
     "id": "c22-s51-u04-b004",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E7",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-03",
      "topic": "자료와 실제 관찰",
      "concept": "관찰 근거·자료 제작·실제 소통과 보완",
      "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
     },
     "prompt": "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요?",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "없다. 제공된 표를 해석한 것과 내가 관찰한 것은 다르며 실제 날짜·방법·관찰값이 필요하다.",
      "rubric": {
       "required": [
        "자료/직접 수행 구별1, 실제 관찰 근거1."
       ],
       "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
       "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s51-u04",
      "id": "body-book-04",
      "no": 4
     },
     "explanation": "수치 문제 풀이와 실제 몸의 변화 관찰은 다른 근거다.",
     "misconception": "정답이나 기록칸 수를 실제 수행으로 바꾸지 않는다.",
     "evidence": {
      "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
      "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
     },
     "version": 1
    },
    {
     "id": "c22-s51-u04-b004",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E7",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-03",
      "topic": "자료와 실제 관찰",
      "concept": "관찰 근거·자료 제작·실제 소통과 보완",
      "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
     },
     "prompt": "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요?",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "없다. 제공된 표를 해석한 것과 내가 관찰한 것은 다르며 실제 날짜·방법·관찰값이 필요하다.",
      "rubric": {
       "required": [
        "자료/직접 수행 구별1, 실제 관찰 근거1."
       ],
       "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
       "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s51-u04",
      "id": "body-book-04",
      "no": 4
     },
     "explanation": "제공된 표를 읽은 것과 내가 직접 맥박을 관찰한 것은 달라요. 직접 관찰했다면 날짜와 방법, 실제로 센 횟수를 따로 적어요.",
     "misconception": "정답이나 기록칸 수를 실제 수행으로 바꾸지 않는다.",
     "evidence": {
      "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
      "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
     },
     "contentVersion": "20261106-body-readable-workbook",
     "previousVersions": [
      {
       "id": "c22-s51-u04-b004",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "edition": "GFIELD 우리 몸 독립 창작 학습",
        "course": "초등 5-1"
       },
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 5,
        "semester": 1,
        "unit": "u04",
        "area": "생명",
        "element": "E7",
        "type": "T14",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "standard": "6과04-03",
        "topic": "자료와 실제 관찰",
        "concept": "관찰 근거·자료 제작·실제 소통과 보완",
        "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
       },
       "prompt": "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요?",
       "givens": null,
       "choices": null,
       "responseContract": "written-explanation",
       "answerContract": {
        "type": "written-explanation",
        "sample": "없다. 제공된 표를 해석한 것과 내가 관찰한 것은 다르며 실제 날짜·방법·관찰값이 필요하다.",
        "rubric": {
         "required": [
          "자료/직접 수행 구별1, 실제 관찰 근거1."
         ],
         "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
         "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
        }
       },
       "bookResponseForm": "written",
       "workbookRef": {
        "unit": "c22-s51-u04",
        "id": "body-book-04",
        "no": 4
       },
       "explanation": "수치 문제 풀이와 실제 몸의 변화 관찰은 다른 근거다.",
       "misconception": "정답이나 기록칸 수를 실제 수행으로 바꾸지 않는다.",
       "evidence": {
        "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
        "date": "2026-10-18",
        "gates": [
         "science",
         "answer"
        ],
        "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
        "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
       },
       "version": 1
      }
     ],
     "version": "20261106-body-readable-workbook",
     "snapshotKind": "full-question"
    }
   ]
  },
  "fields": {
   "prompt": "자료에서 “운동 뒤 맥박 수가 늘었다”는 설명을 읽었어요. 이 글을 읽은 것만으로 내가 직접 관찰했다고 할 수 있을까요? 까닭을 쓰세요.",
   "explanation": "자료의 설명을 읽는 것과 직접 맥박을 관찰하는 것은 달라요. 직접 관찰했다면 같은 방법과 시간으로 센 실제 횟수를 따로 남겨요.",
   "answerContract": {
    "type": "written-explanation",
    "sample": "아니에요. 자료의 설명을 읽은 것과 내가 직접 맥박 수를 센 것은 달라요.",
    "rubric": {
     "required": [
      "자료를 읽는 것과 직접 맥박을 관찰하는 것은 다르다는 까닭을 설명하면 인정해요."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u04-b045",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 우리 몸 독립 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u04",
    "area": "생명",
    "element": "E7",
    "type": "T14",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과04-03",
    "topic": "소개 자료",
    "concept": "관찰 근거·자료 제작·실제 소통과 보완",
    "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
   },
   "prompt": "한 기관 관련 질병의 예방법을 알리는 카드 초안을 그리세요. 기관·예방 행동·까닭·출처가 들어갈 곳을 표시하세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "제목과 관련 기관, 실제 조사로 확인한 예방 행동과 까닭, 출처/확인 날짜, 아직 미확인인 부분을 배치한다.",
    "rubric": {
     "required": [
      "관련 기관/질병1, 행동과 까닭1, 출처/미확인 표시1."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   },
   "bookResponseForm": "draw",
   "workbookRef": {
    "unit": "c22-s51-u04",
    "id": "body-book-45",
    "no": 45
   },
   "explanation": "카드에 관련 기관과 예방 행동, 그 행동이 도움이 되는 까닭을 넣어요. 자료를 찾은 곳과 확인 날짜를 적을 자리도 표시해요.",
   "misconception": "그림이나 계획을 실제 제작·공유로 바꾸지 않는다.",
   "evidence": {
    "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
    "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
   },
   "contentVersion": "20261106-body-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u04-b045",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E7",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-03",
      "topic": "소개 자료",
      "concept": "관찰 근거·자료 제작·실제 소통과 보완",
      "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
     },
     "prompt": "한 기관 관련 질병의 예방법을 알리는 카드 초안을 그리세요. 기관·예방 행동·까닭·출처가 들어갈 곳을 표시하세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "제목과 관련 기관, 실제 조사로 확인한 예방 행동과 까닭, 출처/확인 날짜, 아직 미확인인 부분을 배치한다.",
      "rubric": {
       "required": [
        "관련 기관/질병1, 행동과 까닭1, 출처/미확인 표시1."
       ],
       "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
       "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
      }
     },
     "bookResponseForm": "draw",
     "workbookRef": {
      "unit": "c22-s51-u04",
      "id": "body-book-45",
      "no": 45
     },
     "explanation": "읽는 사람이 행동과 근거를 연결할 수 있도록 구성한다. 여러 타당한 배치를 인정한다.",
     "misconception": "그림이나 계획을 실제 제작·공유로 바꾸지 않는다.",
     "evidence": {
      "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
      "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "제목과 관련 기관, 실제 조사로 확인한 예방 행동과 까닭, 출처/확인 날짜, 아직 미확인인 부분을 배치한다.",
    "rubric": {
     "required": [
      "관련 질병과 기관, 예방 행동과 그 까닭, 출처가 들어갈 곳을 표시하면 인정해요. 아직 확인하지 못한 내용을 넣었다면 그 부분을 따로 표시해요."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u04-b048",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 우리 몸 독립 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u04",
    "area": "생명",
    "element": "E4",
    "type": "T08",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과04-02",
    "topic": "원인과 모형",
    "concept": "순환 모형의 대응과 비교 조건",
    "inquirySkill": "순환 모형의 대응과 비교 조건"
   },
   "prompt": "같은 간격으로 끝까지 눌렀다 놓는 펌프에서 1회에 이동하는 물은 같았습니다. 10초 동안 누른 횟수만 늘렸다면 1회 양과 10초 총량을 구별해 설명하세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "1회 양은 같은 조건이고, 같은 10초 동안 누른 횟수가 늘면 그동안 이동한 총량은 늘어난다.",
    "rubric": {
     "required": [
      "1회 양 고정1, 같은 시간 총량 증가1."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s51-u04",
    "id": "body-book-48",
    "no": 48
   },
   "explanation": "한 번에 옮긴 물의 양이 같아도 10초 동안 더 많이 누르면 그동안 옮긴 총량은 늘어요. 모형의 한 번 양과 정한 시간의 총량을 나누어 읽어요.",
   "misconception": "빠르게 누르면 반드시 한 번 양도 늘어난다고 말하지 않는다.",
   "evidence": {
    "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
    "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
   },
   "contentVersion": "20261106-body-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u04-b048",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-02",
      "topic": "원인과 모형",
      "concept": "순환 모형의 대응과 비교 조건",
      "inquirySkill": "순환 모형의 대응과 비교 조건"
     },
     "prompt": "같은 간격으로 끝까지 눌렀다 놓는 펌프에서 1회에 이동하는 물은 같았습니다. 10초 동안 누른 횟수만 늘렸다면 1회 양과 10초 총량을 구별해 설명하세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "1회 양은 같은 조건이고, 같은 10초 동안 누른 횟수가 늘면 그동안 이동한 총량은 늘어난다.",
      "rubric": {
       "required": [
        "1회 양 고정1, 같은 시간 총량 증가1."
       ],
       "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
       "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s51-u04",
      "id": "body-book-48",
      "no": 48
     },
     "explanation": "단위 시간의 횟수와 한 번의 양을 따로 읽는다. 실제 심장의 1회 양까지 이 모형 값으로 정하지 않는다.",
     "misconception": "빠르게 누르면 반드시 한 번 양도 늘어난다고 말하지 않는다.",
     "evidence": {
      "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
      "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "prompt": "펌프를 끝까지 눌렀다 놓을 때마다 이동하는 물의 양은 같았어요. 10초 동안 누르는 횟수만 늘렸다면, 한 번에 이동하는 양과 10초 동안 이동한 전체 양을 구별해 설명하세요."
  }
 },
 {
  "previous": {
   "id": "c22-s51-u04-b050",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 우리 몸 독립 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u04",
    "area": "생명",
    "element": "E1",
    "type": "T02",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과04-01",
    "topic": "모형 설계",
    "concept": "움직임 모형의 대응·작용·한계",
    "inquirySkill": "움직임 모형의 대응·작용·한계"
   },
   "prompt": "실을 당기면 팔꿈치가 굽혀지는 모형을 그리세요. 뼈와 관절을 나타내는 부분, 실을 당기는 방향, 실제 근육과 다른 점을 표시하세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "두 막대와 관절 연결, 당길 줄의 부착점·방향과 굽힘, 모형 줄은 스스로 수축하지 않는다는 한계를 표시한다.",
    "rubric": {
     "required": [
      "뼈/관절 대응1, 당김과 움직임1, 모형 한계/안전1."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   },
   "bookResponseForm": "draw",
   "workbookRef": {
    "unit": "c22-s51-u04",
    "id": "body-book-50",
    "no": 50
   },
   "explanation": "뼈를 나타내는 막대와 관절을 나타내는 연결 부분을 그려요. 어디에 실을 붙여 어느 방향으로 당기면 굽혀질지 표시하고, 실은 실제 근육처럼 스스로 수축하지 않는다고 써요.",
   "misconception": "관절을 움직였다는 것만으로 근육의 작용을 완전히 재현했다고 하지 않는다.",
   "evidence": {
    "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
    "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
   },
   "contentVersion": "20261106-body-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u04-b050",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-01",
      "topic": "모형 설계",
      "concept": "움직임 모형의 대응·작용·한계",
      "inquirySkill": "움직임 모형의 대응·작용·한계"
     },
     "prompt": "당기는 부분을 움직여 팔꿈치가 굽혀지는 모형을 설계하세요. 뼈·관절·당김에 대응하는 부분과 실제 몸과 다른 점을 표시하세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "두 막대와 관절 연결, 당길 줄의 부착점·방향과 굽힘, 모형 줄은 스스로 수축하지 않는다는 한계를 표시한다.",
      "rubric": {
       "required": [
        "뼈/관절 대응1, 당김과 움직임1, 모형 한계/안전1."
       ],
       "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
       "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
      }
     },
     "bookResponseForm": "draw",
     "workbookRef": {
      "unit": "c22-s51-u04",
      "id": "body-book-50",
      "no": 50
     },
     "explanation": "움직임의 목적·대응·작동 확인을 연결하고 교사 준비가 필요한 부분을 표시한다.",
     "misconception": "관절을 움직였다는 것만으로 근육의 작용을 완전히 재현했다고 하지 않는다.",
     "evidence": {
      "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
      "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "두 막대와 관절 연결, 당길 줄의 부착점·방향과 굽힘, 모형 줄은 스스로 수축하지 않는다는 한계를 표시한다.",
    "rubric": {
     "required": [
      "뼈와 관절을 나타내는 부분, 실을 당기는 방향과 굽혀지는 움직임, 실을 사람이 당긴다는 점처럼 실제 근육과 다른 점을 나타내면 인정해요."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u04-b056",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 우리 몸 독립 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u04",
    "area": "생명",
    "element": "E7",
    "type": "T14",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과04-03",
    "topic": "실제 소통",
    "concept": "관찰 근거·자료 제작·실제 소통과 보완",
    "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
   },
   "prompt": "발표 자료를 저장했지만 아직 설명하지 않았습니다. 제작과 전달의 상태를 어떻게 적을까요?",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "자료 제작/저장은 실제로 했고 전달은 미실행으로 적는다. 누구에게 언제 어떤 방법으로 설명할지 계획은 따로 남긴다.",
    "rubric": {
     "required": [
      "제작과 미공유 구별1, 전달 계획 구별1."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s51-u04",
    "id": "body-book-56",
    "no": 56
   },
   "explanation": "자료를 만들어 저장한 것은 했지만 아직 친구에게 설명하지 않았어요. 앞으로 누구에게 언제 어떻게 보여 줄지 따로 계획해요.",
   "misconception": "예정일을 실제 전달일로 바꾸지 않는다.",
   "evidence": {
    "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
    "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
   },
   "contentVersion": "20261106-body-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u04-b056",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E7",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-03",
      "topic": "실제 소통",
      "concept": "관찰 근거·자료 제작·실제 소통과 보완",
      "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
     },
     "prompt": "발표 자료를 저장했지만 아직 설명하지 않았습니다. 제작과 전달의 상태를 어떻게 적을까요?",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "자료 제작/저장은 실제로 했고 전달은 미실행으로 적는다. 누구에게 언제 어떤 방법으로 설명할지 계획은 따로 남긴다.",
      "rubric": {
       "required": [
        "제작과 미공유 구별1, 전달 계획 구별1."
       ],
       "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
       "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s51-u04",
      "id": "body-book-56",
      "no": 56
     },
     "explanation": "저장·실제 설명·받은 의견은 다른 행동이다.",
     "misconception": "예정일을 실제 전달일로 바꾸지 않는다.",
     "evidence": {
      "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
      "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "자료 제작/저장은 실제로 했고 전달은 미실행으로 적는다. 누구에게 언제 어떤 방법으로 설명할지 계획은 따로 남긴다.",
    "rubric": {
     "required": [
      "자료를 만들어 저장한 일은 했지만 아직 친구에게 설명하지 않았다는 두 상태를 구별해 적으면 인정해요. 전달할 계획을 덧붙였다면 실제로 한 일과 구별해요."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s51-u04-b057",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 우리 몸 독립 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u04",
    "area": "생명",
    "element": "E7",
    "type": "T14",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과04-03",
    "topic": "근거의 한계",
    "concept": "관찰 근거·자료 제작·실제 소통과 보완",
    "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
   },
   "prompt": "이 수업에서 관찰한 것만으로는 말하기 어려운 주장을 모두 고르세요.",
   "givens": null,
   "choices": [
    "모형 막을 내렸을 때 풍선이 커졌다고 적는다.",
    "한 번 손씻기를 했으니 앞으로 모든 감염병에 걸리지 않는다고 쓴다.",
    "제공된 연습 표의 값으로 친구의 건강 순위를 정한다.",
    "불분명한 맥박은 다시 확인할 점으로 남긴다."
   ],
   "responseContract": "multi-choice",
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     1,
     2
    ]
   },
   "bookResponseForm": "multi",
   "workbookRef": {
    "unit": "c22-s51-u04",
    "id": "body-book-57",
    "no": 57
   },
   "explanation": "한 번 손을 씻었다고 앞으로 모든 감염병을 막는 것은 아니에요. 연습 표의 값으로 친구의 건강 순위를 정할 수도 없어요. 실제로 관찰한 모습과 아직 알 수 없는 것을 나누어요.",
   "misconception": "올바른 실천도 결과를100% 보장하는 치료로 쓰지 않는다.",
   "evidence": {
    "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
    "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
   },
   "contentVersion": "20261106-body-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u04-b057",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E7",
      "type": "T14",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-03",
      "topic": "근거의 한계",
      "concept": "관찰 근거·자료 제작·실제 소통과 보완",
      "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
     },
     "prompt": "한 번의 수업 관찰보다 지나치게 확대한 주장을 모두 고르세요.",
     "givens": null,
     "choices": [
      "모형 막을 내렸을 때 풍선이 커졌다고 적는다.",
      "한 번 손씻기를 했으니 앞으로 모든 감염병에 걸리지 않는다고 쓴다.",
      "제공된 연습 표의 값으로 친구의 건강 순위를 정한다.",
      "불분명한 맥박은 다시 확인할 점으로 남긴다."
     ],
     "responseContract": "multi-choice",
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       1,
       2
      ]
     },
     "bookResponseForm": "multi",
     "workbookRef": {
      "unit": "c22-s51-u04",
      "id": "body-book-57",
      "no": 57
     },
     "explanation": "예방법 실천과 건강 진단을 한 번의 관찰로 보장하지 못한다.",
     "misconception": "올바른 실천도 결과를100% 보장하는 치료로 쓰지 않는다.",
     "evidence": {
      "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
      "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "prompt": "모형과 연습 자료만으로는 말하기 어려운 주장을 모두 고르세요."
  }
 },
 {
  "previous": {
   "id": "c22-s51-u04-b095",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 우리 몸 독립 창작 학습",
    "course": "초등 5-1"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 1,
    "unit": "u04",
    "area": "생명",
    "element": "E7",
    "type": "T14",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과04-03",
    "topic": "자료 보완",
    "concept": "관찰 근거·자료 제작·실제 소통과 보완",
    "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
   },
   "prompt": "친구가 “어느 기관과 관련된 예방법인지 모르겠어.”라고 했습니다. 소개 자료를 어떻게 고치고 기록할까요?",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "관련 기관/질병 이름과 예방 행동·까닭의 연결을 표시하고, 실제 받은 의견·수정 전후·다시 설명했는지 날짜와 함께 남긴다.",
    "rubric": {
     "required": [
      "기관/행동 연결 보완1, 실제 의견/수정/재전달 구별1."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s51-u04",
    "id": "body-book-95",
    "no": 95
   },
   "explanation": "관련 기관과 질병 이름을 넣고 예방 행동이 왜 도움이 되는지 연결해요. 친구의 질문과 고친 내용을 적고, 다시 설명했다면 그 날짜도 남겨요.",
   "misconception": "받지 않은 의견이나 하지 않은 재설명을 꾸미지 않는다.",
   "evidence": {
    "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
    "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
   },
   "contentVersion": "20261106-body-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s51-u04-b095",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E7",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-03",
      "topic": "자료 보완",
      "concept": "관찰 근거·자료 제작·실제 소통과 보완",
      "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
     },
     "prompt": "친구가 “어느 기관과 관련된 예방법인지 모르겠어.”라고 했습니다. 소개 자료를 어떻게 고치고 기록할까요?",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "관련 기관/질병 이름과 예방 행동·까닭의 연결을 표시하고, 실제 받은 의견·수정 전후·다시 설명했는지 날짜와 함께 남긴다.",
      "rubric": {
       "required": [
        "기관/행동 연결 보완1, 실제 의견/수정/재전달 구별1."
       ],
       "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
       "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s51-u04",
      "id": "body-book-95",
      "no": 95
     },
     "explanation": "의견을 근거로 읽는 사람이 이해할 연결을 보완한다. 재공유 전이면 계획이라고 구분한다.",
     "misconception": "받지 않은 의견이나 하지 않은 재설명을 꾸미지 않는다.",
     "evidence": {
      "checkedBy": "교재96의 목표·응답 계약·독립 은행 선택지 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교재 독립 창작96·교육부6과04·자가교재 본문",
      "note": "열린 단답/그림/서술은 교사 확인. 실제 수행/공식 성적을 정답 수로 확정하지 않는다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "관련 기관/질병 이름과 예방 행동·까닭의 연결을 표시하고, 실제 받은 의견·수정 전후·다시 설명했는지 날짜와 함께 남긴다.",
    "rubric": {
     "required": [
      "친구가 관련 기관과 예방 행동의 관계를 알 수 있도록 고칠 내용을 제안하고, 받은 질문과 고친 내용을 기록하는 방법을 설명하면 인정해요."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
    }
   }
  }
 }
];
const bankCache=new WeakMap();
export function bodyContextItems(rows,unit){
 if(unit!=='c22-s51-u04'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const patch=bankPatches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
 const current={...q,...clone(patch.fields),contentVersion:BODY_CONTEXT_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,current);return current;});return changed?next:rows;
}
export function withBodyContextClassroom(unit,book){
 const rows=bodyContextItems(book?.classroomItems,unit);return rows===book?.classroomItems?book:{...book,classroomItems:rows};
}
