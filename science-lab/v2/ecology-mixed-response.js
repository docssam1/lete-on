// Current ecology checks use mixed responses; original and paired banks remain intact.
export const ECOLOGY_MIXED_VERSION='20261124-ecology-mixed-responses';
const unit='c22-s42-u02',prior='3d7e1f21f5c6ceb7';
const review={
  "8": {
    "prompt": "갈대가 생산자인 까닭을 한 문장으로 써 보세요.",
    "form": "written",
    "answer": "갈대는 햇빛을 이용해 양분을 스스로 만들기 때문에 생산자예요.",
    "explanation": "갈대는 다른 생물을 먹지 않고 햇빛을 이용해 양분을 스스로 만들어요. 그래서 생산자라고 해요.",
    "required": [
      "햇빛을 이용해 양분을 스스로 만든다는 까닭"
    ],
    "contract": {
      "kind": "written-explanation",
      "sample": "갈대는 햇빛을 이용해 양분을 스스로 만들기 때문에 생산자예요.",
      "required": [
        "햇빛을 이용해 양분을 스스로 만든다는 까닭"
      ],
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "햇빛을 이용해 양분을 스스로 만드는 방법과 연결해요.",
    "before": "39a7d3e32957b75d"
  },
  "17": {
    "prompt": "화단의 식물과 햇빛의 관계를 알아보려고 해요. 함께 살펴볼 것을 고르세요.",
    "form": "choice",
    "choices": [
      "식물 이름표의 색",
      "햇빛이 드는 정도와 식물이 자라는 모습",
      "화분을 만든 회사 이름"
    ],
    "key": 1,
    "answer": "②",
    "explanation": "햇빛은 식물이 양분을 만드는 데 필요해요. 식물과 햇빛이 드는 정도를 함께 살펴볼 수 있어요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "식물의 생활과 햇빛의 관계를 살펴요.",
    "before": "ce52e8cfe287e161"
  },
  "18": {
    "prompt": "버섯은 살아 있는 (1)[ ] 요소예요. 바위는 살아 있지 않은 (2)[ ] 요소예요. 보기: 비생물·생물",
    "form": "blank",
    "answer": "생물 · 비생물",
    "explanation": "버섯은 스스로 걸어 다니지 않아도 살아 있는 생물 요소예요. 바위는 살아 있지 않은 비생물 요소예요.",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "생물"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "비생물"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "움직이는지만으로 생물과 비생물을 나누지 않아요.",
    "before": "dd5e2f82deff22cc"
  },
  "19": {
    "prompt": "토끼는 풀을 먹어 양분을 얻는 (1)[ ]예요. 자료의 곰팡이는 죽은 나무의 물질을 분해해 양분을 얻는 (2)[ ]예요.",
    "form": "blank",
    "answer": "소비자 · 분해자",
    "explanation": "토끼는 다른 생물인 풀을 먹는 소비자예요. 자료의 곰팡이는 죽은 나무의 물질을 분해하는 분해자예요.",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "소비자"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "분해자"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "양분을 얻는 방법과 소비자·분해자를 연결해요.",
    "before": "e445c8eaa4f41c4c"
  },
  "38": {
    "prompt": "친구의 화살표를 바르게 고친 것을 고르세요.",
    "form": "choice",
    "choices": [
      "개구리 → 메뚜기",
      "메뚜기 ↔ 개구리",
      "메뚜기 → 개구리"
    ],
    "key": 2,
    "answer": "③",
    "explanation": "개구리가 메뚜기를 먹어요. 먹히는 메뚜기에서 먹는 개구리로 화살표를 그려요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "먹히는 생물에서 먹는 생물로 화살표를 그려요.",
    "before": "9c3862e799861225"
  },
  "39": {
    "prompt": "자료에서 개구리가 줄어도 뱀이 먹이를 구하는 데 도움이 되는 점을 한 가지만 쓰세요.",
    "form": "written",
    "answer": "뱀은 작은 새도 먹을 수 있어요.",
    "explanation": "먹이그물에는 작은 새에서 뱀으로 향하는 화살표도 있어요. 다른 먹이가 있으면 도움이 될 수 있지만, 뱀의 생존을 언제나 보장하는 것은 아니에요.",
    "required": [
      "작은 새도 뱀의 먹이가 된다는 설명"
    ],
    "contract": {
      "kind": "written-explanation",
      "sample": "뱀은 작은 새도 먹을 수 있어요.",
      "required": [
        "작은 새도 뱀의 먹이가 된다는 설명"
      ],
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "뱀에게 이어지는 다른 먹이 화살표를 찾아요.",
    "before": "b23360beaad491d0"
  },
  "65": {
    "prompt": "학교 풀밭의 일부에 주차장을 만들려고 해요. 곤충이 살아갈 곳을 지키는 방법을 한 가지만 쓰세요.",
    "form": "written",
    "answer": "풀밭을 일부 남겨 두어요.",
    "explanation": "풀밭 일부를 남기거나 주차장 위치를 바꾸면 곤충이 먹이를 얻고 몸을 숨길 곳을 지키는 데 도움이 돼요.",
    "required": [
      "곤충이 살아갈 곳을 지키는 타당한 방법 한 가지"
    ],
    "contract": {
      "kind": "written-explanation",
      "sample": "풀밭을 일부 남겨 두어요.",
      "required": [
        "곤충이 살아갈 곳을 지키는 타당한 방법 한 가지"
      ],
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "곤충이 먹이를 얻거나 몸을 숨길 곳을 생각해요.",
    "before": "2342af8be806c795"
  },
  "66": {
    "prompt": "일회용 컵 대신 물병을 쓰려고 해요. 잊지 않고 챙길 방법을 한 가지만 쓰세요.",
    "form": "written",
    "answer": "전날 저녁에 물병을 씻어 가방에 넣어 두어요.",
    "explanation": "물병을 씻어 가방에 넣거나 챙길 물건 목록을 붙이는 등 내가 할 수 있는 준비 방법을 정해요. 계획한 일과 실제로 한 일은 구별해요.",
    "required": [
      "물병을 잊지 않고 챙길 수 있는 방법 한 가지"
    ],
    "contract": {
      "kind": "written-explanation",
      "sample": "전날 저녁에 물병을 씻어 가방에 넣어 두어요.",
      "required": [
        "물병을 잊지 않고 챙길 수 있는 방법 한 가지"
      ],
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "내가 할 수 있는 준비 방법을 정해요.",
    "before": "c0965bae66f9486c"
  }
};
const bankReview={
  "c22-s42-u02-b05": {
    "prompt": "화단의 식물과 햇빛의 관계를 알아보려고 해요. 함께 살펴볼 것을 고르세요.",
    "form": "choice",
    "choices": [
      "식물 이름표의 색",
      "햇빛이 드는 정도와 식물이 자라는 모습",
      "화분을 만든 회사 이름"
    ],
    "key": 1,
    "answer": "②",
    "explanation": "햇빛은 식물이 양분을 만드는 데 필요해요. 식물과 햇빛이 드는 정도를 함께 살펴볼 수 있어요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "식물의 생활과 햇빛의 관계를 살펴요.",
    "before": [
      "68150cdf13758c9d"
    ]
  },
  "c22-s42-u02-b10": {
    "prompt": "버섯은 살아 있는 (1)[ ] 요소예요. 바위는 살아 있지 않은 (2)[ ] 요소예요. 보기: 비생물·생물",
    "form": "blank",
    "answer": "생물 · 비생물",
    "explanation": "버섯은 스스로 걸어 다니지 않아도 살아 있는 생물 요소예요. 바위는 살아 있지 않은 비생물 요소예요.",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "생물"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "비생물"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "움직이는지만으로 생물과 비생물을 나누지 않아요.",
    "before": [
      "8f35e396fc16f44c"
    ]
  },
  "c22-s42-u02-b20": {
    "prompt": "토끼는 풀을 먹어 양분을 얻는 (1)[ ]예요. 자료의 곰팡이는 죽은 나무의 물질을 분해해 양분을 얻는 (2)[ ]예요.",
    "form": "blank",
    "answer": "소비자 · 분해자",
    "explanation": "토끼는 다른 생물인 풀을 먹는 소비자예요. 자료의 곰팡이는 죽은 나무의 물질을 분해하는 분해자예요.",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "소비자"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "분해자"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "양분을 얻는 방법과 소비자·분해자를 연결해요.",
    "before": [
      "6b372a870ac5f469"
    ]
  },
  "c22-s42-u02-b25": {
    "prompt": "친구의 화살표를 바르게 고친 것을 고르세요.",
    "form": "choice",
    "choices": [
      "개구리 → 메뚜기",
      "메뚜기 ↔ 개구리",
      "메뚜기 → 개구리"
    ],
    "key": 2,
    "answer": "③",
    "explanation": "개구리가 메뚜기를 먹어요. 먹히는 메뚜기에서 먹는 개구리로 화살표를 그려요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "먹히는 생물에서 먹는 생물로 화살표를 그려요.",
    "before": [
      "590b50f0485ef712"
    ]
  },
  "c22-s42-u02-b35": {
    "prompt": "자료에서 개구리가 줄어도 뱀이 먹이를 구하는 데 도움이 되는 점을 한 가지만 쓰세요.",
    "form": "written",
    "answer": "뱀은 작은 새도 먹을 수 있어요.",
    "explanation": "먹이그물에는 작은 새에서 뱀으로 향하는 화살표도 있어요. 다른 먹이가 있으면 도움이 될 수 있지만, 뱀의 생존을 언제나 보장하는 것은 아니에요.",
    "required": [
      "작은 새도 뱀의 먹이가 된다는 설명"
    ],
    "contract": {
      "kind": "written-explanation",
      "sample": "뱀은 작은 새도 먹을 수 있어요.",
      "required": [
        "작은 새도 뱀의 먹이가 된다는 설명"
      ],
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "뱀에게 이어지는 다른 먹이 화살표를 찾아요.",
    "before": [
      "662c1cf1f68a3203"
    ]
  },
  "c22-s42-u02-b45": {
    "prompt": "학교 풀밭의 일부에 주차장을 만들려고 해요. 곤충이 살아갈 곳을 지키는 방법을 한 가지만 쓰세요.",
    "form": "written",
    "answer": "풀밭을 일부 남겨 두어요.",
    "explanation": "풀밭 일부를 남기거나 주차장 위치를 바꾸면 곤충이 먹이를 얻고 몸을 숨길 곳을 지키는 데 도움이 돼요.",
    "required": [
      "곤충이 살아갈 곳을 지키는 타당한 방법 한 가지"
    ],
    "contract": {
      "kind": "written-explanation",
      "sample": "풀밭을 일부 남겨 두어요.",
      "required": [
        "곤충이 살아갈 곳을 지키는 타당한 방법 한 가지"
      ],
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "곤충이 먹이를 얻거나 몸을 숨길 곳을 생각해요.",
    "before": [
      "3f36a11b5fc29d09"
    ]
  },
  "c22-s42-u02-b65": {
    "prompt": "일회용 컵 대신 물병을 쓰려고 해요. 잊지 않고 챙길 방법을 한 가지만 쓰세요.",
    "form": "written",
    "answer": "전날 저녁에 물병을 씻어 가방에 넣어 두어요.",
    "explanation": "물병을 씻어 가방에 넣거나 챙길 물건 목록을 붙이는 등 내가 할 수 있는 준비 방법을 정해요. 계획한 일과 실제로 한 일은 구별해요.",
    "required": [
      "물병을 잊지 않고 챙길 수 있는 방법 한 가지"
    ],
    "contract": {
      "kind": "written-explanation",
      "sample": "전날 저녁에 물병을 씻어 가방에 넣어 두어요.",
      "required": [
        "물병을 잊지 않고 챙길 수 있는 방법 한 가지"
      ],
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "내가 할 수 있는 준비 방법을 정해요.",
    "before": [
      "ba9656de11e56484"
    ]
  },
  "c22-s42-u02-b15": {
    "prompt": "풀 → 토끼 → 여우의 먹이 모형이에요. 풀이 줄면 여우도 영향을 받을 수 있는 까닭을 짧게 쓰세요.",
    "form": "written",
    "answer": "여우의 먹이인 토끼가 먹이를 구하기 어려워질 수 있어요.",
    "explanation": "이 모형에서 토끼는 풀을 먹고 여우는 토끼를 먹어요. 한 생물의 먹이 변화가 이어진 다른 생물에게도 영향을 줄 수 있어요.",
    "required": [
      "토끼의 먹이 감소가 여우의 먹이에도 영향을 줄 수 있다는 설명"
    ],
    "contract": {
      "kind": "written-explanation",
      "sample": "여우의 먹이인 토끼가 먹이를 구하기 어려워질 수 있어요.",
      "required": [
        "토끼의 먹이 감소가 여우의 먹이에도 영향을 줄 수 있다는 설명"
      ],
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "토끼가 먹는 풀과 여우가 먹는 토끼의 관계를 이어 생각해요.",
    "before": [
      "17efe0fc41ac89a2"
    ]
  },
  "c22-s42-u02-b30": {
    "prompt": "두 먹이 사슬을 하나의 먹이그물로 나타낼 때 알맞은 방법을 고르세요.",
    "form": "choice",
    "choices": [
      "두 사슬에 없는 토끼 → 들쥐의 관계를 새로 넣는다.",
      "공통으로 나오는 풀과 여우를 각각 하나씩 놓고 두 경로를 모두 잇는다.",
      "먹이에서 먹는 동물로 향한 화살표를 모두 거꾸로 바꾼다."
    ],
    "key": 1,
    "answer": "②",
    "explanation": "풀과 여우는 각각 하나씩 나타내고, 풀 → 토끼 → 여우와 풀 → 들쥐 → 여우의 두 경로를 모두 연결해요.",
    "required": [
      "공통 생물과 두 먹이 경로를 함께 나타내는 방법 고르기"
    ],
    "misconception": "공통으로 나오는 생물과 두 먹이 경로를 모두 살펴요.",
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "e65c340d3ef8136b"
    ]
  },
  "c22-s42-u02-b40": {
    "prompt": "먹이그물 모형이 조사 기록과 달라요. 먼저 할 일을 고르세요.",
    "form": "choice",
    "choices": [
      "조사 기록에서 먹고 먹히는 관계를 다시 확인한다.",
      "화살표가 모두 같은 쪽을 향하도록 바꾼다.",
      "기록을 보지 않고 모양이 복잡해지도록 선을 늘린다."
    ],
    "key": 0,
    "answer": "①",
    "explanation": "조사 기록에서 먹고 먹히는 관계를 확인한 뒤, 그 관계에 맞게 빠진 화살표나 방향을 고쳐요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "조사 기록의 관계를 먼저 확인해요.",
    "before": [
      "0d71943e49fd5144"
    ]
  },
  "c22-s42-u02-b50": {
    "prompt": "학교 앞에서 차가 멈춘 채 시동을 오래 켜 두는 일을 줄이려고 해요. 알맞은 행동을 고르세요.",
    "form": "choice",
    "choices": [
      "차 뒤의 연기에 가까이 가서 살핀다.",
      "보호자에게 기다리는 동안 불필요한 시동을 꺼 달라고 안내한다.",
      "학교 앞에 멈추는 차를 더 많이 모은다."
    ],
    "key": 1,
    "answer": "②",
    "explanation": "차가 멈춘 채 시동을 켜 두는 일을 공회전이라고 해요. 불필요한 공회전을 줄이면 배기가스를 줄이는 데 도움이 돼요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "불필요한 공회전과 배기가스를 줄이는 행동을 연결해요.",
    "before": [
      "98f03106e31b0828"
    ]
  },
  "c22-s42-u02-b55": {
    "prompt": "빗물에 쓸려 하천으로 들어가는 쓰레기를 줄이는 방법을 고르세요.",
    "form": "choice",
    "choices": [
      "쓰레기를 잘게 찢어 빗물에 흘려보낸다.",
      "쓰레기를 배수구 덮개 아래로 밀어 넣는다.",
      "쓰레기를 정해진 쓰레기통에 넣는다."
    ],
    "key": 2,
    "answer": "③",
    "explanation": "쓰레기가 빗물을 따라 흘러가지 않도록 정해진 쓰레기통에 넣어요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "쓰레기를 작게 만들거나 숨겨도 없어진 것은 아니에요.",
    "before": [
      "9eb332d74922383d"
    ]
  },
  "c22-s42-u02-b60": {
    "prompt": "학교 숲을 지나는 길을 내려 해요. 생물이 사는 곳을 지키려면 먼저 무엇을 조사할까요?",
    "form": "choice",
    "choices": [
      "숲에서 생물이 사는 곳과 오가는 길",
      "길 이름표를 칠할 색",
      "안내판을 꾸밀 글씨 모양"
    ],
    "key": 0,
    "answer": "①",
    "explanation": "생물이 사는 곳과 이동하는 길을 조사한 뒤 그곳이 덜 망가지도록 길을 정해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "길을 꾸미기 전에 생물이 살아갈 곳을 살펴요.",
    "before": [
      "693b28f3ba6ed371"
    ]
  },
  "c22-s42-u02-b70": {
    "prompt": "우리 반에서 물병을 다시 쓰려고 해요. 학생과 가정이 함께 준비하는 방법으로 알맞은 것을 고르세요.",
    "form": "choice",
    "choices": [
      "물병을 새로 사야만 참여하게 한다.",
      "집에서 준비할 수 있는 물병을 씻어 챙기고, 준비가 어려우면 선생님과 방법을 찾는다.",
      "물병을 써도 일회용 컵을 매일 함께 버린다."
    ],
    "key": 1,
    "answer": "②",
    "explanation": "집에 있는 물병을 씻어 챙길 수 있어요. 준비하기 어려운 경우에는 함께 쓸 수 있는 방법을 찾아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "새 물건을 사는 것과 있는 물건을 다시 쓰는 것을 구별해요.",
    "before": [
      "10c38401896746df"
    ]
  },
  "c22-s42-u02-b75": {
    "prompt": "우리 반이 직접 한 생태계 보전 활동을 소개하려고 해요. 알맞은 기록을 고르세요.",
    "form": "choice",
    "choices": [
      "다음 주에 물병을 챙기겠다는 계획",
      "다른 학교가 쓰레기를 줍는 모습을 담은 사진",
      "우리 반이 지난 금요일 화단의 쓰레기를 주운 기록"
    ],
    "key": 2,
    "answer": "③",
    "explanation": "직접 한 활동을 소개할 때에는 우리 반이 실제로 한 일을 찾아요. 앞으로 할 계획이나 다른 사람의 활동과 구별해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "앞으로 할 계획과 직접 한 일을 구별해요.",
    "before": [
      "f4d6edb8bd97971e"
    ]
  },
  "c22-s42-u02-b80": {
    "prompt": "친구가 보전 활동 계획을 보고 “장소가 어디인지 모르겠어”라고 했어요. 계획을 어떻게 고치면 좋을까요?",
    "form": "choice",
    "choices": [
      "꾸미는 그림의 색만 더 늘린다.",
      "활동할 장소를 찾아 계획에 적는다.",
      "친구가 한 말을 지우고 같은 계획을 다시 낸다."
    ],
    "key": 1,
    "answer": "②",
    "explanation": "친구의 의견에서 빠진 내용을 찾고, 활동할 장소를 정해 계획에 넣어요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "친구가 알려 준 빠진 내용을 계획에 넣어요.",
    "before": [
      "583cf6c0c858c466"
    ]
  },
  "c22-s42-u02-t12": {
    "prompt": "이 모형에서 여우가 사라진 뒤 풀이 줄어든 까닭을 토끼의 변화와 연결해 한 문장으로 쓰세요.",
    "form": "written",
    "answer": "토끼가 늘어나 풀을 더 많이 먹었기 때문이에요.",
    "explanation": "이 모형에서는 토끼가12마리에서28마리로 늘고 풀은60포기에서28포기로 줄었어요. 정해 둔 먹이 관계로 풀이 줄어든 까닭을 설명해요. 실제 생태계의 미래를 그대로 예측한 값은 아니에요.",
    "required": [
      "모형에서 토끼가 늘어 풀을 더 많이 먹었다는 설명"
    ],
    "contract": {
      "kind": "written-explanation",
      "sample": "토끼가 늘어나 풀을 더 많이 먹었기 때문이에요.",
      "required": [
        "모형에서 토끼가 늘어 풀을 더 많이 먹었다는 설명"
      ],
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true
    },
    "misconception": "모형에 나타난 토끼와 풀의 변화를 연결해요.",
    "before": [
      "f7c6469377275e39"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'짧게 설명하기',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='written'?'written-explanation':e.form==='choice'?'single-choice':'short-text',...(e.form==='written'?{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 타당한 다른 방법도 교사가 확인해요.'}}:e.form==='choice'?{answer:e.key,accepted:[e.key]}:{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}),seasonContract:c};}
export function ecologyMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||!['authored-supplement','authored-lesson'].includes(q.sourceRef?.type)||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:ECOLOGY_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null},ecologyMixedResponse:ECOLOGY_MIXED_VERSION,contentVersion:ECOLOGY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withEcologyMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=ecologyMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withEcologyMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,form:e.form,formLabel:labels[e.form],bookResponseForm:e.form,choices:e.choices?clone(e.choices):null,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),ecologyMixedResponse:ECOLOGY_MIXED_VERSION,contentVersion:ECOLOGY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};delete result.parts;delete result.answerPerPart;if(e.form==='written')result.lines=1;else delete result.lines;if(Object.hasOwn(e,'key'))result.key=e.key;
 if(q.sourceRef?.type==='authored-supplement'){result.sourceContract=answerContract(e);result.sourceExplanation=e.explanation;}
 return result;});
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const e=review[Number(row[0])];return e&&!e.contract.teacherRequired?[row[0],labels[e.form]+row[1].slice(row[1].indexOf(' · ')),e.answer]:row;})})}));
 const result={...w,questions,quickPages};books.set(w,result);return result;
}
