// Use brief responses for solution properties; retain real measuring, comparisons and sharing.
export const SOLUTION_MIXED_VERSION='20261124-solution-mixed-responses';
const unit='c22-s51-u03',prior='7b2ae6700a8e6b12';
const review={
  "4": {
    "prompt": "물의 온도에 따라 설탕이 녹는 양을 비교해요. 물의 양은 같게 하고 물의 (1)[ ]만 다르게 해요. 보기: 온도·색깔",
    "answer": "온도",
    "explanation": "같은 설탕과 같은 양의 물을 쓰고 물의 온도만 다르게 해요. 같은 방법으로 충분히 저어 녹을 수 있는 양을 살펴요.",
    "misconception": "물의 양과 온도를 함께 바꾸지 않도록 살펴요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "온도",
            "물의 온도",
            "물의온도"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "a7d24952e772a110"
  },
  "28": {
    "prompt": "따뜻한 물에 녹아 있던 백반을 식히자 고체가 보였어요. 이 고체는 어디에 있던 백반일까요?",
    "answer": "③",
    "explanation": "물에 녹아 있던 백반 일부가 식으면서 다시 고체로 나온 거예요. 눈에 보이지 않았을 때에도 물속에 녹아 있었어요.",
    "misconception": "새로 생긴 물질이나 얼음이 아니라 녹아 있던 백반임을 짚어요.",
    "form": "choice",
    "choices": [
      "공기에서 새로 생긴 백반",
      "컵이 백반으로 바뀐 것",
      "물에 녹아 있던 백반"
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
    "before": "d667e0dfeec3372d"
  },
  "40": {
    "prompt": "같은 종류의 갈색 설탕물을 색으로 비교해요. 알맞은 관찰 방법을 고르세요.",
    "answer": "①",
    "explanation": "컵의 모양과 보는 깊이, 비추는 빛을 같게 맞추어요. 관찰 조건이 다르면 진하기가 같아도 색이 다르게 보일 수 있어요.",
    "misconception": "색을 비교할 때 깊이·용기·조명 등 관찰 조건도 살펴요.",
    "form": "choice",
    "choices": [
      "같은 모양의 컵에 같은 깊이로 담고 같은 빛에서 본다.",
      "한 컵은 얕게, 다른 컵은 깊게 담아 비교한다.",
      "한 컵은 밝은 곳, 다른 컵은 어두운 곳에서 본다."
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
    "before": "1189949f4a69d691"
  },
  "46": {
    "prompt": "소개 자료는 만들었지만 아직 친구에게 보여 주지 않았어요. 다음에 할 일을 고르세요.",
    "answer": "②",
    "explanation": "완성한 자료를 친구에게 실제로 보여 주고 설명해요. 질문을 듣고 용액의 쓰임과 필요성을 더 알기 쉽게 고쳐 소개해요.",
    "misconception": "자료를 만드는 일과 친구에게 실제로 소개하는 일을 구별해요.",
    "form": "choice",
    "choices": [
      "자료를 숨겨 두고 소개도 마쳤다고 적는다.",
      "친구에게 자료를 보여 주고 설명한다.",
      "받지 않은 친구의 질문을 미리 지어 적는다."
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
    "before": "f3ed629588b8652b"
  },
  "49": {
    "prompt": "A는 설탕이 다 녹는 데 걸린 시간을, B는 설탕을 더 넣고 충분히 저어도 남는 고체를 살폈어요. 알아본 것을 골라 쓰세요. A: (1)[ ] / B: (2)[ ]. 보기: 녹는 빠르기·녹을 수 있는 양",
    "answer": "녹는 빠르기 / 녹을 수 있는 양",
    "explanation": "A는 녹는 데 걸린 시간으로 빠르기를 비교해요. B는 같은 조건에서 충분히 저어도 남는 고체를 살펴 녹을 수 있는 양을 알아보아요.",
    "misconception": "시간을 잰 비교와 남은 고체로 양을 살핀 비교를 구별해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "녹는 빠르기",
            "빠르기",
            "녹는 시간",
            "녹는빠르기",
            "녹는시간"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "녹을 수 있는 양",
            "녹는 양",
            "양",
            "녹을수있는양",
            "녹는양"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "a9deaaed8017892f"
  },
  "52": {
    "prompt": "처음에는 컵·물·설탕·약포지를 함께 쟀고, 나중에는 컵·설탕물만 쟀어요. 같은 물건을 모두 비교하려면 무엇을 다시 올려야 할까요?",
    "answer": "빈 약포지",
    "explanation": "처음 함께 쟀던 빈 약포지도 다시 올려요. 설탕을 녹이기 전과 후에 같은 물건 전체의 무게를 비교해야 해요.",
    "misconception": "나중에 빠진 빈 약포지를 다시 올리도록 해요.",
    "form": "short",
    "required": [
      "알맞은 낱말 또는 수치"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "빈 약포지",
        "빈약포지",
        "약포지",
        "처음 사용한 빈 약포지",
        "처음사용한빈약포지",
        "처음 사용한 약포지"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "ec317c03dd5fb24d"
  },
  "54": {
    "prompt": "A에는 큰 토마토를, B에는 작은 토마토를 넣었어요. 뜨는 정도로 설탕물의 진하기를 비교할 방법을 고르세요.",
    "answer": "③",
    "explanation": "같은 물체 하나를 두 설탕물에 차례로 넣어 뜨는 정도를 비교해요. 물체가 서로 다르면 물체의 크기나 무게 차이도 영향을 줄 수 있어요.",
    "misconception": "서로 다른 크기의 물체로 진하기를 바로 비교하지 않아요.",
    "form": "choice",
    "choices": [
      "서로 다른 토마토를 그대로 쓴다.",
      "한 컵에만 토마토를 두 개 넣는다.",
      "같은 물체 하나를 두 설탕물에 차례로 넣는다."
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
    "before": "7634eb0b9b13c2e5"
  },
  "56": {
    "prompt": "친구가 “그림에서 어느 부분이 용액인지 모르겠어.”라고 했어요. 더할 표시를 고르세요.",
    "answer": "①",
    "explanation": "용액인 부분을 가리키는 이름표를 붙이면 친구가 알아보기 쉬워요. 친구의 질문에 맞춰 표시를 고친 뒤 다시 소개해요.",
    "misconception": "친구의 질문에 맞게 용액인 부분을 가리키는 표시를 더해요.",
    "form": "choice",
    "choices": [
      "용액인 부분을 가리키는 이름표",
      "내용과 관계없는 장식 무늬",
      "친구가 읽을 수 없는 작은 글씨"
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
    "before": "b3f1083c1cc4868a"
  },
  "72": {
    "prompt": "물 100 g에 설탕 10 g을 모두 녹였어요. 흘리거나 증발한 것은 없어요. 설탕물의 무게는 몇 g일까요?",
    "answer": "110 g",
    "explanation": "100+10=110(g)이에요. 설탕이 물에 녹아도 없어지지 않고 물과 함께 남아 있어요.",
    "misconception": "녹아 보이지 않는 설탕도 용액의 무게에 포함해요.",
    "form": "short",
    "required": [
      "알맞은 낱말 또는 수치"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "110",
        "110g",
        "110 g",
        "110그램",
        "110 그램"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "e2884ed494b3101e"
  },
  "76": {
    "prompt": "두 컵의 설탕 5 g이 모두 녹았지만 저은 쪽이 먼저 녹았어요. 이번에 달라진 것은 녹는 (1)[ ]이에요. 보기: 시간·양",
    "answer": "시간",
    "explanation": "두 컵 모두 설탕5g이 녹았고, 녹는 데 걸린 시간이 달랐어요. 먼저 녹았다는 사실만으로 더 많이 녹는다고 말하지 않아요.",
    "misconception": "모두 녹은 양이 같아도 녹는 시간은 다를 수 있어요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "시간",
            "녹는 시간",
            "녹는시간",
            "걸린 시간",
            "걸린시간"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "c81a97940cc6773e"
  },
  "80": {
    "prompt": "두 설탕물은 물의 양도 설탕의 양도 달라요. 진하기를 비교하려면 무엇을 함께 알아야 할까요?",
    "answer": "②",
    "explanation": "물의 양과 실제로 녹은 설탕의 양을 함께 알아야 진하기를 비교할 수 있어요. 넣은 설탕이 모두 녹았는지도 확인해요.",
    "misconception": "물의 양과 녹은 설탕의 양을 함께 살펴요.",
    "form": "choice",
    "choices": [
      "넣은 설탕의 양만",
      "물의 양과 물에 녹은 설탕의 양",
      "두 컵의 겉면 색깔만"
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
    "before": "2dd0bacf58ca8c09"
  },
  "84": {
    "prompt": "진하기가 같은 갈색 설탕물도 보는 깊이가 다르면 색이 달라 보여요. 비교할 때 보는 깊이를 (1)[ ] 맞추어요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "같은 종류의 갈색 설탕물은 같은 관찰 조건에서 색을 비교해요. 보는 깊이나 비추는 빛이 다르면 색이 다르게 보일 수 있어요.",
    "misconception": "같은 진하기라도 보는 깊이가 다르면 색이 달라 보일 수 있어요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같게",
            "동일하게",
            "똑같게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "3bf4922f1e738f01"
  },
  "92": {
    "prompt": "많고 따뜻한 물과 적고 차가운 물을 비교했어요. 온도의 영향만 알아보려면 물의 양을 (1)[ ] 맞추어요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "같은 설탕과 같은 양의 물을 쓰고 물의 온도만 다르게 해야 해요. 물의 양과 온도를 함께 바꾸면 어느 조건의 영향인지 구별하기 어려워요.",
    "misconception": "온도의 영향만 알아보려면 물의 양은 같게 해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같게",
            "동일하게",
            "똑같게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "980aa8f7c5aa68c1"
  },
  "95": {
    "prompt": "친구가 “설명이 어려워.”라고 했어요. 친구가 이해하도록 할 일을 고르세요.",
    "answer": "①",
    "explanation": "친구가 어려워한 부분을 물어보고 쉬운 말과 그림으로 고쳐 다시 설명해요. 자료를 고친 뒤 실제로 소개하는 활동도 해요.",
    "misconception": "의견을 들었다고만 쓰기보다 실제로 설명을 고칠 행동을 말하도록 해요.",
    "form": "choice",
    "choices": [
      "어려운 낱말을 쉬운 말로 바꾸어 다시 설명한다.",
      "내용을 더 작게 써서 읽기 어렵게 만든다.",
      "아직 고치지 않았는데 모두 이해했다고 적는다."
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
    "before": "33042e1c35029d7a"
  }
};
const bankReview={
  "c22-s51-u03-b004": {
    "prompt": "물의 온도에 따라 설탕이 녹는 양을 비교해요. 물의 양은 같게 하고 물의 (1)[ ]만 다르게 해요. 보기: 온도·색깔",
    "answer": "온도",
    "explanation": "같은 설탕과 같은 양의 물을 쓰고 물의 온도만 다르게 해요. 같은 방법으로 충분히 저어 녹을 수 있는 양을 살펴요.",
    "misconception": "물의 양과 온도를 함께 바꾸지 않도록 살펴요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "온도",
            "물의 온도",
            "물의온도"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0f975e5c8fa0b55a"
    ]
  },
  "c22-s51-u03-b028": {
    "prompt": "따뜻한 물에 녹아 있던 백반을 식히자 고체가 보였어요. 이 고체는 어디에 있던 백반일까요?",
    "answer": "③",
    "explanation": "물에 녹아 있던 백반 일부가 식으면서 다시 고체로 나온 거예요. 눈에 보이지 않았을 때에도 물속에 녹아 있었어요.",
    "misconception": "새로 생긴 물질이나 얼음이 아니라 녹아 있던 백반임을 짚어요.",
    "form": "choice",
    "choices": [
      "공기에서 새로 생긴 백반",
      "컵이 백반으로 바뀐 것",
      "물에 녹아 있던 백반"
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
      "9ed08474745227e6"
    ]
  },
  "c22-s51-u03-b040": {
    "prompt": "같은 종류의 갈색 설탕물을 색으로 비교해요. 알맞은 관찰 방법을 고르세요.",
    "answer": "①",
    "explanation": "컵의 모양과 보는 깊이, 비추는 빛을 같게 맞추어요. 관찰 조건이 다르면 진하기가 같아도 색이 다르게 보일 수 있어요.",
    "misconception": "색을 비교할 때 깊이·용기·조명 등 관찰 조건도 살펴요.",
    "form": "choice",
    "choices": [
      "같은 모양의 컵에 같은 깊이로 담고 같은 빛에서 본다.",
      "한 컵은 얕게, 다른 컵은 깊게 담아 비교한다.",
      "한 컵은 밝은 곳, 다른 컵은 어두운 곳에서 본다."
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
      "8e374618bd010662"
    ]
  },
  "c22-s51-u03-b046": {
    "prompt": "소개 자료는 만들었지만 아직 친구에게 보여 주지 않았어요. 다음에 할 일을 고르세요.",
    "answer": "②",
    "explanation": "완성한 자료를 친구에게 실제로 보여 주고 설명해요. 질문을 듣고 용액의 쓰임과 필요성을 더 알기 쉽게 고쳐 소개해요.",
    "misconception": "자료를 만드는 일과 친구에게 실제로 소개하는 일을 구별해요.",
    "form": "choice",
    "choices": [
      "자료를 숨겨 두고 소개도 마쳤다고 적는다.",
      "친구에게 자료를 보여 주고 설명한다.",
      "받지 않은 친구의 질문을 미리 지어 적는다."
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
      "895e7046e0c16108"
    ]
  },
  "c22-s51-u03-b049": {
    "prompt": "A는 설탕이 다 녹는 데 걸린 시간을, B는 설탕을 더 넣고 충분히 저어도 남는 고체를 살폈어요. 알아본 것을 골라 쓰세요. A: (1)[ ] / B: (2)[ ]. 보기: 녹는 빠르기·녹을 수 있는 양",
    "answer": "녹는 빠르기 / 녹을 수 있는 양",
    "explanation": "A는 녹는 데 걸린 시간으로 빠르기를 비교해요. B는 같은 조건에서 충분히 저어도 남는 고체를 살펴 녹을 수 있는 양을 알아보아요.",
    "misconception": "시간을 잰 비교와 남은 고체로 양을 살핀 비교를 구별해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "녹는 빠르기",
            "빠르기",
            "녹는 시간",
            "녹는빠르기",
            "녹는시간"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "녹을 수 있는 양",
            "녹는 양",
            "양",
            "녹을수있는양",
            "녹는양"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "7a5c098cb69f2dd2"
    ]
  },
  "c22-s51-u03-b052": {
    "prompt": "처음에는 컵·물·설탕·약포지를 함께 쟀고, 나중에는 컵·설탕물만 쟀어요. 같은 물건을 모두 비교하려면 무엇을 다시 올려야 할까요?",
    "answer": "빈 약포지",
    "explanation": "처음 함께 쟀던 빈 약포지도 다시 올려요. 설탕을 녹이기 전과 후에 같은 물건 전체의 무게를 비교해야 해요.",
    "misconception": "나중에 빠진 빈 약포지를 다시 올리도록 해요.",
    "form": "short",
    "required": [
      "알맞은 낱말 또는 수치"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "빈 약포지",
        "빈약포지",
        "약포지",
        "처음 사용한 빈 약포지",
        "처음사용한빈약포지",
        "처음 사용한 약포지"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "a794d65cc51c3b9a"
    ]
  },
  "c22-s51-u03-b054": {
    "prompt": "A에는 큰 토마토를, B에는 작은 토마토를 넣었어요. 뜨는 정도로 설탕물의 진하기를 비교할 방법을 고르세요.",
    "answer": "③",
    "explanation": "같은 물체 하나를 두 설탕물에 차례로 넣어 뜨는 정도를 비교해요. 물체가 서로 다르면 물체의 크기나 무게 차이도 영향을 줄 수 있어요.",
    "misconception": "서로 다른 크기의 물체로 진하기를 바로 비교하지 않아요.",
    "form": "choice",
    "choices": [
      "서로 다른 토마토를 그대로 쓴다.",
      "한 컵에만 토마토를 두 개 넣는다.",
      "같은 물체 하나를 두 설탕물에 차례로 넣는다."
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
      "428380da8cc0fad4"
    ]
  },
  "c22-s51-u03-b056": {
    "prompt": "친구가 “그림에서 어느 부분이 용액인지 모르겠어.”라고 했어요. 더할 표시를 고르세요.",
    "answer": "①",
    "explanation": "용액인 부분을 가리키는 이름표를 붙이면 친구가 알아보기 쉬워요. 친구의 질문에 맞춰 표시를 고친 뒤 다시 소개해요.",
    "misconception": "친구의 질문에 맞게 용액인 부분을 가리키는 표시를 더해요.",
    "form": "choice",
    "choices": [
      "용액인 부분을 가리키는 이름표",
      "내용과 관계없는 장식 무늬",
      "친구가 읽을 수 없는 작은 글씨"
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
      "1b445288abfe437a"
    ]
  },
  "c22-s51-u03-b072": {
    "prompt": "물 100 g에 설탕 10 g을 모두 녹였어요. 흘리거나 증발한 것은 없어요. 설탕물의 무게는 몇 g일까요?",
    "answer": "110 g",
    "explanation": "100+10=110(g)이에요. 설탕이 물에 녹아도 없어지지 않고 물과 함께 남아 있어요.",
    "misconception": "녹아 보이지 않는 설탕도 용액의 무게에 포함해요.",
    "form": "short",
    "required": [
      "알맞은 낱말 또는 수치"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "110",
        "110g",
        "110 g",
        "110그램",
        "110 그램"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "aec113f617273708"
    ]
  },
  "c22-s51-u03-b076": {
    "prompt": "두 컵의 설탕 5 g이 모두 녹았지만 저은 쪽이 먼저 녹았어요. 이번에 달라진 것은 녹는 (1)[ ]이에요. 보기: 시간·양",
    "answer": "시간",
    "explanation": "두 컵 모두 설탕5g이 녹았고, 녹는 데 걸린 시간이 달랐어요. 먼저 녹았다는 사실만으로 더 많이 녹는다고 말하지 않아요.",
    "misconception": "모두 녹은 양이 같아도 녹는 시간은 다를 수 있어요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "시간",
            "녹는 시간",
            "녹는시간",
            "걸린 시간",
            "걸린시간"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "44207741a7e54197"
    ]
  },
  "c22-s51-u03-b080": {
    "prompt": "두 설탕물은 물의 양도 설탕의 양도 달라요. 진하기를 비교하려면 무엇을 함께 알아야 할까요?",
    "answer": "②",
    "explanation": "물의 양과 실제로 녹은 설탕의 양을 함께 알아야 진하기를 비교할 수 있어요. 넣은 설탕이 모두 녹았는지도 확인해요.",
    "misconception": "물의 양과 녹은 설탕의 양을 함께 살펴요.",
    "form": "choice",
    "choices": [
      "넣은 설탕의 양만",
      "물의 양과 물에 녹은 설탕의 양",
      "두 컵의 겉면 색깔만"
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
      "703ce490b2485666"
    ]
  },
  "c22-s51-u03-b084": {
    "prompt": "진하기가 같은 갈색 설탕물도 보는 깊이가 다르면 색이 달라 보여요. 비교할 때 보는 깊이를 (1)[ ] 맞추어요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "같은 종류의 갈색 설탕물은 같은 관찰 조건에서 색을 비교해요. 보는 깊이나 비추는 빛이 다르면 색이 다르게 보일 수 있어요.",
    "misconception": "같은 진하기라도 보는 깊이가 다르면 색이 달라 보일 수 있어요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같게",
            "동일하게",
            "똑같게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "52ffd1eb7ccb4dc5"
    ]
  },
  "c22-s51-u03-b092": {
    "prompt": "많고 따뜻한 물과 적고 차가운 물을 비교했어요. 온도의 영향만 알아보려면 물의 양을 (1)[ ] 맞추어요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "같은 설탕과 같은 양의 물을 쓰고 물의 온도만 다르게 해야 해요. 물의 양과 온도를 함께 바꾸면 어느 조건의 영향인지 구별하기 어려워요.",
    "misconception": "온도의 영향만 알아보려면 물의 양은 같게 해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "같게",
            "동일하게",
            "똑같게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "21eb383a5a54b7e0"
    ]
  },
  "c22-s51-u03-b095": {
    "prompt": "친구가 “설명이 어려워.”라고 했어요. 친구가 이해하도록 할 일을 고르세요.",
    "answer": "①",
    "explanation": "친구가 어려워한 부분을 물어보고 쉬운 말과 그림으로 고쳐 다시 설명해요. 자료를 고친 뒤 실제로 소개하는 활동도 해요.",
    "misconception": "의견을 들었다고만 쓰기보다 실제로 설명을 고칠 행동을 말하도록 해요.",
    "form": "choice",
    "choices": [
      "어려운 낱말을 쉬운 말로 바꾸어 다시 설명한다.",
      "내용을 더 작게 써서 읽기 어렵게 만든다.",
      "아직 고치지 않았는데 모두 이해했다고 적는다."
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
      "2d5f305e32bff084"
    ]
  }
};
const questionTitles={};
const studyMethodBefore="개념과 예제를 읽고 문제를 풀어 보아요. 오른쪽에는 핵심 정리, 더 알아보기, 내가 정리할 것이 있어요. 준비 점검에서는 지금 알고 있는 내용을 떠올려요.";
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
function initialSolutionMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:SOLUTION_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:SOLUTION_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),solutionMixedResponse:SOLUTION_MIXED_VERSION,contentVersion:SOLUTION_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withSolutionMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=solutionMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
function initialWithSolutionMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),solutionMixedResponse:SOLUTION_MIXED_VERSION,contentVersion:SOLUTION_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(e.form){result.bookResponseForm=e.form;result.formLabel=e.form==='short'?'짧게 쓰기':labels[e.form];delete result.lines;}return result;});
 const revisePage=p=>{const first=p.blocks.flatMap(b=>b.ids||[])[0],n=Number(first?.slice(-3));return{...p,title:questionTitles[n]||p.title,blocks:p.blocks.map(b=>b.type==='text'&&b.text===studyMethodBefore?{...b,text:'개념과 예제로 용해와 용액을 알아보아요. 고르기·빈칸·짧은 답으로 확인하고, 까닭은 짧게 설명해요. 직접 관찰하고 무게를 재며, 생활 속 용액의 쓰임을 조사해 소개해요.'}:b)};};
 const pages=w.pages.map(revisePage),teacherStudentPages=w.teacherStudentPages.map(revisePage),teacherPages=w.teacherPages;
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.form==='written'?'교사 확인':q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,teacherPages,figures};books.set(w,result);return result;
}

