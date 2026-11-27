// Use brief responses for light properties; retain real measuring, comparisons and sharing.
export const LIGHT_MIXED_VERSION='20261124-light-mixed-responses';
const unit='c22-s51-u02',prior='4dde2bd932a87a6b';
const review={
  "4": {
    "prompt": "거울과 카드의 위치를 알려 주었어요. 친구도 같은 곳에서 보려면 무엇의 위치를 더 알려 주어야 할까요?",
    "answer": "눈의 위치",
    "explanation": "눈의 위치도 표시하면 친구가 같은 위치에서 관찰할 수 있어요. 거울·카드·눈의 위치가 달라지면 카드가 보이는 모습도 달라질 수 있어요.",
    "misconception": "거울과 카드뿐 아니라 눈의 위치도 관찰 조건에 포함해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "눈",
        "눈의 위치",
        "눈 위치",
        "관찰자의 눈",
        "관찰자의 눈 위치",
        "관찰자의 눈의 위치"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "c13ce1e99e1ecc57"
  },
  "16": {
    "prompt": "구멍 세 개가 한 줄로 맞을 때 불빛이 통과했어요. 빛이 곧게 나아가는 성질의 이름을 쓰세요.",
    "answer": "직진",
    "explanation": "빛이 곧게 나아가는 성질을 직진이라고 해요. 구멍이 한 줄로 맞지 않으면 불빛이 지나가는 길이 막힐 수 있어요.",
    "misconception": "직진과 거울에서 일어나는 반사를 구별해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "직진",
        "빛의 직진",
        "빛의직진",
        "직진하는 성질"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "692d1200c95f6926"
  },
  "28": {
    "prompt": "빛이 공기에서 물로 들어가며 꺾이는 모습을 관찰하려 해요. 물 표면에 빛을 (1)[ ] 비추어요. 보기: 비스듬히·수직으로",
    "answer": "비스듬히",
    "explanation": "빛이 공기에서 물로 비스듬히 들어가면 경계에서 방향이 달라져요. 경계면에 수직으로 들어갈 때에는 진행 방향이 꺾이지 않아요.",
    "misconception": "물에 들어가기만 하면 언제나 방향이 꺾인다고 생각하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "비스듬히",
            "비스듬하게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "4ad19a072622534d"
  },
  "34": {
    "prompt": "거울로 가림판 뒤의 카드를 보았어요. 빛이 지나는 순서대로 이름을 골라 쓰세요. (1)[ ] → (2)[ ] → (3)[ ]. 보기: 눈·거울·카드",
    "answer": "카드 / 거울 / 눈",
    "explanation": "카드에서 온 빛이 거울에서 반사되어 눈으로 들어와요. 눈에서 빛이 나와 카드를 비추는 것이 아니에요.",
    "misconception": "화살표는 카드에서 거울을 거쳐 눈으로 이어져요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "카드"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "거울",
            "평면거울"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "눈",
            "우리 눈",
            "관찰자의 눈"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "4e9ebb17dc53034d"
  },
  "44": {
    "prompt": "동전과 그릇은 그대로 두고 물을 넣기 전과 후를 비교해요. 눈의 위치도 (1)[ ] 두어요. 보기: 그대로·다르게",
    "answer": "그대로",
    "explanation": "눈·동전·그릇의 위치를 바꾸지 않고 물만 넣어 비교해요. 눈까지 움직이면 무엇 때문에 동전이 보였는지 구별하기 어려워요.",
    "misconception": "물을 넣을 때 눈의 위치까지 바꾸지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "그대로",
            "같게",
            "똑같게",
            "동일하게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "ef6eedd95242b047"
  },
  "48": {
    "prompt": "책을 볼 때 빛이 지나는 순서대로 이름을 골라 쓰세요. (1)[ ] → (2)[ ] → (3)[ ]. 보기: 책·눈·전등",
    "answer": "전등 / 책 / 눈",
    "explanation": "전등에서 나온 빛이 책에서 반사되어 눈으로 들어와요. 눈이 책으로 빛을 보내는 것은 아니에요.",
    "misconception": "전등에서 책을 거쳐 눈으로 가는 방향을 확인해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "전등"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "책"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "눈",
            "우리 눈",
            "관찰자의 눈"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "bd017009c16bef9b"
  },
  "49": {
    "prompt": "달은 스스로 빛을 내지 않아요. 달이 햇빛을 (1)[ ]하기 때문에 밤에 밝게 보여요. 보기: 반사·굴절",
    "answer": "반사",
    "explanation": "달 표면에서 반사된 햇빛이 눈으로 들어와 달이 보여요. 달이 스스로 빛을 내는 것은 아니에요.",
    "misconception": "반사되어 오는 빛과 스스로 내는 빛을 구별해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "반사",
            "반사함",
            "반사하기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "d91f3bea3d28b370"
  },
  "50": {
    "prompt": "한 거울 장치에서 카드가 보였어요. 다른 거울 장치도 카드를 보여 주는지 알아볼 방법을 고르세요.",
    "answer": "③",
    "explanation": "다른 장치도 직접 시험해 카드가 보이는지 확인해요. 처음 장치에서 보였다는 결과만으로 다른 장치의 작동을 정하지 않아요.",
    "misconception": "한 장치의 시험 결과를 다른 장치에도 그대로 적용하지 않아요.",
    "form": "choice",
    "choices": [
      "처음 장치에서만 한 번 더 관찰한다.",
      "두 장치에 쓴 거울의 개수만 센다.",
      "다른 장치로도 카드가 보이는지 시험한다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "0b5f305866fc8e36"
  },
  "51": {
    "prompt": "자료에는 확대경으로 작은 부품을 살핀다고 적혀 있어요. 내가 고른 확대경으로도 잘 보이는지 확인할 방법을 고르세요.",
    "answer": "②",
    "explanation": "실내 조명에서 고른 확대경으로 실제 부품을 살펴보아요. 자료에 나온 쓰임을 읽는 것과 내가 고른 도구를 시험하는 것은 달라요. 태양을 직접 보지 않아요.",
    "misconception": "확대경의 쓰임을 읽었다는 이유만으로 실제 관찰 결과를 정하지 않아요.",
    "form": "choice",
    "choices": [
      "확대경 없이 부품을 눈으로만 살핀다.",
      "실내 조명에서 고른 확대경으로 부품을 살핀다.",
      "자료에 실린 확대경 사진만 자세히 살핀다."
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "7140f1cf1df7cbed"
  },
  "52": {
    "prompt": "친구가 “어디에 눈을 대는지 모르겠어.”라고 했어요. 장치 그림에 더할 표시를 고르세요.",
    "answer": "①",
    "explanation": "친구가 찾지 못한 눈의 위치를 표시해요. 재료의 색이나 만든 날짜만 적으면 어디에 눈을 대야 하는지 알기 어려워요.",
    "misconception": "친구가 어려워한 부분에 맞는 안내를 골라요.",
    "form": "choice",
    "choices": [
      "눈을 댈 곳을 가리키는 표시",
      "재료의 색깔을 적은 이름표",
      "장치를 만든 날짜를 적은 표시"
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "ebde483e2f5fb3dc"
  },
  "66": {
    "prompt": "빛이 공기에서 물로 비스듬히 들어가며 경계에서 방향이 달라졌어요. 이 성질의 이름을 쓰세요.",
    "answer": "굴절",
    "explanation": "빛이 다른 물질로 비스듬히 들어가며 경계에서 방향이 달라지는 현상은 굴절이에요.",
    "misconception": "거울에서 되돌아가는 반사와 물로 들어가며 방향이 달라지는 굴절을 구별해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "굴절",
        "빛의 굴절",
        "빛의굴절",
        "굴절하는 성질"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "f8d1c656c4f30cc0"
  },
  "75": {
    "prompt": "작은 설명 글씨가 잘 보이지 않아 확대경을 이용한 장치를 만들려 해요. 이 장치의 목적을 고르세요.",
    "answer": "③",
    "explanation": "작은 글씨를 더 크게 보려는 목적에 맞춰 확대경을 이용한 장치를 설계해요. 만든 다음 실제로 글씨가 잘 보이는지 시험해요.",
    "misconception": "장치를 만들 목적에 맞는 거울이나 렌즈를 골라요.",
    "form": "choice",
    "choices": [
      "가림판 뒤의 글씨를 보기",
      "거울로 글씨의 좌우를 바꾸어 보기",
      "작은 글씨를 더 크게 보기"
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "5e09061d2cab92ef"
  },
  "76": {
    "prompt": "장치를 만들고 설명 자료도 저장했어요. 친구에게 사용법을 알려 주려면 다음에 무엇을 해야 할까요?",
    "answer": "①",
    "explanation": "친구에게 장치를 보여 주고 사용법을 설명해요. 설명 자료를 고치거나 저장한 것만으로 친구에게 사용법을 알려 준 것은 아니에요.",
    "misconception": "설명 자료를 만드는 과정과 친구에게 실제로 소개하는 과정을 구별해요.",
    "form": "choice",
    "choices": [
      "장치를 보여 주며 사용법을 설명한다.",
      "설명 자료의 제목을 다시 고친다.",
      "자료에 장치 설명을 더 길게 적는다."
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "edec873269ce7e1c"
  },
  "79": {
    "prompt": "물을 넣기 전과 후만 비교해요. 눈·동전·그릇의 위치는 모두 (1)[ ] 두어요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "눈·동전·그릇은 같은 위치에 두고 물만 넣어 비교해요. 다른 위치도 바뀌면 물을 넣은 영향만 알아보기 어려워요.",
    "misconception": "물만 넣는 비교에서는 눈과 물체의 위치를 같게 해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같게",
            "그대로",
            "똑같게",
            "동일하게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "cf233d33e847d3ed"
  }
};
const bankReview={
  "c22-s51-u02-b004": {
    "prompt": "거울과 카드의 위치를 알려 주었어요. 친구도 같은 곳에서 보려면 무엇의 위치를 더 알려 주어야 할까요?",
    "answer": "눈의 위치",
    "explanation": "눈의 위치도 표시하면 친구가 같은 위치에서 관찰할 수 있어요. 거울·카드·눈의 위치가 달라지면 카드가 보이는 모습도 달라질 수 있어요.",
    "misconception": "거울과 카드뿐 아니라 눈의 위치도 관찰 조건에 포함해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "눈",
        "눈의 위치",
        "눈 위치",
        "관찰자의 눈",
        "관찰자의 눈 위치",
        "관찰자의 눈의 위치"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "9fd25b71ea17fcff"
    ]
  },
  "c22-s51-u02-b016": {
    "prompt": "구멍 세 개가 한 줄로 맞을 때 불빛이 통과했어요. 빛이 곧게 나아가는 성질의 이름을 쓰세요.",
    "answer": "직진",
    "explanation": "빛이 곧게 나아가는 성질을 직진이라고 해요. 구멍이 한 줄로 맞지 않으면 불빛이 지나가는 길이 막힐 수 있어요.",
    "misconception": "직진과 거울에서 일어나는 반사를 구별해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "직진",
        "빛의 직진",
        "빛의직진",
        "직진하는 성질"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "bbcfda48e8ce013a"
    ]
  },
  "c22-s51-u02-b028": {
    "prompt": "빛이 공기에서 물로 들어가며 꺾이는 모습을 관찰하려 해요. 물 표면에 빛을 (1)[ ] 비추어요. 보기: 비스듬히·수직으로",
    "answer": "비스듬히",
    "explanation": "빛이 공기에서 물로 비스듬히 들어가면 경계에서 방향이 달라져요. 경계면에 수직으로 들어갈 때에는 진행 방향이 꺾이지 않아요.",
    "misconception": "물에 들어가기만 하면 언제나 방향이 꺾인다고 생각하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "비스듬히",
            "비스듬하게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "8ba43f095f7f9757"
    ]
  },
  "c22-s51-u02-b034": {
    "prompt": "거울로 가림판 뒤의 카드를 보았어요. 빛이 지나는 순서대로 이름을 골라 쓰세요. (1)[ ] → (2)[ ] → (3)[ ]. 보기: 눈·거울·카드",
    "answer": "카드 / 거울 / 눈",
    "explanation": "카드에서 온 빛이 거울에서 반사되어 눈으로 들어와요. 눈에서 빛이 나와 카드를 비추는 것이 아니에요.",
    "misconception": "화살표는 카드에서 거울을 거쳐 눈으로 이어져요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "카드"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "거울",
            "평면거울"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "눈",
            "우리 눈",
            "관찰자의 눈"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "89cd7613428ee4e1"
    ]
  },
  "c22-s51-u02-b044": {
    "prompt": "동전과 그릇은 그대로 두고 물을 넣기 전과 후를 비교해요. 눈의 위치도 (1)[ ] 두어요. 보기: 그대로·다르게",
    "answer": "그대로",
    "explanation": "눈·동전·그릇의 위치를 바꾸지 않고 물만 넣어 비교해요. 눈까지 움직이면 무엇 때문에 동전이 보였는지 구별하기 어려워요.",
    "misconception": "물을 넣을 때 눈의 위치까지 바꾸지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "그대로",
            "같게",
            "똑같게",
            "동일하게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "980a8ee6f9b580ec"
    ]
  },
  "c22-s51-u02-b048": {
    "prompt": "책을 볼 때 빛이 지나는 순서대로 이름을 골라 쓰세요. (1)[ ] → (2)[ ] → (3)[ ]. 보기: 책·눈·전등",
    "answer": "전등 / 책 / 눈",
    "explanation": "전등에서 나온 빛이 책에서 반사되어 눈으로 들어와요. 눈이 책으로 빛을 보내는 것은 아니에요.",
    "misconception": "전등에서 책을 거쳐 눈으로 가는 방향을 확인해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "전등"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "책"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "눈",
            "우리 눈",
            "관찰자의 눈"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "88fb388ae8a2ab34"
    ]
  },
  "c22-s51-u02-b049": {
    "prompt": "달은 스스로 빛을 내지 않아요. 달이 햇빛을 (1)[ ]하기 때문에 밤에 밝게 보여요. 보기: 반사·굴절",
    "answer": "반사",
    "explanation": "달 표면에서 반사된 햇빛이 눈으로 들어와 달이 보여요. 달이 스스로 빛을 내는 것은 아니에요.",
    "misconception": "반사되어 오는 빛과 스스로 내는 빛을 구별해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "반사",
            "반사함",
            "반사하기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "e55492f7177289b1"
    ]
  },
  "c22-s51-u02-b050": {
    "prompt": "한 거울 장치에서 카드가 보였어요. 다른 거울 장치도 카드를 보여 주는지 알아볼 방법을 고르세요.",
    "answer": "③",
    "explanation": "다른 장치도 직접 시험해 카드가 보이는지 확인해요. 처음 장치에서 보였다는 결과만으로 다른 장치의 작동을 정하지 않아요.",
    "misconception": "한 장치의 시험 결과를 다른 장치에도 그대로 적용하지 않아요.",
    "form": "choice",
    "choices": [
      "처음 장치에서만 한 번 더 관찰한다.",
      "두 장치에 쓴 거울의 개수만 센다.",
      "다른 장치로도 카드가 보이는지 시험한다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "a6cede5ca694456a"
    ]
  },
  "c22-s51-u02-b051": {
    "prompt": "자료에는 확대경으로 작은 부품을 살핀다고 적혀 있어요. 내가 고른 확대경으로도 잘 보이는지 확인할 방법을 고르세요.",
    "answer": "②",
    "explanation": "실내 조명에서 고른 확대경으로 실제 부품을 살펴보아요. 자료에 나온 쓰임을 읽는 것과 내가 고른 도구를 시험하는 것은 달라요. 태양을 직접 보지 않아요.",
    "misconception": "확대경의 쓰임을 읽었다는 이유만으로 실제 관찰 결과를 정하지 않아요.",
    "form": "choice",
    "choices": [
      "확대경 없이 부품을 눈으로만 살핀다.",
      "실내 조명에서 고른 확대경으로 부품을 살핀다.",
      "자료에 실린 확대경 사진만 자세히 살핀다."
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "4c12d592c63720c4"
    ]
  },
  "c22-s51-u02-b052": {
    "prompt": "친구가 “어디에 눈을 대는지 모르겠어.”라고 했어요. 장치 그림에 더할 표시를 고르세요.",
    "answer": "①",
    "explanation": "친구가 찾지 못한 눈의 위치를 표시해요. 재료의 색이나 만든 날짜만 적으면 어디에 눈을 대야 하는지 알기 어려워요.",
    "misconception": "친구가 어려워한 부분에 맞는 안내를 골라요.",
    "form": "choice",
    "choices": [
      "눈을 댈 곳을 가리키는 표시",
      "재료의 색깔을 적은 이름표",
      "장치를 만든 날짜를 적은 표시"
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "4e7887eca38d6e12"
    ]
  },
  "c22-s51-u02-b066": {
    "prompt": "빛이 공기에서 물로 비스듬히 들어가며 경계에서 방향이 달라졌어요. 이 성질의 이름을 쓰세요.",
    "answer": "굴절",
    "explanation": "빛이 다른 물질로 비스듬히 들어가며 경계에서 방향이 달라지는 현상은 굴절이에요.",
    "misconception": "거울에서 되돌아가는 반사와 물로 들어가며 방향이 달라지는 굴절을 구별해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "굴절",
        "빛의 굴절",
        "빛의굴절",
        "굴절하는 성질"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "324d9c8074269b96"
    ]
  },
  "c22-s51-u02-b075": {
    "prompt": "작은 설명 글씨가 잘 보이지 않아 확대경을 이용한 장치를 만들려 해요. 이 장치의 목적을 고르세요.",
    "answer": "③",
    "explanation": "작은 글씨를 더 크게 보려는 목적에 맞춰 확대경을 이용한 장치를 설계해요. 만든 다음 실제로 글씨가 잘 보이는지 시험해요.",
    "misconception": "장치를 만들 목적에 맞는 거울이나 렌즈를 골라요.",
    "form": "choice",
    "choices": [
      "가림판 뒤의 글씨를 보기",
      "거울로 글씨의 좌우를 바꾸어 보기",
      "작은 글씨를 더 크게 보기"
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "342a62dadd4e293c"
    ]
  },
  "c22-s51-u02-b076": {
    "prompt": "장치를 만들고 설명 자료도 저장했어요. 친구에게 사용법을 알려 주려면 다음에 무엇을 해야 할까요?",
    "answer": "①",
    "explanation": "친구에게 장치를 보여 주고 사용법을 설명해요. 설명 자료를 고치거나 저장한 것만으로 친구에게 사용법을 알려 준 것은 아니에요.",
    "misconception": "설명 자료를 만드는 과정과 친구에게 실제로 소개하는 과정을 구별해요.",
    "form": "choice",
    "choices": [
      "장치를 보여 주며 사용법을 설명한다.",
      "설명 자료의 제목을 다시 고친다.",
      "자료에 장치 설명을 더 길게 적는다."
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "3a64c2f3b34cb9e1"
    ]
  },
  "c22-s51-u02-b079": {
    "prompt": "물을 넣기 전과 후만 비교해요. 눈·동전·그릇의 위치는 모두 (1)[ ] 두어요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "눈·동전·그릇은 같은 위치에 두고 물만 넣어 비교해요. 다른 위치도 바뀌면 물을 넣은 영향만 알아보기 어려워요.",
    "misconception": "물만 넣는 비교에서는 눈과 물체의 위치를 같게 해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같게",
            "그대로",
            "똑같게",
            "동일하게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "b4ee9c8dab652f07"
    ]
  }
};
const questionTitles={};
const studyMethodBefore="먼저 알고 있는 것을 떠올린 뒤 관찰하고 문제를 풀어요. 장치는 설계하고 만든 다음 시험하며, 친구에게 작동 방법을 설명해 보아요.";
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function lightMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:LIGHT_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:LIGHT_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),lightMixedResponse:LIGHT_MIXED_VERSION,contentVersion:LIGHT_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withLightMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=lightMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withLightMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),lightMixedResponse:LIGHT_MIXED_VERSION,contentVersion:LIGHT_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(e.form){result.bookResponseForm=e.form;result.formLabel=e.form==='short'?'짧게 쓰기':labels[e.form];delete result.lines;}return result;});
 const revisePage=p=>{const first=p.blocks.flatMap(b=>b.ids||[])[0],n=Number(first?.slice(-3));return{...p,title:questionTitles[n]||p.title,blocks:p.blocks.map(b=>b.type==='text'&&b.text===studyMethodBefore?{...b,text:'빛의 길을 관찰하고 고르기·빈칸·짧은 답으로 확인해요. 관찰한 까닭과 내 장치의 생각은 짧게 설명해요. 거울과 렌즈의 쓰임을 조사하고 장치를 만들어 시험한 뒤 친구에게 소개해요.'}:b)};};
 const pages=w.pages.map(revisePage),teacherStudentPages=w.teacherStudentPages.map(revisePage),teacherPages=w.teacherPages;
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.form==='written'?'교사 확인':q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,teacherPages,figures};books.set(w,result);return result;
}
