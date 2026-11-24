// Use brief responses for temperature and heat transfer; retain real measurements and construction.
export const HEAT_MIXED_VERSION='20261124-heat-mixed-responses';
const unit='c22-s52-u02',prior='bd7d916259e5cd58';
const review={
  "4": {
    "prompt": "주위가 더 따뜻한 곳에서 차가운 물병을 수건으로 감싸면 어떨까요? 예상과 까닭을 짝과 말하거나 한 줄로 쓰세요.",
    "answer": "더 천천히 따뜻해질 것 같아요. 수건이 들어오는 열을 줄이기 때문이에요.",
    "explanation": "아직 비교하기 전의 생각이에요. 다른 예상도 까닭과 함께 말할 수 있어요. 뒤에서 같은 조건으로 직접 비교해 확인해요.",
    "misconception": "예상을 이미 측정한 결과처럼 쓰지 않아요.",
    "required": [
      "처음 예상과 그 까닭의 연결"
    ],
    "lines": 1,
    "before": "83918cbd5a541c6f"
  },
  "8": {
    "prompt": "같은 방의 금속과 나무가 다르게 차갑게 느껴져요. 실제 온도가 다른지 알아볼 방법을 고르세요.",
    "answer": "②",
    "explanation": "느낌만으로 실제 온도를 정하지 않아요. 온도계를 알맞게 사용하여 각각의 온도를 재고 비교해요.",
    "misconception": "더 차갑게 느껴진 것이 반드시 온도도 더 낮은 것은 아니에요.",
    "form": "choice",
    "choices": [
      "손으로 더 차가운 쪽의 온도가 낮다고 정한다.",
      "온도계로 각각의 온도를 재어 비교한다.",
      "사진에서 색이 어두운 쪽의 온도가 낮다고 정한다."
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
    "before": "35033cf08c92a4de"
  },
  "14": {
    "prompt": "0·2·4분에 A는 52·47·43℃, B는 22·27·30℃였어요. 온도 변화를 보기에서 골라 쓰세요. A: (1)[ ] / B: (2)[ ]. 보기: 내려감·올라감",
    "answer": "내려감 / 올라감",
    "explanation": "시간이 지나며 A의 온도는 내려가고 B의 온도는 올라갔어요. 표에서 실제로 잰 때와 값을 짝지어 읽어요.",
    "misconception": "관찰하지 않은 10분 온도를 측정값으로 채우지 않아요.",
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
            "내려감",
            "내려가요",
            "내려간다",
            "낮아짐",
            "낮아져요",
            "감소"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "올라감",
            "올라가요",
            "올라간다",
            "높아짐",
            "높아져요",
            "증가"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "4c75d9da8b321ae8"
  },
  "20": {
    "prompt": "재료가 다른 띠의 색 변화를 비교해요. 띠의 크기는 같아요. 표시 스티커를 붙일 위치를 고르세요.",
    "answer": "③",
    "explanation": "데우는 쪽에서 스티커까지의 거리를 같게 해요. 비교하는 재료 외에 띠의 크기와 데우는 방법·관찰 시간도 맞추어요.",
    "misconception": "표시의 거리가 다른 결과를 재료 차이만으로 설명하지 않아요.",
    "form": "choice",
    "choices": [
      "각 띠에서 눈에 잘 띄는 곳을 따로 고른다.",
      "한 띠는 데우는 곳 가까이, 다른 띠는 멀리 붙인다.",
      "두 띠 모두 데우는 쪽에서 같은 거리에 붙인다."
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
    "before": "729895fb6c99e9c9"
  },
  "32": {
    "prompt": "공기가 움직이는 방에서 선풍기도 켰어요. 가열 말고 공기를 움직인 기구는 무엇일까요?",
    "answer": "선풍기",
    "explanation": "선풍기 바람도 공기를 움직여요. 공기가 움직였다는 모습만으로 가열에 의한 움직임이라고 정하지 않아요.",
    "misconception": "선풍기가 만든 흐름을 모두 자연스러운 대류라고 하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "선풍기",
        "선풍기 바람",
        "선풍기의 바람",
        "팬"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "6d44e166207625f4"
  },
  "44": {
    "prompt": "주위가 얼음보다 따뜻해요. 얼음을 천으로 감쌀 때 줄이려는 열의 이동 방향을 고르세요.",
    "answer": "①",
    "explanation": "따뜻한 주위에서 차가운 얼음으로 열이 들어와요. 천은 들어오는 열을 줄여 녹는 속도를 늦추는 데 도움을 주어요.",
    "misconception": "천으로 감쌌다는 이유만으로 얼음을 직접 데운다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "따뜻한 주위 → 얼음",
      "얼음 → 따뜻한 주위",
      "얼음 → 더 차가운 얼음"
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
    "before": "7f2b375d4ca294df"
  },
  "50": {
    "prompt": "뚜껑 틈을 줄일 때 물의 양도 늘렸어요. 틈을 줄인 효과만 비교하려면 다음에는 두 컵의 물의 양을 (1)[ ] 해요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "물의 양도 달라지면 온도 변화가 틈 때문인지 알아보기 어려워요. 같은 양과 처음 온도의 물로 틈만 다르게 비교해요.",
    "misconception": "틈과 물의 양을 함께 바꾼 결과를 틈만의 효과로 보지 않아요.",
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
    "before": "9d3cd6c2d8cf80e4"
  },
  "54": {
    "prompt": "2분에는 44℃, 6분에는 38℃였어요. 4분에는 재지 않았는데 41℃라고 적었어요. 4분 칸은 (1)[ ]으로 고쳐요. 보기: 재지 않음·정확히 41℃",
    "answer": "재지 않음",
    "explanation": "실제로 재지 않은 값은 앞뒤 값의 중간으로 채우지 않아요. 잰 값은 그대로 두고 4분에는 재지 않았다고 표시해요.",
    "misconception": "예상한 값을 실제로 잰 값처럼 적지 않아요.",
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
            "재지 않음",
            "재지않음",
            "측정하지 않음",
            "측정하지않음",
            "미측정",
            "재지 못함"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "75ececaadb5fb984"
  },
  "59": {
    "prompt": "햇빛을 받은 금속 컵의 데워진 부분에서 옆 부분으로 열이 전달돼요. 금속을 따라 전달되는 이 구간의 주요 열 이동 방식은 무엇일까요?",
    "answer": "전도",
    "explanation": "고체인 금속 컵을 따라 데워진 부분에서 옆 부분으로 전달되는 구간은 전도로 설명해요. 햇빛이 컵에 도달하는 과정과 구별해요.",
    "misconception": "한 장면에서 오직 한 방식만 일어난다고 하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "전도",
        "열전도",
        "열 전도"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "68042fe9912d3a03"
  },
  "62": {
    "prompt": "몸은 주위보다 따뜻하고, 보냉 가방의 물은 주위보다 차가워요. 담요와 보냉 가방이 줄이려는 열의 이동 방향을 고르세요.",
    "answer": "③",
    "explanation": "담요는 따뜻한 몸에서 주위로 나가는 열을, 보냉 가방은 따뜻한 주위에서 차가운 물로 들어오는 열을 줄여요. 단열의 방향은 안팎의 온도를 보고 생각해요.",
    "misconception": "단열은 열의 이동을 줄이는 것이며 새 열이나 찬 기운을 만드는 것은 아니에요.",
    "form": "choice",
    "choices": [
      "담요: 몸 → 주위 / 보냉 가방: 물 → 주위",
      "담요: 주위 → 몸 / 보냉 가방: 물 → 주위",
      "담요: 몸 → 주위 / 보냉 가방: 주위 → 물"
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
    "before": "18237ee1ca43539b"
  },
  "67": {
    "prompt": "보온 장치를 소개한 뒤 두 컵의 처음 온도가 달랐다는 것을 알았어요. 다음에는 처음 온도를 (1)[ ] 맞추어 비교해요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "처음 온도가 다르면 마지막 온도만으로 보온 효과를 비교하기 어려워요. 물의 양·컵·장소·재는 시간도 맞추어 다시 시험해요.",
    "misconception": "처음 온도가 다른 결과로 재료의 효과만 비교하지 않아요.",
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
    "before": "74c732c611ac6cc8"
  },
  "80": {
    "prompt": "금속 컵 안의 따뜻한 물과 밖의 찬물은 섞이지 않아요. 두 물 사이의 열은 (1)[ ]을 통해 이동해요. 보기: 금속 컵의 벽·이름표의 글씨",
    "answer": "금속 컵의 벽",
    "explanation": "따뜻한 물에서 금속 컵의 벽을 거쳐 바깥의 찬물로 열이 이동해요. 물이 직접 섞이지 않아도 온도가 변할 수 있어요.",
    "misconception": "두 물이 섞이지 않았으니 열도 이동할 수 없다고 하지 않아요.",
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
            "금속 컵의 벽",
            "금속컵의 벽",
            "금속 컵 벽",
            "금속컵 벽",
            "금속 벽",
            "컵의 벽",
            "컵 벽",
            "금속컵"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "c1f0e2a12c6dfb93"
  },
  "84": {
    "prompt": "두 재료를 함께 데웠지만 한쪽은 30초, 다른 쪽은 2분에만 색을 봤어요. 다음에 관찰할 방법을 고르세요.",
    "answer": "②",
    "explanation": "같은 시간에 두 재료를 관찰해야 차이를 비교하기 좋아요. 재료의 크기·표시 위치·데우는 조건도 맞추고 가열은 교사의 시범으로 관찰해요.",
    "misconception": "서로 다른 때의 모습만 보고 재료 차이로 정하지 않아요.",
    "form": "choice",
    "choices": [
      "한쪽은 먼저 보고 다른 쪽은 생각날 때 본다.",
      "같은 시간에 두 재료를 함께 살펴본다.",
      "색이 더 많이 변한 쪽의 기록만 남긴다."
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
    "before": "4604ea777cce1681"
  },
  "89": {
    "prompt": "햇빛이 금속 난간에 도달하는 과정은 주로 (1)[ ], 데워진 곳에서 금속을 따라 옆으로 전달되는 과정은 주로 (2)[ ]로 설명해요. 보기: 전도·대류·복사",
    "answer": "복사 / 전도",
    "explanation": "햇빛으로 난간에 에너지가 전달되는 과정은 복사, 금속을 따라 전달되는 구간은 전도로 나누어 설명해요. 한 장면에도 여러 이동 방식이 있을 수 있어요.",
    "misconception": "빛으로 전달되는 것과 금속을 따라 전달되는 것을 구별해요.",
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
            "복사",
            "열복사",
            "열 복사"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "전도",
            "열전도",
            "열 전도"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "e41011bcfe6d0cbe"
  },
  "93": {
    "prompt": "같은 컵·물의 양·장소에서 처음은 모두 44℃, 10분 뒤 A는 36℃, B는 39℃예요. 덜 식은 것은 (1)[ ]이고, 10분 뒤 온도는 (2)[ ]℃예요.",
    "answer": "B / 39",
    "explanation": "처음 온도가 같고 10분 뒤 B의 온도가 39℃로 더 높아요. A는 8℃, B는 5℃ 내려가 이 조건에서는 B가 덜 식었어요.",
    "misconception": "한 번의 결과만으로 언제나 B가 가장 좋다고 하지 않아요.",
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
            "B",
            "비",
            "B 컵",
            "컵 B"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "39",
            "39℃",
            "39 ℃",
            "39도"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "f26d531f1a383aad"
  },
  "102": {
    "prompt": "친구가 “단열하면 물의 온도가 영원히 변하지 않아.”라고 말했어요. 알맞게 고친 설명을 고르세요.",
    "answer": "①",
    "explanation": "실제 단열 장치는 열의 이동을 줄이지만 완전히 막지는 못해요. 온도 변화가 느려지는지 같은 조건에서 측정하고 비교해요.",
    "misconception": "단열로 열의 이동이 완전히 없어졌다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "단열은 열의 이동을 줄여 온도 변화를 늦출 수 있다.",
      "단열하면 주변과의 열 이동이 언제나 완전히 멈춘다.",
      "단열 재료는 어떤 물이든 저절로 계속 뜨겁게 만든다."
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
    "before": "b12764d6af192388"
  }
};
const bankReview={
  "c22-s52-u02-b004": {
    "prompt": "주위가 더 따뜻한 곳에서 차가운 물병을 수건으로 감싸면 어떨까요? 예상과 까닭을 짝과 말하거나 한 줄로 쓰세요.",
    "answer": "더 천천히 따뜻해질 것 같아요. 수건이 들어오는 열을 줄이기 때문이에요.",
    "explanation": "아직 비교하기 전의 생각이에요. 다른 예상도 까닭과 함께 말할 수 있어요. 뒤에서 같은 조건으로 직접 비교해 확인해요.",
    "misconception": "예상을 이미 측정한 결과처럼 쓰지 않아요.",
    "required": [
      "처음 예상과 그 까닭의 연결"
    ],
    "lines": 1,
    "before": [
      "e48cf5db8122071d"
    ]
  },
  "c22-s52-u02-b008": {
    "prompt": "같은 방의 금속과 나무가 다르게 차갑게 느껴져요. 실제 온도가 다른지 알아볼 방법을 고르세요.",
    "answer": "②",
    "explanation": "느낌만으로 실제 온도를 정하지 않아요. 온도계를 알맞게 사용하여 각각의 온도를 재고 비교해요.",
    "misconception": "더 차갑게 느껴진 것이 반드시 온도도 더 낮은 것은 아니에요.",
    "form": "choice",
    "choices": [
      "손으로 더 차가운 쪽의 온도가 낮다고 정한다.",
      "온도계로 각각의 온도를 재어 비교한다.",
      "사진에서 색이 어두운 쪽의 온도가 낮다고 정한다."
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
      "514c48e7f71d2141"
    ]
  },
  "c22-s52-u02-b014": {
    "prompt": "0·2·4분에 A는 52·47·43℃, B는 22·27·30℃였어요. 온도 변화를 보기에서 골라 쓰세요. A: (1)[ ] / B: (2)[ ]. 보기: 내려감·올라감",
    "answer": "내려감 / 올라감",
    "explanation": "시간이 지나며 A의 온도는 내려가고 B의 온도는 올라갔어요. 표에서 실제로 잰 때와 값을 짝지어 읽어요.",
    "misconception": "관찰하지 않은 10분 온도를 측정값으로 채우지 않아요.",
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
            "내려감",
            "내려가요",
            "내려간다",
            "낮아짐",
            "낮아져요",
            "감소"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "올라감",
            "올라가요",
            "올라간다",
            "높아짐",
            "높아져요",
            "증가"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "92aebc6465b5bd46"
    ]
  },
  "c22-s52-u02-b020": {
    "prompt": "재료가 다른 띠의 색 변화를 비교해요. 띠의 크기는 같아요. 표시 스티커를 붙일 위치를 고르세요.",
    "answer": "③",
    "explanation": "데우는 쪽에서 스티커까지의 거리를 같게 해요. 비교하는 재료 외에 띠의 크기와 데우는 방법·관찰 시간도 맞추어요.",
    "misconception": "표시의 거리가 다른 결과를 재료 차이만으로 설명하지 않아요.",
    "form": "choice",
    "choices": [
      "각 띠에서 눈에 잘 띄는 곳을 따로 고른다.",
      "한 띠는 데우는 곳 가까이, 다른 띠는 멀리 붙인다.",
      "두 띠 모두 데우는 쪽에서 같은 거리에 붙인다."
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
      "a1671df7d333915d"
    ]
  },
  "c22-s52-u02-b032": {
    "prompt": "공기가 움직이는 방에서 선풍기도 켰어요. 가열 말고 공기를 움직인 기구는 무엇일까요?",
    "answer": "선풍기",
    "explanation": "선풍기 바람도 공기를 움직여요. 공기가 움직였다는 모습만으로 가열에 의한 움직임이라고 정하지 않아요.",
    "misconception": "선풍기가 만든 흐름을 모두 자연스러운 대류라고 하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "선풍기",
        "선풍기 바람",
        "선풍기의 바람",
        "팬"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "4a74757efa24dcfc"
    ]
  },
  "c22-s52-u02-b044": {
    "prompt": "주위가 얼음보다 따뜻해요. 얼음을 천으로 감쌀 때 줄이려는 열의 이동 방향을 고르세요.",
    "answer": "①",
    "explanation": "따뜻한 주위에서 차가운 얼음으로 열이 들어와요. 천은 들어오는 열을 줄여 녹는 속도를 늦추는 데 도움을 주어요.",
    "misconception": "천으로 감쌌다는 이유만으로 얼음을 직접 데운다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "따뜻한 주위 → 얼음",
      "얼음 → 따뜻한 주위",
      "얼음 → 더 차가운 얼음"
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
      "32445a420a441e9c"
    ]
  },
  "c22-s52-u02-b050": {
    "prompt": "뚜껑 틈을 줄일 때 물의 양도 늘렸어요. 틈을 줄인 효과만 비교하려면 다음에는 두 컵의 물의 양을 (1)[ ] 해요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "물의 양도 달라지면 온도 변화가 틈 때문인지 알아보기 어려워요. 같은 양과 처음 온도의 물로 틈만 다르게 비교해요.",
    "misconception": "틈과 물의 양을 함께 바꾼 결과를 틈만의 효과로 보지 않아요.",
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
      "79473205cb1bcb37"
    ]
  },
  "c22-s52-u02-b054": {
    "prompt": "2분에는 44℃, 6분에는 38℃였어요. 4분에는 재지 않았는데 41℃라고 적었어요. 4분 칸은 (1)[ ]으로 고쳐요. 보기: 재지 않음·정확히 41℃",
    "answer": "재지 않음",
    "explanation": "실제로 재지 않은 값은 앞뒤 값의 중간으로 채우지 않아요. 잰 값은 그대로 두고 4분에는 재지 않았다고 표시해요.",
    "misconception": "예상한 값을 실제로 잰 값처럼 적지 않아요.",
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
            "재지 않음",
            "재지않음",
            "측정하지 않음",
            "측정하지않음",
            "미측정",
            "재지 못함"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "5a2257e1dec80ee3"
    ]
  },
  "c22-s52-u02-b059": {
    "prompt": "햇빛을 받은 금속 컵의 데워진 부분에서 옆 부분으로 열이 전달돼요. 금속을 따라 전달되는 이 구간의 주요 열 이동 방식은 무엇일까요?",
    "answer": "전도",
    "explanation": "고체인 금속 컵을 따라 데워진 부분에서 옆 부분으로 전달되는 구간은 전도로 설명해요. 햇빛이 컵에 도달하는 과정과 구별해요.",
    "misconception": "한 장면에서 오직 한 방식만 일어난다고 하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "전도",
        "열전도",
        "열 전도"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "e423ad7575b50fb7"
    ]
  },
  "c22-s52-u02-b062": {
    "prompt": "몸은 주위보다 따뜻하고, 보냉 가방의 물은 주위보다 차가워요. 담요와 보냉 가방이 줄이려는 열의 이동 방향을 고르세요.",
    "answer": "③",
    "explanation": "담요는 따뜻한 몸에서 주위로 나가는 열을, 보냉 가방은 따뜻한 주위에서 차가운 물로 들어오는 열을 줄여요. 단열의 방향은 안팎의 온도를 보고 생각해요.",
    "misconception": "단열은 열의 이동을 줄이는 것이며 새 열이나 찬 기운을 만드는 것은 아니에요.",
    "form": "choice",
    "choices": [
      "담요: 몸 → 주위 / 보냉 가방: 물 → 주위",
      "담요: 주위 → 몸 / 보냉 가방: 물 → 주위",
      "담요: 몸 → 주위 / 보냉 가방: 주위 → 물"
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
      "9b26b5810e7847d3"
    ]
  },
  "c22-s52-u02-b067": {
    "prompt": "보온 장치를 소개한 뒤 두 컵의 처음 온도가 달랐다는 것을 알았어요. 다음에는 처음 온도를 (1)[ ] 맞추어 비교해요. 보기: 같게·다르게",
    "answer": "같게",
    "explanation": "처음 온도가 다르면 마지막 온도만으로 보온 효과를 비교하기 어려워요. 물의 양·컵·장소·재는 시간도 맞추어 다시 시험해요.",
    "misconception": "처음 온도가 다른 결과로 재료의 효과만 비교하지 않아요.",
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
      "424ea35f499b9321"
    ]
  },
  "c22-s52-u02-b080": {
    "prompt": "금속 컵 안의 따뜻한 물과 밖의 찬물은 섞이지 않아요. 두 물 사이의 열은 (1)[ ]을 통해 이동해요. 보기: 금속 컵의 벽·이름표의 글씨",
    "answer": "금속 컵의 벽",
    "explanation": "따뜻한 물에서 금속 컵의 벽을 거쳐 바깥의 찬물로 열이 이동해요. 물이 직접 섞이지 않아도 온도가 변할 수 있어요.",
    "misconception": "두 물이 섞이지 않았으니 열도 이동할 수 없다고 하지 않아요.",
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
            "금속 컵의 벽",
            "금속컵의 벽",
            "금속 컵 벽",
            "금속컵 벽",
            "금속 벽",
            "컵의 벽",
            "컵 벽",
            "금속컵"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "ffe2a596a62601f4"
    ]
  },
  "c22-s52-u02-b084": {
    "prompt": "두 재료를 함께 데웠지만 한쪽은 30초, 다른 쪽은 2분에만 색을 봤어요. 다음에 관찰할 방법을 고르세요.",
    "answer": "②",
    "explanation": "같은 시간에 두 재료를 관찰해야 차이를 비교하기 좋아요. 재료의 크기·표시 위치·데우는 조건도 맞추고 가열은 교사의 시범으로 관찰해요.",
    "misconception": "서로 다른 때의 모습만 보고 재료 차이로 정하지 않아요.",
    "form": "choice",
    "choices": [
      "한쪽은 먼저 보고 다른 쪽은 생각날 때 본다.",
      "같은 시간에 두 재료를 함께 살펴본다.",
      "색이 더 많이 변한 쪽의 기록만 남긴다."
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
      "b7d874917eefa3eb"
    ]
  },
  "c22-s52-u02-b089": {
    "prompt": "햇빛이 금속 난간에 도달하는 과정은 주로 (1)[ ], 데워진 곳에서 금속을 따라 옆으로 전달되는 과정은 주로 (2)[ ]로 설명해요. 보기: 전도·대류·복사",
    "answer": "복사 / 전도",
    "explanation": "햇빛으로 난간에 에너지가 전달되는 과정은 복사, 금속을 따라 전달되는 구간은 전도로 나누어 설명해요. 한 장면에도 여러 이동 방식이 있을 수 있어요.",
    "misconception": "빛으로 전달되는 것과 금속을 따라 전달되는 것을 구별해요.",
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
            "복사",
            "열복사",
            "열 복사"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "전도",
            "열전도",
            "열 전도"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "c54ba276bc92c488"
    ]
  },
  "c22-s52-u02-b093": {
    "prompt": "같은 컵·물의 양·장소에서 처음은 모두 44℃, 10분 뒤 A는 36℃, B는 39℃예요. 덜 식은 것은 (1)[ ]이고, 10분 뒤 온도는 (2)[ ]℃예요.",
    "answer": "B / 39",
    "explanation": "처음 온도가 같고 10분 뒤 B의 온도가 39℃로 더 높아요. A는 8℃, B는 5℃ 내려가 이 조건에서는 B가 덜 식었어요.",
    "misconception": "한 번의 결과만으로 언제나 B가 가장 좋다고 하지 않아요.",
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
            "B",
            "비",
            "B 컵",
            "컵 B"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "39",
            "39℃",
            "39 ℃",
            "39도"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "c37f16e1fc427c3f"
    ]
  },
  "c22-s52-u02-b102": {
    "prompt": "친구가 “단열하면 물의 온도가 영원히 변하지 않아.”라고 말했어요. 알맞게 고친 설명을 고르세요.",
    "answer": "①",
    "explanation": "실제 단열 장치는 열의 이동을 줄이지만 완전히 막지는 못해요. 온도 변화가 느려지는지 같은 조건에서 측정하고 비교해요.",
    "misconception": "단열로 열의 이동이 완전히 없어졌다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "단열은 열의 이동을 줄여 온도 변화를 늦출 수 있다.",
      "단열하면 주변과의 열 이동이 언제나 완전히 멈춘다.",
      "단열 재료는 어떤 물이든 저절로 계속 뜨겁게 만든다."
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
      "b9dc7b3a553ab9a4"
    ]
  }
};
const questionTitles={};
const studyMethodBefore="개념과 예제를 읽고 여러 가지 문제를 풀어 보아요. 실험에서는 온도·시간·조건을 함께 적고, 관찰한 현상을 열의 이동으로 설명해요. 오른쪽에서는 핵심을 정리하고 더 깊은 내용을 알아볼 수 있어요.";
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function heatMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:HEAT_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:HEAT_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),heatMixedResponse:HEAT_MIXED_VERSION,contentVersion:HEAT_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withHeatMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=heatMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withHeatMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),heatMixedResponse:HEAT_MIXED_VERSION,contentVersion:HEAT_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(e.form){result.bookResponseForm=e.form;result.formLabel=e.form==='short'?'짧게 쓰기':labels[e.form];delete result.lines;}return result;});
 const revisePage=p=>{const first=p.blocks.flatMap(b=>b.ids||[])[0],n=Number(first?.slice(-3));return{...p,title:questionTitles[n]||p.title,blocks:p.blocks.map(b=>b.type==='text'&&b.text===studyMethodBefore?{...b,text:'개념과 예제로 온도와 열의 이동을 알아보아요. 고르기·빈칸·짧은 답으로 확인하고, 까닭은 짧게 설명해요. 실험에서 잰 온도는 시간과 함께 표와 그래프에 나타내고, 단열 장치를 만들어 비교해요.'}:b)};};
 const pages=w.pages.map(revisePage),teacherStudentPages=w.teacherStudentPages.map(revisePage),teacherPages=w.teacherPages;
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.form==='written'?'교사 확인':q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,teacherPages,figures};books.set(w,result);return result;
}