// Refine choices without replacing any saved responses from the first mixed-response edition.
export const SOLUTION_CHOICE_VERSION='20261124-solution-choice-meaning';
const choiceReview={
  "28": {
    "prompt": "백반을 따뜻한 물에 모두 녹인 뒤 식히자 고체가 보였어요. 이 고체가 생긴 까닭을 고르세요.",
    "choices": [
      "처음부터 녹지 않은 백반이 그대로 남아 있었다.",
      "녹아 있던 백반이 식으면서 다른 물질로 바뀌었다.",
      "녹아 있던 백반 일부가 다시 고체로 나왔다."
    ],
    "explanation": "따뜻한 물에 모두 녹아 있던 백반 일부가 식으면서 다시 고체로 나왔어요. 물에 녹아 보이지 않을 때에도 백반은 남아 있었어요.",
    "misconception": "처음부터 녹지 않은 고체와 식힌 뒤 다시 나온 고체를 구별해요.",
    "bookBefore": "f7c253e7f78e28b9",
    "bankBefore": [
      "edcd5d9b586ef415"
    ]
  },
  "46": {
    "prompt": "용액의 쓰임을 소개하는 자료를 만들었어요. 친구들과 자료를 나누려면 다음에 무엇을 해야 할까요?",
    "choices": [
      "조사한 내용을 자료에 더 적는다.",
      "자료를 보여 주며 내용을 설명한다.",
      "자료의 제목과 글씨 크기를 고친다."
    ],
    "explanation": "자료를 친구에게 보여 주고 내용을 설명하며 나누어요. 내용을 더 적거나 제목을 고치는 것은 자료를 만드는 과정이에요.",
    "misconception": "자료를 만드는 일과 친구에게 자료를 보여 주며 설명하는 일을 구별해요.",
    "bookBefore": "4cb1d629bf003e47",
    "bankBefore": [
      "bb895906c33d64d0"
    ]
  },
  "56": {
    "choices": [
      "용액 부분을 가리키는 이름표",
      "컵에 담긴 양을 나타내는 눈금",
      "설탕을 넣은 순서를 나타내는 번호"
    ],
    "explanation": "용액 부분을 가리키는 이름표를 붙여요. 눈금은 담긴 양을, 번호는 넣은 순서를 알려 주지만 어느 부분이 용액인지는 바로 알려 주지 못해요.",
    "misconception": "친구가 모르는 부분에 맞는 표시를 골라요.",
    "bookBefore": "00d8b959a3cd0fd3",
    "bankBefore": [
      "2e08c8bcc6194072"
    ]
  },
  "95": {
    "prompt": "친구가 “이 낱말 뜻을 모르겠어.”라고 했어요. 설명을 어떻게 고치면 좋을까요?",
    "choices": [
      "그 낱말을 쉬운 말로 풀어 설명한다.",
      "그 낱말을 자료의 맨 앞에 옮겨 쓴다.",
      "그 낱말을 글씨 크기만 키워 다시 쓴다."
    ],
    "explanation": "친구가 모르는 낱말의 뜻을 쉬운 말로 풀어 설명해요. 위치나 글씨 크기만 바꾸면 낱말의 뜻을 알기 어려워요.",
    "misconception": "낱말의 뜻을 모르는 경우와 글씨를 찾거나 읽기 어려운 경우를 구별해요.",
    "bookBefore": "e587858c75178caa",
    "bankBefore": [
      "2ccd6e439fc11111"
    ]
  }
};
const choiceBooks=new WeakMap(),choiceRows=new WeakMap();
function withChoiceQuestion(q,e){
 if(choiceRows.has(q))return choiceRows.get(q);
 const result={...q,...Object.fromEntries(['prompt','choices','explanation','misconception'].filter(k=>Object.hasOwn(e,k)).map(k=>[k,clone(e[k])])),solutionChoiceReview:SOLUTION_CHOICE_VERSION,contentVersion:SOLUTION_CHOICE_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
 if(q.diagnosticOverride)result.diagnosticOverride={...q.diagnosticOverride,version:SOLUTION_CHOICE_VERSION};
 choiceRows.set(q,result);return result;
}
export function solutionChoiceItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const n=Number(q.id?.match(/-b(\d+)$/)?.[1]),e=choiceReview[n];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.bankBefore.includes(fingerprint(q)))return q;changed=true;return withChoiceQuestion(q,e);});return changed?next:rows;
}
export function withSolutionChoiceWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!=='6a5a360dbaf2123f')return w;if(choiceBooks.has(w))return choiceBooks.get(w);
 const questions=w.questions.map(q=>{const e=choiceReview[q.no];return e&&fingerprint(q)===e.bookBefore?withChoiceQuestion(q,e):q;});
 const result={...w,questions};choiceBooks.set(w,result);return result;
}
export function solutionMixedItems(rows,u){return solutionChoiceItems(initialSolutionMixedItems(rows,u),u);}
export function withSolutionMixedWorkbook(w){return withSolutionChoiceWorkbook(initialWithSolutionMixedWorkbook(w));}
